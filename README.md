# DC Agent

**DC Agent** is an early-stage product initiative for building a controlled, auditable document-control system for project execution environments.

The project starts with a focused document-control workflow for mechanical, piping, steelwork, and fabrication contractors working under EPC contractors, project-management companies, subcontractors, suppliers, and client representatives.

The long-term vision is to evolve into a **Project Execution Copilot**: a system that helps young engineers and project teams operate with stronger discipline, better traceability, and fewer missed obligations. That vision will only be reached after the core system of record is reliable.

---

## Current Phase

**Phase 0 — Product Framing and Domain Grounding**

This repository is currently in the product-definition stage. The goal of Phase 0 is not to build features yet. The goal is to define the domain clearly enough that implementation can start without guessing.

Phase 0 focuses on answering one practical question:

> How does one project document enter the system, become controlled, move through revision, transmission, review, approval, supersession, and reporting?

Until that workflow is clear, implementation should remain minimal.

---

## Product Principle

Build a reliable system of record first.
Then add AI assistance.
Then add controlled tool-calling.
Only later consider autonomous multi-step behavior.

This project must not start as a generic chatbot, a vague agent framework, or a broad project-management platform. It must start as a deterministic document-control system with clear records, explicit workflows, and strong auditability.

---

## Target User

The first target user profile is:

- Mechanical contractor
- Steelwork contractor
- Piping / fabrication contractor
- Contractor working under an EPC or project-management company
- Project engineer, document controller, QA/QC engineer, or project manager responsible for controlled project documentation

The system is designed around real project-documentation pain points:

- Excel-based Master Document Registers
- Manual revision tracking
- Poor visibility of latest approved revisions
- Unclear transmittal and submittal status
- Missing acknowledgements
- Late reviews
- Superseded documents being used by mistake
- Weak audit trails
- Difficult project closeout and turnover preparation

---

## Phase 0 Objectives

Phase 0 should produce clear written decisions about the first version of the domain.

The expected outputs are:

- Domain model draft
- Document type catalogue
- Status catalogue
- Revision rules
- Workflow rules
- Permissions matrix
- MVP report list
- Glossary of key document-control terms

These outputs are more important than writing application code at this stage.

---

## Phase 0 Scope

Phase 0 is concerned with product and domain clarity.

In scope:

- Document-control concepts
- Document lifecycle
- Revision lifecycle
- Transmittal and submittal concepts
- Document statuses
- Internal and external project parties
- Required metadata
- Audit requirements
- Approval and acknowledgement concepts
- MVP reporting needs

Out of scope for Phase 0:

- Full backend implementation
- Full database schema
- UI implementation
- AI agents
- Multi-agent architecture
- External integrations
- Production OCR pipeline
- RAG over all project files
- Automated official communication
- Autonomous changes to project records

---

## Initial Domain Focus

The first controlled workflow will be based on project documents exchanged between:

- Contractor
- EPC contractor
- Client representatives
- Vendors
- Subcontractors
- Third-party inspectors
- Certification bodies

Representative document groups include:

- Engineering drawings
- Technical specifications
- Method statements
- Inspection and test plans
- Material certificates
- Welding and NDT records
- QA/QC records
- RFIs / TQs / NCRs / site instructions
- Transmittals and submittals
- Turnover and closeout records

The initial product should not attempt to support every document type in every industry. The first version should model the contractor-side workflow well.

---

## Architecture Direction

The intended technical direction is:

- **Backend:** Spring Boot / Java
- **Database:** OracleDB as the system of record
- **Web UI:** React
- **Mobile UI:** React Native, later
- **Background processing:** workers or queued jobs for long-running tasks
- **AI:** introduced later as an assistant layer, not as the source of truth

The recommended starting architecture is a modular monolith, not distributed microservices. Domain boundaries should be explicit, but deployment should remain simple until the product has real usage pressure.

---

## AI Strategy

AI is part of the long-term product direction, but it is not the foundation of Phase 0 or Phase 1.

The system should distinguish between:

1. Deterministic backend logic
2. OCR and text extraction
3. LLM-assisted metadata extraction
4. Tool-calling workflows
5. Autonomous multi-step agents
6. Human-in-the-loop review and approval

The default rule is simple:

> AI may suggest. The system validates. A human approves. The audit trail records.

No AI component should silently mutate official project records.

---

## Security and Governance Principles

Project documents may contain sensitive commercial, engineering, contractual, quality, and personal information.

The system must be designed around:

- Role-based access control
- Project and company isolation
- Explicit document permissions
- Audit trail for sensitive actions
- Traceability of revisions and approvals
- Data minimization
- Secure handling of uploaded files
- Controlled external sharing
- Retention and deletion policy
- Human approval for risky operations

AI-related features must also include:

- Prompt/version logging
- Extraction confidence scoring
- Human validation before official registration
- Reproducible audit records
- Clear distinction between extracted text, AI suggestion, and approved metadata

---

## Phase 0 Exit Criteria

Phase 0 is complete when the team can clearly describe and document:

- What a controlled document is
- What metadata is required
- How document revisions work
- Which revision is current
- What makes a revision superseded
- How documents are transmitted
- How reviews and acknowledgements are tracked
- Which statuses are supported
- Who may perform each action
- Which reports are required for the MVP
- Which actions require human approval
- What is intentionally not supported yet

The most important exit criterion:

> The team can describe, on paper, how one document enters the system, becomes controlled, is revised, transmitted, reviewed, approved, superseded, and reported.

---

## Recommended MVP Boundary

The first MVP should include:

- Project setup
- Company setup
- User and role setup
- Document register
- File upload
- Manual metadata entry
- Revision control
- Current revision indicator
- Superseded revision handling
- Basic document status tracking
- Basic transmittal tracking
- Audit trail
- Master Document Register report
- Overdue review report

The first MVP should not include:

- Autonomous agents
- Multi-agent architecture
- Full project-management scope
- Deep RAG over all files
- Complex external integrations
- AI-generated official approvals
- Unapproved automated communication

---

## Documentation Structure

Recommended documentation structure:

```text
/docs
  purpose.md
  roadmap.md
  glossary.md
  domain-model.md
  status-model.md
  revision-rules.md
  workflow-rules.md
  permissions-matrix.md
  mvp-reports.md
```

Current key documents:

- `purpose.md` — product and role grounding around document control
- `roadmap.md` — phased product roadmap from document control to project execution copilot
- `glossary.md` — controlled terminology for the domain

---

## Development Status

This repository is not yet a production application.

Current status:

- Product framing in progress
- Domain terminology in progress
- Workflow modeling in progress
- Implementation intentionally limited until Phase 0 decisions are stable

Code should not race ahead of the domain model.

---

## Engineering Rules for This Project

1. Start boring and deterministic.
2. Treat OracleDB as the system of record.
3. Keep official records separate from uploaded files.
4. Never let an LLM directly mutate production data.
5. Validate every AI-generated result before it becomes official.
6. Log every sensitive operation.
7. Prefer explicit workflows over hidden automation.
8. Prefer human approval for contractual, quality, or external-facing actions.
9. Avoid building a generic platform before the first workflow works.
10. Add AI only where it removes real manual pain without reducing control.

---

## Near-Term Work

The next work items are:

1. Complete the glossary.
2. Define the status model.
3. Define document and revision lifecycle rules.
4. Define the first domain model draft.
5. Define the first permissions matrix.
6. Define MVP reports.
7. Only then begin implementation planning.

---

## Project Classification

Current classification:

**Product discovery / domain modeling / Phase 0 architecture preparation**

This is not yet an AI-agent implementation project. It is a document-control product being prepared for reliable implementation, with a long-term path toward AI-assisted project execution.
