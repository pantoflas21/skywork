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
import { networkService, supabase } from '@/services/api';
import { Network as NetworkType } from '@/types';
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

const networkSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cnpj: z.string().optional(),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  adminName: z.string().min(3, 'Nome do administrador obrigatório'),
  adminEmail: z.string().email('E-mail do administrador inválido'),
  adminPassword: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

type NetworkFormValues = z.infer<typeof networkSchema>;

const SuperAdminNetworks: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [networks, setNetworks] = useState<NetworkType[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<NetworkFormValues>({
    resolver: zodResolver(networkSchema),
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
    loadNetworks();
  }, []);

  const loadNetworks = async () => {
    try {
      const data = await networkService.getAll();
      setNetworks(data);
    } catch (error) {
      console.error('Error loading networks:', error);
      toast.error('Erro ao carregar redes');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: NetworkFormValues) => {
    try {
      await networkService.create(data);
      toast.success(`Rede ${data.name} criada com sucesso!`);
      setIsAddDialogOpen(false);
      form.reset();
      loadNetworks();
    } catch (error) {
      console.error('Error creating network:', error);
      toast.error('Erro ao criar rede');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: TrendingUp, label: 'Dashboard', path: '/superadmin/dashboard' },
    { icon: Network, label: 'Redes', path: '/superadmin/networks', active: true },
    { icon: School, label: 'Escolas', path: '/superadmin/schools' },
    { icon: Users, label: 'Usuários', path: '/superadmin/users' },
  ];

  const filteredNetworks = networks.filter(n => 
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.email.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Redes de Ensino</h1>
            <p className="text-muted-foreground">
              Crie e gerencie redes com múltiplas escolas
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-hover-effect">
                <Plus className="mr-2 h-4 w-4" />
                Nova Rede
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Nova Rede de Ensino</DialogTitle>
                <DialogDescription>
                  Preencha os dados da rede e do administrador responsável
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm">Dados da Rede</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Rede</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Rede Marista" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CNPJ (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="00.000.000/0000-00" {...field} />
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
                            <FormLabel>E-mail da Rede</FormLabel>
                            <FormControl>
                              <Input placeholder="contato@rede.com.br" {...field} />
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
                            <FormLabel>Telefone (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 0000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-sm">Administrador da Rede</h3>
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
                              <Input placeholder="admin@rede.com.br" {...field} />
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
                    <Button type="submit">Criar Rede</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Buscar Redes</CardTitle>
            <CardDescription>Localize redes por nome ou e-mail</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome ou e-mail..." 
                className="pl-10" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Rede</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Escolas</TableHead>
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
              ) : filteredNetworks.length > 0 ? (
                filteredNetworks.map((network) => (
                  <TableRow key={network.id}>
                    <TableCell className="font-medium">{network.name}</TableCell>
                    <TableCell>{network.cnpj || '-'}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{network.email}</p>
                        <p className="text-xs text-muted-foreground">{network.phone || '-'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={network.active ? "outline" : "destructive"} 
                        className={network.active ? "bg-green-50 text-green-700 border-green-200" : ""}>
                        {network.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">0 escolas</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Visualizar Detalhes">
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Editar Rede">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhuma rede encontrada.
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

export default SuperAdminNetworks;
