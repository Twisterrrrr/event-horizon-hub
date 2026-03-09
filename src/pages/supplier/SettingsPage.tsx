import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockSupplierProfile } from "@/data/supplier-mock";
import { Save, User, Plug, CheckCircle, XCircle, Shield } from "lucide-react";

export default function SupplierSettingsPage() {
  const profile = mockSupplierProfile;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Настройки</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1"><User className="h-3.5 w-3.5" /> Профиль</TabsTrigger>
          <TabsTrigger value="integration" className="gap-1"><Plug className="h-3.5 w-3.5" /> Интеграция</TabsTrigger>
          <TabsTrigger value="security" className="gap-1"><Shield className="h-3.5 w-3.5" /> Безопасность</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Данные компании</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Название компании</label>
                <Input defaultValue={profile.name} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Имя оператора</label>
                  <Input defaultValue={profile.operatorName} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input defaultValue={profile.email} type="email" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Телефон</label>
                <Input defaultValue={profile.phone} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Города</label>
                <div className="flex gap-1">{profile.cities.map(c => <Badge key={c} variant="outline">{c}</Badge>)}</div>
                <p className="text-xs text-muted-foreground mt-1">Для добавления новых городов обратитесь в поддержку</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Комиссия и уровень</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Текущая комиссия</p>
                  <p className="text-3xl font-bold text-primary">{profile.commission}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Устанавливается администратором</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Уровень доверия</p>
                  <Badge className="mt-1 bg-success text-success-foreground">Проверен</Badge>
                  <p className="text-xs text-muted-foreground mt-2">Влияет на лимиты и приоритет модерации</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="gap-1"><Save className="h-4 w-4" /> Сохранить</Button>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Тип интеграции</CardTitle>
              <CardDescription>Как ваши события синхронизируются с DAIBILET</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <Badge variant="outline" className="text-sm">{profile.integration.toUpperCase()}</Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {profile.integration === 'tc' && 'Tickets Cloud'}
                    {profile.integration === 'teplohod' && 'Teplohod API'}
                    {profile.integration === 'manual' && 'Ручное управление'}
                  </p>
                  <p className="text-xs text-muted-foreground">Автоматическая синхронизация расписания и наличия</p>
                </div>
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>

          {profile.integration !== 'manual' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">API настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Webhook URL</label>
                  <Input defaultValue={profile.webhookUrl} className="font-mono text-xs" readOnly />
                  <p className="text-xs text-muted-foreground mt-1">Для изменения обратитесь в поддержку</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">API Key</label>
                  <Input defaultValue="••••••••••••" type="password" readOnly />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Смена пароля</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Текущий пароль</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Новый пароль</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Подтвердите пароль</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="gap-1"><Save className="h-4 w-4" /> Сменить пароль</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
