import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/media/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { selectMedia } = await import("@/lib/site.server");
        const row = await selectMedia(params.id);
        if (!row) return new Response("Not found", { status: 404 });
        const bytes = Uint8Array.from(atob(row.data), (c) => c.charCodeAt(0));
        return new Response(bytes, {
          headers: {
            "content-type": row.content_type,
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
