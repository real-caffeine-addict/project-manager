# Consultant Review Portal

Small local web tool for reviewing copied Phase 0 Markdown specification documents with a senior non-technical project-management consultant.

## What This Tool Is

- Local Spring Boot backend and React frontend.
- Reads Markdown files from a configured local docs folder.
- Allows explicit Markdown editing and saving.
- Stores structured suggestions in a local JSON file.
- Exports suggestions to Markdown or CSV.

## What This Tool Is Not

- Not a production system.
- Not an authentication or authorization system.
- Not Git integration.
- Not an AI tool.
- Not connected to Oracle or any external database.

## Folder Structure

```text
backend
frontend
data
README.md
docs
  consultant-review-portal-user-guide-he.md
  screenshots/consultant-review-portal/README.md
```

## Configure the Docs Folder

Default docs folder when the backend is started from `backend`:

```text
../docs
```

Override it when starting the backend.

Linux/Mac:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--app.docs-folder=/path/to/copied/docs"
```

Windows PowerShell:

```powershell
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--app.docs-folder=C:\path\to\copied\docs"
```

Only `.md` files are listed and editable. Writes are blocked outside the configured folder.

## Run the Backend

Linux/Mac:

```bash
cd backend
mvn spring-boot:run
```

Windows PowerShell:

```powershell
cd backend
mvn spring-boot:run
```

Backend URL: `http://localhost:8080`

## Run the Frontend

Linux/Mac:

```bash
cd frontend
npm install
npm run dev
```

Windows PowerShell:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## Run Tests

Backend:

```bash
cd backend
mvn test
```

Frontend:

```bash
cd frontend
npm install
npm test
```

## Capture Screenshots

Manual instructions are in:

```text
docs/screenshots/consultant-review-portal/README.md
```

Create these files in that folder:

- `documents-list.png`
- `document-viewer.png`
- `document-edit-mode.png`
- `add-suggestion.png`
- `review-dashboard.png`
- `suggestion-details.png`

## Review File Changes with Git

This tool does not run Git commands. Review changes outside the tool.

Linux/Mac and Windows PowerShell:

```bash
git diff
```

## Known Limitations

- Markdown rendering is intentionally simple.
- Suggestions are stored in a local JSON file.
- There is no user login.
- There is no autosave.
- Files must already exist before they can be edited.
- This tool is intended for temporary local work only.
