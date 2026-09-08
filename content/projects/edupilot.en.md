---
title: EduPilot · Multimodal Teaching Agent
date: 2026-06-18
category: Education
summary: A multimodal preparation system integrating teaching resource retrieval, slide and lesson plan generation, feedback revision, and document export with teacher review throughout.
cover: /art/project-education-books.jpg
tags: [Multi-Agent, LangGraph, RAG, Multimodal]
featured: true
year: 2026
role: End-to-end development lead
status: End-to-end development complete
links: [Demo video|https://example.com/demo, Code|https://github.com/your-handle]
---

## Background

Digital teaching resources provide a foundation for AI-assisted lesson preparation, but textbooks, slides, board photographs, and videos differ in format and knowledge structure. A single generation step cannot readily satisfy requirements for source attribution, curriculum alignment, local revision, and document layout. Teachers must still integrate and review the material.

EduPilot connects teaching requirements analysis and resource retrieval with slide and lesson plan generation, incorporating teacher feedback into an iterative revision process.

## Solution and development

- **Task coordination.** Five LangGraph roles handle planning, research, design, writing, and artifact generation, coordinating learning objectives, content structure, and output requirements.
- **Resource understanding and retrieval.** Document, image, and video parsing feed knowledge-based segmentation and hybrid keyword/vector retrieval. Search can use a local knowledge base, the web, or both.
- **Feedback revision.** Teacher comments are associated with specific content, supporting initial generation and targeted regeneration. Multi-step reasoning and reflection checks improve logical continuity in longer material.
- **Consistent output and execution state.** A structured intermediate document supports HTML, PPT, Word, and PDF rendering. Live node updates expose progress, while recovery support allows workflows to continue after connection interruptions.

## Applications

End-to-end development covers requirements input, resource uploads, generation, revision, and standardized export. Teachers can review and refine content within one workflow, reuse existing materials, and use multimodal parsing for complex mathematical diagrams. The multi-role workflow has supported more than 10 concurrent student sessions.

## Technology stack

LangChain, LangGraph, Milvus, Python, FastAPI, WebSocket, Docker; multimodal parsing, hybrid retrieval, and document generation.
