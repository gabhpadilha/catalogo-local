// Chaves do armazenamento do navegador, compartilhadas entre a home e as vitrines.

/** Sacola de cada loja (só id, opção e quantidade). */
export const cartKey = (slug: string) => `cart:${slug}`;

/** Último termo buscado na home, para a faixa "Voltar para..." da loja (por aba). */
export const LAST_SEARCH_KEY = "vitrine:busca";
