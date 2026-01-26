# GUIA DE DEPLOY NO NETLIFY

## 📋 PASSO A PASSO:

### 1. **Subir para GitHub:**
```bash
git init
git add .
git commit -m "Sistema ALETHEIA completo"
git branch -M main
git remote add origin https://github.com/seu-usuario/aletheia-sistema.git
git push -u origin main
```

### 2. **Configurar no Netlify:**
1. Acesse [netlify.com](https://netlify.com)
2. Clique em "New site from Git"
3. Conecte seu repositório GitHub
4. Configurações automáticas detectadas:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### 3. **Configurar Variáveis de Ambiente:**
No painel do Netlify:
- Vá em **Site Settings > Environment Variables**
- Adicione estas variáveis:

```
VITE_SUPABASE_URL = https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY = sua-chave-anonima-do-supabase
```

### 4. **Onde encontrar as credenciais do Supabase:**
1. Acesse [supabase.com](https://supabase.com)
2. Vá no seu projeto
3. Settings > API
4. Copie:
   - **Project URL** → VITE_SUPABASE_URL
   - **anon public** → VITE_SUPABASE_ANON_KEY

### 5. **Fazer Deploy:**
- Clique em "Deploy site"
- Aguarde o build (2-3 minutos)
- Seu site estará online!

## 🔧 ARQUIVOS INCLUÍDOS:
- ✅ `netlify.toml` - Configuração automática
- ✅ `.env.example` - Template das variáveis
- ✅ `dist/` - Build pronto
- ✅ Redirecionamentos configurados

## 🚀 CREDENCIAIS DE TESTE:
- **Admin:** admin@escola.com / 12345
- **Secretaria:** secretaria@escola.com / 12345  
- **Professor:** professor@escola.com / 12345
- **Aluno:** aluno@escola.com / 12345

## ⚠️ IMPORTANTE:
Sem as variáveis do Supabase, o sistema funcionará com dados mockados (demonstração).
Com as variáveis configuradas, terá acesso ao banco de dados real.