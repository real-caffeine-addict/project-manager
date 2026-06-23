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

function mockFetch({ suggestions = [suggestion] } = {}) {
  global.fetch = vi.fn(async (url, options = {}) => {
    if (url === '/api/documents') return json([documentSummary]);
    if (url === '/api/suggestions' && !options.method) return json(suggestions);
    if (url === '/api/documents/cGhhc2UtMC5tZA') return json(documentContent);
    if (url === '/api/documents/cGhhc2UtMC5tZA/suggestions') return json(suggestions);
    if (url === '/api/documents/cGhhc2UtMC5tZA' && options.method === 'PUT') return json({ ...documentContent, content: JSON.parse(options.body).content });
    if (url === '/api/suggestions' && options.method === 'POST') return json({ ...suggestion, id: 's2' });
    if (url === '/api/suggestions/s1/status') return json({ ...suggestion, status: JSON.parse(options.body).status });
    if (url === '/api/suggestions/s1/owner-comment') return json({ ...suggestion, ownerComment: JSON.parse(options.body).ownerComment });
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

  test('renders a document viewer', async () => {
    render(<App />);

    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));

    expect(await screen.findAllByRole('heading', { name: 'Phase 0' })).toHaveLength(2);
    expect(screen.getByText('Opening content')).toBeInTheDocument();
    expect(screen.getByText('Should this include billing?')).toBeInTheDocument();
  });

  test('switches to edit mode and cancels without saving', async () => {
    render(<App />);
    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));
    await userEvent.click(await screen.findByRole('button', { name: 'עריכה' }));

    const editor = screen.getByLabelText('תוכן המסמך');
    await userEvent.clear(editor);
    await userEvent.type(editor, '# Changed');
    await userEvent.click(screen.getByRole('button', { name: 'ביטול' }));

    expect(screen.queryByLabelText('תוכן המסמך')).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalledWith('/api/documents/cGhhc2UtMC5tZA', expect.objectContaining({ method: 'PUT' }));
  });

  test('asks for confirmation before saving edited content', async () => {
    render(<App />);
    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));
    await userEvent.click(await screen.findByRole('button', { name: 'עריכה' }));
    await userEvent.type(screen.getByLabelText('תוכן המסמך'), '\nNew line');
    await userEvent.click(screen.getByRole('button', { name: 'שמירה' }));

    expect(window.confirm).toHaveBeenCalledWith('This will modify the local copied Markdown file.');
    expect(global.fetch).toHaveBeenCalledWith('/api/documents/cGhhc2UtMC5tZA', expect.objectContaining({ method: 'PUT' }));
  });

  test('validates the suggestion form', async () => {
    render(<App />);
    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));
    await userEvent.click(screen.getByRole('button', { name: 'הוספת הצעת שינוי' }));
    await userEvent.click(screen.getByRole('button', { name: 'שמירה' }));

    expect(screen.getByText('יש למלא הסבר ושם יועץ')).toBeInTheDocument();
  });

  test('submits a suggestion', async () => {
    render(<App />);
    await userEvent.click(await screen.findByRole('button', { name: 'פתיחה' }));
    await userEvent.click(screen.getByRole('button', { name: 'הוספת הצעת שינוי' }));

    await userEvent.type(screen.getByLabelText('הסבר'), 'Please add acceptance criteria');
    await userEvent.type(screen.getByLabelText('שם יועץ'), 'Dana');
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
});
