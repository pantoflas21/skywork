import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Download, 
  LayoutDashboard, 
  Users, 
  Settings, 
  DollarSign,
  Calendar,
  ArrowUpRight
} from 'lucide-react';

const AdminFinancial: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD },
    { icon: Users, label: 'Usuários', path: ROUTES.ADMIN.USERS },
    { icon: DollarSign, label: 'Financeiro', path: '/admin/financeiro' },
    { icon: Settings, label: 'Configurações', path: ROUTES.ADMIN.SETTINGS },
  ];

  const stats = [
    { title: 'Receita Total (Mês)', value: 'R$ 145.200,00', icon: TrendingUp, color: 'text-green-600', trend: '+12%' },
    { title: 'Despesas Fixas', value: 'R$ 62.450,00', icon: TrendingDown, color: 'text-red-600', trend: '+2%' },
    { title: 'Inadimplência', value: '8.4%', icon: AlertCircle, color: 'text-yellow-600', trend: '-1.5%' },
    { title: 'Saldo Projetado', value: 'R$ 82.750,00', icon: DollarSign, color: 'text-primary', trend: '+5%' },
  ];

  const transactions = [
    { id: '1', student: 'Ana Clara Melo', class: '3º Ano A', value: 'R$ 1.250,00', status: 'pago', date: '10/05/2024' },
    { id: '2', student: 'Bruno Ferreira', class: '5º Ano B', value: 'R$ 1.100,00', status: 'atrasado', date: '05/05/2024' },
    { id: '3', student: 'Carla Dias', class: '1º Ano EM', value: 'R$ 1.650,00', status: 'pendente', date: '15/05/2024' },
    { id: '4', student: 'Daniel Lima', class: 'Infantil 4', value: 'R$ 980,00', status: 'pago', date: '08/05/2024' },
  ];

  return (
    <DashboardLayout user={user} menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard financeiro completo</h1>
            <p className="text-muted-foreground">
              Visão consolidada do fluxo de caixa, inadimplência e metas da escola.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Maio/2024
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Relatórios
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.trend}
                  </span>{' '}
                  em relação ao mês passado
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Fluxo de Faturamento</CardTitle>
              <CardDescription>Comparativo de receitas e despesas nos últimos 6 meses.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-end justify-around gap-2 px-6 pb-6">
              {/* Simple CSS-based bar chart mockup */}
              {[40, 65, 45, 80, 55, 90].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 items-end h-[220px]">
                    <div className="bg-primary/20 w-1/2 rounded-t-sm transition-all hover:bg-primary/40" style={{ height: `${h}%` }} />
                    <div className="bg-primary w-1/2 rounded-t-sm transition-all hover:bg-primary/80" style={{ height: `${h * 0.7}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">Mês {i + 1}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Inadimplência por Nível</CardTitle>
              <CardDescription>Distribuição de débitos atuais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Infantil', 'Fundamental 1', 'Fundamental 2', 'Ensino Médio'].map((nivel, i) => (
                <div key={nivel} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{nivel}</span>
                    <span className="font-medium">{10 - i}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(10 - i) * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pagamentos Recentes & Pendências</CardTitle>
            <CardDescription>Acompanhamento de mensalidades do mês vigente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.student}</TableCell>
                    <TableCell>{t.class}</TableCell>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.value}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={t.status === 'pago' ? 'default' : t.status === 'atrasado' ? 'destructive' : 'outline'}
                        className={t.status === 'pago' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-1">
                        Detalhes <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminFinancial;