import { useCallback, useEffect, useState } from "react";

import cRailing from "@/assets/c-railing.jpg";
import cToughened from "@/assets/c-toughened.jpg";
import cFacade from "@/assets/c-facade.jpg";
import cPartition from "@/assets/c-partition.jpg";
import cShower from "@/assets/c-shower.jpg";
import cDecorative from "@/assets/c-decorative.jpg";
import cAcp from "@/assets/c-acp.jpg";
import cMirror from "@/assets/c-mirror.jpg";
import cStaircase from "@/assets/c-staircase.jpg";
import cSkylight from "@/assets/c-skylight.jpg";

export type Product = { id: string; title: string; cat: string; img: string; note: string };
export type Testimonial = { id: string; name: string; role: string; quote: string };
export type Offer = { id: string; title: string; detail: string; badge: string; active: boolean };
export type Social = { facebook: string; instagram: string; youtube: string };
export type StoryMilestone = { value: string; label: string };
export type Story = {
  eyebrow: string;
  title: string;
  lead: string;
  paragraphs: string[];
  milestones: StoryMilestone[];
};
export type Contact = {
  /** Call numbers, primary first. The first entry is treated as the contractor mobile. */
  phones: string[];
  /** WhatsApp-enabled number (digits only, without country code). */
  whatsapp: string;
  address: string;
  hours: string;
  hoursSunday: string;
  mapQuery: string;
};

export type SiteContent = {
  products: Product[];
  testimonials: Testimonial[];
  offers: Offer[];
  social: Social;
  story: Story;
  contact: Contact;
};

/** The ten grades/categories the catalogue is organised into. */
export const CATEGORIES = [
  "Railings",
  "Glass",
  "Facades",
  "Partitions",
  "Enclosures",
  "Decorative",
  "ACP",
  "Mirrors",
  "Staircases",
  "Skylights",
] as const;

export const DEFAULT_CONTENT: SiteContent = {
  products: [
    { id: "p1", title: "Frameless Balcony Railing", cat: "Railings", img: cRailing, note: "12mm toughened · SS spigots" },
    { id: "p2", title: "Toughened Safety Glass", cat: "Glass", img: cToughened, note: "6–19mm · edge polished" },
    { id: "p3", title: "Structural Glass Facade", cat: "Facades", img: cFacade, note: "Curtain wall · spider glazing" },
    { id: "p4", title: "Acoustic Office Partition", cat: "Partitions", img: cPartition, note: "Double glazed · slim frame" },
    { id: "p5", title: "Frameless Shower Enclosure", cat: "Enclosures", img: cShower, note: "10mm · gold hardware" },
    { id: "p6", title: "Decorative Feature Glass", cat: "Decorative", img: cDecorative, note: "Fluted · back-painted · art" },
    { id: "p7", title: "ACP Elevation Cladding", cat: "ACP", img: cAcp, note: "Fire-rated · grooved panels" },
    { id: "p8", title: "Backlit LED Mirror", cat: "Mirrors", img: cMirror, note: "Custom shape · anti-fog" },
    { id: "p9", title: "Staircase Glass Railing", cat: "Staircases", img: cStaircase, note: "Wood handrail · clamps" },
    { id: "p10", title: "Glass Canopy & Skylight", cat: "Skylights", img: cSkylight, note: "Laminated · weather sealed" },
  ],
  testimonials: [
    {
      id: "t1",
      name: "Ar. Nidhi Sharma",
      role: "Principal Architect",
      quote: "The frameless railing detailing was flawless — the sightlines match our drawings exactly.",
    },
    { id: "t2", name: "Rohit Gaur", role: "Project Head", quote: "Facade delivered on schedule across three towers. Zero rework." },
    { id: "t3", name: "Dr. R.P. Singh", role: "Homeowner", quote: "The shower enclosure and mirrors completely transformed our home." },
  ],
  offers: [
    { id: "o1", title: "Free Site Survey", detail: "Complimentary measurement and drawing for orders above 100 sq.ft.", badge: "This month", active: true },
    { id: "o2", title: "10% Off Shower Enclosures", detail: "On frameless 10mm enclosures with premium hardware.", badge: "Limited", active: true },
  ],
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
  },
  story: {
    eyebrow: "Our story",
    title: "A studio of designer glasses, built one panel at a time.",
    lead: "Dream Glass Collection began in 2008 in Moradabad with a single toughening order and a simple promise — glass measured, finished and installed like it was our own home.",
    paragraphs: [
      "Over two decades later, that promise has carried us from single bathroom mirrors to structural facades on commercial towers. Every project still starts the same way: a site visit, a careful measurement, and a drawing the client signs off before we cut a single sheet.",
      "Today our in-house teams handle survey, fabrication and installation for villas, offices, hotels and high-rise developments — with certified toughened glass, imported hardware and after-care that outlasts the handover.",
    ],
    milestones: [
      { value: "2008", label: "Studio founded in Moradabad" },
      { value: "1000+", label: "Projects completed" },
      { value: "4500+", label: "Clients served" },
      { value: "21+", label: "Years of craftsmanship" },
    ],
  },
  contact: {
    phones: ["9837866559", "9897055261"],
    whatsapp: "9837866559",
    address: "Moradabad, Uttar Pradesh, India",
    hours: "Mon – Sat · 9:30 AM – 8:00 PM",
    hoursSunday: "Sunday · By appointment",
    mapQuery: "Moradabad,Uttar+Pradesh,India",
  },
};

const KEY = "dgc.site-content.v2";
const EVENT = "dgc:content";

function mergeContent(parsed: Partial<SiteContent>): SiteContent {
  return {
    products: parsed.products ?? DEFAULT_CONTENT.products,
    testimonials: parsed.testimonials ?? DEFAULT_CONTENT.testimonials,
    offers: parsed.offers ?? DEFAULT_CONTENT.offers,
    social: { ...DEFAULT_CONTENT.social, ...(parsed.social ?? {}) },
    story: {
      ...DEFAULT_CONTENT.story,
      ...(parsed.story ?? {}),
      paragraphs: parsed.story?.paragraphs ?? DEFAULT_CONTENT.story.paragraphs,
      milestones: parsed.story?.milestones ?? DEFAULT_CONTENT.story.milestones,
    },
    contact: {
      ...DEFAULT_CONTENT.contact,
      ...(parsed.contact ?? {}),
      phones: parsed.contact?.phones ?? DEFAULT_CONTENT.contact.phones,
    },
  };
}

export function loadContent(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CONTENT;
    return mergeContent(JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function saveContent(content: SiteContent) {
  window.localStorage.setItem(KEY, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function resetContent() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** SSR renders defaults; the browser swaps in saved content after hydration. */
export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  const sync = useCallback(() => setContent(loadContent()), []);

  useEffect(() => {
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  return content;
}

export const newId = () => Math.random().toString(36).slice(2, 10);

/** Keep digits only, normalising a stored number for tel:/wa.me links. */
export const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** WhatsApp chat link for a stored local number (assumes India +91 when 10 digits). */
export function whatsappLink(number: string, text: string): string {
  const d = digitsOnly(number);
  const intl = d.length === 10 ? `91${d}` : d;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}

/** tel: link for a stored local number (assumes India +91 when 10 digits). */
export function telLink(number: string): string {
  const d = digitsOnly(number);
  return `tel:+${d.length === 10 ? `91${d}` : d}`;
}

/** Human-readable +91 format for a stored number. */
export function displayNumber(number: string): string {
  const d = digitsOnly(number);
  return d.length === 10 ? `+91 ${d}` : `+${d}`;
}
