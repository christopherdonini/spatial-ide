# Milestone 5's second part, PR B: the reviewer's build gate, the read part, at 42859420 (node:shell-migration-milestone-5@pr-b-build-gate-reviewer-read-part); no verdict

*Filed by the custodian. The reviewer (Opus) read the form on main at f0098033e0cf57db5fcf3f7ee9f446fa9f6b9517 in D:/wt/read-1128b and the branch at 42859420101bd5d17db7c16eff444a080ec5dd9a in D:/wt/m5b. The read part gives no verdict (ADV-2026-11-27-42 item 6); the run part gives it, after the port. By the facts script its records run from 2026-11-28T03:04:14Z to 2026-11-28T03:36:04Z, and 75 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 1909353 ms and 86 tool uses. Its hand-back is below as received, with the harness indent removed: 21253 bytes, sha256 6ffbd241687cb62f75f8f7a1abfce3b2fe6cb4e3530a12100fdc5bdffcf602f4.*

---

READ PART: cut/shell-migration-milestone-5-pr-b @ 42859420101bd5d17db7c16eff444a080ec5dd9a. Records were read on main @ f0098033e0cf57db5fcf3f7ee9f446fa9f6b9517 in D:/wt/read-1128b. The base is d6c2daf69eb500027197945f5a4302f0508e0f69. This part gives no verdict.

State at start and end: D:/wt/m5b HEAD 42859420…, `git status --porcelain` empty. After every mutation's revert it was empty again. Disk before the heavy runs: C: 41670 to 41603 MB, D: 22516 to 22129 MB, all above the floors. Logs I wrote: D:/wt/m5b-logs/rr-*.log, rr-diff-head.txt, rr-app-diff.txt, rr-move-old.txt, rr-move-new.txt and rr-jobs-proposed.mjs (a copy for a syntax check, outside the repo).

## 1. The diff, d6c2daf6...42859420
Command: `git diff --name-status` and `--numstat` over that range. It lists 19 paths: 5 added, 14 modified.
- **Product (§2.4, §2.6):** jobs.ts and JobsTab.tsx are new. App.tsx has the mirror lines beside the set and the delete, `handleCancelScan`, the slot and the imports. contributions.ts adds S-2 through `JOBS_LABEL`. surfaceRegistry.ts has S-12's widened list. styles.css has the Jobs rules. package.json adds the one `e2e:jobs` script line.
- **Tests (§2.6):** jobs.test.ts, JobsTab.test.tsx and App.jobs.test.tsx.
- **Amendment 15 item 5:** StudioLayout.test.tsx (the `NO_SLOTS` line, the tab-list line, M15-1's two record lines) and App.table.test.tsx (one line). No other line changes in either.
- **Amendment 16 item 3 / Amendment 17 D-3:** conditions.ts (`ordered` and D-7's doc line), conditions.test.ts (C-U2b) and App.conditions.test.tsx (C-A8).
- **E2E:** jobs.mjs.
- **Records:** KNOWN-LIMITATIONS.md (items 81 to 83), MANUAL-WALKTHROUGH.md (AF header, fixture line, AF4, AF5, AF6, log lines) and e2e/README.md (Jobs spec).
- **The handler move is byte for byte.** I stripped indentation and compared the removed inline block with `handleCancelScan`'s body (awk, then diff): the 68 body lines are identical. Only the closing `}}`/`};` differs.
- **Changes the amendments do not describe:** `jobsFrom`'s third parameter, and `requestExportCancel`/`ExportCancelState` as the shape of the latch. Both are already named for the closing amendment (Amendment 19 item 4, Amendment 20 item 3).
- **No src-tauri, capabilities or command:** `grep -c 'src-tauri/\|capabilities/'` over the name list gives 0, and `invoke(`/`tauri::command`/`@tauri-apps` in added lines gives 0. So PR B's Scope holds no file under `src-tauri/` or `capabilities/` and adds no command.

## 2. §7 by its command
Command: `git diff --numstat d6c2daf6...42859420 -- frontends/shell` with the two excludes. Result: 16 files, 1,032 added and 76 deleted, so **1,108** lines.

| Group | File | Lines | Ceiling |
|---|---|---|---|
| B-P | jobs.ts | 68 | 120 |
| B-P | JobsTab.tsx | 47 | 170 |
| B-P | **App.tsx** | **155** | **150, over: class 8** |
| B-P | contributions.ts | 2 | 5 |
| B-P | surfaceRegistry.ts | 2 | 6 |
| B-P | styles.css | 23 | 40 |
| B-P | package.json | 1 | 1 |
| B-T | jobs.test.ts | 95 | 260 |
| B-T | JobsTab.test.tsx | 126 | 230 |
| B-T | App.jobs.test.tsx | 329 | 400 |
| B-E | jobs.mjs | 192 | 480 |

- **Amendment 15 item 5:** StudioLayout.test.tsx 5 and App.table.test.tsx 2, so 7 against 0, class 8.
- **Amendment 16 item 3:** conditions.ts 15, conditions.test.ts 23 and App.conditions.test.tsx 23, so **61**. This is not class 8 (Amendment 17 D-2).
- **Whole:** 1,108 against at most 1,950 (1,942 predicted).
- **Why this differs from the architect's 1,107 and 59 at e958b913:** D-7 makes conditions.ts +1/−1, and E-2.2 makes jobs.mjs −1.
- **Paths outside the count:** KNOWN-LIMITATIONS.md 11 of 50; MANUAL-WALKTHROUGH.md 12 (8+4) of 120; e2e/README.md 12 of 40.
- **Lock diff:** `git diff d6c2daf6...42859420 -- frontends/shell/package-lock.json | wc -c` prints 0.

## 3. The mutations, observed at 42859420
- **How applied:** one `node -e` command per mutation. It counts the OLD text, stops with exit 3 unless the count is 1, then replaces that one occurrence. Every run printed "applied once".
- **How run:** `npx vitest run <set>` with output to a new log.
- **How reverted:** `git -C D:/wt/m5b checkout -- <file>`, then `status --porcelain`, which was empty each time.
- **Result:** every failure was at a test's own assertion. None was a compile or import error.

- **M15-1** (Jobs before Problems in `ACTIVITY_TABS`), rr-mut-M15-1.log.
  - Failed: C-R3 (StudioLayout.test) and App.table "the Table tab is third in Activity…". Both are `expected [ 'Console', 'Notices', …(3) ] to deeply equal …`. 2 failed, 14 passed.
  - The record matches Amendment 15 item 5.
- **C-U2b, first mutation** (urgency 3 by `seq` alone), rr-mut-CU2b-1.log, set conditions.test.ts plus App.conditions.test.tsx.
  - Failed: C-U2b (deep equal) and C-A8 ("the save's first line is the top: expected 'The saved view was not applied: it wa…' to be 'The project was saved.'"). 2 failed, 28 passed.
  - The record matches Amendment 17 D-3 {C-U2b, C-A8}.
- **C-U2b, second mutation** (`b.seq - a.seq`), rr-mut-CU2b-2.log.
  - Failed: C-U2, C-U2b, C-U3 and C-U7. 4 failed, 13 passed.
  - The record matches its own text. It goes beyond D-3's {C-U2, C-U2b}; that is already named for D-1.
- **C-A8's mutation** (the same as C-U2b's first), App.conditions.test.tsx alone, rr-mut-CA8.log.
  - Failed: C-A8 only, with the same message. The record matches.
- **J-U1** (`|| scanState.kind === "complete"`), rr-mut-JU1.log.
  - Failed: both J-U1 cases. The first fails at jobs.test.ts:39 ("complete: expected [ { kind: 'scan' } ] to deeply equal []"), the second at :49.
  - **Unobserved:** the first case's later expectations (one job per run, in order).
  - The record matches §4 {J-U1}.
- **J-U2** (un-latch line replaced by `void reached;`), rr-mut-JU2.log.
  - Failed: "a false answer clears the latch…" at jobs.test.ts:80 ("expected 'cancelling' to be 'not-cancelled'").
  - **Unobserved:** the rejection expectation in the same case.
  - J-E2 was not run. The record matches §4 {J-U2, J-E2} for its unit part.
- **J-R1** (drop `disabled={cancelling}`), rr-mut-JR1.log.
  - Failed: "an export row shows S-9; Cancel asks once and is disabled…" at JobsTab.test.tsx:82 ("Cancel is disabled while Cancelling: expected false to be true").
  - The record matches §4.
- **J-A1** (`onCancelScan={() => applyScanEvent({ kind: "reset" })}`), rr-mut-JA1.log.
  - Failed: J-A1 at App.jobs.test.tsx:262, the final equality ("expected undefined to be 'Filling stopped — showing 3 features …'").
  - E-1's new twin assertion (line 245) passed under the mutation, as it should.
  - J-E1 was not run. The record matches Amendment 2's J-A1 row.
- **J-A2** (drop `setExportJobs(... filter ...)`), rr-mut-JA2.log.
  - Failed: both J-A2 cases, at :310 ("ended removes the row … got 1") and :324.
  - **Unobserved:** "releases the consumer" (:311).
  - The record matches §4 {J-A2}.

**J-E1 and J-E2, by reading jobs.mjs at the head (not run):**
- After E-2, each post-click wait ends in `.catch(() => read(page))` and a `record(...)`.
- **J-E2's mutation** (the row is not removed): the "gone" check FAILs, and J-E2 is the last step, so the exit is 1.
- **J-U2's mutation, on J-E2:** the "answered" check FAILs, so the exit is 1.
- **J-E1's mutation** (Cancel not wired):
  - J-E1's row-gone check, or if the scan ends naturally its status check, FAILs.
  - But `main()` exits 2 whenever any `Void` is thrown later, even after a FAIL was recorded.
  - J-E2 runs after J-E1 in the same process and has VOID preconditions of its own (lines 141 and 144: the prepare too quick, or the row gone before the click).
  - So J-E1's mutation exits 1 only when J-E2's preconditions hold in that run. Otherwise it exits 2, with the FAIL lines printed before the VOID line. See finding E-1.

## 4. The suites at the head
- **`npm run verify`** in frontends/shell, inside a shared hold: exit 0. Vitest: 135 files and 1,684 tests passed. Node stages: 76/0, 30/0, then node --test 5/0 and 7/0. tsc covers `src` (tsconfig `"include": ["src"]`). Log: rr-verify.log.
- **PR B's seven test files at the head** (rr-prb-files-head.log): rc 0, 7 files and 59 tests passed.
- **verify-cites** (tool @ e0c84fe2): rc 0, "PASS … 3749 file(s) … (237 loose reference(s) advised)".
- **verify-quotes** (tool @ e46167d5): rc 0 on the rerun (rr-verify-quotes-2.log). "PASS — 159 checked, 128 verified, 30 baselined, 1 advisory … 944 ruling cites resolved".
- **verify-plan** (verify.mjs @ 494cea7b): rc 0, "PASS".
- **verify-test-claims** (tool @ 494cea7b): rc 0, "PASS — all 901 claimed test(s) across 293 file(s)…".
- **verify-mutation** (tool @ 7d24ed15) with `--base d6c2daf6… --head HEAD`: **rc 1**. 15 new tests: 7 ok and 8 MISS. The MISSes:
  - J-A2's second case;
  - J-R1's four other cases;
  - J-U1's second case;
  - J-U2's first and third cases.
  - Each is a further case of a §4 row whose one mutation is recorded beside another case. This is the tool's own disclosed checklist reading, and it is not an observation (§4).
- **CI's `node --test` scripts suite**, inside a shared hold: rc 0, 623 tests, 623 pass, 0 fail.
- **Branch CI** (`gh run list --branch cut/shell-migration-milestone-5-pr-b`): at 42859420, "Product CI — shell" passed (run 46099445740; jobs typecheck·build·vitest·cargo test and tauri build both passed), and "Ported notices" passed (46099445737). Governance CI does not run on this branch's push.

## 5. §4's text checks
Command: `grep -rn -F` for each pattern, each first self-tested positive on a probe line (count 1, rc 0).
- `%`, `ETA` and `remaining` in src/jobs/: one hit each, all `src/jobs/JobsTab.test.tsx:122` `expect(text).not.toMatch(/%|ETA|remaining/);`. That is the assertion regex that tests their absence. No product file in src/jobs/ holds any of them.
- `.text ===` and `.text !==` in src/conditions/: rc 1, no hit.

## 6. The clause checks
Each was checked by a node script reading the ruling files at f0098033 and `git cat-file` at the head.
- **S-2, S-7, S-8, S-9 and S-11** (ADV-2026-11-23-30 item 1):
  - jobs.ts holds each once as `export const NAME = "<ruling text>";`.
  - AF6 holds each once in backticks.
  - AF4 holds S-7 and S-8; AF5 holds S-9 and S-11.
  - contributions.ts imports S-2 from jobs.ts.
- **Item 81 = KL-B:** the bold first sentence plus the second line, rejoined, equals KL-B byte for byte. It stands once.
- **Item 82 = KL-C:** `82. **<KL-C>**` stands once.
- **Item 83:** the fence of ADV-2026-11-28-03 item 2 with `NN.`→`83.` is 854 bytes and stands once. sha256 c962879c157982ee5bbc8520f304adfe914337cc40b19ff10ad1aeed6c33283a, the same as the worker's.
- Each item starts with its number once.

**Each clause against the code:**
- **Item 81:** met.
  - `jobsFrom` lists the scan only while `isScanInFlight`, plus the runs in `exportJobs`, and nothing else.
  - On the candidate arm `syncScanLiveness` issues the scan state for the untiled look and for tiles.
- **Item 82:** met.
  - `ExportRow` holds its own `useState` latch through `requestExportCancel`.
  - PublishPanel's `cancelRequested` (lines 725/727) and PublishDialog's own `cancelRequested` ("Cancel publish", lines 325/327) are touched only by their own handlers.
  - `answerOpenAsk` calls `run.cancel()` directly.
- **Item 83:**
  - Met: `ordered` puts urgency 1, then urgency 2 oldest first, then urgency 3 by the route's newest `seq`, each route in `seq` order. `CONDITION_ROUTES` urgency 3 is the three routes. `replaceBatch` ends the old lines and then mints new `seq` values (conditions.ts:187-203), so the last-raised kind leads and a save with as many lines leaves the top and `others` unchanged. `attentionOf` gives the count; ProblemsTab calls `ordered`.
  - No clause is found unmet. For the advisor's sight only, with no words proposed (alongside the architect's cap note): "the strip's button says how many there are" counts the kept others (`attention.others`, App.tsx:2346), not the not-kept ones. This differs only past the cap.

## 7. ADV-2026-11-27-42 item 1: S-10 and items 77 to 79 at the base
Read with `git cat-file … d6c2daf6:KNOWN-LIMITATIONS.md`, lines 560-569.
- 77 and 78 do not involve order.
- 79 concerns the cap, an ended session first, and refusals of urgency 2, whose order is unchanged.
- S-10 holds: App passes the one `visibleConditions` list to `attentionOf` and to `<ProblemsTab>`, and both sort through `ordered`.
- All of them remain true under the new order. Nothing goes to the advisor.

## 8. The narrow read of 5dbb45f7 and 42859420
Each old/new pair was taken from the architect's report on main by script.
- **All 15 pairs** (E-1; E-2.1 to E-2.3; line 88; README; D-2; D-3; D-4; D-5a; D-5b; D-6a to D-6c; D-7):
  - each new stands once at the head;
  - each old count is 0 at the head, except D-5b, whose old (86 bytes) is a prefix of its new and stands once inside it;
  - at e958b913 each old stood once and each new 0 times.
- **5dbb45f7 changes nothing else.** Applying the 15 replacements to the e958b913 files in memory gives a byte-identical copy of all 8 files at 5dbb45f7, and `git diff --name-only e958b913 5dbb45f7` lists just those 8.
- **42859420** changes one line: the J-A1 OBSERVED line's commit id, 12f326aa…→5dbb45f7…, with the failure text unchanged.
- **J-A1's new assertion** is `/^Filling stopped — showing \d+ features already loaded; the rest of this view was not loaded\.$/`.
  - Its em dash bytes, `e2 80 94`, match `relinquishedText` at residencyStatus.ts:463.
  - The regex matches the owner's template with n=3 and n=0.
  - It does not match `relinquishedUntiledStillRunningText` ("Tile filling stopped …").
  - The same literal stands once in jobs.mjs.

## 9. §8, item by item
1. True. Nothing outside §2.6 and Amendments 15 and 16 (check 1); nothing under protocol/, kernel/, engine/, src-tauri/, residency/, streaming/ or skp/ (name list).
2. True. One script line in package.json; the lock diff is 0 bytes.
3. True. `ordered` reads `urgency`, `reason.route` and `seq` (conditions.ts:220-227); the text check is empty.
4. True. `raise` and `replaceBatch` are not in the conditions.ts diff.
5. True. C-A8 asserts `.reopen-notice` appears once. Jobs shows no owner element; the scan liveness is the owner's text in a new span, as §2.4 lays it out.
6. True. The only buttons are the two Cancels (JobsTab.tsx).
7. True. The scan row gets `onCancelScan={handleCancelScan}` (App.tsx:2690) and FilterPanel gets `onCancel={handleCancelScan}`. The export row calls `job.cancel`, which is `report.cancel` (App.tsx:1306).
8. True. No figure; S-11 is a negative; a true answer stays at Cancelling.
9. True. Every export of jobs.ts and JobsTab.tsx has a product caller in App.tsx, contributions.ts or JobsTab.tsx (grep, tests excluded). `isScanInFlight` and `scanLivenessText` were already exported at the base.
10. True. No owner text is reworded; S-11 is ruled.
11. True as ruled. The strings carry no mark under ADV-2026-11-23-30 item 1 and are sighted at AF6. S-12 keeps its `[P6 placeholder]`.
12. True. J-A1 and J-A2 use the real App, and `ExportRunReport` and `ExportRunEnd` are imported from PublishPanel and type-checked by tsc.
13. True, with two notes.
    - App 155/150 and the 7/0 are recorded only in the coming closing amendment (Amendment 20 item 3).
    - §7 is unedited: each of the 17 commits to the form deletes 0 lines (`git diff c~1 c | grep -c '^-[^-]'`).
    - The scope additions were committed (9fca8614 01:56, 01bb2de8 02:34, +01:00) before 0d38b74c (03:11).
    - No record calls a verify-mutation run an observation.
    - All 10 OBSERVED records of this piece name a full 40-hex commit, with no hash pin.
14. True. The diff's only verbatim mark is the moved entry-32 passage (Amendment 20 item 5). No added line holds a line cite (grep of `+` lines for `.ext:N` or `line N`).
15. True. OPEN-B1 to OPEN-B4 are ruled.

## 10. The seams of §2.5
- **Seam 4** (FilterPanel's `onCancel` and the Jobs Cancel as one function): J-A1 is present, green at the head (7-file run and verify), and red under its own mutation (check 3). Its e2e test J-E1 is written and not run.
- **Seam 5** (`ExportRunReport`): J-A2 is present, green, and red under its own mutation. J-E2 is written and not run.
- **Seams 1 and 3 under the new order:** C-A8 (real App) is green and red under its mutation, and C-R3 is red under M15-1.

## 11. The workers' departures
- **The build worker:**
  - The third parameter touches no result.
  - 12f326aa's edit of J-A2's second test came after 0d38b74c. The red-before at 0d38b74c was the whole file's import failure, so no red result of that test is changed. Already named for D-1.
  - C-A8 was changed before its commit and was red by name at 0d38b74c. It touches no result.
- **The words worker:**
  - One denied read of a temp output file. It touches no result.
  - D-5b's prefix handling matches what I observed in check 8.
- **Report text:** words-worker-report.md is 2,814 bytes with sha256 9852f12c…f748, as named. Its claims of 15 pairs, "8 files, 15 insertions and 16 deletions" and the J-A1 failure text all agree with checks 8 and 3.

## Findings

**Correctness:** none.

**Evidence**
- **E-1. A later VOID can mask J-E1's mutation.**
  - In jobs.mjs `main()`, any `Void` exits 2 even when a check already FAILed.
  - J-E2's precondition VOIDs (lines 141 and 144) come after J-E1 in the same run.
  - So §4's J-E1 mutation, and J-A1's {J-A1, J-E1} set, can exit 2 instead of 1. This is the class of the architect's E-2, still reachable.
  - Evidence: check 3, read at jobs.mjs:185 and :141-144.
  - The correction changes code (e2e test code). It is not ruled text. Each Old stands once (node count: 1, 1, 1). The New for jobs.mjs passes `node --check` in a log copy.
  - jobs.mjs, Old: ``  if (voided) { console.log(`\nVOID  ${voided} -- not a PASS (checks recorded before it: ${results.length})`); process.exit(2); }``
  - jobs.mjs, New: ``  if (voided) { console.log(`\nVOID  ${voided} -- not a PASS (checks recorded before it: ${results.length})`); if (results.every((r) => r.ok)) process.exit(2); }``
  - jobs.mjs, Old: `// Exit 0 all PASS; 1 a check failed, a wait after a Cancel click that timed out included; 2 VOID (`
  - jobs.mjs, New: `// Exit 0 all PASS; 1 a check failed, a wait after a Cancel click that timed out and a check that failed before a VOID included; 2 VOID with no check failed (`
  - e2e/README.md, Old: `and 2 when the run is VOID (the arm, a fixture, a row never standing or gone before its Cancel click, or any other wait that timed out); a wait after a Cancel click that times out is a failure, exit 1.`
  - e2e/README.md, New: `and 2 when the run is VOID (the arm, a fixture, a row never standing or gone before its Cancel click, or any other wait that timed out) and no check has failed; a wait after a Cancel click that times out, and a check that failed before a VOID, is a failure, exit 1.`
  - Clause check against the code: with the New line, a VOID with every recorded check passed still exits 2. A VOID after any FAIL falls through to `failed.length` and exits 1. A run with no VOID is unchanged.

**Documentation** (must be fixed before the merge; none changes code)
- **D-1. The closing amendment should carry the head's count.**
  - At the final head it reads 1,108, with Amendment 16 item 3's files at 61 (conditions.ts 15) and the walkthrough at 12 (added plus deleted).
  - Amendment 20 item 3 refers to the architect's figures at e958b913 (1,107 and 59).
  - It should also name verify-mutation's rc 1 at 7d24ed15 (8 MISS, the further cases of single-mutation rows) and the unobserved expectations in check 3 (J-U1 case 1's tail, J-U2's rejection, J-A2's consumer release).
  - Evidence: checks 2, 3 and 4.
- **D-2. Item 82's source comment covers only the Preparing phase.**
  - The comment (the worker's words, not ruled) names only the prepare-phase Cancel.
  - The execute-phase Export Cancel is PublishDialog's own `cancelRequested` ("Cancel publish"), equally untouched by the row.
  - Old (stands once): ``the Export section's Cancel is in `PublishPanel` (frontends/shell/src/publish/PublishPanel.tsx; its `cancelRequested` state)``
  - New: ``the Export section's Cancel is in `PublishPanel` (frontends/shell/src/publish/PublishPanel.tsx; its `cancelRequested` state) while it prepares, and in `PublishDialog` (frontends/shell/src/publish/PublishDialog.tsx; its own `cancelRequested` state, the button "Cancel publish") while it executes``
  - Clause check: PublishDialog.tsx:29, 76 and 325-327.
- **For the advisor, ruled text, no words proposed:** item 83's "says how many there are" against `attention.others` past the cap (check 6). This is not a found unmet clause in ordinary use.

Relevant files:
- D:/wt/m5b/frontends/shell/e2e/jobs.mjs
- D:/wt/m5b/frontends/shell/e2e/README.md
- D:/wt/m5b/KNOWN-LIMITATIONS.md
- D:/wt/m5b/frontends/shell/src/App.jobs.test.tsx
- D:/wt/m5b/frontends/shell/src/conditions/conditions.ts
- D:/wt/m5b/frontends/shell/src/jobs/jobs.ts
- D:/wt/m5b/frontends/shell/src/jobs/JobsTab.tsx
- D:/wt/m5b-logs/rr-verify.log, rr-mut-*.log, rr-node-test.log, rr-verify-*.log, rr-diff-head.txt
- D:/wt/read-1128b/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md
