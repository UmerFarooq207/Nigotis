"use client";

import { useCompany } from "@/contexts/company";
import { useNotifications } from "@/contexts/notifications";
import useUser from "@/hooks/useUser";

export default function LogoutBtn({ children }) {
  const { deleteCompany } = useCompany();
  const { deleteNotifications } = useNotifications();
  const { setUser } = useUser();

  const handleLogout = async () => {
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    deleteCompany();
    deleteNotifications();
    setUser(null);

    window.location.reload();
  };

  return <div onClick={handleLogout}>{children}</div>;
}
