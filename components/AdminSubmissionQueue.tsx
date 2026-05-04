"use client";

import type { ComponentType, SVGProps } from "react";
import { useMemo, useState } from "react";
import {
  mockAdminSubmissions,
  type AdminSubmissionRow,
} from "@/lib/ui-mock";
import {
  IconCheckCircle,
  IconClock,
  IconInbox,
  IconPhoto,
  IconXCircle,
} from "@/components/dashboard-icons";

type Filter = "pending" | "approved" | "rejected" | "all";

const filters: {
  id: Filter;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { id: "pending", label: "Pending", icon: IconClock },
  { id: "approved", label: "Approved", icon: IconCheckCircle },
  { id: "rejected", label: "Rejected", icon: IconXCircle },
  { id: "all", label: "All", icon: IconInbox },
];

function statusBadge(status: AdminSubmissionRow["status"]) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1";
  if (status === "approved")
    return `${base} bg-emerald-100 text-emerald-800 ring-emerald-200/90`;
  if (status === "rejected")
    return `${base} bg-rose-100 text-rose-800 ring-rose-200/90`;
  return `${base} bg-amber-100 text-amber-900 ring-amber-200/90`;
}

export function AdminSubmissionQueue() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [rows, setRows] = useState<AdminSubmissionRow[]>(mockAdminSubmissions);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  function approve(id: string, points: number) {
    setError(null);
    setMutating(id);
    window.setTimeout(() => {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "approved" as const,
                pointsAwarded: points,
                adminNote: null,
              }
            : r
        )
      );
      setMutating(null);
    }, 300);
  }

  function reject(id: string, adminNote: string) {
    setError(null);
    setMutating(id);
    window.setTimeout(() => {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "rejected" as const,
                pointsAwarded: 0,
                adminNote: adminNote || null,
              }
            : r
        )
      );
      setMutating(null);
    }, 300);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {filters.map(({ id, label, icon: Icon }) => {
          const active = filter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={
                active
                  ? "flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30"
                  : "flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-orange-200 hover:bg-white"
              }
            >
              <Icon className="h-4 w-4 opacity-90" />
              {label}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 shadow-sm">
          {error}
        </p>
      )}

      <ul className="space-y-4">
        {filtered.length === 0 && (
          <li className="rounded-3xl border border-dashed border-orange-300/80 bg-white/60 px-8 py-16 text-center shadow-sm backdrop-blur-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <IconInbox className="h-7 w-7" />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-800">
              Nothing in this filter
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try another tab or wait for new submissions.
            </p>
          </li>
        )}
        {filtered.map((r) => {
          const edge =
            r.status === "approved"
              ? "border-l-emerald-500"
              : r.status === "rejected"
                ? "border-l-rose-500"
                : "border-l-amber-500";
          const bg =
            r.status === "pending"
              ? "bg-gradient-to-r from-amber-50/90 via-white to-orange-50/50"
              : "bg-white/85";

          return (
            <li
              key={r.id}
              className={`relative overflow-hidden rounded-3xl border border-white/70 ${bg} shadow-brand backdrop-blur-md`}
            >
              <div className={`border-l-4 ${edge} p-6 md:p-7`}>
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-md">
                        <IconPhoto className="h-5 w-5" />
                      </span>
                      <span className="font-semibold capitalize text-slate-900">
                        {r.platform}
                      </span>
                      <span className={statusBadge(r.status)}>{r.status}</span>
                    </div>
                    <a
                      href={r.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block break-all text-sm font-medium text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900"
                    >
                      {r.postUrl}
                    </a>
                    {r.notes && (
                      <p className="rounded-xl bg-white/80 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-100">
                        <span className="font-semibold text-orange-800">Member:</span>{" "}
                        {r.notes}
                      </p>
                    )}
                    {r.adminNote && (
                      <p className="rounded-xl bg-rose-50/90 px-4 py-3 text-sm text-rose-900 ring-1 ring-rose-100">
                        <span className="font-semibold">Admin note:</span> {r.adminNote}
                      </p>
                    )}
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-400">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">
                        {r.userEmail}
                      </span>
                      <span>{new Date(r.createdAt).toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-end">
                    {r.status === "pending" && (
                      <div className="flex flex-col gap-3 rounded-2xl border border-orange-200/80 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-end">
                        <ApproveInline
                          busy={mutating === r.id}
                          onApprove={(pts) => approve(r.id, pts)}
                        />
                        <RejectInline
                          busy={mutating === r.id}
                          onReject={(note) => reject(r.id, note)}
                        />
                      </div>
                    )}
                    {r.pointsAwarded > 0 && (
                      <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200 sm:min-w-[8rem]">
                        +{r.pointsAwarded} pts
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ApproveInline({
  busy,
  onApprove,
}: {
  busy: boolean;
  onApprove: (points: number) => void;
}) {
  const [pts, setPts] = useState("50");
  return (
    <div className="flex flex-wrap items-end gap-2">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
          Points
        </label>
        <input
          type="number"
          min={1}
          value={pts}
          onChange={(e) => setPts(e.target.value)}
          className="mt-1 w-24 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold tabular-nums shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
        />
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() => onApprove(parseInt(pts, 10) || 1)}
        className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/25 transition hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
      >
        Approve
      </button>
    </div>
  );
}

function RejectInline({
  busy,
  onReject,
}: {
  busy: boolean;
  onReject: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  return (
    <div className="flex min-w-[200px] flex-col gap-2">
      <label className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
        Rejection note
      </label>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Reason shown to customer…"
        className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => onReject(note)}
        className="rounded-full border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-2 text-sm font-bold text-rose-900 transition hover:border-rose-400 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
