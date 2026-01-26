import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  BrainCircuit,
  MessageSquare,
  Info,
  Lightbulb,
  Users,
  Search,
  Send,
  Sparkles,
  GraduationCap,
  ClipboardList,
  BookOpen
} from 'lucide-react';

import { ROUTES } from '@/constants';

const TEACHER_MENU_ITEMS = [
  { icon: GraduationCap, label: 'Dashboard', path: ROUTES.TEACHER.DASHBOARD },
  { icon: Users, label: 'Minhas Turmas', path: ROUTES.TEACHER.MY_CLASSES },
  { icon: BookOpen, label: 'Chamada', path: ROUTES.TEACHER.ATTENDANCE },
  { icon: ClipboardList, label: 'Notas', path: ROUTES.TEACHER.GRADES },
  { icon: BrainCircuit, label: 'Assistente IA', path: ROUTES.TEACHER.AI_ASSISTANT },
];

const CONDITIONS_DATA = [
  {
    id: 'tea',
    label: 'TEA (Autismo)',
    description: 'Transtorno do Espectro Autista',
    stats: '1 em cada 36 crianças (CDC)',
    behaviors: [
      'Dificuldades na comunicação social e interação',
      'Padrões repetitivos de comportamento',
      'Interesses restritos e intensos',
      'Sensibilidade sensorial (sons, luzes, texturas)',
    ],
    strategies: [
      'Use rotinas visuais claras e previsíveis',
      'Evite linguagem figurada ou sarcasmo',
      'Forneça avisos antecipados sobre mudanças na rotina',
      'Crie um "canto de calma" para regulação sensorial',
    ],
  },
  {
    id: 'tdah',
    label: 'TDAH',
    description: 'Transtorno de Déficit de Atenção e Hiperatividade',
    stats: '5-8% das crianças em idade escolar',
    behaviors: [
      'Dificuldade em manter o foco em tarefas longas',
      'Inquietude motora ou agitação',
      'Impulsividade em respostas e ações',
      'Desorganização com materiais e prazos',
    ],
    strategies: [
      'Divida tarefas longas em etapas curtas',
      'Permita pausas curtas para movimento',
      'Use lembretes visuais e checklists',
      'Posicione o aluno longe de distrações (janelas, portas)',
    ],
  },
  {
    id: 'dislexia',
    label: 'Dislexia',
    description: 'Transtorno específico de aprendizagem na leitura',
    stats: 'Aproximadamente 10% da população',
    behaviors: [
      'Leitura lenta e com esforço',
      'Inversão de letras ou omissão de sílabas',
      'Dificuldade em rimar ou segmentar sons',
      'Fadiga rápida durante atividades de leitura',
    ],
    strategies: [
      'Forneça tempo extra para leitura e escrita',
      'Priorize avaliação oral quando possível',
      'Use fontes legíveis e espaçamento amplo',
      'Permita o uso de audiolivros e softwares de voz',
    ],
  },
];

const TeacherAIAssistant: React.FC = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    {
      role: 'ai',
      content: 'Olá, Professor! Sou seu Assistente de Educação Inclusiva. Como posso ajudar com seus alunos hoje? Pode me perguntar sobre estratégias para uma aula específica ou como adaptar uma prova.',
    },
  ]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const newUserMessage = { role: 'user' as const, content: chatMessage };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setChatMessage('');

    // Simulated AI response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'ai',
          content: `Entendi sua dúvida sobre "${chatMessage}". Para este caso, recomendo aplicar a técnica de scaffolding, reduzindo gradualmente o suporte conforme o aluno ganha autonomia. Gostaria de ver um plano de aula adaptado?`,
        },
      ]);
    }, 1000);
  };

  return (
    <DashboardLayout menuItems={TEACHER_MENU_ITEMS}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <BrainCircuit className="h-8 w-8" />
              Assistente IA para Educação Inclusiva
            </h1>
            <p className="text-muted-foreground">
              Suporte pedagógico especializado para alunos com necessidades específicas.
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
            IA Ativa e Pronta
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Section */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="tea" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                {CONDITIONS_DATA.map((cond) => (
                  <TabsTrigger key={cond.id} value={cond.id}>
                    {cond.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {CONDITIONS_DATA.map((cond) => (
                <TabsContent key={cond.id} value={cond.id} className="space-y-4">
                  <Card className="border-primary/10 overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-xl">{cond.description}</CardTitle>
                          <CardDescription>Entendendo o perfil e comportamentos</CardDescription>
                        </div>
                        <Badge className="bg-primary">{cond.stats}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2 text-primary">
                            <Info className="h-4 w-4" />
                            Comportamentos Típicos
                          </h4>
                          <ul className="space-y-2">
                            {cond.behaviors.map((b, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2 text-green-600">
                            <Lightbulb className="h-4 w-4" />
                            Dicas Pedagógicas
                          </h4>
                          <ul className="space-y-2">
                            {cond.strategies.map((s, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Alunos que podem precisar de atenção
                </CardTitle>
                <CardDescription>
                  Identificados com base em padrões de frequência e desempenho recentes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Lucas Oliveira (6º A)', 'Ana Costa (8º B)'].map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {student[0]}
                        </div>
                        <div>
                          <p className="font-medium">{student}</p>
                          <p className="text-xs text-muted-foreground">Queda de 15% no engajamento esta semana</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Ver Perfil
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Side Section */}
          <div className="flex flex-col h-[calc(100vh-220px)]">
            <Card className="flex-1 flex flex-col border-primary/20 shadow-lg">
              <CardHeader className="bg-primary text-primary-foreground py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Chat Consultivo IA</CardTitle>
                    <p className="text-xs opacity-80">Online agora</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-muted text-foreground rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-4 border-t bg-muted/30">
                <div className="flex w-full items-center gap-2">
                  <Textarea
                    placeholder="Pergunte algo..."
                    className="min-h-[44px] max-h-[120px] resize-none focus-visible:ring-primary"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSendMessage} className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
            <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
              A IA pode cometer erros. Sempre valide as sugestões com o projeto pedagógico da escola.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherAIAssistant;