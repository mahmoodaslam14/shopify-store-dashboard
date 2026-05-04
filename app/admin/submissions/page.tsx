import { AdminSubmissionQueue } from "@/components/AdminSubmissionQueue";
import { IconInbox, IconShield } from "@/components/dashboard-icons";

export default function AdminSubmissionsPage() {
  return (
    <div className="max-w-5xl space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-8 shadow-brand backdrop-blur-md md:p-10">
        <div
          className="pointer-events-none absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-gradient-to-br from-orange-400/35 to-transparent blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start gap-6">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg">
            <IconInbox className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-2 rounded-full bg-rose-100/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-rose-900 ring-1 ring-rose-200/80">
              <IconShield className="h-3.5 w-3.5" />
              Moderation
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Social submissions
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
              Approve to credit points to the customer wallet, or reject with a
              note the shopper will see. Filters and actions below use front-end
              mock state only.
            </p>
          </div>
        </div>
      </section>

      <AdminSubmissionQueue />
    </div>
  );
}
