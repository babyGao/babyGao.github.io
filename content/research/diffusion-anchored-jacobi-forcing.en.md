---
title: Diffusion-Anchored Jacobi Forcing
date: 2026-07-10
category: Parallel decoding
summary: Anchoring Jacobi iteration with a diffusion-style global draft, cutting the rounds needed to converge while staying bit-identical to token-by-token generation.
cover: /art/research-weave.jpg
tags: [Parallel decoding, Jacobi iteration, Diffusion]
featured: true
venue: Under submission
authors: [Zelin Gao]
links: [arXiv|https://arxiv.org/abs/0000.00000, Code|https://github.com/your-handle]
---

An autoregressive model emits one token at a time because token *n* waits on token *n-1*. But that dependency isn't genuinely binding at every position — in most sentences there are many slots where, once the surrounding context is fixed, what goes there is essentially determined.

Jacobi decoding exploits exactly this: guess several upcoming positions at once, then refine them in parallel until nothing changes. On convergence the result is identical to sequential generation. The catch is that **convergence is slow**, and the steps actually saved fall short of the promise.

## The idea

Jacobi iteration is slow because the initial guess is bad. The usual approach fills every pending position with the same placeholder — starting from nothing.

Instead we first run a lightweight diffusion-style model to produce a **global draft**: a rough shape for the whole span, generated in one shot. It isn't accurate, but its positions are mutually coherent. Using that draft as the initial value gives the iteration an anchor.

The important property is that the draft affects only the **starting point**, never the **end point**. The verification criterion is not relaxed at all, so the final output remains bit-identical to sequential generation. A good draft means fewer rounds; a bad draft degrades at worst to ordinary Jacobi, never worse.

## Method

Two stages.

**Anchoring.** The diffusion model runs a few denoising steps over the upcoming window to produce a draft sequence. This costs considerably less than generating the same span autoregressively.

**Iteration.** The draft becomes the initial value for Jacobi iteration. Each round updates every position in parallel until the window stops changing. The stabilised prefix is committed, and the remainder rolls into the next window.

One implementation detail: draft confidence can set the window length. The more certain the draft, the wider the window.

## Results

Across several common generation tasks, the rounds needed to converge drop substantially against vanilla Jacobi decoding, and end-to-end speedup follows. Agreement with sequential generation is verified bit by bit, not compared by sampling.

The failure mode is worth stating. When the draft model's distribution clearly mismatches the target model's — a large domain gap, say — anchoring contributes almost nothing and performance falls back to the baseline. That's expected, but it does mean the draft model can't be chosen carelessly.

## Open problems

- The diffusion draft's own cost is a large fraction of the total on short sequences, eating into the gain.
- The adaptive window-length policy is currently heuristic and lacks theoretical grounding.
- Under batching, different samples converge in different numbers of rounds, causing waiting within a batch.

> Note: placeholder content, used to check layout and styling. Real paper and numbers to follow.
