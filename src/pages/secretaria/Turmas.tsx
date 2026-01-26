import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { Class, GradeLevel } from '@/types';
import { Plus, Users, Calendar, Clock, GraduationCap, Settings, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const classSchema = z.object({
  name: z.string().min(2, 'Nome da turma obrigatório'),
  gradeLevel: z.enum(['infantil', 'fundamental_1', 'fundamental_2', 'medio']),
  schoolYear: z.number().min(2024),
  shift: z.enum(['matutino', 'vespertino', 'noturno']),
  teacherId: z.string().min(1, 'Professor regente obrigatório'),
});

type ClassFormValues = z.infer<typeof classSchema>;

const SecretaryClasses: React.FC = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [classes] = useState<Class[]>([
    {
      id: 'c1',
      schoolId: 's1',
      name: '1º Ano A',
      gradeLevel: 'fundamental_1',
      schoolYear: 2024,
      shift: 'matutino',
      teacherId: 't1'
    },
    {
      id: 'c2',
      schoolId: 's1',
      name: '9º Ano B',
      gradeLevel: 'fundamental_2',
      schoolYear: 2024,
      shift: 'vespertino',
      teacherId: 't2'
    },
    {
      id: 'c3',
      schoolId: 's1',
      name: '3º EM Terceirão',
      gradeLevel: 'medio',
      schoolYear: 2024,
      shift: 'matutino',
      teacherId: 't3'
    }
  ]);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      schoolYear: 2024,
    }
  });

  const onSubmit = (data: ClassFormValues) => {
    console.log('Criar Turma:', data);
    setIsDialogOpen(false);
    form.reset();
  };

  const menuItems = [
    { icon: Users, label: 'Alunos', path: ROUTES.SECRETARY.STUDENTS },
    { icon: GraduationCap, label: 'Turmas', path: ROUTES.SECRETARY.CLASSES, active: true },
  ];

  const getLevelLabel = (level: GradeLevel) => {
    const labels: Record<GradeLevel, string> = {
      infantil: 'Educação Infantil',
      fundamental_1: 'Fundamental I',
      fundamental_2: 'Fundamental II',
      medio: 'Ensino Médio'
    };
    return labels[level];
  };

  return (
    <DashboardLayout user={user} menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de turmas escolares</h1>
            <p className="text-muted-foreground">
              Organize as classes por nível, turno e atribua professores regentes.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-hover-effect">
                <Plus className="mr-2 h-4 w-4" />
                Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Criar Nova Turma</DialogTitle>
                <DialogDescription>
                  Configure os parâmetros básicos da turma para o ano letivo.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Identificação (Nome)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 1º Ano A, Terceirão..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gradeLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nível</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="infantil">Infantil</SelectItem>
                              <SelectItem value="fundamental_1">Fundamental I</SelectItem>
                              <SelectItem value="fundamental_2">Fundamental II</SelectItem>
                              <SelectItem value="medio">Ensino Médio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shift"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Turno</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="matutino">Matutino</SelectItem>
                              <SelectItem value="vespertino">Vespertino</SelectItem>
                              <SelectItem value="noturno">Noturno</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professor Regente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Atribuir professor responsável" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="t1">Prof. Ricardo Silva (Matemática)</SelectItem>
                            <SelectItem value="t2">Profa. Fernanda Gomes (Português)</SelectItem>
                            <SelectItem value="t3">Prof. Marcos Oliveira (História)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit">Salvar Turma</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Ativas no ano letivo 2024</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alunos Matriculados</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">Média de 28.5 alunos por turma</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Turnos em Operação</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Matutino, Vespertino, Noturno</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listagem de Turmas</CardTitle>
            <CardDescription>Consulte os detalhes das turmas cadastradas na unidade.</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Filtrar por nome ou professor..." className="pl-10 max-w-sm" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Turma</TableHead>
                  <TableHead>Nível Educacional</TableHead>
                  <TableHead>Ano Letivo</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Professor Regente</TableHead>
                  <TableHead className="text-right">Gerenciar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-bold">{c.name}</TableCell>
                    <TableCell>{getLevelLabel(c.gradeLevel)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                        {c.schoolYear}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{c.shift}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.teacherId === 't1' ? 'Prof. Ricardo Silva' : c.teacherId === 't2' ? 'Profa. Fernanda Gomes' : 'Prof. Marcos Oliveira'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-3 w-3" />
                        Configurar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SecretaryClasses;