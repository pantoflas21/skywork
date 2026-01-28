import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/services/api';
import { toast } from 'sonner';
import { Plus, Users, GraduationCap, LogOut, Search, Edit, Trash2, LayoutDashboard, BookOpen, Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * z from 'zod';
import { useNavigate, Link } from 'react-router-dom';

const classSchema = z.object({
  name: z.string().min(2, 'Nome da turma obrigatório'),
  grade: z.string().min(1, 'Série/ano obrigatório'),
  shift: z.enum(['Matutino', 'Vespertino', 'Noturno']),
  capacity: z.number().min(1, 'Capacidade deve ser maior que zero').default(30),
});

type ClassFormValues = z.infer<typeof classSchema>;

const SecretaryClasses: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: { capacity: 30, shift: 'Matutino' }
  });

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }
      setUserEmail(user.email || '');
      const { data: userData } = await supabase.from('users').select('school_id').eq('id', user.id).single();
      if (userData?.school_id) setSchoolId(userData.school_id);
    };
    loadUser();
  }, [navigate]);

  useEffect(() => { if (schoolId) loadClasses(); }, [schoolId]);

  const loadClasses = async () => {
    try {
      const { data, error } = await supabase.from('classes').select('*, teacher:users(full_name)').eq('school_id', schoolId).order('name');
      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error loading classes:', error);
      toast.error('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: ClassFormValues) => {
    try {
      const { error } = await supabase.from('classes').insert({ school_id: schoolId, name: values.name, grade: values.grade, shift: values.shift, capacity: values.capacity, active: true });
      if (error) throw error;
      toast.success(`Turma ${values.name} criada com sucesso!`);
      setIsDialogOpen(false);
      form.reset();
      loadClasses();
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error('Erro ao criar turma');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja inativar esta turma?')) return;
    try {
      const { error } = await supabase.from('classes').update({ active: false }).eq('id', id);
      if (error) throw error;
      toast.success('Turma inativada');
      loadClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      toast.error('Erro ao inativar turma');
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div><h1 className="text-xl font-bold text-gray-900">ALETHEIA</h1><p className="text-sm text-gray-600">Painel da Secretaria</p></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right"><p className="text-sm font-medium text-gray-900">{userEmail}</p><p className="text-xs text-gray-600">Secretária</p></div>
            <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Sair</Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen">
          <nav className="p-4 space-y-2">
            <Link to="/secretaria/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"><LayoutDashboard className="h-5 w-5" /><span>Dashboard</span></Link>
            <Link to="/secretaria/alunos" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"><Users className="h-5 w-5" /><span>Alunos</span></Link>
            <Link to="/secretaria/turmas" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium"><BookOpen className="h-5 w-5" /><span>Turmas</span></Link>
            <Link to="/secretaria/configuracoes" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"><Settings className="h-5 w-5" /><span>Configurações</span></Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div><h2 className="text-3xl font-bold">Gestão de Turmas</h2><p className="text-gray-600">Organize as turmas da escola</p></div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild><Button className="bg-blue-600 hover:bg-blue-700"><Plus className="mr-2 h-4 w-4" />Nova Turma</Button></DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader><DialogTitle>Criar Nova Turma</DialogTitle><DialogDescription>Preencha os dados da turma</DialogDescription></DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                      <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nome da Turma *</FormLabel><FormControl><Input placeholder="Ex: 1º Ano A" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="grade" render={({ field }) => (<FormItem><FormLabel>Série/Ano *</FormLabel><FormControl><Input placeholder="Ex: 1º Ano" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="shift" render={({ field }) => (<FormItem><FormLabel>Turno *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Matutino">Matutino</SelectItem><SelectItem value="Vespertino">Vespertino</SelectItem><SelectItem value="Noturno">Noturno</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="capacity" render={({ field }) => (<FormItem><FormLabel>Capacidade *</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl><FormMessage /></FormItem>)} />
                      <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button><Button type="submit">Criar Turma</Button></DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card><CardHeader><CardTitle>Filtros</CardTitle></CardHeader><CardContent><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Buscar turma..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} /></div></CardContent></Card>

            <Card className="overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Turma</TableHead><TableHead>Série</TableHead><TableHead>Turno</TableHead><TableHead>Capacidade</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredClasses.length > 0 ? filteredClasses.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.grade}</TableCell>
                      <TableCell><Badge variant="outline">{cls.shift}</Badge></TableCell>
                      <TableCell>{cls.capacity || 30} alunos</TableCell>
                      <TableCell>{cls.active ? <Badge className="bg-green-50 text-green-700">Ativa</Badge> : <Badge className="bg-gray-50 text-gray-700">Inativa</Badge>}</TableCell>
                      <TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button></div></TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-8">Nenhuma turma encontrada</TableCell></TableRow>}
                </TableBody>
              </Table>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SecretaryClasses;
