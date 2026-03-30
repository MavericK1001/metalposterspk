import { useEffect, useState } from "react";
import { useFetcher, Link, Form } from "react-router";
import { formatMoney } from "~/lib/utils";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [cartData, setCartData] = useState<any>(null);
  const fetcher = useFetcher();

  // Fetch cart data when drawer opens
  useEffect(() => {
    if (open) {
      fetcher.load("/cart");
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update local cart state from fetcher
  useEffect(() => {
    if (fetcher.data?.cart) {
      setCartData(fetcher.data.cart);
    }
  }, [fetcher.data]);

  // Listen for open-cart custom event (with optional cart data)
  useEffect(() => {
    function handleOpen(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.cart) {
        setCartData(detail.cart);
      }
      setOpen(true);
    }
    window.addEventListener("open-cart", handleOpen);
    return () => window.removeEventListener("open-cart", handleOpen);
  }, []);

  const cart = cartData;
  const lines = cart?.lines?.nodes ?? [];

  return (
    <>
      {/* Overlay */}
      {open && <div className="cart-overlay" onClick={() => setOpen(false)} />}

      {/* Drawer */}
      <div className={`cart-drawer ${open ? "open" : ""}`}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            borderBottom: "2px solid var(--card)",
          }}
        >
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            CART
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 18,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink)",
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
          {lines.length === 0 ? (
            <EmptyCart onClose={() => setOpen(false)} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {lines.map((line: any) => (
                <CartLine key={line.id} line={line} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && cart && (
          <div
            style={{
              padding: 20,
              borderTop: "2px solid var(--ink)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {formatMoney(cart.cost.subtotalAmount)}
              </span>
            </div>

            {/* Discount code */}
            <DiscountCodeForm
              appliedCodes={
                cart.discountCodes?.filter((d: any) => d.applicable) ?? []
              }
            />

            <a
              href={cart.checkoutUrl}
              style={{
                display: "block",
                background: "var(--copper)",
                color: "white",
                padding: 16,
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                textAlign: "center",
                textDecoration: "none",
                marginBottom: 12,
              }}
            >
              CHECKOUT
            </a>

            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                width: "100%",
                background: "none",
                border: "none",
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                color: "var(--muted)",
                textAlign: "center",
                cursor: "pointer",
                padding: 8,
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        gap: 20,
      }}
    >
      <span
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        YOUR CART IS EMPTY
      </span>
      <Link
        to="/collections/all"
        onClick={onClose}
        style={{
          background: "var(--copper)",
          color: "white",
          padding: "12px 28px",
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        BROWSE POSTERS
      </Link>
    </div>
  );
}

function CartLine({ line }: { line: any }) {
  const fetcher = useFetcher();
  const merch = line.merchandise;
  const product = merch.product;
  const imageUrl = product.featuredImage?.url
    ? `${product.featuredImage.url}&width=120`
    : null;
  const options = merch.selectedOptions?.map((o: any) => o.value).join(" · ");

  return (
    <div style={{ display: "flex", gap: 14 }}>
      {/* Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={product.featuredImage?.altText || product.title}
          width={60}
          height={80}
          style={{ objectFit: "cover", background: "var(--cream)" }}
        />
      )}

      {/* Details */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}
      >
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {product.title}
        </span>
        {options && (
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              letterSpacing: 1,
              color: "var(--muted)",
            }}
          >
            {options}
          </span>
        )}
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            marginTop: 4,
          }}
        >
          {formatMoney(merch.price)}
        </span>

        {/* Quantity stepper */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 6,
          }}
        >
          <fetcher.Form method="post" action="/cart">
            <input type="hidden" name="intent" value="update-quantity" />
            <input type="hidden" name="lineId" value={line.id} />
            <input
              type="hidden"
              name="quantity"
              value={Math.max(1, line.quantity - 1)}
            />
            <button
              type="submit"
              style={{
                width: 24,
                height: 24,
                border: "1px solid var(--mid)",
                background: "transparent",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              −
            </button>
          </fetcher.Form>

          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              minWidth: 20,
              textAlign: "center",
            }}
          >
            {line.quantity}
          </span>

          <fetcher.Form method="post" action="/cart">
            <input type="hidden" name="intent" value="update-quantity" />
            <input type="hidden" name="lineId" value={line.id} />
            <input type="hidden" name="quantity" value={line.quantity + 1} />
            <button
              type="submit"
              style={{
                width: 24,
                height: 24,
                border: "1px solid var(--mid)",
                background: "transparent",
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              +
            </button>
          </fetcher.Form>
        </div>

        {/* Remove */}
        <fetcher.Form method="post" action="/cart">
          <input type="hidden" name="intent" value="remove-item" />
          <input type="hidden" name="lineId" value={line.id} />
          <button
            type="submit"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 9,
              color: "var(--copper)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              marginTop: 4,
            }}
          >
            REMOVE
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}

function DiscountCodeForm({
  appliedCodes,
}: {
  appliedCodes: { code: string }[];
}) {
  const fetcher = useFetcher();
  const [showInput, setShowInput] = useState(false);

  return (
    <div style={{ marginBottom: 12 }}>
      {appliedCodes.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {appliedCodes.map((dc) => (
            <div
              key={dc.code}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--cream)",
                padding: "6px 10px",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  letterSpacing: 1,
                  color: "var(--ink)",
                }}
              >
                ✓ {dc.code}
              </span>
              <fetcher.Form method="post" action="/cart">
                <input type="hidden" name="intent" value="apply-discount" />
                <input type="hidden" name="discountCode" value="" />
                <button
                  type="submit"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 9,
                    color: "var(--copper)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  REMOVE
                </button>
              </fetcher.Form>
            </div>
          ))}
        </div>
      )}

      {!showInput ? (
        <button
          type="button"
          onClick={() => setShowInput(true)}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 10,
            letterSpacing: 1,
            color: "var(--muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
          }}
        >
          Have a discount code?
        </button>
      ) : (
        <fetcher.Form
          method="post"
          action="/cart"
          style={{ display: "flex", gap: 0 }}
          onSubmit={() => setShowInput(false)}
        >
          <input type="hidden" name="intent" value="apply-discount" />
          <input
            name="discountCode"
            type="text"
            placeholder="Enter code"
            required
            style={{
              flex: 1,
              border: "1px solid var(--muted)",
              padding: "8px 10px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              borderRadius: 0,
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              background: "var(--ink)",
              color: "white",
              border: "none",
              padding: "8px 14px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 9,
              letterSpacing: 1,
              cursor: "pointer",
              borderRadius: 0,
            }}
          >
            {fetcher.state !== "idle" ? "..." : "APPLY"}
          </button>
        </fetcher.Form>
      )}
    </div>
  );
}
