import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SLIDES = [
  { tag: "Men's Collection", title: "Elite Timepieces", sub: "Bold horology, crafted in Rajasthan.", cta: "Shop Men", to: "/collections/mens",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1600&q=85", grad: "linear-gradient(135deg,#ECE7FF 0%,#D8D2FF 60%,#CFC8FF 100%)" },
  { tag: "Women's Collection", title: "Quiet Luxury", sub: "Refined silhouettes, lasting elegance.", cta: "Shop Women", to: "/collections/womens",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=85", grad: "linear-gradient(135deg,#FFF1F8 0%,#FFE2EF 60%,#F8D7E6 100%)" },
  { tag: "Luxury Edition", title: "The Aristocrat", sub: "Skeleton automatic. Only 200 made.", cta: "Discover", to: "/collections/luxury",
    image: "https://images.unsplash.com/photo-1639037687665-37cf61fd0a96?w=1600&q=85", grad: "linear-gradient(135deg,#FFF7DE 0%,#FFEDB0 60%,#F4DC8B 100%)" },
  { tag: "Smart Watches", title: "Connected Heritage", sub: "Tradition meets tomorrow's tech.", cta: "Explore Smart", to: "/collections/smart",
    image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=1600&q=85", grad: "linear-gradient(135deg,#E6F4FF 0%,#CFE7FF 60%,#B3D7FF 100%)" },
  { tag: "New Arrivals", title: "Time, Reimagined", sub: "Fresh drops from our Ajmer atelier.", cta: "See What's New", to: "/collections/mens",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1600&q=85", grad: "linear-gradient(135deg,#EFEAFF 0%,#D8D2FF 60%,#A38DFF 100%)" },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [dragStart, setDragStart] = useState(null);
  const next = useCallback(() => setI((p) => (p + 1) % SLIDES.length), []);
  const prev = useCallback(() => setI((p) => (p - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const onTouchStart = (e) => setDragStart(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (dragStart == null) return;
    const dx = e.changedTouches[0].clientX - dragStart;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    setDragStart(null);
  };

  const s = SLIDES[i];

  return (
    <section data-testid="hero-slider" className="px-3 md:px-8 pt-3 md:pt-6">
      <div
        className="relative overflow-hidden rounded-[28px] md:rounded-[36px] h-[520px] md:h-[640px]"
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        style={{ background: s.grad }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <img
              src={s.image}
              alt={s.title}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.35) 100%)" }} />
          </motion.div>
        </AnimatePresence>

        <div className="relative h-full flex flex-col justify-between p-6 md:p-12">
          <div>
            <motion.span
              key={`tag-${i}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="inline-block text-[11px] md:text-xs uppercase tracking-[0.4em] text-white/90 px-3 py-1 border border-white/40 rounded-full backdrop-blur-sm"
            >
              {s.tag}
            </motion.span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.div
              key={`title-${i}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              className="max-w-2xl"
            >
              <h1 className="font-display text-white text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
                {s.title}
              </h1>
              <p className="mt-4 text-white/85 text-base md:text-lg max-w-md">{s.sub}</p>
              <Link
                to={s.to}
                data-testid="hero-cta"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black text-sm font-medium tracking-wide hover:bg-white/90 transition"
              >
                {s.cta} <ArrowRight size={16} />
              </Link>
            </motion.div>

            <div className="flex items-center gap-2 md:gap-3" data-testid="hero-pagination" role="tablist" aria-label="Hero slides">
              {SLIDES.map((_, idx) => {
                const active = idx === i;
                return (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    data-testid={`hero-pager-${idx}`}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-selected={active}
                    role="tab"
                    className="rounded-full flex items-center justify-center font-medium transition-all duration-500 ease-out tabular-nums"
                    style={{
                      width: active ? 44 : 36,
                      height: active ? 44 : 36,
                      border: `1px solid rgba(255,255,255,${active ? 0.95 : 0.55})`,
                      color: `rgba(255,255,255,${active ? 1 : 0.7})`,
                      fontSize: active ? 14 : 12,
                      background: active ? "rgba(255,255,255,0.08)" : "transparent",
                      backdropFilter: "blur(2px)",
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
