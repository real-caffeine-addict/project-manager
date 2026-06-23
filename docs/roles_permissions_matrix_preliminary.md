# Roles and Permission Matrix - Preliminary

## Purpose

This document defines the preliminary MVP roles and permission model for DC Agent.

The MVP is designed for contractor-side document control.  
Client, Owner, and EPC parties may appear as external project parties, originators, recipients, reviewers, or approvers in metadata, but they are not primary system roles in the MVP.

The goal is to keep access control simple, auditable, and based on least privilege.

---

## Principles

1. **Use RBAC first.**  
   MVP permissions should be role-based and simple.

2. **Keep roles limited.**  
   Do not create a separate role for every project position.

3. **Use broad permission groups.**  
   Avoid dozens of tiny permissions in the MVP.

4. **Apply least privilege.**  
   Users should receive only the access needed for their work.

5. **Separate system permission from legal authority.**  
   System access does not replace professional, legal, contractual, or regulatory authority.

6. **External project parties are metadata in MVP.**  
   Client, Owner, EPC, vendors, subcontractors, and third parties are tracked as companies/parties, not as full internal role types.

7. **Sensitive actions require audit trail.**  
   Cancellation, correction, RCO/CO actions, and issued-record changes must be controlled and audited.

---

## MVP Roles

| Role | Purpose |
|---|---|
| System Admin | System-level setup and maintenance. Not responsible for project execution. |
| Project Admin | Project setup, users, companies, and basic configuration. |
| Project Manager | Contractor-side project authority responsible for execution, schedule, budget, and project-level decisions. |
| Document Controller | Daily document-control work: registration, revisions, transmittals, incoming/outgoing tracking, and MDR maintenance. |
| Technical Reviewer | Combined MVP role for engineer, QA/QC, EHS, or discipline reviewer. Used for technical/professional review actions. |
| Viewer | Read-only access to permitted project data. |

---

## Deferred / Non-MVP Roles

| Role / Party | MVP Treatment |
|---|---|
| Project Director | Defer. Treat as Project Manager or escalation outside MVP unless required. |
| Discipline Engineer | Covered by Technical Reviewer in MVP. |
| QA/QC Manager | Covered by Technical Reviewer in MVP. |
| QA/QC Inspector | Defer until QA/QC module. |
| EHS Officer / EHS Manager | Covered by Technical Reviewer in MVP. |
| Procurement / Logistics | Defer unless required by first workflow. |
| Client / Owner / EPC User | External party metadata only in MVP. |
| Vendor / Subcontractor User | External party metadata only in MVP. |

---

## Permission Groups

| Permission Group | Meaning |
|---|---|
| Read | View permitted project data and documents. |
| Document Register Write | Create and update document records, revisions, metadata, and registered files according to status rules. |
| Document Issue | Formally issue/transmit/submittal document revisions. |
| Technical Review | Record or acknowledge technical review outcomes where the user is authorized. |
| Change Control | Register and handle RCO/CO records according to authority rules. |
| Sensitive Action | Cancel, revoke, correct issued records, or perform privileged changes. |
| Project Admin | Manage project configuration, users, companies, and role assignments. |
| Audit Read | View audit trail. |

---

## Role-Permission Matrix

| Role | Read | Document Register Write | Document Issue | Technical Review | Change Control | Sensitive Action | Project Admin | Audit Read |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| System Admin | Yes | No | No | No | No | No | System only | Yes |
| Project Admin | Yes | Yes | No | No | No | Limited | Yes | Yes |
| Project Manager | Yes | Yes | Yes | Yes | Yes | Yes | Limited | Yes |
| Document Controller | Yes | Yes | Yes | No | Register only | Limited | Limited | Yes |
| Technical Reviewer | Yes | Limited | No | Yes | No | No | No | Limited |
| Viewer | Yes | No | No | No | No | No | No | No |

---

## Role Notes

### System Admin

System Admin is responsible for application-level administration.

Allowed:

- system setup;
- technical configuration;
- user support;
- audit visibility.

Not allowed by default:

- project execution decisions;
- document approval;
- RCO/CO handling;
- technical signoff.

---

### Project Admin

Project Admin manages project setup and user access.

Allowed:

- create/configure project;
- manage companies;
- manage project users;
- assign roles;
- limited document setup actions.

Not allowed by default:

- technical approval;
- RCO/CO approval;
- issue official project documents unless also assigned another role.

---

### Project Manager

Project Manager is the contractor-side project authority.

Responsible for:

- project execution;
- schedule;
- budget;
- internal project-level decisions;
- commercial/project handling inside the contractor organization.

Allowed:

- issue formal project documents;
- approve sensitive project actions where permitted;
- handle RCO/CO records;
- cancel/revoke controlled records where permitted;
- view audit trail.

Limit:

- Project Manager system authority does not override legal/professional signatory requirements.

---

### Document Controller

Document Controller performs daily document-control work.

Allowed:

- register documents;
- create revisions;
- upload registered files;
- maintain MDR;
- prepare and issue normal transmittals/submittals;
- record incoming documents;
- record incoming review results;
- register RCO/CO records.

Limited:

- may perform sensitive corrections only when explicitly allowed;
- may register RCO/CO but should not approve their handling independently.
- may perform limited project admin tasks. Requires explicit permission.

Not allowed by default:

- technical signoff;
- legal/professional approval;
- independent approval of contractual change handling.

---

### Technical Reviewer

Technical Reviewer represents engineer, QA/QC, EHS, or discipline review responsibility in the MVP.

Allowed:

- view relevant documents;
- review or acknowledge relevant documents;
- record technical/professional review outcomes where authorized;
- view limited audit trail if required.

Not allowed by default:

- manage project setup;
- issue official transmittals;
- perform RCO/CO handling;
- cancel/revoke issued records;
- broad document register maintenance.

---

### Viewer

Viewer is read-only.

Allowed:

- view permitted project documents and metadata.

Not allowed:

- create;
- edit;
- issue;
- approve;
- cancel;
- delete;
- perform sensitive actions.

---

## Sensitive Actions

Sensitive actions require elevated permission, audit trail, and usually reason/comment.

Sensitive actions include:

- cancelling or revoking a revision;
- correcting issued records;
- changing metadata after formal issue;
- changing current revision pointer;
- RCO/CO handling;
- deleting or physically removing records in admin/system maintenance cases;
- changing user roles or project permissions.

---

## RCO / CO Rule

RCO and CO records require strict human control.

Rules:

- every action related to RCO/CO must be human-approved;
- AI must not approve, reject, issue, close, supersede, or cancel RCO/CO records;
- Document Controller may register RCO/CO records;
- Project Manager or explicitly authorized role handles sensitive RCO/CO decisions;
- all RCO/CO actions must be audited.

---

## Legal and Professional Authority

RBAC grants system access only.

It does not replace legal, contractual, regulatory, or professional authority.

Some approvals or signatures may require legally qualified personnel, including but not limited to:

- structural drawing signoff;
- electrical drawing signoff;
- work-at-height certification;
- safety approvals;
- statutory or regulatory certifications.

For MVP, these authority requirements may be handled manually through metadata, comments, and audit trail.

Future versions may introduce explicit qualification/authority tracking.

---

## Least Privilege Policy

Default access should be conservative.

Recommended defaults:

- new users receive no project access until assigned;
- project access is granted per project;
- Viewer is the safest default project role;
- Document Controller gets operational document-control access, not commercial approval;
- Technical Reviewer gets review access, not broad write/admin access;
- Project Manager gets broad project authority, but not system administration;
- System Admin gets system control, not project decision authority.

---

## MVP Implementation Stance

For MVP:

- implement role-based access control;
- keep the role list small;
- use broad permission groups;
- audit sensitive actions;
- avoid custom permission rules per document type unless required;
- defer legal/professional authority engine;
- treat external parties as project metadata, not full user roles;
- keep permission checks server-side.

The model should protect controlled records without creating an overbuilt permission framework before the first workflow is proven.
