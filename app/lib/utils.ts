/**
 * Format a Shopify Money object to a display string.
 */
export function formatMoney(money: {amount: string; currencyCode: string}) {
  const amount = parseFloat(money.amount);
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: money.currencyCode,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}

/**
 * Calculate discount percentage between two prices.
 */
export function discountPercent(
  price: {amount: string},
  compareAt: {amount: string},
): number {
  const p = parseFloat(price.amount);
  const c = parseFloat(compareAt.amount);
  if (c <= p || c === 0) return 0;
  return Math.round(((c - p) / c) * 100);
}

/**
 * Size label → dimensions mapping.
 */
export const SIZE_DIMENSIONS: Record<string, string> = {
  Small: '20×25cm',
  Medium: '30×40cm',
  Large: '40×60cm',
  XL: '60×80cm',
  XXL: '80×120cm',
};

/**
 * Sort key mapping from URL param to Storefront API enum.
 */
export function getSortValuesFromParam(sort: string | null): {
  sortKey: string;
  reverse: boolean;
} {
  switch (sort) {
    case 'price-asc':
      return {sortKey: 'PRICE', reverse: false};
    case 'price-desc':
      return {sortKey: 'PRICE', reverse: true};
    case 'newest':
      return {sortKey: 'CREATED', reverse: true};
    case 'best-selling':
      return {sortKey: 'BEST_SELLING', reverse: false};
    default:
      return {sortKey: 'MANUAL', reverse: false};
  }
}

/**
 * Build Storefront API product filters from URL search params.
 */
export function buildFilters(
  searchParams: URLSearchParams,
): Array<Record<string, unknown>> {
  const filters: Array<Record<string, unknown>> = [];

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter.min = parseFloat(minPrice);
    if (maxPrice) priceFilter.max = parseFloat(maxPrice);
    filters.push({price: priceFilter});
  }

  const tags = [
    searchParams.get('size'),
    searchParams.get('finish'),
    searchParams.get('category'),
  ].filter(Boolean);

  for (const tag of tags) {
    if (tag) filters.push({tag});
  }

  return filters;
}
