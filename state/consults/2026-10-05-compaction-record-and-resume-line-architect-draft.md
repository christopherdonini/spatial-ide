*Custodian's filing note (2026-10-05): the architect's draft of the preregistration for `compaction-record-and-resume-line` (piece A of `state/directives/CONTEXT-FLUSH-2026-10-05.md`; slot 2 under the product-first direction), drafted alone. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is efbbd026f861501529542730b0d17a1c8b10197ecfd7537f31572383f0a0a4e6. Write audit PASS: zero write calls (Read 23, Grep 11, Glob 1, SubagentHandback 1). Run window from the transcript: 2026-10-05T20:39:52.054Z to 2026-10-05T20:47:42.916Z (189,978 subagent tokens, 36 tool uses, 472,706 ms, from the harness's task notification). The harness flagged the hand-back as matching an instruction-shaped pattern (a settings-file name), and the custodian reads it as a draft. The form as committed is part 2's block with its pin hashes computed at 185bd85f, and nothing else changed.*

---

Reviewed: main @ 185bd85f

## 1. Which form, and why

**I chose the full form, with full gating from dispatch.** It lives at `scripts/hooks/COMPACTION-RECORD-AND-RESUME-LINE-PREREGISTRATION.md`, beside the other hook forms, and it becomes the node's `gate:`. Three of the rules apply, and each one alone would require it:
- **§21a, a property currently under test.** At `scripts/hooks/hooks.test.mjs:1021-1031`, the second-chance test asserts that an automatic call's first decision is `block`. Piece A reverses exactly that.
- **§21c, size.** The estimate is about 390 changed lines with tests counted, well over 150.
- **§21c, new user-visible behaviour.** The resume line enters the model's context at every SessionStart.

Under §25(e) and round 25, item 2 (e), the `Out-of-scope` line would name a §21a category. So no five-line form is committed.

**For the human:**
- Nothing blocks code.
- OPEN-1 (below) only sets when the measure is first reported.
- Two readings in the draft are mine, and the human may overturn either before code:
  1. **An absent or unrecognised `trigger` is recorded and allowed, not blocked.** I lean toward allowing because the brief's stop condition is "the hook blocks an automatic compaction". The cost: if a Claude Code build ever stops sending `trigger`, a manual `/compact` is no longer blocked. This would show up in the record as `trigger: null`.
  2. **AUTONOMY §7 gets more than the brief's A4 three edits.** The correction also gains the hook's existing at-or-after-the-last-ledger-change clause, and the SessionStart bullet gains the resume line. I read "corrected" as covering both, because §7 would otherwise stay wrong in the bullets being edited. All edits are within existing lines, so no line moves.

## 2. The draft

````markdown
# The PreCompact hook records an automatic compaction and lets it through; a manual `/compact` is blocked once; a resume line of machine facts; AUTONOMY §7 corrected (PLAN node `compaction-record-and-resume-line`) — preregistration

**Authority:** the human's context-flush direction (RULED 2026-10-05 — the context-flush direction, cited by its block's heading; it carries no round, item or entry number), text at `state/directives/2026-10-05-human-direction-context-flush.md:6-16 @ 185bd85f sha256:HASH-TBD`, items 2 and 4 referenced and not restated. It approves Fable's brief, whose piece A is `state/directives/CONTEXT-FLUSH-2026-10-05.md:30-37 @ 185bd85f sha256:HASH-TBD`, its measure `state/directives/CONTEXT-FLUSH-2026-10-05.md:56-62 @ 185bd85f sha256:HASH-TBD`, its acceptance and stops `state/directives/CONTEXT-FLUSH-2026-10-05.md:64-70 @ 185bd85f sha256:HASH-TBD`. Placement: the product-first direction, `state/directives/2026-10-05-product-first-direction.md:9 @ 185bd85f sha256:HASH-TBD` and `state/directives/2026-10-05-product-first-direction.md:33 @ 185bd85f sha256:HASH-TBD`. Node: `PLAN.yaml:4118-4135 @ 185bd85f sha256:HASH-TBD`.
**Drafted by** the architect agent on the custodian's brief, alone (no lead-data read: no `engine/` or `kernel/` path), read at main 185bd85f. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Gating:** full, reviewer and architect, under three heads, each enough alone:
- **§21a, a property currently under test:** an automatic call blocks first (`scripts/hooks/hooks.test.mjs:1021-1031 @ 185bd85f sha256:HASH-TBD`). This piece reverses it.
- **§21c, size:** over the bound (§7).
- **§21c, new user-visible behaviour:** the resume line enters the model's context.

No ADR, security, wire or exposure head applies. Under round 25, item 2 (e), no five-line form is used.

## §0. Disclosure
- **Reasoned from code at 185bd85f. Nothing was run.** Relied on:
  - the header's freshness and second-chance text: `scripts/hooks/precompact-flush.mjs:15-23 @ 185bd85f sha256:HASH-TBD`;
  - the declared figures: `scripts/hooks/precompact-flush.mjs:33-34 @ 185bd85f sha256:HASH-TBD`;
  - the parser, exported, returning `{ flushedAt, tip, block }` or `null`: `scripts/hooks/precompact-flush.mjs:57-79 @ 185bd85f sha256:HASH-TBD`;
  - the tracked-only dirty filter: `scripts/hooks/precompact-flush.mjs:150-155 @ 185bd85f sha256:HASH-TBD`;
  - the record path and writer: `scripts/hooks/precompact-flush.mjs:169-184 @ 185bd85f sha256:HASH-TBD`;
  - the decision core, which never reads `trigger` and overwrites `lastBlockedAt` on each block: `scripts/hooks/precompact-flush.mjs:186-209 @ 185bd85f sha256:HASH-TBD`;
  - the entry, exit 2 on block and 0 otherwise, fail-open on bad stdin or a throw: `scripts/hooks/precompact-flush.mjs:221-251 @ 185bd85f sha256:HASH-TBD`;
  - the cloud guard: `scripts/hooks/precompact-flush.mjs:253-256 @ 185bd85f sha256:HASH-TBD`;
  - `buildOutput` and the SessionStart entry: `scripts/hooks/session-resume.mjs:53-101 @ 185bd85f sha256:HASH-TBD`.
- **How an automatic compaction is told from a manual one, and the evidence:**
  1. **The registration.** `.claude/settings.json` lines 26-47 at 185bd85f, sha256 HASH-TBD, register matchers `manual` and `auto` to the same command, with no argument. The script therefore cannot know which matcher fired. The stdin `trigger` field is its only discriminator without a settings change, and this piece makes none.
  2. **The documented contract** (Appendix B, Claude Code 2.1.270, a historical pin, authoritative for what was verified then): PreCompact receives `trigger` and `custom_instructions`, with matchers `manual` and `auto` (`AUTONOMY.md:439 @ 185bd85f sha256:HASH-TBD`). §7's summary of the field's two values is `AUTONOMY.md:178 @ 185bd85f sha256:HASH-TBD`.
  3. **The automatic matcher reaches the script.** The 2026-10-05T11:33:48Z compaction, which its transcript marks as trigger auto, followed the hook's block record of 11:30:44.895Z for that session (`state/drafts/weekly-window-2026-10-09.md:492 @ 185bd85f sha256:HASH-TBD`). This is evidence, not Authority. It shows the script runs on the automatic path. It does not show the stdin value.
  4. **P0, before code:** the installed build's declared PreCompact hook input (§6).
  5. **Live proof:** E1 (§4). The record line stores `trigger` as received.
- **Why an automatic compaction is never blocked** (the brief's grounds, approved by the direction, not re-derived here):
  - a block on a recovering compaction fails the request (`AUTONOMY.md:439 @ 185bd85f sha256:HASH-TBD`);
  - whether a block's reason reaches the model on that path is undocumented (`AUTONOMY.md:455 @ 185bd85f sha256:HASH-TBD`).
- **Concurrent work:**
  - MP-1 (slot 1) is under `engine/`, which is disjoint.
  - `guardian-v1` is parked at 5a9eb051, under `tools/mods/`. Before dispatch, the custodian confirms that its branch's diff against main touches neither `scripts/hooks/` nor `AUTONOMY.md`.
  - Piece B follows this piece and edits only `tools/mods/`.
- **No record pins** a line of `AUTONOMY.md` §7. A search for `AUTONOMY.md:176` to `:188` found none at 185bd85f. §2 item 5 edits only within existing lines.
- **Fixture drive:** nothing is measured.

## §1. May and may not claim
- **May claim:**
  1. A call whose `trigger` is not `manual` is judged for freshness, recorded and allowed. It never blocks, and it neither reads nor writes `lastBlockedAt` (T2, T4).
  2. A manual call is blocked once when stale and allowed by the second chance within 15 minutes, as at 185bd85f (T3).
  3. Every call that reaches the decision appends exactly one record line with the §7 fields (T1, T2, T4).
  4. A record line that cannot be written leaves the decision unchanged (T5).
  5. SessionStart prints one resume line after the block, with three facts, and prints `unknown` for any fact it cannot read. It still exits 0 (T6, T7).
- **May not claim:**
  - That a flush happens before an automatic compaction. This piece causes none; piece B is the nudge.
  - That any block's reason reaches the model.
  - The live stdin `trigger` value, before E1.
  - A record for a call that never reaches the decision: the cloud guard, unparseable stdin, or an unexpected throw. These exit 0 unrecorded, as today.
  - That an absent or unrecognised `trigger` is a manual call. Such a call is recorded and allowed, so a manual `/compact` under a build that sent no `trigger` would not be blocked. It would be visible as `trigger: null`.
  - The resume line's facts as the facts at the PreCompact call. They are read at SessionStart. The age at the call comes from the record line: `at` minus `flushed_at`.
  - Ages under clock skew.
  - Any latency figure, or any `docs/08` row.
  - macOS: no run (R5).
- **Unchanged:**
  - the freshness rule and its figures (10 minutes, 15 minutes), and `BLOCK_REASON`;
  - the cloud guard;
  - `.claude/settings.json`, `scripts/hooks/cloud.mjs`, `scripts/hooks/stop-queue.mjs`, `scripts/hooks/flush.mjs`, `scripts/hooks/cloud.test.mjs`, `scripts/hooks/guardian-continuity-parity.test.mjs`;
  - everything under `tools/mods/`;
  - `READING_ORDER` and `extractSessionContinuityBlock`;
  - the Stop hook and its predicate.

  ADR-006 does not apply (repository tooling). No ADR is cited or amended.
- **Seams:**
  - **precompact-flush to Claude Code's PreCompact stdin (`trigger`):** §0 items 2 to 5.
  - **session-resume to `parseSessionContinuity`:** the existing export, called with its real signature (§0). Importing the module runs nothing, because its entry is guarded.
  - **session-resume to git:** real git in every test, argument arrays, no shell.
  - **The resume line to the model:** SessionStart stdout (`AUTONOMY.md:443 @ 185bd85f sha256:HASH-TBD`).
  - **The record to its consumer:** the custodian's measure rows (§2 item 6), the brief's named consumer.
  - **No new export and no new option.** `buildOutput`'s signature is unchanged. Tests go through `decidePrecompact` (its existing options), `buildOutput`, or the shipped CLI.

## §2. The change
1. **`scripts/hooks/precompact-flush.mjs`, the decision:**
   - **`trigger === 'manual'`:** exactly as at 185bd85f. Second chance → allow. Fresh → allow. Stale → write `lastBlockedAt` and block.
   - **Any other value, or absent:** judge freshness only. Fresh → allow, record `allowed-fresh`. Stale → allow, record `recorded-only` with the freshness reason. `lastBlockedAt` is neither read nor written.
   - The return shape stays `{ decision: 'allow' | 'block', reason?, stderr }`.
   - The header comment is rewritten to this rule, and it quotes nothing.
2. **The record (A1).**
   - Each call that reaches the decision appends one line to `.claude/state/precompact-<session_id>.jsonl`, beside the existing `.json`.
   - The line is `JSON.stringify` of the §7 fields in order, then `\n`.
   - `flushed_at` is read by a module-local helper (the ledger read with `parseSessionContinuity`; `null` on any failure).
   - `reason` is the freshness reason for `blocked` and `recorded-only`, and `null` for `allowed-fresh` and `allowed-second-chance` (the second chance does not judge freshness).
   - `custom_instructions` is never recorded.
   - The append runs in its own try/catch. On failure, one §7 stderr line is written and the decision stands.
   - The folder is untracked (`.gitignore` line 43 at 185bd85f, sha256 HASH-TBD).
3. **`scripts/hooks/session-resume.mjs`, the resume line (A3).**
   - It comes after the block (or after the note), separated as the existing parts are, in §7's format.
   - **Age:** whole minutes, floored, from the block's `flushed_at` to now. `unknown` when there is no block or no valid `flushed_at`.
   - **Commits past tip:** `git rev-list --count <tip>..HEAD`. `unknown` when the tip fails the §7 guard or git fails.
   - **Modified tracked files:** the count of `git status --porcelain` lines not starting `??`, the same filter as precompact-flush. `unknown` when git fails.
   - Every git call takes `cwd` set to the project root, the §7 timeout, and stderr ignored.
   - The reading order and the block print as today. The hook still never throws and exits 0.
4. **`scripts/hooks/hooks.test.mjs`:**
   - T1, T2 and T4 to T7 are new (§4).
   - The existing second-chance test's input `trigger: 'auto'` becomes `'manual'`. That one line is its only edit. Its name and assertions are unchanged, and it gains a `RECORDED MUTATION` (T3).
5. **`AUTONOMY.md` §7, corrected in place (A4, under the direction's item 2).** Three existing lines are edited. No line is inserted or removed, and each bullet stays one line. The text below is the form's own wording, not a quotation of any source:
   - **The design bullet (line 182 at 185bd85f).**
     - The freshness figure reads 10 minutes, and gains the hook's existing clause that `flushed_at` must be at or after the last ledger change below the flush commit.
     - The block is stated for a manual `/compact` only. An automatic compaction, or a call whose `trigger` is not `manual`, is judged, recorded and let through, never blocked (the 2026-10-05 context-flush direction).
     - Every call that reaches the decision appends one line to `.claude/state/precompact-<session_id>.jsonl`.
     - The quoted `reason:` span and the 15-minute second chance stay byte-unchanged in substance. The clause on a context-limit recovery is dropped, because an automatic compaction is no longer blocked.
   - **The SessionStart bullet (line 183 at 185bd85f)** gains one clause: after the block, the hook prints one line of machine facts (the block's age in minutes, the commits `HEAD` is past the block's `tip`, and the modified tracked files), with `unknown` for any fact it cannot read.
   - **The dry-run bullet (line 187 at 185bd85f)** gains one sentence: since this piece (its PLAN node and this form, named by path), an automatic compaction is never blocked, so the hook no longer depends on the open question; the record line and the resume line are the evidence of each compaction.
6. **The measure (brief §5), replacing window item J's count from the first automatic compaction after the merge** (the direction's item 4).
   - **Accrual.** For each automatic compaction, the custodian appends one row to the current weekly-window draft under `state/drafts/`, under item J's heading. The row gives:
     - the compaction's boundary time and the session's first 8 characters;
     - the record line, byte-copied;
     - the block's age at the call, as the record's `at` minus its `flushed_at`, in minutes (`unknown` when `flushed_at` is `null`);
     - the decision and reason;
     - the commits past tip and the modified tracked files, from the resume line that followed.

     After piece B, the row also gives that cycle's N1 nudges (piece B's form).
   - **Status of the sources.** The record file and the transcript are evidence (a run's output), never Authority (round 14; round 15's distinction).
   - **The old count** stops at the merge. Its rows stay as counted.
   - **When the rows are reported** is OPEN-1.
7. **`scripts/hooks/README.md`:** the PreCompact section, the SessionStart section, the state-directory list (the new `.jsonl`) and the Tests paragraph are updated. The README quotes nothing new.
8. **Portability** (`state/directives/PORTABILITY-2026-09-30.md:31-65 @ 185bd85f sha256:HASH-TBD`):
   - **R1:** one rule on every platform. The record and the resume line are byte-identical in shape.
   - **R2:** no OS-conditional code.
   - **R3:**
     - Windows: supported, tested locally, and live under Git Bash.
     - Linux: supported, tested in governance-ci (`node --test "scripts/hooks/*.test.mjs"`).
     - macOS: no run and no claim.
     - The hook needs `git` on `PATH`. A missing git gives `unknown` (the resume line) or the existing stale reason (the PreCompact hook).
   - **R4:** git revision arguments as literals. File paths through `path.join` only, never in a git argument. Temp directories from `os.tmpdir()`, removed with `t.after`. CLI tests spawn `process.execPath`. No shell and no drive letter. Branch names never assumed.
   - **R5:** L1 only.
   - **R6:** no platform ignore.

## §3. Fixtures and predicted outcomes
**Setup.** Each fixture is a fresh `os.tmpdir()` directory. "No block" means `state/CUT-STATE.md` without a SESSION-CONTINUITY block. Real git repositories set local identity and `core.autocrlf false`.

| # | Setup | Predicted |
|---|---|---|
| P1 | repo, no block, `trigger: 'manual'` | `block`; record `{at, trigger:'manual', decision:'blocked', reason:'no SESSION-CONTINUITY block with both flushed_at and tip', flushed_at:null}`; the `.json` holds `lastBlockedAt` |
| P2 | P1, then manual again at now + 5 min | `allow`; second record line `allowed-second-chance`, `reason: null` |
| P3 | repo, no block, `trigger: 'auto'`, through the CLI | exit 0; stderr carries §7's recorded-only line; one record line `recorded-only` with P1's reason; no `.json` written |
| P4 | block fresh by an injected git, `trigger: 'auto'` | `allow`; record `allowed-fresh`, `reason: null`, `flushed_at` the block's |
| P5 | no block; one call with no `trigger`, one with `trigger: 'other'` | each `allow`; records `recorded-only`, `trigger` `null` and `'other'` |
| P6 | P1 with a directory at the `.jsonl` path | `block`; `lastBlockedAt` written; stderr carries §7's record-failure line |
| R1 | c0 README; c1 the ledger with `flushed_at` F and `tip` c0's hash; c2 README edit; README modified uncommitted; one untracked file | the resume line is the output's last line: `commits_past_tip=2`, `modified_tracked_files=1`, age between the floors computed from the clock before and after the call |
| R2 | a non-repository directory (`GIT_CEILING_DIRECTORIES` set) with a block whose `flushed_at` is valid and `tip` is hex, through the CLI; then a directory with no ledger | exit 0; first case: the age is a number, `commits_past_tip=unknown`, `modified_tracked_files=unknown`; second case: all three `unknown`; the reading order present in both |

## §4. Tests, one mutation each (`scripts/hooks/hooks.test.mjs`)
- No timing assertion beyond R1's clock bracket, and no network.
- **How a mutation is observed:** apply it, run the named test, record its first failing assertion in the test's `// RECORDED MUTATION:` comment, then revert. The closing record names the commit each mutation was observed at. A `verify-mutation` run is not an observation.

| # | Test | Fixture | Mutation |
|---|---|---|---|
| T1 | `precompact-flush: each call appends one record line with its trigger, decision, reason and flushed_at` | P1, P2 | M1: the append replaced by an overwrite |
| T2 | `precompact-flush CLI: an automatic compaction with a stale block exits 0 and records it` | P3 | M2: the non-manual branch removed (every call takes the manual path) |
| T3 | `precompact-flush: a second PreCompact within 15 minutes is allowed whatever the freshness` (existing; `trigger` now `'manual'`) | P1, P2 | M3: the `lastBlockedAt` write removed |
| T4 | `precompact-flush: a call whose trigger is absent or not manual is judged, recorded and allowed` | P4, P5 | M4: the branch condition changed to `trigger !== 'auto'` |
| T5 | `precompact-flush: a record line that cannot be written leaves the decision unchanged` | P6 | M5: the append's try/catch removed |
| T6 | `session-resume: prints the resume facts line after the block` | R1 | M6: the `??` filter dropped from the modified count |
| T7 | `session-resume CLI: an unreadable git answer prints unknown and exits 0` | R2 | M7: a failed git answer printed as `0` |

- **E1 (live, after the merge; the brief's acceptance).** Once the main checkout's `HEAD` contains the merge, the custodian records the first automatic compaction as a class 1 row on main, with:
  - `claude --version`;
  - the checkout's `HEAD`;
  - the record line, byte-copied;
  - the transcript's boundary time and its trigger;
  - the resume line as the transcript holds it.

  **Predicted:** `trigger: 'auto'`; decision `allowed-fresh` or `recorded-only` (with its reason when `recorded-only`); no block; the resume line present after the compaction.

  **"With a reason"** in the brief's acceptance is read as the decision plus, when not fresh, the freshness reason.

  No probe is forced.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:**
  - T1 to T7 pass, and each fails under its own mutation.
  - Every other test in `scripts/hooks/`, `scripts/plan/` and `scripts/evidence/` passes unchanged, `cloud.test.mjs` included (its PreCompact case is manual and still exits 2).
  - E1 comes out as §4 predicts.
- **Declared unchanged:** §1's list.
- **Invalidators:**
  - **I1 (stop before code, back to the architect):** P0 finds the installed build's PreCompact input declaring no `trigger`, or values other than `manual` and `auto`. The alternative route, a per-matcher argument in `.claude/settings.json`, needs its own amendment.
  - **I2 (stop):** an existing test needs more than T3's one-line edit.
  - **I3 (stop):** an edit to a file §1 declares unchanged, a new export, or a new option.
  - **I4 (stop):** a test needs network, a shell or a platform ignore.
  - **I5 (stop, and tell the human; brief §6):** after the merge, the hook blocks an automatic compaction, or the resume hook throws, exits non-zero, or omits the reading order.
  - **I6 (stop, to the custodian and the human):** at E1, the record's `trigger` is not `auto` for a compaction the transcript marks auto.
  - **I7 (stop):** §7's file count is exceeded.
- **Falsification:** any of the following.
  - A stale manual first call is allowed, or a non-manual call is blocked.
  - A call that reaches the decision leaves no record line, or leaves two.
  - A record failure changes the decision.
  - A resume fact prints a number when its source failed.
  - Any path exits with a code other than 0, or 2 on a manual block.

## §6. Instruments
Assertions only:
1. **P0, before code, read-only:**
   - `claude --version`;
   - the installed build's declared PreCompact hook input type: whether `trigger` is declared, and its values.

   Recorded as Amendment 1 (class 1), with paths relative to the package root and no user-profile path. If no declaration is found on the machine, that is recorded, and the piece proceeds on §0 items 1 to 3 with E1 as the proof. Nothing is installed, enabled, loaded or reloaded.
2. Decision, stderr, exit status, the `.json` and `.jsonl` contents, and stdout.
3. `git --version` and `node --version`; `claude --version` at E1.
4. `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify-mutation` and `verify:plan`, each named with the tool's commit (round 15 (c)).

## §7. Declared values and ceilings
- **Unchanged:** `FLUSH_FRESHNESS_MS` (10 minutes), `SECOND_CHANCE_WINDOW_MS` (15 minutes), `BLOCK_REASON`.
- **The record:**
  - path `.claude/state/precompact-<session_id>.jsonl`;
  - fields in this order: `at` (ISO-8601 UTC), `trigger` (as received, else `null`), `decision`, `reason`, `flushed_at` (as read, else `null`);
  - `decision` is one of `allowed-fresh`, `allowed-second-chance`, `blocked`, `recorded-only`;
  - one line per call, no rotation.
- **The stderr lines** (each states the hook's own fact, round 7):
  - `allow: automatic compaction recorded, never blocked (<reason>).`
  - `precompact-flush: could not append the record line (<message>); the decision stands.`
- **The resume line:** `Resume facts: block_age_min=<n|unknown> commits_past_tip=<n|unknown> modified_tracked_files=<n|unknown>`
- **The tip guard:** `/^[0-9a-f]{7,40}$/`. Anything else gives `commits_past_tip=unknown`, and git is not called.
- **`RESUME_GIT_TIMEOUT_MS = 2000`**, per call, module-local. Two calls plus the 500 ms stdin wait come to at most 4.5 s, under the SessionStart entry's 10 s (`.claude/settings.json` lines 50-57 at 185bd85f, sha256 HASH-TBD).
- **Size budget:** ≤ 450 changed lines, insertions plus deletions, over ≤ 5 files:
  - `scripts/hooks/precompact-flush.mjs`;
  - `scripts/hooks/session-resume.mjs`;
  - `scripts/hooks/hooks.test.mjs`;
  - `scripts/hooks/README.md`;
  - `AUTONOMY.md`.
  - **Counting command:** `git diff --numstat <base>..<head> -- . ':!scripts/hooks/COMPACTION-RECORD-AND-RESUME-LINE-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, where `<base>` is the merge base (a commit on main, named by id) and `<head>` is a named commit.
  - **Estimate:** 60, 50, 230, 40, 6.
  - An overrun is class 8, and this line is never edited to match.
- **Minutes:** the node's `budget_minutes`, 240.

## §8. Block-on-sight
1. Any path on which a non-manual call can return `block`, or read or write `lastBlockedAt`.
2. The manual path changed in any way.
3. A record append outside its own try/catch, a record carrying `custom_instructions`, or a record written on the cloud path.
4. A resume-line git call without the declared timeout, a shell, `tip` passed to git unguarded, or the resume line placed before the block.
5. `AUTONOMY.md`:
   - an edit outside §7's three bullets;
   - a line inserted or removed;
   - the quoted `reason:` span altered.
6. Any edit to `.claude/settings.json` or under `tools/mods/`; anything that installs, enables, loads or reloads a mod.
7. A new export or option, or a file outside §7's five, apart from this form and the custodian's generated set.
8. A test that reaches the network, spawns a shell, leaves its temp directory behind, is ignored on a platform, or lacks its `RECORDED MUTATION`.
9. A user-profile path in a test, comment, fixture, record or commit message.
10. A quotation in the new comments, the README text or the §7 edits.
11. A record that calls a `verify-mutation` run an observation of a mutation, or a mutation recorded without its commit in the closing record.
12. A §7 overrun not recorded as class 8, or the §7 line edited to match. Any code of a scope addition before the class 9 amendment that declares it.
13. Record form:
    - a line cite into `DECISIONS-PENDING.md`;
    - a hash reference at a branch commit;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id;
    - a bare self-line;
    - a pin read as current;
    - a correction round without its superseded index;
    - a post-result amendment whose first line does not say so.
14. A squash or rebase merge, or any force-push.

## §9. Gates
**Proportional gates, by reference:** `state/directives/2026-10-05-product-first-direction.md:15 @ 185bd85f sha256:HASH-TBD` (section 2). A gate fails on Correctness or Evidence. Documentation and record findings are fixed in this pull request before the merge, checked by the custodian against each finding, and listed in the closing record. The section's three exceptions stand.
- **Architect:**
  - the Gating heads;
  - the direction's items 2 and 4 against §2;
  - the discriminator and its evidence (§0);
  - P0's record against I1;
  - the seam and caller rule (§1);
  - round 7 on §7's texts;
  - R1 to R6;
  - the §7 edits against §2 item 5;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - M1 to M7 observed;
  - the suite run on Windows;
  - §7 recounted;
  - §8, item by item.
- **Suites, green first:** `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, plus the §6 checks. Branch CI (governance-ci, Linux) is read before gating.
- **Operator:** no rows. E1 is the custodian's record.
- **Merge:** a merge commit, the human's click. AUTONOMY §9's docs-only merge does not apply.

## §10. Amendments — opens empty, append-only
````

## 3. OPEN items

**OPEN-1: when the measure's rows are first reported.**
- **The conflict.** The context-flush direction, item 4 (`state/directives/2026-10-05-human-direction-context-flush.md:14`), starts the measure at the first automatic compaction after the merge. The later product-first direction (`state/directives/2026-10-05-product-first-direction.md:13`) reduces the 2026-10-09 window to section 6's measures and to items that block product work. Item J is neither.
- **Options:**
  - (a) Report the rows at the 2026-10-09 window, read as a measure the human named.
  - (b) Let the rows accrue in the window draft, and report them at the first window after the freeze lifts.
- **Recommendation:** (a). It costs only rows, and piece B's acceptance reads the same compactions.
- **Red line:** no.
- **What waits on it:** only the custodian's reporting. The record lines and rows accrue from the merge under either option, and no code waits.

## 4. Files I read

- `C:\dev\spatial-ide\state\directives\CONTEXT-FLUSH-2026-10-05.md`
- `C:\dev\spatial-ide\state\directives\2026-10-05-human-direction-context-flush.md`
- `C:\dev\spatial-ide\state\directives\2026-10-05-product-first-direction.md`
- `C:\dev\spatial-ide\state\directives\2026-10-05-product-first-fragments.md`
- `C:\dev\spatial-ide\state\directives\2026-10-05-product-first-clarification.md`
- `C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md`
- `C:\dev\spatial-ide\scripts\hooks\precompact-flush.mjs`
- `C:\dev\spatial-ide\scripts\hooks\session-resume.mjs`
- `C:\dev\spatial-ide\scripts\hooks\hooks.test.mjs`
- `C:\dev\spatial-ide\scripts\hooks\cloud.test.mjs` (lines 20-109)
- `C:\dev\spatial-ide\scripts\hooks\README.md`
- `C:\dev\spatial-ide\scripts\hooks\STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md` (the shape model, lines 1-288)
- `C:\dev\spatial-ide\.claude\settings.json`
- `C:\dev\spatial-ide\.gitignore` (by search)
- `C:\dev\spatial-ide\.github\workflows\governance-ci.yml` (by search)
- `C:\dev\spatial-ide\AUTONOMY.md` (§7, §21 to §22, Appendix B, §23 to §30)
- `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md`, Round 25 additions included
- `C:\dev\spatial-ide\PLAN.yaml` (lines 4100-4169)
- `C:\dev\spatial-ide\DECISIONS-PENDING.md` (lines 30-74)
- `C:\dev\spatial-ide\state\drafts\weekly-window-2026-10-09.md` (item J at lines 384-418, J refreshed at 485-496, and the reduction at 534-544)

No write-capable call was made.
