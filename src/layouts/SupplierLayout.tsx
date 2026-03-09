import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SupplierSidebar } from "@/components/supplier/SupplierSidebar";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SupplierLayout() {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SupplierSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-4 border-b bg-card px-4 shrink-0">
            <SidebarTrigger className="shrink-0" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success">
                Поставщик
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/supplier/login')}>
                <LogOut className="h-4 w-4" />
              </Button>
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
