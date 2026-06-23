import { useEffect, useState } from "react";
import { useWishlist } from "@/lib/store";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const ids = useWishlist((s) => s.ids);
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.products({}).then((all) => setItems(all.filter((p) => ids.includes(p.id))));
  }, [ids]);

  return (
    <div data-testid="wishlist-page" className="px-4 md:px-8 max-w-[1400px] mx-auto pt-8 md:pt-12">
      <p className="text-xs uppercase tracking-[0.4em] text-muted mb-3">Saved</p>
      <h1 className="font-display text-5xl md:text-7xl">Wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted">No saved pieces yet.</p>
          <Link to="/" className="mt-4 inline-block btn-luxe">Discover Timepieces</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
