import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockOrders } from "@/data/mock";
import { Search, X, ArrowLeft, Mail, XCircle, ExternalLink, Globe, Handshake, Ship, CheckCircle, Clock, Ban, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import type { OrderStatus } from "@/types";

const statusMap: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  paid: { label: 'Оплачен', color: 'bg-success text-success-foreground', icon: CheckCircle },
  pending: { label: 'Ожидает', color: 'bg-warning text-warning-foreground', icon: Clock },
  canceled: { label: 'Отменён', color: 'bg-destructive text-destructive-foreground', icon: Ban },
  refunded: { label: 'Возврат', color: 'bg-muted text-muted-foreground', icon: RotateCcw },
};

const sourceIcons: Record<string, { icon: React.ElementType; label: string }> = {
  website: { icon: Globe, label: 'Сайт' },
  partner: { icon: Handshake, label: 'Партнёр' },
  teplohod: { icon: Ship, label: 'Теплоход' },
};

const formatCurrency = (n: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

function OrderTimeline({ order }: { order: typeof mockOrders[0] }) {
  const steps = [
    { label: 'Создан', date: order.createdAt, done: true },
    { label: 'Оплачен', date: order.paidAt, done: !!order.paidAt },
    { label: 'Билет выслан', date: order.ticketSentAt, done: !!order.ticketSentAt },
  ];
  if (order.canceledAt) {
    steps.push({ label: 'Отменён', date: order.canceledAt, done: true });
  }

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${step.done ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            <span className={`w-2 h-2 rounded-full ${step.done ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
            {step.label}
          </div>
          {i < steps.length - 1 && <div className={`w-4 h-px ${step.done ? 'bg-primary' : 'bg-muted-foreground/30'}`} />}
        </div>
      ))}
    </div>
  );
}

function OrderCard({ orderId, onBack }: { orderId: string; onBack: () => void }) {
  const order = mockOrders.find(o => o.id === orderId) || mockOrders[0];
  const SourceIcon = sourceIcons[order.source].icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Назад</Button>
        <h1 className="text-2xl font-bold flex-1 font-mono">{order.number}</h1>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusMap[order.status].color}`}>
          {statusMap[order.status].label}
        </span>
      </div>

      <OrderTimeline order={order} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Детали заказа</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Событие:</span><p className="font-medium">{order.eventTitle}</p></div>
                <div><span className="text-muted-foreground">Дата/время:</span><p className="font-medium">{order.sessionDate} {order.sessionTime}</p></div>
                <div><span className="text-muted-foreground">Кол-во:</span><p className="font-medium">{order.quantity} шт.</p></div>
                <div><span className="text-muted-foreground">Сумма:</span><p className="font-medium text-lg">{formatCurrency(order.totalAmount)}</p></div>
                <div><span className="text-muted-foreground">Клиент:</span><p className="font-medium">{order.customerName}</p></div>
                <div><span className="text-muted-foreground">Email:</span><p className="font-medium">{order.customerEmail}</p></div>
                <div>
                  <span className="text-muted-foreground">Источник:</span>
                  <p className="font-medium flex items-center gap-1"><SourceIcon className="h-3.5 w-3.5" /> {sourceIcons[order.source].label}</p>
                </div>
                <div><span className="text-muted-foreground">Создан:</span><p className="font-medium">{new Date(order.createdAt).toLocaleString('ru-RU')}</p></div>
              </div>
            </CardContent>
          </Card>

          {/* Related tickets */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Связанные обращения</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-4">Нет связанных обращений</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Действия</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                <Mail className="h-4 w-4" /> Переотправить билет
              </Button>
              {order.status === 'paid' && (
                <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive" size="sm">
                  <XCircle className="h-4 w-4" /> Отменить заказ
                </Button>
              )}
              <Separator />
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm" size="sm">
                <ExternalLink className="h-4 w-4" /> Открыть в {sourceIcons[order.source].label}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function OrdersListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [preset, setPreset] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const filtered = mockOrders.filter(o => {
    if (search && !o.number.toLowerCase().includes(search.toLowerCase()) && !o.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (preset === 'today' && !o.createdAt.startsWith(today)) return false;
    if (preset === 'yesterday' && !o.createdAt.startsWith(yesterday)) return false;
    if (preset === 'problems' && o.status !== 'pending') return false;
    if (preset === 'refunds' && o.status !== 'refunded' && o.status !== 'canceled') return false;
    return true;
  });

  const clearFilters = () => { setSearch(''); setStatusFilter('all'); setPreset('all'); };

  if (selectedOrder) return <OrderCard orderId={selectedOrder} onBack={() => setSelectedOrder(null)} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Заказы</h1>
        <Badge variant="secondary">{filtered.length}</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Все' },
          { key: 'today', label: 'Сегодня' },
          { key: 'yesterday', label: 'Вчера' },
          { key: 'problems', label: 'Проблемы оплаты' },
          { key: 'refunds', label: 'Возвраты / Отмены' },
        ].map(p => (
          <Button key={p.key} variant={preset === p.key ? 'default' : 'outline'} size="sm" onClick={() => setPreset(p.key)}>
            {p.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Номер или имя..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Статус" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="paid">Оплачен</SelectItem>
                <SelectItem value="pending">Ожидает</SelectItem>
                <SelectItem value="canceled">Отменён</SelectItem>
                <SelectItem value="refunded">Возврат</SelectItem>
              </SelectContent>
            </Select>
            {(search || statusFilter !== 'all' || preset !== 'all') && (
              <Button variant="ghost" size="sm" onClick={clearFilters}><X className="h-3 w-3 mr-1" /> Сбросить</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Номер</TableHead><TableHead>Событие</TableHead><TableHead>Клиент</TableHead>
              <TableHead>Источник</TableHead><TableHead>Статус</TableHead><TableHead className="text-right">Сумма</TableHead><TableHead>Дата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(order => {
              const StatusIcon = statusMap[order.status].icon;
              const SourceInfo = sourceIcons[order.source];
              return (
                <TableRow key={order.id} className="cursor-pointer" onClick={() => setSelectedOrder(order.id)}>
                  <TableCell className="font-mono text-xs">{order.number}</TableCell>
                  <TableCell className="max-w-48 truncate text-sm">{order.eventTitle}</TableCell>
                  <TableCell className="text-sm">{order.customerName}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <SourceInfo.icon className="h-3.5 w-3.5" /> {SourceInfo.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[order.status].color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusMap[order.status].label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
