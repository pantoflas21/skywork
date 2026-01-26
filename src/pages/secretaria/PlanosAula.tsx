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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { Lesson } from '@/types';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  FileCheck, 
  Search, 
  Filter,
  TrendingUp,
  Eye
} from 'lucide-react';

const SecretaryLessons: React.FC = () => {
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [observation, setObservation] = useState('');

  // Mock data for fiscalização
  const lessons = [
    {
      id: 'l1',
      title: 'Equações de 2º Grau',
      teacherName: 'Prof. Ricardo Silva',
      subject: 'Matemática',
      class: '9º Ano A',
      date: '2024-05-20',
      status: 'aprovado',
      content: 'Introdução ao conceito de equações quadráticas e resolução pela fórmula de Bhaskara.'
    },
    {
      id: 'l2',
      title: 'Análise de Texto: Machado de Assis',
      teacherName: 'Profa. Fernanda Gomes',
      subject: 'Língua Portuguesa',
      class: '3º EM',
      date: '2024-05-21',
      status: 'pendente',
      content: 'Estudo dirigido da obra Dom Casmurro focando em ambiguidade narrativa.'
    },
    {
      id: 'l3',
      title: 'Guerra Fria: Contexto Global',
      teacherName: 'Prof. Marcos Oliveira',
      subject: 'História',
      class: '9º Ano B',
      date: '2024-05-22',
      status: 'revisao',
      content: 'As tensões entre EUA e URSS pós-segunda guerra.'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Pendente</Badge>;
      case 'revisao':
        return <Badge variant="destructive">Necessita Revisão</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const menuItems = [
    { icon: FileCheck, label: 'Fiscalização', path: '/secretaria/planos', active: true },
    { icon: TrendingUp, label: 'Estatísticas', path: '/secretaria/dashboard' },
  ];

  return (
    <DashboardLayout user={user} menuItems={menuItems}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fiscalização de planos de aula</h1>
            <p className="text-muted-foreground">
              Monitore a conformidade pedagógica e a qualidade do conteúdo programático lançado.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros Avançados
            </Button>
            <Button>
              <FileCheck className="mr-2 h-4 w-4" />
              Relatório de Conformidade
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Planos Lançados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-green-600">+12 esta semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Aprovados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">90.1% de conformidade</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">Aguardando</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10</div>
              <p className="text-xs text-muted-foreground">Prazo médio: 24h</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Pendências</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Ações imediatas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aulas Lançadas para Fiscalização</CardTitle>
            <CardDescription>Analise o conteúdo programático e forneça feedback aos docentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Turma / Disciplina</TableHead>
                  <TableHead>Título do Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>{new Date(lesson.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-medium">{lesson.teacherName}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">{lesson.class}</span>
                        <span className="text-xs text-muted-foreground">{lesson.subject}</span>
                      </div>
                    </TableCell>
                    <TableCell>{lesson.title}</TableCell>
                    <TableCell>{getStatusBadge(lesson.status)}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedLesson(lesson as any)}>
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                          <DialogHeader>
                            <DialogTitle>Análise Pedagógica: {lesson.title}</DialogTitle>
                            <DialogDescription>
                              Revisão do plano de aula para {lesson.class} - {lesson.subject}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <h4 className="text-sm font-bold mb-1">Conteúdo Programático</h4>
                              <p className="text-sm p-3 bg-muted rounded-md">
                                {lesson.content}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold mb-1">Adicionar Observação/Feedback</h4>
                              <Textarea 
                                placeholder="Escreva aqui orientações ou motivos para revisão..." 
                                value={observation}
                                onChange={(e) => setObservation(e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                          <DialogFooter className="flex gap-2 sm:justify-between">
                            <div className="flex gap-2">
                              <Button variant="destructive" className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Solicitar Revisão
                              </Button>
                              <Button variant="outline" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Manter Pendente
                              </Button>
                            </div>
                            <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Aprovar Plano
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
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

export default SecretaryLessons;