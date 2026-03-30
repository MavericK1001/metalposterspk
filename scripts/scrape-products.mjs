/**
 * Scrapes product data from walltistic.com's public /products.json endpoint
 * and generates a Shopify-compatible CSV import file.
 *
 * Usage: node scripts/scrape-products.mjs
 * Output: products-import.csv (in project root)
 */

const BASE_URL = 'https://www.walltistic.com/products.json';
const PER_PAGE = 250;

async function fetchAllProducts() {
  const allProducts = [];
  let page = 1;

  while (true) {
    const url = `${BASE_URL}?limit=${PER_PAGE}&page=${page}`;
    console.log(`Fetching page ${page}...`);

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} on page ${page}`);
    }

    const data = await res.json();
    const products = data.products;

    if (!products || products.length === 0) break;

    allProducts.push(...products);
    console.log(`  Got ${products.length} products (total: ${allProducts.length})`);

    if (products.length < PER_PAGE) break;
    page++;
  }

  return allProducts;
}

function escapeCSV(value) {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
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

function buildCSV(products) {
  const headers = [
    'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type', 'Tags',
    'Published', 'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
    'Option3 Name', 'Option3 Value', 'Variant SKU', 'Variant Grams',
    'Variant Inventory Tracker', 'Variant Inventory Qty', 'Variant Inventory Policy',
    'Variant Fulfillment Service', 'Variant Price', 'Variant Compare At Price',
    'Variant Requires Shipping', 'Variant Taxable', 'Variant Barcode',
    'Image Src', 'Image Position', 'Image Alt Text', 'Gift Card',
    'SEO Title', 'SEO Description', 'Variant Image', 'Variant Weight Unit', 'Status',
  ];

  const rows = [headers.map(escapeCSV).join(',')];

  for (const product of products) {
    const handle = product.handle || '';
    const title = product.title || '';
    const bodyHTML = product.body_html || '';
    const vendor = 'MetalPosters'; // Rebrand to own store
    const productType = product.product_type || '';
    const tags = (product.tags || []).join(', ');
    const published = 'true';

    const options = product.options || [];
    const opt1Name = options[0]?.name || '';
    const opt2Name = options[1]?.name || '';
    const opt3Name = options[2]?.name || '';

    const variants = product.variants || [];
    const images = product.images || [];

    // Determine max rows needed (variants vs images)
    const maxRows = Math.max(variants.length, images.length, 1);

    for (let i = 0; i < maxRows; i++) {
      const variant = variants[i];
      const image = images[i];
      const isFirstRow = i === 0;

      const row = [
        isFirstRow ? handle : handle,                      // Handle (always needed)
        isFirstRow ? title : '',                           // Title
        isFirstRow ? bodyHTML : '',                         // Body (HTML)
        isFirstRow ? vendor : '',                          // Vendor
        '',                                                 // Product Category
        isFirstRow ? productType : '',                     // Type
        isFirstRow ? tags : '',                            // Tags
        isFirstRow ? published : '',                       // Published
        isFirstRow ? opt1Name : (variant ? opt1Name : ''), // Option1 Name
        variant?.option1 || '',                            // Option1 Value
        isFirstRow ? opt2Name : (variant ? opt2Name : ''), // Option2 Name
        variant?.option2 || '',                            // Option2 Value
        isFirstRow ? opt3Name : (variant ? opt3Name : ''), // Option3 Name
        variant?.option3 || '',                            // Option3 Value
        variant?.sku || '',                                // Variant SKU
        variant ? String(variant.grams || 0) : '',         // Variant Grams
        '',                                                 // Variant Inventory Tracker
        '',                                                 // Variant Inventory Qty
        variant ? 'deny' : '',                             // Variant Inventory Policy
        variant ? 'manual' : '',                           // Variant Fulfillment Service
        variant?.price || '',                              // Variant Price
        variant?.compare_at_price || '',                   // Variant Compare At Price
        variant ? (variant.requires_shipping ? 'true' : 'false') : '', // Variant Requires Shipping
        variant ? (variant.taxable ? 'true' : 'false') : '', // Variant Taxable
        variant?.barcode || '',                            // Variant Barcode
        image?.src || '',                                  // Image Src
        image ? String(image.position) : '',               // Image Position
        image ? (title || '') : '',                        // Image Alt Text
        isFirstRow ? 'false' : '',                         // Gift Card
        isFirstRow ? title : '',                           // SEO Title
        isFirstRow ? stripHTML(bodyHTML).slice(0, 320) : '', // SEO Description
        '',                                                 // Variant Image
        variant ? 'kg' : '',                               // Variant Weight Unit
        isFirstRow ? 'active' : '',                        // Status
      ];

      rows.push(row.map(escapeCSV).join(','));
    }
  }

  return rows.join('\n');
}

async function main() {
  console.log('🔎 Fetching products from walltistic.com...\n');
  const products = await fetchAllProducts();
  console.log(`\n✅ Fetched ${products.length} products total`);

  console.log('📝 Generating Shopify CSV...');
  const csv = buildCSV(products);

  const fs = await import('fs');
  const path = await import('path');
  const outPath = path.join(process.cwd(), 'products-import.csv');
  fs.writeFileSync(outPath, csv, 'utf-8');

  console.log(`✅ Saved to ${outPath}`);
  console.log(`\n📊 Stats:`);
  console.log(`   Products: ${products.length}`);
  console.log(`   CSV rows: ${csv.split('\n').length}`);
  console.log(`   File size: ${(Buffer.byteLength(csv) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`\n💡 Import this CSV at: Shopify Admin → Products → Import`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
