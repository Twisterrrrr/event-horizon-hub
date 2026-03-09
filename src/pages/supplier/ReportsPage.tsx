import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockSupplierSales, mockSupplierProfile } from "@/data/supplier-mock";
import { Download, CheckCircle, XCircle, Clock, TrendingUp, ArrowDown } from "lucide-react";

type Range = 'week' | 'month' | 'all';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

export default function SupplierReportsPage() {
  const [range, setRange] = useState<Range>('week');

  const sales = mockSupplierSales;
  const totalGross = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.grossAmount, 0);
  const totalCommission = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.commission, 0);
  const totalNet = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.netAmount, 0);
  const totalRefunded = sales.filter(s => s.status === 'refunded').reduce((sum, s) => sum + s.grossAmount, 0);
  const totalQuantity = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Отчёты</h1>
        <div className="flex gap-2">
          <Tabs value={range} onValueChange={v => setRange(v as Range)}>
            <TabsList>
              <TabsTrigger value="week">7 дней</TabsTrigger>
              <TabsTrigger value="month">30 дней</TabsTrigger>
              <TabsTrigger value="all">Всё время</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" className="gap-1"><Download className="h-4 w-4" /> Экспорт</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Продано</p>
            <p className="text-2xl font-bold">{totalQuantity} шт.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Гросс</p>
            <p className="text-2xl font-bold">{formatCurrency(totalGross)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Комиссия ({mockSupplierProfile.commission}%)</p>
            <p className="text-2xl font-bold text-muted-foreground">-{formatCurrency(totalCommission)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Ваш доход</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(totalNet)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Возвраты</p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(totalRefunded)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Детализация продаж</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Заказ</TableHead><TableHead>Событие</TableHead><TableHead>Дата</TableHead>
              <TableHead className="text-center">Кол-во</TableHead>
              <TableHead className="text-right">Гросс</TableHead><TableHead className="text-right">Комиссия</TableHead>
              <TableHead className="text-right">Нетто</TableHead><TableHead>Статус</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {sales.map(sale => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono text-xs">{sale.orderNumber}</TableCell>
                  <TableCell className="text-sm max-w-48 truncate">{sale.eventTitle}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{sale.date}</TableCell>
                  <TableCell className="text-center">{sale.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.grossAmount)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">-{formatCurrency(sale.commission)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(sale.netAmount)}</TableCell>
                  <TableCell>
                    {sale.status === 'completed' && <Badge variant="default" className="bg-success text-success-foreground gap-1"><CheckCircle className="h-3 w-3" />Завершён</Badge>}
                    {sale.status === 'refunded' && <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Возврат</Badge>}
                    {sale.status === 'pending' && <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Ожидает</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
