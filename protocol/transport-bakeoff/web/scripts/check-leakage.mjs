/**
 * H6 — "no transport leakage into the semantic API", as a checked outcome rather than a design
 * claim. The preregistration (README §5, H6) makes this falsifiable, so it is asserted mechanically.
 *
 * Two assertions:
 *   1. The transport-neutral files name no adapter-specific concept.
 *   2. Adapters are constructed at exactly ONE site, so swapping candidates touches one place and
 *      zero lines of semantic code.
 *
 * Comments and string literals are stripped before scanning: a comment *describing* the rule (as
 * these files do) must not trip it, and neither must a log message.
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
  'socket', 'websocket', 'ws', 'wss',
  'http', 'https', 'url', 'uri', 'fetch',
  'header', 'status', 'response', 'request',
  'port', 'opcode', 'closecode', 'tcp', 'subprotocol',
];

function strip(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')   // block comments
    .replace(/\/\/[^\n]*/g, ' ')          // line comments
    .replace(/^\s*\/\/\/[^\n]*$/gm, ' ')  // rust doc comments
    .replace(/^\s*\/\/![^\n]*$/gm, ' ')   // rust inner doc comments
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')  // string literals
    .replace(/'(?:[^'\\]|\\.)*'/g, "''");
}

let failures = 0;

for (const file of NEUTRAL) {
  const code = strip(readFileSync(file, 'utf8'));
  for (const word of FORBIDDEN) {
    const re = new RegExp(`\\b${word}\\b`, 'i');
    const m = re.exec(code);
    if (m) {
      const line = code.slice(0, m.index).split('\n').length;
      console.error(`LEAK  ${file}:${line} — transport-neutral interface names "${m[0]}"`);
      failures++;
    }
  }
}

// Assertion 2: exactly one construction site.
const mainSrc = strip(readFileSync(resolve(web, 'src/main.ts'), 'utf8'));
const constructions = [...mainSrc.matchAll(/new\s+(WebSocketTransport|HttpStreamTransport)\b/g)];
const sites = new Set(
  constructions.map((m) => mainSrc.slice(0, m.index).split('makeTransport').length),
);
if (constructions.length !== 2 || sites.size !== 1) {
  console.error(
    `LEAK  adapters constructed at ${constructions.length} places across ${sites.size} sites; ` +
      'expected both inside the single makeTransport() construction site',
  );
  failures++;
}

// The semantic half of main.ts (everything after makeTransport) must not name an adapter type.
const afterFactory = mainSrc.slice(mainSrc.indexOf('async function hex'));
for (const t of ['WebSocketTransport', 'HttpStreamTransport']) {
  if (afterFactory.includes(t)) {
    console.error(`LEAK  semantic code references adapter type "${t}"`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\ncheck-leakage: FAILED with ${failures} violation(s)`);
  process.exit(1);
}
console.log('check-leakage: PASS — neutral interface is adapter-agnostic; one construction site');
