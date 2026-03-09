import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockVenues, mockCities, mockEvents } from "@/data/mock";
import { Star, ArrowLeft, Save, Plus, MapPin, Calendar, ExternalLink, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { VenueType } from "@/types";

const typeLabels: Record<VenueType, string> = {
  museum: 'Музей', boat: 'Теплоход', restaurant: 'Ресторан',
  theater: 'Театр', open_air: 'Open Air', other: 'Другое'
};

function VenueForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const linkedEvents = mockEvents.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Назад</Button>
        <h1 className="text-2xl font-bold flex-1">Новая площадка</h1>
        <Button className="gap-1"><Save className="h-4 w-4" /> Сохранить</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Основное</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Название</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Эрмитаж" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Город</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Город" /></SelectTrigger>
                    <SelectContent>
                      {mockCities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Тип</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Тип" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Адрес</label>
                <Input placeholder="Дворцовая площадь, 2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Lat</label>
                  <Input value={lat} onChange={e => setLat(e.target.value)} placeholder="59.9398" className="font-mono text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Lng</label>
                  <Input value={lng} onChange={e => setLng(e.target.value)} placeholder="30.3146" className="font-mono text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Цена и рейтинг</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-info">ℹ</span>
                <span>Рейтинг и «цена от» рассчитываются автоматически на основе привязанных событий. Можно задать вручную для переопределения.</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Цена от (переопр.)</label>
                  <Input placeholder="Авто" type="number" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Рейтинг (переопр.)</label>
                  <Input placeholder="Авто" type="number" step="0.1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Map preview */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-1"><MapPin className="h-4 w-4" /> Карта</CardTitle></CardHeader>
            <CardContent>
              {lat && lng ? (
                <a
                  href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="border rounded-lg h-40 bg-muted flex items-center justify-center text-sm text-primary hover:bg-muted/80 transition-colors">
                    <MapPin className="h-5 w-5 mr-1" /> Открыть на карте ↗
                  </div>
                </a>
              ) : (
                <div className="border rounded-lg h-40 bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  Укажите координаты
                </div>
              )}
            </CardContent>
          </Card>

          {/* Linked events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-1"><Calendar className="h-4 w-4" /> Связанные события</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {linkedEvents.map(e => (
                  <Link key={e.id} to={`/admin/events/${e.id}`}>
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 text-sm">
                      <span className="flex-1 truncate">{e.title}</span>
                      <Badge variant="outline" className="text-[10px]">{e.status}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function VenuesListPage() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [showEmpty, setShowEmpty] = useState(false);

  const filtered = mockVenues.filter(v => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (cityFilter !== 'all' && v.cityId !== cityFilter) return false;
    if (showEmpty && v.activeEventsCount > 0) return false;
    return true;
  });

  if (view === 'form') return <VenueForm onBack={() => setView('list')} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Площадки</h1>
        <Button onClick={() => setView('form')} className="gap-1"><Plus className="h-4 w-4" /> Добавить</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Город" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все города</SelectItem>
                {mockCities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant={showEmpty ? 'default' : 'outline'} size="sm" onClick={() => setShowEmpty(!showEmpty)}>
              Без событий
            </Button>
            {(search || cityFilter !== 'all' || showEmpty) && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setCityFilter('all'); setShowEmpty(false); }}>
                <X className="h-3 w-3 mr-1" /> Сбросить
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Название</TableHead><TableHead>Город</TableHead><TableHead>Тип</TableHead>
            <TableHead className="text-center">Событий</TableHead><TableHead className="text-center">Рейтинг</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map(v => (
              <TableRow key={v.id} className="cursor-pointer" onClick={() => setView('form')}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{v.name}</span>
                    {v.activeEventsCount === 0 && <Badge variant="outline" className="text-[10px] text-warning">Архив?</Badge>}
                  </div>
                  {v.address && <p className="text-xs text-muted-foreground">{v.address}</p>}
                </TableCell>
                <TableCell className="text-sm">{v.cityName}</TableCell>
                <TableCell><Badge variant="outline">{typeLabels[v.type]}</Badge></TableCell>
                <TableCell className="text-center">
                  {v.activeEventsCount > 0 ? (
                    <span className="font-medium">{v.activeEventsCount}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {v.rating ? (
                    <span className="flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 text-warning fill-warning" />{v.rating}
                    </span>
                  ) : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
