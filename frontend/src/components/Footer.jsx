import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="mt-24 border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <p className="font-display text-3xl mb-3">Watches by M.S</p>
          <p className="text-sm text-muted max-w-sm">Luxury timepieces hand-finished in Ajmer, Rajasthan. Worn by those who know that time is the only true currency.</p>
          <div className="mt-6 flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-muted">
            <span>All Over India Shipping</span>·<span>Fast Delivery</span>·<span>Authentic</span>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/collections/mens">Men's</Link></li>
            <li><Link to="/collections/womens">Women's</Link></li>
            <li><Link to="/collections/luxury">Luxury</Link></li>
            <li><Link to="/collections/limited-edition">Limited Edition</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">Support</p>
          <ul className="space-y-2 text-sm">
            <li>WhatsApp · +91 99999 99999</li>
            <li>care@watchesbyms.in</li>
            <li>Ajmer, Rajasthan</li>
            <li>Mon–Sat · 10am–8pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted">
          <span>© 2026 Watches by M.S. All rights reserved.</span>
          <span className="tracking-[0.3em] uppercase">Time Crafted For Excellence</span>
        </div>
      </div>
    </footer>
  );
}
