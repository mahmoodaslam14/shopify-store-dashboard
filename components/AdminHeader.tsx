"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconInbox,
  IconShield,
  IconSparkles,
} from "@/components/dashboard-icons";
import { adminHeader } from "@/lib/ui-styles";

const nav = [
  { href: "/admin", label: "Overview", icon: IconHome, exact: true },
  { href: "/admin/submissions", label: "Submissions", icon: IconInbox, exact: false },
];

export function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 relative overflow-hidden border-b border-white/20 shadow-float">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-950 via-orange-950 to-rose-950" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(251,191,36,0.35), transparent 50%), radial-gradient(circle at 80% 30%, rgba(244,63,94,0.25), transparent 45%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-center gap-8">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow-lg ring-2 ring-white/25">
              <IconShield className="h-5 w-5" />
            </span>
            <span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/90">
                <IconSparkles className="h-3 w-3 text-amber-300" />
                Console
              </span>
              <span className="block text-sm font-bold tracking-tight text-white">
                Rewards admin
              </span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-2">
            {nav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-md ring-1 ring-white/25 backdrop-blur-sm"
                      : "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-amber-100/85 transition hover:bg-white/10 hover:text-white"
                  }
                >
                  <Icon className="h-4 w-4 opacity-90" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard" className={adminHeader.customerLink}>
            ← Customer view
          </Link>
          <Link href="/login" className={adminHeader.signOutLink}>
            Sign out
          </Link>
        </div>
      </div>
    </header>
  );
}
