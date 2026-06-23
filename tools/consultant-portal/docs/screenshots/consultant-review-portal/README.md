# Consultant Review Portal Screenshots

Automated screenshots are not required for this temporary tool. Use these exact manual steps after starting the backend and frontend.

## Start the app

Linux/Mac:

```bash
cd backend
mvn spring-boot:run
```

```bash
cd frontend
npm install
npm run dev
```

Windows PowerShell:

```powershell
cd backend
mvn spring-boot:run
```

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Required screenshots

Save screenshots into this folder with these names:

1. `documents-list.png` - open the initial "מסמכים" page.
2. `document-viewer.png` - open any Markdown document and capture the rendered view.
3. `document-edit-mode.png` - click "עריכה" and capture the raw Markdown editor.
4. `add-suggestion.png` - click "הוספת הצעת שינוי" and capture the form.
5. `review-dashboard.png` - open "סקירת הצעות" and capture the filters plus list.
6. `suggestion-details.png` - open one suggestion from the dashboard and capture the details dialog.
