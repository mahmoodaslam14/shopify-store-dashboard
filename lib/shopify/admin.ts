import { env } from "@/lib/env";

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

async function adminGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const shop = env().SHOPIFY_SHOP;
  const token = env().SHOPIFY_ACCESS_TOKEN;
  const version = env().SHOPIFY_API_VERSION;
  if (!shop || !token) {
    throw new Error("SHOPIFY_SHOP and SHOPIFY_ACCESS_TOKEN must be configured");
  }
  const url = `https://${shop}/admin/api/${version}/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as GraphQLResponse<T>;
  if (!res.ok) {
    throw new Error(`Shopify GraphQL HTTP ${res.status}`);
  }
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) throw new Error("Empty Shopify GraphQL response");
  return json.data;
}

export async function findCustomerByEmail(email: string) {
  const query = `#graphql
    query CustomerByEmail($q: String!) {
      customers(first: 1, query: $q) {
        edges { node { id legacyResourceId email } }
      }
    }
  `;
  const data = await adminGraphql<{
    customers: {
      edges: Array<{
        node: { id: string; legacyResourceId: string; email: string | null };
      }>;
    };
  }>(query, { q: `email:${email}` });
  return data.customers.edges[0]?.node ?? null;
}

export async function createBasicDiscountCode(params: {
  title: string;
  code: string;
  amount: string;
  customerGid?: string;
  endsAtIso: string;
}) {
  const customerSelection = params.customerGid
    ? { customers: { add: [params.customerGid] } }
    : { all: true };

  const mutation = `#graphql
    mutation CreateCashbackDiscount($input: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $input) {
        codeDiscountNode { id }
        userErrors { field message }
      }
    }
  `;

  const input: Record<string, unknown> = {
    title: params.title,
    code: params.code,
    startsAt: new Date().toISOString(),
    endsAt: params.endsAtIso,
    customerSelection,
    customerGets: {
      value: {
        discountAmount: {
          amount: params.amount,
          appliesOnEachItem: false,
        },
      },
      items: { all: true },
    },
    appliesOncePerCustomer: true,
    usageLimit: 1,
  };

  const data = await adminGraphql<{
    discountCodeBasicCreate: {
      codeDiscountNode: { id: string } | null;
      userErrors: { field: string[] | null; message: string }[];
    };
  }>(mutation, { input });

  const errs = data.discountCodeBasicCreate.userErrors;
  if (errs?.length) {
    throw new Error(errs.map((e) => e.message).join("; "));
  }
  const id = data.discountCodeBasicCreate.codeDiscountNode?.id;
  if (!id) throw new Error("Shopify did not return discount id");
  return { shopifyDiscountId: id };
}

export async function getShopCurrency(): Promise<string> {
  const query = `#graphql
    query ShopCurrency { shop { currencyCode } }
  `;
  const data = await adminGraphql<{ shop: { currencyCode: string } }>(query);
  return data.shop.currencyCode;
}
