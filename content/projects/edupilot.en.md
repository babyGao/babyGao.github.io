---
title: EduPilot · Multimodal Teaching Agent
date: 2026-06-18
category: Education
summary: A co-authoring assistant for lesson prep. Brief and materials in, slides and lesson plan out, targeted rewrites on teacher feedback, standardised export — a working loop, not one-shot generation.
cover: /art/project-teaching.jpg
tags: [Multi-Agent, LangGraph, RAG, Multimodal]
featured: true
year: 2026
role: End-to-end development
status: End-to-end build complete
links: [Demo|https://example.com/demo, Code|https://github.com/your-handle]
---

Time spent preparing a lesson doesn't go into deciding what to teach. It goes into producing the artefacts: finding material, laying out slides, writing the plan, fixing formatting.

EduPilot is a co-authoring assistant for that work. It doesn't stop at a passage of text — it closes the loop: brief and materials in, courseware and lesson plan out, targeted rewrites on feedback, export in the format the school wants.

## The problem

- **Teachers don't want a first draft, they want something they can teach from.** One-shot generation produces decent text and leaves layout, local rewrites, and format conversion to the human.
- **Teacher feedback is inherently local.** "Slide three is too shallow", "change this example" — re-running the whole chain is slow and overwrites the parts they were happy with.
- **Teaching material is multimodal by nature.** Textbooks are PDFs, decks are PPT, board work is a photo, demo lessons are video. A tool that only accepts text accepts almost nothing.
- **Long-form output drifts.** Concept walkthroughs and study reports lose the thread partway, contradicting themselves, leaving the teacher to check line by line.
- **Grade level and syllabus position change the explanation entirely.** Explaining with a technique not yet taught is no explanation at all.

## How it's built

Five roles in sequence, one pass through the chain per lesson.

- **A five-node main chain.** planner breaks down the task → researcher gathers evidence → designer sets structure → writer produces content → coder emits deliverables, supporting both first-pass and feedback-driven runs.
- **Speak or type.** Text and voice input both supported; when browser speech recognition is unavailable it falls back to recording upload with backend transcription.
- **Materials are submitted bound to their purpose.** The frontend specifies which material feeds which stage, rather than dumping everything into one context window.
- **Retrieval scope is switchable.** Local knowledge base, web, or both, chosen per classroom scenario.
- **One intermediate document, many deliverables.** The main flow emits a structured intermediate form; HTML, PPT, Word, and PDF all render from it.
- **Progress is visible and resumable.** Node status streams live, and a dropped connection resumes from where it stopped rather than restarting.

## The hard parts

- Teacher feedback is local while the generation chain is global — the two granularities don't match.
- Logical consistency in long-form output decays with length; the longer it runs, the more likely it contradicts itself.
- The same problem must be explained within the constraints of current syllabus position — and that position is nowhere in the problem itself.
- Diagram-based maths and physics questions carry their information in the figure, not the text, so a text-only pipeline simply cannot see them.
- The four export formats have unrelated layout rules, and without care become four parallel codebases.

## What it delivers

A complete path from "here's what I need to teach" to a classroom-ready artefact, with the teacher free to intervene anywhere along it instead of only starting over.

For the people using it:

- **One lesson prepared in one place.** Brief, upload, generate, comment, export — no shuttling between tools.
- **Comment and it changes; no regeneration.** Say slide three is too shallow and only slide three changes; everything else stays exactly as approved.
- **Existing material is directly usable.** Textbook PDFs, old decks, a phone photo of the board, a recorded lesson — upload and it feeds the generation.
- **Long-form content stops arguing with itself.** Coherence of concept walkthroughs and correctness of step decomposition improved by roughly 30%.
- **Answers stay closer to the textbook.** Chunking along conceptual boundaries plus hybrid retrieval cut the answer hallucination rate by 55%.
- **Diagram questions are understood.** Complex figure-based problems are parsed automatically, with no need to describe the diagram in words.
- **Exports are ready to use.** PPT, Word, and PDF in one click, consistently formatted, no manual cleanup.

Operating status: the multi-role topology holds up across 10+ concurrent student sessions.

## Stack

- **Orchestration** — LangChain, LangGraph; planner / researcher / designer / writer / coder
- **Prompting** — multi-step CoT, self-reflection, ReAct
- **Retrieval** — Milvus; chunking along conceptual boundaries, keyword + dense hybrid retrieval
- **Multimodal** — PDF, Word, PPT, image, and video parsing; intent-routed vision/text dispatch
- **Services** — Python, FastAPI, WebSocket streaming
- **Deliverables** — one structured intermediate form rendering HTML / PPT / Word / PDF
- **Operations** — Docker
