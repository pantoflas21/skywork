import { UserRole } from '@/types';

export const USER_ROLES: Record<string, UserRole> = {
  ADMIN: 'admin',
  SECRETARY: 'secretaria',
  TEACHER: 'professor',
  STUDENT: 'aluno',
};

export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    SCHOOLS: '/admin/escolas',
    USERS: '/admin/usuarios',
    SETTINGS: '/admin/configuracoes',
  },
  SECRETARY: {
    DASHBOARD: '/secretaria/dashboard',
    STUDENTS: '/secretaria/alunos',
    CLASSES: '/secretaria/turmas',
    ENROLLMENT: '/secretaria/matriculas',
    LESSON_PLANS: '/secretaria/planos-aula',
  },
  TEACHER: {
    DASHBOARD: '/professor/dashboard',
    MY_CLASSES: '/professor/turmas',
    GRADES: '/professor/notas',
    ATTENDANCE: '/professor/chamada',
    LESSONS: '/professor/aulas',
    AI_ASSISTANT: '/professor/assistente-ia',
  },
  STUDENT: {
    DASHBOARD: '/aluno/dashboard',
    GRADES: '/aluno/notas',
    SCHEDULE: '/aluno/horarios',
    MATERIALS: '/aluno/materiais',
  },
};

export const GRADE_CONFIG = {
  MIN_PASSING_GRADE: 7.0,
  MAX_GRADE: 10.0,
  MIN_GRADE: 0.0,
  QUARTERS_COUNT: 4,
};

export const CONCEPT_MAPPING = {
  EXCELENTE: { label: 'Excelente', value: 10.0 },
  OTIMO: { label: 'Ótimo', value: 9.0 },
  MUITO_BOM: { label: 'Muito Bom', value: 8.0 },
  BOM: { label: 'Bom', value: 7.0 },
  REGULAR: { label: 'Regular', value: 5.0 },
  INSUFICIENTE: { label: 'Insuficiente', value: 3.0 },
};

export const QUARTERS = [
  { id: 1, name: '1º Bimestre', key: 'quarter1' },
  { id: 2, name: '2º Bimestre', key: 'quarter2' },
  { id: 3, name: '3º Bimestre', key: 'quarter3' },
  { id: 4, name: '4º Bimestre', key: 'quarter4' },
];

export const ATTENDANCE_LABELS: Record<string, string> = {
  presente: 'Presente',
  ausente: 'Ausente',
  atrasado: 'Atrasado',
  justificado: 'Justificado',
};