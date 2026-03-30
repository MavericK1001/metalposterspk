import {
  createStorefrontClient,
  createCartHandler,
  cartGetIdDefault,
  cartSetIdDefault,
} from '@shopify/hydrogen';

export function createContext(request: Request) {
  const env = {
    PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN!,
    PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN!,
    PUBLIC_STOREFRONT_API_VERSION:
      process.env.PUBLIC_STOREFRONT_API_VERSION || '2025-01',
    SESSION_SECRET: process.env.SESSION_SECRET!,
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
