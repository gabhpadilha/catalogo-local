type FilterPillsProps = {
  options: string[];
  active: string;
  highlight?: string;
  onChange: (option: string) => void;
};

// Uma linha só: rola na horizontal no mobile em vez de quebrar em várias linhas.
export default function FilterPills({ options, active, highlight, onChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
      {options.map((option) => {
        const isActive = active === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className={`shrink-0 h-9 px-4 rounded-full text-sm font-medium border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark ${
              isActive
                ? "bg-brand-dark border-brand-dark text-brand-light"
                : `bg-white border-brand-line hover:border-brand-dark/40 ${option === highlight ? "text-brand-primary" : "text-brand-dark"}`
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
