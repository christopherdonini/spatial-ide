# PR #195 gate 1 — architect
Reviewed: cut/shell-migration-milestone-1 @ 8127b0f59e3dd7df97898ed7475b9380d9b54594

**Verdict: block.** There are two Correctness findings and two Evidence findings. The milestone itself (frame, seams, ADR conformance) is sound. The blocks are narrow: the K6 case (iii) re-aim, and two product claims worded more strongly than the evidence supports.

Read in the worktree at C:/dev/wt/m1. Line numbers below are taken there and assumed to be at the reviewed head; I have no shell to confirm HEAD. The form was read on main, Amendments 1–8. I could not recompute any sha256 or the §7 numstat. The reviewer should recompute the hashes cited in Amendments 3–7 (5d6034a4…, 0640da96…, 89f6cd72…, d5522f63…, c7e76c20…) and Amendment 8's per-group figures.

## Correctness (blocking)

**C1. The K6 case (iii) fallback lets product failures pass (Decision A, first condition).**
- The changed comparison is acceptable. HOVER-REPICK-PREREGISTRATION.md §5 (iii) defines the case as: hover, one zoom-out notch, same id. The id standing when the zoom-out begins is therefore the preregistered reference. Comparing against the id from before the zoom-in was the old code's own extra assumption. This is the answer to the worker's flag: the comparison does not touch the assertion.
- The fallback does. At e2e/regression.mjs:1318-1322 it re-establishes the hover on any readout without an id after the zoom-in.
- That covers `refusal`, which cannot legitimately follow a zoom-in from a camera already proven above the threshold (the file's own monotonicity note, :1042-1045).
- It also covers `confirming` after the settle, which B1 forbids.
- The old code failed in both states; the new code passes.
- Fix (test-only, inside Amendment 6's boundary): take a mark before the zoom-in notch. Re-establish only when the state is `clear` and a `readout_confirmed camera-settle-repick cleared` line has arrived since that mark. Otherwise throw by name.

**C2. The PR body's first paragraph claims a guarantee the code does not support.**
- It says nothing is drawn over the map any more (paraphrase). HoverReadoutView still renders inside `.canvas-container` (App.tsx:1852), and ErrorBanner is a fixed overlay (App.tsx:1654), as form §2.2 declares.
- It says the map has a declared minimum size without the floor. That minimum is claimed only at viewports of 1024 × 640 and above (layout/layoutConstants.ts:10-16).
- Fix: reword both sentences in the PR body.

## Evidence (blocking)

**E1. The K6 (iii) re-aim is not shown still able to fail (Decision A, fourth condition).**
- (iii) has no recorded mutation. HOVER-REPICK records one only for (v), in its Amendment 5.
- The PR body states no mutation for (iii).
- The PR body's own table reads Decision A per case, with separate K6 (ii) and K6 (v) rows. Neither of those mutations reaches (iii)'s comparison:
  - Mutation 4's run passed (i), (iii) and (iv) before failing (ii) (report 5; regression.mjs:1263-1264).
  - Mutation 5 passed every case.
- A product mutation needs an edit outside the human's item-1 list, which allows only report 4 §4's edits. So this goes to the human, with two options:
  - allow one mutation, for example making the settle re-pick's `pickCandidateAt` return null (WorkingCanvas.tsx:1186), expected to fail at "K6/re-pick" (observe it after C1's fix);
  - or rule that the (ii) and (v) observations discharge K6.

**E2. KNOWN-LIMITATIONS item 39 states a limit as a fact.**
- KNOWN-LIMITATIONS.md:369 says what the human will see: a strip of the map with no features (paraphrase).
- The evidence is a count of zero viewport queries (RESIZEQ), and its own comment (:370) calls the strip an inference.
- The resident tile cover can extend past the viewport (report 3, the source-changed section: the cover already held 1.8 km of pan). So the strip may already be filled.
- Fix: write "can" or "may", as the heading at :368 already does. Walkthrough row U6 is where the human observes it.

## Documentation (must be fixed in this PR before the merge; no re-gate)

- **D1.** The PR body has no list of changed walkthrough rows. It must list every changed row with its old and new words: §2.8; Amendment 1 item 1 (B2, I1); Amendment 2 item 1 (T4, T5); Amendment 3 item 5 (the export-label rows). Report 1 §7 has the table.
- **D2. Suites section of the PR body.**
  - §9 asks for every e2e suite to be listed, with its result.
  - "Results at the head" is not accurate. The results were taken at 27e4816c and f214f1f4 (stage 2), 65391e79 (stage 4) and 82d1f73a (stage 7).
  - Name those commits, and say that 8127b0f5 differs from them by comment commits (512aab08, 629a21fd) and by merges of main.
  - State whether those merges changed anything under frontends/shell/src or e2e. If they did, rerun; the finding then becomes Evidence.
- **D3. Wording of the re-aimed checks.**
  - The S4 comment overstates the stop condition: source-changed.mjs:836-840 says the pan is as long as it needs to be. Report 4 §8 says the first stream-issued line arrives only after the pan ends, so the pan always runs to its bound (13 drags). Correct the comment and the PR body's S4 row.
  - Disclose in the PR body that the small-box paint-vs-event drag is now 85 px (pan-anchor.mjs:237). The unchanged 4 px tolerance therefore admits a proportional paint/event error of about 4.7% there, against about 1.6% at 250 px.
- **D4.** The PR body says the case last bound at 2 px. The record (commit 04866c19) shows only that it bound then. The code says "first bound" (regression.mjs:1671). Drop "last".
- **D5. Edits beyond the named checks are recorded in no amendment and missing from the PR body** (Amendment 6 items 2 and 5):
  - the `setCam` wait (pan-anchor.mjs:100-103), a helper shared with normal-A and recenter-crossing-A;
  - CLASSC′'s second click (console.mjs:517-519), beyond the ruled single click;
  - the `shouldStop` parameter added to `panByViewports` (source-changed.mjs:408-414).
  None changes an assertion or a threshold; I read all three. Record them by reference, using report 4 §7's classes.
- **D6. Amendment 8's class 8 record is incomplete.**
  - Its first line lacks the words `budget overrun, §7 not edited` (PREREGISTRATION-TEMPLATE, round 25 additions, class 8).
  - G5's reason is not recorded (report 1 §2 and §6 item 1).
  - It counts from 176ab912, not §7's cut-time base. Say why.
  - The first lines of Amendments 7 and 8 do not say that results had been seen, although both record stage 5–7 results (form header, line 7).
- **D7.** Amendment 7 labels case (v)'s change "class 5". Class 5 is a narrowing; this change strengthens the case. Label it a scope addition, as Amendment 6 does.
- **D8.** Amendments 3–7 give hashes "at the commit that adds it", with no explicit `@ <rev>` on main (round 15 (e)). Append one row that names each commit id.
- **D9. Amendment 8 item 3 needs the tools' commit and the runs at the head.**
  - Its tool claims name no tool commit (round 15 (c); form §9).
  - "verify" is ambiguous: scripts/plan/verify.mjs or `npm run verify`.
  - `npm run verify` and the governance `node --test` were last recorded at f214f1f4 (report 2). Name the run, or the CI job, at 8127b0f5.
- **D10.** Amendment 3 item 2 says VIEWPORT_FLOOR was given a caller. Its only reader is U1 (layoutState.test.ts:13, 22-23; report 1 §10). I accept it as a declared value under §7 and ADR-010 rule 6, with U1 named as its consumer. Two corrections:
  - fix the record sentence by reference;
  - fix layoutConstants.ts:14, which says `effectiveSizes` reads it; it does not.
- **D11.** Walkthrough coverage prose still says "Publish button" and "Publish disclosure" (MANUAL-WALKTHROUGH.md:378, :390). That is inside Amendment 3 item 5's reach and was sent to the gates by item 10, so fix it. F8's "no publish button" sentence (:275) and S1 would change a row's meaning (§8 item 9). Leave them and list them as noticed.
- **D12. Test-text corrections:**
  - the K6 header's description of (v) (regression.mjs:1011-1012) lacks the stronger condition;
  - the (iii) summary (:1705) says "hovered id" for the standing id;
  - the A9′ early-stop comment (:771-773) still reads as the active stop;
  - pan-anchor.mjs:130-131 has a garbled "measured by / measured at".

## What passes

- **§8.** Items 3–7, 9 (apart from D11), 10, 11 (apart from D10), 12–16 pass. Item 8 passes with Amendment 6 and 7's exceptions, apart from D5. Items 1 and 2 are clean by the reports and the imports (App.tsx:16-20, `return (` at :1652); the reviewer should confirm both from the diff.
- **ADRs.** ADR-001: React and TypeScript, no new dependency. ADR-006: layout actions are class-C, view state only, with no history step (surfaceRegistry.ts:277-321). ADR-010 rule 1 (App.tsx:1782-1783; StudioLayout.tsx:243-245, not keyed) and rule 6 (layoutConstants.ts). ADR-017: labels only, per Amendment 1 item 4. ADR-021: Cancel stays in FilterPanel; the mirror is read-only (regionParts.tsx:196-214). None is amended.
- **docs/01 and the plan's rule 10.** Layout is not workspace (layoutState.ts:18-26; U4).
- **Seams.** All three are written against the consuming side's real interface: the reducer through StudioLayout.tsx:120-123; typed slots through App.tsx:1662-1993; the registry through App.tsx:1656, which matches §0.4's `fitToBounds`. The callers are at StudioLayout.tsx:155-164, :210-226 and :233. They are proven end to end by R1–R8 on the real App and by the E rows.
- **Operator strings.** New strings are P6-marked, apart from those the human sighted under Amendment 1 item 4. None is claimed final.
- **Decision A.** A9′, K6 (ii), FIND′, CLASSC′, pan-anchor and S4 change only assumptions. Each derives and states its values, and each has an observed failing mutation; there-and-back-net has the human's input-side control instead.
- **Amendment 7.** Case (v) carries the old assertion, the new one, the reason and the reading marked as taken from the record (regression.mjs:1661-1686), and its mutation was observed once at 82d1f73a.
- **Records.** Amendments 3–8 match reports 1–7, and every superseded index is present.
- **Round-25 checks.** No verify-mutation run is called an observation. No test-text span is pinned by hash at a branch commit. The class 9 addition (Amendment 6) was declared before its code. The §7 line is not edited.

No ADR is missing; no skeleton is needed.
