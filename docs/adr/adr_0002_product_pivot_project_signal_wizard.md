# ADR-0002: Product Pivot to Project Signal Wizard

## Status

Approved

## Context

The product started as `DC Agent`, focused on document control for industrial contractors.

After further domain discussion and external validation, the product direction is broader than document control. Existing enterprise platforms already cover large parts of document management, but contractors and junior project managers still suffer from missed signals, weak project awareness, poor communication, and late crisis management.

The key product insight is:

> A good project manager does not only collect project data. A good project manager hears field noise and converts it into actionable signals.

Document control remains the first source of truth. Material / warehouse control is the second major source of execution truth. Later modules may include procurement, QA/QC, safety, subcontractors, contract management, VO, and project signals.

## Decision

Rename the product direction from `DC Agent` to **Project Signal Wizard**.

Position the product as a contractor-focused project-control assistant that helps project managers detect, understand, and act on project signals before they become project fires.

The first MVP does not change in implementation scope. It is redefined as the **Document Control Section MVP**: the first controlled data backbone for the wider Project Signal Wizard product.

## Resolved Decisions

### 1. Product identity

`DC Agent` is no longer the correct product name.

The working product name is **Project Signal Wizard**.

The broader brand / domain may use **New Industry Standard**.

### 2. MVP scope

The first MVP remains focused on document control.

It should not expand now into warehouse, procurement, QA/QC, safety, subcontractors, VO, or autonomous agents.

### 3. MVP meaning

The MVP is no longer framed as a standalone document-control product.

It is the **Document Control Section MVP** and the first source-of-truth layer for future signal detection.

### 4. Long-term direction

The long-term product direction is a project signal and decision-support system for:

- contractor project managers;
- project engineers;
- possibly EPC discipline managers later.

The system should help users identify blockers, missing records, readiness failures, quality risks, procurement risks, commercial exposure, and recommended next checks.

### 5. AI and automation role

AI should be treated as a serious product capability, not decoration.

Useful areas include:

- NLP search and interaction;
- meeting summaries;
- report generation;
- mobile knowledge access;
- field-event interpretation;
- signal explanation;
- RFQ and procurement workflow assistance;
- repetitive report and document preparation.

However, consequential actions require permissions, audit trail, and human approval.

### 6. Product principle

The guiding question for future features is:

> Does this really require a human to do it?

A second control question must always follow:

> If not, is it safe and permitted for the system to do it without approval?

## Consequences

### Positive

- The product vision now fits the real contractor pain better.
- The MVP remains focused and executable.
- Document control keeps its importance as the first source-of-truth layer.
- Future modules can be added without pretending they belong in the first MVP.
- AI and automation have a clear role, but not uncontrolled autonomy.

### Risks

- The broader vision can create scope creep.
- The product may become too generic if not anchored in concrete project signals.
- Automation around procurement, contract, VO, and external communication can create commercial or legal risk if not controlled.
- The name and positioning may need professional marketing review later.

## Action Items

1. Update `purpose.md` to reflect the Project Signal Wizard vision.
2. Update `roadmap.md` so the current MVP is framed as the Document Control Section MVP within the wider product roadmap.
