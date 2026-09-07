---
title: Multimodal Financial Research Report Generation
date: 2026-01-20
category: Finance
summary: A system combining annual reports, financial tables, market charts, and news through structured retrieval and agent collaboration, from data collection and analysis to report generation.
cover: /art/project-finance-exchange.jpg
tags: [Multimodal, RAG, MultiAgent, Celery]
featured: true
year: 2026
role: Design and implementation lead
status: Complete
links: [Project website|https://example.com/finance]
---

## Background

Financial research combines annual reports, financial tables, market charts, and news. These sources differ in structure, update frequency, and representation. Retrieval from long documents must also preserve chapter semantics and table context, making source integration and verification substantial parts of report preparation.

This system connects data collection, evidence retrieval, analysis, and report composition in a continuous workflow, allowing researchers to review and revise generated drafts.

## Solution and development

- **Unified data ingestion.** Offline annual report collection and online news and price feeds share a pipeline for text, tables, and images.
- **Document structure preservation.** A document tree retains chapter relationships for section and passage retrieval. RAG, regular expressions, and OCR provide complementary table extraction and cross-checking for native, image-based, and multi-page tables.
- **Coordinated analysis.** Perception agents interpret news, market charts, and financial statements. A planning layer coordinates tasks and report structure, producing successive drafts while retaining references to source locations.
- **Service orchestration.** A model gateway standardizes calls, switching, and failure retries. Celery separates offline updates from online generation to reduce the impact of upstream service fluctuations.

## Applications

The completed workflow spans multi-source data collection and report generation, supporting multimodal integration, staged drafting, and source document navigation. Asynchronous updates replenish the available material, while multi-model access supports service switching. Researchers can focus on analytical judgment and report review.

## Technology stack

Python, Celery, RAG, OCR, document tree indexing, multi-agent orchestration, and a multi-model gateway.
