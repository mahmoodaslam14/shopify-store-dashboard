"use client";

import type { ComponentType, ReactNode, SVGProps } from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/cn";

export type AuthVariant = "login" | "signup";

type Bullet = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
};

type Props = {
  variant: AuthVariant;
  eyebrow: string;
  headline: string;
  subhead: string;
  bullets: Bullet[];
  children: ReactNode;
  footer: ReactNode;
};

const accentPalette = [
  {
    selectedOutline: "ring-cyan-400/55",
    iconBox:
      "bg-gradient-to-br from-cyan-400/35 to-teal-600/45 ring-1 ring-cyan-300/35",
    icon: "text-cyan-50",
  },
  {
    selectedOutline: "ring-violet-400/55",
    iconBox:
      "bg-gradient-to-br from-violet-400/35 to-purple-700/45 ring-1 ring-violet-300/35",
    icon: "text-violet-50",
  },
  {
    selectedOutline: "ring-fuchsia-400/55",
    iconBox:
      "bg-gradient-to-br from-fuchsia-400/35 to-rose-600/45 ring-1 ring-fuchsia-300/35",
    icon: "text-fuchsia-50",
  },
] as const;

export function AuthSplitShell({
  variant,
  eyebrow,
  headline,
  subhead,
  bullets,
  children,
  footer,
}: Props) {
  const [selected, setSelected] = useState(0);
  const sceneClass =
    variant === "login" ? "auth-scene-login" : "auth-scene-signup";
  const badgeVariant = variant === "login" ? "authLogin" : "authSignup";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className={`auth-scene-base ${sceneClass}`} aria-hidden />
      <div className="auth-scene-base auth-sheen" aria-hidden />
      <div className="auth-scene-base auth-grain" aria-hidden />

      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/3 top-0 h-64 w-64 rounded-full bg-violet-500/20 blur-[80px]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Mobile — compact hero */}
        <div className="relative px-6 pb-2 pt-10 text-center lg:hidden">
          <div className="flex justify-center">
            <BrandLogo size="md" />
          </div>
          <div className="mt-6 flex justify-center">
            <Badge variant={badgeVariant} compact>
              {eyebrow}
            </Badge>
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-white">
            {headline}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            {subhead}
          </p>
        </div>

        {/* Desktop — full hero column */}
        <aside className="relative hidden flex-1 flex-col justify-between px-8 pb-16 pt-16 text-white lg:flex lg:max-w-xl lg:px-12 xl:max-w-2xl xl:px-16">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent"
            aria-hidden
          />
          <div className="relative">
            <BrandLogo size="sm" />

            <div className="mt-10">
              <Badge variant={badgeVariant}>{eyebrow}</Badge>
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight xl:text-[3.25rem]">
              {headline}
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
              {subhead}
            </p>
          </div>

          <ul className="relative mt-12 space-y-3" role="list">
            {bullets.map((b, i) => {
              const Icon = b.icon;
              const pal = accentPalette[i % accentPalette.length];
              const isSelected = selected === i;
              return (
                <li key={b.title}>
                  <button
                    type="button"
                    aria-current={isSelected ? "true" : undefined}
                    onClick={() => setSelected(i)}
                    className={cn(
                      "flex w-full gap-4 rounded-2xl border p-4 text-left backdrop-blur-md transition duration-200",
                      "border-white/10 bg-white/[0.06]",
                      "hover:border-white/28 hover:bg-white/[0.11]",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
                      isSelected &&
                        cn(
                          "border-white/40 bg-white/[0.14] shadow-lg shadow-black/30 ring-2 ring-offset-2 ring-offset-transparent",
                          pal.selectedOutline
                        )
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition",
                        pal.iconBox,
                        isSelected && "scale-[1.03] shadow-md shadow-black/30"
                      )}
                    >
                      <Icon
                        className={cn("h-6 w-6", pal.icon)}
                        strokeWidth={1.6}
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{b.title}</p>
                      <p className="mt-0.5 text-sm text-white/65">{b.desc}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="relative mt-10 text-xs text-white/45">
            UI preview — connect your auth API when ready.
          </p>
        </aside>

        {/* Form */}
        <main className="relative flex flex-1 flex-col justify-center px-4 pb-12 pt-2 sm:px-8 lg:px-12 lg:pb-16 lg:pt-8 xl:px-20">
          <GlassPanel
            variant="auth"
            ring={variant === "login" ? "login" : "signup"}
            className="mx-auto w-full max-w-md p-7 sm:p-10"
          >
            {children}
            <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
              {footer}
            </div>
          </GlassPanel>

          <p className="mx-auto mt-6 max-w-md text-center text-[11px] leading-relaxed text-white/45 lg:hidden">
            Preview mode: submitting skips real authentication and opens the
            dashboard mock.
          </p>
        </main>
      </div>
    </div>
  );
}
