/**
 * Updates existing Shopify products with collection tags so they
 * auto-populate into the smart collections.
 *
 * - Fetches walltistic.com collection→product mappings
 * - Fetches all products from your Shopify store
 * - Merges collection names as tags on each product
 * - Updates via Admin API (preserves existing tags)
 *
 * Usage:
 *   SHOPIFY_ACCESS_TOKEN=shpat_xxx node scripts/update-product-tags.mjs
 */

const SHOP = 'metal-posters-3.myshopify.com';
const API_VERSION = '2025-01';
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!TOKEN) {
  console.error('❌ Missing SHOPIFY_ACCESS_TOKEN environment variable.');
  process.exit(1);
}

const BASE = `https://${SHOP}/admin/api/${API_VERSION}`;
const WALLTISTIC = 'https://www.walltistic.com';
const PER_PAGE = 250;

// ── Helpers ──

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function cleanCollectionTitle(title) {
  return title
    .replace(/\s*[-–|]\s*Walltistic.*$/i, '')
    .replace(/\s+in Pakistan/i, '')
    .trim();
}

// ── Fetch walltistic collection→product mapping ──

async function buildWalltisticTagMap() {
  console.log('🌐 Fetching walltistic.com collections...');
  const { collections } = await fetchJSON(`${WALLTISTIC}/collections.json`);
  console.log(`  Found ${collections.length} collections`);

  const skipMapping = new Set(['metal-posters', 'wall-art', 'new-arrival', 'best-sellers']);
  const handleToTags = new Map(); // product handle → Set of collection tags

  for (const col of collections) {
    if (skipMapping.has(col.handle)) continue;
    if (col.products_count === 0) continue;

    const cleanTitle = cleanCollectionTitle(col.title);
    console.log(`  📂 ${col.handle} (${col.products_count} products)...`);

    let page = 1;
    while (true) {
      const url = `${WALLTISTIC}/collections/${col.handle}/products.json?limit=${PER_PAGE}&page=${page}`;
      const { products } = await fetchJSON(url);
      if (!products || products.length === 0) break;

      for (const p of products) {
        if (!handleToTags.has(p.handle)) {
          handleToTags.set(p.handle, new Set());
        }
        handleToTags.get(p.handle).add(cleanTitle);
      }

      if (products.length < PER_PAGE) break;
      page++;
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`  Mapped ${handleToTags.size} product handles to tags\n`);
  return handleToTags;
}

// ── Fetch all Shopify products ──

async function fetchShopifyProducts() {
  console.log('🏪 Fetching products from Shopify store...');
  const all = [];
  let pageInfo = null;

  while (true) {
    let url = `${BASE}/products.json?limit=${PER_PAGE}&fields=id,handle,tags`;
    if (pageInfo) {
      url = `${BASE}/products.json?limit=${PER_PAGE}&page_info=${pageInfo}&fields=id,handle,tags`;
    }

    const res = await fetch(url, {
      headers: { 'X-Shopify-Access-Token': TOKEN },
    });

    if (!res.ok) {
      throw new Error(`Shopify API ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const products = data.products || [];
    all.push(...products);
    console.log(`  Fetched ${all.length} products...`);

    // Check for next page via Link header
    const linkHeader = res.headers.get('link');
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/page_info=([^>&]+).*?rel="next"/);
      if (match) {
        pageInfo = match[1];
      } else {
        break;
      }
    } else {
      break;
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`  Total: ${all.length} products\n`);
  return all;
}

// ── Update product tags ──

async function updateProductTags(productId, newTags) {
  const res = await fetch(`${BASE}/products/${productId}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product: {
        id: productId,
        tags: newTags,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.json();
    const errMsg = body.errors
      ? (typeof body.errors === 'string' ? body.errors : JSON.stringify(body.errors))
      : res.statusText;
    throw new Error(`${res.status}: ${errMsg}`);
  }

  return res.json();
}

// ── Main ──

async function main() {
  // 1. Build tag map from walltistic
  const walltisticTags = await buildWalltisticTagMap();

  // 2. Fetch existing Shopify products
  const shopifyProducts = await fetchShopifyProducts();

  // 3. Update each product's tags
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  let noMatch = 0;

  for (const product of shopifyProducts) {
    const newTags = walltisticTags.get(product.handle);

    if (!newTags || newTags.size === 0) {
      noMatch++;
      continue;
    }

    // Parse existing tags
    const existingTags = product.tags
      ? product.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    const existingSet = new Set(existingTags);

    // Check if all collection tags already present
    const tagsToAdd = [...newTags].filter(t => !existingSet.has(t));
    if (tagsToAdd.length === 0) {
      skipped++;
      continue;
    }

    // Merge tags
    const mergedTags = [...new Set([...existingTags, ...newTags])].join(', ');

    try {
      await updateProductTags(product.id, mergedTags);
      console.log(`✅ ${product.handle} — added: ${tagsToAdd.join(', ')}`);
      updated++;
    } catch (e) {
      console.log(`❌ ${product.handle} — ${e.message}`);
      failed++;
    }

    // Rate limit: ~2 req/sec on Basic plan
    await new Promise(r => setTimeout(r, 550));
  }

  console.log(`\n📊 Done:`);
  console.log(`   ${updated} updated`);
  console.log(`   ${skipped} already had correct tags`);
  console.log(`   ${noMatch} no collection match (untagged)`);
  console.log(`   ${failed} failed`);
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
