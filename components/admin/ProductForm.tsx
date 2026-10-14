"use client";

import { useActionState } from "react";
import { deleteProduct, saveProduct, type ActionState } from "@/app/admin/actions";
import type { AdminProduct } from "@/lib/admin";
import ImageUpload from "./ImageUpload";
import VariantsEditor from "./VariantsEditor";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";
import { card, input, label, textarea } from "./ui";

type Props = { slug: string; storeId: string; product?: AdminProduct; categories: string[] };

const money = (n?: number | null) => (n == null ? "" : n.toFixed(2).replace(".", ","));

export default function ProductForm({ slug, storeId, product, categories }: Props) {
  const [state, action] = useActionState<ActionState, FormData>(saveProduct.bind(null, slug, product?.id ?? null), {});
  const variants = [...(product?.product_variants ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({ label: v.label, inStock: v.stock == null || v.stock > 0 }));

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <section className={`${card} space-y-5`}>
          <ImageUpload name="image_url" storeId={storeId} defaultUrl={product?.image_url} label="Foto" hint="Fundo limpo e boa luz vendem mais." />

          <div>
            <label htmlFor="p-name" className={label}>Nome do produto</label>
            <input id="p-name" name="name" required maxLength={120} defaultValue={product?.name} placeholder="Ex.: Furadeira de Impacto 650W" className={input} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="p-price" className={label}>Preço (R$)</label>
              <input id="p-price" name="price" required inputMode="decimal" defaultValue={money(product?.price)} placeholder="59,90" className={input} />
            </div>
            <div>
              <label htmlFor="p-orig" className={label}>Preço &ldquo;de&rdquo; (opcional)</label>
              <input id="p-orig" name="original_price" inputMode="decimal" defaultValue={money(product?.original_price)} placeholder="79,90" className={input} />
            </div>
          </div>
          <p className="text-xs text-brand-muted -mt-3">Preencha o preço &ldquo;de&rdquo; para o produto aparecer em Ofertas com desconto.</p>

          <div>
            <label htmlFor="p-cat" className={label}>Categoria</label>
            <input id="p-cat" name="category" list="categorias" maxLength={40} defaultValue={product?.category} placeholder="Ex.: Ferramentas" className={input} />
            <datalist id="categorias">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="p-desc" className={label}>Descrição</label>
            <textarea id="p-desc" name="description" maxLength={2000} defaultValue={product?.description} placeholder="Material, medidas, para que serve…" className={textarea} />
          </div>
        </section>

        <section className={card}>
          <VariantsEditor initial={variants} />
        </section>

        <section className={`${card} flex items-center justify-between gap-4`}>
          <label htmlFor="p-active" className="font-bold">
            Mostrar na vitrine
            <span className="block text-sm font-medium text-brand-muted">Desligue para esconder sem apagar.</span>
          </label>
          <input id="p-active" name="is_active" type="checkbox" defaultChecked={product?.is_active ?? true} className="w-6 h-6 accent-brand-dark" />
        </section>

        <FormMessage state={state} />
        <SubmitButton className="w-full">{product ? "Salvar alterações" : "Publicar produto"}</SubmitButton>
      </form>

      {product && (
        <form
          action={deleteProduct.bind(null, slug, product.id)}
          onSubmit={(e) => {
            if (!confirm(`Apagar "${product.name}"? Isso não pode ser desfeito.`)) e.preventDefault();
          }}
        >
          <button type="submit" className="w-full h-12 rounded-full font-bold text-red-600 hover:bg-red-50 transition-colors">
            Apagar produto
          </button>
        </form>
      )}
    </div>
  );
}
