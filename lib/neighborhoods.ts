import { normalize } from "./format";

// Bairros de Guaratuba no OpenStreetMap (out/2026). Sugestões no painel e base da comparação com o mapa.
export const NEIGHBORHOODS = [
  "Barra do Saí", "Boa Vista", "Brejatuba", "Cabaraquara", "Caieiras", "Canela", "Carvoeiro", "Cedro", "Centro", "Cohapar",
  "Comunidade Parati", "Coroados", "Cubatão", "Eliana", "Empanturrado", "Estaleiro", "Figueira", "Jiçara", "Mirim", "Morro Grande",
  "Nereidas", "Nhundiaquara", "Piçarras", "Prainha", "Ribeirão Grande", "Rio das Garças", "Riozinho", "São Joãozinho", "São Leopoldo", "Vila Esperança",
];

/** Mesmo bairro, ignorando acento, caixa e prefixos ("Bairro Centro", "Cidade Balneária de Brejatuba"). */
export function sameNeighborhood(a: string, b: string) {
  const x = normalize(a);
  const y = normalize(b);
  return !!x && !!y && (x === y || x.endsWith(` ${y}`) || y.endsWith(` ${x}`));
}
