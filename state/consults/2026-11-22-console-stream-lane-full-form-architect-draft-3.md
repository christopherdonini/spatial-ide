*The architect's third draft of the Console piece's full form, after ADV-2026-11-22-22 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-22-the-console-forms-open-10-neither-rule-two-rings-of-128-from-the-start-the-frame-time-measurement-not-built.md`), tag node:console-stream-lane-limitation-67@form-draft-3, asked at 2026-11-22T16:29:30.720Z, read only at main 466318621a13f00ae7b1114a4690582be42bdc94 in a detached read checkout. Not a form and not committed as one: its two questions went to the advisor, answered by ADV-2026-11-22-24 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-24-the-console-forms-e-and-rule-the-forms-to-read-open-12s-two-files-in-the-pick-file-row-takes-no-r1.md`), and its fourth draft follows. Filed by the custodian below the rule from its third hand-back in its transcript, 49242 bytes, sha256 03473d980b70f65ed5a465dd6245574c0d6babebfafdcbd4155cedbfe68ddc08, byte for byte. Its run, from its start to that hand-back: Read 60, Grep 45, SubagentHandback 3, Glob 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-22T15:52:01Z to 2026-11-22T16:37:02Z by its transcript; 0 calls named the main checkout; 1 compaction (resumed twice at the custodian's messages).*

---

REPORT PATH: state/consults/2026-11-22-console-stream-lane-full-form-architect-draft-3.md
Reviewed: detached read worktree `C:/dev/wt/read-1122` @ 466318621a13f00ae7b1114a4690582be42bdc94 (main). Tag `node:console-stream-lane-limitation-67@form-draft-3`.

# console: data requests, cancels and session-log lines get a ring of 128 of their own, every other entry a ring of 128, and the label shows both drop counts (known limitation 67); full form, both gates

*Proposed file: `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md`. Proposed PLAN node: `console-stream-lane-limitation-67`.*
*Drafted by the architect (claude-opus-5-5) on the custodian's briefs (tags `node:console-stream-lane-limitation-67@form-draft-1`, `@form-draft-2` and `@form-draft-3`). It was read only, in the detached read worktree at main 466318621a13f00ae7b1114a4690582be42bdc94. Nothing was run. The custodian commits this form as its own commit, before any code.*
*Append-only once committed. Self-references are by section, amendment and item, never by line.*
*Form: full, both gates from dispatch (ADV-2026-11-22-17 item 2).*

## §0 Disclosure

**0.1 Authority.** These are the advisor's rulings under the delegation of 2026-11-13, not the human's words. Each is paraphrased unless marked. None is on main yet: each is filed under `state/directives/` before this form is committed, and §0.1 then names each path.

- **ADV-2026-11-22-17:**
  - item 1: option (c);
  - item 2: the class (full form, both gates), the Scope as the design note's eleven files, and the merge held for the tag;
  - item 3: the measurement of entries;
  - item 4: the words, which are my drafts for the advisor after this form's gate;
  - item 5: item 67's comment names ADV-2026-11-19-16 item 2;
  - item 6: the registry row's comment;
  - item 7: a dependency, lockfile or workflow goes to the advisor before commit.
- **ADV-2026-11-22-20 item 1:**
  - `frontends/shell/e2e/command-bar.mjs` is the twelfth file, test code only;
  - the ceiling of 850 over twelve files;
  - E-AND keeps its meaning;
  - the change has its own mutation.

  Its item 2 is replaced by ADV-2026-11-22-22.
- **ADV-2026-11-22-22:**
  - item 1: the frame-time measurement is withdrawn;
  - item 2: two rings of 128 from the start. Item 67 states the cost. Larger rings are a later piece;
  - item 3: FRAMES' and what went with it come out. The Scope stays at twelve files. The merge request waits for the tag and nothing else of this kind;
  - item 4: MEASURE' stays, after the human's sitting of Tuesday 2026-11-24, with E-AND as drafted and the unmarked label on the sight list;
  - item 5: the words for 128 and 128, with the cancel clause whole;
  - item 6: OPEN-6, by the gate's clause check;
  - item 7: nothing is reserved, and the choice of 128 is the advisor's.
- **ADV-2026-11-21-15:** item 1 (the merge waits for the tag or the human's word), item 4 (i) and item 5.
- **ADV-2026-11-19-08 item 6 and ADV-2026-11-19-16 item 2:** item 67's present words. ADV-2026-11-19-08 item 2 (b) is the filed figure of at least 220.
- **ADV-2026-11-21-08 item 3:** what the registry row's comment names.

**0.2 Evidence, not Authority.**
- The design note, `state/consults/2026-11-22-console-piece-limitation-67-design-note-architect.md`.
- `KNOWN-LIMITATIONS.md` item 67 (`KNOWN-LIMITATIONS.md:525-527`; pin: hash by the custodian).
- Amendment 5 of `governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md` (its items 3 to 6).

**0.3 The reuse index.** Byte-copied from the custodian's first brief, and marked so. It is the output of `tools/reuse.mjs` in the read-only reuse clone at 89bbac37, run by the custodian on 2026-11-22, exit 1. The brief is not tracked, so this is evidence, not Authority.

```text
No prior art recorded for "console ring buffer eviction". Research it before planning an implementation.
```

The search missed. In this repository the prior art is the recorder's own drop-with-count ring, modelled on `engine/src/trace.rs`'s bounded buffer (`frontends/shell/src/console/recorder.ts:273-281`).

**0.4 Cites.** Every cite is path:line at 466318621a13. Ranges are reading aids, not pins, except where marked "pin: hash by the custodian". At dispatch the tree at the dispatch base is authoritative, and S1 checks it.

**0.5 Findings this form carries** (mine):
- (a) **The twelfth file.** `frontends/shell/e2e/command-bar.mjs:377-378` reads the dropped count only in the form `(N dropped)`, and numbers entries by position (`:380-415`). Both fail under two rings. This is closed by ADV-2026-11-22-20 item 1, and §2.5 re-reads E-AND.
- (b) **Three statements of 256 outside the twelve files** become untrue at M = 128:
  - `frontends/shell/e2e/README.md:280` ("the recorder's 256");
  - `frontends/shell/e2e/README.md:896` ("The Console ring keeps 256 entries");
  - `frontends/shell/e2e/reopen.mjs:15` ("whose ring keeps 256 entries").

  An untrue limit is a Correctness finding under the proportional-gates rule, so they cannot stand at the merge (OPEN-12).

## §1 What this may and may not claim

**May claim:**
- An entry named `viewport_query` or `cancel` (class A), or `binding_log_session_event` (class B), is held in the stream ring. Every other entry is held in the other ring.
- Each ring holds at most M = `MAX_CONSOLE_ENTRIES` = 128 entries and evicts its own oldest, counted against that ring.
- No entry of one ring is evicted by an entry of the other.
- `count()` plus both drop counts is every entry recorded. The label shows the held count, the total dropped and each ring's share.
- The display shows every held entry, oldest first by `seq`. So the open drawer renders at most 2M = 256 entries, the same ceiling as today (CL2).
- What one first look adds to each ring, for §6's datasets and windows, as MEASURE' measures it.

**May not claim:**
- Any frame-time or other performance figure, any docs/08 row, or that the drawer's cost is unchanged beyond the shared 256-entry ceiling.
- That every entry a first look adds is of the stream kind. That is by reading; MEASURE' checks it under S7.
- That grouping is unchanged (§2.3 item 6; VL3).
- Any wire change, any capture-site change (not c2), or any ADR amendment.

**Not in this piece** (ADV-2026-11-22-22 item 2): larger rings. They need the drawer to stop rendering every entry on every frame, and are a later piece of their own, if the need shows.

**ADRs cited, none amended:** ADR-024 (by name only), ADR-006 (no operation added), ADR-010 rule 6 (M declared at its site).

## §2 The change

### 2.1 The interfaces it is written against (read at 466318621a13)

**The recorder** (`frontends/shell/src/console/recorder.ts`):
- `record` at :205-213, `recordBindingCommand` at :237-245 and `recordGuiAction` at :263-271;
- `push` at :282-288, `droppedCount()` at :292-294, `entries()` at :300-302 and `count()` at :308-310;
- `MAX_CONSOLE_ENTRIES` at :141, and its doc at :133-140, which states that the ring "never blocks, never grows past 256, and never silently truncates";
- the type-only import at :36, explained in the header at :25-29.

The existing tests are written against the symbol, for example `recorder.test.ts:80`, `:86` and `:107`.

**The capture sites** (unchanged):
- `call()` records at `frontends/shell/src/skp/client.ts:59`;
- `"viewport_query"` at :119 and `"cancel"` at :133;
- `logSessionEvent` at `frontends/shell/src/diagnostics/log.ts:21`;
- `pickFile` and `pickProjectFolder` record their names before the call (`frontends/shell/src/skp/dialog.ts:12`, `:28`).

**The count sync** (`collapsedCountSync.ts`): `CountableRecorder` at :27-31, `ConsoleCountSnapshot` at :33-36, and `attachCollapsedCountSync` at :50-69.

**The panel** (`ConsolePanel.tsx`):
- the snapshot at :41;
- the expanded sync at :48-59, coalesced once per frame;
- the label at :64-68 (pin: hash by the custodian);
- the group key at :96;
- `ConsoleGroupRow` at :106-133, whose header click records `console.toggleGroupExpanded` at :123;
- the class-A header at :165, and the class-B prose `${vm.effect} (${vm.entry.command})` at :187;
- the disclosure toggle, which records at :79.

**The view model:** `groupConsecutiveEntries` at `consoleViewModel.ts:177-189`, with its key at :160-169.

**The registry** (`surfaceRegistry.ts`):
- `ClassARow` at :30-35 and `ClassBRow` at :39-50;
- the `viewport_query` row at :84 and the `cancel` row at :85;
- the `binding_log_session_event` row at :108-115;
- the `binding_pick_file` row at :124-131;
- the `binding_pick_project_folder` row at :132-139.

**The slots:**
- `takeSlot` at `AdmissionPanel.tsx:294-300`;
- `e2eFolderRef` and `e2eFileRef` at :340-342;
- `handlePick` at :377-383, `handleProjectPick` at :386-389 and `handleRelink` at :393-401;
- the hooks at :445-457;
- `e2eSaveFolderRef` and `pickFolder` at `App.tsx:894-904`, and the hook at :1452-1463;
- `isInstrumentedBuild` at `isInstrumentedBuild.ts:31-33`.

**The e2e readers:**
- `console.mjs`: `readConsoleLabel` at :241-248, the mirror at :66-71, GROUP' at :708-744, `runStep` at :1008-1019, and the steps at :1045-1056;
- `command-bar.mjs`: :353-415 and `stepAnd` at :470-490.

**Today's label carries no placeholder mark.** `ConsolePanel.tsx:65-68` has no `[P6 placeholder]` text; compare `surfaceRegistry.ts:205`. The new label carries none either (ADV-2026-11-22-17 item 4; ADV-2026-11-22-22 item 4).

### 2.2 Before

There is one ring of 256 for every kind of entry. A load's requests and terminal lines push out the user's recorded steps and other actions (item 67).

### 2.3 After (product code, in `console/` only)

1. **The registry:**
   - `ClassARow` and `ClassBRow` gain an optional `readonly lane?: "stream"`.
   - Exactly three rows carry it: `viewport_query`, `cancel` and `binding_log_session_event`.
   - `isStreamLaneName(kind, name): boolean` is derived from the marked rows. Its product caller is item 2.
   - The file still imports nothing.
2. **The recorder:**
   - `ConsoleLane = "stream" | "other"`, with two arrays and two counters.
   - `push` picks the lane: `isStreamLaneName` for a named `skp-request` or a `binding-command`, and the other ring for a `gui-action` or a `record()` with no command.
   - When the chosen ring holds M, its oldest entry is shifted out and its counter incremented in the same synchronous call.
   - `MAX_CONSOLE_ENTRIES = 128`, each ring's size, declared at its site. The doc at :133-140 is rewritten, and so is "256 entries is a fixed count" at :135-136.
   - `droppedCount(lane)`, with the lane required.
   - `count()` is the sum.
   - `entries()` is a two-pointer merge by `seq`, O(n) (OPEN-3).
   - The runtime import of `isStreamLaneName` replaces the header sentence at :25-29.
   - My draft for the invariant sentence (not the human's wording):
     > "What IS true by construction: each ring never grows past MAX_CONSOLE_ENTRIES and evicts only its own oldest entry; the recorder never blocks and never silently truncates -- every eviction is counted against its own ring, and count() plus droppedCount("stream") plus droppedCount("other") is every entry recorded."
3. **The count sync:** `CountableRecorder.droppedCount(lane)`, and `ConsoleCountSnapshot { count, droppedStream, droppedOther }`, read once per frame.
4. **The label:** a pure `consoleLabelText(snapshot)` in `consoleViewModel.ts`, called by `ConsolePanel`, which reads both lanes. The text is L1.
5. **Unchanged:** `client.ts`, `log.ts`, `dialog.ts`, `recordNamed`, `render.ts`, every registry string, the standing header, `groupConsecutiveEntries` and `coalesceOncePerFrame`.
6. **Grouping after a drop** (by reading; VL3; OPEN-4): two runs of one other-kind entry whose stream separators are dropped join into one group, keyed by the earlier run's first `seq`.
7. **The e2e readers:**
   - `console.mjs`:
     - `readConsoleLabel` parses L1, and returns `count: null` on a partial match or when D ≠ S + O;
     - the mirror at :71 becomes `128`, "each ring's size";
     - GROUP's capacity check (`:733-736`) passes when R ≤ M, or when ΔO ≤ N_base − M (the other ring held at least N_base − M entries at the baseline, so a drop count no larger evicted none of the window's rows). Otherwise it fails with `GROUP': capacity: <R> entries were recorded since the baseline (label total <t> - <t0>), more than each ring's <M>, and <ΔO> entries of the other kind were dropped, more than the <N0 - M> the other ring held at least`;
     - LABEL' and MEASURE' are new, with a `SKIP` status in `runStep`.
   - `command-bar.mjs`: §2.5.

**Other checks.**
- docs/02: `console/` and two e2e suites.
- docs/10: no wire change.
- Principle 4 (`docs/01_Principles.md:10`): nothing synthesised.
- Principle 7 and "Never block the canvas" (`:13`, `:20`): `push` is bounded and synchronous. The open drawer's ceiling stays 256 entries.

### 2.4 Words (none is the human's wording; my drafts for the advisor after this form's gate)

**L1, the label (P6, unmarked as today):**
- No drops: `Console — N actions`, or `Console — 1 action`.
- With drops: `Console — N actions (D dropped: S of data requests, cancels and log lines; O of other entries)`.

Clause check:
- N is `count()`, at most 2 × 128 = 256 (CL2).
- D = S + O, in `consoleLabelText`.
- S is `droppedCount("stream")`, which counts the three marked names (CL5).
- O is `droppedCount("other")`.
- Both counts show whenever D > 0 (VL2).
- N + D is every entry recorded (CL4).
- L1 states no ring size.

**K1, item 67's bold line.** ⟨FRACTION⟩ is set by rule W (§6).
> "67. **The Console keeps its newest 128 data requests, cancels and session-log lines apart from its newest 128 other entries, so of a load's traffic it shows only the newest 128 entries, ⟨FRACTION⟩ one load of the size given below.**"

Clause check:
- The two rings of 128 are §2.3 items 1 and 2 (CL2).
- "a load's traffic" is the stream kind, by reading, checked under S7.
- "only the newest 128" is CL1 and CL2.
- ⟨FRACTION⟩ is 128 against MEASURE's Y. With the filed figure of at least 220 it reads "a little more than half of", as ADV-2026-11-22-22 item 2 gives it.

**K2, item 67's paragraph.** The cancel clause is kept whole, with its brackets. ⟨H⟩, ⟨FIGURE⟩ and ⟨FRACTION⟩ are set by rule W.
> "The Console keeps two kinds of entry apart. Data requests (the viewport_query rows), cancels (the cancel rows) and the app's lines to the session log (the binding_log_session_event rows) are one kind; every other entry is the other kind. It keeps the newest 128 of each kind. When a kind is full, each new entry of that kind drops that kind's oldest one, and the Console's label shows how many entries were dropped and how many of them were of each kind. When the first data load of a view completes (after an open, an Apply or a Clear, for example), the map asks for tiles of that view. Each tile is asked for in a request of its own, and each request is an entry of the first kind. When a tile's load ends, other than by a cancel the app makes (after your Cancel, for example), the app writes a line to the session log, and that write is an entry of the first kind too. Panning and zooming ask for tiles in the same way. One load of a view can add more than ⟨H⟩ entries of the first kind. ⟨FIGURE⟩ Keeping the two kinds apart costs this: of a load's traffic the Console keeps only the newest 128 entries, where one list of 256 shared by both kinds could keep 256, so it shows ⟨FRACTION⟩ one load of that size, and a load can drop the data requests, cancels and log lines before it, the request that an Apply or a Clear sent among them. A load drops none of the other entries: the steps you recorded and your other actions stay until 128 newer entries of their own kind are recorded. Only the entry leaves the Console: the request was already sent, and a recorded step stays in the session's history. A group of entries you have opened closes again when its first entry is dropped. When the entries of the first kind that separate two runs of the same entry are dropped, the two runs show as one group, which is closed unless the earlier run was a group you had opened."

Clause check:
- The kinds are §2.3 item 1, with the rows' visible names at `ConsolePanel.tsx:165` and `:187`.
- The 128 of each kind and the own-oldest drop are CL2 and CL4.
- The label is L1.
- The tile and terminal clauses keep item 67's present code by symbol, unchanged.
- "where one list of 256 shared by both kinds could keep 256" is today's `recorder.ts:141`, the base.
- "drops none of the other entries" is CL1, plus S7 for the first look.
- Group closing is `ConsolePanel.tsx:96`, and joined runs are VL3.

**K3, item 67's comment:** the worker's words, by symbol, checked by both gates. It must:
- give the provenance: ADV-2026-11-19-06 item 5, corrected in ADV-2026-11-19-08 item 6, with the tile-load clause replaced in ADV-2026-11-19-16 item 2, and rewritten under ADV-2026-11-22-17 item 4 and ADV-2026-11-22-22 items 2 and 5 (the cost sentence), with the advisor's ruling on these words named by id;
- name, by symbol: `MAX_CONSOLE_ENTRIES`, `push`, `droppedCount` and `entries`; `isStreamLaneName` and the three `lane` marks; `consoleLabelText`; `ConsoleGroupRow` and the group key; and the present clauses' symbols;
- name ⟨FIGURE⟩'s source (the MEASURE' report's path and commit);
- keep the 110-tile history and "Not examined: how many entries a cancelled tile request adds".

**R1, the comment on the `binding_pick_project_folder` row** (the architect's words; a source comment, unchanged from the earlier drafts):
> "// In an instrumented build only (isInstrumentedBuild), a folder that a test hook of src/e2e-test-surface.ts puts in a one-shot slot is taken once in place of this picker's answer: e2eFolderRef in AdmissionPanel (through takeSlot, for a reopen) and e2eSaveFolderRef in App (for a save). In a plain build both slots are always null, so the picker's own answer supplies the folder (ADV-2026-11-21-08 item 3; ADV-2026-11-21-15 item 5)."

Clause check:
- "instrumented build only" and "taken once" are `AdmissionPanel.tsx:296-298` and `App.tsx:900-902`.
- The hooks are `e2eOpenProjectFolder` (`AdmissionPanel.tsx:448-451`) and `e2eSaveProjectToFolder` (`App.tsx:1454-1461`), both registered only when `isInstrumentedBuild()` (`:446`, `:1453`), and declared in `e2e-test-surface.ts` (`AdmissionPanel.tsx:340`, `App.tsx:894`).
- "for a reopen" is `handleProjectPick` (`:386-389`), and "for a save" is `pickFolder` (`App.tsx:899-904`).
- "always null in a plain build": only those hooks set the slots, and `takeSlot` and `pickFolder` read them only when instrumented.
- "the picker's own answer": `pick()` and `pickProjectFolder()` when the slot is null.

**OPEN-6, the clause check the gate makes for the `binding_pick_file` row** (ADV-2026-11-22-22 item 6). R1's sentence is true of that row only if each clause holds for it:
1. The row's picker, `pickFile`, is reached through a one-shot slot on every call. Check every product call of `pickFile`: `AdmissionPanel.tsx:378` (`handlePick`, direct, with no slot) and `:395` (`handleRelink`, through `takeSlot(e2eFileRef, pickFile)`). A grep confirms there are no others.
2. The thing supplied is "a folder". At `:395` it is a file.
3. The slots named are `e2eFolderRef` and `e2eSaveFolderRef`. `pickFile`'s slot is `e2eFileRef`, filled by `e2eRelinkFile` (`:452-456`).
4. The uses named are "a reopen" and "a save". `pickFile`'s slot serves a re-link (`handleRelink`).
5. "In a plain build … always null": true for `e2eFileRef` (`:446`, `:296`).

By my reading, clauses 1 to 4 fail, so under item 6 the row does not take R1's sentence. If the advisor wants the row commented, here is my draft R2 for it, which item 6 does not provide for:
> "// In an instrumented build only (isInstrumentedBuild), a file that the e2eRelinkFile test hook (src/e2e-test-surface.ts) puts in AdmissionPanel's one-shot slot e2eFileRef is taken once, through takeSlot, in place of this picker's answer for a re-link; the picker is then not opened and no entry of this row is recorded. Open's own pick (handlePick) has no slot. In a plain build the slot is always null, so the picker's own answer supplies the path (ADV-2026-11-21-08 item 3; ADV-2026-11-22-22 item 6)."

Its clause check:
- `:395`, `:452-456`, `:296-299` (with the slot filled, `pick` is not called);
- `dialog.ts:12` (the entry is recorded only inside `pickFile`);
- `:377-383`;
- `:446`.

### 2.5 E-AND after card B, re-read (ADV-2026-11-22-20 item 1; test code only)

**Its meaning.** The advisor's words, byte-copied from the ruling's copy (sha256 d4c8856351288b6250ebee06a6e4b1e6e2f8a1b949dee9849cbbcf7477b83d8c), marked so: "E-AND keeps its meaning: card B's commit added exactly one `record_step` row, at ok. Where it cannot tell, it fails by name, as today. It does not pass."

**One reading** (one `page.evaluate`):
- It opens the Console if closed and clicks every closed group header. Then, in passes two frames apart, it repeats until a pass clicks nothing, bounded to 30 s.
- The final pass reads the label (N, S, O) and K, the ordered list of rendered other-kind entries, oldest first. An entry is stream kind if:
  - it is class A with header `viewport_query` or `cancel`;
  - or it is class B with prose ending `(binding_log_session_event)` (`ConsolePanel.tsx:165`, `:187`; mirrored per the sibling-file convention).

  Each entry of K is keyed by its class, its header or prose, and its request text, with its outcome kept beside it.
- The reading is discarded unless the rendered entries, counting each closed group's ×N, sum to N.

**The steps:**
- **(a) R0:** one reading at `label0`'s position (`command-bar.mjs:479`), giving O₀ and K₀.
- **(b) R1:** after card B's map settles and its checks (`:484-487`), readings until the newest `record_step` row in K is `ok`, bounded to 30 s. This gives O₁ and K₁.
- **(c) The decision**, in this order, with ΔO = O₁ − O₀:
  1. label unreadable at R0: F1;
  2. label unreadable at R1: F6;
  3. ΔO > |K₀|: F2′;
  4. the keys of K₀ after its first ΔO entries are not the first keys of K₁: F5;
  5. otherwise, added = the `record_step` rows of K₁ after its first |K₀| − ΔO entries, and F4 applies unless added is exactly one row keyed `filter:` + `ZONE_AB` at `ok`.
- **(d) Where it cannot tell, and how it fails.** Each case fails by name, and none passes:
  - more other-kind entries were dropped between the readings than R0 held, so a row recorded after R0 may be gone (F2′);
  - no reading settles with every group open and the newest row `ok` within 30 s (F3′);
  - a label does not parse (F1, F6);
  - the readings disagree on the entries both hold (F5).
- **(e) Why this needs no timing** (by reading):
  - The other ring evicts oldest first, and a load adds nothing to it (CL1). So the entries recorded after R0 are the newest of their kind.
  - They are all held at R1 exactly when ΔO ≤ |K₀|, and the ΔO dropped are K₀'s first ΔO.
  - A ring that is already full at R0 (the ordinary state at M = 128 after the suite's earlier steps) is handled: each new entry drops one, and the count ΔO says how many.
- **(f) Texts** (test strings):
  - F1 and F4 are unchanged.
  - F2′: `E-AND: cannot tell how many record_step rows card B's commit added: <ΔO> entries of the other kind were dropped between the reading after card A's wait and the reading after card B's map settled, more than the <|K0|> it held then (label then: <text>; now: <text>)`
  - F3′: `E-AND: within 30000ms of card B's map settling no reading had every group open with the newest record_step row at ok (<last reading>)`
  - F5: `E-AND: the entries of the other kind read after card A's wait, less the <ΔO> dropped, are not the first entries read after card B's map settled (<keys0>; <keys1>)`
  - F6: `E-AND: the Console's label could not be read after card B's map settled (<text>)`
  - PASS: `card B's commit added exactly one record_step row, at ok (Console after card A's wait: <text>; after card B's map settled: <text>)`
- **(g) Removed:** `readConsole` and `watchConsole` (`:380-415`).
- **(h) Unchanged:** `waitCommitted` and `readRecordStepRows`. `LABEL` and `parseLabel` follow L1.

## §3 Fixtures

- **Unit tests:** none. They use real `ConsoleRecorder` instances.
- **E2E:**
  - `filter-zoned.parquet`: 2,000 features (`console.mjs:35`).
  - `100k-happy-path.parquet`: 100,000 features (`kernel/tests/manual_walkthrough_fixtures.rs:44-55`).
  - Both are under `target/fixtures/manual-walkthrough/`, hashed before and after MEASURE'. A missing fixture is S9.

## §4 Tests and mutations

Each mutation is applied, the named tests are run and seen to fail by name, and the failing line and the commit are recorded. Then it is reverted. No `verify-mutation` run is called an observation. Every new test is written against M, never the literal 128. Figures are at M = 128.

**New unit tests:**

| Id | File | Asserts | Red at the base because | Mutation (fails it) |
|---|---|---|---|---|
| CL1 | recorder.test.ts | one `record_step`, then 300 × (`viewport_query` + `binding_log_session_event`): the `record_step` is held by reference; stream dropped = 600 − M (472); other dropped = 0; `count()` = M + 1 (129) | one ring evicts it | M-1: every entry to the other lane |
| CL2 | recorder.test.ts | 300 gui-actions and 300 cancels, interleaved: each holds its newest M (oldest held is number 301 − M, the 173rd); `count()` = 2M (256); each lane dropped 300 − M (172) | one cap of M | M-2: the capacity check reads `count()` |
| CL3 | recorder.test.ts | O₀, 300 `viewport_query`, O₁: `entries()` starts at O₀, ends at O₁, and seqs strictly increase | O₀ evicted | M-3: concatenation in place of the merge |
| CL4 (never silently truncates, across both rings) | recorder.test.ts | 3,000 seeded entries over seven names. After each record: `count()` + both drops = recorded, and each lane holds ≤ M. Every 100 records and at the end: the absent seqs number the drop sum, and the absent stream seqs number `droppedCount("stream")` | `droppedCount` ignores its argument | M-4: stream eviction not counted |
| CL5 | recorder.test.ts | per name, M + 1 entries: only the matching lane reads 1 | both read 1 | M-5: `cancel`'s mark removed |
| SR1 | surfaceRegistry.test.ts | exactly the three names are stream; no class-C row has `lane` | the export is absent | M-6: a mark on `describe` |
| VL1 | consoleViewModel.test.ts | no-drop labels for 0, 1 and 5 | the export is absent | M-7: the drop clause always shown |
| VL2 | consoleViewModel.test.ts | `{256, 45, 5}` gives `Console — 256 actions (50 dropped: 45 of data requests, cancels and log lines; 5 of other entries)` | the export is absent | M-8: D written as S |
| VL3 | consoleViewModel.test.ts | real recorder: A (`record_step`), `viewport_query`, B (`record_step`), then M × `viewport_query`: the first group is [A, B] | all evicted | M-9: grouping breaks on a seq gap |
| CC1 | collapsedCountSync.test.ts | fake, stream 3 and other 2, gives `{0, 3, 2}` | the fields are absent | M-10: S read from the other lane |
| CC2 (the real shape) | collapsedCountSync.test.ts | real recorder, one `record_step` + 300 `viewport_query`: `{M + 1, 300 − M, 0}` (129, 172, 0) | as CC1 | M-10 |

**Existing tests edited** (named; red at the base under the new interface):
- `recorder.test.ts`, "evicts the oldest entry once MAX_CONSOLE_ENTRIES is exceeded, counting every drop": `droppedCount()` becomes `droppedCount("other")`.
- `collapsedCountSync.test.ts`:
  - `fakeRecorder`;
  - "fires once immediately on attach with the current snapshot";
  - "onCount is the ONLY function this module ever calls…": the keys become `["count","droppedOther","droppedStream"]`;
  - "a burst of recorder notifications within one frame…";
  - "count() is read at most once per onCount call…";
  - "reflects droppedCount() in the snapshot".

**Existing tests declared unedited:**
- every other test in `recorder.test.ts`, which uses the symbol (`:80`, `:86`, `:107`, `:111`);
- `consoleViewModel.test.ts`'s existing tests;
- `surfaceRegistry.test.ts`;
- `soleCaptureSite.test.ts`, `surfaceCompleteness.test.ts`, `renderTruth.test.ts` and `consoleLanguage.test.ts`;
- `RefusalBlock.test.tsx`;
- `App.command.test.tsx`, `App.layout.test.tsx`, `App.recording.test.tsx`, `App.selection.test.tsx` and `App.table.test.tsx`.

The App tests' `entries().slice(count())` marks hold while no ring evicts between the mark and the read. At the base that needed fewer than 256 entries in all. At M = 128 it needs fewer than 128 of each kind, which is not counted. This is P3's risk, and S2 applies.

**E2E:**
- **LABEL'** (`console.mjs`, after UNCLASS'). It opens `filter-zoned.parquet` once more, settles (quiet 3000 ms, bound 45 s), reads the label, and asserts that it parses, that D = S + O and that S > 0. Otherwise it fails with `LABEL': the stream ring did not overflow in this run; the label's drop form was not exercised`. Prediction: S > 0, because a first look adds at least 220 stream entries by the filed figure, more than M. M-11 (S and O swapped in `consoleLabelText`) fails it at S > 0.
- **GROUP' capacity** (§2.3 item 7). M-G1, a test mutation: 200 clicks of `.console-disclosure` inserted after GROUP's baseline. Predicted, by arithmetic: R ≥ 200 > M, and ΔO > N_base − M, because 200 exceeds the stream ring's holding of at most M. So it fails with `GROUP': capacity:`.
- **E-AND** (`command-bar.mjs`, §2.5). Mutations, checked at M = 128:
  - **M-CB1** (redefined; see the note): a test mutation inserting 200 clicks of `.console-disclosure` between R0 and card B's `sendCondition`. Predicted F2′, by arithmetic. With a additions of the other kind between the readings, ΔO = max(0, |K₀| + a − M), and ΔO > |K₀| exactly when a > M, with a ≥ 200 > 128. The second draft's M-CB1 (`MAX_CONSOLE_ENTRIES = 8`) does not predict F2′ with certainty under §2.5 (c). Whether at most 8 other entries come between the readings is not known, and E-AND then decides correctly, so it is withdrawn.
  - **M-CB2:** M-11 applied. Predicted to fail. The label's swapped count makes ΔO read as the stream drops of card B's load, which is at least 1 because the stream ring is full from earlier loads. That gives F2′ when it exceeds |K₀|, and otherwise F5 or F4 from the misaligned slice. The exact line is not predicted. A pass is possible only where the misaligned entries are identical in key and no `record_step` row lies between, and is recorded as class 2.
  - **Carried, re-predicted under §2.5:**
    - M-A4-1: fails at card A's wait (`command-bar.mjs:478`, unchanged).
    - M-A4-3: F4 with n = 2, both `filter:` + `ZONE_AB`.
    - M-X2: F4 with n = 2, A then the combined text.
  - **Unmutated:** E-AND passes with §2.5's PASS text. It decides if no more than M other-kind entries come between the readings. That includes R1's own group clicks, at most one per closed group among 2M entries. Predicted: it decides; not measured. F2′ in an unmutated run goes to the advisor with ΔO, |K₀| and both labels, with no second run.

Any other failing line is class 2.

## §5 Predictions, declared unchanged, falsification

**Predictions:**
- P1: the tests' commit, run at the base, gives every new and every edited test red, at its reason.
- P2: each mutation fails as §4 predicts.
- P3: every test declared unedited passes unedited at M = 128, and `npm run verify` passes. The App files are a stated risk: S2.
- P4: §9.3's e2e rows pass, with LABEL' at S > 0, GROUP' within capacity, and E-AND under §2.5.
- P5: in MEASURE', every settled run has other-added = 0, and the 1280 by 800 runs on `filter-zoned.parquet` have stream-added ≥ 220.
- P6: §7 holds.

A wrong P1 to P5 is class 2. A wrong P6 is class 8.

**Declared unchanged:**
- `skp/**`, `diagnostics/log.ts`, `streaming/**`, `residency/**`, `App.tsx`, `AdmissionPanel.tsx` and `render.ts`;
- `styles.css`, `e2e/lib.mjs`, every suite other than the two named, and `protocol/**`;
- every registry string and the standing header;
- `package.json`, every lockfile and every workflow;
- `e2e/README.md` and `e2e/reopen.mjs`, unless OPEN-12 is ruled in.

**Falsification:**
- an entry evicted by the other lane;
- D ≠ S + O;
- a first look adding an other-kind entry (S7);
- CC2 failing against the real recorder;
- E-AND passing under M-X2, M-CB1 or M-A4-3;
- GROUP' passing under M-G1.

## §6 Instruments, MEASURE' and rule W

**Assertions:** every unit test, LABEL', GROUP' and E-AND.

**MEASURE'** (`console.mjs`; ADV-2026-11-22-17 item 3; ADV-2026-11-22-22 item 4):
- Opt-in through `CONSOLE_MEASURE=1`; without it, a SKIP line (precedent `e2e/README.md:762`).
- It runs after LABEL' and before REGRESS', with the drawer collapsed. It is run after the human's sitting of Tuesday 2026-11-24.
- **Warm-up:** up to three opens of `filter-zoned.parquet` until S > 0. If the ring never fills, the splits are marked inexact.
- **Order:**
  - datasets: `filter-zoned.parquet`, then `100k-happy-path.parquet`;
  - windows within each dataset: 1280×800 (`src-tauri/tauri.conf.json:17-18`), 1024×640 (`e2e/layout.mjs:276`), 1366×768 (`e2e/layout.mjs:245`), then 1920×1080;
  - three runs each, 24 runs in all.
- **One run:**
  1. `page.setViewportSize`, checked as `layout.mjs:248-256` does (S8);
  2. a settle;
  3. `openPath`, which must be `admitted`;
  4. P0, the label after two frames;
  5. a settle (quiet 3000 ms, bound 60 s; an unsettled run is recorded and excluded);
  6. P1.
- **The split:** with S > 0 at P0, stream-added = ΔS exactly, and other-added = Δtotal − ΔS.
- It asserts only that the label parses, that D = S + O, that Δtotal > 0 in a settled run, and that the viewport is set.
- Output: `frontends/shell/e2e/out/console-measure-<ms>.json` (ignored, `frontends/shell/.gitignore:1`).
- Afterwards it restores 1280×800. It runs with `SPATIAL_E2E_DEADLINE_MS=5400000` and a step bound of 45 min.
- The figures are lower bounds on a load, because P0 follows the open's return.

**Rule W** (fixed before the run; the custodian applies it and the gates check it):
1. Use the settled runs with S > 0 at P0. Y is the largest stream-added among them, with its dataset and window. X is the largest at 1280×800.
2. If any of those runs has other-added > 0, stop S7.
3. ⟨H⟩ is the largest whole hundred below Y, in words. If Y < 100, the sentence becomes "can add up to ⟨Y⟩ entries of the first kind".
4. ⟨FIGURE⟩: "In the app-window tests one first look of a file of ⟨2,000 or 100,000⟩ features, in a window ⟨w⟩ by ⟨h⟩ pixels, added at least ⟨Y⟩ entries of the first kind; at the app's own window size, 1280 by 800, at least ⟨X⟩."
5. ⟨FRACTION⟩ comes from r = 128 / Y:

   | r | ⟨FRACTION⟩ |
   |---|---|
   | r ≥ 1 | "all of", and K1 and K2 drop "only" |
   | 0.67 < r < 1 | "most of" |
   | 0.5 < r ≤ 0.67 | "a little more than half of" |
   | r = 0.5 | "half of" |
   | 0.33 < r < 0.5 | "less than half of" |
   | r ≤ 0.33 | "a third or less of" |

   At the filed figure (Y = 220, r ≈ 0.58) this gives the ruling's words.

## §7 Declared values and the ceiling

- **One changed constant:** `MAX_CONSOLE_ENTRIES` = 128, each ring's size, declared at `recorder.ts`, and mirrored at `console.mjs:71`. The e2e bounds are harness bounds, not latency claims.
- **The ceiling:** at most 850 changed lines, both numstat columns summed, over these twelve files (ADV-2026-11-22-20 item 1; ADV-2026-11-22-22 item 3):
  - `frontends/shell/src/console/recorder.ts`, `surfaceRegistry.ts`, `consoleViewModel.ts`, `ConsolePanel.tsx` and `collapsedCountSync.ts`;
  - `recorder.test.ts`, `surfaceRegistry.test.ts`, `consoleViewModel.test.ts` and `collapsedCountSync.test.ts`;
  - `frontends/shell/e2e/console.mjs` and `frontends/shell/e2e/command-bar.mjs` (test code only);
  - `KNOWN-LIMITATIONS.md`.

  If OPEN-12 is ruled in, `frontends/shell/e2e/README.md` and `frontends/shell/e2e/reopen.mjs` join, under the same ceiling, by an amendment of class 9 before any edit to them. An overrun is class 8, nothing is cut or packed to fit, and this section is never edited.
- **Estimate, about 680 lines:**

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
  | console.mjs | 160 |
  | command-bar.mjs | 80 |
  | KNOWN-LIMITATIONS.md | 8 |
  | OPEN-12's two files, if ruled in | about 6 |
- **Counting, at a named commit:**
  - `git diff --numstat B...H --` over the files of §7;
  - `git diff --name-only B...H`, which names no other path than this form, `governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.*`, `site/**` and `state/**`.

## §8 Block-on-sight

1. Any edit to a capture site (`skp/**`, `log.ts`), to `streaming/**`, `residency/**` or `App.tsx`, or to `protocol/**`.
2. A lane chosen by anything but kind and name, or an argument object reaching the recorder.
3. An eviction not counted against its own ring, or a label showing one drop count without the other.
4. A new export with no product caller.
5. An existing test edited that §4 does not name. A new test with a literal ring size.
6. A shown string changed other than the label. A label text other than the advisor's approved words. A placeholder mark on the label.
7. Item 67's words landed with ⟨H⟩, ⟨FIGURE⟩ or ⟨FRACTION⟩ written other than by rule W, without the cost sentence, or with the cancel clause not whole.
8. Lanes asserted only against a fake, without CC2. E-AND or GROUP' deciding on rows a ring may have dropped, or passing where §2.5 (d) says it cannot tell.
9. A dependency, lockfile or workflow change.
10. A line cut or packed to fit §7.
11. A statement of the ring's size left untrue anywhere at the merge (§0.5 (b), OPEN-12).
12. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code landed before its amendment;
    - a `verify-mutation` run called an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id.
13. Record items:
    - quotation marks around text that is not byte-identical to its source;
    - a line cite into the ledger;
    - a bare self-line;
    - a pin read as current.

## §9 Gates

**9.1 Architect** (full):
- §8, item by item.
- The seam rule on four seams, each against its actual interface at the base:
  - the recorder to the registry (SR1, CL5);
  - the recorder to the count sync (CC2);
  - the snapshot to the label (VL1, VL2, LABEL');
  - the label to both e2e readers.
- §2.5 against ADV-2026-11-22-20 item 1's sentence, case by case (§2.5 (d)).
- The caller rule.
- L1, K1, K2, R1 and K3 clause by clause against the built code, and OPEN-6's five clauses. Rule W against MEASURE's JSON.
- docs/01 (principles 4 and 7), docs/02, docs/10, ADR-024, ADR-006 and round 25.
- A grep for statements of the ring's size across the tree, `site/**` included (§8 item 11).

**9.2 Reviewer:**
- the full diff (`origin/main...HEAD`);
- M-1 to M-11, M-G1, M-CB1 and M-CB2 made again, with M-A4-1, M-A4-3 and M-X2 read from the tester's runs;
- §7 by its commands;
- `npm run verify` in a hold;
- MEASURE's JSON recomputed against its PASS note, with rule W applied.

**9.3 Suites:**
- `npm run verify` in `frontends/shell`, after `npm ci` there and in `renderer/bundle-viewer`;
- the `scripts/plan` node tests;
- verify cites, quotes (a floor) and test-claims;
- green CI.

E2E, at the gated head, through the suites' own launch on port 5180, by the Sonnet tester, with heavy runs taking turns. Each run's app stderr, report and session log are copied right after it.
- `e2e/console.mjs` plain, with its M-G1 run;
- `e2e/console.mjs` with `CONSOLE_MEASURE=1`, after the sitting of 2026-11-24;
- `e2e/command-bar.mjs`, with its M-CB1 and M-CB2 runs;
- `e2e/recording.mjs`, `e2e/project.mjs`, `e2e/reopen.mjs` and `e2e/table.mjs`.

Any failed row is S6.

**9.4 Operator:** no Part. The label goes onto P6's sight list unmarked (OPEN-9).

**9.5 The PR body:**
- asks for a merge commit;
- names B, the rulings and the advisor's words;
- lists R1 (and R2 if ruled), K3 and the worker's comment words;
- states that the merge request waits for the tag, and for nothing else of this kind (ADV-2026-11-21-15 item 1; ADV-2026-11-22-22 item 3).

## §10 Where it is built, the order and the model

- **Where:** branch `cut/console-stream-lane`, worktree `C:/dev/wt/console67`, target `D:/wt-targets/console67`, data `D:/wt-data/console67`.
- **Commits:**
  1. This form.
  2. The tests (red at the base).
  3. The code.
  4. If OPEN-12 is ruled in: its class 9 amendment, then the two files' lines.
  5. After MEASURE', run after the sitting of 2026-11-24: item 67's words by rule W, by the custodian's script, words only. The reviewer reads it narrowly.

  A stop still pushes the branch as it stands. A worker pushes in a call of its own.
- **Merging main in:** before the merge request. If that merge touches a §7 file, the reviewer makes a narrow read and §9.3's e2e runs again.
- **Model:** the standard worker and the Sonnet tester (OPEN-8).

## §11 Stops

Each stop is reported, and the custodian sends it to the advisor.
- S1: an interface of §2.1 differs at the dispatch base.
- S2: an existing test not named in §4 needs an edit; the App files at M = 128 are named here.
- S3: a new test is green at the base, or red for another reason.
- S4: an edit outside §7.
- S5: a §7 path is in flight elsewhere, item 67's region included.
- S6: a failed e2e row.
- S7: MEASURE' gives other-added > 0, or a grammar disagreement.
- S8: `setViewportSize` fails, or the inner size differs.
- S9: a fixture is missing, or its hash changes.
- S10: a dependency, lockfile or workflow is needed.

## §12 OPEN items

- **OPEN-1, the twelfth file:** closed as (a) by ADV-2026-11-22-20 item 1.
- **OPEN-2, where the lane is declared.** Recommended: the three registry rows.
- **OPEN-3, where the merge lives.** Recommended: `recorder.entries()`. The note placed it in `consoleViewModel.ts`.
- **OPEN-4, joined runs.** Recommended: keep and disclose (K2, VL3).
- **OPEN-5, the drawer's held ceiling:** closed by ADV-2026-11-22-22 item 2, which replaces ADV-2026-11-22-20 item 2. With two rings of 128, the ceiling stays 256.
- **OPEN-6, the `binding_pick_file` row:** the gate makes §2.4's five-clause check. By my reading R1's sentence fails it, so the row does not take it. R2 is offered as a draft. Both go to the advisor with the other words.
- **OPEN-7, MEASURE's shape.** Recommended: as §6.
- **OPEN-8, the model.** Recommended: the standard worker and the Sonnet tester.
- **OPEN-9, the label at P6.** Recommended: unmarked, on the sight list (ADV-2026-11-22-22 item 4).
- **OPEN-10 and OPEN-11:** withdrawn by ADV-2026-11-22-22 item 3.
- **OPEN-12, the size stated outside the twelve files** (§0.5 (b)). Recommended: rule in `e2e/README.md` and `e2e/reopen.mjs` by a class 9 amendment, one line each, worded by me and not the human's:
  - `README.md:280`'s last clause becomes "and either the label's total grows by at most one ring's 128 or the entries of the other kind dropped since the baseline are at most the label's held count then less 128, so none of its own rows can have been evicted";
  - `README.md:896`'s sentence becomes "The Console keeps 128 entries of each kind, so a row missing at its read right after its call fails the step by name rather than being searched for later.";
  - `reopen.mjs:15`'s clause becomes "whose rings keep 128 entries of each kind (ADV-2026-11-19-06, A4-1; ADV-2026-11-22-22 item 2)".

  The alternative is the docs lane in this PR before the merge. Leaving them as they are is not available: an untrue limit is a Correctness finding.

## §13 Amendments

*(Opens empty; append-only.)*

---END OF FORM---

**Note: what changed against the second draft, item by item**

1. **ADV-2026-11-22-22 item 2 (two rings of 128):**
   - M = 128 throughout §1, §2.3, §4, §5 and §7. Every new test is still written against M.
   - The may-claim list now states the 256-entry drawer ceiling, which is the same as today's.
   - K1 and K2 now state the cost in item 67's own words, with ⟨FRACTION⟩. Rule W gains its fraction table, which gives the ruling's "a little more than half" at the filed 220.
   - Larger rings are named in §1 as a later piece of their own.
   - Carried with it:
     - `recorder.ts:135-136`'s "256 entries" is rewritten;
     - the mirror at `console.mjs:71` becomes 128;
     - GROUP's capacity check gains a second, sound way to pass, because at 128 a full other ring is the ordinary state;
     - the App tests are a stated risk under P3 and S2 (fewer than 128 of each kind are needed now, not fewer than 256 in all).
2. **ADV-2026-11-22-22 item 3:**
   - Removed: FRAMES', the measure builds, the base worktree, §6.2, §6.3, the `frameTimeStatsMs` copy, the 128 route and its commit, S11 to S14, §8's frame items, the docs/08 and instrument evidence in §0.2, and the FRAMES' declarations in §5.
   - §7 is re-estimated at about 680 within 850.
   - The merge request waits for the tag only.
   - OPEN-10 and OPEN-11 are recorded as withdrawn. OPEN-5 is recorded as closed by item 2.
3. **ADV-2026-11-22-22 item 4:**
   - MEASURE' is placed after the sitting of Tuesday 2026-11-24.
   - **E-AND: I checked M-CB1 and M-CB2 at M = 128, and the check found a defect in my second draft's §2.5 (c) itself.** Its F2′ fired whenever O₁ ≠ O₀. With the other ring full at R0, which is the ordinary state at 128 after the suite's earlier steps (and likely at 256 too), card B's own `record_step` drops one entry. So the unmutated E-AND would have failed F2′ on every run.
   - The corrected rule (§2.5 (c) and (e)) fails F2′ only when ΔO > |K₀|, and aligns the readings by ΔO. E-AND's meaning and every failure-by-name are unchanged, but the decision rule is not "as drafted". **The advisor should confirm that** (see below).
   - Under the corrected rule:
     - M-CB1 as drafted (M = 8) no longer has a certain prediction, so it is replaced by a 200-click test mutation predicting F2′ by arithmetic;
     - M-CB2 still fails, but by F2′, F5 or F4, not one named line;
     - M-A4-1, M-A4-3 and M-X2 hold as before.
   - M-G1 is new, for GROUP's changed check.
   - The label stays unmarked, on the sight list.
4. **ADV-2026-11-22-22 item 5:** L1's clause check is redrafted (N ≤ 2 × 128). K1 and K2 are redrafted for 128 and 128, with the cancel clause whole, brackets included.
5. **ADV-2026-11-22-22 item 6:** §2.4 states the gate's five-clause check for the `binding_pick_file` row. By my reading clauses 1 to 4 fail: `handlePick` calls `pickFile` with no slot; the slot is a file slot, `e2eFileRef`, for a re-link. So the row does not take R1's sentence. R2 is offered as a separate draft, which item 6 does not provide for.
6. **New, my own:**
   - §0.5 (b) and OPEN-12: three statements of "256" outside the twelve files (`e2e/README.md:280`, `:896`; `e2e/reopen.mjs:15`) become untrue at 128;
   - §8 item 11, and §9.1's grep across the tree.

**For the advisor**

- **OPEN-12 needs a ruling before the merge**, and it is best ruled before dispatch. The ruled Scope of twelve files cannot hold true statements of the size at 128. An untrue limit is Correctness, not documentation.
- **The E-AND correction (note item 3)** changes the decision rule you ruled "as drafted". The meaning in your item 1 sentence is unchanged. Please confirm that, or rule otherwise, before the gate.
- **R1** is true as it stands. It could add that, with a slot filled, the picker is not opened and no entry of this row is recorded (`AdmissionPanel.tsx:296-299`, `dialog.ts:28`). R2 carries that clause. Your call, with the other words.
- **App tests at 128 (P3):** not counted. A failure is S2 and comes to you with the file and its counts.

**Files read** (at `C:/dev/wt/read-1122`, main 466318621a13, except the copies):
- `<S>/adv-2026-11-22-22-copy.md`;
- the second draft's files: as listed in it, with `<S>/adv-2026-11-22-20-copy.md`;
- `frontends/shell/src/console/surfaceRegistry.ts` (`:99-176`);
- `frontends/shell/src/admission/AdmissionPanel.tsx` (`:288-457`);
- `frontends/shell/src/App.tsx` (`:892-905`, `:1448-1463`);
- `frontends/shell/src/skp/dialog.ts`;
- `frontends/shell/src/skp/client.ts` (`:40-73`);
- `frontends/shell/src/console/ConsolePanel.tsx` (`:104-204`);
- `frontends/shell/src/console/recorder.test.ts` (`:70-119`);
- `frontends/shell/e2e/command-bar.mjs` (`:350-373`, plus greps);
- `frontends/shell/e2e/console.mjs` (`:60-73`, `:690-744`);
- `frontends/shell/e2e/README.md` (`:276-282`);
- `frontends/shell/e2e/reopen.mjs` (`:13-16`);
- greps for "256" and for ring statements over `frontends/shell`, `KNOWN-LIMITATIONS.md` and `docs/` (`site/**` not searched);
- a grep for recorder resets in `frontends/shell/src`.
