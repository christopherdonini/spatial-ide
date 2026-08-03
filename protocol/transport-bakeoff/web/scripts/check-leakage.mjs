/**
 * H6 — "no transport leakage into the semantic API", as a checked outcome rather than a design
 * claim. The preregistration (README §5, H6) makes this falsifiable, so it is asserted mechanically.
 *
 * Three assertions:
 *   1. The transport-neutral **data** interface names no adapter-specific concept.
 *   2. Adapters are constructed at exactly ONE site, so swapping candidates touches one place and
 *      zero lines of semantic code.
 *   3. A canary: a planted leak must actually fail the scan. Without this the whole check can go
 *      silently vacuous and still print PASS.
 *
 * Scope note, stated rather than overclaimed: this covers the transport-neutral *data* interface,
 * not every file. `main.ts` legitimately speaks HTTP to the control endpoints (`/clock`, `/facts`,
 * `/report`), which ADR-004 puts on the control plane; scanning it for the word "fetch" would be
 * theatre. What must stay clean is the interface the batch stream flows through.
 *
 * Comments and string literals are stripped before scanning: a comment *describing* the rule (as
 * these files do) must not trip it, and neither must a log message. Stripping strings is right
 * here specifically because the error taxonomy confines adapter detail to an opaque `detail`
 * string — the design's intended escape hatch.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const web = resolve(here, '..');
const crate = resolve(web, '..');

/** Files that must contain no adapter-specific vocabulary at all. */
const NEUTRAL = [
  resolve(web, 'src/transport.ts'),
  resolve(crate, 'src/transport.rs'),
];

/** Vocabulary the interface may never name (README §5). */
const FORBIDDEN = [
  'socket', 'websocket', 'wss',
  'http', 'https', 'url', 'uri', 'fetch',
  'header', 'status', 'response', 'request',
  'opcode', 'closecode', 'tcp', 'subprotocol',
];

/** Whole-word-only terms: too short or too common for substring matching. */
const FORBIDDEN_WORDS = ['ws', 'port'];

function strip(src) {
  return (
    src
      .replace(/\/\*[\s\S]*?\*\//g, ' ') // block comments
      .replace(/\/\/[^\n]*/g, ' ') // line + rust doc comments
      // Rust lifetimes must be neutralised BEFORE quote-stripping, or `<'a>` opens a bogus string
      // literal and silently swallows the code after it — which would make this scan vacuous the
      // day a lifetime is introduced.
      .replace(/&'[a-z_][a-z0-9_]*\s/gi, '&')
      .replace(/<'[a-z_][a-z0-9_]*>/gi, '<>')
      .replace(/'[a-z_][a-z0-9_]*\s*,/gi, ',')
      .replace(/"(?:[^"\\]|\\.)*"/g, '""') // string literals
      .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
  );
}

/**
 * Standard-library identifiers that merely collide with the word list. `AtomicU64::fetch_add` is
 * not an HTTP `fetch`. Kept as an explicit, short allowlist so an exception is visible rather than
 * achieved by weakening the matcher.
 */
const ALLOW = new Set([
  'fetch_add', 'fetch_sub', 'fetch_and', 'fetch_or', 'fetch_xor',
  'fetch_update', 'fetch_max', 'fetch_min', 'fetch_nand',
]);

function lineIndex(code) {
  const starts = [0];
  for (let i = 0; i < code.length; i++) if (code[i] === '\n') starts.push(i + 1);
  return (offset) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

/**
 * A leak takes the shape of an identifier (`WebSocketTransport`, `httpStatus`, `ws_handle`), not a
 * bare lowercase word. Split identifiers on case and underscore boundaries, then match parts by
 * substring — `\bword\b` would miss every realistic leak.
 */
function scan(code, label) {
  const failures = new Set();
  const lineOf = lineIndex(code);
  for (const m of code.matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)) {
    const ident = m[0];
    if (ALLOW.has(ident.toLowerCase())) continue;
    const pieces = new Set([ident.toLowerCase()]);
    for (const piece of ident.split(
      /_|(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/,
    )) {
      if (piece) pieces.add(piece.toLowerCase());
    }
    const line = lineOf(m.index);
    for (const word of FORBIDDEN) {
      if ([...pieces].some((p) => p.includes(word))) {
        failures.add(`${label}:${line} — names "${ident}" (contains "${word}")`);
      }
    }
    if ([...pieces].some((p) => FORBIDDEN_WORDS.includes(p))) {
      failures.add(`${label}:${line} — names "${ident}" (reserved word)`);
    }
  }
  return [...failures];
}

let failures = [];

for (const file of NEUTRAL) {
  failures.push(...scan(strip(readFileSync(file, 'utf8')), file));
}

// Assertion 2: exactly one construction site.
const mainSrc = strip(readFileSync(resolve(web, 'src/main.ts'), 'utf8'));
const constructions = [...mainSrc.matchAll(/new\s+(WebSocketTransport|HttpStreamTransport)\b/g)];
const sites = new Set(
  constructions.map((m) => mainSrc.slice(0, m.index).split('makeTransport').length),
);
if (constructions.length !== 2 || sites.size !== 1) {
  failures.push(
    `adapters constructed at ${constructions.length} places across ${sites.size} sites; ` +
      'expected both inside the single makeTransport() construction site',
  );
}

// The semantic half of main.ts must not name an adapter type.
const afterFactory = mainSrc.slice(mainSrc.indexOf('async function hex'));
for (const t of ['WebSocketTransport', 'HttpStreamTransport']) {
  if (afterFactory.includes(t)) failures.push(`semantic code references adapter type "${t}"`);
}

// Assertion 3: the canary. If a planted leak does not fail, the scan proves nothing.
//
// Leak placement is deliberate. An earlier canary put every planted leak *after* the lifetime pair,
// so it scored identically against the broken quote-stripper it was meant to guard — the regression
// it existed to catch went undetected. `SocketLike` now sits BETWEEN the two ticks, exactly where a
// stripper that treats `'a` as a quote delimiter would swallow it.
const CANARY = `
  fn drive<'a>(x: &SocketLike, y: &'a str) {}
  fn wsHandle() {}
  fn send_over_socket() {}
  let httpStatus = 1;
`;
const EXPECTED_CANARY = ['SocketLike', 'wsHandle', 'send_over_socket', 'httpStatus'];
const canaryHits = scan(strip(CANARY), 'canary');
const caught = new Set(
  canaryHits.flatMap((h) => EXPECTED_CANARY.filter((e) => h.includes(`"${e}"`))),
);
const missed = EXPECTED_CANARY.filter((e) => !caught.has(e));
if (missed.length > 0) {
  // Assert the exact set, not a count: a count passes while the one leak that matters is missed.
  failures.push(
    `CANARY FAILED — planted leaks not detected: ${missed.join(', ')}. ` +
      'The scan is vacuous for those shapes and its PASS means nothing.',
  );
}

if (failures.length > 0) {
  for (const f of failures) console.error(`LEAK  ${f}`);
  console.error(`\ncheck-leakage: FAILED with ${failures.length} violation(s)`);
  process.exit(1);
}
console.log(
  `check-leakage: PASS — neutral data interface is adapter-agnostic; one construction site; ` +
    `canary caught all ${EXPECTED_CANARY.length} planted leaks (${EXPECTED_CANARY.join(', ')})`,
);
