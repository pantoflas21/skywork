-- ============================================================================
-- ALETHEIA - Script de Verificação de Dados Existentes
-- ============================================================================

-- ============================================================================
-- 1. LISTAR TODOS OS USUÁRIOS
-- ============================================================================
SELECT 
    u.id,
    u.email,
    u.full_name as nome,
    u.role as perfil,
    u.active as ativo,
    s.name as escola,
    n.name as rede,
    u.created_at as criado_em
FROM users u
LEFT JOIN schools s ON u.school_id = s.id
LEFT JOIN networks n ON u.network_id = n.id
ORDER BY 
    CASE u.role 
        WHEN 'super_admin' THEN 1
        WHEN 'network_admin' THEN 2
        WHEN 'admin' THEN 3
        WHEN 'secretaria' THEN 4
        WHEN 'professor' THEN 5
        WHEN 'aluno' THEN 6
        ELSE 7
    END,
    u.created_at;

-- ============================================================================
-- 2. ESTATÍSTICAS GERAIS
-- ============================================================================
SELECT 
    'Redes' as tipo, COUNT(*) as quantidade FROM networks WHERE active = true
UNION ALL
SELECT 'Escolas', COUNT(*) FROM schools WHERE active = true
UNION ALL
SELECT 'Super Admins', COUNT(*) FROM users WHERE role = 'super_admin' AND active = true
UNION ALL
SELECT 'Network Admins', COUNT(*) FROM users WHERE role = 'network_admin' AND active = true
UNION ALL
SELECT 'Admins', COUNT(*) FROM users WHERE role = 'admin' AND active = true
UNION ALL
SELECT 'Secretarias', COUNT(*) FROM users WHERE role = 'secretaria' AND active = true
UNION ALL
SELECT 'Professores', COUNT(*) FROM users WHERE role = 'professor' AND active = true
UNION ALL
SELECT 'Alunos', COUNT(*) FROM students WHERE status = 'ativo'
UNION ALL
SELECT 'Turmas', COUNT(*) FROM classes WHERE active = true
UNION ALL
SELECT 'Notas', COUNT(*) FROM grades
UNION ALL
SELECT 'Frequências', COUNT(*) FROM attendance;

-- ============================================================================
-- 3. VERIFICAR USUÁRIOS NO AUTH
-- ============================================================================
SELECT 
    au.id,
    au.email,
    au.created_at,
    au.last_sign_in_at as ultimo_login,
    au.email_confirmed_at as email_confirmado
FROM auth.users au
ORDER BY au.created_at;

-- ============================================================================
-- 4. LISTAR REDES E ESCOLAS
-- ============================================================================
SELECT 
    n.name as rede,
    n.email as email_rede,
    COUNT(s.id) as total_escolas,
    n.active as ativa
FROM networks n
LEFT JOIN schools s ON s.network_id = n.id
GROUP BY n.id, n.name, n.email, n.active
ORDER BY n.created_at;

-- ============================================================================
-- 5. LISTAR ESCOLAS DETALHADAS
-- ============================================================================
SELECT 
    s.name as escola,
    s.email,
    s.city as cidade,
    s.state as estado,
    n.name as rede,
    u.full_name as admin,
    u.email as admin_email,
    s.active as ativa
FROM schools s
LEFT JOIN networks n ON s.network_id = n.id
LEFT JOIN users u ON s.admin_user_id = u.id
ORDER BY s.created_at;

-- ============================================================================
-- RESULTADO ESPERADO
-- ============================================================================
-- Este script mostra todos os dados existentes no sistema para que você
-- possa identificar quais usuários já foram criados e suas credenciais.
-- ============================================================================
