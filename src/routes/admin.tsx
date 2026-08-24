import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Logo } from "@/components/site/Brand";
import {
  CATEGORIES,
  DEFAULT_CONTENT,
  loadContent,
  newId,
  resetContent,
  saveContent,
  type Offer,
  type Product,
  type SiteContent,
  type Testimonial,
} from "@/lib/site-content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel | Dream Glass Collection" },
      { name: "description", content: "Manage products, testimonials, offers, story, contact and social links for Dream Glass Collection." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Panel | Dream Glass Collection" },
      { property: "og:description", content: "Content management for the Dream Glass Collection website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

/** Studio passcode for the local admin panel. Change it here before going live. */
const PASSCODE = "dreamglass2008";
const AUTH_KEY = "dgc.admin";

const input =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const tabs = ["Products", "Testimonials", "Offers", "Story", "Social", "Contact"] as const;
type Tab = (typeof tabs)[number];

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("Products");
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAuthed(window.sessionStorage.getItem(AUTH_KEY) === "1");
    setContent(loadContent());
  }, []);

  const update = (next: SiteContent) => {
    setContent(next);
    saveContent(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pass === PASSCODE) {
              window.sessionStorage.setItem(AUTH_KEY, "1");
              setAuthed(true);
            } else setError("Incorrect passcode.");
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

  return (
    <main className="min-h-screen bg-background">
      <header className="glass-panel sticky top-0 z-40 border-b border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-4">
          <Logo className="h-10 w-10" />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em]">Admin Panel</p>
            <p className="text-[0.6rem] uppercase tracking-[0.32em] text-muted-foreground">Dream Glass Collection</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {saved && <span className="text-xs text-primary">Saved</span>}
            <Link to="/" className="btn-ghost text-foreground">
              View site
            </Link>
            <button
              onClick={() => {
                window.sessionStorage.removeItem(AUTH_KEY);
                setAuthed(false);
              }}
              className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-4 py-2 text-[0.66rem] uppercase tracking-[0.18em] transition-colors ${
                tab === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Changes save automatically to this browser and appear instantly on the website — no database required.
        </p>

        {tab === "Products" && <ProductsTab content={content} update={update} />}
        {tab === "Testimonials" && <TestimonialsTab content={content} update={update} />}
        {tab === "Offers" && <OffersTab content={content} update={update} />}
        {tab === "Story" && <StoryTab content={content} update={update} />}
        {tab === "Social" && <SocialTab content={content} update={update} />}
        {tab === "Contact" && <ContactTab content={content} update={update} />}

        <button
          onClick={() => {
            if (window.confirm("Reset all content back to the defaults?")) {
              resetContent();
              setContent(DEFAULT_CONTENT);
            }
          }}
          className="mt-14 text-xs uppercase tracking-[0.22em] text-destructive"
        >
          Reset to defaults
        </button>
      </div>
    </main>
  );
}

type TabProps = { content: SiteContent; update: (c: SiteContent) => void };

function Card({ children }: { children: React.ReactNode }) {
  return <div className="glass-card space-y-3 p-5">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      {textarea ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={input} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={input} />
      )}
    </label>
  );
}

function ProductsTab({ content, update }: TabProps) {
  const set = (products: Product[]) => update({ ...content, products });

  return (
    <section className="mt-8 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products ({content.products.length})</h2>
        <button
          onClick={() =>
            set([
              ...content.products,
              { id: newId(), title: "New product", cat: CATEGORIES[0], img: "", note: "" },
            ])
          }
          className="btn-primary"
        >
          Add product
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Image URL can be a full https link, or a path like /favicon.png for files you add to the public folder.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {content.products.map((p, i) => (
          <Card key={p.id}>
            <div className="flex items-start gap-4">
              {p.img ? (
                <img src={p.img} alt={p.title} className="h-20 w-16 rounded-lg object-cover" />
              ) : (
                <div className="flex h-20 w-16 items-center justify-center rounded-lg border border-dashed border-border text-[0.55rem] uppercase text-muted-foreground">
                  No image
                </div>
              )}
              <div className="flex-1 space-y-3">
                <Field label="Title" value={p.title} onChange={(v) => set(content.products.map((x) => (x.id === p.id ? { ...x, title: v } : x)))} />
                <label className="block">
                  <span className="eyebrow">Grade / Category</span>
                  <select
                    value={p.cat}
                    onChange={(e) => set(content.products.map((x) => (x.id === p.id ? { ...x, cat: e.target.value } : x)))}
                    className={input}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <Field label="Image URL" value={p.img} onChange={(v) => set(content.products.map((x) => (x.id === p.id ? { ...x, img: v } : x)))} />
            <Field label="Details / short note" value={p.note} onChange={(v) => set(content.products.map((x) => (x.id === p.id ? { ...x, note: v } : x)))} />
            <div className="flex gap-3 pt-1">
              <button
                disabled={i === 0}
                onClick={() => {
                  const next = [...content.products];
                  [next[i - 1]!, next[i]!] = [next[i]!, next[i - 1]!];
                  set(next);
                }}
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground disabled:opacity-40"
              >
                Move up
              </button>
              <button
                disabled={i === content.products.length - 1}
                onClick={() => {
                  const next = [...content.products];
                  [next[i + 1]!, next[i]!] = [next[i]!, next[i + 1]!];
                  set(next);
                }}
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground disabled:opacity-40"
              >
                Move down
              </button>
              <button
                onClick={() => set(content.products.filter((x) => x.id !== p.id))}
                className="ml-auto text-xs uppercase tracking-[0.2em] text-destructive"
              >
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TestimonialsTab({ content, update }: TabProps) {
  const set = (testimonials: Testimonial[]) => update({ ...content, testimonials });

  return (
    <section className="mt-8 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Testimonials ({content.testimonials.length})</h2>
        <button
          onClick={() => set([...content.testimonials, { id: newId(), name: "Client name", role: "Role", quote: "" }])}
          className="btn-primary"
        >
          Add testimonial
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {content.testimonials.map((t) => (
          <Card key={t.id}>
            <Field label="Name" value={t.name} onChange={(v) => set(content.testimonials.map((x) => (x.id === t.id ? { ...x, name: v } : x)))} />
            <Field label="Role" value={t.role} onChange={(v) => set(content.testimonials.map((x) => (x.id === t.id ? { ...x, role: v } : x)))} />
            <Field
              textarea
              label="Quote"
              value={t.quote}
              onChange={(v) => set(content.testimonials.map((x) => (x.id === t.id ? { ...x, quote: v } : x)))}
            />
            <button
              onClick={() => set(content.testimonials.filter((x) => x.id !== t.id))}
              className="text-xs uppercase tracking-[0.2em] text-destructive"
            >
              Delete
            </button>
          </Card>
        ))}
      </div>
    </section>
  );
}

function OffersTab({ content, update }: TabProps) {
  const set = (offers: Offer[]) => update({ ...content, offers });

  return (
    <section className="mt-8 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Offers ({content.offers.length})</h2>
        <button
          onClick={() => set([...content.offers, { id: newId(), title: "New offer", detail: "", badge: "Offer", active: true }])}
          className="btn-primary"
        >
          Add offer
        </button>
      </div>
      <p className="text-xs text-muted-foreground">Only offers with “Show on website” ticked appear on the homepage.</p>
      <div className="grid gap-5 md:grid-cols-2">
        {content.offers.map((o) => (
          <Card key={o.id}>
            <Field label="Badge" value={o.badge} onChange={(v) => set(content.offers.map((x) => (x.id === o.id ? { ...x, badge: v } : x)))} />
            <Field label="Title" value={o.title} onChange={(v) => set(content.offers.map((x) => (x.id === o.id ? { ...x, title: v } : x)))} />
            <Field
              textarea
              label="Detail"
              value={o.detail}
              onChange={(v) => set(content.offers.map((x) => (x.id === o.id ? { ...x, detail: v } : x)))}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={o.active}
                  onChange={(e) => set(content.offers.map((x) => (x.id === o.id ? { ...x, active: e.target.checked } : x)))}
                />
                Show on website
              </label>
              <button
                onClick={() => set(content.offers.filter((x) => x.id !== o.id))}
                className="text-xs uppercase tracking-[0.2em] text-destructive"
              >
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function StoryTab({ content, update }: TabProps) {
  const story = content.story;
  const setStory = (patch: Partial<typeof story>) => update({ ...content, story: { ...story, ...patch } });

  return (
    <section className="mt-8 max-w-2xl space-y-5">
      <h2 className="text-xl font-semibold">Our Story section</h2>
      <Card>
        <Field label="Eyebrow (small label)" value={story.eyebrow} onChange={(v) => setStory({ eyebrow: v })} />
        <Field label="Heading" value={story.title} onChange={(v) => setStory({ title: v })} />
        <Field textarea label="Lead sentence" value={story.lead} onChange={(v) => setStory({ lead: v })} />
        <Field
          textarea
          rows={8}
          label="Paragraphs — one per line"
          value={story.paragraphs.join("\n")}
          onChange={(v) => setStory({ paragraphs: v.split("\n").filter((p) => p.trim()) })}
        />
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Milestones ({story.milestones.length})</h3>
        <button
          onClick={() => setStory({ milestones: [...story.milestones, { value: "2026", label: "New milestone" }] })}
          className="btn-primary"
        >
          Add milestone
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {story.milestones.map((m, i) => (
          <Card key={i}>
            <Field
              label="Value (e.g. 2008, 1000+)"
              value={m.value}
              onChange={(v) => setStory({ milestones: story.milestones.map((x, j) => (j === i ? { ...x, value: v } : x)) })}
            />
            <Field
              label="Label"
              value={m.label}
              onChange={(v) => setStory({ milestones: story.milestones.map((x, j) => (j === i ? { ...x, label: v } : x)) })}
            />
            <button
              onClick={() => setStory({ milestones: story.milestones.filter((_, j) => j !== i) })}
              className="text-xs uppercase tracking-[0.2em] text-destructive"
            >
              Delete
            </button>
          </Card>
        ))}
      </div>
    </section>
  );
}

function SocialTab({ content, update }: TabProps) {
  return (
    <section className="mt-8 max-w-xl space-y-5">
      <h2 className="text-xl font-semibold">Social links</h2>
      <p className="text-xs text-muted-foreground">
        Shown in the footer and quote section. Leave a field empty to hide that icon.
      </p>
      <Card>
        <Field
          label="Facebook URL"
          value={content.social.facebook}
          onChange={(v) => update({ ...content, social: { ...content.social, facebook: v } })}
        />
        <Field
          label="Instagram URL"
          value={content.social.instagram}
          onChange={(v) => update({ ...content, social: { ...content.social, instagram: v } })}
        />
        <Field
          label="YouTube URL"
          value={content.social.youtube}
          onChange={(v) => update({ ...content, social: { ...content.social, youtube: v } })}
        />
      </Card>
    </section>
  );
}

function ContactTab({ content, update }: TabProps) {
  const contact = content.contact;
  const setContact = (patch: Partial<typeof contact>) => update({ ...content, contact: { ...contact, ...patch } });

  return (
    <section className="mt-8 max-w-xl space-y-5">
      <h2 className="text-xl font-semibold">Contact details</h2>
      <p className="text-xs text-muted-foreground">
        The first phone number is treated as the contractor mobile — the DG Assistant directs unanswered questions
        to it, and it appears in the footer and quote section.
      </p>
      <Card>
        <Field
          textarea
          rows={2}
          label="Phone numbers — one per line (contractor first)"
          value={contact.phones.join("\n")}
          onChange={(v) => setContact({ phones: v.split("\n").map((p) => p.trim()).filter(Boolean) })}
        />
        <Field label="WhatsApp number" value={contact.whatsapp} onChange={(v) => setContact({ whatsapp: v })} />
        <Field label="Address / city" value={contact.address} onChange={(v) => setContact({ address: v })} />
        <Field label="Working hours" value={contact.hours} onChange={(v) => setContact({ hours: v })} />
        <Field label="Sunday hours" value={contact.hoursSunday} onChange={(v) => setContact({ hoursSunday: v })} />
        <Field
          label="Map search (for the embedded Google map)"
          value={contact.mapQuery}
          onChange={(v) => setContact({ mapQuery: v })}
        />
      </Card>
    </section>
  );
}
