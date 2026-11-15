Reviewed: PR #253 at 580d389e797381e466e00a4d239926baa9eb462a (gate 1 at ec95eacb), gate 2, architect. The cut/b1-shell-half-pr-c @ 580d389e797381e466e00a4d239926baa9eb462a
Verdict: PASS WITH NOTES

There is no Correctness or Evidence finding. C1 and E1 are closed at the head. The four Documentation findings below must be fixed before the merge, with no re-gate. None of them is the human's wording, so the worker or custodian applies these words and the PR body lists them. All path:line cites are read at 580d389e in `C:/dev/wt/m4c`.

## Gate 1 findings
- **C1: closed.**
  - `src/table/tableSource.ts:73` is now the architect's gate 1 line. It states only that the session ended and the table was cleared, and it is shown for both end codes (`streaming/liveTicketSet.ts:58-63`, `:80-85`).
  - In `tableSource.ts` the delta changes only `:27`, a comment, and `:73`. `TableTab.test.tsx` changes only the expected string at `:163`. Nothing else on the session-end path moved.
  - PC-U16 (`tableSource.test.ts:187-197`) drives the real `REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL` (`testUtils/terminalShapes.ts:40-44`) through the real source's sink. It uses the kind `ProducerFailed`, the same kind `liveTicketSet.test.ts:100` and `viewportStreamManager.test.ts:812` use. It asserts the callback, phase `ended`, count 0, and the line.
  - AC8 (`MANUAL-WALKTHROUGH.md:1983`) reads "after the dataset's session ended".
  - No e2e asserts the line: a search of `frontends/shell` finds it only in `tableSource.ts:73`, `tableSource.test.ts:196` and `TableTab.test.tsx:163`.
- **E1: closed.**
  - `App.table.test.tsx:14` imports the real `ExportRunEnd`, `ExportRunReport`, `PublishPanelHandle` and `PublishPanelProps` (`publish/PublishPanel.tsx:31`, `:38-41`, `:316-345`).
  - `onExportRunning` is required at `:339`, so `Pick<PublishPanelProps, "onExportRunning">` types the capture at `:22` and `:97-98` with no `undefined`.
  - `run()` at `:197-202` builds a typed `ExportRunReport`.
  - `:243` ends with `{ phase: "execute", outcome: { status: "unknown-attempt" } }`, which is a member of `ExecuteOutcome` (`publish/types.ts:87`).
  - The seam rule (round 4) is met.
- **Architect D1: applied as worded, but the words undercount** (new finding N1). `tableConstants.ts:19` is byte-equal to gate 1's D1.
- **Architect D2: applied as worded, but the words undercount** (N1). `KNOWN-LIMITATIONS.md:430` is byte-equal to gate 1's D2.
- **Architect D3: closed.** `WorkingCanvas.tsx:179` matches. The clauses hold: the call at `TableTab.tsx:74`, App's callback at `App.tsx:1401-1402` and `:2483`, and the read at `tableScope.ts:47`.
- **Architect D4: closed.** (a) `e2e/table.mjs:12` matches; the step switches scope, then applies the filter at `:289`, and asserts at `:293` and `:295`. (b) `e2e/README.md` matches; the old phrase count is 0.
- **Architect D5: closed.** `KNOWN-LIMITATIONS.md:421` matches `tableSource.ts:65`.
- **Architect D6: closed.** `tableConstants.ts:9`: 16,384 × 10,000 = 163,840,000 bytes, which is 156.25 MiB.
- **Architect D7: closed** by the reviewer's D3 words, which are byte-equal in the PR body's E2E first bullet and cover pan-anchor's exception.
- **Architect D8: placed** in Amendment 10 item 5 and its superseded index, but see N3.
- **Architect D9: closed.**
  - AC8 at `MANUAL-WALKTHROUGH.md:1983` has the gate's words, and the list still reads as a list.
  - The PR body's sight list names both strings.
  - Amendment 10 item 4 records the statement change. The statement is a P6 placeholder (`console/surfaceRegistry.ts:296`).
- **Reviewer D1 to D3: closed.**
  - D1: the PR body says six commits, and lists six.
  - D2: the body has the reviewer's words, plus a bc315fb9 parenthetical. The figures hold at bc315fb9 because `table.mjs` is a new file and its fix replaced one line. The delta's 10 files are all already in the 59.
  - D3: the words are byte-equal.
- **Reviewer D4: placed** in Amendment 10 item 5. Its facts hold:
  - the head-series report's rows 49-50 show both refusal runs with rc 1;
  - the re-run report's rows 69-70 show pan-anchor with rc 1 on both runs;
  - the follow-up report's rows 26-27 show 16 of 16 twice at ec95eacb;
  - in `table.mjs`, `NO_FURTHER_QUERY_MS` is at `:56` and the poll's own `10_000` at `:352`.
  - The class is wrong (N3).
- **Reviewer D5, D6 and D7: met** as Amendment 10 item 3 maps them, to the architect's D3, D4, and D1 with D2. The reviewer's D7 sentence target, `tableSource.ts:27`, is covered by the worker's sentence, which undercounts (N1).

## Documentation (must fix before the merge, no re-gate)

**N1. Three source comments say "two tickets", but repeated starts inside one round trip stack.** The case needs timing inside one request round trip, so under §31 it does not block and belongs in source comments. The comments name it with the wrong count.
- **Why it is wrong.** Each start bumps `run` (`tableSource.ts:118`) and takes `previous` from `handle`. `handle` is set only after the answer (`:140`), so it is null while a query is unanswered, and every start issues at once (`:126-127`, `:131`).
- Each unanswered query is cancelled only by its own continuation (`:136-137`). So k starts inside one round trip hold k+1 tickets, each holding a stream connection (`kernel/src/skp.rs:87-90`). That is the count KL item 56 is about.
- D1's and D2's words were mine at gate 1, and the reviewer's D7 had the same count.
- Replacement words follow. Each replacement is inside an existing line, so no line is added and §7 is unchanged.
  - **(a) `tableConstants.ts:19`.** Replace the span byte-copied from the head, `Not covered: a start made before the previous viewport_query has been answered issues at once, and the earlier ticket is cancelled when its answer arrives, so for that window the kernel holds two table tickets, each with a stream connection.`, with: `Not covered: a start made before the previous viewport_query has been answered issues at once, and each earlier ticket is cancelled when its own answer arrives, so until each answer arrives and its cancel lands the kernel holds one more table ticket for each such start, each with a stream connection.`
  - **(b) `tableSource.ts:27`** (the worker's words). Replace the span byte-copied from the head, ``A start made before the previous `viewport_query` has been answered issues at once and the earlier ticket is cancelled when its answer arrives, so for that window two tickets are held (`tableConstants.ts`'s comment on `TABLE_MAX_IN_FLIGHT`).``, with: ``A start made before the previous `viewport_query` has been answered issues at once, and each earlier ticket is cancelled when its own answer arrives, so until each answer arrives and its cancel lands, one more ticket is held for each such start (`tableConstants.ts`'s comment on `TABLE_MAX_IN_FLIGHT`).``
  - **(c) `KNOWN-LIMITATIONS.md:430`**, the source comment only; item 56's visible text is unchanged. Replace the span byte-copied from the head, `and a filter, scope or visibility change made before the Table's previous viewport_query is answered issues the next one at once, so until that answer arrives and its cancel lands the Table holds two tickets, each with a stream connection`, with: `and a filter, scope or visibility change made before the Table's previous viewport_query is answered issues the next one at once, so until each earlier answer arrives and its cancel lands the Table holds one more ticket for each query so issued, each with a stream connection`
- **Clause check for (a), (b) and (c):**
  - "issues at once": `tableSource.ts:119-120`, `:126-127`, `:131`.
  - "each earlier ticket is cancelled when its own answer arrives": each continuation compares its own `mine` (`:136`) and cancels its own `stream` (`:137`). Neither `cancel()` (`:167-176`) nor `start`'s `:125` can reach an unanswered ticket, because both act only on `handle`.
  - "one more … for each such start" and "for each query so issued": `:118` and `:131`, once per start. A hide or a scope change away from Filtered issues nothing (`TableTab.tsx:64`). A show, a filter change or a scope change back to Filtered starts again (`TableTab.tsx:63-67`).
  - "each with a stream connection": `kernel/src/skp.rs:87-90`.

**N2. The PR body is stale against the head in two places.**
- **(a) The carried texts.** "The carried texts, byte-copied from bc315fb9" and "KNOWN-LIMITATIONS items 54 to 56 … byte-copied from bc315fb9" present for the human's sight the `TABLE_MAX_IN_FLIGHT` comment and items 54 and 56. The delta changed all three: D1, D5, D2. The tree is authoritative, and the pin is now history.
  - Fix: after N1 lands, re-copy all four blocks by script from the commit that carries N1, and replace `bc315fb9` in both lead-ins with that commit's id.
  - Fix: update "in six commits" and the list to include that commit.
- **(b) The Evidence section** names no evidence for 580d389e, so PC-U16 is absent from the body. Add this bullet after the §7 bullet: `- At 580d389e (the fix worker's report, state/consults/2026-10-24-b1-shell-half-pr-c-gate1-fixes-worker-report.md): npx tsc --noEmit and npm run verify exit 0; PC-U16 is new, and PC-R2, PC-U4 and PC-U16 each fail by name under their one mutation.`
  - Clause check: the fix worker's report, its Checks list (tsc rc 0, verify rc 0, and the three mutations with their failing lines).

**N3. Amendment 10 item 5: the class, and the correction ceiling.**
- **The class.** Item 5 corrects claims: "None failed again …" and the settle-window clause. Template class 3 "Never changes a claim" (`docs/PREREGISTRATION-TEMPLATE.md`, class 3). A row recording what a gate round's findings invalidate is class 1 (round 15, item (g)).
- **The ceiling.** Item 5's first bullet has four sentences. The fourth restates Amendment 9 item 3's conclusion. That is past round 12, item (d).
- **Fix:** a row in PR C's closing amendment, with no edit to Amendment 10. Words: `Defect: Amendment 10 item 5 is filed as class 3, which never changes a claim, and its first bullet's fourth sentence restates Amendment 9 item 3's conclusion past the three-sentence ceiling (round 12, item (d)). Corrected reference: item 5 is class 1, a post-result record of what gate 1's findings invalidate (round 15, item (g)), and that fourth sentence is withdrawn. Proof: docs/PREREGISTRATION-TEMPLATE.md's amendment classes 1 and 3, and Amendment 10 item 5 as committed.` Then add to the superseded index: Amendment 10's heading and item 5, on the class only; item 5's first bullet, its fourth sentence.
- This is correction round 2 of 2 under the record cap.

## Other checks
- **Amendment 10 against both reports:** every C, E, D and S item of both is placed (items 1-7).
  - Classes: C1 and E1 are class 1; PC-U16 is class 4 (template class 4); item 4 is class 1, as D9 asked. Item 5 is wrong (N3).
  - Item 5's facts are true on the reports. Item 8.3 is true.
  - It has no quotation marks. It references, and does not quote.
- **PR body gates paragraph and sixth-commit line:** true at the head and on main.
- **The delta adds no product code path, callback or `pub` item.** The only new imports are type-only test imports.

**Not run (no shell):**
- `tsc`, `vitest`, the mutations and the verify scripts. I relied on the fix worker's report and the custodian's filing note.
- the sha256 of the patch and of the reports.
- the PR's CI at 580d389e.
- No ADR is needed.
