import { useState, useEffect, Suspense } from "react";
import {
  useLoaderData,
  Link,
  NavLink,
  useFetcher,
  Await,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "react-router";
import { data } from "react-router";
import { Image } from "@shopify/hydrogen";
import {
  PRODUCT_DETAIL_QUERY,
  PRODUCT_CARD_FRAGMENT,
} from "~/graphql/ProductQuery";
import { ProductCard } from "~/components/ProductCard";
import { formatMoney, discountPercent, SIZE_DIMENSIONS } from "~/lib/utils";
import { createContext } from "~/lib/hydrogen.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const product = data?.product;
  return [
    { title: product ? `${product.title} — MetalPosters` : "MetalPosters" },
    { name: "description", content: product?.description?.slice(0, 160) ?? "" },
  ];
};

const RELATED_QUERY = `#graphql
  query RelatedProducts($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductCard
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storefront } = createContext(request);
  const { handle } = params;
  if (!handle) throw new Response("Not found", { status: 404 });

  const url = new URL(request.url);
  const selectedOptions: { name: string; value: string }[] = [];
  url.searchParams.forEach((value, name) => {
    if (name !== "sort" && name !== "direction") {
      selectedOptions.push({ name, value });
    }
  });

  try {
    const { product } = await storefront.query(PRODUCT_DETAIL_QUERY, {
      variables: { handle, selectedOptions },
    });

    if (!product) throw new Response("Not found", { status: 404 });

    const related = storefront
      .query(RELATED_QUERY, { variables: { productId: product.id } })
      .then((res: any) => res.productRecommendations ?? [])
      .catch(() => []);

    return data({ product, related });
  } catch (e: any) {
    if (e instanceof Response) throw e;
    console.error("Product loader error:", e.message);
    throw new Response(`Storefront API error: ${e.message}`, { status: 502 });
  }
}

const FINISH_SWATCHES: Record<string, string> = {
  Brushed: "linear-gradient(135deg, #C0C0C0, #888)",
  Gloss: "linear-gradient(135deg, #E8E8E8, #B0B0B0)",
  Gold: "linear-gradient(135deg, #D4AF6A, #A07830)",
};

export default function ProductPage() {
  const { product, related } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const images = product.images?.nodes ?? [];
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const mainImage = images[selectedImageIdx] || images[0];

  const allVariants = product.variants?.nodes ?? [];
  const sizeOption = product.options?.find(
    (o: any) => o.name.toLowerCase() === "size",
  );
  const finishOption = product.options?.find(
    (o: any) => o.name.toLowerCase() === "finish",
  );

  const [selectedSize, setSelectedSize] = useState(
    product.selectedVariant?.selectedOptions?.find(
      (o: any) => o.name.toLowerCase() === "size",
    )?.value ??
      sizeOption?.values?.[0] ??
      "",
  );
  const [selectedFinish, setSelectedFinish] = useState(
    product.selectedVariant?.selectedOptions?.find(
      (o: any) => o.name.toLowerCase() === "finish",
    )?.value ??
      finishOption?.values?.[0] ??
      "",
  );
  const [addError, setAddError] = useState(false);
  const [isBuyNow, setIsBuyNow] = useState(false);

  useEffect(() => {
    if (
      isBuyNow &&
      fetcher.state === "idle" &&
      fetcher.data?.cart?.checkoutUrl
    ) {
      setIsBuyNow(false);
      window.location.href = fetcher.data.cart.checkoutUrl;
    }
  }, [isBuyNow, fetcher.state, fetcher.data]);

  // Open cart drawer after add-to-cart completes (non-buy-now)
  useEffect(() => {
    if (!isBuyNow && fetcher.state === "idle" && fetcher.data?.cart) {
      window.dispatchEvent(
        new CustomEvent("open-cart", { detail: { cart: fetcher.data.cart } }),
      );
    }
  }, [fetcher.state, fetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedVariant =
    allVariants.find((v: any) => {
      const opts = v.selectedOptions.reduce(
        (acc: Record<string, string>, o: any) => ({
          ...acc,
          [o.name.toLowerCase()]: o.value,
        }),
        {},
      );
      const sizeMatch = !sizeOption || opts.size === selectedSize;
      const finishMatch = !finishOption || opts.finish === selectedFinish;
      return sizeMatch && finishMatch;
    }) ??
    product.selectedVariant ??
    allVariants[0];

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt =
    selectedVariant?.compareAtPrice ??
    product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount =
    compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const discount = hasDiscount ? discountPercent(price, compareAt) : 0;

  const ratingMeta = product.metafields?.find(
    (m: any) => m?.namespace === "reviews" && m?.key === "rating",
  );
  const countMeta = product.metafields?.find(
    (m: any) => m?.namespace === "reviews" && m?.key === "count",
  );
  const rating = ratingMeta?.value ? parseFloat(ratingMeta.value) : 4.9;
  const reviewCount = countMeta?.value ? parseInt(countMeta.value, 10) : 347;

  // Low stock
  const qtyAvailable = selectedVariant?.quantityAvailable;
  const lowStock =
    qtyAvailable !== null &&
    qtyAvailable !== undefined &&
    qtyAvailable > 0 &&
    qtyAvailable <= 10;

  function handleAddToCart() {
    if (!selectedVariant?.id || !selectedVariant?.availableForSale) {
      setAddError(true);
      setTimeout(() => setAddError(false), 2000);
      return;
    }
    fetcher.submit(
      { intent: "add-to-cart", variantId: selectedVariant.id, quantity: "1" },
      { method: "post", action: "/cart" },
    );
  }

  function handleBuyNow() {
    if (!selectedVariant?.id || !selectedVariant?.availableForSale) {
      setAddError(true);
      setTimeout(() => setAddError(false), 2000);
      return;
    }
    setIsBuyNow(true);
    fetcher.submit(
      { intent: "add-to-cart", variantId: selectedVariant.id, quantity: "1" },
      { method: "post", action: "/cart" },
    );
  }

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: images.map((i: any) => i.url),
    offers: {
      "@type": "Offer",
      price: parseFloat(price.amount),
      priceCurrency: price.currencyCode,
      availability: selectedVariant?.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div
        style={{
          background: "var(--card)",
          padding: "14px 32px",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          color: "var(--muted)",
          borderBottom: "1px solid #3a3a3a",
        }}
      >
        <NavLink
          to="/"
          style={{ color: "var(--muted)", textDecoration: "none" }}
        >
          Home
        </NavLink>
        {" › "}
        {product.productType && (
          <>
            <NavLink
              to={`/collections/${product.productType.toLowerCase()}`}
              style={{ color: "var(--muted)", textDecoration: "none" }}
            >
              {product.productType}
            </NavLink>
            {" › "}
          </>
        )}
        <span style={{ color: "var(--steel)" }}>{product.title}</span>
      </div>

      {/* Two column grid */}
      <div
        className="product-detail-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "55% 1fr",
          background: "var(--bg)",
          minHeight: 580,
        }}
      >
        {/* LEFT — Gallery */}
        <div
          style={{
            background: "#0E0E12",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            gap: 20,
          }}
        >
          <div
            className="poster-shine product-main-image"
            style={{
              width: 240,
              height: 300,
              background: "#0D0D14",
              position: "relative",
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {mainImage && (
              <Image
                data={mainImage}
                sizes="240px"
                className="w-full h-full object-cover"
                loading="eager"
              />
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: "flex", gap: 10 }}>
              {images.slice(0, 4).map((img: any, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIdx(i)}
                  style={{
                    width: 52,
                    height: 66,
                    border: `2px solid ${
                      i === selectedImageIdx ? "var(--copper)" : "transparent"
                    }`,
                    padding: 0,
                    background: "#0D0D14",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    data={img}
                    sizes="52px"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Info */}
        <div
          style={{
            padding: 36,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            borderLeft: "1px solid #3a3a3a",
          }}
        >
          {/* Category */}
          {product.productType && (
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                color: "var(--copper)",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {product.productType}
            </span>
          )}

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: 36,
              color: "var(--white)",
              letterSpacing: -0.5,
              lineHeight: 1,
            }}
          >
            {product.title}
          </h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--copper)", fontSize: 16 }}>★★★★★</span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "var(--muted)",
              }}
            >
              {rating} · {reviewCount} reviews
            </span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: 32,
                color: "var(--copper)",
              }}
            >
              {formatMoney(price)}
            </span>
            {hasDiscount && (
              <>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 16,
                    textDecoration: "line-through",
                    color: "var(--muted)",
                  }}
                >
                  {formatMoney(compareAt)}
                </span>
                <span
                  style={{
                    background: "var(--terracotta)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 8px",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Urgency bar */}
          {(lowStock || hasDiscount) && (
            <div
              style={{
                background: "#2a1a0a",
                border: "1px solid var(--copper)",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {lowStock && (
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--terracotta)",
                  }}
                >
                  🔥 Only {qtyAvailable} left
                </span>
              )}
              {lowStock && <span style={{ color: "var(--muted)" }}>•</span>}
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: "var(--steel)",
                }}
              >
                Free delivery in Lahore
              </span>
              <span style={{ color: "var(--muted)" }}>•</span>
              <CountdownTimer />
            </div>
          )}

          {/* Size selector */}
          {sizeOption && (
            <div>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  letterSpacing: 1.5,
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                SIZE
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {sizeOption.values.map((size: string) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    style={{
                      border: `1.5px solid ${
                        selectedSize === size ? "var(--copper)" : "var(--muted)"
                      }`,
                      padding: "8px 14px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      background:
                        selectedSize === size ? "var(--card)" : "transparent",
                      borderRadius: 0,
                      color:
                        selectedSize === size
                          ? "var(--copper)"
                          : "var(--muted)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <span>{size}</span>
                    {SIZE_DIMENSIONS[size] && (
                      <span style={{ fontSize: 9, color: "var(--muted)" }}>
                        {SIZE_DIMENSIONS[size]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Finish selector */}
          {finishOption && (
            <div>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  letterSpacing: 1.5,
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                FINISH
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {finishOption.values.map((finish: string) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setSelectedFinish(finish)}
                    style={{
                      border: `1.5px solid ${
                        selectedFinish === finish
                          ? "var(--copper)"
                          : "var(--muted)"
                      }`,
                      padding: "8px 14px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      background:
                        selectedFinish === finish
                          ? "var(--card)"
                          : "transparent",
                      borderRadius: 0,
                      color:
                        selectedFinish === finish
                          ? "var(--copper)"
                          : "var(--muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        background: FINISH_SWATCHES[finish] ?? "var(--muted)",
                        borderRadius: 0,
                      }}
                    />
                    {finish}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              !selectedVariant?.availableForSale || fetcher.state !== "idle"
            }
            style={{
              width: "100%",
              background: selectedVariant?.availableForSale
                ? "var(--copper)"
                : "var(--muted)",
              color: "white",
              border: addError ? "2px solid var(--terracotta)" : "none",
              padding: 18,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: selectedVariant?.availableForSale
                ? "pointer"
                : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              opacity: fetcher.state !== "idle" ? 0.7 : 1,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {!selectedVariant?.availableForSale
              ? "SOLD OUT"
              : fetcher.state !== "idle" && !isBuyNow
                ? "ADDING..."
                : "ADD TO CART"}
          </button>

          {/* Buy Now */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={
              !selectedVariant?.availableForSale || fetcher.state !== "idle"
            }
            style={{
              width: "100%",
              background: selectedVariant?.availableForSale
                ? "var(--terracotta)"
                : "#444",
              color: "white",
              border: "none",
              padding: 16,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: selectedVariant?.availableForSale
                ? "pointer"
                : "not-allowed",
              opacity: fetcher.state !== "idle" ? 0.7 : 1,
            }}
          >
            {isBuyNow && fetcher.state !== "idle"
              ? "REDIRECTING..."
              : "BUY NOW"}
          </button>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              padding: "8px 0",
              flexWrap: "wrap",
            }}
          >
            {["🔒 SSL Secure", "💳 Visa / MC", "📱 JazzCash", "💵 COD"].map(
              (badge) => (
                <span
                  key={badge}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    color: "var(--muted)",
                    background: "var(--card)",
                    border: "1px solid #3a3a3a",
                    padding: "4px 10px",
                    fontWeight: 500,
                    letterSpacing: 0.3,
                  }}
                >
                  {badge}
                </span>
              ),
            )}
          </div>

          {/* Guarantees row */}
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              borderTop: "1px solid #3a3a3a",
              paddingTop: 16,
            }}
          >
            {[
              { icon: "↩️", text: "7-Day Returns" },
              { icon: "🛡️", text: "Rust-Proof Promise" },
              { icon: "🔒", text: "Secure Checkout" },
              { icon: "🚚", text: "Ships 3–5 Days" },
            ].map((g) => (
              <div
                key={g.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 14 }}>{g.icon}</span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    color: "var(--steel)",
                    fontWeight: 500,
                  }}
                >
                  {g.text}
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div
              style={{
                paddingTop: 4,
                borderTop: "1px solid #3a3a3a",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: "var(--muted)",
                lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>

      {/* Related Products */}
      <Suspense
        fallback={
          <div
            style={{
              padding: "40px 32px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "var(--muted)",
            }}
          >
            Loading recommendations...
          </div>
        }
      >
        <Await resolve={related}>
          {(relatedProducts: any[]) =>
            relatedProducts && relatedProducts.length > 0 ? (
              <section
                style={{ background: "var(--bg)", padding: "40px 32px" }}
              >
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: 26,
                    letterSpacing: -0.5,
                    marginBottom: 24,
                    color: "var(--white)",
                  }}
                >
                  YOU MIGHT ALSO LIKE
                </h2>
                <div
                  className="product-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 16,
                  }}
                >
                  {relatedProducts
                    .filter((p: any) => p.id !== product.id)
                    .slice(0, 4)
                    .map((p: any) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                </div>
              </section>
            ) : null
          }
        </Await>
      </Suspense>
    </>
  );
}

/** Countdown timer — counts down to end of day */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 700,
        fontSize: 12,
        color: "var(--copper)",
        letterSpacing: 1,
      }}
    >
      Order within {timeLeft}
    </span>
  );
}
