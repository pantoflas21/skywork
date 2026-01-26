-- ALETHEIA Sistema de Gestão Escolar - Schema Completo
-- Multi-tenant SaaS para escolas

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Escolas (Multi-tenant)
CREATE TABLE public.schools_2026_01_25_20_33 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    logo_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Usuários (integrada com Supabase Auth)
CREATE TABLE public.users_2026_01_25_20_33 (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools_2026_01_25_20_33(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'secretaria', 'professor', 'aluno')),
    avatar_url TEXT,
    active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Turmas
CREATE TABLE public.classes_2026_01_25_20_33 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools_2026_01_25_20_33(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    grade_level VARCHAR(20) NOT NULL CHECK (grade_level IN ('infantil', 'fundamental_1', 'fundamental_2', 'medio', 'superior', 'cursinho')),
    school_year INTEGER NOT NULL,
    shift VARCHAR(20) NOT NULL CHECK (shift IN ('matutino', 'vespertino', 'noturno')),
    teacher_id UUID REFERENCES public.users_2026_01_25_20_33(id),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Disciplinas
CREATE TABLE public.subjects_2026_01_25_20_33 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools_2026_01_25_20_33(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id, code)
);

-- Tabela de Professores (dados específicos)
CREATE TABLE public.teachers_2026_01_25_20_33 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users_2026_01_25_20_33(id) ON DELETE CASCADE,
    specialization VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Alunos (dados específicos)
CREATE TABLE public.students_2026_01_25_20_33 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users_2026_01_25_20_33(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes_2026_01_25_20_33(id) ON DELETE CASCADE,
    registration_number VARCHAR(50) NOT NULL,
    birth_date DATE,
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    special_needs BOOLEAN DEFAULT false,
    special_needs_description TEXT,
    ai_assistant_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tabela de Matrículas (relaciona alunos com disciplinas)
CREATE TABLE public.enrollments_2026_01_25_20_33 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students_2026_01_25_20_33(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects_2026_01_25_20_33(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes_2026_01_25_20_33(id) ON DELETE CASCADE,
    academic_year INTEGER NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id, academic_year)
);

-- Tabela de Aulas
CREATE TABLE public.lessons_2026_01_25_20_33 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes_2026_01_25_20_33(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects_2026_01_25_20_33(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.users_2026_01_25_20_33(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    approved_by_secretary BOOLEAN DEFAULT false,
    secretary_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Frequência
CREATE TABLE public.attendance_2026_01_25_20_33 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons_2026_01_25_20_33(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students_2026_01_25_20_33(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('presente', 'ausente', 'atrasado', 'justificado')),
    remarks TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lesson_id, student_id)
);

-- Tabela de Notas
CREATE TABLE public.grades_2026_01_25_20_33 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students_2026_01_25_20_33(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects_2026_01_25_20_33(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes_2026_01_25_20_33(id) ON DELETE CASCADE,
    quarter_1 DECIMAL(4,2) CHECK (quarter_1 >= 0 AND quarter_1 <= 10),
    quarter_2 DECIMAL(4,2) CHECK (quarter_2 >= 0 AND quarter_2 <= 10),
    quarter_3 DECIMAL(4,2) CHECK (quarter_3 >= 0 AND quarter_3 <= 10),
    quarter_4 DECIMAL(4,2) CHECK (quarter_4 >= 0 AND quarter_4 <= 10),
    final_average DECIMAL(4,2) CHECK (final_average >= 0 AND final_average <= 10),
    status VARCHAR(20) DEFAULT 'cursando' CHECK (status IN ('aprovado', 'reprovado', 'recuperacao', 'cursando')),
    academic_year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id, academic_year)
);

-- Tabela de Mensalidades (Financeiro Básico)
CREATE TABLE public.tuition_payments_2026_01_25_20_33 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students_2026_01_25_20_33(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')),
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_users_school_id ON public.users_2026_01_25_20_33(school_id);
CREATE INDEX idx_users_role ON public.users_2026_01_25_20_33(role);
CREATE INDEX idx_classes_school_id ON public.classes_2026_01_25_20_33(school_id);
CREATE INDEX idx_subjects_school_id ON public.subjects_2026_01_25_20_33(school_id);
CREATE INDEX idx_students_class_id ON public.students_2026_01_25_20_33(class_id);
CREATE INDEX idx_enrollments_student_id ON public.enrollments_2026_01_25_20_33(student_id);
CREATE INDEX idx_grades_student_subject ON public.grades_2026_01_25_20_33(student_id, subject_id);
CREATE INDEX idx_attendance_lesson_student ON public.attendance_2026_01_25_20_33(lesson_id, student_id);
CREATE INDEX idx_lessons_class_subject ON public.lessons_2026_01_25_20_33(class_id, subject_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools_2026_01_25_20_33 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users_2026_01_25_20_33 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes_2026_01_25_20_33 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects_2026_01_25_20_33 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers_2026_01_25_20_33 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students_2026_01_25_20_33 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons_2026_01_25_20_33 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades_2026_01_25_20_33 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tuition_updated_at BEFORE UPDATE ON public.tuition_payments_2026_01_25_20_33 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();