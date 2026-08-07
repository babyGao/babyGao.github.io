---
title: How to Add Content Here
date: 2026-01-05
category: Site
summary: Projects, research, and blog posts all work the same way — create a Markdown file in the right folder. This post is both the documentation and a template you can copy.
cover: /art/post-maples.jpg
tags: [Site]
---

All three content types — projects, research, blog — are written the same way. Only the folder differs:

- `content/projects/` projects
- `content/research/` research papers
- `content/posts/` blog posts

Filenames follow `slug.language.md`:

```
content/posts/jacobi-notes.zh.md
content/posts/jacobi-notes.en.md
```

The two files sharing a slug are treated as two versions of one entry, so switching language keeps the reader on the same piece. Writing only one language is fine — readers of the other get the original plus a short note.

The slug becomes the URL, so use lowercase ASCII with hyphens.

## The block at the top

The section fenced by two `---` lines holds this entry's properties. All fields are optional.

```
---
title:    Title
date:     2026-08-06
summary:  One line shown in listings; omitted, it's taken from the body
cover:    /art/post-maples.jpg
category: Category
tags:     [Tag one, Tag two]
featured: true
draft:    true
---
```

`featured: true` promotes it on the homepage. `draft: true` keeps it unpublished.

Projects and research have a few fields of their own:

- Projects: `year`, `role`, `status`
- Research: `venue`, `authors`

External links are written `links: [Paper|https://…, Code|https://…]` — the text before the bar is what's displayed, the rest is the address.

Put images in `public/` and write `cover` as a path starting with `/`. Omitting `cover` gives a text-only card, which is fine.

## What the body supports

# Heading 1
## Heading 2
### Heading 3

Paragraphs can use **bold**, *italic*, and `inline code`, and can carry [links](https://example.com).

- Unordered list
- Second item

1. Ordered list
2. Second item

> Block quotes look like this.

Code blocks are fenced with three backticks and can name a language:

```python
def jacobi_step(model, tokens):
    # every position updates in parallel
    return model(tokens).argmax(-1)
```

A horizontal rule:

---

## What it doesn't support

No tables, no footnotes, no nested lists.

Raw HTML doesn't work either — a tag like <b>this</b> is displayed as literal text rather than taking effect. That's deliberate: pasting content from elsewhere can't drag executable code in with it.

Where you want a table, a list usually says the same thing and reads better on a phone.

> Note: placeholder content, and a template you can copy.
