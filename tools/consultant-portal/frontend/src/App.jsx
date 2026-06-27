import { useEffect, useMemo, useState } from 'react';
import { parseMarkdownDocument } from './markdownBlocks.js';

const TYPES = ['Correction', 'Missing Scenario', 'Domain Risk', 'Contractual Risk', 'Terminology', 'Process Improvement', 'Question'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Blocking'];
const STATUSES = ['Open', 'Accepted', 'Rejected', 'Needs Discussion'];
const HEADING_TAGS = {
  1: 'h1',
  2: 'h2',
  3: 'h3'
};

async function api(path, options) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'הפעולה נכשלה' }));
    throw new Error(error.error || 'הפעולה נכשלה');
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export default function App() {
  const [view, setView] = useState('documents');
  const [documents, setDocuments] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [documentSuggestions, setDocumentSuggestions] = useState([]);
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [auth, setAuth] = useState({ loading: true, authenticated: false, email: null });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const status = await api('/api/auth/status');
      setAuth({ loading: false, authenticated: status.authenticated, email: status.email });
      if (status.authenticated) {
        await loadDocuments();
        await loadSuggestions();
      }
    } catch (err) {
      setAuth({ loading: false, authenticated: false, email: null });
      setError(err.message);
    }
  }

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

  async function authenticated(email) {
    setAuth({ loading: false, authenticated: true, email });
    setError('');
    await loadDocuments();
    await loadSuggestions();
  }

  async function logout() {
    await api('/api/auth/logout', { method: 'POST' });
    setAuth({ loading: false, authenticated: false, email: null });
    setDocuments([]);
    setActiveDocument(null);
    setDocumentSuggestions([]);
    setAllSuggestions([]);
    setView('documents');
  }

  if (auth.loading) {
    return (
      <main>
        <header className="topbar">
          <div>
            <h1>Consultant Review Portal</h1>
            <p>כלי עבודה מקומי לסקירת מסמכי Markdown</p>
          </div>
        </header>
        <div className="notice">טוען...</div>
      </main>
    );
  }

  if (!auth.authenticated) {
    return <AuthPage onAuthenticated={authenticated} />;
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
          <button className="secondary" onClick={logout}>יציאה</button>
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
          onSuggestionDeleted={async () => {
            setMessage('ההערה נמחקה');
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
          onDeleted={async () => {
            setMessage('ההערה נמחקה');
            await loadSuggestions();
          }}
          onError={setError}
        />
      )}
    </main>
  );
}

function AuthPage({ onAuthenticated }) {
  const [form, setForm] = useState({ email: '', mobile: '', otp: '' });
  const [challengeId, setChallengeId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function start(event) {
    event.preventDefault();
    setError('');
    try {
      const response = await api('/api/auth/start', {
        method: 'POST',
        body: JSON.stringify({ email: form.email, mobile: form.mobile })
      });
      setChallengeId(response.challengeId);
      setMessage('קוד חד פעמי נשלח למייל');
    } catch (err) {
      setError(err.message);
    }
  }

  async function verify(event) {
    event.preventDefault();
    setError('');
    try {
      const status = await api('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ challengeId, otp: form.otp })
      });
      await onAuthenticated(status.email);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="authPage">
      <section className="authPanel">
        <h1>Consultant Review Portal</h1>
        {message && <div className="notice success">{message}</div>}
        {error && <div className="notice error">{error}</div>}
        {!challengeId ? (
          <form onSubmit={start}>
            <label>מייל
              <input type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} />
            </label>
            <label>נייד
              <input inputMode="tel" value={form.mobile} onChange={(event) => setField('mobile', event.target.value)} />
            </label>
            <button type="submit">שליחת קוד</button>
          </form>
        ) : (
          <form onSubmit={verify}>
            <label>קוד חד פעמי
              <input inputMode="numeric" value={form.otp} onChange={(event) => setField('otp', event.target.value)} />
            </label>
            <div className="actions">
              <button type="submit">כניסה</button>
              <button type="button" className="secondary" onClick={() => setChallengeId('')}>חזרה</button>
            </div>
          </form>
        )}
      </section>
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

function DocumentPage({ document, suggestions, onSaved, onError, onSuggestionCreated, onSuggestionDeleted }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(document.content);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const documentBlocks = useMemo(() => parseMarkdownDocument(document.content), [document.content]);

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
        <MarkdownDocument blocks={documentBlocks} />
      )}

      <h3>הערות והצעות למסמך</h3>
      <SuggestionList suggestions={suggestions} onDelete={onSuggestionDeleted} onError={onError} />

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

function MarkdownDocument({ blocks }) {
  return (
    <article className="markdown">
      {blocks.map((block, index) => <MarkdownBlock block={block} key={index} />)}
    </article>
  );
}

function MarkdownBlock({ block }) {
  if (block.type === 'heading') {
    const HeadingTag = HEADING_TAGS[block.depth] || 'p';
    return <HeadingTag dir="auto">{block.text}</HeadingTag>;
  }

  if (block.type === 'paragraph') {
    return (
      <p dir="auto">
        {block.text.split('\n').map((line, index) => (
          <span key={index}>
            {index > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
    );
  }

  if (block.type === 'code') {
    return (
      <pre className="codeBlock" dir="ltr">
        <code>{block.code}</code>
      </pre>
    );
  }

  if (block.type === 'table') {
    return <MarkdownTable block={block} />;
  }

  return (
    <pre className="rawMarkdownBlock" dir="auto">
      <code>{block.raw}</code>
    </pre>
  );
}

function MarkdownTable({ block }) {
  return (
    <div className="markdownTableWrap">
      <table className="markdownTable">
        <thead>
          <tr>
            {block.header.map((cell, index) => <th key={index} dir="auto">{cell}</th>)}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => <td key={cellIndex} dir="auto">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SuggestionForm({ document, onClose, onCreated, onError }) {
  const [form, setForm] = useState({
    suggestion: '',
    consultantName: ''
  });
  const [validation, setValidation] = useState('');

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.suggestion.trim() || !form.consultantName.trim()) {
      setValidation('יש למלא הצעה ושם');
      return;
    }
    try {
      await api('/api/suggestions', {
        method: 'POST',
        body: JSON.stringify({
          type: 'Question',
          severity: 'Medium',
          explanation: form.suggestion,
          consultantName: form.consultantName,
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
        <label>הצעה
          <textarea value={form.suggestion} onChange={(event) => setField('suggestion', event.target.value)} />
        </label>
        <label>שם
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

function ReviewDashboard({ suggestions, documents, onChanged, onDeleted, onError }) {
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
      <SuggestionList suggestions={filtered} onSelect={setSelected} onDelete={onDeleted} onError={onError} />
      {selected && <SuggestionDetails suggestion={selected} onClose={() => setSelected(null)} onChanged={onChanged} onDeleted={onDeleted} onError={onError} />}
    </section>
  );
}

function SuggestionList({ suggestions, onSelect, onDelete, onError }) {
  async function removeSuggestion(event, suggestion) {
    event.stopPropagation();
    if (!window.confirm('למחוק את ההערה?')) return;
    try {
      await api(`/api/suggestions/${suggestion.id}`, { method: 'DELETE' });
      await onDelete?.();
    } catch (err) {
      onError?.(err.message);
    }
  }

  if (!suggestions.length) return <p className="empty">אין הערות להצגה</p>;
  return (
    <div className="suggestions">
      {suggestions.map((suggestion) => (
        <div className="suggestionItem" key={suggestion.id}>
          <button className="suggestionSummary" onClick={() => onSelect?.(suggestion)}>
            <strong>{suggestion.documentTitle}</strong>
            <span>{suggestion.type} · {suggestion.severity} · {suggestion.status}</span>
            <span>{suggestion.explanation}</span>
          </button>
          <button className="danger" onClick={(event) => removeSuggestion(event, suggestion)}>מחיקה</button>
        </div>
      ))}
    </div>
  );
}

function SuggestionDetails({ suggestion, onClose, onChanged, onDeleted, onError }) {
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

  async function removeSuggestion() {
    if (!window.confirm('למחוק את ההערה?')) return;
    try {
      await api(`/api/suggestions/${suggestion.id}`, { method: 'DELETE' });
      onClose();
      await onDeleted();
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
          <button className="danger" onClick={removeSuggestion}>מחיקה</button>
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
