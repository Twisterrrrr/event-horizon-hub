import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { CreditCard, Plug, Globe, AlertTriangle, Save, Shield } from "lucide-react";

function DangerAction({ title, description, action }: { title: string; description: string; action: string }) {
  const [confirm, setConfirm] = useState('');
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-destructive hover:text-destructive border-destructive/30" size="sm">
          {action}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" /> {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm">Введите <strong className="font-mono">ПОДТВЕРЖДАЮ</strong> для продолжения:</p>
          <Input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="ПОДТВЕРЖДАЮ" />
        </div>
        <DialogFooter>
          <Button variant="destructive" disabled={confirm !== 'ПОДТВЕРЖДАЮ'}>{action}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Настройки</h1>

      <Tabs defaultValue="payments">
        <TabsList>
          <TabsTrigger value="payments" className="gap-1"><CreditCard className="h-3.5 w-3.5" /> Платежи</TabsTrigger>
          <TabsTrigger value="integrations" className="gap-1"><Plug className="h-3.5 w-3.5" /> Интеграции</TabsTrigger>
          <TabsTrigger value="general" className="gap-1"><Globe className="h-3.5 w-3.5" /> Общие</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Провайдер оплаты</CardTitle>
              <CardDescription>Настройки подключения к платёжной системе</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">API Key</label>
                <Input defaultValue="••••••••••••••••" type="password" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Secret Key</label>
                <Input defaultValue="••••••••••••••••" type="password" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium">Тестовый режим</p>
                  <p className="text-xs text-muted-foreground">Платежи не будут реально списываться</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Смена ключей отключит приём платежей на 1-2 минуты</span>
                <DangerAction title="Сменить ключи API" description="Смена ключей приведёт к кратковременному отключению приёма платежей. Все незавершённые транзакции могут быть утеряны." action="Сменить ключи" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4 space-y-4">
          {[
            { name: 'TC (Tickets Cloud)', status: 'connected', url: 'https://api.tc.ru/webhook' },
            { name: 'Teplohod', status: 'connected', url: 'https://api.teplohod.ru/callback' },
            { name: 'Email (SMTP)', status: 'connected', url: 'smtp.yandex.ru:465' },
          ].map(int => (
            <Card key={int.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{int.name}</p>
                      <Badge variant="default" className="bg-success text-success-foreground text-[10px]">Подключено</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{int.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Настроить</Button>
                    <DangerAction
                      title={`Отключить ${int.name}`}
                      description={`Отключение ${int.name} остановит синхронизацию данных. Заказы через эту интеграцию перестанут обрабатываться.`}
                      action="Отключить"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Домены и URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Основной домен</label>
                <Input defaultValue="daibilet.ru" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Базовый URL API</label>
                <Input defaultValue="https://api.daibilet.ru" className="font-mono text-sm" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Контактные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Email поддержки</label>
                <Input defaultValue="support@daibilet.ru" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Телефон</label>
                <Input defaultValue="+7 (800) 555-00-00" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="gap-1"><Save className="h-4 w-4" /> Сохранить</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
