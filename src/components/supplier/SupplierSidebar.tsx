import { LayoutDashboard, Calendar, BarChart3, Settings, Bell } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { mockSupplierProfile, mockSupplierStats } from "@/data/supplier-mock";

const navItems = [
  { title: "Дашборд", url: "/supplier", icon: LayoutDashboard },
  { title: "Мои события", url: "/supplier/events", icon: Calendar, badge: mockSupplierStats.pendingEvents },
  { title: "Отчёты", url: "/supplier/reports", icon: BarChart3 },
  { title: "Настройки", url: "/supplier/settings", icon: Settings },
];

export function SupplierSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const trustColors: Record<string, string> = {
    basic: 'bg-muted text-muted-foreground',
    verified: 'bg-success/10 text-success',
    premium: 'bg-primary/10 text-primary',
  };
  const trustLabels: Record<string, string> = {
    basic: 'Базовый',
    verified: 'Проверен',
    premium: 'Премиум',
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">D</span>
              </div>
              <div>
                <span className="font-semibold text-sm">DAIBILET</span>
                <p className="text-[10px] text-muted-foreground">Кабинет поставщика</p>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-sm font-medium">{mockSupplierProfile.operatorName}</p>
              <p className="text-xs text-muted-foreground">{mockSupplierProfile.name}</p>
              <Badge className={`mt-1 text-[10px] ${trustColors[mockSupplierProfile.trustLevel]}`} variant="secondary">
                {trustLabels[mockSupplierProfile.trustLevel]}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm">D</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = item.url === '/supplier'
                  ? location.pathname === '/supplier'
                  : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url} end={item.url === '/supplier'}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && (
                          <span className="flex-1 flex items-center justify-between">
                            {item.title}
                            {item.badge && item.badge > 0 && (
                              <Badge variant="secondary" className="h-5 min-w-5 text-[10px] justify-center">
                                {item.badge}
                              </Badge>
                            )}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            Комиссия: {mockSupplierProfile.commission}%
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
