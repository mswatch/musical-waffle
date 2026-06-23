import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import CollectionPage from "@/pages/Collection";
import ProductPage from "@/pages/Product";
import WishlistPage from "@/pages/Wishlist";
import AccountPage from "@/pages/Account";
import CheckoutPage from "@/pages/Checkout";
import NotFound from "@/pages/NotFound";
import { useTheme } from "@/lib/store";
import "@/App.css";

export default function App() {
  const init = useTheme((s) => s.init);
  useEffect(() => { init(); }, [init]);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/collections/:handle" element={<CollectionPage />} />
            <Route path="/products/:handle" element={<ProductPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/checkout/confirm" element={<CheckoutPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
