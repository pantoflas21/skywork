# Sistema ALETHEIA - Credenciais de Teste (Modo Mock)

## Informações Importantes
- O sistema está configurado em **MODO MOCK** (sem banco de dados real)
- Todos os dados são fictícios e armazenados apenas na memória
- Perfeito para testes locais e demonstrações

## Como Ativar o Modo Mock
1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione a linha: `VITE_MOCK_MODE=true`
3. Execute: `npm run dev`

## Credenciais de Acesso

### Super Admin
- **Email:** superadmin@aletheia.edu
- **Senha:** Super@123
- **Acesso:** Gerenciamento de redes e escolas

### Network Admin
- **Email:** networkadmin@aletheia.edu
- **Senha:** Network@123
- **Acesso:** Gerenciamento de escolas da rede

### Administrador Escolar
- **Email:** admin@aletheia.edu
- **Senha:** Admin@123
- **Acesso:** Dashboard administrativo, usuários, financeiro

### Secretaria
- **Email:** secretaria@aletheia.edu
- **Senha:** Secret@123
- **Acesso:** Alunos, turmas, disciplinas, planos de aula

### Professores
**Professor 1 (João Silva)**
- **Email:** professor1@aletheia.edu
- **Senha:** Prof@123
- **Acesso:** Turmas, chamada, notas, planos de aula

**Professor 2 (Ana Costa)**
- **Email:** professor2@aletheia.edu
- **Senha:** Prof@123
- **Acesso:** Turmas, chamada, notas, planos de aula

### Alunos
**Aluno 1 (Pedro Oliveira)**
- **Email:** aluno1@aletheia.edu
- **Senha:** Aluno@123
- **Acesso:** Notas, frequência, boletim

**Aluno 2 (Julia Santos)**
- **Email:** aluno2@aletheia.edu
- **Senha:** Aluno@123
- **Acesso:** Notas, frequência, boletim

## Dados Mock Inclusos

### Escolas
- Escola ALETHEIA Centro
- Escola ALETHEIA Sul

### Turmas
- 3º Ano A (Ensino Médio) - 35 vagas
- 5º Ano B (Ensino Fundamental) - 30 vagas
- Maternal II (Educação Infantil) - 20 vagas

### Disciplinas
- Matemática, Português, História, Geografia
- Física, Química, Biologia

### Funcionalidades Disponíveis
- ✅ Login com múltiplos perfis
- ✅ Dashboard por tipo de usuário
- ✅ Gestão de alunos e turmas
- ✅ Lançamento de notas e frequência
- ✅ Planos de aula
- ✅ Relatórios financeiros
- ✅ Gerenciamento de usuários

## Próximos Passos para Produção

Quando estiver pronto para usar o sistema real:

1. Configure o Supabase (banco de dados)
2. No arquivo `.env.local`, altere para: `VITE_MOCK_MODE=false`
3. Adicione as credenciais reais do Supabase:
   ```
   VITE_SUPABASE_URL=sua-url-do-supabase
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   ```
4. Execute as migrations do banco de dados

## Suporte
Para dúvidas ou problemas, consulte a documentação completa.
