import { useEffect, useState } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  useRouteError,
  isRouteErrorResponse,
  data,
  type MetaFunction,
  type LinksFunction,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getCart, setCartIdHeader } from "~/lib/cart.server";
import { Layout } from "~/components/Layout";
import stylesheet from "~/styles/app.css?url";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Inter:wght@400;500;600&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export const meta: MetaFunction = () => [
  { title: "MetalPosters — Premium Metal Prints" },
  {
    name: "description",
    content:
      "Premium aluminium posters. HD prints on brushed metal. No fading. No warping. Ships worldwide.",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const cartData = await getCart(request);
    const headers = cartData?.id ? setCartIdHeader(cartData.id) : new Headers();
    return data({ cart: cartData }, { headers });
  } catch (e: any) {
    console.error("Root loader error:", e.message);
    return { cart: null };
  }
}

export function useRootLoaderData() {
  return useRouteLoaderData<typeof loader>("root");
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Small delay so the animation is visible
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* Preloader */}
        <div
          className="preloader"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#1E1E1E",
            transition: "opacity 0.5s ease, visibility 0.5s ease",
            opacity: loaded ? 0 : 1,
            visibility: loaded ? "hidden" : "visible",
            pointerEvents: loaded ? "none" : "auto",
          }}
        >
          {/* Copper bar animation */}
          <div
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 6,
              color: "#B87333",
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            METAL<span style={{ color: "#D9D9D9" }}>POSTERS</span>
          </div>
          <div
            style={{
              width: 120,
              height: 2,
              background: "#2B2B2B",
              overflow: "hidden",
              borderRadius: 1,
            }}
          >
            <div className="preloader-bar" />
          </div>
        </div>

        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let status = 500;
  let message = "Something went wrong.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = typeof error.data === "string" ? error.data : error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "'Inter', sans-serif",
            background: "#1E1E1E",
          }}
        >
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {status}
          </h1>
          <p
            style={{
              color: "#7A7A7A",
              marginTop: 12,
              maxWidth: 500,
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            {message}
          </p>
          <a
            href="/"
            style={{
              marginTop: 24,
              background: "var(--copper, #B87333)",
              color: "#fff",
              padding: "12px 28px",
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase" as const,
              textDecoration: "none",
            }}
          >
            GO HOME
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
