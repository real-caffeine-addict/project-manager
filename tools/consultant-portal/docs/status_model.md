# Status Model

## Purpose

This document defines the preliminary MVP status model for DC Agent.

The goal is to keep statuses controlled, understandable, and useful for reporting. The system should avoid free-text statuses in the MVP because uncontrolled status values will quickly damage filtering, reporting, workflow control, and auditability.

This status model is part of Phase 0 - Product Framing and Domain Grounding.

---

## Guiding Principles

1. **Use separate status groups.**  
   Do not create one generic status field for everything.

2. **Keep statuses controlled.**  
   Users should select from predefined values, not type arbitrary statuses.

3. **Status should describe lifecycle state.**  
   Comments, reasons, and explanations should be stored separately.

4. **Status changes must be auditable.**  
   Important status changes should record who changed the status, when, from what value, to what value, and why if applicable.

5. **Avoid over-modeling in MVP.**  
   Add only the status groups required for document control, revision control, and basic transmittal tracking.

6. **Mapping Project-specific statuses.**
   Project-specific statuses should be mapped to internal status types and codes.

---

## MVP Status Groups

| Status Group | Applies To | MVP Decision | Notes |
|---|---|---|---|
| Revision Status | Document Revision | Include | Primary operational status for controlled documents. |
| Transmittal Status | Transmittal | Include | Needed for sending and tracking document movement. |
| Comment Status | Review Comment / Comment Response | Include only if comments are tracked in MVP | Useful if review comments are part of MVP workflow. |

---

## Revision Status

### Purpose

Revision Status describes the lifecycle or control state of a specific Document Revision.

The Document itself represents the stable identity. The Document Revision is the item that is prepared, submitted, reviewed, approved, rejected, superseded, or cancelled.

### Status Values

| Status | Meaning | Typical Owner / Actor | Notes |
|---|---|---|---|
| Draft | Revision is being prepared internally and is not formally submitted. | Originator / Document Controller | May be edited before formal issue. |
| Submitted | Revision was formally submitted or transmitted for review, approval, or record. | Issuer / Document Controller | Usually linked to a transmittal or submittal. |
| Under Review | Recipient or reviewer is reviewing the revision. | Reviewer / Approver | Inferred from workflow. |
| Approved | Revision accepted without blocking comments. | Approver | Can become the current controlled revision. |
| Approved with Comments | Revision accepted with comments that may require correction, response, or future revision. | Approver / Reviewer | Does not block use. |
| Rejected | Revision not accepted; correction and resubmission are required. | Approver / Reviewer | Should require reason/comment. |
| Superseded | Revision was replaced by a newer controlled revision. | System / Document Controller | Usually automatic when a newer revision becomes current. |
| Cancelled | Revision is no longer valid and should not be used. | Authorized User / Document Controller | Should require reason/comment. |

### Notes

- `Revision Status` should not be confused with `Revision Code`.
- Revision Code may carry sequence, issue-stage, or commercial/distribution meaning depending on project convention.
- Status should remain explicit and reportable.
- If a revision is cancelled or revoked, a previous revision may become current again depending on project rules. This must be handled explicitly.
- The authority to cancel an issued or approved revision should follow the latest formal action: an issued revision may be cancelled by the issuer, while an approved revision may be cancelled only by the approver or another authorized role.

---

## Suggested Revision Status Transitions

This is a preliminary transition model, not a final workflow engine design.

| From | To | Allowed? | Notes |
|---|---|---:|---|
| Draft | Submitted | Yes | Formal issue/submission. |
| Submitted | Under Review | Yes | Review started. |
| Submitted | Approved | Yes | Direct approval possible. |
| Submitted | Approved with Comments | Yes | Direct return with comments possible. |
| Submitted | Rejected | Yes | Direct rejection possible. |
| Under Review | Approved | Yes | Review completed successfully. |
| Under Review | Approved with Comments | Yes | Review completed with comments. |
| Under Review | Rejected | Yes | Revision rejected. |
| Approved | Superseded | Yes | Newer revision replaces it. |
| Approved with Comments | Superseded | Yes | Newer revision replaces it. |
| Rejected | Draft | Yes | Internal correction before resubmission. |
| Rejected | Submitted | Usually no | If resubmission creates a new revision, the rejected revision should remain Rejected and the new revision should be submitted separately. |
| Draft | Cancelled | Yes | Draft abandoned. |
| Submitted | Cancelled | Yes | Requires authorization and reason. |
| Under Review | Cancelled | Yes | Requires authorization and reason. |
| Approved | Cancelled | Yes | Sensitive; require authorization by approver and reason. |
| Superseded | Current | No direct status | Current Revision should be modeled as a pointer/indicator, not as a status value. |

---

## Transmittal Status

### Purpose

Transmittal Status describes the lifecycle state of a formal sending record between project parties.

A Transmittal is not the same as a Document Revision. A transmittal may contain one or more Transmittal Items, each usually referencing a Document Revision.

### Status Values

| Status | Meaning | Notes |
|---|---|---|
| Draft | Transmittal is being prepared and has not been issued. | Editable. |
| Issued | Transmittal was formally sent or released. | Should become locked or mostly locked. |
| Received | Recipient acknowledged receipt. | Does not mean approved. |
| Closed | Transmittal no longer requires action. | May be manual or workflow-driven. |
| Cancelled | Transmittal was cancelled and should not be treated as valid. | Should require reason/comment. |

### Notes

- `Received` is not the same as `Approved`.
- `Acknowledgement` confirms receipt or recognition, not technical or commercial acceptance.
- Receipt should be tracked both as status and acknowledgement.
- Once issued, a transmittal should generally not be silently edited. Corrections should be audited or handled through a revised/corrected transmittal process.

---

## Suggested Transmittal Status Transitions

| From | To | Allowed? | Notes |
|---|---|---:|---|
| Draft | Issued | Yes | Formal sending action. |
| Draft | Cancelled | Yes | Draft abandoned. |
| Issued | Received | Yes | Receipt acknowledged. |
| Issued | Closed | Yes | May close without explicit receipt depending on workflow. |
| Received | Closed | Yes | Normal closure. |
| Issued | Cancelled | Yes | Sensitive; should require reason. |
| Received | Cancelled | Usually no | Prefer correction/reversal process if already received. |
| Closed | Cancelled | Usually no | Prefer correction/reversal process. |

---

## Comment Status

### Purpose

Comment Status describes the response or closure state of a review comment.

This status group is only required if the MVP includes structured review comments and comment responses.

### Status Values

| Status | Meaning | Notes |
|---|---|---|
| Open | Comment requires response or action. | Default when comment is created. |
| Responded | A response was provided but not necessarily accepted. | Useful when response review is required. |
| Closed | Comment was resolved or accepted as closed. | Should record who closed it. |
| Rejected Response | Response was not accepted and further action is required. | Optional for MVP. |
| Cancelled | Comment was withdrawn or marked not applicable. | Should require reason/comment. |

### Notes

- Comment Status should not be confused with Revision Status.
- A revision may be `Approved with Comments` while individual comments remain `Open` or `Responded`.
- For MVP, no comment tracking is required. Comments treated as general.

---

## Implementation Notes

### Recommended Backend Approach

Use controlled enum-like values for MVP, but do not hard-code business meaning only in the UI.

A practical approach:

- Store statuses as stable codes.
- Display human-readable labels in the UI.
- Keep allowed transitions in backend logic or configuration.
- Record status changes in the audit trail.

Example status code style:

```text
REVISION_DRAFT
REVISION_SUBMITTED
REVISION_UNDER_REVIEW
REVISION_APPROVED
REVISION_APPROVED_WITH_COMMENTS
REVISION_REJECTED
REVISION_SUPERSEDED
REVISION_CANCELLED
```

### Audit Requirements for Status Changes

Every important status change should record:

- target object type
- target object ID
- previous status
- new status
- actor
- timestamp
- reason/comment, when required
- source action, such as upload, submit, approve, cancel, supersede

### UI Requirements

The UI should:

- show statuses with clear labels;
- avoid exposing internal codes directly;
- prevent invalid transitions;
- require comments/reasons for sensitive transitions;
- distinguish receipt/acknowledgement from approval;
- distinguish Revision Status from Revision Code.

---

## MVP Decision Summary

For MVP:

- Revision Status
- Transmittal Status
- Comment Status only if structured comments are included