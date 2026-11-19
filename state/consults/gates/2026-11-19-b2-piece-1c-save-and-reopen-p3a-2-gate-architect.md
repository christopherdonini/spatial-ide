Reviewed: PR #337 at b5c351564dd4798fdd341e783b9d71b0054242e9 (the custodian's filing note, 2026-11-19: the architect, one of PR 337's two gates under the full form (Amendment 36 item 13), attempt 1; Read 31, Grep 28, Glob 1, Bash 1, two errored (the Bash call, which is not among its tools, and one Read over the size limit), model claude-opus-5-5, from 2026-11-19T08:55:15Z to 09:06:33Z by its transcript; the report below byte for byte from its hand-back of 19383 bytes, sha256 80de20e0019f52054d31614bfeb14702aa171ee749fc437e7b3cbb29a982fc09, nothing masked, with this note in its first line and one final newline), gate, architect
Reviewed: PR #337 at b5c351564dd4798fdd341e783b9d71b0054242e9, gate, architect
Verdict: FAIL
cut/b2-piece-1c-p3a-2 @ b5c351564dd4798fdd341e783b9d71b0054242e9 (read in the worktree the brief names as checked out at H; I have no Bash, so I ran no git, cargo or hash)

The FAIL rests on one Evidence finding, E1. It needs no product change. Reading the code, I found no Correctness finding.

## Findings by class

**Correctness.** None. By reading, the code does what Amendments 36 and 37 declare for P3a-2, under P-2 option (i) (question 1).

**Evidence**
- **E1. K-O19 has no observed mutation of its own claim.** Amendment 39 item 2 predicted that K-O18's mutation would fail K-O19 "at its step or at an assertion after it". It failed instead at the `assert!` right after the save and before the step (`kernel/tests/project_reopen.rs:1679 at H`). That assertion repeats K-O18's claim: the save is withheld as unwritable. The step (`:1680 at H`) and the two assertions after it (`:1682-1686 at H`) were never reached. So the observed failure is evidence that the open stayed unbound at the save. It is not evidence for option (i)'s outcome, which is that the step is recorded under the open's own record and the leftover is unchanged. The prediction is not met. This goes to the advisor. Fix, the advisor's choice:
  - (a) Observe one more mutation by the round-25 rule, with no product change. In `StepRecorder::adopt_project`'s item 5 (g) arm (`kernel/src/session_history.rs:374-377 at H`), bind the open (`state.open(open).bound = Some(project.clone())`) before the error is returned. Predicted: the save is still withheld as unwritable, so `:1679` holds. The step then reaches `create` with `Holder::Project`, and `create_dir` (`kernel/src/session_history.rs:481 at H`) refuses the leftover folder. K-O19 therefore fails at its step, at `Run::opacity_step`'s `expect("recorded")` (`kernel/tests/project_reopen.rs:610 at H`, called from `:1680`). Then one comment-only commit names it. K-O18 will also fail under this mutation, at its second save; that is expected.
  - (b) Record K-O19's step and post-step assertions as not covered by an observed mutation.

**Documentation** (each must be fixed before the merge, with no re-gate; none of these sentences is the human's wording)
- **D1.** `SavedProject._lock`'s doc, `kernel/src/project/mod.rs:131-132 at H`. Draft 1.
- **D2.** `Projects::save`'s later-save bullet, `kernel/src/project/mod.rs:232-234 at H`. Draft 2.
- **D3.** Two sentences in `kernel/src/project/mod.rs` that this part made untrue for a reopen:
  - `:244-247 at H`: "A second open of the same file … never go to the first open's record". This is false for K-O22's reopen.
  - `Projects`' struct doc, `:116 at H`.
  - These are outside Amendment 39 item 5's two places, so the advisor decides whether they join the words commit. Drafts 3 and 4.
- **D4.** `kernel/src/session_history.rs` docs that still say only a save binds an open. `reopened` now binds too (`:393-395 at H`):
  - `Holder`, `:123-124 at H`;
  - `Open::bound`, `:138 at H`;
  - `Record`, `:152-154 at H`.
  - The same routing as D3 applies. Drafts 5 to 7.
- **D5.** The K-O19 comment carries a bare `:1673` into the file its own commit edits (`kernel/tests/project_reopen.rs:1666 at H`). At H the line has moved to `:1679`. The round-14 rule forbids this. Draft 8 replaces it, comment lines only. The closing names the line with the commit it was read at. By the worker-high's report that commit is 270d3ac2c17c6551f7783c1feba1bfc5ad140178. Per round 25, the line is not hash-pinned at a branch commit.
- **D6.** `governance/PLAN.yaml`'s node summary does not name P3a-2's pre-committed producers: `Projects::open_project`, `Answer`, `Reopen`, `Opened`, `ViewState` and `OpenFailure`. Their consumer is P3b's binding, gated by the `v0-open_project-*` fixtures and E-REOPEN.
  - I grepped for `OpenFailure`, `Reopen,`, `ViewState` and `v0-open_project-*`: no match. P1a, P1b and P2 are named.
  - Amendment 36 item 8 and the round-8 exemption both need the summary and the PR body to name them.
  - The custodian adds them and confirms the PR body. I cannot read the PR body.

**Observation** (none blocks)
- **O1. A re-link refusal after step 3's writes.** When the place is not `Known`, the re-link check (`mod.rs:707-710 at H`) runs after step 3's writes (`:689-695`). A refused re-link then leaves `folders.json`, and for a copy `project.spatial`, written. Amendment 36 item 5 (e) says "with nothing written".
  - Nothing can reach this at H: `open_project` has no product caller.
  - In the flow P3b will drive (a re-link given after `not_found` for the same folder), the first call has already made the folder `Known`.
  - Cheap fix, if the advisor wants it: move `:707-710` above `ProjectLock::try_lock` (`:680`).
- **O2. `mtime` against the form's F4 row.** The form's §3 F4 row predicts that `check.observed` names `modified_ns`.
  - The merged producer's word is `mtime`. `RefCheck::Differs.observed` is "in the descriptor's own vocabulary" (`kernel/src/dataset_ref.rs:151 at H`), and `differing_components` pushes `mtime` (`engine/src/descriptor.rs:438-439 at H`). The descriptor's words are `size`, `mtime`, `footer-length` and `footer-hash` (`:488`).
  - The test follows the real interface (the seam rule), and K-O2's mutation still fails it (worker report, panic at line 1001).
  - The form's words do not support `mtime`, so this goes to the advisor. Either P3b's wire maps `mtime` to `modified_ns`, or F4 is corrected (class 3). It does not block P3a-2.
- **O3. Cancel just before the return.** `OpenFailure::Cancelled`'s doc says "before the reopen ended" (`mod.rs:496 at H`). A cancel after `open_under` returns gives `Opened`. Seeing this takes timing inside one call, so it does not block; it is named for the source comment.
- **O4. For P3b:**
  - The lock must not be freed while the open is still in the catalog (see question 3).
  - `Reopen::NotFound.file_name` is an `Option`.
  - `OpenFailure` carries paths (`FolderUnresolvable`, `PathNotUnicode`, and the `io::Error` sources). The wire mapping keeps §2.2's no-path rule.
  - A re-link overwrites `locations.json` without reading it. That is safe only after a `not_found` reply.
- **O5. A copy followed by `not_found`.** After the answer `copy`, a `not_found` reply leaves `project.spatial` already naming the new identity. The next call reads `locations.json` and `previous-lineage.jsonl` under the new identity, so it loses `file_name` and the previous lineage. This follows from item 5 (b)'s order. For P3b and P4.

## Answers

**1. The change against the form.** It conforms.
- **The cancel key.** `begin_open` and `open_under` (`kernel/src/skp.rs:1106-1141 at H`) are `open_dataset` split in sequence: the version check, the key, `begin`, then a guard. The order is main's, and the guard's lifetime is unchanged. `begin_open` registers the key before `project.spatial` is read (`mod.rs:622`). `live()` is checked at `:635`, `:667`, `:704` and `:718`, and the engine open takes the same token (`:730`).
- **Step 2.** It writes nothing (`:640-678`). `with_same`, `moved_to` and `to_bytes` are each called before the lock.
- **Step 3.** The lock is taken at `:680`, and for a copy it is the new identity's lock. The writes follow at `:689-695`.
- **Step 6.** The lineage is read before the engine open (`:697-704`).
- **The data step.** It goes through `check_inside` (`:825-841`). A refusal names the locator's path and never forwards `NotCanonical`'s `$` (`:547`).
- **The recorder.** `reopened` (`session_history.rs:387-396`) binds only when this recorder holds the project's record. The reopen is entered with its lock (`mod.rs:770-777`).
- **5 (g).** The arm is at `session_history.rs:357-377`.
- **N-10.** Applied at `dataset_ref.rs:590-594`.
- **Items built beyond the rows,** all disclosed: `PathNotUnicode`, the unknown-dataset arm (`mod.rs:742-746`), and `Option` for `file_name`.

**2. ADR-036 Amendment 3** (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:295-301 at H`).
- It is appended after Amendment 2. Lines 283-293 read the same as main's.
- The heading, the lead-in and items 1 and 2 match ADV-2026-11-19-04 item 4's fence and the 2026-10-23 draft's lines 360 and 376 by my reading. The reviewer recomputes the bytes.
- The lead-in's last sentence is true: see `adopt_project` at `session_history.rs:374-378`.
- Item 1 is true in both sub-cases. With steps, `copy_under`'s `create_dir` refuses (`:546`); without steps, the 5 (g) arm refuses. In both, `Projects::history` returns before the mark (`mod.rs:403-405`).
- Item 2 is true: see `moved_to` (`store.rs:386-392`).

**3. Can any path reach `create` for a project record folder that exists?** None that ordinary use reaches.
- **(a) A bind with no move, then the folder appears before the first step.** In one process this is excluded: the recorder's mutex and the holder lookup (`session_history.rs:310-317`) find any record that `copy_under` or `create` pushed. In two processes it is excluded because the identity lock is held for the open's whole life: it is taken at a first save or a reopen and freed only when `Projects` is dropped. Not reachable. This holds after P3b only if P3b frees the lock no earlier than the open leaves the catalog (O4).
- **(b) A failed `create` whose clean-up also fails.** If `write_record` fails and its `remove_dir_all` (`:486`) then fails too, the folder is left while the open stays bound. Each later step then reaches `create` and is refused. This needs another program's handle, or a permission change, in the new folder. It is not ordinary use, and the code is pre-existing.
- **(c) An identity collision** on 128 random bits. Not reachable.
- **(d) `end_session` in the middle of a run.** Its only caller is `RunEvent::Exit` (`frontends/shell/src-tauri/src/lib.rs:587-593 at H`). Not reachable.
- Nothing here needs to go to the advisor before the merge request.

**4. The two docs and the module paragraph.**
- Drafts 1 and 2 are below.
- The module doc's second paragraph (`mod.rs:23-27 at H`) is true clause by clause:
  - "Nothing in this module holds a handle in a project folder": `read_bounded` (`:891-897`) and `replace` hold only transient handles. The engine's open and its watch belong to the host.
  - "holds one on `open.lock` … for each identity it saved first or reopened": entries are pushed at `:349-355` and `:771-777`, and nothing removes one; only the two `saved.lock()` sites exist. For a copy, "reopened" reads as the identity the reopen is open under (`Opened::project`).
  - "The only files … `project.spatial` and the temporary file": the copy's write goes through `replace` (`:694`).

**5. The gates' brief items.**
- **0c539ed2's word.** See O2. The form does not support `mtime`; the producer does. This goes to the advisor.
- **The `pub` items** are exactly item 7 (a) and item 8's list: `open_project`, `Answer`, `Reopen`, `Opened` with its fields, `ViewState` and `OpenFailure` (`mod.rs:442-527`, `:614`). `begin_open`, `open_under`, `OpenGuard` and `reopened` are `pub(crate)`. Nothing else is exposed. Their round-8 exemption also needs D6.

**6. K-O19 under K-O18's mutation.**
- The failure does not meet the prediction. It fell at the assertion before the step.
- The mutation is evidence for something earlier: the open stayed unbound at the save, which is K-O18's claim. It is not evidence for option (i)'s outcome. See E1. This goes to the advisor.
- At H the assertion is at `kernel/tests/project_reopen.rs:1679`. Draft 8 gives the comment's words.

**7. The counts.** The tests run near three times their ceilings for these reasons, by reading:
- **The ceiling.** The 520 came from the step-2 read's estimate (Amendment 36 item 3), made before the rig's shape was known.
- **A real-shape rig.** `project_reopen.rs:501-817 at H`, about 315 lines: a host, a recorder, a fixture, an open and a real save for every case.
- **Doc comments.** A `RECORDED MUTATION` doc on each of the 31 tests, about 190 lines.
- **rustfmt's vertical layout** of struct literals and matches, for example `:1001-1007`, `:1282-1288` and `:1465-1468`.
- **Rows with several cases.** K-O6 has 6, K-O14 3, K-O10 (b) 3, and K-R1, K-R4, K-O1 (b) and K-O10 2 each.
- **Child processes with bounded waits.** K-O4 at `:1035-1110`.
- **`project_lock_crash.rs`** is a separate binary, so K-O5 builds its host, workspace, `Space` and `View` inline. About 105 of its 151 lines are set-up (`:104-210 at H`).

Items beyond the rows, all small:
- K-O12's 4 MiB case (`:1411`, with its doc at `:1402-1403`; disclosed);
- K-O3's second case, with no location recorded (`:1027-1032`);
- K-O5's "refused while the child lives" assertion (`project_lock_crash.rs:232-237`), a control.

Every other test and helper serves a row: `link_to`, `readable`, `folders_of`, `long_lineage`, `Recording`, `later_by_60_s`, `left_by_another_run`, `own_records` and `withheld_unwritable`.

## Drafts

None of these is the human's wording. Comment lines only. Each Old block is byte-copied from my Read at H.

**1. `kernel/src/project/mod.rs:131-132 at H`**

Old:
```
    /// The identity's open lock, taken by the first save. It is held for as long as this entry is,
    /// which is until [`Projects`] is dropped.
```
New:
```
    /// The identity's open lock, taken by the first save or by the reopen
    /// ([`Projects::open_project`]) that made this entry. It is held for as long as this entry is,
    /// which is until [`Projects`] is dropped.
```
Clause check:
- "taken by the first save": `:335-336` and the push at `:347-355`, made only when `first`.
- "or by the reopen … that made this entry": `:680` and the push at `:771-777`.
- "held … until dropped": no site removes an entry.

**2. `kernel/src/project/mod.rs:232-234 at H`**

Old:
```
    /// - **A later save** keeps the identity and goes to the folder the first one used; it ignores
    ///   `folder`. It refuses to replace a project file that records a kept lineage, and one the
    ///   reader refuses, since either could hold what a rewrite would lose.
```
New:
```
    /// - **A later save**, of an open this [`Projects`] saved first or reopened
    ///   ([`Projects::open_project`]), keeps the identity and goes to the folder the first save
    ///   used or the reopen opened from; it ignores `folder`. It refuses to replace a project file
    ///   that records a kept lineage, and one the reader refuses, since either could hold what a
    ///   rewrite would lose.
```
Clause check:
- "an open this Projects saved first or reopened": the lookup by catalog name at `:256` over the entries from `:349` and `:771`.
- "keeps the identity": `:257-259`.
- "the folder the first save used or the reopen opened from": `folder` at `:352` and `:774`, used at `:270`.
- "ignores `folder`": the `Some(known)` arm.
- The rest is unchanged.

**3. `kernel/src/project/mod.rs:244-247 at H`**

Old:
```
    ///   mark is written in the project's record when the steps reach the workspace. A second open
    ///   of the same file is another open: its steps never go to the first open's record, and its
    ///   own first save binds it to a project of its own. A history that cannot take the moves does
    ///   not undo the save; the result says so.
```
New:
```
    ///   mark is written in the project's record when the steps reach the workspace. A second open
    ///   of the same file through `open_dataset` is another open: its steps never go to the first
    ///   open's record, and its own first save binds it to a project of its own. A reopen
    ///   ([`Projects::open_project`]) in the run that holds the project's record continues that
    ///   record. A history that cannot take the moves does not undo the save; the result says so.
```
Clause check:
- "a second open through `open_dataset` is another open with its own record": a minted handle gets a new unbound `Open` (`session_history.rs:171-184`, `:143-149`).
- "its own first save … a project of its own": `mint_identity` at `mod.rs:264`.
- "a reopen … continues that record": `reopened` at `session_history.rs:393-395`, then the lookup at `:310-312`. Proven by K-O22.

**4. `kernel/src/project/mod.rs:116 at H`**

Old:
```
/// Saves projects, and remembers which project each opened dataset was saved to in this run.
```
New:
```
/// Saves and reopens projects, and remembers which project each open of a dataset was saved to or
/// reopened as in this run.
```
Clause check: the entries are pushed by `save` (`:349`) and by `open_project` (`:771`).

**5. `kernel/src/session_history.rs:123-124 at H`**

Old:
```
/// What holds a record: one open (by its catalog name) until a save binds that open to a project,
/// then that project. The name is held in memory only and is never written to disk.
```
New:
```
/// What holds a record: one open (by its catalog name) until a save, or a reopen in the run that
/// holds the project's record, binds that open to a project, then that project. The name is held
/// in memory only and is never written to disk.
```
Clause check:
- "a save … binds": `:378`.
- "a reopen in the run that holds the project's record": `:390`, `:393-395`.
- "then that project": `Open::holder` (`:144-149`).

**6. `kernel/src/session_history.rs:138 at H`**

Old:
```
    /// The project a save has bound this open to ([`StepRecorder::adopt_project`]).
```
New:
```
    /// The project this open is bound to: by a save ([`StepRecorder::adopt_project`]), or by a
    /// reopen in the run that holds the project's record ([`StepRecorder::reopened`]).
```
Clause check: the only writes of `bound` are at `:378` and `:394`.

**7. `kernel/src/session_history.rs:152-154 at H`**

Old:
```
/// One record: the history of the steps of one holder, from the holder's first step. An open has a
/// record of its own until a save binds it to a project, and from then on its steps go to the
/// project's record. A second open of the same file is another open and has its own record.
```
New:
```
/// One record: the history of the steps of one holder, from the holder's first step. An open has a
/// record of its own until a save binds it to a project, and from then on its steps go to the
/// project's record. A reopen in the run that holds the project's record is bound at the
/// reopen and makes no record of its own; any other open of the same file is another open and
/// has its own record.
```
Clause check:
- "bound at the reopen": `:393-395`.
- "makes no record of its own": the holder's record is found at `:310-312`, so `create` is not called.
- "any other open … its own record": an unbound holder is `Open` (`:147`), and `create` names its folder `unsaved-` (`:477`).

**8. `kernel/tests/project_reopen.rs:1666-1667 at H`**

Old:
```
/// Seen failing at kernel/tests/project_reopen.rs:1673: assertion failed:
/// withheld_unwritable(&saved.expect("saved").history_mark).
```
New:
```
/// Seen failing at the `assert!` right after the save, before the step:
/// `withheld_unwritable(&saved.expect("saved").history_mark)`.
```
Clause check: the save is at `:1678`, the assertion at `:1679` and the step at `:1680`, all at H. The expression is taken from the worker's report of the panic. If E1 (a) is taken, this comment changes again in that commit.

Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
