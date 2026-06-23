// Shopify Storefront API client — ready for credentials.
// To activate: set REACT_APP_SHOPIFY_DOMAIN and REACT_APP_SHOPIFY_TOKEN in /app/frontend/.env
// and swap api.checkout() to call shopifyCheckout() in the cart flow.

const DOMAIN = process.env.REACT_APP_SHOPIFY_DOMAIN;
const TOKEN = process.env.REACT_APP_SHOPIFY_TOKEN;

export const isShopifyConfigured = Boolean(DOMAIN && TOKEN);

async function storefront(query, variables = {}) {
  if (!isShopifyConfigured) throw new Error("Shopify Storefront API not configured");
  const res = await fetch(`https://${DOMAIN}/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export async function shopifyCheckout(lines) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }`;
  const data = await storefront(query, {
    input: {
      lines: lines.map((l) => ({ quantity: l.quantity, merchandiseId: l.variant_id })),
    },
  });
  return data.cartCreate.cart.checkoutUrl;
}
