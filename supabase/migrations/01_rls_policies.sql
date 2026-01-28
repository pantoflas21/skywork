-- ============================================================================
-- ALETHEIA - Sistema de Gestão Escolar
-- Políticas RLS (Row Level Security)
-- Versão: 1.0.0
-- Data: 2026-01-27
-- ============================================================================
-- Garante isolamento multi-tenant e controle de acesso por role
-- ============================================================================

-- ============================================================================
-- FUNÇÃO AUXILIAR: Verificar se usuário é Super Admin
-- ============================================================================
CREATE OR REPLACE FUNCTION public.has_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'super_admin' AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNÇÃO AUXILIAR: Obter school_id do usuário atual
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_user_school_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT school_id FROM public.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNÇÃO AUXILIAR: Obter network_id do usuário atual
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_user_network_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT network_id FROM public.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNÇÃO AUXILIAR: Verificar se usuário tem role específico
-- ============================================================================
CREATE OR REPLACE FUNCTION public.user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = required_role AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS: NETWORKS (Redes de Ensino)
-- ============================================================================
ALTER TABLE networks ENABLE ROW LEVEL SECURITY;

-- Super Admin: acesso total
CREATE POLICY "Super Admin vê todas as redes"
ON networks FOR SELECT
USING (has_super_admin());

CREATE POLICY "Super Admin cria redes"
ON networks FOR INSERT
WITH CHECK (has_super_admin());

CREATE POLICY "Super Admin atualiza redes"
ON networks FOR UPDATE
USING (has_super_admin());

-- Network Admin: vê apenas sua rede
CREATE POLICY "Network Admin vê sua rede"
ON networks FOR SELECT
USING (
  user_has_role('network_admin') AND 
  id = get_user_network_id()
);

CREATE POLICY "Network Admin atualiza sua rede"
ON networks FOR UPDATE
USING (
  user_has_role('network_admin') AND 
  id = get_user_network_id()
);

-- ============================================================================
-- RLS: SCHOOLS (Escolas)
-- ============================================================================
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Super Admin: acesso total
CREATE POLICY "Super Admin vê todas as escolas"
ON schools FOR SELECT
USING (has_super_admin());

CREATE POLICY "Super Admin cria escolas"
ON schools FOR INSERT
WITH CHECK (has_super_admin());

CREATE POLICY "Super Admin atualiza escolas"
ON schools FOR UPDATE
USING (has_super_admin());

-- Network Admin: vê escolas da sua rede
CREATE POLICY "Network Admin vê escolas da sua rede"
ON schools FOR SELECT
USING (
  user_has_role('network_admin') AND 
  network_id = get_user_network_id()
);

CREATE POLICY "Network Admin cria escolas na sua rede"
ON schools FOR INSERT
WITH CHECK (
  user_has_role('network_admin') AND 
  network_id = get_user_network_id()
);

CREATE POLICY "Network Admin atualiza escolas da sua rede"
ON schools FOR UPDATE
USING (
  user_has_role('network_admin') AND 
  network_id = get_user_network_id()
);

-- Admin/Secretaria/Professor: vê apenas sua escola
CREATE POLICY "Usuários veem apenas sua escola"
ON schools FOR SELECT
USING (
  id = get_user_school_id()
);

-- ============================================================================
-- RLS: USERS (Usuários)
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Todos veem seu próprio perfil
CREATE POLICY "Usuários veem seu próprio perfil"
ON users FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Usuários atualizam seu próprio perfil"
ON users FOR UPDATE
USING (id = auth.uid());

-- Super Admin: acesso total
CREATE POLICY "Super Admin vê todos os usuários"
ON users FOR SELECT
USING (has_super_admin());

CREATE POLICY "Super Admin cria usuários"
ON users FOR INSERT
WITH CHECK (has_super_admin());

CREATE POLICY "Super Admin atualiza usuários"
ON users FOR UPDATE
USING (has_super_admin());

-- Network Admin: vê usuários das escolas da sua rede
CREATE POLICY "Network Admin vê usuários da sua rede"
ON users FOR SELECT
USING (
  user_has_role('network_admin') AND 
  (network_id = get_user_network_id() OR school_id IN (
    SELECT id FROM schools WHERE network_id = get_user_network_id()
  ))
);

-- Admin/Secretaria: vê usuários da mesma escola
CREATE POLICY "Admin e Secretaria veem usuários da escola"
ON users FOR SELECT
USING (
  (user_has_role('admin') OR user_has_role('secretaria')) AND 
  school_id = get_user_school_id()
);

CREATE POLICY "Admin e Secretaria criam usuários da escola"
ON users FOR INSERT
WITH CHECK (
  (user_has_role('admin') OR user_has_role('secretaria')) AND 
  school_id = get_user_school_id()
);

CREATE POLICY "Admin e Secretaria atualizam usuários da escola"
ON users FOR UPDATE
USING (
  (user_has_role('admin') OR user_has_role('secretaria')) AND 
  school_id = get_user_school_id()
);

-- Professor: vê usuários da mesma escola (limitado)
CREATE POLICY "Professores veem usuários da escola"
ON users FOR SELECT
USING (
  user_has_role('professor') AND 
  school_id = get_user_school_id()
);

-- ============================================================================
-- RLS: TEACHERS (Professores)
-- ============================================================================
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Admin/Secretaria: gerencia professores da escola
CREATE POLICY "Admin e Secretaria gerenciam professores"
ON teachers FOR ALL
USING (school_id = get_user_school_id());

-- Super Admin e Network Admin: acesso total às suas escolas
CREATE POLICY "Super Admin vê todos os professores"
ON teachers FOR SELECT
USING (has_super_admin());

CREATE POLICY "Network Admin vê professores da rede"
ON teachers FOR SELECT
USING (
  user_has_role('network_admin') AND 
  school_id IN (SELECT id FROM schools WHERE network_id = get_user_network_id())
);

-- ============================================================================
-- RLS: SUBJECTS (Disciplinas)
-- ============================================================================
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Usuários da escola veem disciplinas
CREATE POLICY "Usuários veem disciplinas da escola"
ON subjects FOR SELECT
USING (school_id = get_user_school_id());

-- Admin/Secretaria: gerencia disciplinas
CREATE POLICY "Admin e Secretaria gerenciam disciplinas"
ON subjects FOR ALL
USING (school_id = get_user_school_id());

-- ============================================================================
-- RLS: CLASSES (Turmas)
-- ============================================================================
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Usuários da escola veem turmas
CREATE POLICY "Usuários veem turmas da escola"
ON classes FOR SELECT
USING (school_id = get_user_school_id());

-- Admin/Secretaria: gerencia turmas
CREATE POLICY "Admin e Secretaria gerenciam turmas"
ON classes FOR ALL
USING (school_id = get_user_school_id());

-- Professor: vê suas turmas
CREATE POLICY "Professores veem suas turmas"
ON classes FOR SELECT
USING (
  user_has_role('professor') AND 
  teacher_id = auth.uid()
);

-- ============================================================================
-- RLS: STUDENTS (Alunos)
-- ============================================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Aluno vê apenas seu próprio perfil
CREATE POLICY "Alunos veem seu próprio perfil"
ON students FOR SELECT
USING (user_id = auth.uid());

-- Admin/Secretaria/Professor: veem alunos da escola
CREATE POLICY "Staff vê alunos da escola"
ON students FOR SELECT
USING (
  (user_has_role('admin') OR user_has_role('secretaria') OR user_has_role('professor')) AND 
  school_id = get_user_school_id()
);

-- Admin/Secretaria: gerencia alunos
CREATE POLICY "Admin e Secretaria gerenciam alunos"
ON students FOR INSERT
WITH CHECK (school_id = get_user_school_id());

CREATE POLICY "Admin e Secretaria atualizam alunos"
ON students FOR UPDATE
USING (school_id = get_user_school_id());

-- ============================================================================
-- RLS: LESSONS (Aulas)
-- ============================================================================
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Professor: gerencia suas aulas
CREATE POLICY "Professores gerenciam suas aulas"
ON lessons FOR ALL
USING (teacher_id = auth.uid());

-- Secretaria: vê aulas da escola
CREATE POLICY "Secretaria vê aulas da escola"
ON lessons FOR SELECT
USING (
  user_has_role('secretaria') AND 
  school_id = get_user_school_id()
);

-- Alunos: veem aulas da sua turma
CREATE POLICY "Alunos veem aulas da sua turma"
ON lessons FOR SELECT
USING (
  user_has_role('aluno') AND 
  class_id IN (SELECT class_id FROM students WHERE user_id = auth.uid())
);

-- ============================================================================
-- RLS: ATTENDANCE (Frequência)
-- ============================================================================
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Professor: gerencia frequência das suas turmas
CREATE POLICY "Professores gerenciam frequência das suas turmas"
ON attendance FOR ALL
USING (
  teacher_id = auth.uid() OR
  class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid())
);

-- Secretaria: vê toda frequência da escola
CREATE POLICY "Secretaria vê frequência da escola"
ON attendance FOR ALL
USING (
  user_has_role('secretaria') AND 
  school_id = get_user_school_id()
);

-- Aluno: vê apenas sua frequência
CREATE POLICY "Alunos veem sua própria frequência"
ON attendance FOR SELECT
USING (
  user_has_role('aluno') AND 
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);

-- ============================================================================
-- RLS: GRADES (Notas)
-- ============================================================================
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Professor: gerencia notas das suas turmas
CREATE POLICY "Professores gerenciam notas das suas turmas"
ON grades FOR ALL
USING (
  teacher_id = auth.uid() OR
  class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid())
);

-- Secretaria: vê todas as notas da escola
CREATE POLICY "Secretaria vê notas da escola"
ON grades FOR ALL
USING (
  user_has_role('secretaria') AND 
  school_id = get_user_school_id()
);

-- Aluno: vê apenas suas notas
CREATE POLICY "Alunos veem apenas suas próprias notas"
ON grades FOR SELECT
USING (
  user_has_role('aluno') AND 
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);

-- ============================================================================
-- RLS: ENROLLMENTS (Matrículas em Disciplinas)
-- ============================================================================
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Admin/Secretaria: gerencia matrículas
CREATE POLICY "Admin e Secretaria gerenciam matrículas"
ON enrollments FOR ALL
USING (
  (user_has_role('admin') OR user_has_role('secretaria')) AND 
  student_id IN (SELECT id FROM students WHERE school_id = get_user_school_id())
);

-- Professor/Aluno: vê matrículas
CREATE POLICY "Usuários veem matrículas relacionadas"
ON enrollments FOR SELECT
USING (
  student_id IN (SELECT id FROM students WHERE school_id = get_user_school_id()) OR
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
);

-- ============================================================================
-- RLS: FINANCIAL_TRANSACTIONS (Transações Financeiras)
-- ============================================================================
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Admin: gerencia financeiro da escola
CREATE POLICY "Admin gerencia financeiro"
ON financial_transactions FOR ALL
USING (
  user_has_role('admin') AND 
  school_id = get_user_school_id()
);

-- Secretaria: vê financeiro da escola
CREATE POLICY "Secretaria vê financeiro"
ON financial_transactions FOR SELECT
USING (
  user_has_role('secretaria') AND 
  school_id = get_user_school_id()
);

-- Network Admin: vê financeiro das escolas da rede
CREATE POLICY "Network Admin vê financeiro da rede"
ON financial_transactions FOR SELECT
USING (
  user_has_role('network_admin') AND 
  school_id IN (SELECT id FROM schools WHERE network_id = get_user_network_id())
);

-- Super Admin: acesso total
CREATE POLICY "Super Admin vê todo financeiro"
ON financial_transactions FOR SELECT
USING (has_super_admin());

-- ============================================================================
-- RLS: SYSTEM_SETTINGS (Configurações do Sistema)
-- ============================================================================
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Admin: gerencia configurações da escola
CREATE POLICY "Admin gerencia configurações"
ON system_settings FOR ALL
USING (
  user_has_role('admin') AND 
  school_id = get_user_school_id()
);

-- Outros usuários: apenas leitura
CREATE POLICY "Usuários veem configurações da escola"
ON system_settings FOR SELECT
USING (school_id = get_user_school_id());

-- ============================================================================
-- FIM DAS POLÍTICAS RLS
-- ============================================================================
