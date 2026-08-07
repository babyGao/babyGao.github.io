---
title: Multimodal Financial Research Report Generation
date: 2026-01-20
category: Finance
summary: Report generation from data collection through to finished draft. Annual-report long text, financial tables, candlestick charts, and news all feed in; a two-tier agent system produces first and final drafts.
cover: /art/project-finance.jpg
tags: [Multimodal, RAG, MultiAgent, Celery]
featured: true
year: 2026
role: Design and implementation lead
status: Complete
links: [Project page|https://example.com/finance]
---

Writing an equity research report means reading across three modalities at once: the annual report is hundreds of pages of prose, the financials are locked in tables, price action is a chart, and sentiment lives in the news.

This system pulls all four streams into one pipeline and produces first and final drafts, so analysts spend their time on judgement rather than on assembling material.

## The problem

- **Information spans three modalities and assembling it by hand takes a long time** — and the assembling itself produces no research value.
- **Annual reports are long enough that bad chunking equals no retrieval.** Fixed-length chunking cuts a table or a complete argument in half, and the retrieved fragment arrives without context.
- **Tables are the worst offender.** Annual reports contain native text tables, image tables, and tables spanning pages; any single extraction method misses a share of them.
- **The data is live, the report is not.** Prices and news move daily, so a hand-written report starts going stale the moment it ships.
- **Depending on one model provider isn't controllable.** One unstable endpoint stalls the whole pipeline.

## How it's built

Four data streams into one pipeline, two tiers of agents producing drafts.

- **A unified data pipeline.** Annual reports crawled offline, news and price data pulled online, with text, tables, and images collected into one path.
- **Long text organised as a document tree.** Section hierarchy is preserved for indexing, so retrieval locates a section first and takes fragments from within it.
- **Tables extracted three ways at once.** RAG, regular expressions, and OCR run in parallel and check each other.
- **Two tiers of agents.** A perception agent reads news, charts, and financial statements; a planning multi-agent handles composition and scheduling, producing first and final drafts.
- **A model gateway as a backstop.** ChatGPT, ERNIE, and others behind one wrapper, with switching and retry on failure.
- **An asynchronous task queue.** Offline data refresh is decoupled from online generation, so neither blocks the other.

## The hard parts

- Semantic boundaries in a long document and fixed-length chunk boundaries are inherently in conflict.
- One annual report contains tables in three different physical forms, and no single extraction method covers all of them.
- Three modalities have to be reconciled within a single argument, despite differing in time granularity and reliability.
- Conclusions must be traceable to source text, while generative models are inherently biased toward fluency over verifiability.
- Availability of upstream model providers is outside your control.

## What it delivers

It compresses "read several hundred pages, then start writing" into "material in, draft out", moving analyst time from collating to judging and refining.

For the people using it:

- **One input, all modalities.** Annual reports, financial tables, charts, and news go in together instead of being processed separately and stitched by hand.
- **You get a draft, not a pile of source material.** The system produces a structured first draft and iterates to a final one, so analysts edit rather than start from zero.
- **Table data stops going missing.** Three-way extraction with cross-checking recovers image tables and page-spanning tables, and disagreements surface instead of failing silently.
- **Citations lead back to the source.** The document tree preserves section hierarchy, so a conclusion can be traced to its place in the annual report.
- **Data refreshes itself.** The offline pipeline keeps reports, prices, and news current, so generation reads the present state.
- **Changing models causes no downtime.** The gateway wraps dispatch and retry, routing around an unstable provider without the business layer noticing.

## Stack

- **Agent system** — a perception agent and a planning multi-agent, split across two tiers
- **Model access** — an AI model gateway wrapping ChatGPT, ERNIE, and others, with switching and retry on failure
- **Retrieval** — RAG; document-tree indexing for long text
- **Extraction** — regex, OCR, and RAG in parallel with cross-checking
- **Data collection** — offline annual-report crawling plus online news and price feeds
- **Scheduling** — Celery, decoupling offline refresh from online generation
- **Language and services** — Python
