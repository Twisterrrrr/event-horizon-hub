import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle, Check, X, ChevronLeft, ChevronRight, Clock,
  Camera, CalendarDays, MapPin, User, ExternalLink, Image, FileText
} from "lucide-react";

interface ModerationEvent {
  id: string;
  title: string;
  slug: string;
  supplierName: string;
  supplierId: string;
  cityName: string;
  categoryName: string;
  priceFrom: number;
  priceTo?: number;
  sessionsCount: number;
  hasImage: boolean;
  hasSchedule: boolean;
  description: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  moderationNote?: string;
  previousSubmissions: number;
  checklist: { label: string; ok: boolean }[];
}

const mockModerationQueue: ModerationEvent[] = [
  {
    id: 'mod1', title: 'Дневной круиз по Неве', slug: 'day-cruise-neva',
    supplierName: 'НеваТрип', supplierId: 'sup1', cityName: 'Санкт-Петербург', categoryName: 'Теплоходы',
    priceFrom: 600, sessionsCount: 0, hasImage: false, hasSchedule: false,
    description: 'Дневная прогулка на теплоходе по Неве с видом на Эрмитаж и Петропавловскую крепость.',
    submittedAt: '2026-03-09T10:30:00', status: 'pending', previousSubmissions: 0,
    checklist: [
      { label: 'Заголовок заполнен', ok: true },
      { label: 'Описание > 100 символов', ok: false },
      { label: 'Фото загружено', ok: false },
      { label: 'Расписание настроено', ok: false },
      { label: 'Цена указана', ok: true },
      { label: 'Город привязан', ok: true },
    ],
  },
  {
    id: 'mod2', title: 'Экскурсия «Мосты и дворцы»', slug: 'bridges-palaces',
    supplierName: 'НеваТрип', supplierId: 'sup1', cityName: 'Санкт-Петербург', categoryName: 'Экскурсии',
    priceFrom: 900, sessionsCount: 5, hasImage: true, hasSchedule: true,
    description: 'Пешая экскурсия по мостам и дворцам Санкт-Петербурга. Маршрут проходит через Невский проспект, Дворцовую набережную и Марсово поле. Продолжительность — 2 часа.',
    submittedAt: '2026-03-08T14:15:00', status: 'pending', previousSubmissions: 1,
    moderationNote: 'Повторная заявка — ранее отклонена из-за рекламных ссылок в описании.',
    checklist: [
      { label: 'Заголовок заполнен', ok: true },
      { label: 'Описание > 100 символов', ok: true },
      { label: 'Фото загружено', ok: true },
      { label: 'Расписание настроено', ok: true },
      { label: 'Цена указана', ok: true },
      { label: 'Город привязан', ok: true },
    ],
  },
  {
    id: 'mod3', title: 'Джаз на теплоходе', slug: 'jazz-boat',
    supplierName: 'PiterBoat', supplierId: 'sup2', cityName: 'Санкт-Петербург', categoryName: 'Теплоходы',
    priceFrom: 2500, priceTo: 4000, sessionsCount: 3, hasImage: true, hasSchedule: true,
    description: 'Живой джаз на борту теплохода. Вечерний рейс с напитками и закусками. Отправление от Англий с кой набережной.',
    submittedAt: '2026-03-07T18:00:00', status: 'pending', previousSubmissions: 0,
    checklist: [
      { label: 'Заголовок заполнен', ok: true },
      { label: 'Описание > 100 символов', ok: true },
      { label: 'Фото загружено', ok: true },
      { label: 'Расписание настроено', ok: true },
      { label: 'Цена указана', ok: true },
      { label: 'Город привязан', ok: true },
    ],
  },
  {
    id: 'mod4', title: 'Ночной Петербург на велосипеде', slug: 'night-bike-spb',
    supplierName: 'VeloPiter', supplierId: 'sup3', cityName: 'Санкт-Петербург', categoryName: 'Экскурсии',
    priceFrom: 1200, sessionsCount: 2, hasImage: true, hasSchedule: true,
    description: 'Ночная велоэкскурсия по центру Петербурга. Старт — Дворцовая площадь, финиш — Стрелка Васильевского острова. Велосипеды предоставляются.',
    submittedAt: '2026-03-06T09:45:00', status: 'pending', previousSubmissions: 0,
    checklist: [
      { label: 'Заголовок заполнен', ok: true },
      { label: 'Описание > 100 символов', ok: true },
      { label: 'Фото загружено', ok: true },
      { label: 'Расписание настроено', ok: true },
      { label: 'Цена указана', ok: true },
      { label: 'Город привязан', ok: true },
    ],
  },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: 'На модерации', class: 'bg-warning/10 text-warning border-warning/20' },
  approved: { label: 'Одобрено', class: 'bg-success/10 text-success border-success/20' },
  rejected: { label: 'Отклонено', class: 'bg-destructive/10 text-destructive border-destructive/20' },
  revision: { label: 'На доработку', class: 'bg-muted text-muted-foreground' },
};

const formatDate = (d: string) => {
  const date = new Date(d);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000);
  if (diffH < 1) return 'менее часа назад';
  if (diffH < 24) return `${diffH} ч. назад`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} дн. назад`;
};

const formatPrice = (n: number) => `${n.toLocaleString('ru-RU')} ₽`;

export default function ModerationPage() {
  const [queue, setQueue] = useState(mockModerationQueue);
  const [selectedId, setSelectedId] = useState<string | null>(queue[0]?.id ?? null);
  const [comment, setComment] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  const filtered = queue.filter(e => filterStatus === 'all' || e.status === filterStatus);
  const selected = queue.find(e => e.id === selectedId);
  const currentIdx = filtered.findIndex(e => e.id === selectedId);
  const pendingCount = queue.filter(e => e.status === 'pending').length;

  const handleAction = (action: 'approved' | 'rejected' | 'revision') => {
    if (!selectedId) return;
    setQueue(prev => prev.map(e =>
      e.id === selectedId ? { ...e, status: action, moderationNote: comment || e.moderationNote } : e
    ));
    setComment('');
    // auto-advance to next pending
    const nextPending = queue.find(e => e.id !== selectedId && e.status === 'pending');
    if (nextPending) setSelectedId(nextPending.id);
  };

  const navigateItem = (dir: -1 | 1) => {
    const nextIdx = currentIdx + dir;
    if (nextIdx >= 0 && nextIdx < filtered.length) {
      setSelectedId(filtered[nextIdx].id);
      setComment('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Модерация событий</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pendingCount > 0
              ? `${pendingCount} ${pendingCount === 1 ? 'событие ожидает' : 'событий ожидают'} проверки`
              : 'Все события проверены'}
          </p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">На модерации ({queue.filter(e => e.status === 'pending').length})</SelectItem>
            <SelectItem value="approved">Одобренные</SelectItem>
            <SelectItem value="rejected">Отклонённые</SelectItem>
            <SelectItem value="revision">На доработке</SelectItem>
            <SelectItem value="all">Все</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Check className="h-12 w-12 mx-auto mb-3 text-success" />
            <p className="text-lg font-medium">Нет событий в этой категории</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
          {/* Queue list */}
          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-auto">
            {filtered.map(event => (
              <Card
                key={event.id}
                className={`cursor-pointer transition-colors hover:border-primary/50 ${
                  event.id === selectedId ? 'border-primary ring-1 ring-primary/20' : ''
                }`}
                onClick={() => { setSelectedId(event.id); setComment(''); }}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3 shrink-0" />
                        <span className="truncate">{event.supplierName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span>{formatDate(event.submittedAt)}</span>
                        {event.previousSubmissions > 0 && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1">
                            повтор #{event.previousSubmissions}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge className={`shrink-0 text-[10px] ${statusConfig[event.status].class}`} variant="outline">
                      {statusConfig[event.status].label}
                    </Badge>
                  </div>
                  {/* Quick quality indicators */}
                  <div className="flex gap-1 mt-2">
                    {!event.hasImage && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                        <Camera className="h-2.5 w-2.5" /> Нет фото
                      </span>
                    )}
                    {!event.hasSchedule && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                        <CalendarDays className="h-2.5 w-2.5" /> Нет расписания
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigateItem(-1)} disabled={currentIdx <= 0}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">{currentIdx + 1} / {filtered.length}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigateItem(1)} disabled={currentIdx >= filtered.length - 1}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge className={`${statusConfig[selected.status].class}`} variant="outline">
                    {statusConfig[selected.status].label}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-2">{selected.title}</CardTitle>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {selected.supplierName}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {selected.cityName}</span>
                  <span>{selected.categoryName}</span>
                  <span>{formatPrice(selected.priceFrom)}{selected.priceTo ? ` – ${formatPrice(selected.priceTo)}` : ''}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Previous moderation note */}
                {selected.moderationNote && (
                  <div className="rounded-lg bg-warning/5 border border-warning/20 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-warning mb-1">
                      <AlertTriangle className="h-4 w-4" />
                      Предыдущее замечание
                    </div>
                    <p className="text-sm text-muted-foreground">{selected.moderationNote}</p>
                  </div>
                )}

                {/* Checklist */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Чеклист публикации</h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {selected.checklist.map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 text-sm p-1.5 rounded ${item.ok ? 'text-success' : 'text-destructive bg-destructive/5'}`}>
                        {item.ok ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Description preview */}
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Описание
                  </h3>
                  <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">
                    {selected.description}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{selected.description.length} символов</p>
                </div>

                {/* Image status */}
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 text-sm ${selected.hasImage ? 'text-success' : 'text-warning'}`}>
                    <Image className="h-4 w-4" />
                    {selected.hasImage ? 'Фото загружено' : 'Фото не загружено'}
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${selected.hasSchedule ? 'text-success' : 'text-warning'}`}>
                    <CalendarDays className="h-4 w-4" />
                    {selected.hasSchedule ? `${selected.sessionsCount} сеансов` : 'Расписание не настроено'}
                  </div>
                </div>

                <Separator />

                {/* Action area */}
                {selected.status === 'pending' && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Комментарий модератора (обязателен при отклонении)..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleAction('approved')}>
                        <Check className="h-4 w-4 mr-2" /> Одобрить
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => handleAction('revision')} disabled={!comment.trim()}>
                        <AlertTriangle className="h-4 w-4 mr-2" /> На доработку
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => handleAction('rejected')} disabled={!comment.trim()}>
                        <X className="h-4 w-4 mr-2" /> Отклонить
                      </Button>
                    </div>
                    {!comment.trim() && (
                      <p className="text-xs text-muted-foreground text-center">
                        Для отклонения или возврата на доработку добавьте комментарий
                      </p>
                    )}
                  </div>
                )}

                {selected.status !== 'pending' && (
                  <div className="text-center py-2">
                    <Badge className={`${statusConfig[selected.status].class}`} variant="outline">
                      {statusConfig[selected.status].label}
                    </Badge>
                    {selected.moderationNote && (
                      <p className="text-sm text-muted-foreground mt-2">{selected.moderationNote}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
