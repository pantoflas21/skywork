import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  GraduationCap, 
  Bot, 
  Plus, 
  History, 
  Calendar as CalendarIcon, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Clock3
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ROUTES } from '@/constants';
import { Lesson } from '@/types';

const teacherMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.TEACHER.DASHBOARD },
  { icon: Users, label: 'Minhas Turmas', path: ROUTES.TEACHER.MY_CLASSES },
  { icon: BookOpen, label: 'Lançar Aulas', path: ROUTES.TEACHER.LESSONS },
  { icon: ClipboardCheck, label: 'Chamada', path: ROUTES.TEACHER.ATTENDANCE },
  { icon: GraduationCap, label: 'Notas', path: ROUTES.TEACHER.GRADES },
  { icon: Bot, label: 'Assistente IA', path: ROUTES.TEACHER.AI_ASSISTANT },
];

const lessonSchema = z.object({
  title: z.string().min(5, { message: 'O título deve ter pelo menos 5 caracteres' }),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  content: z.string().min(10, { message: 'Descreva o conteúdo programático' }),
  objectives: z.string().min(10, { message: 'Descreva os objetivos da aula' }),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

const MOCK_LESSONS: (Lesson & { status: 'aprovado' | 'pendente' })[] = [
  {
    id: 'l1',
    classId: 'c1',
    subjectId: 's1',
    teacherId: 't1',
    date: '2024-05-20',
    startTime: '08:00',
    endTime: '09:40',
    title: 'Análise Sintática: Sujeito e Predicado',
    content: 'Introdução aos termos essenciais da oração.',
    status: 'aprovado',
  },
  {
    id: 'l2',
    classId: 'c1',
    subjectId: 's1',
    teacherId: 't1',
    date: '2024-05-22',
    startTime: '10:00',
    endTime: '11:40',
    title: 'Literatura Brasileira: Romantismo',
    content: 'Contexto histórico e principais autores da primeira geração.',
    status: 'pendente',
  },
];

const TeacherLessons: React.FC = () => {
  const [view, setView] = useState<'create' | 'history'>('create');

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '09:40',
      content: '',
      objectives: '',
    },
  });

  function onSubmit(values: LessonFormValues) {
    console.log(values);
    alert('Plano de aula salvo com sucesso!');
    form.reset();
    setView('history');
  }

  return (
    <DashboardLayout menuItems={teacherMenuItems}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lançamento de Aulas</h1>
            <p className="text-muted-foreground">Registre seus planos de aula e acompanhe o histórico</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={view === 'create' ? 'default' : 'outline'} 
              onClick={() => setView('create')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Nova Aula
            </Button>
            <Button 
              variant={view === 'history' ? 'default' : 'outline'} 
              onClick={() => setView('history')}
              className="gap-2"
            >
              <History className="h-4 w-4" /> Histórico
            </Button>
          </div>
        </div>

        {view === 'create' ? (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Plano de Aula</CardTitle>
              <CardDescription>Preencha as informações detalhadas sobre a aula ministrada</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Título da Aula</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Frações e Números Decimais" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Início</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fim</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteúdo Programático</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva os tópicos abordados..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="objectives"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivos de Aprendizagem</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="O que os alunos devem aprender ao final desta aula?" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" type="button" onClick={() => form.reset()}>Limpar</Button>
                    <Button type="submit" className="px-8">Salvar Aula</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Aulas</CardTitle>
              <CardDescription>Aulas lançadas recentemente para esta disciplina</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Data</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_LESSONS.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell className="font-medium">
                          {new Date(lesson.date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{lesson.title}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-xs">{lesson.content}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {lesson.startTime} - {lesson.endTime}
                          </div>
                        </TableCell>
                        <TableCell>
                          {lesson.status === 'aprovado' ? (
                            <div className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full w-fit">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Aprovado
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600 text-xs font-medium bg-amber-50 px-2 py-1 rounded-full w-fit">
                              <Clock3 className="h-3 w-3 mr-1" /> Pendente
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherLessons;