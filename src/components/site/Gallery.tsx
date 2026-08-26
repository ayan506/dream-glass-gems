import { Reveal } from "./Reveal";
import type { GalleryItem } from "@/lib/site-content";

/** Mirror-framed gallery of designer glass and mirror work. */
export function Gallery({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (item: GalleryItem) => void;
}) {
  if (items.length === 0) return null;

  return (
    <section id="gallery" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <p className="eyebrow">Gallery</p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold md:text-5xl">
          Designer glass, framed like a mirror.
        </h2>
        <p className="mt-4 max-w-lg text-sm text-muted-foreground">
          A closer look at completed installations — railings, enclosures, mirrors and feature glass.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g, i) => (
          <Reveal key={g.id} delay={(i % 3) * 90}>
            <button
              onClick={() => onOpen(g)}
              className="group block w-full text-left"
              aria-label={`Open ${g.title}`}
            >
              <div className="relative rounded-[1.6rem] bg-gradient-to-br from-primary/45 via-border to-primary/25 p-[2px] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.65)] transition-transform duration-500 group-hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-background/40 bg-card">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={g.img}
                      alt={g.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                    />
                    {/* mirror sheen */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-[420%]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-white/15"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[0.6rem] uppercase tracking-[0.3em] text-primary">{g.cat}</p>
                    <h3 className="mt-2 text-lg font-semibold">{g.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{g.caption}</p>
                  </div>
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
