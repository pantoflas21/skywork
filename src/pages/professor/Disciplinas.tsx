import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Bot,
  BookOpenText,
  ArrowLeft,
  BarChart3,
  Clock,
  Calendar
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ROUTES } from '@/constants';
import { Subject } from '@/types';

const MOCK_SUBJECTS: (Subject & { workload: number; lessonsCount: number; averageAttendance: string })[] = [
  {
    id: 'subj-1',
    schoolId: 's1',
    name: 'Língua Portuguesa',
    code: 'LP-3A',
    description: 'Ensino de gramática, literatura e redação.',
    workload: 80,
    lessonsCount: 12,
    averageAttendance: '94%',
  },
  {
    id: 'subj-2',
    schoolId: 's1',
    name: 'Matemática',
    code: 'MAT-3A',
    description: 'Raciocínio lógico, álgebra básica e geometria.',
    workload: 60,
    lessonsCount: 8,
    averageAttendance: '89%',
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

const TeacherSubjects: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  // In a real app, fetch class name from ID
  const className = "3º Ano A";

  return (
    <DashboardLayout menuItems={teacherMenuItems}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={ROUTES.TEACHER.DASHBOARD}>Início</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={ROUTES.TEACHER.MY_CLASSES}>Minhas Turmas</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{className}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Disciplinas da Turma</h1>
              <p className="text-muted-foreground">Escolha uma disciplina para gerenciar notas, frequência e aulas</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_SUBJECTS.map((subject) => (
            <Card key={subject.id} className="overflow-hidden border-t-4 border-t-accent">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-accent uppercase">{subject.code}</div>
                    <CardTitle className="text-2xl">{subject.name}</CardTitle>
                    <CardDescription>{subject.description}</CardDescription>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <BookOpenText className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> Carga Horária
                    </div>
                    <div className="font-semibold">{subject.workload}h</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> Aulas Dadas
                    </div>
                    <div className="font-semibold">{subject.lessonsCount}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <BarChart3 className="h-3 w-3 mr-1" /> Frequência Média
                    </div>
                    <div className="font-semibold text-green-600">{subject.averageAttendance}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex flex-col h-auto py-2 gap-1"
                    asChild
                  >
                    <Link to={`${ROUTES.TEACHER.LESSONS}?class=${classId}&subject=${subject.id}`}>
                      <BookOpen className="h-4 w-4" />
                      <span className="text-[10px]">Aulas</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex flex-col h-auto py-2 gap-1"
                    asChild
                  >
                    <Link to={`${ROUTES.TEACHER.ATTENDANCE}?class=${classId}&subject=${subject.id}`}>
                      <ClipboardCheck className="h-4 w-4" />
                      <span className="text-[10px]">Chamada</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex flex-col h-auto py-2 gap-1"
                    asChild
                  >
                    <Link to={`${ROUTES.TEACHER.GRADES}?class=${classId}&subject=${subject.id}`}>
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-[10px]">Notas</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex flex-col h-auto py-2 gap-1"
                    asChild
                  >
                    <Link to={`${ROUTES.TEACHER.AI_ASSISTANT}?class=${classId}&subject=${subject.id}`}>
                      <Bot className="h-4 w-4" />
                      <span className="text-[10px]">IA Assistente</span>
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherSubjects;