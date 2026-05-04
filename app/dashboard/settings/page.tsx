import { LinkShopifyForm } from "@/components/LinkShopifyForm";
import { PasswordChangeForm, ProfileNameForm } from "@/components/ProfileForms";
import { IconSparkles } from "@/components/dashboard-icons";
import { PageHeader } from "@/components/ui";
import { mockShopify, mockUser } from "@/lib/ui-mock";
import { sectionCard } from "@/lib/ui-styles";

const nav = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "shopify", label: "Shopify" },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <PageHeader
        badge={
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            <IconSparkles className="h-3.5 w-3.5 text-violet-600" />
            Account
          </span>
        }
        title="Settings"
        description="Manage profile details, password, and how this dashboard links to your
          Shopify customer — everything here is front-end until APIs are connected."
      />

      <nav className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/90 bg-white/80 p-2 shadow-sm backdrop-blur-sm">
        {nav.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {n.label}
          </a>
        ))}
      </nav>

      <section id="profile" className={sectionCard}>
        <h2 className="text-lg font-bold text-slate-900">Profile</h2>
        <p className="mt-2 text-sm text-slate-500">
          Display name appears across the dashboard and lifecycle emails.
        </p>
        <ProfileNameForm initialName={mockUser.name} />
        <p className="mt-6 border-t border-slate-100 pt-6 text-sm text-slate-500">
          Email (login) ·{" "}
          <span className="font-semibold text-slate-800">{mockUser.email}</span>
        </p>
      </section>

      <section id="security" className={sectionCard}>
        <h2 className="text-lg font-bold text-slate-900">Security</h2>
        <p className="mt-2 text-sm text-slate-500">
          Password updates are simulated locally — no requests leave the browser.
        </p>
        <PasswordChangeForm />
      </section>

      <section id="shopify" className={sectionCard}>
        <h2 className="text-lg font-bold text-slate-900">Shopify customer</h2>
        <p className="mt-2 text-sm text-slate-500">
          Link your store customer ID for order sync, discounts, and webhooks.
        </p>
        {mockShopify.connected ? (
          <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-900 ring-1 ring-emerald-100">
            Connected · {mockShopify.shopDomain} · customer {mockShopify.customerId}
          </p>
        ) : (
          <LinkShopifyForm email={mockUser.email} />
        )}
      </section>
    </div>
  );
}
