# The Stop hook refuses to end a turn while the SESSION-CONTINUITY block is stale (PLAN node `stop-hook-stale-continuity`, weekly window E) — preregistration

**Authority:** question round 33, items 4 and 5 (RULED 2026-10-02 — question round 33), cited by round and item and not reproduced. The binding words are item 4's option label and item 5's. The shape item 4 adopted is the custodian's proposal, `state/drafts/weekly-window-2026-10-02.md:145-192` @ e04fdf7 sha256:8f5923983b3025347836f4827fb531396819ae0da1a7b9848f143a19b9be3369, and is not the human's words. Its origin is the 2026-09-29 flush directive: item 5 at `state/directives/2026-09-29-flush-mirror-and-milestone-refresh.md:23-24` @ e04fdf7 sha256:8bbf60af4116071d05c6017bdbe69894fb4a38e157ab41fbe4a0e39c2442b5ac and item 6(b) at `state/directives/2026-09-29-flush-mirror-and-milestone-refresh.md:29-31` @ e04fdf7 sha256:ae6cd7bec10792fb49642e242773e41d5a353d655d09790efe90b5ad74777b7c. Item 5's doc half is `AUTONOMY.md:484-490` @ e04fdf7 sha256:9969ce745b30165aefc9b3950c3edccdffe3605d1de6323cf32af37a95dce69d (§26), and this piece carries its tooling half. Node: `PLAN.yaml:3467-3483` @ e04fdf7 sha256:dd03cd01ead00eee33e69a80220519fdfe7c6d29e447044f3b17eb7f777fdf3e.
**Drafted by** the architect agent on the custodian's brief, read at `main` e04fdf7 (the consult: `state/consults/2026-10-02-stop-hook-stale-continuity-architect-draft.md`). Shape model: `scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md`. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Custodian's edits to the draft, before commit:** (1) every span hash, computed at e04fdf7 (the architect had no Bash), each pin written in the repository's pin grammar; (2) the three dot-prefixed pins (`.claude/settings.json`, `.gitattributes`, `.gitignore`) written in words, because verify-quotes' grammar does not read a dot-prefixed path; (3) the ledger's size at e04fdf7 filled in (§0); (4) §0's accounting-and-block span extended from line 304 to line 320, so that it includes the block's return; (5) the consult's path in the line above; (6) this line. Nothing else changed. On the consult's open points: (1) the narrower reading of the adopted shape's failed-push sentence is taken, as §1's may-not-claim states (a committed but unpushed flush reads fresh, and the push check stays with the PreCompact backstop); it is disclosed in the PR body and to the human; (2) default history simplification is kept (T10, T11); (3) PLAN's node takes this form as its gate and 180 minutes as its budget, in the same commit; (5) the HALT probe's cost on background-task stops is accepted; (6) E2 is the custodian's ledger commit made anyway; (7) the worker is dispatched only after #154 merges, since both pieces edit `scripts/hooks/stop-queue.mjs` and `scripts/hooks/README.md`; (8) the `flush.mjs` CRLF finding is routed as the proposed node `flush-crlf-field-rewrite`.
**Gating:** full, reviewer and architect, under two heads, each enough on its own:
- **§21a, a property currently under test.** The piece changes the Stop hook's decision order (`AUTONOMY.md:86-93` @ e04fdf7 sha256:5f5759507be8cd7793547bab8f98968163c7c1a02f734742f5627634bedb80d4). That order is under test. The background-tasks allow precedes everything (`scripts/hooks/hooks.test.mjs:154-162` @ e04fdf7 sha256:49f1e4a95fe62444d5456f79ae10aada3fa147e8ae7e5505cd142132b733d06c), and the caps end the turn (`scripts/hooks/hooks.test.mjs:224-260` @ e04fdf7 sha256:65e5f51cf2645b75d98b4b689b2bc4c8fd8335b5025358b0a1b809fcdce3e0ea). Moving the background allow behind a new blocking step changes the stop behaviour of the custodian's loop.
- **§21c size:** over the bound (§7).

No ADR, security, wire or exposure head applies. Under round 25, item 2 (e), no five-line form is used.

## §0. Disclosure
- **Reasoned from code at e04fdf7. Nothing was run.** These parts of the code are relied on:
  - the current order and its header: `scripts/hooks/stop-queue.mjs:11-34` @ e04fdf7 sha256:a6dc705555da812716f504f6461e48c0cef485312b4ecd17e0330ac48e2afcfa;
  - the caps: `scripts/hooks/stop-queue.mjs:46-47` @ e04fdf7 sha256:17811d183928d9bb33ebd1f0cf338fe959baea2310324d4a0617d05418540144;
  - `tryGit`, which already takes an options spread: `scripts/hooks/stop-queue.mjs:66-72` @ e04fdf7 sha256:cf67545ef999419543c10677c171320adc686de2b846963007a215d377641596;
  - the background allow: `scripts/hooks/stop-queue.mjs:222-225` @ e04fdf7 sha256:4b11a9677cd8eb1ead205c765fb57e54bde002925239f9d52dbfb8075942c14e;
  - the accounting and the block: `scripts/hooks/stop-queue.mjs:273-320` @ e04fdf7 sha256:86baa46c849ed0079fde1b44d67a6b7348501c7aaebd1ddd5ed8eb914d597be3.
- **The parser.** `parseSessionContinuity` is already exported. It splits on `\r\n|\r|\n` and trims the value, and it returns `{ flushedAt, tip, block }` or `null` (`scripts/hooks/precompact-flush.mjs:57-79` @ e04fdf7 sha256:47c99404d4b44c84a0ad6fc59c2f4d85059ebfd04db980af8e4e2d749195e725). The module's CLI entry is guarded, so importing it runs nothing.
- **The fail-open precedent.** Each of these treats an unreadable input as no grounds to block:
  - the lease reader takes a read error as absent (`scripts/hooks/stop-queue.mjs:143-155` @ e04fdf7 sha256:86e76df1e5e4cf014d98ea00866ccd9c680d8fb2eca7b879018da5e470024b21);
  - a HALT fetch failure is "unknown", not halt (`scripts/hooks/stop-queue.mjs:126-127` @ e04fdf7 sha256:31edcd2dd26fe49a3a99f2a2329ac971ac5ee028774f0ee2338c18871b0914e2);
  - PreCompact skips an unreadable last ledger change (`scripts/hooks/precompact-flush.mjs:112-117` @ e04fdf7 sha256:eff3a63d4a61dc9fc3bde09d48117b71a8ed3684ea9844ff0a1b6f83e5c7b0ff);
  - the hook never throws to the shell (`scripts/hooks/stop-queue.mjs:33-34` @ e04fdf7 sha256:0a7e417f0d715becb0c144beb4cd5fb69cdcd603266adfcf66325a5bfadb7dd7).
- **The flush writer** stamps `flushed_at` with the current second (`scripts/hooks/flush.mjs:193-195` @ e04fdf7 sha256:2b22d0560a8abb5806410bc43b0c8d9d7eeb27bce090422dde3c291f97e9767c). Its field list is pinned by `scripts/hooks/flush.test.mjs:50-61` @ e04fdf7 sha256:7b530068f01cb5dee9d2abd43216dad8a9c4153609e76daeed8e7109fe48eec5. Neither changes.
- **Appendix B is a historical pin** (Claude Code 2.1.270, fetched 2026-09-13), authoritative for what was verified then. E2 tests the running version. The pins:
  - the Stop `reason` reaches Claude (`AUTONOMY.md:435` @ e04fdf7 sha256:809d55de8d3e96c968a7252d60af11748ea699338696a24a11a3a43021856498);
  - Claude never sees stderr on exit 0 (`AUTONOMY.md:429` @ e04fdf7 sha256:b4f42e8096011370c00fcaa43f3574f9903688d942246a0052c963ee4554168b);
  - the warning against blocking on a condition that will never resolve, and the 8-block override (`AUTONOMY.md:433` @ e04fdf7 sha256:dd93baa4b17223cc547452379bdf65c40518fe61c837e0ed5de65719d2c7d3a7).
- **The ledger's size** at e04fdf7 is 264937 bytes. `execFileSync`'s default `maxBuffer` is 1 MiB. A ledger blob larger than that throws, and a fail-open reader would then silently never judge. §7 declares the buffer.
- **The Stop entry's timeout** is 20 s (`.claude/settings.json` lines 8-9 at e04fdf7, sha256 eb7187e639d35aec41e31cda25104f01e1b650cea31ed00e0d60c7eda1492849).
- **The line-ending policy** is `* text=auto eol=lf` (`.gitattributes` line 5 at e04fdf7, sha256 d60f352d0db1404c70afb4bb8b2ca3fd1c610572aa40720e8a0b7baa7885418c). `CUSTODIAN-LEASE` is untracked (`.gitignore` line 38 at e04fdf7, sha256 b3b1e8633a3d1d723e632ac54011175793aad117cfbd23429c8d842a2baabcd2).
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
  - `READING_ORDER`'s header line, so `scripts/hooks/cloud.test.mjs:87-98` @ e04fdf7 sha256:1d31feeeb6551f72d2af53c972843e1306ceb3cbf8642124e8810dac90fa7804 and its recorded mutation stay true;
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
11. **Portability** (`state/directives/PORTABILITY-2026-09-30.md:31-65` @ e04fdf7 sha256:c69eed809fbffa8c0d0ee6f3a750039e2a0d6ce17e17a021cef170ef24f6699b):
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

### Amendment 1 — budget overrun, §7 not edited; invalidator I1 and its resolution (classes 8 and 1)

budget overrun, §7 not edited. Written after the results were seen (a post-result amendment), before either gate. References only.

1. **Class 8.**
   - **Declared:** §7 declares at most 650 changed lines over at most 5 files.
   - **Final,** by §7's own counting command at 78681ec, merge base fe1e6b7: 703 lines over the same 5 files.
     - `AUTONOMY.md` 9
     - `scripts/hooks/README.md` 66
     - `scripts/hooks/hooks.test.mjs` 435
     - `scripts/hooks/session-resume.mjs` 5
     - `scripts/hooks/stop-queue.mjs` 188
   - **Reason:**
     - the continuation accounting moved into one routine that the queue block and the stale block share, about 60 lines;
     - T1 to T17's fixture repositories;
     - the 17 RECORDED MUTATION comments.
   - §7 is not edited, and no test or comment was trimmed to fit.
2. **Class 1, I1 fired before the first code commit.**
   - The failing test was `the_settings_command_mirrors_a_recorded_askuserquestion_payload`. Its fixed copy list is at `scripts/hooks/questions-mirror.test.mjs:307` @ 629d969 sha256:6ac977f4bdd0c3d43af18ebaa955e3391902e4b563f5d35654fb3dedfad33d13.
   - The architect's ruling is `state/consults/gates/2026-10-02-stop-hook-stale-continuity-i1-architect-ruling.md`. The worker's report is `state/consults/2026-10-02-stop-hook-stale-continuity-worker-report-1.md`.
   - The fix is PLAN node `questions-mirror-t11-copy-glob`, PR #159, merge commit ec74652, placed by question round 36, item 1.
   - At the merged head 78681ec the scripts suite runs 406 tests, 406 pass. I5 did not fire, because `questions-mirror.test.mjs` is not in this piece's diff.
3. **The section number.** §2 item 10's appended `AUTONOMY.md` section is §30, after main's §29. The merge commit 4b1f641 set it, and nothing above it changed.
4. **Generation.** The node's generation bumps to 2 (`AUTONOMY.md` §15).
5. **Superseded index.** None. §7 and §5 stand as registered; this amendment records the results.

### Amendment 2 — correction round 1: T18 and T19, and the §7 figure (classes 4, 8 and 1)

budget overrun, §7 not edited. Written after gate 1's results were seen (a post-result amendment). References only.

1. **The round.** Branch commit 7383018 answers gate 1:
   - the architect's S2-1 (`state/consults/gates/2026-10-02-stop-hook-stale-continuity-gate1-architect.md`);
   - the reviewer's S2-1, S2-4, N1 and N2 (`state/consults/gates/2026-10-02-stop-hook-stale-continuity-gate1-reviewer.md`).
2. **Class 4, two tests with their mutations, for §7's two not-judged causes that had no test:**
   - **T18** `stop-queue: a ledger commit whose block has no flushed_at is not judged`. Its scenario: c1 commits a block with no `flushed_at:` line, and the step reports the queue reason plus §7's stderr line naming `no flushed_at in the block at` c1. **M18:** a `null` F_c read as stale.
   - **T19** `stop-queue: a ledger commit that removes the ledger is not judged`. Its scenario: c1 removes `state/CUT-STATE.md`, and the step reports the queue reason plus §7's stderr line naming `state/CUT-STATE.md unreadable at` c1. **M19:** a `null` blob read as stale.
   - M18 and M19 were each observed at 2542233 with the change, by name. Each test's RECORDED MUTATION comment records it.
   - The suite at 7383018 runs 408 tests, 408 pass.
3. **Comments only:**
   - `CONTINUITY_GIT_MAX_BUFFER`'s comment states the guard against growth (I6);
   - the timeout comment counts four calls on the stale path;
   - the README's decision-order intro is reworded.

   No product line changes, and §7 is not edited.
4. **Class 8, the figure.** By §7's own command at 7383018, merge base fe1e6b7, the count is 734 lines over the same 5 files: `AUTONOMY.md` 9, `scripts/hooks/README.md` 66, `scripts/hooks/hooks.test.mjs` 466, `scripts/hooks/session-resume.mjs` 5 and `scripts/hooks/stop-queue.mjs` 188. The declared ceiling is 650. The reason is Amendment 1 item 1's, plus T18 and T19.
5. **Generation.** The node's generation bumps to 3 (`AUTONOMY.md` §15).
6. **Superseded index.** Amendment 1 item 1's final figure (703 at 78681ec) is superseded by item 4's (734 at 7383018). Nothing else is superseded.

### Amendment 3 — the closing record (class 1, references only)

Written after the piece's results were seen and after its merge (a post-result amendment). References and hashes only, except item 5's reason, which §4's E2 asks for as received.

1. **Merged.** PR #161 merged on 2026-10-03 at 05:32:38Z as merge commit 56264a6, at head b42c0dc. So 4b1f641, 2542233, 7383018 and b42c0dc stay reachable from main (§8 item 14).
2. **§7's final figure.** By §7's own command at b42c0dc, merge base fe1e6b7, the figure is 734 lines over 5 files, as Amendment 2 item 4 records. The `AUTONOMY.md` section's final number is §30 (Amendment 1 item 3): main gained no section before the merge.
3. **Mutations.**
   - **M1 to M17** were observed at 4b1f641 with the change (`state/consults/2026-10-02-stop-hook-stale-continuity-worker-report-2.md`). The gate-1 reviewer re-observed them at 2542233 (`state/consults/gates/2026-10-02-stop-hook-stale-continuity-gate1-reviewer.md`, check 2).
   - **M18 and M19** were observed by the gate-2 reviewer at b42c0dc (`state/consults/gates/2026-10-02-stop-hook-stale-continuity-gate2-reviewer.md`, check 2). All 19 observations are unit-only (`node --test`), with no harness run.
4. **Tools,** each at its last change: verify-cites 522e448, verify-quotes f9444a4, verify-test-claims e9735d4, verify-mutation 7d24ed1, verify:plan 2607202. The runs are read in the two gate-2 reports. A verify-mutation run is a tool run, not an observation.
5. **E2, the live record** (§4):
   - **Versions:** Claude Code 2.1.288, `git version 2.49.0.windows.1`, Node v24.18.1.
   - **The entry-only commit:** 1130bee, a ledger entry with no flush.
   - **The stop was blocked.** The reason as the model received it, byte-copied from the session transcript:

     ```
     stale SESSION-CONTINUITY: the newest commit touching state/CUT-STATE.md is 1130beea86157931a9687e594c6e1c2e78b2c5a1 (2026-10-03T07:35:15+02:00), and it does not rewrite the block's flushed_at (2026-10-02T22:28:32Z). Rewrite the block with scripts/hooks/flush.mjs from git and the ledger, commit it ledger-only, push, then stop.
     ```
   - **The flush that followed:** 29d43f2, ledger-only, written by `scripts/hooks/flush.mjs`.
   - **The next stop's outcome:** the queue block naming `port-1-linux-l1`, not a stale block.

   As §4 predicts, the stop was blocked with §7's reason and one ledger-only flush cleared it. I4 did not fire.
6. **A disclosure** (the gate-1 reviewer's S2-4, widened by the gate-2 architect's item 4.6). Any failure of the third git call (the `<c>^1:` show), not only a timeout, reads as fresh with no stderr line. It fails open inside §2 item 2(c), and §8 item 4 is not engaged.
7. **The failed-push reading** is §1's may-not-claim, already disclosed. It is not restated here.
8. **Superseded index.**
   - §7's timing sentence, `scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md:219` @ ca0abb5 sha256:d628ad9f33940e8b485ec4c822427fd0910d2a8d8dae9487f2f30a456f7a3e12 (three calls, 11 s), is superseded by the `CONTINUITY_GIT_TIMEOUT_MS` comment in `scripts/hooks/stop-queue.mjs` at 56264a6 (four calls, 13 s). §7 is not edited, and the declared 2000 ms holds.
   - Amendment 2 item 2's observation commit for M18 and M19, `scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md:334` @ 56264a6 sha256:50af71f3f0bd85d088e7236bf461c325c2f7156c0e16f42226c90debda6b12ad, is superseded by item 3 above. The tests did not exist at 2542233.
   - Nothing else is superseded.
