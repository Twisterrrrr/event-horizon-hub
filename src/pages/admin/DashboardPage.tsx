import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDashboardStats, mockEvents, mockOrders } from "@/data/mock";
import {
  ShoppingCart, TrendingUp, AlertTriangle, Camera, CalendarX,
  Star, HelpCircle, Search, Eye, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

type TimeRange = 'today' | 'week' | 'month';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

export default function DashboardPage() {
  const [range, setRange] = useState<TimeRange>(() =>
    (localStorage.getItem('dashboard_range') as TimeRange) || 'today'
  );
  const stats = mockDashboardStats;

  const handleRangeChange = (r: string) => {
    setRange(r as TimeRange);
    localStorage.setItem('dashboard_range', r);
  };

  const orders = range === 'today' ? stats.todayOrders : range === 'week' ? stats.weekOrders : stats.monthOrders;
  const revenue = range === 'today' ? stats.todayRevenue : range === 'week' ? stats.weekRevenue : stats.monthRevenue;

  const attentionItems = [
    { label: 'Без фото', count: stats.eventsWithoutPhoto, icon: Camera, color: 'text-warning', link: '/admin/events?filter=no_photo' },
    { label: 'Без расписания', count: stats.eventsWithoutSchedule, icon: CalendarX, color: 'text-destructive', link: '/admin/events?filter=no_schedule' },
    { label: 'Низкая конверсия', count: stats.eventsLowConversion, icon: TrendingUp, color: 'text-warning', link: '/admin/events?filter=low_conversion' },
    { label: 'Новые отзывы', count: stats.pendingReviews, icon: Star, color: 'text-info', link: '/admin/reviews?filter=new' },
    { label: 'Открытые тикеты', count: stats.openTickets, icon: HelpCircle, color: 'text-info', link: '/admin/support' },
    { label: 'Несоответствия', count: stats.unresolvedReconciliations, icon: Search, color: 'text-destructive', link: '/admin/reconciliation' },
  ].filter(i => i.count > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Дашборд</h1>
        <Tabs value={range} onValueChange={handleRangeChange}>
          <TabsList>
            <TabsTrigger value="today">Сегодня</TabsTrigger>
            <TabsTrigger value="week">7 дней</TabsTrigger>
            <TabsTrigger value="month">30 дней</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Заказы</p>
                <p className="text-2xl font-bold">{orders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Выручка</p>
                <p className="text-2xl font-bold">{formatCurrency(revenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активных событий</p>
                <p className="text-2xl font-bold">{stats.activeEvents}</p>
              </div>
              <Eye className="h-8 w-8 text-info/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CTR промо</p>
                <p className="text-2xl font-bold">{stats.promoCTR}%</p>
              </div>
              <BarChart className="h-8 w-8 text-accent/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attention Section */}
      {attentionItems.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Требует внимания
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {attentionItems.map((item) => (
                <Link key={item.label} to={item.link}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.label}</p>
                    </div>
                    <Badge variant="secondary">{item.count}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Tabs */}
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Контент</TabsTrigger>
          <TabsTrigger value="operations">Операции</TabsTrigger>
          <TabsTrigger value="marketing">Маркетинг</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Качество карточек</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockEvents.filter(e => !e.hasImage || !e.hasSchedule).map(e => (
                    <Link key={e.id} to={`/admin/events/${e.id}`}>
                      <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 text-sm">
                        <span className="flex-1 truncate">{e.title}</span>
                        {!e.hasImage && <Badge variant="outline" className="text-warning border-warning">Нет фото</Badge>}
                        {!e.hasSchedule && <Badge variant="outline" className="text-destructive border-destructive">Нет расписания</Badge>}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Популярные категории</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.popularCategories.map(cat => (
                    <div key={cat.name} className="flex items-center gap-3">
                      <span className="text-sm flex-1">{cat.name}</span>
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(cat.count / 30) * 100}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Последние заказы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockOrders.slice(0, 5).map(order => (
                  <Link key={order.id} to={`/admin/orders/${order.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 text-sm">
                      <span className="font-mono text-xs text-muted-foreground">{order.number}</span>
                      <span className="flex-1 truncate">{order.eventTitle}</span>
                      <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Конверсия событий</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockEvents.filter(e => e.conversionRate).sort((a, b) => (b.conversionRate || 0) - (a.conversionRate || 0)).slice(0, 5).map(e => (
                  <div key={e.id} className="flex items-center gap-3 p-2 text-sm">
                    <span className="flex-1 truncate">{e.title}</span>
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: `${Math.min((e.conversionRate || 0) / 20 * 100, 100)}%` }} />
                    </div>
                    <span className="text-muted-foreground w-12 text-right">{e.conversionRate}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    paid: { label: 'Оплачен', variant: 'default' },
    pending: { label: 'Ожидает', variant: 'secondary' },
    canceled: { label: 'Отменён', variant: 'destructive' },
    refunded: { label: 'Возврат', variant: 'outline' },
  };
  const m = map[status] || { label: status, variant: 'secondary' as const };
  return <Badge variant={m.variant}>{m.label}</Badge>;
}

function BarChart({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>;
}
