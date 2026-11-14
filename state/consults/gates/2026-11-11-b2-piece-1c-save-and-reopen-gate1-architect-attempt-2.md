Reviewed: PR #307 at 1e4a7b6fca29bc59866182719edcc67461ec7553 (the custodian's filing note, 2026-11-11: gate 1, attempt 2, the architect, beside the reviewer, PLAN node b2-piece-1c-save-and-reopen, step 1; over R2 alone, dispatched at 17:06Z before the human's ruling of 17:17Z, under which gate 1's second attempt is completed over R2 and the rulings' code together; below, the hand-back byte-identical, one final newline added)
Reviewed: PR #307 at 1e4a7b6fca29bc59866182719edcc67461ec7553 (base e3fb4a97), gate 1 attempt 2, architect
Verdict: PASS WITH NOTES

Branch and commit: `cut/b2-piece-1c-save-and-reopen @ 1e4a7b6fca29bc59866182719edcc67461ec7553`.

I have no shell, so I cannot show the packet's sha256. I read the packet whole with the Read tool. I started no shell and I leave no background shell. Cites marked `@ 1e4a7b6f` are in C:/dev/wt/b2c. Cites marked `@ 572416aa` are in the main checkout. Everything below is in my own words, except text in backticks, which I copied from the file cited. I first read Part 1 of the 2026-11-05 gate-rounds directive (items 1 to 9). It governs this report.

## Findings by class

### Correctness
None.

### Evidence
None.

### Documentation (must be fixed before the merge; none of them blocks; none is the human's wording, so the worker applies the words with no re-gate and the PR body lists them)

**D-8. Flag 1, first count: `surfaceRegistry.ts` line 76 contradicts the line above it.**
- Text: `frontends/shell/src/console/surfaceRegistry.ts:75-76 @ 1e4a7b6f`.
- W5 changed line 75 to "The seven SKP commands". Line 76 still says `A seventh command changes`.
- This PR made the sentence untrue. At B the paragraph said six, then "a seventh". My attempt-1 W5 missed this line.
- Words: replace `A seventh command changes` with `An eighth command changes`.
- Clause check:
  - seven class-A rows: `surfaceRegistry.ts:81-89 @ 1e4a7b6f`;
  - seven `call("…")` sites: `frontends/shell/src/skp/client.ts:86,96,117,131,135,144,154 @ 1e4a7b6f`;
  - the derived-set assertion the sentence names: `surfaceCompleteness.test.ts:205-206 @ 1e4a7b6f`.

**D-9. Flag 1, second count: the identifier `expectedSix` holds seven names.**
- Text: `frontends/shell/src/console/surfaceCompleteness.test.ts:203,206 @ 1e4a7b6f`.
- This is test text, so the edit is class 3 by named exception, as W5 was.
- Words: rename `expectedSix` to `expectedSeven` on both lines.
- Clause check: the array at line 203 has seven entries.

### Notes (do not block)

- **The test's rejection shape (Part 1 item 7, fourth clause).** The real rejection from `binding_pick_project_folder` is a string: it returns `Result<Option<String>, String>` (`frontends/shell/src-tauri/src/commands.rs:280,288-290 @ 1e4a7b6f`). The new throw case rejects with an `Error` instead (`skp/dialog.test.ts:83-84 @ 1e4a7b6f`). `pickProjectFolder` passes `e` through unchanged whatever its shape (`skp/dialog.ts:33-36`), so the case still proves what it claims. It copies the shape of `pickFile`'s existing test.
- **The App-level path.** `App.save.test.tsx:69-75 @ 1e4a7b6f` mocks `pickProjectFolder`, so no App-level test sees the recorder row. The route Amendment 18 item 1 chose does not need one: App's one product call is `App.tsx:879`, and the dialog test runs against the real `consoleRecorder`.
- **A parenthetical count.** `surfaceRegistry.ts:91-92` now says "eight" next to `NEXT-CUT.md's "7 + dev seam"`. The parenthetical names NEXT-CUT's own count, so it is not untrue.
- **A duplicate import.** `dialog.test.ts:10-11` imports from `./dialog` twice. It is disclosed in Amendment 19 item 3 and is a matter of style only.
- **Item 62's pinned spans.** The comment's line spans are pinned at 88a35355 (`KNOWN-LIMITATIONS.md:504 @ 1e4a7b6f`). R2 shifted the spans at H: store.rs moves by −1 after its old line 41, and mod.rs by +1 after line 177. The comment names its commit, so it does not present the pin as current. As in attempt 1, 88a35355 reaches main only through a merge commit (§9).
- **Renamed tests and Part 1 item 3.** W5's renames change names only, not assertions. My reading is that a rename is not a "changed test" under item 3. If the custodian reads it otherwise, the reviewer's own observation at this gate closes it (item 9).

## Checks 1 to 7

**1. My attempt-1 findings at H.**
- **C-1: closed.** See check 2.
- **C-3: closed.** The `pub const` is gone from `kernel/src/project/store.rs:38-40 @ 1e4a7b6f`. A Grep for `OPEN_LOCK` in *.rs, *.ts, *.tsx and *.mjs, and in every path outside state/, governance/ and site/, finds nothing.
- **C-4: closed, by flag 2's route** (Amendment 18 item 1, the reviewer's preferred closure).
  - `pickProjectFolder` now records `binding_pick_project_folder` before the invoke and resolves it as `pickFile` does (`frontends/shell/src/skp/dialog.ts:27-37 @ 1e4a7b6f`).
  - `project/saveProject.ts:23` re-exports it. App's product caller is `App.tsx:88,879`.
  - The test has two cases, each asserting the name and the outcome (`skp/dialog.test.ts:64-94`).
  - A Grep finds every non-test `invoke("binding_…")` site in `streaming/dataPlaneClient.ts`, `diagnostics/log.ts`, `skp/dialog.ts`, `skp/crsCatalog.ts` and `publish/client.ts`, the five files the recorder's sentence names (`console/recorder.ts:353-355`), so that sentence is true again. `skp/dialog.ts` is already in `RECORD_NAMED_ALLOWLIST` (`soleCaptureSite.test.ts:52`).
- **C-5: closed by W1.** `KNOWN-LIMITATIONS.md:503`; see check 3.
- **D-1: closed** (W2, W3). **D-2: closed** (W4). **D-4: closed** as W5 listed it, with D-8 and D-9 above added. **D-6: closed** (W6).
- **D-5: closed.** `kernel/README.md:390 @ 1e4a7b6f` now ends with the form's path.
- **D-7: closed in the PLAN half.** `governance/PLAN.yaml:5705 @ 572416aa` contains `from_bytes's consumer is step 2's reopen under M1, its gate K-O10 (Amendment 16 item 1; Amendment 18 item 3)`. The PR body is the reviewer's to read.

**2. C-1, red-line text.**
- `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:83-87 @ 1e4a7b6f` is the heading, a blank line, the italic line, a blank line and the note.
- The note: one anchored Grep pattern that I typed matches line 87 of the ADR. With the bullet's prefix `ADR-022: "…"` added, the same pattern matches the directive's item 3 bullet in `state/directives/2026-11-05-8c-…-8b-d3.md:18 @ 572416aa`. That is one match in each file.
- The italic line: one anchored pattern matches it in ADR-013, ADR-022 and ADR-026, so it has the same bytes as ADR-026's (`ADR-026…md:150-154 @ 1e4a7b6f` shows the shape).
- Nothing above the heading changed. The numstat for b06bbbba shows 6 added lines and 0 deleted (packet; Amendment 19 item 1). Lines 70-78 read the same at B and at H.
- The note's claim is true of the text: Amendment 1 says `(Proposed)` (ADR-022:74).

**3. The words at H.**
- W1 (`KNOWN-LIMITATIONS.md:503`) and W6 (`:504`) are my attempt-1 text exactly. W1's clauses hold at H:
  - both machine files are written before the replace: `kernel/src/project/mod.rs:282-296`;
  - nothing is removed on a failure: `mod.rs:280-296`;
  - an open's project is kept only after the replace: `mod.rs:297-305`, so the next save mints again (`mod.rs:243-245`) and the shell asks for a folder again (`saveProject.ts:96-106`);
  - a later save writes `locations.json` before the replace (`mod.rs:283,296`).
- W2 (`protocol/skp/src/v0/commands.rs:741-744`) and W3 (`protocol/skp/SKP-V0.md:1338`) match my words; W2 is wrapped. Clauses at H:
  - the record move: `mod.rs:350-351`;
  - no step: `mod.rs:358`;
  - differs: `mod.rs:359-361`;
  - the line: `mod.rs:362`;
  - written after the replace: `mod.rs:296,307`.
- W4 (`mod.rs:177-178`) matches. Clauses: `mod.rs:282,291-293,486-488`; `store.rs:203-206,211-215`.
- W5 matches every position I listed:
  - `surfaceRegistry.ts:12,28,32,70,75,91`;
  - `surfaceCompleteness.test.ts:23,111,112,198,200,205`;
  - `actionRegistry.test.ts:132`.
- W5's clauses hold: 7 class-A rows; 9 rows use the citation constant, eight plus the dev seam (Grep); 13 ids at `actionRegistry.test.ts:133-147`.
- The reviewer's D3 at `e2e-test-surface.ts:186` holds by `saveProject.ts:90,93`.

**4. R2's diff, line by line.**
- R2 adds nothing new against §8 or the seam rule.
- The re-export has a product caller (App.tsx:879). No `pub` item is added. The kernel loses one `pub` item.
- The interface consumed is the real one (`commands.rs:280` returns `string | null`, or rejects).
- The two new files have no CR and no tab (Grep count 0).
- **Flag 1:** D-8 and D-9.
- **Flag 3:** no finding. Amendment 18 item 1 chose the architect's W5, test names included. Both wordings were true. No file under main's governance/ cites the old names (Grep).
- **Flag 5:** no finding. The sentence is true of `dialog.ts:28-36`, and it refers to the form by amendment and item, which is the allowed form.
- **Flag 4** (written by heredoc) is a process departure, recorded in Amendment 19 item 3. It leaves no trace in the bytes.
- **Readiness (Part 1 item 4):** R2 ran its suites on the tree it then committed as 1e4a7b6f (Amendment 19 item 3). The suites at H are the tester's, after this gate (Amendment 18 item 7). I name this; it is not a finding.

**5. The records.**
- Amendment 18's classes are right:
  - class 1;
  - class 9 for the picker's record and its test, declared before the code. By the local reflogs, which are evidence and not Authority, ce00a7fa reached main at 16:02:30Z, b06bbbba was committed at 16:04:31Z and 1e4a7b6f at 16:41:12Z. The reviewer can recompute these times with git;
  - class 3 by named exception for the test names;
  - class 5 when ruled.
- Amendment 19's classes are right: class 1, and class 8 for the shell tests group, at 421 of its 380. Nothing in either amendment calls a verify-mutation run an observation.
- Amendment 17 item 3's second clause is recorded as superseded, in Amendment 18 item 4.
- `from_bytes`'s consumer and gate are named in the PLAN summary. The PR body half is the reviewer's.

**6. C-2 and C1.**
- Nothing at H pre-empts either ruling:
  - `SaveProjectResponse` is unchanged (`commands.rs:736-739`);
  - `session_history.rs` is not in R2's diff.
- If a ruling adds a reason to withhold the mark, W2 and W3 gain it with that ruling's code. Item 62's sentence on a reopened dataset changes only if a ruling touches identity.
- These two do not count toward this attempt's verdict. **The PR cannot merge until both are ruled and their code is gated.**

**7. The scope.** All 14 files in R2's numstat are among the changes Amendment 18 item 1 names (Amendment 19 item 1 agrees).

**CI:** I did not read it (I have no shell). CI green stays a condition of the merge.

## For the human
- C-2 and C1 are still yours (Amendment 18 item 2). The merge waits on both.

## The packet's gaps
- The reflog or commit times needed to show that Amendment 18 came before R2's code. I read them from the local reflogs.
- `surfaceRegistry.ts`'s line 76 and the identifier `expectedSix` were flagged but not located by line.
- Otherwise none.

Model: Opus 5.5 (claude-opus-5-5).
