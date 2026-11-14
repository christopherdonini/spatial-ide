*Custodian's filing note (2026-11-14): the architect's draft of Amendment 15 to PR B's form (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`), written at the merge of main into PR B's branch at 5b309b78, read only at main 08ce9935, from its brief by file (5069 bytes, sha256 2b08b07bd43a734a4d07ed5e11081371f9f1f41bb0f809357544620afb455420, written at 2026-11-14T08:44:14Z). Dispatched at 2026-11-14T08:44:15Z by its transcript; handed back at 2026-11-14T08:55:45Z (claude-opus-5-5, architect; calls Read 46, Grep 14, Glob 10 and the hand-back, 71 in all; none errored; no write). The draft below was extracted by script from the hand-back in that transcript (21980 bytes, sha256 b1281a37a5a1d532cbcf9819567c9d8b1442a178d23b73f5900cf015b3a53f4e). Nothing is changed. Its `sha256:<H>` and `<C>` placeholders are left as drafted; the form's Amendment 15 fills them by script, with the custodian's changes its carrying note lists. Since this draft, PR #317 has merged (83e7b801), and the advisor's ruling ADV-2026-11-14-14 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-14-the-notice-is-enough-no-further-run-at-m-prime-one-more-merge-of-main-into-pr-b-before-its-gates-amendment-15-records-the-blob.md`) has answered its finding E1.*

---

cut/b1-shell-half-pr-b @ 5b309b78e14bb40109656cb4e0d7ee62abf79156 (main read at 08ce993532d483f87ca0c50c2ee4e64f5863f020). **Verdict: pass with notes.** Correctness: none. Evidence: one note for PR B's gates (E1); it does not affect this amendment. Documentation: D1 to D4, each must be fixed before the commit. D1 to D3 are already fixed in the block's own text.

How I read it: this run had Read, Grep and Glob only, no Bash. Every `sha256:<H>` and `<C>` is left for the custodian's script. Branch facts come from reading files in `C:/dev/wt/m4b`, the reflog at `C:/dev/spatial-ide/.git/worktrees/m4b/logs/HEAD` and the remote-tracking refs. They are reads, not hashes.

````
## Amendment 15: main merged into PR B's branch at 5b309b78 (class 1); the 23 moved ranges and KL-3's number taken up at the merge (class 3); the session-end phase's class 8, item 2 (a) of the human's message of 2026-11-12 (13:07Z) with item 4's pin, and the rest of the series at M′, all moved here by Amendment 14 item 6. Written by the custodian at the merge, before the colour-by phase's code.

*Drafted read only by the architect at main 08ce993532d483f87ca0c50c2ee4e64f5863f020, with PR B's branch read at 5b309b78e14bb40109656cb4e0d7ee62abf79156 (`state/consults/2026-11-14-b1-shell-half-pr-b-amendment-15-the-merge-of-main-architect-draft.md`). The custodian's script fills each `sha256:<H>` with the sha256 of the cited whole lines, each with its LF, at 08ce9935. It fills each `<C>` with what the named command prints. A sub-line span carries its line's hash and says so. Branch commits are named in words and never hashed (round 25, item 2). References only: nothing below is a quotation. §7 is not edited.*

1. **The merge (class 1; Amendment 14 item 4, step (3)).**
   - The merge commit is 5b309b78e14bb40109656cb4e0d7ee62abf79156 on `cut/b1-shell-half-pr-b`. It is a merge commit, never a rebase. Its parents are 6649a443 (the branch) and 08ce993532d483f87ca0c50c2ee4e64f5863f020 (main), and its message names 08ce9935. The branch's remote head is 5b309b78.
   - Steps (1) and (2) came before it. Amendment 14 is on main at 08ce9935. The re-read's condition is read below.
   - **§7's count.** This is a named merge of main. From here `<base>` is 08ce9935, the main commit the merge names.
     - Never the merge commit itself: that would drop the session-end phase's lines.
     - Never an older base: that would count main's changes.
     - §7's command at 5b309b78 with that base prints `<C>`. Predicted: the phase's 16 files, 235 insertions and 76 deletions (item 3 (a)), because main has changed no phase file since M″. A difference stops before code.
   - **Path-disjoint.** `git diff --name-only bb8835c6 08ce9935` lists `<C>` paths. The branch's own paths since bb8835c6 are the 16 phase files (`state/consults/2026-11-14-b1-shell-half-pr-b-re-read-before-amendment-14-worker-report.md:41-43 @ 08ce9935 sha256:<H>`). The two lists share no path.
   - **The seam on the branch.** PB-E2's interface (Amendment 14 item 1) is now on the branch. `published_columns` is at `frontends/shell/src/publish/types.ts` lines 48-51 and `frontends/shell/src/publish/PublishDialog.tsx` lines 261-264 at 5b309b78, read by the architect, the same lines as Amendment 14's pins at 54ee3522.
   - **Rule (00) at the merge (§2.9).** By `git diff --name-only origin/main...<head>` at 08ce9935:
     - port-2 at 83d2ecef, second-open at 5e6b79bc and the findings branch at 9fb3aff1. These are the heads the re-read's Step 5 read, and its table stands (`state/consults/2026-11-14-b1-shell-half-pr-b-re-read-before-amendment-14-worker-report.md:149-158 @ 08ce9935 sha256:<H>`).
     - The pan-anchor fix (#317) at 3bb1d065: `frontends/shell/e2e/pan-anchor.mjs` only.
     - 12c at 1889a28a: its Scope is `kernel/tests` only (`governance/forms/kernel/CLIPPY-DENY-WARNINGS-WORKSPACE-12C-PREREGISTRATION.md:16 @ 08ce9935 sha256:<H>`).
     - 1c's branch: no 1c step dispatches while a milestone 4 PR is in progress (§2.9).
     - None of them shares a path on PR B's list, apart from the records the re-read names, which are separate items, rows and entries. The merge adds no path to PR B's list.
   - **Amendment 14 item 4's re-read condition.** `git diff --name-only 57451bb3 08ce9935` lists `<C>` paths, none outside governance/, state/ and site/. The condition is not met. The re-read at 57451bb3 is the re-read for this merge and is not made again.
   - **OPEN-2's condition (Amendment 14 item 8).** `git diff b6924acea0ee757f679551442d09d1353b595d3b 08ce9935 -- frontends/shell/e2e frontends/shell/package.json` prints nothing, and #317 is not merged. The condition names no suite, so nothing runs at the merge before code.

2. **The moved ranges and KL-3's number (class 3, the tree authoritative; Amendment 14 item 4).**
   - **The 23 ranges.** They are the re-read's Moved ranges (`state/consults/2026-11-14-b1-shell-half-pr-b-re-read-before-amendment-14-worker-report.md:58-81 @ 08ce9935 sha256:<H>`), with bytes unchanged.
     - Each `<H>` must equal the hash the range carries at its own pinned commit. A range whose hash differs is not a move, and it stops this amendment.
     - There are 21 distinct ranges: publish.rs 1286-1307 and MANUAL-WALKTHROUGH.md 1930 each stand for one pin of each group.
   - **§0.2, from 4b26d279:**
     - SKP-V0.md 1149-1171 → `protocol/skp/SKP-V0.md:1170-1192 @ 08ce9935 sha256:<H>`
     - SKP-V0.md 1179-1181 → `protocol/skp/SKP-V0.md:1200-1202 @ 08ce9935 sha256:<H>`
     - SKP-V0.md 1196-1211 → `protocol/skp/SKP-V0.md:1217-1232 @ 08ce9935 sha256:<H>`
     - SKP-V0.md 83 → `protocol/skp/SKP-V0.md:89 @ 08ce9935 sha256:<H>`
     - App.tsx 1561 → `frontends/shell/src/App.tsx:1650 @ 08ce9935 sha256:<H>`
     - App.tsx 1674 → `frontends/shell/src/App.tsx:1765 @ 08ce9935 sha256:<H>`
     - engine/README.md 325-336 → `engine/README.md:329-340 @ 08ce9935 sha256:<H>`
     - pick.ts 134 → `frontends/shell/src/canvas/pick.ts:135 @ 08ce9935 sha256:<H>`
     - workspaceState.ts 68-86 → `frontends/shell/src/workspace/workspaceState.ts:72-90 @ 08ce9935 sha256:<H>`
     - viewTransitions.ts 34-38 → `frontends/shell/src/workspace/viewTransitions.ts:35-39 @ 08ce9935 sha256:<H>`
     - viewTransitions.ts 157 → `frontends/shell/src/workspace/viewTransitions.ts:158 @ 08ce9935 sha256:<H>`
     - document.ts 56-61 → `frontends/shell/src/style/document.ts:55-60 @ 08ce9935 sha256:<H>`
     - document.ts 109-118 → `frontends/shell/src/style/document.ts:108-117 @ 08ce9935 sha256:<H>`
     - publish.rs 1225-1246 → `frontends/shell/src-tauri/src/publish.rs:1286-1307 @ 08ce9935 sha256:<H>`
     - fixture.rs 860 → `engine/src/fixture.rs:998 @ 08ce9935 sha256:<H>`
     - MANUAL-WALKTHROUGH.md 1927 → `frontends/shell/MANUAL-WALKTHROUGH.md:1930 @ 08ce9935 sha256:<H>`
   - **Amendment 12, from b7b721eb:**
     - publish.rs 1258-1279 → 1286-1307 (above)
     - MANUAL-WALKTHROUGH.md 1929 → 1930 (above)
     - KNOWN-LIMITATIONS.md 506 → `KNOWN-LIMITATIONS.md:507 @ 08ce9935 sha256:<H>`
     - WorkingCanvas.tsx 181-182 → `frontends/shell/src/canvas/WorkingCanvas.tsx:183-184 @ 08ce9935 sha256:<H>`
     - MANUAL-WALKTHROUGH.md 273, 277 and 469 → `frontends/shell/MANUAL-WALKTHROUGH.md:274 @ 08ce9935 sha256:<H>`, `frontends/shell/MANUAL-WALKTHROUGH.md:278 @ 08ce9935 sha256:<H>` and `frontends/shell/MANUAL-WALKTHROUGH.md:470 @ 08ce9935 sha256:<H>`
   - **The same ranges on the branch at 5b309b78** (named in words, no hash).
     - 20 of the 23 hold at the lines above. Nineteen are in files the branch never changed. The twentieth is workspaceState.ts 72-90, which the architect read at 5b309b78.
     - The other three sit where the M′ re-read put them, moved by the phase's commit 0b247f29: App.tsx 1650 is at 1660, App.tsx 1765 at 1775, and pick.ts 135 at 139.
   - **Moved on the branch only, Same on main** (the re-read's reading against M′, at lines 83-86 of the same report). These are Amendment 12's App.tsx and pick.ts pins, as the M′ re-read records them (`state/consults/2026-11-13-b1-shell-half-pr-b-re-read-at-m-prime-worker-report.md:63-70 @ 08ce9935 sha256:<H>`):
     - pin 9: 1650 → 1660;
     - pin 10: 1765 → 1775;
     - pin 19: pick.ts 135 → 139;
     - pin 46: 1193-1211 → 1203-1221, with 1196 → 1206;
     - item 6's pin: 1382 → 1392;
     - item 9's pins: 1282 → 1292, 686 → 694, 1656 → 1666 and 1540 → 1550.
     - For PR B's code, the branch's lines are authoritative in those two files. The architect read 1660, 1775, 139, 1206, 1392 and 694 at 5b309b78. These are reads, not hashes.
   - **KL-3's number is 65.**
     - The highest item at 08ce9935 is 64, the first-look item (`KNOWN-LIMITATIONS.md:511 @ 08ce9935 sha256:<H>`; the re-read's Step 6, `state/consults/2026-11-14-b1-shell-half-pr-b-re-read-before-amendment-14-worker-report.md:168 @ 08ce9935 sha256:<H>`).
     - Numbers are not reused, so 65 stays KL-3's when the first-look node withdraws 64.
     - Amendment 12 item 7's other numbers are unchanged.

3. **Amendment 14 item 6's moved items.**
   - (a) **The session-end phase's class 8.**
     - How it was counted: insertions plus deletions per file, from M″ c85788f1 to the phase's head b8127685, all 16 files inside §7's pathspec (`state/consults/2026-11-12-b1-shell-half-pr-b-session-end-phase-worker-report.md:71-99 @ 08ce9935 sha256:<H>`).
     - The ceilings: Amendment 12 item 13's session-end row and SE-R1 row. Their per-file values are the session-end draft's table (`state/consults/2026-10-25-b1-shell-half-pr-b-session-end-class-9-ahead-architect-draft.md:99-103 @ 08ce9935 sha256:<H>`).
     - **Over** (class 8, none trimmed): FeatureTab.tsx 17 of 15; selection.ts 7 of 6; workspaceState.ts 18 of 15; App.test.ts 40 of 35; pick.test.ts 21 of 20; App.lateResult.test.tsx 53 of 40, SE-R1's row. pick.ts is at its ceiling, 20 of 20.
     - **Within:**
       - the five new-to-list product files: 67 of 71;
       - App.tsx and workspaceState.ts: 60 of 60;
       - the nine test files: 131 of 204, with App.selection.test.tsx unused;
       - §7 as amended: B-P 127 of 1,736, B-T 184 of 2,124, B-E 0 of 590.
       - The report's 184-of-204 line puts App.lateResult.test.tsx's 53 among the nine. That file is SE-R1's own row (the architect's reading, from the report's own figures).
     - **At the phase's code commit 0b247f29.** The record commit b8127685 added three comment lines above each of SE-U1 to SE-R1 (`state/consults/2026-11-12-b1-shell-half-pr-b-session-end-phase-worker-report.md:21-26 @ 08ce9935 sha256:<H>`). So at 0b247f29 pick.test.ts was 18 of 20 and five files were over. The sixth overrun is those comment lines. This is derived from the report; `git diff --numstat c85788f1 0b247f29` confirms it before the commit.
     - **Forward.** At PR B's head, App.tsx counts against App 165 and workspaceState.ts against workspaceState 25 (Amendment 12 item 13). The phase leaves 123 and 7 for the colour-by work, whose §7 rows are 120 and 10. Past that is class 8 at the head. The other phase files are not on the colour-by list (§2.6).
   - (b) **Item 2 (a) of the human's message of 2026-11-12 (13:07Z), with item 4's pin.**
     - The ruling, by reference (paraphrased):
       - Item 2 (a): `state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md:22 @ 08ce9935 sha256:<H>`. OPEN-A's and OPEN-B's starting texts become the human's words by approval once the worker's re-check and the gate's clause check pass at PR B's head. An untrue clause goes back to the human.
       - Item 2 (b): `state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md:23 @ 08ce9935 sha256:<H>`. The On-main paragraph becomes the human's own words through the docs lane, and PR B's records commit then adds its Colour by sentence.
     - **The pin** (class 3, the tree authoritative):
       - Item 4 is `KNOWN-LIMITATIONS.md:72-81 @ 08ce9935 sha256:<H>`.
       - Its On-main paragraph, `KNOWN-LIMITATIONS.md:80 @ 08ce9935 sha256:<H>`, is item 2 (b)'s text, written by f56d6efe.
       - The R-4 comment, `KNOWN-LIMITATIONS.md:78 @ 08ce9935 sha256:<H>`, is Same as Amendment 12 item 1's.
       - Amendment 12 item 1's pins on lines 72-81 and 80 at b7b721eb are historical.
     - **Reading** (class 1, the architect's):
       - Four of OPEN-A's five sentences are the paragraph now on main.
       - Under item 2 (a), PR B's records commit adds the one that remains, OPEN-A's second sentence (`state/consults/2026-11-12-b1-shell-half-pr-b-re-sweep-amendment-architect-draft.md:262 @ 08ce9935 sha256:<H>`, a sub-line span carrying its line's hash), into that paragraph, as item 2 (b) places it.
       - PR B does not rewrite the paragraph. Its source comment gains the base's pins for that sentence only (Amendment 12 item 1).
     - **The item number in both texts.** That sentence, and OPEN-B's text (`state/consults/2026-11-12-b1-shell-half-pr-b-re-sweep-amendment-architect-draft.md:272 @ 08ce9935 sha256:<H>`), call KL-3 item 64. KL-3 is 65 (item 2).
       - Both references are re-read at the records commit under item 3 (b) of the human's third message of 2026-11-12 (`state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:15 @ 08ce9935 sha256:<H>`).
       - Item 59's text is re-read against the columns line under that message's item 4 (c) (`state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:21 @ 08ce9935 sha256:<H>`).
     - Red line: both texts stay the human's. Nothing here writes their words.
   - (c) **The rest of the series at M′.** The runs are at `state/consults/2026-11-13-b1-shell-half-pr-b-series-at-m-prime-tester-report.md:62-89 @ 08ce9935 sha256:<H>`, against M″'s series in `state/consults/2026-11-12-b1-shell-half-pr-b-base-series-tester-report.md`. Every run ended rc 0 in both series except these:
     - console ended rc 1 once (the nested regression's K7) and rc 0 when re-run alone. residency-harness ended rc 2 once (watchdog) and rc 0 when re-run (`state/consults/2026-11-13-b1-shell-half-pr-b-series-at-m-prime-tester-report.md:125-133 @ 08ce9935 sha256:<H>`).
       - Each failure was seen once in a shared run and did not reproduce, so it is not I3 under Amendment 12 item 11. Both runs of each are recorded for the gate.
     - source-changed-post: S5d INCONCLUSIVE (rc 3) at M″, PASS (rc 0) at M′ (`state/consults/2026-11-13-b1-shell-half-pr-b-series-at-m-prime-tester-report.md:146 @ 08ce9935 sha256:<H>`). Not I3, under item 11's inconclusive clause.
     - `e2e:recentre-crossing`: 6/6 on the measure build, first run at M′ (Amendment 12, continued, item 4).
     - pan-anchor: see Amendment 14 item 5.
     - These are the differences between the two series that Amendment 12, continued, item 6 asks to be recorded.
   - (d) **Amendment 13 item 1's three pins are settled.** Amendment 14 item 6 settles pick.ts's pin and the number 64. Item 4's pin is settled in (b) above.

4. **What the merge does not change.**
   - PR B's gates wait as Amendment 14 item 5 records them, in that item's list of what follows, bullets two to four.
   - 08ce9935 does not carry #317, so this merge is not the one those bullets name.
   - #317's head is now 3bb1d065, after the 08bed11c whose suite the run tagged fx12-pan-anchor used. If the suite file differs there, Amendment 14 item 5's last bullet applies as written.
   - No condition is added.

5. **Second-open's SKP-V0.md hunk.**
   - At 5e6b79bc it adds 8 lines above §0.2's three SKP-V0.md ranges and Amendment 12's pin 39 (`state/consults/2026-11-14-b1-shell-half-pr-b-re-read-before-amendment-14-worker-report.md:156-158 @ 08ce9935 sha256:<H>`).
   - Nothing is owed now:
     - the branch is unmerged;
     - `protocol/` is not on PR B's list (§2.6);
     - its form keeps the version (`governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md:22 @ 08ce9935 sha256:<H>`), so `types.ts`'s literal is untouched.
   - If it merges first, its move is class 3 (bytes unchanged, not I4). It is taken up at the next named merge of main into PR B's branch, in the amendment written there (OPEN-1, recommendation (a)).
   - Pin 39 is the wire that the `types.ts` member is written against (Amendment 12 item 5).

6. **Next.**
   - The colour-by phase's code, at 5b309b78, with Amendment 14 item 1's assertion in PB-E2 and its mutation M-PB-E2c (never committed; OPEN-3 (a)).
   - Row 5's prediction (Amendment 14 item 2) for the records commit.
   - The code is counted from 08ce9935 (item 1), against Amendment 12 item 13's and Amendment 14 item 1's ceilings, with the two remainders in item 3 (a).

**Superseded for PR B:**
- Amendment 14 item 6's list of what moves to Amendment 15 (item 3 (a) to (c)).
- Amendment 12 item 1's KNOWN-LIMITATIONS pins at b7b721eb read as current, and its reading that PR B rewrites the paragraph (item 3 (b)).
- The re-read before Amendment 14's ranges in App.tsx and pick.ts read as the branch's (item 2).
- The session-end phase report's group figure for the nine test files (item 3 (a)).

Read the last amendment first.

Nothing above is edited.
````

**OPEN items**

- **OPEN-1: a re-read at the next named merge of main.** This is the merge Amendment 14 item 5 already requires, of a main that carries #317. Not a red line.
  - (a) The same scripted re-read Amendment 14 item 4 made: `git diff --name-only 08ce9935 <that main>` against PR B's list and the pinned paths. It hashes Amendment 14 item 1's 19 interface pins and pin 39. It is recorded in the amendment written at that merge, before the gates.
  - (b) No re-read. Moves wait for the records commit's re-read.
  - **Recommendation: (a).** Four in-flight branches can merge before that merge. Second-open touches the SKP-V0 pins, pin 39 among them. The findings branch edits `PublishDialog.tsx`, the file of PB-E2 (ii)'s render pin (Amendment 14 item 1). A change there would change the seam PB-E2 is written against (round 4).

**Findings**

- **E1 (Evidence, for PR B's gates, not this amendment).** `C:/dev/spatial-ide/.git/refs/remotes/origin/cut/pan-anchor-setcam-waits-for-its-own-reset` is now 3bb1d065. The `pa` worktree's reflog names it "setCam's comment takes the gate reviewer's D1 words", a commit made after 08bed11c, whose `pan-anchor.mjs` (blob 7642086b) the run tagged fx12-pan-anchor used.
  - If `git diff 08bed11c 3bb1d065 -- frontends/shell/e2e/pan-anchor.mjs` is not empty, the fix's gate has changed the suite. Under ADV-2026-11-14-12 item 4 (d) (Amendment 14 item 5, last bullet), the advisor is then told now.
  - The 16/16 owed at PR B's head with the merged suite is the new reading.
- **D1 (Documentation; fixed in item 2).** The re-read's 23 Moved ranges were measured on main's tree. At the branch, three of them (App.tsx ×2, pick.ts) sit at other lines. Ten more of Amendment 12's App.tsx and pick.ts pins are moved by the phase, as the M′ re-read records them. Amendment 14 item 4's phrase "23 Moved ranges", read as the branch's, would mislead the colour-by worker.
- **D2 (Documentation; fixed in item 3 (a)).** The phase report's "184 against 204" folds SE-R1's own file into the nine-file group. The correct figures are 131 of 204 for the nine files and 53 of 40 for SE-R1's row. The class 8 set of six is unchanged. The sixth overrun, pick.test.ts, exists only because of b8127685's RECORDED MUTATION comment lines. At 0b247f29 the file was at 18 of 20.
- **D3 (Documentation; carried as item 3 (c)).** Amendment 14 item 6 moves the rest of the series at M′ here too, and the brief's item 3 does not name it. The M′ re-read labels the PB-E5 hook pin "item 5". It is in Amendment 12 item 6. The draft names it correctly, and the filed report is left as filed.
- **D4 (Documentation; for the custodian's script before the commit).** I could not run git, so these are not verified by me:
  - The custodian's fact 1 (57451bb3..08ce9935 under governance/state/site only). It is consistent with both commits' `docs:` subjects and with Amendment 14 item 4 on 60a60379.
  - Fact 2's count of 121. The 115/16/none result at 57451bb3 is the re-read's. The m4b reflog shows the branch made no commit after 6649a443 except this merge.
  - Fact 3.
  - The merge commit's parents and message. The reflog records 6649a443 → 5b309b78 as a merge of 08ce993532d4… ("Merge made by the 'ort' strategy"), not a rebase. The remote-tracking ref of PR B is 5b309b78, and origin/main is 08ce9935.
  - I found no fact false.
- **Forward risk (not a finding).** workspaceState.ts has 7 lines left against the colour-by phase's §7 row of 10. A colour-by edit over 7 lines is class 8 at the head.
- **Note.** The KL-3 number in the human's approved texts (64 → 65) is a reference re-read, which the third message's item 3 (b) allows. It is not a rewording. It still passes 2 (a)'s clause check at PR B's head.
- No ADR is missing.

Files I read that matter:
- `C:/dev/spatial-ide/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/consults/2026-11-14-b1-shell-half-pr-b-re-read-before-amendment-14-worker-report.md`
- `C:/dev/spatial-ide/state/consults/2026-11-13-b1-shell-half-pr-b-re-read-at-m-prime-worker-report.md`
- `C:/dev/spatial-ide/state/consults/2026-11-12-b1-shell-half-pr-b-session-end-phase-worker-report.md`
- `C:/dev/spatial-ide/state/consults/2026-10-25-b1-shell-half-pr-b-session-end-class-9-ahead-architect-draft.md`
- `C:/dev/spatial-ide/state/consults/2026-11-13-b1-shell-half-pr-b-series-at-m-prime-tester-report.md`
- `C:/dev/spatial-ide/.git/worktrees/m4b/logs/HEAD`
- `C:/dev/spatial-ide/.git/worktrees/pa/logs/HEAD`
