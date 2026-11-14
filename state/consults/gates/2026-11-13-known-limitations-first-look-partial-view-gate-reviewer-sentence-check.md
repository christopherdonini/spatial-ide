Reviewed: PR #312 at b71de27086e3b75f41265915116f72ad70e1482a (base bb8835c6), the reviewer's one check of ADV-2026-11-13-03 item 1's sentence under AUTONOMY §31 (b), the piece's last gate report by that ruling's item 2 (the custodian's filing note, 2026-11-13: PLAN node known-limitations-first-look-partial-view, the docs lane; below, the hand-back byte for byte (8386 bytes, sha256 2c94e813c535856e05b8af2468ba78b9e46eeb78620f7b614963ac3545dc8bc6), one final newline added; its brief by file (7170 bytes, sha256 7b95cb413c8910773a08591cd88aa3ce5b624d7a7c4a1682de9be8a7b3cb7284); the run 09:15:51Z to 09:20:10Z by its transcript, 21 calls (Read 2, Bash 18, SubagentHandback 1), none errored, model claude-opus-5-5; filed after ADV-2026-11-13-03 reached main in 428cbe91, as its Documentation finding asks; its §31 (c) case applied by ADV-2026-11-13-07, `state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-07-312-debounce-case-the-reviewers-sentence-in-item-64s-comment-no-further-check.md`)
Reviewed: PR #312 at b71de27086e3b75f41265915116f72ad70e1482a (base bb8835c6), the reviewer's one check of ADV-2026-11-13-03 item 1's sentence
Branch and commit: cut/known-limitations-first-look-partial-view @ b71de27086e3b75f41265915116f72ad70e1482a

Verdict: PASS WITH NOTES

The note is one §31 (c) case, the 120 ms debounce edge, described under clause (a). It does not fail the check.

Setup: the brief at `<S>/brief-kfl-rev2.md` has sha256 7b95cb413c8910773a08591cd88aa3ce5b624d7a7c4a1682de9be8a7b3cb7284 (7170 bytes), as briefed. `git fetch` returned rc=0. The worktree `C:/dev/wt/kfl` is at HEAD b71de27086e3b75f41265915116f72ad70e1482a with empty porcelain, and `gh pr view` gives the same headRefOid. The ruling is not on origin/main yet (ls-tree of state/directives/ found no match), so I read the scratch copy `<S>/adv-2026-11-13-03.md`: sha256 d2b0bbca75fe6e14c853e9d1d2312fbde7d2926084fc44802942fc1d4572d718, as briefed. I read AUTONOMY §31 (lines 530-551 on main) and the first gate report on origin/main; its check 6 names this case at its line 91.

## 1. Diff check
- `git diff --stat 013d8c9b..b71de270` gives `KNOWN-LIMITATIONS.md | 2 +-` and `1 file changed, 1 insertion(+), 1 deletion(-)`.
- The word diff shows a single insertion on line 511 (item 64's comment). It sits after `Not covered: an Apply or a Clear, which the reading behind this item did not reach.` and before ` -->`.
- Byte comparison, all by `cmp`:
  - Lines 1-510 of the old and new file: rc=0 (identical).
  - Old line 511 minus its trailing ` -->\n`, then `<S>/kfl3-insert.txt`, then ` -->\n`, against new line 511: rc=0. The sizes are old 2381, new 3050, expected 3050; the difference is 669 bytes.
  - `kfl3-insert.txt` is 669 bytes with sha256 924e20041999e36d0df324c59cd030067d47248ee2ebc6f1fad7012763a854a1, as briefed. It has one leading space and no trailing newline.
  - The ruling's item 1 sentence (backticks stripped, `<P9>` and `<P10>` replaced by the two pins in the head), with one leading space, against `kfl3-insert.txt`: rc=0.
- Both files have 511 lines and end with LF.

## 2. Pins (recomputed at bb8835c6701826f38030c51a095a8f83e7a3c52a; `file` reports UTF-8, LF)
- P9 `frontends/shell/src/streaming/tileViewportStreamManager.ts:518`. The line:
  `    if (frame === null) return { kind: "no-frame" };`
  Recomputed sha256 cf3ebe08ef1d0ad21476b499ee3875f1126924bd59ebd65fc262fcf4248f1ac2. This equals the pin, and the line is the `no-frame` return.
- P10 `frontends/shell/src/residency/candidateArmSession.ts:1408-1410`. The lines:
  `        if (!(wasSelfCancelled && manager.gridFrame !== null)) {`
  `          establishFrameFromExtent(latestUnionedExtent);`
  `        }`
  Recomputed sha256 2dabb9ae1075327efa077c0a839a0ac13727faff30f6d06556b464e901287ab1. This equals the pin, and the lines sit inside the untiled first look's `onTerminal` (opened at :1328), so they are the frame established at the first look's terminal.

## 3. Clauses, against the code at the base

**(a) "a pan or zoom whose viewport report arrives before the first look's query has ended plans no tiles": TRUE, with one named case.**
- The handled report reaches the manager and returns early:
  - cas :1465 `  function handleViewportChange(bbox: AuthoritativeBbox): void {`
  - cas :1483 `      outcome = manager.onCameraChange(bbox, currentFilter);`
  - tvsm :517-518 `    const frame = this.frame;` / `    if (frame === null) return { kind: "no-frame" };`
  - cas :1487 `    if (outcome.kind !== "planned") return;`
- No tile is issued, and the bbox is not kept for a retry. The only other `no-frame` mentions in cas are comments (:420-421, :1469, :1573).
- **§31 (c) case, named in words (not blocking).** The report passes through a trailing debounce before it is handled:
  - cas :1625-1630 `    onViewportChanged: (bbox) => {` … `      debounced.call(bbox);`
  - cas :1454 `  const debounced = debounce((bbox: AuthoritativeBbox) => handleViewportChange(bbox), VIEWPORT_QUERY_MIN_INTERVAL_MS);`
  - debounce.ts :42-45 `      timer = setTimeout(() => {` / `        timer = null;` / `        fn(...args);` / `      }, settleMs);`
  - viewportStreamManager.ts :25 `export const VIEWPORT_QUERY_MIN_INTERVAL_MS = 120;`
- So a report that arrives less than 120 ms before the first look's query ends is handled after the frame is set, and it does plan tiles. This needs timing inside one 120 ms debounce interval at the stream's end, which is the kind of case §31 (c) says does not block. Suggested words for the source comment, which the custodian may append: "A pan or zoom reported less than the viewport debounce (VIEWPORT_QUERY_MIN_INTERVAL_MS, 120 ms) before that query ends is handled after it ends and plans tiles." Clause check for those words:
  - "reported … debounce 120 ms" rests on cas :1625-1630, cas :1454 and viewportStreamManager.ts :25.
  - "handled after it ends" rests on debounce.ts :42-45, a trailing setTimeout.
  - "plans tiles" holds because tvsm :517-518 is passed once the frame is set by cas :1408-1410.

**(b) "the grid frame is set only when that query ends": TRUE.**
- The frame has a single writer:
  - tvsm :461-463 `  establishGridFrame(anchor: AuthoritativeBbox, unit: CrsUnit): void {` / `    if (this.frame !== null) return;` / `    this.frame = deriveTileGridFrame(anchor, unit);`
- `git grep` over frontends/ at the base, excluding test files, finds one product call of `establishGridFrame`, at cas :1217 `    manager.establishGridFrame(target, deps.crsUnit);`, inside `establishFrameFromExtent` (cas :1213).
- `establishFrameFromExtent(` is called from one place, cas :1409, inside `onTerminal`. The ingest path no longer sets the frame; cas :1127 says so in a comment, and the grep confirms it.
- This is a necessary condition, not a sufficient one. The frame can stay unset at the end (for example cas :1214 `    if (frameEstablished || !extent) return;`, or the session-ended return at :1355-1357). "Only when" still holds.

**(c) "nothing plans when it ends": TRUE.**
- The rest of `onTerminal` after :1410 (:1411-1441) calls `canvas?.markTilePartial`, `emitResidencyRelinquished()` and `syncScanLiveness()`. None of them reaches `onCameraChange`, `handleViewportChange` or `debounced`:
  - A grep of `emitResidencyRelinquished` (:869) and the 25 lines after it for those names returned rc=1.
  - `syncScanLiveness` (:596-605) only calls `deps.applyScanEvent`. In App.tsx (:1016-1021, :1690-1694) that commits scan state and nothing else.
  - `establishTileGridContext` (WorkingCanvas.tsx :1843-1846) only sets a ref: `        tileGridContextRef.current = { frame, level };`
- The only callers of `handleViewportChange` are the debounce (cas :1454). The only route to `onViewportChanged` is the canvas prop (App.tsx :2313-2323, ending `                    viewportDebounceRef.current?.call(toWireBbox(bbox), null);`).

**(d) "so the map keeps showing the first look's rows until the next pan or zoom": TRUE.**
- This follows from (a) to (c). The next plan needs a new `onViewportChanged` (cas :1625-1630), which only the canvas's viewport callback sends (App.tsx :2313-2323).
- "Zoom to layer counts as a zoom" is already in the comment's P3 pin and stays outside this check.

No clause is untrue, so there are no §31 replacement words.

## 4. frontends/ and CI
- `git diff --stat bb8835c6701826f38030c51a095a8f83e7a3c52a b71de27086e3b75f41265915116f72ad70e1482a -- frontends/` printed nothing, rc=0: no file under frontends/ differs.
- `gh pr checks 312`, read between 2026-11-13T09:19:18Z and 09:19:20Z, rc=0, four checks, all pass:
  - `every commit is signed off	pass	9s`
  - `no profile path in the range	pass	12s`
  - `ported-notices	pass	7s` (run 43399377697)
  - `ported-notices	pass	7s` (run 43399386550)

## Findings for the custodian (Documentation, not blocking)
- The ruling `state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-03-…md` is not on origin/main at the time of this check. I checked the sentence against its scratch copy, whose hash matched. The filing commit should land before this report is filed, so that the report's cites resolve.

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.

Scratch outputs, under `<S>`: kflr2-diff.txt, kflr2-old.md, kflr2-new.md, kflr2-exp, kflr2-ins2, kflr2-checks.txt, and the base copies kflr2-tvsm.ts, kflr2-cas.ts, kflr2-wc.tsx, kflr2-app.tsx, kflr2-debounce.ts.
