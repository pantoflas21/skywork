import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  LogOut,
  BarChart3,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/api';
import { toast } from 'sonner';

interface StudentInfo {
  id: string;
  full_name: string;
  registration_number: string;
  class_name?: string;
  grade?: string;
}

interface GradeData {
  subject: string;
  grades: {
    quarter1: number | null;
    quarter2: number | null;
    quarter3: number | null;
    quarter4: number | null;
  };
  average: number | null;
}

interface AttendanceData {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [attendance, setAttendance] = useState<AttendanceData>({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
  });
  const [overallAverage, setOverallAverage] = useState<number | null>(null);

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
    };
    loadUser();
  }, [navigate]);

  // Carregar dados do aluno
  useEffect(() => {
    if (!userId) return;
    loadStudentData();
  }, [userId]);

  const loadStudentData = async () => {
    try {
      // Buscar informações do aluno
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select(`
          id,
          full_name,
          registration_number,
          class:classes(name, grade)
        `)
        .eq('user_id', userId)
        .single();

      if (studentError) {
        console.error('Student not found:', studentError);
        toast.error('Aluno não encontrado. Entre em contato com a secretaria.');
        setLoading(false);
        return;
      }

      if (!studentData) {
        toast.error('Dados do aluno não encontrados');
        setLoading(false);
        return;
      }

      setStudentInfo({
        id: studentData.id,
        full_name: studentData.full_name,
        registration_number: studentData.registration_number,
        class_name: studentData.class?.name,
        grade: studentData.class?.grade,
      });

      // Buscar notas
      await loadGrades(studentData.id);

      // Buscar frequência
      await loadAttendance(studentData.id);

    } catch (error) {
      console.error('Error loading student data:', error);
      toast.error('Erro ao carregar dados do aluno');
    } finally {
      setLoading(false);
    }
  };

  const loadGrades = async (studentId: string) => {
    try {
      const { data: gradesData, error } = await supabase
        .from('grades')
        .select('subject, quarter, grade')
        .eq('student_id', studentId)
        .order('subject');

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading grades:', error);
        return;
      }

      // Agrupar notas por disciplina
      const gradesBySubject = new Map<string, any>();
      
      (gradesData || []).forEach((g) => {
        if (!gradesBySubject.has(g.subject)) {
          gradesBySubject.set(g.subject, {
            subject: g.subject,
            grades: {
              quarter1: null,
              quarter2: null,
              quarter3: null,
              quarter4: null,
            },
          });
        }

        const subjectData = gradesBySubject.get(g.subject);
        if (g.quarter === 1) subjectData.grades.quarter1 = g.grade;
        if (g.quarter === 2) subjectData.grades.quarter2 = g.grade;
        if (g.quarter === 3) subjectData.grades.quarter3 = g.grade;
        if (g.quarter === 4) subjectData.grades.quarter4 = g.grade;
      });

      // Calcular médias
      const gradesArray: GradeData[] = Array.from(gradesBySubject.values()).map((s) => {
        const validGrades = [
          s.grades.quarter1,
          s.grades.quarter2,
          s.grades.quarter3,
          s.grades.quarter4,
        ].filter((g) => g !== null) as number[];

        const average = validGrades.length > 0
          ? validGrades.reduce((sum, g) => sum + g, 0) / validGrades.length
          : null;

        return {
          ...s,
          average,
        };
      });

      setGrades(gradesArray);

      // Calcular média geral
      const validAverages = gradesArray
        .map((g) => g.average)
        .filter((a) => a !== null) as number[];

      if (validAverages.length > 0) {
        const generalAverage = validAverages.reduce((sum, a) => sum + a, 0) / validAverages.length;
        setOverallAverage(generalAverage);
      }
    } catch (error) {
      console.error('Error loading grades:', error);
    }
  };

  const loadAttendance = async (studentId: string) => {
    try {
      const { data: attendanceData, error } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', studentId);

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading attendance:', error);
        return;
      }

      const total = attendanceData?.length || 0;
      const present = attendanceData?.filter((a) => a.status === 'presente').length || 0;
      const absent = attendanceData?.filter((a) => a.status === 'falta').length || 0;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      setAttendance({
        total,
        present,
        absent,
        percentage,
      });
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'text-gray-400';
    if (grade >= 7) return 'text-green-600';
    if (grade >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (average: number | null) => {
    if (average === null) return <Badge variant="secondary">Em curso</Badge>;
    if (average >= 6) return <Badge className="bg-green-500">Aprovado</Badge>;
    if (average >= 5) return <Badge className="bg-yellow-500">Recuperação</Badge>;
    return <Badge className="bg-red-500">Reprovado</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  if (!studentInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Conta não vinculada</h2>
            <p className="text-gray-600 mb-4">
              Sua conta ainda não foi vinculada a um aluno. Entre em contato com a secretaria.
            </p>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </Card>
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
              <p className="text-sm text-gray-600">Portal do Aluno</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {studentInfo.full_name.split(' ')[0]}
              </p>
              <p className="text-xs text-gray-600">
                Mat: {studentInfo.registration_number}
              </p>
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
            <div className="flex items-center space-x-3 px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg">
              <Calendar className="h-5 w-5" />
              <span>Dashboard</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-400 rounded-lg cursor-not-allowed">
              <BarChart3 className="h-5 w-5" />
              <span>Notas</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-400 rounded-lg cursor-not-allowed">
              <Clock className="h-5 w-5" />
              <span>Frequência</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-400 rounded-lg cursor-not-allowed">
              <BookOpen className="h-5 w-5" />
              <span>Horários</span>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Bem-vindo, {studentInfo.full_name.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-600">
              {studentInfo.class_name || 'Sem turma'} - {studentInfo.grade || 'Sem série'}
            </p>
          </div>

          {/* Academic Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Média Geral</p>
                    <p className={`text-3xl font-bold ${
                      overallAverage !== null && overallAverage >= 6 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {overallAverage !== null ? overallAverage.toFixed(1) : '-'}
                    </p>
                  </div>
                  <BarChart3 className="h-10 w-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Frequência</p>
                    <p className={`text-3xl font-bold ${
                      attendance.percentage >= 75 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {attendance.percentage}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {attendance.present}/{attendance.total} presenças
                    </p>
                  </div>
                  <Clock className="h-10 w-10 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Disciplinas</p>
                    <p className="text-3xl font-bold text-gray-900">{grades.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Cursando</p>
                  </div>
                  <BookOpen className="h-10 w-10 text-indigo-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Situação</p>
                    <p className={`text-xl font-bold ${
                      overallAverage !== null && overallAverage >= 6 && attendance.percentage >= 75
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {overallAverage !== null && overallAverage >= 6 && attendance.percentage >= 75
                        ? 'Aprovado'
                        : 'Em curso'}
                    </p>
                  </div>
                  <GraduationCap className="h-10 w-10 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grades by Subject */}
          <Card className="mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notas por Disciplina
              </h3>
              
              {grades.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-sm font-medium text-gray-600">
                          Disciplina
                        </th>
                        <th className="text-center py-3 text-sm font-medium text-gray-600">
                          1º Bim
                        </th>
                        <th className="text-center py-3 text-sm font-medium text-gray-600">
                          2º Bim
                        </th>
                        <th className="text-center py-3 text-sm font-medium text-gray-600">
                          3º Bim
                        </th>
                        <th className="text-center py-3 text-sm font-medium text-gray-600">
                          4º Bim
                        </th>
                        <th className="text-center py-3 text-sm font-medium text-gray-600">
                          Média
                        </th>
                        <th className="text-center py-3 text-sm font-medium text-gray-600">
                          Situação
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((grade, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 text-sm font-medium text-gray-900">
                            {grade.subject}
                          </td>
                          <td className={`py-3 text-sm text-center font-medium ${getGradeColor(grade.grades.quarter1)}`}>
                            {grade.grades.quarter1?.toFixed(1) || '-'}
                          </td>
                          <td className={`py-3 text-sm text-center font-medium ${getGradeColor(grade.grades.quarter2)}`}>
                            {grade.grades.quarter2?.toFixed(1) || '-'}
                          </td>
                          <td className={`py-3 text-sm text-center font-medium ${getGradeColor(grade.grades.quarter3)}`}>
                            {grade.grades.quarter3?.toFixed(1) || '-'}
                          </td>
                          <td className={`py-3 text-sm text-center font-medium ${getGradeColor(grade.grades.quarter4)}`}>
                            {grade.grades.quarter4?.toFixed(1) || '-'}
                          </td>
                          <td className="py-3 text-sm text-center font-bold text-blue-600">
                            {grade.average?.toFixed(1) || '-'}
                          </td>
                          <td className="py-3 text-center">
                            {getStatusBadge(grade.average)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Ainda não há notas lançadas</p>
                  <p className="text-sm text-gray-500 mt-2">
                    As notas aparecerão aqui quando os professores as lançarem
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Attendance Alert */}
          {attendance.percentage < 75 && attendance.total > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">
                      Atenção: Frequência Baixa
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      Sua frequência está abaixo do mínimo exigido (75%). Você tem{' '}
                      <strong>{attendance.absent} faltas</strong> registradas. Entre em contato
                      com a coordenação para regularizar sua situação.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
