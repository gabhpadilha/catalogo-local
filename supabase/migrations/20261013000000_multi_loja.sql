-- Plataforma multi-loja: cada loja tem catálogo, variações com estoque e zonas de entrega.
-- Leitura pública só do que está ativo; escrita só por membros da loja (RLS).

create schema if not exists private;

-- ───────────── Tabelas ─────────────

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 2 and 40
           and slug not in ('admin', 'api', 'sobre', 'como-funciona', 'login', 'lojas', 'entregas')),
  name text not null check (length(name) between 1 and 80),
  segment text not null default 'Loja' check (length(segment) <= 60),
  tagline text check (length(tagline) <= 160),
  whatsapp text not null check (whatsapp ~ '^[0-9]{12,13}$'),
  instagram text check (instagram ~ '^https://(www\.)?instagram\.com/'),
  city text not null default 'Guaratuba',
  address text,
  delivery_open boolean not null default true,
  theme jsonb not null default '{"primary":"#73030D","dark":"#0D0D0D","light":"#F2F2F2"}',
  hero jsonb not null default '{}',
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.store_members (
  store_id uuid not null references public.stores (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  primary key (store_id, user_id)
);
create index store_members_user_id_idx on public.store_members (user_id);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  name text not null check (length(name) between 1 and 120),
  description text not null default '' check (length(description) <= 2000),
  category text not null default 'Geral' check (length(category) <= 40),
  price numeric(10, 2) not null check (price >= 0),
  original_price numeric(10, 2) check (original_price is null or original_price > price),
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Consulta da vitrine: produtos ativos da loja, ordenados.
create index products_store_active_idx on public.products (store_id, sort_order) where is_active;
create index products_store_id_idx on public.products (store_id);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  label text not null check (length(label) between 1 and 30),
  stock int check (stock is null or stock >= 0), -- null = não controla estoque
  sort_order int not null default 0,
  unique (product_id, label)
);

create table public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores (id) on delete cascade,
  label text not null check (length(label) between 1 and 60),
  fee numeric(10, 2) not null default 0 check (fee >= 0),
  is_pickup boolean not null default false,
  sort_order int not null default 0
);
create index delivery_zones_store_id_idx on public.delivery_zones (store_id);

create function private.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger products_updated_at before update on public.products
  for each row execute function private.touch_updated_at();

-- ───────────── Helpers de permissão ─────────────

create function private.is_store_member(p_store_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.store_members
    where store_id = p_store_id and user_id = (select auth.uid())
  );
$$;

create function private.is_store_owner(p_store_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.store_members
    where store_id = p_store_id and user_id = (select auth.uid()) and role = 'owner'
  );
$$;

create function private.can_edit_product(p_product_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.products p
    join public.store_members m on m.store_id = p.store_id
    where p.id = p_product_id and m.user_id = (select auth.uid())
  );
$$;

-- O schema private não é exposto pela API; anon precisa de execute porque as
-- políticas de leitura pública chamam is_store_member (retorna false sem login).
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;
revoke execute on all functions in schema private from public, anon;
grant execute on function private.is_store_member(uuid) to anon, authenticated;
grant execute on function private.is_store_owner(uuid), private.can_edit_product(uuid) to authenticated;

-- ───────────── RLS ─────────────

alter table public.stores enable row level security;
alter table public.store_members enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.delivery_zones enable row level security;

-- Visitante anônimo só lê; nunca escreve.
revoke insert, update, delete on public.stores, public.store_members, public.products,
  public.product_variants, public.delivery_zones from anon;
-- Lojas e membros são criados pelo admin da plataforma (service role), não pelo app.
revoke insert, delete on public.stores, public.store_members from authenticated;
revoke update on public.store_members from authenticated;

create policy "lojas ativas são públicas" on public.stores for select
  using (is_active or (select private.is_store_member(id)));
create policy "dono edita a loja" on public.stores for update to authenticated
  using ((select private.is_store_owner(id))) with check ((select private.is_store_owner(id)));

create policy "membro vê o próprio vínculo" on public.store_members for select to authenticated
  using (user_id = (select auth.uid()));

create policy "produtos ativos de lojas ativas são públicos" on public.products for select
  using (
    (is_active and exists (select 1 from public.stores s where s.id = store_id and s.is_active))
    or (select private.is_store_member(store_id))
  );
create policy "membro cria produto" on public.products for insert to authenticated
  with check ((select private.is_store_member(store_id)));
create policy "membro edita produto" on public.products for update to authenticated
  using ((select private.is_store_member(store_id))) with check ((select private.is_store_member(store_id)));
create policy "membro apaga produto" on public.products for delete to authenticated
  using ((select private.is_store_member(store_id)));

-- Variação visível se o produto for visível (o RLS de products se aplica na subconsulta).
create policy "variações seguem o produto" on public.product_variants for select
  using (exists (select 1 from public.products p where p.id = product_id));
create policy "membro gerencia variações" on public.product_variants for all to authenticated
  using ((select private.can_edit_product(product_id))) with check ((select private.can_edit_product(product_id)));

create policy "zonas de lojas visíveis são públicas" on public.delivery_zones for select
  using (exists (select 1 from public.stores s where s.id = store_id));
create policy "membro gerencia zonas" on public.delivery_zones for all to authenticated
  using ((select private.is_store_member(store_id))) with check ((select private.is_store_member(store_id)));

-- ───────────── Storage: fotos dos produtos ─────────────
-- Caminho obrigatório: <store_id>/<arquivo>. Leitura pública, escrita só por membros.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create function private.member_of_folder(p_name text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.store_members
    where store_id::text = (storage.foldername(p_name))[1] and user_id = (select auth.uid())
  );
$$;
revoke execute on function private.member_of_folder(text) from public, anon;
grant execute on function private.member_of_folder(text) to authenticated;

create policy "membro envia fotos da loja" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and private.member_of_folder(name));
create policy "membro altera fotos da loja" on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and private.member_of_folder(name));
create policy "membro apaga fotos da loja" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and private.member_of_folder(name));
