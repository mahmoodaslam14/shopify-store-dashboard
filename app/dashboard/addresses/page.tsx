"use client";

import { useState } from "react";
import Image from "next/image";
import { IconSparkles } from "@/components/dashboard-icons";
import { Button, PageHeader } from "@/components/ui";
import { cn } from "@/lib/cn";
import { mockAddresses, type MockAddress } from "@/lib/ui-mock";
import { sectionCard } from "@/lib/ui-styles";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<MockAddress[]>(mockAddresses);

  function setDefault(id: string) {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <PageHeader
        badge={
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100/90 px-3 py-1 text-xs font-semibold text-orange-900 ring-1 ring-orange-200/80">
            <IconSparkles className="h-3.5 w-3.5 text-orange-600" />
            Shipping
          </span>
        }
        title="Addresses"
        description="Save home, office, or pickup locations. Checkout will offer these when your
          storefront integration is connected — edits here are UI-only for now."
      />

      <div
        className={cn(
          sectionCard,
          "relative overflow-hidden border-0 bg-gradient-to-r from-slate-800 via-slate-700 to-violet-900 p-0 text-white"
        )}
      >
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative px-6 py-10 sm:px-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
            Map preview
          </p>
          <p className="mt-2 max-w-lg text-lg font-semibold leading-snug">
            Drop a Google Map embed or static pin when you wire geocoding — customers love
            confirming the right door.
          </p>
        </div>
      </div>

      <ul className="grid gap-5 md:grid-cols-2">
        {addresses.map((a) => (
          <li
            key={a.id}
            className={cn(
              sectionCard,
              "relative flex flex-col overflow-hidden bg-gradient-to-b from-white to-slate-50/80"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-lg font-bold text-slate-900">{a.label}</p>
              {a.isDefault ? (
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Default
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setDefault(a.id)}
                  className="text-xs font-semibold text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900"
                >
                  Make default
                </button>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {a.line1}
              {a.line2 && (
                <>
                  <br />
                  {a.line2}
                </>
              )}
              <br />
              {a.city}, {a.region} {a.postal}
              <br />
              {a.country}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" type="button" className="rounded-full text-xs">
                Edit (soon)
              </Button>
              <Button variant="secondary" type="button" className="rounded-full text-xs">
                Use at checkout
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <section
        className={cn(
          sectionCard,
          "border-2 border-dashed border-violet-300 bg-gradient-to-br from-violet-50/50 to-white"
        )}
      >
        <h2 className="text-lg font-bold text-slate-900">Add a new address</h2>
        <p className="mt-2 text-sm text-slate-600">
          Forms with validation, country rules, and Shopify sync ship with your backend
          milestone.
        </p>
        <Button
          variant="primary"
          type="button"
          disabled
          className="mt-5 rounded-full opacity-60"
        >
          Add address (coming soon)
        </Button>
      </section>
    </div>
  );
}
