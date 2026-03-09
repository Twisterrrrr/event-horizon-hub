import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { mockDashboardStats, mockEvents, mockOrders } from "@/data/mock";
import {
  ShoppingCart, TrendingUp, AlertTriangle, Camera, CalendarX,
  Star, HelpCircle, Search, Eye, ArrowRight, FileWarning,
  BarChart3, Users, Megaphone, Palette
} from "lucide-react";
import { Link } from "react-router-dom";

type TimeRange = 'today' | 'week' | 'month';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

function KpiCard({ label, value, icon: Icon, iconClass }: { label: string; value: string | number; icon: React.ElementType; iconClass?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${iconClass || 'text-primary/30'}`} />
        </div>
      </CardContent>
    </Card>
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

function AttentionSection() {
  const stats = mockDashboardStats;
  const items = [
    { label: 'Без фото', count: stats.eventsWithoutPhoto, icon: Camera, color: 'text-warning', link: '/admin/events?filter=no_photo' },
    { label: 'Без расписания', count: stats.eventsWithoutSchedule, icon: CalendarX, color: 'text-destructive', link: '/admin/events?filter=no_schedule' },
    { label: 'Низкая конверсия', count: stats.eventsLowConversion, icon: TrendingUp, color: 'text-warning', link: '/admin/events?filter=low_conversion' },
    { label: 'Новые отзывы', count: stats.pendingReviews, icon: Star, color: 'text-info', link: '/admin/reviews?filter=new' },
    { label: 'Открытые тикеты', count: stats.openTickets, icon: HelpCircle, color: 'text-info', link: '/admin/support' },
    { label: 'Несоответствия', count: stats.unresolvedReconciliations, icon: Search, color: 'text-destructive', link: '/admin/reconciliation' },
  ].filter(i => i.count > 0);

  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Требует внимания
          <Badge variant="destructive" className="ml-auto">{items.reduce((s, i) => s + i.count, 0)}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <Link key={item.label} to={item.link}>
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
                <Badge variant="secondary">{item.count}</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ContentEditorTab() {
  const incomplete = mockEvents.filter(e => !e.hasImage || !e.hasSchedule);
  const cityCoverage = [
    { city: 'Санкт-Петербург', events: 42, target: 50 },
    { city: 'Москва', events: 35, target: 50 },
    { city: 'Казань', events: 12, target: 25 },
    { city: 'Нижний Новгород', events: 8, target: 20 },
    { city: 'Сочи', events: 6, target: 15 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-warning" />
              Качество карточек
            </CardTitle>
            <Badge variant="outline">{incomplete.length} проблем</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {incomplete.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Все карточки заполнены ✓</p>
            ) : (
              incomplete.map(e => (
                <Link key={e.id} to={`/admin/events/${e.id}`}>
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 text-sm group">
                    <span className="flex-1 truncate">{e.title}</span>
                    <div className="flex gap-1">
                      {!e.hasImage && <Badge variant="outline" className="text-warning border-warning text-[10px]"><Camera className="h-3 w-3 mr-1" />Фото</Badge>}
                      {!e.hasSchedule && <Badge variant="outline" className="text-destructive border-destructive text-[10px]"><CalendarX className="h-3 w-3 mr-1" />Расписание</Badge>}
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Покрытие по городам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cityCoverage.map(c => {
              const pct = Math.min(Math.round((c.events / c.target) * 100), 100);
              return (
                <div key={c.city} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{c.city}</span>
                    <span className="text-muted-foreground">{c.events}/{c.target}</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Популярные категории</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {mockDashboardStats.popularCategories.map(cat => (
              <div key={cat.name} className="flex items-center gap-3 p-3 rounded-lg border">
                <span className="text-sm flex-1">{cat.name}</span>
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(cat.count / 30) * 100}%` }} />
                </div>
                <span className="text-sm font-medium w-8 text-right">{cat.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OperationsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Последние заказы</CardTitle>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">Все <ArrowRight className="h-3 w-3" /></Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockOrders.slice(0, 5).map(order => (
              <Link key={order.id} to={`/admin/orders/${order.id}`}>
                <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 text-sm group">
                  <span className="font-mono text-xs text-muted-foreground w-28">{order.number}</span>
                  <span className="flex-1 truncate">{order.eventTitle}</span>
                  <span className="font-medium text-xs">{formatCurrency(order.totalAmount)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Проблемы оплат</CardTitle>
        </CardHeader>
        <CardContent>
          {mockOrders.filter(o => o.status === 'pending').length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Нет проблемных оплат ✓</p>
          ) : (
            <div className="space-y-2">
              {mockOrders.filter(o => o.status === 'pending').map(order => (
                <Link key={order.id} to={`/admin/orders/${order.id}`}>
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 text-sm border-l-2 border-warning">
                    <span className="font-mono text-xs text-muted-foreground">{order.number}</span>
                    <span className="flex-1 truncate">{order.customerName}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((Date.now() - new Date(order.createdAt).getTime()) / 3600000)}ч назад
                    </span>
                    <Badge variant="secondary">Ожидает</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Возвраты и отмены</CardTitle>
        </CardHeader>
        <CardContent>
          {mockOrders.filter(o => o.status === 'canceled' || o.status === 'refunded').length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Нет возвратов ✓</p>
          ) : (
            <div className="space-y-2">
              {mockOrders.filter(o => o.status === 'canceled' || o.status === 'refunded').map(order => (
                <div key={order.id} className="flex items-center gap-3 p-2 rounded text-sm border-l-2 border-destructive">
                  <span className="font-mono text-xs text-muted-foreground">{order.number}</span>
                  <span className="flex-1 truncate">{order.eventTitle}</span>
                  <span className="font-medium text-xs">{formatCurrency(order.totalAmount)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MarketingTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Конверсия событий</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockEvents.filter(e => e.conversionRate).sort((a, b) => (b.conversionRate || 0) - (a.conversionRate || 0)).slice(0, 6).map(e => (
              <div key={e.id} className="flex items-center gap-3 p-2 text-sm">
                <span className="flex-1 truncate">{e.title}</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((e.conversionRate || 0) / 20 * 100, 100)}%`,
                      backgroundColor: (e.conversionRate || 0) >= 10 ? 'hsl(var(--success))' : (e.conversionRate || 0) >= 5 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))',
                    }}
                  />
                </div>
                <span className="text-muted-foreground w-14 text-right font-mono text-xs">{e.conversionRate}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Промо эффективность</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-primary">{mockDashboardStats.promoCTR}%</p>
              <p className="text-sm text-muted-foreground mt-1">Средний CTR промо-блоков</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-semibold">12</p>
                <p className="text-xs text-muted-foreground">Активных блоков</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-semibold">4.2K</p>
                <p className="text-xs text-muted-foreground">Показов/день</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-semibold">134</p>
                <p className="text-xs text-muted-foreground">Переходов/день</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Популярные темы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['Ночные прогулки', 'Музеи', 'Теплоходы', 'Мастер-классы', 'Театры', 'Крыши', 'Для детей', 'История'].map(tag => (
              <Badge key={tag} variant="outline" className="px-3 py-1.5 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Заказы" value={orders} icon={ShoppingCart} />
        <KpiCard label="Выручка" value={formatCurrency(revenue)} icon={TrendingUp} iconClass="text-success/30" />
        <KpiCard label="Активных событий" value={stats.activeEvents} icon={Eye} iconClass="text-info/30" />
        <KpiCard label="CTR промо" value={`${stats.promoCTR}%`} icon={BarChart3} iconClass="text-accent/30" />
      </div>

      <AttentionSection />

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content" className="gap-1.5"><Palette className="h-3.5 w-3.5" /> Контент</TabsTrigger>
          <TabsTrigger value="operations" className="gap-1.5"><ShoppingCart className="h-3.5 w-3.5" /> Операции</TabsTrigger>
          <TabsTrigger value="marketing" className="gap-1.5"><Megaphone className="h-3.5 w-3.5" /> Маркетинг</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-4"><ContentEditorTab /></TabsContent>
        <TabsContent value="operations" className="mt-4"><OperationsTab /></TabsContent>
        <TabsContent value="marketing" className="mt-4"><MarketingTab /></TabsContent>
      </Tabs>
    </div>
  );
}
