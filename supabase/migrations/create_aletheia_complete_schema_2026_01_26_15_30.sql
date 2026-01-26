-- ALETHEIA Sistema de Gestão Escolar - Schema Completo
-- Criado em: 2026-01-26

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Escolas (Multi-tenant)
CREATE TABLE IF NOT EXISTS schools_2026_01_26_15_30 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Usuários (integrada com Supabase Auth)
CREATE TABLE IF NOT EXISTS users_2026_01_26_15_30 (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools_2026_01_26_15_30(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'secretaria', 'professor', 'aluno')) NOT NULL,
    phone VARCHAR(20),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Turmas
CREATE TABLE IF NOT EXISTS classes_2026_01_26_15_30 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools_2026_01_26_15_30(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    grade_level VARCHAR(20) CHECK (grade_level IN ('infantil', 'fundamental_1', 'fundamental_2', 'medio', 'superior', 'cursinho')) NOT NULL,
    school_year INTEGER NOT NULL,
    shift VARCHAR(20) CHECK (shift IN ('matutino', 'vespertino', 'noturno')) NOT NULL,
    teacher_id UUID REFERENCES users_2026_01_26_15_30(id),
    max_students INTEGER DEFAULT 35,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Disciplinas
CREATE TABLE IF NOT EXISTS subjects_2026_01_26_15_30 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools_2026_01_26_15_30(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS students_2026_01_26_15_30 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users_2026_01_26_15_30(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes_2026_01_26_15_30(id),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    birth_date DATE,
    guardian_name VARCHAR(255) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,
    guardian_email VARCHAR(255),
    special_needs BOOLEAN DEFAULT false,
    special_needs_description TEXT,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) CHECK (status IN ('ativo', 'inativo', 'trancado', 'transferido')) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Professores
CREATE TABLE IF NOT EXISTS teachers_2026_01_26_15_30 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users_2026_01_26_15_30(id) ON DELETE CASCADE,
    specialization TEXT,
    hire_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(10,2),
    status VARCHAR(20) CHECK (status IN ('ativo', 'inativo', 'licenca')) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Matrículas (Aluno x Disciplina)
CREATE TABLE IF NOT EXISTS enrollments_2026_01_26_15_30 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students_2026_01_26_15_30(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects_2026_01_26_15_30(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes_2026_01_26_15_30(id) ON DELETE CASCADE,
    academic_year INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id, academic_year)
);

-- Tabela de Notas
CREATE TABLE IF NOT EXISTS grades_2026_01_26_15_30 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students_2026_01_26_15_30(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects_2026_01_26_15_30(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes_2026_01_26_15_30(id) ON DELETE CASCADE,
    academic_year INTEGER NOT NULL,
    quarter_1 DECIMAL(4,2),
    quarter_2 DECIMAL(4,2),
    quarter_3 DECIMAL(4,2),
    quarter_4 DECIMAL(4,2),
    final_average DECIMAL(4,2),
    status VARCHAR(20) CHECK (status IN ('cursando', 'aprovado', 'reprovado', 'recuperacao')) DEFAULT 'cursando',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id, academic_year)
);

-- Tabela de Aulas
CREATE TABLE IF NOT EXISTS lessons_2026_01_26_15_30 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES users_2026_01_26_15_30(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects_2026_01_26_15_30(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes_2026_01_26_15_30(id) ON DELETE CASCADE,
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

-- Tabela de Frequência
CREATE TABLE IF NOT EXISTS attendance_2026_01_26_15_30 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lessons_2026_01_26_15_30(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students_2026_01_26_15_30(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('presente', 'falta', 'atrasado', 'justificado')) NOT NULL,
    remarks TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lesson_id, student_id)
);

-- Tabela Financeira
CREATE TABLE IF NOT EXISTS financial_transactions_2026_01_26_15_30 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools_2026_01_26_15_30(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students_2026_01_26_15_30(id),
    type VARCHAR(20) CHECK (type IN ('receita', 'despesa')) NOT NULL,
    category VARCHAR(50) NOT NULL, -- mensalidade, material, salario, etc
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    payment_date DATE,
    status VARCHAR(20) CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')) DEFAULT 'pendente',
    payment_method VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Configurações do Sistema
CREATE TABLE IF NOT EXISTS system_settings_2026_01_26_15_30 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools_2026_01_26_15_30(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id, setting_key)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_school_role ON users_2026_01_26_15_30(school_id, role);
CREATE INDEX IF NOT EXISTS idx_students_class ON students_2026_01_26_15_30(class_id);
CREATE INDEX IF NOT EXISTS idx_grades_student_year ON grades_2026_01_26_15_30(student_id, academic_year);
CREATE INDEX IF NOT EXISTS idx_financial_school_status ON financial_transactions_2026_01_26_15_30(school_id, status);
CREATE INDEX IF NOT EXISTS idx_lessons_teacher_date ON lessons_2026_01_26_15_30(teacher_id, lesson_date);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools_2026_01_26_15_30 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users_2026_01_26_15_30 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students_2026_01_26_15_30 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers_2026_01_26_15_30 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades_2026_01_26_15_30 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons_2026_01_26_15_30 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_updated_at BEFORE UPDATE ON financial_transactions_2026_01_26_15_30 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();