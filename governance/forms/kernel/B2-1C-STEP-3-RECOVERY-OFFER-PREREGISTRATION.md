# B2 piece 1c step 3: the recovery offer after a crash, preregistration

*Committed by the custodian on 2026-11-23 from lead-data's draft (`state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-lead-data-draft.md`; the hand-back 33883 bytes, sha256 9fdeaf01b50a7324bd3ce8e04b59c1d81d8e7ec643bdfcaae183b7fb24a679cd): its text from the title to the line before its end mark, byte for byte, with this note put after the title. One cite is corrected, class 3: in §0, the cite of `engine/README.md` that starts at line 533 ends at line 567, that file's last line at 0bcf5434, where the draft wrote 568. The note after the end mark stays in the consult. Read the last amendment first.*

- **Path:** `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`. PLAN node `b2-piece-1c-step-3-recovery-offer`.
- **Authority:**
  - The human's message of 2026-11-23, item 3 (b), which the custodian quotes in the brief. It is not yet on main. The custodian pins it at filing.
  - The human's ruling of 2026-10-07: `state/directives/2026-10-07-b2-brief-and-evening-rulings.md:16-18` (item 2, first bullet; item 2's lead line is :15).
  - Round 70, OPEN-3 (A): `state/directives/2026-10-08-round-70-rulings.md:16-20`.
  - ADV-2026-11-23-15 item 7 (b) (not on main) and item 4.
  - The 1c form's step 3: `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, §2.6, §2.11 (step 3 rows), §2.12 S13–S15, §4 (step 3), §9, OPEN-13. Also its Amendment 32 (items 1–3) and Amendment 30 item 4 (a).
  - The node summary's two notes: ADV-2026-11-19-05 item 9 note 4 (`state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-05-the-reopens-p3a-1-amendment-37-as-drafted-with-item-9-p-10-option-ii-with-i-as-its-fallback.md:29`), and ADV-2026-11-16-20 item 7 carrying ADV-2026-11-16-16 item 2 (b).
  - **Reuse index**, run by the custodian in the reuse clone at 89bbac37 on 2026-11-23. Its output, byte for byte: `No prior art recorded for "crash recovery offer after an unclean exit". Research it before planning an implementation.` This is a **miss**. The draft researched no outside prior art; §0 says so.
- **Drafted by** lead-data on the custodian's brief of 2026-11-23, using the strongest model on the ground of architecture (ADV-2026-11-18-02 item 2). It was read at main `0bcf543452af79df6251cc7d86ab9f2cf644fcc2` in a detached read worktree. Every `path:line` below is at that commit. The drafter has no hashing tool, so the custodian adds each span's sha256 at filing.
- **Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Form and gating:** a full form with architect and reviewer gates (template §21a: wire, guarantee, ADR-adjacent). This form replaces the 1c form as the node's gate, per ADV-2026-11-23-15 item 7 (b). The PLAN edit is the custodian's.

## §0. Disclosure

- **Inputs read:**
  - the owner's indexes (`kernel/README.md:357-402`, `engine/README.md:533-567`);
  - the 1c form's step 3 text and Amendments 30–32, 37, 38 and 72–77;
  - ADR-036 §7, §9 and Amendments 1–4;
  - the directives named above;
  - `kernel/src/session_history.rs`, `kernel/src/project/store.rs`, `kernel/src/project/mod.rs`, `kernel/src/dataset_ref.rs`, `engine/src/descriptor.rs`;
  - `protocol/skp/SKP-V0.md` §8, §10–§12, and `protocol/skp/src/v0/commands.rs`;
  - the shell's `App.tsx`, `AdmissionPanel.tsx`, `project/`, `skp/` and `console/surfaceRegistry.ts`, and the src-tauri `commands.rs` and `lib.rs`;
  - `KNOWN-LIMITATIONS.md` items 43, 62 and 70.
- **Prior art.** No prior art was researched (the reuse miss above). The mechanism follows the 1c form's §2.6 and the kernel's own reader.
- **Hypotheses**, each with its discriminator:
  - **H1** (the drafter's reading of std's Windows implementation): on Windows, `File::try_lock` takes a mandatory lock over the whole file. While a handle holds it, a read through any other handle fails, even in the same process. That is why §2.3 reads a held history only through the handle that holds the lock. Discriminator: K-C3 and K-C6 on Windows CI.
  - **H2:** a file removed while its own locking handle is still open is deleted when that handle closes (std opens with share-delete on Windows). Discriminator: K-C2 on Windows.
- **No measurement.** Nothing reads the 5 GB fixture, so no drive confound arises.

## §1. What this form may and may not claim

- **May claim:** the three commands of §2.4; the reader and adopt paths of §2.3; the declared item of §2.5; the offer of §2.7, as asserted by §4's tests.
- **May not claim:**
  - any performance number or `docs/08` row;
  - that recovery "undoes" or "replays" anything. Accepting restores workspace state to the last kept step (ADR-036 §7; ADR-006 workspace class; the 1c form §2.1, OPEN-13 (A));
  - any wording the app shows. Every string here is a draft for the advisor at P6 (§2.8).
- **Wire change:** `skp/0.14` → `skp/0.15`, three new commands (the 1c form's OPEN-3 (A): one version per step).
- **ADRs:** none is amended. ADR-036 §9 and the 2026-10-07 ruling are applied as read. The architect checks the reading in §2.2.

## §2. The change

### 2.1 What step 3 does

Paraphrase of the rulings:
- After a crash, a session that never saved is offered back when the app next starts (round 70 OPEN-3 (A); ADR-036 §9).
- A project's history is offered at that project's next open (2026-10-07 item 2, first bullet).
- The offer names the dataset and the time. Declining clears it. The app says so if the data changed or cannot be found.
- Accepting adopts the record in place: take its lock, truncate it to the kept prefix, continue it (OPEN-13 (A)).
- The recovered steps enter the lineage only at Save project.

### 2.2 When an offer is made (the 1c form §2.6, kept)

- `unsaved-` records are listed at start.
- A project's record is listed at its open.
- The 2026-10-07 text says "next open". Round 70 and ADR-036 §9:206 say "when the application next starts" for a session that never saved. The 1c form reconciled the two this way, and this form keeps it.
- §9 asks the architect to confirm that ADR-036 §9 needs no amendment for the at-open case. If it does need one, that is the human's, as a question.

### 2.3 Kernel (`kernel/src/recovery.rs` new, `kernel/src/session_history.rs`, `kernel/src/lib.rs`)

- **Listing** (`recovery::list`, called through `StepRecorder`):
  - Reads `default_root()` in folder-name order and considers at most `MAX_RECOVERABLE_RECORDS` entries (§7). If more exist, the reply sets `more: true`.
  - A folder is considered only if its name matches `unsaved-` plus 32 lowercase hex, or 32 lowercase hex.
  - It skips the records this run holds, and any record whose `history.jsonl` `try_lock` gives `WouldBlock`: a live run's record is never offered (the 1c form §2.6).
  - Under its own lock it reads the history through the same handle, up to `MAX_SESSION_HISTORY_BYTES` + 1, then runs the existing `recover_bytes`. It never calls `recover(dir)`, which opens a second handle (H1). The lock is released after the read.
  - **Listed:** a record with at least one kept step and a header `actions` ≤ `ACTIONS`.
  - **Not listed, left in place:** a record with no kept step, a newer `actions`, or a refused `locations.json` (OPEN-4).
  - **At start:** only `unsaved-` records. An `unsaved-` record whose first kept step id equals the first kept step id of a `<hex>` record is skipped (ADR-036 Amendment 1 item 5; the 1c form §2.3). This reads only the header line and the first step line of each record, bounded by `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES`.
  - **At an open:** only `<hex>` for the project that `reopened()` bound to the given handle, and only if it holds a step after its last `saved-here` mark (OPEN-2).
  - **Each entry:**
    - the dataset's file name, from the record's `locations.json`, read by `store::read_locations` under its limits;
    - the last kept step's `at`;
    - the number of kept steps;
    - the data's state. `engine::SourceDescriptor::of(path)` is compared by `observed.components_differing_from(&descriptor)` (`engine/src/descriptor.rs:407`) against the header's reference. Any failure to read the descriptor gives `not-found` (OPEN-1).
- **`recover_session`:**
  - validates the record name and re-checks the listing conditions;
  - takes the lock and keeps it;
  - reads through that handle, `set_len`s to the kept prefix's byte length (the offset after the last kept line's LF), and syncs.
  - If `dataset` is null (an unsaved record): it opens the data at the `locations.json` path with the header's reference, through `host.begin_open(cancel_key)` and `host.open_under(..)` as `open_project` builds the request (`kernel/src/project/mod.rs:819-832`, read, not edited). Then it runs `DatasetRef::check`. No path crosses.
  - If `dataset` is a handle: the open must be bound by `reopened()` to the record's project, and must have no step and no record. Otherwise it refuses `skp.recoverable_record_not_for_this_open`.
  - It then pushes a `Record` into the recorder's state with:
    - `last_step` = the chain's parent;
    - `reached` computed from the kept lines;
    - holder `Open(name)` for an unsaved record, or `Project` with the open bound (as `reopened` binds).
  - Later steps chain to it. A normal end clears it (round 70, last bullet; `end_session`).
  - It returns the last `StepIntent` for each key, in the order filter, fillColor, outlineColor, fillOpacity, outlineWidth.
- **`discard_recoverable`:** validates and re-checks the record, takes the lock, removes `history.jsonl` and `locations.json` (H2), drops the handle and removes the folder. This mirrors `end_session`'s removal (`kernel/src/session_history.rs:439-448`).
- **`Open` gains its bound project**, set in `reopened()` (`kernel/src/session_history.rs:392-401`). No `pub` signature of `recover`, `Recovered`, `Header`, `Failure` or the existing `StepRecorder` methods changes.
- **Not touched:** `kernel/src/project/mod.rs`. If it must change, that is a stop (§5 I8).

### 2.4 Wire, `skp/0.15` (SKP-V0.md new §13–§15; §8 change log; §10.3)

**SKP-V0 text (draft):**
```
list_recoverable    { skp, dataset: DatasetHandle | null }
  → { records: [ { record, file_name, last_step_at, steps,
                   data: {state:"unchanged"} | {state:"not-found"}
                       | {state:"changed", components:[ObservedChange…]} } ],
      more: bool }
recover_session     { skp, record, cancel_key, dataset: DatasetHandle | null }
  → { dataset: DatasetHandle,
      opened: null | { session: SessionRef, check: ReopenCheck },
      steps: [StepIntent…] }
discard_recoverable { skp, record } → {}
```
- No reply carries a path. `file_name` is a file name only. It is cut and marked as `ReopenView`'s identifiers are (`protocol/skp/src/v0/commands.rs:831-834`).
- `opened` is present exactly when the kernel opened the data.
- **New codes:**
  - `skp.recoverable_record_locked` {record};
  - `skp.recoverable_record_unknown` {record};
  - `skp.recoverable_record_refused` {record, file, rule};
  - `skp.recoverable_record_not_for_this_open` {record}.
- **Reused codes:** the engine open refusals, the cancel codes and `skp.session_history_unwritable`.
- **§10.3 draft:** "Outside §14, nothing in SKP restores a step; nothing in SKP undoes or replays one." This is a draft sentence for the gates; it replaces `protocol/skp/SKP-V0.md:1305`'s.
- **Types in `protocol/skp/src/v0/commands.rs`:**
  - `ListRecoverableRequest`, `RecoverableRecord`, `RecoverableData`, `ListRecoverableResponse`;
  - `RecoverSessionRequest`, `RecoveredOpen`, `RecoverSessionResponse`;
  - `DiscardRecoverableRequest`.
  - All use `deny_unknown_fields`. Null members are required present (`key_present`, as `OpenProjectRequest` does, :790-793).
  - They reuse `DatasetHandle`, `SessionRef`, `ReopenCheck`, `ObservedChange` and `StepIntent`.
- **Codes in `error.rs`.** `SKP_VERSION` becomes `"skp/0.15"` (`protocol/skp/src/v0/mod.rs:136`).
- The literal moves in the 29 files that `git grep -l 'skp/0\.14' -- . ':!state' ':!governance' ':!docs' ':!site'` lists (125 occurrences at 0bcf5434).

### 2.5 The declared item (Amendment 30 item 4 (a); ADV-2026-11-16-16 item 2 (b); ADV-2026-11-16-20 item 7)

- `write_record`'s inline `locations.json` writer (`kernel/src/session_history.rs:503-513`: `to_string_lossy`, no bound) is replaced by `store::locations_to_bytes(reference.uri(), &std::path::absolute(ds.path())?)` (`kernel/src/project/store.rs:462-478`).
- The writer is a pure function under test. A refusal is `skp.session_history_unwritable` naming `locations.json`. The reader is `store::read_locations` (:483-502).

### 2.6 Note 4 (ADV-2026-11-19-05 item 9; the node summary)

- Step 3 reads only `sessions/`. It does nothing with an identity's folder in the machine store (`projects/<hex>/`, `open.lock`) that no project file names, and it removes none of them.
- `KNOWN-LIMITATIONS.md` item 62 (:510-512) already says the app removes none of these folders, and it stays as it is.
- Pruning would need a reader of project files across the disk. ADR-036 Amendment 1 item 3 says the end of a session clears none of them (paraphrase).

### 2.7 Shell

- **`frontends/shell/src/project/RecoveryOffer.tsx` (new):**
  - a non-modal list from `listRecoverable(null)` at mount, and an offer from `listRecoverable(handle)` after an `opened` reopen;
  - **Recover** runs through `runAdmitPath` (imported from `admission/AdmissionPanel.tsx`; that file is not edited), with an `admit` that calls `recover_session` and then `describe`;
  - `handleRecovered` (in `App.tsx`) applies the returned intents through the same transitions `handleReopened` uses (`frontends/shell/src/App.tsx:1215-1241`), with no `recordStep`;
  - **Discard** calls `discard_recoverable`;
  - a `not-found` entry offers Discard only;
  - an unanswered entry leaves the record;
  - a project's offer at its open shows after the reopen's notices.
- **`skp/client.ts` and `skp/types.ts`:** three wrappers and their types.
- **`console/surfaceRegistry.ts`:** three class-A rows (the 1c form §2.8).
- **`admission/formatRefusal.ts`:** the four codes.
- **The filter is restored as `filter.apply`.** Whether the filter editor's clauses are restored is for the worker to establish against `App.tsx` before code. If they are not, item 76 (§2.10) says so.

### 2.8 Strings: drafts for the advisor at P6

None of these is the human's or the advisor's wording. Each ships with the P6 placeholder marking until it is worded.

| Id | Draft | Where |
|---|---|---|
| R-S1 (the 1c form's S13) | "Unsaved changes from a session that did not close normally" | RecoveryOffer.tsx, list heading |
| R-S2 | "{file}, last change {time}" | each entry |
| R-S3 | "Recover" / "Discard" | each entry |
| R-S4 (S14) | "{file} has changed since then: {components}." | entry, `changed` |
| R-S5 (S15) | "{file} cannot be found, so these changes cannot be recovered. Discard removes them from this computer." | entry, `not-found` |
| R-S6 | "This project has changes that were not saved when the app last closed, last at {time}." | the offer at a project's open |
| R-S7 | "More unsaved sessions are kept than are shown here." | list footer, `more` |
| R-S8 | "These changes are open in another window of the app." | formatRefusal.ts, `…_locked` |
| R-S9 | "These changes can no longer be read." | formatRefusal.ts, `…_unknown` and `…_refused` |
| R-S10 | "These changes belong to another open of this project." | formatRefusal.ts, `…_not_for_this_open` |

`{components}` reuses the reopen's component words, which are merged at PR 346 under P6.

### 2.9 Seams and guarantees touched

- **Seams:**
  - `recover_bytes` → listing and adopt;
  - `StepRecorder` state → `recover_session`;
  - `Host::begin_open`/`open_under` → `recover_session` (null dataset);
  - `reopened()` → `list_recoverable(handle)`;
  - `SourceDescriptor::of` + `components_differing_from` → listing;
  - `store::locations_to_bytes`/`read_locations` → writer and reader;
  - SKP → src-tauri → client → `runAdmitPath`/`RecoveryOffer`.
- **Guarantees:**
  - ADR-036 §9: offered at next start; declining clears; a normal end clears; held under an exclusive lock while live; a record name authorises nothing;
  - §7: a restore is of workspace state;
  - Amendment 1 item 5;
  - Amendment 3 item 1 (no history replaced; unchanged by OPEN-2 (A));
  - SKP §12.3: no reply carries a path.

### 2.10 KNOWN-LIMITATIONS (drafts for the advisor; the custodian says which are the human's)

- **Item 43 (`KNOWN-LIMITATIONS.md:442`).** Its title and the clause "this version neither offers to recover it nor removes it" stop being true.
  - **Draft title:** "After a crash, the app offers the session's unsaved filter and style changes back the next time it starts, or when that project is next opened."
  - **Draft clause:** "the app offers it back, and Discard removes it; until you answer, it stays."
  - The title and that sentence are the human's approved text (the comment at :443). Whether the advisor may word them is a question (note).
- **Item 70 (:537).** **Draft:** "A project's session history that an earlier run left is offered back when the project is opened again only if it holds changes made after its last save; otherwise, or while the offer is unanswered, the later run's save shows the withheld mark until that folder is removed."
- **New item 76 (draft):**
  - A recovered session restores the applied filter and each style value, not the filter editor's clauses or the view (subject to §2.7's check).
  - A session whose data cannot be found can only be discarded, and no re-link is offered.
  - Sessions beyond the first 64 are offered at later starts.
- **Item 62:** unchanged (§2.6).

### 2.11 Scope and line budget

**Counting:** the counting command of the 1c form §2.11 (`governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:437` @ 0bcf5434). It runs against the held branch's head until that branch merges, then against `origin/main`. An overrun is class 8, and §7 is never edited.

| Group | Files | Ceiling |
|---|---|---|
| protocol | `protocol/skp/SKP-V0.md`, `protocol/skp/src/v0/{commands,error,mod}.rs` | 300 |
| conformance + fixtures | `protocol/skp/tests/conformance/fixtures/{requests-accept,refusals-at-deserialize,refusals-any-layer}.json` (new rows) | 200 |
| literal | the 29 files of §2.4 | 260 |
| kernel product | `kernel/src/recovery.rs` (new), `kernel/src/session_history.rs`, `kernel/src/lib.rs` | 650 |
| kernel tests | `kernel/tests/recovery.rs` (new), `kernel/tests/recovery_crash.rs` (new) | 700 |
| src-tauri | `frontends/shell/src-tauri/src/{commands,lib}.rs` | 100 |
| shell product | `frontends/shell/src/project/RecoveryOffer.tsx` (new), `src/App.tsx`, `src/skp/{client,types}.ts`, `src/console/surfaceRegistry.ts`, `src/admission/formatRefusal.ts` | 450 |
| shell tests | `src/project/RecoveryOffer.test.tsx` (new), `src/App.recover.test.tsx` (new), `src/skp/client.test.ts`, `src/console/surfaceCompleteness.test.ts` | 400 |
| e2e | `frontends/shell/e2e/recover.mjs` (new), `frontends/shell/e2e/README.md` (its entry) | 300 |
| records | `KNOWN-LIMITATIONS.md` (items 43, 70, 76), `frontends/shell/MANUAL-WALKTHROUGH.md` (one new Part) | 120 |
| **Total** | | **≤ 3,480, ≤ 50 files** |

**Paths shared with held pieces** (the custodian builds on the held branch, ADV-2026-11-23-15 item 4):

| Held piece | Shared paths |
|---|---|
| PR 356 | `frontends/shell/src-tauri/src/commands.rs` |
| PR 359 | `frontends/shell/src/console/surfaceRegistry.ts`, `frontends/shell/e2e/README.md` |
| PR 360 | `frontends/shell/src/admission/admitDataset.test.ts` (literal) |
| The relink branch | `protocol/skp/SKP-V0.md`, `protocol/skp/src/v0/commands.rs`, `KNOWN-LIMITATIONS.md` (other items), `frontends/shell/MANUAL-WALKTHROUGH.md` (other Parts) |

- `protocol/`: this piece follows the relink branch, at most one in flight.
- Avoided: `kernel/src/project/mod.rs` (PR 361), `kernel/README.md` (PR 350; the index comes after the merge), and `Cargo.lock` (PR 353).

### 2.12 Departures from the 1c form's step 3 (§2.6, §2.11, §2.12, §4, §9; Amendment 32 item 3 says "No section, ceiling, test or rule of step 3 changes": every row below is a change and is named here)

| # | What | 1c form | Here | Why |
|---|---|---|---|---|
| D1 | file | kernel product `session_history.rs`, `project/mod.rs` | `recovery.rs` (new), `session_history.rs`, `lib.rs`; not `project/mod.rs` | PR 361 holds `mod.rs`; the recorder owns the state |
| D2 | budget | protocol 260, literal 130, kernel 600/600, src-tauri 80, shell 350/350, records 100; ≤ 2,970, ≤ 60 files | §2.11; ≤ 3,480, ≤ 50 files | the literal is now in 29 files (125 occurrences); there are six more kernel tests, the declared item, and four shell files not listed in the 1c form |
| D3 | rule | the data's state "under `check`" at the list | descriptor comparison at the list, full `check` at accept | `DatasetRef::check` needs an opened `Dataset` (`kernel/src/dataset_ref.rs:321`); the list opens nothing (OPEN-1) |
| D4 | wire | `list_recoverable` takes the project at its open | takes a `DatasetHandle`; the kernel finds the bound project | no project id from the client; "a record name authorises nothing" (ADR-036 §9, paraphrase) |
| D5 | rule | (none) | a held history is read only through its own locked handle (`recover_bytes`, not `recover`) | H1 |
| D6 | rule | (none) | `MAX_RECOVERABLE_RECORDS` = 64 and `more` | an unbounded folder walk at start |
| D7 | rule | (none) | a project's record is offered only with a step after its last `saved-here` mark; records that cannot be offered are left in place | OPEN-2, OPEN-4 |
| D8 | test | §4's seven K-C tests | K-C1 to K-C7 kept with their mutations; K-C8 to K-C13 added | the declared item, D5 to D7, the end-clear rule |
| D9 | test | "no existing test is edited except for the version literal" | `surfaceCompleteness.test.ts`'s `expectedEight` (:203) becomes eleven commands | the registry test pins the command list |
| D10 | test | E-RECOVER's mutation: "the offer applied without the check" | the shell applies no returned steps | the e2e uses unchanged data, so that mutation would not fail it; the check's mutation is K-C5's |
| D11 | string | S13 to S15 | R-S1 to R-S10 (§2.8) | the offer at an open, the refusals and `more` |
| D12 | gate | the 1c form | this form (both gates) | ADV-2026-11-23-15 item 7 (b) |
| D13 | operator | OP6 in the 1c form's §9 Part | OP-R1 to OP-R4 here; OP6's move is the custodian's to record | OP6 needs step 3's code; the 1c form's Amendment 72 has step 2 waiting on OP1–OP6 |
| D14 | declared item | not in §2.6 (Amendment 30 item 4 (a)) | §2.5 | Amendment 32 item 3; ADV-2026-11-16-20 item 7 |

### 2.13 What step 3 needs from step 2

- **Merged and used:** `open_project`, `reopened()`, `handleReopened`, the reopen's P6 strings (PR 346). The code can be written against main today.
- **Unmerged:** P6's remaining strings, and step 2's operator Part (P0, OP1–OP5). Step 3 reads neither.
- The merge waits for step 2's node to be done (`depends_on`).

### 2.14 Portability (R3)

- **Owning boundary:** the kernel's session store.
- **Windows:** mandatory file locks (H1, H2). Built and tested on Windows CI.
- **macOS/Linux:** advisory `flock`, the same API. Tested where CI runs them. Hardware grades stay as the second-open form recorded them.
- No deferral beyond that.

## §3. Fixtures

No fixture file. Histories are written by each test under its own temp folder.

## §4. Tests (each committed and run red at a named commit before its code, then green; mutation, then the set it fails)

| Id | Test | Mutation | Fails |
|---|---|---|---|
| K-C1 | `a_crashed_unsaved_record_is_listed_with_its_dataset_and_time` (recovery_crash.rs) | list this run's records | K-C1 |
| K-C2 | `declining_removes_the_record` | removal skipped | K-C2 |
| K-C3 | `accepting_truncates_to_the_kept_prefix_and_later_steps_chain` (recovery_crash.rs) | `parent` null after adopt | K-C3 |
| K-C4 | `a_projects_record_is_offered_at_its_open_not_at_start` | listed at start | K-C4 |
| K-C5 | `the_offer_states_changed_or_not_found_data` | state always `unchanged` | K-C5 |
| K-C6 | `a_locked_record_is_never_offered` | no lock probe | K-C6 |
| K-C7 | `an_unsaved_record_moved_to_a_project_record_is_not_offered_twice` | no dedupe | K-C7 |
| K-C8 | `the_records_locations_writer_refuses_a_path_the_store_cannot_hold` (session_history.rs unit) | the inline lossy writer restored | K-C8 |
| K-C9 | `a_project_record_with_nothing_after_its_saved_mark_is_not_offered` | mark not considered | K-C9 |
| K-C10 | `a_record_that_cannot_be_offered_is_left_in_place` | such a record removed | K-C10 |
| K-C11 | `a_record_name_outside_the_two_shapes_is_refused` | validation skipped (`..\x`) | K-C11 |
| K-C12 | `recovering_into_an_open_that_has_a_step_is_refused` | step check skipped | K-C12 |
| K-C13 | `a_normal_end_after_recovery_clears_the_record` | adopted record not pushed to state | K-C13, K-C3 |
| P-1 | `recovery_commands_round_trip_and_refuse_unknown_or_missing_members` (protocol) | `deny_unknown_fields` dropped on `RecoverSessionRequest` | P-1 |
| T-1 | `the_three_recovery_commands_are_registered_and_run_off_the_main_thread` (src-tauri) | `discard_recoverable` not in `generate_handler!` | T-1 |
| S-1 | `the_offer_names_the_file_and_the_time` | time omitted | S-1 |
| S-2 | `discard_calls_the_kernel_and_drops_the_entry` | discard not called | S-2 |
| S-3 | `a_not_found_entry_offers_discard_only` | Recover shown | S-3 |
| S-4 | `recover_applies_the_steps_and_records_none` | intents sent through `recordStep` | S-4 |
| S-5 | `a_reopen_asks_for_its_projects_record` (App.recover.test.tsx) | no call after `opened` | S-5 |
| E-RECOVER | `e2e/recover.mjs`: the suite's own launch; open the fixture, apply a filter and a fill style; kill the process tree; start; the offer names the file name and a time; Recover; the filter and style read back through the existing test surface; one more style step's `parent` is the last kept id in `history.jsonl`; a second case, Discard, then the folder is gone | the shell applies no returned steps | E-RECOVER (S-4 too) |

- **Edited existing tests:** the version literal only, plus D9.
- Each mutation is applied, run, recorded by name with its commit, and reverted (template, mutation-observation wording).

## §5. Predictions · declared unchanged · invalidators

- **Predicted:** every §4 test is red before its code and green after. K-C3 and K-C6 pass on Windows (H1); K-C2 passes on Windows (H2).
- **Declared unchanged:**
  - the wire and behaviour of `open_project`, `save_project` and `record_step` (other than the version);
  - `recover`/`recover_bytes`'s results;
  - the ceilings `MAX_STEP_LINE_BYTES`, `MAX_HEADER_LINE_BYTES`, `MAX_SESSION_HISTORY_BYTES` and `LOCATIONS_LIMITS`;
  - ADR-036's text; items 62, 71, 72 and 73.
- **Invalidators:**
  - **I1:** a `pub` item named unchanged in §2.3 changes.
  - **I3:** an existing test is edited outside §4.
  - **I6:** a lockfile change or a new dependency.
  - **I7:** a shared path not in §2.11's table, or a second `protocol/` piece in flight.
  - **I8:** `kernel/src/project/mod.rs` or `admission/AdmissionPanel.tsx` needs an edit.
  - **I9:** H1 is false and the design must read through a second handle.
- **Falsified if** an offer can be made for a record another live run holds.

## §6. Instruments

Assertions only: typed outcomes, file presence and byte lengths, `parent` ids. No measurement.

## §7. Declared values and ceilings

- **`MAX_RECOVERABLE_RECORDS = 64`**, at its site in `recovery.rs`. It bounds the records considered per listing (a draft value; the gates check it).
- **Unchanged:** `MAX_HEADER_LINE_BYTES`, `MAX_STEP_LINE_BYTES` (the bound on the dedupe read), `MAX_SESSION_HISTORY_BYTES` (the bound on the adopt read), `LOCATIONS_LIMITS` (the reader and the writer), `FOOTER_DESCRIPTOR_MAX_BYTES` (the bound on the descriptor read).
- **Budgets:** §2.11.

## §8. Block-on-sight

The 1c form's §8 items 1–15 apply, by reference, and in addition:

1. a path in any reply;
2. a record offered or adopted while another run holds its lock;
3. the restore recording a step, or writing a mark;
4. "undo", "undoable" or "replay" said of recovery anywhere;
5. a held history read through a second handle;
6. any edit to `project/mod.rs`, `AdmissionPanel.tsx`, a manifest or `Cargo.lock`;
7. an R-S string without the P6 marking;
8. a store-module message stating a shell consequence (the operator-visible text rule);
9. a removal of anything under `projects/`.

## §9. Gates

- **Architect.**
  - §1 and §8 one by one.
  - The seam rule for each §2.9 seam against its real interface, with the e2e test (E-RECOVER); the caller rule for each new `pub` item.
  - ADR-006 class and ADR-036 §7/§9/Amendments 1 and 3 against §2.
  - §2.2's reading (no ADR-036 amendment); the departures of §2.12; the quote rules.
- **Reviewer.**
  - The full diff: `origin/<held branch>...HEAD` until that branch merges, then `origin/main...HEAD`.
  - Each wire change on its own.
  - Each §4 mutation observed; the lock diff empty; §2.11's counts.
- **Suites** (the 1c form's §9 list, by reference):
  - `cargo test --locked --features spatial-engine/fixture`, fmt and clippy;
  - the shell's `npm run verify`; the src-tauri tests; every e2e suite including `recover.mjs`;
  - the scripts, hooks and evidence node tests; the verify scripts; CI.
- **Operator:** a new walkthrough Part, with the letter after the last on the base. The logs start blank.
  - OP-R1: crash, start, offer, Recover.
  - OP-R2: Decline, then the next start offers nothing.
  - OP-R3: crash with a saved project, then reopen and the offer.
  - OP-R4: data moved, then not found, Discard only.
  - The felt verdicts are the human's.
- **Merge:** after the v0.2 tag; after step 2's node is done; after the held branch and PRs 356, 359, 360 and 361. A merge commit, never a squash.

## OPEN items (to the advisor in one message, ADV-2026-11-23-15 item 8; the gate does not wait)

- **OPEN-1. Where the data's state is computed.**
  - (A) The descriptor at the list, the full `check` at accept. The list reads up to the footer of each listed record's file, which can start an online-only file's download (item 75's kind; disclosed in item 76).
  - (B) No state at the list; the state at accept only.
  - **Recommend (A):** round 70 places "the app says so" in the offer.
- **OPEN-2. A project's record with no step after its last `saved-here` mark.**
  - (A) Not offered; item 70 stays for that case.
  - (B) Offered with Discard only.
  - **Recommend (A):** (B) clears a history another run left, which touches ADR-036 Amendment 3 item 1, the human's words, and would then be the human's.
- **OPEN-3. How the time is shown.**
  - (A) Local date and time, formatted by the OS, from the step's UTC `at`.
  - (B) UTC.
  - **Recommend (A).**
- **OPEN-4. Records that cannot be offered** (no kept step, a newer `actions`, a refused `locations.json`).
  - (A) Not listed, left in place, disclosed in item 76.
  - (B) Listed with Discard only.
  - **Recommend (A):** nothing can be named for them.

## §10. Amendments

*Opens empty; append-only.*

## Amendment 1 — 2026-11-23 — at the first commit: the authority on main, the node's gate, the span hashes, the OPEN items

*Written by the custodian at the form's first commit, before any code and before any gate. References and hashes only.*

1. **Authority on main.** The human's message of 2026-11-23 is filed at `state/directives/2026-11-23-the-humans-message-never-idle-product-first-what-to-build-now-the-pauses-lifted-for-product-pieces-what-does-not-change.md`, and the advisor's ruling ADV-2026-11-23-15 at `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-the-humans-message-filed-the-relink-built-now-on-three-held-heads-two-forms-now-the-gap-pieces-the-sitting-hour.md`, both in commit 181e8894670c6bac49e3df78e659d63005c2b736. The draft is filed at `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-lead-data-draft.md`.
2. **The node's gate.** In the same commit the PLAN node `b2-piece-1c-step-3-recovery-offer` names this form as its gate, in place of `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` (ADV-2026-11-23-15 item 7 (b)). The node stays blocked by its dependency on `b2-piece-1c-save-and-reopen`; the form and its gates do not wait for it.
3. **Span hashes.** Every `path:line` cite above is read at 0bcf543452af79df6251cc7d86ab9f2cf644fcc2. Each entry below names the file and lines a cite is read as, the sha256 of those lines at that commit (each line with its LF, computed by script), and the sections that cite it. A short name is read as the one tracked file it names; a bare `:n` as the file named before it in the same passage; an entry marked (r) was read by the custodian against the file its sentence names.

- `state/directives/2026-10-07-b2-brief-and-evening-rulings.md:16-18` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:bab465769aecf0a0cb64c01ebd9d47853bb3958f558659af03256fe8d5548a2e — the header
- `state/directives/2026-10-07-b2-brief-and-evening-rulings.md:15` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7dbd34d5189e88dcfbdb8fb931ba01642eafac3e98117c46715dba315022d608 — the header; as written `:15`
- `state/directives/2026-10-08-round-70-rulings.md:16-20` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c473dc92a82159a1ed8c527be10ae96ceec49de3cc745a47ed9c7591fef7c1a4 — the header
- `state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-05-the-reopens-p3a-1-amendment-37-as-drafted-with-item-9-p-10-option-ii-with-i-as-its-fallback.md:29` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:318fe5d5fcb9b0fb03b330d9af6c169beb8fb54c3181f3317381dfe74bc0143a — the header
- `kernel/README.md:357-402` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:53bd3757c0d518199d51e2849da68d7a19f1a588000643894a2bfad7dd88432f — §0
- `engine/README.md:533-567` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:898f6c3ca6e0ba867a1a6e4c26d29a229ccb2c5c64e1dba4dfa67779db2f5c97 — §0 (r)
- `engine/src/descriptor.rs:407` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a38c5c293ab65fc20bbb509a42947b6fcf12a35bc3cceffc78d09c7f5455d38c — §2.3
- `kernel/src/project/mod.rs:819-832` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:38cfbb05faebcda36b959171e43ecaa9b58f53edbf78449249048c6240749041 — §2.3
- `kernel/src/session_history.rs:439-448` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:482d927f1974e8a11d09bc34b56b8143da61b5341739c9203193e14e72dfcdba — §2.3
- `kernel/src/session_history.rs:392-401` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5fdbaaa56926a6618c7c94e9f9b84489c8e2f0dc6521de097d1fcab85baa8f92 — §2.3
- `protocol/skp/src/v0/commands.rs:831-834` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:66963733ecee3ac6e34e0719c8ba25812e1578ef2016fb14ddffb7164027d5c6 — §2.4
- `protocol/skp/SKP-V0.md:1305` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:2f8dbe73f0ffd08fee5cb230d871511cbdc787c42d2e3fe25d50a09604d58560 — §2.4
- `protocol/skp/src/v0/commands.rs:790-793` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5c929128af2c0db9c5a9977318f396762d83f98519b01b69282d5ff0454fa722 — §2.4; as written `:790-793` (r)
- `protocol/skp/src/v0/mod.rs:136` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:882a5865fce789fe6efebc9b9ae98c9c0436eea3cd8c78f6137e8b0e6b4112fc — §2.4
- `kernel/src/session_history.rs:503-513` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8d2de56c1da36141a3563a70b76eadf30183e73ed96987eaa2c36e73055c9b64 — §2.5
- `kernel/src/project/store.rs:462-478` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c4a4de7b31ff26a59e31efe85f5f84b0d604053b225d3b966eb978436967579f — §2.5
- `kernel/src/project/store.rs:483-502` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:db0afb1edd47818dbcfbb4984d25b4c98ac85452c2730b05d371f85ca8603057 — §2.5; as written `:483-502`
- `KNOWN-LIMITATIONS.md:510-512` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ff9974b573dc290243bf1564c71c6c5d0f3a5d56036c015ecb54ade06be9be61 — §2.6; as written `:510-512` (r)
- `frontends/shell/src/App.tsx:1215-1241` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1e6e5ed0ce11ea4779ed3a5760c2e613834a78ccf41369dfc5c06944014c3268 — §2.7
- `KNOWN-LIMITATIONS.md:442` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:96df2ec43e72d89699ec1eaae18425623e0a0359ffa14c09c58185d517ff4805 — §2.10
- `KNOWN-LIMITATIONS.md:443` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:974cc0c5a91e63bb69f9407a034d1cf5aeeab58cb491e9074c444e228ffe926c — §2.10; as written `:443`
- `KNOWN-LIMITATIONS.md:537` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c192d2327f260e48a997c33c5f96cffffe54485bd2e7ec09226f86f780606dc7 — §2.10; as written `:537`
- `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:437` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1ae5e7abc6007cc1de381f529c15b4cf62b9442f286ac96b40cf742d3d181f6d — §2.11
- `kernel/src/dataset_ref.rs:321` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:17d2198b9d2d046404cc7f15186d2161c9cf2a0fa7752b6a21c7314b77b0ff35 — §2.12
- `frontends/shell/src/console/surfaceCompleteness.test.ts:203` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:2249b5b561f0bda957e6b57b73c03ec5b670ab743ea09d0164fd5d9747eec804 — §2.12; as written `:203` (r)

4. **OPEN items.** OPEN-1 to OPEN-4, and the note's three questions (an ADR-036 amendment for the offer at an open; who words item 43; OP6 moved here, D13) go to the advisor in one message (ADV-2026-11-23-15 item 8). Their answers come as later amendments; the gates do not wait for them.

Read the last amendment first.

Nothing above is edited.
