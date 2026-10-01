# Consult — node 5's worker report (catalog-open-replace-drop-latency-note, g1, note only)

*Custodian's filing note: the worker's hand-back for PLAN node `catalog-open-replace-drop-latency-note` at g1 (the form `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, note only), delivered as a message on 2026-10-01. Recorded verbatim below the rule, from the message, with the harness's report indentation removed. The custodian's checks before filing: the branch is pushed and clean at 53e1cf4 on 3f16cb7, c3e8e54 and fcb1de9 from d8544a0, each with one sign-off (the report's "7b-less obs commit" is 3f16cb7); §7's command gives `kernel/src/lib.rs` 18/3 and `kernel/tests/catalog_replace.rs` 109/0, 130 over 2 files, an overrun recorded as the form's Amendment 1 (class 8); every changed line in `kernel/src/lib.rs` is a `///` doc line; Product CI (Rust workspace and shell) succeeded on 53e1cf4. The report's line numbers are unpinned working pointers at the branch commits it names. One rooted cite into the branch-only test file is de-rooted at filing (to `catalog_replace.rs:51`), so that `verify-cites` on main does not resolve it against a file main does not have yet.*

---

node:catalog-open-replace-drop-latency-note@g1 — model observed: claude-sonnet-5-5 (Sonnet 5.5), no override, no context handoff.

BUILT: kernel/tests/catalog_replace.rs (T1, T2, exact §4 names, own fixtures catalog-replace-t{1,2}-{a,b}.parquet); doc-only edits in kernel/src/lib.rs (open's replace note, open_cancellable one-line pointer, Catalog::remove sentence = §2 item 2 text). Branch cut/catalog-replace-note pushed, head 53e1cf4; commits fcb1de9 (tests A), c3e8e54 (docs B), 7b-less obs commit "M1/M2 observations", 53e1cf4 (rustfmt). No PR, nothing under state/PLAN/queue/site, form untouched. Porcelain empty.

!! §7 OVERRUN (class 8, for the custodian to record; §7 not edited): git diff --numstat d8544a0...HEAD (counting command, minus excluded paths) = lib.rs 18/3, catalog_replace.rs 109/0 => 130 changed lines vs ceiling 120, 2 files. Cause: rustfmt (0-hunk requirement) expanded the test from 83 to 109 lines. I did not trim to fit.

GREPS at d8544a0 (§6 items 2, 3):
H1 `git grep -nE "\.open\(|\.open_cancellable\(" -- kernel/src frontends/shell/src-tauri/src protocol`: Catalog receivers only kernel/src/main.rs:105 (slice-host), kernel/src/skp.rs:1099 (open_cancellable, fresh handle), kernel/src/skp.rs:2964 (a test). Rest are OpenOptions/File opens (state.rs:37, audit/log.rs:147,218, skp.rs:2721). H1 holds, I1 not fired.
I5 `git grep -n "Arc<Dataset>" -- engine/src kernel/src protocol frontends/shell/src-tauri/src`: publish.rs:160,373,452,479,1357 (call-local publish params/fixture), kernel/src/lib.rs:112,140,143,194,198,202 (catalog), skp.rs:1263 (viewport_query_resolve return, a call local; passed on as &Dataset), SKP-V0.md:131 (prose), pool_poll.rs:13 (comment). No stream-held Arc<Dataset>. I5 not fired.

T1/T2 at base d8544a0 (before any doc change): both PASS (2 passed, 0.10s). No I2.
MUTATIONS (applied by editing, test run, reverted, porcelain empty after each; applied on tree at c3e8e54; recorded in the tests' docs):
M1 (open: insert -> entry().or_insert()): T1 FAILED at catalog_replace.rs:51 "assertion `left == right` failed: get(N)'s path is B" (left ...t1-a.parquet, right ...t1-b.parquet); T2 passed.
M2 (open_cancellable, same): T2 FAILED at catalog_replace.rs:78 same assertion name; T1 passed.
No verify-mutation run was called an observation.

CHECKS (rc read directly): cargo test -p spatial-kernel rc=0 (135 lib tests ok, all integration binaries ok, none failed); cargo clippy -p spatial-kernel --tests rc=0, no warning mentions catalog_replace or lib.rs (existing warnings in import_layout_factorial only). rustfmt --edition 2021 --check: lib.rs 0 hunks at d8544a0 and 0 at head (checked as git-show copies, default config, no rustfmt.toml in repo); new file 0 hunks (rc=0). node --test scripts/plan+hooks: 353 pass, 0 fail. verify-cites (tool commit 522e448, no file args, whole tree): PASS, 32 advisory. verify-quotes (f9444a4, --show-cites on both files): PASS 0 checked, 0 errors. verify-test-claims (57c626f): PASS, 418 claims. verify-mutation (7d24ed1, --base d8544a0 --head HEAD): PASS, both new tests have a recorded mutation naming them (ok lines at catalog_replace.rs:42 and :77 on the formatted head).
§8: diff touches only lib.rs and catalog_replace.rs; every changed lib.rs line is a `///` line (0 non-doc +/- lines); note has no number/duration word (cites ADR-018 item 4 only; I avoided "meanwhile"; it does say "later" nowhere now, "once" for slice-host per §2 item 1's own wording); grep for sleep|timeout|thread|spawn|loop in the test file: no match (rc=1).
CI at head 53e1cf4: Product CI — Rust workspace success; Product CI — shell success.

PRE-GATE SELF-CHECK: (1) interfaces: used Catalog::open/open_cancellable/get/names, Dataset::connections() (engine/src/dataset.rs:652) and ::path() (:884), CancelToken, fixture::write_geoparquet — read before use, all existing pub with product callers (main.rs:105, skp.rs:1099); no new item. (2) claims: each backed by output above; the §1 May-claim 1 (drop before guard release) is reading-only, T1/T2 prove the pool is gone at return. (3) messages: doc text states code facts only; no operator text. (4) tests reach assertions: observed failing at the path-equality assertion under each mutation, not at setup.
OFF-SCOPE NOTICED: none acted on. Note the M1/M2 observation docs cite commit c3e8e54 (branch commit, in test text; per round 25 item 2 the pin follows on main after merge).
Files: C:/dev/wt/catalog-replace-note/kernel/src/lib.rs, C:/dev/wt/catalog-replace-note/kernel/tests/catalog_replace.rs.
