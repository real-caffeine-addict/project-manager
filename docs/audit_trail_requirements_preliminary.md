# Audit Trail Requirements - Preliminary

## Purpose

This document defines the preliminary audit trail requirements for DC Agent MVP.

Most audit requirements are already implied by the glossary, status model, revision rules, workflow maps, and roles/permissions matrix.
This document consolidates the minimum audit expectations so implementation has one clear reference.

## Principles

Audit every controlled action.

Any action that creates, changes, issues, cancels, supersedes, approves, rejects, or links controlled project data must be audited.

Audit records are append-only.

Audit events must not be edited or deleted through normal application use.

No silent mutation.

Controlled records must not change without an audit event.

Audit must support accountability.

It should be possible to know who did what, when, to which object, and what changed.

System permissions do not replace legal authority.

Audit trail records system activity. It does not prove that the actor had legal or professional authority unless that authority is separately recorded.
However, the system is designed to prove whether responsible personnel took sufficient documented actions to verify the required qualifications before allowing or approving the relevant operation.

AI/tool actions must be auditable.

If AI or automation suggests, prepares, extracts, links, or updates data later, the action source must be visible.

## Audit Event Minimum Fields

| Field | Required | Meaning |
| --- | --- | --- |
| Audit Event ID | Yes | Internal unique audit event identifier. |
| Timestamp | Yes | When the action occurred. |
| Actor User ID | Yes | User who performed or approved the action. |
| Actor Display Name | Recommended | Human-readable actor name at time of event. |
| Actor Role | Recommended | Role/context used for the action. |
| Action Type | Yes | What happened. |
| Target Type | Yes | Object type affected, such as Document, Revision, Transmittal, RCO, CO, User, Role. |
| Target ID | Yes | Internal ID of the affected object. |
| Project ID | Yes | Project context. |
| Previous Value | When applicable | Value before the change. |
| New Value | When applicable | Value after the change. |
| Reason / Comment | When required | Required for sensitive actions. |
| Source | Yes | User, system, import, automation, AI-assisted, API, etc. |
| Correlation ID | Recommended | Groups related events from the same workflow/action. |

## Actions That Must Be Audited

| Area | Actions |
| --- | --- |
| Document | Create, update metadata, change document type, change responsible party. |
| Revision | Create, status change, current revision change, supersede, cancel/revoke, metadata change. |
| Files | Upload/register file, link file to revision/object. |
| Transmittal/Submittal | Create, add/remove items before issue, issue, receive/acknowledge, close, cancel. |
| Incoming Review | Register review result, record external code, update revision status, attach returned files/comments. |
| RCO / CO | Every action. |
| Certificates | Register, update validity metadata, link to submittal/package/object. |
| Permissions | Add/remove user, assign/remove role, change project access. |
| Admin/Configuration | Change project configuration, document type settings, status mappings, numbering rules. |
| Sensitive Actions | Cancellation, revocation, correction after issue, physical deletion/admin maintenance. |
| Automation / AI Later | Suggestion, extraction, classification, tool call, accepted AI output, rejected AI output. |

## Sensitive Actions

Sensitive actions require audit trail and usually a reason/comment.

Sensitive actions include:

cancelling or revoking a revision;

changing issued or approved records;

changing current revision pointer;

correcting registered metadata after formal issue;

RCO/CO actions;

changing roles or permissions;

admin/system maintenance actions;

physical deletion, if ever allowed.

## RCO / CO Audit Rule

Every action related to RCO or CO must be audited.

RCO/CO audit events should preserve:

actor;

action;

timestamp;

affected document/revision links, when applicable;

direction;

originator/recipient;

reason/comment when applicable;

approval/acknowledgement actor when applicable.

AI must not approve, reject, issue, close, cancel, or supersede RCO/CO records.

## File Audit Rule

Files are never replaced once registered.

Audit trail must show:

who uploaded the file;

when it was uploaded;

which object/revision it was linked to;

file name;

file type;

checksum/hash, if available;

storage reference.

If a wrong file was registered, correction must be handled by audited cancellation, correction, or new revision according to project rules.

## Status and Revision Audit Rule

Every revision action must create an audit event.

Current Revision changes must be audited separately from Revision Status changes.

Example:

| Change | Audit? |
| --- | --- |
| Revision status: Submitted → Approved | Yes |
| Current revision: Rev A → Rev B | Yes |
| Rev A becomes Superseded | Yes |
| Rev B file uploaded | Yes |

## Permission Audit Rule

Permission and role changes must be audited.

Audit should show:

who changed access;

which user was affected;

previous role/access;

new role/access;

project context;

reason/comment when applicable.

## Read Access Audit

For MVP, normal document viewing does not need full audit logging unless required by project policy.

Recommended MVP stance:

| Action | Audit in MVP? |
| --- | --- |
| View document metadata | No |
| Download/open controlled file | Optional |
| View RCO/CO | Optional / project-dependent |
| Export report/register | Yes |
| View audit trail | Optional |

This can be tightened later for high-security projects.

## Audit Visibility

| Role | Audit Visibility |
| --- | --- |
| System Admin | System and project audit visibility as required for support. |
| Project Admin | Project audit visibility. |
| Project Manager | Project audit visibility. |
| Document Controller | Project document-control audit visibility. |
| Technical Reviewer | Limited audit visibility if needed for review context. |
| Viewer | No audit visibility by default. |

## MVP Implementation Stance

For MVP:

create an append-only AuditEvent model;

audit controlled writes and sensitive reads/exports;

do not allow normal users to edit/delete audit events;

include previous/new values when practical;

require reason/comment for sensitive actions;

keep audit implementation simple and server-side;

avoid building a complex compliance/audit analytics module.

The audit trail should be reliable enough to reconstruct controlled document history without overbuilding the first version.
