# OrçaPro MVP

SaaS de orçamentos para freelancers e MEIs.

## Configuração

1. Preencher o arquivo `.env` com credenciais do Supabase:
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

2. Executar o arquivo `supabase/schema.sql` no SQL Editor do Supabase para criar as tabelas e políticas de Row Level Security (RLS).

3. Instalar dependências e rodar localmente:
```bash
npm install
npm run dev
```
