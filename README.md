# Dream Glass Collection

Premium architectural glass website with a built-in admin panel — products across 10 categories, testimonials, offers, story, social links, and a rule-based DG Assistant that escalates unanswered questions to the contractor mobile.

## Run locally

```sh
bun install
bun run dev
```

## Admin panel

- URL: `/admin`
- Default passcode: `dreamglass2008` (change it in `src/routes/admin.tsx`, constant `PASSCODE`).
- Edits save to the browser (localStorage) and appear instantly — products, categories, images, testimonials, offers, story text, contact numbers/WhatsApp, and social links are all manageable.

## Deploy to Vercel

The repo includes `vercel.json` with the install/build commands.

1. Push this repo to GitHub and import it in Vercel (New Project → Import).
2. Framework preset: **Other**. Vercel picks up `vercel.json` automatically — install `bun install`, build `bun run build`.
3. Deploy. All routes (`/`, `/admin`) work without extra config.

## Deploy elsewhere

`bun run build` outputs a static/edge bundle via the Lovable Vite config; any static host (Netlify, Cloudflare Pages) works by publishing the build output.
