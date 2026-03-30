export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    productType
    tags
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 2) {
      nodes {
        url
        altText
        width
        height
      }
    }
    variants(first: 1) {
      nodes { id availableForSale quantityAvailable }
    }
  }
`;

export const PRODUCT_DETAIL_QUERY = `#graphql
  query ProductDetail($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id title description productType tags
      priceRange { minVariantPrice { amount currencyCode } }
      compareAtPriceRange { minVariantPrice { amount currencyCode } }
      images(first: 8) {
        nodes { url altText width height }
      }
      options { name values }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id availableForSale quantityAvailable
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
      }
      variants(first: 250) {
        nodes {
          id availableForSale quantityAvailable
          price { amount currencyCode }
          selectedOptions { name value }
        }
      }
      metafields(identifiers: [
        { namespace: "reviews", key: "rating" }
        { namespace: "reviews", key: "count" }
      ]) {
        value namespace key
      }
    }
  }
`;

export const HOMEPAGE_PRODUCTS_QUERY = `#graphql
  query HomepageProducts($count: Int!) {
    collection(handle: "bestsellers") {
      products(first: $count) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const HOMEPAGE_FALLBACK_QUERY = `#graphql
  query HomepageFallback($count: Int!) {
    collection(handle: "all") {
      products(first: $count) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $first: Int
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id title description handle
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        nodes { ...ProductCard }
        pageInfo { hasNextPage endCursor hasPreviousPage startCursor }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const RELATED_PRODUCTS_QUERY = `#graphql
  query RelatedProducts($productId: ID!, $count: Int!) {
    productRecommendations(productId: $productId) {
      ...ProductCard
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const SEARCH_QUERY = `#graphql
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      nodes {
        ... on Product {
          ...ProductCard
        }
      }
      totalCount
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;
