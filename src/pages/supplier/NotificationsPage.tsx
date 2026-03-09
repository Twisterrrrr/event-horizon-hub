import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart, ShieldCheck, AlertTriangle, Bell, Check,
  Clock, CheckCircle, XCircle, ArrowRight, Trash2
} from "lucide-react";
import { Link } from "react-router-dom";

type NotifType = 'order' | 'moderation' | 'limit' | 'system';

interface SupplierNotification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  link?: string;
  linkLabel?: string;
  isRead: boolean;
  createdAt: string;
}

const mockNotifications: SupplierNotification[] = [
  {
    id: 'n1', type: 'order', title: 'Новый заказ DAI-2026-0012',
    message: 'Ночная прогулка по рекам и каналам · 3 билета · 2 400 ₽',
    link: '/supplier/reports', linkLabel: 'Отчёты',
    isRead: false, createdAt: '2026-03-09T14:30:00',
  },
  {
    id: 'n2', type: 'moderation', title: 'Событие одобрено',
    message: '«Джаз на теплоходе» прошло модерацию и опубликовано в каталоге.',
    link: '/supplier/events', linkLabel: 'Мои события',
    isRead: false, createdAt: '2026-03-09T12:00:00',
  },
  {
    id: 'n3', type: 'moderation', title: 'Событие отклонено',
    message: '«Экскурсия «Мосты и дворцы»» — описание не соответствует требованиям. Уберите рекламные ссылки.',
    link: '/supplier/events', linkLabel: 'Исправить',
    isRead: false, createdAt: '2026-03-09T10:15:00',
  },
  {
    id: 'n4', type: 'limit', title: 'Приближение к лимиту событий',
    message: 'Вы использовали 4 из 5 доступных слотов для активных событий. Повысьте уровень доверия для увеличения лимита.',
    link: '/supplier/settings', linkLabel: 'Настройки',
    isRead: false, createdAt: '2026-03-09T09:00:00',
  },
  {
    id: 'n5', type: 'order', title: 'Новый заказ DAI-2026-0011',
    message: 'Прогулка по крышам Петербурга · 2 билета · 3 000 ₽',
    link: '/supplier/reports', linkLabel: 'Отчёты',
    isRead: true, createdAt: '2026-03-08T18:45:00',
  },
  {
    id: 'n6', type: 'order', title: 'Возврат по заказу DAI-2026-0005',
    message: 'Прогулка по крышам Петербурга · 2 билета · 3 000 ₽ возвращено клиенту.',
    link: '/supplier/reports', linkLabel: 'Отчёты',
    isRead: true, createdAt: '2026-03-08T16:00:00',
  },
  {
    id: 'n7', type: 'moderation', title: 'Событие отправлено на доработку',
    message: '«Дневной круиз по Неве» — добавьте фото и расписание для публикации.',
    link: '/supplier/events', linkLabel: 'Редактировать',
    isRead: true, createdAt: '2026-03-08T11:30:00',
  },
  {
    id: 'n8', type: 'system', title: 'Комиссия обновлена',
    message: 'Ваша комиссия изменена с 18% на 15%. Изменение вступило в силу.',
    isRead: true, createdAt: '2026-03-07T10:00:00',
  },
  {
    id: 'n9', type: 'limit', title: 'Лимит сеансов',
    message: 'Событие «Ночная прогулка» имеет 12 активных сеансов — максимум для уровня «Проверен» — 15.',
    isRead: true, createdAt: '2026-03-06T14:00:00',
  },
];

const typeConfig: Record<NotifType, { icon: typeof Bell; label: string; color: string }> = {
  order: { icon: ShoppingCart, label: 'Заказ', color: 'text-primary bg-primary/10' },
  moderation: { icon: ShieldCheck, label: 'Модерация', color: 'text-warning bg-warning/10' },
  limit: { icon: AlertTriangle, label: 'Лимит', color: 'text-destructive bg-destructive/10' },
  system: { icon: Bell, label: 'Система', color: 'text-muted-foreground bg-muted' },
};

const formatDate = (d: string) => {
  const date = new Date(d);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffM = Math.floor(diffMs / 60000);
  if (diffM < 60) return `${diffM} мин. назад`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `${diffH} ч. назад`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'Вчера';
  return `${diffD} дн. назад`;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | NotifType>('all');

  const filtered = notifications.filter(n => filter === 'all' || n.type === filter);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Уведомления</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Все прочитаны'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Check className="h-4 w-4 mr-1" /> Прочитать все
          </Button>
        )}
      </div>

      <Tabs value={filter} onValueChange={v => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">
            Все
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 text-[10px] justify-center">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="order">Заказы</TabsTrigger>
          <TabsTrigger value="moderation">Модерация</TabsTrigger>
          <TabsTrigger value="limit">Лимиты</TabsTrigger>
          <TabsTrigger value="system">Система</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Нет уведомлений в этой категории</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => {
            const cfg = typeConfig[n.type];
            const Icon = cfg.icon;
            return (
              <Card
                key={n.id}
                className={`transition-colors ${!n.isRead ? 'border-primary/30 bg-primary/[0.02]' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${cfg.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${!n.isRead ? '' : 'text-muted-foreground'}`}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {formatDate(n.createdAt)}
                        </span>
                        <Badge variant="outline" className={`text-[10px] ${cfg.color} border-0`}>
                          {cfg.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {n.link && (
                        <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
                          <Link to={n.link}>
                            {n.linkLabel || 'Перейти'} <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      )}
                      {!n.isRead && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markRead(n.id)} title="Прочитано">
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => deleteNotif(n.id)} title="Удалить">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
