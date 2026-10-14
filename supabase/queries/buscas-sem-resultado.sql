-- O que procuraram na home e nenhuma loja tinha (últimos 30 dias).
-- Rode no SQL Editor do Supabase.
select term as busca, sum(hits) as vezes, max(day) as ultima_vez
from public.search_misses
where day > current_date - 30
group by term
order by vezes desc, ultima_vez desc
limit 50;
