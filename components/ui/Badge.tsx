import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { radius } from "@/lib/ui-styles";

type Variant =
  | "brand"
  | "accent"
  | "admin"
  | "authLogin"
  | "authSignup"
  | "orange";

const map: Record<Variant, string> = {
  brand:
    "bg-violet-100/90 text-violet-800 ring-violet-200/80",
  accent:
    "bg-cyan-100/90 text-cyan-900 ring-cyan-200/80",
  admin:
    "bg-orange-100/90 text-orange-900 ring-orange-200/80",
  authLogin:
    "bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 text-violet-100 ring-white/20",
  authSignup:
    "bg-gradient-to-r from-cyan-500/30 to-violet-500/30 text-cyan-50 ring-white/20",
  orange:
    "bg-orange-100/90 text-orange-900 ring-orange-200/80",
};

type Props = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: Variant;
  /** Smaller caps label */
  compact?: boolean;
  /** Default is all-caps; set false for sentence case (e.g. dashboard chips). */
  uppercase?: boolean;
};

export function Badge({
  children,
  variant = "brand",
  compact,
  uppercase = true,
  className,
  ...rest
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 ring-1",
        radius.pill,
        compact
          ? uppercase
            ? "px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
            : "px-3 py-1 text-xs font-semibold tracking-tight"
          : uppercase
            ? "px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em]"
            : "px-4 py-1.5 text-xs font-semibold tracking-tight",
        map[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
