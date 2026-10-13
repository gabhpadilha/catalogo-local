import Image from "next/image";
import type { Store } from "@/lib/types";

const CtaButton = ({ className = "" }: { className?: string }) => (
  <a
    href="#catalogo"
    className={`items-center gap-2 bg-brand-dark text-brand-light px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-primary transition-colors active:scale-95 shadow-xl ${className}`}
  >
    Explorar Catálogo
  </a>
);

export default function Hero({ store }: { store: Store }) {
  const { hero } = store;
  return (
    <section className="min-h-[85vh] md:min-h-[calc(100vh-5rem)] flex items-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-32 pb-8 md:pb-12">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full">
        <div className="flex-1 max-w-xl text-center md:text-left z-20 mt-4 md:mt-0">
          <span className="inline-block mb-4 text-xs font-black uppercase tracking-[0.2em] text-brand-muted">
            {store.name} · {store.segment}
          </span>
          <h1 className="text-[3.5rem] leading-[0.95] sm:text-7xl md:text-8xl font-black text-brand-dark tracking-tighter mb-4 break-words">
            {hero.title} <br />
            <span className="text-brand-primary">{hero.highlight}</span>
          </h1>
          <p className="text-base md:text-xl text-brand-muted font-medium mb-4 md:mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
            {hero.text}
          </p>
          <CtaButton className="hidden md:inline-flex" />
        </div>

        <div className="w-full flex-1 relative flex justify-center items-center min-h-[220px] md:min-h-[500px] z-10 mt-6 md:mt-0 mb-4 md:mb-0">
          {hero.imageUrl ? (
            <>
              <Image
                src={hero.imageUrl}
                alt={`Destaque ${store.name}`}
                width={500}
                height={500}
                preload
                sizes="(min-width: 768px) 500px, 320px"
                className="w-full max-w-[320px] sm:max-w-md object-contain animate-float-shoe relative drop-shadow-[0_40px_25px_rgba(0,0,0,0.4)]"
              />
              <div className="absolute bottom-[-10%] md:bottom-[10%] left-1/2 w-48 sm:w-80 h-5 sm:h-12 bg-black rounded-[100%] blur-xl animate-floor-shadow pointer-events-none -z-10" />
            </>
          ) : (
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-[2.5rem] bg-brand-primary text-brand-light flex items-center justify-center shadow-2xl rotate-3 animate-float-shoe">
              <span className="text-8xl sm:text-9xl font-black tracking-tighter">{store.name.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="md:hidden w-full flex justify-center z-20 mt-4 mb-2">
          <CtaButton className="inline-flex" />
        </div>
      </div>
    </section>
  );
}
