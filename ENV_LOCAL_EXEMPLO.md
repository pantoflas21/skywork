# Instruções para Ativar Modo Mock Local

## Criar arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
VITE_MOCK_MODE=true
VITE_SUPABASE_URL=placeholder
VITE_SUPABASE_ANON_KEY=placeholder
```

## Ou use variáveis de ambiente do sistema

### Windows (PowerShell)
```powershell
$env:VITE_MOCK_MODE="true"
npm run dev
```

### Linux/Mac
```bash
export VITE_MOCK_MODE=true
npm run dev
```

## Verificar se o modo mock está ativo

Ao iniciar o servidor de desenvolvimento, você verá no console do navegador:
```
Sistema rodando em MODO MOCK (dados fictícios)
```

## Desativar modo mock

Para usar o banco de dados real:
1. Altere `VITE_MOCK_MODE=false` no `.env.local`
2. Configure as credenciais reais do Supabase
3. Reinicie o servidor
