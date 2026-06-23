import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useCart, useWishlist, useRecentlyViewed } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { Heart, ShieldCheck, Truck, RotateCcw, Star, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ProductGrid from "@/components/ProductGrid";

export default function ProductPage() {
  const { handle } = useParams();
  const [p, setP] = useState(null);
  const [related, setRelated] = useState([]);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => p && s.has(p.id));
  const pushRecent = useRecentlyViewed((s) => s.push);

  useEffect(() => {
    setP(null); setImgIdx(0); setQty(1);
    api.product(handle).then((prod) => {
      setP(prod); pushRecent(prod.id);
      if (prod.collections?.[0]) api.products({ collection: prod.collections[0] }).then((all) => setRelated(all.filter(x => x.id !== prod.id).slice(0, 4)));
    }).catch(() => setP(false));
  }, [handle, pushRecent]);

  if (p === null) return <div className="px-4 md:px-8 py-32 text-center text-muted">Loading…</div>;
  if (p === false) return <div className="px-4 md:px-8 py-32 text-center"><p className="font-display text-3xl">Not found</p><Link to="/" className="underline mt-3 inline-block">Go home</Link></div>;
  const discount = p.compare_at_price ? Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100) : 0;

  return (
    <div data-testid={`product-page-${handle}`} className="px-4 md:px-8 pt-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        <div>
          <motion.div key={imgIdx} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} className="rounded-3xl overflow-hidden glass-card aspect-square">
            <img src={p.images[imgIdx]} alt={p.title} className="w-full h-full object-cover" />
          </motion.div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {p.images.map((src, i) => (
              <button key={i} onClick={() => setImgIdx(i)} className={`rounded-2xl overflow-hidden aspect-square border-2 transition ${i === imgIdx ? "" : "opacity-70"}`} style={{ borderColor: i === imgIdx ? "var(--accent)" : "transparent" }} aria-label={`Image ${i+1}`}>
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="md:py-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted">
            {p.collections?.[0] && <Link to={`/collections/${p.collections[0]}`} className="hover:text-accent">{p.collections[0].replace(/-/g, " ")}</Link>}
            {p.badges?.map((b) => <span key={b} className="chip">{b}</span>)}
          </div>
          <h1 className="font-display text-4xl md:text-6xl mt-3 leading-[0.95]">{p.title}</h1>
          {p.subtitle && <p className="text-muted mt-2">{p.subtitle}</p>}

          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-1 text-sm"><Star size={14} fill="currentColor" />{p.rating.toFixed(1)}</div>
            <span className="text-muted text-sm">· {p.reviews_count} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl md:text-4xl">{formatINR(p.price)}</span>
            {p.compare_at_price && <span className="text-muted line-through">{formatINR(p.compare_at_price)}</span>}
            {discount > 0 && <span className="chip-outline">Save {discount}%</span>}
          </div>

          <p className="mt-6 text-muted text-base leading-relaxed">{p.description}</p>

          <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {p.movement && <Spec label="Movement" value={p.movement} />}
            {p.strap && <Spec label="Strap" value={p.strap} />}
            {p.water_resistance && <Spec label="Water Resistance" value={p.water_resistance} />}
            <Spec label="Warranty" value={p.warranty} />
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border px-3 py-2" style={{ borderColor: "var(--border)" }}>
              <button data-testid="qty-minus" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease"><Minus size={14} /></button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button data-testid="qty-plus" onClick={() => setQty(qty + 1)} aria-label="Increase"><Plus size={14} /></button>
            </div>
            <button
              data-testid="add-to-cart"
              onClick={() => { add(p, qty); toast.success(`${p.title} × ${qty} added`); }}
              className="btn-luxe flex-1"
            >
              Add To Cart · {formatINR(p.price * qty)}
            </button>
            <button data-testid="wishlist-toggle-pdp" onClick={() => { toggleWish(p.id); toast.success(wished ? "Removed" : "Wishlisted"); }} className="w-12 h-12 rounded-full glass-card flex items-center justify-center" aria-label="Wishlist">
              <Heart size={18} fill={wished ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
            <Perk icon={<Truck size={16} />} label="All Over India Shipping" />
            <Perk icon={<RotateCcw size={16} />} label="30-day Returns" />
            <Perk icon={<ShieldCheck size={16} />} label="Fast Delivery" />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <ProductGrid products={related} eyebrow="You may also love" title="Related" />
      )}
    </div>
  );
}

const Spec = ({ label, value }) => (
  <div className="p-4 rounded-2xl glass-card">
    <p className="text-[10px] uppercase tracking-[0.3em] text-muted">{label}</p>
    <p className="mt-1 text-sm">{value}</p>
  </div>
);

const Perk = ({ icon, label }) => (
  <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ borderColor: "var(--border)" }}>
    {icon}<span>{label}</span>
  </div>
);
