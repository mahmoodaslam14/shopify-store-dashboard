"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { focusRing, inputBase, radius } from "@/lib/ui-styles";

export function LinkShopifyForm({ email }: { email: string }) {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const entered = String(fd.get("email") ?? "").trim();
    if (entered.toLowerCase() !== email.toLowerCase()) {
      setError("Email must match your account email.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setDone(true);
      setLoading(false);
    }, 500);
  }

  const input = cn(inputBase, radius.control, focusRing.brand, "px-4 py-2.5");

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      {done ? (
        <p className="text-sm font-medium text-emerald-800">
          Account linked (simulated).
        </p>
      ) : (
        <>
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}
          <div>
            <label className="text-xs font-medium text-slate-500">
              Confirm email (must match {email})
            </label>
            <input
              name="email"
              type="email"
              required
              defaultValue={email}
              className={cn("mt-2 w-full max-w-md", input)}
            />
          </div>
          <Button variant="primary" type="submit" disabled={loading} className="rounded-full">
            {loading ? "Linking…" : "Link Shopify customer"}
          </Button>
        </>
      )}
    </form>
  );
}
