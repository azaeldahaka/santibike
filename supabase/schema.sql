-- ============================================================
-- 🚴‍♂️ ESQUEMA DE BASE DE DATOS SUPABASE: BICICLETERÍA SANTYBIKE
-- ============================================================
-- Copiar y pegar este script completo en el SQL Editor de Supabase
-- (Menú lateral izquierdo de Supabase > SQL Editor > New Query > Run)

-- 1. TABLA DE PEDIDOS Y RESERVAS (orders)
create table if not exists public.orders (
  id text primary key,
  order_code text not null unique,
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  customer_city text,
  delivery_method text not null default 'pickup',
  payment_method text not null default 'transfer',
  status text not null default 'pending_deposit',
  receipt_note text,
  items jsonb not null default '[]'::jsonb,
  total_amount numeric not null default 0,
  deposit_amount numeric not null default 0,
  remaining_amount numeric not null default 0
);

-- 2. TABLA DE COSTOS Y CONFIGURACIÓN COMERCIAL (store_settings)
create table if not exists public.store_settings (
  id text primary key default 'default_settings',
  blank_garment_cost numeric not null default 9500,
  printing_cost numeric not null default 4800,
  packaging_cost numeric not null default 1200,
  gateway_fee_percent numeric not null default 0,
  target_margin_percent numeric not null default 50,
  sale_price numeric not null default 32000,
  updated_at timestamptz not null default now()
);

-- 3. HABILITAR SEGURIDAD POR FILAS (Row Level Security - RLS)
alter table public.orders enable row level security;
alter table public.store_settings enable row level security;

-- 4. POLÍTICAS DE ACCESO PÚBLICO (ANON KEY)
-- Permite insertar órdenes a los clientes desde la web
drop policy if exists "Allow public insert on orders" on public.orders;
create policy "Allow public insert on orders" on public.orders
  for insert with check (true);

-- Permite consultar órdenes
drop policy if exists "Allow public select on orders" on public.orders;
create policy "Allow public select on orders" on public.orders
  for select using (true);

-- Permite actualizar estado de órdenes
drop policy if exists "Allow public update on orders" on public.orders;
create policy "Allow public update on orders" on public.orders
  for update using (true);

-- Permite consultar configuración de costos
drop policy if exists "Allow public select on store_settings" on public.store_settings;
create policy "Allow public select on store_settings" on public.store_settings
  for select using (true);

-- Permite actualizar configuración de costos
drop policy if exists "Allow public update on store_settings" on public.store_settings;
create policy "Allow public update on store_settings" on public.store_settings
  for update using (true);

-- 5. INSERTAR CONFIGURACIÓN INICIAL (Si no existe)
insert into public.store_settings (
  id,
  blank_garment_cost,
  printing_cost,
  packaging_cost,
  gateway_fee_percent,
  target_margin_percent,
  sale_price
) values (
  'default_settings',
  9500,
  4800,
  1200,
  0,
  50,
  32000
) on conflict (id) do nothing;

-- 6. INSERTAR PEDIDOS DE EJEMPLO INICIALES
insert into public.orders (
  id,
  order_code,
  created_at,
  customer_name,
  customer_phone,
  customer_email,
  customer_city,
  delivery_method,
  payment_method,
  status,
  receipt_note,
  items,
  total_amount,
  deposit_amount,
  remaining_amount
) values 
(
  'ord-101',
  'SAN-1048',
  '2026-10-15T18:30:00Z',
  'Santiago Rossi',
  '+54 9 387 458-9201',
  'santi.rossi@gmail.com',
  'Salta Capital',
  'pickup',
  'transfer',
  'deposit_paid',
  'Comprobante Naranja X verificado',
  '[{"color":"negro","size":"L","quantity":1,"unitPrice":32000,"unitDeposit":16000}]'::jsonb,
  32000,
  16000,
  16000
),
(
  'ord-102',
  'SAN-1049',
  '2026-10-15T19:15:00Z',
  'Martín Benítez',
  '+54 9 387 582-1993',
  'martinb_mtb@hotmail.com',
  'B° Limache',
  'pickup',
  'transfer',
  'deposit_paid',
  'Comprobante transferido vía Naranja X',
  '[{"color":"gris","size":"XL","quantity":1,"unitPrice":32000,"unitDeposit":16000},{"color":"negro","size":"M","quantity":1,"unitPrice":32000,"unitDeposit":16000}]'::jsonb,
  64000,
  32000,
  32000
) on conflict (id) do nothing;
