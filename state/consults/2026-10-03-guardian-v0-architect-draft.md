*Custodian's filing note (2026-10-03): the architect's draft of guardian-v0's full-form preregistration, on the custodian's brief, from P0 (`state/consults/2026-10-03-guardian-v0-p0-report.md`) and its install-scope supplement (`state/consults/2026-10-03-guardian-v0-docs-read.md`). It arrived as a message, since the architect has no Write tool, and is transcribed here from its hand-back with the harness's two-space indent removed. One harness line above the report, which flagged the report's settings-file wording as instruction-shaped, is the harness's and is left out. Write audit PASS: zero write calls (Read 24, Grep 9, Glob 7). C3: before 18:45:02Z at b64a8d39, after 18:58:16Z at 4dfc5da6; HEAD moved only by the custodian's commits, and the one worktree difference is the custodian's own staged filing of the node 10 consult. The draft is not yet a form: its OPEN items O-1 to O-8 go to the human in the next batched round, and the form is committed only after that, with the custodian's hashes.*

---

Reviewed: main @ b64a8d39

(1) The form. Proposed path: `tools/mods/GUARDIAN-V0-PREREGISTRATION.md`. Why there: it sits inside the piece's own path (`tools/mods/`, which is disjoint from engine/ and kernel/ under the trial). It sits beside the plugin folder, not inside it, so an install never carries it. Its name ends in `PREREGISTRATION.md`, so once filed it falls under G3 itself and under verify-test-claims' planned-claims reading. The custodian sets PLAN node `guardian-v0`'s `gate:` to this file in the same commit.

```
# Guardian v0 — the first Spatial IDE mod: a refuse-only plugin at tools/mods/spatial-guardian/ (PLAN node `guardian-v0`) — preregistration

**Authority:**
- the 2026-10-03 Guardian v0 direction: `state/directives/2026-10-03-guardian-v0-direction.md:12-14` @ b64a8d39 sha256:HASH-TBD (RULED 2026-10-03, the Guardian v0 block in `DECISIONS-PENDING.md`, cited by its heading and not by line);
- Fable's brief: `state/directives/MODS-GUARDIAN-V0-2026-10-03.md` (whole-file sha256 6d156511936465a831e9e197d42db4cdee2b8199ca838e7021071b6318a4f6e8). Its parts are cited below by section, rule id and pinned line;
- the node: `PLAN.yaml:3814-3830` @ b64a8d39 sha256:HASH-TBD.
The rules enforced are cited by round and item: round 34, item 3 (force-push); round 41, item 3 (the write audit, `state/directives/2026-10-03-write-audit-ruling.md:7-9` @ b64a8d39 sha256:HASH-TBD); round 29 (the exposure rule); and AUTONOMY §7 (the flush).
**Drafted by** the architect agent on the custodian's brief, read at `main` b64a8d39. It is architect-drafted because it crosses no engine/ or kernel/ path (`state/directives/2026-10-03-lead-data-pilot-direction.md:31-33` @ b64a8d39 sha256:HASH-TBD). Nothing was run for this draft. **Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** <the custodian fills this line: the hashes computed, and anything else changed>.
**Gating:** full, reviewer and architect, on two heads, each enough alone:
- **§21a, security posture.** The direction line names installing Guardian a security-posture change (`state/directives/2026-10-03-guardian-v0-direction.md:12-14` @ b64a8d39 sha256:HASH-TBD; `AUTONOMY.md:315-332` @ b64a8d39 sha256:HASH-TBD). This piece builds the artefact that would be installed.
- **§21c size** (`AUTONOMY.md:347-357` @ b64a8d39 sha256:HASH-TBD): over the bound (§7).
Under round 25, item 2 (e), no five-line form is used.
**Red line.** Installing Guardian is the human's alone: his typed approval after both gates, and he installs it himself (brief §4, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:44` @ b64a8d39 sha256:HASH-TBD; `AI_DEVELOPMENT.md:451-454` @ b64a8d39 sha256:HASH-TBD). Nothing in this piece installs, enables or loads the mod into a session, adds a marketplace, or starts a session with it.

## §0. Disclosure

**0.1 Inputs.** These are Evidence, not Authority:
- P0, `state/consults/2026-10-03-guardian-v0-p0-report.md`, run against Claude Code build 2.1.288;
- the install-scope supplement, `state/consults/2026-10-03-guardian-v0-docs-read.md`. Its filing note was read first. Part 1's line 56 (`state/consults/2026-10-03-guardian-v0-docs-read.md:56` @ b64a8d39 sha256:HASH-TBD) is wrong, per the note (`state/consults/2026-10-03-guardian-v0-docs-read.md:1` @ b64a8d39 sha256:HASH-TBD) and P0's timeout probe, and nothing here relies on it.
The build's files are cited as `<skill-root>/<file>:<line>`, with file sha256 values from P0 (`state/consults/2026-10-03-guardian-v0-p0-report.md:1005-1006` @ b64a8d39 sha256:HASH-TBD):
- `<skill-root>/types/claude-code.d.ts` is 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1;
- `<skill-root>/reference.md` is ad5f1688672600495233d09b597c1bc4ef5d8f790c32caf9490d4fd2e5bb71f4.
Every build fact is a claim about build 2.1.288 (round 15 (c)). It is not current for any other build (§5 I2).

**0.2 The brief's §3 answers, each with its source.**
1. **Agent identity.** On the types, yes. `tool.call` carries `agentId` in a subagent's loop and none on the main loop, and `$.agent.list()` rows carry the same `id` and a `type`. Sources: `<skill-root>/types/claude-code.d.ts:164-182`, `<skill-root>/types/claude-code.d.ts:121-139` and `<skill-root>/types/claude-code.d.ts:11953-11961`; P0's answer at `state/consults/2026-10-03-guardian-v0-p0-report.md:8` @ b64a8d39 sha256:HASH-TBD.
   - The brief is reachable by reads (`$.session.messages({ agentId })`), or by an `agent.spawn` hook: `state/consults/2026-10-03-guardian-v0-p0-report.md:205` @ b64a8d39 sha256:HASH-TBD.
   - The probe passed `agentId` through a type cast (`state/consults/2026-10-03-guardian-v0-p0-report.md:197` @ b64a8d39 sha256:HASH-TBD).
   - That a live subagent's calls carry the id is the build's type claim, unverified without a live session. That is O-2.
2. **Tool-result shape.** Bash, Grep and Read results are typed: `<skill-root>/types/claude-code.d.ts:19178-19186`, `<skill-root>/types/claude-code.d.ts:19495-19506` and `<skill-root>/types/claude-code.d.ts:19809-19822`. The typed way to add a line after a result is the `context` field, returned beside the result from `next(e)`, which the model reads and the user does not see (P0's answer, `state/consults/2026-10-03-guardian-v0-p0-report.md:207` @ b64a8d39 sha256:HASH-TBD).
   - The field's own doc lines are not among P0's excerpts. P0b item (iv) reads them.
   - Delivery to the model is unverified live. That is O-5.
3. **Context fill.** `$.session.usage()` gives `context.percent`, the status line's percentage over the model's window, absent until the first response of a live window: `<skill-root>/types/claude-code.d.ts:10257-10280`, `<skill-root>/types/claude-code.d.ts:2621-2642`. `turn.step` carries the four counts but no window size: `<skill-root>/types/claude-code.d.ts:12619-12661`, `<skill-root>/types/claude-code.d.ts:12681-12715`.
   - The compaction window may be smaller than `window` (a sub-line span of `<skill-root>/types/claude-code.d.ts:10285`). That is O-6.
   - P0's reading: no `turn.step` hook is needed (`state/consults/2026-10-03-guardian-v0-p0-report.md:529` @ b64a8d39 sha256:HASH-TBD).
4. **Install scope.** The docs read covers this:
   - user scope records the plugin in the user settings file, which is not committed (`state/consults/2026-10-03-guardian-v0-docs-read.md:16` @ b64a8d39 sha256:HASH-TBD);
   - a cloud session loads neither user-installed plugins nor the ones the repository's settings turn on (`state/consults/2026-10-03-guardian-v0-docs-read.md:25` @ b64a8d39 sha256:HASH-TBD);
   - both quotations were checked against the pages (`state/consults/2026-10-03-guardian-v0-docs-read.md:94-104` @ b64a8d39 sha256:HASH-TBD).
   The commands, from the build's help text: `state/consults/2026-10-03-guardian-v0-p0-report.md:531` @ b64a8d39 sha256:HASH-TBD.
   - The marketplace shape validated with exit 0.
   - `hooks.json` `modules` must be an array of exactly one path.
   - P0 does not establish whether an install copies the plugin folder or references it (§1, may not claim; E0).
5. **Tests.** `claude plugin test <dir>` runs every `*.test.ts` and `*.test.tsx` under the folder, in a child of the binary, with no fs, network or process, and starts no session. A test answers the engine's events beneath the plugin, and an unanswered event throws: `state/consults/2026-10-03-guardian-v0-p0-report.md:660` @ b64a8d39 sha256:HASH-TBD; `<skill-root>/types/claude-code.d.ts:14902-14913`; sub-line spans of `<skill-root>/reference.md:75`.
6. **Limits.** The hook budget is 10 000 ms and the `.catch` grace 1 000 ms, and the clock stops while a `next` or `$` call is in flight (`<skill-root>/types/claude-code.d.ts:4804-4820`, `<skill-root>/types/claude-code.d.ts:8675-8691`).
   - A failed hook with no `.catch` is skipped and the call runs (the probe at `state/consults/2026-10-03-guardian-v0-p0-report.md:863` @ b64a8d39 sha256:HASH-TBD).
   - A `.catch` that returns `undefined` or overruns leaves the hook absent (`<skill-root>/types/claude-code.d.ts:994-1002`).
   - A hung `$.process.run` does not trip the budget. It has its own 30 s default (`<skill-root>/types/claude-code.d.ts:3291-3307`; P0 at `state/consults/2026-10-03-guardian-v0-p0-report.md:864` @ b64a8d39 sha256:HASH-TBD).
7. **`claude plugin validate`.** The two lines are `hooks:` and `calls:` (`state/consults/2026-10-03-guardian-v0-p0-report.md:866` @ b64a8d39 sha256:HASH-TBD; probe output at `state/consults/2026-10-03-guardian-v0-p0-report.md:880-881` @ b64a8d39 sha256:HASH-TBD).
   - The `calls:` line names `$.process.run` whatever its argv, so it cannot show whether a process call is `git` (§2.1(e), §8 item 3).
   - A hooks module imports only its own files and `claude-code`, so the repository scanner cannot be imported (G5, O-1).
   - The calls each rule needs: `state/consults/2026-10-03-guardian-v0-p0-report.md:991-1000` @ b64a8d39 sha256:HASH-TBD.
   - The coverage limit: `state/consults/2026-10-03-guardian-v0-p0-report.md:1002` @ b64a8d39 sha256:HASH-TBD.

**0.3 Repository facts relied on.**
- The scanner reads content only from files or git: its modes are at `scripts/hooks/profile-path-scan.mjs:627-682` @ b64a8d39 sha256:HASH-TBD, and its Node imports at `scripts/hooks/profile-path-scan.mjs:16-20` @ b64a8d39 sha256:HASH-TBD. Its clean and refused lines: `scripts/hooks/profile-path-scan.mjs:618` @ b64a8d39 sha256:HASH-TBD and `scripts/hooks/profile-path-scan.mjs:625` @ b64a8d39 sha256:HASH-TBD.
- The Stop hook's staleness predicate: `scripts/hooks/stop-queue.mjs:221-244` @ b64a8d39 sha256:HASH-TBD. The block grammar: `scripts/hooks/precompact-flush.mjs:57-79` @ b64a8d39 sha256:HASH-TBD.
- Agent tool lists:
  - lead-data alone has Write (`.claude/agents/lead-data.md` line 4 at b64a8d39);
  - architect and evidence-reader have none (`.claude/agents/architect.md` line 4 and `.claude/agents/evidence-reader.md` line 4 at b64a8d39);
  - these are named in words, because the dot-prefixed paths are not read by verify-quotes' grammar; the custodian computes their hashes.
- The off-switches: `--safe-mode` also disables the user's other customizations (`state/consults/2026-10-03-guardian-v0-docs-read.md:99` @ b64a8d39 sha256:HASH-TBD); `disableAllHooks` also stops the settings hooks (`state/consults/2026-10-03-guardian-v0-docs-read.md:104` @ b64a8d39 sha256:HASH-TBD).
- The session's dev-mods folder is watched while the plugin-authoring skill is loaded (the continuity block's half-made judgment 11 at b64a8d39). Writing there raises a mod load.

**0.4 P0b, read-only, before any code.** The worker reads `<skill-root>/types/claude-code.d.ts` and records five things as Amendment 1 (class 1, written after the read) before any code:
- (i) whether the `ToolCallInput` union names a `PowerShell` tool and its command field;
- (ii) whether it names `MultiEdit` or `NotebookEdit`, and their path fields;
- (iii) the row type of `$.session.messages` and whether its first row is the Agent call's prompt, by the types;
- (iv) the `context` field's doc lines on `ToolCallResult`;
- (v) whether a test's `on` can answer `fs.stat`, `agent.list` and `session.messages`, and whether a `{ breakdown: "summary" }` usage call makes no network request and carries the compaction window.
Each item is cited `<skill-root>/types/claude-code.d.ts:<lines>`. A finding that contradicts §2 STOPS the piece (§5 I1). (ii) feeds O-7, and (v)'s second half feeds O-6.

**0.5** No measurement, no fixture, no fixture drive.

## §1. May and may not claim

**May claim** (under `claude plugin test` on build 2.1.288, Windows):
1. Each kept rule refuses its §3 refusal cases and passes its allowed cases to `next(e)` unchanged.
2. A refusing hook that throws, or whose `$` call rejects or times out, ends in a deny.
3. N1's threshold, band and staleness behaviour, as §2.8 declares.
4. `claude plugin validate` lists only §2.0's hooks and calls.

**May not claim:**
- any live behaviour before its E-row (§4): `agentId` on a live subagent's calls; `context` reaching the model; `realPath` spellings; the live percent figure;
- writes by Bash, PowerShell or any tool but those §2 registers (P0's coverage limit, `state/consults/2026-10-03-guardian-v0-p0-report.md:1002` @ b64a8d39 sha256:HASH-TBD). A round 15 (f) restore done with git is unseen by G3;
- for G1: aliases, scripts, configured `+` refspecs, or environment variables. G1 reads the command string only;
- cloud sessions, or edits made on GitHub. CI and the gates stay (brief §1, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:12` @ b64a8d39 sha256:HASH-TBD);
- any build other than 2.1.288; macOS or Linux;
- that the installed copy is isolated from later changes to the repository folder (E0);
- that `claude plugin test` and `validate` load the mod into a session. P0 shows that neither starts one;
- any latency figure, and any docs/08 row.

**Out of scope** (the brief's line 26, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:26` @ b64a8d39 sha256:HASH-TBD): dashboards, evidence packaging, a context keeper, any approval or override path, cloud sessions.

**Scope limits:** no wire change, and no ADR cited as governing or amended. ADR-006 does not apply, because this is repository tooling. There is no configuration, no `userConfig` and no flag: every code path is reached by a real tool call.

**Seams**, each written against the other side's actual interface:
- **register.js to the mod API:** build 2.1.288's types (§0.2). Proven from the real shape by `claude plugin test`, which runs the engine's own dispatch and `.catch` path, and live by E0 to E6.
- **N1 to the Stop hook's predicate:** restated, because a mod cannot import a repository file. Its source is `scripts/hooks/stop-queue.mjs:221-244` @ b64a8d39 sha256:HASH-TBD, named in a comment. T29 mirrors the stale-continuity form's S1 to S3 shapes. Drift between the two is disclosed (§5 falsification).
- **G5 to the scanner:** only under O-1 option (a), against the exit codes and the clean line of §0.3, once the scanner's own piece has merged.
- **G6 to the custodian's briefs:** a `REPORT PATH: <path>` line, which no brief carries at b64a8d39 (O-2).

## §2. The rules, stated before code

**2.0 Packaging** (brief §4, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:41` @ b64a8d39 sha256:HASH-TBD; P0 §4):
- `tools/mods/.claude-plugin/marketplace.json`: `name` `spatial-ide-mods`, `owner.name`, `description`, and `plugins[0]` = `{ name: "spatial-guardian", source: "./spatial-guardian", description }`.
- `tools/mods/spatial-guardian/.claude-plugin/plugin.json`: `name`, `description`, `author`.
- `tools/mods/spatial-guardian/hooks/hooks.json`: `"modules": ["./register.js"]`, an array of one path.
- `tools/mods/spatial-guardian/hooks/register.js`: exports `register(on, options)`. It imports nothing but its own files and `claude-code`.
- `tools/mods/spatial-guardian/test/guardian.test.ts`: the tests (§4), importing from `claude-code/testing`.
- `tools/mods/spatial-guardian/.gitignore`: `.claude-plugin/types/`, the engine-written type folder, kept out of git.
- `tools/mods/spatial-guardian/README.md` (2.11).
- No npm dependency, no `package.json`, no lockfile.
- Declared hooks line, before O-7: `tool.call{tool=Bash}`, `tool.call{tool=Write}`, `tool.call{tool=Edit}`, and the unfiltered `tool.call` (N1). `tool.call{tool=PowerShell}` is added if P0b (i) finds the tool typed.
- Declared calls line: `$.fs.stat`, `$.fs.read`, `$.process.run` (git only), `$.agent.list`, `$.session.messages`, `$.session.usage`. Nothing else.
- No `turn.step` hook and no `agent.spawn` hook.
- The worker builds in a worktree under `C:\dev\wt\` or `.claude/worktrees/`, never in the dev-mods folder or anywhere under the user Claude directory.

**2.1 Common design.**
- (a) **Refuse only** (brief §1, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:7-10` @ b64a8d39 sha256:HASH-TBD). A hook either returns `{ deny: <reason> }` or returns `next(e)` with the event it received, untouched. There is no `tool.check` hook and no `allow`.
- (b) **Fail closed** (P0 §6). Every refusing registration carries `.catch(() => ({ deny: CATCH_REASON }))`: synchronous, one expression, no `$` call, nothing that can throw.
- (c) **Timeouts.** Every `$.process.run` passes `timeoutMs: PROCESS_TIMEOUT_MS` (§7). A rejection makes the hook throw, and (b) denies.
- (d) **Placement.** `place(path)` follows the build's own guard example (`<skill-root>/types/claude-code.d.ts:3061-3113`):
  - a spelling it cannot place is `undefined`: drive-relative, `\\` or `//`, an empty, `.` or `..` name, a name holding a drive;
  - else the file's `realPath` from `$.fs.stat(path, { resolve: true })`;
  - else, on `ENOENT`, the folder's `realPath` plus the separator plus the name;
  - else `undefined`.
  A Write or Edit whose path places to `undefined` is refused (`UNPLACEABLE_REASON`).
- (e) **Matching.** The placed path is normalised by replacing every `\` with `/` and lower-casing ASCII. Protected paths are matched by suffix or segment on that form, on every platform alike (R1). No branch keys on the OS and no drive letter is assumed (R4). A case-sensitive volume can therefore see an over-refusal, declared here.
- (f) **No paths in reasons.** No deny reason contains a path from the call (the exposure rule's spirit). Each reason states Guardian's own fact and its own refusal, and no other module's consequence (round 7).
- (g) **Order in the Write and Edit hook:** G6 (when `agentId` is set), then placement, then G2, G4, G3 and, under O-1 (a), G5. Then `next(e)`.

**2.2 G1** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:18` @ b64a8d39 sha256:HASH-TBD). This is a Bash hook, plus a PowerShell hook if P0b (i) finds the tool typed. It makes no `$` call.
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

**2.3 G2** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:19` @ b64a8d39 sha256:HASH-TBD). A Write or Edit whose normalised path ends with `/docs/01_principles.md` is refused.

**2.4 G3** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:20` @ b64a8d39 sha256:HASH-TBD). The target is protected when either of these holds:
- it is an existing file whose normalised path ends in `/docs/adr/adr-<digits>-<name>.md`, and whose status line is not Proposed. The status line is the first of the file's first 10 lines that starts with optional `*`, then `Status`. With `*`, `:` and spaces stripped, its first word is compared. Any status other than `Proposed`, or no status line, counts as protected: unrecognised means protected;
- it is a file whose basename, lower-cased, ends with `preregistration.md` and which is filed: `git cat-file -e HEAD:./<name>`, run with `cwd` set to the file's placed folder, exits 0. A non-zero exit means not filed. A rejection throws, and 2.1(b) denies.
On a protected target an Edit is refused. A Write is allowed only when `e.content.startsWith(current)`, where `current` is `$.fs.read(path)`; a read that rejects (over 4 MiB, for example) throws and is denied. O-8 may admit an append-shaped Edit.

**2.5 G4** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:21` @ b64a8d39 sha256:HASH-TBD). When the normalised path holds the segment `/state/directives/`:
- every Edit is refused;
- a Write is refused when the file exists (its own `$.fs.stat` succeeds);
- a Write that creates a new file is allowed.

**2.6 G5** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:22` @ b64a8d39 sha256:HASH-TBD). **OPEN, O-1. No G5 code lands before its ruling.** The declared options:
- (a) A `--stdin` mode is added to the scanner first, as an amendment under `scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md` in its own piece. Then G5 runs `$.process.run(["node", "scripts/hooks/profile-path-scan.mjs", "--stdin"], { stdin: <Write content or Edit new_string>, timeoutMs: SCAN_TIMEOUT_MS })`. It passes only on exit 0 with stdout exactly the scanner's clean line, and refuses on anything else. This is a non-git process call, outside item 7's words.
- (b) G5 writes the content to a scratch file with `$.fs.write` and runs the scanner's `--message <file>`. That is a write by the mod, against the refuse-only principle in spirit, and `$.fs.write` is outside item 7.
- (c) G5 leaves v0. The commit-msg and pre-commit hooks and the CI `--range` backstop remain.

**2.7 G6** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:23` @ b64a8d39 sha256:HASH-TBD). **OPEN, O-2. No G6 code lands before its ruling.** Declared shape, route B, reads only:
- with `e.agentId` unset, G6 does nothing;
- else it calls `$.agent.list()`. When no row has `id === e.agentId` (engine forks and workflow agents, `<skill-root>/types/claude-code.d.ts:164-182`), or the row's `type` is not one of `architect`, `lead-data` or `evidence-reader`, G6 does nothing;
- else it reads the first row of `$.session.messages({ agentId: e.agentId })` (its shape from P0b (iii)). Exactly one line must match `^REPORT PATH: (.+)$`. The placed and normalised call path must equal the placed and normalised declared path, or the call is refused (`G6_REASON`). Zero lines, several lines, or an unplaceable declared path also refuse.
- An architect or evidence-reader brief carries no line, so any Write is refused. That is the trial's no-write rule for architects (round 41, item 3, as applied). Neither definition has a Write tool (§0.3), so G6 bites on lead-data and is defensive for the other two.
- The write audit (`scripts/hooks/subagent-write-audit.mjs`) stays the primary check until E5 passes, and the backstop after it.

**2.8 N1** (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:24` @ b64a8d39 sha256:HASH-TBD). **OPEN, O-4, O-5 and O-6. No N1 code lands before their rulings.** The declared shape, on the recommended options:
- one unfiltered `tool.call` registration, with no `.catch` and no deny. Its first statement is `const ran = await next(e)`. A failure after that leaves `ran` standing (`state/consults/2026-10-03-guardian-v0-docs-read.md:63` @ b64a8d39 sha256:HASH-TBD);
- it returns `ran` itself when `ran.deny !== undefined` or `e.agentId !== undefined`;
- `p` is `context.percent` from the plain `$.session.usage()`, or from the O-6 denominator. If `p` is absent, it returns `ran`;
- if `p < N1_THRESHOLD`, it clears `shownBands` (a module variable, lost on a hot reload; no `$.store`) and returns `ran`;
- `band = Math.floor(p / N1_BAND)`. If the band is in `shownBands`, it returns `ran`;
- else it judges the block by the Stop hook's predicate, with three git calls with `cwd` left as the session's: `git log -1 --format=%H HEAD -- state/CUT-STATE.md`, then `git show <c>:state/CUT-STATE.md` and `git show <c>^1:state/CUT-STATE.md`. The block is stale iff both `flushed_at` values are present and equal. Any other outcome is not stale, which matches the Stop hook's fail-open reading;
- when stale, it adds the band to `shownBands` and returns `{ ...ran, context: [...(ran.context ?? []), N1_TEXT(p)] }`. Otherwise it returns `ran`.
- It never edits `result` or `text`.

**2.9 Never done** (brief §1): rewriting a call's arguments; submitting a prompt; any `$.model` call; any network request; any `$.ui` call; any write.

**2.10 Coverage limit, as scope.** G2 to G4 and G6 guard Write and Edit only, plus O-7's tools if ruled. A Bash or PowerShell write (`sed -i`, a redirect, `tee`, `Set-Content`) is untouched, as it is for the write audit.

**2.11 The README** states, with no quotation:
- what Guardian refuses and the ruling for each rule;
- §1's limits;
- **install**, the human's alone, after his typed approval following both gates:
  - `claude plugin marketplace add <repository>/tools/mods --scope user`;
  - `claude plugin install spatial-guardian@spatial-ide-mods --scope user`;
  - `/reload-plugins`;
  - confirm the `/plugin` line the brief names (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:44` @ b64a8d39 sha256:HASH-TBD).
  Install from a checkout on main. Never use `project` or `local` scope;
- **turning it off:**
  - Guardian alone: disable it in `/plugin`, or run `claude plugin disable spatial-guardian --scope user`;
  - one session: start with `--safe-mode`, which also disables the user's other customizations (§0.3);
  - never `disableAllHooks`, which also stops the repository's settings hooks (the Stop hook and the round mirror);
- uninstall: `claude plugin uninstall`;
- the brief's §5 acceptance and stop conditions, by reference (`state/directives/MODS-GUARDIAN-V0-2026-10-03.md:49-57` @ b64a8d39 sha256:HASH-TBD);
- false refusals are logged in the ledger and narrowed through the usual process;
- under O-2 (a), the `REPORT PATH:` convention.

**2.12 Portability** (R1 to R6, `state/directives/PORTABILITY-2026-09-30.md:31-65` @ b64a8d39 sha256:HASH-TBD; R3 per the template's platform section, `docs/PREREGISTRATION-TEMPLATE.md:177` @ b64a8d39 sha256:HASH-TBD):
- **Owning boundary:** register.js's `place` and its normaliser, which is the mod's one OS-touching function.
- **Windows:** supported. Tested by `claude plugin test` with `\`, `/`, mixed-case and drive spellings, and live by E1 to E3.
- **macOS and Linux:** unavailable. Guardian is not installed there, and no claim is made.
- **R1:** one matcher everywhere (both separators, ASCII case-insensitive).
- **R2 and R4:** no `process.platform` branch, and no drive letter outside `place`'s spelling rules.
- **R5:** no product level is claimed.
- **R6:** no platform ignore.

## §3. Fixtures and predicted outcomes

The engine's answers are stubbed with the test's `on`. There are no files on disk. `R` is a repository root spelled `C:\r` or `c:/r`.

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

## §4. Tests, one mutation each (`tools/mods/spatial-guardian/test/guardian.test.ts`)

- **How a mutation is observed** (round 25, item 2 (c)): apply it, run `claude plugin test tools/mods/spatial-guardian`, record the failing test by name in its `// RECORDED MUTATION:` comment, and revert. The closing record names the commit each mutation was observed at, and `claude --version`. A `verify-mutation` run is not an observation.
- **What stands in for CI.** No runner has Claude Code. The evidence of record is:
  - the worker's full `claude plugin test` output, with `claude --version`, at a named commit;
  - the reviewer's own run on the custodian's machine at the gated head;
  - `claude plugin validate tools/mods/spatial-guardian` and `claude plugin validate tools/mods` outputs, text and `--json`, in the PR body.
  CI still runs verify-cites, verify-quotes, verify-test-claims and verify:plan. Before relying on verify-mutation, the worker states, at verify-mutation's commit, whether its scan covers `tools/mods/**/*.test.ts`; if it does not, the reviewer reads the comments.
- **The `agentId` cast** in G6's tests follows P0's probe (`state/consults/2026-10-03-guardian-v0-p0-report.md:748` @ b64a8d39 sha256:HASH-TBD) and is disclosed in the test.

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
| T9 | `G1 refuses a force-push through the PowerShell tool` (only if P0b (i) finds it typed) | F1 via PowerShell | drop the PowerShell registration |
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
| T20 | `G6 refuses a lead-data Write outside its declared REPORT PATH` (O-2) | F19 | compare basenames only |
| T21 | `G6 allows a lead-data Write to its declared REPORT PATH` | F20 | a case-sensitive compare |
| T22 | `G6 refuses every Write by an architect run whose brief declares no REPORT PATH` | F21 | a missing line read as allow |
| T23 | `G6 leaves other subagents, unlisted agent ids and the main loop to the other rules` | F22 | apply G6 to every listed type |
| T24 | `a refusing hook that throws is refused by its catch` | F23 | remove the Write registration's `.catch` |
| T25 | `a refusing hook whose process call times out is refused` | F24 | a `.catch` that returns `undefined` |
| T26 | `every process call is git and carries the declared timeout` | F12, F25 | drop `timeoutMs` from the cat-file call |
| T27 | `N1 appends no line below 80 percent and one line at 80 percent on a stale block` | F25 | `>` in place of `>=` |
| T28 | `N1 appends at most one line per 10-point band` | F26 | never record a shown band |
| T29 | `N1 appends nothing on a fresh block` | F27 | drop the staleness check |
| T30 | `N1 appends nothing for a subagent call or a refused call` | F28 | drop the `agentId` check |
| T31 | `N1 clears its bands after the fill falls below 80 percent` | F29 | never clear `shownBands` |
| T32 | `N1's line is the declared text with the integer percent` | F25 | an unrounded percent |
| T33 | `G3 allows an Edit that only appends at the end of a filed preregistration` (O-8 (a) only) | F13 as an Edit | `endsWith` dropped |
| T34 | `G2 to G4 cover MultiEdit` (O-7 (a) only, if P0b (ii) finds it typed) | F9 via MultiEdit | drop the MultiEdit registration |
| T35 | `G5 refuses a Write whose content the scanner refuses` (O-1 (a) only) | process.run exit 1 | pass on any exit 0 |
| T36 | `G5 passes only on a clean exit 0` (O-1 (a) only) | exit 0 without the clean line | accept exit 0 alone |

**E-rows**, live and after install. Each runs only if the human's typed install approval names it, and the custodian records each as a class 1 row on main.
- **E0:** the `/plugin` line, `claude --version`, and whether the installed plugin is a copy or a reference to `tools/mods/` (§1).
- **E1 to E3:** an Edit whose `old_string` matches nothing, on `docs/01_Principles.md`, on an existing directive and on an accepted ADR. Predicted: Guardian's reason, never the Edit tool's not-found error. If a rule fails open, the tool writes nothing.
- **E5 (O-2 (a)):** a labelled probe lead-data run declaring a REPORT PATH, asked to Write once to a second scratch path. Predicted: refused. Its expected write-audit VOID is recorded as the probe's.
- **E6:** N1's first natural firing. The percent, the line as the model reports it, and the flush that followed are recorded.
- **No live G1 probe**, under round 34, item 3.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions:**
- T1 to T32 pass at the head, and each fails under its mutation; T33 to T36 likewise, where ruled in;
- `validate` prints only §2.0's hooks and calls, plus `$.fs.write` under O-1 (b) only;
- E0 to E6 come out as §4 predicts.

**Declared unchanged:** every path outside `tools/mods/`. That includes `scripts/hooks/**` (the scanner and the write audit), `.claude/settings.json`, `.claude/agents/**`, `.github/**`, the root `.gitignore`, `AUTONOMY.md` and `AI_DEVELOPMENT.md`.

**Invalidators (stop, to the custodian):**
- **I1:** P0b contradicts §2, or the test kit cannot answer an event §4 needs.
- **I2:** `claude --version` is not 2.1.288 at any run of record. Every test and `validate` is re-run, and the change is recorded.
- **I3:** `validate` shows a hook or call outside §2.0.
- **I4:** a rule needs a call outside §2.0 that no OPEN ruling admits.
- **I5:** §7's file count is exceeded.
- **I6:** any step would install, enable or load the mod into a session, add a marketplace, or write under the user Claude directory.

**Falsification:**
- a refusal fixture reaches `next(e)`, or an allowed fixture is refused;
- a throwing or timed-out refusing hook's call runs;
- N1 fires twice in one band, for a subagent, or on a fresh block;
- N1's predicate and the Stop hook's disagree on S1 to S3.

## §6. Instruments

Assertions only:
- deny or `next(e)`, the reason text, the `context` array, and the arguments the stubs receive;
- `claude --version`;
- `validate`'s two lines;
- verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with the tool's commit (round 15 (c)).

## §7. Declared values and ceilings

- `PROCESS_TIMEOUT_MS = 2000` for each git call. `SCAN_TIMEOUT_MS = 5000`, under O-1 (a) only.
- `N1_THRESHOLD = 80` and `N1_BAND = 10`. `shownBands` clears below the threshold.
- `N1_TEXT(p)`: the brief's quoted N1 sentence, `state/directives/MODS-GUARDIAN-V0-2026-10-03.md:24` @ b64a8d39 sha256:HASH-TBD (a sub-line span; this is the line's hash), with `N` replaced by the integer `p`. It is byte-copied into the code, and T32 asserts it.
- The protected forms: the suffix `/docs/01_principles.md`; the ADR suffix pattern `/docs/adr/adr-<digits>-<name>.md` with its 10-line status window; the basename ending `preregistration.md`; the segment `/state/directives/`.
- The report-only types: `architect`, `lead-data`, `evidence-reader`. The line pattern: `^REPORT PATH: (.+)$`.
- **Reasons**, each starting `spatial-guardian <id>:`, with no path from the call, and worded for the human's sight before install (§9):
  - `G1_REASON`: refused, because this git push force-pushes or deletes a remote ref (round 34, item 3);
  - `G2_REASON`: docs/01 is never edited;
  - `G3_REASON`: an accepted ADR or a filed preregistration changes only by appending;
  - `G4_REASON`: an existing directive is never rewritten;
  - `G6_REASON`: this run writes only its brief's REPORT PATH;
  - `UNPLACEABLE_REASON`: the path cannot be placed, so it is refused;
  - `CATCH_REASON`: a check could not complete, so the call is refused.
  The worker writes each as one sentence, and the strings are §7's declared values.
- **Size:** at most 1400 changed lines, insertions plus deletions, over at most 8 files:
  - `tools/mods/.claude-plugin/marketplace.json`;
  - `tools/mods/spatial-guardian/.claude-plugin/plugin.json`;
  - `tools/mods/spatial-guardian/hooks/hooks.json`;
  - `tools/mods/spatial-guardian/hooks/register.js`;
  - `tools/mods/spatial-guardian/test/guardian.test.ts`;
  - `tools/mods/spatial-guardian/README.md`;
  - `tools/mods/spatial-guardian/.gitignore`;
  - one spare, for a second test file.
  - Counting command: `git diff --numstat <base>..<head> -- . ':!tools/mods/GUARDIAN-V0-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, where `<base>` is the merge base on main and `<head>` a named commit. An overrun is class 8, and this line is never edited.
  - Estimate: register.js 400, tests 750, README 100, the rest 40.
- **Minutes:** the node's `budget_minutes` (AUTONOMY §10).

## §8. Block-on-sight

1. A `tool.check` hook; an `allow`; `next(` called with anything but the received event; a `$.model`, `$.ui`, prompt, network or write call (`$.fs.write` is admitted under O-1 (b) only).
2. A refusing registration without `.catch`, or a `.catch` body that is not a synchronous constant deny.
3. A `$.process.run` without `timeoutMs` at or under §7, or whose `argv[0]` is not the literal `git` (O-1 (a)'s scanner call aside).
4. A `turn.step` or `agent.spawn` hook; a `$.store` call; a hook or call outside §2.0.
5. Code for G5, G6, N1, O-7 or O-8 before its ruling is recorded.
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
    - a correction round without its superseded index.
15. A file outside §7's list, apart from this form and the custodian's generated set.
16. A squash or rebase merge, or any force-push.
17. A reason that states another module's consequence (round 7).

## §9. Gates

- **Architect:**
  - the Gating heads;
  - the brief's §1 to §5 against §2;
  - each OPEN ruling's record against §2's declared options;
  - the seams (§1);
  - R1 to R6 against §2.12;
  - round 7 on §7's reasons;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - `claude plugin test` and both `validate` runs on the custodian's machine, with `claude --version`;
  - every mutation observed at the gated head;
  - §7 recounted;
  - §8 item 3 checked by reading every `$.process.run` call.
- **Suites, green before either gate:**
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` (unchanged files, run anyway);
  - governance-ci on the branch;
  - §6's tools;
  - the branch CI read before gating.
- **Operator:**
  - the human sights §7's reasons and the README's install and off steps;
  - then his typed install approval, which names the E-rows he allows;
  - he installs it himself;
  - the custodian records E0 to E6.

## §10. Amendments — opens empty, append-only (classes 1 to 9; each correction round ends with a superseded index)
```

(2) The OPEN items, one line each, each with the code that waits on it:

- **O-1, G5's route** (P0 §7). Options:
  - (a) a scanner `--stdin` mode in its own piece under the exposure form, then a non-git `$.process.run`, which is outside item 7's words;
  - (b) a `$.fs.write` scratch file, against refuse-only in spirit and outside item 7;
  - (c) G5 leaves v0.
  Recommended: (c), with (a) proposed as a follow-up node, since the commit hooks and the CI `--range` backstop already refuse before history. All G5 code (T35, T36) waits.
- **O-2, G6.** Options:
  - (a) keep it on route B (`$.agent.list` and `$.session.messages`, reads within item 7), with the live check E5 after install. If live shows no `agentId`, G6 is removed by a class 5 amendment. The custodian's lead-data briefs carry `REPORT PATH: <absolute path>` from install;
  - (b) drop it as the brief's fallback, and the write audit stays primary;
  - (c) route A, an `agent.spawn` hook, which is outside item 7's hooks.
  Recommended: (a). All G6 code (T20 to T23) waits.
- **O-3, reading item 7.** Under this reading the design stays inside item 7, unless O-1 picks (a) or (b): `$.fs.stat`, `$.fs.read`, `$.agent.list`, `$.session.messages` and the plain `$.session.usage()` count as reads; `$.process.run` is held to `git` by code review and T26, since `validate` cannot show argv; N1 keeps a module variable, not `$.store`. Recommended: confirm this reading. Nothing waits beyond §8 item 3.
- **O-4, N1's trigger.** The brief's literal condition is always true. Options:
  - (a) the Stop hook's predicate (the newest `state/CUT-STATE.md` commit leaves `flushed_at` as its first parent had it);
  - (b) the literal condition, or equivalently no staleness condition at all.
  Recommended: (a). All N1 code (T27 to T32) waits.
- **O-5, N1's delivery.** `context` is read by the model and never seen by the human, so it is not the same as a line visible on the tool result. Options:
  - (a) `context`;
  - (b) rewriting `result` or `text`, against refuse-only and schema-validated;
  - (c) adding a user notice, outside item 7.
  Recommended: (a). N1 code waits.
- **O-6, N1's denominator.** Options:
  - (a) `context.percent` over the model's window, which is what the status line shows;
  - (b) the compaction window, which may be smaller; if auto-compaction runs below 80% of the model's window, (a) never fires.
  Recommended: (b), if P0b (v) shows that a summary-breakdown usage call is local and carries it; else (a), with that limit disclosed. N1 code waits.
- **O-7, writing tools beyond Write and Edit** (only if P0b (ii) finds MultiEdit or NotebookEdit typed). Options:
  - (a) extend G2 to G4 and G6 to them, still `tool.call` hooks, matching the write audit's tool list;
  - (b) keep the brief's letter, and disclose the gap.
  Recommended: (a). T34 and those registrations wait.
- **O-8, G3's Edit refusal.** Refusing every Edit forces amendments to be made either by whole-file Writes or by Bash appends that Guardian cannot see. Options:
  - (a) admit an Edit whose `old_string` occurs once, ends the file, and is a prefix of `new_string`;
  - (b) the brief's letter.
  Recommended: (a). T33 and that branch wait. G3's other code may land.

Code that waits on no OPEN item, and may start once the form is committed and P0b is recorded: packaging, G1, G2, G3 without O-8, G4, placement, fail-closed, the README, T1 to T19 and T24 to T26.

(3) Files read, all at main b64a8d39 unless stated otherwise:
- C:\dev\spatial-ide\state\directives\2026-10-03-guardian-v0-direction.md
- C:\dev\spatial-ide\state\directives\MODS-GUARDIAN-V0-2026-10-03.md
- C:\dev\spatial-ide\state\consults\2026-10-03-guardian-v0-p0-report.md
- C:\dev\spatial-ide\state\consults\2026-10-03-guardian-v0-docs-read.md
- C:\dev\spatial-ide\PLAN.yaml (lines 3790-3830)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md
- C:\dev\spatial-ide\AUTONOMY.md (§0, §4 to §7, §21 to §22, §23 to §30)
- C:\dev\spatial-ide\AI_DEVELOPMENT.md (lines 440-469)
- C:\dev\spatial-ide\DECISIONS-PENDING.md (lines 1-75; the round 34 block)
- C:\dev\spatial-ide\scripts\hooks\stop-queue.mjs
- C:\dev\spatial-ide\scripts\hooks\precompact-flush.mjs (lines 50-89)
- C:\dev\spatial-ide\scripts\hooks\profile-path-scan.mjs (lines 1-120, 560-709)
- C:\dev\spatial-ide\scripts\hooks\EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md (lines 1-442)
- C:\dev\spatial-ide\scripts\hooks\STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md (the shape model)
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md
- C:\dev\spatial-ide\state\directives\2026-10-03-lead-data-pilot-direction.md
- C:\dev\spatial-ide\state\directives\2026-10-03-write-audit-ruling.md
- C:\dev\spatial-ide\state\directives\2026-10-03-reports-to-files-two-pieces-trial.md
- C:\dev\spatial-ide\state\directives\2026-09-29-flush-mirror-and-milestone-refresh.md
- C:\dev\spatial-ide\state\CUT-STATE.md (lines 1-25)
- C:\dev\spatial-ide\.claude\agents\*.md (front-matter lines, by grep)
- docs/adr Status lines, by grep; the PREREGISTRATION filenames, by glob

The draft makes no claim about `<skill-root>` beyond P0's checked excerpts: I could not locate that folder, so I read none of its files. The architect run made no write-capable call.
