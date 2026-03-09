import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockSupplierEvents } from "@/data/supplier-mock";
import {
  Plus, Search, X, ArrowLeft, Save, Star, Camera, CalendarX,
  CheckCircle, Clock, XCircle, AlertTriangle, Eye, ExternalLink
} from "lucide-react";
import type { SupplierEvent } from "@/data/supplier-mock";

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: React.ElementType }> = {
  active: { label: 'Активно', variant: 'default', icon: CheckCircle },
  pending: { label: 'На модерации', variant: 'secondary', icon: Clock },
  paused: { label: 'Пауза', variant: 'outline', icon: Clock },
  draft: { label: 'Черновик', variant: 'outline', icon: Eye },
  rejected: { label: 'Отклонено', variant: 'destructive', icon: XCircle },
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

function EventEditPage({ event, onBack }: { event?: SupplierEvent; onBack: () => void }) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(event?.priceFrom?.toString() || '');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Назад</Button>
        <h1 className="text-2xl font-bold flex-1">{event ? 'Редактировать событие' : 'Новое событие'}</h1>
        {event && (
          <Badge variant={statusConfig[event.status].variant}>{statusConfig[event.status].label}</Badge>
        )}
        <Button className="gap-1"><Save className="h-4 w-4" /> Сохранить</Button>
      </div>

      {/* Moderation note */}
      {event?.moderationNote && (
        <Card className={event.status === 'rejected' ? 'border-destructive/50 bg-destructive/5' : 'border-warning/50 bg-warning/5'}>
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${event.status === 'rejected' ? 'text-destructive' : 'text-warning'}`} />
            <div>
              <p className="text-sm font-medium">{event.status === 'rejected' ? 'Причина отклонения' : 'Замечание модератора'}</p>
              <p className="text-sm text-muted-foreground mt-1">{event.moderationNote}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Основное</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Название</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ночная прогулка по Неве" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Описание</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Подробное описание события..." rows={6} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Категория</label>
                  <Select defaultValue={event?.categoryName}>
                    <SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Теплоходы">Теплоходы</SelectItem>
                      <SelectItem value="Экскурсии">Экскурсии</SelectItem>
                      <SelectItem value="Музеи">Музеи</SelectItem>
                      <SelectItem value="Мастер-классы">Мастер-классы</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Город</label>
                  <Select defaultValue={event?.cityName}>
                    <SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                      <SelectItem value="Москва">Москва</SelectItem>
                      <SelectItem value="Казань">Казань</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Цена и расписание</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Цена от (₽)</label>
                  <Input value={price} onChange={e => setPrice(e.target.value)} type="number" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Цена до (₽)</label>
                  <Input defaultValue={event?.priceTo} type="number" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Сеансы</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground text-sm">
                  {event?.sessionsCount ? `${event.sessionsCount} сеансов настроено` : 'Нажмите чтобы добавить сеансы'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Фото</CardTitle></CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground text-sm">
                {event?.hasImage ? '1 фото загружено. Нажмите для замены.' : 'Перетащите или нажмите для загрузки фото'}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {event && event.status === 'active' && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Статистика</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Продано</span>
                  <span className="font-medium">{event.totalSold} билетов</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Выручка</span>
                  <span className="font-medium">{formatCurrency(event.revenue)}</span>
                </div>
                {event.rating && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Рейтинг</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Star className="h-3 w-3 text-warning fill-warning" /> {event.rating}
                      <span className="text-muted-foreground font-normal">({event.reviewsCount})</span>
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Чеклист публикации</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: 'Название', done: !!title },
                  { label: 'Описание', done: !!description },
                  { label: 'Фото', done: event?.hasImage || false },
                  { label: 'Расписание', done: event?.hasSchedule || false },
                  { label: 'Цена', done: !!price },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    {item.done ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className={item.done ? '' : 'text-muted-foreground'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {event && (
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                <ExternalLink className="h-4 w-4" /> Открыть на сайте
              </Button>
              {event.status === 'draft' && (
                <Button className="w-full">Отправить на модерацию</Button>
              )}
              {event.status === 'rejected' && (
                <Button className="w-full">Отправить повторно</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SupplierEventsListPage() {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editEvent, setEditEvent] = useState<SupplierEvent | undefined>();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockSupplierEvents.filter(e => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  if (view === 'edit') return <EventEditPage event={editEvent} onBack={() => { setView('list'); setEditEvent(undefined); }} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мои события</h1>
        <Button onClick={() => { setEditEvent(undefined); setView('edit'); }} className="gap-1"><Plus className="h-4 w-4" /> Создать событие</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активно</SelectItem>
                <SelectItem value="pending">На модерации</SelectItem>
                <SelectItem value="draft">Черновик</SelectItem>
                <SelectItem value="rejected">Отклонено</SelectItem>
              </SelectContent>
            </Select>
            {(search || statusFilter !== 'all') && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); }}>
                <X className="h-3 w-3 mr-1" /> Сбросить
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Событие</TableHead><TableHead>Статус</TableHead>
            <TableHead className="text-right">Цена от</TableHead>
            <TableHead className="text-center">Продано</TableHead>
            <TableHead className="text-right">Выручка</TableHead>
            <TableHead className="text-center">⭐</TableHead>
            <TableHead className="text-center">⚠️</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map(event => {
              const cfg = statusConfig[event.status];
              const StatusIcon = cfg.icon;
              return (
                <TableRow key={event.id} className="cursor-pointer" onClick={() => { setEditEvent(event); setView('edit'); }}>
                  <TableCell>
                    <div>
                      <span className="font-medium">{event.title}</span>
                      <p className="text-xs text-muted-foreground">{event.categoryName} · {event.cityName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cfg.variant} className="gap-1">
                      <StatusIcon className="h-3 w-3" />{cfg.label}
                    </Badge>
                    {event.moderationNote && (
                      <p className="text-xs text-muted-foreground mt-1 max-w-32 truncate">{event.moderationNote}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(event.priceFrom)}</TableCell>
                  <TableCell className="text-center">{event.totalSold || '—'}</TableCell>
                  <TableCell className="text-right">{event.revenue ? formatCurrency(event.revenue) : '—'}</TableCell>
                  <TableCell className="text-center">
                    {event.rating ? (
                      <span className="flex items-center justify-center gap-0.5 text-sm">
                        <Star className="h-3 w-3 text-warning fill-warning" />{event.rating}
                      </span>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      {!event.hasImage && <Camera className="h-4 w-4 text-warning" />}
                      {!event.hasSchedule && <CalendarX className="h-4 w-4 text-destructive" />}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
