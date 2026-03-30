import type { LoaderFunctionArgs } from "react-router";
import { createContext } from "~/lib/hydrogen.server";

/**
 * Debug endpoint to test cart operations.
 * GET /api/cart-debug — tests creating a cart and adding a line.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { storefront, cart } = createContext(request);
  const results: Record<string, any> = {};

  // 1. Get first available variant
  try {
    const { products } = await storefront.query(
      `#graphql
      query FirstVariant {
        products(first: 1) {
          nodes {
            title
            handle
            variants(first: 1) {
              nodes {
                id
                title
                availableForSale
                price { amount currencyCode }
              }
            }
          }
        }
      }`,
    );
    const product = products?.nodes?.[0];
    const variant = product?.variants?.nodes?.[0];
    results.product = {
      title: product?.title,
      handle: product?.handle,
      variantId: variant?.id,
      variantTitle: variant?.title,
      availableForSale: variant?.availableForSale,
      price: variant?.price,
    };
  } catch (e: any) {
    results.product = { error: e.message };
  }

  // 2. Test cart.get()
  try {
    const existingCart = await cart.get();
    results.existingCart = existingCart
      ? { id: existingCart.id, totalQuantity: existingCart.totalQuantity }
      : null;
  } catch (e: any) {
    results.existingCart = { error: e.message };
  }

  // 3. Test cart.addLines() with the first variant
  if (results.product?.variantId) {
    try {
      const addResult = await cart.addLines([
        { merchandiseId: results.product.variantId, quantity: 1 },
      ]);
      results.addResult = {
        cart: addResult?.cart
          ? {
              id: addResult.cart.id,
              totalQuantity: addResult.cart.totalQuantity,
              checkoutUrl: addResult.cart.checkoutUrl,
            }
          : null,
        errors: addResult?.errors || [],
        userErrors: addResult?.userErrors || [],
        rawKeys: Object.keys(addResult || {}),
      };
    } catch (e: any) {
      results.addResult = {
        error: e.message,
        stack: e.stack?.split("\n").slice(0, 5),
      };
    }
  }

  // 4. After adding, re-fetch cart
  if (results.addResult?.cart?.id) {
    try {
      const updatedCart = await cart.get();
      results.updatedCart = updatedCart
        ? {
            id: updatedCart.id,
            totalQuantity: updatedCart.totalQuantity,
            lineCount: updatedCart.lines?.nodes?.length ?? 0,
            lines: updatedCart.lines?.nodes?.map((l: any) => ({
              id: l.id,
              quantity: l.quantity,
              merchandise: l.merchandise?.product?.title,
            })),
          }
        : null;
    } catch (e: any) {
      results.updatedCart = { error: e.message };
    }
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}
