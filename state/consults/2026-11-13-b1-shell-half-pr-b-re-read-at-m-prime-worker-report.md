*Custodian's filing note (2026-11-13): the worker-high's read-only re-read of milestone 4 PR B at M′ 6649a443 (the form's Amendment 12, item 10), from its hand-back (19262 bytes, sha256 4eb0ef0a4bd506f620b9d5c0dac56040740bb1f5c9ca30c67069899db90eebc1), below the rule. A final newline is added; nothing else is changed. Its brief by file (6896 bytes, sha256 f5edd2cefece93240068edeb776ee2b5875fef8d5923ef3254b252e125c179cb), named by its dispatch message; the run 06:24:26Z to 06:36:25Z by its transcript, 115 calls (Read 18, Bash 86, Write 10, SubagentHandback 1), none errored, model claude-sonnet-5-5. Its ten writes are its own working files in the custodian's scratchpad, which its report names as <S>. Filed late, at the publish approval form's commit: the form's Amendment 13 records it.*

---

Re-read: b1-shell-half PR B at 6649a443a38763759339c7813e3fdbe9eca09be0, worker-high

VERDICT: no invalidator. No I4: none of the five signatures item 10 names differs from b7b721eb, and no §0.2 interface differs by anything but a move, a declared change, or a record. Three things are Changed against Amendment 12's own b7b721eb pins (class 3, none a signature). They are listed in Step 2 and need the custodian's attention:
- (i) KNOWN-LIMITATIONS item 4's On-main paragraph was already rewritten by f56d6efe, in the human's words, so the two Amendment 12 pins on it (lines 72-81 and 80) are Changed.
- (ii) `pick.ts` lines 50-62, Changed by the session-end phase's own commit 0b247f29.
- (iii) Item 7's KNOWN-LIMITATIONS number 64 is also what the committed first-look form takes (Step 6).

**Start (all as given)**
- `rev-parse origin/cut/b1-shell-half-pr-b` is 6649a443a38763759339c7813e3fdbe9eca09be0, which is M′.
- M′^1 is b8127685ae7c563857c6306e67b8dcf576ac92bc. M′^2 is bb8835c6701826f38030c51a095a8f83e7a3c52a.
- The form at M′ has sha256 51f7eef512eac8e9d0352f142b4f9a8aad59ea49db68f35d068fb8a0bae2acb6.
- `origin/main` is now cd2c0354, one docs commit after bb8835c6. It touches only governance/, site/ and state/ files (including PLAN.yaml and CUT-STATE.md), so no code or record path of PR B's list changes.

**Step 1: `git diff --name-only b7b721eb M′`**
- The output is in `<S>/m4b-rr-paths.txt`: 80 paths. 30 are outside governance/, state/ and site/, and they are listed below. The other 50 are 11 under governance/, 2 under site/ and 37 under state/.
- Of those 50, 4 are listed here, because they are (a) or (b). The other 46 hold no pin or list entry and are only counted.
- Marks: (a) is PR B's list as Amendment 12 amends it, with Amendment 5's and the drafts' additions. (b) holds a §0.2 or Amendment 12 pin. The commit after each path is what changed it since b7b721eb.

| Mark | Path | Changed by |
|---|---|---|
| (a)+(b) | App.tsx | PR B's session-end phase, 0b247f29 (its own work) |
| (a)+(b) | canvas/pick.ts | phase 0b247f29 |
| (a)+(b) | feature/FeatureTab.tsx (S0.2 pin 51 only) | phase 0b247f29 |
| (a)+(b) | workspace/selection.ts | phase 0b247f29 |
| (a)+(b) | workspace/workspaceState.ts | phase 0b247f29 |
| (a)+(b) | canvas/WorkingCanvas.tsx | the S1 fix, #311 |
| (a)+(b) | KNOWN-LIMITATIONS.md | f56d6efe, the docs lane |
| (a)+(b) | frontends/shell/MANUAL-WALKTHROUGH.md | the S1 fix (one Part A row, A7a, at line 167) |
| (a) | frontends/shell/package.json | the S1 fix (one `e2e:recentre-crossing` script line) |
| (a) | frontends/shell/e2e/README.md | the S1 fix (a 12-line Recentre crossing entry) |
| (a) | canvas/HoverReadoutView.tsx | phase 0b247f29 |
| (a) | feature/clickEffect.ts | phase 0b247f29 |
| (a), tests | App.test.ts, App.lateResult.test.tsx, canvas/HoverReadoutView.test.tsx, canvas/pick.test.ts, feature/FeatureTab.test.tsx, feature/clickEffect.test.ts, streaming/viewportStreamManager.test.ts, workspace/selection.test.ts, workspace/workspaceState.test.ts | phase 0b247f29 and b8127685 |
| (a), records | governance/PLAN.yaml; governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | the form's §2.6 names both among the records |
| (b) | governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md | f425de41 appended Amendment 28 (13 lines at the end); the two pins on it (Amendment 12 items 6 and 7, lines 577 and 1130) are Same |
| (b) | kernel/src/skp.rs | #309; pin S0.2 83-94 is Same |
| (b) | state/directives/2026-11-12-s1-fix-…-no-git-stash.md | new; Amendment 12, continued's two pins @ ad22478f are Same |
| (c) | docs/adr/ADR-035-…md; frontends/shell/e2e/recentre-crossing.mjs; canvas/WorkingCanvas.recentre.test.tsx; testUtils/terminalShapes.ts; kernel/README.md, kernel/src/lib.rs, kernel/tests/source_watch_ordering.rs, kernel/tests/typed_terminal_codes.rs | not on the list |

- One (c) path matters to the phase. `testUtils/terminalShapes.ts` changed via #309's commit 74fd4f1d: lines 58 and 59 lost their literal braces in `REAL_SOURCE_COVERAGE_LOST_PRE_CHECK_REFUSAL_DETAIL`.
- SE-U1 in `App.test.ts` uses that constant (line 1185 at M′). 74fd4f1d is an ancestor of bb8835c6 but not of 0b247f29 or b8127685, so the phase's recorded mutation run did not have it.
- This is my reading only: the code part of the detail (`engine.source_coverage_lost`) is unchanged. I ran nothing.

**Step 2: every pin at M′**
- The script is `<S>/m4b-rr-pins.mjs` and its output is `<S>/m4b-rr-pins.json`. It parsed the pins out of the form's own §0.2 (lines 54-116), Amendment 12 (lines 1551-1819) and Amendment 12, continued (lines 1821-1866).
- Each pin's hash was first recomputed at its own pinned commit. All 124 reproduced the form's hash, with 0 failures. Hashes cover whole lines, each with its LF, at M′.
- A "Moved" result means the same bytes were found exactly once elsewhere. There were no multi-match cases.

| Group | Pins | Distinct ranges | Same | Moved | Changed |
|---|---|---|---|---|---|
| §0.2 @ 4b26d279 | 56 | 56 | 23 | 16 | 17 |
| Amendment 12 @ b7b721eb | 66 | 64 | 46 distinct (48 pins) | 15 | 3 |
| Amendment 12, continued @ ad22478f | 2 | 2 | 2 | 0 | 0 |

**Amendment 12 pins that are not Same**

| Pin (form line) | Path | Pinned | Result at M′ |
|---|---|---|---|
| 9 (1573) | App.tsx | 1650 | Moved to 1660 |
| 10 (1574) | App.tsx | 1765 | Moved to 1775 |
| 19 (1576) | canvas/pick.ts | 135 | Moved to 139 |
| 54 (1584) | MANUAL-WALKTHROUGH.md | 1929 | Moved to 1930 |
| 46 (1596) | App.tsx | 1193-1211 and 1196 | Moved to 1203-1221 and 1206 |
| item 5 (1674) | App.tsx | 1382 | Moved to 1392 |
| item 9 (1704) | WorkingCanvas.tsx | 181-182 | Moved to 183-184 |
| item 9 (1705-1709) | App.tsx | 1282, 686, 1656, 1540 | Moved to 1292, 694, 1666, 1550 |
| item 9 (1717) | MANUAL-WALKTHROUGH.md | 273, 277, 469 | Moved to 274, 278, 470 |
| item 1 (1557) | KNOWN-LIMITATIONS.md | 72-81 | Changed |
| item 1 (1559) | KNOWN-LIMITATIONS.md | 80 | Changed |
| 1600 | canvas/pick.ts | 50-62 | Changed |

- All 15 Moved are class 3. Their bytes are unchanged. The App.tsx shifts are +8 to +10 (the phase's `sessionEndReasonOf` block at lines 671-678 and two more added lines). The WALKTHROUGH shift is the S1 fix's Part A row.
- **Changed, KNOWN-LIMITATIONS.md lines 72-81 and 80.** Only line 80 differs. It is not a signature. It is a record pin, which Amendment 12 item 1 reads as not I4.
  - Line 80 at M′, byte-copied from `git diff`: `   **On `main` (not the v0.1.0 artifact above).** Opening a file also clears the filter cards, not the filter alone. Each filter you apply and each style change you commit is written to the session record item 43 describes. Saving the project writes the filter, its cards, the style and the view to the project file. Nothing yet restores a filter, a style or a view from that record or from a project file.`
  - f56d6efe wrote that paragraph. Amendment 12 item 1 said PR B rewrites it in its records commit and that the architect's starting text is a red line (OPEN-A). The paragraph now already carries the human's words, and the two sentences item 1 calls untrue (that nothing reads the session record back, and that no project file exists) are gone.
  - Lines 72-77 and the line 78 comment are Same (line 78 is Amendment 12 item 1's R-4 pin).
  - Whether PR B must still edit item 4 is a question for the custodian. I rule nothing.
- **Changed, `pick.ts` lines 50-62.** Phase commit 0b247f29 changed the comment block. At M′ the new `SessionEndReason` type is at lines 49-50. The comment block is now lines 52-66. The `PickSessionEnded` interface follows at lines 67-70, with `reason: SessionEndReason;` as its second member. The M′ comment reads, byte-copied: ` * `kind` and `reason` are the only fields: there is no feature identity to report, by construction.` It is a comment only (class 3).
- **Same pins that matter to PR B:** the style, table, skp/types.ts, saveProject.ts, 1c form, `actionRegistry.test.ts` and `StudioLayout.tsx` pins, and `KNOWN-LIMITATIONS.md` line 506 (item 63, the highest at M′) and the Amendment 12 item 1 pins at lines 78 and 80 of the form. Examples: `StyleState` lines 55-60, `StyleDocumentV0` lines 108-117, the `TableSource` ranges, `skp/types.ts` lines 15 and 290-297, `saveProject.ts` lines 76-84.

**§0.2 pins at 4b26d279**
- **Same (23):** unchanged.
- **Moved (16):** the new ranges equal Amendment 12 item 2's, except four. App.tsx 1561 and 1674 are now at 1660 and 1775 (Amendment 12 gave 1650 and 1765). `pick.ts` 134 is now at 139 (Amendment 12 gave 135). MANUAL-WALKTHROUGH.md 1927 is now at 1930 (Amendment 12 gave 1929). All four are shifts caused by the phase or the S1 fix.
- **Changed (17):** each was already Changed at b7b721eb and is declared (PR A, PR C, #307 or the docs lane). I did not byte-copy all 17. The replacement pins in the Amendment 12 table are Same or Moved at M′, with the same hashes. For the ones Amendment 12 names only by content, the file is blob-identical between b7b721eb and M′, except the two noted below:
  - The three `viewportQuery` callers now pass `columns`: `tileViewportStreamManager.ts` line 948, `viewportStreamManager.ts` line 196, `candidateArmSession.ts` line 1283.
  - `tileViewportStreamManager.ts` lines 307-316 is a comment with the same file blob.
  - The Table tab entry is at `layout/contributions.ts` as `{ id: "table", label: "[P6 placeholder] Table" },`, same blob.
  - The "A pure view…" paragraph of `FeatureTab.tsx` is at line 24 (line 23 at b7b721eb); the phase added one import line above it. That paragraph is unchanged.
  - KNOWN-LIMITATIONS.md lines 72-77 is Changed against 4b26d279, but Same as at b7b721eb.

**Step 3: paths (a) or (b) re-read, and the five signatures**
- The phase files (App.tsx, pick.ts, HoverReadoutView.tsx, FeatureTab.tsx, clickEffect.ts, selection.ts, workspaceState.ts, and their tests) changed only as the session-end change describes it. The hunks are in `<S>/m4b-rr-d-*.diff`.
- In outline, the phase threads a `reason` through the existing flow. App.tsx adds `sessionEndReasonOf` (lines 671-678). `pick.ts` adds the `SessionEndReason` type and `reason` on `PickSessionEnded`. `latchedHoverReadout` now takes `endedBy: SessionEndReason | null`. `selection.ts` adds `GenerationEndReason`. `workspaceState.ts` makes the action `resource.generationEnded` carry `reason`. `HoverReadoutView.tsx` adds `sessionEndedText(reason)` and stops exporting `HOVER_SESSION_ENDED_TEXT`. `FeatureTab.tsx` adds an `ENDED_BECAUSE` map.
- `WorkingCanvas.tsx` (#311, S1 fix): hunks sit only at the top comment (lines 100-110), in the `onViewStateChange` body (around lines 2097-2175) and in a comment near line 2340. Nothing touches the handle, props, `pushBatch`, `pushTileBatch` or `currentView`.
- No pinned file other than the ones named in Step 1 differs in its blob from b7b721eb. `tableSource.ts`, `document.ts`, `decodeBatch.ts`, `skp/types.ts`, `saveProject.ts` and `actionRegistry.ts`/`StudioLayout.tsx` are all blob-identical.

| Signature | b7b721eb | M′ (byte-copied) | Result |
|---|---|---|---|
| `pushBatch` | WorkingCanvas.tsx line 123 | line 125: `  pushBatch(streamHandle: string, batchSeq: number, ipcBytes: Uint8Array, filter: Filter \| null): number;` | Same (hash equal, +2 lines) |
| `pushTileBatch` | line 218 | line 220: `  pushTileBatch(tileKey: string, streamHandle: string, batchSeq: number, ipcBytes: Uint8Array, filter: Filter \| null): TileBatchIngestOutcome;` | Same |
| `currentView` | lines 143-148 | lines 145-150, last line: `  currentView?(): { centre: [number, number]; zoom: number } \| null;` | Same |
| `TableSource` members | `tableSource.ts` blob identical | `readonly subscribe = (listener: () => void): (() => void) => {` (line 109); `readonly getSnapshot = (): TableSnapshot => this.snapshot;` (113); `async start(filter: Filter \| null): Promise<void> {` (116); `cancel(): void {` (167); `end(): void {` (179); `dispose(): void {` (191); `TableSnapshot` lines 40-48 | Same |
| `StyleState` | `document.ts` blob identical | lines 55-60: `export interface StyleState {` / `fillColor: string;` / `fillOpacity: number;` / `outlineColor: string;` / `outlineWidth: number;` / `}` | Same |

**Step 4: Amendment 12, continued, item 4**
- **First stale comment.** It is now at `WorkingCanvas.tsx` lines 183-184 (Amendment 12's pinned lines 181-182, moved +2, hash equal). Byte-copied:
  - `   * counting logic, a read-only accessor. Reached only from the DEV-only `residencyEndStep` E2E hook`
  - `   * (`App.tsx`), never from product code. */`
  - Still stale: `getResidentCounts()` has product callers in `candidateArmSession.ts` lines 719, 871 and 919. It is also read in App.tsx at lines 1298 and 1312.
- **`e2e:` scripts in `frontends/shell/package.json` at M′.** There are 19, at lines 25-43. Byte-copied:
  - `"e2e:debug": "node e2e/debug-session.mjs",`
  - `"e2e:regression": "node e2e/regression.mjs",`
  - `"e2e:refusal-contract-baseline": "node e2e/refusal-contract-baseline.mjs",`
  - `"e2e:admission": "node e2e/admission-remediation.mjs",`
  - `"e2e:filter": "node e2e/filter.mjs",`
  - `"e2e:filter-panel": "node e2e/filter-panel.mjs",`
  - `"e2e:style": "node e2e/style.mjs",`
  - `"e2e:publish": "node e2e/publish.mjs",`
  - `"e2e:console": "node e2e/console.mjs",`
  - `"e2e:layout": "node e2e/layout.mjs",`
  - `"e2e:selection": "node e2e/selection.mjs",`
  - `"e2e:export-view": "node e2e/export-view.mjs",`
  - `"e2e:recording": "node e2e/recording.mjs",`
  - `"e2e:command-bar": "node e2e/command-bar.mjs",`
  - `"e2e:attributes": "node e2e/attributes.mjs",`
  - `"e2e:table": "node e2e/table.mjs",`
  - `"e2e:project": "node e2e/project.mjs",`
  - `"e2e:residency-harness": "node e2e/residency-harness.mjs",`
  - `"e2e:recentre-crossing": "node e2e/recentre-crossing.mjs",`
  - `e2e:recentre-crossing` is among them (line 43). That is the only difference from b7b721eb.
  - The three drivers with no script line exist at M′: `e2e/pan-anchor.mjs`, `e2e/source-watch-idle.mjs` and `e2e/source-changed.mjs`.
- **`WorkingCanvasProps` and `WorkingCanvasHandle`.** Both are Same (hash equal, shifted +2). `WorkingCanvasHandle` is lines 113-335 at b7b721eb and 115-337 at M′. `WorkingCanvasProps` is lines 523-587 and 525-589. The condition for naming the App harnesses' canvas mocks is not met.

**Step 5: rule (00)**
- `origin/cut/known-limitations-first-look-partial-view` does not exist: it is absent from `git ls-remote --heads origin` (196 heads) and from `git branch -r`.
- The form for it is committed at M′: `governance/forms/root/KNOWN-LIMITATIONS-FIRST-LOOK-PARTIAL-VIEW-PREREGISTRATION.md` (a record in the b7b721eb..M′ diff).
  - Its Scope is `KNOWN-LIMITATIONS.md` (one new item, "the highest item number there plus one") and PLAN.yaml. That is why I put the first-look item at 64 in Step 6.
- The held branch in `C:/dev/wt/pa` has HEAD 624b2e68. Its `git diff --name-only origin/main...HEAD` lists only `frontends/shell/e2e/pan-anchor.mjs`. It shares nothing with PR B's list.

| Branch | Diff against origin/main (three-dot) | Shared with PR B's list |
|---|---|---|
| `origin/cut/port-2-macos-l1-and-app-dirs` | `.github/workflows/product-ci-rust.yml`, `KNOWN-LIMITATIONS.md`, `engine/src/app_dirs.rs`, `engine/src/lib.rs`, `engine/src/lod.rs`, four `engine/tests/lod_tier_*.rs`, `kernel/PERMISSION-BOUNDARY.md`, `kernel/src/permission/audit/log.rs`, `kernel/tests/app_data_dir_resolution.rs`, `kernel/tests/case_policy_volume.rs`, `scripts/plan/cfg-boundary.mjs`, `scripts/plan/cfg-boundary.test.mjs` | `KNOWN-LIMITATIONS.md` only. Its hunks are the header macOS line and item 43; PR B's are items 4, 51, 54/56, 59 and the new item 64. Separate paths under rule (00a). |
| `origin/cut/known-limitations-first-look-partial-view` | does not exist | none; the committed form would add one new item |
| `C:/dev/wt/pa` (HEAD 624b2e68) | `frontends/shell/e2e/pan-anchor.mjs` | none |

- **Merged work no longer branches.** The recentre fix (#311) and #308 are in M′. #311 touched `frontends/shell/package.json` and `WorkingCanvas.tsx`, which are on PR B's list. They are now in the base, so there is nothing to serialise. Its walkthrough row (Part A, A7a) and its README entry (Recentre crossing spec) are separate paths from PR B's (Part AC, the colour entry).
- I also scanned all 30 remote branches not merged into origin/main (a read-only extra). The shared paths came to:
  - `origin/cut/b1-shell-half-pr-b`: shares most of PR B's own list (it is PR B).
  - `origin/cut/port-2-macos-l1-and-app-dirs`: `KNOWN-LIMITATIONS.md`, as above.
  - `origin/cut/b1-close-nul-names`: `frontends/shell/src/skp/types.ts`. Its head is dated 2026-09-29 and sets `SKP_VERSION` to `"skp/0.7"` (no PR is open for it). It conflicts with `skp/0.13` at M′ and reads as a stale leftover.

**Step 6: item 7's numbers at M′**

| Item | At M′ | Next free | Branches of Step 5 |
|---|---|---|---|
| Last Part letter of MANUAL-WALKTHROUGH.md | AD (heading at line 2008; AD0 and AD1) | AE | none takes one. The S1 fix only added a row in Part A (A7a, line 167). |
| Part AC rows | AC0-AC2, AC6-AC11 present (AC6-AC11 are PR C's; AC0-AC2 PR A's) | AC3-AC5 free, as item 7 says | no branch takes AC3-AC5 |
| Highest KNOWN-LIMITATIONS item | 63 (line 506). Items 1-47 and 51-63 exist; 48-50 are absent. | 64 | port-2 adds no item (header and item 43 only). The docs lane's first-look item, if built before PR B's records commit, takes 64 (highest + 1 at its base). |
| e2e README last suite entry | `## Recentre crossing spec (recentre-crossing-view-displaced-fix)` (heading at line 842; file 852 lines). Before it: Project spec, Table spec, Attributes spec. | PR B's `colour.mjs` entry follows it | none |

- Item 7 says KL-3 is item 64. The first-look item and KL-3 want the same number, and neither is built. Whichever merges first takes 64; the other re-reads (class 3), as the 2026-11-12 ruling's item 3 (b) already says for PR B's references.
- origin/main's KNOWN-LIMITATIONS.md is byte-identical to M′'s (checked with `cmp`), so the numbers are unchanged by the one newer main commit.

**Not named in the brief, disclosed**
- 1c form Amendment 28 (f425de41) says the second-open node is built as one kernel PR in slot 2. I read only its head; its file list is not here.
- The third-message directive (item 3 (a)) says the first-look fit-view node edits `WorkingCanvas.tsx` and is built after PR B merges. It is not a branch, so there is no rule (00) overlap now.
- My extra read-only calls beyond the brief's list:
  - `git ls-remote --heads origin` (network, once)
  - `gh pr list --head cut/b1-close-nul-names --state all` (returned `[]`)
  - `git -C C:/dev/wt/pa rev-parse HEAD` (once) in addition to the one `diff --name-only`
  - `git branch -r` and `git merge-base`
- I wrote shell-redirected blob copies and diffs into `<S>` (named `m4b-rr-*`, e.g. `m4b-rr-wc-<sha>.tsx`). The scripts were all made with the Write tool.
- I ran no test, build or suite. Every "Same" for test files is a hash or blob comparison only.
- I made no write outside `<S>`, no commit or push, and no PR action.

Model as the harness reports it: Sonnet 5.5, ID claude-sonnet-5-5 (no override).
