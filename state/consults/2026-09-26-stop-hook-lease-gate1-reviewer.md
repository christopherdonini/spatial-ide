*Custodian's filing note (2026-09-26): gate 1, reviewer, for the Stop-hook lease piece (branch `governance/stop-hook-lease` at `7f3a013`, local, not yet pushed), transcribed from the hand-back message with the harness's two-space indent removed. Every line cite below is into the branch at `7f3a013`, not into main. Everything below the rule is the reviewer's text.*

---

## Gate 1 (reviewer): "the Stop hook honours the custodian lease"

**Reviewed:** head `7f3a0138e9fdfc86d573dc1670c38dbca0807637` on `governance/stop-hook-lease` (worktree `C:/dev/wt/stop-hook-lease`). Range `origin/main...HEAD`, merge-base `e5235ec`. The branch is not pushed and has no PR. I edited nothing, and the tree is clean after every mutation (`git status --porcelain` is empty).

### Verdicts (AUTONOMY.md §22)
- **Correctness: PASS.** Two low findings (C1, C2) and one suggestion (C3). None blocks. Disposition: C1 can ride the E1 correction; C2 goes to the custodian as a follow-up outside this piece's Out-of-scope.
- **Evidence: FAIL (minor, blocks until corrected).** Scope is one comment, `scripts/hooks/hooks.test.mjs:83-85` (E1). Disposition: a class-3 fix to that comment, then a scoped re-read. I reproduced the form's own three mutations, and each makes its named test fail.
- **Documentation: PASS.** Three nits (D1–D3). Disposition: optional, they can ride the same round.

### Blocking
**E1: the recorded mutation for the relinquished test is false.** The comment at `scripts/hooks/hooks.test.mjs:83-85` says that flipping `match[1] !== sessionId` to `===` makes `stop-queue: allows when this session's lease is relinquished` fail. It cannot:
- A `relinquished:` line never matches the regex at `scripts/hooks/stop-queue.mjs:151`, so the function returns at `:152` before the id comparison runs.
- I applied that exact mutation and the relinquished test still passed (✔). The only tests that failed were "holds no lease" and "blocks as before…".
- The form's wording ("a `relinquished:` line read as held") is correct. I applied it as `if (!match) return { held: true };` at `:152`, and the relinquished test failed (✖).
- Only the in-code record is wrong. As written it also duplicates the mutation recorded at `:122-124`.
- `verify-test-claims` does not see this, because it checks test names, not mutations.
- Fix: rewrite `:83-85` to name the `:152` mutation.

### Findings

**C1 (low): the code is stricter than the form.** The form's Change, README step 3 (`scripts/hooks/README.md:59-62`), AUTONOMY §24 (`AUTONOMY.md:474`) and the doc comment (`stop-queue.mjs:139-141`) all say "an active `lease: <id> ...` line". The regex at `stop-queue.mjs:151` also requires the literal ` refreshed:` after the id. So `lease: <id>` and `lease: <id> 2026-…Z` both **allow where the form says block**.
- This fails toward allowing the stop, and the only lease shape AI_DEVELOPMENT.md ("The lease and handover") shows carries `refreshed:`.
- Fix either side: relax the regex to `/^lease:\s*(\S+)/`, or name `refreshed:` in the three texts.
- "Active" is also undefined. A stale lease of this session's own still blocks, because freshness is not checked. That is consistent with the directive, but worth one word in the text.

**C2 (medium, non-blocking, custodian/architect to rule): nothing binds the lease id to Claude Code's stdin `session_id`.**
- AI_DEVELOPMENT.md ("The lease and handover") requires only "a unique session id", and the form's Out-of-scope keeps that rule unchanged.
- Evidence the two have diverged in practice: `state/CUT-STATE.md:332-333` on main records that the lease was taken by "81107ddf" at 19:06Z. The live `C:/dev/spatial-ide/CUSTODIAN-LEASE` now holds `a2e86f25-b924-4e6f-b34d-277157b55f70` (refreshed 19:18:36Z), which matches the local transcript `a2e86f25-….jsonl`. No local transcript for 81107ddf exists.
- Under this piece, a custodian that writes any id other than the stdin `session_id` gets an allow on every stop. The allow reason goes only to stderr, which the hook README says lands in the debug log, so the hook's continuation is disabled without anything visible in the transcript.
- The tests write `lease: ${input.session_id}`. That matches the current live practice, so I do not call it an imagined interface, but the producer side is not pinned.
- Disposition: a follow-up that states "lease id = the Stop hook's stdin `session_id`" in the lease rule (outside this piece).

**C3 (suggestion): the dedupe test lost incidental coverage.** At `hooks.test.mjs:276-295` the second `decide` now reuses `input`, i.e. the same `session_id`. Before, `baseStopInput()` drew a fresh random id (`:48`). The test still checks what its name says, but a dedupe key that included the session would now survive it. The HALT path notifies for any session, so that property still matters. Fix: write a second held lease and call with a second id.

**Authority placement (low, informational).**
- The form's Authority is `state/directives/2026-09-26-corpus-positions-and-stop-hook.md` §2, item (4). It is absent from this branch's tree. It is tracked on main at `6e743ed` (committed 19:24:59Z); the form `ac7fad7` was committed 19:19:51Z.
- The cited §2 and item (4) resolve at `6e743ed`, and the quoted "Tooling fix, light lane" matches line 14 of that file byte for byte.
- It resolves on merge. The ~5-minute window at `ac7fad7` is historical.

**Amendment 1 (nit).**
- My recount of `git diff --numstat origin/main...HEAD`, the form excluded, gives 139 insertions + 21 deletions = **160 lines across 5 files**, the same as at `a513190`.
- §21c's exempt set also excludes the obliged AUTONOMY.md sentence (4 lines), which makes it 156 lines across 4 files. That is still over 150, so the conclusion holds. The amendment matches its own Scope, which counted AUTONOMY.md, but "under §21c's rule" is slightly off.
- The reason sentence checks out: exactly eight existing tests in `hooks.test.mjs` now write a held lease (at `:69, :139, :223, :243, :261, :276, :297, :313`), plus the local half of `cloud.test.mjs:68-69`.

**Documentation nits.**
- **D1:** the README's "Decision order" header (`scripts/hooks/README.md:48`) still reads "§3, with §18's HALT switch as step 2" and does not mention §24's insertion, unlike `stop-queue.mjs:11-12`.
- **D2:** the comment at `hooks.test.mjs:155` says "if this reached step 3 it would still allow (missing plan)". Step 3 is now the lease check, and the missing plan is step 4. This line is not in the diff but the renumbering made it stale.
- **D3:** the reason at `stop-queue.mjs:152` says "relinquished or malformed" and also covers an empty file.

### Check results
1. **Form.**
   - Out-of-scope is true. The diff touches no ADR, wire or security text. AI_DEVELOPMENT.md, `.claude/settings.json` and PLAN.yaml are unchanged. The other steps, caps and reason texts in `stop-queue.mjs` are unchanged apart from step-number comments.
   - Scope: the diff touches the 5 named files plus the form.
   - Change: the step sits after HALT (`:230-245`) and before the plan load (`:253`) at `:247-251`, matching the form apart from C1.
   - Tests+mutation: the three named tests exist at `:86, :103, :125`.
2. **Edge inputs, run through `decide()`.**
   - Block: BOM plus a lease line (`trim()` strips U+FEFF); CRLF; leading whitespace; tab separators; a stale lease of this session's own.
   - Allow: a leading blank line (the first line is empty); an empty file; an uppercase `Lease:`; `relinquished:` then `lease:` (only the first line is read); an id with a trailing extra character (`sid-1x`); UTF-16LE; a missing or empty `session_id`; a numeric `session_id`; `CUSTODIAN-LEASE` being a directory (EISDIR is read as absent); the no-`refreshed:` shapes from C1.
   - Never-throws: read errors are caught inside `leaseHeldBy`, and `main()` wraps `decide` (`:344-350`).
3. **Tests.** `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`: 314 tests, 314 pass, 0 fail.
4. **Mutations** (each reverted with `git checkout`):
   - **(a)** `match[1] !== sessionId` → `===`: "relinquished" passed; "holds no lease" and "blocks as before" failed. The own-lease record at `:122` holds; the relinquished record at `:83` is false (E1).
   - **(b)** the absent-file catch → `{ held: true }`: "holds no lease" failed, as recorded.
   - **(c)** the form's wording, `!match` → `{ held: true }`: "relinquished" failed.
5. **Dry run** of the real CLI. `CLAUDE_PROJECT_DIR` was a scratchpad directory outside the repo holding `two-nodes.yaml` as `PLAN.yaml`; `CUSTODIAN_STOP_HOOK`, `CLAUDE_CODE_REMOTE` and `CUSTODIAN_PLAN_PATH` were unset; `session_id` was `dryrun-session-1`.

   | Case | Exit | stdout | stderr |
   |---|---|---|---|
   | Relinquished | 0 | empty | `allow: CUSTODIAN-LEASE holds no active lease line (relinquished or malformed) -- not this session's turn to hold the queue.` |
   | No file | 0 | empty | `allow: CUSTODIAN-LEASE absent (or unreadable) -- not this session's turn to hold the queue.` |
   | This session's lease | 0 | `{"decision":"block","reason":"next: two-nodes-ready — A ready node with no dependencies and no human need (lane shell, budget 30 min). Regenerate CUSTODIAN-QUEUE.md if PLAN.yaml changed; ledger before ending."}` | empty |
   | Another session's lease (extra case) | 0 | empty | `allow: CUSTODIAN-LEASE holds another session's lease -- not this session's turn to hold the queue.` |

6. **Existing tests.** No assertion line was removed; the only `-` lines in the test diff are `decide(baseStopInput()…)` call sites. Each of the eight still asserts its named reason. Tests for the steps before the lease check (background_tasks, env override, HALT) still assert their specific stderr text, so they still tell their own step apart from the new lease allow. The one narrowing is C3.
7. **README and AUTONOMY.**
   - README steps 3–7 match the code at this head, apart from C1 and D1.
   - `git grep -n "scripts/hooks/README.md:"` returns no hits on the branch or on `origin/main`, and no tracked file cites a Stop-hook step number.
   - §24 is appended after §23. §3 is unedited: the only `-` line in the AUTONOMY.md diff is the file header.
8. **Suites** (all exit 0): `verify.mjs`; `verify-cites.mjs` (48 loose advisories, all outside this diff); `verify-quotes.mjs` (109 checked, 0 errors); `verify-test-claims.mjs` (256 claims); `queue.mjs --check`; `site.mjs --check`.
   - **LF:** all six touched files show `i/lf w/lf` with 0 CR bytes, both in the worktree and at HEAD.

Relevant files:
- `C:/dev/wt/stop-hook-lease/scripts/hooks/stop-queue.mjs`
- `C:/dev/wt/stop-hook-lease/scripts/hooks/hooks.test.mjs`
- `C:/dev/wt/stop-hook-lease/scripts/hooks/cloud.test.mjs`
- `C:/dev/wt/stop-hook-lease/scripts/hooks/README.md`
- `C:/dev/wt/stop-hook-lease/AUTONOMY.md`
- `C:/dev/wt/stop-hook-lease/scripts/hooks/STOP-HOOK-LEASE-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/directives/2026-09-26-corpus-positions-and-stop-hook.md`
- `C:/dev/spatial-ide/AI_DEVELOPMENT.md` ("The lease and handover")
