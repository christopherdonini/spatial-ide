# console: data requests, cancels and session-log lines get a ring of 128 of their own, every other entry a ring of 128, and the label shows both drop counts (known limitation 67); full form, both gates

*Proposed file: `governance/forms/frontends/CONSOLE-STREAM-LANE-PREREGISTRATION.md`. Proposed PLAN node: `console-stream-lane-limitation-67`.*
*Drafted by the architect (claude-opus-5-5) on the custodian's briefs (tags `node:console-stream-lane-limitation-67@form-draft-1` to `@form-draft-5`). It was read only, in the detached read worktree at main 466318621a13f00ae7b1114a4690582be42bdc94. Nothing was run. The custodian commits this form as its own commit, before any code.*
*Append-only once committed. Self-references are by section, amendment and item, never by line.*
*Form: full, both gates from dispatch (ADV-2026-11-22-17 item 2).*
*Committed by the custodian on 2026-11-22 from the architect's fifth draft (`state/consults/2026-11-22-console-stream-lane-full-form-architect-draft-5.md`, filed in the same commit; the hand-back 48614 bytes, sha256 49a7e515eddc47ee374bc8aaa85a00da3f3dc89f9fbb58c43451dea784fbe89d): its text from the title to the line before its end mark, byte for byte, except that each of the two markers "pin: hash by the custodian" (§0.2 and §2.1) is replaced by its pin, the hash of the whole lines with LF at main 466318621a13f00ae7b1114a4690582be42bdc94. The note after the end mark stays in the consult. §0.1's rulings, filed: ADV-2026-11-22-17 `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-17-the-console-piece-option-c-a-full-form-drafted-by-the-architect-now-the-words-as-its-drafts-item-67s-clause-kept-whole.md`; ADV-2026-11-22-20 `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-20-the-console-forms-twelfth-file-test-code-only-two-rings-of-256-kept-the-open-drawers-frame-time-measured-after-the-sitting.md`; ADV-2026-11-22-22 `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-22-the-console-forms-open-10-neither-rule-two-rings-of-128-from-the-start-the-frame-time-measurement-not-built.md`; ADV-2026-11-22-24 `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-24-the-console-forms-e-and-rule-the-forms-to-read-open-12s-two-files-in-the-pick-file-row-takes-no-r1.md`; ADV-2026-11-22-26 `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-26-the-console-forms-fourth-draft-to-its-gate-groups-check-changed-m-cb2-not-kept-as-it-is.md`; ADV-2026-11-21-15 `state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-15-the-proposed-nodes-graded-and-ordered-until-the-tag-a-product-piece-merges-only-on-v0-2s-list-or-the-humans-word.md`; ADV-2026-11-19-08 `state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-08-c1-stands-the-aim-i-the-architect-drafts-amendment-5-first-known-limitations-item-67-replaced-item-64-gains-a-sentence.md`; ADV-2026-11-19-16 `state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-16-the-first-looks-re-gate-d1-by-script-the-reviewers-sentence-for-item-67-no-further-gate-the-closing-and-the-merge-request.md`; ADV-2026-11-21-08 `state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-08-the-gates-two-notes-ad5s-folder-into-the-correction-item-19s-comment-to-the-docs-lane.md`.*

## §0 Disclosure

**0.1 Authority.** These are the advisor's rulings under the delegation of 2026-11-13, not the human's words. Each is paraphrased unless marked. None is on main yet. Each is filed under `state/directives/` before this form is committed, and §0.1 then names its path.
- **ADV-2026-11-22-17:**
  - item 1: option (c);
  - item 2: full form, both gates, and the merge held for the tag;
  - item 3: the measurement of entries;
  - item 4: the words, as my drafts for after the gate;
  - item 5: item 67's comment names ADV-2026-11-19-16 item 2;
  - item 6: the registry row's comment;
  - item 7: a dependency, lockfile or workflow goes to the advisor before commit.
- **ADV-2026-11-22-20 item 1:**
  - `frontends/shell/e2e/command-bar.mjs` joins the Scope, test code only;
  - the ceiling is 850;
  - E-AND's meaning (§2.5);
  - the change has its mutation.

  Its item 2 is replaced by ADV-2026-11-22-22.
- **ADV-2026-11-22-22:**
  - item 1: the frame-time measurement is withdrawn;
  - item 2: two rings of 128 from the start, the cost stated in item 67, and larger rings a later piece;
  - item 3: FRAMES' and what went with it come out, and the merge request waits for the tag and nothing else of this kind;
  - item 4: MEASURE' stays, after the human's sitting of Tuesday 2026-11-24, and the label stays unmarked, on the sight list. Its words "E-AND as drafted" are withdrawn as a ruling on the rule by ADV-2026-11-22-24 item 1;
  - item 5: the words for 128 and 128, with the cancel clause whole;
  - item 6: OPEN-6;
  - item 7: nothing is reserved, and the choice of 128 is the advisor's.
- **ADV-2026-11-22-24:**
  - item 1: the rule for E-AND is the form's. The advisor rules its meaning, plus one more sentence: the unmutated E-AND passes in the ordinary state, with the other ring full at the first reading. A mutation's set of failing lines is named, and a failure outside it is a finding. The same holds for GROUP's capacity check and its mutation;
  - item 2: `frontends/shell/e2e/README.md` (its two statements of 256) and `frontends/shell/e2e/reopen.mjs` (its comment's one) join the Scope, one line each place. That is fourteen files under the same ceiling. The form says for each place whether only the number changes;
  - item 3: the `binding_pick_file` row does not take R1's sentence, and R2 is the advisor's to decide after the gate;
  - item 4: go on to the gate;
  - item 5: nothing is reserved.
- **ADV-2026-11-22-26:**
  - item 1: the form goes to its gate with GROUP's check changed. The check's meaning is the sentence of §2.3 item 7. The gate reads the check against it, and W1 against the check. W1 goes to the advisor with the other words, and W2 and W3 stand as drafted;
  - item 2: a mutation with a known pass case is not listed as a mutation. M-CB2 is dropped, with the sentence of §4 (OPEN-13);
  - item 3: E-AND's rule is the gate's to read against ADV-2026-11-22-24 item 1's two sentences. A failure of the unmutated step at the build is a stop to the advisor (S11), not a reason to change the rule in the build;
  - item 4: `table.mjs` PC-E4 is noted, and a failure there is the form's stop (S6);
  - item 5: commit the form and dispatch its gate. Nothing is reserved.
- **ADV-2026-11-21-15:** item 1 (the merge waits for the tag or the human's word), item 4 (i) and item 5.
- **ADV-2026-11-19-08 item 6 and ADV-2026-11-19-16 item 2:** item 67's present words. ADV-2026-11-19-08 item 2 (b) is the filed figure of at least 220.
- **ADV-2026-11-21-08 item 3:** what the registry row's comment names.

**0.2 Evidence, not Authority.**
- The design note, `state/consults/2026-11-22-console-piece-limitation-67-design-note-architect.md`.
- `KNOWN-LIMITATIONS.md` item 67 (`KNOWN-LIMITATIONS.md:525-527` @ 466318621a13f00ae7b1114a4690582be42bdc94 sha256:2a3589573eb5db43ef27fb13615cf43b1a20ebe0966c17b6fd05b186dec055e7).
- Amendment 5 of `governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md` (its items 3 to 6).

**0.3 The reuse index.** Byte-copied from the custodian's first brief, and marked so. It is the output of `tools/reuse.mjs` in the read-only reuse clone at 89bbac37, run by the custodian on 2026-11-22, exit 1. The brief is not tracked, so this is evidence, not Authority.

```text
No prior art recorded for "console ring buffer eviction". Research it before planning an implementation.
```

The search missed. In this repository the prior art is the recorder's own drop-with-count ring, modelled on `engine/src/trace.rs`'s bounded buffer (`frontends/shell/src/console/recorder.ts:273-281`).

**0.4 Cites.** Every cite is path:line at 466318621a13. Ranges are reading aids, not pins, except where marked "pin: hash by the custodian". At dispatch the tree at the dispatch base is authoritative, and S1 checks it.

**0.5 Findings this form carries** (mine):
- (a) `command-bar.mjs:377-378` reads only the `(N dropped)` form, and `:380-415` numbers entries by position. Both fail under two rings (ADV-2026-11-22-20 item 1; §2.5).
- (b) Three statements of 256 become untrue at M = 128:
  - `frontends/shell/e2e/README.md:280`;
  - `frontends/shell/e2e/README.md:896`;
  - `frontends/shell/e2e/reopen.mjs:15`.

  All three are in the Scope by ADV-2026-11-22-24 item 2 (§2.4 W1 to W3).

## §1 What this may and may not claim

**May claim:**
- An entry named `viewport_query` or `cancel` (class A), or `binding_log_session_event` (class B), is held in the stream ring. Every other entry is held in the other ring.
- Each ring holds at most M = `MAX_CONSOLE_ENTRIES` = 128 and evicts its own oldest, counted against that ring.
- No entry of one ring is evicted by an entry of the other.
- `count()` plus both drop counts is every entry recorded. The label shows the held count, the total dropped and each ring's share.
- The display shows every held entry, oldest first by `seq`. So the open drawer renders at most 2M = 256 entries, the same ceiling as today (CL2).
- What one first look adds to each ring, as MEASURE' measures it.

**May not claim:**
- Any frame-time or other performance figure, any docs/08 row, or that the drawer's cost is unchanged beyond the shared 256-entry ceiling.
- That every entry a first look adds is of the stream kind. That is by reading, and S7 checks it.
- That grouping is unchanged (§2.3 item 6; VL3).
- Any wire change, capture-site change (not c2) or ADR amendment.

**Not in this piece** (ADV-2026-11-22-22 item 2): larger rings. They need the drawer to stop rendering every entry on every frame, and are a later piece of their own, if the need shows.

**ADRs cited, none amended:** ADR-024, ADR-006, and ADR-010 rule 6.

## §2 The change

### 2.1 The interfaces it is written against (read at 466318621a13)

**The recorder** (`frontends/shell/src/console/recorder.ts`):
- `record` at :205-213, `recordBindingCommand` at :237-245 and `recordGuiAction` at :263-271;
- `push` at :282-288, `droppedCount()` at :292-294, `entries()` at :300-302 and `count()` at :308-310;
- `MAX_CONSOLE_ENTRIES` at :141, and its doc at :133-140, which states that the ring "never blocks, never grows past 256, and never silently truncates";
- the type-only import at :36, and the header at :25-29.

The existing tests use the symbol (`recorder.test.ts:80`, `:86`, `:107`, `:111`).

**The capture sites** (unchanged):
- `frontends/shell/src/skp/client.ts:59`, with `"viewport_query"` at :119 and `"cancel"` at :133;
- `frontends/shell/src/diagnostics/log.ts:21`;
- `frontends/shell/src/skp/dialog.ts:12` and `:28`.

**The count sync** (`collapsedCountSync.ts`): :27-31, :33-36 and :50-69.

**The panel** (`ConsolePanel.tsx`):
- the snapshot at :41, the expanded sync at :48-59, and the label at :64-68 (`frontends/shell/src/console/ConsolePanel.tsx:64-68` @ 466318621a13f00ae7b1114a4690582be42bdc94 sha256:f2120322dfa8992b71758ad81a363e5482c7a33754d85949280f7907b201c025);
- the group key at :96, and `ConsoleGroupRow` at :106-133, whose header records `console.toggleGroupExpanded` at :123;
- the class-A header at :165, and the class-B prose at :187;
- the disclosure toggle, which records at :79.

**The view model:** `consoleViewModel.ts:160-189`.

**The registry** (`surfaceRegistry.ts`):
- `ClassARow` at :30-35 and `ClassBRow` at :39-50;
- the rows at :84, :85 and :108-115;
- the `binding_pick_file` row at :124-131 and the `binding_pick_project_folder` row at :132-139.

**The slots:**
- `AdmissionPanel.tsx`: :294-300, :340-342, :377-401 and :445-457;
- `App.tsx`: :894-904 and :1452-1463;
- `isInstrumentedBuild.ts:31-33`.

**The e2e readers:**
- `console.mjs`: `expandAllGroups` at :201-206, `pollConsole` at :231-239, `readConsoleLabel` at :241-248, `readItems` at :254-274, the mirror at :66-71, GROUP' at :708-744, `runStep` at :1008-1019, and the steps at :1045-1056;
- `command-bar.mjs`: :353-415 and :470-490;
- `reopen.mjs`: the comment at :13-16, `readConsole` at :138-153, `rowsOf` at :155, `openFile` at :158-166 and `waitClosed` at :171-180;
- `e2e/README.md:276-280` (the GROUP' entry) and `:890-896` (the Reopen spec).

**Today's label carries no placeholder mark.** `ConsolePanel.tsx:65-68` has none; compare `surfaceRegistry.ts:205`. The new label carries none either.

### 2.2 Before

One ring of 256 holds every kind of entry. A load's requests and terminal lines push out the user's recorded steps and other actions (item 67).

### 2.3 After (product code, in `console/` only)

1. **The registry:**
   - `ClassARow` and `ClassBRow` gain an optional `readonly lane?: "stream"`.
   - Exactly three rows carry it: `viewport_query`, `cancel` and `binding_log_session_event`.
   - `isStreamLaneName(kind, name)` is derived from the marked rows. Its product caller is item 2.
   - The file still imports nothing.
2. **The recorder:**
   - `ConsoleLane = "stream" | "other"`, with two arrays and two counters.
   - `push` picks the lane: `isStreamLaneName` for a named `skp-request` or a `binding-command`, and the other ring for a `gui-action` or a `record()` with no command.
   - When the chosen ring holds M, its oldest entry is shifted out and its counter incremented, synchronously.
   - `MAX_CONSOLE_ENTRIES = 128`, each ring's size, declared at its site. The doc at :133-140, including :135-136, is rewritten.
   - `droppedCount(lane)`, with the lane required.
   - `count()` is the sum, and `entries()` is a merge by `seq`, O(n) (OPEN-3).
   - The runtime import replaces :25-29's sentence.
   - My draft for the invariant sentence (not the human's wording):
     > "What IS true by construction: each ring never grows past MAX_CONSOLE_ENTRIES and evicts only its own oldest entry; the recorder never blocks and never silently truncates -- every eviction is counted against its own ring, and count() plus droppedCount("stream") plus droppedCount("other") is every entry recorded."
3. **The count sync:** `droppedCount(lane)`, and `ConsoleCountSnapshot { count, droppedStream, droppedOther }`.
4. **The label:** `consoleLabelText(snapshot)` in `consoleViewModel.ts`, called by `ConsolePanel` (L1).
5. **Unchanged:** `client.ts`, `log.ts`, `dialog.ts`, `recordNamed`, `render.ts`, every registry string, the standing header, `groupConsecutiveEntries` and `coalesceOncePerFrame`.
6. **Grouping after a drop** (by reading; VL3; OPEN-4): two runs of one other-kind entry whose stream separators are dropped join into one group.
7. **The e2e readers:**
   - **`console.mjs`:**
     - `readConsoleLabel` parses L1, returning `count: null` on a partial match or when D ≠ S + O;
     - the mirror at :71 becomes `128`;
     - LABEL' and MEASURE' are new, with a `SKIP` status in `runStep`.
   - **GROUP's capacity check** (`:733-736`):
     - **Its meaning** (ADV-2026-11-22-26 item 1): no row GROUP' reads that was recorded since its baseline can have been evicted.
     - **The check:** let R = label total − baseline total, and ΔO = the other kind's drops since the baseline. The check passes when R ≤ M (at most M entries of any kind came since the baseline, so the other ring still holds every one of them). It also passes when ΔO ≤ N_base − M: the other ring held at least N_base − M at the baseline, because the stream ring holds at most M, and it evicts oldest first.
     - **Failure:** otherwise it fails with `GROUP': capacity: <R> entries were recorded since the baseline (label total <t> - <t0>), more than each ring's <M>, and <ΔO> entries of the other kind were dropped, more than the <N0 - M> the other ring held at least`.
     - **The ordinary state** (the other ring full at the baseline): the check passes when R ≤ 128, or when the other kind's entries since the baseline number at most N_base − 128. By reading, GROUP' records three `style.set` steps, its tab and disclosure clicks, and its readings' group clicks. It is predicted to pass. This is not counted.
   - **`command-bar.mjs`:** §2.5.
   - **`e2e/README.md` and `reopen.mjs`:** W1 to W3 (§2.4).

**Other checks.**
- docs/02: `console/` and four e2e files.
- docs/10: no wire change.
- Principle 4 (`docs/01_Principles.md:10`): nothing synthesised.
- Principle 7 and "Never block the canvas" (`:13`, `:20`): `push` is bounded and synchronous, and the drawer's ceiling stays 256.

### 2.4 Words (none is the human's wording; my drafts for the advisor after this form's gate)

**L1, the label (P6, unmarked):**
- No drops: `Console — N actions`, or `Console — 1 action`.
- With drops: `Console — N actions (D dropped: S of data requests, cancels and log lines; O of other entries)`.

Clause check:
- N is `count()`, at most 2 × 128 = 256 (CL2).
- D = S + O.
- S is the stream lane's drops (CL5), and O the other lane's.
- Both counts show whenever D > 0 (VL2).
- N + D is every entry recorded (CL4).
- L1 states no ring size.

**K1, item 67's bold line.** ⟨FRACTION⟩ is set by rule W.
> "67. **The Console keeps its newest 128 data requests, cancels and session-log lines apart from its newest 128 other entries, so of a load's traffic it shows only the newest 128 entries, ⟨FRACTION⟩ one load of the size given below.**"

Clause check:
- The two rings of 128 are CL2.
- "a load's traffic" is the stream kind, by reading, checked under S7.
- "only the newest 128" is CL1 and CL2.
- At the filed figure (at least 220), ⟨FRACTION⟩ is "a little more than half of", as ADV-2026-11-22-22 item 2 gives it.

**K2, item 67's paragraph.** The cancel clause is kept whole, with its brackets. ⟨H⟩, ⟨FIGURE⟩ and ⟨FRACTION⟩ are set by rule W.
> "The Console keeps two kinds of entry apart. Data requests (the viewport_query rows), cancels (the cancel rows) and the app's lines to the session log (the binding_log_session_event rows) are one kind; every other entry is the other kind. It keeps the newest 128 of each kind. When a kind is full, each new entry of that kind drops that kind's oldest one, and the Console's label shows how many entries were dropped and how many of them were of each kind. When the first data load of a view completes (after an open, an Apply or a Clear, for example), the map asks for tiles of that view. Each tile is asked for in a request of its own, and each request is an entry of the first kind. When a tile's load ends, other than by a cancel the app makes (after your Cancel, for example), the app writes a line to the session log, and that write is an entry of the first kind too. Panning and zooming ask for tiles in the same way. One load of a view can add more than ⟨H⟩ entries of the first kind. ⟨FIGURE⟩ Keeping the two kinds apart costs this: of a load's traffic the Console keeps only the newest 128 entries, where one list of 256 shared by both kinds could keep 256, so it shows ⟨FRACTION⟩ one load of that size, and a load can drop the data requests, cancels and log lines before it, the request that an Apply or a Clear sent among them. A load drops none of the other entries: the steps you recorded and your other actions stay until 128 newer entries of their own kind are recorded. Only the entry leaves the Console: the request was already sent, and a recorded step stays in the session's history. A group of entries you have opened closes again when its first entry is dropped. When the entries of the first kind that separate two runs of the same entry are dropped, the two runs show as one group, which is closed unless the earlier run was a group you had opened."

Clause check:
- The kinds are §2.3 item 1, and their visible names are at `ConsolePanel.tsx:165` and `:187`.
- The 128 of each kind are CL2 and CL4.
- The label is L1.
- The tile and terminal clauses keep their present code, unchanged.
- "one list of 256" is `recorder.ts:141` at the base.
- "drops none of the other entries" is CL1, plus S7.
- Group closing is `ConsolePanel.tsx:96`, and joined runs are VL3.

**K3, item 67's comment:** the worker's words, by symbol, checked by both gates. It must:
- give the provenance: ADV-2026-11-19-06 item 5, ADV-2026-11-19-08 item 6, ADV-2026-11-19-16 item 2 (the cancel clause), ADV-2026-11-22-17 item 4, and ADV-2026-11-22-22 items 2 and 5 (the cost sentence), with the advisor's ruling on these words named by id;
- name, by symbol: `MAX_CONSOLE_ENTRIES`, `push`, `droppedCount` and `entries`; `isStreamLaneName` and the three marks; `consoleLabelText`; `ConsoleGroupRow` and the group key; and the present clauses' symbols;
- name ⟨FIGURE⟩'s source (the MEASURE' report's path and commit);
- keep the 110-tile history and "Not examined: how many entries a cancelled tile request adds".

**R1, the comment on the `binding_pick_project_folder` row** (the architect's words; unchanged):
> "// In an instrumented build only (isInstrumentedBuild), a folder that a test hook of src/e2e-test-surface.ts puts in a one-shot slot is taken once in place of this picker's answer: e2eFolderRef in AdmissionPanel (through takeSlot, for a reopen) and e2eSaveFolderRef in App (for a save). In a plain build both slots are always null, so the picker's own answer supplies the folder (ADV-2026-11-21-08 item 3; ADV-2026-11-21-15 item 5)."

Clause check:
- `AdmissionPanel.tsx:296-298`, `:386-389`, `:446-451`;
- `App.tsx:899-904`, `:1453-1461`;
- `AdmissionPanel.tsx:340` and `App.tsx:894` (the hooks are declared in `e2e-test-surface.ts`).

**OPEN-6, the `binding_pick_file` row** (ADV-2026-11-22-24 item 3). The row does not take R1's sentence: the check finds it untrue there.
- `pickFile` is called without a slot at `AdmissionPanel.tsx:378`.
- Its one slot is a file slot, `e2eFileRef`, for a re-link (`:395`, `:452-456`), not a folder slot for a reopen or a save.

Whether the row gets a sentence of its own, R2, is the advisor's decision with the other words after the gate. R2, my draft, unchanged:
> "// In an instrumented build only (isInstrumentedBuild), a file that the e2eRelinkFile test hook (src/e2e-test-surface.ts) puts in AdmissionPanel's one-shot slot e2eFileRef is taken once, through takeSlot, in place of this picker's answer for a re-link; the picker is then not opened and no entry of this row is recorded. Open's own pick (handlePick) has no slot. In a plain build the slot is always null, so the picker's own answer supplies the path (ADV-2026-11-21-08 item 3; ADV-2026-11-22-22 item 6)."

Clause check: `:395`, `:452-456`, `:296-299`, `dialog.ts:12`, `:377-383` and `:446`.

**W1 to W3, the three lines of size outside `console/`** (ADV-2026-11-22-24 item 2; my words, read by the gate; they go to the advisor with the other words):
- **W1, `e2e/README.md:280`.** The clause "the label's total may grow by at most the recorder's 256 so none of its own rows can have been evicted" becomes "the label must show that none of its own rows can have been evicted: its total grew by at most one ring's 128, or the entries of the other kind dropped since the baseline are at most its held count then less 128".
  - **Finding: not only the number.** The suite's check changes (§2.3 item 7), because its logic leans on the mirrored 256 (`console.mjs:71`, `:734`).
  - The claim still holds at 128, under the changed check. Both the constant and the check are in this Scope.
- **W2, `e2e/README.md:896`.** "The Console ring keeps 256 entries, so" becomes "The Console keeps 128 entries of each kind, so". The rest of the sentence is unchanged.
  - **Finding: only the number changes.** The suite reads only `close_dataset` and `open_project` rows: `rowsOf` by header (`reopen.mjs:155`), used at `:169`, `:175` and `:277`. These are class A, the other kind.
  - It reads each one right after its call, or while the open after it runs (`:158-166`, `:171-180`).
  - Under two rings a load's requests no longer evict those rows. So "a row missing at its read right after its call fails the step by name" holds at 128.
  - The suite's logic does not lean on 256.
- **W3, `reopen.mjs:15`.** "from the Console, whose ring keeps 256 entries (ADV-2026-11-19-06, A4-1)" becomes "from the Console, which keeps 128 entries of each kind (ADV-2026-11-19-06, A4-1; ADV-2026-11-22-22 item 2)".
  - **Finding: only the number changes**, for the reasons given under W2.
  - `reopen.mjs:158`'s doc comment ("before the first look's tile requests fill the ring") is outside the one line. It stays true as a statement of when `afterOpen` runs. It is no longer the reason the row survives, and is a docs-lane note, not an edit.

### 2.5 E-AND after card B, re-read (ADV-2026-11-22-20 item 1; ADV-2026-11-22-24 item 1; test code only)

**Its meaning.** The advisor's words, byte-copied from the ADV-2026-11-22-20 copy (sha256 d4c8856351288b6250ebee06a6e4b1e6e2f8a1b949dee9849cbbcf7477b83d8c), marked so: "E-AND keeps its meaning: card B's commit added exactly one `record_step` row, at ok. Where it cannot tell, it fails by name, as today. It does not pass."

**And one more** (ADV-2026-11-22-24 item 1, paraphrased): the unmutated E-AND passes in the ordinary state, with the other ring full at the first reading.

**R0, the first reading:** the label only, at `label0`'s position (`command-bar.mjs:479`), giving N₀, S₀ and O₀. R0 opens and clicks nothing.

**R1, the readings after card B's map settles** (`:484-487`). Each is one `page.evaluate` that:
- opens the Console if it is closed;
- reads the label, giving N₁, S₁ and O₁;
- computes L;
- clicks the closed group headers among the last L rendered entries (counting each closed group's ×N), walking from the end.

A pass that clicks nothing is final. Readings are two frames apart, bounded to 30 s. A reading is discarded unless the rendered entries, counting each closed group's ×N, sum to N₁.

**The arithmetic** (exact when S₀ > 0; by §2.3 items 1 and 2):
- The stream ring is full at R0 and stays full, so it holds M at both readings. The other ring holds N − M.
- With ΔO = O₁ − O₀ and ΔS = S₁ − S₀:
  - the other-kind entries recorded after R0 number a = (N₁ − N₀) + ΔO;
  - the stream entries recorded after R0 number ΔS, of which min(M, ΔS) are held.
- Every entry recorded after R0 is newer than every entry held at R0, so it sorts after them in the display (`entries()` by `seq`).
- So, if all a are held, the entries recorded after R0 are exactly the last L = a + min(M, ΔS) rendered entries.
- All a are held exactly when ΔO ≤ N₀ − M, because the other ring evicts oldest first and held N₀ − M at R0.

**The decision**, in this order:
1. R0's label unreadable: F1.
2. R1's label unreadable: F6.
3. S₀ = 0: F7. The held count does not split between the kinds.
4. ΔO > N₀ − M: F2′.
5. Otherwise, added = the `record_step` rows among the last L entries of the final reading:
   - if added is exactly one row keyed `filter:` + `ZONE_AB` at `ok`: PASS;
   - else, once the newest added row is not `pending`: F4.
6. If no final reading has its newest added row past `pending` within 30 s: F4 when added is empty (n = 0), else F3′.

**Where it cannot tell, and how it fails** (each fails by name; none passes):
- the held count does not split (F7);
- more other-kind entries were dropped after R0 than R0 held, so a row card B added may be gone (F2′);
- no reading settles in time (F3′);
- a label does not parse (F1, F6).

**The ordinary state** (other ring full at R0, so N₀ − M = 128, and the stream ring full from the suite's earlier loads):
- PASS needs a ≤ 128.
- a is card B's own other-kind entries, plus R1's clicks. The clicks number:
  - at most one for opening the drawer;
  - at most one for each closed group among the last L entries. Of these, the stream groups number at most M/2 = 64, since a group holds two or more of the stream ring's M entries;
  - plus one for the run of R1's own toggle entries.
- So it passes when card B's own other-kind entries and their closed groups come to at most 62. By reading, those are its one `record_step` and any command-bar `gui-action` entries. This is not counted.
- An F2′ in an unmutated run is a finding (class 2), and goes to the advisor with N₀, ΔO, ΔS, a and both labels, with no second run.

**Texts** (test strings):
- F1 and F4 are unchanged (`command-bar.mjs:479`, `:490`). F4's n may now be 0.
- F2′: `E-AND: cannot tell how many record_step rows card B's commit added: <ΔO> entries of the other kind were dropped between the label read after card A's wait and the reading after card B's map settled, more than the <N0 - M> the other ring held then (label then: <text>; now: <text>)`
- F3′: `E-AND: within 30000ms of card B's map settling no reading had every group open among the newest <L> entries with its newest record_step row past pending (<last reading>)`
- F6: `E-AND: the Console's label could not be read after card B's map settled (<text>)`
- F7: `E-AND: cannot tell how many record_step rows card B's commit added: the label after card A's wait shows no data request, cancel or log line dropped, so its held count does not split between the two kinds (<text>)`
- PASS: `card B's commit added exactly one record_step row, at ok (Console after card A's wait: <text>; after card B's map settled: <text>)`

**Removed:** `readConsole` and `watchConsole` (`:380-415`). **Unchanged:** `waitCommitted` and `readRecordStepRows`. `LABEL` and `parseLabel` follow L1.

## §3 Fixtures

- **Unit tests:** none, because they use real `ConsoleRecorder` instances.
- **E2E:**
  - `filter-zoned.parquet`: 2,000 features (`console.mjs:35`).
  - `100k-happy-path.parquet`: 100,000 features (`kernel/tests/manual_walkthrough_fixtures.rs:44-55`).
  - Both are under `target/fixtures/manual-walkthrough/`, hashed before and after MEASURE'. A missing fixture is S9.

## §4 Tests and mutations

Each mutation is applied, the named tests are run and seen to fail by a line of its named set, and the line and the commit are recorded. Then it is reverted. A failure by a line outside the set, or a pass, is a finding, class 2 (ADV-2026-11-22-24 item 1). A mutation with a known pass case is not listed (ADV-2026-11-22-26 item 2). No `verify-mutation` run is called an observation. Every new test is written against M. Figures are at M = 128.

**New unit tests:**

| Id | File | Asserts | Red at the base because | Mutation (fails it) |
|---|---|---|---|---|
| CL1 | recorder.test.ts | one `record_step`, then 300 × (`viewport_query` + `binding_log_session_event`): the `record_step` is held; stream dropped = 600 − M (472); other dropped = 0; `count()` = M + 1 | one ring evicts it | M-1: all to the other lane |
| CL2 | recorder.test.ts | 300 gui-actions and 300 cancels, interleaved: each holds its newest M (oldest held is the 173rd); `count()` = 2M; each lane dropped 300 − M | one cap of M | M-2: the cap reads `count()` |
| CL3 | recorder.test.ts | O₀, 300 `viewport_query`, O₁: `entries()` starts at O₀ and ends at O₁, with seqs increasing | O₀ evicted | M-3: concatenation |
| CL4 (never silently truncates, across both rings) | recorder.test.ts | 3,000 seeded entries over seven names: after each, `count()` + drops = recorded, and each lane holds ≤ M; every 100 and at the end, the absent seqs number the drop sum, and the absent stream seqs number the stream drops | `droppedCount` ignores its argument | M-4: stream eviction uncounted |
| CL5 | recorder.test.ts | per name, M + 1 entries: only the matching lane reads 1 | both read 1 | M-5: `cancel`'s mark removed |
| SR1 | surfaceRegistry.test.ts | exactly the three names are stream; no class-C `lane` | absent export | M-6: a mark on `describe` |
| VL1 | consoleViewModel.test.ts | no-drop labels for 0, 1 and 5 | absent export | M-7: the drop clause always shown |
| VL2 | consoleViewModel.test.ts | `{256, 45, 5}` gives `Console — 256 actions (50 dropped: 45 of data requests, cancels and log lines; 5 of other entries)` | absent export | M-8: D written as S; M-11: S and O swapped in `consoleLabelText` (VL2's fixed snapshot then gives `45 of other entries`, every time) |
| VL3 | consoleViewModel.test.ts | real recorder: A, `viewport_query`, B, then M × `viewport_query`: the first group is [A, B] | all evicted | M-9: grouping breaks on a seq gap |
| CC1 | collapsedCountSync.test.ts | fake, stream 3 and other 2, gives `{0, 3, 2}` | absent fields | M-10: S read from other |
| CC2 (the real shape) | collapsedCountSync.test.ts | a real recorder, one `record_step` + 300 `viewport_query`: `{M + 1, 300 − M, 0}` | as CC1 | M-10 |

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
- every other test in `recorder.test.ts`;
- `consoleViewModel.test.ts`'s existing tests;
- `surfaceRegistry.test.ts`;
- `soleCaptureSite.test.ts`, `surfaceCompleteness.test.ts`, `renderTruth.test.ts` and `consoleLanguage.test.ts`;
- `RefusalBlock.test.tsx`;
- `App.command.test.tsx`, `App.layout.test.tsx`, `App.recording.test.tsx`, `App.selection.test.tsx` and `App.table.test.tsx`. Their `entries().slice(count())` marks need fewer than 128 of each kind between the mark and the read. That is not counted: P3's risk, under S2.

**E2E, each with its named set:**
- **LABEL'** (`console.mjs`, after UNCLASS'). It opens `filter-zoned.parquet` again, settles (quiet 3000 ms, bound 45 s), and asserts that the label parses, that D = S + O and that S > 0. Otherwise it fails with `LABEL': the stream ring did not overflow in this run; the label's drop form was not exercised`. Prediction: S > 0, because a first look adds at least 220 stream entries, more than M. LABEL' is an assertion and is not listed under a mutation: under M-11 it passes whenever the other ring has also dropped entries by its reading.
- **GROUP' capacity** (§2.3 item 7). Unmutated, in the ordinary state: passes (by reading).
  - M-G1 (test mutation): 200 clicks of `.console-disclosure`, inserted after the fill loop (`console.mjs:718-722`) and before the layer-tab click (`:723`). By arithmetic, R ≥ 200 > M, and ΔO > N_base − M, because 200 exceeds the stream ring's holding of at most M. The 200 clicks also evict the three style rows, so `pollConsole` returns not found; but the capacity check (`:733-736`) runs before the presence check (`:739`). Set {`GROUP': capacity:`}.
- **E-AND** (`command-bar.mjs`, §2.5). Unmutated: PASS, in the ordinary state (by reading).
  - **M-CB1** (test mutation): 200 clicks of `.console-disclosure`, inserted after R0 (`:479`) and before card B's `sendCondition` (`:480`). By arithmetic, a ≥ 200. ΔO = max(0, (N₀ − M) + a − M), which exceeds N₀ − M because a > M. Set {F2′}.
  - **M-CB2: dropped** (ADV-2026-11-22-26 item 2). No mutation of E-AND shows a swap of the label's two drop counts, because with the other ring full at R0 and at most 128 entries of each kind dropped between R0 and R1, §2.5's arithmetic gives the same L and the same decision whichever count is which; the label's order is covered by VL2 under M-11, whose fixed snapshot fails under the swap every time.
  - **M-CB3:** `droppedOther` read as 0 in `collapsedCountSync.ts` and in `ConsolePanel`'s sync. Then ΔO reads 0, so a = N₁ − N₀ (0 in the ordinary state), and L = min(M, ΔS). The last L entries are card B's load and R1's clicks. Card B's `record_step`, recorded before its load's tile requests, is not among them. Set {F4 with n = 0}. Whether the `record_step` is recorded before the load's first tile request is by reading only (Amendment 5 item 3 (i) of the first-look form); if it is not, a pass is a finding.
  - **Carried:**
    - M-A4-1: set {card A's wait line, `command-bar.mjs:478`}.
    - M-A4-3: set {F4 with n = 2, both `filter:` + `ZONE_AB`}.
    - M-X2: set {F4 with n = 2, A then the combined text}.

## §5 Predictions, declared unchanged, falsification

**Predictions:**
- P1: the tests' commit, run at the base, gives every new and edited test red, at its reason.
- P2: each mutation fails by a line of its set (§4).
- P3: every test declared unedited passes at M = 128, and `npm run verify` passes. The App files are a stated risk: S2.
- P4: §9.3's e2e rows pass, with LABEL' at S > 0, GROUP' and E-AND passing in the ordinary state, and `reopen.mjs` and `table.mjs` passing.
- P5: in MEASURE', every settled run has other-added = 0, and the 1280 by 800 runs on `filter-zoned.parquet` have stream-added ≥ 220.
- P6: §7 holds.

A wrong P1 to P5 is class 2. A wrong P6 is class 8.

**Declared unchanged:**
- `skp/**`, `diagnostics/log.ts`, `streaming/**`, `residency/**`, `App.tsx`, `AdmissionPanel.tsx` and `render.ts`;
- `styles.css` and `e2e/lib.mjs`;
- in `e2e/README.md` and `e2e/reopen.mjs`, every line but W1 to W3;
- every other suite;
- `protocol/**`;
- every registry string and the standing header;
- `package.json`, every lockfile and every workflow.

**Falsification:**
- an entry evicted by the other lane;
- D ≠ S + O;
- a first look adding an other-kind entry (S7);
- CC2 failing against the real recorder;
- VL2 passing under M-11;
- E-AND passing under M-X2, M-CB1 or M-A4-3;
- GROUP' passing under M-G1;
- an unmutated E-AND failing in the ordinary state.

## §6 Instruments, MEASURE' and rule W

**Assertions:** every unit test, LABEL', GROUP' and E-AND.

**MEASURE'** (`console.mjs`; ADV-2026-11-22-17 item 3; ADV-2026-11-22-22 item 4). Opt-in through `CONSOLE_MEASURE=1`; without it, a SKIP line (precedent `e2e/README.md:762`). It runs after LABEL' and before REGRESS', with the drawer collapsed, and is run after the human's sitting of Tuesday 2026-11-24.
- **Warm-up:** up to three opens of `filter-zoned.parquet` until S > 0. Otherwise the splits are marked inexact.
- **Order:**
  - datasets: `filter-zoned.parquet`, then `100k-happy-path.parquet`;
  - windows: 1280×800 (`src-tauri/tauri.conf.json:17-18`), 1024×640 (`e2e/layout.mjs:276`), 1366×768 (`e2e/layout.mjs:245`), 1920×1080;
  - three runs each, 24 runs.
- **One run:**
  1. `setViewportSize`, checked as `layout.mjs:248-256` does (S8);
  2. a settle;
  3. `openPath`, which must be `admitted`;
  4. P0, the label after two frames;
  5. a settle (quiet 3000 ms, bound 60 s; an unsettled run is excluded);
  6. P1.
- **The split:** with S > 0 at P0, stream-added = ΔS and other-added = Δtotal − ΔS.
- It asserts only that the label parses, that D = S + O, that Δtotal > 0 when settled, and that the viewport is set.
- Output: `frontends/shell/e2e/out/console-measure-<ms>.json` (ignored, `frontends/shell/.gitignore:1`).
- Afterwards it restores 1280×800. It runs with `SPATIAL_E2E_DEADLINE_MS=5400000` and a step bound of 45 min.
- The figures are lower bounds.

**Rule W** (fixed before the run):
1. Over the settled runs with S > 0 at P0, Y is the largest stream-added, with its dataset and window. X is the largest at 1280×800.
2. Any other-added > 0 is S7.
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

   At the filed 220 (r ≈ 0.58), this gives the ruling's words.

## §7 Declared values and the ceiling

- **One changed constant:** `MAX_CONSOLE_ENTRIES` = 128, each ring's size, at `recorder.ts`, mirrored at `console.mjs:71`. The e2e bounds are harness bounds, not latency claims.
- **The ceiling:** at most 850 changed lines, both numstat columns summed, over these fourteen files (ADV-2026-11-22-20 item 1; ADV-2026-11-22-22 item 3; ADV-2026-11-22-24 item 2):
  - `frontends/shell/src/console/recorder.ts`, `surfaceRegistry.ts`, `consoleViewModel.ts`, `ConsolePanel.tsx` and `collapsedCountSync.ts`;
  - `recorder.test.ts`, `surfaceRegistry.test.ts`, `consoleViewModel.test.ts` and `collapsedCountSync.test.ts`;
  - `frontends/shell/e2e/console.mjs` and `frontends/shell/e2e/command-bar.mjs` (test code only);
  - `frontends/shell/e2e/README.md` (W1 and W2 only) and `frontends/shell/e2e/reopen.mjs` (W3 only);
  - `KNOWN-LIMITATIONS.md`.

  An overrun is class 8, nothing is cut or packed to fit, and this section is never edited.
- **Estimate, about 676 lines:**

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
  | command-bar.mjs | 70 |
  | README.md | 4 |
  | reopen.mjs | 2 |
  | KNOWN-LIMITATIONS.md | 8 |
- **Counting, at a named commit:**
  - `git diff --numstat B...H --` over the fourteen files;
  - `git diff --name-only B...H`, which names no other path than this form, `governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.*`, `site/**` and `state/**`.

## §8 Block-on-sight

1. Any edit to `skp/**`, `log.ts`, `streaming/**`, `residency/**`, `App.tsx` or `protocol/**`.
2. A lane chosen by anything but kind and name, or an argument object reaching the recorder.
3. An eviction not counted against its own ring, or a label showing one drop count without the other.
4. A new export with no product caller.
5. An existing test edited that §4 does not name. A new test with a literal ring size.
6. A shown string changed other than the label. A label text other than the advisor's approved words. A placeholder mark on the label.
7. Item 67's words landed with ⟨H⟩, ⟨FIGURE⟩ or ⟨FRACTION⟩ written other than by rule W, without the cost sentence, or with the cancel clause not whole.
8. Lanes asserted only against a fake, without CC2. E-AND or GROUP' deciding on rows a ring may have dropped, or passing where §2.5 or §2.3 item 7 says it cannot tell.
9. A dependency, lockfile or workflow change.
10. A line cut or packed to fit §7.
11. An edit to `e2e/README.md` or `reopen.mjs` beyond W1 to W3. A statement of the ring's size left untrue in the fourteen files, or found elsewhere by §9.1's grep.
12. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code landed before its amendment;
    - a `verify-mutation` run called an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id.
13. Record items:
    - quotation marks around text that is not byte-identical;
    - a line cite into the ledger;
    - a bare self-line;
    - a pin read as current.

## §9 Gates

**9.1 Architect** (full):
- §8, item by item.
- The seam rule on four seams, each against its actual interface:
  - the recorder to the registry (SR1, CL5);
  - the recorder to the count sync (CC2);
  - the snapshot to the label (VL1, VL2, LABEL');
  - the label to the e2e readers.
- §2.5's rule against ADV-2026-11-22-20 item 1's sentence and against ADV-2026-11-22-24 item 1's ordinary-state sentence, case by case. GROUP's check against its meaning (§2.3 item 7; ADV-2026-11-22-26 item 1), and W1 against the check.
- Each mutation's named set, and that no listed mutation has a known pass case. M-CB2's drop sentence (§4) against §2.5, and VL2 under M-11.
- The caller rule.
- L1, K1, K2, R1, K3 and W1 to W3 clause by clause against the built code, with W1 to W3's findings re-read in each suite's own logic. Rule W against MEASURE's JSON.
- docs/01 (principles 4 and 7), docs/02, docs/10, ADR-024, ADR-006 and round 25.
- A grep for statements of the ring's size across the tree, `site/**` included.

**9.2 Reviewer:**
- the full diff (`origin/main...HEAD`);
- M-1 to M-11, M-G1, M-CB1 and M-CB3 made again, each against its set, with M-A4-1, M-A4-3 and M-X2 read from the tester's runs;
- §7 by its commands;
- `npm run verify` in a hold;
- MEASURE's JSON recomputed, with rule W applied.

**9.3 Suites:**
- `npm run verify` in `frontends/shell`, after `npm ci` there and in `renderer/bundle-viewer`;
- the `scripts/plan` node tests;
- verify cites, quotes (a floor) and test-claims;
- green CI.

E2E, at the gated head, through the suites' own launch on port 5180, by the Sonnet tester, with heavy runs taking turns. Each run's app stderr, report and session log are copied right after it.
- `e2e/console.mjs` plain, with its M-G1 run;
- `e2e/console.mjs` with `CONSOLE_MEASURE=1`, after the sitting of 2026-11-24;
- `e2e/command-bar.mjs`, with its M-CB1 and M-CB3 runs, each run's labels and §2.5 numbers recorded;
- `e2e/recording.mjs`, `e2e/project.mjs`, `e2e/reopen.mjs` and `e2e/table.mjs`.

Any failed row is S6.

**9.4 Operator:** no Part. The label goes onto P6's sight list unmarked (OPEN-9).

**9.5 The PR body:**
- asks for a merge commit;
- names B, the rulings and the advisor's words;
- lists R1, R2 if ruled, K3 and W1 to W3;
- states that the merge request waits for the tag, and for nothing else of this kind (ADV-2026-11-21-15 item 1; ADV-2026-11-22-22 item 3).

## §10 Where it is built, the order and the model

- **Where:** branch `cut/console-stream-lane`, worktree `C:/dev/wt/console67`, target `D:/wt-targets/console67`, data `D:/wt-data/console67`.
- **Commits:**
  1. This form.
  2. The tests (red at the base).
  3. The code, the e2e changes and W1 to W3.
  4. After MEASURE', run after the sitting of 2026-11-24: item 67's words by rule W, by the custodian's script, words only. The reviewer reads it narrowly.

  A stop still pushes the branch as it stands. A worker pushes in a call of its own.
- **Merging main in:** before the merge request. If that merge touches a §7 file, the reviewer makes a narrow read and §9.3's e2e runs again.
- **Model:** the standard worker and the Sonnet tester (OPEN-8).

## §11 Stops

Each stop is reported, and the custodian sends it to the advisor.
- S1: an interface of §2.1 differs at the base.
- S2: an existing test not named in §4 needs an edit; the App files at M = 128 are named here.
- S3: a new test is green at the base, or red for another reason.
- S4: an edit outside §7.
- S5: a §7 path is in flight elsewhere, item 67's region included.
- S6: a failed e2e row, `table.mjs` PC-E4 included (ADV-2026-11-22-26 item 4).
- S7: MEASURE' gives other-added > 0, or a grammar disagreement.
- S8: `setViewportSize` fails, or the inner size differs.
- S9: a fixture is missing, or its hash changes.
- S10: a dependency, lockfile or workflow is needed.
- S11: the unmutated E-AND fails at the build. It is a stop to the advisor, not a reason to change §2.5's rule in the build (ADV-2026-11-22-26 item 3).

## §12 OPEN items

- **OPEN-1:** closed as (a) by ADV-2026-11-22-20 item 1.
- **OPEN-2, where the lane is declared.** Recommended: the three registry rows.
- **OPEN-3, where the merge lives.** Recommended: `recorder.entries()`.
- **OPEN-4, joined runs.** Recommended: keep and disclose.
- **OPEN-5:** closed by ADV-2026-11-22-22 item 2, which replaces ADV-2026-11-22-20 item 2.
- **OPEN-6:** the `binding_pick_file` row does not take R1's sentence (ADV-2026-11-22-24 item 3). R2 is the advisor's decision after the gate.
- **OPEN-7, MEASURE's shape.** Recommended: as §6.
- **OPEN-8, the model.** Recommended: the standard worker and the Sonnet tester.
- **OPEN-9, the label at P6.** Unmarked, on the sight list (ADV-2026-11-22-22 item 4).
- **OPEN-10 and OPEN-11:** withdrawn by ADV-2026-11-22-22 item 3.
- **OPEN-12:** closed by ADV-2026-11-22-24 item 2 (W1 to W3).
- **OPEN-13:** closed by ADV-2026-11-22-26 item 2. M-CB2 is dropped, with its sentence in §4, and the label's order is covered by VL2 under M-11.

## §13 Amendments

*(Opens empty; append-only.)*

### Amendment 1 — 2026-11-22 — post-result amendment after the architect's form gate, attempt 1 (FAIL): the gate's words for C1, E1 and D1 to D7; the open's own entries and the stop; rule W among item 67's words; the joined runs; the OPEN items

Post-result amendment, written after the architect's form gate, attempt 1 (FAIL), whose findings are this round's results. Nothing above is edited: each new text below is read in place of its old text, and the form's own text stays as filed. No code is written before the architect's attempt 2, which reads this amendment alone, ends PASS or PASS WITH NOTES (ADV-2026-11-22-28 item 1).

**Authority.** The advisor's ruling ADV-2026-11-22-28, under the delegation of 2026-11-13, not the human's words: `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-28-the-console-form-after-its-gate-amendment-1-then-attempt-2-the-five-open-items-as-recommended-the-stop-accounted-for-now.md`, items 1 to 6. **Evidence:** the gate report, `state/consults/gates/2026-11-22-console-stream-lane-form-gate-architect.md` (gate-log row 837), and the architect's draft of the additions, `state/consults/2026-11-22-console-stream-lane-amendment-1-additions-architect-draft.md`, filed in the commit that appends this amendment.

**How the texts were copied.** None of the texts below is the human's wording or the advisor's: each is the architect's. Every old and new text is copied by the custodian's script, those of item 1 from the gate report and those of item 2 from the draft. Each is the text between its fence lines in that file, which are not part of it. The script checked at this filing that each old text occurs exactly once in the form above this amendment, and that no two old texts overlap there. The clause checks stay in the two reports. Code cites inside the texts are reading aids at 0f2078423378fb3f35346a6db9be5833ba0569b9.

#### 1. The gate's words for C1, E1 and D1 to D7 (ADV-2026-11-22-28 item 1)

**C1, text 1 of 3.** Old:

````text
     - **The check:** let R = label total − baseline total, and ΔO = the other kind's drops since the baseline. The check passes when R ≤ M (at most M entries of any kind came since the baseline, so the other ring still holds every one of them). It also passes when ΔO ≤ N_base − M: the other ring held at least N_base − M at the baseline, because the stream ring holds at most M, and it evicts oldest first.
````

New:

````text
     - **The check:** let R = label total − baseline total, ΔO and ΔS = the other and the stream kind's drops since the baseline, and N_base = the held count at the baseline. The check passes when R ≤ M (at most M entries of any kind came since the baseline, so each ring still holds every entry of its own kind recorded since). It also passes when ΔO ≤ N_base − M and ΔS ≤ N_base − M: each ring held at least N_base − M at the baseline, because the other ring holds at most M, and each evicts its own oldest first.
````

**C1, text 2 of 3.** Old:

````text
     - **Failure:** otherwise it fails with `GROUP': capacity: <R> entries were recorded since the baseline (label total <t> - <t0>), more than each ring's <M>, and <ΔO> entries of the other kind were dropped, more than the <N0 - M> the other ring held at least`.
````

New:

````text
     - **Failure:** otherwise it fails with `GROUP': capacity: <R> entries were recorded since the baseline (label total <t> - <t0>), more than each ring's <M>, and the drops since then, <ΔS> of the stream kind and <ΔO> of the other, are not both within the <N0 - M> each ring held at least`.
````

**C1, text 3 of 3.** Old:

````text
the check passes when R ≤ 128, or when the other kind's entries since the baseline number at most N_base − 128.
````

New:

````text
the check passes when R ≤ 128, or when the other kind's entries since the baseline and the stream kind's drops since then each number at most N_base − 128.
````

**E1, text 1 of 1.** Old:

````text
**M-CB3:** `droppedOther` read as 0 in `collapsedCountSync.ts` and in `ConsolePanel`'s sync. Then ΔO reads 0, so a = N₁ − N₀ (0 in the ordinary state), and L = min(M, ΔS). The last L entries are card B's load and R1's clicks. Card B's `record_step`, recorded before its load's tile requests, is not among them. Set {F4 with n = 0}. Whether the `record_step` is recorded before the load's first tile request is by reading only (Amendment 5 item 3 (i) of the first-look form); if it is not, a pass is a finding.
````

New:

````text
**M-CB3:** `droppedOther` read as 0 in `collapsedCountSync.ts` and in `ConsolePanel`'s sync. Then ΔO reads 0, so a reads N₁ − N₀ (0 in the ordinary state, both rings full), and L = min(M, ΔS). The entries rendered after R0 are the stream entries still held and every other-kind entry recorded after R0, so the last L leave out the oldest of them, as many as there are other-kind entries. Card B's `record_step` is left out, and the set holds, when the held stream entries recorded after R0 and before it number no more than the other-kind entries recorded after it (R1's clicks among them); in the ordinary state, where card B's load adds more than M stream entries, that holds when the `record_step` is recorded before the oldest stream entry still held. By reading at 0f2078423378: the step is enqueued after the untiled request's issued outcome (`frontends/shell/src/App.tsx:394-395`, `:1072`) and recorded in the same call when no step is in flight (`frontends/shell/src/workspace/stepRecorder.ts:49-55`, `:69-75`; `frontends/shell/src/skp/client.ts:59`), and tiles are asked for only at that look's Completed terminal (`KNOWN-LIMITATIONS.md` item 67's comment). Set {F4 with n = 0}. The build checks the reading: the unmutated E-AND run records, from its final reading, ΔS, a and the number of held stream entries recorded after R0 and before card B's `record_step`; if that number is above 0, M-CB3 is not run as evidence and goes to the advisor as a possible pass case (ADV-2026-11-22-26 item 2); a pass of a run made is a finding.
````

**D1, text 1 of 1.** Old:

````text
- **W1, `e2e/README.md:280`.** The clause "the label's total may grow by at most the recorder's 256 so none of its own rows can have been evicted" becomes "the label must show that none of its own rows can have been evicted: its total grew by at most one ring's 128, or the entries of the other kind dropped since the baseline are at most its held count then less 128".
````

New:

````text
- **W1, `e2e/README.md:280`, that line only** (line 279, which ends "and the label's total may grow", is kept). On line 280, "by at most the recorder's 256 so none of its own rows can have been evicted." becomes "by at most one ring's 128, or else each kind's drops since the baseline must be at most the baseline's held count less 128, so none of its own rows can have been evicted."
````

**D2, text 1 of 1.** Old:

````text
No mutation of E-AND shows a swap of the label's two drop counts, because with the other ring full at R0 and at most 128 entries of each kind dropped between R0 and R1, §2.5's arithmetic gives the same L and the same decision whichever count is which; the label's order is covered by VL2 under M-11, whose fixed snapshot fails under the swap every time.
````

New:

````text
No mutation of E-AND shows a swap of the label's two drop counts when both counts are above 0 at R0, the other ring is full there and at most 128 entries of each kind are dropped between R0 and R1, because §2.5's arithmetic then gives the same L and the same decision whichever count is which; the label's order is covered by VL2 under M-11, whose fixed snapshot fails under the swap every time.
````

**D3, text 1 of 2.** Old:

````text
A pass that clicks nothing is final. Readings are two frames apart, bounded to 30 s. A reading is discarded unless the rendered entries, counting each closed group's ×N, sum to N₁.
````

New:

````text
A reading is discarded, clicks nothing and is not final unless the rendered entries, counting each closed group's ×N, sum to N₁. A reading kept that clicks nothing is final. Readings are two frames apart, bounded to 30 s.
````

**D3, text 2 of 2.** Old:

````text
6. If no final reading has its newest added row past `pending` within 30 s: F4 when added is empty (n = 0), else F3′.
````

New:

````text
6. If no reading is final within 30 s: F3′. If final readings come but none has its newest added row past `pending` within 30 s: F4 when added is empty (n = 0), else F3′.
````

**D4, text 1 of 1.** Old:

````text
**R1, the readings after card B's map settles** (`:484-487`). Each is one `page.evaluate` that:
````

New:

````text
**R1, the readings after card B's map settles** (`:484-487`). This supersedes the start during the load (first-look form, Amendment 5 items 3 (b) and 12; ADV-2026-11-19-09): under two rings a load evicts no other-kind entry, so the decision needs only ΔO ≤ N₀ − M. Each is one `page.evaluate` that:
````

**D5, text 1 of 1.** Old:

````text
   - `MAX_CONSOLE_ENTRIES = 128`, each ring's size, declared at its site. The doc at :133-140, including :135-136, is rewritten.
````

New:

````text
   - `MAX_CONSOLE_ENTRIES = 128`, each ring's size, declared at its site. The doc at :133-140, including :135-136, is rewritten, and so are the docs of `push` (:273-281), `droppedCount` (:290-291) and `entries` (:296-299, whose "only the oldest ever leaves" is untrue under two rings). In `collapsedCountSync.ts`, "(two numbers)" (:8) becomes three. In `console.mjs`, the mirror's comment (:67-68) names each ring's size, `readConsoleLabel`'s doc (:241) follows L1, and GROUP's PASS text (:829) names the branch of the check that passed, with R, ΔS and ΔO.
````

**D6, text 1 of 1.** Old:

````text
**Its meaning.** The advisor's words, byte-copied from the ADV-2026-11-22-20 copy (sha256 d4c8856351288b6250ebee06a6e4b1e6e2f8a1b949dee9849cbbcf7477b83d8c), marked so:
````

New:

````text
**Its meaning.** The advisor's words, byte-copied by script, marked so, a sub-line span carrying its line's hash (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-20-the-console-forms-twelfth-file-test-code-only-two-rings-of-256-kept-the-open-drawers-frame-time-measured-after-the-sitting.md:12 @ 0f2078423378fb3f35346a6db9be5833ba0569b9 sha256:<line 12's hash, by the custodian's script>`):
````

**D7, text 1 of 2.** Old:

````text
None is on main yet. Each is filed under `state/directives/` before this form is committed, and §0.1 then names its path.
````

New:

````text
Each was filed under `state/directives/` before this form was committed; the custodian's header line names each path.
````

**D7, text 2 of 2.** Old:

````text
Ranges are reading aids, not pins, except where marked "pin: hash by the custodian".
````

New:

````text
Ranges are reading aids, not pins, except the two pinned references of §0.2 and §2.1.
````

#### 2. The additions (ADV-2026-11-22-28 items 2 to 4)

**(a) The open's own entries and the stop (item 4).** The draft's section A.1 says, by reading, which entries of the other kind an open records and when against P0. Its section A.3 checks §2.5 with the rule changed. The rule's texts follow.

**§1, "May not claim".** Old:

````text
- That every entry a first look adds is of the stream kind. That is by reading, and S7 checks it.
````

New:

````text
- That every entry a first look adds is of the stream kind. That is by reading, and S7 checks it: an entry of the other kind recorded after P0 stops the measurement unless the open itself explains it (§6, the reading after P1).
````

**§5, P5.** Old:

````text
- P5: in MEASURE', every settled run has other-added = 0, and the 1280 by 800 runs on `filter-zoned.parquet` have stream-added ≥ 220.
````

New:

````text
- P5: in MEASURE', every settled run's entries of the other kind recorded after P0 are the open's own (§6): other-added is 0 or 1, the `close_dataset` of the dataset the open replaced landing before or after P0, with no `binding_data_plane_attach` (the process attached before MEASURE'); and the 1280 by 800 runs on `filter-zoned.parquet` have stream-added ≥ 220.
````

**§5, Falsification.** Old:

````text
- a first look adding an other-kind entry (S7);
````

New:

````text
- a first look adding an other-kind entry that the open itself does not explain (S7);
````

**§6, MEASURE's opening paragraph.** Old:

````text
with the drawer collapsed
````

New:

````text
with the drawer collapsed from each run's step 1 to its P1 (the reading after P1 opens it, and closes it again before the next run)
````

**§6, Warm-up.** Old:

````text
- **Warm-up:** up to three opens of `filter-zoned.parquet` until S > 0. Otherwise the splits are marked inexact.
````

New:

````text
- **Warm-up:** up to three opens of `filter-zoned.parquet` until S > 0. Otherwise MEASURE' stops under S7 with `MEASURE': cannot tell the open's own entries from any other: no data request, cancel or log line was dropped after the warm-up (<label>)`. Once S > 0 it stays above 0, so every later run's P0 has S > 0.
````

**§6, The split.** Old:

````text
- **The split:** with S > 0 at P0, stream-added = ΔS and other-added = Δtotal − ΔS.
````

New:

````text
- **The split:** with S > 0 at P0, stream-added = ΔS and other-added = Δtotal − ΔS, both from P0 to P1.
- **The open's own entries of the other kind** (ADV-2026-11-22-28 item 4; by reading at 0f2078423378): `open_dataset` and `describe` are recorded before `openPath` returns (`frontends/shell/src/admission/admitDataset.ts:57`, `:61`; `frontends/shell/src/admission/AdmissionPanel.tsx:430`), so before P0, and are never in other-added. After P0 the open can add only: at most one `close_dataset`, for the dataset it replaces, sent by the workspace effect (`frontends/shell/src/App.tsx:1645-1650`) at a time the code does not fix against P0; and at most one `binding_data_plane_attach`, memoized once per process (`frontends/shell/src/streaming/dataPlaneClient.ts:20-27`). The open records no step (`frontends/shell/src/App.tsx:1180`) and no gui-action.
- **The reading after P1.** Each settled run, after P1, makes §2.5's R1 reading with P0 in place of R0 and §2.5's discard rule. Each reading is one `page.evaluate`: it opens the Console if closed; reads the label (N₂, S₂, O₂); computes a = (N₂ − N₀) + (O₂ − O₀) and L = a + min(M, S₂ − S₀); and clicks the closed group headers among the last L rendered entries, counting each closed group's ×N, walking from the end. A reading kept that clicks nothing is final. Readings are two frames apart, bounded to 30 s. Then the Console is closed. With a₁ = other-added (P0 to P1), the run decides in this order, each stop by name:
  1. A label that does not parse: S7, `MEASURE': the Console's label could not be read after P1 (<text>)`.
  2. O₂ − O₀ > N₀ − M: S7, `MEASURE': cannot tell the open's own entries from any other: <ΔO> entries of the other kind were dropped after P0, more than the <N0 - M> the other ring held then (P0: <text>; now: <text>)`.
  3. No final reading within 30 s: S7, `MEASURE': within 30000ms of P1 no reading had every group open among the newest <L> entries (<last reading>)`.
  4. Otherwise, take the entries of the other kind among the last L of the final reading, each by its kind and the name it shows: a class-A row whose header is not `viewport_query` or `cancel`, a class-B row whose prose does not end `(binding_log_session_event)`, and every class-C or unclassified row. If they do not number a: S7, as in 2, with `their count <k> is not <a>`. The run goes on only when they are: at most one `close_dataset`; at most one `binding_data_plane_attach`; and rows of `console.togglePanelExpanded` and `console.toggleGroupExpanded`, the reading's own, numbering together at most a − a₁. Otherwise: S7, `MEASURE': an entry of the other kind was recorded after P0 that the open does not explain: <names> (P0: <text>; P1: <text>; final: <text>)`.
  The JSON records, per run, a₁, a, L, the names found and the three labels. A stop ends MEASURE' at that run; it is not retried.
````

**§6, Rule W step 2.** Old:

````text
2. Any other-added > 0 is S7.
````

New:

````text
2. A run stopped under S7 by the reading after P1 ends the measurement, and rule W is not applied. Other-added from the open's own entries is recorded and enters neither Y nor X, which count stream-added only.
````

**§11, S7.** Old:

````text
- S7: MEASURE' gives other-added > 0, or a grammar disagreement.
````

New:

````text
- S7: MEASURE' records, after P0, an entry of the other kind that the open itself does not explain, or cannot tell the open's own entries from any other (§6, the warm-up and the reading after P1), or a grammar disagreement.
````

**(b) Rule W (item 3).** This sentence is part of the form from this amendment:

````text
Rule W's sentences (⟨H⟩'s two forms and ⟨FIGURE⟩) and its table of fractions are part of item 67's words, so they come to the advisor with K1 and K2 after attempt 2 (ADV-2026-11-22-28 item 3), and the commit that fills them in after MEASURE' is read narrowly by the reviewer against the rule (§10, commit 4).
````

**(c) The joined runs (OPEN-4, item 2).** The draft's section B.2 finds that K2 already carries the sentence, but more narrowly than the code. Its texts follow.

**K2, its last sentence.** Old:

````text
When the entries of the first kind that separate two runs of the same entry are dropped, the two runs show as one group, which is closed unless the earlier run was a group you had opened.
````

New:

````text
When the entries that separate two runs of the same entry are dropped and both runs are still kept, the two runs show as one group, which is closed unless the earlier run was a group you had opened.
````

**§2.3 item 6.** Old:

````text
6. **Grouping after a drop** (by reading; VL3; OPEN-4): two runs of one other-kind entry whose stream separators are dropped join into one group.
````

New:

````text
6. **Grouping after a drop** (by reading; VL3; OPEN-4, ruled by ADV-2026-11-22-28 item 2): two runs of one entry whose separators are all dropped while both runs are kept join into one group. The separators are then of the other kind: stream entries between two runs of an other-kind entry (VL3), or other-kind entries between two runs of a stream entry (by reading, not tested).
````

#### 3. The OPEN items (ADV-2026-11-22-28 item 2)

````text
OPEN-2, OPEN-3, OPEN-4, OPEN-7 and OPEN-8 are closed as §12 recommends, by ADV-2026-11-22-28 item 2 (OPEN-4's sentence in K2 as Amendment 1 words it; OPEN-7's §6 with the stop of item 4).
````

#### 4. For the attempt

- The draft's section "For the custodian and the advisor", items 1 to 3, is for the architect's attempt 2. By the custodian's summary, not the draft's words, it covers three things: the warm-up's inexact path becomes a stop, the class-C rows are named by their registry statements, and VL3 tests the joined runs in one direction only.
- By ADV-2026-11-22-28 item 5, after attempt 2 the advisor approves or replaces L1, K1 to K3, R1, R2 and W1 to W3. The build may start on attempt 2's verdict, and the words commit waits. By its item 6, the measurement runs after the sitting of 2026-11-24.

Read the last amendment first.

Nothing above is edited.

### Amendment 2 — 2026-11-22 — post-result amendment after the architect's form gate, attempt 2: its words D1 to D6 (section 31 (d)), and ADV-2026-11-22-30 items 2 and 4

**Authority.** The advisor's ruling ADV-2026-11-22-30 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-30-the-console-words-approved-rule-w-step-3-second-form-replaced-r2-cite-changed-the-build-may-start.md`), items 2, 4 and 6, under the delegation of 2026-11-13. The architect's form gate, attempt 2, PASS WITH NOTES: `state/consults/gates/2026-11-22-console-stream-lane-form-gate-architect-attempt-2.md`, gate-log row 842. Its words, not the human's and not the advisor's, are applied with no re-gate under section 31 (d), as the report says. ADV-2026-11-22-28 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-28-the-console-form-after-its-gate-amendment-1-then-attempt-2-the-five-open-items-as-recommended-the-stop-accounted-for-now.md`) item 5: the build may start on this verdict, and the words commit waits for the advisor's approval of L1, K1 to K3, R1, R2, W1 to W3 and Rule W, asked at 2026-11-22T18:43:32.497Z.

**How the texts were copied.** Each old and new text below is copied by script: D1 to D6 from the gate report's Documentation section, except D1's new text, whose value the script computes as the report asks; the last two from the advisor's ruling ADV-2026-11-22-30, its item 2 from its file's fences and its item 4 from its words. Each old text occurs once in this form above this amendment, and none overlaps another. Each new text is read in place of its old text.

**D1.** Old:

```text
sha256:<line 12's hash, by the custodian's script>
```

New:

```text
sha256:72d099f6f0ae79f76d0eaa926e4dcace2536a16bbd600b0a07853b62818347cc
```

Note: the hash is the sha256 of line 12 of `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-20-the-console-forms-twelfth-file-test-code-only-two-rings-of-256-kept-the-open-drawers-frame-time-measured-after-the-sitting.md` as committed at 0f2078423378fb3f35346a6db9be5833ba0569b9, its LF included, computed by the custodian's script; the gate's new text describes the value and is not copied.

**D2.** Old:

```text
The open records no step (`frontends/shell/src/App.tsx:1180`) and no gui-action.
```

New:

```text
The open records no step (`frontends/shell/src/App.tsx:1180`) and no gui-action after P0: the one gui-action an open can record, `dataset.openDuringExport` (`frontends/shell/src/App.tsx:1305`), answers the export ask, which comes before the admission (`frontends/shell/src/admission/AdmissionPanel.tsx:221`, `:238`), and MEASURE' runs no export.
```

**D3.** Old:

```text
and rows of `console.togglePanelExpanded` and `console.toggleGroupExpanded`, the reading's own, numbering together at most a − a₁.
```

New:

```text
and rows of `console.togglePanelExpanded` and `console.toggleGroupExpanded`, the reading's own, numbering together at most a − a₁, each told by its row's statement equal as a whole to that action's statement in the registry (`frontends/shell/src/console/surfaceRegistry.ts:266-270`, `:275-278`), never by a part that another row's statement shares.
```

**D4, text 1 of 3.** Old:

```text
| VL3 | consoleViewModel.test.ts | real recorder: A, `viewport_query`, B, then M × `viewport_query`: the first group is [A, B] | all evicted | M-9: grouping breaks on a seq gap |
```

New:

```text
| VL3 | consoleViewModel.test.ts | real recorder: A, `viewport_query`, B, then M × `viewport_query`: the first group is [A, B] | all evicted | M-9: grouping breaks on a seq gap |
| VL3′ | consoleViewModel.test.ts | real recorder: two `viewport_query`, a gui-action G, two `viewport_query`, then M gui-actions of another name: G is dropped, and the first group is the four `viewport_query` | all evicted | M-9: grouping breaks on a seq gap |
```

**D4, text 2 of 3.** Old:

```text
or other-kind entries between two runs of a stream entry (by reading, not tested).
```

New:

```text
or other-kind entries between two runs of a stream entry (VL3′).
```

**D4, text 3 of 3.** Old:

```text
Group closing is `ConsolePanel.tsx:96`, and joined runs are VL3.
```

New:

```text
Group closing is `ConsolePanel.tsx:96`, and joined runs are VL3 and VL3′.
```

**D6.** Old:

```text
stops the measurement unless the open itself explains it (§6, the reading after P1).
```

New:

```text
stops the measurement unless the open itself explains it (§6, the reading after P1). This holds for a settled run; an unsettled run is not read and enters no figure (§6, One run, step 5).
```

**ADV-2026-11-22-30 item 2, rule W step 3's second form.** Old:

```text
"can add up to ⟨Y⟩ entries of the first kind"
```

New:

```text
"can add ⟨Y⟩ or more entries of the first kind"
```

Note: the advisor's wording under the delegation of 2026-11-13, copied by script from its file's fences, `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-30-the-console-words-approved-rule-w-step-3-second-form-replaced-r2-cite-changed-the-build-may-start.md`.

**ADV-2026-11-22-30 item 4, R2's closing cite.** Old:

```text
ADV-2026-11-22-22 item 6
```

New:

```text
ADV-2026-11-22-30 item 4
```

Note: the advisor's ruling, `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-30-the-console-words-approved-rule-w-step-3-second-form-replaced-r2-cite-changed-the-build-may-start.md`, item 4.

**D5, the estimate.** The recount is about 790 lines, within 850, by the gate's check 5, with `frontends/shell/e2e/console.mjs` named as the risk. §7 is not edited.

**Order.** D3 is in place before the build's commit 3, and D4 before its commit 2, as the report says; this amendment is on main before the build is dispatched.

Read the last amendment first.

Nothing above is edited.

### Amendment 3 — 2026-11-23 — post-result amendment after the architect's build gate, part 2 (FAIL, Evidence only): T1 to T4, rule W's two phrases, P4's clause recorded wrong (ADV-2026-11-22-45, as ADV-2026-11-23-02 reads it)

**Authority.** The advisor's ruling ADV-2026-11-22-45 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-45-the-console-part-2-t1-to-t4-into-amendment-3-groups-clause-recorded-wrong-the-table-row-again-rule-ws-phrases.md`), items 1 to 9, and its ruling ADV-2026-11-23-02 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-02-the-console-one-test-code-commit-t1-and-the-override-the-mutations-as-patch-files-outside-the-repository.md`), which reads that ruling's items 5 and 7 and replaces them to that extent, both under the delegation of 2026-11-13. The architect's build gate, part 2, FAIL on Evidence only (`state/consults/gates/2026-11-22-console-stream-lane-build-gate-architect-part-2.md`, gate-log row 853). The failed gate stays FAIL in every record.

**How the texts were copied.** Each old and new text below is copied by script, byte for byte, from the one-line fences of that gate report as filed on main: T1 to T4 from its section "Words for the form", rule W's phrases from its section 4. Each old text occurs exactly once in this form above this amendment, checked by script at main 08b4388ff15317d56c119993802c6afeda23f2ff; the line given with each is where it stands there. T1 to T4 are the gate's words. Rule W's two new phrases are the advisor's wording under the delegation of 2026-11-13 (ADV-2026-11-22-45 item 4), each also checked to occur in that ruling as quoted. None is the human's wording.

**T1** (section 2.5, at line 261). Old:

```text
**R0, the first reading:** the label only, at `label0`'s position (`command-bar.mjs:479`), giving N₀, S₀ and O₀. R0 opens and clicks nothing.
```

New:

```text
**The fill, then R0, the first reading.** After card A's wait (`waitCommitted`) and before R0, one `page.evaluate` calls `document.querySelector(".console-disclosure").click()` 128 times, the suite's own DOM click (`command-bar.mjs:355-359`, `:385-386` at 12251bc8850127b72a9fb2b5fce63c33ef2d7075), never `page.click`: the Console sits in the Activity region, which E-CTRLK leaves closed as the app opens it (`command-bar.mjs:157`, `:176`; `frontends/shell/src/layout/layoutState.ts:51`). Each click records one `console.togglePanelExpanded` entry of the other kind (`ConsolePanel.tsx:80`) and flips the drawer (`:81`); 128 is even, so the drawer ends open, as card A's wait left it. The other ring then holds M at R0 whatever it held before, and with S₀ > 0 so does the stream ring: N₀ = 2M, the ordinary state (ADV-2026-11-22-24 item 1). R0 is the label only, read after the fill at `label0`'s position, giving N₀, S₀ and O₀; it opens and clicks nothing. The unmutated run records N₀; N₀ ≠ 2M with S₀ > 0 is a stop to the advisor (S11).
```

**T2** (section 4, at line 364). Old:

```text
M-G1 (test mutation): 200 clicks of `.console-disclosure`, inserted after the fill loop (`console.mjs:718-722`) and before the layer-tab click (`:723`). By arithmetic, R ≥ 200 > M, and ΔO > N_base − M, because 200 exceeds the stream ring's holding of at most M. The 200 clicks also evict the three style rows, so `pollConsole` returns not found; but the capacity check (`:733-736`) runs before the presence check (`:739`). Set {`GROUP': capacity:`}.
```

New:

```text
M-G1 (test mutation): one `page.evaluate` that calls `document.querySelector(".console-disclosure").click()` 200 times, the suite's own DOM click (`console.mjs:159-171` at 12251bc8850127b72a9fb2b5fce63c33ef2d7075), inserted after the fill loop (`:725-729`) and before the layer-tab click (`:730`); never `page.click`, because the Console sits in the Activity region, closed as the app opens it and never opened by this suite (`frontends/shell/src/layout/layoutState.ts:51`). Each click records one entry of the other kind (`ConsolePanel.tsx:80`) and flips the drawer (`:81`); 200 is even, so the drawer ends open. With h_o the other ring's holding at the baseline and room = N_base − M ≤ h_o (the stream ring holds at most M), dropO ≥ h_o + 203 − M > room, and R ≥ 203 > M. The clicks also evict the three style rows, so the presence poll ends not found after 5000 ms (`:72`); but the label check (`:740`) passes and the capacity check (`:746-750`) runs before the presence check (`:754`). Set {`GROUP': capacity:`}.
```

**T3** (section 4, at line 366). Old:

```text
**M-CB1** (test mutation): 200 clicks of `.console-disclosure`, inserted after R0 (`:479`) and before card B's `sendCondition` (`:480`). By arithmetic, a ≥ 200. ΔO = max(0, (N₀ − M) + a − M), which exceeds N₀ − M because a > M. Set {F2′}.
```

New:

```text
**M-CB1** (test mutation): one `page.evaluate` that calls `document.querySelector(".console-disclosure").click()` 200 times, inserted after R0 and before card B's `sendCondition` (`command-bar.mjs:465`, `:466` at 12251bc8850127b72a9fb2b5fce63c33ef2d7075); never `page.click`, for the reason the fill gives (§2.5). Each click records one entry of the other kind; 200 is even, so the drawer ends open. By arithmetic, a ≥ 200. ΔO = max(0, (N₀ − M) + a − M), which exceeds N₀ − M because a > M; S₀ > 0, so F7 (`:494`) is not reached first, and F2′ (`:496`) is thrown at the first kept reading. Set {F2′}.
```

**T4** (Amendment 1, section 1, at line 650). Old:

```text
**M-CB3:** `droppedOther` read as 0 in `collapsedCountSync.ts` and in `ConsolePanel`'s sync. Then ΔO reads 0, so a reads N₁ − N₀ (0 in the ordinary state, both rings full), and L = min(M, ΔS). The entries rendered after R0 are the stream entries still held and every other-kind entry recorded after R0, so the last L leave out the oldest of them, as many as there are other-kind entries. Card B's `record_step` is left out, and the set holds, when the held stream entries recorded after R0 and before it number no more than the other-kind entries recorded after it (R1's clicks among them); in the ordinary state, where card B's load adds more than M stream entries, that holds when the `record_step` is recorded before the oldest stream entry still held. By reading at 0f2078423378: the step is enqueued after the untiled request's issued outcome (`frontends/shell/src/App.tsx:394-395`, `:1072`) and recorded in the same call when no step is in flight (`frontends/shell/src/workspace/stepRecorder.ts:49-55`, `:69-75`; `frontends/shell/src/skp/client.ts:59`), and tiles are asked for only at that look's Completed terminal (`KNOWN-LIMITATIONS.md` item 67's comment). Set {F4 with n = 0}. The build checks the reading: the unmutated E-AND run records, from its final reading, ΔS, a and the number of held stream entries recorded after R0 and before card B's `record_step`; if that number is above 0, M-CB3 is not run as evidence and goes to the advisor as a possible pass case (ADV-2026-11-22-26 item 2); a pass of a run made is a finding.
```

New:

```text
**M-CB3:** `droppedOther` read as 0 in `collapsedCountSync.ts` and in `ConsolePanel`'s sync, run with §2.5's fill in place (both rings full at R0, N₀ = 2M). The label then shows O = 0 at both readings, so ΔO reads 0 while the true ΔO is a; a reads N₁ − N₀ = 0, since both rings stay full; and L = min(M, ΔS), so the last L rendered entries are the newest M of all held. Card B's `record_step` is among them only if fewer than M held entries are newer than it. In a run whose unmutated twin records ΔS ≥ M and no held stream entry recorded after R0 and before card B's `record_step` (run 3 at 12251bc8850127b72a9fb2b5fce63c33ef2d7075: ΔS = 223, 0), the M held stream entries are all newer than it, so added is empty; F2′ (0 ≤ N₀ − M) and F7 (S₀ > 0) are not reached, and after 30 s E-AND fails with F4, n = 0 (`command-bar.mjs:507`, `:489`). Set {F4 with n = 0}. A twin that records otherwise sends M-CB3 to the advisor unrun as evidence (ADV-2026-11-22-26 item 2); a pass of a run made is a finding. The run records its applied diff.
```

**Rule W, step 4, the first phrase** (section 6, at line 432). Old:

```text
in a window ⟨w⟩ by ⟨h⟩ pixels
```

New:

```text
with the page the app draws in set by the test to ⟨w⟩ by ⟨h⟩ pixels
```

**Rule W, step 4, the second phrase** (section 6, at line 432). Old:

```text
at the app's own window size, 1280 by 800
```

New:

```text
with the page set to 1280 by 800, the content area the app's window asks for when it opens, at 100% display scaling
```

Rule W's item also says, as the gate report does, that the device pixel ratio of the override is not recorded (ADV-2026-11-22-45 item 4).

**P4 for GROUP', class 2 (ADV-2026-11-22-45 item 2).** Section 5's prediction P4 is recorded as wrong in its clause on the ordinary state, for GROUP', with no fill: GROUP' passes on its first branch, and a fill would not move it to the second. The closing says plainly that no run shows GROUP' in the ordinary state, and that no unmutated run passes by the capacity check's second branch, which is shown only from its failing side, by M-G1. For E-AND, T1's fill puts the unmutated run in the state that ADV-2026-11-22-24 item 1 speaks of, and M-CB3 differs from it by the mutation alone; that sentence is not claimed for GROUP'.

**What is committed, and what is not (ADV-2026-11-23-02 items 1 and 2).** The worker's one test-code commit holds T1's fill in the unmutated step and the override cleared at the measurement's end as `layout.mjs` does it, and nothing else. The gate's note gives where: MEASURE' sets the override again at `console.mjs:1005`, where `layout.mjs:264` clears it (reading aids at 12251bc8). T2 and T3, and the M-CB3 mutation under T4, are never committed: the worker writes each as a patch file outside the repository, and the tester applies it for its run, records the applied diff, and reverts it (the gate's D2).

**The table row and S6 (ADV-2026-11-22-45 item 3).** The table row runs again at the new head with the others. At that run the tester makes the oracle as `table.mjs`'s header says: the generator run into the tester's own folder, its printed counts recorded, its sha256 compared with the shared copy's. Run 12b's record stays as it is, with the gate's E4 beside it. S6, reached at run 12, is recorded with its cause: the launch left out a variable that the suite's README entry sets. It closes when the row passes at the new head, launched as that entry says, with the oracle sourced.

**D1 and D2 (ADV-2026-11-22-45 item 6).** As the gate gives them: no record carries the tester's mechanism for runs 2 and 4, or for FIND'; the M-CB3 re-run records its applied diff. The pull request's body and this piece's records are read for any sentence saying that P2 is met, or that E-AND or GROUP' passed in the ordinary state, and each is corrected in the gate's words (its section 5) before the merge check.

**The sequence (ADV-2026-11-22-45 item 7, as ADV-2026-11-23-02 item 3 reads it).** This amendment; the worker's one test-code commit; the reviewer's narrow read of that commit, with the recount of the lines (class 8 if over); the e2e rows again at the new head, M-G1, M-CB1, M-CB3, M-A4-1, M-A4-3, M-X2 and the table row among them, the mutations applied from their patch files; then the architect's narrow attempt, which reads each recorded applied diff against T2, T3 and T4, and each run against its named set.

**The standing rule (ADV-2026-11-22-45 item 8).** From that ruling, a form or a gate that says a mutation has no known pass case names the recorded run, or the declared set-up, in which the mutated value differs from the true one; the ordinary state is not such a name unless a run shows the suite in it.

**The merge.** After the tag; commit 4 after the sitting (ADV-2026-11-22-45 item 9).

Read the last amendment first.

Nothing above is edited.
