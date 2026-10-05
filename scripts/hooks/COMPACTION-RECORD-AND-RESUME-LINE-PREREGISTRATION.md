# The PreCompact hook records an automatic compaction and lets it through; a manual `/compact` is blocked once; a resume line of machine facts; AUTONOMY §7 corrected (PLAN node `compaction-record-and-resume-line`) — preregistration

**Authority:** the human's context-flush direction (RULED 2026-10-05 — the context-flush direction, cited by its block's heading; it carries no round, item or entry number), text at `state/directives/2026-10-05-human-direction-context-flush.md:6-16 @ 185bd85f sha256:0b372d88a7104f22b5c8a78fcd10e675180306af21a36cdc13dc7f489d8deb32`, items 2 and 4 referenced and not restated. It approves Fable's brief, whose piece A is `state/directives/CONTEXT-FLUSH-2026-10-05.md:30-37 @ 185bd85f sha256:4779ca5a11ca8a2a9da86350be6f8acd022a15dad732c51fac96c711f1e54322`, its measure `state/directives/CONTEXT-FLUSH-2026-10-05.md:56-62 @ 185bd85f sha256:20bd318cc93601d8dfdd938e9343cc19c927e4857e189032e91e4b217c2a8c47`, its acceptance and stops `state/directives/CONTEXT-FLUSH-2026-10-05.md:64-70 @ 185bd85f sha256:6d877db09bd19a006be919c4fb4220af56302e3cea58474a4a8008f8f89acd45`. Placement: the product-first direction, `state/directives/2026-10-05-product-first-direction.md:9 @ 185bd85f sha256:ef49f1462b27a02592df6e52251840b97e00660c14d11fb227a4b135c2105ead` and `state/directives/2026-10-05-product-first-direction.md:33 @ 185bd85f sha256:45b20d35b502e57fec2e15cf0afb34b301a551306b78ea20334173c81bf9a854`. Node: `PLAN.yaml:4118-4135 @ 185bd85f sha256:e35da97295b2c8c38aafbbf6d76c7023cad0269e3fe3be196b6e7e004241ddae`.
**Drafted by** the architect agent on the custodian's brief, alone (no lead-data read: no `engine/` or `kernel/` path), read at main 185bd85f. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Gating:** full, reviewer and architect, under three heads, each enough alone:
- **§21a, a property currently under test:** an automatic call blocks first (`scripts/hooks/hooks.test.mjs:1021-1031 @ 185bd85f sha256:eb393ccdd6af3232ef52625114b5dafb4d3a1382374afe511b6a17dd4f5d4564`). This piece reverses it.
- **§21c, size:** over the bound (§7).
- **§21c, new user-visible behaviour:** the resume line enters the model's context.

No ADR, security, wire or exposure head applies. Under round 25, item 2 (e), no five-line form is used.

## §0. Disclosure
- **Reasoned from code at 185bd85f. Nothing was run.** Relied on:
  - the header's freshness and second-chance text: `scripts/hooks/precompact-flush.mjs:15-23 @ 185bd85f sha256:ff238751b11c4144495d084d28a6b6d5f2936f03b5b0e445d0b7425e257acb7a`;
  - the declared figures: `scripts/hooks/precompact-flush.mjs:33-34 @ 185bd85f sha256:51020a8b76a9e029659a6e12dfef67b137337194808d6825cce327d02bca1328`;
  - the parser, exported, returning `{ flushedAt, tip, block }` or `null`: `scripts/hooks/precompact-flush.mjs:57-79 @ 185bd85f sha256:47c99404d4b44c84a0ad6fc59c2f4d85059ebfd04db980af8e4e2d749195e725`;
  - the tracked-only dirty filter: `scripts/hooks/precompact-flush.mjs:150-155 @ 185bd85f sha256:df36636f88aa1b1a59f34626ad73f6fdb2ba83d8558d6082e45c63a22115ff18`;
  - the record path and writer: `scripts/hooks/precompact-flush.mjs:169-184 @ 185bd85f sha256:9612ef50005b0f5a3245ccfa278a0775883375e58a99c98aa1b3ff8d83bc4b20`;
  - the decision core, which never reads `trigger` and overwrites `lastBlockedAt` on each block: `scripts/hooks/precompact-flush.mjs:186-209 @ 185bd85f sha256:9a7051e79c6096f381ed49b87b57ee6b33965169cf18d3ebba9e2abf7653db5d`;
  - the entry, exit 2 on block and 0 otherwise, fail-open on bad stdin or a throw: `scripts/hooks/precompact-flush.mjs:221-251 @ 185bd85f sha256:1e09d7a31f14504968b97d70248dc2782991c29b3438b46e5fe943497d2d819f`;
  - the cloud guard: `scripts/hooks/precompact-flush.mjs:253-256 @ 185bd85f sha256:5cd614d8c1f05628690afed4b7d20c510da9fdbd00e4d55d5707d1b44077ffc7`;
  - `buildOutput` and the SessionStart entry: `scripts/hooks/session-resume.mjs:53-101 @ 185bd85f sha256:3f1d7992617c5ac230d98dde7f1b040e96307e295ca209fd4f9db719fc84c26b`.
- **How an automatic compaction is told from a manual one, and the evidence:**
  1. **The registration.** `.claude/settings.json` lines 26-47 at 185bd85f, sha256 824cca5ff8bb98d7159b6a0492a5755b84fd5dc5278726f26ddb1e8fcd10079e, register matchers `manual` and `auto` to the same command, with no argument. The script therefore cannot know which matcher fired. The stdin `trigger` field is its only discriminator without a settings change, and this piece makes none.
  2. **The documented contract** (Appendix B, Claude Code 2.1.270, a historical pin, authoritative for what was verified then): PreCompact receives `trigger` and `custom_instructions`, with matchers `manual` and `auto` (`AUTONOMY.md:439 @ 185bd85f sha256:ff1cf376a1ae3b02af41c18c2e4f877a7b76feb0a420356bd6fd1ba9af70c008`). §7's summary of the field's two values is `AUTONOMY.md:178 @ 185bd85f sha256:ea4e732e857d1e8358f62b35e66208190ba76db5aa9615fe350a50b68d8c894d`.
  3. **The automatic matcher reaches the script.** The 2026-10-05T11:33:48Z compaction, which its transcript marks as trigger auto, followed the hook's block record of 11:30:44.895Z for that session (`state/drafts/weekly-window-2026-10-09.md:492 @ 185bd85f sha256:66fa95ffd0b8ecf84fe24d55f472b606ea3e7ee64b79df6764a18d5c3d7c0441`). This is evidence, not Authority. It shows the script runs on the automatic path. It does not show the stdin value.
  4. **P0, before code:** the installed build's declared PreCompact hook input (§6).
  5. **Live proof:** E1 (§4). The record line stores `trigger` as received.
- **Why an automatic compaction is never blocked** (the brief's grounds, approved by the direction, not re-derived here):
  - a block on a recovering compaction fails the request (`AUTONOMY.md:439 @ 185bd85f sha256:ff1cf376a1ae3b02af41c18c2e4f877a7b76feb0a420356bd6fd1ba9af70c008`);
  - whether a block's reason reaches the model on that path is undocumented (`AUTONOMY.md:455 @ 185bd85f sha256:04c666011541563d4ae1dfaa8e0185742a9e04136c6f0780d776ea99064f5ee4`).
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
  - **The resume line to the model:** SessionStart stdout (`AUTONOMY.md:443 @ 185bd85f sha256:9e3b62ac97808911ec5e61339bef8b10c1cef732fbdbcd5aecdcfed1fceb981a`).
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
   - The folder is untracked (`.gitignore` line 43 at 185bd85f, sha256 7ee35b00c0a2441c6280a013e7091cd008fd8e992db46126a1f1891f61a34b19).
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
8. **Portability** (`state/directives/PORTABILITY-2026-09-30.md:31-65 @ 185bd85f sha256:c69eed809fbffa8c0d0ee6f3a750039e2a0d6ce17e17a021cef170ef24f6699b`):
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
- **`RESUME_GIT_TIMEOUT_MS = 2000`**, per call, module-local. Two calls plus the 500 ms stdin wait come to at most 4.5 s, under the SessionStart entry's 10 s (`.claude/settings.json` lines 50-57 at 185bd85f, sha256 0c51c010f6b29ff6c6e6977abbb6ce5ea8b99716841e97f08cd563e36a5b46c1).
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
**Proportional gates, by reference:** `state/directives/2026-10-05-product-first-direction.md:15 @ 185bd85f sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751` (section 2). A gate fails on Correctness or Evidence. Documentation and record findings are fixed in this pull request before the merge, checked by the custodian against each finding, and listed in the closing record. The section's three exceptions stand.
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

### Amendment 1 — P0 (class 1)

*Written after P0's outcomes were seen, by the custodian (§6, item 1). The record is the worker's report, `state/consults/2026-10-05-compaction-record-and-resume-line-p0-report.md` (sha256 from its line 5 27c87d34013022a89ef79b52b28333b4a94ce07cb5ca6cfb454b1935add0b0e6), cited by section. No code exists. Nothing below is a quotation.*

1. **The build:** `claude --version` read 2.1.289 (the report's section 1). The installed `claude` is a native binary with no package declarations beside it.
2. **The declared PreCompact input** (the report's section 2):
   - typed at 2.1.288, in the plugin-authoring declarations, as the settings-hook stdin type: `trigger` is `manual` or `auto`, and `custom_instructions` is a string or null;
   - read at 2.1.289, in the running binary's embedded text: the same schema, matcher metadata keyed on `trigger` with the same two values, and a runner whose callers pass `auto` (reactive and precomputed paths) or `manual` (the `/compact` path).
   No SDK or package declaration was found elsewhere on the machine.
3. **I1 does not fire** (the report's section 3). No declaration contradicts §0 items 1 to 3. These are declarations, not a live stdin observation, so E1 stays the live proof.
4. **Noted, no change:** the mod API's compaction trigger type has two further values; the classic hook is not called with them in the callers read, and §2 item 1's rule (any value other than `manual` is non-manual) covers them anyway.

**Superseded index.** None.

### Amendment 2 — a correction of Amendment 1's report reference (class 3; the gate-1 architect's D-2)

*Written by the custodian after PR #181's gate-1 architect report (`state/consults/gates/2026-10-05-compaction-record-and-resume-line-gate1-architect.md`, its D-2), under the proportional-gates rule: a record fix in the piece, with no re-gate. Nothing below is a quotation.*

1. **The defect:** Amendment 1 names its report's hash by a line of that report, which the same commit adds.
2. **The corrected reference:** `state/consults/2026-10-05-compaction-record-and-resume-line-p0-report.md:5-79 @ 9c2f046469613d3f544dd2ea6516c812132d4324 sha256:27c87d34013022a89ef79b52b28333b4a94ce07cb5ca6cfb454b1935add0b0e6`.
3. **The proof:** that span, read at that commit, hashes to the value Amendment 1 states.

**Superseded index.** Amendment 1's italic note, its report reference → item 2.
