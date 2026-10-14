// Classes compartilhadas do painel (visual padrão da plataforma, igual para todas as lojas).
export const input =
  "w-full h-12 px-4 rounded-xl border border-brand-line bg-white text-brand-dark placeholder:text-brand-muted focus:outline-none focus:border-brand-dark/40 focus:ring-2 focus:ring-brand-dark/10 transition";
export const textarea = input.replace("h-12", "min-h-28 py-3");
export const label = "block text-sm font-medium text-brand-dark mb-2";
export const card = "bg-white rounded-2xl border border-brand-line p-5 sm:p-6";
export const primaryButton =
  "inline-flex items-center justify-center gap-2 bg-brand-dark text-brand-light px-6 h-12 rounded-full font-semibold hover:bg-brand-primary transition-colors active:scale-95 disabled:opacity-50";
export const ghostButton =
  "inline-flex items-center justify-center gap-2 px-4 h-10 rounded-full font-semibold text-sm text-brand-dark bg-brand-soft border border-brand-line hover:border-brand-dark/30 transition-colors active:scale-95 disabled:opacity-50";
