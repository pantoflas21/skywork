import { 
  mockUsers, 
  mockSchools, 
  mockClasses, 
  mockStudents, 
  mockSubjects,
  mockGrades,
  mockAttendance,
  mockLessons,
  mockFinancialTransactions,
  mockNetworks,
  MOCK_MODE
} from '@/data/mockData';
import type { UserRole } from '@/types';

let currentUser: any = null;

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  getCurrentSession: async () => {
    await delay();
    if (currentUser) {
      return {
        data: {
          session: {
            user: currentUser,
            access_token: 'mock-token'
          }
        },
        error: null
      };
    }
    return { data: { session: null }, error: null };
  },

  onAuthStateChange: (callback: any) => {
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  },

  signInWithPassword: async (credentials: { email: string; password: string }) => {
    await delay();
    const user = mockUsers[credentials.email as keyof typeof mockUsers];
    
    if (user && user.password === credentials.password) {
      currentUser = { ...user };
      delete currentUser.password;
      return {
        data: {
          user: currentUser,
          session: { user: currentUser, access_token: 'mock-token' }
        },
        error: null
      };
    }
    
    return {
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' }
    };
  },

  signOut: async () => {
    await delay();
    currentUser = null;
    return { error: null };
  },

  signUp: async (credentials: any) => {
    await delay();
    return {
      data: {
        user: { id: 'new-user-' + Date.now(), email: credentials.email },
        session: null
      },
      error: null
    };
  },

  resetPasswordForEmail: async (email: string) => {
    await delay();
    return { data: {}, error: null };
  },

  updatePassword: async (password: string) => {
    await delay();
    return { data: { user: currentUser }, error: null };
  }
};

export const mockUserService = {
  getProfile: async (userId: string) => {
    await delay();
    const user = Object.values(mockUsers).find(u => u.id === userId);
    if (user) {
      const { password, ...userData } = user;
      return {
        ...userData,
        full_name: userData.fullName,
        school_id: userData.schoolId
      };
    }
    return null;
  },

  getAllUsers: async () => {
    await delay();
    return Object.values(mockUsers).map(u => {
      const { password, ...userData } = u;
      return {
        ...userData,
        full_name: userData.fullName,
        school_id: userData.schoolId
      };
    });
  },

  getUsersBySchool: async (schoolId: string) => {
    await delay();
    return Object.values(mockUsers)
      .filter(u => u.schoolId === schoolId)
      .map(u => {
        const { password, ...userData } = u;
        return {
          ...userData,
          full_name: userData.fullName,
          school_id: userData.schoolId
        };
      });
  },

  createUser: async (userData: any) => {
    await delay();
    return { ...userData, id: 'new-' + Date.now() };
  },

  updateUser: async (userId: string, updates: any) => {
    await delay();
    return { ...updates, id: userId };
  },

  deleteUser: async (userId: string) => {
    await delay();
    return true;
  }
};

export const mockSchoolService = {
  getAll: async () => {
    await delay();
    return mockSchools;
  },

  getById: async (id: string) => {
    await delay();
    return mockSchools.find(s => s.id === id) || null;
  },

  getByNetwork: async (networkId: string) => {
    await delay();
    return mockSchools.filter(s => s.networkId === networkId);
  },

  createSchool: async (schoolData: any) => {
    await delay();
    return { ...schoolData, id: 'school-' + Date.now() };
  },

  updateSchool: async (id: string, updates: any) => {
    await delay();
    return { ...updates, id };
  }
};

export const mockClassService = {
  getAll: async () => {
    await delay();
    return mockClasses;
  },

  getBySchool: async (schoolId: string) => {
    await delay();
    return mockClasses.filter(c => c.schoolId === schoolId);
  },

  getById: async (id: string) => {
    await delay();
    return mockClasses.find(c => c.id === id) || null;
  },

  getByTeacher: async (teacherId: string) => {
    await delay();
    return mockClasses.filter(c => c.teacherId === teacherId);
  },

  createClass: async (classData: any) => {
    await delay();
    return { ...classData, id: 'class-' + Date.now() };
  },

  updateClass: async (id: string, updates: any) => {
    await delay();
    return { ...updates, id };
  }
};

export const mockStudentService = {
  getAll: async () => {
    await delay();
    return mockStudents;
  },

  getBySchool: async (schoolId: string) => {
    await delay();
    return mockStudents.filter(s => s.schoolId === schoolId);
  },

  getByClass: async (classId: string) => {
    await delay();
    return mockStudents.filter(s => s.classId === classId);
  },

  getById: async (id: string) => {
    await delay();
    return mockStudents.find(s => s.id === id) || null;
  },

  createStudent: async (studentData: any) => {
    await delay();
    return { ...studentData, id: 'student-' + Date.now() };
  },

  updateStudent: async (id: string, updates: any) => {
    await delay();
    return { ...updates, id };
  }
};

export const mockSubjectService = {
  getAll: async () => {
    await delay();
    return mockSubjects;
  },

  getBySchool: async (schoolId: string) => {
    await delay();
    return mockSubjects.filter(s => s.schoolId === schoolId);
  },

  createSubject: async (subjectData: any) => {
    await delay();
    return { ...subjectData, id: 'subject-' + Date.now() };
  }
};

export const mockGradeService = {
  getByStudent: async (studentId: string) => {
    await delay();
    return mockGrades.filter(g => g.studentId === studentId);
  },

  getByClass: async (classId: string) => {
    await delay();
    return mockGrades.filter(g => g.classId === classId);
  },

  getByClassAndSubject: async (classId: string, subject: string) => {
    await delay();
    return mockGrades.filter(g => g.classId === classId && g.subject === subject);
  },

  getBulkByClass: async (classId: string) => {
    await delay();
    return mockGrades.filter(g => g.classId === classId);
  },

  createGrade: async (gradeData: any) => {
    await delay();
    return { ...gradeData, id: 'grade-' + Date.now() };
  },

  updateGrade: async (id: string, updates: any) => {
    await delay();
    return { ...updates, id };
  },

  deleteGrade: async (id: string) => {
    await delay();
    return true;
  }
};

export const mockAttendanceService = {
  getByStudent: async (studentId: string, dateRange?: any) => {
    await delay();
    return mockAttendance.filter(a => a.studentId === studentId);
  },

  getByClass: async (classId: string, dateRange?: any) => {
    await delay();
    return mockAttendance.filter(a => a.classId === classId);
  },

  getByLesson: async (lessonId: string) => {
    await delay();
    return mockAttendance;
  },

  saveAttendance: async (records: any[]) => {
    await delay();
    return records.map(r => ({ ...r, id: 'att-' + Date.now() }));
  },

  getAttendanceStats: async (studentId: string) => {
    await delay();
    const studentAttendance = mockAttendance.filter(a => a.studentId === studentId);
    const total = studentAttendance.length;
    const present = studentAttendance.filter(a => a.status === 'presente').length;
    const absent = studentAttendance.filter(a => a.status === 'falta').length;
    return {
      total,
      present,
      absent,
      rate: total > 0 ? (present / total) * 100 : 0
    };
  }
};

export const mockLessonService = {
  getByClass: async (classId: string) => {
    await delay();
    return mockLessons.filter(l => l.classId === classId);
  },

  getByTeacher: async (teacherId: string) => {
    await delay();
    return mockLessons.filter(l => l.teacherId === teacherId);
  },

  getById: async (id: string) => {
    await delay();
    return mockLessons.find(l => l.id === id) || null;
  },

  createLesson: async (lessonData: any) => {
    await delay();
    return { ...lessonData, id: 'lesson-' + Date.now() };
  },

  updateLesson: async (id: string, updates: any) => {
    await delay();
    return { ...updates, id };
  },

  deleteLesson: async (id: string) => {
    await delay();
    return true;
  }
};

export const mockFinancialService = {
  getTransactions: async () => {
    await delay();
    return mockFinancialTransactions;
  },

  getBySchool: async (schoolId: string) => {
    await delay();
    return mockFinancialTransactions.filter(t => t.schoolId === schoolId);
  },

  getFinancialStats: async (schoolId?: string) => {
    await delay();
    const transactions = schoolId 
      ? mockFinancialTransactions.filter(t => t.schoolId === schoolId)
      : mockFinancialTransactions;
    
    const totalRevenue = transactions
      .filter(t => t.type === 'receita' && t.status === 'pago')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'despesa' && t.status === 'pago')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const overdueAmount = transactions
      .filter(t => t.type === 'receita' && t.status === 'atrasado')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalRevenue,
      totalExpenses,
      pendingAmount: 0,
      overdueAmount
    };
  },

  createTransaction: async (transactionData: any) => {
    await delay();
    return { ...transactionData, id: 'fin-' + Date.now() };
  }
};

export const mockNetworkService = {
  getAll: async () => {
    await delay();
    return mockNetworks;
  },

  getById: async (id: string) => {
    await delay();
    return mockNetworks.find(n => n.id === id) || null;
  },

  create: async (networkData: any) => {
    await delay();
    return { ...networkData, id: 'network-' + Date.now() };
  },

  update: async (id: string, updates: any) => {
    await delay();
    return { ...updates, id };
  }
};

export const mockDashboardService = {
  getAdminStats: async (schoolId?: string) => {
    await delay();
    return {
      totalStudents: mockStudents.filter(s => s.status === 'ativo').length,
      totalTeachers: Object.values(mockUsers).filter(u => u.role === 'professor').length,
      totalClasses: mockClasses.filter(c => c.active).length,
      totalUsers: Object.values(mockUsers).length,
      totalRevenue: 46250.0,
      totalExpenses: 45000.0,
      pendingAmount: 0,
      overdueAmount: 1250.0
    };
  }
};

export const mockTeacherService = {
  getById: async (id: string) => {
    await delay();
    const user = Object.values(mockUsers).find(u => u.id === id && u.role === 'professor');
    if (user) {
      return {
        id,
        user_id: user.id,
        school_id: user.schoolId,
        specialization: 'Matemática',
        status: 'ativo'
      };
    }
    return null;
  },

  getByUserId: async (userId: string) => {
    await delay();
    const user = Object.values(mockUsers).find(u => u.id === userId && u.role === 'professor');
    if (user) {
      return {
        id: 'teacher-' + userId,
        user_id: user.id,
        school_id: user.schoolId,
        specialization: 'Matemática',
        status: 'ativo'
      };
    }
    return null;
  },

  getBySchool: async (schoolId: string) => {
    await delay();
    return Object.values(mockUsers)
      .filter(u => u.role === 'professor' && u.schoolId === schoolId)
      .map(u => ({
        id: 'teacher-' + u.id,
        user_id: u.id,
        school_id: u.schoolId,
        specialization: 'Matemática',
        status: 'ativo'
      }));
  },

  create: async (teacherData: any) => {
    await delay();
    return { ...teacherData, id: 'teacher-' + Date.now() };
  },

  update: async (id: string, updates: any) => {
    await delay();
    return { ...updates, id };
  }
};

export const mockSystemService = {
  getSettings: async (schoolId?: string) => {
    await delay();
    return [
      { id: '1', school_id: schoolId || 'school-001', setting_key: 'school_name', setting_value: 'Escola ALETHEIA', updated_at: new Date().toISOString() },
      { id: '2', school_id: schoolId || 'school-001', setting_key: 'academic_year', setting_value: '2024', updated_at: new Date().toISOString() },
      { id: '3', school_id: schoolId || 'school-001', setting_key: 'passing_grade', setting_value: '7.0', updated_at: new Date().toISOString() }
    ];
  },

  updateSetting: async (schoolId: string, key: string, value: string) => {
    await delay();
    return {
      id: 'setting-' + Date.now(),
      school_id: schoolId,
      setting_key: key,
      setting_value: value,
      updated_at: new Date().toISOString()
    };
  }
};
