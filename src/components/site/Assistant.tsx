import { useEffect, useRef, useState } from "react";
import { Logo, WHATSAPP_LINK, WHATSAPP_NUMBER, PHONE_NUMBERS } from "./Brand";

type Msg = { from: "dg" | "you"; text: string };

const QUICK = [
  "Products & categories",
  "Price / free quote",
  "Do you install?",
  "Contact & timings",
];

function reply(input: string): string {
  const q = input.toLowerCase();
  if (/(price|cost|rate|quote|budget|kitna|paisa)/.test(q))
    return `Pricing depends on glass thickness, hardware and area. Share your size and location in the quote form, or WhatsApp us on ${WHATSAPP_NUMBER} for a same-day estimate.`;
  if (/(product|catalog|category|railing|shower|partition|mirror|acp|facade|skylight|decorative|toughened|staircase)/.test(q))
    return "We craft 10 categories — glass railings, toughened glass, facades, office partitions, shower enclosures, decorative glass, ACP cladding, LED mirrors, staircase railings and glass canopies. Scroll to Our Products to see each one.";
  if (/(install|fitting|team|service|warranty)/.test(q))
    return "Yes — in-house survey, fabrication and installation, with after-care support. Our teams handle villas, offices and high-rise sites.";
  if (/(contact|number|call|phone|address|location|time|hour|open)/.test(q))
    return `Call ${PHONE_NUMBERS[0]} or ${PHONE_NUMBERS[1]} (WhatsApp on ${WHATSAPP_NUMBER}). Moradabad, Uttar Pradesh. Mon–Sat, 9:30 AM – 8:00 PM.`;
  if (/(time|delivery|how long|days)/.test(q))
    return "Most residential jobs are delivered in 5–10 working days after measurement; facades are scheduled per drawing.";
  if (/(hi|hello|hey|namaste|salam)/.test(q))
    return "Hello! I'm the Dream Glass assistant. Ask me about products, pricing, installation or contact details.";
  return `I can help with products, pricing, installation and contact details. For anything specific, WhatsApp us on ${WHATSAPP_NUMBER} — our team replies quickly.`;
}

export function Assistant() {
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
    setMsgs((m) => [...m, { from: "you", text: v }, { from: "dg", text: reply(v) }]);
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
            href={WHATSAPP_LINK}
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
