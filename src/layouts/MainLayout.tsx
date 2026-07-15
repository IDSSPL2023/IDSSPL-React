import { Outlet } from "react-router-dom";
import ClientLayout from "@/components/ClientLayout";

/**
 * Chrome shared by every authenticated page: sidebar / top-nav / header,
 * with the active route rendered into the <Outlet />.
 */
export default function MainLayout() {
  return (
    <div className="h-screen overflow-hidden bg-gray-200 dark:bg-slate-950">
      <ClientLayout>
        <Outlet />
      </ClientLayout>
    </div>
  );
}
