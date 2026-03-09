import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-4 border-b bg-card px-4 shrink-0">
            <SidebarTrigger className="shrink-0" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                Admin
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
