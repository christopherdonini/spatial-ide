*Custodian's filing note (2026-10-20): the worker's report for `publish-approval-ttl-ten-minutes`, under `frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md` and its Amendments 1 and 2, in C:/dev/wt/ttl from f2052681; the head 5e922915419fff578d862ae1a47aefa39c955ba2, pushed. The run 2026-10-20T18:38:14Z to 19:48:54Z by its transcript (Bash 40, Write 9, Read 6, Monitor 1); its one SubagentHandback call, at 19:48:53Z. The custodian matched its claims to calls and their logs: the lib's 68 tests passed, M1 to M4 each failed by name, and the new Rust test passed unmutated. Two deviations from its brief, both its own: its first hold wrapped the command in parentheses, and one `verify-quotes` run was outside a hold. A detached worktree it added under its scratch folder to check quotes at the base is gone from the worktree list. Extracted by script; one final newline added if absent; nothing else changed.*

---

node:publish-approval-ttl-ten-minutes@g2 -- built, pushed, porcelain clean. Two things need a custodian decision: the form's Rust command runs zero tests, and the M-record comments put two files over their per-file budget.

HEAD 5e922915 on cut/publish-approval-ttl-ten-minutes (origin updated twice, ordinary pushes, rc=0 each). Base f2052681.
- ca5069bf step 1: publish.rs `Duration::from_secs(600)`, 2 doc lines, new Rust test; exportElapsed.test.mjs T1 (`const TTL = 600_000`, name "T1 the TTL read from the real publish.rs is 600000 ms").
- 4379f3c8 step 2: PublishDialog.tsx exports APPROVAL_EXPIRY_MINUTES = 10 and APPROVAL_EXPIRY_SENTENCE, one `<p className="publish-dialog-expiry">` after the instruction paragraph, abandon comment without its number. PublishDialog.test.ts gains D1 and D2.
- 42e6fc14 step 3: publish.mjs, e2e/README.md (publish entry only), MANUAL-WALKTHROUGH.md (G3 and the EXPIRED' row).
- 5e922915 step 4: comments only, M1 to M4 recorded. Comments sit beside T1, the Rust test, D1 and D2.
- ADR-024, state/, PLAN.yaml, DECISIONS-PENDING.md and settings were not touched.

**Differences from the form**
1. §3's cargo command (`--lib a_pending_attempt_121s_old_is_still_taken_within_the_ttl -- --exact`) matches nothing. It printed "0 passed ... 68 filtered out" with rc=0. The full path `publish::tests::a_pending_attempt_121s_old_is_still_taken_within_the_ttl` with `--exact` runs it. That full-path command is the one M2 used. The form's wording is the defect.
2. Per-file budget overruns in the step-4 comments. exportElapsed.test.mjs is 5 against its 4 (3 added, 2 deleted), and publish.rs is 36 against its 35 (34 added, 2 deleted). §3 block-on-sight 6 calls a size overrun class 6, so you decide how to treat it. Total is 89 changed lines against 120.
3. The abandon comment now reads "(`PENDING_ATTEMPT_TTL` in `publish.rs`)" instead of dropping only the number.
4. The sentence constant is a template literal built from APPROVAL_EXPIRY_MINUTES. I checked by script that the form's Words bullet equals the sentence with "10" put back. D1 pins the literal words.
5. Deviation from THE MACHINE shape. My first hold (bundle-viewer `npm ci` and `npm run build`) wrapped the command in parentheses. Every later hold ran `bash <script file>` as its own step. Separately, I ran repo-wide `verify-quotes.mjs` once outside a hold, to check whether its failures were pre-existing.

**Tests**
- Whole cargo run at 42e6fc14 plus the later comment commit: 68 passed in the lib, rc=0. The new Rust test appears as ok in that log.
- `npm run verify` rc=0: 100 test files, 1393 tests passed.
- `npm run test:export-elapsed` rc=0: 5 passed (T1 to T4).
- Mutations, each applied alone at 42e6fc141044 (full 42e6fc1410447c331a4b213b02fdc220e834fc7a), failure read by name, reverted with empty porcelain. No `verify-mutation` run was used.
  - M1 (600 set to 120): `npm run test:export-elapsed` rc=1, "✖ T1 the TTL read from the real publish.rs is 600000 ms".
  - M2 (600 set to 120): full-path `--exact` run rc=101, `publish::tests::a_pending_attempt_121s_old_is_still_taken_within_the_ttl ... FAILED`, panic "a pending attempt 121 s old is within the 600 s TTL and must be returned". The unmutated run passes (1 passed). My first M2 attempt used the form's command and ran nothing; the full-path run is the observation.
  - M3 (expiry paragraph deleted): `npx vitest run src/publish/PublishDialog.test.ts -t "<D1 name>"` rc=1, "× D1 renders the approval-expiry sentence verbatim while the dialog asks for the phrase" (expected -1 to be greater than 1159).
  - M4 (600 set to 300): same vitest command with D2's name, rc=1, "× D2 the expiry sentence's minutes are PENDING_ATTEMPT_TTL's, read from publish.rs" (expected 600 to be 300).

**Commands run at the head (exit code each)**
- bundle-viewer `npm ci` and `npm run build`: rc=0.
- `node --test` over the three CI globs: rc=0.
- `verify.mjs --offline`: rc=0, PASS.
- `verify-cites`: rc=0, PASS.
- `verify-test-claims`: rc=0, PASS.
- `verify-quotes.mjs --show-cites <changed files>`: rc=1, 33 "quote not found".
  - The same 33 fail with the 7 files checked out at base f2052681, so none comes from my lines. They are MANUAL-WALKTHROUGH.md lines 122 to 1438, publish.mjs:522 and :529, publish.rs:876, and PublishDialog.test.ts quotes at base-numbered lines.
  - After the check I restored the files; porcelain was empty.

**Scope figures** (ADR-024 not yet in the diff; added/deleted)

| File | Added | Deleted |
|---|---|---|
| MANUAL-WALKTHROUGH.md | 2 | 2 |
| e2e/README.md | 1 | 1 |
| exportElapsed.test.mjs | 3 | 2 |
| publish.mjs | 6 | 5 |
| publish.rs | 34 | 2 |
| PublishDialog.test.ts | 24 | 0 |
| PublishDialog.tsx | 6 | 1 |

**Strings and comments added**
- PublishDialog.tsx:
  - Doc comment above the constants: "P6 placeholder (AUTONOMY.md section 31 f): ...".
  - The sentence "This approval expires after 10 minutes, and the publish then has to be started over."
- publish.rs: 2 doc lines ("600 s is 10 minutes, under that 20-minute ceiling; the approval dialog states the expiry (`PublishDialog.tsx`).") and one RECORDED MUTATION line (M2).
- exportElapsed.test.mjs: one RECORDED MUTATION line (M1).
- PublishDialog.test.ts: two RECORDED MUTATION lines (M3 on D1, M4 on D2).
- publish.mjs: the printed note is now a template with `${ttlMs / 1000}s` and says "sleeping out the TTL"; `const ttlMs = initTtl()` is kept.
- README.md: "without sleeping out the whole TTL."
- MANUAL-WALKTHROUGH.md:
  - EXPIRED' row: "a hardcoded constant" and "a wait of the whole TTL".
  - G3: the placeholder sentence is inserted after the instruction.

**Caller grep for the new exports** (no new `pub` item; the Rust test is test-only): APPROVAL_EXPIRY_MINUTES at PublishDialog.tsx:10, used at :11 and by D2. APPROVAL_EXPIRY_SENTENCE at :11, rendered at :277.

**Pre-gate self-check**
- Cross-module seams read from the real files: D2 and T1 read the real publish.rs with the regex shape of exportElapsed.mjs and PublishPanel.test.ts. No new boundary.
- Every completion claim points to a log or a command in this report.
- The only user-facing message is the placeholder sentence, which describes behaviour present at this commit: TTL 600 s and the dialog closing on any outcome.
- The tests reach their intended assertions, shown by the failures above.
- The Scope counting command is the one in the form.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override. I received no context handoff. Scratch logs are `ttl-*` in my scratchpad.

Not run: e2e (E1 is yours) and the app. The machine hold waited about 25 minutes behind your exclusive hold on the first call.
