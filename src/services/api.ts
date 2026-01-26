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

// Tipos para as tabelas do banco
interface DatabaseUser extends User {
  school_id: string;
  full_name: string;
}

interface DatabaseSchool extends School {
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
  user_id: string;
  class_id?: string;
  registration_number: string;
  birth_date?: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email?: string;
  special_needs: boolean;
  special_needs_description?: string;
  enrollment_date: string;
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

export const authService = {
  getCurrentSession: () => supabase.auth.getSession(),
  onAuthStateChange: (callback: any) => supabase.auth.onAuthStateChange(callback),
  signInWithPassword: (credentials: { email: string; password: string }) => 
    supabase.auth.signInWithPassword(credentials),
  signOut: () => supabase.auth.signOut(),
  signUp: (credentials: { email: string; password: string; options?: any }) =>
    supabase.auth.signUp(credentials),
};

export const userService = {
  getProfile: async (userId: string): Promise<DatabaseUser | null> => {
    const { data, error } = await supabase
      .from('users_2026_01_26_15_30')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    return data;
  },

  getAllUsers: async (): Promise<DatabaseUser[]> => {
    const { data, error } = await supabase
      .from('users_2026_01_26_15_30')
      .select('*')
      .order('full_name');
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return data || [];
  },

  createUser: async (userData: Partial<DatabaseUser>): Promise<DatabaseUser | null> => {
    const { data, error } = await supabase
      .from('users_2026_01_26_15_30')
      .insert(userData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      return null;
    }
    return data;
  },

  updateUser: async (userId: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser | null> => {
    const { data, error } = await supabase
      .from('users_2026_01_26_15_30')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      return null;
    }
    return data;
  },

  deleteUser: async (userId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('users_2026_01_26_15_30')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      return false;
    }
    return true;
  }
};

export const schoolService = {
  getById: async (id: string): Promise<DatabaseSchool | null> => {
    const { data, error } = await supabase
      .from('schools_2026_01_26_15_30')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching school:', error);
      return null;
    }
    return data;
  },

  updateSchool: async (id: string, updates: Partial<DatabaseSchool>): Promise<DatabaseSchool | null> => {
    const { data, error } = await supabase
      .from('schools_2026_01_26_15_30')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating school:', error);
      return null;
    }
    return data;
  }
};

export const classService = {
  getAll: async (): Promise<DatabaseClass[]> => {
    const { data, error } = await supabase
      .from('classes_2026_01_26_15_30')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
    return data || [];
  },

  getById: async (id: string): Promise<DatabaseClass | null> => {
    const { data, error } = await supabase
      .from('classes_2026_01_26_15_30')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching class:', error);
      return null;
    }
    return data;
  },

  createClass: async (classData: Partial<DatabaseClass>): Promise<DatabaseClass | null> => {
    const { data, error } = await supabase
      .from('classes_2026_01_26_15_30')
      .insert(classData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating class:', error);
      return null;
    }
    return data;
  },

  updateClass: async (id: string, updates: Partial<DatabaseClass>): Promise<DatabaseClass | null> => {
    const { data, error } = await supabase
      .from('classes_2026_01_26_15_30')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating class:', error);
      return null;
    }
    return data;
  }
};

export const subjectService = {
  getAll: async (): Promise<DatabaseSubject[]> => {
    const { data, error } = await supabase
      .from('subjects_2026_01_26_15_30')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching subjects:', error);
      return [];
    }
    return data || [];
  }
};

export const studentService = {
  getAll: async (): Promise<DatabaseStudent[]> => {
    const { data, error } = await supabase
      .from('students_2026_01_26_15_30')
      .select(`
        *,
        user:users_2026_01_26_15_30(full_name, email),
        class:classes_2026_01_26_15_30(name)
      `)
      .order('registration_number');
    
    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }
    return data || [];
  },

  createStudent: async (studentData: Partial<DatabaseStudent>): Promise<DatabaseStudent | null> => {
    const { data, error } = await supabase
      .from('students_2026_01_26_15_30')
      .insert(studentData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating student:', error);
      return null;
    }
    return data;
  }
};

export const financialService = {
  getTransactions: async (): Promise<FinancialTransaction[]> => {
    const { data, error } = await supabase
      .from('financial_transactions_2026_01_26_15_30')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching financial transactions:', error);
      return [];
    }
    return data || [];
  },

  getFinancialStats: async () => {
    // Buscar estatísticas financeiras
    const { data: transactions, error } = await supabase
      .from('financial_transactions_2026_01_26_15_30')
      .select('type, amount, status');
    
    if (error) {
      console.error('Error fetching financial stats:', error);
      return {
        totalRevenue: 0,
        totalExpenses: 0,
        pendingAmount: 0,
        overdueAmount: 0
      };
    }

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
  },

  createTransaction: async (transactionData: Partial<FinancialTransaction>): Promise<FinancialTransaction | null> => {
    const { data, error } = await supabase
      .from('financial_transactions_2026_01_26_15_30')
      .insert(transactionData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      return null;
    }
    return data;
  }
};

export const systemService = {
  getSettings: async (): Promise<SystemSetting[]> => {
    const { data, error } = await supabase
      .from('system_settings_2026_01_26_15_30')
      .select('*')
      .order('setting_key');
    
    if (error) {
      console.error('Error fetching system settings:', error);
      return [];
    }
    return data || [];
  },

  updateSetting: async (schoolId: string, key: string, value: string): Promise<SystemSetting | null> => {
    const { data, error } = await supabase
      .from('system_settings_2026_01_26_15_30')
      .upsert({
        school_id: schoolId,
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error updating setting:', error);
      return null;
    }
    return data;
  }
};

export const dashboardService = {
  getAdminStats: async () => {
    try {
      // Buscar estatísticas gerais
      const [usersResult, studentsResult, classesResult, financialStats] = await Promise.all([
        supabase.from('users_2026_01_26_15_30').select('role', { count: 'exact' }),
        supabase.from('students_2026_01_26_15_30').select('status', { count: 'exact' }),
        supabase.from('classes_2026_01_26_15_30').select('active', { count: 'exact' }),
        financialService.getFinancialStats()
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

// Manter compatibilidade com código existente
export { supabase };
export const gradeService = {
  getByClassAndSubject: async (classId: string, subjectId: string) => [],
  updateGrade: async (id: string, updates: Partial<Grade>) => ({} as Grade)
};

export const attendanceService = {
  getByLesson: async (lessonId: string) => [],
  saveAttendance: async (records: Omit<Attendance, 'id'>[]) => []
};

export const lessonService = {
  getByClass: async (classId: string) => [],
  createLesson: async (lessonData: Omit<Lesson, 'id'>) => ({} as Lesson)
};

export const teacherService = {
  getById: async (id: string) => ({} as Teacher)
};