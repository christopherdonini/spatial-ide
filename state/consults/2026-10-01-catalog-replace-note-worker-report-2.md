# Consult — node 5, correction round 1, the worker's report (catalog-open-replace-drop-latency-note, g1, note only)

*Custodian's filing note: the worker's hand-back for correction round 1 of PR #151 (PLAN node `catalog-open-replace-drop-latency-note`, g1, note only), on the gate-1 architect's B1 and B2, delivered as a message on 2026-10-01. Recorded verbatim below the rule, from the message, with the harness's report indentation removed. The custodian's checks before filing: the branch is pushed and clean at 4941e47 (signed off) on 53e1cf4; `git diff 53e1cf4..4941e47` is 9 insertions and 6 deletions in `kernel/src/lib.rs`, all `///` lines (0 non-doc lines); rustfmt over stdin counts 16 `Diff in` hunks in `kernel/src/lib.rs` at both 53e1cf4 and 4941e47 (the custodian's run); §7's command gives 21+3 and 109+0, 133 over 2 files, recorded as the form's Amendment 2 (class 8).*

---

node:catalog-open-replace-drop-latency-note@g1 (correction round 1). Model observed: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.
Built: B1 and B2 fixed in Catalog::open's replace note, kernel/src/lib.rs only, doc lines only. Commit 4941e47 (-s), pushed to cut/catalog-replace-note. No PR opened. Nothing written under state/, PLAN.yaml, CUSTODIAN-QUEUE.* or site/. Form not edited.
- B1: the first sentence now reads "An `open` that returns `Ok` under a name already registered replaces the entry...". No other statement about the Err path.
- B2: "Otherwise the last holder drops it on its own thread" is replaced by "Otherwise a `get` holder drops the dataset (and, when no lease is in flight, its pool) later, on its own thread; a lease in flight releases the pool later, on its producer thread, while the dataset itself is dropped under the guard when the catalog's `Arc` was its last reference."
- Other §1 May 1 conditions and sentences are unchanged. The edit adds no number and no duration word, and no claim that a collision is impossible.
Tests (CARGO_TARGET_DIR=D:/wt-targets/catalog-replace-note): `cargo test -p spatial-kernel --test catalog_replace` gave 2 passed, rc 0. `cargo test -p spatial-kernel` gave all `test result` lines ok (lib 135 passed), rc 0.
rustfmt: `cat kernel/src/lib.rs | rustfmt --edition 2021 --check`, counting "Diff in" gives 16 at my head. I did not re-run it at 53e1cf4; the 16 there is your figure. My changed lines are within 100 columns by construction. A whole-file `awk length>100` check only showed existing `//!` lines, which I did not change.
Non-`///` changed lines in `git diff 53e1cf4..HEAD`: 0 (counted with `git diff -U0 | grep -E '^[+-][^+-]' | grep -vcE '^[+-]\s*///'`).
§7 command at head 4941e47, merge base d8544a0: `git diff --numstat d8544a0...HEAD -- . ':!kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'` prints 21 3 kernel/src/lib.rs and 109 0 kernel/tests/catalog_replace.rs. That is 133 changed lines against the declared 120, so the overrun is already class 8 (Amendment 1 recorded 130); the §7 line stays unedited and the count for the amendment is yours.
git diff 53e1cf4..HEAD (full, `///` lines only, one hunk @@ -159,12 +159,15 @@): 9 insertions, 6 deletions in `Catalog::open`'s doc.
- Removed: the 6 lines from "**Replacing a name.** Opening under a name..." through "...SKP opens under a fresh handle of random".
- Added: the 9 lines carrying the new first sentence and the B2 sentence above, then "Today `slice-host` opens once, and SKP opens under a fresh handle of random".
Lines "bits, so a collision is not excluded..." through "removed watch: bind the replaced value and drop it after the guard." are untouched context.
`gh pr checks 151` at the time I read it: the three checks (cargo test --workspace (windows-latest), tauri build (NSIS), typecheck · build · vitest · cargo test) were all pending, 0 elapsed. I did not re-read them after that.
Self-check: no cross-module interface touched; the B1 and B2 claims rest on the lib.rs code (the `?` before `lock_write`) and the engine Lease/pool facts the architect cited, which I did not re-read myself; no user-facing message; the existing T1 and T2 tests ran and pass.
