import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { networkService, schoolService, studentService, financialService, supabase } from '@/services/api';
import { 
  Network, 
  School, 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp,
  Plus,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState({
    totalNetworks: 0,
    totalSchools: 0,
    totalStudents: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
      } else {
        navigate('/login');
      }
    };
    
    loadUser();
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Tentar buscar dados, mas não quebrar se falhar
        let networks = [];
        let schools = [];
        let students = [];
        let financialStats = { totalRevenue: 0 };

        try {
          networks = await networkService.getAll();
        } catch (e) {
          console.log('Networks ainda não disponíveis');
        }

        try {
          const { data: schoolsData } = await supabase
            .from('schools')
            .select('*');
          schools = schoolsData || [];
        } catch (e) {
          console.log('Schools ainda não disponíveis');
        }

        try {
          students = await studentService.getAll();
        } catch (e) {
          console.log('Students ainda não disponíveis');
        }

        try {
          financialStats = await financialService.getFinancialStats();
        } catch (e) {
          console.log('Financial stats ainda não disponíveis');
        }

        setStats({
          totalNetworks: networks.length,
          totalSchools: schools.length,
          totalStudents: students.length,
          totalRevenue: financialStats.totalRevenue || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    { icon: TrendingUp, label: 'Dashboard', path: '/superadmin/dashboard', active: true },
    { icon: Network, label: 'Redes', path: '/superadmin/networks' },
    { icon: School, label: 'Escolas', path: '/superadmin/schools' },
    { icon: Users, label: 'Usuários', path: '/superadmin/users' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">ALETHEIA</h1>
              <p className="text-sm text-gray-600">Super Admin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userEmail}</p>
              <p className="text-xs text-gray-600">Super Administrador</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Super Admin</h1>
            <p className="text-muted-foreground">
              Visão geral de toda a plataforma ALETHEIA
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/superadmin/networks')} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Nova Rede
            </Button>
            <Button onClick={() => navigate('/superadmin/schools')}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Escola
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Redes de Ensino</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNetworks}</div>
              <p className="text-xs text-muted-foreground">Redes cadastradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escolas Ativas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSchools}</div>
              <p className="text-xs text-muted-foreground">Total de escolas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alunos Totais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Em toda a plataforma</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">Receitas consolidadas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/superadmin/networks')}
            >
              <Network className="h-6 w-6" />
              <span>Gerenciar Redes</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/superadmin/schools')}
            >
              <School className="h-6 w-6" />
              <span>Gerenciar Escolas</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => navigate('/superadmin/users')}
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
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
