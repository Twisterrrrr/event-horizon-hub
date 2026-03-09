import {
  LayoutDashboard, Calendar, ShoppingCart, MapPin, Building2,
  Truck, FileText, FolderOpen, Tags, Star, Search, Settings,
  HelpCircle, BarChart3, Users, Globe
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const mainNav = [
  { title: "Дашборд", url: "/admin", icon: LayoutDashboard },
];

const catalogNav = [
  { title: "События", url: "/admin/events", icon: Calendar, badge: 8 },
  { title: "Площадки", url: "/admin/venues", icon: Building2 },
  { title: "Города", url: "/admin/cities", icon: Globe },
  { title: "Поставщики", url: "/admin/suppliers", icon: Truck, attention: true },
  { title: "Теги", url: "/admin/tags", icon: Tags },
];

const contentNav = [
  { title: "Статьи", url: "/admin/articles", icon: FileText },
  { title: "Подборки", url: "/admin/collections", icon: FolderOpen },
  { title: "Промо-блоки", url: "/admin/promo", icon: BarChart3 },
];

const operationsNav = [
  { title: "Заказы", url: "/admin/orders", icon: ShoppingCart, badge: 3 },
  { title: "Отзывы", url: "/admin/reviews", icon: Star, badge: 2 },
  { title: "Сверка", url: "/admin/reconciliation", icon: Search, attention: true },
  { title: "Поддержка", url: "/admin/support", icon: HelpCircle, badge: 1 },
];

const systemNav = [
  { title: "SEO-аудит", url: "/admin/seo", icon: BarChart3 },
  { title: "Пользователи", url: "/admin/users", icon: Users },
  { title: "Настройки", url: "/admin/settings", icon: Settings },
];

interface NavSection {
  label: string;
  items: typeof mainNav;
}

const sections: NavSection[] = [
  { label: "", items: mainNav },
  { label: "Каталог", items: catalogNav },
  { label: "Контент", items: contentNav },
  { label: "Операции", items: operationsNav },
  { label: "Система", items: systemNav },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-lg">DAIBILET</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm">D</span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section, si) => (
          <SidebarGroup key={si}>
            {section.label && <SidebarGroupLabel>{section.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = item.url === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <NavLink to={item.url} end={item.url === '/admin'}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && (
                            <span className="flex-1 flex items-center justify-between">
                              {item.title}
                              <span className="flex items-center gap-1">
                                {'attention' in item && item.attention && (
                                  <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                                )}
                                {'badge' in item && item.badge && (
                                  <Badge variant="secondary" className="h-5 min-w-5 text-[10px] justify-center">
                                    {item.badge as React.ReactNode}
                                  </Badge>
                                )}
                              </span>
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
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            v0.1.0 · Staging
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
