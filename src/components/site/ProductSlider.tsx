import { useEffect, useRef, useState } from "react";

import { whatsappLink } from "@/lib/site-content";
import type { Product } from "@/lib/site-content";

export function ProductSlider({
  products,
  whatsapp,
  onOpen,
}: {
  products: Product[];
  whatsapp: string;
  onOpen: (p: Product) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [products]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 900), behavior: "smooth" });
  };

  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground">No products in this category yet.</p>;
  }

  return (
    <div className="relative">
      <div className="mb-6 flex justify-end gap-2">
        {([-1, 1] as const).map((d) => (
          <button
            key={d}
            onClick={() => scrollBy(d)}
            disabled={d === -1 ? !canPrev : !canNext}
            aria-label={d === -1 ? "Previous products" : "Next products"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
              <path d={d === -1 ? "M15 5 8 12l7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4"
      >
        {products.map((p) => (
          <article
            key={p.id}
            className="glass-card group w-[78vw] shrink-0 snap-start overflow-hidden sm:w-[46vw] lg:w-[30%] xl:w-[23%]"
          >
            <button
              onClick={() => onOpen(p)}
              className="block w-full overflow-hidden"
              aria-label={`View ${p.title}`}
            >
              {p.img ? (
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Image coming soon
                </div>
              )}
            </button>
            <div className="p-5">
              <span className="eyebrow">{p.cat}</span>
              <h3 className="mt-2 text-sm font-semibold">{p.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>
              <a
                href={whatsappLink(whatsapp, `Hi Dream Glass Collection, I'm interested in ${p.title}.`)}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-4 w-full justify-center"
              >
                Enquire
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
