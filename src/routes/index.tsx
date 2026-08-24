import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Header } from "@/components/site/Header";
import { Assistant } from "@/components/site/Assistant";
import { Reveal, Counter } from "@/components/site/Reveal";
import { ProductSlider } from "@/components/site/ProductSlider";
import { SocialLinks } from "@/components/site/Social";
import { Logo } from "@/components/site/Brand";
import {
  CATEGORIES,
  displayNumber,
  telLink,
  useSiteContent,
  whatsappLink,
  type Product,
} from "@/lib/site-content";
import hero from "@/assets/hero.jpg";
import pRailing from "@/assets/p-railing.jpg";
import pShower from "@/assets/p-shower.jpg";
import pPartition from "@/assets/p-partition.jpg";
import pFacade from "@/assets/p-facade.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dream Glass Collection | Premium Architectural Glass Solutions" },
      {
        name: "description",
        content:
          "A studio of designer glasses since 2008 — glass railings, toughened glass, facades, partitions, shower enclosures, mirrors and ACP work. 1000+ projects delivered.",
      },
      { property: "og:title", content: "Dream Glass Collection | Premium Architectural Glass" },
      {
        property: "og:description",
        content: "A studio of designer glasses — luxury glass railings, facades, partitions and custom glass since 2008.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const services = [
  { name: "Glass Railings", desc: "Frameless spigot and channel systems in toughened glass." },
  { name: "Toughened Glass", desc: "Heat-strengthened safety glass cut to exact architectural spec." },
  { name: "Facades", desc: "Structural glazing and curtain wall systems for landmark buildings." },
  { name: "Partitions", desc: "Acoustic office partitions with slim profiles and clean sightlines." },
  { name: "Shower Enclosures", desc: "Bespoke frameless enclosures with premium hardware." },
  { name: "Decorative Glass", desc: "Lacquered, fluted, frosted and back-painted design glass." },
  { name: "ACP Work", desc: "Aluminium composite cladding, elevations and signage panels." },
  { name: "Mirrors", desc: "Antique, LED and custom-shaped mirror installations." },
  { name: "Custom Solutions", desc: "Made-to-measure glass engineered around your drawing." },
];

const why = [
  { t: "21+ Years Experience", d: "Two decades of architectural glass craftsmanship." },
  { t: "Premium Materials", d: "Certified toughened glass and imported hardware only." },
  { t: "Expert Installation", d: "In-house teams trained on high-rise and villa sites." },
  { t: "Modern Designs", d: "Detailing drawn from contemporary architecture." },
  { t: "Trusted Brand", d: "Preferred vendor for leading builders and groups." },
  { t: "Professional Team", d: "Site survey, drawing, execution and after-care." },
];

const projects = [
  { t: "Luxury Villa Railings", c: "Luxury Villas", img: pRailing },
  { t: "Corporate Tower Facade", c: "Commercial", img: pFacade },
  { t: "Head Office Partitions", c: "Office", img: pPartition },
  { t: "Residence Bath Suite", c: "Residential", img: pShower },
];

const clients = [
  "C.L. Gupta",
  "Dr. R.P. Singh",
  "ATS Infrastructure",
  "Gaur Group",
  "Wave City",
  "Mahagun",
  "Supertech",
  "Ajnara Homes",
];

const filterChips = ["All", ...CATEGORIES];

function Index() {
  const content = useSiteContent();
  const { products, testimonials, offers, social, story, contact } = content;

  const [cat, setCat] = useState("All");
  const [lightbox, setLightbox] = useState<{ img: string; title: string } | null>(null);
  const [form, setForm] = useState({ name: "", mobile: "", city: "", service: services[0]!.name, message: "" });

  const filtered = useMemo(() => (cat === "All" ? products : products.filter((p) => p.cat === cat)), [cat, products]);
  const activeOffers = useMemo(() => offers.filter((o) => o.active), [offers]);

  const waEnquiry = whatsappLink(contact.whatsapp, "Hi Dream Glass Collection, I would like to enquire about your glass solutions.");

  const submitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `New Quote Request\n\nName: ${form.name}\nMobile: ${form.mobile}\nCity: ${form.city}\nService: ${form.service}\nMessage: ${form.message}`;
    window.open(whatsappLink(contact.whatsapp, text), "_blank");
  };

  const openProduct = (p: Product) => setLightbox({ img: p.img, title: p.title });

  return (
    <div id="top" className="min-h-screen bg-background">
      <Header />
      <Assistant />

      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hero}
            alt="Luxury architectural glass facade at golden hour"
            width={1920}
            height={1280}
            className="hero-zoom h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
        </div>

        <div
          className="glass-panel float-slow absolute right-6 top-32 hidden h-56 w-40 rotate-6 rounded-2xl border border-border/50 lg:block"
          aria-hidden
        />
        <div
          className="glass-panel float-slow absolute right-40 top-56 hidden h-72 w-52 -rotate-3 rounded-2xl border border-border/50 lg:block"
          style={{ animationDelay: "1.2s" }}
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 md:px-8 md:pb-28">
          <Reveal>
            <p className="eyebrow">Since 2008 — A Studio Of Designer Glasses</p>
            <h1 className="mt-5 max-w-4xl text-[2.6rem] font-semibold leading-[0.98] text-foreground sm:text-6xl lg:text-7xl">
              Premium Architectural
              <span className="block text-primary">Glass Solutions</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground">
              Transforming spaces with frameless railings, facades, partitions and bespoke glass — engineered,
              installed and finished to a luxury standard.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#products" className="btn-primary">
                View Our Products
              </a>
              <a href="#quote" className="btn-ghost text-foreground">
                Get Free Quote
              </a>
              <a href={waEnquiry} target="_blank" rel="noreferrer" className="btn-ghost text-foreground">
                WhatsApp Now
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { v: 21, s: "+", l: "Years of Experience" },
            { v: 4500, s: "+", l: "Clients Served" },
            { v: 1000, s: "+", l: "Projects Completed" },
          ].map((x, i) => (
            <Reveal key={x.l} delay={i * 120} className="px-6 py-12 text-center">
              <p className="font-display text-5xl font-semibold text-foreground md:text-6xl">
                <Counter to={x.v} suffix={x.s} />
              </p>
              <p className="eyebrow mt-3">{x.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Current offers */}
      {activeOffers.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-20 md:px-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {activeOffers.map((o, i) => (
              <Reveal key={o.id} delay={i * 100}>
                <article className="glass-card flex h-full items-start gap-5 p-6">
                  <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-[0.6rem] uppercase tracking-[0.22em] text-primary-foreground">
                    {o.badge}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{o.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{o.detail}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="eyebrow">What we craft</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold md:text-5xl">
            A complete glass discipline, under one studio.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={(i % 3) * 100}>
              <article className="glass-card h-full p-7">
                <Logo className="h-8 w-8" />
                <h3 className="mt-6 text-xl font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="border-y border-border bg-card py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:grid-cols-2 md:px-8">
          <Reveal>
            <p className="eyebrow">{story.eyebrow}</p>
            <h2 className="mt-4 text-4xl font-semibold md:text-5xl">{story.title}</h2>
            <p className="mt-6 text-base font-medium text-foreground">{story.lead}</p>
            {story.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </Reveal>
          <div className="grid content-center gap-5 sm:grid-cols-2">
            {story.milestones.map((m, i) => (
              <Reveal key={i} delay={(i % 2) * 120}>
                <div className="glass-card h-full p-7">
                  <p className="font-display text-4xl font-semibold text-primary">{m.value}</p>
                  <p className="eyebrow mt-3">{m.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Products */}
      <section id="products" className="border-b border-border bg-card py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">The catalogue</p>
              <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Our Products</h2>
              <p className="mt-4 max-w-lg text-sm text-muted-foreground">
                Ten signature categories — every piece measured, toughened and installed by our own team.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterChips.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-4 py-2 text-[0.66rem] uppercase tracking-[0.18em] transition-colors ${
                    cat === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-12">
            <ProductSlider key={cat} products={filtered} whatsapp={contact.whatsapp} onOpen={openProduct} />
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="eyebrow">Why choose us</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold md:text-5xl">Built on precision and trust.</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {why.map((w, i) => (
            <Reveal key={w.t} delay={(i % 3) * 100}>
              <div className="glass-card h-full p-7">
                <span className="font-display text-xs text-primary">0{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold">{w.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="border-y border-border bg-card py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="eyebrow">Featured projects</p>
            <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Residential. Commercial. Landmark.</h2>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.t} delay={(i % 2) * 120}>
                <article className="group relative aspect-[16/11] overflow-hidden rounded-2xl">
                  <img
                    src={p.img}
                    alt={p.t}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-ink/25 transition-opacity duration-700 group-hover:bg-ink/45" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="text-[0.6rem] uppercase tracking-[0.32em] text-primary-foreground/75">{p.c}</p>
                    <h3 className="mt-1 text-2xl font-semibold text-primary-foreground">{p.t}</h3>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="overflow-hidden py-16">
        <p className="eyebrow text-center">Trusted by leading groups</p>
        <div className="mt-8 flex gap-12 overflow-x-auto px-5 md:justify-center md:flex-wrap md:gap-x-14 md:gap-y-6">
          {clients.map((c) => (
            <span
              key={c}
              className="shrink-0 font-display text-lg font-semibold text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 110}>
                <figure className="glass-card h-full p-7">
                  <div className="flex gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="m12 17.3 6.2 3.7-1.6-7 5.4-4.7-7.1-.6L12 2 9.1 8.7 2 9.3l5.4 4.7-1.6 7z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-5 text-sm leading-relaxed text-foreground">“{t.quote}”</blockquote>
                  <figcaption className="mt-6">
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="eyebrow">{t.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Quote */}
      <section id="quote" className="border-y border-border bg-card py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:grid-cols-2 md:px-8">
          <Reveal>
            <p className="eyebrow">Request a quote</p>
            <h2 className="mt-4 text-4xl font-semibold md:text-5xl">Tell us about your space.</h2>
            <p className="mt-5 max-w-md text-sm text-muted-foreground">
              Share your requirement and our team will revert with a detailed estimate. Prefer to talk? Call{" "}
              {contact.phones.map(displayNumber).join(" or ")} — WhatsApp is available on {displayNumber(contact.whatsapp)}.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Logo className="h-14 w-14" />
              <span className="eyebrow">Dream Glass Collection</span>
            </div>
            <SocialLinks social={social} className="mt-8" />
          </Reveal>

          <Reveal delay={120}>
            <form onSubmit={submitQuote} className="glass-card space-y-4 p-7">
              {(
                [
                  ["name", "Name"],
                  ["mobile", "Mobile"],
                  ["city", "City"],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="block">
                  <span className="eyebrow">{label}</span>
                  <input
                    required
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>
              ))}
              <label className="block">
                <span className="eyebrow">Service</span>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                >
                  {services.map((s) => (
                    <option key={s.name}>{s.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="eyebrow">Message</span>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <button type="submit" className="btn-primary w-full justify-center">
                Get Free Quote
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* Contact + footer */}
      <footer id="contact" className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1.4fr]">
            <div>
              <div className="flex items-center gap-3">
                <Logo className="h-14 w-14" />
                <span className="leading-tight">
                  <span className="block font-display text-lg font-semibold uppercase tracking-[0.16em]">
                    Dream Glass
                  </span>
                  <span className="block text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground">
                    Collection
                  </span>
                </span>
              </div>
              <p className="mt-6 font-display text-xl font-semibold text-primary">A Studio Of Designer Glasses</p>
              <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                Premium architectural glass, engineered and installed since 2008.
              </p>
              <SocialLinks social={social} className="mt-6" />
            </div>

            <div className="space-y-3 text-sm">
              <p className="eyebrow">Explore</p>
              {[
                ["Services", "#services"],
                ["Our Story", "#story"],
                ["Our Products", "#products"],
                ["Projects", "#projects"],
                ["Get a Quote", "#quote"],
              ].map(([l, h]) => (
                <p key={h}>
                  <a href={h} className="link-underline text-muted-foreground hover:text-foreground">
                    {l}
                  </a>
                </p>
              ))}
            </div>

            <div className="space-y-3 text-sm">
              <p className="eyebrow">Contact</p>
              <p className="text-muted-foreground">{contact.address}</p>
              {contact.phones.map((n) => (
                <p key={n}>
                  <a href={telLink(n)} className="link-underline">
                    {displayNumber(n)}
                  </a>
                </p>
              ))}
              <p>
                <a href={waEnquiry} target="_blank" rel="noreferrer" className="link-underline text-primary">
                  WhatsApp {displayNumber(contact.whatsapp)}
                </a>
              </p>
              <p className="pt-2 text-muted-foreground">{contact.hours}</p>
              <p className="text-muted-foreground">{contact.hoursSunday}</p>
            </div>

            <div>
              <p className="eyebrow">Find the studio</p>
              <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                <iframe
                  title="Dream Glass Collection location map"
                  src={`https://www.google.com/maps?q=${contact.mapQuery}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-56 w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Dream Glass Collection. All rights reserved.
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              A Studio Of Designer Glasses
            </p>
          </div>
        </div>
      </footer>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-ink/80 p-6 backdrop-blur-md"
        >
          {lightbox.img && (
            <img src={lightbox.img} alt={lightbox.title} className="max-h-[80vh] w-auto rounded-xl object-contain" />
          )}
          <p className="text-sm text-primary-foreground">{lightbox.title}</p>
        </div>
      )}
    </div>
  );
}
