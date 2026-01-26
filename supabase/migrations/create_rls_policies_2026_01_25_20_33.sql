-- ALETHEIA - Row Level Security (RLS) Policies
-- Garantir isolamento multi-tenant e controle de acesso por roles

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.schools_2026_01_25_20_33 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_2026_01_25_20_33 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes_2026_01_25_20_33 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects_2026_01_25_20_33 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers_2026_01_25_20_33 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students_2026_01_25_20_33 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments_2026_01_25_20_33 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons_2026_01_25_20_33 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_2026_01_25_20_33 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades_2026_01_25_20_33 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tuition_payments_2026_01_25_20_33 ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para obter school_id do usuário atual
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT school_id 
        FROM public.users_2026_01_25_20_33 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função auxiliar para obter role do usuário atual
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM public.users_2026_01_25_20_33 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLÍTICAS PARA SCHOOLS
CREATE POLICY "schools_select_policy" ON public.schools_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        id = get_user_school_id()
    );

CREATE POLICY "schools_admin_full_access" ON public.schools_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        get_user_role() = 'admin'
    );

-- POLÍTICAS PARA USERS
CREATE POLICY "users_select_same_school" ON public.users_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        school_id = get_user_school_id()
    );

CREATE POLICY "users_own_profile" ON public.users_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        id = auth.uid()
    );

CREATE POLICY "users_admin_manage" ON public.users_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        get_user_role() IN ('admin', 'secretaria') AND
        school_id = get_user_school_id()
    );

-- POLÍTICAS PARA CLASSES
CREATE POLICY "classes_same_school" ON public.classes_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        school_id = get_user_school_id()
    );

CREATE POLICY "classes_admin_secretaria_manage" ON public.classes_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        get_user_role() IN ('admin', 'secretaria') AND
        school_id = get_user_school_id()
    );

-- POLÍTICAS PARA SUBJECTS
CREATE POLICY "subjects_same_school" ON public.subjects_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        school_id = get_user_school_id()
    );

CREATE POLICY "subjects_admin_secretaria_manage" ON public.subjects_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        get_user_role() IN ('admin', 'secretaria') AND
        school_id = get_user_school_id()
    );

-- POLÍTICAS PARA TEACHERS
CREATE POLICY "teachers_same_school" ON public.teachers_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.users_2026_01_25_20_33 u 
            WHERE u.id = user_id AND u.school_id = get_user_school_id()
        )
    );

CREATE POLICY "teachers_own_profile" ON public.teachers_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        user_id = auth.uid()
    );

CREATE POLICY "teachers_admin_manage" ON public.teachers_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        get_user_role() IN ('admin', 'secretaria') AND
        EXISTS (
            SELECT 1 FROM public.users_2026_01_25_20_33 u 
            WHERE u.id = user_id AND u.school_id = get_user_school_id()
        )
    );

-- POLÍTICAS PARA STUDENTS
CREATE POLICY "students_same_school" ON public.students_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.users_2026_01_25_20_33 u 
            WHERE u.id = user_id AND u.school_id = get_user_school_id()
        )
    );

CREATE POLICY "students_own_profile" ON public.students_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        user_id = auth.uid()
    );

CREATE POLICY "students_admin_secretaria_manage" ON public.students_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        get_user_role() IN ('admin', 'secretaria') AND
        EXISTS (
            SELECT 1 FROM public.users_2026_01_25_20_33 u 
            WHERE u.id = user_id AND u.school_id = get_user_school_id()
        )
    );

-- POLÍTICAS PARA ENROLLMENTS
CREATE POLICY "enrollments_same_school" ON public.enrollments_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.students_2026_01_25_20_33 s
            JOIN public.users_2026_01_25_20_33 u ON s.user_id = u.id
            WHERE s.id = student_id AND u.school_id = get_user_school_id()
        )
    );

CREATE POLICY "enrollments_admin_secretaria_manage" ON public.enrollments_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        get_user_role() IN ('admin', 'secretaria') AND
        EXISTS (
            SELECT 1 FROM public.students_2026_01_25_20_33 s
            JOIN public.users_2026_01_25_20_33 u ON s.user_id = u.id
            WHERE s.id = student_id AND u.school_id = get_user_school_id()
        )
    );

-- POLÍTICAS PARA LESSONS
CREATE POLICY "lessons_same_school" ON public.lessons_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.classes_2026_01_25_20_33 c
            WHERE c.id = class_id AND c.school_id = get_user_school_id()
        )
    );

CREATE POLICY "lessons_teacher_manage" ON public.lessons_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        (teacher_id = auth.uid() OR get_user_role() IN ('admin', 'secretaria')) AND
        EXISTS (
            SELECT 1 FROM public.classes_2026_01_25_20_33 c
            WHERE c.id = class_id AND c.school_id = get_user_school_id()
        )
    );

-- POLÍTICAS PARA ATTENDANCE
CREATE POLICY "attendance_same_school" ON public.attendance_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.lessons_2026_01_25_20_33 l
            JOIN public.classes_2026_01_25_20_33 c ON l.class_id = c.id
            WHERE l.id = lesson_id AND c.school_id = get_user_school_id()
        )
    );

CREATE POLICY "attendance_teacher_manage" ON public.attendance_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        (EXISTS (
            SELECT 1 FROM public.lessons_2026_01_25_20_33 l
            WHERE l.id = lesson_id AND l.teacher_id = auth.uid()
        ) OR get_user_role() IN ('admin', 'secretaria')) AND
        EXISTS (
            SELECT 1 FROM public.lessons_2026_01_25_20_33 l
            JOIN public.classes_2026_01_25_20_33 c ON l.class_id = c.id
            WHERE l.id = lesson_id AND c.school_id = get_user_school_id()
        )
    );

CREATE POLICY "attendance_student_own" ON public.attendance_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.students_2026_01_25_20_33 s
            WHERE s.id = student_id AND s.user_id = auth.uid()
        )
    );

-- POLÍTICAS PARA GRADES
CREATE POLICY "grades_same_school" ON public.grades_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.students_2026_01_25_20_33 s
            JOIN public.users_2026_01_25_20_33 u ON s.user_id = u.id
            WHERE s.id = student_id AND u.school_id = get_user_school_id()
        )
    );

CREATE POLICY "grades_teacher_manage" ON public.grades_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        (get_user_role() = 'professor' OR get_user_role() IN ('admin', 'secretaria')) AND
        EXISTS (
            SELECT 1 FROM public.students_2026_01_25_20_33 s
            JOIN public.users_2026_01_25_20_33 u ON s.user_id = u.id
            WHERE s.id = student_id AND u.school_id = get_user_school_id()
        )
    );

CREATE POLICY "grades_student_own" ON public.grades_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.students_2026_01_25_20_33 s
            WHERE s.id = student_id AND s.user_id = auth.uid()
        )
    );

-- POLÍTICAS PARA TUITION_PAYMENTS
CREATE POLICY "tuition_same_school" ON public.tuition_payments_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.students_2026_01_25_20_33 s
            JOIN public.users_2026_01_25_20_33 u ON s.user_id = u.id
            WHERE s.id = student_id AND u.school_id = get_user_school_id()
        )
    );

CREATE POLICY "tuition_admin_manage" ON public.tuition_payments_2026_01_25_20_33
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        get_user_role() IN ('admin', 'secretaria') AND
        EXISTS (
            SELECT 1 FROM public.students_2026_01_25_20_33 s
            JOIN public.users_2026_01_25_20_33 u ON s.user_id = u.id
            WHERE s.id = student_id AND u.school_id = get_user_school_id()
        )
    );

CREATE POLICY "tuition_student_own" ON public.tuition_payments_2026_01_25_20_33
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.students_2026_01_25_20_33 s
            WHERE s.id = student_id AND s.user_id = auth.uid()
        )
    );