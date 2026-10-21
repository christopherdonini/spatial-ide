Reviewed: PR #239 at b936965497436c210589de0226c105b3fce7a84c (base 9a8bd442), gate 1, reviewer
Branch: cut/walkthrough-current-view-rows-g1-n5 @ b936965497436c210589de0226c105b3fce7a84c
Verdict: PASS

The gate passes and nothing needs changing. Every check below ran, and none found a defect.

**Correctness:** none.
- G1's three new sentences hold at H:
  - Availability is `getViewBox() !== null`, read at `frontends/shell/src/publish/PublishPanel.tsx:382`.
  - The view box is written only through `showBox` (`frontends/shell/src/App.tsx:2128`), from three callbacks: `onViewShown`, `onViewportChanged` and `onViewportWithinLastQuery`.
  - It is cleared only at the admission (`frontends/shell/src/App.tsx:1108`). A grep of `viewBox.set` finds exactly those two sites.
  - The automatic fit runs at the first batch with geometry (`frontends/shell/src/canvas/WorkingCanvas.tsx:1534-1541`, `:1738-1742`). Its unreported arm calls `onViewShownRef` (`:1403-1407`). `fitToExtent` has no early return: its width and height fall back to 1.
  - The resize route needs a non-null camera (`:2041`).
  - The reason `<p>` renders only when the option is disabled, after both radios inside the fieldset (`PublishPanel.tsx:688-690`).
- N5's new words hold at H:
  - `useState<PublishScopeChoice>("current")` is at `:381`.
  - `PublishControls` is at `:647`, and Whole dataset's input has no `disabled` attribute (`:668-674`).
  - `RefusalBlock` renders on `state.kind === "refused"` (`:750`).
  - `is_geographic_degrees_instance` is at `engine/src/dataset.rs:1040`, called at `kernel/src/publish/mod.rs:474` inside `preflight_pinless_parts`. The identifier and `as_str` fill the placeholders at `:475-484`.
  - `preflight_pinless` is called inside `prepare_with_progress` (`frontends/shell/src-tauri/src/publish.rs:424`), and `ShellApproval::new` is at `:790`.
  - `GeographicCrsNotPublishable`'s `Display` is at `kernel/src/publish/error.rs:391`. The `publish.geographic_crs_not_publishable` case is at `frontends/shell/src/admission/formatRefusal.ts:118`.
  - "no test asserts it verbatim" still holds: grepping the guidance text in `*.test.*` under `frontends/shell` finds nothing (rc 1). The same pattern is positive on `formatRefusal.ts` (count 1, rc 0).
- The reason sentence is byte-equal to `CURRENT_VIEW_DISABLED_REASON` at H (107 bytes). It is also byte-equal inside the source form's line 161 at 54d072687e79.
- Code is unchanged from C to H: `git diff --stat 54d07268 HEAD -- frontends/shell/src frontends/shell/src-tauri kernel engine` printed 0 bytes (rc 0). Main has not touched code or the walkthrough since B (`git diff --stat B origin/main` on those paths printed 0 bytes, rc 0).
- The dev seam `e2eSetViewState` (dev-only) is already named in the form's §2.1. It does not block.

**Evidence:** none.

**Documentation:** none.

**Checked:**

1. **The diff** (§8 items 1 and 2).
   - `git diff origin/main...HEAD` → rc 0. One file, `frontends/shell/MANUAL-WALKTHROUGH.md`, +2 −2, in one commit (b9369654).
   - `git diff -U0 B...HEAD` → rc 0. Hunks `@@ -324 +324 @@` and `@@ -948 +948 @@`.
   - No code, no test, nothing under `scripts/plan/`.
2. **§4 items 1 to 4**, by my own script (`node ev.mjs` in my scratch folder) → rc 0, all PASS.
   - Item 1: exactly 2 hunks, each with one line removed and one added, starting `| G1 |` and `| N5 |`. Self-tested at B: G1 is line 324 and N5 line 948, each row unique. A whole-file line comparison of B and H differs only at [324, 948]. Neither file has a CR.
   - Item 2: the const pattern is positive at B. The row's `*"…"*` extraction equals the const at H, byte for byte, and appears once.
   - Item 3: masked comparison. With the spans masked, G1 and N5 are identical between B and H. N5's two italic quoted spans are byte-identical between B and H.
   - Item 4: "No settled view yet" occurs 1 time at B (positive) and 0 times at H. "settled view", case-insensitive, occurs 0 times at H.
   - §2.0(a) holds. No new bare `path:line` appears in any new span. The only line cites left in N5 are `engine/src/geoparquet.rs:257-258` and `OWNER-INVALIDATION-PREREGISTRATION.md:535-539`, both kept by §2.3 item 5 and its "Still reading, kept" line.
3. **Spans against the report**, by the same script (rc 0).
   - The report's old and new spans were extracted by script from `state/consults/2026-10-21-walkthrough-current-view-rows-g1-n5-worker-report.md` at 9a8bd442: lines 27, 30, 33, 36, and items 39 to 45.
   - Each old span occurs exactly once in B's line.
   - Applying the 1 G1 span to B's G1 reproduces H's G1 byte for byte. Applying the 8 N5 spans (W-N5 plus §2.3 items 1 to 7) to B's N5 reproduces H's N5 byte for byte.
   - §2.3 item 1's new words match the form's given words.
4. **E2 at H**, in `C:/dev/wt/wcv`. Each tool's last commit at H is named; the tool files are identical on origin/main (`git diff --quiet`, rc 0).
   - `verify-cites.mjs` (a382c508) → rc 0, PASS, 2139 files, 106 loose references advised. The only `MANUAL-WALKTHROUGH.md` advisory is the existing `:890`, outside this diff.
   - `verify-quotes.mjs` (c3e70acb) → rc 0, PASS: 130 checked, 99 verified, 30 baselined.
   - `verify-test-claims.mjs` (fb42c259) → rc 0, PASS: 574 tests, 183 files.
   - `verify.mjs --offline` (8dd1e7af) → rc 0, PASS.
   - `queue.mjs --check` (deb56edd) → rc 0, current.
   - `site.mjs --check` (f9444a4d) → rc 0, current.
   - `git status --porcelain` afterwards → rc 0, empty.
   - CI's `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, inside a shared hold:
     - The hold was granted (MACHINE_HOLD shared, cores 0-7) and released (MACHINE_RELEASED).
     - The call ends `exit $rc` per the shape, and the tool reported no error, so rc 0.
     - 509 tests: 509 pass, 0 fail, 0 cancelled, 0 skipped.
     - `CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8` were set as a prefix on the command step, inside the shape.
   - E3, `gh pr checks 239` → rc 0, all pass: sign-off, profile path, ported-notices ×2, tauri build ×2, typecheck/build/vitest/cargo test ×2.
     - `gh run view` on all 6 runs: headSha is b9369654 on each, conclusion success.
     - `gh pr view 239`: head b9369654, base main, MERGEABLE.
5. **§7.**
   - `git diff --numstat B...H -- frontends/shell/MANUAL-WALKTHROUGH.md` → rc 0, `2 2`: 4 lines, at the ceiling of 4.
   - `git diff --name-only B...H` → rc 0, one file.
   - The same with `origin/main...HEAD` → rc 0, one file.
6. **Pins** (`node pins.mjs` in my scratch folder) → rc 0.
   - 86 pin occurrences, 78 unique. Every one recomputes at 54d072687e79f8cb9a77ca942aa6809dad4e326b (the cited lines, LF, one final LF): 0 bad.
   - 54d07268 is an ancestor of origin/main (`merge-base --is-ancestor`, rc 0).
   - No pin is split across lines.
   - The 7 unpinned backticked cites are exactly the ones Amendment 1 item 3 leaves as written: §2.0(c)'s cite at B, and the row text in §2.3 items 1 to 7.
   - DOC-4 (`state/consults/gates/2026-10-14-export-current-view-after-unreported-fit-gate1-reviewer.md:91-93`, read with `sed`, rc 0) names G1 `:324` and N5 `:948`. This PR closes both rows.

Nothing written outside my scratch folder. The worktree is clean (porcelain empty, rc 0).
