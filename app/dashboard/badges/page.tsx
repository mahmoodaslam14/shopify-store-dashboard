import Link from "next/link";
import { IconBadgeMedal, IconSparkles } from "@/components/dashboard-icons";
import { Badge, Button, PageHeader } from "@/components/ui";
import { cn } from "@/lib/cn";
import { mockBadges, mockBadgeStats, type MockBadgeItem } from "@/lib/ui-mock";
import { sectionCard } from "@/lib/ui-styles";

const paletteRing: Record<MockBadgeItem["palette"], string> = {
  teal: "from-teal-400 to-cyan-500 shadow-teal-500/25",
  violet: "from-violet-500 to-purple-600 shadow-violet-500/25",
  amber: "from-amber-400 to-orange-500 shadow-amber-500/25",
  rose: "from-rose-400 to-pink-600 shadow-rose-500/25",
  slate: "from-slate-300 to-slate-500 shadow-slate-400/20",
};

function BadgeTile({ item }: { item: MockBadgeItem }) {
  const unlocked = item.unlocked;
  const grad = paletteRing[item.palette];

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-5 transition",
        unlocked
          ? "border-slate-200/90 bg-white shadow-md shadow-slate-200/40"
          : "border-slate-200/60 bg-slate-50/90 grayscale"
      )}
    >
      {!unlocked ? (
        <span
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/90 text-slate-500"
          title="Locked"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </span>
      ) : null}
      <div
        className={cn(
          "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
          grad,
          !unlocked && "opacity-40"
        )}
      >
        <IconBadgeMedal className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <p className="mt-4 text-center text-sm font-bold text-slate-900">{item.title}</p>
      <p
        className={cn(
          "mt-2 text-center text-xs font-semibold",
          unlocked ? "text-violet-700" : "text-slate-500"
        )}
      >
        {unlocked ? item.reward : item.hint ?? item.reward}
      </p>
    </div>
  );
}

export default function BadgesPage() {
  const stats = mockBadgeStats;

  return (
    <div className="space-y-10">
      <PageHeader
        badge={
          <Badge variant="brand" uppercase={false} className="gap-2">
            <IconBadgeMedal className="h-3.5 w-3.5 text-violet-600" />
            Achievements
          </Badge>
        }
        title="Achievement badges"
        description="Unlock perks, boosts, and bragging rights as you post, shop, and refer.
          Badges shown here are illustrative until your rewards program is wired up."
      />

      {/* Stats + tier progress */}
      <section
        className={cn(
          sectionCard,
          "flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
        )}
      >
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Earned
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
              {stats.earned}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Locked
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-500">
              {stats.locked}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Total XP
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-violet-700">
              {stats.totalXp.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="min-w-[min(100%,24rem)] flex-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>{stats.tierProgressPct}% to {stats.nextTierLabel}</span>
            <span className="text-violet-600">Keep going</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 transition-[width]"
              style={{ width: `${stats.tierProgressPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Collection
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {mockBadges.map((b) => (
            <BadgeTile key={b.id} item={b} />
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 p-8 text-white shadow-brand-lg">
          <div
            className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-fuchsia-500/30 blur-3xl"
            aria-hidden
          />
          <span className="relative inline-block rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-200 ring-1 ring-white/20">
            Premium reward
          </span>
          <h3 className="relative mt-4 text-xl font-bold leading-snug">
            Limited edition NFT badge
          </h3>
          <p className="relative mt-3 max-w-md text-sm leading-relaxed text-violet-100/85">
            Complete the full seasonal challenge set to mint a collectible badge tied to your
            storefront profile — coming when you enable web3 or digital perks.
          </p>
          <Button
            variant="secondary"
            type="button"
            className="relative mt-6 border-white/25 bg-white/10 text-white hover:bg-white/20"
          >
            How to unlock
          </Button>
        </div>

        <div className={cn(sectionCard, "flex flex-col justify-between")}>
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 ring-1 ring-violet-200/80">
              <IconSparkles className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Next cash reward</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              You are only{" "}
              <span className="font-semibold text-violet-700">
                {stats.pointsToNextCash} points
              </span>{" "}
              away from your next instant cashback drop.
            </p>
          </div>
          <Link
            href="/dashboard/wallet"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
          >
            View progress map
          </Link>
        </div>
      </section>

      <p className="text-center text-xs text-slate-400">
        Submit fresh social posts from{" "}
        <Link href="/dashboard/submissions" className="font-semibold text-violet-700 underline">
          Social posts
        </Link>{" "}
        to unlock streak badges faster.
      </p>
    </div>
  );
}
