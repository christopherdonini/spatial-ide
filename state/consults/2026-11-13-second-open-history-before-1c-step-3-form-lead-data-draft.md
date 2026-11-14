# The second-open node's form: lead-data's draft (2026-11-13), read only at 8c693657, for the form the custodian commits before code

*Filed by the custodian on 2026-11-13: lead-data's report, byte for byte from the message of its hand-back call in its subagent transcript, with one final newline added (32797 bytes, sha256 fbd8d519d00b3b506b47510de14f0eefd5ec6b884753867ef93482fdcec57b8d). Its brief: 8481 bytes, sha256 262ae115061d154a31c07077111354b87c1a6c3aff4ce7eda13735513b5fbf56, at main 8c693657801fd4168b078a601724bdacd9f479b8, dispatched at 2026-11-13T21:51Z; the run from 2026-11-13T21:51:17.059Z to 2026-11-13T22:06:02.144Z by the transcript, model claude-opus-5-5, 77 tool calls (Read 38, Grep 37, Glob 1, the hand-back 1), none errored, none a write. The words are lead-data's: a draft, not Authority, and not the form. The custodian's notes, not the draft: (1) of the twelve texts it marks byte-copied or byte for byte, nine are byte-identical at their cited lines at 8c693657 by the custodian's script; three are not: the `record_step` block cited at kernel/src/session_history.rs lines 243 to 252 is the same text with its eight spaces of indent removed from each line; the match arm cited at kernel/src/project/mod.rs lines 370 to 372 is three lines joined into one with the arm's braces dropped; and the HistoryMarkState phrase cited at protocol/skp/src/v0/commands.rs lines 743 to 747 runs across a line break and a comment marker there. The form takes each from the file. (2) Its OPEN-43 asks whether port-2's branch edits item 43: by the custodian's read of `git diff origin/main...origin/cut/port-2-macos-l1-and-app-dirs`, it changes item 43's first line, so item 43 is a shared path under rule (00a). (3) Its OPEN-5c, OPEN-S5, OPEN-P, OPEN-T and OPEN-43 go to the advisor under the human's delegation of 2026-11-13; OPEN-W is taken as recommended, dated 2026-11-13, by ruling (24).*

---

Draft: second-open-history-before-1c-step-3, full form, lead-data

All words below are mine (lead-data's) unless they are in a code span or block marked "byte-copied". Every cite is `path:line @ 8c693657801fd4168b078a601724bdacd9f479b8`. I leave no background shell. I have no shell, so I give no sha256 of this report or of anything else.

Form path: `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`. I chose it by the existing pattern (`governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md`, `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`) and because forms-layout.mjs requires forms under governance/forms/. I did not read a forms index, so I cannot say whether one names another path. The custodian commits the form on main before any code.

=====================================================================
THE FORM
=====================================================================

# Preregistration: second-open-history-before-1c-step-3 (kernel)

**Node:** `second-open-history-before-1c-step-3` (governance/PLAN.yaml:5588-5604 @ 8c693657801fd4168b078a601724bdacd9f479b8). It is status ready, in lane kernel-protocol, with depends_on publish-approval-columns-line, which is done (governance/PLAN.yaml:7178-7187 @ 8c693657801fd4168b078a601724bdacd9f479b8).

**Authority:**
- Item 5 of the human's third message of 2026-11-12 (state/directives, the third message of 2026-11-12, lines 24-29; item 8 at line 35).
- The rulings recorded at B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md Amendment 28, class 5 (governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1870-1881 @ 8c693657801fd4168b078a601724bdacd9f479b8). These are O-2, C2 (i), I-b, OPEN-N4 (a) and OPEN-N6. They replace OPEN-21-1 (b) (same file :1805) and K-S15's shape (same file :1668).
- The grant of 2026-11-13, items 2-4 (state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md:15-26 @ 8c693657801fd4168b078a601724bdacd9f479b8). Under it, every place where item 5 (c) or (d) says "the human" reads "the advisor, under the delegation of 2026-11-13".
- **Reuse index miss.** The reuse index was run at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c and exited 1. Its output, byte for byte: No prior art recorded for "second open history project record step save lineage". Research it before planning an implementation.

**Drafted by:** lead-data, at 8c693657801fd4168b078a601724bdacd9f479b8. Committed on main before any code. Append-only after commit: amendments go in §10.

## §0 Disclosure

- The drafter read the code paths named in §2 at the rev above. No code was written or run.
- The drafter is lead-data, which never reviews or gates this piece.
- Built shape is declared below by function and anchor. Where an anchor is new code, it is declared, not quoted. The worker records the exact text at its build commit and shows that it occurs once. A difference is a class-1 departure, recorded in §10.
- One piece, one kernel PR, built before 1c step 2's lineage reader (per item 5 and OPEN-N6).

## §1 Claims

- **C-1 (O-2).** Each open has its own history record until a save binds that open to a project. From then on, the open's steps go to the project's record.
  - "Open" means one catalog handle, minted from 128 random bits per open by `DatasetHandle::mint`.
  - An unbound reopen of the same file no longer continues the earlier open's record. This replaces 1b's §2.3 rule, byte-copied from governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:214 @ 8c693657801fd4168b078a601724bdacd9f479b8: "A reopen of the same path, with the same admission claims, in the same run continues the record. Anything else starts a new one."
- **C-2 (C2 (i)).** A save made before any step binds the open. The first step after that creates `sessions/<P hex>/` directly, with header `project` = `spatial://project/<P hex>`, and no `unsaved-` record is made for that open. A later save of the same open writes its `saved-here` mark there.
- **C-3 (I-b).** Each open has one dataset identity (`DatasetUri`), minted once.
  - The history's header and every step's `data.dataset` carry it.
  - The project file's dataset `logical_uri`, written at the open's first save, is that same URI, whether the save comes before or after the first step.
- **C-4.** A save of a second open of one file to another folder writes its own mark in its own record (reply `written`). It leaves the first open's project record byte-length unchanged. This replaces the reply `withheld` that K-S15 pins today.
- **C-5.** No catalog handle or open name is written to disk. Opens are held in memory only. kernel/tests/no_generation_in_persisted_artifacts.rs:814 and :927 @ 8c693657801fd4168b078a601724bdacd9f479b8 still pass unchanged.
- **C-6.** Item 5 (c), a save into a project whose record this run already holds, is not reachable by any command at this node (see §2.4).
  - If it is reached (the route is step 2's), the build fails closed: the save stands, the reply is `withheld` (HistoryUnwritable), the open's own record stays its own, and the project's record gets no line.

## §2 The rule (what is built)

### §2.1 kernel/src/session_history.rs

Today's key is path plus same_claims. The record lookup in `record_step`, byte-copied from kernel/src/session_history.rs:243-252 @ 8c693657801fd4168b078a601724bdacd9f479b8:

```rust
let mut records = self.records.lock().unwrap_or_else(|e| e.into_inner());
let same =
    |r: &Record| r.path == ds.path() && same_claims(&r.admission, reference.admission());
let at = match records.iter().position(same) {
    Some(i) => i,
    None => {
        records.push(self.create(&reference, &ds)?);
        records.len() - 1
    }
};
```

And `find`, byte-copied from kernel/src/session_history.rs:422-427 @ 8c693657801fd4168b078a601724bdacd9f479b8:

```rust
/// The record of the file `ds` was opened over: the one `record_step` continues for it.
fn find(records: &[Record], ds: &Dataset) -> Option<usize> {
    let reference = DatasetRef::linked(DatasetUri::mint(), ds).ok()?;
    let same = |r: &Record| r.path == ds.path() && same_claims(&r.admission, reference.admission());
    records.iter().position(same)
}
```

Changes (the worker's exact code may differ in form, not in behaviour):

1. **New types, private.**
   - A holder: `Holder::Open(<open name>)` or `Holder::Project(ProjectUri)`.
   - An open entry: its name (the catalog name the command carries; memory only), its `DatasetUri` (minted once), and its bound project (`Option<ProjectUri>`).
   - The open's holder is `Project(P)` when bound, and `Open(name)` otherwise.
2. **The mutex state.** `StepRecorder.records` (:191-195) holds both the opens and the records.
3. **`Record` (:122-133).**
   - It loses `path`, `admission` and `project` and gains `holder`.
   - `find` (:422-427) and `same_claims` (:557-567) are removed.
   - The `Admission` import (:35-38) is removed if nothing else uses it. The worker shows by grep that it is unused.
4. **`record_step` (:222-268).**
   - The reference at :239 is built under the lock from the open's own URI (find or add the open; mint its URI once), no longer from `DatasetUri::mint()`.
   - The record looked up is the one whose holder equals the open's holder; if there is none, `create`.
   - Line 256's `data.dataset` therefore carries the open's URI.
5. **`create` (:364-375) and `header_object` (:533-544).**
   - When the open is bound to P, the folder is `root/<P hex>` and the header's `project` is P's URI. Otherwise the folder is `unsaved-<hex>` and the header carries `not-yet-saved`, as today.
   - `reader_accepts(&header, true)` (:366) already accepts a header with a project set: the copy at :480 calls it on such a header.
   - `create_dir` failing on an existing folder stays as it is, so another run's folder is never written into or removed. The `remove_dir_all` at :374 runs only after this call made the folder.
6. **New `pub(crate) fn dataset_uri(&self, open: &str) -> DatasetUri`.** It returns the open's URI, minting it once if the open has none yet. Product caller: `Projects::save` (§2.2), at a first save.
7. **`adopt_project` (:270-298).** The new signature takes the open name instead of `&Dataset` (`pub fn adopt_project(&self, ds: &Dataset, project: &ProjectUri)` today).
   - If the open is already bound, nothing happens. This keeps today's no-op at :283-285.
   - If the open has its own unbound record, it is moved as today (copy_under, :431-465) and its holder becomes `Project(P)`.
   - Then the open is bound to P. This is C2 (i) when there was no record.
   - If the move fails, the function returns Err and leaves the open unbound, so the next save retries.
8. **`mark_saved_here` (:300-336).** It takes the project, not `&Dataset`. It looks up the record held by `Project(project)`.
   - None, or no last step, gives `NoStep`.
   - The `HeldByAnotherProject` check at :318-320 and the `SavedHere::HeldByAnotherProject` variant with its doc (:175-187, doc at :184-185) are removed.
   - `Differs` and `Written` are unchanged.
9. **`end_session` (:338-348) is unchanged.** It still deletes every record this run made, whatever its holder, as it does today for moved records. A record another run left is never touched.
10. **Doc sentences.** Sentences in this file that the change makes untrue are brought current in the same commit, in the worker's words, and the gates clause-check them. Among them:
    - Record's doc at :122-133 (one record per opened file).
    - adopt_project's doc at :270-276 ("if it has one and no project holds it yet").
    - same_claims' doc (removed with it).
    - SavedHere's doc.

### §2.2 kernel/src/project/mod.rs

- **Line 251.** `(mint_identity(), folder.to_path_buf(), DatasetUri::mint())` becomes the same tuple with `self.recorder.dataset_uri(name)` in place of `DatasetUri::mint()`. This is I-b. The project file's `logical_uri` (via `DatasetRef::linked(uri.clone(), ds)` at :274) is then the open's URI.
- **`history` (:351-375).**
  - It calls `adopt_project(name, project)` and `mark_saved_here(project, …)`.
  - The arm at :370-372 (`Ok(SavedHere::HeldByAnotherProject) => HistoryMark::Withheld(Withheld::RecordHeldByAnotherProject)`, byte-copied) is removed.
  - `Withheld::RecordHeldByAnotherProject` (:153-155) is removed with its doc.
- **Unchanged.** `save`'s pub signature (:237) and its other behaviour: FolderHoldsProject (:263-265), `known` by catalog name (:245), and `replace` (:302).
- **Docs brought current, in the worker's words.** The module doc at :16-17 and save's doc bullet at :231-236, which name the "another project of this run holds" case.

### §2.3 protocol/ (doc text only; no wire change, no version change)

- **protocol/skp/src/v0/commands.rs:743-747.** HistoryMarkState's rustdoc names the case "the history's record for the dataset's file belongs to another project this run has saved". That case no longer exists, so the sentence is brought current.
- **protocol/skp/SKP-V0.md:1340 (§11.2) and :1346 (§11.3).** Each describes when `withheld` or a mark is given in terms of "no other project holds the record", which no longer occurs. Both are brought current in the worker's words and clause-checked by the gates.
- The values `written` and `withheld` and the reply shape are unchanged. No conformance test pins this prose.
- Whether this counts as a contract change is OPEN-P below.

### §2.4 Item 5 (c), a save into a project whose record this run already holds

At this node no command reaches it:
- a first save always mints a new identity (:251);
- FolderHoldsProject refuses a folder that already holds a project (:263-265);
- a later save is the open's own project (`known` by catalog name, :245, and a reopen gets a new catalog name).

It becomes reachable only through step 2's project reopen. OPEN-N4 (a) covers it if step 2 binds the reopened open to P inside the reopen command, before any step on the new handle; that open then simply continues P's record.

If it is reached any other way, the build fails closed:
- the record move's `create_dir` (:443) refuses the existing folder;
- `adopt_project` returns Err;
- the save stands with reply `withheld` (HistoryUnwritable);
- the open's record stays its own, and P's record gets no line.

My recommendation for this item is OPEN-5c (A).

### §2.5 Scope (files the PR may touch)

1. kernel/src/session_history.rs
2. kernel/src/project/mod.rs
3. kernel/tests/session_history.rs
4. kernel/tests/project_save.rs
5. kernel/tests/project_save_skp.rs
6. protocol/skp/src/v0/commands.rs (rustdoc only)
7. protocol/skp/SKP-V0.md (§11.2 and §11.3 only)
8. KNOWN-LIMITATIONS.md (items 63 and 43 only; DRAFT text, then the advisor's ruled words; see §2.6)
9. docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md (one appended note, the advisor's ruled words only)
10. and 11. Only if OPEN-T (b) is ruled: governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md and governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md, one appended superseded row each.

Nothing else. In particular: no frontends/ file, no engine/ file, no other kernel/ file, no Cargo.toml or Cargo.lock, and no CI file.

### §2.6 The words after the code (item 5 (d))

These are written by the worker at the records commit, clause-checked by both gates against the built code, and go to the advisor. Nothing lands on main before the advisor's ruling. Records and source comments call the ruled text "the advisor's wording, under the delegation of 2026-11-13", never the human's.

- **OPEN-N5.**
  - KNOWN-LIMITATIONS item 63 (KNOWN-LIMITATIONS.md:506-508; DRAFT; its comment names K-S15 by test name) is drafted for withdrawal or rewording.
  - Item 43 (KNOWN-LIMITATIONS.md:436; approved words "at most 32 MiB for one dataset in one run", byte-copied) is drafted for rewording, because the ceiling now holds per record (per open, or per bound project), not per dataset per run.
  - Both go in the file as DRAFT text, using the DRAFT-comment precedent of items 62 and 63 (KNOWN-LIMITATIONS.md:502-508).
- **ADR-036 note.** Drafted in the worker's report only. It is appended once, at the ruled-words commit, because ADR-036 is accepted and append-only. Its topics:
  - the key (a record per open until bound);
  - a project record created without a move, which adds to Amendment 1 item 5 (docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:272);
  - I-b against §4's "minted when a dataset first enters a project" (same file :72);
  - N4 (a) as step 2's.
- **Commit order.**
  - C0: the form, on main.
  - C1: code, tests, and the in-code and protocol doc sentences.
  - C2: the records commit. KNOWN-LIMITATIONS DRAFTs; the ADR note draft in the report; the superseded rows if OPEN-T (b).
  - C3: the advisor's ruled words, replacing the DRAFTs byte for byte and appending the ADR note. The gates check C3 as words against the ruling, byte for byte.
- The kernel owner's index lines are not in this PR. They are lead-data's update after the merge, at the custodian's brief.

## §3 Fixtures

- **F1.** In-test only, as the existing rigs make them: kernel/tests/project_save.rs Rig at :107-132 and kernel/tests/project_save_skp.rs Rig at :42-85, both @ 8c693657801fd4168b078a601724bdacd9f479b8.
- No new fixture file and no generated data.

## §4 Tests and mutations

**Changed assertions (the only ones).**

**K5.** kernel/tests/session_history.rs:339-405, `a_reopen_of_the_same_file_continues_its_record_and_another_file_starts_its_own` (name per OPEN-T).
- Old assertions, byte-copied from the file:
  - `assert_eq!(records(&store).len(), 1, "the reopen continues the record");`
  - `assert_eq!(records(&store).len(), 2, "another file starts its own");`
  - then two steps in one record (long), with `long[1].parent == long[0].id`, and equal `data.dataset` values across the reopen.
- New assertions:
  - after the reopen's step, records == 2 (the unbound reopen starts its own record);
  - after the other file's step, records == 3;
  - each record holds one step with parent null;
  - the reopen's `data.dataset` differs from the first open's.
- The rewrite and mtime setup may stay or go; the worker records which.
- The doc comment's RECORDED MUTATION line ("records are keyed by handle…") is replaced by M1's.
- 1b's claim row (governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:533) stays as history; its node is done.

**K-S15.** kernel/tests/project_save_skp.rs:371-457, `a_second_open_of_one_file_saved_to_another_folder_withholds_its_mark_and_leaves_the_first_record_unchanged` (name per OPEN-T).
- Old: B's step, then `before` read after it, then `assert_eq!(b.history_mark, HistoryMarkState::Withheld, "B's reply")` (byte-copied), `assert_ne!(b.project, a.project)`, `length()==before`. Then the folder-null save `again` is Withheld, `length()==before`, and after the drop A's record recovers with marks == 1.
- New:
  - A's length is taken right after A's save. It is asserted unchanged after B's step, after B's save and after B's second save.
  - B's reply and B's second reply are Written, and B ≠ A.
  - A's record holds 1 mark. B's record (`sessions/<B hex>/`) holds n2's step and 2 marks.

Every other test in the workspace keeps its assertions unchanged. That includes:
- K1-K4, K6 and K7, K9, and the tests at :242, :276, :522, :556 and :650 of kernel/tests/session_history.rs;
- K-S1-K-S5, K-S8, K-S9, K-W3, K-S10-K-S13 and the withheld and nofolder tests of kernel/tests/project_save.rs;
- P-S1-P-S3 and K-S14 of kernel/tests/project_save_skp.rs;
- record_step_match.rs, record_step_crs.rs, session_history_crash.rs and no_generation_in_persisted_artifacts.rs;
- the unit tests U1-U9 and U-W1 in session_history.rs, and U-P1 and U-P2 in project/mod.rs;
- every shell test.

**New tests.**
- **N1**, kernel/tests/project_save.rs: `a_step_after_a_save_made_before_any_step_goes_to_the_projects_record_under_the_projects_dataset_identity`.
  - A save before any step gives `Withheld::NoStepRecorded`.
  - Then a filter step: `file_names(sessions) == [<P hex>]`, with no `unsaved-` record.
  - Then a second save with the filter workspace gives Written.
  - The header's `project` is P's URI, and the lines are header, step, mark.
- **N2**, kernel/tests/project_save_skp.rs: `a_save_made_before_any_step_binds_the_open_and_a_later_open_saved_elsewhere_keeps_its_own_record`.
  - Open n1 and save it to A before any step. A step on n1 goes to A's record, and a later save of n1 (folder null) gives Written.
  - Close. Open n2 and step it (its own record). Save n2 to folder 2, giving B written.
  - A's record holds only n1's step and B's only n2's, each with parent null.
- **N3**, kernel/tests/project_save.rs: `the_project_files_dataset_uri_is_the_histories_dataset_uri_whichever_comes_first`.
  - `project.spatial`'s dataset `logical_uri` equals the header's dataset URI and every step's `data.dataset`.
  - Checked in both orders: step then save, and save then step.

**Mutations.** Each is applied alone, run, and then reverted. "Old" is the text replaced; for new code it is a declared anchor, which the worker shows occurs once at its build commit (a difference is a class-1 departure).

| id | Where | Old (anchor) | New | Fails | Command (expected exit) |
|---|---|---|---|---|---|
| M1 | record_step's lookup | `r.holder == holder` | `r.holder == holder \|\| (matches!(r.holder, Holder::Open(_)) && matches!(holder, Holder::Open(_)))` | K5, at records == 2 after the reopen | `cargo test -p spatial-kernel --test session_history --locked a_reopen_of_the_same_file` (101) |
| M2 | record_step's lookup | `r.holder == holder` | `r.holder == holder \|\| matches!(r.holder, Holder::Project(_))` | K-S15, at A's length after B's step | `cargo test -p spatial-kernel --test project_save_skp --locked a_second_open_of_one_file` (101) |
| M3 | adopt_project | the open's bind after the move branch | the bind moved inside the move branch, so an open with no record stays unbound | N1, at `file_names == [<P hex>]` | `cargo test -p spatial-kernel --test project_save --locked a_step_after_a_save_made_before_any_step` (101) |
| M4 | the open's holder | `Project(P)` when bound | always `Open(name)` | N2, at n1's later save reply (expected Written) | `cargo test -p spatial-kernel --test project_save_skp --locked a_save_made_before_any_step_binds` (101) |
| M5 | kernel/src/project/mod.rs, save | `self.recorder.dataset_uri(name)` | `DatasetUri::mint()` | N3, at its first equality | `cargo test -p spatial-kernel --test project_save --locked the_project_files_dataset_uri` (101) |
| M6 | create's header | the header's project from the open's binding | always `not-yet-saved` (folder unchanged) | N1, at the header's `project` | as M3 (101) |

- **Revert for each:** restore the old text, then re-run the same command, expected exit 0.
- **Recording:** the worker records every test that fails under each mutation, not only the named one.
- **Survival:** a mutation that survives is a coverage finding. It is recorded in §10 and in the worker's report. It is not a stop and not a pass.

## §5 Predictions, unchanged items, invalidators

- **Predictions.**
  - Each command in §9 exits as stated.
  - M1-M6 each fail the named test with exit 101 and pass again on revert.
- **Unchanged.**
  - Every file outside §2.5.
  - Every existing test name, unless OPEN-T (b) is ruled.
  - Every assertion not named in §4.
  - Wire values and the SKP reply shape.
  - The shell's code and strings.
  - The reader's HEADER shape (kernel/src/session_history.rs:886-900), which already admits both header states.
- **Invalidators.**
  - Any persisted artifact carries a catalog handle (C-5).
  - Any record another run left is written into or removed.
  - An unbound reopen continues an earlier open's record.
  - The project file's `logical_uri` differs from the history's dataset URI for one open.

## §6 Instruments

Assertions in the named tests only. No timing, no benchmark and no docs/08 number is claimed.

## §7 Values and ceilings

- No new value or ceiling.
- The per-record 32 MiB ceiling is unchanged in code. Its user-facing statement (item 43) is reworded under §2.6.
- **What grows.** Records now grow per open with a step. Each holds one locked file handle, and opens are unbounded per run, as records already are. Session-store disk use per run grows with the number of opens with steps; that is stated in the item 43 draft.
- **Size (estimate).** About 525 changed lines over 7 code and test files:
  - session_history.rs ~150;
  - mod.rs ~35;
  - protocol docs ~10;
  - tests ~330 (K5 ~110; K-S15 and N2 ~110; N1 and N3 ~115).
  - Records add 2-4 files.

## §8 Block on sight

- A handle written to disk.
- A record another run left touched.
- A `pub` item with no product caller.
- A test name changed without a superseded row.
- Any file outside §2.5.
- Any wording called the human's.
- A DRAFT or unruled wording reaching main.
- `git stash` used.

## §9 Gates, suites, verification

- **Route.**
  - Full form; architect and reviewer both from dispatch (governance/AUTONOMY.md:315-332 @ 8c693657801fd4168b078a601724bdacd9f479b8, §21a). It is triggered by protocol/skp doc edits, an ADR note and properties under test.
  - Not §21b (:334-345). Not a five-line form (§21c, :347-357): over 150 lines and possibly over 8 files.
  - Not §36 (:687-696): this is a slot-2 piece, not a filler.
  - One review candidate, one packet for both gates. It is under the ~1,500-line split trial, so one PR.
- **Protocol.** The PR reaches protocol/ by doc text only. Rule (00) check: none of the three listed branches touches protocol/.
- **Heavy runs.** All run inside the shared hold, per THE MACHINE paragraph of the custodian's brief, as written.
  - `cargo test -p spatial-kernel --test session_history --test project_save --test project_save_skp --locked` (0)
  - `cargo test --workspace --locked` (0)
  - `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked` (0)
  - M1-M6 as in §4 (101 each, then 0 on revert)
- **Light runs.**
  - `cargo fmt --all -- --check` (0)
  - `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check` (0)
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` (0)
  - `node scripts/…/verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify.mjs` (0 each; the paths as CI runs them)
- **Optional, not in CI.** Shell `npm run verify` (0; a fresh worktree needs npm ci in renderer/bundle-viewer as well). Clippy is not run by CI and is not required here.
- **What the gates re-run.** Both gates re-run the three targeted test files and the workspace suite at the reviewed head. The reviewer applies and observes M1-M6. Readiness is the full suite passing at the reviewed head.

## §10 Amendments

(empty)

=====================================================================
NOTES (lead-data's)
=====================================================================

1. **Design.** The open, not the path, is the key. The open name is the catalog name that record_step's request and `Projects::save(name, …)` already carry. It stays in memory only, so kernel/tests/no_generation_in_persisted_artifacts.rs:814 and :927 hold.
2. **The shell needs no code change.**
   - frontends/shell/src-tauri lib.rs:454, :461 and :592 and commands.rs:149 and :171 call only `StepRecorder::new`, `record_step`, `end_session`, `Projects` construction and `save_project`.
   - None of them touches `adopt_project`, `mark_saved_here`, `SavedHere` or `Withheld`.
3. **Visible effect (OPEN-S5).** frontends/shell/src/project/saveProject.ts:27-28 defines S5, byte-copied: `"[P6 placeholder] The session history holds no saved-here mark for this save."`. It shows at :112 when the reply is withheld. After this piece, a save of a second open to another folder replies written, so S5 no longer shows in that case. The string is unchanged.
   - Walkthrough Part AD's AD1 (frontends/shell/MANUAL-WALKTHROUGH.md:2017 @ 8c693657801fd4168b078a601724bdacd9f479b8) uses one open and a save after a step. Its expected outcomes are unchanged.
4. **Rule (00).**
   - Scope is disjoint from `cut/b1-shell-half-pr-b` @6649a443 (none) and from `cut/pan-anchor-setcam-waits-for-its-own-reset` @624b2e68 (none).
   - Against `cut/port-2-macos-l1-and-app-dirs` @83d2ecef, Scope is disjoint by file: none of its eleven files is in §2.5. port-2 does touch kernel/src/permission/audit/log.rs, from which session_history.rs imports `data_dir`, but that is not the same path.
   - The walkthrough-Part and KNOWN-LIMITATIONS-item rule counts items as paths. B2-1C Amendment 26 item 7 records port-2 touching KNOWN-LIMITATIONS.md "in its portability levels and item 43". If that holds at @83d2ecef, item 43 is shared with this piece's C2/C3 (OPEN-43).
5. **Grant item 4.** Nothing here touches it: no dependency, no CI change, no install, no setting.
6. **verify-test-claims.**
   - 1b is done, so K5's claimed name at governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:533 is binding. Keeping the name keeps it satisfied.
   - 1c is in progress, so K-S15's name at governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1668 is planned.
   - The form above names K5 and K-S15 by K-id and file:line, so it adds no new binding claim on the old names.

=====================================================================
OPEN ITEMS
=====================================================================

**OPEN-5c.** Item 5 (c), a save into a project whose record this run already holds. For the advisor, under the delegation of 2026-11-13. It was a red line before the grant, as a scope change to a ruled item (OPEN-S2-1 (c), OPEN-N4).

Does OPEN-N4 (a) cover it? Yes, provided step 2 binds the reopened open inside the reopen command, before any step on the new handle. At this node it is unreachable (§2.4).
- (A) As built: fail closed (withheld, HistoryUnwritable, no line in P's record). Carry "bind within the reopen call, before any step" and "two live opens bound to one record" (interleaved parents, a shared Reached; the shell closes the old handle, so this is not ordinary use) to step 2's form.
- (B) A named `Withheld` variant for this case. It has no reachable producer at this node, so it breaks the caller rule.
- (C) Merge or rewrite the two chains. This is a format change to ADR-036.

Recommendation: (A).

**OPEN-T.** Test names K5 and K-S15. For the custodian, because it departs from the brief's item 8.
- (a) Keep both names, per the brief, with doc comments that state the new behaviour. K5's name ("continues_its_record") and K-S15's ("withholds_its_mark") then say the opposite of what they assert.
- (b) Rename them to `an_unbound_reopen_of_the_same_file_starts_its_own_record_and_another_file_its_own` and `a_second_open_of_one_file_saved_to_another_folder_writes_its_own_mark_and_leaves_the_first_record_unchanged`. This needs a class-3 superseded, hash-pinned row appended to the 1b form (binding, node done) and to the 1c form (planned), at a rev on main, and adds those two files to Scope (§2.5 items 10 and 11).

Recommendation: (b). The form as drafted follows (a) until the custodian rules.

**OPEN-P.** Is the SKP-V0.md §11.2/§11.3 and HistoryMarkState doc change a contract change? A question for the custodian, per my limits, to route as it decides.
- The wire values and shape are unchanged.
- One case that gave `withheld` now gives `written`, so the documented guarantee changes. O-2 was ruled, but the ruling does not name the SKP text.

Recommendation: no version change. The doc sentences land with the code in the worker's words, are clause-checked, and are listed with the item 5 (d) words for the advisor's sight.

**OPEN-S5.** S5 no longer shows when a second open is saved to another folder (Note 3). For the advisor. It was a red line before the grant (strings the app shows, P6 sight).
- (A) Accept it, and list it on the P6 sight list as a changed occasion with an unchanged string.
- (B) Hold the piece for a shell-side notice.

Recommendation: (A).

**OPEN-W.** How the item 5 (d) drafts move. This is process, not a ruling. My recommendation is taken, dated 2026-11-13, under the 2026-10-31 directive item 4 (held to 2026-11-16).
- KNOWN-LIMITATIONS drafts go in the file as DRAFT text.
- The ADR-036 note is drafted in the worker's report only, then appended once with the ruled words.
- C3 is checked by the gates as words against the ruling, byte for byte.

Alternative: all drafts in the report only. Not recommended, because it leaves the item 63 comment naming K-S15 stale at the reviewed head.

**OPEN-43.** Item 43 is shared with port-2 (Note 4). For the custodian's rule (00) check before the records commit.
- (A) Order this piece's C2 after port-2's merge or hold.
- (B) If port-2's item 43 edit is only the portability text, treat it as disjoint and record that.

Recommendation: (A) if any item 43 line is touched at @83d2ecef.

**Carry-over to step 2** (a record only, not a ruling now):
- N4 (a)'s bind inside the reopen.
- A `pub(crate)` seam to bind an open to (P, the project file's dataset URI) at the reopen. It is step 2's to add, because it has no caller here.
- The case of another run's leftover `sessions/<P hex>/` meeting C2 (i)'s `create_dir`. That case cannot arise at this node, since P is freshly minted from 128 bits.

=====================================================================
WHAT I COULD NOT SETTLE
=====================================================================

- Whether a forms index names another path for this form. I did not read one.
- Whether port-2's branch edits item 43's lines at @83d2ecef. I did not read the branch; I read only B2-1C Amendment 26 item 7's statement.
- The exact anchor texts of the new code for M1-M6. They are declared, and the worker records them.
- Exact line counts. §7 is an estimate.

Result: full form drafted for second-open-history-before-1c-step-3 (O-2, C2 (i), I-b), one kernel PR touching protocol/ docs only, with K5 and K-S15 changed, N1-N3 new and mutations M1-M6.
Blocking question (custodian): OPEN-T, keep the K5 and K-S15 names per the brief (a), or rename them with superseded rows (b, recommended)?
Blocking question (custodian): OPEN-P, is the SKP-V0.md §11.2/§11.3 and HistoryMarkState doc change a contract change needing more than the O-2 ruling?
Blocking question (advisor): OPEN-5c, accept fail-closed (A) at this node, with the bind-within-reopen carried to step 2?
Report path: C:/dev/spatial-ide/state/consults/2026-11-13-second-open-history-before-1c-step-3-form-lead-data-draft.md
sha256: none. I have no shell.
