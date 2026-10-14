"use client";

import { useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { ghostButton, label as labelClass } from "./ui";

const MAX_SIDE = 1200;

// Reduz a foto no próprio celular antes de enviar (fotos de 5 MB viram ~150 KB).
async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Falha ao processar a imagem"))), "image/webp", 0.82)
  );
}

type Props = { name: string; storeId: string; defaultUrl?: string | null; label: string; hint?: string; round?: boolean };

export default function ImageUpload({ name, storeId, defaultUrl, label, hint, round }: Props) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    setStatus("uploading");
    try {
      const blob = await compress(file);
      const path = `${storeId}/${crypto.randomUUID()}.webp`;
      const supabase = createBrowserSupabase();
      const { error } = await supabase.storage.from("product-images").upload(path, blob, { contentType: "image/webp" });
      if (error) throw error;
      setUrl(supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl);
      setStatus("idle");
    } catch (e) {
      console.error(e);
      setStatus("error");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`relative shrink-0 w-28 h-28 overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 hover:border-brand-dark transition-colors flex items-center justify-center ${round ? "rounded-full" : "rounded-2xl"}`}
          aria-label={url ? `Trocar ${label}` : `Enviar ${label}`}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- pré-visualização local, sem otimização
            <img src={url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl text-brand-muted">+</span>
          )}
          {status === "uploading" && (
            <span className="absolute inset-0 bg-white/80 flex items-center justify-center text-xs font-bold">Enviando…</span>
          )}
        </button>
        <div className="space-y-2 text-sm">
          <button type="button" onClick={() => inputRef.current?.click()} className={ghostButton} disabled={status === "uploading"}>
            {url ? "Trocar foto" : "Tirar ou escolher foto"}
          </button>
          {url && (
            <button type="button" onClick={() => setUrl("")} className="block text-xs font-bold text-brand-muted hover:text-red-600">
              Remover
            </button>
          )}
          {hint && <p className="text-xs text-brand-muted">{hint}</p>}
          {status === "error" && <p className="text-xs font-bold text-red-600">Não foi possível enviar. Tente outra foto.</p>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
    </div>
  );
}
