import { useEffect, useMemo, useState } from 'react';

const TYPES = ['Correction', 'Missing Scenario', 'Domain Risk', 'Contractual Risk', 'Terminology', 'Process Improvement', 'Question'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Blocking'];
const STATUSES = ['Open', 'Accepted', 'Rejected', 'Needs Discussion'];

async function api(path, options) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'הפעולה נכשלה' }));
    throw new Error(error.error || 'הפעולה נכשלה');
  }
  return response.json();
}

function markdownToHtml(markdown) {
  const escaped = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .split(/\n{2,}/)
    .map((block) => {
      const text = block.trim();
      if (!text) return '';
      if (text.startsWith('# ')) return `<h1>${text.slice(2)}</h1>`;
      if (text.startsWith('## ')) return `<h2>${text.slice(3)}</h2>`;
      if (text.startsWith('### ')) return `<h3>${text.slice(4)}</h3>`;
      if (text.split('\n').every((line) => line.startsWith('- '))) {
        return `<ul>${text.split('\n').map((line) => `<li>${line.slice(2)}</li>`).join('')}</ul>`;
      }
      return `<p>${text.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');
}

export default function App() {
  const [view, setView] = useState('documents');
  const [documents, setDocuments] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [documentSuggestions, setDocumentSuggestions] = useState([]);
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadDocuments();
    loadSuggestions();
  }, []);

  async function loadDocuments() {
    setDocuments(await api('/api/documents'));
  }

  async function loadSuggestions() {
    setAllSuggestions(await api('/api/suggestions'));
  }

  async function openDocument(document) {
    const content = await api(`/api/documents/${document.encodedPath}`);
    const suggestions = await api(`/api/documents/${document.encodedPath}/suggestions`);
    setActiveDocument(content);
    setDocumentSuggestions(suggestions);
    setView('document');
    setMessage('');
    setError('');
  }

  async function refreshActiveDocument() {
    if (!activeDocument) return;
    await openDocument(activeDocument);
    await loadSuggestions();
  }

  return (
    <main>
      <header className="topbar">
        <div>
          <h1>Consultant Review Portal</h1>
          <p>כלי עבודה מקומי לסקירת מסמכי Markdown</p>
        </div>
        <nav>
          <button onClick={() => setView('documents')}>מסמכים</button>
          <button onClick={() => { setView('dashboard'); loadSuggestions(); }}>סקירת הצעות</button>
        </nav>
      </header>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      {view === 'documents' && <DocumentsPage documents={documents} onOpen={openDocument} />}
      {view === 'document' && activeDocument && (
        <DocumentPage
          document={activeDocument}
          suggestions={documentSuggestions}
          onSaved={async (text) => {
            setMessage(text);
            await refreshActiveDocument();
          }}
          onError={setError}
          onSuggestionCreated={async () => {
            setMessage('ההערה נשמרה');
            await refreshActiveDocument();
          }}
        />
      )}
      {view === 'dashboard' && (
        <ReviewDashboard
          suggestions={allSuggestions}
          documents={documents}
          onChanged={async () => {
            setMessage('העדכון נשמר');
            await loadSuggestions();
          }}
          onError={setError}
        />
      )}
    </main>
  );
}

function DocumentsPage({ documents, onOpen }) {
  const [search, setSearch] = useState('');
  const visibleDocuments = documents.filter((document) => {
    const text = `${document.filename} ${document.title} ${document.relativePath}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <section>
      <div className="sectionHeader">
        <h2>מסמכים</h2>
        <input aria-label="חיפוש מסמכים" placeholder="חיפוש לפי שם או כותרת" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className="table">
        <div className="row heading">
          <span>שם קובץ</span>
          <span>כותרת</span>
          <span>נתיב</span>
          <span>עודכן לאחרונה</span>
          <span></span>
        </div>
        {visibleDocuments.map((document) => (
          <div className="row" key={document.relativePath}>
            <span>{document.filename}</span>
            <span>{document.title}</span>
            <span>{document.relativePath}</span>
            <span>{formatDate(document.lastModified)}</span>
            <button onClick={() => onOpen(document)}>פתיחה</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function DocumentPage({ document, suggestions, onSaved, onError, onSuggestionCreated }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(document.content);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  useEffect(() => {
    setDraft(document.content);
    setEditing(false);
  }, [document.content]);

  async function save() {
    if (!window.confirm('This will modify the local copied Markdown file.')) return;
    try {
      await api(`/api/documents/${document.encodedPath}`, {
        method: 'PUT',
        body: JSON.stringify({ content: draft })
      });
      onSaved('השינוי נשמר במסמך המקומי');
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <section>
      <div className="sectionHeader">
        <div>
          <h2>{document.title}</h2>
          <p>{document.relativePath}</p>
        </div>
        <div className="actions">
          {!editing && <button onClick={() => setEditing(true)}>עריכה</button>}
          <button onClick={() => setShowSuggestionForm(true)}>הוספת הצעת שינוי</button>
        </div>
      </div>

      {editing ? (
        <div className="editorPane">
          <textarea aria-label="תוכן המסמך" value={draft} onChange={(event) => setDraft(event.target.value)} />
          <div className="actions">
            <button onClick={save}>שמירה</button>
            <button className="secondary" onClick={() => { setDraft(document.content); setEditing(false); }}>ביטול</button>
          </div>
        </div>
      ) : (
        <article className="markdown" dangerouslySetInnerHTML={{ __html: markdownToHtml(document.content) }} />
      )}

      <h3>הערות והצעות למסמך</h3>
      <SuggestionList suggestions={suggestions} />

      {showSuggestionForm && (
        <SuggestionForm
          document={document}
          onClose={() => setShowSuggestionForm(false)}
          onCreated={async () => {
            setShowSuggestionForm(false);
            await onSuggestionCreated();
          }}
          onError={onError}
        />
      )}
    </section>
  );
}

function SuggestionForm({ document, onClose, onCreated, onError }) {
  const [form, setForm] = useState({
    type: 'Question',
    severity: 'Medium',
    sectionTitle: '',
    currentText: '',
    suggestedText: '',
    explanation: '',
    consultantName: ''
  });
  const [validation, setValidation] = useState('');

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.explanation.trim() || !form.consultantName.trim()) {
      setValidation('יש למלא הסבר ושם יועץ');
      return;
    }
    try {
      await api('/api/suggestions', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          documentPath: document.relativePath,
          documentTitle: document.title
        })
      });
      onCreated();
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="הוספת הצעת שינוי">
      <form onSubmit={submit}>
        <h2>הוספת הצעת שינוי</h2>
        {validation && <p className="formError">{validation}</p>}
        <label>סוג
          <select value={form.type} onChange={(event) => setField('type', event.target.value)}>{TYPES.map((value) => <option key={value}>{value}</option>)}</select>
        </label>
        <label>חומרה
          <select value={form.severity} onChange={(event) => setField('severity', event.target.value)}>{SEVERITIES.map((value) => <option key={value}>{value}</option>)}</select>
        </label>
        <label>כותרת סעיף
          <input value={form.sectionTitle} onChange={(event) => setField('sectionTitle', event.target.value)} />
        </label>
        <label>טקסט נוכחי
          <textarea value={form.currentText} onChange={(event) => setField('currentText', event.target.value)} />
        </label>
        <label>טקסט מוצע
          <textarea value={form.suggestedText} onChange={(event) => setField('suggestedText', event.target.value)} />
        </label>
        <label>הסבר
          <textarea value={form.explanation} onChange={(event) => setField('explanation', event.target.value)} />
        </label>
        <label>שם יועץ
          <input value={form.consultantName} onChange={(event) => setField('consultantName', event.target.value)} />
        </label>
        <div className="actions">
          <button type="submit">שמירה</button>
          <button type="button" className="secondary" onClick={onClose}>ביטול</button>
        </div>
      </form>
    </div>
  );
}

function ReviewDashboard({ suggestions, documents, onChanged, onError }) {
  const [filters, setFilters] = useState({ document: '', status: '', type: '', severity: '' });
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => suggestions.filter((suggestion) => (
    (!filters.document || suggestion.documentPath === filters.document) &&
    (!filters.status || suggestion.status === filters.status) &&
    (!filters.type || suggestion.type === filters.type) &&
    (!filters.severity || suggestion.severity === filters.severity)
  )), [suggestions, filters]);

  return (
    <section>
      <div className="sectionHeader">
        <h2>סקירת הצעות</h2>
        <div className="actions">
          <a className="buttonLink" href="/api/export/suggestions.md">ייצוא Markdown</a>
          <a className="buttonLink" href="/api/export/suggestions.csv">ייצוא CSV</a>
        </div>
      </div>
      <div className="filters">
        <select aria-label="סינון לפי מסמך" value={filters.document} onChange={(event) => setFilters({ ...filters, document: event.target.value })}>
          <option value="">כל המסמכים</option>
          {documents.map((document) => <option key={document.relativePath} value={document.relativePath}>{document.title}</option>)}
        </select>
        <select aria-label="סינון לפי סטטוס" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
          <option value="">כל הסטטוסים</option>
          {STATUSES.map((value) => <option key={value}>{value}</option>)}
        </select>
        <select aria-label="סינון לפי סוג" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>
          <option value="">כל הסוגים</option>
          {TYPES.map((value) => <option key={value}>{value}</option>)}
        </select>
        <select aria-label="סינון לפי חומרה" value={filters.severity} onChange={(event) => setFilters({ ...filters, severity: event.target.value })}>
          <option value="">כל רמות החומרה</option>
          {SEVERITIES.map((value) => <option key={value}>{value}</option>)}
        </select>
      </div>
      <SuggestionList suggestions={filtered} onSelect={setSelected} />
      {selected && <SuggestionDetails suggestion={selected} onClose={() => setSelected(null)} onChanged={onChanged} onError={onError} />}
    </section>
  );
}

function SuggestionList({ suggestions, onSelect }) {
  if (!suggestions.length) return <p className="empty">אין הערות להצגה</p>;
  return (
    <div className="suggestions">
      {suggestions.map((suggestion) => (
        <button className="suggestionItem" key={suggestion.id} onClick={() => onSelect?.(suggestion)}>
          <strong>{suggestion.documentTitle}</strong>
          <span>{suggestion.type} · {suggestion.severity} · {suggestion.status}</span>
          <span>{suggestion.explanation}</span>
        </button>
      ))}
    </div>
  );
}

function SuggestionDetails({ suggestion, onClose, onChanged, onError }) {
  const [status, setStatus] = useState(suggestion.status);
  const [ownerComment, setOwnerComment] = useState(suggestion.ownerComment || '');

  async function saveStatus() {
    try {
      await api(`/api/suggestions/${suggestion.id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      await onChanged();
    } catch (err) {
      onError(err.message);
    }
  }

  async function saveComment() {
    try {
      await api(`/api/suggestions/${suggestion.id}/owner-comment`, { method: 'PATCH', body: JSON.stringify({ ownerComment }) });
      await onChanged();
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="פרטי הצעה">
      <div>
        <h2>פרטי הצעה</h2>
        <p><strong>מסמך:</strong> {suggestion.documentTitle}</p>
        <p><strong>הסבר:</strong> {suggestion.explanation}</p>
        {suggestion.suggestedText && <p><strong>טקסט מוצע:</strong> {suggestion.suggestedText}</p>}
        <label>סטטוס טיפול
          <select value={status} onChange={(event) => setStatus(event.target.value)}>{STATUSES.map((value) => <option key={value}>{value}</option>)}</select>
        </label>
        <label>תגובה של בעל הפרויקט
          <textarea value={ownerComment} onChange={(event) => setOwnerComment(event.target.value)} />
        </label>
        <div className="actions">
          <button onClick={saveStatus}>שמירת סטטוס</button>
          <button onClick={saveComment}>שמירת תגובה</button>
          <button className="secondary" onClick={onClose}>סגירה</button>
        </div>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('he-IL', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}
