-- ============================================================================
-- ALETHEIA - Sistema de Gestão Escolar
-- Setup Inicial e Funções Auxiliares
-- Versão: 1.0.0
-- Data: 2026-01-27
-- ============================================================================
-- Script para facilitar a configuração inicial do sistema
-- ============================================================================

-- ============================================================================
-- FUNÇÃO: Verificar se já existe Super Admin no sistema
-- ============================================================================
CREATE OR REPLACE FUNCTION public.check_has_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE role = 'super_admin' AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNÇÃO: Contar Super Admins ativos
-- ============================================================================
CREATE OR REPLACE FUNCTION public.count_super_admins()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM public.users
    WHERE role = 'super_admin' AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNÇÃO: Criar primeiro Super Admin
-- Esta função pode ser chamada apenas uma vez durante o setup inicial
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_first_super_admin(
  p_user_id UUID,
  p_email TEXT,
  p_full_name TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Verificar se já existe super admin
  SELECT count_super_admins() INTO v_count;
  
  IF v_count > 0 THEN
    RAISE EXCEPTION 'Já existe um Super Admin no sistema';
  END IF;
  
  -- Inserir super admin
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    active,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_email,
    p_full_name,
    'super_admin',
    true,
    NOW(),
    NOW()
  );
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erro ao criar Super Admin: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNÇÃO: Obter estatísticas do sistema (apenas para Super Admin)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_system_stats()
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Verificar se usuário é super admin
  IF NOT has_super_admin() THEN
    RAISE EXCEPTION 'Acesso negado: apenas Super Admin';
  END IF;
  
  SELECT json_build_object(
    'total_networks', (SELECT COUNT(*) FROM networks WHERE active = true),
    'total_schools', (SELECT COUNT(*) FROM schools WHERE active = true),
    'total_users', (SELECT COUNT(*) FROM users WHERE active = true),
    'total_students', (SELECT COUNT(*) FROM students WHERE status = 'ativo'),
    'total_teachers', (SELECT COUNT(*) FROM teachers WHERE status = 'ativo'),
    'total_classes', (SELECT COUNT(*) FROM classes WHERE active = true),
    'users_by_role', (
      SELECT json_object_agg(role, count)
      FROM (
        SELECT role, COUNT(*) as count
        FROM users
        WHERE active = true
        GROUP BY role
      ) sub
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNÇÃO: Validar estrutura de email
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- FUNÇÃO: Validar CPF (formato)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_valid_cpf_format(cpf TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Remove caracteres não numéricos
  cpf := regexp_replace(cpf, '[^0-9]', '', 'g');
  
  -- Verifica se tem 11 dígitos
  RETURN length(cpf) = 11;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- FUNÇÃO: Gerar número de matrícula único
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_registration_number(p_school_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_count INTEGER;
  v_registration TEXT;
BEGIN
  v_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  
  -- Contar alunos da escola no ano atual
  SELECT COUNT(*) INTO v_count
  FROM students
  WHERE school_id = p_school_id
    AND EXTRACT(YEAR FROM enrollment_date) = EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Formato: ANO + 4 dígitos sequenciais
  v_registration := v_year || LPAD((v_count + 1)::TEXT, 4, '0');
  
  RETURN v_registration;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON FUNCTION check_has_super_admin() IS 'Verifica se existe pelo menos um Super Admin ativo no sistema';
COMMENT ON FUNCTION count_super_admins() IS 'Retorna o número de Super Admins ativos';
COMMENT ON FUNCTION create_first_super_admin(UUID, TEXT, TEXT) IS 'Cria o primeiro Super Admin (pode ser chamado apenas uma vez)';
COMMENT ON FUNCTION get_system_stats() IS 'Retorna estatísticas gerais do sistema (apenas Super Admin)';
COMMENT ON FUNCTION is_valid_email(TEXT) IS 'Valida formato de email';
COMMENT ON FUNCTION is_valid_cpf_format(TEXT) IS 'Valida formato de CPF (11 dígitos)';
COMMENT ON FUNCTION generate_registration_number(UUID) IS 'Gera número de matrícula único por escola e ano';

-- ============================================================================
-- INSTRUÇÕES DE USO
-- ============================================================================

/*
=== CRIAÇÃO DO PRIMEIRO SUPER ADMIN ===

1. Acesse a interface web em: /setup

2. O sistema irá:
   - Criar um usuário no Supabase Auth
   - Chamar a função create_first_super_admin()
   - Redirecionar para o login

3. Após o primeiro Super Admin criado, a rota /setup será desabilitada

=== VERIFICAR STATUS DO SISTEMA ===

Para verificar se já existe Super Admin:
  SELECT check_has_super_admin();

Para contar Super Admins:
  SELECT count_super_admins();

Para ver estatísticas (como Super Admin):
  SELECT get_system_stats();

=== ESTRUTURA DE ROLES ===

1. super_admin     - Acesso total ao sistema, gerencia redes e escolas
2. network_admin   - Gerencia uma rede e suas escolas
3. admin           - Gerencia uma escola individual
4. secretaria      - Gestão de alunos, turmas e matrículas
5. professor       - Lançamento de notas e frequência
6. aluno           - Visualização de notas e frequência

=== ORDEM DE CRIAÇÃO ===

1. Super Admin (via /setup)
2. Redes de Ensino (via Super Admin Dashboard)
3. Escolas (via Super Admin ou Network Admin)
4. Admin da Escola (criado automaticamente com a escola)
5. Funcionários - Secretaria e Professores (via Admin Dashboard)
6. Alunos (via Secretaria)

*/

-- ============================================================================
-- FIM DO SCRIPT DE SETUP
-- ============================================================================
