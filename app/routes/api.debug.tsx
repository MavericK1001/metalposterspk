import type { LoaderFunctionArgs } from "react-router";
import { createContext } from "~/lib/hydrogen.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const env = {
    PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN ?? "(NOT SET)",
    PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN
      ? `${process.env.PUBLIC_STOREFRONT_API_TOKEN.slice(0, 6)}...(${process.env.PUBLIC_STOREFRONT_API_TOKEN.length} chars)`
      : "(NOT SET)",
    PUBLIC_STOREFRONT_API_VERSION:
      process.env.PUBLIC_STOREFRONT_API_VERSION ?? "(NOT SET)",
    SESSION_SECRET: process.env.SESSION_SECRET ? "set" : "(NOT SET)",
  };

  let apiTest: any;
  try {
    const { storefront } = createContext(request);
    const result = await storefront.query(
      `#graphql
      query TestQuery {
        shop { name }
        collections(first: 5) { nodes { handle title } }
      }`,
    );
    apiTest = result;
  } catch (e: any) {
    apiTest = { error: e.message };
  }

  return new Response(
    JSON.stringify({ env, apiTest }, null, 2),
    { headers: { "Content-Type": "application/json" } },
  );
}
