# DC Agent — Product Roadmap

## Roadmap Principle

Build a reliable system of record first, then add AI assistance, then add controlled tool-calling, and only later consider autonomous multi-step behavior.

The product should start as a deterministic document-control system for mechanical, piping, steelwork, and fabrication contractors. The long-term direction is a Project Execution Copilot, but that vision must be reached through controlled, auditable, useful modules.

---

## Phase 0 — Product Framing and Domain Grounding

### Goal
Define the exact document-control workflow for the first customer profile.

### Target User
Mechanical / steelwork contractor working under an EPC or project-management company.

### Core Decisions
- Which document types are in scope first.
- Which statuses are supported.
- Which workflows are mandatory.
- Which reports are business-critical.
- Which actions require human approval.
- Which metadata fields are required for every document.

### Outputs
- Domain model draft.
- Document type catalogue.
- Status catalogue.
- Revision rules.
- Workflow rules.
- Permissions matrix.
- MVP report list.

### Avoid
- Building a generic project-management system.
- Building agents before the workflow is understood.
- Designing for every industry from day one.

### Exit Criteria
The team can describe, on paper, how one document enters the system, becomes controlled, is revised, transmitted, reviewed, approved, superseded, and reported.

---

## Phase 1 — Core Document Control System

### Goal
Create the operational backbone: a controlled document register.

### Scope
- Projects.
- Companies.
- Users and roles.
- Document register.
- Document metadata.
- File upload.
- Revision records.
- Current revision indicator.
- Superseded revision handling.
- Basic document status.
- Audit trail.

### Main Product Value
The project team can stop managing the master register in Excel.

### Key Screens
- Project dashboard.
- Master Document Register.
- Document details.
- Revision history.
- Upload screen.
- Audit history.

### AI Level
None, or very limited optional assistance.

### Risks
- Overcomplicating the metadata model.
- Allowing uncontrolled edits to official records.
- Treating files as the core instead of the register.

### Exit Criteria
A real project can maintain its controlled document register in the system with traceable revisions and audit history.

---

## Phase 2 — Transmittals, Submittals, and Workflow Tracking

### Goal
Control document movement between parties.

### Scope
- Incoming transmittals.
- Outgoing transmittals.
- Submittal packages.
- Review cycles.
- Due dates.
- Comments and response status.
- Distribution history.
- Acknowledgement tracking.
- Overdue action tracking.

### Main Product Value
The PM and project engineer can see what was submitted, what is under review, what is late, and what came back with comments.

### Key Reports
- Submittal register.
- Transmittal register.
- Overdue reviews.
- Returned-with-comments report.
- Documents pending internal action.

### AI Level
Still mostly deterministic.

### Risks
- Trying to support every EPC workflow too early.
- Making status changes too flexible and losing control.
- Sending external communication without strong approval flow.

### Exit Criteria
The system can replace a spreadsheet-based submittal/transmittal tracker for the first target workflow.

---

## Phase 3 — AI-Assisted Metadata Extraction

### Goal
Reduce manual registration effort.

### Scope
- OCR / text extraction pipeline.
- Document type detection.
- Metadata extraction.
- Revision extraction.
- Duplicate detection.
- Suggested register entry.
- Human review and confirmation.
- Confidence scoring.
- Extraction audit log.

### Main Product Value
A document controller or project engineer uploads documents and receives suggested metadata instead of typing everything manually.

### AI Level
LLM-assisted parsing and classification.

### Human Approval
Required before extracted data becomes official.

### Risks
- Trusting AI output too much.
- Poor extraction from scans, drawings, and inconsistent title blocks.
- Silent metadata corruption.
- Cost and latency from overusing LLMs.

### Exit Criteria
The system can correctly suggest useful metadata for a meaningful percentage of common project documents, while keeping the human in control.

---

## Phase 4 — Completeness Checks and Package Readiness

### Goal
Move from document tracking to project-control intelligence.

### Scope
- Package definitions.
- Required document templates by package type.
- Material submittal completeness.
- Welding package completeness.
- QA/QC record completeness.
- Turnover package readiness.
- Missing document detection.
- Readiness percentage.
- Gap reports.

### Main Product Value
The team can know early what is missing instead of discovering it during turnover or audit.

### AI Level
Hybrid:
- Rules for required documents.
- AI assistance for classification and matching.
- Human review for uncertain matches.

### Risks
- Package logic becoming too custom per client.
- False confidence in readiness scores.
- Ignoring contractual project-specific requirements.

### Exit Criteria
A project team can define a package and see what is complete, missing, late, or blocked.

---

## Phase 5 — QA/QC and Turnover Module

### Goal
Support mechanical completion and closeout.

### Scope
- QA/QC document linking.
- Inspection records.
- Weld records.
- NDT records.
- Hydrotest records.
- Material certificates.
- Punch / closure evidence references.
- Turnover dossier compilation.
- Final archive export.

### Main Product Value
The contractor can prepare turnover packages continuously, not at the end in panic mode.

### AI Level
Assisted matching, summarization, and gap detection.

### Risks
- Trying to replace a dedicated QA/QC system too early.
- Weak traceability between field records and controlled documents.
- Generating closeout packages that look complete but are not contractually valid.

### Exit Criteria
The system can produce a controlled turnover package status and support final dossier compilation.

---

## Phase 6 — Project Execution Signals

### Goal
Turn controlled document data into management signals.

### Scope
- Delay indicators from overdue reviews.
- Risk indicators from missing approved documents.
- Fabrication-blocking document alerts.
- Construction-blocking document alerts.
- Open commitments from correspondence.
- Potential claim / delay-notice prompts.
- Project management dashboard.

### Main Product Value
The system starts behaving like an experienced project-control assistant, not just a register.

### AI Level
LLM-assisted analysis and summarization over structured data.

### Human Approval
Required before any contractual communication or claim-related action.

### Risks
- Overstating risk conclusions.
- Giving legal/contractual advice without review.
- Producing noisy alerts that users ignore.

### Exit Criteria
The system reliably surfaces useful project risks and next actions from controlled project data.

---

## Phase 7 — Project Execution Copilot

### Goal
Support young engineers with practical, contextual project guidance.

### Scope
- Natural-language project questions.
- Contextual document and workflow search.
- Suggested next actions.
- Meeting preparation.
- Review-cycle summaries.
- Action-item follow-up.
- Drafting support for RFIs, TQs, and internal updates.
- Controlled tool-calling behind permissions.

### Main Product Value
A young engineer can operate with stronger project awareness, better discipline, and fewer missed obligations.

### AI Level
Tool-calling workflow with strict boundaries.

### Risks
- Building a chatbot instead of an execution assistant.
- Letting the model mutate records directly.
- Poor permission boundaries.
- Weak auditability.
- Overreliance by inexperienced users.

### Exit Criteria
The copilot can answer project-status questions and prepare recommended actions using trusted system data, while keeping approvals and traceability intact.

---

## Architecture Workstreams

### Backend
- Spring Boot modular monolith first.
- Clear domain boundaries.
- OracleDB as system of record.
- Strong audit log model.
- Background job workers for OCR, parsing, notifications, and reports.

### Frontend
- React web UI first.
- Mobile UI later for field access and notifications.
- Document register, review workflows, and dashboards before advanced chat UI.

### AI / Document Understanding
- OCR pipeline.
- Text extraction.
- Metadata extraction.
- Confidence scoring.
- Human validation screen.
- Prompt/version logging.
- Evaluation dataset.

### Security and Governance
- Role-based access control.
- Project/company isolation.
- Document permissions.
- External sharing controls.
- Audit trail for every sensitive action.
- Retention and deletion policy.

### Integrations
- Email ingestion later.
- SharePoint / cloud storage later.
- EPC platforms such as Aconex, Procore, or Autodesk Construction Cloud only after core workflow is proven.
- MCP only if reusable tool boundaries become valuable.

---

## Recommended MVP Boundary

The first MVP should include:

- Project setup.
- Company/user/role setup.
- Document register.
- File upload.
- Metadata entry.
- Revision control.
- Status tracking.
- Basic transmittal tracking.
- Audit trail.
- MDR report.
- Overdue review report.

The first MVP should not include:

- Autonomous agents.
- Multi-agent architecture.
- Full project-management scope.
- Deep RAG over all files.
- Complex external integrations.
- AI-generated official approvals.

---

## Product Strategy Summary

1. Build the normal document-control workflow first.
2. Add AI extraction as an assistant layer.
3. Add package readiness and gap detection.
4. Add QA/QC and turnover workflows.
5. Add project-risk signals.
6. Add controlled copilot behavior.
7. Add broader project-management capabilities only after the system has reliable project data.
