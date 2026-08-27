import { useEffect, useState } from "react";
import { Logo } from "./Brand";
import { useSiteContent, whatsappLink } from "@/lib/site-content";
import { TranslateToggle } from "./TranslateToggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { contact, brochure } = useSiteContent();
  const links = [
    { label: "Services", href: "#services" },
    { label: "Story", href: "#story" },
    { label: "Products", href: "#products" },
    { label: "Gallery", href: "#gallery" },
    { label: "Projects", href: "#projects" },
    // Brochure only appears once a PDF is actually uploaded and enabled.
    ...(brochure.enabled && brochure.url ? [{ label: "Brochure", href: "#brochure" }] : []),
    { label: "Contact", href: "#contact" },
  ];
  const waLink = whatsappLink(contact.whatsapp, "Hi Dream Glass Collection, I would like to enquire about your glass solutions.");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`glass-panel fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-border/60 py-2" : "border-b border-border/30 py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <Logo className="h-10 w-10 md:h-12 md:w-12 transition-transform duration-500 group-hover:rotate-6" />
          <span className="leading-tight">
            <span className="block font-display text-[0.95rem] md:text-lg font-semibold tracking-[0.18em] uppercase text-foreground">
              Dream Glass
            </span>
            <span className="block text-[0.6rem] md:text-[0.65rem] tracking-[0.42em] uppercase text-muted-foreground">
              Collection
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link-underline text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <TranslateToggle />
          <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary hidden sm:inline-flex">
            WhatsApp Now
          </a>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
          >
            <span className="relative block h-[9px] w-4">
              <span className="absolute inset-x-0 top-0 h-px bg-foreground" />
              <span className="absolute inset-x-0 bottom-0 h-px bg-foreground" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="glass-panel mx-5 mt-2 rounded-2xl p-5 lg:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm uppercase tracking-[0.2em] text-muted-foreground"
            >
              {l.label}
            </a>
          ))}
          <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary mt-4 w-full justify-center">
            WhatsApp Now
          </a>
        </nav>
      )}
    </header>
  );
}
