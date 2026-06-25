# Consultant Review Portal

Small local web tool for reviewing copied Phase 0 Markdown specification documents with a senior non-technical project-management consultant.

## What This Tool Is

- Spring Boot backend and React frontend.
- Reads Markdown files from a configured local docs folder.
- Allows explicit Markdown editing and saving.
- Stores structured suggestions in a local JSON file.
- Exports suggestions to Markdown or CSV.

## What This Tool Is Not

- Not a production system.
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
```

## Configure the Docs Folder

Packaged deployment defaults:

```text
app.docs-folder=/srv/consultant-portal/documents
app.suggestions-file=/srv/consultant-portal/data/suggestions.json
app.auth-users-file=/etc/consultant-portal/authorized-users.csv
```

Override them with environment variables when needed:

Linux/Mac:

```bash
cd backend
CONSULTANT_PORTAL_DOCS_FOLDER=/path/to/copied/docs \
CONSULTANT_PORTAL_SUGGESTIONS_FILE=/path/to/data/suggestions.json \
CONSULTANT_PORTAL_AUTH_USERS_FILE=/path/to/authorized-users.csv \
mvn spring-boot:run
```

Windows PowerShell:

```powershell
cd backend
$env:CONSULTANT_PORTAL_DOCS_FOLDER = "C:\path\to\copied\docs"
$env:CONSULTANT_PORTAL_SUGGESTIONS_FILE = "C:\path\to\data\suggestions.json"
$env:CONSULTANT_PORTAL_AUTH_USERS_FILE = "C:\path\to\authorized-users.csv"
mvn spring-boot:run
```

Only `.md` files are listed and editable. Writes are blocked outside the configured folder.

## Deployment Layout

Recommended Linux layout:

```text
/var/www/consultant-portal        React build output served by the web server user
/srv/consultant-portal/documents  Markdown documents, read/write by portaladmin
/srv/consultant-portal/data       Suggestions JSON, read/write by portaladmin
/etc/consultant-portal            Sensitive config such as authorized-users.csv
```

The web server user only needs to read the React build from `/var/www/consultant-portal` and proxy `/api` to the Java service. It does not need direct access to `/srv/consultant-portal/documents` because documents are read and written through the backend API.

Run the Java service as `portaladmin`. That user needs read/write access to `/srv/consultant-portal/documents` and `/srv/consultant-portal/data`, and read-only access to `/etc/consultant-portal/authorized-users.csv`. Keep `/etc/consultant-portal` out of reach for the web server user.

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

## Review File Changes with Git

This tool does not run Git commands. Review changes outside the tool.

Linux/Mac and Windows PowerShell:

```bash
git diff
```

## Known Limitations

- Markdown rendering is intentionally simple.
- Suggestions are stored in a local JSON file.
- There is no autosave.
- Files must already exist before they can be edited.
