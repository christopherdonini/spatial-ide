VERDICT: PASS
Reviewed cut/port-1-linux-l1 @ 483661b. PR #164, gate 2, architect.

Convention: everything below is paraphrase unless marked quoted. I computed no hash. The reviewer recomputes every hash and recounts every figure.

## S1 (blocking)

None.

## S2 (merge conditions, all outside the branch; no branch edit is needed)

1. **Amendment 2's references must resolve on main before #164 merges.** In the main checkout's status at session start, the two gate-1 reports that Amendment 2 item 2 cites by path were staged but not committed. The `cfg-boundary-read-errors` node that item 3 names was in an uncommitted change to PLAN.yaml. Commit both to main before the click, and have the reviewer confirm. Otherwise a record on main names a file and a node that no commit holds. They are evidence and routing, not Authority, so round 14's standing rule does not fire. Resolvability is the issue.
2. **The superseded index's workflow rev needs a check.** Amendment 2 item 5 names `.github/workflows/product-ci-rust.yml` "at a886894". My gate-1 cites were at eddcb28. The reviewer should confirm that the runner-choice sentences and the comment's position are the same at a886894 and eddcb28. If any of that text came in at a later commit, the index points at the wrong rev. It should then name the introducing commit, or eddcb28, in the closing record (one row, no restatement, round 12 (d)).

## Judgments

**1. My gate-1 S2 items 1 to 3: all discharged.** I resolved each against the branch head and against main's merged text (main carries eddcb28 through 25b57c4).
- **S2-1.** Line 20 of `scripts/plan/cfg-boundary.mjs` at 483661b now ends at the architect-reviewed change. The clause about the piece that needs an entry is gone. The header now says what §2 item 3(e) says and nothing more, and it no longer conflicts with PORTABILITY's PORT-2 row.
- **S2-2.** Lines 37 to 43 of `.github/workflows/product-ci-rust.yml` at 483661b:
  - The pin sentence now says the version pin fixes the OS release only and that the image's contents can still change. That is §1's may-not-claim on the runner image, stated as a limit.
  - "Catches" now carries the conditional: only the assumptions the suite exercises. That is a consequence of may-claim 1 and nothing more. It is consistent with §1's may-not-claim on separator and case assumptions that carry no cfg.
  - The two named sites are now "places where such assumptions have surface". That softens the old wording and claims no coverage of those sites.
  - The profile-step sentence matches §2 item 1's step.
  - No new claim, no quotation (§8 item 14).
- **S2-3.** At 483661b, `Runner profile (Linux)` sits directly after the cache step, and the build comment sits directly above `Build the workspace and every test target`. Step order and every step body are the same as at eddcb28, so §8 item 1 stays clean.
- Amendment 2 item 2's "answers gate 1" is a discharge claim (round 7). It names the commit 859375c and both files, and I resolved it line by line as above.
- **Not in scope of this round** (no finding): line 29's "test targets" sentence is incomplete after Amendment 1 item 3 (the reviewer's gate-1 N1). KNOWN-LIMITATIONS 1's wording covers the two unit tests.

**2. Amendment 2 is sound as a record.**
- **Class 1 is correct.** Gate 1's findings are this round's results, and the amendment records what they supersede (round 15 (g)). It is not class 2, because no prediction differs. It is not class 3, because no record cite or test text is fixed. It is not class 9, because S2-4 is routed out, not added, so no code of an addition lands.
- **Post-result marker.** It is present, in Amendment 1's shape, which gate 1 accepted (§8 item 17, last clause).
- **References only.**
  - It has no `path:line`, no hash, no quotation, no bare self-line, and no hash at a branch commit (round 15 (e)).
  - It has no test-text span (round 25, item 2 (d)) and makes no claim about verify-mutation (round 25, item 2 (c)).
  - The prose sentence on the step move is acceptable, because this is not the closing amendment.
  - Item 1 names the second PR only as "a second PR". The closing record names #164.
  - The 08:01:40Z timestamp is for the reviewer to resolve.
- **§7 (round 25, item 2 (a)).**
  - The round's figure is 21 lines over 2 files, counted at 859375c against eddcb28. My hand count of the two diffs agrees: 2 lines in the script header, 11 in the runner-choice paragraph, and 8 for the moved block. The reviewer recounts.
  - Both files are on §7's list, and §7 is unedited.
  - The cumulative figure stays far under 750 lines and 13 files.
- **Routing.**
  - S2-4 goes to a node (correct). The narrowing needs a stderr line that §7 does not declare, so it cannot be done inside this piece.
  - "Items 5 to 8 go to the closing record and to the template's next change" is a group routing, but it can be resolved: 5 goes to the template's next change, and 7 and 8 go to the closing record. Item 6 (T1 coupling) really belongs to PORT-2's form, not to this closing record. Note it there, as with my gate-1 N5. Not a finding.
- **Superseded index.** It is present and ends the round (round 12 (e)). The script entry at 824d561 is consistent with the reviewer's "unchanged since 824d561". For the workflow rev, see S2-2 above. "No other line is superseded" is right: Amendment 2 corrects nothing in Amendment 1.
- **Record-correction count.** This is round 1 of the record cap's two.

**3. PORT-1's closing record on main, written after #164 merges.** References only. The record cap's closing-amendment rule applies: references and hashes, no prose restating them.
1. **The first line** marks it post-result.
2. **The merges.**
   - #162: merge commit 25b57c4, head eddcb28.
   - #164: its merge commit, head 483661b.
   - Both are merge commits (§2 item 9, §8 item 12).
   - The window from 25b57c4 to #164's merge carried the pre-round comments. Name both commits, with no claim attached.
3. **E1 and E2:** cite Amendment 1, items 1 and 4.
4. **E3a and E3b:** run ids 37103210808 and 37103232248, the probe commits e03da5f and 840f93b, and the probe's deletion. Amendment 1 does not carry E3, so the closing record must. Cite the worker's report and the reviewer's gate-1 report by path.
5. **E4, per §4:**
   - the product-ci-rust and governance-ci push run ids at 25b57c4, both entries and `cfg-boundary`;
   - also the push runs at #164's merge commit.
   - If either is red, follow §4's E4 rule: answer it before any Rust dispatch, and the next PR withdraws KNOWN-LIMITATIONS 1's Linux line.
6. **The final §7 figure.** Use §7's own command with the base named explicitly as b43c0eb (the piece's original merge-base), at 483661b, against 750 lines and 13 files. After 25b57c4, a computed merge-base resolves to eddcb28 and counts the round only. Any overrun is class 8, and §7 is never edited (round 25, item 2 (a)).
7. **M1 to M7, each with its observation commit:** the worker at 824d561 (the test file's RECORDED MUTATION comments) and the reviewer at eddcb28 (gate-1 reviewer report, item 2). No verify-mutation run is named as an observation (§4, §8 item 15, round 25, item 2 (c)).
8. **P1's record (§2 item 0):** hand-back 1, filed at e2bba91, before code commit a886894. Cite it by path (reviewer gate-1 S2-7, my gate-1 point (a)).
9. **Amendment 1 item 3's owed report** of the unlisted compile-out: where it was filed, by round and item if it is a question round, otherwise by path.
10. **The four gate reports** under `state/consults/gates/`, gates 1 and 2, architect and reviewer, by path. Each Reviewed line names its commit.
11. **The routed items:**
    - the `cfg-boundary-read-errors` node id;
    - the template's blank-separator change (reviewer S2-5, my gate-1 N3);
    - the T1 coupling and the P3 set-difference method, for PORT-2's form (reviewer S2-6, my gate-1 N4 and N5).
12. **Any tool claim names the tool's commit** (round 15 (c)). Any hash pin is at a commit on main (round 15 (e)). 859375c and 483661b are on main only after #164's merge commit.
13. **The PLAN node** `port-1-linux-l1` moves to done, naming #162 and #164, with the PR set only in the done commit.

## N

1. The re-wrapped line 42 of the workflow is short. That is cosmetic, and fixing it is not worth a round.
2. After #164, every new note in the workflow's runner-choice paragraph should stay a limit on a claim, never a capability.

## ADR

None needed.
