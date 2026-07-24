/**
 * Direct cart operations using Storefront API GraphQL.
 * Bypasses Hydrogen's createCartHandler which doesn't work on Vercel.
 */

import { createStorefrontClient } from '@shopify/hydrogen';

// ── GraphQL Fragments & Queries ──

const CART_FRAGMENT = `#graphql
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    discountCodes { applicable code }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText }
            price { amount currencyCode }
            selectedOptions { name value }
            product { title handle featuredImage { url altText } }
          }
        }
      }
    }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
  }
`;

const CART_CREATE = `#graphql
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { ...CartFragment }
      userErrors { field message }
      warnings { code message target }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_ADD = `#graphql
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
      userErrors { field message }
      warnings { code message target }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_BUYER_IDENTITY_UPDATE = `#graphql
  mutation CartBuyerIdentityUpdate(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
  ) {
    cartBuyerIdentityUpdate(
      cartId: $cartId
      buyerIdentity: $buyerIdentity
    ) {
      cart { id }
      userErrors { field message }
      warnings { code message target }
    }
  }
`;

const CART_LINES_UPDATE = `#graphql
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
      userErrors { field message }
      warnings { code message target }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_REMOVE = `#graphql
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFragment }
      userErrors { field message }
      warnings { code message target }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_DISCOUNT_UPDATE = `#graphql
  mutation CartDiscountUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart { ...CartFragment }
      userErrors { field message }
      warnings { code message target }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_QUERY = `#graphql
  query CartQuery($cartId: ID!) {
    cart(id: $cartId) { ...CartFragment }
  }
  ${CART_FRAGMENT}
`;

// ── Cookie helpers ──

const CART_COOKIE = 'cart';

export function getCartId(request: Request): string | null {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(new RegExp(`(?:^|;)\\s*${CART_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCartIdHeader(cartId: string): Headers {
  const headers = new Headers();
  headers.set(
    'Set-Cookie',
    `${CART_COOKIE}=${encodeURIComponent(cartId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 14}`,
  );
  return headers;
}

// ── Storefront client ──

function getStorefront(request: Request) {
  const storeDomain = process.env.PUBLIC_STORE_DOMAIN || '';
  const storefrontToken = process.env.PUBLIC_STOREFRONT_API_TOKEN || '';
  const apiVersion = process.env.PUBLIC_STOREFRONT_API_VERSION || '2025-01';

  const fullDomain = storeDomain.startsWith('http')
    ? storeDomain
    : `https://${storeDomain}`;

  const { storefront } = createStorefrontClient({
    publicStorefrontToken: storefrontToken,
    storeDomain: fullDomain,
    storefrontApiVersion: apiVersion,
    storefrontHeaders: {
      requestGroupId: request.headers.get('request-id'),
      buyerIp: request.headers.get('x-forwarded-for'),
      buyerIpSig: null,
      cookie: request.headers.get('cookie'),
      purpose: request.headers.get('purpose'),
    },
  });

  return storefront;
}

// ── Public API ──

export async function getCart(request: Request) {
  const cartId = getCartId(request);
  if (!cartId) return null;

  const storefront = getStorefront(request);
  try {
    const { cart } = await storefront.query(CART_QUERY, {
      variables: { cartId },
      cache: storefront.CacheNone(),
    });
    return cart;
  } catch {
    return null;
  }
}

export async function addToCart(
  request: Request,
  lines: { merchandiseId: string; quantity: number }[],
) {
  const storefront = getStorefront(request);
  const cartId = getCartId(request);
  const buyerIdentity = { countryCode: 'PK' };

  if (cartId) {
    // Add to the existing cart. A cart ID belongs to a specific Shopify store,
    // so cookies left behind after switching stores must be replaced.
    try {
      await storefront.mutate(CART_BUYER_IDENTITY_UPDATE, {
        variables: { cartId, buyerIdentity },
      });

      const { cartLinesAdd } = await storefront.mutate(CART_LINES_ADD, {
        variables: { cartId, lines },
      });
      const userErrors = cartLinesAdd?.userErrors ?? [];
      const savedCartIsInvalid = userErrors.some(
        (error: { field?: string[] | null; message?: string }) =>
          error.field?.includes("cartId") ||
          /cart.*(?:does not exist|not found|invalid)/i.test(
            error.message ?? "",
          ),
      );

      if (!savedCartIsInvalid) {
        return {
          cart: cartLinesAdd?.cart ?? null,
          userErrors,
          warnings: cartLinesAdd?.warnings ?? [],
        };
      }
    } catch {
      console.warn(
        "Saved cart is no longer valid; creating a replacement cart.",
      );
    }
  }

  // Create a new cart when there is no cookie or when the saved cart belongs
  // to the previous store, has expired, or can no longer be retrieved.
  const { cartCreate } = await storefront.mutate(CART_CREATE, {
    variables: { input: { lines, buyerIdentity } },
  });
  return {
    cart: cartCreate?.cart ?? null,
    userErrors: cartCreate?.userErrors ?? [],
    warnings: cartCreate?.warnings ?? [],
  };
}

export async function updateCartLines(
  request: Request,
  lines: { id: string; quantity: number }[],
) {
  const cartId = getCartId(request);
  if (!cartId) return { cart: null, userErrors: [{ message: 'No cart found' }] };

  const storefront = getStorefront(request);
  const { cartLinesUpdate } = await storefront.mutate(CART_LINES_UPDATE, {
    variables: { cartId, lines },
  });
  return {
    cart: cartLinesUpdate?.cart ?? null,
    userErrors: cartLinesUpdate?.userErrors ?? [],
    warnings: cartLinesUpdate?.warnings ?? [],
  };
}

export async function removeCartLines(request: Request, lineIds: string[]) {
  const cartId = getCartId(request);
  if (!cartId) return { cart: null, userErrors: [{ message: 'No cart found' }] };

  const storefront = getStorefront(request);
  const { cartLinesRemove } = await storefront.mutate(CART_LINES_REMOVE, {
    variables: { cartId, lineIds },
  });
  return {
    cart: cartLinesRemove?.cart ?? null,
    userErrors: cartLinesRemove?.userErrors ?? [],
    warnings: cartLinesRemove?.warnings ?? [],
  };
}

export async function updateDiscountCodes(
  request: Request,
  discountCodes: string[],
) {
  const cartId = getCartId(request);
  if (!cartId) return { cart: null, userErrors: [{ message: 'No cart found' }] };

  const storefront = getStorefront(request);
  const { cartDiscountCodesUpdate } = await storefront.mutate(CART_DISCOUNT_UPDATE, {
    variables: { cartId, discountCodes },
  });
  return {
    cart: cartDiscountCodesUpdate?.cart ?? null,
    userErrors: cartDiscountCodesUpdate?.userErrors ?? [],
    warnings: cartDiscountCodesUpdate?.warnings ?? [],
  };
}
