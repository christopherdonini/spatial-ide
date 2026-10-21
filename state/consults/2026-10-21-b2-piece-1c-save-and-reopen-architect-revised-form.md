*Custodian's filing note (2026-10-21): the architect's revision of piece 1c's full form, with the human's rulings folded in and written against the recommended options of ADR-036's pre-acceptance block, each place that depends on one marked; read only at main 6c3795c5. The run 2026-10-21T09:39:02Z to 09:52:49Z by its transcript (Read 40, Grep 17, Glob 4; no Write, Edit or Bash), up to its SubagentHandback call. Held in scratch under governance D's freeze and filed after the click. Not committed as the form: that waits for the block's merge and the human's acceptance, with its pins added by script. The revision refers to the human as he in a few places; the committed form uses they. Extracted by script from that call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 7d1ffe5cf85663b328cdc6e9f11998390e8d0fdf828118cfbd35ec40398165e6.*

---

Revised: b2-piece-1c-save-and-reopen, its full form, at main 6c3795c5

Read: main @ 6c3795c5257013d5471bacf68d8c7bb6a2006e0b. `.git/HEAD` names refs/heads/main, and that ref holds this id. Verdict: none. This is a revised draft, not a gate.

**About the cites.** I re-read every cite at 6c3795c5. Each line cite is written `<full path>:<line> @ 6c3795c5`. I have no shell, so no cite carries a sha256; the custodian fills each one by script. A quoted sub-line span carries the hash of its whole line. The ledger is never cited by line. PLAN.yaml is cited by node id only. The three passages of the human's words are byte-copied from my Read of the directive, with the Read tool's line prefix removed. That copy was not made by script, so the custodian confirms and replaces each by script.

---

## What changed against the draft, and why

**Item 1: the OPEN items, ruled** (`state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:14-18 @ 6c3795c5`)
1. **The OPEN section is now "OPEN items, as ruled".** Every option's text is kept and the ruled option is marked. The human's words for OPEN-4 and OPEN-5 are quoted there. His words for ADR-022 Amendment 2 are quoted once, in §2.10, where the worker applies them; OPEN-2 points to that quote.
2. **The dependent text is settled.** Every "under OPEN-n (A)" now reads "OPEN-n (A), ruled". OPEN-17's note now says the `.spatial` check is on record.
3. **OPEN-5 (B) went against my recommendation.** The text it settles:
   - §2.5 is rewritten. The check is made at open, the same way on every platform. It walks segment by segment with std's `symlink_metadata` and `FileType::is_symlink`. No handle is opened for the check and none is held after it. The window is declared, and it runs to every later read the engine makes by path.
   - Withdrawn: H2, H3, K-R5, I5 and KNOWN-LIMITATIONS K-1. Each is marked withdrawn, so the numbering does not move.
   - Restated: K-2, now for every platform; §1's may-not-claim; §2.9 (no OS split); §8 item 2; §5's falsification; §0.2's paraphrase of the reuse rows.
   - Why std's walk and not the draft's handles closed after the check: the handle existed only to be held. Std gives the same per-segment link test on every platform without a `cfg`. That also removes a contradiction in the draft, whose §2.9 declared an OS split while §8 item 10 blocked any `cfg`.
4. **OPEN-4 (A).** §2.3's carrying rule and §2.5's judge state the ruling. K-S11 is renamed to state its rule, and its mutation is "the save refused".
5. **OPEN-10 (B).** The workspace member carries `clauses`, `{text, enabled}`. §0.3 gains the `FilterClause` pin.
6. **OPEN-14 (A).** §2.3 gains the writer's refusal over 2^53 − 1, and §4 gains U-I1. The block draft names this as 1c's code: `state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:244 @ 6c3795c5`.
7. **OPEN-6 (A).** O0 uses the file the human prepares at the laptop, and the custodian tells the human when.
8. **§0.1.** "O0 … owed before the resolver is designed" now reads "owed before any code", because OPEN-5 (B) chose the design.
9. **§10.** Amendment 1 now records O0 and the block's rulings. The form's own rulings are already in its body.

**Item 2: step 0 superseded**
1. Step 0 is removed from §2.11, §2.13 and §2.14.
2. §2.10 is rewritten. It now states:
   - what 1c appends to ADR-036 after acceptance (the block draft's section 2: W, D, M, H and S);
   - item C, the reader ceilings by number. It is kept from the draft's A14, which N-9 and the acceptance consult assign to 1c. The block draft's section 2 does not list it.
   - where ADR-022 Amendment 2 lands;
   - the live text that still says "Proposed".
3. Other places that follow from this:
   - the "Code starts only after" list (the block merged, the acceptance typed, the appended amendment's text approved);
   - the Form-and-gating ADR bullet and §1's ADR line;
   - §8 item 7 and §9's architect line;
   - a new ADR-text group in step 1's budget.

**Item 3: places that depend on the block's open items** Each is marked `(conditional on the block's OPEN-<x>)`, with what changes under the other option:
- **OPEN-L:** §2.3's layout, §7's layout constants, U-L1.
- **OPEN-W:** §2.3's workspace member and §2.10 W.
- **OPEN-D:** §2.4 step 6, L1 to L4 and §2.10 D.
- **OPEN-R:** §2.5's text check and §7's device-name list.
- **OPEN-A:** §2.3's integer refusal, the B-items in §2.10, and step 1's ADR ceiling.
- **OPEN-O:** §2.14, the block row.
- **OPEN-S:** nothing in this form depends on it.

**Item 4: ADR-022 decision 3, answered in the new §2.3a**
- The layout is a canonicalization. It is therefore written in `renderer/src/canonical.rs` as one new function whose product caller is the kernel's writer.
- The strict reader checks layout and spelling by rendering the parsed value with that function and comparing bytes, so reader and writer cannot drift.
- Follow-on changes:
  - §2.3's writer bullet ("the renderer is not changed" is withdrawn);
  - U-R3 and U-R4's mutations;
  - U-L1;
  - a renderer group in step 1's budget;
  - §5's declared-unchanged list;
  - §8 item 14;
  - §9's seam list;
  - §0.3's canonical-module pins.

**Item 5: rule (00)** §2.14 is rewritten against governance D, PR #239, the redaction scan's revised paths, the block, and milestone 4's drafted paths with their rulings. It also covers milestone 4's OPEN-4 (A′) recording piece.

**Item 6: cites**
- Every cite is re-read and re-written in full at 6c3795c5. Between eaa3d2a9 and 6c3795c5 no cited line moved.
- One range is widened: the liveness cite, `frontends/shell/src/admission/AdmissionPanel.tsx:349-385`, becomes `:349-392`. The liveness `div` sits at 387-392, outside the draft's range. Nothing moved and no fact changed.
- Facts that changed:
  - The `.spatial` check is on record (`state/consults/2026-10-21-spatial-extension-check-custodian.md`). The draft's could-not-settle line for it is removed.
  - The draft's disclosure about reading at 905a5cf6 is replaced by this read at 6c3795c5.
  - Neither the redaction form nor milestone 4's form is committed at 6c3795c5, and PLAN.yaml has no node for the block yet.

**Sentences changed outside items 1 to 6, with why**
- **The "Drafted by" line** now also names the revision, so the record shows both reads.
- **A new "Pins" bullet in the header** says which source wins for a historical pin, as round 14's addition requires of a form carrying `@`-pins.
- **§2.5's POSIX mount-point sentence** lost its pointer "(§2.10 item A1)", because that table is gone. It now points to the block's containment text.
- **§2.9's tests line** names K-R2, not K-R5, as the Windows-only run-time test, because K-R5 is withdrawn.

---

# B2 piece 1c — Save project (linked) and reopen: the project's identity, the project file, the changed-file notice, the recovery offer after a crash, and the saved-here mark (full form)

- **Path:** `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `b2-piece-1c-save-and-reopen`, its whole summary.
  - The placement: `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:12 @ 6c3795c5` (item 2).
  - The human's rulings:
    - ADR-036 by route (i): `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10 @ 6c3795c5`;
    - this form's OPEN items: `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:14-18 @ 6c3795c5`.
  - The brief's 1c row: `state/directives/B2-BRIEF-2026-10-07.md:142 @ 6c3795c5`.
  - ADR-036's ten rulings: `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:8-49 @ 6c3795c5`. Where `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:38-49 @ 6c3795c5` restates a sentence, the restatement governs over the sentence it restates (its filing note).
  - Round 70: OPEN-2, OPEN-3 and OPEN-7 (`state/directives/2026-10-08-round-70-rulings.md:8-33 @ 6c3795c5`).
  - Round 69: item 1's additions and item 4 (`state/directives/2026-10-08-round-69-rulings.md:13-20 @ 6c3795c5`).
  - Piece 1a's form, Amendment 5, item 8 (the writer's carrying rule, the resolver, and the open item on data with no canonical spelling).
  - Piece 1b's form §2.6 (`kernel/B2-1B-RECORDING-PREREGISTRATION.md` §2.6; there, OPEN-6: `recover` and `locations.json`, whose consumer is this piece).
- **Inputs:**
  - the boundary inventory, above all row 7 (`state/consults/2026-10-16-boundary-inventory-architect.md:21 @ 6c3795c5`);
  - the acceptance consult (`state/consults/2026-10-21-adr-036-acceptance-architect-consult.md`);
  - the two checks (`state/consults/2026-10-12-adr-036-guardrails-two-checks-architect.md`);
  - the reuse findings (`state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md`);
  - ADR-036's pre-acceptance block as drafted for the human's sight (`state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md`): its Parts A and B, its section 2, and its OPEN items A, L, R, W, D, S and O;
  - the `.spatial` check (`state/consults/2026-10-21-spatial-extension-check-custodian.md`).
- **Drafted by** the architect, read only. Drafted at main eaa3d2a9 (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md`); revised at main 6c3795c5 after the human's rulings.
- **Pins.** Every `path:line @ 6c3795c5` is a historical pin. For the code a step edits, the step's base tree is authoritative. For what this form read, the pin is. No pin carries a sha256 yet: the custodian adds each by script, with the full commit id, before this form is committed. A quoted sub-line span carries its line's hash.
- **Committed before any code.** It is append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Code starts only after all of these:**
  - the docs-lane piece `adr-036-pre-acceptance-block` (proposed id) has merged, and the human has typed ADR-036's acceptance (route (i); the placement, item 2);
  - the human has seen and approved the text of this piece's appended ADR-036 amendment (§2.10);
  - O0, the OneDrive probe, has run and is recorded in Amendment 1 (ruling 1; OPEN-6 (A), ruled);
  - Amendment 1 records the block's OPEN rulings and applies, at each `(conditional on the block's OPEN-<x>)` mark, the other option wherever the human ruled it;
  - rule (00) holds at the dispatch of each step (§2.14).
- **Form and gating:** the full form, with full gating from dispatch (AUTONOMY §21a, `AUTONOMY.md:315-332 @ 6c3795c5`; §25(e), `AUTONOMY.md:482 @ 6c3795c5`). The piece touches all four §21a categories:
  - ADR text: this piece's appended amendment to ADR-036, and ADR-022 Amendment 2;
  - the wire: new SKP commands;
  - security posture: a containment boundary, inventory row 7;
  - stated guarantees: atomic save, an open refusal that never outlives a crash, and ADR-006 class 2.
  It is also over §21c's size. No five-line form is possible.

## §0. Disclosure

**0.1 Inputs.** No pilot, spike or corpus has run, and nothing has been measured. The 5 GB fixture is not used. O0 (§3) is a probe owed before any code, and it has not run.

**0.2 The reuse index (the standing step).** These are the custodian's runs of `node tools/reuse.mjs` in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, with the tool at that commit. The lines below are byte-copied from the custodian's brief as given, and the custodian confirms them against the run by script:

```text
$ node tools/reuse.mjs project file save reopen
No prior art recorded for "project file save reopen". Research it before planning an implementation.
$ node tools/reuse.mjs path containment engine open identity
No prior art recorded for "path containment engine open identity". Research it before planning an implementation.
$ node tools/reuse.mjs path-containment engine-open-identity reserved-filename-checks
No prior art recorded for "path-containment engine-open-identity reserved-filename-checks". Research it before planning an implementation.
$ node tools/reuse.mjs containment
capability: path-containment → cap-std [PORT], Go [CONCEPTUAL], Rust std [CONCEPTUAL], fs_at [WATCH], libpathrs [WATCH], filepath-securejoin [REJECT]   (worth-owning, P0)
$ node tools/reuse.mjs identity
capability: engine-open-identity → DuckDB [BENCHMARK]   (open, P0)
capability: stable-identity-copy-move → Godot [CONCEPTUAL], VS Code [CONCEPTUAL]   (worth-owning, P0)
$ node tools/reuse.mjs reserved
capability: reserved-filename-checks → Go [CONCEPTUAL], cap-std [PORT]   (do-not-reinvent, P0)
```

What the form takes from each row (paraphrase):
- **path-containment.** The concepts only: a segment-by-segment walk from the project folder that refuses links, with no `..`. The implementation is Rust std's `symlink_metadata` and `FileType::is_symlink` for each segment, on every platform (OPEN-5 (B), ruled: no held handles). No code is ported and no dependency is added. A cap-std dependency would be a new dependency, and OPEN-20 (A), ruled, takes none.
- **engine-open-identity, open.** No handle is held (OPEN-5 (B)), so the engine's open by path is used as it is. The index's claim of full sharing is not relied on (inventory row 7).
- **stable-identity-copy-move.** Ruling 8 already decides the rule (§2.4). Concepts only.
- **reserved-filename-checks, do-not-reinvent.** OPEN-20 (A), ruled: a list declared at its site, with the concept from Go and nothing ported.
- The three phrase queries missed. The misses are noted and do not block.

**0.3 The interfaces as read, on the consuming side** (the seam rule). All at 6c3795c5:
- **The dataset reference (piece 1a's producer):**
  - `DatasetRef::linked` writes `[machine-recorded]` only (`kernel/src/dataset_ref.rs:205-224 @ 6c3795c5`);
  - `check` returns `RefCheck::Differs{observed, admission}` (`kernel/src/dataset_ref.rs:296-324 @ 6c3795c5`);
  - the canonical form is checked on the text only, and does not yet hold ruling 9's widening (`kernel/src/dataset_ref.rs:544-552 @ 6c3795c5`);
  - the integer members are written as JSON integers (`kernel/src/dataset_ref.rs:358-373 @ 6c3795c5`) and refused above 2^53−1 (`kernel/src/dataset_ref.rs:468-474 @ 6c3795c5`);
  - the snapshot shape is refused (`kernel/src/dataset_ref.rs:484-489 @ 6c3795c5`);
  - the module says that a file reader must refuse duplicate keys (`kernel/src/dataset_ref.rs:19-20 @ 6c3795c5`).
- **The session history (piece 1b):**
  - `recover` is pub, a producer whose consumer is this piece (`kernel/src/session_history.rs:18-19 @ 6c3795c5`, `kernel/src/session_history.rs:773-790 @ 6c3795c5`);
  - the header admits only `purpose` `session-history`, with `lineage` null, and a `project` that is the state `not-yet-saved` or a project URI (`kernel/src/session_history.rs:565-579 @ 6c3795c5`);
  - the header is written with `project` as the state `not-yet-saved` (`kernel/src/session_history.rs:305-316 @ 6c3795c5`);
  - the mark shapes (`kernel/src/session_history.rs:663-669 @ 6c3795c5`);
  - the reader parses through `serde_json::Value`, with a separate duplicate-key scan and no key-order check (`kernel/src/session_history.rs:862-869 @ 6c3795c5`, `kernel/src/session_history.rs:963-992 @ 6c3795c5`);
  - the writer checks a line against the reader's own rules before writing it (`kernel/src/session_history.rs:284-302 @ 6c3795c5`);
  - the lock is std's `try_lock` (`kernel/src/session_history.rs:251-261 @ 6c3795c5`);
  - `end_session` clears only this run's records (`kernel/src/session_history.rs:195-203 @ 6c3795c5`);
  - the store root (`kernel/src/session_history.rs:130-134 @ 6c3795c5`), resolved through the audit log's `data_dir` (`kernel/src/session_history.rs:38 @ 6c3795c5`);
  - the canonical module is already imported (`kernel/src/session_history.rs:28 @ 6c3795c5`).
- **The canonical module (ADR-022 decision 3):**
  - its declared grammar has no whitespace outside strings and no trailing newline (`renderer/src/canonical.rs:22-38 @ 6c3795c5`);
  - `to_canonical_string` is the one serializer (`renderer/src/canonical.rs:138-143 @ 6c3795c5`);
  - `sha256_hex` (`renderer/src/canonical.rs:152-158 @ 6c3795c5`);
  - the string writer, private (`renderer/src/canonical.rs:207-225 @ 6c3795c5`);
  - the number writer, pub (`renderer/src/canonical.rs:232-256 @ 6c3795c5`).
- **The kernel's open:**
  - `SkpHost::open_dataset` registers a cancel key, arms the watcher by path, and opens by path through `open_cancellable` (`kernel/src/skp.rs:1100-1105 @ 6c3795c5`, `kernel/src/skp.rs:1173-1177 @ 6c3795c5`);
  - the engine accepts a `\\?\` prefix (`engine/src/dataset.rs:1651-1658 @ 6c3795c5`) and refuses glob metacharacters (`engine/src/dataset.rs:1678-1684 @ 6c3795c5`).
- **The shell's open path, which a reopen goes through:**
  - `runAdmitPath` takes an `admit(path, cancelKey, options) → AdmissionOutcome` dependency (`frontends/shell/src/admission/AdmissionPanel.tsx:178-185 @ 6c3795c5`, `frontends/shell/src/admission/AdmissionPanel.tsx:198-265 @ 6c3795c5`);
  - the product `admit` is `admitDataset`: `open_dataset`, then `describe` (`frontends/shell/src/admission/admitDataset.ts:39-66 @ 6c3795c5`);
  - the liveness line and Cancel (`frontends/shell/src/admission/AdmissionPanel.tsx:349-392 @ 6c3795c5`);
  - the picker binding (`frontends/shell/src-tauri/src/commands.rs:233-246 @ 6c3795c5`);
  - the shape of the `record_step` binding (`frontends/shell/src-tauri/src/commands.rs:137-150 @ 6c3795c5`).
- **The workspace the shell holds:**
  - `ViewState` has `filter`, `style`, `clauses`, `selection` and more (`frontends/shell/src/workspace/workspaceState.ts:68-86 @ 6c3795c5`);
  - `FilterClause` is `{id, text, enabled}` (`frontends/shell/src/workspace/filterClauses.ts:21-26 @ 6c3795c5`);
  - the camera's frame and centre (`frontends/shell/src/canvas/extent.ts:94-104 @ 6c3795c5`).
- **ADR-022:**
  - decision 3 (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:44-45 @ 6c3795c5`);
  - Amendment 1 does not grant persistence in a project file (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:78 @ 6c3795c5`);
  - consequence (b) (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:55-62 @ 6c3795c5`).
- Every pin is historical. At each step's base, the custodian sweeps them again. A moved cite is class 3. A changed interface is I1.

**0.4 Hypotheses**, each with its discriminator:
- **H1.** On the machine where O0 runs, an online-only OneDrive file is a reparse point whose tag is not a name surrogate. Std reports it as not a symlink, and opening it by path triggers the operating system's download. A junction is a name surrogate, and std reports it as a link. Discriminators: O0, and K-R2.
- **H2 and H3: withdrawn** (OPEN-5 (B), ruled). They discriminated the held handles of OPEN-5 (A), and no handle is held.
- **H4.** The engine reads a project-relative target given in the `\\?\` form. Discriminator: K-O1. If H4 fails, the plain form is used, and ruling 9's widened text check makes Win32 name rewriting a no-op on canonical text.
- **H5.** While an online-only file downloads, the shell's existing liveness line and Cancel stay live. A Cancel ends the open at the engine's next check after the blocking read returns. Discriminators: O0 and row OP3.
- **H6.** `std::fs::rename` replaces `project.spatial` atomically on NTFS. A sharing violation (from an indexer, antivirus or the sync client) is retried up to the declared bound and then refused by name. Discriminators: K-S6 and K-S7.
- **H7.** `File::try_lock` on a machine-side lock file is freed by the operating system when its process ends abnormally, the same mechanism piece 1b proved for the history. Discriminator: K-O5.

## §1. What this preregistration may and may not claim

**May claim:**
- Save project (linked): the project's identity is minted at the first save, and `project.spatial` is written atomically in the line-oriented layout;
- the writer's carrying rule, as ruled;
- the saved-here mark;
- reopen, with the strict reader, the containment check at open, the copy-or-same question, the second-open refusal, the changed-file notice and re-link;
- the recovery offer;
- each of these only as §4 tests it.

**May not claim:**
- any lineage file written (OPEN-8 (A), ruled; the brief, `state/directives/B2-BRIEF-2026-10-07.md:158 @ 6c3795c5`);
- compaction, restore to an earlier step, undo or replay (pieces 2 and 4; ADR-036 §7). "Undoable" is never said of a save;
- a snapshot (stage 3);
- file association or single instance (a later piece, the human's typed word, ruling 2);
- more than one dataset per project;
- a saved click selection (round 69, item 4);
- that the data the engine reads is the data the check passed. Containment is checked when the project opens its data, on every platform. A link, rename or replacement that another program makes between that check and any later read is not prevented (OPEN-5 (B), ruled, the race declared);
- survival of a power loss (the kernel asks for a flush);
- any performance number, docs/08 row or duration;
- that a save is cancellable. It is one bounded write, one flush and one rename, with no declared figure for its time;
- any persisted feature id.

**ADRs.**
- **Cited:** ADR-005, ADR-006, ADR-010 rule 6, ADR-016, ADR-017 §5a and §6, ADR-018, ADR-022 (decision 3, §2.3a) and ADR-036.
- **ADR-036.** Its pre-acceptance text is the block piece's (route (i)), not this piece's. After acceptance, this piece appends one amendment (§2.10), and the human approves its text before step 1's PR.
- **ADR-022.** Amendment 2, in the human's words (§2.10).
- **The renderer.** `renderer/src/canonical.rs` gains one function (§2.3a). Nothing else under `renderer/` changes.

**Strings.** Every string the app shows is the human's at P6. §2.12 gives placeholders.

## §2. The change

### 2.1 Names against ADR-006 (operation-class correctness)

- **Save project** persists the workspace into the project's own store (docs/02, Projects). It is the commit of ADR-006 class 2, made transactional by the atomic rename (§2.3).
  - It is not a step and not an export. The history records it with a `saved-here` mark (ADR-036 §6, mark lines, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:128 @ 6c3795c5`).
  - No approval gate applies, because nothing leaves the workspace's own store. A gate that reads the project folder as an external destination may block here; the reason above is what it judges.
- **Reopen** loads the saved workspace. It is not a restore.
- **Accepting a recovery offer** restores workspace state to the last kept step of a crashed history. That is ADR-036 §7's restore of workspace state, never a replay (OPEN-13 (A), ruled).
- **Declining** clears a machine-side record, as ruled (round 70, OPEN-3).
- **The copy answer** writes a new identity into the newly opened folder's project file. That is a save.

### 2.2 Protocol (SKP; OPEN-3 (A), ruled: one version per step)

- **`save_project`** (step 1).
  - Request: `{skp, dataset, folder: string|null, workspace}`. `folder` is present only at the first save, from the native folder-picker binding. `workspace` has the shape §2.10's item W names.
  - Response: `{project, history_mark: "written"|"withheld"}`. The shell's notice reads `history_mark` (OPEN-9 (A), ruled).
- **`open_project`** (step 2).
  - Request: `{skp, folder, cancel_key, answer: null|"copy"|"same", relink: null|string}`.
  - Response, one of:
    - `opened {project, dataset, session, workspace, check: {observed:[…], admission:[…]}, lineage: <named fact>}`;
    - `question {kind:"copy-or-same"}`;
    - `not_found {file_name}`.
  - The kernel stays stateless across the two phases: the shell calls again with `answer` or `relink`.
- **`list_recoverable`, `recover_session` and `discard_recoverable`** (step 3).
- **New codes,** all `skp.*`, each stating a kernel fact only:
  - `project_folder_holds_project`
  - `project_file_unwritable`
  - `project_file_refused` (the member's path and the rule)
  - `project_open_elsewhere`
  - `project_target_through_link`
  - `project_target_outside_folder`
  - `project_target_unresolvable`
  - `project_lineage_not_kept_by_this_version`
  - `recoverable_record_locked`
- **Not changed:**
  - the shapes of the six existing commands, apart from the version literal;
  - the data plane.

### 2.3 Kernel: the project (new `kernel/src/project/`: `mod.rs`, `file.rs`, `strict_json.rs`, `resolver.rs`, `store.rs`)

- **Identity.** `spatial://project/` and 32 lowercase hex characters from `getrandom`, minted at the first save. A later save keeps it.
- **Writer.**
  - The top-level members are a closed set, in a fixed order: `format`, `version`, `project`, `datasets` (one entry, §5), `lineage`, `workspace`.
  - The `workspace` member's shape is item W of §2.10. (conditional on the block's OPEN-W) Under (b), the block defines it and the writer follows the block's shape.
  - The layout is ADR-036 §2's line-oriented layout, written by `renderer/src/canonical.rs`'s new function (§2.3a). (conditional on the block's OPEN-L) That means a two-space indent and `: ` after a key. Under (b), `:` is followed by no space; under (c), the indent is a tab. Only the function's two declared constants change.
  - Before the write, the writer checks the bytes it is about to write against the reader's own rules, as 1b's writer does (`kernel/src/session_history.rs:284-302 @ 6c3795c5`).
- **The observation's integers** (OPEN-14 (A), ruled). Binding a reference to a file whose `byte_size` or `footer_length` is over 2^53 − 1 is refused by name, so the writer can never write a value the reader refuses (`kernel/src/dataset_ref.rs:358-373 @ 6c3795c5` writes without a check today). (conditional on the block's OPEN-A) The ADR text for this is the block's B4 under (c), and goes to this piece's appended amendment under (a) or (b). The code is this piece's either way.
- **Atomic save** (ruling 10).
  - The steps: write `project.spatial.tmp-<16 hex>` in the folder, `write_all`, `sync_all`, then `rename` over `project.spatial`. A sharing violation is retried up to `MAX_SAVE_RENAME_ATTEMPTS` and then refused by name. On POSIX, the folder is fsynced.
  - A temp file left by a crash belongs to no format (ADR-036 §1, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:27 @ 6c3795c5`). The next successful save removes files named by exactly that pattern, and nothing else.
- **A first save into a folder that already holds `project.spatial`** is refused by name (OPEN-16 (A), ruled).
- **Carrying rule** (ruling 1; round 70, OPEN-7; 1a Amendment 5, item 8; OPEN-4 (A), ruled):
  - a `machine-recorded` locator always;
  - a `project-relative` locator where the resolver's judgment at save (§2.5) finds that the data is inside the folder, is reached without a link, and has a canonical spelling;
  - never an absolute path;
  - data inside the folder with no canonical spelling on this machine is carried `machine-recorded` only. The owner's statement (S18) says the project will not find that file on another machine, and the save is not refused (OPEN-4 (A), the human's words in the OPEN section).
- **The machine store** (`<data dir>/spatial-ide/projects/<32 hex>/`, through the existing `data_dir`). Its files:
  - `locations.json`: persistent, in the same format as ADR-036 §9's;
  - `folders.json`: the folders known for this identity, and their answers;
  - `open.lock` (step 2).
  None of them is ever in the project folder, and none is cleared in B2 (§2.10, item M).
- **Saved-here mark** (step 1).
  - At each save, one `{"mark":{"kind":"saved-here","after":<last step id>,"at":…}}` line is written through 1b's append path, with a write and a flush.
  - There is no mark when the history holds no step yet.
  - Under OPEN-9 (A), ruled, there is no mark when the sent workspace differs from what the history's steps reach.
- **First save and the session record** (OPEN-18 (A), ruled):
  1. the record's kept lines are copied under a new header whose `project` is the URI, into `sessions/<project hex>/history.jsonl`, written to a temp file, synced, renamed and locked;
  2. then the `unsaved-` record is removed.
  Recovery (step 3) skips an `unsaved-` record whose first step id appears under a project record.
- **Lineage member** (OPEN-8 (A), ruled).
  - 1c writes the named state that means no lineage is kept, with the word the block gives (`not-kept` in its draft, block A5).
  - The reader accepts the full shape of ruling 4.
  - The writer refuses by name (`project_lineage_not_kept_by_this_version`) to save over a project whose member records a kept lineage. It never breaks that lineage silently.
- **Strict reader** (`strict_json.rs`; ruling 7 and the 2026-10-09 note):
  - a tokenizer over bytes, with bounds checked before any allocation;
  - it refuses a duplicate key, and a member out of the order the schema declares;
  - layout and spelling: the file's parsed value is rendered again with the writer's function (§2.3a): `to_line_oriented_string` for the project file, `to_canonical_string` for each line of a steps file. A file whose bytes differ from that rendering is refused, naming the line, so the reader and the writer cannot drift;
  - so a number is accepted only when its token is its canonical spelling under `spatial_renderer::canonical`'s grammar, byte for byte. The token is parsed with std's correctly rounded `f64` parse, and `float_roundtrip` is not enabled;
  - under OPEN-19 (A), ruled, it replaces `serde_json::from_str` in 1b's `read_line` as well.

### 2.3a ADR-022 decision 3: where the line-oriented layout is written (the block draft's note for this gate, `state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:253 @ 6c3795c5`)

- Decision 3 (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:44-45 @ 6c3795c5`) allows canonicalizing and hashing only in `renderer/src/canonical.rs`. The project file carries the §5a style document inside its `workspace` member, in the line-oriented layout.
- **The layout is a canonicalization.** It fixes the one byte form of a document that holds the style document. Ruling 2 makes the line-oriented form the file's one canonical byte form (`state/directives/2026-10-09-adr-036-ten-findings-rulings.md:10 @ 6c3795c5`). The writer must emit that form, and the reader must refuse any other.
  - Whitespace is part of that byte form. So the layout is a second canonical form beside the compact one, which writes no whitespace and no trailing newline (`renderer/src/canonical.rs:22-23 @ 6c3795c5`).
  - To argue that it is not a canonicalization, one would have to read the word as meaning only the compact form, and ruling 2 does not allow that reading.
- **So it is written in `renderer/src/canonical.rs`:**
  - one new `pub fn to_line_oriented_string(v: &Json) -> Result<String, CanonicalError>`, over the same `Json` value. It uses the module's own string and number writers, so the two forms differ in layout only;
  - one module-doc paragraph that names the layout and ADR-036 §2 as where it is defined;
  - `to_canonical_string`, `canonical_and_hash`, `write_double` and every existing test in the module stay byte-identical.
  - The function's product caller is the project writer in `kernel/src/project/file.rs`, in the same PR (the caller rule). Amendment 1 already has the kernel writing style values through this module (`kernel/src/session_history.rs:28 @ 6c3795c5`).
- **The reader is not a canonicalization.** It produces no bytes. It checks a file against the function's output (§2.3), and its number rule is the module's own grammar (ruling 7).
- **No hash is taken outside the module.** Under OPEN-8 (A) no lineage is written, so 1c takes no lineage sha256. Any later hash goes through `sha256_hex` (`renderer/src/canonical.rs:152-158 @ 6c3795c5`).
- The shell still holds and displays the document, and canonicalizes nothing.

### 2.4 Kernel: reopen (step 2)

1. **Read** `project.spatial` with the strict reader, under `MAX_PROJECT_FILE_BYTES`.
2. **Identity and folder** (ruling 8, `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:22 @ 6c3795c5`, with its restatement at `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:38-40 @ 6c3795c5` governing):
   - this folder is known for the identity → open;
   - the remembered first folder still holds a project with this identity → `question`;
   - the first folder is gone, or holds another project or none → a move: the folder memory is updated and nothing is asked;
   - the first folder cannot be reached → `question`.
   - The answer `copy` mints a new identity into this folder and gives it its own data links. The answer `same` is remembered for this folder.
3. **Second open** (ruling 2; OPEN-7 (A), ruled).
   - `try_lock` on `projects/<hex>/open.lock` happens after step 2, so a copy never collides.
   - A held lock refuses with `project_open_elsewhere`.
   - The lock is held until the project's dataset closes (B2 has one dataset per project), and the operating system frees it at a crash (H7).
4. **Data.**
   - A `project-relative` locator goes through the resolver's check at open (§2.5), and the engine is given the path it returns.
   - Otherwise the machine store's location is used. If it is absent or missing → `not_found`, and the shell offers re-link.
   - A re-linked file is opened and checked against `observed` (round 70, OPEN-7).
   - The open is `SkpHost::open_dataset` with the recorded claims and the request's `cancel_key`. The host mints attribution there (ADR-036 §5, `admission`).
5. **Check.** `DatasetRef::check` gives the response's `check`, as facts. The shell states the consequence.
6. **Lineage.** The member is read, and the lineage file is detected under ruling 4, by the rule of §2.10's item D. (conditional on the block's OPEN-D) Under (b), the block's rule applies, and the previous lineage is found in the folder under the name the block gives. Under OPEN-8 (A), ruled, a lineage file beside a member that records none is named in `lineage` and is not read.

### 2.5 Kernel: the resolver (inventory row 7; `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:82 @ 6c3795c5`; ruling 1; OPEN-5 (B), ruled)

- **At save, `judge`:**
  1. canonicalize the open's path to P and the folder to F;
  2. if P is not under F, the data is outside: `machine-recorded` only;
  3. otherwise, apply the canonical-form text check to the relative segments (ruling 9's widening). A failure means `machine-recorded` only, with the owner's statement, and the save goes on (OPEN-4 (A), ruled);
  4. walk the segments from F, as at reopen below. A link means `machine-recorded` only.
- **At reopen, `check_inside(F, at)`**, the same on every platform:
  - the text check first (ruling 9);
  - then, for each segment in turn, `std::fs::symlink_metadata` of F joined with the segments so far, which reads the type without following the last component:
    - a link (`FileType::is_symlink`; on Windows, a name-surrogate reparse point, H1) is refused with `project_target_through_link`;
    - a missing segment with `project_target_unresolvable`;
    - an intermediate that is not a directory, or a final that is not a regular file, by name;
  - a cloud placeholder is not a name surrogate, so it opens (H1);
  - no handle is opened for the check, and none is held after it (OPEN-5 (B));
  - the engine path is F and the segments as checked, in the `\\?\` form (H4).
- **The window, declared** (OPEN-5 (B), the race declared).
  - The check reads each segment by path. The engine then opens the target by path, and reads it by path again for as long as the dataset is open (inventory row 7, `state/consults/2026-10-16-boundary-inventory-architect.md:21 @ 6c3795c5`).
  - A link, a rename or a replacement that another program makes after a segment is checked is not prevented on any platform. That covers changes between segments, between the check and the open, and during any later read.
  - Content changes are for the observation and the watcher to detect, not for containment. K-2 (§2.12) states the window.
- **Every platform runs the same check.** For containment, none is reduced against another.
- **Device names, and a trailing dot or space,** are refused twice: by the text rule, and because the final object must be a regular file. (conditional on the block's OPEN-R) The device-name list is the block's A4 list. Under (b) it is the shorter list: CON, PRN, AUX, NUL, COM1 to COM9 and LPT1 to LPT9.
- **POSIX mount points** below the folder are not links, and they are not refused. The block's containment text names links and junctions only (`state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:195 @ 6c3795c5`), which this matches.

### 2.6 Kernel: the recovery offer (step 3; `recover`'s consumer)

- **The list.** `list_recoverable` lists the `unsaved-` records at app start, and the record of the project being opened at its open.
  - A record is listed only if `try_lock` succeeds, so a live run's record is never offered.
  - Each entry is the dataset's file name from the record's `locations.json`, the time of the last kept step, and the data's state under `check`: unchanged, changed (with the components named) or not found (round 70, OPEN-3).
- **`recover_session`** (OPEN-13 (A), ruled):
  - it takes the record's lock;
  - it truncates the history to the length of the kept prefix and syncs it;
  - it continues that record for this run;
  - it returns the last value of each key (the filter, and the four style properties). The shell applies them.
- **`discard_recoverable`** removes the record.

### 2.7 The shell's binding (`frontends/shell/src-tauri/src/commands.rs`, `lib.rs`)

- The SKP commands each run on `spawn_blocking`: decode, call, serialize.
- `binding_pick_project_folder` is the native folder dialog, not SKP.
- The project session (its `open.lock`) is held in the binding's state and dropped at `close_dataset` of its dataset.

### 2.8 The shell (`frontends/shell/src/`)

- **Save project** is available from the command bar and from a control (P6). The first save opens the folder picker.
- When a click selection exists, Save shows the selection notice (round 69, item 4).
- The owner's notices state the consequences: saved; not saved, with the kernel's message; the history mark withheld; inside data carried for this machine only (OPEN-4 (A)).
- **Open project** goes through `runAdmitPath`, with an `admit` that calls `open_project` and then `describe`. So the liveness line, Cancel and the refusal UI are the existing ones.
  - `question` → the copy-or-same question (the human's words at P6);
  - `not_found` → a re-link pick;
  - `opened` → the workspace (filter and clauses, style, view) is applied through the existing reducer transitions, and the changed-file notice names each component.
- **Recovery offer:** at start, a list from `list_recoverable`; at a project's open, its own offer.
- **Console:** one class-A row per new command.

### 2.9 Portability (R3)

- **Boundary:** the application directories (`data_dir`, reused) and the new resolver (`kernel/src/project/resolver.rs`). There is no `cfg`: the resolver uses std's `symlink_metadata` on every platform (OPEN-5 (B)).
- **Windows:** supported. Containment is checked at open.
- **Linux:** L1, with the same check. KNOWN-LIMITATIONS K-2 covers every platform.
- **macOS:** as for Linux, with the store under `~/.local/share`, as the audit log has it.
- **Tests:** K-R2 is Windows-only by a run-time check of the operating system, not a `cfg`, and it reports which operating system it ran on (1b's precedent in its correction round 2). The other link tests use a junction on Windows and a symlink on Linux. The e2e tests run on Windows.

### 2.10 ADR text: what this piece appends, and where (route (i), ruled)

**ADR-036's pre-acceptance text is not this piece's.** The docs-lane block piece applies it before acceptance (route (i), `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10 @ 6c3795c5`):
- Part A: the name, the members line, the line-oriented layout, line 71's correction and ruling 9's reader, ruling 4's lineage members, the Status line and line 192, and milestone 4's OPEN-4 (A′);
- Part B, as its OPEN-A rules.
The draft's step 0 is superseded.

**After the human types the acceptance, this piece appends one amendment to ADR-036.** The source is the block draft's section 2 (`state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:254-259 @ 6c3795c5`). Its words are drafted for the human's sight at step 1's dispatch, and approved before step 1's PR opens. What each item must say (my paraphrase):
- **W. The `workspace` member's shape.**
  - `filter`, as applied;
  - `clauses`, `{text, enabled}` in order (OPEN-10 (B), ruled);
  - `style`, the §5a document as the renderer admits it (OPEN-12 (A), ruled);
  - `view`, a centre and a scale in the dataset's space, named in `dependencies.crs`'s form (OPEN-11 (A), ruled; R9);
  - the analysis settings, reserved by name.
  - A click selection is not saved (round 69, item 4).
  - The block's A6 keeps this inside version 1.
  - (conditional on the block's OPEN-W) Under (b), the block defines the member and this item drops.
- **D. How a reader tells which save a project file and a lineage file come from, and what it shows then** (ruling 4's note, `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:35 @ 6c3795c5`):
  - the lineage is cut back by the step count when its prefix matches;
  - the previous lineage is used when that matches. It is kept in the machine store, so that §1's "nothing else" holds in version 1;
  - otherwise both files are named as from different saves and never read silently.
  - (conditional on the block's OPEN-D) Under (b), the block states the rule, §1 names the previous-lineage file in the folder, and this item drops.
- **M. The machine store** for a saved project: `projects/<hex>/`, with `locations.json`, `folders.json` and `open.lock`. The folder memory also holds absolute paths, so it widens the "only file" sentence at `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:182 @ 6c3795c5`.
- **H. The locators a lineage header carries** (1a Amendment 5's note): the project file's. A session-history header carries `machine-recorded` only.
- **S. A session history's record after the first save** (OPEN-18 (A), ruled): `<project hex>`, and the header's `project` URI, which the header shape already admits (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:101 @ 6c3795c5`).
- **C. The reader ceilings by number** (N-9's first item, `state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md:153 @ 6c3795c5`, which the acceptance consult assigns to 1c, `state/consults/2026-10-21-adr-036-acceptance-architect-consult.md:51 @ 6c3795c5`): the existing 8 locators and 4,096 bytes per string, and §7's new ceilings.
- **(conditional on the block's OPEN-A)** Under (c), nothing more. Under (b), B4 and B5 come here. Under (a), B1, B2, B4 and B5 come here. In that case, until this amendment merges, the accepted text binds a containment guarantee that OPEN-5 (B) does not give (the block draft's Correctness note, `state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:179 @ 6c3795c5`), and no 1c code lands before it.

None of W, D, M, H, S or C changes the shape of a project file or a steps file beyond what the block's A6 reserves. So none of them is a `version` step (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:42 @ 6c3795c5`).

**ADR-022 Amendment 2: the human's words** (OPEN-2 (A), ruled). This is a sub-line span of `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:15 @ 6c3795c5`, which carries that line's hash. It is reproduced because the worker applies it byte for byte. It was byte-copied from my Read, not by script; the custodian confirms it and replaces it by script.

> Amendment 2 (b2-piece-1c-save-and-reopen): from piece 1c, the §5a style document is persisted in the project file, in the workspace member ADR-036 defines. The save is ADR-006 class 2 and atomic. docs/11's obligations are met by the project URI, ADR-036 for the schema, save and reopen for the lifecycle, and the step record for provenance. Consequence (a) stands, and the lineage is not granted by this amendment.

- **Where it lands:**
  - at the end of `docs/adr/ADR-022-style-v0-as-the-single-style-model.md`, after Amendment 1 (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:73-78 @ 6c3795c5`);
  - in step 1's PR, in the same commit as this piece's appended ADR-036 amendment;
  - that commit is the PR's first, before any code that writes a style into a project file (consequence (b), `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:59-62 @ 6c3795c5`).
  - The two land together because the human's words name the workspace member that ADR-036 defines.
- The form of its heading is the human's or the custodian's to set.

**Live text that says ADR-036 is Proposed** (the block draft's section 2, `state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:272-280 @ 6c3795c5`). Step 1 brings current these lines in the files it edits:
- `kernel/src/dataset_ref.rs:4 @ 6c3795c5`
- `kernel/src/lib.rs:18 @ 6c3795c5`
- `kernel/src/session_history.rs:5 @ 6c3795c5`
- `kernel/README.md:274 @ 6c3795c5`
- `kernel/README.md:375 @ 6c3795c5`
- `kernel/tests/no_generation_in_persisted_artifacts.rs:42 @ 6c3795c5`
- `protocol/skp/src/v0/commands.rs:513 @ 6c3795c5`
- `protocol/skp/SKP-V0.md:223 @ 6c3795c5`
- `protocol/skp/SKP-V0.md:1239 @ 6c3795c5`

The shell's two lines, `frontends/shell/src/workspace/viewTransitions.ts:6 @ 6c3795c5` and `frontends/shell/src/style/StylePanel.tsx:55 @ 6c3795c5`, go to a docs-lane piece unless a step edits that file.

### 2.11 Steps, files, budgets and the counting command

**The counting command** for every step, at head H with base B named in the PR body:

`git diff --numstat B...H -- . ':!kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.md' ':!CUSTODIAN-QUEUE.json' ':!site' ':!docs/README.md' ':!Cargo.lock' ':!frontends/shell/src-tauri/Cargo.lock' ':!frontends/shell/package-lock.json'`

An overrun is class 8, and §7 is never edited.

**Step 1, Save project:**

| Group | Ceiling |
|---|---|
| ADR text (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, `docs/adr/ADR-022-style-v0-as-the-single-style-model.md`) | 80 (conditional on the block's OPEN-A: 140 under (a), 100 under (b)) |
| renderer (`renderer/src/canonical.rs`: the layout function, its module-doc paragraph, its new tests) | 200 |
| protocol product (`protocol/skp/src/v0/{commands,mod,error}.rs`, `SKP-V0.md`) | 320 |
| fixtures and protocol tests | 260 |
| version literal (≤ 30 files) | 130 |
| kernel product (`kernel/src/project/*` new, `dataset_ref.rs`, `session_history.rs`, `lib.rs`) | 1,350 |
| kernel tests (`kernel/tests/project_save.rs` new, `project_save_crash.rs` new, `no_generation_in_persisted_artifacts.rs`) | 1,000 |
| src-tauri | 100 |
| shell product (`skp/{types,client}.ts`, `project/saveProject.ts` new, `App.tsx`, `console/surfaceRegistry.ts`) | 380 |
| shell tests | 380 |
| e2e (`e2e/project.mjs` new, `package.json`, `e2e/README.md`) | 320 |
| records (`kernel/README.md`, one KNOWN-LIMITATIONS item, one walkthrough Part) | 120 |
| **Total** | **≤ 4,640, ≤ 75 files** (conditional on the block's OPEN-A: ≤ 4,700 under (a), ≤ 4,660 under (b)) |

**Step 2, Reopen:**

| Group | Ceiling |
|---|---|
| protocol | 320 |
| fixtures | 260 |
| literal | 130 |
| kernel product (`project/{resolver,store,mod}.rs`, `dataset_ref.rs`) | 1,400 |
| kernel tests (`project_reopen.rs`, `project_resolver.rs`, `project_lock_crash.rs`) | 1,300 |
| src-tauri | 100 |
| shell product (`project/openProject.ts` new, `admission/AdmissionPanel.tsx`, `App.tsx`, the question and re-link UI, `workspace/viewTransitions.ts` read only unless I1) | 520 |
| shell tests | 450 |
| e2e | 450 |
| records | 140 |
| **Total** | **≤ 5,170, ≤ 75 files** |

**Step 3, Recovery:**

| Group | Ceiling |
|---|---|
| protocol | 260 |
| fixtures | 200 |
| literal | 130 |
| kernel product (`session_history.rs`, `project/mod.rs`) | 600 |
| kernel tests (`recovery.rs`, `recovery_crash.rs`) | 600 |
| src-tauri | 80 |
| shell product (`project/RecoveryOffer.tsx` new, `App.tsx`) | 350 |
| shell tests | 350 |
| e2e | 300 |
| records | 100 |
| **Total** | **≤ 2,970, ≤ 60 files** |

### 2.12 Strings the app shows: P6 placeholders (none is the human's; each states only what §2 does)

- **Kernel messages,** each stating a fact: one per code in §2.2. Each names the member path, the segment or the folder as the code requires, and never a consequence.
- **Owner (shell) placeholders:**
  - S1: Save project's control label.
  - S2: the folder picker's title.
  - S3: the saved notice.
  - S4: the not-saved notice, with `{message}`.
  - S5: the history mark withheld (OPEN-9 (A)).
  - S6: the selection notice at save (round 69, item 4).
  - S7: the folder already holds a project.
  - S8: the copy-or-same question (the human's words, round 70, OPEN-2).
  - S9: the already-open refusal.
  - S10: the changed-file notice, with `{components}`.
  - S11: not found, with the re-link prompt.
  - S12: re-link differences, with `{components}`.
  - S13: the recovery offer, with `{dataset}` and `{time}`, and its two choices.
  - S14 and S15: the data changed, or not found, in the offer.
  - S16: a lineage from a different save.
  - S17: a lineage this version cannot keep.
  - S18: inside data with no canonical spelling on this machine: the project will not find that file on another machine (OPEN-4 (A), ruled).
- **KNOWN-LIMITATIONS items** (placeholders):
  - K-1: withdrawn (OPEN-5 (B): no handle is held, so nothing stops a rename);
  - K-2: containment is checked when the project opens its data, on every platform; a link, rename or replacement that another program makes after the check is not prevented;
  - K-3: a Cancel during an online-only download takes effect when the current read returns (H5);
  - K-4: the machine store is never pruned.

### 2.13 What waits on what

| Step or work | Waits on |
|---|---|
| ADR-036's pre-acceptance text | the block piece (docs lane) and its OPEN items A, L, R, W, D, S and O; then the human's typed acceptance |
| this piece's appended ADR-036 amendment and ADR-022 Amendment 2 | the acceptance, and the human's sight of the appended amendment's text; both land in step 1's PR as its first commit |
| step 1 | the row above, and O0 |
| the step 2 resolver | O0 (H1) |
| step 3 | step 2 merged (OPEN-3 (A)) |

Every OPEN item of this form is ruled. Amendment 1 records only O0 and the block's options.

### 2.14 Overlap (rule (00), `AUTONOMY.md:609 @ 6c3795c5`)

Separate KNOWN-LIMITATIONS items, walkthrough Parts and e2e README entries count as separate paths (`state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md:14 @ 6c3795c5`). This piece's paths are §2.11's groups, per step, plus this form.
- Every step touches `protocol/`.
- No step touches `scripts/plan/`, `AUTONOMY.md`, `state/cut-archive/`, `state/drafts/`, `site/` or `CUSTODIAN-QUEUE.*`.
- PLAN.yaml is the custodian's, on main.

**Governance D (PR #237, at S10, go).** Its paths are listed at `scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:451-455 @ 6c3795c5`:
- the rotation script and its test;
- `scripts/plan/verify-quotes.mjs` and its test (conditional);
- `scripts/plan/README.md` and `AUTONOMY.md`;
- at S10: PLAN.yaml, `CUSTODIAN-QUEUE.*`, `site/`, `state/cut-archive/` and `state/drafts/`.

How it meets this piece:
- They are disjoint from every step's paths.
- The one contact is PLAN.yaml, through the custodian's rows for this node: its `gate`, status and budget.
- Under D's OPEN-5 (B) (D's Amendment 1, item 5, `scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md:502 @ 6c3795c5`), every commit touching PLAN.yaml, `CUSTODIAN-QUEUE.*` or `site/` is held from D's S9 to its click. So this node's rows wait for the click.
- This form's own commit touches none of them. The custodian commits it after D's merge, as briefed.
- D's S10 moves summaries of done nodes only, so it does not touch this node, which is not done.

**PR #239 (`walkthrough-current-view-rows-g1-n5`, docs lane).** Its paths are listed at `frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md:153-158 @ 6c3795c5`:
- `frontends/shell/MANUAL-WALKTHROUGH.md`, Part G row G1 and Part N row N5, with N5's other stale cites (the docs lane's OPEN-1, `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:22 @ 6c3795c5`);
- its form, PLAN.yaml and the generated files.

How it meets this piece:
- Disjoint. Each step adds a new walkthrough Part at the next free letter and edits no row of Part G or Part N.
- The letter is read at each step's base. Milestone 4 also adds a Part, so whichever merges first takes the next letter.

**The redaction scan** (`bundle-redaction-scan-not-in-product-publish`, slot 1; its form is not committed at 6c3795c5). Its paths are its revised form's §7 and §9 (`state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-revised-form-cites.md:295-323 @ 6c3795c5`, `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-revised-form-cites.md:379-392 @ 6c3795c5`). Against each of them:
- **`kernel/README.md`** is shared, as the same file. Each 1c step that edits it is dispatched after the redaction PR merges.
- **`KNOWN-LIMITATIONS.md`** holds separate items, so it is disjoint. The redaction's W6 takes the next free number, and 1c's items follow it.
- **`kernel/src/permission/`**: 1c only reads `data_dir`, through `kernel/src/session_history.rs:38 @ 6c3795c5`. The redaction edits `permission/boundary.rs` and `audit/reader.rs`, which 1c does not touch.
- **`engine/src/fixture.rs`**: 1c uses `write_geoparquet` (F1) and edits nothing there.
- **src-tauri**: 1c edits `commands.rs` and `lib.rs`; the redaction edits `publish.rs`'s `mod tests` only.
- **The rest of its paths** (`kernel/src/bundle/redaction.rs`, `kernel/src/publish/`, `kernel/tests/typed_terminal_codes.rs`, `kernel/tests/permission_boundary.rs`, `engine/README.md`): 1c touches none of them.
- **`protocol/`**: the redaction touches none.

**ADR-036's pre-acceptance block** (docs lane, proposed node `adr-036-pre-acceptance-block`). Its files are listed at `state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:329 @ 6c3795c5`: ADR-036 by hand, the generated `docs/README.md`, its form and PLAN.yaml.
- **ADR-036 is shared with step 1.** They run in sequence by dependency: the block, then the acceptance, then step 1. No 1c step edits ADR-036 before the acceptance.
- **`docs/README.md`**: 1c changes no Status line, so it regenerates nothing.
- **ADR-022**: the block does not touch it.
- **The lane's order** (conditional on the block's OPEN-O). The docs lane runs one piece at a time (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:18 @ 6c3795c5`). #239 has started (its PR is open), so the block follows it. Under OPEN-O (a), the block would have gone first only if #239 had not started. Either way, 1c's code waits for the block and then for the acceptance.

**Milestone 4 (`b1-shell-half`), its form drafted and ruled, not committed.** Its paths are its draft's §2.6 (`state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:328-350 @ 6c3795c5`), with its OPEN-5 (c), OPEN-11 and OPEN-13 (a) ruled (`state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:20 @ 6c3795c5`). Against steps 1 to 3:
- **Shared:**
  - `App.tsx`, `console/surfaceRegistry.ts`, `skp/client.ts` (its PR A) and `package.json` script lines;
  - the workspace seams `workspace/workspaceState.ts` and `workspace/viewTransitions.ts`, which 1c reads and edits only under I1;
  - `style/document.ts`'s `StyleState`, which its PR B widens with `fillMatch` and which step 1 serializes.
- **Separate paths:** walkthrough Parts, KNOWN-LIMITATIONS items and e2e README entries.
- **The renderer:** milestone 4 edits `renderer/style-ts/src/style.ts`, `renderer/tests/data/style-agreement.json` and its Rust reader. Step 1 edits only `renderer/src/canonical.rs`, so they are disjoint.
- **`kernel/tests/manual_walkthrough_fixtures.rs`** (milestone 4) is untouched by 1c.
- **The order:**
  - Milestone 4 is in slot 1 after the redaction piece, and its PRs run A, then C, then B.
  - Where shell paths meet, milestone 4 goes first. So steps 1 to 3 dispatch only when no milestone 4 PR is in progress or awaiting merge.
  - Each step's `workspace` member and recovery are written against the `StyleState`, `ViewState` and `style.set` value shape on main at its base (the seam rule; otherwise I1).
- **The recording piece** (milestone 4's OPEN-4 (A′), carried by the block). A data-lane piece, not yet placed, widens `style.set` after the block merges (`state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:264-270 @ 6c3795c5`). Its paths are `protocol/skp/SKP-V0.md`, `protocol/skp/src/v0/commands.rs` and `kernel/src/session_history.rs`.
  - It shares `protocol/` and `kernel/src/session_history.rs` with steps 1 and 3, so it never runs beside a 1c step.
  - This form does not carry it. If it is instead placed as the first commit of step 1 (milestone 4's option text, `state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:631 @ 6c3795c5`), that is a scope addition, recorded as class 9 by amendment before its code.

**`protocol/`:** at most one piece at a time. Steps 1 to 3 each touch it, so no other piece may touch it when they dispatch. The redaction scan, the block, #239, D and milestone 4 touch none of it.

## §3. Fixtures, with outcomes declared in advance

| Fixture | Used by | Predicted |
|---|---|---|
| F1: 500 polygons, LV95 (`spatial_engine::fixture::write_geoparquet`), placed inside a scratch project folder | K-S1 to K-S9, K-O1 to K-O7 | it is saved with `machine-recorded` plus `project-relative`, and reopens with equal claims and no difference |
| F2: F1 placed outside the folder | K-S5 | `machine-recorded` only, and no absolute path in the file |
| F3: F1 behind a junction (Windows) or a symlink (Linux) inside the folder | K-S4, K-R1, K-R2 | `machine-recorded` only at save; refused by name at open |
| F4: F1 with its mtime moved 60 s later | K-O2, E-CHANGED | `check.observed` names `modified_ns` |
| F5: hand-built project files with a duplicate key, members out of order, `1.00`, a reordered layout, and a lineage member that records a lineage | U-R1 to U-R5, L1 to L4 | each is refused or handled by name |
| O0, at the laptop (OPEN-6 (A)): a folder under OneDrive, with F1 copied in and set online-only | O0, OP1 to OP3 | H1 and H5 |

## §4. Tests, and one mutation per new test

A mutation is observed by applying it, running the named test, recording its failure by name with its commit, and reverting it (round 25, item 2 (c)). No `verify-mutation` run is called an observation.

**Step 1**

| Test | Mutation |
|---|---|
| U-L1 `the_line_oriented_layout_writes_adr_036s_example_byte_for_byte` (`renderer/src/canonical.rs`, `mod tests`; conditional on the block's OPEN-L: the expected bytes are the ruled layout's) | a four-space indent |
| U-R1 `the_strict_reader_refuses_a_duplicate_key_naming_its_path` | the duplicate check removed |
| U-R2 `the_strict_reader_refuses_members_out_of_declared_order` | keys compared as a set |
| U-R3 `the_strict_reader_refuses_a_number_not_in_canonical_spelling` | the re-rendered file compared as parsed values, not as bytes |
| U-R4 `the_strict_reader_refuses_any_layout_but_the_line_oriented_form` | the re-render comparison skipped |
| U-R5 `every_member_and_the_file_are_refused_over_their_ceilings` | the `MAX_PROJECT_FILE_BYTES` check removed |
| U-R6 `writer_then_reader_round_trips_generated_project_files_byte_for_byte` | the indent unit changed in the writer only |
| U-C1 `canonical_form_refuses_device_names_trailing_dot_or_space_and_control_characters` | the device-name match made case-sensitive |
| U-I1 `an_observation_over_the_exact_integer_bound_is_refused_at_bind` (`kernel/src/dataset_ref.rs`, `mod tests`, a unit test of the private check; 1a's R6 precedent, because a real file over 2^53 − 1 bytes cannot be made) | the check removed |
| K-S1 `a_saved_project_reads_back_in_the_line_oriented_form_from_a_real_open` (seam: `open_dataset` → `save_project` → the reader) | the writer emits the one-line form |
| K-S2 `the_identity_is_minted_at_the_first_save_and_kept_after` | minted at every save |
| K-S3 `inside_data_reached_without_a_link_carries_project_relative_and_machine_recorded` | `project-relative` never added |
| K-S4 `data_reached_through_a_link_below_the_folder_carries_machine_recorded_only` | the walk follows links |
| K-S5 `outside_data_carries_machine_recorded_only_and_no_absolute_path` | the absolute path written as `at` |
| K-S6 `an_abort_before_the_rename_leaves_the_previous_project_file_whole` (child process) | the file written in place |
| K-S7 `a_rename_that_keeps_failing_is_refused_by_name_after_the_declared_attempts` | the bound removed (it never returns) |
| K-S8 `a_save_appends_one_saved_here_mark_that_recover_chains` | `after` set to the first step |
| K-S9 `the_first_save_moves_the_record_under_the_project_identity` | the `unsaved-` record kept as well |
| K-S10 `a_first_save_into_a_folder_holding_a_project_is_refused` | the existence check removed |
| K-S11 `inside_data_with_no_canonical_spelling_is_saved_with_machine_recorded_only` | the save refused |
| K-S12 `saving_over_a_kept_lineage_is_refused_by_name` | the refusal removed |
| G3 `a_project_file_carries_no_generation_handle_session_reference_absolute_path_or_user_name` | the open's path written |
| Shell: `save sends save_project with the version, the folder once, and the workspace`; `a click selection at save shows the selection notice`; `a refused save shows the owner's notice with the kernel's message` | `folder` sent at every save; the notice omitted; the refusal swallowed |
| E-SAVE: open, filter, style, save; the file reads back; the folder holds `project.spatial` and no other format file | the save enqueued before the filter |

**Step 2**

| Test | Mutation |
|---|---|
| K-R1 `a_link_below_the_folder_is_refused_and_never_opened` | the link check removed |
| K-R2 `on_windows_a_junction_out_of_the_folder_is_refused` | the walk follows reparse points |
| K-R3 `a_device_name_or_trailing_dot_target_is_refused_before_any_open` | the text check skipped |
| K-R4 `an_unresolvable_target_is_refused_by_name` | a missing segment opened as the folder |
| K-R5 withdrawn (OPEN-5 (B), ruled: no held handles) | — |
| K-O1 `a_saved_project_reopens_with_its_data_claims_and_workspace` (seam, real shape) | the claims dropped at reopen |
| K-O2 `a_changed_file_is_reopened_with_each_differing_component_named` | only `byte_size` compared |
| K-O3 `a_missing_file_returns_not_found_and_opens_nothing` | the machine location falls back to the folder |
| K-O4 `a_second_open_of_an_open_identity_is_refused_in_this_process_and_another` | no lock |
| K-O5 `the_second_open_refusal_never_outlives_a_crash` (a child process aborts while holding the project) | a marker file created by `create_new` instead of a lock |
| K-O6 `the_question_is_asked_only_when_the_first_folder_holds_this_identity_or_cannot_be_reached` (five cases) | asked whenever the first folder exists |
| K-O7 `a_copy_gets_a_new_identity_in_the_new_folder_and_its_own_links` | the new identity written to the first folder |
| K-O8 `a_relinked_file_is_checked_against_the_observation_and_each_difference_named` | the check skipped on re-link |
| L1 to L4 (ruling 4, on hand-built files; conditional on the block's OPEN-D: under (b), the previous lineage is placed in the folder under the block's name): a match; a prefix cut back by the step count; a previous lineage used; a different save named and not read | each detection arm removed in turn |
| Shell: `reopen goes through runAdmitPath and shows liveness and Cancel`; `question re-calls with the answer`; `the changed-file notice names each component` | `admit` bypassed; the answer dropped; the components joined into one word |
| E-REOPEN; E-CHANGED; E-SECOND (two app processes); E-CRASH-UNLOCK (kill the first, then the second opens) | each step's wiring removed |

**Step 3**

| Test | Mutation |
|---|---|
| K-C1 `a_crashed_unsaved_record_is_listed_with_its_dataset_and_time` | lists this run's records |
| K-C2 `declining_removes_the_record` | removal skipped |
| K-C3 `accepting_truncates_to_the_kept_prefix_and_later_steps_chain` | `parent` null after adopt |
| K-C4 `a_projects_record_is_offered_at_its_open_not_at_start` | listed at start |
| K-C5 `the_offer_states_changed_or_not_found_data` | `check` skipped |
| K-C6 `a_locked_record_is_never_offered` | no lock probe |
| K-C7 `an_unsaved_record_moved_to_a_project_record_is_not_offered_twice` | no dedupe |
| Shell and E-RECOVER (apply steps, kill, start: the offer names the dataset and the time; accepting restores the state) | the offer applied without the check |

No existing test is edited except for the version literal. Under OPEN-19 (A), ruled, any 1b test whose hand-written line is out of order is also edited; that edit is I3 if it happens.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predictions:** §3's column, and H1 and H4 to H7. A wrong prediction is class 2.
- **Declared unchanged:**
  - `engine/` and `protocol/data-plane`;
  - `renderer/`, apart from `renderer/src/canonical.rs`'s one new function, its module-doc paragraph and its new tests. `to_canonical_string`, `canonical_and_hash`, `write_double` and every existing test there stay byte-identical;
  - the six commands' shapes, apart from the literal;
  - `SkpHost::new`; `data_dir`; `kernel/src/permission/**`; the bundle;
  - ADR-005, ADR-006, ADR-016 and ADR-017;
  - every existing e2e suite's outcomes.
- **Invalidators** (stop and report):
  - **I1:** a pinned interface has changed at the base, milestone 4's style state and the `style.set` value shape included.
  - **I2:** H1 fails (a placeholder is a name surrogate, or will not download).
  - **I3:** an existing test needs an edit outside §4.
  - **I4:** code before acceptance, before this piece's appended ADR-036 amendment is approved, or before O0.
  - **I5:** withdrawn (OPEN-5 (B), ruled).
  - **I6:** a lockfile change or a new dependency.
  - **I7:** a shared path, or a second piece touching `protocol/`.
- **Falsification:**
  - std's per-segment walk cannot tell a link from a cloud placeholder, on the machine where O0 runs (H1);
  - the line-oriented form cannot be held to one byte form.

## §6. Instruments

Assertions only: typed outcomes, byte equality, bounds and file presence. No measurement and no docs/08 row.

## §7. Declared values and ceilings

Each at its own site:
- `MAX_PROJECT_FILE_BYTES` = 1,048,576;
- `MAX_LOCATOR_SEGMENTS` = 64;
- `MAX_SAVE_RENAME_ATTEMPTS` = 5, with a declared pause between attempts and no timing claim;
- `MAX_KNOWN_FOLDERS` = 256 per identity;
- the reserved device-name list (OPEN-20 (A), ruled), declared as data at its site. (conditional on the block's OPEN-R) It is the block's A4 list; under (b), the shorter list;
- the layout's indent unit and its separator after a key, declared at the function's site in `renderer/src/canonical.rs`. (conditional on the block's OPEN-L) Two spaces and `: `; under (b), `:`; under (c), a tab;
- the existing ceilings: 8 locators, 4,096 bytes per string, the CRS definition ceiling.

The budgets are §2.11's, with its counting command, per step. §7 is never edited, and an overrun is class 8.

## §8. Block-on-sight

1. An absolute path, handle, session reference, generation or user name in a project file. A locator built or parsed outside the kernel.
2. A project-relative target opened before every segment is checked. A link followed. A handle held past the check (OPEN-5 (B)).
3. A save written in place. A reply before `sync_all`. A temp name outside the declared pattern removed.
4. A lock that can outlive a crash (a marker file).
5. A question asked or skipped against ruling 8. A new identity written to the first folder.
6. A lineage written (OPEN-8 (A), ruled). A kept lineage overwritten silently.
7. Code before acceptance, or before this piece's appended ADR-036 amendment is approved. ADR-036 or ADR-022 text the human has not approved. A style persisted without ADR-022 Amendment 2.
8. A kernel message stating the shell's consequence. A silent refusal.
9. A `pub` item or option without a product caller (instrument accessors and round 8 excepted only as ruled).
10. A new dependency, `cfg`, resolver of the data directory, or lockfile change.
11. Undo, replay or "undoable". A performance number.
12. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code landed before the amendment that declares it;
    - a `verify-mutation` run called an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id;
    - a five-line form.
13. Quotation marks around text that is not byte-identical. A line cite into the ledger. A bare self-line. A pin read as current.
14. A canonical byte form written, or a hash taken, outside `renderer/src/canonical.rs` (ADR-022 decision 3; §2.3a).

## §9. Gates

- **Per step, commit plan:** step 1 opens with the ADR commit (§2.10). Then, for every step: the protocol and fixtures; the renderer function (step 1); the kernel with its tests; the binding; the shell with its tests; the e2e suite and records.
- **Architect:**
  - §8, item by item;
  - ADR-006 per §2.1;
  - ADR-036 as accepted, with this piece's appended amendment as approved, and ADR-022 Amendment 2 byte for byte against the human's words;
  - ADR-022 decision 3 per §2.3a;
  - principles 4, 5, 7 and 8;
  - R9 for `view`;
  - the seam rule for:
    - shell → `save_project`/`open_project` → kernel → file;
    - kernel writer → `renderer/src/canonical.rs`'s layout function (U-L1, K-S1);
    - kernel → `SkpHost::open_dataset`;
    - resolver → engine path (K-O1);
    - `recover` (1b) → recovery (K-C3);
  - round 8, closing 1b's OPEN-6;
  - the discharge and operator-text rules; verbatim quotes; round 25.
- **Reviewer:**
  - the full diff `origin/main...HEAD`;
  - every mutation made again;
  - §2.11 by its command;
  - every hash recomputed;
  - empty lock diffs.
- **Suites:**
  - the workspace's `cargo test --locked --features spatial-engine/fixture`, `fmt` and `clippy`;
  - the shell's `npm run verify` and the src-tauri tests;
  - every e2e suite;
  - the `scripts/plan`, `hooks` and `evidence` node tests;
  - verify, queue, site, cites, quotes (a floor) and test-claims;
  - CI green.
  Heavy runs follow THE MACHINE paragraph.
- **Operator** (a new Part, blank log):
  - P0: read the last amendment first;
  - OP1: save into a OneDrive folder;
  - OP2: reopen with the data online-only; the download shows liveness and Cancel and never looks frozen;
  - OP3: Cancel during the download;
  - OP4: copy the folder by hand and open the copy (the question);
  - OP5: open the project in two windows;
  - OP6: crash, then the recovery offer.
- **PR body:** asks for a merge commit. It names each OPEN ruling, the block's rulings, base B and `recover`'s consumer closed. It shows the lock diffs and lists the P6 strings.

## §10. Amendments

*(Opens empty; append-only. Amendment 1 records O0's result and the block's OPEN rulings, and applies the other option at each `(conditional on the block's OPEN-<x>)` mark where it was ruled, before any code.)*

---

# OPEN items, as ruled

The human's rulings: `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10 @ 6c3795c5` for OPEN-1, and `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:15-18 @ 6c3795c5` for the rest. Each item keeps its options; **ruled** marks the option the human chose.

- **OPEN-1. ADR-036's route.**
  - (i) a pre-acceptance block carrying the rulings, then acceptance, then code. **Ruled (i):** a docs-lane piece ahead of 1c's code applies the block, and the human types the acceptance once it has merged (§2.10).
  - (ii) accept now with words that keep version 1 open, and the amendment in step 1;
  - (iii) accept together with step 1, before it merges.
- **OPEN-2. ADR-022 Amendment 2: style persistence in the project file.**
  - (A) grant it, for the §5a document. **Ruled (A),** in the human's words, quoted in §2.10.
  - (B) no grant, so 1c saves no style.
- **OPEN-3. Steps and wire versions.**
  - (A) three PRs, each with its own SKP version. **Ruled (A).**
  - (B) three PRs, with steps 2 and 3's commands landing in step 1 under a round-8 pre-commitment;
  - (C) one PR with staged commits.
- **OPEN-4. Data inside the folder with no canonical spelling.**
  - (A) carry `machine-recorded` alone, and the owner says the project will not find the file on another machine. **Ruled (A),** in the human's words. This is a sub-line span of `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:16 @ 6c3795c5`, which carries that line's hash; it was byte-copied from my Read, not by script:

    > data inside the project folder whose path has no canonical spelling on this machine is recorded as machine-recorded only, and the owner's statement says the project will not find that file on another machine; the save is not refused.
  - (B) refuse the save.
- **OPEN-5. How the checked target is the opened target.**
  - (A) Windows pinned by held handles that deny delete-sharing; Linux and macOS checked at open only, declared;
  - (B) checked at open only, on every platform, with the race declared. **Ruled (B),** in the human's words. This is a sub-line span of `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:17 @ 6c3795c5`, which carries that line's hash; it was byte-copied from my Read, not by script:

    > checked at open on every platform, the race declared; no held handles.
  - (C) (A), plus a Linux hand-off through `/proc/self/fd`.
- **OPEN-6. O0, the OneDrive probe, before the code.**
  - (A) the human prepares an online-only file, and the custodian runs a std-only probe that the worker writes under `spikes/`. **Ruled (A).** In paraphrase: the human prepares the file at the laptop when the custodian tells him.
  - (B) the custodian runs it alone, if OneDrive is signed in on this PC.
- **OPEN-7. A second open of an identity that is already open.**
  - (A) refused by name, by an OS lock that is freed at a crash. **Ruled (A).**
  - (B) focus the existing window, which needs single instance.
- **OPEN-8. Lineage in 1c.**
  - (A) none written: the member is a named state, the reader handles ruling 4's full shape, and a save over a kept lineage is refused by name. **Ruled (A).**
  - (B) 1c writes the lineage now.
- **OPEN-9. What Save trusts.**
  - (A) the client sends the workspace; the kernel validates it, withholds the saved-here mark when the filter or style differs from what the history's steps reach, and says so. **Ruled (A).**
  - (B) the kernel derives the filter and style from the history;
  - (C) as (A), with no comparison.
- **OPEN-10. Filter clauses.**
  - (A) save the filter as applied only;
  - (B) save the clause list too. **Ruled (B).** In paraphrase: the clause model is being merged in milestone 3. It is on main as `ViewState.clauses` (§0.3).
- **OPEN-11. The map view.**
  - (A) saved as a centre and a scale in the dataset's space, named per R9. **Ruled (A).**
  - (B) not saved in version 1.
- **OPEN-12. Point and line style.**
  - (A) the same §5a document whatever the geometry, as the canvas draws it. **Ruled (A).**
  - (B) members per geometry kind.
- **OPEN-13. Accepting a recovery offer.**
  - (A) adopt in place: lock, truncate to the kept prefix, continue. **Ruled (A).**
  - (B) copy the prefix to a new record.
- **OPEN-14. Integers above 2^53−1.**
  - (A) the ADR bounds `byte_size` and `footer_length`, and the reference build refuses a larger file. **Ruled (A).**
  - (B) write them as decimal strings.
- **OPEN-15. The Snapshot column.**
  - (A) reserved for stage 3, with its version step. **Ruled (A).**
  - (B) readable in version 1 and refused at open.
- **OPEN-16. A first save into a folder that already holds a project.**
  - (A) refuse by name. **Ruled (A).**
  - (B) ask to replace.
- **OPEN-18. The session record at the first save.**
  - (A) copy it under a new header naming the project, then remove the `unsaved-` record, with recovery de-duplicating by first step id. **Ruled (A).**
  - (B) rename the folder and keep the `not-yet-saved` header.
- **OPEN-19. One strict reader for the session history too.**
  - (A) yes. **Ruled (A).**
  - (B) the project file only.
- **OPEN-20. The reserved-name list.**
  - (A) a list declared at its site, with the concept from Go and nothing ported. **Ruled (A).**
  - (B) a cap-std dependency.

There is no OPEN-17. The `.spatial` check is on record (`state/consults/2026-10-21-spatial-extension-check-custodian.md`).

---

# What I could not settle

- **The hashes and the block's options.**
  - No cite carries a hash. The full id of 6c3795c5 is 6c3795c5257013d5471bacf68d8c7bb6a2006e0b.
  - The block's OPEN items A, L, R, W, D, S and O are unruled. The form follows each recommended option, and every place that depends on one is marked.
- **OPEN-6 (A).** The human places the file at the laptop, while the option's text has the custodian run the probe. I could not settle whether the laptop is the reference machine, or who runs the probe there.
- **H1 rests on my reading of std on Windows.** I have not confirmed three things:
  - that `FileType::is_symlink` is true for every name-surrogate tag, junctions included;
  - that it is false for every cloud-file tag;
  - that `symlink_metadata` of a placeholder triggers no download.
  O0 and K-R2 test these.
- **The window under OPEN-5 (B) is wider than the block draft's B1 words.** B1's new sentence for ADR-036 line 80 names "between the check and the open" (`state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:195 @ 6c3795c5`). The engine reads by path again for as long as the dataset is open, so the race reaches every later read. My form declares the wider window (§2.5, K-2). The block's words are true but cover only part of the window; whether they should name the rest is the human's call, at the block's gate.
- **Item C is missing from the block draft's section 2.** That section does not list the reader ceilings by number, which N-9 and the acceptance consult assign to 1c. I kept the item in §2.10.
- **`view` and the canonical domain.** The canonical grammar refuses a non-zero magnitude below 1e-6 (`renderer/src/canonical.rs:33-38 @ 6c3795c5`), so a view centre coordinate with 0 < |v| < 1e-6 cannot be written. Item W's words must say how that case is handled without a silent conversion, and without a refused save that loses work. That is not settled here.
- **ADR-022 Amendment 2's "the step record for provenance".** In 1c the only step record is the session history on the machine, because no lineage is written under OPEN-8 (A), and a project file that travels carries none. Whether that meets docs/11's provenance obligation for the shared file is the human's reading of his own words. I changed nothing in them.
- **The appended ADR-036 amendment's words are not drafted here.** They are drafted for the human's sight at step 1's dispatch.
- **Paths from uncommitted drafts.**
  - Milestone 4's and the redaction scan's paths come from their drafts; neither form is committed at 6c3795c5.
  - The block's node and the recording piece's node are not in PLAN.yaml.
- **Still open from the draft.**
  - Whether reading the project folder as an external destination makes Save project class 3 is argued in §2.1, not ruled.
  - The budgets are estimates; 1b overran its §7 by 25%.

Files read for this revision (all in `C:/dev/spatial-ide`):
- `state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md`
- `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md`
- `state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md`
- `state/consults/2026-10-21-bundle-redaction-scan-not-in-product-publish-architect-revised-form-cites.md`
- `state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md`
- `frontends/shell/WALKTHROUGH-CURRENT-VIEW-ROWS-G1-N5-PREREGISTRATION.md`
- `scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md`
- `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`
- `docs/adr/ADR-022-style-v0-as-the-single-style-model.md`
- `renderer/src/canonical.rs`
- `kernel/src/dataset_ref.rs`
- `kernel/src/session_history.rs`
- `kernel/src/skp.rs`
- `engine/src/dataset.rs`
- the shell files named in §0.3
- `AUTONOMY.md`
- `PLAN.yaml` (by node id)
