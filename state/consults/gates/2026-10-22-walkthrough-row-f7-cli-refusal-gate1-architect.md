Reviewed: PR #244 at 8fbd04ccde1ba35e8dde225223d6d5f8d1ec0222, gate 1, architect, main 53e30138, #241 at 2fc01f59
Verdict: PASS WITH NOTES

Branch and commit: `cut/walkthrough-row-f7-cli-refusal` @ 8fbd04ccde1ba35e8dde225223d6d5f8d1ec0222, read in the worktree `C:/dev/wt/f7`. #241 was read at 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d in `C:/dev/wt/rds`. The form and its Amendment 1 were read in the main checkout at 53e30138.

## Findings by class

**Correctness: none.** Every clause of the new row holds at #241's head (section 1 below).

**Evidence: none of mine.** §4 items 1 to 3 and E1 to E5 belong to the reviewer. I did not recompute any diff or hash, because I have no shell. Where a fact below rests on the worker's or the tester's filed report, I say so.

**Documentation: one finding, D1, to fix before the merge with no re-gate.**

- **D1. The PR body's statement of §2.3 drops two of its conditions.**
  - Source read: the custodian's scratch draft `pr-f7-body-1.md`. I have no `gh`, so I cannot say whether the live PR body matches it byte for byte. The custodian confirms that before applying this.
  - The body's fourth bullet under its order heading gives the revert as the only path if #241 does not merge. It leaves out the human's other choice, to keep the row until #241 merges, and leaves out that the record says which.
  - The body also leaves out §2.3's last bullet: §4 item 4 is re-run at #241's final head before this PR's click.
  - These words are the custodian's, not the human's. Apply them with no re-gate and list them in the PR body.
  - Replacement for that bullet: `If #241 does not merge at that sitting, the custodian reports it to the human that day and opens a docs-only revert of this PR, held for the human's click, unless the human chooses to keep the row until #241 merges; the record says which.`
  - New bullet after it: `If #241 changes before its merge, §4 item 4 is re-run at #241's final head before this PR's click; a failed check is an invalidator, this PR is not clicked, and the row is redrafted by amendment.`
  - Each clause checked against the form's §2.3:
    - reported to the human that day; a docs-only revert held for the human's click; the human may keep the row; the record says which: all four are in §2.3's bullet on #241 not merging at that sitting.
    - re-run at #241's final head before this PR's click; a failed fact is an invalidator; not clicked; redrafted by amendment: all four are in §2.3's bullet on #241 changing before its merge.

**Not findings against this diff, for the human:**
- **F8 (OPEN-1).** F8 still tells the operator to close a browser tab and terminal opened in F7, and its last sentence says the shell has no publish button. From this merge F8 contradicts the new F7 inside Part F. The sentence about the publish button has been untrue since Part G. §8 item 1 forbids fixing F8 here without a yes on OPEN-1.
- **G7 (OPEN-2).** G7 still calls its serve command Part F's F7 command. G7's command is complete in its own row, so the step still works.
- **OPEN-4.** After #241, a dev tree whose viewer was built before #241 has no `viewer-asset-hashes.json`, so G5's publish is refused. At A, `frontends/shell/src-tauri/src/publish.rs` reads `VIEWER_BUILD_RECORD`, and its message names `npm run build` in renderer/bundle-viewer. That refusal makes G5's predicted outcome untrue on such a tree; it does not make F7's sentence untrue. The case is the human's under OPEN-4.

## What I checked

### 1. Each clause of the new row, against A and Part G
- **The row at H is byte-equal to §2.1's row.** A fixed-string Grep of §2.1's row, anchored at the line end, matched `frontends/shell/MANUAL-WALKTHROUGH.md:274` in the f7 worktree.
- **Part G at B.** I read lines 255 to 334 at H in the f7 worktree and at main 53e30138. They are identical except for line 274. I treat H's Part G as B's on the strength of the worker's §4 item 3 (only line 274 differs), which the reviewer re-runs.
- **G1 sets a style as F2/F4 do:** true. G1 sets a distinctive style by Part F's F2/F4.
- **G2 to G5 publish it through Export interactive map… and its approval dialog:** true. G2 is the button and the save dialog, G3 is the approval dialog, G4 is a deliberate refusal, and G5 publishes, ending in **"Exported."** After #241 this holds through the shell's skip, which #241's R1 proves; the row does not claim it.
- **G7 serves the bundle and compares it with that style:** true. G7 runs `serve-bundle.mjs` on G5's destination and asks whether the style set in G1 visibly matches.
- **Refused by the redaction gate:** true at A.
  - `kernel/src/bin/publish-bundle.rs` calls `boundary::execute` (line 669). `main` prints `[publish] {e}` and returns `ExitCode::FAILURE`.
  - `BoundaryError::Publish(e)` displays `{e}` unchanged (`kernel/src/permission/boundary.rs`, line 162).
  - `run_inner` calls `redaction::first_undeclared_findings` with `|rel, bytes| req.viewer.is_built_asset(rel, bytes)`, returns `PublishError::RedactionFinding`, and only then reaches `staging.finalize` (`kernel/src/publish/mod.rs`, lines 953 to 974).
- **NOTICE.txt holds a credential match and a path match:** true at A.
  - `renderer/bundle-viewer/redaction-reviewed.json` holds the rows `NOTICE.txt` credential 19092 and `NOTICE.txt` local-filesystem-path 111337.
  - `ATTRIBUTABLE_CLASSES` is `["username", "machine-identifier"]` (`redaction.rs`, line 93), so neither match can be re-classed as declared.
  - The publish-bundle.rs module doc places both matches in licence texts.
- **The command line takes no viewer build record, so that file is not skipped:** true at A.
  - `ViewerAssets::` appears once in code, as `from_dir` (line 533), and `with_build_record` has no match in the file.
  - The `build_record` field starts empty (`viewer_assets.rs`, line 88).
  - `is_built_asset` returns false when the record has no entry for the path (lines 164 to 172).
- **The refusal names `viewer/NOTICE.txt` unless a top-level file matches first:** true at A.
  - `walk` sorts each directory's entries, scans files in order and pushes directories. It pops `viewer` before `data`.
  - The top-level files are exactly `manifest.json`, `style.json` and `build-info.json` (`bundle/mod.rs`, lines 59 to 61), and the directories are `data` and `viewer`.
  - `dist/` at A holds `NOTICE.txt`, `app.js` and `index.html` (Glob). Uppercase `N` sorts first, so `NOTICE.txt` is scanned before `app.js`, whose own path match never decides the name.
  - `first_only` returns the first file holding a finding that is not declared.
  - `RedactionFinding`'s `Display` names `{file}` (`error.rs`, lines 422 to 427), and `StagingNotRemoved` carries `({after})` (lines 444 to 449).
  - The tester's run (filed R-F7 report) named `viewer/NOTICE.txt` with exit code 1.
- **The module doc says the same:** true. The W12 paragraph (publish-bundle.rs, lines 47 to 58) states the same file and the same exception for top-level files. Its byte-equality with the form's W12 block is the worker's §4 item 4 result, for the reviewer.
- **Expected outcome cell:** this is G7's judgment (fill colour, fill opacity and outline match), restated without new claims.
- **No overclaim (§1):** no class, offset or count is claimed. Nothing about the shell's skip, the record or R2 is called proven.

### 2. §2.3's order, and the PR body
- The PR is a draft and nothing has been clicked.
- The body states the draft hold, this PR clicked first, nothing merged or committed to main between the two clicks, the window, and that no Part F sitting runs in it. All of this agrees with §2.3 items 2 to 4.
- #241's own final merge of main lands on #241's branch, not on main, so the body's wording on the two clicks is consistent.
- The two omissions are D1.

### 3. Amendment 1's class 3 correction of §4 item 4: within the form
- `renderer/bundle-viewer/LICENSES` does not exist at A. Glob found `notice.mjs` and `portedNotices.mjs` there and no `LICENSES/`, and found `LICENSES/` at the repository root.
- The corrected paths are the ones the redaction form's own clause names. At line 641 in both the main checkout and A, that clause covers `LICENSES/**`, `notice.mjs` and `portedNotices.mjs`, and it is the line §2.1 cites for item 4.
- The claim (the licence texts are not edited by #241) is unchanged. Only where the check points changes, which is class 3 (`docs/PREREGISTRATION-TEMPLATE.md`, class 3).
- The amendment's heading says it was written after the results were seen, and it edits nothing above it.
- I did not recompute the empty diff from c7d02156 to 2fc01f59. The worker and the custodian both report it. It is Evidence, for the reviewer.

### 4. §8, item by item
1. **Only F7 changed:** at H, the rows I read other than F7 (lines 255 to 334) equal main's. The whole-file check is §4 items 1 and 3, the reviewer's. Pass.
2. **No code, test or string change:** the worker's `--name-only` lists the walkthrough alone. Pass, subject to the reviewer's re-run.
3. **No quotation in new text:** the row has no double-quote characters. The P6 message is not reproduced. The old row's quoted spans go with the whole-row replacement §2.1 prescribes. Pass.
4. **No overclaim:** see section 1. Pass.
5. **References:** no bare `path:line` in the row. Amendment 1 holds no hash pins, and it names branch facts by full commit id. Pass.
6. **No OPEN item applied:** F8, G7 and the deviation paragraph are unchanged at H. Pass.
7. **Order:** the PR is a draft and nothing is clicked. Pass for now; this binds at the sitting.
8. **§7:** 1+1 against a ceiling of 2, by the worker's numstat. §7 reads as preregistered, and Amendment 1 does not edit it. Pass.
9. **No scope addition:** pass.
10. **verify-mutation:** no record of this piece calls any run an observation of a mutation. Pass.
11. **No record under `state/` edited:** the diff is one file. Pass.

Files read:
- `C:/dev/spatial-ide/frontends/shell/WALKTHROUGH-ROW-F7-CLI-REFUSAL-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/consults/2026-10-22-walkthrough-row-f7-cli-refusal-worker-report.md`
- `C:/dev/spatial-ide/state/consults/2026-10-22-walkthrough-row-f7-cli-refusal-r-f7-tester-report.md`
- `C:/dev/wt/f7/frontends/shell/MANUAL-WALKTHROUGH.md`
- `C:/dev/spatial-ide/frontends/shell/MANUAL-WALKTHROUGH.md`
- `C:/dev/wt/rds/kernel/src/bin/publish-bundle.rs`
- `C:/dev/wt/rds/kernel/src/publish/mod.rs`
- `C:/dev/wt/rds/kernel/src/bundle/redaction.rs`
- `C:/dev/wt/rds/kernel/src/publish/viewer_assets.rs`
- `C:/dev/wt/rds/kernel/src/publish/error.rs`
- `C:/dev/wt/rds/kernel/src/permission/boundary.rs`
- `C:/dev/wt/rds/renderer/bundle-viewer/redaction-reviewed.json`
- `C:/dev/wt/rds/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md`
- `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md`
