# 🚀 Guia de Deploy - ALETHEIA

Este guia detalha o processo completo de deploy do sistema ALETHEIA no Netlify com backend Supabase.

---

## 📋 Pré-requisitos

- [ ] Conta no GitHub com repositório configurado
- [ ] Conta no Supabase (projeto criado)
- [ ] Conta no Netlify
- [ ] Node.js 18+ instalado localmente
- [ ] Git configurado

---

## 🔧 Preparação Local

### 1. Validar Build Local

```bash
# Instalar dependências
npm install

# Executar build
npm run build

# Preview do build
npm run preview
```

**Verificações:**
- [ ] Build executou sem erros TypeScript
- [ ] Preview abre corretamente em http://localhost:4173
- [ ] Login funciona no preview
- [ ] Nenhum erro no console do navegador

### 2. Verificar Estrutura de Arquivos

```bash
# Arquivos que DEVEM existir:
ls -la dist/                    # Diretório de build
ls -la supabase/migrations/     # Migrações SQL
cat .env                        # Variáveis locais (NÃO COMMITAR)
cat env.example                 # Exemplo para outros devs
cat netlify.toml                # Config Netlify
```

### 3. Limpar Repositório

```bash
# Verificar status do Git
git status

# Remover arquivos não rastreados desnecessários
rm -f *.log
rm -f .env  # NUNCA commitar .env com credenciais reais

# Adicionar alterações
git add .

# Commit
git commit -m "feat: preparar sistema para deploy em produção"

# Push para repositório remoto
git push origin main
```

---

## 🗄️ Configuração do Supabase (Backend)

### 1. Criar Projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Name**: aletheia-producao (ou nome desejado)
   - **Database Password**: Senha segura (SALVE EM LOCAL SEGURO)
   - **Region**: Escolha mais próxima dos usuários
4. Aguarde criação do projeto (~2 minutos)

### 2. Executar Migrações SQL

**⚠️ IMPORTANTE:** Execute na ordem exata!

1. Abra **SQL Editor** no Supabase Dashboard
2. Execute cada arquivo na ordem:

#### Migração 1: Schema Completo
```bash
# Copie todo o conteúdo de:
supabase/migrations/00_init_complete_schema.sql

# Cole no SQL Editor
# Clique em "Run" ou Ctrl+Enter
# Aguarde conclusão (deve aparecer "Success")
```

#### Migração 2: Políticas RLS
```bash
# Copie todo o conteúdo de:
supabase/migrations/01_rls_policies.sql

# Cole no SQL Editor
# Run
```

#### Migração 3: Funções de Setup
```bash
# Copie todo o conteúdo de:
supabase/migrations/02_initial_setup.sql

# Cole no SQL Editor
# Run
```

### 3. Validar Estrutura do Banco

```sql
-- Execute no SQL Editor para verificar:

-- 1. Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Deve retornar: attendance, classes, enrollments, financial_transactions,
-- grades, lessons, networks, schools, students, subjects, system_settings,
-- teachers, users

-- 2. Verificar RLS habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Todas as tabelas devem ter rowsecurity = true

-- 3. Verificar se pode criar super admin
SELECT check_has_super_admin();

-- Deve retornar: false (ainda não existe super admin)
```

### 4. Obter Credenciais

1. Vá em **Settings > API**
2. Copie:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **anon/public key**: (chave longa começando com `eyJ...`)

**⚠️ IMPORTANTE:** 
- Use apenas a **anon key**, NUNCA a **service_role key**
- A anon key é pública e segura para o frontend
- A service_role key tem acesso total e NUNCA deve ser exposta

---

## 🌐 Configuração do Netlify (Frontend)

### 1. Conectar Repositório

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Clique em "Add new site" > "Import an existing project"
3. Selecione "GitHub" (ou GitLab/Bitbucket)
4. Autorize o Netlify a acessar seus repositórios
5. Selecione o repositório do ALETHEIA

### 2. Configurar Build

**Configurações recomendadas:**

```
Base directory:     (deixe vazio)
Build command:      npm ci && npm run build
Publish directory:  dist
```

**⚠️ NÃO** clique em "Deploy site" ainda!

### 3. Adicionar Variáveis de Ambiente

1. Vá em **Site settings** > **Environment variables**
2. Clique em **Add a variable**
3. Adicione AMBAS as variáveis:

**Variável 1:**
```
Key:    VITE_SUPABASE_URL
Value:  https://seu-projeto.supabase.co
```

**Variável 2:**
```
Key:    VITE_SUPABASE_ANON_KEY
Value:  eyJhbGc... (sua anon key completa)
```

**⚠️ CUIDADO:**
- Cole as chaves SEM espaços extras
- SEM aspas ao redor
- Confirme que copiou a chave completa

### 4. Configurar Domínio (Opcional)

1. Vá em **Domain settings**
2. O Netlify gera um domínio automático: `nome-aleatorio.netlify.app`
3. Para domínio customizado:
   - Clique em "Add custom domain"
   - Digite seu domínio (ex: `aletheia.suaescola.com.br`)
   - Siga instruções para configurar DNS

### 5. Deploy Inicial

1. Volte para **Deploys**
2. Clique em "Trigger deploy" > "Deploy site"
3. Aguarde o build (~2-5 minutos)
4. Status deve ficar "Published"

---

## ✅ Validação Pós-Deploy

### 1. Testar Aplicação

```bash
# Abra a URL do Netlify
https://seu-site.netlify.app

# Deve carregar a página de login
```

**Checklist visual:**
- [ ] Página carrega sem erros
- [ ] Não há avisos no console do navegador (F12)
- [ ] Formulário de login está visível
- [ ] CSS/Tailwind está aplicado corretamente

### 2. Criar Primeiro Super-Admin

```bash
# Acesse a rota de setup
https://seu-site.netlify.app/#/setup

# Preencha o formulário:
Nome completo:    Admin Sistema
Email:            admin@aletheia.com
Senha:            (senha forte com 8+ caracteres)
Confirmar senha:  (mesma senha)

# Clique em "Criar Super Administrador"
```

**Resultado esperado:**
- Mensagem de sucesso
- Redirecionamento para login
- Pode fazer login com as credenciais criadas

### 3. Testar Login

```bash
# Na página de login, use:
Email:    admin@aletheia.com
Senha:    (senha que você criou)

# Clique em "Entrar"
```

**Resultado esperado:**
- Login bem-sucedido
- Redirecionamento para `/superadmin/dashboard`
- Dashboard carrega com estatísticas zeradas

### 4. Verificar RLS (Segurança)

No Supabase Dashboard, vá em **Table Editor** e tente:

```sql
-- Como super admin, deve conseguir inserir:
INSERT INTO schools (name, email) 
VALUES ('Escola Teste', 'teste@escola.com');

-- Verifique que inseriu
SELECT * FROM schools;

-- Limpe o teste
DELETE FROM schools WHERE email = 'teste@escola.com';
```

### 5. Testar Fluxo Completo

Como **Super Admin**, teste:
- [ ] Criar rede de ensino
- [ ] Criar escola (com admin automático)
- [ ] Logout e login como admin da escola
- [ ] Como admin: criar usuário secretaria
- [ ] Logout e login como secretaria
- [ ] Como secretaria: matricular aluno
- [ ] Verificar isolamento (admin não vê outras escolas)

---

## 🔄 Deploy Contínuo

### Configuração Automática

O Netlify está configurado para deploy automático:

```bash
# Qualquer push para a branch main:
git push origin main

# Inicia automaticamente:
# 1. Pull do código
# 2. npm ci (instalação limpa)
# 3. npm run build
# 4. Deploy para CDN
# 5. URL atualizada em ~2 minutos
```

### Deploy Manual (se necessário)

```bash
# No Netlify Dashboard:
Deploys > Trigger deploy > Clear cache and deploy site
```

---

## 🛠️ Troubleshooting

### Erro: Build falhou no Netlify

**Sintoma:** Build status = "Failed"

**Soluções:**
1. Verifique logs no Netlify:
   ```
   Deploys > [Build mais recente] > Deploy log
   ```

2. Erros comuns:
   ```
   Error: Cannot find module...
   → Executar: npm install <modulo-faltando>
   → Commitar e push
   
   TypeScript errors
   → Corrigir erros localmente
   → npm run build (deve passar)
   → Commitar e push
   
   Missing environment variables
   → Confirmar que variáveis estão em:
     Site settings > Environment variables
   ```

### Erro: Página em branco após deploy

**Sintoma:** Site carrega mas mostra tela branca

**Soluções:**
1. Abra console do navegador (F12)
2. Procure erros:
   ```
   Missing Supabase environment variables
   → Adicionar variáveis no Netlify
   
   Failed to fetch
   → Verificar URL do Supabase (sem barra no final)
   
   401 Unauthorized
   → Verificar anon key do Supabase
   ```

### Erro: Cannot read properties of null (reading 'id')

**Sintoma:** Erro ao tentar acessar páginas protegidas

**Soluções:**
1. Logout e login novamente
2. Verificar se usuário existe na tabela `users`:
   ```sql
   SELECT * FROM users WHERE email = 'seu-email@exemplo.com';
   ```
3. Se não existir, verificar se foi criado via `/setup`

### Erro: Row Level Security policy violation

**Sintoma:** Erro ao tentar acessar dados

**Soluções:**
1. Verificar se RLS está habilitado:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```

2. Verificar se políticas foram criadas:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

3. Re-executar `01_rls_policies.sql` se necessário

### Erro: relation "users_2026_01_26_15_30" does not exist

**Sintoma:** Erro mencionando tabelas com sufixo de data

**Causa:** Código antigo não atualizado

**Solução:**
```bash
# Buscar referências antigas:
grep -r "2026_01_" src/

# Substituir por nome sem sufixo:
# users_2026_01_26_15_30 -> users
# schools_2026_01_26_15_30 -> schools
# etc.
```

---

## 📊 Monitoramento

### Métricas do Netlify

- **Analytics**: Visitas, taxa de rejeição, etc.
- **Deploys**: Histórico de builds
- **Functions**: Se usar Netlify Functions (futuro)

### Métricas do Supabase

- **Database**: Uso de storage, queries por segundo
- **Auth**: Usuários ativos, novos logins
- **API**: Requests por minuto

**⚠️ Atenção aos limites do plano Free:**
- Supabase: 500MB database, 1GB file storage, 50GB bandwidth
- Netlify: 100GB bandwidth, 300 build minutes/mês

---

## 🔐 Segurança em Produção

### Checklist de Segurança

- [ ] RLS habilitado em TODAS as tabelas
- [ ] Políticas RLS testadas para cada role
- [ ] Variáveis de ambiente configuradas (não hardcoded)
- [ ] `.env` NÃO commitado no Git
- [ ] Apenas anon key exposta no frontend
- [ ] HTTPS habilitado (automático no Netlify)
- [ ] Domínio customizado com SSL (se aplicável)
- [ ] Super-admin usa senha forte
- [ ] Backup do banco de dados configurado (Supabase Dashboard > Database > Backups)

### Backup Regular

```bash
# No Supabase Dashboard:
Database > Backups > Configure backups

# Configurar:
- Daily backups: Enabled
- Retention: 7 days (plano free) ou mais (planos pagos)
```

---

## 📝 Checklist Final de Deploy

```
[ ] 1. Build local passou sem erros
[ ] 2. Migrações SQL executadas no Supabase (00, 01, 02)
[ ] 3. RLS verificado e ativo
[ ] 4. Variáveis de ambiente configuradas no Netlify
[ ] 5. Deploy inicial bem-sucedido
[ ] 6. Super-admin criado via /setup
[ ] 7. Login testado e funcionando
[ ] 8. Dashboard carrega corretamente
[ ] 9. Criação de rede/escola testada
[ ] 10. Isolamento multi-tenant verificado
[ ] 11. Backup automático configurado
[ ] 12. Domínio customizado configurado (se aplicável)
[ ] 13. Monitoramento ativo
```

---

## 🆘 Suporte

Se encontrar problemas:

1. **Logs do Netlify**: Deploys > [último build] > Deploy log
2. **Logs do Supabase**: Logs Explorer no dashboard
3. **Console do Navegador**: F12 > Console (erros JavaScript)
4. **Documentação**: 
   - [Netlify Docs](https://docs.netlify.com/)
   - [Supabase Docs](https://supabase.com/docs)

---

**ALETHEIA** - Deploy Guide v1.0  
Atualizado em: 2026-01-27
