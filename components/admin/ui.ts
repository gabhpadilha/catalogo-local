// Classes compartilhadas do painel (visual padrão da plataforma, igual para todas as lojas).
export const input =
  "w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-brand-dark font-medium placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition";
export const textarea = input.replace("h-12", "min-h-28 py-3");
export const label = "block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2";
export const card = "bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 sm:p-6";
export const primaryButton =
  "inline-flex items-center justify-center gap-2 bg-brand-dark text-brand-light px-6 h-12 rounded-full font-bold hover:bg-brand-primary transition-colors active:scale-95 disabled:opacity-50";
export const ghostButton =
  "inline-flex items-center justify-center gap-2 px-4 h-10 rounded-full font-bold text-sm text-brand-dark bg-gray-100 hover:bg-gray-200 transition-colors active:scale-95 disabled:opacity-50";
