*Custodian's filing note (2026-11-12): the architect's read-only draft of the S1 fix form's Amendment 2, on E1 case 1 (c), read at main 3b9864d6 and at the branch commit 3df3e57c, from its hand-back (19926 bytes, sha256 8177636af84544666f2816d241ecff7fbee89785d310ac54fc4f4a1eed8504da), below the rule unchanged; one final newline is added. Its brief by file (9549 bytes, sha256 448b6b447bd18ae0579dc76cefc1ea03c1ebb044c6bca817c4242a0b4eab7778); the run 08:17:14Z to 08:25:07Z by its transcript, 14 calls (Read 11, Grep 2, the hand-back), none errored, no Write, Edit or Bash, model claude-opus-5-5. Its OPEN-A, whether E1 (c) is replaced after the head run was seen and how, is a red line and goes to the human; its OPEN-B (A) and OPEN-C (A) take its recommendation under the human's ruling 24, dated 2026-11-12, for the human's review. A draft, a reading and not Authority.*

---

Drafted: recentre-crossing-view-displaced-fix, Amendment 2 (E1 (c)), at main 3b9864d6
Reviewed: main 3b9864d6199f9b45f5f6bc2e3bfff1f867187bda; cut/recentre-crossing-view-displaced-fix @ 3df3e57c38b82859eb9f01b294557fb143769ef7

````
### Amendment 2 — written after the head run's E1 result was seen: case 1 (c) (class 1; it records a class 2 deviation)

*Drafted by the architect (claude-opus-5-5) on 2026-11-12 at main 3b9864d6, after the run at the head (§7 S6) was seen. The custodian commits it. Tracked cites are at main 3b9864d6; the custodian fills each `<H>` by script. Branch lines are named by branch and commit, never pinned. The images are named by run and sha256 and are evidence held in scratch, not Authority.*

Cites:
- R1 `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md:121-130` @ 3b9864d6 sha256:<H> (note 5's screenshot rule)
- R2 `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md:170` @ 3b9864d6 sha256:<H> (note 6, its limits)
- R3 `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md:260` @ 3b9864d6 sha256:<H> (that form's settlement of its OPEN-1)
- R4 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md:87-93` @ 3b9864d6 sha256:<H> (the head run, case 1)
- R5 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md:95-102` @ 3b9864d6 sha256:<H> (the head run, case 2 and its tally)
- R6 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md:53-62` @ 3b9864d6 sha256:<H> (S5: U1, U2, M-U1, M-U2)
- R7 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md:69` @ 3b9864d6 sha256:<H> (the head exe)
- R8 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md:128-135` @ 3b9864d6 sha256:<H> (the numstat)
- R9 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s3b-worker-report.md:17-29` @ 3b9864d6 sha256:<H> (the run at the base)
- R10 `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s3b-worker-report.md:12` @ 3b9864d6 sha256:<H> (the base exe)
- R11 `docs/PREREGISTRATION-TEMPLATE.md:103-109` @ 3b9864d6 sha256:<H> (classes 1 and 2)
- R12 `docs/PREREGISTRATION-TEMPLATE.md:169-170` @ 3b9864d6 sha256:<H> (classes 8 and 9)

Images:
- I-s (the start image of both runs; it is one file): sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2, 34623 bytes.
- I-be (the base's end image): sha256 4ad952620d75ab9051ed77c8ad3d8630eab8078e9f870e53e54eddf40d16f062, 3169 bytes.
- I-he (the head's end image): sha256 cf7fd271ad7847389f4e0dd213d2d537171467ab061d34615974bc570593f519, 107990 bytes.
- Boxes come from the custodian's script, which marks pixels by note 5. They are the custodian's, as given in the architect's brief, and they are not recomputed here. All images are 668x712, and B is 255,255,255.
  - I-s: N 35248, x 66-667, y 258-357.
  - I-he: N 127606, x 66-667, y 0-357.
  - I-be: N 0.

1. **The result, as seen (class 2, R11).**
   - At the head (3df3e57c, exe R7), E1 passed 5 of 6 checks and exited 1 (R4, R5):
     - case 1 (a) and (b) passed;
     - case 1 (c) failed;
     - case 2 (i), (ii) and (iii) passed.
   - P-head (§5) predicted that every part passes, so it is missed at (c). U1 and U2 pass at the head, and M-U1 and M-U2 failed as predicted (R6).
   - The run at the base (8cbc250b) met P-E1-base (R9).
   - This record stands whatever follows: the fix at 3df3e57c is recorded as failing E1 case 1 (c). §5 and §4 are not edited.

2. **The four images: my reading.** I read them by eye, using the custodian's boxes and my own arithmetic. Nothing here is measured.
   - **I-s.** A horizontal band of blue dots: x 66 to the right edge, y 258-357. Its top edge steps down a few px near x 600. The data touches the right edge, so note 5's assumption that the fit leaves a margin (R1) does not hold for this image. B is still white.
   - **I-he.** A block of the same dots. Its left edge (66) and bottom edge (357) are the same as in I-s. It fills up to the top edge and the right edge, and it contains I-s's band.
   - **I-be.** Blank: the data has left the canvas. This is H1's displacement, matching the trace (R9: |E| 671141.663 world units).
   - **The head's (c) failure is residency, not a displacement.** More of the fixture is drawn at the same view at the end than at the start. The evidence:
     - the two interior edges are unchanged;
     - the start box lies inside the end box;
     - the dot density is the same, 35248/60200 ≈ 0.586 against 127606/215516 ≈ 0.592;
     - the centroid shift is the box growing upward. With uniform density, cy goes from 307.5 to 178.5, a move of about 129, against R4's 129.55, and cx stays at about 366.5;
     - (a) reports a worst jump of 0.00 buffer px and (b) |E| (0.000, 0.000) (R4).
   - **Mechanism: unknown, and nothing is claimed.** It could be data admitted after the fit, or drawn data refreshed only on a later rebuild such as the re-centre's `render()`. The start image is byte-identical across two runs on two builds, so the start state is reproducible.
   - **What (c) is in E1 to see.** §4 row E1 (c) carries note 5's rule (R1). In the reproducer, (c) was the screen's own witness beside the trace (R2), and §1.5 (a) used it to exclude a trace artefact.
   - **(a) and (b) see only part of that.** They read W from the `view-state` line, which is what deck's callback carries. They cannot see a frame whose layers and camera are paired in different frames (ADR-010 rules 1 and 5, §2.1). At the base, H1 showed in the trace as well, so (a) and (b) failed alongside (c). The screen witness is what (c) alone adds, so E1 keeps a screen check, and (c) is not removed without a replacement.

3. **Which rule governs.**
   - **§5 Falsification governs the result.** E1 failed at the head, and that failure is recorded as seen (item 1).
   - **No invalidator applies:**
     - I1 and I3 do not apply.
     - I2: the precondition was met at both builds (R4, R9).
     - I4: nothing shows that the failure depends on timing (the start image is reproducible, item 2). I4 is not invoked to re-run for a different answer.
   - **§11 item 8 blocks, on sight**, any change by the agents to (c)'s rule, tolerance or prediction, or to whether (c) counts in E1's exit code, now that a run has been seen.
   - **Class.** This amendment is class 1 and records a class 2 deviation (R11). It is not class 8 (no overrun) and not class 9 (no standing rule adds work) (R12). No class from 1 to 9 lets a check be replaced after its result.
   - **So any change to (c) waits for the human's typed word.** That is OPEN-A, a red line. It would lift a §11 item after a result, on a form the human ordered full with both gates (§0.1). This node gates the v0.2 tag (Amendment 1, item 4), and the reproducer's outcomes bind this form by the human's item 5 (b) (§0.1).

4. **The options for (c).**
   - **(A) Record the failure and stop.**
     - Honest.
     - Cost: the defect stays on main and the v0.2 tag stays blocked (Amendment 1, item 4). The fix goes back to the architect, although U1, U2, (a), (b) and case 2 all pass and the images show no displacement.
   - **(B) A new rule applied to the recorded images, with no run.**
     - Not honest as evidence. The rule would be written with both pairs in view, so its answer on them is known before it runs. Recording that answer as E1's result would be the change §11 item 8 forbids, in substance.
     - It may run only as a check of the code against a known answer (item 7, S6b).
   - **(C) A new rule declared here with its predictions, then fresh runs at the base build and the head build.**
     - (c) keeps running and is reported beside the new rule.
     - Cost: one commit to the e2e file and two E1 runs of about 4 to 5 minutes each, in shared holds. No rebuild is needed, and the record of (c) is kept.
   - **(D) (added) Keep (c) as it is, but take the start image only once the data is resident.**
     - Cost: this needs a residency signal that the measure build may not expose (packet gap).
     - A warm-up pan-and-return changes §4's case 1 start, which is defined from the fit. It also need not bring residency to the end's state if the extra data arrives with a rebuild.
     - It is a post-result change too, under §11 item 8 in the same way.
   - **The candidate rules:**
     - *Anchored edges.* Taken in the general form below, so that no edge is chosen by looking at these images. A fixed left-bottom corner would be fitted to them.
     - *Warm-up.* As (D).
     - *Pixels drawn in both images.* Rejected. The fixture draws a near-regular dot lattice at density ≈ 0.59 (item 2). A displaced copy therefore overlaps itself by chance at about 0.59, and at a shift of one lattice period near 1. Sub-pixel rounding after a re-centre (unmeasured) could also break exact overlap in a correct product.
   - **Recommendation: (C) with rule (d).**
   - **Rule (d), declared here before any run of it:**
     - B is the most frequent exact RGB on the start image's outermost one-pixel ring (R1). A pixel of either image is marked when any channel differs from that B by more than 8. N is the marked count.
     - Each image's box is the bounding box of its marked pixels (left, right, top, bottom).
     - An edge is inner when it is not on the outermost ring: left > 0, right < w−1, top > 0, bottom < h−1. K is the set of edges that are inner in both images.
     - The pair is unreadable when the dimensions are unequal, when N_start is 0 or w·h, or when N_end > 0 and K is empty.
     - The pair differs when N_end is 0. Otherwise it differs when any edge in K moves by more than TOLERANCE_BUFFER_PX (4.0), scaled by bw/cw on x and bh/ch on y.
     - (d) passes when the pair is readable and does not differ. Its line records both boxes, K, and each move.
   - **What (C) changes in (c):**
     - (c)'s code is kept. Its one departure from note 5 is fixed: it takes B per image, and it will take B from the start image (gate finding F1). On these four images the fix changes nothing, because B is white in each.
     - (c)'s line prints REPORT and does not count in the exit code.
     - (d) is asserted.
     - The result of (c) at 3df3e57c stays failed in the record (item 1).

5. **The base under (d): it is re-run, not re-read.**
   - (d) is new. Its power to see the defect is §4's M-E1 observation, so it is observed and not inferred from I-be. No rebuild is needed: the base exe is the one in R10.
   - **P-E1-base under (d):**
     - the precondition is met;
     - case 1 (a) and (b) fail;
     - (c) is reported and expected to differ (N_start → 0);
     - (d) fails, because N_end = 0 means the pair differs;
     - case 2 (i) fails and (ii) passes;
     - (iii) is recorded as seen;
     - exit 1.
   - **P-head under (d), for the fresh head run:**
     - the precondition is met, with origin changes at drags 35 and 74 if z_fit repeats;
     - (a) and (b) pass;
     - (c) is reported and expected to differ, as at S6;
     - (d) passes, with K expected to be {left, bottom} and each move ≤ 4.0 buffer px (0.00 by the S6 images);
     - case 2 (i), (ii) and (iii) pass;
     - exit 0.
   - **Invalidators added** (each one returns the piece to the architect by amendment, with nothing adjusted):
     - I5: (d) passes at the base.
     - I6: (d) is unreadable at either build.
   - I1 to I4 stand.

6. **P-head's other words hold.** The derivation was recorded and not asserted (§5).
   - R4 gives T 131072, d 3749.395 and n1 37.
   - floor(T/d) + 1 = floor(34.958…) + 1 = 35.
   - The back leg's drag n1 is drag 37 + 37 = 74 overall. After the re-centre at drag 35, two further +d drags leave the local target at 2d. Leg 2 then reaches −35d at its 37th drag, and |−35d| = 131228.8 > T.
   - R4 shows exactly two origin changes, at drags 35 and 74, one per leg.

7. **Ceilings and steps.**
   - `recentre-crossing.mjs` is at 317 of its 450 lines (R8). (d), F1, the change to REPORT and the comment words (F2, F3) come to at most 60 lines by my estimate, not a measurement.
   - No other file is touched before S7. An overrun is class 8, and §7 is not edited.
   - **The steps:**
     - **S6a.** The custodian commits this amendment on main. No code for (d) lands before this commit and before the human's typed answer to OPEN-A.
     - **S6b.** On (C): one worker commit, to `recentre-crossing.mjs` only.
       - `git diff --name-only 3df3e57c..HEAD` names that file alone, and `node --check` passes.
       - A scratch script, not committed, applies (d) to the four stored images by sha256. Expected: the head pair does not differ, with K {left, bottom} and moves of 0; the base pair differs. This is recorded as a check of the code and not as an observation (item 4 (B)).
     - **S6c.** E1 runs once at the base exe, in its own shared hold. Before the run, the exe's sha256 is checked equal to R10. The result is recorded against P-E1-base under (d).
     - **S6d.** E1 runs once at the head exe, in its own shared hold, after S6c. The exe's sha256 is checked equal to R7. The result is recorded against P-head under (d).
     - **S7.** As prepared, plus (d) in the README entry, counted against its ceiling of 45.
     - **S8.** The report, then both gates.
   - **Shared holds:** S6c, S6d, any vitest or verify run, and every heavy run of the reviewer. E1 uses no dev server. The reviewer's dev-build suites run on 5400.
   - **On (A):** the piece stops at S6 and returns to the architect, and the v0.2 tag stays behind this node.

8. **The gates at the final head (§12), for (c) and (d).** The reviewer:
   - recomputes, from the final head run's images and the final base run's images by sha256, with its own decode:
     - B, from the start ring;
     - N, C, and (c)'s verdict against its REPORT line;
     - each box, K, each move in buffer px, and (d)'s verdict;
     - N_end at the base;
   - shows that (c)'s code differs from 3df3e57c only by F1 and the change to REPORT;
   - shows that the product tree is unchanged since 3df3e57c;
   - checks both exes' sha256 against R7 and R10;
   - confirms that item 1's record is not re-labelled;
   - recomputes (d) on its own E1 run at the head build.

9. **The reuse index.** The custodian ran it on 2026-11-12 in the read-only private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, with two searches: `image rule pixel centroid displacement screenshot` and `e2e baseline capture warm-up tile residency`. Each exited 1 with no prior art recorded. Misses: both. Rule (d) comes from this form's own images and from note 5.

Nothing above is edited.
````

**OPEN items**
- **OPEN-A. The standing of (c) and its replacement. Red line.** It lifts §11 item 8 after a result was seen. The form was ordered full by the human, the v0.2 tag depends on this node, and the reproducer's outcomes bind the form by item 5 (b).
  - (A) Record the failure and stop.
  - (C) (d) is asserted and (c) is reported, with fresh runs at the base and the head.
  - (D) Keep (c), and take the start image once the data is resident.
  - (B) is not offered as evidence.
  - Recommendation: (C). It waits for the human's typed word.
  - Context, as a paraphrase: in the reproducer, the human's settlement kept the image pair reported beside the dismissal condition (R3).
- **OPEN-B. F1, (c)'s B taken from the start image's ring. Not a red line.**
  - (A) Fix it in the (d) commit and record that it changes nothing on the four images.
  - (B) Leave it and record the departure.
  - Recommendation: (A). It lands only with OPEN-A's (C).
- **OPEN-C. The residency observation:** the fit view shows less of the fixture than the same view after the drags. Not measured.
  - (A) Record it here as unmeasured and put it on the Monday list. No node.
  - (B) A diagnostic node. Placing an S1 or S2 node is a red line.
  - Recommendation: (A).

**Gate findings (not ruled)**
- **F1 (Correctness, instrument against its declaration; no effect here).** `analyze`, lines 188-192 of `frontends/shell/e2e/recentre-crossing.mjs` at 3df3e57c on branch cut/recentre-crossing-view-displaced-fix, takes B from each image's own ring. Note 5 takes B from the start image's ring (R1). B is white in all four images, so the results do not change. Must-fix in the (d) commit.
- **F2 (a claim of a property the evidence contradicts; worker's wording, not the human's).** The comment at line 211 of the same file at 3df3e57c says the data is in before the capture. The settle on line 212 only waits for quiet render-trace lines, and I-s against I-he shows less data drawn at the start.
  - Replacement words (the worker applies them with no re-gate, and the PR body lists them): `// Wait for every render-trace line to go quiet (the reproducer's settle) before the capture. Quiet lines do not prove the data is all drawn: at 3df3e57c the start image held less of the fixture than the end image at the same view (Amendment 2 of the fix's form), so case 1 (d) compares only the drawn data's edges that lie inside both images.`
  - Clause check:
    - the settle is `waitForSettle` over `renderTrace()` with quietMs 3000 (line 212);
    - the start/end difference is item 2;
    - the (d) clause holds once (d) lands.
  - Not reachable in ordinary use (harness only).
- **F3 (worker's wording).** The header, lines 17-18 at 3df3e57c, presents (c) as a decisive check.
  - Replacement for line 18's (c) clause: `(c) the start and end images by the reproducer's note 5 rule, reported and not counted in the exit code; (d) the drawn data's edges that lie inside both images move by at most TOLERANCE_BUFFER_PX (Amendment 2).`
  - Clause check: conditional on the (d) commit. The reviewer checks it against that commit.
- **F4 (reading).** Note 5's assumption that the fit leaves a margin did not hold in either start image: the data touches the right edge. B was still white. No change to the reproducer's record.
- **F5 (reading).** Classes 1 to 9 have no class for a check replaced after its result. Under the record cap no clause is proposed. This amendment uses class 1 with class 2 and the human's ruling.
- **F6 (Evidence).** §3's first may-claim bullet (E1 case 1) cannot be claimed at 3df3e57c. It becomes claimable only if OPEN-A is answered (C) and P-head under (d) is met.

**Read, by path**
- `C:/dev/spatial-ide/governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md` (whole)
- `C:/dev/spatial-ide/governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md` (lines 55-312: notes 3 to 11, the settlement and the OPEN-5 (B) variant)
- `C:/dev/spatial-ide/state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s3b-worker-report.md` (whole)
- `C:/dev/spatial-ide/state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s4-s7-worker-report.md` (whole)
- `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md` (lines 100-178)
- `C:/dev/wt/rcf/frontends/shell/e2e/recentre-crossing.mjs` (whole, at 3df3e57c)
- The four images in `<S>`, by the names the brief gives.

**Packet gaps**
- The sha256 and byte output of `<S>/rce1-bbox.mjs`. The boxes in the record need them to be cited as evidence.
- Whether the measure build exposes any signal that the fixture is fully admitted or drawn. Option (D) depends on it.
- How the 100k fixture reaches the canvas: the number of batches, and whether the fit is a one-shot on the first batch. That decides the residency mechanism.
- The prepared README entry (`rcf-s47-readme-entry.txt`), to size S7 against the ceiling of 45.
- `extent.ts`'s fit margin, which I did not read against the start box touching the right edge.
- The words of the human's item 5 (b) on the image pair. I read only R3's paraphrase of them.

**Model:** claude-opus-5-5
