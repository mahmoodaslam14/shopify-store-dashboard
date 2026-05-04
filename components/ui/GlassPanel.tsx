import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { glass, radius, shadow } from "@/lib/ui-styles";

type Variant = "default" | "strong" | "auth";

const variantClass: Record<Variant, string> = {
  default: cn(glass.panel, radius.panel),
  strong: cn(glass.panelStrong, radius.panel),
  /** overflow-hidden keeps inner content from visually square-ing the shell */
  auth: cn(glass.authCard, radius.authForm, "overflow-hidden"),
};

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: Variant;
  /** Extra ring (auth login vs signup) */
  ring?: "login" | "signup";
};

/** Subtle outer rim only — avoids stacking with authCard border + inset shadows */
const ringMap = {
  login: "ring-1 ring-violet-400/25",
  signup: "ring-1 ring-cyan-400/25",
};

export function GlassPanel({
  children,
  variant = "default",
  ring,
  className,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        variantClass[variant],
        ring && ringMap[ring],
        variant !== "auth" && shadow.brand,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
