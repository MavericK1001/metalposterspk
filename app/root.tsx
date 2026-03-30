import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  type MetaFunction,
  type LinksFunction,
} from "react-router";
import type { LoaderFunctionArgs } from "react-router";
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
    href: "https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:wght@400;700&display=swap",
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

export async function loader({ context }: LoaderFunctionArgs) {
  const cart = await context.cart.get();
  return { cart };
}

export function useRootLoaderData() {
  return useRouteLoaderData<typeof loader>("root");
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
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
            fontFamily: "'Space Mono', monospace",
            background: "#F5F0E8",
          }}
        >
          <h1
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: 48,
              letterSpacing: 2,
            }}
          >
            OOPS
          </h1>
          <p style={{ color: "#7A7570", marginTop: 12 }}>
            Something went wrong.
          </p>
          <a
            href="/"
            style={{
              marginTop: 24,
              background: "#D63B2F",
              color: "#fff",
              padding: "12px 28px",
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase" as const,
              textDecoration: "none",
              fontWeight: 700,
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
