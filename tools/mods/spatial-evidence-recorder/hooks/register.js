// Evidence Recorder v0, the second Spatial IDE mod: an observe-only plugin
// (EVIDENCE-RECORDER-V0-PREREGISTRATION.md). It records one line per approved test command and one
// per subagent turn, and nothing else. Every hook calls next(e) exactly once with the event it
// received and returns that call's own resolved value: no deny, no context, no result, no text, no
// copy of the value. No registration chains a catch handler, which would replace the tool's result.
// Every `$` call and the record build sit in a try, so a failure leaves the record unavailable or
// dropped and the tool's result untouched.
//
// The only `$` calls: $.process.run (git, with no optional locks, rev-parse, status or diff, each
// with a timeout), $.fs.write (one new file per record, under the log root), $.agent.list and one
// $.clock.sleep, made in beforeCeiling alone: the timer of the ceiling on the wait before a command
// (v0.1, EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md section 2.5 and its Amendments 2 and 3). A hooks
// module has no timers of its own, so the ceiling waits on the engine's clock.

// Declared values (the v0 form's section 7, and v0.1's).
const PROCESS_TIMEOUT_MS = 2000;
// The ceiling across the before stage. It must stay below the hook budget (HookBudget.ms, 10_000 at
// 2.1.288), which a $.clock wait counts against; the wait is stopped before next(e) is called.
const BEFORE_CEILING_MS = 2000;
const SCHEMA = 'spatial-evidence-recorder/v0.1';
const LOG_SUFFIX = '-local/evidence';
const UNAVAILABLE = 'unavailable';

const encoder = new TextEncoder();

async function sha256Hex(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

// The UTF-8 length and sha256 of decoded text (the form's O-5), or unavailable when it is not text.
async function describeText(text) {
  if (typeof text !== 'string') return UNAVAILABLE;
  const bytes = encoder.encode(text);
  return { text_bytes: bytes.length, text_sha256: await sha256Hex(bytes) };
}

// ---------------------------------------------------------------------------------------------
// The matcher (the form's section 2.2): a synchronous parse of the command string, before any `$`.
// ---------------------------------------------------------------------------------------------

// Splits at && || ; | & and newlines outside quotes. Each segment carries the separator that ends
// it. `unbalanced` is true when a quote is left open, `unsupported` when a heredoc or a
// substitution is present (neither is approved).
function splitCommand(command) {
  const segments = [];
  let current = '';
  let quote = null;
  let unsupported = false;
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
      } else if (ch === '`' || (ch === '$' && command[i + 1] === '(')) {
        unsupported = true;
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
      let sep = ch;
      if ((ch === '&' || ch === '|') && command[i + 1] === ch) {
        i += 1;
        sep = ch + ch;
      }
      segments.push({ text: current, sep });
      current = '';
      continue;
    }
    const pair = ch + (command[i + 1] ?? '');
    if (ch === '`' || pair === '$(' || pair === '<<' || pair === '<(' || pair === '>(') unsupported = true;
    current += ch;
  }
  segments.push({ text: current, sep: '' });
  return { segments, unbalanced: quote !== null, unsupported };
}

// Splits one segment into words, with single and double quotes.
function tokenise(text) {
  const tokens = [];
  let current = '';
  let started = false;
  let quote = null;
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
      continue;
    }
    if (ch === '\\' && (text[i + 1] === '"' || text[i + 1] === "'")) {
      i += 1;
      current += text[i];
      started = true;
      continue;
    }
    if (/\s/.test(ch)) {
      if (started) tokens.push(current);
      current = '';
      started = false;
      continue;
    }
    current += ch;
    started = true;
  }
  if (started) tokens.push(current);
  return tokens;
}

const ENV_ASSIGNMENT = /^[A-Za-z_][A-Za-z0-9_]*=/;
const TIMEOUT_DURATION = /^[0-9]+(\.[0-9]+)?[smhd]?$/;

// Drops leading env assignments and `timeout <duration>`.
function normalise(tokens) {
  let i = 0;
  while (i < tokens.length) {
    if (ENV_ASSIGNMENT.test(tokens[i])) {
      i += 1;
    } else if (tokens[i] === 'timeout' && tokens[i + 1] !== undefined && TIMEOUT_DURATION.test(tokens[i + 1])) {
      i += 2;
    } else {
      break;
    }
  }
  return tokens.slice(i);
}

const NPM_SCRIPTS = new Set(['test', 'verify', 'test:e2e', 'test:residency-trace', 'test:citation-integrity']);
const VERIFY_SCRIPTS = ['scripts/plan/verify.mjs', 'scripts/plan/verify-cites.mjs', 'scripts/plan/verify-quotes.mjs', 'scripts/plan/verify-test-claims.mjs'];

// The approved rows A1 to A4, on a normalised segment.
function isApproved(t) {
  if (t[0] === 'cargo' && t[1] === 'test') {
    if (t.includes('--no-run')) return false;
    const dashes = t.indexOf('--');
    return !(dashes !== -1 && t.indexOf('--list', dashes + 1) !== -1);
  }
  if (t[0] === 'npm') {
    const verb = t[1] === '--prefix' && t[2] !== undefined ? 3 : 1;
    return t[verb] === 'test' || (t[verb] === 'run' && NPM_SCRIPTS.has(t[verb + 1]));
  }
  if (t[0] === 'node' && t[1] === '--test') return true;
  if (t[0] === 'node' && t[1] !== undefined) {
    const script = t[1].replace(/\\/g, '/').replace(/^\.\//, '');
    return VERIFY_SCRIPTS.some((v) => script === v || script.endsWith(`/${v}`));
  }
  return false;
}

const RUNNER_SCRIPT = 'scripts/evidence/repeat.mjs';
const REPEAT_COUNT = /^[1-9][0-9]*$/;

// Row A5, on a normalised segment: `node <runner path> <n> -- <tail>` with a tail of one token or
// more that rows A1 to A4 approve as it stands (not normalised). Gives n as a number, else undefined.
function repeatOf(t) {
  if (t[0] !== 'node' || t[1] === undefined || t[2] === undefined || t[3] !== '--' || t.length < 5) return undefined;
  const script = t[1].replace(/\\/g, '/').replace(/^\.\//, '');
  if (script !== RUNNER_SCRIPT && !script.endsWith(`/${RUNNER_SCRIPT}`)) return undefined;
  if (!REPEAT_COUNT.test(t[2]) || !Number.isSafeInteger(Number(t[2]))) return undefined;
  return isApproved(t.slice(4)) ? Number(t[2]) : undefined;
}

// The directory of a leading `cd <dir> &&`: exactly one argument, an absolute spelling holding no
// $, backtick, ~, * or ?. The only place a drive spelling is read, and the only place a Git Bash
// spelling is translated: a leading slash, one ASCII letter, then a slash or the end, is that letter,
// a colon and a slash, then the rest (/c/x is c:/x, a bare /c is c:/). Nothing else is translated.
function leadingCdDir(tokens) {
  if (tokens.length !== 2) return undefined;
  const dir = tokens[1];
  if (!/^(?:\/|[A-Za-z]:[\\/])/.test(dir) || /[$`~*?]/.test(dir)) return undefined;
  const drive = /^\/([A-Za-z])(?:\/([\s\S]*))?$/.exec(dir);
  return drive === null ? dir : `${drive[1]}:/${drive[2] ?? ''}`;
}

// The plan for a Bash command, or undefined when the call is not approved: { treeBasis, cwd?, repeat? }.
// `repeat` is n when exactly one segment is a row A5 call, unavailable when more than one is, and
// absent when none is.
function planFor(command) {
  if (typeof command !== 'string') return undefined;
  const split = splitCommand(command);
  if (split.unbalanced || split.unsupported) return undefined;
  const segments = [];
  for (const s of split.segments) {
    const tokens = tokenise(s.text);
    if (tokens.length > 0) segments.push({ sep: s.sep, tokens, normal: normalise(tokens) });
  }
  let approved = false;
  let cds = 0;
  const counts = [];
  for (const s of segments) {
    if (s.normal[0] === 'cd') {
      cds += 1;
      continue;
    }
    const n = repeatOf(s.normal);
    if (n !== undefined) {
      counts.push(n);
      approved = true;
    } else if (isApproved(s.normal)) {
      approved = true;
    }
  }
  if (!approved) return undefined;
  const repeat = counts.length === 0 ? {} : { repeat: counts.length === 1 ? counts[0] : UNAVAILABLE };
  if (cds === 0) return { treeBasis: 'session-default', ...repeat };
  const first = segments[0];
  if (cds === 1 && first.tokens[0] === 'cd' && first.sep === '&&') {
    const cwd = leadingCdDir(first.tokens);
    if (cwd !== undefined) return { treeBasis: 'leading-cd', cwd, ...repeat };
  }
  return { treeBasis: 'unresolved', ...repeat };
}

// ---------------------------------------------------------------------------------------------
// git: the only process the mod runs. argv[0] is git, argv[1] is --no-optional-locks.
// ---------------------------------------------------------------------------------------------

function gitRun($, cwd, args) {
  const init = cwd === undefined ? { timeoutMs: PROCESS_TIMEOUT_MS } : { cwd, timeoutMs: PROCESS_TIMEOUT_MS };
  return $.process.run(['git', '--no-optional-locks', ...args], init);
}

// The stdout of a git result when it exited 0 and was not cut; otherwise undefined.
function textOf(r) {
  return r.exitCode === 0 && r.isStdoutTruncated !== true && typeof r.stdout === 'string' ? r.stdout : undefined;
}

// The same for a settled call: a rejection (a timeout included) is undefined.
function stdoutOf(settled) {
  return settled.status === 'fulfilled' ? textOf(settled.value) : undefined;
}

async function hashOrUnavailable(text) {
  return text === undefined ? UNAVAILABLE : (await describeText(text)).text_sha256;
}

const HEX_ID = /^[0-9a-f]{40,64}$/;

// The toplevel and head from `rev-parse --show-toplevel HEAD` (two lines).
function topAndHead(text) {
  const lines = text === undefined ? [] : text.split('\n');
  if (lines.length < 2 || lines[0] === '' || !HEX_ID.test(lines[1])) return { toplevel: UNAVAILABLE, head: UNAVAILABLE };
  return { toplevel: lines[0], head: lines[1] };
}

function headOnly(text) {
  const line = text === undefined ? '' : text.trim();
  return HEX_ID.test(line) ? line : UNAVAILABLE;
}

// The tree before the run: the three calls are issued together, then read.
async function snapshotBefore($, plan) {
  if (plan.treeBasis === 'unresolved') {
    return { toplevel: UNAVAILABLE, head: UNAVAILABLE, status: UNAVAILABLE, diff: UNAVAILABLE };
  }
  const [top, status, diff] = await Promise.allSettled([
    gitRun($, plan.cwd, ['rev-parse', '--show-toplevel', 'HEAD']),
    gitRun($, plan.cwd, ['status', '--porcelain=v1', '-z']),
    gitRun($, plan.cwd, ['diff', 'HEAD', '--binary']),
  ]);
  return {
    ...topAndHead(stdoutOf(top)),
    status: await hashOrUnavailable(stdoutOf(status)),
    diff: await hashOrUnavailable(stdoutOf(diff)),
  };
}

// The tree after the run: the three calls are issued together, then read.
async function snapshotAfter($, plan) {
  if (plan.treeBasis === 'unresolved') return { head: UNAVAILABLE, status: UNAVAILABLE, diff: UNAVAILABLE };
  const [status, diff, head] = await Promise.allSettled([
    gitRun($, plan.cwd, ['status', '--porcelain=v1', '-z']),
    gitRun($, plan.cwd, ['diff', 'HEAD', '--binary']),
    gitRun($, plan.cwd, ['rev-parse', 'HEAD']),
  ]);
  return {
    head: headOnly(stdoutOf(head)),
    status: await hashOrUnavailable(stdoutOf(status)),
    diff: await hashOrUnavailable(stdoutOf(diff)),
  };
}

// true when a compared pair differs, false when every pair is equal, unavailable otherwise.
function treeChanged(pairs) {
  if (pairs.some(([a, b]) => a !== UNAVAILABLE && b !== UNAVAILABLE && a !== b)) return true;
  if (pairs.some(([a, b]) => a === UNAVAILABLE || b === UNAVAILABLE)) return UNAVAILABLE;
  return false;
}

// The type of an agent, from the listing; unavailable when it cannot be listed.
async function agentTypeOf($, agentId) {
  if (agentId === undefined) return 'main';
  try {
    const rows = await $.agent.list();
    const row = rows.find((a) => a.id === agentId);
    return row === undefined || typeof row.type !== 'string' ? UNAVAILABLE : row.type;
  } catch {
    return UNAVAILABLE;
  }
}

// ---------------------------------------------------------------------------------------------
// The outcome of a Bash call (the form's section 2.5). A deny never reaches here.
// ---------------------------------------------------------------------------------------------

async function outcomeOf(ran) {
  const text = await describeText(ran.text);
  if (ran.isError === true) {
    return { fields: { tool_is_error: true, interrupted: UNAVAILABLE, stdout: UNAVAILABLE, stderr: UNAVAILABLE, text } };
  }
  const result = ran.result !== null && typeof ran.result === 'object' ? ran.result : {};
  const persisted = typeof result.persistedOutputPath === 'string';
  const fields = {
    tool_is_error: false,
    interrupted: typeof result.interrupted === 'boolean' ? result.interrupted : UNAVAILABLE,
    stdout: persisted ? UNAVAILABLE : await describeText(result.stdout),
    stderr: persisted ? UNAVAILABLE : await describeText(result.stderr),
    text,
  };
  if (result.returnCodeInterpretation !== undefined) fields.return_code_interpretation = result.returnCodeInterpretation;
  const backgroundedAfterMs = typeof result.timedOutAfterMs === 'number' ? result.timedOutAfterMs : undefined;
  if (backgroundedAfterMs !== undefined) fields.backgrounded_after_ms = backgroundedAfterMs;
  return { fields, backgroundedAfterMs };
}

// ---------------------------------------------------------------------------------------------
// The log root and the record file (the form's section 2.7).
// ---------------------------------------------------------------------------------------------

// The log root from git's common directory: <parent of the main tree>/<its name>-local/evidence.
// The main tree is the common directory's parent. Undefined when the path cannot be derived.
function logRootFrom(stdout) {
  const dir = stdout.trim().replace(/\\/g, '/').replace(/\/+$/, '');
  if (!dir.endsWith('/.git') || dir.split('/').some((part) => part === '..' || part === '.')) return undefined;
  const main = dir.slice(0, -'/.git'.length);
  const cut = main.lastIndexOf('/');
  const name = main.slice(cut + 1);
  if (cut < 0 || name === '') return undefined;
  return `${main.slice(0, cut)}/${name}${LOG_SUFFIX}`;
}

// The last resolved write of this load: { record: '<YYYY-MM-DD>/<file name>', ms }, or undefined. A
// run record carries it as `previous_write` (the form's section 2.6); a rejected write leaves it as it was.
let lastWrite;

// Writes the record as one new file: <root>/<YYYY-MM-DD>/<HHMMSSmmm>-<16 hex of the line's sha256>.json.
// The span timed, with Date.now(), runs from entry to the write's resolution.
async function writeRecord($, root, record, stamp) {
  const enteredAt = Date.now();
  const line = `${JSON.stringify(record)}\n`;
  const digest = await sha256Hex(encoder.encode(line));
  const day = stamp.slice(0, 10);
  const name = `${stamp.slice(11, 23).replace(/[:.]/g, '')}-${digest.slice(0, 16)}.json`;
  await $.fs.write(`${root}/${day}/${name}`, line);
  lastWrite = { record: `${day}/${name}`, ms: Date.now() - enteredAt };
}

// The log root, found once per load and cached on success only.
let cachedRoot;
async function resolveLogRoot($) {
  if (cachedRoot !== undefined) return cachedRoot;
  const stdout = textOf(await gitRun($, undefined, ['rev-parse', '--path-format=absolute', '--git-common-dir']));
  cachedRoot = stdout === undefined ? undefined : logRootFrom(stdout);
  return cachedRoot;
}

const NO_BEFORE = { toplevel: UNAVAILABLE, head: UNAVAILABLE, status: UNAVAILABLE, diff: UNAVAILABLE };
const noop = () => {};

// The ceiling's timer, and the only $.clock call of the mod: it resolves after BEFORE_CEILING_MS, and
// rejects at once when the signal aborts. Called once per dispatch, on a resolved plan alone.
function beforeCeiling($, signal) {
  return $.clock.sleep(BEFORE_CEILING_MS, { signal });
}

// The before stage raced against the ceiling (the form's section 2.5, Amendment 2). Gives the
// before-fields and `ceilingReached`: true when the timer won, false otherwise, unavailable when the
// timer could not be used (the stage is then awaited alone). The sleep is aborted before this returns,
// so none stays live during next(e). A stage that loses the race runs on and its late answers are
// never read; every promise left behind carries a no-op rejection handler.
async function raceBefore($, plan) {
  if (plan.treeBasis === 'unresolved') return { before: await snapshotBefore($, plan), ceilingReached: false };
  const staged = snapshotBefore($, plan).then((value) => ({ won: 'stage', value }));
  staged.catch(noop);
  let controller;
  let sleep;
  try {
    controller = new AbortController();
    sleep = beforeCeiling($, controller.signal);
  } catch {
    sleep = undefined;
  }
  try {
    if (sleep === undefined || sleep === null || typeof sleep.then !== 'function') {
      return { before: await stageAlone(staged), ceilingReached: UNAVAILABLE };
    }
    const slept = Promise.resolve(sleep).then(
      () => ({ won: 'ceiling' }),
      () => ({ won: 'sleep-failed' }),
    );
    const first = await Promise.race([staged, slept]);
    if (first.won === 'ceiling') return { before: NO_BEFORE, ceilingReached: true };
    if (first.won === 'sleep-failed') return { before: await stageAlone(staged), ceilingReached: UNAVAILABLE };
    return { before: first.value, ceilingReached: false };
  } finally {
    try {
      controller?.abort();
    } catch {
      // observe only: nothing more can be done for a sleep that cannot be stopped
    }
  }
}

// The stage's own answer, awaited as v0 awaited it: unavailable when it failed.
async function stageAlone(staged) {
  try {
    return (await staged).value;
  } catch {
    return NO_BEFORE;
  }
}

async function recordRun($, e, next) {
  let plan;
  try {
    plan = e.run_in_background === true ? undefined : planFor(e.command);
  } catch {
    plan = undefined;
  }
  if (plan === undefined) return next(e);

  const t0 = Date.now();
  let before = NO_BEFORE;
  let ceilingReached = false;
  try {
    ({ before, ceilingReached } = await raceBefore($, plan));
  } catch {
    // observe only: the before-fields stay unavailable and the call still runs
  }
  const beforeMs = Date.now() - t0;

  const startedAt = new Date().toISOString();
  const ran = await next(e);
  const endedAt = new Date().toISOString();

  try {
    if (ran === undefined || ran === null || ran.deny !== undefined) return ran;
    const t1 = Date.now();
    const { fields, backgroundedAfterMs } = await outcomeOf(ran);
    const after =
      backgroundedAfterMs === undefined
        ? await snapshotAfter($, plan)
        : { head: UNAVAILABLE, status: UNAVAILABLE, diff: UNAVAILABLE };
    const agentType = await agentTypeOf($, e.agentId);
    const afterMs = Date.now() - t1;

    const t2 = Date.now();
    const root = await resolveLogRoot($);
    if (root === undefined) return ran;
    const record = {
      schema: SCHEMA,
      kind: 'run',
      agent_id: e.agentId ?? 'main',
      agent_type: agentType,
      command: e.command,
      ...(plan.repeat === undefined ? {} : { repeat: plan.repeat }),
      started_at: startedAt,
      ended_at: endedAt,
      tree_basis: plan.treeBasis,
      toplevel: before.toplevel,
      head: before.head,
      head_after: after.head,
      before: { status_z_text_sha256: before.status, diff_binary_text_sha256: before.diff },
      after: { status_z_text_sha256: after.status, diff_binary_text_sha256: after.diff },
      tree_changed_during_run: treeChanged([
        [before.head, after.head],
        [before.status, after.status],
        [before.diff, after.diff],
      ]),
      ...fields,
      before_ceiling_reached: ceilingReached,
      previous_write: lastWrite === undefined ? UNAVAILABLE : { record: lastWrite.record, ms: lastWrite.ms },
      recorder_ms: { before: beforeMs, after: afterMs, write: Date.now() - t2 },
    };
    await writeRecord($, root, record, endedAt);
  } catch {
    // observe only: a failure here drops the record and never changes the result
  }
  return ran;
}

async function recordUsage($, e, next) {
  const out = await next(e);
  if (e.agentId === undefined) return out;
  try {
    const recordedAt = new Date().toISOString();
    const usage = e.usage;
    const root = await resolveLogRoot($);
    if (root === undefined) return out;
    await writeRecord(
      $,
      root,
      {
        schema: SCHEMA,
        kind: 'usage',
        agent_id: e.agentId,
        agent_type: await agentTypeOf($, e.agentId),
        turn_id: e.turnId ?? UNAVAILABLE,
        recorded_at: recordedAt,
        usage:
          usage === undefined || usage === null
            ? UNAVAILABLE
            : {
                input_tokens: usage.input_tokens ?? UNAVAILABLE,
                output_tokens: usage.output_tokens ?? UNAVAILABLE,
                cache_read_input_tokens: usage.cache_read_input_tokens ?? UNAVAILABLE,
                cache_creation_input_tokens: usage.cache_creation_input_tokens ?? UNAVAILABLE,
                model: usage.model ?? UNAVAILABLE,
              },
      },
      recordedAt,
    );
  } catch {
    // observe only: a failure here drops the record and never changes the result
  }
  return out;
}

export function register(on) {
  on('tool.call', { tool: 'Bash' }, recordRun);
  on('turn.complete', recordUsage);
}
