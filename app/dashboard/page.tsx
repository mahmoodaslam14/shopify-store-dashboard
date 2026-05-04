import type { SVGProps } from "react";
import Link from "next/link";
import { IconPhoto, IconSparkles, IconWallet } from "@/components/dashboard-icons";
import { Badge, PageHeader } from "@/components/ui";
import {
  mockBalance,
  mockShopify,
  mockUser,
  mockActivity,
} from "@/lib/ui-mock";

function IconStore(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a1.5 1.5 0 00-1.5-1.5h-9A1.5 1.5 0 001.5 13.5v7.5M13.5 21h9M13.5 21v-7.5a1.5 1.5 0 011.5-1.5h3M6 10.5V6a3 3 0 013-3h6a3 3 0 013 3v4.5M3 10.5h18M9 6h6" />
    </svg>
  );
}

export default function DashboardHomePage() {
  const first = mockUser.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-12">
      <PageHeader
        badge={
          <Badge variant="brand" uppercase={false} className="gap-2">
            <IconSparkles className="h-3.5 w-3.5 text-amber-500" />
            Dashboard preview
          </Badge>
        }
        title={`Hey ${first} — here’s your rewards pulse`}
        description="Mock data for layout only. When you connect Shopify and your ledger, these cards update in real time."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {/* Wallet */}
        <div className="card-sheen group relative overflow-hidden rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-brand-lg">
          <div
            className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-white/20 blur-2xl"
            aria-hidden
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-100/90">
                Cashback
              </p>
              <p className="mt-4 text-5xl font-bold tabular-nums tracking-tight">
                {mockBalance.toLocaleString()}
              </p>
              <p className="mt-1 text-sm font-medium text-violet-100">points ready</p>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/30 backdrop-blur-sm">
              <IconWallet className="h-7 w-7 text-white" />
            </span>
          </div>
          <Link
            href="/dashboard/wallet"
            className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-md transition group-hover:bg-violet-50"
          >
            Open wallet
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Shopify */}
        <div className="card-sheen relative overflow-hidden rounded-3xl border border-cyan-200/90 bg-gradient-to-br from-cyan-50 via-white to-sky-50 p-6 shadow-brand">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700/80">
                Shopify
              </p>
              <p className="mt-4 text-xl font-bold text-slate-900">
                {mockShopify.connected ? "Connected" : "Not linked yet"}
              </p>
              <p className="mt-2 text-sm leading-snug text-slate-600">
                {mockShopify.connected
                  ? mockShopify.shopDomain
                  : "Connect your store customer to sync orders & discounts."}
              </p>
            </div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 text-white shadow-lg">
              <IconStore className="h-8 w-8" strokeWidth={1.5} />
            </span>
          </div>
          <Link
            href="/dashboard/settings"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 underline decoration-cyan-300 underline-offset-4 hover:text-cyan-900"
          >
            Account settings
          </Link>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl border border-orange-200/90 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-50 p-6 shadow-brand sm:col-span-2 xl:col-span-1">
          <div
            className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-orange-400/30 blur-2xl"
            aria-hidden
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-800/80">
              Earn more
            </p>
            <p className="mt-3 text-lg font-bold text-slate-900">
              Post your fit — get points
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Drop a link to your public post featuring the brand. Our team scores
              engagement and credits your wallet.
            </p>
            <Link
              href="/dashboard/submissions"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/35 transition hover:from-orange-600 hover:to-rose-600"
            >
              <IconPhoto className="h-4 w-4" />
              Submit a post
            </Link>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Recent activity
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Ledger-style timeline (placeholder copy)
            </p>
          </div>
        </div>
        <ul className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-brand backdrop-blur-md">
          {mockActivity.map((a, i) => {
            const gain = a.points > 0;
            return (
              <li
                key={a.id}
                className={`flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm ${
                  i !== mockActivity.length - 1 ? "border-b border-slate-100/90" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                      gain
                        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/80"
                        : "bg-rose-100 text-rose-700 ring-1 ring-rose-200/80"
                    }`}
                  >
                    {gain ? "+" : "−"}
                  </span>
                  <span className="font-medium text-slate-800">{a.label}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`tabular-nums text-sm font-bold ${
                      gain ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {gain ? "+" : ""}
                    {a.points} pts
                  </span>
                  <span className="text-xs font-medium text-slate-400">{a.at}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
