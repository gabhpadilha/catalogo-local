"use client";

import { useState } from "react";
import { card } from "./ui";

type Props = { url: string; storeName: string; qrSvg: string };

// Divulgação: link da vitrine, mensagem pronta e QR Code para imprimir no balcão.
export default function ShareCard({ url, storeName, qrSvg }: Props) {
  const [copied, setCopied] = useState("");
  const message = `Agora a ${storeName} tem vitrine online: escolha os produtos, peça pelo WhatsApp e receba hoje. ${url}`;

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(""), 2000);
    } catch {}
  };
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: storeName, text: message, url });
      } catch {}
    } else copy(message, "mensagem");
  };
  const qrHref = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg)}`;
  const button = "inline-flex items-center justify-center h-10 px-4 rounded-full text-sm font-semibold bg-brand-soft hover:bg-brand-line transition-colors";

  return (
    <section aria-labelledby="divulgar" className={card}>
      <h2 id="divulgar" className="headline font-bold text-lg">Divulgue sua loja</h2>
      <div className="mt-4 flex gap-4 items-start">
        {/* QR Code gerado no servidor, sem serviço externo */}
        <div className="shrink-0 w-28 h-28 rounded-xl bg-white ring-1 ring-brand-line p-1.5 [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: qrSvg }} aria-label={`QR Code da vitrine ${storeName}`} role="img" />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-brand-muted">Coloque o link na bio do Instagram e o QR Code no balcão e nas sacolas.</p>
          <p className="mt-2 text-sm font-medium truncate">{url.replace(/^https?:\/\//, "")}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => copy(url, "link")} className={button}>
          {copied === "link" ? "Link copiado" : "Copiar link"}
        </button>
        <button type="button" onClick={share} className={button}>
          {copied === "mensagem" ? "Mensagem copiada" : "Compartilhar"}
        </button>
        <a href={qrHref} download={`qrcode-${storeName}.svg`} className={button}>
          Baixar QR Code
        </a>
      </div>
    </section>
  );
}
