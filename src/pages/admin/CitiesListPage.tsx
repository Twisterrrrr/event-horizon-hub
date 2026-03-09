import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { mockCities } from "@/data/mock";
import { ArrowLeft, Save, MapPin, Calendar, Building2, Megaphone, Plus, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

function CityForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');

  const requiredFields = [
    { label: 'Название', filled: !!name },
    { label: 'Slug', filled: !!slug },
    { label: 'Описание', filled: !!shortDesc },
    { label: 'Изображение', filled: false },
  ];
  const filledCount = requiredFields.filter(f => f.filled).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Назад</Button>
        <h1 className="text-2xl font-bold flex-1">Новый город</h1>
        <Button className="gap-1"><Save className="h-4 w-4" /> Сохранить</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Основное</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Название *</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Санкт-Петербург" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Slug *</label>
                <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="spb" className="font-mono text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Короткое описание *</label>
                <Input value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="Культурная столица России" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Изображение *</label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground text-sm">
                  Перетащите или нажмите для загрузки
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                Заполненность
                <Badge variant={filledCount === requiredFields.length ? 'default' : 'secondary'}>
                  {filledCount}/{requiredFields.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {requiredFields.map(f => (
                  <div key={f.label} className="flex items-center gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full ${f.filled ? 'bg-success' : 'bg-muted-foreground/30'}`} />
                    <span className={f.filled ? '' : 'text-muted-foreground'}>{f.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Превью на главной</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="h-24 bg-muted flex items-center justify-center text-muted-foreground text-xs">
                  {name ? '' : 'Нет изображения'}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm">{name || 'Название города'}</p>
                  <p className="text-xs text-muted-foreground">{shortDesc || 'Описание'}</p>
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                    <span>0 событий</span>
                    <span>0 площадок</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CitiesListPage() {
  const [view, setView] = useState<'list' | 'form'>('list');

  if (view === 'form') return <CityForm onBack={() => setView('list')} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Города</h1>
        <Button onClick={() => setView('form')} className="gap-1"><Plus className="h-4 w-4" /> Добавить</Button>
      </div>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Город</TableHead>
            <TableHead className="text-center"><Calendar className="h-3.5 w-3.5 inline mr-1" />Событий</TableHead>
            <TableHead className="text-center"><Building2 className="h-3.5 w-3.5 inline mr-1" />Площадок</TableHead>
            <TableHead className="text-center"><Megaphone className="h-3.5 w-3.5 inline mr-1" />Промо</TableHead>
            <TableHead className="text-center">В витрине</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {mockCities.map(c => (
              <TableRow key={c.id} className="cursor-pointer" onClick={() => setView('form')}>
                <TableCell>
                  <div>
                    <span className="font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">/{c.slug}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{c.shortDescription}</span>
                </TableCell>
                <TableCell className="text-center">
                  <Link to={`/admin/events?city=${c.id}`} className="text-primary hover:underline font-medium" onClick={e => e.stopPropagation()}>
                    {c.eventsCount}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <Link to={`/admin/venues?city=${c.id}`} className="text-primary hover:underline" onClick={e => e.stopPropagation()}>
                    {c.venuesCount}
                  </Link>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">—</TableCell>
                <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                  <Switch checked={c.isFeatured} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
