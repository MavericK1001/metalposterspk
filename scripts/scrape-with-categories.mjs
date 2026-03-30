/**
 * Scrapes product + collection data from walltistic.com and generates
 * a Shopify-compatible CSV with categories (as tags) and inventory.
 *
 * Usage: node scripts/scrape-with-categories.mjs
 * Output: products-import.csv  (products with categories + inventory)
 *         collections-reference.csv (collection list for manual creation)
 */

const PRODUCTS_URL = 'https://www.walltistic.com/products.json';
const COLLECTIONS_URL = 'https://www.walltistic.com/collections.json';
const PER_PAGE = 250;
const DEFAULT_INVENTORY_QTY = 100;

// ── Fetch helpers ──

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchAllProducts() {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${PRODUCTS_URL}?limit=${PER_PAGE}&page=${page}`;
    console.log(`  Products page ${page}...`);
    const { products } = await fetchJSON(url);
    if (!products || products.length === 0) break;
    all.push(...products);
    console.log(`    ${products.length} products (total: ${all.length})`);
    if (products.length < PER_PAGE) break;
    page++;
  }
  return all;
}

async function fetchAllCollections() {
  const { collections } = await fetchJSON(COLLECTIONS_URL);
  return collections || [];
}

async function fetchCollectionProducts(handle) {
  const all = [];
  let page = 1;
  while (true) {
    const url = `https://www.walltistic.com/collections/${handle}/products.json?limit=${PER_PAGE}&page=${page}`;
    const { products } = await fetchJSON(url);
    if (!products || products.length === 0) break;
    all.push(...products);
    if (products.length < PER_PAGE) break;
    page++;
  }
  return all;
}

// ── CSV helpers ──

function esc(value) {
  if (value == null) return '';
  const s = String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function stripHTML(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function cleanCollectionTitle(title) {
  return title
    .replace(/\s*[-–|]\s*Walltistic.*$/i, '')
    .replace(/\s+in Pakistan/i, '')
    .trim();
}

// ── Build CSVs ──

function buildProductCSV(products, productCollections) {
  const headers = [
    'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type', 'Tags',
    'Published', 'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
    'Option3 Name', 'Option3 Value', 'Variant SKU', 'Variant Grams',
    'Variant Inventory Tracker', 'Variant Inventory Qty', 'Variant Inventory Policy',
    'Variant Fulfillment Service', 'Variant Price', 'Variant Compare At Price',
    'Variant Requires Shipping', 'Variant Taxable', 'Variant Barcode',
    'Image Src', 'Image Position', 'Image Alt Text', 'Gift Card',
    'SEO Title', 'SEO Description', 'Variant Image', 'Variant Weight Unit',
    'Collection',  'Status',
  ];

  const rows = [headers.map(esc).join(',')];

  for (const product of products) {
    const handle = product.handle || '';
    const title = product.title || '';
    const bodyHTML = product.body_html || '';
    const vendor = 'MetalPosters';
    const productType = product.product_type || 'Metal Poster';
    const published = 'true';

    // Build tags: original tags + collection names
    const origTags = product.tags || [];
    const collNames = (productCollections.get(product.id) || []).map(cleanCollectionTitle);
    const allTags = [...new Set([...origTags, ...collNames])];
    const tagsStr = allTags.join(', ');

    // Primary collection for Collection column
    const primaryCollection = collNames.length > 0 ? collNames[0] : '';

    const options = product.options || [];
    const opt1Name = options[0]?.name || '';
    const opt2Name = options[1]?.name || '';
    const opt3Name = options[2]?.name || '';

    const variants = product.variants || [];
    const images = product.images || [];
    const maxRows = Math.max(variants.length, images.length, 1);

    for (let i = 0; i < maxRows; i++) {
      const variant = variants[i];
      const image = images[i];
      const isFirst = i === 0;

      const row = [
        handle,                                                // Handle
        isFirst ? title : '',                                  // Title
        isFirst ? bodyHTML : '',                                // Body (HTML)
        isFirst ? vendor : '',                                 // Vendor
        '',                                                    // Product Category
        isFirst ? productType : '',                            // Type
        isFirst ? tagsStr : '',                                // Tags
        isFirst ? published : '',                              // Published
        isFirst ? opt1Name : (variant ? opt1Name : ''),        // Option1 Name
        variant?.option1 || '',                                // Option1 Value
        isFirst ? opt2Name : (variant ? opt2Name : ''),        // Option2 Name
        variant?.option2 || '',                                // Option2 Value
        isFirst ? opt3Name : (variant ? opt3Name : ''),        // Option3 Name
        variant?.option3 || '',                                // Option3 Value
        variant?.sku || '',                                    // Variant SKU
        variant ? String(variant.grams || 500) : '',           // Variant Grams (default 500g)
        variant ? 'shopify' : '',                              // Variant Inventory Tracker
        variant ? String(DEFAULT_INVENTORY_QTY) : '',          // Variant Inventory Qty
        variant ? 'deny' : '',                                 // Variant Inventory Policy
        variant ? 'manual' : '',                               // Variant Fulfillment Service
        variant?.price || '',                                  // Variant Price
        variant?.compare_at_price || '',                       // Variant Compare At Price
        variant ? 'true' : '',                                 // Variant Requires Shipping
        variant ? 'true' : '',                                 // Variant Taxable
        variant?.barcode || '',                                // Variant Barcode
        image?.src || '',                                      // Image Src
        image ? String(image.position) : '',                   // Image Position
        image ? (title || '') : '',                            // Image Alt Text
        isFirst ? 'false' : '',                                // Gift Card
        isFirst ? title : '',                                  // SEO Title
        isFirst ? stripHTML(bodyHTML).slice(0, 320) : '',      // SEO Description
        '',                                                    // Variant Image
        variant ? 'kg' : '',                                   // Variant Weight Unit
        isFirst ? primaryCollection : '',                      // Collection
        isFirst ? 'active' : '',                               // Status
      ];

      rows.push(row.map(esc).join(','));
    }
  }

  return rows.join('\n');
}

function buildCollectionsCSV(collections) {
  const headers = [
    'Handle', 'Title', 'Body (HTML)', 'Sort Order', 'Must Match',
    'Rule: Column', 'Rule: Relation', 'Rule: Condition', 'Published', 'Image Src',
  ];

  const rows = [headers.map(esc).join(',')];

  // Skip meta collections (best-sellers, new-arrival are smart collections)
  const skipHandles = new Set(['best-sellers', 'new-arrival']);

  for (const col of collections) {
    if (skipHandles.has(col.handle)) continue;
    if (col.products_count === 0) continue;

    const cleanTitle = cleanCollectionTitle(col.title);
    const imgSrc = col.image?.src || '';

    // Automated collection: match products by tag
    const row = [
      col.handle,                         // Handle
      cleanTitle,                         // Title
      col.description || '',              // Body (HTML)
      'best-selling',                     // Sort Order
      'any',                              // Must Match
      'tag',                              // Rule: Column
      'equals',                           // Rule: Relation
      cleanTitle,                         // Rule: Condition (match the tag we added)
      'true',                             // Published
      imgSrc,                             // Image Src
    ];

    rows.push(row.map(esc).join(','));
  }

  return rows.join('\n');
}

// ── Main ──

async function main() {
  console.log('🔎 Fetching collections...');
  const collections = await fetchAllCollections();
  console.log(`  Found ${collections.length} collections\n`);

  // Build product → collection mapping
  console.log('🗂️  Mapping products to collections...');
  const productCollections = new Map(); // productId → [collection titles]

  // Skip very large/generic collections for mapping
  const skipMapping = new Set(['metal-posters', 'wall-art', 'new-arrival', 'best-sellers']);

  for (const col of collections) {
    if (skipMapping.has(col.handle)) continue;
    if (col.products_count === 0) continue;

    console.log(`  ${col.handle} (${col.products_count} products)...`);
    try {
      const products = await fetchCollectionProducts(col.handle);
      const cleanTitle = cleanCollectionTitle(col.title);
      for (const p of products) {
        if (!productCollections.has(p.id)) {
          productCollections.set(p.id, []);
        }
        productCollections.get(p.id).push(col.title);
      }
    } catch (e) {
      console.log(`    ⚠ Failed: ${e.message}`);
    }
    // Small delay to be polite
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n📦 Fetching all products...`);
  const products = await fetchAllProducts();
  console.log(`  Total: ${products.length} products\n`);

  // Products without a specific collection get "Metal Posters" tag
  for (const p of products) {
    if (!productCollections.has(p.id)) {
      productCollections.set(p.id, ['Metal Posters']);
    }
  }

  // Stats
  const mapped = [...productCollections.values()].filter(v => v.length > 0).length;
  console.log(`📊 ${mapped} products mapped to collections\n`);

  console.log('📝 Generating products CSV...');
  const productCSV = buildProductCSV(products, productCollections);

  console.log('📝 Generating collections CSV...');
  const collectionsCSV = buildCollectionsCSV(collections);

  const fs = await import('fs');
  const path = await import('path');

  const prodPath = path.join(process.cwd(), 'products-import.csv');
  fs.writeFileSync(prodPath, productCSV, 'utf-8');

  const collPath = path.join(process.cwd(), 'collections-import.csv');
  fs.writeFileSync(collPath, collectionsCSV, 'utf-8');

  console.log(`\n✅ Products CSV:    ${prodPath}`);
  console.log(`   ${products.length} products | ${productCSV.split('\n').length} rows | ${(Buffer.byteLength(productCSV) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\n✅ Collections CSV: ${collPath}`);
  console.log(`   ${collectionsCSV.split('\n').length - 1} collections`);

  console.log(`\n📋 Import order:`);
  console.log(`   1. Shopify Admin → Products → Import → products-import.csv`);
  console.log(`   2. Shopify Admin → Collections → Import (or create manually)`);
  console.log(`      - Use automated collections matching by Tag`);
  console.log(`      - The collections-import.csv has the rules ready`);
  console.log(`\n💡 Each product has collection names added as tags.`);
  console.log(`   Create automated collections matching tag = collection name.`);
  console.log(`   Inventory set to ${DEFAULT_INVENTORY_QTY} units per variant, tracked by Shopify.`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
