# MetalPosters — Development Updates

> Last updated: 30 March 2026

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

---

*This file is updated with each development session. Use it for client reporting.*
