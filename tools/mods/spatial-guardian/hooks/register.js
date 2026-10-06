// Guardian v0, the first Spatial IDE mod: a refuse-only plugin (GUARDIAN-V0-PREREGISTRATION.md).
//
// It only refuses. A hook returns { deny: <reason> } or next(e) with the event it received,
// untouched. There is no tool.check hook, no allow, no rewrite, no model call, no request, no
// write. Every refusing registration carries a .catch that denies: a hook that throws or overruns
// is otherwise skipped, and the call would run. The one nudge (N1) refuses nothing.
//
// Rules, each with the ruling it enforces:
//   G1  a force-push or a remote-ref delete (question round 34, item 3)
//   G2  an edit to docs/01 (CLAUDE.md, the constitution's first document is never edited)
//   G3  a change to an accepted ADR or a filed preregistration, except by appending
//   G4  a rewrite of an existing file under state/directives/ (filed verbatim, once)
//   G6  a write by a report-only subagent outside the REPORT PATH its brief declares (question
//       round 41, item 3; round 43, item 4)
//   N1  one appended line per 5-point band from 80% of the auto-compaction threshold, on a stale or old block
// G5 (the profile-path refusal) is not in v0 (question round 43, item 3).

import { judgeContinuity } from './continuity.mjs';

// Declared values (the form's section 7).
const PROCESS_TIMEOUT_MS = 2000;
const N1_THRESHOLD = 80;
const N1_BAND = 5;
const REPORT_ONLY_TYPES = ['architect', 'lead-data', 'evidence-reader'];
const REPORT_LINE = /^REPORT PATH: (.+)$/;

const G1_REASON = 'spatial-guardian G1: refused, because this git push force-pushes or deletes a remote ref.';
const G2_REASON = 'spatial-guardian G2: refused, because docs/01 is never edited.';
const G3_REASON = 'spatial-guardian G3: refused, because an accepted ADR or a filed preregistration changes only by appending.';
const G4_REASON = 'spatial-guardian G4: refused, because an existing directive is never rewritten.';
const G6_REASON = "spatial-guardian G6: refused, because this run writes only its brief's REPORT PATH.";
const UNPLACEABLE_REASON = 'spatial-guardian: refused, because the path cannot be placed.';
const CATCH_REASON = 'spatial-guardian: refused, because a check could not complete.';

// The brief's N1 sentence, with N replaced by the integer percent.
const N1_TEXT = (p) => `Context at ${Math.round(p)}%: flush the continuity block now (rewrite, commit, push), then continue.`;

// ---------------------------------------------------------------------------------------------
// G1: the command string, read and never run.
// ---------------------------------------------------------------------------------------------

const MAX_RESCAN_DEPTH = 4;

// git's global options that take the next token as their value.
const GIT_GLOBAL_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--super-prefix', '--config-env']);

// The long push options that force or delete. git accepts any unambiguous prefix of a long option,
// so a proper prefix of one of these is refused as well.
const FORCING_LONG_OPTIONS = ['force', 'force-with-lease', 'mirror', 'delete', 'prune'];

// Splits a command at ; && || | & and newlines outside quotes. The last segment reports an
// unbalanced quote. The second reading (`atGroups`) also splits at ( ) { } and the backtick, each
// outside quotes and not escaped by a backslash.
function splitSegments(command, atGroups = false) {
  const segments = [];
  let current = '';
  let quote = null;
  for (let i = 0; i < command.length; i++) {
    const ch = command[i];
    if (quote === "'") {
      current += ch;
      if (ch === "'") quote = null;
      continue;
    }
    if (quote === '"') {
      current += ch;
      if (ch === '\\' && i + 1 < command.length) {
        i += 1;
        current += command[i];
      } else if (ch === '"') {
        quote = null;
      }
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === '\\' && i + 1 < command.length) {
      i += 1;
      current += ch + command[i];
      continue;
    }
    if (ch === ';' || ch === '|' || ch === '&' || ch === '\n' || ch === '\r') {
      segments.push(current);
      current = '';
      if ((ch === '&' || ch === '|') && command[i + 1] === ch) i += 1;
      continue;
    }
    if (atGroups && (ch === '(' || ch === ')' || ch === '{' || ch === '}' || ch === '`')) {
      segments.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  segments.push(current);
  return segments;
}

// Tokenises one segment with single and double quotes. Each token carries whether any part of it
// was quoted. `unbalanced` is true when a quote is left open.
function tokenise(text) {
  const tokens = [];
  let current = '';
  let started = false;
  let quoted = false;
  let quote = null;
  const flush = () => {
    if (started) tokens.push({ value: current, quoted });
    current = '';
    started = false;
    quoted = false;
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote === "'") {
      if (ch === "'") quote = null;
      else current += ch;
      continue;
    }
    if (quote === '"') {
      if (ch === '\\' && (text[i + 1] === '"' || text[i + 1] === '\\')) {
        i += 1;
        current += text[i];
      } else if (ch === '"') {
        quote = null;
      } else {
        current += ch;
      }
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      started = true;
      quoted = true;
      continue;
    }
    if (ch === '\\' && (text[i + 1] === '"' || text[i + 1] === "'")) {
      i += 1;
      current += text[i];
      started = true;
      continue;
    }
    if (/\s/.test(ch)) {
      flush();
      continue;
    }
    current += ch;
    started = true;
  }
  flush();
  return { tokens, unbalanced: quote !== null };
}

function isGit(value) {
  const base = value.split(/[\\/]/).pop().toLowerCase();
  return base === 'git' || base === 'git.exe';
}

// True when a long-option name (the part before any `=`) is a proper prefix of a forcing option.
function abbreviatesForcingOption(name) {
  return name.length > 0 && FORCING_LONG_OPTIONS.some((long) => long.length > name.length && long.startsWith(name));
}

// The arguments after `push`: true when any of them forces, mirrors, deletes or prunes.
function pushArgumentsRefuse(args) {
  let optionsEnded = false;
  for (const arg of args) {
    if (!optionsEnded && arg === '--') {
      optionsEnded = true;
      continue;
    }
    if (!optionsEnded && arg.startsWith('--')) {
      if (arg === '--force' || arg.startsWith('--force=')) return true;
      if (arg === '--force-with-lease' || arg.startsWith('--force-with-lease=')) return true;
      if (arg === '--mirror') return true;
      if (arg === '--delete') return true;
      if (arg === '--prune') return true;
      if (abbreviatesForcingOption(arg.slice(2).split('=')[0])) return true;
      continue;
    }
    if (!optionsEnded && arg.startsWith('-') && arg.length > 1) {
      if (arg === '-f' || arg === '-d') return true;
      if (/^-[A-Za-z0-9]*[fd]/.test(arg)) return true;
      continue;
    }
    if (arg.startsWith('+')) return true;
    if (arg.startsWith(':')) return true;
  }
  return false;
}

// True when a segment's tokens hold git, then git's global options, then push with a refused argument.
function segmentPushRefused(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    if (!isGit(tokens[i].value)) continue;
    let j = i + 1;
    while (j < tokens.length && tokens[j].value.startsWith('-')) {
      j += GIT_GLOBAL_WITH_VALUE.has(tokens[j].value) ? 2 : 1;
    }
    if (j < tokens.length && tokens[j].value === 'push') {
      if (pushArgumentsRefuse(tokens.slice(j + 1).map((t) => t.value))) return true;
    }
  }
  return false;
}

// One reading of a command: split it (at the second reading's extra boundaries when `atGroups`),
// then each segment goes through the per-segment steps.
function readingRefuses(command, depth, atGroups) {
  for (const text of splitSegments(command, atGroups)) {
    const { tokens, unbalanced } = tokenise(text);
    if (unbalanced) {
      if (text.includes('push')) return true;
      continue;
    }
    for (const token of tokens) {
      if (token.quoted && /\bgit\b/.test(token.value) && /\bpush\b/.test(token.value)) {
        if (depth >= MAX_RESCAN_DEPTH) return true;
        if (pushRefused(token.value, depth + 1)) return true;
      }
    }
    if (segmentPushRefused(tokens)) return true;
  }
  return false;
}

// G1 reads a command twice and refuses when either reading refuses: the first reading splits at
// ; && || | & and newlines, the second also at ( ) { } and the backtick. The first alone would
// miss a push written flush against a bracket; the second alone would move a forcing argument that
// a substitution supplies out of its push segment.
function pushRefused(command, depth = 0) {
  return readingRefuses(command, depth, false) || readingRefuses(command, depth, true);
}

// ---------------------------------------------------------------------------------------------
// Placement and matching: the one OS-touching part. No platform branch, no drive letter assumed.
// ---------------------------------------------------------------------------------------------

function isEnoent(err) {
  return err?.code === 'ENOENT' || /ENOENT/.test(String(err?.message ?? err));
}

// Where a path lands, as { real, exists }, or undefined when it cannot be placed. A spelling that
// cannot be placed returns undefined with no file system call: drive-relative, a \\ or // path, a
// name that is empty, . or .., or a name holding a drive. A file that is there gives its realPath.
// A file that is not (ENOENT) gives its folder's realPath plus the name. Any other failure throws,
// and the registration's catch denies.
async function place($, path) {
  if (typeof path !== 'string') return undefined;
  const cut = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
  const name = path.slice(cut + 1);
  const isPlaceable =
    !/^[A-Za-z]:(?![\\/])/.test(path) &&
    !/^[\\/][\\/]/.test(path) &&
    !/^[A-Za-z]:/.test(name) &&
    name !== '' &&
    name !== '.' &&
    name !== '..';
  if (!isPlaceable) return undefined;

  let own;
  try {
    own = await $.fs.stat(path, { resolve: true });
  } catch (err) {
    if (!isEnoent(err)) throw err;
  }
  if (own !== undefined) return own.realPath === undefined ? undefined : { real: own.realPath, exists: true };

  const folder = cut < 0 ? '.' : path.slice(0, cut + 1);
  let dir;
  try {
    dir = await $.fs.stat(folder, { resolve: true });
  } catch {
    return undefined;
  }
  if (dir.realPath === undefined) return undefined;
  return { real: `${dir.realPath.replace(/[\\/]$/, '')}/${name}`, exists: false };
}

// Every backslash becomes a slash and ASCII is lower-cased: one matcher on every platform.
function normalise(real) {
  return real.replace(/\\/g, '/').replace(/[A-Z]/g, (c) => c.toLowerCase());
}

const DOCS_01_SUFFIX = '/docs/01_principles.md';
const ADR_PATTERN = /\/docs\/adr\/adr-\d+-[^/]+\.md$/;
const DIRECTIVES_SEGMENT = '/state/directives/';
const PREREGISTRATION_SUFFIX = 'preregistration.md';

// An ADR is Proposed when the first of its first 10 lines that starts with an optional `*` run,
// then Status, has Proposed as its first word once `*`, `:` and spaces are stripped. No status
// line, or any other word, is not Proposed: unrecognised means protected.
function isProposed(text) {
  const lines = text.split(/\r\n|\r|\n/).slice(0, 10);
  const line = lines.find((l) => /^\**\s*Status/.test(l));
  if (line === undefined) return false;
  const rest = line.replace(/^\**\s*Status/, '').replace(/^[*:\s]+/, '');
  return /^Proposed\b/.test(rest);
}

function occursOnce(haystack, needle) {
  if (needle === '') return false;
  const first = haystack.indexOf(needle);
  return first !== -1 && haystack.indexOf(needle, first + 1) === -1;
}

// ---------------------------------------------------------------------------------------------
// G3, G6 and the Write, Edit and NotebookEdit guard.
// ---------------------------------------------------------------------------------------------

// True when G3 refuses this call. `kind` is write, edit or notebook; a notebook edit is never an
// append. A read or a process call that rejects throws: the registration's catch denies.
async function g3Refuses($, e, kind, placed, norm) {
  let current;
  const readCurrent = async () => {
    if (current === undefined) current = String(await $.fs.read(placed.real));
    return current;
  };

  let isProtected = false;
  if (placed.exists && ADR_PATTERN.test(norm)) {
    isProtected = !isProposed(await readCurrent());
  }
  const base = norm.slice(norm.lastIndexOf('/') + 1);
  if (!isProtected && base.endsWith(PREREGISTRATION_SUFFIX)) {
    const cut = Math.max(placed.real.lastIndexOf('/'), placed.real.lastIndexOf('\\'));
    const filed = await $.process.run(['git', 'cat-file', '-e', `HEAD:./${placed.real.slice(cut + 1)}`], {
      cwd: placed.real.slice(0, cut + 1),
      timeoutMs: PROCESS_TIMEOUT_MS,
    });
    isProtected = filed.exitCode === 0;
  }
  if (!isProtected) return false;

  if (kind === 'write') {
    return !(typeof e.content === 'string' && e.content.startsWith(await readCurrent()));
  }
  if (kind === 'edit') {
    const old = e.old_string;
    const next = e.new_string;
    const text = await readCurrent();
    const isAppend =
      typeof old === 'string' &&
      typeof next === 'string' &&
      occursOnce(text, old) &&
      text.endsWith(old) &&
      next.startsWith(old);
    return !isAppend;
  }
  return true;
}

// G6: a report-only subagent writes only the REPORT PATH its brief declares. Returns the reason
// when it refuses, undefined when it has nothing to say.
async function g6Refusal($, agentId, placed) {
  const agents = await $.agent.list();
  const row = agents.find((a) => a.id === agentId);
  if (row === undefined || !REPORT_ONLY_TYPES.includes(row.type)) return undefined;

  const rows = await $.session.messages({ agentId });
  if (!Array.isArray(rows) || rows.length === 0) return G6_REASON;
  const matches = String(rows[0].text ?? '')
    .split(/\r\n|\r|\n/)
    .map((line) => REPORT_LINE.exec(line))
    .filter((m) => m !== null);
  if (matches.length !== 1) return G6_REASON;

  const declared = await place($, matches[0][1].trim());
  if (declared === undefined || placed === undefined) return G6_REASON;
  return normalise(declared.real) === normalise(placed.real) ? undefined : G6_REASON;
}

// The Write, Edit and NotebookEdit guard: G6 (when the call is a subagent's), placement, then G2,
// G4 and G3. `kind` is write, edit or notebook.
async function guard($, e, next, kind, path) {
  const placed = await place($, path);
  if (e.agentId !== undefined) {
    const refusal = await g6Refusal($, e.agentId, placed);
    if (refusal !== undefined) return { deny: refusal };
  }
  if (placed === undefined) return { deny: UNPLACEABLE_REASON };

  const norm = normalise(placed.real);
  if (norm.endsWith(DOCS_01_SUFFIX)) return { deny: G2_REASON };
  if (norm.includes(DIRECTIVES_SEGMENT) && (kind !== 'write' || placed.exists)) return { deny: G4_REASON };
  if (await g3Refuses($, e, kind, placed, norm)) return { deny: G3_REASON };
  return next(e);
}

async function guardWrite($, e, next) {
  return guard($, e, next, 'write', e.file_path);
}

async function guardEdit($, e, next) {
  return guard($, e, next, 'edit', e.file_path);
}

async function guardNotebookEdit($, e, next) {
  return guard($, e, next, 'notebook', e.notebook_path);
}

async function refuseForcePush($, e, next) {
  return pushRefused(String(e.command ?? '')) ? { deny: G1_REASON } : next(e);
}

// The PowerShell registration's hook: G6 (a subagent's call only; the main loop makes no `$` call),
// then G1, then next. A shell call has no path to place, so a report-only subagent's PowerShell
// call is refused whatever its command, which G6 never reads.
async function guardPowerShell($, e, next) {
  if (e.agentId !== undefined) {
    const refusal = await g6Refusal($, e.agentId, undefined);
    if (refusal !== undefined) return { deny: refusal };
  }
  return refuseForcePush($, e, next);
}

// ---------------------------------------------------------------------------------------------
// N1: the one nudge. Its fill comes from the summary breakdown, which estimates locally and sends
// nothing: measured against the auto-compaction threshold when the breakdown carries one, else the
// breakdown's percentage; absent when no breakdown comes back.
// ---------------------------------------------------------------------------------------------

// Declared values (GUARDIAN-N1-BEFORE-AUTO-COMPACTION-PREREGISTRATION.md section 7). The bands are
// 80, 85, 90 and 95; a fill past 95 stays in the top band (the form's R-1).
const N1_TOP_BAND = 95;
const N1_MAX_AGE_MS = 10 * 60 * 1000;

// The threshold route's sentence (the form's section 7), with N replaced by the integer percent.
const N1_THRESHOLD_TEXT = (p) => `Context at ${Math.round(p)}% of the auto-compaction threshold: flush the continuity block now (rewrite, commit, push), then continue.`;

// The fill and the route it came by: { p, route: 'threshold' } when auto-compaction is on and the
// breakdown carries a positive threshold and a token count, else { p, route: 'percentage' } from the
// breakdown's percentage as at v0; undefined when neither is a finite number.
async function contextFill($) {
  const usage = await $.session.usage({ breakdown: 'summary' });
  const breakdown = usage?.context?.breakdown;
  const threshold = breakdown?.autoCompactThreshold;
  const tokens = breakdown?.totalTokens;
  if (
    breakdown?.isAutoCompactEnabled === true &&
    typeof threshold === 'number' && Number.isFinite(threshold) && threshold > 0 &&
    typeof tokens === 'number' && Number.isFinite(tokens) && tokens >= 0
  ) {
    return { p: (100 * tokens) / threshold, route: 'threshold' };
  }
  const p = breakdown?.percentage;
  return typeof p === 'number' && Number.isFinite(p) ? { p, route: 'percentage' } : undefined;
}

// The age clause (the form's section 2.3): the committed flushed_at, parsed as the PreCompact hook
// parses it, is more than N1_MAX_AGE_MS before now. null, unparseable and future values are not old.
function flushedLongAgo(flushedAt) {
  if (typeof flushedAt !== 'string') return false;
  const flushed = new Date(flushedAt).getTime();
  return Number.isFinite(flushed) && Date.now() - flushed > N1_MAX_AGE_MS;
}

// The bands already nudged: a module variable, lost on a hot reload (no store).
const shownBands = new Set();

// N1 is registered first so it wraps the refusing hooks and sees their denials as `ran`. Its first
// statement calls next, so a failure after that leaves `ran` standing. It has no catch and no deny.
async function nudge($, e, next) {
  const ran = await next(e);
  if (ran.deny !== undefined || e.agentId !== undefined) return ran;

  const fill = await contextFill($);
  if (fill === undefined) return ran;
  const { p, route } = fill;
  if (p < N1_THRESHOLD) {
    shownBands.clear();
    return ran;
  }
  const band = Math.min(Math.floor(p / N1_BAND), N1_TOP_BAND / N1_BAND);
  if (shownBands.has(band)) return ran;

  const verdict = await judgeContinuity((args) => $.process.run(['git', ...args], { timeoutMs: PROCESS_TIMEOUT_MS }));
  if (verdict.judged === true && (verdict.stale === true || flushedLongAgo(verdict.flushedAt))) {
    shownBands.add(band);
    return { ...ran, context: [...(ran.context ?? []), route === 'threshold' ? N1_THRESHOLD_TEXT(p) : N1_TEXT(p)] };
  }
  return ran;
}

export function register(on) {
  on('tool.call', nudge);
  on('tool.call', { tool: 'Bash' }, refuseForcePush).catch(() => ({ deny: CATCH_REASON }));
  on('tool.call', { tool: 'PowerShell' }, guardPowerShell).catch(() => ({ deny: CATCH_REASON }));
  on('tool.call', { tool: 'Write' }, guardWrite).catch(() => ({ deny: CATCH_REASON }));
  on('tool.call', { tool: 'Edit' }, guardEdit).catch(() => ({ deny: CATCH_REASON }));
  on('tool.call', { tool: 'NotebookEdit' }, guardNotebookEdit).catch(() => ({ deny: CATCH_REASON }));
}
