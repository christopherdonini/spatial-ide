# PR #195 gate 1 attempt 2 — architect
Reviewed: cut/shell-migration-milestone-1 @ ae704f0abc924bde7a6f912a853f039dfca66114

**Verdict: pass with notes.** I found no Correctness or Evidence finding. There are six Documentation findings, and each must be fixed in this PR before the merge, with no re-gate. Under `AUTONOMY.md` §22's three verdicts: Correctness passes, Evidence passes, and Documentation has the must-fix items N-D1 to N-D6 below.

**How I read it.** I have no shell. I confirmed the head from the branch ref (`.git/refs/heads/cut/shell-migration-milestone-1` = ae704f0a), and read the code in C:/dev/wt/m1. Line numbers below are at that head. The form, the directive and the reports were read on main.

I could not do these, so the reviewer must:
- recompute Amendment 10's hash and the hashes in the filing notes of reports 8 and 9;
- confirm that the commits named in Amendment 9 item 7, and aad1ba72, are on main;
- recompute Amendment 11's §7 figures;
- confirm the PR body's sentence that the main merges touched nothing under `frontends/shell/src` or `e2e`.

R-E3 still needs a green CI run at ae704f0a before the merge (Amendment 9 item 6). That is the custodian's to settle; it is not a finding of mine.

## Attempt-1 findings

| Finding | Status | Proof |
|---|---|---|
| C1 (the (iii) fallback) | **Resolved** by the human's ruling | `state/directives/2026-10-08-k6-case-iii-ruling.md` lines 6-15. The fallback is gone. |
| E1 ((iii) has no mutation) | **Resolved** | (iii) is no longer a re-aim, so Decision A's still-able-to-fail condition does not reach it (Amendment 10 item 3). |
| C2 (PR body, first paragraph) | **Resolved** | The PR body now names the hover readout and the error banner as drawn over the map. It claims the minimum only at 1024 × 640 and above, and that claim is now supported (see "The reviewer's C2 fix" below). |
| E2 (KNOWN-LIMITATIONS 39) | **Resolved** | `KNOWN-LIMITATIONS.md:369` now says "may", and leaves what is seen to row U6. Its evidence comment (:370) still calls the strip an inference. |
| D1 (walkthrough rows) | **Mostly fixed;** residue is N-D1 | |
| D2 (suite commits) | **Fixed** | The commits are named. The merges sentence is for the reviewer to confirm. |
| D3 (S4 wording, 85 px drag) | **Fixed** | `e2e/source-changed.mjs:836-841`. The PR body's S4 row and the 85 px disclosure are present. |
| D4 ("last bound") | **Fixed** | The PR body now says "first bound". |
| D5 (edits beyond the named checks) | **Fixed** | Amendment 9 item 7 records them. The PR body lists them under "Other edits" and in the CLASSC′ row. |
| D6 (class 8 record) | **Fixed** | Amendment 9 item 7, and Amendment 11's heading. |
| D7 (Amendment 7's class label) | **Fixed** | Amendment 9 item 7 relabels it by superseded index; nothing is edited. |
| D8 (hashes without a rev) | **Fixed for Amendments 3 to 7.** A new instance is N-D2. | |
| D9 (tools' commits) | **Fixed** | Amendment 9 item 7 names the tool commits and the run head. |
| D10 (VIEWPORT_FLOOR) | **Fixed** | `src/layout/layoutConstants.ts:14-16`, and Amendment 9 item 7. |
| D11 (walkthrough Publish phrases) | **Fixed** | `MANUAL-WALKTHROUGH.md:378` and `:390`. |
| D12 (test-text corrections) | **Fixed** | `e2e/regression.mjs:1011-1019` and `:771-774`. The (iii) summary at :1699 is again accurate. The garble at `e2e/pan-anchor.mjs:129-131` is gone, but the fix brought in N-D4. |

## Case (iii) against the code before stage 4

- **The code.** Head `e2e/regression.mjs:1304-1343` is identical to main's `frontends/shell/e2e/regression.mjs:1258-1290`, apart from the seven comment lines added at :1314-1320. Main is the pre-milestone code. Line by line, I compared:
  - the setup;
  - the zoom-in, then the mark, then the zoom-out;
  - the `sameId` wait against `repickHover.id`;
  - `hasConfirmingRepickTrace`.
- **The helpers the case calls are unchanged against main:**
  - `establishAboveThresholdHoverK6` (head :1093-1138, main :1058-1103);
  - `readHoverReadoutState`;
  - `hoverReadoutId`;
  - `hasConfirmingRepickTrace` (head :1218-1224, main :1183-1189).
- **The summary string** (head :1699-1700) is identical to main's :1606-1607.
- **The comment says what the human ruled:**
  - case (iii) only;
  - the old comparison, with no retry;
  - the dependence on one candidate pixel is kept because it shows the two pick paths disagreeing;
  - 50244 against 53722 at 1280 × 801;
  - the node is named.

  It attributes the observation to the ruling, not to a run. It does not misstate the ruling.

## The reviewer's C2 fix

It is judged against the form's §7 declared values and ADR-010 rule 6.

- **The caps are single-sourced.** They are the declared constants (`layoutConstants.ts:36`, `:38`), injected as CSS variables (`StudioLayout.tsx:179-180`). `box-sizing: border-box` (`styles.css:148`, `:161`) makes each bar's real cap equal the 128 px and 48 px that `effectiveSizes` budgets (`layoutState.ts:138-141`). No new number is introduced, and §7's values are unchanged. Rule 6 holds.
- **The proof is observed.** E-FLOOR (`e2e/layout.mjs:261-318`) failed by name at 757271d4 with a map of 480 × 306.21875, then passed at 2e17ee52 (report 8, lines 21-26). That is an observed failure, not a `verify-mutation` claim.
- **What the proof covers.** The real DOM is proved at the floor (E-FLOOR) and at the two E-FIT viewports. Above the floor, the claim rests on U1 and on the caps being equal by construction. That is enough for the PR body's claim.

## Amendments 9 to 11

- **Superseded indexes:** all present.
- **Round-25 checks:**
  - The §7 overrun is recorded as class 8, with the words `budget overrun, §7 not edited` and "after results were seen", in Amendment 11's heading. Amendment 11 item 4 records `layout.mjs`'s new per-file overrun (417 against at most 360, set at form :366).
  - No scope addition on a standing rule. E-FLOOR is a gate fix, declared in Amendment 9 before its code at 757271d4.
  - No `verify-mutation` run is called an observation.
  - No test-text span is pinned by hash at a branch commit.
- **Discharge claims** in Amendment 10 item 3 and Amendment 11 items 1 and 2: resolved above.
- **Something the round introduced, read and accepted.** The CSS fix moved the default map from 730.2 to 736 rows after every re-aim mutation had been observed (at 65391e79 and 82d1f73a). Each of those mutations deletes or forces a product path, which does not depend on a 6 px change in height. The pan-anchor box widths are unchanged. Every suite passes at ae704f0a (report 9). No re-observation is owed.

## Documentation (must be fixed in this PR before the merge; no re-gate)

- **N-D1. The walkthrough row list is still incomplete (residue of A-D1).** The PR body omits two changes that report 1 §7 lists:
  - the coverage rows B2′/B3′ and ABSENTCRS′ (`state/consults/2026-10-07-shell-migration-milestone-1-worker-report-1.md:145`);
  - H6's prose (the same file, :149).

  Add both, with their old and new words.
- **N-D2. Amendment 10 cites the ruling's lines 6-15 with a hash "at the commit that adds it".** There is no explicit `@ <rev>` (round 15 (e)). By its message on main, aad1ba72 adds both the directive and Amendment 10, so the line cite is also into a file the same commit creates (round 14). Fix: one appended row naming the rev, as Amendment 9 item 7 did for Amendments 3 to 7.
- **N-D3. Amendment 10 item 2 puts quotation marks around a phrase that matches nothing byte for byte.** The phrase matches neither Amendment 6 item 2 (form :546) nor Decision A (`state/directives/2026-10-08-decisions-a-b-c.md:12`), and the amendment's own header says nothing in it is a quotation. The quoted phrase is attributed to custodian text, not marked as the human's words, so this is Documentation. Fix: drop the quotation marks, or cite by reference.
- **N-D4. The A-D12 fix at `e2e/pan-anchor.mjs:129-131` misdates its sizes.** It says (paraphrase) that 668 × 730, 328 × 570 and 788 × 830 were measured at this branch's head. It was written at 773d42af, after 2e17ee52, where the maps were 668 × 736, 328 × 576 and 788 × 836 (report 8, lines 27 and 62). The sizes are true at 65391e79, so this is a pin defect: name that commit. It is a class-3 test-text row. The other "668 x 730" comments (`regression.mjs:712-714`, `:880`, `:1464`, `:1658`; `filter-panel.mjs:379-385`) name no head, and Amendment 11 item 1 covers them.
- **N-D5. The pick-paths disagreement is named by its window, not by the map it was seen on.** It was seen on a 731-row buffer under content-box bars (`worker-report-3.md:61`, `worker-report-4.md:51`). After 2e17ee52, a 1280 × 801 window no longer gives that buffer: the map shifted by about 6 rows (report 8 line 27; an inference). These all name the window only:
  - the (iii) comment (`regression.mjs:1318-1319`);
  - the PR body's (iii) paragraph;
  - Amendment 10 item 4;
  - the node (`PLAN.yaml:4461`, `:4475`).

  A diagnosis run at 1280 × 801 at the merged head would not reproduce the observed geometry. Fix: the PR body names the 731-row buffer and the commit range it was seen at. The custodian carries the same correction into the node's summary.
- **N-D6. The Suites section of the PR body:**
  - The column header attributes per-suite step counts to report 9. Report 9 records each suite's rc and failing steps only. The counts come from report 2 §3 (`worker-report-2.md:43-53`), so name it.
  - "The scripts suite, 457 of 457" names no run commit. It is 8127b0f5, gate-log 447.
  - Amendment 9 item 4's "every e2e suite at the base, with its result" is met only for the suites that fail at the base. Add the base result for the others, or say that report 2 §4 holds it.

No ADR is missing, and no skeleton is needed.

Relevant paths:
- C:/dev/wt/m1/frontends/shell/e2e/regression.mjs
- C:/dev/wt/m1/frontends/shell/e2e/pan-anchor.mjs
- C:/dev/wt/m1/frontends/shell/e2e/layout.mjs
- C:/dev/wt/m1/frontends/shell/src/styles.css
- C:/dev/wt/m1/frontends/shell/src/layout/layoutConstants.ts
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md
- C:/dev/spatial-ide/state/directives/2026-10-08-k6-case-iii-ruling.md
- C:/dev/spatial-ide/PLAN.yaml
