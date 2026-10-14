// Situação das entregas da loja hoje (definida no painel).
export default function DeliveryStatus({ open, className = "" }: { open: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap ${className}`}>
      <span className={`w-2 h-2 rounded-full ${open ? "bg-emerald-400" : "bg-current opacity-40"}`} aria-hidden="true" />
      {open ? "Entregando hoje" : "Entregas pausadas"}
    </span>
  );
}
