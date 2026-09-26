*Custodian's filing note (2026-09-26): gate attempt 2, reviewer (scoped), for the Stop-hook lease piece (branch `governance/stop-hook-lease` at `74b5fe2`, local, not yet pushed), transcribed from the hand-back message with the harness's two-space indent removed. Every line cite below is into the branch, not into main. One redaction: the dry run's `CLAUDE_PROJECT_DIR`, a scratchpad path under the Windows Users root, is replaced by a description. Two rooted path-and-line cites into lines that exist only on the branch are written as a path and a line number, so that main's verify-cites resolves. Everything below the rule is otherwise the reviewer's text.*

---

## Gate 2 (reviewer, scoped): "the Stop hook honours the custodian lease"

**Head reviewed:** `74b5fe2b16aa6f25db0d22c2e6edc50b3c6d033f` on `governance/stop-hook-lease` (worktree `C:/dev/wt/stop-hook-lease`).
- Correction range: `7f3a013..74b5fe2`, 4 commits. Piece range: `origin/main...HEAD`, merge-base `e5235ec`, `origin/main` = `c63458d`.
- Main has not touched `AUTONOMY.md` or `scripts/hooks/` since the base, and `git merge-tree` reports a clean merge.
- I edited and committed nothing. `git status --porcelain` was empty after every mutation. Two temporary files (an old-revision copy of `stop-queue.mjs` and of the test file, used for comparison runs) were deleted, and the tree is clean.

**Carry-forward check (§22):** the correction changes source code: `stop-queue.mjs:151-152`, the regex and the reason text. That reopens Correctness for `leaseHeldBy` and Evidence for the three mutations. I re-ran both. Everything else in `stop-queue.mjs` is untouched, so the gate-1 findings on the other steps carry forward.

### Verdicts
- **Correctness: PASS.**
  - Two low observations (C-a, C-b), neither blocking.
  - Gate-1 C2 carries forward unchanged: nothing binds the lease id to stdin `session_id`. It sits outside this piece and is the custodian's follow-up.
- **Evidence: PASS.**
  - E1 is resolved.
  - All three recorded mutations reproduce.
  - The C3 restoration is proven by a mutation.
  - One low suggestion (E-s1): no test covers the relaxed regex. It does not block.
- **Documentation: FAIL, low, non-blocking under §22** (Documentation-only).
  - Scope: one clause, the final sentence of Amendment 2 (D-1).
  - Disposition: fix it with one appended row of at most two sentences, or leave it to the architect's reduction under the record cap, since a fix would be this piece's second correction round.
  - Every other docs row passes.

### Findings

**D-1 (low): "Both are still over 150" is false for the §21c basis** (the form (`scripts/hooks/STOP-HOOK-LEASE-PREREGISTRATION.md`), line 15, last sentence).
- At Amendment 1's measurement revision `a513190`, the §21c basis is 144 lines, which is within the bound: `cloud.test.mjs` 2+0, `hooks.test.mjs` 85+8, `stop-queue.mjs` 40+9. It is the same at `7f3a013`.
- It reaches 153 only at `6bbe7b6`, because the correction's own test lines add 9 in `hooks.test.mjs` (85+8 becomes 92+10).
- "Still" holds only for the Scope-line basis, which went from 160 to 177.
- So the gate-1 architect's possibility ("under §21c the count is at or below 150, in which case no overrun happened") was true at Amendment 1's revision, and Amendment 2 does not say so.
- The conclusion itself is right: both gates are required now, because 153 > 150.
- Corrected reference: §21c basis 144 at `a513190`, 153 at `6bbe7b6`.

**C-a (low, informational): the new regex changes direction on four shapes.** From my edge matrix, run through `decide()` with `7f3a013` against `74b5fe2`:
- `lease: <id>` (bare), `lease: <id> <ISO timestamp>` and `lease: <id> <free text>` now block where they used to allow. This agrees with the Change line's "`lease: <id> ...`" and is the fix C1 asked for.
- `lease: <id> relinquished` now blocks. That agrees with the Change line's literal shape. It is not a documented relinquish shape: AI_DEVELOPMENT.md's "The lease and handover" names deleting the file or a single `relinquished:` line, and both still allow.
- "Active" is still undefined in the Change line, README step 3 (`scripts/hooks/README.md:59-60`) and §24 (`AUTONOMY.md:474`). A stale own lease blocks, and so does the case above. This was gate-1 C1's secondary note, and the correction did not take it up. It is a nit.

**C-b (nit): two reasons changed, but no direction did.**
- `lease: refreshed: <ts>` (no id) now reports "another session's lease", because the regex captures `refreshed:` as the id. It used to report "no active lease line".
- `lease: <id>refreshed: …` (no space) changes its reason the same way.
- Both still allow.

**E-s1 (low, suggestion): no test covers the relaxation.**
- I restored the gate-1 strict regex, `/^lease:\s*(\S+)\s+refreshed:/`, at `stop-queue.mjs:151`. The full suite still passed, 314 of 314.
- Every test's lease carries `refreshed:` (`hooks.test.mjs:61`, `writeHeldLease`).
- If the regex regressed, it would fail toward allowing the stop, which is the state before this correction.
- One extra assertion would cover it, for example a bare `lease: <id>` in the own-lease test at `:126`. That would add lines to an already-overrun budget, so it is optional.

**Nits**
- line 243 of `scripts/hooks/README.md` is 136 columns: the inserted Tests text was not reflowed. The file has 8 lines over 100 columns against main's 7.
- The class-4 row does not say "unit-only". `docs/PREREGISTRATION-TEMPLATE.md` class 4 asks for that when no second harness run was made. The CLI dry run below only partly stands in for one, since it does not run the mutation.
- The test-comment rewrite at `hooks.test.mjs:83-86` changes a claim that lives in a test comment. Round 14's exception wants such a correction "recorded by row with the superseded span pinned". The superseded span is described in words ("the id-comparison flip"), not pinned. A hash pin would have to point at the branch commit `7f3a013`, which round 15(e) forbids for append-only records, so I read the words as the achievable form. Observation only.
- Gate-1 architect item 6 is not addressed and was optional: the `?? 'unknown-session'` fallback at `stop-queue.mjs:274` is unreachable now.
- Amendment 2 cites `state/consults/2026-09-26-stop-hook-lease-gate1-{reviewer,architect}.md` by path only. Those files are on main (`86d6b4b`) and absent from the branch tree. That is fine: they are evidence, not Authority, and they resolve on merge.

### Scope items

**1. E1: the three mutations, each reverted with `git checkout`.**
- **(a)** `stop-queue.mjs:152`, `if (!match) return { held: true };`: only `stop-queue: allows when this session's lease is relinquished` fails, with `expected: 'allow'`, `actual: 'block'`. That matches Amendment 2 and the comment at `hooks.test.mjs:83-86`. E1 is resolved.
- **(b)** The absent-file catch at `:149` changed to `{ held: true }`: only `…holds no lease (file absent, or another session's lease)` fails, as recorded at `:101-103`.
- **(c)** `:153` with `!==` flipped to `===`: 10 tests fail, including `…blocks as before when CUSTODIAN-LEASE holds this session's own lease`, as recorded at `:123-125`.

**2. C1: the edge matrix.** All 15 gate-1 edge inputs keep their direction:
- Block: BOM, CRLF, leading whitespace, tabs, a stale own lease.
- Allow: a leading blank line, an empty file, `Lease:`, `relinquished:` then `lease:`, `sid-1x`, UTF-16LE, missing or empty `session_id`, numeric `session_id`, `CUSTODIAN-LEASE` as a directory.
- New cases that did not change: `lease:<id>` (block), a double space (block), `lease:` with no id (allow), an id with a trailing comma (allow), a prefix id (allow).
- The direction changes are listed under C-a.

**3. C3: dedupe coverage.**
- The mutation: key the dedupe on the session. `notifyWaiting` took a `sid` parameter, its key became `waiting:${sid}:${…}`, and step 5 passed `input.session_id`.
- Against `74b5fe2`, `stop-queue: notifies on the human-blocked-only allow, deduped on the waiting set` fails.
- Against the `7f3a013` test file with the same mutation, all 39 pass.
- So the coverage lost at gate 1 is restored by `hooks.test.mjs:289-294`.

**4. Docs rows: pass.**
- README lead-in (`README.md:48-49`) names §24 as step 3.
- The Tests section (`:241-243`) lists all three lease cases.
- The step-3 clause (`:62-64`) about the skipped human-blocked notice matches the code: the lease allow at `stop-queue.mjs:249-251` returns before the step-5 notify at `:268`, and the HALT notify at `:238` comes before the lease check.
- §24 (`AUTONOMY.md:472-474`) carries the same clause. It is still the last section, and the piece's AUTONOMY diff has 0 deletions, so §3 is unedited.
- The stale comment is fixed ("step 4", `hooks.test.mjs:156`). No other stale step numbers remain in `stop-queue.mjs`, the tests or the README.
- The reason text `(relinquished, malformed or empty)` at `stop-queue.mjs:152` resolves gate-1 D3.

**5. Amendment 2.**
- **Class 4:** correct. A mutation was mis-described, corrected after a gate finding, and its observed failure is recorded by name. I reproduced that failure.
- **Class 3:** acceptable for the relabel. Amendment 1's 160 was on the Scope-line basis, 4+12+2+93+49, which I confirm. That changes where the figure points, not the figure. The added 177/153 figures are class-6 content riding in the same row (observation).
- **Recount at `6bbe7b6`,** which equals HEAD with the form excluded:

  | File | + | − |
  |---|---|---|
  | `AUTONOMY.md` | 4 | 0 |
  | `README.md` | 14 | 6 |
  | `cloud.test.mjs` | 2 | 0 |
  | `hooks.test.mjs` | 92 | 10 |
  | `stop-queue.mjs` | 40 | 9 |

  - Scope-line basis: **177**. I agree.
  - §21c basis (code and tests only, the obliged §24 sentence excluded): 2 + 102 + 49 = **153**. I agree.
- **The README reading:** I agree the README is documentation, not "non-generated code and tests", so it is outside the base the round-5 note (`AUTONOMY.md:357`) counts. The note's narrowly enumerated exempt set lists exclusions *from* that base; it does not pull docs into it. Under the stricter reading the answer is 177 and full gating either way.
- **Amendment 1 is unedited.** The form's history is `ac7fad7` (the five lines), `7f3a013` (+Amendment 1) and `74b5fe2` (+Amendment 2), and the only change is 2 added lines. The five form lines are untouched.
- **The "still" clause:** see D-1.

**6. Regression.**
- **Scripts suite** (`node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`): 314 tests, 314 pass, 0 fail, rc 0.
- **The six plan checks**, all rc 0:
  - `verify`: PASS.
  - `verify-cites`: PASS. 48 loose advisories, none in this diff.
  - `verify-quotes`: PASS, 109 checked, 0 errors.
  - `verify-test-claims`: PASS, 256 claims.
  - `queue --check`: current.
  - `site --check`: current.
- **LF:** all 6 touched files are `i/lf w/lf` with 0 CR bytes, in the worktree and at HEAD.
- **Dry run of the real CLI.**
  - Setup: `CLAUDE_PROJECT_DIR` was `<redacted: a scratchpad directory outside the repository>`, with `two-nodes.yaml` copied in as `PLAN.yaml`.
  - Environment: `CUSTODIAN_STOP_HOOK`, `CLAUDE_CODE_REMOTE`, `CUSTODIAN_PLAN_PATH` and the Telegram token and chat id were unset, and `CUSTODIAN_TELEGRAM_DRY_RUN=1`.
  - `session_id` was `dryrun-session-2`.

  | Case | Exit | stdout | stderr |
  |---|---|---|---|
  | Relinquished | 0 | empty | `allow: CUSTODIAN-LEASE holds no active lease line (relinquished, malformed or empty) -- not this session's turn to hold the queue.` |
  | No file | 0 | empty | `allow: CUSTODIAN-LEASE absent (or unreadable) -- not this session's turn to hold the queue.` |
  | This session's lease | 0 | `{"decision":"block","reason":"next: two-nodes-ready — A ready node with no dependencies and no human need (lane shell, budget 30 min). Regenerate CUSTODIAN-QUEUE.md if PLAN.yaml changed; ledger before ending."}` | empty |
  | Extra: bare `lease: <id>` | 0 | same block JSON as the row above | empty |
  | Extra: another session's lease | 0 | empty | `allow: CUSTODIAN-LEASE holds another session's lease -- not this session's turn to hold the queue.` |

  - This output answers gate-1 architect Evidence item 2 if you file it in the ledger. The branch itself still carries no dry-run output.

Relevant files:
- `C:/dev/wt/stop-hook-lease/scripts/hooks/STOP-HOOK-LEASE-PREREGISTRATION.md`
- `C:/dev/wt/stop-hook-lease/scripts/hooks/stop-queue.mjs`
- `C:/dev/wt/stop-hook-lease/scripts/hooks/hooks.test.mjs`
- `C:/dev/wt/stop-hook-lease/scripts/hooks/README.md`
- `C:/dev/wt/stop-hook-lease/AUTONOMY.md`
- `C:/dev/spatial-ide/state/consults/2026-09-26-stop-hook-lease-gate1-reviewer.md`
- `C:/dev/spatial-ide/state/consults/2026-09-26-stop-hook-lease-gate1-architect.md`
