-- ALETHEIA - Políticas de Segurança RLS (Row Level Security)
-- Criado em: 2026-01-26

-- Habilitar RLS em todas as tabelas
ALTER TABLE schools_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE students_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings_2026_01_26_15_30 ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para obter o school_id do usuário atual
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT school_id 
        FROM users_2026_01_26_15_30 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função auxiliar para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = 'admin' 
        FROM users_2026_01_26_15_30 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para SCHOOLS
CREATE POLICY "Users can view their own school" ON schools_2026_01_26_15_30
    FOR SELECT USING (id = get_user_school_id());

CREATE POLICY "Admins can update their school" ON schools_2026_01_26_15_30
    FOR UPDATE USING (id = get_user_school_id() AND is_admin());

-- Políticas para USERS
CREATE POLICY "Users can view users from same school" ON users_2026_01_26_15_30
    FOR SELECT USING (school_id = get_user_school_id());

CREATE POLICY "Users can view their own profile" ON users_2026_01_26_15_30
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users_2026_01_26_15_30
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can insert users in their school" ON users_2026_01_26_15_30
    FOR INSERT WITH CHECK (school_id = get_user_school_id() AND is_admin());

CREATE POLICY "Admins can update users in their school" ON users_2026_01_26_15_30
    FOR UPDATE USING (school_id = get_user_school_id() AND is_admin());

-- Políticas para CLASSES
CREATE POLICY "Users can view classes from same school" ON classes_2026_01_26_15_30
    FOR SELECT USING (school_id = get_user_school_id());

CREATE POLICY "Admins and secretaria can manage classes" ON classes_2026_01_26_15_30
    FOR ALL USING (
        school_id = get_user_school_id() AND 
        (is_admin() OR (SELECT role FROM users_2026_01_26_15_30 WHERE id = auth.uid()) = 'secretaria')
    );

-- Políticas para SUBJECTS
CREATE POLICY "Users can view subjects from same school" ON subjects_2026_01_26_15_30
    FOR SELECT USING (school_id = get_user_school_id());

CREATE POLICY "Admins can manage subjects" ON subjects_2026_01_26_15_30
    FOR ALL USING (school_id = get_user_school_id() AND is_admin());

-- Políticas para STUDENTS
CREATE POLICY "Users can view students from same school" ON students_2026_01_26_15_30
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users_2026_01_26_15_30 u
            JOIN classes_2026_01_26_15_30 c ON students_2026_01_26_15_30.class_id = c.id
            WHERE u.id = auth.uid() AND c.school_id = u.school_id
        )
    );

CREATE POLICY "Students can view their own data" ON students_2026_01_26_15_30
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins and secretaria can manage students" ON students_2026_01_26_15_30
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users_2026_01_26_15_30 u
            JOIN classes_2026_01_26_15_30 c ON students_2026_01_26_15_30.class_id = c.id
            WHERE u.id = auth.uid() AND c.school_id = u.school_id 
            AND u.role IN ('admin', 'secretaria')
        )
    );

-- Políticas para TEACHERS
CREATE POLICY "Users can view teachers from same school" ON teachers_2026_01_26_15_30
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users_2026_01_26_15_30 u1
            JOIN users_2026_01_26_15_30 u2 ON teachers_2026_01_26_15_30.user_id = u2.id
            WHERE u1.id = auth.uid() AND u1.school_id = u2.school_id
        )
    );

CREATE POLICY "Teachers can view their own data" ON teachers_2026_01_26_15_30
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage teachers" ON teachers_2026_01_26_15_30
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users_2026_01_26_15_30 u1
            JOIN users_2026_01_26_15_30 u2 ON teachers_2026_01_26_15_30.user_id = u2.id
            WHERE u1.id = auth.uid() AND u1.school_id = u2.school_id AND u1.role = 'admin'
        )
    );

-- Políticas para ENROLLMENTS
CREATE POLICY "Users can view enrollments from same school" ON enrollments_2026_01_26_15_30
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students_2026_01_26_15_30 s
            JOIN classes_2026_01_26_15_30 c ON s.class_id = c.id
            JOIN users_2026_01_26_15_30 u ON c.school_id = u.school_id
            WHERE enrollments_2026_01_26_15_30.student_id = s.id AND u.id = auth.uid()
        )
    );

-- Políticas para GRADES
CREATE POLICY "Users can view grades from same school" ON grades_2026_01_26_15_30
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students_2026_01_26_15_30 s
            JOIN classes_2026_01_26_15_30 c ON s.class_id = c.id
            JOIN users_2026_01_26_15_30 u ON c.school_id = u.school_id
            WHERE grades_2026_01_26_15_30.student_id = s.id AND u.id = auth.uid()
        )
    );

CREATE POLICY "Students can view their own grades" ON grades_2026_01_26_15_30
    FOR SELECT USING (
        student_id IN (SELECT id FROM students_2026_01_26_15_30 WHERE user_id = auth.uid())
    );

CREATE POLICY "Teachers can manage grades for their classes" ON grades_2026_01_26_15_30
    FOR ALL USING (
        class_id IN (
            SELECT id FROM classes_2026_01_26_15_30 WHERE teacher_id = auth.uid()
        )
    );

-- Políticas para LESSONS
CREATE POLICY "Users can view lessons from same school" ON lessons_2026_01_26_15_30
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM classes_2026_01_26_15_30 c
            JOIN users_2026_01_26_15_30 u ON c.school_id = u.school_id
            WHERE lessons_2026_01_26_15_30.class_id = c.id AND u.id = auth.uid()
        )
    );

CREATE POLICY "Teachers can manage their own lessons" ON lessons_2026_01_26_15_30
    FOR ALL USING (teacher_id = auth.uid());

-- Políticas para ATTENDANCE
CREATE POLICY "Users can view attendance from same school" ON attendance_2026_01_26_15_30
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM lessons_2026_01_26_15_30 l
            JOIN classes_2026_01_26_15_30 c ON l.class_id = c.id
            JOIN users_2026_01_26_15_30 u ON c.school_id = u.school_id
            WHERE attendance_2026_01_26_15_30.lesson_id = l.id AND u.id = auth.uid()
        )
    );

CREATE POLICY "Students can view their own attendance" ON attendance_2026_01_26_15_30
    FOR SELECT USING (
        student_id IN (SELECT id FROM students_2026_01_26_15_30 WHERE user_id = auth.uid())
    );

-- Políticas para FINANCIAL_TRANSACTIONS
CREATE POLICY "Users can view financial data from same school" ON financial_transactions_2026_01_26_15_30
    FOR SELECT USING (school_id = get_user_school_id());

CREATE POLICY "Admins can manage financial data" ON financial_transactions_2026_01_26_15_30
    FOR ALL USING (school_id = get_user_school_id() AND is_admin());

CREATE POLICY "Students can view their own financial data" ON financial_transactions_2026_01_26_15_30
    FOR SELECT USING (
        student_id IN (SELECT id FROM students_2026_01_26_15_30 WHERE user_id = auth.uid())
    );

-- Políticas para SYSTEM_SETTINGS
CREATE POLICY "Admins can manage system settings" ON system_settings_2026_01_26_15_30
    FOR ALL USING (school_id = get_user_school_id() AND is_admin());

CREATE POLICY "Users can view system settings" ON system_settings_2026_01_26_15_30
    FOR SELECT USING (school_id = get_user_school_id());