import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { mockSupplierProfile, mockSupplierStats, mockSupplierEvents, mockSupplierSales } from "@/data/supplier-mock";
import {
  Calendar, TrendingUp, Star, ShoppingCart, AlertTriangle,
  Camera, CalendarX, ArrowRight, CheckCircle, Clock, XCircle
} from "lucide-react";
import { Link } from "react-router-dom";

type TimeRange = 'today' | 'week' | 'month';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

const trustConfig: Record<string, { label: string; color: string; pct: number }> = {
  basic: { label: 'Базовый', color: 'bg-muted', pct: 33 },
  verified: { label: 'Проверен', color: 'bg-success', pct: 66 },
  premium: { label: 'Премиум', color: 'bg-primary', pct: 100 },
};

export default function SupplierDashboardPage() {
  const [range, setRange] = useState<TimeRange>(() =>
    (localStorage.getItem('supplier_range') as TimeRange) || 'today'
  );

  const handleRange = (r: string) => {
    setRange(r as TimeRange);
    localStorage.setItem('supplier_range', r);
  };

  const stats = mockSupplierStats;
  const profile = mockSupplierProfile;
  const trust = trustConfig[profile.trustLevel];

  const sold = range === 'today' ? stats.totalSoldToday : range === 'week' ? stats.totalSoldWeek : stats.totalSoldMonth;
  const revenue = range === 'today' ? stats.revenueToday : range === 'week' ? stats.revenueWeek : stats.revenueMonth;
  const commission = range === 'today' ? stats.commissionToday : range === 'week' ? stats.commissionWeek : stats.commissionMonth;

  const attentionEvents = mockSupplierEvents.filter(e =>
    e.status === 'pending' || e.status === 'rejected' || !e.hasImage || !e.hasSchedule
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Добро пожаловать, {profile.operatorName}</h1>
          <p className="text-sm text-muted-foreground">{profile.name}</p>
        </div>
        <Tabs value={range} onValueChange={handleRange}>
          <TabsList>
            <TabsTrigger value="today">Сегодня</TabsTrigger>
            <TabsTrigger value="week">7 дней</TabsTrigger>
            <TabsTrigger value="month">30 дней</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Trust & Commission */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Уровень доверия</p>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${trust.color} text-white`}>{trust.label}</Badge>
            </div>
            <Progress value={trust.pct} className="h-1.5" />
            {profile.trustLevel !== 'premium' && (
              <p className="text-xs text-muted-foreground mt-2">
                До следующего уровня: выполните 10+ заказов без отмен
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Комиссия</p>
            <p className="text-3xl font-bold text-primary">{profile.commission}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              Списывается с каждой продажи
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-warning fill-warning" />
              <span className="text-2xl font-bold">{stats.avgRating}</span>
            </div>
            <p className="text-sm text-muted-foreground">{stats.totalReviews} отзывов</p>
          </CardContent>
        </Card>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Активных событий</p>
                <p className="text-2xl font-bold">{stats.activeEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary/30" />
            </div>
            {stats.pendingEvents > 0 && (
              <p className="text-xs text-warning mt-2 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {stats.pendingEvents} на модерации
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Продано билетов</p>
                <p className="text-2xl font-bold">{sold}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-info/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Выручка (гросс)</p>
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
                <p className="text-sm text-muted-foreground">Ваш доход (нетто)</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(revenue - commission)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success/30" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Комиссия: {formatCurrency(commission)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attention */}
      {attentionEvents.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Требует внимания
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {attentionEvents.map(e => (
                <Link key={e.id} to={`/supplier/events/${e.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                    <span className="flex-1 text-sm font-medium">{e.title}</span>
                    <div className="flex gap-1">
                      {e.status === 'pending' && <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />На модерации</Badge>}
                      {e.status === 'rejected' && <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Отклонено</Badge>}
                      {!e.hasImage && <Badge variant="outline" className="text-warning border-warning text-[10px]"><Camera className="h-3 w-3 mr-1" />Фото</Badge>}
                      {!e.hasSchedule && <Badge variant="outline" className="text-destructive border-destructive text-[10px]"><CalendarX className="h-3 w-3 mr-1" />Расписание</Badge>}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent sales */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Последние продажи</CardTitle>
            <Link to="/supplier/reports">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Все отчёты →</Badge>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockSupplierSales.slice(0, 4).map(sale => (
              <div key={sale.id} className="flex items-center gap-3 p-2 rounded text-sm hover:bg-muted/30">
                <span className="font-mono text-xs text-muted-foreground w-28">{sale.orderNumber}</span>
                <span className="flex-1 truncate">{sale.eventTitle}</span>
                <span className="text-muted-foreground text-xs">{sale.quantity} шт.</span>
                <span className="font-medium">{formatCurrency(sale.netAmount)}</span>
                {sale.status === 'completed' && <CheckCircle className="h-3.5 w-3.5 text-success" />}
                {sale.status === 'refunded' && <XCircle className="h-3.5 w-3.5 text-destructive" />}
                {sale.status === 'pending' && <Clock className="h-3.5 w-3.5 text-warning" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
