Reviewed: PR #222 at 3dfc1a0e51ac1936a1008d815c8d19b8dab69367 (base 31e25f15) — cut/b2-piece-1b-recording @ 3dfc1a0e51ac1936a1008d815c8d19b8dab69367
Verdict: FAIL

The verdict fails on Correctness: C-1, with C-2 and C-3 fixed in the same round. C-4 needs only new words, applied with no re-gate. C-5 is a red line and waits for the human's answer. Evidence is closed apart from the open items under Notes. The Documentation findings must be fixed before the merge, with no re-gate.

I had no shell for this gate. Four things are left to the reviewer: recomputing hashes, CI at the head (Linux K7/K8, which is H4), the PR body, and whether Amendment 6's commit came before 7b547f90.

## Correctness

**C-1. The writer writes lines its own reader refuses. Blocking.**
- **What the writer does:** it puts members into each step with no bound.
  - `dependencies.crs.identifier`, at kernel/src/session_history.rs:380.
  - The count of `geometry_types`, at :384.
  - The field `type`, at :367.
  - The header goes through `DatasetRef::to_json`, at :242-243.
- **What the reader allows:**
  - TEXT members up to 4,096 bytes and lists up to 1,024 items (:445-446, :529, :536, :546).
  - In the header, an identifier and an identity column of at most 4,096 bytes each (kernel/src/dataset_ref.rs:602, :614).
- **What can feed an over-bound member:**
  - The engine takes a file's `id` authority and code as the identifier, with no length bound (engine/src/geoparquet.rs:655-669).
  - The engine does not bound how many `geometry_types` a file declares (:406-422).
  - For an asserted identifier, the engine checks only that it is not empty (engine/src/crs.rs:72).
- **The effect:** every `record_step` on such an open replies success, but `recover` stops at line 2 (or line 1 for the header). By ADR-036 §9, nothing after the failing line is recovered (session_history.rs:766-774), so the whole record is lost to the reader.
- **An untrue limit claim:** U7's comment (:1199-1203) says that past 4,096 bytes the ceiling check refuses the step by name. The only ceiling checked before the write is the 262,144-byte line ceiling. Under the proportional-gates direction, an untrue claim of a limit is a Correctness finding.
- **Fix:**
  - Before `append`, check the canonical line against the reader's own rules: `check` against `STEP` plus `check_intent` for a step, and `HEADER` plus `DatasetRef::parse` for the header.
  - On a failure, refuse by name with nothing written, the detail naming the member's path and the rule.
  - Add a unit test, for example a 4,097-byte identifier or 1,025 geometry types. Its mutation: the pre-write check is removed, so the line is written.
  - Rewrite U7's comment to say this. Suggested words: "by the reader's 4,096 bytes each: a longer member is refused by name before it is written, because the writer checks each line against the reader's rules".

**C-2. A failed record creation leaves files that are never cleared. Fixed in the same round.**
- In session_history.rs:205-245, `create` makes the folder first (:210-212).
- Any later failure returns `Err` and leaves the folder behind, with `locations.json` (which holds an absolute path) and possibly a header-only history. The later failure points are the `locations.json` write (:222), the history open (:226-232), the lock (:233) and the header write (:242-243).
- The record never enters `records`, so `end_session` (:194-202) never removes it. Each later step for that file repeats this with a new folder.
- The stage-1 report noticed this in its item 10, and it was not fixed.
- **Fix:** on any error after `create_dir`, remove what `create` wrote before returning. No test-only path may be added for it; if no product seam can carry a test, the record says so.

**C-3. A Reset that changes nothing shows nothing in the console (docs/01 principle 4; docs/07's split note on the Action console).**
- In App.tsx:1910-1916 and StylePanel.tsx:140-144, a Reset whose style already equals the last committed style produces no transition. Nothing is sent, and no console row is written.
- The base wrote a class-C `style.resetToDefault` row for every Reset. The stage-2 report noticed the gap in its item 10.
- docs/01 outranks the form's decision that all five style rows leave class C.
- **Fix:** when a Reset's commit produces no transition, record a class-C row for `style.resetToDefault`.
  - Its statement is a new P6 string for the human's sight: no step is sent because nothing changed.
  - Its owner must not contain ADR-022, so that CLASSC' stays green.

**C-4. One sentence's words only; not the human's wording.** The worker applies these words with no re-gate, and the PR body lists them.
- **Where:** protocol/skp/SKP-V0.md:1261, the sentence `A refusal at (1) to (8) writes nothing.`
- **Why it is wrong:** on the first step for an open file, step (7) writes the folder, `locations.json` and the header. A refusal at (8) leaves them in place.
- **Replacement words:** A refusal at (1) to (6) writes nothing. At the first step for an open file, (7) creates the record: its folder, `locations.json` and the history's header line; a refusal at (8) leaves that record and writes no step.
- **Clause check:**
  - (1) to (6) come before the record (session_history.rs:150-165, then :167-176). K2 shows that a refused predicate leaves no folder (kernel/tests/session_history.rs:207-226).
  - (7) creates the folder, `locations.json` and the header (:209-212, :222, :242-243).
  - The bounds at (8) refuse before the write (:84-97), and the record stays in `records` (:173).
  - The sentence stays true after C-2's fix.

**C-5. Red-line text; the human answers. No code change and no re-gate.**
- **Where:** docs/adr/ADR-022-style-v0-as-the-single-style-model.md:75, `each edit is one step`.
- **Why it does not hold for Reset:** the code calls a Reset one commit (StylePanel.tsx:141; App.tsx:1907), but it records one step per property that changed. In run 1, one Reset recorded two steps.
- **Candidate words, for the human to type or replace:** `each committed change of one style property is one step`.
- **Or the human may accept it as it stands:** the gap is then recorded in `handleReset`'s comment and on the form.

## Documentation (must be fixed before the merge; no re-gate)

**D-1. The kernel's absence bullet still counts two operations.**
- **Where:** kernel/README.md:277-278 and kernel/src/lib.rs:21-22. Both still say this crate orchestrates **two** operations, which leaves out `record_step`.
- **Replacement:** Besides recording steps, a workspace mutation (ADR-006 class 2) that this crate never applies, it orchestrates **two** operations with **different ADR-006 classes**:
- **Clause check:** each step's effect is `workspace-mutation` (session_history.rs:408). `record_step` writes one line and returns, and applies nothing (:149-190). The two bullets that follow are unchanged.

**D-2. The kernel's owner index lines are not updated (§8 item 15).**
- kernel/README.md:392: add `43`.
- :377: add `kernel/tests/no_generation_in_persisted_artifacts.rs::a_session_history_carries_no_generation_session_reference_handle_path_or_user_name`.

**D-3. The unwritable code is described only as a write or flush failure.**
- **Where:** protocol/src/v0/error.rs:117-118 (full path protocol/skp/src/v0/error.rs) and the When cell at SKP-V0.md:1276.
- **Doc words:** `record_step` (`skp/0.12`): the history could not be created, locked or written, the write or the flush failed (after a flush failure the bytes may be in the file, so the message does not say they are not), or the step's line could not be built; `detail` says which.
- **Cell words:** the history could not be created, locked or written, or the step's line could not be built; after a flush failure the bytes may be in the file.
- **Clause check:**
  - created: session_history.rs:206-232, and the binding with no data directory at commands.rs:142-146;
  - locked: :233;
  - write or flush: :99-106;
  - header over its ceiling: :89-92;
  - line not built: :163-165, :262-265, :366, :373.
- After C-1, the cell also covers that refusal.

**D-4. A binding comment now counts wrong.**
- frontends/shell/src-tauri/src/commands.rs:166-167: replace `dressed up as a sixth command` with `dressed up as an SKP command`. `record_step` is now SKP's sixth.

**D-5. console.mjs mutation comments are stale.**
- **Where:** frontends/shell/e2e/console.mjs:608-610 and :682-688 still say the mutations are to be observed and not yet observed.
- **Fix:** name the observations.
  - CON-CLASSC was observed at 7b547f90 (run 2).
  - CON-GROUP was observed at 7b547f90 and again at 3dfc1a0e. It fails at `GROUP': split run`, not at `grouping not exercised`.
  - CON-TOGGLE was observed at 3dfc1a0e (run 3).

**D-6. The e2e README and the walkthrough describe CLASSC' and GROUP' as they were before the re-aim.**
- **e2e/README.md:285-297, replacement:**
  - `CLASSC'` sets the fill colour through the real `.style-fill-color` input. It polls, within the same declared bound, for a new class-A `record_step` row for that `style.set` edit at `ok`, and asserts that no class-C entry with an owner containing `ADR-022` remains.
  - `GROUP'` makes three fill-colour edits and polls for their class-A `record_step` rows (`style.set`). It then asserts the grouping rule inside their window, as now worded, without the residential and nonce sentences. After the group is found, one click on its header must write exactly one entry: the class-C row for `console.toggleGroupExpanded`, its owner naming docs/03 and its statement containing `no API equivalent`.
- **Clause check:** console.mjs:613-653 and :704-825.
- **MANUAL-WALKTHROUGH.md:682, the CLASSC' row:**
  - Replace its middle cell with: a real style-panel fill-colour edit produces a new class-A `record_step` entry for that `style.set` edit at `ok`, and no class-C entry whose owner contains `ADR-022` remains.

**D-7. The recording suite records neither its mutations nor what it does not prove.**
- **recording.mjs header (:5-32):** add the four observed mutations. They were observed at 936b7982, recorded in run 1: REC-APPLY, REC-STYLE, REC-RESET and REC-CHAIN, each with the step it fails.
- **e2e/README.md:786-798:** add a paragraph on what it does not prove:
  - E2 is row AA4.
  - `page.fill` dispatches `change` itself, so H2 is AA2's to prove.
  - Each step's recorded mutation is in the file's header, with its commit and run.

**D-8. The walkthrough rows do not say how to find the record folders (MANUAL-WALKTHROUGH.md:1906-1907; draft cells).**
- **AA3, expected outcome:** A new `unsaved-` folder under `%LOCALAPPDATA%\spatial-ide\sessions` holds the header and AA1's and AA2's steps, in order.
- **AA4, step:** Start the app, open `filter-zoned.parquet`, apply a filter, and note the new `unsaved-` folder under `%LOCALAPPDATA%\spatial-ide\sessions`; then close the app normally.
- **AA4, expected outcome:** The folder you noted is gone; AA3's folder stays. This row carries E2.
- **Clause check:** the folder is created at the first step (session_history.rs:209). A normal close runs `end_session` on `RunEvent::Exit` (src-tauri/src/lib.rs:573-580), and `end_session` removes only this run's records (:194-202; K6).

**D-9. Round 8 for OPEN-6: the PLAN node does not name the consumer.**
- PLAN.yaml:5221 on main does not name `b2-piece-1c-save-and-reopen` as the consumer of `recover` and of the `locations.json` file. The form's §2.6 requires it.
- I could not check the PR body; the reviewer confirms it names the consumer.

**D-10. Round 25 (§8 item 13), a scope addition not recorded as class 9.**
- Deviation 1, the fifth code `skp.style_value_not_admitted`, is a wire addition. It landed before any amendment declared it, and Amendment 4 item 4 records it as class 2.
- Add one row, references only: the code is class 9, landed before its declaration, disclosed.

## Notes (non-blocking)

- **N-1. The console's row for a style edit.** It now shows the `record_step` request, which is the call the action really made. But it does not reproduce the edit, and no SKP command sets a style. Row AA2's felt question covers this.
- **N-2. P6 sight for O3 and its filter counterpart.** In `still waiting there`, the waiting changes are in the shell's queue, not in the history. Candidate words: `still waiting to be sent`.
- **N-3. E2 is unobserved until AA4 is run.** Until then, the normal-close claims in KNOWN-LIMITATIONS 43, the docs/07 note and ADR-036 §9 rest on K6 and a reading of lib.rs:573-580. The closing record must not call E2 done before then. Possible follow-up: a non-forced `taskkill /PID` sends WM_CLOSE and could automate E2.
- **N-4. H2 is AA2's to prove**, because E1 drives the commits through `page.fill`.
- **N-5. The reader takes only `not-declared` for `geometry_types` (:546).** ADR-036 §6's cell allows any named state there. Note this for 1c.
- **N-6. A step queued for a dataset closed before its send.** Its refusal is only logged. The case needs timing inside one request round trip; record it in App.tsx:827-830's comment.
- **N-7. `skp.record_step_panicked` is not in SKP-V0 §10.4.** The same is true of its sibling codes.
- **N-8. The style kept across a rebind is never recorded as a step in the new record.** This is for 1c and piece 4.
- **N-9. KNOWN-LIMITATIONS 43's 32 MiB is per path and per admission claims.** A reopen under different claims starts a second record. Reaching the bound is not ordinary use.
- **N-10. Unused helpers** in console.mjs (`windowOf` at :297 and the residential-row helper at :285-290) stay, by the human's word.

## Deviations for judgment

- **The fifth code: holds.** No existing code names the cause, and principle 8 requires the named cause. The code has a constructor, a fixture and SKP-V0 §10.4 and §8 entries. The record fix is D-10.
- **The history opened for reading and writing: holds.** There is one writer, `create_new`, and a sequential cursor. A failed write stops the history. LockFileEx needs GENERIC_READ or GENERIC_WRITE access. No ADR or SKP text says append.
- **`filter` required as a key: holds.** It enforces §2.2's always present, and the reader requires it too (:493).
- **Part AA: holds.** It is a name only.
- **E2 carried by AA4: holds.** This is H5's declared fallback; evidence stays open (N-3).
- **The notice in the attention strip: holds.** NoticesPanel is the third-party notice text. The notice is non-dismissible, ends with its dataset, and never replaces a refusal.
- **The e2e README entry: holds as a path.** Its content is D-6 and D-7.

## e2e/console.mjs against Amendments 6 and 7 and the 2026-10-16 direction

- **CLASSC'** keeps its name, and its comment states why (:593-599).
- **GROUP' still proves coalescing:** run 3 shows a `×3 a:record_step` group, and CON-GROUP fails by name.
- **GROUP' now proves the group toggle's class-C row** (:767-822), and CON-TOGGLE fails by name.
  - The row is identified as the one entry the click wrote. Its action name is not rendered (ConsolePanel.tsx:193-199).
- **No other step changed.** The helpers and every later step sit at a constant offset from the base, and the `runStep` list is identical. Only the header comment changed besides the two steps.

## §8, item by item

1. Pass. Checks come before the write (:150-187). There is one `write_all` and one `sync_all`, with no buffer (K9, K8).
2. Pass. The header and steps hold no generation, session reference, handle, path or user name (G2). Only `locations.json` holds the path.
3. Pass. The kernel holds no filter or style value (:113-120), and there is no restore, undo, replay or undoable.
4. Pass. No attribution crosses the wire (commands.rs:513-582), and the response is `{}`.
5. Pass. There is no scope action and no feature id.
6. Pass. The code came after OPEN-1 and OPEN-3 were ruled, and ADR-036 is still Proposed. ADR-022 and the docs/07 note are byte-equal to the ruling's text (read; the reviewer hashes them). The blocks are applied as ruled (spot-checked: 0, A to K, the cell, the scope row).
7. Pass, with N-6. The kernel messages state the kernel's own facts.
8. Pass. `LOCALAPPDATA` appears only in audit/log.rs:373, and in the e2e harness by design.
9. Pass. The new `pub` items are the §2.3 list plus `recover`'s return types (OPEN-6), and `referenced_columns` (Amendment 1 (a)).
10. Pass, by the worker reports: the engine change is under Amendment 1, and data-plane and lock diffs are empty. The reviewer confirms.
11. Pass. A style step is recorded only from the native `change` (StylePanel.tsx:93-109).
12. Pass. The 60 s and poll figures are bounds, not timings.
13. D-10. The overrun is class 8 and §7 is not edited. No `verify-mutation` run is called an observation. No branch hash pins test text. The full form is used.
14. Pass, as far as I read. The verbatim blocks match their sources. Hashes are the reviewer's.
15. D-2.
16. Not checked: this is the custodian's dispatch record.

## Other checks

- **ADR-006:** both actions are class 2, the history is the command log, and nothing claims undo.
- **ADR-004 Amendment 4:** holds.
- **Principles:**
  - 4: C-3 and N-1.
  - 5: holds; `record_step` is SKP.
  - 7: holds; it runs on `spawn_blocking`, its lack of cancellation is declared, and the canvas never waits.
  - 8: holds; the history is plain text, and an unregistered action is kept.
- **R1 and R9:** hold. The intent carries predicate text and style values, and no parameter carries coordinates.
- **The seam rule:** each seam is written against the real shape.
  - The shell to the file is proven by E1 at 936b7982, with the exe unchanged since.
  - Engine admission and `DatasetRef` are proven by K1 and K2, and Amendment 2's two accessors by K10 to K12 against `describe`.
  - The generations are proven by K3.
- **Round 8:** `recover` and `locations.json` are named in the module doc (:18-19); the PLAN node is missing (D-9).
- **The round-7 discharge rule:** every discharge claim resolves.
- **The operator-text rule:** see N-2.

No missing decision needs an ADR.
