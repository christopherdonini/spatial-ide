*The architect's second draft of the Console piece's full form, after ADV-2026-11-22-20 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-20-the-console-forms-twelfth-file-test-code-only-two-rings-of-256-kept-the-open-drawers-frame-time-measured-after-the-sitting.md`), tag node:console-stream-lane-limitation-67@form-draft-2, read only at main 466318621a13f00ae7b1114a4690582be42bdc94 in a detached read checkout. Not a form and not committed as one: its OPEN-10 goes to the advisor before the form is committed. Filed by the custodian below the rule from its second hand-back in its transcript, 49001 bytes, sha256 f4cd3ad55f14b786e1524951592cc8637847f20127cda2294e54d5050b4412ec, byte for byte. Its run, from its start to that hand-back: Read 45, Grep 37, SubagentHandback 2, Glob 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-22T15:52:01Z to 2026-11-22T16:25:07Z by its transcript; 0 calls named the main checkout; 1 compaction (its resumption at the custodian's message).*

---

REPORT PATH: state/consults/2026-11-22-console-stream-lane-full-form-architect-draft-2.md
Reviewed: detached read worktree `C:/dev/wt/read-1122` @ 466318621a13f00ae7b1114a4690582be42bdc94 (main). Tag `node:console-stream-lane-limitation-67@form-draft-2`.

# console: data requests, cancels and session-log lines get a ring of 256 of their own, and the label shows both drop counts (known limitation 67); full form, both gates

*Proposed file: `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md`. Proposed PLAN node: `console-stream-lane-limitation-67`.*
*Drafted by the architect (claude-opus-5-5) on the custodian's briefs (tags `node:console-stream-lane-limitation-67@form-draft-1` and `@form-draft-2`). It was read only, in the detached read worktree at main 466318621a13f00ae7b1114a4690582be42bdc94. Nothing was run. The custodian commits this form as its own commit, before any code, after OPEN-10 is ruled (ADV-2026-11-22-20 item 2, last sentence).*
*Append-only once committed. Self-references are by section, amendment and item, never by line.*
*Form: full, both gates from dispatch (ADV-2026-11-22-17 item 2).*

## §0 Disclosure

**0.1 Authority.** These are the advisor's rulings under the delegation of 2026-11-13, not the human's words. Each is paraphrased unless marked.
- ADV-2026-11-22-17 (to be filed under `state/directives/` before this form is committed):
  - item 1: option (c);
  - item 2: the class (full form, both gates), the Scope as the design note's eleven files, and the merge held for the tag;
  - item 3: the measurement of entries;
  - item 4: the words, which are my drafts for the advisor to approve or replace after this form's gate;
  - item 5: item 67's comment names ADV-2026-11-19-16 item 2;
  - item 6: the registry row's comment;
  - item 7: nothing is reserved, but a dependency, lockfile or workflow goes to the advisor before commit.
- ADV-2026-11-22-20 (to be filed under `state/directives/` before this form is committed):
  - item 1: `frontends/shell/e2e/command-bar.mjs` joins the Scope as a twelfth file, test code only. The ceiling of 850 over twelve files stands. E-AND keeps its meaning. The change has its own mutation. This closes OPEN-1 as (a).
  - item 2: OPEN-5 closed by direction. The design keeps two rings of 256. A frame-time step joins the build's evidence. This form declares beforehand which result sends the piece to two rings of 128, with the bound named from docs/08 (§6.3).
  - item 3: L1, K1, K2 and R1 stay my drafts for after the gate, and OPEN-6 stays open.
- ADV-2026-11-21-15 item 1 (the merge waits for the tag or the human's word), item 4 (i) (the order) and item 5 (the registry row's comment).
- ADV-2026-11-19-08 item 6 and ADV-2026-11-19-16 item 2: item 67's present words.
- ADV-2026-11-21-08 item 3: what the registry row's comment names.

**0.2 Evidence, not Authority.**
- The design note: `state/consults/2026-11-22-console-piece-limitation-67-design-note-architect.md`.
- `KNOWN-LIMITATIONS.md` item 67 (`KNOWN-LIMITATIONS.md:525-527`; pin: hash by the custodian).
- Amendment 5 of `governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md` (its item 3 to item 6), which defines E-AND's present reading and its mutations M-A4-1, M-A4-3 and M-X2.
- docs/08's frame-time budget and measure: `docs/08_Testing.md:5`, `:11` and `:36` (pin: hash by the custodian).
- The canvas's frame-time instrument:
  - `frontends/shell/src/instrument/residencyInstrument.ts:54-58` (the per-render series);
  - `frontends/shell/src/canvas/WorkingCanvas.tsx:1708-1709` (its call site);
  - `frontends/shell/e2e/residency-harness.mjs:1121-1137` (`frameTimeStatsMs`; pin: hash by the custodian).
- `frontends/shell/RESULTS.md:160-171`, a historical record of that measure at the commit that section names. It is not read as current.

**0.3 The reuse index.** Byte-copied from the custodian's first brief, and marked so here. It is the output of `tools/reuse.mjs` in the read-only reuse clone at 89bbac37, run by the custodian on 2026-11-22, exit 1. The brief is not tracked, so this is evidence, not Authority.

```text
No prior art recorded for "console ring buffer eviction". Research it before planning an implementation.
```

The search missed. In this repository the prior art is the recorder's own drop-with-count ring, which is modelled on `engine/src/trace.rs`'s bounded buffer (`frontends/shell/src/console/recorder.ts:273-281`).

**0.4 Cites.** Every cite is path:line at 466318621a13. Line ranges are reading aids, not pins, except where marked "pin: hash by the custodian". At dispatch the tree at the dispatch base is authoritative, and stop S1 checks it.

**0.5 The twelfth file** (closed by ADV-2026-11-22-20 item 1).
- `frontends/shell/e2e/command-bar.mjs:377` holds `LABEL` and `parseLabel`. Its E-AND reading (`:380-415`, used at `:479-490`) numbers each rendered entry as dropped + position.
- Under two rings, the regex reads the new label's dropped count as 0, and position stops being the entry's number. E-AND could then pass on nothing.
- The file is in §7 as test code only, and §2.5 re-reads E-AND.

## §1 What this may and may not claim

**May claim:**
- An entry named `viewport_query` or `cancel` (class A), or `binding_log_session_event` (class B), is held in the stream ring. Every other entry is held in the other ring.
- Each ring holds at most M = `MAX_CONSOLE_ENTRIES` entries (256, or 128 if §6.3 sends the piece there) and evicts its own oldest entry, counted against that ring.
- No entry of one ring is ever evicted by an entry of the other.
- `count()` plus both rings' drop counts equals every entry recorded since the recorder was created. The label shows the held count, the total dropped, and each ring's share.
- The display shows every held entry, oldest first by `seq`.
- What one first look adds to each ring, for the datasets and windows of §6.1, as measured by MEASURE'.
- The frame time p50/p95 of one first look with the drawer open and both rings full, at B and at H, on the reference machine, by §6.2. These are measured figures, not a budget met.

**May not claim:**
- Any docs/08 budget met or missed, beyond what §6.2's figures show, and no docs/08 row.
- That every entry a first look adds is of the stream kind. That is by reading; MEASURE' checks it, and S7 applies if it is wrong.
- That grouping is unchanged. Two runs of one entry that were separated by stream entries become one group when those entries are dropped (§2.3 item 6; VL3).
- Any wire change, any change to `call()`'s capture site or `logSessionEvent` (not c2), or any ADR amendment.

**ADRs cited, none amended:**
- ADR-024: classification by name only; no argument object reaches the recorder.
- ADR-006: no operation is added.
- ADR-010 rule 6: M is declared at its site.

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
- `call()` records at `frontends/shell/src/skp/client.ts:59`;
- `viewportQuery` sends `"viewport_query"` at :119, and `cancel` sends `"cancel"` at :133;
- `logSessionEvent` calls `recordNamed("binding-command", "binding_log_session_event")` at `frontends/shell/src/diagnostics/log.ts:21`.

**The count sync** (`frontends/shell/src/console/collapsedCountSync.ts`):
- `CountableRecorder` at :27-31;
- `ConsoleCountSnapshot { count, dropped }` at :33-36;
- `attachCollapsedCountSync` at :50-69.

**The panel** (`frontends/shell/src/console/ConsolePanel.tsx`):
- the snapshot state at :41;
- the expanded sync at :48-59, which reads `entries()` at most once per frame through `coalesceOncePerFrame`;
- the label at :64-68 (pin: hash by the custodian);
- the group key at :96;
- `ConsoleGroupRow` at :106-133;
- the disclosure toggle, which records `console.togglePanelExpanded` at :79.

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
- `frontends/shell/e2e/console.mjs`: `readConsoleLabel` at :241-248, the mirror at :67-71, GROUP's capacity check at :733-736, `runStep` at :1008-1019, and the step list at :1045-1056;
- `frontends/shell/e2e/command-bar.mjs`: :374-415, and `stepAnd` at :470-490.

**The frame-time measure:**
- the hooks `residencyInstrumentSetEnabled`, `residencyBeginStep`, `residencyArmFirstPixel`, `residencyEndStep` and `residencyDisarmFirstPixel` (`frontends/shell/src/e2e-test-surface.ts:206-290`);
- `percentileNearestRank`, exported from `frontends/shell/e2e/residencyTrace.mjs` (imported at `residency-harness.mjs:79`);
- `attachOrLaunchExe` (`frontends/shell/e2e/lib.mjs:254-296`);
- `build:measure` (`frontends/shell/package.json:54`).

**Today's label carries no placeholder mark.** `ConsolePanel.tsx:65-68` builds the label with no `[P6 placeholder]` text. By contrast, the registry statements carry it (for example `surfaceRegistry.ts:205`). Under ADV-2026-11-22-17 item 4, the new label also carries none.

### 2.2 Before

There is one ring for every kind of entry. A load's tile requests and terminal lines push out the user's recorded steps and other actions. That is item 67.

### 2.3 After (product code, in `console/` only)

**1. The registry** (`surfaceRegistry.ts`):
- `ClassARow` and `ClassBRow` gain an optional `readonly lane?: "stream"`, with a doc comment.
- Exactly three rows carry it: `viewport_query`, `cancel` and `binding_log_session_event`.
- One new export, `isStreamLaneName(kind: "skp-request" | "binding-command", name: string): boolean`, is derived from the marked rows. Its product caller is item 2.
- The file still imports nothing.

**2. The recorder** (`recorder.ts`):
- `export type ConsoleLane = "stream" | "other"`.
- Two arrays and two counters, one per lane.
- `push` picks the lane:
  - an `skp-request` with a `command`, or a `binding-command`, goes to the stream ring when `isStreamLaneName` says so;
  - a `gui-action`, and a `record()` with no `command`, go to the other ring.
- When the chosen ring holds `MAX_CONSOLE_ENTRIES`, its oldest entry is shifted out and its counter is incremented in the same synchronous call.
- `MAX_CONSOLE_ENTRIES` stays `256`. Its doc says it is each ring's size, and names §6.3 as the one declared route to 128.
- `droppedCount(lane: ConsoleLane): number`. The lane is required, and the no-argument form goes.
- `count()` is the sum, O(1).
- `entries()` is a two-pointer merge by `seq`, oldest first, in a fresh array, O(n) (OPEN-3).
- The runtime import of `isStreamLaneName` replaces the header sentence at :25-29. There is no cycle.
- The doc of `MAX_CONSOLE_ENTRIES`, `push` and `entries()` is rewritten. My draft for the invariant sentence, which is not the human's wording:
  > "What IS true by construction: each ring never grows past MAX_CONSOLE_ENTRIES and evicts only its own oldest entry; the recorder never blocks and never silently truncates -- every eviction is counted against its own ring, and count() plus droppedCount("stream") plus droppedCount("other") is every entry recorded."

**3. The count sync** (`collapsedCountSync.ts`):
- `CountableRecorder.droppedCount(lane)`.
- `ConsoleCountSnapshot` becomes `{ count, droppedStream, droppedOther }`, read once per frame as today.

**4. The label:**
- A pure `consoleLabelText(snapshot)` goes in `consoleViewModel.ts`. Its product caller is `ConsolePanel`.
- `ConsolePanel` calls it, initialises its snapshot with all three counts at zero, and reads both lanes in its expanded sync.
- The text is §2.4 L1.

**5. Unchanged:**
- `client.ts`, `log.ts` and every capture site;
- `recordNamed` and both allowlists;
- `render.ts`;
- every registry string;
- the standing header;
- `groupConsecutiveEntries`;
- `coalesceOncePerFrame`.

**6. Grouping after a drop** (by reading; VL3; OPEN-4):
- Groups never cross lanes.
- When the stream entries that separate two runs of one other-kind entry are dropped, the runs form one group keyed by the earlier run's first `seq`. The later run's open state is lost.

**7. The e2e readers:**
- `console.mjs`:
  - `readConsoleLabel` parses the new grammar. It returns `count: null` when the text contains `dropped` but the full form does not match, or when the total is not stream plus other.
  - The mirror's comment says "each ring's size".
  - GROUP's check is unchanged (still sound).
  - New steps LABEL', MEASURE' (§6.1) and the FRAMES' mode (§6.2), and a `SKIP` status in `runStep`.
- `command-bar.mjs`: §2.5.

**Other checks.**
- docs/02: all changes sit in `console/` and two e2e suites.
- docs/10: no wire change.
- Principle 4 (`docs/01_Principles.md:10`): no entry is synthesised.
- Principle 7 and the "Never block the canvas" rule (`:13`, `:20`): `push` is bounded and synchronous. The open drawer can hold 2M entries, and §6.2 measures that cost against §6.3's declared bound (ADV-2026-11-22-20 item 2).

### 2.4 Words (none is the human's wording; each is a draft for the advisor after this form's gate)

**L1, the label (P6, unmarked as today):**
- No drops: `Console — N actions`, or `Console — 1 action`. Unchanged.
- With drops: `Console — N actions (D dropped: S of data requests, cancels and log lines; O of other entries)`.

Clause check:
- N is `count()`.
- D = S + O, computed in `consoleLabelText`.
- S is `droppedCount("stream")`, and the three nouns are the three marked names.
- O is `droppedCount("other")`.
- Both counts show whenever D > 0.
- N + D is every entry recorded.
- L1 names no M, so §6.3's route leaves it as it is.

**K1, item 67's bold line.** ⟨M⟩ is 256, or 128 by §6.3. ⟨H⟩ is filled by rule W (§6.1).
> "67. **The Console keeps its newest ⟨M⟩ data requests, cancels and session-log lines apart from its newest ⟨M⟩ other entries, and one load of a view can add more than ⟨H⟩ of the first kind.**"

Clause check: the two rings and M are §2.3 items 1 and 2 (CL2). The session-log lines are `log.ts:21`. ⟨H⟩ is from MEASURE' at the head that lands.

**K2, item 67's paragraph.** The ruled clause is kept whole, brackets included.
> "The Console keeps two kinds of entry apart. Data requests (the viewport_query rows), cancels (the cancel rows) and the app's lines to the session log (the binding_log_session_event rows) are one kind; every other entry is the other kind. It keeps the newest ⟨M⟩ of each kind. When a kind is full, each new entry of that kind drops that kind's oldest one, and the Console's label shows how many entries were dropped and how many of them were of each kind. When the first data load of a view completes (after an open, an Apply or a Clear, for example), the map asks for tiles of that view. Each tile is asked for in a request of its own, and each request is an entry of the first kind. When a tile's load ends, other than by a cancel the app makes (after your Cancel, for example), the app writes a line to the session log, and that write is an entry of the first kind too. Panning and zooming ask for tiles in the same way. ⟨FIGURE⟩ So a load can drop the data requests, cancels and log lines before it, the request that an Apply or a Clear sent among them. It drops none of the other entries: the steps you recorded and your other actions stay until ⟨M⟩ newer entries of their own kind are recorded. Only the entry leaves the Console: the request was already sent, and a recorded step stays in the session's history. A group of entries you have opened closes again when its first entry is dropped. When the entries of the first kind that separate two runs of the same entry are dropped, the two runs show as one group, which is closed unless the earlier run was a group you had opened."

Clause check (as in the first draft):
- The kinds are §2.3 item 1, and the rows' headers are at `ConsolePanel.tsx:165` and `:187`.
- Each kind's ⟨M⟩ is item 2 (CL2, CL4).
- The label is L1.
- The tile-request and terminal clauses keep item 67's present code by symbol, unchanged.
- "drops none of the other entries" is by reading, checked by MEASURE' under S7; within the other ring it is CL1.
- Group closing is `ConsolePanel.tsx:96`.
- Joined runs are §2.3 item 6 (VL3).

**K3, item 67's comment:** the worker's words, by symbol. It must:
- give the provenance: ADV-2026-11-19-06 item 5, corrected in ADV-2026-11-19-08 item 6, with the tile-load clause replaced in ADV-2026-11-19-16 item 2, and rewritten under ADV-2026-11-22-17 item 4, with the advisor's ruling on these words named by id;
- name, by symbol: `MAX_CONSOLE_ENTRIES`, `push`, `droppedCount` and `entries`; `isStreamLaneName` and the three `lane` marks; `consoleLabelText`; `ConsoleGroupRow` and the group key; and the present clauses' symbols, kept;
- name ⟨FIGURE⟩'s source (the MEASURE' report's path and commit), and the FRAMES' report's path and commit, which sets ⟨M⟩;
- keep the 110-tile history and "Not examined: how many entries a cancelled tile request adds".

**R1, the comment on the `binding_pick_project_folder` row** (the architect's words; a source comment, not shown):
> "// In an instrumented build only (isInstrumentedBuild), a folder that a test hook of src/e2e-test-surface.ts puts in a one-shot slot is taken once in place of this picker's answer: e2eFolderRef in AdmissionPanel (through takeSlot, for a reopen) and e2eSaveFolderRef in App (for a save). In a plain build both slots are always null, so the picker's own answer supplies the folder (ADV-2026-11-21-08 item 3; ADV-2026-11-21-15 item 5)."

Clause check (unchanged from the first draft):
- `AdmissionPanel.tsx:294-300`, `:340`, `:387`, `:444`;
- `App.tsx:894-903`;
- `takeSlot` returns `pick()` when the slot is null.

The gate confirms the reopen call site, and that the hooks are not installed in a plain build.

### 2.5 E-AND after card B, re-read (ADV-2026-11-22-20 item 1; test code only)

**Its meaning, as the ruling gives it.** The advisor's words, byte-copied from the ruling's copy (sha256 d4c8856351288b6250ebee06a6e4b1e6e2f8a1b949dee9849cbbcf7477b83d8c), marked so: "E-AND keeps its meaning: card B's commit added exactly one `record_step` row, at ok. Where it cannot tell, it fails by name, as today. It does not pass."

**The reading:**
- **(a) R0.** At `label0`'s present position (`command-bar.mjs:479`, after card A's wait), the step reads in one `page.evaluate`:
  - the label, parsed, giving O₀, the other-kind drop count;
  - every `record_step` row as `stepKey` and outcome.

  The reading is repeated, clicking closed groups and waiting two frames, until no closed group remains, bounded to 30 s.
- **(b) R1.** After card B's map settles and the map checks are made (`:484-487`), the same reading gives O₁ and rows₁. It is repeated until the newest row is `ok`, bounded to 30 s.
- **(c) The decision**, in this order:
  - label unreadable at R0: F1;
  - label unreadable at R1: F6;
  - O₁ ≠ O₀: F2′;
  - rows₀ not the first rows of rows₁: F5;
  - otherwise added = rows₁ after rows₀, and F4 applies unless added is exactly one row keyed `filter:` + `ZONE_AB` at `ok`.
- **(d) Where it cannot tell, and how it fails** (every case fails by name; none passes):
  - an other-kind entry dropped between R0 and R1, so a row card B added may be gone (F2′);
  - no reading with every group open and the newest row `ok` within 30 s (F3′);
  - a label that does not parse (F1, F6);
  - readings that disagree on rows both hold (F5).
- **(e) Why this needs no timing** (by reading): a load adds only stream entries, which never evict the other ring (CL1). If O₁ = O₀, every row of R0 is still held, in order, and every row recorded after it is held.
- **(f) Texts** (test strings):
  - F1 is unchanged.
  - F2′: `E-AND: cannot tell how many record_step rows card B's commit added: <n> entries of the other kind were dropped between the reading after card A's wait and the reading after card B's map settled (label then: <text>; now: <text>)`
  - F3′: `E-AND: within 30000ms of card B's map settling no reading had every group open with the newest record_step row at ok (<last reading>)`
  - F4 is unchanged.
  - F5: `E-AND: the record_step rows read after card A's wait are not the first rows read after card B's map settled (<rows0>; <rows1>)`
  - F6: `E-AND: the Console's label could not be read after card B's map settled (<text>)`
  - PASS: `card B's commit added exactly one record_step row, at ok (Console after card A's wait: <text>; after card B's map settled: <text>)`
- **(g) Removed:** `readConsole` and `watchConsole` (`:380-415`).
- **(h) Unchanged:** `waitCommitted` and `readRecordStepRows`. `LABEL` and `parseLabel` follow L1.

## §3 Fixtures

- **Unit tests:** none. They use real `ConsoleRecorder` instances.
- **E2E:**
  - `filter-zoned.parquet`: 2,000 features (`console.mjs:35`).
  - `100k-happy-path.parquet`: 100,000 features (`kernel/tests/manual_walkthrough_fixtures.rs:44-55`).
  - Both are under `target/fixtures/manual-walkthrough/`, and both are sha256-hashed before and after each measured run. A missing fixture is S9.

## §4 Tests and mutations

Each mutation is applied, the named tests are run and seen to fail by name, and the failing line and the commit are recorded. Then it is reverted. No `verify-mutation` run is called an observation (round 25 item 2). Every new test is written against `MAX_CONSOLE_ENTRIES` (M), never the literal 256, so §6.3's route edits no test. Figures are given at M = 256.

**New unit tests:**

| Id | File | Asserts | Red at the base because | Mutation (fails it) |
|---|---|---|---|---|
| CL1 | recorder.test.ts | one `record_step`, then 300 × (`viewport_query` + `binding_log_session_event`): the `record_step` is held by reference; stream dropped = 600 − M (344); other dropped = 0; `count()` = M + 1 | the single ring evicts it | M-1: every entry to the other lane |
| CL2 | recorder.test.ts | 300 gui-actions and 300 cancels, interleaved: each holds its newest M (oldest held is number 301 − M); `count()` = 2M; each lane dropped 300 − M | cap M overall | M-2: the capacity check reads `count()` |
| CL3 | recorder.test.ts | O₀, 300 `viewport_query`, O₁: `entries()` starts at O₀, ends at O₁, and seqs strictly increase | O₀ evicted | M-3: concatenation in place of the merge |
| CL4 (never silently truncates, across both rings) | recorder.test.ts | 3,000 seeded entries over seven names. After each record: `count()` + both drop counts = recorded, and each lane holds ≤ M. Every 100 records and at the end: the absent seqs number the sum of the drop counts, and the absent stream-name seqs number exactly `droppedCount("stream")` | `droppedCount` ignores its argument | M-4: stream eviction not counted |
| CL5 | recorder.test.ts | per name, M + 1 entries: only the matching lane's counter is 1 | both read 1 | M-5: `cancel`'s mark removed |
| SR1 | surfaceRegistry.test.ts | `isStreamLaneName` holds for exactly the three names; no class-C row has `lane` | the export is absent | M-6: a mark added to `describe` |
| VL1 | consoleViewModel.test.ts | no-drop labels for 0, 1 and 5 | the export is absent | M-7: the drop clause always shown |
| VL2 | consoleViewModel.test.ts | `{300, 45, 5}` gives L1 with 300, 50, 45, 5 | the export is absent | M-8: D written as S |
| VL3 | consoleViewModel.test.ts | real recorder: `record_step` A, `viewport_query`, `record_step` B, then M × `viewport_query`: the first group is [A, B] | all evicted | M-9: grouping breaks on a seq gap |
| CC1 | collapsedCountSync.test.ts | fake, stream 3 and other 2, gives `{0, 3, 2}` | the fields are absent | M-10: S read from the other lane |
| CC2 (the real shape) | collapsedCountSync.test.ts | a real recorder, one `record_step` + 300 `viewport_query`: `{M + 1, 300 − M, 0}` | as CC1 | M-10 |

**Existing tests edited** (named; red at the base under the new interface):
- `recorder.test.ts`, "evicts the oldest entry once MAX_CONSOLE_ENTRIES is exceeded, counting every drop": `droppedCount()` becomes `droppedCount("other")`.
- `collapsedCountSync.test.ts`:
  - `fakeRecorder`;
  - "fires once immediately on attach with the current snapshot";
  - "onCount is the ONLY function this module ever calls…": the key list becomes `["count","droppedOther","droppedStream"]`;
  - "a burst of recorder notifications within one frame…";
  - "count() is read at most once per onCount call…";
  - "reflects droppedCount() in the snapshot".

**Existing tests declared unedited:**
- every other test in `recorder.test.ts`;
- `consoleViewModel.test.ts`'s existing tests;
- `surfaceRegistry.test.ts`;
- `soleCaptureSite.test.ts`, `surfaceCompleteness.test.ts`, `renderTruth.test.ts` and `consoleLanguage.test.ts`;
- `RefusalBlock.test.tsx`;
- `App.command.test.tsx`, `App.layout.test.tsx`, `App.recording.test.tsx`, `App.selection.test.tsx` and `App.table.test.tsx`. Their `entries().slice(count())` marks hold whenever no ring evicts (by reading).

**E2E:**
- **LABEL'** (`console.mjs`, after UNCLASS'). It opens `filter-zoned.parquet` once more, settles, reads the label, and asserts that it parses, that D = S + O, and that S > 0. Otherwise it fails with `LABEL': the stream ring did not overflow in this run; the label's drop form was not exercised`. M-11 (S and O swapped in `consoleLabelText`) fails it at S > 0.
- **E-AND** (`command-bar.mjs`, §2.5). The E-AND change's own mutations (ADV-2026-11-22-20 item 1):
  - M-CB1: `MAX_CONSOLE_ENTRIES = 8`. Predicted F2′, because card B's `record_step` and the readings' own toggle entries evict from a full other ring of 8. If an earlier step fails first, that is recorded as class 2 and M-CB1 is unobserved for E-AND.
  - M-CB2: M-11 applied. Predicted F2′, because card B's load adds stream drops between R0 and R1, which the swapped label reports as O. By reading; it needs a full stream ring before card B, which the suite's earlier loads give.

  The carried mutations, re-predicted under §2.5:
  - M-A4-1 fails at card A's wait, on the unchanged line `command-bar.mjs:478`.
  - M-A4-3 gives F4 with n = 2, both rows `filter:` + `ZONE_AB`.
  - M-X2 gives F4 with n = 2, A then the combined text.

  The unmutated run passes with §2.5's PASS text. Any other failing line is class 2.
- **FRAMES'** (§6.2) asserts only its preconditions. M-F1 (the fill count 257 cut to 9) fails it at the precondition, by name.

## §5 Predictions, declared unchanged, falsification

**Predictions:**
- P1: the tests' commit, run at the base, gives every new and every edited test red, at its reason.
- P2: each mutation fails its tests (§4).
- P3: every test declared unedited passes unedited, and `npm run verify` passes.
- P4: §9.3's e2e rows pass: LABEL' with S > 0, and E-AND under §2.5.
- P5: in MEASURE', every settled run gives other-added = 0, and the 1280 by 800 runs on `filter-zoned.parquet` give stream-added ≥ 220. Whether any run reaches M is not predicted.
- P6: §7 holds.
- P7: FRAMES' gives valid runs at B and at H. Which side of §6.3's rule the result falls is not predicted.

A wrong P1 to P5 or P7 is class 2. A wrong P6 is class 8.

**Declared unchanged:**
- `skp/client.ts`, `diagnostics/log.ts`, `streaming/**`, `residency/**`, `instrument/**`, `App.tsx`, `AdmissionPanel.tsx`, `WorkingCanvas.tsx` and `render.ts`;
- `e2e-test-surface.ts`, `e2e/README.md`, `e2e/lib.mjs`, `e2e/residencyTrace.mjs`, `e2e/residency-harness.mjs`, and every suite other than the two named;
- `protocol/**`, `styles.css`;
- every registry string and the standing header;
- `package.json`, every lockfile and every workflow.

**Falsification:**
- an entry evicted by the other lane;
- D ≠ S + O;
- a first look adding an other-kind entry (S7);
- CC2 failing against the real recorder;
- E-AND passing under M-X2, M-CB1 or M-CB2.

## §6 Instruments, the measurements and the rules

**6.1 MEASURE' and rule W** (entries per first look; ADV-2026-11-22-17 item 3). These are unchanged from the first draft:
- opt-in through `CONSOLE_MEASURE=1`, and a SKIP line without it (precedent `e2e/README.md:762`);
- two datasets, then four windows (1280×800, 1024×640, 1366×768, 1920×1080), three runs each, 24 runs;
- P0 and P1 label readings, with the exact split once S > 0;
- output to `frontends/shell/e2e/out/console-measure-<ms>.json` (`e2e/out/` is ignored at `frontends/shell/.gitignore:1`);
- rule W's ⟨H⟩ and ⟨FIGURE⟩ as written there, with "256" read as M;
- S7 on any other-added > 0.

MEASURE' runs at the head that lands. If §6.3 sends the piece to 128, it runs again at that head.

**6.2 FRAMES'** (ADV-2026-11-22-20 item 2). This is the frame time with the drawer open during one first look, at B and at H, by the measure docs/08 uses for the canvas.
- **The measure, named from docs/08:**
  - "frame time p50/p95" (`docs/08_Testing.md:36`), bounded by "≤ vsync interval, zero dropped frames" (`:5`), on "the fixed reference hardware profile's own refresh rate" (`:5`), and "tested on fixed reference hardware profiles so numbers are comparable across commits" (`:11`).
  - The canvas's implementation of it is the residency instrument's per-render series (`residencyInstrument.ts:54-58`; one stamp per real deck render, `WorkingCanvas.tsx:1708-1709`). Its statistic is the nearest-rank p50/p95 over consecutive deltas (`residency-harness.mjs:1121-1137`).
  - FRAMES' uses that instrument through its hooks, and computes the same statistic with `percentileNearestRank` imported from `residencyTrace.mjs`. The fifteen lines of `frameTimeStatsMs` are reproduced in `console.mjs`, and the gate compares them with `residency-harness.mjs:1121-1137` (OPEN-11).
- **Where and when:**
  - after the sitting, on the reference machine, under the machine's holds, by the Sonnet tester;
  - an exclusive hold is recommended for a timing run, and is the custodian's to take.
- **Builds:**
  - B is a measure build (`npm run build:measure`) made in a second worktree detached at the dispatch base, `C:/dev/wt/console67-base`, target `D:/wt-targets/console67-base`.
  - H is a measure build made in the piece's worktree at the gated head.
  - Both exes are sha256-hashed.
- **The driver:** H's `console.mjs` in FRAMES' mode (`CONSOLE_FRAMES=1 --measure-build <exe>`). It launches the exe itself with `attachOrLaunchExe` and refuses an app already listening (precedent `open-fills-fit-view.mjs:57`, `:124`). It runs only FRAMES'. It reads only the label's leading count, which both grammars share, so one driver serves B and H.
- **The display:**
  - before the first run the tester records the reference display's refresh rate from the display settings, as V = 1000 / Hz ms;
  - a variable or power-saving refresh is S12.
  - The window is 1280×800, the shipped size, and the dataset is `100k-happy-path.parquet`.
- **The order:** ten launches, alternating B, H, B, H and so on, starting with B. Five per arm.
- **One launch:**
  1. a warm-up `openPath` and settle (quiet 3000 ms, bound 60 s), which fills the stream ring at H;
  2. 257 clicks on `.console-disclosure`, two frames apart. Each click records `console.togglePanelExpanded`, so the other ring is full at H and the single ring at B, and the drawer ends open;
  3. the precondition: `aria-expanded` is `true`, and the label's leading count is 2M at H and M at B. Otherwise the run fails by name;
  4. `residencyInstrumentSetEnabled(true)`, `residencyBeginStep("console-frames")`, `residencyArmFirstPixel(60000)`;
  5. `openPath(100k-happy-path.parquet)`, which must be `admitted`;
  6. a settle with in-flight 0 (the harness's criterion, `residency-harness.mjs:53-57`);
  7. `residencyEndStep()` and `residencyDisarmFirstPixel()`.

  It records, from `frameTimestamps`: p50, p95, max, the sample count and the truncation flag.
- **A run is valid** when it settled, has at least 2 samples, and is not truncated. An invalid run is repeated once in its slot. A second invalid run in one slot is S14.
- **Output:** `frontends/shell/e2e/out/console-frames-<ms>.json` (ignored), with every run and V. The tester copies it into its report under `state/consults/`.

**6.3 The declared rule: what sends the piece to two rings of 128** (fixed before any run; ADV-2026-11-22-20 item 2).

For each arm, take the median over its five valid runs of the per-run p50 (m50) and of the per-run p95 (m95).
- **F-a, named from docs/08:5 alone.** If, at either percentile, B's median is ≤ V and H's is > V, the piece goes to 128. H then misses the docs/08:5 bound where today's code meets it.
- **F-b, the case where today's code already misses V.** If, at either percentile, H's median exceeds B's by more than V, the piece goes to 128.
  - This bound is my derivation, not a bound docs/08 names. docs/08:5 counts in vsync intervals and asks for zero dropped frames, so one more interval at a rank is one more dropped frame at that rank. docs/08:3 says regressions fail the build, but it names no tolerance, and `:20-21` records that enforcement as owed.
  - The case is not hypothetical. `frontends/shell/RESULTS.md:169-170` records today's design far over V during streaming steps, at that section's commit.
  - So per ADV-2026-11-22-20 item 2's last sentence, F-b comes to the advisor before the gate (OPEN-10).
- **Otherwise** two rings of 256 stand.
- **The 128 route** (declared here, so it is not a scope addition):
  - one line in `recorder.ts` (`MAX_CONSOLE_ENTRIES = 128`) and the mirror at `console.mjs:71`, as commit 5;
  - the reviewer's narrow read;
  - §9.3's e2e rows and MEASURE' again at that head;
  - FRAMES' once more, at the 128 head against B, reported and not decided. A trip of F-a or F-b at 128 goes to the advisor; no third design is declared.
  - K1 and K2 take ⟨M⟩ = 128.

**6.4 Assertions:** every unit test, LABEL', E-AND, and the precondition and validity checks of FRAMES'. The bounds in §6 are harness bounds, not latency claims.

## §7 Declared values and the ceiling

- **No new constant.** `MAX_CONSOLE_ENTRIES` is each ring's size, declared at its site: 256, or 128 by §6.3 only.
- **The ceiling:** at most 850 changed lines, both numstat columns summed, over these twelve files (ADV-2026-11-22-20 item 1):
  - `frontends/shell/src/console/recorder.ts`, `surfaceRegistry.ts`, `consoleViewModel.ts`, `ConsolePanel.tsx` and `collapsedCountSync.ts`;
  - `recorder.test.ts`, `surfaceRegistry.test.ts`, `consoleViewModel.test.ts` and `collapsedCountSync.test.ts`;
  - `frontends/shell/e2e/console.mjs` and `frontends/shell/e2e/command-bar.mjs` (test code only);
  - `KNOWN-LIMITATIONS.md`.

  FRAMES' is test code in `console.mjs`, inside the same ceiling. §6.3's 128 route is two changed lines plus the words, inside it too. An overrun is class 8, nothing is cut or packed to fit, and this section is never edited.
- **Estimate, about 740 lines:**

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
  | console.mjs | 240 (150 plus FRAMES' at about 90) |
  | command-bar.mjs | 60 |
  | KNOWN-LIMITATIONS.md | 6 |
- **The measurement's files:**
  - its JSON goes under `frontends/shell/e2e/out/`, which is ignored and not tracked;
  - the tester's report goes under `state/consults/`;
  - the base worktree makes no commit and holds no edit.

  None of these enters the diff.
- **Counting, at a named commit:**
  - `git diff --numstat B...H --` over the twelve files;
  - `git diff --name-only B...H`, which names no other path than this form, `governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.*`, `site/**` and `state/**`.

## §8 Block-on-sight

1. Any edit to a capture site, `streaming/**`, `residency/**`, `instrument/**`, `App.tsx`, `WorkingCanvas.tsx`, `e2e-test-surface.ts` or `protocol/**`.
2. A lane chosen by anything but the entry's kind and name, or an argument object reaching the recorder.
3. An eviction not counted against its own ring, or a label showing one drop count without the other.
4. A new export with no product caller.
5. An existing test edited that §4 does not name. A new test with a literal ring size.
6. A shown string changed other than the label. A label text other than the advisor's approved words. A placeholder mark on the label.
7. Item 67's words landed with ⟨H⟩, ⟨FIGURE⟩ or ⟨M⟩ written other than by rule W and §6.3, or with the bracketed clause not whole.
8. Lanes asserted only against a fake, without CC2. E-AND decided on rows a ring may have dropped, or passing where §2.5 (d) says it cannot tell.
9. A dependency, lockfile or workflow change.
10. A line cut or packed to fit §7.
11. §6.3's rule edited after any FRAMES' run, a run dropped, or a run added beyond §6.2's repeats.
12. A FRAMES' figure called a docs/08 budget met.
13. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code landed before the amendment that declares it;
    - a `verify-mutation` run called an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id.
14. Record items:
    - quotation marks around text that is not byte-identical to its source;
    - a line cite into the ledger;
    - a bare self-line;
    - a pin read as current.

## §9 Gates

**9.1 Architect** (full):
- §8, item by item.
- The seam rule on five seams, each against its actual interface at the base:
  - the recorder to the registry (SR1, CL5);
  - the recorder to the count sync (CC2);
  - the snapshot to the label (VL1, VL2, LABEL');
  - the label to both e2e readers;
  - FRAMES' to the residency hooks and `percentileNearestRank`, as they exist at B and at H.
- §2.5 read against ADV-2026-11-22-20 item 1's sentence (§2.5's opening), case by case (§2.5 (d)).
- The caller rule.
- L1, K1, K2, R1 and K3 clause by clause against the built code. Rule W against MEASURE's JSON, and §6.3 against FRAMES's JSON.
- docs/01 (principles 4 and 7), docs/02, docs/08 (`:5`, `:11`, `:36`), docs/10, ADR-024, ADR-006 and round 25.

**9.2 Reviewer:**
- the full diff (`origin/main...HEAD`);
- M-1 to M-11, M-CB1, M-CB2 and M-F1 made again, with M-A4-1, M-A4-3 and M-X2 read from the tester's runs;
- §7 by its commands;
- `npm run verify` in a hold;
- the MEASURE' and FRAMES' JSON recomputed against their PASS notes, including the medians and §6.3's outcome;
- the reproduced `frameTimeStatsMs` compared with `residency-harness.mjs:1121-1137`.

**9.3 Suites:**
- `npm run verify` in `frontends/shell`, after `npm ci` there and in `renderer/bundle-viewer`;
- the `scripts/plan` node tests;
- verify cites, quotes (a floor) and test-claims;
- green CI.

E2E, at the gated head, through the suites' own launch on port 5180, by the Sonnet tester, with heavy runs taking turns. Each run's app stderr, report and session log are copied right after it.
- `e2e/console.mjs` twice: plain, then with `CONSOLE_MEASURE=1`.
- `e2e/command-bar.mjs`, plus its M-CB1 and M-CB2 runs.
- `e2e/recording.mjs`, `e2e/project.mjs`, `e2e/reopen.mjs` and `e2e/table.mjs`.
- FRAMES' (§6.2), on the measure builds through `attachOrLaunchExe`, after the sitting.

Any failed row is S6.

**9.4 Operator:** no Part. The label goes onto P6's sight list unmarked (OPEN-9).

**9.5 The PR body:**
- asks for a merge commit;
- names B, the rulings and the advisor's words;
- lists R1 and K3;
- gives §6.3's outcome with the FRAMES' report;
- states that the merge request waits for FRAMES', any 128 route, and the tag (ADV-2026-11-21-15 item 1).

## §10 Where it is built, the order and the model

- **Where:**
  - branch `cut/console-stream-lane`, worktree `C:/dev/wt/console67`, target `D:/wt-targets/console67`, data `D:/wt-data/console67`;
  - and, for B's measure build only, `C:/dev/wt/console67-base` with target `D:/wt-targets/console67-base`.
- **Commits:**
  1. This form.
  2. The tests (red at B).
  3. The code.
  4. (After the sitting and FRAMES') if §6.3 says 128, the constant and the mirror.
  5. Item 67's words, after rule W at the head that lands, by the custodian's script, words only. The reviewer reads it narrowly.

  A stop still pushes the branch as it stands. A worker pushes in a call of its own.
- **The base worktree** is swept once FRAMES' is reported (the disk floor).
- **Merging main in:** before the merge request. If that merge touches a §7 file, the reviewer makes a narrow read and §9.3's e2e runs again. FRAMES' runs again only if the merge touches `console/**`, `canvas/**` or `streaming/**`.
- **Model:** the standard worker and the Sonnet tester (OPEN-8).

## §11 Stops

Each stop is reported, and the custodian sends it to the advisor.
- S1: an interface of §2.1 differs at the dispatch base.
- S2: an existing test not named in §4 needs an edit.
- S3: a new test is green at B, or red for another reason.
- S4: an edit outside §7.
- S5: a §7 path in flight elsewhere, including item 67's region.
- S6: a failed e2e row.
- S7: MEASURE' gives other-added > 0, or a grammar disagreement.
- S8: `setViewportSize` fails, or the inner size differs.
- S9: a fixture is missing, or its hash changes.
- S10: a dependency, lockfile or workflow is needed.
- S11: a FRAMES' hook or `percentileNearestRank` is absent or differs at B or H, or the precondition fails at B.
- S12: the reference display's refresh is variable, lowered, or not recordable.
- S13: a FRAMES' trip at the 128 head (§6.3).
- S14: a slot invalid twice.

## §12 OPEN items

- **OPEN-1, the twelfth file.** Closed as (a) by ADV-2026-11-22-20 item 1 (§2.5, §7).
- **OPEN-2, where the lane is declared.** Recommended: the three registry rows.
- **OPEN-3, where the merge lives.** Recommended: `recorder.entries()`. The note placed it in `consoleViewModel.ts`.
- **OPEN-4, joined runs after a drop.** Recommended: keep and disclose (K2, VL3).
- **OPEN-5, the 2M held entries.** Closed by direction in ADV-2026-11-22-20 item 2 (§6.2, §6.3).
- **OPEN-6, the `binding_pick_file` row's `e2eFileRef` slot** (`AdmissionPanel.tsx:342`, `:395`). Recommended: one sentence in the same commit, by the advisor's word. Not ruled.
- **OPEN-7, MEASURE's shape.** Recommended as §6.1.
- **OPEN-8, the model.** Recommended: the standard worker and the Sonnet tester.
- **OPEN-9, the label at P6.** Recommended: unmarked, on the sight list.
- **OPEN-10, F-b's bound** (§6.3). docs/08 names the measure and the absolute bound F-a uses, but names no bound for an arm already over V. My derivation is one vsync interval between the arms' medians.
  - Alternatives: (i) F-a alone, which never fires while today's code misses V during a load; (ii) a docs/08 amendment naming a regression tolerance, which is the human's.
  - Recommended: F-b as drafted, with the noise below stated. Five runs per arm may not separate one interval: `RESULTS.md:167` records a p95 trial range of 1034.9 to 1630.0 ms on another workload, at that section's commit. F-b can then send the piece to 128 on noise. The advisor rules before the gate.
- **OPEN-11, where FRAMES' lives.** Recommended: `console.mjs`, which keeps the twelve files. The alternative is a drawer-open flag on `residency-harness.mjs`, a thirteenth file and class 9, which would use the harness's own statistic.

## §13 Amendments

*(Opens empty; append-only.)*

---END OF FORM---

**Note: what changed against the first draft, item by item**

1. **ADV-2026-11-22-20 item 1 (OPEN-1 closed as (a)):**
   - §0.1 names the ruling, and §0.5 records the twelfth file as closed.
   - §2.5 opens with the ruling's sentence (byte-copied from the copy, marked), adds §2.5 (d) naming each case where E-AND cannot tell and its failure, and adds F6 (an unreadable label after card B), which the first draft lacked.
   - §4 adds the E-AND change's own mutations, M-CB1 and M-CB2 (new), with their predictions.
   - §9.1 reads §2.5 against the ruling's sentence.
   - §12 records OPEN-1 closed.
2. **ADV-2026-11-22-20 item 2 (OPEN-5 closed by direction):**
   - New §6.2 (FRAMES') and §6.3 (the declared rule F-a and F-b, and the 128 route).
   - The measure is named from `docs/08_Testing.md:36` and its bound from `:5`, with the canvas's implementation by path:line.
   - F-a is named from docs/08:5 alone. **F-b's bound is not named in docs/08**; it is my derivation and goes to the advisor before the gate as OPEN-10. That is the case the ruling's last sentence covers, and I say so plainly in §6.3.
   - Other changes carried with it:
     - §1 adds the frame-time claim and its limit, and drops the "cost unmeasured" line;
     - §2.3 and the words read the ring size as M;
     - the new tests are written against M, so the 128 route edits no test;
     - §5 adds P7 and declares `instrument/**`, `WorkingCanvas.tsx`, `e2e-test-surface.ts`, `residencyTrace.mjs` and `residency-harness.mjs` unchanged;
     - §7's estimate rises to about 740 lines within 850, and names the measurement's files and why none enters the diff;
     - §8 adds items 11 and 12;
     - §9 adds FRAMES' to the suites and the reviewer's checks;
     - §10 adds the base worktree and commit 4 (the 128 route);
     - §11 adds S11 to S14;
     - §12 adds OPEN-10 and OPEN-11.
   - On the merge: the merge request waits for FRAMES', any 128 route and the tag; the tag holds it in any case.
3. **ADV-2026-11-22-20 item 3:**
   - L1 and R1 are unchanged.
   - K1 and K2 are unchanged except that 256 becomes ⟨M⟩, carried by item 2.
   - OPEN-6 and OPEN-9 are unchanged.
4. **A rule fix:** the first draft's files-read list named a user-profile scratch path, against the brief. It is written `<S>` here.

**For the advisor**

- **OPEN-10 needs a ruling before the gate.** F-b's tolerance (one vsync interval between the arms' medians) is derived from docs/08:5's unit, not named there.
  - With five runs per arm, noise of the size `RESULTS.md:167` records could trip it. That is a historical figure for another workload, and is not read as current.
  - If the advisor wants the bound in docs/08 itself, that is a docs/08 change and the human's.
- **"After the sitting":** the ruling does not say which sitting. I read it as the human's next operator sitting, and FRAMES' is placed after it. If another is meant, only §6.2's "when" moves.
- **FRAMES' does not exercise the worst case unaided:** an ordinary first look leaves the other ring nearly empty. §6.2 fills it with 257 drawer toggles first, so that H holds 2M and B holds M. That is the comparison the ruling's concern names.
- **OPEN-11:** reproducing `frameTimeStatsMs` in `console.mjs` keeps the twelve files. The gate compares the copy with its source.

**Files read** (at `C:/dev/wt/read-1122`, main 466318621a13, except the two copies):
- `<S>/adv-2026-11-22-20-copy.md` and `<S>/console-draft.md` (its opening lines);
- the first draft's files: listed in it, with the ruling's copy at `<S>/adv-2026-11-22-17-copy.md`;
- `docs/08_Testing.md` (`:1-70`);
- `frontends/shell/src/instrument/residencyInstrument.ts` (`:1-150`, plus grep);
- `frontends/shell/e2e/residency-harness.mjs` (`:1-100`, `:1105-1149`, plus greps);
- `frontends/shell/RESULTS.md` (`:150-179`);
- `frontends/shell/src/e2e-test-surface.ts` (grep);
- `frontends/shell/src/canvas/WorkingCanvas.tsx` (`:2380-2439`, plus grep);
- `frontends/shell/src/console/ConsolePanel.tsx` (`:30-104`);
- `frontends/shell/e2e/command-bar.mjs` (`:374-418`, `:470-494`);
- `governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md` (`:640-664`);
- `frontends/shell/e2e/lib.mjs`, `open-fills-fit-view.mjs`, `recentre-crossing.mjs`, `README.md`, `frontends/shell/package.json` and `frontends/shell/.gitignore` (greps);
- greps for frame-time and reference-machine text over the tree.
