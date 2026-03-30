import {
  createStorefrontClient,
  createCartHandler,
  cartGetIdDefault,
  cartSetIdDefault,
  createRequestHandler,
  type HydrogenEnv,
} from '@shopify/hydrogen';
import type {AppLoadContext} from 'react-router';

export interface Env extends HydrogenEnv {
  PUBLIC_STOREFRONT_API_VERSION: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    const waitUntil = executionContext.waitUntil.bind(executionContext);
    const cache = await caches.open('hydrogen');

    const {storefront} = createStorefrontClient({
      cache,
      waitUntil,
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      storeDomain: env.PUBLIC_STORE_DOMAIN,
      storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || '2025-01',
      storefrontHeaders: {
        requestGroupId: request.headers.get('request-id'),
        buyerIp: request.headers.get('oxygen-buyer-ip'),
        buyerIpSig: request.headers.get('oxygen-buyer-ip-sig'),
        cookie: request.headers.get('cookie'),
        purpose: request.headers.get('purpose'),
      },
    });

    const cart = createCartHandler({
      storefront,
      getCartId: cartGetIdDefault(request.headers),
      setCartId: cartSetIdDefault(),
    });

    const handleRequest = createRequestHandler({
      build: await import('./build/server/index.js' as string),
      getLoadContext: (): AppLoadContext => ({
        storefront,
        cart,
        env,
        waitUntil,
      }),
    });

    return handleRequest(request);
  },
};
