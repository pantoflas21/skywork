import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/services/api';
import { toast } from 'sonner';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Eye, 
  UserMinus, 
  GraduationCap,
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen,
  Settings
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';

const studentSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14, 'CPF inválido'),
  birthDate: z.string().min(1, 'Data de nascimento obrigatória'),
  gender: z.enum(['M', 'F', 'Outro']),
  guardianName: z.string().min(3, 'Nome do responsável obrigatório'),
  guardianPhone: z.string().min(10, 'Telefone inválido'),
  guardianEmail: z.string().email('E-mail inválido').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  classId: z.string().optional().or(z.literal('')),
  specialNeeds: z.boolean().default(false),
  specialNeedsDescription: z.string().optional().or(z.literal('')),
});

type StudentFormValues = z.infer<typeof studentSchema>;

const SecretaryStudents: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      specialNeeds: false,
      gender: 'M',
    },
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

      // Buscar school_id
      const { data: userData } = await supabase
        .from('users')
        .select('school_id, full_name, role')
        .eq('id', user.id)
        .single();

      if (userData?.school_id) {
        setSchoolId(userData.school_id);
      }
    };
    loadUser();
  }, [navigate]);

  // Carregar turmas
  useEffect(() => {
    if (!schoolId) return;
    loadClasses();
  }, [schoolId]);

  // Carregar alunos
  useEffect(() => {
    if (!schoolId) return;
    loadStudents();
  }, [schoolId]);

  const loadClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('school_id', schoolId)
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const { data, error} = await supabase
        .from('students')
        .select(`
          *,
          user:users!students_user_id_fkey(
            full_name,
            email
          ),
          class:classes(
            name
          )
        `)
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const generateRegistrationNumber = async () => {
    const year = new Date().getFullYear();
    
    const { data } = await supabase
      .from('students')
      .select('registration_number')
      .like('registration_number', `${year}%`)
      .order('registration_number', { ascending: false })
      .limit(1);
    
    const lastNumber = data?.[0]?.registration_number || `${year}0000`;
    const sequential = parseInt(lastNumber.slice(-4)) + 1;
    
    return `${year}${String(sequential).padStart(4, '0')}`;
  };

  const onSubmit = async (values: StudentFormValues) => {
    try {
      const registrationNumber = await generateRegistrationNumber();
      
      // Criar registro na tabela students (SEM criar conta de login)
      const { error: studentError, data: studentData } = await supabase
        .from('students')
        .insert({
          school_id: schoolId,
          registration_number: registrationNumber,
          full_name: values.fullName,
          cpf: values.cpf,
          birth_date: values.birthDate,
          gender: values.gender,
          guardian_name: values.guardianName,
          guardian_phone: values.guardianPhone,
          guardian_email: values.guardianEmail || null,
          address: values.address || null,
          class_id: values.classId || null,
          special_needs: values.specialNeeds,
          special_needs_description: values.specialNeedsDescription || null,
          status: 'ativo',
          active: true,
          enrollment_date: new Date().toISOString()
        })
        .select()
        .single();

      if (studentError) throw studentError;

      toast.success(`Aluno ${values.fullName} matriculado com sucesso!\nMatrícula: ${registrationNumber}`);
      setIsAddDialogOpen(false);
      form.reset();
      loadStudents();
    } catch (error: any) {
      console.error('Error creating student:', error);
      if (error.message.includes('rate limit')) {
        toast.error('Limite de cadastros atingido. Aguarde alguns minutos.');
      } else {
        toast.error('Erro ao matricular aluno. Tente novamente.');
      }
    }
  };

  const handleInactivateStudent = async (studentId: string) => {
    if (!confirm('Deseja realmente inativar este aluno?')) return;

    try {
      const { error } = await supabase
        .from('students')
        .update({ active: false, status: 'inativo' })
        .eq('id', studentId);

      if (error) throw error;

      toast.success('Aluno inativado com sucesso');
      loadStudents();
    } catch (error) {
      console.error('Error inactivating student:', error);
      toast.error('Erro ao inativar aluno');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const filteredStudents = students.filter(s => {
    const matchSearch = s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
                       s.registration_number?.includes(search);
    const matchStatus = statusFilter === 'all' || 
                       (statusFilter === 'active' && s.active) ||
                       (statusFilter === 'inactive' && !s.active);
    return matchSearch && matchStatus;
  });

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
              <p className="text-sm text-gray-600">Painel da Secretaria</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userEmail}</p>
              <p className="text-xs text-gray-600">Secretária</p>
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
              to="/secretaria/dashboard" 
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/secretaria/alunos" 
              className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium"
            >
              <Users className="h-5 w-5" />
              <span>Alunos</span>
            </Link>
            <Link 
              to="/secretaria/turmas" 
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <BookOpen className="h-5 w-5" />
              <span>Turmas</span>
            </Link>
            <Link 
              to="/secretaria/configuracoes" 
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <Settings className="h-5 w-5" />
              <span>Configurações</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Gestão de Alunos</h2>
                <p className="text-gray-600">
                  Cadastre e gerencie todos os alunos da escola
                </p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Novo Aluno
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Matricular Novo Aluno</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do aluno para efetivar a matrícula
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
                              <FormLabel>Nome Completo *</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome do aluno" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cpf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF *</FormLabel>
                              <FormControl>
                                <Input placeholder="000.000.000-00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Nascimento *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gênero *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="M">Masculino</SelectItem>
                                  <SelectItem value="F">Feminino</SelectItem>
                                  <SelectItem value="Outro">Outro</SelectItem>
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
                              <FormLabel>Nome do Responsável *</FormLabel>
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
                              <FormLabel>Telefone do Responsável *</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 00000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="guardianEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-mail do Responsável</FormLabel>
                              <FormControl>
                                <Input placeholder="responsavel@email.com" {...field} />
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
                              <FormLabel>Turma (opcional)</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a turma" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {classes.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.id}>
                                      {cls.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Rua, número, bairro, cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
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
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                                <FormLabel>Descrição</FormLabel>
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
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">Matricular Aluno</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters Card */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros e Busca</CardTitle>
                <CardDescription>Localize alunos por nome, matrícula ou filtre por status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Buscar por nome ou matrícula..." 
                      className="pl-10" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Students Table */}
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-sm font-semibold">{student.full_name}</p>
                            <p className="text-xs text-gray-500">{student.cpf}</p>
                          </div>
                        </TableCell>
                        <TableCell>{student.registration_number}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{student.guardian_name}</p>
                            <p className="text-xs text-gray-500">{student.guardian_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.class?.name || (
                            <span className="text-xs text-gray-400">Sem turma</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {student.active ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" title="Visualizar Perfil">
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Editar Dados">
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                            {student.active && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Inativar Aluno"
                                onClick={() => handleInactivateStudent(student.id)}
                              >
                                <UserMinus className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                        {search ? 'Nenhum aluno encontrado com os filtros aplicados.' : 'Nenhum aluno cadastrado ainda.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SecretaryStudents;
