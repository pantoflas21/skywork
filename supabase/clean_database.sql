-- ============================================================================
-- ALETHEIA - Script de Limpeza Completa do Banco de Dados
-- ============================================================================
-- ⚠️ ATENÇÃO: Este script apaga TODOS os dados do banco!
-- Use apenas para recomeçar do zero em ambiente de desenvolvimento/teste.
-- ============================================================================

-- Desabilitar temporariamente as verificações de foreign key
SET session_replication_role = 'replica';

-- ============================================================================
-- DELETAR TODOS OS DADOS DAS TABELAS (ordem reversa de dependências)
-- ============================================================================

-- Transações financeiras
DELETE FROM financial_transactions;
RAISE NOTICE 'financial_transactions limpa';

-- Matrículas em disciplinas
DELETE FROM enrollments;
RAISE NOTICE 'enrollments limpa';

-- Notas
DELETE FROM grades;
RAISE NOTICE 'grades limpa';

-- Frequência
DELETE FROM attendance;
RAISE NOTICE 'attendance limpa';

-- Aulas
DELETE FROM lessons;
RAISE NOTICE 'lessons limpa';

-- Alunos
DELETE FROM students;
RAISE NOTICE 'students limpa';

-- Turmas
DELETE FROM classes;
RAISE NOTICE 'classes limpa';

-- Disciplinas
DELETE FROM subjects;
RAISE NOTICE 'subjects limpa';

-- Professores
DELETE FROM teachers;
RAISE NOTICE 'teachers limpa';

-- Usuários (tabela users)
DELETE FROM users;
RAISE NOTICE 'users limpa';

-- Configurações do sistema
DELETE FROM system_settings;
RAISE NOTICE 'system_settings limpa';

-- Escolas
DELETE FROM schools;
RAISE NOTICE 'schools limpa';

-- Redes
DELETE FROM networks;
RAISE NOTICE 'networks limpa';

-- ============================================================================
-- LIMPAR AUTH (Supabase Authentication)
-- ============================================================================

-- Deletar todos os usuários do Supabase Auth
DELETE FROM auth.users;
RAISE NOTICE 'auth.users limpa';

-- ============================================================================
-- REABILITAR VERIFICAÇÕES DE FOREIGN KEY
-- ============================================================================
SET session_replication_role = 'origin';

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================

-- Contar registros em cada tabela
SELECT 
    'networks' as tabela, COUNT(*) as registros FROM networks
UNION ALL SELECT 'schools', COUNT(*) FROM schools
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'teachers', COUNT(*) FROM teachers
UNION ALL SELECT 'students', COUNT(*) FROM students
UNION ALL SELECT 'classes', COUNT(*) FROM classes
UNION ALL SELECT 'subjects', COUNT(*) FROM subjects
UNION ALL SELECT 'lessons', COUNT(*) FROM lessons
UNION ALL SELECT 'attendance', COUNT(*) FROM attendance
UNION ALL SELECT 'grades', COUNT(*) FROM grades
UNION ALL SELECT 'enrollments', COUNT(*) FROM enrollments
UNION ALL SELECT 'financial_transactions', COUNT(*) FROM financial_transactions
UNION ALL SELECT 'auth.users', COUNT(*) FROM auth.users
ORDER BY tabela;

-- Verificar se não existe Super Admin
SELECT 'Super Admins no sistema:' as verificacao, count_super_admins() as quantidade;

-- ============================================================================
-- RESULTADO ESPERADO
-- ============================================================================
-- Todas as tabelas devem ter 0 registros
-- Super Admins no sistema: 0
-- ============================================================================
