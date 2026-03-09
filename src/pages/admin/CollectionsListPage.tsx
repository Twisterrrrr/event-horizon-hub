import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockCollections, mockCategories } from "@/data/mock";
import { Plus, ArrowLeft, Save, Eye, AlertTriangle, FolderOpen } from "lucide-react";

function CollectionForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const eventCount = categories.length > 0 ? Math.floor(Math.random() * 10) + 1 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Назад</Button>
        <h1 className="text-2xl font-bold flex-1">Новая подборка</h1>
        <Button className="gap-1"><Save className="h-4 w-4" /> Сохранить</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Основное</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Название</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Лучшие прогулки на теплоходе" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Фильтр по категориям</label>
                <Select onValueChange={v => setCategories([...categories, v])}>
                  <SelectTrigger><SelectValue placeholder="Добавить категорию" /></SelectTrigger>
                  <SelectContent>
                    {mockCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {categories.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {categories.map(c => (
                      <Badge key={c} variant="secondary" className="cursor-pointer" onClick={() => setCategories(categories.filter(x => x !== c))}>
                        {c} ✕
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {eventCount === 0 && categories.length > 0 && (
            <Card className="border-destructive">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Фильтры дают 0 событий</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Измените фильтры, чтобы подборка не была пустой.</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-1"><Eye className="h-4 w-4" /> Превью</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-sm">{name || 'Название подборки'}</h3>
                <p className="text-xs text-muted-foreground mt-1">{eventCount} событий</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-16 bg-muted rounded" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CollectionsListPage() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [filter, setFilter] = useState('all');

  const filtered = mockCollections.filter(c => {
    if (filter === 'empty') return c.eventsCount === 0;
    if (filter === 'few') return c.eventsCount > 0 && c.eventsCount < 3;
    return true;
  });

  if (view === 'form') return <CollectionForm onBack={() => setView('list')} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Подборки</h1>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="empty">Пустые (0 событий)</SelectItem>
              <SelectItem value="few">Мало событий (&lt;3)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setView('form')} className="gap-1"><Plus className="h-4 w-4" /> Создать</Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Название</TableHead><TableHead>Статус</TableHead>
            <TableHead className="text-center">Событий</TableHead><TableHead>Используется на</TableHead>
            <TableHead>Фильтры</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id} className="cursor-pointer" onClick={() => setView('form')}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    {c.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={c.isActive ? 'default' : 'secondary'}>{c.isActive ? 'Активна' : 'Скрыта'}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {c.eventsCount === 0 ? (
                    <span className="text-destructive font-medium flex items-center justify-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> 0
                    </span>
                  ) : c.eventsCount}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {c.usedOnPages.length > 0 ? c.usedOnPages.join(', ') : <span className="italic">Нигде</span>}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {c.filterCategories?.map(cat => <Badge key={cat} variant="outline" className="text-[10px]">{cat}</Badge>)}
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
