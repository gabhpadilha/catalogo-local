import Image from "next/image";
import type { Store } from "@/lib/types";

// Logo da loja, ou a inicial nas cores dela. Usa o tema direto para funcionar também fora da vitrine.
export default function StoreMark({ store, size = 36, className = "" }: { store: Pick<Store, "name" | "logoUrl" | "theme">; size?: number; className?: string }) {
  const box = `shrink-0 rounded-[28%] overflow-hidden ${className}`;
  if (store.logoUrl) {
    return <Image src={store.logoUrl} alt="" width={size} height={size} className={`${box} object-cover`} style={{ width: size, height: size }} />;
  }
  return (
    <span
      aria-hidden="true"
      className={`${box} grid place-items-center font-bold headline`}
      style={{ width: size, height: size, fontSize: size * 0.5, background: store.theme.primary, color: store.theme.light }}
    >
      {store.name.charAt(0)}
    </span>
  );
}
