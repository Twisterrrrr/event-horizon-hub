import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockSeoIssues } from "@/data/mock";
import { AlertTriangle, Eye, EyeOff, UserPen, Search } from "lucide-react";

const typeLabels: Record<string, string> = {
  no_title: 'Нет title', duplicate_description: 'Дубль описания',
  short_text: 'Короткий текст', no_meta: 'Нет мета', missing_image: 'Нет изображения',
};

const sevConfig: Record<string, { label: string; color: string; badge: 'destructive' | 'secondary' | 'outline' }> = {
  critical: { label: 'Критично', color: 'text-destructive', badge: 'destructive' },
  warning: { label: 'Внимание', color: 'text-warning', badge: 'secondary' },
  info: { label: 'Инфо', color: 'text-info', badge: 'outline' },
};

function SnippetPreview({ title, slug, desc }: { title: string; slug: string; desc?: string }) {
  return (
    <div className="p-3 rounded-lg border bg-background space-y-1">
      <p className="text-primary text-sm font-medium hover:underline cursor-pointer truncate">{title || '(Нет title)'}</p>
      <p className="text-xs text-success font-mono">daibilet.ru/{slug}</p>
      <p className="text-xs text-muted-foreground line-clamp-2">{desc || '(Нет описания)'}</p>
    </div>
  );
}

export default function SeoAuditPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [groupBy, setGroupBy] = useState<'type' | 'entity'>('type');

  const toggle = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const grouped = groupBy === 'type'
    ? Object.entries(typeLabels).map(([key, label]) => ({
        label,
        items: mockSeoIssues.filter(i => i.issueType === key),
      })).filter(g => g.items.length > 0)
    : Object.entries(
        mockSeoIssues.reduce((acc, i) => {
          const key = i.entityType;
          (acc[key] = acc[key] || []).push(i);
          return acc;
        }, {} as Record<string, typeof mockSeoIssues>)
      ).map(([key, items]) => ({ label: key, items }));

  const sevCounts = {
    critical: mockSeoIssues.filter(i => i.severity === 'critical').length,
    warning: mockSeoIssues.filter(i => i.severity === 'warning').length,
    info: mockSeoIssues.filter(i => i.severity === 'info').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">SEO-аудит</h1>
        <div className="flex items-center gap-2">
          <Badge variant="destructive">{sevCounts.critical} крит.</Badge>
          <Badge variant="secondary">{sevCounts.warning} внимание</Badge>
          <Badge variant="outline">{sevCounts.info} инфо</Badge>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <Card className="border-primary/30">
          <CardContent className="p-3 flex items-center gap-3">
            <span className="text-sm font-medium">Выбрано: {selected.size}</span>
            <Button variant="outline" size="sm" className="gap-1"><EyeOff className="h-3 w-3" /> Игнорировать</Button>
            <Button variant="outline" size="sm" className="gap-1"><UserPen className="h-3 w-3" /> Для копирайтера</Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Снять выделение</Button>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button variant={groupBy === 'type' ? 'default' : 'outline'} size="sm" onClick={() => setGroupBy('type')}>По типу проблемы</Button>
        <Button variant={groupBy === 'entity' ? 'default' : 'outline'} size="sm" onClick={() => setGroupBy('entity')}>По сущности</Button>
      </div>

      {grouped.map(group => (
        <Card key={group.label}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {group.label}
              <Badge variant="secondary">{group.items.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {group.items.map(s => {
                const cfg = sevConfig[s.severity];
                return (
                  <div key={s.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <Checkbox
                      checked={selected.has(s.id)}
                      onCheckedChange={() => toggle(s.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{s.entityTitle}</span>
                        <Badge variant="outline" className="text-[10px]">{s.entityType}</Badge>
                        <Badge variant={cfg.badge} className="text-[10px]">{cfg.label}</Badge>
                      </div>
                      <SnippetPreview
                        title={s.issueType === 'no_title' ? '' : s.entityTitle}
                        slug={s.entityType + '/' + s.entityId}
                        desc={s.issueType === 'short_text' ? 'Слишком короткий текст...' : undefined}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
