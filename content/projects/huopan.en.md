---
title: HuoPan · Commercial Real Estate AI Assistant
date: 2026-08-01
category: Commercial real estate
summary: A delivered client system. One conversational entry point covering property search, lead and viewing analytics, and listing creation, running against the client's real inventory and upstream systems.
cover: /art/project-property.jpg
tags: [LangGraph, Milvus, FastAPI, SSE, HITL]
featured: true
year: 2026
role: Backend and AI orchestration lead
status: Delivered and deployed
links: [Project page|https://example.com/huopan]
---

Commercial property is nothing like residential. Offices, retail, hotels, industrial parks, serviced apartments, factories — seven or eight asset classes, each with its own fields, vocabulary, and criteria.

HuoPan takes on search, lead and viewing analytics, and listing creation through a single conversational entry point.

## The problem

- **Agents can say what they need, but can't type it into filter boxes.** "Near Zhangjiang, ceiling height over four metres, standalone, suitable for light R&D" decomposes into seven or eight structured conditions — half of which have no corresponding field at all.
- **Seven asset classes get treated as one.** Offices are judged on clear height, hotels on room count, industrial parks on amenities. Generic retrieval crams them into one schema and serves none of them well.
- **Creating a listing is pure manual labour.** Information in one prospectus PDF gets transcribed by hand into one of eight templates, with field names matched to the upstream system — slow, and easy to miss things.
- **Lead and viewing data sits in the back office unread.** Answering "which district is heating up this week" means exporting spreadsheets and building a pivot table.

## How it's built

One conversational entry point, five business lines behind it.

- **Each business line is orchestrated separately.** Search, leads, viewings, listing creation, and general Q&A are each their own flow, with a unifying graph above them deciding which one the current message belongs to.
- **The conversation streams.** Text appears as it's generated; when information is missing the system raises a form inline, and picks up from where it paused once answered — no restating the requirement.
- **Retrieval takes two paths.** Fuzzy description goes to semantic vectors, hard conditions like area and price go to exact filtering, and the two are merged and ranked.
- **Listings are extracted before they're filled.** Information in PDFs, scans, slide decks, and photos is pulled out into the form automatically; the human only confirms and fills gaps.

## The hard parts

- Listing creation is the one flow outside the conversational trunk, and it is bound by four rule sets at once — extraction, forms, write-authority boundaries, and field mapping — where changing one moves the other three.
- The client's database and our vector store belong to two separate systems that never connect directly, so consistency has no transaction to lean on.
- Evaluating retrieval is easier to get wrong than retrieval itself: leak the answer into the evaluation set and the numbers look good without being true.
- AI nodes outlive a single request; database connections don't. The two lifetimes don't line up.
- Inventory volume differs by an order of magnitude between asset classes, so one retrieval strategy is necessarily weaker on the thin ones.

## What it delivers

One system covering the three heaviest parts of a commercial agent's day — finding property, reading the numbers, listing inventory — deployed against the client's real inventory.

For the people using it:

- **Search goes from guessing at filters to saying it plainly.** One sentence returns candidates, and the more specific the sentence the better the match; follow-ups build on the last one, so "cheaper" or "try Pudong" needs no restatement.
- **Each asset class is matched on its own terms.** Offices on clear height, hotels on room count, industrial parks on amenities — no longer flattened into one generic schema.
- **Listing goes from half an hour of transcription to upload and confirm.** Whether the material is a PDF, a scan, a slide deck, or a photo, the information is extracted and filled in; the human confirms and fills gaps.
- **The data can just be asked.** "Which district had the most viewings this week?", "What price band are these leads clustered in?" — answered on the spot, no export required.
- **Dropped connections don't lose progress.** Refresh or lose signal, come back, and the conversation and the conditions already entered are still there.

Delivery status: all five business lines run under one orchestration layer; hard-condition filtering measures exact at 100%, and retrieval quality is tracked by a reproducible methodology with a read-only probe. Full-request tracing plus metrics means a production issue can be located down to the individual node.

## Stack

- **Orchestration** — LangGraph, LangChain; five scenario graphs plus one unifying graph, thirty-odd replayable nodes
- **Models** — DeepSeek, Tongyi Qianwen
- **Retrieval** — Milvus (HNSW, partitioned by asset class), Tongyi text-embedding-v4
- **Services** — FastAPI, SSE streaming, Redis
- **Data** — PostgreSQL, Alembic migrations
- **Document processing** — PyMuPDF, python-docx, python-pptx, cloud OCR
- **Frontend** — Next.js, React, zustand, TanStack Query
- **Operations** — Docker, Prometheus, structured logging with end-to-end tracing
