-- Modo de frete da loja: tabela por bairro (padrão) ou cotação do Uber Direct na hora do checkout.
alter table public.stores
  add column if not exists delivery_mode text not null default 'zones' check (delivery_mode in ('zones', 'uber'));

-- O dono escolhe o modo no painel (as outras colunas editáveis seguem as da migration do painel).
grant update (delivery_mode) on public.stores to authenticated;
