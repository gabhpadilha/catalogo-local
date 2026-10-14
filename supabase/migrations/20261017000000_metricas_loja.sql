-- 1) Métricas da loja para o painel: visitas à vitrine e pedidos enviados ao WhatsApp, por dia.
--    Sem dado pessoal: só contagem e soma do subtotal informado no checkout.

create table public.store_events (
  store_id uuid not null references public.stores (id) on delete cascade,
  day date not null default (now() at time zone 'America/Sao_Paulo')::date,
  kind text not null check (kind in ('visit', 'order')),
  hits int not null default 0 check (hits >= 0),
  total numeric(12, 2) not null default 0 check (total >= 0),
  primary key (store_id, day, kind)
);

alter table public.store_events enable row level security;
revoke all on public.store_events from anon, authenticated;
grant select on public.store_events to authenticated;
create policy "membro vê as métricas da loja" on public.store_events for select to authenticated
  using ((select private.is_store_member(store_id)));

-- Só incrementa. Valor de pedido limitado para um envio adulterado não distorcer o painel.
create or replace function public.log_store_event(p_slug text, p_kind text, p_total numeric default 0)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  sid uuid;
  amount numeric := case when p_kind = 'order' then least(greatest(coalesce(p_total, 0), 0), 100000) else 0 end;
begin
  if p_kind not in ('visit', 'order') then
    return;
  end if;
  select id into sid from public.stores where slug = p_slug and is_active;
  if sid is null then
    return;
  end if;
  insert into public.store_events as e (store_id, kind, hits, total) values (sid, p_kind, 1, amount)
  on conflict (store_id, day, kind) do update set hits = e.hits + 1, total = e.total + excluded.total;
end;
$$;

revoke execute on function public.log_store_event(text, text, numeric) from public;
grant execute on function public.log_store_event(text, text, numeric) to anon, authenticated;
