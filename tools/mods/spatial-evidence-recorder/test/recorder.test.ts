// Evidence Recorder v0's plugin tests (EVIDENCE-RECORDER-V0-PREREGISTRATION.md sections 3 and 4, T1
// to T20), run by `claude plugin test tools/mods/spatial-evidence-recorder`. A test answers the
// engine's events beneath the plugin with `on`. There are no files on disk: git, the file write and the
// agent listing are stubs, and a stub counts what the hook asked of it. The hooks swallow their own
// failures (observe only), so a call the hook must not make is shown by a counter and never by a throw.
//
// Git stubs follow the shapes recorded in the worker's report, taken from git 2.49.0.windows.1 at
// commit ea5aba5d120e: `rev-parse --show-toplevel HEAD` is two LF lines with forward slashes and a
// trailing LF, `rev-parse HEAD` and `--git-common-dir` (with `--path-format=absolute`) one line each,
// `status --porcelain=v1 -z` NUL-separated entries with no newline, `diff HEAD --binary` empty when clean.
//
// The `agentId` of a subagent's call rides through a cast (`as never`): `$.tool.call`'s argument type
// does not list it, though the hook receives it. The cast follows Guardian's tests.
import { test, expect } from 'claude-code/testing'

const HEAD_A = 'a'.repeat(40)
const HEAD_B = 'b'.repeat(40)
const ANSWER = { ref: 7, result: { stdout: 'out\n', stderr: 'err\n', interrupted: false }, text: 'out\nerr\n' }
const CARGO = 'cargo test --workspace --locked'
const UNAVAILABLE = 'unavailable'

const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
const sha = async (s: string) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))
const desc = async (s: string) => ({ text_bytes: new TextEncoder().encode(s).length, text_sha256: await sha(s) })

type Tree = { head: string; status: string; diff: string }
type Mode = { kind: 'rev' | 'status' | 'diff'; how: 'reject' | 'exit128' | 'truncated' | 'malformed'; side: 'before' | 'after' | 'both' }

type World = {
  bottom: any // what the engine answers to tool.call
  common: string // `git rev-parse --git-common-dir`'s stdout, sans the trailing LF
  tree: Tree
  during?: (tree: Tree) => void // what the command does to the tree while it runs
  mode?: Mode // a failing git call
  rejectAll: boolean // every `$` call rejects
  rejectCommon: boolean // the common-directory lookup rejects
  writeFails: boolean
  hold: boolean // the before-side git answers wait until three are pending (or 500 ms)
  agents: any[]
  phase: 'before' | 'after'
  procs: any[]
  writes: Array<{ path: string; text: string }>
  listed: number
  forbidden: string[]
  peak: number
  waiters: Array<() => void>
  timer?: any
}

function release(w: World) {
  w.peak = Math.max(w.peak, w.waiters.length)
  clearTimeout(w.timer)
  w.timer = undefined
  for (const resolve of w.waiters.splice(0)) resolve()
}

const freshTree = (): Tree => ({ head: HEAD_A, status: ' M a.rs\0', diff: 'diff --git a/a.rs b/a.rs\n' })

function arm(on: any, init: Partial<World> = {}): World {
  const w: World = {
    bottom: ANSWER,
    common: 'C:/r/.git',
    tree: freshTree(),
    rejectAll: false,
    rejectCommon: false,
    writeFails: false,
    hold: false,
    agents: [],
    phase: 'before',
    procs: [],
    writes: [],
    listed: 0,
    forbidden: [],
    peak: 0,
    waiters: [],
    ...init,
  }
  on('tool.call', async () => {
    w.during?.(w.tree)
    w.phase = 'after'
    return w.bottom
  })
  on('turn.complete', async (_$: any, e: any) => ({ text: e.answer, usage: e.usage }))
  on('agent.list', async () => {
    w.listed += 1
    return w.rejectAll ? { deny: 'rejected' } : { value: w.agents }
  })
  on('fs.write', async (_$: any, e: any) => {
    // The kit hands the stub the path with Windows separators, whatever the hook spelled; the stub keeps it with slashes.
    w.writes.push({ path: String(e.path).split(String.fromCharCode(92)).join('/'), text: e.text })
    return w.rejectAll || w.writeFails ? { deny: 'EACCES: permission denied' } : { value: undefined }
  })
  for (const name of ['fs.read', 'fs.list', 'fs.stat', 'fs.exists', 'session.root', 'session.cwd']) {
    on(name, async () => {
      w.forbidden.push(name)
      return { deny: 'not expected' }
    })
  }
  on('process.run', async (_$: any, e: any) => {
    w.procs.push(e)
    const argv: string[] = e.argv
    const common = argv.includes('--git-common-dir')
    if (w.rejectAll || (common && w.rejectCommon)) return { deny: 'rejected' }
    const kind = argv[2] === 'status' ? 'status' : argv[2] === 'diff' ? 'diff' : 'rev'
    const cwd = e.init?.cwd ?? 'C:/r'
    let out = w.tree.head + '\n'
    if (common) out = w.common + '\n'
    else if (kind === 'status') out = w.tree.status
    else if (kind === 'diff') out = w.tree.diff
    else if (argv.includes('--show-toplevel')) out = `${cwd}\n${w.tree.head}\n`
    const result = (over: object) => ({ value: { exitCode: 0, stdout: out, stderr: '', isStdoutTruncated: false, isStderrTruncated: false, ...over } })
    const m = w.mode
    if (m !== undefined && !common && m.kind === kind && (m.side === 'both' || m.side === w.phase)) {
      if (m.how === 'reject') return { deny: 'timed out after 2000 ms' }
      if (m.how === 'exit128') return result({ exitCode: 128, stdout: '' })
      if (m.how === 'truncated') return result({ isStdoutTruncated: true })
      return { value: undefined }
    }
    if (w.hold && w.phase === 'before' && !common) {
      await new Promise<void>((resolve) => {
        w.waiters.push(resolve)
        if (w.waiters.length === 3) release(w)
        else if (w.timer === undefined) w.timer = setTimeout(() => release(w), 500)
      })
    }
    return result({})
  })
  return w
}

// One Bash call; the stubs read the tree as it stands when the call is made.
function bash($: any, w: World, command: string, extra: Record<string, unknown> = {}): Promise<any> {
  w.phase = 'before'
  return $.tool.call({ tool: 'Bash', command, ...extra } as never)
}

const record = (w: World, i = 0) => JSON.parse(w.writes[i].text)
const treeCalls = (w: World) => w.procs.filter((p) => !p.argv.includes('--git-common-dir'))
const nothingAsked = (w: World) => w.procs.length + w.writes.length + w.listed + w.forbidden.length === 0

const RUN_KEYS = [
  'schema', 'kind', 'agent_id', 'agent_type', 'command', 'started_at', 'ended_at', 'tree_basis', 'toplevel', 'head', 'head_after',
  'before', 'after', 'tree_changed_during_run', 'tool_is_error', 'interrupted', 'stdout', 'stderr', 'text', 'recorder_ms',
]

// ---------------------------------------------------------------------------------------------
// The run record
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: the after-snapshot skipped (snapshotAfter returning its all-unavailable value on every
// call) -> fails: `an approved command produces one complete run record`. Observed at COMMIT-T1 with this
// change, claude --version 2.1.289 (Claude Code).
test('an approved command produces one complete run record', async ($, on) => {
  const w = arm(on)
  expect(await bash($, w, CARGO)).toEqual(ANSWER)
  expect(w.writes.length).toBe(1)
  expect(w.forbidden).toEqual([])
  const { path, text } = w.writes[0]
  const r = record(w)
  expect(text.endsWith('\n') && text.indexOf('\n') === text.length - 1).toBe(true)
  const m = /^C:\/r-local\/evidence\/(\d{4}-\d\d-\d\d)\/(\d{9})-([0-9a-f]{16})\.json$/.exec(path)
  expect(m).not.toBeNull()
  expect(m![1]).toBe(r.ended_at.slice(0, 10))
  expect(m![2]).toBe(r.ended_at.slice(11, 23).replace(/[:.]/g, ''))
  expect(m![3]).toBe((await sha(text)).slice(0, 16))
  expect(Object.keys(r).sort()).toEqual([...RUN_KEYS].sort())
  expect(JSON.stringify(r)).not.toContain(UNAVAILABLE)
  const iso = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/
  expect(iso.test(r.started_at) && iso.test(r.ended_at) && r.started_at <= r.ended_at).toBe(true)
  expect([r.schema, r.kind, r.agent_id, r.agent_type, r.command]).toEqual(['spatial-evidence-recorder/v0', 'run', 'main', 'main', CARGO])
  expect([r.tree_basis, r.toplevel, r.head, r.head_after, r.tree_changed_during_run]).toEqual(['session-default', 'C:/r', HEAD_A, HEAD_A, false])
  const snap = { status_z_text_sha256: await sha(w.tree.status), diff_binary_text_sha256: await sha(w.tree.diff) }
  expect([r.before, r.after]).toEqual([snap, snap])
  expect([r.tool_is_error, r.interrupted]).toEqual([false, false])
  expect([r.stdout, r.stderr, r.text]).toEqual([await desc('out\n'), await desc('err\n'), await desc('out\nerr\n')])
  expect(Object.keys(r.recorder_ms)).toEqual(['before', 'after', 'write'])
  for (const ms of Object.values(r.recorder_ms)) expect(Number.isInteger(ms) && (ms as number) >= 0).toBe(true)
  expect(w.procs.length).toBe(7) // three before, three after, the common directory once
})

// RECORDED MUTATION: A4 matching any `verify-*.mjs` script (the VERIFY_SCRIPTS compare replaced by
// `/^verify[-a-z]*\.mjs$/.test(script.split('/').pop())`) -> fails: `a command outside the approved list
// produces no record and makes no engine call`. Observed at COMMIT-T2 with this change, claude --version
// 2.1.289 (Claude Code).
test('a command outside the approved list produces no record and makes no engine call', async ($, on) => {
  const w = arm(on)
  const commands = [
    'cargo test --no-run', 'cargo test -p k -- --list', 'node scripts/plan/verify-mutation.mjs', 'cargo build', 'cargo check',
    'cargo fmt --check', 'node scripts/plan/cfg-boundary.mjs', 'node build.mjs', 'npm run build', 'npm run typecheck',
    'npm run verify:adr-index', 'npm run check:types', 'cargo nextest run', 'cargo t', 'npx vitest', 'bash -c "cargo test"',
    'sh -c "cargo test"', 'env cargo test', 'time cargo test', 'xargs cargo test', 'sudo cargo test', 'timeout -k 5 600 cargo test',
    'for f in a b; do cargo test; done', './run-tests.sh', 'cat <<EOF\ncargo test\nEOF', 'x=$(cargo test)', 'echo `cargo test`',
    'echo cargo test', 'git status', 'cargo test "x', "cargo test 'x", 'cd C:/r',
  ]
  for (const command of commands) expect(await bash($, w, command)).toEqual(ANSWER)
  expect(nothingAsked(w)).toBe(true)
})

// RECORDED MUTATION: env assignments not stripped (the ENV_ASSIGNMENT branch dropped from normalise) ->
// fails: `every approved spelling in the matcher table produces one record`. Observed at COMMIT-T3 with
// this change, claude --version 2.1.289 (Claude Code).
test('every approved spelling in the matcher table produces one record', async ($, on) => {
  const w = arm(on)
  const commands = [
    'CARGO_TARGET_DIR=D:/t cargo test -p k --lib', 'timeout 600 node --test "scripts/plan/*.test.mjs"',
    'npm --prefix renderer/bundle-viewer run verify', 'npm test', 'npm run test:e2e', 'node ./scripts/plan/verify-cites.mjs',
    'node scripts\\plan\\verify.mjs --offline', 'cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked',
    'git status && cargo test', 'npm run test:residency-trace', 'npm run test:citation-integrity', 'node --test',
    'node scripts/plan/verify-quotes.mjs', 'node C:/r/scripts/plan/verify-test-claims.mjs', 'cargo test -p k 2>&1 | tail -n 20',
    'A=1 B="x y" timeout 1.5m cargo test', 'cargo test -- --nocapture',
  ]
  for (const [i, command] of commands.entries()) {
    expect(await bash($, w, command)).toEqual(ANSWER)
    expect(w.writes.length).toBe(i + 1)
    expect(record(w, i).command).toBe(command)
  }
})

// RECORDED MUTATION: the `try` around the before-snapshot removed (`before = await snapshotBefore($, plan)`
// unguarded) -> fails: `a failing or timed-out git call gives unavailable fields and leaves the result
// unchanged`. Observed at COMMIT-T4 with this change, claude --version 2.1.289 (Claude Code).
test('a failing or timed-out git call gives unavailable fields and leaves the result unchanged', async ($, on) => {
  const w = arm(on)
  const rev = (r: any) => [r.toplevel, r.head, r.head_after]
  const status = (r: any) => [r.before.status_z_text_sha256, r.after.status_z_text_sha256]
  const diff = (r: any) => [r.before.diff_binary_text_sha256, r.after.diff_binary_text_sha256]
  const cases: Array<[Mode, (r: any) => any[]]> = [
    [{ kind: 'rev', how: 'reject', side: 'both' }, rev],
    [{ kind: 'rev', how: 'exit128', side: 'both' }, rev],
    [{ kind: 'status', how: 'exit128', side: 'both' }, status],
    [{ kind: 'status', how: 'reject', side: 'both' }, status],
    [{ kind: 'diff', how: 'truncated', side: 'both' }, diff],
    [{ kind: 'diff', how: 'reject', side: 'both' }, diff],
  ]
  for (const [i, [mode, fields]] of cases.entries()) {
    w.mode = mode
    expect(await bash($, w, CARGO)).toEqual(ANSWER)
    expect(w.writes.length).toBe(i + 1)
    const r = record(w, i)
    expect(fields(r).every((v) => v === UNAVAILABLE)).toBe(true)
    expect(r.tree_changed_during_run).toBe(UNAVAILABLE)
    expect(r.stdout).toEqual(await desc('out\n')) // the other fields stay set
  }
  // An answer that is not a result at all, on the before side: every before-field is unavailable.
  w.mode = { kind: 'rev', how: 'malformed', side: 'before' }
  expect(await bash($, w, CARGO)).toEqual(ANSWER)
  expect(w.writes.length).toBe(cases.length + 1)
  const r = record(w, cases.length)
  expect([r.toplevel, r.head, r.before.status_z_text_sha256, r.before.diff_binary_text_sha256]).toEqual([UNAVAILABLE, UNAVAILABLE, UNAVAILABLE, UNAVAILABLE])
  expect([r.head_after, r.tree_changed_during_run]).toEqual([HEAD_A, UNAVAILABLE])
})

// RECORDED MUTATION: only the diff hashes compared (treeChanged over the diff pair alone) -> fails: `an
// edit or a commit during the run sets tree_changed_during_run`. Observed at COMMIT-T5 with this change,
// claude --version 2.1.289 (Claude Code).
test('an edit or a commit during the run sets tree_changed_during_run', async ($, on) => {
  const w = arm(on)
  const changes: Array<(t: Tree) => void> = [
    (t) => { t.status += '?? b.rs\0' },
    (t) => { t.diff += '+one line\n' },
    (t) => { t.head = HEAD_B },
    // A change made and restored inside the run reads as no change (the form's section 1 names this miss).
    (t) => { const kept = t.diff; t.diff += 'x'; t.diff = kept },
  ]
  for (const [i, during] of changes.entries()) {
    w.during = during
    w.tree = freshTree()
    expect(await bash($, w, CARGO)).toEqual(ANSWER)
    expect(record(w, i).tree_changed_during_run).toBe(i < 3)
  }
})

// RECORDED MUTATION: an unavailable side read as unchanged (treeChanged returning false where a pair holds
// an unavailable value) -> fails: `an unavailable side reads tree_changed_during_run unavailable`.
// Observed at COMMIT-T6 with this change, claude --version 2.1.289 (Claude Code).
test('an unavailable side reads tree_changed_during_run unavailable', async ($, on) => {
  const w = arm(on, { mode: { kind: 'status', how: 'reject', side: 'after' } })
  expect(await bash($, w, CARGO)).toEqual(ANSWER)
  const r = record(w)
  expect(r.after.status_z_text_sha256).toBe(UNAVAILABLE)
  expect(r.before.status_z_text_sha256).not.toBe(UNAVAILABLE)
  expect(r.tree_changed_during_run).toBe(UNAVAILABLE)
})

// ---------------------------------------------------------------------------------------------
// Outcome fields
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: the errored arm reading `result.stdout` and `result.stderr` (the early return in
// outcomeOf replaced by the answered arm's reads) -> fails: `the errored arm records the tool's error flag
// and the text fields, never stdout or stderr`. Observed at COMMIT-T7 with this change, claude --version
// 2.1.289 (Claude Code).
test("the errored arm records the tool's error flag and the text fields, never stdout or stderr", async ($, on) => {
  const message = 'Exit code 101\nERR-TEXT\n'
  const w = arm(on)
  // The typed `result` of an errored call is the error text; an object holding streams is the hostile shape.
  for (const result of [message, { stdout: 'ERR-OUT', stderr: 'ERR-ERR', interrupted: true }]) {
    w.bottom = { ref: 8, isError: true, result, text: message }
    expect(await bash($, w, CARGO)).toEqual(w.bottom)
  }
  expect(w.writes.length).toBe(2)
  for (const i of [0, 1]) {
    const r = record(w, i)
    expect([r.tool_is_error, r.interrupted, r.stdout, r.stderr]).toEqual([true, UNAVAILABLE, UNAVAILABLE, UNAVAILABLE])
    expect(r.text).toEqual(await desc(message))
    expect(w.writes[i].text).not.toContain('ERR-OUT')
  }
})

// RECORDED MUTATION: the `persistedOutputPath` check dropped from outcomeOf -> fails: `persisted output
// gives unavailable stdout and stderr fields`. Observed at COMMIT-T8 with this change, claude --version
// 2.1.289 (Claude Code).
test('persisted output gives unavailable stdout and stderr fields', async ($, on) => {
  const w = arm(on)
  w.bottom = { ...ANSWER, result: { ...ANSWER.result, persistedOutputPath: 'C:/o/out.txt', returnCodeInterpretation: 'no matches' } }
  expect(await bash($, w, CARGO)).toEqual(w.bottom)
  const r = record(w)
  expect([r.stdout, r.stderr, r.interrupted]).toEqual([UNAVAILABLE, UNAVAILABLE, false])
  expect(r.text).toEqual(await desc(ANSWER.text))
  expect(r.return_code_interpretation).toBe('no matches')
})

// RECORDED MUTATION: the deny check dropped from recordRun (the `ran.deny !== undefined` clause removed) ->
// fails: `a refused call produces no record`. Observed at COMMIT-T9 with this change, claude --version
// 2.1.289 (Claude Code).
test('a refused call produces no record', async ($, on) => {
  const w = arm(on, { bottom: { deny: 'spatial-guardian: refused.' } })
  expect(await bash($, w, CARGO)).toEqual({ deny: 'spatial-guardian: refused.' })
  expect(w.writes.length).toBe(0)
})

// RECORDED MUTATION: the `run_in_background` check dropped from recordRun -> fails: `a background call
// passes with no engine call`. Observed at COMMIT-T10 with this change, claude --version 2.1.289
// (Claude Code).
test('a background call passes with no engine call', async ($, on) => {
  const w = arm(on)
  expect(await bash($, w, CARGO, { run_in_background: true })).toEqual(ANSWER)
  expect(nothingAsked(w)).toBe(true)
})

// ---------------------------------------------------------------------------------------------
// The usage record
// ---------------------------------------------------------------------------------------------

const USAGE = { input_tokens: 10, output_tokens: 20, cache_read_input_tokens: 30, cache_creation_input_tokens: 40, model: 'm-1' }
const turn = ($: any, extra: Record<string, unknown>) =>
  $.turn.complete({ answer: 'done', durationMs: 5, isAborted: false, turnId: 't1', reason: 'answer', ...extra })

// RECORDED MUTATION: the `$.agent.list` lookup dropped from agentTypeOf (the type read as unavailable) ->
// fails: `a subagent's turn end produces one usage record`, `a subagent's approved run records its listed
// type`. Observed at COMMIT-T11 with this change, claude --version 2.1.289 (Claude Code).
test("a subagent's turn end produces one usage record", async ($, on) => {
  const w = arm(on, { agents: [{ id: 'ag1', description: 'd', type: 'Explore', status: 'completed' }] })
  expect(await turn($, { agentId: 'ag1', usage: USAGE })).toEqual({ text: 'done', usage: USAGE })
  expect(w.writes.length).toBe(1)
  expect(w.writes[0].path).toMatch(/^C:\/r-local\/evidence\/\d{4}-\d\d-\d\d\/\d{9}-[0-9a-f]{16}\.json$/)
  const r = record(w)
  expect(Object.keys(r).sort()).toEqual(['agent_id', 'agent_type', 'kind', 'recorded_at', 'schema', 'turn_id', 'usage'])
  expect([r.schema, r.kind, r.agent_id, r.agent_type, r.turn_id, r.usage]).toEqual(['spatial-evidence-recorder/v0', 'usage', 'ag1', 'Explore', 't1', USAGE])
  expect(w.forbidden).toEqual([])
})

// RECORDED MUTATION: the main-loop check dropped from recordUsage (`if (e.agentId === undefined) return
// out` removed) -> fails: `the main loop's turn end writes nothing, and missing values read unavailable`.
// Observed at COMMIT-T12 with this change, claude --version 2.1.289 (Claude Code).
test("the main loop's turn end writes nothing, and missing values read unavailable", async ($, on) => {
  const w = arm(on)
  expect(await turn($, {})).toEqual({ text: 'done' })
  expect(nothingAsked(w)).toBe(true)
  await turn($, { agentId: 'ghost' })
  expect(w.writes.length).toBe(1)
  const r = record(w)
  expect([r.agent_id, r.agent_type, r.usage]).toEqual(['ghost', UNAVAILABLE, UNAVAILABLE])
})

// RECORDED MUTATION: the Bash hook returning `{ ...ran, context: ["x"] }` (a copy with a context of its
// own) -> fails: `every hook returns what next produced, byte for byte`. Observed at COMMIT-T13 with this
// change, claude --version 2.1.289 (Claude Code).
test('every hook returns what next produced, byte for byte', async ($, on) => {
  const w = arm(on, { agents: [{ id: 'ag1', description: 'd', type: 'Explore', status: 'completed' }] })
  const same = (got: unknown, want: unknown) => {
    expect(got).toEqual(want)
    expect(JSON.stringify(got)).toBe(JSON.stringify(want))
  }
  const errored = { ref: 8, isError: true, result: 'Exit code 1', text: 'Exit code 1' }
  for (const [command, answer] of [[CARGO, ANSWER], ['ls -la', ANSWER], [CARGO, errored], [CARGO, { deny: 'refused' }]] as const) {
    w.bottom = answer
    same(await bash($, w, command), answer)
  }
  same(await turn($, { agentId: 'ag1', usage: USAGE }), { text: 'done', usage: USAGE })
  // Every `$` call rejecting: no record, and the same values back.
  w.bottom = ANSWER
  w.rejectAll = true
  same(await bash($, w, CARGO), ANSWER)
  same(await bash($, w, CARGO, { agentId: 'ag1' }), ANSWER)
  same(await turn($, { agentId: 'ag1', usage: USAGE }), { text: 'done', usage: USAGE })
})

// ---------------------------------------------------------------------------------------------
// The tree, the log root and the process calls
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: `cwd` not passed (gitRun building its init without the directory) -> fails: `a
// leading absolute cd sets the tree, and any other cd leaves it unresolved`. Observed at COMMIT-T14 with
// this change, claude --version 2.1.289 (Claude Code).
test('a leading absolute cd sets the tree, and any other cd leaves it unresolved', async ($, on) => {
  const w = arm(on, { common: 'C:/x/main/.git' })
  expect(await bash($, w, 'cd C:/x/wt/a && cargo test -p k')).toEqual(ANSWER)
  let r = record(w)
  expect([r.tree_basis, r.toplevel, r.tree_changed_during_run]).toEqual(['leading-cd', 'C:/x/wt/a', false])
  expect(w.writes[0].path.startsWith('C:/x/main-local/evidence/')).toBe(true)
  expect(treeCalls(w).length).toBe(6)
  for (const p of treeCalls(w)) expect(p.init.cwd).toBe('C:/x/wt/a')
  expect(w.procs.filter((p) => p.argv.includes('--git-common-dir')).every((p) => p.init.cwd === undefined)).toBe(true)

  // The drive spelling with backslashes, quoted, is a leading cd too.
  await bash($, w, 'cd "C:\\x\\wt b" && cargo test')
  expect([record(w, 1).tree_basis, treeCalls(w).at(-1).init.cwd]).toEqual(['leading-cd', 'C:\\x\\wt b'])

  // No cd at all: the session default, so no cwd.
  await bash($, w, 'cargo test')
  expect(record(w, 2).tree_basis).toBe('session-default')
  expect(treeCalls(w).at(-1).init.cwd).toBeUndefined()

  // Every other cd leaves the tree unresolved, and no tree git runs.
  const before = treeCalls(w).length
  const others = [
    'cd wt && cargo test', 'cd C:/x/wt/a; cargo test', 'cargo test && cd C:/x', 'cd C:/x/a && cd C:/x/b && cargo test',
    'cd $HOME && cargo test', 'cd C:/x/a C:/x/b && cargo test', 'cd ~ && cargo test',
  ]
  for (const [i, command] of others.entries()) {
    expect(await bash($, w, command)).toEqual(ANSWER)
    r = record(w, 3 + i)
    const tree = [r.toplevel, r.head, r.head_after, r.before.status_z_text_sha256, r.after.diff_binary_text_sha256, r.tree_changed_during_run]
    expect([r.tree_basis, ...tree]).toEqual(['unresolved', ...tree.map(() => UNAVAILABLE)])
  }
  expect(treeCalls(w).length).toBe(before)
})

// RECORDED MUTATION: the log root taken from the toplevel (the common-directory lookup replaced by `rev-parse
// --show-toplevel` and its first line) -> fails: `the log root comes from git's common directory, one new
// file per record, with no read`. Observed at COMMIT-T15 with this change, claude --version 2.1.289
// (Claude Code).
test("the log root comes from git's common directory, one new file per record, with no read", async ($, on) => {
  const w = arm(on)
  const lookups = () => w.procs.filter((p) => p.argv.includes('--git-common-dir')).length
  // The shapes that give no root: no record, the result is unchanged, and the lookup is tried again next time.
  for (const common of ['C:/x/main/.git/modules/m', 'C:/x/main.git', 'C:/.git', 'C:/x/../main/.git', '']) {
    w.common = common
    expect(await bash($, w, CARGO)).toEqual(ANSWER)
  }
  w.rejectCommon = true
  expect(await bash($, w, CARGO)).toEqual(ANSWER)
  expect([w.writes.length, lookups()]).toEqual([0, 6])

  // The root is derived from the common directory, with either separator, and not from the toplevel.
  w.rejectCommon = false
  w.common = 'C:\\x\\main\\.git'
  await bash($, w, 'cd C:/x/wt/a && cargo test')
  await bash($, w, 'cd C:/x/wt/a && cargo test')
  expect(w.writes.length).toBe(2)
  expect(w.writes[0].path).not.toBe(w.writes[1].path)
  for (const { path } of w.writes) expect(path).toMatch(/^C:\/x\/main-local\/evidence\/\d{4}-\d\d-\d\d\/\d{9}-[0-9a-f]{16}\.json$/)
  expect(record(w).toplevel).toBe('C:/x/wt/a')
  expect(lookups()).toBe(7) // found once, then kept

  // A refused write is dropped and nothing else happens: no read, and the result is unchanged.
  w.writeFails = true
  expect(await bash($, w, CARGO)).toEqual(ANSWER)
  expect(w.writes.length).toBe(3)
  expect(w.forbidden).toEqual([])
})

// RECORDED MUTATION: the before-side git calls issued one after another (each awaited before the next is
// started) -> fails: `the before-side git calls are issued together`. Observed at COMMIT-T16 with this
// change, claude --version 2.1.289 (Claude Code).
test('the before-side git calls are issued together', async ($, on) => {
  const w = arm(on, { hold: true })
  expect(await bash($, w, CARGO)).toEqual(ANSWER)
  expect(w.peak).toBe(3)
  expect(w.writes.length).toBe(1)
})

// RECORDED MUTATION: `timeoutMs` dropped from the after-side diff (the call in snapshotAfter made directly
// as `$.process.run(['git', '--no-optional-locks', 'diff', 'HEAD', '--binary'], { cwd: plan.cwd })`) ->
// fails: `every process call is git with no optional locks, a listed subcommand and the declared timeout`.
// Observed at COMMIT-T17 with this change, claude --version 2.1.289 (Claude Code).
test('every process call is git with no optional locks, a listed subcommand and the declared timeout', async ($, on) => {
  const w = arm(on, { common: 'C:/x/main/.git', agents: [{ id: 'ag1', description: 'd', type: 'worker', status: 'running' }] })
  await bash($, w, CARGO)
  await bash($, w, 'cd C:/x/wt/a && cargo test')
  await bash($, w, CARGO, { agentId: 'ag1' })
  expect(w.procs.length).toBe(19)
  const kinds = new Set<string>()
  for (const p of w.procs) {
    expect(p.argv[0]).toBe('git')
    expect(p.argv[1]).toBe('--no-optional-locks')
    expect(['rev-parse', 'status', 'diff']).toContain(p.argv[2])
    expect(p.init.timeoutMs).toBe(2000)
    kinds.add(p.argv[2])
  }
  expect([...kinds].sort()).toEqual(['diff', 'rev-parse', 'status'])
})

// RECORDED MUTATION: `$.agent.list` not called for run records (agentTypeOf returning unavailable for a
// subagent's run) -> fails: `a subagent's approved run records its listed type`. Observed at COMMIT-T18
// with this change, claude --version 2.1.289 (Claude Code).
test("a subagent's approved run records its listed type", async ($, on) => {
  const w = arm(on, { agents: [{ id: 'ag2', description: 'd', type: 'worker', status: 'running' }] })
  expect(await bash($, w, CARGO, { agentId: 'ag2' })).toEqual(ANSWER)
  expect([record(w).agent_id, record(w).agent_type]).toEqual(['ag2', 'worker'])
  expect(w.listed).toBe(1)
  await bash($, w, CARGO, { agentId: 'ghost' })
  expect([record(w, 1).agent_id, record(w, 1).agent_type]).toEqual(['ghost', UNAVAILABLE])
  await bash($, w, CARGO)
  expect([record(w, 2).agent_id, record(w, 2).agent_type]).toEqual(['main', 'main'])
  expect(w.listed).toBe(2) // the main loop's run asks for no listing
})

// RECORDED MUTATION: the `timedOutAfterMs` check dropped from outcomeOf -> fails: `an auto-backgrounded
// result records backgrounded_after_ms with after fields unavailable`. Observed at COMMIT-T19 with this
// change, claude --version 2.1.289 (Claude Code).
test('an auto-backgrounded result records backgrounded_after_ms with after fields unavailable', async ($, on) => {
  const w = arm(on)
  w.bottom = { ...ANSWER, result: { ...ANSWER.result, timedOutAfterMs: 120000, backgroundTaskId: 'b1' } }
  expect(await bash($, w, CARGO)).toEqual(w.bottom)
  const r = record(w)
  expect(r.backgrounded_after_ms).toBe(120000)
  expect([r.head_after, r.after.status_z_text_sha256, r.after.diff_binary_text_sha256, r.tree_changed_during_run]).toEqual([UNAVAILABLE, UNAVAILABLE, UNAVAILABLE, UNAVAILABLE])
  expect(r.head).toBe(HEAD_A)
  expect(treeCalls(w).length).toBe(3) // the before side only
})

// RECORDED MUTATION: stdout copied into the record (an extra `stdout_text: result.stdout` field in
// outcomeOf) -> fails: `a record carries no output, status or diff text`. Observed at COMMIT-T20 with this
// change, claude --version 2.1.289 (Claude Code).
test('a record carries no output, status or diff text', async ($, on) => {
  const w = arm(on, { tree: { head: HEAD_A, status: ' M MARK-ST\0', diff: 'MARK-DF\n' } })
  w.bottom = { ref: 9, result: { stdout: 'MARK-OUT\n', stderr: 'MARK-ERR\n', interrupted: false }, text: 'MARK-TX\n' }
  expect(await bash($, w, CARGO)).toEqual(w.bottom)
  expect(w.writes.length).toBe(1)
  expect(w.writes[0].text).not.toContain('MARK')
  expect(record(w).stdout).toEqual(await desc('MARK-OUT\n'))
})
