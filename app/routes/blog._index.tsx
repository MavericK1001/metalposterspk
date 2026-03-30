import { Link } from "react-router";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Blog — MetalPosters Pakistan | Metal Print Tips & Inspiration" },
  {
    name: "description",
    content:
      "Discover metal poster tips, wall art inspiration, and home décor ideas. Learn about aluminium prints, magnetic mounting, and more from MetalPosters Pakistan.",
  },
];

const BLOG_POSTS = [
  {
    slug: "why-metal-posters-beat-framed-prints",
    title: "Why Metal Posters Beat Traditional Framed Prints",
    excerpt:
      "Discover why HD aluminium prints outlast glass frames — no fading, no warping, and a modern look that lasts a lifetime.",
    date: "2025-06-01",
    readTime: "4 min read",
    category: "Guides",
  },
  {
    slug: "how-to-hang-metal-posters-without-drilling",
    title: "How to Hang Metal Posters Without Drilling",
    excerpt:
      "Our magnetic mounting system lets you swap art in seconds. Here's a step‑by‑step guide to damage‑free installation.",
    date: "2025-05-20",
    readTime: "3 min read",
    category: "How‑To",
  },
  {
    slug: "top-10-music-posters-for-your-studio",
    title: "Top 10 Music Metal Posters for Your Studio",
    excerpt:
      "From Pink Floyd to Daft Punk — curate the perfect studio wall with our best‑selling music collection on brushed aluminium.",
    date: "2025-05-10",
    readTime: "5 min read",
    category: "Inspiration",
  },
  {
    slug: "metal-poster-care-guide",
    title: "Metal Poster Care Guide: Keep Your Prints Looking New",
    excerpt:
      "Aluminium prints are virtually maintenance-free, but a few simple tips will keep them pristine for decades.",
    date: "2025-04-28",
    readTime: "3 min read",
    category: "Guides",
  },
  {
    slug: "best-wall-art-ideas-for-small-rooms",
    title: "Best Wall Art Ideas for Small Rooms in Pakistan",
    excerpt:
      "Transform compact spaces with the right sizes, layouts, and colours. Metal posters add depth without bulk.",
    date: "2025-04-15",
    readTime: "4 min read",
    category: "Inspiration",
  },
  {
    slug: "brushed-vs-gloss-finish",
    title: "Brushed vs Gloss Finish: Which Metal Poster Is Right for You?",
    excerpt:
      "Compare the warm industrial look of brushed aluminium against the vibrant pop of high-gloss — with side-by-side photos.",
    date: "2025-04-01",
    readTime: "3 min read",
    category: "Guides",
  },
];

export default function BlogIndex() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 20px" }}>
      {/* Header */}
      <header style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          BLOG
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            color: "var(--muted)",
            lineHeight: 1.6,
          }}
        >
          Tips, inspiration, and everything metal posters. Learn how to style
          your walls and get the most out of aluminium prints.
        </p>
      </header>

      {/* Posts grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 28,
        }}
      >
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            style={{
              background: "var(--card)",
              borderRadius: 4,
              overflow: "hidden",
              transition: "transform 0.15s",
            }}
          >
            {/* Placeholder image area */}
            <div
              style={{
                height: 160,
                background:
                  "linear-gradient(135deg, var(--card) 0%, #333 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--copper)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {post.category}
              </span>
            </div>

            <div style={{ padding: "20px 24px 24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    color: "var(--muted)",
                  }}
                >
                  {new Date(post.date).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    color: "var(--muted)",
                  }}
                >
                  {post.readTime}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  marginBottom: 10,
                }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  style={{
                    color: "var(--steel)",
                    textDecoration: "none",
                  }}
                >
                  {post.title}
                </Link>
              </h2>

              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                {post.excerpt}
              </p>

              <Link
                to={`/blog/${post.slug}`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--copper)",
                  textDecoration: "none",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                READ MORE →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* SEO content */}
      <section style={{ marginTop: 64, borderTop: "1px solid #333", paddingTop: 32 }}>
        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          About MetalPosters Pakistan
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: "var(--muted)",
            lineHeight: 1.8,
            maxWidth: 700,
          }}
        >
          MetalPosters is Pakistan&rsquo;s first dedicated metal wall art brand. We
          print HD images directly onto brushed aluminium using dye‑sublimation
          technology — resulting in vibrant, rust‑proof prints that last a lifetime.
          Our magnetic mounting system means you can swap designs in seconds, with zero
          wall damage. Browse our collections of music, movie, sports, and nature
          posters, or order a custom print from any image you love.
        </p>
      </section>
    </div>
  );
}
