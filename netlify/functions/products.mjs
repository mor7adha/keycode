import { getStore } from "@netlify/blobs";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const STORE_NAME = "keycode-catalog";
const CATALOG_KEY = "products";
const CREDENTIALS_KEY = "admin-credentials";
const DEFAULT_USERNAME = "admin";
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

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function derivePasswordHash(password, salt) {
  return scryptSync(password, salt, 64).toString("hex");
}

async function storedCredentials() {
  const credentials = await catalogStore().get(CREDENTIALS_KEY, { type: "json" });
  if (credentials == null) return null;
  if (typeof credentials !== "object" || typeof credentials.username !== "string" || typeof credentials.salt !== "string" || typeof credentials.passwordHash !== "string") {
    throw new Error("Stored admin credentials are invalid");
  }
  return credentials;
}

async function isAuthorized(request) {
  const suppliedUsername = request.headers.get("x-admin-username") || DEFAULT_USERNAME;
  const suppliedPassword = request.headers.get("x-admin-password") || "";
  if (!suppliedPassword) return false;

  const credentials = await storedCredentials();
  if (credentials) {
    if (!safeEqual(suppliedUsername, credentials.username)) return false;
    const suppliedHash = derivePasswordHash(suppliedPassword, credentials.salt);
    return safeEqual(suppliedHash, credentials.passwordHash);
  }

  if (!safeEqual(suppliedUsername, DEFAULT_USERNAME)) return false;
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (configuredPassword) {
    return safeEqual(suppliedPassword, configuredPassword);
  }
  const suppliedHash = createHash("sha256").update(suppliedPassword).digest("hex");
  return safeEqual(suppliedHash, FALLBACK_PASSWORD_HASH);
}

export default async function handler(request) {
  try {
    if (request.method === "GET") {
      const products = await catalogStore().get(CATALOG_KEY, { type: "json" });
      return json({ products: Array.isArray(products) ? products : null });
    }

    if (request.method === "POST") {
      if (!await isAuthorized(request)) return json({ error: "بيانات الدخول غير صحيحة" }, 401);
      return json({ authenticated: true, username: request.headers.get("x-admin-username") || DEFAULT_USERNAME });
    }

    if (request.method === "PUT") {
      if (!await isAuthorized(request)) return json({ error: "غير مصرح" }, 401);
      const body = await request.json();
      if (!Array.isArray(body.products)) return json({ error: "بيانات المنتجات غير صالحة" }, 400);
      if (body.products.length > 500) return json({ error: "عدد المنتجات أكبر من الحد المسموح" }, 400);
      await catalogStore().setJSON(CATALOG_KEY, body.products);
      return json({ saved: true, count: body.products.length, updatedAt: new Date().toISOString() });
    }

    if (request.method === "PATCH") {
      if (!await isAuthorized(request)) return json({ error: "كلمة المرور الحالية غير صحيحة" }, 401);
      const body = await request.json();
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      if (!/^[A-Za-z0-9._-]{3,32}$/.test(username)) {
        return json({ error: "اسم المستخدم يجب أن يكون من 3 إلى 32 حرفًا إنجليزيًا أو رقمًا" }, 400);
      }
      if (password.length < 8 || password.length > 128) {
        return json({ error: "كلمة المرور يجب أن تكون بين 8 و128 حرفًا" }, 400);
      }
      const salt = randomBytes(16).toString("hex");
      await catalogStore().setJSON(CREDENTIALS_KEY, {
        version: 1,
        username,
        salt,
        passwordHash: derivePasswordHash(password, salt),
        updatedAt: new Date().toISOString()
      });
      return json({ updated: true, username });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("Products function failed", error);
    return json({ error: "تعذر الوصول إلى مخزن المنتجات" }, 500);
  }
}

export const config = { path: "/api/products" };
