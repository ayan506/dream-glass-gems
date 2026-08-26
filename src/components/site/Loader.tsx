import { useEffect, useState } from "react";

import { clampDuration, type Loader as LoaderSettings } from "@/lib/site-content";
import { LOGO_URL } from "./Brand";

const SEEN_KEY = "dgc.loader.seen";

/**
 * Entrance loading screen. Shown once per browser session so in-app navigation
 * never re-triggers it. Everything here is admin-configurable.
 */
export function EntranceLoader({ settings }: { settings: LoaderSettings }) {
  const duration = clampDuration(settings.durationMs);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!settings.enabled) return;
    if (window.sessionStorage.getItem(SEEN_KEY) === "1") return;
    window.sessionStorage.setItem(SEEN_KEY, "1");
    setVisible(true);

    const start = Date.now();
    const tick = window.setInterval(() => {
      setProgress(Math.min(100, ((Date.now() - start) / duration) * 100));
    }, 60);
    const done = window.setTimeout(() => setVisible(false), duration);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [settings.enabled, duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <img
        src={settings.logo || LOGO_URL}
        alt=""
        className="h-24 w-24 animate-pulse rounded-full object-contain"
        width={96}
        height={96}
      />
      <div>
        <h1 className="font-display text-4xl font-semibold tracking-[0.12em] text-foreground md:text-5xl">
          {settings.title}
        </h1>
        <p
          className="mt-3 text-xl text-primary md:text-2xl"
          style={{ fontFamily: '"Brush Script MT", "Segoe Script", cursive' }}
        >
          {settings.tagline}
        </p>
      </div>
      <div className="h-[3px] w-56 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
