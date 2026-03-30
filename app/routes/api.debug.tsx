import type { LoaderFunctionArgs } from "react-router";
import { createContext } from "~/lib/hydrogen.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const env = {
    PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN ?? "(not set)",
    PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN
      ? `${process.env.PUBLIC_STOREFRONT_API_TOKEN.slice(0, 6)}...`
      : "(not set)",
    PUBLIC_STOREFRONT_API_VERSION:
      process.env.PUBLIC_STOREFRONT_API_VERSION ?? "(not set)",
    SESSION_SECRET: process.env.SESSION_SECRET ? "set" : "(not set)",
  };

  let apiTest: string;
  try {
    const { storefront } = createContext(request);
    const result = await storefront.query(
      `#graphql
      query TestQuery {
        shop { name }
        collections(first: 5) { nodes { handle title } }
      }`,
    );
    apiTest = JSON.stringify(result, null, 2);
  } catch (e: any) {
    apiTest = `ERROR: ${e.message}\n\n${e.stack ?? ""}`;
  }

  return new Response(
    JSON.stringify({ env, apiTest: JSON.parse(apiTest) }, null, 2),
    { headers: { "Content-Type": "application/json" } },
  );
}
