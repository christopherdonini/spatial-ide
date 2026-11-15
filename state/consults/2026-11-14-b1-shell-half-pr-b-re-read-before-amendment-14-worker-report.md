*Custodian's filing note (2026-11-14): the worker's re-read of PR B's whole amended list at main 57451bb3, before Amendment 14 (the architect's draft's OPEN-1 (a); Amendment 14 items 4 and 8), its brief given as the prompt, byte for byte (8396 bytes, sha256 9bff4969f9d7a1b1774ec42a319f0a1ecba945b81e2006410047171efe30dc2a). Dispatched at 2026-11-14T06:46:29Z by its transcript; handed back at 2026-11-14T06:59:27Z (claude-sonnet-5-5, worker-high; calls Bash 35, Read 7, Write 6, Edit 1 and the hand-back, 50 in all; none errored). Its Write and Edit calls are all scratch files; it made no commit and no push. The report below was extracted by script from the hand-back in that transcript (18223 bytes, sha256 8f215d123707292300dd2235aa3d51bdd44b2fdb87684033bc3df5a014450920); nothing is changed. Its departures are in its last section.*

---

Re-read: b1-shell-half PR B before Amendment 14, at main 57451bb3ea644e01882cb086fbd436e3d2047cef, worker-high

VERDICT: no invalidator, no I4. None of the five signatures differs from b7b721eb. No pin of §0.2, Amendment 12, Amendment 12 continued or Amendment 13 differs in anything but a move, a declared change or a record. Class 3 items for the custodian:
- 23 moved ranges (16 in §0.2, 7 in Amendment 12).
- KNOWN-LIMITATIONS.md 72-81 and line 80 are Changed. They are record pins, still Changed since the M′ re-read.
- KL-3's number: 64 is now held by the merged first-look item, so KL-3 reads 65 (Step 6).

**Start (all as given)**
- `fetch` rc 0. `origin/main` is 57451bb3ea644e01882cb086fbd436e3d2047cef.
- `origin/cut/b1-shell-half-pr-b` is 6649a443a38763759339c7813e3fdbe9eca09be0 (M′).
- 6649a443^2 is bb8835c6701826f38030c51a095a8f83e7a3c52a.
- The form at 57451bb3 has sha256 051fd934b09eba3a482ca42389da4634abe3115edd4c3b720d653a071357d248.

**Step 1: `git diff --name-only bb8835c6 57451bb3`**
- 115 paths, in `<S>/a14rr-paths.txt`. 23 are outside governance/, state/ and site/ and are all listed below.
- The other 92 are 13 under governance/, 77 under state/ and 2 under site/. 11 governance, 77 state and 2 site paths hold no pin and are not listed. The 2 governance paths that are (a) are listed.
- No governance, state or site path holds a changed pin. The pinned state/ files are all older than bb8835c6.
- Marks: (a) in PR B's list (Amendment 12, with Amendment 5, the session-end draft's nine test files, Amendment 13 item 3 and the draft Amendment 14's `e2e/colour.mjs`); (b) holds a pin; (c) neither.
- The literal `git log --merges ... -- <path>` printed nothing. I checked it on `publish/types.ts`: path simplification drops the PR merges. I used `git log --first-parent --format='%h %p|%s' bb8835c6..57451bb3 -- <path>` instead. It lists each first-parent commit that touched the path.

| Mark | Path | Merge on main |
|---|---|---|
| c | `.github/workflows/` adr-003-spike-ci-linux.yml, adr-003-spike-ci-macos.yml, product-ci-rust.yml, product-ci-shell.yml, product-ci-viewer.yml, rust-fmt.yml, tauri-build.yml (7 files) | 8c693657 (#315) |
| a+b | KNOWN-LIMITATIONS.md | 73bd322b (#316), aa415f51 (#312) |
| c | docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md | 204c1762 (#314) |
| a+b | frontends/shell/MANUAL-WALKTHROUGH.md | 204c1762 (#314) |
| a | frontends/shell/e2e/README.md | 204c1762 (#314) |
| c | frontends/shell/e2e/publish.mjs | 204c1762 (#314) |
| b | frontends/shell/src-tauri/src/publish.rs (§0.2 pin 45, Amendment 12 pin 45) | 204c1762 (#314) |
| c | frontends/shell/src/App.command.test.tsx | 204c1762 (#314) |
| a | frontends/shell/src/App.selection.test.tsx (session-end table, allowance unused) | 204c1762 (#314) |
| c | frontends/shell/src/publish/ PublishDialog.test.ts, PublishDialog.tsx, PublishPanel.test.ts, types.ts | 204c1762 (#314) |
| c | kernel/README.md, kernel/tests/built_targets/mod.rs, kernel/tests/scale_pass.rs, kernel/tests/verify_bundle.rs | 6edbfa71 (#313) |
| a | governance/PLAN.yaml | none; 33 direct main commits |
| a | governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | none; direct commit f14e1bc8 |

Branch-side check, to the merge you plan:
- The paths PR B's branch changed since bb8835c6 are 16 phase files, all under `frontends/shell/src` (`git diff --name-only bb8835c6 6649a443`).
- Their intersection with the 115 paths is empty (`comm -12`). Merging main into the branch is therefore path-disjoint.

**Step 2: every pin at 57451bb3** (script `<S>/a14rr-pins.mjs`, output `<S>/a14rr-pins.json`)
- Pins were parsed from §0.2 (form lines 54-116), Amendment 12 (1551-1819), Amendment 12 continued (1821-1866) and Amendment 13 (1868-1879).
- Each hash was first recomputed at its own pinned commit. All 126 reproduced, 0 failures.
- Moved means the same bytes were found once elsewhere. There were no multi-match cases.

| Group | Pins | Distinct ranges | Same | Moved | Changed |
|---|---|---|---|---|---|
| §0.2 @ 4b26d279 | 56 | 56 | 23 | 16 | 17 |
| Amendment 12 @ b7b721eb | 66 | 64 | 55 (57 pins) | 7 | 2 |
| Amendment 12 continued @ ad22478f | 2 | 2 | 2 | 0 | 0 |
| Amendment 13 @ 6f4a89e5 | 2 | 2 | 2 | 0 | 0 |
| Total | 126 | 124 | 82 | 23 | 19 |

Moved, §0.2 (16), class 3. Each new range equals Amendment 12 item 2's, except the three noted:
- SKP-V0.md 1149-1171 → 1170-1192
- SKP-V0.md 1179-1181 → 1200-1202
- SKP-V0.md 1196-1211 → 1217-1232
- SKP-V0.md 83 → 89
- App.tsx 1561 → 1650
- App.tsx 1674 → 1765
- engine/README.md 325-336 → 329-340
- pick.ts 134 → 135
- workspaceState.ts 68-86 → 72-90
- viewTransitions.ts 34-38 → 35-39
- viewTransitions.ts 157 → 158
- document.ts 56-61 → 55-60
- document.ts 109-118 → 108-117
- publish.rs 1225-1246 → 1286-1307. Amendment 12 gave 1258-1279. #314 added 28 lines above.
- engine/src/fixture.rs 860 → 998
- MANUAL-WALKTHROUGH.md 1927 → 1930. Amendment 12 gave 1929, and the S1 fix's A7a row added the one line.

Moved, Amendment 12 (7), class 3:
- publish.rs 1258-1279 → 1286-1307
- MANUAL-WALKTHROUGH.md 1929 → 1930
- KNOWN-LIMITATIONS.md 506 → 507
- WorkingCanvas.tsx 181-182 → 183-184
- MANUAL-WALKTHROUGH.md 273 → 274, 277 → 278 and 469 → 470

Against the M′ re-read:
- It found 15 Amendment 12 pins Moved. Here the App.tsx pins (1650, 1765, 1203-1221 and the rest) and `pick.ts:135` are Same.
- The reason is that the session-end phase (0b247f29) is on PR B's branch only. Main's App.tsx and pick.ts are blob-identical to b7b721eb.
- After main is merged into the branch, those pins sit where the M′ re-read put them.

Changed, §0.2 (17), each already Changed at b7b721eb and declared:
- Pins 5, 6, 7, 8, 16, 17, 18, 20, 21, 24, 30, 39, 46, 49, 50 and 51 are in files whose blob at 57451bb3 equals the blob at b7b721eb (checked with `git rev-parse`, `<S>/a14rr-changed.txt`). Nothing has changed there since Amendment 12.
- Amendment 12 item 2's replacement pins for them are all Same at 57451bb3.
- Pin 55 (KNOWN-LIMITATIONS.md 72-77 @ 4b26d279): the lines at 57451bb3 hash 55ac662184b69a3b…, equal to b7b721eb. Same as at b7b721eb, Changed only against 4b26d279.
- None is a signature item 10 names.

Changed, Amendment 12 (2), both record pins that Amendment 12 item 1 reads as not I4. These are two of the three the M′ re-read reported.
- KNOWN-LIMITATIONS.md 72-81 @ b7b721eb. Only line 80 differs. Lines 72-77 and 78 (the R-4 comment, Amendment 12 item 1) are Same.
- KNOWN-LIMITATIONS.md 80 @ b7b721eb. The line is unchanged since the M′ re-read (the same lines 72-81 and line 80 hashes at bb8835c6 and 57451bb3). f56d6efe rewrote it before bb8835c6. Line 80 at 57451bb3, byte-copied:
  `   **On `main` (not the v0.1.0 artifact above).** Opening a file also clears the filter cards, not the filter alone. Each filter you apply and each style change you commit is written to the session record item 43 describes. Saving the project writes the filter, its cards, the style and the view to the project file. Nothing yet restores a filter, a style or a view from that record or from a project file.`

The three the M′ re-read reported, against 57451bb3:
- (i) The two KNOWN-LIMITATIONS pins above are still Changed.
- (ii) `pick.ts` 50-62 @ b7b721eb is Same on main. `pick.ts` at 57451bb3 has blob 2b66de21…, equal to b7b721eb's, and its lines 50-62 hash d9cc5072…, the pinned hash. It is Changed only on the branch (blob 5bc91333… at 6649a443), by 0b247f29, which is PR B's own commit.
- (iii) The number 64 is now held by the merged first-look item (Step 6). Amendment 12's `KNOWN-LIMITATIONS.md:506` is Moved to 507.

**Step 3: paths marked (a) or (b)**
- Hunks come from `git diff bb8835c6 57451bb3 -- <path>`. Copies are in `<S>/a14rr-d-*.diff` and `<S>/a14rr-kl.diff`.

| Path | What changed (hunks) | Touches PR B's list or a pin? |
|---|---|---|
| KNOWN-LIMITATIONS.md | Hunk @ old 451 (#316): item 47's last sentence gains the name-floor sentence, plus a comment line. +2 lines. Hunk @ old 506 (#312): a blank line, item 64 and its comment appended. +3 lines. | Items 4, 51, 54, 56, 59 and KL-3 are untouched. Pin 506 → 507. KL-3's number must change (Step 6). Pins 72-81 and 80 stay Changed (Step 2). |
| frontends/shell/MANUAL-WALKTHROUGH.md | Two in-place row replacements (#314): the Part G row G3 (old line 333) and the `APPROVED'` coverage row in Part G's table (old line 398). Line count is unchanged. | PR B edits Part AC, Part F rows and the Part F pointer. No pin lies in lines 333 or 398, and every walkthrough pin is Same or Moved only as in Step 2. |
| frontends/shell/e2e/README.md | One hunk, old lines 188-203 (#314): the `APPROVED'` publish-suite entry. +5 -3, net +2 lines. | PR B's `colour.mjs` entry is a separate entry. The last entry's heading moves 842 → 844. No pin. |
| frontends/shell/src-tauri/src/publish.rs | Four hunks (#314), all additive: +27 at old 301 (the `published_columns` field and `compose_published_columns`), +1 at old 667 (the call), +101 at old 1877 (tests), +1 at old 2641 (tests). | PR B never edits src-tauri. Pin 45's bytes are Same, moved +28. |
| frontends/shell/src/App.selection.test.tsx | One line replaced (#314): `promptFixture()` gains `published_columns: "Columns published: id and the geometry only."`. | Amendment 13 item 3 allowed 3 lines; this is 1. `git diff --name-only bb8835c6 6649a443` shows the branch leaves the file untouched, so the merge is clean. |
| governance/PLAN.yaml | 12 hunks, 339 diff lines. Node b1-shell-half's summary is rewritten (CODE WAITS 2026-11-14, ADV-2026-11-14-10). | A record. No pin. |
| the form | One hunk, +13 lines at old 1864: Amendment 13 appended. | Its 2 pins were hashed in Step 2 (both Same). |

The five signatures at 57451bb3, against b7b721eb (script `<S>/a14rr-sigs.mjs`). All Same, so no I4.

| Signature | Lines at 57451bb3 (byte-copied) | Result |
|---|---|---|
| `pushBatch` | `WorkingCanvas.tsx:125`: `  pushBatch(streamHandle: string, batchSeq: number, ipcBytes: Uint8Array, filter: Filter \| null): number;` | Same (line 123 at b7b721eb, sha16 168599c5c1dcbff1 both) |
| `pushTileBatch` | `:220`: `  pushTileBatch(tileKey: string, streamHandle: string, batchSeq: number, ipcBytes: Uint8Array, filter: Filter \| null): TileBatchIngestOutcome;` | Same (218 → 220, sha16 6e2b3d33d8ad6b95) |
| `currentView` | `:150`: `  currentView?(): { centre: [number, number]; zoom: number } \| null;`. The comment and declaration at 145-150 equal 143-148 at b7b721eb (sha16 2b33fd60fafc2721). | Same |
| `WorkingCanvasHandle`, whole interface | 115-337 equals 113-335 at b7b721eb (sha16 5d110b5e92c67d8c) | Same |
| `TableSource` members | `tableSource.ts` blob 5510513cb41d… at both commits. `subscribe` 109, `getSnapshot` 113, `start(filter: Filter \| null): Promise<void>` 116, `cancel(): void` 167, `end(): void` 179, `dispose(): void` 191. `TableSnapshot` 40-48. | Same |
| `StyleState` | `document.ts` blob b0b2c7fa39d3… at both commits. Lines 55-60: `export interface StyleState {` / `fillColor: string;` / `fillOpacity: number;` / `outlineColor: string;` / `outlineWidth: number;` / `}` | Same |

**Step 4: the draft Amendment 14's interface**
- Script: `<S>/a14rr-draftpins.mjs`. Output: `<S>/a14rr-draftpins.txt`.
- The draft's item 1 makes 15 pins @ 54ee3522. The cited whole lines are byte-identical at 54ee3522 and 57451bb3, and the file blobs are identical. All 15 are Same.
  - The directive line 21 and the findings form 95-98.
  - publish.rs 1945-1948, 592-597, 711, 322-331 and 697.
  - ADR-017 228-229.
  - PublishPanel.tsx 472-474, client.ts 132 and commands.rs 581-583.
  - types.ts 48-51 and PublishDialog.tsx 261-264.
  - e2e/publish.mjs 363-369 and 379-383.
- Its item 3 makes 4 more pins, all Same: the consult line 145, publish.rs 1299-1307 and 320-321, and ADR-017 118.
- Only docs commits separate 54ee3522 and 57451bb3: `git diff --name-only` outside governance/, state/ and site/ is 0 paths.
- The draft's filing note says 20 placeholders. I find 19 pins, and 21 occurrences of the string, including the two mentions in the note and the preamble.
- Reading point: publish.rs 1945-1948 at 57451bb3 is a unit-test assertion (`assert_eq!(prompt.published_columns, "Columns published: id, the geometry, and zone.")`). The production literal is in the composer at 322-331: `"Columns published: id, the geometry, and {}.",`. The draft calls 1945-1948 "the code literal".
- Line 697 at 57451bb3 is `        published_columns: compose_published_columns(&attributes),`, as the draft's mutation M-PB-E2c needs.
- `git grep -n published_columns 6649a443 -- frontends/shell` printed nothing, rc 1. It is absent on PR B's branch at M′. On main at 57451bb3 it appears in 10 files under frontends/shell (publish.rs 17 times).
- `e2e/colour.mjs` exists on neither main nor the branch at 6649a443. It is new in PR B.

**Step 5: rule (00) at 57451bb3**
- `gh pr list --state open` returned `[]`, rc 0. No PR is open.
- `git ls-remote` heads: pan-anchor 08bed11c, port-2 83d2ecef, publish-approval-consult-gate-findings 9fb3aff1, second-open 5e6b79bc, PR B 6649a443.

| Branch (`diff --name-only origin/main...`) | Paths | Shared with PR B's list |
|---|---|---|
| port-2-macos-l1-and-app-dirs (merge-base 1f7d06b5) | 15: product-ci-rust.yml, KNOWN-LIMITATIONS.md, engine/src/{app_dirs,lib,lod}.rs, four engine/tests/lod_tier_*.rs, kernel/PERMISSION-BOUNDARY.md, kernel/src/permission/audit/log.rs, kernel/tests/{app_data_dir_resolution,case_policy_volume}.rs, scripts/plan/cfg-boundary.mjs and .test.mjs | KNOWN-LIMITATIONS.md only. It edits the header macOS line (old line 30) and item 43. It adds no item. |
| second-open-history-before-1c-step-3 (merge-base 695e1303) | 10: KNOWN-LIMITATIONS.md, B2-1B and B2-1C forms, kernel/src/project/mod.rs, kernel/src/session_history.rs, three kernel tests, protocol/skp/SKP-V0.md, protocol/skp/src/v0/commands.rs | KNOWN-LIMITATIONS.md only. It adds a comment after item 43 and rewrites item 63's words in place; it adds no item. |
| pan-anchor-setcam-waits-for-its-own-reset | 1: frontends/shell/e2e/pan-anchor.mjs | none |
| publish-approval-consult-gate-findings (merge-base 54ee3522) | 2: MANUAL-WALKTHROUGH.md, PublishDialog.tsx | MANUAL-WALKTHROUGH.md. It edits the Part G row G3 only (hunk at old 330). The branch's form says it edits Part G only and puts PR B's operator rows in Part AC. PublishDialog.tsx is not on PR B's list. |

- The second-open branch edits protocol/skp/SKP-V0.md, which is not on PR B's list but holds pins.
  - Its hunk at old 1147 adds 8 lines above the pinned ranges 1170-1192, 1200-1202, 1217-1232 and 1272-1280, so those four shift +8 when it merges (class 3, bytes unchanged). Pin 89 is unaffected. Its second hunk at old 1337 is below 1280.
  - Its B2-1C form edit is an appended Amendment 29 at old line 1879, so Amendment 12's pins on that form at lines 577 and 1130 are not shifted.
- No branch adds a walkthrough Part, a KNOWN-LIMITATIONS item number or an e2e README entry (I grepped each branch's added headings and items in the three files).
- For the draft's added path `e2e/colour.mjs` and its mutation: M-PB-E2c touches publish.rs but is never committed (draft item 1), so it adds no path. Only #314 touched publish.rs.
- OPEN-1 (a) says to redo this read if any path outside governance/, state/ and site/ changes before the merge. That would happen if any of these four branches merges first. The findings branch touches MANUAL-WALKTHROUGH.md and PublishDialog.tsx; the others are listed above.

**Step 6: item 7's numbers at 57451bb3**

| Item | At 57451bb3 | Next free | Branches of Step 5 |
|---|---|---|---|
| Last walkthrough Part | Part AD (heading at line 2008). Part AC holds AC0-AC2 and AC6-AC11; AC3-AC5 are free, as item 7 says. | Part AE | None takes a Part or AC3-AC5. The findings branch edits G3 only. |
| Highest KNOWN-LIMITATIONS item | 64, at line 511, the first-look item (merged #312, aa415f51). Items 1-47 and 51-64 exist; 48-50 are absent. | 65, 66, … | None adds an item; port-2 and second-open edit 43 and 63 in place. |
| e2e README last suite entry | `## Recentre crossing spec (recentre-crossing-view-displaced-fix)` at line 844; the file is 854 lines. | PR B's `colour.mjs` entry follows it | None adds an entry. |

- Amendment 13 item 1 says the number 64 is "what the first-look item now holds". At 57451bb3 that is a fact: item 64 is in main.
- Amendment 12 item 7 gave KL-3 as item 64. Draft item 6 says whichever of KL-3 and the first-look item merges first takes 64. The first-look item merged first, so KL-3 takes 65 (class 3).
- The first-look form withdraws item 64 when open-first-look-fills-fit-view merges. Numbers 48-50 show the file does not reuse numbers, so 65 stays KL-3's.
- Amendment 12 item 7's other KNOWN-LIMITATIONS numbers (51, 54, 56, 59, and 4 as a rewrite) are unchanged.

**Anything this brief does not name, disclosed**
- I used `git log --first-parent --format='%h %p|%s'` for the merge-per-path column. The literal `--merges` command prints nothing (checked).
- I made one stray empty scratch file by a shell heredoc, `<S>/a14rr-marks2.sed`. It has no content. I also ran `python3 --version` once, to no use.
- I ran extra read-only calls: `git merge-base`, `git ls-tree`, `git rev-list --count`, `git diff --name-only 54ee3522 57451bb3`, `git ls-remote --heads origin` for the five branches, `git rev-parse` of blobs, and `git diff` of branch-side files for second-open's SKP-V0.md hunks, its B2-1C form edit and the findings branch's MANUAL-WALKTHROUGH.md and PublishDialog.tsx hunks.
- I did not scan the other unmerged remote branches for rule (00), as the M′ re-read did. The brief named four.
- I ran no test, build or suite. The "Same" results are line-hash or blob comparisons only. I wrote nothing outside `<S>`, made no commit, and ran no `claude` command.
- The brief's PR B list is mine, rebuilt from §2.6, Amendments 5, 12 and 13, the session-end draft's table and the draft Amendment 14. The script is `<S>/a14rr-marks.mjs`. A path I mis-marked (c) would be a list gap.

Model as the harness reports it: Sonnet 5.5, ID claude-sonnet-5-5 (no override).
