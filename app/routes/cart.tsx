import {
  data,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { useLoaderData, useFetcher, Link } from "react-router";
import { Image } from "@shopify/hydrogen";
import { CART_QUERY } from "~/graphql/CartMutations";
import { formatMoney } from "~/lib/utils";
import { createContext } from "~/lib/hydrogen.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { cart } = createContext(request);
  const cartData = await cart.get();
  return { cart: cartData };
}

export async function action({ request }: ActionFunctionArgs) {
  const { cart } = createContext(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "add-to-cart") {
    const merchandiseId = formData.get("merchandiseId") as string;
    const quantity = Number(formData.get("quantity") || 1);
    const result = await cart.addLines([{ merchandiseId, quantity }]);
    return data(result);
  }

  if (intent === "update-quantity") {
    const lineId = formData.get("lineId") as string;
    const quantity = Number(formData.get("quantity"));
    if (quantity <= 0) {
      const result = await cart.removeLines([lineId]);
      return data(result);
    }
    const result = await cart.updateLines([{ id: lineId, quantity }]);
    return data(result);
  }

  if (intent === "remove-item") {
    const lineId = formData.get("lineId") as string;
    const result = await cart.removeLines([lineId]);
    return data(result);
  }

  return data({ error: "Invalid intent" }, { status: 400 });
}

export default function CartPage() {
  const { cart } = useLoaderData<typeof loader>();
  const lines = cart?.lines?.nodes ?? [];

  if (lines.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 20px",
          minHeight: "60vh",
        }}
      >
        <h1
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: 42,
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          YOUR CART IS EMPTY
        </h1>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            color: "var(--muted)",
            marginBottom: 28,
          }}
        >
          // nothing here yet — go find something you love
        </p>
        <Link
          to="/"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: 2,
            background: "var(--ink)",
            color: "white",
            padding: "12px 32px",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          BROWSE POSTERS
        </Link>
      </div>
    );
  }

  const subtotal = cart?.cost?.subtotalAmount;
  const total = cart?.cost?.totalAmount;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <h1
        style={{
          fontFamily: "Anton, sans-serif",
          fontSize: 36,
          letterSpacing: 2,
          borderBottom: "3px solid var(--ink)",
          paddingBottom: 12,
          marginBottom: 28,
        }}
      >
        YOUR CART
      </h1>

      {/* Header row */}
      <div
        className="cart-header-row"
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 120px 100px 80px",
          gap: 16,
          alignItems: "center",
          borderBottom: "1px solid var(--mid)",
          paddingBottom: 8,
          marginBottom: 16,
        }}
      >
        <span />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            letterSpacing: 2,
            color: "var(--muted)",
          }}
        >
          PRODUCT
        </span>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            letterSpacing: 2,
            color: "var(--muted)",
          }}
        >
          QTY
        </span>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            letterSpacing: 2,
            color: "var(--muted)",
            textAlign: "right",
          }}
        >
          PRICE
        </span>
        <span />
      </div>

      {/* Line items */}
      {lines.map((line: any) => (
        <CartLineItem key={line.id} line={line} />
      ))}

      {/* Summary */}
      <div
        style={{
          marginTop: 32,
          borderTop: "3px solid var(--ink)",
          paddingTop: 20,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ width: 280 }}>
          {subtotal && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                SUBTOTAL
              </span>
              <span style={{ fontFamily: "Anton, sans-serif", fontSize: 18 }}>
                {formatMoney(subtotal)}
              </span>
            </div>
          )}
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: "var(--muted)",
              marginBottom: 16,
            }}
          >
            Shipping & taxes calculated at checkout.
          </p>

          {cart?.checkoutUrl && (
            <a
              href={cart.checkoutUrl}
              style={{
                display: "block",
                textAlign: "center",
                background: "var(--red)",
                color: "white",
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                letterSpacing: 2,
                padding: "14px 0",
                textDecoration: "none",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              CHECKOUT
            </a>
          )}

          <Link
            to="/"
            style={{
              display: "block",
              textAlign: "center",
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: 1,
              color: "var(--muted)",
              textDecoration: "none",
            }}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function CartLineItem({ line }: { line: any }) {
  const fetcher = useFetcher();
  const merchandise = line.merchandise;
  const image = merchandise?.image;
  const product = merchandise?.product;

  const isRemoving =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("intent") === "remove-item";

  return (
    <div
      className="cart-line-item"
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr 120px 100px 80px",
        gap: 16,
        alignItems: "center",
        borderBottom: "1px solid var(--mid)",
        paddingBottom: 16,
        marginBottom: 16,
        opacity: isRemoving ? 0.3 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {/* Image */}
      <Link to={`/products/${product?.handle}`}>
        {image ? (
          <Image
            data={image}
            width={80}
            height={100}
            style={{ background: "var(--ink)", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 100,
              background: "var(--ink)",
            }}
          />
        )}
      </Link>

      {/* Info */}
      <div>
        <Link
          to={`/products/${product?.handle}`}
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: 16,
            color: "var(--ink)",
            textDecoration: "none",
            display: "block",
            marginBottom: 4,
          }}
        >
          {product?.title}
        </Link>
        {merchandise?.title !== "Default Title" && (
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: "var(--muted)",
            }}
          >
            {merchandise.title}
          </span>
        )}
      </div>

      {/* Quantity stepper */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="update-quantity" />
          <input type="hidden" name="lineId" value={line.id} />
          <input type="hidden" name="quantity" value={line.quantity - 1} />
          <button
            type="submit"
            style={{
              width: 32,
              height: 32,
              border: "1px solid var(--mid)",
              background: "transparent",
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              cursor: "pointer",
              borderRadius: 0,
            }}
          >
            −
          </button>
        </fetcher.Form>

        <span
          style={{
            width: 36,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTop: "1px solid var(--mid)",
            borderBottom: "1px solid var(--mid)",
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
          }}
        >
          {line.quantity}
        </span>

        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="update-quantity" />
          <input type="hidden" name="lineId" value={line.id} />
          <input type="hidden" name="quantity" value={line.quantity + 1} />
          <button
            type="submit"
            style={{
              width: 32,
              height: 32,
              border: "1px solid var(--mid)",
              background: "transparent",
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              cursor: "pointer",
              borderRadius: 0,
            }}
          >
            +
          </button>
        </fetcher.Form>
      </div>

      {/* Price */}
      <span
        style={{
          fontFamily: "Anton, sans-serif",
          fontSize: 16,
          textAlign: "right",
        }}
      >
        {formatMoney(line.cost.totalAmount)}
      </span>

      {/* Remove */}
      <fetcher.Form method="post">
        <input type="hidden" name="intent" value="remove-item" />
        <input type="hidden" name="lineId" value={line.id} />
        <button
          type="submit"
          style={{
            background: "none",
            border: "none",
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: "var(--red)",
            cursor: "pointer",
            letterSpacing: 1,
          }}
        >
          REMOVE
        </button>
      </fetcher.Form>
    </div>
  );
}
