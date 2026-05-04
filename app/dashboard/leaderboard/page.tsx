"use client";

import { useMemo, useState } from "react";
import { IconPodium, IconSparkles } from "@/components/dashboard-icons";
import { Badge, PageHeader } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  mockLeaderboardAllTime,
  mockLeaderboardMonthly,
  type MockLeaderboardEntry,
} from "@/lib/ui-mock";
import { sectionCard } from "@/lib/ui-styles";

function formatUsd(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  });
}

function PodiumBlock({
  place,
  entry,
  tall,
}: {
  place: 1 | 2 | 3;
  entry: MockLeaderboardEntry;
  tall: boolean;
}) {
  const ring =
    place === 1
      ? "ring-2 ring-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.35)]"
      : place === 2
        ? "ring-2 ring-slate-300"
        : "ring-2 ring-orange-400/80";
  const bar =
    place === 1
      ? "bg-gradient-to-b from-amber-400 via-amber-600 to-amber-950"
      : place === 2
        ? "bg-gradient-to-b from-slate-200 via-slate-400 to-slate-700"
        : "bg-gradient-to-b from-orange-200 via-amber-700 to-amber-950";

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white sm:h-[4.5rem] sm:w-[4.5rem]",
            entry.accent,
            ring
          )}
        >
          {entry.initials}
        </div>
        <span
          className={cn(
            "absolute -bottom-1 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md ring-2 ring-white",
            place === 1 ? "bg-amber-500" : place === 2 ? "bg-slate-500" : "bg-amber-700"
          )}
        >
          {place}
        </span>
      </div>
      <p className="mt-3 max-w-[7rem] truncate text-center text-xs font-semibold text-slate-900 sm:text-sm">
        {entry.name}
      </p>
      <p className="text-[11px] font-bold tabular-nums text-violet-600 sm:text-sm">
        {formatUsd(entry.earnedUsd)}
      </p>
      <div
        className={cn(
          "mt-3 flex w-full max-w-[9rem] flex-col items-center justify-end rounded-t-xl px-2 pt-3 text-white shadow-inner",
          tall ? "min-h-[7.5rem]" : "min-h-[5.5rem]",
          bar
        )}
      >
        {place === 1 ? (
          <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-100/95">
            Champion
          </span>
        ) : (
          <span className="sr-only">Top {place}</span>
        )}
        <span className="mb-3 text-lg" aria-hidden>
          {place === 1 ? "🏆" : place === 2 ? "🥈" : "🥉"}
        </span>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<"monthly" | "all">("all");

  const data =
    period === "all" ? mockLeaderboardAllTime : mockLeaderboardMonthly;

  const sorted = useMemo(
    () => [...data].sort((a, b) => a.rank - b.rank),
    [data]
  );

  const top3 = useMemo(() => sorted.filter((r) => r.rank <= 3), [sorted]);
  const podiumEntries: [MockLeaderboardEntry, MockLeaderboardEntry, MockLeaderboardEntry] =
    [
      top3.find((r) => r.rank === 2)!,
      top3.find((r) => r.rank === 1)!,
      top3.find((r) => r.rank === 3)!,
    ];

  const listRows = sorted.filter((r) => r.rank > 3);
  const you = sorted.find((r) => r.isYou);

  return (
    <div className="space-y-10">
      <PageHeader
        badge={
          <Badge variant="brand" uppercase={false} className="gap-2">
            <IconPodium className="h-3.5 w-3.5 text-violet-600" />
            Community
          </Badge>
        }
        title="Leaderboard"
        description="See how you stack up against other advocates. Rankings are mock data for
          layout — connect your ledger to drive real competition."
      />

      {/* Your snapshot */}
      <section
        className={cn(
          sectionCard,
          "relative overflow-hidden bg-gradient-to-br from-white via-violet-50/40 to-fuchsia-50/30"
        )}
      >
        <div
          className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold text-white shadow-lg ring-4 ring-white",
                  you?.accent ?? "from-violet-500 to-fuchsia-500"
                )}
              >
                {you?.initials ?? "?"}
              </div>
              {you ? (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md ring-2 ring-white">
                  Rank #{you.rank}
                </span>
              ) : null}
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{you?.name ?? "You"}</p>
              <p className="mt-1 text-sm text-slate-600">
                You&apos;re in the{" "}
                <span className="font-semibold text-violet-700">
                  top {period === "all" ? "5" : "15"}%
                </span>{" "}
                of advocates!
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-8 lg:justify-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Total earned
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-violet-700">
                {you ? formatUsd(you.earnedUsd) : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Impact level
              </p>
              <span className="mt-2 inline-flex rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                {you?.tier ?? "—"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Podium */}
      <section className={sectionCard}>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Top advocates
        </h2>
        <div className="mx-auto mt-8 flex max-w-lg items-end justify-center gap-2 sm:gap-6">
          <PodiumBlock place={2} entry={podiumEntries[0]} tall={false} />
          <PodiumBlock place={1} entry={podiumEntries[1]} tall />
          <PodiumBlock place={3} entry={podiumEntries[2]} tall={false} />
        </div>
      </section>

      {/* Rankings list */}
      <section className={sectionCard}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">Community rankings</h2>
          <div
            className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-semibold ring-1 ring-slate-200/80"
            role="group"
            aria-label="Ranking period"
          >
            <button
              type="button"
              onClick={() => setPeriod("monthly")}
              className={cn(
                "rounded-full px-4 py-2 transition",
                period === "monthly"
                  ? "bg-white text-violet-700 shadow-sm ring-1 ring-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setPeriod("all")}
              className={cn(
                "rounded-full px-4 py-2 transition",
                period === "all"
                  ? "bg-white text-violet-700 shadow-sm ring-1 ring-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              All-time
            </button>
          </div>
        </div>

        <ul className="mt-6 divide-y divide-slate-100">
          {listRows.map((row) => (
            <li key={`${period}-${row.rank}`}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-4 py-4 text-left transition hover:bg-slate-50/80",
                  row.isYou && "rounded-xl bg-violet-50/90 px-3 -mx-3 ring-1 ring-violet-100"
                )}
              >
                <span className="w-8 tabular-nums text-sm font-bold text-slate-500">
                  {row.rank}
                </span>
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
                    row.accent
                  )}
                >
                  {row.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{row.name}</span>
                    {row.isYou ? (
                      <span className="rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        You
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-500">{row.tier}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold tabular-nums text-violet-700">
                    {formatUsd(row.earnedUsd)}
                  </p>
                  <p className="text-[11px] text-violet-600/90">
                    {row.referrals} referrals
                  </p>
                </div>
                <span className="text-slate-300" aria-hidden>
                  ›
                </span>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-3 text-sm font-semibold text-slate-500 transition hover:border-violet-200 hover:bg-violet-50/50 hover:text-violet-800"
        >
          View all advocates
          <span aria-hidden className="text-lg leading-none">
            ⌄
          </span>
        </button>
      </section>

      <p className="text-center text-xs text-slate-400">
        <IconSparkles className="mr-1 inline h-3 w-3 text-amber-500" />
        Tip: pair leaderboard campaigns with social submissions to climb faster.
      </p>
    </div>
  );
}
