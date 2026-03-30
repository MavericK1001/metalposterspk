export const CART_QUERY = `#graphql
  query CartQuery($cartId: ID!) {
    cart(id: $cartId) {
      id checkoutUrl totalQuantity
      discountCodes { applicable code }
      lines(first: 100) {
        nodes {
          id quantity
          cost {
            totalAmount { amount currencyCode }
          }
          merchandise {
            ... on ProductVariant {
              id title
              image { url altText }
              price { amount currencyCode }
              selectedOptions { name value }
              product { title handle featuredImage { url altText } }
            }
          }
        }
      }
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
      }
    }
  }
`;

export const ADD_TO_CART = `#graphql
  mutation CartAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { id totalQuantity checkoutUrl }
    }
  }
`;

export const UPDATE_CART = `#graphql
  mutation CartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id totalQuantity checkoutUrl }
    }
  }
`;

export const REMOVE_FROM_CART = `#graphql
  mutation CartRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id totalQuantity checkoutUrl }
    }
  }
`;

export const DISCOUNT_CODES_UPDATE = `#graphql
  mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id totalQuantity checkoutUrl
        discountCodes { applicable code }
      }
      userErrors { field message }
    }
  }
`;
