# PR #204 gate 1 — architect
Reviewed: cut/e2e-stale-expectations-reaim @ ef1cc519c913a2bbc5d28a86530c579fae0f3ed6

**Verdict: pass with notes.** Correctness passes and Evidence passes. There are three Documentation findings (D1 to D3), and each must be fixed in this PR before the merge, with no re-gate.

I had no shell, so I made no git diff and no hash recomputation. The reviewer recomputes the span hashes and the KNOWN-LIMITATIONS byte check. I read the PR body from the custodian's draft of it, not from `gh pr view 204`, so the reviewer confirms that the live body matches that draft. All branch lines below are cited at ef1cc519, without a hash (round 25, item 2).

## The form, §1 to §8

- **§1.**
  - The only product path in the diff is `engine/src/fixture.rs`: the §2.6 (A) variant and the doc-only `ForeignKeyColumn` correction, which Amendment 2 item 5 lists.
  - Nothing is measured.
  - The evidence class is E2E-verified.
  - The session-tier claim is limited to what the shell renders.
  - **The source-changed claim stays inside its limits:**
    - it covers route `pre` only (`source-changed.mjs:265`; `post` and `reopen` keep the mtime touch at 868-884);
    - it covers a directory junction only (270-278);
    - the refusal is asserted from the pre-check's own `tile-stream-mint-refused` line (934-941).
    - It does not reach a file symlink, a rename above the grandparent, or the other routes. This matches KNOWN-LIMITATIONS item 26 (`KNOWN-LIMITATIONS.md:297-302`).
  - HEXLIM′ asserts the key list only (`console.mjs:449-454`).
  - The KNOWN-LIMITATIONS paragraph matched line 27 of the 2026-10-09 rulings-additions directive as a whole line, by a regex check. The reviewer confirms the bytes.
- **§2, step by step.**
  - C2′/C3′ (`regression.mjs:2406-2431`, 2678-2690), MAP′ and BOTHNEEDED′ match §2.1 and §2.2.
  - REFUSAL′ (`console.mjs:487-516`) and the arm readback (909-915) match §2.3.
  - The junction layout and the S3/S4 steps (`source-changed.mjs:259-288`, 845-943) match §2.4.
  - The generators (`kernel/tests/manual_walkthrough_fixtures.rs:477-601`) and the variant match §2.5 and §2.6.
  - **GROUP′ matches Amendment 2 item 2** (`console.mjs:252-300`, 649-710):
    - the keys, items and window;
    - `GROUP_CALLS`;
    - presence, capacity, (a) group, (b) split run with the item before the window, (c) and (d) parse;
    - the step-7 report.
  - The name at `console.mjs:277` is the ruled name, `state/directives/2026-10-09-round-71-and-round-70-paste.md:6`, with the `GROUP': ` prefix. Item 12.5's reading is implemented at 697.
  - Capacity is checked before presence (671 before 676). That follows §2.3 step 5. Worker report 2's line 40 orders them the other way, which is harmless.
- **§3 and P4.**
  - F-A and F-C are equal to their predecessors (`state/consults/2026-10-10-e2e-stale-expectations-reaim-worker-report-2.md:111-112`).
  - F-B and F-D behave as §3 predicts (`state/drafts/e2e-stale-expectations-reaim-solo-runs-h/wa-admission-2.log.txt:9,11`).
- **§4 and P6.**
  - M1 to M8 and M10 to M12 were observed at cf2434e6 (report 1, lines 144-162).
  - M9, M9c, M9n, M9g and M9s were observed at H (report 2, lines 62-71).
  - M13 was observed at H (report 3, lines 60-68).
  - No `verify-mutation` run is called an observation.
- **§5.**
  - P1: see Amendment 2 item 7 below.
  - P2′: there is 1 distinct text in each of the five solo runs.
  - P3: R=9.
  - P5: the pan rung gives 17→19, and the pre-check detail is `{mtime}` (`wa-source-changed-3.log.txt:7-8`).
  - I3 fired at cf2434e6, and round 71 resolved it. I6′ fired once, and Amendment 3 resolved it. No invalidator fired at H.
- **§6.** Every quantity is an assertion.
- **§7.**
  - The figures are 700 of 860, with 9 files.
  - `console.mjs` stands at 235 of 220. That overrun is recorded as class 8 in Amendment 3 item 7, inside Amendment 2 item 8's 290.
  - §7's line still reads 220. No §7 line was edited.
- **§8.**
  - Items 1 to 18 hold on the code: no arm is set, no fixed-sleep wait is used, no header is counted, and the link handling is `unlinkSync` plus `"junction"` only.
  - Item 18: GROUP′ code 52228d5b follows the merge 71702f90, which carries the amendment.
- **Operation class.** This is e2e and test support, with no ADR-006 surface and no undo surface.
- **Caller rule, §2.6 [R111].**
  - `StringIdsBesideParcelKey` (`engine/src/fixture.rs:546-548`) sits in the feature-gated test-support module (`fixture.rs:4`).
  - Its callers are the generators at `kernel/tests/manual_walkthrough_fixtures.rs:510,595`.
  - It holds under the precedent at `fixture.rs:194-195` and the human's OPEN-1 (A) ruling (Amendment 1 item 2).
  - The seam is proven end to end from the real shape by MAP′ (b) and BOTHNEEDED′ (b) (`wa-admission-2.log.txt:9,11`) and by C2′/C3′ (b) (`wa-regression-1.log.txt:26`).
  - **Item 5's list checks out** against `fixture.rs`:
    - B1 is at 627-629, B2 at 634-636, B3 at 1101-1104, B4 at 1169-1171 and B5 at 1174-1176;
    - the wildcards are at 631, 1105 and 1172;
    - no other line matches on the mode.

## Amendments

- **Amendment 2 item 6 (T1 to T4).** Each claim rests on the reports' figures.
  - T1: report 2, lines 105-114.
  - T2:
    - The first result is at report 2, lines 118-140.
    - The re-run gives 359 against 359 keys with 0 differences, and src-tauri gives 20 against 20 with 0 differences (report 3, lines 10-11, 37 and 57-58).
  - T3: report 2, lines 150-153.
  - T4: report 2, lines 89-99 and 116. The limits of T4 are D1.
  - T3's after-check predates report 3's runs. The human's term 4 ("stand as run") and report 3's §8 item 17 cover it, so no action is needed.
- **Amendment 2 item 7 and P1.**
  - P1 rests on the solo runs at H:
    - window A: regression, admission and source-changed each exited 0 (`state/drafts/e2e-stale-expectations-reaim-solo-runs-h/window-a-hold-output.txt:6,14,22`);
    - window B: the five console runs each exited 0, with GROUP′ and REGRESS′ PASS (`window-b-hold-output.txt:7,12-13,19,24-25,31,36-37,43,48-49,55,60-61`).
  - The worktree was clean after every run.
  - Every window held one item, so the split path is unobserved solo, as the README states (`README.md:5`).
  - The exe was built at the merge commit. The commits after it change only `console.mjs` and the e2e README, so no product file changed between that build and H.
- **Amendment 3 meets each term of the human's ruling** (`state/directives/2026-10-10-reaim-t2-base-f0fccfaf-filter-identity-no-shell-run-guidance-node.md:6-12`):
  - Term 1: the class-2 record, with the 11 keys and the three commits.
  - Term 2: the re-run used the f0fccfaf base for both halves. The patch sha256 matches (report 3, line 17).
  - Term 3: item 4 states the identity check with its command. Report 3 also ran it (line 22).
  - Term 4: M13 ran at H.
  - Term 5: the re-run found 0 differences, so I6′ did not fire again.
  - Term 6: the solo runs at H were done.
  - The base run's one failure was not recorded as a failure. It was re-run alone and passed (`state/drafts/two-shared-run-failures-solo-2026-10-10/README.md:7-9`).
- **The worker reports' differences from the form:**
  - Report 1's differences 1 to 3 are accepted by Amendment 2 item 9.
  - Report 1's differences 4 to 7 change no prediction.
  - Reports 2 and 3 used `--no-fail-fast`, which runs a superset of the tests.
  - The early worktree removal, the `polygons-100k` substitution and the not-covered files are covered by the human's "T4 stands as run". The PR body does not disclose them; see D1.

## Documentation findings (must fix before the merge)

- **D1. The PR body's fixture claim does not state T4's limits.** The body says each existing fixture's bytes are shown unchanged, but its T4 line names only `make-fixture`'s equal output.
  - **What it leaves out:**
    - `polygons-100k` was compared through `make-fixture` with the same `FixtureSpec`, not through its producing test (report 2, lines 93-96);
    - three on-disk files are not covered (report 2, lines 97-99). I found no Rust or e2e producer naming them at ef1cc519.
  - **Why this is not an Evidence finding:** neither tree writes those files, so no byte the branch writes goes unproven.
  - **The fix:** state the scope (round 15 (b)). In the same line, name the T3 timing and `--no-fail-fast`.
- **D2. A stale comment in the renamed generator.** At `kernel/tests/manual_walkthrough_fixtures.rs:554-563`, the paragraph kept from the old generator still describes the same filename, the both-remediations intent, and no change being needed in `stepBothNeeded`. That contradicts lines 549-552 and §2.5's F-C row.
  - Editing this file breaks Amendment 2 item 6's precondition (`git diff --quiet cf2434e6 H -- …`) and item 10's declared-unchanged list.
  - **The fix:** record it in the PR body as handed to `stale-test-names-and-comments`. The human's 2026-10-10 ruling places that node after the re-aim merges, and it covers test files.
- **D3. Two wrong statements in the PR body and the walkthrough.**
  - **The F-D row, `frontends/shell/MANUAL-WALKTHROUGH.md:512`:** it says the new file was re-aimed from an absent key. That text was carried over from the old row, and F-D never had an absent key. Fix the wording; this is inside the 60-line ceiling.
  - **The PR body's "M1 to M12, at cf2434e6":** M9 and M9c at cf2434e6 tested the superseded GROUP′. Write M1 to M8 and M10 to M12 at cf2434e6, and M9 and M9c (in their new text) at H.

## Note (no class, no action for this merge)

- **Off Windows, a symlink is made before S3's platform check.** `source-changed.mjs:596-603` lays out the junction before S3's platform check at 846-848. Off Windows, Node ignores the `"junction"` type and makes a symlink before S3 fails by name. §2.7 runs these suites on Windows only, so this cannot happen today. Move the check ahead of the layout when PORT-3 or PORT-4 opens the shell e2e suites off Windows.

No ADR is needed.
