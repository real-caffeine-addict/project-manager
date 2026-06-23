# MVP Scope Boundaries

## Purpose

Define the implementation boundary for DC Agent MVP.

This document closes Phase 0 and summarizes what belongs in the first build, what is explicitly out of scope, and which rules must not be violated during implementation.

---

## MVP Product Scope

DC Agent MVP is a contractor-side document-control system.

It is designed for the contractor’s internal project execution, document control, review tracking, and management visibility.

Client, Owner, EPC, vendor, subcontractor, and third-party companies are tracked as project parties, originators, recipients, reviewers, or approvers in metadata.

They are not primary system users in the MVP.

---

## MVP Includes

The MVP includes:

- project setup;
- company/project party registry;
- user roles and RBAC;
- document register;
- document types/families;
- document revisions;
- stored files linked to revisions or controlled records;
- controlled revision status model;
- current revision pointer;
- transmittals/submittals;
- incoming document registration;
- incoming review result tracking;
- RCO / CO registration with human control;
- basic certificate tracking through documents, submittals, transmittals, packages, or attachments;
- cancellation/revocation handling;
- superseding handling;
- audit trail for controlled write actions;
- basic reports and report export.

---

## MVP Excludes

The MVP does not include:

- client/EPC/owner portal;
- full multi-party collaboration platform;
- full workflow engine;
- autonomous agents;
- AI-driven official actions;
- AI approval/rejection/cancellation/issue/superseding;
- full QA/QC package management;
- full turnover dossier workflow;
- full departmental certificate management;
- procurement management;
- financial forecasting;
- schedule forecasting;
- budget/cashflow analysis;
- automated claims preparation;
- automated RCO generation;
- legal position generation;
- ISO compliance certification;
- BI integration;
- polished dashboard design;
- mobile app unless separately approved.

---

## Deferred Until Later

The following may be added after the core system of record is stable:

- structured comment-response workflow;
- detailed distribution workflow;
- package readiness workflow;
- turnover dossier generation;
- QA/QC module;
- certificate validity workflows;
- procurement/logistics workflows;
- AI metadata extraction;
- AI document classification;
- AI-assisted report drafting;
- RCO wizard;
- claim package generator;
- push notifications;
- advanced dashboards;
- integrations with external systems;
- mobile application.

---

## Non-Negotiable Rules

Implementation must preserve these rules:

- registered files are never replaced;
- registered drafts are official records;
- every controlled write action is audited;
- no silent mutation of controlled records;
- current revision is a pointer, not a status;
- revision status and revision number are different;
- superseded, rejected, and cancelled revisions remain visible;
- RCO / CO actions require human approval;
- AI must not approve, reject, cancel, issue, supersede, or perform official RCO/CO actions;
- RBAC grants system access only;
- system permissions do not replace legal, professional, contractual, or regulatory authority.

---

## Minimal Implementation Boundary

The first implementation should focus on:

- stable domain model;
- database schema;
- server-side permission checks;
- controlled file registration;
- revision lifecycle;
- transmittal/submittal tracking;
- incoming review tracking;
- RCO/CO registration;
- audit events;
- basic reports.

Avoid building:

- framework-level workflow configurators;
- multi-agent systems;
- complex authority engines;
- advanced analytics;
- custom dashboard design;
- broad external collaboration features.

---

## Success Criteria

MVP is successful if it can reliably answer:

- What documents exist in the project?
- What is the current revision of each document?
- What file belongs to each registered revision?
- What was submitted, when, and to whom?
- What review result was received?
- Which documents are approved, rejected, overdue, missing, or pending action?
- What RCO/CO records exist?
- Who changed what, when, and why?
- Which reports can be reproduced from the underlying records?

---

## Implementation Stance

Build the normal deterministic system first.

AI may assist later with extraction, classification, drafting, and summarization, but only after the system has reliable records, permissions, audit trail, and human approval points.

Do not build a giant agent.

Do not let AI mutate production records without explicit user action and audit trail.

Keep the MVP boring, controlled, and correct.
