---
title: Diffusion-Anchored Jacobi Forcing
date: 2026-07-10
category: Parallel decoding
summary: Improving convergence in parallel decoding with global drafts while preserving model weights and verification constraints, yielding token-wise agreement with sequential generation.
cover: /art/research-sequence-motion.jpg
tags: [Parallel decoding, Jacobi iteration, Diffusion models]
featured: true
venue: Under review
authors: [Zelin Gao]
links: [arXiv|https://arxiv.org/abs/0000.00000, Code|https://github.com/your-handle]
---

## Abstract

Autoregressive language generation relies on sequential computation, limiting inference efficiency in latency-sensitive settings. Jacobi parallel decoding can update multiple positions while preserving output consistency, but its practical acceleration depends on iterative convergence.

Diffusion-Anchored Jacobi Forcing uses global drafts to improve convergence in parallel generation. The draft influences the starting point without changing the converged result. Under matched generation settings and verification constraints, the final output agrees token by token with sequential generation. The work studies decoding optimization with fixed model weights, addressing efficiency alongside output consistency.

## Background

Autoregressive models generate sequences through successive prefix-conditioned distributions. As model size and generation length increase, sequential dependencies, weight access, and cache reads jointly affect latency. Greater hardware compute capacity or larger request batches may not sufficiently reduce the waiting time for an individual sequence.

Parallel decoding reorganizes generation to exploit parallelism within a sequence. Output consistency and convergence cost must be considered together: the former determines whether results are preserved, while the latter determines whether parallel computation yields practical efficiency gains. Improving convergence under fixed consistency constraints is the central research question.

---

Full methods and experiments are described in the paper. The manuscript is under review; publication information and links will be updated.
