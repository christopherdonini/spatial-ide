# Worker report 1 — stop-hook-stale-continuity (2026-10-02)

*Custodian's filing note: the worker's hand-back on the brief for PLAN node `stop-hook-stale-continuity` (form `scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md`, committed ca0abb5), recorded verbatim below with the harness's report indentation removed. The worker stopped on invalidators I1 and I5 before its first code commit, as the form directs; the route is put to the form's drafting architect. No rooted `path:line` cite needed de-rooting; nothing in the text is changed.*

*The custodian's checks:*
- *worktree `C:/dev/wt/stop-hook-stale` on `cut/stop-hook-stale-continuity`: f778f61 (test-only) is local and unpushed; four files are modified and uncommitted; nothing is untracked;*
- *`scripts/hooks/questions-mirror.test.mjs`'s fixed copy list and `scripts/hooks/questions-mirror.mjs`'s import of `stop-queue.mjs` both came with PR #154 (merge commit 629d969).*

*Profile paths redacted at filing: none.*

---

STOPPED on I1 (and it also trips I5). The implementation is written and uncommitted, and nothing has been pushed. I need a ruling before I go on.

**The invalidator**
- The change makes `stop-queue.mjs` import `parseSessionContinuity` from `./precompact-flush.mjs`. §1's seam and §2 item 2 require that import.
- `questions-mirror.mjs:31` imports `leaseHeldBy` from `./stop-queue.mjs`.
- `scripts/hooks/questions-mirror.test.mjs:307` hand-copies a fixed list of scripts into a temp project (`hooks/questions-mirror.mjs`, `telegram.mjs`, `cloud.mjs`, `stop-queue.mjs`, `plan/plan.mjs`, `plan/yamlSubset.mjs`).
- `precompact-flush.mjs` is not in that list, so the shipped hook command inside the test exits 1. Test `the_settings_command_mirrors_a_recorded_askuserquestion_payload` fails (status 1, expected 0).
- Production is unaffected, because the real command runs from the full project root. Only the test's copy list is stale.
- Diagnostic: I added `'hooks/precompact-flush.mjs'` to that list, ran `questions-mirror.test.mjs` (17 of 17 passed), then restored the file with `git checkout`. I did not commit that edit.
- I1 fires because an existing test needs more than §2 item 6's change. I5 fires because the fix is a sixth file, `scripts/hooks/questions-mirror.test.mjs`, beyond §7's five.

**Options for you, not decided by me**
- **(a)** Amend the form (class 9, scope addition declared before code) to allow that one-token edit and a sixth file. This is what I would pick.
- **(b)** Import `parseSessionContinuity` lazily inside the continuity step. That dodges the test's copy list, so I treat it as a workaround, and it fights §1's seam. I did not do it.
- **(c)** Duplicate the parser inside `stop-queue.mjs`. That contradicts §1's "existing export" seam. I did not do it.

**State left, worktree `C:/dev/wt/stop-hook-stale`, branch `cut/stop-hook-stale-continuity`**
- Commit `f778f61` (test-only, signed off, not pushed): the helpers, T1–T17, and §2 item 6's `writeHeldLease` plus the corrected step comment in the existing background-tasks test.
- Uncommitted, because the suite is red:
  - `scripts/hooks/stop-queue.mjs`: decision order is override and HALT, lease, continuity, background allow, plan, shared accounting.
  - `scripts/hooks/session-resume.mjs`: `READING_ORDER` only, with a new line 4.
  - `scripts/hooks/README.md`.
  - `AUTONOMY.md`: §29 appended at the end, heading naming §28. Number it again when the branch merges main.
- `git status --porcelain` shows ` M` for those four files and nothing untracked. The profile-path scan was clean.

**Test-only commit `f778f61`**
- `hooks.test.mjs` runs 56 tests: 12 fail and 44 pass.
- Failing before the fix: T1, T4, T7, T8, T9, T10, T11, T13, T14, T15, T16, T17. Each fails at the intended assertion after its setup ran (the stale reason, the not-judged stderr line, the reading-order line).
- Passing before the fix: T2, T3, T5, T6, T12, plus the existing background test.
  - T2, T3, T5, T6 and T12 guard the fresh and allow side, so test-first cannot fail them. Their discrimination comes from M2, M3, M5, M6 and M12.
  - T7's first phase, one below the cap, does fail before the fix.

**With the implementation applied**
- `hooks.test.mjs`: 56 of 56 pass.
- Full suite `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` (exit 1): 406 tests, 405 pass, 1 fail (the questions-mirror test above).

**Not done**
- M1–M17 are not observed and there are no `// RECORDED MUTATION:` comments yet.
- None of these ran: the verify-* scripts, `verify-mutation`, `verify.mjs`, `queue.mjs --check`, `site.mjs --check`.
- Nothing is pushed.

**§7 count**
- Base `629d969` against the working tree (test commit plus uncommitted files), by §7's own command: 633 changed lines over 5 files.
  - `AUTONOMY.md` 9
  - `README.md` 66
  - `hooks.test.mjs` 365
  - `session-resume.mjs` 5
  - `stop-queue.mjs` 188
- 17 mutation comments will add roughly 60–70 lines, so the piece will probably overrun 650. That would be class 8, with §7's line left unedited. `stop-queue.mjs` is well over the 100-line estimate: the shared accounting routine moved about 60 lines, and the predicate is about 30.

**I6**
- The ledger blob at merge base `629d969` is 268859 bytes. `CONTINUITY_GIT_MAX_BUFFER` is 67108864. That is under the limit, so I6 does not fire.

**Deviations and judgment calls, all inside the form's intent**
- T7 has an extra first phase: consecutive at cap minus 1 still blocks with the stale reason. The form's two cap phases are kept.
- T8 has an extra last step: a new entry-only commit after the queue block resets the count and writes the stored plan hash back unchanged.
- T9 (S4a) sets `GIT_CEILING_DIRECTORIES` in try/finally so no enclosing repository is discovered.
- The fixture writes `* -text` to `.git/info/attributes`, so no attributes file at any level can rewrite the CRLF blob.
- `accountContinuation` takes a `gitOpts` argument. The stale path passes the 2 s timeout and the 64 MiB buffer to its `rev-parse HEAD`, per §8 item 1. The queue path passes none, so its behaviour is unchanged.
- The header comment's order block is rewritten with no quotation; its first paragraph is untouched.

**Off-scope noticed, not done**
- The form's test list does not cover two of the three not-judged causes: `state/CUT-STATE.md unreadable at <%H>` and `no flushed_at in the block at <%H>`. Only `git log failed` is tested (S4a). The code for the other two exists. Covering them would need a fixture beyond §3 and its own mutation.
- The §1 and §2 item 11 assumption that existing temp-dir tests are not repositories holds in the suite as it stands, apart from the questions-mirror copy list above.

**Reporting items**
- No user-profile path anywhere in the code, tests, comments or commit message.
- Observed model: Sonnet 5.5, no override, no context handoff.
- The commit trailer I used is `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Pre-gate self-check on cross-module code: the only seam is `parseSessionContinuity`, called with its real signature. The seam test is T16, through the shipped CLI.
- No new `pub` item or export. `DAILY_CONTINUATION_CAP` and `SESSION_CONSECUTIVE_CAP` were already exported.

After your ruling, a fresh dispatch can commit the implementation, observe M1–M17 with their commits, add the mutation comments, run the §6 and verify tools, and push. I can also do that myself if you rule on (a).
