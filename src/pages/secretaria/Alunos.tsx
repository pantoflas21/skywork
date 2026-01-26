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
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { Student, Class } from '@/types';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Eye, 
  UserMinus, 
  Filter, 
  Users, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const studentSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  registrationNumber: z.string().min(5, 'Matrícula obrigatória'),
  birthDate: z.string(),
  classId: z.string().min(1, 'Selecione uma turma'),
  guardianName: z.string().min(3, 'Nome do responsável obrigatório'),
  guardianPhone: z.string().min(10, 'Telefone inválido'),
  specialNeeds: z.boolean().default(false),
  specialNeedsDescription: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

const SecretaryStudents: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock data for UI demonstration
  const [students] = useState<Student[]>([
    {
      id: '1',
      userId: 'u1',
      classId: 'c1',
      registrationNumber: '2024001',
      birthDate: '2010-05-15',
      guardianName: 'Maria Silva',
      guardianPhone: '(11) 98888-7777',
      specialNeeds: true,
      specialNeedsDescription: 'TDAH',
      profile: { 
        id: 'u1', 
        fullName: 'João Silva Oliveira', 
        email: 'joao.silva@escola.com', 
        role: 'aluno', 
        schoolId: 's1', 
        active: true 
      }
    },
    {
      id: '2',
      userId: 'u2',
      classId: 'c2',
      registrationNumber: '2024002',
      birthDate: '2012-08-20',
      guardianName: 'Carlos Souza',
      guardianPhone: '(11) 97777-6666',
      specialNeeds: false,
      profile: { 
        id: 'u2', 
        fullName: 'Ana Clara Souza', 
        email: 'ana.souza@escola.com', 
        role: 'aluno', 
        schoolId: 's1', 
        active: true 
      }
    }
  ]);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      specialNeeds: false,
    },
  });

  const onSubmit = (data: StudentFormValues) => {
    console.log('Novo Aluno:', data);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const menuItems = [
    { icon: Users, label: 'Dashboard', path: ROUTES.SECRETARY.DASHBOARD },
    { icon: UserPlus, label: 'Alunos', path: ROUTES.SECRETARY.STUDENTS, active: true },
    { icon: FileText, label: 'Turmas', path: ROUTES.SECRETARY.CLASSES },
    { icon: Filter, label: 'Matrículas', path: ROUTES.SECRETARY.ENROLLMENT },
  ];

  const filteredStudents = students.filter(s => 
    s.profile?.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.registrationNumber.includes(search)
  );

  return (
    <DashboardLayout user={user} menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão completa de alunos</h1>
            <p className="text-muted-foreground">
              Cadastre, edite e monitore o desempenho acadêmico e dados cadastrais.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-hover-effect">
                <UserPlus className="mr-2 h-4 w-4" />
                Matricular Novo Aluno
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Formulário de Matrícula</DialogTitle>
                <DialogDescription>
                  Preencha os dados do aluno e do responsável para efetivar a matrícula.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do aluno" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail institucional</FormLabel>
                          <FormControl>
                            <Input placeholder="exemplo@escola.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matrícula</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 2024001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="classId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Turma</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a turma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="c1">6º Ano A - Fundamental II</SelectItem>
                              <SelectItem value="c2">8º Ano B - Fundamental II</SelectItem>
                              <SelectItem value="c3">1º Ano EM - Médio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guardianName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Responsável</FormLabel>
                          <FormControl>
                            <Input placeholder="Pai, Mãe ou Tutor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guardianPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone de Contato</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                    <FormField
                      control={form.control}
                      name="specialNeeds"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Possui Necessidades Especiais?</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    {form.watch('specialNeeds') && (
                      <FormField
                        control={form.control}
                        name="specialNeedsDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição da Necessidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Autismo, TDAH, Baixa Visão..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit">Efetivar Matrícula</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
            <CardDescription>Localize alunos por nome, matrícula ou filtre por turma.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou matrícula..." 
                  className="pl-10" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="suspended">Trancados</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Turmas</SelectItem>
                  <SelectItem value="c1">6º Ano A</SelectItem>
                  <SelectItem value="c2">8º Ano B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Necessidades</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="text-sm font-semibold">{student.profile?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{student.profile?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{student.registrationNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{student.guardianName}</p>
                        <p className="text-xs text-muted-foreground">{student.guardianPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ativo
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.specialNeeds ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <AlertTriangle className="h-3 w-3" />
                          {student.specialNeedsDescription || 'Especial'}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">Não</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Visualizar Perfil">
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Editar Dados">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Inativar Aluno">
                          <UserMinus className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhum aluno encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SecretaryStudents;