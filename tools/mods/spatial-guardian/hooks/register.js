// Guardian v1, the first Spatial IDE mod: a refuse-only plugin (GUARDIAN-V0-PREREGISTRATION.md, and
// GUARDIAN-V1-PREREGISTRATION.md for what v1 changes and adds).
//
// It only refuses. A hook returns { deny: <reason> } or next(e) with the event it received,
// untouched. There is no tool.check hook, no allow, no rewrite, no model call, no request. The one
// write is the refusal log: one new local file per refusal, outside the repository (v1 section 2.7).
// Each refusing hook decides inside one try, so a check that cannot complete is a deny, and every
// registration also carries a .catch that denies: a hook that overruns is otherwise skipped, and the
// call would run. The one nudge (N1) refuses nothing.
//
// Rules, each with the ruling it enforces:
//   G1  a force-push or a remote-ref delete (question round 34, item 3)
//   G2  an edit to docs/01 (CLAUDE.md, the constitution's first document is never edited)
//   G3  a change to an accepted ADR or a filed preregistration, except by appending
//   G4  a rewrite of an existing file under state/directives/ (filed verbatim, once)
//   G6  a write by a report-only subagent outside the REPORT PATH its brief declares (question
//       round 41, item 3; round 43, item 4)
//   G7  a pull-request merge by an agent, and a history rewrite (AUTONOMY section 27; line 2 of the
//       2026-10-05 direction; question round 57, items OPEN-1 and OPEN-2)
//   G8  installing, enabling or configuring plugins, marketplaces and MCP servers, and a tool write to
//       the user's Claude settings (the brief's section 2.3; question rounds 57 and 58)
//   G9  a wholesale clean of the main checkout's target, and a delete of its data folders
//       (AI_DEVELOPMENT.md; question round 57, item OPEN-4)
//   N1  one appended line when the context passes 80% and the continuity block is stale
// G5 (the profile-path refusal) is not in v0 or v1 (question round 43, item 3).

import { judgeContinuity } from './continuity.mjs';

// Declared values (the forms' section 7).
const PROCESS_TIMEOUT_MS = 2000;
const N1_THRESHOLD = 80;
const N1_BAND = 10;
const REPORT_ONLY_TYPES = ['architect', 'lead-data', 'evidence-reader'];
const REPORT_LINE = /^REPORT PATH: (.+)$/;
const LOG_SCHEMA = 'spatial-guardian/v1';
const LOG_SUFFIX = '-local/guardian';
const UNAVAILABLE = 'unavailable';
const PLUGIN_JSON = 'tools/mods/spatial-guardian/.claude-plugin/plugin.json';

const G1_REASON = 'spatial-guardian G1: refused, because this git push force-pushes or deletes a remote ref.';
const G2_REASON = 'spatial-guardian G2: refused, because docs/01 is never edited.';
const G3_REASON = 'spatial-guardian G3: refused, because an accepted ADR or a filed preregistration changes only by appending.';
const G4_REASON = 'spatial-guardian G4: refused, because an existing directive is never rewritten.';
const G6_REASON = "spatial-guardian G6: refused, because this run writes only its brief's REPORT PATH.";
const G7_REASON = "spatial-guardian G7: refused, because a merge is the human's click and an agent never rewrites history.";
const G8_REASON =
  "spatial-guardian G8: refused, because installing, enabling or configuring plugins, marketplaces, MCP servers or the user's Claude settings is the human's own act.";
const G9_REASON = "spatial-guardian G9: refused, because the main checkout's target holds fixtures and evidence and is never cleaned wholesale.";
const UNPLACEABLE_REASON = 'spatial-guardian: refused, because the path cannot be placed.';
const CATCH_REASON = 'spatial-guardian: refused, because a check could not complete.';
const CATCH_VERDICT = { rule: 'catch', reason: CATCH_REASON };

// The brief's N1 sentence, with N replaced by the integer percent.
const N1_TEXT = (p) => `Context at ${Math.round(p)}%: flush the continuity block now (rewrite, commit, push), then continue.`;

// ---------------------------------------------------------------------------------------------
// The command string, read and never run: the splitter, the tokeniser and the words every rule shares.
// ---------------------------------------------------------------------------------------------

const MAX_RESCAN_DEPTH = 4;

// git's global options that take the next token as their value.
const GIT_GLOBAL_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--super-prefix', '--config-env']);

// The long push options that force or delete. git accepts any unambiguous prefix of a long option,
// so a proper prefix of one of these is refused as well.
const FORCING_LONG_OPTIONS = ['force', 'force-with-lease', 'mirror', 'delete', 'prune'];

// Splits a command at ; && || | & and newlines outside quotes. Each segment carries its text, the
// offset where it starts and the separator before it. The last segment is the one a quote can leave
// open. The second reading (`atGroups`) also splits at ( ) { } and the backtick, each outside quotes
// and not escaped by a backslash. `firstOnly` stops after the first segment (a restart's text).
function splitSegments(command, atGroups = false, firstOnly = false) {
  const segments = [];
  let current = '';
  let start = 0;
  let sepBefore = '';
  let quote = null;
  const close = (next, from) => {
    segments.push({ text: current, start, sepBefore });
    current = '';
    sepBefore = next;
    start = from;
  };
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
      const sep = (ch === '&' || ch === '|') && command[i + 1] === ch ? ch + ch : ch;
      i += sep.length - 1;
      close(sep, i + 1);
      if (firstOnly) return segments;
      continue;
    }
    if (atGroups && (ch === '(' || ch === ')' || ch === '{' || ch === '}' || ch === '`')) {
      close(ch, i + 1);
      continue;
    }
    current += ch;
  }
  segments.push({ text: current, start, sepBefore });
  return segments;
}

// Tokenises one segment with single and double quotes. Each token carries whether any part of it
// was quoted. `unbalanced` is true when a quote is left open; the open quote's text is the last token,
// and `openAt` is the index of the quote character at which that final open quote began (-1 when none).
function tokenise(text) {
  const tokens = [];
  let current = '';
  let started = false;
  let quoted = false;
  let quote = null;
  let openAt = -1;
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
      openAt = i;
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
  return { tokens, unbalanced: quote !== null, openAt: quote !== null ? openAt : -1 };
}

const baseName = (value) => value.split(/[\\/]/).pop().toLowerCase();
const isGit = (value) => ['git', 'git.exe'].includes(baseName(value));
const isGh = (value) => ['gh', 'gh.exe'].includes(baseName(value));
const isClaude = (value) => ['claude', 'claude.exe'].includes(baseName(value));
const isCargo = (value) => ['cargo', 'cargo.exe'].includes(baseName(value));

// The call's words (v1 section 2.2): the whole command text, every quote deleted, then a break at
// whitespace, ; & | ( ) { } < > and the backtick. Quoted text, heredoc bodies and comments alike.
function callWords(command) {
  return command.replace(/['"]/g, '').split(/[\s;&|(){}<>`]+/).filter((word) => word !== '');
}

const undel = (word) => word.replace(/\\/g, '');

// True when the words hold the predicates in order, each at a later word than the one before.
function wordsInOrder(words, tests) {
  let next = 0;
  for (const word of words) {
    if (tests[next](word)) next += 1;
    if (next === tests.length) return true;
  }
  return false;
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

// Skips git's global options after the word at index i. Returns the index of the subcommand and the
// value of the last -C, when there is one.
function gitSub(tokens, i) {
  let j = i + 1;
  let dashC;
  while (j < tokens.length && tokens[j].value.startsWith('-')) {
    if (tokens[j].value === '-C' && j + 1 < tokens.length) dashC = tokens[j + 1].value;
    j += GIT_GLOBAL_WITH_VALUE.has(tokens[j].value) ? 2 : 1;
  }
  return { j, dashC };
}

// ---------------------------------------------------------------------------------------------
// The shared reader (v1 section 2.3). A rule is { trigger, segment, unbalancedRefuses }: `trigger`
// tests a quoted token's text for the rule's words, `segment` tests one tokenised segment, and
// `unbalancedRefuses` decides a segment that cannot be tokenised (its text, the call's whole text, the
// call's memo, and the index of the quote the segment leaves open).
// ---------------------------------------------------------------------------------------------

// One reading of a command, twice: split it (at the second reading's extra boundaries when
// `atGroups`), then each segment goes through the per-segment steps. `restart` marks a restart's
// text (Amendment 2, A.2), where a segment that cannot be tokenised gives the segment check its tokens.
async function readRule(command, rule, { depth = 0, whole = command, restart = false, memo }) {
  for (const atGroups of [false, true]) {
    for (const seg of splitSegments(command, atGroups)) {
      const { tokens, unbalanced, openAt } = tokenise(seg.text);
      if (unbalanced && !restart) {
        if (await rule.unbalancedRefuses(seg.text, whole, memo, openAt)) return true;
        continue;
      }
      for (const token of tokens) {
        if (token.quoted && rule.trigger(token.value)) {
          if (depth >= MAX_RESCAN_DEPTH) return true;
          if (await readRule(token.value, rule, { depth: depth + 1, whole, restart, memo })) return true;
        }
      }
      if (await rule.segment(tokens, { command, seg, restart, depth })) return true;
    }
  }
  return false;
}

const WORD_BREAK = /[\s;&|(){}<>`'"]/;

// The restart points of a command (Amendment 2, A.2), in ascending order: each index where a word
// naming one of the rule's command words begins, and each index that holds a quote.
function restartPoints(command, isCommandWord) {
  const points = [];
  for (let i = 0; i < command.length; i++) {
    if (command[i] === "'" || command[i] === '"') points.push(i);
    if (WORD_BREAK.test(command[i]) || (i > 0 && !WORD_BREAK.test(command[i - 1]))) continue;
    let end = i;
    while (end < command.length && !WORD_BREAK.test(command[end])) end += 1;
    if (isCommandWord(command.slice(i, end))) points.push(i);
  }
  return points;
}

// True when a restart refuses. Each runs in ascending order, over the text from its point to the end
// of the first segment the first reading gives for that suffix, and the first that refuses decides.
async function restartRefuses(whole, rule) {
  for (const point of restartPoints(whole, rule.isCommandWord)) {
    const text = splitSegments(whole.slice(point), false, true)[0].text;
    if (await readRule(text, rule, { restart: true, whole, memo: {} })) return true;
  }
  return false;
}

// G7 to G9 refuse a segment that cannot be tokenised only when the call's words hold the rule's
// sequence and a restart refuses (Amendment 2, A.2). Once per call per rule.
function withRestarts(rule) {
  rule.unbalancedRefuses = async (text, whole, memo) => {
    if (!rule.sequence(whole)) return false;
    memo.restarts ??= await restartRefuses(whole, rule);
    return memo.restarts;
  };
  return rule;
}

// ---------------------------------------------------------------------------------------------
// G1: a force-push or a remote-ref delete.
// ---------------------------------------------------------------------------------------------

// The G1 sequence over the call's words: a word naming git, later the word push, later a forcing word.
function g1Sequence(command) {
  let stage = 0;
  for (const word of callWords(command)) {
    if (stage === 0) {
      if (isGit(word)) stage = 1;
    } else if (stage === 1) {
      if (undel(word) === 'push') stage = 2;
    } else if (pushArgumentsRefuse([undel(word)])) {
      return true;
    }
  }
  return false;
}

// True when a segment's tokens hold git, then git's global options, then push with a refused argument.
function segmentPushRefused(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    if (!isGit(tokens[i].value)) continue;
    const { j } = gitSub(tokens, i);
    if (j < tokens.length && tokens[j].value === 'push') {
      if (pushArgumentsRefuse(tokens.slice(j + 1).map((t) => t.value))) return true;
    }
  }
  return false;
}

// True when the segment's own text before its open quote holds git, then git's global options, then
// the token push (Amendment 6, A.1 (ii)). It reads that segment only, and tests no argument.
function pushBeforeOpenQuote(text, openAt) {
  const { tokens } = tokenise(text.slice(0, openAt));
  for (let i = 0; i < tokens.length; i++) {
    if (!isGit(tokens[i].value)) continue;
    const { j } = gitSub(tokens, i);
    if (j < tokens.length && tokens[j].value === 'push') return true;
  }
  return false;
}

// A segment that cannot be tokenised stays refused when it holds push (v0) and either the call's
// words hold the G1 sequence (v1 section 2.2) or the segment's own push comes before its open quote
// (Amendment 6, A.1 (ii)): the one narrowing of G1's refusal set.
const G1_RULE = {
  trigger: (value) => /\bgit\b/.test(value) && /\bpush\b/.test(value),
  segment: segmentPushRefused,
  unbalancedRefuses: (text, whole, memo, openAt) => text.includes('push') && (g1Sequence(whole) || pushBeforeOpenQuote(text, openAt)),
};

// ---------------------------------------------------------------------------------------------
// G7: a pull-request merge, and a history rewrite.
// ---------------------------------------------------------------------------------------------

// `--squash`, or a proper prefix of it, with an optional value.
const isSquashWord = (arg) => {
  const name = arg.split('=')[0];
  return arg.startsWith('--') && name.length > 2 && '--squash'.startsWith(name);
};

// `--rebase`, a proper prefix of it, `-r`, or a short-option cluster holding r.
const isRebaseWord = (arg) => {
  if (arg === '-r') return true;
  if (arg.startsWith('--')) {
    const name = arg.split('=')[0];
    return name.length > 2 && '--rebase'.startsWith(name);
  }
  return /^-[A-Za-z]+$/.test(arg) && arg.includes('r');
};

// A pull request's merge path in a gh api call: pulls/<digits>/merge, ending the word or before / ? #.
const MERGE_PATH = /pulls\/\d+\/merge(?:$|[/?#])/;

// Skips gh's options after index j; -R and --repo take a value.
function ghSkipOptions(tokens, j) {
  while (j < tokens.length && tokens[j].value.startsWith('-')) j += tokens[j].value === '-R' || tokens[j].value === '--repo' ? 2 : 1;
  return j;
}

// True when the gh word at index i is a pull-request merge, or a gh api call on a merge path.
function ghMerges(tokens, i) {
  let j = ghSkipOptions(tokens, i + 1);
  if (tokens[j]?.value === 'api') return tokens.slice(j + 1).some((t) => MERGE_PATH.test(t.value));
  if (tokens[j]?.value !== 'pr') return false;
  j = ghSkipOptions(tokens, j + 1);
  return tokens[j]?.value === 'merge';
}

// True when the git word at index i is a rebase, a squash merge or a pull that rebases.
function gitRewrites(tokens, i) {
  const { j } = gitSub(tokens, i);
  if (j >= tokens.length) return false;
  const sub = tokens[j].value;
  const rest = tokens.slice(j + 1).map((t) => t.value);
  return sub === 'rebase' || (sub === 'merge' && rest.some(isSquashWord)) || (sub === 'pull' && rest.some(isRebaseWord));
}

const G7_RULE = withRestarts({
  isCommandWord: (word) => isGit(word) || isGh(word),
  trigger: (value) =>
    (/\bgit\b/.test(value) && /\b(rebase|merge|pull)\b/.test(value)) || (/\bgh\b/.test(value) && /\bmerge\b/.test(value)),
  segment: (tokens) => tokens.some((t, i) => (isGh(t.value) && ghMerges(tokens, i)) || (isGit(t.value) && gitRewrites(tokens, i))),
  sequence: (command) => {
    const words = callWords(command).map(undel);
    const is = (text) => (word) => word === text;
    return (
      wordsInOrder(words, [isGit, is('rebase')]) ||
      wordsInOrder(words, [isGh, is('pr'), is('merge')]) ||
      wordsInOrder(words, [isGit, is('merge'), isSquashWord]) ||
      wordsInOrder(words, [isGit, is('pull'), isRebaseWord]) ||
      wordsInOrder(words, [isGh, is('api'), (word) => MERGE_PATH.test(word)])
    );
  },
});

// ---------------------------------------------------------------------------------------------
// G8, the command side: plugin, marketplace and MCP changes.
// ---------------------------------------------------------------------------------------------

const G8_GROUP_WORDS = ['plugin', 'plugins'];
const G8_PLUGIN_ACTIONS = [
  'install', 'i', 'uninstall', 'remove', 'enable', 'disable', 'update', 'add', 'rm', 'prune', 'autoremove', 'init', 'new', 'configure',
];
const G8_MCP_ACTIONS = ['remove', 'login', 'logout', 'reset-project-choices'];
const isMcpAction = (word) => word.startsWith('add') || G8_MCP_ACTIONS.includes(word);

// True when the words after a claude word hold a group word and later an action word, or mcp and
// later an MCP action word.
function claudeChanges(words) {
  const group = words.findIndex((word) => G8_GROUP_WORDS.includes(word));
  if (group >= 0 && words.slice(group + 1).some((word) => G8_PLUGIN_ACTIONS.includes(word))) return true;
  const mcp = words.indexOf('mcp');
  return mcp >= 0 && words.slice(mcp + 1).some(isMcpAction);
}

const G8_RULE = withRestarts({
  isCommandWord: isClaude,
  trigger: (value) => /\bclaude\b/.test(value) && /\b(plugin|plugins|mcp)\b/.test(value),
  segment: (tokens) => tokens.some((t, i) => isClaude(t.value) && claudeChanges(tokens.slice(i + 1).map((x) => x.value))),
  sequence: (command) => {
    const words = callWords(command).map(undel);
    return words.some((word, i) => isClaude(word) && claudeChanges(words.slice(i + 1)));
  },
});

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
// and the hook's catch denies.
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

// The normalised spelling with no trailing slash.
const canon = (path) => normalise(path).replace(/\/+$/, '');

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
// append. A read or a process call that rejects throws: the hook's catch denies.
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

// ---------------------------------------------------------------------------------------------
// The session's repository: the main working tree (one lookup, shared by G7, G9 and the log), and
// whether it is this repository (Amendment 2, Part C). Each is cached per load, on success only.
// ---------------------------------------------------------------------------------------------

// The main working tree's root, or null when the session is in no repository. A found repository is
// remembered; a session in none is asked again at the next lookup.
async function mainTree($, cache) {
  if (cache.main === undefined) {
    const repo = await $.session.repo();
    if (repo === null || repo === undefined) return null;
    cache.main = String(repo.root);
  }
  return cache.main;
}

// True when the session's repository is this one: it holds Guardian's own plugin.json. Another
// repository (ENOENT, or no repository) is false. Any other failure cannot complete: true, so the
// refusal that asked stands. A result is remembered only for a repository that was found.
async function isThisRepository($, cache) {
  if (cache.here !== undefined) return cache.here;
  try {
    const main = await mainTree($, cache);
    if (main === null) return false;
    await $.fs.stat(`${main.replace(/[\\/]+$/, '')}/${PLUGIN_JSON}`);
    cache.here = true;
  } catch (err) {
    if (!isEnoent(err)) return true;
    cache.here = false;
  }
  return cache.here;
}

// ---------------------------------------------------------------------------------------------
// G8, the path side: the user's Claude folder. Its location is USERPROFILE plus /.claude (the 2.1.288
// types name no override). Resolved once per load; on ENOENT its normalised spelling stands.
// ---------------------------------------------------------------------------------------------

const G8_FOLDERS = ['plugins', 'skills', 'agents', 'commands', 'hooks'];

// { profile, claude }: the normalised, resolved profile and its .claude folder, or undefined when
// USERPROFILE gives no value. A lookup that rejects throws.
async function userClaudeFolder($, cache) {
  if (cache.user !== undefined) return cache.user;
  const spelled = await $.env.get('USERPROFILE');
  if (typeof spelled !== 'string' || spelled === '') return undefined;
  const resolve = async (path) => {
    try {
      const found = await $.fs.stat(path, { resolve: true });
      return canon(found.realPath ?? path);
    } catch (err) {
      if (!isEnoent(err)) throw err;
      return canon(path);
    }
  };
  const root = spelled.replace(/[\\/]+$/, '');
  cache.user = { profile: await resolve(root), claude: await resolve(`${root}/.claude`) };
  return cache.user;
}

// True when G8 refuses a Write, Edit or NotebookEdit at this normalised, placed path. With no user
// folder it refuses every write (fail closed).
async function g8PathRefuses($, cache, norm) {
  const user = await userClaudeFolder($, cache);
  if (user === undefined) return true;
  if (norm === `${user.profile}/.claude.json`) return true;
  if (!norm.startsWith(`${user.claude}/`)) return false;
  const rel = norm.slice(user.claude.length + 1);
  return /^settings[^/]*\.json$/.test(rel) || G8_FOLDERS.some((folder) => rel === folder || rel.startsWith(`${folder}/`));
}

// ---------------------------------------------------------------------------------------------
// G9: the main checkout's target. The base of a segment, the operands, and the lookups they need.
// ---------------------------------------------------------------------------------------------

const DELETE_WORDS = ['rm', 'rmdir', 'rd', 'remove-item', 'ri', 'del', 'erase'];
const isDelete = (value) => DELETE_WORDS.includes(baseName(value).replace(/\.exe$/, ''));
const hasGlob = (text) => /[*?[]/.test(text);
const unreadable = (text) => /[$`~]/.test(text);

// A Git Bash drive spelling /c/x is read as c:/x; nothing else is translated.
function toDrivePath(path) {
  const drive = /^\/([A-Za-z])(?:\/(.*))?$/.exec(path);
  return drive === null ? path : `${drive[1]}:/${drive[2] ?? ''}`;
}

// Resolves . and .. in a slash-separated path, keeping its drive and its root.
function resolveDots(path) {
  const drive = /^[A-Za-z]:/.exec(path)?.[0] ?? '';
  const rest = path.slice(drive.length);
  const parts = [];
  for (const part of rest.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (parts.length > 0 && parts.at(-1) !== '..') parts.pop();
      else if (!rest.startsWith('/')) parts.push('..');
      continue;
    }
    parts.push(part);
  }
  return `${drive}${rest.startsWith('/') ? '/' : ''}${parts.join('/')}`;
}

// An operand located against the base: absolute spellings stand, others join the base.
function locate(operand, base) {
  const path = toDrivePath(operand.replace(/\\/g, '/'));
  return resolveDots(/^(?:[A-Za-z]:\/|\/)/.test(path) ? path : `${base}/${path}`).replace(/\/+$/, '');
}

// The directory of a leading `cd <dir>`: exactly one argument, an absolute spelling holding no $,
// backtick, ~, * or ?, with the Git Bash drive spelling read as a drive (the Recorder's reading).
function leadingCdDir(tokens) {
  if (tokens.length !== 2 || tokens[0].value.toLowerCase() !== 'cd') return undefined;
  const dir = tokens[1].value;
  if (!/^(?:\/|[A-Za-z]:[\\/])/.test(dir) || /[$`~*?]/.test(dir)) return undefined;
  return canon(toDrivePath(dir.replace(/\\/g, '/')));
}

// The base B of a segment: the directory of a leading `cd <dir>` when every separator in the first
// reading from that cd to the segment is &&. Otherwise unknown, read as the main checkout. A restart's
// own level has no leading cd to read.
function baseOf(ctx, main) {
  if (ctx.restart && ctx.depth === 0) return main;
  const first = splitSegments(ctx.command, false);
  const dir = leadingCdDir(tokenise(first[0].text).tokens);
  if (dir === undefined || ctx.seg.start === first[0].start) return main;
  for (let k = 1; k < first.length && first[k].start <= ctx.seg.start; k++) {
    if (first[k].sepBefore !== '&&') return main;
  }
  return dir;
}

// G9's rule for one call: its lookups are made only when a segment holds a candidate, once each.
function makeG9Rule($, cache) {
  const lookups = new Map();
  // The resolved, normalised path of one that exists, or undefined on ENOENT. Any other failure throws.
  const statOf = (path) => {
    if (!lookups.has(path)) {
      lookups.set(
        path,
        $.fs.stat(path, { resolve: true }).then(
          (found) => canon(found.realPath ?? path),
          (err) => {
            if (!isEnoent(err)) throw err;
            return undefined;
          },
        ),
      );
    }
    return lookups.get(path);
  };
  // The resolved path where the path exists; otherwise its nearest existing folder's resolved path
  // plus the rest; otherwise its normalised spelling.
  const realOrSpelled = async (path) => {
    let head = path.replace(/\\/g, '/').replace(/\/+$/, '');
    let tail = '';
    for (let k = 0; k < 40 && head.includes('/'); k++) {
      const found = await statOf(head);
      if (found !== undefined) return found + tail;
      const cut = head.lastIndexOf('/');
      tail = head.slice(cut) + tail;
      head = head.slice(0, cut);
    }
    return canon(path);
  };
  // An operand's location: its resolved path when it exists, else its normalised spelling.
  const real = async (located) => {
    const found = await statOf(/^[A-Za-z]:$/.test(located) ? `${located}/` : located);
    return found === undefined ? { path: canon(located), exists: false } : { path: found, exists: true };
  };
  let facts;
  // The main checkout and its protected members, or null when the session is in no repository.
  const factsOf = async () => {
    if (facts === undefined) {
      const main = await mainTree($, cache);
      if (main === null) {
        facts = null;
      } else {
        const root = canon(main);
        const spelled = [`${root}/target`, `${root}/target/slice-evidence`, `${root}/target/fixtures`];
        const resolved = [];
        for (const path of spelled) resolved.push(await realOrSpelled(path));
        facts = {
          root,
          rootReal: await realOrSpelled(main),
          target: [spelled[0], resolved[0]],
          data: [...new Set([...spelled.slice(1), ...resolved.slice(1)])],
          members: [...new Set([...spelled, ...resolved])],
          worktrees: `${root}/.claude/worktrees/`,
        };
      }
    }
    return facts;
  };

  // True when this recursive delete word, with its operands, is refused.
  const deleteRefuses = async (word, args, ctx) => {
    const name = baseName(word).replace(/\.exe$/, '');
    const dosOption = ['rd', 'rmdir', 'del', 'erase'].includes(name) ? /^\/[A-Za-z](:.*)?$/ : /^\/s$/i;
    const isOption = (arg) => (arg.startsWith('-') && arg !== '--') || /^\/s$/i.test(arg) || dosOption.test(arg);
    const recursive = args.some((arg) => arg === '--recursive' || (arg.startsWith('-') && arg !== '--' && /[rR]/.test(arg)) || /^\/s$/i.test(arg));
    for (const operand of args.filter((arg) => !isOption(arg))) {
      if (operand === '--' || unreadable(operand)) continue;
      const glob = hasGlob(operand);
      if (!glob && !recursive) continue;
      const known = await factsOf();
      if (known === null) return false;
      const base = baseOf(ctx, known.root);
      if (glob) {
        const cut = Math.max(operand.lastIndexOf('/'), operand.lastIndexOf('\\'));
        const folder = (await real(cut < 0 ? base : locate(operand.slice(0, cut + 1), base))).path;
        if (known.data.some((d) => folder === d || folder.startsWith(`${d}/`))) return true;
        if (recursive && (folder === known.root || folder === known.rootReal || folder === known.target[1])) return true;
        continue;
      }
      const where = await real(locate(operand, base));
      if (!where.exists) continue;
      if (known.members.some((m) => m === where.path || m.startsWith(`${where.path}/`))) return true;
      if (known.data.some((d) => where.path.startsWith(`${d}/`))) return true;
    }
    return false;
  };

  // True when this cargo word, with a clean and no package, leaves the main checkout's target in reach.
  const cargoCleanRefuses = async (tokens, i, ctx) => {
    const args = tokens.slice(i + 1).map((t) => t.value);
    const clean = args.indexOf('clean');
    if (clean < 0) return false;
    const after = args.slice(clean + 1);
    if (after.some((a) => a === '-p' || (a.startsWith('-p') && !a.startsWith('--')) || a === '--package' || a.startsWith('--package='))) return false;
    let dir;
    for (let k = 0; k < after.length; k++) {
      if (after[k] === '--target-dir' && k + 1 < after.length) dir = after[k + 1];
      else if (after[k].startsWith('--target-dir=')) dir = after[k].slice('--target-dir='.length);
    }
    for (let k = 0; k < i; k++) {
      if (tokens[k].value.startsWith('CARGO_TARGET_DIR=')) dir = tokens[k].value.slice('CARGO_TARGET_DIR='.length);
    }
    if (dir === undefined || unreadable(dir)) return true;
    const known = await factsOf();
    if (known === null) return false;
    return known.target.includes((await real(locate(dir, baseOf(ctx, known.root)))).path);
  };

  // True when this forced git clean runs in the main checkout, or in a folder under it that is not a worktree.
  const gitCleanRefuses = async (tokens, i, ctx) => {
    const { j, dashC } = gitSub(tokens, i);
    if (tokens[j]?.value !== 'clean') return false;
    const force = tokens.slice(j + 1).some((t) => t.value === '-f' || t.value === '--force' || (/^-[A-Za-z]+$/.test(t.value) && t.value.includes('f')));
    if (!force) return false;
    const known = await factsOf();
    if (known === null) return false;
    let base = baseOf(ctx, known.root);
    if (dashC !== undefined) base = unreadable(dashC) ? known.root : canon(locate(dashC, base));
    return base === known.root || (base.startsWith(`${known.root}/`) && !`${base}/`.startsWith(known.worktrees));
  };

  return withRestarts({
    isCommandWord: (word) => isCargo(word) || isGit(word) || isDelete(word),
    trigger: (value) =>
      (/\bcargo\b/.test(value) && /\bclean\b/.test(value)) ||
      (/\bgit\b/.test(value) && /\bclean\b/.test(value)) ||
      /\b(rm|rmdir|rd|remove-item|ri|del|erase)\b/i.test(value),
    segment: async (tokens, ctx) => {
      for (let i = 0; i < tokens.length; i++) {
        const word = tokens[i].value;
        if (isCargo(word) && (await cargoCleanRefuses(tokens, i, ctx))) return true;
        if (isGit(word) && (await gitCleanRefuses(tokens, i, ctx))) return true;
        if (isDelete(word) && (await deleteRefuses(word, tokens.slice(i + 1).map((t) => t.value), ctx))) return true;
      }
      return false;
    },
    sequence: (command) => {
      const words = callWords(command).map(undel);
      const recursive = (word) => word === '--recursive' || (word.startsWith('-') && word !== '--' && /[rR]/.test(word)) || /^\/s$/i.test(word);
      const force = (word) => word === '-f' || word === '--force' || (/^-[A-Za-z]+$/.test(word) && word.includes('f'));
      return (
        wordsInOrder(words, [isCargo, (word) => word === 'clean']) ||
        wordsInOrder(words, [isGit, (word) => word === 'clean', force]) ||
        wordsInOrder(words, [isDelete, recursive]) ||
        wordsInOrder(words, [isDelete, hasGlob])
      );
    },
  });
}

// ---------------------------------------------------------------------------------------------
// The refusal log (v1 section 2.7): one new file per refusal, outside the repository.
// ---------------------------------------------------------------------------------------------

const encoder = new TextEncoder();

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

// The log root: <parent of the main tree>/<its name>-local/guardian. Undefined when it cannot be derived.
function logRootFrom(main) {
  const dir = main.replace(/\\/g, '/').replace(/\/+$/, '');
  const cut = dir.lastIndexOf('/');
  const name = dir.slice(cut + 1);
  if (cut < 0 || name === '' || name === '.' || name === '..') return undefined;
  return `${dir.slice(0, cut)}/${name}${LOG_SUFFIX}`;
}

// The row's type from the agent list when the call is a subagent's, main on the main loop, and
// unavailable when no row matches or the list rejects.
async function agentKind($, agentId) {
  if (agentId === undefined) return 'main';
  try {
    const row = (await $.agent.list()).find((a) => a.id === agentId);
    return typeof row?.type === 'string' ? row.type : UNAVAILABLE;
  } catch {
    return UNAVAILABLE;
  }
}

// Writes the refusal's one log file. It holds no command, path, content or argument: only the
// sha256 of the target. A failure of any kind, in any step, is swallowed.
async function logRefusal($, e, cache, verdict, decidedAt) {
  try {
    const main = await mainTree($, cache);
    const root = main === null ? undefined : logRootFrom(main);
    if (root !== undefined) {
      const target = { Bash: e.command, PowerShell: e.command, NotebookEdit: e.notebook_path }[e.tool] ?? e.file_path;
      const line = `${JSON.stringify({
        schema: LOG_SCHEMA,
        time: decidedAt,
        rule: verdict.rule,
        tool: e.tool,
        agent: await agentKind($, e.agentId),
        target_sha256: typeof target === 'string' ? await sha256Hex(target) : UNAVAILABLE,
        reason: verdict.reason,
      })}\n`;
      const name = `${decidedAt.slice(11, 23).replace(/[:.]/g, '')}-${(await sha256Hex(line)).slice(0, 16)}.json`;
      await $.fs.write(`${root}/${decidedAt.slice(0, 10)}/${name}`, line);
    }
  } catch {
    // A failed log changes nothing: the refusal stands as decided.
  }
}

// ---------------------------------------------------------------------------------------------
// The hooks. Each decides inside one try, logs only a refusal and only after the decision, and calls
// next(e) outside the try when no rule refuses.
// ---------------------------------------------------------------------------------------------

async function refuse($, e, cache, verdict) {
  await logRefusal($, e, cache, verdict, new Date().toISOString());
  return { deny: verdict.reason };
}

// The shell hooks' decision: G6 (a PowerShell call by a subagent only; the main loop makes no `$`
// call, and a shell call has no path to place, so a report-only subagent's PowerShell call is
// refused whatever its command), then G1, G7, G8 and G9.
async function decideShell($, e, cache, isPowerShell) {
  if (isPowerShell && e.agentId !== undefined) {
    const refusal = await g6Refusal($, e.agentId, undefined);
    if (refusal !== undefined) return { rule: 'G6', reason: refusal };
  }
  const command = String(e.command ?? '');
  if (await readRule(command, G1_RULE, { memo: {} })) return { rule: 'G1', reason: G1_REASON };
  if ((await readRule(command, G7_RULE, { memo: {} })) && (await isThisRepository($, cache))) return { rule: 'G7', reason: G7_REASON };
  if (await readRule(command, G8_RULE, { memo: {} })) return { rule: 'G8', reason: G8_REASON };
  if ((await readRule(command, makeG9Rule($, cache), { memo: {} })) && (await isThisRepository($, cache))) return { rule: 'G9', reason: G9_REASON };
  return undefined;
}

async function guardShell($, e, next, cache, isPowerShell) {
  let verdict;
  try {
    verdict = await decideShell($, e, cache, isPowerShell);
  } catch {
    verdict = CATCH_VERDICT;
  }
  return verdict === undefined ? next(e) : refuse($, e, cache, verdict);
}

// The Write, Edit and NotebookEdit decision: G6 (when the call is a subagent's), placement, then G2,
// G4, G8 and G3. `kind` is write, edit or notebook.
async function decideWrite($, e, cache, kind, path) {
  const placed = await place($, path);
  if (e.agentId !== undefined) {
    const refusal = await g6Refusal($, e.agentId, placed);
    if (refusal !== undefined) return { rule: 'G6', reason: refusal };
  }
  if (placed === undefined) return { rule: 'unplaceable', reason: UNPLACEABLE_REASON };

  const norm = normalise(placed.real);
  if (norm.endsWith(DOCS_01_SUFFIX)) return { rule: 'G2', reason: G2_REASON };
  if (norm.includes(DIRECTIVES_SEGMENT) && (kind !== 'write' || placed.exists)) return { rule: 'G4', reason: G4_REASON };
  if (await g8PathRefuses($, cache, norm)) return { rule: 'G8', reason: G8_REASON };
  if (await g3Refuses($, e, kind, placed, norm)) return { rule: 'G3', reason: G3_REASON };
  return undefined;
}

async function guardWrite($, e, next, cache, kind, path) {
  let verdict;
  try {
    verdict = await decideWrite($, e, cache, kind, path);
  } catch {
    verdict = CATCH_VERDICT;
  }
  return verdict === undefined ? next(e) : refuse($, e, cache, verdict);
}

// ---------------------------------------------------------------------------------------------
// N1: the one nudge. The compaction-window percentage from the summary breakdown, which estimates
// locally and sends nothing; absent when no breakdown comes back.
// ---------------------------------------------------------------------------------------------

async function contextFill($) {
  const usage = await $.session.usage({ breakdown: 'summary' });
  const p = usage?.context?.breakdown?.percentage;
  return typeof p === 'number' && Number.isFinite(p) ? p : undefined;
}

// The bands already nudged: a module variable, lost on a hot reload (no store).
const shownBands = new Set();

// N1 is registered first so it wraps the refusing hooks and sees their denials as `ran`. Its first
// statement calls next, so a failure after that leaves `ran` standing. It has no catch and no deny.
async function nudge($, e, next) {
  const ran = await next(e);
  if (ran.deny !== undefined || e.agentId !== undefined) return ran;

  const p = await contextFill($);
  if (p === undefined) return ran;
  if (p < N1_THRESHOLD) {
    shownBands.clear();
    return ran;
  }
  const band = Math.floor(p / N1_BAND);
  if (shownBands.has(band)) return ran;

  const verdict = await judgeContinuity((args) => $.process.run(['git', ...args], { timeoutMs: PROCESS_TIMEOUT_MS }));
  if (verdict.judged === true && verdict.stale === true) {
    shownBands.add(band);
    return { ...ran, context: [...(ran.context ?? []), N1_TEXT(p)] };
  }
  return ran;
}

export function register(on) {
  // The lookups the rules share, cached on success: one set per load.
  const cache = {};
  on('tool.call', nudge);
  on('tool.call', { tool: 'Bash' }, ($, e, next) => guardShell($, e, next, cache, false)).catch(() => ({ deny: CATCH_REASON }));
  on('tool.call', { tool: 'PowerShell' }, ($, e, next) => guardShell($, e, next, cache, true)).catch(() => ({ deny: CATCH_REASON }));
  on('tool.call', { tool: 'Write' }, ($, e, next) => guardWrite($, e, next, cache, 'write', e.file_path)).catch(() => ({ deny: CATCH_REASON }));
  on('tool.call', { tool: 'Edit' }, ($, e, next) => guardWrite($, e, next, cache, 'edit', e.file_path)).catch(() => ({ deny: CATCH_REASON }));
  on('tool.call', { tool: 'NotebookEdit' }, ($, e, next) => guardWrite($, e, next, cache, 'notebook', e.notebook_path)).catch(() => ({ deny: CATCH_REASON }));
}
