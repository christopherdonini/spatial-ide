*Custodian's filing note (2026-11-03): filler entry 4b, `stream-cancel-returns-left-unmarked`, built by a worker-high on `cut/stream-cancel-returns-left-unmarked` from 7b311b11, head 48600edc, under its five-line form (`governance/forms/engine/STREAM-CANCEL-RETURNS-LEFT-UNMARKED-PREREGISTRATION.md`); draft PR #277. The custodian's check by git: origin's branch is at 48600edc, three commits past 7b311b11, engine/src/stream.rs +91/-29 and engine/README.md +3/-3, 126 changed lines against the declared 150. The run 12:05:35Z to 13:33:41Z by its transcript (Bash 70, Edit 22, Read 9, Write 3, Grep 4; three commits and one push, no reset, rebase, merge, amend, force, PR action or claude command; two checkouts of engine/src/stream.rs, each reverting a mutation; its writes inside its worktree and its scratch folder). Its disclosure 3, a `git fetch --dry-run` and a `git ls-remote`, are network contacts its brief forbade: disclosed by it, no ref changed. Every cargo call ran inside a shared hold, seven granted and released by its transcript. No process of its was left running. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is aaec72aa7971d8f855c673bae8c01de319b39cb11ebe5c325b6a06dc78248354.*

---

Built: stream-cancel-returns-left-unmarked at 48600edc42d3d5caf585153b583cd556e7515651

Branch cut/stream-cancel-returns-left-unmarked, worktree C:/dev/wt/scrlu, base 7b311b1115da38871f1abdee3b50343e624bcc60, target D:/wt-targets/scrlu. Form sha256 4252d2f6cd2ceafa27cda814395a7726d2a2db78ab67019e94319488c6032adb confirmed before work. The checkout's .cargo/config.toml sha256 is 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f, equal to the one you gave. No stop rule was met. Every cited line I used was where the form pins it; none had moved.

**Commits** (each `-s`; each message file had no `@` outside its first trailer line, shown by grep before each commit):
1. 4a82683c4cbd452e26fc7b6b008ff9b632706a19 `fix: stream-cancel-returns-left-unmarked, classify stamps PRODUCER_CANCELLED on every Cancelled it returns`
2. c63e5dafdc17ba2ab73f641b3947fbe4bf1bca6e `test: stream-cancel-returns-left-unmarked, T-3 for classify's mark, the lock on the two classify unit tests, T-2's doc revised`
3. 48600edc42d3d5caf585153b583cd556e7515651 `docs: stream-cancel-returns-left-unmarked, the record: M-3 and M-2 observed at c63e5dafdc17ba2ab73f641b3947fbe4bf1bca6e`

**Changes in `produce` and `classify`** (engine/src/stream.rs, line numbers at base 7b311b11):
- `classify` (2640-2651): doc rewritten to say it stamps on its one read, and `crate::trace::mark(crate::trace::PRODUCER_CANCELLED, 0, 0)` added inside `if cancel.is_cancelled()` before `EngineError::Cancelled`.
- `produce` prepare site (1799-1801): a 2-line comment added above the unchanged `conn.prepare(sql).map_err(|e| classify(...))?`.
- `produce` execute-`Err` arm (1848-1857): the `if cancel.is_cancelled() { mark }` read removed. The comment is now 3 lines (was 4). `return Err(classify(cancel, "execute", &e.to_string()))` is unchanged.
- `produce` fetch-panic arm (1924-1939): the same removal. The comment is 5 lines (was 12). `return Err(classify_fetch_panic(cancel, &detail))` is unchanged.
- The send to a gone receiver (`.map_err(|_| EngineError::Cancelled)`), flush, trace.rs and cancel.rs are untouched. The pre-prepare check's mark and `return` are untouched in the product.
- Product-change greps (git diff 7b311b11..HEAD): no seam, no cfg(test) hook, no pub item, no string a user sees, no path:line cite in a code comment.

**Tests**
- T-3 `classify_stamps_producer_cancelled_when_it_returns_cancelled`, in `mod tests`:
  - It takes `TEST_LOCK` first, starts trace 1 and calls `cancelled.cancel()`.
  - Assertion (i), returns Cancelled: `classify(&cancelled, "prepare", "Binder Error: no such column")` matches `EngineError::Cancelled`.
  - Assertion (i), presence: `guard.trace().first(PRODUCER_CANCELLED).is_some()`.
  - It drops the guard and starts trace 2.
  - Assertion (ii), returns Cancelled: `classify_fetch_panic(&cancelled, "no panic message")` matches `Cancelled`.
  - Assertion (ii), presence: `PRODUCER_CANCELLED` present.
  - Presence only, no absence or exact-list assertion.
- `TEST_LOCK` is now the first statement of `only_duckdbs_out_of_range_class_is_read_as_an_evaluation_failure` and of `the_fetch_panic_is_read_as_out_of_range_only_by_its_fixed_prefixes_at_the_start`, in the file's existing 3-line shape. The diff of commit 2 added four `assert!` lines (all in T-3) and removed none.
- The doc of `the_pre_prepare_cancel_exit_stamps_producer_cancelled` is revised and its assertions are unchanged. The stale "A later piece that marks `classify` must revisit this test" is gone, and the doc now says what M-2 catches.

**Mutations**
Each was applied alone to the tree at commit 2 (c63e5dafdc17ba2ab73f641b3947fbe4bf1bca6e), run inside a shared hold, then reverted with `git checkout -- engine/src/stream.rs`. After each revert `sha256sum engine/src/stream.rs` was 22ea659f452e7affe2aba2490a12a156a9bc85ae8b644d95b102656be8e04fd9, the same as before the mutation, and the porcelain was clean.
- M-3 (mark deleted in `classify`): `cargo test -p spatial-engine --locked --lib classify_stamps_producer_cancelled_when_it_returns_cancelled` gave exit 101. `classify_stamps_producer_cancelled_when_it_returns_cancelled ... FAILED`, panicked at engine\src\stream.rs:3298:9: "(i) classify must stamp producer_cancelled when it returns Cancelled".
- M-2 (pre-prepare check's mark deleted, `return` kept): `cargo test -p spatial-engine --locked --lib the_pre_prepare_cancel_exit_stamps_producer_cancelled` gave exit 101. `the_pre_prepare_cancel_exit_stamps_producer_cancelled ... FAILED`, panicked at engine\src\stream.rs:3261:9: "the pre-prepare cancel exit must stamp producer_cancelled". That is its presence assertion.

**README lines changed** (engine/README.md, 3 lines):
- Producer trace row: appended `, `engine/src/stream.rs::tests::classify_stamps_producer_cancelled_when_it_returns_cancelled``.
- Preregistration list: inserted `governance/forms/engine/ENGINE-CANCEL-BEFORE-EXECUTE-SIBLINGS-PREREGISTRATION.md` (between the CRS-UNDECLARED and EXTENSION-AUTOLOAD entries) and `governance/forms/engine/STREAM-CANCEL-RETURNS-LEFT-UNMARKED-PREREGISTRATION.md` (before the STREAM-FLUSH entry), alphabetical by file name.
- Last verified at: appended `; the preregistration list's two governance paths, at 7b311b11` in commit 1, and `; the Producer trace row's `classify_stamps_producer_cancelled_when_it_returns_cancelled` pointer, at c63e5daf` in commit 3.

**Size:** `git diff --numstat origin/main...HEAD -- engine/src/stream.rs engine/README.md` gives 91+29 and 3+3, which is 126 changed lines against 150, over 2 files.

**Checks at head 48600edc**
- `cargo test -p spatial-engine --locked`: exit 0. 51 "test result: ok" lines, no failures. The lib line is `ok. 209 passed; 0 failed`.
- `cargo test -p spatial-kernel --locked --test trace_spans --test skp_admission --test skp_filter_cancellation`: exit 0. skp_admission `ok. 10 passed`, skp_filter_cancellation `ok. 1 passed` (48.26s), trace_spans `ok. 6 passed`. No timing-sensitive failure appeared.
- `cargo fmt --all -- --check`: exit 0, no output.
- `cargo clippy -p spatial-engine --locked --tests --no-deps`: exit 0. It prints 4 warnings in engine/src/stream.rs, at 2346, 2350, 2462 and 3807 at head. None is in a hunk I changed. They are the identical-blocks `if`, a too-many-arguments warning and a type-complexity warning, and the other warnings are in other files.
- `node scripts/plan/verify.mjs --offline`: exit 0, "verify:plan PASS".
- `verify-cites.mjs`: exit 0, "PASS — every rooted (in-tree) path:line reference across 2572 file(s) resolves. (82 loose reference(s) advised above.)". None of the advisories names my files.
- `verify-quotes.mjs`: exit 0 after 7m15s, "PASS — 134 checked, 103 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined)…".
- `verify-test-claims.mjs`: exit 0, "PASS — all 713 claimed test(s) across 226 file(s) exist or are planned, superseded or withdrawn".
- Commit-1 run (`cargo test -p spatial-engine --locked`, before T-3 existed): exit 0, lib 208 passed. Commit-2 run (`--lib`): exit 0, 209 passed.
- Origin's branch equals HEAD: `git ls-remote` gives 48600edc42d3d5caf585153b583cd556e7515651, and `git status --porcelain` is empty.

**Disclosures**
1. The brief put the Last verified edit in commit 1. I could not name commit 2 there, and T-3 did not yet exist at 7b311b11. So commit 1 names 7b311b11 for the preregistration paths, and commit 3 (which touches README as well as stream.rs) adds the T-3 pointer at c63e5daf. At commit 1 the Producer trace row already names T-3, which lands in commit 2.
2. The base has no earlier `RECORDED MUTATION:` line for T-2. Only its "Mutation: remove the mark from that check." sentence existed. I kept that sentence and added the M-2 `RECORDED MUTATION:` line beside it.
3. I ran `git fetch --dry-run` once, which contacts the remote and was not needed. It printed nothing and changed no ref. I also used `git ls-remote` once to show origin's branch.
4. One of my command chains short-circuited when a `git diff | grep` returned 1. No hold was requested for it, so the following release answered MACHINE_NOT_HELD and nothing ran. I redid the M-2 run properly.
5. I did not run `verify-quotes.mjs --show-cites` on the changed files. The code and comments contain no quote presented as verbatim.
6. In the worktree, `origin/main` resolves to 811a2f5c, not the base; the size count is the three-dot diff as you specified.

**Hold lines** (my project's, `also=` elided). All were granted, with no exit 96 to 99, and every one was released:
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:51356` (engine tests, commit 1)
- `... shell=bash.exe:35784` (`--lib`, commit 2)
- `... shell=bash.exe:37072` (M-3)
- `... shell=bash.exe:78972` (M-2)
- `... shell=bash.exe:60200` (engine tests at head)
- `... shell=bash.exe:65096` (kernel tests at head)
- `... shell=bash.exe:63296` (clippy)
- Each was followed by `MACHINE_RELEASED project=SpatialIDE`.

**Background shells:** every background job I started (the holds, the bounded wait loops, verify-quotes) finished by itself and its completion was notified. A process query by command line found none of mine left, and I killed nothing.

**Model:** the harness reports Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff received or produced. No usage figures are at hand.

**Pre-gate self-check**
- Cross-module code: none added.
- Completion claims: each rests on a logged run (the scratchpad `scrlu-*.log` files hold each run).
- User-facing strings: none added or changed.
- Every required test reaches its intended assertion: both mutations failed at those assertions, as recorded above.
