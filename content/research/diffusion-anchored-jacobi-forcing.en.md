---
title: Diffusion-Anchored Jacobi Forcing
date: 2026-07-10
category: Parallel decoding
summary: Anchoring Jacobi iteration with a diffusion-style global draft to cut the rounds needed to converge, while staying bit-identical to token-by-token generation.
cover: /art/research-weave.jpg
tags: [Parallel decoding, Jacobi iteration, Diffusion]
featured: true
venue: Under submission
authors: [Zelin Gao]
links: [arXiv|https://arxiv.org/abs/0000.00000, Code|https://github.com/your-handle]
---

## Abstract

This work studies convergence efficiency in parallel decoding. Jacobi decoding guesses several upcoming positions at once and refines them in parallel; on convergence the result is identical to sequential generation, but convergence is far slower than the theoretical ceiling, and the steps actually saved fall short of what the method promises.

We propose anchoring the iteration with a diffusion-style global draft. The draft affects only the **starting point**, never the **end point** — the verification criterion is not relaxed at all, so the output remains bit-identical to sequential generation. A good draft cuts the rounds needed to converge substantially; a mismatched one degrades at worst to ordinary Jacobi, never slower.

## Background

An autoregressive model emits one token at a time because token *n* waits on token *n-1*. But that dependency isn't genuinely binding at every step — in most sentences there are many positions where, once the surrounding context is fixed, what goes there is essentially determined.

Parallel decoding exploits exactly this. What makes it unusual is that it can leave **the output completely unchanged**: quantisation changes the numbers, attention-structure changes alter model behaviour, but parallel decoding — as long as the verification criterion isn't relaxed — produces a sequence bit-identical to sequential generation. Where output fidelity is a hard requirement, that property is worth more than the speedup itself.

The cost is slow convergence. The number of Jacobi iterations depends on the quality of the initial guess, and the usual approach fills every pending position with the same placeholder — guessing from nothing. That is what this work sets out to improve.

---

Full method, experimental setup, and results are in the paper, which is under submission. Links will be updated on acceptance.
