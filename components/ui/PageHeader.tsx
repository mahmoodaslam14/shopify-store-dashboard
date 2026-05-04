import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { glass, radius, shadow, typography } from "@/lib/ui-styles";

type Props = {
  title: string;
  description?: string;
  badge?: ReactNode;
  className?: string;
};

/**
 * Hero-style header block used across dashboard & admin inner pages.
 */
export function PageHeader({ title, description, badge, className }: Props) {
  return (
    <header
      className={cn(
        "relative overflow-hidden",
        glass.panel,
        radius.card,
        shadow.brand,
        "p-8 md:p-10",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-violet-400/40 to-fuchsia-400/35 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-cyan-400/25 blur-3xl"
        aria-hidden
      />
      <div className="relative">
        {badge}
        <h1 className={cn(badge ? "mt-4" : "", typography.titleLg)}>{title}</h1>
        {description ? (
          <p className={cn("mt-4 max-w-2xl text-base leading-relaxed", typography.subtitle)}>
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
