*Filed by the custodian: the architect's hand-back (claude-opus-5-5), 18588 bytes, sha256 bc32a2499ef7c193e45d192c6933e5f189d98bc9da57d24c85c8d4c79dc655a6, below the rule with one final newline added; calls Read 37, Grep 38, Glob 6, none errored, from 2026-11-19T03:10:05Z to 03:22:35Z. A diagnosis and a draft, read only, at main 3d94561d and the first look's head e1fd8495; nothing in it is ruled by its filing, and the advisor rules the draft Amendment 4 and its packet A4-1 to A4-7 before any code.*

---

Diagnosis: open-first-look-fills-fit-view S9 failures at e1fd84957b7ae042a075e7ccc5628a3de5670eb7, architect

Reviewed: `cut/open-first-look-fills-fit-view @ e1fd84957b7ae042a075e7ccc5628a3de5670eb7` (F, read from the branch ref file). The base is `cut/selection-export-unknown-attempt @ 9a4c58332661b6fd69fb477b1184f0147f38df2b` (the `C:/dev/wt/sel` tree). Main is at 3d94561d50dc9bebd7f8346cf8d9cdbfeb3634dc.

**Verdict.**
- **Correctness:** no finding in the shipped code.
- **Evidence:** blocking. Two suites fail at F the same way every time, and the cause is known (below).
- **Documentation:** §5's table is wrong for two suites. Must be fixed before the merge, by Amendment 4.

Gaps in my reads:
- **No shell.** I confirmed F and the base from `.git` ref files only.
  - I did not confirm the diff counts (10 paths, 694 added, 23 deleted).
  - I did not confirm that nothing under `frontends/shell/src` changed between 349cec82 and f5584f28. I spot-checked two things only: `console/recorder.ts:141` and `:284` are the same at the base; `shownViewportBbox` and `candidate-first-look-view-planned` are absent from the base's `src`.
- **Evidence files I did not open:** the harvest files, the app stderr/stdout, vite stderr and results JSON of the S9 runs, the console ledger JSONs, `<S>/flb-1.md`, and `<S>/fl9-s9-project-2.session.log` and `<S>/fl9-s9-command-bar-2.session.log` (I took only grep counts from these two).
- **Code I did not read whole:** `console.mjs`, `regression.mjs` (K7), `selection.mjs`, `recording.mjs`, `colour.mjs`, `table.mjs`, `console/render.ts`, and `StepIntent` in `skp/types.ts`.
- **Constitution I did not read in full:**
  - ADR-010: only its rules table (rows 95 to 101), not each rule's own text;
  - docs/01: only principles 4, 7 and 8, at lines 10, 13 and 14.
- **Records I did not read:** the KNOWN-LIMITATIONS item 64 and 51 drafts, and the walkthrough rows of §10.2.
- **No reuse index.** The brief carried none, so the draft below leaves a slot for the custodian.
- **The console's entry count at each read cannot be rebuilt.** The project ledger is the CDP console, not the recorder; I rely on the tester's report for that and did not open it.

---

## 1. The cause

**Where the two paths part:** the untiled sink's `onTerminal`.
- **At the base,** S1's block ends and `syncScanLiveness()` follows (`candidateArmSession.ts:1468-1476` at base). Nothing plans tiles until the camera moves.
- **At F,** a new block follows S1's (`candidateArmSession.ts:1490-1505` at F). At every `Completed` first look it calls `handleViewportChange(box)` (`:1503` at F). That calls `manager.onCameraChange` (`:1548` at F).
- **Each planned tile is minted by `viewportQuery`** (`streaming/tileViewportStreamManager.ts:955` at F; an abandoned mint also sends `cancel`, `:1014` at F).
- **Every `viewport_query`, `cancel` and `record_step` call goes through the console's one capture point:** `call` → `consoleRecorder.record` (`skp/client.ts:57`, `:117`, `:131`, `:144` at F).

**The console keeps only the last 256 entries.**
- `MAX_CONSOLE_ENTRIES = 256` (`console/recorder.ts:141` at F).
- When it is full, `push` drops the oldest entry (`:282-288` at F). `this.buffer.shift()` at `:284` is the only way an entry ever leaves.
- So a `record_step` row can only disappear from the console when the ring overflows.

**Traffic at F.** In `<S>/fl9-s9-command-bar.session.log`, three first looks are each followed by 110 tile terminals:
- the Clear at E-AND's start (`:137-139`), with its tiles at lines 140 to 252 (113 lines less the pool polls at 143, 185 and 223);
- card A (`:257-259`), with its tiles at lines 260 to 372 (less 278, 308 and 354);
- card B (`:376-377`), with its tiles at lines 379 to 490 (less 417 and 457).

Line `:377`, byte-copied: `1795054141208 candidate-first-look-view-planned {xmin:2599779.6096260287,ymin:1199346.3530761313,xmax:2602019.9939040802,ymax:1201734.3075760899}`.

So between A's `record_step` and the read after B, the console received at least 222 entries: A's fill (110), B's untiled query (1), B's `record_step` (1) and B's fill (110), plus cancels and the suite's own console clicks.

**Traffic at the base.** `<S>/flb-base2-command-bar.session.log` lines 5 to 102 show only untiled looks (20 of them). The first tile terminal is at `:118`, after a camera change.

**E-AND fits this exactly.**
- At F, `<H>/out/fl-e2e-s9-command-bar.log:13`, byte-copied: `[E-AND] FAIL (49669ms): E-AND: after card B was added the console holds 1 record_step rows against 1 + 1, the last carrying the combined text: true`
- B's row is there, `ok` and last. A's row is gone. Single rows never sit inside a group (`ConsolePanel.tsx:109-110` at F), so it is not hidden in a collapsed group. It was dropped from the ring.
- The step's check is `command-bar.mjs:432-433` at F.
- At the base, `<H'>/out/flb-e2e-base2-command-bar.log:13` (where `<H'>` is `<S>/flb-e2e-h`): `[E-AND] PASS (14208ms): A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, one more record_step row reached ok; B off: 4.4%, Applied A's text`

**STYLE fits this too.**
- At F, `<H>/out/fl-e2e-s9-project.log:7`: `[CLAUSES] PASS (7737ms): three clauses, the second off; the Filter section reads Applied: ("zone" = 'residential') AND ("zone" IS NOT NULL); 4 record_step rows reached ok`
- Then `:8`: `[STYLE] FAIL (30273ms): STYLE: waited 30000ms for at least 5 record_step rows, all ok (after the opacity); the last reading was ["ok","ok"]`
- Four rows fell to two. The only removal path is `recorder.ts:284`.
- Clause B's fill, between those reads, is 110 tile terminals: `<S>/fl9-s9-project.session.log:195-306`, less the polls at 234 and 278.
- At the base, `<S>/flb-base2-project.session.log` has no tile terminal before `:26`.
- The checks are `project.mjs:188-196` and `:243` at F.

**The suites' own reads speed the dropping up** (my reading of the code, not observed in a trace).
- Each poll clicks every collapsed group header (`command-bar.mjs:359`, `project.mjs:179` at F).
- Each click writes a console entry (`ConsolePanel.tsx:123` at F). `console.mjs:829` at F asserts "one group-header click wrote 1 entry".
- A group is keyed by its first entry's seq (`ConsolePanel.tsx:96` at F). When that first entry is dropped, the group comes back collapsed (`:107`), the next poll clicks it again, and that click drops one more entry.
- This is why the failure is the same every time and does not depend on load: it failed at loads 68,74,77 and 7,17,12, and the base passed at 93,94,77 (`<S>/flbr-1.md:40`).
- I4 is not engaged.

**Shipped code or harness?** The extra traffic is shipped code, and it is the piece's intended plan: §2.1, and E-FL's (a) "42 further stream-issued line(s)". The ring's dropping is shipped code working as declared (`recorder.ts:133-141` at F). What is wrong is in two test files: they count every `record_step` row since the open, assuming the ring keeps them all. The canvas member `WorkingCanvas.tsx:1636-1642` at F only reads and is not involved.

**What a user sees** (my paraphrase of `ConsolePanel.tsx:62-68` and `:96-130` at F):
- right after an open, the Console holds one `×N` `viewport_query` group, N being the fit view's cover (110 on `filter-zoned.parquet` at the suites' window);
- after about two more Applies or Clears, the oldest rows, earlier `record_step` rows among them, leave the ring, and the label reads `Console — 256 actions (N dropped)`;
- an expanded first group collapses each time its first entry is dropped (this was already so at the base, but is now reached right after an open);
- nothing else changes: every step reached the kernel (each row read `ok`), and the map, the filter, the style, the status and the session history are unaffected.

No ADR-006 class is involved, because the kernel's history is not touched (ADR-006, the Decision table, rows "Workspace mutations").

## 2. What else it reaches

**Shipped paths that go through the same block:** every first look that ends `Completed` with no plan:
- the open;
- an Apply and a Clear (`commitFilterChange`, `App.tsx:1054-1063` at F);
- the Colour-by refill;
- the reopen after a source change;
- a project's open.

Each one now puts its cover's `viewport_query` entries into the console at once, plus a `cancel` for each abandoned mint.

**Other S9 results this mechanism could reach:**
- **Passed at F; product unchanged by the recommended fix, so they stand:**
  - `recording.mjs`: exact row count, `:158-170` at F;
  - `colour.mjs`: waits until the count is stable, `:341-343` at F;
  - `table.mjs` `classARows`: `:166-179` at F;
  - `selection.mjs`: the last open/close row, `:635-641` at F;
  - `console.mjs`: GROUP's capacity check, `:734` at F.
  - `recording.mjs` is the closest to the edge: one open fill plus one Apply fill, against exact counts.
- **Not this mechanism:**
  - E-FL and recentre-crossing (they count wire lines, not console rows);
  - selection's four `unknown-attempt` failures;
  - `source-changed-post` rc 3 (PR B had the same).
- **Not diagnosed:** `console`'s first-run REGRESS' failure, through the nested K7. That is a residency-status wait, not a console count. It passed in the standalone regression run and in `console-2`.

**Must re-run at the fixed head:** only `command-bar.mjs` and `project.mjs`, if the fix changes only e2e files.

## 3. The fix, smallest first

**Option 1 (recommended): read the newest rows by their content, in two suites.**
- **Files:**
  - `e2e/command-bar.mjs`: `stepAnd`'s two record-row waits (`:422-433` at F);
  - `e2e/project.mjs`: `readRecordStepRows`, `waitRecorded`, `stepClauses`, `stepStyle` (`:174-196`, `:218-248` at F).
- **The rule:** each suite keeps the list of steps it has committed, in order. After each commit it waits until:
  - the console's `record_step` requests end with the tail of that list (the tail as long as the rows read), and
  - the last row is `ok`.
- **What it keeps:** order and "exactly one per commit", since a duplicate breaks the tail. Rows dropped from the oldest end no longer matter.
- **Catching test:** E-AND and STYLE at the fixed head. The old counting reading was already observed failing at F (S9, then the re-runs).
- **Mutations** (frontend only; vite serves the worktree, so the exe is not rebuilt):
  - M-A4-1: delete `App.tsx:1060` at F'. E-AND fails after B (CLAUSES fails first in `project`).
  - M-A4-2: delete the loop at `App.tsx:2051` at F'. STYLE fails after the opacity.
  - M-A4-3: send the `App.tsx:1060` step twice. E-AND fails on the tail: this shows "exactly one" is kept.
- **Cost:** two files outside §7's table, so class 9, declared before code. Ceilings, added plus removed, against F: `command-bar.mjs` 30, `project.mjs` 40. §7's table is not edited.
- **Changes to other claims:**
  - §5 gains three rows;
  - §11 item 11 is read as not engaged (see item 6 of the draft);
  - the README entries stay true by my reading: E-AND at `e2e/README.md:802` at F ("adds exactly one `record_step` row that reaches `ok` and carries that text") and STYLE at `:844` at F ("each followed by its row at `ok`").

**Option 2: Option 1 plus `recording.mjs`'s `waitForRecordedRows` (`:158-170` at F).** Roughly 20 more lines, one more file (class 9), and one more run. It removes the remaining near-edge suite. Not needed for S9 to pass.

**Option 3 (rejected): keep tile queries out of the console.** This breaks docs/01 principle 4, at line 10 ("Every GUI action has an API equivalent — and shows it (03, action console)"), principle 8, and the console's single capture point (`client.ts:49-57` at F). It is also a product file outside §2.1.

**Option 4 (rejected): raise `MAX_CONSOLE_ENTRIES`.** It is a product file outside §2.1 and a declared bound, and it only moves the threshold: four fills of 110 pass any small raise. It would need its own form.

## 4. The form

**Made untrue:**
- §5's last row, "the rest of `package.json`'s suites … settle later | no", is false for `command-bar.mjs` (E-AND) and `project.mjs` (CLAUSES and STYLE). §5's rule "a change not in this table stops the piece" makes this I7 at S9.
- Amendment 2 item 12 (a) and (e) stay true of what was read: the miss is in two suites that were read only in part.
- §3, §4, P-base, P-head, §10.1 and §10.3 are untouched, by my reading. I did not read the drafts of items 64 and 51.

**Records voided:** none of S1 to S8.
- S9 stands for the other 21 suites, E-FL and recentre-crossing.
- Its `command-bar` and `project` rows are re-classed from "as seen" to I7.
- The re-runs report's reading of `s9-command-bar-2` as the I4 re-run is withdrawn: the failure does not depend on timing.

---

## Amendment 4 — step S9 stopped on I7: each first look's fill now goes into the console's 256-entry ring, so `command-bar.mjs` E-AND and `project.mjs` STYLE count `record_step` rows the ring has dropped; both suites read the newest rows by their content, declared here (class 9)

*Drafted by the architect (claude-opus-5-5), read only, at main 3d94561d50dc9bebd7f8346cf8d9cdbfeb3634dc and at F = e1fd84957b7ae042a075e7ccc5628a3de5670eb7, for the advisor's ruling; appended by the custodian's script after it. Code is cited by symbol and line at F. Reuse index: [the custodian's line, byte-copied and marked]. It changes no product file, no test of §4 and no prediction of §5.*

1. **The stop.**
   - S9 at F failed `command-bar.mjs` E-AND and `project.mjs` STYLE twice each, with the same line each time. The reports are `state/consults/2026-11-19-open-first-look-fills-fit-view-s9-series-at-e1fd8495-tester-report.md` and `state/consults/2026-11-19-open-first-look-fills-fit-view-s9-re-runs-at-e1fd8495-tester-report.md`.
   - At the base, 9a4c58332661b6fd69fb477b1184f0147f38df2b, both suites passed once (`<S>/flbr-1.md`).
   - These are assertions not in §5's table, so this is I7. I4 is not engaged.
2. **The cause.**
   - The block (`candidateArmSession.ts:1490-1505`) plans the cover at every `Completed` first look.
   - Each tile is minted by `viewportQuery` (`tileViewportStreamManager.ts:955`). Every call is recorded in the console (`skp/client.ts:57`).
   - The console's ring drops its oldest entry when it holds 256 (`console/recorder.ts:141`, `:284`).
   - Evidence: in `<S>/fl9-s9-command-bar.session.log` the fills at `:140-252`, `:260-372` and `:379-490` hold 110 tile terminals each; in `<S>/fl9-s9-project.session.log` the fill at `:195-306` holds 110.
3. **What a user sees.**
   - After an open, and more after each Apply or Clear, the Console fills with the fill's `viewport_query` rows.
   - Older rows leave, and the label shows them as dropped (`ConsolePanel.tsx:65-68`).
   - Steps still reach the session history. No string changes.
4. **The fix (class 9, declared here before its code).**
   - `e2e/command-bar.mjs` `stepAnd` and `e2e/project.mjs` (`readRecordStepRows`, `waitRecorded`, `stepClauses`, `stepStyle`) read each `record_step` row's request and outcome.
   - After each commit they wait until the rows' requests end with the tail of the steps the suite has committed, in order, and the last row is `ok`.
   - Ceilings, `git diff --numstat` against F, added plus removed: `command-bar.mjs` 30; `project.mjs` 40.
   - No other file changes, except the records. §7's table is not edited.
5. **§5's table gains three rows, "changed; observed":**
   - `command-bar.mjs` E-AND;
   - `project.mjs` CLAUSES;
   - `project.mjs` STYLE.
   - Each with the cause of item 2.
6. **§11 item 11 is not engaged.** No tolerance changes, and no prediction changes. The property each step asserted is kept: one row per commit, in order, `ok`. Item 7's mutations show that it still fails. Both gates check this.
7. **Mutations.** Each is applied by hand on the frontend, its suite is run whole, the failing line is recorded with its commit id, and it is reverted with the porcelain empty. None is committed. A `verify-mutation` run is a check of a mutation's text, not its observation.
   - **M-A4-1:** delete `App.tsx:1060`. Expect E-AND to fail after B, and CLAUSES to fail.
   - **M-A4-2:** delete the loop at `App.tsx:2051`. Expect STYLE to fail after the opacity.
   - **M-A4-3:** enqueue the `App.tsx:1060` step twice. Expect E-AND to fail on the tail.
8. **The worker's steps** (the Sonnet worker, ADV-2026-11-18-16 item 7 (b)):
   - (a) Read the real request text of a `record_step` row (`console/render.ts`; `StepIntent` in `skp/types.ts`) before writing any matcher.
   - (b) Commit item 4's edits as F'.
   - (c) Run both suites whole at F', each in its own shared hold, with the S9 debug exe and its sha256 checked.
   - (d) Run item 7's three mutations.
   - (e) Report each run's lines byte-copied, with the commit ids.
9. **The custodian's steps:**
   - commit this amendment after the ruling;
   - dispatch item 8;
   - file the report;
   - give the reviewer `git diff --name-only e1fd8495 F'`;
   - the closing names F', the two runs and the three mutations by reference.
10. **The runs at F'.**
    - Only `command-bar.mjs` and `project.mjs` run. The product and the exe are unchanged, so S9's other results stand at F' by that diff.
    - Prediction: both exit 0, and each mutation fails as item 7 says.
    - A failure of E-AND, CLAUSES or STYLE at F' is I7 again. It goes to the advisor, with no second run.
11. **Budget.** `budget_minutes` goes from 440 to 500, my estimate. §7's table is not edited.
12. **Superseded index.**
    - §5's last row, as it read for `command-bar.mjs` and `project.mjs`: by item 5.
    - The S9 series report's "as seen" for those two suites, and the re-runs report's reading of `s9-command-bar-2` as I4: by item 1.
13. **Packet for the advisor.**
    - **A4-1, the fix:** Option 1, the two suites (recommended); Option 2 adds `recording.mjs`; Options 3 and 4 are rejected.
    - **A4-2:** confirm item 6's reading of §11 item 11 (recommended: confirm).
    - **A4-3, the runs at F':** the two suites only (recommended), or the whole series again.
    - **A4-4:** base runs of the edited suites: none (recommended; item 7 shows the strength), or one each.
    - **A4-5:** `console`'s REGRESS' through K7 stays as the custodian classed it. It is not diagnosed here.
    - **A4-6:** the group that collapses when its first entry is dropped is reached right after an open now. Recommended: a proposed node, not this piece.
    - **A4-7:** a note on walkthrough rows AA1 and AA2: none (recommended; AA1 stays true by my reading), or a note in the advisor's words.

Read the last amendment first.

Nothing above is edited.
