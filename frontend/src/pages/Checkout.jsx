import { useSearchParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "@/lib/store";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutConfirm() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const clear = useCart((s) => s.clear);

  useEffect(() => { clear(); }, [clear]);

  return (
    <div data-testid="checkout-confirm" className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center glass-card rounded-3xl p-8 md:p-12">
        <CheckCircle2 size={48} className="mx-auto" style={{ color: "var(--accent-strong)" }} />
        <p className="text-xs uppercase tracking-[0.4em] text-muted mt-6">Order Pending</p>
        <h1 className="font-display text-4xl md:text-5xl mt-3">Almost there.</h1>
        <p className="mt-4 text-muted text-sm">
          Your order <span className="font-medium" style={{ color: "var(--text)" }}>#{orderId?.slice(0, 8)}</span> is staged.
          Final payment will be processed through Shopify Checkout once the Storefront API credentials are connected.
        </p>
        <p className="mt-3 text-xs text-muted">For now, our concierge will reach out on WhatsApp within 2 hours.</p>
        <Link to="/" className="mt-8 inline-block btn-luxe">Continue Shopping</Link>
      </div>
    </div>
  );
}
