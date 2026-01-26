-- ALETHEIA - Dados de Exemplo para Demonstração
-- Criado em: 2026-01-26

-- Inserir escola de exemplo
INSERT INTO schools_2026_01_26_15_30 (id, name, email, phone, address, city, state, zip_code) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'ALETHEIA Instituto de Educação', 'contato@aletheia.edu.br', '(11) 3456-7890', 'Rua da Educação, 123', 'São Paulo', 'SP', '01234-567')
ON CONFLICT (id) DO NOTHING;

-- Inserir disciplinas padrão
INSERT INTO subjects_2026_01_26_15_30 (id, school_id, name, code, description) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Matemática', 'MAT', 'Disciplina de Matemática'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Português', 'POR', 'Língua Portuguesa'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'História', 'HIS', 'História do Brasil e Geral'),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Geografia', 'GEO', 'Geografia Física e Humana'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Ciências', 'CIE', 'Ciências Naturais'),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Física', 'FIS', 'Física Geral'),
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Química', 'QUI', 'Química Geral'),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'Biologia', 'BIO', 'Biologia Geral'),
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440000', 'Inglês', 'ING', 'Língua Inglesa'),
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'Educação Física', 'EDF', 'Educação Física')
ON CONFLICT (id) DO NOTHING;

-- Inserir turmas de exemplo
INSERT INTO classes_2026_01_26_15_30 (id, school_id, name, grade_level, school_year, shift, max_students) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '1º Ano A', 'fundamental_1', 2024, 'matutino', 30),
('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '6º Ano A', 'fundamental_2', 2024, 'matutino', 32),
('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '7º Ano B', 'fundamental_2', 2024, 'vespertino', 28),
('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '9º Ano A', 'fundamental_2', 2024, 'matutino', 30),
('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', '1º EM A', 'medio', 2024, 'matutino', 35),
('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', '3º EM B', 'medio', 2024, 'vespertino', 33),
('750e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Infantil 4', 'infantil', 2024, 'matutino', 25),
('750e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'Infantil 5', 'infantil', 2024, 'vespertino', 25)
ON CONFLICT (id) DO NOTHING;

-- Inserir transações financeiras de exemplo
INSERT INTO financial_transactions_2026_01_26_15_30 (school_id, type, category, description, amount, due_date, payment_date, status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'receita', 'mensalidade', 'Mensalidade Janeiro 2024', 1250.00, '2024-01-10', '2024-01-08', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'receita', 'mensalidade', 'Mensalidade Fevereiro 2024', 1250.00, '2024-02-10', '2024-02-12', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'receita', 'mensalidade', 'Mensalidade Março 2024', 1250.00, '2024-03-10', '2024-03-09', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'receita', 'mensalidade', 'Mensalidade Abril 2024', 1250.00, '2024-04-10', '2024-04-15', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'receita', 'mensalidade', 'Mensalidade Maio 2024', 1250.00, '2024-05-10', NULL, 'pendente'),
('550e8400-e29b-41d4-a716-446655440000', 'receita', 'material', 'Material Didático 2024', 450.00, '2024-02-15', '2024-02-20', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'despesa', 'salario', 'Salários Professores Janeiro', 45000.00, '2024-01-30', '2024-01-30', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'despesa', 'salario', 'Salários Professores Fevereiro', 45000.00, '2024-02-28', '2024-02-28', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'despesa', 'salario', 'Salários Professores Março', 45000.00, '2024-03-30', '2024-03-30', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'despesa', 'salario', 'Salários Professores Abril', 45000.00, '2024-04-30', '2024-04-30', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'despesa', 'salario', 'Salários Professores Maio', 45000.00, '2024-05-30', NULL, 'pendente'),
('550e8400-e29b-41d4-a716-446655440000', 'despesa', 'manutencao', 'Manutenção Predial', 2500.00, '2024-03-15', '2024-03-20', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'despesa', 'energia', 'Conta de Energia Elétrica', 1800.00, '2024-04-20', '2024-04-18', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'despesa', 'agua', 'Conta de Água', 650.00, '2024-04-25', '2024-04-22', 'pago'),
('550e8400-e29b-41d4-a716-446655440000', 'receita', 'mensalidade', 'Mensalidade Atrasada', 1250.00, '2024-03-10', NULL, 'atrasado');

-- Inserir configurações do sistema
INSERT INTO system_settings_2026_01_26_15_30 (school_id, setting_key, setting_value, description) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'academic_year', '2024', 'Ano letivo vigente'),
('550e8400-e29b-41d4-a716-446655440000', 'passing_grade', '7.0', 'Média mínima para aprovação'),
('550e8400-e29b-41d4-a716-446655440000', 'school_name', 'ALETHEIA Instituto de Educação', 'Nome da instituição'),
('550e8400-e29b-41d4-a716-446655440000', 'auto_backup', 'true', 'Backup automático habilitado'),
('550e8400-e29b-41d4-a716-446655440000', 'two_factor_auth', 'false', 'Autenticação de dois fatores'),
('550e8400-e29b-41d4-a716-446655440000', 'max_students_per_class', '35', 'Máximo de alunos por turma'),
('550e8400-e29b-41d4-a716-446655440000', 'quarterly_system', 'true', 'Sistema de avaliação por bimestres'),
('550e8400-e29b-41d4-a716-446655440000', 'infantil_concept_grades', 'true', 'Notas por conceito na educação infantil')
ON CONFLICT (school_id, setting_key) DO NOTHING;