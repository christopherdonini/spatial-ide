Reviewed: PR #336 at 40173dfe3a077cbc54694559bc01ade3bfda6ac0 (the custodian's filing note, 2026-11-19: the reviewer, PR 336's one gate under its five-line form, attempt 2, limited by ADV-2026-11-19-13 item 6 to findings 1 to 4 and running nothing; Bash 8, Read 3, none errored, model claude-opus-5-5, from 2026-11-19T09:34:22Z to 09:36:51Z by its transcript; the report below byte for byte from its hand-back of 12198 bytes, sha256 d71a97e144d8f0bdca165d48ea0d99d3568a81b822d1a80c4c6d96b2b959b117, nothing masked by the custodian, with this note in its first line and one final newline), gate, reviewer
Gate: PR #336, selection-export-unknown-attempt, reviewer, attempt 2, at 40173dfe3a077cbc54694559bc01ade3bfda6ac0
Verdict: PASS
Reviewed: cut/selection-export-unknown-attempt @ 40173dfe3a077cbc54694559bc01ade3bfda6ac0

Brief: `<S>/brief-g336r2.md`, sha256 `400748c3654b9c223532e7cfa2a7c5ea33f57bce24e0128bf9bf96ba927b00c3` (it matches the figure in the dispatch).
Scope: ADV-2026-11-19-13 item 6 limits this attempt to attempt 1's findings 1 to 4. I ran nothing. Findings 5 and 6 of attempt 1 go to the closing under the same ruling's items 5 and 3, and this attempt does not judge them.

## Findings

### Correctness
None. H2 changes only comment and README text (check 3). The product code that attempt 1 checked is byte-identical at H2, because only the two e2e files differ from H to H2.

### Evidence
None open.
- **Finding 1 (attempt 1, blocking Evidence) is answered.** The base run meets ruling item 1's first branch: E-EXPORT failed with unknown-attempt. Its FAIL is not INCONCLUSIVE, because U was 79 ms against a TTL of 600000 ms. See check 2.
- **Observation (my reading, it does not block).** The run at B was taken under a shared hold, and its load line reads 33-37%. Attempt 1 did not record the load during the series at H. So the B fail and the H pass are not shown to have run under equal load.
  - This does not weaken item 1's reading. Item 1 asks whether the failure appears without the wait at B, and it did, in 3 of the 5 export steps.
  - It is consistent with the comment's own words that the wait "narrows that window and does not close it". The pass at H was always a single pass, as attempt 1 said.

### Documentation
None open. Findings 2, 3 and 4 are applied byte for byte (check 3), and their clauses still hold at H2 (check 4). None of these sentences is the human's wording. The PR body should list the applied words, as ADV-2026-11-19-13 item 2 and the wording-blocks rule require.

## Check 1: Start
```
Thu Nov 19 09:34:39 UTC 2026
40173dfe3a077cbc54694559bc01ade3bfda6ac0
porcelain:[
]
40173dfe3a077cbc54694559bc01ade3bfda6ac0	refs/heads/cut/selection-export-unknown-attempt
```
- The worktree's HEAD is H2.
- The porcelain is empty.
- The remote ref is H2.

`git log --oneline H..H2` shows one commit:
```
40173dfe docs: the export wait's comment and README line in the gate's words, and its doc comment back above executeExport (selection-export-unknown-attempt; ADV-2026-11-19-13 item 2)
```

## Check 2: Finding 1 against the base run
I read `state/consults/2026-11-19-selection-export-unknown-attempt-base-run-tester-report.md` as Evidence. The lines I rely on, byte-copied:

Line 12:
"- `git diff --name-only f5584f28 HEAD` printed exactly `frontends/shell/e2e/README.md` and `frontends/shell/e2e/selection.mjs`."

Lines 21-22:
"- `hash-object` printed 67b23f66e176b5500608da9cadc9163676b9cb75, and `rev-parse f5584f28:frontends/shell/e2e/selection.mjs` printed the same value."
"- `diff --stat`: `frontends/shell/e2e/selection.mjs | 15 +--------------` and `1 file changed, 1 insertion(+), 14 deletions(-)`."

Line 15:
"- The exe is 91553792 bytes with sha256 f62fb9feae7279a678b72dd8e7ed88b6820cc982b600627ef83d05cc074608d7, as required."

Line 36:
"  - `[E-EXPORT] FAIL (11917ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 79ms, T 600000ms); prepare-to-execute 0ms`"

Line 39 (cut here):
"- Tally line 81: `[selection] 15 PASS, 3 FAIL: … E-EXPORT=FAIL E-SCOPE=PASS E-ASK=FAIL E-ASK-STATEMENT=PASS E-ASK-TWO=FAIL …`"

Line 84:
"- Revert: `git checkout -- frontends/shell/e2e/selection.mjs` gave rc=0, the porcelain was empty, and HEAD was 9a4c58332661b6fd69fb477b1184f0147f38df2b."

Line 72 (the tester's own caveat):
"- This is my reading, not a measurement: all three failed in one run, which suggests the window is wide on this run. This was a shared hold with `also=` present, which the load line (33 to 37%) reflects. Whether it depends on timing in this shared run is for the custodian to decide. I did not re-run, as the brief requires."

**Answers to the two questions:**
- **Did E-EXPORT fail with unknown-attempt?** Yes (line 36).
  - It reads FAIL, not INCONCLUSIVE, because U is 79 ms against T of 600000 ms.
  - The selection.mjs in place was B's, by blob hash (line 21).
  - The exe was built at H. H differs from B only in the two e2e files (line 12), so the app under test is B's product code.
  - By ADV-2026-11-19-13 item 1, finding 1 is answered.
- **Does anything weaken that reading?** Not for item 1's question.
  - The only caveat is line 72's shared-hold load, discussed under Evidence above.
  - "prepare-to-execute 0ms" at B against 3-5 ms at H (lines 58 and 70) is consistent with the wait being the difference.
  - The revert left the porcelain empty (line 84), and my check 1 confirms the worktree is clean now.

## Check 3: Findings 2, 3 and 4 by script on `git diff H H2`
The script is `<S>/g336r2-check3.mjs`. It reads attempt 1's filed report on main, takes the fenced block that follows "Replacement for `selection.mjs:565-569 at 9a4c5833`:" and the quoted README line, and compares them with `git show` of H and H2.
```
git diff --numstat H H2
1	1	frontends/shell/e2e/README.md
4	4	frontends/shell/e2e/selection.mjs
```
Script output:
```
PASS a: files changed = ["frontends/shell/e2e/README.md","frontends/shell/e2e/selection.mjs"]
  report block lines 265-269 (1-based), 5 lines
  H lines 564-569:
   564: /** Executes the prepared attempt with the phrase an operator types (the destination's fin
   565: /**
   566:  * Waits for the dialog the prepare opens, and for the publishExecute hook, before an exec
   567:  * The hook answers unknown-attempt while PublishPanel's attemptIdRef is not yet set, whic
   568:  * attemptId prop and never reads that ref, so the wait hides nothing a person can meet.
   569:  */
PASS b: finding 2 block byte-equal in H2 at lines 564-568
PASS b: block sits directly above waitForExportDialog (H2 line 569)
PASS b: H's old block was lines 565-569 above waitForExportDialog
PASS d: H line 564 is the Executes doc line
PASS d: H2 line 573 (above const executeExport at 574) byte-equal to H line 564
PASS d: the Executes line appears once in H2
PASS e: selection.mjs at H2 == H with exactly findings 2 and 4 applied (whole-file byte compare)
PASS c: report quote line found, 485 chars
PASS c: H README line 756 ends with the old two sentences
PASS c: H2 README line 756 == H prefix (unchanged, 4049 chars) + the report's quoted text
PASS e: README differs only at line 756 (867 lines both)
rc=0
```

Verdicts:
- **Only the two files changed:** PASS.
- **Finding 2:** PASS. The block is byte-equal, in place of H's lines 565-569.
- **Finding 3:** PASS. H's 4049-character prefix of line 756 is unchanged, and the two old sentences are replaced by the quoted text byte for byte.
- **Finding 4:** PASS. `/** Executes the prepared attempt … */` is now H2 line 573, directly above `const executeExport` at 574, and it is byte-equal to H line 564.
- **Nothing else differs:** PASS, by the whole-file rebuild compare for selection.mjs and the line-by-line compare for the README.

## Check 4: The clauses at H2
- The only line moves are in selection.mjs. The wait's poll moved from 571 to 570 and its `expect` from 572 to 571. Lines 574 onward are unchanged.
- PublishPanel.tsx, PublishDialog.tsx, colour.mjs and publish.mjs are byte-identical from H to H2 (check 3 a). I re-read their cited lines at H2.

Finding 2's clauses:
- "for the dialog … and for the publishExecute hook": selection.mjs:570 at 40173dfe (moved from 571). True: the poll tests both `publishExecute === "function"` and `.publish-dialog`.
- "as colour.mjs does": colour.mjs:256 (the dialog's DOM) and 261 (the hook) at 40173dfe. True.
- "publish.mjs waits for the hook alone": publish.mjs:371 and 165-175 at 40173dfe (`waitForHook`). True.
- "answers unknown-attempt while … not yet set": PublishPanel.tsx:546-550 at 40173dfe. True.
- "A passive effect sets it after the commit that mounts the dialog": PublishPanel.tsx:534-536 (`useEffect`) and 739-748 at 40173dfe. True.
- "narrows … does not close it (a case inside one CDP round trip)": attempt 1's check 4 reading, unchanged. The base run at B shows the window without the wait. Nothing at H2 shows it closed. True.
- "passes PublishDialog's own attemptId prop": PublishDialog.tsx:182, 209 and 94-100 at 40173dfe, and PublishPanel.tsx:741 `attemptId={state.attemptId}`. True.
- "never reads that ref": `grep -n attemptIdRef` on PublishPanel.tsx at 40173dfe gives 533, 535 and 547 in code, plus comments at 543 and 566. The only read is in `runExecute` (547), which is reached only through the dev hook (571 `if (!import.meta.env.DEV) return;`, 578). True.

Finding 3's clauses:
- "before each execute": selection.mjs:575 and 633 at 40173dfe guard the only two `publishExecute(` sends, 576 and 636. Unchanged lines. True.
- The other clauses are as for finding 2. True.

Finding 4: `executeExport` at 574 now carries its own doc line at 573. True.

## Check 5: CI at H2
Read at `Thu Nov 19 09:35:44 UTC 2026`. I wrote the repository owner as `<owner>`.
```
every commit is signed off	pass	13s	https://github.com/<owner>/spatial-ide/actions/runs/44495676520/job/135462111316	
no profile path in the range	pass	14s	https://github.com/<owner>/spatial-ide/actions/runs/44495676678/job/135462111197	
ported-notices	pass	8s	https://github.com/<owner>/spatial-ide/actions/runs/44495668921/job/135462084279	
ported-notices	pass	8s	https://github.com/<owner>/spatial-ide/actions/runs/44495676544/job/135462111176	
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	3m53s	https://github.com/<owner>/spatial-ide/actions/runs/44495669079/job/135462086102	
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	3m49s	https://github.com/<owner>/spatial-ide/actions/runs/44495676554/job/135462112878	
typecheck · build · vitest · cargo test	pass	4m47s	https://github.com/<owner>/spatial-ide/actions/runs/44495669079/job/135462085345	
typecheck · build · vitest · cargo test	pass	4m13s	https://github.com/<owner>/spatial-ide/actions/runs/44495676554/job/135462112599	
rc=0
40173dfe3a077cbc54694559bc01ade3bfda6ac0 draft=true OPEN main
```
`gh run list --branch cut/selection-export-unknown-attempt --limit 20 --json databaseId,headSha,conclusion,name`, read at 09:35:55Z, rc=0. The runs at H2 (40173dfe3a077cbc54694559bc01ade3bfda6ac0), all success:
- 44495676678 Exposure scan
- 44495676520 DCO sign-off
- 44495676554 Product CI — shell
- 44495676544 Ported notices
- 44495669079 Product CI — shell
- 44495668921 Ported notices

The runs at H (9a4c58332661b6fd69fb477b1184f0147f38df2b), all success: 44482098412, 44482098405, 44482098410, 44482098557, 44431693498 and 44431693515.

No run on the branch is red or cancelled, at any head.

## Check 6: End
```
Thu Nov 19 09:35:55 UTC 2026
40173dfe3a077cbc54694559bc01ade3bfda6ac0
porcelain:[
]
0
Thu Nov 19 09:35:55 UTC 2026
```
HEAD is H2 and the porcelain is empty (0 bytes). I wrote nothing in the worktree or the main checkout. My only scratch file is `<S>/g336r2-check3.mjs`.

## Runs reused (none rerun)
- **The tester's series `sel-head`** at 9a4c58332661b6fd69fb477b1184f0147f38df2b, 2026-11-19 from 07:24:04Z to 07:35:26Z: 18 PASS, 0 FAIL, 1 SKIP, rc 0. Exe sha256 f62fb9fe…08d7, 91553792 bytes.
- **The base run `selb-base`:** the suite as it stands at f5584f280a2ccc81467c19cab9658fd1189e353b, run on the exe built at 9a4c58332661b6fd69fb477b1184f0147f38df2b, 2026-11-19 from 08:51:56Z to 08:58:05Z: 15 PASS, 3 FAIL, 1 SKIP, rc 1.
- **Attempt 1's mutation reading**, at 9a4c58332661b6fd69fb477b1184f0147f38df2b against 619a7cc9 and f5584f28. Its check 5 named the path, and its finding 1 is now answered by the base run.
- **The runs attempt 1 reused:** the diagnosis runs at 619a7cc9 (A) and d1d3a29f (N) from the 2026-11-18 tester-high report, and the two runs at 6f7e744c (for its check 3 (e) only).
- **CI at H**, in the run ids listed under check 5, reused as read in attempt 1 and listed again here.

## Model
Opus 5.5 (claude-opus-5-5), as the harness reports it.
