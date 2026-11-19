*Filed by the custodian: the architect's hand-back (claude-opus-5-5), 14727 bytes, sha256 c68cd94a6b48d1f436f83c72d036d4d239ac44a75a21a1494cb49d825d440922, below the rule with one final newline added; calls Read 23, Grep 22, Glob 1, SubagentHandback 1, none errored, from 2026-11-19T06:50:31Z to 2026-11-19T07:03:29Z. A draft, read only, at main 65a72f72 and the first look's head e374eb71, under the advisor's ruling ADV-2026-11-19-08 item 3; nothing in it is ruled by its filing, and the advisor rules it before any code or run. The custodian's departure: the architect's brief carried no reuse.mjs output. The custodian ran it after the hand-back, from the reuse clone, with the words console ring dropped entries sequence e2e record step count; it exited 1 and printed this line, byte-copied: No prior art recorded for "console ring dropped entries sequence e2e record step count". Research it before planning an implementation.*

---

Draft: open-first-look-fills-fit-view Amendment 5 (C1), architect, at e374eb711caaeae4dd898e8ddb49a35d4d80c619
Branch read: cut/open-first-look-fills-fit-view @ e374eb711caaeae4dd898e8ddb49a35d4d80c619. The read checkout C:/dev/wt/fl-ga has HEAD = H; I read that from `.git/worktrees/fl-ga/HEAD`. I ran nothing and changed no file.

H = e374eb711caaeae4dd898e8ddb49a35d4d80c619 and F = e1fd84957b7ae042a075e7ccc5628a3de5670eb7. Any reading not marked "(mine)" is a citation.

## 1. The advisor's readings, checked at H

**Item 2 (a): holds.** `frontends/shell/e2e/command-bar.mjs:375 at H` takes `Math.min(r.length, committed.length)`. The reviewer's lines (C1, "Fix proposal") only unshift into `committed`, so the min stays. Take M-X2's rows P, A, A', AB under those lines. Once the Console no longer holds A, and so not P either, the rows held are [A', AB]. Then n = 2 and the check compares against [A, AB], which passes.

**Item 2 (b): holds.**
- Each tile is one `viewportQuery` (`frontends/shell/src/streaming/tileViewportStreamManager.ts:955 at H`), and that call goes through `call` (`frontends/shell/src/skp/client.ts:117`, `:57 at H`). So each tile is one entry.
- Each tile terminal calls `logSessionEvent("candidate-tile-terminal", …)` (`frontends/shell/src/residency/candidateArmSession.ts:1016 at H`). That records its own entry (`frontends/shell/src/diagnostics/log.ts:20-21 at H`).
- On M-A4-3: the failure text prints `.slice(-3)` (`command-bar.mjs:444 at H`), and the reviewer's line shows two pairs. So its last reading held exactly two `record_step` rows, against four recorded. That is consistent with the drops. It does not prove them (mine).

**Item 2 (c): holds.**
- A group click records `console.toggleGroupExpanded` (`frontends/shell/src/console/ConsolePanel.tsx:123 at H`).
- The reader clicks every closed group at every poll (`command-bar.mjs:359 at H`).
- A group's key is its first entry's `seq` (`ConsolePanel.tsx:96 at H`). Its open state is `useState(false)` (`:107 at H`). So when the first entry is dropped, the group remounts closed.

**Item 2's closing paragraph: holds for the reviewer's lines.** One thing is mine: the code does not fix where A's row falls relative to A's load. The step is enqueued at the issued outcome (`App.tsx:1050`, `:2085 at H`), and the tiles come at the first look's terminal. This does not change the conclusion.

**Fact 1 (label = held and dropped; their sum is every entry since start): holds, with two qualifiers.**
- The label is at `ConsolePanel.tsx:64-68 at H`.
- Every record path increments `nextSeq` and pushes. `push` shifts once and counts one drop when the ring is full (`frontends/shell/src/console/recorder.ts:205-213`, `:237-245`, `:263-271`, `:282-288 at H`). So held + dropped = `nextSeq`.
- Qualifier: "since the app started" means since this page load. The recorder is a module singleton (`recorder.ts:339 at H`).
- Qualifier: the label can trail the recorder by one animation frame (`ConsolePanel.tsx:53-55 at H`).
- The label and the rendered entries are set in the same `sync` (`:48-52 at H`), so within one render they agree.

**Fact 2 (no sequence number on the page): holds.** `seq` is used only as a React key (`ConsolePanel.tsx:96`, `:130 at H`). No row renders it (`:160-206 at H`). But the label plus each row's position gives one (my answer to (a)).

**Fact 3 (two `record_step` rows side by side are hidden until opened): holds.**
- Rows are grouped by kind and command (`frontends/shell/src/console/consoleViewModel.ts:160-189 at H`).
- A group of two or more renders a `×N` button, closed, and shows its entries only when open (`ConsolePanel.tsx:113-131 at H`).
- A single entry renders with no wrapper (`:109-111 at H`).

## 2. The amendment

````
## Amendment 5 — C1: `command-bar.mjs` E-AND after card B counts the `record_step` rows recorded since a mark taken from the Console's label, and fails where it cannot tell (class 9)

*Drafted by the architect (claude-opus-5-5), read only, at main 65a72f7243d205e519f194de1b9175dd669286fd and at H = e374eb711caaeae4dd898e8ddb49a35d4d80c619, for the advisor's ruling (ADV-2026-11-19-08 item 3); appended by the custodian's script after it. Code is cited `<path>:<line> at H`. Reuse index: [slot: the custodian's line, byte-copied and marked]. It changes no product file, no test of §4 and no prediction of §5. "(mine)" marks the architect's choices.*

1. **The finding.** The reviewer's gate report at H (`state/consults/gates/2026-11-19-open-first-look-fills-fit-view-gate-reviewer.md`), C1 and check 8's M-X2 line; ADV-2026-11-19-08 items 1 and 2. §11 item 11 is not engaged (ADV-2026-11-19-08 item 4).
2. **What the code gives.**
   - Label: `frontends/shell/src/console/ConsolePanel.tsx:64-68 at H`. Held + dropped = entries recorded since the page loaded: `frontends/shell/src/console/recorder.ts:205-213`, `:282-288`, `:339 at H`.
   - Label and rendered entries come from one update: `ConsolePanel.tsx:48-52 at H`.
   - Order and groups: `recorder.ts:300-302`, `frontends/shell/src/console/consoleViewModel.ts:177-189`, `ConsolePanel.tsx:106-131 at H`.
   - Hence (mine): in one reading, counting a closed group as its `×N`, the entry at position k is entry number dropped + k.
3. **The reading after card B** (class 9, declared before its code; mine).
   - (a) Mark: after card A's wait (`frontends/shell/e2e/command-bar.mjs:433-434 at H`, unchanged), one read of the label; mark = held + dropped. An unparsable label fails with F1.
   - (b) Readings: after `command-bar.mjs:439-441 at H`, one `page.evaluate` every 200 ms, for at most 30 s. Each one: opens the Console if it is closed, and discards that reading; numbers each rendered entry by item 2; discards the reading if the entries and `×N` counts do not sum to held; returns each rendered `record_step` row's number, `stepKey` (`:368-373 at H`) and outcome; in the same call, clicks each closed group that holds an entry numbered at or above the mark.
   - (c) An entry is seen once a reading has rendered it. A row's outcome is the latest one read.
   - (d) An entry numbered at or above the mark that is unseen and below the reading's dropped count fails the step with F2. The step never passes on what the Console still holds.
   - (e) At the first reading in which every entry from the mark up to the reading's total has been seen, and the newest `record_step` row at or above the mark is `ok`: the rows at or above the mark must be exactly one, keyed `filter:` + `ZONE_AB`, at `ok`. Otherwise F4.
   - (f) If no such reading comes within 30 s: F3.
   - (g) Unchanged: card A's wait (`waitCommitted`, `:375 at H`), `readRecordStepRows` and `project.mjs` (ADV-2026-11-19-08 item 5). Replaced: `:442-444 at H`.
   - (h) Texts (test strings):
     - F1 `E-AND: the Console's label could not be read after card A's wait (<text>)`
     - F2 `E-AND: cannot tell how many record_step rows card B's commit added: entry <n>, recorded after the mark at <mark>, was dropped before it was read (label after card A's wait: <held> actions, <dropped> dropped; now: <held> actions, <dropped> dropped)`
     - F3 `E-AND: within 30000ms of card B's map settling no reading had read every entry since the mark with a record_step row since it at ok (<last reading>)`
     - F4 `E-AND: card B's commit added <n> record_step rows, expected exactly one, at ok, carrying the combined text: <[[key, outcome], ...]>`
     - In the PASS text (`:451 at H`), `one more record_step row reached ok` becomes `card B's commit added exactly one record_step row, at ok (Console after card A's wait: <held> actions, <dropped> dropped; after card B's map settled: <held> actions, <dropped> dropped)`. The second pair is the first reading of (b).
   - (i) Why order needs no timing (by reading): the mark is read before `sendCondition` for B (`:435 at H`). The queue sends one step at a time, and the next step is recorded in the same task that resolves the one before (`frontends/shell/src/workspace/stepRecorder.ts:52-60`, `frontends/shell/src/skp/client.ts:57-60 at H`).
4. **Ceiling.** `command-bar.mjs`: 60 added plus removed, `git diff --numstat` against F, the words commit included (mine); this supersedes Amendment 4 item 4's 30 for this file. `project.mjs`: 40, not edited. No other path but the words commit's two (ADV-2026-11-19-08 items 8 and 9).
5. **Unmutated run.** E-AND passes with 3(h)'s PASS text. It decides if the first reading after card B's map settles has dropped at most the mark, and each closed group then holding an entry after the mark is still held at the next reading. Prediction: it decides; not measured. With ADV-2026-11-19-08 item 6's floor of 220, at most 36 entries are left for the rest (mine). F2 here is I7: it goes to the advisor with the four numbers, with no second run.
6. **Mutations** (as Amendment 4 item 7; a `verify-mutation` run is a check of a mutation's text, not its observation).
   - M-A4-1 (`App.tsx:1060 at H` deleted): fails at card A's wait, the unchanged line `E-AND: the newest record_step rows did not end with card A's step at ok before card B (<rows>)` (`command-bar.mjs:434 at H`).
   - M-A4-3 (the `App.tsx:1060 at H` step enqueued twice): card A's wait passes (the architect's gate at H, O1). Then F4 with n = 2, both rows `filter:` + `ZONE_AB`, at `ok`.
   - M-X2 (the reviewer's line, as applied in its gate report at H, C1): F4 with n = 2, `["filter:\"zone\" = 'residential'","ok"]` then `["filter:(\"zone\" = 'residential') AND (\"zone\" <> 'residential')","ok"]`.
   - F2 in place of F4 still fails, but it is not the predicted line: recorded as such, with the four numbers.
7. **Unit layer** (by reading; no run required (mine)). `frontends/shell/src/App.command.test.tsx` RC3 (`:505`, `:512 at H`), RC5 (`:543`, `:548 at H`) and RC16 (`:644 at H`) pin the recorded steps of card changes. Under M-X2, RC3 fails at `:512` and RC5 at `:543`; RC16 passes.
8. **Worker's steps.** (a) Item 3's edits and ADV-2026-11-19-08 item 8's words, as one commit. (b) `command-bar.mjs` run whole once, unmutated, in its own shared hold, with the S9 debug exe and its sha256 checked. (c) Item 6's three mutations. (d) Each run's lines byte-copied, with the commit ids.
9. **Not covered** (mine): a duplicate of card A's commit (the architect's gate O1; ADV-2026-11-19-08 item 5).
10. **Budget.** `budget_minutes` from 500 to 560, my estimate. §7's table is not edited.
11. **Superseded index.** Amendment 4 item 4, for `command-bar.mjs` after card B: the tail reading and the ceiling of 30, by items 3 and 4 here. Amendment 4 item 7 is not edited; its lines stand as the predictions for H.

Read the last amendment first.

Nothing above is edited.
````

## 3. The answers

**(a) Yes, there is a reading in test code alone.** The label gives held and dropped. Their sum, together with each row's position (counting a closed `×N` group as N), numbers every rendered entry, whatever the ring has dropped. The reading is amendment item 3.
- It does not shorten to what the Console holds: F2 fails when an entry since the mark went unread.
- Its verdict does not depend on timing (item 3(i)).
- Whether it can decide depends on a count: entries since the mark of at most about 256.
- Ceiling against F: 60 for `command-bar.mjs` (item 4). My line estimate: about 48 at the new head, against 21 at H.
- Unmutated run: item 5. Mutations: item 6.
- Label numbers (ruling item 6, last paragraph): held and dropped after card A's wait (the mark), and held and dropped at the first reading after card B's map settles. Both pairs are in the PASS text and in F2.

**(b) Not needed.** If F2 fires in the unmutated run, these are the fallbacks:
- In test code (mine): decide at the first full reading after card B's row is `ok`, before `settleMap`. That reading usually comes before the rest of the load, so fewer entries fall between it and the mark. But whether it decides then depends on timing.
- Outside test code: a count of `record_step` entries ever recorded, kept in `frontends/shell/src/console/recorder.ts` and read through `frontends/shell/src/e2e-test-surface.ts`. Not built. It is new state with no product caller, so it does not meet the instrument-accessor exemption. It would need the advisor's ruling as a scope addition.

**(c) The unit tests.** RC3, RC5 and RC16 in `frontends/shell/src/App.command.test.tsx` pin card-change steps; their lines are in amendment item 7. `stepped` is at `:248 at H`. AB is `(${A}) AND (${B})` (`:251-253 at H`), so M-X2's condition holds at the second card.
- Under M-X2, RC3 reads [A, A, AB] and fails at `:512`. RC5 fails at `:543`.
- RC16 passes: one card, no "(". So do RC4 (`:525`), RC7 (`:576`) and App.recording A1 (`frontends/shell/src/App.recording.test.tsx:193-206 at H`, an Apply).
- So M-X2 is already caught at the unit layer at H. C1 is a gap in the e2e's end-to-end proof, not a product defect (mine).

## 4. The E-AND-b header (ruling item 8, third bullet)

This is a worker comment, not the human's wording. It replaces `command-bar.mjs:40 at H` with this line:

`//             Expected: step E-AND fails at its record_step wait after card A (a `/filter` condition is a card change, `filter.clauses.set`, which then records no step): `E-AND: the newest record_step rows did not end with card A's step at ok before card B (...)`.`

Clause check at H:
- A `/filter` condition is a card change: `onAddClause` goes to `changeClauses` (`App.tsx:2125`), which commits with `filter.clauses.set` (`:2085`).
- It then records no step: the mutation's guard `transition.action === "filter.apply"` (`command-bar.mjs:39`) is false for it.
- The wait after card A and its message are at `command-bar.mjs:433-434`, which Amendment 5 leaves unchanged. The reviewer saw the same message under M-A4-1 at H (check 8).
- An operator cannot see this line in the app; it is test text only.

## 5. Gaps

- I have no shell. Nothing was run and no hash was computed, so the reviewer recomputes any pin.
- Two claims rest on my understanding of React 18, not on React's source: that a click's state update renders before the next poll, and that consecutive updates are batched. If either fails, the result is F3 or a discarded reading, not a false pass.
- The size of the window between the mark and card B's reading is not measured. F2 in the unmutated run is the main risk.
- Not read: `console/render.ts`, `FilterPanel.tsx`, `collapsedCountSync.ts` beyond lines 15-58, ADV-2026-11-19-06, and the form outside §11 and Amendment 4.
- The ceiling of 60 and the budget of 560 are estimates.

The report goes at `C:/dev/spatial-ide/state/consults/2026-11-19-open-first-look-fills-fit-view-amendment-5-c1-architect-draft.md` (the custodian files it).
