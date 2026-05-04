import Link from "next/link";
import { IconSparkles } from "@/components/dashboard-icons";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/cn";
import { glass, marketing, radius } from "@/lib/ui-styles";

export default function HomePage() {
  return (
    <div className="dash-bg min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-0">
        <div className="max-w-xl lg:py-20">
          <Badge variant="brand" uppercase={false} className="gap-2 ring-violet-400/30">
            <IconSparkles className="h-3.5 w-3.5 text-amber-500" />
            Rewards studio
          </Badge>
          <h1 className="mt-6 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-orange-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl md:leading-[1.1]">
            Wear it. Share it. Get paid back.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            A colorful hub for orders, social cashback, and wallet redemptions —
            this preview uses mock data so you can judge the experience before
            wiring Shopify.
          </p>
          <div className="mt-10 flex w-full max-w-md flex-col gap-3">
            <Link href="/login" className={marketing.ctaPrimary}>
              Sign in
            </Link>
            <Link href="/signup" className={marketing.ctaSecondary}>
              Create account
            </Link>
            <Link href="/dashboard" className={marketing.textLink}>
              Skip to dashboard →
            </Link>
          </div>
        </div>

        <div className="mt-14 grid w-full max-w-md gap-4 lg:mt-0 lg:max-w-lg">
          {[
            {
              t: "Social cashback",
              d: "Submit posts · admins award points",
              from: "from-fuchsia-500",
              to: "to-purple-600",
            },
            {
              t: "Shopify orders",
              d: "Synced customer history",
              from: "from-cyan-400",
              to: "to-blue-600",
            },
            {
              t: "Wallet",
              d: "Redeem at checkout",
              from: "from-amber-400",
              to: "to-orange-500",
            },
          ].map((c) => (
            <div
              key={c.t}
              className={cn(
                "relative overflow-hidden p-5",
                glass.panel,
                radius.card
              )}
            >
              <div
                className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${c.from} ${c.to} opacity-25 blur-2xl`}
                aria-hidden
              />
              <div
                className={`relative mb-3 inline-block h-1.5 w-12 rounded-full bg-gradient-to-r ${c.from} ${c.to}`}
              />
              <p className="relative text-base font-bold text-slate-900">{c.t}</p>
              <p className="relative mt-1 text-sm text-slate-600">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
