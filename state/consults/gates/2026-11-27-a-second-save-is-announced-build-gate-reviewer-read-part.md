Reviewed: the branch cut/a-second-save-is-announced at dab4e9d3b45f487d9e0af2531030104a6dd5b761 in D:/wt/a2save, with its T worktree D:/wt/a-read-t at 6ccd00d011b9765504c9e088c1354f530827491f (removed after), and the form and the rulings at main a0aaa767a035548fb9a1007796ec765c544e6365 in D:/wt/read-1127c, read only. This is the custodian's filing note, 2026-11-27: the reviewer's build gate, THE READ PART (the form's Amendment 6; ADV-2026-11-27-18 item 2), node:a-second-save-is-announced@build-gate-reviewer-read-part; its run, from its completion notice only (ADV-2026-11-26-02), 99 tool uses. A read part gives no verdict and takes no gate-log row. Below the rule, the report as handed back (saved by Write with the harness's indent removed; 13996 bytes, sha256 998951f5d33347521387279f796be46ccd55a987d1b54ed45d52307a9e49e0b4), byte for byte except the scratch folder's path, written <scratch> (1 place; 13897 bytes after it, sha256 b92f662d92857681e7c9ef0e99b4a8b0aac0fae434082d053fc1f2b6e02ebb1d). Its findings, with the architect's, are ruled in ADV-2026-11-27-20 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-20-as-four-questions-f1-a-finding-the-architects-pair-sp-t1s-name-recorded-now-the-reviewers-words-for-the-wait-the-m-a3-pair.md`).

---

READ PART — cut/a-second-save-is-announced @ dab4e9d3b45f487d9e0af2531030104a6dd5b761 (this part gives no verdict)

I read the form, ADV-2026-11-26-25, ADV-2026-11-27-18 and the build worker's report with the Read tool in D:/wt/read-1127c at a0aaa767a035548fb9a1007796ec765c544e6365. I read Amendment 6 first. Unless a line says otherwise, everything below is paraphrase. Logs are in the scratchpad: <scratch>/

**1. The full diff against §2 as amended.** Commands: `git -C D:/wt/a2save diff f64fac32...dab4e9d3` (file by file), `git log --format='%H %P' f64fac32..dab4e9d3` and `git show --stat` for each commit.
- The chain is linear with no merges: T 6ccd00d0 → P 4184d085 → 65981cb7 → dab4e9d3.
- T touches four test files only (129 insertions, 0 deletions) and no product code.
- Nine paths changed: the seven §7 paths plus MANUAL-WALKTHROUGH.md and e2e/README.md.
- ConditionView.tsx: `key={condition.id}` on both roots, and one sentence added to the doc comment (§2.1).
- saveProject.ts:
  - one new export, `saveTimeText(at)` (HH:MM:SS from the local getters, zero-padded);
  - a private `timed(notice)` that reads `new Date()`;
  - `timed` wraps the four first lines at the no-view return, the picker's catch, the confirmed return and the save's catch. The cancel still returns `[]`, and no other string changes.
  - The doc comment states item 1's bounds (§2.2).
- Tests and the e2e driver: the changes §4 lists.
- No change falls outside what §2 describes. Nothing goes to the advisor under this check.

**2. §7's count.** Command: `git diff --numstat f64fac32f3c75da5b4ea57e5b38eee89b92ec22a...dab4e9d3b45f487d9e0af2531030104a6dd5b761 --` over the seven paths. There are no merge commits after the base, so the first-parent form is not needed.
- Printed: 237 insertions and 30 deletions, 267 changed lines over 7 files.
- That is under the ceiling of 280 over 7 files, so there is no class 8. No path was added, so there is no class 9.

**3. Item 1's four lines and item 3's seven New texts** (scratchpad scripts lines/check3.mjs and lines/spans.mjs).
- The four lines: the script bundles the real head saveProject.ts with esbuild, fixes Date at local 23:04:05, and runs each outcome through `createProjectSaver`. It compares each result with the ruling's ````text block, with `{time}` and `{message}` filled in.
  - Printed: `0 EQUAL "The project was saved. (23:04:05)"`, `1 EQUAL "The project was not saved: the kernel's message (23:04:05)"`, `2 EQUAL "The project was not saved. (23:04:05)"`, `3 EQUAL "The folder already holds a project. (23:04:05)"`, and the picker-failure case EQUAL.
  - So each built line equals the ruling's line byte for byte. They are built from SAVED_NOTICE, notSavedNotice's template, NO_VIEW_NOTICE and FOLDER_HOLDS_PROJECT_NOTICE, followed by `timed`'s literal ` (` + time + `)`.
- The seven spans: the script extracts the seven Old/New pairs from the ruling.
  - At f64fac32, each Old text stands once in its row and once in the file.
  - At dab4e9d3, each New text stands once in its row (AD1 ×4, AE2 ×1, AF3a ×2) and no Old text stands.
  - Only lines 2030, 2060 and 2086 change.
  - Printed: `base with seven pairs applied equals head: true`. No Result log line is edited.

**4. T's reds** (detached worktree D:/wt/a-read-t at 6ccd00d0).
- Setup: `npm ci` in both packages (31 and 198 packages added). The App files need `src/generated/NOTICE.txt`, so I also ran `npm run prebuild` (the viewer build plus generate:notice, no app). Then `npx vitest run` on the four files, inside holds.
- My first try, before the prebuild, failed to load the two App files (`Failed to resolve import "../generated/NOTICE.txt?raw"`). That was a setup error, not a red.
- Rerun: `Tests 4 failed | 39 passed (43)`. Each failure is an AssertionError:
  - CV-K1 at ConditionView.test.tsx:207, "the held element is gone from the document: expected true to be false". This is after the kept half's two assertions, so the kept half passed first.
  - SP-T1 at saveProject.test.ts:161, "the two saved lines differ: expected 'The project was saved.' not to be 'The project was saved.'".
  - SP-T2 at :179, "the two not-saved lines differ…".
  - A-A1 at App.conditions.test.tsx:536, "the held element is gone…".
- None is an import, type or reference error.
- CI at T (run 45953483258) agrees: 4 failed, 1669 passed, the same four messages.
- E-A1's step-1b block (from `// 1b.` to `// 2. The write`) has the same sha256 at T and at the head: bafadedc8a3576d73ba23f4c8a84a3c8ec753927f971a7e128390a3a19f821eb.

**5. The six mutations, at the head.**
- Method: each patch was applied alone with `git -C D:/wt/a2save apply <patch>`. Inside a shared hold I ran vitest on ConditionView.test.tsx, saveProject.test.ts, App.conditions.test.tsx and App.save.test.tsx, then reverted with `apply -R`.
- M-A1: 2 failed. CV-K1 at :211 (held element still connected) and A-A1 at :546 (same message).
- M-A2: 1 failed. CV-K1 at :188, the kept half, "expected <div class="canvas-refusal" …(1)>…(2)</div> to be <div class="canvas-refusal" …(1)>…(1)</div>".
- M-A3: 4 failed.
  - SP-T1 at :184 (differs) and A-A1 at :550 (differs).
  - Also SP-T2 at :211 and C-A6 at App.conditions.test.tsx:505.
- M-A5: 2 failed. SP-T2 at :211 (differs), and also "a refused save shows the owner's notice with the kernel's message" at :150.
- M-A6: 1 failed. SP-T1 at :187 (expectTimeOf), "expected [ 11, 4, 5 ] to deeply equal [ 23, 4, 5 ]".
- M-A7: 1 failed. SP-T2 at :224, the picker case.
- Each failed where §4 predicts, and the "Also failed" lists match the recorded lines.
- After the last revert, `git status --porcelain` printed nothing.
- The recorded MUTATION/OBSERVED lines match what I saw, except the two M-A3 OBSERVED messages (finding D2).

**6. The suites at the head that start no app** (inside holds; C: had 41364 MB free before the heavy run).
- The shell's `npm run typecheck`: exit 0.
- `npm test` (pretest build, then vitest): exit 0, 132 files and 1673 tests passed.
- `verify-cites`: exit 0, "PASS … 3743 file(s)", 237 loose references advised.
- `verify-quotes`: exit 0, "PASS — 159 checked, 128 verified, 30 baselined … 944 ruling cites resolved".
- `verify.mjs` (verify-plan): exit 0, PASS.
- `verify-test-claims` (extra; CI runs it): exit 0, PASS, 901 claims.
- CI's `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: exit 0, 623 pass, 0 fail.
- `gh run list --branch cut/a-second-save-is-announced`:
  - dab4e9d3: Product CI — shell success (132 files, 1673 tests) and Ported notices success;
  - 6ccd00d0: Product CI failure (the expected reds) and Ported notices success;
  - f64fac32: both success.
- The branch has no PR, so governance CI has not run on it.

**7. §8, item by item.** I scanned the diff's added lines for screen reader, announc, Narrator, "file was written", P6 placeholder, raisedTimesText, elapsed, duration and literal `\d\d:\d\d:\d\d`, and listed the changed paths by name.
1. True: nothing outside §7's files and the two records.
2. True: nothing under protocol/, kernel/, engine/ or src-tauri/, and no change to conditions.ts, ProblemsTab or StudioLayout.
3. True: no S-5 or raisedTimesText is used for a save. The one raisedTimesText hit is CV-K1's stream-terminal half. C-A6's occurrence assertion stands.
4. True: App.tsx is unchanged.
5. True, by check 3. No other saver string changed, and there is no placeholder mark.
6. True: no duration, elapsed time or progress figure.
7. True: nothing claims an announcement or the write time.
   - saveProject.ts's comment says "not when the file was written".
   - The README says "it does not check what a screen reader announces".
   - The step-1b comment frozen at T reads, verbatim: `// 1b. E-A1, a second save is announced: save again, and what the strip shows is a new element whose text differs from the first save's line.` It uses the piece's title and names what is checked. It does not say that a screen reader announces anything.
8. True: each removed assertion is replaced at the line §4 lists, with nothing loosened beyond the list.
9. True: no literal clock string is asserted. The literals appear only in comments, and the M-A3 OBSERVED lines elide the time.
10. True, by check 4.
11. True: no merge into main or into release/v0.2.
12. True: E-A1's text is unchanged after T (the same hash), and no app start is recorded. The code-before-second-attempt clause was replaced by Amendment 3.

**8. PR 365 overlap.**
- From `gh pr view 365`: branch cut/colour-by-refill-keeps-the-view. `rev-parse origin/...` gives 639a96cc25873c99d606b4d75541bd8f3de37543, which is an ancestor of dab4e9d3 (rc 0).
- `git diff --name-only 2095a7ac…639a96cc` lists the eight files of Amendment 3 item 3. A meets two of them.
- KNOWN-LIMITATIONS.md: not touched by A.
- MANUAL-WALKTHROUGH.md: in both. PR 365 changes row AC12 only (line 1998); A changes AD1, AE2 and AF3a (2030, 2060, 2086). No hunks overlap.
- e2e/README.md: in both. PR 365 changes the colour-refill.mjs (E-RK1) entry (line 916); A changes the C-E2 entry (line 929). No hunks overlap.
- colour-refill.mjs, App.tsx, WorkingCanvas.test.ts, WorkingCanvas.tsx and candidateArmSession.ts: not touched by A.

**9. KNOWN-LIMITATIONS item 62's sentence** (line 511 at dab4e9d3, unchanged from the base) holds against the built line. The built S4 line still shows the kernel's message followed by `open.lock:` and the error's text, and only then ` (HH:MM:SS)`. The sentence does not say the line ends there.

**10. I4 and I7, at the head.**
- I4 not met. `git diff 7dbf2f3e…f64fac32` over ConditionView.tsx, saveProject.ts, App.tsx and e2e/conditions.mjs changes only conditions.mjs (+25/−5). Its hunks are the header (lines 2 and 14) and step 4 (base line 155 on). ConditionView's roots, saver lines 93–128, App.tsx 2237–2259 and C-E2 steps 1 to 3 are unchanged in shape.
- I7 not met. The driver's own `savedNoticeText` regex and `isSavedLine`, run against dab4e9d3's saveProject.ts (lines/i7c.mjs), read `"The project was saved."` by name. It accepts `… (23:04:05)` and `… (09:04:05)`, and rejects the bare line, `(9:04:05)` and trailing text.

FINDINGS

Correctness: none.

Evidence: none.

Documentation (each is must-fix before the merge; none changes code; none is the human's wording; the gates' words go to the advisor if the other gate words a place differently):

- **D1. The SP-T1 test name differs from §4's name.**
  - §4 gives `it("SP-T1: two confirmed saves of one open answer saved lines that differ, each carrying its own save's fact", …)`.
  - saveProject.test.ts line 175 (and the RECORDED/OBSERVED lines 171–174) has "…of one open answered saved lines…".
  - verify-test-claims does not catch it: its recognizer stops at the apostrophe in "save's" and extracts only CV-K1 from this form (checked with `extractClaimedTests` on the form).
  - Correction without code or count: the closing amendment records that §4's SP-T1 is the test named "SP-T1: two confirmed saves of one open answered saved lines that differ, each carrying its own save's fact". A rename instead would add 10 changed lines to §7's count (5 lines), so the record route is preferred.
- **D2. The two M-A3 OBSERVED lines replace vitest's second operand with a paraphrase.** The time elision itself is honest.
  - Seen: `expected 'The project was saved. (07:08:09)' not to be 'The project was saved. (07:08:09)' // Object.is equality`. A-A1 is the same with 08:53:50.
  - Old, in saveProject.test.ts line 172 and App.conditions.test.tsx's M-A3 OBSERVED line: `expected 'The project was saved. (<the time, elided here>)' not to be the same text // Object.is equality`
  - New: `expected 'The project was saved. (<the time, elided here>)' not to be 'The project was saved. (<the time, elided here>)' // Object.is equality`
  - Comment-only in two §7 files: +4 changed lines, so 271 of 280.
- **D3. The README step-1b sentence can read as "at least one second after the first save".**
  - The code waits only until `Date.now() >= (floor(r/1000)+1)*1000`, where r is the page clock read after step 1's checks. That is the next clock second, which can be under one second away.
  - Old (e2e/README.md, the C-E2 entry): `Step 1b then saves again once the page's clock reads a whole second past the first save's, and checks`
  - New: `Step 1b then saves again once the page's clock has passed into a later second than its reading after step 1, and checks`
  - Clause check:
    - "the page's clock" = `page.evaluate(() => Date.now())`;
    - "passed into a later second" = `now >= nextWholeSecond`;
    - "its reading after step 1" = `clockAtFirstReading`, read after step 1's records.
  - This is a records file, outside the count.
  - The same words stand in conditions.mjs's header comment line `//   1b. save again once the page's clock reads a whole second past step 1's:` (added at P, not in the frozen step-1b block). Optional New for that line: `//   1b. save again once the page's clock has passed into a later second than its reading after step 1:`. It adds 2 lines to the count, so 273 with D2.

What I did, and departures:
- Each heavy run was inside a shared hold, and no script exit code was in 96–99.
- In the verify-scripts hold line I left a stray no-op token (`bash scratch-none 2>/dev/null ;`) after the hold call. It ran nothing in the repo, and the hold was taken.
- One stray command wrote /tmp/x365. I deleted it.
- I wrote nothing in D:/wt/a2save-logs.
- No app, dev server or e2e suite was started. Nothing was committed or pushed, and C:/dev/spatial-ide was not touched.

After the report, I removed D:/wt/a-read-t with `git -C D:/wt/a2save worktree remove --force D:/wt/a-read-t` (rc 0; worktree list shows 0 entries for it). D:/wt/a2save is at dab4e9d3b45f487d9e0af2531030104a6dd5b761, and `git status --porcelain` prints nothing.
