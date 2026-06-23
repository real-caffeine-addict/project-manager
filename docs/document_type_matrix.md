# Document Type Matrix

## Purpose

This document defines the preliminary document type matrix for DC Agent MVP planning.

The matrix classifies project document types by lifecycle stage, document family, direction, control behavior, revision behavior, originator, MVP priority, and expiry tracking when relevant.

This is a definition file. It should stay focused on classification.

---

## Direction Values

| Direction | Meaning |
|---|---|
| Incoming | Received by the contractor from another project party. |
| Outgoing | Issued by the contractor to another project party. |
| Both | Can be either incoming or outgoing depending on project context. |

---

## Control Values

| Value | Meaning |
|---|---|
| Yes | Managed as a controlled document or controlled record. |
| No | Not normally managed through document control. |
| Sometimes | Depends on contract, project requirements, client/EPC procedure, or document use. |

---

## Revision Control Values

| Value | Meaning |
|---|---|
| Yes | Managed through formal revisions. |
| No | Not normally managed through revisions. |
| Usually no | Revision control is not typical, but corrections/reissues may occur. |
| Sometimes | Depends on project convention or document use. |

---

## MVP Priority Values

| Priority | Meaning |
|---|---|
| Include | Candidate for direct support in the MVP document register. |
| Register only | Register as a document, but avoid dedicated workflow or deep modeling in MVP. |
| Maybe | Include only if required by the first real customer workflow. |
| Define only | Define and recognize now, but avoid implementation in MVP. |
| Later | Defer to a later project phase. |

---

## Expiry Tracking Values

| Value | Meaning |
|---|---|
| Yes | Expiry date or validity period should be tracked. |
| No | Expiry tracking is not normally relevant. |
| Sometimes | Depends on document type, project rules, or issuing authority. |

---

## Matrix

| Lifecycle Stage | Document Family | Document Type | Direction | Controlled | Revision Controlled | Expiry Tracking | Typical Originator | MVP Priority | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Contract / Kickoff | Contractual | Contract | Incoming / Both | Yes | Yes | No | Client / EPC / Contractor | Register only | Defines obligations, scope, deliverables, commercial terms, and responsibilities. |
| Contract / Kickoff | Contractual | Scope Document | Incoming / Both | Yes | Yes | No | Client / EPC / Contractor | Register only | Defines technical or commercial scope. |
| Contract / Kickoff | Contractual | Project Requirements | Incoming | Yes | Yes | No | Client / EPC | Register only | Defines required deliverables, procedures, and approval obligations. |
| Engineering Input | Engineering Input Package | Specification | Incoming | Yes | Yes | No | Client / EPC / Engineer | Include | Technical input used by contractor. |
| Engineering Input | Engineering Input Package | Drawing | Incoming | Yes | Yes | No | Client / EPC / Engineer | Include | Input drawing used for fabrication, procurement, installation, or planning. |
| Engineering Input | Engineering Input Package | Procedure | Incoming | Yes | Yes | No | Client / EPC / Engineer | Include | Project, technical, quality, or control procedure. |
| Engineering Input | Engineering Input Package | Standard / Code Reference | Incoming | Yes | Yes | Sometimes | Client / EPC / Authority | Maybe | External or project-required reference document. |
| Quality and EHS Planning | QA/QC Planning | ITP | Outgoing | Yes | Yes | No | Contractor | Include | Inspection and Test Plan. |
| Quality and EHS Planning | QA/QC Planning | QA/QC Procedure | Outgoing | Yes | Yes | No | Contractor | Include | Contractor quality procedure submitted or controlled for the project. |
| Construction Planning | Execution Planning | Method Statement | Outgoing | Yes | Yes | No | Contractor | Include | Work execution method document. |
| Construction Planning | EHS / Risk | Risk Assessment | Outgoing | Yes | Yes | Sometimes | Contractor | Include | Activity or task risk assessment. |
| Construction Planning | Lifting | Lift Plan | Outgoing | Yes | Yes | Sometimes | Contractor | Include | Controlled lifting activity document. |
| Logistics / Mobilization | Equipment / Staff | Equipment Certificate | Outgoing | Yes | Usually no | Yes | Contractor / Third Party | Maybe | Equipment certificate or approval evidence. |
| Logistics / Mobilization | Equipment / Staff | Staff Certificate | Outgoing | Yes | Usually no | Yes | Contractor / Training Provider / Authority | Maybe | Staff qualification, license, or authorization evidence. |
| Logistics / Mobilization | Equipment / Staff | Calibration Certificate | Incoming / Outgoing | Yes | Usually no | Yes | Third Party / Contractor | Maybe | Calibration evidence for tools, instruments, or equipment. |
| Contractor Engineering Output | Submittal Package | Submittal | Outgoing | Yes | Yes | No | Contractor | Include | Document on its own; may also participate in transmittal workflow. |
| Contractor Engineering Output | Shop Drawings | Shop Drawing | Outgoing | Yes | Yes | No | Contractor | Include | Contractor-produced drawing for review, fabrication, or execution. |
| Contractor Engineering Output | Welding | WPS | Outgoing | Yes | Yes | No | Contractor / Welding Engineer | Include | Welding Procedure Specification. |
| Contractor Engineering Output | Welding | WPQ | Outgoing | Yes | Usually no | Yes | Contractor / Welder Qualification Body | Maybe | Welder Performance Qualification. |
| Contractor Engineering Output | Engineering Output | Calculation | Outgoing | Yes | Yes | No | Contractor / Engineer | Maybe | Engineering calculation or design support document. |
| Contractor Engineering Output | Engineering Output | Fabrication Drawing | Outgoing | Yes | Yes | No | Contractor | Include | Drawing used for fabrication. May overlap with shop drawing depending on project terminology. |
| Review Cycle / Responses | Review Response | Reviewed Revision | Incoming | Yes | Yes | No | EPC / Client / Reviewer | Include | Returned document revision with review result, code, comments, or approval decision. |
| Review Cycle / Responses | Review Response | Review Comments | Incoming | Yes | Yes | No | EPC / Client / Reviewer | Maybe | Reviewer comments or comment sheet. |
| Change Control | Change Control | RCO / Request for Change Order | Incoming | Yes | Yes | No | EPC / Client | Include | Official instruction or request to perform a modification. High-privilege handling required. |
| Change Control | Change Control | CO / Change Order | Incoming / Both | Yes | Yes | No | Client / EPC / Contractor | Include | Official approval or recognition of a change. May exist with or without a related RCO. High-privilege handling required. |
| Correspondence | Correspondence | Letter | Both | Yes | Usually no | No | Any Project Party | Register only | Formal project correspondence. |
| Correspondence | Correspondence | Notice | Both | Yes | Usually no | No | Any Project Party | Register only | Formal notice or notification between project parties. |
| Procurement / Vendors / Subcontractors | Procurement | RFQ | Both | Yes | Sometimes | No | Contractor / Vendor / Subcontractor | Later | Request for quotation. |
| Procurement / Vendors / Subcontractors | Procurement | PO | Both | Yes | Yes | No | Contractor / Client / Vendor | Later | Purchase order. |
| Procurement / Vendors / Subcontractors | Vendor Documents | Vendor Submittal | Incoming / Both | Yes | Yes | No | Vendor / Subcontractor | Maybe | Vendor or subcontractor document submitted for review or record. |
| Procurement / Vendors / Subcontractors | QA/QC Evidence | Material Certificate | Incoming / Both | Yes | Usually no | Sometimes | Vendor / Manufacturer / Third Party | Maybe | Certificate for supplied material. |
| Procurement / Vendors / Subcontractors | Commercial | Invoice | Both | Yes commercially | No | No | Vendor / Subcontractor / Contractor | Later | Commercial/accounting document. |
| Test Packages / QA-QC Evidence | NDT / DT | NDT Report | Incoming / Both | Yes | Yes | No | Third Party / Contractor | Maybe | Non-destructive testing report. |
| Test Packages / QA-QC Evidence | NDT / DT | DT Report | Incoming / Both | Yes | Yes | No | Third Party / Contractor | Later | Destructive testing report. |
| Test Packages / QA-QC Evidence | Inspection | Inspection Report | Incoming / Both | Yes | Yes | No | Contractor / EPC / Third Party | Maybe | Inspection evidence or inspection result. |
| Test Packages / QA-QC Evidence | Inspection | Final Inspection Report | Both | Yes | Yes | No | Contractor / EPC / Third Party | Later | Final inspection evidence. |
| Test Packages / QA-QC Evidence | Certification | Third-Party Certificate | Incoming | Yes | Usually no | Yes | Third Party / Authority | Maybe | Certificate issued by an external inspection, testing, or authority body. |
| Closure / Handover | Closeout | Punch List | Both | Yes | Yes | No | Client / EPC / Contractor | Later | List of open items or defects requiring closure. |
| Closure / Handover | Closeout | Certificate of Completion | Outgoing / Both | Yes | Yes | No | Contractor / EPC / Client | Register only | Completion certificate. Avoid acronym unless project convention is explicit. |
| Closure / Handover | Closeout | As-Built Drawing | Outgoing | Yes | Yes | No | Contractor | Maybe | Final drawing reflecting built condition. |
| Closure / Handover | Closeout | Turnover Dossier | Outgoing | Yes | Yes | No | Contractor | Later | Handover package or dossier. |
