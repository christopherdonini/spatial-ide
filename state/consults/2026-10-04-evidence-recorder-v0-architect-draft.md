*Custodian's filing note (2026-10-04): the architect's draft 1 of evidence-recorder-v0's full-form preregistration, on the custodian's brief, from P0 (`state/consults/2026-10-04-evidence-recorder-v0-p0-report.md`). It arrived as a message, since the architect has no Write tool; the harness persisted it to a file because of its size. It is transcribed here from the SubagentHandback call in the architect's own transcript, which is byte-identical to the persisted file. One newline is added at the end. Its sha256, from this file's line 5 to the end, is 4896c7002b0f3898d63291577e046ad9a41da682fca3d565acc4ecfde2974c0c. Write audit PASS: zero write calls (Read 23, Grep 3, Glob 1). C3: before 11:54:28Z at fb8cae31, after 12:06:12Z at 51d3b697. HEAD moved only by the custodian's commits, and the porcelain is unchanged. The draft is not yet a form. Its OPEN items O-1 to O-13 go to the human in the next question round, and the form is committed only after that, with the custodian's hashes. Profile paths redacted at filing: none.*

---

Reviewed: main @ fb8cae31

This is draft 1. I ran nothing, wrote nothing, and made no write-capable call. Every pin is written `path:line @ fb8cae31 sha256:HASH-TBD` for you to compute. As in Guardian's §0.3, the dot-prefixed paths (the root `.gitignore`, `.github/workflows/governance-ci.yml`) are named in words, because verify-quotes cannot read them. Nothing below is in quotation marks: no passage is reproduced, and every restatement is my paraphrase.

**Proposed path:** `tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md`. Three reasons:
- It sits beside Guardian's form, outside the plugin folder, so the installed plugin never carries its own form.
- Its basename ends in `PREREGISTRATION.md`, so once it is filed, live Guardian's G3 enforces append-only on it.
- `tools/mods/**` is already in governance-ci's path filters, so the PR triggers that CI.

## (1) The form

```markdown
# Evidence Recorder v0 — the second Spatial IDE mod: an observe-only plugin at tools/mods/spatial-evidence-recorder/ (PLAN node `evidence-recorder-v0`) — preregistration

**Authority:**
- the 2026-10-03 mods-roadmap ruling, items 1 to 3: `state/directives/2026-10-03-evidence-recorder-ruling.md:12-16 @ fb8cae31 sha256:HASH-TBD` (RULED 2026-10-03, the mods-roadmap block in `DECISIONS-PENDING.md`, cited by its heading and not by line);
- Fable's brief: `state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md` (whole-file sha256 23a197d8b3d645b104874c5f770032e17940f7e981bd6978b65a34bd27e4af5e, as the ruling file's filing note records). Its parts are cited by section and pinned line;
- the node: `PLAN.yaml:3832-3849 @ fb8cae31 sha256:HASH-TBD`;
- the rulings on draft 1's OPEN items (§0.4): none yet. Draft 2 cites each by round and item.
**Drafted by** the architect agent on the custodian's brief. This is draft 1, read at main fb8cae31. It is architect-drafted because it crosses no engine/ or kernel/ path (`state/directives/2026-10-03-lead-data-pilot-direction.md:31-33 @ fb8cae31 sha256:HASH-TBD`). Nothing was run for this draft. **Committed before any code**, and only once every OPEN item is ruled and carried into draft 2. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Gating:** full, reviewer and architect, on two heads, each enough alone:
- **§21a, security posture:** the brief names installing the mod a security-posture change (`state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:3 @ fb8cae31 sha256:HASH-TBD`; `AUTONOMY.md:315-332 @ fb8cae31 sha256:HASH-TBD`). This piece builds the artefact that would be installed.
- **§21c, size** (`AUTONOMY.md:347-357 @ fb8cae31 sha256:HASH-TBD`): over the bound (§7).
Under round 25, item 2 (e), no five-line form is used.
**Red line.** Installing it is the human's alone: his typed approval after both gates, and he installs it himself (the ruling, item 2; `AI_DEVELOPMENT.md:451-454 @ fb8cae31 sha256:HASH-TBD`). Nothing in this piece installs, enables or loads the mod, adds a marketplace, or starts a session with it.

## §0. Disclosure

**0.1 Inputs.** These are Evidence, not Authority:
- **P0:** `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md`. Its filing note was read first (`state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:1 @ fb8cae31 sha256:HASH-TBD`): 40 of 40 verbatim excerpts were checked by script, and `examples/tool-call.ts` is CRLF on disk. Its label convention is at `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:6 @ fb8cae31 sha256:HASH-TBD`.
- **Build labels, kept:** a type read is a claim about 2.1.288. A `validate` or `test` result is a claim about 2.1.289 (round 15 (c)). Neither is read as current for another build (§5 I2).
- **The build's files** are cited `<skill-root>/<file>:<line>`, with file sha256 values from P0's last section (`state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:959-961 @ fb8cae31 sha256:HASH-TBD`):
  - `<skill-root>/types/claude-code.d.ts` is 36af9e4799354bf878a91d1ea7c4632d0eca7c620b4557ace6afc8a87647cdb1;
  - `<skill-root>/reference.md` is ad5f1688672600495233d09b597c1bc4ef5d8f790c32caf9490d4fd2e5bb71f4;
  - `<skill-root>/examples/tool-call.ts` is 76a0235a305b1a6ae53f87a2c91d84b502ceebab7f887bd036ad5054ef366f73.
- **The model:** `tools/mods/GUARDIAN-V0-PREREGISTRATION.md`, cited by section and amendment: §2.0 (packaging), §2.1(c) (timeouts), §4 (the evidence of record without CI), Amendment 4, Part C (the build of record, 2.1.289), and Amendment 8 (the live E-rows, I2 firing on a session started before the binary changed, E0's Read-from line, and G1's apostrophe over-refusal).

**0.2 The brief's §3 answers** (`state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:35-41 @ fb8cae31 sha256:HASH-TBD`), each with its source:
1. **The Bash result.** Typed at 2.1.288, there is no numeric exit status, only `isError` and `interrupted`. On the errored arm only `text` carries output. `returnCodeInterpretation?` and `timedOutAfterMs?` are optional. Sources:
   - types: `<skill-root>/types/claude-code.d.ts:19178-19186`, `<skill-root>/types/claude-code.d.ts:19197-19198`, `<skill-root>/types/claude-code.d.ts:19205-19206`, `<skill-root>/types/claude-code.d.ts:19211-19214`, `<skill-root>/types/claude-code.d.ts:12056-12068`;
   - the build's example reads `isError` as failure: `<skill-root>/examples/tool-call.ts:14`;
   - P0: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:9 @ fb8cae31 sha256:HASH-TBD` and `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:159 @ fb8cae31 sha256:HASH-TBD`;
   - the pass-through probe and its observed mutation, at 2.1.289: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:139 @ fb8cae31 sha256:HASH-TBD`.
   Whether a non-zero exit sets `isError` is not established (O-1; E2).
2. **Turn end.** Typed at 2.1.288, `turn.complete` carries `agentId?` and `usage?` (four counts plus `model`), and `$.agent.list()` rows carry `id` and `type`. Sources:
   - types: `<skill-root>/types/claude-code.d.ts:12498-12513`, `<skill-root>/types/claude-code.d.ts:12799-12810`, `<skill-root>/types/claude-code.d.ts:125-144`, `<skill-root>/types/claude-code.d.ts:2976-2979`;
   - P0: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:162 @ fb8cae31 sha256:HASH-TBD` and `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:311 @ fb8cae31 sha256:HASH-TBD`.
   The harness raised the event itself, so a live subagent's firing, its usage and its listing at turn end are unproven (O-10; E3).
3. **The approved commands.** Sources: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:314 @ fb8cae31 sha256:HASH-TBD`, the proposed matcher at `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:439 @ fb8cae31 sha256:HASH-TBD`, its misses at `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:440 @ fb8cae31 sha256:HASH-TBD`, and its reading at `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:441 @ fb8cae31 sha256:HASH-TBD`. Taken into §2.2 (O-9).
4. **The identity's cost.** Observed by P0 on this repository: about 108-145 ms at p50 for two git calls. Four calls in series come to about 216-290 ms at p50 and about 300-352 ms at p95, which is P0's arithmetic, not a measurement of the mod. Sources:
   - P0: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:444 @ fb8cae31 sha256:HASH-TBD`;
   - what the identity misses: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:445 @ fb8cae31 sha256:HASH-TBD`;
   - what a hook sees, including decoded text and the 4 MiB cap: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:446 @ fb8cae31 sha256:HASH-TBD`;
   - P0's reading: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:527 @ fb8cae31 sha256:HASH-TBD`;
   - types: `<skill-root>/types/claude-code.d.ts:3291-3307`, `<skill-root>/types/claude-code.d.ts:7553-7556`, `<skill-root>/types/claude-code.d.ts:7566-7593`.
   Taken up in O-5 and O-6.
5. **The log path, the tree and the append.** Sources:
   - P0: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:530 @ fb8cae31 sha256:HASH-TBD`, `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:531 @ fb8cae31 sha256:HASH-TBD`, `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:532 @ fb8cae31 sha256:HASH-TBD`, `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:533 @ fb8cae31 sha256:HASH-TBD`, `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:747 @ fb8cae31 sha256:HASH-TBD`;
   - types: `<skill-root>/types/claude-code.d.ts:3012-3015`, `<skill-root>/types/claude-code.d.ts:3036-3041`, `<skill-root>/types/claude-code.d.ts:3047-3060`, `<skill-root>/types/claude-code.d.ts:2568-2579`, `<skill-root>/types/claude-code.d.ts:15177-15181`, `<skill-root>/types/claude-code.d.ts:15183-15188`.
   Taken up in O-2, O-4 and O-7.
6. **The chain order with Guardian.** The order within one tier is not typed. Sources:
   - types: `<skill-root>/types/claude-code.d.ts:11888-11907`, `<skill-root>/types/claude-code.d.ts:6171-6178`, `<skill-root>/types/claude-code.d.ts:7517-7521`;
   - P0's answer, harness probe and reading: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:750 @ fb8cae31 sha256:HASH-TBD`, `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:867 @ fb8cae31 sha256:HASH-TBD`, `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:868 @ fb8cae31 sha256:HASH-TBD`.
   Taken into §2.8 (O-8; E1).
7. **`claude plugin validate`, observed at 2.1.289.** Sources: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:871 @ fb8cae31 sha256:HASH-TBD` and `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:953 @ fb8cae31 sha256:HASH-TBD`. Taken up in O-3.

**0.3 Repository facts relied on.**
- The root `.gitignore` ignores `target/` at line 2 and `.claude/state/` at line 43, at fb8cae31. Named in words; the custodian computes the hashes.
- governance-ci's push and pull_request path filters list `tools/mods/**` (lines 83 and 99 at fb8cae31, named in words). Its test step (line 140) runs only the `scripts/plan` and `scripts/hooks` globs, so no CI job runs this mod's tests.
- `tools/mods/.claude-plugin/marketplace.json` at fb8cae31 lists one plugin, `spatial-guardian`.
- The installed Guardian reads from `tools/mods/spatial-guardian/` in the main checkout (Guardian Amendment 8, E0).
- Guardian is live in the custodian's session (Guardian Amendment 8). It refused one of P0's own Bash calls: `state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:998 @ fb8cae31 sha256:HASH-TBD`.
- Every `$.process.run` in Guardian passes its own `timeoutMs` (`tools/mods/spatial-guardian/hooks/register.js:21 @ fb8cae31 sha256:HASH-TBD`; Guardian §2.1(c)).
- Recorder lines as citable evidence are the 2026-10-09 window's item E (`state/drafts/weekly-window-2026-10-09.md`, section E), under the ruling's item 3.

**0.4 OPEN items, for the human, before commit.** P0 changes these shapes the human approved through the brief: O-1 to O-13, as listed in the custodian's hand-back. Where §2 depends on one, it says `[O-n: recommended, pending]`. Draft 2 carries each ruling, and no code of a pending shape lands (§8 item 17).

**0.5** No measurement and no fixture drive in this draft. P0's timings are P0's.

## §1. May and may not claim

**May claim**, under `claude plugin test` on Windows at 2.1.289:
1. Every §3 approved fixture yields one run record with §2.3's fields. Every other Bash call yields none and makes no `$` call.
2. On every fixture, each hook returns a value that deep-equals, and serialises equal to, what `next(e)` produced: answered, errored, deny, not approved, failing git, failing write.
3. A failing, non-zero or truncated git call yields `unavailable` for its fields.
4. `tree_changed_during_run` follows §2.4 on §3's fixtures.
5. On harness-raised events, a subagent's turn end yields one usage record and the main loop's yields none.
6. `validate` lists only §2.0's hooks and calls.
7. After E5 only: the recorder's overhead p50 and p95 on E5's sample, against §7's bound.

**May not claim:**
- **Citability.** No recorder line is citable evidence in v0. That is the window's item E, under the ruling's item 3.
- **What a record proves.** A record does not show that a test's assertions establish a claim, and it is not a mutation observation (`state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:13 @ fb8cae31 sha256:HASH-TBD`; round 25, item 2 (c)). CI and the gates remain authoritative.
- **Exit status.** No numeric exit status. That `tool_is_error` tracks a non-zero exit is unclaimed before E2 (O-1).
- **The tree.** That the tree identified is the tree the command ran in, beyond §2.4's `tree_basis`. In particular: MSYS spellings (`/c/...`), a shell cwd the main loop kept from an earlier `cd` (E4), and a subagent's own worktree when no leading `cd` names it.
- **What the identity misses:** untracked file content, ignored files, a change made and restored within the run, metadata, and a commit during the run unless O-11 rules (b).
- **The hashes.** They are of the UTF-8 encoding of decoded text, not the bytes `sha256sum` sees (O-5).
- **Coverage.** That every test run is recorded. Not recorded: the PowerShell tool (O-12), wrappers, scripts, loops, background calls, CI, cloud sessions, commands that scripts launch internally, and every form in §2.2's not-approved table (`state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:31 @ fb8cae31 sha256:HASH-TBD`).
- **Live behaviour before its E-row:** the chain order with Guardian (E1), subagent usage (E3), and the listing of an agent at its turn end (E3).
- **Loss.** That no record is lost. A rejected write drops its record.
- **Builds and platforms.** Any build other than 2.1.289 for tested behaviour (the type reads are 2.1.288's), macOS, Linux.
- **Isolation.** That an installed copy is isolated from changes to the main checkout's folder (as Guardian E0).
- **Latency.** Any docs/08 row, and any latency figure before E5.
- **Loading.** That `claude plugin test` or `validate` loads the mod into a session.

**Out of scope:**
- the brief's not-covered list (the line cited above);
- pruning code [O-2];
- the citability rule;
- the Workboard, worktree protection, and contract-impact assistance (the brief's roadmap).

**Scope limits:**
- no wire change, and no ADR cited as governing or amended. ADR-006 does not apply: this is repository tooling;
- no `userConfig`, option or flag. Every path is reached by a real tool call or turn end;
- no file outside `tools/mods/`.

**Seams**, each against the other side's actual interface:
- **register.js to the mod API:** build 2.1.288's types (§0.2). It is proven by `claude plugin test` at 2.1.289, which runs the engine's own dispatch, and live by E0 to E7.
- **register.js to git:** the argv and output formats of §2.4. Before writing tests, the worker runs each §2.4 argv once, from Node with no shell, in its worktree at a named commit, and records each stdout's shape in its report: line count, separator, trailing newline, slash direction. It names `git --version`. The test stubs follow that recorded shape, and a comment names the commit and the git version. E4 proves it live.
- **The record to its reader:** the custodian's evaluation by hand (brief §4). No reader code lands, and the schema is §2.3 and §2.6.
- **Guardian:** none. Nothing is imported from it and none of its state is read. §2.8 is independent of order.

## §2. The design, stated before code

**2.0 Packaging** (beside Guardian; Guardian §2.0's shape):
- **Folder and manifest:** `tools/mods/spatial-evidence-recorder/.claude-plugin/plugin.json` holds `name` `spatial-evidence-recorder`, `description` and `author`.
- **Hooks module:** `tools/mods/spatial-evidence-recorder/hooks/hooks.json` holds `"modules": ["./register.js"]`. `hooks/register.js` exports `register(on)` and imports nothing.
- **Tests:** `tools/mods/spatial-evidence-recorder/test/recorder.test.ts`, importing from `claude-code/testing`.
- **Other files:** `README.md` (2.10), and a `.gitignore` holding `.claude-plugin/types/`.
- **Marketplace:** `tools/mods/.claude-plugin/marketplace.json` gains one `plugins` entry, `{ name: "spatial-evidence-recorder", source: "./spatial-evidence-recorder", description }`. Guardian's entry and every other byte stay as they are. Because the human's marketplace is a directory source at this folder, the entry lists the plugin there once main carries it. It installs and enables nothing.
- **No npm dependency,** no `package.json`, no lockfile.
- **Untouched:** nothing under `tools/mods/spatial-guardian/` changes (§8 item 9).
- **Declared hooks line:** `tool.call{tool=Bash}`, `turn.complete`.
- **Declared calls line** [O-3, with O-2 (a), O-4 (b) and O-7 (c): recommended, pending]: `$.agent.list`, `$.fs.write`, `$.process.run` (git only). Nothing else.
- **Where the worker builds:** a worktree under `C:\dev\wt\`, never the main checkout, the dev-mods folder, or anywhere under the user Claude directory.

**2.1 Observe only** (`state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:7-11 @ fb8cae31 sha256:HASH-TBD`):
- Every hook calls `next(e)` exactly once, with the event it received, and returns that call's resolved value itself. It never returns a copy or a spread.
- It never returns a `deny`, `context`, `result` or `text` of its own.
- No registration carries a `.catch`, because a `.catch` result would replace the tool's result.
- Every `$` call and the record build sit inside a `try`. A failure before `next` leaves the before-fields `unavailable`, and `next` still runs once. A failure after `next` drops or degrades the record and still returns `next`'s value.
- No model call, no network, no `$.ui`, no `$.session.*`, no `$.store`, no commit or push, no write outside the log root (2.7).
- Every `$.process.run` has `argv[0]` the literal `git`, `argv[1]` `--no-optional-locks` (so git takes no index lock beside the agent's own git), a subcommand in {`rev-parse`, `status`, `diff`}, and `timeoutMs: PROCESS_TIMEOUT_MS` (§7).

**2.2 The matcher** [O-9: recommended, pending]. A synchronous parse of `e.command` before any `$` call.
- A call with `run_in_background === true` is passed through with no work.
- Split at `&&`, `||`, `;`, `|`, `&` and newlines outside quotes. A quote left open anywhere means the call is not approved.
- Each segment is tokenised with single and double quotes. Leading tokens are dropped while they are an env assignment (`NAME=value`, NAME `[A-Za-z_][A-Za-z0-9_]*`) or `timeout <duration>` (duration `^[0-9]+(\.[0-9]+)?[smhd]?$`).
- A segment whose first token is `cd` is not approved, and it does not stop the other segments from being tested.
- A call with one or more approved segments is approved and yields one record, whose `command` is the whole string.

| Row | First tokens after normalisation | Further condition | Source |
|---|---|---|---|
| A1 | `cargo` `test` | no `--no-run` token; no `--list` token after a `--` token | CI `cargo test --workspace --locked`, the shell's `--manifest-path`, agents' `-p` forms (P0 §3) |
| A2 | `npm`, an optional `--prefix <dir>`, then `test`, or `run` with one of `test`, `verify`, `test:e2e`, `test:residency-trace`, `test:citation-integrity` | none | the shell's and the viewer's package scripts (P0 §3a) |
| A3 | `node` `--test` | none | governance-ci's suite; single-test runs |
| A4 | `node`, then a token that, with `\` replaced by `/` and a leading `./` dropped, is or ends with `/` + one of `scripts/plan/verify.mjs`, `scripts/plan/verify-cites.mjs`, `scripts/plan/verify-quotes.mjs`, `scripts/plan/verify-test-claims.mjs` | none | governance-ci (P0 §3a) |

| Not approved | Why |
|---|---|
| `cargo test --no-run`; `cargo test ... -- --list` | compiles or lists, runs no test |
| `node scripts/plan/verify-mutation.mjs` | records a mutation and runs none (P0 §3a) |
| `cargo build`, `cargo check`, `cargo fmt`, `node scripts/plan/cfg-boundary.mjs`, other `node <script>`, `npm run build`, `typecheck`, `verify:adr-index`, `check:*` | builds or checks, not tests |
| `cargo nextest`, `cargo t`, `npx …`, `bash -c`, `sh -c`, `env`, `time`, `xargs`, `sudo`, loops, scripts, substitutions, heredocs, `timeout` with options | a wrapper the matcher does not read (P0's miss list) |
| a call with `run_in_background: true` | returns before its command ends |
| a call with an unbalanced quote | not parseable |
| the PowerShell tool | not on the hooks line [O-12] |

**2.3 The run record.** One JSON object per approved, not-denied call. Each field is set or `unavailable`, and nothing is estimated.
- `schema`: `spatial-evidence-recorder/v0`. `kind`: `run`.
- `agent_id`: `e.agentId`, or `main` when it is absent.
- `agent_type`: `main`, the listed row's `type` from `$.agent.list()` (called after `next`, for a subagent only), or `unavailable`.
- `command`: the whole command string.
- `started_at` and `ended_at`: UTC ISO times taken just before `next(e)` and just after it resolves. They include any permission wait and any hooks beneath.
- `tree_basis`, `toplevel`, `head`, and `before` and `after` with `status_z_text_sha256` and `diff_binary_text_sha256` each, and `tree_changed_during_run`: per 2.4 [O-4, O-5, O-11].
- The outcome fields, per 2.5 [O-1, O-9].
- `stdout`, `stderr` and `text`, each `{ text_bytes, text_sha256 }`, per 2.5 [O-5]. The record never carries output, status or diff content.
- `recorder_ms`: `{ before, after, write }`, wall milliseconds of the recorder's own work on the call path [O-6]. This is the instrument for the brief's overhead evaluation and stop condition.

**2.4 Tree and identity** [O-4 (b), O-5, O-6 (a), O-11 (b): recommended, pending].
- **The tree's basis:**
  - `leading-cd`: the first segment is `cd` with exactly one argument, an absolute spelling (`/…`, or a letter, `:`, then `/` or `\`) holding no `$`, backtick, `~`, `*` or `?`, followed by `&&`. Git then runs with `cwd` set to that directory.
  - `session-default`: there is no `cd` segment. Git runs with no `cwd`, so at the session's default.
  - `unresolved`: any other `cd` (relative, unparseable, or not leading). The tree fields are then all `unavailable` and no git runs.
- **Before, concurrently:**
  - `git --no-optional-locks rev-parse --show-toplevel HEAD` gives `toplevel` and `head`;
  - `git --no-optional-locks status --porcelain=v1 -z`;
  - `git --no-optional-locks diff HEAD --binary`.
- **After `next` resolves, concurrently:** the same status and diff, plus `rev-parse HEAD` for `head_after` if O-11 rules (b).
- **The hashes:** each is the sha256 of `TextEncoder` UTF-8 bytes of the decoded stdout, through `crypto.subtle.digest`. A field reads `unavailable` when its call rejects, exits non-zero, or is truncated.
- **`tree_changed_during_run`:** `true` when any compared value differs, `false` when all are equal, `unavailable` when any compared value is `unavailable`.

**2.5 Outcome and output fields** [O-1 (b), O-9: recommended, pending]:
- **On a deny:** no record (2.8).
- **On the answered arm:** `tool_is_error: false`; `interrupted` from `result.interrupted`; `stdout` and `stderr` from the UTF-8 length and hash of the result strings; `text` from `text` when present, else `unavailable`.
- **On the errored arm:** `tool_is_error: true`; `interrupted: unavailable`; `stdout` and `stderr` `unavailable`; `text` from `text`.
- **Persisted output:** when `persistedOutputPath` is set, `stdout` and `stderr` are `unavailable`.
- **`return_code_interpretation`:** copied raw when present; the key is absent otherwise.
- **`backgrounded_after_ms`:** set from `timedOutAfterMs` when present. The after-fields and `tree_changed_during_run` are then `unavailable`.

**2.6 The usage record** [O-10 (b): recommended, pending]. One `turn.complete` registration:
- Its first statement is `const out = await next(e)`. With `e.agentId` absent it returns `out` and does no work.
- Otherwise it writes `{ schema, kind: "usage", agent_id, agent_type, turn_id, recorded_at, usage }` and returns `out`.
- `agent_type` comes from `$.agent.list()`, or `unavailable` when the id is unlisted.
- `usage` is `e.usage`'s four counts and `model`, or `unavailable` when it is absent.
- It is one record per turn, so a resumed subagent yields several.

**2.7 Storage and the log root** [O-2 (a), O-7 (c): recommended, pending]:
- **The log root:** once per module load, cached on success, `git --no-optional-locks rev-parse --path-format=absolute --git-common-dir` at the session default. Its parent is the main working tree M, and the log root is `<parent of M>/<basename of M>-local/evidence`. The path is derived, with no drive letter, both separators handled, no `..`, and no name hard-coded beyond the `-local/evidence` suffix (§7).
- **When the root cannot be found,** no record is written and the result is unchanged.
- **The record file:** `<log root>/<YYYY-MM-DD>/<HHMMSSmmm>-<first 16 hex of the line's sha256>.json`. It holds the record as one JSON line ending in `\n`, written with `$.fs.write`. There is no read, no append, no overwrite of other bytes, and no delete.
- **Reading the log:** a day's JSON lines are `cat <day>/*.json`.
- **Pruning** is not in the mod [O-2].

**2.8 The order with Guardian** (P0 §6). The rule does not depend on order: when `next(e)` resolves with `deny !== undefined`, no record is written.
- If the recorder sits beneath Guardian, a refused call never reaches it.
- If it sits above, its before-calls run and are discarded.
- The installed order is not claimed (E1).

**2.9 Never done:** a refusal, a rewrite, a retry, an answer, `context`, a model call, a network request, a commit, a push, a delete, a read of output into a record, or pruning.

**2.10 The README** states, with no quotation:
- what is recorded, the schema, and the hash basis;
- §1's limits, including that recorder lines are not citable in v0 and are never a mutation observation;
- the log root and the pruning step [O-2];
- that a test command meant to be recorded is run through the Bash tool [O-12].

**Install**, the human's alone, after his typed approval following both gates, from a checkout on main, at user scope only:
- `claude plugin install spatial-evidence-recorder@spatial-ide-mods --scope user`;
- `/reload-plugins`;
- confirm `/plugin`;
- start the session after the binary of record is in place (Guardian Amendment 8's I2 lesson). Whether the directory marketplace needs a refresh first is E0's to record.

**Turning it off:** `claude plugin disable spatial-evidence-recorder --scope user`, or `/plugin`. Never `disableAllHooks`.

**Uninstall:** `claude plugin uninstall spatial-evidence-recorder`.

**Acceptance and stop:** §9 Operator, by reference to the brief.

**2.11 Portability** (R1 to R6, `state/directives/PORTABILITY-2026-09-30.md:31-65 @ fb8cae31 sha256:HASH-TBD`; R3 per `docs/PREREGISTRATION-TEMPLATE.md:177 @ fb8cae31 sha256:HASH-TBD`):
- **Owning boundary:** register.js's `logRoot` and `leadingCdDir`, the mod's only path logic.
- **Platforms:** Windows is supported, tested by `claude plugin test` and live by E0 to E7. On macOS and Linux the mod is unavailable: it is not installed there and no claim is made.
- **R1:** one matcher and one path rule everywhere, with both separators.
- **R2 and R4:** no `process.platform` branch. The drive spelling is recognised only inside `leadingCdDir`'s absolute-path rule, and no drive is assumed.
- **R5:** no level claimed. **R6:** no platform ignore.

**2.12 Guardian, live, and this piece.**
- **G3:** once this form is in HEAD, Guardian lets a Write or Edit to it through only as a pure append, in the custodian's session and in its subagents, in any worktree where the form is filed. The custodian's hash fill is done before the first commit, and every later change is a §10 amendment.
- **G1:** it refuses a Bash call in which an apostrophe opens a quote that runs past the word push (Guardian Amendment 8). For workers and gates: commit and push in separate calls, and record text and test files written with the Write tool. No fixture string in this piece needs git or push.
- **G6:** applies to no worker. **G4:** no directive is touched.
- **E0 checks that Guardian stays enabled** and that its Read-from line is unchanged after the recorder's install.

## §3. Fixtures and predicted outcomes

Plugin tests stub the engine's answers with `on`, and there are no files on disk. Git stubs follow the shapes the worker records (§1 seams). `R` is `C:/r`, the common dir is `C:/r/.git`, and the log root is `C:/r-local/evidence`.

| # | Call or event | Engine answers | Predicted |
|---|---|---|---|
| F1 | main loop, Bash `cargo test --workspace --locked` | git before and after, equal; answered arm | one record at `C:/r-local/evidence/<date>/…json`, every §2.3 field set; `tree_changed_during_run` false |
| F2 | Bash: each not-approved row of §2.2, plus `echo cargo test`, `git status`, `cargo test "x` | none | no `$` call; result unchanged |
| F3 | Bash: `CARGO_TARGET_DIR=D:/t cargo test -p k --lib`; `timeout 600 node --test "scripts/plan/*.test.mjs"`; `npm --prefix renderer/bundle-viewer run verify`; `npm test`; `npm run test:e2e`; `node ./scripts/plan/verify-cites.mjs`; `node scripts\plan\verify.mjs --offline`; `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`; `git status && cargo test` | as F1 | one record each |
| F4 | as F1; rev-parse rejects (timeout), status exits 128, diff truncated | as stated | record written; those fields `unavailable`; result unchanged |
| F5 | as F1; after-status adds `?? b`; separately, after-diff differs alone | as stated | `tree_changed_during_run` true, both cases |
| F6 | as F1; one after-call rejects | as stated | `tree_changed_during_run` `unavailable` |
| F7 | as F1, errored arm `{ isError: true, result, text }` | as stated | `tool_is_error` true; stdout and stderr `unavailable`; text set |
| F8 | as F1, `persistedOutputPath` set | as stated | stdout and stderr `unavailable` |
| F9 | approved; `next` resolves `{ deny }` | deny | no write; result unchanged |
| F10 | approved with `run_in_background: true` | none | no `$` call |
| F11 | `turn.complete`, agentId `ag1`, listed `Explore`, usage set | list | one usage record |
| F12 | `turn.complete`: main loop; `ghost` unlisted; usage absent | list | none; type `unavailable`; usage `unavailable` |
| F13 | approved, agentId `ag2`, listed `worker` | list, git | `agent_type` `worker` |
| F14 | `cd C:/x/wt/a && cargo test -p k`; common dir `C:/x/main/.git`; also `cd wt && cargo test` | git | git cwd `C:/x/wt/a`, `tree_basis` `leading-cd`, file under `C:/x/main-local/evidence/`; the relative form is `unresolved` with no git |
| F15 | as F1, `timedOutAfterMs: 120000` | as stated | `backgrounded_after_ms` set; after fields `unavailable` |
| F16 | as F1; stubs hold each git answer until three before-calls are pending, else release at 500 ms | as stated | three pending at once |
| F17 | as F1, stdout `MARK-OUT`, status `MARK-ST`, diff `MARK-DF` | as stated | the written line holds no marker |

## §4. Tests, one mutation each

- **Observation** (round 25, item 2 (c)): apply the mutation, run `claude plugin test tools/mods/spatial-evidence-recorder`, record the failing test by name in its `// RECORDED MUTATION:` comment with the commit and `claude --version`, then revert. A `verify-mutation` run is not an observation. Before relying on verify-mutation, the worker states, at the tool's commit, whether its scan covers `tools/mods/**/*.test.ts`.
- **No CI runs these tests.** The evidence of record is:
  - the worker's full `claude plugin test` output with `claude --version` at a named commit;
  - the reviewer's own run on the custodian's machine at the gated head;
  - `claude plugin validate` on `tools/mods/spatial-evidence-recorder` and on `tools/mods`, text and `--json`, in the PR body.
  governance-ci still runs on the PR (path filter), with verify-cites, verify-quotes, verify-test-claims, verify:plan and the node suites.
- **The `agentId` cast** follows Guardian §4 and P0's probe, and the test discloses it.

| # | Test | Fixture | Mutation |
|---|---|---|---|
| T1 | `an approved command produces one complete run record` | F1 | the after-snapshot skipped |
| T2 | `a command outside the approved list produces no record and makes no engine call` | F2 | A4 matches any `verify-*.mjs` |
| T3 | `every approved spelling in the matcher table produces one record` | F3 | env assignments not stripped |
| T4 | `a failing or timed-out git call gives unavailable fields and leaves the result unchanged` | F4 | the `try` around the before-snapshot removed |
| T5 | `an edit during the run sets tree_changed_during_run` | F5 | only diff hashes compared |
| T6 | `an unavailable side reads tree_changed_during_run unavailable` | F6 | an unavailable side read as unchanged |
| T7 | `the errored arm records the tool's error flag and the text fields, never stdout or stderr` | F7 | the errored arm reads `result.stdout` |
| T8 | `persisted output gives unavailable stdout and stderr fields` | F8 | the `persistedOutputPath` check dropped |
| T9 | `a refused call produces no record` | F9 | the deny check dropped |
| T10 | `a background call passes with no engine call` | F10 | the `run_in_background` check dropped |
| T11 | `a subagent's turn end produces one usage record` | F11 | the `$.agent.list` lookup dropped |
| T12 | `the main loop's turn end writes nothing, and missing values read unavailable` | F12 | the main-loop check dropped |
| T13 | `every hook returns what next produced, byte for byte` | F1, F2, F7, F9, F11, and F1 with every `$` call rejecting | the Bash hook returns `{ ...ran, context: ["x"] }` |
| T14 | `a leading absolute cd sets the tree, and any other cd leaves it unresolved` | F14 | `cwd` not passed |
| T15 | `the log root comes from git's common directory, one new file per record, with no read` | F14 | root taken from `toplevel` |
| T16 | `the before-side git calls are issued together` | F16 | serial awaits |
| T17 | `every process call is git with no optional locks, a listed subcommand and the declared timeout` | F1, F14 | `timeoutMs` dropped from the after-side diff |
| T18 | `a subagent's approved run records its listed type` | F13 | `$.agent.list` not called for run records |
| T19 | `an auto-backgrounded result records backgrounded_after_ms with after fields unavailable` | F15 | the `timedOutAfterMs` check dropped |
| T20 | `a record carries no output, status or diff text` | F17 | stdout copied into the record |

**The overhead test,** as the brief's §4 lists it. Zero work for other commands is asserted by T2, T10 and T12. The bound is measured live by E5, because the test child has no process (§0.2 item 4). P0's arithmetic is not the measurement.

**E-rows**, live and after install. Each runs only if the human's typed install approval names it. The custodian records each as a class 1 row on main, with reason texts byte-copied by script and folders outside the repository named in words. Each row records `claude --version` and the session's engine build (process start against binary mtime, Guardian Amendment 8's method).
- **E0:** the `/plugin` line; `claude plugin list`'s Read-from line for the recorder; whether the marketplace needed a refresh; Guardian still enabled, with its Read-from line unchanged.
- **E1** [O-8]: main loop `node --test "git push -f"`. G1 refuses on its quoted-token rescan. If G1 failed open, node would get one file argument and fail, and nothing pushes. Predicted: Guardian's G1 reason, no new file in the day folder, porcelain unchanged. This is G1-shaped, so it needs the approval's own naming (round 34, item 3's caution). Without it, E1 is recorded from the first natural deny of an approved call.
- **E2** [O-1]: `node --test` on a scratch passing file, then on a scratch failing file, both outside the repository. Predicted: `tool_is_error` false, then true. A false on the failing run is class 2, and `tool_is_error` then stands for no exit status.
- **E3** [O-10]: one `Explore` subagent, spawned once and resumed once. Predicted: two usage records, typed `Explore`, with counts; none for the main loop.
- **E4** [O-4]:
  - (a) a subagent's `cd <a clean worktree, absolute> && node --test <scratch>`. Predicted: `leading-cd`, and `toplevel` is the worktree.
  - (b) main loop: `cd <worktree>`, then `node --test <scratch>`, then `pwd`, each in its own call. If `pwd` names the worktree, `session-default` is shown fallible in the main loop, a class 2 row records it, and the README limit follows.
- **E5** [O-6]: the first 20 approved runs after install. p50 and p95 of `recorder_ms` before + after + write. Predicted: p95 at or under §7's bound.
- **E6** [O-9]: a `run_in_background` `node --test <scratch>`. Predicted: no record.
- **E7:** for E2's runs, the record's `text` hash against the hash of the tool result the session transcript stored, extracted by script. Predicted: equal. A difference is recorded with both values for the human. It is not read as an alteration, or as none, without his ruling.
- **No live probe writes into the repository.**

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions:** T1 to T20 pass at the head, and each fails under its mutation. `validate` prints only §2.0's lines (a difference confined to a `(via …)` annotation is class 2). E0 to E7 come out as §4 predicts.

**Declared unchanged:** every path outside `tools/mods/spatial-evidence-recorder/`, except the one added marketplace entry. In particular:
- all of `tools/mods/spatial-guardian/`, and Guardian's form;
- every `scripts/`, workflow, `.claude/` and root `.gitignore` byte;
- `AUTONOMY.md` and `AI_DEVELOPMENT.md`.

**Invalidators (stop, to the custodian):**
- **I1:** the test kit cannot answer an event §4 needs.
- **I2:** `claude --version` is not 2.1.289 at a run of record. Every test and `validate` run is re-run, and the change is recorded.
- **I3:** `validate` shows a hook or call outside §2.0.
- **I4:** a field needs a call outside §2.0.
- **I5:** §7's file count is exceeded.
- **I6:** any step would install, enable or load the mod, add a marketplace, or write under the user Claude directory.
- **I7:** a recorded git output shape (§1 seams) contradicts §2.4.
- **I8:** a ruling on an OPEN item falls outside the options this draft states. That goes to a redraft, never to code.

**Falsification:** any fixture's return differs from `next`'s value; a not-approved fixture makes a `$` call; a record carries output content; a deny yields a record.

## §6. Instruments

Assertions:
- returns compared with `toEqual` and with `JSON.stringify` equality;
- the arguments the stubs receive, `$` call counts, and written paths and lines;
- `validate`'s two lines;
- `claude --version` and `git --version`;
- verify-cites, verify-quotes, verify-test-claims, verify-mutation and verify:plan, each named with its commit (round 15 (c)).

One measurement: E5's p50 and p95 of `recorder_ms`, on the named sample. It is not a docs/08 row.

## §7. Declared values and ceilings

- `PROCESS_TIMEOUT_MS = 2000` per git call.
- `RECORDER_P95_BOUND_MS = 300`, over before + after + write [O-6]. The E5 sample is the first 20 approved runs.
- `UNAVAILABLE_STOP = 20%` [O-13]: over the evaluation window, the share of run records with any of `head`, `before`, `after` or `tool_is_error` `unavailable`, or the share of usage records with `usage` `unavailable`.
- The log root suffix: `-local/evidence` [O-7].
- `SCHEMA = spatial-evidence-recorder/v0`.
- §2.2's two tables, and §2.4's argv set.
- **Size:** at most 1400 changed lines, insertions plus deletions, over at most 7 files:
  - `tools/mods/.claude-plugin/marketplace.json`;
  - `tools/mods/spatial-evidence-recorder/.claude-plugin/plugin.json`;
  - `tools/mods/spatial-evidence-recorder/hooks/hooks.json`;
  - `tools/mods/spatial-evidence-recorder/hooks/register.js`;
  - `tools/mods/spatial-evidence-recorder/test/recorder.test.ts`;
  - `tools/mods/spatial-evidence-recorder/README.md`;
  - `tools/mods/spatial-evidence-recorder/.gitignore`.
  - Counting command: `git diff --numstat <base>..<head> -- . ':!tools/mods/EVIDENCE-RECORDER-V0-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, where `<base>` is the merge base on main and `<head>` a named commit. An overrun is class 8, and this line is never edited.
  - Estimate: register.js 340, tests 720, README 90, the rest 20.
- **Minutes:** the node's `budget_minutes` (AUTONOMY §10).

## §8. Block-on-sight

1. A `deny`, an `allow`, a `tool.check` hook, `context`, or a `result` or `text` of the hook's own. A returned value other than `next`'s own. `next` called with anything but the received event, or other than exactly once on every path.
2. Any `.catch` on a registration.
3. A `$.model`, `$.ui`, `$.session.*`, `$.store`, network, `$.fs.read`, `$.fs.list`, `$.fs.stat` or `$.fs.exists` call, unless a ruling on O-2 or O-3 adds it.
4. A `$.process.run` whose `argv[0]` is not the literal `git`, whose `argv[1]` is not `--no-optional-locks`, whose subcommand is outside §2.1's set, or that has no `timeoutMs` at or under §7.
5. A hook or call outside §2.0. A write outside the log root. Output, status or diff content in a record.
6. An estimated value, or a field with no `unavailable` route.
7. An npm dependency, a `package.json` or a lockfile; `.claude-plugin/types/` committed.
8. Any install, enable, marketplace add, `--plugin-dir` session, or write under the user Claude directory, by anyone in the piece.
9. Any change under `tools/mods/spatial-guardian/`, or to Guardian's marketplace entry.
10. An OS branch. A drive spelling outside `leadingCdDir`. A user-profile path in any file, test or commit message.
11. A test without its `RECORDED MUTATION`. A record that calls a `verify-mutation` run an observation of a mutation. A mutation recorded without its observation commit. Text presenting a recorder line as citable evidence, or as a mutation observation.
12. A §7 overrun not recorded as class 8, or §7's line edited. Any code of a scope addition before its class 9 amendment.
13. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id;
    - a bare self-line;
    - a pin read as current;
    - a tool claim without the tool's commit;
    - a correction round without its superseded index.
14. A file outside §7's list, apart from this form and the custodian's generated set.
15. A squash or rebase merge, or any force-push.
16. A README naming `disableAllHooks` as an off-switch, or a `project` or `local` scope.
17. Code of a shape §2 marks as pending, before its ruling is filed and carried into the form.
18. Pruning or delete code in the mod.

## §9. Gates

- **Architect:**
  - the Gating heads;
  - the brief's §1 to §4 against §2;
  - the ruling's items 1 to 3;
  - each OPEN ruling against §2;
  - the seams (§1), including the worker's recorded git shapes;
  - R1 to R6 against §2.11;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - `claude plugin test` and both `validate` runs on the custodian's machine, with `claude --version`;
  - every mutation observed at the gated head;
  - §7 recounted;
  - §8 items 1 to 4 checked by reading every hook path and every `$.process.run`.
- **Suites, green before either gate:**
  - governance-ci on the branch, read before gating;
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`, unchanged;
  - §6's tools.
- **Operator:**
  - The human sights the README's install, off, uninstall and pruning steps, gives his typed install approval naming the E-rows he allows, and installs it himself. The custodian records the E-rows.
  - **Acceptance after install** (`state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:55-59 @ fb8cae31 sha256:HASH-TBD`): two weeks after install, or the next six gated pieces, whichever comes first. It is measured against the gate log's recent baseline on four measures: evidence corrections the gates find; filings citing recorder lines (zero is expected while item E is unruled); false `tree_changed_during_run` flags; and the overhead.
  - **Stop and uninstall** (`state/directives/MODS-EVIDENCE-RECORDER-V0-2026-10-03.md:61-64 @ fb8cae31 sha256:HASH-TBD`): any tool result altered; the overhead's p95 over §7's bound; `unavailable` over `UNAVAILABLE_STOP`. The custodian reports a stop to the human, who uninstalls.

## §10. Amendments — opens empty, append-only (classes 1 to 9; each correction round ends with a superseded index)
```

## (2) OPEN items, for the human (code waits as stated)

- **O-1, the outcome field.** The options are (a) no outcome field, (b) `tool_is_error`, `interrupted`, the raw `return_code_interpretation`, and `text` bytes and hash as the errored arm's stand-in, or (c) parsing an exit code out of `text`, which I reject. Only (a) is within the brief, whose condition (if the build exposes it) is false at 2.1.288. I recommend (b), but it adds a field, so it needs the human's ruling. E2 shows whether a non-zero exit sets `isError`. Code waiting: §2.5, T7.
- **O-2, storage.**
  - Layout: (a) one file per record, a write with no read, or (b) a day file read then written, serialised in the module, which can lose lines across sessions and stops at 4 MiB.
  - Pruning: (i) none in v0, (ii) a repository script, which is a new file and its own scope, or (iii) by hand at the weekly window, with the README naming the step.
  - I recommend (a) with (iii). Code waiting: §2.7, T15.
- **O-3, the calls line.** My recommendation is `$.agent.list`, `$.fs.write`, `$.process.run` (git only).
  - What departs from item 7: `$.fs.write` of a new file per record stands in for file appends, and git also supplies the log root and the top-level path. The human should confirm that this reads as item 7.
  - Avoided by design: `$.fs.read` (only under O-2 (b)), `$.fs.exists`, `$.session.root` and `$.session.repo`. Excluded: `$.fs.list` and a non-git process, which only in-mod pruning would need.
  - Code waiting: as O-2.
- **O-4, which tree.** The options are (a) always the session default, with a flag, (b) parse a leading absolute `cd <dir> &&` as `leading-cd`, else `session-default`, and mark any other `cd` as `unresolved` with the tree fields `unavailable`, or (c) mark the tree fields `unavailable` for any `cd`, or for any subagent call. I recommend (b). E4 tests it, including the main loop's kept cwd. Code waiting: `leadingCdDir`, T14.
- **O-5, the hash names.** I recommend `status_z_text_sha256`, `diff_binary_text_sha256` and `{text_bytes, text_sha256}`, each the sha256 of the UTF-8 encoding of decoded text. A field reads `unavailable` when its call rejects, exits non-zero or is truncated; stdout and stderr also read `unavailable` on the errored arm and when output is persisted. Code waiting: every field name and assertion.
- **O-6, the overhead.** The options are (a) concurrent calls per side, with a bound of p95 ≤ 300 ms on before + after + write, or (b) serial calls, with p95 ≤ 400 ms. Either way a `recorder_ms` field is added as the instrument, and E5 is the measurement. I recommend (a). Code waiting: T16, `recorder_ms`.
- **O-7, the log path.** The options are (a) `.claude/state/evidence/`, which needs the brief's criterion reworded, (b) `target/evidence/`, which `cargo clean` deletes and which sits under the tracked root, or (c) `<parent of the main tree>/<its basename>-local/evidence`, derived from git's common dir. I recommend (c). Code waiting: `logRoot`, T15.
- **O-8, Guardian order.** The design rule (a deny yields no record) holds in any order. E1 is either a G1-shaped call, `node --test "git push -f"`, that cannot push if G1 fails open and needs the approval to name it, or the first natural deny. Code waiting: none.
- **O-9, the matcher.** It adds to the brief's list:
  - exclusions for `verify-mutation`, `--no-run` and `-- --list`;
  - handling for env, `timeout` and `cd` prefixes;
  - `test:e2e` and `--prefix`.
  A `run_in_background` call passes with no work (the alternative is a partial record). An auto-backgrounded result is recorded with `backgrounded_after_ms` set. Code waiting: the matcher, T2, T3, T10, T19.
- **O-10, the usage record.** The options are (a) the brief's minimum, (b) that plus `model` and `turn_id`, or (c) that plus duration, `isAborted` and `reason`. I recommend (b). Code waiting: §2.6, T11, T12.
- **O-11, HEAD after the run.** The options are (a) the brief's literal shape, where a commit during the run that leaves status and diff equal goes unflagged, or (b) add `head_after` to the comparison. I recommend (b). Code waiting: the after-side argv, T5.
- **O-12, PowerShell.** The brief scopes non-Bash routes out, but this machine lists PowerShell as its primary shell. The options are (a) keep it out, with the README advising Bash for test commands, or (b) add a PowerShell hook, which is a scope addition and changes item 7's hooks line. I recommend (a). Code waiting: none.
- **O-13, the unavailable stop threshold.** I recommend 20% of run records, or of usage records, as defined in §7. The number is the human's. Code waiting: none (acceptance only).

## (3) Files read

- C:\dev\spatial-ide\state\directives\2026-10-03-evidence-recorder-ruling.md
- C:\dev\spatial-ide\state\directives\MODS-EVIDENCE-RECORDER-V0-2026-10-03.md
- C:\dev\spatial-ide\state\consults\2026-10-04-evidence-recorder-v0-p0-report.md (whole)
- C:\dev\spatial-ide\PLAN.yaml (lines 3825-3859)
- C:\dev\spatial-ide\tools\mods\GUARDIAN-V0-PREREGISTRATION.md (whole)
- C:\dev\spatial-ide\tools\mods\spatial-guardian\hooks\register.js, hooks\hooks.json, .claude-plugin\plugin.json, .gitignore, README.md
- C:\dev\spatial-ide\tools\mods\spatial-guardian\test\guardian.test.ts (lines 1-140, 400-479)
- C:\dev\spatial-ide\tools\mods\.claude-plugin\marketplace.json
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md
- C:\dev\spatial-ide\AUTONOMY.md (§21 at lines 306-395, §25 to §30 at lines 476-529, plus the heading index)
- C:\dev\spatial-ide\AI_DEVELOPMENT.md (lines 440-464)
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md
- C:\dev\spatial-ide\state\directives\2026-10-03-lead-data-pilot-direction.md
- C:\dev\spatial-ide\state\drafts\weekly-window-2026-10-09.md (headings; section E)
- C:\dev\spatial-ide\.gitignore
- C:\dev\spatial-ide\.github\workflows\governance-ci.yml (grep for path filters and run lines only)
