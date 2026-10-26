*Custodian's filing note (2026-10-24): the worker's gate 1 fixes on milestone 4 PR C (draft PR #253), at 580d389e, under the form's Amendment 10: C1 with PC-U16, E1, and the gates' Documentation words. The custodian's check at the head: every word set the brief named is in its target file byte for byte, the ten files are the expected ones, and section 7 over e5e6e03a...580d389e is 56 files and 2,527 lines with no file past its ceiling. Its edits were made through the shell; no rebase, reset, PR action or force push. It discloses that a mutation's revert wiped its uncommitted edits to one file, which it re-applied before the run it reports. The run 19:06:50Z to 19:14:35Z by its transcript (Read 1, Bash 28). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 7b4964b9c4fd333e867507bc3221d0413fb32f7de0efc72672659b4999f51f68.*

---

Applied: #253's gate 1 fixes at 580d389e797381e466e00a4d239926baa9eb462a
Pushed to cut/b1-shell-half-pr-c (push rc=0). Origin's branch equals HEAD, and `git status --porcelain` is empty. Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.

**Commit:** one signed-off commit with the brief's title. The message has `@` only in the Co-Authored-By line. `git diff --name-only ec95eacb HEAD` lists exactly 10 files: KNOWN-LIMITATIONS.md, MANUAL-WALKTHROUGH.md, e2e/README.md, e2e/table.mjs, App.table.test.tsx, WorkingCanvas.tsx, TableTab.test.tsx, tableConstants.ts, tableSource.test.ts, tableSource.ts.

**Changes (all words byte-copied from the reports' named lines):**
- **C1:** the ended line in `tableSource.ts`, PC-R2's expected line in `TableTab.test.tsx`, and the AC8 phrase now read "The dataset's session ended, so the table was cleared; open the file again to load it." Before, they said "The file changed, so ...". AC8 reads "the line it shows after the dataset's session ended".
- **PC-U16** is new in `tableSource.test.ts`, with the brief's title and a RECORDED MUTATION comment. It feeds `REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL` to the sink and asserts the callback is called, phase "ended" and count 0, and that `tableLine` is the new ended line.
- **E1 (`App.table.test.tsx`):**
  - The capture is typed `null | ((run: ExportRunReport) => void)`.
  - The stand-in is `forwardRef<PublishPanelHandle, Pick<PublishPanelProps, "onExportRunning">>`.
  - `run()` types `end` and `ended` with `ExportRunEnd`.
  - The run ends with `{ phase: "execute", outcome: { status: "unknown-attempt" } }` (before: `kind: "cancelled"`).
  - The type imports are from `./publish/PublishPanel` (`PublishPanel.tsx:31-41, 316-341`).
- **D1:** `tableConstants.ts`'s `TABLE_MAX_IN_FLIGHT` line gains the "Not covered" sentence.
- **D2:** KL item 56's source comment gains the two-tickets clause.
- **D3:** the REQUIRED line in `WorkingCanvas.tsx` now names `table/TableTab.tsx` as the caller.
- **D4(a):** the PC-E2 header in `table.mjs` was rewritten and now fits on one line.
- **D4(b):** `e2e/README.md` now reads "its line names 2 of 3 selected features".
- **D5:** KL item 54 gains "the filter, or, with no filter in force, that the file may hold more".
- **D6:** the `CAPTURED_ROW_MAX_BYTES` doc now says 163,840,000 bytes (156.25 MiB), counted by `cellBytes`.
- **D9:** the end of AC8 gains the Activity-tab statement and the `table-failed` code.
- **Item 4:** one sentence added to `tableSource.ts`'s "One stream, structurally" paragraph: a start before the previous `viewport_query` is answered issues at once, the earlier ticket is cancelled when its answer arrives, so two tickets are held for that window, pointing at `tableConstants.ts`'s comment.

**Checks (exit code each):**
- `npx tsc --noEmit`: rc 0.
- `npx vitest run src/table src/App.table.test.tsx`: rc 0, 21 passed.
- `npm run verify`, inside one shared hold: rc 0.
- `node scripts/plan/verify-cites.mjs` and `verify-quotes.mjs`: PASS, the combined run exited 0. Both print advisories about older files, none about this commit.
- Mutations: each was applied alone and its file's run failed the test by name. Reverts were `git checkout -- <file>` and the porcelain was shown clean.
  - PC-R2, drop `this.reset(this.filter);` in `end`: fails at `TableTab.test.tsx:162`, "expected ['1','north'] to deeply equal []".
  - PC-U4, `const exportHeld = false;` in `App.tsx`: fails at `App.table.test.tsx:240`, length 1 expected, got 2.
  - PC-U16, `isSessionEndedTerminal` matching only `engine.source_changed`: fails at `tableSource.test.ts:194`, callback not called.
- §7's command over `e5e6e03a`: 56 files, 2,527 lines of 4,248. No file passes its ceiling: table.mjs 417/480, App.table.test 276/450, WorkingCanvas 25, TableTab.test 178/200, tableConstants 31/40, tableSource 289/300, tableSource.test 198/320. I ran it as `git diff --cached --numstat e5e6e03a -- <the pathspec>` before the commit; the staged tree is the commit's tree, but I did not re-run it over `e5e6e03a...HEAD`.

**Things you should know:**
- My first PC-R2 mutation revert (`git checkout -- tableSource.ts`) also wiped my uncommitted edits to that file. I re-applied them, staged everything, and redid the PC-R2 mutation from the staged base. The figures above are from that second run.
- The mutations were observed by applying them and running the tests, not by `verify-mutation`.

**Pre-gate self-check:**
- Cross-module code uses the real interface: E1's types come from `PublishPanel.tsx`, and PC-U16 uses the real terminal detail.
- Every completion claim points to the evidence above.
- Every user-facing message describes behaviour at this commit: the ended line now states only the table's consequence.
- Every required test reaches its intended assertion: each mutation fails at a named assertion line.

No product caller or `pub` item was added. Nothing off-scope was done.
