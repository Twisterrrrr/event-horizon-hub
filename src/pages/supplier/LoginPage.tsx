import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function SupplierLoginPage() {
  const [email, setEmail] = useState('alex@nevatrip.ru');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/supplier');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-2">
            <span className="text-primary-foreground font-bold text-lg">D</span>
          </div>
          <CardTitle className="text-xl">DAIBILET</CardTitle>
          <CardDescription>Кабинет поставщика</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.ru" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Пароль</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full">Войти</Button>
            <p className="text-xs text-center text-muted-foreground">
              Нет аккаунта?{' '}
              <button type="button" className="text-primary hover:underline" onClick={() => navigate('/supplier/register')}>
                Регистрация
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function SupplierRegisterPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/supplier');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-2">
            <span className="text-primary-foreground font-bold text-lg">D</span>
          </div>
          <CardTitle className="text-xl">Регистрация</CardTitle>
          <CardDescription>Кабинет поставщика</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Название компании</label>
              <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="НеваТрип" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Ваше имя</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Алексей Смирнов" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.ru" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Пароль</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full">Зарегистрироваться</Button>
            <p className="text-xs text-center text-muted-foreground">
              Уже есть аккаунт?{' '}
              <button type="button" className="text-primary hover:underline" onClick={() => navigate('/supplier/login')}>
                Войти
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
