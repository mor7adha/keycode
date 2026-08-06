import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

const STORE_NAME = "keycode-catalog";
const CATALOG_KEY = "products";
const FALLBACK_PASSWORD_HASH = "ddcbe63943fd257b68e30efe4d051a5127f2b32cf99725da5a663bb8f9cd7e7a";

function catalogStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

function isAuthorized(request) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const suppliedPassword = request.headers.get("x-admin-password") || "";
  if (!suppliedPassword) return false;
  if (configuredPassword) {
    const supplied = Buffer.from(suppliedPassword);
    const configured = Buffer.from(configuredPassword);
    return supplied.length === configured.length && timingSafeEqual(supplied, configured);
  }
  const suppliedHash = createHash("sha256").update(suppliedPassword).digest("hex");
  return timingSafeEqual(Buffer.from(suppliedHash), Buffer.from(FALLBACK_PASSWORD_HASH));
}

export default async function handler(request) {
  try {
    if (request.method === "GET") {
      const products = await catalogStore().get(CATALOG_KEY, { type: "json" });
      return json({ products: Array.isArray(products) ? products : null });
    }

    if (request.method === "POST") {
      if (!isAuthorized(request)) return json({ error: "بيانات الدخول غير صحيحة" }, 401);
      return json({ authenticated: true });
    }

    if (request.method === "PUT") {
      if (!isAuthorized(request)) return json({ error: "غير مصرح" }, 401);
      const body = await request.json();
      if (!Array.isArray(body.products)) return json({ error: "بيانات المنتجات غير صالحة" }, 400);
      if (body.products.length > 500) return json({ error: "عدد المنتجات أكبر من الحد المسموح" }, 400);
      await catalogStore().setJSON(CATALOG_KEY, body.products);
      return json({ saved: true, count: body.products.length, updatedAt: new Date().toISOString() });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("Products function failed", error);
    return json({ error: "تعذر الوصول إلى مخزن المنتجات" }, 500);
  }
}

export const config = { path: "/api/products" };
