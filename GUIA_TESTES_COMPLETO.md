# 🧪 GUIA COMPLETO DE TESTES - SISTEMA ALETHEIA

## 📋 INSTRUÇÕES INICIAIS

### PASSO 1: Validar Arquivo .env

**Localização:** `C:\Users\Pantóflas\Downloads\net\.env`

Abra o arquivo `.env` e verifique se está assim:

```env
VITE_SUPABASE_URL=https://dhwtumzkroveaijsrarg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRod3R1bXprcm92ZWFpanNyYXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNzAwOTEsImV4cCI6MjA4NDk0NjA5MX0.n3D0Gb1iwoHBtP7JtyqG9xQLDbE7clJ0C5tjgNHRCUc
```

✅ **Sem aspas** ao redor dos valores
✅ **Sem espaços extras**

---

### PASSO 2: Aplicar Migrações SQL no Supabase

**URL Supabase SQL Editor:** https://app.supabase.com/project/dhwtumzkroveaijsrarg/sql/new

#### Migração 1 de 3: Schema Completo

1. Abra o arquivo: `supabase/migrations/00_init_complete_schema.sql`
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** ou Ctrl+Enter
5. Aguarde: "Success. No rows returned"

**Verificação:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```
Deve retornar 13 tabelas.

#### Migração 2 de 3: Políticas RLS

1. Abra o arquivo: `supabase/migrations/01_rls_policies.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Clique em **"Run"**
5. Aguarde conclusão (~10 segundos)

**Verificação:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```
Todas as tabelas devem ter `rowsecurity = true`.

#### Migração 3 de 3: Funções de Setup

1. Abra o arquivo: `supabase/migrations/02_initial_setup.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Clique em **"Run"**

**Verificação:**
```sql
SELECT check_has_super_admin();
```
Deve retornar: `false`

✅ **Checklist de Migrações:**
- [ ] Migração 00 executada (13 tabelas criadas)
- [ ] Migração 01 executada (RLS habilitado)
- [ ] Migração 02 executada (funções criadas)
- [ ] Verificações SQL passaram

---

### PASSO 3: Iniciar Servidor de Desenvolvimento

Abra **PowerShell** na pasta do projeto:

```powershell
cd C:\Users\Pantóflas\Downloads\net
npm run dev
```

**Saída esperada:**
```
➜  Local:   http://localhost:5173/
```

✅ Abra no navegador: **http://localhost:5173**
✅ Página de login deve carregar
✅ Abra console (F12) → **Sem erros relacionados a Supabase**

---

## 🎯 CRIAÇÃO DE DADOS DE TESTE

Siga **EXATAMENTE** esta ordem:

### 1️⃣ SUPER ADMIN (Primeiro Usuário)

**URL:** http://localhost:5173/#/setup

**Dados:**
```
Nome Completo:      Super Administrador
Email:              superadmin@aletheia.com
Senha:              Super@123456
Confirmar Senha:    Super@123456
```

✅ Clicar em "Criar Super Administrador"
✅ Aguardar mensagem de sucesso
✅ Será redirecionado para /login

---

### 2️⃣ LOGIN SUPER ADMIN

**URL:** http://localhost:5173/#/login

**Credenciais:**
```
Email:     superadmin@aletheia.com
Senha:     Super@123456
```

✅ Dashboard Super Admin deve carregar

---

### 3️⃣ CRIAR REDE DE ENSINO

**Localização:** Super Admin → Menu "Redes" → "Nova Rede"

**Dados:**
```
Nome da Rede:       Rede Municipal de Ensino
CNPJ:               12.345.678/0001-90
Email da Rede:      contato@redemunicipal.edu.br
Telefone:           (11) 3456-7890

Admin da Rede:
Nome Completo:      Carlos Silva
Email:              carlos.silva@redemunicipal.edu.br
Senha:              Network@123
```

✅ Salvar
✅ Rede aparece na listagem

---

### 4️⃣ CRIAR ESCOLA

**Localização:** Super Admin → Menu "Escolas" → "Nova Escola"

**Dados:**
```
Nome da Escola:     Escola Municipal Dom Pedro II
Email:              contato@escolapedro.edu.br
Telefone:           (11) 3456-7891
Endereço:           Rua das Flores, 123
Cidade:             São Paulo
Estado:             SP
CEP:                01234-567
Rede:               Rede Municipal de Ensino (selecionar)

Admin da Escola:
Nome Completo:      Maria Santos
Email:              maria.santos@escolapedro.edu.br
Senha:              Admin@123
```

✅ Salvar
✅ Escola aparece na listagem

---

### 5️⃣ LOGOUT E LOGIN COMO ADMIN DA ESCOLA

**Logout:** Clicar no ícone de usuário → "Sair"

**Login Admin:**
```
Email:     maria.santos@escolapedro.edu.br
Senha:     Admin@123
```

✅ Dashboard Admin (Escola) deve carregar

---

### 6️⃣ CRIAR USUÁRIOS DA ESCOLA

**Localização:** Admin Dashboard → Menu "Usuários" → "Novo Usuário"

**Usuário 1: Secretaria**
```
Nome Completo:      Ana Costa
Email:              ana.costa@escolapedro.edu.br
Role:               Secretaria
Telefone:           (11) 98765-4321
CPF:                123.456.789-00
Senha:              Secret@123
```

✅ Salvar

**Usuário 2: Professor**
```
Nome Completo:      João Oliveira
Email:              joao.oliveira@escolapedro.edu.br
Role:               Professor
Telefone:           (11) 98765-4322
CPF:                987.654.321-00
Especialização:     Matemática e Física
Senha:              Prof@123
```

✅ Salvar
✅ Ambos aparecem na listagem

---

### 7️⃣ LOGOUT E LOGIN COMO SECRETARIA

**Logout do Admin**

**Login Secretaria:**
```
Email:     ana.costa@escolapedro.edu.br
Senha:     Secret@123
```

✅ Dashboard Secretaria deve carregar

---

### 8️⃣ CRIAR TURMA

**Localização:** Secretaria → Menu "Turmas" → "Nova Turma"

**Dados:**
```
Nome da Turma:          3º Ano A
Nível:                  Fundamental 1
Ano Letivo:             2026
Turno:                  Matutino
Professor Regente:      João Oliveira (selecionar)
Capacidade Máxima:      35
```

✅ Salvar
✅ Turma aparece na listagem

---

### 9️⃣ MATRICULAR ALUNO 1 (SEM LOGIN)

**Localização:** Secretaria → Menu "Alunos" → "Matricular Novo Aluno"

**Dados:**
```
Nome do Aluno:          Pedro Henrique Silva
Data de Nascimento:     15/03/2016
Turma:                  3º Ano A (selecionar)

Responsável:
Nome:                   Roberto Silva
Telefone:               (11) 99876-5432
Email:                  roberto.silva@email.com
CPF:                    111.222.333-44

Necessidades Especiais: Não
```

✅ Salvar
✅ Matrícula gerada automaticamente (ex: 20260001)
✅ Aluno aparece na listagem com Status: Ativo

---

### 🔟 MATRICULAR ALUNO 2 (COM LOGIN)

**Localização:** Secretaria → Menu "Alunos" → "Matricular Novo Aluno"

**Dados:**
```
Nome do Aluno:          Júlia Fernandes Costa
Data de Nascimento:     20/05/2016
Turma:                  3º Ano A (selecionar)
Criar Login:            SIM ✅ (marcar checkbox)
Email:                  julia.fernandes@escolapedro.edu.br
Senha:                  Aluno@123

Responsável:
Nome:                   Fernanda Costa
Telefone:               (11) 99876-5433
Email:                  fernanda.costa@email.com
CPF:                    222.333.444-55

Necessidades Especiais: Não
```

✅ Salvar
✅ Login criado para o aluno

---

### 1️⃣1️⃣ LOGOUT E LOGIN COMO PROFESSOR

**Logout da Secretaria**

**Login Professor:**
```
Email:     joao.oliveira@escolapedro.edu.br
Senha:     Prof@123
```

✅ Dashboard Professor deve carregar
✅ Deve mostrar turma "3º Ano A"
✅ Deve mostrar 2 alunos (Pedro e Júlia)

---

### 1️⃣2️⃣ LANÇAR FREQUÊNCIA (CHAMADA)

**Localização:** Professor → Menu "Chamada"

**Dados:**
```
Turma:                  3º Ano A (selecionar)
Data:                   27/01/2026 (hoje)
```

**Marcar presença:**
- Pedro Henrique Silva: **Presente** ✅
- Júlia Fernandes Costa: **Presente** ✅

✅ Clicar em "Salvar Chamada"
✅ Mensagem de sucesso

---

### 1️⃣3️⃣ LANÇAR NOTAS

**Localização:** Professor → Menu "Notas"

**Dados da Avaliação:**
```
Turma:                  3º Ano A (selecionar)
Disciplina:             Matemática
Bimestre:               1º Bimestre
Tipo de Avaliação:      Prova
Nome da Avaliação:      Prova Bimestral - Matemática
Data:                   27/01/2026
Peso:                   1.0
```

**Notas:**
- Pedro Henrique Silva: **8.5**
- Júlia Fernandes Costa: **9.0**

✅ Salvar
✅ Notas aparecem na listagem

---

### 1️⃣4️⃣ LOGOUT E LOGIN COMO ALUNO

**Logout do Professor**

**Login Aluno:**
```
Email:     julia.fernandes@escolapedro.edu.br
Senha:     Aluno@123
```

✅ Dashboard Aluno deve carregar
✅ Deve mostrar nota de Matemática: **9.0**
✅ Deve mostrar frequência: **100%** (1 presente de 1 dia)
✅ **NÃO** deve mostrar dados de Pedro

---

## ✅ CREDENCIAIS CRIADAS - RESUMO

```
============================================
CREDENCIAIS DE TESTE - SISTEMA ALETHEIA
============================================

URL: http://localhost:5173

1. SUPER ADMIN
   Email: superadmin@aletheia.com
   Senha: Super@123456

2. NETWORK ADMIN
   Email: carlos.silva@redemunicipal.edu.br
   Senha: Network@123

3. ADMIN (ESCOLA)
   Email: maria.santos@escolapedro.edu.br
   Senha: Admin@123

4. SECRETARIA
   Email: ana.costa@escolapedro.edu.br
   Senha: Secret@123

5. PROFESSOR
   Email: joao.oliveira@escolapedro.edu.br
   Senha: Prof@123

6. ALUNO
   Email: julia.fernandes@escolapedro.edu.br
   Senha: Aluno@123

============================================
ORDEM DE TESTE RECOMENDADA:
1. Super Admin → Criar estrutura
2. Network Admin → Ver rede
3. Admin → Gerenciar escola
4. Secretaria → Matricular alunos
5. Professor → Lançar notas/chamada
6. Aluno → Visualizar dados
============================================
```

---

## 🧪 CHECKLIST DE VALIDAÇÃO POR PAINEL

### ✅ SUPER ADMIN
- [ ] Dashboard carrega com estatísticas (1 rede, 1 escola, 6 usuários)
- [ ] Lista "Rede Municipal de Ensino"
- [ ] Lista "Escola Municipal Dom Pedro II"
- [ ] Pode criar nova rede
- [ ] Pode criar nova escola
- [ ] Gráficos renderizam

### ✅ NETWORK ADMIN
- [ ] Dashboard carrega com estatísticas da rede
- [ ] Vê APENAS escola "Dom Pedro II" (da sua rede)
- [ ] Mostra 2 alunos da rede
- [ ] **NÃO** vê escolas de outras redes

### ✅ ADMIN (ESCOLA)
- [ ] Dashboard carrega com estatísticas da escola
- [ ] Mostra 2 alunos, 1 turma, 1 professor
- [ ] Lista secretaria e professor
- [ ] Pode criar novos usuários
- [ ] Pode lançar transações financeiras
- [ ] **NÃO** vê usuários de outras escolas

### ✅ SECRETARIA
- [ ] Dashboard carrega
- [ ] Lista 2 alunos (Pedro e Júlia)
- [ ] Lista 1 turma (3º Ano A)
- [ ] Pode matricular novo aluno
- [ ] Pode criar nova turma
- [ ] Busca por nome funciona
- [ ] **NÃO** vê alunos de outras escolas

### ✅ PROFESSOR
- [ ] Dashboard mostra turma "3º Ano A"
- [ ] Vê 2 alunos da turma
- [ ] Conseguiu lançar chamada
- [ ] Conseguiu lançar notas
- [ ] Pode editar notas lançadas
- [ ] **NÃO** vê turmas de outros professores

### ✅ ALUNO
- [ ] Dashboard mostra nota de Matemática: 9.0
- [ ] Dashboard mostra frequência: 100%
- [ ] Mostra turma: 3º Ano A
- [ ] Gráficos de desempenho renderizam
- [ ] **NÃO** vê dados de Pedro (outro aluno)
- [ ] **NÃO** tem acesso a rotas administrativas

---

## 🔒 TESTES DE SEGURANÇA

### Teste 1: Isolamento Multi-Tenant
1. Login como Admin da Escola
2. Abrir console (F12)
3. Executar:
```javascript
const { data } = await supabase.from('students').select('*');
console.log(data);
```
✅ Deve retornar APENAS 2 alunos (da sua escola)

### Teste 2: Proteção de Rotas
1. Login como Aluno
2. Tentar acessar: http://localhost:5173/#/admin/dashboard
✅ Deve redirecionar para `/unauthorized`

### Teste 3: Proteção de Dados
1. Login como Aluno (Júlia)
2. Tentar consultar dados de Pedro via console
✅ Deve retornar vazio ou erro de permissão

---

## 🚨 TROUBLESHOOTING

### ❌ Erro: "Missing Supabase environment variables"
**Solução:** Verificar arquivo `.env` existe e está correto

### ❌ Erro: "relation does not exist"
**Solução:** Aplicar migrações SQL no Supabase (Passo 2)

### ❌ Erro: "Row Level Security policy violation"
**Solução:** Aplicar migração `01_rls_policies.sql`

### ❌ Página em branco
**Solução:** 
1. Abrir console (F12)
2. Verificar erros
3. Corrigir `.env` se necessário
4. Reiniciar servidor (`npm run dev`)

### ❌ Login não funciona
**Solução:**
1. Verificar se usuário foi criado corretamente
2. Verificar email e senha (case-sensitive)
3. Abrir console para ver erros de RLS

---

## 📊 URLS RÁPIDAS

```
Login:            http://localhost:5173/#/login
Setup:            http://localhost:5173/#/setup

Super Admin:      http://localhost:5173/#/superadmin/dashboard
Network Admin:    http://localhost:5173/#/networkadmin/dashboard
Admin:            http://localhost:5173/#/admin/dashboard
Secretaria:       http://localhost:5173/#/secretaria/dashboard
Professor:        http://localhost:5173/#/professor/dashboard
Aluno:            http://localhost:5173/#/aluno/dashboard
```

---

## ✅ VALIDAÇÃO FINAL

Após completar todos os passos, você terá:

✅ Banco de dados configurado com RLS
✅ 6 usuários criados (super_admin, network_admin, admin, secretaria, professor, aluno)
✅ 1 Rede de Ensino
✅ 1 Escola vinculada à rede
✅ 1 Turma (3º Ano A)
✅ 2 Alunos matriculados
✅ Frequência lançada (100% presente)
✅ Notas lançadas (Matemática: Pedro 8.5, Júlia 9.0)
✅ Todos os painéis funcionais
✅ Segurança multi-tenant validada

**Sistema 100% funcional e pronto para testes completos!** 🚀
