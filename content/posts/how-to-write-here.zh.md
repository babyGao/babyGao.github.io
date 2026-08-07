---
title: 这个站怎么加内容
date: 2026-01-05
category: 站务
summary: 项目、研究、博客三类内容的写法完全一样：在对应目录下建一个 Markdown 文件就行。这篇既是说明，也是可以直接复制的模板。
cover: /art/post-maples.jpg
tags: [站务]
---

全站三类内容——项目、研究、博客——写法是一样的，区别只是放在哪个目录：

- `content/projects/` 项目
- `content/research/` 研究（论文）
- `content/posts/` 博客

文件名的规则是 `短名.语言.md`，例如：

```
content/posts/jacobi-notes.zh.md
content/posts/jacobi-notes.en.md
```

同一个短名的中英两个文件会被认成同一条内容的两个版本，读者切换语言时停在同一条上。只写一种语言也可以，另一种语言的读者会看到原文加一句提示。

短名会直接变成网址，所以用英文小写加连字符。

## 开头的信息块

文件最上面用两行 `---` 夹起来的部分，写这条内容的属性。全部可选。

```
---
title:    标题
date:     2026-08-06
summary:  列表页显示的一句话，不写会自动从正文截取
cover:    /art/post-maples.jpg
category: 分类
tags:     [标签一, 标签二]
featured: true
draft:    true
---
```

`featured: true` 会让它在首页优先展示。`draft: true` 表示不发布，用来存草稿。

项目和研究还各有几个专属字段：

- 项目：`year` 年份、`role` 我的角色、`status` 当前状态
- 研究：`venue` 发表于、`authors` 作者

外部链接写成 `links: [论文|https://…, 代码|https://…]`，竖线前面是显示出来的字，后面是地址。

配图放进 `public/` 里，`cover` 写从 `/` 开始的路径。不写 `cover` 就是纯文字卡片，不会出错。

## 正文能写什么

支持这些写法：

# 一级标题
## 二级标题
### 三级标题

段落里可以用 **粗体**、*斜体* 和 `行内代码`，也可以放[链接](https://example.com)。

- 无序列表
- 第二项

1. 有序列表
2. 第二项

> 引用块长这样。

代码块用三个反引号围起来，可以标语言：

```python
def jacobi_step(model, tokens):
    # 所有位置并行更新
    return model(tokens).argmax(-1)
```

分隔线：

---

## 不支持什么

表格、脚注、嵌套列表，都不支持。

直接写 HTML 也不行——像 <b>这样</b> 的标签会被原样显示成文字，不会生效。这是故意的：从别处粘贴内容时不会把可执行代码带进来。

需要表格的时候，用列表通常能表达同样的意思，而且在手机上更好读。

> 说明：本文为占位内容，同时也是可以直接复制的模板。
