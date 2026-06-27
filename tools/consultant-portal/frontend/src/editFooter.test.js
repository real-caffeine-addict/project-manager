import { describe, expect, test } from 'vitest';
import { appendEditFooter, formatIsraelIsoTimestamp } from './editFooter.js';

describe('editFooter', () => {
  test('formats timestamps in Israel time with an ISO offset', () => {
    expect(formatIsraelIsoTimestamp(new Date('2026-06-27T21:15:30Z'))).toBe('2026-06-28T00:15:30+03:00');
  });

  test('appends the consultant portal footer', () => {
    expect(appendEditFooter('# Title\n', 'dana@example.com', new Date('2026-01-10T10:00:00Z'))).toBe([
      '# Title',
      '',
      '<!-- consultant-portal-edit-footer:start -->',
      'Edited by dana@example.com at 2026-01-10T12:00:00+02:00',
      '<!-- consultant-portal-edit-footer:end -->'
    ].join('\n'));
  });
});
