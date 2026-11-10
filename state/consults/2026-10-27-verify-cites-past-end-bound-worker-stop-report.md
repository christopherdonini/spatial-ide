*Custodian's filing note (2026-10-27): the worker's first hand-back on `verify-cites-past-end-bound` (PB), the governance lane's piece, built under its five-line form in C:/dev/wt/pb. It stopped on the brief's rule that a mutation must fail only at its predicted test: M1 fails its named test and two more. The code and list commits are pushed (7df4983f); the record commit was not made. The custodian's check: the branch's commits, its numstat (178 lines over 4 files against the declared 150) and the list's 13 entries by git; the transcript shows the eight mutation runs by its own script, their outputs in the scratch folder, two commits and one push, no amend, rebase or force. The settlement: M1 recorded as a class 2 deviation (the form's Amendment 1), the prediction not edited; the overrun closes the single-gate route under §21b's mid-piece clause, so the reviewer and the architect gate it, the short form kept, a class 6 amendment with the final figure after the record commit; the worker resumed for the record commit. The run 20:08:04Z to 20:33:54Z by its transcript (Bash 50, Read 4, Edit 4, Write 8). Extracted by script from its first SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is bd959415e14d379c337f879044bdd6f045e0dcdfc3bf30351a3666b471e671b8.*

---

Stopped: verify-cites-past-end-bound, M1 fails three tests, not the one the form predicts alone (stop rule: a mutation that fails at another test than its prediction). The code and list commits are built and pushed. The record commit (step 4) is NOT made.

**Pushed head:** 7df4983f7dae524a85a468fabe98f75222e3aa1d, equal to origin's branch. Porcelain empty. No amend, rebase or force.

**Code commit eec3f1f6e2fd82c63811f2bedbc44adaacd9c510.**
- verify-cites.mjs: R1 to R3 as written, the list read into `cite.oldBound`, the two bound sites, `legacyListErrors` (first-parent walk plus shallow check), and `listErrors` returned and printed by main.
- governance-ci.yml: header comments R4 and R5 only.
- Seven new tests, by the form's names.
- Base failures: run with B's verify-cites.mjs (via `git show B:...` into scratch), the first three tests fail. So do the other four (the legacy-bound and list-history tests).
- No existing test was changed or removed. The reading shown: 43 tests pass at head.

**Enumeration (note 3, steps 1 to 8).**
- B = 07445119f4197358fe7308f522ceca513649c9f5, a clean scratch clone, checked out detached.
- The head's checker with no list finds 13 more than B's: 5 gated and 8 advisory.
- Base-only findings: 0. Shared reasons changed: 0. Tiers changed: 0.
- All 13 are just past the end of the cited file or its pin. All sit in filed records under state/consults/ (7 of them under state/consults/gates/). No STOP rule was met. No path:line tokens are written here.
- Re-run with the list: the head's gated and advisory arrays equal B's byte for byte (key, reason, order). listErrors 0.

**List commit 7df4983f7dae524a85a468fabe98f75222e3aa1d.** It adds scripts/plan/verify-cites-legacy-bound.json: 13 entries, 18 lines, sorted by path then cite. Code and list were pushed in one push.

**Mutations.** Each was applied exactly as the Tests+mutation line words it. Each ran the whole verify-cites test file and was reverted. After each revert the file's sha256 was 7ab4108ca1e95040b20047d166706b7de94d770282d24ead9aa364e0ff368b6f, equal to the committed file (observed at 7df4983f7dae524a85a468fabe98f75222e3aa1d).
- M1 fails 3 tests: `a_cite_to_the_line_just_past_the_end_of_a_newline_ended_file_fails`, `a_cite_to_line_1_of_an_empty_file_fails`, `a_cite_on_the_legacy_bound_list_passes_under_the_old_bound_only_from_its_listed_file`. The form says "alone". The stop is unavoidable by design: any test that proves M4 (an unlisted file's cite fails) also fails when the bound is read from `pieces`. The empty-file test fails under M1 for the same reason.
- M2 fails `a_cite_to_line_1_of_an_empty_file_fails` and `an_out_of_range_reason_for_an_empty_file_counts_0_lines`, as predicted.
- M3, M4, M5, M6 and M7 each fail only their own test, as predicted: M3 `a_pinned_cite_to_the_line_just_past_the_end_at_its_commit_fails`, M4 `a_cite_on_the_legacy_bound_list_passes_under_the_old_bound_only_from_its_listed_file`, M5 `a_pinned_cite_on_the_legacy_bound_list_passes_under_the_old_bound_at_its_pin`, M6 `the_legacy_bound_list_may_shrink_but_a_gained_entry_fails_by_name_even_at_the_same_count`, M7 `the_legacy_bound_list_check_fails_by_name_in_a_shallow_clone`.
- The file-top mutation (note 1, `<=` to `<`) fails only `an_exact_reference_to_the_last_line_of_a_file_is_in_range`.
- The custodian settles M1's wording (an amendment). I changed no word to fit. The scratch outputs are pb-w-mut-M1.txt to pb-w-mut-M7.txt and pb-w-mut-M0.txt, in the scratch folder.

**Scope.** git diff --numstat 07445119...HEAD gives 178 lines against the declared 150: yml 3+1, list 18+0, verify-cites.mjs 53+15, test 88+0. The record commit's seven `RECORDED MUTATION` comments would add more. This is an overrun for the custodian to report (class 8, full-form budget). I did not edit the form.

**OPEN-4 (information only).** The head checker plus the list ran over scratch exports of each tip; none was touched in its worktree. All four tips have 0 gated and 0 listErrors.
- b2-piece-1c-save-and-reopen (7109aeb2431d9ca9379cb15b0d027dba78a20217): 135 advisory, 72 not in main-at-B's set, in 22 files. None are just-past-end.
- port-2-macos-l1-and-app-dirs (83d2ecef8dba33017e47310d7fab8e2be5ee5123): 108 advisory, 45 not in main-at-B's set, in 19 files. None are just-past-end.
- first-batch-factorial-ignored-trace-tests (3c8e91f634246b620e8346b2d34acca597a6385e): 100 advisory, 31 not in main-at-B's set, in 12 files. None are just-past-end.
- fixture-s-regeneration-entry-point (d505a6054f6d80e4c778623db15b32ee192896a8): 75 advisory, 0 not in main-at-B's set.
- The extra advisories on the first three are older trees' own loose cites. I did not break them down by file.

**Checks at head 7df4983f7dae524a85a468fabe98f75222e3aa1d.**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, tests 568, pass 568, fail 0.
- `verify.mjs --offline`: rc 0, "verify:plan PASS".
- `verify-cites.mjs`: rc 0, "verify:cites PASS — every rooted (in-tree) path:line reference across 2442 file(s) resolves. (75 loose reference(s) advised above.)"
- `verify-quotes.mjs`: rc 0, "verify:quotes PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, ...". The first run hit my 100 s timeout (rc 124); the re-run with a 500 s timeout passed.
- `verify-test-claims.mjs`: rc 0, "verify:test-claims PASS — all 684 claimed test(s) across 209 file(s) exist or are planned, superseded or withdrawn".

**Self-check (the four classes).**
- No cross-module seam: all code sits in verify-cites.mjs, and its caller is main().
- Every completion claim above has a call behind it.
- The one new user-facing message is the shallow-clone FAIL text, and it describes behaviour implemented at this commit.
- All seven required tests reach their assertions, as the mutation runs show.

**Disclosures.**
- Scratch clones C:/dev/wt/pb-w-B (the base export) and the scratch folder files named pb-w-* are mine and can be deleted.
- I fetched the four branch tips' remote-tracking refs.
- The harness reports my model as Sonnet 5.5 (claude-sonnet-5-5). No override. No context handoff received or produced.

**Exact state left.** C:/dev/wt/pb is clean at 7df4983f7dae524a85a468fabe98f75222e3aa1d, equal to origin/cut/verify-cites-past-end-bound. No PR action.
