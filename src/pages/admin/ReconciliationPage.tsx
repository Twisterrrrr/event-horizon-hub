import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { mockReconciliation } from "@/data/mock";
import { CheckCircle, AlertTriangle, Clock, MessageSquare } from "lucide-react";
import type { ReconciliationStatus } from "@/types";

const typeLabels: Record<string, string> = {
  missing_in_report: 'Нет в отчёте TC',
  wrong_amount: 'Неверная сумма',
  duplicate: 'Дубль',
  extra_in_report: 'Лишний в отчёте',
};

const statusConfig: Record<ReconciliationStatus, { label: string; variant: 'secondary' | 'default' | 'outline'; icon: React.ElementType }> = {
  new: { label: 'Новое', variant: 'secondary', icon: AlertTriangle },
  in_progress: { label: 'В работе', variant: 'default', icon: Clock },
  resolved: { label: 'Решено', variant: 'outline', icon: CheckCircle },
};

function ResolveDialog({ item }: { item: typeof mockReconciliation[0] }) {
  const [comment, setComment] = useState('');
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <CheckCircle className="h-3 w-3" /> Решить
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отметить как решённое</DialogTitle>
          <DialogDescription>
            Заказ {item.orderNumber} · {typeLabels[item.discrepancyType]}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Комментарий</label>
            <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Что было сделано для решения..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button className="gap-1"><CheckCircle className="h-4 w-4" /> Отметить решённым</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ReconciliationPage() {
  const [tab, setTab] = useState<'all' | ReconciliationStatus>('all');

  const filtered = tab === 'all' ? mockReconciliation : mockReconciliation.filter(r => r.status === tab);
  const counts = {
    new: mockReconciliation.filter(r => r.status === 'new').length,
    in_progress: mockReconciliation.filter(r => r.status === 'in_progress').length,
    resolved: mockReconciliation.filter(r => r.status === 'resolved').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Сверка</h1>
        {counts.new > 0 && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" /> {counts.new} новых
          </Badge>
        )}
      </div>

      {/* Operator brief */}
      <Card className="border-info/30 bg-info/5">
        <CardContent className="p-4">
          <p className="text-sm font-medium">📋 Задачи оператора на сегодня:</p>
          <ul className="text-sm text-muted-foreground mt-1 space-y-1">
            {counts.new > 0 && <li>• Разобрать <strong className="text-foreground">{counts.new}</strong> новых несоответствий</li>}
            {counts.in_progress > 0 && <li>• Проверить <strong className="text-foreground">{counts.in_progress}</strong> в работе</li>}
            {counts.new === 0 && counts.in_progress === 0 && <li>✓ Все сверки закрыты!</li>}
          </ul>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={v => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">Все ({mockReconciliation.length})</TabsTrigger>
          <TabsTrigger value="new" className="gap-1">Новые {counts.new > 0 && <Badge variant="destructive" className="h-5 min-w-5 text-[10px]">{counts.new}</Badge>}</TabsTrigger>
          <TabsTrigger value="in_progress">В работе ({counts.in_progress})</TabsTrigger>
          <TabsTrigger value="resolved">Решённые ({counts.resolved})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Заказ</TableHead><TableHead>Тип расхождения</TableHead><TableHead>Провайдер</TableHead>
            <TableHead className="text-right">Ожидалось</TableHead><TableHead className="text-right">Факт</TableHead>
            <TableHead>Статус</TableHead><TableHead>Комментарий</TableHead><TableHead></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map(r => {
              const cfg = statusConfig[r.status];
              const StatusIcon = cfg.icon;
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.orderNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={r.discrepancyType === 'wrong_amount' ? 'border-warning text-warning' : ''}>
                      {typeLabels[r.discrepancyType]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{r.provider}</TableCell>
                  <TableCell className="text-right font-medium">{r.expectedAmount.toLocaleString('ru-RU')} ₽</TableCell>
                  <TableCell className="text-right">
                    {r.actualAmount ? (
                      <span className={r.actualAmount !== r.expectedAmount ? 'text-destructive font-medium' : ''}>
                        {r.actualAmount.toLocaleString('ru-RU')} ₽
                      </span>
                    ) : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={cfg.variant} className="gap-1">
                      <StatusIcon className="h-3 w-3" />{cfg.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-32 truncate">
                    {r.comment && <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{r.comment}</span>}
                  </TableCell>
                  <TableCell>
                    {r.status !== 'resolved' && <ResolveDialog item={r} />}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
