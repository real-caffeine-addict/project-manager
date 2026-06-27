const HEADING_TAGS = {
  1: 'h1',
  2: 'h2',
  3: 'h3'
};

export function MarkdownDocument({ blocks }) {
  return (
    <article className="markdown">
      {blocks.map((block, index) => <MarkdownBlock block={block} key={index} />)}
    </article>
  );
}

export function MarkdownEditor({ blocks, onChange }) {
  function updateBlock(blockIndex, nextBlock) {
    onChange(blocks.map((block, index) => (index === blockIndex ? nextBlock : block)));
  }

  return (
    <div className="editorBlocks">
      {blocks.map((block, index) => {
        if (block.type === 'table') {
          return (
            <MarkdownTableEditor
              block={block}
              key={index}
              onChange={(nextBlock) => updateBlock(index, nextBlock)}
            />
          );
        }

        if (block.type !== 'paragraph') {
          return <MarkdownBlock block={block} key={index} />;
        }

        const paragraphNumber = getParagraphNumber(blocks, index);
        return (
          <label className="paragraphEditor" key={index}>
            פסקה {paragraphNumber}
            <textarea
              aria-label={`פסקה ${paragraphNumber}`}
              dir="auto"
              value={block.text}
              onChange={(event) => updateBlock(index, { ...block, text: event.target.value })}
            />
          </label>
        );
      })}
    </div>
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

function MarkdownTableEditor({ block, onChange }) {
  function updateHeaderCell(cellIndex, value) {
    onChange({
      ...block,
      header: block.header.map((cell, index) => (index === cellIndex ? sanitizeTableInput(value) : cell))
    });
  }

  function updateBodyCell(rowIndex, cellIndex, value) {
    onChange({
      ...block,
      rows: block.rows.map((row, index) => (
        index === rowIndex
          ? row.map((cell, innerIndex) => (innerIndex === cellIndex ? sanitizeTableInput(value) : cell))
          : row
      ))
    });
  }

  return (
    <div className="markdownTableWrap">
      <table className="markdownTable editableMarkdownTable">
        <thead>
          <tr>
            {block.header.map((cell, cellIndex) => (
              <th key={cellIndex}>
                <input
                  aria-label={`כותרת טבלה ${cellIndex + 1}`}
                  dir="auto"
                  value={cell}
                  onChange={(event) => updateHeaderCell(cellIndex, event.target.value)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  <input
                    aria-label={`תא טבלה ${rowIndex + 1}-${cellIndex + 1}`}
                    dir="auto"
                    value={cell}
                    onChange={(event) => updateBodyCell(rowIndex, cellIndex, event.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

function getParagraphNumber(blocks, blockIndex) {
  return blocks.slice(0, blockIndex + 1).filter((block) => block.type === 'paragraph').length;
}

function sanitizeTableInput(value) {
  return value.replace(/\r?\n/g, ' ');
}
