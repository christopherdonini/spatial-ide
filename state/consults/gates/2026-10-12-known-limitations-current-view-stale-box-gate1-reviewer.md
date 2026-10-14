# PR #215 gate 1 — reviewer
Reviewed: cut/known-limitations-current-view-stale-box @ 7f80f18efabc04d6054956824a003a88aac4d32f

**Verdict: FAIL, on the wording of one sentence only (Correctness).** Replacement words are below, with each clause checked against the code. The words are the human's, so the human answers yes, gives their own words, or accepts the sentence as it stands. If the answer is yes, the worker applies the words and there is no re-gate. Everything else passes: the bytes, all 29 pins, every other clause at T and at the base, Scope, the indentation deviation, and CI.

T = b391e43622056324c56d35cc33065305140a8415, base = 241ba9e19d22e5aec7974edc5656028a15a4b36b, main = 85933a085110c997d68f19ec183498ea737ad444. Between the form's M (2ca3a53c), the base and main, nothing changed under frontends/, engine/, kernel/, renderer/ or protocol/ (`git diff --stat`). So every O-clause read at M or at main holds at the base. 2ca3a53c is an ancestor of the base.

## Correctness

**C-1 (blocks; the human's wording).** The sentence `Current view then publishes what the map shows.` (KNOWN-LIMITATIONS.md:190 @ 7f80f18e) is untrue in ordinary use, both at T and at the base.

The item's own scenario is a filter Apply, and after an Apply the map shows only the matching features. Current view's query never carries the filter: `filter: None` at frontends/shell/src-tauri/src/publish.rs:110 @ b391e43622056324c56d35cc33065305140a8415 and at frontends/shell/src-tauri/src/publish.rs:119 @ 85933a085110c997d68f19ec183498ea737ad444. Item 8 states the same (KNOWN-LIMITATIONS.md:105 @ 7f80f18e).

So after the advised pan, the bundle holds every row in the area, including rows the map does not show. The form's C11 check covers only the area, not the contents.

Replacement words for that one sentence:

> Current view then publishes the area the map shows, unfiltered, as item 8 says.

Each clause checked:
- **"the area the map shows":** a pan or zoom writes the camera's view at the canvas's current size. At T: frontends/shell/src/canvas/WorkingCanvas.tsx:1760-1769 @ b391e436, written to the box by frontends/shell/src/App.tsx:1388-1402 @ b391e436, and read at click time by frontends/shell/src/publish/PublishPanel.tsx:345 @ b391e436. On main: WorkingCanvas.tsx:2018-2028, App.tsx:1886-1895 and PublishPanel.tsx:348, all @ 85933a08. Holds at both revs.
- **"unfiltered":** the publish.rs lines cited above, at T and on main. Holds.
- **"as item 8 says":** KNOWN-LIMITATIONS.md:105 @ 7f80f18e says that a filtered export goes through unfiltered. Holds.

The words add no new not-covered case. The round-trip case is already named in the source comment. Optional: add the pin frontends/shell/src-tauri/src/publish.rs:110 @ b391e43622056324c56d35cc33065305140a8415 sha256:ba71236ff2320fc28c7d69511372b8d6e385f5ffbd201c290e4ab79a4cc0f2d3 to the comment.

**Every other clause holds, checked by reading the code.**
- **C2:** PublishPanel.tsx:326, :588 and :605 @ b391e436.
- **C3 and C7:**
  - At T the box has only two writers, App.tsx:791 (the reset at admit) and App.tsx:1393 @ b391e436 (`git grep`).
  - The panel is keyed on the dataset (App.tsx:1541-1548 @ b391e436).
- **C4:** Zoom to layer calls `fitToExtent(bbox, true)` (WorkingCanvas.tsx:1335 @ b391e436), and that call reports.
- **C5:** applyFilter calls the reset (App.tsx:327 @ b391e436). The auto-fits run with notify false (WorkingCanvas.tsx:1285-1295 and :1486-1491 @ b391e436), and a notify-false fit reports nothing (:1157-1162).
- **C6:**
  - At T there is no `onResize`, and the only Deck controller option is `controller: true`.
  - deck.gl 9.3.9 (the installed `@deck.gl/core`) fires `onViewStateChange` on a size change only when `maxBounds` is set.
  - `git grep` finds no `maxBounds` and no `transitionDuration` at T or at main.
  - A write through `initialViewState` sets the view state without firing the callback.
- **C8:** `the current viewport extent` occurs byte for byte at publish.rs:119 @ b391e436 and at publish.rs:130 @ 85933a08.
- **C12:** `Whole dataset` maps to `ViewportQuery::all()` (publish.rs:100 @ b391e436).
- **O1:** the button's label (PublishPanel.tsx:610 @ 85933a08) and the panel's label `Export` (PublishPanel.tsx:513 @ 85933a08).
- **O2:**
  - `viewportAfterResize` returns `none` when nothing was last asked for or the size is zero; otherwise it returns `within` or `query`, and both write the box (viewportBbox.ts:76-79, WorkingCanvas.tsx:1954-1958, App.tsx:1904-1906 @ 85933a08).
  - lastQueried is cleared at a reset and at a fit that does not report (WorkingCanvas.tsx:1354 and :1535 @ 85933a08). That is the window that item 39's exception names (KNOWN-LIMITATIONS.md:369 @ 85933a08).
- **O3 and O4:** a reissue calls the reset (candidateArmSession.ts:1658 @ 85933a08), and the auto-fits do not report (WorkingCanvas.tsx:1487 and :1683 @ 85933a08).

## Evidence

No blocking finding.

1. **The words, byte for byte (by script).** The item line equals §A's line 17. The comment equals §A's line 25 with the bracket (present exactly once) replaced by `The human's wording, approved`. The on-main paragraph equals §A's line 21. Base plus these five lines, inserted after item 29's block and before the `## On main since v0.1.0` heading, reproduces the head exactly. Neither side has a CR.
2. **The pins.** All 29 pins in the comment were recomputed by `git show <rev>:<path>`, lines a to b joined with `\n` plus one final `\n`, then sha256: 29 match, 0 mismatch.
3. **Scope.** The diff touches only KNOWN-LIMITATIONS.md: 5 insertions and 0 deletions, within the 20-line budget. No other item and no line outside Scope changes.
4. **The indentation deviation is correct.** I rendered both variants through GitHub's GFM endpoint (`gh api markdown`):
   - With 4 spaces, the comment and the on-main paragraph stay inside item 42's `<li>`.
   - With 3 spaces, the list ends at the comment. The on-main paragraph renders as a top-level `<p>` after the `</ol>`.

   `42. ` is 4 columns wide, so 4 spaces is what §A's "as item 2's is" intends. Every two-digit item in the file uses 4.
5. **CI (`gh pr checks 215`).** Four checks, all passing: DCO sign-off, the profile-path scan, and ported-notices twice. Governance CI did not run, because its path filter (.github/workflows/governance-ci.yml:95-102 @ 85933a08) does not match KNOWN-LIMITATIONS.md. I ran the two checks it would have run, at the head, in the worktree: verify-cites rc 0 and verify-quotes rc 0, each a PASS. Nothing new was flagged in KNOWN-LIMITATIONS.md.

## Documentation (must be fixed before the merge; no re-gate)

**D-1. Two form statements are false at T** (a record correction for the form, outside this diff).
- §B row C5's last sentence says that candidateArmSession.ts at T has no call.
- §D item 1 says that at T the reset is called only from App.

The draft's own check command proves both wrong. `git grep -n resetFitForNewGeneration b391e436 -- frontends/shell/src/residency/candidateArmSession.ts` prints frontends/shell/src/residency/candidateArmSession.ts:1513 @ b391e43622056324c56d35cc33065305140a8415, `canvas?.resetFitForNewGeneration();`, inside `reissueUnrestricted`. The shipped candidate arm reaches it through App.tsx:1051 @ b391e436.

C5's truth is unaffected: this is a second route to the same reset. The shipped comment's claims stay true. The fix is an appended correction row of at most three sentences: the defect, the corrected reference, and the git grep as proof.

**D-2. Item 42 renders as 18. on GitHub.** Item 16 opens a list that GitHub numbers from 16 (`<ol start="16">`). Item 29 already renders as 17 at the base, and item 42 continues that list as its third entry.

The fix: insert one column-0 line, such as an HTML comment, between item 29's block and item 42. Rendered in memory, that gives `<ol start="42">`.

That adds one line (6 of the 20-line budget). It is outside §A's text and outside Scope's wording of one HTML source comment, so the custodian records it as a layout deviation in the PR body, as the indentation deviation is recorded. Item 29's identical defect is outside Scope and belongs to its own docs node.

## Commands run (exit codes)
- `git rev-parse`, `git log`, `git diff --stat` and `git diff` base..head: 0
- node byte-compare script (git show of the form and of KNOWN-LIMITATIONS.md at base and head): 0
- node pin-recompute script, 29 pins: 0
- `git show` / `git grep` of the code at T, M and main (PublishPanel.tsx, App.tsx, WorkingCanvas.tsx, FilterPanel.tsx, PublishDialog.tsx, publish.rs, candidateArmSession.ts, viewportBbox.ts, KNOWN-LIMITATIONS.md items 8 and 39): 0
- `git merge-base --is-ancestor` for 2ca3a53c and for T against the base: 0, 0
- deck.gl source read (node_modules/@deck.gl/core 9.3.9, dist/lib/deck.js and dist/controllers/controller.js): 0
- `gh api -X POST markdown` (GFM render of the 3- and 4-space variants, of the head and base files, and of the in-memory separator test): one first attempt exited 1 (Git Bash rewrote the leading-slash endpoint), then 0 on every call
- `gh pr view 215`: 0. `gh pr checks 215`: 0. `gh run list --branch …`: 0
- in C:/dev/wt/kl42: `node scripts/plan/verify-cites.mjs` 0, `node scripts/plan/verify-quotes.mjs` 0. `git status --porcelain` is empty and HEAD is still 7f80f18e.

No file was written. The worktree is unchanged.
