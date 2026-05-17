import { SuperAdminDashboardSkeleton } from "@/components/SuperAdmin/SuperAdminDashboardSkeleton";
export default async function Layout({ children }) {
  return <SuperAdminDashboardSkeleton>{children}</SuperAdminDashboardSkeleton>;
}
