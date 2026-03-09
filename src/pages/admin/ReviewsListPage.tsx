import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockReviews } from "@/data/mock";
import { Star, AlertTriangle, Camera, CheckCircle, XCircle, Ban, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReviewStatus } from "@/types";

const statusMap: Record<ReviewStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  new: { label: 'Новый', variant: 'secondary' },
  approved: { label: 'Проверен', variant: 'default' },
  hidden: { label: 'Скрыт', variant: 'outline' },
  spam: { label: 'Спам', variant: 'destructive' },
};

function ModerationPanel({ review, onNext, onPrev }: { review: typeof mockReviews[0]; onNext: () => void; onPrev: () => void }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Модерация</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onPrev}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNext}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg border space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{review.authorName}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-warning fill-warning' : 'text-muted'}`} />
              ))}
            </div>
          </div>
          <p className="text-sm">{review.text}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {review.hasPhoto && <span className="flex items-center gap-1"><Camera className="h-3 w-3" /> Есть фото</span>}
            {review.hasComplaint && <span className="flex items-center gap-1 text-destructive"><AlertTriangle className="h-3 w-3" /> Жалоба</span>}
            <span>{review.createdAt}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/admin/events/${review.eventId}`} className="text-xs text-primary hover:underline flex items-center gap-1">
            <ExternalLink className="h-3 w-3" /> {review.eventTitle}
          </Link>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 gap-1 bg-success hover:bg-success/90"><CheckCircle className="h-4 w-4" /> Принять</Button>
          <Button variant="outline" className="flex-1 gap-1"><XCircle className="h-4 w-4" /> Скрыть</Button>
          <Button variant="destructive" className="gap-1"><Ban className="h-4 w-4" /> Спам</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReviewsListPage() {
  const [filter, setFilter] = useState<'all' | ReviewStatus | 'low' | 'photo' | 'complaint'>('all');
  const [moderationIdx, setModerationIdx] = useState(0);

  const filtered = mockReviews.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'low') return r.rating <= 2;
    if (filter === 'photo') return r.hasPhoto;
    if (filter === 'complaint') return r.hasComplaint;
    return r.status === filter;
  });

  const newCount = mockReviews.filter(r => r.status === 'new').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Отзывы</h1>
        {newCount > 0 && <Badge variant="secondary">{newCount} новых</Badge>}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Все' },
          { key: 'new', label: 'Новые' },
          { key: 'approved', label: 'Проверенные' },
          { key: 'hidden', label: 'Скрытые' },
          { key: 'low', label: '⭐ 1-2' },
          { key: 'photo', label: '📷 С фото' },
          { key: 'complaint', label: '⚠️ Жалобы' },
        ].map(f => (
          <Button key={f.key} variant={filter === f.key ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f.key as typeof filter)}>
            {f.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Автор</TableHead><TableHead>Событие</TableHead><TableHead className="text-center">Рейтинг</TableHead>
                <TableHead>Статус</TableHead><TableHead>Дата</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((r, idx) => (
                  <TableRow
                    key={r.id}
                    className={`cursor-pointer ${idx === moderationIdx ? 'bg-primary/5' : ''}`}
                    onClick={() => setModerationIdx(idx)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{r.authorName}</span>
                        {r.hasComplaint && <AlertTriangle className="h-3 w-3 text-destructive" />}
                        {r.hasPhoto && <Camera className="h-3 w-3 text-muted-foreground" />}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {filtered[moderationIdx] && (
          <ModerationPanel
            review={filtered[moderationIdx]}
            onNext={() => setModerationIdx(Math.min(moderationIdx + 1, filtered.length - 1))}
            onPrev={() => setModerationIdx(Math.max(moderationIdx - 1, 0))}
          />
        )}
      </div>
    </div>
  );
}
