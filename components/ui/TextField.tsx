import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { focusRing, inputBase, radius, typography } from "@/lib/ui-styles";

type FocusVariant = "brand" | "accent";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  id: string;
  leftIcon?: ReactNode;
  /** Renders beside the label (e.g. forgot-password link). */
  labelTrailing?: ReactNode;
  focusVariant?: FocusVariant;
  hint?: string;
  containerClassName?: string;
  inputClassName?: string;
};

const focusMap = {
  brand: focusRing.brand,
  accent: focusRing.accent,
};

export function TextField({
  label,
  id,
  leftIcon,
  labelTrailing,
  focusVariant = "brand",
  hint,
  containerClassName,
  inputClassName,
  ...inputProps
}: Props) {
  return (
    <div className={cn(containerClassName)}>
      {labelTrailing ? (
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={id} className={typography.label}>
            {label}
          </label>
          {labelTrailing}
        </div>
      ) : (
        <label htmlFor={id} className={typography.label}>
          {label}
        </label>
      )}
      <div className="relative mt-2">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={cn(
            inputBase,
            radius.control,
            leftIcon ? "pl-12 pr-4" : "px-4",
            focusMap[focusVariant],
            inputClassName
          )}
          {...inputProps}
        />
      </div>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
