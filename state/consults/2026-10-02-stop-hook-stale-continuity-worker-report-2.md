# Worker report 2 — stop-hook-stale-continuity (2026-10-02)

*Custodian's filing note: the worker's hand-back after PR #159 merged, recorded verbatim below with the harness's report indentation removed. In it the worker merges main, renumbers its `AUTONOMY.md` section, observes M1 to M17 and pushes. No rooted `path:line` cite needed de-rooting; nothing in the text is changed.*

*The custodian's checks:*
- *branch `cut/stop-hook-stale-continuity` at 78681ec, read from origin; the commits are f778f61, 8c96695, merge 4b1f641 (main fe1e6b7) and 78681ec; the worktree is clean;*
- *§7's count recomputed by the custodian: 703 lines over 5 files at 78681ec;*
- *the class 8 record and I1's resolution are the form's Amendment 1, branch commit 2542233.*

*Profile paths redacted at filing: none.*

---

`stop-hook-stale-continuity` is finished and pushed to `origin/cut/stop-hook-stale-continuity` (head `78681ec`), with no PR opened. The full suite is green at 406 of 406, M1–M17 are all observed, and every check exits 0. §7's count is 703 changed lines, over the 650 ceiling (class 8).

**Commits (merge-base `fe1e6b7`, which is main)**
- `f778f61`: the T1–T17 tests (test-only).
- `8c96695`: the implementation, with the README and §29.
- `4b1f641`: the signed-off merge of origin/main (`fe1e6b7`).
- `78681ec`: the 17 `// RECORDED MUTATION:` comments. It is a signed-off, comments-only change to `hooks.test.mjs`.

**Conflict resolution**
- Only `AUTONOMY.md` conflicted, and nothing else needed hand resolution.
- I took main's file unchanged and appended one blank line, then my section renumbered §30. Its heading's after-clause names §29.
- `git diff origin/main -- AUTONOMY.md` shows only additions: `@@ -517,3 +517,12 @@`, 9 lines added. These are a blank line, the `## §30. The Stop hook refuses to stop on a stale SESSION-CONTINUITY block (the human, 2026-10-02, round 33, items 4 and 5; appended after §29 so that no line a record cites above it moves)` heading, a blank line, the intro paragraph, and four bullets. The bullets are §3's decision order, continuity, §7, and §26's tooling half with its proof test name. No hunk touches main's §29.

**Suite**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` exited 0 at `4b1f641` and again with the comments.
- Counts: 406 tests, 406 pass, 0 fail, 0 cancelled, 0 skipped.
- questions-mirror T11 is green.

**Mutations M1–M17**
- Each was applied to a clean tree at merge commit `4b1f641` with the change, the named test was run alone, it failed by name, and the edit was reverted. The harness checked each time that exactly 1 test ran and that it was the target. The comments are in `78681ec` and say "Observed at merge commit 4b1f641 with this change."
- All are in `hooks.test.mjs`. Each failing line is the first failing assertion; where the reason is a queue reason, the assertion is the reason equality.

| # | Mutation | Failing line | First failing assertion |
|---|---|---|---|
| M1 | `===` changed to `!==` | 454 | reason: queue reason where the stale reason is expected |
| M2 | `stale: true` | 462 | reason does not match `/^next: two-nodes-ready/` (stale text returned) |
| M3 | fresh only if just the block changed | 470 | same regex failure |
| M4 | background allow moved first | 476 | decision `'allow'`, expected `'block'` |
| M5 | continuity before the override | 485 | `'block'`, expected `'allow'` (override case) |
| M6 | continuity before the lease check | 500 | `'block'`, expected `'allow'` (absent lease) |
| M7 | cap result ignored in the stale branch | 523 | `'block'`, expected `'allow'` (session-cap phase) |
| M8 | no state written on the stale path | 546 | "a stale block records its continuation" (actual false) |
| M9 | null `git log` read as stale | 585 | regex failure on S4a: stale text returned |
| M10 | parent read at `^2` | 612 | reason: queue reason where the stale reason is expected |
| M11 | `--first-parent` added | 628 | same reason equality |
| M12 | missing parent copy read as stale | 635 | regex failure |
| M13 | block read from the working tree | 643 | reason equality |
| M14 | raw `\n` split keeping `\r` | 652 | reason equality |
| M15 | `maxBuffer` dropped | 661 | reason equality |
| M16 | continuity step removed from decide | 675 | CLI reason equality |
| M17 | directives line after PRECEDENTS | 998 | "directly after DECISIONS-PENDING.md" (actual 5, expected 4) |

(Lines 454 and later are at `4b1f641`, before the comments shifted them.)

**Check exit codes, all at head `78681ec` unless noted**
- scripts suite: 0, at the staged state before the comments commit.
- `verify-cites`: 0.
- `verify-quotes`: 0.
- `verify-test-claims`: 0.
- `verify-mutation --base origin/main --head HEAD`: 0, "all 17 new test(s) have a recorded mutation naming them". This is a check that a mutation is recorded, not an observation.
- `timeout 570 node scripts/plan/verify.mjs`: 0.
- `queue.mjs --check`: 0.
- `site.mjs --check`: 0.
- `profile-path-scan --staged`: clean (rc 0) before each of the three commits.

**§7 count**
- Base `fe1e6b7`, head `78681ec`, by the form's own command: **703** changed lines over 5 files, which is over the 650 ceiling (class 8 for you to record; I trimmed nothing).
  - `AUTONOMY.md` 9
  - `README.md` 66
  - `hooks.test.mjs` 435
  - `session-resume.mjs` 5
  - `stop-queue.mjs` 188
- `questions-mirror.test.mjs` is not in the diff.

**I6**
- The ledger blob at the merge base, `fe1e6b7:state/CUT-STATE.md`, is 279891 bytes. `CONTINUITY_GIT_MAX_BUFFER` is 67108864. It is under the buffer, so I6 does not fire.

**Deviations**
- The ones in my earlier report still stand.
- The `RECORDED MUTATION` comments carry the full test name, including the `stop-queue: ` prefix, wrapped without breaking the name. The tool matches on it.
- The merge commit message is my own wording and is signed off with the usual trailers.
- The stale-path observation base is the merge commit itself, because the implementation was already in `4b1f641`.

**Off-scope**
- The two untested not-judged causes from my earlier report remain untested.
- `git status --porcelain` is empty.

Observed model: Sonnet 5.5, no override.
