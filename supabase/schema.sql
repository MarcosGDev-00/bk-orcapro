-- CLIENTES
create table clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  company text,
  document text,
  address text,
  created_at timestamptz default now()
);
alter table clients enable row level security;
create policy "users see own clients" on clients
  for all using (auth.uid() = user_id);

-- SERVIÇOS
create table services (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  unit_price numeric(10,2) not null default 0,
  unit text default 'un',
  created_at timestamptz default now()
);
alter table services enable row level security;
create policy "users see own services" on services
  for all using (auth.uid() = user_id);

-- ORÇAMENTOS
create table quotes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  number serial,
  title text not null,
  status text default 'rascunho' check (status in ('rascunho','enviado','aprovado','recusado')),
  items jsonb default '[]',
  subtotal numeric(10,2) default 0,
  discount numeric(10,2) default 0,
  total numeric(10,2) default 0,
  notes text,
  valid_until date,
  created_at timestamptz default now()
);
alter table quotes enable row level security;
create policy "users see own quotes" on quotes
  for all using (auth.uid() = user_id);

-- PERFIL DO USUÁRIO (dados da empresa para o PDF)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  company_name text,
  document text,
  email text,
  phone text,
  address text,
  logo_url text,
  updated_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "users see own profile" on profiles
  for all using (auth.uid() = id);
