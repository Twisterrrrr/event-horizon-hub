import { useParams, Link } from "react-router-dom";
import { mockEvents } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Clock, Users, Calendar, AlertTriangle, ExternalLink, ArrowLeft } from "lucide-react";

const formatPrice = (n: number) => `${n.toLocaleString('ru-RU')} ₽`;

function SaleStateBlock({ state }: { state: string }) {
  const configs: Record<string, { icon: React.ReactNode; title: string; desc: string; className: string }> = {
    paused: { icon: <AlertTriangle className="h-5 w-5" />, title: 'Продажа приостановлена', desc: 'Билеты временно недоступны. Следите за обновлениями.', className: 'bg-warning/10 border-warning/30 text-warning' },
    no_dates: { icon: <Calendar className="h-5 w-5" />, title: 'Даты уточняются', desc: 'Расписание скоро будет обновлено.', className: 'bg-muted border-border text-muted-foreground' },
    partner_only: { icon: <ExternalLink className="h-5 w-5" />, title: 'Продажа через партнёра', desc: 'Билеты доступны только на сайте организатора.', className: 'bg-info/10 border-info/30 text-info' },
    sold_out: { icon: <Users className="h-5 w-5" />, title: 'Все билеты проданы', desc: 'Попробуйте выбрать другую дату или событие.', className: 'bg-destructive/10 border-destructive/30 text-destructive' },
  };
  const cfg = configs[state];
  if (!cfg) return null;
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${cfg.className}`}>
      {cfg.icon}
      <div>
        <p className="font-medium">{cfg.title}</p>
        <p className="text-sm opacity-80">{cfg.desc}</p>
      </div>
    </div>
  );
}

export default function EventPage() {
  const { slug } = useParams();
  const event = mockEvents.find(e => e.slug === slug);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Событие не найдено</h1>
          <Link to="/events"><Button>Вернуться к каталогу</Button></Link>
        </div>
      </div>
    );
  }

  const canBuy = event.saleState === 'on_sale' && event.sessions.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <Link to="/events" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Назад к каталогу
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="aspect-video bg-muted rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Изображение события
              </div>
            </div>

            {/* Section 1: Description */}
            <section id="description">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2">{event.categoryName}</Badge>
                  <h1 className="text-3xl font-bold">{event.title}</h1>
                </div>
                {event.rating && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="h-5 w-5 text-warning fill-warning" />
                    <span className="font-semibold text-lg">{event.rating}</span>
                    <span className="text-sm text-muted-foreground">({event.reviewsCount})</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{event.cityName}{event.venueName && ` · ${event.venueName}`}</span>
              </div>

              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </section>

            <Separator />

            {/* Section 2: Schedule */}
            <section id="schedule">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Расписание и билеты
              </h2>

              <SaleStateBlock state={event.saleState} />

              {canBuy && (
                <div className="space-y-3 mt-4">
                  {event.sessions.map(session => {
                    const lowSeats = session.availableSeats !== undefined && session.availableSeats < 10;
                    return (
                      <Card key={session.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-16">
                              <p className="text-lg font-bold">{new Date(session.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</p>
                              <p className="text-sm text-muted-foreground">{session.time}</p>
                            </div>
                            <Separator orientation="vertical" className="h-10" />
                            <div>
                              <p className="font-semibold text-lg">{formatPrice(session.price)}</p>
                              {session.availableSeats !== undefined && (
                                <p className={`text-sm flex items-center gap-1 ${lowSeats ? 'text-warning font-medium' : 'text-muted-foreground'}`}>
                                  <Users className="h-3 w-3" />
                                  {lowSeats ? `Осталось ${session.availableSeats} мест` : `${session.availableSeats} мест`}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button>Купить</Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right: Sticky Purchase Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Быстрая покупка</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.priceFrom && (
                    <div>
                      <p className="text-sm text-muted-foreground">Цена</p>
                      <p className="text-2xl font-bold">от {formatPrice(event.priceFrom)}</p>
                    </div>
                  )}

                  {event.sessions.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ближайшая дата</p>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(event.sessions[0].date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}, {event.sessions[0].time}
                      </p>
                    </div>
                  )}

                  {canBuy ? (
                    <Button className="w-full" size="lg">Выбрать билет</Button>
                  ) : (
                    <SaleStateBlock state={event.saleState} />
                  )}
                </CardContent>
              </Card>

              {event.venueName && (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Площадка</p>
                    <p className="font-medium">{event.venueName}</p>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {event.cityName}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
