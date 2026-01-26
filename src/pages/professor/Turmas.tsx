import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Clock
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
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
import { QUARTERS, ROUTES } from '@/constants';
import { Class, GradeLevel } from '@/types';

const MOCK_CLASSES: (Class & { studentCount: number })[] = [
  {
    id: '1',
    schoolId: 's1',
    name: '3º Ano A',
    gradeLevel: 'fundamental_1',
    schoolYear: 2024,
    shift: 'matutino',
    teacherId: 't1',
    studentCount: 28,
  },
  {
    id: '2',
    schoolId: 's1',
    name: '3º Ano B',
    gradeLevel: 'fundamental_1',
    schoolYear: 2024,
    shift: 'vespertino',
    teacherId: 't1',
    studentCount: 24,
  },
  {
    id: '3',
    schoolId: 's1',
    name: '4º Ano A',
    gradeLevel: 'fundamental_1',
    schoolYear: 2024,
    shift: 'matutino',
    teacherId: 't1',
    studentCount: 30,
  },
];

const teacherMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.TEACHER.DASHBOARD },
  { icon: Users, label: 'Minhas Turmas', path: ROUTES.TEACHER.MY_CLASSES },
  { icon: BookOpen, label: 'Lançar Aulas', path: ROUTES.TEACHER.LESSONS },
  { icon: ClipboardCheck, label: 'Chamada', path: ROUTES.TEACHER.ATTENDANCE },
  { icon: GraduationCap, label: 'Notas', path: ROUTES.TEACHER.GRADES },
  { icon: Bot, label: 'Assistente IA', path: ROUTES.TEACHER.AI_ASSISTANT },
];

const TeacherClasses: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  const filteredClasses = MOCK_CLASSES.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || c.gradeLevel === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const formatGradeLevel = (level: GradeLevel) => {
    const levels: Record<GradeLevel, string> = {
      infantil: 'Educação Infantil',
      fundamental_1: 'Fundamental I',
      fundamental_2: 'Fundamental II',
      medio: 'Ensino Médio',
    };
    return levels[level];
  };

  const handleClassSelection = (classId: string) => {
    navigate(`${ROUTES.TEACHER.MY_CLASSES}/${classId}/disciplinas`);
  };

  return (
    <DashboardLayout menuItems={teacherMenuItems}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Minhas Turmas</h1>
            <p className="text-muted-foreground">Selecione o bimestre e a turma para gerenciar atividades</p>
          </div>
        </div>

        <Tabs defaultValue="quarter1" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-[600px]">
              {QUARTERS.map((q) => (
                <TabsTrigger key={q.id} value={q.key}>
                  {q.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar turma..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="infantil">Infantil</SelectItem>
                  <SelectItem value="fundamental_1">Fundamental I</SelectItem>
                  <SelectItem value="fundamental_2">Fundamental II</SelectItem>
                  <SelectItem value="medio">Ensino Médio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {QUARTERS.map((q) => (
            <TabsContent key={q.id} value={q.key} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((item) => (
                    <Card 
                      key={item.id} 
                      className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-primary"
                      onClick={() => handleClassSelection(item.id)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{item.name}</CardTitle>
                            <CardDescription>{formatGradeLevel(item.gradeLevel)}</CardDescription>
                          </div>
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            Turno: <span className="ml-1 font-medium capitalize">{item.shift}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            Alunos: <span className="ml-1 font-medium">{item.studentCount} matriculados</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/30 flex justify-between items-center py-3">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Acessar Disciplinas</span>
                        <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <Users className="h-12 w-12 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">Nenhuma turma encontrada</h3>
                    <p className="text-muted-foreground">Tente ajustar seus filtros de busca.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherClasses;