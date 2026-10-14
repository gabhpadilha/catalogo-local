import Link from "next/link";
import type { SetupStep } from "@/lib/adminSetup";
import { CheckIcon, ChevronRightIcon } from "../icons";
import { card } from "./ui";

// Passo a passo de loja nova; some quando tudo estiver pronto.
export default function SetupChecklist({ steps }: { steps: SetupStep[] }) {
  const done = steps.filter((s) => s.done).length;
  if (done === steps.length) return null;
  const pct = Math.round((done / steps.length) * 100);
  return (
    <section aria-labelledby="config" className={card}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="config" className="headline font-bold text-lg">Deixe sua loja pronta para vender</h2>
        <span className="text-sm text-brand-muted tabular-nums">{done}/{steps.length}</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-brand-soft overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso da configuração">
        <div className="h-full rounded-full bg-brand-primary" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-4 divide-y divide-brand-line">
        {steps.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="flex items-center gap-3 py-3 group">
              <span className={`grid place-items-center w-6 h-6 rounded-full shrink-0 ${s.done ? "bg-brand-primary text-brand-light" : "ring-1 ring-brand-line"}`}>
                {s.done && <CheckIcon className="w-3.5 h-3.5" />}
              </span>
              <span className={`flex-1 text-sm ${s.done ? "text-brand-muted line-through" : "font-medium"}`}>{s.label}</span>
              {!s.done && <ChevronRightIcon className="w-4 h-4 text-brand-muted group-hover:text-brand-dark" />}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
