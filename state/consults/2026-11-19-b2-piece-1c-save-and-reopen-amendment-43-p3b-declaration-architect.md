*Filed by the custodian: the architect's hand-back (claude-opus-5-5), 48105 bytes, sha256 b854d12373888f8dfd703c1a33552af18edcb8c715266b86a7130ec228d87502, below the rule with one final newline added; calls Read 76, Grep 67, Glob 5, one errored (a Read of the form past the tool's size limit), from 2026-11-19T13:27:04Z to 2026-11-19T13:48:07Z. A draft, read only, at main 203ceef1; nothing in it is ruled by its filing, and the advisor rules its packet, P-1 to P-12, before P3b's code. The custodian checked its sums: item 2's table (285, 1,657 and 1,942), item 3's ceilings (315 and 1,755) and item 4's rows add up; item 4's 6,021 is the three named groups' 4,079 plus the whole of P3b's 1,942. Its For the custodian section's first point is the custodian's own error: the brief asked for one worker-high line for the whole of P3b, where ADV-2026-11-18-02 item 2 (a) puts P3b's wire types, fixtures and literal changes outside worker-high work except the part the form marks.*

---

**Verdict: pass with notes.** This is a drafting consult, so nothing here is a gate verdict. The notes are the packet items in section 2. Reviewed: main @ 203ceef1beae60acbd9590060bba7bd0cb0fc2fc.

## 1. The amendment

````markdown
## Amendment 43 — the reopen's P3b, the wire (`skp/0.14`) and the binding, declared before its code as two parts, P3b-1 (the lock's release, two lineage facts, a later save's identity check) and P3b-2 (`open_project` on the wire): basis, size and split, ceilings, the step's totals, the wire, tests, mutations, producers, regions, stops, gates and records; files outside §2.11's and §4's lists (class 9)

*Drafted by the architect, read only, at main `203ceef1beae60acbd9590060bba7bd0cb0fc2fc`, and appended by the custodian's script. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is the architect's recommendation, it says so. Rulings are cited by id and item; this form by section, amendment and item; code by path and symbol at that commit. Every figure is an estimate from what is known now, and shows its working.*

1. **Basis.**
   - P3b is the second part of ADV-2026-11-16-10 R1 (a). It covers the command that reaches `Projects::open_project` (`kernel/src/project/mod.rs`), its replies, codes, fixtures and literal, and the shell host's binding. It is full class, both gates (ADV-2026-11-16-06 item 2 (a): the wire, a lock, a path check, seams, over 260 lines).
   - Its rules: §2.2, under OPEN-3 (A), so that P3b alone carries `skp/0.14`; §2.4; §2.7; Amendment 1 item 5 (V3, M1, M2); Amendment 36 items 5, 8, 9 and 16; R2 (a) to (d).
   - It takes these rulings, met by item 19:
     - ADV-2026-11-19-04 item 5 (P-6 (i)) and item 6 (a) to (d);
     - ADV-2026-11-19-07 item 6;
     - ADV-2026-11-19-15 item 4;
     - ADV-2026-11-19-19 items 2 and 3;
     - ADV-2026-11-19-21 items 1 and 3.
   - It also takes Amendment 37 item 9 note 5, Amendment 38 item 13, Amendment 41 item 9 and Amendment 42 items 8 and 9.
   - **Not P3b's:**
     - every shell item, which is P4's: `openProject` in `frontends/shell/src/skp/client.ts`, the question and re-link UI, the owner's strings, E-REOPEN, E-CHANGED, E-SECOND and E-CRASH-UNLOCK;
     - KNOWN-LIMITATIONS item 62 (P5; ADV-2026-11-19-21 item 2);
     - the record's own `locations.json` writer (step 3).

2. **Size, from what is known now, and the split.**
   - This size is set from what is known now (ADV-2026-11-19-21 item 3), not from the 2026-11-16 read, which gave P3b about 810 lines.
   - **The working.** The rates come from step 1's `save_project` as it stands on main:
     - `protocol/skp/SKP-V0.md` §11 is 55 lines;
     - the `save_project` region of `protocol/skp/src/v0/commands.rs`, with its `ProjectRelativeLocator` test, is about 145;
     - the five save constructors in `protocol/skp/src/v0/error.rs` are 50;
     - `save_project_requests_and_response_round_trip_and_its_codes_are_what_the_constructors_build` in `protocol/skp/tests/fixtures.rs` is 92;
     - step 1's protocol product ended at 478 (Amendment 23 item 3).
   - **The literal, by grep at main.** The current literal sits on 90 lines in 20 files. Counted in both columns, that is 180.
     - The 11 request fixtures under `protocol/skp/tests/data/`: 11 lines.
     - The three conformance fixture files: 61 lines. `refusals-any-layer.json`'s line for an unsupported future version also moves from `skp/0.14` to `skp/0.15`: 1 line.
     - `protocol/skp/tests/conformance/README.md`: 3 lines.
     - `protocol/skp/tests/fixtures.rs`: 4 lines (the save request's literal, and the version test's name, assert and doc).
     - The shell: 10 lines. That is `SKP_VERSION` in `frontends/shell/src/skp/types.ts` (1), `skp/client.test.ts` (4), `admission/admitDataset.test.ts` (4) and `project/saveProject.test.ts` (1).
     - The worker recounts these sites at the part's base.
   - **The estimate, both columns:**

     | Group | P3b-1 | P3b-2 | P3b |
     |---|---|---|---|
     | protocol | 0 | ~400 (commands.rs ~165; error.rs ~78; mod.rs ~9; SKP-V0.md ~150) | ~400 |
     | fixtures | 0 | ~343 (reply fixtures ~110; error fixtures ~50; fixtures.rs ~150; conformance rows, `main.rs`'s two mappings and README ~33) | ~343 |
     | literal | 0 | ~180, 20 files | ~180 |
     | kernel product | ~72 (session_history.rs ~25; project/mod.rs ~47) | ~220 (project/mod.rs ~214; project/store.rs ~6) | ~292 |
     | kernel tests | ~201 (project_reopen.rs ~110; project_save.rs ~85; no_generation_in_persisted_artifacts.rs ~6) | ~480 (project_reopen_skp.rs, new) | ~681 |
     | src-tauri | ~12 | ~28 | ~40 |
     | records (ADR-036) | 0 | ~6 | ~6 |
     | **Total** | **~285, 6 files** | **~1,657, about 42 files** | **~1,942** |

   - **The split** (the architect's recommendation; packet P-1).
     - P3b-1 changes shipped paths and the reader. It holds the lock's release at a close (item 6), with its call in the shipped `close_dataset` binding; a later save's identity check (O3); and the reader's two facts (P-5 (a), P-9 (c) (ii)).
     - P3b-2 is the wire and the reopen's binding.
     - P3b-2 is cut from main after P3b-1 merges, because both edit `kernel/src/project/mod.rs` and `frontends/shell/src-tauri/src/commands.rs`.
   - **P3b-2 stays over 800 lines**, for three reasons.
     - (a) OPEN-3 (A) gives the step one version. The literal, the wire types, their fixtures and the command that serves them must land together. A part holding the types without the command would land wire types that no product code calls (R2 (d)). A part holding the command without the types cannot compile.
     - (b) About 180 of its lines are the literal, and about 343 are fixture data and the tests that pin the types.
     - (c) Its kernel product is one map in each direction over the types P3a-2 pre-committed. Cutting it would land arms that §2.2 does not define.

3. **Ceilings, both numstat columns, by §2.11's groups** (for the advisor to rule, ADV-2026-11-19-21 item 3). Neither §2.11 nor §7 is edited. An overrun is class 8 in the part's closing amendment. A worker that finds a ceiling too small finishes, reports the count and says so (ADV-2026-11-19-12 item 6).

   | Part | Group | Ceiling |
   |---|---|---|
   | P3b-1 | kernel product | 80 |
   | P3b-1 | kernel tests | 220 |
   | P3b-1 | src-tauri | 15 |
   | P3b-2 | protocol | 420 |
   | P3b-2 | fixtures | 360 |
   | P3b-2 | literal (≤ 22 files) | 190 |
   | P3b-2 | kernel product | 240 |
   | P3b-2 | kernel tests | 500 |
   | P3b-2 | src-tauri | 35 |
   | P3b-2 | records (ADR-036) | 10 |

   - **Totals:** P3b-1 315 lines in 6 files; P3b-2 1,755 lines in about 42 files.
   - The reviewer recounts with §2.11's command, its excludes set to this form's present path (`governance/forms/kernel/...`).

4. **The step's totals after P3b.** The step's ceilings are not touched by this amendment.

   | Group | Used, by Amendment 42 item 10 | P3b | After P3b | Ceiling |
   |---|---|---|---|---|
   | kernel product | 1,453 | ~292 | ~1,745 (~345 over) | 1,400 |
   | kernel tests | 2,621 | ~681 | ~3,302 (~2,002 over) | 1,300 |
   | protocol | 5 | ~400 | ~405 (~85 over) | 320 |
   | fixtures | not given | ~343 | ~343 + the earlier use (~83 over) | 260 |
   | literal | not given | ~180 | ~180 + the earlier use (~50 over) | 130 |
   | src-tauri | not given | ~40 | ~40 + the earlier use | 100 |
   | records | not given | ~6 | ~6 + the earlier use | 140 |

   - Amendment 42 item 10 gives only the three groups it names. No part so far touched `protocol/` beyond those 5 lines (Amendment 36 item 11). The reviewer gives the other groups by §2.11's command at P3b-1's base.
   - **The forecast** (ADV-2026-11-19-04 item 7): the three named groups stand at 4,079 lines. With P3b they come to about 6,021, against the step's 5,170, before P4, P5 and the groups not yet given.
   - **Files:** P3b-2 alone is about 42 files, against the step's 75.

5. **The wire, `skp/0.14`** (P3b-2). Each shape is closed and `deny_unknown_fields` in both directions (SKP-V0.md §4 item 13). Each `Option` key must be present, as `SaveProjectRequest` already requires (`key_present`).
   - **(a) The request.** `OpenProjectRequest {skp, folder, cancel_key, answer, relink}`, as §2.2 gives it:
     - `folder` is an absolute UTF-8 path;
     - `answer` is `null`, `copy` or `same`;
     - `relink` is `null` or an absolute UTF-8 path.
   - **(b) The reply.** `OpenProjectResponse` is externally tagged, with one of three members, as §2.2 writes them (the architect's recommendation; packet P-4 (c)):
     - `opened` holds `{project, dataset, session, workspace, view, check, lineage}`:
       - `project` is the identity URI; after the answer `copy` it is the new one.
       - `dataset` is a `DatasetHandle`, and `session` a `SessionRef`, as `OpenDatasetResponse` carries them.
       - `workspace` is step 1's `ProjectWorkspace`, built from the project file's `Workspace` (filter, clauses, style document and view centre and zoom as `HexF64`).
       - `view` is `{state: applies}` or `{state: saved-in-another-space, basis}`. This is V3. `basis` is `view_state`'s text, which names identifiers, provenances and definition hashes (`kernel/src/project/file.rs` `Space`) and no path. §2.2 gains this member (class 1).
       - `check` is `{observed: […], admission: […]}`, as §2.2 gives it.
         - `observed` holds words from `RefCheck::Differs.observed` (`kernel/src/dataset_ref.rs`). The vocabulary is packet P-3.
         - `admission` holds `crs` and/or `identity`.
         - Both lists are empty exactly when the kernel's result is `RefCheck::NoChangeDetected`, because `DatasetRef::check` gives `Differs` only when one list is not empty.
         - Names only cross, as `RefCheck` holds them (P-4 (b)). No recorded or present value crosses.
       - `lineage` is `{folder_file, previous_file}`, two closed members that mirror `FolderLineage` and `PreviousLineage` (`kernel/src/session_history.rs`; P-4 (a) (i)).
         - `folder_file` is one of: `absent`, `not-read`, `recorded`, `recorded-with-lines-after`, `not-the-recorded-one`, or `{refused: …}`.
         - `previous_file` is `null`, or one of: `absent`, `used`, `not-the-recorded-one`, or `{refused: …}`.
         - `refused` is one of:
           - `{reason: over-bound, line: n|null, limit}`;
           - `{reason: damaged, line}`;
           - `{reason: unreadable}`;
           - `{reason: through-link}`.
         - Line numbers cross, and no rule text crosses (P-5 (b)).
         - When two lines break rules, the first in file order is named (P-5 (c); L6).
         - The lineage's lines (`LineageRead::lineage`) do not cross. A lineage file may be 32 MiB (`MAX_LINEAGE_FILE_BYTES`), and nothing at P3b consumes the lines.
     - `question` holds `{kind: copy-or-same}`.
     - `not_found` holds `{file_name: string|null}`. `null` means no location is recorded for the dataset (`Reopen::NotFound`).
   - **(c) The codes.** `Projects::open_project_command` is a working name. It is the SKP entry, built as `Projects::save_project` is: the version check, then `open_project`, then an exhaustive map from `OpenFailure` to codes with no wildcard arm.
     - Each new message is the text of the matching arm of `OpenFailure`'s `Display`, as merged at P3a-2, built from the code's fields.
     - Each row is the architect's recommendation unless a ruling is named.

     | `OpenFailure` | Code | Fields |
     |---|---|---|
     | `Open(e)` | passes through: `skp.version_unsupported` and `skp.malformed_cancel_key`; `skp.cancel_key_in_use`; `engine.*`; `skp.unknown_dataset` | as the host built them |
     | `Cancelled` | `engine.cancelled`, through `crate::skp::error_of(&EngineError::Cancelled)`: the same code and text a cancelled `open_dataset` gives | none |
     | `ProjectFileUnreadable` | `skp.project_file_unreadable`, new (packet P-7) | `detail` |
     | `FileRefused` | `skp.project_file_refused` (packet P-9) | `path`, `rule` |
     | `MachineRecordRefused` | `skp.project_machine_record_refused` (M1) | `file`, `rule` |
     | `KnownFoldersFull` | `skp.project_known_folders_full` (M2) | `project`, `count` |
     | `OpenElsewhere` | `skp.project_open_elsewhere` | `project` |
     | `MachineStore` | `skp.project_file_unwritable` | `detail` (`what` and the error) |
     | `FolderUnresolvable` | `skp.project_target_unresolvable` (P-6 (i)) | `folder`, the request's string |
     | `TargetRefused`, `Unresolvable` | `skp.project_target_unresolvable` (P-6 (i)) | `locator`, `segment` |
     | `TargetRefused`, `ThroughLink` | `skp.project_target_through_link` | `locator`, `segment` |
     | `TargetRefused`, `NotADirectory` or `NotARegularFile` | one code with a closed detail (P-4 (c) (i)): working name `skp.project_target_wrong_kind` | `locator`, `segment`, `expected`: `folder` or `file` |
     | `TargetRefused`, `NotCanonical`; `TargetRefused`, `FolderUnresolvable` | unreachable (Amendment 36 item 5 (e); `data_at` maps the second to `OpenFailure::FolderUnresolvable`) | the arm names `locator` only |
     | `ProjectFileUnwritable` | `skp.project_file_unwritable` | `detail` |
     | `PathNotUnicode` | `skp.project_target_unresolvable` (packet P-12) | `detail`, no path |

     - `project_target_outside_folder` is withdrawn (P-4 (d)). `resolver::check_inside` walks from the folder one segment at a time and refuses every link. The `at` it walks is canonical, so it holds no `..` (`DatasetRef::parse`, `in_canonical_form`). A walk of that kind cannot leave the folder, and K-R1 and K-R2 show the link and junction arms.
     - `skp.cancel_key_in_use`'s doc widens to name the reopen. Its message is packet P-10.
     - `skp.project_file_refused`'s doc widens to the reopen's read. So does `engine.cancelled`'s raising site in SKP-V0.md.
   - **(d) The no-path rule.**
     - No reply carries a path. `not_found` carries the last name of the missing file, or `null`.
     - A refusal may name these and nothing else:
       - the request's own `folder` or `relink`, as sent;
       - a locator's JSON path and its segment, as the project file spells it;
       - a machine-store file by its fixed name;
       - an identity.
     - A refusal never names the data's machine-recorded path, a machine-store absolute path, or the folder's canonical form.
     - What that means for each variant:
       - `FolderUnresolvable(PathBuf)` sends the request's `folder` string, not the variant's path.
       - `PathNotUnicode(PathBuf)` sends no path.
       - The `io::Error` sources send their `Display`, which std writes from the operating system's error. W-4 shows this for each case it builds.
       - `store`'s rule texts must name no path read from a machine-store file. `stored_path`'s refusal arm prints the path today (`kernel/src/project/store.rs`), so the A1 words of item 5 (g) are bound by this rule.
     - **One exception, named** (the architect's recommendation; packet P-11). An engine refusal through `Open(e)` keeps the engine's own message, unedited (SKP-V0.md §5), and that message may name the path the engine was given.
   - **(e) Control plane only.**
     - `open_project` is one control-plane call per reopen. It opens no stream and mints no ticket, and `protocol/data-plane/` has an empty diff.
     - Its reply is bounded. The workspace is bounded by the project file's 1,048,576-byte ceiling, and `basis` holds identifiers and hashes. No lineage line crosses.
     - No JSON runs on a data hot path (docs/01; docs/10). No performance claim is made (docs/08).
     - It runs on `spawn_blocking` (§2.7). It is cancellable through `cancel` with its key, as `open_dataset` is (Amendment 36 item 5 (a)).
   - **(f) Wire bytes that change, each pinned.**
     - `SKP_VERSION` and the shell's `SKP_VERSION` become `skp/0.14`. The pins are F-W3, `every_request_fixture_carries_the_current_skp_version` (unedited), the conformance harness, and the shell's `client.test.ts` at its literal.
     - The conformance fixture for an unsupported future version is renumbered to `skp/0.15`, pinned by the conformance harness.
     - The new types and codes are pinned by F-W1, F-W2 and W-1 to W-6.
     - `v0-error-project_file_refused.json`'s message changes only if the advisor's A1 (i) words change the message's head. It is then pinned by step 1's fixture test, whose code stays unedited. The data file changes as class 1, disclosed.
     - The six existing commands' shapes do not change, and neither does `save_project`'s, apart from the literal. The one exception is packet P-8, if ruled.
   - **(g) The three A1 places** (P-8, ADV-2026-11-19-04 item 6 (c)). Each is a place for words the advisor rules, landing beside P3b-2's codes. None is drafted here.
     - The architect's A1 (`state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1b-gate-architect.md`): the noun in the over-ceiling arm of `stored_path` (`kernel/src/project/store.rs`). It reaches the wire as `rule` in `project_machine_record_refused` and in `project_file_refused`.
     - The reviewer's A1 (i) (`state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1b-gate-reviewer.md`): the head of `SkpError::project_file_refused`'s message (`protocol/skp/src/v0/error.rs`).
     - The reviewer's A1 (ii), same report: `stored_path`'s refusal arm, split into not absolute and not Unicode.

6. **The lock's release** (P3b-1; P-9 (a) (i) as ruled: the lock lives in `Projects`'s saved entry). This is the architect's recommendation, and it is contingent on packet P-2.
   - **The call.** `pub fn Projects::release_ended()` drops the `SavedProject` entry, and with it `_lock`, of every open that the catalog no longer holds, or that `require_live` (`kernel/src/skp.rs`) finds ended.
   - **Its callers:**
     - the binding's `close_dataset`, after `SkpHost::close_dataset` has returned. This is the product caller, so the lock is never freed while the open is in the catalog and live (O4);
     - `Projects::open_project`, before step 3's `ProjectLock::try_lock`.
   - **The session-end forwarder** in `frontends/shell/src-tauri/src/lib.rs` is not changed. An open whose session ended can no longer write:
     - `record_step` and `save_project` refuse it through `require_live`;
     - its lock is freed at this process's next close or reopen;
     - a lost session-end event, which is allowed by the event's own design, frees nothing early.
   - **Named for the source comment.** A save or step that passed `require_live` before the end lands can finish its writes after a reopen in another process has taken the lock. This needs timing inside one request.
   - **Doc words**, which are not the human's wording and which the worker applies:
     - The module doc of `kernel/src/project/mod.rs`, its clause ending in until it is dropped, becomes: until that open is closed, or, after its session ends, until this process's next reopen or close ([`Projects::release_ended`]); or until [`Projects`] is dropped.
     - The doc of `SavedProject::_lock` becomes: It is held for as long as this entry is: until [`Projects::release_ended`] finds its open closed or its session ended, or until [`Projects`] is dropped.
     - The doc of `Projects::save`, its clause keeping the lock until `Projects` is dropped, becomes: keeps the lock in [`Projects`] until [`Projects::release_ended`] releases it; one refused after the lock frees it.
     - The doc of the `save_project` binding (`frontends/shell/src-tauri/src/commands.rs`), its sentence on `close_dataset` (D4), becomes: `close_dataset` frees the open's project lock: after the host has closed the dataset, it calls [`Projects::release_ended`].
   - **Clause check against the design:**
     - the binding calls the release after the host's close;
     - `open_project` calls it before the lock;
     - `require_live` refuses an ended generation;
     - so each clause states what the code does.

7. **P3b-1.**
   - **Where it is built:** branch `cut/b2-piece-1c-p3b-1`, worktree `C:/dev/wt/1c-p3b-1`, build folder `D:/wt-targets/1c-p3b-1`. It is cut from main after this amendment and the advisor's ruling.
   - **(a) Files.**
     - `kernel/src/session_history.rs` (class 9):
       - `LineageRefused::Unreadable { reason }` replaces `Damaged { line: 0 }` in `lineage_file`'s `unreadable` (P-5 (a) (ii); class 1 on the pre-committed type). Its `Display` keeps the error text inside the kernel.
       - `LineageRefused::ThroughLink`: `lineage_file` refuses a link at the file's name before `File::open`, with the same link test as `resolver::check_inside`'s walk (P-9 (c) (ii)).
     - `kernel/src/project/mod.rs`:
       - item 6;
       - O3's check. A later save whose `project.spatial` names another identity is refused as `SaveFailure::FolderHoldsProject` with the entry's folder, which reaches the wire as `skp.project_folder_holds_project`. This is contingent on packet P-5 (b).
       - item 6's doc words.
     - `kernel/tests/project_reopen.rs` and `kernel/tests/project_save.rs` (class 9): the rows of (b), appended.
     - `kernel/tests/no_generation_in_persisted_artifacts.rs` (class 9; Amendment 37 item 9 note 5). Module doc only.
       - Its sentence naming the machine store's two files as named below and not scanned gains: and its `open.lock`, which `store::ProjectLock::try_lock` creates empty and never writes.
       - Its paragraph on the three writers outside the families keeps three, and gains one sentence: `open.lock` (`kernel/src/project/store.rs`, `ProjectLock::try_lock`) is created empty and never written.
     - `frontends/shell/src-tauri/src/commands.rs`: `close_dataset` takes the `Option<Arc<Projects>>` state and calls the release after the host's close; plus the D4 doc.
   - **(b) Tests and mutations.** The round-25 rule applies: apply the mutation, run the named test, record its failure by name with the commit, revert. A `verify-mutation` run is not called an observation. Each test fails at its base by a missing symbol, except K-O17 (b) and K-O26, which fail by assertion: today the lock is held until `Projects` drops.

     | Id | Test | Asserts | Mutation, and what it must turn red |
     |---|---|---|---|
     | K-O26 | `a_reopen_after_a_session_end_in_the_same_process_takes_the_lock` (pre-committed, Amendment 36 item 8) | a saved open, and a reopen of its folder refused as `OpenElsewhere` (the control); after `SkpHost::end_generation` on the open, the same reopen gives `Opened` | the release not run in `open_project`: red at `Opened` |
     | K-O17 (b) | `a_project_saved_first_in_this_process_is_refused_to_another_process_until_its_dataset_closes` (pre-committed; `project_save.rs`, K-O17's child pattern) | the child gets `Held`; after `SkpHost::close_dataset` and `Projects::release_ended`, in the binding's order, the child takes the lock | `release_ended` keeps entries the catalog no longer holds: red at the child's second try |
     | K-O4 (unedited) | `a_second_open_of_an_open_identity_is_refused_in_this_process_and_another` | as merged | `release_ended` drops every entry: red at the in-process refusal |
     | K-O27 | `a_later_save_into_a_folder_whose_project_file_names_another_project_is_refused_and_the_file_is_kept` (O3; contingent on P-5 (b)) | a first save into A; A's file replaced by another identity's real file; the open's next save is refused as `project_folder_holds_project`; A's bytes unchanged | the identity comparison removed: red at the bytes |
     | L8 | `an_unreadable_lineage_file_is_named_unreadable` (a folder at `.spatial/lineage.jsonl`, a kept member) | `Refused(Unreadable)`; `lineage` is `None` | `unreadable` back to `Damaged { line: 0 }`: red |
     | L9 | `a_link_at_the_lineage_name_beside_a_kept_member_is_refused_and_never_followed` (off Windows a symlink to a matching file; on Windows a junction) | `Refused(ThroughLink)`; `lineage` is `None` | the link test removed: red off Windows at `Recorded`, on Windows at `Unreadable` |

   - **(c)** P3b-1 adds one `pub` call (item 6) and two variants (item 12).

8. **P3b-2.**
   - **Where it is built:** branch `cut/b2-piece-1c-p3b-2`, worktree `C:/dev/wt/1c-p3b-2`, build folder `D:/wt-targets/1c-p3b-2`. It is cut from main after P3b-1 merges.
   - **(a) Files.**
     - Protocol:
       - `protocol/skp/src/v0/{commands,error,mod}.rs`: item 5's types, constructors and literal, and `mod.rs`'s `skp/0.14` paragraph;
       - `protocol/skp/SKP-V0.md`: a §12 `open_project`, laid out as §11 is; §8's `skp/0.14` entry; §11.3 and §11.4 for O3 (if P-5 (b)) and for P-8 (if ruled).
     - Fixtures:
       - `protocol/skp/tests/data/`: the reply fixtures `v0-open_project-response-opened`, `v0-open_project-opened-lineage` (pre-committed), `-question`, `-not_found` and `-not_found-unrecorded`; and the new error fixtures.
       - The requests are held in `fixtures.rs`, as step 1's are, because the shell's `renderTruth.test.ts` reads every request fixture under `tests/data/`.
       - `protocol/skp/tests/fixtures.rs`.
       - The conformance rows, `main.rs`'s two mappings and one README paragraph.
     - The literal sites of item 2.
     - `kernel/src/project/mod.rs`:
       - `Projects::open_project_command`, the reply's builders and item 5 (c)'s map;
       - O5's arm (contingent on packet P-6);
       - the doc words of item 9 (a) and (b).
     - `kernel/src/project/store.rs`: item 5 (g)'s places.
     - `kernel/tests/project_reopen_skp.rs`, new (class 9). Its rig is `project_save_skp.rs`'s: a real `SkpHost`, `StepRecorder` and `Projects`, with requests decoded from wire JSON.
     - `frontends/shell/src-tauri/src/commands.rs`: `open_project` on `spawn_blocking`. On `opened` it starts the pool poll under `open_dataset`'s own `cfg` (O-13). The module doc names it.
     - `frontends/shell/src-tauri/src/lib.rs`: one handler entry.
     - `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`: item 11.
   - **(b) Tests and mutations** (round-25 rule as in item 7 (b)). Each test fails at its base by a missing symbol, except F-W3, which fails by assertion.

     | Id | Test | Asserts | Mutation, and what it must turn red |
     |---|---|---|---|
     | W-1 | `a_saved_project_reopens_through_the_command_from_its_wire_request` (the seam, from the real shape) | open, record a step, save (one clause disabled), close, then `open_project` from wire JSON; the reply decoded: `opened`, the same project URI, the workspace member for member, `view` `applies`, `check` both empty, `folder_file` `absent`, `previous_file` `null`; a `record_step` on the new handle carries the project file's dataset URI (item 11) | (a) the reply's clauses built from the enabled ones only: red at `workspace`; (b) `StepRecorder::reopened` not called: red at the step's `data.dataset` |
     | W-2 | `a_question_reply_and_its_answered_second_call_through_the_command` | `question` with `copy-or-same`; `folders.json` byte for byte unchanged; the second call with `same` gives `opened` | `answer` decoded as `null`: red at the second call |
     | W-3 | `a_not_found_reply_names_the_file_and_a_relink_through_the_command_opens_it` | `not_found` with the file's last name, holding no separator; `null` with no `locations.json`; the call with `relink` gives `opened` | `file_name` sent as the recorded path: red |
     | W-4 | `each_reopen_refusal_reaches_the_wire_as_its_code_with_no_path_it_was_not_given` (cases: `FileRefused`; an unreadable `project.spatial`; a refused `folders.json`; `OpenElsewhere`; `ThroughLink`; a missing segment; a file as an intermediate; a relative `relink`; `KnownFoldersFull`) | each case's code and fields; every serialized reply and refusal holds neither the machine root nor the data's machine-recorded path | (a) `ThroughLink` mapped to `project_target_unresolvable`: red at its code; (b) `TargetRefused` sends the checked absolute path: red at the scan |
     | W-5 | `a_refused_relink_through_the_command_leaves_no_catalog_entry_and_open_lock_free` (ADV-2026-11-19-19 item 2) | (a) a relative `relink`; (b) a `relink` whose `locations.json` write fails after the engine's open (a folder at that name in the identity's machine folder, on every platform); each refused by its code, the catalog's names unchanged, the lock takeable | (a) the re-link check moved after the engine's open, with no close: red at the catalog; (b) `close` not called on the write failure: red at the catalog |
     | W-6 | `a_copy_answer_whose_data_is_not_found_writes_nothing_and_its_second_call_keeps_the_file_name_and_the_previous_lineage` (O5; contingent on P-6) | the answer `copy` with the data moved gives `not_found` with the name; `project.spatial` unchanged; no new identity folder; the second call (`copy` and `relink`) gives `opened` with `previous_file` `used` | the copy's lookup after the lock (main's order): red at `project.spatial` |
     | F-W1 | `open_project_requests_and_replies_round_trip_and_its_codes_are_what_the_constructors_build` (`fixtures.rs`) | the three requests; each reply fixture, `v0-open_project-opened-lineage` among them; each new error fixture equal to its constructor | `rename = "not-found"` on `not_found`: red at that fixture |
     | F-W2 | `the_open_project_closed_sets_refuse_any_other_value` | an unknown `answer`, lineage fact, `observed` word or `admission` word, and an absent `answer` or `relink` key, are each refused at deserialize | `#[serde(other)]` on the folder-lineage enum: red |
     | F-W3 | `skp_version_is_skp_0_14` (the version test's literal edit, which §4 allows) | the literal | the literal back to `skp/0.13`: red |

   - **Not covered through the command:** `Cancelled`. K-O13 is its rig, and its map arm is one line.

9. **ADV-2026-11-19-21 item 1, by item.**
   - **(a)**
     - `folders.json` is read before the lock. This is not covered: the case needs two processes inside one call. The doc of `open_project` names it for the source comment.
     - A copy whose `replace` fails leaves the new identity's folder with `folders.json` and `open.lock`. This is not covered: nothing reads that identity. The doc names it, and P5 reads it against item 62 (ADV-2026-11-19-21 item 2).
     - Step 4's doc becomes: of the identity `project.spatial` named when step 1 read it, which after the answer `copy` is the original identity, not the new one. Clause check: `dir` is `record_dir` of `project`, which is cloned before the copy's reassignment.
   - **(b)** `OpenFailure::Cancelled`'s doc becomes: The cancel key was cancelled before the engine's open returned; a cancel after it is not seen, and the reopen replies `Opened`. SKP-V0.md §12 states the same. This is timing inside one call, named, not covered.
   - **(c)**
     - The lock: item 6, with K-O26, K-O17 (b) and K-O4.
     - `file_name` is an `Option`: item 5 (b) and W-3.
     - The paths: item 5 (d) and W-4.
     - The re-link: SKP-V0.md §12 states that a `relink` replaces the dataset's entry in `locations.json` whatever it held, and that a client sends one after `not_found`. That obligation is P4's shell test.
   - **(d)** O5: W-6, contingent on packet P-6. Under P-6 (i) it is a "not covered" line instead.
   - **(e)** The catalog row: W-5. The ADR words: item 11.
   - **(f)** The vocabulary: packet P-3.
     - One way: the wire sends the descriptor's words (`size`, `mtime`, `footer-length`, `footer-hash`; `engine/src/descriptor.rs` `differing_components`).
     - The other way: the wire maps them to the project file's keys (`byte_size`, `modified_ns`, `footer_length`, `footer_sha256`; `kernel/src/dataset_ref.rs` `observed_json`).
     - `engine.source_changed`'s `detail` already sends the descriptor's words (`kernel/src/skp.rs`, the `SourceChanged` arm of `error_of`).

10. **ADV-2026-11-19-04 item 6 and ADV-2026-11-19-07 item 6, by item.**
    - **6 (a) P-4:**
      - (a) (i): item 5 (b)'s `lineage`;
      - (b): item 5 (b)'s `check`, names only;
      - (c) (i): `project_target_wrong_kind`, with the name for the advisor (P-4 (b) of the packet);
      - (d): item 5 (c).
    - **6 (b) P-5:**
      - (a) (ii): L8;
      - (b) and (c): item 5 (b);
      - (d), as read: ADR-036 §8 gives `completeness` as complete, or as incomplete with an integer `withheld` and a list `kinds_not_recorded` of kinds. It states no rule that the list is not empty or holds no duplicate, and none that `withheld` equals the withheld lines. The reader as merged (`COMPLETENESS` and `KINDS` in `kernel/src/session_history.rs`) admits an empty or duplicated list of at most five and any `withheld` from 0 to 2^53 − 1, and does not compare it with the withheld lines. P3b states both properties as read, changes neither, and puts neither on the wire, since nothing at P3b consumes them and the marker's words are piece 5's. A change to §8 goes to the advisor first.
    - **6 (c) P-8:** item 5 (g).
    - **6 (d) P-9 (c) (ii):** L9.
    - **ADV-2026-11-19-07 item 6:**
      - O3: K-O27 as a check, or, under packet P-5 (a), a "not covered" row: a later save checks only the lineage and the reader, so after D1's second branch it replaces another identity's file.
      - O4: item 6's module-doc clause.

11. **ADR-036 Amendment 2 item 3** (ADV-2026-11-19-19 item 3).
    - The advisor's words land in P3b-2's pull request, appended as the advisor gives them. Nothing is drafted here.
    - What they state is shown by W-1 (b): a reopened open takes the project file's dataset identity, and a step after the reopen carries it. K-O21 (b) shows the same in the kernel.
    - The gates check each clause.

12. **Producers and their consumers** (R2).

    | Producer | Consumer | Seam's end-to-end test |
    |---|---|---|
    | `LineageRefused::Unreadable` and `ThroughLink` (P3b-1) | P3b-2's `lineage` mapping | L8, L9; `v0-open_project-opened-lineage`; W-1 |
    | `Projects::release_ended` (P3b-1) | the shipped `close_dataset` binding; `open_project` | K-O17 (b), K-O26; E-SECOND, E-CRASH-UNLOCK (P4) |
    | the `open_project` binding command (P3b-2) | P4's `openProject` in `frontends/shell/src/skp/client.ts` | E-REOPEN (P4) |
    | `OpenProjectRequest`, `OpenProjectResponse` and their member types, the new constructors (P3b-2) | `Projects::open_project_command` and the binding | F-W1, F-W2, W-1 to W-6 |

    - Every other `pub` item is a gate finding (R2 (d)).
    - All of these are named in each PR body and in the node's plan summary.
    - The node is not done until each seam's test has passed on main (R2 (c)).

13. **Not covered, by name, with the reason** (beyond items 8 and 9).
    - Amendment 36 item 9's two live opens bound to one record. After a session end, the ended open stays bound and in the catalog. Its steps are refused by `require_live`, not by the catalog.
    - `PathNotUnicode`: the folder, the `at` segments, the machine location and the `relink` all arrive as UTF-8, so no ordinary path reaches it.
    - A cancel after the engine's open returned: item 9 (b).

14. **Regions.**
    - P3b-1 and P3b-2 run in sequence (item 2).
    - P3b-2 is the only part touching `protocol/`.
    - Rule (00) at each dispatch holds over the pieces in progress and those awaiting merge. It covers the shell files of item 2 and `protocol/`.
    - Each part takes main in before its gate (ADV-2026-11-16-06 item 4).
    - The reviewer recomputes each file list with git.

15. **Stops.** The worker stops and reports, alone, when any of these happens:
    1. A file or region outside item 7 (a) or 8 (a) is needed.
    2. A `pub` item outside item 12 is needed.
    3. An existing test needs an edit other than the literal (I3), or a dependency or a lock file changes (I6).
    4. A declared test passes at its base, or a mutation does not turn its test red.
    5. A refusal or reply carries an absolute path that the request did not carry, outside item 5 (d)'s named exception. That is a stop, not a strip.
    6. K-O17 (b), K-O26 or L9 fails on any platform, or cannot be made deterministic.
    7. A case that a test cannot build. That is a stop, not a skip.
    8. Code is begun before the advisor's ruling on this amendment's packet.
    9. A literal site is found that item 2 does not list.

16. **Class, gates, pushing, clippy and the model.**
    - **Class.** Full class, both gates, for each part (item 1).
    - **Pushing** (ADV-2026-11-19-10 item 2).
      - The tests' commit is its own commit, before the code.
      - It is pushed together with the code commit that makes it pass.
      - Its failure before code is shown by the worker's local run: the exit code and the failing names, at the tests' commit.
      - A stop still pushes (item 3 of the same ruling).
    - **Clippy.** The reviewer runs it at the gated head, in a hold, on the changed crates:
      - `cargo clippy --locked -p spatial-kernel -p spatial-skp --all-targets` in the root workspace;
      - for P3b-2, and for P3b-1's `commands.rs`, the `spatial-ide-shell` crate in `frontends/shell/src-tauri`.
      - A warning in a file the part changes is a finding.
    - **On the laptop,** by THE MACHINE paragraph, at each part's final candidate:
      - the focused kernel targets: `project_reopen`, `project_save`, `project_save_skp`, `project_lock_crash`, `project_store`, `session_history`, `no_generation_in_persisted_artifacts` and the skp targets; and `project_reopen_skp` for P3b-2;
      - `cargo test -p spatial-skp`, with the conformance harness;
      - for P3b-2, the shell's typecheck and tests, after `npm ci` in `frontends/shell` and in `renderer/bundle-viewer`;
      - every mutation of items 7 (b) and 8 (b), observed;
      - §2.11's command;
      - empty lock-file diffs.
    - **The app window.**
      - One E-SAVE run per part: P3b-1 changes the shipped `close_dataset` and save, and P3b-2 changes every request's literal.
      - At P3b-2's final head, every e2e suite, since §5 declares their outcomes unchanged.
    - **CI:** the workspace on three platforms, fmt, and the governance workflows.
    - **The worker's model:** worker-high on the strongest model, for the wire and persistence (ADV-2026-11-18-02 item 2).

17. **Records.**
    - Each part's closing amendment holds references and hashes only, with the counts in both columns and a class 8 row for each overrun.
    - The PR body and the node's plan summary name item 12's producers and consumers, and the strings of item 5 (c) and (g) under P6.
    - For P3b-2, the PR body names ADR-036's appended words as the advisor's.

18. **Where each ruling item is met.**
    - ADV-2026-11-19-04 item 5: item 5 (c). Item 6: item 10.
    - ADV-2026-11-19-07 item 6: item 10.
    - ADV-2026-11-19-15 item 4: item 9 (f).
    - ADV-2026-11-19-19 item 2: W-5. Item 3: item 11.
    - ADV-2026-11-19-21 item 1: item 9. Item 3: items 2 to 4.
    - ADV-2026-11-19-10 item 2: item 16.
    - Amendment 37 item 9 note 5: item 7 (a).
    - Amendment 38 item 13: items 4 and 10.
    - Amendments 41 item 9 and 42 item 8: packet P-3. Amendment 42 item 9: item 11.

19. **Superseded index.**
    - §2.2's new codes:
      - `project_target_outside_folder` is withdrawn (P-4 (d));
      - `project_target_wrong_kind` is added, its name contingent;
      - `project_file_unreadable` is added, contingent on packet P-7;
      - `project_machine_record_refused` and `project_known_folders_full` stand by Amendment 1 item 5.
    - §2.2's `opened`:
      - gains `view` (class 1);
      - its `lineage` is the two facts, with no lines;
      - its `check` holds names only.
    - Amendment 36 items 1 and 8: the release at a session end by the forwarder is replaced by item 6, contingent on packet P-2.
    - Amendment 36 item 5 (b): after the answer `copy`, the data lookup runs in step 2. This is contingent on packet P-6, and it is class 1.
    - §3's F4 row: packet P-3.
    - §2.11's step-2 lists gain these files (class 9):
      - `kernel/src/session_history.rs` and `kernel/src/project/store.rs`;
      - `kernel/tests/project_save.rs`, `project_reopen_skp.rs` and `no_generation_in_persisted_artifacts.rs`;
      - ADR-036.
    - §4's step-2 table gains the tests of items 7 (b) and 8 (b) (class 9).
    - Nothing else is superseded.

Read the last amendment first.

Nothing above is edited.
````

## 2. The packet for the advisor (before P3b's code)

**Ceilings and totals.** P3b's ceilings are in Amendment 43 item 3: P3b-1 is 315 lines, P3b-2 is 1,755. The step's totals after P3b, beside their ceilings, are in item 4. With P3b:
- kernel product reaches about 1,745 of 1,400;
- kernel tests reach about 3,302 of 1,300;
- protocol reaches about 405 of 320;
- the three named groups reach about 6,021 lines, against the step's 5,170, before P4 and P5.

I propose nothing on the step's ceilings. Each overrun is class 8 at its closing.

**P-1. The split.**
- (i) P3b-1 (about 285 lines) and P3b-2 (about 1,657), as item 2 declares.
- (ii) P3b whole, at about 1,942 lines.
- I recommend (i). P3b-1's changes ride shipped paths (`close_dataset`, `save_project`) and the reader, and each has its product caller. P3b-2 stays over 800 for item 2's three reasons.

**P-2. Where the lock is freed.** The form's letter is Amendment 36 item 8: at `close_dataset` and by the session-end forwarder. The P3a-2 gate's O4 says the lock is never freed while the open is in the catalog. A session-ended open stays in the catalog: `SkpHost::close_dataset` alone removes it.
- (i) Free at close only. Then K-O26 needs P4's shell to close the old dataset before it reopens.
- (ii) Close plus the forwarder. The forwarder's glue is proven only by P4's e2e, and an event can be lost.
- (iii) Close, plus a sweep at each `open_project` (item 6). The forwarder is unchanged.
- I recommend (iii). An ended open can no longer write (`require_live`). A lost event frees nothing early. Everything is proven by kernel tests.

**P-3. The F4 word and `check.observed`** (ADV-2026-11-19-15 item 4; ADV-2026-11-19-21 item 1 (f)). The question: which words `check.observed` carries.
- (i) The descriptor's words (`size`, `mtime`, `footer-length`, `footer-hash`), the same words `engine.source_changed`'s `detail` sends. F4's prediction, that `check.observed` names `modified_ns`, then did not hold.
- (ii) The project file's keys (`byte_size`, `modified_ns`, `footer_length`, `footer_sha256`), mapped by the wire. F4 holds.
- I recommend (i): one vocabulary on the wire for one fact, so the shell keeps one word map.
- Note: §5 makes a wrong prediction class 2. The P3a-2 gate's O2 offered a class 3 correction. The record should take §5's class.

**P-4. The R1 (e) choices still open.**
- (a) `check`'s fields. `RefCheck` holds component names only. Amendment 36's P-4 (b) said recorded and present values, which would need a kernel change.
  - I recommend names only, as ADV-2026-11-19-04 item 6 (a) rules: the fields as `RefCheck` reads.
- (b) The name of P-4 (c)'s code.
  - I recommend `project_target_wrong_kind`, with `expected` set to `folder` or `file`.
- (c) The reply's tagging.
  - (i) External, `{opened: …}`, as §2.2 writes it.
  - (ii) An internal `reply` tag.
  - I recommend (i).
- (d) `opened` gains `view`, and `lineage` carries no lines.
  - I recommend both. V3 needs a member, and up to 32 MiB of lines has no consumer.

**P-5. O3** (ADV-2026-11-19-07 item 6).
- (a) A "not covered" row.
- (b) A check: K-O27, about 15 product lines, refused as `project_folder_holds_project`, with §11.4's When widened by one clause.
- I recommend (b). Without it, a later save silently replaces another project's file.

**P-6. O5** (ADV-2026-11-19-21 item 1 (d)).
- (i) Not covered. P4 keeps `file_name` from the first reply. The previous lineage is lost after a copy and a re-link.
- (ii) For the answer `copy` only, the data lookup runs in step 2, so `not_found` writes nothing. The second call carries `copy` again with `relink`.
- I recommend (ii): a copied folder whose data has moved is ordinary use. This qualifies Amendment 36 item 5 (b) (class 1).

**P-7. A `project.spatial` that cannot be read.**
- (i) A new code, `project_file_unreadable`.
- (ii) `project_file_unwritable`, whose message says the project could not be written. That is untrue for a read, and ordinary use reaches it (a file without read permission).
- I recommend (i). `MachineStore` stays under `project_file_unwritable`. Its read case (a `folders.json` that cannot be read) is not ordinary, and is named for the source comment.

**P-8. The save's machine-record refusals.**
- (i) From `skp/0.14`, `save_project` sends them as `project_machine_record_refused`: one code for one fact.
- (ii) Keep `project_file_refused` for them.
- I recommend (i). Under (i), the reviewer's A1 (i) head concerns the project file only. The words stay yours.

**P-9. The project-file reader's rule text at a reopen.**
- (i) Send `path` and `rule`, as step 1's save does.
- (ii) Extend P-5 (b) and send `path` only.
- I recommend (i): it is the shipped practice, and the rule is what makes the refusal actionable. But the read file is outside the kernel's control, and its rule texts can repeat bytes from it.

**P-10. `cancel_key_in_use`'s message names `open_dataset` only.**
- (i) Widen the message: a P6 string, in your words.
- (ii) Name it in the source comment. The shell mints a fresh key for each call, so ordinary use cannot collide.
- I recommend (ii).

**P-11. The engine's messages at a reopen.** `Open(e)` keeps the engine's own text (SKP-V0.md §5). A DuckDB message may name the data's machine-recorded path.
- (i) Accept it, named as item 5 (d)'s exception.
- (ii) Replace the message, which departs from SKP-V0.md §5.
- I recommend (i).

**P-12. `PathNotUnicode`.**
- (i) `project_target_unresolvable` with a `detail` and no path.
- (ii) A code of its own.
- I recommend (i): no ordinary path reaches it.

## For the custodian

**What I could not settle by reading.**
- **The model line and the split.** The line in item 16 is yours as briefed. ADV-2026-11-18-02 item 2 (a) says the wire types, fixtures and literal are not worker-high work, except the part the form marks, and asks for the brief to be split when only a part needs it. P3b-1 is all worker-high ground (a lock, a path check, a persistence format). P3b-2's literal, fixtures and types could go to the standard worker. Its no-path map and O5's arm could not. If you take P-1 (i), consider marking P3b-2 that way.
- **Ceilings.** P3b is about 1,942 lines, against the read's 810:
  - P3b-1 is about 285 lines in 6 files;
  - P3b-2 is about 1,657 lines in about 42 files, of which about 180 are the literal.
  - The estimates use step 1's rates on main (item 2's working). The kernel tests may still run over, as P3a-2's did (1,611 against 590).
- **Groups with no figure.** The step-2 use of fixtures, literal, src-tauri and records is not in Amendment 42 item 10. The reviewer should give it at P3b-1's base.
- **The conformance README.** I did not check whether its 3 literal lines are all current-version lines.
- **Std error texts.** I did not confirm that every `io::Error` text reaching a refusal is free of paths. W-4 and stop 5 cover it.
- **The step's file count.** It is at risk: P3b-2 alone is about 42 files, against 75.
- **`kernel/tests/project_reopen.rs`.** I read only its L6 and its `Damaged` assertions. L8 changes no existing assertion: none asserts line 0.

**Files cited:**
- C:/dev/spatial-ide/governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md
- C:/dev/spatial-ide/kernel/src/project/mod.rs
- C:/dev/spatial-ide/kernel/src/session_history.rs
- C:/dev/spatial-ide/kernel/src/project/store.rs
- C:/dev/spatial-ide/protocol/skp/src/v0/commands.rs
- C:/dev/spatial-ide/protocol/skp/src/v0/error.rs
- C:/dev/spatial-ide/protocol/skp/tests/fixtures.rs
- C:/dev/spatial-ide/protocol/skp/tests/conformance/README.md
- C:/dev/spatial-ide/frontends/shell/src-tauri/src/commands.rs
- C:/dev/spatial-ide/frontends/shell/src-tauri/src/lib.rs
- C:/dev/spatial-ide/kernel/tests/no_generation_in_persisted_artifacts.rs
- C:/dev/spatial-ide/docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md
