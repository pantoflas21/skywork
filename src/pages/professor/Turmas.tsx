import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  LayoutDashboard, 
  BookOpen, 
  ClipboardCheck, 
  GraduationCap, 
  Bot, 
  Clock,
  LogOut,
  Calendar,
  AlertCircle,
  BarChart3,
  Brain,
  ClipboardList
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/services/api';
import { toast } from 'sonner';

interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  shift: string;
  capacity: number;
  student_count?: number;
}

const TeacherClasses: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState<string>('all');
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedBimester, setSelectedBimester] = useState('quarter1');

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

  // Carregar turmas do professor
  useEffect(() => {
    if (!schoolId || !userId) return;
    loadClasses();
  }, [schoolId, userId]);

  const loadClasses = async () => {
    try {
      // Buscar turmas do professor
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name, grade, shift, capacity')
        .eq('school_id', schoolId)
        .eq('teacher_id', userId)
        .eq('active', true)
        .order('name');

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
    } catch (error) {
      console.error('Error loading classes:', error);
      toast.error('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleClassSelection = (classId: string) => {
    navigate(`/professor/turmas/${classId}/alunos`);
  };

  const filteredClasses = classes.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShift = shiftFilter === 'all' || c.shift === shiftFilter;
    return matchesSearch && matchesShift;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando turmas...</p>
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
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <nav className="p-4 space-y-2">
            <Link 
              to="/professor/dashboard" 
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Calendar className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/professor/turmas" 
              className="flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg"
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
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Minhas Turmas</h1>
                <p className="text-gray-600">
                  Selecione o bimestre e a turma para gerenciar atividades
                </p>
              </div>
            </div>

            <Tabs value={selectedBimester} onValueChange={setSelectedBimester} className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-[600px]">
                  <TabsTrigger value="quarter1">1º Bimestre</TabsTrigger>
                  <TabsTrigger value="quarter2">2º Bimestre</TabsTrigger>
                  <TabsTrigger value="quarter3">3º Bimestre</TabsTrigger>
                  <TabsTrigger value="quarter4">4º Bimestre</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar turma..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={shiftFilter} onValueChange={setShiftFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os turnos</SelectItem>
                      <SelectItem value="Matutino">Matutino</SelectItem>
                      <SelectItem value="Vespertino">Vespertino</SelectItem>
                      <SelectItem value="Noturno">Noturno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {['quarter1', 'quarter2', 'quarter3', 'quarter4'].map((quarter) => (
                <TabsContent key={quarter} value={quarter} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.length > 0 ? (
                      filteredClasses.map((item) => (
                        <Card 
                          key={item.id} 
                          className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-blue-600"
                          onClick={() => handleClassSelection(item.id)}
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl">{item.name}</CardTitle>
                                <CardDescription>{item.grade}</CardDescription>
                              </div>
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Users className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-2" />
                                Turno: <span className="ml-1 font-medium capitalize">{item.shift}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Users className="h-4 w-4 mr-2" />
                                Alunos: <span className="ml-1 font-medium">{item.student_count} matriculados</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="bg-gray-50 flex justify-between items-center py-3">
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                              Ver Alunos
                            </span>
                            <ChevronRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Nenhuma turma encontrada</h3>
                        <p className="text-gray-600">
                          {classes.length === 0 
                            ? 'Você ainda não tem turmas atribuídas.' 
                            : 'Tente ajustar seus filtros de busca.'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherClasses;
