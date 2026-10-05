// Guardian v0's plugin tests (GUARDIAN-V0-PREREGISTRATION.md section 4 and Amendments 2 and 4, T1 to
// T34 and T37 to T41), run by
// `claude plugin test tools/mods/spatial-guardian`. A test answers the engine's events beneath the
// plugin with `on`; an event it does not answer throws at the bottom, which is how a test shows a rule
// makes no call, or that a refusing hook fails closed. T35 and T36 are in
// scripts/hooks/guardian-continuity-parity.test.mjs. `arm` answers env.get by default (USERPROFILE as
// C:\u, every other name unset; GUARDIAN-V1-PREREGISTRATION.md, Amendment 6, Part B).
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
  // name -> value for env.get (a name not listed is unset), or 'reject'; undefined answers USERPROFILE as C:\u
  env?: Record<string, string> | 'reject'
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
  on('env.get', async ($: any, e: any) => {
    if (world.env === 'reject') return { deny: 'env read rejected' }
    return { value: (world.env ?? { USERPROFILE: 'C:\\u' })[e.name] }
  })
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
// `/^-[A-Za-z0-9]*[fd]/` line) -> fails: `G1 refuses --force, -f and a short-flag cluster holding f`, `G1
// keeps every refusal it made before the second reading`. Observed at 71db3d7d with this change, claude
// --version 2.1.289 (Claude Code).
test('G1 refuses --force, -f and a short-flag cluster holding f', async ($, on) => {
  const probe = arm(on, {})
  for (const command of ['git push --force', 'git push -f', 'git push -uf origin x']) {
    expectRefused(await call($, bash(command)), G1_REASON, probe)
  }
})

// RECORDED MUTATION: the --force-with-lease check matching only the bare spelling (the `=value` form
// dropped) -> fails: `G1 refuses --force-with-lease, bare and with a value`. Observed at 71db3d7d with
// this change, claude --version 2.1.289 (Claude Code).
test('G1 refuses --force-with-lease, bare and with a value', async ($, on) => {
  const probe = arm(on, {})
  for (const command of ['git push --force-with-lease', 'git push --force-with-lease=main:abc']) {
    expectRefused(await call($, bash(command)), G1_REASON, probe)
  }
})

// RECORDED MUTATION: the `+` refspec check dropped from pushArgumentsRefuse -> fails: `G1 refuses a
// refspec that begins with +`, `G1 keeps every refusal it made before the second reading`. Observed at
// 71db3d7d with this change, claude --version 2.1.289 (Claude Code).
test('G1 refuses a refspec that begins with +', async ($, on) => {
  const probe = arm(on, {})
  expectRefused(await call($, bash('git push origin +main')), G1_REASON, probe)
})

// RECORDED MUTATION: the `--mirror` check dropped from pushArgumentsRefuse -> fails: `G1 refuses
// --mirror`. Observed at 71db3d7d with this change, claude --version 2.1.289 (Claude Code).
test('G1 refuses --mirror', async ($, on) => {
  const probe = arm(on, {})
  expectRefused(await call($, bash('git push --mirror')), G1_REASON, probe)
})

// RECORDED MUTATION: the `:` refspec check dropped from pushArgumentsRefuse -> fails: `G1 refuses a push
// that deletes a remote ref`. Observed at 71db3d7d with this change, claude --version 2.1.289 (Claude
// Code).
test('G1 refuses a push that deletes a remote ref', async ($, on) => {
  const probe = arm(on, {})
  for (const command of ['git push --delete origin x', 'git push -d origin x', 'git push origin :x', 'git push --prune origin']) {
    expectRefused(await call($, bash(command)), G1_REASON, probe)
  }
})

// RECORDED MUTATION: the nested rescan of a quoted token dropped from readingRefuses (the
// `pushRefused(token.value, depth + 1)` line) -> fails: `G1 finds the push after git global options and
// inside a quoted command string`, `G1 finds a force-push inside a subshell, a substitution, backticks or
// a brace block`. Observed at 71db3d7d with this change, claude --version 2.1.289 (Claude Code).
test('G1 finds the push after git global options and inside a quoted command string', async ($, on) => {
  const probe = arm(on, {})
  for (const command of ['git -C sub -c a=b push -f', 'bash -c "git push --force"']) {
    expectRefused(await call($, bash(command)), G1_REASON, probe)
  }
})

// RECORDED MUTATION: an unbalanced-quote segment that holds `push` read as no push (the
// `text.includes('push')` line dropped) -> fails: `G1 refuses a push segment it cannot tokenise`.
// Observed at 71db3d7d with this change, claude --version 2.1.289 (Claude Code).
test('G1 refuses a push segment it cannot tokenise', async ($, on) => {
  const probe = arm(on, {})
  expectRefused(await call($, bash('git push "origin')), G1_REASON, probe)
})

// RECORDED MUTATION: readingRefuses scanning the whole command as one segment (`for (const text of
// [command])` in place of `splitSegments(command, atGroups)`) -> fails: `G1 allows an ordinary push and a
// force flag that belongs to another command`, `G1 finds a force-push inside a subshell, a substitution,
// backticks or a brace block`. Observed at 71db3d7d with this change, claude --version 2.1.289 (Claude
// Code).
test('G1 allows an ordinary push and a force flag that belongs to another command', async ($, on) => {
  const probe = arm(on, {})
  for (const command of ['git push -u origin b', 'git push && rm -f x', 'git commit -m "push -f"']) {
    const input = bash(command)
    expectPassed(await call($, input), probe, input)
  }
})

// RECORDED MUTATION: the PowerShell registration dropped from register() -> fails: `G1 refuses a
// force-push through the PowerShell tool`, `G1 finds a force-push inside a subshell, a substitution,
// backticks or a brace block`, `G6 refuses every PowerShell call by a report-only subagent and leaves
// other subagents to G1`, `G6 makes no engine call on a main-loop PowerShell call`. Observed at 71db3d7d
// with this change, claude --version 2.1.289 (Claude Code).
test('G1 refuses a force-push through the PowerShell tool', async ($, on) => {
  const probe = arm(on, {})
  expectRefused(await call($, { tool: 'PowerShell', command: 'git push --force' }), G1_REASON, probe)
  const input = { tool: 'PowerShell', command: 'git push -u origin b' }
  expectPassed(await call($, input), probe, input)
})

// RECORDED MUTATION: the second reading dropped from pushRefused (`readingRefuses(command, depth, true)`
// removed, so only the first reading runs) -> fails: `G1 finds a force-push inside a subshell, a
// substitution, backticks or a brace block`. Observed at 71db3d7d with this change, claude --version
// 2.1.289 (Claude Code).
test('G1 finds a force-push inside a subshell, a substitution, backticks or a brace block', async ($, on) => {
  const probe = arm(on, {})
  for (const command of [
    '(git push -f origin main)',
    'x=$(git push --force origin main)',
    'echo `git push -f`',
    'echo "$(git push -f)"',
    'cat <(git push --force)',
  ]) {
    expectRefused(await call($, bash(command)), G1_REASON, probe)
  }
  for (const command of ['& {git push -f}', '$(git push --force)']) {
    expectRefused(await call($, { tool: 'PowerShell', command }), G1_REASON, probe)
  }
})

// RECORDED MUTATION: the first reading dropped from pushRefused (`return readingRefuses(command, depth,
// true)`, so only the second reading runs) -> fails: `G1 keeps every refusal it made before the second
// reading`. Observed at 71db3d7d with this change, claude --version 2.1.289 (Claude Code).
test('G1 keeps every refusal it made before the second reading', async ($, on) => {
  const probe = arm(on, {})
  for (const command of [
    '{ git push -f; }',
    'f() { git push -f; }',
    'sudo git push -f',
    'env GIT_X=1 git push --force',
    'git push origin main --force',
    'git push $(echo -f)',
    'git push origin $(echo +main)',
    'git push `echo -f`',
  ]) {
    expectRefused(await call($, bash(command)), G1_REASON, probe)
  }
})

// RECORDED MUTATION: the second reading refusing every segment that holds git then push, with no argument
// check (in readingRefuses, `segmentPushRefused(tokens)` replaced by `atGroups ? tokens.some((t) =>
// isGit(t.value)) && tokens.some((t) => t.value === 'push') : segmentPushRefused(tokens)`) -> fails: `G1
// allows an ordinary push and a force flag that belongs to another command`, `G1 refuses a force-push
// through the PowerShell tool`, `G1 allows an ordinary push inside a subshell and a substitution that
// does not push`. Observed at 71db3d7d with this change, claude --version 2.1.289 (Claude Code).
test('G1 allows an ordinary push inside a subshell and a substitution that does not push', async ($, on) => {
  const probe = arm(on, {})
  for (const command of [
    '(cd sub && git push -u origin b)',
    'x=$(git rev-parse HEAD) && git push origin "$x"',
    'echo `git log -1`',
    'git commit -m "fix (scope)"',
  ]) {
    const input = bash(command)
    expectPassed(await call($, input), probe, input)
  }
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
// fails: `G6 refuses every Write by an architect run whose brief declares no REPORT PATH`, `G6 refuses
// every PowerShell call by a report-only subagent and leaves other subagents to G1`. Observed at 71db3d7d
// with this change, claude --version 2.1.289 (Claude Code).
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

// RECORDED MUTATION: G6 applied to every listed agent type (the report-only type check dropped) -> fails:
// `G6 leaves other subagents, unlisted agent ids and the main loop to the other rules`, `G6 refuses every
// PowerShell call by a report-only subagent and leaves other subagents to G1`. Observed at 71db3d7d with
// this change, claude --version 2.1.289 (Claude Code).
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

const ps = (command: string) => ({ tool: 'PowerShell', command })

// RECORDED MUTATION: the PowerShell registration's hook set back to `refuseForcePush` (G6 dropped from
// it) -> fails: `G6 refuses every PowerShell call by a report-only subagent and leaves other subagents to
// G1`. Observed at 71db3d7d with this change, claude --version 2.1.289 (Claude Code).
test('G6 refuses every PowerShell call by a report-only subagent and leaves other subagents to G1', async ($, on) => {
  const probe = arm(
    on,
    newFileWorld(['C:\\r\\state\\consults'], {
      agents: [agentRow('a1', 'lead-data'), agentRow('a2', 'architect'), agentRow('a3', 'worker')],
      messages: {
        a1: brief([`REPORT PATH: ${REPORT}`]),
        a2: brief(['Review the draft.']),
      },
    }),
  )
  // A lead-data run's read and its write to its own REPORT PATH, and an architect run with no line.
  expectRefused(await call($, asSubagent(ps('Get-Content C:\\r\\x.md'), 'a1')), G6_REASON, probe)
  expectRefused(await call($, asSubagent(ps(`Set-Content -Path ${REPORT} -Value y`), 'a1')), G6_REASON, probe)
  expectRefused(await call($, asSubagent(ps('Get-Location'), 'a2')), G6_REASON, probe)
  // A worker row and an unlisted id are left to G1.
  const status = ps('git status')
  expectPassed(await call($, asSubagent(status, 'a3')), probe, status)
  expectPassed(await call($, asSubagent(status, 'unlisted')), probe, status)
  const reached = probe.reached.length
  expect((await call($, asSubagent(ps('git push --force'), 'a3'))).deny).toBe(G1_REASON)
  expect(probe.reached.length).toBe(reached)
})

// RECORDED MUTATION: the `agentId` condition dropped from guardPowerShell (`if (true)`), so G6 runs on a
// main-loop call -> fails: `G1 refuses a force-push through the PowerShell tool`, `G1 finds a force-push
// inside a subshell, a substitution, backticks or a brace block`, `G6 makes no engine call on a main-loop
// PowerShell call`. Observed at 71db3d7d with this change, claude --version 2.1.289 (Claude Code).
test('G6 makes no engine call on a main-loop PowerShell call', async ($, on) => {
  // No agent.list, session.messages or fs answer is registered: a `$` call from the hook would throw.
  const probe = arm(on, {})
  const notes = ps('Set-Content C:\\r\\notes.md x')
  expectPassed(await call($, notes), probe, notes)
  expect(probe.stats.length).toBe(0)
  expect(probe.procs.length).toBe(0)
  const reached = probe.reached.length
  expect((await call($, ps('git push -f'))).deny).toBe(G1_REASON)
  expect(probe.reached.length).toBe(reached)
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

// ---------------------------------------------------------------------------------------------
// Guardian v1 (GUARDIAN-V1-PREREGISTRATION.md section 4, with Amendments 2, 4 and 6): T42 to T72.
// The engine's answers for v1 are registered here, after `arm`: the file system (a world that
// resolves every path to itself unless a test says otherwise), the session's repository, and the
// refusal log's write. Declared values are written out, not imported.
// ---------------------------------------------------------------------------------------------

const G7_REASON = "spatial-guardian G7: refused, because a merge is the human's click and an agent never rewrites history."
const G8_REASON =
  "spatial-guardian G8: refused, because installing, enabling or configuring plugins, marketplaces, MCP servers or the user's Claude settings is the human's own act."
const G9_REASON = "spatial-guardian G9: refused, because the main checkout's target holds fixtures and evidence and is never cleaned wholesale."

const lines = (...rows: string[]) => rows.join('\n')

type Answer = string | { deny: string } | undefined
type Vfs = { missing?: string[]; links?: Record<string, string>; denied?: string[] }

// A path with its slashes read as / and its dots resolved, its case kept.
function dots(path: string): string {
  const out: string[] = []
  for (const part of path.replace(/\\/g, '/').replace(/\/+$/, '').split('/')) {
    if (part === '..') out.pop()
    else if (part !== '.') out.push(part)
  }
  return out.join('/')
}

// A file system where every path exists and resolves to itself, except the ones the world names:
// missing (ENOENT), denied (EACCES) and links (a path that resolves elsewhere). Names match at and
// under the path, whatever the case or the slashes.
function vfs(world: Vfs = {}): (path: string) => Answer {
  const key = (path: string) => dots(path).toLowerCase()
  const missing = (world.missing ?? []).map(key)
  const denied = (world.denied ?? []).map(key)
  const links = Object.entries(world.links ?? {}).map(([from, to]) => [key(from), dots(to)] as const)
  const at = (names: string[], n: string) => names.some((name) => n === name || n.startsWith(`${name}/`))
  return (path) => {
    const n = key(path)
    if (at(denied, n)) return { deny: 'EACCES: permission denied' }
    if (at(missing, n)) return undefined
    for (const [from, to] of links) if (n === from || n.startsWith(`${from}/`)) return to + dots(path).slice(from.length)
    return dots(path)
  }
}

// Answers fs.stat from `fn`; returns the paths asked.
function answerStat(on: any, fn: (path: string) => Answer): string[] {
  const asked: string[] = []
  on('fs.stat', async ($: any, e: any) => {
    asked.push(e.path)
    const real = fn(e.path)
    if (real === undefined) return { deny: 'ENOENT: no such file or directory' }
    if (typeof real === 'object') return { deny: real.deny }
    return { value: { kind: 'file', size: 1, mtimeMs: 0, isLink: false, realPath: real } }
  })
  return asked
}

type Repo = { root: string; remote: string | null; internal: boolean } | null | 'reject'
const REPO: Repo = { root: 'C:/r', remote: null, internal: false }

// Answers session.repo from `get`, read at each call.
function answerRepo(on: any, get: () => Repo = () => REPO) {
  on('session.repo', async () => {
    const repo = get()
    return repo === 'reject' ? { deny: 'repository lookup rejected' } : { value: repo }
  })
}

// Answers fs.write; returns every write attempted, in order.
function answerWrites(on: any, rejects: () => boolean = () => false): { path: string; text: string }[] {
  const attempts: { path: string; text: string }[] = []
  on('fs.write', async ($: any, e: any) => {
    attempts.push({ path: e.path, text: e.text })
    return rejects() ? { deny: 'write rejected' } : { value: undefined }
  })
  return attempts
}

// The usual v1 world: this repository at C:/r, and every path existing unless `files` says otherwise.
function v1(on: any, world: World = {}, files: Vfs = {}) {
  const probe = arm(on, world)
  answerRepo(on)
  answerStat(on, vfs(files))
  return probe
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

type Input = Record<string, unknown>

// Each row is refused with `reason`, and none reaches the engine's tool. A failure names its row.
async function allRefused($: any, probe: Probe, rows: string[], reason: string, make: (row: string) => Input = bash) {
  for (const row of rows) {
    const before = probe.reached.length
    const result = await call($, make(row))
    expect([row, result.deny]).toEqual([row, reason])
    expect(probe.reached.length).toBe(before)
  }
}

// Each row reaches the engine's tool unchanged. A failure names its row.
async function allPassed($: any, probe: Probe, rows: string[], make: (row: string) => Input = bash) {
  for (const row of rows) {
    const input = make(row)
    const result = await call($, input)
    expect([row, result.deny]).toEqual([row, undefined])
    expectPassed(result, probe, input)
  }
}

const write = (file_path: string): Input => ({ tool: 'Write', file_path, content: 'x' })
const edit = (file_path: string): Input => ({ tool: 'Edit', file_path, old_string: 'a', new_string: 'b' })
const notebook = (notebook_path: string): Input => ({ tool: 'NotebookEdit', notebook_path, cell_id: 'c1', new_source: 'y' })

// ---- G1 -------------------------------------------------------------------------------------

// F36: P0 section 6's six recorded over-refusals, byte-copied by script from the transcripts and
// <profile>-redacted. The sha256 of each (UTF-8, no trailing newline) is Amendment 1 (P0b)'s table.
const F36 = [
  "git fetch -q origin && git status -sb | head -1 && git commit -s -q -F - <<'EOF'\ndocs(state): #170's gate-2 architect PASS filed (gate-log 384; no S1, no S2; read a byte-exact export of the head); the block flushed\n\nCo-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01JeU7h98xrTorztiep3Zgmg\nEOF\ngit push -q origin main && git log --oneline -1 | cut -c1-100",
  "S=\"<profile>/AppData/Local/Temp/claude/C--dev-spatial-ide/874d0083-a9e4-4662-82dc-77d80de1259a/scratchpad/recorder-p0\"; cat > \"$S/probe-recorder/test/recorder.test.ts\" <<'EOF'\n// Throwaway P0 probe tests (never installed). Each test answers the engine's events beneath the plugin.\nimport { test, expect } from 'claude-code/testing'\n\nconst APPROVED = 'cargo test --workspace --locked'\nconst OTHER = 'ls -la'\n\n// What a real engine answers for a Bash call, as core sets it: { ref, result, text } (+ isReadOnly).\nconst ANSWER = {\n  ref: 7,\n  result: { stdout: 'test result: ok. 3 passed\\n', stderr: 'warning: x\\n', interrupted: false },\n  text: 'test result: ok. 3 passed\\n',\n}\nconst ERRORED = { ref: 8, isError: true, result: 'Exit code 101\\n...', text: 'Exit code 101\\n...' }\n\nfunction world(on: any, bottom: unknown, opts: { git?: 'ok' | 'timeout' | 'throw' } = {}) {\n  const writes: string[] = []\n  const gitSeen: any[] = []\n  on('tool.call', async () => bottom)\n  on('session.root', async () => ({ value: 'C:/dev/spatial-ide' }))\n  on('fs.exists', async () => ({ value: false }))\n  on('fs.read', async () => ({ deny: 'ENOENT' }))\n  on('fs.write', async ($: any, e: any) => { writes.push(e.text); return { value: undefined } })\n  on('process.run', async ($: any, e: any) => {\n    gitSeen.push(e)\n    if (opts.git === 'timeout') return { deny: 'timed out after 2000 ms' }\n    if (opts.git === 'throw') throw new Error('boom')\n    return { value: { exitCode: 0, stdout: 'M x\\0', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }\n  })\n  return { writes, gitSeen }\n}\n\ntest('Q1 pass-through: an approved command result deep-equals the engine answer', async ($, on) => {\n  const w = world(on, ANSWER)\n  const r = await $.tool.call({ tool: 'Bash', command: APPROVED })\n  expect(r).toEqual(ANSWER)\n  expect(w.writes.length).toBe(1)\n  expect(w.gitSeen[0].argv).toEqual(['git', '--no-optional-locks', 'status', '--porcelain=v1', '-z'])\n  expect(w.gitSeen[0].timeoutMs).toBe(2000)\n})\n\ntest('Q1 pass-through: an errored result and an other command deep-equal the engine answer', async ($, on) => {\n  const w = world(on, ERRORED)\n  expect(await $.tool.call({ tool: 'Bash', command: APPROVED })).toEqual(ERRORED)\n  expect(await $.tool.call({ tool: 'Bash', command: OTHER })).toEqual(ERRORED)\n  expect(w.gitSeen.length).toBe(1) // only the approved one made a git call\n})\n\ntest('Q1 pass-through: a failing git leaves the result unchanged and records the failure shape', async ($, on) => {\n  for (const mode of ['timeout', 'throw'] as const) {\n    const w = world(on, ANSWER, { git: mode })\n    const r = await $.tool.call({ tool: 'Bash', command: APPROVED })\n    expect(r).toEqual(ANSWER)\n    console.log(`Q4 git ${mode}: hook saw ${w.writes[0]}`)\n    break\n  }\n})\n\ntest('Q2 turn.complete: a subagent turn carries agentId and usage into the hook', async ($, on) => {\n  const writes: string[] = []\n  on('turn.complete', async (_$: any, e: any) => ({ text: e.answer, usage: e.usage }))\n  on('agent.list', async () => ({ value: [{ id: 'ag1', description: 'd', type: 'Explore', status: 'completed' }] }))\n  on('fs.exists', async () => ({ value: false }))\n  on('fs.write', async (_$: any, e: any) => { writes.push(e.text); return { value: undefined } })\n  const usage = { input_tokens: 10, output_tokens: 20, cache_read_input_tokens: 30, cache_creation_input_tokens: 40, model: 'm' }\n  const r = await $.turn.complete({ answer: 'done', durationMs: 5, isAborted: false, turnId: 't1', agentId: 'ag1', usage, reason: 'answer' })\n  expect(r).toEqual({ text: 'done', usage })\n  expect(writes.length).toBe(1)\n  console.log('Q2 line: ' + writes[0])\n})\n\ntest('Q2 turn.complete: the main loop writes nothing; an unlisted agent reads unavailable', async ($, on) => {\n  const writes: string[] = []\n  on('turn.complete', async (_$: any, e: any) => ({ text: e.answer }))\n  on('agent.list', async () => ({ value: [] }))\n  on('fs.exists', async () => ({ value: false }))\n  on('fs.write', async (_$: any, e: any) => { writes.push(e.text); return { value: undefined } })\n  await $.turn.complete({ answer: 'x', durationMs: 1, isAborted: false, turnId: 't', reason: 'answer' })\n  expect(writes.length).toBe(0)\n  await $.turn.complete({ answer: 'x', durationMs: 1, isAborted: false, turnId: 't2', agentId: 'ghost', reason: 'answer' })\n  console.log('Q2 unlisted line: ' + writes[0])\n})\n\nconst GUARD = {\n  name: 'guard',\n  register(on: any) {\n    on('tool.call', { tool: 'Bash' }, ($: any, e: any, next: any) => (e.command.includes('FORBID') ? { deny: 'guard: refused' } : next(e)))\n  },\n}\n\nfor (const guardTier of ['prepend', 'user', 'append'] as const) {\n  test(`Q6 chain: guard in tier ${guardTier}, a refused approved command`, { plugins: [{ ...GUARD, tier: guardTier }] }, async ($, on) => {\n    const w = world(on, ANSWER)\n    const r = await $.tool.call({ tool: 'Bash', command: APPROVED + ' FORBID' })\n    console.log(`Q6 tier=${guardTier}: reply=${JSON.stringify(r)} recorderLines=${w.writes.length} gitCalls=${w.gitSeen.length} line=${w.writes[0] ?? '-'}`)\n    expect(true).toBe(true)\n  })\n}\nEOF\ncd \"$S\" && timeout 120 claude plugin test probe-recorder 2>&1 | sed 's#<profile>\\\\AppData\\\\Local\\\\Temp\\\\claude\\\\C--dev-spatial-ide\\\\874d0083-a9e4-4662-82dc-77d80de1259a\\\\scratchpad\\\\recorder-p0#<probe-dir>#g'; echo rc=${PIPESTATUS[0]}",
  "S=\"<profile>/AppData/Local/Temp/claude/C--dev-spatial-ide/874d0083-a9e4-4662-82dc-77d80de1259a/scratchpad\" && T=$(date -u +%Y-%m-%dT%H:%MZ) && cat > \"$S/ledger28.md\" <<EOF\n- $T - **Guardian v0 is INSTALLED by the human** at user scope (install record 11:28:29Z; plugins reloaded in this session, 11:31:18Z). **The E-rows are recorded** as the form's Amendment 8 (class 1), on main.\n  - **E0:** \\`claude plugin list\\` shows the mod enabled at user scope, Read from the repository folder. A byte-identical copy sits in the user's plugin cache. Treated as a reference until settled.\n  - **E1 to E3:** refused with G2, G4 and G3's reasons, as predicted; bytes unchanged.\n  - **E4:** the new-file Write passed, as predicted.\n  - **E5:** the lead-data probe's Write outside its REPORT PATH was refused by G6, as predicted; its write audit VOID is the probe's.\n  - **E6:** not fired.\n  - **I2 fires:** this session's process predates 2.1.289, so E1 to E5 ran under the 2.1.288 engine. The I2 re-run at 2.1.289 shows plugin test 39 of 39 and validate exit 0 on both targets. The write audit stays primary, the custodian's reading, for the human.\n  - **An unplanned live G1 over-refusal (not a probe), 11:33:53Z:** an apostrophe in a heredoc commit message left the later plain push in an unbalanced segment. Nothing ran. The commit and push ran as two calls, and the plain push passed.\nEOF\ncat \"$S/ledger28.md\" >> state/CUT-STATE.md && cat > \"$S/flush28.json\" <<EOF\n{\"position\":\"$T: session 874d0083 is custodian. GUARDIAN-V0 DONE and INSTALLED by the human (user scope, 11:28:29Z; reloaded in this session). E-rows recorded as Amendment 8: E0-E5 as predicted under the 2.1.288 session engine (I2 fired; I2 re-run at 2.1.289 39/39, validate 0); E6 pending (N1 at 80%); one unplanned G1 over-refusal (apostrophe in a heredoc plus a later push: commit and push in separate calls, no apostrophes in heredocs holding push). NODE 10 #170 (generation 4): gate 2 architect PASS (gate-log 384); gate 2 reviewer running at 3074e9a0. EVIDENCE-RECORDER-V0: P0 worker running (report to scratchpad).\",\"half-made judgments\":\"(1) NOTE FOR THE HUMAN (not editable here): docs/adr/ADR-029-scan-progress-carrier-quantity.md line 84 cites the cancel states at SKP-V0.md:97; they are at :114 (node 7 consult, point 8). (2) STANDING RULE from 2026-09-30 (PORTABILITY-2026-09-30.md section 2): apply R1-R6 to new and materially changed work. (3) P-034: a test-only prerequisite node is placed without a question round; report each use (none this session). (4) Generations (AUTONOMY section 15): bump on any preregistration amendment. (5) The record cap: two record-correction rounds per piece, then the architect reduces. (6) A five-line form declares at most 150 changed lines, tests included (section 21c). (7) Reports: reviewers have no Write tool, so a reviewer brief permits the shell write of its one report path; architect reports arrive as messages and are saved from the hand-back. The tracked write audit audits every lead-data and architect run; pass the report path ABSOLUTE. (8) Any force-push needs typed approval; red-line AskUserQuestion items are holds only, ruled in typed words. (9) Ledger stamps from date -u only. (10) GUARDIAN IS LIVE in this session: G1 refuses a Bash call whose text leaves a quote open before a push (keep commit and push separate; no apostrophes in heredocs of push-holding calls); G2-G4 refuse Edit/Write on docs/01, existing directives, accepted ADRs and filed preregistrations except pure appends; G6 refuses lead-data/architect/evidence-reader writes outside the single REPORT PATH: line of their brief, so every lead-data brief carries exactly one REPORT PATH: line. (11) The plugin-authoring skill is loaded in session 874d0083, so the engine watches its dev-mods folder under the user .claude directory: never write there. (12) For the window: AUTONOMY.md section 21a labels ADR-021 bundling/no-runtime-fetch; ADR-021 is the row filter and bundling is ADR-017. (13) The installed Guardian reads from tools/mods/spatial-guardian in the main checkout (E0): a commit there changes the live guard at the next reload.\"}\nEOF\nnode scripts/hooks/flush.mjs --json \"$S/flush28.json\" && git add tools/mods/GUARDIAN-V0-PREREGISTRATION.md state/CUT-STATE.md && git status --porcelain",
  "SD=\"<profile>/AppData/Local/Temp/claude/C--dev-spatial-ide/128d8fa3-d9ec-4243-88f6-28712bd74344/scratchpad/recorder-v01-p0\"; mkdir -p $SD/timing; cat > $SD/timing/gittime.mjs <<'EOF'\n// usage: node gittime.mjs <cwd> <runs> <label>   (the hook's git calls, via spawn, no shell, concurrently as register.js issues them)\nimport { spawn } from 'node:child_process';\nconst [cwd, runsArg, label] = process.argv.slice(2);\nconst runs = Number(runsArg);\nfunction git(args) {\n  return new Promise((resolve) => {\n    const t0 = performance.now();\n    const c = spawn('git', ['--no-optional-locks', ...args], { cwd, shell: false, stdio: ['ignore', 'pipe', 'pipe'] });\n    let bytes = 0; c.stdout.on('data', (d) => { bytes += d.length; }); c.stderr.resume();\n    c.on('close', (code) => resolve({ ms: performance.now() - t0, code, bytes }));\n    c.on('error', () => resolve({ ms: performance.now() - t0, code: 'spawn-error', bytes }));\n  });\n}\nconst BEFORE = [['rev-parse', '--show-toplevel', 'HEAD'], ['status', '--porcelain=v1', '-z'], ['diff', 'HEAD', '--binary']];\nconst AFTER = [['status', '--porcelain=v1', '-z'], ['diff', 'HEAD', '--binary'], ['rev-parse', 'HEAD']];\nconst ROOT = ['rev-parse', '--path-format=absolute', '--git-common-dir'];\nasync function triple(set) { const t0 = performance.now(); const r = await Promise.all(set.map(git)); return { wall: performance.now() - t0, calls: r }; }\nconst q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)]; };\nconst st = (a) => `min ${Math.min(...a).toFixed(0)} p50 ${q(a, .5).toFixed(0)} p95 ${q(a, .95).toFixed(0)} max ${Math.max(...a).toFixed(0)}`;\nconst bw = [], aw = [], rw = [], per = { revparse: [], status: [], diff: [] }; const codes = new Set();\nfor (let i = 0; i < runs; i++) {\n  const b = await triple(BEFORE); bw.push(b.wall); b.calls.forEach((c) => codes.add(c.code));\n  per.revparse.push(b.calls[0].ms); per.status.push(b.calls[1].ms); per.diff.push(b.calls[2].ms);\n  const a = await triple(AFTER); aw.push(a.wall);\n  rw.push((await git(ROOT)).ms);\n}\nconsole.log(`${label} (n=${runs}, exit codes ${[...codes].join(',')})`);\nconsole.log(`  before-triple wall ms: ${st(bw)}   [first run ${bw[0].toFixed(0)}]`);\nconsole.log(`  after-triple wall ms:  ${st(aw)}   [first run ${aw[0].toFixed(0)}]`);\nconsole.log(`  root lookup ms:        ${st(rw)}`);\nconsole.log(`  per call in before: rev-parse ${st(per.revparse)} | status ${st(per.status)} | diff ${st(per.diff)}`);\nEOF\ncd $SD/timing && timeout 300 node gittime.mjs C:/dev/spatial-ide 20 \"main checkout, warm\"",
  "cd C:/dev/wt/rec01/tools/mods/spatial-evidence-recorder/test && cat > \"<profile>/AppData/Local/Temp/claude/C--dev-spatial-ide/128d8fa3-d9ec-4243-88f6-28712bd74344/scratchpad/edit-tests-1.mjs\" <<'EOF'\nimport { readFileSync, writeFileSync } from 'node:fs';\nconst f = 'recorder.test.ts';\nlet s = readFileSync(f, 'utf8');\nfunction rep(a, b) {\n  const i = s.indexOf(a);\n  if (i < 0) throw new Error('missing: ' + a.slice(0, 60));\n  if (s.indexOf(a, i + 1) >= 0) throw new Error('not unique: ' + a.slice(0, 60));\n  s = s.slice(0, i) + b + s.slice(i + a.length);\n}\nrep(\n`// to T20), run by \\`claude plugin test tools/mods/spatial-evidence-recorder\\`. A test answers the`,\n`// to T20; v0.1's T21 to T28 are EVIDENCE-RECORDER-V0-1-PREREGISTRATION.md sections 3 and 4 and its\n// Amendments 1 and 2), run by \\`claude plugin test tools/mods/spatial-evidence-recorder\\`. A test answers the`);\nrep(`import { test, expect } from 'claude-code/testing'`, `import { test, expect, mock } from 'claude-code/testing'`);\nrep(\n`  waiters: Array<() => void>\n  timer?: any\n}`,\n`  waiters: Array<() => void>\n  timer?: any\n  clock: any // the mock clock beneath \\`$.clock\\`, when armed\n  sleeps: number[] // the \\`ms\\` of every \\`$.clock.sleep\\` the hook asked for\n  late: boolean // the before-side git answers wait for \\`lateGate\\`\n  lateGate?: Promise<void>\n  pending: number // before-side answers waiting on \\`lateGate\\`\n  onThree?: () => void\n  reached: number // how many times the bottom \\`tool.call\\` stub ran\n  writeDelayMs: number // how long \\`fs.write\\` takes to resolve\n}`);\nrep(\n`function arm(on: any, init: Partial<World> = {}): World {\n  const w: World = {`,\n`// \\`clock\\` 'mock' arms the kit's mock clock beneath \\`$.clock\\` (an unarmed \\`$.clock.sleep\\` throws at the\n// kit's bottom hook) and counts each sleep the hook asks for; 'rejecting' answers \\`$.clock.sleep\\` itself\n// with a refusal and arms no clock.\nfunction arm(on: any, init: Partial<World> = {}, clock: 'mock' | 'rejecting' = 'mock'): World {\n  const w: World = {`);\nrep(\n`    waiters: [],\n    ...init,\n  }\n  on('tool.call', async () => {\n    w.during?.(w.tree)`,\n`    waiters: [],\n    clock: undefined,\n    sleeps: [],\n    late: false,\n    pending: 0,\n    reached: 0,\n    writeDelayMs: 0,\n    ...init,\n  }\n  if (clock === 'mock') {\n    w.clock = mock.clock(on)\n    on('clock.sleep', async (_$: any, e: any, next: any) => {\n      w.sleeps.push(e.ms)\n      return w.rejectAll ? { deny: 'rejected' } : next(e)\n    })\n  } else {\n    on('clock.sleep', async (_$: any, e: any) => {\n      w.sleeps.push(e.ms)\n      return { deny: 'rejected' }\n    })\n  }\n  on('tool.call', async () => {\n    w.reached += 1\n    w.during?.(w.tree)`);\nrep(\n`    w.writes.push({ path: String(e.path).split(String.fromCharCode(92)).join('/'), text: e.text })\n    return`,\n`    w.writes.push({ path: String(e.path).split(String.fromCharCode(92)).join('/'), text: e.text })\n    if (w.writeDelayMs > 0) await new Promise<void>((resolve) => setTimeout(resolve, w.writeDelayMs))\n    return`);\nrep(\n`    return result({})\n  })\n  return w`,\n`    if (w.late && w.phase === 'before' && !common) {\n      w.pending += 1\n      if (w.pending === 3) w.onThree?.()\n      await w.lateGate\n    }\n    return result({})\n  })\n  return w`);\nrep(\n`  'schema', 'kind', 'agent_id', 'agent_type', 'command', 'started_at', 'ended_at', 'tree_basis', 'toplevel', 'head', 'head_after',\n  'before', 'after', 'tree_changed_during_run', 'tool_is_error', 'interrupted', 'stdout', 'stderr', 'text', 'recorder_ms',\n]`,\n`  'schema', 'kind', 'agent_id', 'agent_type', 'command', 'started_at', 'ended_at', 'tree_basis', 'toplevel', 'head', 'head_after',\n  'before', 'after', 'tree_changed_during_run', 'tool_is_error', 'interrupted', 'stdout', 'stderr', 'text', 'recorder_ms',\n  'before_ceiling_reached', 'previous_write',\n]`);\nrep(\n`  expect(JSON.stringify(r)).not.toContain(UNAVAILABLE)\n  const iso`,\n`  expect(JSON.stringify({ ...r, previous_write: undefined })).not.toContain(UNAVAILABLE) // the first write of a load has no previous one\n  const iso`);\nrep(`[r.schema, r.kind, r.agent_id, r.agent_type, r.command]).toEqual(['spatial-evidence-recorder/v0', 'run', 'main', 'main', CARGO])`,\n    `[r.schema, r.kind, r.agent_id, r.agent_type, r.command]).toEqual(['spatial-evidence-recorder/v0.1', 'run', 'main', 'main', CARGO])`);\nrep(`['spatial-evidence-recorder/v0', 'usage', 'ag1', 'Explore', 't1', USAGE]`, `['spatial-evidence-recorder/v0.1', 'usage', 'ag1', 'Explore', 't1', USAGE]`);\nwriteFileSync(f, s);\nconsole.log('ok');\nEOF\nnode \"<profile>/AppData/Local/Temp/claude/C--dev-spatial-ide/128d8fa3-d9ec-4243-88f6-28712bd74344/scratchpad/edit-tests-1.mjs\" && git diff --stat",
  "S=\"<profile>/AppData/Local/Temp/claude/C--dev-spatial-ide/128d8fa3-d9ec-4243-88f6-28712bd74344/scratchpad/guardian-v1-p0\"; cd $S/harness; cat > opener.mjs <<'EOF'\n// Replicates register.js splitSegments' quote-state loop (lines 58-97 of the committed file) to find where the\n// final unclosed quote opened. Probe only; the committed module is not touched.\nimport fs from 'node:fs';\nconst here = new URL('.', import.meta.url);\nfor (let i = 1; i <= 5; i++) {\n  const command = fs.readFileSync(new URL(`../g1-cmd-${i}.txt`, here), 'utf8');\n  let quote = null, qStart = -1, current = '';\n  const opens = [];\n  for (let k = 0; k < command.length; k++) {\n    const ch = command[k];\n    if (quote === \"'\") { if (ch === \"'\") quote = null; continue; }\n    if (quote === '\"') {\n      if (ch === '\\\\' && k + 1 < command.length) { k += 1; } else if (ch === '\"') quote = null;\n      continue;\n    }\n    if (ch === \"'\" || ch === '\"') { quote = ch; qStart = k; opens.push([k, ch]); continue; }\n    if (ch === '\\\\' && k + 1 < command.length) { k += 1; continue; }\n    if (ch === ';' || ch === '|' || ch === '&' || ch === '\\n' || ch === '\\r') { quote = quote; if ((ch === '&' || ch === '|') && command[k + 1] === ch) k += 1; continue; }\n  }\n  const line = command.slice(0, qStart).split('\\n').length;\n  const ctx = command.slice(Math.max(0, qStart - 30), qStart + 40).replace(/\\n/g, '\\\\n');\n  console.log(`cmd ${i}: final state ${quote === null ? 'closed' : 'open ' + quote}; the open quote starts at byte ${qStart}, line ${line}; context: ${JSON.stringify(ctx)}`);\n}\nEOF\ntimeout 30 node opener.mjs"
]
const F36_SHA256 = [
  'c9f9440438ec5d01e4f6dab7cc68dac0988e021e950db2bb5d6fddd822d956e3',
  '2369f91acd3ea4ba445bbedd0d632ced2f1a8da6cf5f1b094695f2333fd0c916',
  '6fcb389a4ca9d65bb798812884b0d209bb39c366850bf0e9844387d4f6eada06',
  '3c39fcb25eb1a39f97235f3757f4d333a0ade73fac789174290266270ecbc910',
  '5fe9003e6d7961e48814b905d40170c3110fb0292087ba25996a9572abbce751',
  '3f077a2aac0a4792254e3972ffe85cb2295472e1fb14bb7f956f654f1119049d',
]

// RECORDED MUTATION: the scan condition dropped from the unbalanced-quote rule, and (ii) with it (the
// `&& (g1Sequence(whole) || pushBeforeOpenQuote(text, openAt))` conjunct removed), which restores v0's
// rule -> OBSERVATION-T42
test('G1 allows the six recorded over-refusals', async ($, on) => {
  const probe = v1(on)
  for (const [i, command] of F36.entries()) expect(await sha256(command)).toBe(F36_SHA256[i])
  await allPassed($, probe, F36)
})

// F37: N1, push only inside a longer word; N2, a plain git push after a heredoc whose body holds an
// apostrophe; N3, push with no git word before it.
const F37 = [
  lines("git add -A && cat > a.js <<'EOF'", "// don't", "opts.push('-f')", 'EOF'),
  lines("git commit -F - <<'EOF'", "it's done", 'EOF', 'git push -q origin main'),
  lines("cat >> n.md <<'EOF'", "the custodian's plain push --force ran", 'EOF'),
]

// RECORDED MUTATION: the scan also breaks words at `.` (callWords' break set gains `.`) -> OBSERVATION-T43
test('G1 allows push inside a longer word, a plain push after an odd quote, and push with no git before it', async ($, on) => {
  const probe = v1(on)
  await allPassed($, probe, F37)
})

// F1 to F7, F30 and F31, v0's refusals, and F38: a force or delete spelling after an odd quote, or in a
// heredoc body, or in a quoted line that is never run.
const F38 = [
  lines("cat > n.md <<'EOF'", "it's", 'git push --force origin main', 'EOF'),
  lines("git commit -F - <<'EOF'", "#170's note", 'EOF', 'git push -f origin main'),
  lines("bash <<'EOF'", "# don't", 'git push origin :old', 'EOF'),
  lines('cat <<EOF', "it's", '$(git push --delete origin x)', 'EOF'),
  lines("git commit -F - <<'EOF'", "don't run git push --force", 'EOF'),
  lines("git commit -F - <<'EOF'", "it's done", 'EOF', 'git push -q origin main && date -u +%H:%M'),
]

// RECORDED MUTATION: the scan's forcing test reads only `--force` and `-f` (g1Sequence tests each word with
// `word === '--force' || word === '-f'` in place of pushArgumentsRefuse) -> OBSERVATION-T44
test('G1 still refuses every force or delete spelling, after an odd quote and inside a heredoc body', async ($, on) => {
  const probe = v1(on)
  const v0 = [
    'git push --force',
    'git push -f',
    'git push -uf origin x',
    'git push --force-with-lease',
    'git push --force-with-lease=main:abc',
    'git push origin +main',
    'git push --mirror',
    'git push --delete origin x',
    'git push -d origin x',
    'git push origin :x',
    'git push --prune origin',
    'git -C sub -c a=b push -f',
    'bash -c "git push --force"',
    'git push "origin',
    '(git push -f origin main)',
    'x=$(git push --force origin main)',
    'echo `git push -f`',
    'echo "$(git push -f)"',
    'cat <(git push --force)',
    '{ git push -f; }',
    'f() { git push -f; }',
    'sudo git push -f',
    'env GIT_X=1 git push --force',
    'git push origin main --force',
    'git push $(echo -f)',
    'git push origin $(echo +main)',
    'git push `echo -f`',
  ]
  await allRefused($, probe, [...v0, ...F38], G1_REASON)
  await allRefused($, probe, ['& {git push -f}', '$(git push --force)'], G1_REASON, ps)
})

// F39: a plain push nested in quoted bash -c strings, built level by level. Past MAX_RESCAN_DEPTH (4) the
// depth cap refuses without the scan.
const nest = (command: string, levels: number) => {
  let text = command
  for (let n = 0; n < levels; n++) text = `bash -c "${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  return text
}

// RECORDED MUTATION: the scan condition applied at the depth cap (`if (depth >= MAX_RESCAN_DEPTH) return true`
// becomes `return rule === G1_RULE ? g1Sequence(whole) : true`) -> OBSERVATION-T45
test("G1's depth cap still refuses without the scan", async ($, on) => {
  const probe = v1(on)
  await allPassed($, probe, [nest('git push origin main', 1), nest('git push origin main', 4)])
  await allRefused($, probe, [5, 6, 7].map((levels) => nest('git push origin main', levels)), G1_REASON)
})

// ---- G7 -------------------------------------------------------------------------------------

const F40 = [
  'gh pr merge 138 --merge',
  'gh pr merge --help',
  'gh -R o/r pr merge 1 --squash',
  'gh pr --repo o/r merge 1',
  'git rebase origin/main',
  'git -C x rebase -i HEAD~2',
  'git rebase --abort',
  'git merge --squash f',
  'git merge --sq f',
  'git pull --rebase origin main',
  'git pull --rebase=merges',
  'git pull -r',
  'git pull -qr',
  'git pull --reb',
  'sudo git rebase main',
  '(git rebase main)',
  'x=$(gh pr merge 1)',
  'node scripts/evidence/repeat.mjs 2 -- git rebase main',
  'bash -c "git rebase main"',
  lines("cat <<'EOF'", "it's", 'EOF', 'git rebase main'),
]

// RECORDED MUTATION: git pull's short-option cluster check dropped (isRebaseWord's
// `/^-[A-Za-z]+$/.test(arg) && arg.includes('r')` line) -> OBSERVATION-T46
test('G7 refuses agent merges and history rewrites in every declared spelling', async ($, on) => {
  const probe = v1(on)
  await allRefused($, probe, F40, G7_REASON)
  await allRefused($, probe, ['git rebase main'], G7_REASON, ps)
})

const F41 = [
  'gh pr view 138',
  'gh pr list',
  'gh pr create --title t --body "merge commit, not a squash or rebase"',
  'gh api repos/o/r --jq .allow_rebase_merge',
  'git merge origin/main',
  'git merge --no-ff origin/main',
  'git pull -q --ff-only',
  'git pull -q',
  'git pull --no-rebase',
  'git log --grep rebase',
  'git config --get pull.rebase',
  lines("cat <<'EOF'", "it's merged", 'EOF', 'git pull -q'),
]

// RECORDED MUTATION: git merge refused without its squash check (gitRewrites returns true for every merge) ->
// OBSERVATION-T47
test('G7 allows plain pulls, merge commits, pull-request reads and text that names a rebase', async ($, on) => {
  const probe = v1(on)
  await allPassed($, probe, F41)
})

// ---- G8 -------------------------------------------------------------------------------------

const F42_COMMANDS = [
  'claude plugin install spatial-guardian@spatial-ide-mods --scope user',
  'claude plugin install --help',
  'claude plugin uninstall x',
  'claude plugin enable x',
  'claude plugin disable x --scope user',
  'claude plugin update x',
  'claude plugin marketplace add C:/r/tools/mods',
  'claude plugin marketplace remove x',
  'claude plugin marketplace update',
  'claude mcp add x -- c',
  'claude mcp remove x',
  'claude plugins install x',
  'claude plugin i x',
  'claude plugin marketplace rm x',
]

// RECORDED MUTATION: `add` and `remove` dropped from the action words (both lists, and the MCP words that
// begin `add`) -> OBSERVATION-T48
test('G8 refuses plugin, marketplace and MCP changes on the command line', async ($, on) => {
  const probe = v1(on)
  await allRefused($, probe, F42_COMMANDS, G8_REASON)
})

// RECORDED MUTATION: a case-sensitive compare against H (the placed path is compared with its case kept) ->
// OBSERVATION-T49
test("G8 refuses a write at the user folder's settings, plugins, skills, agents, commands and hooks, in every spelling", async ($, on) => {
  const probe = v1(on, { agents: [agentRow('a1', 'worker')] })
  await allRefused($, probe, ['C:\\u\\.claude\\settings.json'], G8_REASON, write)
  await allRefused($, probe, ['c:/U/.Claude/settings.local.json'], G8_REASON, edit)
  await allRefused(
    $,
    probe,
    [
      'C:\\u\\.claude\\plugins\\x\\y.json',
      'C:\\u\\.claude\\skills\\s\\SKILL.md',
      'C:\\u\\.claude\\agents\\a.md',
      'C:\\u\\.claude\\commands\\c.md',
      'C:\\u\\.claude\\hooks\\h.js',
    ],
    G8_REASON,
    write,
  )
  await allRefused($, probe, ['C:\\u\\.claude\\skills\\n.ipynb'], G8_REASON, notebook)
  const refused = await call($, asSubagent(write('C:\\u\\.claude\\agents\\a.md'), 'a1'))
  expect(refused.deny).toBe(G8_REASON)
})

const F43_COMMANDS = [
  'claude plugin list',
  'claude plugin validate tools/mods',
  'claude plugin test tools/mods/spatial-guardian',
  'claude plugin --help',
  'claude mcp list',
  'claude --version',
  'cat >> C:/u/.claude/projects/p/memory/x.md',
]

// RECORDED MUTATION: G8 anchored on a `/.claude/` segment followed by a location name (the user folder's H
// replaced by a match on that segment anywhere in the path) -> OBSERVATION-T50
test("G8 allows plugin reads, the user folder's projects and the repository's .claude folders", async ($, on) => {
  const probe = v1(on)
  await allPassed($, probe, F43_COMMANDS)
  await allPassed($, probe, ['C:\\u\\.claude\\projects\\p\\memory\\MEMORY.md', 'C:\\u\\.claude\\pluginsx.md', 'C:\\r\\.claude\\agents\\worker.md'], write)
  await allPassed($, probe, ['C:\\r\\.claude\\settings.json', 'C:\\r\\.claude\\worktrees\\w\\x.js'], edit)
})

// ---- G9 -------------------------------------------------------------------------------------

const F44 = [
  'cargo clean',
  'cargo clean --dry-run',
  'cargo clean --release',
  'cd C:/dev/wt/x && cargo clean',
  'cd C:/dev/wt/x && CARGO_TARGET_DIR=C:/r/target cargo clean',
  'cargo clean --target-dir C:/r/target',
  'git clean -fdx',
  'cd C:/r && git clean -f',
  'git -C C:/r clean -fd',
  'rm -rf target',
  'rm -rf C:/r/target',
  'rm -r C:\\r\\target\\slice-evidence',
  'rm -rf /c/r/target/fixtures',
  'rm -rf target/*',
  'rm -rf *',
  'cd C:/dev/wt/x; rm -rf target',
  'cd C:/dev/wt/x && echo a | rm -rf target',
  'ri -r target',
  'cmd /c rd /s /q target',
  'node scripts/evidence/repeat.mjs 1 -- cargo clean',
  lines("cat <<'EOF'", "it's", 'EOF', 'rm -rf C:/r/target'),
]

// RECORDED MUTATION: B carried across a `;` (baseOf lets a `;` separator keep the leading cd's directory) ->
// OBSERVATION-T51
test("G9 refuses wholesale cleans and recursive deletes of the main checkout's target and data folders", async ($, on) => {
  const probe = v1(on)
  await allRefused($, probe, F44, G9_REASON)
  await allRefused($, probe, ['Remove-Item -Recurse -Force C:\\r\\target'], G9_REASON, ps)
})

const F45 = [
  'cargo clean -p spatial-skp',
  'CARGO_TARGET_DIR=C:/r/target cargo clean -p spatial-kernel',
  'cargo clean --target-dir D:/wt-targets/x',
  'CARGO_TARGET_DIR=D:/wt-targets/x cargo clean',
  'git worktree remove C:/dev/wt/x && rm -rf D:/wt-targets/x',
  'rm -rf C:/r/target/debug C:/r/target/release',
  'rm -rf C:/r/frontends/shell/src-tauri/target',
  'cd C:/dev/wt/adr && rm -rf target',
  'rm -rf renderer/bundle-viewer/dist',
  'rm -rf node_modules',
  'git clean -ndx',
  'cd C:/dev/exp/clone && git clean -fdq',
  'cd C:/r/.claude/worktrees/w && git clean -fd',
  'rm -rf "$S/x"',
  'rm target/x.txt',
  'rm -rf C:/r/target/gone',
]

// RECORDED MUTATION: the leading cd ignored, so every relative operand is read against M (baseOf always
// returns the main checkout) -> OBSERVATION-T52
test('G9 allows package cleans, build-output deletes, worktree targets and named target folders', async ($, on) => {
  const probe = v1(on, {}, { missing: ['C:/r/target/gone'] })
  await allPassed($, probe, F45)
})

// ---- Fail closed ----------------------------------------------------------------------------

// RECORDED MUTATION: the shell hooks' in-hook catch returns next(e) (`verdict = CATCH_VERDICT` in guardShell
// becomes `return next(e)`) -> OBSERVATION-T53
test('a shell hook whose check cannot complete is refused by its catch, on Bash and PowerShell', async ($, on) => {
  const probe = arm(on, {})
  answerRepo(on, () => 'reject')
  expectRefused(await call($, bash('rm -rf target')), CATCH_REASON, probe)
  expectRefused(await call($, ps('Remove-Item -Recurse target')), CATCH_REASON, probe)
})

// RECORDED MUTATION: a rejected env read taken as no user folder, and the write allowed (the read's rejection
// caught as undefined, and `if (user === undefined) return true` in g8PathRefuses returns false) ->
// OBSERVATION-T54
test('G8 refuses when the user folder cannot be read', async ($, on) => {
  const world: World = { env: 'reject' }
  const probe = arm(on, world)
  answerStat(on, vfs())
  expectRefused(await call($, write('C:\\r\\notes.md')), CATCH_REASON, probe)
  // No name yields a value: G8 refuses every Write, Edit and NotebookEdit (fail closed).
  world.env = {}
  expectRefused(await call($, write('C:\\r\\notes.md')), G8_REASON, probe)
})

// RECORDED MUTATION: any stat failure read as nothing to delete (statOf's non-ENOENT rejection returns
// undefined) -> OBSERVATION-T55
test('G9 refuses when an operand cannot be looked up', async ($, on) => {
  const probe = v1(on, {}, { denied: ['C:/r/target'] })
  expectRefused(await call($, bash('rm -rf C:/r/target')), CATCH_REASON, probe)
})

// ---- The refusal log ------------------------------------------------------------------------

// F47: a main-loop G1 refusal, a lead-data G6 refusal, a worker row's G7 refusal, F46 (b)'s catch, and a
// Write whose folder does not exist (unplaceable). One write each, under C:/r-local/guardian/<day>/.
// RECORDED MUTATION: the record carries the command or path in place of its sha256 (logRefusal's
// `target_sha256` value is the target text itself) -> OBSERVATION-T56
test('each refusal writes one log line with the declared fields and no command, path or content', async ($, on) => {
  const world: World = {
    env: 'reject',
    agents: [agentRow('a1', 'lead-data'), agentRow('a3', 'worker')],
    messages: { a1: brief([`REPORT PATH: ${REPORT}`]) },
  }
  const probe = arm(on, world)
  answerRepo(on)
  answerStat(on, vfs({ missing: ['C:/r/new'] }))
  const writes = answerWrites(on)

  const cases: Array<{ input: Input; target: string; rule: string; reason: string; tool: string; agent: string }> = [
    { input: bash('git push --force'), target: 'git push --force', rule: 'G1', reason: G1_REASON, tool: 'Bash', agent: 'main' },
    {
      input: asSubagent(write('C:\\r\\docs\\x.md'), 'a1'),
      target: 'C:\\r\\docs\\x.md',
      rule: 'G6',
      reason: G6_REASON,
      tool: 'Write',
      agent: 'lead-data',
    },
    { input: asSubagent(bash('git rebase main'), 'a3'), target: 'git rebase main', rule: 'G7', reason: G7_REASON, tool: 'Bash', agent: 'worker' },
    { input: write('C:\\r\\notes.md'), target: 'C:\\r\\notes.md', rule: 'catch', reason: CATCH_REASON, tool: 'Write', agent: 'main' },
    { input: write('C:\\r\\new\\x.md'), target: 'C:\\r\\new\\x.md', rule: 'unplaceable', reason: UNPLACEABLE_REASON, tool: 'Write', agent: 'main' },
  ]
  for (const [i, c] of cases.entries()) {
    const result = await call($, c.input)
    expect(result.deny).toBe(c.reason)
    expect(writes.length).toBe(i + 1)
    const { path, text } = writes[i]
    const record = JSON.parse(text)
    expect(Object.keys(record)).toEqual(['schema', 'time', 'rule', 'tool', 'agent', 'target_sha256', 'reason'])
    expect(record).toEqual({
      schema: 'spatial-guardian/v1',
      time: record.time,
      rule: c.rule,
      tool: c.tool,
      agent: c.agent,
      target_sha256: await sha256(c.target),
      reason: c.reason,
    })
    expect(new Date(record.time).toISOString()).toBe(record.time)
    expect(text.endsWith('\n')).toBe(true)
    expect(text.indexOf('\n')).toBe(text.length - 1)
    expect(text.includes(c.target)).toBe(false)
    // The engine hands the write's path over in its own spelling, so the separators are read as /.
    const shape = /^C:\/r-local\/guardian\/(\d{4}-\d{2}-\d{2})\/(\d{9})-([0-9a-f]{16})\.json$/
    expect(path.replace(/\\/g, '/')).toMatch(shape)
    const name = shape.exec(path.replace(/\\/g, '/'))
    expect(name![1]).toBe(record.time.slice(0, 10))
    expect(name![2]).toBe(record.time.slice(11, 23).replace(/[:.]/g, ''))
    expect(name![3]).toBe((await sha256(text)).slice(0, 16))
  }
  expect(probe.reached.length).toBe(0)
})

// F48: allowed calls write nothing.
// RECORDED MUTATION: the log written before the decision, on every call (guardShell and guardWrite call
// logRefusal with a catch verdict before they decide) -> OBSERVATION-T57
test('an allowed call writes no log line', async ($, on) => {
  const probe = v1(on)
  const writes = answerWrites(on)
  await allPassed($, probe, ['git status'])
  await allPassed($, probe, ['C:\\r\\docs\\02_Architecture.md'], write)
  await allPassed($, probe, ['git status'], ps)
  expect(writes.length).toBe(0)
})

// F49: a failed log write, and a session with no repository.
// RECORDED MUTATION: the log write moved outside its own try (logRefusal's try and catch removed) ->
// OBSERVATION-T58
test('a failed log write leaves the refusal unchanged', async ($, on) => {
  let repo: Repo = null
  let rejects = true
  const probe = arm(on, {})
  answerRepo(on, () => repo)
  answerStat(on, vfs())
  const writes = answerWrites(on, () => rejects)
  // No repository: no root can be derived, so no write is made.
  expectRefused(await call($, bash('git push --force')), G1_REASON, probe)
  expect(writes.length).toBe(0)
  // A repository, and a write that rejects: the refusal is the one decided.
  repo = REPO
  expectRefused(await call($, bash('git push --force')), G1_REASON, probe)
  expect(writes.length).toBe(1)
  rejects = false
  expectRefused(await call($, ps('git push --force')), G1_REASON, probe)
  expect(writes.length).toBe(2)
})

// ---- G7 to G9 after an odd quote ------------------------------------------------------------

const PREFIX = lines("cat <<'EOF'", "it's", 'EOF')

// RECORDED MUTATION: restart points limited to command words, with no quote restarts (restartPoints no
// longer pushes an index that holds a quote) -> OBSERVATION-T59
test('G7, G8 and G9 read a call that cannot be tokenised from each restart point', async ($, on) => {
  const probe = v1(on, {}, { missing: ['C:/r/target/gone'] })
  const after = (row: string) => lines(PREFIX, row)
  await allRefused(
    $,
    probe,
    [
      'gh -R o/r pr merge 1',
      'bash -c "git -C \\"a b\\" rebase main"',
      'bash -c "bash -c \\"git rebase main\\""',
      'git merge -m "x; y" --squash f',
    ].map(after),
    G7_REASON,
  )
  await allRefused($, probe, ['claude plugins install x'].map(after), G8_REASON)
  await allRefused($, probe, ['cd C:/dev/wt/x && rm -rf target', 'CARGO_TARGET_DIR=D:/x cargo clean'].map(after), G9_REASON)
})

const F51 = [
  lines("gh pr create --title t --body-file - <<'EOF'", "it's ready for the merge click", 'EOF'),
  lines("gh pr checks 12 && cat >> l.md <<'EOF'", "the human's merge click is next", 'EOF'),
  lines("cat >> l.md <<'EOF'", "the custodian's git log check: no rebase ran", 'EOF'),
  lines("cat >> l.md <<'EOF'", "claude plugin test passed on the human's machine", 'the marketplace update is his', 'EOF'),
  lines("cat >> l.md <<'EOF'", "the reviewer's cargo test", '| 0 | clean |', 'EOF'),
  lines(PREFIX, 'cargo clean -p spatial-skp'),
]

// RECORDED MUTATION: condition 2 dropped, which restores the drafted reading (withRestarts returns the rule's
// sequence alone, with no restart) -> OBSERVATION-T60
test('G7, G8 and G9 allow record and pull-request text after an odd quote', async ($, on) => {
  const probe = v1(on)
  await allPassed($, probe, F51)
})

// F52: the repository check. Another repository, and a session in none, pass; a check that cannot complete
// refuses with the rule's own reason. Run in that order: a session with no repository is not remembered.
// RECORDED MUTATION: a rejected stat read as another repository (isThisRepository returns false for a
// failure other than ENOENT) -> OBSERVATION-T61
test('G7 and G9 apply only in this repository, and apply when the check cannot complete', async ($, on) => {
  const guardian = 'c:/r/tools/mods/spatial-guardian/.claude-plugin/plugin.json'
  let repo: Repo = null
  let pluginJson: 'denied' | 'missing' = 'missing'
  const probe = arm(on, {})
  answerRepo(on, () => repo)
  answerStat(on, (path) => {
    if (dots(path).toLowerCase() !== guardian) return dots(path)
    return pluginJson === 'missing' ? undefined : { deny: 'EACCES: permission denied' }
  })
  const rows: Array<[string, string]> = [
    ['git rebase origin/main', G7_REASON],
    ['rm -rf C:/r/target', G9_REASON],
  ]
  // The session is in no repository.
  for (const [row] of rows) await allPassed($, probe, [row])
  // The session's repository, and a stat that cannot complete: the refusal stands.
  repo = REPO
  pluginJson = 'denied'
  for (const [row, reason] of rows) await allRefused($, probe, [row], reason)
  // The session's repository has no Guardian plugin.json (ENOENT): another repository.
  pluginJson = 'missing'
  for (const [row] of rows) await allPassed($, probe, [row])
})

// ---- gh api merges ----------------------------------------------------------------------------

const F53 = [
  'gh api repos/o/r/pulls/12/merge -X PUT',
  'gh api -X PUT repos/o/r/pulls/12/merge',
  'gh api --method=PUT /repos/o/r/pulls/12/merge -f merge_method=merge',
  'gh api repos/o/r/pulls/12/merge',
  'gh api --method GET repos/o/r/pulls/12/merge',
  lines(PREFIX, 'gh api -X PUT repos/o/r/pulls/12/merge'),
]

// RECORDED MUTATION: the path test gated on a PUT method (ghMerges also requires a token PUT) -> OBSERVATION-T62
test("G7 refuses a gh api call on a pull request's merge path, whatever the method", async ($, on) => {
  const probe = v1(on)
  await allRefused($, probe, F53, G7_REASON)
  await allRefused($, probe, ['gh api -X PUT repos/o/r/pulls/12/merge'], G7_REASON, ps)
})

// RECORDED MUTATION: the digits test dropped, so any path segment counts (MERGE_PATH reads `pulls/[^/]+/merge`)
// -> OBSERVATION-T63
test('G7 allows gh api reads of a pull request, and a merge path it cannot read', async ($, on) => {
  const probe = v1(on)
  await allPassed($, probe, ['gh api repos/o/r/pulls/12', 'gh api graphql -f query=q', 'gh pr view 12 --json mergedAt', 'gh api repos/o/r/pulls/$N/merge'])
})

// ---- The user-level .claude.json -------------------------------------------------------------

// RECORDED MUTATION: the comparison uses the spelling as received, not the placed path (decideWrite passes
// normalise(path) to g8PathRefuses) -> OBSERVATION-T64
test('G8 refuses a tool write to the user-level .claude.json in every spelling', async ($, on) => {
  const probe = v1(on, { agents: [agentRow('a1', 'worker')] })
  await allRefused($, probe, ['C:\\u\\.claude.json'], G8_REASON, write)
  await allRefused($, probe, ['c:/U/.CLAUDE.JSON', 'C:\\u\\x\\..\\.claude.json'], G8_REASON, edit)
  await allRefused($, probe, ['C:\\u\\.claude.json'], G8_REASON, notebook)
  const refused = await call($, asSubagent(write('C:/u/.claude.json'), 'a1'))
  expect(refused.deny).toBe(G8_REASON)
})

// RECORDED MUTATION: `.claude.json` matched as a path suffix anywhere (g8PathRefuses also refuses a placed
// path that ends in `/.claude.json`) -> OBSERVATION-T65
test("G8 allows .claude.json outside the user profile's top level, and shell writes to it", async ($, on) => {
  const probe = v1(on)
  await allPassed($, probe, ['C:\\u\\.claude.json.bak', 'C:\\r\\.claude.json', 'C:\\u\\x\\.claude.json'], write)
  await allPassed($, probe, ['cat > C:/u/.claude.json'])
})

// ---- G9's containers, data folders and globs --------------------------------------------------

const F57_WORLD: Vfs = { links: { 'C:/r/target': 'D:/t/target' }, missing: ['C:/r/target/fixtures/nothing-here', 'C:/r/target/gone'] }

const F57 = [
  'rm -rf C:/r',
  'rm -rf C:/',
  'rm -rf .',
  'cd C:/r && rm -rf ..',
  'rm -rf D:/t',
  'rm -rf C:/r/target/fixtures/admission-remediation',
  'rm -rf target/slice-evidence/cancel-rescore',
  'rm -r C:\\r\\target\\fixtures\\x.parquet',
  'bash -c "rm -rf C:/r"',
  lines(PREFIX, 'rm -rf C:/r'),
]

// RECORDED MUTATION: the container test dropped (deleteRefuses compares an operand with the protected members
// by equality only, with no folder above them) -> OBSERVATION-T66
test('G9 refuses a recursive delete of the main checkout, a folder above it, or anything under a data folder', async ($, on) => {
  const probe = v1(on, {}, F57_WORLD)
  await allRefused($, probe, F57, G9_REASON)
  await allRefused($, probe, ['Remove-Item -Recurse C:\\r'], G9_REASON, ps)
})

const F58 = [
  'rm -rf target/debug',
  'rm -rf C:/r/target/release',
  'rm -rf C:/r/frontends/shell/src-tauri/target',
  'cd C:/dev/wt/x && rm -rf target',
  'cd C:/dev/wt/x && rm -rf .',
  'rm -rf C:/r/.claude/worktrees/w',
  'rm -rf target/fixtures/nothing-here',
  'rm C:/r/target/fixtures/x.parquet',
  'rm -f target/fixtures/x.parquet',
  'rm -rf D:/wt-targets/x',
  'rm target/*',
]

// RECORDED MUTATION: the contents test applied without a recursive option (deleteRefuses drops its
// `!recursive` condition for a named operand) -> OBSERVATION-T67
test('G9 still allows build-output deletes, worktree targets and a named file in a data folder', async ($, on) => {
  const probe = v1(on, {}, F57_WORLD)
  await allPassed($, probe, F58)
})

// RECORDED MUTATION: the glob addition applied only with a recursive option (the data-folder glob test in
// deleteRefuses also requires `recursive`) -> OBSERVATION-T68
test('G9 refuses a glob delete in a data folder with or without a recursive option, and allows a named file there', async ($, on) => {
  const probe = v1(on, {}, F57_WORLD)
  await allRefused($, probe, ['rm target/slice-evidence/*', 'rm -f target/fixtures/*.parquet', 'del /q target\\fixtures\\*'], G9_REASON)
  await allRefused($, probe, ['Remove-Item target\\fixtures\\*'], G9_REASON, ps)
  await allPassed($, probe, ['rm target/fixtures/x.parquet'])
})

// ---- The CLI's aliases and round 58's verbs ---------------------------------------------------

// RECORDED MUTATION: `plugins` dropped from the group words (G8_GROUP_WORDS) -> OBSERVATION-T69
test("G8 refuses the CLI's aliases of the named operations", async ($, on) => {
  const probe = v1(on)
  await allRefused(
    $,
    probe,
    [
      'claude plugins install x',
      'claude plugin i x',
      'claude plugin marketplace rm x',
      'claude plugins marketplace add C:/r/tools/mods',
      'claude plugins uninstall x',
      'claude plugin remove x',
    ],
    G8_REASON,
  )
  await allPassed($, probe, ['claude plugins list', 'claude plugins validate tools/mods'])
})

// RECORDED MUTATION: `login`, `logout` and `reset-project-choices` placed among the plugin action words instead
// of the MCP action words -> OBSERVATION-T70
test('G8 refuses the plugin and MCP verbs round 58 adds, and allows eval and the read-only verbs', async ($, on) => {
  const probe = v1(on)
  await allRefused(
    $,
    probe,
    [
      'claude plugin prune',
      'claude plugin autoremove',
      'claude plugin init x',
      'claude plugins new x',
      'claude plugin configure x',
      'claude mcp login x',
      'claude mcp logout x',
      'claude mcp reset-project-choices',
      'claude.exe plugin init --help',
      'git commit -m "claude plugin test passed on the new build"',
    ],
    G8_REASON,
  )
  await allRefused($, probe, ['claude plugin configure x'], G8_REASON, ps)
  await allPassed($, probe, [
    'claude plugin eval x',
    'claude plugins eval x',
    'claude plugin details x',
    'claude plugin list',
    'claude plugin marketplace list',
    'claude plugin tag x',
    'claude mcp get x',
    'claude mcp list',
    'claude mcp serve',
    'git commit -m "init the new claude plugin folder"',
  ])
})

// ---- G1 and a push whose own segment leaves a quote open ---------------------------------------

// RECORDED MUTATION: (ii)'s push head read without git's global options skipped (pushBeforeOpenQuote takes the
// token right after git as the subcommand) -> OBSERVATION-T71
test('G1 still refuses a push whose own segment leaves a quote open after it, in either reading and inside a quoted command string', async ($, on) => {
  const probe = v1(on)
  await allRefused($, probe, ['git -C x push origin "main', 'bash -c "git push \'origin"', '(git push "origin'], G1_REASON)
  await allRefused($, probe, ['git push "origin'], G1_REASON, ps)
})

const F63 = [
  lines('git push -q origin main && git commit -F - <<\'EOF\'', "it's the push note", 'EOF'),
  lines("git push -q origin main; cat >> l.md <<'EOF'", "the custodian's push ran", 'EOF'),
]

// RECORDED MUTATION: (ii) reads the call's text before the open quote across segments, option (c)
// (pushBeforeOpenQuote tokenises `whole` up to the open quote's offset in it) -> OBSERVATION-T72
test('G1 allows a push in an earlier segment than an odd quote', async ($, on) => {
  const probe = v1(on)
  await allPassed($, probe, F63)
})
