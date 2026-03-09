import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockOrders } from "@/data/mock";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { OrderStatus } from "@/types";

const statusMap: Record<OrderStatus, { label: string; color: string }> = {
  paid: { label: 'Оплачен', color: 'bg-success text-success-foreground' },
  pending: { label: 'Ожидает', color: 'bg-warning text-warning-foreground' },
  canceled: { label: 'Отменён', color: 'bg-destructive text-destructive-foreground' },
  refunded: { label: 'Возврат', color: 'bg-muted text-muted-foreground' },
};

const sourceLabels: Record<string, string> = { website: '🌐 Сайт', partner: '🤝 Партнёр', teplohod: '🚢 Теплоход' };
const formatCurrency = (n: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

export default function OrdersListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [preset, setPreset] = useState('all');

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Заказы</h1>
        <Badge variant="secondary">{filtered.length}</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'today', 'yesterday', 'problems', 'refunds'].map(p => (
          <Button key={p} variant={preset === p ? 'default' : 'outline'} size="sm" onClick={() => setPreset(p)}>
            {{ all: 'Все', today: 'Сегодня', yesterday: 'Вчера', problems: 'Проблемы', refunds: 'Возвраты/Отмены' }[p]}
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
              <TableHead>Номер</TableHead>
              <TableHead>Событие</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Источник</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead>Дата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(order => (
              <TableRow key={order.id} className="cursor-pointer">
                <TableCell>
                  <Link to={`/admin/orders/${order.id}`} className="font-mono text-xs">{order.number}</Link>
                </TableCell>
                <TableCell className="max-w-48 truncate text-sm">{order.eventTitle}</TableCell>
                <TableCell className="text-sm">{order.customerName}</TableCell>
                <TableCell className="text-sm">{sourceLabels[order.source]}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[order.status].color}`}>
                    {statusMap[order.status].label}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
