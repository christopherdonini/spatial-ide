*Custodian's filing note (2026-11-09): the worker's report for `shell-resource-dir-dev-comments`'s OPEN-B (a) commit on PR #304, by the human's ruling of 2026-11-09 (`state/directives/2026-11-09-304-open-b-a-widened-303-clicked-pef-open-2-a-open-5-listen-test-then-5180.md`, line 9) and its form's Amendment 1. Its brief was given by file (12653 bytes, sha256 3399ceb2e312e9d56046f7f70b0fec07496d3f1b2e1294447d7de6fef55bd98c), carrying the architect's words for the two spans as copied from the form by the custodian's script. Dispatched at 2026-11-09T21:41:00.932Z by its transcript; the run went to 2026-11-09T21:46:20.923Z (claude-sonnet-5-5; unique calls: Read 3, Bash 22, Edit 2, Write 2, the hand-back, 30 in all; no errored call). The report below was extracted by script from the hand-back in that transcript (5834 bytes, sha256 919212c48e716dac46207936dbcd2433da39dcf53cf20570d5be0d69538728e5) and is unchanged; scratch paths in it are the worker's scratch folder, `<S>` in these records. The custodian checked by script: the branch's head is 165e07f2b902ce4a1537db012be3f05c16f63f7b, one commit on 96d439b1; its added lines are byte-equal to the brief's; `frontends/x`, the empty file the worker's mistaken redirect created and then removed, is in neither the commit's tree nor the worktree. The deviation the report discloses is in the transcript as written: the push ran inside one compound command at 2026-11-09T21:45:44Z, before the worker wrote up step 5's clause check. The push is the fast-forward step 6 asks for, and the gate is the reviewer's one scoped check of the two spans, which the human ordered.*

---

Built: shell-resource-dir-dev-comments OPEN-B (a) at 165e07f2b902ce4a1537db012be3f05c16f63f7b

One process deviation, disclosed. I ran `git push` inside a command meant only to print line numbers, with a mistaken stdout redirect. It made the push before my step 5 clause check was written up. The fast-forward push is the one step 6 asks for. All checks of steps 1-4 had passed, and the clause check below passes. The redirect created an empty file `frontends/x` in the worktree. I removed it, and the porcelain is empty.

**Where, steps 1-3**
- `origin/main` is 8e4fdb0719c68dace77be0a154ee99feba424400. The form's sha256 by `git show` at it is 7006b48dd8cbe03785dcb7a99d4c840c5e2a2ace36b8b628935482c4f01d692f. `git merge-base P origin/main` is c42cfd6002d8d78777bacf3db5e0feb19125aca9, which is B.
- Worktree branch is `cut/shell-resource-dir-dev-comments`. HEAD and origin's branch were both P (96d439b1...) and the porcelain was empty.
- Build outputs: `renderer/bundle-viewer/dist` (NOTICE.txt, app.js, index.html) and `frontends/shell/dist` were both present. I ran no npm.

**Order 1.** `sed -n '1403p;1598,1601p'` at P matched the old lines byte for byte (no CR, em dash intact).

**The commit's diff** (`git diff -U0 P..HEAD`). Git leaves line 1598 out of the hunk because it is identical in the old and new text.
```
@@ -1403 +1403,2 @@
-/// or no resource directory is passed. Both paths are named in the refusal when neither holds.
+/// or no resource directory is passed. Every candidate tried is named in the refusal when none
+/// holds.
@@ -1599,3 +1600,2 @@
-        // `app.path().resource_dir()` returns an error, and the dev-tree path does not hold the
-        // viewer either) — the remedy stays developer-context, since there is no installed app to
-        // tell an end user to reinstall.
+        // `app.path().resource_dir()` returns an error) and the dev-tree path does not hold the
+        // viewer either — the remedy is the developer one, the `else` arm.
```
Commit 165e07f2b902ce4a1537db012be3f05c16f63f7b, subject: `docs: shell-resource-dir-dev-comments, bundled_viewer's refusal sentence and the no-resource-directory mirror test's comment say what the code does when no resource directory is passed; comments only`. It was made with `-s`. The message file had `@` only in its first trailer line (grep showed line 9 only). The Signed-off-by line was added by `-s`.

**Step 4 runs (all exit 0 unless marked)**
- `git diff --name-only P..HEAD`: publish.rs only.
- Numstat `P..HEAD`: 4 added, 4 removed (publish.rs).
- Numstat `B...HEAD`: publish.rs 15/14, commands.rs 2/2. Total is 17 added, 16 removed, 33 lines, under the budget of 60.
- Spans, `srdc2-spans.mjs`: it checks exactly two hunks, byte-equal to the brief's lines. Negative self-test first (one added word) exited 1 (SPANS-DIFFER). The real run exited 0 (SPANS-EQUAL).
- Tokens, `srdc-tokens.mjs`:
  - B against B exited 0, with 869 tokens for commands.rs and 6198 for publish.rs.
  - Negative copies, each exit 1: identifier changed (`resolve_viewer_dirx`); a character changed inside a string holding ` — ` (`rox`); an `assert!` argument changed (`checkout pat`).
  - B against HEAD for both files exited 0 (TOKENS-EQUAL, 869 and 6198).
- Comment lines, `srdc-difflines.mjs`:
  - Negative 1, a code line changed: exit 1.
  - Negative 2, a string literal containing `//` (`publish://progres`): exit 1.
  - Real run over `B...HEAD` for both files: exit 0, plus=17 minus=16 not-comment=0.
- `cargo fmt --check`: exit 0.
- `cargo test ... --lib resolver_tests::no_resource_directory_at_all`: 2 passed.
- Full suite: exit 0. The test-result lines are 73 passed (lib), 0 (main), 2 passed (`sole_caller_scan`) and 0 (doc-tests), so 75 passed and 0 failed.
- CR count in the added lines of `git diff P..HEAD`: 0, by `srdc2-cr.mjs` (a copy of `srdc-cr.mjs`).

**Step 5, clause check at HEAD** (`publish.rs`)
- (ii) "Every candidate tried is named in the refusal when none holds": `candidates` is built at :1489-1493 (the resource-directory candidate only when `Some`, then the dev-tree one). `tried` at :1512-1522 maps every candidate to a label, joined with ", or ", and :1534 puts it in the `Err`.
- (i) `None` as `commands.rs` passes it: `app.path().resource_dir().ok().as_deref()` at commands.rs:323 and :556. The comment is in `resolve_viewer_dir` at :1528-1531.
- (i) The test's `|_| false`: `resolve_viewer_dir(None, |_| false)` at :1602, so the dev-tree candidate fails too.
- (i) "the remedy is the developer one, the `else` arm": with `None`, `resource_dir.is_some()` is false, so the `else` at :1531-1532 yields "run `npm run build` in renderer/bundle-viewer first". The test asserts that string and `!err.contains("reinstall Spatial IDE")` (:1605-1608).
- Every clause ties to a line.

**Holds** (also= elided)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:70492`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:70492 affinity=FF (cores 0-7)`.
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:73740`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:73740 affinity=FF (cores 0-7)`.

**Push.** `git push origin cut/shell-resource-dir-dev-comments` was a fast-forward. After a fetch, origin's branch and HEAD are both 165e07f2b902ce4a1537db012be3f05c16f63f7b. `git merge-base --is-ancestor P origin/cut/...` exited 0. The porcelain is empty. I did not touch the PR or CI.

**Off-scope noticed.** The brief's "three new lines" for the second span is a three-line block whose first line is unchanged, so the diff shows -3/+2. I did not change anything for that.

**Background shells left:** none. I started none.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff. Scratch files are under the scratchpad folder, named `srdc2-*`.

*Custodian's correction (2026-11-09), closing D1 and D2 of the reviewer's OPEN-B (a) scoped check (`state/consults/gates/2026-11-09-shell-resource-dir-dev-comments-openb-a-scoped-check-reviewer.md`), the report above unchanged: at 165e07f2, the comment in `resolve_viewer_dir` saying `commands.rs` passes `None` only when its `resource_dir()` call returned an error is at publish.rs lines 1523 to 1527 (its clause on 1526 and 1527); lines 1528 to 1531 are code. The test's string assertion is at lines 1605 to 1608, and its negated `reinstall Spatial IDE` assertion at line 1609.*
