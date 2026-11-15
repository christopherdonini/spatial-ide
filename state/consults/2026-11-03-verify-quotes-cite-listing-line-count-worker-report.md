*Custodian's filing note (2026-11-03): VQ, `verify-quotes-cite-listing-line-count`, built by a worker on `cut/verify-quotes-cite-listing-line-count` from ab9b52ab, head 077681ed, under its full form (`governance/forms/scripts/VERIFY-QUOTES-CITE-LISTING-LINE-COUNT-PREREGISTRATION.md`). The custodian's check by git: origin's branch is at 077681ed, three commits past ab9b52ab, scripts/plan/verify-quotes.mjs +5/-3 and its test +25/-6, 39 lines against the declared 70. The run 11:35:15Z to 12:29:16Z by its transcript (Bash 39, Edit 8, Read 4, Write 4; three commits and one push, no reset, rebase, merge, amend, force, PR action or claude command). Its scratch files, each named from vq-, were written in the system temporary folder, not in a scratch folder of the session's: disclosed, no effect on the branch. Its wait loops each have a fixed bound and sleep 5 s per turn; the one it calls ill-formed ends at once when no node process is listed. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is fcb4e123ea5a6a9c7641606fb0cf8e993aa472d39914c9c665a3a7d66ad59837.*

---

Built: verify-quotes-cite-listing-line-count at 077681ed74fe50c4f8f26017978ed0bcc6ca40d2 (branch cut/verify-quotes-cite-listing-line-count, pushed, origin equals HEAD, porcelain empty).

Commits (all `git commit -s`, no `@` in the message files outside the Co-Authored-By trailer line, shown by grep each time):
1. d8369ef8425d2516e36a4aa876530507ce136958 fix: ... the cite listing bounds and prints the file's true line count
2. 0f6800fc0c86066f775c60b8bec113c9403e254f test: ... the just-past-end line and an empty file's line 1 are out of range
3. 077681ed74fe50c4f8f26017978ed0bcc6ca40d2 test: ... the recorded mutations M1, M2, M3 and the guard removal

Change: listCiteContents' single-candidate branch (line 1085 at B) now reads the text once (`candText`), splits it, computes `count = lines.length - (candText === '' || candText.endsWith('\n') ? 1 : 0)` with a one-line comment "verify-cites' countOf", guards on `c.startL > count` and prints `count`. At head the branch is at lines 1085-1090. The change is 5 insertions and 3 deletions in the .mjs. No export or signature change; header and docstring not edited. Interface read first: countOf in scripts/plan/verify-cites.mjs (line 278 at B; the form pinned 274-277), not edited or imported.

Step 1 (at B): 68 of 68 pass. T3 asserted "4 lines", with its comment reading "has 4 lines".
Step 2: after commit 1, `node --test` over plan, hooks and evidence: 594 of 594 pass.
Tests (base outcome by name, with the base .mjs written over the worktree copy; restored from commit 2 and shown byte-equal, sha256 c1364f7d...fb48):
- T1 `a_cite_listing_reports_the_line_just_past_a_newline_ended_files_end_as_out_of_range` (three-line newline-ended file, cite line 4, expects `out of range (file has 3 lines)`): fails at base.
- T2 `a_cite_listing_reports_line_1_of_an_empty_file_as_out_of_range` (empty file, cite line 1, expects `... has 0 lines`): fails at base.
- T3 (changed from 4 to 3 lines, nothing else): fails at base.
- Base failed exactly those three of 70. At commit 2, 70 of 70 pass.

Mutations, each applied alone on commit 2, test file run, reverted, file byte-equal to commit 2 by sha256 each time. Observed failures match §4's table with no other test failing:
- M1 (`c.startL > lines.length`): T1 and T2.
- M2 (`candText === ''` term dropped): T2 alone.
- M3 (note prints `lines.length`): T1, T2 and T3.
- Guard removed (`if (false)`): T1, T2 and T3. T3 got `(blank line)` where it expected `out of range (file has 3 lines)`. The old comment's `''` was therefore wrong; the new comment records the observed `(blank line)`.
Commit 3's RECORDED MUTATION comments (M1 above T1, M2 above T2, M3 and guard removal above T3) name commit 2's 40-hex id and the observed failing tests only. No verify-mutation run is called an observation.

P3: `verify-quotes.mjs` with no flag, base copy against head over the same tree. I ran the base script as an untracked copy so the scanned tree stayed constant, then deleted the copy. Both exit 0 with identical 38-line output (cmp identical).
P4 (OPEN-3): the same two scripts with `--show-cites` over one tree, both exit 0. Compared by node script: 8808 rows in each, same rows (relPath, citeLine, target, hashMark), non-row lines equal. Class (i) (out-of-range count one lower): 8. Class (ii) (blank at base, out of range at head): 0. Identical: 8800. Other: 0. A raw diff of the two files also shows exactly 8 differing lines. No STOP.

Size: `git diff --numstat ab9b52abf15e...HEAD` gives 5/3 on the .mjs and 25/6 on the test file, 39 in total over 2 files, against the declared 70. No overrun.

Checks at head (exit code, last line):
- `node --test` plan, hooks and evidence: rc 0, 596 tests, 596 pass, 0 fail.
- verify.mjs --offline: rc 0, "verify:plan PASS".
- verify-cites.mjs: rc 0, "verify:cites PASS ... 2569 file(s)".
- verify-quotes.mjs: rc 0, "verify:quotes PASS — 134 checked, 103 verified, 30 baselined, 1 advisory...".
- verify-test-claims.mjs: rc 0, "verify:test-claims PASS — all 708 claimed test(s)...".
- verify-mutation.mjs: rc 0, "verify:mutation PASS — all 2 new test(s) have a recorded mutation naming them." (a floor).

Pre-gate four classes:
- Cross-module seam: none. The change is inside one file and does not call verify-cites.
- Completion claims: each points to a run in this transcript.
- User-facing message: the out-of-range note prints the count the code now computes.
- Required tests: T1, T2 and T3 reach their assertions (they fail at the base on the assertion, by name).

Stop rules: none met. Files touched are the two in Scope only. Only T3's text changed among existing tests, and none was removed. No red-line item, no Guardian or harness refusal. One Edit of mine first failed because I had not read the file. I made it again after reading; no effect on the record. One of my wait loops was ill-formed. It ended on its own, and no process of mine is left.
Off-scope noticed, not done: the adjacent empty-text count in the hash check's slice, which the form already names as outside Scope.
Background shells: none still running. All started shells completed.
Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports; no override; no context handoff received or produced.
