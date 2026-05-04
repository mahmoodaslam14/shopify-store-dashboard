import Link from "next/link";
import { IconSparkles } from "@/components/dashboard-icons";
import { cn } from "@/lib/cn";

type Props = {
  size?: "sm" | "md";
  className?: string;
};

export function BrandLogo({ size = "md", className }: Props) {
  const box = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const icon = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 text-sm font-semibold text-white/95 transition hover:text-white",
        className
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-fuchsia-600 shadow-lg ring-1 ring-white/30",
          box
        )}
      >
        <IconSparkles className={cn("text-white", icon)} />
      </span>
      <span className="tracking-tight">Brand rewards</span>
    </Link>
  );
}
