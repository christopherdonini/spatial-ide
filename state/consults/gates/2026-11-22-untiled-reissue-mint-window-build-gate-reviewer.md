Reviewed: PR 358, the branch cut/untiled-reissue-mint-window at 17845a0cac37d5f6e4745e108a67197621308f8b, in an export of that commit and in C:/dev/wt/mint (the custodian's filing note, 2026-11-22: the reviewer's build gate, node:untiled-reissue-holds-earlier-look-handle-until-mint@gate-reviewer-1, dispatched at 2026-11-22T17:39:55.066Z; its run: Read 7, Bash 59, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T17:40:00Z to 2026-11-22T17:55:50Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 16661 bytes, sha256 0ba4233f8cc4ef6a9e5b5f4f1103d198928efed2e91847ac6b0501b675153d2a, byte for byte except that 0 scratch-folder paths are written as <S>, and with one final newline added. PASS WITH NOTES. It ended before the corrections b119889b and 55a6be79, so it reads them narrowly as a note (ADV-2026-11-22-29 item 6), resumed at 2026-11-22T18:03:47.348Z)

---

Verdict: PASS WITH NOTES (cut/untiled-reissue-mint-window @ 17845a0cac37d5f6e4745e108a67197621308f8b)
Reviewed: 17845a0cac37d5f6e4745e108a67197621308f8b

Nothing blocks. The code does what §2.3 and Amendment 1 item 2 say, and I re-ran every prediction and mutation myself with the results the form names. There are three Documentation findings to fix before the merge: two comment sentences, where I give replacement words, and one clause of item 68's comment, reported without new words as the brief requires. There is also one item for the closing amendment.

All result files are in `<S>`. All code cites are at 17845a0c unless marked otherwise. That commit is on an unmerged branch, so each cite carries it.

**Check 1: the diff against §2.3 and Amendment 1 item 2**
- **Files.** `git diff --name-status origin/main...17845a0c` (in `<S>/mintr-export-grep.txt`) shows three files: `KNOWN-LIMITATIONS.md` modified, `frontends/shell/src/residency/candidateArmSession.mintWindow.test.ts` added, and `frontends/shell/src/residency/candidateArmSession.ts` modified. No existing test file changed.
- **§7 recount** (`<S>/mintr-numstat.txt`). `git merge-base origin/main 17845a0c` gives 8922b843529519ae1f7a028669a1b8356a7d74f9 (R4's B). The numstat is 2/3, 492/0 and 41/20, which sums to 558. That is within the piece's 800 (Amendment 1 item 4), and also within §7's own 560.
  - The addition's 240 has no numstat command of its own, because item 4 counts it inside the 800. The worker's figure of 170 for the addition is a split made by reading, not a count by the form's command.
- **No exported symbol is added.** A grep of the diff's added lines for `export` returned rc 1 (no match).
- **Each changed line against §2.3:**
  - Item 1 is `untiledLookGeneration`, closure-local, starting at 0, with a doc comment, at `:486-490`.
  - Item 2 is `:1750`, straight after the session-ended check at `:1749` and before `currentFilter` at `:1751`.
  - Item 3 is the first-line capture at `:1299` and the check at `:1331-1334`. The check comes after the latch at `:1325-1328` and before the assignment at `:1335`.
  - Item 4 is `onBatch` at `:1345` and `wasCurrent` at `:1373`.
  - Item 5 is unchanged: the handle clear at `:1374`, the routing at `:1391-1394`, `establishFrameFromExtent`'s body at `:1240-1266` and the superseded log line at `:1415-1420`.
  - Item 7 is `:1451`: the generation first, then today's expression unedited.
  - Cases (i) to (iii) read true against these lines. (i): `:1451` with `:1779` and `:1345`. (ii): `:1331-1334` runs before `:1341` and `:1536`, so there is no sink. (iii): FE3 at the current generation.

**Check 2: the tests at B** (`<S>/mintr-base-red.txt`)
- B's `candidateArmSession.ts` was put into the export and `cmp`'d against `git show 8922b843:` (rc 0). The run gave `Tests  12 failed | 1 passed (13)`, rc 1.
- Each test failed at its named assertion (`mintWindow.test.ts @ 17845a0c`):

| Test | Line | Failure |
|---|---|---|
| MW1 | :240:53 | `no plan reached the canvas` |
| MW2 | :262:58 | `one plan at the new look's terminal` |
| MW3 | :284:82 | `expected 'Showing all 7 features in view' not to be 'Showing all 7 features in view'` |
| MW4 | :299:98 | |
| MW5 | :311:92 | received `"kind": "candidate-first-look-failed"`, `"frame": true` |
| MW6 (a) and (b) | :342:58 | received `"kind": "issued"`, `"streamHandle": "sh_2"` |
| MW7 | :382:49 | `expected { kind: 'applied', …(1) } to deeply equal { kind: 'not-applied' }` |
| FE1 (a) | :401:76 | received a frame |
| FE1 (b) | :429:94 | received `{ xmin: 40, ymin: 40, …(2) }`, which is E3 |
| FE2 | :454:53 | |
| FE3 (b) | :489:68 | |

- FE3 passed.
- **MW3 shows the probe's line C effect.** The probe's line C at its filed gate report, check 7, reads `Status `candidate-within-budget`, complete, "Showing all 7 features in view"`. MW3 receives that same complete sentence at the new look's terminal.
- **Restore.** The head's file came back from `git archive 17845a0c`. `cmp` against `git show 17845a0c:` gave rc 0, and so did `cmp` against the archive.
- **Head run.** `Tests  13 passed (13)`, rc 0 (`<S>/mintr-head-green.txt`).

**Check 3: the mutations made again**
- Each mutation was one anchored `node -e`, whose code is in `<S>/mintr-nodecode.txt`. It exits 3 unless each anchor occurs exactly once. I tested it on a copy first: an absent anchor gave rc 3.
- The runner is `<S>/mintr-runmut.sh`, and each mutation's log is `<S>/mintr-mut-<id>.txt`. Every log shows apply rc 0, the restore from the archive rc 0, and `cmp` against `git show 17845a0c:` rc 0.

| Mutation | Failed (byte-copied names, lines) | Named set |
|---|---|---|
| M-1: `:1373` reads the handle only | MW1 :240:53, MW2 :262:58, MW3 :284:82, MW5 :311:92 (4 failed) | as named |
| M-2: `:1345` reads the handle only | MW4 :299:98 (1 failed) | as named; FE3 (b) green |
| M-3: `:1331-1334` removed | MW6 (a) and (b) :342:58, MW7 :382:49, FE2 :454:53 | MW6 and MW7, plus FE2 |
| M-4: capture moved below the `viewportQuery` await | the same four, at the same lines | MW6 and MW7, plus FE2 |
| M-5: the conjunct dropped from `:1451` | FE1 (a) :401:76, FE1 (b) :429:94 | as named; FE3 (b) green |
| M-6: the check moved below `startStream(...)` | MW6 (a) and (b) :344:74 `no stream started for the superseded look`, FE2 :456:114 `no stream started for sh_a` | as named; MW7 green |
| M-7: `!wasSelfCancelled` | FE3 :472:63 `a frame exists: expected null not to be null` | as named |
| M-FE3b: M-2 and M-5 together | FE3 (b) :489:68 `no frame is established`, plus MW4, FE1 (a) and FE1 (b) at M-2's and M-5's lines | as named |

- My results equal the worker's table row for row.
- **FE2 under M-3 and M-4 is an expected result, not a finding against the named sets.** §4 reads `- M-3: the mint-time generation check removed. MW6 and MW7 fail.` R12's new text reads ``- M-4: `lookGeneration` captured after the `viewportQuery` await instead of first. MW6 and MW7 fail.``
  - FE2 was added later, by Amendment 1 item 2.3, and its first assertion is the `superseded` outcome. Only `:1331-1334` produces that outcome, and M-4 makes the condition false there, so FE2 fails under both by construction.
  - P2 ("each mutation fails the tests it names") holds, and I3 is untouched.
  - The closing amendment must record, by reference, that M-3 and M-4 also failed FE2 at `candidateArmSession.mintWindow.test.ts:454:53 @ 17845a0c`, beside the named sets and with §4 unedited.

**Check 4: the suites**
- **`npm run verify`** ran in a shared hold in the export's `frontends/shell` and exited rc 0 (`<S>/mintr-verify.txt`). Its lines are `Test Files  124 passed (124)` and `Tests  1583 passed (1583)`, and the node suites show 5/5 and 7/7 with fail 0.
  - Before it: `npm ci` in the shell and then in the viewer, each rc 0, and `npm run typecheck` rc 0 (`<S>/mintr-npmci-shell.txt`, `<S>/mintr-npmci-viewer.txt`, `<S>/mintr-typecheck.txt`). Each ran in its own shared hold.
- **`node --test "scripts/plan/*.test.mjs"`** in the export, with a timeout of 500 s, gave tests 347, pass 323, fail 24, rc 1 (`<S>/mintr-plan-tests.txt`).
  - All 24 failures are the export having no `.git`: `fatal: not a git repository` appears 73 times, and each failing case traces to it.
  - This is not a signal about the piece, but it is not a CI-equivalent pass either. See Note 3.

**Check 5: item 68, clause by clause**
- **Byte check, by script.** Form line 592 at 0f207842, with its two-space indent stripped, against `KNOWN-LIMITATIONS.md:529 @ 17845a0c`:
  - `cmp` gave rc 0, and both sha256 values are 41793e85a834c312e0b76e457e8d4c7cf65bffedc133c4c46ebb5a193f7f3d1f.
  - `grep -c -x -F` found it once in the file.
- **W8's placement, by script** (`<S>/mintr-w8.txt`, rc 0). The comment's "True by reading, and not an AUTONOMY §31 (c) case" sentence occurs once and stands before "Not covered (AUTONOMY §31 (c))". No `markTilePartial` appears between that heading and "Not changed:".
- **The clauses I read true against the head:**
  - **The four triggers.** `App.tsx:1801` binds `issueQueryRef`. Apply and Clear reach it through `:1119-1126`, `changeClauses` through `applyFilterWith` (`:2167`), and the Colour-by effect at `:2145`.
  - **"not drawn":** `candidateArmSession.ts:1765` and `:1345`.
  - **"asks for no tiles":** `:1517-1532`, gated on `wasCurrent` at `:1373`.
  - **"does not set the grid":** `:1451`, with `:1779` and `:1156` (`latestUnionedExtent = outcome.fitAnchor`).
  - **"filled as after any other filter change":** MW2, FE1 (a) and FE2 are green at the head.
- **The worker's doubt ("does not change the status line").** I followed the path.
  - An earlier look's terminal whose detail is source-changed or coverage-lost reaches `candidateArmSession.ts:1391-1394`, which is not gated on `wasCurrent`.
  - That calls `manager.notifySessionEnded` (`tileViewportStreamManager.ts:775-777`), then `endSession` (`:748-760`, latch, `clearAll`, `onSessionEnded`).
  - Then `endCandidateSession` (`candidateArmSession.ts:1116-1130`): the latch, `cancelUntiledStream()`, `canvas.clearAllTiles()`, a session-log line and `deps.onSessionEnded`.
  - Then App's `endSession` (`App.tsx:1488-1499`) and `handleSessionEnded` (`:715-721`), which set `sessionEnded` and the hover and dispatch `resource.generationEnded`.
  - No `setResidencyStatus` is on that path.
  - What it does change on screen:
    - the `attention.sessionEnded` refusal block appears (`App.tsx:2469-2473`);
    - `status.sourceWatch` hides (`watcherStatusText` returns null when `sessionEnded`, `layout/statusItems.ts:27-28`);
    - `attention.viewportRefusal` is suppressed (`App.tsx:2518`);
    - the map is cleared.
  - `KNOWN-LIMITATIONS.md` uses "the status line" for the residency sentence (items 64 and 68) and "the status bar" for the bar's items. A8's clause check ties the clause to S1's block, the re-emit and `failedCoveringTerminals.set`, which is `status.residency`, rendered by `residencyStatusText` (`App.tsx:2536-2544`).
  - **My reading: the clause "does not change the status line" is true of the built code as item 68 and the form use the words.** Nothing goes to the advisor as an untrue clause.
  - For the advisor's information: a reader who takes "status line" to mean "status bar" would see the source-watch item disappear and the ended block appear. That is the session's end, which happens whichever look reports the change. The comment's "Not changed" sentence records it.
- **One clause of item 68's comment omits a qualifier, given unreworded** (finding D-3 below).

**Check 6: the worker's comments in `candidateArmSession.ts`**
- These read true against the code:
  - the module-doc bullet at `:83-84`;
  - the `untiledLookGeneration` doc at `:486-489`;
  - `:1299`;
  - `:1329-1330` (baseline's order, latch then generation: `viewportStreamManager.ts:204-212`);
  - `:1344`;
  - `:1371-1372`;
  - the frame-gate comment at `:1444-1450`;
  - the S1 replacement at `:1490-1495` (the Cancel case: `:1289-1295` and `relinquishFill`);
  - `:1515-1516`.
- Two sentences are not true as written. These are findings D-1 and D-2 below.

**Check 7: the commits** (`<S>/mintr-log.txt`, `<S>/mintr-msgs.txt`, `<S>/mintr-gh.txt`)
- **Sign-off and email.** All three commits (e888831f, a5ec3845, 17845a0c) carry `Signed-off-by:`. The only addresses in the messages are the sign-off's (3) and `noreply@anthropic.com` (3), and the diff's added lines hold no address (count 0).
- **`Claude-Session:`** only the words commit's message has the line, and its trailers end with the sign-off that `-s` added. This does not matter: it is a URL, no rule asks for it on every commit, and the tests' commit lacks it too.
- **PR state.** `gh pr view 358` gives `{"headRefOid":"17845a0cac37d5f6e4745e108a67197621308f8b","isDraft":true}`.
- **`gh pr checks 358`:** all 6 checks pass, rc 0: sign-off, profile path, ported-notices ×2, tauri build, and typecheck · build · vitest · cargo test.
- **Read time:** 2026-11-22T17:51:01Z (`date -u`).

**Findings**
- **D-1, Documentation, must fix before the merge; the worker's comment, not the human's wording.**
  - Where: `candidateArmSession.ts:249-250 @ 17845a0c`.
  - What is wrong: the comment says a superseded call resolves `superseded`. But the latches come first (`:1312-1328` before `:1331`). If `stop()` or the session's end lands inside the mint window, the call resolves `stopped` or `session-ended`. That case needs timing inside one round trip, so under §31 it is named here rather than blocking.
  - Old (occurs once): ``returned: that ticket is cancelled through `cancel`, and no stream is started for it.``
  - New: ``returned, and neither `stop()` nor the session's end came first (the latches are read before the generation, and the call then resolves `stopped` or `session-ended`): that ticket is cancelled through `cancel` either way, and no stream is started for it.``
  - Clause check:
    - "latches read before the generation": `:1312-1328` come before `:1331`;
    - "resolves `stopped` or `session-ended`": `:1314`, `:1319`, `:1327`;
    - "cancelled through `cancel` either way": `skpCancel` at `:1313`, `:1318`, `:1326` and `:1332`, imported as the client's `cancel`;
    - "no stream started": `startStream` is only at `:1536`, after `:1335`.
- **D-2, Documentation, must fix before the merge; the worker's comment.**
  - Where: `candidateArmSession.ts:483-484 @ 17845a0c`.
  - What is wrong: "it still names the earlier look" is false in ordinary use. After an Apply made once the first look has ended, the handle is null. Inside the window, the earlier look's terminal (`:1374`) or a cancel by the session (`:1293`) clears it.
  - Old (occurs once): `reissue and that mint it still names the earlier look.`
  - New: `reissue and that mint it still holds what it held: the earlier look's handle, until that look's terminal or the session's own cancel of it clears it.`
  - Clause check:
    - there is no write in `reissueUnrestricted` (`:1738-1808`);
    - the assignment is only at `:1335`;
    - it is cleared at `:1374` and `:1293` (`cancelUntiledStream`, reached from `relinquishFill`, `stop()` and `endCandidateSession`).
- **D-3, Documentation, must fix before the merge; item 68's comment (the worker's), given unreworded as the brief requires.**
  - The clause: "A ticket minted after a later reissue began is cancelled (skpCancel) and its stream is never started, and that call of reissueUnrestricted resolves superseded." (`KNOWN-LIMITATIONS.md:530 @ 17845a0c`).
  - The code: `candidateArmSession.ts:1312-1328 @ 17845a0c` cancels the ticket and returns `stopped` or `session-ended` when `stop()` or the session's end came first. It returns `superseded` only at `:1331-1334`.
  - That needs timing inside one round trip (a §31 (c) case). It does not block, but it belongs in the comment's not-covered list or in the clause.
- **Closing amendment (record):** it records M-3's and M-4's observed FE2 failure by reference, as check 3 says, and edits nothing in §4.

**Notes**
1. **A test comment is incomplete but not untrue.** `mintWindow.test.ts:438 @ 17845a0c` reads `// M-6 fails it.`, but M-3 and M-4 also fail FE2.
2. **ADV-2026-11-22-27 is not on main yet.** The words commit's message and item 68's comment cite it, so it should land on main before the merge.
3. **The `scripts/plan` suite cannot run as CI does in an export with no `.git`.**
   - `governance-ci.yml:82-104 @ 17845a0c` filters by path, and PR 358 touches none of those paths. So no governance job ran on the PR either.
   - The worker's reports say verify-cites and verify-quotes passed in the worktree. I did not re-run them.
4. **A superseded open's first look clears a later refusal, as today.** It resolves `superseded`, and `reportViewportOutcome` (`App.tsx:1597-1613`) treats every resolved outcome alike, so it clears `viewportRefusal`. At the base a late `issued` did the same, so this is no regression. It needs timing inside one round trip.
5. **Machine.**
   - Four shared holds (shell `npm ci`, viewer `npm ci`, typecheck, verify), each granted on cores 0-7 with `also=<m>`.
   - No `others=`, MACHINE_WAITING or MACHINE_ERROR lines, no exit code from 96 to 99, and every release ran.
   - The mutation and single-file runs (about 5 s each) were not heavy and ran outside a hold.
   - No process I started is still running.
6. **Cleanup.**
   - `<S>/mint-rev` was removed: `rm` rc 0, and `test -e` reports it absent (`<S>/mintr-cleanup.txt`).
   - `C:/dev/wt/mint` porcelain is empty, and its HEAD is 17845a0cac37d5f6e4745e108a67197621308f8b.
   - Nothing was written outside `<S>/mintr-*` and `<S>/mint-rev`.

Model: claude-opus-5-5 (Opus 5.5).
