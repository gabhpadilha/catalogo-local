export type Step = { title: string; text: string };

const STEPS: Step[] = [
  { title: "Pedido no WhatsApp", text: "Finalize o carrinho e a mensagem chega pronta para a loja, com o seu bairro." },
  { title: "Frete confirmado", text: "Cotamos a corrida no Uber Flash em tempo real e enviamos o valor final junto com o Pix." },
  { title: "Pagamento via Pix", text: "Pagou, a loja separa e embala o pedido na hora." },
  { title: "Motorista a caminho", text: "Um parceiro Uber retira na loja e você recebe o link para acompanhar a entrega." },
];

export default function DeliverySteps({ steps = STEPS }: { steps?: Step[] }) {
  return (
    <ol className="space-y-10">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={s.title} className="flex gap-6 items-start group">
            <div
              className={`flex-shrink-0 w-14 h-14 rounded-2xl font-black flex items-center justify-center text-2xl ${
                last
                  ? "bg-brand-primary text-brand-light shadow-md group-hover:scale-110 transition-transform"
                  : "bg-white border-2 border-gray-100 text-brand-dark shadow-sm group-hover:border-brand-dark transition-colors"
              }`}
            >
              {i + 1}
            </div>
            <div>
              <h3 className={`text-2xl font-black mb-2 ${last ? "text-brand-primary" : "text-brand-dark"}`}>{s.title}</h3>
              <p className="text-brand-muted text-lg leading-relaxed">{s.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
