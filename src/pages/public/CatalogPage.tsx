import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockEvents, mockCities, mockCategories } from "@/data/mock";
import { Search, X, MapPin, Star, Clock, Users, Globe, ChevronRight } from "lucide-react";
import type { Event } from "@/types";

const formatPrice = (n?: number) => n ? `от ${n.toLocaleString('ru-RU')} ₽` : '';

function SaleStateBadge({ state }: { state: string }) {
  const map: Record<string, { label: string; className: string }> = {
    on_sale: { label: '', className: '' },
    paused: { label: 'Продажа приостановлена', className: 'bg-warning/10 text-warning border-warning/30' },
    no_dates: { label: 'Даты уточняются', className: 'bg-muted text-muted-foreground' },
    partner_only: { label: 'Только через партнёра', className: 'bg-info/10 text-info border-info/30' },
    sold_out: { label: 'Распродано', className: 'bg-destructive/10 text-destructive border-destructive/30' },
  };
  const m = map[state];
  if (!m || !m.label) return null;
  return <Badge variant="outline" className={m.className}>{m.label}</Badge>;
}

function EventCard({ event }: { event: Event }) {
  const nearestSession = event.sessions[0];
  const lowSeats = nearestSession && nearestSession.availableSeats && nearestSession.availableSeats < 10;

  return (
    <Link to={`/events/${event.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="aspect-[16/10] bg-muted relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          {event.isMultiCity && (
            <Badge className="absolute top-3 left-3 gap-1 bg-accent">
              <Globe className="h-3 w-3" /> {event.citiesCount} городов
            </Badge>
          )}
          {event.datesCount && event.datesCount > 3 && (
            <Badge variant="secondary" className="absolute top-3 right-3">
              {event.datesCount} дат
            </Badge>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-sm font-medium text-primary-foreground/80">{event.categoryName}</p>
            <h3 className="text-lg font-semibold text-primary-foreground group-hover:text-primary-foreground/90 transition-colors">
              {event.title}
            </h3>
          </div>
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{event.cityName}{event.venueName && ` · ${event.venueName}`}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {event.priceFrom && (
                <span className="font-semibold text-lg">{formatPrice(event.priceFrom)}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {lowSeats && (
                <Badge variant="outline" className="text-warning border-warning/30 gap-1">
                  <Users className="h-3 w-3" /> Мало мест
                </Badge>
              )}
              {nearestSession && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {nearestSession.date}
                </span>
              )}
            </div>
          </div>

          {event.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 text-warning fill-warning" />
              <span className="font-medium">{event.rating}</span>
              <span className="text-muted-foreground">({event.reviewsCount})</span>
            </div>
          )}

          <SaleStateBadge state={event.saleState} />
        </CardContent>
      </Card>
    </Link>
  );
}

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const activeFilters = [selectedCity, selectedCategory].filter(Boolean);

  const filtered = useMemo(() => {
    return mockEvents.filter(e => {
      if (e.status !== 'active') return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCity && e.cityId !== selectedCity) return false;
      if (selectedCategory && e.categoryId !== selectedCategory) return false;
      return true;
    });
  }, [search, selectedCity, selectedCategory]);

  const clearAll = () => { setSearch(''); setSelectedCity(null); setSelectedCategory(null); };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Все события</h1>
          <p className="text-muted-foreground mb-6">Найдите лучшие экскурсии, прогулки и развлечения</p>

          {/* Search */}
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск событий..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filter Chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {mockCities.filter(c => c.isFeatured).map(city => (
              <Button
                key={city.id}
                variant={selectedCity === city.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCity(selectedCity === city.id ? null : city.id)}
                className="rounded-full"
              >
                {city.name}
                <Badge variant="secondary" className="ml-1 h-4 min-w-4 text-[10px]">{city.eventsCount}</Badge>
              </Button>
            ))}
            <span className="w-px h-6 bg-border self-center mx-1" />
            {mockCategories.slice(0, 4).map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className="rounded-full"
              >
                {cat.name}
              </Button>
            ))}
            {activeFilters.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="rounded-full gap-1 text-muted-foreground">
                <X className="h-3 w-3" /> Сбросить
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            search={search}
            selectedCity={selectedCity}
            selectedCategory={selectedCategory}
            onClearCity={() => setSelectedCity(null)}
            onClearCategory={() => setSelectedCategory(null)}
            onClearAll={clearAll}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({
  search, selectedCity, selectedCategory, onClearCity, onClearCategory, onClearAll
}: {
  search: string; selectedCity: string | null; selectedCategory: string | null;
  onClearCity: () => void; onClearCategory: () => void; onClearAll: () => void;
}) {
  const cityName = selectedCity ? mockCities.find(c => c.id === selectedCity)?.name : null;
  const catName = selectedCategory ? mockCategories.find(c => c.id === selectedCategory)?.name : null;

  const otherCities = mockCities.filter(c => c.id !== selectedCity && c.eventsCount > 0).slice(0, 3);
  const otherCategories = mockCategories.filter(c => c.id !== selectedCategory && c.eventsCount > 0).slice(0, 3);

  return (
    <div className="text-center py-16 max-w-md mx-auto space-y-6">
      <div>
        <p className="text-lg font-medium">Нет событий по вашему запросу</p>
        <p className="text-sm text-muted-foreground mt-1">
          {search && `По запросу «${search}» `}
          {cityName && `в городе ${cityName} `}
          {catName && `в категории «${catName}» `}
          ничего не найдено
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Попробуйте:</p>
        {selectedCity && otherCities.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-muted-foreground">Другие города:</span>
            {otherCities.map(c => (
              <Button key={c.id} variant="outline" size="sm" className="rounded-full" onClick={onClearCity}>
                {c.name} <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            ))}
          </div>
        )}
        {selectedCategory && otherCategories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-muted-foreground">Другие категории:</span>
            {otherCategories.map(c => (
              <Button key={c.id} variant="outline" size="sm" className="rounded-full" onClick={onClearCategory}>
                {c.name} <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            ))}
          </div>
        )}
        <Button variant="default" size="sm" onClick={onClearAll}>Показать все события</Button>
      </div>
    </div>
  );
}
