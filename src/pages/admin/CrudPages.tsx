import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockVenues, mockCities, mockArticles, mockCollections, mockTags, mockReviews, mockSuppliers, mockSupportTickets, mockReconciliation, mockSeoIssues } from "@/data/mock";
import { Link } from "react-router-dom";
import { ExternalLink, Star, AlertTriangle, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";

// ===== Venues =====
export function VenuesListPage() {
  const typeLabels: Record<string, string> = { museum: 'Музей', boat: 'Теплоход', restaurant: 'Ресторан', theater: 'Театр', open_air: 'Open Air', other: 'Другое' };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Площадки</h1>
      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Название</TableHead><TableHead>Город</TableHead><TableHead>Тип</TableHead>
            <TableHead className="text-center">Событий</TableHead><TableHead className="text-center">Рейтинг</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockVenues.map(v => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.name}</TableCell>
                <TableCell>{v.cityName}</TableCell>
                <TableCell><Badge variant="outline">{typeLabels[v.type]}</Badge></TableCell>
                <TableCell className="text-center">{v.activeEventsCount || <span className="text-muted-foreground">0</span>}</TableCell>
                <TableCell className="text-center">{v.rating ? <span className="flex items-center justify-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" />{v.rating}</span> : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ===== Cities =====
export function CitiesListPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Города</h1>
      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Город</TableHead><TableHead className="text-center">Событий</TableHead>
            <TableHead className="text-center">Площадок</TableHead><TableHead className="text-center">В витрине</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockCities.map(c => (
              <TableRow key={c.id}>
                <TableCell>
                  <div><span className="font-medium">{c.name}</span></div>
                  <span className="text-xs text-muted-foreground">{c.shortDescription}</span>
                </TableCell>
                <TableCell className="text-center"><Link to={`/admin/events?city=${c.id}`} className="text-primary hover:underline">{c.eventsCount}</Link></TableCell>
                <TableCell className="text-center">{c.venuesCount}</TableCell>
                <TableCell className="text-center"><Switch checked={c.isFeatured} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ===== Articles =====
export function ArticlesListPage() {
  const statusBadge = (s: string) => {
    const m: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      published: { label: 'Опубл.', variant: 'default' }, draft: { label: 'Черновик', variant: 'secondary' }, unpublished: { label: 'Снято', variant: 'outline' },
    };
    const v = m[s] || m.draft;
    return <Badge variant={v.variant}>{v.label}</Badge>;
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Статьи</h1>
      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Заголовок</TableHead><TableHead>Город</TableHead><TableHead>Статус</TableHead><TableHead>Обновлено</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockArticles.map(a => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell>{a.cityName || '—'}</TableCell>
                <TableCell>{statusBadge(a.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.updatedAt}</TableCell>
                <TableCell>{a.status === 'published' && <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ===== Collections =====
export function CollectionsListPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Подборки</h1>
      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Название</TableHead><TableHead>Статус</TableHead><TableHead className="text-center">Событий</TableHead><TableHead>Используется</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockCollections.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell><Badge variant={c.isActive ? 'default' : 'secondary'}>{c.isActive ? 'Активна' : 'Скрыта'}</Badge></TableCell>
                <TableCell className="text-center">
                  {c.eventsCount === 0 ? <span className="text-destructive font-medium">0</span> : c.eventsCount}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.usedOnPages.length > 0 ? c.usedOnPages.join(', ') : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ===== Suppliers =====
export function SuppliersListPage() {
  const syncBadge = (s: string) => {
    if (s === 'ok') return <Badge variant="default" className="bg-success"><CheckCircle className="h-3 w-3 mr-1" />OK</Badge>;
    if (s === 'error') return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Ошибка</Badge>;
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Нет расписания</Badge>;
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Поставщики</h1>
      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Название</TableHead><TableHead>Города</TableHead><TableHead className="text-center">Событий</TableHead>
            <TableHead>Интеграция</TableHead><TableHead>Синхронизация</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockSuppliers.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-sm">{s.cities.join(', ')}</TableCell>
                <TableCell className="text-center">{s.activeEventsCount}</TableCell>
                <TableCell><Badge variant="outline">{s.integration.toUpperCase()}</Badge></TableCell>
                <TableCell>{syncBadge(s.syncStatus)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ===== Tags =====
export function TagsListPage() {
  const catLabels: Record<string, string> = { theme: 'Тематика', audience: 'Аудитория', format: 'Формат' };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Теги</h1>
      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Тег</TableHead><TableHead>Slug</TableHead><TableHead>Категория</TableHead>
            <TableHead className="text-center">Событий</TableHead><TableHead className="text-center">В промо</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockTags.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{t.slug}</TableCell>
                <TableCell><Badge variant="outline">{catLabels[t.category]}</Badge></TableCell>
                <TableCell className="text-center">{t.eventsCount}</TableCell>
                <TableCell className="text-center">{t.usedInPromo && <CheckCircle className="h-4 w-4 text-success mx-auto" />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ===== Reviews =====
export function ReviewsListPage() {
  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    new: { label: 'Новый', variant: 'secondary' }, approved: { label: 'Проверен', variant: 'default' },
    hidden: { label: 'Скрыт', variant: 'outline' }, spam: { label: 'Спам', variant: 'destructive' },
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Отзывы</h1>
      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Автор</TableHead><TableHead>Событие</TableHead><TableHead className="text-center">Рейтинг</TableHead>
            <TableHead>Статус</TableHead><TableHead>Дата</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockReviews.map(r => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.authorName}</span>
                    {r.hasComplaint && <AlertTriangle className="h-3 w-3 text-destructive" />}
                  </div>
                </TableCell>
                <TableCell className="text-sm max-w-48 truncate">{r.eventTitle}</TableCell>
                <TableCell className="text-center">
                  <span className="flex items-center justify-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'text-warning fill-warning' : 'text-muted'}`} />
                    ))}
                  </span>
                </TableCell>
                <TableCell><Badge variant={statusMap[r.status].variant}>{statusMap[r.status].label}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.createdAt}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="text-success">✓</Button>
                    <Button variant="ghost" size="sm" className="text-destructive">✕</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ===== Support =====
export function SupportListPage() {
  const prioColors: Record<string, string> = { low: 'bg-muted', medium: 'bg-info', high: 'bg-warning', urgent: 'bg-destructive' };
  const statusLabels: Record<string, string> = { open: 'Открыт', in_progress: 'В работе', resolved: 'Решён', closed: 'Закрыт' };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Поддержка</h1>
      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead></TableHead><TableHead>Тема</TableHead><TableHead>Статус</TableHead>
            <TableHead>Клиент</TableHead><TableHead>Сообщений</TableHead><TableHead>Обновлено</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockSupportTickets.map(t => (
              <TableRow key={t.id}>
                <TableCell><span className={`w-2 h-2 rounded-full inline-block ${prioColors[t.priority]}`} /></TableCell>
                <TableCell className="font-medium">{t.subject}</TableCell>
                <TableCell><Badge variant="outline">{statusLabels[t.status]}</Badge></TableCell>
                <TableCell className="text-sm">{t.customerEmail}</TableCell>
                <TableCell className="text-center">{t.messagesCount}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(t.updatedAt).toLocaleDateString('ru-RU')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ===== Reconciliation =====
export function ReconciliationPage() {
  const typeLabels: Record<string, string> = { missing_in_report: 'Нет в отчёте', wrong_amount: 'Неверная сумма', duplicate: 'Дубль', extra_in_report: 'Лишний в отчёте' };
  const statusLabels: Record<string, { label: string; variant: 'secondary' | 'default' | 'outline' }> = {
    new: { label: 'Новое', variant: 'secondary' }, in_progress: { label: 'В работе', variant: 'default' }, resolved: { label: 'Решено', variant: 'outline' },
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Сверка</h1>
      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Заказ</TableHead><TableHead>Тип расхождения</TableHead><TableHead>Провайдер</TableHead>
            <TableHead className="text-right">Ожидалось</TableHead><TableHead className="text-right">Факт</TableHead>
            <TableHead>Статус</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockReconciliation.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.orderNumber}</TableCell>
                <TableCell><Badge variant="outline">{typeLabels[r.discrepancyType]}</Badge></TableCell>
                <TableCell className="text-sm">{r.provider}</TableCell>
                <TableCell className="text-right">{r.expectedAmount.toLocaleString('ru-RU')} ₽</TableCell>
                <TableCell className="text-right">{r.actualAmount ? `${r.actualAmount.toLocaleString('ru-RU')} ₽` : '—'}</TableCell>
                <TableCell><Badge variant={statusLabels[r.status].variant}>{statusLabels[r.status].label}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm">Решить</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ===== SEO Audit =====
export function SeoAuditPage() {
  const typeLabels: Record<string, string> = { no_title: 'Нет title', duplicate_description: 'Дубль описания', short_text: 'Короткий текст', no_meta: 'Нет мета', missing_image: 'Нет изображения' };
  const sevColors: Record<string, string> = { critical: 'text-destructive', warning: 'text-warning', info: 'text-info' };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">SEO-аудит</h1>
      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Сущность</TableHead><TableHead>Тип</TableHead><TableHead>Проблема</TableHead><TableHead>Важность</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockSeoIssues.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.entityTitle}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.entityType}</TableCell>
                <TableCell>{typeLabels[s.issueType]}</TableCell>
                <TableCell><span className={`font-medium ${sevColors[s.severity]}`}>{s.severity}</span></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ===== Settings =====
export function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Настройки</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Платежи', desc: 'Ключи API, провайдеры оплаты' },
          { title: 'Интеграции', desc: 'TC, Teplohod, Email-рассылка' },
          { title: 'Общие', desc: 'Домены, контакты, базовые URL' },
        ].map(s => (
          <Card key={s.title} className="p-6 cursor-pointer hover:shadow-md transition-shadow">
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ===== Placeholder pages =====
export function PromoBlocksPage() {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Промо-блоки</h1><p className="text-muted-foreground">Управление промо-блоками и визуализация связей.</p></div>;
}
export function UsersPage() {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Пользователи</h1><p className="text-muted-foreground">Управление ролями и доступами.</p></div>;
}
