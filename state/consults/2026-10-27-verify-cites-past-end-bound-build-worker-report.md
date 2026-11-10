*Custodian's filing note (2026-10-27): the worker's second hand-back on `verify-cites-past-end-bound` (PB), resumed after the custodian's settlement of its stop (`state/consults/2026-10-27-verify-cites-past-end-bound-worker-stop-report.md`): the record commit (1043a783, the seven RECORDED MUTATION comments, comments only, M1's naming the three tests it failed), the checks again at the head, and the final figure. The custodian's check by git: the head equals origin's branch; the record commit adds 7 lines, each a RECORDED MUTATION comment; the numstat from 07445119 is 185 lines over the 4 files of the Scope; the scratch clone is gone. The run 20:33:55Z to 20:49:36Z by its transcript (Write 3, Bash 14, Edit 1). Extracted by script from its second SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 069ad0ebc9a927f42adeea10aea836e442af8116b971305c855505b5223be27a.*

---

Built: verify-cites-past-end-bound at 1043a783db52adc4b1ec874f3837908adf72a236

Commits on cut/verify-cites-past-end-bound (base 07445119f4197358fe7308f522ceca513649c9f5):
- eec3f1f6e2fd82c63811f2bedbc44adaacd9c510 is the code commit: verify-cites.mjs, the seven tests, and the R4/R5 yml header comments.
- 7df4983f7dae524a85a468fabe98f75222e3aa1d is the list commit: scripts/plan/verify-cites-legacy-bound.json, 13 entries, found by the enumeration in my first report.
- 1043a783db52adc4b1ec874f3837908adf72a236 is the record commit: the seven RECORDED MUTATION comments, comments only.

The record commit was pushed in its own call. Its message file held one `@`, in the Co-Authored-By trailer line.

**Seven RECORDED MUTATION comments, as committed (each is one line; the text below is copied from the commit's diff by `git diff | grep`, not retyped):**
```
// RECORDED MUTATION (M1) at 7df4983f7dae524a85a468fabe98f75222e3aa1d, applied alone and reverted: checkCitation's bound read from `pieces` again -> fails by name: `a_cite_to_the_line_just_past_the_end_of_a_newline_ended_file_fails`, and two other tests: `a_cite_to_line_1_of_an_empty_file_fails` and `a_cite_on_the_legacy_bound_list_passes_under_the_old_bound_only_from_its_listed_file`.
// RECORDED MUTATION (M2) at 7df4983f7dae524a85a468fabe98f75222e3aa1d, applied alone and reverted: the empty-file term in countOf dropped -> fails by name: `a_cite_to_line_1_of_an_empty_file_fails`, and `an_out_of_range_reason_for_an_empty_file_counts_0_lines`.
// RECORDED MUTATION (M3) at 7df4983f7dae524a85a468fabe98f75222e3aa1d, applied alone and reverted: checkPinned's bound read from `pieces` again -> fails by name: `a_pinned_cite_to_the_line_just_past_the_end_at_its_commit_fails`, and only this one.
// RECORDED MUTATION (M4) at 7df4983f7dae524a85a468fabe98f75222e3aa1d, applied alone and reverted: the list lookup keyed by the cite alone, without its citing file -> fails by name: `a_cite_on_the_legacy_bound_list_passes_under_the_old_bound_only_from_its_listed_file`, and only this one.
// RECORDED MUTATION (M5) at 7df4983f7dae524a85a468fabe98f75222e3aa1d, applied alone and reverted: checkPinned's old-bound term removed -> fails by name: `a_pinned_cite_on_the_legacy_bound_list_passes_under_the_old_bound_at_its_pin`, and only this one.
// RECORDED MUTATION (M6) at 7df4983f7dae524a85a468fabe98f75222e3aa1d, applied alone and reverted: the subset check replaced by a count comparison -> fails by name: `the_legacy_bound_list_may_shrink_but_a_gained_entry_fails_by_name_even_at_the_same_count`, and only this one.
// RECORDED MUTATION (M7) at 7df4983f7dae524a85a468fabe98f75222e3aa1d, applied alone and reverted: the shallow-clone check removed -> fails by name: `the_legacy_bound_list_check_fails_by_name_in_a_shallow_clone`, and only this one.
```
The first draft of these comments came out garbled (my template escape was wrong). I reverted it with `git checkout -- scripts/plan/verify-cites.test.mjs` before committing, so no bad version was ever committed.

**Checks at head 1043a783db52adc4b1ec874f3837908adf72a236 (exit code, last line):**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0; tests 568, pass 568, fail 0.
- `verify.mjs --offline`: rc 0; "verify:plan PASS — C:\dev\wt\pb\PLAN.yaml agrees with the repository."
- `verify-cites.mjs`: rc 0; "verify:cites PASS — every rooted (in-tree) path:line reference across 2442 file(s) resolves. (75 loose reference(s) advised above.)"
- `verify-quotes.mjs`: rc 0 (it took several minutes); "verify:quotes PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 878 ruling cites resolved, 0 ruling-cite erro…". The line was cut at 260 characters by my `cut`.
- `verify-test-claims.mjs`: rc 0; "verify:test-claims PASS — all 684 claimed test(s) across 209 file(s) exist or are planned, superseded or withdrawn (50 planned, 11 superseded, 17 withdrawn, advisory)."

**Scope.** `git diff --numstat 07445119...HEAD` (insertions, deletions):
- .github/workflows/governance-ci.yml: 3, 1
- scripts/plan/verify-cites-legacy-bound.json: 18, 0
- scripts/plan/verify-cites.mjs: 53, 15
- scripts/plan/verify-cites.test.mjs: 95, 0
- Total: 185 lines against the declared 150, an overrun of 35. It is the custodian's to report, as instructed; I trimmed nothing.

**Final state.**
- `git status --porcelain` is empty.
- HEAD and origin/cut/verify-cites-past-end-bound are both 1043a783db52adc4b1ec874f3837908adf72a236.
- The scratch clone C:/dev/wt/pb-w-B is removed (`ls` reports it does not exist).
- My other scratch files, named pb-w-*, are in the scratch folder.
- Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.
- All other findings (enumeration, OPEN-4, the M1 deviation) are in my first report; nothing in it changed.
