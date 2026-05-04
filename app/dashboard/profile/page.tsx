import { ProfileNameForm } from "@/components/ProfileForms";
import { IconSparkles } from "@/components/dashboard-icons";
import { PageHeader } from "@/components/ui";
import { cn } from "@/lib/cn";
import { mockUser } from "@/lib/ui-mock";
import { sectionCard } from "@/lib/ui-styles";

export default function ProfilePage() {
  const initials = mockUser.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <PageHeader
        badge={
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100/90 px-3 py-1 text-xs font-semibold text-violet-800 ring-1 ring-violet-200/80">
            <IconSparkles className="h-3.5 w-3.5 text-amber-500" />
            Your profile
          </span>
        }
        title="Profile & preferences"
        description="Keep your display name current so receipts and reward emails feel personal.
          Email stays tied to login — change it later when auth is connected."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <div
            className={cn(
              sectionCard,
              "flex flex-col items-center bg-gradient-to-b from-violet-50/90 to-white text-center"
            )}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-2xl font-bold text-white shadow-lg ring-4 ring-white">
              {initials}
            </div>
            <p className="mt-4 font-semibold text-slate-900">{mockUser.name}</p>
            <p className="mt-1 text-sm text-slate-500">{mockUser.email}</p>
            <div className="mt-5 w-full rounded-2xl bg-white/80 px-4 py-3 text-left ring-1 ring-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Profile strength
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Add a photo & phone when we enable them.
              </p>
            </div>
          </div>
          <div className={cn(sectionCard, "bg-slate-50/90")}>
            <p className="text-sm font-semibold text-slate-900">Quick links</p>
            <ul className="mt-3 space-y-2 text-sm text-violet-700">
              <li>
                <a className="underline decoration-violet-300 underline-offset-2" href="/dashboard/submissions">
                  Social submissions
                </a>
              </li>
              <li>
                <a className="underline decoration-violet-300 underline-offset-2" href="/dashboard/wallet">
                  Cashback wallet
                </a>
              </li>
              <li>
                <a className="underline decoration-violet-300 underline-offset-2" href="/dashboard/settings">
                  Security & Shopify
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <div className="space-y-6">
          <section className={sectionCard}>
            <h2 className="text-sm font-semibold text-slate-900">Display name</h2>
            <p className="mt-1 text-sm text-slate-500">
              Shown in the dashboard header and future lifecycle emails.
            </p>
            <ProfileNameForm initialName={mockUser.name} />
          </section>

          <section className={sectionCard}>
            <h2 className="text-sm font-semibold text-slate-900">Contact email</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sign-in identifier — read-only in this UI preview.
            </p>
            <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 font-medium text-slate-800 ring-1 ring-slate-100">
              {mockUser.email}
            </p>
          </section>

          <section className={cn(sectionCard, "border-dashed border-violet-200 bg-violet-50/30")}>
            <h2 className="text-sm font-semibold text-slate-900">Coming soon</h2>
            <p className="mt-1 text-sm text-slate-600">
              Avatar upload, phone number, and marketing preferences will sync here
              from your auth provider.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Photo", "SMS opt-in", "Language"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
