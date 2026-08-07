/**
 * 构建后修正字体地址。
 *
 * 背景：vinext 会把 Google Fonts 缓存到 .vinext/fonts/，构建时再把里面的
 * 绝对路径替换成公开地址 /assets/_vinext_fonts/。它的判断方式是
 * `css.includes(cacheDir)`，其中 cacheDir 用的是当前平台的路径分隔符。
 *
 * 在 Windows 上，生成的 CSS 里是正斜杠（D:/项目/.vinext/fonts/...），
 * 而 cacheDir 是反斜杠（D:\项目\.vinext\fonts），两者对不上，替换被跳过，
 * 于是构建产物里留下了本机绝对路径。这些地址在线上必然 404，
 * 结果就是整站字体掉回系统默认字体。
 *
 * 因为 Sites 发布上传的是本地 dist，这个问题会直接带到线上，所以这里补做替换。
 * 在 Linux 上 vinext 自己已经替换干净，本脚本不会有任何匹配，属于空操作。
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, "dist");
const PUBLIC_PREFIX = "/assets/_vinext_fonts";

/** 缓存目录在各种写法下的样子，逐一替换 */
const cacheDir = path.join(projectRoot, ".vinext", "fonts");
const variants = [...new Set([cacheDir, cacheDir.replace(/\\/g, "/")])];

/** 只处理文本类产物 */
const TEXT_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".css", ".html", ".json", ".map"]);

function collectFiles(dir) {
  const found = [];

  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return found;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stats = statSync(full);

    if (stats.isDirectory()) {
      found.push(...collectFiles(full));
    } else if (TEXT_EXTENSIONS.has(path.extname(full))) {
      found.push(full);
    }
  }

  return found;
}

let patchedFiles = 0;
let patchedHits = 0;

for (const file of collectFiles(distDir)) {
  const original = readFileSync(file, "utf8");
  let updated = original;

  for (const variant of variants) {
    if (!updated.includes(variant)) continue;
    patchedHits += updated.split(variant).length - 1;
    updated = updated.split(variant).join(PUBLIC_PREFIX);
  }

  if (updated !== original) {
    writeFileSync(file, updated);
    patchedFiles += 1;
  }
}

if (patchedHits > 0) {
  console.log(`修正字体地址：${patchedHits} 处，涉及 ${patchedFiles} 个文件`);
}
