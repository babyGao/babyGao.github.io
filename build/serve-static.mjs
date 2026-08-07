/**
 * 在本地按 GitHub Pages 的规则伺服 out/ 目录，用来发布前验收。
 *
 * 和 Pages 行为对齐：目录取 index.html，找不到的路径发 404.html。
 * 用法：npm run preview:static   （先跑过 npm run export）
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const port = Number(process.env.PORT ?? 5000);

if (!existsSync(root)) {
  console.error("out/ 还不存在，先跑 npm run export");
  process.exit(1);
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  // 挡住 ../ 之类的越界访问
  const target = path.join(root, path.normalize(clean).replace(/^(\.\.[/\\])+/, ""));
  if (!target.startsWith(root)) return null;

  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      const index = path.join(target, "index.html");
      return existsSync(index) ? index : null;
    }
    return target;
  } catch {
    if (!path.extname(target)) {
      const index = path.join(target, "index.html");
      if (existsSync(index)) return index;
    }
    return null;
  }
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? "/");

  if (!file) {
    const notFound = path.join(root, "404.html");
    if (existsSync(notFound)) {
      res.writeHead(404, { "content-type": TYPES[".html"] });
      res.end(await readFile(notFound));
    } else {
      res.writeHead(404).end("Not found");
    }
    return;
  }

  res.writeHead(200, {
    "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
  });
  res.end(await readFile(file));
}).listen(port, () => {
  console.log(`静态预览 http://localhost:${port}  （按 GitHub Pages 规则伺服 out/）`);
});
