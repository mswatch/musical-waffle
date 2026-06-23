import { Link } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { useCart, useWishlist } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ProductCard({ p, index = 0 }) {
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.has(p.id));
  const discount = p.compare_at_price ? Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.2, 0.7, 0.2, 1] }}
      className="product-card group"
      data-testid={`product-card-${p.handle}`}
    >
      <div className="relative rounded-3xl overflow-hidden glass-card aspect-[4/5]">
        <Link to={`/products/${p.handle}`} className="block w-full h-full">
          <img
            src={p.images?.[0]} alt={p.title} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {p.images?.[1] && (
            <img src={p.images[1]} alt="" loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {p.badges?.map((b) => <span key={b} className="chip">{b}</span>)}
          {discount > 0 && <span className="chip-outline" style={{ background: "color-mix(in srgb, var(--bg) 80%, transparent)" }}>−{discount}%</span>}
        </div>

        <button
          data-testid={`wishlist-toggle-${p.handle}`}
          onClick={(e) => { e.preventDefault(); toggleWish(p.id); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }}
          aria-label="Wishlist"
          className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center glass-card"
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>

        <button
          data-testid={`quick-add-${p.handle}`}
          onClick={(e) => { e.preventDefault(); add(p); toast.success(`${p.title} added`); }}
          className="absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0"
          style={{ background: "var(--text)", color: "var(--bg)" }}
          aria-label="Quick add"
        >
          <Plus size={18} />
        </button>
      </div>

      <Link to={`/products/${p.handle}`} className="block mt-4 px-1">
        <p className="font-display text-lg md:text-xl leading-tight">{p.title}</p>
        {p.subtitle && <p className="text-xs text-muted mt-0.5">{p.subtitle}</p>}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-medium">{formatINR(p.price)}</span>
          {p.compare_at_price && (
            <span className="text-xs text-muted line-through">{formatINR(p.compare_at_price)}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
