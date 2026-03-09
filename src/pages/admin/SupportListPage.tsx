import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { mockSupportTickets } from "@/data/mock";
import { ArrowLeft, Send, Clock, User, ExternalLink, MessageSquare, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { TicketStatus } from "@/types";

const statusConfig: Record<TicketStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  open: { label: 'Открыт', variant: 'destructive' },
  in_progress: { label: 'В работе', variant: 'default' },
  resolved: { label: 'Решён', variant: 'secondary' },
  closed: { label: 'Закрыт', variant: 'outline' },
};

const prioConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Низкий', color: 'bg-muted' },
  medium: { label: 'Средний', color: 'bg-info' },
  high: { label: 'Высокий', color: 'bg-warning' },
  urgent: { label: 'Срочный', color: 'bg-destructive' },
};

function getSlaHours(createdAt: string) {
  return Math.round((Date.now() - new Date(createdAt).getTime()) / 3600000);
}

const templates = [
  { label: 'Билет отправлен', text: 'Здравствуйте! Билет был повторно отправлен на ваш email. Проверьте, пожалуйста, папку «Спам».' },
  { label: 'Перенос даты', text: 'Здравствуйте! Мы перенесли ваш заказ на выбранную дату. Новый билет отправлен на email.' },
  { label: 'Возврат оформлен', text: 'Здравствуйте! Возврат средств оформлен. Деньги поступят на карту в течение 3-5 рабочих дней.' },
];

function TicketCard({ ticket, onBack }: { ticket: typeof mockSupportTickets[0]; onBack: () => void }) {
  const [reply, setReply] = useState('');
  const slaHours = getSlaHours(ticket.createdAt);

  const history = [
    { action: 'Создан тикет', user: 'Система', time: ticket.createdAt },
    ...(ticket.assignedTo ? [{ action: `Назначен на ${ticket.assignedTo}`, user: 'Система', time: ticket.updatedAt }] : []),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Назад</Button>
        <h1 className="text-xl font-bold flex-1">{ticket.subject}</h1>
        <div className="flex items-center gap-2">
          <Badge variant={statusConfig[ticket.status].variant}>{statusConfig[ticket.status].label}</Badge>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-white ${prioConfig[ticket.priority].color}`}>
            {prioConfig[ticket.priority].label}
          </div>
        </div>
      </div>

      {/* SLA */}
      <Card className={slaHours > 24 ? 'border-destructive/50' : ''}>
        <CardContent className="p-3 flex items-center gap-3">
          <Clock className={`h-4 w-4 ${slaHours > 24 ? 'text-destructive' : 'text-muted-foreground'}`} />
          <span className="text-sm">
            Открыт <strong>{slaHours}ч</strong> назад
            {slaHours > 24 && <span className="text-destructive ml-1">· Превышен SLA!</span>}
          </span>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Conversation mock */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{ticket.customerEmail}</span>
                    <span className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleString('ru-RU')}</span>
                  </div>
                  <p className="text-sm mt-1">Здравствуйте, {ticket.subject.toLowerCase()}. Помогите пожалуйста!</p>
                </div>
              </div>

              <Separator />

              {/* Reply */}
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {templates.map(t => (
                    <Button key={t.label} variant="outline" size="sm" className="text-xs" onClick={() => setReply(t.text)}>
                      {t.label}
                    </Button>
                  ))}
                </div>
                <Textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Написать ответ..." rows={4} />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <LinkIcon className="h-3 w-3" /> Вставить ссылку на заказ
                    </Button>
                  </div>
                  <Button className="gap-1"><Send className="h-4 w-4" /> Отправить</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Links */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Связи</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {ticket.orderId && (
                <Link to={`/admin/orders/${ticket.orderId}`}>
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 text-sm">
                    <ExternalLink className="h-3 w-3" />
                    <span>Заказ {ticket.orderId}</span>
                  </div>
                </Link>
              )}
              {ticket.eventId && (
                <Link to={`/admin/events/${ticket.eventId}`}>
                  <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 text-sm">
                    <ExternalLink className="h-3 w-3" />
                    <span>Событие</span>
                  </div>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">История</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    <span>{h.action}</span>
                    <span className="ml-auto">{new Date(h.time).toLocaleDateString('ru-RU')}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SupportListPage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockSupportTickets.filter(t => statusFilter === 'all' || t.status === statusFilter);
  const ticket = mockSupportTickets.find(t => t.id === selectedTicket);

  if (ticket) return <TicketCard ticket={ticket} onBack={() => setSelectedTicket(null)} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Поддержка</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="open">Открытые</SelectItem>
            <SelectItem value="in_progress">В работе</SelectItem>
            <SelectItem value="resolved">Решённые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead className="w-8"></TableHead><TableHead>Тема</TableHead><TableHead>Статус</TableHead>
            <TableHead>Клиент</TableHead><TableHead className="text-center"><MessageSquare className="h-3.5 w-3.5 inline" /></TableHead>
            <TableHead>SLA</TableHead><TableHead>Назначен</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map(t => {
              const sla = getSlaHours(t.createdAt);
              return (
                <TableRow key={t.id} className="cursor-pointer" onClick={() => setSelectedTicket(t.id)}>
                  <TableCell>
                    <span className={`w-2.5 h-2.5 rounded-full inline-block ${prioConfig[t.priority].color}`} />
                  </TableCell>
                  <TableCell className="font-medium">{t.subject}</TableCell>
                  <TableCell><Badge variant={statusConfig[t.status].variant}>{statusConfig[t.status].label}</Badge></TableCell>
                  <TableCell className="text-sm">{t.customerEmail}</TableCell>
                  <TableCell className="text-center text-sm">{t.messagesCount}</TableCell>
                  <TableCell>
                    <span className={`text-sm ${sla > 24 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      {sla}ч
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.assignedTo || '—'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
