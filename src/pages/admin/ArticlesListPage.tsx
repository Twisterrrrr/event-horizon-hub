import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { mockArticles, mockCities } from "@/data/mock";
import { ExternalLink, Search, X, Plus, ArrowLeft, Save, Clock, Eye, Smartphone, Monitor } from "lucide-react";
import type { ArticleStatus } from "@/types";

const statusBadge = (s: ArticleStatus) => {
  const m: Record<ArticleStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    published: { label: 'Опубликовано', variant: 'default' },
    draft: { label: 'Черновик', variant: 'secondary' },
    unpublished: { label: 'Снято', variant: 'outline' },
  };
  const v = m[s];
  return <Badge variant={v.variant}>{v.label}</Badge>;
};

function ArticleForm({ onBack }: { onBack: () => void }) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [slug, setSlug] = useState('');
  const [preview, setPreview] = useState<'mobile' | 'desktop'>('desktop');

  const autoSave = useCallback(() => {
    if (title || body) setLastSaved(new Date());
  }, [title, body]);

  useEffect(() => {
    const timer = setInterval(autoSave, 10000);
    return () => clearInterval(timer);
  }, [autoSave]);

  const secondsAgo = lastSaved ? Math.round((Date.now() - lastSaved.getTime()) / 1000) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Назад</Button>
        <h1 className="text-2xl font-bold flex-1">Новая статья</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {lastSaved && <><Clock className="h-3 w-3" /> Сохранено {secondsAgo}с назад</>}
        </div>
        <Button className="gap-1"><Save className="h-4 w-4" /> Сохранить</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Content */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Контент</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Заголовок</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Заголовок статьи" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Текст</label>
                <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Содержание статьи..." rows={12} />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">SEO Title <span className="text-muted-foreground font-normal">({seoTitle.length}/60)</span></label>
                <Input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="Title для поисковиков" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">SEO Description <span className="text-muted-foreground font-normal">({seoDesc.length}/160)</span></label>
                <Textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} placeholder="Description" rows={2} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Slug</label>
                <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="article-slug" className="font-mono text-sm" />
              </div>
            </CardContent>
          </Card>

          {/* Bindings */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Привязки</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Город</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Выберите город" /></SelectTrigger>
                  <SelectContent>
                    {mockCities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Теги</label>
                <Input placeholder="Добавьте теги через запятую" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview column */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-1"><Eye className="h-4 w-4" /> Превью</CardTitle>
                <div className="flex gap-1">
                  <Button variant={preview === 'desktop' ? 'default' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setPreview('desktop')}><Monitor className="h-3 w-3" /></Button>
                  <Button variant={preview === 'mobile' ? 'default' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setPreview('mobile')}><Smartphone className="h-3 w-3" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`border rounded-lg p-4 bg-background ${preview === 'mobile' ? 'max-w-[320px] mx-auto' : ''}`}>
                <h2 className="font-bold text-lg">{title || 'Заголовок статьи'}</h2>
                <Separator className="my-2" />
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {body || 'Содержание статьи будет отображаться здесь...'}
                </p>
              </div>
            </CardContent>
          </Card>

          {seoTitle && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Сниппет в поиске</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-primary text-sm font-medium hover:underline cursor-pointer">{seoTitle}</p>
                  <p className="text-xs text-success font-mono">daibilet.ru/{slug || 'article-slug'}</p>
                  <p className="text-xs text-muted-foreground">{seoDesc || 'Описание страницы...'}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArticlesListPage() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  const filtered = mockArticles.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (cityFilter !== 'all' && a.cityId !== cityFilter) return false;
    return true;
  });

  if (view === 'form') return <ArticleForm onBack={() => setView('list')} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Статьи</h1>
        <Button onClick={() => setView('form')} className="gap-1"><Plus className="h-4 w-4" /> Новая статья</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="published">Опубликовано</SelectItem>
                <SelectItem value="draft">Черновик</SelectItem>
                <SelectItem value="unpublished">Снято</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все города</SelectItem>
                {mockCities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {(search || statusFilter !== 'all' || cityFilter !== 'all') && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter('all'); setCityFilter('all'); }}><X className="h-3 w-3 mr-1" /> Сбросить</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Заголовок</TableHead><TableHead>Город</TableHead><TableHead>Теги</TableHead>
            <TableHead>Статус</TableHead><TableHead>Обновлено</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map(a => (
              <TableRow key={a.id} className="cursor-pointer" onClick={() => setView('form')}>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell className="text-sm">{a.cityName || '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">{a.tags.map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}</div>
                </TableCell>
                <TableCell>{statusBadge(a.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.updatedAt}</TableCell>
                <TableCell>
                  {a.status === 'published' && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => e.stopPropagation()}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
