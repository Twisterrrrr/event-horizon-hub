import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockEvents, mockCities, mockCategories } from "@/data/mock";
import { Camera, CalendarX, Globe, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { Event, EventStatus, SaleState } from "@/types";

const statusLabels: Record<EventStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Активно', variant: 'default' },
  paused: { label: 'Пауза', variant: 'secondary' },
  draft: { label: 'Черновик', variant: 'outline' },
  archived: { label: 'Архив', variant: 'destructive' },
};

const saleLabels: Record<SaleState, string> = {
  on_sale: 'В продаже', paused: 'Приостановлено', no_dates: 'Нет дат', partner_only: 'Только партнёр', sold_out: 'Распродано',
};

const formatPrice = (n?: number) => n ? `${n.toLocaleString('ru-RU')} ₽` : '—';

export default function EventsListPage() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockEvents.filter(e => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (cityFilter !== 'all' && e.cityId !== cityFilter) return false;
    if (categoryFilter !== 'all' && e.categoryId !== categoryFilter) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  const activeFilters = [cityFilter, categoryFilter, statusFilter].filter(f => f !== 'all').length + (search ? 1 : 0);

  const clearFilters = () => { setSearch(''); setCityFilter('all'); setCategoryFilter('all'); setStatusFilter('all'); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">События</h1>
        <Badge variant="secondary">{filtered.length} из {mockEvents.length}</Badge>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск по названию..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Город" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все города</SelectItem>
                {mockCities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Категория" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {mockCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Статус" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="active">Активно</SelectItem>
                <SelectItem value="paused">Пауза</SelectItem>
                <SelectItem value="draft">Черновик</SelectItem>
                <SelectItem value="archived">Архив</SelectItem>
              </SelectContent>
            </Select>
            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-3 w-3" /> Сбросить ({activeFilters})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Событие</TableHead>
              <TableHead>Город</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Продажа</TableHead>
              <TableHead className="text-right">Цена от</TableHead>
              <TableHead className="text-right">Конверсия</TableHead>
              <TableHead className="text-center">⚠️</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(event => (
              <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Link to={`/admin/events/${event.id}`} className="block">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{event.title}</span>
                      {event.isMultiCity && (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Globe className="h-3 w-3" /> {event.citiesCount} городов
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{event.categoryName}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-sm">{event.cityName}</TableCell>
                <TableCell>
                  <Badge variant={statusLabels[event.status].variant}>{statusLabels[event.status].label}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{saleLabels[event.saleState]}</TableCell>
                <TableCell className="text-right font-medium">{formatPrice(event.priceFrom)}</TableCell>
                <TableCell className="text-right text-sm">{event.conversionRate ? `${event.conversionRate}%` : '—'}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    {!event.hasImage && <Camera className="h-4 w-4 text-warning" />}
                    {!event.hasSchedule && <CalendarX className="h-4 w-4 text-destructive" />}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Нет событий по заданным фильтрам
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
