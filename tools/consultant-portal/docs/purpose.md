# DC Agent — Product Purpose and Vision

## Product Definition

DC Agent is intended to become a digital document-control and project-execution assistant for industrial construction projects.

The first product wedge is an automation system for project document control. The goal is not to build a generic file repository or another simple document management system. The goal is to automate a large part of the work normally performed by a project document-control department.

In the first stage, the system should help contractors working directly with an EPC contractor or with a project-management company acting on behalf of the owner. The initial core market is mechanical erection, piping, steelwork, fabrication, and related metal works.

Long term, the wider vision is a project-management platform that gives a young engineer or project team the operational support, memory, discipline, and warning signals of an experienced project professional. The product is not intended to replace project managers or field engineers. It is intended to make them significantly more effective.

---

## Strategic Vision

The long-term vision is a Project Execution Copilot.

The system should help project teams understand what is happening, what is missing, what is late, what has changed, what is risky, and what action should be taken next.

The product should eventually support a young engineer by providing:

- Structured project memory.
- Document and revision awareness.
- Workflow and commitment tracking.
- Early warning signals for delays, missing information, quality risks, and contractual exposure.
- Practical guidance based on project context.
- Human-in-the-loop decision support.

The product should not behave as an uncontrolled autonomous project manager. Risky actions, external communication, contractual steps, and production data changes must remain permissioned, logged, and reviewable.

---

## First Product Wedge: Document Control Automation

The first core product is a digital document-control department.

The system should reduce the manual workload of a document-control function and, in smaller projects, make it realistic for one person to operate and supervise the process while supporting project management.

The commercial promise is not only better file storage. The promise is:

- Fewer document-control personnel required.
- Fewer mistakes caused by wrong revisions.
- Faster submittal and review cycles.
- Better visibility for project management.
- Better auditability and contractual traceability.
- Better readiness for turnover and closeout.

The central question the system must answer is:

> Is the right document, in the right revision, available to the right people, at the right time, and can we prove it?

---

## Initial Target Users

### Primary Users

- Mechanical contractors.
- Steelwork contractors.
- Piping and fabrication contractors.
- Site construction teams.
- Project engineers.
- QA/QC teams.
- Document controllers.
- Project managers.

### Secondary / Future Users

- EPC contractors.
- Project-management companies.
- Owner representatives.
- Engineering managers.
- Construction managers.
- Procurement and vendor-document teams.

---

## Core Project Documentation Scope

The system should initially support documentation common in mechanical construction and metal works projects, including:

### Engineering and Construction Documents

- General Arrangement Drawings (GA).
- Isometric drawings.
- Piping and Instrumentation Diagrams (P&ID).
- IFC drawings.
- Shop drawings.
- Method statements.
- Technical specifications.
- Data sheets.
- Material Take-Offs (MTO).
- Inspection and Test Plans (ITP).

### Quality and Fabrication Documents

- Material certificates.
- Welding Procedure Specifications (WPS).
- Procedure Qualification Records (PQR).
- Welder qualifications.
- NDT reports.
- Inspection reports.
- Hydrotest reports.
- QA/QC records.
- Weld maps.
- Manufacturing Record Books (MRB).
- Material Document Records (MDR).

### Correspondence and Control Documents

- Transmittals.
- Submittals.
- Requests for Information (RFI).
- Technical Queries (TQ).
- Non-Conformance Reports (NCR).
- Site Instructions (SI).
- Letters.
- Meeting minutes.
- Action items and commitments.

### Closeout Documentation

- Turnover packages.
- Mechanical completion dossiers.
- Quality dossiers.
- Final project archive.

---

## Core Functional Responsibilities

### Document Register

The document register is the operational backbone of the system.

The system must maintain structured records for project documents, including:

- Document number.
- Title.
- Discipline.
- Document type.
- Project, area, system, package, or work package.
- Originator.
- Receiver.
- Revision.
- Status.
- Dates.
- Required actions.
- Review cycle.
- Distribution history.
- Related correspondence.
- Related quality or turnover package.

The register is more important than the file itself. A file without reliable metadata is not controlled.

### Revision Control

The system must control revisions strictly.

It must:

- Track all revisions.
- Identify the current approved revision.
- Mark superseded revisions.
- Prevent uncontrolled use of old revisions.
- Expose revision gaps or inconsistent numbering.
- Record who received which revision and when.

Revision control is one of the highest-value areas of the product because wrong-revision execution can create major cost, schedule, and quality damage.

### Transmittals and Distribution

The system must manage formal document exchange between parties.

It should:

- Create and record transmittals.
- Track incoming and outgoing document packages.
- Record acknowledgements and receipts.
- Link every transmitted document to its revision and status.
- Maintain a complete distribution history.
- Support evidence for audits and disputes.

### Workflow Tracking

The system must track document workflows clearly.

Typical workflow states may include:

- Draft.
- Internal review.
- Submitted.
- Under review.
- Returned with comments.
- Approved.
- Approved as noted.
- Rejected.
- Superseded.
- Closed.

Workflow logic should be deterministic first. AI may assist classification and extraction, but it should not silently decide contractual statuses or mutate production records without validation.

### Completeness and Readiness

The system should check whether submissions, packages, and turnover dossiers are complete.

Examples:

- A material submittal may require a data sheet, certificate, catalogue, and compliance statement.
- A welding package may require WPS, PQR, welder qualification, NDT reports, weld maps, and inspection records.
- A turnover package may require final approved drawings, test reports, certificates, punch closure evidence, and QA records.

The system should make missing items visible early, not at project closeout.

### Reporting and Project Visibility

The system should generate reliable operational reports, including:

- Master Document Register (MDR).
- Drawing register.
- Submittal register.
- Vendor document register.
- Correspondence register.
- Overdue actions report.
- Review status report.
- Revision tracking report.
- Missing document report.
- Package readiness report.
- Turnover readiness report.

Reports should support project managers, project engineers, QA/QC, construction managers, and client-facing project reviews.

---

## AI Role

AI should be introduced as an assistant layer, not as the uncontrolled core of the system.

### Appropriate Early AI Use Cases

- Classify incoming documents.
- Extract document number, title, revision, date, discipline, status, and originator.
- Detect likely document type.
- Suggest package or work-area association.
- Identify missing metadata.
- Detect possible duplicate documents.
- Assist completeness checks.
- Summarize review comments or correspondence.
- Highlight inconsistencies for human review.

### AI Use Cases for Later Stages

- Identify contradictions between documents.
- Detect project risks from document delays and open commitments.
- Assist RFI/TQ preparation.
- Recommend next actions to the project engineer.
- Build contextual project memory.
- Support claim and delay-risk awareness.

### AI Boundaries

AI must not be allowed to directly and silently:

- Change approved document status.
- Replace official revisions.
- Send contractual communication externally.
- Approve or reject documents.
- Delete or overwrite audit history.
- Mutate production records without traceability.

Every AI-generated result must be validated, explainable enough for operational use, and logged.

---

## Product Principles

### Start Boring and Deterministic

The first version must solve the normal workflow before becoming agentic.

The system should first be a reliable system of record. AI becomes useful only when it operates on structured project data.

### System of Record Before Copilot

The project copilot vision depends on a trustworthy operational data layer.

Without reliable registers, statuses, revisions, workflows, and audit logs, AI will only generate polished guesses over project chaos.

### Human-in-the-Loop for Risky Actions

The system may suggest, prepare, and highlight.

Humans should approve actions that affect:

- Contractual communication.
- Formal document status.
- External distribution.
- Quality records.
- Claims or delay notices.
- Project commitments.

### Full Auditability

The system must record:

- Who did what.
- When it happened.
- Which document or revision was affected.
- What changed.
- Which AI suggestion was used, rejected, or modified.
- Which external parties received which documents.

### Permission Boundaries

Access should be role-based.

Different users may need different permissions for:

- Viewing documents.
- Uploading documents.
- Editing metadata.
- Submitting documents.
- Approving workflow steps.
- Sending transmittals.
- Managing project settings.
- Viewing commercial or contractual records.

---

## Long-Term Platform Direction

After document control is mature, the platform may expand toward broader project execution management.

Potential future modules:

1. Submittals and transmittals.
2. RFI / TQ management.
3. Action items and commitments.
4. QA/QC packages.
5. Turnover and mechanical completion.
6. Procurement and vendor-document tracking.
7. Progress tracking.
8. Risk and delay signals.
9. Project memory and contextual search.
10. Project Execution Copilot.

The expansion should be gradual. Each module should be useful without requiring a giant autonomous agent.

---

## Non-Goals for the First Stage

The first stage should not attempt to build:

- A generic full project-management platform.
- A fully autonomous project manager.
- A multi-agent system.
- A full RAG assistant over every document before structured data exists.
- Direct uncontrolled integration into EPC or client systems.
- Complex MCP infrastructure before real tool boundaries are proven.
- AI-driven approval decisions without human review.

These may become relevant later, but building them too early would increase risk, cost, and complexity before the product proves its core value.

---

## Success Criteria

The first successful product version should demonstrate that:

- All incoming and outgoing documents are registered.
- Revisions are traceable.
- Current approved revisions are clear.
- Superseded revisions are controlled.
- Transmittals and distributions are auditable.
- Document workflows are visible.
- Overdue reviews and actions are clear.
- Missing documents are detected early.
- Project managers can understand document status without searching email chains.
- Turnover readiness can be measured before project closeout.
- AI assistance reduces manual metadata entry and document-control effort without compromising control.

The practical business success criterion is:

> A contractor can manage document control for a project with significantly less manual effort, ideally with one responsible person supervising the system instead of a larger document-control team.
