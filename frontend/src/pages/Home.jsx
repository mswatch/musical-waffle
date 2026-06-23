import { useEffect, useState } from "react";
import HeroSlider from "@/components/HeroSlider";
import ScrollRevealBanner from "@/components/ScrollRevealBanner";
import CollectionsRow from "@/components/CollectionsRow";
import ProductGrid from "@/components/ProductGrid";
import BestSellersCarousel from "@/components/BestSellersCarousel";
import FeaturedBlock from "@/components/FeaturedBlock";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";

const TRUST = [
  { label: "All Over India Shipping", desc: "Across India" },
  { label: "Fast Delivery", desc: "Quick arrival" },
  { label: "30 Day Returns", desc: "No questions" },
  { label: "Authentic", desc: "Hand-crafted in Ajmer" },
];

export default function Home() {
  const [collections, setCollections] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    api.collections().then(setCollections);
    api.products({ tag: "new" }).then(setNewArrivals);
    api.products({ tag: "bestseller" }).then(setBestSellers);
  }, []);

  return (
    <div data-testid="home-page">
      <HeroSlider />

      <div className="mt-10 md:mt-14 overflow-hidden border-y" style={{ borderColor: "var(--border)" }}>
        <div className="flex marquee-track py-4 whitespace-nowrap text-sm uppercase tracking-[0.4em] text-muted">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex shrink-0 items-center gap-12 px-6">
              {TRUST.map((t) => (
                <span key={t.label + k} className="inline-flex items-center gap-3">
                  <span className="font-medium" style={{ color: "var(--text)" }}>{t.label}</span>
                  <span className="opacity-60">·</span>
                  <span>{t.desc}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <CollectionsRow collections={collections} />

      <ProductGrid
        products={newArrivals}
        eyebrow="Fresh from the atelier"
        title="New Arrivals"
        cta={<Link to="/collections/mens" className="hidden md:inline-block text-sm underline underline-offset-4">Explore all</Link>}
      />

      <BestSellersCarousel products={bestSellers} title="Best Sellers" eyebrow="Loved by collectors" viewAllTo="/collections/luxury" />

      <FeaturedBlock />

      <section className="mt-20 md:mt-28 px-4 md:px-8 max-w-[1400px] mx-auto" data-testid="story-block">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted mb-3">Since 1998</p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1]">A quiet obsession with time.</h2>
            <p className="mt-6 text-muted text-base md:text-lg max-w-md">
              From a small workshop in Ajmer's old quarter to the wrists of collectors across the world. Two decades, one obsession: timepieces that outlast trends.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <Stat n="200K+" l="Pieces Sold" />
              <Stat n="48" l="Countries" />
              <Stat n="4.9★" l="Avg Rating" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1606293459209-77df5c8eea66?w=900&q=85" alt="" className="rounded-3xl aspect-[3/4] object-cover" loading="lazy" />
            <img src="https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=900&q=85" alt="" className="rounded-3xl aspect-[3/4] object-cover mt-10" loading="lazy" />
          </div>
        </div>
      </section>

      <ScrollRevealBanner />
    </div>
  );
}

const Stat = ({ n, l }) => (
  <div>
    <p className="font-display text-3xl md:text-4xl">{n}</p>
    <p className="text-xs uppercase tracking-[0.25em] text-muted mt-1">{l}</p>
  </div>
);
