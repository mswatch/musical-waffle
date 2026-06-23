import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], title, subtitle, eyebrow, cta }) {
  return (
    <section className="mt-16 md:mt-24" data-testid="product-grid-section">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-end justify-between mb-6 md:mb-10">
        <div>
          {eyebrow && <p className="text-xs uppercase tracking-[0.4em] text-muted mb-2">{eyebrow}</p>}
          {title && <h2 className="font-display text-4xl md:text-6xl">{title}</h2>}
          {subtitle && <p className="text-muted mt-2 max-w-md text-sm">{subtitle}</p>}
        </div>
        {cta}
      </div>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
      </div>
    </section>
  );
}
