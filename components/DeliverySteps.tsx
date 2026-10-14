export type Step = { title: string; text: string };

const STEPS: Step[] = [
  { title: "Pedido no WhatsApp", text: "Finalize a sacola e a mensagem chega pronta para a loja, com o seu bairro." },
  { title: "Frete confirmado", text: "Cotamos a corrida no Uber Flash em tempo real e enviamos o valor final junto com o Pix." },
  { title: "Pagamento via Pix", text: "Pagou, a loja separa e embala o pedido na hora." },
  { title: "Motorista a caminho", text: "Um parceiro Uber retira na loja e você recebe o link para acompanhar a entrega." },
];

// Lista numerada porque é uma sequência de verdade: cada passo depende do anterior.
export default function DeliverySteps({ steps = STEPS }: { steps?: Step[] }) {
  return (
    <ol className="divide-y divide-brand-line border-y border-brand-line">
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-4 sm:gap-6 py-5 sm:py-6">
          <span className="shrink-0 grid place-items-center w-9 h-9 rounded-full border border-brand-line text-sm font-semibold tabular-nums text-brand-dark">
            {i + 1}
          </span>
          <div className="pt-1">
            <h3 className="font-semibold text-lg leading-snug">{s.title}</h3>
            <p className="mt-1 text-brand-muted leading-relaxed">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
