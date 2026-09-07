---
draft: true
title: Why Decoding Is Slow, and Which Layer It's Slow In
date: 2026-07-28
category: Notes
summary: Generation feels slow and the intuition is "not enough compute." Mostly it's waiting on memory. Getting this straight makes the motivation behind every acceleration method obvious.
cover: /art/post-slope.jpg
tags: [Inference, Performance]
featured: true
---

Ask why large models generate slowly and the first answer is usually that the model is too big to compute. That's true during training and mostly wrong during inference.

## Fast to compute, slow to fetch

Generating one token means running the current context through the network, getting a distribution over the next word, sampling, and repeating.

The thing that matters is that **the batch size is 1**. Processing a single token means every layer's weights get moved from memory into the compute units, used once, and discarded. The matrix multiply itself is quick; moving the weights takes far longer than using them.

So the bottleneck isn't FLOPS, it's memory bandwidth. This is a memory-bound workload. One immediate consequence: **extra computation is nearly free here**, because the compute units were idle waiting for data anyway.

Speculative decoding, parallel decoding, and that whole family rest on this consequence. They all do the same thing underneath: spend compute that was going to waste to remove some of the serial fetching.

## Why batching helps, partly

Serving many requests at once means weights fetched in one go are shared across all of them. Bigger batches mean lower per-token fetch cost and better hardware utilisation.

Which is why production throughput can be made very high. But **the latency any one user feels doesn't improve** — they still wait word by word. Batching optimises aggregate throughput, not single-stream latency.

That's why decoding acceleration remains its own problem: batching cannot fix "one person waiting for one sentence."

## The KV cache relocates the problem

To avoid recomputing the whole context every step, implementations cache historical key-value pairs. That removes a great deal of redundant computation, at the cost of memory — and the cache **grows linearly with context length**.

In long-context settings, reading that cache becomes the new bandwidth pressure. Some of the computation saved is handed back as data movement.

## So where can acceleration come from

Given the above, there are really three places to push:

1. **Fewer serial steps** — emit several tokens per step. Parallel and speculative decoding live here.
2. **Less movement per step** — quantisation, sparsity, making the weights smaller.
3. **Less cache pressure** — attention-structure changes, or cache compression and eviction.

What makes the first category unusual is that it can leave **the output completely unchanged**. Quantisation changes the numbers; attention changes alter model behaviour; but parallel decoding, if the verification criterion isn't relaxed, produces a sequence bit-identical to sequential generation. In a lot of settings that property is worth much more than the speedup alone.

My own work is mostly in the first category.

> Note: placeholder content, used to check layout and styling.
