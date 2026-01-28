export const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

export const mockUsers = {
  'superadmin@aletheia.edu': {
    id: 'super-admin-001',
    email: 'superadmin@aletheia.edu',
    password: 'Super@123',
    fullName: 'Super Admin',
    role: 'super_admin',
    active: true,
    schoolId: null,
    phone: '(11) 99999-0000'
  },
  'networkadmin@aletheia.edu': {
    id: 'network-admin-001',
    email: 'networkadmin@aletheia.edu',
    password: 'Network@123',
    fullName: 'Administrador de Rede',
    role: 'network_admin',
    active: true,
    schoolId: null,
    networkId: 'network-001',
    phone: '(11) 99999-1111'
  },
  'admin@aletheia.edu': {
    id: 'admin-001',
    email: 'admin@aletheia.edu',
    password: 'Admin@123',
    fullName: 'Carlos Administrador',
    role: 'admin',
    active: true,
    schoolId: 'school-001',
    phone: '(11) 99999-2222'
  },
  'secretaria@aletheia.edu': {
    id: 'secretary-001',
    email: 'secretaria@aletheia.edu',
    password: 'Secret@123',
    fullName: 'Maria Santos',
    role: 'secretaria',
    active: true,
    schoolId: 'school-001',
    phone: '(11) 99999-3333'
  },
  'professor1@aletheia.edu': {
    id: 'teacher-001',
    email: 'professor1@aletheia.edu',
    password: 'Prof@123',
    fullName: 'João Silva',
    role: 'professor',
    active: true,
    schoolId: 'school-001',
    phone: '(11) 99999-4444'
  },
  'professor2@aletheia.edu': {
    id: 'teacher-002',
    email: 'professor2@aletheia.edu',
    password: 'Prof@123',
    fullName: 'Ana Costa',
    role: 'professor',
    active: true,
    schoolId: 'school-001',
    phone: '(11) 99999-5555'
  },
  'aluno1@aletheia.edu': {
    id: 'student-001',
    email: 'aluno1@aletheia.edu',
    password: 'Aluno@123',
    fullName: 'Pedro Oliveira',
    role: 'aluno',
    active: true,
    schoolId: 'school-001',
    phone: '(11) 99999-6666'
  },
  'aluno2@aletheia.edu': {
    id: 'student-002',
    email: 'aluno2@aletheia.edu',
    password: 'Aluno@123',
    fullName: 'Julia Santos',
    role: 'aluno',
    active: true,
    schoolId: 'school-001',
    phone: '(11) 99999-7777'
  }
};

export const mockSchools = [
  {
    id: 'school-001',
    name: 'Escola ALETHEIA Centro',
    cnpj: '12.345.678/0001-99',
    email: 'contato@aletheia.edu.br',
    phone: '(11) 3333-4444',
    address: 'Rua das Flores, 123 - Centro',
    city: 'São Paulo',
    state: 'SP',
    active: true,
    networkId: 'network-001'
  },
  {
    id: 'school-002',
    name: 'Escola ALETHEIA Sul',
    cnpj: '12.345.678/0002-88',
    email: 'sul@aletheia.edu.br',
    phone: '(11) 3333-5555',
    address: 'Av. Principal, 456 - Zona Sul',
    city: 'São Paulo',
    state: 'SP',
    active: true,
    networkId: 'network-001'
  }
];

export const mockClasses = [
  {
    id: 'class-001',
    name: '3º Ano A',
    gradeLevel: 'Ensino Médio',
    schoolYear: 2024,
    shift: 'Matutino',
    teacherId: 'teacher-001',
    maxStudents: 35,
    schoolId: 'school-001',
    active: true
  },
  {
    id: 'class-002',
    name: '5º Ano B',
    gradeLevel: 'Ensino Fundamental',
    schoolYear: 2024,
    shift: 'Vespertino',
    teacherId: 'teacher-002',
    maxStudents: 30,
    schoolId: 'school-001',
    active: true
  },
  {
    id: 'class-003',
    name: 'Maternal II',
    gradeLevel: 'Educação Infantil',
    schoolYear: 2024,
    shift: 'Matutino',
    teacherId: 'teacher-002',
    maxStudents: 20,
    schoolId: 'school-001',
    active: true
  }
];

export const mockStudents = [
  {
    id: 'student-001',
    userId: 'student-001',
    name: 'Pedro Oliveira',
    registrationNumber: '2024001',
    classId: 'class-001',
    gradeLevel: 'Ensino Médio',
    guardianName: 'Roberto Oliveira',
    guardianPhone: '(11) 98888-1111',
    guardianEmail: 'roberto@email.com',
    birthDate: '2008-05-15',
    enrollmentDate: '2024-02-01',
    status: 'ativo',
    schoolId: 'school-001',
    specialNeeds: false
  },
  {
    id: 'student-002',
    userId: 'student-002',
    name: 'Julia Santos',
    registrationNumber: '2024002',
    classId: 'class-002',
    gradeLevel: 'Ensino Fundamental',
    guardianName: 'Marcia Santos',
    guardianPhone: '(11) 98888-2222',
    guardianEmail: 'marcia@email.com',
    birthDate: '2013-08-20',
    enrollmentDate: '2024-02-01',
    status: 'ativo',
    schoolId: 'school-001',
    specialNeeds: false
  },
  {
    id: 'student-003',
    name: 'Carlos Mendes',
    registrationNumber: '2024003',
    classId: 'class-001',
    gradeLevel: 'Ensino Médio',
    guardianName: 'Ana Mendes',
    guardianPhone: '(11) 98888-3333',
    guardianEmail: 'ana@email.com',
    birthDate: '2008-03-10',
    enrollmentDate: '2024-02-01',
    status: 'ativo',
    schoolId: 'school-001',
    specialNeeds: false
  },
  {
    id: 'student-004',
    name: 'Fernanda Lima',
    registrationNumber: '2024004',
    classId: 'class-003',
    gradeLevel: 'Educação Infantil',
    guardianName: 'Paulo Lima',
    guardianPhone: '(11) 98888-4444',
    guardianEmail: 'paulo@email.com',
    birthDate: '2021-11-05',
    enrollmentDate: '2024-02-01',
    status: 'ativo',
    schoolId: 'school-001',
    specialNeeds: false
  }
];

export const mockSubjects = [
  { id: 'subject-001', name: 'Matemática', gradeLevel: 'Ensino Médio', workload: 5, schoolId: 'school-001' },
  { id: 'subject-002', name: 'Português', gradeLevel: 'Ensino Médio', workload: 5, schoolId: 'school-001' },
  { id: 'subject-003', name: 'História', gradeLevel: 'Ensino Médio', workload: 3, schoolId: 'school-001' },
  { id: 'subject-004', name: 'Geografia', gradeLevel: 'Ensino Médio', workload: 3, schoolId: 'school-001' },
  { id: 'subject-005', name: 'Física', gradeLevel: 'Ensino Médio', workload: 4, schoolId: 'school-001' },
  { id: 'subject-006', name: 'Química', gradeLevel: 'Ensino Médio', workload: 4, schoolId: 'school-001' },
  { id: 'subject-007', name: 'Biologia', gradeLevel: 'Ensino Médio', workload: 4, schoolId: 'school-001' }
];

export const mockGrades = [
  {
    id: 'grade-001',
    studentId: 'student-001',
    classId: 'class-001',
    teacherId: 'teacher-001',
    subject: 'Matemática',
    assessmentType: 'Prova',
    assessmentName: 'Prova Bimestral',
    grade: 8.5,
    maxGrade: 10,
    weight: 3,
    quarter: 1,
    date: '2024-03-15',
    schoolId: 'school-001'
  },
  {
    id: 'grade-002',
    studentId: 'student-001',
    classId: 'class-001',
    teacherId: 'teacher-001',
    subject: 'Português',
    assessmentType: 'Trabalho',
    assessmentName: 'Redação',
    grade: 9.0,
    maxGrade: 10,
    weight: 2,
    quarter: 1,
    date: '2024-03-20',
    schoolId: 'school-001'
  },
  {
    id: 'grade-003',
    studentId: 'student-002',
    classId: 'class-002',
    teacherId: 'teacher-002',
    subject: 'Matemática',
    assessmentType: 'Prova',
    assessmentName: 'Prova Bimestral',
    grade: 7.5,
    maxGrade: 10,
    weight: 3,
    quarter: 1,
    date: '2024-03-15',
    schoolId: 'school-001'
  }
];

export const mockAttendance = [
  {
    id: 'att-001',
    studentId: 'student-001',
    classId: 'class-001',
    teacherId: 'teacher-001',
    date: '2024-01-26',
    status: 'presente',
    schoolId: 'school-001'
  },
  {
    id: 'att-002',
    studentId: 'student-002',
    classId: 'class-002',
    teacherId: 'teacher-002',
    date: '2024-01-26',
    status: 'presente',
    schoolId: 'school-001'
  },
  {
    id: 'att-003',
    studentId: 'student-003',
    classId: 'class-001',
    teacherId: 'teacher-001',
    date: '2024-01-26',
    status: 'falta',
    schoolId: 'school-001'
  }
];

export const mockLessons = [
  {
    id: 'lesson-001',
    teacherId: 'teacher-001',
    subjectId: 'subject-001',
    classId: 'class-001',
    title: 'Equações de 2º Grau',
    content: 'Estudo das fórmulas e aplicações práticas',
    objectives: 'Compreender e resolver equações quadráticas',
    lessonDate: '2024-01-26',
    startTime: '08:00',
    endTime: '09:40',
    quarter: 1,
    status: 'enviado',
    schoolId: 'school-001'
  },
  {
    id: 'lesson-002',
    teacherId: 'teacher-002',
    subjectId: 'subject-002',
    classId: 'class-002',
    title: 'Análise Sintática',
    content: 'Sujeito, predicado e complementos',
    objectives: 'Identificar elementos sintáticos nas orações',
    lessonDate: '2024-01-26',
    startTime: '10:00',
    endTime: '11:40',
    quarter: 1,
    status: 'enviado',
    schoolId: 'school-001'
  }
];

export const mockFinancialTransactions = [
  {
    id: 'fin-001',
    schoolId: 'school-001',
    studentId: 'student-001',
    type: 'receita',
    category: 'Mensalidade',
    description: 'Mensalidade Janeiro 2024',
    amount: 1250.0,
    dueDate: '2024-01-10',
    paymentDate: '2024-01-08',
    status: 'pago',
    paymentMethod: 'PIX'
  },
  {
    id: 'fin-002',
    schoolId: 'school-001',
    type: 'despesa',
    category: 'Folha de Pagamento',
    description: 'Salário Professores Janeiro',
    amount: 45000.0,
    dueDate: '2024-01-05',
    paymentDate: '2024-01-05',
    status: 'pago',
    paymentMethod: 'Transferência'
  },
  {
    id: 'fin-003',
    schoolId: 'school-001',
    studentId: 'student-003',
    type: 'receita',
    category: 'Mensalidade',
    description: 'Mensalidade Janeiro 2024',
    amount: 1250.0,
    dueDate: '2024-01-10',
    status: 'atrasado'
  }
];

export const mockNetworks = [
  {
    id: 'network-001',
    name: 'Rede ALETHEIA',
    cnpj: '11.222.333/0001-44',
    email: 'rede@aletheia.edu.br',
    phone: '(11) 3000-0000',
    active: true,
    adminUserId: 'network-admin-001'
  }
];
