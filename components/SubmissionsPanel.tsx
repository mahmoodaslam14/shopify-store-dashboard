"use client";

import { useState } from "react";
import { LinkPreviewCard } from "@/components/LinkPreviewCard";
import { Button, TextField } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  focusRing,
  inputBase,
  radius,
  sectionCard,
  typography,
} from "@/lib/ui-styles";
import {
  mockSubmissions,
  type MockSubmission,
} from "@/lib/ui-mock";

function statusBadge(status: MockSubmission["status"]) {
  if (status === "approved")
    return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  if (status === "rejected") return "bg-rose-100 text-rose-800 ring-rose-200";
  return "bg-amber-100 text-amber-900 ring-amber-200";
}

const textareaClass = cn(
  inputBase,
  radius.control,
  focusRing.brand,
  "min-h-[88px] px-4 py-3"
);

export function SubmissionsPanel() {
  const [rows, setRows] = useState<MockSubmission[]>(mockSubmissions);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const platform = String(fd.get("platform") ?? "").trim();
    const postUrl = String(fd.get("postUrl") ?? "").trim();
    if (!platform || !postUrl) {
      setError("Platform and URL are required.");
      return;
    }
    try {
      new URL(postUrl);
    } catch {
      setError("Please enter a valid URL including https://");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const notes = String(fd.get("notes") ?? "").trim() || null;
      const next: MockSubmission = {
        id: `local-${Date.now()}`,
        platform,
        postUrl,
        notes,
        status: "pending",
        pointsAwarded: 0,
        adminNote: null,
        createdAt: new Date().toISOString(),
      };
      setRows((r) => [next, ...r]);
      e.currentTarget.reset();
      setLoading(false);
    }, 400);
  }

  const pending = rows.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cn(sectionCard, "relative overflow-hidden bg-gradient-to-br from-violet-50 to-white")}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            In review
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-violet-700">{pending}</p>
          <p className="mt-1 text-xs text-slate-600">Awaiting moderator</p>
        </div>
        <div className={cn(sectionCard, "bg-gradient-to-br from-emerald-50/80 to-white")}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Approved
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-700">
            {rows.filter((r) => r.status === "approved").length}
          </p>
          <p className="mt-1 text-xs text-slate-600">Posts credited</p>
        </div>
        <div className={cn(sectionCard, "bg-gradient-to-br from-slate-50 to-white")}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Tips
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
            <li>• Public posts only</li>
            <li>• Brand visible in frame</li>
            <li>• One link per row</li>
          </ul>
        </div>
      </div>

      <form onSubmit={onSubmit} className={cn(sectionCard, "space-y-5")}>
        <div>
          <h2 className="text-lg font-bold text-slate-900">New submission</h2>
          <p className="mt-1 text-sm text-slate-600">
            Paste your post URL — we&apos;ll try to show a preview below. Many social
            apps block previews for logged-out fetches; you can always open the
            link.
          </p>
        </div>
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          <TextField
            id="sub-platform"
            name="platform"
            label="Platform"
            placeholder="instagram, tiktok, youtube…"
            required
            autoComplete="off"
            focusVariant="brand"
          />
          <TextField
            id="sub-url"
            name="postUrl"
            type="url"
            label="Post URL"
            placeholder="https://"
            required
            autoComplete="url"
            focusVariant="brand"
          />
        </div>
        <div>
          <label htmlFor="sub-notes" className={typography.label}>
            Notes <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="sub-notes"
            name="notes"
            rows={3}
            placeholder="Outfit context, campaign hashtag, or anything that helps reviewers."
            className={cn("mt-2 w-full", textareaClass)}
          />
        </div>
        <Button variant="primary" type="submit" disabled={loading} className="rounded-full">
          {loading ? "Submitting…" : "Submit for review"}
        </Button>
      </form>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Your submissions
          </h2>
          <span className="text-xs text-slate-500">{rows.length} total</span>
        </div>
        <ul className="space-y-6">
          {rows.length === 0 && (
            <li className={cn(sectionCard, "py-12 text-center text-sm text-slate-500")}>
              Nothing submitted yet — add your first link above.
            </li>
          )}
          {rows.map((s) => (
            <li
              key={s.id}
              className={cn(
                sectionCard,
                "overflow-hidden p-0 ring-1 ring-slate-100"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold capitalize text-slate-900">
                    {s.platform}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1",
                      statusBadge(s.status)
                    )}
                  >
                    {s.status}
                  </span>
                </div>
                <time className="text-xs text-slate-500">
                  {new Date(s.createdAt).toLocaleString()}
                </time>
              </div>
              <div className="p-5">
                <LinkPreviewCard url={s.postUrl} platform={s.platform} />
                {s.notes && (
                  <p className="mt-4 rounded-xl bg-violet-50/80 px-4 py-3 text-sm text-slate-700 ring-1 ring-violet-100">
                    <span className="font-semibold text-violet-900">Your note:</span>{" "}
                    {s.notes}
                  </p>
                )}
                {s.pointsAwarded > 0 && (
                  <p className="mt-3 text-sm font-semibold text-emerald-700">
                    +{s.pointsAwarded} points credited
                  </p>
                )}
                {s.adminNote && (
                  <p className="mt-2 text-xs text-rose-700">
                    Moderator: {s.adminNote}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
