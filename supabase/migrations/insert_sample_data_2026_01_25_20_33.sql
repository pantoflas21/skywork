-- ALETHEIA - Dados de Exemplo para Demonstração
-- Escola, usuários, turmas, disciplinas e dados iniciais

-- Inserir escola de exemplo
INSERT INTO public.schools_2026_01_25_20_33 (id, name, slug, address, phone, email) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Escola Primária Alegria', 'escola-primaria-alegria', 'Rua das Flores, 123 - Centro', '(11) 3456-7890', 'contato@escolaalegria.edu.br');

-- Inserir disciplinas de exemplo
INSERT INTO public.subjects_2026_01_25_20_33 (id, school_id, name, code, description) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Matemática', 'MAT', 'Disciplina de Matemática'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Português', 'POR', 'Língua Portuguesa'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'História', 'HIS', 'História do Brasil e Geral'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Geografia', 'GEO', 'Geografia Física e Humana'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Ciências', 'CIE', 'Ciências Naturais'),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Educação Física', 'EDF', 'Educação Física e Esportes'),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Artes', 'ART', 'Educação Artística'),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'Inglês', 'ING', 'Língua Inglesa');

-- Inserir turmas de exemplo
INSERT INTO public.classes_2026_01_25_20_33 (id, school_id, name, grade_level, school_year, shift) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '7º Ano A', 'fundamental_2', 2024, 'matutino'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '7º Ano B', 'fundamental_2', 2024, 'matutino'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '8º Ano A', 'fundamental_2', 2024, 'matutino'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '9º Ano A', 'fundamental_2', 2024, 'matutino'),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', '1º Ano Médio', 'medio', 2024, 'matutino'),
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Pré I', 'infantil', 2024, 'matutino');

-- Inserir usuários de exemplo (simulando dados que viriam do Supabase Auth)
-- NOTA: Em produção, estes dados seriam criados via signup do Supabase Auth
INSERT INTO public.users_2026_01_25_20_33 (id, school_id, email, full_name, role) VALUES
-- Administrador
('11111111-1111-1111-1111-111111111111', '550e8400-e29b-41d4-a716-446655440000', 'admin@escolaalegria.edu.br', 'João Silva', 'admin'),
-- Secretária
('22222222-2222-2222-2222-222222222222', '550e8400-e29b-41d4-a716-446655440000', 'secretaria@escolaalegria.edu.br', 'Maria Santos', 'secretaria'),
-- Professores
('33333333-3333-3333-3333-333333333333', '550e8400-e29b-41d4-a716-446655440000', 'professor.matematica@escolaalegria.edu.br', 'Prof. Ricardo Mendes', 'professor'),
('44444444-4444-4444-4444-444444444444', '550e8400-e29b-41d4-a716-446655440000', 'professor.portugues@escolaalegria.edu.br', 'Profa. Ana Costa', 'professor'),
('55555555-5555-5555-5555-555555555555', '550e8400-e29b-41d4-a716-446655440000', 'professor.historia@escolaalegria.edu.br', 'Prof. Carlos Oliveira', 'professor'),
-- Alunos
('66666666-6666-6666-6666-666666666666', '550e8400-e29b-41d4-a716-446655440000', 'lucas.santos@email.com', 'Lucas Santos', 'aluno'),
('77777777-7777-7777-7777-777777777777', '550e8400-e29b-41d4-a716-446655440000', 'ana.silva@email.com', 'Ana Silva', 'aluno'),
('88888888-8888-8888-8888-888888888888', '550e8400-e29b-41d4-a716-446655440000', 'pedro.lima@email.com', 'Pedro Lima', 'aluno'),
('99999999-9999-9999-9999-999999999999', '550e8400-e29b-41d4-a716-446655440000', 'carla.dias@email.com', 'Carla Dias', 'aluno');

-- Inserir dados específicos dos professores
INSERT INTO public.teachers_2026_01_25_20_33 (user_id, specialization, bio) VALUES
('33333333-3333-3333-3333-333333333333', 'Matemática e Física', 'Professor com 15 anos de experiência em ensino fundamental e médio'),
('44444444-4444-4444-4444-444444444444', 'Língua Portuguesa e Literatura', 'Especialista em gramática e produção textual'),
('55555555-5555-5555-5555-555555555555', 'História e Geografia', 'Mestre em História do Brasil, focado em metodologias ativas');

-- Inserir dados específicos dos alunos
INSERT INTO public.students_2026_01_25_20_33 (user_id, class_id, registration_number, birth_date, guardian_name, guardian_phone, special_needs, special_needs_description) VALUES
('66666666-6666-6666-6666-666666666666', '770e8400-e29b-41d4-a716-446655440001', '2024001', '2010-03-15', 'Roberto Santos', '(11) 98765-4321', false, NULL),
('77777777-7777-7777-7777-777777777777', '770e8400-e29b-41d4-a716-446655440002', '2024002', '2010-07-22', 'José Silva', '(11) 97654-3210', false, NULL),
('88888888-8888-8888-8888-888888888888', '770e8400-e29b-41d4-a716-446655440003', '2024003', '2009-11-08', 'Marcos Lima', '(11) 96543-2109', true, 'TDAH - Necessita de atenção especial e pausas durante as atividades'),
('99999999-9999-9999-9999-999999999999', '770e8400-e29b-41d4-a716-446655440004', '2024004', '2008-05-30', 'Paulo Dias', '(11) 95432-1098', false, NULL);

-- Inserir algumas notas de exemplo
INSERT INTO public.grades_2026_01_25_20_33 (student_id, subject_id, class_id, quarter_1, quarter_2, quarter_3, academic_year) VALUES
-- Lucas Santos (7º Ano A)
((SELECT id FROM public.students_2026_01_25_20_33 WHERE user_id = '66666666-6666-6666-6666-666666666666'), '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 8.5, 7.8, 9.0, 2024),
((SELECT id FROM public.students_2026_01_25_20_33 WHERE user_id = '66666666-6666-6666-6666-666666666666'), '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 7.0, 6.5, 7.5, 2024),
-- Ana Silva (7º Ano B)
((SELECT id FROM public.students_2026_01_25_20_33 WHERE user_id = '77777777-7777-7777-7777-777777777777'), '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 9.0, 8.5, 8.8, 2024),
((SELECT id FROM public.students_2026_01_25_20_33 WHERE user_id = '77777777-7777-7777-7777-777777777777'), '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 8.0, 7.5, 8.2, 2024);

-- Inserir algumas aulas de exemplo
INSERT INTO public.lessons_2026_01_25_20_33 (class_id, subject_id, teacher_id, date, start_time, end_time, title, content) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '33333333-3333-3333-3333-333333333333', '2024-01-15', '08:00', '08:50', 'Introdução à Álgebra', 'Conceitos básicos de álgebra, variáveis e expressões algébricas'),
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '44444444-4444-4444-4444-444444444444', '2024-01-15', '09:00', '09:50', 'Análise Sintática', 'Estudo dos termos da oração e suas funções sintáticas'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '55555555-5555-5555-5555-555555555555', '2024-01-16', '08:00', '08:50', 'Brasil Colonial', 'Período colonial brasileiro: economia, sociedade e política');

-- Inserir algumas mensalidades de exemplo
INSERT INTO public.tuition_payments_2026_01_25_20_33 (student_id, amount, due_date, status) VALUES
((SELECT id FROM public.students_2026_01_25_20_33 WHERE user_id = '66666666-6666-6666-6666-666666666666'), 450.00, '2024-02-05', 'pago'),
((SELECT id FROM public.students_2026_01_25_20_33 WHERE user_id = '66666666-6666-6666-6666-666666666666'), 450.00, '2024-03-05', 'pendente'),
((SELECT id FROM public.students_2026_01_25_20_33 WHERE user_id = '77777777-7777-7777-7777-777777777777'), 450.00, '2024-02-05', 'pago'),
((SELECT id FROM public.students_2026_01_25_20_33 WHERE user_id = '77777777-7777-7777-7777-777777777777'), 450.00, '2024-03-05', 'pendente');