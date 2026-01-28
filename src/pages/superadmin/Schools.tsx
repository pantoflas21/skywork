import React, { useEffect, useState } from 'react';
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
import { schoolService, networkService, supabase } from '@/services/api';
import { School as SchoolType, Network as NetworkType } from '@/types';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye,
  Network,
  TrendingUp,
  School,
  Users,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const schoolSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  networkId: z.string().optional(),
  adminName: z.string().min(3, 'Nome do administrador obrigatório'),
  adminEmail: z.string().email('E-mail do administrador inválido'),
  adminPassword: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

const SuperAdminSchools: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [networks, setNetworks] = useState<NetworkType[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
  });

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
      } else {
        navigate('/login');
      }
    };
    
    loadUser();
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Tentar carregar redes
      let networksData = [];
      try {
        networksData = await networkService.getAll();
      } catch (e) {
        console.log('Networks não disponíveis ainda');
      }
      setNetworks(networksData);
      
      // Tentar carregar escolas
      try {
        const { data: schoolsData } = await supabase
          .from('schools')
          .select('*')
          .order('name');
        
        setSchools(schoolsData || []);
      } catch (e) {
        console.log('Escolas não disponíveis ainda:', e);
        setSchools([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SchoolFormValues) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.adminEmail,
        password: data.adminPassword,
        options: {
          data: { full_name: data.adminName, role: 'admin' }
        }
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create auth user');

      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          network_id: (data.networkId && data.networkId !== 'independent') ? data.networkId : null,
          admin_user_id: authData.user.id,
          active: true
        })
        .select()
        .single();
      
      if (schoolError) throw schoolError;

      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          school_id: school.id,
          full_name: data.adminName,
          email: data.adminEmail,
          role: 'admin',
          active: true
        });
      
      if (userError) throw userError;

      toast.success(`Escola ${data.name} criada com sucesso!`);
      setIsAddDialogOpen(false);
      form.reset();
      loadData();
    } catch (error) {
      console.error('Error creating school:', error);
      toast.error('Erro ao criar escola');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: TrendingUp, label: 'Dashboard', path: '/superadmin/dashboard' },
    { icon: Network, label: 'Redes', path: '/superadmin/networks' },
    { icon: School, label: 'Escolas', path: '/superadmin/schools', active: true },
    { icon: Users, label: 'Usuários', path: '/superadmin/users' },
  ];

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
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
              <p className="text-sm text-gray-600">Super Admin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userEmail}</p>
              <p className="text-xs text-gray-600">Super Administrador</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Escolas</h1>
            <p className="text-muted-foreground">
              Gerencie todas as escolas da plataforma
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-hover-effect">
                <Plus className="mr-2 h-4 w-4" />
                Nova Escola
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Escola</DialogTitle>
                <DialogDescription>
                  Preencha os dados da escola e do administrador responsável
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Dados da Escola</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Escola</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Colégio São José" {...field} />
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
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="contato@escola.com.br" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 0000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="networkId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rede (opcional)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Escola independente" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="independent">Escola independente</SelectItem>
                                {networks.map((network) => (
                                  <SelectItem key={network.id} value={network.id}>
                                    {network.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input placeholder="Rua, número, bairro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome da cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="UF" maxLength={2} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-sm">Administrador da Escola</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="adminName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do administrador" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="adminEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail de Login</FormLabel>
                            <FormControl>
                              <Input placeholder="admin@escola.com.br" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="adminPassword"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Senha Temporária</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Criar Escola</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros e Busca</CardTitle>
            <CardDescription>Localize escolas por nome ou filtre por rede</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou e-mail..." 
                  className="pl-10" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filtrar por rede" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as escolas</SelectItem>
                  <SelectItem value="independent">Escolas independentes</SelectItem>
                  {networks.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      {network.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Escola</TableHead>
                <TableHead>Rede</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>
                      {school.network_id ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Rede
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Independente</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{school.city || '-'}</p>
                        <p className="text-xs text-muted-foreground">{school.state || '-'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{school.email}</p>
                        <p className="text-xs text-muted-foreground">{school.phone || '-'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={school.active ? "outline" : "destructive"} 
                        className={school.active ? "bg-green-50 text-green-700 border-green-200" : ""}>
                        {school.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Visualizar Detalhes">
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Editar Escola">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhuma escola encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
      </main>
    </div>
  );
};

export default SuperAdminSchools;
