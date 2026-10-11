# PR #209 gate 1 — architect
Reviewed: cut/module-docs-stale-statements @ 117d8d5c2b102f6dea1c2fe5eb01832a44148604

**Verdict: block. There is one Correctness finding (C-1), and the fix is a short wording change. The re-gate covers only C-1's sentences. The Documentation findings are fixed in the same PR and need no re-gate.**

## Correctness

**C-1. "The stream path writes nothing" claims a limit the evidence does not support.** This is §8 item 4 and §9: a rewritten sentence that claims more than its pin shows.
- **Where:**
  - engine/README.md:93
  - engine/src/lib.rs:53
- **Why it fails:**
  - "The stream path" includes `stream_for_publish`, whose `ORDER BY` sort is DuckDB's.
  - The repo's own record says that sort can spill to disk, and nothing in the workspace controls where:
    - kernel/CANCELLATION-AND-TRACING.md:207-208
    - kernel/RESULTS.md:2067-2085: no setting anywhere, the control was never implemented, and spill was polled at four guessed locations, with about 317 MB unattributed.
  - The sentence has no pin, which is §5's invalidator.
  - My grep agrees with the worker's: no non-test write call exists in engine/src outside lod.rs (lines 1098, 1152, 1236, 1397) and the feature-gated fixture.rs. So the claim holds for this crate's own code, and not without qualification.
- **Fix:** limit the sentence to this module's own code, and name the DuckDB spill by section cite (kernel/CANCELLATION-AND-TRACING.md §7; kernel/RESULTS.md's "§5d is partially measurable" subsection). Pin it in the PR body. Both files stay inside their §7 ceilings (96/142 and 43/54).

## Evidence

I have no finding. E1 to E9 are the worker's claims. The reviewer verifies them; E9 (CI) is not visible to me. Everything I read agrees with E1 (only `//` lines and the one `fn` line changed), E7 (the appended note starts after the old line 491 of kernel/PERMISSION-BOUNDARY.md; kernel/CANCELLATION-AND-TRACING.md §9 starts at :256) and E8 (ruling 6).

## Documentation (each fixed before the merge, no re-gate)

- **D-1. §2.4's two owner's-index additions were not applied** (the worker's report says so).
  - kernel/README.md: "Governed by", the preregistrations list, gains this form.
  - engine/README.md:549: "engine halves of pieces filed elsewhere" gains this form.
  - lead-data writes them; the worker applies them in this PR.
- **D-2. kernel/README.md:335, "at most one batch after the cancel is observed".**
  - The observation that counter counts is the binding's own receipt of the cancel (protocol/data-plane/src/transport.rs:196-202 and :215-216). It is not ADR-018's producer-side `cancel_observed`.
  - Say "after the adapter's receipt of the cancel", which the same row already uses, so the wording keeps ADR-018's sense (§2.0(g)).
- **D-3. kernel/src/lib.rs:38-39 lists the audit log's writes as "creates its directory and appends to its file".**
  - The row's own pin range also covers rotation: `rotate_if_needed` at kernel/src/permission/audit/log.rs:141.
  - Add the rotation. Then also qualify "A stream still writes nothing" on the same line, as in C-1, or name it as the viewport stream.
- **D-4. engine/README.md:391, "Only publish preflight refuses `Float32` and dictionaries", overreaches as written.**
  - The filter path also refuses a dictionary column by name (engine/src/attributes.rs:98-99).
  - Limit "Only" to attribute projection.
- **D-5. Record of ruling 1.**
  - Row DX's Says list had a bullet that is now not applied.
  - The PR body, or a closing amendment if one is written, records this by reference to this gate report, ruling 1, with no prose (record cap).

## Rulings

1. **The DX exposure sentence stands as removed.**
   - §8 item 7 and §5's invalidator tie exposure text to C8, and DX's own header says "C8's position and nothing more". C8 (kernel/README.md:240-245) does not carry the sentence. The form contradicts itself here, and for red-line text the gate reads the bar literally rather than relax it by interpretation.
   - Nothing becomes false, and no surface is claimed reviewed. All three sites limit the discharge to "the UI surface for which ADR-017's acceptance condition was discharged":
     - kernel/src/lib.rs:44-47
     - kernel/src/permission/mod.rs:22-25
     - kernel/PERMISSION-BOUNDARY.md:497-501
   - The obligation stays where it is binding or recorded:
     - docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1140-1141;
     - kernel/PERMISSION-BOUNDARY.md:480-491, the F-10 and F-5 rulings above the note, unedited;
     - the pointer at kernel/src/permission/mod.rs:26-28.
   - If the custodian wants the sentence in the module docs, it goes into C8 first, in its own piece. N2 keeps C8's other words byte-identical in this one.
   - Process note: the worker settled an invalidator itself instead of stopping. Because the report discloses it, nothing is lost.
2. **The three quoted spans deleted with their stale sentences: compliant.**
   - §2.0(e) and §8 item 11 protect spans that stay. A span deleted along with its sentence has no byte left to change, and the new text puts no paraphrase of it in quotation marks.
   - The deleted spans were at main engine/README.md:78 and :450, and main engine/src/lib.rs:43. None was the human's words.
3. **geoparquet.rs:241 and dataset.rs:1032: in scope and correct.**
   - §2.0(f) is a rule over each comment that cites a block-on-sight item of a proposed amendment. It is not limited to the pinned sites, so these lines are not a class 9 addition.
   - Both files are §7 paths, within their ceilings (30/36 and 6/6).
   - The target is right. ADR-013 Amendment 1 item 2 (docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:276-279) carries the identifier-string ban, and the accepted Clarification (:322) itself equates "block-on-sight 8" with that ban.
4. **identity.rs:50: leave it.**
   - "block-on-sight A2" is Brief A's list item in engine/ADMISSION-PREREGISTRATION.md:211, which bars a generation value from any persisted or published artifact. It supports the sentence it sits in.
   - It is not a proposed ADR amendment's item, so §2.0(f) does not reach it, and §8 item 6 is not engaged.
   - Editing it would be a class 9 addition outside D8's sites.
5. **"The stream path writes nothing": Correctness.** See C-1 for the reason and the fix.
6. **E8 holds as the form means it.**
   - §0 names those three lines in words and never pins them, as #206's in-place replacements. §2.4 and §8 item 3 forbid changing them.
   - §0's own rule is that a moved line is not a changed fact.
   - The bytes are identical: B's lines 499, 510 and 519 are now at H's 527, 538 and 547. They moved +28 because of edits above them. I confirmed that main:499, :510 and :519 match H:527, :538 and :547.

## ADR-006 classing and ADR-018 vocabulary

- **ADR-006 classing:** no class is misassigned.
  - The stream stays a pure transformation, and publish stays class 3 (kernel/src/lib.rs:17-29).
  - The tier build is given no class (engine/README.md:100-101).
- **ADR-018 vocabulary:**
  - §9's item 2 (kernel/CANCELLATION-AND-TRACING.md:265-266) uses "acknowledged" in ADR-018's sense, and ADR-018's Status line is Accepted (:3).
  - kernel/README.md:335 names the pair correctly; D-2 is its one wording issue.

## §8, item by item

1. **Pass on reading** (non-comment `.rs` lines); the reviewer confirms E1.
2. **Pass:** no assertion, literal or string the app shows was changed.
3. **Pass:**
   - All 16 paths are §7 paths, and predicate.rs is in §7 under Amendment 1 item 3.
   - identity.rs changed only lines 5, 43, 66 and 119-121, so lines 251-254 are untouched.
   - The three README lines are byte-identical (ruling 6).
4. **D4 passes. C-1 fails.**
   - D4 passes: engine/README.md:93-101 and engine/src/lib.rs:53-61 state no discharge, grade, ResourceRef, ADR-006 class, lifecycle or served tier.
   - D3 passes: kernel/README.md:335 says the tests assert no docs/08 budget.
   - C-1 is the one failure under this item.
5. **Pass.** I checked these Status lines: ADR-013, 015, 016, 017, 018, 023 (Proposed), 032, 033 and 034. ADR-036 is still listed as Proposed.
6. **Pass.** crs.rs:50-54 and geoparquet.rs:588-591 name the deleted drafts at 433413a "which is history and not ADR text".
7. **Pass** (ruling 1).
8. **Pass.** engine/README.md:473-477 and identity.rs:42-50 say: never persisted, claiming no stability. Nothing implies a snapshot.
9. **Pass on reading** (no edit above either appended part); the reviewer confirms with the byte comparison.
10. **Pass.** No new bare `path:line` in the changed lines. Those at identity.rs:68-70 and geoparquet.rs:593 were already there at B.
11. **Pass.** No new quotation marks, and every retained span is unchanged.
    - One observation, not a finding: the span at geoparquet.rs:152-154 is now credited to ADR-013 Amendment 1 item 2. It differs from that item only in its first-letter case and the dropped emphasis. §2.0(e) keeps its bytes as they are.
12. **Pass.** B comes after #205 and #206, and the conditional rows were applied under Amendment 1.
13. **Pass.** 314 of 450 lines, 16 of 18 files, and §7 was not edited.
    - Note: PLAN.yaml's done commit plus any form amendment would bring the file count to exactly 18, so no further file may be added.
14. **Pass** (ruling 3).

## Files read (worktree C:/dev/wt/mdocs unless noted)

- **The form, the report and the directives** (main checkout C:/dev/spatial-ide):
  - kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md
  - state/consults/2026-10-11-module-docs-stale-statements-worker-report-1.md
  - state/directives/2026-10-10-tier-obligation-open-item-and-adr-029.md
  - state/consults/2026-10-10-drift-sweep-area-d-custodian-check.md:124-133
  - the B-side copies, on main, of engine/README.md, engine/src/lib.rs, crs.rs, geoparquet.rs, dataset.rs, identity.rs, kernel/src/lib.rs, permission/mod.rs, permission/boundary.rs, publish/mod.rs and kernel/README.md
- **Engine, worktree:**
  - engine/README.md
  - engine/src/lib.rs
  - engine/src/crs.rs:1-62
  - engine/src/geoparquet.rs (1-45, 68-79, 145-156, 228-257, 583-594, 738-810, 862-891)
  - engine/src/dataset.rs (316-430, 1012-1035, 1726-1737)
  - engine/src/identity.rs:1-130
  - engine/src/envelope.rs:142-183
  - engine/src/attributes.rs:40-104
  - engine/src/lod.rs (1-30, plus a grep)
  - engine/src/stream.rs:190-205
  - engine/ADMISSION-PREREGISTRATION.md (grep for A2)
  - greps over engine/src for file writes, pool settings and status words
- **Kernel, worktree:**
  - kernel/README.md (1-60, 170-379)
  - kernel/src/lib.rs:1-80
  - kernel/src/permission/mod.rs:1-45
  - kernel/src/permission/boundary.rs:1-35
  - kernel/src/permission/audit/log.rs (82-85, 128-152)
  - kernel/src/publish/mod.rs (36-63, 445-644, plus a grep)
  - kernel/src/bundle/mod.rs:1-12
  - kernel/src/skp.rs:160-179
  - kernel/tests/end_to_end.rs:360-484
  - kernel/PERMISSION-BOUNDARY.md (1-25, 480-502)
  - kernel/CANCELLATION-AND-TRACING.md:155-269
  - kernel/RESULTS.md:2058-2097
  - protocol/data-plane/src/transport.rs (the cancel counters, by grep)
- **Constitution and ADRs, worktree:**
  - docs/08_Testing.md:1-12
  - docs/adr/ADR-013 (244-329)
  - docs/adr/ADR-015 (150-205)
  - docs/adr/ADR-016 (1-6, 178-241)
  - docs/adr/ADR-017 (1040-1051, 1125-1154)
  - docs/adr/ADR-018:1-6
  - the Status lines of ADR-023, 032, 033 and 034
