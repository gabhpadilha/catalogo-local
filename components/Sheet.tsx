"use client";

import { useEffect, useRef } from "react";
import { enterOverlay } from "@/lib/overlayHistory";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  /** No desktop: modal no centro ou gaveta lateral. No mobile é sempre bottom sheet. */
  variant?: "center" | "right";
  /** Largura máxima do modal central (ex.: "52rem"). */
  width?: string;
  /** false: não cria entrada no histórico. Texto: URL da entrada (link direto). */
  history?: boolean | string;
  className?: string;
  children: React.ReactNode;
};

// <dialog> nativo: prende o foco, fecha com Esc e deixa o resto da página inerte.
export default function Sheet({ open, onClose, labelledBy, variant = "center", width, history = true, className = "", children }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const pressedBackdrop = useRef(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    if (!dialog.open) {
      dialog.showModal();
      // Foco no próprio diálogo (anunciado pelo título), sem destacar o primeiro botão; o Tab segue para dentro.
      dialog.focus();
    }
    const leave = history ? enterOverlay(() => onCloseRef.current(), typeof history === "string" ? history : undefined) : undefined;
    return () => {
      dialog.close();
      leave?.();
    };
  }, [open, history]);

  return (
    <dialog
      ref={ref}
      tabIndex={-1}
      aria-labelledby={labelledBy}
      // Esc: quem fecha é o estado do React, para a entrada do histórico sair junto.
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // Clique no fundo escuro fecha (só se o clique começou nele, não ao arrastar uma seleção).
      onPointerDown={(e) => (pressedBackdrop.current = e.target === e.currentTarget)}
      onClick={(e) => pressedBackdrop.current && e.target === e.currentTarget && onClose()}
      className={`sheet sheet-${variant} focus:outline-none ${className}`}
      style={width ? ({ "--sheet-width": width } as React.CSSProperties) : undefined}
    >
      {children}
    </dialog>
  );
}

// Botão redondo de ícone usado nos cabeçalhos das gavetas.
export function SheetIconButton({ label, onClick, children, className = "" }: { label: string; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid place-items-center w-10 h-10 rounded-full text-brand-dark hover:bg-brand-soft transition-colors focus-visible:outline-2 focus-visible:outline-brand-dark ${className}`}
    >
      {children}
    </button>
  );
}
