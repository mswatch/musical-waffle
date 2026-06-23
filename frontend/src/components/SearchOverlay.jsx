import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function SearchOverlay({ open, onClose, onSelect }) {
  const [q, setQ] = useState("");
  const [data, setData] = useState({ products: [], collections: [] });

  useEffect(() => {
    if (!q) { setData({ products: [], collections: [] }); return; }
    const t = setTimeout(() => api.search(q).then(setData).catch(() => {}), 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50" style={{ background: "color-mix(in srgb, var(--bg) 92%, transparent)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            data-testid="search-overlay"
            className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pt-16 md:pt-24"
            initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl glass-card">
                <SearchIcon size={20} />
                <input
                  data-testid="search-input"
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search timepieces, collections, references…"
                  className="flex-1 bg-transparent outline-none text-base"
                />
                <button onClick={onClose} aria-label="Close"><X size={20} /></button>
              </div>
              {(data.products.length > 0 || data.collections.length > 0) && (
                <div className="mt-4 rounded-2xl glass-card p-4 max-h-[60vh] overflow-y-auto">
                  {data.collections.length > 0 && (
                    <>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">Collections</p>
                      <div className="space-y-1 mb-4">
                        {data.collections.map((c) => (
                          <Link key={c.handle} to={`/collections/${c.handle}`} onClick={onClose} className="block px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                            <span className="font-display text-lg">{c.title}</span>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                  {data.products.length > 0 && (
                    <>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted mb-2">Products</p>
                      <div className="grid grid-cols-1 gap-2">
                        {data.products.map((p) => (
                          <button key={p.id} onClick={() => onSelect(p.handle)} data-testid={`search-result-${p.handle}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-left">
                            <img src={p.images?.[0]} alt={p.title} className="w-14 h-14 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-display text-base truncate">{p.title}</p>
                              <p className="text-xs text-muted truncate">{p.subtitle}</p>
                            </div>
                            <span className="text-sm">{formatINR(p.price)}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
              {q && data.products.length === 0 && data.collections.length === 0 && (
                <div className="mt-4 px-5 py-6 rounded-2xl glass-card text-sm text-muted">No results for "{q}"</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
