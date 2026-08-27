import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Logo } from "@/components/site/Brand";
import { Stars } from "@/components/site/Stars";
import {
  CATEGORIES,
  DEFAULT_CONTENT,
  clampDuration,
  newId,
  type GalleryItem,
  type Offer,
  type Partner,
  type Product,
  type SiteContent,
  type Testimonial,
} from "@/lib/site-content";
import type { Faq } from "@/lib/assistant-faqs";
import {
  adminLogin,
  deleteQuote,
  getSiteContent,
  listQuotes,
  saveSiteContent,
  updateQuoteStatus,
  uploadMedia,
} from "@/lib/site.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel | Dream Glass Collection" },
      {
        name: "description",
        content:
          "Manage products, gallery, partners, testimonials, offers, assistant answers, brochure, loader and quotes for Dream Glass Collection.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Panel | Dream Glass Collection" },
      { property: "og:description", content: "Content management for the Dream Glass Collection website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const PASS_KEY = "dgc.admin.pass";
const input =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const card = "glass-card space-y-3 p-4 sm:p-5";

const tabs = [
  "Products",
  "Gallery",
  "Partners",
  "Testimonials",
  "Offers",
  "Quotes",
  "Assistant",
  "Brochure",
  "Loader",
  "Story",
  "Social",
  "Contact",
] as const;
type Tab = (typeof tabs)[number];

type QuoteRow = {
  id: string;
  name: string;
  mobile: string;
  city: string | null;
  service: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

/** Upload an image/PDF to the database, or paste a URL as a fallback. */
function MediaField({
  label,
  value,
  passcode,
  accept = "image/*",
  onChange,
}: {
  label: string;
  value: string;
  passcode: string;
  accept?: string;
  onChange: (url: string, filename: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setErr("");
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
        r.onerror = () => reject(new Error("read failed"));
        r.readAsDataURL(file);
      });
      const res = await uploadMedia({
        data: { passcode, filename: file.name, contentType: file.type, base64 },
      });
      onChange(res.url, file.name);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="eyebrow">{label}</span>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {value && accept.startsWith("image") && (
          <img src={value} alt="" className="h-14 w-14 rounded-lg border border-border object-cover" />
        )}
        <label className="btn-ghost cursor-pointer text-foreground">
          {busy ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
              e.target.value = "";
            }}
          />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("", "")} className="text-xs text-muted-foreground underline">
            Clear
          </button>
        )}
      </div>
      <input
        value={value}
        placeholder="…or paste an image/PDF URL"
        onChange={(e) => onChange(e.target.value, "")}
        className={input}
      />
      {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
    </div>
  );
}

function Section({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="btn-ghost text-foreground">
            + Add
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("Products");
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [status, setStatus] = useState("");
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(PASS_KEY);
    if (stored) {
      setPasscode(stored);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    void getSiteContent().then(setContent);
  }, [authed]);

  useEffect(() => {
    if (!authed || tab !== "Quotes") return;
    void listQuotes({ data: { passcode } }).then((r) => setQuotes(r as QuoteRow[]));
  }, [authed, tab, passcode]);

  const set = (patch: Partial<SiteContent>) => setContent((c) => ({ ...c, ...patch }));

  const save = async () => {
    setStatus("Saving…");
    try {
      await saveSiteContent({ data: { passcode, content } });
      setStatus("Saved");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    }
    window.setTimeout(() => setStatus(""), 2500);
  };

  const move = <T,>(list: T[], i: number, dir: -1 | 1): T[] => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return list;
    const next = [...list];
    const a = next[i]!;
    next[i] = next[j]!;
    next[j] = a;
    return next;
  };

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await adminLogin({ data: { passcode: pass } });
              window.sessionStorage.setItem(PASS_KEY, pass);
              setPasscode(pass);
              setAuthed(true);
            } catch {
              setError("Incorrect passcode.");
            }
          }}
          className="glass-card w-full max-w-sm p-8"
        >
          <Logo className="h-14 w-14" />
          <h1 className="mt-6 text-2xl font-semibold">Admin Panel</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter the studio passcode to manage website content.</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setError("");
            }}
            placeholder="Passcode"
            className={input + " mt-6"}
          />
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          <button type="submit" className="btn-primary mt-5 w-full justify-center">
            Unlock
          </button>
          <Link to="/" className="mt-4 block text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Back to website
          </Link>
        </form>
      </main>
    );
  }

  const { assistant, brochure, loader, story, social, contact } = content;

  return (
    <main className="min-h-screen bg-background pb-28">
      <header className="glass-panel sticky top-0 z-40 border-b border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
          <Logo className="h-9 w-9" />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em]">Admin Panel</p>
            <p className="text-[0.6rem] uppercase tracking-[0.32em] text-muted-foreground">Dream Glass Collection</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {status && <span className="text-xs text-primary">{status}</span>}
            <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Site
            </Link>
            <button
              onClick={() => {
                window.sessionStorage.removeItem(PASS_KEY);
                setAuthed(false);
              }}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              Lock
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 pb-3 sm:px-5">
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] ${
                  tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-5">
        {tab === "Products" && (
          <Section
            title="Products"
            onAdd={() =>
              set({
                products: [
                  ...content.products,
                  { id: newId(), title: "New product", cat: CATEGORIES[0], img: "", note: "" },
                ],
              })
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              {content.products.map((p, i) => (
                <div key={p.id} className={card}>
                  <label className="block">
                    <span className="eyebrow">Title</span>
                    <input
                      value={p.title}
                      onChange={(e) => {
                        const next = [...content.products];
                        next[i] = { ...p, title: e.target.value } as Product;
                        set({ products: next });
                      }}
                      className={input}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow">Category</span>
                    <select
                      value={p.cat}
                      onChange={(e) => {
                        const next = [...content.products];
                        next[i] = { ...p, cat: e.target.value };
                        set({ products: next });
                      }}
                      className={input}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="eyebrow">Detail</span>
                    <input
                      value={p.note}
                      onChange={(e) => {
                        const next = [...content.products];
                        next[i] = { ...p, note: e.target.value };
                        set({ products: next });
                      }}
                      className={input}
                    />
                  </label>
                  <MediaField
                    label="Image"
                    value={p.img}
                    passcode={passcode}
                    onChange={(url) => {
                      const next = [...content.products];
                      next[i] = { ...p, img: url };
                      set({ products: next });
                    }}
                  />
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => set({ products: move(content.products, i, -1) })} className="btn-ghost text-foreground">↑</button>
                    <button onClick={() => set({ products: move(content.products, i, 1) })} className="btn-ghost text-foreground">↓</button>
                    <button
                      onClick={() => set({ products: content.products.filter((x) => x.id !== p.id) })}
                      className="ml-auto text-xs uppercase tracking-[0.18em] text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === "Gallery" && (
          <Section
            title="Gallery"
            onAdd={() =>
              set({
                gallery: [
                  ...content.gallery,
                  { id: newId(), title: "New gallery item", cat: CATEGORIES[0], img: "", caption: "" } as GalleryItem,
                ],
              })
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              {content.gallery.map((g, i) => (
                <div key={g.id} className={card}>
                  <label className="block">
                    <span className="eyebrow">Title</span>
                    <input
                      value={g.title}
                      onChange={(e) => {
                        const next = [...content.gallery];
                        next[i] = { ...g, title: e.target.value };
                        set({ gallery: next });
                      }}
                      className={input}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow">Category</span>
                    <select
                      value={g.cat}
                      onChange={(e) => {
                        const next = [...content.gallery];
                        next[i] = { ...g, cat: e.target.value };
                        set({ gallery: next });
                      }}
                      className={input}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="eyebrow">Caption</span>
                    <input
                      value={g.caption}
                      onChange={(e) => {
                        const next = [...content.gallery];
                        next[i] = { ...g, caption: e.target.value };
                        set({ gallery: next });
                      }}
                      className={input}
                    />
                  </label>
                  <MediaField
                    label="Image"
                    value={g.img}
                    passcode={passcode}
                    onChange={(url) => {
                      const next = [...content.gallery];
                      next[i] = { ...g, img: url };
                      set({ gallery: next });
                    }}
                  />
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => set({ gallery: move(content.gallery, i, -1) })} className="btn-ghost text-foreground">↑</button>
                    <button onClick={() => set({ gallery: move(content.gallery, i, 1) })} className="btn-ghost text-foreground">↓</button>
                    <button
                      onClick={() => set({ gallery: content.gallery.filter((x) => x.id !== g.id) })}
                      className="ml-auto text-xs uppercase tracking-[0.18em] text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === "Partners" && (
          <Section
            title="Trusted by leading groups"
            onAdd={() => set({ partners: [...content.partners, { id: newId(), name: "New group", logo: "", url: "" } as Partner] })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {content.partners.map((p, i) => (
                <div key={p.id} className={card}>
                  <label className="block">
                    <span className="eyebrow">Name</span>
                    <input
                      value={p.name}
                      onChange={(e) => {
                        const next = [...content.partners];
                        next[i] = { ...p, name: e.target.value };
                        set({ partners: next });
                      }}
                      className={input}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow">Website link</span>
                    <input
                      value={p.url}
                      onChange={(e) => {
                        const next = [...content.partners];
                        next[i] = { ...p, url: e.target.value };
                        set({ partners: next });
                      }}
                      className={input}
                    />
                  </label>
                  <MediaField
                    label="Logo"
                    value={p.logo}
                    passcode={passcode}
                    onChange={(url) => {
                      const next = [...content.partners];
                      next[i] = { ...p, logo: url };
                      set({ partners: next });
                    }}
                  />
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => set({ partners: move(content.partners, i, -1) })} className="btn-ghost text-foreground">↑</button>
                    <button onClick={() => set({ partners: move(content.partners, i, 1) })} className="btn-ghost text-foreground">↓</button>
                    <button
                      onClick={() => set({ partners: content.partners.filter((x) => x.id !== p.id) })}
                      className="ml-auto text-xs uppercase tracking-[0.18em] text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === "Testimonials" && (
          <Section
            title="Reviews"
            onAdd={() =>
              set({
                testimonials: [
                  ...content.testimonials,
                  { id: newId(), name: "New client", role: "", quote: "", rating: 5 } as Testimonial,
                ],
              })
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              {content.testimonials.map((t, i) => (
                <div key={t.id} className={card}>
                  <label className="block">
                    <span className="eyebrow">Name</span>
                    <input
                      value={t.name}
                      onChange={(e) => {
                        const next = [...content.testimonials];
                        next[i] = { ...t, name: e.target.value };
                        set({ testimonials: next });
                      }}
                      className={input}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow">Role</span>
                    <input
                      value={t.role}
                      onChange={(e) => {
                        const next = [...content.testimonials];
                        next[i] = { ...t, role: e.target.value };
                        set({ testimonials: next });
                      }}
                      className={input}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow">Quote</span>
                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) => {
                        const next = [...content.testimonials];
                        next[i] = { ...t, quote: e.target.value };
                        set({ testimonials: next });
                      }}
                      className={input}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow">Rating (0–5, halves allowed)</span>
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.5}
                      value={t.rating}
                      onChange={(e) => {
                        const next = [...content.testimonials];
                        next[i] = { ...t, rating: Math.max(0, Math.min(5, Number(e.target.value))) };
                        set({ testimonials: next });
                      }}
                      className={input}
                    />
                  </label>
                  <Stars value={t.rating} />
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => set({ testimonials: move(content.testimonials, i, -1) })} className="btn-ghost text-foreground">↑</button>
                    <button onClick={() => set({ testimonials: move(content.testimonials, i, 1) })} className="btn-ghost text-foreground">↓</button>
                    <button
                      onClick={() => set({ testimonials: content.testimonials.filter((x) => x.id !== t.id) })}
                      className="ml-auto text-xs uppercase tracking-[0.18em] text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === "Offers" && (
          <Section
            title="Offers"
            onAdd={() =>
              set({
                offers: [
                  ...content.offers,
                  { id: newId(), title: "New offer", detail: "", badge: "New", active: true } as Offer,
                ],
              })
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              {content.offers.map((o, i) => (
                <div key={o.id} className={card}>
                  {(["title", "detail", "badge"] as const).map((k) => (
                    <label key={k} className="block">
                      <span className="eyebrow">{k}</span>
                      <input
                        value={o[k]}
                        onChange={(e) => {
                          const next = [...content.offers];
                          next[i] = { ...o, [k]: e.target.value };
                          set({ offers: next });
                        }}
                        className={input}
                      />
                    </label>
                  ))}
                  <label className="flex items-center gap-2 pt-1 text-sm">
                    <input
                      type="checkbox"
                      checked={o.active}
                      onChange={(e) => {
                        const next = [...content.offers];
                        next[i] = { ...o, active: e.target.checked };
                        set({ offers: next });
                      }}
                    />
                    Show on website
                  </label>
                  <button
                    onClick={() => set({ offers: content.offers.filter((x) => x.id !== o.id) })}
                    className="text-xs uppercase tracking-[0.18em] text-destructive"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === "Quotes" && (
          <Section title={`Free quote requests (${quotes.length})`}>
            <div className="grid gap-4 md:grid-cols-2">
              {quotes.length === 0 && <p className="text-sm text-muted-foreground">No requests yet.</p>}
              {quotes.map((q) => (
                <div key={q.id} className={card}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{q.name}</p>
                    <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">{q.created_at}</span>
                  </div>
                  <p className="text-sm">
                    <a href={`tel:${q.mobile}`} className="text-primary">
                      {q.mobile}
                    </a>{" "}
                    · {q.city || "—"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{q.service || "—"}</p>
                  {q.message && <p className="text-sm text-muted-foreground">{q.message}</p>}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={q.status}
                      onChange={async (e) => {
                        const s = e.target.value;
                        setQuotes((rows) => rows.map((r) => (r.id === q.id ? { ...r, status: s } : r)));
                        await updateQuoteStatus({ data: { passcode, id: q.id, status: s } });
                      }}
                      className={input + " max-w-[10rem]"}
                    >
                      {["new", "contacted", "quoted", "won", "closed"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={async () => {
                        await deleteQuote({ data: { passcode, id: q.id } });
                        setQuotes((rows) => rows.filter((r) => r.id !== q.id));
                      }}
                      className="ml-auto text-xs uppercase tracking-[0.18em] text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === "Assistant" && (
          <Section
            title="DG Assistant"
            onAdd={() =>
              set({
                assistant: {
                  ...assistant,
                  faqs: [{ id: newId(), tags: "", en: "", hi: "", hinglish: "" } as Faq, ...assistant.faqs],
                },
              })
            }
          >
            <div className={card}>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={assistant.enabled}
                  onChange={(e) => set({ assistant: { ...assistant, enabled: e.target.checked } })}
                />
                Show the assistant on the website
              </label>
              <label className="block">
                <span className="eyebrow">Title</span>
                <input
                  value={assistant.title}
                  onChange={(e) => set({ assistant: { ...assistant, title: e.target.value } })}
                  className={input}
                />
              </label>
              {(
                [
                  ["welcomeEn", "Welcome (English)"],
                  ["welcomeHi", "Welcome (हिंदी)"],
                  ["welcomeHinglish", "Welcome (Hinglish)"],
                  ["fallbackEn", "Unknown question reply (English)"],
                  ["fallbackHi", "Unknown question reply (हिंदी)"],
                  ["fallbackHinglish", "Unknown question reply (Hinglish)"],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="block">
                  <span className="eyebrow">{label}</span>
                  <textarea
                    rows={2}
                    value={assistant[k]}
                    onChange={(e) => set({ assistant: { ...assistant, [k]: e.target.value } })}
                    className={input}
                  />
                </label>
              ))}
              <label className="block">
                <span className="eyebrow">Quick replies (comma separated)</span>
                <input
                  value={assistant.suggestions.join(", ")}
                  onChange={(e) =>
                    set({
                      assistant: {
                        ...assistant,
                        suggestions: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  className={input}
                />
              </label>
              <p className="text-xs text-muted-foreground">
                Placeholders: {"{phone}"}, {"{phone2}"}, {"{whatsapp}"}, {"{hours}"}, {"{address}"}
              </p>
            </div>

            <div className="grid gap-4">
              {assistant.faqs.map((q, i) => (
                <div key={q.id} className={card}>
                  <label className="block">
                    <span className="eyebrow">Trigger keywords (comma separated)</span>
                    <input
                      value={q.tags}
                      onChange={(e) => {
                        const faqs = [...assistant.faqs];
                        faqs[i] = { ...q, tags: e.target.value };
                        set({ assistant: { ...assistant, faqs } });
                      }}
                      className={input}
                    />
                  </label>
                  {(
                    [
                      ["en", "Answer (English)"],
                      ["hi", "Answer (हिंदी)"],
                      ["hinglish", "Answer (Hinglish)"],
                    ] as const
                  ).map(([k, label]) => (
                    <label key={k} className="block">
                      <span className="eyebrow">{label}</span>
                      <textarea
                        rows={2}
                        value={q[k]}
                        onChange={(e) => {
                          const faqs = [...assistant.faqs];
                          faqs[i] = { ...q, [k]: e.target.value };
                          set({ assistant: { ...assistant, faqs } });
                        }}
                        className={input}
                      />
                    </label>
                  ))}
                  <button
                    onClick={() =>
                      set({ assistant: { ...assistant, faqs: assistant.faqs.filter((x) => x.id !== q.id) } })
                    }
                    className="text-xs uppercase tracking-[0.18em] text-destructive"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </Section>
        )}

        {tab === "Brochure" && (
          <Section title="Brochure">
            <div className={card}>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={brochure.enabled}
                  onChange={(e) => set({ brochure: { ...brochure, enabled: e.target.checked } })}
                />
                Show the brochure download on the website
              </label>
              <label className="block">
                <span className="eyebrow">Label</span>
                <input
                  value={brochure.label}
                  onChange={(e) => set({ brochure: { ...brochure, label: e.target.value } })}
                  className={input}
                />
              </label>
              <label className="block">
                <span className="eyebrow">Note</span>
                <input
                  value={brochure.note}
                  onChange={(e) => set({ brochure: { ...brochure, note: e.target.value } })}
                  className={input}
                />
              </label>
              <MediaField
                label="PDF file"
                accept="application/pdf"
                value={brochure.url}
                passcode={passcode}
                onChange={(url, filename) =>
                  set({ brochure: { ...brochure, url, filename: filename || brochure.filename } })
                }
              />
            </div>
          </Section>
        )}

        {tab === "Loader" && (
          <Section title="Entrance loading screen">
            <div className={card}>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={loader.enabled}
                  onChange={(e) => set({ loader: { ...loader, enabled: e.target.checked } })}
                />
                Show the loading screen
              </label>
              <DurationField
                seconds={loader.durationMs / 1000}
                onCommit={(secs) => set({ loader: { ...loader, durationMs: clampDuration(secs * 1000) } })}
              />
              <p className="text-xs text-muted-foreground">
                Any value between 0.5 and 10 seconds works — 1.5 to 2 seconds is recommended.
              </p>
              <label className="block">
                <span className="eyebrow">Title</span>
                <input
                  value={loader.title}
                  onChange={(e) => set({ loader: { ...loader, title: e.target.value } })}
                  className={input}
                />
              </label>
              <label className="block">
                <span className="eyebrow">Tagline (cursive)</span>
                <input
                  value={loader.tagline}
                  onChange={(e) => set({ loader: { ...loader, tagline: e.target.value } })}
                  className={input}
                />
              </label>
              <MediaField
                label="Logo"
                value={loader.logo}
                passcode={passcode}
                onChange={(url) => set({ loader: { ...loader, logo: url } })}
              />
            </div>
          </Section>
        )}

        {tab === "Story" && (
          <Section title="Our story">
            <div className={card}>
              {(
                [
                  ["eyebrow", "Eyebrow"],
                  ["title", "Title"],
                  ["lead", "Lead paragraph"],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="block">
                  <span className="eyebrow">{label}</span>
                  <textarea
                    rows={k === "eyebrow" ? 1 : 2}
                    value={story[k]}
                    onChange={(e) => set({ story: { ...story, [k]: e.target.value } })}
                    className={input}
                  />
                </label>
              ))}
              <label className="block">
                <span className="eyebrow">Paragraphs (one per line)</span>
                <textarea
                  rows={6}
                  value={story.paragraphs.join("\n")}
                  onChange={(e) =>
                    set({ story: { ...story, paragraphs: e.target.value.split("\n").filter((x) => x.trim()) } })
                  }
                  className={input}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {story.milestones.map((m, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <input
                      value={m.value}
                      onChange={(e) => {
                        const ms = [...story.milestones];
                        ms[i] = { ...m, value: e.target.value };
                        set({ story: { ...story, milestones: ms } });
                      }}
                      className={input}
                    />
                    <input
                      value={m.label}
                      onChange={(e) => {
                        const ms = [...story.milestones];
                        ms[i] = { ...m, label: e.target.value };
                        set({ story: { ...story, milestones: ms } });
                      }}
                      className={input}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {tab === "Social" && (
          <Section title="Social links">
            <div className={card}>
              {(["facebook", "instagram", "youtube"] as const).map((k) => (
                <label key={k} className="block">
                  <span className="eyebrow">{k}</span>
                  <input
                    value={social[k]}
                    onChange={(e) => set({ social: { ...social, [k]: e.target.value } })}
                    className={input}
                  />
                </label>
              ))}
            </div>
          </Section>
        )}

        {tab === "Contact" && (
          <Section title="Contact details">
            <div className={card}>
              <label className="block">
                <span className="eyebrow">Phone numbers (comma separated — first is the contractor mobile)</span>
                <input
                  value={contact.phones.join(", ")}
                  onChange={(e) =>
                    set({
                      contact: { ...contact, phones: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) },
                    })
                  }
                  className={input}
                />
              </label>
              {(
                [
                  ["whatsapp", "WhatsApp number"],
                  ["address", "Address"],
                  ["hours", "Hours"],
                  ["hoursSunday", "Hours (second line)"],
                  ["mapQuery", "Google Maps query"],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="block">
                  <span className="eyebrow">{label}</span>
                  <input
                    value={contact[k]}
                    onChange={(e) => set({ contact: { ...contact, [k]: e.target.value } })}
                    className={input}
                  />
                </label>
              ))}
            </div>
          </Section>
        )}
      </div>

      {tab !== "Quotes" && (
        <div className="glass-panel fixed inset-x-0 bottom-0 z-40 border-t border-border/60">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-5">
            <p className="text-xs text-muted-foreground">{status || "Changes are saved when you press Save."}</p>
            <button onClick={() => void save()} className="btn-primary ml-auto">
              Save changes
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
