# ALETHEIA - Sistema de Gestão Escolar

Sistema SaaS completo de gestão escolar com arquitetura multi-tenant para escolas e redes de ensino.

## 🎯 Funcionalidades

### Hierarquia Multi-Tenant
- **Super-Admin**: Acesso total à plataforma, gerencia redes e escolas
- **Network-Admin**: Gerencia redes de ensino com múltiplas escolas
- **Admin**: Gerencia escola individual, usuários e configurações
- **Secretaria**: Gestão de alunos, matrículas e turmas
- **Professor**: Lançamento de notas, frequência e planos de aula
- **Aluno**: Visualização de notas, frequência e materiais

### Módulos Principais
- ✅ Autenticação completa (login, recuperação de senha, setup inicial)
- ✅ Gestão de redes de ensino e escolas
- ✅ Gestão de alunos e matrículas
- ✅ Gestão de turmas e disciplinas
- ✅ Lançamento de notas (sistema transacional flexível)
- ✅ Controle de frequência (por aula/data)
- ✅ Gestão financeira (mensalidades e despesas)
- ✅ Relatórios e dashboards com métricas em tempo real
- ✅ Segurança multi-tenant com RLS (Row Level Security)

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui (Radix UI components)
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Estilo**: Tailwind CSS
- **Validação**: Zod + React Hook Form
- **Roteamento**: React Router DOM v6
- **Estado**: TanStack Query (React Query)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase (grátis)

Recomendamos usar nvm: [nvm Installation Guide](https://github.com/nvm-sh/nvm#installing-and-updating)

### 1. Clonar e Instalar Dependências

```bash
git clone <seu-repositorio>
cd aletheia
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o .env e adicione suas credenciais do Supabase
# VITE_SUPABASE_URL=sua_url_aqui
# VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

**Encontrar credenciais no Supabase:**
1. Acesse seu projeto em [app.supabase.com](https://app.supabase.com)
2. Vá em Settings > API
3. Copie a **URL** e **anon/public key**

### 3. Configurar Banco de Dados (Supabase)

Execute as migrações SQL **na ordem** no SQL Editor do Supabase:

```bash
1. supabase/migrations/00_init_complete_schema.sql
2. supabase/migrations/01_rls_policies.sql
3. supabase/migrations/02_initial_setup.sql
```

**Como executar:**
1. Abra o Supabase Dashboard
2. Vá em SQL Editor
3. Copie e cole cada arquivo
4. Clique em "Run"
5. Verifique se não há erros

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

### 5. Criar Primeiro Super-Admin

1. Acesse: http://localhost:5173/#/setup
2. Preencha o formulário com dados do super-administrador
3. Faça login com as credenciais criadas

**IMPORTANTE**: A rota `/setup` só funciona se não existir nenhum super-admin. Após criar o primeiro, ela será desabilitada.

## 🏗️ Estrutura do Projeto

```
aletheia/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes shadcn/ui
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── pages/             # Páginas da aplicação
│   │   ├── superadmin/    # Dashboards Super Admin
│   │   ├── networkadmin/  # Dashboards Network Admin
│   │   ├── admin/         # Dashboards Admin (Escola)
│   │   ├── secretaria/    # Módulo Secretaria
│   │   ├── professor/     # Módulo Professor
│   │   ├── aluno/         # Módulo Aluno
│   │   ├── Setup.tsx      # Setup inicial
│   │   ├── Login.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   ├── services/          # Serviços e APIs
│   │   └── api.ts         # Camada de serviços Supabase
│   ├── hooks/             # Custom React Hooks
│   │   └── useAuth.tsx    # Hook de autenticação
│   ├── types/             # Definições TypeScript
│   │   └── index.ts
│   └── integrations/      # Integrações externas
│       └── supabase/
│           └── client.ts  # Cliente Supabase
├── supabase/
│   └── migrations/        # Migrações SQL consolidadas
│       ├── 00_init_complete_schema.sql
│       ├── 01_rls_policies.sql
│       └── 02_initial_setup.sql
├── .env                   # Variáveis de ambiente (NÃO COMMITAR)
├── env.example            # Exemplo de variáveis
├── netlify.toml           # Config Netlify
└── package.json
```

## 🔐 Segurança e Arquitetura

### Row Level Security (RLS)

O sistema utiliza RLS do PostgreSQL para isolamento multi-tenant:

- **Super Admin**: Acesso total
- **Network Admin**: Vê apenas escolas da sua rede
- **Admin/Secretaria/Professor**: Vê apenas dados da sua escola
- **Aluno**: Vê apenas seus próprios dados

### Estrutura de Dados

**Principais tabelas:**
- `networks` - Redes de ensino
- `schools` - Escolas (com network_id opcional)
- `users` - Perfis integrados com auth.users
- `students` - Alunos com dados de matrícula
- `teachers` - Professores com especialização
- `classes` - Turmas
- `subjects` - Disciplinas
- `grades` - Notas (modelo transacional)
- `attendance` - Frequência
- `lessons` - Aulas e planos de aula
- `financial_transactions` - Receitas e despesas

## 🚢 Deploy

### Deploy no Netlify

1. **Prepare o repositório:**
   ```bash
   git add .
   git commit -m "feat: preparar para deploy"
   git push origin main
   ```

2. **Configure no Netlify:**
   - Conecte seu repositório GitHub
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Adicione variáveis de ambiente no Netlify:**
   - Vá em Site settings > Environment variables
   - Adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy:**
   - O Netlify fará deploy automático a cada push

### Checklist Pré-Deploy

- [ ] Migrações aplicadas no Supabase
- [ ] Variáveis de ambiente configuradas
- [ ] RLS habilitado em todas as tabelas
- [ ] Super-admin criado via `/setup`
- [ ] Build local sem erros: `npm run build`
- [ ] Testes de login funcionando
- [ ] Verificar políticas RLS no Supabase Dashboard

## 🧪 Testes

```bash
# Build de produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 📝 Ordem de Criação de Dados

1. **Super Admin** (via `/setup`)
2. **Redes de Ensino** (via Super Admin Dashboard)
3. **Escolas** (via Super Admin ou Network Admin)
4. **Admin da Escola** (criado automaticamente com a escola)
5. **Funcionários** - Secretaria e Professores (via Admin Dashboard)
6. **Alunos** (via Secretaria)
7. **Turmas** (via Secretaria/Admin)
8. **Disciplinas** (via Admin/Secretaria)

## 🆘 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env` existe na raiz
- Confirme que as variáveis estão corretas (sem aspas extras)
- Reinicie o servidor de desenvolvimento

### Erro: "relation does not exist"
- As migrações SQL não foram executadas
- Execute-as na ordem correta no Supabase SQL Editor

### Erro: "Row Level Security policy violation"
- Verifique se as políticas RLS foram criadas (`01_rls_policies.sql`)
- Confirme que o usuário está com a role correta na tabela `users`

### Não consigo criar o primeiro super-admin
- Verifique se a função `create_first_super_admin` foi criada (`02_initial_setup.sql`)
- Confirme que não existe nenhum usuário com role='super_admin' na tabela `users`

### Build falha no Netlify
- Verifique se as variáveis de ambiente estão configuradas
- Confirme que a versão do Node é 18+
- Verifique os logs de build no Netlify

## 📚 Documentação Adicional

- [Supabase Documentation](https://supabase.com/docs)
- [React Router v6](https://reactrouter.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**ALETHEIA** - Sistema de Gestão Escolar 
Desenvolvido com ❤️ usando React + TypeScript + Supabase
