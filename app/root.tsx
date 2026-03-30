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
import { createContext } from "~/lib/hydrogen.server";
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

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const { cart } = createContext(request);
    const cartData = await cart.get();
    const headers = cart.setCartId(cartData?.id ?? '');
    return data({ cart: cartData }, { headers });
  } catch (e: any) {
    console.error('Root loader error:', e.message);
    return { cart: null };
  }
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
  const error = useRouteError();
  let status = 500;
  let message = 'Something went wrong.';

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = typeof error.data === 'string' ? error.data : error.statusText;
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
            {status}
          </h1>
          <p style={{ color: "#7A7570", marginTop: 12, maxWidth: 500, textAlign: 'center', padding: '0 20px' }}>
            {message}
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
