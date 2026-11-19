Reviewed: PR #335 at 5c913c1404beca5f730324e46f701a4a8807017e (the custodian's filing note, 2026-11-19: the reviewer alone, the first look's re-gate under ADV-2026-11-19-08 item 9 and ADV-2026-11-19-12 item 5, attempt 2; Bash 52, Read 5, none errored, model claude-opus-5-5, from 2026-11-19T08:48:37Z to 09:02:41Z by its transcript; the report below byte for byte from its hand-back of 15185 bytes, sha256 7091b551e69aa3646f7f30b28c0c3b73a609134970f1fec33c3aa4b4f5cc80ba, nothing masked, with this note in its first line and one final newline), gate, reviewer
Reviewed: PR #335 at 5c913c1404beca5f730324e46f701a4a8807017e, gate, reviewer, attempt 2 (cut/open-first-look-fills-fit-view @ 5c913c1404beca5f730324e46f701a4a8807017e)
Verdict: PASS WITH NOTES

I found no Correctness and no Evidence finding. C1 is closed at H2: after card B, E-AND again keeps "one row per commit, in order, `ok`". There are two Documentation findings, to fix before the merge with no re-gate. Neither is the human's wording.

The brief file `<S>`/brief-gflr2.md has sha256 c5e31ad39db560e0b9d2723a106b2ed7d0bbe1f7c041194904428f4a10f6bb0c (12683 bytes). The form at origin/main a4e047f6ebda6b7507d04d1672aa42c6e3d67a9a has sha256 e26ae8d0ee0c956548ad8eae8a0f96f693b443157f2c42d4945e05bd0c3b1fba (671 lines). H = e374eb711caaeae4dd898e8ddb49a35d4d80c619, H2 = 5c913c14…, F = e1fd84957b7ae042a075e7ccc5628a3de5670eb7. "(mine)" marks my own reading.

## Correctness
None.

## Evidence
None.

## Documentation (must fix before the merge; the worker applies the words and the PR body lists them)

**D1. The `watchConsole` doc comment, `frontends/shell/e2e/command-bar.mjs:396 at H2`.**
- Its opening, "Readings every 200 ms from the mark until stopped", reads as if the readings start at the mark. They start at `:483 at H2`, after card B's cards read as applied (`:482`). The mark is taken at `:479`, before card B is sent.
- Replace the whole line with:
  `/** Readings every 200 ms from this call until stopped, each numbering the entries from the mark. An entry is seen once a reading has rendered it; one unseen and already dropped is F2; the verdict is set at the first reading handled after `checked` that has seen every entry since the mark with the newest record_step row at ok. */`
- Clause check:
  - "from this call": the loop starts inside `watchConsole` (`:399-413`), which is called at `:483`.
  - "numbering the entries from the mark": `pos >= mark` (`:386`).
  - "seen once rendered": `:404`.
  - "F2": `:407`.
  - "handled after `checked`": `w.checked` is read when the result is processed (`:408`), and set at `:488`.
- It is the same line, so the numstat stays 64/7.

**D2. The C1 worker's second report (`<S>`/flc1r-rep-1.md, not yet filed) prints this project's own `project=` value in its unmasked hold and release lines.**
- Fix: when filing, write that value as `<m>`, as the first report's filing did.

## Observation (where the code and Amendment 5 item 3 differ; none weakens the property)
- O1, (b): a reading clicks closed groups only when its sum check passes (`:392-393`). A discarded reading clicks nothing.
- O2, (b): a reading also returns null when the label cannot be parsed (`:384`). An exception inside a reading (for example a group header with no digit, `:389`) ends the watch (`:410`) and fails the step with that error's text, not with F1 to F4 (`:488`). The step still fails.
- O3, (d): F2 is set at the reading (`:407`) but thrown only at the wait after the map checks (`:488`). If a map check fails first (`:486`), that line is reported instead of F2. The step still fails.
- O4, (e): the verdict comes from the first reading handled after `checked` (`:408`). That reading's `page.evaluate` may have been sent before `:488` ran. A `record_step` row recorded inside that one round trip falls outside the deciding reading. This needs timing inside one request round trip, so it does not block; I name it for the record.
- O5, (a): `consoleLabel` waits two animation frames, or 500 ms, before it reads the label (`:379`). The label can only trail the recorder, so mark ≤ the recorded count. Card B's row is recorded after `sendCondition` (`:480`), so it is always numbered at or above the mark. A trailing label can only over-count, which fails with F4 (mine).
- O6, item 67 (the advisor's words): "other than by the app's own cancel" is true on the reading that it covers the cancels the manager makes when the operator presses Cancel.
  - `relinquishFill` reaches `manager.relinquishOutstanding()` (`candidateArmSession.ts:261 at H2`).
  - That marks the handles self-cancelled (`tileViewportStreamManager.ts:822-828 at H2`).
  - `onTerminal` is then skipped (`:1105-1107`), so no session-log line is written.
  - Optional draft for the advisor: "When a tile's load ends, other than by a cancel the app makes (after your Cancel, for example), the app writes a line to the session log, and that write is an entry too."

## Checks
1. **Start (08:49:45Z).** `<W>` HEAD = H2, porcelain 0 bytes. `ls-remote` gave `5c913c1404beca5f730324e46f701a4a8807017e refs/heads/cut/open-first-look-fills-fit-view`. The fetch exited 0.
2. **The diff.**
   - H..H2 stat: 4 files, 70 insertions and 17 deletions.
   - numstat per commit: 8a58d91b `command-bar.mjs` 50/5; e2be4fd5 `command-bar.mjs` 1/0; 5c913c14 `KNOWN-LIMITATIONS.md` 4/4, `README.md` 1/1, `candidateArmSession.ts` 14/7.
   - F..H2 names only the three A4-3 paths plus `README.md` and `candidateArmSession.ts` (ADV-2026-11-19-08 item 9). `command-bar.mjs` is 64/7 (71, already recorded) and `project.mjs` 24/14.
   - `candidateArmSession.ts`, by my script: 21 changed lines, all 21 comment-shaped, 0 other.
   - A second proof: the TypeScript parser's printer with comments removed gives equal output for H and H2 (25676 = 25676, `equal true`).
     - Controls: one code token changed gives `false`; one comment changed gives `true`.
     - My first attempt used the raw scanner, which desynchronises on template literals (3019 against 3021 tokens). I discarded it.
   - So the no-run condition of ADV-2026-11-19-08 item 9 holds.
3. **C1.** Restored at H2.
   - The mark is read after card A's wait (`:479`).
   - The watch starts after card B's cards read as applied (`:482-483`).
   - Each reading numbers every entry from dropped + position, and discards itself unless the count sums to held (`:381-395`).
   - The watch collects every seen entry and every `record_step` row numbered at or above the mark (`:397-415`).
   - The decision: exactly one row at or above the mark, keyed `filter:` + `ZONE_AB`, at `ok`, else F4 (`:488-490`).
   - The tail comparison after card B is gone. Under M-X2 the run at e2be4fd5 failed F4 with n = 2 (check 9).
4. **Amendment 5 item 3, clause by clause.**
   - (a): `:479`; F1 text equal.
   - (b): start `:483`; every 200 ms `:411`; opens the Console and discards that reading `:383`; numbering `:385-391`; sum check `:392`; rows, `stepKey` and outcome `:386`, `:404`; clicks `:390`, `:393` (O1, O2).
   - (c): `:404`, where `Map.set` keeps the latest outcome read.
   - (d): `:405-407` (O3).
   - (e): `:408`, `:490` (O4).
   - (f): `:488-489`, 30 s from `checked`.
   - (g): `waitCommitted` (`:375`) and `readRecordStepRows` (`:354-365`) are unchanged in the diff, and `project.mjs` is not in H..H2. `:442-444 at H` are replaced.
   - (h): the templates of F1 (`:479`), F2 (`:407`), F3 (`:489`), F4 (`:490`) and PASS (`:497`) equal the declared texts. `read.last` is the verdict reading.
   - The DOM the reading relies on matches `ConsolePanel.tsx at H2`:
     - label `:64-68`, U+2014 on both sides;
     - `.console-disclosure` and `aria-expanded` `:72-85`;
     - `.console-entries` `:87`;
     - a group with its `×N` header and its rows when open `:113-131`;
     - `.console-entry-header` only on class-A rows `:164-165`.
   - Entries are kept oldest first and every drop is counted (`recorder.ts:282-288`, `:296`).
5. **The readings beside the wait change nothing the map checks read.**
   - The map checks read:
     - `settleMap`, which reads only `[render-trace]` console lines (`lib.mjs:334`, `:348-369`);
     - `capturePixels`, the deck framebuffer (`:343`);
     - `both`, read at `:482`, before the watch.
   - What the readings do:
     - They read the DOM and click buttons in the Console.
     - A click records a gui-action entry: push and notify only (`recorder.ts:263-271`).
     - The recorder's only subscribers are in the Console (`ConsolePanel.tsx:55`, `collapsedCountSync.ts:63`).
     - Render-trace lines come only from `diagnostics/renderTrace.ts`'s `console.debug` calls.
     - The Console sits in the Activity grid row of fixed height `var(--activity-h)`, with `overflow: auto`, and `.console-entries` has `max-height: 16rem` (`styles.css:34`, `:89-93`, `:1173-1181`). So an expanded group cannot resize the map.
   - The effect is timing only, and the worker's run passed in 29048 ms.
6. **The E-AND-b header line (`command-bar.mjs:40 at H2`)** is byte-equal to `//` plus 13 spaces plus the architect's Draft 3 (by script). It is true at H2:
   - `/filter` adds a card through `changeClauses` (`App.tsx:2125`), which commits `filter.clauses.set` (`:2085`).
   - Under the mutation only `filter.apply` records (`:1060`), so card A records no step.
   - The wait fails with the message at `command-bar.mjs:478`.
7. **The words, by diff** (one script, `<S>`/gflr2-words.out, rc 0). Every check below printed `true`:
   - Item 67 is byte-equal to ADV-2026-11-19-08 item 6's fence.
   - Item 64's line at H2 equals the line at H with the Old fence suffix replaced by the New one, and its paragraph is unchanged. No other line of `KNOWN-LIMITATIONS.md` differs (528 = 528).
   - README: Draft 4's Old phrase occurs once, H2 equals H with Draft 4 applied, and no other line differs.
   - `candidateArmSession.ts`: H with my D1, the architect's Draft 2 and my D3 applied equals H2, comment prefixes and line breaks aside.
   - There is no other difference.
8. **The clauses of items 67 and 64.** The one corrected first: "the Console holds little more than one load" is true, since 256 / 220 ≈ 1.16. In the unmutated run the label went from 256 held / 444 dropped to 256 / 672, so 228 entries were added and 28 of the earlier entries stayed. The other clauses:
   - 256 and drop-oldest: `recorder.ts:141`, `:282-288`.
   - The label shows the drops: `ConsolePanel.tsx:65-68`.
   - One request per minted tile, and each is an entry: `tileViewportStreamManager.ts:955`, `skp/client.ts:57`.
   - The session-log write is an entry: `diagnostics/log.ts:20-21`. It is written on every reported terminal: `candidateArmSession.ts:1020 at H2`. It is not written for the manager's own cancels: `tileViewportStreamManager.ts:1105-1107` (O6).
   - An opened group closes when its first entry drops: `ConsolePanel.tsx:96`, `:107`.
   - Item 64's sentence:
     - `latestUnionedExtent` comes only from `fitAnchor` (`:1150`).
     - `establishFrameFromExtent` returns on a null extent (`:1235`).
     - The block plans only with a frame (`:1508`), and the manager plans nothing without one (`tileViewportStreamManager.ts:525`).
   - The sentences applied in `candidateArmSession.ts` were re-cited at H2:
     - the fit: `WorkingCanvas.tsx:1571-1572`;
     - the frame set at the terminal: `candidateArmSession.ts:1430`;
     - the frame fixed once: `tileViewportStreamManager.ts:469`;
     - `hasPlanned`: `candidateArmSession.ts:1564`.
9. **The runs reused** (at e2be4fd5, whose paths to H2 are only the three comment and document files; exe last modified 2026-11-18T22:45:19Z). Byte-copied from `<H>`/out:
   - `a5b-command-bar`:
     - first line `worktree C:/dev/wt/fl head e2be4fd58b12ada0309b78ba0432fe547797f57b start 2026-11-19T08:19:50Z`;
     - `[E-AND] PASS (29048ms): A 4.4% non-bg (unfiltered 16.5%); A and B on: 0.00%, Applied the exact AND text, card B's commit added exactly one record_step row, at ok (Console after card A's wait: 256 actions, 444 dropped; after card B's map settled: 256 actions, 672 dropped); B off: 4.4%, Applied A's text`;
     - last two lines `This run launched the app; it stays RUNNING on CDP port 9223.` and `rc=0 end 2026-11-19T08:22:18Z`;
     - 14 PASS, 0 FAIL.
     - 700 → 928 is 228 added, not fewer than 220, so it does not go to the advisor. The 228 includes the reader's own clicks (`ConsolePanel.tsx:123`), so it is not one load's count (mine).
   - `a5-m1-command-bar`: first line at e2be4fd5, start 08:23:27Z; `[E-AND] FAIL (42146ms): E-AND: the newest record_step rows did not end with card A's step at ok before card B ([])`; `rc=1 end 2026-11-19T08:25:53Z`.
   - `a5-m3-command-bar`: start 08:26:46Z; `[E-AND] FAIL (18605ms): E-AND: card B's commit added 2 record_step rows, expected exactly one, at ok, carrying the combined text: [["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]`; `rc=1 end 2026-11-19T08:28:54Z`.
   - `a5-mx2-command-bar`: start 08:30:03Z; `[E-AND] FAIL (18847ms): E-AND: card B's commit added 2 record_step rows, expected exactly one, at ok, carrying the combined text: [["filter:\"zone\" = 'residential'","ok"],["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]]`; `rc=1 end 2026-11-19T08:32:08Z`.
   - Each mutation run: 13 PASS and 1 FAIL, the same last-but-one line, busy FREE, and app-down `port 9223 free`.
   - `a5-command-bar` at 8a58d91b: `[E-AND] FAIL (13457ms): parseLabel is not defined`; `rc=1 end 2026-11-19T08:05:47Z`.
   - The three mutation runs match Amendment 5 item 6's predictions.
   - `<S>`/flc1-vitest-mx2.log (no `rc=` line, not a harness log):
     - `× RC3` at `src/App.command.test.tsx:512:106`; `× RC5` at `:543:101`;
     - ` Test Files  1 failed (1)`; `      Tests  2 failed | 22 passed (24)`.
     - RC16 is in that file (`:638`), so it passed. This matches item 7.
   - Reproduced: none. I doubted nothing a run would settle: the M-X2 and M-A4-3 runs exercise the closed-group click path (two adjacent `record_step` rows), and F2's path is fail-safe by reading.
10. **CI (read at 08:59:05Z).** `gh pr checks 335`, rc 0: 8 checks, all pass. `gh run view` gives headSha 5c913c14… and `success` for all six runs: 44489768002 DCO, 44489767937 Exposure scan, 44489760757 and 44489768140 Ported notices, 44489760764 and 44489768083 Product CI — shell. None of these is red or cancelled. I did not list earlier runs on the branch: `gh run list` is outside the brief's network list. ADV-2026-11-19-08 item 10 carries the two earlier red runs to the closing.
11. **End (09:01:24Z).** `<W>` HEAD = H2, porcelain 0 bytes. `df`: C: 46G free, D: 362G free.

**The literal em dash.** Nothing in the repository requires `command-bar.mjs` to be ASCII. My search for ASCII rules found none that applies, and 15 other `e2e/*.mjs` files already carry non-ASCII. The file's two non-ASCII characters are U+2014 at `:376` and `:377 at H2`. The one at `:377` must be there: `LABEL` has to match `ConsolePanel.tsx:67-68`, whose dash is U+2014.

**Harness.** `sha256sum -c` printed ten `OK`. The exe sha256 is 5a347ec80c9fee3a964487bfd11e774adca1c6c9d9e3fad4149c909d0a2adcc5. I read `fl-e2e-run-suite.sh` and `fl-e2e-app-up.ps1` whole: vite serves `<W>`'s frontend on 5400, so a frontend mutation takes effect in the app.

**Not run.** Mutations: none. Probes: none. Holds: none, and I started no app. Every output of mine is in `<S>` under the `gflr2-` prefix. I made no write in the main checkout; its staged files are not mine.

**Drafts for the advisor:** O6's optional item 67 clause, above.

**Background shells:** none started, and I killed no process.

**Model:** Opus 5.5 (claude-opus-5-5).
