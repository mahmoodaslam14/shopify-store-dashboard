"use client";

import Image from "next/image";
import { IconSparkles } from "@/components/dashboard-icons";
import { useState } from "react";
import { Button, PageHeader } from "@/components/ui";
import { cn } from "@/lib/cn";
import { mockWishlist, type MockWishItem } from "@/lib/ui-mock";
import { sectionCard } from "@/lib/ui-styles";

export default function WishlistPage() {
  const [items, setItems] = useState<MockWishItem[]>(mockWishlist);

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <PageHeader
        badge={
          <span className="inline-flex items-center gap-2 rounded-full bg-fuchsia-100/90 px-3 py-1 text-xs font-semibold text-fuchsia-900 ring-1 ring-fuchsia-200/80">
            <IconSparkles className="h-3.5 w-3.5 text-fuchsia-600" />
            Saved for later
          </span>
        }
        title="Wishlist"
        description="Heart products while browsing your storefront — we’ll surface them here with
          live prices when the catalog API is wired. Remove items anytime."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cn(sectionCard, "bg-gradient-to-br from-fuchsia-50 to-white")}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Items saved
          </p>
          <p className="mt-2 text-3xl font-bold text-fuchsia-800">{items.length}</p>
        </div>
        <div className={cn(sectionCard, "bg-gradient-to-br from-amber-50 to-white sm:col-span-2")}>
          <p className="text-sm font-semibold text-slate-900">Share your list</p>
          <p className="mt-1 text-sm text-slate-600">
            Gift links and “notify me” drops are perfect when you connect customer
            sessions.
          </p>
          <Button variant="secondary" type="button" className="mt-4 rounded-full text-xs" disabled>
            Copy share link (soon)
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={cn(sectionCard, "py-16 text-center")}>
          <p className="font-semibold text-slate-800">Your wishlist is empty</p>
          <p className="mt-2 text-sm text-slate-500">
            Tap the heart on product pages — items will appear here automatically.
          </p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                sectionCard,
                "group overflow-hidden p-0 transition hover:shadow-brand-lg"
              )}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <p className="font-semibold text-white drop-shadow">{item.title}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 p-5">
                <p className="text-xl font-bold tabular-nums text-slate-900">
                  {item.currency} {item.price}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" type="button" className="flex-1 rounded-full text-sm">
                    Add to cart
                  </Button>
                  <Button
                    variant="secondary"
                    type="button"
                    className="rounded-full text-sm"
                    onClick={() => remove(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
