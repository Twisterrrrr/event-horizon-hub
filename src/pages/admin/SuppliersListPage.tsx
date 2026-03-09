import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockSuppliers, mockEvents } from "@/data/mock";
import { CheckCircle, XCircle, Clock, ArrowLeft, Save, Plus, Webhook, Key, AlertTriangle, History } from "lucide-react";
import { Link } from "react-router-dom";

const syncBadge = (s: string) => {
  if (s === 'ok') return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />OK</Badge>;
  if (s === 'error') return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Ошибка</Badge>;
  return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Нет расписания</Badge>;
};

function SupplierCard({ onBack }: { onBack: () => void }) {
  const supplier = mockSuppliers[0];
  const events = mockEvents.filter(e => e.supplierId === supplier.id);
  const changeLog = [
    { date: '2026-03-05', user: 'Админ', field: 'Комиссия', from: '12%', to: '15%' },
    { date: '2026-02-20', user: 'Менеджер', field: 'Email', from: 'old@mail.ru', to: 'new@mail.ru' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Назад</Button>
        <h1 className="text-2xl font-bold flex-1">{supplier.name}</h1>
        {syncBadge(supplier.syncStatus)}
        <Button className="gap-1"><Save className="h-4 w-4" /> Сохранить</Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Общее</TabsTrigger>
          <TabsTrigger value="events">События ({events.length})</TabsTrigger>
          <TabsTrigger value="integration">Интеграция</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Реквизиты</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Название</label>
                  <Input defaultValue={supplier.name} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Комиссия (%)</label>
                  <Input defaultValue={supplier.commission} type="number" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Контакты</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input defaultValue="contact@nevatrip.ru" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Телефон</label>
                  <Input defaultValue="+7 (812) 555-00-00" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Города</label>
                  <div className="flex gap-1">{supplier.cities.map(c => <Badge key={c} variant="outline">{c}</Badge>)}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-1"><History className="h-4 w-4" /> История изменений</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {changeLog.map((log, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground text-xs w-24">{log.date}</span>
                    <span className="text-xs text-muted-foreground">{log.user}</span>
                    <span className="font-medium">{log.field}</span>
                    <span className="text-muted-foreground">{log.from} → {log.to}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Событие</TableHead><TableHead>Статус</TableHead><TableHead className="text-right">Цена от</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {events.map(e => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <Link to={`/admin/events/${e.id}`} className="text-primary hover:underline">{e.title}</Link>
                    </TableCell>
                    <TableCell><Badge variant="outline">{e.status}</Badge></TableCell>
                    <TableCell className="text-right">{e.priceFrom?.toLocaleString('ru-RU')} ₽</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-1"><Key className="h-4 w-4" /> API ключи</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Тип интеграции</label>
                  <Badge variant="outline" className="text-sm">{supplier.integration.toUpperCase()}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">API Key</label>
                  <Input defaultValue="••••••••••••" type="password" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-1"><Webhook className="h-4 w-4" /> Webhook</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">URL</label>
                  <Input defaultValue="https://api.nevatrip.ru/webhook" className="font-mono text-xs" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Последняя синхронизация</label>
                  <p className="text-sm text-muted-foreground">{supplier.lastSyncAt ? new Date(supplier.lastSyncAt).toLocaleString('ru-RU') : '—'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-1"><AlertTriangle className="h-4 w-4 text-destructive" /> Последние ошибки</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-4">Нет ошибок за последние 7 дней ✓</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SuppliersListPage() {
  const [view, setView] = useState<'list' | 'card'>('list');

  if (view === 'card') return <SupplierCard onBack={() => setView('list')} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Поставщики</h1>
        <Button className="gap-1"><Plus className="h-4 w-4" /> Добавить</Button>
      </div>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Название</TableHead><TableHead>Города</TableHead><TableHead className="text-center">Событий</TableHead>
            <TableHead>Интеграция</TableHead><TableHead>Синхронизация</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockSuppliers.map(s => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => setView('card')}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.name}</span>
                    {s.syncStatus === 'error' && <AlertTriangle className="h-3 w-3 text-destructive" />}
                  </div>
                </TableCell>
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
