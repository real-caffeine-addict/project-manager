# ADR-0001: Document Type Matrix Scope and Modeling Decisions

## Status

Draft

## Context

The document type matrix is the base definition file for Phase 0 document-control discussions.

The matrix must be broad enough to cover the industrial project lifecycle without turning the MVP into a full project-management, procurement, QA/QC, commercial, and turnover platform.

The lifecycle stages used in the matrix are:

1. Contract / kickoff
2. Engineering input
3. Quality and EHS planning
4. Construction planning
5. Logistics / mobilization
6. Contractor engineering output
7. Review cycle and responses
8. Change control
9. Correspondence
10. Procurement / vendors / subcontractors
11. Test packages / QA-QC evidence
12. Closure / handover

## Decision

Keep `document_type_matrix.md` as a clean definition file.

The matrix classifies document types using:

- lifecycle stage;
- document family;
- document type;
- direction;
- controlled behavior;
- revision-control behavior;
- expiry tracking;
- typical originator;
- MVP priority;
- short notes.

Discussion, rationale, and modeling implications are recorded here, not in the matrix file.

## Resolved Decisions

### 1. Mandatory document types for the first customer profile

The current matrix is accepted as the working baseline.

The first MVP should focus on document-register coverage for:

- engineering input documents;
- contractor engineering output;
- QA/QC planning documents;
- construction planning documents;
- review cycle documents;
- RCO / CO;
- basic registration of letters/notices;
- selected certificates when required by the first workflow.

### 2. Letters and notices

Letters and notices should be registered only in MVP.

They should not receive a dedicated workflow unless the first customer workflow requires it.

### 3. Certificate expiry tracking

Certificates should support expiry-date or validity-period tracking in MVP where relevant.

This applies especially to:

- equipment certificates;
- staff certificates;
- calibration certificates;
- third-party certificates;
- WPQ where validity is relevant.

### 4. RCO / CO handling

RCO and CO should not require a separate `highRisk` configuration flag in MVP.

They are already identifiable by document type and should require high-privilege handling through permissions and workflow rules.

### 5. Submittal modeling

Submittal is a document type on its own.

It may also participate in transmittal workflow, but it should not be reduced to only a transmittal subtype.

### 6. Strict revision control

Strict revision control is required from day one for:

- contractual documents;
- engineering input;
- engineering output;
- QA/QC documents;
- RCO / CO;
- turnover and closeout documents.

Some evidence documents may still require expiry or validity tracking more than classical revision control.

### 7. Registration and attachment handling

All listed document families should at least support registration and attachment handling.

This does not mean all families need dedicated workflows in MVP.

## Modeling Notes

### Submittal

Submittal is treated as a document type.

It may also be connected to transmittals, submitted revisions, review cycles, or packages later.

### RCO and CO

RCO means Request for Change Order. It is an official EPC instruction or request to perform a modification.

CO means Change Order. It is an official approval, recognition, or commercial handling of a change.

RCO and CO may have financial, engineering, schedule, contractual, and legal impact.

They require:

- high-privilege handling;
- audit trail;
- responsible party;
- reason/comment for sensitive changes;
- links to affected documents, revisions, transmittals, scope items, or work areas when known.

### CO without RCO

A CO may relate to an RCO, but it must not depend on one.

Example:

- a drawing revision is issued after fabrication;
- the revision creates rework or additional cost;
- a CO is issued or approved without a prior RCO.

Safe MVP relationship model:

```text
relatedDocumentIds
relatedRevisionIds
relatedTransmittalIds
```

A later change-control module can add stronger relationships.

### Certificates

Certificates often need validity tracking in addition to, or instead of, revision tracking.

Useful fields may include:

- issue date;
- expiry date;
- issuing authority;
- validity scope;
- linked equipment, person, instrument, or material.

### Packages and dossiers

Test packages, turnover dossiers, and closeout packages are recognized in the matrix.

Dedicated package-completeness logic belongs later.

### Review comments

Review comments may be registered as documents, comments, or attachments in MVP.

Structured comment workflow can be added later if required.

## Consequences

### Positive

- The matrix remains clean and useful as a definition artifact.
- The ADR records actual product decisions.
- MVP scope stays focused on document control.
- High-impact document types are handled through permissions and workflow rules.
- Future modules remain visible without being prematurely implemented.

### Risks

- Some document families will be registered before they receive dedicated workflows.
- RCO/CO handling may be limited until a proper change-control module exists.
- Certificate validity tracking adds some MVP complexity.
- Submittal behavior may need refinement after the first real workflow is validated.
