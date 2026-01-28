-- ============================================================================
-- CRIAR SUPER ADMIN COMPLETO - Versão Final
-- ============================================================================
-- Execute este script no SQL Editor do Supabase para criar o Super Admin
-- URL: https://app.supabase.com/project/dhwtumzkroveaijsrarg/sql/new
-- ============================================================================

-- Passo 1: Criar usuário no Auth (via função admin)
-- Nota: Isso precisa ser feito via interface ou API com Service Role Key

-- Passo 2: Inserir na tabela users
-- ⚠️ IMPORTANTE: Substitua o UUID abaixo pelo ID do usuário criado no Auth

DO $$
DECLARE
    v_user_id UUID;
    v_email TEXT := 'superadmin@aletheia.com';
BEGIN
    -- Tentar encontrar o usuário no auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_email
    LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Usuário não encontrado no auth.users com email: %', v_email;
        RAISE NOTICE 'Por favor, crie o usuário primeiro em:';
        RAISE NOTICE 'https://app.supabase.com/project/dhwtumzkroveaijsrarg/auth/users';
    ELSE
        -- Verificar se já existe na tabela users
        IF EXISTS (SELECT 1 FROM users WHERE id = v_user_id) THEN
            RAISE NOTICE 'Usuário já existe na tabela users!';
        ELSE
            -- Inserir na tabela users
            INSERT INTO users (
                id,
                email,
                full_name,
                role,
                active,
                created_at,
                updated_at
            ) VALUES (
                v_user_id,
                v_email,
                'Super Administrador',
                'super_admin',
                true,
                NOW(),
                NOW()
            );
            
            RAISE NOTICE '✅ Super Admin criado com sucesso!';
            RAISE NOTICE 'Email: %', v_email;
            RAISE NOTICE 'Acesse: http://localhost:8080/#/login';
        END IF;
    END IF;
END $$;

-- Verificar resultado
SELECT 
    '═══════════════════════════════════════' as "╔═══════════════════════════╗",
    '  SUPER ADMIN CRIADO!' as "║  STATUS                   ║",
    '═══════════════════════════════════════' as "╚═══════════════════════════╝";

SELECT 
    u.id as "UUID",
    u.email as "📧 EMAIL",
    u.full_name as "👤 NOME",
    u.role as "🎭 PERFIL",
    CASE WHEN u.active THEN '✅ Ativo' ELSE '❌ Inativo' END as "STATUS"
FROM users u
WHERE u.role = 'super_admin';

-- ============================================================================
-- CREDENCIAIS DE ACESSO
-- ============================================================================
SELECT 
    'superadmin@aletheia.com' as "📧 EMAIL PARA LOGIN",
    'Super@123456' as "🔑 SENHA",
    'http://localhost:8080/#/login' as "🌐 URL";
