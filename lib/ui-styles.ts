/**
 * Single source of truth for shared Tailwind patterns.
 * Prefer importing these in components instead of duplicating long class strings.
 */
export const radius = {
  card: "rounded-3xl",
  panel: "rounded-3xl",
  /** Auth / glass panels — explicit radius so cards never render square */
  authForm: "rounded-3xl",
  control: "rounded-2xl",
  pill: "rounded-full",
  md: "rounded-xl",
} as const;

export const shadow = {
  brand: "shadow-brand",
  brandLg: "shadow-brand-lg",
  float: "shadow-float",
} as const;

/** Bordered sections on dashboard settings / forms */
export const sectionCard =
  "rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm";

/** Frosted panels on light mesh backgrounds (dashboard, marketing). */
export const glass = {
  panel:
    "border border-white/70 bg-white/75 backdrop-blur-md shadow-brand",
  panelStrong:
    "border border-white/60 bg-white/85 backdrop-blur-md shadow-brand",
  /**
   * Auth form on dark scene — avoid `shadow-brand` tokens here: their inset white
   * highlight reads as a harsh inner rectangle. Use a deep outer lift only.
   */
  authCard:
    "border border-white/20 bg-white/[0.94] backdrop-blur-2xl " +
    "shadow-[0_32px_80px_-28px_rgba(15,23,42,0.55),0_0_0_1px_rgba(255,255,255,0.12)]",
} as const;

export const focusRing = {
  brand:
    "focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/15",
  accent:
    "focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-cyan-500/15",
  admin:
    "focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/15",
} as const;

/** Base input shell (add pl-12 when using a leading icon). */
export const inputBase =
  "w-full border border-slate-200/90 bg-slate-50/50 py-3.5 text-sm text-slate-900 shadow-inner transition placeholder:text-slate-400";

export const typography = {
  titleLg: "text-3xl font-bold tracking-tight text-slate-900 md:text-4xl",
  titleMd: "text-2xl font-bold tracking-tight text-slate-900",
  subtitle: "mt-2 text-slate-600",
  label: "text-sm font-semibold text-slate-800",
  eyebrow:
    "text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400",
  linkBrand:
    "font-bold text-violet-600 underline decoration-violet-300 decoration-2 underline-offset-2 hover:text-violet-800",
  linkAccent:
    "font-bold text-cyan-700 underline decoration-cyan-300 decoration-2 underline-offset-2 hover:text-cyan-900",
} as const;

/** Primary CTAs — solid fills for consistent contrast (no gradient wash-out) */
export const gradientBtn = {
  brand:
    "bg-violet-600 font-bold text-white shadow-lg shadow-violet-600/35 transition hover:bg-violet-700 active:bg-violet-800 disabled:opacity-55",
  accent:
    "bg-cyan-600 font-bold text-white shadow-lg shadow-cyan-600/35 transition hover:bg-cyan-700 active:bg-cyan-800 disabled:opacity-55",
  /** Admin / warm actions */
  admin:
    "bg-emerald-600 font-bold text-white shadow-md shadow-emerald-600/30 transition hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50",
} as const;

export const ringAccent = {
  login: "ring-violet-400/40 shadow-violet-500/20",
  signup: "ring-cyan-400/40 shadow-cyan-500/25",
} as const;

/** Navigation — customer sidebar */
export const navItem = {
  active:
    "rounded-lg bg-white/[0.12] px-3 py-2.5 text-sm font-medium text-white shadow-md ring-1 ring-white/15 backdrop-blur-sm",
  inactive:
    "rounded-lg px-3 py-2.5 text-sm text-indigo-100/85 transition hover:bg-white/[0.06] hover:text-white",
  iconActive:
    "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white shadow-md",
  iconInactive:
    "flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.07] text-indigo-200 transition group-hover:bg-white/10 group-hover:text-white",
} as const;

/** Admin top bar — use on `<Link>` */
/** Feature rows on auth hero column */
export const authFeatureCard =
  "flex gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.09]";

/** Landing / marketing CTAs (`<Link className={marketing.ctaPrimary} />`) */
export const marketing = {
  ctaPrimary:
    "inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/35 transition hover:bg-violet-700 active:bg-violet-800",
  ctaSecondary:
    "inline-flex w-full items-center justify-center rounded-full border-2 border-white/80 bg-white/70 px-8 py-3.5 text-sm font-semibold text-slate-800 shadow-md backdrop-blur transition hover:border-violet-200 hover:bg-white",
  textLink:
    "inline-flex w-full items-center justify-center px-2 py-3 text-sm font-semibold text-orange-600 underline decoration-orange-300 decoration-2 underline-offset-4 hover:text-orange-700",
} as const;

export const adminHeader = {
  navLink:
    "text-sm font-medium text-amber-100/90 transition hover:text-white hover:underline",
  customerLink:
    "rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:bg-white/20",
  signOutLink:
    "rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-bold text-amber-950 shadow-md transition hover:from-amber-300 hover:to-orange-400",
} as const;
