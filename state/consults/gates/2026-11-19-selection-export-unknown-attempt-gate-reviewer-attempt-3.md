Reviewed: PR #336 at 3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6 (the custodian's filing note, 2026-11-19: the reviewer, PR 336's one gate under its five-line form, attempt 3, limited by ADV-2026-11-19-20 item 5 to the merge; Bash 20, Read 6, SubagentHandback 1, one errored, model claude-opus-5-5, from 2026-11-19T12:13:38Z to 12:19:20Z by its transcript; the report below byte for byte from its hand-back of 17228 bytes, sha256 bfdc07ed8e88af4766304a8f46da4ad921695d1af20c4572497d2bc5d2feab62, nothing masked by the custodian, with this note in its first line and one final newline), gate, reviewer
Gate: PR #336, selection-export-unknown-attempt, reviewer, attempt 3, at 3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6
Verdict: PASS WITH NOTES
Reviewed: cut/selection-export-unknown-attempt @ 3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6

Scope: ADV-2026-11-19-20 item 5 limits this attempt to the merge (it is the advisor's ruling under the delegation of 2026-11-13, not the human's words). My only runs were reads, plus one byte-compare script in `<S>`. Before I ran them I gave this reason: to tie the tester's exe and build log to M, I read the exe's sha256, its size and its UTC file time. I ran no test, build or e2e.

## Findings

### Correctness
None.
- M's tree is the tree git itself computes for P and N (`git merge-tree --write-tree`, check 2), so the merge has no hand edit.
- None of the files the comment and the README line cite changed from P to M (check 3): PublishPanel.tsx, PublishDialog.tsx, colour.mjs, publish.mjs, lib.mjs, exportElapsed.mjs, App.tsx, client.ts, e2e-test-surface.ts and package-lock.json are byte-equal by blob.

### Evidence
None open.
- Item 4's run shows the suite at M on an app built after M was committed: 18 PASS, 0 FAIL, 1 SKIP, rc 0, and no unknown-attempt (check 4).
- CI at M: 14 checks pass, and all 9 runs at M succeeded (check 5).
- Observation (my reading, it does not block): one recorded-not-asserted field changed from the series. E-STATUS-HEIGHT reads `the residency item present in B: true` at M, against `false` at 9a4c5833. This fits main's first-look change, which plans tiles at the open's terminal. selection.mjs:799 at 3bbe2ab0 labels the field "recorded, not asserted". The README's selection entry makes no claim about it (grep, check 3). The tester's "No step's result differs from the series" (report line 64) is about results, and it holds.

### Documentation (must-fix before the merge where marked; nothing here is the human's wording)
- **D1 (for Amendment 2, which is not yet written; no current sentence is untrue).** Amendment 1, item 8, says PR 335's commits 5c913c14 and e1fd8495 "touch the E-FL entry, not the selection entry". The negative part holds: N's README line 760 is byte-equal to B's line 756 (check 2, c). But e1fd8495 also inserted two lines each at B lines 656 and 697 (the residency harness section), and it rewrote the layout entry's line (B line 740, the FILL text). When Amendment 2 names what main brought, it should name those hunks by reference (check 3), not repeat item 8's phrase. Amendment 1 is append-only and stays as it is.
- **D2.** At M, the selection entry's line is README.md:760, not 756. Any cite Amendment 2 or the new request makes to it is `frontends/shell/e2e/README.md:760 @ 3bbe2ab0`. The form on main has no bare line cite into the README (grep, check 3).
- Note: `gh pr view` gave `mergeable=UNKNOWN` at 12:17:09Z. This is GitHub's own computation and not a finding. The advisor's merge check reads it again.

## Check 1: Start
```
Thu Nov 19 12:13:54 UTC 2026
3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6
0
3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6	refs/heads/cut/selection-export-unknown-attempt
```
- The head is M.
- The porcelain is empty: 0 lines.
- `git ls-remote origin cut/selection-export-unknown-attempt` gives M.
- The tester's report is `<S>/selm-1.md`: 8348 bytes, sha256 7a100ee2ed7954496e45ca04af0329d18b97a53f03abe87e3130e3630bacc69c, the figure in the brief.

## Check 2: Item 3, by script
Commands: `git rev-list --parents -n1 M`, `git rev-parse` of each blob, `git diff --name-only N M` and `git log -1 --format=%B M`. The script `<S>/g336r3-check2.mjs` does whole-file byte compares through `git show`.
```
parents:
3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6 40173dfe3a077cbc54694559bc01ade3bfda6ac0 7c3ccbcfc8f71d6535a3f7134f034874ecb29167
sel blobs:
af2d599671a9d05da5adc2e597a40594cdd966e4
af2d599671a9d05da5adc2e597a40594cdd966e4
diff N M names:
frontends/shell/e2e/README.md
frontends/shell/e2e/selection.mjs
rc=0
numstat N M:
1	1	frontends/shell/e2e/README.md
14	1	frontends/shell/e2e/selection.mjs
```
Script output:
```
lines M N P B: 881 881 867 867
PASS a: M vs N differ at lines [760]
P vs B differ at lines [756] (P len 867 B len 867 )
PASS b: M line 760 byte-equal to P line 756 (the selection entry's line), 4535 bytes
PASS c: N line 760 byte-equal to B line 756 (main left the selection line as at B)
M line starts: "Asserted, each as a named step: `E-CLICK` (Navigate: the Fea"
PASS d: M README == N README with line L replaced by P's line (whole-file byte compare)
PASS e: selection.mjs M == P (bytes)
PASS f: selection.mjs N == B (main did not change it)
rc=0
```
Also checked:
```
merge-tree:
08e8f074083eb562f9b4902e74d2c8176ba33653
rc=0
M tree:
08e8f074083eb562f9b4902e74d2c8176ba33653
merge-base P N:
f5584f280a2ccc81467c19cab9658fd1189e353b
```
The message's first line, byte-copied: `Merge main at 7c3ccbcfc8f71d6535a3f7134f034874ecb29167 into cut/selection-export-unknown-attempt (ADV-2026-11-19-20 item 2)`. A `Signed-off-by` trailer is present. By script, it equals the configured `user.name <user.email>`, and it is the same trailer as on 40173dfe and 9a4c5833. I do not quote it.

Verdicts:
- Two parents, P then N, in that order: **PASS**.
- `selection.mjs` byte-equal at M and P: **PASS** (same blob af2d5996; e).
- README at M is N's file with one line changed (760), and that line is byte-equal to P's selection line (756): **PASS** (a, b, d).
- `git diff --name-only N M` names exactly the two files: **PASS**.
- The message names N, and the commit is signed off: **PASS**.
- No hand edit: **PASS**. M's tree equals git's own merge of P and N.

## Check 3: What main brought (`git diff --name-only B N -- frontends/`)
```
frontends/shell/MANUAL-WALKTHROUGH.md
frontends/shell/e2e/README.md
frontends/shell/e2e/command-bar.mjs
frontends/shell/e2e/layout.mjs
frontends/shell/e2e/open-fills-fit-view.mjs
frontends/shell/e2e/project.mjs
frontends/shell/package.json
frontends/shell/src/canvas/WorkingCanvas.tsx
frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx
frontends/shell/src/residency/candidateArmSession.test.ts
frontends/shell/src/residency/candidateArmSession.ts
```
(77 paths in all from B to N. Outside `frontends/`, the kernel paths are `kernel/src/project/mod.rs`, `store.rs` and `tests/project_save.rs`.)
- The product changes are `shownViewportBbox` in WorkingCanvas.tsx, and a terminal block in candidateArmSession.ts that plans the shown box after a Completed first look. `package.json` gains one script line.
- None of these is on the publish path. None of the publish, dialog and e2e library files the clauses cite changed P to M (by blob; see Correctness).
- Main's README hunks (`git diff -U0 B N`) are `@@ -656,0 +657,2 @@`, `@@ -697,0 +700,2 @@`, `@@ -740 +744 @@` and `@@ -843,0 +848,10 @@`, then 5c913c14's `@@ -854 +854 @@` inside E-FL. None of them is in the selection entry (B 750-764, M 754-768 by heading; script c).
- Main has not changed any `frontends/` path since N: `origin/main` = remote main = beb6e545e5e724db4c19e05ffe1ce40f97fad3a9, and `git diff --name-only N origin/main -- frontends/` is empty.

**The doc comment above `waitForExportDialog`, `frontends/shell/e2e/selection.mjs:564-568 @ 3bbe2ab0` (the function is at 569):**
- "for the dialog the prepare opens, and for the publishExecute hook": true. Line 570 polls both `publishExecute === "function"` and `.publish-dialog`, unchanged from P.
- "as colour.mjs does; publish.mjs waits for the hook alone": true. Both files are byte-equal P to M, so attempt 2's reads (colour.mjs:256, 261; publish.mjs:371, 165-175) stand.
- "answers unknown-attempt while … attemptIdRef is not yet set" and "A passive effect sets it after the commit that mounts the dialog": true. PublishPanel.tsx is byte-equal P to M.
- "narrows that window and does not close it (a case inside one CDP round trip …)": true.
  - Main's change adds tile planning on the canvas side. It does not touch the ref, the effect or the hook.
  - At most it changes how much render work lands in the window, which is the timing this clause already leaves open.
  - Item 4's single pass does not show the window closed.
- "passes PublishDialog's own attemptId prop and never reads that ref": true. PublishDialog.tsx and PublishPanel.tsx are byte-equal P to M.

**The README's selection line, `frontends/shell/e2e/README.md:760 @ 3bbe2ab0` (756 at 40173dfe), its last three sentences:**
- "before each execute": true. selection.mjs is byte-equal to P, so lines 575 and 633 still guard the only two sends, 576 and 636. I read 573-580 and 630-640 at M.
- "as `colour.mjs` does (`publish.mjs` waits for the hook alone)": true, as above.
- "only the dev hook reads the panel's `attemptIdRef`": true, as above.
- "An effect sets that ref after the commit that mounts the dialog … it does not close it": true, as above.

**`executeExport`'s doc comment, selection.mjs:573 @ 3bbe2ab0, directly above `const executeExport` at 574:** true.
- Its text is unchanged from B, and its placement is unchanged from P.
- The dev hook and the dialog's path are in PublishPanel.tsx and PublishDialog.tsx, which main did not touch.

**The selection entry beside main's E-FL entry (README 852-861 @ 3bbe2ab0):**
- E-FL asserts the first look's fill on the measure build, with operator-run launch and no CI. The selection entry makes no claim about the first look, the fit, tile streams or the measure build.
- My grep of lines 754-768 at M for stream, tile, fit, viewport, first look, residency or settle finds only E-SEL-FILTER's and E-DBLCLICK's own descriptions. Neither says anything main's change could falsify, and both passed at M.
- None of the selection entry's claims is made untrue.

## Check 4: Item 4's run (Evidence, not Authority)
- The report `<S>/selm-1.md` matches the sha256 in the brief (check 1).
- The suite log is `<S>/sel-e2e-h/out/sel-e2e-sel-m.log`: 83 lines, UTC mtime 2026-11-19T11:48:48Z. I read it whole.

Lines I rely on, byte-copied:
- Log line 1: `worktree C:/dev/wt/sel head 3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6 start 2026-11-19T11:37:53Z`
- Log line 4: `[selection] PENDING_ATTEMPT_TTL 600000ms, read from src-tauri/src/publish.rs`
- Log line 65: `[E-EXPORT] PASS (15888ms): row scope "row scope: the whole file — every row the dataset contains" and 2000 rows with a selection and without; prepare-to-execute 5ms 3ms`
- Log line 66: `[E-SCOPE] PASS (4297ms): execute refused after the filter changed; no bundle directory, no staging debris; prepare-to-execute 272ms`
- Log line 81: `[selection] 18 PASS, 0 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=PASS E-SCOPE=PASS E-ASK=PASS E-ASK-STATEMENT=PASS E-ASK-TWO=PASS E-STATUS-HEIGHT=PASS E-DBLCLICK=PASS`
- Log line 83: `rc=0 end 2026-11-19T11:48:48Z`
- Report line 27: "- The exe, `D:/wt-targets/sel/exes/spatial-ide-shell-sel.exe`, is 91557888 bytes, sha256 3040062fa73186a13517989832ad3afd01469504074c9eb9a9f0bba8315b008e. The series' exe at 9a4c5833 was 91553792 bytes, sha256 f62fb9fe...08d7, so this is a different build."
- Report line 5: "- HEAD was 3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6 and the porcelain was empty."

My own tie of the exe to M (the reason I named before running; these are reads):
```
M commit time UTC:
2026-11-19T11:25:48Z
3040062fa73186a13517989832ad3afd01469504074c9eb9a9f0bba8315b008e *D:/wt-targets/sel/exes/spatial-ide-shell-sel.exe
91557888
exe mtime UTC: 2026-11-19T11:37:08Z
build log mtime UTC: 2026-11-19T11:37:08Z
suite log mtime UTC: 2026-11-19T11:48:48Z
```
`<S>/selm-build.log` holds `viewer build rc=0`, `shell build rc=0`, `exe build rc=0`, the two Compiling lines (`spatial-ide-shell`, `spatial-kernel`), `Finished` in 2m 14s and `copied exe`.

**Reading:** yes. The suite at M ran on an app built at M, and every step passed.
- The exe on disk has the report's hash and size. It was copied after M was committed and before the suite started.
- The kernel recompiled because main changed `kernel/src/project/*` (check 3).
- Every step line reads PASS. EXPORT-TODAY is the standing SKIP.
- `grep`-free reading: no line names unknown-attempt. All five export steps executed (prepare-to-execute figures on lines 65-69).

**Does anything weaken it?** Not for item 4's question.
- (a) The load line `load sel-m 11:37:40Z 22,100,100` (report line 36) and `also=<m>` show a shared, busy machine. This bears on the milliseconds, which are not asserted. It does not bear on PASS/FAIL.
- (b) The tester did not check whether the app wrote the audit log (report line 39). No step's verdict depends on that file.
- (c) Report line 114 says the "hides nothing a person can meet" claim was not tested by the tester. It is a code reading, gated by attempt 1, check 3 (b), and it is unchanged at M.
- (d) One pass does not prove the window closed (report line 79). The comment says so.
- (e) The E-STATUS-HEIGHT recorded field changed, as noted under Evidence; it is not asserted.

## Check 5: CI at M
`gh pr checks 336`, read at Thu Nov 19 12:17:09 UTC 2026, rc=0. I write the owner as `<owner>`.
```
L1 portable correctness · cargo test --workspace (macos-latest)	pass	9m8s	https://github.com/<owner>/spatial-ide/actions/runs/44514839764/job/135528034068
L1 portable correctness · cargo test --workspace (ubuntu-24.04)	pass	15m5s	https://github.com/<owner>/spatial-ide/actions/runs/44514839764/job/135528034066
cargo fmt --check (workspace and src-tauri)	pass	18s	https://github.com/<owner>/spatial-ide/actions/runs/44514839767/job/135528033183
cargo test --workspace (windows-latest)	pass	21m33s	https://github.com/<owner>/spatial-ide/actions/runs/44514839764/job/135528033572
cfg boundary (PORTABILITY R2)	pass	8s	https://github.com/<owner>/spatial-ide/actions/runs/44514839822/job/135528033713
every commit is signed off	pass	9s	https://github.com/<owner>/spatial-ide/actions/runs/44514845351/job/135528053212
no profile path in the range	pass	14s	https://github.com/<owner>/spatial-ide/actions/runs/44514845319/job/135528051411
ported-notices	pass	9s	https://github.com/<owner>/spatial-ide/actions/runs/44514839754/job/135528032924
ported-notices	pass	20s	https://github.com/<owner>/spatial-ide/actions/runs/44514845323/job/135528051481
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	4m30s	https://github.com/<owner>/spatial-ide/actions/runs/44514839810/job/135528033703
tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing)	pass	4m39s	https://github.com/<owner>/spatial-ide/actions/runs/44514845383/job/135528053144
test · verify:plan · queue/site drift	pass	3m55s	https://github.com/<owner>/spatial-ide/actions/runs/44514839822/job/135528033305
typecheck · build · vitest · cargo test	pass	4m54s	https://github.com/<owner>/spatial-ide/actions/runs/44514839810/job/135528033245
typecheck · build · vitest · cargo test	pass	4m52s	https://github.com/<owner>/spatial-ide/actions/runs/44514845383/job/135528052352
rc=0
3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6 draft=false OPEN main mergeable=UNKNOWN
```
`gh run list --branch cut/selection-export-unknown-attempt --limit 30 --json databaseId,headSha,conclusion,name`, read at Thu Nov 19 12:17:11 UTC 2026, rc=0. I added status, event and createdAt to the fields.

The runs at M (3bbe2ab08312), all completed success:
- 44514845319 Exposure scan
- 44514845323 Ported notices
- 44514845351 DCO sign-off
- 44514845383 Product CI — shell
- 44514839754 Ported notices
- 44514839767 Rust fmt
- 44514839822 Governance CI — plan, queue, site
- 44514839810 Product CI — shell
- 44514839764 Product CI — Rust workspace

The merge brought kernel and governance paths into the range, so the Rust and Governance workflows ran at M as well.
- At 40173dfe3a07: 6 runs, all success.
- At 9a4c58332661: 6 runs, all success.
- No run on the branch is red or cancelled, at any head.

## Check 6: End
```
3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6
porcelain:[
]
0
Thu Nov 19 12:18:03 UTC 2026
```
- The head is M and the porcelain is 0 bytes.
- I wrote nothing in the worktree or the main checkout. The main checkout's porcelain shows the same two untracked entries the session started with.
- My scratch files are `<S>/g336r3-check2.mjs` and `<S>/g336r3-readme.txt`.

## Runs reused (none rerun)
- The tester's series `sel-head` at 9a4c58332661b6fd69fb477b1184f0147f38df2b: 18 PASS, 0 FAIL, 1 SKIP, rc 0.
- The base run `selb-base`: the suite as it stands at f5584f280a2ccc81467c19cab9658fd1189e353b, on the exe built at 9a4c58332661b6fd69fb477b1184f0147f38df2b: 15 PASS, 3 FAIL, 1 SKIP, rc 1.
- The run at M, `sel-m`, at 3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6 (exe sha256 3040062f…008e), 2026-11-19 from 11:37:53Z to 11:48:48Z: 18 PASS, 0 FAIL, 1 SKIP, rc 0. This is the tester's run under ADV-2026-11-19-20 item 4.
- My attempt 1 at 9a4c58332661b6fd69fb477b1184f0147f38df2b, and the runs it reused: the diagnosis runs at 619a7cc9 and d1d3a29f, and the two runs at 6f7e744c.
- My attempt 2 at 40173dfe3a077cbc54694559bc01ade3bfda6ac0, and its CI reads at 40173dfe and 9a4c5833.

## Model
Opus 5.5 (claude-opus-5-5), as the harness reports it.
