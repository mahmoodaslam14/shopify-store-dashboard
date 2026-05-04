import { DashboardNav } from "@/components/DashboardNav";
import { mockUser } from "@/lib/ui-mock";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dash-bg flex min-h-0 h-[100dvh] overflow-hidden">
      <DashboardNav
        email={mockUser.email}
        name={mockUser.name}
        showAdmin
      />
      <main className="relative min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-5 md:p-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
