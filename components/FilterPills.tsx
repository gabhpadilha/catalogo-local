type FilterPillsProps = {
  options: string[];
  active: string;
  highlight?: string;
  onChange: (option: string) => void;
};

export default function FilterPills({ options, active, highlight, onChange }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2.5 mb-10 justify-center md:justify-start">
      {options.map((option) => {
        const isActive = active === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 ${
              isActive
                ? `${option === highlight ? "bg-brand-primary" : "bg-brand-dark"} text-brand-light shadow-md`
                : "bg-white text-brand-muted border border-gray-200 hover:border-brand-dark hover:text-brand-dark"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
