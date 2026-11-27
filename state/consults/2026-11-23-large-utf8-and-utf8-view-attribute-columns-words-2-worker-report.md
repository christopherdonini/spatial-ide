*Filed by the custodian: the worker's report of large-utf8's second words commit (the reviewer's DOC-1 to DOC-4), node:large-utf8-and-utf8-view-attribute-columns@words-2, from b035ccb3727e2468ab289ecf539c83d928fe60a9 to 50c7c3314fe9d9b5afe7fd78417c5afd0c7992ba on cut/large-utf8-and-utf8-view-attribute-columns, dispatched at 2026-11-23T23:25:37Z; its run: Bash 20, Read 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-sonnet-5-5, from 2026-11-23T23:25:43Z to 2026-11-23T23:50:29Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 3790 bytes, sha256 1ddd4024bb9ead39bfa9cd0c092e25fb9483fbb8374480558b5fec5f57757178, byte for byte but for 6 values of the hold's lines and of the project's name, written as <m> by the custodian, with one final newline added. The brief's figure of 15 added lines was the custodian's error: by the blocks it is 11 insertions and 7 deletions, as the worker reports. It is evidence for the architect's build gate and the closing amendment, not a gate.*

---

words-2 landed and pushed. Head went from b035ccb3727e2468ab289ecf539c83d928fe60a9 to 50c7c3314fe9d9b5afe7fd78417c5afd0c7992ba. Push: b035ccb3..50c7c331 on cut/large-utf8-and-utf8-view-attribute-columns. Before starting, the head matched, the tree was clean, THE REPORT was 15730 bytes with the right sha256, and C: had 41441 MB free.

BLOCKS (the node script found exactly ten; line count, sha256 of the LF-joined text)
1: 3, 3182a0298f1f6bdb811f96d625defe6d587e9a42359e024000c90262bf9d7856
2: 5, dbb3c65cf010097a5837038eb7045ba0eb4a940b38ab637c64916cc57a06053f
3: 3, 338a9ac64839484577bde38aef7e496c85e400c399e7805a9b50ee8e4b10c648
4: 4, 615199abbf316fdd520400716862a9f762d5b86249e5662c193b777d27fc09d1
5: 2, d312c43fb02f72f50805e58ee2b3eda58e54e990da575208da682f4e7de6880d
6: 3, 281dde8f23448904d67e22a407e7f98bdfcdf1a0522989301014f96481a3a9a2
7: 1, 6d1832c34c4c0d622e3a148ab3a1144cd44ca0f2196f3d531a2d55c33d4b6f25
8: 1, afc58501b063cb1352141b5cb207145ceeeef3dc96113e1217d26a18b829295b
9: 1, fa965ea1ab26778a6a42fd7c6a56bf9df18049326afe0b209b4c9501ef1c6db0
10: 1, 7d0dc4dec51bf9836901368a85813fc69d8cd95cd250f1aa2803d744b89bc7db

STEP 1 (all four checks passed for every pair: no CR, Old once, New absent, no overlap)
- engine/tests/large_utf8_and_utf8_view_admission.rs: 90 lines before, 94 after.
- engine/src/attributes.rs: 1051 before, 1051 after.
- engine/src/predicate.rs: 3365 before, 3365 after.

STEP 2
- `git diff --name-only` shows exactly the three files.
- `git diff --stat`: 11 insertions, 7 deletions. The brief expected 15 added. The 11 are DOC-1 +3 net (5 for 3), DOC-2 +1 (4 for 3), DOC-3 +1 (3 for 2), plus one line each for the two DOC-4 files, so the brief's 15 does not match the blocks. I report it as the brief said and did not stop.
- Whole diff, the three hunks:
  - attributes.rs line 644 and predicate.rs line 2728: "line numbers at that commit" becomes "line number in the mutated file".
  - The T1 doc and the T1 inner comment are rewritten (H-SET's setting plus `arrow_output_version` 1.4 per I1, and `cea0ef8c`).
  - The T3 doc now ends "...red if that export stops being `Utf8`, as `SET arrow_large_buffer_size=true` added to `CONFIGURE_SQL` makes it. It reads no file, so a reader change that types a file's text column as other than VARCHAR is outside it."

CHECKS (all exit 0)
- `cargo fmt --all -- --check`: 0. It did not rewrap any replaced comment.
- `node scripts/plan/verify.mjs`: 0.
- `node scripts/plan/verify-cites.mjs`: 0.
- `node scripts/plan/verify-quotes.mjs`: 0.
- `node scripts/plan/verify-test-claims.mjs`: 0.
- Hold call (`cargo test --locked -p spatial-engine --lib --test large_utf8_and_utf8_view_admission`): 0.
  - lib: `test result: ok. 223 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 10.30s`.
  - admission: `test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.12s`.

HOLD LINES (masked)
- The hold waited behind an earlier <m> holder, with 20 MACHINE_WAITING lines, each naming <m> holders only.
- `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`

OTHERWISE THAN THE BRIEF
- I ran the cargo fmt and the four plan-script checks in one foreground call, which the harness moved to background. They did not run in a hold, since they are not heavy per the brief.
- The commit message was written outside the repo, in `<S>/lutf8w2/`. It carries no typed Signed-off-by line and no email address. The `-s` flag added the sign-off.
- Final `git status --porcelain` in the worktree is empty.
- I wrote nothing in the main checkout.

Model: Sonnet 5.5 (claude-sonnet-5-5).
