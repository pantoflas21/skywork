import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Globe, 
  Save, 
  Database, 
  LayoutDashboard, 
  Users, 
  Settings, 
  DollarSign,
  FileText
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD },
    { icon: Users, label: 'Usuários', path: ROUTES.ADMIN.USERS },
    { icon: DollarSign, label: 'Financeiro', path: '/admin/financeiro' },
    { icon: Settings, label: 'Configurações', path: ROUTES.ADMIN.SETTINGS },
  ];

  const form = useForm({
    defaultValues: {
      schoolName: 'ALETHEIA Instituto de Educação',
      schoolEmail: 'contato@aletheia.edu',
      academicYear: '2024',
      passingGrade: '7.0',
      autoBackup: true,
      twoFactor: false,
    },
  });

  const onSubmit = (values: any) => {
    console.log('Salvando configurações:', values);
  };

  return (
    <DashboardLayout user={user} menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações do sistema</h1>
            <p className="text-muted-foreground">
              Gerencie as regras de negócio, dados institucionais e segurança da plataforma.
            </p>
          </div>
          <Button className="gap-2" onClick={form.handleSubmit(onSubmit)}>
            <Save className="h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle>Dados Institucionais</CardTitle>
                </div>
                <CardDescription>Informações básicas que aparecem em relatórios e cabeçalhos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <form className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Nome da Instituição</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="schoolEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Oficial</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input defaultValue="(11) 98877-6655" />
                      </FormControl>
                    </FormItem>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle>Regras Acadêmicas</CardTitle>
                </div>
                <CardDescription>Definições de ano letivo e critérios de aprovação.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano Letivo Vigente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passingGrade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Média Mínima de Aprovação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5.0">5.0</SelectItem>
                            <SelectItem value="6.0">6.0</SelectItem>
                            <SelectItem value="7.0">7.0</SelectItem>
                            <SelectItem value="8.0">8.0</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Disciplinas Ativas</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Artes'].map(sub => (
                      <Button key={sub} variant="secondary" size="sm" className="rounded-full">
                        {sub}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" className="rounded-full border-dashed">
                      + Adicionar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <CardTitle>Segurança & Sistema</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="autoBackup"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Backup Automático
                        </FormLabel>
                        <FormDescription>
                          Sincronizar dados diariamente na nuvem.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twoFactor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Autenticação MFA
                        </FormLabel>
                        <FormDescription>
                          Exigir código extra para administradores.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button variant="outline" className="w-full gap-2">
                  <Database className="h-4 w-4" />
                  Exportar Banco de Dados
                </Button>
                <Button variant="ghost" className="w-full text-xs text-muted-foreground">
                  Versão do Sistema: v2.4.0-pro
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Globe className="h-5 w-5" />
                  <CardTitle>Domínio & Portal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Seu portal de alunos e professores está acessível em:
                </p>
                <code className="block p-2 bg-background border rounded text-xs text-primary font-mono">
                  https://aletheia-edu.portal.com
                </code>
                <Button variant="link" className="p-0 h-auto text-xs gap-1">
                  <FileText className="h-3 w-3" /> Ver logs de acesso
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;