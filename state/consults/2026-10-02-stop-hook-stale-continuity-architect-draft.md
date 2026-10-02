# Consult — the architect's draft for stop-hook-stale-continuity (2026-10-02)

*Custodian's filing note: one hand-back from the architect agent on the custodian's brief (a drafting consult, not a gate), read at main e04fdf7, recorded verbatim below with the harness's report indentation removed. The harness prefixed the hand-back with a note that it matched an instruction-shaped pattern (settings-json), because the draft pins `.claude/settings.json`'s Stop entry as evidence and declares the file unchanged. That is evidence, not an instruction to the custodian. The harness note is not part of the agent's text and is not reproduced. The draft is kept here whole. It is committed as `scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md`, whose header lists the custodian's edits and the custodian's answers to the open points below.*

*Profile paths redacted at filing: none.*

---

Drafting consult (not a gate, so no verdict), reviewed at main @ e04fdf7

The draft form is below. It goes to `scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md`. Every hash is left as `sha256:<custodian>`, and every pin is at e04fdf7, which is on main. The form contains no reproduced text and no blockquote. Two passages copy a doc's words: the `READING_ORDER` line and the appended section. Both are code or doc text, and §2 items 8 and 10 mark them as drafted, not quoted.

````markdown
# The Stop hook refuses to end a turn while the SESSION-CONTINUITY block is stale (PLAN node `stop-hook-stale-continuity`, weekly window E) — preregistration

**Authority:** question round 33, items 4 and 5 (RULED 2026-10-02 — question round 33), cited by round and item and not reproduced. The binding words are item 4's option label and item 5's. The shape item 4 adopted is the custodian's proposal, `state/drafts/weekly-window-2026-10-02.md:145-192 @ e04fdf7 sha256:<custodian>`, and is not the human's words. Its origin is the 2026-09-29 flush directive: item 5 at `state/directives/2026-09-29-flush-mirror-and-milestone-refresh.md:23-24 @ e04fdf7 sha256:<custodian>` and item 6(b) at `state/directives/2026-09-29-flush-mirror-and-milestone-refresh.md:29-31 @ e04fdf7 sha256:<custodian>`. Item 5's doc half is `AUTONOMY.md:484-490 @ e04fdf7 sha256:<custodian>` (§26), and this piece carries its tooling half. Node: `PLAN.yaml:3467-3483 @ e04fdf7 sha256:<custodian>`.
**Drafted by** the architect agent on the custodian's brief, read at `main` e04fdf7. Shape model: `scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md`. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Gating:** full, reviewer and architect, under two heads, each enough on its own:
- **§21a, a property currently under test.** The piece changes the Stop hook's decision order (`AUTONOMY.md:86-93 @ e04fdf7 sha256:<custodian>`). That order is under test. The background-tasks allow precedes everything (`scripts/hooks/hooks.test.mjs:154-162 @ e04fdf7 sha256:<custodian>`), and the caps end the turn (`scripts/hooks/hooks.test.mjs:224-260 @ e04fdf7 sha256:<custodian>`). Moving the background allow behind a new blocking step changes the stop behaviour of the custodian's loop.
- **§21c size:** over the bound (§7).

No ADR, security, wire or exposure head applies. Under round 25, item 2 (e), no five-line form is used.

## §0. Disclosure
- **Reasoned from code at e04fdf7. Nothing was run.** These parts of the code are relied on:
  - the current order and its header: `scripts/hooks/stop-queue.mjs:11-34 @ e04fdf7 sha256:<custodian>`;
  - the caps: `scripts/hooks/stop-queue.mjs:46-47 @ e04fdf7 sha256:<custodian>`;
  - `tryGit`, which already takes an options spread: `scripts/hooks/stop-queue.mjs:66-72 @ e04fdf7 sha256:<custodian>`;
  - the background allow: `scripts/hooks/stop-queue.mjs:222-225 @ e04fdf7 sha256:<custodian>`;
  - the accounting and the block: `scripts/hooks/stop-queue.mjs:273-304 @ e04fdf7 sha256:<custodian>`.
- **The parser.** `parseSessionContinuity` is already exported. It splits on `\r\n|\r|\n` and trims the value, and it returns `{ flushedAt, tip, block }` or `null` (`scripts/hooks/precompact-flush.mjs:57-79 @ e04fdf7 sha256:<custodian>`). The module's CLI entry is guarded, so importing it runs nothing.
- **The fail-open precedent.** Each of these treats an unreadable input as no grounds to block:
  - the lease reader takes a read error as absent (`scripts/hooks/stop-queue.mjs:143-155 @ e04fdf7 sha256:<custodian>`);
  - a HALT fetch failure is "unknown", not halt (`scripts/hooks/stop-queue.mjs:126-127 @ e04fdf7 sha256:<custodian>`);
  - PreCompact skips an unreadable last ledger change (`scripts/hooks/precompact-flush.mjs:112-117 @ e04fdf7 sha256:<custodian>`);
  - the hook never throws to the shell (`scripts/hooks/stop-queue.mjs:33-34 @ e04fdf7 sha256:<custodian>`).
- **The flush writer** stamps `flushed_at` with the current second (`scripts/hooks/flush.mjs:193-195 @ e04fdf7 sha256:<custodian>`). Its field list is pinned by `scripts/hooks/flush.test.mjs:50-61 @ e04fdf7 sha256:<custodian>`. Neither changes.
- **Appendix B is a historical pin** (Claude Code 2.1.270, fetched 2026-09-13), authoritative for what was verified then. E2 tests the running version. The pins:
  - the Stop `reason` reaches Claude (`AUTONOMY.md:435 @ e04fdf7 sha256:<custodian>`);
  - Claude never sees stderr on exit 0 (`AUTONOMY.md:429 @ e04fdf7 sha256:<custodian>`);
  - the warning against blocking on a condition that will never resolve, and the 8-block override (`AUTONOMY.md:433 @ e04fdf7 sha256:<custodian>`).
- **The ledger's size** at e04fdf7 is `<custodian: git cat-file -s e04fdf7:state/CUT-STATE.md>` bytes. `execFileSync`'s default `maxBuffer` is 1 MiB. A ledger blob larger than that throws, and a fail-open reader would then silently never judge. §7 declares the buffer.
- **The Stop entry's timeout** is 20 s (`.claude/settings.json:8-9 @ e04fdf7 sha256:<custodian>`).
- **The line-ending policy** is `* text=auto eol=lf` (`.gitattributes:5 @ e04fdf7 sha256:<custodian>`). `CUSTODIAN-LEASE` is untracked (`.gitignore:38 @ e04fdf7 sha256:<custodian>`).
- **Concurrent pieces on the same files.** #154 (`cut/round-mirror-hook`) exports `leaseHeldBy` in `stop-queue.mjs` and edits `scripts/hooks/README.md`. #156, #154 and #157's round 35 note 2 each append an `AUTONOMY.md` section. This piece's section number is therefore not fixed here (§2 item 10).
- **Fixture drive:** nothing is measured.

## §1. May and may not claim
- **May claim:**
  1. In the lease session, a stop is blocked when the newest commit on `HEAD` that touches `state/CUT-STATE.md` leaves the block's `flushed_at` value as its first parent had it. This holds with `background_tasks` non-empty too (T1, T4, T16).
  2. A flush-only commit, or an entry and a flush in one commit, reads fresh (T2, T3).
  3. The override, HALT and a non-holder session still allow first (T5, T6).
  4. Stale blocks count inside the existing session and daily caps, with `HEAD` as their progress signal, and either cap ends the turn (T7, T8).
  5. When git cannot be read, the step is skipped (fail open) (T9).
  6. Merges, a root commit, an uncommitted flush, a CRLF blob and a ledger over 1 MiB are each judged as §2 item 2 declares (T10 to T15).
  7. `READING_ORDER` names `state/directives/` after `DECISIONS-PENDING.md` and before `PRECEDENTS.md`, discharging §26's tooling half (T17).
- **May not claim:**
  - **That the flush was pushed.** The predicate reads the local `HEAD`. A committed but unpushed flush reads fresh. Push stays with the PreCompact backstop's `@{u}` check.
  - **A shallow clone, live.** Its boundary commit has no readable first parent, so T12's path applies. This is reasoned and not run.
  - **A lease holder whose project root is a worktree on another branch.** The predicate reads that worktree's `HEAD`, and nothing is claimed for it.
  - **A project root that is not the repository's top level.**
  - **Live delivery of the reason before E2.**
  - **Any latency figure** and any `docs/08` row.
  - **macOS:** no run (R5).
- **Unchanged:**
  - `precompact-flush.mjs` (the PreCompact backstop), `flush.mjs`, `flush.test.mjs`, `cloud.test.mjs` and `.claude/settings.json`;
  - the caps' values, the queue block's reason text, and the near-cap reordering;
  - HALT's probe and its cache, and the lease reader;
  - `READING_ORDER`'s header line, so `scripts/hooks/cloud.test.mjs:87-98 @ e04fdf7 sha256:<custodian>` and its recorded mutation stay true;
  - `session-resume.mjs` outside `READING_ORDER`;
  - the stdin fields read: `session_id`, `cwd`, `background_tasks`.

  ADR-006 does not apply, since this is repository tooling. No ADR is cited or amended.
- **Seams:**
  - **stop-queue to `parseSessionContinuity`:** the existing export, called with its real signature.
  - **stop-queue to git:** real git in every test, argument arrays, no shell.
  - **stop-queue to Claude Code's Stop contract:** pinned in §0. E2 is the live proof.
  - **`READING_ORDER` to the SessionStart output:** existing.
  - **No new export.** The new constants are module-local, and every new test goes through `decide` or the shipped CLI.

## §2. The change
1. **`scripts/hooks/stop-queue.mjs`, the decision order:**
   1. the override, then HALT → allow. Unchanged.
   2. the lease check (§24) → allow unless held. Unchanged.
   3. **continuity** (items 2 and 3) → stale: block, or allow at a cap.
   4. `background_tasks` non-empty → allow. Formerly step 1, with its text unchanged.
   5. to 8. The ready set, the human-blocked allow, the accounting and the queue block. The behaviour is unchanged.

   The header comment is rewritten to this order and quotes nothing.
2. **The predicate.** Every git call goes through `tryGit` with `cwd` set to the project root, `{ timeout: CONTINUITY_GIT_TIMEOUT_MS, maxBuffer: CONTINUITY_GIT_MAX_BUFFER }`, and literal `/` paths, never `path.join`.
   - (a) `git log -1 --format=%H%x09%cI HEAD -- state/CUT-STATE.md`. This uses default history simplification, with no `--first-parent`. A merge is output only when it differs from every parent; otherwise the walk follows the parent it matches.
     - Empty output: no ledger commit, so the block is not stale. No stderr.
     - `null` output: not judged.
   - (b) `git show <c>:state/CUT-STATE.md`, then `parseSessionContinuity`, giving `F_c`. A `null` blob or a `null` `F_c` means not judged.
   - (c) `git show <c>^1:state/CUT-STATE.md`, then `parseSessionContinuity`, giving `F_p`. Several cases mean c introduced the line, so the block is fresh:
     - there is no first parent (a root commit or a shallow boundary);
     - there is no file there;
     - there is no block there;
     - `F_p` is `null`.
   - (d) **Stale iff `F_c === F_p`.** Steps (b) and (c) are c's diff against its first parent, restricted to the block's `flushed_at` value. A flush that writes the same value reads as no rewrite.
   - Not judged means one §7 stderr line, and the step passes. That is fail open, on §0's precedent. Failing closed would block on a condition the model cannot clear while git is unreadable, against `AUTONOMY.md:433`'s warning, and would only spend the caps. The working tree is never read.
3. **Stale, the accounting.** One accounting routine is shared with step 7, with the same session and daily files.
   - Progress for the stale step is a `HEAD` change since the last recorded block. It writes the stored `lastPlanHash` back unchanged.
   - At either cap → allow, with the existing cap stderr lines.
   - Otherwise both files are written as the queue block writes them, and the hook returns `block` with §7's reason.
   - The stale block takes no near-cap suffix. Its count does feed later queue blocks' near-cap test.
   - The plan is not read on this path.
4. **The queue path:** the same behaviour as at e04fdf7. Only the accounting moves into the shared routine.
5. **The HALT probe** now also runs on background-task stops: at most 5 s, cached 60 s.
6. **`scripts/hooks/hooks.test.mjs`:**
   - the helpers;
   - T1 to T17 (§4);
   - the existing test `stop-queue: allows on non-empty background_tasks, before even reading the plan` gains `writeHeldLease`, and its step-number comment is corrected. Its name and assertions are unchanged.
7. **The PreCompact hook** is untouched, and stays the backstop.
8. **`scripts/hooks/session-resume.mjs`:** `READING_ORDER` only.
   - A new line 4 is added: `4. state/directives/ — the human's instructions, recorded verbatim, newest first.` It carries §26's step, with the words of `AUTONOMY.md:488` minus the backticks, as the existing lines mirror §0.
   - The old 4 and 5 become 5 and 6.
   - The header line is byte-unchanged.
9. **`scripts/hooks/README.md`:** the Stop decision order and the SessionStart reading order are updated. The README quotes nothing new.
10. **`AUTONOMY.md`:** one dated section, appended at the end. Its number is the next free number at the time of the merge, re-checked when the branch merges main, and the closing record names it. §3, §7, §24 and §26 are not edited in place. The section's text is drafted below as the worker writes it; it is not a quotation of any source:
    - Heading: `§<n>. The Stop hook refuses to stop on a stale SESSION-CONTINUITY block (the human, 2026-10-02, round 33, items 4 and 5; appended after §<n-1> so that no line a record cites above it moves)`.
    - From the merge of PLAN node `stop-hook-stale-continuity`'s piece, §3's decision order is:
      1. the override or the halt switch (§18);
      2. the lease check (§24);
      3. continuity;
      4. `background_tasks`;
      5. onward, §3's steps 3 to 6 as before.
    - Continuity: the block is stale when the newest commit on `HEAD` that touches `state/CUT-STATE.md` leaves the block's `flushed_at` as its first parent had it. A stale block blocks the stop inside §3's continuation caps, with `HEAD` as its progress signal. Its reason names that commit, its time and the block's `flushed_at`, and the step: rewrite the block with `scripts/hooks/flush.mjs` from git and the ledger, commit it ledger-only, push, then stop. When git cannot be read, the step is skipped.
    - §7: the milestone refresh of the 2026-09-29 flush directive, item 5 (`state/directives/2026-09-29-flush-mirror-and-milestone-refresh.md`), is a ledger-only commit with no `chore(site): health refresh` before it. §7's health-refresh-first bullet holds for handoffs and the pre-compaction flush. The PreCompact hook is unchanged and remains the backstop.
    - §26's tooling half is done: `READING_ORDER` carries the step. Proof: T17's name.
    - The governing form: `scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md`.
11. **Portability** (`state/directives/PORTABILITY-2026-09-30.md:31-65 @ e04fdf7 sha256:<custodian>`):
    - **R1:** one predicate on every platform. The blobs are read from git, LF by `.gitattributes`. A CRLF blob is normalised by the parser (T14). Test repos set `core.autocrlf false`, so that Git for Windows' system setting cannot rewrite a fixture.
    - **R2:** no OS-conditional code.
    - **R3:**
      - Windows is supported and tested locally.
      - Linux is supported and tested in governance-ci.
      - macOS: no run and no claim.
      - The hook needs `git` on `PATH`, as HALT and the accounting already do. A missing git is a fail-open not-judged case.
    - **R4:**
      - git pathspecs and `rev:path` are written as literals with `/`;
      - temp directories come from `os.tmpdir()`, removed with `t.after`;
      - the CLI test spawns `process.execPath`;
      - no test spawns a shell, and no drive letter appears;
      - branch names are read and never assumed (`init.defaultBranch` varies).
    - **R5:** L1 only.
    - **R6:** no platform ignore.

## §3. Fixtures and predicted outcomes
- **Each repository** is a fresh `os.tmpdir()` git repository with local user config and `core.autocrlf false`. Commit c0 holds `state/CUT-STATE.md`: a block with `flushed_at: 2026-10-01T00:00:00Z` (A), then `## Ledger` and one entry.
- **The lease** is held by writing `CUSTODIAN-LEASE`, untracked.
- **The plan:** `CUSTODIAN_PLAN_PATH` points at `two-nodes.yaml`.
- **"Queue reason"** below means `^next: two-nodes-ready`.

| # | History | Predicted |
|---|---|---|
| S1 | c0, then c1 entry-only | stale: block, reason per §7 naming c1's `%H`, its `%cI`, and A |
| S2 | S1, then c2 flush-only (B) | fresh: queue reason |
| S3 | c0, then c1 entry plus flush (B) | fresh: queue reason |
| S4a | a non-repository directory holding `state/CUT-STATE.md` | queue reason; stderr has the not-judged line (`git log failed`) |
| S4b | a repository whose only commit lacks `state/CUT-STATE.md` | queue reason; no not-judged line |
| S5 | c0; side: s1 entry-only; main: m1 flush-only (B); `merge --no-ff` side gives M, which differs from both parents | stale (M against m1: B equals B) |
| S6 | c0; side: s1 flush (B), then s2 entry-only; main: m1 README-only; merge gives M, matching s2 | stale (c = s2; B equals B) |
| S7 | c0 only, a root commit | fresh: queue reason |
| S8 | S1, plus the working-tree block rewritten to B, uncommitted | stale |
| S9 | c0 (LF), then c1: the whole file CRLF plus an entry, `flushed_at` A | stale |
| S10 | c0 with the ledger padded to 2 MiB, then c1 entry-only | stale |
| S11 | S1 through the shipped CLI (`CLAUDE_PROJECT_DIR` set to the repository) | exit 0; stdout JSON `decision: block` with §7's reason |

## §4. Tests, one mutation each (`scripts/hooks/hooks.test.mjs`)
- **No timing assertion and no network.**
- **How a mutation is observed:** apply it, run the named test, record the first failing assertion in the test's `// RECORDED MUTATION:` comment, then revert. The closing record names the commit each mutation was observed at. A `verify-mutation` run is not an observation.

| # | Test | Scenario | Mutation |
|---|---|---|---|
| T1 | `stop-queue: blocks on a stale continuity block after an entry-only ledger commit` | S1 | M1: the comparison inverted (`!==`) |
| T2 | `stop-queue: a flush-only ledger commit reads fresh` | S2 | M2: the `flushed_at` comparison removed, so any ledger commit reads stale |
| T3 | `stop-queue: an entry and a flush in one ledger commit read fresh` | S3 | M3: fresh requires a commit that changes only the block |
| T4 | `stop-queue: the continuity check runs before the background-tasks allow` | S1 with `background_tasks` non-empty | M4: the background allow moved back to first |
| T5 | `stop-queue: the override and HALT still allow over a stale block` | S1 with `CUSTODIAN_STOP_HOOK=off`; then S1 with an untracked local `state/CUSTODIAN-HALT` | M5: the continuity step moved ahead of step 1 |
| T6 | `stop-queue: a session without the lease allows over a stale block` | S1 with no lease; then S1 with another session's lease | M6: the continuity step moved ahead of the lease check |
| T7 | `stop-queue: the caps end the turn on a stale block` | S1 with consecutive 6; then S1 with daily 40 | M7: the stale branch blocks without reading the caps |
| T8 | `stop-queue: a stale block counts as a continuation and a new HEAD resets the count` | S1 run twice (consecutive 2, daily 2); then a flush-only commit (queue reason, consecutive 1, daily 3) | M8: the stale branch writes no accounting state |
| T9 | `stop-queue: the continuity check fails open when git cannot read the ledger history` | S4a, S4b | M9: a `null` log result read as stale |
| T10 | `stop-queue: a merge is judged against its first parent` | S5 | M10: the parent copy read at `<c>^2` |
| T11 | `stop-queue: a merge that takes the side's ledger is judged at the side's newest ledger commit` | S6 | M11: `--first-parent` added to the walk |
| T12 | `stop-queue: a ledger commit with no first-parent copy reads fresh` | S7 | M12: a missing parent copy read as stale |
| T13 | `stop-queue: an uncommitted flush does not clear a stale block` | S8 | M13: the block read from the working tree |
| T14 | `stop-queue: a CRLF ledger blob with an unchanged flushed_at reads stale` | S9 | M14: `flushed_at` read by a raw `\n` split, keeping the `\r` |
| T15 | `stop-queue: a ledger over 1 MiB is still judged` | S10 | M15: the `maxBuffer` option dropped |
| T16 | `stop-queue CLI: a stale ledger blocks with the continuity reason through the shipped entry` | S11 | M16: the continuity step removed from `decide` |
| T17 | `session-resume: the reading order names state/directives/ after DECISIONS-PENDING.md and before PRECEDENTS.md (AUTONOMY.md §26)` | `READING_ORDER`'s lines, by content and adjacency | M17: the line placed after `PRECEDENTS.md` |

- **E1:** T16, in the suite on Windows and in governance-ci. It proves that the entry, git and the reason compose. It does not prove delivery to the model.
- **E2 (live, after the merge):** in the lease session, the custodian makes one entry-only ledger commit on main for a real entry, then ends the turn. The custodian records it as a class 1 row on main, with:
  - `claude --version`;
  - the commit;
  - that the stop was blocked;
  - the reason as the model received it;
  - the flush commit that followed;
  - the next stop's outcome.

  Predicted: blocked with §7's reason, and one ledger-only flush clears it. No force-push and no probe branch are used.

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:**
  - T1 to T17 pass at the fix, and each fails under its own mutation;
  - every existing test in `scripts/hooks/` and `scripts/plan/` passes, with only §2 item 6's setup change. The existing temp-dir tests are not repositories, so they reach the old steps through fail open;
  - E2 comes out as §4 predicts.
- **Declared unchanged:** §1's list.
- **Invalidators:**
  - **I1 (stop):** an existing test needs more than §2 item 6's change.
  - **I2 (stop):** the change needs an edit to any file §1 declares unchanged, or a new export.
  - **I3 (stop):** a test needs network access, a timing assertion, a shell or a platform ignore.
  - **I4 (stop, to the custodian; the hand obligation in §7 governs until it is resolved):** at E2 the model does not receive the reason.
  - **I5 (stop):** §7's file count is exceeded.
  - **I6 (stop):** the ledger blob at the merge base exceeds `CONTINUITY_GIT_MAX_BUFFER`.
- **Falsification:** any of the following.
  - A stale fixture reads fresh, or a fresh one reads stale.
  - The override, HALT or a non-holder blocks.
  - A stale block is issued past a cap.
  - An allow writes stdout, or any path exits non-zero.

## §6. Instruments
Assertions only:
1. Decision, reason, stderr, and the state files' contents.
2. `git --version` and `node --version`, plus `claude --version` at E2.
3. `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify-mutation` and `verify:plan`, each named with the tool's commit (round 15 (c)).

## §7. Declared values and ceilings
- **`CONTINUITY_GIT_TIMEOUT_MS = 2000`**, per call, module-local. Three calls plus HALT's 5 s fetch total 11 s at worst, under the Stop entry's 20 s.
- **`CONTINUITY_GIT_MAX_BUFFER = 64 * 1024 * 1024`**, module-local. It bounds the ledger blob read.
- **The pathspec:** `state/CUT-STATE.md`.
- **The reason:** `stale SESSION-CONTINUITY: the newest commit touching state/CUT-STATE.md is <%H> (<%cI>), and it does not rewrite the block's flushed_at (<F_c>). Rewrite the block with scripts/hooks/flush.mjs from git and the ledger, commit it ledger-only, push, then stop.`
- **The stderr line:** `stop-queue: continuity not judged (<cause>); the stop continues to the next step.` The cause is one of:
  - `git log failed`;
  - `state/CUT-STATE.md unreadable at <%H>`;
  - `no flushed_at in the block at <%H>`.

  The line states the hook's own fact and its own consequence (round 7).
- **The caps:** 6 and 40, unchanged.
- **Size budget:** ≤ 650 changed lines, insertions plus deletions, over ≤ 5 files:
  - `scripts/hooks/stop-queue.mjs`;
  - `scripts/hooks/hooks.test.mjs`;
  - `scripts/hooks/session-resume.mjs`;
  - `scripts/hooks/README.md`;
  - `AUTONOMY.md`.
  - Counting command: `git diff --numstat <base>..<head> -- . ':!scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`. `<base>` is the branch's merge base, a commit on main named by id, and `<head>` is a named commit.
  - An overrun is class 8, and this line is never edited to match.
  - Estimate: 100 lines in stop-queue, 420 in tests, 4 in session-resume, 30 in the README, 20 in AUTONOMY.md.
- **Minutes:** the node's `budget_minutes` (§10's check).

## §8. Block-on-sight
1. Any of the following on the continuity path:
   - a read of the working-tree ledger;
   - `--first-parent` in the walk;
   - a parent other than `^1`;
   - a git call without the declared timeout and `maxBuffer`;
   - a shell, or `path.join` in a git path.
2. A stale block outside the shared accounting, or any change to the queue path's behaviour.
3. The continuity step placed anywhere but after the lease check and before the background allow.
4. Fail-closed on any not-judged case.
5. Any change named in §5 I2, a new export, or an edit to `READING_ORDER`'s header.
6. A test that:
   - reaches the network;
   - asserts timing;
   - leaves its temp directory behind;
   - is ignored on a platform;
   - lacks its `RECORDED MUTATION`.
7. A user-profile path in a test, comment, fixture or commit message.
8. `AUTONOMY.md` edited anywhere but the appended section, or a section number fixed before the merge.
9. A quotation in the new comments, the README text or the appended section.
10. A file outside §7's five, apart from this form and the custodian's generated set.
11. A record that calls a `verify-mutation` run an observation, or a mutation recorded without its commit in the closing record.
12. A §7 overrun not recorded as class 8, or §7 edited. Any code of a scope addition before its class 9 amendment.
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
- **Architect:**
  - the Gating line's heads;
  - round 33, items 4 and 5, against §2;
  - the predicate and each edge case (§2 item 2), with the fail-open reading against §0's precedent;
  - the seam and caller rule (§1);
  - round 7 on §7's texts;
  - R1 to R6;
  - the appended section against §2 item 10;
  - §8, item by item.
- **Reviewer:**
  - the full diff;
  - M1 to M17 observed;
  - the suite run on Windows;
  - §7 recounted;
  - I6 checked at the merge base.
- **Suites, green before either gate:**
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` on Windows, and governance-ci on ubuntu-latest;
  - §6 item 3's tools;
  - branch CI read before gating.
- **Operator:** none. E2 is the custodian's record of a ledger commit made anyway.

## §10. Amendments (opens empty, append-only; classes 1 to 9; each correction round ends with a superseded index)
````

## Things the custodian or the human must decide

1. **Item 4's failed-push sentence.** The adopted draft says that a flush which cannot land, meaning a failed push, runs into the caps (`state/drafts/weekly-window-2026-10-02.md:171`). That is not true under the predicate it also adopted, which reads the local `HEAD`: a flush that is committed but not pushed reads fresh.
   - The form takes the narrower reading. Item 4's sentence means a flush that cannot be committed, and the push check stays with PreCompact (§1, "may not claim").
   - Adding the push check would change the predicate, so that would need the human. Disclosing the reading in the PR body adds no mechanism.
   - Custodian's call: disclose it, or ask in the next round.
2. **How the newest ledger commit is found** (custodian's call, or flag it for the human). The form uses git's default history simplification, not `--first-parent`, and compares against the first parent `^1`.
   - Why: with `--first-parent`, a merge whose side branch flushed and then added an entry-only commit reads fresh, which is wrong.
   - T10 and T11 hold both choices.
3. **Budget minutes.** The node carries 120. With 17 tests, 180 is more realistic. Set it in the same commit as the form, as was done for round-mirror.
4. **Before computing the hashes:**
   - fill in the ledger's size at e04fdf7 (§0);
   - confirm that `state/drafts/weekly-window-2026-10-02.md` is tracked at e04fdf7.
5. **A new cost.** The HALT fetch (at most 5 s, cached 60 s) now also runs on background-task stops. Accept it or not.
6. **E2's setup.** E2 needs one deliberate entry-only ledger commit on main, followed by ending the turn. It is not a red line and involves no force-push, but confirm the setup.
7. **Merge order with the open pieces:**
   - #154 also edits `stop-queue.mjs` and the README;
   - #156, #154 and #157's note 2 each append an `AUTONOMY.md` section.

   Whichever lands later merges main first. This piece's section number is set at its own merge and named in the closing record.
8. **One finding on code this piece does not change.** `flush.mjs` splits on `\n` and rewrites a field line without its `\r`. A CRLF working-tree ledger would end up with mixed line endings. This is out of scope; route it as a node if wanted.

Sources read, all in `C:\dev\spatial-ide`:
- `PLAN.yaml`, `DECISIONS-PENDING.md` and `AUTONOMY.md`
- `docs\PREREGISTRATION-TEMPLATE.md`
- `state\drafts\weekly-window-2026-10-02.md`
- `state\directives\2026-09-29-flush-mirror-and-milestone-refresh.md` and `state\directives\PORTABILITY-2026-09-30.md`
- `state\CUT-STATE.md`, `.claude\settings.json`, `.gitattributes` and `.gitignore`
- in `scripts\hooks\`: `stop-queue.mjs`, `precompact-flush.mjs`, `flush.mjs`, `flush.test.mjs`, `session-resume.mjs`, `hooks.test.mjs`, `cloud.test.mjs`, `README.md`, `STOP-HOOK-LEASE-PREREGISTRATION.md` and `ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md`
