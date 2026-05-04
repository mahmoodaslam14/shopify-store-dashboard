import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { gradientBtn, radius } from "@/lib/ui-styles";

const buttonVariants = {
  primary:
    gradientBtn.brand +
    " " +
    radius.control +
    " px-5 py-3 text-sm w-full justify-center",
  primaryAccent:
    gradientBtn.accent +
    " " +
    radius.control +
    " px-5 py-3 text-sm w-full justify-center",
  secondary:
    cn(
      radius.control,
      "border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
    ),
  /** OAuth-style — solid surface so icons don’t sit on bare white */
  social:
    cn(
      radius.control,
      "flex items-center justify-center gap-2 border border-slate-200/90 bg-slate-100 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
    ),
  adminPrimary: gradientBtn.admin + " " + radius.pill + " px-5 py-2.5 text-sm",
  navOutline:
    "rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:bg-white/20",
  navCta:
    "rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-bold text-amber-950 shadow-md transition hover:from-amber-300 hover:to-orange-400",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  className,
  children,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center disabled:cursor-not-allowed",
        buttonVariants[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
