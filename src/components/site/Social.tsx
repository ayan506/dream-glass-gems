import type { Social } from "@/lib/site-content";

const icons = {
  facebook: (
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5H16.6V4.4A20 20 0 0 0 14.3 4c-2.3 0-3.8 1.4-3.8 4v2.5H8v3h2.5V21z" />
  ),
  instagram: (
    <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.44.43.7.83.92 1.4.17.42.37 1.05.42 2.25.06 1.27.07 1.65.07 4.86s-.01 3.6-.07 4.86c-.05 1.2-.25 1.83-.42 2.25-.22.57-.48.97-.92 1.4-.42.42-.82.68-1.4.9-.42.17-1.05.37-2.24.42-1.28.06-1.66.07-4.87.07s-3.6 0-4.86-.07c-1.2-.05-1.83-.25-2.25-.42a3.9 3.9 0 0 1-1.4-.9 3.9 3.9 0 0 1-.9-1.4c-.17-.42-.37-1.05-.43-2.25C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.86c.06-1.2.26-1.83.43-2.25.22-.57.48-.97.9-1.4.42-.42.82-.68 1.4-.9.42-.17 1.05-.37 2.25-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25Zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38Zm7-11.4a1.58 1.58 0 1 1-1.58-1.57A1.58 1.58 0 0 1 19 4.98Z" />
  ),
  youtube: (
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.26 5 12 5 12 5s-6.26 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.74 19 12 19 12 19s6.26 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.02V8.98L15.2 12Z" />
  ),
};

const order: (keyof Social)[] = ["facebook", "instagram", "youtube"];

export function SocialLinks({
  social,
  className = "",
  size = "h-9 w-9",
}: {
  social: Social;
  className?: string;
  size?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {order.map((k) => {
        const href = social[k];
        if (!href) return null;
        return (
          <a
            key={k}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Dream Glass Collection on ${k}`}
            className={`${size} flex items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              {icons[k]}
            </svg>
          </a>
        );
      })}
    </div>
  );
}
