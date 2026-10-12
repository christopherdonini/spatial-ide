# Rulings — every open item of the eight forms committed at 6f45e31a, red lines included (the human, verbatim)

*Custodian's filing note (2026-10-09): typed by the human as a new message, received at 08:37:12Z by the transcript (a user turn, origin human). Below the rule, byte-copied by script from the transcript with one final newline added, with nothing else, is the message (from line 6 to the end). It answers the open items of the forms for `e2e-hover-establishing-read-stale`, `covering-names-missing-column`, `shell-map-refill-after-resize`, `shell-migration-milestone-2`, `skp-drained-stream-helper-post-check-race`, `wire-bytes-invariant-trace-flag-race`, `ported-code-notice-route` and `guardian-v1` (Amendment 7). It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
Rulings on every open item of the eight forms committed at 6f45e31a. These are my typed words, red lines included; each option is written out. Record each form's answers as its Amendment 1 (Guardian by its own class 9 route) before dispatch. Nothing here adopts a dependency or a port. Slot orders are unchanged.

1. e2e-hover-establishing-read-stale
- OPEN-1: (a). A9' is fixed with the same barrier.
- OPEN-2: (b). If routes A and B both fail, stop and come back to me. No product code under this form.
- OPEN-3: (a). A fixed sleep or a count of frames is not a valid wait.
- Placement: put the barrier, and the read that follows it, in e2e/lib.mjs, exported, with regression.mjs as the caller. Milestone 2's selection suite and the later first-poll node must call the same function. Amend the file scope, the declared-unchanged list and the budget for that before dispatch (two files, the same 140-line ceiling). If the architect finds it cannot live there, tell me, and milestone 2's re-sweep carries the move instead.
- Mutations M2, M3, M4 and M5: allowed, on the terms of my 2026-10-08 allowance. Only the product lines section 4 names, in this piece's worktree only. One at a time. After each run the file is restored and the worktree shown clean before the next. Nothing committed, pushed or left in place. The report gives, for each, the edit, the step that failed and the clean check. The same terms cover a temporary edit needed to get the odd map height. If the permission system refuses, stop and tell me. Do not route around it.

2. covering-names-missing-column
- OPEN-1: (A). The file opens and the covering is dropped at open. A bbox query refuses engine.no_covering_bbox before the mint. Streams without a bbox and an export without a bbox keep working.
- OPEN-2: (a), my wording now, so no placeholder ships.
  - The detail: the covering names `<path>`, which the file's schema does not contain
  - KNOWN-LIMITATIONS item 9, one sentence appended: A file whose `covering.bbox` names a column the file does not contain opens, and is refused the same way when the view is queried; the refusal names the missing column.
- The two cases the P0 did not cover (a non-ASCII child name; two names differing only by case): add both to the may-not-claim list. Append a proposed node for the second: the binder may bind the covering to the other column, which is a wrong-rows risk that predates this piece. I grade and place it later. It does not block this piece.

3. shell-map-refill-after-resize
- OPEN-1: (A). After a shrink, the Export panel's Current view is the area the map shows. No query is issued.
- OPEN-2: (A). Before the first pan, zoom or Zoom to layer, a change of size asks for nothing.
- Item 39's wording in section 2.5: approved as drafted.

4. shell-migration-milestone-2
- OPEN-1: (A). The click takes its own pick at the tap's pixel, through the one function the settle re-pick also uses. It never reads the hover readout or deck's pointer-down info.
- OPEN-2: package (a), fixed as follows.
  - In Select, a click on a feature changes the selection only. It does not inspect.
  - In Navigate, a click on a feature inspects only. It does not switch the Inspector's tab and does not open a closed Inspector. Row V3 also asks me whether I expected the Feature tab to come forward.
  - A click on nothing never changes the selection, in any tool or mode. In Navigate it clears the inspected feature unless that feature is pinned. One test row for it.
  - Cursors: Navigate keeps crosshair. Select uses the arrow (CSS default). A drag keeps grabbing and still pans in both tools.
  - The tool switch and the mode picker are in the top bar, each tool with one line saying what a click does. The picker shows only while Select is active.
  - Keys: N for Navigate and S for Select, bare keys, with the guards section 2.2 lists.
  - Default mode: Add / remove. There is no undo in this milestone, and in this mode a stray click cannot throw a built selection away.
  - Outlines: selected solid blue, inspected solid amber, both placeholders I sight at the sitting. No dashed line and no new dependency. A feature that is both selected and inspected shows both; the architect declares how in section 7 and UB9 asserts it.
- OPEN-3: (a). While pinned, a Navigate click does not replace the inspected feature. It is not silent: the last-click line shows what was clicked and that the pinned feature is kept. Unpinning restores normal inspection. No dialog.
- OPEN-4: (A). The export's scope is what ADR-024 builds: the whole file or the current view. The filter is not applied, as the existing sentence says, and the selection is never used. One sentence in the Export section says the selection is not used. The host prompt, src-tauri and ADR-024 are unchanged. The plan's sentence in 6.4 that the export uses the layer's filter was wrong against ADR-024; ADR-024 stands.
- OPEN-5: (a), if EXPORT-TODAY shows H4 holds. While an export runs, opening another dataset or closing this one first asks, with two choices. Keep exporting: the open or close is dropped, nothing is queued, and I open again when the export has ended. Cancel the export and go on: the old dataset closes once the export has released it. Never a silent cancel, never a queued open. If EXPORT-TODAY shows the export already waits or asks, nothing visible changes and you tell me what it showed.
- OPEN-6: (b). The hover readout stays over the map. The Feature tab carries the inspected feature in the same id format.
- OPEN-7: (A). Milestone 2 shows Selected, ignoring filter. Filtered, and Selected within the filter, first appear with milestone 4's table.
- OPEN-8: (A). Both exceptions under canvas/ are allowed: fitToBbox as a handle method that reuses fitToExtent, and HoverReadoutView's id line and two refusal texts exported with the rendered text unchanged. Nothing else beyond section 2.7's list.
- OPEN-9: (a). Approved as they stand: Feature, Navigate, Select, Add / remove, Replace, Add only, Remove only, Pin, Zoom to selection, Clear selection. Everything else is sighted at the sitting.
- OPEN-10: (b). Two PRs. Phase A merges first.
- The walkthrough Part takes the next free letter after map-refill's Part V. Its rows are renumbered in the re-sweep amendment.

5. skp-drained-stream-helper-post-check-race
- OPEN-1: (1). Part B is in scope: the two tests in engine/tests/session_identity.rs.

6. wire-bytes-invariant-trace-flag-race
- OPEN-1: (1). Neither sibling site enters this piece. Append one proposed node for each: first_batch_factorial's two ignored tests, and slice.rs's traced test with its own form, because it bears on a docs/08 budgeted assertion. I place them later.

7. ported-code-notice-route
- OPEN-1: (a). A port may carry MIT, BSD-2-Clause, BSD-3-Clause, ISC, 0BSD, Apache-2.0 (with any upstream NOTICE file pinned), Zlib or BSL-1.0. Any other licence is a per-port ruling of mine. Every port still needs my typed word.
- OPEN-2: (a). The header is AGPL-3.0-or-later AND <upstream id>, with the project's copyright line, the upstream copyright lines exact, and a Ported-From line. The containing package's license field does not change, and no check enforces it.
- OPEN-3: (b). The wording lands latent. I sight it in the first port piece, which does not merge before I have.
- OPEN-5: (a). It is a port whenever upstream source was read while writing. Read means upstream source text was in the context of the agent that wrote the code: fetched, or quoted in its brief or in a note it read. A note that describes an approach in its own words, citing repository, commit and path, is not upstream source. A fresh write works from a published description only, and its form cites that description. Every form that draws on the reuse index says, for each candidate it uses, port or fresh write.
- OPEN-6: required. I add it to the required checks myself after its first green run on main. Tell me the exact check name then.
- A build from a source archive must still work. When the tree is not a git checkout, generateNotice runs the registry-side checks, prints one named line saying unregistered markers were not searched, and goes on. In a git checkout whose listing fails, it fails as the form says. One test row for each case. The architect defines the test for "not a git checkout".
- CI: the new workflow installs nothing. Checkout and Node are set up as governance-ci's cfg-boundary job has them, with contents: read and no npm install.
- The AUTONOMY.md label finding is not fixed in this PR. It stays with the weekly window.
- OPEN-4: (a). I accept this note. It is appended to ADR-030 before this piece merges:

## Appended note — 2026-10-09, ported source files (reopen 4)

**Context.** A file ported from an outside project into this repository's own source is a third-party work that no build manifest reports as third-party: the viewer's metafile lists it as first-party input, the shell's Vite manifest drops first-party modules, and Cargo sees only first-party crates. Comments are stripped and Rust is compiled, so the file's own header does not ship.

**Decision.** A fifth set, enumerated from the in-tree registry `LICENSES/third-party/ported/MANIFEST.json`, whose pinned texts are re-hashed at every generation. Viewer notice: the registered files that are inputs of the viewer's esbuild metafile (exact). Packaged application notice: every registered file, over-inclusive by design, stated in the section's own intro as a registry and not a build manifest. A repository check, and the packaged build from a git checkout, fail closed in both directions: on a marked file without an entry, and on an entry without a marked file or a pinned text.

**Consequences.** No artifact built from a git checkout ships a marked port without its notice. A build from a source archive that is not a git checkout checks the registry side only (the pinned texts, the registered files and their headers, the licence ids) and says so by name; the repository check covers the other direction for every merged commit. An unmarked copy is not detectable mechanically: review and DCO (b) cover it. A separately conveyed kernel artifact, or any other new channel, reopens this ADR under the existing Reopen condition.

8. guardian-v1, Amendment 7
- OPEN-7: (a). G8 refuses tool writes only. A shell write to the main checkout's .claude/settings.local.json is not read, and the README states that limit.
- The build of record: I accept Part B. The version printed at P0e (a) is the build of record for the whole piece. If a later run prints a different version, I2 fires and it comes to me.
- E15: named. Run it with the other E-rows, after my merge click and my reload. If a permission prompt appears, I decline it. An inconclusive row is recorded as inconclusive, not as a pass.
- Installing, enabling and reloading stay mine. The merge waits for my typed approval after both gates.
