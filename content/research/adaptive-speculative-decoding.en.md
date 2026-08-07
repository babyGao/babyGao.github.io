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

Speculative decoding is simple: a small model drafts *k* tokens, a large model verifies them in one pass. Accepted tokens advance the sequence; the first rejection is resampled from the large model's distribution.

*k* is normally a hard-coded hyperparameter — say 5. But **the right *k* differs at every step**. In a stretch of highly determined text the draft could get a dozen right in a row, and 5 leaves that on the table. At a turn that genuinely requires deliberation the very first draft token gets rejected, and 5 means four tokens were computed for nothing.

## The idea

Don't guess *k*. Let the draft model judge, as it writes, whether continuing is still worthwhile.

The draft model already has a distribution at every token. The shape of that distribution — how concentrated it is — correlates strongly with whether the large model will accept the token. A sharp distribution usually means the draft is right; a flat one usually means rejection.

So the stopping rule becomes: **stop when the running estimate of acceptance probability falls below a threshold**, and hand what's written so far to the verifier.

## Method

For each drafted token, the draft model's own output distribution gives an estimate of the probability that token is accepted. Multiplying those estimates along the draft yields the probability that the whole draft is accepted. Stop when that falls below threshold.

The threshold itself needs no hand-tuning. Given the cost of one verification pass and the cost of drafting one token, the threshold maximising expected throughput follows directly. Both costs are measurable constants in a given deployment.

A useful side property: the method **requires no training** and no changes to either model. It's a piece of logic in the decoding loop.

## Results

Against fixed-length speculative decoding with the same model pair, adaptive stopping increases the average accepted length per verification, and end-to-end throughput improves accordingly. The gain is larger on tasks whose determinism varies a lot — code and structured output benefit more than open-ended chat.

The failure mode is clear too. When the draft model is poorly calibrated, the probability estimates are unreliable and adaptive stopping degrades to, or slightly below, fixed length. A simple temperature calibration on the draft model largely fixes this, but it needs a small calibration set.

## Open problems

- The estimate uses the draft model's own distribution, which is an inherently biased proxy.
- The threshold derivation assumes verification cost is independent of draft length; that loosens for long drafts.
- Composition with tree-structured drafts (verifying several candidates at once) is not done.

> Note: placeholder content, used to check layout and styling. Real paper and numbers to follow.
