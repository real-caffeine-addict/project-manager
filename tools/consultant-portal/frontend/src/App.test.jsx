import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import App from './App.jsx';

const documentSummary = {
  filename: 'phase-0.md',
  title: 'Phase 0',
  relativePath: 'phase-0.md',
  encodedPath: 'cGhhc2UtMC5tZA',
  lastModified: '2026-06-23T08:00:00Z'
};

const documentContent = {
  ...documentSummary,
  content: '# Phase 0\n\nOpening content'
};

const suggestion = {
  id: 's1',
  documentPath: 'phase-0.md',
  documentTitle: 'Phase 0',
  type: 'Question',
  severity: 'Medium',
  explanation: 'Should this include billing?',
  consultantName: 'Dana',
  status: 'Open'
};

function mockFetch({ suggestions = [suggestion], authenticated = true, document = documentContent } = {}) {
  global.fetch = vi.fn(async (url, options = {}) => {
    if (url === '/api/auth/status') return json({ authenticated, email: authenticated ? 'dana@example.com' : null });
    if (url === '/api/auth/start') return json({ challengeId: 'challenge-1' });
    if (url === '/api/auth/verify') return json({ authenticated: true, email: 'dana@example.com' });
    if (url === '/api/auth/logout') return json({ authenticated: false, email: null });
    if (url === '/api/documents') return json([documentSummary]);
    if (url === '/api/suggestions' && !options.method) return json(suggestions);
    if (url === '/api/documents/cGhhc2UtMC5tZA' && options.method === 'PUT') return json({ ...document, content: JSON.parse(options.body).content });
    if (url === '/api/documents/cGhhc2UtMC5tZA') return json(document);
    if (url === '/api/documents/cGhhc2UtMC5tZA/suggestions') return json(suggestions);
    if (url === '/api/suggestions' && options.method === 'POST') return json({ ...suggestion, id: 's2' });
    if (url === '/api/suggestions/s1/status') return json({ ...suggestion, status: JSON.parse(options.body).status });
    if (url === '/api/suggestions/s1/owner-comment') return json({ ...suggestion, ownerComment: JSON.parse(options.body).ownerComment });
    if (url === '/api/suggestions/s1' && options.method === 'DELETE') return { ok: true, status: 204, json: async () => null };
    throw new Error(`Unexpected request: ${url}`);
  });
}

function json(body) {
  return { ok: true, json: async () => body };
}

describe('App', () => {
  beforeEach(() => {
    mockFetch();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test('renders the documents list', async () => {
    render(<App />);

    expect(await screen.findAllByText('phase-0.md')).toHaveLength(2);
    expect(screen.getByText('Phase 0')).toBeInTheDocument();
  });

  test('authenticates with email, mobile, and otp', async () => {
    mockFetch({ authenticated: false });
    render(<App />);

    await userEvent.type(await screen.findByLabelText('מייל'), 'dana@example.com');
    await userEvent.type(screen.getByLabelText('נייד'), '0501234567');
    await userEvent.click(screen.getByRole('button', { name: 'שליחת קוד' }));
    await userEvent.type(await screen.findByLabelText('קוד חד פעמי'), '123456');
    await userEvent.click(screen.getByRole('button', { name: 'כניסה' }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/auth/verify', expect.objectContaining({ method: 'POST' })));
    expect(await screen.findAllByText('phase-0.md')).toHaveLength(2);
  });

  test('renders a document viewer', async () => {
    render(<App />);

    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));

    expect(await screen.findAllByRole('heading', { name: 'Phase 0' })).toHaveLength(2);
    expect(screen.getByText('Opening content')).toBeInTheDocument();
    expect(screen.getByText('Should this include billing?')).toBeInTheDocument();
  });

  test('renders structured markdown preview blocks without raw html', async () => {
    mockFetch({
      document: {
        ...documentContent,
        content: [
          '# Phase 0',
          '',
          'Opening content',
          '',
          '```js',
          'const value = 1;',
          '```',
          '',
          '| Area | Status |',
          '| --- | --- |',
          '| Scope | Ready |',
          '',
          '- preserved item',
          '',
          '#### Unsupported heading',
          '',
          '<strong>literal html</strong>'
        ].join('\n')
      }
    });
    const { container } = render(<App />);

    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));

    expect(await screen.findByRole('heading', { name: 'Phase 0', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('const value = 1;')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Area' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Ready' })).toBeInTheDocument();
    expect(screen.getByText('- preserved item')).toBeInTheDocument();
    expect(screen.getByText('#### Unsupported heading')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Unsupported heading', level: 4 })).not.toBeInTheDocument();
    expect(screen.getByText('<strong>literal html</strong>')).toBeInTheDocument();
    expect(container.querySelector('.markdown strong')).not.toBeInTheDocument();
  });

  test('switches to edit mode and cancels without saving', async () => {
    render(<App />);
    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));
    await userEvent.click(await screen.findByRole('button', { name: 'עריכה' }));

    const editor = screen.getByLabelText('פסקה 1');
    await userEvent.clear(editor);
    await userEvent.type(editor, 'Changed paragraph');
    await userEvent.click(screen.getByRole('button', { name: 'ביטול' }));

    expect(screen.queryByLabelText('פסקה 1')).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalledWith('/api/documents/cGhhc2UtMC5tZA', expect.objectContaining({ method: 'PUT' }));
  });

  test('asks for confirmation before saving edited paragraph content', async () => {
    mockFetch({
      document: {
        ...documentContent,
        content: [
          '# Phase 0',
          '',
          'Opening content',
          '',
          '```js',
          'const value = 1;',
          '```',
          '',
          '| Area | Status |',
          '| --- | --- |',
          '| Scope | Ready |'
        ].join('\n')
      }
    });
    render(<App />);
    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));
    await userEvent.click(await screen.findByRole('button', { name: 'עריכה' }));
    await userEvent.type(screen.getByLabelText('פסקה 1'), '\nNew line');
    await userEvent.click(screen.getByRole('button', { name: 'שמירה' }));

    expect(window.confirm).toHaveBeenCalledWith('This will modify the local copied Markdown file.');
    expect(global.fetch).toHaveBeenCalledWith('/api/documents/cGhhc2UtMC5tZA', expect.objectContaining({ method: 'PUT' }));

    const saveCall = global.fetch.mock.calls.find(([url, options]) => (
      url === '/api/documents/cGhhc2UtMC5tZA' && options?.method === 'PUT'
    ));
    const savedContent = JSON.parse(saveCall[1].body).content;
    expect(savedContent.startsWith([
      '# Phase 0',
      '',
      'Opening content',
      'New line',
      '',
      '```js',
      'const value = 1;',
      '```',
      '',
      '| Area | Status |',
      '| --- | --- |',
      '| Scope | Ready |',
      '',
      '<!-- consultant-portal-edit-footer:start -->',
      'Edited by dana@example.com at '
    ].join('\n'))).toBe(true);
    expect(savedContent).toMatch(/Edited by dana@example\.com at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+0[23]:00/);
    expect(savedContent.endsWith('<!-- consultant-portal-edit-footer:end -->')).toBe(true);
  });

  test('edits table cells without changing table structure', async () => {
    mockFetch({
      document: {
        ...documentContent,
        content: [
          '# Phase 0',
          '',
          '| Area | Status |',
          '| --- | --- |',
          '| Scope | Ready |',
          '| Risk | Open |'
        ].join('\n')
      }
    });
    render(<App />);
    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));
    await userEvent.click(await screen.findByRole('button', { name: 'עריכה' }));

    const firstCell = screen.getByLabelText('תא טבלה 1-2');
    await userEvent.clear(firstCell);
    await userEvent.type(firstCell, 'Ready | blocked');
    await userEvent.click(screen.getByRole('button', { name: 'שמירה' }));

    const saveCall = global.fetch.mock.calls.find(([url, options]) => (
      url === '/api/documents/cGhhc2UtMC5tZA' && options?.method === 'PUT'
    ));
    const savedContent = JSON.parse(saveCall[1].body).content;
    expect(savedContent.startsWith([
      '# Phase 0',
      '',
      '| Area | Status |',
      '| --- | --- |',
      '| Scope | Ready \\| blocked |',
      '| Risk | Open |',
      '',
      '<!-- consultant-portal-edit-footer:start -->',
      'Edited by dana@example.com at '
    ].join('\n'))).toBe(true);
    expect(savedContent).toMatch(/Edited by dana@example\.com at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+0[23]:00/);
    expect(savedContent.endsWith('<!-- consultant-portal-edit-footer:end -->')).toBe(true);
  });

  test('validates the suggestion form', async () => {
    render(<App />);
    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));
    await userEvent.click(screen.getByRole('button', { name: 'הוספת הצעת שינוי' }));
    await userEvent.click(screen.getByRole('button', { name: 'שמירה' }));

    expect(screen.getByText('יש למלא הצעה ושם')).toBeInTheDocument();
  });

  test('submits a suggestion', async () => {
    render(<App />);
    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));
    await userEvent.click(screen.getByRole('button', { name: 'הוספת הצעת שינוי' }));

    await userEvent.type(screen.getByLabelText('הצעה'), 'Please add acceptance criteria');
    await userEvent.type(screen.getByLabelText('שם'), 'Dana');
    await userEvent.click(screen.getByRole('button', { name: 'שמירה' }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/suggestions', expect.objectContaining({ method: 'POST' })));
  });

  test('filters the review dashboard', async () => {
    mockFetch({
      suggestions: [
        suggestion,
        { ...suggestion, id: 's2', type: 'Correction', severity: 'High', status: 'Accepted', explanation: 'Fix typo' }
      ]
    });
    render(<App />);

    await userEvent.click(await screen.findByRole('button', { name: 'סקירת הצעות' }));
    await userEvent.selectOptions(screen.getByLabelText('סינון לפי סטטוס'), 'Accepted');

    const list = screen.getByText('Fix typo').closest('.suggestions');
    expect(within(list).getByText('Fix typo')).toBeInTheDocument();
    expect(screen.queryByText('Should this include billing?')).not.toBeInTheDocument();
  });

  test('removes a suggestion from the document view', async () => {
    render(<App />);
    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));
    await userEvent.click(await screen.findByRole('button', { name: 'מחיקה' }));

    expect(window.confirm).toHaveBeenCalledWith('למחוק את ההערה?');
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/suggestions/s1', expect.objectContaining({ method: 'DELETE' })));
  });
});
