REPORT: node:b2-piece-1b-recording@g6, console.mjs re-aim.

NEW HEAD: 7b547f901cd873ff07f605a06d6b5993c29fb55c on cut/b2-piece-1b-recording, one `test:` commit, `git commit -s -F`, trailers as ordered. It is published to origin as an ordinary update (936b7982..7b547f90). Only frontends/shell/e2e/console.mjs changed (105 insertions, 55 deletions). I did not run any e2e suite, so neither re-aimed step has run.

COMMANDS AND EXIT CODES
- `git fetch origin`: 0. Head was 936b7982 with empty porcelain, as ordered.
- `node --check frontends/shell/e2e/console.mjs`: 0.
- `node scripts/plan/verify-cites.mjs` (foreground, timeout 600 s, output to a file): 0, PASS. It prints 38 loose-reference advisories, none naming console.mjs.
- `node scripts/plan/verify-quotes.mjs` (same): 0, PASS. It prints 1 advisory, none naming console.mjs.
- `git commit -s -F <file>`: 0.
- `git push origin cut/b2-piece-1b-recording` (own Bash call, not forced): 0.
- Final `git status --porcelain`: empty.
- Model as the harness reports it: Sonnet 5.5, claude-sonnet-5-5. No override, no context handoff.

CLASSC'
- Before: a style edit via `page.fill` produced a class-C row. The step asserted its "no API equivalent" statement, an "ADR-022" owner and no copy button.
- Now: it counts the class-A `record_step` rows whose request text is `style.set` / `fillColor` / `#112233`. It makes the same real edit (same tab click, disclosure expand and fill). It then polls with the existing `pollConsole` for a new such row, count above before, with last outcome `ok`. It also asserts that no class-C row with an "ADR-022" owner exists.
- Why this keeps its purpose: the step still shows that the console displays what a real style edit really wrote.
- I added a poll because `record_step` goes through the async step queue.
- Matching on the value filled and requiring the count to rise means an earlier row cannot satisfy it.
- The step's comment states the old and new assertion and the 2026-10-15 ruling.

GROUP'
- Before: three identical `queryWithFilter` calls, asserting the grouping of their three residential untiled `viewport_query` rows.
- Now: three real style edits to distinct fills (#223344, #334455, #445566), asserting the grouping of the resulting class-A `record_step` rows.
- Why the Apply route cannot group: each Apply writes a `record_step` row between its queries (`commitActiveFilter` enqueues on every issued Apply, with no dedupe), so those rows are never adjacent. Asserting the interleaved rows would prove no coalescing at all.
- Why this re-aim: a style edit writes exactly one class-A row (`record_step`) and no query, so three edits give three adjacent same-key rows. The grouping key for class A is the command, so rows with different request text still coalesce.
- Assertions kept, with the window predicate swapped:
  - presence: poll for baseline plus 3 `style.set` rows, with no collapsed group in the window;
  - capacity;
  - group: header `×N`, N at least 2, one key;
  - split run;
  - "grouping not exercised";
  - parse.
- Not weakened: if nothing coalesces, the "grouping not exercised" failure still fires.
- `baseRes` is the count of earlier `style.set` rows, which includes CLASSC''s edit. The old requirement of a zero baseline is gone, because CLASSC' legitimately leaves one row. The window expects baseRes plus 3.

MUTATIONS FOR THE CUSTODIAN TO OBSERVE (recorded in the step comments, marked "not yet observed")
- CLASSC': in `src/App.tsx` `handleStyleCommit`, remove the `stepQueue.enqueue` in the loop. Expect `CLASSC': no new class-A record_step row ... reached ok`.
- GROUP': in `src/console/consoleViewModel.ts` `groupConsecutiveEntries`, stop coalescing so every entry is its own item. Expect the `GROUP': grouping not exercised` name.

DECISIONS FOR THE HUMAN'S SIGHT (the full diff above shows them)
1. I replaced the file-header GROUP' paragraph (lines 22-31). It described the old Apply rows and would have been false. It is a comment only.
2. CLASSC''s earlier recorded mutation ("OBSERVED AT 65391e79...", the owner string change) is replaced by the new to-be-observed one. The old one no longer applies to the new assertion.
3. `windowOf` and `isResidentialUntiled` are untouched but now unused, and so are `RESIDENTIAL_PREDICATE` and `callOpenPath`, if nothing else uses them. The step defines its own local `styleWindow` and `isStyleStep` instead. This follows the "no shared helper changes" rule. Removing the dead helpers is a separate decision.
4. GROUP' also expands the style tab and disclosure itself, mirroring CLASSC'. It does not rely on CLASSC' leaving them open.
5. The `.requestText` and `intent.params` shape assumed in the matchers comes from `RecordStepRequest` in `skp/types.ts`. It is unproven until the e2e run reads a real row.

OFF-SCOPE NOTICED, NOT DONE
- The preregistration Amendment 6 says "each issued Apply writes one between grouped queries". I did not edit the record.
- Run 1's output shows a `b:` session-log row between queries. If one lands among the three style rows, it would split the run and fail GROUP'. I expect none, since a style edit triggers no query.
