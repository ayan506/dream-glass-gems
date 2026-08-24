import { useEffect, useRef, useState } from "react";
import { Logo } from "./Brand";
import {
  displayNumber,
  useSiteContent,
  whatsappLink,
  type SiteContent,
} from "@/lib/site-content";

type Msg = { from: "dg" | "you"; text: string };

const QUICK = [
  "Products & categories",
  "Price / free quote",
  "Current offers",
  "Do you install?",
  "Warranty?",
  "Contact & timings",
];

/**
 * Rule-based knowledge base. Each rule matches common phrasings (English +
 * Hinglish) and answers from the live site content so admin edits (products,
 * offers, contact numbers) are reflected in replies immediately.
 */
function reply(input: string, content: SiteContent): string {
  const q = input.toLowerCase();
  const { contact, products, offers, social, story } = content;

  const contractor = contact.phones[0] ? displayNumber(contact.phones[0]) : "";
  const phoneList = contact.phones.map(displayNumber).join(" or ");
  const wa = displayNumber(contact.whatsapp);
  const fallback = contractor
    ? `I'm not able to answer that one accurately. Please call our contractor directly on ${contractor} — he'll help you right away. You can also WhatsApp ${wa}.`
    : `I'm not able to answer that one accurately. Please call our contractor on the mobile number shown in the Contact section of this website — the team will help you right away.`;

  const active = offers.filter((o) => o.active);

  // greetings / small talk
  if (/^(hi+|hello+|hey+|namaste|namaskar|salam|salaam|good\s*(morning|afternoon|evening))\b/.test(q))
    return "Hello! I'm the DG Assistant for Dream Glass Collection. Ask me about our products, pricing, installation, offers, warranty or contact details.";
  if (/(thank|shukriya|dhanyavad)/.test(q))
    return "You're most welcome! If you'd like a same-day estimate, tap “Continue on WhatsApp” below or use the Get Free Quote form.";
  if (/^(bye|goodbye|ok bye|alvida)\b/.test(q))
    return `Goodbye! For anything else, call ${phoneList} — we're happy to help.`;

  // products & categories
  const catHit = products.find(
    (p) =>
      q.includes(p.title.toLowerCase()) ||
      (p.cat.length > 4 && q.includes(p.cat.toLowerCase())),
  );
  if (catHit)
    return `${catHit.title} (${catHit.cat}) — ${catHit.note}. Scroll to Our Products to see photos, or tap Enquire on its card to WhatsApp us about it directly.`;
  if (/(product|catalog|catalogue|category|categories|range|what (do|can) you (make|do|offer)|items|collection)/.test(q))
    return `We craft 10 categories — ${[...new Set(products.map((p) => p.cat))].join(", ")}. Scroll to Our Products and use the arrows or category filters to browse.`;

  // specific services
  if (/(railing|balcony|balustrade|spigot)/.test(q))
    return "Our railings use 12mm toughened glass with SS spigots or aluminium channels — frameless, semi-frameless and with wooden or steel handrails. Site measurement is free for larger orders.";
  if (/(shower|bathroom|bath|enclosure)/.test(q))
    return "Frameless shower enclosures in 8–10mm toughened glass with premium chrome, black or gold hardware, made to your bathroom's exact size.";
  if (/(facade|curtain wall|spider|cladding|elevation|structural glazing)/.test(q))
    return "We execute structural glazing, spider glazing and ACP cladding for commercial elevations — engineered per drawing, with our own installation teams for high-rise work.";
  if (/(partition|office|cabin|acoustic|workspace)/.test(q))
    return "Office partitions in slim aluminium or frameless profiles, single or double glazed, with acoustic options and integrated doors.";
  if (/(mirror|led mirror|looking glass)/.test(q))
    return "Custom mirrors — backlit LED, antique, bevelled, wall-to-wall — cut to any shape with anti-fog options for bathrooms.";
  if (/(acp|aluminium composite|signage)/.test(q))
    return "ACP work covers elevation cladding, grooved designer panels and signage backing in fire-rated grades.";
  if (/(skylight|canopy|pergola|roof glass)/.test(q))
    return "Canopies and skylights use laminated toughened glass with weather-sealed framing — safe overhead and built for monsoon conditions.";
  if (/(stair|staircase|steps)/.test(q))
    return "Staircase glass railings with clamps or channel fixing, paired with wooden or steel handrails, measured on site for a perfect fit.";
  if (/(decorative|fluted|frosted|lacquered|back.?painted|designer glass|art glass)/.test(q))
    return "Decorative glass includes fluted, frosted, lacquered and back-painted panels for wardrobes, kitchens, doors and feature walls.";
  if (/(toughened|tempered|laminated|glass type|thickness|mm)/.test(q))
    return "We supply certified toughened (6–19mm), laminated, double-glazed and heat-strengthened glass, edge-polished and cut to architectural spec.";

  // price / quote
  if (/(price|cost|rate|quote|estimate|budget|kitna|paisa|charge|expense|sq\.?\s?ft|square feet)/.test(q))
    return `Pricing depends on glass thickness, hardware, finish and area, so we quote per site. Share your size and city in the Get Free Quote form, or WhatsApp ${wa} for a same-day estimate.`;
  if (/(discount|offer|deal|coupon|promo)/.test(q))
    return active.length
      ? `Current offers: ${active.map((o) => `${o.title} — ${o.detail}`).join(" · ")}`
      : "No running offers right now, but ask on WhatsApp — we often have seasonal pricing.";

  // process / service
  if (/(install|fitting|fix|service|team|labour|execution)/.test(q))
    return "Yes — everything is handled in-house: site survey, drawing, fabrication and installation by our own trained teams, for villas, offices and high-rise sites.";
  if (/(site visit|survey|measure|measurement|home visit)/.test(q))
    return `We do free site surveys and measurements for qualifying orders. Call ${phoneList} or send your address on WhatsApp (${wa}) and we'll schedule a visit.`;
  if (/(warrant|guarantee|after.?sales|after.?care|support)/.test(q))
    return "All installations carry workmanship after-care, and hardware carries manufacturer warranty. If anything needs adjustment, our team revisits — just call or WhatsApp us.";
  if (/(time|delivery|how long|days|duration|deadline|timeline)/.test(q))
    return "Most residential jobs are delivered in 5–10 working days after measurement. Facades and large commercial work are scheduled per drawing approval.";
  if (/(safety|safe|break|broken|crack|shatter|scratch|quality|standard|isi|certified)/.test(q))
    return "We use certified toughened and laminated safety glass that meets architectural standards — up to 5x stronger than ordinary glass, and it granulates rather than shards if ever broken.";
  if (/(maintain|maintenance|clean|care|stain|water spot)/.test(q))
    return "Toughened glass needs only mild soap water and a soft cloth. Avoid abrasive pads; for shower glass, a weekly squeegee prevents water spots.";
  if (/(payment|emi|advance|booking amount|upi|cash)/.test(q))
    return `We typically work with a booking advance and balance on completion, via UPI, bank transfer or cash. Confirm current terms on ${phoneList}.`;
  if (/(custom|customi|made.?to.?measure|bespoke|size|dimension|design)/.test(q))
    return "Almost everything we make is custom — measured on site, drawn for your approval, then fabricated to the millimetre.";

  // company / story
  if (/(story|about|history|experience|since when|old|who are you|company|background|journey)/.test(q))
    return `${story.lead} ${story.milestones.map((m) => `${m.value} ${m.label.toLowerCase()}`).join(" · ")}. Read the full Our Story section on this page.`;
  if (/(where|location|address|city|area|serve|moradabad|branch|shop)/.test(q))
    return `We're based in ${contact.address} and serve the surrounding region — facades and larger projects across North India. See the map in the Contact section.`;

  // contact / hours / social
  if (/(contact|number|call|phone|mobile|whatsapp|talk|speak)/.test(q))
    return `Call ${phoneList}. WhatsApp is available on ${wa}. ${contact.hours} · ${contact.hoursSunday}.`;
  if (/(time|timing|hour|open|close|sunday|holiday|when.*open)/.test(q))
    return `${contact.hours}. ${contact.hoursSunday}. WhatsApp messages are answered through the day.`;
  if (/(facebook|instagram|youtube|social|follow)/.test(q)) {
    const links = [
      social.facebook && `Facebook: ${social.facebook}`,
      social.instagram && `Instagram: ${social.instagram}`,
      social.youtube && `YouTube: ${social.youtube}`,
    ].filter(Boolean);
    return links.length
      ? `Follow us — ${links.join(" · ")}`
      : "Our social links are being updated — check the icons in the website footer.";
  }
  if (/(email|mail)/.test(q))
    return `Fastest is WhatsApp on ${wa} or a call to ${phoneList} — we share drawings and estimates there directly.`;

  // humans / escalation
  if (/(human|person|agent|owner|contractor|manager|sir|boss)/.test(q))
    return contractor
      ? `You can speak to our contractor directly on ${contractor} (call), or WhatsApp ${wa}.`
      : "Please call the contractor on the mobile number shown in the Contact section of this website.";

  if (/(admin|login|edit website)/.test(q))
    return "The admin panel is for the studio team. If you're the site owner, open /admin and enter the studio passcode.";

  return fallback;
}

export function Assistant() {
  const content = useSiteContent();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "dg", text: "Welcome to Dream Glass Collection. How can I help you today?" },
  ]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs, open]);

  const send = (value: string) => {
    const v = value.trim();
    if (!v) return;
    setMsgs((m) => [...m, { from: "you", text: v }, { from: "dg", text: reply(v, content) }]);
    setText("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Dream Glass assistant"
        className="glass-panel fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-border/70 py-2 pl-2 pr-5 transition-transform hover:-translate-y-1"
      >
        <Logo className="h-10 w-10" />
        <span className="text-left leading-tight">
          <span className="block text-[0.58rem] uppercase tracking-[0.28em] text-muted-foreground">Ask</span>
          <span className="block text-sm font-medium text-foreground">DG Assistant</span>
        </span>
      </button>

      {open && (
        <div className="glass-panel fixed bottom-24 right-5 z-50 flex h-[26rem] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border/70">
          <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
            <Logo className="h-9 w-9" />
            <div className="leading-tight">
              <p className="text-sm font-semibold">DG Assistant</p>
              <p className="text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">Online now</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="ml-auto text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.from === "dg"
                    ? "bg-secondary text-foreground"
                    : "ml-auto bg-primary text-primary-foreground"
                }`}
              >
                {m.text}
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-border px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
            className="flex items-center gap-2 border-t border-border/60 p-3"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your question…"
              className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button type="submit" className="btn-primary shrink-0 px-4">
              Send
            </button>
          </form>
          <a
            href={whatsappLink(content.contact.whatsapp, "Hi Dream Glass Collection, I would like to enquire about your glass solutions.")}
            target="_blank"
            rel="noreferrer"
            className="border-t border-border/60 py-2 text-center text-[0.65rem] uppercase tracking-[0.22em] text-primary"
          >
            Continue on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
