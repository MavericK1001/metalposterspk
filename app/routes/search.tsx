import { useLoaderData, useSearchParams, Form } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { SEARCH_QUERY } from "~/graphql/ProductQuery";
import { ProductCard } from "~/components/ProductCard";
import { createContext } from "~/lib/hydrogen.server";

export const meta: MetaFunction = () => [{ title: "Search — MetalPosters" }];

export async function loader({ request }: LoaderFunctionArgs) {
  const { storefront } = createContext(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return { query: "", products: [], total: 0 };
  }

  const { search } = await storefront.query(SEARCH_QUERY, {
    variables: { query: q, first: 40 },
  });

  const products = search?.nodes ?? [];
  const total = search?.totalCount ?? 0;

  return { query: q, products, total };
}

export default function SearchPage() {
  const { query, products, total } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      {/* Search bar */}
      <div
        style={{
          background: "var(--ink)",
          padding: "28px 32px",
          marginBottom: 32,
        }}
      >
        <Form method="get" style={{ display: "flex", gap: 0 }}>
          <input
            name="q"
            type="text"
            defaultValue={query}
            placeholder="Search posters..."
            style={{
              flex: 1,
              background: "transparent",
              border: "1px solid var(--mid)",
              color: "white",
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              padding: "12px 16px",
              borderRadius: 0,
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              background: "var(--red)",
              color: "white",
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: 2,
              padding: "12px 28px",
              border: "none",
              borderRadius: 0,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            SEARCH
          </button>
        </Form>
      </div>

      {/* Results */}
      {query && (
        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "var(--muted)",
            }}
          >
            // {total} results for &ldquo;{query}&rdquo;
          </span>
        </div>
      )}

      {query && products.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: 28,
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            NO RESULTS FOUND
          </h2>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 20,
            }}
          >
            Try a different search term or browse our collections.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["Music", "Movies", "Sports", "Nature", "Abstract"].map((sug) => (
              <Form key={sug} method="get">
                <input type="hidden" name="q" value={sug} />
                <button
                  type="submit"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    letterSpacing: 1,
                    padding: "8px 18px",
                    border: "1px solid var(--mid)",
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: 0,
                  }}
                >
                  {sug.toUpperCase()}
                </button>
              </Form>
            ))}
          </div>
        </div>
      )}

      {!query && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: 28,
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            FIND YOUR POSTER
          </h2>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 20,
            }}
          >
            // type a keyword to search our full catalogue
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["Music", "Movies", "Sports", "Nature", "Abstract", "Custom"].map(
              (sug) => (
                <Form key={sug} method="get">
                  <input type="hidden" name="q" value={sug} />
                  <button
                    type="submit"
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 10,
                      letterSpacing: 1,
                      padding: "8px 18px",
                      border: "1px solid var(--mid)",
                      background: "transparent",
                      cursor: "pointer",
                      borderRadius: 0,
                    }}
                  >
                    {sug.toUpperCase()}
                  </button>
                </Form>
              ),
            )}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div
          className="product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
