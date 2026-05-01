import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminProviders } from "@/components/admin/AdminProviders";

export const metadata = { title: { default: "Admin", template: "%s | Admin · ESC" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <AdminProviders>
      <div className="admin-layout bg-dark min-h-screen">
        <AdminNav />
        <div className="overflow-auto">
          <main className="p-8 min-h-screen">{children}</main>
        </div>
      </div>
    </AdminProviders>
  );
}
