import { createServerFn } from "@tanstack/react-start";

import type { SiteContent } from "./site-content";

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { readContent } = await import("./site.server");
  return readContent();
});

export const saveSiteContent = createServerFn({ method: "POST" })
  .inputValidator((data: { passcode: string; content: SiteContent }) => data)
  .handler(async ({ data }) => {
    const { checkPasscode, writeContent } = await import("./site.server");
    checkPasscode(data.passcode);
    return writeContent(data.content);
  });

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { passcode: string }) => data)
  .handler(async ({ data }) => {
    const { checkPasscode } = await import("./site.server");
    checkPasscode(data.passcode);
    return { ok: true as const };
  });

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((data: { name: string; mobile: string; city: string; service: string; message: string }) => {
    const clean = (v: string, max: number) => String(v ?? "").trim().slice(0, max);
    const out = {
      name: clean(data.name, 100),
      mobile: clean(data.mobile, 25),
      city: clean(data.city, 100),
      service: clean(data.service, 100),
      message: clean(data.message, 2000),
    };
    if (!out.name || !out.mobile) throw new Error("Name and mobile are required.");
    return out;
  })
  .handler(async ({ data }) => {
    const { insertQuote } = await import("./site.server");
    const id = `q_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
    await insertQuote({ id, ...data });
    return { ok: true as const, id };
  });

export const listQuotes = createServerFn({ method: "POST" })
  .inputValidator((data: { passcode: string }) => data)
  .handler(async ({ data }) => {
    const { checkPasscode, selectQuotes } = await import("./site.server");
    checkPasscode(data.passcode);
    return selectQuotes();
  });

export const updateQuoteStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { passcode: string; id: string; status: string }) => data)
  .handler(async ({ data }) => {
    const { checkPasscode, setQuoteStatus } = await import("./site.server");
    checkPasscode(data.passcode);
    return setQuoteStatus(data.id, data.status);
  });

export const deleteQuote = createServerFn({ method: "POST" })
  .inputValidator((data: { passcode: string; id: string }) => data)
  .handler(async ({ data }) => {
    const { checkPasscode, removeQuote } = await import("./site.server");
    checkPasscode(data.passcode);
    return removeQuote(data.id);
  });

export const uploadMedia = createServerFn({ method: "POST" })
  .inputValidator((data: { passcode: string; filename: string; contentType: string; base64: string }) => {
    if (!/^(image\/(png|jpeg|jpg|webp|gif|avif|svg\+xml)|application\/pdf)$/.test(data.contentType)) {
      throw new Error("Only image or PDF files are allowed.");
    }
    if (data.base64.length > 20_000_000) throw new Error("File is too large (max ~14MB).");
    return data;
  })
  .handler(async ({ data }) => {
    const { checkPasscode, insertMedia } = await import("./site.server");
    checkPasscode(data.passcode);
    const id = `m_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    return insertMedia({
      id,
      filename: data.filename.slice(0, 120),
      contentType: data.contentType,
      data: data.base64,
    });
  });
