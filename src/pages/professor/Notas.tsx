import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
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
import { Badge } from '@/components/ui/badge';
import {
  Save,
  RefreshCcw,
  Info,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronLeft
} from 'lucide-react';
import { Grade, Student, Class, Subject } from '@/types';
import {
  calculateAnnualAverage,
  formatGrade,
  validateGradeInput,
  isStudentApproved
} from '@/utils/gradeUtils';
import { GRADE_CONFIG, ROUTES } from '@/constants';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const TeacherGrades: React.FC = () => {
  // Mock data for initial state - In a real app, this would come from an API based on route params
  const [searchQuery, setSearchQuery] = useState('');
  const [classInfo] = useState<Class>({
    id: 'class-1',
    name: '9º Ano A',
    gradeLevel: 'fundamental_2',
    schoolYear: 2024,
    shift: 'matutino',
    schoolId: 'school-1',
    teacherId: 'teacher-1'
  });

  const [subjectInfo] = useState<Subject>({
    id: 'sub-1',
    name: 'Matemática',
    code: 'MAT-09',
    schoolId: 'school-1'
  });

  const [students] = useState<Student[]>([
    { id: '1', userId: 'u1', classId: 'class-1', registrationNumber: '2024001', birthDate: '2010-05-15', guardianName: 'Maria Silva', guardianPhone: '11999999999', specialNeeds: false, profile: { id: 'u1', fullName: 'Ana Beatriz Souza', email: 'ana@email.com', role: 'aluno', schoolId: 's1', active: true } } as Student,
    { id: '2', userId: 'u2', classId: 'class-1', registrationNumber: '2024002', birthDate: '2010-08-20', guardianName: 'João Santos', guardianPhone: '11888888888', specialNeeds: true, specialNeedsDescription: 'TDAH', profile: { id: 'u2', fullName: 'Bruno Oliveira', email: 'bruno@email.com', role: 'aluno', schoolId: 's1', active: true } } as Student,
    { id: '3', userId: 'u3', classId: 'class-1', registrationNumber: '2024003', birthDate: '2010-02-10', guardianName: 'Carla Lima', guardianPhone: '11777777777', specialNeeds: false, profile: { id: 'u3', fullName: 'Carlos Eduardo Lima', email: 'carlos@email.com', role: 'aluno', schoolId: 's1', active: true } } as Student,
  ]);

  const [grades, setGrades] = useState<Record<string, Grade>>({
    '1': { id: 'g1', studentId: '1', subjectId: 'sub-1', classId: 'class-1', quarter1: 8.5, quarter2: 7.0, quarter3: null, quarter4: null, finalAverage: null, status: 'cursando', academicYear: 2024 },
    '2': { id: 'g2', studentId: '2', subjectId: 'sub-1', classId: 'class-1', quarter1: 6.0, quarter2: 5.5, quarter3: null, quarter4: null, finalAverage: null, status: 'cursando', academicYear: 2024 },
    '3': { id: 'g3', studentId: '3', subjectId: 'sub-1', classId: 'class-1', quarter1: 9.5, quarter2: 9.0, quarter3: null, quarter4: null, finalAverage: null, status: 'cursando', academicYear: 2024 },
  });

  const handleGradeChange = (studentId: string, quarter: keyof Grade, value: string) => {
    const validatedValue = validateGradeInput(value);
    
    setGrades(prev => {
      const updatedGrade = { ...prev[studentId], [quarter]: validatedValue };
      const average = calculateAnnualAverage(updatedGrade);
      
      let status: Grade['status'] = 'cursando';
      if (average !== null) {
        status = isStudentApproved(average) ? 'aprovado' : 'reprovado';
      }

      return {
        ...prev,
        [studentId]: {
          ...updatedGrade,
          finalAverage: average,
          status
        }
      };
    });
  };

  const handleSave = () => {
    toast.success('Notas salvas com sucesso!');
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      student.profile?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.registrationNumber.includes(searchQuery)
    );
  }, [students, searchQuery]);

  const menuItems = [
    { icon: Calculator, label: 'Dashboard', path: ROUTES.TEACHER.DASHBOARD },
    { icon: Info, label: 'Minhas Turmas', path: ROUTES.TEACHER.MY_CLASSES },
    { icon: Save, label: 'Notas', path: ROUTES.TEACHER.GRADES },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to={ROUTES.TEACHER.MY_CLASSES} className="hover:text-primary flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" /> Turmas
              </Link>
              <span>/</span>
              <span>{classInfo.name}</span>
              <span>/</span>
              <span className="text-foreground font-medium">{subjectInfo.name}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Lançamento de Notas</h1>
            <p className="text-muted-foreground">
              Gerencie o desempenho acadêmico dos alunos para o ano letivo de {classInfo.schoolYear}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.location.reload()} className="hidden sm:flex">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Sincronizar
            </Button>
            <Button onClick={handleSave} className="bg-primary text-white">
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lista de Alunos</CardTitle>
                  <CardDescription>Insira as notas bimestrais (0.0 a 10.0)</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar aluno..."
                    className="pl-8 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[250px]">Aluno</TableHead>
                      <TableHead className="text-center">1º Bim</TableHead>
                      <TableHead className="text-center">2º Bim</TableHead>
                      <TableHead className="text-center">3º Bim</TableHead>
                      <TableHead className="text-center">4º Bim</TableHead>
                      <TableHead className="text-center font-bold text-primary">Média</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const grade = grades[student.id] || {};
                      const isPassing = grade.finalAverage ? isStudentApproved(grade.finalAverage) : null;

                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{student.profile?.fullName}</span>
                              <span className="text-xs text-muted-foreground">Matrícula: {student.registrationNumber}</span>
                              {student.specialNeeds && (
                                <Badge variant="outline" className="mt-1 w-fit text-[10px] border-yellow-500 text-yellow-600">
                                  <AlertCircle className="h-3 w-3 mr-1" /> PNE
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="text"
                              className="w-16 mx-auto text-center h-8"
                              value={grade.quarter1 !== null ? grade.quarter1.toString() : ''}
                              onChange={(e) => handleGradeChange(student.id, 'quarter1', e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="text"
                              className="w-16 mx-auto text-center h-8"
                              value={grade.quarter2 !== null ? grade.quarter2.toString() : ''}
                              onChange={(e) => handleGradeChange(student.id, 'quarter2', e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="text"
                              className="w-16 mx-auto text-center h-8"
                              value={grade.quarter3 !== null ? grade.quarter3.toString() : ''}
                              onChange={(e) => handleGradeChange(student.id, 'quarter3', e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="text"
                              className="w-16 mx-auto text-center h-8"
                              value={grade.quarter4 !== null ? grade.quarter4.toString() : ''}
                              onChange={(e) => handleGradeChange(student.id, 'quarter4', e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-center font-bold text-primary">
                            {formatGrade(grade.finalAverage)}
                          </TableCell>
                          <TableCell className="text-right">
                            {grade.finalAverage !== null ? (
                              <Badge className={isPassing ? "bg-green-500" : "bg-red-500"}>
                                {isPassing ? 'Aprovado' : 'Reprovado'}
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Cursando</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Critérios de Avaliação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  A média bimestral é composta pela soma ponderada das seguintes atividades:
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      Participação em Aula
                    </span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-cyan-500" />
                      Trabalhos e Projetos
                    </span>
                    <span className="font-semibold">30%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-indigo-500" />
                      Avaliações Parciais
                    </span>
                    <span className="font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      Avaliação Final
                    </span>
                    <span className="font-semibold">25%</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Média para Aprovação:</span>
                    <Badge variant="outline" className="text-primary border-primary">
                      {GRADE_CONFIG.MIN_PASSING_GRADE.toFixed(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Resumo da Turma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-3 rounded-lg border text-center">
                    <p className="text-xs text-muted-foreground uppercase">Média Geral</p>
                    <p className="text-2xl font-bold text-primary">7.8</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg border text-center">
                    <p className="text-xs text-muted-foreground uppercase">Aprovados</p>
                    <p className="text-2xl font-bold text-green-600">85%</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                  Ver Relatório Detalhado
                </Button>
              </CardContent>
            </Card>

            {classInfo.gradeLevel === 'infantil' && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-yellow-800">
                    <Info className="h-4 w-4" />
                    Educação Infantil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    Para o nível infantil, o sistema aceita conceitos qualitativos. 
                    Utilize: Excelente (10), Bom (7), Regular (5) ou Insuficiente (3).
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherGrades;