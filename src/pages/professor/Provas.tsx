import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  FilePlus2,
  Database,
  LayoutTemplate,
  Printer,
  Plus,
  Trash2,
  GraduationCap,
  Users,
  ClipboardList,
  BookOpen,
  BrainCircuit,
  Eye,
  FileDown
} from 'lucide-react';
import { ROUTES } from '@/constants';

const TEACHER_MENU_ITEMS = [
  { icon: GraduationCap, label: 'Dashboard', path: ROUTES.TEACHER.DASHBOARD },
  { icon: Users, label: 'Minhas Turmas', path: ROUTES.TEACHER.MY_CLASSES },
  { icon: BookOpen, label: 'Chamada', path: ROUTES.TEACHER.ATTENDANCE },
  { icon: ClipboardList, label: 'Notas', path: ROUTES.TEACHER.GRADES },
  { icon: BrainCircuit, label: 'Assistente IA', path: ROUTES.TEACHER.AI_ASSISTANT },
];

interface Question {
  id: string;
  type: 'multiple' | 'essay';
  text: string;
  options?: string[];
  correctAnswer?: string;
}

const TeacherExams: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState('');

  const addQuestion = (type: 'multiple' | 'essay') => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: '',
      options: type === 'multiple' ? ['', '', '', ''] : undefined,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <DashboardLayout menuItems={TEACHER_MENU_ITEMS}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <FilePlus2 className="h-8 w-8" />
              Criação de Provas e Avaliações
            </h1>
            <p className="text-muted-foreground">Monte avaliações profissionais com banco de questões e templates.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Visualizar
            </Button>
            <Button className="gap-2">
              <FileDown className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create" className="gap-2">
              <FilePlus2 className="h-4 w-4" />
              Nova Prova
            </TabsTrigger>
            <TabsTrigger value="bank" className="gap-2">
              <Database className="h-4 w-4" />
              Banco de Questões
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <LayoutTemplate className="h-4 w-4" />
              Meus Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6 space-y-6">
            <Card>
              <CardHeader className="bg-muted/30">
                <CardTitle>Cabeçalho Escolar</CardTitle>
                <CardDescription>Configure as informações que aparecerão no topo da prova.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Título da Prova</label>
                    <Input 
                      placeholder="Ex: Avaliação Bimestral - 1º Bim"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Disciplina</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Matemática</SelectItem>
                        <SelectItem value="port">Português</SelectItem>
                        <SelectItem value="hist">História</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Turma</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6a">6º Ano A</SelectItem>
                        <SelectItem value="6b">6º Ano B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data Prevista</label>
                    <Input type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary">Questões ({questions.length})</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 border-primary text-primary hover:bg-primary/10"
                    onClick={() => addQuestion('multiple')}
                  >
                    <Plus className="h-4 w-4" />
                    Múltipla Escolha
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 border-primary text-primary hover:bg-primary/10"
                    onClick={() => addQuestion('essay')}
                  >
                    <Plus className="h-4 w-4" />
                    Dissertativa
                  </Button>
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
                  <Database className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma questão adicionada ainda.</p>
                  <p className="text-sm text-muted-foreground">Comece adicionando uma questão acima.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <Card key={q.id} className="relative group">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Questão {index + 1}</Badge>
                          <Badge className={q.type === 'multiple' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}>
                            {q.type === 'multiple' ? 'Múltipla Escolha' : 'Dissertativa'}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeQuestion(q.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea placeholder="Digite o enunciado da questão aqui..." className="min-h-[80px]" />
                        
                        {q.type === 'multiple' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                            {['a', 'b', 'c', 'd'].map((letter) => (
                              <div key={letter} className="flex items-center gap-2">
                                <span className="font-bold uppercase">{letter})</span>
                                <Input placeholder={`Opção ${letter.toUpperCase()}`} />
                              </div>
                            ))}
                          </div>
                        )}

                        {q.type === 'essay' && (
                          <div className="pl-4 border-l-4 border-muted py-2">
                            <p className="text-xs text-muted-foreground italic">Área reservada para resposta do aluno (linhas serão geradas no PDF)</p>
                            <Input type="number" className="w-24 mt-2" placeholder="Linhas" defaultValue={5} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bank">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="hover:border-primary cursor-pointer transition-all">
                  <CardHeader>
                    <CardTitle className="text-base">Banco de Matemática - 6º Ano</CardTitle>
                    <CardDescription>Frações e Números Decimais</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Contém 45 questões categorizadas por dificuldade.</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button variant="ghost" className="w-full text-primary">Explorar Banco</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Modelo Padrão', 'Simulado ENEM', 'Recuperação', 'Trabalho em Grupo'].map((name) => (
                <div key={name} className="border rounded-lg p-6 flex flex-col items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <LayoutTemplate className="h-12 w-12 text-primary" />
                  <span className="font-medium">{name}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherExams;