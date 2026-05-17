import { DashboardSkeleton } from "@/components/Dashboard/DashboardSkeleton";

export default async function Layout({ children, params }) {
  return <DashboardSkeleton>{children}</DashboardSkeleton>;
}
