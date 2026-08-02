import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", host: "localhost" },
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

test("renders the cinematic portfolio homepage", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Kai Lin \| Creative Technologist<\/title>/i);
  assert.match(html, /I build systems you can feel\./);
  assert.match(html, /Selected work/);
  assert.match(html, /NOVA/);
  assert.match(html, /LUMEN/);
  assert.match(html, /KINETIC/);
  assert.match(html, /http:\/\/localhost\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("renders the project archive", async () => {
  const response = await render("/work");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Project Archive \| Kai Lin<\/title>/i);
  assert.match(html, /Three systems\. One point of view\./);
  assert.match(html, /Research intelligence/);
  assert.match(html, /Ambient computing/);
  assert.match(html, /Generative motion/);
});

test("keeps all production visuals in the project", async () => {
  await Promise.all([
    access(new URL("public/hero-cinematic.png", templateRoot)),
    access(new URL("public/project-nova.png", templateRoot)),
    access(new URL("public/project-lumen.png", templateRoot)),
    access(new URL("public/project-kinetic.png", templateRoot)),
    access(new URL("public/og.png", templateRoot)),
  ]);
});
