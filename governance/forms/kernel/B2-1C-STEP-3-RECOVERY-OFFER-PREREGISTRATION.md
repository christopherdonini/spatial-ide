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

## Amendment 2 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 1 (FAIL): C-1 to C-7, E-1, E-2 and the documentation findings

*Post-result amendment: written after the outcome of the architect's form gate, attempt 1 (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect.md`, FAIL), was seen. Lead-data drafted it before any code. Finding ids (C-, E-, N-) are that report's. Every `path:line` in this amendment is read at 96f56d28206e74d6992156f3f7735483d8063fa8. The drafter has no hashing tool, so the custodian adds each span's sha256 at filing, as Amendment 1 item 3 does. Each Old text below occurs once in the form above this amendment. Where an Old text is part of a line, only that part is replaced. Nothing is ruled here: OPEN items and strings go to the advisor (ADV-2026-11-23-15 item 8).*

1. **The drafter's recommendations on OPEN-1 (C-7) and OPEN-4 (C-4). They are not rulings.** The form below is sound under them.
   - **OPEN-1: recommend (C), the gate's middle way, added below as an option.** At the list, the kernel checks only that the data path exists, by metadata. The full `check` runs at accept and is shown (C-6). `SourceDescriptor::of` takes no cancel token and reads the file's tail (`engine/src/descriptor.rs:102-134`), so a `cancel_key` on the list could act only between records, never inside the read that waits. Under (C) the list waits on no byte of the data, and accept is already cancellable through `begin_open`/`open_under`.
     - *Under (A):* the gate's C-5 text and `kernel/src/dataset_ref.rs` replace item 2's C-5 text; `list_recoverable` gains `cancel_key` and the cancel codes; D3, K-C5 and R-S4's place stay as filed; the gate's N-10 download bullet replaces item 6's; K-C17 drops.
     - *Under (B):* entries carry no `data`, and K-C5 and K-C17 drop.
   - **OPEN-4: recommend (B).** Under (A), a record that cannot be offered never leaves, so any bound over records can starve (C-4 (ii)). Under (B), each record can leave by the user's Discard, and nothing is removed unasked.
     - *Under (A):* these drop: the `cannot-be-offered` state, the nullable members, R-S11, R-S12, K-C15 and S-8. Such records are skipped uncounted, under a second read bound whose starvation case item 76 names. K-C6's and K-C24's mutations then pass on Windows: each is observed on a macOS or Linux runner, with its Windows pass case named in its row (E-2).

2. **Correctness.**

**C-1** (the gate's texts).
````text
- **`Open` gains its bound project**, set in `reopened()` (`kernel/src/session_history.rs:392-401`). No `pub` signature of `recover`, `Recovered`, `Header`, `Failure` or the existing `StepRecorder` methods changes.
````
````text
- **`Open` gains `reopened_as: Option<ProjectUri>`**, set in `reopened()` (`kernel/src/session_history.rs:392-401`) on every reopen. `bound`, `holder()`, `adopt_project` and `reopened()`'s binding rule do not change. An open whose project's record another run left therefore stays unbound until `recover_session` binds it, and its steps before that go to a record of its own (item 70). No `pub` signature of `recover`, `Recovered`, `Header`, `Failure` or the existing `StepRecorder` methods changes.
````
````text
**At an open:** only `<hex>` for the project that `reopened()` bound to the given handle, and only if it holds a step after its last `saved-here` mark (OPEN-2).
````
````text
**At an open:** only `<root>/<project hex>`, read by name and not by walking, for the project whose reopen gave the handle (`reopened_as`), and only if it holds a step after its last `saved-here` mark, or holds steps and no mark (OPEN-2).
````
````text
If `dataset` is a handle: the open must be bound by `reopened()` to the record's project, and must have no step and no record. Otherwise it refuses `skp.recoverable_record_not_for_this_open`.
````
````text
If `dataset` is a handle: the open's `reopened_as` must be the record's project, the header's dataset URI must equal the open's, and the open must have no step, no record and no binding. Otherwise it refuses `skp.recoverable_record_not_for_this_open`.
````
Checked against the code: `bound` is set only when this run holds the record (`kernel/src/session_history.rs:394-400`). `holder()` follows `bound` (:147-152). `adopt_project` returns early on a bound open (:357). In the handle arm the header's URI is the project file's, which `reopened()` gives the open (:397), so the equality holds for the project's own record.

**C-2** (the gate's text).
````text
holder `Open(name)` for an unsaved record, or `Project` with the open bound (as `reopened` binds).
````
````text
holder `Open(name)` for an unsaved record, or `Project` with the open bound (as `reopened` binds). In both cases the open's dataset identity is set to the header's dataset URI before the reply, as `reopened()` sets it, so every later step's `data.dataset` and a later save carry the header's (ADR-036 Amendment 2). A header that does not name exactly one dataset is refused as `skp.recoverable_record_refused`.
````
Checked against the code: `State::open` mints a fresh URI (`kernel/src/session_history.rs:176-184`), and `record_step` writes the open's URI into each step (:307-308, :325-326).

**C-3** (the gate's texts).
````text
No reply carries a path. `file_name` is a file name only. It is cut and marked as `ReopenView`'s identifiers are (`protocol/skp/src/v0/commands.rs:831-834`).
````
````text
No reply carries a path, under SKP §12.3's rule and its one exception (`protocol/skp/SKP-V0.md:1434`): a reused engine open refusal keeps the engine's own message, which may name the path the engine was given. `file_name` is a file name only. It is cut and marked as `ReopenView`'s identifiers are (`protocol/skp/src/v0/commands.rs:831-834`).
````
````text
SKP §12.3: no reply carries a path.
````
````text
SKP §12.3: no reply carries a path, but for its engine-message exception.
````
````text
1. a path in any reply;
````
````text
1. a path in any reply other than an engine refusal's own message (SKP §12.3);
````

**C-4** (C-4 (i), and (ii) through OPEN-4 (B); the walk's rules are in item 4).
````text
Reads `default_root()` in folder-name order and considers at most `MAX_RECOVERABLE_RECORDS` entries (§7). If more exist, the reply sets `more: true`.
````
````text
Reads the folder names under `default_root()` in name order. At a start, only `unsaved-` records count toward `MAX_RECOVERABLE_RECORDS` (§7). A record counts when it is listed, in any state, and a folder skipped under Amendment 2 item 4 does not count. `more` is `true` when an `unsaved-` folder is left unexamined at the bound, or is not listed because the dedupe could not be completed. At an open, one folder is read by name and none is walked.
````
````text
**Not listed, left in place:** a record with no kept step, a newer `actions`, or a refused `locations.json` (OPEN-4).
````
````text
**Listed with Discard only** (`cannot-be-offered`, OPEN-4 (B)): a record with no kept step (`no-step`), a header `actions` over `ACTIONS` (`later-version`), or a refused `locations.json` (`locations-refused`). A history that cannot be locked or read, for any reason but `WouldBlock`, is `no-step`. Listing removes nothing: such a record stays until Discard, and `recover_session` refuses it as `skp.recoverable_record_refused`.
````
````text
This reads only the header line and the first step line of each record, bounded by `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES`.
````
````text
This reads only the header line and the first step line of each `<hex>` record, bounded by `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES`, and of at most `MAX_DEDUPE_RECORDS` such records (§7, Amendment 2 item 4). A `<hex>` folder with no history, or an empty one, is not read and does not count. Past that bound the dedupe cannot be completed, and no `unsaved-` record is listed at that start. This fails closed, because ADR-036 Amendment 1 item 5 offers the project's record only.
````
Item 76 (the gate's text):
````text
Sessions beyond the first 64 are offered at later starts.
````
````text
At most 64 unsaved sessions are listed at a start; the others are listed at a later start, as listed ones are recovered or discarded.
````

**C-5** (under OPEN-1 (C) the listing reads no observation, so no accessor and no `kernel/src/dataset_ref.rs` edit is needed).
````text
the data's state. `engine::SourceDescriptor::of(path)` is compared by `observed.components_differing_from(&descriptor)` (`engine/src/descriptor.rs:407`) against the header's reference. Any failure to read the descriptor gives `not-found` (OPEN-1).
````
````text
the data's state, from metadata alone (OPEN-1 (C)): `std::fs::metadata` of the path `locations.json` records gives `found`, and any failure gives `not-found`. No byte of the data file is read at the list (`SourceDescriptor::of` opens and reads the file's tail, `engine/src/descriptor.rs:122-134`, so it is not called there). The reference's observation is not read at the list either: the comparison runs only inside `DatasetRef::check` at accept (`kernel/src/dataset_ref.rs:321-322`), and its result reaches the user through §2.7.
````
Also, in §2.12's D3 row:
````text
descriptor comparison at the list, full `check` at accept
````
````text
existence by metadata at the list, full `check` at accept, shown (§2.7)
````
````text
the list opens nothing (OPEN-1)
````
````text
the list opens and reads nothing of the data (OPEN-1 (C); C-7)
````
And in §2.9:
````text
`SourceDescriptor::of` + `components_differing_from` → listing;
````
````text
`std::fs::metadata` → listing; `DatasetRef::check` → `recover_session`'s `opened.check` → `handleRecovered`;
````

**C-6.**
````text
applies the returned intents through the same transitions `handleReopened` uses (`frontends/shell/src/App.tsx:1215-1241`), with no `recordStep`;
````
````text
applies the returned intents through the same transitions `handleReopened` uses (`frontends/shell/src/App.tsx:1215-1241`), with no `recordStep`. When `opened.check` names a difference, it shows R-S4 where the reopen's notices show (`setReopenNotices`, `frontends/shell/src/App.tsx:1238`). R-S4's `{components}` are the check's `observed` words, then its `admission` words, joined as the reopen's `partsOf` joins them (`frontends/shell/src/project/reopenNotices.ts:45-50`). That file is not edited;
````
In §2.8, R-S4's place:
````text
| entry, `changed` |
````
````text
| after Recover, when `opened.check` names a difference (§2.7) |
````

**C-7: the wire and OPEN-1.**
````text
{ record, file_name, last_step_at, steps,
````
````text
{ record, file_name: string | null, last_step_at: string | null, steps,
````
````text
data: {state:"unchanged"} | {state:"not-found"}
````
````text
data: {state:"found"} | {state:"not-found"}
````
````text
| {state:"changed", components:[ObservedChange…]} } ],
````
````text
| {state:"cannot-be-offered", reason:"no-step"|"later-version"|"locations-refused"} } ],
````
Added to §2.4 after the bullet that begins "`opened` is present":
- `file_name` is null only for a `cannot-be-offered` record whose `locations.json` is refused. For `cannot-be-offered`, `last_step_at` is null and `steps` is 0.
- `list_recoverable` is not cancellable and does not report progress, like `record_step` (`protocol/skp/SKP-V0.md:1309`). It reads no byte of a data file, only the machine's own store, within §7's and Amendment 2 item 4's bounds, and it calls `metadata` once on each listed record's data path.

OPEN-1:
````text
(B) No state at the list; the state at accept only.
````
````text
(B) No state at the list; the state at accept only.
  - (C) At the list, only whether the data path exists, by metadata, with no byte of the data read; the full `check` at accept, shown (§2.7).
````
````text
**Recommend (A):** round 70 places "the app says so" in the offer.
````
````text
**Recommend (C)** (Amendment 2 item 1): the list waits on no byte of the data, and every change is still said, at accept.
````
OPEN-4:
````text
**Recommend (A):** nothing can be named for them.
````
````text
**Recommend (B)** (Amendment 2 item 1): under (A) such records never leave and can starve the bound (C-4).
````

3. **Evidence.**
   - **E-1.** K-C14 and S-6 are added as the gate names them (item 5). In D10:
````text
the check's mutation is K-C5's
````
````text
the check at accept is pinned by K-C14 and its showing by S-6
````
   - **E-2.** The new mutation fails on Windows: under OPEN-4 (B), a history the listing cannot read is listed `cannot-be-offered`. K-C6's lock is held by a `File` the test opens and locks itself, so the rule that skips this run's own records cannot hide the mutation.
````text
| no lock probe | K-C6 |
````
````text
| the lock probe removed: the listing reads the history through its own handle with no `try_lock` (Windows: the read fails, H1, and the record is listed `cannot-be-offered`; if H1 is false, it is listed with its steps; macOS/Linux: listed with its steps); K-C6 asserts the record absent in every state | K-C6 |
````

4. **The walk and the locks** (C-4, C-7, E-2, N-11, N-13). This is added to §2.3 after N-13's list (item 6).
   - **At a start, each `unsaved-` folder in name order:**
     - A record this run holds is skipped before any lock is tried.
     - A folder whose `history.jsonl` is absent or 0 bytes by its metadata is skipped and not locked. A history is created empty and locked before its header is written (`kernel/src/session_history.rs:516-532`), so an empty one may be another run's between those two steps.
     - `WouldBlock` skips the folder.
     - Any other failure to lock or read gives `cannot-be-offered` (`no-step`).
     - Then the dedupe runs, then the bounded read. The record is then listed, and it counts. Skipped folders do not count.
   - **The dedupe** reads at most `MAX_DEDUPE_RECORDS` `<hex>` histories that exist and are not empty. Past that bound, or when a `<hex>` history is held by a lock (N-13), no `unsaved-` record is listed at that start, and `more` is `true`.
   - **`recover_session`, in order:**
     1. validate the record name;
     2. refuse a record this run holds as `…_unknown` (N-11);
     3. lock and read;
     4. for a null `dataset`: open the data and run `check`; for a handle: check the C-1 conditions;
     5. `set_len` to the kept prefix, seek to its end, sync;
     6. set the identity (C-2), bind, and push.
     - A refusal or cancel before step 5 drops the handle and leaves the history byte for byte.
   - **`discard_recoverable`** refuses a record this run holds as `…_unknown`, and a `WouldBlock` as `…_locked`.
   - **§7, added before any code** (no §7 line is edited): **`MAX_DEDUPE_RECORDS = 256`**, at its site in `recovery.rs`. It bounds the `<hex>` histories a start's dedupe reads, each to its header and first step line. The value is a draft; the gates check it.
   - **§0, added after H2:** "**H3:** on macOS and Linux, std's `File::try_lock` is an advisory `flock` held per open file description, so a second open of the same file in the same process meets `WouldBlock`. Discriminator: K-C21 and K-C22 on a macOS or Linux runner."
   - **§5, added after "Predicted":** K-C6, K-C21 and K-C22 fail under their mutations on Windows and on macOS/Linux (H3).
   - **§8, added:**
     - 10\. a byte of a data file read by `list_recoverable`;
     - 11\. an `unsaved-` record listed at a start whose dedupe was not completed;
     - 12\. a lock taken by the listing on an empty history.
   - **§2.7:**
````text
a `not-found` entry offers Discard only;
````
````text
a `not-found` or `cannot-be-offered` entry offers Discard only;
````
   - **§2.8, rows added at the end of its table** (P6 drafts):
     - | R-S11 | "These unsaved changes can no longer be read. Discard removes them from this computer." | entry, `cannot-be-offered` (`no-step`, `locations-refused`) |
     - | R-S12 | "These unsaved changes were made by a later version of the app, which this version cannot recover. Discard removes them from this computer." | entry, `cannot-be-offered` (`later-version`) |

5. **Tests.**

**Renamed row, K-C5:**
````text
| `the_offer_states_changed_or_not_found_data` | state always `unchanged` | K-C5 |
````
````text
| `the_offer_states_found_or_not_found_data` | state always `found` | K-C5 |
````

**E-RECOVER** (the restart the gate names):
````text
kill the process tree; start;
````
````text
kill the process tree; start again on the killed run's data folder, once its port is free;
````

**Rows added at the end of §4's table.** The file is `kernel/tests/recovery.rs` unless a row names another.

| Id | Test | Mutation | Fails |
|---|---|---|---|
| K-C14 | `accepting_runs_the_full_check_and_returns_its_differences` | `check` skipped at accept | K-C14 |
| K-C15 | `a_record_that_cannot_be_offered_is_listed_with_discard_only_and_refused_at_recover` | such a record not listed | K-C15 |
| K-C16 | `unsaved_records_are_listed_beside_more_than_64_project_records` (65 `<hex>` histories, each a header and a step) | every examined folder, `<hex>` included, counted toward `MAX_RECOVERABLE_RECORDS` | K-C16 |
| K-C17 | `the_listing_reads_no_byte_of_the_data_file` (data replaced by a 0-byte file: `found`) | the state taken from `SourceDescriptor::of` (it refuses a file under 8 bytes, `engine/src/descriptor.rs:124-129`) | K-C17 |
| K-C18 | `a_step_after_recovery_carries_the_headers_dataset_identity` | the open's identity not set at adopt | K-C18 |
| K-C19 | `recovering_at_a_projects_open_binds_the_open_and_its_next_step_continues_that_record` (`recovery_crash.rs`) | the open not bound at adopt | K-C19 |
| K-C20 | `recovering_a_projects_record_into_an_open_of_another_project_is_refused` | `reopened_as` not compared | K-C20 |
| K-C21 | `a_second_recover_of_a_record_this_run_holds_is_refused_as_unknown` | the held check moved after the lock probe | K-C21 |
| K-C22 | `a_refused_open_at_accept_leaves_the_record_byte_for_byte_and_listed` | the history handle kept after the refused open | K-C22 |
| K-C23 | `past_the_dedupe_bound_no_unsaved_record_is_listed_and_more_is_set` (257 `<hex>` histories) | the dedupe bound not applied | K-C23 |
| K-C24 | `a_folder_with_no_or_an_empty_history_is_not_listed` | the empty-history check removed (the empty one is listed `cannot-be-offered`) | K-C24 |
| S-6 | `recover_shows_the_check_it_returns` (`App.recover.test.tsx`) | check not shown | S-6 |
| S-7 | `an_entry_leaves_the_list_once_recover_succeeds` | the entry kept after Recover | S-7 |
| S-8 | `a_cannot_be_offered_entry_offers_discard_only` | Recover shown for `cannot-be-offered` | S-8 |

- **Red before the fix.** Each K-C row calls `list_recoverable`, `recover_session` or `discard_recoverable`, and none of these exists at the red commit. S-6 to S-8 render `RecoveryOffer` or `handleRecovered`, and neither exists. P-1 also round-trips the `cannot-be-offered` state and the null members; its mutation is unchanged.
- **Known pass cases.** None is known for any of these mutations. K-C21 and K-C22 rest on H1 or H3 only for the lock, and LockFileEx refuses a second handle on Windows.

6. **Documentation.**
   - **N-1** (the gate's words):
````text
This mirrors `end_session`'s removal (`kernel/src/session_history.rs:439-448`).
````
````text
It removes what `end_session` removes (`kernel/src/session_history.rs:439-448`), in another order: `end_session` drops the handle first, and here the files are removed while the handle holds the lock (H2), so no other run can take it in between.
````
   - **N-2.** The gate's words assume OPEN-1 (A), so they are adapted to (C):
````text
K-C1 to K-C7 kept with their mutations; K-C8 to K-C13 added | the declared item, D5 to D7, the end-clear rule
````
````text
K-C1 to K-C7 kept; K-C5 renamed `the_offer_states_found_or_not_found_data`, its mutation changed from "`check` skipped" to "state always `found`", because the list no longer runs `check` (D3), and "`check` skipped" moves to K-C14 at accept; K-C8 to K-C24 and S-6 to S-8 added | the declared item, D3, D5 to D7, the end-clear rule, Amendment 2
````
   - **N-3:**
````text
"no existing test is edited except for the version literal"
````
````text
"No existing test is edited, except for the version literal."
````
   - **N-4:** rows added after D14:
     - | D15 | wire | §2.2 names one new code for step 3, `recoverable_record_locked` | four new codes (§2.4) | the unknown, refused and not-for-this-open cases of §2.3 |
     - | D16 | rule | (none) | the walk's order, the empty-history rule and `MAX_DEDUPE_RECORDS`, failing closed | C-4, N-13; Amendment 2 item 4 |
   - **N-5:**
````text
the wire and behaviour of `open_project`, `save_project` and `record_step` (other than the version);
````
````text
the wire and behaviour of `open_project` and `save_project` (other than the version), and of `record_step` other than the version and §2.5: a first step whose dataset path the store's writer refuses (not absolute, not valid Unicode, or over 4,096 bytes) is now refused as `skp.session_history_unwritable` naming `locations.json`, where the inline writer wrote it before, lossily and with no bound;
````
   - **N-6** (the gate's words; the conformance row carries item 7's ceiling):
````text
The literal moves in the 29 files that `git grep -l 'skp/0\.14' -- . ':!state' ':!governance' ':!docs' ':!site'` lists (125 occurrences at 0bcf5434).
````
````text
The literal moves in the 29 files that `git grep -l 'skp/0\.14' -- . ':!state' ':!governance' ':!docs' ':!site'` lists (125 occurrences at 0bcf5434 and at 96f56d28). `skp/0.15` is the next unused literal at 96f56d28; the worker re-checks it against main and every base head before the bump's commit, and takes the next unused one if it has moved. In the same commit: SKP-V0 §1 and §4 count eleven commands; §8 gains the new version's entry with its full field set; and the version-refusal row that names the next version as unsupported (`protocol/skp/tests/conformance/fixtures/refusals-any-layer.json` and the sentence on it in `protocol/skp/tests/conformance/README.md`) moves to the literal after the new one.
````
````text
`protocol/skp/tests/conformance/fixtures/{requests-accept,refusals-at-deserialize,refusals-any-layer}.json` (new rows) | 200 |
````
````text
`protocol/skp/tests/conformance/fixtures/{requests-accept,refusals-at-deserialize,refusals-any-layer}.json` (new rows, and the version-refusal row's literal, §2.4), `protocol/skp/tests/conformance/README.md` | 220 |
````
````text
**Edited existing tests:** the version literal only, plus D9.
````
````text
**Edited existing tests:** the version literal only, plus D9, plus the version-refusal row's unsupported literal (§2.4).
````
   - **N-7** (the gate's words; the base follows ADV-2026-11-23-15 items 4 and 5):
````text
**Paths shared with held pieces** (the custodian builds on the held branch, ADV-2026-11-23-15 item 4):
````
````text
**Paths shared with held pieces** (ADV-2026-11-23-15 item 4: the branch starts at main's tip and takes in by merge commits, in item 5's order, the heads of PR 356, PR 359 and PR 360 and the relink branch's head, which holds PR 353's, PR 358's and PR 359's; the commit after the last merge is the recorded base B, named in an amendment and in the PR body):
````
````text
| PR 356 | `frontends/shell/src-tauri/src/commands.rs` |
````
````text
| PR 353 | `protocol/` (rule (00); taken in through the relink branch) |
| PR 356 | `frontends/shell/src-tauri/src/commands.rs` |
| PR 358 | `KNOWN-LIMITATIONS.md` (taken in through the relink branch) |
````
````text
The full diff: `origin/<held branch>...HEAD` until that branch merges, then `origin/main...HEAD`.
````
````text
The full diff: `B..HEAD`, with B the recorded base (§2.11); a base head that moves is taken in by a merge commit and gets ADV-2026-11-23-15 item 4's narrow read.
````
````text
**Merge:** after the v0.2 tag; after step 2's node is done; after the held branch and PRs 356, 359, 360 and 361. A merge commit, never a squash.
````
````text
**Merge:** after the v0.2 tag; after step 2's node is done; after every base (PRs 353, 356, 358, 359 and 360, and the relink branch) and after PR 361, in ADV-2026-11-23-15 item 5's order. A merge commit, never a squash.
````
   - **N-8** (the gate's words):
````text
It runs against the held branch's head until that branch merges, then against `origin/main`.
````
````text
B is the recorded base, and its exclusions are read at the present paths: this form's path, `governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.md` and `governance/CUSTODIAN-QUEUE.json`, in place of the 1c form's own path, `PLAN.yaml` and the two `CUSTODIAN-QUEUE` files.
````
   - **N-9.** Not adopted. The gate's four texts (R-S10, R-S6, R-S5 and item 70's draft) go to the advisor at P6 as P6 drafts, with R-S11 and R-S12.
   - **N-10.** The second bullet is adapted to OPEN-1 (C), the third to OPEN-4 (B), and the fourth is new (item 4):
````text
A session whose data cannot be found can only be discarded, and no re-link is offered.
````
````text
A session whose data cannot be found can only be discarded, and no re-link is offered.
  - Listing the sessions at a start reads none of their data, so a change to the data is found, and said, only when a session is recovered.
  - A session the app cannot offer (one with no change it can read, one written by a later version, or one whose record of the data's place is refused) is listed with Discard only, and stays on this computer until it is discarded.
  - While another window of the app holds a saved project's unsaved changes, or while more than 256 saved projects' unsaved changes are kept on this computer, a start offers no session that never saved, and says that more are kept.
````
   - **N-11** (the gate's words):
````text
an unanswered entry leaves the record;
````
````text
an unanswered entry leaves the record; an entry leaves the list once Recover or Discard succeeds, and `recover_session` or `discard_recoverable` on a record this run holds refuses `skp.recoverable_record_unknown`, never `…_locked`;
````
     Named, after the gate (a paraphrase): R-S8 can show briefly while another instance holds the record only to list it. That window is one listing read, inside one request round trip, and it does not block.
   - **N-12** (the gate's words):
````text
it replaces `protocol/skp/SKP-V0.md:1305`'s.
````
````text
it replaces the last clause of `protocol/skp/SKP-V0.md:1305`, from "nothing in SKP restores" to the end of that bullet, and leaves the rest of that bullet as it is.
````
   - **N-13.** These are the gate's words, with one change: the gate's bare `(:1264)` would be read against `kernel/src/project/mod.rs`, so it is written with its path. The bound is exposed in `kernel/src/project/store.rs` (item 7).
````text
**Not touched:** `kernel/src/project/mod.rs`. If it must change, that is a stop (§5 I8).
````
````text
**Not touched:** `kernel/src/project/mod.rs`. If it must change, that is a stop (§5 I8).
- **Also specified:**
  - `recover_bytes` (`kernel/src/session_history.rs:1264`) becomes `pub(crate)`;
  - after `set_len`, the handle seeks to the new end and `History.bytes` is the prefix length, so the next append leaves no gap;
  - an open refused or cancelled at accept drops the handle and leaves the record;
  - a folder with no `history.jsonl` is not listed and is left in place;
  - a `<hex>` record whose dedupe read is refused by a lock makes the `unsaved-` record be skipped at that start;
  - `locations.json` is read bounded to `LOCATIONS_LIMITS.max_bytes` + 1, and since that constant is private to `kernel/src/project/store.rs`, the bound is exposed there (added to Scope) or restated with a test that pins the two equal;
  - a `restored` mark, which no product code writes today, is named as not read by the last-value computation.
````

7. **Scope and budget.** These changes are declared before any code, so this is not an overrun.
   - **Files added:**
     - `protocol/skp/tests/conformance/README.md` (N-6), about 4 lines.
     - `kernel/src/project/store.rs` (N-13): `LOCATIONS_LIMITS.max_bytes` exposed `pub(crate)` (`kernel/src/project/store.rs:54-58`), about 4 lines. Before code, the custodian compares this file with every held PR's file list (ADV-2026-11-23-15 item 4).
     - `kernel/src/dataset_ref.rs` is not added under OPEN-1 (C).
   - **Files:** the ≤ 50 total holds (47 by the gate's union count, with these two files).
   - **Lines:** the old total does not hold. It is now ≤ 4,330:
````text
`protocol/skp/src/v0/{commands,error,mod}.rs` | 300 |
````
````text
`protocol/skp/src/v0/{commands,error,mod}.rs` | 330 |
````
````text
`kernel/src/recovery.rs` (new), `kernel/src/session_history.rs`, `kernel/src/lib.rs` | 650 |
````
````text
`kernel/src/recovery.rs` (new), `kernel/src/session_history.rs`, `kernel/src/lib.rs`, `kernel/src/project/store.rs` (the bound, N-13) | 780 |
````
````text
`kernel/tests/recovery_crash.rs` (new) | 700 |
````
````text
`kernel/tests/recovery_crash.rs` (new) | 1,200 |
````
````text
`src/admission/formatRefusal.ts` | 450 |
````
````text
`src/admission/formatRefusal.ts` | 500 |
````
````text
`src/console/surfaceCompleteness.test.ts` | 400 |
````
````text
`src/console/surfaceCompleteness.test.ts` | 500 |
````
````text
(one new Part) | 120 |
````
````text
(one new Part) | 140 |
````
````text
**≤ 3,480, ≤ 50 files**
````
````text
**≤ 4,330, ≤ 50 files**
````
````text
§2.11; ≤ 3,480, ≤ 50 files
````
````text
§2.11 as Amendment 2 revises it; ≤ 4,330, ≤ 50 files
````

8. **Questions.** These go to the advisor with OPEN-1 to OPEN-4. (a) goes to the custodian.
   - (a) **Guarantee, to the custodian.** The dedupe skips an `unsaved-` twin but never removes it. Once its project's record is recovered and then cleared, or discarded, the twin is listed at a later start as a session that never saved. Whether recovering or discarding a project's record should also remove its twin touches ADR-036 Amendment 1 item 5. This amendment does not draft it.
   - (b) **The gate's note on OPEN-2.** Its stated reason applies to Discard on every offer made at an open (the gate report, "OPEN items").
   - (c) **The list's bound under docs/01 principle 7.** Under OPEN-1 (C) the list is declared not cancellable. Its bound is 64 histories of at most `MAX_SESSION_HISTORY_BYTES` + 1 bytes each, read from the machine's own store, plus 256 dedupe reads and one metadata call per listed record. A metadata call on a network path waits as long as the operating system makes it wait. The architect judges whether that holds.
   - (d) **P6 drafts:** item 76's bullets, R-S11 and R-S12.

9. **Superseded by this amendment, by section:** §0 (H3 added); §2.3; §2.4; §2.7; §2.8 (R-S4's place; R-S11 and R-S12 added); §2.9; §2.10 (item 76); §2.11; §2.12 (D2, D3, D8, D9, D10; D15 and D16 added); §4 (K-C5, K-C6, E-RECOVER; rows added); §5; §7 (added); §8 (item 1; items 10 to 12 added); §9 (the diff range and the merge); OPEN-1; OPEN-4.

Read the last amendment first.

Nothing above is edited.

## Amendment 3 — 2026-11-23 — the custodian's, at the commit that files Amendment 2: references only

*Written by the custodian at the commit that files Amendment 2, before any code. References only.*

1. Amendment 2 is lead-data's draft, appended byte for byte from its consult, `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-amendment-2-lead-data-draft.md` (the hand-back's sha256 91e1e3cb080d8fc3f60ccf776ee2c95c95afd7b6aeca088bbf1f05092fe2d390): the text between its two marker lines.
2. Its evidence is the architect's form gate, attempt 1, FAIL: `state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect.md` (gate-log row 863).
3. Its cites are read at 96f56d28206e74d6992156f3f7735483d8063fa8. Its sentence that the custodian adds span hashes by script is not acted on: no hashes are added here. The architect's attempt 2 reads each cite at its own commit, and the form's re-sweep binds before code.
4. The points it could not settle (the consult's note after its end mark) go to the architect's attempt 2, and those that are rulings go to the advisor.
5. Next: the architect's form gate, attempt 2, on Amendment 2. No code is written before it ends PASS or PASS WITH NOTES.

Read the last amendment first.

Nothing above is edited.

## Amendment 4 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 2 (FAIL), and ADV-2026-11-23-16: C-8, E-3, E-4, the documentation findings and the rulings

*Post-result amendment. It was written after two outcomes were seen: the architect's form gate, attempt 2 (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-2.md`, FAIL), and the advisor's ruling ADV-2026-11-23-16. Lead-data drafted it before any code. Finding ids (C-8, E-3, E-4, N-14 to N-18) are that report's, and ruling items are ADV-2026-11-23-16's. Every `path:line` in this amendment is read at caea224a6cb081edc4577e978e408692c0c1172c. The drafter has no hashing tool, so the custodian adds each span's sha256 at filing. Each Old text below occurs once in the form above this amendment. An Old text inside one of Amendment 2's New fences replaces that New text in place, and where an Old text is part of a line, only that part is replaced. Items are this amendment's unless another amendment is named. No string, KNOWN-LIMITATIONS text or ADR word is ruled here.*

1. **The rulings, recorded.**
   - OPEN-1 is ruled (C) (ADV-2026-11-23-16 item 1), OPEN-4 (B) (item 2) and OPEN-3 (A) (item 3). Amendment 2's text under (C) and (B) stands, as this amendment revises it.
   - OPEN-2 is ruled "not (A) as drafted" (item 4). Discard on an offer at an open is in order. A project's record that another run left, that no live run holds, and that holds no step after its last `saved-here` mark must not leave item 70's sign for good. Item 2 below says how. Until this amendment passes, no code is written for that case.
   - The unsaved twin is removed (item 5). Item 3 below drafts it.
   - ADR-036 §9 gets no amendment for the offer at an open (item 6). If item 2 or 3 needs words in ADR-036, lead-data drafts a note, the architect checks it, and the advisor words it. Item 9 below has the note.
   - Item 43 is the advisor's to word, with items 70 and 76, from the filed text once the form's gate has passed (item 7).
   - OP6 moves to this form's operator Part (item 8). It is recorded here in item 10. The custodian records the move by an amendment to the 1c form.
   - Whether the list's bound holds under docs/01 principle 7 is the architect's to judge (item 9).
   - The strings and the limitation drafts are drafts. The build uses them under the placeholder mark (item 10).
   - The ceiling of 4,330 lines was accepted as declared (item 11). Item 11 below moves it, and the new one goes to the advisor (item 12 (d)).
   - Under OPEN-3 (A) a test pins what is given to the formatter (item 3). S-1's row says so:
````text
| S-1 | `the_offer_names_the_file_and_the_time` | time omitted | S-1 |
````
````text
| S-1 | `the_offer_names_the_file_and_the_time` (it asserts the instant taken from the last step's UTC `at` and the local date-and-time options handed to the formatter, not the text the operating system returns; OPEN-3 (A), ADV-2026-11-23-16 item 3) | time omitted | S-1 |
````

2. **OPEN-2, under ADV-2026-11-23-16 item 4: such a record is cleared at its project's open, with no question.**
   - **The rule.** At an open, `list_recoverable(handle)` reads `<root>/<project hex>` by name (Amendment 2 C-1). In order:
     1. It runs `try_lock` on the history. `WouldBlock` means a live run holds it: nothing is cleared and nothing is listed. Any other failure gives `cannot-be-offered` (`no-step`), as Amendment 2's C-4 text says.
     2. It reads through that handle, bounded to `MAX_SESSION_HISTORY_BYTES` + 1, and runs `recover_bytes`.
     3. The record is **cleared** only when all of these hold:
        - the header's `actions` is ≤ `ACTIONS`;
        - the kept lines hold at least one `saved-here` mark and no `step` line after the last one;
        - they hold no `restored` mark;
        - the reader found no failing line, or the failing line is the file's last segment and ends in no LF. That is a torn last write, which `History::append` never acknowledged: its `Ok` follows one `write_all` and one sync of the whole line (`kernel/src/session_history.rs:109-119`).
     4. **Clearing, in order:**
        - its twins are removed (item 3);
        - `history.jsonl` and `locations.json` are removed while the handle holds the lock (H2);
        - the handle is dropped;
        - the folder is removed.
        The reply lists nothing for it, and no string is shown.
     5. A record with no step after its last `saved-here` mark that fails step 3 only through a failing line with bytes after it is listed with Discard only (`cannot-be-offered`, `no-step`). A record that holds a `restored` mark is `later-version` (item 7, the N-13 bullet).
     6. Every other case is as filed. A step after the last mark, or steps and no mark, is offered (Amendment 2 C-1). The OPEN-4 (B) cases are listed with Discard only.
   - **After the clear,** the open stays unbound, as `reopened()`'s rule says (`kernel/src/session_history.rs:392-401`, unchanged). Its first step makes a record of its own. Its first save moves that record to `<project hex>`, which is now free (`adopt_project`, :366-378), and writes its mark, so item 70's sign does not show.
   - **Why clearing, from the code:**
     - A `saved-here` mark is written only after the save has replaced the project file (`kernel/src/project/mod.rs:406`; the history's moves follow at :418). It is also written only when the steps reach the workspace that save wrote (`kernel/src/session_history.rs:423-425`). So a record with no step after its last mark holds no change that the file its mark followed lacks.
     - What the clear removes is the step lines up to that mark. This version keeps no lineage: the save writes `lineage: Lineage::NotKept` (`kernel/src/project/mod.rs:355`). So no lineage holds those lines. But a normal end removes the same lines from every record its run made (`end_session`, `kernel/src/session_history.rs:437-448`; ADR-036 §9, "When it is cleared"). The clear removes what a normal end would have removed.
   - **The case where clearing loses something the lineage does not hold** (item 4 asks for it):
     - The case: the project file opened is not the one the last mark followed. For example, after that save the folder's `project.spatial` was replaced by an older copy, such as an earlier version of the plain-text file under version control. Then the record's steps reach a workspace the opened file does not hold, and the record is the app's only copy of it.
     - The kernel cannot tell at the list. It would need the workspace the reopen read, and `reopened()` is not given it. Its caller is in `kernel/src/project/mod.rs`, which §5 I8 keeps unedited.
     - The drafter recommends the clear anyway: the user replaced a file they had saved, and a normal end would have removed the record.
     - If the advisor finds the case material, the fallback is to offer such a record with Recover and Discard, as a record with a step after its mark is offered. Recover restores the last kept values. A question is then asked in the ordinary case too (item 12 (a)).
   - **Not "continued by the reopen".** Binding an open to a record another run left changes `reopened()`'s binding rule, which Amendment 2's C-1 text keeps. It also changes `open_project`'s behaviour, which §5 declares unchanged. And this run's normal end would clear the record anyway.
   - **Not "offered with Discard only".** That asks a question where nothing unsaved is at stake, which the advisor prefers to avoid.
   - **Concurrency.** The clear's removals are made under the record's lock, as `discard_recoverable`'s are (Amendment 2 N-1). An instance whose dedupe probes this history for its own read makes this open meet `WouldBlock`. Then nothing is cleared, and this run's save shows item 70's sign until the project is next opened. That window is one listing, and it does not block.
   - Text changes:
````text
and only if it holds a step after its last `saved-here` mark, or holds steps and no mark (OPEN-2).
````
````text
and only if it holds a step after its last `saved-here` mark, or holds steps and no mark (OPEN-2). A record with no step after its last `saved-here` mark is cleared at that open with no question, or listed with Discard only, as Amendment 4 item 2 says.
````
````text
Listing removes nothing: such a record stays until Discard
````
````text
A listing at a start removes nothing, and a listing at an open removes only Amendment 4 item 2's record and its twins: such a record stays until Discard
````
````text
At an open, one folder is read by name and none is walked.
````
````text
At an open, one folder is read by name, and the `unsaved-` folders are walked only for its twins when it is cleared (Amendment 4 items 2 and 3).
````
````text
a project's record is offered only with a step after its last `saved-here` mark; records that cannot be offered are left in place
````
````text
a project's record is offered only with a step after its last `saved-here` mark, or with steps and no mark; one with no step after its last mark is cleared at its open (Amendment 4 item 2); records that cannot be offered are listed with Discard only (OPEN-4 (B))
````
   - **§2.4, added after the bullet that begins "`list_recoverable` is not cancellable":** At an open, `list_recoverable` clears the project's record that Amendment 4 item 2 names, with its twins, before it replies. `recover_session` and `discard_recoverable` on a project's record remove its twins in the same act (Amendment 4 item 3). The new §13 and §15 of SKP-V0 say so.

3. **The unsaved twin, under ADV-2026-11-23-16 item 5.**
   - **What a twin is.** An `unsaved-` record U is the twin of a project's record R when both of these hold:
     - U's `locations.json` bytes equal R's. A move copies that file byte for byte (`kernel/src/session_history.rs:553`), and nothing rewrites a session record's `locations.json`.
     - U's kept step ids, in order, are the first kept step ids of R, or neither holds a step.
     This rule requires more than the start's test (item 4), which compares the first step only, so a twin found at a start is removed only if its whole kept prefix is in R.
   - **When it is removed.** In the same act as R's recover (`recover_session` on R, step 4a, item 5), R's discard (`discard_recoverable` on R, step 3a, item 5) and R's clear (item 2). That act already holds R's lock and has read R. Twins are removed after the act's last check and before its first change to R. A crash in between leaves R whole, and R holds every line its twin held.
   - **The search, in order:**
     1. The folder names under the root are read, after R's lock.
     2. Each `unsaved-` folder is examined, at most `MAX_DEDUPE_RECORDS` of them (§7, as item 4 revises it):
        - `metadata` of its `locations.json`; a length other than R's is not a twin;
        - an equal length is read, bounded to that length + 1, and compared byte for byte;
        - on equal bytes, `try_lock` on its history. `WouldBlock` leaves it, because a live run holds it, this run included (H1, H3), and any other failure leaves it too;
        - once locked, it is read through that handle. First its header and first step line, bounded to `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES` + 2 bytes. In full, bounded to `MAX_SESSION_HISTORY_BYTES` + 1, only when that first step's id is R's first kept step id;
        - a twin's `history.jsonl` and `locations.json` are removed while its handle holds the lock (H2), the handle is dropped, and its folder is removed.
     3. Every handle that is not a twin's is dropped without a change.
   - **The state lock.** No step of the search holds the recorder's state lock (item 7, N-16).
   - **Past the bound,** twins that were not examined stay. Each is listed at a later start once R is gone, and holds only steps R held. Item 76 says so (item 10).
   - **Why the full read.** It keeps a twin whose lines R cannot read in full, after damage in R, from being removed. Such a twin is listed at a later start, once R is gone.

4. **C-8: the start's dedupe, redesigned.** The gate's points (1) to (4) are taken.
   - **The walk.** One `unsaved-` record is "taken" when the walk has locked and read it. The first of these Old texts sits in Amendment 2's C-4 New text; the other two are bullets of Amendment 2's item 4:
````text
whose first kept step id equals the first kept step id of a `<hex>` record is skipped
````
````text
whose `locations.json` bytes equal a `<hex>` record's and whose first kept step id equals that record's (Amendment 4 item 4) is skipped
````
````text
     - Then the dedupe runs, then the bounded read. The record is then listed, and it counts. Skipped folders do not count.
````
````text
     - Then the bounded read, through that handle, and the read of its `locations.json`, bounded to `LOCATIONS_LIMITS.max_bytes` + 1. The record is then taken, and it counts toward `MAX_RECOVERABLE_RECORDS`, whether it is then listed, found to be a twin, or withheld. Its handle, and so its lock, is kept until the dedupe ends. Of its bytes, only what its entry and the dedupe need is kept. Skipped folders do not count.
````
````text
   - **The dedupe** reads at most `MAX_DEDUPE_RECORDS` `<hex>` histories that exist and are not empty. Past that bound, or when a `<hex>` history is held by a lock (N-13), no `unsaved-` record is listed at that start, and `more` is `true`.
````
````text
   - **The dedupe** runs once per start, after the walk has taken its records and while it still holds each one's lock (Amendment 4 item 4):
     1. The folder names under the root are read again. The names read before the locks are not used for it (C-8 (3)).
     2. For each `<hex>` folder that holds a `locations.json`, at most `MAX_DEDUPE_RECORDS` of them: `metadata` of that file. Its length is compared with each taken record's `locations.json` length. On an equal length it is read, bounded to that length + 1, and compared byte for byte. A `<hex>` folder whose bytes equal a taken record's is a candidate for that record alone.
     3. For each candidate, its history is locked with `try_lock`. Once it is locked, its header and first step line are read through that handle, bounded to `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES` + 2 bytes, and the lock is released. The taken record is a twin, and is not listed, when that first step's id is its own first kept step id, or when neither holds a step. On `WouldBlock`, any other failure, or a header the reader refuses, the taken record is withheld.
     4. The dedupe is incomplete when a `<hex>` folder's `locations.json` gives a `metadata` failure other than `NotFound`, or when more `<hex>` folders hold one than the bound. Then every taken record that was locked is withheld.
     5. Every taken record's lock is then released. Only after that is `metadata` called on each listed record's data path.
     - `more` is `true` when an `unsaved-` folder is left unexamined at `MAX_RECOVERABLE_RECORDS`, or when a taken record is withheld.
````
````text
This reads only the header line and the first step line of each `<hex>` record, bounded by `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES`, and of at most `MAX_DEDUPE_RECORDS` such records (§7, Amendment 2 item 4). A `<hex>` folder with no history, or an empty one, is not read and does not count. Past that bound the dedupe cannot be completed, and no `unsaved-` record is listed at that start. This fails closed, because ADR-036 Amendment 1 item 5 offers the project's record only.
````
````text
The dedupe is Amendment 4 item 4's. It fails closed for one taken record whose candidate it cannot read, and for every taken record only when it cannot be completed, because ADR-036 Amendment 1 item 5 offers the project's record only.
````
````text
`more` is `true` when an `unsaved-` folder is left unexamined at the bound, or is not listed because the dedupe could not be completed.
````
````text
`more` is `true` when an `unsaved-` folder is left unexamined at the bound, or when a taken record is withheld (Amendment 4 item 4).
````
````text
  - a `<hex>` record whose dedupe read is refused by a lock makes the `unsaved-` record be skipped at that start;
````
````text
  - a `<hex>` record whose `locations.json` bytes equal an `unsaved-` record's, and whose history a lock refuses, makes that `unsaved-` record alone be withheld at that start (Amendment 4 item 4);
````
   - **Point (1): a held record for an unrelated project suppresses nothing.**
     - Only a `<hex>` folder whose `locations.json` equals the taken record's byte for byte is a candidate, and it can withhold that record only.
     - A `<hex>` record made for an unrelated project names its own dataset identity (`State::open` mints one, :176-184), so its bytes differ. Its lock is never probed.
     - Two cases can give equal bytes without a twin:
       - an open reopened from a project whose record another run left. It takes the project file's identity (`reopened()`, :397) and, unbound, makes an `unsaved-` record of its own (Amendment 2 C-1);
       - a project made by the reopen's answer `copy`, which keeps the dataset entry (`kernel/src/project/mod.rs:759-766`).
     - The first-step test separates both, and a held candidate withholds only that one record.
   - **Point (2): the reads are bounded.** Per start:
     - two reads of the folder names;
     - at most 64 histories, each at most `MAX_SESSION_HISTORY_BYTES` + 1 bytes, and their `locations.json`, each at most `LOCATIONS_LIMITS.max_bytes` + 1;
     - at most `MAX_DEDUPE_RECORDS` `metadata` calls on `<hex>` `locations.json` files;
     - a byte read only on an equal length, each at most the matching taken record's length + 1;
     - per candidate, one lock probe and at most `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES` + 2 bytes.
     The worst case is large, but every read is in the machine's own store. A `locations.json` the store's writer writes holds one entry with strings of at most 4,096 bytes (`kernel/src/project/store.rs:462-478`). What the start still cannot offer is stated in item 76 and in §2.9 (both below).
   - **Point (3): the reads come after the lock, and that is binding.**
     - A save's move renames the project's history in (`kernel/src/session_history.rs:562`) before it drops the `unsaved-` handle (:374). The walk holds each taken record's lock from before the dedupe's own read of the names until the dedupe ends.
     - So a move that freed a lock the walk then took has already renamed its history in, and the dedupe finds it, renamed and locked. No move of a taken record can begin while the walk holds its lock.
     - A set of `<hex>` names read before the locks is never used.
   - **Point (4): departures.** The departure from ADR-036 §9 that remains goes to the advisor (item 12 (b)).
   - **§2.9's guarantee line:**
````text
ADR-036 §9: offered at next start;
````
````text
ADR-036 §9: offered at next start, but not the sessions a start withholds or finds to be twins (Amendment 4 item 4; item 76), a departure sent to the advisor; a project's record with nothing after its last save is cleared at that project's open (Amendment 4 item 2);
````
   - **OPEN-4's stated reason** (Amendment 2 item 1, which the gate names as one of C-8's places):
````text
Under (B), each record can leave by the user's Discard, and nothing is removed unasked.
````
````text
Under (B), each record that is listed can leave by the user's Discard. Amendment 4 items 2 to 4 name what is removed unasked (a project's record with nothing after its last save, and the twins), the records a start does not list, and how each of them leaves.
````
   - **`recover_session` on an `unsaved-` record** runs the same dedupe for that record alone, after its own lock is taken and kept (item 5, step 3a).

5. **`recover_session` and `discard_recoverable`, in order** (items 3 and 4; item 7's N-16 words apply to every step here):
````text
     3. lock and read;
````
````text
     3. lock and read;
     3a. for an `unsaved-` record: Amendment 4 item 4's dedupe, for this record alone, with the names read after this lock. A twin refuses `…_unknown`. A candidate a lock refuses gives `…_locked`. Any other withheld case, or an incomplete dedupe, gives `…_unknown`;
````
````text
     5. `set_len` to the kept prefix, seek to its end, sync;
````
````text
     4a. for a project's record: its twins are removed (Amendment 4 item 3). This step refuses nothing;
     5. `set_len` to the kept prefix, seek to its end, sync;
````
````text
   - **`discard_recoverable`** refuses a record this run holds as `…_unknown`, and a `WouldBlock` as `…_locked`.
````
````text
   - **`discard_recoverable`** refuses a record this run holds as `…_unknown`, and a `WouldBlock` as `…_locked`. In order: 1. validate the name; 2. refuse a record this run holds; 3. lock and read, and re-check the listing conditions; 3a. for a project's record, remove its twins (Amendment 4 item 3); 4. remove `history.jsonl` and `locations.json` under the lock (H2), drop the handle, remove the folder. An `unsaved-` record gets no twin search, because removing it is what the move would have done.
````

6. **E-3 and E-4** (the gate's texts):
````text
| K-C20 | `recovering_a_projects_record_into_an_open_of_another_project_is_refused` | `reopened_as` not compared | K-C20 |
````
````text
| K-C20 | `recovering_a_projects_record_into_an_open_of_another_project_is_refused` (the other project is a copy of the record's project, made by the reopen's answer `copy`, so its dataset URI is the header's and only `reopened_as` differs) | `reopened_as` not compared | K-C20 |
````
````text
and the open must have no step, no record and no binding.
````
````text
and the open must hold no record (a first step makes one, so this one check also refuses an open with a step) and no binding.
````
````text
| K-C12 | `recovering_into_an_open_that_has_a_step_is_refused` | step check skipped | K-C12 |
````
````text
| K-C12 | `recovering_into_an_open_that_has_a_step_is_refused` | the check that the open holds no record removed | K-C12 |
````
   - The gate's grounds were checked against the code. A step creates the open's record (`kernel/src/session_history.rs:316-321`). A copy keeps the dataset entry (`kernel/src/project/mod.rs:759-766`).

7. **N-14 to N-18.** These are the gate's words. Each Old text was checked against the form first. N-18 has one change, named after it.
   - **N-14:**
````text
| S-7 | `an_entry_leaves_the_list_once_recover_succeeds` | the entry kept after Recover | S-7 |
````
````text
| S-7 | `an_entry_leaves_the_list_once_recover_succeeds` (`RecoveryOffer.test.tsx`) | the entry kept after Recover | S-7 |
````
````text
| S-8 | `a_cannot_be_offered_entry_offers_discard_only` | Recover shown for `cannot-be-offered` | S-8 |
````
````text
| S-8 | `a_cannot_be_offered_entry_offers_discard_only` (`RecoveryOffer.test.tsx`) | Recover shown for `cannot-be-offered` | S-8 |
````
   - **N-15:**
````text
The form below is sound under them.
````
````text
The form below is sound under them. The accounts below of the other options are not complete (under OPEN-4 (A), K-C24's mutation passes on every system, not only on Windows), so a ruling of another option returns the form to its drafter and to this gate before any code.
````
   - **N-16:**
````text
     - A refusal or cancel before step 5 drops the handle and leaves the history byte for byte.
````
````text
     - A refusal or cancel before step 5 drops the handle and leaves the history byte for byte. The header's one-dataset check (C-2) is made at step 3, so no refusal follows step 5.
     - The recorder's state lock is taken only to read or change `state`, at steps 2 and 6, and never across a lock probe, a file read, `metadata` or the data's open; the listing takes it the same way. Step 2 reserves the record name until step 6 or the refusal, so a second `recover_session` of it in this run meets the held check and refuses `…_unknown` (N-11).
````
````text
and it calls `metadata` once on each listed record's data path.
````
````text
and it calls `metadata` once on each listed record's data path, holding no history lock and not the recorder's state lock; on a path the operating system cannot reach at once, such as an unreachable network share, that call waits as long as the operating system makes it, and only the list's reply waits with it.
````
   - **The bounds named in the same bullet:**
````text
within §7's and Amendment 2 item 4's bounds
````
````text
within §7's, Amendment 2 item 4's and Amendment 4 item 4's bounds
````
   - **N-17:**
````text
| K-C17 | `the_listing_reads_no_byte_of_the_data_file` (data replaced by a 0-byte file: `found`) |
````
````text
| K-C17 | `the_listing_states_found_from_metadata_alone` (data replaced by a 0-byte file: `found`; §8 item 10 holds the rest by review) |
````
   - **N-18.** These are the gate's words with one change. The gate's "That window is one listing read" becomes "That window is one start's listing", because item 4 keeps each taken record's lock until the dedupe ends. Item 4 also finds a save's moved record, so a session in that gap is withheld rather than listed; the gate's words for that gap still name its effect on Windows.
````text
     Named, after the gate (a paraphrase): R-S8 can show briefly while another instance holds the record only to list it. That window is one listing read, inside one request round trip, and it does not block.
````
````text
     Named, after the gate (a paraphrase): R-S8 can show briefly while another instance holds the record only to list it. That window is one start's listing (Amendment 4 item 4 keeps each taken record's lock until its dedupe ends), inside one request round trip, and it does not block. Named too: `end_session` (`kernel/src/session_history.rs:443-446`) and a save's move (:374-378) drop a history's lock before removing its files, so a listing in another instance in that gap can list a session that is then gone, and its Recover or Discard is refused; on Windows its folder can stay empty, unlisted and unremoved. Each gap is one removal, inside one request round trip, and does not block. For a save's move, Amendment 4 item 4 finds the moved record, so that session is withheld, not listed.
````
   - **The `restored` mark** (the gate's attempt-2 recommendation under "The drafter's unsettled points", adopted; item 2 needs a rule for it):
````text
  - a `restored` mark, which no product code writes today, is named as not read by the last-value computation.
````
````text
  - a record whose kept lines hold a `restored` mark, which no product code writes today, is `cannot-be-offered` (`later-version`), at a start and at an open, and is never cleared: a `restored` mark moves the chain's parent (`kernel/src/session_history.rs:1345-1353`), which the last-value computation does not follow, so offering such a record would restore wrong values silently.
````

8. **Tests.**
   - **Rows changed:**
````text
| K-C9 | `a_project_record_with_nothing_after_its_saved_mark_is_not_offered` | mark not considered | K-C9 |
````
````text
| K-C9 | `a_project_record_with_nothing_after_its_saved_mark_is_cleared_at_its_open_with_no_offer` (the record another recorder left, dropped without `end_session`: a header, a step, a `saved-here` mark after it, and a torn last line; after `list_recoverable(handle)` lists nothing, the folder is gone, and the open's first step and save write the mark) | the record left in place (OPEN-2 (A) as filed) | K-C9 |
````
````text
| K-C23 | `past_the_dedupe_bound_no_unsaved_record_is_listed_and_more_is_set` (257 `<hex>` histories) | the dedupe bound not applied | K-C23 |
````
````text
| K-C23 | `past_the_dedupe_bound_no_unsaved_record_is_listed_and_more_is_set` (257 `<hex>` folders, each holding a `locations.json` that names another dataset and no history) | the dedupe bound not applied | K-C23 |
````
   - **Rows added at the end of §4's table.** The file is `kernel/tests/recovery.rs` unless a row names another. "The test holds" means a `File` the test opens and locks itself.

| Id | Test | Mutation | Fails |
|---|---|---|---|
| K-C25 | `a_project_record_another_run_holds_for_other_data_withholds_no_unsaved_offer` (a `<hex>` history the test holds, whose `locations.json` names another dataset; a crash-left `unsaved-` record: listed) | every held `<hex>` history withholds every taken record (Amendment 2's rule restored) | K-C25 |
| K-C26 | `an_unsaved_record_whose_twin_a_live_run_holds_is_withheld_alone_and_more_is_set` (U1's twin `<hex>` history, the test holds; U2 unrelated: U2 listed, U1 not, `more` true) | a candidate a lock refuses read as not a twin | K-C26 |
| K-C27 | `the_project_side_is_read_after_the_unsaved_locks_not_from_the_first_names` (unit test in `kernel/src/recovery.rs`; the start walk's private parameter, called after the locks and before the dedupe's names read, which the product passes as a no-op, makes U's twin folder there, its history held by the test: U not listed) | the dedupe's `<hex>` names taken from the walk's first read | K-C27 |
| K-C28 | `a_project_record_a_live_run_holds_is_neither_cleared_nor_offered_at_its_open` (the record has nothing after its mark, and the test holds it; after the call, the test drops its handle and reads both files by path, byte for byte) | `WouldBlock` taken as clearable | K-C28 |
| K-C29 | `a_project_record_with_a_step_after_its_last_mark_is_offered_not_cleared` (a header, s1, a mark after s1, s2) | any `saved-here` mark makes the record clearable | K-C29 |
| K-C30 | `a_project_record_damaged_before_its_end_is_not_cleared_and_is_listed_with_discard_only` (a header, s1, a mark, a refused line with an LF, s2) | a failing line not considered by the clear | K-C30 |
| K-C31 | `discarding_a_projects_record_removes_its_unsaved_twin` | the twin search not called from `discard_recoverable` | K-C31 |
| K-C32 | `recovering_a_projects_record_removes_its_unsaved_twin` | the twin search not called from `recover_session` | K-C32 |
| K-C33 | `clearing_a_projects_record_at_its_open_removes_its_unsaved_twin` | the twin search not called from the clear | K-C33 |
| K-C34 | `a_twin_a_live_run_holds_is_left_when_its_projects_record_is_discarded` (after the call, the test drops its handle and reads the twin's files by path, byte for byte) | `WouldBlock` taken as removable | K-C34 |
| K-C35 | `an_unsaved_record_with_a_step_the_projects_record_does_not_hold_is_not_removed_with_it` (U: s1, s2; R: s1, then a refused line; R discarded; U stays and is listed at the next start) | the twin judged by its first step alone | K-C35 |
| K-C36 | `a_record_holding_a_restored_mark_is_listed_with_discard_only` (a header, s1, s2, a `restored` mark to s1, s3) | `restored` marks not considered | K-C36 |
| K-C37 | `recovering_an_unsaved_record_whose_twin_a_live_run_holds_is_refused_as_locked` (asserted on the reply) | step 3a skipped | K-C37 |

   - **Red before the fix.**
     - Each K-C row, the changed ones included, calls `list_recoverable`, `recover_session` or `discard_recoverable`, and none of them exists at the red commit.
     - K-C27 calls the start walk and its parameter, which do not exist then either.
     - S-1's change asserts the formatter's input. `RecoveryOffer` does not exist at the red commit.
   - **Known pass cases.** None is known for any mutation.
     - K-C28 and K-C34 drop the test's own handle before reading by path, so on Windows a removal the mutation made while that handle was open shows whichever delete semantics the system uses (H2). On macOS/Linux the file is unlinked.
     - K-C25, K-C26 and K-C37 rest on the probe meeting `WouldBlock` against the test's handle: on Windows through LockFileEx (H1), and on macOS/Linux through a second open file description (H3).
     - K-C37 asserts the reply, not the bytes, because under its mutation `set_len` to an untorn prefix would leave the bytes as they were.
   - **§5, added after "Predicted":** K-C28 and K-C34 fail under their mutations on Windows (H2) and on macOS/Linux (H3).
   - **§5, added after "Falsified if":** also falsified if any of these happens:
     - a record or a twin is removed while another run holds its lock;
     - a project's record holding a step after its last `saved-here` mark, or a line after a failing line, is cleared;
     - a start lists an `unsaved-` record while a `<hex>` history exists whose `locations.json` equals its own and whose first step is its first kept step.
   - **§8, added after item 12:**
     - 13\. a record or a twin removed after a lock probe gave `WouldBlock`, or with no probe;
     - 14\. the start's dedupe reading `<hex>` names read before the `unsaved-` locks;
     - 15\. a project's record cleared at an open when it holds a step after its last `saved-here` mark, a `restored` mark, or a line after a failing line.

9. **ADR-036 (ADV-2026-11-23-16 item 6): a note for the architect to check. Its words go to the advisor.**
   - **Item 2 needs words, on the drafter's reading.** ADR-036 §9 says a crash "leaves the history for the recovery offer" (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:209`), and item 2 clears such a history with no offer. A draft, to follow that sentence: "A project's record that another run left, that no running session holds, and that holds no step after its last `saved-here` mark is cleared when that project is next opened, with no offer: nothing in it is unsaved."
   - **Item 3 needs none, on the drafter's reading.** Amendment 1 item 5 already says that "the `unsaved-` record is then removed" (ADR-036:272), and item 3 finishes that move. If the architect reads it otherwise, a draft, to end Amendment 1 item 5: "When the project's record is recovered, declined, or cleared at the project's open, that `unsaved-` record is removed with it, unless a running session holds it."
   - If the advisor rules either note's words, §1's line "ADRs: none is amended" is superseded by the amendment that records them. This amendment does not edit it.

10. **Drafts for the advisor, and the operator Part.** None of these is the advisor's or the human's wording.
   - **Item 70:**
````text
**Draft:** "A project's session history that an earlier run left is offered back when the project is opened again only if it holds changes made after its last save; otherwise, or while the offer is unanswered, the later run's save shows the withheld mark until that folder is removed."
````
````text
**Draft:** "A project's session history that an earlier run left is offered back when the project is opened again if it holds changes made after its last save, and is cleared at that open, with no question, if it holds none. While that offer is unanswered, or while another window of the app holds that history, a save in the later run shows the withheld mark."
````
   - **Item 76** (C-4's bullet, then N-10's fourth bullet):
````text
At most 64 unsaved sessions are listed at a start; the others are listed at a later start, as listed ones are recovered or discarded.
````
````text
A start examines at most 64 unsaved sessions and lists those it can offer; the others are examined at a later start, as examined ones are recovered or discarded, or leave as the bullets below say.
````
````text
  - While another window of the app holds a saved project's unsaved changes, or while more than 256 saved projects' unsaved changes are kept on this computer, a start offers no session that never saved, and says that more are kept.
````
````text
  - A session whose changes were moved into a saved project's session history, as after a crash during a save, is not listed at a start. It is offered as that project's when the project is next opened, and it is removed when that project's history is recovered, discarded or cleared. Until then it takes one of the 64 places.
  - A session that never saved is not listed at a start, and the start says that more are kept, while another window of the app holds a saved project's session history made from the same data at the same place, while the app cannot read one of the saved projects' session histories that could hold it, or while more than 256 saved projects' session histories are kept on this computer. Each such session also takes one of the 64 places. A saved project's session history leaves when that project is next opened, as item 70 says.
  - When more than 256 sessions that never saved are kept, a saved project's session history that is recovered, discarded or cleared may leave behind the session it was moved from. That session is then listed at a later start, and holds only changes the project's history held.
````
   - **Strings.** No new string. R-S8 and R-S9 also cover `recover_session`'s new refusals at step 3a (item 5). Whether their words fit those cases is for P6.
   - **The operator Part** (ADV-2026-11-23-16 item 8):
````text
  - OP-R4: data moved, then not found, Discard only.
````
````text
  - OP-R4: data moved, then not found, Discard only.
  - OP-R5: save a project, make no change, crash; reopen it: no offer, and the next change and save show no withheld mark (Amendment 4 item 2).
  - OP6 (moved from the 1c form, `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:778`, by ADV-2026-11-23-16 item 8): crash, then the recovery offer. It is run in this Part, and its log starts blank.
````
````text
OP-R1 to OP-R4 here; OP6's move is the custodian's to record
````
````text
OP-R1 to OP-R5 and OP6 here (ADV-2026-11-23-16 item 8); the custodian records the move by an amendment to the 1c form
````
   - **§2.12, rows added after D16:**
     - | D17 | rule | (none) | the start's dedupe: `locations.json` bytes, then the first step; the project side read after and under the taken records' locks; withheld per record | C-8; Amendment 4 item 4 |
     - | D18 | rule | OPEN-2 (A) | a project's record with nothing after its last mark is cleared at its open | ADV-2026-11-23-16 item 4; Amendment 4 item 2 |
     - | D19 | rule | (none) | the `unsaved-` twin removed with its project's record | ADV-2026-11-23-16 item 5; Amendment 4 item 3 |
     - | D20 | rule | (none) | a `restored` mark makes a record `later-version` | the gate's attempt-2 recommendation |
     - | D21 | operator | (none) | OP-R5, and OP6 moved here | ADV-2026-11-23-16 items 4 and 8 |

11. **Scope and budget.** These are class-9 scope additions, recorded before any code. No §7 line is edited, no file is added, and the ≤ 50 files hold (47).
   - **`MAX_DEDUPE_RECORDS` keeps 256.** What it bounds changes:
````text
It bounds the `<hex>` histories a start's dedupe reads, each to its header and first step line.
````
````text
It bounds, in each act, the folders of the other shape whose `locations.json` is examined: the `<hex>` folders that a start's dedupe, or `recover_session`'s step 3a, examines, and the `unsaved-` folders that a twin search examines (Amendment 4 items 3 and 4).
````
   - **Lines by file:**
     - `kernel/src/recovery.rs`: about +270, with K-C27;
     - `kernel/src/session_history.rs`: about +20 (a bounded read of the first two lines);
     - `kernel/tests/recovery.rs`: about +520;
     - `kernel/tests/recovery_crash.rs`: about +80;
     - `protocol/skp/SKP-V0.md`: about +20 (§13 and §15's words, item 2);
     - `KNOWN-LIMITATIONS.md`: about +12;
     - `frontends/shell/MANUAL-WALKTHROUGH.md`: about +8 (OP-R5 and OP6).
   - **The 4,330-line ceiling does not hold.** It is now ≤ 5,260:
````text
`protocol/skp/src/v0/{commands,error,mod}.rs` | 330 |
````
````text
`protocol/skp/src/v0/{commands,error,mod}.rs` | 350 |
````
````text
`kernel/src/recovery.rs` (new), `kernel/src/session_history.rs`, `kernel/src/lib.rs`, `kernel/src/project/store.rs` (the bound, N-13) | 780 |
````
````text
`kernel/src/recovery.rs` (new), `kernel/src/session_history.rs`, `kernel/src/lib.rs`, `kernel/src/project/store.rs` (the bound, N-13) | 1,070 |
````
````text
`kernel/tests/recovery_crash.rs` (new) | 1,200 |
````
````text
`kernel/tests/recovery_crash.rs` (new) | 1,800 |
````
````text
(one new Part) | 140 |
````
````text
(one new Part) | 160 |
````
````text
**≤ 4,330, ≤ 50 files**
````
````text
**≤ 5,260, ≤ 50 files**
````
````text
§2.11 as Amendment 2 revises it; ≤ 4,330, ≤ 50 files
````
````text
§2.11 as Amendments 2 and 4 revise it; ≤ 5,260, ≤ 50 files
````

12. **Questions for the advisor.** None is ruled here.
   - (a) **Item 2's case.** The opened project file can be an older one than the file the last mark followed. Is that case material? If it is, item 2's fallback applies.
   - (b) **The departure from ADR-036 §9 that remains** (C-8 (4)). §9 says "recovery is offered when the application next starts" (ADR-036:206). A start does not offer the sessions item 4 withholds, and twins are offered at their project's open instead (Amendment 1 item 5). The gate says a qualifier to §9 would be the human's.
   - (c) **Item 9's notes.** Their words, and whether either is needed.
   - (d) **The ceiling.** It moves from the accepted 4,330 to 5,260 (item 11). Is that accepted, or should the piece be split (ADV-2026-11-23-16 item 11)?
   - (e) **A twin left by a failed removal in a save that then ended normally.** The removal errors at `kernel/src/session_history.rs:376-377` are ignored. The run's normal end then clears the project's record and not the twin (:437-448), so a later start lists the twin as a session that never saved. Item 5 of the ruling does not name that act. Whether `end_session` should remove such a twin touches its rule "and nothing else" (:437-438).
   - (f) **The P6 drafts:** item 70 and item 76 (item 10), and R-S8 and R-S9 for step 3a's refusals.

13. **Superseded by this amendment, by section:**
   - §2.3, as Amendment 2 revises it: the start, the dedupe, the open, the listing's removals, `recover_session`, `discard_recoverable`, and the N-13 bullets;
   - §2.4 (an addition);
   - §2.9 (the ADR-036 §9 line);
   - §2.10 (items 70 and 76);
   - §2.11;
   - §2.12 (D7, D13; D17 to D21 added);
   - §4 (K-C9, K-C12, K-C17, K-C20, K-C23, S-1, S-7, S-8; K-C25 to K-C37 added);
   - §5;
   - §7 as Amendment 2 adds to it (what `MAX_DEDUPE_RECORDS` bounds);
   - §8 (items 13 to 15 added);
   - §9 (the operator Part);
   - OPEN-2, OPEN-4's reason, and Amendment 2 items 1 and 4.

Read the last amendment first.

Nothing above is edited.

## Amendment 5 — 2026-11-23 — the custodian's, at the commit that files Amendment 4: references only

*Written by the custodian at the commit that files Amendment 4, before any code. References only.*

1. Amendment 4 is the lead-data's draft, appended byte for byte from its consult, `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-amendment-4-lead-data-draft.md` (the hand-back's sha256 c6de9bdce4185e4ee65e6bd0a32fb056893789a1a86ab480edae0c9ddd5cefaf): the text between its two marker lines.
2. Its evidence is the architect's form gate, attempt 2, FAIL (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-2.md`, gate-log row 869), and the advisor's ruling ADV-2026-11-23-16 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-16-the-recovery-offer-open-1-c-open-4-b-open-3-a-open-2-not-as-drafted-the-unsaved-twin-removed-op6-moves.md`).
3. Its cites are read at caea224a6cb081edc4577e978e408692c0c1172c. Its sentence that the custodian adds span hashes is not acted on: no hashes are added here. The architect's attempt 3 reads each cite at its own commit, and the form's re-sweep binds before code.
4. Its questions and drafts for the advisor go to the advisor in one message (ADV-2026-11-23-15 item 8); none is ruled here. The points it could not settle, and any finding of its own, go to the architect's attempt 3.
5. Next: the architect's form gate, attempt 3, on Amendment 4. No code is written before it ends PASS or PASS WITH NOTES.

Read the last amendment first.

Nothing above is edited.

## Amendment 6 — 2026-11-23 — the custodian's, after the architect's form gate, attempt 3 (FAIL): that gate's replacement words for C-9, C-10, E-5 and N-19 to N-26, carried byte for byte

*Written by the custodian before any code. It carries the attempt-3 gate's own replacement words, each copied by script from the filed report in the report's order; it words nothing of its own but where each goes and what follows.*

1. Evidence: the architect's form gate, attempt 3, FAIL (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-3.md`, gate-log row 875; the hand-back's sha256 22c664362fb5fdd06089064d4da6aa0049809ca33b8f13647410b9cab032522b). Its blocking findings are C-9 and C-10, Correctness, and E-5, Evidence. Its Documentation findings are N-19 to N-26; it names N-19 a Correctness case that does not block and must be fixed before code. Each Old text below occurs once in the form above this amendment, no two overlap, and each New text occurs nowhere above it.

2. **C-9, first replacement:** K-C27's row in the tests table.

Old:

````text
| K-C27 | `the_project_side_is_read_after_the_unsaved_locks_not_from_the_first_names` (unit test in `kernel/src/recovery.rs`; the start walk's private parameter, called after the locks and before the dedupe's names read, which the product passes as a no-op, makes U's twin folder there, its history held by the test: U not listed) | the dedupe's `<hex>` names taken from the walk's first read | K-C27 |
````

New:

````text
| K-C27 | `the_project_side_is_read_after_the_unsaved_locks_not_from_the_first_names` (unit test in `kernel/src/recovery.rs`; it calls the start's two private steps in the product's order: the walk, which takes and locks U and returns no folder names; then, after the test makes U's twin `<hex>` folder with its history held by the test, the dedupe, which reads the names itself: U not listed. The start's listing is the only product caller of both, and no parameter exists for the test) | the walk's first names passed to the dedupe and used for its `<hex>` side | K-C27 |
````

3. **C-9, second replacement:** the bullet on what K-C27 calls.

Old:

````text
     - K-C27 calls the start walk and its parameter, which do not exist then either.
````

New:

````text
     - K-C27 calls the start walk and the dedupe, which do not exist then either.
````

4. **C-9, third replacement:** the dedupe's first step.

Old:

````text
     1. The folder names under the root are read again. The names read before the locks are not used for it (C-8 (3)).
````

New:

````text
     1. The folder names under the root are read again, by the dedupe itself. The walk returns its taken records and no folder names, so the names read before the locks cannot reach it (C-8 (3)).
````

5. **C-10:** point (2)'s count of `metadata` calls.

Old:

````text
     - at most `MAX_DEDUPE_RECORDS` `metadata` calls on `<hex>` `locations.json` files;
````

New:

````text
     - one `metadata` call on the `locations.json` of each `<hex>` folder that the second read of the names returns, until `MAX_DEDUPE_RECORDS` + 1 of them have found one. A `<hex>` folder that holds no `locations.json` costs a call and does not count, so this count is bounded by the folders in the store, not by `MAX_DEDUPE_RECORDS`;
````

6. **E-5, first replacement:** K-C28's row.

Old:

````text
| K-C28 | `a_project_record_a_live_run_holds_is_neither_cleared_nor_offered_at_its_open` (the record has nothing after its mark, and the test holds it; after the call, the test drops its handle and reads both files by path, byte for byte) | `WouldBlock` taken as clearable | K-C28 |
````

New:

````text
| K-C28 | `a_project_record_a_live_run_holds_is_neither_cleared_nor_offered_at_its_open` (the record has nothing after its mark, and the test holds it; the reply lists no entry, in any state; after the call, the test drops its handle and reads both files by path, byte for byte) | `WouldBlock` taken as a lock held, so the record is read and judged through the listing's own handle (Windows: the read fails, H1, and an entry is listed `cannot-be-offered`; macOS/Linux: the record is cleared) | K-C28 |
````

7. **E-5, second replacement:** K-C34's row.

Old:

````text
| K-C34 | `a_twin_a_live_run_holds_is_left_when_its_projects_record_is_discarded` (after the call, the test drops its handle and reads the twin's files by path, byte for byte) | `WouldBlock` taken as removable | K-C34 |
````

New:

````text
| K-C34 | `a_twin_a_live_run_holds_is_left_when_its_projects_record_is_discarded` (after the call, the test drops its handle and reads the twin's files by path, byte for byte) | `WouldBlock` taken as a lock held, so the twin is read, judged and removed through the search's own handle (Windows: the read fails, H1, the twin is left and K-C34 passes, a named pass case; macOS/Linux: removed, observed on a macOS or Linux runner by a pushed mutation commit) | K-C34 |
````

8. **E-5, third replacement:** the known pass cases.

Old:

````text
   - **Known pass cases.** None is known for any mutation.
````

New:

````text
   - **Known pass cases.** None is known for any mutation but K-C34's on Windows, which its row names.
````

9. **E-5, fourth replacement:** the §5 addition after Predicted.

Old:

````text
   - **§5, added after "Predicted":** K-C28 and K-C34 fail under their mutations on Windows (H2) and on macOS/Linux (H3).
````

New:

````text
   - **§5, added after "Predicted":** K-C28 fails under its mutation on Windows (H1: an entry is listed) and on macOS/Linux (H3: the record is cleared). K-C34 fails under its mutation on macOS/Linux (H3) and passes on Windows (H1), as its row names.
````

10. **N-19, first replacement:** the start's rule for a taken record.

Old:

````text
On `WouldBlock`, any other failure, or a header the reader refuses, the taken record is withheld.
````

New:

````text
A candidate whose `history.jsonl` is absent, or 0 bytes, by its metadata is not a twin and is not locked. A save's move renames in a history that is full and already locked (`kernel/src/session_history.rs:558-562`), and the taken record's lock is held only after that mover has released it, so the taken record is the only copy and is listed. On `WouldBlock`, any other failure, or a header the reader refuses, the taken record is withheld.
````

11. **N-19, second replacement:** step 1 at the project's open.

Old:

````text
     1. It runs `try_lock` on the history. `WouldBlock` means a live run holds it: nothing is cleared and nothing is listed. Any other failure gives `cannot-be-offered` (`no-step`), as Amendment 2's C-4 text says.
````

New:

````text
     1. It reads the metadata of `history.jsonl`. When that file is absent, the folder holds no step: a save's move that ended before its rename (`kernel/src/session_history.rs:551-562`), or a Discard that ended between its removals, left it. It is cleared at that open with no question: its `locations.json`, any `history.jsonl.tmp-` file and the folder are removed. No run can be moving a history into it, because this open holds the project's `open.lock` (`kernel/src/project/mod.rs:781`, :876; ADR-036 Amendment 1 item 3) and a first save takes it (:396). Otherwise it runs `try_lock` on the history. `WouldBlock` means a live run holds it: nothing is cleared and nothing is listed. Any other failure gives `cannot-be-offered` (`no-step`), as Amendment 2's C-4 text says.
````

12. **N-19, third replacement:** K-C37's row, with the new rows K-C38 and K-C39 after it.

Old:

````text
| K-C37 | `recovering_an_unsaved_record_whose_twin_a_live_run_holds_is_refused_as_locked` (asserted on the reply) | step 3a skipped | K-C37 |
````

New:

````text
| K-C37 | `recovering_an_unsaved_record_whose_twin_a_live_run_holds_is_refused_as_locked` (asserted on the reply) | step 3a skipped | K-C37 |
| K-C38 | `an_unsaved_record_whose_projects_folder_holds_no_history_is_listed` (a `<hex>` folder holding a byte copy of U's `locations.json` and a `history.jsonl.tmp-` file, and no `history.jsonl`: U listed) | a candidate with no history withholds | K-C38 |
| K-C39 | `a_projects_folder_with_no_history_is_cleared_at_its_open` (the same folder, then `list_recoverable(handle)`: no entry, and the folder is gone) | the folder left in place | K-C39 |
````

13. **N-20, first replacement:** the twin rule's bullet on kept step ids.

Old:

````text
     - U's kept step ids, in order, are the first kept step ids of R, or neither holds a step.
````

New:

````text
     - U's history holds a header the reader accepts, and either U holds at least one kept step and its kept step ids, in order, are the first kept step ids of R, or neither holds a step.
````

14. **N-20, second replacement:** the probe on equal bytes.

Old:

````text
        - on equal bytes, `try_lock` on its history. `WouldBlock` leaves it, because a live run holds it, this run included (H1, H3), and any other failure leaves it too;
````

New:

````text
        - on equal bytes, `metadata` of its `history.jsonl`. An absent or 0-byte history is left unlocked: a history is created empty and locked only after that (`kernel/src/session_history.rs:516-523`), so an empty one may be another run's in that gap. Otherwise `try_lock` on its history. `WouldBlock` leaves it, because a live run or another instance's listing holds it, this run included (H1, H3), and any other failure leaves it too;
````

15. **N-21, first replacement:** item 76's first draft sentence.

Old:

````text
A saved project's session history leaves when that project is next opened, as item 70 says.
````

New:

````text
A saved project's session history with no change after its last save leaves when that project is next opened. One with changes after it leaves when its offer there is answered, as item 70 says.
````

16. **N-21, second replacement:** item 76's third bullet.

Old:

````text
  - When more than 256 sessions that never saved are kept, a saved project's session history that is recovered, discarded or cleared may leave behind the session it was moved from. That session is then listed at a later start, and holds only changes the project's history held.
````

New:

````text
  - When more than 256 sessions that never saved are kept, or when another window of the app is listing its sessions at that moment, a saved project's session history that is recovered, discarded or cleared may leave behind the session it was moved from. That session is then listed at a later start, and holds only changes the project's history held.
````

17. **N-22, first replacement:** where item 4's first Old text sits.

Old:

````text
The first of these Old texts sits in Amendment 2's C-4 New text; the other two are bullets of Amendment 2's item 4:
````

New:

````text
The first of these Old texts sits in §2.3's **At start** bullet; the other two are bullets of Amendment 2's item 4, an addition replaced in place by the same rule:
````

18. **N-22, second replacement:** the word skipped.

Old:

````text
whose `locations.json` bytes equal a `<hex>` record's and whose first kept step id equals that record's (Amendment 4 item 4) is skipped
````

New:

````text
whose `locations.json` bytes equal a `<hex>` record's and whose first kept step id equals that record's (Amendment 4 item 4) is not listed, and counts toward `MAX_RECOVERABLE_RECORDS`
````

19. **N-23:** the class label.

Old:

````text
These are class-9 scope additions, recorded before any code.
````

New:

````text
These are additions that the gate's answer and ADV-2026-11-23-16 bring, declared before any code. They are not class 9, because the ruling is not a standing rule, and not class 8, because no code exists.
````

20. **N-24:** the draft of the ADR-036 note for item 2, the advisor's to word.

Old:

````text
A draft, to follow that sentence: "A project's record that another run left, that no running session holds, and that holds no step after its last `saved-here` mark is cleared when that project is next opened, with no offer: nothing in it is unsaved."
````

New:

````text
A draft, to follow that sentence: "A project's record that another run left, that no running session holds, whose header names no action this version lacks, whose kept lines end with a `saved-here` mark and hold no `restored` mark, and in which the reader refuses no line but a torn last one, is cleared when that project is next opened, with no offer: its steps reach the project file that mark followed."
````

21. **N-25:** question (g), added after (f).

Old:

````text
   - (f) **The P6 drafts:** item 70 and item 76 (item 10), and R-S8 and R-S9 for step 3a's refusals.
````

New:

````text
   - (f) **The P6 drafts:** item 70 and item 76 (item 10), and R-S8 and R-S9 for step 3a's refusals.
   - (g) **Item 5's bound.** The ruling removes the twin unless a live run holds it. Item 3 also leaves a twin past `MAX_DEDUPE_RECORDS` `unsaved-` folders, and one that another instance's listing holds at that moment. Item 76's third bullet names both. Is that qualifier accepted?
````

22. **N-26:** K-C36's row.

Old:

````text
| K-C36 | `a_record_holding_a_restored_mark_is_listed_with_discard_only` (a header, s1, s2, a `restored` mark to s1, s3) | `restored` marks not considered | K-C36 |
````

New:

````text
| K-C36 | `a_record_holding_a_restored_mark_is_listed_with_discard_only` (a project's record at its open: a header, s1, s2, a `restored` mark to s1, s3, a `saved-here` mark after s3; listed `later-version`, and the folder is still there) | `restored` marks not considered (the record is then cleared) | K-C36 |
````

23. **The ceilings.** C-9's two private steps and N-19's rows K-C38 and K-C39 add product and test lines, which the gate puts at roughly 30 to 60 and 60 to 80. A row that passes its figure is re-declared by amendment before code, as the gate says. Whether 5,260 is accepted stays with the advisor (ADV-2026-11-23-22 item 5).
24. **For the advisor.** N-24's note words and N-25's question (g) go to the advisor with the other drafts. E-5's K-C34 is observed on macOS or Linux by a pushed mutation commit on such a runner; whether that waits for the macOS and Linux work paused until the tag is asked of the advisor.
25. Next: the architect's form gate, attempt 4, on this amendment. No code is written before it ends PASS or PASS WITH NOTES.

Read the last amendment first.

Nothing above is edited.

## Amendment 7 — 2026-11-23 — the custodian's, after the architect's form gate, attempt 4 (FAIL): that gate's replacement words for C-11, C-12 and N-27 to N-31, carried byte for byte

*Written by the custodian before any code. It carries the attempt-4 gate's own replacement words, each copied by script from the filed report in the report's order; it words nothing of its own but where each goes and what follows.*

1. Evidence: the architect's form gate, attempt 4, FAIL (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-4.md`, gate-log row 880; the hand-back's sha256 a517e323e9d8da33ab815a1437a90bc16de545eafe639baa47e245b843fabead). Its two Correctness findings, C-11 and C-12, are fixed by words alone, as the gate says; its five Documentation findings, N-27 to N-31, are fixed before the merge. Each Old text below occurs once in the form above this amendment, no two overlap, and each New text occurs nowhere above it.

2. **C-11, first replacement:** the open's step for a folder with no history (Amendment 6 item 11's New text).

Old:

````text
It reads the metadata of `history.jsonl`. When that file is absent, the folder holds no step: a save's move that ended before its rename (`kernel/src/session_history.rs:551-562`), or a Discard that ended between its removals, left it. It is cleared at that open with no question: its `locations.json`, any `history.jsonl.tmp-` file and the folder are removed. No run can be moving a history into it, because this open holds the project's `open.lock` (`kernel/src/project/mod.rs:781`, :876; ADR-036 Amendment 1 item 3) and a first save takes it (:396).
````

New:

````text
It reads the metadata of the folder, then of `history.jsonl`. When the folder is absent, nothing is listed and nothing is removed. When the folder is there and `history.jsonl` is absent, the folder holds no step: a save's move that ended before its rename (`kernel/src/session_history.rs:551-562`), or a Discard that ended between its removals, left it. It is cleared at that open with no question: its `locations.json`, any `history.jsonl.tmp-` file and the folder are removed; a removal that fails is ignored, as `end_session`'s are (`kernel/src/session_history.rs:444-446`), and the reply lists nothing for it. No other run can be moving a history into it: a first save mints a new identity (`kernel/src/project/mod.rs:320`), and a later save is of an open that holds its project's `open.lock` (:312-314, :409-415, :876; ADR-036 Amendment 1 item 3), which this open holds (:781). This open's own save cannot move into the folder while it is there, because the move's `create_dir` refuses a folder that exists (`kernel/src/session_history.rs:551`); a save during that one listing takes no move and moves at its next save (:347-348).
````

3. **C-11, second replacement:** the row K-C40, added after K-C39 (it adds a test; see item 9).

Old:

````text
| K-C39 | `a_projects_folder_with_no_history_is_cleared_at_its_open` (the same folder, then `list_recoverable(handle)`: no entry, and the folder is gone) | the folder left in place | K-C39 |
````

New:

````text
| K-C39 | `a_projects_folder_with_no_history_is_cleared_at_its_open` (the same folder, then `list_recoverable(handle)`: no entry, and the folder is gone) | the folder left in place | K-C39 |
| K-C40 | `a_reopen_with_no_record_folder_lists_nothing_and_removes_nothing` (a project saved, its recorder ended normally, then reopened in a new recorder with no `<hex>` folder: `list_recoverable(handle)` is `Ok` with no entry, and the root's folder names are unchanged) | the clear run on an absent folder, its removal errors returned | K-C40 |
````

4. **C-12:** C-9's answer on the callers of the two steps (Amendment 6 item 2's New text).

Old:

````text
The start's listing is the only product caller of both, and no parameter exists for the test)
````

New:

````text
The start's listing calls both, and `recover_session`'s step 3a calls the same dedupe for its one record (Amendment 4 items 4 and 5); no parameter exists for the test, and the mutation carries the first names inside the walk's returned value, so K-C27's calls compile unchanged)
````

5. **N-27:** held fixtures are not empty.

Old:

````text
"The test holds" means a `File` the test opens and locks itself.
````

New:

````text
"The test holds" means a `File` the test opens and locks itself; in K-C25 to K-C28, K-C34 and K-C37 the history so held holds a header and at least one step line, so that no `metadata` check reads it as absent or 0 bytes (Amendment 6 items 10 and 14).
````

6. **N-28:** the stale sub-bullet under the known pass cases.

Old:

````text
     - K-C28 and K-C34 drop the test's own handle before reading by path, so on Windows a removal the mutation made while that handle was open shows whichever delete semantics the system uses (H2). On macOS/Linux the file is unlinked.
````

New:

````text
     - K-C28 and K-C34 drop the test's own handle before reading by path. On Windows neither mutation removes a file, because its read through its own handle fails first (H1); on macOS/Linux the mutation unlinks the files (H3), and the read by path finds them gone.
````

7. **N-29:** point (2), with N-19's per-candidate `metadata` call.

Old:

````text
     - per candidate, one lock probe and at most `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES` + 2 bytes.
````

New:

````text
     - per candidate, one `metadata` call on its `history.jsonl`, and, unless that history is absent or 0 bytes, one lock probe and at most `MAX_HEADER_LINE_BYTES` + `MAX_STEP_LINE_BYTES` + 2 bytes.
````

8. **N-30:** the ceilings (Amendment 6 item 23's words).

Old:

````text
C-9's two private steps and N-19's rows K-C38 and K-C39 add product and test lines, which the gate puts at roughly 30 to 60 and 60 to 80. A row that passes its figure is re-declared by amendment before code, as the gate says.
````

New:

````text
C-9's two private steps, N-19's open step and dedupe check, N-20's twin check, C-11's words and K-C27's unit test add about 45 to 80 lines to `kernel/src/recovery.rs`; K-C38 to K-C40, K-C28's added assertion and K-C36's fixture add about 100 to 145 lines to `kernel/tests/recovery.rs`. Re-declared here, before code: kernel product 1,070 to 1,160; kernel tests 1,800 to 1,950; total ≤ 5,500, ≤ 50 files.
````

9. **N-31:** K-C36's fixture (Amendment 6 item 22's New text).

Old:

````text
a `saved-here` mark after s3; listed `later-version`, and the folder is still there)
````

New:

````text
a `saved-here` mark after s3; listed `later-version`, and the folder is still there; and the same lines without that mark as an `unsaved-` record at a start: listed `later-version`)
````

10. **For the advisor**, in one message with the other drafts (ADV-2026-11-23-15 item 8): item 8's re-declared figures, which the gate gives and whose acceptance is the advisor's; and, for K-C34's red on macOS or Linux, the gate's reading that the form is sound if that observation waits, on the two conditions it names. None is ruled here.
11. Next: the architect's form gate, attempt 5, on this amendment. No code is written before it ends PASS or PASS WITH NOTES. Nothing of it builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.

## Amendment 8 — 2026-11-23 — the custodian's, after the architect's form gate, attempt 5 (FAIL): that gate's replacement words for C-13, N-32 and N-33, carried byte for byte, and the pins of the cites its New texts add

*Written by the custodian before any code. It carries the attempt-5 gate's own replacement words, each copied by script from the filed report in the report's order, and the pins the gate leaves to the custodian; it words nothing of its own but where each goes and what follows.*

1. Evidence: the architect's form gate, attempt 5, FAIL (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-5.md`, gate-log row 882; the hand-back's sha256 0b807e022ca5bacd9c3385653609dba7e89dfc54a5c9f91b09ab46354c22eebe). Its one Correctness finding, C-13, is fixed by words that change what the code does, so §31's path without a re-gate does not cover it; its two Documentation findings, N-32 and N-33, are fixed before the merge. Each Old text below occurs once in the form above this amendment, no two overlap, and each New text occurs nowhere above it. The Old texts of items 3 to 6 are inside Amendment 7, and each is replaced where it stands there.

2. **C-13, first replacement:** the open's step, the 0-byte check before `try_lock`.

Old:

````text
Otherwise it runs `try_lock` on the history.
````

New:

````text
When the folder holds a `history.jsonl` of 0 bytes by its metadata, nothing is locked, listed or removed (§8 item 12): a history is created empty and locked only after that (`kernel/src/session_history.rs:516-523`), and while this open holds the project's `open.lock` only this open's own step can be making one. A 0-byte history that a crash between those lines left stays, and a save's move into its folder is refused (:551); that needs a crash inside one step, and is named. Otherwise it runs `try_lock` on the history.
````

3. **C-13, second replacement:** the row K-C41, added after K-C40 (Amendment 7 item 3's New text).

Old:

````text
| K-C40 | `a_reopen_with_no_record_folder_lists_nothing_and_removes_nothing` (a project saved, its recorder ended normally, then reopened in a new recorder with no `<hex>` folder: `list_recoverable(handle)` is `Ok` with no entry, and the root's folder names are unchanged) | the clear run on an absent folder, its removal errors returned | K-C40 |
````

New:

````text
| K-C40 | `a_reopen_with_no_record_folder_lists_nothing_and_removes_nothing` (a project saved, its recorder ended normally, then reopened in a new recorder with no `<hex>` folder: `list_recoverable(handle)` is `Ok` with no entry, and the root's folder names are unchanged) | the clear run on an absent folder, its removal errors returned | K-C40 |
| K-C41 | `a_projects_folder_with_an_empty_history_is_left_unlocked_at_its_open` (a `<hex>` folder holding a `locations.json` and a 0-byte `history.jsonl`, then `list_recoverable(handle)`: no entry, and both files are still there, byte for byte) | the 0-byte check removed at an open (the empty history is locked, read and listed `cannot-be-offered`, `no-step`) | K-C41 |
````

4. **C-13, third replacement:** the ceilings (Amendment 7 item 8's New text).

Old:

````text
kernel tests 1,800 to 1,950; total ≤ 5,500, ≤ 50 files.
````

New:

````text
kernel tests 1,800 to 1,980; total ≤ 5,530, ≤ 50 files. K-C41 and the open's 0-byte check add about 20 to 30 test lines and about 5 product lines, inside the product figure.
````

5. **N-32:** C-11's last sentence (Amendment 7 item 2's New text).

Old:

````text
This open's own save cannot move into the folder while it is there, because the move's `create_dir` refuses a folder that exists (`kernel/src/session_history.rs:551`); a save during that one listing takes no move and moves at its next save (:347-348).
````

New:

````text
A folder that was there before this open's own save or step began is never written into by it, because `create_dir` refuses a folder that exists (`kernel/src/session_history.rs:551` for a save's move, :486 for a step's new record); such a save returns its error and moves at its next save (:347-348). Named, and not blocking, because each case needs timing inside this listing's one request round trip: this open's own save's move (:551-562), or a step of this open after a save bound it (:484-523), has made the folder and not yet put `history.jsonl` in it when this listing reads them, and the clear then removes what it has written there, or the folder, so that save or step returns an error, or the project's record is left with no `locations.json`; or this open's `open.lock` is released during this listing, after its close, and another instance's save of the project then moves into the folder.
````

6. **N-33:** Amendment 7 item 3's pointer.

Old:

````text
(it adds a test; see item 9)
````

New:

````text
(it adds a test; see item 8)
````

7. **Pins of the cites the New texts add.** Each entry gives the sha256 of those lines at fe99e848713768a6d8338b96ee2b8ac4c9c891cb (each line with its LF, computed by script), and the findings whose New text cites it. A bare `:n` is read as the file named before it in the same New text.

- `kernel/src/session_history.rs:516-523` @ fe99e848713768a6d8338b96ee2b8ac4c9c891cb sha256:ec0c96af3a2a7ffac036aa9198566b3f05d44a3026e517808e2a712495f31673 — C-13
- `kernel/src/session_history.rs:551` @ fe99e848713768a6d8338b96ee2b8ac4c9c891cb sha256:a823bc686ba96974047e2e5a91f2cde8da092662fcd8993450e0d6138ba9925e — C-13, N-32; as written `:551`
- `kernel/src/session_history.rs:486` @ fe99e848713768a6d8338b96ee2b8ac4c9c891cb sha256:1ea8687200beaf81912ac1d0ee5fdaf0e22f08d3ab3b38c43447d01259569e04 — N-32; as written `:486`
- `kernel/src/session_history.rs:347-348` @ fe99e848713768a6d8338b96ee2b8ac4c9c891cb sha256:63469eaf5c5d0ab72b9f14bd0a8fa3323e0e2f675df7e8da6b95c5f7180ab03b — N-32; as written `:347-348`
- `kernel/src/session_history.rs:551-562` @ fe99e848713768a6d8338b96ee2b8ac4c9c891cb sha256:5136e2249e6231d994d14e70e7c70306253391187e0a91588af61cc00e247dbc — N-32; as written `:551-562`
- `kernel/src/session_history.rs:484-523` @ fe99e848713768a6d8338b96ee2b8ac4c9c891cb sha256:a971ee56357dc3225a677507127bdec489eb13311b3d3b40f6416ab1aee973b2 — N-32; as written `:484-523`

8. **For the advisor**, with Amendment 7 item 10, in one message (ADV-2026-11-23-15 item 8): item 4's New text re-declares the ceilings as kernel tests 1,800 to 1,980 and a total of at most 5,530 lines over at most 50 files; ADV-2026-11-23-22 item 5 did not accept 5,260, and whether these figures are accepted is the advisor's.

9. Next: the architect's form gate, attempt 6, on this amendment. No code is written before it ends PASS or PASS WITH NOTES. Nothing of this piece builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.

## Amendment 9 — 2026-11-23 — the custodian's, after the architect's form gate, attempt 6 (PASS WITH NOTES): that gate's replacement words for N-34 to N-36, carried byte for byte, and the pin of the cite its New texts add

*Written by the custodian before any code. It carries the attempt-6 gate's own replacement words, each copied by script from the filed report in the report's order, and the pin the gate leaves to the custodian; it words nothing of its own but where each goes and what follows.*

1. Evidence: the architect's form gate, attempt 6, PASS WITH NOTES (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-6.md`, gate-log row 884; the hand-back's sha256 7e9f33d25e95b6ff0146e0b608760cae5ceb2b53864995e43a8cff7454338c09). It has no Correctness and no Evidence finding, so the form has passed. Its three Documentation findings, N-34 to N-36, are fixed before the merge, and none asks for another attempt (ADV-2026-11-21-20); by the gate's reading of §31 (d), the worker applies these New texts with no re-gate and the PR body lists them. Each Old text below occurs once in the form above this amendment, inside Amendment 8, no two overlap, and each New text occurs nowhere above it.

2. **N-34, first replacement:** inside Amendment 8 item 5's New text.

Old:

````text
A folder that was there before this open's own save or step began is never written into by it
````

New:

````text
A folder with no `history.jsonl` that was there before this open's own save or step began is never written into by it
````

3. **N-34, second replacement:** inside Amendment 8 item 5's New text.

Old:

````text
such a save returns its error and moves at its next save
````

New:

````text
such a save's move returns its error and is tried again at its next save
````

4. **N-35:** inside Amendment 8 item 5's New text.

Old:

````text
so that save or step returns an error
````

New:

````text
so that save's move or that step returns an error
````

5. **N-36:** inside Amendment 8 item 2's New text.

Old:

````text
A 0-byte history that a crash between those lines left stays, and a save's move into its folder is refused (:551)
````

New:

````text
A 0-byte history that a crash left after it was made and before its header was written (:516-532) stays, and a save's move into its folder is refused (:551)
````

6. **Pin of the cite the New texts add.** It gives the sha256 of those lines at 55969f9849bce50230f7ae7c19c03bc73289517a (each line with its LF, computed by script). The cite `:551` in item 5's New text is in its Old text too, and is pinned in Amendment 8.

- `kernel/src/session_history.rs:516-532` @ 55969f9849bce50230f7ae7c19c03bc73289517a sha256:764b861b603f9c97aa87fbe43e23de0bfe10b60c1802b759bd79af339ad8d90d — N-36; as written `:516-532`, with no file named in that text: the file is the one the finding names

7. **Left by the gate to the build.** It had no Bash, so it could not check the six sha256 values of Amendment 8's pins: the reviewer's build gate recomputes them. On the ceilings, it reads the product headroom as about 5 lines, and a product figure past 1,160 as a class-8 record before code, never an edit of §7.

8. **The size.** The advisor's ruling ADV-2026-11-23-29 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-29-the-recovery-offer-5530-lines-accepted-in-two-gated-parts-one-pr-one-merge-adr-036-note-a-to-h.md`) accepts at most 5,530 lines over at most 50 files, on the condition that the piece is built in two gated parts inside one pull request with one merge.

9. Next: lead-data's Amendment 10, which gives the two parts, read alone by the architect (that ruling's item 3). The base is compared at dispatch; the identity route holds the `protocol/` place first (ADV-2026-11-23-26 item 3; ADV-2026-11-23-29 item 11). Nothing of this piece builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.

## Amendment 10 — 2026-11-23 — post-result amendment after ADV-2026-11-23-29 and the architect's form gate, attempt 6: the piece built in two gated parts inside one pull request, each part's files, tests and ceilings, the gates and their order, and the draft of the ADR-036 note

*Post-result amendment. It was written after two outcomes were seen: the architect's form gate, attempt 6, PASS WITH NOTES (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-6.md`), and the advisor's ruling ADV-2026-11-23-29 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-29-the-recovery-offer-5530-lines-accepted-in-two-gated-parts-one-pr-one-merge-adr-036-note-a-to-h.md`). Lead-data drafted it before any code. A ruling item is always cited as ADV-2026-11-23-29 item n. A bare "item n" is an item of this amendment. Every `path:line` is read at 55969f9849bce50230f7ae7c19c03bc73289517a. The drafter has no hashing tool, so the custodian pins each span's sha256 at filing. Amendment 9, the custodian's, carries N-34 to N-36, and this amendment changes none of their texts. Each Old text below occurs once in the form above Amendment 9, and none is inside an Old text of N-34 to N-36. Where an Old text is part of a line, only that part is replaced. Nothing here says anything about the base: the custodian compares it at dispatch (ADV-2026-11-23-29 item 11). No ceiling, note word, string or KNOWN-LIMITATIONS text is ruled here.*

1. **ADV-2026-11-23-29, recorded** (cited by item, not restated).
   - **Size.** At most 5,530 lines over at most 50 files is accepted for the whole piece, on the condition of item 2 of the ruling. Two gates reading the whole at once is not accepted (ADV-2026-11-23-29 items 1 and 2).
   - **Parts.** The piece is built in two gated parts inside one pull request, with one merge (ADV-2026-11-23-29 item 2). Items 2 to 6 below declare the parts.
   - **Version and the node.** No contract ruling, no second SKP version and no gap. The literal moves once, in Part 1, and the node is done at the one merge (ADV-2026-11-23-29 item 4). The human's OPEN-3 (A) of the 1c form is kept.
   - **(a):** not material. Amendment 4 item 2's clear stands, and its fallback is not taken (ADV-2026-11-23-29 item 5).
   - **(b) and (c):** one dated note is appended to ADR-036, in the advisor's words, from item 9's draft (ADV-2026-11-23-29 item 6). That draft supersedes Amendment 4 item 9's two drafts.
   - **(e):** not in this piece, and `end_session`'s rule stays (ADV-2026-11-23-29 item 7). The proposed node is the custodian's to add to the PLAN.
   - **(g):** the twin's bound is accepted (ADV-2026-11-23-29 item 8). See item 10.
   - **(f):** it and the other drafts (items 43, 70 and 76; R-S1 to R-S12) wait for the form's gate (ADV-2026-11-23-29 item 9).
   - **(h):** K-C34's red on macOS and Linux waits, on the gate's two conditions (ADV-2026-11-23-29 item 10). Item 4 records them. The line on the node is the custodian's.

2. **Part 1: the declared item first, then the three commands at one literal** (lead-data's Part A and Part 1; ADV-2026-11-23-29 item 2).
   - **Order.**
     - §2.5's declared writer comes first: K-C8 is committed and run red, then the writer lands.
     - Then come the three commands at the next unused literal (§2.4, as Amendment 2 N-6 has it), with their src-tauri handlers, the shell's callers and E-RECOVER.
   - **Rules it builds.** §2.3 to §2.8, as Amendments 2, 4 and 6 to 9 leave them, except what item 3 gives Part 2. In particular:
     - **At an open:**
       - A project's record that holds a step after its last `saved-here` mark, or steps and no mark, is offered.
       - A project's record with no step after its last mark is not listed and stays where it is, as §2.3 first had it (OPEN-2 (A) as filed).
       - A `<hex>` folder with no `history.jsonl` is not listed and stays where it is, as Amendment 2 N-13's bullet has it.
     - **The open's step,** as Amendments 4, 6, 7 and 8 word it (Amendment 4 item 2's step 1). Part 1 builds:
       - the folder's metadata, where an absent folder means nothing is listed and nothing is removed;
       - the metadata of `history.jsonl`;
       - the 0-byte rule (C-13);
       - `try_lock`, with its `WouldBlock` outcome and its other-failure outcome.
     - **At a start and in the two acts.** Part 1 also builds:
       - the start's walk and dedupe (Amendment 4 item 4, with C-9, C-10 and N-19's candidate rule);
       - `recover_session` with its step 3a (Amendment 4 item 5);
       - `discard_recoverable`, with no twin search;
       - the OPEN-4 (B) entries;
       - the `restored` mark read as `later-version` (Amendment 4 item 7).
     - **No twin removal.** `recover_session` and `discard_recoverable` on a project's record remove no twin.
   - **Files.** §2.11's files, as Amendments 2, 4, 7 and 8 leave them, except `KNOWN-LIMITATIONS.md` and `frontends/shell/MANUAL-WALKTHROUGH.md`, which only Part 2 touches. That is at most 45 files. Part 1 touches nothing under `docs/adr/`.
   - **Wire.**
     - The three commands: `list_recoverable`, `recover_session` and `discard_recoverable` (§2.4, as Amendment 2 C-7 revises it), with the four codes.
     - The types in `protocol/skp/src/v0/commands.rs` and the codes in `error.rs`.
     - `SKP_VERSION` moves once, in §2.4's 29 files, with:
       - SKP-V0 §1's and §4's counts;
       - the new version's §8 entry;
       - §10.3's clause (Amendment 2 N-12);
       - §13 to §15.
     - The conformance rows and the moved version-refusal row (Amendment 2 N-6).
     - **Callers.** Each command's caller chain is:
       - its src-tauri handler in `frontends/shell/src-tauri/src/commands.rs`, registered in `frontends/shell/src-tauri/src/lib.rs` (T-1);
       - then its wrapper in `frontends/shell/src/skp/client.ts`;
       - then `RecoveryOffer`: the list with `null` at mount and with the handle after an `opened` reopen, Discard, and Recover's `admit` through `runAdmitPath`;
       - with `handleRecovered` in `App.tsx` applying the returned intents.
       E-RECOVER drives this chain from the real shape.
   - **Kernel seams and items.** Each has its product caller in Part 1:
     - `Open.reopened_as` (C-1) is set in `reopened()` and read by `list_recoverable(handle)` and by `recover_session`'s handle arm.
     - `recover_bytes`, made `pub(crate)` (N-13), is called by the listing and the adopt.
     - The bounded read of a history's first two lines in `kernel/src/session_history.rs` (Amendment 4 item 11) is called by the start's dedupe and step 3a.
     - `LOCATIONS_LIMITS.max_bytes`, exposed `pub(crate)` in `kernel/src/project/store.rs` (Amendment 2 item 7), is used by the listing's read of `locations.json`.
     - `MAX_RECOVERABLE_RECORDS` and `MAX_DEDUPE_RECORDS` sit in `kernel/src/recovery.rs` (§7, as Amendments 2 and 4 add them) and bound the walk and the dedupe.
     - The start's two private steps (C-9) are called by the start's listing; the dedupe is also called by step 3a.
     - The record writer through `store::locations_to_bytes` (§2.5) is called by `record_step`'s first step, the existing path that `frontends/shell/src-tauri/src/commands.rs` serves.
     - The recorder's entry points for the three commands (§2.3) are called by those commands' handlers.
     No `pub` item lands without its product caller in Part 1.
   - **Shell surfaces.** All of §2.7:
     - `RecoveryOffer.tsx` and `handleRecovered`;
     - the three wrappers and their types;
     - three class-A rows in `surfaceRegistry.ts`, with `surfaceCompleteness.test.ts`'s eleven commands (D9);
     - the four codes in `formatRefusal.ts`;
     - R-S1 to R-S12, under the P6 marking.
   - **Tests.** Each keeps its row's mutation as the form last words it:
     - K-C1 to K-C8;
     - K-C9 as Part 1 has it (item 8);
     - K-C10 to K-C27;
     - K-C36, with its mutation as item 8 rewords it for each part;
     - K-C37, K-C38 and K-C41;
     - P-1 and T-1;
     - S-1 to S-8;
     - E-RECOVER.
   - **Red at B.**
     - Every row except K-C8 calls a command, type, component or private step that does not exist at B, as §4's rows and Amendments 2 and 4 say.
     - K-C8 is red at B by behaviour: the inline writer writes a path that the store's writer refuses (lead-data's parts view, Part A).
   - **Known pass cases in Part 1:** none.
   - **What Part 1's tests may not build.** Otherwise Part 2 would change a Part 1 test other than K-C9 (§5 I3, read against main; ADV-2026-11-23-29 item 2). No Part 1 test:
     - builds a project's record that Amendment 4 item 2's clear would clear, except K-C9;
     - builds a `<hex>` folder with no `history.jsonl` that is read at an open;
     - asserts that an `unsaved-` record stays after its project's record is recovered or discarded.
   - **What Part 1's head holds that Part 2 changes.** At H1:
     - a project's record with nothing after its last mark stays, and item 70's sign shows for it;
     - a twin stays after its project's record is recovered or discarded, and a later start lists it;
     - a `<hex>` folder with no history stays;
     - KNOWN-LIMITATIONS items 43, 70 and 76 and the walkthrough are as they are on main.
     None of this reaches main, because there is one merge (ADV-2026-11-23-29 item 2), so none of it is a limitation to name. Part 1's gates read these as Part 2's.
   - **Ceiling:** item 6's table.

3. **Part 2: the clear at an open and the removal of the twin, with the operator Part whole** (Amendment 4 items 2 and 3; ADV-2026-11-23-29 item 2).
   - **Rules it builds.**
     - All of Amendment 4 item 2, as Amendments 6 to 9 revise it, except the parts of its step 1 that item 2 gives Part 1. That is:
       - the clear of a folder with no `history.jsonl` (C-11);
       - the clear's conditions and its order (its steps 2 to 4);
       - the Discard-only case of its step 5;
       - its §2.4 addition.
     - All of Amendment 4 item 3, with N-20's probe: the twin search, called from `recover_session`'s step 4a, from `discard_recoverable`'s step 3a and from the clear (Amendment 4 item 5).
     - `MAX_DEDUPE_RECORDS` takes the third use that Amendment 4 item 11 gives it: the `unsaved-` folders that a twin search examines.
   - **Files.** Six:
     - `kernel/src/recovery.rs`;
     - `kernel/tests/recovery.rs`;
     - `protocol/skp/SKP-V0.md`;
     - `KNOWN-LIMITATIONS.md` (items 43, 70 and 76);
     - `frontends/shell/MANUAL-WALKTHROUGH.md` (the operator Part);
     - `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` (item 9's note).
     Any other file Part 2 needs is declared by amendment before its code.
   - **Wire.**
     - No command, field, code or literal is added.
     - SKP-V0 §13, §14 and §15 say what `list_recoverable(handle)`, `recover_session` and `discard_recoverable` remove. Part 2 says it in lines Part 1 added, which Part 2 changes, and in lines Part 2 adds (Amendment 4 item 2's §2.4 addition, with its section list corrected by item 8).
     - SKP-V0's append-only rule (`protocol/skp/SKP-V0.md:576-577`) is read against main, where all of these lines are new at the one merge (ADV-2026-11-23-29 item 2).
     - Part 2 adds no field. So it does not change the version's §8 entry, which is that version's full field set under condition (ii) of `protocol/skp/SKP-V0.md:314-319`. The literal freezes once, at the merge (condition (iv) of the same lines).
   - **Kernel seams.** None new, and no `pub` item. Part 2 adds two private functions in `kernel/src/recovery.rs`:
     - the clear, called from `list_recoverable(handle)`;
     - the twin search, called from `recover_session`'s step 4a, `discard_recoverable`'s step 3a and the clear.
     All three callers are Part 1's commands, which ship with their shell callers. No module seam is crossed.
   - **Shell surfaces:** none. The clear's reply lists nothing for the record, which Part 1's `RecoveryOffer` already shows as no offer.
   - **Tests.** Each keeps its row's mutation:
     - **K-C9,** changed to Amendment 4 item 8's row. This is Part 2's only edit of a Part 1 test (ADV-2026-11-23-29 item 2). Part 1 builds K-C9's fixture as that row describes it: a header, a step, a `saved-here` mark after the step and a torn last line, left by another recorder dropped without `end_session`. So Part 2 changes only its name, its assertions and its mutation.
     - **K-C28 to K-C35, K-C39 and K-C40,** added in `kernel/tests/recovery.rs`.
     - **Red at H1, and the tests that rest on their mutations:** item 4.
     - **Mutations observed again at H2:**
       - K-C36's and K-C41's, whose mutated lines are in the open's step, which Part 2 rewrites;
       - those of any other Part 1 row whose mutated line Part 2's diff changes.
       Part 2's closing record names each one.
     - **Known pass case:** K-C34's mutation on Windows (Amendment 6 item 7).
   - **§8.**
     - Items 13 and 15 are read on Part 2's diff.
     - Item 13 is also read on Part 1's `discard_recoverable`.
     - Item 14 is read on Part 1's dedupe.
   - **Records.**
     - Items 43, 70 and 76 are worded once (ADV-2026-11-23-29 item 2), under the placeholder mark until the advisor words them (ADV-2026-11-23-29 item 9).
     - The operator Part lands whole: OP-R1 to OP-R5 and OP6, with one blank log (Amendment 4 item 10).
     - Item 9's note lands in the advisor's words.
     This amendment does not change when the operator Part is run.
   - **Ceiling:** item 6's table.

4. **Red before the fix, by part** (ADV-2026-11-23-29 item 2, its last bullet).
   - **Part 1:** every row is red at B, as item 2 says.
   - **Part 2, red at H1 by behaviour.** Each is committed and run red on H1's line before Part 2's code:
     - **K-C9:** at H1 the record is not listed and its folder stays. The row's assertion that the folder is gone fails, and so does its assertion that the open's save writes the mark.
     - **K-C30:** at H1 the record keeps a header, s1 and the mark. So it holds nothing after its last mark and is not listed, while the row asserts an entry with Discard only.
     - **K-C31 and K-C32:** at H1 no twin is removed.
     - **K-C33:** at H1 no twin is removed, and the record is not cleared.
     - **K-C39:** at H1 the folder with no history stays where it is.
   - **Part 2, not red before Part 2's code; each rests on its mutation alone.**
     - **K-C28:** at H1, `WouldBlock` lists nothing and removes nothing, which is what the row asserts.
     - **K-C29:** at H1 the record is offered and its folder stays.
     - **K-C34:** at H1 no twin is removed. On Windows its mutation also passes (Amendment 6 item 7), so on Windows nothing shows K-C34 failing. Its one failing observation is its mutation on a macOS or Linux runner.
     - **K-C35:** at H1 the `unsaved-` record stays, and once R is gone it is listed.
     - **K-C40:** at H1 an open with no record folder lists nothing and removes nothing. It is added to the four that the advisor named (ADV-2026-11-23-29 item 2), because K-C40 came after the parts view (Amendment 7 item 3).
     These five are committed in Part 2 and pass at H1. Each one's evidence is its mutation alone, observed at H2: applied, run, recorded by name with its commit, and reverted. This is the exception to §4's heading rule, declared here before code.
   - **K-C34 on macOS and Linux** (ADV-2026-11-23-29 item 10).
     - Part 2's closing record says that K-C34's red under its mutation has not yet been observed on macOS or Linux, and names the Windows run as its pass case.
     - No record claims that K-C34 proves the probe there.
     - The advisor does not count a pushed mutation commit as covering it before the tag.
     - The observation is owed when the human's pause on the macOS and Linux work ends.

5. **The gates and the order** (ADV-2026-11-23-29 item 2).
   - **Part 1** ends at a pushed head H1 at which every suite of §9 is green. H1's commit id is named in the amendment that records it and in the PR body. Both gates read the diff from B to H1, with B as §2.11 and §9 name it.
   - **Part 2** is built on H1 and ends at a pushed head H2 at which every suite of §9 is green. Both gates read the diff from H1 to H2, with the Part 1 lines it touches.
   - Part 2's build does not wait for Part 1's gates.
   - **A correction to Part 1 after its gate:**
     - It is made on Part 1's line, from that line's last head.
     - It is merged forward into Part 2's line by a merge commit.
     - The gate that asked for it reads it narrowly.
     - Part 2's gates then read from the last Part 1 head merged into Part 2's line, up to H2.
     The branch names are the custodian's.
   - **One pull request and one merge.** The merge comes after both parts' gates have passed and every correction has had its narrow read, on §9's merge terms, which this amendment does not change. At that merge:
     - no state between the parts has reached main;
     - the literal freezes, once;
     - items 70 and 76 have been worded once;
     - the node is done (ADV-2026-11-23-29 item 4).
   - **Where Part 2 changes lines Part 1 added:**
     - `kernel/src/recovery.rs`: the open's step and the call sites in the two acts;
     - SKP-V0 §13 to §15;
     - K-C9.
     Of the records and tests, Part 2 changes no other Part 1 line.
   - **Mutations.** Each part's mutations are observed at that part's own head, as §4's last bullet says. Part 2's repeat observations are listed in item 3.

6. **The ceilings, by part.** These are §2.11's groups. Each figure is a ceiling: passing it is class 8, recorded before the code that passes it, and §7 is never edited.

| Group | Part 1 | Part 2 | Together (§2.11 as Amendments 2, 4, 7 and 8 leave it) |
|---|---|---|---|
| protocol (`SKP-V0.md`, `src/v0/{commands,error,mod}.rs`) | 330 | 20 (`SKP-V0.md` only) | 350 |
| conformance + fixtures | 220 | 0 | 220 |
| literal | 260 | 0 | 260 |
| kernel product | 950 | 210 (`recovery.rs` only) | 1,160 |
| kernel tests | 1,510 | 470 (`tests/recovery.rs` only) | 1,980 |
| src-tauri | 100 | 0 | 100 |
| shell product | 500 | 0 | 500 |
| shell tests | 500 | 0 | 500 |
| e2e | 300 | 0 | 300 |
| records (items 43, 70 and 76; the operator Part; item 9's note) | 0 | 160 | 160 |
| **Total** | **≤ 4,670, ≤ 45 files** | **≤ 860, ≤ 6 files** | **≤ 5,530; 48 files in the union** |

   - **Counting.** §2.11's counting command, with Amendment 2 N-8's exclusions, is run three times:
     - for Part 1, over `B...H1`;
     - for Part 2, over `H1...H2`, starting from the last Part 1 head merged in if a correction came after Part 1's gate;
     - for the whole, over `B...H2`, at the merge check, against at most 5,530 lines and at most 50 files.
   - **The added file.** `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` joins the records group for item 9's note, which ADV-2026-11-23-29 item 6 brings. It is declared before any code. With it, the union is 48 files of 50.
   - **What the split costs.** Part 2's count includes the Part 1 lines it rewrites, which a count of the whole would count only once:
     - K-C9: about 10 to 20 lines;
     - SKP-V0 §13 to §15: about 6 to 10 lines;
     - the open's step and the two acts' call sites in `recovery.rs`: about 10 to 20 lines.
     That is about 25 to 50 lines, and Part 2's figures carry them. The figures they are cut from leave about 15 lines unspent: about 5 in kernel product, by the attempt-6 report's Ceilings section, and about 10 in records. So the sum of the parts' counts may pass 5,530 by up to about 35 lines. This goes to the advisor (item 11).
   - **Source comments.** The attempt-6 report's Ceilings section names the risk that the source comments §31(c) needs use up the kernel product headroom. That risk sits in both parts' kernel product figures.

7. **Records, by part.**
   - `KNOWN-LIMITATIONS.md` items 43, 70 and 76, the operator Part, and item 9's note are Part 2's alone.
   - Part 1's gates read their state at H1 as Part 2's, and not as a finding against Part 1 (item 2).

8. **The form text the split changes.**
   - **The title block, its line on form and gating.**

Old:

````text
**Form and gating:** a full form with architect and reviewer gates (template §21a: wire, guarantee, ADR-adjacent).
````

New:

````text
**Form and gating:** a full form with architect and reviewer gates (template §21a: wire, guarantee, ADR-adjacent), built in two gated parts inside one pull request with one merge (ADV-2026-11-23-29 items 1 and 2; Amendment 10 items 2 to 6).
````

   - **§1, the ADRs line.**

Old:

````text
**ADRs:** none is amended. ADR-036 §9 and the 2026-10-07 ruling are applied as read.
````

New:

````text
**ADRs:** none is amended. One dated note is appended to ADR-036 in Part 2, and no line of ADR-036 is edited; its words are the advisor's, from the draft of Amendment 10 item 9, once the form's gate has passed (ADV-2026-11-23-29 item 6). ADR-036 §9 and the 2026-10-07 ruling are otherwise applied as read.
````

   - **§5, Predicted.**

Old:

````text
every §4 test is red before its code and green after.
````

New:

````text
every §4 test is red before its code and green after, in its own part (Amendment 10 items 2 and 3), but for K-C28, K-C29, K-C34, K-C35 and K-C40, which pass at Part 2's base and rest on their mutations (Amendment 10 item 4).
````

   - **§5, Declared unchanged.**

Old:

````text
ADR-036's text; items 62, 71, 72 and 73.
````

New:

````text
ADR-036's text, but for the one dated note appended in Part 2 (Amendment 10 item 9); items 62, 71, 72 and 73.
````

   - **§9, the Reviewer's diff** (the New text of Amendment 2 N-7).

Old:

````text
The full diff: `B..HEAD`, with B the recorded base (§2.11);
````

New:

````text
The diff of each part, read by both gates (Amendment 10 item 5): Part 1's from B to its head H1, and Part 2's from H1, or from the last Part 1 head merged into it after a correction, to its head H2, with what it touches in Part 1; B is the recorded base (§2.11);
````

   - **Amendment 4 item 2's §2.4 addition, the SKP-V0 sections it names.** §2.4's §10.3 draft puts the restore in §14, so `recover_session`'s twin removal belongs in §14.

Old:

````text
The new §13 and §15 of SKP-V0 say so.
````

New:

````text
The new §13, §14 and §15 of SKP-V0 say so, in lines Part 2 adds or changes (Amendment 10 item 3).
````

   - **Amendment 4 item 8, Red before the fix.**

Old:

````text
Each K-C row, the changed ones included, calls `list_recoverable`, `recover_session` or `discard_recoverable`, and none of them exists at the red commit.
````

New:

````text
Each Part 1 K-C row but K-C8 calls `list_recoverable`, `recover_session` or `discard_recoverable`, or a private step of the start, and none of them exists at Part 1's red commit; K-C8 is red there by behaviour. Part 2's rows are red at Part 1's head by behaviour, or rest on their mutations, as Amendment 10 item 4 says.
````

   - **K-C36's mutation** (Amendment 6 item 22's New text).

Old:

````text
`restored` marks not considered (the record is then cleared)
````

New:

````text
`restored` marks not considered (in Part 1 the project's record is then not listed, and the `unsaved-` record is listed with its steps; in Part 2 the project's record is then cleared)
````

   - **K-C9, read by part** (added to §4 after its table).
     - In Part 1, K-C9 is §4's row as first filed, with its first name and its first mutation.
     - From Part 2 on, K-C9 is Amendment 4 item 8's row.
     - Both versions are in `kernel/tests/recovery.rs`.
   - **§2.12, a row added after D21:**
     - | D22 | gate | step 3 as one pull request, read whole by its gates | two gated parts inside one pull request, one merge (Amendment 10 items 2 to 6) | ADV-2026-11-23-29 items 1 and 2 |

9. **The ADR-036 note** (ADV-2026-11-23-29 item 6).
   - **Sources.** Drafted from Amendment 4 item 9's two drafts, the first as Amendment 6 item 20 rewords it, and from question (b).
   - **Whose words.** They are the advisor's, after the form's gate. The architect reads this draft with this amendment.
   - **Where it goes.** It is appended after ADR-036's last amendment, and no line above it is edited.
   - **When it lands.** Part 2 lands it in the advisor's words. If H2 is reached before those words are given, the merge waits for the commit that lands them, and that commit gets a narrow read. The note's date is that commit's.

````text
## Note <date> — what the recovery offer clears unasked, the record a first save moved from, and what a start withholds (b2-piece-1c-step-3-recovery-offer)

*Appended under the advisor's ruling ADV-2026-11-23-29, item 6, under the delegation of 2026-11-13. The text above is unchanged, Amendments 1 to 4 included.*

1. **A project's record with nothing after its last save** (§9, the bullet on when a history is cleared). When a project is opened, a record of it that another run left is cleared, with no offer, if no running session holds it, its header names no action this version lacks, its kept lines hold a `saved-here` mark with no step after the last one and hold no `restored` mark, and the reader refuses no line of it but a torn last one. Its steps reach the project file that mark followed, and a normal end of the run that left it would have cleared it.
2. **The `unsaved-` record a first save moved from** (Amendment 1, item 5). When a project's record is recovered, declined, or cleared at the project's open, an `unsaved-` record is removed with it if its `locations.json` is the project record's byte for byte, the reader accepts its header, and either its kept step ids, in order, are the first kept step ids of the project's record, or neither record holds a step. It stays when another run holds it, as a running session or a listing does, when it cannot be locked or read, or when it is not among the first 256 `unsaved-` records examined. It is then offered at a later start, once the project's record is gone, and holds only steps the project's record held.
3. **What a start withholds** (§9, the bullet on a session that never saved). A start does not offer a session that never saved whose `locations.json` is, byte for byte, that of a project's record that another run holds or that the start cannot lock or read. It offers no session that never saved while more than 256 project records hold a `locations.json`, or while one of them cannot be examined. When it withholds a session, it says that more are kept. A session whose steps a project's record already holds is not offered at a start either: it is offered as that project's, when the project is opened (Amendment 1, item 5).
````

10. **Item 76 and the twin's bound** (ADV-2026-11-23-29 item 8).
    - Item 76's third bullet, as Amendment 6 item 16 rewords it, already names both cases: a twin past the 256 examined, and a twin that another window's listing holds at that moment.
    - No sentence is added.
    - Its words wait for the form's gate, with item 76's other bullets (ADV-2026-11-23-29 item 9).

11. **For the advisor.** None of these is ruled here.
    - (i) **The sum of the lines.** The parts' ceilings sum to 5,530. But Part 2's count holds about 25 to 50 lines of Part 1 that it rewrites, and the figures leave about 15 lines unspent, so the sum may pass 5,530 by up to about 35 lines (item 6). Is a pass of that size accepted now, or ruled when it is recorded as class 8?
    - (ii) **The count of files.** The union is 48 of 50. Counted part by part, 45 and 6 sum to 51, because three files are in both parts. Which count do the 50 files of ADV-2026-11-23-29 item 3 mean?
    - (iii) **A third case in the note.** The note's item 2 names a third case in which a twin stays: a lock or a read that fails. Amendment 4 item 3's probe leaves the twin in that case, but ADV-2026-11-23-29 item 8 does not name it.
    - (iv) **A case the note leaves out.** The note does not name the clear at an open of a project's folder that holds no `history.jsonl` (C-11), because that folder holds no session history. If the note should name it, the advisor words it.

12. **Superseded by this amendment, by section:**
    - the title block (form and gating);
    - §1 (ADRs);
    - §2.10 (items 43, 70 and 76 land in Part 2);
    - §2.11, as Amendments 2, 4, 7 and 8 revise it: the ceilings by part, the records group's added file, and the counting by part;
    - §2.12 (D22 added);
    - §4: each row's part, K-C9 by part, K-C36's mutation, Amendment 4 item 8's red-before-fix bullet, and the five rows that rest on their mutations;
    - §5 (Predicted; Declared unchanged);
    - §9: the Reviewer's diff, and the gates and their order by part;
    - Amendment 4 item 2's §2.4 addition (the SKP-V0 sections it names);
    - Amendment 4 item 9 (its two drafts, replaced by item 9's note);
    - Amendment 4 item 12 (a), closed by ADV-2026-11-23-29 item 5.

13. **Next:** the architect reads this amendment alone (ADV-2026-11-23-29 item 3). No code is written before that gate ends PASS or PASS WITH NOTES. Amendment 8 item 9's hold for the sitting still applies.

Read the last amendment first.

Nothing above is edited.

## Amendment 11 — 2026-11-23 — the custodian's, at the commit that files Amendment 10: references and the pins of its cites

*Written by the custodian at the commit that files Amendment 10, before any code. References and hashes only.*

1. Amendment 10 is lead-data's draft, appended byte for byte from its consult, `state/consults/2026-11-23-b2-piece-1c-step-3-recovery-offer-amendment-10-lead-data-draft.md` (the hand-back's sha256 0f4c80177c6e0a9ea151690f743684b2942234d29d451248125060d19f0fcb8e): the text between its two marker lines.
2. Its evidence is the architect's form gate, attempt 6, PASS WITH NOTES (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-6.md`), and the advisor's ruling ADV-2026-11-23-29 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-29-the-recovery-offer-5530-lines-accepted-in-two-gated-parts-one-pr-one-merge-adr-036-note-a-to-h.md`).
3. Its cites are read at 55969f9849bce50230f7ae7c19c03bc73289517a. Of its 17 four-backtick text blocks, 8 occur exactly once in the form above it (its Old texts) and 9 do not occur (its New texts and the ADR-036 note's draft), counted by script at filing. The sha256 of each `path:line` span it cites, each line with its LF, computed by script:

- `protocol/skp/SKP-V0.md:576-577` @ 55969f9849bce50230f7ae7c19c03bc73289517a sha256:0f0b5ca54a7e882a7458ca1e8d1c196a6abfc29535fd1ca805f80e918796d3f8
- `protocol/skp/SKP-V0.md:314-319` @ 55969f9849bce50230f7ae7c19c03bc73289517a sha256:bc29b479c22c1657b4fd3ab61828aeb71fa4402dc2c1a3dd8d3b196cad07f3c0

4. Its questions for the advisor (its item 11, (i) to (iv)) go to the advisor in one message with the architect's reading (ADV-2026-11-23-15 item 8); none is ruled here. The proposed node for (e) and the line for (h) are in the PLAN.
5. Next: the architect reads Amendment 10 alone (ADV-2026-11-23-29 item 3). No code is written before that read ends PASS or PASS WITH NOTES. Nothing of this piece builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.

## Amendment 12 — 2026-11-23 — the custodian's, after the architect's form gate, attempt 7 (PASS WITH NOTES): that gate's replacement words for N-37 to N-40, carried byte for byte; N-41 to the advisor; the literal under ADV-2026-11-23-35

*Written by the custodian before any code. It carries the attempt-7 gate's own replacement words for the form's sentences, each copied by script from the filed report in the report's order; it words nothing of its own but where each goes and what follows.*

1. Evidence: the architect's form gate, attempt 7, PASS WITH NOTES (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-7.md`, gate-log row 885; the hand-back's sha256 40aadff6d4ee51e4063ae32d58696997a0b1e4ef521a9db6f4fc9c95a32e9e06), which read Amendment 10 alone with Amendments 9 and 11 (ADV-2026-11-23-29 item 3). It has no Correctness and no Evidence finding. Its Documentation findings N-37 to N-40 are on lead-data's sentences of Amendment 10: they are fixed before the merge, none asks for another attempt (ADV-2026-11-21-20), and by the gate's reading of §31 (d) the worker applies these New texts with no re-gate and the PR body lists them. Each Old text below occurs once in the form above this amendment, inside Amendment 10, no two overlap, each New text occurs nowhere above it, and no New text adds a cite. All are checked by script.

2. **N-37:** inside Amendment 10 item 2.

Old:

````text
A project's record with no step after its last mark is not listed and stays where it is, as §2.3 first had it (OPEN-2 (A) as filed).
````

New:

````text
A project's record with no step after its last mark is not listed and stays where it is, as §2.3 first had it (OPEN-2 (A) as filed), unless its header's `actions` is over `ACTIONS` or its kept lines hold a `restored` mark: such a record is listed `later-version` with Discard only (OPEN-4 (B); Amendment 4 item 7), as K-C36 asserts at an open.
````

3. **N-38:** inside Amendment 10 item 3.

Old:

````text
Items 13 and 15 are read on Part 2's diff.
````

New:

````text
Every §8 item, the 1c form's items that §8 applies included, is read on each part's diff; items 13 and 15 bear on Part 2's diff in particular.
````

4. **N-39, first replacement:** inside Amendment 10 item 6.

Old:

````text
That is about 25 to 50 lines, and Part 2's figures carry them.
````

New:

````text
That is about 25 to 50 lines that Part 2 rewrites. §2.11's command counts both numstat columns, so each Part 1 line that Part 2 deletes is counted twice in the parts and not at all in the whole: once as Part 1's addition and once as Part 2's deletion. The parts' counts together therefore pass the whole's by up to twice those lines, about 50 to 100, and Part 2's figures carry the share that falls in Part 2.
````

5. **N-39, second replacement:** inside Amendment 10 item 6.

Old:

````text
So the sum of the parts' counts may pass 5,530 by up to about 35 lines.
````

New:

````text
So the sum of the parts' counts may pass 5,530 by up to about 85 lines.
````

6. **N-39, third replacement:** inside Amendment 10 item 11.

Old:

````text
so the sum may pass 5,530 by up to about 35 lines (item 6)
````

New:

````text
so the sum may pass 5,530 by up to about 85 lines, twice the rewritten lines less the 15 unspent (item 6)
````

7. **N-40:** inside Amendment 10 item 11.

Old:

````text
the 50 files of ADV-2026-11-23-29 item 3
````

New:

````text
the 50 files of ADV-2026-11-23-29 item 1
````

8. **N-41** is on the ADR-036 note's draft in Amendment 10. Those words are the advisor's to rule (ADV-2026-11-23-29, `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-29-the-recovery-offer-5530-lines-accepted-in-two-gated-parts-one-pr-one-merge-adr-036-note-a-to-h.md`), so the gate's two replacements, (a) and (b), go to the advisor with the report and are not carried here. Each of their Old texts occurs once, inside Amendment 10, checked by script.

9. **Left by the gate to the build.** It had no Bash, so it did not check the sha256 values in Amendment 11 items 1 and 3; the reviewer's build gate recomputes them. Its notes for the build, on K-C8's red reason and on K-C36's two halves, are read by the worker from the report.

10. **To the advisor, in one message** (ADV-2026-11-23-15 item 8): Amendment 10 item 11's questions (i) to (iv) with the gate's reading; lead-data's question on the dated note under the grant's item 2; the gate's offer of a second mutation for K-C34; N-41. None is ruled here.

11. **The literal.** ADV-2026-11-23-35 item 2 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-35-the-bases-identity-route-then-text-id-then-recovery-offer-each-the-next-unused-literal-recovery-build-held-until-a-green-head.md`) builds this piece on the text-id piece's head and gives it the next unused literal after that piece's, in place of the literal of ADV-2026-11-23-29. Amendment 10 item 2 already says the next unused literal. No tracked record of this piece names `skp/0.16` (this form, its consults and its gate reports, checked by script at this commit), so no number is corrected.

12. Next: the build waits until the text-id build has a pushed head with its suites green (ADV-2026-11-23-35 item 3), and for the advisor's answers to item 10. No code is written before both. Nothing of this piece builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.

## Amendment 13 — 2026-11-23 — the custodian's, under ADV-2026-11-23-38 and ADV-2026-11-23-39: references only

*Written by the custodian before any code. It holds the two rulings by reference and words nothing of its own.*

1. **Authority.** The advisor's rulings ADV-2026-11-23-38 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-38-the-recovery-offers-seven-points-after-attempt-7-as-the-gate-recommends-k-c34-a-second-mutation-the-adr-036-notes-words.md`) and ADV-2026-11-23-39 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-39-the-recovery-offers-strings-r-s1-to-r-s12-and-known-limitations-items-43-70-and-the-new-item-worded.md`), under the human's delegation of 2026-11-13; neither is the human's words.
2. **Amendment 10 item 11 (i) to (iv)** are ruled by ADV-2026-11-23-38 items 1 to 4, as written there: the cap of the lines is for the whole over `B...H2`, the two part figures are budgets, and its item 1 says when a part's overrun is class 8 and when it comes to the advisor before the code; the count of files is the union over `B...H2` (its item 2); the third case of a twin and the folder with no history are named in the note (its items 3 and 4).
3. **K-C34** gains the second mutation of ADV-2026-11-23-38 item 6. Lead-data drafts its row in an amendment before code; what that item says follows if the mutation does not fail on Windows at H2.
4. **The ADR-036 note** is the text fenced in ADV-2026-11-23-38 item 8. Part 2 appends it to `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` after Amendment 4, byte for byte, with `<date>` filled with the date of the commit that lands it (its item 8); Part 2's gates check each clause of it against the code, and the advisor compares it byte for byte at the merge check (its item 10). It replaces lead-data's draft of the note in this form.
5. **The strings and the KNOWN-LIMITATIONS items.** R-S1 to R-S12 are the words of ADV-2026-11-23-39 item 1 and land in Part 1; KNOWN-LIMITATIONS items 43, 70 and the new item are the words of its items 3 to 5 and land in Part 2, the new item at the next free number at Part 2's base (its item 5); where the new item depends on the build is its item 6, and how they land is its item 7. The build's gates check every clause, and the advisor compares each byte for byte at the merge check.
6. **Next.** Lead-data's K-C34 row, as an amendment before code. The build stays held until the text-id piece's build has a pushed head with its suites green (ADV-2026-11-23-35 item 3, `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-35-the-bases-identity-route-then-text-id-then-recovery-offer-each-the-next-unused-literal-recovery-build-held-until-a-green-head.md`). Nothing of this piece builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.

## Amendment 14 — 2026-11-27 — the custodian's: ADV-2026-11-27-24 item 3, this piece behind text-id's C1 follow-up piece

*References only. Nothing above is edited.*

1. **The ruling** is ADV-2026-11-27-24, filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-24-text-ids-c1-follow-up-way-a-identity-source-carried-by-the-engine-skp-0-17-on-one-protocol-line-the-recovery-offer-behind-it.md`. Its item 3 replaces ADV-2026-11-23-35 item 2 for this piece's base:
   - this piece is built on the head of `text-id-reopen-with-a-recorded-declaration`;
   - it takes the next unused literal after that piece's `skp/0.17`.
2. **Its build is held** at least until that piece's build has a pushed head with its suites green. This replaces the reading of ADV-2026-11-23-35 item 3 that Amendment 12 item 12 and Amendment 13 item 6 record.
3. **No figure is corrected.** No tracked record of this piece names `skp/0.17` or a later literal as its own. Amendment 12 item 11 already gives it the next unused literal.

## Amendment 15 — 2026-11-27 — the custodian's: ADV-2026-11-27-33 item 3, two steps now, and the base ruled before Part 1's code

*References only. Nothing above is edited. Written before any code.*

1. **The ruling** is filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-33-three-free-places-the-null-refusal-builds-on-the-c1-head-the-recovery-offers-k-c34-row-and-a-narrow-read-now-the-fixture-node-s3.md`. By its item 3, the hold of ADV-2026-11-27-24 item 3 (Amendment 14 item 2) has met its condition. The C1 piece's build has a pushed head with its suites green, f7770e1a.
2. **Now, lead-data's K-C34 row,** by an amendment, as Amendment 13 item 3 has it under `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-38-the-recovery-offers-seven-points-after-attempt-7-as-the-gate-recommends-k-c34-a-second-mutation-the-adr-036-notes-words.md`, item 6.
3. **Now, the architect's narrow read,** with no verdict, filed as a consult. It reads Part 1 against the C1 piece's head f7770e1a, and against B's head 5ce0525a with ADR-037 as that head has it, for the three handlers Amendment 10 item 2 puts into `frontends/shell/src-tauri/src/commands.rs` and registers in `frontends/shell/src-tauri/src/lib.rs`. It answers the ruling's item 3 questions, names the shared paths, and recommends the base. It goes to the advisor, who rules the base before Part 1's code.
4. **The merge:** whatever the base, after B (the ruling's item 3).
5. **Amendment 13 item 6's last sentence** is read with item 5 of ADV-2026-11-26-01, as the human approved it (`state/directives/2026-11-26-the-humans-message-adv-2026-11-23-34-and-adv-2026-11-26-01-approved-two-additions-release-v0-2-into-main-once-the-architect-reads-what-assumes-main-two-text-id-lab-facts.md`): work goes on between the sitting's parts. While the human sits on a part, this piece is held as every piece is. This records the reading before the code, as the ruling's item 3 asks.

## Amendment 16 — 2026-11-27 — the custodian's: K-C34's row (Amendment 13 item 3) and the architect's read of Part 1 (ADV-2026-11-27-33 item 3)

*References and lead-data's row only. Nothing above is edited. Written before any code.*

1. **K-C34's row.** Lead-data's draft is filed at `state/consults/2026-11-27-b2-piece-1c-step-3-recovery-offer-k-c34-second-mutation-row-lead-data.md`. Its row below replaces the K-C34 row of Amendment 6 item 7's New text (`:1468`), byte for byte from the filed draft. Mutation (1) keeps its words, with "H3, " inserted after "removed, " by lead-data, as its draft says.

| Id | Test | Mutation | Fails |
|---|---|---|---|
| K-C34 | `a_twin_a_live_run_holds_is_left_when_its_projects_record_is_discarded` (after the call, the test drops its handle and reads the twin's files by path, byte for byte) | (1) `WouldBlock` taken as a lock held, so the twin is read, judged and removed through the search's own handle (Windows: the read fails, H1, the twin is left and K-C34 passes, a named pass case; macOS/Linux: removed, H3, observed on a macOS or Linux runner by a pushed mutation commit); (2) on `WouldBlock`, the twin's `history.jsonl` and `locations.json` are removed unread (ADV-2026-11-23-38 item 6) (Windows: the removal succeeds against the test's share-delete handle and takes effect once that handle closes, H2, so after the test drops its handle the read by path finds the files gone and K-C34 fails, observed at Part 2's head; macOS/Linux: the test's advisory lock does not stop the unlink, H3, and the read by path finds the files gone, so K-C34 fails; predicted, not observed by this piece) | K-C34 |

2. **"H" in the row** names §0's hypotheses (H1 and H2 at `:31-32`, H3 by Amendment 2). "At H2" in ADV-2026-11-23-38 item 6 is Part 2's head (Amendment 10 item 5), as the draft reads it.
3. **The test's held handle** is opened with std's default share mode. The draft gives this as a condition for the gates (its section on the Windows prediction, item 5); it goes to the build gates with the row.
4. **If mutation (2) does not fail on Windows at Part 2's head,** ADV-2026-11-23-38 item 6 governs, as the draft's section of that name restates it.
5. **The seven places the draft lists** (its last section) say K-C34 has no Windows failing observation, or that no mutation removes a file on Windows. Each is read as covering mutation (1) only. Mutation (2) is predicted to fail on Windows at Part 2's head; it is applied, run, recorded and reverted, and it never lands (Amendment 10 item 4).
6. **The architect's read** of Part 1 against f7770e1a and B's head 5ce0525a is filed at `state/consults/2026-11-27-b2-piece-1c-step-3-recovery-offer-part-1-against-the-c1-head-and-b-architect-read.md`. It gives no verdict. It recommends the C1 piece's head with B's head merged in by the custodian. It also names an open that `recover_session`'s null-dataset arm starts and that ADR-037, on B's branch, does not count. Both go to the advisor, who rules the base before Part 1's code (the ruling's item 3).

## Amendment 17 — 2026-11-27 — class 9 on ADV-2026-11-27-37 item 2 and ADV-2026-11-27-38 item 3: the open that `recover_session`'s null-dataset arm starts is counted among the page's opens, and is closed by the kernel when a later step refuses; the tests; ADR-037's Amendment 1 in Part 1; the budget under ADV-2026-11-27-38 item 2

*Lead-data drafted this before any code. It was written after three things had been seen: the architect's read of Part 1 (`state/consults/2026-11-27-b2-piece-1c-step-3-recovery-offer-part-1-against-the-c1-head-and-b-architect-read.md`), the rulings ADV-2026-11-27-37 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`) and ADV-2026-11-27-38 (not yet filed), and the architect's draft of ADR-037's Amendment 1. No test outcome of this piece exists. Rulings are cited by id and item. The form gate that passed the form reads this amendment once, whole (ADV-2026-11-27-37 item 2; ADV-2026-11-27-38 item 3). [R] cites are at 5ce0525a and [C1] cites at f7770e1a. The drafter has no hashing tool, so the custodian pins each span at filing. Nothing above is edited.*

1. **Authority and scope.**
   - ADV-2026-11-27-37 item 2 counts the open `recover_session` starts and does not accept the residual. ADV-2026-11-27-38 item 2 accepts the re-declared figures. ADV-2026-11-27-38 item 3 puts the kernel's close on a refusal after the open into this amendment. ADV-2026-11-27-38 item 4 keeps the order.
   - The base is that of ADV-2026-11-27-37 item 1.
   - **Not touched:**
     - the handle arm of `recover_session`;
     - `list_recoverable` and `discard_recoverable`;
     - `kernel/src/project/mod.rs`. §2.3 `:93` [M] and §5 I8 `:311` [M] stand.
     - the wire;
     - every shell file;
     - `capabilities/`.
   - **The one kernel change** is item 5's close, in `kernel/src/recovery.rs`.

2. **The handler** (`frontends/shell/src-tauri/src/commands.rs`, Part 1). For a null `dataset` it follows ADR-037 §2 to §5, as `open_dataset` (`commands.rs:86-101` [R]) and `open_project` (`commands.rs:244-268` [R]) do.
   - **Two crate-private async functions** in `commands.rs`. The Tauri command calls them, and so do item 3's tests, so each mutation lands in the code that ships.
     - `recover_on_page(pages, recorder, host, projects, request)`:
       - If `request.dataset` is a handle, it runs `StepRecorder`'s `recover_session` entry point on `spawn_blocking` and makes no `Pages` call.
       - If `request.dataset` is null, it first awaits `Pages::admit(&request.cancel_key)` (`page.rs:229` [R]). A refusal at the gate is the kernel's cancelled refusal (`page.rs:189-193` [R]), which §2.4's reused cancel codes cover (`:117` [M]).
       - It then calls `recover_admitted` with the `Ticket` (`page.rs:128-142` [R]).
     - `recover_admitted(pages, ticket, recorder, host, projects, request)`:
       - It runs the kernel's `recover_session` on `spawn_blocking`.
       - It then calls `Pages::settle(ticket, name, &host, projects)` (`page.rs:303-309` [R]). The name is the reply's `dataset` when the reply is `Ok` and `opened` is present, and `None` otherwise.
       - It returns the reply and the `Settled` (`page.rs:113-123` [R]).
   - **The `#[tauri::command] recover_session`:**
     - It refuses a missing recorder before the gate, as `record_step` does (`commands.rs:195-199` [R]).
     - It passes `projects_of(&app)` (`commands.rs:57-60` [R]).
     - It starts the pool-lease poll only on `Settled::Current`, for an `Ok` reply with `opened` present, under the `cfg` of `commands.rs:95-100` [R].
   - **The ruling's four clauses, and what meets each:**
     - (a) The gate: `Pages::admit`.
     - (b) The name is noted on its page: `Pages::settle`, `Current`.
     - (c) The cancel key ends with the page. The in-flight entry carries `request.cancel_key`. `run_end` cancels that key (`page.rs:477-496` [R]), and the kernel's `begin_open(cancel_key)` registers it (§2.3 `:83` [M]).
     - (d) A late reply is closed: `Pages::settle`, `Ended`, then the late close (`page.rs:320-355` [R]). Item 5 covers the replies that carry no name.
   - **Unchanged and still reached:**
     - `Pages::cancel` (`commands.rs:129-136`, `page.rs:420-446` [R]);
     - `Pages::forget` (`commands.rs:173`, `page.rs:360-364` [R]).
     - No public item of `page.rs` changes (`page.rs:195-447` [R]).
   - **Doc comments made true** (comment lines only):
     - `commands.rs:16-20` and `:126-128` [R];
     - `page.rs:15-17`, `:21-23` and `:216` [R];
     - `page.rs:117-121` [R], the list of tests that join the late close's handle, which gains T-2;
     - `lib.rs:13-18` [R], if the gate reads it as naming only the open commands.
   - **Registration:** `lib.rs:616-639` [R] gains the three commands (T-1).

3. **The binding's tests** (Part 1). They go after T-1's row in §4. The ADR-037 proof (`ADR-037…md:154-159` [R]) asks for tests through the binding's own functions over a real `SkpHost`, `StepRecorder` and `Projects`.
   - **Place (a): `frontends/shell/src-tauri/src/page.rs`'s `mod tests`.**
     - It reuses `Rig`, `Latch`, `TestArm` with `Mode::Block`, and `poll`, `ready` and `assert_pending` (`page.rs:547-893` [R]).
     - `Rig` gains one field, `recorder`, a clone of the recorder `rig()` already builds (`page.rs:701-702` [R]). This edits a test helper and no test; it is declared here for §5 I3.
     - Figure: 340 lines in the src-tauri group.
   - **Place (b): `commands.rs`'s own `mod tests`.**
     - It builds a rig of its own: real host, recorder, `Projects`, `Pages`, a fixture, and a blocking watch arm. That is about 100 more lines and no `Rig` edit. `page.rs` is still edited, for its doc lines.
     - Figure: 440 lines.
   - **The gate chooses the place** (ADV-2026-11-27-38 item 2). Item 6 gives both totals.
   - **Common to both places:**
     - The crashed record is made by a second `StepRecorder` over the rig's `sessions` folder, on a host of its own. It records one step through `record_step` and is dropped without `end_session`, as K-C9's record is (`:2109` [M]).
     - Each test runs the async functions on a tokio multi-thread runtime it builds. That uses `Cargo.toml:63` [R] (`rt-multi-thread`) and `:97` [R] (dev `macros`), with no Cargo or lockfile change (I6).

| Id | Test | Mutation | Fails |
|---|---|---|---|
| T-2 | `a_recover_whose_reply_arrives_after_its_page_ended_is_closed`: a crashed `unsaved-` record; the gate's ticket taken under page 1; page 1 ends, and its line counts `opens_cancelled=0`; then `recover_admitted` with that ticket and a null `dataset`. The reply is `Ok` with `opened` present; `settle` answers `Ended` with a late close, which the test joins; the returned name is not in the catalog; and the current page's set is empty | `settle` given `None` in place of the returned name | T-2 |
| T-3 | `a_page_end_cancels_a_recover_in_flight_and_leaves_its_record`: the history's bytes are read; `recover_on_page` with a null `dataset` runs on its own thread and stands in the watch arm (`Mode::Block`, inside step 4's open); page 1 ends; the arm is released. The reply is `engine.cancelled`; `settle` answers `Ended` with no name; the catalog's `names()` (`kernel/src/lib.rs:276` [C1]) is empty; the history is byte for byte as it was; and the end's line counts `opens_cancelled=1` | `admit` given the empty string in place of the request's `cancel_key` | T-3 |
| T-4 | `a_new_pages_open_waits_for_an_earlier_pages_recover`: `recover_on_page` with a null `dataset` stands in the watch arm under page 1; page 1 ends; page 2's `admit` is pending; the arm is released and the recover returns; page 2's `admit` is then ready | the null arm takes the handle arm's path: no `admit` and no `settle` | T-4, T-3 |

   - **Red at the base:** the two functions do not exist there, so the tests do not build (Amendment 10 item 2, `:2065-2067` [M]).
   - **Known pass cases:** none.
   - **E-RECOVER gains no step.** From the page, a counted recover open and an uncounted one look the same:
     - the null arm binds no project (`:88` [M]), so no lock refusal can show;
     - no handle reaches the new page;
     - no e2e suite reads the page-end line (a search of `frontends/shell/e2e` [R] finds none);
     - the shared log folder piece is not built (ADV-2026-11-27-37 item 4).
   - **What E-RECOVER already covers:** its Recover drives the new handler, gate included, from the real shape (`:293` [M], as Amendment 2 revises it).
   - **An option the gate may ask for, not drafted:** T-5, showing that the handle arm does not wait at the gate.

4. **ADR-037's Amendment 1** lands in Part 1, the part that lands the handler (ADV-2026-11-27-37 item 2).
   - **File:** `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md`.
   - **Words:** the architect's draft under `state/drafts/`. The advisor rules them, and this form drafts none.
   - **Index:** `docs/README.md`'s ADR-037 row is not edited. The precedent is the ADR-036 row, which names no amendment (`docs/README.md:73` [R]). The gate checks this.

5. **The kernel closes the open it started when a later step refuses** (class 9 on ADV-2026-11-27-38 item 3; `kernel/src/recovery.rs`, Part 1). This is worded in the form's `recover_session` steps: Amendment 2 item 4 at `:627-634` [M], as Amendment 4 item 5 revises it at `:1079-1098` [M].
   - **The rule.** For a null `dataset`, once step 4's `open_under` has returned a handle, a guard holds that handle. On every exit but the `Ok` reply, refusal and unwind alike, the guard closes it through `SkpHost::close_dataset` (`kernel/src/skp.rs:1625` [C1]) before the call answers. The guard is disarmed last, after step 6 and after the reply's intents are built.
   - **The pattern** is `open_project` at the C1 head:
     - it keeps a `close` for the handle `open_under` returned (`kernel/src/project/mod.rs:839-843` [C1]);
     - it calls that close where a later write fails (`:864-872` [C1]);
     - its reply guard closes the dataset on an unwind (`:949-964` [C1]).
   - **The refusal exit.** Every refusal after step 2 leaves by one exit, in this order:
     1. the open's close, when there is one;
     2. the history handle dropped, which releases its lock;
     3. step 2's reservation released (N-16, `:1149` [M]);
     4. the answer.
   - **`kernel/src/project/mod.rs` is not touched.** The pattern is copied, not called. `recovery.rs` is in the same crate as `begin_open` and `open_under` (both `pub(crate)`, `kernel/src/skp.rs:1118` and `:1139` [C1]) and `close_dataset` (`pub`, `:1625` [C1]). Nothing of `project/mod.rs` is needed, so no question goes to the advisor.
   - **Step 4, after `open_under` returns.** The step looks the handle up in the catalog to run `DatasetRef::check`, as `kernel/src/project/mod.rs:848-852` [C1] does.
     - `check` returns a `RefCheck` and refuses nothing (`kernel/src/dataset_ref.rs:321` [C1]). A catalog miss is therefore the step's one refusal after the open.
     - Inside `open_under`, the catalog's `remove` runs only on a refused open (`kernel/src/skp.rs:1260`, `:1336` [C1]). After admission, only `close_dataset` removes the entry (`:1671` [C1]), and no client holds the handle yet. So when the miss occurs, nothing is left open. The guard's close still runs; its `unknown_dataset` answer is dropped.
     - **The record:** byte for byte, since step 5 has not run. Its lock and reservation are released, and a later listing lists it again with the same steps, as K-C22 asserts for a refused open at accept.
     - **No test row.** No mutation of the close could make a test fail when nothing is left open. That goes to the form gate (item 10).
   - **Step 5** (`set_len` to the kept prefix, seek to its end, `sync_all`).
     - Any failure refuses as `skp.session_history_unwritable`, the history-write code §2.4 reuses (`:117` [M]). This is the drafter's choice of code; the gate checks it.
     - **The record when `set_len` refused:** byte for byte.
     - **The record when `set_len` succeeded and a later part of the step refused:** cut to its kept prefix. The only bytes removed are those after the last kept line's LF, which `recover_bytes` does not keep.
     - **A later listing, either way:** it reads the same kept steps, the same last `at` and the same count. With the lock and reservation released, it lists the record again, at a later start or at this run's next listing.
     - The guard closes the open before the answer.
   - **Step 6** (set the identity, bind, push) has no refusing branch.
     - It changes only the recorder's state under its lock, and recovers a poisoned lock rather than refusing. N-16 (`:1148` [M]) already says that no refusal follows step 5.
     - A refusing branch at step 6 is invalidator **I11** (item 7): it would be a refusal after the open, and it would need its own test, by amendment, before its code.
   - **A panic between step 4 and the reply** is not a refusal under ADV-2026-11-27-38 item 3. The guard closes the open on the unwind, as `open_project`'s reply guard does. There is no test row; the gate may ask for one, by analogy with `mod.rs:1626` [C1].
   - **The test,** added after K-C41 in §4:

| Id | Test | Mutation | Fails |
|---|---|---|---|
| K-C42 | `a_refused_cut_after_the_open_closes_the_open_and_leaves_the_record` (a unit test in `kernel/src/recovery.rs`, as K-C27 is, `:1206` [M]): the private body that runs steps 4 to 6 for a null `dataset` is called with the history handle of a crashed `unsaved-` record, which the test opened without write access and locked itself, so step 5's `set_len` refuses after step 4's real open through the test's own `SkpHost`. It asserts: the refusal is `skp.session_history_unwritable`; the host's catalog `names()` (`kernel/src/lib.rs:276` [C1]) is empty; the history is byte for byte as it was; and after the call, a lock taken through a new handle succeeds | the guard's close removed from the refusal exit, which leaves the open in the catalog | K-C42 |

   - **Red before the code:** the private body does not exist at the base, so the test does not build.
   - **Known pass cases:** none. `set_len` on a handle without write access fails on Windows, and on macOS and Linux (ftruncate on a read-only descriptor). Taking the lock needs only read access, so the test rests on no hypothesis.
   - **The refusal exit's release of the reservation and the lock** is K-C22's to assert, for the exit that every refusal shares. K-C42 asserts the lock as well.

6. **The budget, under ADV-2026-11-27-38 item 2.** The groups are §2.11's, by part, as in Amendment 10 item 6 (`:2171-2197` [M]). §7 is not edited, because its budgets are §2.11 (`:323` [M]). Groups not listed are unchanged.

| Group | Part 1 (Amendment 10) | Part 1 now | Part 2 | Together now |
|---|---|---|---|---|
| kernel product (`recovery.rs` takes item 5 and K-C42) | 950 | 1,040 | 210 | 1,250 |
| src-tauri (`commands.rs`, `lib.rs`, `page.rs`) | 100 | 340 at place (a), 440 at place (b) | 0 | 340 / 440 |
| records (Part 1: ADR-037's Amendment 1) | 0 | 25 | 160 | 185 |
| **Total** | **≤ 4,670, ≤ 45 files** | **≤ 5,025 at (a), ≤ 5,125 at (b); ≤ 47 files** | **≤ 860, ≤ 6 files** | **≤ 5,885 at (a), ≤ 5,985 at (b); 50 files in the union** |

   - **Kernel product, about 90 lines:**
     - the guard, its disarm and its close, about 20;
     - the one refusal exit, about 5;
     - the source comments, about 20;
     - K-C42, about 45. It counts in this group by K-C27's precedent, because the group is by file.
   - **Src-tauri:** as in the first draft. About 70 product lines and 150 test lines at (a), plus margin. Place (b) adds about 100.
   - **Records:** the architect's draft of Amendment 1 is 20 lines inside its block, plus the blank line before it, declared as 25. If the filed draft's count is larger, the custodian sets this figure from it before code.
   - **Against the rulings:**
     - ADV-2026-11-27-38 item 2 ruled Part 1 at most 4,990 lines plus the gap's lines: 4,990 + 90 = 5,080. Place (a) is under that (5,025, with the records placeholder of 80 brought down to 25). Place (b) passes it by about 45 lines.
     - The whole is under 6,000 at either place.
     - Files: item 5 adds none. Part 1 has 47, and the union has 48 + 2 (`page.rs` and the ADR-037 file) = 50. That holds if the literal's list at the base is no longer than §2.4's 29 files. The custodian's count goes to the advisor only if it passes 50.
   - **The two gated parts stand.**

7. **Additions to the form's sections** (read with the sections named):
   - **§1, May claim** (`:37` [M]), adds two claims:
     - the null arm's open is counted among the page's opens (T-2 to T-4);
     - a refusal after that open leaves nothing open (K-C42).
   - **§2.3, `recover_session`:** item 5's rule and its refusal exit.
   - **§2.9, Seams** (`:175-182` [M]) gains two:
     - `Pages::admit` and `Pages::settle` → `recover_on_page` and `recover_admitted` → the command;
     - `SkpHost::close_dataset` → the refusal exit of `recover_session`.
   - **§2.9, Guarantees** (`:183-188` [M]): ADR-037 §4 and §5 with its Amendment 1.
   - **§5, Declared unchanged** (`:301-305` [M]) adds:
     - `page.rs`'s public items and their behaviour;
     - the four existing handlers, but for their doc comments;
     - `kernel/src/project/mod.rs`, which stays untouched.
   - **§5, Invalidators** (`:306-312` [M]) gains two:
     - **I10**, a stop: the counting needs a new or changed public item of `page.rs`, a non-comment line of `page.rs` outside its tests, a protocol change, or a Cargo or lockfile change;
     - **I11**: a refusing branch after step 5, or any edit of `kernel/src/project/mod.rs`. The latter is I8 and goes to the advisor (ADV-2026-11-27-38 item 3).
   - **§8** (after item 15, `:1234` [M]) gains two items:
     - **16.** The null arm's open reaches the kernel without the gate's ticket; or its returned name is not settled; or a `Pages` call appears in the handle arm, `list_recoverable` or `discard_recoverable`.
     - **17.** A refusal of `recover_session` after step 4's open answers while that open is still in the catalog.
   - **§9, Architect** (`:341-345` [M]): the handler against ADR-037 with its Amendment 1, once that amendment is accepted.
   - **§2.12** (after D22, `:2321` [M]):

| # | What | 1c form | Here | Why |
|---|---|---|---|---|
| D23 | rule | (none) | the null arm's open counted and closed on a later refusal (items 2 and 5); T-2 to T-4 and K-C42; ADR-037 Amendment 1 in Part 1 | ADV-2026-11-27-37 item 2; ADV-2026-11-27-38 item 3 |

   - **Amendment 10 item 2:**
     - Rules (`:2017-2022` [M]) gain item 5's close.
     - Callers (`:2034-2039` [M]) gain item 2.
     - Tests (`:2056-2064` [M]) gain T-2 to T-4 and K-C42.
   - **Shared paths** (`:221-231` [M], with Amendment 2 N-7 at `:750-759` [M]): `page.rs` (Part 1) is shared with the reload piece, which merges ahead of this piece, so it is met by the order (ADV-2026-11-27-37 item 1).

8. **Places this amendment makes stale, by line** [M], for the gate:
   - `:43`: §1's ADRs line ("none is amended"). Item 4 makes it stale, and also `:2229`, the text Amendment 10 gives it.
   - `:83`: §2.3's null arm, which says nothing of a close on a later refusal (item 5).
   - `:632-634`: Amendment 2 item 4's steps 5 and 6, and its bullet that a refusal before step 5 leaves the history byte for byte. That bullet is incomplete: item 5 adds step 5's refusal and the state it leaves.
   - `:2024`: "at most 45 files" and "Part 1 touches nothing under `docs/adr/`" (items 4 and 6).
   - `:2017-2022`, `:2034-2039` and `:2056-2064` (item 7).
   - `:214` and `:2178-2180`: the kernel product and src-tauri ceilings (item 6).
   - `:2184`: records, Part 1 = 0 (item 6).
   - `:2185`: the Total row (item 6).
   - `:2191`: "48 files of 50" (item 6).
   - `:2199-2201`: records by part. Part 1 now holds one (item 4).
   - `:2257`: §5's declared-unchanged text for ADR-036. ADR-037 now changes too.
   - `:175-188`, `:221-231` with `:750-759`, `:301-312`, `:327` with `:1231-1234`, and `:341-345` (item 7).
   - **Not stale, but read with this amendment:**
     - `:93` and `:311`: `kernel/src/project/mod.rs` not touched, and I8. Both stand.
     - `:814`: N-13's open refused at accept.
     - `:1088-1092`: Amendment 4's step 5.
     - `:1145-1149`: N-16, which stands and which item 5 relies on.
     - `:117`: the reused codes.
     - `:2065-2068`: red at the base, and no known pass case in Part 1.
     - `:2540`: Amendment 16 item 6, now answered.

9. **Named, not changed:**
   - **(a)** The kernel holds the cancel key only from step 4's `begin_open`. An end that lands during steps 1 to 3a meets `unknown`, the recover completes, and the late close closes it. That is ADR-037 §4's second outcome, and T-2 asserts it.
   - **(b)** A recover whose reply arrives late leaves its adopted record with the run, and the run's normal end clears it. That is what ADR-037 consequence (e) already says of an unsaved open (`ADR-037…md:140` [R]). Whether Amendment 1 says so is the architect's call.
   - **(c)** The new page's listing does not wait at the gate. It skips a record that is held, so nothing is offered twice.
   - **(d)** The handle arm with its open closed under it: the architect's read names this case (its `:50-53`). It stays out, by ADV-2026-11-27-37 item 2.
   - **(e)** No command, member or capability entry is added. The posture answer is the architect's (ADV-2026-11-27-37 item 3).

10. **For the form gate:**
    - (i) **Where the binding's tests live,** place (a) or (b) (ADV-2026-11-27-38 item 2). Place (b) passes Part 1's ruled figure by about 45 lines. If the gate chooses it, that goes to the advisor.
    - (ii) **Step 4's catalog miss** has no test row. It can refuse after the open, but nothing is open by then (item 5). Does that meet ADV-2026-11-27-38 item 3?
    - (iii) **K-C42's handle without write access** is the function's ordinary input, not a test parameter. K-C27 is the precedent.
    - (iv) **The code** step 5's refusal answers with.

11. **Next.** The form gate reads this amendment once, whole. No code of Part 1 is written before that gate has passed and ADR-037's Amendment 1 is accepted (ADV-2026-11-27-37 item 2; ADV-2026-11-27-38 item 4).

Read the last amendment first.

Nothing above is edited.

## Amendment 18 — 2026-11-27 — the custodian's, at the commit that files Amendment 17: references and the pins of its cites

*Written by the custodian at the commit that files Amendment 17, before any code. References and hashes only.*

1. Amendment 17 is lead-data's redraft, appended byte for byte from its draft, `state/drafts/2026-11-27-b2-piece-1c-step-3-recovery-offer-amendment-17-redraft-under-adv-2026-11-27-38-lead-data-draft.md` (the hand-back's sha256 ac29acac4e167b413256965d07df98f89559c1ee7a4f8506262bad62a3992526): the text between its two marker lines, but for 1 rooted line cite(s) whose line is past the file on main, shortened to the file name by script and changed in nothing else: `mod.rs:1626` (under kernel/src/project).
2. The rulings it names are ADV-2026-11-27-37 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`) and ADV-2026-11-27-38, which its italic line calls not yet filed and which is filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-38-the-recovery-offers-posture-answer-to-the-human-the-overrun-accepted-the-whole-at-most-6000-not-class-8-the-open-left-on-a-refusal-closed-by-the-kernel.md`. The advisor's draft ADV-2026-11-27-39 is filed at `state/consults/2026-11-27-advisor-draft-adv-2026-11-27-39-for-the-humans-approval-the-recovery-offers-three-commands-the-page-can-call-not-the-humans-words.md`; it is not in force, and the piece does not merge before the human's word on it (ADV-2026-11-27-38 item 1). The architect's draft of ADR-037's Amendment 1, which its item 4 names, is filed at `state/drafts/2026-11-27-adr-037-amendment-1-the-recovery-offers-open-counted-and-the-posture-answer-architect-draft.md`; its words are the advisor's to rule (ADV-2026-11-27-38 item 4).
3. Its [M] cites are this form's lines as Amendment 16 left them, committed at 44e6b5beba4b772d7750eeb921be90273e32deac. Its [R] cites are read at 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 and its [C1] cites at f7770e1aa225b7902ea56a77c0d0dbd8321fb942. The sha256 of each span it cites at those two commits, each line with its LF, computed by script, with the path in full (45 spans):

- `frontends/shell/src-tauri/src/commands.rs:86-101 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:8a0316a2615f7e49a8aa9a36c89c3a394cc73f4e89a568f7da046acfa0af14b1`
- `frontends/shell/src-tauri/src/commands.rs:244-268 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:fe851e55faaff32e4729f43563d3956dd563f5ded2e0a744ade34a70d0a2fccf`
- `frontends/shell/src-tauri/src/page.rs:229 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:8d0765a9c8e2eaad73d2f95549871dfd25a85ca091dd1d790766d2aadf8e01ff`
- `frontends/shell/src-tauri/src/page.rs:189-193 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:d5904784b487765706cd79d328f959d01ab2da39305aadd530e4470d7d0b2eb4`
- `frontends/shell/src-tauri/src/page.rs:128-142 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:5f046bb4d55464312c83f34dc64b0ee8e8702d826a2f9d0822abc81bba71a486`
- `frontends/shell/src-tauri/src/page.rs:303-309 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:0de08b49aa3604151a66dba4a79a302b9206791e730bea9d2062170f2eb05da9`
- `frontends/shell/src-tauri/src/page.rs:113-123 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:47590fa7e8b554ab85f53c0cfc3db57548c02e168e7dd6d6397b5c13daf08831`
- `frontends/shell/src-tauri/src/commands.rs:195-199 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:6f3148832b787468d518274883ca487c8e7409a2cfae470b409ae6e5f1f80c72`
- `frontends/shell/src-tauri/src/commands.rs:57-60 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:c3bebfd7db3f01df6a22b1390bbeab18d2f2485fdd5ed0078ed7c89a43f8267a`
- `frontends/shell/src-tauri/src/commands.rs:95-100 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:30779483999d522399e129d57c6557ff19de0a4c9ee1532a1d1ec9066f7d9dd4`
- `frontends/shell/src-tauri/src/page.rs:477-496 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:aaaf4ec204eca3ab58d085f86a40ee67b29a2844ddf7998b30df80a415555c63`
- `frontends/shell/src-tauri/src/page.rs:320-355 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:9688582e5396a8c3812926c2c36b8c45003a623a388312fae7c699af279ed31a`
- `frontends/shell/src-tauri/src/commands.rs:129-136 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:291c6a049f9daf1340251ed403acdf4dc3c0b7746b2cbe47f398333cc93f613e`
- `frontends/shell/src-tauri/src/page.rs:420-446 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:df18915eedba2fb0a06492580b113f331c99aca06c1448d63ad7827f57608b59`
- `frontends/shell/src-tauri/src/commands.rs:173 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:a37e3333bf29527ba50f055432450af9ad592314edf9ec2fc0eb521dd792d5d6`
- `frontends/shell/src-tauri/src/page.rs:360-364 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:ad7e13ea0e748519d397ba89a561e0cbc15c0b1ca7037eb2b16aa341508c4b2f`
- `frontends/shell/src-tauri/src/page.rs:195-447 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:7c15a91135dcafe3439682863e938e7744d146d4971baec1a3a89b3423099e78`
- `frontends/shell/src-tauri/src/commands.rs:16-20 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:aeffd3200188e9ba65923cff50060bf6ca78d9db1893e4640696a91323dfb7b9`
- `frontends/shell/src-tauri/src/commands.rs:126-128 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:628c3456aa259b823e4ca0520ecbcc02b9feaa98732d685a18db7bea94069722`
- `frontends/shell/src-tauri/src/page.rs:15-17 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:3d2df8112564a2689df66ff794c0fae2cd6e9f19d5c550bc1961307a39d9c99f`
- `frontends/shell/src-tauri/src/page.rs:21-23 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:52db8f96db48a501e994d5a5963b9b900c31f315c435634e9b063c3797e6df73`
- `frontends/shell/src-tauri/src/page.rs:216 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:b18f8c92eff53da19266d9b8236dd53d982a4612769d70912097b6726fd0526c`
- `frontends/shell/src-tauri/src/page.rs:117-121 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:0e3ee3634eaebc42fe92bce0fd294fa315743905153610964f9872c2481de966`
- `frontends/shell/src-tauri/src/lib.rs:13-18 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:0c6570e07ca616f793391228f4aafc7f8cd26accd929e99bb7c5f90bc11c2cfa`
- `frontends/shell/src-tauri/src/lib.rs:616-639 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:7107b546774f543bf2621c1ac4f464c851482605c64ffc817640967c5ab808a6`
- `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:154-159 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:211aeed4bef8182cf237280f67a563a683c44ac81aef7f4781b2ca69d3341078`
- `frontends/shell/src-tauri/src/page.rs:547-893 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:bfeffca85db1a6c5c28f92ffa2bd13c41a70e3a29f1dae823b2696d343b93c43`
- `frontends/shell/src-tauri/src/page.rs:701-702 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:3c708b261ac358d835c1dca0beb25c7d42e07f49b2e1b5be9ed7a8fe8000a693`
- `frontends/shell/src-tauri/Cargo.toml:63 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:409e3ce73b2e917ddb9b07d028d444748046876ea59c5b055b773d431825ff08`
- `frontends/shell/src-tauri/Cargo.toml:97 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:96c66ff678940146219b539c94c0e727bbd4d2b45fa8b4ee021572f40d9e3890`
- `docs/README.md:73 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:6e154fbdfebff15d153e59e936ecd98af32426e58bd564442d91619702ff81c9`
- `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:140 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:403b34acf9a0ecee0c790e850ad3378bdeb7b9d29c01d84eaf86a71f86199348`
- `kernel/src/lib.rs:276 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:9fc31c8fed631a4a42c388db90cd063a3a1a45a89c30d8b2d01e1fa43422298f`
- `kernel/src/skp.rs:1625 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:ff25945643915ecd1790fa6d78fd42abcca6c4332c2f86070c4c9a2f15a95c3a`
- `kernel/src/project/mod.rs:839-843 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:c4c41800b2cce49b946f1ed5a1797afaecfd2d39299a7db669c901f84408d7c4`
- `kernel/src/project/mod.rs:864-872 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:13203b1ae7f1276210243af7879e52b18ca52889e8567022d29a416ceae05eac`
- `kernel/src/project/mod.rs:949-964 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:0fbd902f9711b19f5151bd0cd3b4dfca8d981e69f1791954dd080c3c1c160ae7`
- `kernel/src/skp.rs:1118 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:6eaf3cec911ed9d9aac1d3f2642982b11f435a5a836caf316bfaf5a09506efe6`
- `kernel/src/skp.rs:1139 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:ebbc9e535638177140ae48040ac7295bb8caa9b72f17cbd97c32ecad7fdb3389`
- `kernel/src/project/mod.rs:848-852 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:4181dd703b0e111956cfa1778d2d89b57f4f68572a3644cee7932b61e469860f`
- `kernel/src/dataset_ref.rs:321 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:17d2198b9d2d046404cc7f15186d2161c9cf2a0fa7752b6a21c7314b77b0ff35`
- `kernel/src/skp.rs:1260 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:d7563c914b16a6771f49899f0a4fad18b3e243e620bfcc5c4f60c0a2d2d92282`
- `kernel/src/skp.rs:1336 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:d7563c914b16a6771f49899f0a4fad18b3e243e620bfcc5c4f60c0a2d2d92282`
- `kernel/src/skp.rs:1671 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:566137ee849ca3663342ab9eb938de3990402baf75489f5b7312f91551cb74bc`
- `kernel/src/project/mod.rs:1626 @ f7770e1aa225b7902ea56a77c0d0dbd8321fb942 sha256:63558014e8e6672623e521faead4be34a8ecb39feeb6b1e01eef8d126db262af`

4. Next: the form gate reads Amendment 17 once, whole, with ADV-2026-11-27-38 item 1's question on the record that a recover and a discard each leave (ADV-2026-11-27-37 item 2; ADV-2026-11-27-38 items 1 and 3). No code of Part 1 is written before that gate has passed and ADR-037's Amendment 1 is accepted (ADV-2026-11-27-38 item 4).

Read the last amendment first.

Nothing above is edited.

## Amendment 19 — 2026-11-28 — the custodian's: form gate attempt 8 filed, the gate's words for N-43 to N-46, the base 97e2156d, and ADV-2026-11-27-46

*References and hashes only. Nothing above is edited.*

1. **Form gate, attempt 8** (the architect, at 45ef4cc3): PASS WITH NOTES, filed at `state/consults/gates/2026-11-28-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-8.md` (its hand-back's sha256 ba09be4e7969ab6e8356d65bce55c379d4e60cc6ad65f8fdf081be3a7ffcf3cf). It reads Amendment 17 once and whole, as ADV-2026-11-27-37 item 2 asks.
2. **N-43 to N-46** are the gate's words, not the human's or the build's. They apply as that report writes them, with no re-gate: N-43 restates Amendment 17 item 1's bullet on the shell files; N-44 replaces the first bullet of item 5's step 5; N-45 adds two places to item 8's list; N-46 adds a sentence to item 5 after K-C42's row. N-44's two cites, as the gate asked, are `kernel/src/skp.rs:1123 @ 45ef4cc302533fb1850a8a5d0e4fde0ca877caa6 sha256:619a7471b2b09ce29187a5b73ae3006665454a747843b74fe65bac03e7d3ae21` and `protocol/skp/src/v0/error.rs:126-132 @ 45ef4cc302533fb1850a8a5d0e4fde0ca877caa6 sha256:e9847a4cdbce3f2d6934ca10a25cea8f8c71d334e61badb9991e196b792b99ed`.
3. **N-47** stays open, a must-fix before the merge: one appended row recording that 5ce0525a and f7770e1a are reachable from main, or each span of Amendment 18 item 3 pinned again at a main commit by script.
4. **The base** (N-42; ADV-2026-11-27-43 item 1) is 97e2156d571bfa3b6cbe216eeb4f4b884ac9c58b, one commit on f533fadc giving the two literals in page.rs's tests the field. The worker's report is `state/consults/gates/2026-11-27-b2-piece-1c-step-3-recovery-offer-base-correction-97e2156d-worker-report.md`. The reviewer's narrow read passed, filed at `state/consults/gates/2026-11-27-b2-piece-1c-step-3-recovery-offer-base-correction-97e2156d-narrow-read-reviewer.md` (sha256 da198bd593357e6d092791a66ea921568bbf9079242dd3b15a2b381aacb355e9). CI at 97e2156d is green on every workflow it ran, push and pull_request, as that report lists. Part 1's count starts from 97e2156d, outside it.
5. **ADV-2026-11-27-46** is filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-46-a-discard-leaves-one-session-log-line-written-by-the-binding-a-refused-recover-or-discard-leaves-a-line-amendment-1-stands-for-now.md`. It answers N-48 and N-49.
   - Items 2 to 4 are class 9 on that ruling, in Part 1, before its code: the binding's `recovery-discarded` line on a discard that removed a record, and the `recover-refused` and `discard-refused` lines from where the shell calls the command. The lines count in Part 1, and the whole stays inside 6,000.
   - Each line's test and mutation is named in Amendment 20, before Part 1's code, as item 4 of that ruling asks. No further form-gate attempt is made (item 5). Part 1's build gates read the lines, and the reviewer's report says where each is written.
   - N-49: ADR-037's Amendment 1 stands as ADV-2026-11-27-41 has it (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-41-adr-037-amendment-1-accepted-in-the-architects-words-with-two-changes-the-catalog-miss-needs-no-test-row-place-b-accepted-beforehand.md`). The gate's three additions are ruled under a new id, and Part 1's code does not wait for that ruling (item 6).
6. **Before Part 1's code:** Amendment 20; and room on D: with a margin named in the record (ADV-2026-11-27-40, `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-40-the-recovery-bases-suites-read-from-ci-on-a-draft-pull-request-no-target-of-an-open-piece-removed-for-them-part-1-waits-for-room-on-d.md`).

Read the last amendment first.

Nothing above is edited.

## Amendment 20 — 2026-11-28 — class 9 on ADV-2026-11-27-46 items 2 to 4: the three session-log lines, their tests and mutations

*Lead-data drafted this before any code of Part 1. It was written after these had been seen: the form gate, attempt 8, PASS WITH NOTES (Amendment 19 item 1), and the ruling ADV-2026-11-27-46. No test outcome of this piece exists. Rulings are cited by id and item. Branch lines are cited at the base 97e2156d (Amendment 19 item 4). The drafter has no hashing tool, so the custodian pins each cited span at filing. No further form-gate attempt is asked (ADV-2026-11-27-46 item 5). Part 1's build gates read these rows, and the reviewer's report says where each line is written.*

1. **Authority and scope.**
   - ADV-2026-11-27-46 item 2 asks for the binding's discard line, item 3 for the two refusal lines, and item 4 for a test and a mutation for each, counted in Part 1.
   - No kernel file, wire item, capability entry or dependency changes. No file is added to Part 1.
   - Files: `frontends/shell/src-tauri/src/commands.rs`, `frontends/shell/src-tauri/src/lib.rs`, the tests of `frontends/shell/src-tauri/src/page.rs`, `frontends/shell/src/project/RecoveryOffer.tsx` and `frontends/shell/src/project/RecoveryOffer.test.tsx`. All are in Part 1 already (§2.11; Amendment 10 item 2; Amendment 17 items 2 and 3, with N-43).
   - **Not touched:**
     - `frontends/shell/src-tauri/src/state.rs`;
     - `frontends/shell/src/project/openProject.ts` and `frontends/shell/src/admission/admitDataset.ts`;
     - `admission/AdmissionPanel.tsx` (I8);
     - every existing test, K-4 among them.
   - Amendment 17 item 1's "Not touched" list names `discard_recoverable`. It is read as that amendment's own scope; this amendment adds item 2's line to that handler.

2. **The discard's line, written by the binding** (ADV-2026-11-27-46 item 2).
   - **How B's line reaches the session log.**
     - B's page-end line is written by `run_end` through its `log` closure (`frontends/shell/src-tauri/src/page.rs`, lines 508-513 at 97e2156d).
     - `lib.rs` builds that closure: `try_state::<SessionLog>()`, then `SessionLog::append` (`frontends/shell/src-tauri/src/lib.rs`, lines 224-228 at 97e2156d).
     - `SessionLog` is always managed (`lib.rs`, line 529 at 97e2156d; without it the app refuses to start, lines 393-398).
   - **Why the write is not in `commands.rs`.** K-4 (`frontends/shell/src-tauri/src/commands.rs`, lines 879-918 at 97e2156d) fails on any product line of `commands.rs` that contains `.append(`. Its doc puts the host's own lines in `lib.rs` and `pool_poll.rs`, outside its reach by design (lines 868-870). So the write is placed in `lib.rs`, next to the write behind B's line.
   - **`lib.rs`** gains `pub(crate) fn write_host_line(app: &tauri::AppHandle, level: &str, message: &str)`. Its body is the page-end closure's two calls:
     - `if let Some(session_log) = app.try_state::<SessionLog>() {`
     - `session_log.append(level, message);`
     - `}`
   - **`commands.rs`** gains two functions.
     - `pub(crate) fn discard_and_log(recorder: &StepRecorder, request: <Part 1's discard request type>, log: &dyn Fn(&str, &str))`. It returns the recorder entry point's own result unchanged. Its body, line for line:
       - `let kind = discarded_kind(&request.record);` (the record member read as `&str`; an accessor is added only if the member's type needs one);
       - `let reply = recorder.discard_recoverable(request);` (the recorder's entry point of §2.3, by its built name);
       - `if reply.is_ok() {`
       - `log("info", &format!("recovery-discarded kind={kind}"));`
       - `}`
       - `reply`
     - `fn discarded_kind(record: &str) -> &'static str`. Its body:
       - `if record.starts_with("unsaved-") {`
       - `"unsaved"`
       - `} else {`
       - `"project"`
       - `}`
   - **The command.**
     - Part 1's `#[tauri::command] discard_recoverable` takes `app: tauri::AppHandle`.
     - It refuses a missing recorder before any call, as `record_step` does (`commands.rs`, lines 195-199 at 97e2156d).
     - On `spawn_blocking` it runs `discard_and_log`, with a closure that calls `crate::write_host_line(&app, level, message)`.
     - It makes no `Pages` call (§8 item 16).
   - **The line.**
     - The message is `recovery-discarded kind=unsaved` or `recovery-discarded kind=project`, at level `info`, as the page-end line's level is (`page.rs`, line 509 at 97e2156d). `SessionLog::append` writes it after its millisecond stamp.
     - It carries no record name, no path and no project identity.
     - It is written only on the kernel's `Ok`, which comes after the removals of the form's step 4 (Amendment 4 item 5's text for `discard_recoverable`). A refused discard writes none.
   - **Doc comment.** The module's doc in `commands.rs` (lines 16-20 at 97e2156d, which Amendment 17 item 2 already edits) gains a clause: `discard_recoverable` also writes the binding's `recovery-discarded` line through `write_host_line`, in `lib.rs`.

3. **The refusal lines, from where the shell calls each command** (ADV-2026-11-27-46 item 3). Both are in `RecoveryOffer.tsx` (§2.7). Each catch has, in order, the three lines of `admitProject` (`frontends/shell/src/project/openProject.ts`, lines 80-82 at 97e2156d), with its own level.
   - **`export async function admitRecovered(record, cancelKey, dataset)`.**
     - It is Recover's `admit`, run through `runAdmitPath`, as `admitProject` is (`frontends/shell/src/admission/AdmissionPanel.tsx`, line 487 at 97e2156d).
     - Its catch:
       - `if (!(e instanceof SkpCallError)) throw e;`
       - `const refusal = shownRefusal(formatRefusal(e.skpError));`
       - ``logSessionEvent("recover-refused", `${refusal.code}: ${refusal.message}`);``
     - It then returns the refused outcome.
   - **`export async function discardEntry(record)`.**
     - The Discard click calls it.
     - Its try calls the discard wrapper and returns `null`.
     - Its catch is the same three lines with ``logSessionEvent("discard-refused", `${refusal.code}: ${refusal.message}`);``, and it returns the refusal.
   - **What the lines carry.** Each carries the code and the bounded message, as `reopen-refused` does. A recover or a discard that succeeds writes no line of this kind.

4. **Tests**, added after T-4's row in §4.
   - **Red at the base:** the functions do not exist at 97e2156d, so T-6 and T-7 do not build, and S-9 and S-10 fail at their import.
   - **Known pass cases:** none.
   - Each mutation is applied, run, recorded by name with its commit, and reverted, at Part 1's head.

| Id | Test | Mutation | Fails |
|---|---|---|---|
| T-6 | `a_discard_that_removed_a_record_writes_one_session_log_line_naming_only_its_kind` (`page.rs`'s `mod tests`). On the rig with its `recorder` (Amendment 17 item 3), a crashed `unsaved-` record is made as Amendment 17 item 3's common part makes it. Its name is the one `unsaved-` entry of the rig's sessions folder. `crate::commands::discard_and_log` is called with `&*rig.recording_log()` (`page.rs`, lines 757-765 at 97e2156d). It asserts: the reply is `Ok` and the folder is gone; `rig.seen.lines()` is exactly `["info recovery-discarded kind=unsaved"]`; that line contains neither the record name, nor its 32-hex part, nor the sessions folder's path; a second discard of the name is `Err`, and the lines are still one | in `discard_and_log`, Old `if reply.is_ok() {`, New `if reply.is_err() {` | T-6, at its line-equality assertion |
| T-7 | `the_discarded_kind_is_unsaved_for_an_unsaved_name_and_project_for_any_other` (`commands.rs`'s `mod tests`). `super::discarded_kind` of `unsaved-` followed by 32 `0` is `unsaved`; of 32 `0` it is `project` | in `discarded_kind`, Old `if record.starts_with("unsaved-") {`, New `if !record.starts_with("unsaved-") {` | T-7, at its first assertion; T-6 |
| S-9 | `a_refused_recover_logs_one_line_with_its_code_and_bounded_message_and_one_that_succeeds_logs_none` (`RecoveryOffer.test.tsx`). `../skp/client` and `../diagnostics/log` are mocked as `frontends/shell/src/project/openProject.test.ts` mocks them (lines 20-42 at 97e2156d); `formatRefusal` and `shownRefusal` are real. The recover wrapper throws `skp.recoverable_record_locked` with a message holding U+202E: the outcome is `refused`, and the logs are `[{level: "recover-refused", message: "skp.recoverable_record_locked: " + shownText(message)}]`. Then, reset, the wrapper resolves an `opened` reply and describe resolves: the outcome is not `refused`, and the logs are `[]` | Old ``logSessionEvent("recover-refused", `${refusal.code}: ${refusal.message}`);``, New ``logSessionEvent("recover-refused", `${e.skpError.code}: ${e.skpError.message}`);`` | S-9, at its logs equality |
| S-10 | `a_refused_discard_logs_one_line_with_its_code_and_message_and_one_that_succeeds_logs_none` (`RecoveryOffer.test.tsx`, the same mocks). The discard wrapper throws `skp.recoverable_record_unknown` with message `m`: the refusal is returned, and the logs are `[{level: "discard-refused", message: "skp.recoverable_record_unknown: m"}]`. Then, reset, the wrapper resolves `{}`: `null` is returned, and the logs are `[]` | Old ``logSessionEvent("discard-refused", `${refusal.code}: ${refusal.message}`);``, New: the line removed | S-10, at its logs equality |

   - Each Old text stands once in its file, in the function named. Leading whitespace is not part of an Old text.
   - No test row asserts the `write_host_line` link to the real file. B's page-end closure has no such row either (`page.rs`'s tests capture through `recording_log`).
   - E-RECOVER gains no step.

5. **The budget** (ADV-2026-11-27-46 item 4; ADV-2026-11-27-38 item 2). These are the groups of Amendment 17 item 6, at place (a).

| Group | Part 1 (Amendment 17) | Part 1 now | Together now |
|---|---|---|---|
| src-tauri (`commands.rs` about 42 with T-7, `lib.rs` about 9, `page.rs` tests about 38) | 340 | 430 | 430 |
| shell product (`RecoveryOffer.tsx`) | 500 | 520 | 520 |
| shell tests (`RecoveryOffer.test.tsx`) | 500 | 540 | 540 |
| **Total** | **≤ 5,025, ≤ 47 files** | **≤ 5,175, ≤ 47 files** | **≤ 6,035; 50 files in the union** |

   - The whole passes 6,000 by about 35 lines. By ADV-2026-11-27-46 item 4 this goes to the advisor before Part 1's code. Nothing is shrunk here.
   - No file is added.

6. **Additions to the form's sections** (read with the sections named):
   - **§1, May claim:** a discard that removed a record leaves one session-log line naming only its kind (T-6, T-7); a refused recover or discard leaves one line with its code and bounded message, and a successful one leaves none (S-9, S-10).
   - **§2.9, Seams:** the managed `SessionLog` → `write_host_line` → `discard_and_log` → `discard_recoverable`; `logSessionEvent` → `admitRecovered` and `discardEntry`.
   - **§5, Declared unchanged:** K-4 and its text; `state.rs`; `openProject.ts`; `admitDataset.ts`.
   - **§5, Invalidators:** **I12**, a stop: the discard line needs an edit of K-4 or of `state.rs`, a write through `append_redacted`, or a call of `append` in `commands.rs`'s product lines. This goes to the advisor (ADV-2026-11-27-46 item 2).
   - **§8, item 18:** a `recovery-discarded` line that carries a record name, a path or a project identity, or that is written on a refused discard; or a `recover-refused` or `discard-refused` line written on a success.
   - **Amendment 10 item 2:**
     - Tests gain T-6, T-7, S-9 and S-10.
     - Callers: `discard_recoverable`'s chain gains `discard_and_log` and `write_host_line`, each with its product caller in Part 1.
   - **§2.12, after D23:** | D24 | rule | (none) | the binding's `recovery-discarded` line, and the `recover-refused` and `discard-refused` lines from `RecoveryOffer.tsx` (items 2 and 3); T-6, T-7, S-9 and S-10 | ADV-2026-11-27-46 items 2 to 4 |

7. **Shared paths** (§2.11's table, as N-7 revises it; Amendment 17 item 7), named and not ruled:
   - `commands.rs` (PR 356);
   - `page.rs` (the reload piece).
   - `lib.rs`, `RecoveryOffer.tsx` and `RecoveryOffer.test.tsx` are not named in that list.

8. **Named, not changed:**
   - **(a)** `admitRecovered`'s catch also covers the `describe` that follows an `opened` reply, as `admitProject`'s does. So a refused `describe` after a recover writes `recover-refused` with that refusal's code.
   - **(b)** An `engine.cancelled` refusal (at the gate, or at a page end) writes `recover-refused`, as `reopen-refused` is written for one.
   - **(c)** The two refusal lines carry the kernel's message, bounded. Whether the four new codes' messages name the record is §2.4's and the build's, and is not ruled here.
   - **(d)** The `info` level of the discard line is the drafter's, after the page-end line.

9. **For the custodian:**
   - (i) The whole at about 6,035 lines (item 5), which goes to the advisor before code.
   - (ii) Whether the writer in `lib.rs`, which K-4 makes necessary, is "as the page-end line of B does" in ADV-2026-11-27-46 item 2. If it is not, that item sends the case to the advisor before code.

Read the last amendment first.

Nothing above is edited.

## Amendment 21 — 2026-11-28 — the custodian's: ADV-2026-11-28-01 carried (the figures, the writer by literals, `recover-describe-refused` with lead-data's row) and ADV-2026-11-28-02 filed

*References only. Nothing above is edited.*

1. **The rulings.** ADV-2026-11-28-01 is filed at `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-01-the-whole-at-most-6060-lines-the-discard-line-in-lib-rs-by-literals-only-a-refusal-after-opened-is-recover-describe-refused.md` and ADV-2026-11-28-02 at `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-02-adr-037-amendment-1s-text-with-the-recovery-gates-three-additions-ruled-in-place-of-the-fence-of-adv-2026-11-27-41-item-1.md`. Amendment 20 above is the fenced text of lead-data's draft at `state/drafts/2026-11-28-b2-piece-1c-step-3-recovery-offer-amendment-20-lead-data-draft.md`, appended byte for byte with its date filled, as ADV-2026-11-28-01 item 5 asks. Its words are lead-data's, not the human's or the advisor's. Where this amendment summarises a ruling, the ruling's bytes govern.
2. **The figures** (ADV-2026-11-28-01 item 1; class 9, declared before the code): Part 1 at most 5,200 lines, the whole at most 6,060, Part 2 at most 860; files at most 47 in Part 1 and 50 in the union. They replace ADV-2026-11-27-38 item 2's figure and the last sentence of ADV-2026-11-27-46 item 4. Where this form or the gate's N-45 row gives 6,000 for the merge check's count, the figure is 6,060. The added room is for the lines of ADV-2026-11-27-46 items 2 to 4 and ADV-2026-11-28-01 item 4 only.
3. **The writer** (ADV-2026-11-28-01 item 2): Amendment 20's `write_host_line`, `discard_and_log`, `discarded_kind` and T-7 are read as that item rules them. In summary: the writer stays in `lib.rs`; its two parameters are `&'static str`, and `discard_and_log`'s `log` parameter is `&dyn Fn(&'static str, &'static str)`; `discarded_kind` becomes `discarded_line(record: &str) -> &'static str`, giving one of the two literal lines that item names, and no `format!` builds the line; T-7 calls `discarded_line`; `write_host_line`'s doc comment, in the worker's words, says what may reach it. I12 and §8 item 18 each gain that item's case of a text that is not a literal of the crate, a stop to the advisor. Both gates of Part 1 say, with the posture check, whether any text of the page can reach the session log through the new writer. If the `'static` types cannot be built as ruled, that goes to the advisor before any other way is taken.
4. **Amendment 20's item 8:** (b), (c) and (d) stand, and the `info` level is accepted (ADV-2026-11-28-01 item 3). Its (a) is replaced by item 5 here.
5. **`recover-describe-refused`** (ADV-2026-11-28-01 item 4; class 9 in Part 1): `admitRecovered` writes `recover-refused` only for a refusal of the recover call itself, and `recover-describe-refused`, with the code and the bounded message in the same form, for a refusal after an `opened` reply. The code is as lead-data's draft at `state/drafts/2026-11-28-b2-piece-1c-step-3-recovery-offer-s9-third-case-lead-data-draft.md` words it in its section 2, with its doc comment's sentence. S-9's row is that draft's section 1 row, in place of Amendment 20's: the test's new name, its three cases, M-S9 as drafted and M-S9-D. By that draft's section 3, Part 1 is at most 5,193 and the whole at most 6,053 before item 3's changes, which it does not count; the custodian's count before code shows them against item 2's figures.
6. **For the gates** (ADV-2026-11-28-01 item 4, its last bullets): Part 1's architect gate says whether, after a refusal after an `opened` reply, the page closes the open, so that by ADR-037's Amendment 1 the record stays with this run and a normal end clears it. Part 2's gates say what the user is told then. If the changes the user asked to recover are cleared at the app's normal end with no word to the user, that goes to the advisor before Part 2's words are committed.
7. **ADR-037's Amendment 1** (ADV-2026-11-28-02): its text is that ruling's fence, in place of ADV-2026-11-27-41 item 1's, appended after the ADR's last line in the part of this piece that lands `recover_session`'s handler. ADV-2026-11-27-41 items 2 to 8 stand, read with that text. The ruling's item 3, a listing that comes before an earlier page's recover has locked its record, is for the gates of both parts. Part 1's code does not wait for this filing.
8. **No further form gate** (ADV-2026-11-28-01 item 5; ADV-2026-11-27-46 item 5). **Next:** Part 1's code, which waits only for room on D: (ADV-2026-11-27-40 item 4), with the margin named in the record before the build.

Read the last amendment first.

Nothing above is edited.

## Amendment 22 — 2026-11-28 — the custodian's: Part 1's first phase (wire and kernel) at 96c3821a, the kernel product ceiling passed (class 8, recorded after the code), and K-C1's and K-C4's mutations for Part 1's gates

*References only. Nothing above is edited.*

1. **The report.** The first phase's worker report is filed at `state/consults/gates/2026-11-28-b2-piece-1c-step-3-recovery-offer-part-1-first-phase-wire-and-kernel-worker-report.md` (its hand-back's sha256 e3be69d0da2404f33fbc205627f1b6e02c86018c22a3fe357640ed76bf0c4f40). The phase is at 96c3821aad29e08e45d9e9d3905704ea0aca6201 on `cut/b2-piece-1c-step-3-recovery-offer`, 9 commits over the base 97e2156d; `git diff --shortstat 97e2156d...96c3821a` gives: 27 files changed, 3136 insertions(+), 159 deletions(-). By the report, both crates' suites gave 635 passed, 0 failed and 49 ignored at cc4352834ba7725e7cb6d0b576cb6c799a35a43c, the kernel's code commit, and `cargo fmt --check` passed. The second phase (src-tauri, the shell, the e2e suite written and not run, and ADR-037's Amendment 1) has not started.
2. **Class 8, recorded after the code that passes it.** By `git diff --numstat 97e2156d...96c3821a`, insertions plus deletions, the custodian's run, the kernel product group (`kernel/src/lib.rs`, `kernel/src/project/store.rs`, `kernel/src/recovery.rs` with its unit tests, `kernel/src/session_history.rs`) is 1405 lines, against its Part 1 ceiling of 1,040 (Amendment 17 item 6): over by 365. Amendment 10 item 6 makes passing a ceiling class 8, recorded before the code that passes it. The code that passes it is cc4352834ba7725e7cb6d0b576cb6c799a35a43c, and this record comes after it: a departure from that item. The worker's brief left an overrun to the custodian to record, and the worker reported it at its end. Part 1's count is 3295 lines over 27 files, against at most 5,200 lines and 47 files (Amendment 21 item 2), so the part's figure is not passed and ADV-2026-11-23-38 item 1's last bullet does not apply. §7 is not edited. By the report, the first phase's other groups are within their Part 1 ceilings. The second phase's brief allows no kernel product line; a need for one stops it.
3. **K-C1 and K-C4.** By the report, each row's mutation as worded did not fail its named test at cc435283. K-C1's (list this run's records) failed no test. K-C4's (listed at start) failed only `unsaved_records_are_listed_beside_more_than_64_project_records`. The worker then ran a second mutation for each, with two edits (K-C1b, K-C4b), which failed the named tests, and reports the two rows by them. A preregistered mutation changed after its result is a post-result change, and it is not applied here. Part 1's architect build gate reads the report's account (a second guard on each path) and says, for each row, whether its mutation stands as worded, is replaced by the two-edit mutation in an amendment, or goes to the advisor.
4. **The other departures, for Part 1's gates.** The first red run held two cargo commands in one hold. Three of this piece's own tests (K-C3, K-C18, K-C19) were changed at b5161d1b, before the kernel's code commit, to end the run before a held history is read; K-C3's cut check now reads the kept bytes and requires one whole line after them. `kernel/src/session_history.rs` gains `pub(crate)` widenings for `recovery.rs`. `StepRecorder`'s three new `pub` methods have no product caller until the second phase.
5. **Next.** The second phase is dispatched when D: has room for its target's growth and the 8,000 MB margin named in the ledger before the first phase. The reload keys' Part A has built on D: since 2026-11-28T04:11:16Z. If D: is short at the second phase's turn, the advisor is told which targets stand and which runs are queued for each (ADV-2026-11-27-40 item 4). Part 1's build gates read the second phase's head.

Read the last amendment first.

Nothing above is edited.

## Amendment 23 — 2026-11-28 — the custodian's: ADV-2026-11-28-10 carried: the shell's run red at 96c3821a (a finding), the second phase's correction, and push runs read before Part 1's gates

*References only. Nothing above is edited.*

1. **The ruling** is filed at `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-10-a-piece-with-no-pull-request-has-its-ci-read-from-the-push-runs-the-recovery-offers-shell-run-at-96c3821a.md`.
2. **A finding** (the human's rule of 2026-11-22, item 1; ADV-2026-11-28-10 item 2). At 96c3821a Product CI (shell) is red on the push (run 46105327277) and on PR 370 (run 46105330919), at the frontend's tests. Five assertions on the version literal fail, `skp/0.18` against `skp/0.17`, in `frontends/shell/src/skp/__tests__/fixtures.test.ts` and `frontends/shell/src/App.colour.test.tsx`. The steps after that one did not run. Amendment 22 and the first phase's report do not name it. The first phase's brief is not kept as a file, so it cannot be shown that the brief foresaw it, and it is recorded as a finding. Its cause is the state between the two phases: the first phase moved the wire to `skp/0.18`, and the shell's literal is the second phase's.
3. **The second phase's correction.** The form allows existing tests to be edited for the version literal (§4's line on edited existing tests). The running second-phase worker was told by a message after 2026-11-28T05:09:23Z: the shell's literal and those tests' expected values move to agree with the wire, and nothing else in those files changes; each changed line is reported with its commit; Rust fmt, red at its first commit 3533b972 (run 46112143012), is corrected before its head; and it reports the push runs at its head.
4. **Part 1's build gates** are dispatched on a head whose push runs are green (ADV-2026-11-28-10 item 1). A red run at that head is named in the record with its id and its failing step. A commit red on purpose, such as 3533b972 with its tests before their code, is evidence.

Read the last amendment first.

Nothing above is edited.
