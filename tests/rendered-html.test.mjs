/**
 * 渲染测试。
 *
 * 刻意只验证「结构」，不验证具体文案：你改 content/ 下的内容、换项目、
 * 删占位文章，这些测试都应该继续通过。只有真的把网站改坏了才会失败。
 */

import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

/** 三类内容各自的列表地址 */
const COLLECTIONS = [
  { name: "projects", path: "projects" },
  { name: "research", path: "research" },
  { name: "posts", path: "blog" },
];

async function render(pathname, headers = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", host: "localhost", ...headers },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function renderHtml(pathname, headers) {
  const response = await render(pathname, headers);
  assert.equal(response.status, 200, `${pathname} 应该返回 200`);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

test("根路径按浏览器语言跳转", async () => {
  const zh = await render("/", { "accept-language": "zh-CN,zh;q=0.9,en;q=0.8" });
  assert.equal(zh.status, 307);
  assert.match(zh.headers.get("location") ?? "", /\/zh$/);

  const en = await render("/", { "accept-language": "en-US,en;q=0.9" });
  assert.equal(en.status, 307);
  assert.match(en.headers.get("location") ?? "", /\/en$/);

  // 不认识的语言落到默认语言，不能 404
  const other = await render("/", { "accept-language": "de-DE,de;q=0.9" });
  assert.equal(other.status, 307);
  assert.match(other.headers.get("location") ?? "", /\/(zh|en)$/);
});

test("两种语言的首页都能渲染，且标注了正确的语言", async () => {
  const zh = await renderHtml("/zh");
  assert.match(zh, /lang="zh-CN"/);
  assert.match(zh, /<title>[^<]+<\/title>/);

  const en = await renderHtml("/en");
  // 英文页在 [lang] 布局里再标一次语言，元素级会覆盖文档级
  assert.match(en, /lang="en"/);

  for (const { path } of COLLECTIONS) {
    assert.match(zh, new RegExp(`href="/zh/${path}"`), `中文首页缺少 ${path} 的入口`);
    assert.match(en, new RegExp(`href="/en/${path}"`), `英文首页缺少 ${path} 的入口`);
  }
});

test("三类内容的列表页两种语言都能渲染", async () => {
  for (const { path } of COLLECTIONS) {
    for (const lang of ["zh", "en"]) {
      const html = await renderHtml(`/${lang}/${path}`);
      assert.match(html, /<h1[^>]*>/, `/${lang}/${path} 缺少一级标题`);
    }
  }
});

test("语言开关指向另一种语言的同一个页面", async () => {
  for (const { path } of COLLECTIONS) {
    const zh = await renderHtml(`/zh/${path}`);
    assert.match(zh, new RegExp(`href="/en/${path}"`), `/zh/${path} 切不到英文版`);

    const en = await renderHtml(`/en/${path}`);
    assert.match(en, new RegExp(`href="/zh/${path}"`), `/en/${path} 切不到中文版`);
  }
});

test("每个列表页要么列出内容，要么显示空状态", async () => {
  for (const { path } of COLLECTIONS) {
    for (const lang of ["zh", "en"]) {
      const html = await renderHtml(`/${lang}/${path}`);
      const hasEntries = html.includes(`href="/${lang}/${path}/`);
      const hasEmptyState = html.includes("empty-note");
      assert.ok(hasEntries || hasEmptyState, `/${lang}/${path} 既没有内容也没有空状态`);
    }
  }
});

test("三类内容的详情页都能渲染正文", async (t) => {
  for (const { path } of COLLECTIONS) {
    const indexHtml = await renderHtml(`/zh/${path}`);
    const match = indexHtml.match(new RegExp(`href="/zh/${path}/([a-z0-9-]+)"`, "i"));

    if (!match) {
      t.diagnostic(`${path} 当前没有内容，跳过详情页检查`);
      continue;
    }

    const html = await renderHtml(`/zh/${path}/${match[1]}`);
    assert.match(html, /class="prose"/, `${path} 详情页缺少正文容器`);
    assert.match(html, new RegExp(`href="/zh/${path}"`), `${path} 详情页缺少返回列表的链接`);
  }
});

test("正文里的 HTML 被转义，不会当成标签执行", async (t) => {
  const response = await render("/zh/blog/how-to-write-here");

  if (response.status !== 200) {
    t.skip("说明文档已被删除，跳过");
    return;
  }

  const html = await response.text();

  // 只看正文容器内部：页面其它地方的 <script> 是框架自身的启动代码，与此无关
  const prose = html.match(/<div class="prose"[^>]*>([\s\S]*?)<\/div>/)?.[1];
  assert.ok(prose, "找不到正文容器");

  assert.match(prose, /&lt;b&gt;/, "正文里写的 HTML 标签应该被转义成文字");
  assert.doesNotMatch(prose, /<b>/, "正文里写的 HTML 标签不应该真的生效");
  assert.doesNotMatch(prose, /<script/i, "正文里不允许出现脚本标签");
});

test("Markdown 各种语法都能渲染", async (t) => {
  const response = await render("/zh/blog/how-to-write-here");

  if (response.status !== 200) {
    t.skip("说明文档已被删除，跳过");
    return;
  }

  const html = await response.text();
  for (const tag of ["<h2>", "<pre", "<code>", "<blockquote>", "<ul>", "<ol>", "<strong>"]) {
    assert.ok(html.includes(tag), `Markdown 渲染缺少 ${tag}`);
  }
});

test("不存在的语言、栏目和文章返回 404", async () => {
  assert.equal((await render("/fr")).status, 404);
  assert.equal((await render("/zh/blog/definitely-not-a-real-post")).status, 404);
  assert.equal((await render("/zh/projects/definitely-not-a-real-project")).status, 404);
  assert.equal((await render("/zh/research/definitely-not-a-real-paper")).status, 404);
});

test("代码里写死引用的图片都还在", async () => {
  // 首页深色卡片上的小图是写在组件里的，删了会直接 404
  const constellation = await readFile(
    new URL("app/components/Constellation.tsx", templateRoot),
    "utf8",
  );
  const files = [...constellation.matchAll(/file:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(files.length > 0, "没在组件里找到任何小图引用，选择器可能过时了");

  await Promise.all([
    ...files.map((name) => access(new URL(`public/art/${name}.jpg`, templateRoot))),
    access(new URL("public/og.png", templateRoot)),
    access(new URL("public/favicon.svg", templateRoot)),
  ]);
});

test("内容里写的封面图都存在", async () => {
  const missing = [];

  for (const dir of ["projects", "research", "posts"]) {
    const dirUrl = new URL(`content/${dir}/`, templateRoot);
    let names = [];
    try {
      names = await readdir(dirUrl);
    } catch {
      continue; // 这个集合还没建目录，正常
    }

    for (const name of names.filter((n) => n.endsWith(".md"))) {
      const raw = await readFile(new URL(name, dirUrl), "utf8");
      const cover = raw.match(/^cover:\s*(\S+)\s*$/m)?.[1];
      if (!cover || !cover.startsWith("/")) continue;

      try {
        await access(new URL(`public${cover}`, templateRoot));
      } catch {
        missing.push(`content/${dir}/${name} -> ${cover}`);
      }
    }
  }

  assert.deepEqual(missing, [], `这些封面图找不到文件：\n${missing.join("\n")}`);
});
