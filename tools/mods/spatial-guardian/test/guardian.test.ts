// Guardian v0's plugin tests (GUARDIAN-V0-PREREGISTRATION.md section 4, T1 to T34), run by
// `claude plugin test tools/mods/spatial-guardian`. A test answers the engine's events beneath the
// plugin with `on`; an event it does not answer throws at the bottom, which is how a test shows a rule
// makes no call, or that a refusing hook fails closed. T35 and T36 are in
// scripts/hooks/guardian-continuity-parity.test.mjs.
//
// Declared values are written out here, not imported: the reasons (section 7), the N1 sentence.
// The `agentId` of a subagent's call rides through a cast (`as never`): `$.tool.call`'s argument type
// does not list it, though the hook receives it (the build's own doc says it "may ride along"). The
// cast follows the P0 probe of GUARDIAN-V0-PREREGISTRATION.md section 0.2 item 1.
import { test, expect } from 'claude-code/testing'

const G1_REASON = 'spatial-guardian G1: refused, because this git push force-pushes or deletes a remote ref.'
const G2_REASON = 'spatial-guardian G2: refused, because docs/01 is never edited.'
const G3_REASON = 'spatial-guardian G3: refused, because an accepted ADR or a filed preregistration changes only by appending.'
const G4_REASON = 'spatial-guardian G4: refused, because an existing directive is never rewritten.'
const G6_REASON = "spatial-guardian G6: refused, because this run writes only its brief's REPORT PATH."
const UNPLACEABLE_REASON = 'spatial-guardian: refused, because the path cannot be placed.'
const CATCH_REASON = 'spatial-guardian: refused, because a check could not complete.'

const LEDGER = 'state/CUT-STATE.md'
const FLUSH_A = '2026-10-01T00:00:00Z'
const FLUSH_B = '2026-10-01T01:00:00Z'

type Proc = { exitCode: number; stdout?: string }

// What the engine answers beneath the plugin. A field left out is an event left unanswered.
type World = {
  // path -> realPath; null resolves with no realPath; undefined is ENOENT
  stat?: (path: string) => string | null | undefined
  // realPath -> text; undefined rejects
  read?: (path: string) => string | undefined
  // argv -> result; undefined rejects (a timeout)
  proc?: (argv: readonly string[]) => Proc | undefined
  agents?: unknown[]
  messages?: Record<string, unknown>
  // the summary breakdown's percentage; undefined carries no breakdown
  percent?: number
}

type Probe = {
  reached: any[] // the events that reached the engine's own tool, so were passed to next(e)
  procs: any[] // every process.run the plugin made
  stats: string[]
}

// Registers the world's answers, then the engine's tool beneath the plugin. Call before the first `$`.
function arm(on: any, world: World): Probe {
  const probe: Probe = { reached: [], procs: [], stats: [] }
  on('tool.call', async ($: any, e: any) => {
    probe.reached.push(e)
    return { result: {}, text: 'ran' }
  })
  on('session.usage', async () => ({
    value: {
      startedAt: 0,
      context: {
        window: 1_000_000,
        ...(world.percent === undefined
          ? {}
          : { breakdown: { percentage: world.percent, rawMaxTokens: 200_000, totalTokens: 0, maxTokens: 200_000 } }),
      },
      rateLimits: [],
    },
  }))
  if (world.stat !== undefined) {
    on('fs.stat', async ($: any, e: any) => {
      probe.stats.push(e.path)
      const real = world.stat!(e.path)
      if (real === undefined) return { deny: 'ENOENT: no such file or directory' }
      return { value: { kind: 'file', size: 1, mtimeMs: 0, isLink: false, ...(real === null ? {} : { realPath: real }) } }
    })
  }
  if (world.read !== undefined) {
    on('fs.read', async ($: any, e: any) => {
      const text = world.read!(e.path)
      return text === undefined ? { deny: 'file too large to read' } : { value: text }
    })
  }
  if (world.proc !== undefined) {
    on('process.run', async ($: any, e: any) => {
      probe.procs.push(e)
      const result = world.proc!(e.argv)
      if (result === undefined) return { deny: 'timed out after 2000 ms' }
      return { value: { exitCode: result.exitCode, stdout: result.stdout ?? '', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
    })
  }
  if (world.agents !== undefined) {
    on('agent.list', async () => ({ value: world.agents }))
  }
  if (world.messages !== undefined) {
    on('session.messages', async ($: any, e: any) => ({ value: world.messages![e.agentId] ?? { deny: 'no such agent' } }))
  }
  return probe
}

const call = ($: any, input: Record<string, unknown>): Promise<any> => $.tool.call(input)

function expectRefused(result: any, reason: string, probe: Probe) {
  expect(result.deny).toBe(reason)
  expect(probe.reached.length).toBe(0)
}

// The call reached the engine's tool, and what reached it is what was sent.
function expectPassed(result: any, probe: Probe, input: Record<string, unknown>) {
  expect(result.deny).toBeUndefined()
  const got = probe.reached.at(-1)
  expect(got).toBeDefined()
  for (const key of Object.keys(input)) expect(got[key]).toEqual(input[key])
}

const bash = (command: string) => ({ tool: 'Bash', command })

// ---------------------------------------------------------------------------------------------
// G1
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: the short-option cluster check dropped from pushArgumentsRefuse (the
// `/^-[A-Za-z0-9]*[fd]/` line) -> fails: `G1 refuses --force, -f and a short-flag cluster holding f`.
// Observed at 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('G1 refuses --force, -f and a short-flag cluster holding f', async ($, on) => {
  const probe = arm(on, {})
  for (const command of ['git push --force', 'git push -f', 'git push -uf origin x']) {
    expectRefused(await call($, bash(command)), G1_REASON, probe)
  }
})

// RECORDED MUTATION: the --force-with-lease check matching only the bare spelling (the `=value` form
// dropped) -> fails: `G1 refuses --force-with-lease, bare and with a value`. Observed at 54eba872 with
// this change, claude --version 2.1.288 (Claude Code).
test('G1 refuses --force-with-lease, bare and with a value', async ($, on) => {
  const probe = arm(on, {})
  for (const command of ['git push --force-with-lease', 'git push --force-with-lease=main:abc']) {
    expectRefused(await call($, bash(command)), G1_REASON, probe)
  }
})

// RECORDED MUTATION: the `+` refspec check dropped from pushArgumentsRefuse -> fails: `G1 refuses a
// refspec that begins with +`. Observed at 54eba872 with this change, claude --version 2.1.288 (Claude
// Code).
test('G1 refuses a refspec that begins with +', async ($, on) => {
  const probe = arm(on, {})
  expectRefused(await call($, bash('git push origin +main')), G1_REASON, probe)
})

// RECORDED MUTATION: the `--mirror` check dropped from pushArgumentsRefuse -> fails: `G1 refuses
// --mirror`. Observed at 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('G1 refuses --mirror', async ($, on) => {
  const probe = arm(on, {})
  expectRefused(await call($, bash('git push --mirror')), G1_REASON, probe)
})

// RECORDED MUTATION: the `:` refspec check dropped from pushArgumentsRefuse -> fails: `G1 refuses a
// push that deletes a remote ref`. Observed at 54eba872 with this change, claude --version 2.1.288
// (Claude Code).
test('G1 refuses a push that deletes a remote ref', async ($, on) => {
  const probe = arm(on, {})
  for (const command of ['git push --delete origin x', 'git push -d origin x', 'git push origin :x', 'git push --prune origin']) {
    expectRefused(await call($, bash(command)), G1_REASON, probe)
  }
})

// RECORDED MUTATION: the nested rescan of a quoted token dropped from pushRefused (the
// `pushRefused(token.value, depth + 1)` line) -> fails: `G1 finds the push after git global options
// and inside a quoted command string`. Observed at 54eba872 with this change, claude --version 2.1.288
// (Claude Code).
test('G1 finds the push after git global options and inside a quoted command string', async ($, on) => {
  const probe = arm(on, {})
  for (const command of ['git -C sub -c a=b push -f', 'bash -c "git push --force"']) {
    expectRefused(await call($, bash(command)), G1_REASON, probe)
  }
})

// RECORDED MUTATION: an unbalanced-quote segment that holds `push` read as no push (the
// `text.includes('push')` line dropped) -> fails: `G1 refuses a push segment it cannot tokenise`.
// Observed at 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('G1 refuses a push segment it cannot tokenise', async ($, on) => {
  const probe = arm(on, {})
  expectRefused(await call($, bash('git push "origin')), G1_REASON, probe)
})

// RECORDED MUTATION: pushRefused scanning the whole command as one segment (`for (const text of
// [command])` in place of splitSegments) -> fails: `G1 allows an ordinary push and a force flag that
// belongs to another command`. Observed at 54eba872 with this change, claude --version 2.1.288 (Claude
// Code).
test('G1 allows an ordinary push and a force flag that belongs to another command', async ($, on) => {
  const probe = arm(on, {})
  for (const command of ['git push -u origin b', 'git push && rm -f x', 'git commit -m "push -f"']) {
    const input = bash(command)
    expectPassed(await call($, input), probe, input)
  }
})

// RECORDED MUTATION: the PowerShell registration dropped from register() -> fails: `G1 refuses a
// force-push through the PowerShell tool`. Observed at 54eba872 with this change, claude --version
// 2.1.288 (Claude Code).
test('G1 refuses a force-push through the PowerShell tool', async ($, on) => {
  const probe = arm(on, {})
  expectRefused(await call($, { tool: 'PowerShell', command: 'git push --force' }), G1_REASON, probe)
  const input = { tool: 'PowerShell', command: 'git push -u origin b' }
  expectPassed(await call($, input), probe, input)
})

// ---------------------------------------------------------------------------------------------
// G2
// ---------------------------------------------------------------------------------------------

const same = (path: string) => path

// RECORDED MUTATION: G2's suffix compare made case-sensitive (it tests placed.real with separators
// normalised but not lower-cased) -> fails: `G2 refuses a Write and an Edit to docs/01_Principles.md
// in every spelling`, `G2 to G4 cover NotebookEdit`. Observed at 54eba872 with this change, claude
// --version 2.1.288 (Claude Code).
test('G2 refuses a Write and an Edit to docs/01_Principles.md in every spelling', async ($, on) => {
  const probe = arm(on, { stat: same })
  for (const file_path of ['C:\\r\\docs\\01_Principles.md', 'c:/r/DOCS/01_principles.md', 'C:/r\\docs/01_PRINCIPLES.MD']) {
    expectRefused(await call($, { tool: 'Write', file_path, content: 'x' }), G2_REASON, probe)
    expectRefused(await call($, { tool: 'Edit', file_path, old_string: 'a', new_string: 'b' }), G2_REASON, probe)
  }
})

// RECORDED MUTATION: G2 matching on the `/docs/` segment (`norm.includes('/docs/')`) in place of the
// suffix -> fails: `G2 allows a Write beside docs/01_Principles.md`, `G3 refuses an Edit to an
// accepted ADR`, `G3 allows an Edit to a Proposed ADR and to an untracked preregistration`, `G2 to G4
// cover NotebookEdit`. Observed at 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('G2 allows a Write beside docs/01_Principles.md', async ($, on) => {
  const probe = arm(on, { stat: same })
  const input = { tool: 'Write', file_path: 'C:/r/docs/02_Architecture.md', content: 'x' }
  expectPassed(await call($, input), probe, input)
})

// ---------------------------------------------------------------------------------------------
// G3
// ---------------------------------------------------------------------------------------------

const ADR_ACCEPTED = '# ADR-099\n\n**Status:** Accepted for Windows/WebView2 (2026-08-03)\n\nBody.\n'
const ADR_PROPOSED = '# ADR-098\n\n**Status:** Proposed -- binds nothing.\n\nBody.\n'
const PREREG = '# Form\n\nintro line\n\nlast line\n'
const ADR_PATH = 'C:\\r\\docs\\adr\\ADR-099-example.md'
const PREREG_PATH = 'C:\\r\\tools\\X-PREREGISTRATION.md'

// A world holding the files by path; cat-file answers `filed`.
function filesWorld(files: Record<string, string>, filed = 0): World {
  return {
    stat: (path) => (path in files ? path : undefined),
    read: (path) => files[path],
    proc: (argv) => (argv[0] === 'git' && argv[1] === 'cat-file' ? { exitCode: filed } : undefined),
  }
}

// RECORDED MUTATION: an ADR protected only on a literal `Accepted —` in its text, in place of
// isProposed -> fails: `G3 refuses an Edit to an accepted ADR`, `G2 to G4 cover NotebookEdit`.
// Observed at 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('G3 refuses an Edit to an accepted ADR', async ($, on) => {
  const probe = arm(on, filesWorld({ [ADR_PATH]: ADR_ACCEPTED }))
  const input = { tool: 'Edit', file_path: ADR_PATH, old_string: 'Body.', new_string: 'Rewritten.' }
  expectRefused(await call($, input), G3_REASON, probe)
})

// RECORDED MUTATION: G3's Write check using `includes` in place of `startsWith` -> fails: `G3 refuses
// a Write that does not start with a filed preregistration's current bytes`. Observed at 54eba872 with
// this change, claude --version 2.1.288 (Claude Code).
test("G3 refuses a Write that does not start with a filed preregistration's current bytes", async ($, on) => {
  const probe = arm(on, filesWorld({ [PREREG_PATH]: PREREG }))
  // The new content holds the current bytes, but not at its start.
  expectRefused(await call($, { tool: 'Write', file_path: PREREG_PATH, content: `prefix\n${PREREG}` }), G3_REASON, probe)
  expectRefused(await call($, { tool: 'Write', file_path: PREREG_PATH, content: 'replaced\n' }), G3_REASON, probe)
})

// RECORDED MUTATION: G3 refusing every Write to a protected file (`return true` in the write branch)
// -> fails: `G3 allows a pure-append Write to a filed preregistration`, `G3 refuses when the current
// bytes cannot be read`, `every process call is git and carries the declared timeout`. Observed at
// 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('G3 allows a pure-append Write to a filed preregistration', async ($, on) => {
  const probe = arm(on, filesWorld({ [PREREG_PATH]: PREREG }))
  const input = { tool: 'Write', file_path: PREREG_PATH, content: `${PREREG}appended\n` }
  expectPassed(await call($, input), probe, input)
})

// RECORDED MUTATION: G3 ignoring cat-file's exit code (`isProtected = true`) -> fails: `G3 allows an
// Edit to a Proposed ADR and to an untracked preregistration`. Observed at 54eba872 with this change,
// claude --version 2.1.288 (Claude Code).
test('G3 allows an Edit to a Proposed ADR and to an untracked preregistration', async ($, on) => {
  const proposedPath = 'C:\\r\\docs\\adr\\ADR-098-example.md'
  const probe = arm(on, filesWorld({ [proposedPath]: ADR_PROPOSED, [PREREG_PATH]: PREREG }, 128))
  const proposed = { tool: 'Edit', file_path: proposedPath, old_string: 'Body.', new_string: 'Rewritten.' }
  expectPassed(await call($, proposed), probe, proposed)
  const untracked = { tool: 'Edit', file_path: PREREG_PATH, old_string: 'intro line', new_string: 'edited line' }
  expectPassed(await call($, untracked), probe, untracked)
})

// RECORDED MUTATION: G3 catching the current-bytes read error and reading '' (the read's rejection
// swallowed) -> fails: `G3 refuses when the current bytes cannot be read`. Observed at 54eba872 with
// this change, claude --version 2.1.288 (Claude Code).
test('G3 refuses when the current bytes cannot be read', async ($, on) => {
  const world = filesWorld({ [PREREG_PATH]: PREREG })
  world.read = () => undefined
  const probe = arm(on, world)
  expectRefused(await call($, { tool: 'Write', file_path: PREREG_PATH, content: `${PREREG}appended\n` }), CATCH_REASON, probe)
})

// RECORDED MUTATION: the `text.endsWith(old)` check dropped from the Edit append test -> fails: `G3
// allows an Edit that only appends at the end of a filed preregistration`. Observed at 54eba872 with
// this change, claude --version 2.1.288 (Claude Code).
test('G3 allows an Edit that only appends at the end of a filed preregistration', async ($, on) => {
  const probe = arm(on, filesWorld({ [PREREG_PATH]: PREREG }))
  const append = { tool: 'Edit', file_path: PREREG_PATH, old_string: 'last line\n', new_string: 'last line\nan addition\n' }
  expectPassed(await call($, append), probe, append)
  // old_string occurs once but not at the end of the file.
  const middle = { tool: 'Edit', file_path: PREREG_PATH, old_string: 'intro line', new_string: 'intro line, edited' }
  const before = probe.reached.length
  expect((await call($, middle)).deny).toBe(G3_REASON)
  expect(probe.reached.length).toBe(before)
})

// ---------------------------------------------------------------------------------------------
// G4
// ---------------------------------------------------------------------------------------------

const DIRECTIVE = 'C:\\r\\state\\directives\\x.md'

// RECORDED MUTATION: G4 refusing an Edit only (the `placed.exists` Write branch dropped) -> fails: `G4
// refuses a Write to an existing directive and any Edit under state/directives/`. Observed at 54eba872
// with this change, claude --version 2.1.288 (Claude Code).
test('G4 refuses a Write to an existing directive and any Edit under state/directives/', async ($, on) => {
  const probe = arm(on, { stat: (path) => (path === DIRECTIVE ? path : undefined) })
  expectRefused(await call($, { tool: 'Write', file_path: DIRECTIVE, content: 'x' }), G4_REASON, probe)
  expectRefused(await call($, { tool: 'Edit', file_path: DIRECTIVE, old_string: 'a', new_string: 'b' }), G4_REASON, probe)
})

// RECORDED MUTATION: G4 refusing on the `/state/directives/` segment alone (the Write-creates-new-file
// allowance dropped) -> fails: `G4 allows a Write that creates a new directive`. Observed at 54eba872
// with this change, claude --version 2.1.288 (Claude Code).
test('G4 allows a Write that creates a new directive', async ($, on) => {
  const probe = arm(on, newFileWorld(['C:\\r\\state\\directives'], {}))
  const input = { tool: 'Write', file_path: 'C:\\r\\state\\directives\\y.md', content: 'new' }
  expectPassed(await call($, input), probe, input)
})

// ---------------------------------------------------------------------------------------------
// Placement
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: an unplaceable path treated as unprotected (`return next(e)` in place of the
// UNPLACEABLE deny) -> fails: `Write and Edit refuse a path that cannot be placed`. Observed at
// 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('Write and Edit refuse a path that cannot be placed', async ($, on) => {
  // No file system answer is registered: an unplaceable spelling makes no call.
  const probe = arm(on, {})
  for (const file_path of ['D:x', '\\\\h\\s\\x']) {
    expectRefused(await call($, { tool: 'Write', file_path, content: 'x' }), UNPLACEABLE_REASON, probe)
    expectRefused(await call($, { tool: 'Edit', file_path, old_string: 'a', new_string: 'b' }), UNPLACEABLE_REASON, probe)
  }
})

// ---------------------------------------------------------------------------------------------
// G6
// ---------------------------------------------------------------------------------------------

const REPORT = 'C:\\r\\state\\consults\\x.md'
const REPORT_FOLDER = 'C:\\r\\state\\consults\\'

function brief(lines: string[]) {
  return [{ role: 'user', text: lines.join('\n'), toolUses: [] }]
}

function agentRow(id: string, type: string) {
  return { id, description: '', type, status: 'running' }
}

// A world where the listed folders exist and no file does, so a Write creates a new file. A folder
// resolves to its canonical spelling whatever case and separators the call spelled it with.
function newFileWorld(folders: string[], extra: Partial<World>): World {
  const key = (p: string) => p.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase()
  return { stat: (path) => folders.find((f) => key(f) === key(path)), ...extra }
}

const asSubagent = (input: Record<string, unknown>, agentId: string) => ({ ...input, agentId }) as never

// RECORDED MUTATION: G6 comparing basenames only -> fails: `G6 refuses a lead-data Write outside its
// declared REPORT PATH`. Observed at 54eba872 with this change, claude --version 2.1.288 (Claude
// Code).
test('G6 refuses a lead-data Write outside its declared REPORT PATH', async ($, on) => {
  const probe = arm(
    on,
    newFileWorld(['C:\\r\\docs', 'C:\\r\\state\\consults'], {
      agents: [agentRow('a1', 'lead-data')],
      messages: { a1: brief(['Do the task.', `REPORT PATH: ${REPORT}`, 'Then stop.']) },
    }),
  )
  // The same basename in another folder, and another file in the report's folder.
  for (const file_path of ['C:\\r\\docs\\x.md', 'C:\\r\\state\\consults\\y.md']) {
    expectRefused(await call($, asSubagent({ tool: 'Write', file_path, content: 'x' }, 'a1')), G6_REASON, probe)
  }
})

// RECORDED MUTATION: G6 comparing the placed paths case-sensitively (the normalise call dropped from
// the compare) -> fails: `G6 allows a lead-data Write to its declared REPORT PATH`. Observed at
// 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('G6 allows a lead-data Write to its declared REPORT PATH', async ($, on) => {
  const probe = arm(
    on,
    newFileWorld(['C:\\r\\state\\consults'], {
      agents: [agentRow('a1', 'lead-data')],
      messages: { a1: brief([`REPORT PATH: ${REPORT}`]) },
    }),
  )
  const input = { tool: 'Write', file_path: 'c:/R/State/Consults/X.MD', content: 'report' }
  expectPassed(await call($, asSubagent(input, 'a1')), probe, input)
})

// RECORDED MUTATION: a brief with no REPORT PATH line read as allow (zero matches return undefined) ->
// fails: `G6 refuses every Write by an architect run whose brief declares no REPORT PATH`. Observed at
// 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('G6 refuses every Write by an architect run whose brief declares no REPORT PATH', async ($, on) => {
  const probe = arm(
    on,
    newFileWorld(['C:\\r\\state\\consults'], {
      agents: [agentRow('a2', 'architect')],
      messages: { a2: brief(['Review the draft.', 'REPORT PATH is mentioned here but not as a line start.']) },
    }),
  )
  expectRefused(await call($, asSubagent({ tool: 'Write', file_path: REPORT, content: 'x' }, 'a2')), G6_REASON, probe)
})

// RECORDED MUTATION: G6 applied to every listed agent type (the report-only type check dropped) ->
// fails: `G6 leaves other subagents, unlisted agent ids and the main loop to the other rules`.
// Observed at 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('G6 leaves other subagents, unlisted agent ids and the main loop to the other rules', async ($, on) => {
  // No messages answer is registered: G6 reads a brief only for a listed report-only type.
  const probe = arm(on, newFileWorld(['C:\\r\\notes'], { agents: [agentRow('a3', 'worker')] }))
  for (const agentId of ['a3', 'unlisted', undefined]) {
    const base = { tool: 'Write', file_path: 'C:\\r\\notes\\n.md', content: 'x' }
    const result = await call($, agentId === undefined ? base : asSubagent(base, agentId))
    expect(result.deny).toBeUndefined()
  }
  expect(probe.reached.length).toBe(3)
})

// ---------------------------------------------------------------------------------------------
// Fail closed
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: the Write registration's `.catch` removed -> fails: `G3 refuses when the current
// bytes cannot be read`, `a refusing hook that throws is refused by its catch`, `a refusing hook whose
// process call times out is refused`. Observed at 54eba872 with this change, claude --version 2.1.288
// (Claude Code).
test('a refusing hook that throws is refused by its catch', async ($, on) => {
  // process.run is not answered, so G3's filed-preregistration check throws.
  const probe = arm(on, { stat: same, read: () => PREREG })
  expectRefused(await call($, { tool: 'Write', file_path: PREREG_PATH, content: `${PREREG}appended\n` }), CATCH_REASON, probe)
})

// RECORDED MUTATION: the Write registration's `.catch` returning undefined (`.catch(() => undefined)`)
// -> fails: `G3 refuses when the current bytes cannot be read`, `a refusing hook that throws is
// refused by its catch`, `a refusing hook whose process call times out is refused`. Observed at
// 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('a refusing hook whose process call times out is refused', async ($, on) => {
  const probe = arm(on, { stat: same, read: () => PREREG, proc: () => undefined })
  expectRefused(await call($, { tool: 'Write', file_path: PREREG_PATH, content: `${PREREG}appended\n` }), CATCH_REASON, probe)
})

// ---------------------------------------------------------------------------------------------
// Process calls
// ---------------------------------------------------------------------------------------------

// A repository whose ledger commit abc123 has `c` as its flushed_at and `p` in its first parent
// (no parent copy when p is undefined). The state is read at call time.
function gitWorld(state: { c: string; p?: string }, catFile = 0): (argv: readonly string[]) => Proc | undefined {
  const block = (flushedAt: string) =>
    ['# CUT-STATE', '', '## SESSION-CONTINUITY', `flushed_at: ${flushedAt}`, 'tip: 0000000000000000000000000000000000000000', '', '## Ledger', '', '- entry', ''].join('\n')
  return (argv) => {
    if (argv[0] !== 'git') return undefined
    if (argv[1] === 'cat-file') return { exitCode: catFile }
    if (argv[1] === 'log') return { exitCode: 0, stdout: 'abc123\n' }
    if (argv[1] === 'show' && argv[2] === `abc123:${LEDGER}`) return { exitCode: 0, stdout: block(state.c) }
    if (argv[1] === 'show' && argv[2] === `abc123^1:${LEDGER}`) {
      return state.p === undefined ? { exitCode: 128 } : { exitCode: 0, stdout: block(state.p) }
    }
    return undefined
  }
}

const N1_LINE = (n: string) => `Context at ${n}%: flush the continuity block now (rewrite, commit, push), then continue.`

// RECORDED MUTATION: `timeoutMs` dropped from N1's git adapter (`$.process.run(['git', ...args])`) ->
// fails: `every process call is git and carries the declared timeout`. Observed at 54eba872 with this
// change, claude --version 2.1.288 (Claude Code).
test('every process call is git and carries the declared timeout', async ($, on) => {
  const state = { c: FLUSH_A, p: FLUSH_A }
  const world: World = { stat: same, read: () => PREREG, proc: gitWorld(state), percent: 85 }
  const probe = arm(on, world)
  // G3's filed-preregistration check (F12), then N1's git reads on a stale block (F25).
  const write = { tool: 'Write', file_path: PREREG_PATH, content: `${PREREG}appended\n` }
  expectPassed(await call($, write), probe, write)
  const status = bash('git status')
  expectPassed(await call($, status), probe, status)
  const kinds = new Set<string>()
  for (const e of probe.procs) {
    expect(e.argv[0]).toBe('git')
    expect(e.init.timeoutMs).toBe(2000)
    kinds.add(e.argv[1])
  }
  expect(kinds.has('cat-file')).toBe(true)
  expect(kinds.has('log')).toBe(true)
  expect(kinds.has('show')).toBe(true)
})

// ---------------------------------------------------------------------------------------------
// N1
// ---------------------------------------------------------------------------------------------

// Runs one main-loop Bash call at `percent` and returns the result.
async function bashAt($: any, world: World, percent: number | undefined) {
  world.percent = percent
  return call($, bash('git status'))
}

// RECORDED MUTATION: `<=` in place of `<` in N1's threshold test (a fill of exactly 80 reads as below)
// -> fails: `N1 appends no line below 80 percent and one line at 80 percent on a stale block`.
// Observed at 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('N1 appends no line below 80 percent and one line at 80 percent on a stale block', async ($, on) => {
  const world: World = { proc: gitWorld({ c: FLUSH_A, p: FLUSH_A }) }
  arm(on, world)
  const below = await bashAt($, world, 79)
  expect(below.deny).toBeUndefined()
  expect(below.context).toBeUndefined()
  const at = await bashAt($, world, 80)
  expect(at.context).toEqual([N1_LINE('80')])
})

// RECORDED MUTATION: N1 never recording a shown band (`shownBands.add(band)` dropped) -> fails: `N1
// appends at most one line per 10-point band`. Observed at 54eba872 with this change, claude --version
// 2.1.288 (Claude Code).
test('N1 appends at most one line per 10-point band', async ($, on) => {
  const world: World = { proc: gitWorld({ c: FLUSH_A, p: FLUSH_A }) }
  arm(on, world)
  await bashAt($, world, 10) // opens clean: no band is shown yet
  const lines: Array<string[] | undefined> = []
  for (const percent of [81, 85, 89, 90]) lines.push((await bashAt($, world, percent)).context)
  expect(lines).toEqual([[N1_LINE('81')], undefined, undefined, [N1_LINE('90')]])
})

// RECORDED MUTATION: N1 skipping judgeContinuity and treating every block as stale (`const verdict = {
// judged: true, stale: true }`) -> fails: `every process call is git and carries the declared
// timeout`, `N1 appends nothing on a fresh block`. Observed at 54eba872 with this change, claude
// --version 2.1.288 (Claude Code).
test('N1 appends nothing on a fresh block', async ($, on) => {
  const state: { c: string; p?: string } = { c: FLUSH_B, p: FLUSH_A } // a flush-only ledger commit
  const world: World = { proc: gitWorld(state) }
  arm(on, world)
  await bashAt($, world, 10)
  expect((await bashAt($, world, 85)).context).toBeUndefined()
  state.p = undefined // a ledger commit with no first-parent copy reads fresh as well
  expect((await bashAt($, world, 85)).context).toBeUndefined()
})

// RECORDED MUTATION: the `agentId` check dropped from N1's early return -> fails: `N1 appends nothing
// for a subagent call or a refused call`. Observed at 54eba872 with this change, claude --version
// 2.1.288 (Claude Code).
test('N1 appends nothing for a subagent call or a refused call', async ($, on) => {
  const world: World = { proc: gitWorld({ c: FLUSH_A, p: FLUSH_A }), percent: 85 }
  const probe = arm(on, world)
  const sub = await call($, asSubagent(bash('git status'), 'a9'))
  expect(sub.deny).toBeUndefined()
  expect(sub.context).toBeUndefined()
  expect(probe.procs.length).toBe(0)
  const refused = await call($, bash('git push --force'))
  expect(refused).toEqual({ deny: G1_REASON })
  expect(probe.procs.length).toBe(0)
})

// RECORDED MUTATION: N1 never clearing shownBands below the threshold (`shownBands.clear()` dropped)
// -> fails: `N1 clears its bands after the fill falls below 80 percent`. Observed at 54eba872 with
// this change, claude --version 2.1.288 (Claude Code).
test('N1 clears its bands after the fill falls below 80 percent', async ($, on) => {
  const world: World = { proc: gitWorld({ c: FLUSH_A, p: FLUSH_A }) }
  arm(on, world)
  await bashAt($, world, 10)
  const lines: Array<string[] | undefined> = []
  for (const percent of [85, 40, 85]) lines.push((await bashAt($, world, percent)).context)
  expect(lines).toEqual([[N1_LINE('85')], undefined, [N1_LINE('85')]])
})

// RECORDED MUTATION: an unrounded percent in N1_TEXT (`Math.round(p)` replaced by `p`) -> fails: `N1's
// line is the declared text with the integer percent`. Observed at 54eba872 with this change, claude
// --version 2.1.288 (Claude Code).
test("N1's line is the declared text with the integer percent", async ($, on) => {
  const world: World = { proc: gitWorld({ c: FLUSH_A, p: FLUSH_A }) }
  arm(on, world)
  await bashAt($, world, 10)
  expect((await bashAt($, world, 83.4)).context).toEqual(['Context at 83%: flush the continuity block now (rewrite, commit, push), then continue.'])
})

// ---------------------------------------------------------------------------------------------
// NotebookEdit
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: the NotebookEdit registration dropped from register() -> fails: `G2 to G4 cover
// NotebookEdit`. Observed at 54eba872 with this change, claude --version 2.1.288 (Claude Code).
test('G2 to G4 cover NotebookEdit', async ($, on) => {
  const files = { [ADR_PATH]: ADR_ACCEPTED, [DIRECTIVE]: 'x', 'C:\\r\\docs\\01_Principles.md': 'x' }
  const probe = arm(on, filesWorld(files))
  const nb = { cell_id: 'c1', new_source: 'y' }
  expectRefused(await call($, { tool: 'NotebookEdit', notebook_path: 'C:\\r\\docs\\01_Principles.md', ...nb }), G2_REASON, probe)
  expectRefused(await call($, { tool: 'NotebookEdit', notebook_path: DIRECTIVE, ...nb }), G4_REASON, probe)
  expectRefused(await call($, { tool: 'NotebookEdit', notebook_path: ADR_PATH, ...nb }), G3_REASON, probe)
})
