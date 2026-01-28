import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase, studentService, financialService } from '@/services/api';
import { 
  Network, 
  School, 
  Users, 
  DollarSign, 
  TrendingUp,
  Plus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NetworkAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalRevenue: 0,
    networkName: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: network } = await supabase
          .from('networks')
          .select('id, name')
          .eq('admin_user_id', user?.id)
          .single();

        if (network) {
          const { data: schools } = await supabase
            .from('schools')
            .select('id')
            .eq('network_id', network.id);

          const schoolIds = schools?.map(s => s.id) || [];
          
          let totalStudents = 0;
          if (schoolIds.length > 0) {
            const { data: students } = await supabase
              .from('students')
              .select('id, user:users!inner(school_id)')
              .in('user.school_id', schoolIds)
              .eq('status', 'ativo');
            
            totalStudents = students?.length || 0;
          }

          const financialStats = await financialService.getFinancialStats();

          setStats({
            totalSchools: schools?.length || 0,
            totalStudents,
            totalRevenue: financialStats.totalRevenue,
            networkName: network.name
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  const menuItems = [
    { icon: TrendingUp, label: 'Dashboard', path: '/networkadmin/dashboard', active: true },
    { icon: School, label: 'Minhas Escolas', path: '/networkadmin/schools' },
    { icon: Users, label: 'Usuários', path: '/networkadmin/users' },
  ];

  return (
    <DashboardLayout user={user} menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard - {stats.networkName}</h1>
            <p className="text-muted-foreground">
              Visão geral da sua rede de ensino
            </p>
          </div>
          <Button onClick={() => navigate('/networkadmin/schools')}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Escola
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escolas da Rede</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSchools}</div>
              <p className="text-xs text-muted-foreground">Escolas ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Em todas as escolas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita da Rede</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">Receita consolidada</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/networkadmin/schools')}
            >
              <School className="h-6 w-6" />
              <span>Gerenciar Escolas</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/networkadmin/users')}
            >
              <Users className="h-6 w-6" />
              <span>Gerenciar Usuários</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2"
            >
              <TrendingUp className="h-6 w-6" />
              <span>Relatórios</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NetworkAdminDashboard;
