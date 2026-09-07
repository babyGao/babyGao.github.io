---
title: Adaptive Draft Stopping in Speculative Decoding
date: 2026-03-05
category: Speculative decoding
summary: Adapting draft length to changing generation conditions using the draft model's own output distribution, without additional training or changes to model weights.
cover: /art/research-astrolabe.jpg
tags: [Speculative decoding, Adaptive inference, Inference efficiency]
venue: Working paper
authors: [Zelin Gao]
links: [arXiv|https://arxiv.org/abs/0000.00000]
---

## Abstract

Speculative decoding reduces sequential inference overhead through draft generation and target-model verification. Draft length affects both verification gains and wasted computation. Since generation certainty varies across positions, a fixed length cannot readily accommodate these differences.

This work studies adaptive stopping in speculative decoding. The draft model uses its own output distribution to determine when to stop, dynamically balancing drafting cost against verification benefit. The method requires no additional training and leaves both models' weights unchanged, with the aim of improving the computational efficiency of existing speculative decoding workflows.

## Background

Speculative decoding assigns candidate generation and verification to different models. Its potential benefit comes from replacing part of sequential generation with batch verification. Practical efficiency nevertheless depends on drafting cost, candidate acceptance, and target-model verification overhead.

Longer drafts can advance more positions per verification step, but may also produce more rejected candidates. Shorter drafts reduce drafting cost while potentially limiting useful parallelism. Because these factors vary with context and generation position, draft length selection should account for local generation characteristics, motivating adaptive stopping.

---

Full methods and experiments are described in the paper. This is a working paper; research progress will be updated.
