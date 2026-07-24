import {
  useLoaderData,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router";
import { useState } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Pagination, getPaginationVariables } from "@shopify/hydrogen";
import { COLLECTION_QUERY, ALL_PRODUCTS_QUERY } from "~/graphql/ProductQuery";
import { ProductCard } from "~/components/ProductCard";
import { getSortValuesFromParam, buildFilters } from "~/lib/utils";
import { createContext } from "~/lib/hydrogen.server";

// Keep disabled collections in Shopify so they can be restored without
// recreating products or collection data.
const HIDDEN_COLLECTION_HANDLES = new Set(["sports-poster"]);
const LIMITED_COLLECTION_PRODUCT_COUNTS: Record<string, number> = {
  "animal-metal-poster": 3,
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.collection
      ? `${data.collection.title} — MetalPosters`
      : "Collection — MetalPosters",
  },
];

// Map collection sort keys → root products sort keys
function toProductSortKey(collectionSortKey: string): string {
  switch (collectionSortKey) {
    case "CREATED":
      return "CREATED_AT";
    case "MANUAL":
      return "RELEVANCE";
    default:
      return collectionSortKey; // PRICE, BEST_SELLING, etc. are the same
  }
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storefront } = createContext(request);
  const { handle } = params;
  if (!handle) throw new Response("Not found", { status: 404 });
  if (HIDDEN_COLLECTION_HANDLES.has(handle)) {
    throw new Response("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const { sortKey, reverse } = getSortValuesFromParam(
    url.searchParams.get("sort"),
  );
  const filters = buildFilters(url.searchParams);
  const collectionLimit = LIMITED_COLLECTION_PRODUCT_COUNTS[handle];
  const paginationVariables = collectionLimit
    ? { first: collectionLimit, after: null }
    : getPaginationVariables(request, { pageBy: 24 });

  try {
    // For "all", try the collection first, then fall back to products root query
    if (handle === "all") {
      // Try the built-in "all" collection first
      try {
        const { collection } = await storefront.query(COLLECTION_QUERY, {
          variables: {
            handle: "all",
            sortKey,
            reverse,
            filters: filters.length > 0 ? filters : undefined,
            ...paginationVariables,
          },
        });
        if (collection) return { collection };
      } catch {
        // Fall through to products query
      }

      // Fallback: query all products directly
      const { products } = await storefront.query(ALL_PRODUCTS_QUERY, {
        variables: {
          sortKey: toProductSortKey(sortKey),
          reverse,
          ...paginationVariables,
        },
      });

      return {
        collection: {
          id: "all",
          title: "All Products",
          description: "Browse our complete collection of metal posters.",
          handle: "all",
          products: products ?? {
            nodes: [],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
              hasPreviousPage: false,
              startCursor: null,
            },
          },
        },
      };
    }

    // Normal collection query
    const { collection } = await storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        sortKey,
        reverse,
        filters: filters.length > 0 ? filters : undefined,
        ...paginationVariables,
      },
    });

    if (!collection) throw new Response("Not found", { status: 404 });

    if (collectionLimit) {
      collection.products.nodes = collection.products.nodes.slice(
        0,
        collectionLimit,
      );
      collection.products.pageInfo = {
        hasNextPage: false,
        endCursor: null,
        hasPreviousPage: false,
        startCursor: null,
      };
    }

    return { collection };
  } catch (e: any) {
    if (e instanceof Response) throw e;
    console.error("Collection loader error:", e.message);
    throw new Response(`Storefront API error: ${e.message}`, { status: 502 });
  }
}

const SORT_OPTIONS = [
  { label: "Featured", value: "" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best-selling" },
];

const SIZE_FILTERS = ["Small", "Medium", "Large", "XL", "XXL"];
const FINISH_FILTERS = ["Brushed", "Gloss", "Gold"];
const CATEGORY_FILTERS = [
  "Anime",
  "Cars",
  "Islamic",
  "Motivational",
  "Gaming",
  "Superheroes",
  "Movies",
  "Abstract",
  "Famous Personalities",
  "Bikes",
  "Animal",
  "Kids",
];

export default function CollectionPage() {
  const { collection } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    navigate(`?${params.toString()}`, { preventScrollReset: true });
  }

  function clearFilters() {
    navigate(`/collections/${collection.handle}`);
  }

  const currentSort = searchParams.get("sort") || "";
  const currentSize = searchParams.get("size") || "";
  const currentFinish = searchParams.get("finish") || "";
  const currentCategory = searchParams.get("category") || "";

  const activeFilterCount = [
    currentSort,
    currentSize,
    currentFinish,
    currentCategory,
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
  ].filter(Boolean).length;

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* ─── Top bar: title + filter button + sort ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          borderBottom: "2px solid var(--ink)",
          paddingBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h1
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 1,
            color: "var(--white)",
            margin: 0,
          }}
        >
          {collection.title}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Filters & Sort button */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--card)",
              border: "1px solid var(--muted)",
              color: "var(--white)",
              padding: "10px 18px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="20" y2="12" />
              <line x1="12" y1="18" x2="20" y2="18" />
            </svg>
            Filters &amp; Sort
            {activeFilterCount > 0 && (
              <span
                style={{
                  background: "var(--copper)",
                  color: "white",
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort dropdown inline */}
          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            style={{
              background: "var(--card)",
              border: "1px solid var(--muted)",
              borderRadius: 0,
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              padding: "10px 14px",
              color: "var(--white)",
              cursor: "pointer",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                style={{ background: "var(--card)" }}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Products grid ─── */}
      <Pagination connection={collection.products}>
        {({ nodes, NextLink, PreviousLink, isLoading }) => (
          <>
            <PreviousLink>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  padding: "6px 14px",
                  border: "1px solid var(--mid)",
                  color: "var(--muted)",
                  textDecoration: "none",
                  display: "inline-block",
                  marginBottom: 16,
                }}
              >
                ← LOAD PREVIOUS
              </span>
            </PreviousLink>

            <div
              className="product-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 16,
              }}
            >
              {nodes.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <NextLink>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    padding: "6px 14px",
                    background: "var(--ink)",
                    color: "white",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  {isLoading ? "LOADING..." : "LOAD MORE →"}
                </span>
              </NextLink>
            </div>
          </>
        )}
      </Pagination>

      {/* ─── Filter Drawer ─── */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.6)",
          }}
        />
      )}

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: 320,
          background: "var(--card)",
          borderLeft: "1px solid #333",
          zIndex: 51,
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #333",
            position: "sticky",
            top: 0,
            background: "var(--card)",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--white)",
            }}
          >
            Filters &amp; Sort
          </span>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "var(--steel)",
              fontSize: 22,
              cursor: "pointer",
              lineHeight: 1,
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* Drawer body */}
        <div style={{ padding: "24px", flex: 1 }}>
          {/* Sort */}
          <FilterGroup title="Sort By">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SORT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    cursor: "pointer",
                    color:
                      currentSort === opt.value
                        ? "var(--copper)"
                        : "var(--steel)",
                  }}
                >
                  <input
                    type="radio"
                    name="sort-drawer"
                    checked={currentSort === opt.value}
                    onChange={() => updateParam("sort", opt.value)}
                    style={{ accentColor: "var(--copper)" }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Price Range */}
          <FilterGroup title="Price Range">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const min = fd.get("minPrice") as string;
                const max = fd.get("maxPrice") as string;
                const params = new URLSearchParams(searchParams);
                if (min) params.set("minPrice", min);
                else params.delete("minPrice");
                if (max) params.set("maxPrice", max);
                else params.delete("maxPrice");
                navigate(`?${params.toString()}`, { preventScrollReset: true });
              }}
              style={{ display: "flex", gap: 6, alignItems: "center" }}
            >
              <input
                name="minPrice"
                type="number"
                placeholder="Min ₨"
                defaultValue={searchParams.get("minPrice") || ""}
                style={{
                  background: "var(--bg)",
                  border: "1px solid #444",
                  borderRadius: 0,
                  padding: "8px 10px",
                  width: 90,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: "var(--white)",
                }}
              />
              <span style={{ color: "var(--muted)", fontSize: 12 }}>–</span>
              <input
                name="maxPrice"
                type="number"
                placeholder="Max ₨"
                defaultValue={searchParams.get("maxPrice") || ""}
                style={{
                  background: "var(--bg)",
                  border: "1px solid #444",
                  borderRadius: 0,
                  padding: "8px 10px",
                  width: 90,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  color: "var(--white)",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "var(--copper)",
                  color: "white",
                  padding: "8px 14px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                GO
              </button>
            </form>
          </FilterGroup>

          {/* Category */}
          <FilterGroup title="Category">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {CATEGORY_FILTERS.map((c) => (
                <label
                  key={c}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    cursor: "pointer",
                    color:
                      currentCategory === c ? "var(--copper)" : "var(--steel)",
                  }}
                >
                  <input
                    type="radio"
                    name="category-filter"
                    checked={currentCategory === c}
                    onChange={() =>
                      updateParam("category", currentCategory === c ? "" : c)
                    }
                    style={{ accentColor: "var(--copper)" }}
                  />
                  {c}
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Size */}
          <FilterGroup title="Size">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SIZE_FILTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    updateParam("size", currentSize === s ? "" : s)
                  }
                  style={{
                    border: `1px solid ${currentSize === s ? "var(--copper)" : "#444"}`,
                    padding: "6px 14px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: currentSize === s ? "#2a1a0a" : "transparent",
                    color: currentSize === s ? "var(--copper)" : "var(--steel)",
                    borderRadius: 0,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Finish */}
          <FilterGroup title="Finish">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {FINISH_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() =>
                    updateParam("finish", currentFinish === f ? "" : f)
                  }
                  style={{
                    border: `1px solid ${currentFinish === f ? "var(--copper)" : "#444"}`,
                    padding: "6px 14px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: currentFinish === f ? "#2a1a0a" : "transparent",
                    color:
                      currentFinish === f ? "var(--copper)" : "var(--steel)",
                    borderRadius: 0,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </FilterGroup>
        </div>

        {/* Drawer footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #333",
            display: "flex",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={() => {
              clearFilters();
              setDrawerOpen(false);
            }}
            style={{
              flex: 1,
              background: "none",
              border: "1px solid var(--muted)",
              color: "var(--steel)",
              padding: "12px 0",
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            style={{
              flex: 2,
              background: "var(--copper)",
              border: "none",
              color: "white",
              padding: "12px 0",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Apply →
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "var(--muted)",
          borderBottom: "1px solid #333",
          paddingBottom: 8,
          marginBottom: 12,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
