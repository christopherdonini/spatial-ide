Reviewed: PR #223 at 61c64a8f25dca9b5af012e237b5849513ead5070 (base e555177c), that is cut/known-limitations-item-44 @ 61c64a8f25dca9b5af012e237b5849513ead5070
Verdict: PASS WITH NOTES

Nothing blocks. The change is right: the three lines match the form, all 22 pins recompute, every §B clause holds at the tag and at the base, the change stays in Scope, item 44's number is free, and every checker exits 0. There is one Documentation finding, in the PR body. Fix it before the merge; it needs no re-gate.

## Correctness
None. Every clause of §B holds at T (b391e43) and at the base (e555177c). The lines are listed under check 2.

## Evidence
None. The number check (§D item 7) has a gap in the worker's evidence. My own scan, under check 4, closes it.

## Documentation (fix before the merge; no re-gate)

**D-1. The PR body's number bullet rests on a scan that could not see item 43.**
- **Where:** `gh pr view 223`, the "Checks at 61c64a8f" list, third sub-bullet. It reads, byte-copied: "item 44 appears once, and no `origin/cut/*` branch claims 43 or 44 (the worker);"
- **What is wrong:** the worker's pattern was `grep -E '^ *(43|44)\. \*\*'` (worker report, line 46, at 3d93fc1d). That pattern cannot match the `**43.` form. Item 43 has been on main in that form since #222 merged (KNOWN-LIMITATIONS.md:390 at e555177c), and the same pattern counts 0 on e555177c's file. So the worker's sentence "Item 43 is not claimed anywhere either." is untrue at the base, and the bullet repeats that evidence.
- **Whose words:** the PR body is not the human's wording. The worker applies the words below with no re-gate, and the PR body lists them.
- **Replacement words:** "item 44 appears once at the head, and no other open branch, remote or local, has an item 44 (the reviewer's scan, which matches both the `44. **` and the `**44.` forms); item 43 is b2-piece-1b-recording's, on main since #222 in the `**43.` form, which the worker's pattern `^ *(43|44)\. \*\*` does not match;"
- **Clause check:**
  - "appears once at the head": a script over the head's file counts 1 line matching `^44\. `, at line 197.
  - "no other open branch, remote or local": `git show <b>:KNOWN-LIMITATIONS.md` on every unmerged `origin/*` and local branch, counting `^(\*\*)?44\. |item 44`. Only cut/known-limitations-item-44 is nonzero, with 2: the item and its column-0 comment. The kl44 and ccp worktrees add nothing; ccp changes only an engine test.
  - "item 43 … on main since #222": `**43.` sits at KNOWN-LIMITATIONS.md:390 at e555177c and :394 at the head. #222 merged at 6282b5ed, which is an ancestor of e555177c.
  - "does not match": the pattern needs a digit after optional spaces at the start of the line, and `**43.` starts with `*`. On e555177c's file it counts 0.
- **The filed report:** the report on main (3d93fc1d) is append-only and stays as filed. This gate's check 4 is the number evidence.

**Not a finding** (no change asked): item 44 says the third axis travels inside the manifest's definition text. Each partition carries the same definition as well, in the geometry field's `ARROW:extension:metadata` (engine/src/geoarrow.rs:448-457 at e555177c; :97-103 at T). The item makes no claim against this. The viewer reads that metadata at neither rev: a grep for `extension:metadata|EXT_META_KEY|crs_type` in renderer/bundle-viewer/src has no hits. So no sentence is untrue.

## Checks

**1. Tests+mutation line**
- **Diff:** `git diff origin/main...origin/cut/known-limitations-item-44` (rc 0) gives 1 file, +4/−0, and one commit, 61c64a8f.
- **The three lines:** a node script (scratch bytecheck.mjs, rc 0) took lines 19, 23 and 29 of the form, from `git show e555177c:` the form. It replaced only the bracket `[The human's wording, approved | The human's own words, given]` with `The human's wording, approved`, as Amendment 1 item 1 says, and compared the result with the head's lines 196–198. Result: item eq true, src eq true, the column-0 line found at line 196, no CR in either file.
  - The form at e555177c is byte-identical to origin/main's (`cmp` rc 0).
  - KNOWN-LIMITATIONS.md at the base is byte-identical to origin/main's (`cmp` rc 0).
- **Pins:** a node script (pins.mjs, rc 0) took every `path:line[-line] @ rev sha256:hex` in the source comment and hashed the pinned lines, joined with LF, plus one final newline. All 22 match: 6 at T and 16 at b9e78229, including skp.rs:1891.
  - These pins are historical, at b9e78229. None of their files changed from b9e78229 to e555177c, or from e555177c to origin/main, except kernel/src/skp.rs: `git diff --quiet` gives 0 for all twelve files checked. skp.rs did change, but the diff has no line on crs, axis, definition, epoch or edges, and the field moved from :1891 to :1904. The pin names its rev, so it still resolves as written.
- **No other item or line changed:** the diff is an insertion only, of 3 lines plus one blank line.

**2. §B at T and at the base**
At the base the relevant files are unchanged from the architect's rev M (see check 1), so every M line in §B holds at e555177c at the same line numbers.
- **C1:** holds at both. It is C3 to C11 taken together.
- **C2:** holds; it is a fact of the format. engine/ADMISSION-PREREGISTRATION.md:382 names the `#### epoch` heading, and engine/compat-corpus/of-record/MANIFEST.json:2434-2440 lists `"edges": "planar"` and `edges` among the keys, both at e555177c.
- **C3, C4:**
  - **D1 scan.** `git grep -n -w -E 'epoch|edges' <rev> -- engine/src kernel/src protocol frontends/shell/src frontends/shell/src-tauri/src renderer/bundle-viewer/src` gives rc 0 with 14 hits at T and rc 0 with 38 hits at e555177c. All of them are tile issue epochs, Unix-epoch comments, bbox "edges" titles and comments, and approval.rs's whitespace comment. None reads a GeoParquet member. A case-insensitive scan without `-w` finds only `UNIX_EPOCH` and the same edges text.
  - **The geo parser.** At T, geoparquet.rs:57-114 reads version, primary_column, columns, encoding, geometry_types, crs and covering. At e555177c, geoparquet.rs:372-470 also reads `bbox`.
  - **The open path.** It reads geo once: dataset.rs:264-266 at T, :354-356 at the base.
  - **The other reader of `geo`.** layout.rs is `#[cfg(feature = "fixture")]` (engine/src/lib.rs:118 at e555177c).
- **C5:** holds. DescribeSummary.tsx:30, :63 and :72-75 render only crsSummaryLine, the provenance line and the display convention (describeSummaryText.ts:17-28, :48, :68 at e555177c). No product file renders definition_json at either rev.
- **C6:** holds.
  - The manifest's crs members are bundle/mod.rs:794-813 at the base (:737-756 at T).
  - The viewer's exact key set is manifest.ts:86-88 at both revs.
  - The partition schema metadata is built from scratch (envelope.rs:120-258 at e555177c) and copies no file key-value metadata.
- **C7:** holds. axis_order_from_projjson reads only axes[0] and axes[1]: geoparquet.rs:677-727 at the base, :159-189 at T. It refuses fewer than two axes and sets no upper bound. The unit reader is :815-832 at the base and does not exist at T.
- **C8:** holds.
  - crs.rs:152-155 names two axes in every order.
  - describeSummaryText.ts:24 and :27.
  - publish/mod.rs:1277 and :1398, bundle/mod.rs:810 at the base; publish :1261 and bundle :753 at T.
- **C9:** holds.
  - The D3 scan, `git grep -n -E 'coordinate_system|"axis"' <rev> -- …`, gives rc 0 at both revs.
  - The product readers are geoparquet.rs:161-162 at T, and :679-680 and :817-818 at the base.
  - lod.rs:577-578 at the base reads every axis, but build_tiers has no product caller. Its only kernel call is skp.rs:2687, inside `#[cfg(test)] mod tests` (:2389-2390), and src-tauri has no hit. lod.rs does not exist at T.
  - The new code since M touches no axis or definition read. session_history.rs:426-446 at e555177c records only a hash of the definition.
- **C10:** holds. `Some(crs.to_string())` of the whole object, at geoparquet.rs:440 at the base and :104 at T.
- **C11:** holds.
  - The manifest stores the definition as a string: publish/mod.rs:1391-1394 at the base (:1254-1257 at T), and bundle/mod.rs:798-804.
  - In the viewer, the only reader of source_definition beyond the key set is manifest.ts:691, which checks only that it is a string.
  - The viewer's CRS line, main.ts:308 at the base (:219 at T), reads only crsSource, crsDisplay and crsTransform.

**3. Scope:** holds.
- One file on the branch, `KNOWN-LIMITATIONS.md`; PLAN.yaml is not touched.
- 4 lines in and 0 out by §21c's counting, under the budget of 20.
- Placement: the head's line 194 is item 42's on-main paragraph and 195 is blank. Then come the column-0 line (196), the item (197) and the comment (198), a blank line (199), and the heading `## On main since v0.1.0 — not in any release yet` (200).

**4. §D item 7, the number:** holds.
- At the head, one line matches `^44\. `. Item 43 is on main as 1b's, at :394.
- Every unmerged `origin/*` branch (19) and local branch was scanned with `^(\*\*)?44\. |item 44`. Only cut/known-limitations-item-44 is nonzero. Open PRs: only #223.
- The scan loop's rc was 0.

**5. Out-of-scope:** holds. The diff touches only KNOWN-LIMITATIONS.md: no ADR, nothing under protocol/, no code, no test, no app string.

**6. Checkers at the head**
- **Worktree:** `git worktree add --detach C:/dev/wt/gate223 61c64a8f25dca9b5af012e237b5849513ead5070` (rc 0); HEAD verified as 61c64a8f. Removed at the end with `git worktree remove C:/dev/wt/gate223` (rc 0); porcelain was empty first, and the worktree list no longer shows it.
- Each checker ran in the foreground with a 600 s timeout and its output redirected to a scratch file, with `echo rc=$?` right after:
  - `cd C:/dev/wt/gate223 && node scripts/plan/verify-cites.mjs > …/cites.txt 2>&1; echo rc=$?` gave rc=0: "verify:cites PASS … across 1958 file(s) resolves. (40 loose reference(s) advised above.)"
  - `… node scripts/plan/verify-quotes.mjs > …/quotes.txt 2>&1; echo rc=$?` gave rc=0: 129 checked, 98 verified, 0 hash-reference errors. It does not scan KNOWN-LIMITATIONS.md's pins; my pins.mjs above does.
  - `… node scripts/plan/verify-test-claims.mjs > …/testclaims.txt 2>&1; echo rc=$?` gave rc=0: 570 tests.
  - `… node scripts/plan/verify.mjs > …/verify.txt 2>&1; echo rc=$?` gave rc=0: "verify:plan PASS". I did not see the worker's rc=124 timeout.

**7. CI:** `gh pr checks 223 > …/checks.txt 2>&1; echo rc=$?` gave rc=0, 4 of 4 pass: every commit is signed off, no profile path in the range, and ported-notices twice. `gh api …/commits/61c64a8f…/check-runs` shows all four at head_sha 61c64a8f25dca9b5af012e237b5849513ead5070, conclusion success. No other workflow ran on this documents-only change.

No edit, commit, push or PR action was made. Writes went only to the scratch folder and the temporary worktree, which has been removed. No heavy command ran, so no hold was taken.

Relevant paths:
- C:/dev/spatial-ide/KNOWN-LIMITATIONS-ITEM-44-CRS-EPOCH-EDGES-THIRD-AXIS-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-17-known-limitations-crs-epoch-edges-third-axis-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-10-14-known-limitations-crs-epoch-edges-third-axis-tag-checks.md
- C:/dev/spatial-ide/state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md
