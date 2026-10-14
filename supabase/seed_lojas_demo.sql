-- Lojas fictícias de demonstração (fotos em public/demo, créditos em /creditos).
with loja as (
  insert into public.stores (slug, name, segment, tagline, whatsapp, city, address, delivery_open, theme, hero, is_active)
  values ('ferragem-baia', 'Ferragem Baía', 'Materiais de Construção', 'Ferramentas e material de obra com entrega no mesmo dia.', '5500000000000', 'Guaratuba', 'Rua Vieira dos Santos, 410 - Centro', true, '{"primary": "#C2410C", "dark": "#1C1917", "light": "#F5F5F4"}'::jsonb, '{"title": "FALTOU NA OBRA?", "highlight": "CHEGA HOJE.", "text": "Ferramentas, tintas e material elétrico na sua porta em Guaratuba, sem parar o serviço."}'::jsonb, true)
  returning id
), zonas as (
  insert into public.delivery_zones (store_id, label, fee, is_pickup, sort_order)
  select loja.id, z.label, z.fee, z.pickup, z.ord from loja, (values ('Centro', 6, false, 0), ('Brejatuba', 9, false, 1), ('Cohapar', 10, false, 2), ('Piçarras', 12, false, 3), ('Coroados', 14, false, 4), ('Retirar na loja', 0, true, 5)) as z (label, fee, pickup, ord)
), produtos as (
  insert into public.products (store_id, name, description, category, price, original_price, image_url, sort_order)
  select loja.id, p.name, p.descr, p.cat, p.price, p.orig, p.img, p.ord from loja, (values
    ('Martelo de Unha 27mm', 'Cabo de fibra antivibração e cabeça forjada.', 'Ferramentas', 39.90, 49.90, '/demo/ferragem-baia/0.jpg', 0),
    ('Chave de Fenda Kit 6 peças', 'Pontas imantadas de aço cromo-vanádio.', 'Ferramentas', 34.90, null::numeric, '/demo/ferragem-baia/1.jpg', 1),
    ('Trena 5 metros', 'Fita de aço com trava e clipe de cinto.', 'Ferramentas', 24.90, null::numeric, '/demo/ferragem-baia/2.jpg', 2),
    ('Furadeira de Impacto 650W', 'Mandril de 13 mm e velocidade variável.', 'Ferramentas', 219.90, 259.90, '/demo/ferragem-baia/3.jpg', 3),
    ('Alicate Universal 8"', 'Cabo isolado 1000V para serviços elétricos.', 'Ferramentas', 32.90, null::numeric, '/demo/ferragem-baia/4.jpg', 4),
    ('Tinta Acrílica Fosca Branca', 'Alto rendimento, resistente à maresia.', 'Tintas', 159.90, null::numeric, '/demo/ferragem-baia/5.jpg', 5),
    ('Rolo de Pintura 23cm', 'Lã sintética para paredes lisas e texturizadas.', 'Tintas', 19.90, null::numeric, '/demo/ferragem-baia/6.jpg', 6),
    ('Parafusos Sortidos 200 peças', 'Caixa organizadora com bitolas variadas.', 'Fixação', 27.90, 34.90, '/demo/ferragem-baia/7.jpg', 7),
    ('Lâmpada LED 9W', 'Luz branca 6500K, bivolt.', 'Elétrica', 8.90, null::numeric, '/demo/ferragem-baia/8.jpg', 8),
    ('Fita Isolante 20m', 'Antichama, para emendas de até 750V.', 'Elétrica', 6.90, null::numeric, '/demo/ferragem-baia/9.jpg', 9),
    ('Carrinho de Mão 60L', 'Caçamba metálica e pneu com câmara.', 'Obra', 249.90, null::numeric, '/demo/ferragem-baia/10.jpg', 10)
  ) as p (name, descr, cat, price, orig, img, ord)
  returning id, name
)
insert into public.product_variants (product_id, label, stock, sort_order)
select produtos.id, v.label, null, v.ord from produtos join (values
  ('Martelo de Unha 27mm', 'Único', 0),
  ('Chave de Fenda Kit 6 peças', 'Único', 0),
  ('Trena 5 metros', 'Único', 0),
  ('Furadeira de Impacto 650W', '127V', 0),
  ('Furadeira de Impacto 650W', '220V', 1),
  ('Alicate Universal 8"', 'Único', 0),
  ('Tinta Acrílica Fosca Branca', '3,6 L', 0),
  ('Tinta Acrílica Fosca Branca', '18 L', 1),
  ('Rolo de Pintura 23cm', 'Único', 0),
  ('Parafusos Sortidos 200 peças', 'Único', 0),
  ('Lâmpada LED 9W', 'Unidade', 0),
  ('Lâmpada LED 9W', 'Kit 4', 1),
  ('Fita Isolante 20m', 'Único', 0),
  ('Carrinho de Mão 60L', 'Único', 0)
) as v (product, label, ord) on v.product = produtos.name;

with loja as (
  insert into public.stores (slug, name, segment, tagline, whatsapp, city, address, delivery_open, theme, hero, is_active)
  values ('emporio-da-praia', 'Empório da Praia', 'Mercearia e Hortifruti', 'Feira, mercearia e bebidas geladas até a sua casa de praia.', '5500000000000', 'Guaratuba', 'Av. Atlântica, 1200 - Brejatuba', true, '{"primary": "#15803D", "dark": "#14231A", "light": "#F3F6F2"}'::jsonb, '{"title": "FEIRA FRESCA", "highlight": "NA SUA PORTA.", "text": "Frutas, pães e bebidas geladas para o seu dia de praia, entregues em minutos."}'::jsonb, true)
  returning id
), zonas as (
  insert into public.delivery_zones (store_id, label, fee, is_pickup, sort_order)
  select loja.id, z.label, z.fee, z.pickup, z.ord from loja, (values ('Centro', 6, false, 0), ('Brejatuba', 9, false, 1), ('Cohapar', 10, false, 2), ('Piçarras', 12, false, 3), ('Coroados', 14, false, 4), ('Retirar na loja', 0, true, 5)) as z (label, fee, pickup, ord)
), produtos as (
  insert into public.products (store_id, name, description, category, price, original_price, image_url, sort_order)
  select loja.id, p.name, p.descr, p.cat, p.price, p.orig, p.img, p.ord from loja, (values
    ('Banana Prata (dúzia)', 'Madura no ponto, direto do Ceasa.', 'Hortifruti', 7.90, null::numeric, '/demo/emporio-da-praia/0.jpg', 0),
    ('Tomate Italiano (1kg)', 'Ideal para molhos e saladas.', 'Hortifruti', 9.90, 12.90, '/demo/emporio-da-praia/1.jpg', 1),
    ('Abacaxi Pérola', 'Doce e suculento, unidade.', 'Hortifruti', 8.50, null::numeric, '/demo/emporio-da-praia/2.jpg', 2),
    ('Melancia', 'Inteira, doce e pronta para a praia.', 'Hortifruti', 12.90, null::numeric, '/demo/emporio-da-praia/3.jpg', 3),
    ('Pão Francês (6 un.)', 'Assado várias vezes ao dia.', 'Padaria', 6.00, null::numeric, '/demo/emporio-da-praia/4.jpg', 4),
    ('Café Torrado 500g', 'Torra média, moído na hora.', 'Mercearia', 24.90, 29.90, '/demo/emporio-da-praia/5.jpg', 5),
    ('Queijo Colonial (500g)', 'Produtor da Serra do Mar.', 'Frios', 34.90, null::numeric, '/demo/emporio-da-praia/6.jpg', 6),
    ('Mel Silvestre 500g', 'Puro, de apicultor do litoral.', 'Mercearia', 29.90, null::numeric, '/demo/emporio-da-praia/7.jpg', 7),
    ('Água de Coco 1L', 'Natural, sem conservantes.', 'Bebidas', 11.90, null::numeric, '/demo/emporio-da-praia/8.jpg', 8),
    ('Gelo em Cubos 5kg', 'Pacote para isopor e churrasco.', 'Bebidas', 14.90, null::numeric, '/demo/emporio-da-praia/9.jpg', 9),
    ('Ovos Caipira (dúzia)', 'Galinhas criadas soltas.', 'Mercearia', 15.90, null::numeric, '/demo/emporio-da-praia/10.jpg', 10)
  ) as p (name, descr, cat, price, orig, img, ord)
  returning id, name
)
insert into public.product_variants (product_id, label, stock, sort_order)
select produtos.id, v.label, null, v.ord from produtos join (values
  ('Banana Prata (dúzia)', 'Único', 0),
  ('Tomate Italiano (1kg)', 'Único', 0),
  ('Abacaxi Pérola', 'Único', 0),
  ('Melancia', 'Único', 0),
  ('Pão Francês (6 un.)', 'Único', 0),
  ('Café Torrado 500g', 'Moído', 0),
  ('Café Torrado 500g', 'Em grãos', 1),
  ('Queijo Colonial (500g)', 'Único', 0),
  ('Mel Silvestre 500g', 'Único', 0),
  ('Água de Coco 1L', 'Único', 0),
  ('Gelo em Cubos 5kg', 'Único', 0),
  ('Ovos Caipira (dúzia)', 'Único', 0)
) as v (product, label, ord) on v.product = produtos.name;

with loja as (
  insert into public.stores (slug, name, segment, tagline, whatsapp, city, address, delivery_open, theme, hero, is_active)
  values ('surf-e-sol', 'Surf & Sol', 'Moda Praia e Surf', 'Tudo para o mar: pranchas, moda praia e acessórios.', '5500000000000', 'Guaratuba', 'Rua Paraguai, 88 - Prainha', true, '{"primary": "#0369A1", "dark": "#0B1B26", "light": "#F1F5F8"}'::jsonb, '{"title": "O MAR CHAMOU,", "highlight": "A GENTE ENTREGA.", "text": "Moda praia, pranchas e protetor solar no mesmo dia em Guaratuba."}'::jsonb, true)
  returning id
), zonas as (
  insert into public.delivery_zones (store_id, label, fee, is_pickup, sort_order)
  select loja.id, z.label, z.fee, z.pickup, z.ord from loja, (values ('Centro', 6, false, 0), ('Brejatuba', 9, false, 1), ('Cohapar', 10, false, 2), ('Piçarras', 12, false, 3), ('Coroados', 14, false, 4), ('Retirar na loja', 0, true, 5)) as z (label, fee, pickup, ord)
), produtos as (
  insert into public.products (store_id, name, description, category, price, original_price, image_url, sort_order)
  select loja.id, p.name, p.descr, p.cat, p.price, p.orig, p.img, p.ord from loja, (values
    ('Prancha de Surf 6''2"', 'Fibra de vidro, ótima para ondas de praia.', 'Surf', 1290.00, 1490.00, '/demo/surf-e-sol/0.jpg', 0),
    ('Prancha de Bodyboard', 'Núcleo de polietileno e deck macio.', 'Surf', 349.90, null::numeric, '/demo/surf-e-sol/1.jpg', 1),
    ('Óculos de Sol Polarizado', 'Proteção UV400 e armação leve.', 'Acessórios', 129.90, 169.90, '/demo/surf-e-sol/2.jpg', 2),
    ('Chinelo de Dedo', 'Solado macio e antiderrapante.', 'Calçados', 39.90, null::numeric, '/demo/surf-e-sol/3.jpg', 3),
    ('Bermuda de Praia', 'Tecido de secagem rápida.', 'Moda Praia', 99.90, null::numeric, '/demo/surf-e-sol/4.jpg', 4),
    ('Chapéu de Palha', 'Aba larga, trançado à mão.', 'Acessórios', 59.90, null::numeric, '/demo/surf-e-sol/5.jpg', 5),
    ('Protetor Solar FPS 50', 'Resistente à água, 200 ml.', 'Cuidados', 54.90, null::numeric, '/demo/surf-e-sol/6.jpg', 6),
    ('Toalha de Praia Listrada', 'Algodão, 1,50 x 0,80 m.', 'Acessórios', 69.90, 89.90, '/demo/surf-e-sol/7.jpg', 7),
    ('Guarda-sol de Praia 2m', 'Proteção UV50+ e haste com regulagem.', 'Praia', 149.90, 179.90, '/demo/surf-e-sol/8.jpg', 8),
    ('Cadeira de Praia Reclinável', 'Alumínio, 4 posições, até 110 kg.', 'Praia', 129.90, null::numeric, '/demo/surf-e-sol/9.jpg', 9)
  ) as p (name, descr, cat, price, orig, img, ord)
  returning id, name
)
insert into public.product_variants (product_id, label, stock, sort_order)
select produtos.id, v.label, null, v.ord from produtos join (values
  ('Prancha de Surf 6''2"', 'Único', 0),
  ('Prancha de Bodyboard', 'Único', 0),
  ('Óculos de Sol Polarizado', 'Único', 0),
  ('Chinelo de Dedo', '35/36', 0),
  ('Chinelo de Dedo', '37/38', 1),
  ('Chinelo de Dedo', '39/40', 2),
  ('Chinelo de Dedo', '41/42', 3),
  ('Bermuda de Praia', 'P', 0),
  ('Bermuda de Praia', 'M', 1),
  ('Bermuda de Praia', 'G', 2),
  ('Bermuda de Praia', 'GG', 3),
  ('Chapéu de Palha', 'Único', 0),
  ('Protetor Solar FPS 50', 'Único', 0),
  ('Toalha de Praia Listrada', 'Único', 0),
  ('Guarda-sol de Praia 2m', 'Único', 0),
  ('Cadeira de Praia Reclinável', 'Único', 0)
) as v (product, label, ord) on v.product = produtos.name;

with loja as (
  insert into public.stores (slug, name, segment, tagline, whatsapp, city, address, delivery_open, theme, hero, is_active)
  values ('pet-mare', 'Pet Maré', 'Pet Shop', 'Ração, petiscos e acessórios para o seu pet.', '5500000000000', 'Guaratuba', 'Rua Antônio Mota, 230 - Cohapar', false, '{"primary": "#7C3AED", "dark": "#1E1530", "light": "#F5F3F8"}'::jsonb, '{"title": "PET FELIZ,", "highlight": "TUTOR TRANQUILO.", "text": "Ração, areia e brinquedos entregues hoje, sem você sair de casa."}'::jsonb, true)
  returning id
), zonas as (
  insert into public.delivery_zones (store_id, label, fee, is_pickup, sort_order)
  select loja.id, z.label, z.fee, z.pickup, z.ord from loja, (values ('Centro', 6, false, 0), ('Brejatuba', 9, false, 1), ('Cohapar', 10, false, 2), ('Piçarras', 12, false, 3), ('Coroados', 14, false, 4), ('Retirar na loja', 0, true, 5)) as z (label, fee, pickup, ord)
), produtos as (
  insert into public.products (store_id, name, description, category, price, original_price, image_url, sort_order)
  select loja.id, p.name, p.descr, p.cat, p.price, p.orig, p.img, p.ord from loja, (values
    ('Ração para Cães Adultos 15kg', 'Frango e arroz, sem corantes.', 'Rações', 189.90, 219.90, '/demo/pet-mare/0.jpg', 0),
    ('Ração para Gatos 10kg', 'Salmão, controle de bolas de pelo.', 'Rações', 159.90, null::numeric, '/demo/pet-mare/1.jpg', 1),
    ('Areia Sanitária 4kg', 'Granulado fino, controla odores.', 'Higiene', 24.90, null::numeric, '/demo/pet-mare/2.jpg', 2),
    ('Coleira Ajustável', 'Nylon resistente com fivela rápida.', 'Acessórios', 29.90, null::numeric, '/demo/pet-mare/3.jpg', 3),
    ('Guia de Corrente 1,2m', 'Elos de aço com mosquetão reforçado.', 'Acessórios', 69.90, null::numeric, '/demo/pet-mare/4.jpg', 4),
    ('Cama para Pet', 'Enchimento antialérgico e capa lavável.', 'Conforto', 119.90, 149.90, '/demo/pet-mare/5.jpg', 5),
    ('Bolinha de Borracha', 'Resistente a mordidas, kit com 2.', 'Brinquedos', 19.90, null::numeric, '/demo/pet-mare/6.jpg', 6),
    ('Arranhador para Gatos', 'Sisal natural com plataforma.', 'Brinquedos', 89.90, null::numeric, '/demo/pet-mare/7.jpg', 7),
    ('Comedouro de Cerâmica', 'Pesado, não vira; fácil de lavar.', 'Acessórios', 39.90, null::numeric, '/demo/pet-mare/8.jpg', 8),
    ('Aquário 20 Litros', 'Vidro com tampa e iluminação LED.', 'Aquarismo', 159.90, null::numeric, '/demo/pet-mare/9.jpg', 9)
  ) as p (name, descr, cat, price, orig, img, ord)
  returning id, name
)
insert into public.product_variants (product_id, label, stock, sort_order)
select produtos.id, v.label, null, v.ord from produtos join (values
  ('Ração para Cães Adultos 15kg', 'Único', 0),
  ('Ração para Gatos 10kg', 'Único', 0),
  ('Areia Sanitária 4kg', 'Único', 0),
  ('Coleira Ajustável', 'P', 0),
  ('Coleira Ajustável', 'M', 1),
  ('Coleira Ajustável', 'G', 2),
  ('Guia de Corrente 1,2m', 'Único', 0),
  ('Cama para Pet', 'P', 0),
  ('Cama para Pet', 'M', 1),
  ('Cama para Pet', 'G', 2),
  ('Bolinha de Borracha', 'Único', 0),
  ('Arranhador para Gatos', 'Único', 0),
  ('Comedouro de Cerâmica', 'Único', 0),
  ('Aquário 20 Litros', 'Único', 0)
) as v (product, label, ord) on v.product = produtos.name;

with loja as (
  insert into public.stores (slug, name, segment, tagline, whatsapp, city, address, delivery_open, theme, hero, is_active)
  values ('casa-litoral', 'Casa Litoral', 'Casa e Decoração', 'Utilidades e decoração para deixar a casa de praia pronta.', '5500000000000', 'Guaratuba', 'Rua Dr. Xavier da Silva, 515 - Centro', true, '{"primary": "#9A3412", "dark": "#231A15", "light": "#F7F4F1"}'::jsonb, '{"title": "CASA DE PRAIA", "highlight": "PRONTA HOJE.", "text": "Utilidades, cama, mesa e decoração para receber a família no fim de semana."}'::jsonb, true)
  returning id
), zonas as (
  insert into public.delivery_zones (store_id, label, fee, is_pickup, sort_order)
  select loja.id, z.label, z.fee, z.pickup, z.ord from loja, (values ('Centro', 6, false, 0), ('Brejatuba', 9, false, 1), ('Cohapar', 10, false, 2), ('Piçarras', 12, false, 3), ('Coroados', 14, false, 4), ('Retirar na loja', 0, true, 5)) as z (label, fee, pickup, ord)
), produtos as (
  insert into public.products (store_id, name, description, category, price, original_price, image_url, sort_order)
  select loja.id, p.name, p.descr, p.cat, p.price, p.orig, p.img, p.ord from loja, (values
    ('Panela Inox com Tampa', 'Fundo triplo, 24 cm, para todos os fogões.', 'Cozinha', 299.90, 379.90, '/demo/casa-litoral/0.jpg', 0),
    ('Jogo de Toalhas 4 peças', 'Algodão fio penteado.', 'Banho', 129.90, null::numeric, '/demo/casa-litoral/1.jpg', 1),
    ('Jogo de Lençol Casal', 'Percal 180 fios.', 'Cama', 159.90, null::numeric, '/demo/casa-litoral/2.jpg', 2),
    ('Ventilador de Mesa 40cm', '6 pás, 3 velocidades.', 'Eletro', 189.90, 219.90, '/demo/casa-litoral/3.jpg', 3),
    ('Caneca de Cerâmica', 'Esmaltada, 350 ml.', 'Cozinha', 29.90, null::numeric, '/demo/casa-litoral/4.jpg', 4),
    ('Vaso com Planta Suculenta', 'Cachepô de cerâmica.', 'Decoração', 39.90, null::numeric, '/demo/casa-litoral/5.jpg', 5),
    ('Jogo de Travesseiros (2 un.)', 'Fibra siliconada, capa de algodão.', 'Cama', 49.90, null::numeric, '/demo/casa-litoral/6.jpg', 6),
    ('Luminária de Mesa', 'Base de madeira e cúpula de tecido.', 'Decoração', 119.90, null::numeric, '/demo/casa-litoral/7.jpg', 7),
    ('Cesto Organizador de Palha', 'Trançado à mão, com alças.', 'Organização', 59.90, null::numeric, '/demo/casa-litoral/8.jpg', 8),
    ('Rede de Descanso', 'Algodão, suporta até 120 kg.', 'Varanda', 149.90, 189.90, '/demo/casa-litoral/9.jpg', 9),
    ('Kit Taças de Vidro (6 un.)', 'Para vinho e água, 380 ml.', 'Cozinha', 89.90, null::numeric, '/demo/casa-litoral/10.jpg', 10)
  ) as p (name, descr, cat, price, orig, img, ord)
  returning id, name
)
insert into public.product_variants (product_id, label, stock, sort_order)
select produtos.id, v.label, null, v.ord from produtos join (values
  ('Panela Inox com Tampa', 'Único', 0),
  ('Jogo de Toalhas 4 peças', 'Único', 0),
  ('Jogo de Lençol Casal', 'Casal', 0),
  ('Jogo de Lençol Casal', 'Queen', 1),
  ('Ventilador de Mesa 40cm', '127V', 0),
  ('Ventilador de Mesa 40cm', '220V', 1),
  ('Caneca de Cerâmica', 'Único', 0),
  ('Vaso com Planta Suculenta', 'Único', 0),
  ('Jogo de Travesseiros (2 un.)', 'Único', 0),
  ('Luminária de Mesa', 'Único', 0),
  ('Cesto Organizador de Palha', 'Único', 0),
  ('Rede de Descanso', 'Único', 0),
  ('Kit Taças de Vidro (6 un.)', 'Único', 0)
) as v (product, label, ord) on v.product = produtos.name;
