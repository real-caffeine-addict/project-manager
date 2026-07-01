# Project Signal Wizard — Product Roadmap

## Roadmap Principle

Build the reliable project-data backbone first.

Start with document control because it is the strongest source of truth in contractor-side project execution. Then connect material control, QA/QC records, procurement workflows, subcontractor signals, contract/VO awareness, and project execution guidance.

The long-term product direction is not a generic document-control system and not a generic chatbot.

The long-term direction is a project signal mentor: a system that helps project managers and discipline leads notice earlier what experienced project managers would notice from weak signals across documents, material movement, quality records, reports, and communications.

---

## Strategic Pivot

### Previous framing

Project Signal Wizard starts as a document-control system and later becomes a project execution copilot.

### Refreshed framing

Project Signal Wizard starts with the document-control section of a broader contractor project-control assistant.

The document-control MVP remains valid, but its meaning changes:

- It is not the whole product.
- It is the first truth layer.
- It is the base for later signals, readiness checks, automation, and guided project execution.

---

## Product North Star

Help project managers move from field noise to structured project signals.

The system should identify mismatches, missing records, blockers, risks, and decision points early enough for the manager to act before the problem becomes an evening crisis.

---

## Phase 0 — Product Framing and Domain Grounding

### Goal
Define the first controlled project-data section: document control.

### Target User
Contractor-side project manager, project engineer, or discipline manager working under an EPC, owner, or project-management company.

### Core Decisions
- Which document types are in scope first.
- Which statuses are supported.
- Which workflows are mandatory.
- Which reports are business-critical.
- Which actions require human approval.
- Which metadata fields are required for every document.
- Which document records are needed later for project signals.

### Outputs
- Domain model draft.
- Document type catalogue.
- Status catalogue.
- Revision rules.
- Workflow rules.
- Permissions matrix.
- MVP report list.
- Initial signal assumptions from document-control data.

### Avoid
- Building a generic project-management system.
- Building agents before the workflow is understood.
- Designing for every industry from day one.
- Expanding to procurement, warehouse, safety, or VO before the document section is usable.

### Exit Criteria
The team can describe how one document enters the system, becomes controlled, is revised, transmitted, reviewed, approved, superseded, reported, and later used as evidence for execution decisions.

---

## Phase 1 — Document Section MVP

### Goal
Create the first trusted project-data backbone: a controlled document register.

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
- Basic transmittal tracking.
- Audit trail.
- MDR report.
- Overdue review report.

### Main Product Value
The project team can stop managing the master document register in Excel and can maintain reliable document truth inside the system.

### Strategic Value
This MVP creates the document-data layer required for future project signals.

### Key Screens
- Project dashboard.
- Master Document Register.
- Document details.
- Revision history.
- Upload screen.
- Audit history.
- Basic reports.

### AI Level
None, or very limited optional assistance.

The priority is reliability, traceability, and clean data.

### Risks
- Overcomplicating the metadata model.
- Allowing uncontrolled edits to official records.
- Treating files as the core instead of the register.
- Building future modules before document truth is stable.

### Exit Criteria
A real project can maintain its controlled document register in the system with traceable revisions, basic transmittals, status tracking, and audit history.

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

### Future Signal Value
Late reviews, open comments, missing acknowledgements, and returned-with-comments documents become early project-risk signals.

### AI Level
Mostly deterministic.

### Risks
- Trying to support every EPC workflow too early.
- Making status changes too flexible and losing control.
- Sending external communication without strong approval flow.

### Exit Criteria
The system can replace a spreadsheet-based submittal/transmittal tracker for the first target workflow.

---

## Phase 3 — AI-Assisted Project Data Capture

### Goal
Reduce manual registration effort and improve document-data quality.

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
The system can correctly suggest useful metadata for common project documents while keeping the human in control.

---

## Phase 4 — Package Readiness and Execution Signals from Documents

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
- Initial project signals from document data.

### Main Product Value
The team can know early what is missing instead of discovering it during fabrication, installation, turnover, or audit.

### AI Level
Hybrid:

- Rules for required documents.
- AI assistance for classification, matching, summarization, and explanation.
- Human review for uncertain matches.

### Risks
- Package logic becoming too custom per client.
- False confidence in readiness scores.
- Ignoring contractual project-specific requirements.
- Producing noisy alerts that users ignore.

### Exit Criteria
A project team can define a package and see what is complete, missing, late, blocked, or risky.

---

## Phase 5 — Material / Warehouse Control

### Goal
Add the second major project truth source: material movement.

### Scope
- Material register.
- Warehouse receipts.
- Material issue records.
- Material reservation / allocation.
- Material linkage to drawings, isometrics, MTO/BOM, systems, areas, and packages.
- Material certificates and release documentation.
- Missing-material reports.
- Wrong-material / wrong-revision checks.

### Main Product Value
The PM can see whether the physical project reality matches the document reality.

### AI / Automation Level
Mostly deterministic at first.

AI may assist with BOM/MTO extraction, document matching, and natural-language material queries.

### Risks
- Building a full ERP or inventory system too early.
- Weak linkage between materials and project documents.
- Poor warehouse data quality.
- Treating material movement as clerical data instead of execution evidence.

### Exit Criteria
The system can detect basic mismatches between planned work, approved documents, available material, and issued material.

---

## Phase 6 — QA/QC and Turnover Control

### Goal
Support mechanical completion and closeout continuously, not only at the end.

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
- Quality-gate signals before field execution or handover.

### Main Product Value
The contractor can prepare turnover packages continuously and avoid late closeout panic.

### AI Level
Assisted matching, summarization, and gap detection.

### Risks
- Trying to replace a dedicated QA/QC system too early.
- Weak traceability between field records and controlled documents.
- Generating closeout packages that look complete but are not contractually valid.

### Exit Criteria
The system can produce a controlled turnover package status and support final dossier compilation.

---

## Phase 7 — Procurement, RFQ, and Supplier Follow-Up Assistance

### Goal
Automate repetitive procurement preparation work while keeping human decisions in control.

### Scope
- BOM/MTO-assisted RFQ preparation.
- Approved vendor lists.
- RFQ package generation.
- Supplier follow-up reminders.
- Supplier response tracking.
- Quotation comparison support.
- Price trend awareness for relevant commodities where data is available.

### Main Product Value
The procurement team and PM spend less time chasing suppliers and preparing repetitive packages.

### AI / Agent Level
Tool-calling workflows with strict boundaries.

The system may prepare, send, remind, summarize, and compare according to approved workflows.

### Human Approval
Required for supplier selection, commercial commitments, contract changes, and sensitive external communication.

### Risks
- Sending wrong or sensitive information to suppliers.
- Acting outside approved vendor lists.
- Overstating commodity-price predictions.
- Confusing draft recommendations with procurement decisions.

### Exit Criteria
The system can prepare RFQ packages, track supplier responses, summarize gaps, and keep humans in control of decisions.

---

## Phase 8 — Contract, VO, and Commercial Exposure Signals

### Goal
Help project teams identify and document commercial exposure early.

### Scope
- Change-event log.
- VO candidate tracking.
- Delay and disruption evidence references.
- Instruction / correspondence linkage.
- Acceleration evidence tracking.
- Open commercial issue dashboard.
- Draft notices and internal summaries.

### Main Product Value
The project team can see where it is doing work, taking risk, or accumulating cost without a clean commercial path.

### AI Level
LLM-assisted summarization, evidence grouping, and draft preparation.

### Human Approval
Always required before contractual communication, claims, notices, or commercial decisions.

### Risks
- Giving legal or contractual advice without review.
- Producing weak or misleading claim logic.
- Missing project-specific contractual requirements.
- Encouraging overreliance by inexperienced users.

### Exit Criteria
The system can identify candidate commercial issues and prepare structured evidence summaries for human review.

---

## Phase 9 — Project Signal Mentor

### Goal
Turn project records into short, timely, useful management signals.

### Scope
- Signal generation from documents, materials, QA/QC, procurement, correspondence, and field reports.
- Priority scoring.
- Daily PM brief.
- Mobile alerts.
- Meeting preparation.
- Suggested checks and next actions.
- Signal feedback loop.
- Learning from which alerts were useful, ignored, or confirmed.

### Main Product Value
The system helps the PM notice earlier what an experienced project manager would notice from weak signals.

### AI / ML Level
Hybrid:

- Deterministic checks for hard rules.
- LLM summarization and explanation.
- ML later for signal ranking and pattern improvement after enough real data exists.

### Risks
- Alert fatigue.
- False confidence.
- Bad prioritization.
- Hidden autonomous behavior.
- Weak auditability.

### Exit Criteria
The system reliably surfaces useful project risks, blockers, mismatches, and recommended checks before they become unmanaged crises.

---

## Phase 10 — Project Execution Copilot

### Goal
Support project managers and discipline leads with contextual project guidance.

### Scope
- Natural-language project questions.
- Contextual document and workflow search.
- Suggested next actions.
- Meeting preparation.
- Review-cycle summaries.
- Action-item follow-up.
- Drafting support for RFIs, TQs, RFQs, notices, and internal updates.
- Controlled tool-calling behind permissions.

### Main Product Value
A project manager can operate with stronger project awareness, better discipline, and fewer missed obligations.

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
- Background job workers for OCR, parsing, notifications, reports, and signal generation.

### Frontend
- React web UI first.
- Mobile UI later for field access, warehouse use, alerts, and quick project briefs.
- Document register, review workflows, reports, and dashboards before advanced chat UI.

### AI / Document Understanding
- OCR pipeline.
- Text extraction.
- Metadata extraction.
- Confidence scoring.
- Human validation screen.
- Prompt/version logging.
- Evaluation dataset.

### Signals / Automation
- Event intake.
- Event normalization.
- Rule checks.
- Signal generation.
- Priority scoring.
- Notification routing.
- Feedback loop.

### Security and Governance
- Role-based access control.
- Project/company isolation.
- Document permissions.
- External sharing controls.
- Audit trail for every sensitive action.
- Retention and deletion policy.
- Human approval for consequential actions.

### Integrations
- Email ingestion later.
- SharePoint / cloud storage later.
- ERP/procurement/warehouse integrations later.
- EPC platforms such as Aconex, Procore, or Autodesk Construction Cloud only after core workflow is proven.
- MCP only if reusable tool boundaries become valuable.

---

## Recommended First MVP Boundary

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

- Warehouse/material control.
- Procurement automation.
- Autonomous agents.
- Multi-agent architecture.
- Full project-management scope.
- Deep RAG over all files.
- Complex external integrations.
- AI-generated official approvals.

---

## Updated Execution Strategy

1. Refresh the roadmap and product purpose around the broader Project Signal Mentor vision.
2. Build the Document Section MVP according to the original plan, without expanding its scope.
3. Move faster through the document MVP because the broader product scope is now larger and depends on reliable document truth.
4. After the first MVP is usable, define the next product sections: material/warehouse, QA/QC, procurement, commercial/VO, and signal mentor workflows.
5. Add AI and automation only where they reduce real manual work or improve signal detection.
6. Keep human approval for consequential actions.
