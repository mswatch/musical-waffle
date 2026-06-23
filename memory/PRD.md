# Watches by M.S — Luxury Watch E-Commerce PRD

## Original Problem Statement
Build "Watches by M.S" — a world-class luxury watch e-commerce website for a premium watch company based in Ajmer, Rajasthan. Mobile-first, Shopify-ready architecture, premium hero slider, Carlington (carlington.in) inspired aesthetics.

## Tech Stack (chosen by user)
- Frontend: React 19 + Tailwind + Framer Motion + Zustand + Shadcn/UI
- Backend: FastAPI + MongoDB (Motor async)
- Future: Shopify Storefront API (stub layer in /app/frontend/src/lib/shopify.js)
- Catalog: Mock seed (8 collections × 12 products), Shopify-ready

## Brand
- Name: Watches by M.S
- Tagline: Time Crafted For Excellence
- Location: Ajmer, Rajasthan, India
- Light theme: #F8F7FC bg, purple gradient (#ECE7FF→#D8D2FF→#CFC8FF), accent #A38DFF
- Dark theme: #0B0B0B charcoal + gold (#D4AF37 primary, #F5D76E secondary)
- Fonts: Cormorant Garamond (display) + Inter (body)

## User Personas
1. Affluent gift-shopper (₹15K–₹35K range) browsing luxury & limited editions
2. Mobile-first young professional buying first premium watch (₹8K–₹18K)
3. Collector exploring new arrivals and limited drops

## What's Been Implemented (Feb 2026 — MVP)
**Backend (/app/backend/server.py)**
- Models: Product, Collection, Variant, CartLine, CheckoutRequest
- Routes: GET /api/, /api/collections, /api/collections/{handle}, /api/products (filters: collection, tag), /api/products/{handle}, /api/search, POST /api/checkout
- Mock seed: 8 collections × 12 luxury watch products with Unsplash imagery
- Checkout stub: returns /checkout/confirm?order=<id> until Shopify creds arrive

**Frontend**
- Routing: BrowserRouter with 7 routes (home, collections/:handle, products/:handle, wishlist, account, checkout/confirm, 404)
- Components: Header (sticky + mobile drawer), HeroSlider (autoplay + swipe + 5 dots), CollectionsRow (circular cards), ProductCard (quick-add + wishlist), ProductGrid, BestSellersCarousel, FeaturedBlock (atelier story), CartDrawer (slide-out), SearchOverlay (instant predictive), Footer
- State: Zustand stores for cart, wishlist, theme, recently viewed — all localStorage persisted
- Theme: Light (purple) ↔ Dark (gold) toggle, persisted
- Animations: Framer Motion fade/scale/translate, 60fps target

## What Works (verified by testing agent)
- 100% backend test pass (16/16)
- 95% frontend flows pass — home, hero, collection page, product page, cart, wishlist, search, theme toggle, mobile drawer
- Shopify-ready architecture (shopify.js client stub, env vars wired)

## Prioritized Backlog (P0/P1/P2)
### P1 (next phase — when Shopify creds arrive)
- Wire shopifyCheckout() in CartDrawer to call real Storefront API
- Replace mock catalog with Shopify products via Storefront GraphQL
- Shopify Customer Accounts on Account page

### P2 (premium features deferred)
- AI Watch Finder Quiz (with LLM integration)
- Luxury Gift Finder
- Virtual Try-On placeholder (camera)
- Limited Edition Countdown
- Warranty Registration form
- Store Locator (Ajmer boutique)
- WhatsApp Support widget
- Compare Products page
- Reviews module (with Judge.me-style integration)
- Recently Viewed strip on product page (state already exists)
- Product Schema, Organization Schema, FAQ Schema (SEO)

### P3 (optimisations)
- AVIF/WebP image CDN
- Static generation + ISR (when migrated to Next.js)
- Service worker / offline cart

## Next Actions
- Collect Shopify Storefront API token + domain to flip from mock to live
- Decide on warranty/registration backend (Shopify metafields vs MongoDB)
- Choose AI provider for Watch Finder Quiz (recommend GPT-5.2)
