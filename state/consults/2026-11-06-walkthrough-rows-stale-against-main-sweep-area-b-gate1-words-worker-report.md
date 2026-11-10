*Custodian's filing note (2026-11-06): gate 1's words for PR #283 (`walkthrough-rows-stale-against-main-sweep-area-b`, the docs lane), the architect's C-1 and D-1, applied by a worker on `cut/walkthrough-rows-stale-against-main-sweep-area-b` at 6c6d4564, head 5920dee5, from the brief by path and sha256 (3049cc16), whose four words files the custodian's script built from the filed architect report's bytes; Part 1 item 2 of the human's rulings of 2026-11-05, no re-gate. The custodian's check by git: one commit, the one Scope file, 2 lines changed against 6c6d4564, the file's sha256 at the head equal to the brief's (83e419bc). The run 2026-11-06T01:22:44.331Z to 2026-11-06T01:33:47.822Z by its transcript (claude-sonnet-5-5; unique calls Bash 10, Read 2, Write 2 and the hand-back, 15, equal to the notification's); one push of its branch, and no reset, rebase, amend, force, PR action or claude command. Extracted by script from its hand-back, unchanged. A report, not Authority.*

---

Built: walkthrough-rows-stale-against-main-sweep-area-b words at 5920dee5c5ceb2f1fa45494113b27c3034c61599

- **Start state:** HEAD and `origin/cut/walkthrough-rows-stale-against-main-sweep-area-b` were both 6c6d4564b9bcb33382dbf4ccb3c516d554277f79, and the porcelain was empty.
- **Words files:** all four matched the given sha256 and byte counts (old1 561, new1 716, old2 25, new2 134), checked by command.
- **Script:** `<S>/wrb-w-apply.mjs` exited 0. Each old text occurred exactly once (old1 at byte 116811, old2 at byte 91007). It wrote LF only.
- **File hash on disk:** `sha256sum frontends/shell/MANUAL-WALKTHROUGH.md` gave 83e419bc4557b87c0e8149679640608befd66050d373fa54dea8c63685a21bbb, which equals the given hash. The file has no CR (count 0).
- **Numstat and hunks:** `git diff --numstat` showed `2 2 frontends/shell/MANUAL-WALKTHROUGH.md` and no other file. The hunks are `@@ -469 +469` and `@@ -664 +664`.
- **Commit:** one commit, `git commit -s -F`, subject `docs: walkthrough-rows-stale-against-main-sweep-area-b, gate 1's words (J1's span and the Part H pointer, the architect's C-1 and D-1)`. The only `@` in the message file is on the Co-Authored-By line, and the log shows one Signed-off-by line, added by `-s`.
- **Changed text at the head:** line 469 now reads "a rerun of H1 or H2 on the candidate arm (the arm after a launch or a reload; Part E's E4.5 pins baseline until the next reload) shows". Line 664 now includes "If a dataset was already on the map (the canvas from Part I), a `close_dataset` class-A entry for that dataset follows these two." and "(and, if nothing has loaded data since the window was opened or last reloaded, one `binding_data_plane_attach` class-B entry)". The whole span is the new text in `wrb-words-new1.txt`.
- **Checks at the new head, all exit 0:**
  - `verify.mjs --offline`: "verify:plan PASS — C:\dev\wt\wrb\governance\PLAN.yaml agrees with the repository."
  - `verify-cites.mjs`: "verify:cites PASS — every rooted (in-tree) path:line reference across 2660 file(s) resolves. (160 loose reference(s) advised above.)"
  - `verify-quotes.mjs`: "verify:quotes PASS — 138 checked, 107 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 913 ruling cites resolved, 0 ruling-cite e…"; the tool output was cut at 220 columns.
  - `verify-test-claims.mjs`: "verify:test-claims PASS — all 733 claimed test(s) across 233 file(s) exist or are planned, superseded or withdrawn (45 planned, 12 superseded, 17 withdrawn, advisory)."
- **Push:** the push exited 0. `origin/cut/walkthrough-rows-stale-against-main-sweep-area-b` equals HEAD (5920dee5c5ceb2f1fa45494113b27c3034c61599) and the porcelain is empty.
- **Off-scope, not done:** D-2 (four dates reading 2026-11-05) and the gate notes were left alone, as the brief said.
- **Background shells:** the harness moved the verify run and one wait loop to the background after 180 s. Both exited on their own (exit 0), and none is left running.
- **Model:** claude-sonnet-5-5 (Sonnet 5.5), no override. I received no context handoff and produced none.
- **Pre-gate classes:** there is no cross-module code in this piece. Each completion claim points to a command above. No user-facing message changed beyond the two walkthrough sentences, which the architect's C-1 and D-1 findings cite code for.
