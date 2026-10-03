*Custodian's filing note (2026-10-03): the architect's draft 2 of guardian-v0's full-form preregistration, revised to question rounds 43 (items 3 and 4) and 44 (item 1, with the typed ruling `state/directives/2026-10-03-guardian-o3-o8-ruling.md`). The harness persisted the hand-back to a file because of its size. This is that file's text from its third line on: its first line is the harness's flag that the report's settings-file wording looked instruction-shaped (the one neutralised bracket is in that line, not the report), and its second line is blank. One newline is added at the end. The last line, a session link, is in the persisted text; whether the agent or the harness wrote it is not determined. Its sha256, from this file's line 5 to the end, is 8ec8c445a94e51783360594bfd474611d739c55a973eddbc3afc64b78b9859a8. Write audit PASS: zero write calls (Read 28, Grep 11, Glob 2). C3 clean: before 19:29:04Z, after 19:41:23Z, both at 1bb94e19. **The committed form** is `tools/mods/GUARDIAN-V0-PREREGISTRATION.md`: part (1)'s fenced block, with its 64 pins computed by script at 1bb94e19 and its Custodian's-edits line filled in. **The draft's one question,** governance-ci's two `tools/mods/**` path-filter lines, is taken by the custodian under P-005, because it changes no check and carries round 44, item 1's failure route.*

---

Reviewed: main @ 1bb94e19

(1) The form. The proposed path is unchanged: `tools/mods/GUARDIAN-V0-PREREGISTRATION.md`. The custodian sets PLAN node `guardian-v0`'s `gate:` to this file in the same commit.

```
# Guardian v0 — the first Spatial IDE mod: a refuse-only plugin at tools/mods/spatial-guardian/ (PLAN node `guardian-v0`) — preregistration

**Authority:**
- the 2026-10-03 Guardian v0 direction: `state/directives/2026-10-03-guardian-v0-direction.md:12-14` @ 1bb94e19 sha256:HASH-TBD (RULED 2026-10-03, the Guardian v0 block in `DECISIONS-PENDING.md`, cited by its heading and not by line);
- Fable's brief: `state/directives/MODS-GUARDIAN-V0-2026-10-03.md` (whole-file sha256 6d156511936465a831e9e197d42db4cdee2b8199ca838e7021071b6318a4f6e8). Its parts are cited below by section, rule id and pinned line;
- the node: `PLAN.yaml:3814-3830` @ 1bb94e19 sha256:HASH-TBD;
- the rulings on draft 1's OPEN items: round 43, item 3 (O-1, G5 leaves v0); round 43, item 4 (O-2, G6 kept on reads); round 44, item 1 (O-3 to O-8), whose typed text is the 2026-10-03 guardian O-3 to O-8 ruling, `state/directives/2026-10-03-guardian-o3-o8-ruling.md:6-8` @ 1bb94e19 sha256:HASH-TBD.
The rules enforced are cited by round and item: round 34, item 3 (force-push); round 41, item 3 (the write audit, `state/directives/2026-10-03-write-audit-ruling.md:7-9` @ 1bb94e19 sha256:HASH-TBD); round 29 (the exposure rule, which G5 would have enforced; out of v0 by round 43, item 3); and AUTONOMY §7 (the flush).
**Drafted by** the architect agent on the custodian's brief. This is draft 2, read at `main` 1bb94e19. Draft 1 was read at b64a8d39 and is filed as `state/consults/2026-10-03-guardian-v0-architect-draft.md`. It is architect-drafted because it crosses no engine/ or kernel/ path (`state/directives/2026-10-03-lead-data-pilot-direction.md:31-33` @ 1bb94e19 sha256:HASH-TBD). Nothing was run for this draft. **Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** <the custodian fills this line: the hashes computed, and anything else changed>.
**Gating:** full, reviewer and architect, on two heads, each enough alone:
- **§21a, security posture.** The direction line names installing Guardian a security-posture change (`state/directives/2026-10-03-guardian-v0-direction.md:12-14` @ 1bb94e19 sha256:HASH-TBD; `AUTONOMY.md:315-332` @ 1bb94e19 sha256:HASH-TBD). This piece builds the artefact that would be installed.
- **§21c size** (`AUTONOMY.md:347-357` @ 1bb94e19 sha256:HASH-TBD): over the bound (§7).
Under round 25, item 2 (e), no five-line form is used.
**Red line.** Installing Guardian is the human's alone. It needs his typed approval after both gates, and he installs it himself (brief §4, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:44` @ 1bb94e19 sha256:HASH-TBD; `AI_DEVELOPMENT.md:451-454` @ 1bb94e19 sha256:HASH-TBD). Nothing in this piece installs, enables or loads the mod into a session, adds a marketplace, or starts a session with it.

## §0. Disclosure

**0.1 Inputs.** These are Evidence, not Authority:
- P0, `state/consults/2026-10-03-guardian-v0-p0-report.md`, run against Claude Code build 2.1.288;
- the install-scope supplement, `state/consults/2026-10-03-guardian-v0-docs-read.md`. Its filing note was read first. Part 1's line 56 (`state/consults/2026-10-03-guardian-v0-docs-read.md:56` @ 1bb94e19 sha256:HASH-TBD) is wrong, per the note (`state/consults/2026-10-03-guardian-v0-docs-read.md:1` @ 1bb94e19 sha256:HASH-TBD) and P0's timeout probe. Nothing here relies on it.
The build's files are cited as `<skill-root>/<file>:<line>`, with file sha256 values from P0 (`state/consults/2026-10-03-guardian-v0-p0-report.md:1005-1006` @ 1bb94e19 sha256:HASH-TBD):
- `<skill-root>/types/claude-code.d.ts` is 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1;
- `<skill-root>/reference.md` is ad5f1688672600495233d09b597c1bc4ef5d8f790c32caf9490d4fd2e5bb71f4.
Every build fact is a claim about build 2.1.288 (round 15 (c)). It is not current for any other build (§5 I2).

**0.2 The brief's §3 answers, each with its source.**
1. **Agent identity.** On the types, yes. `tool.call` carries `agentId` in a subagent's loop and none on the main loop. `$.agent.list()` rows carry the same `id` and a `type`. Sources: `<skill-root>/types/claude-code.d.ts:164-182`, `<skill-root>/types/claude-code.d.ts:121-139` and `<skill-root>/types/claude-code.d.ts:11953-11961`; P0's answer at `state/consults/2026-10-03-guardian-v0-p0-report.md:8` @ 1bb94e19 sha256:HASH-TBD.
   - The brief is reachable by reads (`$.session.messages({ agentId })`), or by an `agent.spawn` hook: `state/consults/2026-10-03-guardian-v0-p0-report.md:205` @ 1bb94e19 sha256:HASH-TBD.
   - The probe passed `agentId` through a type cast (`state/consults/2026-10-03-guardian-v0-p0-report.md:197` @ 1bb94e19 sha256:HASH-TBD).
   - That a live subagent's calls carry the id is the build's type claim. It is unverified without a live session, and E5 settles it (round 43, item 4).
2. **Tool-result shape.** Bash, Grep and Read results are typed: `<skill-root>/types/claude-code.d.ts:19178-19186`, `<skill-root>/types/claude-code.d.ts:19495-19506` and `<skill-root>/types/claude-code.d.ts:19809-19822`. The typed way to add a line after a result is the `context` field. It is returned beside the result from `next(e)`, and the model reads it but the user does not see it (P0's answer, `state/consults/2026-10-03-guardian-v0-p0-report.md:207` @ 1bb94e19 sha256:HASH-TBD).
   - The field's own doc lines are not among P0's excerpts. Amendment 1 (P0b), item (iv), reads them.
   - Delivery to the model is unverified live. E6 records it, and `context` is the delivery route (round 44, item 1, O-5 as recommended).
3. **Context fill.** `$.session.usage()` gives `context.percent`, the status line's percentage over the model's window. It is absent until the first response of a live window: `<skill-root>/types/claude-code.d.ts:10257-10280`, `<skill-root>/types/claude-code.d.ts:2621-2642`. `turn.step` carries the four counts but no window size: `<skill-root>/types/claude-code.d.ts:12619-12661`, `<skill-root>/types/claude-code.d.ts:12681-12715`.
   - The compaction window may be smaller than `window` (a sub-line span of `<skill-root>/types/claude-code.d.ts:10285`). §2.8 takes the denominator by round 44, item 1 (O-6 as recommended).
   - P0's reading is that no `turn.step` hook is needed (`state/consults/2026-10-03-guardian-v0-p0-report.md:529` @ 1bb94e19 sha256:HASH-TBD).
4. **Install scope.** The docs read covers this:
   - user scope records the plugin in the user settings file, which is not committed (`state/consults/2026-10-03-guardian-v0-docs-read.md:16` @ 1bb94e19 sha256:HASH-TBD);
   - a cloud session loads neither user-installed plugins nor the ones the repository's settings turn on (`state/consults/2026-10-03-guardian-v0-docs-read.md:25` @ 1bb94e19 sha256:HASH-TBD);
   - both quotations were checked against the pages (`state/consults/2026-10-03-guardian-v0-docs-read.md:94-104` @ 1bb94e19 sha256:HASH-TBD).
   The commands come from the build's help text: `state/consults/2026-10-03-guardian-v0-p0-report.md:531` @ 1bb94e19 sha256:HASH-TBD.
   - The marketplace shape validated with exit 0.
   - `hooks.json` `modules` must be an array of exactly one path.
   - P0 does not establish whether an install copies the plugin folder or references it (§1, may not claim; E0).
5. **Tests.** `claude plugin test <dir>` runs every `*.test.ts` and `*.test.tsx` under the folder, in a child of the binary, with no fs, network or process, and starts no session. A test answers the engine's events beneath the plugin, and an unanswered event throws. Sources: `state/consults/2026-10-03-guardian-v0-p0-report.md:660` @ 1bb94e19 sha256:HASH-TBD; `<skill-root>/types/claude-code.d.ts:14902-14913`; sub-line spans of `<skill-root>/reference.md:75`. A plugin file may be `.mjs`, as may every file it imports from the plugin: a span of `<skill-root>/reference.md:14`, excerpted by P0 at `state/consults/2026-10-03-guardian-v0-p0-report.md:616` @ 1bb94e19 sha256:HASH-TBD (a sub-line span; the line's hash).
6. **Limits.** The hook budget is 10 000 ms and the `.catch` grace is 1 000 ms. The clock stops while a `next` or `$` call is in flight (`<skill-root>/types/claude-code.d.ts:4804-4820`, `<skill-root>/types/claude-code.d.ts:8675-8691`).
   - A failed hook with no `.catch` is skipped, and the call runs (the probe at `state/consults/2026-10-03-guardian-v0-p0-report.md:863` @ 1bb94e19 sha256:HASH-TBD).
   - A `.catch` that returns `undefined` or overruns leaves the hook absent (`<skill-root>/types/claude-code.d.ts:994-1002`).
   - `$.process.run` resolves `{ exitCode, stdout, stderr }` for any exit code. It rejects when the command cannot start or is still running at its timeout. Each stream is cut at its first 4194304 bytes, with `isStdoutTruncated` and `isStderrTruncated` set when it is (`<skill-root>/types/claude-code.d.ts:3291-3307`). A hung `$.process.run` does not trip the budget. It has its own 30 s default (P0 at `state/consults/2026-10-03-guardian-v0-p0-report.md:864` @ 1bb94e19 sha256:HASH-TBD).
7. **`claude plugin validate`.** The two lines are `hooks:` and `calls:` (`state/consults/2026-10-03-guardian-v0-p0-report.md:866` @ 1bb94e19 sha256:HASH-TBD; probe output at `state/consults/2026-10-03-guardian-v0-p0-report.md:880-881` @ 1bb94e19 sha256:HASH-TBD).
   - The `calls:` line names `$.process.run` whatever its argv, so it cannot show whether a process call is `git` (§2.1(c), §8 item 3).
   - A hooks module imports only its own files and `claude-code`, so the repository scanner cannot be imported. G5 leaves v0 (round 43, item 3; §2.6).
   - The calls each rule needs: `state/consults/2026-10-03-guardian-v0-p0-report.md:991-1000` @ 1bb94e19 sha256:HASH-TBD.
   - The coverage limit: `state/consults/2026-10-03-guardian-v0-p0-report.md:1002` @ 1bb94e19 sha256:HASH-TBD.

**0.3 Repository facts relied on.**
- The Stop hook's staleness predicate: `scripts/hooks/stop-queue.mjs:221-244` @ 1bb94e19 sha256:HASH-TBD. It is module-local and reads git. Its block parser is `parseSessionContinuity`: `scripts/hooks/precompact-flush.mjs:57-79` @ 1bb94e19 sha256:HASH-TBD.
- The Stop hook's exported decision core, its signature and its result shapes: `scripts/hooks/stop-queue.mjs:289-299` @ 1bb94e19 sha256:HASH-TBD. Its continuity step: `scripts/hooks/stop-queue.mjs:327-342` @ 1bb94e19 sha256:HASH-TBD. Its background-tasks allow, which comes after continuity: `scripts/hooks/stop-queue.mjs:344-347` @ 1bb94e19 sha256:HASH-TBD.
- The existing hook tests' continuity fixtures (real git, `os.tmpdir()`, local identity, `core.autocrlf false`, `* -text` in `.git/info/attributes`, `t.after` cleanup): `scripts/hooks/hooks.test.mjs:65-124` @ 1bb94e19 sha256:HASH-TBD. Their environment preamble: `scripts/hooks/hooks.test.mjs:20-25` @ 1bb94e19 sha256:HASH-TBD.
- The stale-continuity form is `scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md`. It is cited by section, amendment and item: its §3 scenarios S1 to S10, its §7 reason and stderr texts, and its Amendment 2, item 2 (T18 and T19). Its Amendment 3 is its closing record.
- CI: governance-ci's test step runs `node --test` over the `scripts/plan` and `scripts/hooks` test globs (`.github/workflows/governance-ci.yml` lines 137-138 at 1bb94e19). Its push and pull_request path filters (the same file, lines 79-92 and 94-107 at 1bb94e19) include `scripts/hooks/**` but not `tools/mods/**`. These are named in words, because verify-quotes' grammar does not read a dot-prefixed path. The custodian computes their hashes.
- Agent tool lists:
  - lead-data alone has Write (`.claude/agents/lead-data.md` line 4 at 1bb94e19);
  - architect and evidence-reader have none (`.claude/agents/architect.md` line 4 and `.claude/agents/evidence-reader.md` line 4 at 1bb94e19);
  - these are named in words for the same reason. The custodian computes their hashes.
- The off-switches: `--safe-mode` also disables the user's other customizations (`state/consults/2026-10-03-guardian-v0-docs-read.md:99` @ 1bb94e19 sha256:HASH-TBD); `disableAllHooks` also stops the settings hooks (`state/consults/2026-10-03-guardian-v0-docs-read.md:104` @ 1bb94e19 sha256:HASH-TBD).
- The session's dev-mods folder is watched while the plugin-authoring skill is loaded (the custodian's P0 ledger entry in `state/CUT-STATE.md`, its note for the human). Writing there raises a mod load.

**0.4 P0b, read-only, before any code.** The worker reads `<skill-root>/types/claude-code.d.ts` and records five things before any code. The record is **Amendment 1, headed P0b**, class 1, written after the read, and it is §10's first amendment. §10 opens empty, and nothing is appended before Amendment 1. Later amendments number from 2. This form cites P0b's findings as Amendment 1 (P0b), item (i) to item (v). The five things:
- (i) whether the `ToolCallInput` union names a `PowerShell` tool, and its command field;
- (ii) whether it names `MultiEdit` or `NotebookEdit`, and their path fields;
- (iii) the row type of `$.session.messages`, and whether its first row is the Agent call's prompt, by the types;
- (iv) the `context` field's doc lines on `ToolCallResult`;
- (v) whether a test's `on` can answer `fs.stat`, `agent.list` and `session.messages`; and whether a `{ breakdown: "summary" }` usage call makes no network request and carries the compaction window.
Each item is cited `<skill-root>/types/claude-code.d.ts:<lines>`. A finding that contradicts §2 STOPS the piece (§5 I1). Item (ii) decides whether §2.10's extension applies, and item (v)'s second half decides §2.8's denominator.

**0.5** No measurement, no fixture drive. §3's parity fixtures are test fixtures, built in temporary repositories by T35 and T36.

## §1. May and may not claim

**May claim:**
1. Each kept rule refuses its §3 refusal cases and passes its allowed cases to `next(e)` unchanged (under `claude plugin test`, build 2.1.288, Windows).
2. A refusing hook that throws, or whose `$` call rejects or times out, ends in a deny.
3. N1's threshold, band and staleness behaviour, as §2.8 declares.
4. `claude plugin validate` lists only §2.0's hooks and calls.
5. T35: on every §3 parity fixture, the mod's `judgeContinuity` and the Stop hook's `decide` reach the same outcome, one of stale, fresh and not judged, each reading the one repository built for that fixture. This holds on Windows (the reviewer's run) and on ubuntu-latest (governance-ci). T36: the fixture set reaches all three outcomes on the Stop hook's side.

**May not claim:**
- any live behaviour before its E-row (§4): `agentId` on a live subagent's calls; `context` reaching the model; `realPath` spellings; the live percent figure;
- parity through the engine's own `$.process.run`. T35's runner is Node's `spawnSync`, shaped to the build's result type (§0.2 item 6). register.js's adapter is proven under `claude plugin test` with stubbed answers (T26 to T32), and live by E6;
- parity for a history shape outside §3's parity fixtures, or for a ledger blob of 4194304 bytes or more. Above that size the engine cuts the stream: the mod reads not judged, while the Stop hook judges up to its 64 MiB buffer (§2.8a; §5 I7);
- parity for a session whose working directory differs from the Stop hook's project root (a worktree session, for example);
- writes by Bash, PowerShell or any tool other than those §2 registers (P0's coverage limit, `state/consults/2026-10-03-guardian-v0-p0-report.md:1002` @ 1bb94e19 sha256:HASH-TBD). A round 15 (f) restore done with git is unseen by G3;
- for G1: aliases, scripts, configured `+` refspecs, or environment variables. G1 reads the command string only;
- any profile-path refusal. G5 is not in v0 (round 43, item 3);
- cloud sessions, or edits made on GitHub. CI and the gates stay (brief §1, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:12` @ 1bb94e19 sha256:HASH-TBD);
- any build other than 2.1.288; macOS; Linux for the mod itself (T35 and T36 run there only as Node tests);
- that the installed copy is isolated from later changes to the repository folder (E0);
- that `claude plugin test` and `validate` load the mod into a session. P0 shows that neither starts one;
- any latency figure, and any docs/08 row.

**Out of scope** (the brief's line 26, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:26` @ 1bb94e19 sha256:HASH-TBD): dashboards, evidence packaging, a context keeper, any approval or override path, cloud sessions. G5 is also out (round 43, item 3).

**Scope limits:**
- no wire change, and no ADR cited as governing or amended;
- ADR-006 does not apply, because this is repository tooling;
- no configuration, no `userConfig` and no flag: every code path is reached by a real tool call;
- outside `tools/mods/`, this piece adds one test file in `scripts/hooks/` and two path-filter lines in `.github/workflows/governance-ci.yml` (§2.13). It changes no other line.

**Seams**, each written against the other side's actual interface:
- **register.js to the mod API:** build 2.1.288's types (§0.2). Proven from the real shape by `claude plugin test`, which runs the engine's own dispatch and `.catch` path, and live by E0 to E6.
- **register.js to `hooks/continuity.mjs`:** `judgeContinuity(run)`, whose one product caller is N1 in register.js. `run` is register.js's git adapter over `$.process.run` (§2.8a).
- **The mod's staleness check to the Stop hook's:** a mod cannot import a repository file, so the predicate is restated in `continuity.mjs`. Its source is `scripts/hooks/stop-queue.mjs:221-244` @ 1bb94e19 sha256:HASH-TBD, with `scripts/hooks/precompact-flush.mjs:57-79` @ 1bb94e19 sha256:HASH-TBD for the parser, named in a comment. T35 holds the two together. It reads the Stop hook only through its exported `decide` (§0.3), unchanged, and classifies by the stale-continuity form's §7 texts.
- **G6 to the custodian's briefs:** a `REPORT PATH: <absolute path>` line, which lead-data briefs carry from install (round 43, item 4). That is the custodian's practice, not this piece's code.

## §2. The rules, stated before code

**2.0 Packaging** (brief §4, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:41` @ 1bb94e19 sha256:HASH-TBD; P0 §4):
- `tools/mods/.claude-plugin/marketplace.json`: `name` `spatial-ide-mods`, `owner.name`, `description`, and `plugins[0]` = `{ name: "spatial-guardian", source: "./spatial-guardian", description }`.
- `tools/mods/spatial-guardian/.claude-plugin/plugin.json`: `name`, `description`, `author`.
- `tools/mods/spatial-guardian/hooks/hooks.json`: `"modules": ["./register.js"]`, an array of one path.
- `tools/mods/spatial-guardian/hooks/register.js`: exports `register(on, options)`. It imports nothing but its own files and `claude-code`.
- `tools/mods/spatial-guardian/hooks/continuity.mjs` (§2.8a): pure, with no import and no `$` call. Node can import it as well as the engine.
- `tools/mods/spatial-guardian/test/guardian.test.ts`: the plugin tests (§4), importing from `claude-code/testing`.
- `tools/mods/spatial-guardian/.gitignore`: `.claude-plugin/types/`, the engine-written type folder, kept out of git.
- `tools/mods/spatial-guardian/README.md` (2.11).
- No npm dependency, no `package.json`, no lockfile.
- Declared hooks line: `tool.call{tool=Bash}`, `tool.call{tool=Write}`, `tool.call{tool=Edit}`, and the unfiltered `tool.call` (N1). Two more are added only if P0b finds the tools typed: `tool.call{tool=PowerShell}` (Amendment 1 (P0b), item (i)), and `tool.call{tool=MultiEdit}` and `tool.call{tool=NotebookEdit}` (item (ii); §2.10).
- Declared calls line: `$.fs.stat`, `$.fs.read`, `$.process.run` (git only), `$.agent.list`, `$.session.messages`, `$.session.usage`. Nothing else. These count as reads under item 7 (round 44, item 1, O-3 as recommended).
- No `turn.step` hook and no `agent.spawn` hook.
- The worker builds in a worktree under `C:\dev\wt\` or `.claude/worktrees/`, never in the dev-mods folder or anywhere under the user Claude directory.

**2.1 Common design.**
- (a) **Refuse only** (brief §1, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:7-10` @ 1bb94e19 sha256:HASH-TBD). A hook either returns `{ deny: <reason> }` or returns `next(e)` with the event it received, untouched. There is no `tool.check` hook and no `allow`.
- (b) **Fail closed** (P0 §6). Every refusing registration carries `.catch(() => ({ deny: CATCH_REASON }))`: synchronous, one expression, no `$` call, nothing that can throw.
- (c) **Timeouts and argv.** Every `$.process.run` call site in register.js passes the literal `"git"` as `argv[0]` and `timeoutMs: PROCESS_TIMEOUT_MS` (§7). In a refusing hook, a rejection makes the hook throw, and (b) denies.
- (d) **Placement.** `place(path)` follows the build's own guard example (`<skill-root>/types/claude-code.d.ts:3061-3113`):
  - a spelling it cannot place returns `undefined`: drive-relative, `\\` or `//`, an empty, `.` or `..` name, or a name holding a drive;
  - otherwise it returns the file's `realPath` from `$.fs.stat(path, { resolve: true })`;
  - otherwise, on `ENOENT`, it returns the folder's `realPath` plus the separator plus the name;
  - otherwise it returns `undefined`.
  A Write or Edit whose path places to `undefined` is refused (`UNPLACEABLE_REASON`).
- (e) **Matching.** The placed path is normalised by replacing every `\` with `/` and lower-casing ASCII. Protected paths are matched by suffix or segment on that form, on every platform alike (R1). No branch keys on the OS, and no drive letter is assumed (R4). A case-sensitive volume can therefore see an over-refusal, which is declared here.
- (f) **No paths in reasons.** No deny reason contains a path from the call (the exposure rule's spirit). Each reason states Guardian's own fact and its own refusal, and no other module's consequence (round 7).
- (g) **Order in the Write and Edit hook:** G6 (when `agentId` is set), then placement, then G2, G4 and G3, then `next(e)`.

**2.2 G1** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:18` @ 1bb94e19 sha256:HASH-TBD). A Bash hook, plus a PowerShell hook if Amendment 1 (P0b), item (i), finds the tool typed. It makes no `$` call.
- `e.command` is split into segments at `;`, `&&`, `||`, `|`, `&` and newlines outside quotes. Each segment is tokenised with single and double quotes.
- A segment is a push when its tokens hold `git`, then any of git's global options (`-C <x>`, `-c <k=v>`, `--git-dir=…`, `--work-tree=…`, `--no-pager` and the like), then `push`.
- A quoted token that itself holds `git` and `push` is scanned again as a command (for example `bash -c "…"`).
- After `push`, any one of these refuses:
  - `--force` (with or without `=…`);
  - `-f`;
  - a short-option cluster holding `f` or `d`;
  - `--force-with-lease` (bare or with a value);
  - `--mirror`;
  - `--delete` or `-d`;
  - `--prune`;
  - a refspec that begins with `+` or with `:`.
- A segment that holds `push` and cannot be tokenised (an unbalanced quote) is refused.
- Anything else goes to `next(e)`.

**2.3 G2** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:19` @ 1bb94e19 sha256:HASH-TBD). A Write or Edit whose normalised path ends with `/docs/01_principles.md` is refused.

**2.4 G3** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:20` @ 1bb94e19 sha256:HASH-TBD). The target is protected when either of these holds:
- it is an existing file whose normalised path ends in `/docs/adr/adr-<digits>-<name>.md`, and whose status line is not Proposed. The status line is the first of the file's first 10 lines that starts with an optional `*`, then `Status`. Its first word is compared after `*`, `:` and spaces are stripped. Any status other than `Proposed`, or no status line, counts as protected: unrecognised means protected;
- it is a file whose basename, lower-cased, ends with `preregistration.md` and which is filed: `git cat-file -e HEAD:./<name>`, run with `cwd` set to the file's placed folder, exits 0. A non-zero exit means not filed. A rejection throws, and 2.1(b) denies.
On a protected target:
- a Write is allowed only when `e.content.startsWith(current)`, where `current` is `$.fs.read(path)`. A read that rejects (over 4 MiB, for example) throws and is denied;
- an Edit is allowed only when it is append-shaped: `old_string` occurs exactly once in `current`, `current.endsWith(old_string)`, and `new_string.startsWith(old_string)`. Every other Edit is refused (round 44, item 1, O-8 as recommended).

**2.5 G4** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:21` @ 1bb94e19 sha256:HASH-TBD). When the normalised path holds the segment `/state/directives/`:
- every Edit is refused;
- a Write is refused when the file exists (its own `$.fs.stat` succeeds);
- a Write that creates a new file is allowed.

**2.6 G5** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:22` @ 1bb94e19 sha256:HASH-TBD) **is left out of v0, by round 43, item 3.**
- There is no G5 code, no G5 test, and no option, stub, placeholder or call that prepares for it.
- There is no `$.fs.write` and no non-git process call.
- The commit-msg and pre-commit hooks and the CI `--range` backstop remain the profile-path refusal.
- The scanner's stdin mode is the proposed node `profile-path-scan-stdin-mode` (`PLAN.yaml:3886-3902` @ 1bb94e19 sha256:HASH-TBD). G5 returns only through that node and a later piece.

**2.7 G6** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:23` @ 1bb94e19 sha256:HASH-TBD). **Ruled by round 43, item 4: kept, on reads (route B).**
- With `e.agentId` unset, G6 does nothing.
- Otherwise it calls `$.agent.list()`. G6 does nothing when no row has `id === e.agentId` (engine forks and workflow agents, `<skill-root>/types/claude-code.d.ts:164-182`), or when the row's `type` is not one of `architect`, `lead-data` or `evidence-reader`.
- Otherwise it reads the first row of `$.session.messages({ agentId: e.agentId })`, whose shape comes from Amendment 1 (P0b), item (iii). Exactly one line must match `^REPORT PATH: (.+)$`. The placed and normalised call path must equal the placed and normalised declared path, or the call is refused (`G6_REASON`). Zero matching lines, several, or an unplaceable declared path also refuse.
- An architect or evidence-reader brief carries no such line, so any Write is refused. That is the trial's no-write rule for architects (round 41, item 3, as applied). Neither definition has a Write tool (§0.3), so G6 bites on lead-data and is defensive for the other two.
- E5 runs after install. If it shows no `agentId` on a live subagent's call, G6 is removed by a class 5 amendment citing round 43, item 4.
- The write audit (`scripts/hooks/subagent-write-audit.mjs`) stays the primary check until E5 passes, and the backstop after it (round 43, item 4).

**2.8 N1** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:24` @ 1bb94e19 sha256:HASH-TBD). **Ruled by round 44, item 1:** O-4 as recommended, plus the parity test (§2.13); O-5 and O-6 as recommended.
- One unfiltered `tool.call` registration, with no `.catch` and no deny. Its first statement is `const ran = await next(e)`. A failure after that leaves `ran` standing (`state/consults/2026-10-03-guardian-v0-docs-read.md:63` @ 1bb94e19 sha256:HASH-TBD).
- It returns `ran` itself when `ran.deny !== undefined` or `e.agentId !== undefined`.
- `p` is the fill: the compaction-window percentage from a `{ breakdown: "summary" }` usage call, if Amendment 1 (P0b), item (v), shows that call to be local and to carry that window. Otherwise `p` is `context.percent` from the plain `$.session.usage()`. On the plain route, the README and the closing record disclose that N1 never fires if auto-compaction runs below 80% of the model's window. If `p` is absent, N1 returns `ran`.
- If `p < N1_THRESHOLD`, it clears `shownBands` (a module variable, lost on a hot reload; no `$.store`) and returns `ran`.
- `band = Math.floor(p / N1_BAND)`. If the band is in `shownBands`, it returns `ran`.
- Otherwise it calls `judgeContinuity(run)` from `./continuity.mjs`. Here `run = (args) => $.process.run(["git", ...args], { timeoutMs: PROCESS_TIMEOUT_MS })`, with `cwd` left as the session's.
- When the result is `{ judged: true, stale: true }`, it adds the band to `shownBands` and returns `{ ...ran, context: [...(ran.context ?? []), N1_TEXT(p)] }`. On any other result it returns `ran`.
- It never edits `result` or `text`. It reaches no other staleness judgment than `judgeContinuity`'s.

**2.8a `hooks/continuity.mjs`.** Its one export is `judgeContinuity(run)`, which returns `Promise<{ judged: false } | { judged: true, stale: boolean }>`. It imports nothing and makes no `$` call. Each call below is unreadable when `run` rejects, when `exitCode !== 0`, or when `isStdoutTruncated` is true. Every stdout is trimmed before use, as the Stop hook's `tryGit` trims.
1. `run(["log", "-1", "--format=%H", "HEAD", "--", "state/CUT-STATE.md"])`: unreadable means not judged. Empty output means judged fresh. Otherwise the output is `c`.
2. `run(["show", c + ":state/CUT-STATE.md"])`: unreadable means not judged. The output is parsed into `F_c`. No `flushed_at` means not judged.
3. `run(["show", c + "^1:state/CUT-STATE.md"])`: unreadable means judged fresh. The output is parsed into `F_p`. No `flushed_at` means judged fresh.
4. Stale iff `F_c === F_p`.
The parser restates `parseSessionContinuity`'s reading of `flushed_at`. It finds the `## SESSION-CONTINUITY` line after a split on `\r\n|\r|\n`, scans to the next heading, and trims the value. A comment names §0.3's two sources. This is the Stop hook's predicate step for step, including its fail-open readings, with only the log format narrowed to `%H`.

**2.9 Never done** (brief §1): rewriting a call's arguments; submitting a prompt; any `$.model` call; any network request; any `$.ui` call; any write.

**2.10 Coverage limit, as scope.**
- G2 to G4 and G6 guard Write and Edit.
- If Amendment 1 (P0b), item (ii), finds `MultiEdit` or `NotebookEdit` typed, they guard that tool too, on its path field, as `tool.call` hooks matching the write audit's tool list (round 44, item 1, O-7 as recommended).
- A Bash or PowerShell write (`sed -i`, a redirect, `tee`, `Set-Content`) is untouched, as it is for the write audit.

**2.11 The README** states, with no quotation:
- what Guardian refuses, and the ruling for each rule;
- that G5 is not in v0 (round 43, item 3);
- §1's limits;
- **install**, the human's alone, after his typed approval following both gates:
  - `claude plugin marketplace add <repository>/tools/mods --scope user`;
  - `claude plugin install spatial-guardian@spatial-ide-mods --scope user`;
  - `/reload-plugins`;
  - confirm the `/plugin` line the brief names (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:44` @ 1bb94e19 sha256:HASH-TBD).
  Install from a checkout on main. Never use `project` or `local` scope;
- **turning it off:**
  - Guardian alone: disable it in `/plugin`, or run `claude plugin disable spatial-guardian --scope user`;
  - one session: start with `--safe-mode`, which also disables the user's other customizations (§0.3);
  - never `disableAllHooks`, which also stops the repository's settings hooks (the Stop hook and the round mirror);
- uninstall: `claude plugin uninstall`;
- the brief's §5 acceptance and stop conditions, by reference (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:49-57` @ 1bb94e19 sha256:HASH-TBD);
- that false refusals are logged in the ledger and narrowed through the usual process;
- the `REPORT PATH:` convention (round 43, item 4);
- that N1's staleness check is held to the Stop hook's by T35. A change to either predicate is made with the other, in the same piece.

**2.12 Portability** (R1 to R6, `state/directives/PORTABILITY-2026-09-30.md:31-65` @ 1bb94e19 sha256:HASH-TBD; R3 per the template's platform section, `docs/PREREGISTRATION-TEMPLATE.md:177` @ 1bb94e19 sha256:HASH-TBD):
- **Owning boundary:** register.js's `place` and its normaliser, the mod's one OS-touching function.
- **Windows:** supported. Tested by `claude plugin test` with `\`, `/`, mixed-case and drive spellings, and live by E1 to E3.
- **macOS and Linux:** the mod is unavailable there. Guardian is not installed there, and no claim is made. T35 and T36 are Node tests: they run on Windows locally and on ubuntu-latest in governance-ci. macOS has no run.
- **R1:** one matcher everywhere (both separators, ASCII case-insensitive), and one staleness predicate.
- **R2 and R4:** no `process.platform` branch, and no drive letter outside `place`'s spelling rules. T35 and T36 use `os.tmpdir()`, argument arrays with no shell, and literal `/` in git paths, and never assume a branch name.
- **R5:** no product level is claimed.
- **R6:** no platform ignore.

**2.13 The parity test** (O-4's addition, round 44, item 1; `state/directives/2026-10-03-guardian-o3-o8-ruling.md:6-8` @ 1bb94e19 sha256:HASH-TBD).
- **The one fixture set** is the `FIXTURES` array in `scripts/hooks/guardian-continuity-parity.test.mjs`, one entry `{ id, build(dir) }` per §3 parity row. It lives nowhere else.
  - Each fixture is built once, into one fresh `os.tmpdir()` repository, set up as §0.3's existing helpers set theirs up. The helpers are restated, because importing a test file runs its tests.
  - Both sides read that one repository, so both read the same bytes.
  - The plugin's `claude plugin test` side does not read the fixtures, since it has no git. register.js's adapter is covered there by T26 to T32.
- **The mod's side.** `judgeContinuity` is imported from `../../tools/mods/spatial-guardian/hooks/continuity.mjs`: the module N1 calls, unchanged.
  - Its `run` is a Node runner shaped to §0.2 item 6's result type: `spawnSync("git", args, { cwd: dir, encoding: "utf8", timeout: 2000, maxBuffer: 64 * 1024 * 1024 })`.
  - It rejects when `error` is set. Otherwise it resolves `{ exitCode: status, stdout, stderr, isStdoutTruncated: false, isStderrTruncated: false }`.
  - It asserts that each stdout is under 4194304 bytes, so it never stands in for a truncation it does not model.
- **The Stop hook's side.** The test calls `decide` as shipped, with `projectRoot` set to the fixture's directory, a lease this session holds written untracked, and `background_tasks` non-empty. A fresh or not-judged block therefore ends at step 4's allow, and the plan is never read. The outcome is classified as:
  - stale: `decision` is `block` and the reason begins with the stale reason's fixed opening (`scripts/hooks/stop-queue.mjs:338` @ 1bb94e19 sha256:HASH-TBD, a sub-line span; the line's hash);
  - not judged: `stderr` holds the not-judged line's fixed opening (`scripts/hooks/stop-queue.mjs:330` @ 1bb94e19 sha256:HASH-TBD, a sub-line span; the line's hash);
  - fresh: otherwise.
  Both openings are the stale-continuity form's §7 texts. The test writes them out, as `hooks.test.mjs` writes out its reason, rather than importing them.
- **The environment.** The test sets `CUSTODIAN_TELEGRAM_DRY_RUN` and deletes `CUSTODIAN_STOP_HOOK`, `CUSTODIAN_TELEGRAM_BOT_TOKEN`, `CUSTODIAN_TELEGRAM_CHAT_ID` and `CLAUDE_CODE_REMOTE`, restoring each after. There is no network: HALT's fetch fails in a repository with no remote.
- **Agreement (T35).** For each fixture, a subtest named by the fixture's id asserts that the two outcomes are equal. Its message names both outcomes.
- **Non-degeneracy (T36).** Across the set, the Stop hook's side reaches each of stale, fresh and not judged at least once. A set on which both sides read everything the same way, such as git missing, fails.
- **How a divergence fails the gate.**
  - *In CI:* governance-ci's test step (§0.3) runs the new file by its glob. A divergence fails the named subtest, the step and the job. §9 makes green branch CI a precondition of either gate.
  - *In the reviewer's local run:* the same `node --test` command on Windows (§9) runs T35 and T36. Red fails the reviewer's gate.
  - *After the merge:* a PR touching `scripts/hooks/**`, where the Stop hook's side lives, already triggers governance-ci. This piece adds `tools/mods/**` to the push and the pull_request path filters (two lines), so a PR that touches only the mod triggers it too. A divergence then fails that PR's suite, and that piece repairs it under its own form.
- **`scripts/hooks/` changes by one new file only:** `scripts/hooks/guardian-continuity-parity.test.mjs`.
  - No line of `stop-queue.mjs`, `precompact-flush.mjs`, `hooks.test.mjs`, `README.md` or any other existing file there changes.
  - No export is added: `decide` is already exported (§0.3).
  - This touch is governed by this form alone, and no amendment is appended to the stale-continuity form. That form's piece is closed (its Amendment 3). This piece edits no file its §7 lists, and changes none of its claims.

## §3. Fixtures and predicted outcomes

For the plugin tests, the engine's answers are stubbed with the test's `on`, and there are no files on disk. `R` is a repository root spelled `C:\r` or `c:/r`.

| # | Call | Engine answers | Predicted |
|---|---|---|---|
| F1 | Bash `git push --force` / `-f` / `push -uf origin x` | none | refused, G1 |
| F2 | Bash `git push --force-with-lease` / `--force-with-lease=main:abc` | none | refused |
| F3 | Bash `git push origin +main` | none | refused |
| F4 | Bash `git push --mirror` | none | refused |
| F5 | Bash `git push --delete origin x` / `-d` / `origin :x` / `--prune` | none | refused |
| F6 | Bash `git -C sub -c a=b push -f`; `bash -c "git push --force"` | none | refused |
| F7 | Bash `git push "origin` (unbalanced) | none | refused |
| F8 | Bash `git push -u origin b`; `git push && rm -f x`; `git commit -m "push -f"` | none | `next(e)` |
| F9 | Write and Edit to `R\docs\01_Principles.md`, `r/DOCS/01_principles.md` | stat resolves | refused, G2 |
| F10 | Write to `R/docs/02_Architecture.md` | stat resolves | `next(e)` |
| F11 | Edit to an ADR whose status first word is `Accepted` | stat, read | refused, G3 |
| F12 | Write to a filed preregistration, content not prefixed by the current bytes | stat, read, cat-file 0 | refused |
| F13 | Write to the same, content = the current bytes + an addition | same | `next(e)` |
| F13e | Edit to the same: `old_string` = the file's last line, once; `new_string` = it + an addition | same | `next(e)` |
| F13x | Edit to the same: `old_string` once but not at the end | same | refused, G3 |
| F14 | Edit to a Proposed ADR; Edit to a preregistration with cat-file exit 128 | stat, read, cat-file 128 | `next(e)` |
| F15 | Write to a filed preregistration, read rejects | stat, read rejects | refused (catch) |
| F16 | Write to an existing `R/state/directives/x.md`; Edit to any such path | stat resolves | refused, G4 |
| F17 | Write to a new `R/state/directives/y.md` | own stat ENOENT, folder resolves | `next(e)` |
| F18 | Write to `D:x` and to `\\h\s\x` | none | refused, unplaceable |
| F19 | lead-data Write to a path not its REPORT PATH | list, messages, stat | refused, G6 |
| F20 | lead-data Write to its REPORT PATH, differently cased | same | `next(e)` |
| F21 | architect Write, brief with no line | list, messages | refused |
| F22 | worker Write; unlisted id Write; main-loop Write | list | `next(e)` (other rules apply) |
| F23 | Write to a filed preregistration, process.run unanswered | stat, read | refused (catch) |
| F24 | the same, process.run rejecting on timeout | same | refused (catch) |
| F25 | Bash in the main loop, percent 79, then 80, stale | usage, git | no line, then one line |
| F26 | percent 81, 85, 89, 90, stale throughout | same | lines at 81 and 90 only |
| F27 | percent 85; a flush-only, then an entry-plus-flush ledger commit | same | no line |
| F28 | percent 85 stale, with `agentId` set; a G-denied call | same | `ran` unchanged |
| F29 | percent 85 (line), 40, 85 | same | a line, none, a line |

**Parity fixtures (T35, T36).** Each is a real repository built by `scripts/hooks/guardian-continuity-parity.test.mjs`, with c0 holding a block with `flushed_at` A, then `## Ledger` and one entry. Each row names the stale-continuity form's scenario it mirrors. The prediction is that both sides read the outcome shown; a different outcome on which the two sides agree is a class 2 deviation, not a divergence.

| # | Mirrors | History | Predicted, both sides |
|---|---|---|---|
| PS1 | §3 S1 | c0, then c1 entry-only | stale |
| PS2 | §3 S2 | PS1, then c2 flush-only (B) | fresh |
| PS3 | §3 S3 | c0, then c1 entry plus flush (B) | fresh |
| PS4a | §3 S4a | a non-repository directory holding `state/CUT-STATE.md` | not judged |
| PS4b | §3 S4b | one commit, README only | fresh |
| PS5 | §3 S5 | c0; side s1 entry-only; main m1 flush-only (B); `merge --no-ff` gives M, differing from both | stale |
| PS6 | §3 S6 | c0; side s1 flush (B), s2 entry-only; main m1 README-only; merge M matches s2 | stale |
| PS7 | §3 S7 | c0 only | fresh |
| PS8 | §3 S8 | PS1, plus the working-tree block rewritten to B, uncommitted | stale |
| PS9 | §3 S9 | c0 (LF), then c1 whole-file CRLF plus an entry, `flushed_at` A | stale |
| PS10 | §3 S10 | c0 padded to 2 MiB, then c1 entry-only | stale |
| PS18 | Amendment 2, item 2 (T18) | c1 commits a block with no `flushed_at` line | not judged |
| PS19 | Amendment 2, item 2 (T19) | c1 removes `state/CUT-STATE.md` | not judged |

## §4. Tests, one mutation each

- **How a mutation is observed** (round 25, item 2 (c)): apply the mutation, run the test's runner, record the failing test by name in its `// RECORDED MUTATION:` comment, and revert. The runner is `claude plugin test tools/mods/spatial-guardian` for T1 to T34, and `node --test scripts/hooks/guardian-continuity-parity.test.mjs` for T35 and T36. The closing record names the commit each mutation was observed at, `claude --version` for T1 to T34, and `node --version` and `git --version` for T35 and T36. A `verify-mutation` run is not an observation.
- **What runs where.**
  - T1 to T34 (`tools/mods/spatial-guardian/test/guardian.test.ts`) need Claude Code, which no runner has. Their evidence of record is: the worker's full `claude plugin test` output, with `claude --version`, at a named commit; the reviewer's own run on the custodian's machine at the gated head; and `claude plugin validate tools/mods/spatial-guardian` and `claude plugin validate tools/mods` outputs, text and `--json`, in the PR body.
  - T35 and T36 (`scripts/hooks/guardian-continuity-parity.test.mjs`) run in governance-ci and in the reviewer's local suite.
  - CI also runs verify-cites, verify-quotes, verify-test-claims and verify:plan.
  - Before relying on verify-mutation, the worker states, at verify-mutation's commit, whether its scan covers `tools/mods/**/*.test.ts`. If it does not, the reviewer reads the comments.
- **The `agentId` cast** in G6's tests follows P0's probe (`state/consults/2026-10-03-guardian-v0-p0-report.md:748` @ 1bb94e19 sha256:HASH-TBD), and the test discloses it.

| # | Test | Fixture | Mutation |
|---|---|---|---|
| T1 | `G1 refuses --force, -f and a short-flag cluster holding f` | F1 | drop the cluster check |
| T2 | `G1 refuses --force-with-lease, bare and with a value` | F2 | match only the bare spelling |
| T3 | `G1 refuses a refspec that begins with +` | F3 | drop the `+` check |
| T4 | `G1 refuses --mirror` | F4 | drop `--mirror` |
| T5 | `G1 refuses a push that deletes a remote ref` | F5 | drop the `:` refspec check |
| T6 | `G1 finds the push after git global options and inside a quoted command string` | F6 | no nested rescan |
| T7 | `G1 refuses a push segment it cannot tokenise` | F7 | treat a tokenise failure as no push |
| T8 | `G1 allows an ordinary push and a force flag that belongs to another command` | F8 | scan the whole command without splitting into segments |
| T9 | `G1 refuses a force-push through the PowerShell tool` (only if Amendment 1 (P0b), item (i), finds it typed) | F1 via PowerShell | drop the PowerShell registration |
| T10 | `G2 refuses a Write and an Edit to docs/01_Principles.md in every spelling` | F9 | a case-sensitive suffix compare |
| T11 | `G2 allows a Write beside docs/01_Principles.md` | F10 | match on the `/docs/` segment |
| T12 | `G3 refuses an Edit to an accepted ADR` | F11 | protect only on a literal `Accepted —` |
| T13 | `G3 refuses a Write that does not start with a filed preregistration's current bytes` | F12 | `includes` in place of `startsWith` |
| T14 | `G3 allows a pure-append Write to a filed preregistration` | F13 | refuse every Write to a protected file |
| T15 | `G3 allows an Edit to a Proposed ADR and to an untracked preregistration` | F14 | ignore cat-file's exit code |
| T16 | `G3 refuses when the current bytes cannot be read` | F15 | catch the read error and allow |
| T17 | `G4 refuses a Write to an existing directive and any Edit under state/directives/` | F16 | refuse Edit only |
| T18 | `G4 allows a Write that creates a new directive` | F17 | refuse on the segment alone |
| T19 | `Write and Edit refuse a path that cannot be placed` | F18 | treat an unplaceable path as unprotected |
| T20 | `G6 refuses a lead-data Write outside its declared REPORT PATH` | F19 | compare basenames only |
| T21 | `G6 allows a lead-data Write to its declared REPORT PATH` | F20 | a case-sensitive compare |
| T22 | `G6 refuses every Write by an architect run whose brief declares no REPORT PATH` | F21 | a missing line read as allow |
| T23 | `G6 leaves other subagents, unlisted agent ids and the main loop to the other rules` | F22 | apply G6 to every listed type |
| T24 | `a refusing hook that throws is refused by its catch` | F23 | remove the Write registration's `.catch` |
| T25 | `a refusing hook whose process call times out is refused` | F24 | a `.catch` that returns `undefined` |
| T26 | `every process call is git and carries the declared timeout` | F12, F25 | drop `timeoutMs` from N1's git adapter |
| T27 | `N1 appends no line below 80 percent and one line at 80 percent on a stale block` | F25 | `>` in place of `>=` |
| T28 | `N1 appends at most one line per 10-point band` | F26 | never record a shown band |
| T29 | `N1 appends nothing on a fresh block` | F27 | N1 skips `judgeContinuity` and treats every block as stale |
| T30 | `N1 appends nothing for a subagent call or a refused call` | F28 | drop the `agentId` check |
| T31 | `N1 clears its bands after the fill falls below 80 percent` | F29 | never clear `shownBands` |
| T32 | `N1's line is the declared text with the integer percent` | F25 | an unrounded percent |
| T33 | `G3 allows an Edit that only appends at the end of a filed preregistration` | F13e, F13x | the `endsWith` check dropped |
| T34 | `G2 to G4 cover MultiEdit` (only if Amendment 1 (P0b), item (ii), finds it typed) | F9 via MultiEdit | drop the MultiEdit registration |
| T35 | `guardian parity: the mod's stale-block check and the Stop hook's stale-continuity check agree on every fixture` | PS1 to PS19 | M35a, mod side: `continuity.mjs` reads a failed `git log` as judged fresh (PS4a diverges). M35b, Stop side, in the working tree only and reverted, never committed: `judgeContinuity`'s comparison in `stop-queue.mjs` inverted (PS1 diverges) |
| T36 | `guardian parity: the fixture set reaches stale, fresh and not judged on the Stop hook` | PS1 to PS19 | M36: every fixture's `build` replaced by PS7's |

**E-rows**, live and after install. Each runs only if the human's typed install approval names it, and the custodian records each as a class 1 row on main.
- **E0:** the `/plugin` line, `claude --version`, and whether the installed plugin is a copy of `tools/mods/` or a reference to it (§1).
- **E1 to E3:** an Edit whose `old_string` matches nothing, on `docs/01_Principles.md`, on an existing directive and on an accepted ADR. Predicted: Guardian's reason, never the Edit tool's not-found error. If a rule fails open, the tool writes nothing.
- **E5** (round 43, item 4): a labelled probe lead-data run that declares a REPORT PATH and is asked to Write once to a second scratch path. Predicted: refused. Its expected write-audit VOID is recorded as the probe's. Until E5 passes, the write audit stays primary.
- **E6:** N1's first natural firing. The record carries the percent, the line as the model reports it, and the flush that followed.
- **No live G1 probe**, under round 34, item 3.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions:**
- T1 to T33, T35 and T36 pass at the head, and each fails under its mutation. T9 and T34 do the same where Amendment 1 (P0b) brings them in;
- every existing test under `scripts/plan/` and `scripts/hooks/` passes, unchanged;
- `validate` prints only §2.0's hooks and calls;
- E0 to E6 come out as §4 predicts.

**Declared unchanged:** every path outside `tools/mods/` except the two §7 names outside it. In particular:
- every existing file in `scripts/hooks/`: `stop-queue.mjs`, `precompact-flush.mjs`, `hooks.test.mjs`, `README.md`, the scanner and the write audit;
- every line of `.github/workflows/governance-ci.yml` other than the two `tools/mods/**` filter entries;
- `.claude/settings.json`, `.claude/agents/**`, the root `.gitignore`, `AUTONOMY.md` and `AI_DEVELOPMENT.md`;
- `scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md`, to which no amendment is appended.

**Invalidators (stop, to the custodian):**
- **I1:** P0b contradicts §2; or the test kit cannot answer an event §4 needs; or the build refuses register.js's import of `./continuity.mjs`.
- **I2:** `claude --version` is not 2.1.288 at any run of record. Every plugin test and `validate` is re-run, and the change is recorded.
- **I3:** `validate` shows a hook or call outside §2.0.
- **I4:** a rule needs a call outside §2.0.
- **I5:** §7's file count is exceeded.
- **I6:** any step would install, enable or load the mod into a session, add a marketplace, or write under the user Claude directory.
- **I7:** the `state/CUT-STATE.md` blob at the merge base is 4194304 bytes or more.
- **I8:** T35 cannot be made to pass without editing an existing `scripts/hooks/` file, adding an export to `stop-queue.mjs`, or changing the Stop hook's predicate. Which form would govern that change is the custodian's to route, and it is not made under this one.

**Falsification:**
- a refusal fixture reaches `next(e)`, or an allowed fixture is refused;
- the call of a refusing hook that throws or times out runs;
- N1 fires twice in one band, for a subagent, or on a block `judgeContinuity` does not judge stale;
- on any parity fixture, the mod's outcome and the Stop hook's differ (T35). This fails the gate (round 44, item 1).

## §6. Instruments

Assertions only:
- deny or `next(e)`, the reason text, the `context` array, and the arguments the stubs receive;
- the two parity outcomes per fixture;
- `claude --version`, `node --version` and `git --version`;
- `validate`'s two lines;
- verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with the tool's commit (round 15 (c)).

## §7. Declared values and ceilings

- `PROCESS_TIMEOUT_MS = 2000` for each git call, in G3 and in N1's adapter.
- `N1_THRESHOLD = 80` and `N1_BAND = 10`. `shownBands` clears below the threshold.
- `N1_TEXT(p)`: the brief's quoted N1 sentence, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:24` @ 1bb94e19 sha256:HASH-TBD (a sub-line span; this is the line's hash), with `N` replaced by the integer `p`. It is byte-copied into the code, and T32 asserts it.
- The protected forms: the suffix `/docs/01_principles.md`; the ADR suffix pattern `/docs/adr/adr-<digits>-<name>.md` with its 10-line status window; the basename ending `preregistration.md`; the segment `/state/directives/`.
- The report-only types: `architect`, `lead-data`, `evidence-reader`. The line pattern: `^REPORT PATH: (.+)$`.
- **The parity values:**
  - the fixture ids PS1, PS2, PS3, PS4a, PS4b, PS5, PS6, PS7, PS8, PS9, PS10, PS18, PS19, thirteen in all. T35 asserts the set is exactly these;
  - the runner's per-call timeout is 2000 ms, its buffer 64 MiB, and its stdout bound 4194304 bytes;
  - the ledger path is `state/CUT-STATE.md`.
- **Reasons**, each starting `spatial-guardian <id>:`, with no path from the call, and worded for the human's sight before install (§9). The worker writes each as one sentence, and the strings are §7's declared values. In paraphrase:
  - `G1_REASON`: refused, because this git push force-pushes or deletes a remote ref (round 34, item 3);
  - `G2_REASON`: docs/01 is never edited;
  - `G3_REASON`: an accepted ADR or a filed preregistration changes only by appending;
  - `G4_REASON`: an existing directive is never rewritten;
  - `G6_REASON`: this run writes only its brief's REPORT PATH;
  - `UNPLACEABLE_REASON`: the path cannot be placed, so it is refused;
  - `CATCH_REASON`: a check could not complete, so the call is refused.
- **Size:** at most 1650 changed lines, insertions plus deletions, over at most 10 files:
  - `tools/mods/.claude-plugin/marketplace.json`;
  - `tools/mods/spatial-guardian/.claude-plugin/plugin.json`;
  - `tools/mods/spatial-guardian/hooks/hooks.json`;
  - `tools/mods/spatial-guardian/hooks/register.js`;
  - `tools/mods/spatial-guardian/hooks/continuity.mjs`;
  - `tools/mods/spatial-guardian/test/guardian.test.ts`;
  - `tools/mods/spatial-guardian/README.md`;
  - `tools/mods/spatial-guardian/.gitignore`;
  - `scripts/hooks/guardian-continuity-parity.test.mjs`;
  - `.github/workflows/governance-ci.yml`, two added lines.
  - Counting command: `git diff --numstat <base>..<head> -- . ':!tools/mods/GUARDIAN-V0-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, where `<base>` is the merge base on main and `<head>` a named commit. An overrun is class 8, and this line is never edited.
  - Estimate: register.js 380, continuity.mjs 70, plugin tests 700, parity test 260, README 100, the workflow 2, the rest 40.
- **Minutes:** the node's `budget_minutes` (AUTONOMY §10).

## §8. Block-on-sight

1. A `tool.check` hook; an `allow`; `next(` called with anything but the received event; a `$.model`, `$.ui`, prompt, network or write call; any `$.fs.write`.
2. A refusing registration without `.catch`, or a `.catch` body that is not a synchronous constant deny.
3. A `$.process.run` call site without `timeoutMs` at or under §7, or whose `argv[0]` is not the literal `git`.
4. A `turn.step` or `agent.spawn` hook; a `$.store` call; a hook or call outside §2.0.
5. Any G5 code, test, option or placeholder (round 43, item 3). Code for §2.10's extension before Amendment 1 (P0b), item (ii), is recorded. N1 code on the summary-breakdown route before item (v) is recorded.
6. An npm dependency, a `package.json` or a lockfile; `.claude-plugin/types/` committed.
7. Any install, enable, marketplace add, `--plugin-dir` session, or write under the user Claude directory, by anyone in the piece.
8. A README that names `disableAllHooks` as an off-switch, or a `project` or `local` scope.
9. A copy of the scanner's matcher.
10. An OS branch in path logic; a drive-letter assumption outside `place`; a path from the call in a reason.
11. A user-profile path in any file, test or commit message.
12. A test without its `RECORDED MUTATION`; a record that calls a `verify-mutation` run an observation; a mutation recorded without its observation commit.
13. A §7 overrun not recorded as class 8, or §7 edited; any code of a scope addition before its class 9 amendment.
14. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id;
    - a bare self-line;
    - a pin read as current;
    - a correction round without its superseded index;
    - an amendment numbered before Amendment 1 (P0b).
15. A file outside §7's list, apart from this form and the custodian's generated set.
16. A squash or rebase merge, or any force-push.
17. A reason that states another module's consequence (round 7).
18. On the parity test:
    - a second staleness predicate anywhere in the plugin;
    - `continuity.mjs` with an import, a `$` call, or an export other than `judgeContinuity`;
    - T35 reading the Stop hook's side through anything other than the shipped `decide`, such as a restated copy;
    - a fixture defined outside `FIXTURES`, or read by one side only;
    - a `skip`, `todo` or platform condition on T35 or T36;
    - a divergence waived, or a fixture dropped to clear one;
    - any edit to an existing `scripts/hooks/` file, or a new export there.

## §9. Gates

- **Architect:**
  - the Gating heads;
  - the brief's §1 to §5 against §2;
  - each ruling against §2: round 43, items 3 and 4; round 44, item 1;
  - the parity design (§2.13) against round 44, item 1: one fixture set, both sides, and the failure route in CI and locally;
  - the seams (§1);
  - R1 to R6 against §2.12;
  - round 7 on §7's reasons;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - `claude plugin test` and both `validate` runs on the custodian's machine, with `claude --version`;
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` on Windows, with T35 and T36 named in its output;
  - every mutation observed at the gated head, including M35a, M35b and M36;
  - §7 recounted;
  - §8 item 3 checked by reading every `$.process.run` call;
  - I7 checked at the merge base.
- **Suites, green before either gate:**
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` on Windows, and governance-ci on ubuntu-latest;
  - §6's tools;
  - the branch CI read before gating.
- **Operator:**
  - the human sights §7's reasons and the README's install and off steps;
  - then gives his typed install approval, which names the E-rows he allows;
  - he installs it himself;
  - the custodian records E0 to E6.

## §10. Amendments — opens empty, append-only (classes 1 to 9; each correction round ends with a superseded index). Amendment 1 is P0b's record (§0.4); nothing precedes it.
```

(2) Changes from draft 1, by section:

- **Header.**
  - Pins re-pinned from b64a8d39 to 1bb94e19 throughout. I checked every re-pinned range against the tree at 1bb94e19, and none of the ranges moved; `PLAN.yaml:3814-3830` is still the node.
  - Authority gains round 43, items 3 and 4, and round 44, item 1, with the directive pin at its lines 6-8.
  - G5's round 29 is marked out of v0.
  - The Drafted-by line names draft 2 and draft 1's file.
  - The Custodian's-edits line is left for you.
- **§0.2.**
  - Item 1 now points to E5 (round 43, item 4) instead of O-2.
  - Items 2 and 3 cite round 44, item 1, instead of O-5 and O-6.
  - Item 5 gains the `.mjs` fact: a span of `<skill-root>/reference.md:14`, via P0's line 616.
  - Item 6 gains `$.process.run`'s result shape. The `<skill-root>` cite is unchanged.
  - Item 7's G5 clause now cites round 43, item 3.
- **§0.3.**
  - The scanner pins are removed, since G5 is out.
  - Added: the pins for `decide`, the continuity step, the step-4 allow and the hooks.test.mjs fixture helpers; the stale-continuity form, by section and amendment; governance-ci's test step and path filters, in words.
  - The dev-mods fact is re-sourced to the custodian's ledger entry, by name and without a line, because draft 1's continuity-block judgment number is not stable.
- **§0.4.** P0b is kept. It is now Amendment 1, headed P0b, and is §10's first amendment, with nothing before it. Later amendments number from 2, and in-form references say Amendment 1 (P0b), item (x). O-6 and O-7 references became §2.8 and §2.10.
- **§0.5.** Parity fixtures are noted as test fixtures.
- **§1.**
  - May-claim 5 added (T35, T36).
  - May-not-claim gains: engine-path parity, the 4 MiB regime, a worktree working directory, and G5.
  - Scope limits name the two touches outside `tools/mods/`.
  - Seams: the G5 seam is removed. Added: register.js to continuity.mjs, and the parity seam through `decide`. The G6 seam now cites round 43, item 4.
- **§2.0.**
  - `continuity.mjs` added.
  - The hooks line now covers MultiEdit and NotebookEdit if P0b (ii) finds them typed (O-7, round 44, item 1).
  - The calls line is confirmed as reads (O-3).
- **§2.1.** In (c), the git literal and timeout apply at every call site. In (g), G5 is removed from the order.
- **§2.4.** O-8 (a) is written in as a rule (append-shaped Edit allowed).
- **§2.6.** Rewritten: G5 is out by round 43, item 3. No code and no placeholder. The `$.fs.write` and non-git process exceptions are removed. The node `profile-path-scan-stdin-mode` is pinned.
- **§2.7.** The OPEN marker is replaced by round 43, item 4. E5 and the class 5 removal path are stated. The write audit stays primary until E5.
- **§2.8.** The OPEN marker is replaced by round 44, item 1. The inline git sequence is replaced by a call to `judgeContinuity`. The O-6 (b)/(a) rule is stated.
- **§2.8a.** New: continuity.mjs's contract, step for step against `judgeContinuity` in stop-queue.mjs, including the truncation reading.
- **§2.10.** O-7 (a) is written in.
- **§2.11.** "Under O-2 (a)" removed. Added: the G5-out line and the parity line.
- **§2.12.** Covers the parity test on Windows and Linux; macOS is not run.
- **§2.13.** New: the parity test's design, scope and failure route, and how it is governed.
- **§3.** Added: F13e and F13x (O-8), and the parity table PS1 to PS19.
- **§4.**
  - T35 and T36 (G5) are removed. T35 and T36 are now the parity tests, numbered again.
  - T20 to T23 lose "(O-2)", and T33 is no longer conditional.
  - T26's and T29's mutations are re-aimed at the adapter and at continuity.
  - What-runs-where is rewritten.
  - E5 cites round 43, item 4.
- **§5.**
  - Predictions updated, and the `$.fs.write` clause removed.
  - Declared-unchanged rewritten for the scripts/hooks and governance-ci touches.
  - I1 widened to cover the import of continuity.mjs. I4 drops "no OPEN ruling admits".
  - I7 (4 MiB) and I8 (parity needing a scripts/hooks edit) added.
  - Falsification uses T35.
- **§6.** Adds the parity outcomes, `node --version` and `git --version`.
- **§7.**
  - `SCAN_TIMEOUT_MS` removed.
  - Parity values added.
  - Reasons are marked as paraphrase.
  - Size is now 1650 lines over 10 files, replacing 1400 over 8: continuity.mjs, the parity test and the workflow replace the spare.
- **§8.**
  - Item 1: the `$.fs.write` exception is removed.
  - Item 3: the scanner exception is removed.
  - Item 5: rewritten for G5 out and the P0b conditions.
  - Item 14: gains the amendment-order line.
  - Item 18 is new (parity).
- **§9.** The architect checks the rulings and the parity design. The reviewer runs the node suite and observes M35a, M35b and M36, and checks I7.
- **§10.** The heading states that Amendment 1 is P0b.
- **The OPEN list** (draft 1's part 2) is removed. Every item is ruled.

(3) Questions for the human:

- Do you take the two `tools/mods/**` lines in governance-ci's path filters, so that a PR touching only the mod still runs the parity test in CI? Or should `.github` stay unchanged and the gap be disclosed instead?

(4) Files read, all at main 1bb94e19:
- C:\dev\spatial-ide\state\consults\2026-10-03-guardian-v0-architect-draft.md
- C:\dev\spatial-ide\state\directives\2026-10-03-guardian-o3-o8-ruling.md
- C:\dev\spatial-ide\DECISIONS-PENDING.md (lines 1-90: the round 43 and 44 RULED blocks)
- C:\dev\spatial-ide\PLAN.yaml (lines 3810-3903)
- C:\dev\spatial-ide\scripts\hooks\stop-queue.mjs
- C:\dev\spatial-ide\scripts\hooks\precompact-flush.mjs (lines 40-99)
- C:\dev\spatial-ide\scripts\hooks\STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md
- C:\dev\spatial-ide\scripts\hooks\hooks.test.mjs (lines 1-178)
- C:\dev\spatial-ide\.github\workflows\governance-ci.yml (lines 1-159)
- C:\dev\spatial-ide\state\directives\MODS-GUARDIAN-V0-2026-10-03.md
- C:\dev\spatial-ide\state\directives\2026-10-03-guardian-v0-direction.md
- C:\dev\spatial-ide\state\directives\2026-10-03-write-audit-ruling.md
- C:\dev\spatial-ide\state\directives\2026-10-03-lead-data-pilot-direction.md (lines 29-34)
- C:\dev\spatial-ide\state\consults\2026-10-03-guardian-v0-docs-read.md
- C:\dev\spatial-ide\state\consults\2026-10-03-guardian-v0-p0-report.md (lines 6-9, 195-208, 527-532, 608-619, 745-749, 858-882, 936-1010; grep)
- C:\dev\spatial-ide\AUTONOMY.md (lines 306-365)
- C:\dev\spatial-ide\AI_DEVELOPMENT.md (lines 449-455)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (lines 96-178)
- C:\dev\spatial-ide\state\CUT-STATE.md (grep only)
- The scripts/hooks file list, by glob; the root package.json, which does not exist.

I read no `<skill-root>` file; every `<skill-root>` cite is P0's. This run made no write-capable call: Read, Grep and Glob only.

https://claude.ai/code/session_01JeU7h98xrTorztiep3Zgmg
