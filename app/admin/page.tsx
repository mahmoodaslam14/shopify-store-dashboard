import Link from "next/link";
import {
  IconChart,
  IconCheckCircle,
  IconInbox,
  IconShield,
} from "@/components/dashboard-icons";
import { mockAdminSubmissions } from "@/lib/ui-mock";

export default function AdminHomePage() {
  const pending = mockAdminSubmissions.filter((r) => r.status === "pending").length;
  const approved = mockAdminSubmissions.filter((r) => r.status === "approved").length;
  const rejected = mockAdminSubmissions.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-8 shadow-brand backdrop-blur-md md:p-10">
        <div
          className="pointer-events-none absolute -right-24 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-amber-400/40 to-rose-400/35 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-100/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-orange-900 ring-1 ring-orange-200/80">
            <IconShield className="h-3.5 w-3.5 text-rose-600" />
            Admin preview
          </p>
          <h1 className="mt-4 bg-gradient-to-r from-orange-900 via-rose-800 to-violet-800 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            Moderate cashback & keep fraud in check
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Review social posts, award points, and monitor submissions. Numbers
            below come from static mock data—swap in live queries when your API
            is ready.
          </p>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-6 text-white shadow-brand-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-100">
                Queue
              </p>
              <p className="mt-3 text-5xl font-bold tabular-nums">{pending}</p>
              <p className="mt-1 text-sm font-medium text-amber-50">pending review</p>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
              <IconInbox className="h-7 w-7" />
            </span>
          </div>
          <Link
            href="/admin/submissions"
            className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-orange-700 shadow-md transition hover:bg-amber-50"
          >
            Open queue
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-brand">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700/80">
                Approved
              </p>
              <p className="mt-3 text-5xl font-bold tabular-nums text-slate-900">{approved}</p>
              <p className="mt-1 text-sm text-slate-600">in mock dataset</p>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg">
              <IconCheckCircle className="h-7 w-7 text-white" strokeWidth={2} />
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-rose-200/90 bg-gradient-to-br from-rose-50 via-white to-orange-50 p-6 shadow-brand">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-700/80">
                Rejected
              </p>
              <p className="mt-3 text-5xl font-bold tabular-nums text-slate-900">{rejected}</p>
              <p className="mt-1 text-sm text-slate-600">with notes stored</p>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-orange-400 text-white shadow-lg">
              <IconShield className="h-6 w-6" />
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Link
          href="/admin/submissions"
          className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-6 shadow-brand backdrop-blur-md transition hover:border-orange-200 hover:shadow-brand-lg"
        >
          <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-gradient-to-br from-orange-400/30 to-rose-400/25 blur-2xl transition group-hover:opacity-80" />
          <div className="relative flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg">
              <IconInbox className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Submissions queue</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Approve with a point amount or reject with an optional note. Rows
                update in memory for this UI session.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange-700 group-hover:gap-2">
                Review posts →
              </span>
            </div>
          </div>
        </Link>

        <div className="relative overflow-hidden rounded-3xl border border-dashed border-violet-300/80 bg-gradient-to-br from-violet-50/90 via-white to-fuchsia-50/80 p-6 shadow-brand">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg">
              <IconChart className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Activity & fraud</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Charts, duplicate detection, and ledger reconciliation hook in
                next—placeholders keep the layout ready for Datadog / internal
                APIs.
              </p>
              <span className="mt-4 inline-block rounded-full bg-slate-200/80 px-3 py-1 text-xs font-semibold text-slate-500">
                Coming with backend
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
