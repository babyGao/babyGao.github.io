# 个人站：操作手册

中英双语站点，分项目、研究、博客三部分。视觉照着 `docs/` 里的参考截图复刻，设计规范见 `docs/DESIGN.md`。

发布分两步：终端命令负责构建、Git 和打包；`sites_*` 是 Sites MCP 的认证调用，需要在已连接 Sites MCP 的客户端里执行。

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

## 6. 提交并推送到 Sites

```bash
npm test
git add -A
git commit -m "更新网站"
COMMIT_SHA=$(git rev-parse HEAD)
PROJECT_ID=$(node -p "JSON.parse(require('fs').readFileSync('.openai/hosting.json')).project_id")
```

获取推送凭据：

```text
sites_create_source_repository_write_credential
{"project_id":"PROJECT_ID"}
```

把返回的 `remote_url`、`branch`、`token` 输入终端。令牌短期有效，不要写入文件：

```bash
read -rp "remote_url: " SITES_REMOTE_URL
read -rp "branch: " SITES_BRANCH
read -rsp "token: " SITES_TOKEN; echo
git -c http.extraHeader="Authorization: Bearer $SITES_TOKEN" push "$SITES_REMOTE_URL" "HEAD:$SITES_BRANCH"
unset SITES_TOKEN
```

---

## 7. 打包并保存版本

```bash
ARCHIVE=/tmp/portfolio-site.tar.gz
STAGE=$(mktemp -d)
mkdir -p "$STAGE/dist/.openai"
cp -R dist/. "$STAGE/dist/"
cp .openai/hosting.json "$STAGE/dist/.openai/hosting.json"
mkdir -p "$STAGE/dist/.openai/drizzle"
cp -R drizzle/. "$STAGE/dist/.openai/drizzle/"
tar -C "$STAGE" -czf "$ARCHIVE" dist
```

调用并保存返回的 `id` 为 `VERSION_ID`：

```text
sites_save_site_version
{"project_id":"PROJECT_ID","commit_sha":"COMMIT_SHA","archive":"/tmp/portfolio-site.tar.gz"}
```

上传的是**本地 dist**，所以本地构建的质量直接决定线上效果 —— 这也是第 5 节那个字体修正必须执行的原因。

---

## 8. 发布与检查

私有站点：

```text
sites_deploy_private_site_version
{"project_id":"PROJECT_ID","version_id":"VERSION_ID"}
```

保存返回的 `id` 为 `DEPLOYMENT_ID`，重复查询直到 `succeeded` 或 `failed`：

```text
sites_get_deployment_status
{"project_id":"PROJECT_ID","version_id":"VERSION_ID","deployment_id":"DEPLOYMENT_ID"}
```

公开或共享站点改用 `sites_deploy_site_version`，参数相同。

---

## 9. 分享权限

先调用 `sites_get_site {"project_id":"PROJECT_ID"}` 取得现有邮箱。指定访问者时必须提交完整名单，不是只提交新增邮箱：

```text
sites_update_site_access
{"project_id":"PROJECT_ID","access_mode":"custom","allowed_user_emails":["owner@example.com","new@example.com"]}
```

公开访问：

```text
sites_update_site_access
{"project_id":"PROJECT_ID","access_mode":"public"}
```

---

## 10. 自定义域名

```text
sites_add_custom_domain
{"project_id":"PROJECT_ID","hostname":"www.example.com"}
```

在域名服务商添加返回的 `validation_records`；子域名添加 `cname_target`，根域名添加 `apex_proxy_ipv4_targets`。保存返回的 `id` 为 `DOMAIN_ID`，然后查询：

```text
sites_refresh_custom_domain_status
{"project_id":"PROJECT_ID","custom_domain_id":"DOMAIN_ID"}
```

---

## 11. 回滚

```text
sites_list_site_versions
{"project_id":"PROJECT_ID","limit":50}
```

选择旧版本的 `id`，把它作为 `VERSION_ID` 再执行第 8 步。回滚只重新发布旧版本，不修改本地源码。

---

## 12. 配图来源

`public/art/` 下的占位图全部来自[芝加哥艺术博物馆](https://www.artic.edu/)的**公共领域**藏品，逐张的作品名、作者和原始链接记在 `public/art/CREDITS.json`。换成自己的图之后，把 `content/site.ts` 里 `footer.credits` 那句说明一起删掉。

---

所有大写 ID 都是占位符，调用时替换为真实返回值。不要删除或改写 `.openai/hosting.json` 的 `project_id`，不要保存令牌或密钥。
