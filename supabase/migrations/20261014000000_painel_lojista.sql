-- Painel do lojista: logo da loja e colunas que o dono pode editar.

alter table public.stores
  add column if not exists logo_url text check (logo_url is null or logo_url ~ '^https://');

-- O dono edita a vitrine, mas não troca o endereço (slug) nem reativa uma loja
-- suspensa (is_active): isso fica com o admin da plataforma (service role).
revoke update on public.stores from authenticated;
grant update (name, segment, tagline, whatsapp, instagram, address, delivery_open, theme, hero, logo_url)
  on public.stores to authenticated;

-- Produto não pode ser movido para outra loja depois de criado.
revoke update on public.products from authenticated;
grant update (name, description, category, price, original_price, image_url, is_active, sort_order)
  on public.products to authenticated;
