---
title: Make the Agent Do Less
date: 2026-05-14
category: Notes
summary: Across three projects, the highest-value change was always the same kind: take something away from the model and give it to code.
cover: /art/post-wind.jpg
tags: [Agents, Engineering]
---

Teaching, property, finance — three agents in three unrelated domains, and the pivotal change in each was identical in shape: **take something away from the model**.

- In teaching, "is this step correct?" was taken away and given to a rule engine; the model only translates working into verifiable assertions.
- In property, computing payments and taxes was taken away and given to code; the model only turns the resulting numbers into prose.
- In finance, the final call on extracted figures was taken away and given to accounting identities; the model only labels cells.

The same move three times, and the highest-return change each time.

## Why it keeps being this

Models are good at **understanding and restating**: making sense of messy natural language, or turning structured data into readable prose. Nothing else substitutes for that.

Models are bad at **things that need a guarantee**: arithmetic, logical consistency, not making things up. Not incapable — **unreliable**. Run the same input ten times and nine are right, and you don't know in advance which one isn't.

In a product real people depend on, ninety percent accuracy usually means unusable, because the user can't tell whether the thing in front of them is the ten percent.

## Which makes the test simple

Whether to hand something to the model comes down to one question: **when it gets this wrong, will I find out?**

- I will find out (a rule can check it, it can be reconciled, it links back to a source) → the model may do it, with validation.
- I won't find out → don't let the model do it; implement it deterministically.

Accounting identities are the first case, so extraction can go to the model. Payment calculation is the second, because a figure that's off by a few hundred looks exactly like a correct one — so it has to be code.

## Two side effects I didn't expect

**Prompts got shorter.** They used to carry long stretches of "you must calculate carefully," "do not invent numbers" — using natural language to request a guarantee. With those deleted the prompt is just the task, and the output is steadier.

**Things became testable.** The deterministic parts take unit tests, and the model's share shrinks to "is the translation accurate?", which a small hand-checked sample covers. End-to-end output had been essentially untestable.

> Note: placeholder content, used to check layout and styling.
