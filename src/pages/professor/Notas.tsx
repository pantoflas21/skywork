import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Save,
  RefreshCcw,
  Info,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronLeft,
  Plus,
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Brain,
  GraduationCap
} from 'lucide-react';
import { supabase } from '@/services/api';
import { toast } from 'sonner';

interface ClassInfo {
  id: string;
  name: string;
  grade: string;
}

interface StudentGrade {
  student_id: string;
  full_name: string;
  registration_number: string;
  grades: {
    quarter: number;
    grade: number;
    assessment_name: string;
  }[];
}

const TeacherGrades: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
  const [studentsGrades, setStudentsGrades] = useState<StudentGrade[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    name: '',
    type: 'prova',
    subject: 'Matemática',
  });

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

  // Carregar notas quando turma/bimestre são selecionados
  useEffect(() => {
    if (!selectedClassId || !selectedQuarter) return;
    loadGrades();
  }, [selectedClassId, selectedQuarter]);

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

  const loadGrades = async () => {
    try {
      // Buscar alunos da turma
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, full_name, registration_number')
        .eq('class_id', selectedClassId)
        .eq('active', true)
        .order('full_name');

      if (studentsError) throw studentsError;

      // Buscar notas do bimestre selecionado
      const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select('student_id, grade, assessment_name, quarter')
        .eq('class_id', selectedClassId)
        .eq('quarter', selectedQuarter);

      if (gradesError && gradesError.code !== 'PGRST116') {
        console.error('Error loading grades:', gradesError);
      }

      // Mapear alunos com suas notas
      const gradesMap = new Map<string, any[]>();
      (grades || []).forEach((g) => {
        if (!gradesMap.has(g.student_id)) {
          gradesMap.set(g.student_id, []);
        }
        gradesMap.get(g.student_id)?.push(g);
      });

      const studentsWithGrades: StudentGrade[] = (students || []).map((s) => ({
        student_id: s.id,
        full_name: s.full_name,
        registration_number: s.registration_number,
        grades: gradesMap.get(s.id) || [],
      }));

      setStudentsGrades(studentsWithGrades);
    } catch (error) {
      console.error('Error loading grades:', error);
      toast.error('Erro ao carregar notas');
    }
  };

  const handleAddAssessment = async () => {
    if (!newAssessment.name.trim()) {
      toast.error('Digite o nome da avaliação');
      return;
    }

    if (!selectedClassId) {
      toast.error('Selecione uma turma');
      return;
    }

    setSaving(true);
    try {
      // Criar registros de notas vazias para todos os alunos
      const records = studentsGrades.map((s) => ({
        student_id: s.student_id,
        class_id: selectedClassId,
        teacher_id: userId,
        school_id: schoolId,
        subject: newAssessment.subject,
        assessment_type: newAssessment.type,
        assessment_name: newAssessment.name,
        grade: 0,
        quarter: selectedQuarter,
        date: new Date().toISOString().split('T')[0],
      }));

      const { error } = await supabase
        .from('grades')
        .insert(records);

      if (error) throw error;

      toast.success('Avaliação criada com sucesso!');
      setIsAddDialogOpen(false);
      setNewAssessment({ name: '', type: 'prova', subject: 'Matemática' });
      loadGrades();
    } catch (error: any) {
      console.error('Error creating assessment:', error);
      if (error.message?.includes('relation "grades" does not exist')) {
        toast.error('Tabela de notas ainda não foi criada. Execute a migration.');
      } else {
        toast.error('Erro ao criar avaliação');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleGradeChange = (studentId: string, assessmentName: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 10) {
      return;
    }

    setStudentsGrades((prev) =>
      prev.map((s) => {
        if (s.student_id !== studentId) return s;

        return {
          ...s,
          grades: s.grades.map((g) =>
            g.assessment_name === assessmentName ? { ...g, grade: numValue } : g
          ),
        };
      })
    );
  };

  const handleSaveGrades = async () => {
    setSaving(true);
    try {
      // Atualizar todas as notas alteradas
      const updates = studentsGrades.flatMap((s) =>
        s.grades.map((g) => ({
          student_id: s.student_id,
          class_id: selectedClassId,
          teacher_id: userId,
          school_id: schoolId,
          subject: newAssessment.subject,
          assessment_type: 'prova',
          assessment_name: g.assessment_name,
          grade: g.grade,
          quarter: selectedQuarter,
          date: new Date().toISOString().split('T')[0],
        }))
      );

      // Deletar registros existentes e inserir novos
      await supabase
        .from('grades')
        .delete()
        .eq('class_id', selectedClassId)
        .eq('quarter', selectedQuarter);

      const { error } = await supabase
        .from('grades')
        .upsert(updates);

      if (error) throw error;

      toast.success('Notas salvas com sucesso!');
      loadGrades();
    } catch (error: any) {
      console.error('Error saving grades:', error);
      if (error.message?.includes('relation "grades" does not exist')) {
        toast.error('Tabela de notas ainda não foi criada. Execute a migration.');
      } else {
        toast.error('Erro ao salvar notas');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const calculateAverage = (grades: { grade: number }[]) => {
    if (grades.length === 0) return null;
    const sum = grades.reduce((acc, g) => acc + g.grade, 0);
    return (sum / grades.length).toFixed(2);
  };

  const filteredStudents = useMemo(() => {
    return studentsGrades.filter(
      (s) =>
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.registration_number.includes(searchQuery)
    );
  }, [studentsGrades, searchQuery]);

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

  // Obter lista única de avaliações
  const assessmentNames = Array.from(
    new Set(studentsGrades.flatMap((s) => s.grades.map((g) => g.assessment_name)))
  );

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
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ClipboardCheck className="h-5 w-5" />
              <span>Chamada</span>
            </Link>
            <Link
              to="/professor/notas"
              className="flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg"
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
                <h1 className="text-3xl font-bold text-gray-900">Lançamento de Notas</h1>
                <p className="text-gray-600">
                  Gerencie o desempenho acadêmico dos alunos
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={loadGrades}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Atualizar
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Avaliação
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Nova Avaliação</DialogTitle>
                      <DialogDescription>
                        Adicione uma nova avaliação para lançar notas
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Nome da Avaliação</Label>
                        <Input
                          placeholder="Ex: Prova Bimestral"
                          value={newAssessment.name}
                          onChange={(e) =>
                            setNewAssessment({ ...newAssessment, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Tipo</Label>
                        <Select
                          value={newAssessment.type}
                          onValueChange={(value) =>
                            setNewAssessment({ ...newAssessment, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prova">Prova</SelectItem>
                            <SelectItem value="trabalho">Trabalho</SelectItem>
                            <SelectItem value="seminario">Seminário</SelectItem>
                            <SelectItem value="participacao">Participação</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Disciplina</Label>
                        <Input
                          placeholder="Ex: Matemática"
                          value={newAssessment.subject}
                          onChange={(e) =>
                            setNewAssessment({ ...newAssessment, subject: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddAssessment} disabled={saving}>
                        {saving ? 'Criando...' : 'Criar Avaliação'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button onClick={handleSaveGrades} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Salvando...' : 'Salvar Notas'}
                </Button>
              </div>
            </div>

            {/* Filters */}
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

              <Select
                value={selectedQuarter.toString()}
                onValueChange={(val) => setSelectedQuarter(parseInt(val))}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1º Bimestre</SelectItem>
                  <SelectItem value="2">2º Bimestre</SelectItem>
                  <SelectItem value="3">3º Bimestre</SelectItem>
                  <SelectItem value="4">4º Bimestre</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar aluno..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Notas dos Alunos</CardTitle>
                <CardDescription>
                  Insira as notas de 0.0 a 10.0 para cada avaliação
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assessmentNames.length > 0 ? (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-[250px]">Aluno</TableHead>
                          {assessmentNames.map((name) => (
                            <TableHead key={name} className="text-center">
                              {name}
                            </TableHead>
                          ))}
                          <TableHead className="text-center font-bold text-blue-600">
                            Média
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => {
                          const average = calculateAverage(student.grades);
                          const isPassing = average !== null && parseFloat(average) >= 6.0;

                          return (
                            <TableRow key={student.student_id}>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">{student.full_name}</span>
                                  <span className="text-xs text-gray-500">
                                    Mat: {student.registration_number}
                                  </span>
                                </div>
                              </TableCell>
                              {assessmentNames.map((name) => {
                                const gradeObj = student.grades.find(
                                  (g) => g.assessment_name === name
                                );
                                return (
                                  <TableCell key={name} className="text-center">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="10"
                                      step="0.1"
                                      className="w-16 mx-auto text-center h-8"
                                      value={gradeObj?.grade || ''}
                                      onChange={(e) =>
                                        handleGradeChange(
                                          student.student_id,
                                          name,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>
                                );
                              })}
                              <TableCell className="text-center font-bold text-blue-600">
                                {average || '-'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">
                      Nenhuma avaliação criada para este bimestre
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Primeira Avaliação
                    </Button>
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

export default TeacherGrades;
