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

    // Deferred related products
    const related = storefront
      .query(RELATED_QUERY, { variables: { productId: product.id } })
      .then((res: any) => res.productRecommendations ?? [])
      .catch(() => []);

    return data({ product, related });
  } catch (e: any) {
    if (e instanceof Response) throw e;
    console.error("Product loader error:", e.message);
    throw new Response(
      `Storefront API error: ${e.message}`,
      { status: 502 },
    );
  }
}

// Finish swatch config
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

  // Variant selection state
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

  // After Buy Now adds to cart, redirect to checkout
  useEffect(() => {
    if (isBuyNow && fetcher.state === "idle" && fetcher.data?.cart?.checkoutUrl) {
      setIsBuyNow(false);
      window.location.href = fetcher.data.cart.checkoutUrl;
    }
  }, [isBuyNow, fetcher.state, fetcher.data]);

  // Find matching variant
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

  // Reviews
  const ratingMeta = product.metafields?.find(
    (m: any) => m?.namespace === "reviews" && m?.key === "rating",
  );
  const countMeta = product.metafields?.find(
    (m: any) => m?.namespace === "reviews" && m?.key === "count",
  );
  const rating = ratingMeta?.value ? parseFloat(ratingMeta.value) : 4.9;
  const reviewCount = countMeta?.value ? parseInt(countMeta.value, 10) : 347;

  function handleAddToCart() {
    if (!selectedVariant?.id) {
      setAddError(true);
      setTimeout(() => setAddError(false), 2000);
      return;
    }
    if (!selectedVariant?.availableForSale) {
      setAddError(true);
      setTimeout(() => setAddError(false), 2000);
      return;
    }
    fetcher.submit(
      { intent: "add-to-cart", variantId: selectedVariant.id, quantity: "1" },
      { method: "post", action: "/cart" },
    );
    setTimeout(() => window.dispatchEvent(new CustomEvent("open-cart")), 300);
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

  // JSON-LD
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
          background: "white",
          padding: "14px 32px",
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
          color: "var(--muted)",
          borderBottom: "1px solid var(--mid)",
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
        <span style={{ color: "var(--ink)" }}>{product.title}</span>
      </div>

      {/* Two column grid */}
      <div
        className="product-detail-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "55% 1fr",
          background: "white",
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
          {/* Main image */}
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

          {/* Thumbnails */}
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
                      i === selectedImageIdx ? "var(--red)" : "transparent"
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
            gap: 20,
            borderLeft: "1px solid var(--mid)",
          }}
        >
          {/* Category */}
          {product.productType && (
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "var(--red)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {product.productType}
            </span>
          )}

          {/* Title */}
          <h1
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: 42,
              color: "var(--ink)",
              letterSpacing: 1,
              lineHeight: 0.95,
            }}
          >
            {product.title}
          </h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--red)", fontSize: 16 }}>★★★★★</span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
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
                fontFamily: "Anton, sans-serif",
                fontSize: 34,
              }}
            >
              {formatMoney(price)}
            </span>
            {hasDiscount && (
              <>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 18,
                    textDecoration: "line-through",
                    color: "var(--muted)",
                  }}
                >
                  {formatMoney(compareAt)}
                </span>
                <span
                  style={{
                    background: "var(--red)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 8px",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Size selector */}
          {sizeOption && (
            <div>
              <label
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: 1.5,
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: 8,
                  textTransform: "uppercase",
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
                        selectedSize === size ? "var(--ink)" : "var(--mid)"
                      }`,
                      padding: "8px 14px",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      background:
                        selectedSize === size ? "var(--cream)" : "transparent",
                      borderRadius: 0,
                      color:
                        selectedSize === size ? "var(--ink)" : "var(--muted)",
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
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: 1.5,
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: 8,
                  textTransform: "uppercase",
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
                        selectedFinish === finish ? "var(--ink)" : "var(--mid)"
                      }`,
                      padding: "8px 14px",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      background:
                        selectedFinish === finish
                          ? "var(--cream)"
                          : "transparent",
                      borderRadius: 0,
                      color:
                        selectedFinish === finish
                          ? "var(--ink)"
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
                        background: FINISH_SWATCHES[finish] ?? "var(--mid)",
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
            disabled={!selectedVariant?.availableForSale || fetcher.state !== "idle"}
            style={{
              width: "100%",
              background: selectedVariant?.availableForSale ? "var(--ink)" : "var(--mid)",
              color: "white",
              border: addError ? "2px solid var(--red)" : "none",
              padding: 18,
              fontFamily: "Anton, sans-serif",
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: selectedVariant?.availableForSale ? "pointer" : "not-allowed",
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
            disabled={!selectedVariant?.availableForSale || fetcher.state !== "idle"}
            style={{
              width: "100%",
              background: selectedVariant?.availableForSale ? "var(--red)" : "var(--muted)",
              color: "white",
              border: "none",
              padding: 16,
              fontFamily: "Anton, sans-serif",
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: selectedVariant?.availableForSale ? "pointer" : "not-allowed",
              opacity: fetcher.state !== "idle" ? 0.7 : 1,
            }}
          >
            {isBuyNow && fetcher.state !== "idle" ? "REDIRECTING..." : "BUY NOW"}
          </button>

          {/* Perks */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              "Free shipping over £50",
              "Ships in 3–5 days",
              "30-day returns",
            ].map((perk) => (
              <div
                key={perk}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    background: "var(--red)",
                    borderRadius: 0,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    color: "var(--ink)",
                  }}
                >
                  {perk}
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div
              style={{
                paddingTop: 4,
                borderTop: "1px solid var(--mid)",
              }}
              dangerouslySetInnerHTML={{ __html: product.description }}
              className="font-mono text-[13px] text-muted leading-[1.7] font-normal"
            />
          )}
        </div>
      </div>

      {/* ─── Related Products ─── */}
      <Suspense
        fallback={
          <div
            style={{
              padding: "40px 32px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
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
                    fontFamily: "Anton, sans-serif",
                    fontSize: 30,
                    letterSpacing: 1.5,
                    marginBottom: 24,
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
