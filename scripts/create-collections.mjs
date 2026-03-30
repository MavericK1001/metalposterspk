/**
 * Creates automated (smart) collections on Shopify via Admin API.
 * Each collection matches products by tag (tags were added during CSV import).
 *
 * Usage:
 *   SHOPIFY_ACCESS_TOKEN=your_token node scripts/create-collections.mjs
 *
 * Requirements:
 *   - Shopify Admin API access token (NOT Storefront token)
 *   - Token must have write_products scope
 *
 * Get token: Shopify Admin → Settings → Apps → Develop apps → Create app →
 *   Configure Admin API scopes → write_products → Install app → Reveal token
 */

const SHOP = 'metal-posters-3.myshopify.com';
const API_VERSION = '2025-01';
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!TOKEN) {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN environment variable.');
  console.error('   Run: SHOPIFY_ACCESS_TOKEN=shpat_xxx node scripts/create-collections.mjs');
  process.exit(1);
}

const BASE = `https://${SHOP}/admin/api/${API_VERSION}`;

// ── Collections to create ──
// Each entry: { handle, title, tag (to match), image (optional), body (optional) }
const COLLECTIONS = [
  {
    title: 'Anime Posters',
    handle: 'anime-posters',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/anime.png?v=1772901444',
  },
  {
    title: 'Car Posters',
    handle: 'car-posters',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Cars.png?v=1772901444',
  },
  {
    title: 'Islamic Posters',
    handle: 'islamic-posters',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Islamic.png?v=1772901444',
  },
  {
    title: 'Sports Poster',
    handle: 'sports-poster',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Sports.png?v=1772901444',
  },
  {
    title: 'Gaming Poster',
    handle: 'gaming-poster',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Gaming.png?v=1772901444',
  },
  {
    title: 'Superheroes Poster',
    handle: 'superheroes-poster',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Superheroes.png?v=1772901444',
  },
  {
    title: 'Movie Posters',
    handle: 'movie-posters',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Movies.png?v=1772901444',
  },
  {
    title: 'Motivational Metal Poster',
    handle: 'motivational-metal-poster',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Motivational.png?v=1772901444',
  },
  {
    title: 'Abstract Art',
    handle: 'abstract-art',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Abstract.png?v=1772901444',
  },
  {
    title: 'Famous Personalities',
    handle: 'famous-personalities',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/famous_personalities.png?v=1772901444',
  },
  {
    title: 'Animal Metal Poster',
    handle: 'animal-metal-poster',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Animals.png?v=1772901444',
  },
  {
    title: 'Kids Metal Poster',
    handle: 'kids-metal-poster',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Kids.png?v=1772901444',
  },
  {
    title: 'Bikes Posters',
    handle: 'bikes-posters',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Bikes.png?v=1772901444',
  },
  {
    title: 'Custom Metal Poster',
    handle: 'custom-metal-poster',
    image: 'https://cdn.shopify.com/s/files/1/0605/0840/5835/collections/Custom.png?v=1772901444',
  },
  {
    title: 'Armed Aesthetics',
    handle: 'armed-aesthetics',
    image: '',
  },
  {
    title: 'Multi Panel & Panorams',
    handle: 'multi-panel-panorams',
    image: '',
  },
  {
    title: 'Tapestry',
    handle: 'tapestry',
    image: '',
  },
];

// ── API helper ──

async function shopifyAdmin(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'X-Shopify-Access-Token': TOKEN,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${endpoint}`, opts);
  const json = await res.json();

  if (!res.ok) {
    const errMsg = json.errors
      ? (typeof json.errors === 'string' ? json.errors : JSON.stringify(json.errors))
      : res.statusText;
    throw new Error(`${res.status}: ${errMsg}`);
  }
  return json;
}

// ── Check for existing collections ──

async function getExistingCollections() {
  const existing = new Map();
  let sinceId = 0;
  while (true) {
    const data = await shopifyAdmin(
      `/smart_collections.json?limit=250&since_id=${sinceId}`
    );
    const cols = data.smart_collections || [];
    if (cols.length === 0) break;
    for (const c of cols) {
      existing.set(c.handle, c);
      sinceId = Math.max(sinceId, c.id);
    }
    if (cols.length < 250) break;
  }
  return existing;
}

// ── Create smart collection ──

async function createSmartCollection(col) {
  const payload = {
    smart_collection: {
      title: col.title,
      handle: col.handle,
      published: true,
      sort_order: 'best-selling',
      disjunctive: false, // must match ALL rules (we only have one)
      rules: [
        {
          column: 'tag',
          relation: 'equals',
          condition: col.title, // tag matches title exactly
        },
      ],
    },
  };

  return shopifyAdmin('/smart_collections.json', 'POST', payload);
}

// ── Main ──

async function main() {
  console.log(`🏪 Store: ${SHOP}`);
  console.log(`📡 API: ${API_VERSION}\n`);

  // Check existing collections to avoid duplicates
  console.log('🔍 Checking existing smart collections...');
  const existing = await getExistingCollections();
  console.log(`  Found ${existing.size} existing smart collections\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const col of COLLECTIONS) {
    if (existing.has(col.handle)) {
      console.log(`⏭  ${col.title} — already exists (handle: ${col.handle})`);
      skipped++;
      continue;
    }

    try {
      const result = await createSmartCollection(col);
      console.log(`✅ ${col.title} — created (ID: ${result.smart_collection.id})`);
      created++;
    } catch (e) {
      console.log(`❌ ${col.title} — failed: ${e.message}`);
      failed++;
    }

    // Rate limit: 2 requests/sec on Basic plan
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n📊 Done: ${created} created, ${skipped} skipped, ${failed} failed`);
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
