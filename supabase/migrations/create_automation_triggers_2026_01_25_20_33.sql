-- ALETHEIA - Triggers para Automação
-- Matrícula automática e cálculo de médias

-- Função para matricular aluno automaticamente em todas as disciplinas da turma
CREATE OR REPLACE FUNCTION auto_enroll_student_in_subjects()
RETURNS TRIGGER AS $$
BEGIN
    -- Matricular o aluno em todas as disciplinas ativas da escola
    INSERT INTO public.enrollments_2026_01_25_20_33 (student_id, subject_id, class_id, academic_year)
    SELECT 
        NEW.id,
        s.id,
        NEW.class_id,
        EXTRACT(YEAR FROM NOW())
    FROM public.subjects_2026_01_25_20_33 s
    JOIN public.users_2026_01_25_20_33 u ON u.school_id = s.school_id
    WHERE u.id = NEW.user_id 
    AND s.active = true
    ON CONFLICT (student_id, subject_id, academic_year) DO NOTHING;

    -- Criar registros de notas para cada disciplina
    INSERT INTO public.grades_2026_01_25_20_33 (student_id, subject_id, class_id, academic_year)
    SELECT 
        NEW.id,
        s.id,
        NEW.class_id,
        EXTRACT(YEAR FROM NOW())
    FROM public.subjects_2026_01_25_20_33 s
    JOIN public.users_2026_01_25_20_33 u ON u.school_id = s.school_id
    WHERE u.id = NEW.user_id 
    AND s.active = true
    ON CONFLICT (student_id, subject_id, academic_year) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para matrícula automática quando aluno é criado
CREATE TRIGGER trigger_auto_enroll_student
    AFTER INSERT ON public.students_2026_01_25_20_33
    FOR EACH ROW
    EXECUTE FUNCTION auto_enroll_student_in_subjects();

-- Função para calcular média final automaticamente
CREATE OR REPLACE FUNCTION calculate_final_average()
RETURNS TRIGGER AS $$
DECLARE
    avg_value DECIMAL(4,2);
    quarters_count INTEGER;
BEGIN
    -- Contar quantos bimestres têm notas
    quarters_count := 0;
    avg_value := 0;

    IF NEW.quarter_1 IS NOT NULL THEN
        avg_value := avg_value + NEW.quarter_1;
        quarters_count := quarters_count + 1;
    END IF;

    IF NEW.quarter_2 IS NOT NULL THEN
        avg_value := avg_value + NEW.quarter_2;
        quarters_count := quarters_count + 1;
    END IF;

    IF NEW.quarter_3 IS NOT NULL THEN
        avg_value := avg_value + NEW.quarter_3;
        quarters_count := quarters_count + 1;
    END IF;

    IF NEW.quarter_4 IS NOT NULL THEN
        avg_value := avg_value + NEW.quarter_4;
        quarters_count := quarters_count + 1;
    END IF;

    -- Calcular média se houver pelo menos uma nota
    IF quarters_count > 0 THEN
        NEW.final_average := ROUND(avg_value / quarters_count, 2);
        
        -- Determinar status baseado na média
        IF quarters_count = 4 THEN
            IF NEW.final_average >= 7.0 THEN
                NEW.status := 'aprovado';
            ELSE
                NEW.status := 'reprovado';
            END IF;
        ELSE
            NEW.status := 'cursando';
        END IF;
    ELSE
        NEW.final_average := NULL;
        NEW.status := 'cursando';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular média automaticamente
CREATE TRIGGER trigger_calculate_final_average
    BEFORE INSERT OR UPDATE ON public.grades_2026_01_25_20_33
    FOR EACH ROW
    EXECUTE FUNCTION calculate_final_average();

-- Função para criar perfil de usuário automaticamente após signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserir na tabela users_2026_01_25_20_33 com dados básicos
    INSERT INTO public.users_2026_01_25_20_33 (id, email, full_name, role, school_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'aluno'),
        COALESCE(NEW.raw_user_meta_data->>'school_id', NULL)::UUID
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil após signup no Supabase Auth
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Função para atualizar last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users_2026_01_25_20_33
    SET last_login = NOW()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar last_login (executado via Edge Function)
-- CREATE TRIGGER on_auth_session_created
--     AFTER INSERT ON auth.sessions
--     FOR EACH ROW
--     EXECUTE FUNCTION update_last_login();

-- Função para validar notas (educação infantil usa conceitos)
CREATE OR REPLACE FUNCTION validate_grade_by_level()
RETURNS TRIGGER AS $$
DECLARE
    grade_level VARCHAR(20);
BEGIN
    -- Obter o nível da turma
    SELECT c.grade_level INTO grade_level
    FROM public.classes_2026_01_25_20_33 c
    WHERE c.id = NEW.class_id;

    -- Para educação infantil, converter conceitos para notas
    IF grade_level = 'infantil' THEN
        -- Validar se as notas estão nos valores permitidos para conceitos
        IF NEW.quarter_1 IS NOT NULL AND NEW.quarter_1 NOT IN (7.0, 8.0, 9.0, 10.0) THEN
            RAISE EXCEPTION 'Para educação infantil, use apenas conceitos: Bom(7), Muito Bom(8), Ótimo(9), Excelente(10)';
        END IF;
        
        IF NEW.quarter_2 IS NOT NULL AND NEW.quarter_2 NOT IN (7.0, 8.0, 9.0, 10.0) THEN
            RAISE EXCEPTION 'Para educação infantil, use apenas conceitos: Bom(7), Muito Bom(8), Ótimo(9), Excelente(10)';
        END IF;
        
        IF NEW.quarter_3 IS NOT NULL AND NEW.quarter_3 NOT IN (7.0, 8.0, 9.0, 10.0) THEN
            RAISE EXCEPTION 'Para educação infantil, use apenas conceitos: Bom(7), Muito Bom(8), Ótimo(9), Excelente(10)';
        END IF;
        
        IF NEW.quarter_4 IS NOT NULL AND NEW.quarter_4 NOT IN (7.0, 8.0, 9.0, 10.0) THEN
            RAISE EXCEPTION 'Para educação infantil, use apenas conceitos: Bom(7), Muito Bom(8), Ótimo(9), Excelente(10)';
        END IF;
        
        -- Na educação infantil, não há reprovação
        IF NEW.final_average IS NOT NULL THEN
            NEW.status := 'aprovado';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar notas por nível educacional
CREATE TRIGGER trigger_validate_grade_by_level
    BEFORE INSERT OR UPDATE ON public.grades_2026_01_25_20_33
    FOR EACH ROW
    EXECUTE FUNCTION validate_grade_by_level();