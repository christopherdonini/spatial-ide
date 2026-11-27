# A's build, the worker's report

*Filed by the custodian, 2026-11-27. A's code, commit T first, built in D:/wt/a2save from the base f64fac32f3c75da5b4ea57e5b38eee89b92ec22a, with no app, dev server or e2e suite started (Amendments 3 and 4). A sonnet worker built it. Its run, from its completion notice only (ADV-2026-11-26-02), was 121 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (10188 bytes, sha256 9ce5e99f7feddbecf635f50b696c1ff91e630944f6e65596bbada80b60f6f2dd), byte for byte. Its account is the worker's; the custodian checked the head, the four commits and the count by git. No gate-log row: this is a build, not a gate.*

---

dab4e9d3b45f487d9e0af2531030104a6dd5b761 is the pushed head (origin/cut/a-second-save-is-announced, read after a fetch). Every step completed. I did not run E-A1 or any e2e, app or dev server. Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.

**Base, I3, I4**
- HEAD at start was f64fac32f3c75da5b4ea57e5b38eee89b92ec22a and `git status --porcelain` printed nothing.
- `git merge-base --is-ancestor 639a96cc… f64fac32…` exited 0.
- I3: SAVED_NOTICE, NO_VIEW_NOTICE, notSavedNotice and FOLDER_HOLDS_PROJECT_NOTICE, and their words, have only readers inside §0.2 and §4's list. Those are saveProject.ts, saveProject.test.ts, App.save.test.tsx, App.conditions.test.tsx, e2e/conditions.mjs, and the walkthrough rows AD1, AE2 and AF3a.
  - One prose mention sits outside both lists: `KNOWN-LIMITATIONS.md` line 511 says "the line that says the project was not saved then shows the kernel's message…". It reads no string and stays true with a time after it. I judged it not a reader, edited nothing and did not stop.
  - If you rule it is a reader, that is a stop.
  - The other hits are the words "saved/not saved" in reopenNotices.ts and kernel comments, and code like `save-notice` and `e2eSaveProjectToFolder` that never read the text.
  - project.mjs, colour.mjs, reopen.mjs and second-open.mjs read no saved text.
- I4: `git diff 806ad308 d6c2daf6` over the four paths changed only e2e/conditions.mjs (+25/-5).
  - The changes are the header (line 5, lines 17-19) and step 4 (Amendment 12).
  - ConditionView.tsx, saveProject.ts and App.tsx are byte-unchanged. C-E2 steps 1 to 3 are unchanged, and App.tsx lines 2237-2259 hold the same dispatch.
  - No moved shape, so no stop.

**Commit T: 6ccd00d011b9765504c9e088c1354f530827491f** (tests only, pushed). Each red was seen before the commit, and none is an import, type or reference error.
- CV-K1:
  - The kept half passed first, then the new-element half failed with `AssertionError: the held element is gone from the document: expected true to be false // Object.is equality`.
  - Its other assertions before that line also passed.
- SP-T1: `AssertionError: the two saved lines differ: expected 'The project was saved.' not to be 'The project was saved.' // Object.is equality`
- SP-T2: `AssertionError: the two not-saved lines differ: expected 'The project was not saved: the folder…' not to be 'The project was not saved: the folder…' // Object.is equality`
- A-A1: `AssertionError: the held element is gone from the document: expected true to be false // Object.is equality`
- E-A1: `node --check e2e/conditions.mjs` exited 0, and it was not run.
- E-A1's block (from "// 1b." to "// 2. The write") has the same sha256 at T and at the head (bafadedc…21eb), so its text did not change after T.

**Commits**
- 6ccd00d0: `test: commit T, the red commit of A: CV-K1, SP-T1, SP-T2, A-A1 and E-A1 step 1b, with no product code`
- 4184d085: `feat: commit P, a second save of the project is announced: each condition root keyed by its id, each save's first line ends with its time`
- 65981cb7: `docs: A's records: the seven walkthrough spans of ADV-2026-11-26-25 item 3 (AD1, AE2, AF3a) and C-E2's step 1b sentence in the e2e README`
- dab4e9d3: `test: A's mutations M-A1, M-A2, M-A3, M-A5, M-A6 and M-A7 recorded beside their tests, observed at 65981cb7`
- Design choices in P:
  - The one new export is `saveTimeText(at: Date)`, giving `HH:MM:SS` from the local getters.
  - A private `timed(notice)` appends ` (time)` and is called at each of the four outcomes, reading the clock then.
  - The doc comment holds the item 1 bounds.
  - Tests use `vi.useFakeTimers({ toFake: ["Date"] })`, installed before the open and only moved forward in the App tests.

**Mutations** (each applied alone from `D:/wt/a2save-logs/mutations/M-A*.patch`, tested, and reverted). All were observed at 65981cb71d28694c04d260ab7ff912595185edac and are recorded in dab4e9d3.
- M-A1 (key off the canvas-refusal root):
  - CV-K1 failed at the new-element half's held element still connected.
  - A-A1 failed at the same message, as predicted.
- M-A2 (key `${id}:${occurrences}`): CV-K1 failed at the kept-element half, `the same id raised again keeps its element: expected <div class="canvas-refusal" …(1)>…(2)</div> to be …(1)>…(1)</div>`.
- M-A3 (clock read once at saver creation):
  - SP-T1 failed at `the two saved lines differ`.
  - A-A1 failed at `its text is not the first save's`.
  - SP-T2 and C-A6 also failed. I recorded these as "Also failed".
- M-A5 (S4 without time):
  - SP-T2 failed at `the two not-saved lines differ`.
  - "a refused save shows the owner's notice…" also failed.
- M-A6 (hours modulo 12): SP-T1 failed at the field assertion, `expected [ 11, 4, 5 ] to deeply equal [ 23, 4, 5 ]`.
- M-A7 (picker failure without time): SP-T2 failed at its picker case, `expected 'The project was not saved: the folder…' to be …` (saveProject.test.ts line 216).
- Every mutation failed where §4 predicts, so nothing goes to the advisor. No mutation was committed, and the product files were clean at each commit.

**Strings script** (`D:/wt/a2save-logs/strings-check-v1.mjs`, output in `strings-check-run1.log`; exit 0, "ALL PIECES AND LINES MATCH")
- It reads item 1's four lines from the ruling's ````text block by `git show origin/main:<ruling>` and splits each at {message} and {time}.
- Departure from the brief's wording: composing from the exports, as the form's §2.5 says, means three pieces do not stand as one contiguous literal.
  - They are "The project was saved. (", "The project was not saved. (" and "The folder already holds a project. (".
  - The script resolves each as the export's value (SAVED_NOTICE, NO_VIEW_NOTICE, FOLDER_HOLDS_PROJECT_NOTICE, read by name) followed by " (", which stands in the code.
  - The other pieces ("The project was not saved: ", " (" and ")") stand as literals in the code.
  - I kept the composition because the form governs and I7 requires the driver to read the fixed words by name.
- The script also bundles the real saver with esbuild and runs it at a set clock. All four lines came out equal byte for byte, with message "the kernel's message" and time 23:04:05.

**Walkthrough script** (`D:/wt/a2save-logs/walkthrough-spans-v1.mjs`, output in `walkthrough-spans-run1.log`)
- It read seven Old/New pairs from the ruling by `git show`.
- Each Old text stood exactly once in its row and exactly once in the whole file, so no confinement was needed.
  - AD1 (line 2030): spans 1 to 4.
  - AE2 (line 2060): span 5.
  - AF3a (line 2086): spans 6 and 7.
- Afterwards each New stands once in its row, no Old stands, and only lines 2030, 2060 and 2086 changed. No Result log line was edited.
- The e2e README C-E2 sentence (line 929) was extended in my words. It says step 1b checks the element is no longer connected, the alert role, differing text and no `.condition-occurrences`, and ends "it does not check what a screen reader announces".

**Checks at dab4e9d3** (each heavy one in a shared hold; disk was 41622 MB free, above the 40960 floor)

| Check | Exit | Result |
|---|---|---|
| `npm ci` in renderer/bundle-viewer | 0 | 31 packages added |
| `npm ci` in frontends/shell | 0 | 198 added, "4 vulnerabilities" printed |
| `npm run typecheck` | 0 | |
| `npm test` (pretest build, then vitest) | 0 | 132 files, 1673 tests passed (base 1669, +4 new) |
| `node --test` over the scripts/plan, hooks and evidence suites | 0 | 623 pass, 0 fail |
| `verify-cites` | 0 | PASS, 3743 files; 237 loose references advised, none from my files |
| `verify-quotes` | 0 | PASS, 128 verified, 30 baselined |

- H2 held: no test outside scope failed with the key.
- Logs are in `D:/wt/a2save-logs/chk-*.log`.

**§7 count** (`git diff --numstat f64fac32…...HEAD` over the seven paths): 237 insertions and 30 deletions, 267 changed lines over 7 files, under the 280 ceiling (no class 8).

| File | Insertions | Deletions |
|---|---|---|
| e2e/conditions.mjs | 40 | 6 |
| App.conditions.test.tsx | 46 | 4 |
| App.save.test.tsx | 9 | 3 |
| ConditionView.test.tsx | 38 | 0 |
| ConditionView.tsx | 4 | 2 |
| saveProject.test.ts | 89 | 11 |
| saveProject.ts | 11 | 4 |

- The whole diff from f64fac32 touches only those seven paths plus the two records (MANUAL-WALKTHROUGH.md and e2e/README.md), so there is no class 9.

**Departures and notes**
- One git push was in a compound call: after T, `git log …; git push …` ran in a single Bash call. The later pushes were each their own call.
- Hold lines: several started with `grep`, `df` or `git status` before the `cd`. The hold shape itself was followed.
- My first `npm test` hold run and the `verify-quotes` waits were cut off by the 180 s foreground limit. I used bounded `until` waits on the log files while the holds ran, which is mild polling.
- By mistake I ran `apply.mjs M-A6` once in the main tree during record editing, after M-A6 had been observed.
  - I reverted it by editing the one line back and confirmed the product files clean (`git diff` empty on both).
  - Its first patch file was overwritten with test comments mixed in. I regenerated `M-A6.patch` cleanly by applying and reverting it. `apply.mjs` now diffs only the mutated file.
- E-A1's step 1b comment says "a second save is announced" (the piece's name). That is not a screen-reader claim, but the text is frozen after T. I have not asserted any announcement in code, comments or records. The README sentence carries only the negative.
- The OBSERVED lines for A-A1 and SP-T1 under M-A3 elide the literal clock text as `<the time, elided here>`, so no literal clock string stands in a test file (§8 item 9).
- C-A6 now installs a fake Date before its open, and the harness teardown restores real timers (also read by the C-A5 describe). This is within §4's "existing tests changed".
- `App.save.test.tsx` installs the fake clock in its `beforeEach`.
- Because the saver is built at App mount, M-A3 also fails C-A6, as noted above.

Needed from the custodian:
- Whether KNOWN-LIMITATIONS line 511 counts as a reader under I3.
- E-A1's runs at T (6ccd00d0) and at P wait for port 5180.

Worktree: D:/wt/a2save. Logs: D:/wt/a2save-logs.
