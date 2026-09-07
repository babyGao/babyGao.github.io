---
title: Huopan · Enterprise AI for Commercial Real Estate
date: 2026-08-01
category: Commercial real estate
summary: An enterprise agent system combining domain knowledge, complex task orchestration, and multimodal tools for market analysis, property search, and listing creation.
cover: /art/project-property.jpg
tags: [LangGraph, Milvus, FastAPI, SSE, HITL]
featured: true
year: 2026
role: Backend and AI orchestration lead
status: In production
links: [Project website|https://example.com/huopan]
---

## Background

AI agents have expanded across industry applications, enabling users to retrieve information through natural-language questions. Many vertical agents remain centered on prompt engineering or basic retrieval-augmented generation (RAG), with limited support for complex business workflows and generalization across tasks.

Huopan is an independently developed enterprise agent system for commercial real estate. It addresses diverse information needs that require extended sequences of actions, connecting information retrieval with task execution across business workflows.

## Solution and development

Commercial real estate tasks span multiple property types, specialized data, and sequential decisions. Development progresses from task orchestration to tool integration, operational evaluation, and domain models:

- **Complex task orchestration.** A LangGraph architecture combines ReAct agents with defined workflows to handle extended requests and integrate tools for specialized functions.
- **Multimodal tools.** DeepSeek supports intent recognition and the orchestration of multimodal parsing, image processing, and multi-agent tools, improving task completion while reducing token consumption.
- **Continuous evaluation.** Langfuse provides observability for iterative improvements to system stability. Prompt optimization and releases use A/B testing to improve the user experience.
- **Domain models and data access.** Collaboration with industry experts supports successive iterations of a private real estate model. Tool calling enables Text-to-SQL and detailed requirements analysis.

## Applications

Huopan operates across market analysis, AI property search, and listing creation. A published MCP integration also makes the assistant available through Skills in applications including Doubao and Qianwen Office.

## Technology stack

LangGraph, Milvus, FastAPI, SSE, React, HITL.
