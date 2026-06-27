import { describe, expect, test } from 'vitest';
import { escapeTableCell, parseMarkdownDocument, serializeMarkdownBlocks } from './markdownBlocks.js';

describe('markdownBlocks', () => {
  test('parses supported headings and paragraphs', () => {
    const blocks = parseMarkdownDocument('# Title\n\n## Section\n\nA normal paragraph\nwith two lines.');

    expect(blocks).toEqual([
      { type: 'heading', depth: 1, text: 'Title' },
      { type: 'heading', depth: 2, text: 'Section' },
      { type: 'paragraph', text: 'A normal paragraph\nwith two lines.' }
    ]);
  });

  test('serializes headings and paragraphs', () => {
    const markdown = serializeMarkdownBlocks([
      { type: 'heading', depth: 1, text: 'Title' },
      { type: 'paragraph', text: 'Updated paragraph' }
    ]);

    expect(markdown).toBe('# Title\n\nUpdated paragraph');
  });

  test('preserves fenced code blocks during a round trip', () => {
    const markdown = 'Before\n\n```js\nconst value = "|";\nconsole.log(value);\n```\n\nAfter';

    expect(serializeMarkdownBlocks(parseMarkdownDocument(markdown))).toBe(markdown);
  });

  test('parses simple pipe tables with fixed dimensions', () => {
    const blocks = parseMarkdownDocument('| Name | Notes |\n| --- | --- |\n| Dana | Uses \\| safely |');

    expect(blocks).toEqual([
      {
        type: 'table',
        header: ['Name', 'Notes'],
        separator: '| --- | --- |',
        rows: [['Dana', 'Uses | safely']],
        columnCount: 2
      }
    ]);
  });

  test('escapes table cell pipes and strips multiline cell breaks', () => {
    expect(escapeTableCell('A | B\nC')).toBe('A \\| B C');
  });

  test('serializes table cells without changing table structure', () => {
    const markdown = serializeMarkdownBlocks([
      {
        type: 'table',
        header: ['Name', 'Notes'],
        separator: '| --- | --- |',
        rows: [['Dana', 'A | B']],
        columnCount: 2
      }
    ]);

    expect(markdown).toBe('| Name | Notes |\n| --- | --- |\n| Dana | A \\| B |');
  });

  test('preserves unsupported markdown as raw blocks', () => {
    const markdown = '- item one\n- item two\n\n> quoted\n\n#### Unsupported heading';

    expect(parseMarkdownDocument(markdown)).toEqual([
      { type: 'raw', raw: '- item one\n- item two' },
      { type: 'raw', raw: '> quoted' },
      { type: 'raw', raw: '#### Unsupported heading' }
    ]);
    expect(serializeMarkdownBlocks(parseMarkdownDocument(markdown))).toBe(markdown);
  });

  test('keeps an unclosed code fence as raw markdown', () => {
    const markdown = '```text\nunfinished';

    expect(parseMarkdownDocument(markdown)).toEqual([
      { type: 'raw', raw: markdown }
    ]);
    expect(serializeMarkdownBlocks(parseMarkdownDocument(markdown))).toBe(markdown);
  });
});
