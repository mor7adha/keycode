import { getStore } from "@netlify/blobs";
import { createHash, scryptSync, timingSafeEqual } from "node:crypto";
import { defaultProjects } from "../../portfolio-data.js";

const STORE_NAME = "keycode-catalog";
const PROJECTS_KEY = "portfolio-projects";
const CREDENTIALS_KEY = "admin-credentials";
const DEFAULT_USERNAME = "admin";
const FALLBACK_PASSWORD_HASH = "ddcbe63943fd257b68e30efe4d051a5127f2b32cf99725da5a663bb8f9cd7e7a";

function store() {
    return getStore({ name: STORE_NAME, consistency: "strong" });
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
            "x-content-type-options": "nosniff"
        }
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

async function isAuthorized(request) {
    const username = request.headers.get("x-admin-username") || DEFAULT_USERNAME;
    const password = request.headers.get("x-admin-password") || "";
    if (!password) return false;

    const credentials = await store().get(CREDENTIALS_KEY, { type: "json" });
    if (credentials) {
        if (!safeEqual(username, credentials.username)) return false;
        return safeEqual(derivePasswordHash(password, credentials.salt), credentials.passwordHash);
    }

    if (!safeEqual(username, DEFAULT_USERNAME)) return false;
    const configuredPassword = process.env.ADMIN_PASSWORD;
    if (configuredPassword) return safeEqual(password, configuredPassword);
    return safeEqual(createHash("sha256").update(password).digest("hex"), FALLBACK_PASSWORD_HASH);
}

function validateProject(input, index) {
    if (!input || typeof input !== "object") throw new Error(`المشروع رقم ${index + 1} غير صالح`);
    const limits = {
        id: 100,
        title: 100,
        title_en: 100,
        description: 3000,
        description_en: 3000,
        category: 60,
        category_en: 60,
        tags: 200,
        tags_en: 200,
        year: 4,
        url: 2000,
        image: 2800000
    };
    const project = {};
    for (const [key, limit] of Object.entries(limits)) {
        if (typeof input[key] !== "string") project[key] = "";
        else project[key] = input[key].trim();
        if (project[key].length > limit) throw new Error(`أحد حقول المشروع رقم ${index + 1} يتجاوز الحد المسموح`);
    }
    if (!project.id || !project.title || !project.description || !project.category) {
        throw new Error(`أكمل اسم ووصف وتصنيف المشروع رقم ${index + 1}`);
    }
    if (project.year && !/^\d{4}$/.test(project.year)) throw new Error("سنة المشروع غير صالحة");
    if (project.url) {
        const url = new URL(project.url);
        if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("رابط المشروع غير صالح");
    }
    if (project.image && !project.image.startsWith("data:image/") && !project.image.startsWith("/")) {
        throw new Error("صورة المشروع غير صالحة");
    }
    project.featured = input.featured === true;
    return project;
}

export default async function handler(request) {
    try {
        if (request.method === "GET") {
            const projects = await store().get(PROJECTS_KEY, { type: "json" });
            return json({ projects: Array.isArray(projects) ? projects : defaultProjects });
        }

        if (request.method === "POST") {
            if (!await isAuthorized(request)) return json({ error: "بيانات الدخول غير صحيحة" }, 401);
            return json({ authenticated: true, username: request.headers.get("x-admin-username") || DEFAULT_USERNAME });
        }

        if (request.method === "PUT") {
            if (!await isAuthorized(request)) return json({ error: "غير مصرح" }, 401);
            const body = await request.json();
            if (!Array.isArray(body.projects) || body.projects.length > 200) return json({ error: "بيانات الأعمال غير صالحة" }, 400);
            const projects = body.projects.map(validateProject);
            if (new Set(projects.map(project => project.id)).size !== projects.length) return json({ error: "معرّفات المشاريع مكررة" }, 400);
            await store().setJSON(PROJECTS_KEY, projects);
            return json({ saved: true, count: projects.length, updatedAt: new Date().toISOString() });
        }

        return json({ error: "Method not allowed" }, 405);
    } catch (error) {
        console.error("Projects function failed", error);
        const known = error instanceof Error && /المشروع|الحقل|رابط|صورة|سنة|أكمل/.test(error.message);
        return json({ error: known ? error.message : "تعذر الوصول إلى مخزن الأعمال" }, known ? 400 : 500);
    }
}

export const config = { path: "/api/projects" };
