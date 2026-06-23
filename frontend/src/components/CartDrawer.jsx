import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export default function CartDrawer() {
  const { items, open, setOpen, updateQty, remove, subtotal } = useCart();
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    try {
      setLoading(true);
      const lines = items.map((i) => ({ product_id: i.id, quantity: i.qty }));
      const res = await api.checkout({ lines });
      toast.success("Redirecting to checkout…");
      window.location.href = res.checkout_url;
    } catch (e) {
      toast.error("Checkout unavailable. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 bg-black/50 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            data-testid="cart-drawer"
            className="fixed right-0 top-0 bottom-0 w-full max-w-[440px] z-50 flex flex-col"
            style={{ background: "var(--bg)" }}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
          >
            <div className="p-6 flex items-center justify-between border-b" style={{ borderColor: "var(--border)" }}>
              <p className="font-display text-2xl">Your Cart</p>
              <button onClick={() => setOpen(false)} aria-label="Close"><X size={22} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center pt-20">
                  <ShoppingBag size={42} className="text-muted mb-4" />
                  <p className="font-display text-2xl mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted mb-6">Discover timepieces that move you.</p>
                  <button onClick={() => setOpen(false)} className="btn-luxe">Continue Shopping</button>
                </div>
              )}
              {items.map((i) => (
                <div key={i.id} data-testid={`cart-line-${i.handle}`} className="flex gap-4 p-3 rounded-2xl glass-card">
                  <img src={i.image} alt={i.title} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${i.handle}`} onClick={() => setOpen(false)} className="font-display text-base leading-tight line-clamp-2">{i.title}</Link>
                    <p className="text-sm mt-1">{formatINR(i.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => updateQty(i.id, i.qty - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: "var(--border)" }}><Minus size={12} /></button>
                      <span className="w-6 text-center text-sm">{i.qty}</span>
                      <button onClick={() => updateQty(i.id, i.qty + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: "var(--border)" }}><Plus size={12} /></button>
                      <button onClick={() => remove(i.id)} className="ml-auto text-xs underline underline-offset-4 text-muted">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
                <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>{formatINR(subtotal())}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Shipping</span><span>Calculated at checkout</span></div>
                <button
                  data-testid="checkout-btn"
                  onClick={checkout}
                  disabled={loading}
                  className="btn-luxe w-full justify-center inline-flex items-center gap-2"
                >
                  {loading ? "Processing…" : "Proceed to Shopify Checkout"}
                </button>
                <p className="text-[11px] text-muted text-center">Secure checkout · Powered by Shopify</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
