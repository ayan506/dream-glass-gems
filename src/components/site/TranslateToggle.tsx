import { useEffect, useState } from "react";

/**
 * Small English ⇄ हिंदी toggle powered by the Google Translate website widget.
 * The widget banner/UI is hidden (see styles.css); we only drive its hidden
 * <select> so the page translates in place without changing the design.
 */
const COOKIE = "googtrans";

function setTranslateCookie(lang: string) {
  const value = lang === "hi" ? "/en/hi" : "/en/en";
  const host = window.location.hostname;
  document.cookie = `${COOKIE}=${value};path=/`;
  document.cookie = `${COOKIE}=${value};path=/;domain=.${host}`;
}

function currentLang(): "en" | "hi" {
  return document.cookie.includes(`${COOKIE}=/en/hi`) ? "hi" : "en";
}

export function TranslateToggle({ className = "" }: { className?: string }) {
  const [lang, setLang] = useState<"en" | "hi">("en");

  useEffect(() => {
    setLang(currentLang());

    if (document.getElementById("google-translate-script")) return;
    (window as unknown as Record<string, unknown>)["googleTranslateElementInit"] = () => {
      const g = (window as unknown as { google?: { translate?: { TranslateElement?: unknown } } }).google;
      const TE = g?.translate?.TranslateElement as
        | (new (opts: Record<string, unknown>, el: string) => void)
        | undefined;
      if (TE) new TE({ pageLanguage: "en", includedLanguages: "en,hi", autoDisplay: false }, "google_translate_element");
    };
    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const toggle = () => {
    const next = lang === "hi" ? "en" : "hi";
    setTranslateCookie(next);
    setLang(next);
    const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
    if (select) {
      select.value = next;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <button
        onClick={toggle}
        aria-label={lang === "hi" ? "Switch site to English" : "हिंदी में देखें"}
        className={`notranslate rounded-full border border-border px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground ${className}`}
      >
        {lang === "hi" ? "EN" : "हिंदी"}
      </button>
      <div id="google_translate_element" className="hidden" aria-hidden />
    </>
  );
}
