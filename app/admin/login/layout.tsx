import { AdminProviders } from "@/components/admin/AdminProviders";

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>;
}
