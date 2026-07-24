import type { LoaderFunctionArgs } from "react-router";
import { createContext } from "~/lib/hydrogen.server";
import { addToCart } from "~/lib/cart.server";

/**
 * Debug endpoint to test direct cart API.
 * GET /api/cart-debug — tests creating a cart and adding a line.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { storefront } = createContext(request);
  const results: Record<string, any> = {};

  // 1. Get a known poster variant used by the live storefront
  try {
    const { product } = await storefront.query(
      `#graphql
      query DiagnosticVariant {
        product(handle: "mindset-metal-poster") {
          title
          handle
          variants(first: 1) {
            nodes {
              id
              title
              availableForSale
              quantityAvailable
              requiresComponents
              price { amount currencyCode }
            }
          }
        }
      }`,
    );
    const variant = product?.variants?.nodes?.[0];
    results.product = {
      title: product?.title,
      handle: product?.handle,
      variantId: variant?.id,
      variantTitle: variant?.title,
      availableForSale: variant?.availableForSale,
      quantityAvailable: variant?.quantityAvailable,
      requiresComponents: variant?.requiresComponents,
      price: variant?.price,
    };
  } catch (e: any) {
    results.product = { error: e.message };
  }

  // 2. Test direct addToCart (bypasses Hydrogen cart handler)
  if (results.product?.variantId) {
    try {
      const addResult = await addToCart(request, [
        { merchandiseId: results.product.variantId, quantity: 1 },
      ]);
      results.directCartAdd = {
        cart: addResult.cart
          ? {
              id: addResult.cart.id,
              totalQuantity: addResult.cart.totalQuantity,
              checkoutUrl: addResult.cart.checkoutUrl,
              lineCount: addResult.cart.lines?.nodes?.length ?? 0,
              lines: addResult.cart.lines?.nodes?.map((line: any) => ({
                quantity: line.quantity,
                merchandiseId: line.merchandise?.id,
                productTitle: line.merchandise?.product?.title,
                variantTitle: line.merchandise?.title,
                totalAmount: line.cost?.totalAmount,
              })),
              subtotalAmount: addResult.cart.cost?.subtotalAmount,
            }
          : null,
        userErrors: addResult.userErrors,
        warnings: addResult.warnings,
      };
    } catch (e: any) {
      results.directCartAdd = { error: e.message };
    }
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}
