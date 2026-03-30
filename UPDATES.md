# MetalPosters — Development Updates

> Last updated: 31 March 2026

---

## 30 March 2026

### 1. Initial Hydrogen Storefront Setup

- Migrated from Shopify Liquid (Dawn theme) to **Shopify Hydrogen 2026.1** + **React Router v7** + **TypeScript**
- Created 27+ files: routes, components, GraphQL queries, utilities, styles
- Pages built: Homepage, Product Detail, Collection, Cart, Search

### 2. Vercel Deployment

- Configured deployment to **Vercel** (Shopify Oxygen requires Advanced plan)
- Set up `@vercel/react-router` preset, `vercel.json`, build scripts
- Live URL: **https://metalposterspk.vercel.app**

### 3. Storefront API Integration Fix

- Created `app/lib/hydrogen.server.ts` to initialize the Storefront API client using environment variables (bypassing Oxygen-only context injection)
- Updated all 6 route loaders to use `createContext(request)` pattern
- Added env var validation with clear error messages for missing config

### 4. Error Handling & Diagnostics

- Added try/catch error handling to all route loaders (root, collections, products)
- Error pages now show actual HTTP status codes and error messages instead of generic "OOPS"
- Created `/api/debug` diagnostic endpoint for verifying API connection and env vars

### 5. Responsive Design

- Made entire site fully responsive with mobile-first media queries
- Fixed social proof banner and size guide layout on small screens
- Simplified stats layout for clean responsive behavior

### 6. Cart & Checkout Fixes

- Implemented Shopify cart persistence across sessions
- Added "Buy Now" direct checkout flow
- Added discount code support
- Added product availability/stock checks

### 7. Full Design Overhaul (per client spec)

- New **copper/charcoal** color palette (`--copper: #B87333`, `--bg: #1E1E1E`)
- Switched fonts to **Montserrat** (headings) + **Inter** (body)
- Product cards: hover image flip effect, low stock badges
- PDP: urgency bar with countdown timer, trust badges, guarantees row
- Collection page: price filter chips
- Added **Blog** pages (`/blog`, `/blog/:handle`) for SEO content
- Footer and nav updated to match new design system

### 8. Preloader Animation

- Added full-screen preloader with **METALPOSTERS** wordmark
- Copper shimmer bar animation on dark background
- Smooth fade-out transition (600ms delay → 0.5s fade) on app hydration

### 9. Product CSV with Categories & Inventory

- Created `scripts/scrape-with-categories.mjs` — scrapes walltistic.com products + collections
- Maps 454 products to 17 category collections via `/collections/{handle}/products.json`
- Adds collection names as product tags for automated collection matching
- Sets `Variant Inventory Tracker = shopify`, `Variant Inventory Qty = 100` for all variants
- Output: `products-import.csv` (1.89 MB, 5846+ rows) and `collections-import.csv` (reference)

### 10. Automated Shopify Collections via Admin API

- Created `scripts/create-collections.mjs` — creates smart collections via Shopify Admin API
- 17 automated collections created with tag-matching rules (e.g., tag "Anime Posters" → Anime Posters collection)
- Skips already-existing collections, rate-limited for Basic plan

### 11. Product Tag Sync

- Created `scripts/update-product-tags.mjs` — updates existing Shopify products with collection tags
- Fetches walltistic.com collection→product mappings, merges tags on each Shopify product
- All 454 products updated with correct category tags for smart collection auto-population

### 12. Cart Fix — Direct Storefront API

- **Root cause:** Hydrogen's `createCartHandler` fails silently on Vercel (returns empty errors, null cart)
- **Solution:** Replaced with direct Storefront API GraphQL mutations in `app/lib/cart.server.ts`
- Implements `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, `cartDiscountCodesUpdate`
- Custom cookie-based cart ID persistence (14-day expiry, HttpOnly, SameSite=Lax)
- All mutations return full cart fragment (lines, costs, discounts, checkout URL)
- Cart drawer now receives data directly from action response (no race condition)
- Verified working via `/api/cart-debug` endpoint

---

## 31 March 2026

### 13. Content Pages & Footer Updates

- Updated Footer SUPPORT_LINKS with "How It's Made" link
- Updated homepage "HOW IT'S MADE" CTA to point to `/pages/how-its-made`

### 14. How It's Made Page

- Created `/pages/how-its-made` — explains the metal poster manufacturing process
- 6-step walkthrough: Design Prep → Dye-Sublimation → Aluminium Panel → QC → Magnetic Mount → Packaging
- "Why Metal?" grid with 6 benefit cards (water/UV/scratch resistant, lightweight, vivid, eco-friendly)
- Shop All CTA at bottom, follows copper/charcoal design system

### 15. Custom Poster Order Page

- Created `/pages/custom-poster` — dedicated ordering flow for custom metal posters
- Size configurator: A5 (Rs 849) → A1 (Rs 8,250) with live price and discount display
- Orientation selector: Portrait / Landscape with visual icons
- **WhatsApp ordering:** green CTA opens WhatsApp (0330-9995508) with pre-filled message containing size, orientation, and price
- "How It Works" 4-step guide, "What You Get" 6-card grid, image quality tips section
- Updated Nav, Footer, and homepage CUSTOM tile links from `/collections/custom-metal-poster` to `/pages/custom-poster`

### 16. Privacy Policy Fix

- Fixed 500 error on `/policies/privacy-policy` — intro `<div>` referenced undefined `body` variable
- Changed to `bodyStyle` to match the existing style constant

---

_This file is updated with each development session. Use it for client reporting._
