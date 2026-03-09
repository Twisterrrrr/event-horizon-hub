import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockTags } from "@/data/mock";
import { Plus, ArrowLeft, Save, CheckCircle, AlertCircle, X } from "lucide-react";

const catLabels: Record<string, string> = { theme: 'Тематика', audience: 'Аудитория', format: 'Формат' };
const catColors: Record<string, string> = { theme: 'bg-primary/10 text-primary', audience: 'bg-info/10 text-info', format: 'bg-accent/10 text-accent' };

function TagForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const slugValid = /^[a-z0-9-]+$/.test(slug) && slug.length >= 2;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Назад</Button>
        <h1 className="text-2xl font-bold flex-1">Новый тег</h1>
        <Button className="gap-1"><Save className="h-4 w-4" /> Сохранить</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Основное</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Название <span className="text-muted-foreground font-normal">({name.length}/30)</span></label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ночной" maxLength={30} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Slug</label>
                <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="night" className="font-mono text-sm" />
                {slug && !slugValid && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Только латиница, цифры и дефис. Мин. 2 символа.
                  </p>
                )}
                {slug && slugValid && (
                  <p className="text-xs text-success mt-1">URL: /events?tag={slug}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Категория</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(catLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Назначение тега</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="p-2 rounded bg-muted/50">
                  <p className="font-medium text-foreground">Тематика</p>
                  <p className="text-xs">Используется для фильтрации в каталоге и SEO</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="font-medium text-foreground">Аудитория</p>
                  <p className="text-xs">Для рекомендаций и персонализации витрины</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="font-medium text-foreground">Формат</p>
                  <p className="text-xs">Тип мероприятия (мастер-класс, прогулка и т.д.)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Правила</CardTitle></CardHeader>
            <CardContent>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>• Название: до 30 символов</li>
                <li>• Slug: латиница, цифры, дефис</li>
                <li>• Slug влияет на URL: изменение сломает ссылки</li>
                <li>• Удаление тега не удаляет события</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function TagsListPage() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [catFilter, setCatFilter] = useState('all');

  const filtered = mockTags.filter(t => catFilter === 'all' || t.category === catFilter);

  if (view === 'form') return <TagForm onBack={() => setView('list')} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Теги</h1>
        <div className="flex gap-2">
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {Object.entries(catLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => setView('form')} className="gap-1"><Plus className="h-4 w-4" /> Создать</Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Тег</TableHead><TableHead>Slug</TableHead><TableHead>Категория</TableHead>
            <TableHead className="text-center">Событий</TableHead><TableHead className="text-center">В промо</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map(t => (
              <TableRow key={t.id} className="cursor-pointer" onClick={() => setView('form')}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{t.slug}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${catColors[t.category]}`}>
                    {catLabels[t.category]}
                  </span>
                </TableCell>
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
