-- ============================================================================
-- CRIAR SUPER ADMIN MANUALMENTE (Contorna rate limit)
-- ============================================================================

-- PASSO 1: Primeiro você precisa criar o usuário no Supabase Auth Dashboard
-- Acesse: https://app.supabase.com/project/dhwtumzkroveaijsrarg/auth/users
-- Clique em "Add user" > "Create new user"
-- Preencha:
--   Email: superadmin@aletheia.com
--   Password: Super@123456
--   Auto Confirm User: ✅ MARCAR (importante!)
-- Copie o UUID do usuário criado

-- PASSO 2: Execute esta query substituindo o UUID abaixo
-- ============================================================================

-- ⚠️ SUBSTITUA 'SEU_UUID_AQUI' pelo UUID copiado do passo 1
-- Exemplo de UUID: 8f7d9c5e-4b2a-4c1e-9f3a-7e8d6c5b4a3d

INSERT INTO users (
    id,
    school_id,
    full_name,
    email,
    role,
    phone,
    cpf,
    address,
    network_id,
    active,
    last_login,
    avatar_url,
    created_at,
    updated_at
) VALUES (
    'SEU_UUID_AQUI',  -- ⚠️ SUBSTITUIR AQUI
    NULL,
    'Super Administrador',
    'superadmin@aletheia.com',
    'super_admin',
    NULL,
    NULL,
    NULL,
    NULL,
    true,
    NULL,
    NULL,
    NOW(),
    NOW()
);

-- ============================================================================
-- VERIFICAR SE FOI CRIADO
-- ============================================================================

SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.active,
    u.created_at
FROM users u
WHERE u.role = 'super_admin';

-- ============================================================================
-- Resultado esperado:
-- Deve mostrar 1 linha com o Super Admin criado
-- ============================================================================

-- ============================================================================
-- DEPOIS DE EXECUTAR:
-- ============================================================================
-- 1. Acesse: http://localhost:8080/#/login
-- 2. Email: superadmin@aletheia.com
-- 3. Senha: Super@123456
-- 4. Clique em "Entrar no Sistema"
-- ============================================================================
