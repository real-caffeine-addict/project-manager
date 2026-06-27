export function parseMarkdownDocument(markdown) {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === '') {
      index += 1;
      continue;
    }

    const heading = parseHeading(line);
    if (heading) {
      blocks.push(heading);
      index += 1;
      continue;
    }

    if (isFenceStart(line)) {
      const codeBlock = collectCodeBlock(lines, index);
      blocks.push(codeBlock.block);
      index = codeBlock.nextIndex;
      continue;
    }

    if (isTableStart(lines, index)) {
      const tableBlock = collectTable(lines, index);
      blocks.push(tableBlock.block);
      index = tableBlock.nextIndex;
      continue;
    }

    if (isUnsupportedMarkdownStart(line)) {
      const rawBlock = collectRawBlock(lines, index);
      blocks.push(rawBlock.block);
      index = rawBlock.nextIndex;
      continue;
    }

    const paragraph = collectParagraph(lines, index);
    blocks.push(paragraph.block);
    index = paragraph.nextIndex;
  }

  return blocks;
}

export function serializeMarkdownBlocks(blocks) {
  return blocks.map(serializeBlock).join('\n\n');
}

export function escapeTableCell(value) {
  return String(value ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/(?<!\\)\|/g, '\\|')
    .trim();
}

function serializeBlock(block) {
  if (block.type === 'heading') {
    return `${'#'.repeat(block.depth)} ${block.text}`;
  }

  if (block.type === 'paragraph') {
    return block.text;
  }

  if (block.type === 'code') {
    return [block.openingFence, block.code, block.closingFence].filter((part) => part !== '').join('\n');
  }

  if (block.type === 'table') {
    return [
      serializeTableRow(block.header),
      block.separator,
      ...block.rows.map(serializeTableRow)
    ].join('\n');
  }

  return block.raw;
}

function parseHeading(line) {
  const match = line.match(/^(#{1,3})\s+(.+)$/);
  if (!match) return null;
  return {
    type: 'heading',
    depth: match[1].length,
    text: match[2].trim()
  };
}

function isFenceStart(line) {
  return line.startsWith('```');
}

function collectCodeBlock(lines, startIndex) {
  const openingFence = lines[startIndex];
  const codeLines = [];
  let index = startIndex + 1;

  while (index < lines.length && !isFenceStart(lines[index])) {
    codeLines.push(lines[index]);
    index += 1;
  }

  if (index >= lines.length) {
    return {
      block: {
        type: 'raw',
        raw: lines.slice(startIndex).join('\n')
      },
      nextIndex: lines.length
    };
  }

  return {
    block: {
      type: 'code',
      openingFence,
      code: codeLines.join('\n'),
      closingFence: lines[index]
    },
    nextIndex: index + 1
  };
}

function isTableStart(lines, index) {
  if (index + 1 >= lines.length) return false;
  if (!looksLikeTableRow(lines[index]) || !looksLikeTableRow(lines[index + 1])) return false;

  const header = splitTableRow(lines[index]);
  const separator = splitTableRow(lines[index + 1]);

  return (
    header.length > 0 &&
    header.length === separator.length &&
    separator.every((cell) => /^:?-{3,}:?$/.test(cell.trim()))
  );
}

function collectTable(lines, startIndex) {
  const columnCount = splitTableRow(lines[startIndex]).length;
  const rows = [];
  let index = startIndex + 2;

  while (index < lines.length && looksLikeTableRow(lines[index])) {
    const cells = splitTableRow(lines[index]);
    if (cells.length !== columnCount) break;
    rows.push(cells);
    index += 1;
  }

  return {
    block: {
      type: 'table',
      header: splitTableRow(lines[startIndex]),
      separator: lines[startIndex + 1],
      rows,
      columnCount
    },
    nextIndex: index
  };
}

function looksLikeTableRow(line) {
  return line.includes('|');
}

function splitTableRow(line) {
  const trimmed = line.trim();
  const inner = trimmed.startsWith('|') && trimmed.endsWith('|')
    ? trimmed.slice(1, -1)
    : trimmed;
  const cells = [];
  let cell = '';

  for (let index = 0; index < inner.length; index += 1) {
    const character = inner[index];
    if (character === '|' && !isEscaped(inner, index)) {
      cells.push(normalizeCell(cell));
      cell = '';
    } else {
      cell += character;
    }
  }

  cells.push(normalizeCell(cell));
  return cells;
}

function isEscaped(text, index) {
  let slashCount = 0;
  for (let cursor = index - 1; cursor >= 0 && text[cursor] === '\\'; cursor -= 1) {
    slashCount += 1;
  }
  return slashCount % 2 === 1;
}

function normalizeCell(cell) {
  return cell.trim().replace(/\\\|/g, '|');
}

function serializeTableRow(cells) {
  return `| ${cells.map(escapeTableCell).join(' | ')} |`;
}

function isUnsupportedMarkdownStart(line) {
  return /^(\s{0,3}[-*+]\s+|\s{0,3}\d+\.\s+|\s{0,3}>|\s{0,3}---+\s*$|\s{0,3}<[A-Za-z!/])/.test(line);
}

function collectRawBlock(lines, startIndex) {
  const rawLines = [];
  let index = startIndex;

  while (index < lines.length && lines[index].trim() !== '') {
    rawLines.push(lines[index]);
    index += 1;
  }

  return {
    block: {
      type: 'raw',
      raw: rawLines.join('\n')
    },
    nextIndex: index
  };
}

function collectParagraph(lines, startIndex) {
  const paragraphLines = [];
  let index = startIndex;

  while (
    index < lines.length &&
    lines[index].trim() !== '' &&
    !parseHeading(lines[index]) &&
    !isFenceStart(lines[index]) &&
    !isTableStart(lines, index) &&
    !isUnsupportedMarkdownStart(lines[index])
  ) {
    paragraphLines.push(lines[index]);
    index += 1;
  }

  return {
    block: {
      type: 'paragraph',
      text: paragraphLines.join('\n')
    },
    nextIndex: index
  };
}
