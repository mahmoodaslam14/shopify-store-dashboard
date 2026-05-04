import { AdminHeader } from "@/components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-bg min-h-screen">
      <AdminHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">{children}</div>
    </div>
  );
}
