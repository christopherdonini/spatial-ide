# The second-open node's form: lead-data's revision under ADV-2026-11-13-20 (2026-11-13), read only, from which the custodian commits the form

*Filed by the custodian on 2026-11-13: lead-data's report, byte for byte from the message of its second hand-back call in its subagent transcript, with one final newline added (39027 bytes, sha256 8bca47298fc065a47d440a06f445e18607ea60b4bc73004cbcec8d77d1818124). Its brief: 7154 bytes, sha256 476b9e1c2b13ee485ad9ede10e899125101ff84f25fe012795a6c43f0f1cba56, sent at main 5b5fb0a39c03d8caa0682efdb44d3d6dec562bca to the same agent, resumed; the resumed run from 2026-11-13T23:16:34.388Z to 2026-11-13T23:21:48.717Z by the transcript, model claude-opus-5-5, 19 tool calls (Read 9, Grep 9, the hand-back 1), none errored, none a write. The words are lead-data's. The custodian's notes, not the report: (1) every text it marks byte-copied is byte-identical at its cited lines at 8c693657 by the custodian's script, the three reformatted in the draft included; (2) the form is committed at `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md` from part 1, with a carry note and the first Authority bullet's directive written as its path; (3) the custodian checked the advisor's reading of the draft's section 2.1 before the revision and found it right, as told to the advisor.*

---

Revised form: second-open-history-before-1c-step-3, lead-data

# Preregistration: second-open-history-before-1c-step-3 (kernel)

**Node:** `second-open-history-before-1c-step-3` (governance/PLAN.yaml:5588-5604 @ 8c693657801fd4168b078a601724bdacd9f479b8). It is status ready, in lane kernel-protocol, with depends_on publish-approval-columns-line, which is done (governance/PLAN.yaml:7178-7187 @ 8c693657801fd4168b078a601724bdacd9f479b8).

**Authority:**
- Item 5 of the human's third message of 2026-11-12 (state/directives, the third message of 2026-11-12, lines 24-29; item 8 at line 35).
- The rulings recorded at B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md Amendment 28, class 5 (governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1870-1881 @ 8c693657801fd4168b078a601724bdacd9f479b8). These are O-2, C2 (i), I-b, OPEN-N4 (a) and OPEN-N6. They replace OPEN-21-1 (b) (same file :1805) and K-S15's shape (same file :1668).
- The grant of 2026-11-13, items 2-4 (state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md:15-26 @ 8c693657801fd4168b078a601724bdacd9f479b8). What item 5 (c) and (d) send to the human goes to the advisor under the grant of 2026-11-13. The words ruled there are the advisor's wording and are never called the human's.
- The advisor's ruling ADV-2026-11-13-20, under the delegation of 2026-11-13: state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-20-second-open-5c-a-s5-a-skp-section-8-note-tests-renamed-item-43-in-turns.md.
- **Reuse index miss.** The reuse index was run at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c and exited 1. Its output, byte for byte: No prior art recorded for "second open history project record step save lineage". Research it before planning an implementation.

**Drafted by:** lead-data, at 8c693657801fd4168b078a601724bdacd9f479b8. Revised by lead-data under ADV-2026-11-13-20, from main at 5b5fb0a39c03d8caa0682efdb44d3d6dec562bca, with no change between the two revs to any path this form cites in kernel/, protocol/, governance/forms/kernel/, docs/adr/, frontends/shell/src/project/, scripts/plan/verify-test-claims.mjs or KNOWN-LIMITATIONS.md. Committed on main before any code. Append-only after commit: amendments go in §10.

**Ruled items.** Each is recorded as the advisor's ruling, under the delegation of 2026-11-13, and never as the human's words.
- **OPEN-5c → ADV-2026-11-13-20 item 1: (A), with two corrections.** The case is unreachable at this node, and OPEN-N4 (a) covers its only route, step 2's reopen, so no option goes back to the human under item 5 (c). The digest lists this, and the human may overturn it. The form states both sub-cases (§2.4). Those sentences are not under test here. (B) and (C) are not taken.
- **OPEN-S5 → item 2: (A).** S5 is not shown when a second open is saved to another folder, and the string is unchanged. The P6 sight list gains one line naming the changed occasion, and the piece is not held for a shell-side notice.
  - The P6 sight list on main is the operator sitting queue, the PLAN node `operator-sitting-queue` in governance/PLAN.yaml. Its summary says later P6 sights join that list.
  - The line, in lead-data's draft words: "S5 (frontends/shell/src/project/saveProject.ts:27-28): no longer shown when a second open of one file is saved to another folder, which now replies written (second-open-history-before-1c-step-3; ADV-2026-11-13-20 item 2); the string is unchanged."
  - The custodian adds it to that node on the PR's merge and records it in this form's closing amendment.
- **OPEN-P → item 3: no version change; `skp/0.13` stands.** §11.2's `history_mark` paragraph, §11.3's "Every save" bullet and `HistoryMarkState`'s rustdoc are brought current in place. §8 gains one appended note of the dated, no-literal-change shape (§2.3). Both are listed for the advisor's sight (§2.6).
- **OPEN-T → item 4: (b).** Both tests are renamed to the names in §4. The 1b and 1c forms each gain one appended superseded, hash-pinned row, in the records commit (§2.5 items 10 and 11). Every command naming either test takes the new name. Item 4 (e)'s condition is in §2.5.
- **OPEN-43 → item 5: item 43 is held in turns.** Item 5 makes an exception to rule (00a) for KNOWN-LIMITATIONS item 43 alone. C1 is dispatched once this form is committed. The turn rule is in §2.6.
- **OPEN-W → taken under ruling (24)** (the 2026-10-31 directive item 4, held to 2026-11-16), dated 2026-11-13. The advisor raised no objection (item 7). At its merge check the advisor compares the KNOWN-LIMITATIONS items and the ADR-036 note at the head with its ruling of those words, byte for byte.
- **The Authority wording → item 6.** It is the fourth Authority bullet above.
- **This form → item 8.** It is committed from the draft with items 1 to 6 applied.

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

Item 5 (c) is not a claim of this form. §2.4 describes it, and no test proves it.

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
  - The arm at :370-372 is removed. Byte-copied from kernel/src/project/mod.rs:370-372 @ 8c693657801fd4168b078a601724bdacd9f479b8:

    ```rust
                Ok(SavedHere::HeldByAnotherProject) => {
                    HistoryMark::Withheld(Withheld::RecordHeldByAnotherProject)
                }
    ```

  - `Withheld::RecordHeldByAnotherProject` (:153-155) is removed with its doc.
- **Unchanged.** `save`'s pub signature (:237) and its other behaviour: FolderHoldsProject (:263-265), `known` by catalog name (:245), and `replace` (:302).
- **Docs brought current, in the worker's words.** The module doc at :16-17 and save's doc bullet at :231-236, which name the "another project of this run holds" case.

### §2.3 protocol/ (doc text only; no wire change, no version change)

- **protocol/skp/src/v0/commands.rs:743-747.** HistoryMarkState's rustdoc, byte-copied from protocol/skp/src/v0/commands.rs:743-747 @ 8c693657801fd4168b078a601724bdacd9f479b8:

  ```rust
  /// Whether the session history took the `saved-here` mark. The project file was written in both
  /// cases; `withheld` says that the history holds no recorded step for the dataset, that the
  /// history's record for the dataset's file belongs to another project this run has saved, that the
  /// recorded steps do not reach the saved workspace, or that the history could not take the record
  /// move or the line.
  ```

  The case at lines 744-745, a record belonging to another project this run has saved, no longer exists, so the sentence is brought current.
- **protocol/skp/SKP-V0.md:1340 (§11.2) and :1346 (§11.3).** Each describes when `withheld` or a mark is given in terms of "no other project holds the record", which no longer occurs. Both are brought current in the worker's words and clause-checked by the gates.
- **protocol/skp/SKP-V0.md §8, one appended note (ADV-2026-11-13-20 item 3 (c)).**
  - It goes below the last note of §8, which is the note at protocol/skp/SKP-V0.md:1146-1148 @ 8c693657801fd4168b078a601724bdacd9f479b8. §9 begins at :1150.
  - Its shape is that of the notes at :1108-1115, :1117-1125 and :1146-1148 @ 8c693657801fd4168b078a601724bdacd9f479b8: a heading `### Note: <what changed> (<date>; no literal change)`, then a bold sentence that the version stands, that no literal is bumped and that no fixture changes, then the change.
  - It says which case changed its reply (a second open of one file saved to another folder: `withheld` before, `written` now) and that no literal is bumped. The worker writes it.
- The values `written` and `withheld` and the reply shape are unchanged. No key, value, command or fixture changes. No conformance test pins this prose. The version stays `skp/0.13` (ADV-2026-11-13-20 item 3).

### §2.4 Item 5 (c), a save into a project whose record this run already holds

At this node no command reaches it (ADV-2026-11-13-20 item 1 (a)):
- a first save always mints a new identity (:251);
- FolderHoldsProject refuses a folder that already holds a project (:263-265);
- a later save is the open's own project (`known` by catalog name, :245, and a reopen gets a new catalog name).

It becomes reachable only through step 2's reopen of a project. OPEN-N4 (a) covers it: such a reopen is bound at the reopen and continues that record (item 1 (b)).

If the case is reached, the shape declared in §2.1 gives two sub-cases (item 1 (c)):
- **An open with a record of its own.** The move's folder exists, so the record move's `create_dir` (:443) refuses it. `adopt_project` returns an error and leaves the open unbound (§2.1 item 7). The save stands and replies withheld (HistoryUnwritable). The open's record stays its own, and the project's record gets no line.
- **An open with no record of its own.** It is bound without a move (§2.1 item 7). Its save looks up the record the project holds and may write a mark there (§2.1 item 8), and its later steps continue that record (§2.1 item 4). That is OPEN-N4 (a)'s behaviour, not a failure.

The sentences above on what happens if the case is reached describe the declared shape and are not under test at this node. They are not among the claims §4's tests prove, and no test and no `pub` item is added for the case (item 1 (d)).

**Carried to step 2's form (item 1 (e)):**
1. The bind inside the reopen, before any step on the new handle.
2. The seam that binds an open at the reopen, to the project and the project file's dataset URI. It has no caller here.
3. Two live opens bound to one record (interleaved parents, a shared Reached).
4. Another run's leftover folder under the project's name meeting the first step's `create`.
5. A test of both sub-cases above, since step 2 makes the route.

### §2.5 Scope (files the PR may touch)

1. kernel/src/session_history.rs
2. kernel/src/project/mod.rs
3. kernel/tests/session_history.rs
4. kernel/tests/project_save.rs
5. kernel/tests/project_save_skp.rs
6. protocol/skp/src/v0/commands.rs (rustdoc only)
7. protocol/skp/SKP-V0.md (§8's appended note, §11.2 and §11.3 only)
8. KNOWN-LIMITATIONS.md (items 63 and 43 only; DRAFT text, then the advisor's ruled words; see §2.6). Item 43 is held in turns with port-2 under §2.6's turn rule.
9. docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md (one appended note, the advisor's ruled words only)
10. governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md: one appended superseded, hash-pinned row for K5's old name (the claim at :533 @ 8c693657801fd4168b078a601724bdacd9f479b8), and nothing else in the file.
11. governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md: one appended superseded, hash-pinned row for K-S15's old name (the claim at :1668 @ 8c693657801fd4168b078a601724bdacd9f479b8), and nothing else in the file.

**The rows of items 10 and 11** (ADV-2026-11-13-20 item 4 (b) and (c)). Each row meets the rule in the header of scripts/plan/verify-test-claims.mjs:52-90 @ 8c693657801fd4168b078a601724bdacd9f479b8:
- It carries a reference of the grammar byte-copied from :53: `path:line @ <rev> sha256:<hex>`. The reference's line range covers the claim's line (condition (a)).
- The word `superseded` or `Superseded` sits on the row's own line, outside any backtick span, and is not preceded by `not` or `never` (b).
- The hash recomputes against the file's bytes at `<rev>` (c). The worker computes it, and the reviewer recomputes it.
- The claim's own line at `<rev>` names the old test (d).
- `<rev>` is a commit on main at which the claim line is unchanged (e). The 1b node is done, so the same-PR exception at :82-90 is not relied on for either row.
- Each row names the new test, and names the old test only through its pinned reference, so that the row adds no claim of a test that no longer exists.
- The rows go in the PR's records commit (C2), so that the rename and its rows are checked at one head.

**Item 4 (e)'s condition.** While the PR is open, an append to the 1b form or the 1c form on main would meet the PR's row at the end of the same file. If one is needed before the merge, the custodian tells the advisor first.

Nothing else. In particular: no frontends/ file, no engine/ file, no other kernel/ file, no Cargo.toml or Cargo.lock, no CI file, and no governance/PLAN.yaml line. The P6 sight list's line is the custodian's, on main, after the merge.

### §2.6 The words after the code (item 5 (d))

These are written by the worker at the records commit, clause-checked by both gates against the built code, and go to the advisor. Nothing lands on main before the advisor's ruling. Records and source comments call the ruled text "the advisor's wording, under the delegation of 2026-11-13", never the human's.

- **OPEN-N5.**
  - KNOWN-LIMITATIONS item 63 (KNOWN-LIMITATIONS.md:506-508; DRAFT; its comment names K-S15 by test name) is drafted for withdrawal or rewording.
  - Item 43 (KNOWN-LIMITATIONS.md:436; approved words "at most 32 MiB for one dataset in one run", byte-copied) is drafted for rewording, because the ceiling now holds per record (per open, or per bound project), not per dataset per run.
  - Both go in the file as DRAFT text, using the DRAFT-comment precedent of items 62 and 63 (KNOWN-LIMITATIONS.md:502-508).
- **Item 43, held in turns with port-2 (ADV-2026-11-13-20 item 5 (d) to (h)).**
  - The exception to rule (00a) is for item 43 alone. Port-2's other KNOWN-LIMITATIONS hunks (item 1's two lines) are not shared with this piece (item 5 (i)). Neither piece waits for the other in anything else.
  - Each piece holds the item from one point. This piece's point is its records commit that carries item 43's draft. Port-2's point is the dispatch of its gates (item 5 (e)).
  - The piece that reaches its point first holds item 43 until it merges. The other does not pass its own point until then.
  - The piece going second then takes main in and makes its own change on main's line. If that is this piece, it rewords the 32 MiB clause in the merged line, records this in an amendment to this form, and its gates read item 43 whole (item 5 (f)).
  - If both reach their points within the same hour, or the custodian cannot tell which is first, the custodian tells the advisor, who decides (item 5 (h)).
- **ADR-036 note.** Drafted in the worker's report only. It is appended once, at the ruled-words commit, because ADR-036 is accepted and append-only. Its topics:
  - the key (a record per open until bound);
  - a project record created without a move, which adds to Amendment 1 item 5 (docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:272);
  - I-b against §4's "minted when a dataset first enters a project" (same file :72);
  - N4 (a) as step 2's.
- **Listed for the advisor's sight with these words (ADV-2026-11-13-20 item 3 (d)):** the §8 note of protocol/skp/SKP-V0.md, and the sentences of §11.2, §11.3 and HistoryMarkState's rustdoc (§2.3). They are the worker's words, checked by both gates. The advisor rules them only if a gate asks.
- **Commit order.**
  - C0: the form, on main. C1 is dispatched once it is committed.
  - C1: code, tests, the in-code doc sentences and the protocol doc sentences, with §8's note.
  - C2: the records commit. The KNOWN-LIMITATIONS DRAFTs, with item 43 under the turn rule above; the ADR note draft in the report; the two superseded rows (§2.5 items 10 and 11).
  - C3: the advisor's ruled words, replacing the DRAFTs byte for byte and appending the ADR note. The gates check C3 as words against the ruling, byte for byte.
- The kernel owner's index lines are not in this PR. They are lead-data's update after the merge, at the custodian's brief.
- **After the merge, the custodian's (not in the PR).** The P6 sight list's line for S5 (Ruled items, OPEN-S5), recorded in this form's closing amendment.

## §3 Fixtures

- **F1.** In-test only, as the existing rigs make them: kernel/tests/project_save.rs Rig at :107-132 and kernel/tests/project_save_skp.rs Rig at :42-85, both @ 8c693657801fd4168b078a601724bdacd9f479b8.
- No new fixture file and no generated data.

## §4 Tests and mutations

**Changed assertions and names (the only ones).**

**K5.** kernel/tests/session_history.rs:339-405 @ 8c693657801fd4168b078a601724bdacd9f479b8, renamed to `an_unbound_reopen_of_the_same_file_starts_its_own_record_and_another_file_its_own` (ADV-2026-11-13-20 item 4). Its old name is the one claimed at governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:533 @ 8c693657801fd4168b078a601724bdacd9f479b8.
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
- 1b's claim row (governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:533) stays as history; its node is done. It gains the superseded row of §2.5 item 10.

**K-S15.** kernel/tests/project_save_skp.rs:371-457 @ 8c693657801fd4168b078a601724bdacd9f479b8, renamed to `a_second_open_of_one_file_saved_to_another_folder_writes_its_own_mark_and_leaves_the_first_record_unchanged` (ADV-2026-11-13-20 item 4). Its old name is the one claimed at governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1668 @ 8c693657801fd4168b078a601724bdacd9f479b8. That claim gains the superseded row of §2.5 item 11.
- Old: B's step, then `before` read after it, then `assert_eq!(b.history_mark, HistoryMarkState::Withheld, "B's reply")` (byte-copied), `assert_ne!(b.project, a.project)`, `length()==before`. Then the folder-null save `again` is Withheld, `length()==before`, and after the drop A's record recovers with marks == 1.
- New:
  - A's length is taken right after A's save. It is asserted unchanged after B's step, after B's save and after B's second save.
  - B's reply and B's second reply are Written, and B ≠ A.
  - A's record holds 1 mark. B's record (`sessions/<B hex>/`) holds n2's step and 2 marks.

Every other test in the workspace keeps its name and its assertions unchanged. That includes:
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
| M1 | record_step's lookup | `r.holder == holder` | `r.holder == holder \|\| (matches!(r.holder, Holder::Open(_)) && matches!(holder, Holder::Open(_)))` | K5, at records == 2 after the reopen | `cargo test -p spatial-kernel --test session_history --locked an_unbound_reopen_of_the_same_file_starts_its_own_record_and_another_file_its_own` (101) |
| M2 | record_step's lookup | `r.holder == holder` | `r.holder == holder \|\| matches!(r.holder, Holder::Project(_))` | K-S15, at A's length after B's step | `cargo test -p spatial-kernel --test project_save_skp --locked a_second_open_of_one_file_saved_to_another_folder_writes_its_own_mark_and_leaves_the_first_record_unchanged` (101) |
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
  - Every existing test name except K5's and K-S15's, which are renamed under ADV-2026-11-13-20 item 4.
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
- **Size (estimate).** About 530 changed lines over 7 code and test files:
  - session_history.rs ~150;
  - mod.rs ~35;
  - protocol docs ~15, with §8's note;
  - tests ~330 (K5 ~110; K-S15 and N2 ~110; N1 and N3 ~115).
  - Records add 4 files: KNOWN-LIMITATIONS.md, ADR-036, and the 1b and 1c forms.

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
  - Not §21b (:334-345). Not a five-line form (§21c, :347-357): over 150 lines and over 8 files (eleven in §2.5).
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
  - `node scripts/…/verify-cites.mjs`, `verify-quotes.mjs`, `verify-test-claims.mjs` and `verify.mjs` (0 each; the paths as CI runs them). verify-test-claims at C2 reports both superseded rows as accepted.
- **Optional, not in CI.** Shell `npm run verify` (0; a fresh worktree needs npm ci in renderer/bundle-viewer as well). Clippy is not run by CI and is not required here.
- **What the gates re-run.** Both gates re-run the three targeted test files and the workspace suite at the reviewed head. The reviewer applies and observes M1-M6. Readiness is the full suite passing at the reviewed head.

## §10 Amendments

(empty)

=== CHANGES ===

**Authority and header**
- Authority, third bullet (ADV-2026-11-13-20 item 6): the sentence about "the human" re-read as the advisor is replaced. It now says that what item 5 (c) and (d) send to the human goes to the advisor under the grant of 2026-11-13, and that the words ruled there are the advisor's wording, never called the human's.
- Authority, a new fourth bullet (item 6): the ruling's path under state/directives/, with no line numbers.
- Drafted by (item 8): a revision sentence is added, naming ADV-2026-11-13-20, main at 5b5fb0a3 and the custodian's empty diff for the cited paths.
- A new "Ruled items" block after Drafted by (items 7 and 8; brief item 7). It replaces the draft's OPEN items, which sat outside the form. Each entry gives the ruling id and item, the option and what it settles: OPEN-5c item 1, OPEN-S5 item 2, OPEN-P item 3, OPEN-T item 4, OPEN-43 item 5, OPEN-W taken under ruling (24) with item 7's no-objection and its merge-check comparison, item 6, and item 8.
- Ruled items, OPEN-S5 (item 2): the P6 sight list is named as the PLAN node `operator-sitting-queue` in governance/PLAN.yaml. No dedicated file exists; that node's summary says later P6 sights join it. Its one line is drafted in my words. It is placed with the custodian on main after the merge, outside the PR's Scope.

**§1 Claims**
- C-6 is removed from the list of claims and replaced by one sentence pointing to §2.4 as not a claim of this form (item 1 (d)). C-1 to C-5 are unchanged.

**§2.1 to §2.3**
- §2.1, the `record_step` lookup block (brief item 8): re-copied from kernel/src/session_history.rs:243-252 with the file's indent (eight spaces, and twelve and sixteen on the inner lines).
- §2.2, the match arm (brief item 8): now the three lines of kernel/src/project/mod.rs:370-372 as in the file, in a code block.
- §2.3, HistoryMarkState (brief item 8): the phrase is replaced by lines 743-747 of protocol/skp/src/v0/commands.rs, quoted whole. The case is described in my words.
- §2.3, a new bullet (item 3 (c)): the appended §8 note of SKP-V0.md. It is placed below the note at :1146-1148, in the shape of the notes at :1108-1115, :1117-1125 and :1146-1148 @ 8c693657.
- §2.3, last bullet (item 3 (a)): it states that the version stays `skp/0.13`. The "OPEN-P below" sentence is removed.

**§2.4**
- Item 1 (a) to (c): the single fail-closed case is replaced by the two sub-cases.
- Item 1 (d): the not-under-test sentence is added in its words, with "no test and no `pub` item".
- Item 1 (e): the "My recommendation" line is removed. A carry-over list of five is added, its fifth entry being the test of both sub-cases. It moves the draft's carry-over items into the form.

**§2.5 Scope**
- Item 7 (item 3 (c)) names §8's appended note beside §11.2 and §11.3.
- Item 8 (item 5) names the turn rule.
- Items 10 and 11 (item 4 (b)) are now definite, with "nothing else in the file".
- A new paragraph (item 4 (b) and (c); brief item 4) gives each row's shape against scripts/plan/verify-test-claims.mjs:52-90 @ 8c693657. It quotes the reference grammar byte-copied from :53 and places the rows in C2.
- Item 4 (e)'s condition is named.
- The closing line excludes governance/PLAN.yaml.

**§2.6**
- A new item 43 turn-rule bullet (item 5 (d) to (i)).
- A new list for the advisor's sight (item 3 (d)).
- Commit order (item 5 (b); item 4 (c)): C0 now dispatches C1 once committed. C1 carries §8's note, and C2 carries the two rows and item 43 under the turn rule.
- A new line: the P6 sight list's line is the custodian's after the merge (item 2).

**§4**
- K5 and K-S15 take their new names (item 4). Each old name is referred to only by its claim cite in the 1b or 1c form, so the form adds no claim on a name that will not exist.
- "Every other test" now reads "keeps its name and its assertions".
- M1's and M2's commands take the full new names (item 4 (d)).

**§5 to §9 (forced changes)**
- §5, Unchanged: test names, with K5 and K-S15 excepted under item 4.
- §7: protocol docs ~15 and total about 530 (§8's note), and records add 4 files. These are forced by items 3 and 4.
- §9, Route: "possibly over 8 files" now reads "over 8 files (eleven in §2.5)", forced by item 4. verify-test-claims at C2 reports both rows as accepted.

**Removed and noted**
- Removed with the draft's outer parts (brief Report item 1): the draft's opening line, its preamble, NOTES, OPEN ITEMS, WHAT I COULD NOT SETTLE and closing lines. Their rulable content is in Ruled items, §2.4 and §2.6.
- Noted, not changed: M3 to M5's commands still filter on prefixes of N1 to N3's names, as drafted. No ruling names them. Whether verify-test-claims reads such a prefix as a claim once the node is done is for the gates.

**Reading notes**
- I read the SKP-V0.md §8 notes, the verify-test-claims header and the PLAN node in the working tree. I cite the first two at 8c693657 as the brief directs. I cite the PLAN node by id only, because governance/PLAN.yaml is not among the paths the brief's diff covers.
- I have no shell, so I could not check the size or sha256 of the brief or of the ruling file. I read each whole, 35 and 46 lines.
- I leave no background shell. I give no sha256 of this report.
- Model, as the harness reports it: claude-opus-5-5.

=== COULD NOT APPLY ===

none
