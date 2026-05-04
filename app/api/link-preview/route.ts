import { NextResponse } from "next/server";

export const runtime = "nodejs";

function isSafePublicUrl(raw: string): URL | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.startsWith("127.") ||
      host === "0.0.0.0" ||
      host.endsWith(".local") ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return null;
    }
    return u;
  } catch {
    return null;
  }
}

function pickMeta(html: string, prop: string): string | null {
  const re = new RegExp(
    `<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${prop}["']`,
    "i"
  );
  return html.match(re)?.[1] ?? html.match(re2)?.[1] ?? null;
}

function pickNameMeta(html: string, name: string): string | null {
  const re = new RegExp(
    `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["']`,
    "i"
  );
  return html.match(re)?.[1] ?? html.match(re2)?.[1] ?? null;
}

function pickTitle(html: string): string | null {
  const og = pickMeta(html, "og:title");
  if (og) return decodeHtmlEntities(og.trim());
  const tw = pickNameMeta(html, "twitter:title");
  if (tw) return decodeHtmlEntities(tw.trim());
  const m = html.match(/<title[^>]*>([^<]{1,300})<\/title>/i);
  return m?.[1] ? decodeHtmlEntities(m[1].trim()) : null;
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number.parseInt(n, 10)));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ ok: false, error: "missing url" }, { status: 400 });
  }

  const parsed = isSafePublicUrl(raw);
  if (!parsed) {
    return NextResponse.json({
      ok: false,
      url: raw,
      title: null,
      description: null,
      image: null,
      siteName: null,
      error: "invalid or disallowed url",
    });
  }

  try {
    const res = await fetch(parsed.toString(), {
      redirect: "follow",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (compatible; BrandRewardsPreview/1.0; +https://example.com)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        url: parsed.toString(),
        title: null,
        description: null,
        image: null,
        siteName: null,
        error: `http ${res.status}`,
      });
    }

    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html") && !ct.includes("application/xhtml")) {
      return NextResponse.json({
        ok: false,
        url: parsed.toString(),
        title: null,
        description: null,
        image: null,
        siteName: null,
        error: "not html",
      });
    }

    const html = await res.text();
    const slice = html.slice(0, 500_000);

    let title = pickTitle(slice);
    let description =
      pickMeta(slice, "og:description") ??
      pickNameMeta(slice, "description") ??
      pickNameMeta(slice, "twitter:description");
    if (description) description = decodeHtmlEntities(description.trim());

    let image =
      pickMeta(slice, "og:image") ?? pickNameMeta(slice, "twitter:image");
    if (image && image.startsWith("//")) image = `https:${image}`;
    else if (image && image.startsWith("/")) image = `${parsed.origin}${image}`;

    const siteName =
      pickMeta(slice, "og:site_name") ??
      parsed.hostname.replace(/^www\./, "");

    if (!title) title = siteName ?? parsed.hostname;

    return NextResponse.json({
      ok: true,
      url: parsed.toString(),
      title,
      description,
      image,
      siteName,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return NextResponse.json({
      ok: false,
      url: parsed.toString(),
      title: null,
      description: null,
      image: null,
      siteName: null,
      error: msg,
    });
  }
}
