*The architect's first draft of the Console piece's full form (ADV-2026-11-22-17, `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-17-the-console-piece-option-c-a-full-form-drafted-by-the-architect-now-the-words-as-its-drafts-item-67s-clause-kept-whole.md`), tag node:console-stream-lane-limitation-67@form-draft-1, read only at main 466318621a13f00ae7b1114a4690582be42bdc94 in a detached read checkout. Not a form and not committed as one. Filed by the custodian below the rule from its first hand-back in its transcript, 45353 bytes, sha256 87e14f0be08c8aa1217285c8450162644b1cd93f2fa668e780f16e9baed716de, byte for byte except one line of its files-read list, where the session scratch folder's path is written as <S>. Its run to that hand-back: Read 33, Grep 26, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-22T15:52:01Z to 2026-11-22T16:06:50Z by its transcript; 0 calls named the main checkout; no compaction. Its OPEN-1 and OPEN-5 were ruled by ADV-2026-11-22-20 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-20-the-console-forms-twelfth-file-test-code-only-two-rings-of-256-kept-the-open-drawers-frame-time-measured-after-the-sitting.md`); its second draft is with the architect.*

---

# console: data requests, cancels and session-log lines get a ring of 256 of their own, and the label shows both drop counts (known limitation 67); full form, both gates

*Proposed file: `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md`. Proposed PLAN node: `console-stream-lane-limitation-67`.*
*Drafted by the architect (claude-opus-5-5) on the custodian's brief (tag `node:console-stream-lane-limitation-67@form-draft-1`). It was read only, in the detached read worktree at main 466318621a13f00ae7b1114a4690582be42bdc94. Nothing was run. The custodian commits this form as its own commit, before any code, and only after OPEN-1 is ruled (see the note).*
*Append-only once committed. Self-references are by section, amendment and item, never by line.*
*Form: full, both gates from dispatch (ADV-2026-11-22-17 item 2).*

## §0 Disclosure

**0.1 Authority.** These are advisor's rulings under the delegation of 2026-11-13, not the human's words. Each is paraphrased here.
- ADV-2026-11-22-17 (to be filed under `state/directives/` before this form is committed):
  - item 1: option (c);
  - item 2: the class (full form, both gates), the Scope as the design note's eleven files, and the merge held for the tag;
  - item 3: the measurement;
  - item 4: the words, which are my drafts for the advisor to approve or replace after this form's gate;
  - item 5: item 67's comment names ADV-2026-11-19-16 item 2;
  - item 6: the registry row's comment;
  - item 7: nothing is reserved, but a dependency, lockfile or workflow goes to the advisor before commit.
- ADV-2026-11-21-15 item 1 (the merge waits for the tag or the human's word), item 4 (i) (the order) and item 5 (the registry row's comment).
- ADV-2026-11-19-08 item 6 and ADV-2026-11-19-16 item 2: item 67's present words.
- ADV-2026-11-21-08 item 3: what the registry row's comment names.

**0.2 Evidence, not Authority.**
- The design note: `state/consults/2026-11-22-console-piece-limitation-67-design-note-architect.md`.
- `KNOWN-LIMITATIONS.md` item 67 (`KNOWN-LIMITATIONS.md:525-527`; pin: hash by the custodian).
- Amendment 5 of `governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md`, which defines E-AND's present reading and its mutations M-A4-1, M-A4-3 and M-X2.

**0.3 The reuse index.** Byte-copied from the custodian's brief, and marked so here. It is the output of `tools/reuse.mjs` in the read-only reuse clone at 89bbac37, run by the custodian on 2026-11-22, exit 1. The brief is not tracked, so this is evidence, not Authority.

```text
No prior art recorded for "console ring buffer eviction". Research it before planning an implementation.
```

The search missed. In this repository the prior art is the recorder's own drop-with-count ring, which is modelled on `engine/src/trace.rs`'s bounded buffer (`frontends/shell/src/console/recorder.ts:273-281`).

**0.4 Cites.** Every cite is path:line at 466318621a13. Line ranges are reading aids, not pins, except where marked "pin: hash by the custodian". At dispatch, the tree at the dispatch base is authoritative, and stop S1 checks it.

**0.5 A finding the design note did not carry** (mine). It is the ground of OPEN-1. Two e2e suites parse the label's present grammar.
- `frontends/shell/e2e/command-bar.mjs:377` holds `LABEL` and `parseLabel`. Its E-AND reading (`:380-415`, used at `:479-490`) numbers each rendered entry as dropped + position. That is Amendment 5 item 2 of the first-look form.
- Under two rings both of these fail:
  - The regex's optional group does not match `(D dropped: …)`, so dropped reads as 0. Nothing fails at that point.
  - Position is no longer the entry's number. An eviction from the stream ring renumbers every older held entry of the other kind. An entry from before the mark can then be counted as added after it, or the unseen range can be empty, so E-AND can pass on nothing.
- `frontends/shell/e2e/console.mjs:244` has the same regex. It is in the note's Scope.
- `command-bar.mjs` is not one of the eleven files.

## §1 What this may and may not claim

**May claim:**
- An entry named `viewport_query` or `cancel` (class A), or `binding_log_session_event` (class B), is held in the stream ring. Every other entry is held in the other ring.
- Each ring holds at most 256 entries and evicts its own oldest entry, counted against that ring.
- No entry of one ring is ever evicted by an entry of the other.
- `count()` plus both rings' drop counts equals every entry recorded since the recorder was created. The label shows the held count, the total dropped, and each ring's share.
- The display shows every held entry, oldest first by `seq`.
- What one first look adds to each ring, for the datasets and windows of §6, as measured by MEASURE'.

**May not claim:**
- Any performance number or docs/08 row.
- That the open drawer's cost is unchanged. It can now hold up to 512 entries, against 256 today. That cost is not measured (OPEN-5).
- That every entry a first look adds is of the stream kind. That is by reading of the code; MEASURE' checks it, and S7 applies if it is wrong.
- That anything about grouping is unchanged. Two runs of one entry that were separated by stream entries become one group when those entries are dropped (§2.3 item 6; VL3).
- Any wire change, any change to `call()`'s capture site or `logSessionEvent` (not c2), or any ADR amendment.

**ADRs cited, none amended:**
- ADR-024: classification is by name only, and no argument object reaches the recorder.
- ADR-006: no operation is added; the Console stays a session's working set.
- ADR-010 rule 6: the 256 is declared, at its site.

## §2 The change

### 2.1 The interfaces it is written against (read at 466318621a13)

**The recorder** (`frontends/shell/src/console/recorder.ts`):
- `record(request, command?)` at :205-213;
- `recordBindingCommand` at :237-245;
- `recordGuiAction` at :263-271;
- `push` at :282-288;
- `droppedCount()` at :292-294;
- `entries()` at :300-302;
- `count()` at :308-310;
- `MAX_CONSOLE_ENTRIES` at :141, and its doc at :133-140, which states that the ring "never blocks, never grows past 256, and never silently truncates";
- the type-only import of `RecordableName` at :36, explained in the header at :25-29.

**The capture sites** (unchanged):
- `call()` records `(request, command)` at `frontends/shell/src/skp/client.ts:59`;
- `viewportQuery` sends `"viewport_query"` at :119, and `cancel` sends `"cancel"` at :133;
- `logSessionEvent` calls `recordNamed("binding-command", "binding_log_session_event")` at `frontends/shell/src/diagnostics/log.ts:21`.

**The count sync** (`frontends/shell/src/console/collapsedCountSync.ts`):
- `CountableRecorder` at :27-31;
- `ConsoleCountSnapshot { count, dropped }` at :33-36;
- `attachCollapsedCountSync` at :50-69.

**The panel** (`frontends/shell/src/console/ConsolePanel.tsx`):
- the snapshot state at :41;
- the expanded sync at :48-52;
- the label at :64-68 (pin: hash by the custodian);
- the group key `group.entries[0]!.seq` at :96;
- `ConsoleGroupRow`'s own open state at :106-107.

**The view model:** `groupConsecutiveEntries` at `frontends/shell/src/console/consoleViewModel.ts:177-189`, with its key at :160-169.

**The registry** (`frontends/shell/src/console/surfaceRegistry.ts`):
- `ClassARow` at :30-35 and `ClassBRow` at :39-50;
- the `viewport_query` row at :84 and the `cancel` row at :85;
- the `binding_log_session_event` row at :108-115;
- the `binding_pick_project_folder` row at :132-139;
- `RecordableName` at :420.

**The slots the row comment names:**
- `takeSlot` at `frontends/shell/src/admission/AdmissionPanel.tsx:294-300`, `e2eFolderRef` and `e2eFileRef` at :340-342, and their uses at :387 and :395;
- `e2eSaveFolderRef` at `frontends/shell/src/App.tsx:894-903`;
- `isInstrumentedBuild` at `frontends/shell/src/isInstrumentedBuild.ts:31-33`.

**The e2e readers:**
- `frontends/shell/e2e/console.mjs`: `readConsoleLabel` at :241-248, the `MAX_CONSOLE_ENTRIES` mirror at :67-71, GROUP's capacity check at :733-736, `runStep` at :1008-1019, and the step list at :1045-1056;
- `frontends/shell/e2e/command-bar.mjs`: :376-415, and its use in `stepAnd` at :477-490.

**Today's label carries no placeholder mark.** `ConsolePanel.tsx:65-68` builds `Console — ${snapshot.count} ${actionsWord} (${snapshot.dropped} dropped)`, with no `[P6 placeholder]` text. By contrast, the registry statements carry the mark (for example `surfaceRegistry.ts:205`). Under item 4 of the ruling, the new label also carries no mark.

### 2.2 Before

There is one ring for every kind of entry. A load's tile requests and terminal lines push out the user's recorded steps and other actions. That is item 67, and its comment names each clause's code.

### 2.3 After (product code, in `console/` only)

**1. The registry** (`surfaceRegistry.ts`) (mine; OPEN-2):
- `ClassARow` and `ClassBRow` gain an optional `readonly lane?: "stream"`, with a doc comment.
- Exactly three rows carry it: `viewport_query`, `cancel` and `binding_log_session_event`.
- One new export, `isStreamLaneName(kind: "skp-request" | "binding-command", name: string): boolean`, is derived from the marked rows and never hand-listed. Its product caller is item 2.
- The file still imports nothing.

**2. The recorder** (`recorder.ts`):
- `export type ConsoleLane = "stream" | "other"`.
- Two arrays and two counters, one per lane.
- `push` picks the lane:
  - an `skp-request` with a `command`, or a `binding-command`, goes to the stream ring when `isStreamLaneName` says so;
  - a `gui-action`, and a `record()` with no `command`, go to the other ring.
- When the chosen ring holds `MAX_CONSOLE_ENTRIES`, its oldest entry is shifted out and its counter is incremented in the same synchronous call.
- `MAX_CONSOLE_ENTRIES` stays `256`; its doc now says it is each ring's size.
- `droppedCount(lane: ConsoleLane): number`. The lane is required, and the no-argument form goes. Both lanes have a product caller (item 3).
- `count()` is the sum of both lengths, O(1).
- `entries()` is a two-pointer merge of both rings by `seq`, oldest first, in a fresh array, O(n) (OPEN-3).
- The import of `isStreamLaneName` is a runtime import. The header sentence at :25-29 is rewritten to say so. There is no cycle, because the registry imports nothing.
- The doc of `MAX_CONSOLE_ENTRIES`, `push` and `entries()` is rewritten. My draft for the invariant sentence, which is not the human's wording:
  > "What IS true by construction: each ring never grows past 256 and evicts only its own oldest entry; the recorder never blocks and never silently truncates -- every eviction is counted against its own ring, and count() plus droppedCount("stream") plus droppedCount("other") is every entry recorded."

**3. The count sync** (`collapsedCountSync.ts`):
- `CountableRecorder.droppedCount(lane: "stream" | "other")`.
- `ConsoleCountSnapshot` becomes `{ count, droppedStream, droppedOther }`, read once per frame as today.

**4. The label** (`consoleViewModel.ts` and `ConsolePanel.tsx`):
- A pure function `consoleLabelText(snapshot: ConsoleCountSnapshot): string` goes in `consoleViewModel.ts`. Its product caller is `ConsolePanel`.
- `ConsolePanel` calls it, initialises its snapshot as `{ count: 0, droppedStream: 0, droppedOther: 0 }`, and reads both lanes in its expanded sync.
- The text is §2.4 L1.

**5. Unchanged:**
- `client.ts`, `log.ts` and every capture site;
- `recordNamed` and both allowlists;
- `render.ts`;
- every registry string;
- the standing header and the class-B threw sentence;
- `groupConsecutiveEntries`.

**6. Grouping after a drop** (by reading; pinned by VL3; OPEN-4):
- Groups never cross lanes, because the key is kind plus name.
- When the stream entries that separate two runs of one other-kind entry are dropped, the runs become consecutive in `entries()` and form one group keyed by the earlier run's first `seq`.
- The later run's own open state is lost, because its key unmounts. The joined group is open only if the earlier run was a group the user had opened.

**7. The e2e readers:**
- `console.mjs`:
  - `readConsoleLabel` parses the new grammar. It returns `count: null` when the text contains `dropped` but the full form does not match, or when the total dropped is not stream plus other.
  - The comment on the mirror at :67-71 says "each ring's size".
  - GROUP's check at :733-736 is unchanged. It is still sound: the other ring's growth is at most the total growth.
  - New steps LABEL' and MEASURE' (§4, §6), and a `SKIP` status in `runStep` that does not fail the run.
- `command-bar.mjs` (OPEN-1 (a)): the E-AND reading after card B is replaced by §2.5.

**Other checks.**
- docs/02: all changes sit in `console/` and the e2e suites.
- docs/10: no wire change.
- Principle 4: no entry is synthesised, and the exact request reference is kept (I2).
- Principle 7 and the "Never block the canvas" rule (`docs/01_Principles.md:13`, `:20`): `push` is still bounded and synchronous. The merge runs only when the drawer is open. The held ceiling doubles (OPEN-5).

### 2.4 Words (none is the human's wording; each is a draft for the advisor after this form's gate)

**L1, the label (P6, unmarked as today):**
- No drops: `Console — N actions`, or `Console — 1 action`. This is unchanged.
- With drops: `Console — N actions (D dropped: S of data requests, cancels and log lines; O of other entries)`.

Clause check against §2.3:
- N is `count()`, both rings held.
- D is S + O, computed in `consoleLabelText`.
- S is `droppedCount("stream")`, and "data requests, cancels and log lines" are the three marked names of item 1.
- O is `droppedCount("other")`, which is every other entry.
- The drop clause shows whenever D > 0, so both counts always show together (ruling item 1).
- N + D is every entry recorded (item 2's invariant).
- "of" keeps the counts free of number agreement.

**K1, item 67's bold line:**
> "67. **The Console keeps its newest 256 data requests, cancels and session-log lines apart from its newest 256 other entries, and one load of a view can add more than ⟨H⟩ of the first kind.**"

⟨H⟩ is filled by rule W (§6).

Clause check:
- The 256 of each kind and "apart" are §2.3 items 1 and 2 (CL2).
- "session-log lines" is the `binding_log_session_event` row, which every `logSessionEvent` call writes (`log.ts:21`).
- ⟨H⟩ comes from MEASURE'.

**K2, item 67's paragraph.** The clause the ruling keeps is whole, brackets included. ⟨FIGURE⟩ is filled by rule W.
> "The Console keeps two kinds of entry apart. Data requests (the viewport_query rows), cancels (the cancel rows) and the app's lines to the session log (the binding_log_session_event rows) are one kind; every other entry is the other kind. It keeps the newest 256 of each kind. When a kind is full, each new entry of that kind drops that kind's oldest one, and the Console's label shows how many entries were dropped and how many of them were of each kind. When the first data load of a view completes (after an open, an Apply or a Clear, for example), the map asks for tiles of that view. Each tile is asked for in a request of its own, and each request is an entry of the first kind. When a tile's load ends, other than by a cancel the app makes (after your Cancel, for example), the app writes a line to the session log, and that write is an entry of the first kind too. Panning and zooming ask for tiles in the same way. ⟨FIGURE⟩ So a load can drop the data requests, cancels and log lines before it, the request that an Apply or a Clear sent among them. It drops none of the other entries: the steps you recorded and your other actions stay until 256 newer entries of their own kind are recorded. Only the entry leaves the Console: the request was already sent, and a recorded step stays in the session's history. A group of entries you have opened closes again when its first entry is dropped. When the entries of the first kind that separate two runs of the same entry are dropped, the two runs show as one group, which is closed unless the earlier run was a group you had opened."

Clause check:
- The kinds and their names are §2.3 item 1. The rows' headers are `viewport_query` and `cancel`, and the class-B prose ends `(binding_log_session_event)` (`ConsolePanel.tsx:165`, `:187`).
- Each kind's 256 and its own oldest dropped are item 2 (CL2, CL4).
- The label is L1.
- The tile-request and terminal clauses keep item 67's present code by symbol (`viewportQuery` in `tileViewportStreamManager.ts`; `candidate-tile-terminal` in `candidateArmSession.ts`). This piece does not change them.
- "the request that an Apply or a Clear sent" is an untiled `viewport_query`, which is stream kind (item 1).
- "drops none of the other entries" holds if a load adds no other-kind entry. That is by reading, and MEASURE' checks it under S7. Within the other ring itself it is CL1.
- "closes again when its first entry is dropped" is the key at `ConsolePanel.tsx:96`.
- The joined-runs sentence is §2.3 item 6 (VL3).

**K3, item 67's comment:** the worker's words, by symbol. Each clause is checked by both gates. It must:
- say that the text is the advisor's wording under the delegation, ruled in ADV-2026-11-19-06 item 5, corrected in ADV-2026-11-19-08 item 6, with the tile-load clause replaced by the reviewer's sentence in ADV-2026-11-19-16 item 2, and rewritten for this piece under ADV-2026-11-22-17 (item 4), with the advisor's ruling on these words named by id;
- name, by symbol: `MAX_CONSOLE_ENTRIES`, `push`, `droppedCount` and `entries` in `recorder.ts`; `isStreamLaneName` and the three `lane` marks in `surfaceRegistry.ts`; `consoleLabelText` in `consoleViewModel.ts`; `ConsoleGroupRow` and the group key in `ConsolePanel.tsx`; and the present clauses' symbols, kept;
- name ⟨FIGURE⟩'s source: the MEASURE' report's path and the commit it ran at;
- keep the 110-tile history as a past figure;
- keep "Not examined: how many entries a cancelled tile request adds".

**R1, the comment on the `binding_pick_project_folder` row** (ruling item 6; the architect's words; a source comment, not shown):
> "// In an instrumented build only (isInstrumentedBuild), a folder that a test hook of src/e2e-test-surface.ts puts in a one-shot slot is taken once in place of this picker's answer: e2eFolderRef in AdmissionPanel (through takeSlot, for a reopen) and e2eSaveFolderRef in App (for a save). In a plain build both slots are always null, so the picker's own answer supplies the folder (ADV-2026-11-21-08 item 3; ADV-2026-11-21-15 item 5)."

Clause check:
- "instrumented build only" and "taken once" are `AdmissionPanel.tsx:294-300` and `App.tsx:898-903`.
- The hook file is named at `AdmissionPanel.tsx:340` and `App.tsx:894`.
- "for a reopen": `AdmissionPanel.tsx:387`, with the reopen hooks at :444. The gate confirms the call site.
- "always null in a plain build" is the doc at :340 and :894. The gate confirms the hooks are not installed in a plain build.
- "the picker's own answer": `takeSlot` returns `pick()` when the slot is null.

### 2.5 E-AND after card B, re-read (OPEN-1 (a); test code only)

- **(a) R0.** At `label0`'s present position (after card A's wait), read in one `page.evaluate`, repeated until no closed group remains, with each pass clicking the closed groups and waiting two frames, bounded to 30 s:
  - O₀, the label's other-kind drop count;
  - the `record_step` rows, as `stepKey` and outcome.
- **(b) R1.** After card B's map settles and the map checks are made, the same reading gives O₁ and its rows. Repeat until the newest row is `ok`, bounded to 30 s.
- **(c) The decision:**
  - If O₁ ≠ O₀: F2′.
  - Else, if the first |rows₀| rows of rows₁ do not equal rows₀: F5.
  - Else, added = rows₁ after rows₀, and F4 applies unless added is exactly one row keyed `filter:` + `ZONE_AB` at `ok`.
- **(d) Why this needs no timing** (by reading): if no other-kind entry was evicted between R0 and R1, every row of R0 is still held, in order. The step never passes on what a ring no longer holds.
- **(e) Texts** (test strings; the worker applies them):
  - F1 is unchanged.
  - F2′: `E-AND: cannot tell how many record_step rows card B's commit added: <n> entries of the other kind were dropped between the reading after card A's wait and the reading after card B's map settled (label then: <text>; now: <text>)`
  - F3′: `E-AND: within 30000ms of card B's map settling no reading had every group open with the newest record_step row at ok (<last reading>)`
  - F4 is unchanged.
  - F5: `E-AND: the record_step rows read after card A's wait are not the first rows read after card B's map settled (<rows0>; <rows1>)`
  - The PASS text carries both label texts, so ADV-2026-11-19-08 item 6's two numbers are still recorded.
- **(f) Removed:** `readConsole` and `watchConsole` (`command-bar.mjs:380-415`).
- **(g) Unchanged:** `waitCommitted`, `readRecordStepRows` and card A's wait. The `LABEL` regex and `parseLabel` follow L1.

## §3 Fixtures

- **Unit tests:** none. They build real `ConsoleRecorder` instances, and CC2 uses the real recorder behind the real `attachCollapsedCountSync`.
- **E2E:**
  - `filter-zoned.parquet`: 2,000 features (`console.mjs:35`).
  - `100k-happy-path.parquet`: 100,000 features (`kernel/tests/manual_walkthrough_fixtures.rs:44-55`).
  - Both are under `target/fixtures/manual-walkthrough/` and both are sha256-hashed before and after the measured run. A missing fixture is stop S9.

## §4 Tests and mutations

Each mutation is applied, the named tests are run and seen to fail by name, and the failing line and the commit are recorded. Then it is reverted. No `verify-mutation` run is called an observation (round 25, item 2 (c)).

**New unit tests:**

| Id | File | Asserts | Red at the base because | Mutation (fails it) |
|---|---|---|---|---|
| CL1 | recorder.test.ts | one `record_step` entry, then 300 × (`viewport_query` + `binding_log_session_event`): the `record_step` entry is still held, by reference; `droppedCount("stream")` = 344; `droppedCount("other")` = 0; `count()` = 257 | the single ring evicts it | M-1: every entry goes to the other lane |
| CL2 | recorder.test.ts | 300 gui-actions and 300 cancels, interleaved: each kind holds its newest 256 (oldest held is the 45th of each); `count()` = 512; each lane dropped 44 | cap 256 overall | M-2: the capacity check reads `count()` |
| CL3 | recorder.test.ts | O₀, 300 `viewport_query`, O₁: `entries()[0]` is O₀, the last is O₁, and seqs strictly increase | O₀ is evicted | M-3: `entries()` returns the stream ring then the other ring |
| CL4 (the invariant: never silently truncates, across both rings) | recorder.test.ts | 3,000 entries from a seeded generator over seven names (`viewport_query`, `cancel`, `describe`, `record_step`, `binding_log_session_event`, `binding_pick_file`, `style.togglePanelExpanded`). After every record: `count()` + both drop counts = recorded so far, and each lane holds at most 256. Every 100 records and at the end: the seqs absent from `entries()` number exactly the sum of the drop counts, and the absent seqs of the three stream names number exactly `droppedCount("stream")` | `droppedCount` ignores its argument, so the sum double-counts once drops begin | M-4: the stream ring evicts without incrementing its counter |
| CL5 | recorder.test.ts | for each name, a fresh recorder and 257 entries of that name only: exactly the matching lane's counter is 1 and the other 0 (stream for `viewport_query`, `cancel` and `binding_log_session_event`; other for `describe`, `record_step`, `binding_pick_file`, a gui-action, and a `record()` with no command) | both read 1 | M-5: the `lane` mark removed from the `cancel` row |
| SR1 | surfaceRegistry.test.ts | the names for which `isStreamLaneName` holds, over every class-A and class-B row, are exactly the three; no class-C row has a `lane` field | the export is absent | M-6: a `lane` mark added to `describe` |
| VL1 | consoleViewModel.test.ts | `consoleLabelText` with no drops gives `Console — 0 actions`, `Console — 1 action` and `Console — 5 actions` | the export is absent | M-7: the drop clause always shown |
| VL2 | consoleViewModel.test.ts | `{count: 300, droppedStream: 45, droppedOther: 5}` gives L1's text with 300, 50, 45, 5 | the export is absent | M-8: D written as `droppedStream` |
| VL3 | consoleViewModel.test.ts | real recorder: `record_step` A, `viewport_query`, `record_step` B, then 256 `viewport_query`: the first group holds [A, B], by reference, and its first entry is A | A, the separator and B are all evicted | M-9: `groupConsecutiveEntries` joins only entries with adjacent `seq` |
| CC1 | collapsedCountSync.test.ts | a fake with stream 3 and other 2 gives `{count: 0, droppedStream: 3, droppedOther: 2}` | the snapshot has no such fields | M-10: `droppedStream` read from the other lane |
| CC2 (the real shape) | collapsedCountSync.test.ts | a real `ConsoleRecorder`, one `record_step` and 300 `viewport_query`, flushed: the last call is `{count: 257, droppedStream: 44, droppedOther: 0}` | as CC1 | M-10 |

**Existing tests edited** (named, and red at the base under the new interface):
- `recorder.test.ts`, "evicts the oldest entry once MAX_CONSOLE_ENTRIES is exceeded, counting every drop": `droppedCount()` becomes `droppedCount("other")` (one line).
- `collapsedCountSync.test.ts`:
  - `fakeRecorder` (two counters, `droppedCount(lane)`);
  - "fires once immediately on attach with the current snapshot";
  - "onCount is the ONLY function this module ever calls…": the key list becomes `["count","droppedOther","droppedStream"]`;
  - "a burst of recorder notifications within one frame…";
  - "count() is read at most once per onCount call…";
  - "reflects droppedCount() in the snapshot".

**Existing tests declared unedited:**
- every other test in `recorder.test.ts`;
- `consoleViewModel.test.ts`'s grouping, header and view-model tests;
- `surfaceRegistry.test.ts`;
- `soleCaptureSite.test.ts`, `surfaceCompleteness.test.ts`, `renderTruth.test.ts` and `consoleLanguage.test.ts`;
- `RefusalBlock.test.tsx`;
- `App.command.test.tsx`, `App.layout.test.tsx`, `App.recording.test.tsx`, `App.selection.test.tsx` and `App.table.test.tsx`. Their `entries().slice(count())` marks hold whenever no ring evicts. Today they pass only with fewer than 256 entries in all, which implies fewer than 256 in each ring (by reading).

**E2E:**
- **LABEL'** (new; `console.mjs`, after UNCLASS'). It opens `filter-zoned.parquet` once more and settles (quiet 3000 ms, bound 45 s). It reads the label after two frames and asserts:
  - the label parses;
  - D = S + O;
  - S > 0. If S is 0 it fails as `LABEL': the stream ring did not overflow in this run; the label's drop form was not exercised`.
  - Prediction: S > 0. The run holds at least three first looks of this file, at least 220 stream entries each by item 67's figure.
  - M-11: S and O swapped in `consoleLabelText`. LABEL' then fails at its S > 0 check.
- **E-AND** (`command-bar.mjs`, under OPEN-1 (a)). Its predictions:
  - M-A4-1 fails at card A's wait, on the unchanged line.
  - M-A4-3 gives F4 with n = 2, both rows `filter:` + `ZONE_AB`.
  - M-X2 gives F4 with n = 2, A then the combined text.
  - New M-CB1: `MAX_CONSOLE_ENTRIES = 8` in `recorder.ts`. F2′ is predicted, because card B's own `record_step` evicts from a full other ring.
  - Any other failing line is recorded as class 2.

## §5 Predictions, declared unchanged, falsification

**Predictions:**
- P1: the tests' commit, run at the base, gives every new and every edited test red, at the reason §4 names.
- P2: each mutation fails the tests §4 names for it.
- P3: every test declared unedited passes unedited, and `npm run verify` passes.
- P4: §9.3's e2e rows pass: LABEL' with S > 0, and E-AND under §2.5.
- P5: in MEASURE', every settled run gives other-added = 0, and the 1280 by 800 runs on `filter-zoned.parquet` give stream-added ≥ 220. Whether any run reaches 256 is not predicted: it is the question asked.
- P6: §7 holds.

A wrong P1 to P5 is class 2. A wrong P6 is class 8.

**Declared unchanged:**
- `skp/client.ts`, `diagnostics/log.ts`, `streaming/**`, `residency/**`, `App.tsx`, `AdmissionPanel.tsx` and `render.ts`;
- `styles.css`, `e2e/README.md`, `e2e/lib.mjs`, every suite other than the two named, and `protocol/**`;
- every registry string, the standing header and the class-B threw sentence;
- `MAX_ENTRY_RENDER_BYTES`;
- `package.json`, every lockfile and every workflow.

**Falsification:**
- an entry evicted by an entry of the other lane;
- a reading in which D ≠ S + O;
- a first look that adds an other-kind entry, which makes K2's "drops none of the other entries" untrue (S7);
- CC2 passing against a fake while failing against the real recorder;
- E-AND passing under M-X2.

## §6 Instruments, the measurement and rule W

- **Assertions:** every unit test, LABEL' and E-AND.
- **MEASURE'** (`console.mjs`, opt-in through `CONSOLE_MEASURE=1`; without it, the step prints a SKIP line, the precedent being `e2e/README.md:762`; OPEN-7):
  - It runs after LABEL' and before REGRESS', with the drawer collapsed, so no click records an entry.
  - **Warm-up:** `openPath(filter-zoned.parquet)` and a settle, up to three times, until S > 0. A ring that never fills is recorded, and every split below is then marked inexact.
  - **Order:**
    - datasets: `filter-zoned.parquet`, then `100k-happy-path.parquet`;
    - windows, within each dataset: 1280×800 (the shipped window, `frontends/shell/src-tauri/tauri.conf.json:17-18`), 1024×640 (the layout floor, `e2e/layout.mjs:276`), 1366×768 (`e2e/layout.mjs:245`), then 1920×1080;
    - three runs of each window, one after another: 24 runs in all.
  - **One run:**
    1. `page.setViewportSize(W)`, with the inner size checked as `layout.mjs:248-256` does (S8);
    2. a settle;
    3. `openPath(dataset)`, which must return `admitted`;
    4. P0, the label after two frames;
    5. a settle (quiet 3000 ms, bound 60 s; an unsettled run is recorded and excluded);
    6. P1, the label after two frames.
  - The run records N, D, S and O at P0 and P1, plus Δtotal, ΔS, ΔO and ΔN.
  - **The split.** Once S > 0 at P0 the stream ring is full, and stays full. So stream-added = ΔS exactly, and other-added = Δtotal − ΔS.
  - It asserts only:
    - the label parses;
    - D = S + O in every reading;
    - Δtotal > 0 in a settled run;
    - the viewport is set.
  - Output: the step's PASS note, and `frontends/shell/e2e/out/console-measure-<ms>.json`, which the tester copies into its report.
  - After the step the viewport is set back to 1280×800.
  - The run uses `SPATIAL_E2E_DEADLINE_MS=5400000` and a step bound of 45 min.
  - The figures are lower bounds on a load. P0 follows the open's return, so a first-look entry recorded before P0 is not counted.
- **Rule W** (how item 67's figure is written from the result; the custodian applies it, and the gates check it):
  1. Use the settled runs with S > 0 at P0. Y is the largest stream-added among them, with its dataset and window. X is the largest at 1280×800.
  2. If any of those runs has other-added > 0, stop S7.
  3. ⟨H⟩:
     - If Y ≥ 256, the bold line's last clause becomes "and one load of a view can add more of the first kind than it keeps".
     - Otherwise ⟨H⟩ is the largest whole hundred below Y, in words. If Y < 100, the clause is "can add up to ⟨Y⟩ of the first kind".
  4. ⟨FIGURE⟩: "In the app-window tests one first look of a file of ⟨2,000 or 100,000⟩ features, in a window ⟨w⟩ by ⟨h⟩ pixels, added at least ⟨Y⟩ entries of the first kind; at the app's own window size, 1280 by 800, at least ⟨X⟩."
  5. If Y ≥ 256, add: "That is more than the 256 the Console keeps of that kind, so after such a load it holds only entries of that kind from the load and after it."

## §7 Declared values and the ceiling

- **No new constant.** `MAX_CONSOLE_ENTRIES` stays 256 and now means each ring's size, declared at its site. The e2e bounds (3000 ms quiet, 60 s, 45 min, the 30 s readings) are harness bounds, not latency claims.
- **The ceiling:** at most 850 changed lines, both numstat columns summed, over these twelve files:
  - `frontends/shell/src/console/recorder.ts`, `surfaceRegistry.ts`, `consoleViewModel.ts`, `ConsolePanel.tsx` and `collapsedCountSync.ts`;
  - `recorder.test.ts`, `surfaceRegistry.test.ts`, `consoleViewModel.test.ts` and `collapsedCountSync.test.ts`;
  - `frontends/shell/e2e/console.mjs` and `frontends/shell/e2e/command-bar.mjs`;
  - `KNOWN-LIMITATIONS.md`.

  `command-bar.mjs` is the twelfth file and stands on OPEN-1. An overrun is class 8, nothing is cut or packed to fit, and this section is never edited.
- **Estimate, about 650 lines:**

  | File | Lines |
  |---|---|
  | recorder.ts | 70 |
  | surfaceRegistry.ts | 35 |
  | consoleViewModel.ts | 25 |
  | ConsolePanel.tsx | 12 |
  | collapsedCountSync.ts | 15 |
  | recorder.test.ts | 140 |
  | surfaceRegistry.test.ts | 20 |
  | consoleViewModel.test.ts | 55 |
  | collapsedCountSync.test.ts | 60 |
  | console.mjs | 150 |
  | command-bar.mjs | 60 |
  | KNOWN-LIMITATIONS.md | 6 |
- **Counting, at a named commit:**
  - `git diff --numstat B...H --` over the twelve files;
  - `git diff --name-only B...H`, which names no other path than this form, `governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.*`, `site/**` and `state/**`.

## §8 Block-on-sight

1. Any edit to a capture site (`client.ts`, `log.ts`), to `streaming/**`, `residency/**` or `App.tsx`, or to `protocol/**`. That would be c2 or a wire change.
2. A lane chosen by anything but the entry's kind and name, or an argument object reaching the recorder (ADR-024).
3. An eviction that is not counted against its own ring, or a label that shows one drop count without the other.
4. A new export with no product caller. `isStreamLaneName`, `ConsoleLane`, `droppedCount(lane)` and `consoleLabelText` each need one.
5. An existing test edited that §4 does not name.
6. A string the app shows changed other than the label. A label text other than the advisor's approved words. A placeholder mark added to the label (ruling item 4).
7. Item 67's words landed with ⟨H⟩ or ⟨FIGURE⟩ written other than by rule W, or with the bracketed clause not whole.
8. A test that asserts lanes only against a fake, without CC2, or E-AND decided on rows the ring may have dropped.
9. A dependency, lockfile or workflow change.
10. A line cut or packed to fit §7.
11. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code landed before the amendment that declares it;
    - a `verify-mutation` run called an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id.
12. Record items:
    - quotation marks around text that is not byte-identical to its named source;
    - a line cite into the ledger;
    - a bare self-line;
    - a pin read as current.

## §9 Gates

**9.1 Architect** (full):
- §8, item by item.
- The seam rule on four seams, each against its actual interface at the base:
  - the recorder to the registry (`isStreamLaneName`; SR1, CL5);
  - the recorder to `collapsedCountSync` (CC2 is the end-to-end proof from the real shape);
  - the snapshot to the label (VL1, VL2, LABEL');
  - the label to both e2e readers (`console.mjs`, and `command-bar.mjs` through E-AND).
- The caller rule.
- L1, K1, K2, R1 and K3, clause by clause, against the built code. Rule W against MEASURE's JSON.
- docs/01 (principles 4 and 7), docs/02, docs/10, ADR-024, ADR-006 and round 25.

**9.2 Reviewer:**
- the full diff, `origin/main...HEAD`;
- M-1 to M-11 and M-CB1 made again, with M-A4-1, M-A4-3 and M-X2 read from the tester's runs;
- §7 by its commands;
- `npm run verify` in a hold;
- the MEASURE' JSON recomputed against the PASS note.

**9.3 Suites:**
- `npm run verify` in `frontends/shell`, after `npm ci` there and in `renderer/bundle-viewer`;
- the `scripts/plan` node tests;
- verify cites, quotes (a floor) and test-claims;
- green CI.

E2E, at the gated head, through the suites' own launch on port 5180, by the Sonnet tester, with heavy runs taking turns. Each run's app stderr, report and session log are copied right after it.
- `e2e/console.mjs` twice: plain, then with `CONSOLE_MEASURE=1`. Each run includes REGRESS'.
- `e2e/command-bar.mjs`, and the M-CB1 run of it.
- `e2e/recording.mjs`, `e2e/project.mjs`, `e2e/reopen.mjs` and `e2e/table.mjs`, the other suites that read Console rows.

Any failed row is stop S6.

**9.4 Operator:** no Part. The label goes onto P6's sight list as an unmarked, unsighted string (OPEN-9).

**9.5 The PR body:**
- asks for a merge commit;
- names base B, the OPEN rulings and the advisor's words for L1 and K1 to K2;
- lists R1, K3 and the worker's comment words;
- states that the merge request waits for the tag (ADV-2026-11-21-15 item 1; ADV-2026-11-22-17 item 2).

## §10 Where it is built, the order and the model

- **Where:** branch `cut/console-stream-lane`, worktree `C:/dev/wt/console67`, build folder `D:/wt-targets/console67`, test data folder `D:/wt-data/console67`, cut from main at dispatch.
- **Commits:**
  1. This form.
  2. The tests' commit alone. The worker's local run shows each new and edited test red.
  3. The code commit.
  4. Item 67's words, after rule W, by the custodian's script, as a words-only commit. The reviewer reads it narrowly.

  A stop still pushes the branch as it stands. A worker pushes in a call of its own.
- **Merging main in:** before the merge request. If that merge touches a §7 file, the reviewer makes a narrow read and §9.3's e2e runs again.
- **Model:** the standard worker, which holds no concurrency or timing in product code, and the Sonnet tester (OPEN-8). Both count under the cap.

## §11 Stops

Each stop is reported, and the custodian sends it to the advisor.
- S1: an interface or symbol of §2.1 differs at the dispatch base.
- S2: an existing test not named in §4 needs an edit.
- S3: a new test is green at the base, or red for another reason than §4 names.
- S4: an edit outside §7's files.
- S5: a §7 path is in the declared files of a piece in flight or a PR awaiting merge at dispatch. Item 67's region counts.
- S6: any failed e2e row.
- S7: MEASURE' gives other-added > 0, or LABEL' and MEASURE' disagree on the grammar. The words wait for the advisor.
- S8: `setViewportSize` fails, or the inner size differs.
- S9: a fixture is missing, or its hash changes across the run.
- S10: a dependency, lockfile or workflow is found to be needed (ruling item 7).

## §12 OPEN items

- **OPEN-1, the twelfth file** (§0.5). Recommended: (a), add `command-bar.mjs` with §2.5's reading. (b) is a `data-console-seq` attribute in the DOM, which falls under the instrument exemption and costs more code on both sides. (c) is leaving E-AND as it is, which reads dropped as 0 and can pass vacuously, so it is not acceptable.
- **OPEN-2, where the lane is declared.** Recommended: the three registry rows (one source; a renamed command moves with its row). The alternative is a name set in `recorder.ts`.
- **OPEN-3, where the merge lives.** Recommended: `recorder.entries()`, which keeps every consumer and the App tests unchanged. `consoleViewModel.ts` then holds only the label. The note placed the merge in `consoleViewModel.ts`.
- **OPEN-4, joined runs after a drop.** Recommended: keep and disclose (K2's last sentence, VL3). Grouping cannot tell a dropped gap from the other lane's interleave without new state.
- **OPEN-5, the open drawer holds up to 512 entries.** Recommended: accept it unmeasured, disclosed in §1. The other ring fills only after 256 user actions, so ordinary use holds about 256 plus a few. The alternatives are a docs/08 frame-time measurement in an instrumented build before the merge, or two rings of 128.
- **OPEN-6, the `binding_pick_file` row.** Its file slot, `e2eFileRef` (`AdmissionPanel.tsx:342`, `:395`), has the same gap. Recommended: one sentence in the same commit, by the advisor's word. It is not ruled now.
- **OPEN-7, MEASURE's shape.** Recommended: opt-in, with §6's two datasets, four windows and three runs each.
- **OPEN-8, the model.** Recommended: the standard worker and the Sonnet tester.
- **OPEN-9, the label at P6.** Recommended: unmarked, as ruled, and on the sight list for the next sitting.

## §13 Amendments

*(Opens empty; append-only.)*

---END OF FORM---

**Note for the custodian and the advisor**

1. **The Scope finding, which goes to the advisor before the form is committed** (ruling items 2 and 7). The note's eleven files leave `frontends/shell/e2e/command-bar.mjs` with a broken E-AND reading.
   - Its `LABEL` regex (`:377`) silently reads the new label's dropped count as 0.
   - Its numbering (`:380-415`) assumes position k is entry dropped + k, which only a single ring gives.
   - Together these can make E-AND pass vacuously.
   - Adding the file is a twelfth-file Scope change, not a dependency, lockfile or workflow, but it departs from item 2's "eleven files" and is the advisor's call. My recommendation is OPEN-1 (a). The form's §7 and §9 already carry it.
2. **What the code did not settle:**
   - Whether a first look adds any entry of the other kind. By reading it does not. MEASURE' measures it exactly once the stream ring is full, and S7 applies if it does.
   - Whether the untiled query is recorded before `openPath` returns, which makes the figures lower bounds.
   - Whether `setViewportSize(1920×1080)` emulates faithfully in WebView2. The precedent covers 1366×768 only.
   - Whether the e2e hooks are installed in a measure build. R1 avoids the claim.
   - The open drawer's cost at 512 entries (OPEN-5). Item 1 rejected (a) for this same unmeasured risk, and (c) raises the held ceiling to 512 too. Stated so that the advisor rules it knowingly.
3. **The design departs from the note in three places:**
   - the merge goes in `recorder.entries()` (OPEN-3);
   - `droppedCount` takes a required lane to satisfy the caller rule, which edits one line of an existing recorder test (the note said none);
   - GROUP's capacity check at `console.mjs:734` is left unchanged (sound as it is).
4. **The placeholder state.** Today's label (`ConsolePanel.tsx:65-68`) carries no `[P6 placeholder]` mark, so under item 4 the new label carries none. It is still unsighted by the human; that is OPEN-9.
5. **"The Console registry's row"** is read as the `binding_pick_project_folder` row of `surfaceRegistry.ts` (item 19's effect text, ADV-2026-11-21-08 item 3). If the advisor meant another row, R1 moves to it.
6. **ADV-2026-11-22-17 is not on main.** It must be filed under `state/directives/` before the form is committed (nothing tracked may cite an untracked file as Authority). §0.1 then names its path.
7. **Docs-lane notes, no edit here.** `frontends/shell/e2e/README.md:280` ("the recorder's 256") and `:896` ("The Console ring keeps 256 entries") stay true per ring. They read better with "each ring's" at the next piece that edits that file.
8. **Proposed PLAN entry** (no double quote, backtick or backslash):
   - title: Console: a second ring of 256 for data requests, cancels and session-log lines (known limitation 67)
   - summary: Option (c) of ADV-2026-11-22-17: viewport_query, cancel and binding_log_session_event entries keep a ring of their own, the label shows both drop counts, and the Console suite measures what one first look adds; full form, both gates; the merge waits for the v0.2 tag.

**Files read** (all at `C:/dev/wt/read-1122`, main 466318621a13, except the ruling's copy):
- `<S>/adv-2026-11-22-17-copy.md`
- `state/consults/2026-11-22-console-piece-limitation-67-design-note-architect.md`
- `state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-08-…md`, `…-adv-2026-11-19-16-…md`, `2026-11-21-advisor-ruling-adv-2026-11-21-15-…md` and `…-adv-2026-11-21-08-…md`
- `KNOWN-LIMITATIONS.md` (items 61 to 69)
- in `frontends/shell/src/console/`: `recorder.ts`, `surfaceRegistry.ts`, `consoleViewModel.ts`, `ConsolePanel.tsx` and `collapsedCountSync.ts`; `recorder.test.ts`, `surfaceRegistry.test.ts`, `collapsedCountSync.test.ts`, and `consoleViewModel.test.ts` (part)
- `frontends/shell/src/skp/client.ts` and `frontends/shell/src/diagnostics/log.ts`
- `frontends/shell/e2e/console.mjs`, and `frontends/shell/e2e/command-bar.mjs` (`:340-419`, plus greps)
- `frontends/shell/e2e/reopen.mjs` (`:130-169`) and `frontends/shell/e2e/README.md` (`:276-283`)
- `frontends/shell/src/admission/AdmissionPanel.tsx` (`:290-345`), `frontends/shell/src/App.tsx` (`:890-904`) and `frontends/shell/src/isInstrumentedBuild.ts` (grep)
- `kernel/tests/manual_walkthrough_fixtures.rs` (`:36-65`, plus grep)
- `docs/01_Principles.md`, `docs/PREREGISTRATION-TEMPLATE.md`, and `governance/AUTONOMY.md` §21, §22 and §31
- `governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md`, and `governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md` Amendment 5
- greps over `frontends/shell/src`, `frontends/shell/e2e`, `src-tauri/tauri.conf.json` and `docs/`
