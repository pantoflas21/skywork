import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  Settings, 
  LogOut,
  BarChart3,
  UserCheck,
  BookOpen,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardService, financialService } from '@/services/api';

interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalUsers: number;
  totalRevenue: number;
  totalExpenses: number;
  pendingAmount: number;
  overdueAmount: number;
}

interface FinancialTransaction {
  id: string;
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    pendingAmount: 0,
    overdueAmount: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [adminStats, transactions] = await Promise.all([
        dashboardService.getAdminStats(),
        financialService.getTransactions()
      ]);

      setStats(adminStats);
      setRecentTransactions(transactions.slice(0, 5)); // Últimas 5 transações
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTransactionIcon = (type: string, status: string) => {
    if (type === 'receita') {
      return status === 'pago' ? 
        <TrendingUp className="h-4 w-4 text-green-500" /> : 
        <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pago: 'bg-green-100 text-green-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      atrasado: 'bg-red-100 text-red-800',
      cancelado: 'bg-gray-100 text-gray-800'
    };

    const statusLabels = {
      pago: 'Pago',
      pendente: 'Pendente',
      atrasado: 'Atrasado',
      cancelado: 'Cancelado'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">ALETHEIA</h1>
              <p className="text-sm text-gray-600">Painel Administrativo</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-600">Administrador</p>
            </div>
            <button
              onClick={loadDashboardData}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              title="Atualizar dados"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-primary text-white rounded-lg">
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Users className="h-5 w-5" />
              <span>Usuários</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <DollarSign className="h-5 w-5" />
              <span>Financeiro</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h2>
            <p className="text-gray-600">Visão geral do sistema ALETHEIA</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Alunos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalStudents}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Professores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalTeachers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Turmas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalClasses}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receita Mensal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Receitas</h3>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {loading ? '...' : formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total arrecadado</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Despesas</h3>
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                {loading ? '...' : formatCurrency(stats.totalExpenses)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total de gastos</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Inadimplência</h3>
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {loading ? '...' : formatCurrency(stats.overdueAmount)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Valores em atraso</p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-600 mt-2">Carregando transações...</p>
                </div>
              ) : recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type, transaction.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-xs text-gray-600">
                          {transaction.category} • {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Nenhuma transação encontrada</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;