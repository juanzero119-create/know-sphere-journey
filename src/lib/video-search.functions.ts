import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type LiveVideo = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  views?: string;
  published?: string;
  duration?: string;
};

const inputSchema = z.object({
  query: z.string().trim().min(1).max(120),
});

// Keyless YouTube search via the public innertube endpoint.
export const searchVideos = createServerFn({ method: "POST" })
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<LiveVideo[]> => {
    const res = await fetch(
      "https://www.youtube.com/youtubei/v1/search?prettyPrint=false",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: {
            client: {
              clientName: "WEB",
              clientVersion: "2.20241001.01.00",
              hl: "en",
              gl: "US",
            },
          },
          query: data.query,
        }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`YouTube search failed [${res.status}]: ${body}`);
      throw new Error(`Video search failed [${res.status}]`);
    }
    const json = (await res.json()) as any;
    const sections =
      json?.contents?.twoColumnSearchResultsRenderer?.primaryContents
        ?.sectionListRenderer?.contents ?? [];
    const out: LiveVideo[] = [];
    for (const section of sections) {
      const items = section?.itemSectionRenderer?.contents ?? [];
      for (const item of items) {
        const v = item?.videoRenderer;
        if (!v?.videoId) continue;
        const title = (v.title?.runs ?? [])
          .map((r: any) => r?.text ?? "")
          .join("");
        const channel = (v.ownerText?.runs ?? [])
          .map((r: any) => r?.text ?? "")
          .join("");
        const thumbs = v.thumbnail?.thumbnails ?? [];
        out.push({
          id: v.videoId,
          title: title || "Untitled video",
          channel: channel || "Unknown channel",
          thumbnail: thumbs[thumbs.length - 1]?.url ?? "",
          views: v.viewCountText?.simpleText ?? undefined,
          published: v.publishedTimeText?.simpleText ?? undefined,
          duration: v.lengthText?.simpleText ?? undefined,
        });
        if (out.length >= 24) return out;
      }
    }
    return out;
  });
