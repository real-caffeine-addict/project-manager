| Term | Term |
| --- | --- |
| Category | Application / Project / Hybrid |
| Preferred usage | The exact word we will use in the product or code. |
| Definition | Short, practical definition. |
| Examples | 2-4 examples. |
| Avoid confusion with | Terms that sound similar but mean something else. |
| Notes | Optional. Only when needed. |

| Term | User Account |
| --- | --- |
| Category | Application |
| Definition | Login identity inside the system. |

| Term | Role |
| --- | --- |
| Category | Application |
| Definition | Groups permissions, |
| Examples | Admin; Document Controller; Viewer. |
| Avoid confusion with | Position - a role in the project that defines wage class, responsibilities and authorities. |

| Term | Permission |
| --- | --- |
| Category | Application |
| Definition | Controls what a user can view, create, edit, approve, transmit, or delete. |
| Avoid confusion with | Permit |
| Notes | Permissions are usually assigned through roles, but may also depend on project, company, ownership, or workflow state. |

| Term | Project |
| --- | --- |
| Category | Hybrid |
| Preferred usage | Use “workspace” for software context when needed; use “Project” for real-world project context. |
| Definition | Software workspace and real-world project container. |
| Examples | DC agent backend workspace; Workspace configurations; PB piping project; Project budget |

| Term | Digital File |
| --- | --- |
| Category | Application |
| Preferred usage | Digital File in UI; StoredFile in code. |
| Definition | A stored uploaded binary object, such as a PDF, DWG, image, Excel workbook, or email attachment. |
| Examples | PDF drawing; Excel workbook; DWG file; Scanned certificate |
| Avoid confusion with | Project file, case file, dossier, document. |
| Notes | A Digital File is storage-level data. A Document is a controlled project object. |

| Term | Attachment |
| --- | --- |
| Category | Application |
| Definition | A digital file linked to another object. |
| Examples | Email attachments; Transmittal content |
| Avoid confusion with | mechanical attachments. |

| Term | Metadata |
| --- | --- |
| Category | Hybrid |
| Definition | Structured fields that describe an object and allow it to be searched, filtered, controlled, or reported. |
| Examples | Document number; Revision code; Document type; Discipline; Status; Due date |
| Avoid confusion with | File content, document body text. |

| Term | Status |
| --- | --- |
| Category | Hybrid |
| Preferred usage | Must be qualified: Document Status, Revision Status, Transmittal Status. |
| Definition | Metadata that describes part of object lifecycle and real-world state of things. |
| Examples | Document status; Revision status; The status of unit installation; Budget status |

| Term | Workflow |
| --- | --- |
| Category | Hybrid |
| Preferred usage | Always in context (see examples) |
| Definition | Controlled process in the app and in project execution. |
| Examples | The revision acceptance workflow; RFI submission workflow |
| Avoid confusion with | Procedure/Sequence - The required steps to perform a task. |
| Notes | Workflows in app and in project overlaps. The app workflow tends to mimic the project workflow behavior. |

| Term | Audit Event |
| --- | --- |
| Category | Application |
| Definition | Logs important system actions. |

| Term | Audit Trail |
| --- | --- |
| Category | Application |
| Definition | History of audit events for an object or process. |

| Term | Notification |
| --- | --- |
| Category | Hybrid |
| Preferred usage | Qualified use only (See examples) |
| Definition | Alert/message to users about actions, due dates, or changes and something officially brought to knowledge of the recipient. |
| Examples | Push notification; Error notification; Legal notification; Notification of violation |
| Notes | In project context often referred to as "Notice". |

| Term | Dashboard |
| --- | --- |
| Category | Application |
| Definition | Summary view of project/document-control state. |

| Term | Report |
| --- | --- |
| Category | Hybrid |
| Preferred usage | With originator or report type (See examples). |
| Definition | Structured output for project tracking or management. |
| Examples | NDT report; Splunk report; Document status report |

| Term | Company |
| --- | --- |
| Category | Project |
| Definition | Organization participating in the project. |

| Term | Document |
| --- | --- |
| Category | Project |
| Definition | Controlled project deliverable/business item. |
| Examples | Test report; Technical query; Certificates; AFC drawing |

| Term | Document Number |
| --- | --- |
| Category | Project |
| Preferred usage | Document Number for business/project use; internal ID only for database/system use. |
| Definition | The main project/business identifier assigned to a controlled document. |
| Examples | WGS-RFI-012; 10-HPS-012; PB-MEC-DWG-001 |
| Avoid confusion with | Database ID, Digital File name, Revision Code. |

| Term | Document Title |
| --- | --- |
| Category | Project |
| Definition | Human-readable document name/title. |

| Term | Document Type |
| --- | --- |
| Category | Project |
| Definition | Classification of a document from which its properties are derived. |
| Examples | Drawing; Calculation; Certificate; Method statement |

| Term | Document Revision |
| --- | --- |
| Category | Project |
| Definition | A controlled version of a Document identified by the same Document Number and a specific Revision Code. |
| Examples | Document PB-MEC-DWG-001 Rev A; Document PB-MEC-DWG-001 Rev B |
| Avoid confusion with | Digital File version, file upload, Current Revision. |

| Term | Revision Code |
| --- | --- |
| Category | Project |
| Definition | An alphanumeric value that identifies the revision sequence or issue stage of a document. |
| Examples | 0, 1, 2; A, B, C; P1, P2, P3; IFC, AFC, As-Built, if used by the project convention |
| Avoid confusion with | Document Status, Review Status. |
| Notes | Revision code may carry commercial/distribution significance depending on project convention. |

| Term | Current Revision |
| --- | --- |
| Category | Project |
| Definition | The active/latest controlled revision. |
| Notes | If a revision is cancelled or revoked, the previous revision may become current again depending on project rules. This must be handled explicitly. |

| Term | Superseded Revision |
| --- | --- |
| Category | Project |
| Definition | Older revision replaced by a newer controlled revision. |

| Term | Revision Status |
| --- | --- |
| Category | Project |
| Definition | The lifecycle or control state of a specific Document Revision. |
| Examples | Draft; Submitted for review; Approved; Approved with comments; Rejected; Superseded; Cancelled |
| Avoid confusion with | Document Status, Review Status. |

| Term | Discipline |
| --- | --- |
| Category | Project |
| Definition | Area of expertise, normally corresponds to academic engineering degree. Used to define scoping. |
| Examples | Mechanical; Structure; Civil |

| Term | Approval |
| --- | --- |
| Category | Project |
| Definition | Formal acceptance by authorized party. |

| Term | Rejection |
| --- | --- |
| Category | Project |
| Definition | Formal non-acceptance or return. |

| Term | Comment |
| --- | --- |
| Category | Hybrid |
| Definition | User/project comment attached to document, revision, or review. |

| Term | Comment Response |
| --- | --- |
| Category | Project |
| Definition | Reply/closure status for review comments. |

| Term | Due Date |
| --- | --- |
| Category | Project |
| Definition | Required action/review/submission date. |

| Term | Owner / Responsible Party |
| --- | --- |
| Category | Hybrid |
| Definition | A person, company, role, object, team, or process responsible for an action, item, data object, workflow, or software component. |
| Notes | The term “owner” is used broadly in both project and software contexts and must be understood from context. |

| Term | Transmittal |
| --- | --- |
| Category | Project |
| Definition | Formal sending record for documents between parties. |

| Term | Transmittal Item |
| --- | --- |
| Category | Project |
| Definition | One document/revision included in a transmittal. |

| Term | Submittal |
| --- | --- |
| Category | Project |
| Definition | Formal submission for review, approval, or record. |

| Term | Recipient |
| --- | --- |
| Category | Project |
| Definition | User/company receiving a transmittal or notification. |

| Term | Sender |
| --- | --- |
| Category | Hybrid |
| Preferred usage | Sender alone is in project context; Sending method, Caller are the preferred terms for software. |
| Definition | User/company issuing a transmittal and software component integrating with other components. |

| Term | Distribution |
| --- | --- |
| Category | Project |
| Definition | Who received what and when. |

| Term | Client |
| --- | --- |
| Category | Hybrid |
| Preferred usage | Client alone is always project context. Software client must be referred in context. |
| Definition | Final receiving/owning party and a software piece that uses a service/server. |
| Examples | Client requirements; Client representatives; API client; DB client |

| Term | Contractor |
| --- | --- |
| Category | Project |
| Preferred usage | In context when applicable (See examples). |
| Definition | Main executing party; likely core MVP user. |
| Examples | Main contractor; Subcontractor; Mechanical contractor |
| Avoid confusion with | A person or a group of people hired with no employer-employee relationship like free-lance. |

| Term | System |
| --- | --- |
| Category | Hybrid |
| Preferred usage | Must be in context. |
| Definition | A set of machines, instruments, media, devices, or software components that together form an operating unit or service. |
| Examples | Main steam system; instrument air system; Block A power-grid; CRM system; ERP system |
| Notes | The term "System" alone is ambiguous and should be avoided entirely. |

| Term | Approver |
| --- | --- |
| Category | Project |
| Definition | Identifies the person, role, or party authorized to formally approve a document, revision, submittal, or workflow step. |

| Term | Issuer |
| --- | --- |
| Category | Hybrid |
| Preferred usage | Issuer alone is always project context. Software issuers must be qualified. |
| Definition | Identifies the person, role, or party authorized to formally send, publish, submit, or release an item. Can be a project party or a system/user actor. |
| Examples | Document controller; Engineer; Token issuer; PTW issuer |

| Term | Acknowledgement |
| --- | --- |
| Category | Project |
| Definition | Confirms that something was received or recognized, without necessarily meaning it was approved. Important for transmittals and formal communication. |

| Term | Document Register |
| --- | --- |
| Category | Project |
| Definition | The controlled list of project documents, their metadata, revisions, statuses, and responsibilities. |

| Term | MDR (Master Document Register) |
| --- | --- |
| Category | Project |
| Definition | The main official document register for a project. Usually the central tracking tool for controlled documents. |

| Term | Controlled Document |
| --- | --- |
| Category | Project |
| Definition | A document managed under formal revision, status, access, distribution, and audit rules. |

| Term | Uncontrolled Copy |
| --- | --- |
| Category | Project |
| Definition | A copy of a document that is not guaranteed to be current or officially controlled after distribution/export/printing. |

| Term | Internal ID |
| --- | --- |
| Category | Application |
| Definition | A system-generated identifier used internally by the application, usually not the business reference shown to users. |

| Term | Database ID |
| --- | --- |
| Category | Application |
| Definition | The technical identifier used by the database, often a primary key. |
| Avoid confusion with | project identifiers like Document Number. |

| Term | RCO / Request for Change Order |
| --- | --- |
| Category | Project |
| Definition | Official EPC instruction requesting or directing a modification to the contractor’s scope, work, deliverables, or execution method. |
| Notes | RCOs may have financial, engineering, schedule, and legal consequences and must be controlled carefully. |

| Term | CO / Change Order |
| --- | --- |
| Category | Project |
| Definition | Official approval, confirmation, or commercial recognition of a change related to an RCO or instructed modification. |
| Avoid confusion with | Certificate of Completion, which should not be abbreviated as COC in UI without context. |
