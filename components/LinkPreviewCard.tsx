"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type PreviewState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "loaded";
      title: string | null;
      description: string | null;
      image: string | null;
      siteName: string | null;
      ok: boolean;
    }
  | { status: "error"; message: string };

function hostnameOnly(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function LinkPreviewCard({
  url,
  platform,
  className,
}: {
  url: string;
  platform: string;
  className?: string;
}) {
  const [state, setState] = useState<PreviewState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    const q = `/api/link-preview?url=${encodeURIComponent(url)}`;
    fetch(q)
      .then((r) => r.json())
      .then(
        (data: {
          ok?: boolean;
          title?: string | null;
          description?: string | null;
          image?: string | null;
          siteName?: string | null;
          error?: string;
        }) => {
          if (cancelled) return;
          if (data.ok) {
            setState({
              status: "loaded",
              title: data.title ?? null,
              description: data.description ?? null,
              image: data.image ?? null,
              siteName: data.siteName ?? null,
              ok: true,
            });
          } else {
            setState({
              status: "loaded",
              title: hostnameOnly(url),
              description: data.error
                ? `Preview unavailable (${data.error}). Open the link to view the post.`
                : "We couldn’t fetch a preview (many networks block bots). Tap open to view.",
              image: null,
              siteName: hostnameOnly(url),
              ok: false,
            });
          }
        }
      )
      .catch(() => {
        if (cancelled) return;
        setState({
          status: "loaded",
          title: hostnameOnly(url),
          description:
            "Preview couldn’t load. Your submission is still saved — open the link to verify.",
          image: null,
          siteName: hostnameOnly(url),
          ok: false,
        });
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (state.status === "error") {
    return (
      <p className="text-xs text-rose-600">{state.message}</p>
    );
  }

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div
        className={cn(
          "flex animate-pulse gap-4 rounded-2xl border border-slate-200/90 bg-slate-50 p-4",
          className
        )}
      >
        <div className="h-24 w-28 shrink-0 rounded-xl bg-slate-200" />
        <div className="flex flex-1 flex-col gap-2 py-1">
          <div className="h-4 max-w-[85%] rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-5/6 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  const { title, description, image, siteName, ok } = state;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div
          className={cn(
            "relative h-36 shrink-0 bg-gradient-to-br sm:h-auto sm:w-40",
            ok
              ? "from-violet-100 to-fuchsia-100"
              : "from-slate-100 to-slate-200"
          )}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- dynamic OG URLs from arbitrary hosts
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover sm:absolute sm:inset-0"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full min-h-[9rem] flex-col items-center justify-center p-3 text-center sm:min-h-full">
              <span className="text-2xl font-bold capitalize text-violet-600/90">
                {platform.slice(0, 2)}
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {siteName ?? hostnameOnly(url)}
              </span>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center p-4 pt-2 sm:py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {siteName ?? hostnameOnly(url)}
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
            {title ?? "Link"}
          </p>
          {description ? (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
              {description}
            </p>
          ) : null}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900"
          >
            Open in new tab
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
