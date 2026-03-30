import {
  useLoaderData,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Pagination, getPaginationVariables } from "@shopify/hydrogen";
import { COLLECTION_QUERY } from "~/graphql/ProductQuery";
import { ProductCard } from "~/components/ProductCard";
import { getSortValuesFromParam, buildFilters } from "~/lib/utils";
import { createContext } from "~/lib/hydrogen.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.collection
      ? `${data.collection.title} — MetalPosters`
      : "Collection — MetalPosters",
  },
];

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storefront } = createContext(request);
  const { handle } = params;
  if (!handle) throw new Response("Not found", { status: 404 });

  const url = new URL(request.url);
  const { sortKey, reverse } = getSortValuesFromParam(
    url.searchParams.get("sort"),
  );
  const filters = buildFilters(url.searchParams);

  const paginationVariables = getPaginationVariables(request, { pageBy: 24 });

  try {
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
    return { collection };
  } catch (e: any) {
    if (e instanceof Response) throw e;
    console.error("Collection loader error:", e.message);
    throw new Response(
      `Storefront API error: ${e.message}`,
      { status: 502 },
    );
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
  "Music",
  "Movies",
  "Sports",
  "Nature",
  "Architecture",
  "Abstract",
];

export default function CollectionPage() {
  const { collection } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    navigate(`?${params.toString()}`, { preventScrollReset: true });
  }

  function clearFilters() {
    navigate(`/collections/${collection.handle}`);
  }

  const currentSort = searchParams.get("sort") || "";
  const currentSize = searchParams.get("size") || "";
  const currentFinish = searchParams.get("finish") || "";
  const currentCategory = searchParams.get("category") || "";

  return (
    <div
      className="collection-layout"
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: 0,
        alignItems: "start",
      }}
    >
      {/* ─── SIDEBAR ─── */}
      <aside
        className="collection-sidebar"
        style={{
          position: "sticky",
          top: 56,
          background: "var(--cream)",
          borderRight: "1px solid var(--mid)",
          padding: 28,
          minHeight: "calc(100vh - 56px)",
        }}
      >
        <h1
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: 28,
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          {collection.title}
        </h1>

        {collection.description && (
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            {collection.description}
          </p>
        )}

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
              placeholder="Min"
              defaultValue={searchParams.get("minPrice") || ""}
              style={{
                background: "transparent",
                border: "1px solid var(--mid)",
                borderRadius: 0,
                padding: "6px 8px",
                width: 70,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
              }}
            />
            <input
              name="maxPrice"
              type="number"
              placeholder="Max"
              defaultValue={searchParams.get("maxPrice") || ""}
              style={{
                background: "transparent",
                border: "1px solid var(--mid)",
                borderRadius: 0,
                padding: "6px 8px",
                width: 70,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
              }}
            />
            <button
              type="submit"
              style={{
                background: "var(--ink)",
                color: "white",
                padding: "6px 14px",
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                letterSpacing: 1,
                border: "none",
                borderRadius: 0,
                cursor: "pointer",
              }}
            >
              GO
            </button>
          </form>
        </FilterGroup>

        {/* Size */}
        <FilterGroup title="Size">
          {SIZE_FILTERS.map((s) => (
            <label
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                cursor: "pointer",
                marginBottom: 6,
              }}
            >
              <input
                type="radio"
                name="size-filter"
                checked={currentSize === s}
                onChange={() => updateParam("size", currentSize === s ? "" : s)}
                style={{ accentColor: "var(--red)" }}
              />
              {s}
            </label>
          ))}
        </FilterGroup>

        {/* Finish */}
        <FilterGroup title="Finish">
          {FINISH_FILTERS.map((f) => (
            <label
              key={f}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                cursor: "pointer",
                marginBottom: 6,
              }}
            >
              <input
                type="radio"
                name="finish-filter"
                checked={currentFinish === f}
                onChange={() =>
                  updateParam("finish", currentFinish === f ? "" : f)
                }
                style={{ accentColor: "var(--red)" }}
              />
              {f}
            </label>
          ))}
        </FilterGroup>

        {/* Category */}
        <FilterGroup title="Category">
          {CATEGORY_FILTERS.map((c) => (
            <label
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                cursor: "pointer",
                marginBottom: 6,
              }}
            >
              <input
                type="radio"
                name="category-filter"
                checked={currentCategory === c}
                onChange={() =>
                  updateParam("category", currentCategory === c ? "" : c)
                }
                style={{ accentColor: "var(--red)" }}
              />
              {c}
            </label>
          ))}
        </FilterGroup>

        <button
          type="button"
          onClick={clearFilters}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            color: "var(--red)",
            letterSpacing: 1,
            textTransform: "uppercase",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            marginTop: 16,
          }}
        >
          CLEAR ALL FILTERS
        </button>
      </aside>

      {/* ─── MAIN ─── */}
      <div style={{ padding: "28px 32px" }}>
        {/* Sort bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            borderBottom: "2px solid var(--ink)",
            paddingBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "var(--muted)",
            }}
          >
            // {collection.products.nodes.length} products
          </span>

          <select
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            style={{
              background: "transparent",
              border: "1px solid var(--mid)",
              borderRadius: 0,
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              padding: "6px 12px",
              color: "var(--ink)",
              cursor: "pointer",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Products grid with pagination */}
        <Pagination connection={collection.products}>
          {({ nodes, NextLink, PreviousLink, isLoading }) => (
            <>
              <PreviousLink>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
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
                      fontFamily: "'Space Mono', monospace",
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
    <div style={{ marginBottom: 20 }}>
      <h3
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "var(--muted)",
          borderBottom: "1px solid var(--mid)",
          paddingBottom: 6,
          marginBottom: 10,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
