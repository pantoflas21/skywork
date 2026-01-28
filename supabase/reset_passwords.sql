-- ============================================================================
-- ALETHEIA - Script de Reset de Senhas para Senhas Padrão
-- ============================================================================
-- Este script redefine as senhas de todos os usuários para senhas padrão
-- conhecidas, permitindo que você faça login e teste o sistema.
-- ============================================================================

-- ⚠️ ATENÇÃO: Execute apenas em ambiente de DESENVOLVIMENTO/TESTE!
-- Não use em produção!

-- ============================================================================
-- FUNÇÃO AUXILIAR: Resetar senha de um usuário
-- ============================================================================

-- Para resetar a senha de um usuário específico, use:
-- UPDATE auth.users 
-- SET encrypted_password = crypt('NOVA_SENHA_AQUI', gen_salt('bf'))
-- WHERE email = 'EMAIL_DO_USUARIO';

-- ============================================================================
-- OPÇÃO 1: RESETAR SENHA DO SUPER ADMIN
-- ============================================================================
-- Senha: Super@123456

UPDATE auth.users 
SET encrypted_password = crypt('Super@123456', gen_salt('bf'))
WHERE email IN (
    SELECT email FROM users WHERE role = 'super_admin'
);

SELECT 'Senha do Super Admin resetada para: Super@123456' as resultado;

-- ============================================================================
-- OPÇÃO 2: RESETAR TODAS AS SENHAS PARA PADRÕES POR ROLE
-- ============================================================================

-- Network Admin: Network@123
UPDATE auth.users 
SET encrypted_password = crypt('Network@123', gen_salt('bf'))
WHERE email IN (
    SELECT email FROM users WHERE role = 'network_admin'
);

-- Admin (Escola): Admin@123
UPDATE auth.users 
SET encrypted_password = crypt('Admin@123', gen_salt('bf'))
WHERE email IN (
    SELECT email FROM users WHERE role = 'admin'
);

-- Secretaria: Secret@123
UPDATE auth.users 
SET encrypted_password = crypt('Secret@123', gen_salt('bf'))
WHERE email IN (
    SELECT email FROM users WHERE role = 'secretaria'
);

-- Professor: Prof@123
UPDATE auth.users 
SET encrypted_password = crypt('Prof@123', gen_salt('bf'))
WHERE email IN (
    SELECT email FROM users WHERE role = 'professor'
);

-- Aluno: Aluno@123
UPDATE auth.users 
SET encrypted_password = crypt('Aluno@123', gen_salt('bf'))
WHERE email IN (
    SELECT email FROM users WHERE role = 'aluno'
);

-- ============================================================================
-- VERIFICAÇÃO: LISTAR USUÁRIOS E SENHAS PADRÃO
-- ============================================================================

SELECT 
    u.email,
    u.full_name as nome,
    u.role as perfil,
    CASE u.role 
        WHEN 'super_admin' THEN 'Super@123456'
        WHEN 'network_admin' THEN 'Network@123'
        WHEN 'admin' THEN 'Admin@123'
        WHEN 'secretaria' THEN 'Secret@123'
        WHEN 'professor' THEN 'Prof@123'
        WHEN 'aluno' THEN 'Aluno@123'
        ELSE 'N/A'
    END as senha_padrao,
    u.active as ativo
FROM users u
ORDER BY 
    CASE u.role 
        WHEN 'super_admin' THEN 1
        WHEN 'network_admin' THEN 2
        WHEN 'admin' THEN 3
        WHEN 'secretaria' THEN 4
        WHEN 'professor' THEN 5
        WHEN 'aluno' THEN 6
        ELSE 7
    END;

-- ============================================================================
-- SENHAS PADRÃO POR PERFIL
-- ============================================================================
/*
Super Admin:     Super@123456
Network Admin:   Network@123
Admin (Escola):  Admin@123
Secretaria:      Secret@123
Professor:       Prof@123
Aluno:           Aluno@123

Após executar este script, você poderá fazer login com qualquer usuário
usando o email listado e a senha correspondente ao perfil.
*/
-- ============================================================================
