/**
 * 把构建好的站点导出成纯静态文件，用来发 GitHub Pages。
 *
 * 为什么需要这一步：vinext 产出的是一个 Cloudflare Worker 包，`dist/` 里
 * 一个 .html 都没有，页面是请求进来时现渲染的。GitHub Pages 只会发静态文件，
 * 所以这里在本地把 worker 跑起来，把每个页面抓下来存成 html。
 *
 * 做法：
 *   1. 从 /zh 和 /en 出发，顺着页面里的站内链接爬完整站（新增内容自动被收录）
 *   2. 每个地址存成 <路径>/index.html
 *   3. 删掉 Next 的客户端脚本 —— 全站没有一个 "use client" 组件，
 *      不需要 hydration，去掉之后就是纯 HTML + CSS，链接走整页跳转
 *   4. 把 /_vinext/image?url=… 改回原图地址（静态托管没有那个优化端点）
 *   5. 生成 / 的语言跳转页，和 GitHub Pages 用的 404.html
 *   6. 拷 dist/client 与 public 里的静态资源
 *   7. 放一个 .nojekyll —— 否则 Jekyll 会吞掉 _vinext_fonts 这种下划线开头的目录，字体全 404
 *
 * 用法：
 *   node build/export-static.mjs                     # 发在域名根目录
 *   PAGES_BASE_PATH=/仓库名 node build/export-static.mjs   # 发在 user.github.io/仓库名 下
 */

import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const outDir = path.join(root, "out");

/**
 * 项目页要挂在子路径下时用，例如 "/portfolio-site"；根域名留空。
 *
 * Git Bash 会把 "/portfolio-site" 这种值当成路径转成 "D:/apps/Git/portfolio-site"，
 * 所以这里做一次归一化：只取最后一段，再补上开头的斜杠。
 * 想绕过转换也可以在命令前加 MSYS_NO_PATHCONV=1。
 */
const BASE_PATH = normalizeBasePath(process.env.PAGES_BASE_PATH);

function normalizeBasePath(raw) {
  if (!raw) return "";
  let value = raw.trim().replace(/\\/g, "/").replace(/\/+$/, "");
  if (!value) return "";
  if (/^[A-Za-z]:\//.test(value)) {
    // 被 Git Bash 转换过了，只保留最后一段
    value = value.slice(value.lastIndexOf("/") + 1);
  }
  value = value.replace(/^\/+/, "");
  return value ? `/${value}` : "";
}
/** 写进 canonical / og:url 的正式域名 */
const SITE_URL = (process.env.SITE_URL ?? "").replace(/\/+$/, "");

const worker = (await import(new URL("../dist/server/index.js", import.meta.url).href)).default;

/** 静态托管没有 Cloudflare 绑定，给个空壳；图片地址会被改写，走不到这里 */
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

async function render(pathname, headers = {}) {
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", host: "localhost", ...headers },
    }),
    env,
    ctx,
  );
}

/**
 * 页面后处理：
 * 去掉客户端脚本、把图片改回原图、给站内链接加上子路径前缀。
 */
function transform(html) {
  let out = html;

  // 1. 图片：/_vinext/image?url=%2Fart%2Fx.jpg&w=640&q=75  →  /art/x.jpg
  const unwrapImage = (value) =>
    value.replace(/\/_vinext\/image\?([^"'\s]+)/g, (whole, query) => {
      const params = new URLSearchParams(query.replace(/&amp;/g, "&"));
      const original = params.get("url");
      return original ? decodeURIComponent(original) : whole;
    });
  out = unwrapImage(out);

  // srcset 里同一张图会带多个宽度，去重后只留原图，免得浏览器重复下载
  out = out.replace(/\ssrcset="[^"]*"/g, "").replace(/\ssizes="[^"]*"/g, "");

  // 2. 删掉 Next 的客户端运行时。全站没有客户端组件，不需要 hydration；
  //    留着反而会让它去请求静态托管上并不存在的 RSC 数据。
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<link\b[^>]*\brel="preload"[^>]*\bas="script"[^>]*>/gi, "");

  // 3. 子路径部署时，把站内绝对地址统一加前缀。
  //    注意除了 href/src，还要管样式里的 url(/…)：字体就是这么引的，漏了会全部 404。
  if (BASE_PATH) out = addBasePath(out);

  // 4. canonical / og:url 换成正式域名
  if (SITE_URL) {
    out = out.replace(/https?:\/\/localhost(?::\d+)?/g, SITE_URL);
  }

  return out;
}

/**
 * 给所有站内绝对路径加上子路径前缀。
 * 覆盖 href="/…"、src="/…" 和 url(/…)（含带引号的写法）。
 * "//" 开头的是协议相对地址，指向站外，跳过。
 */
function addBasePath(text) {
  return text
    .replace(/(href|src)="\/(?!\/)/g, `$1="${BASE_PATH}/`)
    .replace(/url\(\s*(['"]?)\/(?!\/)/g, `url($1${BASE_PATH}/`);
}

/** 从 html 里挑出还没爬过的站内链接 */
function collectLinks(html) {
  const found = new Set();
  for (const match of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = match[1].replace(/\/$/, "") || "/";
    if (href.startsWith("//")) continue;
    // 静态资源不当页面爬
    if (/\.(png|jpe?g|svg|webp|ico|css|js|json|xml|txt|woff2?)$/i.test(href)) continue;
    if (href.startsWith("/_")) continue;
    found.add(href);
  }
  return found;
}

async function writePage(pathname, html) {
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  const dir = clean ? path.join(outDir, clean) : outDir;
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html, "utf8");
}

// ---------- 开工 ----------

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

// 1. 爬页面
const queue = ["/zh", "/en"];
const seen = new Set(queue);
const rendered = [];
const failed = [];

while (queue.length) {
  const pathname = queue.shift();
  const response = await render(pathname);

  if (response.status !== 200) {
    failed.push(`${pathname} → HTTP ${response.status}`);
    continue;
  }

  const raw = await response.text();

  // 先从原始 html 里收链接，再做改写：加了子路径前缀之后地址就不是 /zh/… 了，
  // 那时候再找链接会一条都找不到，爬虫会在种子页就停下。
  for (const link of collectLinks(raw)) {
    if (link === "/" || seen.has(link)) continue;
    seen.add(link);
    queue.push(link);
  }

  await writePage(pathname, transform(raw));
  rendered.push(pathname);
}

// 2. 根路径：静态托管没法读 Accept-Language，改成浏览器端判断
const zhHref = `${BASE_PATH}/zh`;
const enHref = `${BASE_PATH}/en`;
await writeFile(
  path.join(outDir, "index.html"),
  `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>高泽林的小屋</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${SITE_URL || ""}${zhHref}">
<meta http-equiv="refresh" content="0; url=${zhHref}">
<script>
  // 按浏览器语言挑一个版本；不是中文就去英文版
  var target = /^zh\\b/i.test(navigator.language || "") ? ${JSON.stringify(zhHref)} : ${JSON.stringify(enHref)};
  location.replace(target);
</script>
</head>
<body>
<p><a href="${zhHref}">中文</a> · <a href="${enHref}">English</a></p>
</body>
</html>
`,
  "utf8",
);

// 3. 404：GitHub Pages 找不到路径时会发这个文件
const notFound = await render("/zh/__definitely_missing__");
await writeFile(path.join(outDir, "404.html"), transform(await notFound.text()), "utf8");

// 4. 静态资源
if (existsSync(path.join(root, "dist/client"))) {
  await cp(path.join(root, "dist/client"), outDir, { recursive: true });
}
await cp(path.join(root, "public"), outDir, { recursive: true });

// 5. 拷进来的 css 里也有 url(/…)，子路径部署时同样要加前缀
if (BASE_PATH) {
  const assetsDir = path.join(outDir, "assets");
  if (existsSync(assetsDir)) {
    const { readdir } = await import("node:fs/promises");
    for (const name of await readdir(assetsDir)) {
      if (!name.endsWith(".css")) continue;
      const file = path.join(assetsDir, name);
      await writeFile(file, addBasePath(await readFile(file, "utf8")), "utf8");
    }
  }
}

// 6. 关掉 Jekyll。它会忽略下划线开头的目录，而字体正好在 assets/_vinext_fonts/ 下。
await writeFile(path.join(outDir, ".nojekyll"), "", "utf8");

// 7. 自定义域名：GitHub Pages 靠仓库里的 CNAME 文件认域名
if (process.env.PAGES_CNAME) {
  await writeFile(path.join(outDir, "CNAME"), `${process.env.PAGES_CNAME}\n`, "utf8");
}

// ---------- 自检 ----------

const sample = await readFile(path.join(outDir, "zh", "index.html"), "utf8");
const problems = [];
if (/<script/i.test(sample)) problems.push("首页仍残留 <script>");
if (/_vinext\/image/.test(sample)) problems.push("首页仍指向图片优化端点");
if (!existsSync(path.join(outDir, "art"))) problems.push("public/art 没拷进来");
if (!existsSync(path.join(outDir, "assets"))) problems.push("dist/client/assets 没拷进来");

console.log(`静态导出完成：${rendered.length} 个页面 → out/`);
console.log(`  ${rendered.sort().join("\n  ")}`);
if (BASE_PATH) console.log(`子路径前缀：${BASE_PATH}`);
if (SITE_URL) console.log(`正式域名：${SITE_URL}`);
if (failed.length) console.log(`\n抓取失败：\n  ${failed.join("\n  ")}`);
if (problems.length) {
  console.error(`\n自检没过：\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log("自检通过：无客户端脚本、图片指向原图、静态资源齐全。");
