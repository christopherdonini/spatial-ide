// scripts/plan/yamlSubset.mjs
//
// The declared YAML subset parser (AUTONOMY.md §1):
//
//   "Format: a declared YAML subset, parsed by scripts/plan/yamlSubset.mjs (no dependency is
//   added — dependency additions are the human's). The subset: two-space indentation; key: value
//   scalars (unquoted plain strings, "double-quoted" strings with JSON escapes, integers,
//   true/false, null); block lists of scalars or of maps (- items); flow lists [a, b]; flow maps
//   {k: v, k2: v2}; # comments; no multi-line scalars, anchors, tags or nested flow inside flow.
//   The parser rejects anything outside the subset with the line number; verify:plan runs it
//   first."
//
// Node's standard library only (fs is used by callers, not here). No dependency is added.

/** Thrown for any construct outside the declared subset, or malformed input. Carries `.line`. */
export class YamlSubsetError extends Error {
  constructor(message, line, source) {
    super(`${source ? `${source}: ` : ''}line ${line}: ${message}`);
    this.name = 'YamlSubsetError';
    this.line = line;
    this.source = source;
  }
}

const KEY_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const INT_RE = /^-?\d+$/;

/** Parses YAML-subset text into plain JS values (objects/arrays/scalars). */
export function parseYamlSubset(text, source = '<yaml>') {
  const lines = tokenizeLines(text, source);
  if (lines.length === 0) return {};
  const [value, pos] = parseBlock(lines, 0, lines[0].indent, source);
  if (pos !== lines.length) {
    throw new YamlSubsetError(
      'unexpected indentation (dedent without a matching container)',
      lines[pos].lineNo,
      source,
    );
  }
  return value;
}

// ---------------------------------------------------------------------------
// Lexing: strip comments (respecting quotes), reject tabs/directives, compute
// per-line indentation, and validate it is a multiple of two spaces.
// ---------------------------------------------------------------------------

function stripComment(line) {
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"' && line[i - 1] !== '\\') {
      inQuote = !inQuote;
    } else if (c === '#' && !inQuote) {
      if (i === 0 || /\s/.test(line[i - 1])) {
        return line.slice(0, i);
      }
    }
  }
  return line;
}

function tokenizeLines(text, source) {
  const rawLines = text.split(/\r\n|\r|\n/);
  const lines = [];
  for (let i = 0; i < rawLines.length; i++) {
    const lineNo = i + 1;
    const raw = rawLines[i];
    if (raw.includes('\t')) {
      throw new YamlSubsetError(
        'tab characters are not part of the declared subset (two-space indentation only)',
        lineNo,
        source,
      );
    }
    const stripped = stripComment(raw);
    if (stripped.trim() === '') continue; // blank line or comment-only line
    const indent = /^ */.exec(stripped)[0].length;
    if (indent % 2 !== 0) {
      throw new YamlSubsetError(
        `indentation must be a multiple of two spaces (found ${indent})`,
        lineNo,
        source,
      );
    }
    const content = stripped.slice(indent).replace(/[ \t]+$/, '');
    if (content === '') continue;
    if (content === '---' || content === '...' || content.startsWith('%')) {
      throw new YamlSubsetError(
        'document markers and directives are not part of the declared subset',
        lineNo,
        source,
      );
    }
    lines.push({ lineNo, indent, content });
  }
  return lines;
}

// ---------------------------------------------------------------------------
// Block-level parsing (maps and lists at two-space indentation steps).
// ---------------------------------------------------------------------------

function isListLine(content) {
  return content === '-' || content.startsWith('- ');
}

function parseBlock(lines, pos, indent, source) {
  if (pos >= lines.length || lines[pos].indent !== indent) {
    const lineNo = pos < lines.length ? lines[pos].lineNo : lines[lines.length - 1].lineNo + 1;
    throw new YamlSubsetError('expected content at this indentation', lineNo, source);
  }
  if (isListLine(lines[pos].content)) {
    return parseBlockList(lines, pos, indent, source);
  }
  return parseBlockMap(lines, pos, indent, source);
}

function parseBlockList(lines, pos, indent, source) {
  const arr = [];
  while (pos < lines.length && lines[pos].indent === indent && isListLine(lines[pos].content)) {
    const line = lines[pos];
    const itemContent = line.content === '-' ? '' : line.content.slice(2);
    if (itemContent.trim() === '') {
      pos++;
      if (pos >= lines.length || lines[pos].indent <= indent) {
        throw new YamlSubsetError('list item has no value', line.lineNo, source);
      }
      const [value, next] = parseBlock(lines, pos, lines[pos].indent, source);
      arr.push(value);
      pos = next;
      continue;
    }
    const kv = splitKeyValue(itemContent);
    if (kv && KEY_RE.test(kv.key)) {
      // A block map, first key inline after "- "; continuation lines align to indent+2.
      const virtualIndent = indent + 2;
      const synthLines = [{ lineNo: line.lineNo, indent: virtualIndent, content: itemContent }];
      pos++;
      while (pos < lines.length && lines[pos].indent > indent) {
        synthLines.push(lines[pos]);
        pos++;
      }
      const [value, consumed] = parseBlockMap(synthLines, 0, virtualIndent, source);
      if (consumed !== synthLines.length) {
        throw new YamlSubsetError(
          'unexpected indentation inside list item',
          synthLines[consumed].lineNo,
          source,
        );
      }
      arr.push(value);
      continue;
    }
    arr.push(parseScalarOrFlow(itemContent, line.lineNo, source));
    pos++;
  }
  return [arr, pos];
}

function parseBlockMap(lines, pos, indent, source) {
  const obj = {};
  while (pos < lines.length && lines[pos].indent === indent && !isListLine(lines[pos].content)) {
    const line = lines[pos];
    const kv = splitKeyValue(line.content);
    if (!kv || !KEY_RE.test(kv.key)) {
      throw new YamlSubsetError(
        'expected "key: value" (outside the declared subset)',
        line.lineNo,
        source,
      );
    }
    const { key, rest } = kv;
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      throw new YamlSubsetError(`duplicate key "${key}"`, line.lineNo, source);
    }
    if (rest === '') {
      pos++;
      if (pos >= lines.length || lines[pos].indent <= indent) {
        throw new YamlSubsetError(`key "${key}" has no value`, line.lineNo, source);
      }
      const [value, next] = parseBlock(lines, pos, lines[pos].indent, source);
      obj[key] = value;
      pos = next;
      continue;
    }
    obj[key] = parseScalarOrFlow(rest, line.lineNo, source);
    pos++;
  }
  return [obj, pos];
}

/** Finds the first colon outside a quoted string, followed by a space or end of content. */
function splitKeyValue(content) {
  let inQuote = false;
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (c === '"' && content[i - 1] !== '\\') {
      inQuote = !inQuote;
    } else if (c === ':' && !inQuote) {
      const after = content[i + 1];
      if (after === undefined || after === ' ') {
        return { key: content.slice(0, i).trim(), rest: content.slice(i + 1).trim() };
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Scalar and flow-collection parsing.
// ---------------------------------------------------------------------------

function parseScalarOrFlow(text, lineNo, source) {
  text = text.trim();
  if (text === '') {
    throw new YamlSubsetError('empty scalar value', lineNo, source);
  }
  if (text[0] === '&' || text[0] === '*' || text[0] === '!') {
    throw new YamlSubsetError(
      'anchors, aliases, and tags are not part of the declared subset',
      lineNo,
      source,
    );
  }
  if (text === '|' || text === '>' || /^[|>][+-]?\d*$/.test(text)) {
    throw new YamlSubsetError(
      'multi-line block scalars are not part of the declared subset',
      lineNo,
      source,
    );
  }
  if (text[0] === '"') return parseDoubleQuoted(text, lineNo, source);
  if (text[0] === '[') return parseFlowList(text, lineNo, source);
  if (text[0] === '{') return parseFlowMap(text, lineNo, source);
  return parsePlainScalar(text);
}

function parseDoubleQuoted(text, lineNo, source) {
  if (text.length < 2 || text[text.length - 1] !== '"') {
    throw new YamlSubsetError('unterminated double-quoted string', lineNo, source);
  }
  let i = 1;
  let closedEarly = false;
  while (i < text.length - 1) {
    if (text[i] === '\\') {
      i += 2;
      continue;
    }
    if (text[i] === '"') {
      closedEarly = true;
      break;
    }
    i++;
  }
  if (closedEarly) {
    throw new YamlSubsetError('unexpected content after closing quote', lineNo, source);
  }
  try {
    const value = JSON.parse(text);
    if (typeof value !== 'string') {
      throw new Error('not a string');
    }
    return value;
  } catch (e) {
    throw new YamlSubsetError(`invalid double-quoted string (${e.message})`, lineNo, source);
  }
}

function splitFlowItems(inner, lineNo, source) {
  const items = [];
  let inQuote = false;
  let current = '';
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === '"' && inner[i - 1] !== '\\') inQuote = !inQuote;
    if (!inQuote) {
      if (c === '[' || c === '{' || c === ']' || c === '}') {
        throw new YamlSubsetError(
          'nested flow collections are not part of the declared subset',
          lineNo,
          source,
        );
      }
      if (c === ',') {
        items.push(current);
        current = '';
        continue;
      }
    }
    current += c;
  }
  items.push(current);
  return items;
}

function parseFlowList(text, lineNo, source) {
  if (text[text.length - 1] !== ']') {
    throw new YamlSubsetError('unterminated flow list', lineNo, source);
  }
  const inner = text.slice(1, -1).trim();
  if (inner === '') return [];
  return splitFlowItems(inner, lineNo, source).map((part) => {
    const t = part.trim();
    if (t[0] === '[' || t[0] === '{') {
      throw new YamlSubsetError(
        'nested flow collections are not part of the declared subset',
        lineNo,
        source,
      );
    }
    return parseScalarOrFlow(t, lineNo, source);
  });
}

function parseFlowMap(text, lineNo, source) {
  if (text[text.length - 1] !== '}') {
    throw new YamlSubsetError('unterminated flow map', lineNo, source);
  }
  const inner = text.slice(1, -1).trim();
  const obj = {};
  if (inner === '') return obj;
  for (const part of splitFlowItems(inner, lineNo, source)) {
    const kv = splitKeyValue(part.trim());
    if (!kv || !KEY_RE.test(kv.key)) {
      throw new YamlSubsetError('expected "key: value" inside flow map', lineNo, source);
    }
    if (kv.rest[0] === '[' || kv.rest[0] === '{') {
      throw new YamlSubsetError(
        'nested flow collections are not part of the declared subset',
        lineNo,
        source,
      );
    }
    obj[kv.key] = parseScalarOrFlow(kv.rest, lineNo, source);
  }
  return obj;
}

function parsePlainScalar(text) {
  if (INT_RE.test(text)) return parseInt(text, 10);
  if (text === 'true') return true;
  if (text === 'false') return false;
  if (text === 'null') return null;
  return text;
}
