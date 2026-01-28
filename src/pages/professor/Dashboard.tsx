import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  LogOut,
  Calendar,
  ClipboardList,
  BarChart3,
  Brain,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/services/api';
import { toast } from 'sonner';

interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  attendanceAverage: number;
  gradesPercentage: number;
}

interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  shift: string;
  capacity: number;
  student_count?: number;
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBimester, setSelectedBimester] = useState(1);
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalStudents: 0,
    attendanceAverage: 0,
    gradesPercentage: 0,
  });
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  // Carregar usuário logado
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      setUserEmail(user.email || '');
      setUserId(user.id);

      // Buscar dados do professor
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

  // Carregar turmas e estatísticas
  useEffect(() => {
    if (!schoolId || !userId) return;
    loadDashboardData();
  }, [schoolId, userId]);

  const loadDashboardData = async () => {
    try {
      // Buscar turmas do professor
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name, grade, shift, capacity')
        .eq('school_id', schoolId)
        .eq('teacher_id', userId)
        .eq('active', true);

      if (classesError) throw classesError;

      // Contar alunos por turma
      const classesWithCount = await Promise.all(
        (classesData || []).map(async (cls) => {
          const { count } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', cls.id)
            .eq('active', true);

          return {
            ...cls,
            student_count: count || 0,
          };
        })
      );

      setClasses(classesWithCount);

      // Calcular estatísticas
      const totalStudents = classesWithCount.reduce((sum, cls) => sum + (cls.student_count || 0), 0);

      setStats({
        totalClasses: classesWithCount.length,
        totalStudents,
        attendanceAverage: 0, // TODO: calcular quando tabela attendance existir
        gradesPercentage: 0, // TODO: calcular quando tabela grades existir
      });

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
              <p className="text-sm text-gray-600">Painel do Professor</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName || userEmail}</p>
              <p className="text-xs text-gray-600">Professor</p>
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
              to="/professor/dashboard" 
              className="flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg"
            >
              <Calendar className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/professor/turmas" 
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Users className="h-5 w-5" />
              <span>Turmas</span>
            </Link>
            <Link 
              to="/professor/aulas" 
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <BookOpen className="h-5 w-5" />
              <span>Aulas</span>
            </Link>
            <Link 
              to="/professor/chamada" 
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ClipboardList className="h-5 w-5" />
              <span>Chamada</span>
            </Link>
            <Link 
              to="/professor/notas" 
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Notas</span>
            </Link>
            <Link 
              to="/professor/assistente-ia" 
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Brain className="h-5 w-5" />
              <span>Assistente IA</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Bem-vindo, {userName?.split(' ')[0] || 'Professor'}! 👋
            </h2>
            <p className="text-gray-600">Gerencie suas turmas, aulas e avaliações</p>
          </div>

          {/* Bimestre Selector */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecionar Bimestre</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((bimester) => (
                <button
                  key={bimester}
                  onClick={() => setSelectedBimester(bimester)}
                  className={`p-4 rounded-lg font-medium transition-colors ${
                    selectedBimester === bimester
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {bimester}º Bimestre
                </button>
              ))}
            </div>
          </div>

          {/* My Classes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Minhas Turmas</h3>
            {classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <Link
                    key={cls.id}
                    to={`/professor/turmas/${cls.id}`}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {cls.grade}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {cls.student_count} {cls.student_count === 1 ? 'aluno' : 'alunos'}
                    </p>
                    <p className="text-sm text-gray-600">Turno: {cls.shift}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Você ainda não tem turmas atribuídas</p>
                <p className="text-sm text-gray-500 mt-2">
                  Entre em contato com a secretaria para receber suas turmas
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Turmas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
                  <p className="text-xs text-gray-500 mt-1">Ativas</p>
                </div>
                <Users className="h-10 w-10 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Alunos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                  <p className="text-xs text-gray-500 mt-1">Sob sua responsabilidade</p>
                </div>
                <GraduationCap className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Frequência Média</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.attendanceAverage > 0 ? `${stats.attendanceAverage}%` : '-'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.attendanceAverage > 0 ? 'Bimestre atual' : 'Sem dados'}
                  </p>
                </div>
                <ClipboardList className="h-10 w-10 text-purple-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Notas Lançadas</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.gradesPercentage > 0 ? `${stats.gradesPercentage}%` : '-'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.gradesPercentage > 0 ? 'Bimestre atual' : 'Sem dados'}
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/professor/chamada"
                className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ClipboardList className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Lançar Chamada</p>
                  <p className="text-sm text-gray-600">Registrar frequência</p>
                </div>
              </Link>
              <Link
                to="/professor/notas"
                className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <BarChart3 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Lançar Notas</p>
                  <p className="text-sm text-gray-600">Adicionar avaliações</p>
                </div>
              </Link>
              <Link
                to="/professor/aulas"
                className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Planejar Aula</p>
                  <p className="text-sm text-gray-600">Criar conteúdo</p>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
