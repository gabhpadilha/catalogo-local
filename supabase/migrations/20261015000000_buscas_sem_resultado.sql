-- Buscas da home que não acharam nada: só o termo e quantas vezes por dia (sem dado pessoal).
-- Serve para mostrar a demanda que nenhuma loja atende. Leitura só pelo dono da plataforma,
-- no SQL Editor do Supabase (ver supabase/queries/buscas-sem-resultado.sql).

create table public.search_misses (
  day date not null default (now() at time zone 'America/Sao_Paulo')::date,
  term text not null check (char_length(term) between 3 and 60),
  hits int not null default 1 check (hits > 0),
  primary key (day, term)
);

-- Nenhum acesso direto pela API: só pela função abaixo.
alter table public.search_misses enable row level security;
revoke all on public.search_misses from anon, authenticated;

-- Só incrementa. Teto de termos novos por dia para ninguém lotar a tabela com lixo.
create or replace function public.log_search_miss(p_term text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  t text := lower(btrim(regexp_replace(coalesce(p_term, ''), '\s+', ' ', 'g')));
  today date := (now() at time zone 'America/Sao_Paulo')::date;
begin
  if char_length(t) not between 3 and 60 then
    return;
  end if;

  update public.search_misses set hits = hits + 1 where day = today and term = t;
  if found then
    return;
  end if;

  if (select count(*) from public.search_misses where day = today) >= 500 then
    return;
  end if;

  insert into public.search_misses as m (day, term) values (today, t)
  on conflict (day, term) do update set hits = m.hits + 1;
end;
$$;

revoke execute on function public.log_search_miss(text) from public;
grant execute on function public.log_search_miss(text) to anon, authenticated;
