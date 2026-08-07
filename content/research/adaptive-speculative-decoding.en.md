---
title: Let the Draft Decide Its Own Length
date: 2026-03-05
category: Speculative decoding
summary: Draft length in speculative decoding is a fixed hyperparameter, but the right length changes at every step. We let the draft model decide when to stop.
cover: /art/research-astrolabe.jpg
tags: [Speculative decoding, Adaptive, Inference efficiency]
venue: Working paper
authors: [Zelin Gao]
links: [arXiv|https://arxiv.org/abs/0000.00000]
---

## Abstract

This work studies the choice of draft length in speculative decoding. Draft length is normally a hard-coded hyperparameter, while the optimal length varies step by step: in highly determined stretches the draft could get many tokens right in a row and a short fixed length leaves that on the table; at a turn requiring genuine deliberation the very first token is rejected and everything drafted after it was computed for nothing.

We propose letting the draft model decide when to stop as it writes, estimating the value of continuing from its own output distribution. The method **requires no training** and changes neither model — it is a piece of logic inside the decoding loop.

## Background

Speculative decoding is simple: a small model drafts *k* tokens and a large model verifies them in a single pass. Accepted tokens advance the sequence; the first rejection is resampled from the large model's distribution. It saves time because verifying *k* tokens costs the large model one forward pass where generating them would cost *k*.

The reason this works at all is that single-stream decoding is **memory-bandwidth bound**: at batch size 1, moving weights takes far longer than using them, and the compute units sit idle waiting for data. Extra computation is therefore close to free, and trading idle compute for removed serial fetching is a straight win.

How large *k* should be has been set by intuition. That one hyperparameter governs both how much each verification saves and how much is wasted on a bad guess — and the right value drifts continuously over the course of a generation. That is the problem this work addresses.

---

Full method, experimental setup, and results are in the paper. It is a working paper and will continue to be updated.
