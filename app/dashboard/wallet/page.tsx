"use client";

import { useState } from "react";
import { IconSparkles, IconWallet } from "@/components/dashboard-icons";
import { PageHeader } from "@/components/ui";
import { WalletRedeem } from "@/components/WalletRedeem";
import { cn } from "@/lib/cn";
import { mockActivity, mockBalance, pointsPerCurrencyUnit } from "@/lib/ui-mock";
import { sectionCard } from "@/lib/ui-styles";

export default function WalletPage() {
  const [balance, setBalance] = useState(mockBalance);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <PageHeader
        badge={
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100/90 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200/80">
            <IconWallet className="h-3.5 w-3.5 text-amber-700" />
            Cashback
          </span>
        }
        title="Your rewards wallet"
        description="Points from approved social posts stack here. Redeem for one-time discount
          codes at checkout when Shopify discount APIs are connected — the flow below is
          fully interactive in this UI mock."
      />

      <div
        className={cn(
          sectionCard,
          "relative overflow-hidden border-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 p-8 text-white shadow-brand-lg"
        )}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-100">
              Available balance
            </p>
            <p className="mt-2 text-5xl font-bold tabular-nums tracking-tight">
              {balance.toLocaleString()}
            </p>
            <p className="mt-1 text-sm font-medium text-violet-100">points</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-4 py-3 text-right ring-1 ring-white/25 backdrop-blur-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-100">
              Redemption
            </p>
            <p className="mt-1 text-sm text-white">
              {pointsPerCurrencyUnit} pts ≈ 1 unit in cart
            </p>
          </div>
        </div>
        <p className="relative mt-6 flex items-center gap-2 text-xs text-violet-100">
          <IconSparkles className="h-4 w-4 text-amber-200" />
          Pro tip: redeem in smaller chunks to keep codes easy to share with friends.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={cn(sectionCard, "bg-gradient-to-br from-emerald-50 to-white")}>
          <p className="text-sm font-semibold text-slate-900">Next milestone</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">500 pts</p>
          <p className="mt-1 text-xs text-slate-600">Unlock bonus tier (placeholder).</p>
        </div>
        <div className={cn(sectionCard, "bg-gradient-to-br from-slate-50 to-white")}>
          <p className="text-sm font-semibold text-slate-900">Expiring points</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">None</p>
          <p className="mt-1 text-xs text-slate-600">Set a policy in admin when live.</p>
        </div>
      </div>

      <WalletRedeem
        balance={balance}
        onRedeemSuccess={(pts) => setBalance((b) => b - pts)}
      />

      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Activity
        </h2>
        <ul className="mt-4 space-y-3">
          {mockActivity.map((a) => (
            <li
              key={a.id}
              className={cn(
                sectionCard,
                "flex flex-wrap items-center justify-between gap-2 py-4"
              )}
            >
              <span className="text-sm font-medium text-slate-800">{a.label}</span>
              <span
                className={cn(
                  "text-sm font-bold tabular-nums",
                  a.points > 0 ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {a.points > 0 ? "+" : ""}
                {a.points} pts
              </span>
              <span className="w-full text-xs text-slate-400 sm:w-auto">{a.at}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
