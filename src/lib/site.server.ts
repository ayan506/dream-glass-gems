import { neon } from "@neondatabase/serverless";

import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "./site-content";

function db() {
  const url = process.env["DATABASE_URL"];
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

export function checkPasscode(passcode: string) {
  const expected = process.env["ADMIN_PASSCODE"] || "dreamglass2008";
  if (passcode !== expected) throw new Error("Incorrect passcode.");
}

export async function readContent(): Promise<SiteContent> {
  const sql = db();
  const rows = (await sql`select value from site_content where key = 'site'`) as { value: unknown }[];
  if (!rows[0]) return DEFAULT_CONTENT;
  return mergeContent(rows[0].value as Partial<SiteContent>);
}

export async function writeContent(content: SiteContent) {
  const sql = db();
  await sql`insert into site_content (key, value, updated_at)
    values ('site', ${JSON.stringify(content)}::jsonb, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()`;
  return { ok: true as const };
}

export type QuoteRow = {
  id: string;
  name: string;
  mobile: string;
  city: string | null;
  service: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export async function insertQuote(q: Omit<QuoteRow, "status" | "created_at">) {
  const sql = db();
  await sql`insert into quotes (id, name, mobile, city, service, message)
    values (${q.id}, ${q.name}, ${q.mobile}, ${q.city}, ${q.service}, ${q.message})`;
  return { ok: true as const };
}

export async function selectQuotes(): Promise<QuoteRow[]> {
  const sql = db();
  const rows = (await sql`select id, name, mobile, city, service, message, status,
    to_char(created_at, 'DD Mon YYYY, HH12:MI AM') as created_at
    from quotes order by created_at desc limit 500`) as unknown as QuoteRow[];
  return rows;
}

export async function setQuoteStatus(id: string, status: string) {
  const sql = db();
  await sql`update quotes set status = ${status} where id = ${id}`;
  return { ok: true as const };
}

export async function removeQuote(id: string) {
  const sql = db();
  await sql`delete from quotes where id = ${id}`;
  return { ok: true as const };
}

export async function insertMedia(m: {
  id: string;
  filename: string;
  contentType: string;
  data: string;
}) {
  const sql = db();
  await sql`insert into media (id, filename, content_type, data)
    values (${m.id}, ${m.filename}, ${m.contentType}, ${m.data})`;
  return { url: `/api/public/media/${m.id}` };
}

export async function selectMedia(id: string) {
  const sql = db();
  const rows = (await sql`select content_type, data from media where id = ${id}`) as {
    content_type: string;
    data: string;
  }[];
  return rows[0] ?? null;
}
