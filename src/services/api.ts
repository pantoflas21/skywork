import { supabase } from '@/integrations/supabase/client';
import { 
  School, 
  User, 
  Student, 
  Teacher, 
  Class, 
  Subject, 
  Grade, 
  Lesson, 
  Attendance 
} from '@/types';
import { MOCK_MODE } from '@/data/mockData';
import * as mockApi from '@/services/mockApi';

interface DatabaseUser extends User {
  school_id: string | null;
  network_id?: string | null;
  full_name: string;
  cpf?: string;
  address?: string;
}

interface DatabaseSchool extends School {
  network_id?: string | null;
  admin_user_id?: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseClass extends Class {
  school_id: string;
  grade_level: string;
  school_year: number;
  teacher_id?: string;
  max_students: number;
  created_at: string;
  updated_at: string;
}

interface DatabaseSubject extends Subject {
  school_id: string;
  created_at: string;
}

interface DatabaseStudent extends Student {
  school_id: string;
  user_id?: string | null;
  class_id?: string | null;
  registration_number: string;
  birth_date?: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email?: string;
  guardian_cpf?: string;
  special_needs: boolean;
  special_needs_description?: string;
  enrollment_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseTeacher extends Teacher {
  school_id: string;
  user_id: string;
  specialization?: string;
  bio?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseGrade {
  id: string;
  student_id: string;
  class_id: string;
  teacher_id: string;
  school_id: string;
  subject_id?: string;
  subject: string;
  assessment_type: string;
  assessment_name: string;
  grade: number;
  max_grade: number;
  weight: number;
  quarter: number;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseAttendance {
  id: string;
  student_id: string;
  class_id: string;
  teacher_id: string;
  school_id: string;
  lesson_id?: string;
  date: string;
  status: 'presente' | 'ausente' | 'falta' | 'atrasado' | 'justificado' | 'justificada';
  remarks?: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseLesson {
  id: string;
  teacher_id: string;
  subject_id: string;
  class_id: string;
  school_id: string;
  title: string;
  content?: string;
  objectives?: string;
  lesson_date: string;
  start_time?: string;
  end_time?: string;
  quarter: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface FinancialTransaction {
  id: string;
  school_id: string;
  student_id?: string;
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
  due_date?: string;
  payment_date?: string;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

interface SystemSetting {
  id: string;
  school_id: string;
  setting_key: string;
  setting_value: string;
  description?: string;
  updated_at: string;
}

interface Network {
  id: string;
  name: string;
  admin_user_id?: string;
  cnpj?: string;
  email: string;
  phone?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const authService = MOCK_MODE ? mockApi.mockAuthService : {
  getCurrentSession: () => supabase.auth.getSession(),
  onAuthStateChange: (callback: any) => supabase.auth.onAuthStateChange(callback),
  signInWithPassword: (credentials: { email: string; password: string }) => 
    supabase.auth.signInWithPassword(credentials),
  signOut: () => supabase.auth.signOut(),
  signUp: (credentials: { email: string; password: string; options?: any }) =>
    supabase.auth.signUp(credentials),
  resetPasswordForEmail: (email: string) =>
    supabase.auth.resetPasswordForEmail(email),
  updatePassword: (password: string) =>
    supabase.auth.updateUser({ password }),
};

export const userService = MOCK_MODE ? mockApi.mockUserService : {
  getProfile: async (userId: string): Promise<DatabaseUser | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  getAllUsers: async (): Promise<DatabaseUser[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('full_name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  getUsersBySchool: async (schoolId: string): Promise<DatabaseUser[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('school_id', schoolId)
        .order('full_name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users by school:', error);
      return [];
    }
  },

  createUser: async (userData: Partial<DatabaseUser>): Promise<DatabaseUser | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (userId: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
};

export const schoolService = MOCK_MODE ? mockApi.mockSchoolService : {
  getAll: async (): Promise<DatabaseSchool[]> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching schools:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<DatabaseSchool | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching school:', error);
      return null;
    }
  },

  getByNetwork: async (networkId: string): Promise<DatabaseSchool[]> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('network_id', networkId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching schools by network:', error);
      return [];
    }
  },

  createSchool: async (schoolData: Partial<DatabaseSchool>): Promise<DatabaseSchool | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .insert(schoolData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating school:', error);
      throw error;
    }
  },

  updateSchool: async (id: string, updates: Partial<DatabaseSchool>): Promise<DatabaseSchool | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating school:', error);
      throw error;
    }
  }
};

export const classService = MOCK_MODE ? mockApi.mockClassService : {
  getAll: async (): Promise<DatabaseClass[]> => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  },

  getBySchool: async (schoolId: string): Promise<DatabaseClass[]> => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('school_id', schoolId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching classes by school:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<DatabaseClass | null> => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching class:', error);
      return null;
    }
  },

  getByTeacher: async (teacherId: string): Promise<DatabaseClass[]> => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching classes by teacher:', error);
      return [];
    }
  },

  createClass: async (classData: Partial<DatabaseClass>): Promise<DatabaseClass | null> => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert(classData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  },

  updateClass: async (id: string, updates: Partial<DatabaseClass>): Promise<DatabaseClass | null> => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }
};

export const subjectService = MOCK_MODE ? mockApi.mockSubjectService : {
  getAll: async (): Promise<DatabaseSubject[]> => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
  },

  getBySchool: async (schoolId: string): Promise<DatabaseSubject[]> => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('school_id', schoolId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching subjects by school:', error);
      return [];
    }
  },

  createSubject: async (subjectData: Partial<DatabaseSubject>): Promise<DatabaseSubject | null> => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subjectData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  }
};

export const studentService = MOCK_MODE ? mockApi.mockStudentService : {
  getAll: async (): Promise<DatabaseStudent[]> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          user:users(full_name, email),
          class:classes(name)
        `)
        .order('registration_number');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  },

  getBySchool: async (schoolId: string): Promise<DatabaseStudent[]> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          user:users(full_name, email),
          class:classes(name)
        `)
        .eq('school_id', schoolId)
        .order('registration_number');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching students by school:', error);
      return [];
    }
  },

  getByClass: async (classId: string): Promise<DatabaseStudent[]> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          user:users(full_name, email)
        `)
        .eq('class_id', classId)
        .order('registration_number');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching students by class:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<DatabaseStudent | null> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          user:users(full_name, email),
          class:classes(name)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching student:', error);
      return null;
    }
  },

  createStudent: async (studentData: Partial<DatabaseStudent>): Promise<DatabaseStudent | null> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(studentData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  updateStudent: async (id: string, updates: Partial<DatabaseStudent>): Promise<DatabaseStudent | null> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }
};

export const teacherService = MOCK_MODE ? mockApi.mockTeacherService : {
  getById: async (id: string): Promise<DatabaseTeacher | null> => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          user:users(full_name, email, phone)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching teacher:', error);
      return null;
    }
  },

  getByUserId: async (userId: string): Promise<DatabaseTeacher | null> => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching teacher by user:', error);
      return null;
    }
  },

  getBySchool: async (schoolId: string): Promise<DatabaseTeacher[]> => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          user:users(full_name, email, phone)
        `)
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching teachers by school:', error);
      return [];
    }
  },

  create: async (teacherData: Partial<DatabaseTeacher>): Promise<DatabaseTeacher | null> => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .insert(teacherData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  },

  update: async (id: string, updates: Partial<DatabaseTeacher>): Promise<DatabaseTeacher | null> => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  }
};

export const gradeService = MOCK_MODE ? mockApi.mockGradeService : {
  getByStudent: async (studentId: string): Promise<DatabaseGrade[]> => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching grades by student:', error);
      return [];
    }
  },

  getByClass: async (classId: string): Promise<DatabaseGrade[]> => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .eq('class_id', classId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching grades by class:', error);
      return [];
    }
  },

  getByClassAndSubject: async (classId: string, subject: string): Promise<DatabaseGrade[]> => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .eq('class_id', classId)
        .eq('subject', subject)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching grades by class and subject:', error);
      return [];
    }
  },

  getBulkByClass: async (classId: string): Promise<DatabaseGrade[]> => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          student:students(registration_number, user:users(full_name))
        `)
        .eq('class_id', classId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bulk grades:', error);
      return [];
    }
  },

  createGrade: async (gradeData: Partial<DatabaseGrade>): Promise<DatabaseGrade | null> => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .insert(gradeData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating grade:', error);
      throw error;
    }
  },

  updateGrade: async (id: string, updates: Partial<DatabaseGrade>): Promise<DatabaseGrade | null> => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating grade:', error);
      throw error;
    }
  },

  deleteGrade: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting grade:', error);
      return false;
    }
  }
};

export const attendanceService = MOCK_MODE ? mockApi.mockAttendanceService : {
  getByStudent: async (studentId: string, dateRange?: { start: string; end: string }): Promise<DatabaseAttendance[]> => {
    try {
      let query = supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId);
      
      if (dateRange) {
        query = query.gte('date', dateRange.start).lte('date', dateRange.end);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching attendance by student:', error);
      return [];
    }
  },

  getByClass: async (classId: string, dateRange?: { start: string; end: string }): Promise<DatabaseAttendance[]> => {
    try {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          student:students(registration_number, user:users(full_name))
        `)
        .eq('class_id', classId);
      
      if (dateRange) {
        query = query.gte('date', dateRange.start).lte('date', dateRange.end);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching attendance by class:', error);
      return [];
    }
  },

  getByLesson: async (lessonId: string): Promise<DatabaseAttendance[]> => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          student:students(registration_number, user:users(full_name))
        `)
        .eq('lesson_id', lessonId)
        .order('student_id');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching attendance by lesson:', error);
      return [];
    }
  },

  saveAttendance: async (records: Partial<DatabaseAttendance>[]): Promise<DatabaseAttendance[]> => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .upsert(records, { 
          onConflict: 'student_id,class_id,date',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error saving attendance:', error);
      throw error;
    }
  },

  getAttendanceStats: async (studentId: string): Promise<{
    total: number;
    present: number;
    absent: number;
    rate: number;
  }> => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', studentId);
      
      if (error) throw error;
      
      const total = data?.length || 0;
      const present = data?.filter(a => a.status === 'presente').length || 0;
      const absent = data?.filter(a => a.status === 'falta' || a.status === 'ausente').length || 0;
      const rate = total > 0 ? (present / total) * 100 : 0;
      
      return { total, present, absent, rate };
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      return { total: 0, present: 0, absent: 0, rate: 0 };
    }
  }
};

export const lessonService = MOCK_MODE ? mockApi.mockLessonService : {
  getByClass: async (classId: string): Promise<DatabaseLesson[]> => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          teacher:users(full_name),
          subject:subjects(name)
        `)
        .eq('class_id', classId)
        .order('lesson_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching lessons by class:', error);
      return [];
    }
  },

  getByTeacher: async (teacherId: string): Promise<DatabaseLesson[]> => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          class:classes(name),
          subject:subjects(name)
        `)
        .eq('teacher_id', teacherId)
        .order('lesson_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching lessons by teacher:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<DatabaseLesson | null> => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          teacher:users(full_name),
          class:classes(name),
          subject:subjects(name)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      return null;
    }
  },

  createLesson: async (lessonData: Partial<DatabaseLesson>): Promise<DatabaseLesson | null> => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert(lessonData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  },

  updateLesson: async (id: string, updates: Partial<DatabaseLesson>): Promise<DatabaseLesson | null> => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  },

  deleteLesson: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      return false;
    }
  }
};

export const financialService = MOCK_MODE ? mockApi.mockFinancialService : {
  getTransactions: async (): Promise<FinancialTransaction[]> => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching financial transactions:', error);
      return [];
    }
  },

  getBySchool: async (schoolId: string): Promise<FinancialTransaction[]> => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions by school:', error);
      return [];
    }
  },

  getFinancialStats: async (schoolId?: string) => {
    try {
      let query = supabase
        .from('financial_transactions')
        .select('type, amount, status');
      
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }
      
      const { data: transactions, error } = await query;
      
      if (error) throw error;

      const stats = transactions?.reduce((acc, transaction) => {
        if (transaction.type === 'receita') {
          acc.totalRevenue += transaction.amount;
          if (transaction.status === 'pendente') {
            acc.pendingAmount += transaction.amount;
          } else if (transaction.status === 'atrasado') {
            acc.overdueAmount += transaction.amount;
          }
        } else if (transaction.type === 'despesa') {
          acc.totalExpenses += transaction.amount;
        }
        return acc;
      }, {
        totalRevenue: 0,
        totalExpenses: 0,
        pendingAmount: 0,
        overdueAmount: 0
      });

      return stats || {
        totalRevenue: 0,
        totalExpenses: 0,
        pendingAmount: 0,
        overdueAmount: 0
      };
    } catch (error) {
      console.error('Error fetching financial stats:', error);
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        pendingAmount: 0,
        overdueAmount: 0
      };
    }
  },

  createTransaction: async (transactionData: Partial<FinancialTransaction>): Promise<FinancialTransaction | null> => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert(transactionData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }
};

export const systemService = MOCK_MODE ? mockApi.mockSystemService : {
  getSettings: async (schoolId?: string): Promise<SystemSetting[]> => {
    try {
      let query = supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');
      
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching system settings:', error);
      return [];
    }
  },

  updateSetting: async (schoolId: string, key: string, value: string): Promise<SystemSetting | null> => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          school_id: schoolId,
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  }
};

export const dashboardService = MOCK_MODE ? mockApi.mockDashboardService : {
  getAdminStats: async (schoolId?: string) => {
    try {
      const schoolFilter = schoolId ? `.eq('school_id', '${schoolId}')` : '';
      
      const [usersResult, studentsResult, classesResult, financialStats] = await Promise.all([
        supabase.from('users').select('role', { count: 'exact' }),
        supabase.from('students').select('status', { count: 'exact' }),
        supabase.from('classes').select('active', { count: 'exact' }),
        financialService.getFinancialStats(schoolId)
      ]);

      const usersByRole = usersResult.data?.reduce((acc: any, user: any) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {}) || {};

      const activeStudents = studentsResult.data?.filter((s: any) => s.status === 'ativo').length || 0;
      const activeClasses = classesResult.data?.filter((c: any) => c.active).length || 0;

      return {
        totalStudents: activeStudents,
        totalTeachers: usersByRole.professor || 0,
        totalClasses: activeClasses,
        totalUsers: usersResult.count || 0,
        ...financialStats
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return {
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        totalUsers: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        pendingAmount: 0,
        overdueAmount: 0
      };
    }
  }
};

export const networkService = MOCK_MODE ? mockApi.mockNetworkService : {
  getAll: async (): Promise<Network[]> => {
    try {
      const { data, error } = await supabase
        .from('networks')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching networks:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Network | null> => {
    try {
      const { data, error } = await supabase
        .from('networks')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching network:', error);
      return null;
    }
  },

  create: async (networkData: {
    name: string;
    cnpj?: string;
    email: string;
    phone?: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  }): Promise<Network> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: networkData.adminEmail,
        password: networkData.adminPassword,
        options: {
          data: { full_name: networkData.adminName, role: 'network_admin' }
        }
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create auth user');

      const { data: network, error: networkError } = await supabase
        .from('networks')
        .insert({
          name: networkData.name,
          cnpj: networkData.cnpj,
          email: networkData.email,
          phone: networkData.phone,
          admin_user_id: authData.user.id
        })
        .select()
        .single();
      
      if (networkError) throw networkError;

      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          school_id: null,
          network_id: network.id,
          full_name: networkData.adminName,
          email: networkData.adminEmail,
          role: 'network_admin',
          active: true
        });
      
      if (userError) throw userError;

      return network;
    } catch (error) {
      console.error('Error creating network:', error);
      throw error;
    }
  },

  update: async (id: string, updates: {
    name?: string;
    cnpj?: string;
    email?: string;
    phone?: string;
    active?: boolean;
  }): Promise<Network | null> => {
    try {
      const { data, error } = await supabase
        .from('networks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating network:', error);
      throw error;
    }
  }
};

export { supabase };
