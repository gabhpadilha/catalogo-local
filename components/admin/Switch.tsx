// Chave liga/desliga do painel (só o visual; quem usa cuida do clique e do rótulo acessível).
export default function Switch({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${on ? "bg-emerald-600" : "bg-brand-line"}`}>
      <span className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : ""}`} />
    </span>
  );
}
