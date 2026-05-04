"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBadgeMedal,
  IconCart,
  IconHeart,
  IconMapPin,
  IconOverview,
  IconPhoto,
  IconPodium,
  IconSettings,
  IconShield,
  IconSparkles,
  IconUser,
  IconWallet,
} from "@/components/dashboard-icons";
import { cn } from "@/lib/cn";
import { navItem } from "@/lib/ui-styles";

const links: {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { href: "/dashboard", label: "Overview", icon: IconOverview },
  { href: "/dashboard/profile", label: "Profile", icon: IconUser },
  { href: "/dashboard/orders", label: "Orders", icon: IconCart },
  { href: "/dashboard/addresses", label: "Addresses", icon: IconMapPin },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: IconHeart },
  { href: "/dashboard/submissions", label: "Social posts", icon: IconPhoto },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: IconPodium },
  { href: "/dashboard/badges", label: "Badges", icon: IconBadgeMedal },
  { href: "/dashboard/wallet", label: "Cashback", icon: IconWallet },
  { href: "/dashboard/settings", label: "Settings", icon: IconSettings },
];

export function DashboardNav({
  email,
  name,
  showAdmin,
}: {
  email: string;
  name: string;
  showAdmin: boolean;
}) {
  const pathname = usePathname();
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="relative flex h-full min-h-0 w-[17.5rem] shrink-0 flex-col bg-gradient-to-b from-[#0f0a1e] via-indigo-950 to-[#0c1229] py-7 pl-5 pr-3 text-white shadow-float md:pl-6">
      <div
        className="pointer-events-none absolute inset-0 bg-nav-shine opacity-90"
        aria-hidden
      />
      <div className="relative flex items-start gap-3 pr-1">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 text-sm font-bold text-white shadow-lg ring-2 ring-white/20">
          {initials}
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-300/90">
            <IconSparkles className="h-3 w-3 text-amber-300" />
            Rewards
          </p>
          <p className="mt-1 truncate text-sm font-semibold tracking-tight text-white">
            {name}
          </p>
          <p className="truncate text-xs text-indigo-200/85">{email}</p>
        </div>
      </div>

      <nav className="relative mt-10 flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
        {links.map((l) => {
          const active =
            l.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === l.href || pathname.startsWith(`${l.href}/`);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                active ? navItem.active : navItem.inactive
              )}
            >
              <span
                className={active ? navItem.iconActive : navItem.iconInactive}
              >
                <Icon className="h-4 w-4" />
              </span>
              {l.label}
            </Link>
          );
        })}
        {showAdmin && (
          <Link
            href="/admin"
            className="mt-5 flex items-center gap-3 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/25 to-orange-500/20 px-3 py-2.5 text-sm font-semibold text-amber-100 shadow-md ring-1 ring-amber-400/30 transition hover:from-amber-500/35 hover:to-orange-500/30"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/30 text-amber-100">
              <IconShield className="h-4 w-4" />
            </span>
            Admin panel
          </Link>
        )}
      </nav>

      <div className="relative mt-6 border-t border-white/[0.08] pt-5">
        <Link
          href="/login"
          className="text-sm text-indigo-200/80 transition hover:text-white"
        >
          ← Sign out
        </Link>
      </div>
    </aside>
  );
}
