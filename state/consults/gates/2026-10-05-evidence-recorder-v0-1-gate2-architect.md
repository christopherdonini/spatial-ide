*Custodian's filing note (2026-10-05): PR #177's gate 2, the architect, a scoped re-gate under `AUTONOMY.md` §22 of the form's Amendment 5, after correction round 1 of 2, for PLAN node `evidence-recorder-v0-1`, under the tag node:evidence-recorder-v0-1@g2. Reviewed: cut/evidence-recorder-v0-1 @ 05fc645d64c6c59b1f682f04f585e72243f8a272, form at f74b0487e30cee79c5d43677c2cbd45d4208e0f3 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is a93254494203ae2da88e435c076f771dc48985871808b4c5146e01f2da73024c. Write audit PASS: zero write calls (Read 6, Grep 3, SubagentHandback 1). Run window from the transcript: 2026-10-05T11:53:24.498Z to 2026-10-05T11:54:49.516Z. The architect read the form in the main checkout and the test file in the read-only export `C:/dev/wt/rec01-head-05fc645d`. Profile paths redacted at filing: none.*

---

Reviewed: cut/evidence-recorder-v0-1 @ 05fc645d64c6c59b1f682f04f585e72243f8a272 (form at f74b0487e30cee79c5d43677c2cbd45d4208e0f3)

**Verdict: PASS** (architect, gate 2, `node:evidence-recorder-v0-1@g2`; scoped to the form's Amendment 5, AUTONOMY.md §22). There are no S1 or S2 findings, and four N findings. My gate-1 PASS stands. My closing-record list changes in two places.

Read: the form on main at f74b0487, Amendment 5 and the A2-1 text it supersedes (§4's T24 row, A2-1's §4 T24 method bullets, and A2-1's §8 items 17 and 18); both gate-1 reports; `docs/PREREGISTRATION-TEMPLATE.md`'s class list; and the test file in the read-only export `C:/dev/wt/rec01-head-05fc645d` (taken to be 05fc645d). Nothing was run. Unquoted text is my paraphrase. Line numbers, hashes and the ba42e6f7 line are for the reviewer to recompute.

## Item 1, against the reviewer's S1-1, remedy (a)
- **Round 12 (d) shape: met.** Item 1 has three sentences: the defect, the corrected reference and the proof, in that order. It restates no earlier amendment's claim. It names the one-word difference, so a reader can resolve the defect without the built text being reproduced. That fits round 12 (b)'s rider.
- **Class 2: met.** A test built under a name other than its registered §4 row is a deviation from a registered row. That is class 2 under the template's class 2 definition (`docs/PREREGISTRATION-TEMPLATE.md:106-109`). The amendment's heading carries the class, as remedy (a) asks.
- **Round 25, item 2 (d): met.** The built test is named by path and line at the branch commit ba42e6f76117… and at the head 05fc645d…, each with its full commit id. There is no hash pin at a branch commit. The reference sits on one line of the form (round 15 (d)).
- **The reference resolves.** In the export, the test at `tools/mods/spatial-evidence-recorder/test/recorder.test.ts:723` carries the built name, ending in `unavailable fields and runs the command at once`. Its RECORDED MUTATION comment directly above (lines 719-722) names the observation commit ba42e6f76117, which agrees with "the mutation and observations recorded at ba42e6f7". The reviewer recomputes line 698 at ba42e6f7. The reviewer's D9 reading says only comment lines differ between the two commits, which is consistent with a shift of 25 lines.
- **The proof resolves** to the reviewer's gate-1 report, which the preamble names by path: its S1-1 fixed-string search (0 hits for the declared name) and its mutation table's T24 row, observed at 05fc645d.

## Item 2, against the reviewer's S2-1
- **Met.** Item 2 records §8 item 18 (added in A2-1) as held by reading, through the abort in raceBefore's `finally`. It names probe P-abort as surviving and says in so many words that the condition is not claimed as tested. Nothing in it reads as a test claim.

## Superseded index
- **Met.** It supersedes §4's T24 row name, for the built test, and A2-1's statement that T24's name is unchanged. It refers to them by section and amendment, not by line, which is the form round 14 requires for a self-reference. The citations "line 262" and "line 498" in your brief would have been bare self-lines in the record. The scope is exact: A2-1's same sentence also says the mutation is unchanged, and that half is left standing, correctly.

## N
- **N1 (my gate-1 miss).** At gate 1, my reading of §8 item 11 checked each new test's RECORDED MUTATION comment but not its name against §4's table. So I passed the head without catching S1-1. The verdict on the code is unaffected. The miss is disclosed here, not raised as a new class (record cap).
- **N2 (item 2's class).** Item 2 records a property held by reading. No registered prediction deviated from, so it is closer to class 1 (a post-result record) than to class 2. The heading's single class 2 label covers it. No claim changes either way, so nothing is misread. Not blocking.
- **N3 (item 2's paraphrase of item 18).** Item 18 names two conditions: the sleep left live past the race, and the sleep left live into `next`. Item 2 paraphrases only the second, in round 56's words. The same abort holds both, and P-abort leaves both untested. The closing record, if it refers to this, should cite §8 item 18's first clause by reference rather than repeat the paraphrase.
- **N4 (the word "the head" in item 2).** "The head" in item 2 is register.js code, not test text, and item 1 defines it by full id. Round 25, item 2 (d) is not engaged.

## Closing-record list: changes to gate 1's list
- **Item 3:** add both gate-2 reports, by path under `state/consults/gates/`.
- **Item 1 (merge commit):** unchanged, with one more reason it matters. Amendment 5 item 1 names ba42e6f76117 and 05fc645d by id, so the merge commit must keep both reachable. It already does, as long as the merge is a merge commit (§8 item 14).
- **My gate-1 N3** (no test pins the abort) is now carried by Amendment 5 item 2. It needs no closing item.
- **My gate-1 S2-1 (claim 5), S2-2 (claim 6) and N1 (D7 in the merge-approval request):** unchanged. Nothing in Amendment 5 bears on them. Item 5 of the list stands as written.
- **Record count:** Amendment 5 is correction round 1 of 2. If a second round is needed, it is the last; after it the architect reduces the record (record cap).

No ADR is needed.
