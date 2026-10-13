-- Loja de demonstração (Gribb). Rode depois da migration.
-- Para dar acesso a um lojista: crie o usuário em Authentication e depois
--   insert into store_members (store_id, user_id) select id, '<uuid-do-usuario>' from stores where slug = 'gribb';

with loja as (
  insert into stores (slug, name, segment, tagline, whatsapp, instagram, theme, hero, is_active)
  values (
    'gribb', 'Gribb', 'Streetwear', 'Streetwear com entrega no mesmo dia.', '5541999999999',
    'https://instagram.com/gribb.pt',
    '{"primary":"#73030D","dark":"#0D0D0D","light":"#F2F2F2"}',
    '{"title":"ESTILO EM","highlight":"CADA PASSO.","text":"Descubra coleções exclusivas com conforto e atitude. Entrega no mesmo dia na sua porta em Guaratuba.","imageUrl":"/tenis.png"}',
    true
  )
  returning id
),
zonas as (
  insert into delivery_zones (store_id, label, fee, is_pickup, sort_order)
  select loja.id, z.label, z.fee, z.pickup, z.ord
  from loja, (values ('Centro', 5, false, 1), ('Brejatuba', 8, false, 2), ('Coroados', 12, false, 3), ('Retirar na Loja', 0, true, 4))
    as z (label, fee, pickup, ord)
),
produtos as (
  insert into products (store_id, name, description, category, price, original_price, image_url, sort_order)
  select loja.id, p.name, p.descr, p.cat, p.price, p.orig, p.img, p.ord
  from loja, (values
    ('Camiseta Streetwear Oversized Preta', 'Algodão pesado de alta gramatura, modelagem oversized e gola reforçada.', 'Roupas', 89.90, 129.90, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', 1),
    ('Tênis Sneaker X Urban', 'Amortecimento de impacto, solado antiderrapante e cabedal respirável.', 'Calçados', 299.90, null, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', 2),
    ('Boné Dad Hat Minimalista', 'Aba curva, regulador em metal escovado e proteção UV.', 'Acessórios', 59.90, 79.90, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80', 3),
    ('Moletom Essential Cinza', 'Flanelado por dentro, bolso canguru e punhos reforçados.', 'Roupas', 149.90, null, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80', 4)
  ) as p (name, descr, cat, price, orig, img, ord)
  returning id, name
)
insert into product_variants (product_id, label, stock, sort_order)
select produtos.id, v.label, v.stock, v.ord
from produtos
join (values
  ('Camiseta Streetwear Oversized Preta', 'P', null::int, 1), ('Camiseta Streetwear Oversized Preta', 'M', null, 2),
  ('Camiseta Streetwear Oversized Preta', 'G', null, 3), ('Camiseta Streetwear Oversized Preta', 'GG', null, 4),
  ('Tênis Sneaker X Urban', '38', 3, 1), ('Tênis Sneaker X Urban', '39', 3, 2), ('Tênis Sneaker X Urban', '40', 2, 3),
  ('Tênis Sneaker X Urban', '41', 1, 4), ('Tênis Sneaker X Urban', '42', 0, 5),
  ('Boné Dad Hat Minimalista', 'Único', null, 1),
  ('Moletom Essential Cinza', 'P', null, 1), ('Moletom Essential Cinza', 'M', null, 2),
  ('Moletom Essential Cinza', 'G', null, 3), ('Moletom Essential Cinza', 'GG', null, 4)
) as v (product, label, stock, ord) on v.product = produtos.name;
