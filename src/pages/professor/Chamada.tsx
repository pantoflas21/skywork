import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Bot,
  Search,
  Save,
  RotateCcw,
  Check,
  X,
  Calendar as CalendarIcon,
  Download,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Brain,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/services/api';
import { toast } from 'sonner';

type AttendanceStatus = 'presente' | 'falta' | 'justificada';

interface StudentAttendance {
  id: string;
  full_name: string;
  registration_number: string;
  status: AttendanceStatus;
  hasRecord: boolean; // Se já foi lançado no banco
}

interface ClassInfo {
  id: string;
  name: string;
  grade: string;
}

const TeacherAttendance: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

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

  // Carregar alunos quando turma é selecionada
  useEffect(() => {
    if (!selectedClassId || !date) return;
    loadStudents();
  }, [selectedClassId, date]);

  const loadClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, grade')
        .eq('school_id', schoolId)
        .eq('teacher_id', userId)
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setClasses(data || []);
      
      if (data && data.length > 0) {
        setSelectedClassId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
      toast.error('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      // Buscar alunos da turma
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, full_name, registration_number')
        .eq('class_id', selectedClassId)
        .eq('active', true)
        .order('full_name');

      if (studentsError) throw studentsError;

      // Buscar frequência já lançada para esta data
      const { data: existingAttendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('class_id', selectedClassId)
        .eq('date', date);

      if (attendanceError && attendanceError.code !== 'PGRST116') { // Ignora erro se tabela não existir
        console.error('Error loading attendance:', attendanceError);
      }

      // Mapear alunos com status já lançado (se houver)
      const attendanceMap = new Map(
        (existingAttendance || []).map((a) => [a.student_id, a.status])
      );

      const studentsWithAttendance: StudentAttendance[] = (students || []).map((s) => ({
        id: s.id,
        full_name: s.full_name,
        registration_number: s.registration_number,
        status: attendanceMap.get(s.id) || 'presente',
        hasRecord: attendanceMap.has(s.id),
      }));

      setAttendance(studentsWithAttendance);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Erro ao carregar alunos');
    }
  };

  const updateStatus = (id: string, status: AttendanceStatus) => {
    setAttendance((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const markAllPresent = () => {
    setAttendance((prev) => prev.map((s) => ({ ...s, status: 'presente' })));
  };

  const resetAttendance = () => {
    loadStudents();
  };

  const saveAttendance = async () => {
    if (!selectedClassId || !date) {
      toast.error('Selecione uma turma e uma data');
      return;
    }

    setSaving(true);
    try {
      // Deletar registros existentes para esta turma e data
      await supabase
        .from('attendance')
        .delete()
        .eq('class_id', selectedClassId)
        .eq('date', date);

      // Inserir novos registros
      const records = attendance.map((s) => ({
        student_id: s.id,
        class_id: selectedClassId,
        teacher_id: userId,
        school_id: schoolId,
        date,
        status: s.status,
      }));

      const { error } = await supabase
        .from('attendance')
        .insert(records);

      if (error) throw error;

      toast.success('Chamada salva com sucesso!');
      loadStudents(); // Recarregar para marcar como salvo
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      if (error.message?.includes('relation "attendance" does not exist')) {
        toast.error('Tabela de frequência ainda não foi criada. Execute a migration.');
      } else {
        toast.error('Erro ao salvar chamada');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const stats = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === 'presente').length,
    absent: attendance.filter((a) => a.status === 'falta').length,
    justified: attendance.filter((a) => a.status === 'justificada').length,
  };

  const filteredStudents = attendance.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.registration_number.includes(search)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
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
              <LayoutDashboard className="h-5 w-5" />
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
              className="flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg"
            >
              <ClipboardCheck className="h-5 w-5" />
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
                <h1 className="text-3xl font-bold text-gray-900">Registro de Chamada</h1>
                <p className="text-gray-600">Realize a frequência diária dos alunos</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetAttendance} className="gap-2">
                  <RotateCcw className="h-4 w-4" /> Limpar
                </Button>
                <Button 
                  onClick={saveAttendance} 
                  disabled={saving || attendance.length === 0}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Chamada'}
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-green-600">Presentes</p>
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-700">{stats.present}</p>
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-red-600">Faltas</p>
                    <X className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-3xl font-bold text-red-700">{stats.absent}</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600">Justificadas</p>
                    <ClipboardCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-700">{stats.justified}</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">Total Alunos</p>
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-700">{stats.total}</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Table */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecionar turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name} - {cls.grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative w-64">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        type="date" 
                        className="pl-9" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                      />
                    </div>
                    <Button variant="secondary" size="sm" onClick={markAllPresent}>
                      Marcar todos presentes
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Buscar aluno..." 
                        className="pl-9" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredStudents.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-[100px]">Matrícula</TableHead>
                          <TableHead>Nome do Aluno</TableHead>
                          <TableHead className="w-[200px] text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-mono text-xs text-gray-600">
                              {student.registration_number}
                            </TableCell>
                            <TableCell className="font-medium">{student.full_name}</TableCell>
                            <TableCell>
                              <Select 
                                value={student.status} 
                                onValueChange={(val) => updateStatus(student.id, val as AttendanceStatus)}
                              >
                                <SelectTrigger className={`h-9 w-full ${
                                  student.status === 'presente' ? 'border-green-200 bg-green-50 text-green-700' : 
                                  student.status === 'falta' ? 'border-red-200 bg-red-50 text-red-700' : 
                                  'border-blue-200 bg-blue-50 text-blue-700'
                                }`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="presente">Presente</SelectItem>
                                  <SelectItem value="falta">Falta</SelectItem>
                                  <SelectItem value="justificada">Justificada</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      {classes.length === 0 
                        ? 'Você não tem turmas atribuídas' 
                        : 'Nenhum aluno encontrado nesta turma'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherAttendance;
