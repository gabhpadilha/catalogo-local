@AGENTS.md

# Gribb Catalog - Regras de Projeto e Contexto

## 🏢 Regras de Negócio
- **Produto:** Plataforma multi-loja (marketplace + vitrine white-label) para o comércio local de Guaratuba. Cada loja tem catálogo, tema e WhatsApp próprios em `/[loja]`; `/` lista as lojas. Gribb é a loja piloto.
- **Localização:** Guaratuba, PR. As decisões de logística e frete devem focar nesta região.
- **Checkout:** Zero fricção. O pedido final não passa por gateway de pagamento no site. Ele é formatado e enviado diretamente para o WhatsApp do lojista para pagamento via Pix.
- **Logística:** As entregas utilizam a API/conceito do Uber Flash/Direct. O valor do frete é dinâmico e confirmado no WhatsApp.

## 💻 Tech Stack e Arquitetura
- **Framework:** Next.js (App Router) com TypeScript.
- **Estilização:** Tailwind CSS v4, identidade minimalista. Fonte Archivo; títulos com a utility `headline` (semi-expandida), em caixa normal (sem rótulos em CAIXA ALTA). Superfícies brancas sobre `brand-light`, sem sombra em cards. Raios por hierarquia: pílulas e botões `rounded-full`, imagens `rounded-xl`, cards `rounded-2xl`, hero e gavetas `rounded-3xl`. Cores: `brand-primary/dark/light` vêm do tema da loja; `brand-muted/line/soft/tint` são derivadas delas em `globals.css` (não use hex fixo nem `gray-*` na vitrine).
- **Componentização:** Modais e gavetas usam `components/Sheet.tsx` (`<dialog>` nativo): bottom sheet no mobile, fundo escuro com blur, e o "voltar" do celular fecha a gaveta. Estado em Context API ou estado local elevado.
- **Custo Zero:** QUALQUER sugestão de infraestrutura, banco de dados ou hosting DEVE ser 100% gratuita (Supabase Free Tier). Atenção: o plano Hobby da Vercel proíbe uso comercial; para produção paga pelos lojistas, preferir Cloudflare Workers (OpenNext).
- **Dados:** `lib/data.ts` lê do Supabase quando `NEXT_PUBLIC_SUPABASE_*` existe; senão usa `lib/seed.ts`. Schema e RLS em `supabase/migrations/`. Preços nunca vêm do cliente.

## 🤖 Diretrizes para o Claude Code (Skills & Agents)
1. **Economia de Tokens:** Responde de forma extremamente concisa. Não dês tutoriais nem explicações longas. Modifica os ficheiros diretamente através das tuas tools.
2. **Componentização Automática:** Mantém o `page.tsx` pequeno. Extrai sempre lógicas complexas para a pasta `/components`.
3. **Validação:** Antes de fazeres commit de um código, garante que ele não quebra a build (`npm run build`).

## 🛠️ Comandos Úteis
- Iniciar servidor: `npm run dev`
- Build: `npm run build`