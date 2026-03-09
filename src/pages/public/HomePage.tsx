import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockEvents, mockCities, mockCollections } from "@/data/mock";
import { ArrowRight, MapPin, Star, Globe, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const featuredEvents = mockEvents.filter(e => e.status === 'active').slice(0, 4);
  const featuredCities = mockCities.filter(c => c.isFeatured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-card overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center space-y-6">
          <Badge variant="secondary" className="text-sm">Агрегатор билетов</Badge>
          <h1 className="text-5xl font-bold tracking-tight">
            Откройте лучшие события
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Экскурсии, теплоходы, музеи и развлечения в городах России
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Что ищете?" className="pl-12 h-12 text-base rounded-full" />
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Популярные города</h2>
          <Link to="/events" className="text-sm text-primary hover:underline flex items-center gap-1">
            Все города <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCities.map(city => (
            <Link key={city.id} to={`/events?city=${city.id}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[2/1] bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-semibold text-primary-foreground">{city.name}</h3>
                    <p className="text-sm text-primary-foreground/80">{city.eventsCount} событий</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Популярные события</h2>
          <Link to="/events" className="text-sm text-primary hover:underline flex items-center gap-1">
            Все события <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredEvents.map(event => (
            <Link key={event.id} to={`/events/${event.slug}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="aspect-[4/3] bg-muted relative">
                  {event.isMultiCity && (
                    <Badge className="absolute top-2 left-2 gap-1 bg-accent text-accent-foreground">
                      <Globe className="h-3 w-3" /> {event.citiesCount} городов
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">{event.categoryName}</p>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {event.cityName}
                  </div>
                  <div className="flex items-center justify-between">
                    {event.priceFrom && <span className="font-semibold">от {event.priceFrom.toLocaleString('ru-RU')} ₽</span>}
                    {event.rating && (
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 text-warning fill-warning" /> {event.rating}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
