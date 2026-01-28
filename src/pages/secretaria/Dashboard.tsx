import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  LogOut,
  UserPlus,
  BookOpen,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  LayoutDashboard,
  Settings
} from 'lucide-react';
import { supabase } from '@/services/api';
import { toast } from 'sonner';

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
  recentEnrollments: number;
}

interface RecentStudent {
  id: string;
  full_name: string;
  registration_number: string;
  enrollment_date: string;
  status: string;
  class_name?: string;
}

const SecretaryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalClasses: 0,
    recentEnrollments: 0,
  });
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([]);

  // Carregar usuário logado
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      setUserEmail(user.email || '');

      // Buscar dados do usuário
      const { data: userData } = await supabase
        .from('users')
        .select('school_id, full_name, role')
        .eq('id', user.id)
        .single();

      if (userData?.school_id) {
        setSchoolId(userData.school_id);
        setUserName(userData.full_name);
      }
    };
    loadUser();
  }, [navigate]);

  // Carregar estatísticas
  useEffect(() => {
    if (!schoolId) return;
    loadDashboardData();
  }, [schoolId]);

  const loadDashboardData = async () => {
    try {
      // Total de alunos
      const { count: totalCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId);

      // Alunos ativos
      const { count: activeCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('active', true);

      // Total de turmas
      const { count: classesCount } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('active', true);

      // Matrículas recentes (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: recentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .gte('enrollment_date', thirtyDaysAgo.toISOString());

      // Alunos recentes (últimos 5)
      const { data: recentData } = await supabase
        .from('students')
        .select(`
          id,
          full_name,
          registration_number,
          enrollment_date,
          status,
          class:classes(name)
        `)
        .eq('school_id', schoolId)
        .order('enrollment_date', { ascending: false })
        .limit(5);

      setStats({
        totalStudents: totalCount || 0,
        activeStudents: activeCount || 0,
        totalClasses: classesCount || 0,
        recentEnrollments: recentCount || 0,
      });

      if (recentData) {
        setRecentStudents(recentData.map(s => ({
          ...s,
          class_name: s.class?.name
        })));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">ALETHEIA</h1>
              <p className="text-sm text-gray-600">Painel da Secretaria</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName || userEmail}</p>
              <p className="text-xs text-gray-600">Secretária</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <nav className="p-4 space-y-2">
            <Link 
              to="/secretaria/dashboard" 
              className="flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/secretaria/alunos" 
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Users className="h-5 w-5" />
              <span>Alunos</span>
            </Link>
            <Link 
              to="/secretaria/turmas" 
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <BookOpen className="h-5 w-5" />
              <span>Turmas</span>
            </Link>
            <Link 
              to="/secretaria/planos" 
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FileText className="h-5 w-5" />
              <span>Planos de Aula</span>
            </Link>
            <Link 
              to="/secretaria/configuracoes" 
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bem-vinda, {userName?.split(' ')[0] || 'Secretária'}! 👋</h2>
            <p className="text-gray-600">Aqui está o resumo das atividades da escola</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link 
              to="/secretaria/alunos" 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
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
            <Link 
              to="/secretaria/turmas" 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
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
            <Link 
              to="/secretaria/planos" 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ClipboardCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Revisar Planos</h3>
                  <p className="text-sm text-gray-600">Planos de aula dos professores</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Alunos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stats.activeStudents} ativos
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Turmas Ativas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
                  <p className="text-xs text-gray-500 mt-1">Classes em andamento</p>
                </div>
                <BookOpen className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Matrículas (30 dias)</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.recentEnrollments}</p>
                  <p className="text-xs text-gray-500 mt-1">Novos alunos</p>
                </div>
                <UserPlus className="h-10 w-10 text-purple-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Ativação</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalStudents > 0 
                      ? Math.round((stats.activeStudents / stats.totalStudents) * 100)
                      : 0}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Alunos ativos</p>
                </div>
                <TrendingUp className="h-10 w-10 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Recent Students */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Matrículas Recentes</h3>
              <Link 
                to="/secretaria/alunos" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todos →
              </Link>
            </div>
            
            {recentStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Nome</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Matrícula</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Turma</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Data</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium text-gray-900">{student.full_name}</td>
                        <td className="py-3 text-sm text-gray-600">{student.registration_number}</td>
                        <td className="py-3 text-sm text-gray-600">
                          {student.class_name || <span className="text-gray-400">Sem turma</span>}
                        </td>
                        <td className="py-3 text-sm text-gray-600">{formatDate(student.enrollment_date)}</td>
                        <td className="py-3">
                          {student.status === 'ativo' ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              Ativo
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">
                              {student.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Nenhuma matrícula recente</p>
                <Link 
                  to="/secretaria/alunos" 
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                >
                  Matricular primeiro aluno →
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
