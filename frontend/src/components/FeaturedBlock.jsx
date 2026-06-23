import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedBlock() {
  return (
    <section className="mt-20 md:mt-28 px-3 md:px-8" data-testid="featured-editorial">
      <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] min-h-[480px] md:min-h-[560px] grid grid-cols-1 md:grid-cols-2 luxe-gradient">
        <div className="p-8 md:p-14 flex flex-col justify-between order-2 md:order-1">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted mb-3">The Atelier</p>
            <h3 className="font-display text-4xl md:text-6xl leading-[1]">
              Built in Ajmer.<br />Worn worldwide.
            </h3>
            <p className="mt-6 text-base md:text-lg text-muted max-w-md">
              Every M.S timepiece passes through twelve pairs of expert hands. Hand-polished, hand-assembled, hand-tested for accuracy within −1/+3 seconds per day.
            </p>
          </div>
          <Link to="/collections/luxury" data-testid="featured-cta" className="mt-8 inline-flex items-center gap-2 self-start px-6 py-3.5 rounded-full text-sm font-medium tracking-wide transition" style={{ background: "var(--text)", color: "var(--bg)" }}>
            Visit The Atelier <ArrowUpRight size={16} />
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="order-1 md:order-2 relative min-h-[300px] md:min-h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1600&q=85"
            alt="Atelier"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
