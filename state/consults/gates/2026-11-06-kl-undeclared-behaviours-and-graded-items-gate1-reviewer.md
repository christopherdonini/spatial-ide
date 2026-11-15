Reviewed: PR #287 at 09216fd499d96a67c77960309f0ace2ca8a4a0a7 (base e0a4810d), the single gate, reviewer
Verdict: FAIL

Branch: cut/kl-undeclared-behaviours-and-graded-items @ 09216fd499d96a67c77960309f0ace2ca8a4a0a7. The brief's sha256 (5a3c68b7…) and the packet's sha256 (0e639e8d…, 8489 bytes) both matched.

The three blocking findings are about wording only. No code changes. Each one comes with replacement words and a clause check. Under the form's §C and §31, both sets of words go to the human at the click: if the human says yes, the worker applies them with no re-gate. This is not the human's typed wording: each span is DRAFT, and it becomes the human's at the click. Part 1 item 2 (WORDS-ONLY) does not apply.

## Findings

### Correctness (blocking)

**C-1. Item 10, the paragraph On `main`: it leaves out the condition under which a record exists.**
- **Requirement:** form §C (a clause the code does not support is Correctness); Part 1 item 1; §A R-10.
- **Current text (byte-copied):** "If the app crashes, the session record item 43 describes keeps, in its header, the CRS assertion and the identity declaration for the dataset, and keeps the file's path in a separate file beside it."
- **Evidence at the base:**
  - A record is created only inside `record_step`: `kernel/src/session_history.rs:149` and `:173`, the only call of `create`. Opening a file creates no record.
  - So if the app crashes before any filter is applied or style change committed, there is no record. An operator can see this after an ordinary crash: no folder is left.
  - The worker found this condition itself (its must-cover correction 5), but the row's text does not carry it.
  - The header writes `crs_assertion` and `identity` as null unless one was made: `kernel/src/dataset_ref.rs:211-212`, `:259-271`.
- **Replacement words** (the whole paragraph): **On `main` (not the v0.1.0 artifact above).** The session record item 43 describes is made for a dataset at the first filter you apply or style change you commit on it, not when the file is opened. Its header keeps the dataset's CRS assertion and identity declaration, each where one was made, and the file's path is kept in a separate file beside it; if the app crashes, the record stays. Nothing reads them back, so the panel sentence above still holds: reopening the file asks you to assert again.
- **Clause check (base e0a4810d):**
  - "made … at the first filter … or style change …, not when the file is opened": `session_history.rs:149`, `:173`; the shell enqueues steps from `App.tsx:850-857` and `:1987-1994`.
  - "for a dataset": records are matched by path and claims, `session_history.rs:166-176`.
  - "each where one was made": `dataset_ref.rs:211-212` (`claim_of`, `mapped_column`) and `:259-271` (`map_or(Json::Null…)`).
  - "path … in a separate file beside it": `session_history.rs:240-250` (`locations.json` in the record's folder).
  - "if the app crashes, the record stays": `session_history.rs:13-14`.
  - "Nothing reads them back": a grep finds `recover` called only from `kernel/tests/*`.
- **Closure:** the human's answer at the click, recorded as the form's amendment. No re-gate.

**C-2. Item 31, the null-geometry sentence: "never skipped" and "stops the stream" are stated without the condition that a stream reads the row.**
- **Requirement:** form §C; §A R-31.
- **Current text (byte-copied):** "A row whose geometry is null stops the stream in the same way, whatever the encoding: an `engine.wkb` refusal names a null geometry, and the row is never drawn and never skipped."
- **Evidence at the base:**
  - The stop happens only for a row the query returns: `engine/src/stream.rs:1995` and `:2694-2696`.
  - Every stream restricted to an area selects rows with four comparisons on the `covering.bbox` columns: `stream.rs:1604-1609`, `:1621-1627`, `:1704-1711`. The map's tile streams always pass an area: `tileViewportStreamManager.ts:948`.
  - A null-geometry row whose bbox is null never satisfies those comparisons, so a tile stream never reads it. That stream does not stop, and the row is silently absent from the map.
  - Whether a file's writer leaves that bbox null is file content, not something the code decides. So the code does not support the unconditional clause. This can happen in ordinary use: open a file with null geometries.
- **Replacement words** (in place of that one sentence; the chunk sentence stays): A row whose geometry is null stops, in the same way and whatever the encoding, any stream that reads it: an `engine.wkb` refusal names a null geometry, and the row is never drawn. A stream for an area of the map reads only the rows whose `covering.bbox` values meet that area, so a null-geometry row whose bounding box is null as well is not read by such a stream: that stream does not stop for it, and the row is not drawn.
- **Clause check (base):**
  - "stops … whatever the encoding, any stream that reads it": `stream.rs:1995` is the only call of `binary_value` and comes before the single `push_wkb` at `:2039`; `:2694-2696` is the null check.
  - "`engine.wkb` … names a null geometry": `error.rs:346`, `skp.rs:2178`, `:2272`.
  - "never drawn": the stream returns `Err` before `push_wkb`.
  - "reads only the rows whose `covering.bbox` values meet that area": the `stream.rs` lines above, and `tileViewportStreamManager.ts:948`.
  - "not read": SQL comparison with NULL is never true. That is a property of the query language, not of this code.
- **Closure:** the human's answer at the click. No re-gate.

**C-3. Item 54: the claim that delivered features "stay shown" is untrue when the filter changes.**
- **Requirement:** form §C; §A R-54.
- **Current text (byte-copied):** "The features already delivered stay shown, except that a session end clears the Table. Showing the Table again asks again from the start and clears what it showed."
- **Evidence at the base:**
  - `viewFilter` is one of the effect's dependencies: `TableTab.tsx:63-67`.
  - So a filter change while the Table shows the Filtered scope runs `cancel()` and then `start(newFilter)`. `start` calls `reset`, which clears the rows: `tableSource.ts:115-123`, `:197-205`.
  - Choosing that scope again, or the end of an export, does the same. An operator sees this in ordinary use: apply a filter with the Table open.
- **Replacement words** (for those two sentences): A cancel keeps the features already delivered on show, except that a session end clears the Table. While the Table is shown with that scope, it asks again from the start and clears what it showed whenever it is shown again, that scope is chosen again, the filter changes or an export ends.
- **Clause check (base):**
  - "A cancel keeps …": `tableSource.ts:166-171`; `cancel` does not reset.
  - "a session end clears": `TableTab.tsx:69-71` (`source?.end()`) and `tableSource.ts:178-190`.
  - "asks again from the start and clears": `tableSource.ts:115-123`, `:197-205`.
  - The four triggers: `TableTab.tsx:63-67`, which depends on `shown`, `scope`, `exportHeld` and `viewFilter`.
- **Closure:** the human's answer at the click. No re-gate.

### Evidence

None. All 130 pins recompute; every check below exits 0.

### Documentation (must-fix before the merge, no re-gate; row words still go to the human at the click)

- **D-1. Rule 5 (v0.1.0 text pinned at the tag).** These clauses all hold at the tag, but are pinned only at the base:
  - Item 4's `document.ts:18-21` (the "literal only" clause). Pin it as `frontends/shell/src/style/document.ts:18-21 @ b391e43622056324c56d35cc33065305140a8415 sha256:6658703e7c56d212da9c20ea97625d3d06fc0a4dd170b3dec6109e2e7b4ffa50`.
  - Item 13's new v0.1.0 clauses (the remount, the pan, the capture). Add these pins:
    - `frontends/shell/src/App.tsx:1359-1360 @ b391e43622056324c56d35cc33065305140a8415 sha256:ca10262512f969b27c085e3f8f1f7e7ea93d451d78b976d0d7fa7120533ee634`
    - `kernel/src/skp.rs:338 @ b391e43622056324c56d35cc33065305140a8415 sha256:238cd96f1a7d324b88b87bdf32fa1f79fbd8eea52da6fccd3c7bdd44edaf9a11`
    - `frontends/shell/src/canvas/hoverRepickConstants.ts:53 @ b391e43622056324c56d35cc33065305140a8415 sha256:02eed5101a678a893934595dd0743088688610e1ddc9cb2a2101d76e7c6bce18`
    - `frontends/shell/src/canvas/WorkingCanvas.tsx:1779 @ b391e43622056324c56d35cc33065305140a8415 sha256:b3d37bf71a7b4cc18798ca31ea998c6b056d1a113632e27b0cea5979259f5eb9`
  - At the tag, deck.gl is 9.3.9 in `package-lock.json`, the same as at the base.
- **D-2.** `Not covered (§31c)` is used for cases outside §31c's three categories in R-27 (which names the filesystem reports), R-57 (how often an overflow happens) and R-61 (the first batch's contents). Write `Not covered:` there.
- **D-3.** In the PR body's table, R-15's span (`:160`) is by `git log -L` from 7104cd3a and b30d714d; the table lists only b30d714d. The class is unchanged.
- **D-4.** R-57's last sentence omits the third cause the item names. Current text (byte-copied): "the code decides only that the buffer overflowed or that a read failed." Words: "the code decides only that the buffer overflowed, that a read failed, or that the watch could not be set up again." Check: the three `CoverageLost` sinks in `engine/src/watch.rs:335`, `:348`, `:387` at the base, the only ones in that file.
- **D-5.** R-P omits the retry's conditions. Current text (byte-copied): "A tile whose query is still refused for want of a connection is logged and asked for again once." Words: "A tile whose query is still refused for want of a connection is logged and, while it is still in view and the map's tile queue has room, asked for again once." Check: `tileViewportStreamManager.ts:951` (the log) and `:982-994` (not stopped, the retryable code, not already retried, still in view, `queue.length < MAX_QUEUED_TILES`, which is 512 at `tileGridConstants.ts:54`). The outcome an operator sees, "not loaded", holds either way.
- **D-6.** R-60's bold lead conflicts with its body, which counts polygons off the screen. Current text (byte-copied): "whenever the average polygon on screen is under 9 pixels". Words: "whenever the average on-screen size of the polygons the map holds is under 9 pixels". Check: `pickResolution.ts:90-117`, `:205`.
- **D-7.** R-19 keeps `engine/src/error.rs:377-382 @ 4fd3259a…`, while rule 5 pins text that is on main at the base. The same bytes are at `engine/src/error.rs:380-385 @ e0a4810d12345fc778f8e38b2fcf47851c156baf sha256:de466f1bb052884badf75dc68f04b0a4c5087aa5941af42238d5ddf51ccddf21`. Re-pin, or say that the old pin is historical.

### For the human (outside Scope, not this PR's defect)

- GFM renders items 29 to 41 under the wrong numbers, at the base and at the head alike. Item 29 renders as 17, and items 30 to 41 render as 29 to 40, so item 31 shows as "30". This PR does not change it.

## Checks

1. **Scope** (my script `klpg1-r-check.mjs`, rc 0):
   - `git diff --name-only`: only `KNOWN-LIMITATIONS.md` changes.
   - All 13 hunks are at places §A names: items 4, 7 (comment), 10 (twice), 13 (twice), 15, after 15 (R-P), 19, 27, 31, 54, and 56 with new items 57 to 61. Items 55 and 47 are unchanged.
   - **Numbering, not as the brief states it:**
     - "1 to 61, each once and in order" cannot hold. Item 43 is written as `**43.` (not a list item), and items 48 to 50 do not exist at the base or the head (§E: 1c holds them).
     - The source order is not numeric at the base either (29, 42 and 44 sit in the v0.1.0 section).
     - What holds: the head's sequence of item numbers equals the base's sequence followed by 57 to 61, every number is distinct, and no item before 57 is renumbered.
     - Title lines differ only for items 10, 13, 27 and 56, all edited inside Scope.
   - Size: numstat 74 insertions and 30 deletions, 104 against the declared 130.
   - Bytes: no CR in the diff, no tab in changed lines, and the head ends with LF.
   - Non-ASCII: 30 changed lines (20 added, 10 removed), using U+00A7 (48), U+2014 (4) and U+2026 (1). The base file already uses each.
2. **Rows, clause by clause:**
   - I read every row against the base code and the v0.1.0 rows at the tag. Except C-1 to C-3 and D-4 to D-6, every clause holds.
   - **The tag lines for the corrections:**
     - Item 4: `App.tsx:190-193` @T (the open resets, no style reset) and `:624` @T. `setStyle`'s only caller is `StylePanel`'s `onChange`, so the old text was untrue at the tag.
     - Item 10: `App.tsx:614` @T and `CrsAssertionForm.tsx:63-65` @T, plus item 4's tag lines.
     - Item 13: `WorkingCanvas.tsx:1670-1683` @T. The `pointerup` and `pointercancel` listeners are on `window`, so "until the app is restarted" was untrue at the tag.
     - Item 13's other clauses hold at the tag: `App.tsx:1359-1360`, `skp.rs:338`, `HOVER_REPICK_ON_PAN = true`, `WorkingCanvas.tsx:1779`.
   - Rule 2's choice of pattern is right for each row.
3. **Whose words:** I ran `git log -L` at the base over all 11 changed old spans.
   - Items 4, 7, 10 and 13: b30d714d, sighted at the release.
   - Item 15's comment: 7104cd3a and b30d714d (see D-3).
   - Item 19: 50f76ff7, fe51373b, aff66920, dd01801e. Item 27: 0c4ca9ff, f1ddfa9b. Item 31: 3c29bc67, 55df46fd, 2ff9a8e6, e89bf9bf. Item 54: 0c200a71, 580d389e. Item 56: those two and a5f7d9ac. All DRAFT.
   - This agrees with the PR body's table apart from D-3.
   - No span holds the human's typed words: b30d714d's message calls only 13b and entry 87's line the human's wording, and neither is changed.
4. **Pins:**
   - All 130 recompute with 0 mismatches. Each is contiguous on one line (0 pins split across lines).
   - Their commits are b391e436, e0a4810d and 4fd3259a, each an ancestor of origin/main.
   - Exceptions to the commit rule are D-1 and D-7.
   - The deck.gl spans:
     - The installed `@deck.gl/core` `package.json` reads 9.3.9. The lock file reads 9.3.9 at main, at the base and at the tag.
     - `deck.ts:1258-1284` hashes to e62e3e62… and `:1287-1324` to e8babc16…; both match.
     - The clause holds: while a button is down, `_onPointerMove` returns before recording a pick request (`:1264-1266`). The shell captures the pixel only in `onHover` (`WorkingCanvas.tsx:2155`). A release drops the pixel (`:1979`).
5. **House style:**
   - Every row has a bold lead and the file's continuation indent.
   - All 15 new comments open with the exact required text, followed by the form and the row.
   - The On-main paragraphs for items 4 and 10 carry no comment of their own, as in items 2 and 3 (rule 2's pattern).
   - `Not covered (§31c)` is present where §31c applies (R-13, R-54, R-56); see D-2 for the others.
   - A scan for speed, duration and rate words (self-tested) finds only "at once" meaning concurrency, and "no rate".
   - The only app tokens quoted are `mtime` and `footer-hash`, which equal `skp/types.ts:225` and are named as `[P6 placeholder]` text. R-60 quotes no string.
   - Other items are referred to by number only.
6. **The worker's corrections:** each is confirmed at the base.
   - R-31: the row number counts from the start of the `stream_arrow` chunk (`stream.rs:1979`, `:1995`).
   - R-54: five cancels (`TableTab.tsx:21-22`, `:63-67`) and the clear (`tableSource.ts:178-190`).
   - R-57: three causes (`watch.rs:335`, `:348`, `:387`).
   - R-19: two components (`descriptor.rs:239-248`).
   - R-4 and R-10: the record exists from the first recorded step (`session_history.rs:149`, `:173`). C-1 is that item 10 does not say so.
   - R-56: the untiled first look is issued at open (`App.tsx:1700`).
7. **Item 15's note:**
   - I re-ran `git grep` for MSVCP140, VCRUNTIME140, Visual C++, VC++, vc_redist and redistributable at the base, over governance/, state/ (archive, consults and drafts excluded) and docs/. It found 14 hits, none a recorded run on a machine without the runtime.
   - The excluded folders agree: a consult records that such a machine was never observed.
   - The note claims no more than this.
   - The ruling exists: entry 90's block in the archived ledger, dated 2026-09-14, and PLAN node `entry-69-runtime-dependency`, done.
8. **Suite at the head** (in the worktree):
   - `verify-cites` rc 0 (2685 files); `verify-quotes` rc 0 (0 hash-reference errors); `verify-test-claims` rc 0 (738); `verify.mjs --offline` rc 0.
   - `docsOnly origin/main HEAD` rc 0, with origin/main at 42b3c7ea.
   - `node --test` (CI's three globs) rc 0: 598 pass and 0 fail (598 ✔, 0 ✖).
   - Render through `gh api markdown`: `<ol start="54">` holds 8 items, 54 to 61, under their own numbers. The only rendering differences from the base are items 27 and 56 (retitled) and 57 to 61 (added).
   - CI: `gh pr checks 287` shows 4 checks, all pass. `gh run view` gives head 09216fd499d96a67c77960309f0ace2ca8a4a0a7 for 42191301495 (DCO), 42191301405 (Exposure scan), 42190206880 (Ported notices, push) and 42191301918 (Ported notices, pull_request).

## Gaps in the packet

- The tag's deck.gl version in the lock file. It is needed for item 13's v0.1.0 clause; I read it myself (9.3.9).
- Where entry 69's and entry 90's ruling text lives. It is in the archived ledger, not in `DECISIONS-PENDING.md`.
- That items 43 and 48 to 50 are not list items, so the brief's "1 to 61 each once" cannot be checked literally.
- The old spans' base line ranges for `git log -L`. I derived them from the hunks.

## Hold lines (project SpatialIDE only, `also=` elided)

- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:37360` / `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:37360 affinity=FF (cores 0-7)` (verify-quotes)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:69208` / `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:69208 affinity=FF (cores 0-7)` (`node --test`)

## Background shells

Both background tasks finished (exit 0). None of my processes is still running, and I killed none. The worktree's porcelain is empty and HEAD is 09216fd499d96a67c77960309f0ace2ca8a4a0a7. I wrote only `klpg1-r-*` files in my scratch folder.
