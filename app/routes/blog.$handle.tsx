import { Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { data } from "react-router";

const BLOG_CONTENT: Record<
  string,
  { title: string; date: string; readTime: string; category: string; body: string }
> = {
  "why-metal-posters-beat-framed-prints": {
    title: "Why Metal Posters Beat Traditional Framed Prints",
    date: "2025-06-01",
    readTime: "4 min read",
    category: "Guides",
    body: `Traditional framed prints have been the go-to wall art for decades. But they come with problems: heavy glass that shatters, frames that warp in humidity, and prints that fade in sunlight.\n\nMetal posters solve every one of those issues.\n\n**Durability that lasts a lifetime.** Our aluminium prints use HD dye-sublimation — the image is infused directly into the metal surface. Unlike paper prints behind glass, there's nothing to yellow, peel, or fade. Your poster looks as vivid on day 1,000 as it did on day one.\n\n**Lightweight and damage-free mounting.** Each metal poster weighs a fraction of a framed print. Our magnetic mounting system means no nails, no drilling, and no drywall damage. Swap your art in seconds — perfect for renters.\n\n**Humidity and heat resistant.** Pakistan's climate can be brutal on traditional art. Aluminium doesn't warp, buckle, or attract mould. Whether it's a Lahore summer or a Karachi monsoon season, your poster stays perfect.\n\n**A modern aesthetic.** The brushed aluminium surface gives every image an industrial, premium look that glass simply can't replicate. Blacks are deeper, colours are more vibrant, and the metallic undertone adds dimension.\n\nReady to make the switch? Browse our full collection starting at ₨ 5,000.`,
  },
  "how-to-hang-metal-posters-without-drilling": {
    title: "How to Hang Metal Posters Without Drilling",
    date: "2025-05-20",
    readTime: "3 min read",
    category: "How‑To",
    body: `Every MetalPosters order ships with our magnetic mounting kit. Here's how to get your poster on the wall in under two minutes — no tools required.\n\n**Step 1: Choose your spot.** Hold the poster against the wall and eyeball the position. Use a pencil to lightly mark the top corners.\n\n**Step 2: Attach the adhesive mounts.** Peel the backing off the magnetic mounting strips. Press them firmly onto the wall at your marked spots. Wait 60 seconds for the adhesive to bond.\n\n**Step 3: Click the poster in place.** Align the poster's built-in magnetic strips with the wall mounts. You'll feel it click into position. Done.\n\n**Want to change your art?** Simply pull the poster off the magnetic mounts and click a new one in its place. The wall mounts stay put and work with any MetalPosters print.\n\n**Tips for best results:**\n- Clean the wall surface with a dry cloth before attaching mounts\n- Avoid textured wallpaper — smooth paint or tile works best\n- For heavy XL prints, use all four mounting points\n\nOrder any poster and get the magnetic mounting kit included free.`,
  },
  "top-10-music-posters-for-your-studio": {
    title: "Top 10 Music Metal Posters for Your Studio",
    date: "2025-05-10",
    readTime: "5 min read",
    category: "Inspiration",
    body: `Your music studio deserves wall art that matches the energy of your sound. Here are our top 10 best-selling music posters on brushed aluminium.\n\nFrom classic album art reimagined on metal to iconic concert photography, each poster in our music collection is printed at 300 DPI on premium brushed aluminium.\n\nThe metallic surface adds an extra layer of depth to music artwork — neon colours pop against the brushed background, and dark album covers gain a moody, industrial edge.\n\n**Why musicians love metal posters:**\n- Sound-dampening: the aluminium surface absorbs more reflection than glass\n- Vibration-proof: magnetic mounts hold firm even with heavy bass\n- Swap-ready: change your inspiration wall for every new project\n\nBrowse the full music collection and find the perfect piece for your creative space.`,
  },
  "metal-poster-care-guide": {
    title: "Metal Poster Care Guide: Keep Your Prints Looking New",
    date: "2025-04-28",
    readTime: "3 min read",
    category: "Guides",
    body: `One of the biggest advantages of aluminium prints is how little maintenance they need. But a few simple habits will keep them pristine for decades.\n\n**Dusting.** Use a dry microfibre cloth to gently wipe the surface every few weeks. That's genuinely all most posters need.\n\n**Fingerprints and smudges.** Dampen a soft cloth with water (no chemicals) and wipe gently. For stubborn marks, a tiny drop of dish soap on the cloth works perfectly.\n\n**What to avoid:**\n- Abrasive cloths or paper towels (they can micro-scratch the surface)\n- Chemical cleaners, acetone, or alcohol-based sprays\n- Direct contact with sharp objects\n\n**Sunlight.** Unlike paper prints, our dye-sublimation process makes the image UV-resistant. You can hang your poster in direct sunlight without worrying about fading.\n\n**Humidity.** Aluminium is naturally rust-proof. Bathrooms, kitchens, covered balconies — all fair game.\n\nWith zero maintenance, your MetalPosters print will outlast any framed art in your home.`,
  },
  "best-wall-art-ideas-for-small-rooms": {
    title: "Best Wall Art Ideas for Small Rooms in Pakistan",
    date: "2025-04-15",
    readTime: "4 min read",
    category: "Inspiration",
    body: `Small rooms are the norm in Pakistani apartments and urban homes. Here's how to use wall art strategically to make compact spaces feel bigger and more personal.\n\n**Go vertical.** A tall, narrow metal poster draws the eye upward and creates the illusion of height. Our Medium (30×45 cm) size is perfect for this.\n\n**Use a gallery wall.** Three Small (20×30 cm) posters arranged in a column or staggered pattern add personality without overwhelming the space.\n\n**Choose lighter imagery.** Nature scenes, abstract pastels, and architectural photos with plenty of negative space make rooms feel airy.\n\n**Skip the frames.** Metal posters sit flush against the wall with just a few millimetres of depth. No bulky frames eating into your visual space.\n\n**Magnetic swapping = seasonal refresh.** Change your art with the seasons. Cool tones for summer, warm earth tones for winter — all without new nail holes.\n\nExplore our Nature and Abstract collections for small-room-friendly designs.`,
  },
  "brushed-vs-gloss-finish": {
    title: "Brushed vs Gloss Finish: Which Metal Poster Is Right for You?",
    date: "2025-04-01",
    readTime: "3 min read",
    category: "Guides",
    body: `We offer two finish options on every metal poster. Here's how to choose between them.\n\n**Brushed Aluminium (our default)**\n- Subtle metallic texture visible through lighter areas of the image\n- Warm, industrial aesthetic\n- Reduces glare — great for rooms with lots of natural light\n- Best for: photography, portraits, nature scenes, minimalist designs\n\n**High-Gloss**\n- Mirror-smooth surface with maximum colour saturation\n- Colours pop more vibrantly, especially neons and deep blacks\n- Slight reflection — works best on walls facing away from windows\n- Best for: comic art, music posters, abstract neon designs, bold graphics\n\n**Can't decide?** Our best-seller is brushed aluminium — it's the signature MetalPosters look that customers love. But if you want maximum colour punch for a dark room or studio, go gloss.\n\nBoth finishes use the same HD dye-sublimation process and are equally durable, UV-resistant, and rust-proof.`,
  },
};

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  const post = loaderData?.post;
  if (!post) return [{ title: "Post Not Found — MetalPosters Blog" }];
  return [
    { title: `${post.title} — MetalPosters Blog` },
    { name: "description", content: post.body.slice(0, 155) + "…" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const handle = params.handle;
  if (!handle || !BLOG_CONTENT[handle]) {
    throw new Response("Not found", { status: 404 });
  }
  return data({ post: BLOG_CONTENT[handle], handle });
}

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px" }}>
      {/* Back link */}
      <Link
        to="/blog"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          color: "var(--copper)",
          textDecoration: "none",
          letterSpacing: 1,
          marginBottom: 24,
          display: "inline-block",
        }}
      >
        ← BACK TO BLOG
      </Link>

      {/* Category & date */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--copper)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {post.category}
        </span>
        <span style={{ color: "var(--muted)", fontSize: 11 }}>•</span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: "var(--muted)",
          }}
        >
          {new Date(post.date).toLocaleDateString("en-PK", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span style={{ color: "var(--muted)", fontSize: 11 }}>•</span>
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

      {/* Title */}
      <h1
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 32,
        }}
      >
        {post.title}
      </h1>

      {/* Body */}
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          lineHeight: 1.9,
          color: "var(--steel)",
        }}
      >
        {post.body.split("\n\n").map((para, i) => {
          if (para.startsWith("**") && para.endsWith("**")) {
            const text = para.slice(2, -2);
            return (
              <h3
                key={i}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  margin: "28px 0 8px",
                }}
              >
                {text}
              </h3>
            );
          }

          const parts = para.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i} style={{ marginBottom: 16 }}>
              {parts.map((part, j) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <strong key={j} style={{ fontWeight: 600 }}>
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return <span key={j}>{part}</span>;
              })}
            </p>
          );
        })}
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 48,
          padding: 32,
          background: "var(--card)",
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Ready to upgrade your walls?
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: "var(--muted)",
            marginBottom: 20,
          }}
        >
          Browse our full collection — starting at ₨ 5,000 with free magnetic
          mounting included.
        </p>
        <Link
          to="/collections/all"
          className="btn-copper"
          style={{
            display: "inline-block",
            padding: "14px 36px",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            textDecoration: "none",
            color: "white",
            borderRadius: 2,
          }}
        >
          SHOP ALL POSTERS
        </Link>
      </div>
    </div>
  );
}
