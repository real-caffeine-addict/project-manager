# Revision Rules - Preliminary

## Purpose

This document defines the preliminary revision rules for DC Agent MVP.

The goal is to protect document-control integrity by preventing uncontrolled overwrites, unclear revision history, and unaudited changes.

This is a Phase 0 definition file. Detailed permissions, role authority, and workflow behavior will be defined in later Phase 0 documents.

## 1. Core Rule

A controlled document keeps its identity across revisions.

Each revision represents a controlled issue/version of that document.

File name must include revision number.

## 2. Revision Identity

Each revision should be uniquely identified by:

```text
Project + Document Number + Revision Number
```

Example:

```text
Project: PB
Document Number: PB-MEC-DWG-001
Revision Number: 0
```

This combination should be unique inside the project.

## 3. Creating a New Revision

A new revision is created when the same document identity receives a new revision number.

A new revision should normally copy forward key document metadata and receive new revision-specific metadata.

Common copied fields:

Document Number

Document Title

Document Type

Common revision-specific fields:

Revision Number

Revision Date

Revision Status

Authority to create revisions will be defined in the Roles and Permission Matrix.

## 4. Superseding

When a newer controlled revision becomes current, the previous current revision should normally become `Superseded`.

Superseded revisions must remain visible in revision history.

Superseded revisions must not be deleted, overwritten, or hidden.

## 5. Cancelled / Revoked Revisions

A revision may be cancelled if it was issued in error, withdrawn, or declared invalid.

Cancellation must require:

authorized user;

reason/comment;

audit event;

clear handling of the current revision pointer.

If the cancelled revision was current, a previous revision may become current again depending on project rules.

This must be explicit.

## 6. Rejected Revisions

A rejected revision remains rejected.

If correction or resubmission creates a new revision, the rejected revision should not be changed back to submitted.

Example:

```text
Rev 0 = Rejected
Rev 1 = Submitted
```

## 7. Approved with Comments

`Approved with Comments` is still an approved status.

Comments implementation should be handled through a new revision when required.

The system should not treat `Approved with Comments` as rejection.

## 8. Revision Number Convention

The system uses a single revision field:

```text
Revision Number
```

The value may be numeric or alphanumeric.

Default convention:

| Stage | Revision Number Pattern | Meaning |
| --- | --- | --- |
| Preliminary / Internal | A, B, C... or P1, P2, P3... | Internal/preliminary development revisions. |
| AFC / IFC | 0, 1, 2... | Formal construction/implementation revisions. |

Rules:

The last internal/preliminary revision must be `Approved` or `Approved with Comments` before Rev 0 is issued.

Rev 0 must be the first AFC/IFC revision.

Later AFC/IFC revisions should continue numerically unless project rules define otherwise.

Project-specific conventions may override the default, but the project convention must be explicit.

## 9. Revision Number vs Revision Status

Revision Number and Revision Status are different.

| Concept | Example | Meaning |
| --- | --- | --- |
| Revision Number | A, B, P1, P2, 0, 1 | Version / issue-stage identifier. |
| Revision Status | Draft, Submitted, Approved, Rejected, Superseded | Lifecycle/control state. |

A revision number may carry commercial, distribution, or project-stage meaning, but it should not replace status.

## 10. File Handling

Files are never replaced once registered.

This applies to every registered revision status, including `Draft`.

A private, non-official working file that exists outside the registry is not controlled by the system.

Once a draft enters the registry, it becomes an official draft and must be preserved.

If a wrong file was registered, the correction must be handled through an audited action, cancellation, or a new revision according to project rules.

## 11. Metadata Changes

Metadata changes are part of the revision lifecycle and must be audited.

The system should control metadata editing according to revision status and permissions.

Detailed edit permissions will be defined in the Roles and Permission Matrix.

## 12. Deletion

Controlled revisions should not be deleted in normal use.

Use cancellation instead.

Physical deletion should be limited to admin/system maintenance cases and should not be available in normal MVP UI.

## 13. Tracking by Document Type

Every document is tracked.

Project-generated documents carry their own revision.

Other received or supporting documents may be tracked through submittal, package, transmittal, or attachment context according to the document type matrix.

Strict revision control from day one applies to:

Contractual documents

Engineering input/output

QA/QC documents

RCO / CO

Turnover-related controlled documents

## 14. Certificate-Specific Rule

Certificates are tracked documents, but they often require validity tracking more than normal revision behavior.

Certificate metadata may include:

issue date;

expiry date;

issuing authority;

validity scope;

linked equipment, person, material, or instrument.

Certificates should not be forced into drawing-style revision behavior unless project procedure requires it.

## 15. Audit Requirements

Every revision action must create an audit event.

Audit records should include:

actor;

timestamp;

target document/revision;

action;

previous value, when applicable;

new value, when applicable;

reason/comment, when required;

source action, when applicable.

## 16. MVP Implementation Stance

For MVP:

implement Document and Document Revision clearly;

do not overwrite controlled revisions;

do not replace registered files;

use a current revision pointer;

use controlled revision statuses;

use a single Revision Number field;

audit every revision action;

keep permission rules explicit;

do not build a full configurable revision-rule engine yet.

The MVP should be strict enough to protect document control, but not so configurable that it becomes a framework before the first workflow is proven.
