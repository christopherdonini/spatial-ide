*Custodian's filing note (2026-10-14): the architect's §0 re-sweep of `frontends/shell/STALE-TEST-NAMES-AND-COMMENTS-PREREGISTRATION.md` at its base, main 76fa319a, before any code; the run 2026-10-14T11:13:59Z to 2026-10-14T11:23:24Z by its transcript (Read 58, Grep 39, Glob 2; zero writes); its one SubagentHandback call, at 11:23:23Z. Extracted by script; 87 rooted path:line cite(s) de-rooted and one final newline added; nothing else changed. The message's sha256 as handed back is 183d025efe487ba128d1d47626e7bfd86f2e5c6a696358dcbd23d8d3dd864850; this file's, from line 5 to the end, is d97f70ee78f1ec935a1ed2e17382d3c46b0710620c369df34a8c00e2254548d8. Its amendment is appended to the form as Amendment 2, each pin given its full revision and sha256 by script, with the custodian's items 11 to 14 (the hash check; F3d's Says; §4 items 3 and 4). None of it is the human's wording.*

---

main @ 76fa319afc5596bd89b34890cdbe178a047bf91f. **Verdict:** this is a pre-code re-sweep, not a gate. One row is held: F3d's Says is untrue at the base, a Correctness finding if it were applied. Every other row stands at the base and may start.

```markdown
### Amendment 2 — the re-sweep at the base, main 76fa319a (class 3)

*Written before any code, by the architect on the custodian's brief. References only. B is main 76fa319afc5596bd89b34890cdbe178a047bf91f. Where a cite at C and B's tree differ, B's tree is authoritative (§0). Every pin below is at B. Read the last amendment first.*

1. **Moved lines (class 3; no claim changes).**
   - **D2.** The CRS piece's comment above it, at `line 184-187 of kernel/tests/manual_walkthrough_fixtures.rs (at 76fa319a) @ 76fa319a`, moved the file up by one line.
     - §2.1 D2's stale paragraph, `:554-563` at C → `line 553-562 of kernel/tests/manual_walkthrough_fixtures.rs (at 76fa319a) @ 76fa319a`.
     - The generator, `:566` at C → `line 565 of kernel/tests/manual_walkthrough_fixtures.rs (at 76fa319a) @ 76fa319a`.
     - The first paragraph, `:546-552` at C → `line 545-551 of kernel/tests/manual_walkthrough_fixtures.rs (at 76fa319a) @ 76fa319a`.
     - The written file, `:567` at C → `line 566 of kernel/tests/manual_walkthrough_fixtures.rs (at 76fa319a) @ 76fa319a`.
     - The modes, `:573-574` at C → `line 572-573 of kernel/tests/manual_walkthrough_fixtures.rs (at 76fa319a) @ 76fa319a`.
     - Check: the paragraph still carries the three clauses D2 removes, and the ExplicitNull reason D2 keeps. `stepBothNeeded`'s half (a) still expects `engine.crs_undeclared` (`line 537-538 of frontends/shell/e2e/admission-remediation.mjs (at 76fa319a) @ 76fa319a`). The paragraph is still stale.
   - **F3a.** The `key`, `App.tsx:1783` at C → `line 2047 of frontends/shell/src/App.tsx (at 76fa319a) @ 76fa319a`.
     - Check: that line is the `key` prop of the `WorkingCanvas` element.
     - Every mounted-`App` suite at B records mounts and unmounts in an effect on the `dataset` prop: `line 136-141 of frontends/shell/src/App.layout.test.tsx (at 76fa319a) @ 76fa319a`, `line 166-171 of frontends/shell/src/App.selection.test.tsx (at 76fa319a) @ 76fa319a` and `line 101-106 of frontends/shell/src/App.workspace.test.tsx (at 76fa319a) @ 76fa319a`.
     - So no unit test pins the remount, and F3a's Says stands.

2. **Unchanged at B: the same line numbers, still stale, and the facts hold.**

| Row | Stale at B | Clause check at B |
|---|---|---|
| F2 | `line 139-140 of engine/tests/identity.rs (at 76fa319a) @ 76fa319a` | The name says the file is refused. The test admits it on the session tier and still reports the candidate list (`line 156-169 of engine/tests/identity.rs (at 76fa319a) @ 76fa319a`). The label is printed only to stderr, on an abort (`line 40-44 of engine/tests/identity.rs (at 76fa319a) @ 76fa319a`). ADR-016 is Accepted (`line 3 of docs/adr/ADR-016-stable-feature-identity-admission.md (at 76fa319a) @ 76fa319a`). |
| F2r | `line 251-254 of engine/src/identity.rs (at 76fa319a) @ 76fa319a`; `line 65-68 of engine/tests/admission_instruments.rs (at 76fa319a) @ 76fa319a` | Both still name the F2 test by its current name. Item 7 lists the live set at B. |
| H4 | `line 176 of kernel/tests/skp_filter_cancellation.rs (at 76fa319a) @ 76fa319a` | The comment counts 200,000 ids. `FEATURES` is 2,000,000 (`line 147 of kernel/tests/skp_filter_cancellation.rs (at 76fa319a) @ 76fa319a`), and the filter is `FEATURES - 100` (`line 185 of kernel/tests/skp_filter_cancellation.rs (at 76fa319a) @ 76fa319a`). |
| F7 | `line 1290-1291 of kernel/tests/first_batch_factorial.rs (at 76fa319a) @ 76fa319a` | The comment calls ADR-018 Proposed. ADR-018 is Accepted (`line 3 of docs/adr/ADR-018-what-cancellation-acknowledged-means.md (at 76fa319a) @ 76fa319a`), and its item 2 scores the budget on the pair (`line 56 of docs/adr/ADR-018-what-cancellation-acknowledged-means.md (at 76fa319a) @ 76fa319a`). |
| F4 | `line 37-38 of renderer/tests/style_shell_agreement.rs (at 76fa319a) @ 76fa319a` | The request has carried `columns` since `skp/0.6` (`line 441-447 of protocol/skp/src/v0/commands.rs (at 76fa319a) @ 76fa319a`; piece e did not move these lines). The shell sends `columns: null` (`line 122 of frontends/shell/src/skp/client.ts (at 76fa319a) @ 76fa319a`). The style type has no `match` variant (`line 18-22 of frontends/shell/src/style/document.ts (at 76fa319a) @ 76fa319a`). ADR-023 is Proposed (`line 3 of docs/adr/ADR-023-attribute-projection-on-viewport-query.md (at 76fa319a) @ 76fa319a`), and condition 1 is at `line 144 of docs/adr/ADR-023-attribute-projection-on-viewport-query.md (at 76fa319a) @ 76fa319a`. |
| F3a | `line 52-56 of frontends/shell/src/App.test.ts (at 76fa319a) @ 76fa319a`; `line 58-65 of frontends/shell/src/App.test.ts (at 76fa319a) @ 76fa319a` | `App` is mounted with `react-dom/client` and `act` (`line 4-18 of frontends/shell/src/App.layout.test.tsx (at 76fa319a) @ 76fa319a`; `line 9-21 of frontends/shell/src/App.lateResult.test.tsx (at 76fa319a) @ 76fa319a`). R1 is at `line 306 of frontends/shell/src/App.layout.test.tsx (at 76fa319a) @ 76fa319a`. The `key` is in item 1. |
| F3b | `line 24-25 of frontends/shell/src/admission/AdmissionPanel.test.ts (at 76fa319a) @ 76fa319a` | `AdmissionPanel` runs unmocked inside the mounted `App` (`line 6-9 of frontends/shell/src/App.layout.test.tsx (at 76fa319a) @ 76fa319a`). The CRS piece's CF1 test landed below the span (`line 38-40 of frontends/shell/src/admission/AdmissionPanel.test.ts (at 76fa319a) @ 76fa319a`). |
| F3c | `line 13-14 of frontends/shell/src/admission/CrsAssertionForm.test.ts (at 76fa319a) @ 76fa319a` | The same no-harness clause and its cite to F3b's file are still there. The two proofs are still listed below them (`line 17-24 of frontends/shell/src/admission/CrsAssertionForm.test.ts (at 76fa319a) @ 76fa319a`). |
| F10a | `line 195 of frontends/shell/src/residency/residencyStatus.test.ts (at 76fa319a) @ 76fa319a`; `line 189 of frontends/shell/src/residency/residencyStatus.test.ts (at 76fa319a) @ 76fa319a` | String 6 is ruled (`line 423-428 of frontends/shell/src/residency/residencyStatus.ts (at 76fa319a) @ 76fa319a`), and its constant is at `line 434-435 of frontends/shell/src/residency/residencyStatus.ts (at 76fa319a) @ 76fa319a`. |
| F10b | `line 236-238 of frontends/shell/src/canvas/pickResolution.test.ts (at 76fa319a) @ 76fa319a`; `line 1075-1079 of frontends/shell/e2e/regression.mjs (at 76fa319a) @ 76fa319a` | The value is ruled (`line 36-41 of frontends/shell/src/canvas/hoverRepickConstants.ts (at 76fa319a) @ 76fa319a`) and is `true` (`line 56 of frontends/shell/src/canvas/hoverRepickConstants.ts (at 76fa319a) @ 76fa319a`). The node is done (`PLAN.yaml:1193 @ 76fa319a`). The untouched `describe` title is at `line 239 of frontends/shell/src/canvas/pickResolution.test.ts (at 76fa319a) @ 76fa319a`. |
| F10c | `line 1760 of frontends/shell/e2e/regression.mjs (at 76fa319a) @ 76fa319a`; `line 1762-1763 of frontends/shell/e2e/regression.mjs (at 76fa319a) @ 76fa319a` | The cite still names lines 429-430, while the constant is at the F10a pin. The draft marker is as in F10a. The literal and the thrown message stay untouched (`line 1765 of frontends/shell/e2e/regression.mjs (at 76fa319a) @ 76fa319a`; `line 1830 of frontends/shell/e2e/regression.mjs (at 76fa319a) @ 76fa319a`). |
| OPEN-1 | `line 21 of kernel/src/lib.rs (at 76fa319a) @ 76fa319a`; `line 276 of kernel/README.md (at 76fa319a) @ 76fa319a` | Both still say, unqualified, that the stream writes nothing. Piece d's qualified sentences are at `line 38-42 of kernel/src/lib.rs (at 76fa319a) @ 76fa319a` and `line 93-96 of engine/README.md (at 76fa319a) @ 76fa319a`. Piece e merged and left the README line at the same number. |
| OPEN-2 | `line 251-254 of engine/src/identity.rs (at 76fa319a) @ 76fa319a` | The list names two callers. A search of the tree at B finds exactly three test callers of `candidate_columns()` (`line 202 of engine/tests/session_identity.rs (at 76fa319a) @ 76fa319a`; `line 166 of engine/tests/identity.rs (at 76fa319a) @ 76fa319a`; `line 750-755 of engine/tests/b1_projection_hostile_names.rs (at 76fa319a) @ 76fa319a`) and no product caller. |
| OPEN-3 (a) | `line 504 of engine/tests/admission_format_semantics.rs (at 76fa319a) @ 76fa319a`; `line 699 of engine/tests/admission_format_semantics.rs (at 76fa319a) @ 76fa319a`; `line 762 of engine/tests/admission_format_semantics.rs (at 76fa319a) @ 76fa319a`; `line 840 of engine/tests/admission_format_semantics.rs (at 76fa319a) @ 76fa319a` | Each calls ADR-013 Amendment 1 proposed. It is Accepted (`line 265 of docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md (at 76fa319a) @ 76fa319a`). |
| OPEN-3 (b) | `line 116-118 of engine/tests/session_identity.rs (at 76fa319a) @ 76fa319a`; `line 206-207 of engine/tests/session_identity.rs (at 76fa319a) @ 76fa319a` | Each calls ADR-016 Amendment 1 proposed. It is Accepted (`line 180 of docs/adr/ADR-016-stable-feature-identity-admission.md (at 76fa319a) @ 76fa319a`). |
| OPEN-3 (c) | `line 1292-1294 of kernel/tests/first_batch_factorial.rs (at 76fa319a) @ 76fa319a` | The retired word's figure is still there. ADR-018 item 1's instants are at `line 41-54 of docs/adr/ADR-018-what-cancellation-acknowledged-means.md (at 76fa319a) @ 76fa319a`. |

3. **A changed fact: F3d is held (§5, first invalidator).**
   - The stale span has not changed and is still stale: `line 122-125 of frontends/shell/src/canvas/WorkingCanvas.test.ts (at 76fa319a) @ 76fa319a`.
   - F3d's Says is untrue at B. Since C, the real `WorkingCanvas` has been mounted in jsdom with only deck's `Deck` class stood in: `line 4-15 of frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx (at 76fa319a) @ 76fa319a`, `line 33-55 of frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx (at 76fa319a) @ 76fa319a` and `line 107-108 of frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx (at 76fa319a) @ 76fa319a`.
   - No code of F3d starts until an appended row replaces its Says. The same fact removes the reason §2.5 gives for its second not-stale line (item 4).

4. **Same class, but not taken in by §2.5's rule.** These get no row here and are listed for a later piece.
   - `line 73 of frontends/shell/src/residency/residencyStatus.test.ts (at 76fa319a) @ 76fa319a`, `line 75 of frontends/shell/src/residency/residencyStatus.test.ts (at 76fa319a) @ 76fa319a`, `line 176 of frontends/shell/src/residency/residencyStatus.test.ts (at 76fa319a) @ 76fa319a` and `line 178 of frontends/shell/src/residency/residencyStatus.test.ts (at 76fa319a) @ 76fa319a`:
     - they call strings 1, 2 and 5 drafts;
     - those strings are ruled (`line 353-355 of frontends/shell/src/residency/residencyStatus.ts (at 76fa319a) @ 76fa319a`; `line 415-416 of frontends/shell/src/residency/residencyStatus.ts (at 76fa319a) @ 76fa319a`);
     - the node names string 6 only;
     - two of the four lines are `describe` titles, and E2 admits only one name change.
   - `line 702-706 of frontends/shell/src/canvas/WorkingCanvas.test.ts (at 76fa319a) @ 76fa319a`:
     - it carries the cannot-mount reason that item 3 removes;
     - it carries two line cites into `WorkingCanvas.tsx` that no longer point at the release listener, which is now at `line 1942-1952 of frontends/shell/src/canvas/WorkingCanvas.tsx (at 76fa319a) @ 76fa319a`;
     - it is outside the paragraph the node names.
   - Outside the files the node names: `line 77-81 of frontends/shell/src/residency/residencyArm.test.ts (at 76fa319a) @ 76fa319a` and `line 89-90 of frontends/shell/src/residency/residencyArm.test.ts (at 76fa319a) @ 76fa319a` say that `App` cannot be rendered in this suite.

5. **Gone, or no longer stale:** none. Item 3 records the one changed fact.
   - `line 19 of frontends/shell/src/App.lateResult.test.tsx (at 76fa319a) @ 76fa319a` is still not stale.
   - §2.5's four routing lines have not changed at B, and they stay with node `stale-assertion-messages-and-product-comments`.

6. **§7 at B.**
   - Every per-file ceiling holds for the rows as they stand, with one exception. It was found at the re-sweep and is not a moved line.
   - **`engine/tests/identity.rs`, ceiling 4.**
     - On one line, the new label's `Watchdog::new` call is 120 columns.
     - The tree has no `rustfmt.toml` or `.rustfmt.toml` at the root or in engine/. It formats such a call over three lines (`line 419-421 of engine/tests/slice.rs (at 76fa319a) @ 76fa319a`), and E4 requires the code to be fmt-clean.
     - So the file's count is predicted to be 6, and E1's one-removed, one-added does not hold for that line.
     - §7 and §5 are not edited. At H the count is recorded as class 8 and E1 as class 2. The line is never compressed, and the label is never shortened, to fit.
   - F3d's 8 holds for replacement words of at most four lines.
   - Nothing at B predicts more than 186 lines or 20 files.

7. **§4 items 3 and 4 at B.** These were found at the re-sweep; nothing is edited.
   - **Item 3.** Outside `state/`, the old name is live at B only in the files of F2 and F2r and in this form (§2.1 F2 and §4, as 2.0 (f) permits). As written, item 3 cannot hold at H.
   - **Item 4.** The new name is already at `PLAN.yaml:4477 @ 76fa319a`, `CUSTODIAN-QUEUE.json:61 @ 76fa319a`, `site/data/plan.json:7195 @ 76fa319a`, and in `state/consults/2026-10-11-stale-test-names-and-comments-architect-draft.md` (found by a search of the tree at B). This piece touches none of these files. Item 4's set of exactly four files cannot hold at H.

8. **Rule 00 at dispatch.**
   - This piece's paths are §2.6's 14 files, this form, `PLAN.yaml` and Amendment 1's four files. They are disjoint from PR #218's seven paths and PR #219's eleven, as the custodian lists them.
   - Neither PR touches `protocol/`, and neither does this piece: F4 only reads `protocol/skp/src/v0/commands.rs`.
   - F3a's fact cites read `src/App.tsx` and the mounted-`App` suites, and #219 edits `src/App.tsx` and `src/App.selection.test.tsx`. These are read-only crossings, not overlaps.

9. **Waits.**
   - The CRS piece is done (`PLAN.yaml:4825 @ 76fa319a`), and so is piece e (`PLAN.yaml:4412 @ 76fa319a`). So §2.6's two waits, §8 item 12 and OPEN-1's wait are met at B.
   - Only F3d waits, on item 3's appended row. Every other row may start at B.

10. **Superseded index:**
    - §2.1 D2's cites → item 1;
    - §2.1 F3a's `App.tsx` cite → item 1;
    - §2.1 F3d's Says → held, item 3;
    - §2.5's reason for its second not-stale line → items 3 and 4;
    - the waits in §2.3 OPEN-1 and §2.6 → item 9.

Nothing above is edited.
```

**Notes for you (outside the amendment):**

1. **What I read, and what still needs checking.** I read the working tree of the main checkout. At session start it was at HEAD 76fa319a, and git status showed only untracked files. I have no shell, so:
   - Please recompute every pin at 76fa319a.
   - For each row in item 2, compare the base's hash at the same line numbers against the C pin in §2.1/§2.3. If any hash differs, the text changed and that row comes back to me.
   - For D2, the move in item 1 is only a pure move if `line 553-562 of kernel/tests/manual_walkthrough_fixtures.rs (at 76fa319a)` at the base hashes to the C pin's d5be05a3….

2. **Replacement words for F3d** (§31). This is the architect's Says, not your wording.
   - They replace lines 123-125 of the stale span (6 lines counted). The quoted span from NEXT-CUT that starts on line 122 stays byte-identical.
     > one re-render path." `applyStyleChange` is the pure seam this drives, with no mount. The real `WorkingCanvas` is mounted only in `WorkingCanvas.wiring.test.tsx`, with deck's `Deck` class stood in because jsdom provides no WebGL context, and that file drives no style change.
   - Each clause checked against the code at the base:
     - *pure seam*: `WorkingCanvas.tsx:697-703`, and the test calls at `WorkingCanvas.test.ts:126-131`.
     - *with no mount*: `WorkingCanvas.test.ts` imports neither React nor a root.
     - *mounted only in the wiring test*: it is the only test that imports the default export (`:61`, `:108`). The four `App` suites mock `./canvas/WorkingCanvas`.
     - *`Deck` stood in*: `WorkingCanvas.wiring.test.tsx:33-55`.
     - *no WebGL*: `App.layout.test.tsx:13`.
     - *drives no style change*: the only style in the wiring test is the constant `DEFAULT_STYLE_STATE` at `:105`.
   - You name the class. The round-14 test-text exception to class 3 may cover it; if not, it is a pre-code correction of a planned claim.

3. **§4 items 3 and 4.** Both fail at H on files this piece does not touch. If you carry a correction before code, my suggested sets are:
   - item 3: the `state/` records plus this form;
   - item 4: the four files listed, plus the four files item 7 names that already carry the name at the base.

   If you carry nothing, the worker records class 2 at H.

4. **The identity.rs overrun (item 6).** This defect has been in the form since it was drafted. Please put it in the worker brief, so the worker does not compress the line to stay within the ceiling.

5. **Item 4's later-piece list.** These lines have no node yet; they are candidates for `stale-assertion-messages-and-product-comments` or for a new node you place. The `describe` titles at `residencyStatus.test.ts:75` and `:178` are test-name changes.

6. **If #219 merges before this piece's PR,** the reviewer should re-read F3a's not-pinned clause at the PR's merge base, since #219 edits `App.selection.test.tsx`.

7. **Quotes and names.** The amendment quotes nothing and names neither the old nor the new test name. That keeps it outside §4 items 3 and 4 and away from `verify-test-claims`.

Files read:
- C:/dev/spatial-ide/frontends/shell/STALE-TEST-NAMES-AND-COMMENTS-PREREGISTRATION.md
- C:/dev/spatial-ide/frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx
- C:/dev/spatial-ide/frontends/shell/src/canvas/WorkingCanvas.test.ts
- C:/dev/spatial-ide/engine/tests/identity.rs
- C:/dev/spatial-ide/engine/tests/slice.rs
- C:/dev/spatial-ide/kernel/tests/manual_walkthrough_fixtures.rs
- C:/dev/spatial-ide/frontends/shell/src/residency/residencyStatus.test.ts
- C:/dev/spatial-ide/frontends/shell/src/residency/residencyArm.test.ts
