# Contributing to Project Signal Wizard

This document describes how contributors, reviewers, and consultants should work with the repository.

The README explains the product. This file explains how to participate in the work.

---

## Working Principles

1. Start boring and deterministic.
2. Treat OracleDB as the system of record.
3. Keep official records separate from uploaded files.
4. Never let an LLM directly mutate production data.
5. Validate AI-generated results before they become official.
6. Log sensitive operations.
7. Prefer explicit workflows over hidden automation.
8. Require human approval for contractual, quality, commercial, safety, or external-facing actions.
9. Build the normal workflow before adding agentic behavior.
10. Add AI only where it removes real manual pain without reducing control.

---

## Roadmap and ADR Policy

The roadmap is a living planning document. It represents the current working truth of the product direction, scope, and phase order.

When the roadmap changes because of a significant product, architectural, or strategic decision, that decision should be recorded in an ADR.

Minor roadmap refinements do not require an ADR. Major pivots, scope boundary changes, architectural commitments, or decisions that future contributors may question should be documented.

---

## Documentation Guidelines

Documentation should be practical and decision-oriented.

Prefer:

- clear definitions;
- explicit scope boundaries;
- short rationale for decisions;
- examples from real project workflows;
- risks and consequences;
- links between decisions and affected documents.

Avoid:

- vague product language;
- broad AI claims;
- premature framework design;
- documenting future modules as if they are already committed MVP scope.

---

## Consultant Portal

The consultant portal is a lightweight review area for external advisors, consultants, and domain experts.

It is intended for domain experts who do not necessarily have programming/IT technical skills.
These experts should review product direction, roadmap decisions, ADRs, scope boundaries, or domain assumptions without working directly in the codebase.

Typical workflow:

1. The project owner grants access.
2. The consultant reviews selected documentation.
3. Feedback is provided through the agreed review channel.
4. Product-impacting decisions are reflected in roadmap updates or ADRs.

Access is currently manual. To request access, contact support@new-industry-standard.org

---

## Code and Implementation Guidance

Implementation should follow the current phase and avoid racing ahead of the domain model.

For Phase 1, the main focus is the Document Control Section MVP. Broader modules such as material control, procurement automation, QA/QC signals, contract/VO workflows, and autonomous agents should remain out of implementation scope unless explicitly approved by a later roadmap update or ADR.

Before adding AI or automation, define:

- the user problem;
- the input data;
- the expected output;
- validation rules;
- failure handling;
- audit requirements;
- required human approval points.
