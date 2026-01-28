-- ============================================================================
-- SINCRONIZAR USUÁRIOS DO AUTH COM A TABELA USERS
-- ============================================================================
-- Este script verifica todos os usuários no auth.users e garante que
-- existam na tabela public.users
-- ============================================================================

-- Passo 1: Ver quem está no Auth mas NÃO está na tabela users
SELECT 
    'Usuários no Auth que faltam na tabela users:' as info;

SELECT 
    au.id,
    au.email,
    au.raw_user_meta_data->>'full_name' as nome,
    au.created_at
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL
ORDER BY au.created_at;

-- ============================================================================
-- Passo 2: Inserir Super Admins que faltam
-- ============================================================================

-- Inserir admin@aletheia.com como super_admin
INSERT INTO users (id, email, full_name, role, active, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', 'Super Administrador'),
    'super_admin',
    true,
    au.created_at,
    NOW()
FROM auth.users au
WHERE au.email = 'admin@aletheia.com'
  AND NOT EXISTS (SELECT 1 FROM users WHERE id = au.id)
ON CONFLICT (id) DO NOTHING;

-- Inserir superadmin@aletheia.com como super_admin
INSERT INTO users (id, email, full_name, role, active, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', 'Super Administrador'),
    'super_admin',
    true,
    au.created_at,
    NOW()
FROM auth.users au
WHERE au.email = 'superadmin@aletheia.com'
  AND NOT EXISTS (SELECT 1 FROM users WHERE id = au.id)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Passo 3: Resetar senhas dos Super Admins para padrão
-- ============================================================================

UPDATE auth.users 
SET encrypted_password = crypt('Super@123456', gen_salt('bf'))
WHERE email IN ('admin@aletheia.com', 'superadmin@aletheia.com');

-- ============================================================================
-- Passo 4: Verificar resultado
-- ============================================================================

SELECT 
    '═══════════════════════════════════════════════' as "╔═══════════════════════════╗";

SELECT 
    '  SUPER ADMINS DISPONÍVEIS' as "║  STATUS                   ║";

SELECT 
    '═══════════════════════════════════════════════' as "╚═══════════════════════════╝";

SELECT 
    u.email as "📧 EMAIL",
    u.full_name as "👤 NOME",
    u.role as "🎭 PERFIL",
    'Super@123456' as "🔑 SENHA",
    CASE WHEN u.active THEN '✅ Ativo' ELSE '❌ Inativo' END as "STATUS"
FROM users u
WHERE u.role = 'super_admin'
ORDER BY u.created_at;

-- ============================================================================
-- INSTRUÇÕES DE LOGIN
-- ============================================================================

SELECT 
    '═══════════════════════════════════════════════' as "╔═══════════════════════════╗";

SELECT 
    '  COMO FAZER LOGIN' as "║  PRÓXIMOS PASSOS          ║";

SELECT 
    '═══════════════════════════════════════════════' as "╚═══════════════════════════╝";

SELECT 
    '1. Acesse http://localhost:8080/#/login' as "PASSO"
UNION ALL
SELECT '2. Use um dos emails acima'
UNION ALL
SELECT '3. Senha: Super@123456'
UNION ALL
SELECT '4. Clique em ENTRAR';

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
