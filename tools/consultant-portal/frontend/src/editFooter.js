const FOOTER_START = '<!-- consultant-portal-edit-footer:start -->';
const FOOTER_END = '<!-- consultant-portal-edit-footer:end -->';
const ISRAEL_TIME_ZONE = 'Asia/Jerusalem';

export function appendEditFooter(markdown, user, date = new Date()) {
  const editor = user || 'unknown user';
  return [
    markdown.trimEnd(),
    '',
    FOOTER_START,
    `Edited by ${editor} at ${formatIsraelIsoTimestamp(date)}`,
    FOOTER_END
  ].join('\n');
}

export function formatIsraelIsoTimestamp(date) {
  const parts = getTimeZoneParts(date, ISRAEL_TIME_ZONE);
  const offsetMinutes = getTimeZoneOffsetMinutes(date, parts);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${formatOffset(offsetMinutes)}`;
}

function getTimeZoneParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });

  return Object.fromEntries(
    formatter.formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  );
}

function getTimeZoneOffsetMinutes(date, parts) {
  const localTimeAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return Math.round((localTimeAsUtc - date.getTime()) / 60000);
}

function formatOffset(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absoluteMinutes = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absoluteMinutes / 60)).padStart(2, '0');
  const minutes = String(absoluteMinutes % 60).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
}
