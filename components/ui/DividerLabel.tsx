import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function DividerLabel({ children }: Props) {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span className="bg-white/[0.94] px-3 backdrop-blur-sm">{children}</span>
      </div>
    </div>
  );
}
