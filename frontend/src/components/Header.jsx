import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon } from "lucide-react";
import { useCart, useWishlist, useTheme } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "./SearchOverlay";

const NAV_LINKS = [
  { label: "Men", to: "/collections/mens" },
  { label: "Women", to: "/collections/womens" },
  { label: "Luxury", to: "/collections/luxury" },
  { label: "Smart", to: "/collections/smart" },
  { label: "Limited", to: "/collections/limited-edition" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCart((s) => s.count());
  const setCartOpen = useCart((s) => s.setOpen);
  const wishCount = useWishlist((s) => s.ids.length);
  const { mode, toggle } = useTheme();
  const nav = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        data-testid="site-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "backdrop-blur-xl" : ""}`}
        style={{
          background: scrolled ? "color-mix(in srgb, var(--bg) 78%, transparent)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          <button
            data-testid="menu-toggle"
            onClick={() => setMenu(true)}
            className="md:hidden p-2 -ml-2"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/" data-testid="brand-logo" className="flex flex-col leading-none">
            <span className="font-display text-xl md:text-2xl tracking-tight" style={{ color: "var(--text)" }}>
              Watches by <span className="italic">M.S</span>
            </span>
            <span className="hidden md:block text-[10px] tracking-[0.32em] uppercase text-muted mt-0.5">
              Time Crafted For Excellence
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                data-testid={`nav-${l.label.toLowerCase()}`}
                className="text-sm tracking-wide hover:text-accent transition-colors"
                style={{ color: "var(--text)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
            <button data-testid="search-btn" onClick={() => setSearchOpen(true)} className="p-2" aria-label="Search">
              <Search size={20} />
            </button>
            <button data-testid="theme-toggle" onClick={toggle} className="p-2" aria-label="Theme">
              {mode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/wishlist" data-testid="wishlist-link" className="p-2 relative" aria-label="Wishlist">
              <Heart size={20} />
              {wishCount > 0 && <Badge n={wishCount} />}
            </Link>
            <Link to="/account" data-testid="account-link" className="hidden md:block p-2" aria-label="Account">
              <User size={20} />
            </Link>
            <button data-testid="cart-btn" onClick={() => setCartOpen(true)} className="p-2 relative" aria-label="Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && <Badge n={cartCount} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenu(false)}
            />
            <motion.aside
              data-testid="mobile-drawer"
              className="fixed left-0 top-0 bottom-0 w-[86%] max-w-[360px] z-50 p-6 flex flex-col"
              style={{ background: "var(--bg)" }}
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-xl">Watches by M.S</span>
                <button onClick={() => setMenu(false)} aria-label="Close"><X size={22} /></button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.to} to={l.to}
                    onClick={() => setMenu(false)}
                    data-testid={`drawer-nav-${l.label.toLowerCase()}`}
                    className="py-4 border-b font-display text-2xl"
                    style={{ borderColor: "var(--border)", color: "var(--text)" }}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link to="/wishlist" onClick={() => setMenu(false)} className="py-4 border-b font-display text-2xl" style={{ borderColor: "var(--border)" }}>Wishlist</Link>
                <Link to="/account" onClick={() => setMenu(false)} className="py-4 border-b font-display text-2xl" style={{ borderColor: "var(--border)" }}>Account</Link>
              </nav>
              <div className="mt-auto pt-6">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Boutique</p>
                <p className="mt-2 text-sm">Ajmer, Rajasthan · India</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={(handle) => { setSearchOpen(false); nav(`/products/${handle}`); }} />
    </>
  );
}

const Badge = ({ n }) => (
  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-medium"
    style={{ background: "var(--text)", color: "var(--bg)" }}>{n}</span>
);
