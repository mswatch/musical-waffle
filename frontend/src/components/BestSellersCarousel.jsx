import { useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function BestSellersCarousel({ products = [], title = "Best Sellers", eyebrow = "Loved by collectors", viewAllTo }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  return (
    <section className="mt-16 md:mt-24" data-testid="best-sellers">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-end justify-between mb-6 md:mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted mb-2">{eyebrow}</p>
          <h2 className="font-display text-4xl md:text-6xl">{title}</h2>
        </div>
        <div className="hidden md:flex items-center gap-3">
          {viewAllTo && <Link to={viewAllTo} className="text-sm underline underline-offset-4">View all</Link>}
          <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full glass-card flex items-center justify-center" aria-label="Prev"><ChevronLeft size={18} /></button>
          <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full glass-card flex items-center justify-center" aria-label="Next"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div ref={ref} className="overflow-x-auto no-scrollbar snap-x-strong px-4 md:px-8">
        <div className="flex gap-4 md:gap-6 w-max pb-2">
          {products.map((p, i) => (
            <div key={p.id} className="snap-start-strong w-[230px] md:w-[300px] flex-shrink-0">
              <ProductCard p={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
