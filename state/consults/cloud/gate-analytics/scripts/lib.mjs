// Shared helpers for the gate-log analytics (cloud session 7, piece E's input).
// Reads tracked files only; writes nothing. Every heuristic here is named in REPORT.md's method section.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const OUT = resolve(HERE, '..');
export const ROOT = resolve(HERE, '../../../../..');

export function read(rel) {
  return readFileSync(join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
}

export function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
}

export function listDir(rel) {
  return readdirSync(join(ROOT, rel));
}

export function exists(rel) {
  return existsSync(join(ROOT, rel));
}

export function walk(rel) {
  const out = [];
  for (const name of readdirSync(join(ROOT, rel), { withFileTypes: true })) {
    const p = `${rel}/${name.name}`;
    if (name.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// ---------- statistics ----------
export function median(xs) {
  const a = xs.filter((x) => x != null && !Number.isNaN(x)).sort((p, q) => p - q);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}
export function mean(xs) {
  const a = xs.filter((x) => x != null && !Number.isNaN(x));
  return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;
}
export function pct(n, d) {
  return d ? `${((100 * n) / d).toFixed(0)}%` : '–';
}
export function fmt(x, digits = 1) {
  if (x == null || Number.isNaN(x)) return '–';
  return Number.isInteger(x) ? String(x) : x.toFixed(digits);
}

// ---------- verdicts ----------
// gate-log verdicts: FAIL, PASS, PASS WITH NOTES, VOID. "Passed" = PASS or PASS WITH NOTES.
export const passed = (v) => v === 'PASS' || v === 'PASS WITH NOTES';

export function mdTable(header, rows) {
  const esc = (c) => String(c ?? '–').replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const lines = [`| ${header.map(esc).join(' | ')} |`, `|${header.map(() => '---').join('|')}|`];
  for (const r of rows) lines.push(`| ${r.map(esc).join(' | ')} |`);
  return lines.join('\n');
}

export { basename };
