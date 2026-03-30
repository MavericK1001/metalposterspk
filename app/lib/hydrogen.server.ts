import {
  createStorefrontClient,
  createCartHandler,
  cartGetIdDefault,
  cartSetIdDefault,
} from '@shopify/hydrogen';

export function createContext(request: Request) {
  const storeDomain = process.env.PUBLIC_STORE_DOMAIN;
  const storefrontToken = process.env.PUBLIC_STOREFRONT_API_TOKEN;

  if (!storeDomain || !storefrontToken) {
    throw new Error(
      `Missing Storefront API env vars. ` +
      `PUBLIC_STORE_DOMAIN=${storeDomain ? 'set' : 'MISSING'}, ` +
      `PUBLIC_STOREFRONT_API_TOKEN=${storefrontToken ? 'set' : 'MISSING'}. ` +
      `Set these in your Vercel project settings and redeploy.`
    );
  }

  // Ensure domain has https:// prefix
  const fullDomain = storeDomain.startsWith('http')
    ? storeDomain
    : `https://${storeDomain}`;

  const env = {
    PUBLIC_STORE_DOMAIN: fullDomain,
    PUBLIC_STOREFRONT_API_TOKEN: storefrontToken,
    PUBLIC_STOREFRONT_API_VERSION:
      process.env.PUBLIC_STOREFRONT_API_VERSION || '2025-01',
    SESSION_SECRET: process.env.SESSION_SECRET || '',
  };

  const {storefront} = createStorefrontClient({
    publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    storeDomain: env.PUBLIC_STORE_DOMAIN,
    storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION,
    storefrontHeaders: {
      requestGroupId: request.headers.get('request-id'),
      buyerIp: request.headers.get('x-forwarded-for'),
      buyerIpSig: null,
      cookie: request.headers.get('cookie'),
      purpose: request.headers.get('purpose'),
    },
  });

  const cart = createCartHandler({
    storefront,
    getCartId: cartGetIdDefault(request.headers),
    setCartId: cartSetIdDefault(),
  });

  return {storefront, cart, env};
}
