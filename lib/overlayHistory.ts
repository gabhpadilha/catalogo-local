// Enquanto houver gaveta aberta existe uma entrada extra no histórico: o "voltar" do celular
// fecha a gaveta em vez de sair da loja. Gavetas encadeadas (sacola -> checkout) dividem a mesma entrada.
const closers = new Set<() => void>();
let pushed = false;

const onPopState = () => {
  if (!pushed) return;
  pushed = false;
  for (const close of [...closers]) close();
};

/** Registra uma gaveta aberta. `url` (ex.: "?produto=x") deixa a entrada compartilhável. Devolve a função de saída. */
export function enterOverlay(close: () => void, url?: string) {
  closers.add(close);
  if (!pushed) {
    window.history.pushState({ overlay: true }, "", url);
    window.addEventListener("popstate", onPopState);
    pushed = true;
  }
  return () => {
    closers.delete(close);
    // Espera o commit do React terminar: se outra gaveta abriu no lugar, a entrada continua.
    queueMicrotask(() => {
      if (closers.size === 0 && pushed) {
        pushed = false;
        window.history.back();
      }
    });
  };
}
