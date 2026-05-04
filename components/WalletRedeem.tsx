"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  focusRing,
  inputBase,
  radius,
  sectionCard,
  typography,
} from "@/lib/ui-styles";
import { pointsPerCurrencyUnit } from "@/lib/ui-mock";

type Props = {
  balance: number;
  onRedeemSuccess: (pointsSpent: number) => void;
};

const input = cn(inputBase, radius.control, focusRing.brand, "px-4 py-2.5");

export function WalletRedeem({ balance, onRedeemSuccess }: Props) {
  const [points, setPoints] = useState("200");
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCode(null);
    const n = parseInt(points, 10);
    if (Number.isNaN(n) || n < 1) {
      setError("Enter a valid number of points.");
      return;
    }
    if (n > balance) {
      setError("Not enough points.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      onRedeemSuccess(n);
      setCode(`SAVE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
      setLoading(false);
    }, 600);
  }

  return (
    <div className={sectionCard}>
      <h2 className="text-sm font-semibold text-slate-900">Redeem at checkout</h2>
      <p className="mt-1 text-sm text-slate-600">
        Generates a one-time discount code (mock). When live, this will call
        Shopify to create a price rule.
      </p>
      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      {code && (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Your code: <strong className="font-mono">{code}</strong>
        </p>
      )}
      <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-end gap-4">
        <div>
          <label className={typography.label}>Points</label>
          <input
            type="number"
            min={1}
            max={balance}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className={cn("mt-2 block w-36 tabular-nums", input)}
          />
        </div>
        <Button
          variant="primary"
          type="submit"
          disabled={loading || balance < 1}
          className="rounded-full px-6"
        >
          {loading ? "Creating…" : "Redeem"}
        </Button>
      </form>
      <p className="mt-4 text-xs text-slate-500">
        {pointsPerCurrencyUnit} points ≈ 1 unit of currency at redemption (demo
        ratio).
      </p>
    </div>
  );
}
