# 个人站：操作手册

中英双语站点，分项目、研究、博客三部分。视觉照着 `docs/` 里的参考截图复刻，设计规范见 `docs/DESIGN.md`。

发布到 GitHub Pages：推 `main` 就自动构建、导出静态文件并部署，流程见第 6、7 节。

---

## 1. 站点结构

| 地址 | 内容 |
| --- | --- |
| `/` | 按浏览器语言自动跳到 `/zh` 或 `/en` |
| `/zh` `/en` | 首页 |
| `/zh/projects` | 项目列表 |
| `/zh/projects/<短名>` | 项目详情 |
| `/zh/research` | 研究（论文）列表 |
| `/zh/research/<短名>` | 论文详情 |
| `/zh/blog` | 博客列表 |
| `/zh/blog/<短名>` | 文章详情 |

**改内容只需要动 `content/` 这一个目录**，`app/` 下的代码不用碰：

| 位置 | 管什么 |
| --- | --- |
| `content/site.ts` | 姓名、身份、邮箱、外部链接、各页面所有文案 |
| `content/projects/*.md` | 项目 |
| `content/research/*.md` | 研究 |
| `content/posts/*.md` | 博客 |
| `public/` | 图片 |

`content/site.ts` 里每处文案都是 `{ zh: "中文", en: "English" }`，两种语言都要填。标了 `TODO` 的是必须换成你自己信息的占位内容：

```bash
rg -n "TODO|your-handle|YOUR_ID" content/site.ts
```

> 目录名和网址只有博客不一致：目录叫 `posts`，网址是 `/blog`。代码里拼地址一律用 `lib/content.ts` 的 `entryHref()`，别直接拿集合名去拼。

---

## 2. 加内容

三类内容写法完全一样，只是放的目录不同。文件名规则是 `短名.语言.md`：

```
content/projects/teaching-agent.zh.md
content/projects/teaching-agent.en.md
```

同一个短名的中英两个文件会被认成同一条的两个版本，读者切换语言时停在同一条上。只写一种语言也可以，另一种语言的读者会看到原文加一句提示。短名会直接变成网址，用英文小写加连字符。

文件开头的信息块，全部字段可选：

```
---
title:    标题
date:     2026-08-06          # 排序用
summary:  列表页显示的一句话，不写会自动从正文截取
cover:    /art/xxx.jpg        # 封面图，不写就是纯文字卡片
category: 分类
tags:     [标签一, 标签二]
featured: true                # 首页优先展示
draft:    true                # 写了就不发布

year:     2026                # 项目：年份
role:     独立开发            # 项目：我的角色
status:   已上线              # 项目：当前状态

venue:    NeurIPS 2026        # 研究：发表于
authors:  [高泽林]            # 研究：作者

links:    [论文|https://…, 代码|https://…]   # 竖线前是显示的字
---
```

正文支持标题、段落、粗体、斜体、行内代码、围栏代码块、链接、图片、有序/无序列表、引用块、分隔线。完整示例见站内文章《这个站怎么加内容》，也就是 `content/posts/how-to-write-here.zh.md`，可以直接复制当模板。

**不支持表格、脚注、嵌套列表和内嵌 HTML。** 直接写 HTML 会被转义成文字显示，这是刻意的，防止粘贴外部内容时带进可执行代码。

---

## 3. 视觉规范

改样式前先看 `docs/DESIGN.md`（完整设计系统）和 `docs/imgs/`（参考截图）。几条容易踩的：

- **标题用无衬线粗体，正文用衬线。** 这一点和 `DESIGN.md` 的文字描述相反，以截图为准——参考站的大标题是无衬线粗体，衬线只出现在正文和深色卡片上那句话里。
- **主按钮是黑色，不是珊瑚色。** 珊瑚色 `#cc785c` 全站只用在首页收尾那张联系卡片上。不想要可以把 `.callout` 的背景换成 `var(--card)`。
- **只有浅色一套，不做深色模式。** 深色是当版面元素用的（首页深卡、页脚），不是主题。
- 色值都是从截图里取的真实像素值，写在 `app/globals.css` 顶部的 `:root` 里。

> **加字体时注意**：中日韩字体必须写进 `app/layout.tsx` 里 next/font 的 `fallback` 数组，不能在 CSS 里接在变量后面。next/font 生成的变量自带一个通用族（`'Inter', sans-serif`），在 CSS 里往后接会让这个通用族排在所有中文字体前面，中文会被它一把接走，正文全部掉成系统默认黑体——页面不报错，只是字变丑了。
>
> 同理，字体变量挂在 `<html>` 上，不能挂 `<body>`：`globals.css` 是在 `:root` 上拼字体栈的，自定义属性里的 `var()` 在声明它的元素上求值，挂 body 时 `:root` 处取不到，整条声明会静默失效。

---

## 4. 本地预览

```bash
npm ci
npm run dev
```

打开终端里提示的地址，结束时按 `Ctrl+C`。

> **预览要用 `npm run dev`，不要用 `npm start`。** `vinext start` 不托管 `dist/client/`，静态资源会全部 404（线上由 Cloudflare 托管，没这个问题）。
>
> 本地图片走的是 `worker/index.ts` 里的退化分支：图片优化依赖 Cloudflare 的 `ASSETS` 和 `IMAGES` 绑定，本地没有这两个绑定，于是直接 302 转到原图。线上两个绑定都在，走正常的优化路径。

> **改 `next.config.ts` 时注意**：vinext 是**静态解析**这个文件的，只认字面量。写成变量或表达式（例如按环境切换 `images.unoptimized`）会被静默忽略——不报错，也不生效。要按环境区分行为，在 `worker/index.ts` 里做。

---

## 5. 构建与测试

```bash
npm test        # 先构建，再跑渲染测试
npm run lint
```

测试只验证结构不验证文案，所以换内容、删占位文章都不会让它失败。它会检查：路由通不通、语言开关对不对、三类内容的列表和详情能不能渲染、正文里的 HTML 有没有被转义、以及**代码和内容里引用的图片是不是都还在**。

> **Windows 注意**：`npm run build` 会自动执行 `build/fix-font-urls.mjs`。vinext 在 Windows 上会把本机绝对路径写进构建产物的字体地址里，上线后字体全部 404、整站掉回系统默认字体。这个脚本负责修正，在 Linux 上是空操作。**不要跳过 `npm run build` 直接调用 `vinext build`。**

---

## 6. 导出静态站

站点发布到 GitHub Pages，而 Pages 只发静态文件，所以要先把服务端渲染的结果导出成 html：

```bash
npm run export           # 先构建，再导出到 out/
npm run preview:static   # 按 GitHub Pages 的规则本地验收 out/
```

`build/export-static.mjs` 做的事：把构建好的 worker 在本地跑起来，从 `/zh` 和 `/en` 出发**顺着站内链接爬完整站**（新增内容会自动被收录，不用维护路由清单），每个页面存成 `index.html`，然后：

- **删掉 Next 的客户端脚本。** 全站没有一个 `"use client"` 组件，不需要 hydration；留着反而会让它去请求静态托管上并不存在的 RSC 数据。删掉之后就是纯 HTML + CSS，链接走整页跳转。
- **把 `/_vinext/image?url=…` 改回原图地址。** 静态托管没有图片优化端点，不改的话所有图片 404。
- **生成 `/` 的语言跳转页。** 静态托管读不到 `Accept-Language`，改成浏览器端按 `navigator.language` 判断。
- **生成 `404.html`。** GitHub Pages 找不到路径时发这个文件。
- **放一个 `.nojekyll`。** 否则 Jekyll 会忽略下划线开头的目录，而字体正好在 `assets/_vinext_fonts/` 下，会全部 404。

两个可选环境变量：

| 变量 | 什么时候要填 |
| --- | --- |
| `PAGES_BASE_PATH` | 仓库不叫 `<用户名>.github.io` 时填 `/仓库名`，否则站内地址会全部指错 |
| `SITE_URL` | 正式域名，用来写 canonical 和 og:url；不填不影响页面显示 |

导出完 `out/` 约 8 MB，其中 5 MB 是占位配图。

---

## 7. 发布到 GitHub Pages

首次配置：

1. 在 GitHub 建仓库，把本地仓库推上去（`main` 分支）。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
3. 如果仓库名不是 `<用户名>.github.io`，到 **Settings → Secrets and variables → Actions → Variables** 加一条 `PAGES_BASE_PATH`，值是 `/仓库名`。顺便可以加 `SITE_URL`。

之后每次推 `main`，`.github/workflows/pages.yml` 会自动跑 lint、测试、导出并部署。也可以在 Actions 页面手动触发。

工作流里用的是 `npm ci` 而不是 `npm install`——`install` 会改写 lock 文件里的平台相关依赖，见第 5 节的说明。

---

## 8. 自定义域名

在域名服务商加解析记录：

- 子域名（如 `www.example.com`）：加一条 `CNAME` 指向 `<用户名>.github.io`
- 根域名（如 `example.com`）：加四条 `A` 记录指向 `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`

然后在仓库 **Settings → Pages → Custom domain** 填域名并勾上 **Enforce HTTPS**。GitHub 会在仓库根目录建一个 `CNAME` 文件——注意本项目是用 Actions 部署的，产物来自 `out/`，所以要让导出脚本一起生成这个文件：

```bash
PAGES_CNAME=www.example.com npm run export
```

在工作流里就是给 `npm run export` 那一步加一个 `PAGES_CNAME` 环境变量。用了自定义域名之后 `PAGES_BASE_PATH` 要留空。

---

## 9. 回滚

Pages 部署的是某次 commit 的产物，回滚就是把代码回到那次 commit 再推一遍：

```bash
git revert <出问题的 commit>
git push
```

或者在 Actions 页面找到之前成功的那次运行，点 **Re-run all jobs**。

---

## 10. 配图来源

`public/art/` 下的占位图全部来自[芝加哥艺术博物馆](https://www.artic.edu/)的**公共领域**藏品，逐张的作品名、作者和原始链接记在 `public/art/CREDITS.json`。换成自己的图之后，把 `content/site.ts` 里 `footer.credits` 那句说明一起删掉。

---

> 这个项目原本是发到 OpenAI Sites 的（`worker/index.ts`、`.openai/hosting.json` 是那套留下的）。改投 GitHub Pages 之后那条流程不再使用，需要的话在 git 历史里能找回来。
