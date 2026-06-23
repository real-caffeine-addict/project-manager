# Reports / Dashboards - Initial Section

## Purpose

Define the initial reporting and dashboard scope for DC Agent MVP.

The MVP reporting goal is operational visibility, not visual design, BI, forecasting, or claims automation.

Reports should be generated from structured project records and must be reproducible from the underlying data.

---

## Scope

MVP reports focus on:

- document status;
- progress versus plan;
- overdue and missing documents;
- severe deviations;
- progress by system, discipline, and document family;
- documentation readiness for field teams;
- basic report generation for internal and external use.

Visual dashboard design is implementation detail and may be handled by Codex.

---

## MVP Reports

| Report | Purpose |
|---|---|
| Document Status: Progress vs. Plan | Compare planned document baseline against actual document status. |
| Severe Deviations Report | Highlight critical documentation gaps or blocked project actions. |
| Progress per System | Show document progress grouped by project system. |
| Progress per Discipline | Show document progress grouped by discipline. |
| Progress per Document Family | Show document progress grouped by document type/family. |
| Field Teams vs. Documentation | Show whether field work has the required documentation basis. |
| Report Wizard | Generate internal company or client/EPC reports. |

---

# 1. Document Status: Progress vs. Plan

## Purpose

Show whether documentation progress matches the project documentation plan.

## Minimum Data

- planned documents;
- registered documents;
- submitted documents;
- approved documents;
- rejected documents;
- overdue documents;
- missing documents;
- pending-action documents;
- planned dates;
- actual dates, when available.

## Output

A factual status report based on the current document register and planning baseline.

---

# 2. Severe Deviations Report

## Purpose

Highlight major documentation problems that require management attention.

## Severe Deviations May Include

- critical documents not submitted;
- documents overdue beyond defined threshold;
- rejected documents blocking downstream work;
- repeated rejection cycles;
- missing approval records;
- unauthorized changes;
- missing qualification/verification evidence;
- documentation gaps affecting field execution;
- documentation gaps affecting contractual or regulatory obligations.

## Output

A filtered report of severe deviations, grouped by severity, responsible party, discipline, system, document family, and current status where data exists.

---

# 3. Progress per System

## Purpose

Show documentation progress by project system.

## Minimum Data

- total planned documents;
- submitted documents;
- approved documents;
- rejected documents;
- overdue documents;
- missing documents;
- open actions;
- completion percentage.

## Note

This report depends on having a `System` field or equivalent metadata.

---

# 4. Progress per Discipline

## Purpose

Show documentation progress by engineering or project discipline.

## Minimum Data

- discipline;
- planned documents;
- submitted documents;
- approved documents;
- rejected documents;
- overdue documents;
- open actions.

## Example Disciplines

- mechanical;
- electrical;
- instrumentation and control;
- civil;
- process;
- piping;
- EHS;
- QA/QC;
- commissioning;
- vendor documentation.

---

# 5. Progress per Document Family

## Purpose

Show documentation progress by document family or document type.

## Minimum Data

- document family/type;
- planned documents;
- submitted documents;
- approved documents;
- rejected documents;
- overdue documents;
- open actions.

## Example Families

- drawings;
- method statements;
- ITPs;
- QA/QC records;
- test reports;
- certificates;
- procedures;
- calculations;
- vendor documents;
- commissioning documents;
- handover documents;
- as-built documents.

---

# 6. Field Teams vs. Documentation

## Purpose

Show whether field teams have the required documentation basis for execution.

## MVP Limitation

Unless field execution data exists, this report should show documentation readiness, not actual field activity.

## Minimum Data

- required documents for field work;
- approved documents available;
- missing documents;
- outdated/superseded documents;
- rejected documents;
- documents under review;
- missing inspection/test records;
- missing qualification evidence;
- missing approval records.

## Output

A readiness/gap report for field execution support.

---

# 7. Report Wizard

## Purpose

Generate basic structured reports for internal or external use.

## Report Types

| Report Type | Audience | Content Rule |
|---|---|---|
| Company Report | Contractor internal management | May include internal deviations, blockers, responsible parties, and follow-up actions. |
| Client / EPC Report | External project party | Factual, controlled, formally presentable information only. |

## MVP Rule

The wizard should select report scope, filters, audience type, and export format.

It should not generate legal claims, contractual positions, or financial conclusions.

---

## MVP Exclusions

The MVP does not include:

- custom dashboard design;
- BI integration;
- financial impact calculation;
- schedule impact calculation;
- budget/cashflow analysis;
- automated claims preparation;
- automated RCO generation;
- push notification logic;
- ISO compliance certification;
- legal position generation.

---

## Future Scope

Future reporting may include:

- financial implications;
- schedule implications;
- budget/cashflow status, past and future;
- push notifications;
- RCO wizard;
- claim package generator;
- ISO 9001 support;
- ISO 14001 support;
- ISO 45001 support;
- ISO 27001 support.

Future reports must remain traceable to structured records and audit data.

---

## MVP Implementation Stance

For MVP:

- prioritize correct data over visual design;
- use simple filters and tables first;
- generate reports from structured records;
- keep reports reproducible;
- avoid advanced analytics until core document-control data is reliable.
