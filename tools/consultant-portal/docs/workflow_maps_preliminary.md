# Workflow Maps - Preliminary

## Purpose

This document defines preliminary MVP workflow maps for DC Agent.

The goal is to describe the core document-control flows clearly enough to support MVP design, permissions, audit requirements, and later implementation.

This is a Phase 0 definition file. It does not define the final workflow engine, UI behavior, or automation rules.

---

## Workflow Principles

1. Workflows must reflect controlled project behavior.
2. A registered draft is official and must be preserved.
3. Files are never replaced once registered.
4. Every revision action must be audited.
5. Current Revision is a pointer, not a status.
6. User authority is defined in the Roles and Permission Matrix.
7. Workflow steps should not silently mutate controlled records.
8. AI must not approve, reject, cancel, issue, supersede, or perform official CO/RCO actions.

---

## MVP Workflow List

| Workflow | MVP Scope | Notes |
|---|---|---|
| Document Registration | Include | Create controlled document identity and first revision. |
| New Revision | Include | Create a new revision for an existing document. |
| Outgoing Submission / Transmittal | Include | Issue document revisions to another project party. |
| Incoming Review Result | Include | Record returned review result, approval, comments, rejection, or revision response. |
| Incoming Document Registration | Include | Register received documents from EPC, client, vendor, subcontractor, or third party. |
| RCO / CO Registration | Include | Register change-control documents with strict human approval and permissions. |
| Cancellation / Revocation | Include | Controlled exception workflow. |
| Superseding | Include | Usually triggered when a newer revision becomes current. |
| Certificate Tracking | Submittal / Register only | Certificates are tracked through submittals, packages, transmittals, or document records; no standalone certificate workflow in MVP. |
| Comment Response | Defer / Simple MVP | Use general comments unless structured comments are required. |
| Distribution Handling | Defer detailed implementation | Basic recipients/acknowledgement only in MVP. |
| Package / Dossier Workflow | Defer | Later package readiness and turnover phases. |

---

# 1. Document Registration Workflow

## Purpose

Create a controlled document identity and its first registered revision.

## Trigger

A document needs to enter the controlled register.

## Applies To

- Project-generated documents
- Incoming documents
- Contractual documents
- Engineering documents
- QA/QC documents
- RCO / CO
- Registered correspondence
- Certificates, when registered as documents or submittal/package items

## Flow

| Step | Action | Result |
|---|---|---|
| 1 | User creates/registers document identity | Document record exists. |
| 2 | User enters required metadata | Document can be searched, filtered, and reported. |
| 3 | First revision is auto-generated | Document Revision exists. |
| 4 | User uploads digital file(s) | File(s) are linked to the revision and preserved. |
| 5 | System validates required fields | Missing required data blocks formal issue. |
| 6 | System records audit events | Registration is traceable. |

## Output

- Document
- Document Revision
- Linked Digital File(s)
- Audit events

## Rules

- File name must include revision number.
- Registered files are never replaced.
- A registered draft is official.
- Document Number + Revision Number must be unique inside the project.

---

# 2. New Revision Workflow

## Purpose

Create a new controlled revision for an existing document.

## Trigger

A document requires correction, update, resubmission, or formal next issue.

## Flow

| Step | Action | Result |
|---|---|---|
| 1 | User selects existing document | Existing document identity is reused. |
| 2 | System generates new revision number based on predefined rules | New Document Revision is created. |
| 3 | System copies key document metadata | New revision starts from existing document identity. |
| 4 | User uploads new file(s) | File(s) are linked to the new revision. |
| 5 | User updates revision-specific metadata | Revision date/status/etc. are recorded. |
| 6 | System audits creation | Revision history is traceable. |

## Output

- New Document Revision
- Linked Digital File(s)
- Audit events

## Rules

- New revision must not overwrite previous revision.
- Previous revisions remain visible.
- Superseding is handled separately when the newer revision becomes current.
- Authority to create revisions is defined in the Roles and Permission Matrix.

---

# 3. Outgoing Submission / Transmittal Workflow

## Purpose

Formally issue one or more document revisions to another project party.

## Trigger

A document revision is ready to be submitted, transmitted, or issued.

## Flow

| Step | Action | Result |
|---|---|---|
| 1 | User creates outgoing transmittal/submittal | Draft transmittal exists. |
| 2 | User adds document revision(s) | Transmittal items are linked to revisions. |
| 3 | User enters recipient and purpose | Direction and target party are clear. |
| 4 | System validates required fields | Incomplete issue is blocked. |
| 5 | Authorized user issues transmittal | Transmittal becomes Issued. |
| 6 | Revision status updates to Submitted if applicable | Revision lifecycle advances. |
| 7 | System records audit events | Issue is traceable. |

## Output

- Issued Transmittal/Submittal
- Transmittal Items
- Updated Revision Status, if applicable
- Audit events

## Rules

- Issued transmittals should not be silently edited.
- Corrections require audit trail or corrected/revised transmittal process.
- Receipt is not approval.
- Acknowledgement confirms receipt or recognition only.
- Rejection rules may be added later if required.

---

# 4. Incoming Review Result Workflow

## Purpose

Record review response for a submitted document revision.

## Trigger

A project party returns a review result, reviewed revision, comment sheet, approval, rejection, or marked-up document.

## Flow

| Step | Action | Result |
|---|---|---|
| 1 | User registers incoming review result | Incoming response is recorded. |
| 2 | User links response to submitted revision | Review result is traceable to original submission. |
| 3 | User records review code/status | Internal revision status is updated. |
| 4 | User attaches returned files/comments | Review evidence is preserved. |
| 5 | System updates revision status | Approved, Approved with Comments, Rejected, etc. |
| 6 | System records audit events | Review outcome is traceable. |

## Output

- Linked review response
- Updated Revision Status
- External review code, if applicable
- Returned file(s) or comments
- Audit events

## Rules

- Approved with Comments is still approved.
- Comments implementation is handled through a new revision when required.
- Rejected revisions remain rejected.
- Resubmission should create a new revision unless project rules explicitly say otherwise.
- Authority acknowledgement may be added later for PM, engineer, QA manager, or other required roles.
- Distribution handling may be added later.
- Future automation may support this workflow, but official decisions remain controlled by permissions and audit rules.

---

# 5. Incoming Document Registration Workflow

## Purpose

Register controlled documents received from another project party.

## Trigger

The project receives specifications, drawings, procedures, certificates, vendor documents, letters, notices, or other controlled documents.

## Flow

| Step | Action | Result |
|---|---|---|
| 1 | User registers incoming document | Document/revision or tracked item is created. |
| 2 | User records originator and direction | Source party is clear. |
| 3 | User enters document metadata | Document becomes searchable/reportable. |
| 4 | User uploads received file(s) | Received evidence is preserved. |
| 5 | User links to transmittal/package if applicable | Context is preserved. |
| 6 | System records audit events | Receipt and registration are traceable. |

## Output

- Registered incoming document/revision/item
- Linked file(s)
- Originator/direction metadata
- Optional transmittal/package link
- Audit events

## Rules

- Every document is tracked.
- Project-generated documents carry their own revision.
- Other received/supporting documents may be tracked through submittal, package, transmittal, or attachment context.
- Certificates are usually tracked through submittals or relevant department records.
- Authority acknowledgement may be added later for PM, engineer, QA manager, or other required roles.
- Distribution handling may be added later.
- Future automation may support this workflow, but official decisions remain controlled by permissions and audit rules.

---

# 6. RCO / CO Registration Workflow

## Purpose

Register change-control documents.

## Trigger

The project receives or issues an RCO or CO.

## Flow

| Step | Action | Result |
|---|---|---|
| 1 | User registers RCO or CO | Change-control document is recorded. |
| 2 | User records direction and originator | Source and responsibility are clear. |
| 3 | User links affected documents/revisions if known | Impact context is preserved. |
| 4 | User uploads official file(s) | Official evidence is preserved. |
| 5 | Authorized user updates status/handling | Controlled action is recorded. |
| 6 | System records audit events | Change-control history is traceable. |

## Output

- Registered RCO or CO
- Linked file(s)
- Related document/revision links, if known
- Audit events

## Rules

- RCO and CO require high privilege for sensitive actions.
- CO may exist without a related RCO.
- Every action related to RCO or CO must be human-approved.
- RCO/CO records must not be automatically closed, approved, rejected, issued, or superseded by AI.
- Financial, engineering, schedule, contractual, or legal consequences must remain human-controlled.

---

# 7. Certificate Tracking

## Purpose

Define how certificates are handled in the MVP scope.

## Scope

Certificates are tracked documents, but DC Agent MVP does not define a standalone certificate-management workflow.

Certificates are typically recorded in submittals and tracked by the relevant department, such as EHS, QA/QC, or engineering.

The document-control role is to track the relevant submittal, transmittal, package, document record, or attachment context.

## Applies To

- Equipment certificates
- Staff certificates
- Calibration certificates
- Material certificates
- Third-party certificates

## MVP Handling

| Action | MVP Handling |
|---|---|
| Register certificate as document | Allowed when required. |
| Attach certificate to submittal/transmittal/package | Allowed. |
| Track expiry/validity metadata | Allowed when required by document type or project rules. |
| Manage departmental certificate workflow | Defer. |
| Replace certificate file | Not allowed once registered. |

## Rules

- Certificates are tracked, but not managed through a standalone certificate workflow in MVP.
- Certificates usually need validity tracking more than revision tracking.
- Drawing-style revision behavior should not be forced unless project procedure requires it.

---

# 8. Cancellation / Revocation Workflow

## Purpose

Cancel or revoke a registered revision or controlled document action.

## Trigger

A revision was issued in error, withdrawn, invalidated, or formally cancelled.

## Flow

| Step | Action | Result |
|---|---|---|
| 1 | Authorized user requests cancellation | Cancellation action begins. |
| 2 | User enters reason/comment | Reason is recorded. |
| 3 | System checks authority | Unauthorized cancellation is blocked. |
| 4 | System updates status | Revision becomes Cancelled/Revoked as applicable. |
| 5 | System handles current revision pointer | Current revision remains explicit. |
| 6 | System records audit events | Cancellation is traceable. |

## Output

- Cancelled/revoked revision
- Reason/comment
- Updated current revision pointer if required
- Audit events

## Rules

- Cancellation must not delete the revision.
- If the cancelled revision was current, replacement current revision must be explicit.
- Approved/issued revision cancellation requires appropriate authority.

---

# 9. Superseding Workflow

## Purpose

Mark an older revision as replaced by a newer controlled revision.

## Trigger

A newer revision becomes current.

## Flow

| Step | Action | Result |
|---|---|---|
| 1 | New revision becomes current | Current revision pointer changes. |
| 2 | System identifies previous current revision | Previous controlled revision is found. |
| 3 | Previous revision becomes Superseded | History remains clear. |
| 4 | System records audit events | Current pointer and status change are traceable. |

## Output

- Updated current revision pointer
- Superseded previous revision
- Audit events

## Rules

- Superseded is a status.
- Current Revision is a pointer, not a status.
- Superseded revisions remain visible.
- Superseded revisions are not deleted or overwritten.

---

## Deferred Workflows

| Workflow | Reason for Deferral |
|---|---|
| Structured Comment Response Workflow | General comments are enough unless MVP requires structured comment tracking. |
| Detailed Distribution Workflow | Basic recipients and acknowledgement are enough for MVP. |
| Departmental Certificate Workflow | Certificates are tracked through submittals/packages/transmittals or department records. |
| Package Readiness Workflow | Belongs to later package/readiness phase. |
| Turnover Dossier Workflow | Belongs to later QA/QC and closeout phases. |
| Procurement Workflow | RFQ/PO/invoice handling may pull MVP outside document control. |
| AI Metadata Extraction Workflow | Later assistant layer after deterministic workflow is stable. |
| Autonomous Agent Workflow | Not appropriate before audit, permissions, rollback, and approval paths exist. |

---

## MVP Workflow Boundary

MVP workflows should support:

- registering controlled documents;
- creating revisions;
- preserving registered files;
- submitting/transmitting revisions;
- recording incoming review results;
- registering incoming documents;
- tracking RCO/CO documents;
- tracking certificates through submittal, package, transmittal, document, or attachment context;
- cancelling/revoking revisions;
- superseding revisions;
- auditing every workflow action.

MVP workflows should not yet include:

- autonomous approvals;
- AI-driven official actions;
- full procurement management;
- full departmental certificate management;
- full QA/QC package management;
- full turnover dossier compilation;
- complex configurable workflow engine.
