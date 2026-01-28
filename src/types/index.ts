export type UserRole = 'super_admin' | 'network_admin' | 'admin' | 'secretaria' | 'professor' | 'aluno';

export type GradeLevel = 'infantil' | 'fundamental_1' | 'fundamental_2' | 'medio';

export type AttendanceStatus = 'presente' | 'ausente' | 'atrasado' | 'justificado';

export interface Network {
  id: string;
  name: string;
  adminUserId?: string;
  cnpj?: string;
  email: string;
  phone?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface School {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  networkId?: string;
  network_id?: string; // Campo do banco (snake_case)
  adminUserId?: string;
  admin_user_id?: string; // Campo do banco (snake_case)
  active: boolean;
  createdAt: string;
  updatedAt: string;
  created_at?: string; // Campo do banco (snake_case)
  updated_at?: string; // Campo do banco (snake_case)
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  schoolId?: string | null;
  fullName: string;
  avatarUrl?: string;
  active: boolean;
  lastLogin?: string;
  phone?: string;
}

export interface Student {
  id: string;
  userId: string;
  classId: string;
  registrationNumber: string;
  birthDate: string;
  guardianName: string;
  guardianPhone: string;
  specialNeeds: boolean;
  specialNeedsDescription?: string;
  aiAssistantNotes?: string;
  profile?: User;
}

export interface Teacher {
  id: string;
  userId: string;
  specialization: string;
  bio?: string;
  subjects: string[]; // IDs das disciplinas
  profile?: User;
}

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  gradeLevel: GradeLevel;
  schoolYear: number;
  shift: 'matutino' | 'vespertino' | 'noturno';
  teacherId: string; // Professor regente/tutor
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  description?: string;
  code: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  quarter1: number | null;
  quarter2: number | null;
  quarter3: number | null;
  quarter4: number | null;
  finalAverage: number | null;
  status: 'aprovado' | 'reprovado' | 'recuperacao' | 'cursando';
  academicYear: number;
}

export interface Lesson {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  content: string;
  attachments?: string[];
}

export interface Attendance {
  id: string;
  lessonId: string;
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
  date: string;
}