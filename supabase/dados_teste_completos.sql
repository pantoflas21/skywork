-- ============================================================================
-- ALETHEIA - Dados de Teste Completos (Versão Segura)
-- ============================================================================
-- Este script cria toda a estrutura usando APENAS os usuários que existem
-- ============================================================================

-- ============================================================================
-- PASSO 1: Verificar e configurar usuários existentes
-- ============================================================================

-- Atualizar Super Admins
UPDATE users SET role = 'super_admin', active = true
WHERE email IN ('admin@aletheia.com', 'superadmin@aletheia.com');

-- Configurar outros usuários com roles (apenas se existirem no auth)
UPDATE users u
SET role = 'network_admin', active = true
WHERE u.email = (
    SELECT au.email FROM auth.users au
    WHERE au.email NOT IN ('admin@aletheia.com', 'superadmin@aletheia.com')
    AND NOT EXISTS (SELECT 1 FROM users WHERE role = 'network_admin')
    LIMIT 1
);

-- Configurar Admin
UPDATE users u
SET role = 'admin', active = true
WHERE u.email = (
    SELECT au.email FROM auth.users au
    WHERE au.email NOT IN ('admin@aletheia.com', 'superadmin@aletheia.com')
    AND au.email NOT IN (SELECT email FROM users WHERE role = 'network_admin')
    AND NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin' AND email != 'admin@aletheia.com')
    LIMIT 1
);

-- Configurar Secretaria
UPDATE users u
SET role = 'secretaria', active = true
WHERE u.email = (
    SELECT au.email FROM auth.users au
    WHERE au.email NOT IN ('admin@aletheia.com', 'superadmin@aletheia.com')
    AND au.email NOT IN (SELECT email FROM users WHERE role IN ('network_admin', 'admin'))
    AND NOT EXISTS (SELECT 1 FROM users WHERE role = 'secretaria')
    LIMIT 1
);

-- Configurar Professor
UPDATE users u
SET role = 'professor', active = true
WHERE u.email = (
    SELECT au.email FROM auth.users au
    WHERE au.email NOT IN ('admin@aletheia.com', 'superadmin@aletheia.com')
    AND au.email NOT IN (SELECT email FROM users WHERE role IN ('network_admin', 'admin', 'secretaria'))
    AND NOT EXISTS (SELECT 1 FROM users WHERE role = 'professor')
    LIMIT 1
);

-- Configurar Aluno
UPDATE users u
SET role = 'aluno', active = true
WHERE u.email = (
    SELECT au.email FROM auth.users au
    WHERE au.email NOT IN ('admin@aletheia.com', 'superadmin@aletheia.com')
    AND au.email NOT IN (SELECT email FROM users WHERE role IN ('network_admin', 'admin', 'secretaria', 'professor'))
    AND NOT EXISTS (SELECT 1 FROM users WHERE role = 'aluno')
    LIMIT 1
);

-- ============================================================================
-- PASSO 2: Criar Rede de Ensino
-- ============================================================================

INSERT INTO networks (id, name, admin_user_id, cnpj, email, phone, active)
SELECT 
    gen_random_uuid(),
    'Rede Municipal de Ensino',
    u.id,
    '12.345.678/0001-90',
    'rede@municipal.edu.br',
    '(11) 3333-4444',
    true
FROM users u
WHERE u.role = 'network_admin'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Se não houver network_admin, criar sem admin
INSERT INTO networks (id, name, cnpj, email, phone, active)
SELECT 
    gen_random_uuid(),
    'Rede Municipal de Ensino',
    '12.345.678/0001-90',
    'rede@municipal.edu.br',
    '(11) 3333-4444',
    true
WHERE NOT EXISTS (SELECT 1 FROM networks)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PASSO 3: Criar Escola
-- ============================================================================

INSERT INTO schools (id, name, email, phone, address, city, state, zip_code, network_id, admin_user_id, active)
SELECT 
    gen_random_uuid(),
    'Escola Estadual Dom Pedro II',
    'escola@dompedro.edu.br',
    '(11) 4444-5555',
    'Rua das Flores, 123',
    'São Paulo',
    'SP',
    '01234-567',
    (SELECT id FROM networks LIMIT 1),
    u.id,
    true
FROM users u
WHERE u.role = 'admin' AND u.email != 'admin@aletheia.com'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Se não houver admin específico, criar sem admin
INSERT INTO schools (id, name, email, phone, address, city, state, zip_code, network_id, active)
SELECT 
    gen_random_uuid(),
    'Escola Estadual Dom Pedro II',
    'escola@dompedro.edu.br',
    '(11) 4444-5555',
    'Rua das Flores, 123',
    'São Paulo',
    'SP',
    '01234-567',
    (SELECT id FROM networks LIMIT 1),
    true
WHERE NOT EXISTS (SELECT 1 FROM schools)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PASSO 4: Associar usuários à escola
-- ============================================================================

UPDATE users
SET school_id = (SELECT id FROM schools LIMIT 1)
WHERE role IN ('admin', 'secretaria', 'professor', 'aluno')
  AND email NOT IN ('admin@aletheia.com', 'superadmin@aletheia.com');

UPDATE users
SET network_id = (SELECT id FROM networks LIMIT 1)
WHERE role = 'network_admin';

-- ============================================================================
-- PASSO 5: Criar Disciplinas
-- ============================================================================

INSERT INTO subjects (id, school_id, name, code, active)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM schools LIMIT 1),
    nome,
    codigo,
    true
FROM (VALUES 
    ('Matemática', 'MAT'),
    ('Português', 'PORT'),
    ('História', 'HIST'),
    ('Geografia', 'GEO'),
    ('Ciências', 'CIEN')
) AS disciplinas(nome, codigo)
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE name = disciplinas.nome);

-- ============================================================================
-- PASSO 6: Criar Turmas
-- ============================================================================

INSERT INTO classes (id, school_id, name, grade_level, school_year, shift, teacher_id, max_students, active)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM schools LIMIT 1),
    '6º Ano A',
    'fundamental_2',
    2026,
    'matutino',
    (SELECT id FROM users WHERE role = 'professor' LIMIT 1),
    35,
    true
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = '6º Ano A');

INSERT INTO classes (id, school_id, name, grade_level, school_year, shift, teacher_id, max_students, active)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM schools LIMIT 1),
    '7º Ano B',
    'fundamental_2',
    2026,
    'vespertino',
    (SELECT id FROM users WHERE role = 'professor' LIMIT 1),
    30,
    true
WHERE NOT EXISTS (SELECT 1 FROM classes WHERE name = '7º Ano B');

-- ============================================================================
-- PASSO 7: Criar Alunos SEM login
-- ============================================================================

INSERT INTO students (id, school_id, class_id, registration_number, guardian_name, guardian_phone, guardian_email, status, birth_date)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM schools LIMIT 1),
    (SELECT id FROM classes WHERE name = '6º Ano A' LIMIT 1),
    '2026' || LPAD(n::TEXT, 4, '0'),
    'Responsável Aluno ' || n,
    '(11) 9' || LPAD((9000 + n)::TEXT, 8, '0'),
    'responsavel' || n || '@email.com',
    'ativo',
    ('2012-01-01'::DATE + (n || ' days')::INTERVAL)
FROM generate_series(1, 8) AS n
WHERE NOT EXISTS (SELECT 1 FROM students WHERE registration_number = '2026' || LPAD(n::TEXT, 4, '0'));

-- ============================================================================
-- PASSO 8: Associar aluno com login
-- ============================================================================

INSERT INTO students (id, user_id, school_id, class_id, registration_number, guardian_name, guardian_phone, guardian_email, status, birth_date)
SELECT 
    gen_random_uuid(),
    u.id,
    (SELECT id FROM schools LIMIT 1),
    (SELECT id FROM classes WHERE name = '6º Ano A' LIMIT 1),
    '20260001',
    'Responsável do Aluno',
    '(11) 98888-7777',
    'responsavel.aluno@email.com',
    'ativo',
    '2012-06-15'
FROM users u
WHERE u.role = 'aluno'
  AND NOT EXISTS (SELECT 1 FROM students WHERE user_id = u.id)
LIMIT 1;

-- ============================================================================
-- PASSO 9: Criar aulas
-- ============================================================================

INSERT INTO lessons (id, teacher_id, subject_id, class_id, school_id, title, content, lesson_date, quarter, status)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM users WHERE role = 'professor' LIMIT 1),
    (SELECT id FROM subjects WHERE name = 'Matemática' LIMIT 1),
    (SELECT id FROM classes WHERE name = '6º Ano A' LIMIT 1),
    (SELECT id FROM schools LIMIT 1),
    'Introdução à Álgebra',
    'Conceitos básicos de álgebra e equações do primeiro grau',
    CURRENT_DATE - INTERVAL '2 days',
    1,
    'ministrada'
WHERE (SELECT COUNT(*) FROM users WHERE role = 'professor') > 0
  AND NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Introdução à Álgebra');

-- ============================================================================
-- PASSO 10: Lançar notas para metade dos alunos
-- ============================================================================

WITH alunos_para_nota AS (
    SELECT id, class_id, school_id
    FROM students
    WHERE class_id = (SELECT id FROM classes WHERE name = '6º Ano A' LIMIT 1)
    LIMIT 4
)
INSERT INTO grades (id, student_id, class_id, teacher_id, school_id, subject_id, subject, assessment_type, assessment_name, grade, quarter, date)
SELECT 
    gen_random_uuid(),
    a.id,
    a.class_id,
    (SELECT id FROM users WHERE role = 'professor' LIMIT 1),
    a.school_id,
    (SELECT id FROM subjects WHERE name = 'Matemática' LIMIT 1),
    'Matemática',
    'prova',
    'Prova Bimestral',
    (6 + RANDOM() * 4)::DECIMAL(4,2),
    1,
    CURRENT_DATE - INTERVAL '3 days'
FROM alunos_para_nota a
WHERE (SELECT COUNT(*) FROM users WHERE role = 'professor') > 0
  AND NOT EXISTS (SELECT 1 FROM grades WHERE student_id = a.id);

-- ============================================================================
-- PASSO 11: Registrar frequência parcial
-- ============================================================================

WITH alunos_para_frequencia AS (
    SELECT id, class_id, school_id
    FROM students
    WHERE class_id = (SELECT id FROM classes WHERE name = '6º Ano A' LIMIT 1)
    LIMIT 5
)
INSERT INTO attendance (id, student_id, class_id, teacher_id, school_id, date, status)
SELECT 
    gen_random_uuid(),
    a.id,
    a.class_id,
    (SELECT id FROM users WHERE role = 'professor' LIMIT 1),
    a.school_id,
    CURRENT_DATE - INTERVAL '2 days',
    CASE WHEN RANDOM() > 0.2 THEN 'presente' ELSE 'ausente' END
FROM alunos_para_frequencia a
WHERE (SELECT COUNT(*) FROM users WHERE role = 'professor') > 0
  AND NOT EXISTS (SELECT 1 FROM attendance WHERE student_id = a.id AND date = CURRENT_DATE - INTERVAL '2 days');

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================

SELECT '═══════════════════════════════════════════════' as resultado;
SELECT '  ✅ DADOS DE TESTE CRIADOS COM SUCESSO!' as resultado;
SELECT '═══════════════════════════════════════════════' as resultado;

-- Resumo
SELECT 
    'Redes' as tipo,
    COUNT(*)::TEXT as quantidade
FROM networks
UNION ALL
SELECT 'Escolas', COUNT(*)::TEXT FROM schools
UNION ALL
SELECT 'Turmas', COUNT(*)::TEXT FROM classes
UNION ALL
SELECT 'Disciplinas', COUNT(*)::TEXT FROM subjects
UNION ALL
SELECT 'Alunos', COUNT(*)::TEXT FROM students
UNION ALL
SELECT 'Aulas', COUNT(*)::TEXT FROM lessons
UNION ALL
SELECT 'Notas', COUNT(*)::TEXT FROM grades
UNION ALL
SELECT 'Frequências', COUNT(*)::TEXT FROM attendance;

-- Usuários configurados
SELECT 
    u.email as email,
    u.full_name as nome,
    u.role as perfil,
    CASE WHEN u.active THEN '✅' ELSE '❌' END as status
FROM users u
ORDER BY 
    CASE u.role 
        WHEN 'super_admin' THEN 1
        WHEN 'network_admin' THEN 2
        WHEN 'admin' THEN 3
        WHEN 'secretaria' THEN 4
        WHEN 'professor' THEN 5
        WHEN 'aluno' THEN 6
    END;
