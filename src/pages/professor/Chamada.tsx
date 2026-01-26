import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Bot,
  Search,
  Save,
  RotateCcw,
  Check,
  X,
  Calendar as CalendarIcon,
  Download
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ROUTES, ATTENDANCE_LABELS } from '@/constants';
import { AttendanceStatus } from '@/types';

const teacherMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.TEACHER.DASHBOARD },
  { icon: Users, label: 'Minhas Turmas', path: ROUTES.TEACHER.MY_CLASSES },
  { icon: BookOpen, label: 'Lançar Aulas', path: ROUTES.TEACHER.LESSONS },
  { icon: ClipboardCheck, label: 'Chamada', path: ROUTES.TEACHER.ATTENDANCE },
  { icon: GraduationCap, label: 'Notas', path: ROUTES.TEACHER.GRADES },
  { icon: Bot, label: 'Assistente IA', path: ROUTES.TEACHER.AI_ASSISTANT },
];

interface StudentAttendance {
  id: string;
  name: string;
  registration: string;
  status: AttendanceStatus;
}

const MOCK_STUDENTS: StudentAttendance[] = [
  { id: 'st1', name: 'Ana Beatriz Silva', registration: '2024001', status: 'presente' },
  { id: 'st2', name: 'Bruno Oliveira', registration: '2024002', status: 'presente' },
  { id: 'st3', name: 'Carla Mendonça', registration: '2024003', status: 'presente' },
  { id: 'st4', name: 'Daniel Santos', registration: '2024004', status: 'presente' },
  { id: 'st5', name: 'Eduarda Costa', registration: '2024005', status: 'presente' },
  { id: 'st6', name: 'Felipe Rocha', registration: '2024006', status: 'presente' },
  { id: 'st7', name: 'Gabriel Almeida', registration: '2024007', status: 'presente' },
  { id: 'st8', name: 'Helena Martins', registration: '2024008', status: 'presente' },
];

const TeacherAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<StudentAttendance[]>(MOCK_STUDENTS);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'presente').length,
    absent: attendance.filter(a => a.status === 'ausente').length,
    late: attendance.filter(a => a.status === 'atrasado').length,
    justified: attendance.filter(a => a.status === 'justificado').length,
  };

  const updateStatus = (id: string, status: AttendanceStatus) => {
    setAttendance(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const markAllPresent = () => {
    setAttendance(prev => prev.map(s => ({ ...s, status: 'presente' })));
  };

  const resetAttendance = () => {
    setAttendance(MOCK_STUDENTS);
  };

  const filteredStudents = attendance.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.registration.includes(search)
  );

  return (
    <DashboardLayout menuItems={teacherMenuItems}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Registro de Chamada</h1>
            <p className="text-muted-foreground">Realize a frequência diária dos alunos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetAttendance} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Limpar
            </Button>
            <Button className="gap-2">
              <Save className="h-4 w-4" /> Salvar Chamada
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-green-50 border-green-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-green-600">Presentes</p>
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.present}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-red-600">Ausentes</p>
                <X className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-amber-600">Atrasados</p>
                <ClipboardCheck className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-700">{stats.late}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-blue-600">Total Alunos</p>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date" 
                    className="pl-9" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                  />
                </div>
                <Button variant="secondary" size="sm" onClick={markAllPresent}>
                  Marcar todos presentes
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar aluno..." 
                    className="pl-9" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" title="Exportar Relatório">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px]">Matrícula</TableHead>
                    <TableHead>Nome do Aluno</TableHead>
                    <TableHead className="w-[200px] text-center">Status de Frequência</TableHead>
                    <TableHead className="w-[100px] text-right">Histórico</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{student.registration}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <Select 
                          value={student.status} 
                          onValueChange={(val) => updateStatus(student.id, val as AttendanceStatus)}
                        >
                          <SelectTrigger className={`h-8 w-full ${
                            student.status === 'presente' ? 'border-green-200 bg-green-50 text-green-700' : 
                            student.status === 'ausente' ? 'border-red-200 bg-red-50 text-red-700' : 
                            student.status === 'atrasado' ? 'border-amber-200 bg-amber-50 text-amber-700' : 
                            'border-blue-200 bg-blue-50 text-blue-700'
                          }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ATTENDANCE_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="font-normal cursor-pointer hover:bg-muted">
                          95%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherAttendance;