import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CollectionsRow({ collections = [] }) {
  return (
    <section data-testid="collections-row" className="mt-16 md:mt-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-end justify-between mb-6 md:mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted mb-2">Curated</p>
          <h2 className="font-display text-4xl md:text-6xl">Our Collections</h2>
        </div>
      </div>
      <div className="overflow-x-auto no-scrollbar snap-x-strong px-4 md:px-8 pb-2">
        <div className="flex gap-5 md:gap-7 w-max">
          {collections.map((c, i) => (
            <Link
              key={c.handle}
              to={`/collections/${c.handle}`}
              data-testid={`collection-card-${c.handle}`}
              className="snap-start-strong group flex flex-col items-center text-center w-[150px] md:w-[180px] flex-shrink-0"
            >
              <motion.div
                className="w-[140px] h-[140px] md:w-[170px] md:h-[170px] rounded-full overflow-hidden glass-card relative"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={c.image} alt={c.title} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
              <p className="mt-4 font-display text-lg md:text-xl">{c.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
