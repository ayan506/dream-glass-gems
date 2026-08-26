import { useEffect, useMemo, useRef, useState } from "react";

import { useSiteContent, displayNumber, type SiteContent } from "@/lib/site-content";
import type { Faq } from "@/lib/assistant-faqs";

type Lang = "en" | "hi" | "hinglish";
type Msg = { id: string; from: "bot" | "user"; text: string };

const HINGLISH_MARKERS = [
  "kya","hai","hain","kaise","kaisa","kitna","kitne","kaun","kahan","kab","kyu","kyun","nahi","haan",
  "aap","tum","mera","meri","mujhe","hume","chahiye","batao","bataiye","karna","karo","kar","ho","hoga",
  "acha","achha","theek","thik","bhai","ji","paisa","paise","daam","kimat","naap","ghar","banwana",
  "lagega","milega","krna","krna","bhej","dena","sakte","sakta","namaste","salam","assalam","shukriya",
  "dhanyavad","alvida","hum","apna","wala","wale","bohot","bahut","zyada","kam","jaldi",
];

/** Devanagari → hi, Roman Hindi words → hinglish, otherwise English. */
export function detectLang(text: string): Lang {
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  const words = text.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "en";
  const hits = words.filter((w) => HINGLISH_MARKERS.includes(w)).length;
  return hits / words.length >= 0.25 || hits >= 2 ? "hinglish" : "en";
}

function fill(text: string, c: SiteContent): string {
  const phones = c.contact.phones.filter(Boolean);
  return text
    .replace(/\{phone\}/g, displayNumber(phones[0] ?? c.contact.whatsapp))
    .replace(/\{phone2\}/g, displayNumber(phones[1] ?? phones[0] ?? c.contact.whatsapp))
    .replace(/\{whatsapp\}/g, displayNumber(c.contact.whatsapp))
    .replace(/\{hours\}/g, c.contact.hours)
    .replace(/\{address\}/g, c.contact.address);
}

const answerFor = (faq: Faq, lang: Lang) => (lang === "hi" ? faq.hi : lang === "hinglish" ? faq.hinglish : faq.en);

/** Simple keyword scoring across the editable knowledge base. */
export function matchFaq(message: string, faqs: Faq[]): Faq | null {
  const text = ` ${message.toLowerCase().trim()} `;
  let best: Faq | null = null;
  let bestScore = 0;
  for (const faq of faqs) {
    let score = 0;
    for (const raw of faq.tags.split(",")) {
      const tag = raw.trim().toLowerCase();
      if (!tag) continue;
      if (text.includes(` ${tag} `) || text.includes(tag)) score += tag.length + (tag.includes(" ") ? 4 : 0);
    }
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }
  return bestScore >= 3 ? best : null;
}

const uid = () => Math.random().toString(36).slice(2, 9);

export function Assistant() {
  const content = useSiteContent();
  const { assistant, contact } = content;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const welcome = useMemo(
    () => fill(assistant.welcomeEn, content),
    [assistant.welcomeEn, content],
  );

  useEffect(() => {
    if (open && msgs.length === 0) setMsgs([{ id: uid(), from: "bot", text: welcome }]);
  }, [open, msgs.length, welcome]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  if (!assistant.enabled) return null;

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const lang = detectLang(text);
    const faq = matchFaq(text, assistant.faqs);
    const reply = faq
      ? answerFor(faq, lang)
      : lang === "hi"
        ? assistant.fallbackHi
        : lang === "hinglish"
          ? assistant.fallbackHinglish
          : assistant.fallbackEn;

    setMsgs((m) => [
      ...m,
      { id: uid(), from: "user", text },
      { id: uid(), from: "bot", text: fill(reply, content) },
    ]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close DG Assistant" : "Open DG Assistant"}
        className="btn-primary fixed bottom-5 right-5 z-[70] h-14 rounded-full px-5 shadow-lg"
      >
        {open ? "Close" : "DG Assistant"}
      </button>

      {open && (
        <div className="glass-panel fixed bottom-24 right-4 z-[70] flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">{assistant.title}</p>
              <p className="text-[0.6rem] uppercase tracking-[0.26em] text-muted-foreground">
                English · हिंदी · Hinglish
              </p>
            </div>
            <a href={`tel:${contact.phones[0] ?? contact.whatsapp}`} className="text-xs text-primary">
              Call
            </a>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "bot"
                    ? "bg-card text-foreground"
                    : "ml-auto bg-primary text-primary-foreground"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {assistant.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-border/60 px-4 py-2">
              {assistant.suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border/60 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type in English, हिंदी or Hinglish…"
              className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button type="submit" className="btn-primary h-10 shrink-0 rounded-full px-4">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
