import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  Settings, 
  LogOut, 
  BarChart3,
  UserCheck,
  BookOpen,
  Calendar,
  FileText,
  ClipboardList,
  Brain,
  UserPlus,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Save,
  X,
  Check,
  Send
} from 'lucide-react';
import './index.css';

// Importar componentes criados
import Setup from '@/pages/Setup';
import SuperAdminDashboard from '@/pages/superadmin/Dashboard';
import SuperAdminNetworks from '@/pages/superadmin/Networks';
import SuperAdminSchools from '@/pages/superadmin/Schools';
import NetworkAdminDashboard from '@/pages/networkadmin/Dashboard';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import SecretaryStudents from '@/pages/secretaria/Alunos';
import AdminUsers from '@/pages/admin/Usuarios';

// ==================== COMPONENTES PRINCIPAIS ====================

// Login Component
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Usar autenticação real do Supabase
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError('Email ou senha incorretos');
        setLoading(false);
        return;
      }

      // Buscar role do usuário
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      // Redirecionar baseado no role
      const role = userData?.role || 'aluno';
      const routes: Record<string, string> = {
        'super_admin': '/superadmin/dashboard',
        'network_admin': '/networkadmin/dashboard',
        'admin': '/admin/dashboard',
        'secretaria': '/secretaria/dashboard',
        'professor': '/professor/dashboard',
        'aluno': '/aluno/dashboard'
      };

      navigate(routes[role] || '/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ALETHEIA</h1>
            <p className="text-gray-600 mt-2">Sistema de Gestão Escolar</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar no Sistema'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/setup" className="text-sm text-blue-600 hover:text-blue-700">
              Primeira vez? Crie sua conta de administrador
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-700">
              Esqueceu sua senha?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout Component
const DashboardLayout = ({ children, title, user, onLogout }: any) => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">ALETHEIA</h1>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user}</p>
            <p className="text-xs text-gray-600">{title}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
    {children}
  </div>
);

// Sidebar Component
const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/usuarios', icon: Users, label: 'Usuários' },
    { path: '/admin/financeiro', icon: DollarSign, label: 'Financeiro' },
    { path: '/admin/configuracoes', icon: Settings, label: 'Configurações' }
  ];

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

// ==================== PÁGINAS ADMINISTRATIVAS ====================

// Página de Usuários
const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    { id: 1, name: 'João Silva', email: 'joao@aletheia.edu', role: 'Professor', status: 'Ativo', created: '15/01/2024' },
    { id: 2, name: 'Maria Santos', email: 'maria@aletheia.edu', role: 'Secretaria', status: 'Ativo', created: '10/01/2024' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@aletheia.edu', role: 'Professor', status: 'Inativo', created: '05/01/2024' },
    { id: 4, name: 'Ana Oliveira', email: 'ana@aletheia.edu', role: 'Aluno', status: 'Ativo', created: '20/12/2023' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    alert(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
    setShowModal(false);
  };

  return (
    <DashboardLayout 
      title="Painel Administrativo" 
      user="Administrador" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h2>
                <p className="text-gray-600">Cadastre e gerencie todos os usuários do sistema</p>
              </div>
              <button
                onClick={handleAddUser}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Novo Usuário</span>
              </button>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>

          {/* Tabela de Usuários */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nome</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">E-mail</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Função</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Criado em</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{user.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'Professor' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'Secretaria' ? 'bg-green-100 text-green-800' :
                          user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.created}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal de Usuário */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmitUser}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      defaultValue={editingUser?.name || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      defaultValue={editingUser?.email || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="Professor">Professor</option>
                      <option value="Secretaria">Secretaria</option>
                      <option value="Admin">Administrador</option>
                      <option value="Aluno">Aluno</option>
                    </select>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
};

// Página Financeira
const FinancialPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([
    { id: 1, description: 'Mensalidade Janeiro 2024', amount: 1250.00, type: 'receita', status: 'Pago', date: '15/01/2024', student: 'João Silva' },
    { id: 2, description: 'Salário Professor Maria', amount: 4500.00, type: 'despesa', status: 'Pago', date: '10/01/2024', category: 'Folha de Pagamento' },
    { id: 3, description: 'Mensalidade Dezembro 2023', amount: 1250.00, type: 'receita', status: 'Atrasado', date: '05/12/2023', student: 'Ana Costa' },
    { id: 4, description: 'Material Escolar', amount: 850.00, type: 'despesa', status: 'Pago', date: '20/01/2024', category: 'Material' }
  ]);

  const totalReceitas = transactions.filter(t => t.type === 'receita' && t.status === 'Pago').reduce((sum, t) => sum + t.amount, 0);
  const totalDespesas = transactions.filter(t => t.type === 'despesa' && t.status === 'Pago').reduce((sum, t) => sum + t.amount, 0);
  const totalAtrasado = transactions.filter(t => t.type === 'receita' && t.status === 'Atrasado').reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout 
      title="Painel Administrativo" 
      user="Administrador" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestão Financeira</h2>
                <p className="text-gray-600">Controle de receitas, despesas e inadimplência</p>
              </div>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                <span>Nova Transação</span>
              </button>
            </div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Receitas</p>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Despesas</p>
                  <p className="text-2xl font-bold text-red-600">
                    R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Saldo</p>
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {(totalReceitas - totalDespesas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inadimplência</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    R$ {totalAtrasado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Tabela de Transações */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Transações Recentes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Descrição</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Valor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Data</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-xs text-gray-600">
                            {transaction.student || transaction.category}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.type === 'receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'receita' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{transaction.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

// Página de Configurações
const SettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    schoolName: 'Escola ALETHEIA',
    schoolAddress: 'Rua das Flores, 123 - Centro',
    schoolPhone: '(11) 99999-9999',
    schoolEmail: 'contato@aletheia.edu.br',
    academicYear: '2024',
    gradeSystem: 'numeric',
    passingGrade: '7.0',
    maxAbsences: '25',
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true
  });

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  return (
    <DashboardLayout 
      title="Painel Administrativo" 
      user="Administrador" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
                <p className="text-gray-600">Gerencie as configurações gerais da escola</p>
              </div>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações da Escola */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Escola</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Escola</label>
                  <input
                    type="text"
                    value={settings.schoolName}
                    onChange={(e) => setSettings({...settings, schoolName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <input
                    type="text"
                    value={settings.schoolAddress}
                    onChange={(e) => setSettings({...settings, schoolAddress: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={settings.schoolPhone}
                    onChange={(e) => setSettings({...settings, schoolPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={settings.schoolEmail}
                    onChange={(e) => setSettings({...settings, schoolEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Configurações Acadêmicas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Acadêmicas</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano Letivo</label>
                  <input
                    type="text"
                    value={settings.academicYear}
                    onChange={(e) => setSettings({...settings, academicYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sistema de Notas</label>
                  <select
                    value={settings.gradeSystem}
                    onChange={(e) => setSettings({...settings, gradeSystem: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="numeric">Numérico (0-10)</option>
                    <option value="concept">Conceitual (A, B, C, D)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nota Mínima para Aprovação</label>
                  <input
                    type="text"
                    value={settings.passingGrade}
                    onChange={(e) => setSettings({...settings, passingGrade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Faltas (%)</label>
                  <input
                    type="text"
                    value={settings.maxAbsences}
                    onChange={(e) => setSettings({...settings, maxAbsences: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notificações */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificações</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notificações por E-mail</p>
                    <p className="text-xs text-gray-600">Enviar alertas e lembretes por e-mail</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notificações por SMS</p>
                    <p className="text-xs text-gray-600">Enviar alertas urgentes por SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Backup Automático</p>
                    <p className="text-xs text-gray-600">Realizar backup diário dos dados</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Backup e Segurança */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup e Segurança</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  <Download className="h-4 w-4" />
                  <span>Fazer Backup Agora</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Upload className="h-4 w-4" />
                  <span>Restaurar Backup</span>
                </button>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Último backup: 26/01/2024 às 03:00</p>
                  <p className="text-xs text-gray-500">Próximo backup automático: 27/01/2024 às 03:00</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

// Admin Dashboard (atualizado)
const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    { label: 'Total de Alunos', value: '342', icon: UserCheck, color: 'text-blue-500' },
    { label: 'Professores', value: '28', icon: Users, color: 'text-green-500' },
    { label: 'Turmas Ativas', value: '12', icon: BookOpen, color: 'text-purple-500' },
    { label: 'Receita Mensal', value: 'R$ 145k', icon: DollarSign, color: 'text-yellow-500' }
  ];

  const transactions = [
    { desc: 'Mensalidade Janeiro 2024', amount: 'R$ 1.250,00', status: 'Pago', type: 'receita' },
    { desc: 'Salários Professores', amount: 'R$ 45.000,00', status: 'Pago', type: 'despesa' },
    { desc: 'Mensalidade Atrasada', amount: 'R$ 1.250,00', status: 'Atrasado', type: 'receita' }
  ];

  return (
    <DashboardLayout 
      title="Painel Administrativo" 
      user="Administrador" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h2>
            <p className="text-gray-600">Visão geral do sistema ALETHEIA</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transações Recentes</h3>
            <div className="space-y-4">
              {transactions.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {t.type === 'receita' ? 
                      <TrendingUp className="h-4 w-4 text-green-500" /> : 
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    }
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.desc}</p>
                      <p className="text-xs text-gray-600">Hoje</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${t.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.amount}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      t.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

// ==================== PAINEL DA SECRETARIA ====================

// Sidebar da Secretaria
const SecretarySidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/secretaria/dashboard', icon: Calendar, label: 'Dashboard' },
    { path: '/secretaria/alunos', icon: Users, label: 'Alunos' },
    { path: '/secretaria/turmas', icon: BookOpen, label: 'Turmas' },
    { path: '/secretaria/disciplinas', icon: FileText, label: 'Disciplinas' },
    { path: '/secretaria/planos', icon: ClipboardList, label: 'Planos de Aula' }
  ];

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

// Página de Alunos da Secretaria
const SecretaryStudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([
    { id: 1, name: 'Ana Clara Silva', registration: '2024001', class: '3º Ano A', level: 'Ensino Médio', guardian: 'Maria Silva', phone: '(11) 99999-1111', status: 'Ativo', enrollment: '15/02/2024' },
    { id: 2, name: 'Bruno Santos', registration: '2024002', class: '5º Ano B', level: 'Ensino Fundamental', guardian: 'João Santos', phone: '(11) 99999-2222', status: 'Ativo', enrollment: '20/02/2024' },
    { id: 3, name: 'Carla Oliveira', registration: '2024003', class: 'Maternal II', level: 'Educação Infantil', guardian: 'Ana Oliveira', phone: '(11) 99999-3333', status: 'Ativo', enrollment: '10/02/2024' },
    { id: 4, name: 'Diego Costa', registration: '2024004', class: '8º Ano C', level: 'Ensino Fundamental', guardian: 'Pedro Costa', phone: '(11) 99999-4444', status: 'Transferido', enrollment: '05/02/2024' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registration.includes(searchTerm) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = (studentId: number) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  const handleSubmitStudent = (e: React.FormEvent) => {
    e.preventDefault();
    alert(editingStudent ? 'Aluno atualizado com sucesso!' : 'Aluno matriculado com sucesso!');
    setShowModal(false);
  };

  return (
    <DashboardLayout 
      title="Painel da Secretaria" 
      user="Maria Santos - Secretária" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <SecretarySidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestão de Alunos</h2>
                <p className="text-gray-600">Cadastre e gerencie todos os estudantes da escola</p>
              </div>
              <button
                onClick={handleAddStudent}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Matricular Aluno</span>
              </button>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, matrícula ou turma..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Alunos</p>
                  <p className="text-2xl font-bold text-blue-600">{students.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Alunos Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{students.filter(s => s.status === 'Ativo').length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Matrículas Hoje</p>
                  <p className="text-2xl font-bold text-purple-600">3</p>
                </div>
                <UserPlus className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendências</p>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Tabela de Alunos */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Aluno</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Matrícula</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Turma</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Nível</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Responsável</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-600">Matrícula: {student.enrollment}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{student.registration}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{student.class}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.level === 'Educação Infantil' ? 'bg-pink-100 text-pink-800' :
                          student.level === 'Ensino Fundamental' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {student.level}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-gray-900">{student.guardian}</p>
                          <p className="text-xs text-gray-600">{student.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal de Matrícula */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingStudent ? 'Editar Aluno' : 'Matricular Novo Aluno'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmitStudent}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingStudent?.name || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Ensino</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="Educação Infantil">Educação Infantil</option>
                        <option value="Ensino Fundamental">Ensino Fundamental</option>
                        <option value="Ensino Médio">Ensino Médio</option>
                        <option value="Ensino Superior">Ensino Superior</option>
                        <option value="Cursinho">Cursinho</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecione uma turma</option>
                        <option value="Maternal II">Maternal II</option>
                        <option value="3º Ano A">3º Ano A</option>
                        <option value="5º Ano B">5º Ano B</option>
                        <option value="8º Ano C">8º Ano C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingStudent?.guardian || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone do Responsável</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        defaultValue={editingStudent?.phone || ''}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail do Responsável</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label className="text-sm text-gray-700">Aluno possui necessidades especiais</label>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {editingStudent ? 'Atualizar' : 'Matricular'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
};

// Página de Turmas da Secretaria
const SecretaryClassesPage = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([
    { id: 1, name: '3º Ano A', level: 'Ensino Médio', teacher: 'Prof. João Silva', students: 32, maxStudents: 35, shift: 'Matutino', year: 2024, active: true },
    { id: 2, name: '5º Ano B', level: 'Ensino Fundamental', teacher: 'Prof. Maria Santos', students: 28, maxStudents: 30, shift: 'Vespertino', year: 2024, active: true },
    { id: 3, name: 'Maternal II', level: 'Educação Infantil', teacher: 'Prof. Ana Costa', students: 15, maxStudents: 20, shift: 'Matutino', year: 2024, active: true },
    { id: 4, name: '8º Ano C', level: 'Ensino Fundamental', teacher: 'Prof. Pedro Lima', students: 25, maxStudents: 30, shift: 'Vespertino', year: 2024, active: false }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);

  const handleAddClass = () => {
    setEditingClass(null);
    setShowModal(true);
  };

  const handleEditClass = (classItem: any) => {
    setEditingClass(classItem);
    setShowModal(true);
  };

  const handleSubmitClass = (e: React.FormEvent) => {
    e.preventDefault();
    alert(editingClass ? 'Turma atualizada com sucesso!' : 'Turma criada com sucesso!');
    setShowModal(false);
  };

  return (
    <DashboardLayout 
      title="Painel da Secretaria" 
      user="Maria Santos - Secretária" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <SecretarySidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestão de Turmas</h2>
                <p className="text-gray-600">Organize e gerencie as turmas da escola</p>
              </div>
              <button
                onClick={handleAddClass}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Turma</span>
              </button>
            </div>
          </div>

          {/* Estatísticas das Turmas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Turmas</p>
                  <p className="text-2xl font-bold text-blue-600">{classes.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Turmas Ativas</p>
                  <p className="text-2xl font-bold text-green-600">{classes.filter(c => c.active).length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Alunos</p>
                  <p className="text-2xl font-bold text-purple-600">{classes.reduce((sum, c) => sum + c.students, 0)}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vagas Disponíveis</p>
                  <p className="text-2xl font-bold text-yellow-600">{classes.reduce((sum, c) => sum + (c.maxStudents - c.students), 0)}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Grid de Turmas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <div key={classItem.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    classItem.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {classItem.active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Nível:</span>
                    <span className="font-medium">{classItem.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Professor:</span>
                    <span className="font-medium">{classItem.teacher}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Turno:</span>
                    <span className="font-medium">{classItem.shift}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Alunos:</span>
                    <span className="font-medium">{classItem.students}/{classItem.maxStudents}</span>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Ocupação</span>
                    <span>{Math.round((classItem.students / classItem.maxStudents) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (classItem.students / classItem.maxStudents) > 0.9 ? 'bg-red-500' :
                        (classItem.students / classItem.maxStudents) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(classItem.students / classItem.maxStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClass(classItem)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                    <Eye className="h-4 w-4" />
                    <span>Ver Alunos</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de Turma */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingClass ? 'Editar Turma' : 'Nova Turma'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmitClass}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Turma</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      defaultValue={editingClass?.name || ''}
                      placeholder="Ex: 3º Ano A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Ensino</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="Educação Infantil">Educação Infantil</option>
                      <option value="Ensino Fundamental">Ensino Fundamental</option>
                      <option value="Ensino Médio">Ensino Médio</option>
                      <option value="Ensino Superior">Ensino Superior</option>
                      <option value="Cursinho">Cursinho</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Professor Responsável</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="">Selecione um professor</option>
                      <option value="Prof. João Silva">Prof. João Silva</option>
                      <option value="Prof. Maria Santos">Prof. Maria Santos</option>
                      <option value="Prof. Ana Costa">Prof. Ana Costa</option>
                      <option value="Prof. Pedro Lima">Prof. Pedro Lima</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="Matutino">Matutino</option>
                      <option value="Vespertino">Vespertino</option>
                      <option value="Noturno">Noturno</option>
                      <option value="Integral">Integral</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Alunos</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      defaultValue={editingClass?.maxStudents || 30}
                      min="1"
                      max="50"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {editingClass ? 'Atualizar' : 'Criar Turma'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
};

// Página de Disciplinas da Secretaria
const SecretarySubjectsPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Matemática', level: 'Ensino Fundamental', workload: 5, teachers: ['Prof. João Silva', 'Prof. Carlos Lima'], active: true },
    { id: 2, name: 'Português', level: 'Ensino Fundamental', workload: 5, teachers: ['Prof. Maria Santos'], active: true },
    { id: 3, name: 'História', level: 'Ensino Médio', workload: 3, teachers: ['Prof. Ana Costa'], active: true },
    { id: 4, name: 'Geografia', level: 'Ensino Médio', workload: 3, teachers: ['Prof. Pedro Lima'], active: true },
    { id: 5, name: 'Ciências', level: 'Ensino Fundamental', workload: 4, teachers: ['Prof. Roberto Silva'], active: true },
    { id: 6, name: 'Educação Física', level: 'Educação Infantil', workload: 2, teachers: ['Prof. Lucia Santos'], active: false }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [filterLevel, setFilterLevel] = useState('Todos');

  const filteredSubjects = subjects.filter(subject => 
    filterLevel === 'Todos' || subject.level === filterLevel
  );

  const handleAddSubject = () => {
    setEditingSubject(null);
    setShowModal(true);
  };

  const handleEditSubject = (subject: any) => {
    setEditingSubject(subject);
    setShowModal(true);
  };

  const handleDeleteSubject = (subjectId: number) => {
    if (confirm('Tem certeza que deseja excluir esta disciplina?')) {
      setSubjects(subjects.filter(s => s.id !== subjectId));
    }
  };

  const toggleSubjectStatus = (subjectId: number) => {
    setSubjects(subjects.map(subject => 
      subject.id === subjectId ? { ...subject, active: !subject.active } : subject
    ));
  };

  const handleSubmitSubject = (e: React.FormEvent) => {
    e.preventDefault();
    alert(editingSubject ? 'Disciplina atualizada com sucesso!' : 'Disciplina criada com sucesso!');
    setShowModal(false);
  };

  return (
    <DashboardLayout 
      title="Painel da Secretaria" 
      user="Maria Santos - Secretária" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <SecretarySidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestão de Disciplinas</h2>
                <p className="text-gray-600">Configure as disciplinas oferecidas pela escola</p>
              </div>
              <button
                onClick={handleAddSubject}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Disciplina</span>
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Nível</label>
                <select 
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Todos">Todos os Níveis</option>
                  <option value="Educação Infantil">Educação Infantil</option>
                  <option value="Ensino Fundamental">Ensino Fundamental</option>
                  <option value="Ensino Médio">Ensino Médio</option>
                  <option value="Ensino Superior">Ensino Superior</option>
                  <option value="Cursinho">Cursinho</option>
                </select>
              </div>
              <div className="flex-1"></div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Disciplinas</p>
                  <p className="text-2xl font-bold text-blue-600">{subjects.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Disciplinas Ativas</p>
                  <p className="text-2xl font-bold text-green-600">{subjects.filter(s => s.active).length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Carga Horária Total</p>
                  <p className="text-2xl font-bold text-purple-600">{subjects.reduce((sum, s) => sum + s.workload, 0)}h</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Professores Alocados</p>
                  <p className="text-2xl font-bold text-yellow-600">{new Set(subjects.flatMap(s => s.teachers)).size}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Grid de Disciplinas por Nível */}
          <div className="space-y-6">
            {['Educação Infantil', 'Ensino Fundamental', 'Ensino Médio', 'Ensino Superior', 'Cursinho'].map(level => {
              const levelSubjects = filteredSubjects.filter(s => s.level === level);
              if (levelSubjects.length === 0 && filterLevel !== 'Todos' && filterLevel !== level) return null;
              
              return (
                <div key={level} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{level}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {levelSubjects.length} disciplinas
                    </span>
                  </div>
                  
                  {levelSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {levelSubjects.map((subject) => (
                        <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              subject.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {subject.active ? 'Ativa' : 'Inativa'}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center justify-between">
                              <span>Carga Horária:</span>
                              <span className="font-medium">{subject.workload}h/semana</span>
                            </div>
                            <div>
                              <span>Professores:</span>
                              <div className="mt-1">
                                {subject.teachers.map((teacher, idx) => (
                                  <span key={idx} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                                    {teacher}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditSubject(subject)}
                              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => toggleSubjectStatus(subject.id)}
                              className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg ${
                                subject.active 
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                              }`}
                            >
                              <span>{subject.active ? 'Desativar' : 'Ativar'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhuma disciplina cadastrada para {level}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal de Disciplina */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingSubject ? 'Editar Disciplina' : 'Nova Disciplina'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmitSubject}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Disciplina</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      defaultValue={editingSubject?.name || ''}
                      placeholder="Ex: Matemática"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Ensino</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="Educação Infantil">Educação Infantil</option>
                      <option value="Ensino Fundamental">Ensino Fundamental</option>
                      <option value="Ensino Médio">Ensino Médio</option>
                      <option value="Ensino Superior">Ensino Superior</option>
                      <option value="Cursinho">Cursinho</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carga Horária Semanal</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      defaultValue={editingSubject?.workload || 4}
                      min="1"
                      max="10"
                      placeholder="Horas por semana"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Professores</label>
                    <select multiple className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24">
                      <option value="Prof. João Silva">Prof. João Silva</option>
                      <option value="Prof. Maria Santos">Prof. Maria Santos</option>
                      <option value="Prof. Ana Costa">Prof. Ana Costa</option>
                      <option value="Prof. Pedro Lima">Prof. Pedro Lima</option>
                      <option value="Prof. Carlos Lima">Prof. Carlos Lima</option>
                      <option value="Prof. Roberto Silva">Prof. Roberto Silva</option>
                      <option value="Prof. Lucia Santos">Prof. Lucia Santos</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Segure Ctrl para selecionar múltiplos professores</p>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {editingSubject ? 'Atualizar' : 'Criar Disciplina'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
};

// Página de Planos de Aula da Secretaria
const SecretaryLessonPlansPage = () => {
  const navigate = useNavigate();
  const [lessonPlans, setLessonPlans] = useState([
    { id: 1, teacher: 'Prof. João Silva', subject: 'Matemática', class: '7º Ano A', level: 'Ensino Fundamental', topic: 'Equações de 2º Grau', date: '26/01/2024', status: 'Enviado', quarter: '1º Bimestre', time: '14:30' },
    { id: 2, teacher: 'Prof. Maria Santos', subject: 'Português', class: '5º Ano B', level: 'Ensino Fundamental', topic: 'Análise Sintática', date: '25/01/2024', status: 'Não Enviado', quarter: '1º Bimestre', time: '10:15' },
    { id: 3, teacher: 'Prof. Ana Costa', subject: 'História', class: '3º Ano A', level: 'Ensino Médio', topic: 'Revolução Industrial', date: '24/01/2024', status: 'Enviado', quarter: '1º Bimestre', time: '08:00' },
    { id: 4, teacher: 'Prof. Pedro Lima', subject: 'Geografia', class: '6º Ano A', level: 'Ensino Fundamental', topic: 'Relevo Brasileiro', date: '23/01/2024', status: 'Enviado', quarter: '1º Bimestre', time: '15:45' },
    { id: 5, teacher: 'Prof. Lucia Santos', subject: 'Educação Física', class: 'Maternal II', level: 'Educação Infantil', topic: 'Coordenação Motora', date: '26/01/2024', status: 'Enviado', quarter: '1º Bimestre', time: '09:30' },
    { id: 6, teacher: 'Prof. Carlos Lima', subject: 'Física', class: '2º Ano B', level: 'Ensino Médio', topic: 'Mecânica', date: '25/01/2024', status: 'Não Enviado', quarter: '1º Bimestre', time: '16:20' }
  ]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewPlan = (plan: any) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const [filterLevel, setFilterLevel] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const filteredPlans = lessonPlans.filter(plan => {
    const levelMatch = filterLevel === 'Todos' || plan.level === filterLevel;
    const statusMatch = filterStatus === 'Todos' || plan.status === filterStatus;
    return levelMatch && statusMatch;
  });

  const groupedPlans = filteredPlans.reduce((groups: any, plan) => {
    const level = plan.level;
    if (!groups[level]) {
      groups[level] = [];
    }
    groups[level].push(plan);
    return groups;
  }, {});

  return (
    <DashboardLayout 
      title="Painel da Secretaria" 
      user="Maria Santos - Secretária" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <SecretarySidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Controle de Planos de Aula</h2>
            <p className="text-gray-600">Acompanhe o envio dos planos de aula pelos professores</p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Nível</label>
                <select 
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Todos">Todos os Níveis</option>
                  <option value="Educação Infantil">Educação Infantil</option>
                  <option value="Ensino Fundamental">Ensino Fundamental</option>
                  <option value="Ensino Médio">Ensino Médio</option>
                  <option value="Ensino Superior">Ensino Superior</option>
                  <option value="Cursinho">Cursinho</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Status</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Todos">Todos os Status</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Não Enviado">Não Enviado</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="h-4 w-4" />
                  <span>Exportar Relatório</span>
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas dos Planos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Planos</p>
                  <p className="text-2xl font-bold text-blue-600">{lessonPlans.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Enviados</p>
                  <p className="text-2xl font-bold text-green-600">{lessonPlans.filter(p => p.status === 'Enviado').length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Não Enviados</p>
                  <p className="text-2xl font-bold text-red-600">{lessonPlans.filter(p => p.status === 'Não Enviado').length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hoje</p>
                  <p className="text-2xl font-bold text-purple-600">{lessonPlans.filter(p => p.date === '26/01/2024').length}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Planos de Aula Organizados por Nível */}
          <div className="space-y-6">
            {Object.entries(groupedPlans).map(([level, plans]: [string, any[]]) => (
              <div key={level} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{level}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {plans.length} planos
                  </span>
                </div>
                
                {plans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className={`w-3 h-3 rounded-full ${
                              plan.status === 'Enviado' ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              plan.status === 'Enviado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {plan.status}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{plan.date}</span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div>
                            <p className="font-semibold text-gray-900">{plan.subject}</p>
                            <p className="text-sm text-gray-600">{plan.class}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">{plan.topic}</p>
                            <p className="text-xs text-gray-500">{plan.teacher} • {plan.time}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {plan.quarter}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewPlan(plan)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Ver Detalhes</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhum plano de aula para {level}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredPlans.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum plano encontrado</h3>
              <p className="text-gray-600">Ajuste os filtros para ver mais resultados</p>
            </div>
          )}
        </main>

          {/* Modal de Visualização do Plano */}
          {showModal && selectedPlan && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Detalhes do Plano de Aula</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Professor</label>
                      <p className="text-sm text-gray-900">{selectedPlan.teacher}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Disciplina</label>
                      <p className="text-sm text-gray-900">{selectedPlan.subject}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Turma</label>
                      <p className="text-sm text-gray-900">{selectedPlan.class}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data da Aula</label>
                      <p className="text-sm text-gray-900">{selectedPlan.date}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tópico da Aula</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedPlan.topic}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos de Aprendizagem</label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Compreender os conceitos fundamentais do tópico</li>
                        <li>Aplicar conhecimentos em exercícios práticos</li>
                        <li>Desenvolver pensamento crítico sobre o assunto</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo Programático</label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      <p>Introdução ao tema, desenvolvimento teórico, exemplos práticos e exercícios de fixação.</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metodologia</label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      <p>Aula expositiva dialogada, resolução de exercícios em grupo e atividades práticas.</p>
                    </div>
                  </div>
                  
                  {selectedPlan.status === 'Pendente' && (
                    <div className="flex space-x-3 pt-4 border-t">
                      <button
                        onClick={() => {
                          handleRejectPlan(selectedPlan.id);
                          setShowModal(false);
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Solicitar Revisão
                      </button>
                      <button
                        onClick={() => {
                          handleApprovePlan(selectedPlan.id);
                          setShowModal(false);
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Aprovar Plano
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
      </div>
    </DashboardLayout>
  );
};

// Secretary Dashboard (atualizado)
const SecretaryDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout 
      title="Painel da Secretaria" 
      user="Maria Santos - Secretária" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <SecretarySidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Painel da Secretaria</h2>
            <p className="text-gray-600">Gestão de alunos, turmas e atividades pedagógicas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/secretaria/alunos" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Matricular Aluno</h3>
                  <p className="text-sm text-gray-600">Cadastrar novo estudante</p>
                </div>
              </div>
            </Link>
            <Link to="/secretaria/turmas" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Criar Turma</h3>
                  <p className="text-sm text-gray-600">Nova classe escolar</p>
                </div>
              </div>
            </Link>
            <Link to="/secretaria/planos" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fiscalizar Planos</h3>
                  <p className="text-sm text-gray-600">Revisar aulas dos professores</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Matrículas Recentes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Nome</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Turma</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Data</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-sm text-gray-900">Ana Clara Silva</td>
                    <td className="py-3 text-sm text-gray-600">3º Ano A</td>
                    <td className="py-3 text-sm text-gray-600">20/05/2024</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Ativo</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-sm text-gray-900">Bruno Santos</td>
                    <td className="py-3 text-sm text-gray-600">5º Ano B</td>
                    <td className="py-3 text-sm text-gray-600">19/05/2024</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Ativo</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

// Teacher Dashboard
// Sidebar do Professor
const TeacherSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/professor/dashboard', icon: Calendar, label: 'Dashboard' },
    { path: '/professor/turmas', icon: Users, label: 'Turmas' },
    { path: '/professor/aulas', icon: BookOpen, label: 'Aulas' },
    { path: '/professor/chamada', icon: ClipboardList, label: 'Chamada' },
    { path: '/professor/notas', icon: BarChart3, label: 'Notas' },
    { path: '/professor/assistente', icon: Brain, label: 'Assistente IA' },
    { path: '/professor/provas', icon: FileText, label: 'Provas' }
  ];

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

// Teacher Dashboard (funcional)
const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  
  return (
    <DashboardLayout 
      title="Painel do Professor" 
      user="Professor João Silva - Matemática" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bem-vindo, Professor João!</h2>
            <p className="text-gray-600">Gerencie suas turmas, aulas e avaliações</p>
          </div>

          {/* Seletor de Bimestre */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bimestre Atual</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(quarter => (
                <button
                  key={quarter}
                  onClick={() => setSelectedQuarter(quarter)}
                  className={`p-4 rounded-lg font-medium transition-colors ${
                    selectedQuarter === quarter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {quarter}º Bimestre
                </button>
              ))}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/professor/turmas" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Minhas Turmas</h3>
                  <p className="text-sm text-gray-600">3 turmas ativas</p>
                </div>
              </div>
            </Link>
            <Link to="/professor/aulas" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Lançar Aula</h3>
                  <p className="text-sm text-gray-600">Registrar conteúdo</p>
                </div>
              </div>
            </Link>
            <Link to="/professor/chamada" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fazer Chamada</h3>
                  <p className="text-sm text-gray-600">Registrar presenças</p>
                </div>
              </div>
            </Link>
            <Link to="/professor/assistente" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Brain className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Assistente IA</h3>
                  <p className="text-sm text-gray-600">Educação inclusiva</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Resumo do Bimestre Atual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aulas Dadas</p>
                  <p className="text-2xl font-bold text-blue-600">24</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Notas Lançadas</p>
                  <p className="text-2xl font-bold text-green-600">18</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Frequência Média</p>
                  <p className="text-2xl font-bold text-purple-600">94%</p>
                </div>
                <ClipboardList className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Aula lançada: Equações de 2º Grau</p>
                  <p className="text-xs text-gray-600">7º Ano A - Hoje às 14:30</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Chamada realizada</p>
                  <p className="text-xs text-gray-600">8º Ano B - Hoje às 10:15</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Notas lançadas: Prova de Funções</p>
                  <p className="text-xs text-gray-600">9º Ano C - Ontem às 16:45</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

// Página de Turmas do Professor
const TeacherClassesPage = () => {
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  
  const classes = [
    { id: 1, name: '7º Ano A', subject: 'Matemática', students: 32, level: 'Ensino Fundamental', shift: 'Matutino', schedule: 'Seg/Qua/Sex 14:30-15:20' },
    { id: 2, name: '8º Ano B', subject: 'Matemática', students: 28, level: 'Ensino Fundamental', shift: 'Vespertino', schedule: 'Ter/Qui 10:15-11:05' },
    { id: 3, name: '9º Ano C', subject: 'Matemática', students: 30, level: 'Ensino Fundamental', shift: 'Matutino', schedule: 'Seg/Qua/Sex 08:00-08:50' }
  ];

  return (
    <DashboardLayout 
      title="Painel do Professor" 
      user="Professor João Silva - Matemática" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Minhas Turmas</h2>
            <p className="text-gray-600">Selecione uma turma para acessar as ferramentas pedagógicas</p>
          </div>

          {/* Seletor de Bimestre */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bimestre: {selectedQuarter}º</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(quarter => (
                <button
                  key={quarter}
                  onClick={() => setSelectedQuarter(quarter)}
                  className={`p-4 rounded-lg font-medium transition-colors ${
                    selectedQuarter === quarter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {quarter}º Bimestre
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Turmas com Ferramentas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <div key={classItem.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {classItem.subject}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Alunos:</span>
                    <span className="font-medium">{classItem.students}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nível:</span>
                    <span className="font-medium">{classItem.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Turno:</span>
                    <span className="font-medium">{classItem.shift}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {classItem.schedule}
                  </div>
                </div>

                {/* Ferramentas da Turma */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to={`/professor/aulas?turma=${classItem.id}&bimestre=${selectedQuarter}`}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Aulas</span>
                    </Link>
                    <Link 
                      to={`/professor/chamada?turma=${classItem.id}`}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                    >
                      <ClipboardList className="h-4 w-4" />
                      <span>Chamada</span>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to={`/professor/notas?turma=${classItem.id}&bimestre=${selectedQuarter}`}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 text-sm"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Notas</span>
                    </Link>
                    <Link 
                      to={`/professor/provas?turma=${classItem.id}`}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 text-sm"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Provas</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo do Dia */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo de Hoje</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-600">Aulas Hoje</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-600">Chamadas Feitas</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-sm text-gray-600">Notas Pendentes</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

// Página de Aulas do Professor
const TeacherLessonsPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [lessons, setLessons] = useState([
    { id: 1, date: '26/01/2024', time: '14:30', topic: 'Equações de 2º Grau', class: '7º Ano A', status: 'Realizada', attendance: 30, quarter: 1 },
    { id: 2, date: '24/01/2024', time: '10:15', topic: 'Funções Quadráticas', class: '8º Ano B', status: 'Realizada', attendance: 26, quarter: 1 },
    { id: 3, date: '22/01/2024', time: '08:00', topic: 'Sistemas Lineares', class: '9º Ano C', status: 'Planejada', attendance: 0, quarter: 1 }
  ]);

  const handleSubmitLesson = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Aula lançada com sucesso!');
    setShowModal(false);
  };

  return (
    <DashboardLayout 
      title="Painel do Professor" 
      user="Professor João Silva - Matemática" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Minhas Aulas</h2>
                <p className="text-gray-600">Gerencie o conteúdo das suas aulas</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Aula</span>
              </button>
            </div>
          </div>

          {/* Lista de Aulas */}
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      lesson.status === 'Realizada' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{lesson.topic}</h3>
                      <p className="text-sm text-gray-600">{lesson.class} • {lesson.date} às {lesson.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      lesson.status === 'Realizada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {lesson.status}
                    </span>
                    {lesson.status === 'Realizada' && (
                      <span className="text-sm text-gray-600">
                        Presenças: {lesson.attendance}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </button>
                  <Link 
                    to={`/professor/chamada?turma=${lesson.class}&aula=${lesson.id}`}
                    className="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                  >
                    <ClipboardList className="h-4 w-4" />
                    <span>Chamada</span>
                  </Link>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">
                    <Eye className="h-4 w-4" />
                    <span>Detalhes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de Nova Aula */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Lançar Nova Aula</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmitLesson}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="7A">7º Ano A</option>
                        <option value="8B">8º Ano B</option>
                        <option value="9C">9º Ano C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data da Aula</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        defaultValue="2024-01-26"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        defaultValue="14:30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bimestre</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="1">1º Bimestre</option>
                        <option value="2">2º Bimestre</option>
                        <option value="3">3º Bimestre</option>
                        <option value="4">4º Bimestre</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tópico da Aula</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Equações de 2º Grau"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo Programático</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Descreva o conteúdo que será abordado na aula..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos de Aprendizagem</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Quais objetivos os alunos devem alcançar com esta aula?"
                    ></textarea>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Lançar Aula
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
};

// Página de Chamada do Professor
const TeacherAttendancePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const turma = searchParams.get('turma') || '1';
  
  const [students] = useState([
    { id: 1, name: 'Ana Clara Silva', registration: '2024001', present: true },
    { id: 2, name: 'Bruno Santos', registration: '2024002', present: true },
    { id: 3, name: 'Carla Oliveira', registration: '2024003', present: false },
    { id: 4, name: 'Diego Costa', registration: '2024004', present: true },
    { id: 5, name: 'Elena Rodrigues', registration: '2024005', present: true },
    { id: 6, name: 'Felipe Lima', registration: '2024006', present: false },
    { id: 7, name: 'Gabriela Souza', registration: '2024007', present: true },
    { id: 8, name: 'Henrique Alves', registration: '2024008', present: true }
  ]);

  const [attendance, setAttendance] = useState(
    students.reduce((acc, student) => {
      acc[student.id] = student.present;
      return acc;
    }, {} as Record<number, boolean>)
  );

  const toggleAttendance = (studentId: number) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSaveAttendance = () => {
    const presentCount = Object.values(attendance).filter(Boolean).length;
    alert(`Chamada salva! ${presentCount} alunos presentes de ${students.length}`);
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = students.length - presentCount;

  return (
    <DashboardLayout 
      title="Painel do Professor" 
      user="Professor João Silva - Matemática" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Chamada - 7º Ano A</h2>
                <p className="text-gray-600">Registre a presença dos alunos</p>
              </div>
              <div className="flex space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                  <p className="text-sm text-gray-600">Presentes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                  <p className="text-sm text-gray-600">Ausentes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações da Aula */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input 
                  type="date" 
                  defaultValue="2024-01-26"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                <input 
                  type="time" 
                  defaultValue="14:30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tópico da Aula</label>
                <input 
                  type="text" 
                  defaultValue="Equações de 2º Grau"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bimestre</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="1">1º Bimestre</option>
                  <option value="2">2º Bimestre</option>
                  <option value="3">3º Bimestre</option>
                  <option value="4">4º Bimestre</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Alunos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Lista de Presença</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    const newAttendance = students.reduce((acc, student) => {
                      acc[student.id] = true;
                      return acc;
                    }, {} as Record<number, boolean>);
                    setAttendance(newAttendance);
                  }}
                  className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm"
                >
                  Marcar Todos
                </button>
                <button 
                  onClick={() => {
                    const newAttendance = students.reduce((acc, student) => {
                      acc[student.id] = false;
                      return acc;
                    }, {} as Record<number, boolean>);
                    setAttendance(newAttendance);
                  }}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                >
                  Desmarcar Todos
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {students.map((student) => (
                <div 
                  key={student.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    attendance[student.id] 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                  onClick={() => toggleAttendance(student.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      attendance[student.id] 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {attendance[student.id] ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">Matrícula: {student.registration}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    attendance[student.id] 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {attendance[student.id] ? 'Presente' : 'Ausente'}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button 
                onClick={handleSaveAttendance}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                <span>Salvar Chamada</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

// Página de Notas do Professor
const TeacherGradesPage = () => {
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [students] = useState([
    { id: 1, name: 'Ana Clara Silva', registration: '2024001', grades: { 1: { p1: 8.5, p2: 7.0, trabalho: 9.0, media: 8.2 }, 2: { p1: null, p2: null, trabalho: null, media: null } } },
    { id: 2, name: 'Bruno Santos', registration: '2024002', grades: { 1: { p1: 7.5, p2: 8.0, trabalho: 8.5, media: 8.0 }, 2: { p1: null, p2: null, trabalho: null, media: null } } },
    { id: 3, name: 'Carla Oliveira', registration: '2024003', grades: { 1: { p1: 9.0, p2: 8.5, trabalho: 9.5, media: 9.0 }, 2: { p1: null, p2: null, trabalho: null, media: null } } },
    { id: 4, name: 'Diego Costa', registration: '2024004', grades: { 1: { p1: 6.0, p2: 7.5, trabalho: 7.0, media: 6.8 }, 2: { p1: null, p2: null, trabalho: null, media: null } } }
  ]);

  const handleSubmitGrades = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Notas lançadas com sucesso!');
    setShowModal(false);
  };

  return (
    <DashboardLayout 
      title="Painel do Professor" 
      user="Professor João Silva - Matemática" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Lançamento de Notas</h2>
                <p className="text-gray-600">Gerencie as notas dos seus alunos</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Lançar Notas</span>
              </button>
            </div>
          </div>

          {/* Seletor de Bimestre */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bimestre: {selectedQuarter}º</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(quarter => (
                <button
                  key={quarter}
                  onClick={() => setSelectedQuarter(quarter)}
                  className={`p-4 rounded-lg font-medium transition-colors ${
                    selectedQuarter === quarter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {quarter}º Bimestre
                </button>
              ))}
            </div>
          </div>

          {/* Tabela de Notas */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Aluno</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">P1</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">P2</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Trabalho</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Média</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const quarterGrades = student.grades[selectedQuarter as keyof typeof student.grades];
                    const media = quarterGrades?.media;
                    const status = media ? (media >= 7 ? 'Aprovado' : media >= 5 ? 'Recuperação' : 'Reprovado') : 'Pendente';
                    
                    return (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.registration}</p>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            quarterGrades?.p1 ? (quarterGrades.p1 >= 7 ? 'bg-green-100 text-green-800' : quarterGrades.p1 >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-600'
                          }`}>
                            {quarterGrades?.p1 || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            quarterGrades?.p2 ? (quarterGrades.p2 >= 7 ? 'bg-green-100 text-green-800' : quarterGrades.p2 >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-600'
                          }`}>
                            {quarterGrades?.p2 || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            quarterGrades?.trabalho ? (quarterGrades.trabalho >= 7 ? 'bg-green-100 text-green-800' : quarterGrades.trabalho >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-600'
                          }`}>
                            {quarterGrades?.trabalho || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded font-medium ${
                            media ? (media >= 7 ? 'bg-green-100 text-green-800' : media >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-600'
                          }`}>
                            {media || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            status === 'Aprovado' ? 'bg-green-100 text-green-800' :
                            status === 'Recuperação' ? 'bg-yellow-100 text-yellow-800' :
                            status === 'Reprovado' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal de Lançamento de Notas */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Lançar Notas - {selectedQuarter}º Bimestre</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmitGrades}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="7A">7º Ano A</option>
                        <option value="8B">8º Ano B</option>
                        <option value="9C">9º Ano C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Avaliação</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="p1">Prova 1 (P1)</option>
                        <option value="p2">Prova 2 (P2)</option>
                        <option value="trabalho">Trabalho</option>
                        <option value="recuperacao">Recuperação</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título da Avaliação</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Prova de Equações de 2º Grau"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data da Avaliação</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      defaultValue="2024-01-26"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Observações sobre a avaliação..."
                    ></textarea>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Lançar Notas
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
};

// Página do Assistente IA
const TeacherAssistantPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, type: 'assistant', content: 'Olá! Sou seu assistente de educação inclusiva. Como posso ajudá-lo hoje?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  
  const students = [
    { id: 1, name: 'Ana Clara Silva', needs: 'Dislexia' },
    { id: 2, name: 'Bruno Santos', needs: 'TDAH' },
    { id: 3, name: 'Carla Oliveira', needs: 'Deficiência Visual' },
    { id: 4, name: 'Diego Costa', needs: 'Autismo' }
  ];

  const quickQuestions = [
    'Como adaptar exercícios para aluno com dislexia?',
    'Estratégias para aluno com TDAH em matemática',
    'Atividades inclusivas para deficiência visual',
    'Métodos de ensino para aluno autista'
  ];

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simular resposta do assistente
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        type: 'assistant',
        content: `Baseado na sua pergunta sobre "${message}", aqui estão algumas sugestões pedagógicas adaptadas:\n\n1. Use recursos visuais e táteis\n2. Divida as atividades em etapas menores\n3. Forneça feedback constante e positivo\n4. Adapte o tempo de execução das atividades\n\nGostaria de mais detalhes sobre alguma dessas estratégias?`
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <DashboardLayout 
      title="Painel do Professor" 
      user="Professor João Silva - Matemática" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Assistente de Educação Inclusiva</h2>
            <p className="text-gray-600">IA especializada em adaptações pedagógicas para necessidades especiais</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar com alunos */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Alunos com Necessidades Especiais</h3>
                <div className="space-y-2">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student.name)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedStudent === student.name
                          ? 'bg-blue-50 border-blue-200 border'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-sm text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-600">{student.needs}</p>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Perguntas Rápidas</h4>
                  <div className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(question)}
                        className="w-full text-left p-2 text-xs text-blue-600 hover:bg-blue-50 rounded"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
                {/* Cabeçalho do Chat */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Brain className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Assistente IA</h3>
                      <p className="text-sm text-gray-600">
                        {selectedStudent ? `Focado em: ${selectedStudent}` : 'Pronto para ajudar'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                      placeholder="Digite sua pergunta sobre educação inclusiva..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleSendMessage(inputMessage)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

// Página de Provas
const TeacherExamsPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [exams, setExams] = useState([
    { id: 1, title: 'Prova de Equações de 2º Grau', class: '7º Ano A', date: '2024-02-15', status: 'Agendada', questions: 10, duration: 90 },
    { id: 2, title: 'Avaliação de Funções', class: '8º Ano B', date: '2024-02-10', status: 'Aplicada', questions: 8, duration: 60 },
    { id: 3, title: 'Prova de Sistemas Lineares', class: '9º Ano C', date: '2024-02-20', status: 'Criando', questions: 12, duration: 100 }
  ]);

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Prova criada com sucesso!');
    setShowModal(false);
  };

  return (
    <DashboardLayout 
      title="Painel do Professor" 
      user="Professor João Silva - Matemática" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <TeacherSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Provas</h2>
                <p className="text-gray-600">Crie, agende e gerencie suas avaliações</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Prova</span>
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Provas</p>
                  <p className="text-2xl font-bold text-blue-600">{exams.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Agendadas</p>
                  <p className="text-2xl font-bold text-yellow-600">{exams.filter(e => e.status === 'Agendada').length}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aplicadas</p>
                  <p className="text-2xl font-bold text-green-600">{exams.filter(e => e.status === 'Aplicada').length}</p>
                </div>
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Criação</p>
                  <p className="text-2xl font-bold text-purple-600">{exams.filter(e => e.status === 'Criando').length}</p>
                </div>
                <Edit className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Lista de Provas */}
          <div className="space-y-4">
            {exams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      exam.status === 'Aplicada' ? 'bg-green-500' :
                      exam.status === 'Agendada' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                      <p className="text-sm text-gray-600">{exam.class} • {exam.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      exam.status === 'Aplicada' ? 'bg-green-100 text-green-800' :
                      exam.status === 'Agendada' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {exam.status}
                    </span>
                    <div className="text-sm text-gray-600">
                      {exam.questions} questões • {exam.duration} min
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                    <Eye className="h-4 w-4" />
                    <span>Visualizar</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">
                    <Download className="h-4 w-4" />
                    <span>Exportar</span>
                  </button>
                  {exam.status === 'Aplicada' && (
                    <button className="flex items-center space-x-1 px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100">
                      <BarChart3 className="h-4 w-4" />
                      <span>Resultados</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Modal de Nova Prova */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Criar Nova Prova</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmitExam}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título da Prova</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Prova de Geometria"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="7A">7º Ano A</option>
                        <option value="8B">8º Ano B</option>
                        <option value="9C">9º Ano C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data da Prova</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número de Questões</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="1"
                        max="50"
                        defaultValue="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duração (minutos)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="30"
                        max="180"
                        defaultValue="90"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo Programático</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Descreva os tópicos que serão abordados na prova..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instruções para os Alunos</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Instruções especiais, materiais permitidos, etc..."
                    ></textarea>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Criar Prova
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
};

// Student Dashboard
const StudentDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout 
      title="Portal do Aluno" 
      user="João Silva" 
      onLogout={() => navigate('/login')}
    >
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-blue-600 text-white rounded-lg">
              <Calendar className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BarChart3 className="h-5 w-5" />
              <span>Notas</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <ClipboardList className="h-5 w-5" />
              <span>Frequência</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <DollarSign className="h-5 w-5" />
              <span>Financeiro</span>
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bem-vindo, João Silva!</h2>
            <p className="text-gray-600">3º Ano A - Ensino Médio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Média Geral</p>
                  <p className="text-2xl font-bold text-green-600">8.4</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Frequência</p>
                  <p className="text-2xl font-bold text-blue-600">96%</p>
                </div>
                <ClipboardList className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mensalidade</p>
                  <p className="text-2xl font-bold text-green-600">Em dia</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Situação</p>
                  <p className="text-2xl font-bold text-green-600">Aprovado</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas por Disciplina - 1º Bimestre</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Disciplina</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">1º Bim</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">2º Bim</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">3º Bim</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">4º Bim</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">Média</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-sm text-gray-900">Matemática</td>
                    <td className="py-3 text-sm text-center text-green-600 font-medium">8.5</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-600">8.5</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aprovado</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-sm text-gray-900">Português</td>
                    <td className="py-3 text-sm text-center text-green-600 font-medium">9.0</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-600">9.0</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aprovado</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

// Main App Component
const App = () => {
  // Super-admin já foi criado, então sempre mostrar login
  // Para reativar verificação, descomente o código abaixo
  
  /*
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    const checkSuperAdminExists = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'super_admin');
        
        if (error) {
          console.error('Error checking super admin:', error);
        }
        
        setNeedsSetup(count === 0);
      } catch (err) {
        console.error('Error checking setup:', err);
      } finally {
        setCheckingSetup(false);
      }
    };

    checkSuperAdminExists();
  }, []);

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <GraduationCap className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  */

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/networks" element={<SuperAdminNetworks />} />
        <Route path="/superadmin/schools" element={<SuperAdminSchools />} />
        <Route path="/networkadmin/dashboard" element={<NetworkAdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/financeiro" element={<FinancialPage />} />
        <Route path="/admin/configuracoes" element={<SettingsPage />} />
        <Route path="/secretaria/dashboard" element={<SecretaryDashboard />} />
        <Route path="/secretaria/alunos" element={<SecretaryStudents />} />
        <Route path="/secretaria/turmas" element={<SecretaryClassesPage />} />
        <Route path="/secretaria/disciplinas" element={<SecretarySubjectsPage />} />
        <Route path="/secretaria/planos" element={<SecretaryLessonPlansPage />} />
        <Route path="/professor/dashboard" element={<TeacherDashboard />} />
        <Route path="/professor/turmas" element={<TeacherClassesPage />} />
        <Route path="/professor/aulas" element={<TeacherLessonsPage />} />
        <Route path="/professor/chamada" element={<TeacherAttendancePage />} />
        <Route path="/professor/notas" element={<TeacherGradesPage />} />
        <Route path="/professor/assistente" element={<TeacherAssistantPage />} />
        <Route path="/professor/provas" element={<TeacherExamsPage />} />
        <Route path="/aluno/dashboard" element={<StudentDashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
