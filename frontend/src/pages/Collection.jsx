import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

export default function CollectionPage() {
  const { handle } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => { api.collection(handle).then(setData).catch(() => setData({ collection: null, products: [] })); }, [handle]);
  if (!data) return <div className="px-4 md:px-8 py-32 text-center text-muted">Loading…</div>;
  const c = data.collection || { title: handle, description: "" };

  return (
    <div data-testid={`collection-page-${handle}`}>
      <section className="px-3 md:px-8 pt-3 md:pt-6">
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] h-[300px] md:h-[420px] luxe-gradient">
          {c.hero_image && <img src={c.hero_image} alt={c.title} className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply" />}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <p className="text-xs uppercase tracking-[0.4em] text-white/80 mb-3">Collection</p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[0.95]">{c.title}</h1>
            <p className="mt-3 text-white/85 max-w-xl text-sm md:text-base">{c.description}</p>
          </div>
        </div>
      </section>

      <ProductGrid products={data.products} eyebrow={`${data.products.length} pieces`} />
    </div>
  );
}
