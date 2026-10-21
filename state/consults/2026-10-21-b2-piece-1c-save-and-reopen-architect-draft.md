*Custodian's filing note (2026-10-21): the architect's draft of the full form for `b2-piece-1c-save-and-reopen` (the human's placements message, item 2: the form ahead of its code), read only at main eaa3d2a9. The run 2026-10-21T05:08:39Z to 05:23:07Z by its transcript (Glob 2, Grep 30, Read 30; no Write, Edit or Bash); its one SubagentHandback call, at 05:23:05Z. It read the checkout at 905a5cf6; checked by script, eaa3d2a9..905a5cf6 changes state/CUT-STATE.md only, so its cites at eaa3d2a9 stand. Not committed as a form: its OPEN items are the human's, ADR-036's route among them, and its pins carry no hashes yet. Extracted by script from the SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 155b65b7a803a5fa633b173a4675c642cc2b3222f3d7fb1ca40d91d60d0b6999.*

---

Drafted: b2-piece-1c-save-and-reopen, its full form, at main eaa3d2a9

Read: main @ eaa3d2a9be3181ce7e8da8e6b5aaff174aee6c58. Verdict: none (a draft, not a gate).

**Disclosure on the commit.** When I read the checkout, its HEAD was 905a5cf6496d233eabfaf56e46536b98b38bb727, one commit after eaa3d2a9 (by `.git/logs/HEAD`, the commit "the ledger records piece 1c's full form dispatched to the architect"). I read the working tree at that HEAD. Every cite below is given at eaa3d2a9, on the assumption that the ledger commit changed none of the cited files. The custodian confirms this by script (`git diff --name-only eaa3d2a9 905a5cf6`). I cite PLAN.yaml by node id only, because that commit may have moved its lines. I have no shell, so no cite carries a sha256. The custodian fills the hashes by script.

---

# B2 piece 1c — Save project (linked) and reopen: the project's identity, the project file, the changed-file notice, the recovery offer after a crash, and the saved-here mark (full form)

- **Path:** `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `b2-piece-1c-save-and-reopen`, its whole summary.
  - The placement: `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:12` (item 2).
  - The brief's 1c row: `state/directives/B2-BRIEF-2026-10-07.md:142`.
  - ADR-036's ten rulings: `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:8-49`. Where lines 38-49 restate a sentence, the restatement governs over the sentence it restates (its filing note).
  - Round 70: OPEN-2, OPEN-3 and OPEN-7 (`state/directives/2026-10-08-round-70-rulings.md:8-33`).
  - Round 69: item 1's additions and item 4 (`state/directives/2026-10-08-round-69-rulings.md:13-20`).
  - Piece 1a's form, Amendment 5, item 8 (the writer carrying rule, the resolver, and the open item on data with no canonical spelling).
  - Piece 1b's form §2.6 (OPEN-6: `recover` and `locations.json`, whose consumer is this piece). Cited by section, `kernel/B2-1B-RECORDING-PREREGISTRATION.md` §2.6.
- **Inputs:**
  - the boundary inventory, row 7 above all (`state/consults/2026-10-16-boundary-inventory-architect.md:21`);
  - the acceptance consult (`state/consults/2026-10-21-adr-036-acceptance-architect-consult.md`);
  - the two checks (`state/consults/2026-10-12-adr-036-guardrails-two-checks-architect.md`);
  - the reuse findings (`state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md`).
- **Drafted by** the architect, read-only, ahead of the code.
- **Committed before any code.** It is append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Code starts only after all of these:**
  - ADR-036 is Accepted by the human's typed word (the placement, item 2);
  - every OPEN item that §2.13 marks as blocking a step is ruled;
  - O0, the OneDrive probe, has run and is recorded in Amendment 1 (ruling 1 asks for it before the design is chosen);
  - rule (00) holds at the dispatch of each step (§2.14).
- **Form and gating:** the full form, with full gating from dispatch (AUTONOMY §21a, `AUTONOMY.md:315-332`; §25(e), `AUTONOMY.md:482`). The piece touches all four §21a categories:
  - ADR text: ADR-036 and ADR-022;
  - the wire: new SKP commands;
  - security posture: a containment boundary, inventory row 7;
  - stated guarantees: atomic save, an open refusal that never outlives a crash, and ADR-006 class 2.
  It is also over §21c's size. No five-line form is possible.

## §0. Disclosure

**0.1 Inputs.** No pilot, spike or corpus has run. Nothing has been measured. The 5 GB fixture is not used. O0 (§3) is a probe owed before the resolver is designed, and it has not run.

**0.2 The reuse index (the standing step).** These are the custodian's run of `node tools/reuse.mjs` in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, the tool at that commit. The lines below are byte-copied from the custodian's brief as given, and the custodian confirms them against the run by script:

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
- **path-containment.** The concepts only: a component-by-component walk from a held folder, refusing links, with no `..`. The implementation is Rust std (`OpenOptionsExt::share_mode`, `custom_flags`, and `Metadata::file_type` on a handle). No code is ported and no dependency is added. A cap-std dependency would be a new dependency, which is the human's word (OPEN-20).
- **engine-open-identity, open.** The pin design (§2.5) relies on DuckDB's by-path open sharing read access with a held handle (H3). The index's own claim of full sharing is unverified (inventory row 7). It is checked by K-O1 on Windows.
- **stable-identity-copy-move.** Ruling 8 already decides the rule (§2.4). Concepts only.
- **reserved-filename-checks, do-not-reinvent.** The index's tag points at a library, while the form proposes a declared list with no dependency. That conflict is OPEN-20.
- The three phrase queries missed. The misses are noted and do not block.

**0.3 The interfaces as read, on the consuming side** (seam rule). All at eaa3d2a9:
- **The dataset reference (piece 1a's producer):**
  - `DatasetRef::linked` writes `[machine-recorded]` only (`kernel/src/dataset_ref.rs:205-224`);
  - `check` returns `RefCheck::Differs{observed, admission}` (`kernel/src/dataset_ref.rs:296-324`);
  - the text-only canonical form, which does not yet hold ruling 9's widening (`kernel/src/dataset_ref.rs:544-552`);
  - the integer members are written as JSON integers (`kernel/src/dataset_ref.rs:358-373`) and refused above 2^53−1 (`kernel/src/dataset_ref.rs:468-474`);
  - the snapshot shape is refused (`kernel/src/dataset_ref.rs:484-489`);
  - the module says that a file reader must refuse duplicate keys (`kernel/src/dataset_ref.rs:19-20`).
- **The session history (piece 1b):**
  - `recover` is pub, a producer whose consumer is this piece (`kernel/src/session_history.rs:18-19`, `:773-790`);
  - the header admits only `purpose` `session-history`, with `lineage` null (`kernel/src/session_history.rs:565-579`);
  - the header is written with `project` the state `not-yet-saved` (`kernel/src/session_history.rs:305-316`);
  - the mark shapes (`kernel/src/session_history.rs:663-669`);
  - the reader parses through `serde_json::Value`, with a separate duplicate-key scan and no key-order check (`kernel/src/session_history.rs:862-869`, `:963-992`);
  - the lock is std `try_lock` (`kernel/src/session_history.rs:251-261`);
  - `end_session` clears only this run's records (`kernel/src/session_history.rs:195-203`);
  - the store root (`kernel/src/session_history.rs:130-134`).
- **The kernel's open:**
  - `SkpHost::open_dataset` registers a cancel key, arms the watcher by path, and opens by path through `open_cancellable` (`kernel/src/skp.rs:1100-1105`, `:1173-1177`);
  - the engine accepts a `\\?\` prefix (`engine/src/dataset.rs:1651-1658`) and refuses glob metacharacters (`engine/src/dataset.rs:1678-1684`).
- **The shell's open path that a reopen goes through:**
  - `runAdmitPath` takes an `admit(path, cancelKey, options) → AdmissionOutcome` dependency (`frontends/shell/src/admission/AdmissionPanel.tsx:178-185`, `:198-265`);
  - the product `admit` is `admitDataset`: `open_dataset`, then `describe` (`frontends/shell/src/admission/admitDataset.ts:39-66`);
  - the liveness line and Cancel (`frontends/shell/src/admission/AdmissionPanel.tsx:349-385`);
  - the picker binding (`frontends/shell/src-tauri/src/commands.rs:233-246`);
  - the shape of the `record_step` binding (`frontends/shell/src-tauri/src/commands.rs:137-150`).
- **The workspace the shell holds:**
  - `ViewState` has `filter`, `style`, `clauses`, `selection` and more (`frontends/shell/src/workspace/workspaceState.ts:68-86`);
  - the camera's frame and centre (`frontends/shell/src/canvas/extent.ts:94-104`).
- **ADR-022:** Amendment 1 does not grant persistence in a project file (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:78`). Consequence (b) is `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:55-62`.
- Every pin is historical. At each step's base, the custodian sweeps them again. A moved cite is class 3. A changed interface is I1.

**0.4 Hypotheses**, each with its discriminator:
- **H1.** On the reference machine, an online-only OneDrive file is a reparse point whose tag is not a name surrogate. std reports it as not a symlink, and opening it by path triggers the operating system's download. Discriminator: O0.
- **H2 (Windows).** A handle that has read access and shares only read and write blocks two things while it is held: the rename and deletion of the directory or file it holds, and the replacement of a held object by a link. Discriminator: K-R5.
- **H3.** The engine's by-path opens (the descriptor's `File::open`, and DuckDB's `read_parquet`) succeed while H2's handles are held. Discriminator: K-O1 on Windows.
- **H4.** The engine reads a project-relative target given in the `\\?\` form. Discriminator: K-O1. If H4 fails, the plain form is used, and ruling 9's widened text check makes Win32 name rewriting a no-op on canonical text.
- **H5.** While an online-only file downloads, the shell's existing liveness line and Cancel stay live. A Cancel ends the open at the engine's next check after the blocking read returns. Discriminator: O0 and row OP3.
- **H6.** `std::fs::rename` replaces `project.spatial` atomically on NTFS. A sharing violation (from an indexer, antivirus or the sync client) is retried up to the declared bound and then refused by name. Discriminator: K-S6 and K-S7.
- **H7.** `File::try_lock` on a machine-side lock file is freed by the operating system when its process ends abnormally (the same mechanism piece 1b proved for the history). Discriminator: K-O5.

## §1. What this preregistration may and may not claim

**May claim:**
- Save project (linked): the project's identity is minted at the first save, and `project.spatial` is written atomically in the line-oriented canonical form;
- the writer's carrying rule, as ruled;
- the saved-here mark;
- reopen, with the strict reader, the containment resolver, the copy-or-same question, the second-open refusal, the changed-file notice and re-link;
- the recovery offer;
- each of these only as §4 tests it.

**May not claim:**
- any lineage file written (OPEN-8 (A); the brief, `state/directives/B2-BRIEF-2026-10-07.md:158`);
- compaction, restore to an earlier step, undo or replay (pieces 2 and 4; ADR-036 §7). "Undoable" is never said of a save;
- a snapshot (stage 3);
- file association or single instance (a later piece, the human's typed word, ruling 2);
- more than one dataset per project;
- a saved click selection (round 69, item 4);
- macOS or Linux containment above what OPEN-5 rules;
- survival of a power loss (the kernel asks for a flush);
- any performance number, docs/08 row or duration;
- that a save is cancellable. It is one bounded write, one flush and one rename, with no declared figure for its time;
- any persisted feature id.

**ADRs.** Cited: ADR-005, ADR-006, ADR-010 rule 6, ADR-016, ADR-017 §5a and §6, ADR-018, ADR-022 and ADR-036. Amended only in the human's words: ADR-036 (§2.10, by route OPEN-1) and ADR-022 (OPEN-2).

**Strings.** Every string the app shows is the human's at P6. §2.12 gives placeholders.

## §2. The change

### 2.1 Names against ADR-006 (operation-class correctness)

- **Save project** persists the workspace into the project's own store (docs/02, Projects). It is the commit of ADR-006 class 2, made transactional by the atomic rename (§2.3).
  - It is not a step and not an export. The history records it with a `saved-here` mark (ADR-036 §6, mark lines, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:128`).
  - No approval gate applies, because nothing leaves the workspace's own store. A gate that reads the project folder as an external destination may block here, and the reason above is what it judges.
- **Reopen** loads the saved workspace. It is not a restore.
- **Accepting a recovery offer** restores workspace state to the last kept step of a crashed history. That is ADR-036 §7's restore of workspace state, never a replay (OPEN-13).
- **Declining** clears a machine-side record, as ruled (round 70, OPEN-3).
- **The copy answer** writes a new identity into the newly opened folder's project file. That is a save.

### 2.2 Protocol (SKP; OPEN-3 decides one version per step)

- **`save_project`** (step 1).
  - Request: `{skp, dataset, folder: string|null, workspace}`. `folder` is present only at the first save (from the native folder picker binding). `workspace` has the shape §2.10 item A9 names.
  - Response: `{project, history_mark: "written"|"withheld"}`. The shell's notice reads `history_mark` (OPEN-9).
- **`open_project`** (step 2).
  - Request: `{skp, folder, cancel_key, answer: null|"copy"|"same", relink: null|string}`.
  - Response, one of:
    - `opened {project, dataset, session, workspace, check: {observed:[…], admission:[…]}, lineage: <named fact>}`;
    - `question {kind:"copy-or-same"}`;
    - `not_found {file_name}`.
  - The kernel stays stateless across the two phases: the shell calls again with `answer` or `relink`.
- **`list_recoverable`, `recover_session` and `discard_recoverable`** (step 3; OPEN-3).
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
  - The layout is line-oriented (§2.10 item A4). Every scalar token is `to_canonical_string` of that scalar, so the renderer is not changed.
  - Before the write, the writer checks the bytes it is about to write against the reader's own rules, as 1b's writer does (`kernel/src/session_history.rs:284-302`).
- **Atomic save** (ruling 10).
  - The steps: write `project.spatial.tmp-<16 hex>` in the folder, `write_all`, `sync_all`, then `rename` over `project.spatial`. A sharing violation is retried up to `MAX_SAVE_RENAME_ATTEMPTS` and then refused by name. On POSIX, the folder is fsynced.
  - A temp file left by a crash belongs to no format (ADR-036 §1, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:27`). The next successful save removes files named by exactly that pattern, and nothing else.
- **First save into a folder that already holds `project.spatial`** is refused by name (OPEN-16).
- **Carrying rule** (ruling 1; round 70, OPEN-7; 1a Amendment 5 item 8):
  - a `machine-recorded` locator always;
  - a `project-relative` locator where the resolver's judgment at save (§2.5) finds the data inside the folder, reached without a link, with a canonical spelling;
  - never an absolute path. Data with no canonical spelling follows OPEN-4.
- **The machine store** (`<data dir>/spatial-ide/projects/<32 hex>/`, through the existing `data_dir`). The files:
  - `locations.json`: persistent, the same format as ADR-036 §9's;
  - `folders.json`: the folders known for this identity and their answers;
  - `open.lock` (step 2).
  None of them is ever in the project folder, and none is cleared in B2 (§2.10 item A13).
- **Saved-here mark** (step 1). At each save, one `{"mark":{"kind":"saved-here","after":<last step id>,"at":…}}` line is written, through 1b's append path, with a write and a flush. There is no mark when the history holds no step yet. Under OPEN-9 (A), there is no mark when the sent workspace differs from what the history's steps reach.
- **First save and the session record** (OPEN-18 (A)):
  1. the record's kept lines are copied under a new header whose `project` is the URI, into `sessions/<project hex>/history.jsonl`, written to a temp, synced, renamed and locked;
  2. then the `unsaved-` record is removed.
  Recovery (step 3) skips an `unsaved-` record whose first step id appears under a project record.
- **Lineage member** (OPEN-8 (A)).
  - 1c writes a named state meaning that no lineage is kept yet.
  - The reader accepts the full shape of ruling 4.
  - The writer refuses by name (`project_lineage_not_kept_by_this_version`) to save over a project whose member records a kept lineage. It never breaks that lineage silently.
- **Strict reader** (`strict_json.rs`; ruling 7 and the 2026-10-09 note):
  - a tokenizer over bytes, with bounds checked before any allocation;
  - it refuses a duplicate key, a member out of the order the schema declares, and any layout other than the line-oriented form (project file) or one document per line (steps files);
  - a number is accepted only when its canonical spelling under `spatial_renderer::canonical`'s grammar is its token, byte for byte. The token is parsed with std's correctly rounded `f64` parse, and `float_roundtrip` is not enabled;
  - under OPEN-19 (A), it replaces `serde_json::from_str` in 1b's `read_line` as well.

### 2.4 Kernel: reopen (step 2)

1. **Read** `project.spatial` with the strict reader, under `MAX_PROJECT_FILE_BYTES`.
2. **Identity and folder** (ruling 8, `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:22`, with its restatement at `:38-40` governing):
   - this folder is known for the identity → open;
   - the remembered first folder still holds a project with this identity → `question`;
   - the first folder is gone, or holds another project or none → a move: the folder memory is updated and nothing is asked;
   - the first folder cannot be reached → `question`.
   - The answer `copy` mints a new identity into this folder and gives it its own data links. The answer `same` is remembered for this folder.
3. **Second open** (ruling 2; OPEN-7 (A)). `try_lock` on `projects/<hex>/open.lock` happens after step 2, so a copy never collides. A held lock refuses with `project_open_elsewhere`. The lock is held until the project's dataset closes (B2 has one dataset per project), and the operating system frees it at a crash (H7).
4. **Data.**
   - A `project-relative` locator goes through the resolver's open (§2.5).
   - Otherwise the machine store's location is used. If it is absent or missing → `not_found`, and the shell offers re-link.
   - A re-linked file is opened and checked against `observed` (round 70, OPEN-7).
   - The open is `SkpHost::open_dataset` with the recorded claims and the request's `cancel_key`. The host mints attribution there (ADR-036 §5, `admission`).
5. **Check.** `DatasetRef::check` gives the response's `check`, as facts. The shell states the consequence.
6. **Lineage.** The member is read, and the lineage file is detected under ruling 4 (§2.10 item A6). Under OPEN-8 (A), a lineage file beside a member that records none is named in `lineage` and is not read.

### 2.5 Kernel: the resolver (inventory row 7; ADR-036 line 82; ruling 1)

- **At save, `judge`:**
  1. canonicalize the open's path to P and the folder to F;
  2. if P is not under F, the data is outside: `machine-recorded` only;
  3. otherwise, apply the canonical-form text check to the relative segments (ruling 9's widening, §2.10 item A8). A failure follows OPEN-4;
  4. walk the segments from F, as in the open below. A name-surrogate reparse point (or, on POSIX, a symlink) means `machine-recorded` only.
- **At reopen, `open_inside(F, at)`** (Windows):
  - open F, then each segment in turn. Each open has read access, shares read and write only (never delete), and does not follow reparse points (`FILE_FLAG_OPEN_REPARSE_POINT`, `FILE_FLAG_BACKUP_SEMANTICS`);
  - check the type on the handle, not on the path: a name surrogate is refused with `project_target_through_link`; a missing segment with `project_target_unresolvable`; an intermediate that is not a directory, or a final that is not a regular file, by name;
  - a cloud placeholder is not a name surrogate, so it opens (H1);
  - the engine path is F and the segments as walked, in the `\\?\` form (H4);
  - the handles are held in the project session until the dataset closes.
- **How the target checked is the target opened** (Windows):
  - every object on the walked path is held by a handle that denies delete-sharing, so no component can be renamed, deleted or replaced by a link while it is held (H2);
  - no component was a link when its handle was checked;
  - so each later by-path resolution by the engine reaches the same objects (inventory row 7: every engine read goes by path again, `state/consults/2026-10-16-boundary-inventory-architect.md:21`);
  - content changes are the observation's and the watcher's to detect, not containment's.
- **The consequence the operator meets** (OPEN-5): while the project is open, another program cannot rename, delete or replace-by-rename the data file or its folders inside the project.
- **Linux and macOS** are explicitly reduced (OPEN-5 (A)). The same walk runs with `O_NOFOLLOW`, but a held directory can still be renamed, so the check holds at open only. This is a KNOWN-LIMITATIONS item.
- **Device names, and a trailing dot or space,** are refused twice: by the text rule, and because the final object must be a regular file.
- **POSIX mount points** below the folder are not links and are not refused. This is stated in the ADR passage (§2.10 item A1).

### 2.6 Kernel: the recovery offer (step 3; `recover`'s consumer)

- **The list.** `list_recoverable` lists the `unsaved-` records (at app start) and the record of the project being opened (at its open). A record is listed only if `try_lock` succeeds, so a live run's record is never offered. Each entry is the dataset's file name from the record's `locations.json`, the time of the last kept step, and the data's state under `check`: unchanged, changed (with the components named) or not found (round 70, OPEN-3).
- **`recover_session`** (OPEN-13 (A)):
  - it takes the record's lock;
  - it truncates the history to the length of the kept prefix and syncs it;
  - it continues that record for this run;
  - it returns the last value of each key (the filter, and the four style properties). The shell applies them.
- **`discard_recoverable`** removes the record.

### 2.7 The shell's binding (`frontends/shell/src-tauri/src/commands.rs`, `lib.rs`)

- The SKP commands each run on `spawn_blocking`: decode, call, serialize.
- `binding_pick_project_folder` is the native folder dialog, not SKP.
- The project session is held in the binding's state and dropped at `close_dataset` of its dataset.

### 2.8 The shell (`frontends/shell/src/`)

- **Save project** is available from the command bar and a control (P6). The first save opens the folder picker.
- When a click selection exists, Save shows the selection notice (round 69, item 4).
- The owner's notices state the consequences: saved; not saved, with the kernel's message; the history mark withheld.
- **Open project** goes through `runAdmitPath`, with an `admit` that calls `open_project` and then `describe`. So the liveness line, Cancel and the refusal UI are the existing ones.
  - `question` → the copy-or-same question (the human's words at P6);
  - `not_found` → a re-link pick;
  - `opened` → the workspace (filter or clauses, style, view) is applied through the existing reducer transitions, and the changed-file notice names each component.
- **Recovery offer:** at start, a list from `list_recoverable`; at a project's open, its own offer.
- **Console:** one class-A row per new command.

### 2.9 Portability (R3)

- **Boundary:** application directories (`data_dir`, reused) and the new resolver (`kernel/src/project/resolver.rs`), the only place in this piece with an OS split.
- **Windows:** supported, pinned.
- **Linux:** L1, with containment checked at open only (KNOWN-LIMITATIONS).
- **macOS:** reduced, as for Linux, with the store under `~/.local/share` as the audit log has it.
- **Tests:** K-R5 is Windows-only by a run-time check of the operating system, not a `cfg`, and it reports which operating system it ran on (1b's precedent in correction round 2). The junction tests use a junction on Windows and a symlink on Linux. The e2e tests run on Windows.

### 2.10 The ADR-036 amendment this piece owes (the ADR text is the human's; I draft none of its words)

This table names what each passage must say (my paraphrase). "Lands" gives the route column for OPEN-1:
- **(i)** a pre-acceptance block, applied by script in an ADR-only PR before acceptance, so the passage is version 1;
- **(ii)** an appended amendment in step 1's PR, which supersedes the named lines, with version 1 kept open by the acceptance words;
- **(iii)** a pre-acceptance edit in step 1's PR, with acceptance typed before step 1 merges.

| Item | Ruling or finding | Passage (at eaa3d2a9) | What it must say | Route notes |
|---|---|---|---|---|
| A1 | ruling 1; finding 1; OPEN-7 refined | §5, containment, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:78-80`; carrying rule `:76` | Every symbolic link and junction (name-surrogate reparse point) below the project folder is refused, whether it points in or out. A cloud-sync placeholder is not a link and opens. The carrying rule: a project-relative locator where the data is inside, reached without a link, with a canonical spelling. POSIX mount points are not links. | (ii): `:80` binds the opposite rule (follow links) until superseded |
| A2 | ADR line 82; inventory row 7 | §5, `:82` | The guarantee as OPEN-5 rules it: pinned on Windows; checked at open only on Linux and macOS. It may not claim more. | a stated guarantee in every route |
| A3 | ruling 2; finding 2 | §1, `:20`, `:25` | The fixed name `project.spatial`, in the line-oriented canonical form. A second open of an identity open on this machine is refused by name and never outlives a crash. File association and single instance are a later piece, by the human's typed word. | the `.spatial` check is evidence owed before acceptance in every route |
| A4 | the line-oriented form (`state/directives/2026-10-09-adr-036-ten-findings-rulings.md:29`) | §2, `:31-32` | The project file's one byte form: one member per line, a fixed indent unit, every object and array broken one entry per line, `{}` and `[]` when empty, the canonical scalar spellings, one final LF. Any other layout is refused. Steps files are unchanged. | (ii) or (iii) after acceptance would be version 2 (`:42`) |
| A5 | ruling 7 | §2, `:34` | Numbers are read by the canonical grammar (the spelling must be canonical). Duplicate keys and members out of the declared order are refused. `float_roundtrip` is not enabled. | — |
| A6 | ruling 4; round 69 item 1 | §8, `:170`; §11, `:194`; §1, `:27` | The project file records the lineage file's sha256 and step count, or a named state meaning none is kept. The lineage is replaced first. A save that removed steps keeps the previous lineage, under a name the passage gives, until the project file is written. On a mismatch, a reader: cuts back by the step count when the prefix matches; uses the previous lineage when that matches; otherwise names the files as from different saves and never reads them silently. §1's "nothing else" names the previous-lineage file. | the 2026-10-09 notes (`:35`) |
| A7 | ruling 8 | §4, `:55` | The question is asked only when the first folder still holds a project with this identity, or cannot be reached. A folder that is gone, or holds another project or none, means a move. A new identity always goes to the newly opened folder. | red line; (ii) binds `:55` until superseded |
| A8 | ruling 9; finding 9 | §5, `:71` | Canonical form also refuses reserved device names (case-insensitively, with or without an extension), a segment ending in a dot or a space, and control characters. The "one spelling on every operating system" sentence is corrected: case and Unicode normalisation can give one file two canonical texts. | (ii) leaves an untrue guarantee binding (the acceptance consult, Correctness) |
| A9 | §11 `:192`; R9 | §11 | The `workspace` member's closed shape: `filter` (OPEN-10); `style`, the §5a document as the renderer admits it (OPEN-12, ADR-022 OPEN-2); `view`, a centre and a scale whose space is named in `dependencies.crs`'s form (OPEN-11, R9); analysis settings reserved by name. A click selection is not in version 1. | — |
| A10 | none (completes §1) | §1 | The project file's top-level closed member set (§2.3). | — |
| A11 | 1a Amendment 5 note | §6 header | The lineage header's entries carry the project file's locators. A session-history header carries `machine-recorded` only. | — |
| A12 | OPEN-18 | §9, `:182` | A session history's `project` after the first save, and the record's name. | — |
| A13 | `:27`; round 70 OPEN-2 | §1, §9 `:182` | The machine store for a saved project (`projects/<hex>/`, with locations, the folder memory and the open lock). The folder memory also holds absolute paths, so `:182`'s "the only file" sentence widens. | — |
| A14 | N-9 (`state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md:153-157`) | §2 `:36-38`; §5 table `:63-68` | The reader ceilings by number. The integers rule (OPEN-14). The Snapshot column (OPEN-15). | — |
| A15 | the acceptance consult, Documentation | `:3`, `:192` | The timing sentences, brought current at acceptance. | `:3` is the human's Status line |
| A16 | OPEN-4 | §5 `:76` | The behaviour for inside data with no canonical spelling. | red line (OPEN-7) |

ADR-022 Amendment 2 (OPEN-2, the human's typed words) must say four things:
- from piece 1c, the §5a style document is persisted in the project file;
- ADR-006 class 2 is the atomic save;
- docs/11's obligations: the project URI, ADR-036 (schema), save and reopen (lifecycle), and provenance;
- consequence (a) stands, and the lineage is not granted.

### 2.11 Steps, files, budgets and the counting command

**The counting command** for every step, at head H with base B named in the PR body:

`git diff --numstat B...H -- . ':!kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.md' ':!CUSTODIAN-QUEUE.json' ':!site' ':!docs/README.md' ':!Cargo.lock' ':!frontends/shell/src-tauri/Cargo.lock' ':!frontends/shell/package-lock.json'`

An overrun is class 8, and §7 is never edited.

**Step 0** (under OPEN-1 (i)): the ADR-036 block and ADR-022 Amendment 2, in an ADR-only PR, ≤ 260 lines over 3 files.

**Step 1, Save project:**

| Group | Ceiling |
|---|---|
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
| **Total** | **≤ 4,360, ≤ 72 files** |

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
  - S5: the history mark withheld (OPEN-9).
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
  - S18: inside data with no canonical spelling (OPEN-4 (A)).
- **KNOWN-LIMITATIONS items** (placeholders): K-1, the data file cannot be renamed, deleted or replaced while the project is open (Windows); K-2, containment is checked at open only on Linux and macOS; K-3, a Cancel during an online-only download takes effect when the current read returns (H5); K-4, the machine store is never pruned.

### 2.13 What waits on what

| Step or work | Waits on |
|---|---|
| step 0 or the ADR text | OPEN-1, OPEN-2, OPEN-4, OPEN-8 to OPEN-12, OPEN-14, OPEN-15, OPEN-18 |
| step 1 | acceptance; OPEN-3, OPEN-9, OPEN-16, OPEN-19, OPEN-20 |
| the step 2 resolver | O0 (H1), OPEN-5, OPEN-6, OPEN-7 |
| step 3 | OPEN-13 |

### 2.14 Overlap (rule (00), `AUTONOMY.md:609`)

- **Governance D (#237):** `scripts/plan/rotate-plan-summaries.mjs` and its test, `scripts/plan/README.md`, `AUTONOMY.md`, PLAN.yaml, `CUSTODIAN-QUEUE.*`, `site/`, `state/cut-archive/`, `state/drafts/`.
  - The one shared path is PLAN.yaml, through this form's commit and the node's status rows.
  - D goes first: it is at S10 and near the click. This form's commit and every 1c PLAN row wait for D's merge, or are held in scratch under the freeze.
- **The redaction scan** (paths as listed in the brief):
  - shared: `kernel/README.md`, and `KNOWN-LIMITATIONS.md` (separate items count as separate paths);
  - `kernel/src/permission/` is read only by 1c (`data_dir`, already `pub(crate)`) and declared unchanged;
  - `engine/src/fixture.rs` is used, never edited.
  - The redaction piece goes first (slot 1 ahead of the order). 1c's step that edits `kernel/README.md` is dispatched after the redaction PR merges.
- **Milestone 4 (`b1-shell-half`),** not drafted. Its likely paths are `App.tsx`, `workspace/*`, `style/*`, `console/surfaceRegistry.ts`, a walkthrough Part and a KNOWN-LIMITATIONS item.
  - It meets steps 1 to 3 on `App.tsx` and `surfaceRegistry.ts`.
  - It meets the persisted style shape: colour by category is the `match` that §5a already holds, so OPEN-12 (A) needs no version step.
  - Milestone 4 goes first where shell paths meet: it is placed in slot 1, and 1c's workspace member must be written against the style state that exists (the seam rule).
  - Step 0 meets nothing and can go now.
  - Steps 1 to 3 dispatch when milestone 4 has merged, or when its committed form shows disjoint paths and no `protocol/` path.
- **`protocol/`:** at most one piece. Steps 1 to 3 each touch it, so no other piece may touch it at their dispatch.

## §3. Fixtures, with outcomes declared in advance

| Fixture | Used by | Predicted |
|---|---|---|
| F1: 500 polygons, LV95 (`spatial_engine::fixture::write_geoparquet`), placed inside a scratch project folder | K-S1 to K-S9, K-O1 to K-O7 | it is saved with `machine-recorded` plus `project-relative`, and reopens with equal claims and no difference |
| F2: F1 placed outside the folder | K-S5 | `machine-recorded` only, and no absolute path in the file |
| F3: F1 behind a junction (Windows) or a symlink (Linux) inside the folder | K-S4, K-R1, K-R2 | `machine-recorded` only at save; refused by name at open |
| F4: F1 with its mtime moved 60 s later | K-O2, E-CHANGED | `check.observed` names `modified_ns` |
| F5: hand-built project files with a duplicate key, members out of order, `1.00`, a reordered layout, a lineage member that records a lineage | U-R1 to U-R5, L1 to L4 | each is refused or handled by name |
| O0 (the reference machine): a folder under OneDrive, F1 copied in and set online-only | O0, OP1 to OP3 | H1 and H5 |

## §4. Tests, and one mutation per new test

A mutation is observed by applying it, running the named test, recording its failure by name with its commit, and reverting it (round 25, item 2 (c)). No `verify-mutation` run is called an observation.

**Step 1**

| Test | Mutation |
|---|---|
| U-R1 `the_strict_reader_refuses_a_duplicate_key_naming_its_path` | the duplicate check removed |
| U-R2 `the_strict_reader_refuses_members_out_of_declared_order` | keys compared as a set |
| U-R3 `the_strict_reader_refuses_a_number_not_in_canonical_spelling` | any `f64` parse accepted |
| U-R4 `the_strict_reader_refuses_any_layout_but_the_line_oriented_form` | whitespace-insensitive tokenizer |
| U-R5 `every_member_and_the_file_are_refused_over_their_ceilings` | `MAX_PROJECT_FILE_BYTES` check removed |
| U-R6 `writer_then_reader_round_trips_generated_project_files_byte_for_byte` | the indent unit changed in the writer only |
| U-C1 `canonical_form_refuses_device_names_trailing_dot_or_space_and_control_characters` | the device-name match made case-sensitive |
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
| K-S11 `inside_data_with_no_canonical_spelling_is_handled_as_ruled` | per OPEN-4 |
| K-S12 `saving_over_a_kept_lineage_is_refused_by_name` | the refusal removed |
| G3 `a_project_file_carries_no_generation_handle_session_reference_absolute_path_or_user_name` | the open's path written |
| Shell: `save sends save_project with the version, the folder once, and the workspace`; `a click selection at save shows the selection notice`; `a refused save shows the owner's notice with the kernel's message` | `folder` sent at every save; the notice omitted; the refusal swallowed |
| E-SAVE: open, filter, style, save; the file reads back; the folder holds `project.spatial` and no other format file | the save enqueued before the filter |

**Step 2**

| Test | Mutation |
|---|---|
| K-R1 `a_link_below_the_folder_is_refused_and_never_opened` | name-surrogate check removed |
| K-R2 `on_windows_a_junction_out_of_the_folder_is_refused` | the walk follows reparse points |
| K-R3 `a_device_name_or_trailing_dot_target_is_refused_before_any_open` | the text check skipped |
| K-R4 `an_unresolvable_target_is_refused_by_name` | a missing segment opened as the folder |
| K-R5 `on_windows_a_held_component_cannot_be_renamed_deleted_or_replaced` (H2) | delete-sharing granted |
| K-O1 `a_saved_project_reopens_with_its_data_claims_and_workspace` (seam, real shape) | the claims dropped at reopen |
| K-O2 `a_changed_file_is_reopened_with_each_differing_component_named` | only `byte_size` compared |
| K-O3 `a_missing_file_returns_not_found_and_opens_nothing` | the machine location falls back to the folder |
| K-O4 `a_second_open_of_an_open_identity_is_refused_in_this_process_and_another` | no lock |
| K-O5 `the_second_open_refusal_never_outlives_a_crash` (a child process aborts while holding the project) | a marker file created by `create_new` instead of a lock |
| K-O6 `the_question_is_asked_only_when_the_first_folder_holds_this_identity_or_cannot_be_reached` (five cases) | asked whenever the first folder exists |
| K-O7 `a_copy_gets_a_new_identity_in_the_new_folder_and_its_own_links` | the new identity written to the first folder |
| K-O8 `a_relinked_file_is_checked_against_the_observation_and_each_difference_named` | the check skipped on re-link |
| L1 to L4 (ruling 4 on hand-built files): a match; a prefix cut back by step count; a previous lineage used; a different save named and not read | each detection arm removed in turn |
| Shell: `reopen goes through runAdmitPath and shows liveness and Cancel`; `question re-calls with the answer`; `the changed-file notice names each component` | `admit` bypassed; the answer dropped; components joined into one word |
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
| Shell and E-RECOVER (apply steps, kill, start: the offer names the dataset and time; accept restores the state) | the offer applied without the check |

No existing test is edited except the version literal, and, under OPEN-19 (A), any 1b test whose hand-written line is out of order. That edit is I3 if it happens.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predictions:** §3's column, and H1 to H7. A wrong prediction is class 2.
- **Declared unchanged:**
  - `engine/`, `renderer/` and `protocol/data-plane`;
  - the six commands' shapes, apart from the literal;
  - `SkpHost::new`; `data_dir`; `kernel/src/permission/**`; the bundle;
  - ADR-005, ADR-006, ADR-016 and ADR-017;
  - every existing e2e suite's outcomes.
- **Invalidators** (stop and report):
  - **I1:** a pinned interface has changed at the base, milestone 4's style state included.
  - **I2:** H1 fails (a placeholder is a name surrogate, or will not download).
  - **I3:** an existing test needs an edit outside §4.
  - **I4:** code before acceptance or before its OPEN item is ruled.
  - **I5:** H2 fails.
  - **I6:** a lockfile change or a new dependency.
  - **I7:** a shared path, or a second piece touching `protocol/`.
- **Falsification:**
  - no handle-held pin keeps the engine's by-path reads on the checked objects on Windows;
  - the line-oriented form cannot be held to one byte form.

## §6. Instruments

Assertions only: typed outcomes, byte equality, bounds and file presence. No measurement and no docs/08 row.

## §7. Declared values and ceilings

Each at its own site:
- `MAX_PROJECT_FILE_BYTES` = 1,048,576;
- `MAX_LOCATOR_SEGMENTS` = 64;
- `MAX_SAVE_RENAME_ATTEMPTS` = 5, with a declared pause between attempts and no timing claim;
- `MAX_KNOWN_FOLDERS` = 256 per identity;
- the reserved device-name list (OPEN-20), declared as data at the site;
- the existing ceilings: 8 locators, 4,096 bytes per string, the CRS definition ceiling.

The budgets are §2.11's, with its counting command, per step. §7 is never edited, and an overrun is class 8.

## §8. Block-on-sight

1. An absolute path, handle, session reference, generation or user name in a project file. A locator built or parsed outside the kernel.
2. A project-relative target opened before every segment is checked on its handle. A link followed. The engine handed a path whose handles are not held (Windows).
3. A save written in place. A reply before `sync_all`. A temp name outside the declared pattern removed.
4. A lock that can outlive a crash (a marker file).
5. A question asked or skipped against ruling 8. A new identity written to the first folder.
6. A lineage written (under OPEN-8 (A)). A kept lineage overwritten silently.
7. Code before acceptance. ADR-036 text that is not the human's. A style persisted without ADR-022 Amendment 2.
8. A kernel message stating the shell's consequence. A silent refusal.
9. A `pub` item or option without a product caller (instrument accessors and round 8 excepted only as ruled).
10. A new dependency, `cfg`, resolver of the data directory, or lockfile change.
11. Undo, replay or "undoable". A performance number.
12. The round-25 items by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code landed before the amendment that declares it;
    - a `verify-mutation` run called an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id;
    - a five-line form.
13. Quotation marks around text that is not byte-identical. A line cite into the ledger. A bare self-line. A pin read as current.

## §9. Gates

- **Per step, commit plan:** the protocol and fixtures; the kernel with its tests; the binding; the shell with its tests; the e2e suite and records.
- **Architect:**
  - §8 item by item;
  - ADR-006 per §2.1;
  - ADR-036 as accepted, and ADR-022 Amendment 2;
  - principles 4, 5, 7 and 8;
  - R9 for `view`;
  - the seam rule for: shell → `save_project`/`open_project` → kernel → file; kernel → `SkpHost::open_dataset`; resolver → engine path (K-O1); `recover` (1b) → recovery (K-C3);
  - round 8, closing OPEN-6 of 1b;
  - discharge and operator-text rules; verbatim quotes; round 25.
- **Reviewer:** the full diff `origin/main...HEAD`; every mutation made again; §2.11 by its command; every hash recomputed; empty lock diffs.
- **Suites:**
  - the workspace `cargo test --locked --features spatial-engine/fixture`, `fmt` and `clippy`;
  - the shell's `npm run verify` and src-tauri tests;
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
- **PR body:** asks for a merge commit; names each OPEN ruling, base B, and `recover`'s consumer closed; shows the lock diffs; lists the P6 strings.

## §10. Amendments

*(Opens empty; append-only. Amendment 1 records O0's result, the ADR route and the OPEN rulings before any code.)*

---

# OPEN items for the human (options; my recommendation)

- **OPEN-1. ADR-036's route** (red line; the acceptance consult, `state/consults/2026-10-21-adr-036-acceptance-architect-consult.md:44-47`):
  - (i) a pre-acceptance block carrying §2.10's items, then acceptance, then code;
  - (ii) accept now with words that keep version 1 open, and the amendment in step 1;
  - (iii) accept together with step 1, before it merges.

  **Recommend (i).** It is the only route that keeps 2026-10-21's "before its code", binds nothing untrue (`:71`, `:80`, `:55`), and avoids version 2. Its cost: OPEN-4, OPEN-8 to OPEN-12, OPEN-14, OPEN-15 and OPEN-18 must be ruled before the block.
- **OPEN-2. ADR-022 Amendment 2:** style persistence in the project file (red line, typed words).
  - (A) grant it, for the §5a document;
  - (B) no grant, so 1c saves no style (against the brief, `state/directives/B2-BRIEF-2026-10-07.md:35`).

  **Recommend (A).**
- **OPEN-3. Steps and wire versions:**
  - (A) three PRs, each with its own SKP version;
  - (B) three PRs, with steps 2 and 3's commands landing in step 1 under a round-8 pre-commitment that names them;
  - (C) one PR with staged commits.

  **Recommend (A).** Each step has its product callers, and no PR exceeds about 5,200 lines.
- **OPEN-4. Data inside the folder with no canonical spelling** (red line, refines round 70 OPEN-7):
  - (A) carry `machine-recorded` alone, and the owner says the project will not find the file on another machine;
  - (B) refuse the save.

  **Recommend (A).** A refused save loses work.
- **OPEN-5. How the checked target is the opened target:**
  - (A) Windows pinned by held handles that deny delete-sharing, so another program cannot rename, delete or replace the data while the project is open; Linux and macOS checked at open only, declared;
  - (B) checked at open only on every platform, with the race declared;
  - (C) (A), plus a Linux hand-off by `/proc/self/fd`.

  **Recommend (A).**
- **OPEN-6. O0, the OneDrive probe, before the resolver:**
  - (A) the human prepares an online-only file on the reference machine, and the custodian runs a std-only probe that the worker writes under `spikes/`;
  - (B) the custodian runs it alone, if OneDrive is signed in on this PC.

  **Recommend (A).** It needs the human for about 10 minutes.
- **OPEN-7. A second open of an open identity:**
  - (A) refused by name, by an OS lock that is freed at a crash (ruling 2's lean);
  - (B) focus the existing window, which needs single instance, the human's typed word, in a later piece.

  **Recommend (A).**
- **OPEN-8. Lineage in 1c:**
  - (A) none written. The member is a named state; the reader handles ruling 4's full shape; a save over a kept lineage is refused by name;
  - (B) 1c writes the lineage now.

  **Recommend (A)** (the brief, `state/directives/B2-BRIEF-2026-10-07.md:158`).
- **OPEN-9. What Save trusts:**
  - (A) the client sends the workspace; the kernel validates it, and withholds the saved-here mark when the filter or style differs from what the history's steps reach, and says so;
  - (B) the kernel derives the filter and style from the history;
  - (C) as (A), with no comparison.

  **Recommend (A).**
- **OPEN-10. Filter clauses** (milestone 3):
  - (A) save the filter as applied only;
  - (B) save the clause list too.

  **Recommend (B)** if the clause model is stable at the step's base, else (A).
- **OPEN-11. The map view:**
  - (A) saved as a centre and a scale in the dataset's space, named per R9;
  - (B) not saved in version 1, so a reopen fits to the data.

  **Recommend (A).**
- **OPEN-12. Point and line style** (`state/directives/B2-BRIEF-2026-10-07.md:183`):
  - (A) the same §5a document whatever the geometry, as the canvas draws it;
  - (B) members per geometry kind.

  **Recommend (A).**
- **OPEN-13. Accepting a recovery offer:**
  - (A) adopt in place: lock, truncate to the kept prefix, continue; this restores to the latest step only, inside 1c;
  - (B) copy the prefix to a new record.

  **Recommend (A).** It is crash-idempotent.
- **OPEN-14. Integers above 2^53−1:**
  - (A) the ADR bounds `byte_size` and `footer_length`, and the reference build refuses a larger file;
  - (B) write them as decimal strings.

  **Recommend (A).**
- **OPEN-15. The Snapshot column:**
  - (A) reserved for stage 3, with its version step (the reader already refuses it);
  - (B) readable in version 1 and refused at open.

  **Recommend (A).**
- **OPEN-16. A first save into a folder that already holds a project:**
  - (A) refuse by name;
  - (B) ask to replace.

  **Recommend (A)** (§1: one project per folder).
- **OPEN-18. The session record at the first save:**
  - (A) copy it under a new header naming the project, then remove the `unsaved-` record, with recovery de-duplicating by first step id;
  - (B) rename the folder and keep the `not-yet-saved` header.

  **Recommend (A).**
- **OPEN-19. One strict reader for the session history too:**
  - (A) yes;
  - (B) the project file only.

  **Recommend (A).**
- **OPEN-20. The reserved-name list:**
  - (A) a declared list at its site, the concept from Go (not ported);
  - (B) a cap-std dependency (a new dependency and lock change, the human's word).

  **Recommend (A).**

(No OPEN-17: the `.spatial` check is evidence owed before acceptance, not an item of this form.)

# What I could not settle

- Whether the ledger commit 905a5cf6 changed any cited file (no shell); the custodian checks it by script.
- H1 to H6 rest on my reading of Windows semantics:
  - whether std's `is_symlink` treats every name-surrogate tag as a link;
  - whether a held handle counts for sharing only when it has read access;
  - DuckDB's share mode (the index's claim, unverified);
  - whether DuckDB reads `\\?\` paths;
  - whether OneDrive's download can be interrupted.
  O0, K-R5 and K-O1 discriminate them.
- The exact byte layout of the line-oriented form (indent unit, the space after the colon) is the human's to rule in the ADR. §2.10 item A4 names only what it must fix.
- Whether the project folder as an external destination makes Save project class 3 is argued in §2.1, not ruled.
- Milestone 4's paths are unknown until its form is drafted, so §2.14's ordering is conditional.
- The `.spatial` collision check is owed before acceptance and is not on record (the acceptance consult). It is outside this form.
- The budgets are estimates. 1b overran its §7 by 25%.
