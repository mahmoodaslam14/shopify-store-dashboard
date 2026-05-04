import Link from "next/link";
import { IconSparkles } from "@/components/dashboard-icons";
import { PageHeader } from "@/components/ui";
import { cn } from "@/lib/cn";
import { mockOrders } from "@/lib/ui-mock";
import { glass, radius, sectionCard } from "@/lib/ui-styles";

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "ok" | "warn" | "muted";
}) {
  const map = {
    ok: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    warn: "bg-amber-100 text-amber-900 ring-amber-200",
    muted: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1",
        map[tone]
      )}
    >
      {label}
    </span>
  );
}

function financialTone(s: string): "ok" | "warn" | "muted" {
  const x = s.toLowerCase();
  if (x.includes("paid")) return "ok";
  if (x.includes("pending") || x.includes("partial")) return "warn";
  return "muted";
}

function fulfillTone(s: string): "ok" | "warn" | "muted" {
  const x = s.toLowerCase();
  if (x.includes("fulfilled")) return "ok";
  if (x.includes("progress") || x.includes("unfulfilled")) return "warn";
  return "muted";
}

export default function OrdersPage() {
  const total = mockOrders.reduce(
    (acc, o) => acc + Number.parseFloat(o.total),
    0
  );

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <PageHeader
        badge={
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100/90 px-3 py-1 text-xs font-semibold text-cyan-900 ring-1 ring-cyan-200/80">
            <IconSparkles className="h-3.5 w-3.5 text-cyan-600" />
            Order history
          </span>
        }
        title="Orders"
        description="Every purchase tied to your Shopify customer record will land here with
          payment and fulfillment status. Below is sample data for layout — replace with
          live API responses."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cn(sectionCard, "bg-gradient-to-br from-cyan-50 to-white")}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Orders (sample)
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
            {mockOrders.length}
          </p>
        </div>
        <div className={cn(sectionCard, "bg-gradient-to-br from-violet-50 to-white")}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Lifetime value (mock)
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-violet-800">
            ${total.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500">USD · demo totals</p>
        </div>
        <div className={cn(glass.panel, radius.card, "p-5")}>
          <p className="text-sm font-semibold text-slate-900">Need help?</p>
          <p className="mt-1 text-xs text-slate-600">
            Track shipments and returns from your store email until webhooks are on.
          </p>
          <Link
            href="/dashboard/settings"
            className="mt-3 inline-block text-xs font-semibold text-violet-700 underline"
          >
            Shopify settings →
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Fulfilled", "In progress"].map((f, i) => (
          <button
            key={f}
            type="button"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              i === 0
                ? "bg-slate-900 text-white shadow-md"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            )}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-slate-400">
          Filters are visual only
        </span>
      </div>

      <ul className="space-y-4">
        {mockOrders.map((o) => (
          <li
            key={o.id}
            className={cn(
              sectionCard,
              "flex flex-col gap-4 p-0 sm:flex-row sm:items-center sm:justify-between"
            )}
          >
            <div className="border-b border-slate-100 px-6 py-4 sm:border-b-0 sm:border-r sm:py-6">
              <p className="text-lg font-bold text-slate-900">{o.orderNumber}</p>
              <p className="mt-1 text-xs text-slate-500">{o.date}</p>
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-3 px-6 pb-4 sm:py-4">
              <StatusPill label={o.financialStatus} tone={financialTone(o.financialStatus)} />
              <StatusPill
                label={o.fulfillmentStatus}
                tone={fulfillTone(o.fulfillmentStatus)}
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-6 py-4 sm:border-l sm:border-t-0 sm:px-8">
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total
                </p>
                <p className="text-xl font-bold tabular-nums text-slate-900">
                  {o.total}{" "}
                  <span className="text-sm font-semibold text-slate-500">{o.currency}</span>
                </p>
              </div>
              <button
                type="button"
                disabled
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-400"
              >
                Track
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
