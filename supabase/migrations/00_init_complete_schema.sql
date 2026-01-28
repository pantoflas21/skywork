-- ============================================================================
-- ALETHEIA - Sistema de Gestão Escolar
-- Migração Inicial Consolidada - Schema Completo
-- Versão: 1.0.0
-- Data: 2026-01-27
-- ============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABELA: networks (Redes de Ensino)
-- Gerencia múltiplas escolas sob uma rede
-- ============================================================================
CREATE TABLE IF NOT EXISTS networks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    admin_user_id UUID,
    cnpj VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: schools (Escolas)
-- Multi-tenant: cada escola é isolada das demais
-- ============================================================================
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    network_id UUID REFERENCES networks(id) ON DELETE SET NULL,
    admin_user_id UUID,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: users (Perfis de Usuários)
-- Integrada com Supabase Auth (auth.users)
-- Roles: super_admin, network_admin, admin, secretaria, professor, aluno
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('super_admin', 'network_admin', 'admin', 'secretaria', 'professor', 'aluno')) NOT NULL,
    phone VARCHAR(20),
    cpf VARCHAR(14),
    address TEXT,
    network_id UUID REFERENCES networks(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: teachers (Professores)
-- Informações específicas de professores
-- ============================================================================
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    specialization TEXT,
    bio TEXT,
    hire_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(10,2),
    status VARCHAR(20) CHECK (status IN ('ativo', 'inativo', 'licenca')) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: subjects (Disciplinas)
-- Disciplinas oferecidas pela escola
-- ============================================================================
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: classes (Turmas)
-- Turmas da escola (ex: 3º Ano A, 5ª Série B)
-- ============================================================================
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    grade_level VARCHAR(20) CHECK (grade_level IN ('infantil', 'fundamental_1', 'fundamental_2', 'medio', 'superior', 'cursinho')) NOT NULL,
    school_year INTEGER NOT NULL,
    shift VARCHAR(20) CHECK (shift IN ('matutino', 'vespertino', 'noturno')) NOT NULL,
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    max_students INTEGER DEFAULT 35,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: students (Alunos)
-- Informações de matrícula e dados dos alunos
-- ============================================================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    birth_date DATE,
    guardian_name VARCHAR(255) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,
    guardian_email VARCHAR(255),
    guardian_cpf VARCHAR(14),
    special_needs BOOLEAN DEFAULT false,
    special_needs_description TEXT,
    ai_assistant_notes TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) CHECK (status IN ('ativo', 'inativo', 'trancado', 'transferido')) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: lessons (Aulas)
-- Registro de aulas e planos de aula
-- ============================================================================
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    objectives TEXT,
    lesson_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    quarter INTEGER CHECK (quarter IN (1, 2, 3, 4)) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('planejada', 'ministrada', 'cancelada')) DEFAULT 'planejada',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: attendance (Frequência)
-- Registro de presença/falta dos alunos
-- ============================================================================
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('presente', 'ausente', 'falta', 'atrasado', 'justificado', 'justificada')),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, class_id, date)
);

-- ============================================================================
-- TABELA: grades (Notas)
-- Registro de avaliações e notas dos alunos
-- Modelo transacional: uma linha por avaliação
-- ============================================================================
CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    assessment_type VARCHAR(50) NOT NULL CHECK (assessment_type IN ('prova', 'trabalho', 'seminario', 'participacao', 'outro')),
    assessment_name VARCHAR(200) NOT NULL,
    grade DECIMAL(4, 2) NOT NULL CHECK (grade >= 0 AND grade <= 10),
    max_grade DECIMAL(4, 2) DEFAULT 10.00,
    weight DECIMAL(3, 2) DEFAULT 1.00,
    quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: enrollments (Matrículas em Disciplinas)
-- Relacionamento Aluno x Disciplina x Turma
-- ============================================================================
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    academic_year INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id, academic_year)
);

-- ============================================================================
-- TABELA: financial_transactions (Transações Financeiras)
-- Receitas e despesas da escola
-- ============================================================================
CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    type VARCHAR(20) CHECK (type IN ('receita', 'despesa')) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    payment_date DATE,
    status VARCHAR(20) CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')) DEFAULT 'pendente',
    payment_method VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: system_settings (Configurações do Sistema)
-- Configurações personalizadas por escola
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id, setting_key)
);

-- ============================================================================
-- ÍNDICES PARA OTIMIZAÇÃO DE PERFORMANCE
-- ============================================================================

-- Networks
CREATE INDEX IF NOT EXISTS idx_networks_admin ON networks(admin_user_id);

-- Schools
CREATE INDEX IF NOT EXISTS idx_schools_network ON schools(network_id);
CREATE INDEX IF NOT EXISTS idx_schools_admin ON schools(admin_user_id);

-- Users
CREATE INDEX IF NOT EXISTS idx_users_school_role ON users(school_id, role);
CREATE INDEX IF NOT EXISTS idx_users_network ON users(network_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Teachers
CREATE INDEX IF NOT EXISTS idx_teachers_school ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_user ON teachers(user_id);

-- Students
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_user ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_registration ON students(registration_number);

-- Classes
CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);

-- Subjects
CREATE INDEX IF NOT EXISTS idx_subjects_school ON subjects(school_id);

-- Lessons
CREATE INDEX IF NOT EXISTS idx_lessons_teacher_date ON lessons(teacher_id, lesson_date);
CREATE INDEX IF NOT EXISTS idx_lessons_class ON lessons(class_id);
CREATE INDEX IF NOT EXISTS idx_lessons_school ON lessons(school_id);

-- Attendance
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_teacher_id ON attendance(teacher_id);
CREATE INDEX IF NOT EXISTS idx_attendance_school_id ON attendance(school_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- Grades
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_class_id ON grades(class_id);
CREATE INDEX IF NOT EXISTS idx_grades_teacher_id ON grades(teacher_id);
CREATE INDEX IF NOT EXISTS idx_grades_school_id ON grades(school_id);
CREATE INDEX IF NOT EXISTS idx_grades_quarter ON grades(quarter);
CREATE INDEX IF NOT EXISTS idx_grades_subject ON grades(subject);

-- Financial
CREATE INDEX IF NOT EXISTS idx_financial_school_status ON financial_transactions(school_id, status);
CREATE INDEX IF NOT EXISTS idx_financial_student ON financial_transactions(student_id);

-- ============================================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA DE TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_networks_updated_at BEFORE UPDATE ON networks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_updated_at BEFORE UPDATE ON financial_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON TABLE networks IS 'Redes de ensino que gerenciam múltiplas escolas';
COMMENT ON TABLE schools IS 'Escolas individuais (multi-tenant)';
COMMENT ON TABLE users IS 'Perfis de usuários integrados com Supabase Auth';
COMMENT ON TABLE teachers IS 'Informações específicas de professores';
COMMENT ON TABLE students IS 'Informações de matrícula e dados dos alunos';
COMMENT ON TABLE classes IS 'Turmas da escola';
COMMENT ON TABLE subjects IS 'Disciplinas oferecidas';
COMMENT ON TABLE lessons IS 'Aulas e planos de aula';
COMMENT ON TABLE attendance IS 'Registro de frequência dos alunos';
COMMENT ON TABLE grades IS 'Notas e avaliações dos alunos';
COMMENT ON TABLE financial_transactions IS 'Receitas e despesas da escola';

-- ============================================================================
-- FIM DA MIGRAÇÃO INICIAL
-- ============================================================================
