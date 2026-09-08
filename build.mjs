import { copyFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const output = resolve("dist");
const publicFiles = [
    "index.html",
    "works.html",
    "admin.html",
    "works-admin.html",
    "style.css",
    "works.css",
    "admin.css",
    "works-admin.css",
    "app.js",
    "admin.js",
    "works.js",
    "works-admin.js",
    "portfolio-data.js",
    "portfolio-preview.js",
    "logo.png",
    "logo2.png",
    "portfolio-ieee.png",
    "robots.txt",
    "sitemap.xml"
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all(publicFiles.map(file => copyFile(resolve(file), resolve(output, file))));
console.log(`Prepared ${publicFiles.length} public files in dist.`);
