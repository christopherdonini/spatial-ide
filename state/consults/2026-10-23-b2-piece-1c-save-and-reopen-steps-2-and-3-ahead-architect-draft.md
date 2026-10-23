*Custodian's filing note (2026-10-23): piece 1c's step 2 and step 3 dispatch amendments, drafted ahead by the architect, read only at main c715c96b with step 1 at 7109aeb2. The run 02:25:00Z to 02:40:10Z by its transcript (Read 35, Grep 36, Glob 5; no Write, Edit or Bash). It read through the main checkout at 8f42f5ed, one commit past c715c96b, as it discloses; the custodian checked by script that every file it cites is the same at both commits. Nothing in it is committed to the form: step 2's amendment after O0's result and step 1's merge, step 3's after step 2's merge, each pinned then. OPEN-S2-1 to OPEN-S2-4 are the human's, on Monday 2026-10-26; OPEN-S2-1 and OPEN-S2-2 carry draft ADR-036 words, red-line text. For step 1's gate before its PR opens: `KnownFolders::from_bytes` has no product caller in step 1 as planned (its step 3 section, "the caller rule for step 1"). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 371657bded95ff9377238c0b7c710de72a4d8d1a238be35be3447e3cb041f6d7.*

---

Drafted ahead: b2-piece-1c-save-and-reopen, steps 2 and 3, at main c715c96b

What I read: main at c715c96b9729ea4ff50cd42837e0b98dce9e9831, and the branch `cut/b2-piece-1c-save-and-reopen` at 7109aeb2431d9ca9379cb15b0d027dba78a20217 (read only, worktree `C:/dev/wt/b2c`; the local ref and origin's ref both point at 7109aeb2). I have no shell, so this report carries no sha256. The custodian pins every cite by script.

**Disclosure about the base.** The main checkout's HEAD was 8f42f5ed883f82d0332d3893d16bb0fccf3c6381, one commit past c715c96b (the commit titled "#244's gate 2 words reconciled…"). I read the files through that checkout. The custodian checks by script that every file cited below is the same at both commits.

**Conventions:**
- **[base]** marks a statement the step's base can change.
- Inside the two drafted amendments, the form refers to itself by section, amendment and item only (round 14). Lines appear only in cites into other files.

---

## Step 2's dispatch amendment (draft)

**Heading:** Amendment N: step 2's dispatch at B2. It is written after O0's result and step 1's merge were seen, and before any step 2 code. It covers:
- O0 applied (class 5 and class 1);
- the re-sweep (class 1, with class 3 for moved pins);
- files, tests and design points added (class 9);
- three corrections (class 3);
- rule (00) (class 1);
- the commit order;
- the superseded index.

§7 is not edited.

**1. The base and O0.**

B2 is main at or after all of the following **[base]**:
- step 1's merge commit;
- O0's own amendment (Amendment 1, item 2);
- the merge of `record-step-style-match-widening`, if OPEN-A2 is answered (a).

The probe records the four facts of §3's O0 bullets, and H1 and H5 stand or fall on them:

| O0 finding | What it changes for step 2 |
|---|---|
| (i) All as H1 predicts: the placeholder is not a link and is a file; the walk does not download it; an open and a read do download it and complete; a junction is a link | §2.5 stands as written. K-R2 runs as written. K-3's placeholder stands, for the human at P6. The predictions held. |
| (ii) The placeholder reads as a link | Every online-only file behind a project-relative locator would be refused as through a link. That is I2 and the falsification of §5: stop. The way out needs a reparse-tag read, which means a `cfg` or a new dependency (§8 item 10, I6), or B1 narrowed, which is ADR text. The human decides. |
| (iii) The placeholder is not a file | §2.5's rule that the final object must be a regular file refuses it. Same consequence as (ii): I2, stop. |
| (iv) `symlink_metadata` starts the download | The check itself blocks on the download. Item 4 (a)'s registration at entry makes a Cancel take effect at the walk's next segment. K-3's words must cover the check as well (P6, the human's). Class 2 (a wrong prediction), not I2. |
| (v) An open or a read by path does not complete within the probe's timeout | H5's "Cancel after the read returns" cannot be relied on, so K-3 as worded would be an untrue limit. That is a Correctness finding at step 2's gate if it shipped. It is I2's second clause: stop, and the human words K-3 or rules. |
| (vi) A junction does not read as a link | The §5 falsification (std's walk cannot see a link): stop. OPEN-5 goes back to the human. |

- O0 discriminates only the file-system half of H5. The shell half (the liveness line and Cancel staying live) remains OP2's and OP3's, at the sitting. So step 2's PR claims H5 only as far as K-O13 (item 6) proves it.

**2. The re-sweep at B2.** For each fact: the check that re-reads it, and the outcome if it differs.

| # | Fact | Check | If different |
|---|---|---|---|
| 1 | Step 1's merged public interface under `kernel/src/project/`: `file.rs` (`ProjectFile`, `read_project`, `write_project`, `Workspace`, `View`, `Space`, `Lineage`), `store.rs` (`KnownFolders`, `MachineRecordRefused`, `stage`/`Staged::commit`/`replace`, `record_dir`, `projects_root`, `mint_identity`, `MAX_KNOWN_FOLDERS`), `strict_json.rs` (`read`, `parse`, `Layout`, `Limits`), and `resolver.rs`'s `judge` (O1). At 7109aeb2 these are as named. | Read whole before any step 2 line. | I1 |
| 2 | Where step 1 put the `save_project` handler and its orchestration | Read | If in `kernel/src/skp.rs`, `open_project`'s handler goes there too: class 9 (item 3) |
| 3 | The one function step 1 uses to build `view.crs` (a `Space`, whose `definition` is a `sha256:` text) from the open's admitted CRS. The architect's Amendment 1 draft recommended that the kernel writes `crs`. | Read | V3's comparison at reopen must call that same function on the reopened dataset. If the shell sends `crs` instead, that is I1, and V3 is written against the wire value. |
| 4 | The camera seam step 1's P5 reads at save (`App.tsx` or `canvas/WorkingCanvas.tsx`), and the extent fit at admission | Read | Step 2 writes the inverse there (item 4 (h)). A file outside the shell group is class 9. |
| 5 | The SKP literal and its sites. There are 28 files at c715c96b (search for `skp/0.12`), plus step 1's new fixture files. The 1b bump counted 91 lines (`kernel/B2-1B-RECORDING-PREREGISTRATION.md:865 @ c715c96b`). | Count | The literal group's ≤ 30 files and 130 lines: a miss is class 8 |
| 6 | `protocol/skp/SKP-V0.md`: `save_project`'s section, §4's named-deferral list, the change log. The command-count sentence in `protocol/skp/src/v0/commands.rs:4-6 @ c715c96b` (six at c715c96b; step 1 changes it). | Read | Class 3 |
| 7 | ADR-036 at B2: Amendment 1 as landed (Annex A), and OPEN-A1's answer | Re-find each cite by the bytes of its passage | A moved cite is class 3; a changed fact is I1 |
| 8 | `kernel/src/session_history.rs` as step 1 left it (N6; O1's record move and saved-here mark) and as the widening left it | Read | I1 |
| 9 | `runAdmitPath`, `AdmitPathDeps`, `AdmissionOutcome`, `Admitted` (`frontends/shell/src/admission/AdmissionPanel.tsx:178-265 @ c715c96b`, `frontends/shell/src/admission/admitDataset.ts:11-30 @ c715c96b`) | Read | I1 |
| 10 | `viewTransitions.ts`'s `filter.apply`, `filter.clauses.set` and `style.set` (`frontends/shell/src/workspace/viewTransitions.ts:26-38 @ c715c96b`), with PR B's `fillMatch`, the widening's match value, and `ViewState` (PR A and PR C) | Read | I1 (§5) |
| 11 | The shell's close effect (`frontends/shell/src/App.tsx:1469-1474 @ c715c96b`) and its session-end path | Read | Decides OPEN-S2-3's code |
| 12 | `frontends/shell/src-tauri/src/{commands,lib}.rs` as step 1's P4 left them | Read | I1 |
| 13 | `SkpHost::open_dataset` and `OpenDatasetRequest` are unchanged. The watcher is armed with the request's path as given (`kernel/src/skp.rs:1173 @ c715c96b`). | Read | I1 |
| 14 | §0.3's engine pins: the `\\?\` prefix accepted and glob metacharacters refused | Read | I1 |
| 15 | `DatasetRef::check`, `RefCheck`, `Admission` and `in_canonical_form` (`kernel/src/dataset_ref.rs` at 7109aeb2) | Read | I1 |
| 16 | `frontends/shell/e2e/lib.mjs`'s `attachOrLaunch` (one CDP port, one `tauri dev`; `frontends/shell/e2e/lib.mjs:149-225 @ c715c96b`) and step 1's `e2e/project.mjs` | Read | Decides E-SECOND (item 7) |
| 17 | The KNOWN-LIMITATIONS numbers (the last on main is 46, `KNOWN-LIMITATIONS.md:407 @ c715c96b`; then #241, PR A, PR C, PR B and step 1) and step 1's Part letter | Read | Class 3 |
| 18 | `kernel/README.md`'s owner's index after #241 and step 1's R1 | Read | Class 3 |

- **Invalidators to test:** I1, I2 (item 1), I3, I6 and I7.
- **I4 for step 2:** product code before O0's amendment where it is the resolver or calls it. Or product code before the human approves any ADR-036 Amendment 2 words that OPEN-S2-1 or OPEN-S2-2 need.

**3. Groups, files and ceilings.** §2.11's step 2 table stands: ≤ 5,170 lines and ≤ 75 files.

**What step 1's built code changes** (each cited by symbol at 7109aeb2):
- **The `folders.json` reader.** `store.rs` `KnownFolders::from_bytes` takes bytes. Its bound, `FOLDERS_LIMITS` (2 MiB), is private and is applied only after the bytes are in memory. Step 2 adds a bounded read of the file. It is in the group (class 1).
- **The atomic replace.** `store.rs` `Staged::commit` renames only over `PROJECT_FILE_NAME`, and only that file's temp files are cleared. The machine-store writes (`folders.json` and `locations.json` on same, move, copy and re-link) need an atomic write to another name, alongside it. It is in the group (class 1), and K-S6 and K-S7 must still pass.
- **The project file read.** `file.rs` `read_project` takes bytes, so the reopen bounds the read itself (K-O12).
- **The lineage reader.** `session_history.rs`'s reader admits only `purpose` `session-history`, with `lineage` null (the `HEADER` shape), and refuses a `withheld` line (`read_line`). ADR-036 defines that line (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:150 @ c715c96b`). Its `recover` also keeps a valid prefix, which §8 forbids for a lineage file (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:200 @ c715c96b`). So the lineage reader of item D, C1 and L1 to L4 needs that file's shapes. **Class 9: `kernel/src/session_history.rs` joins the kernel product group.** It gets a `pub(crate)` steps-file reader for `purpose` `lineage`, with withheld lines and §8's whole-file refusal. Reason: one reader, so that the two copies cannot drift (ruling 7); its shapes are private there.
- **The caller rule for step 1, settled before step 1's PR opens.** The worker's report names step 2 as a later caller of `KnownFolders` (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-step-1-n1-to-n7-worker-report.md:101 @ c715c96b`), and step 2 is not that PR. If step 1's orchestration never reads `folders.json`, then `from_bytes` lands `pub` with test callers only. That blocks step 1's gate (§8 item 9). Either it moves to step 2, which counts it here, or the custodian records a round 8 pre-commitment naming step 2's `open_project` and its gate.

**Class 9 additions to step 2's lists:**

| Group | File | Reason |
|---|---|---|
| kernel product | `kernel/src/session_history.rs` | the lineage reader (above) and OPEN-S2-1's record rule |
| kernel product, **[base]** row 2 | `kernel/src/skp.rs` | the handler, and an open that takes an already-registered cancel token (item 4 (a)); `SkpHost::open_dataset` registers its key itself |
| shell product | `frontends/shell/src/skp/types.ts`, `frontends/shell/src/skp/client.ts`, `frontends/shell/src/console/surfaceRegistry.ts` | `open_project`'s types, its call and its class-A row (§2.8). Step 1's list names them; step 2's omits them. |
| shell product, **[base]** row 9 | `frontends/shell/src/admission/admitDataset.ts` | `AdmissionOutcome` is `admitted \| refused` only. `question` and `not_found` need a widened outcome, or a union local to `openProject.ts` that `AdmissionPanel.tsx` accepts. Whichever is chosen is named before code. |
| shell product, **[base]** row 4 | `frontends/shell/src/canvas/WorkingCanvas.tsx` | No reducer transition sets the camera (`frontends/shell/src/workspace/viewTransitions.ts:26-56 @ c715c96b`) |
| e2e, **[base]** row 16 | `frontends/shell/e2e/lib.mjs` | only if E-SECOND keeps two app processes (item 7) |

**The class 8 lesson.** Step 1's kernel product group counted 2,099 lines against 1,350, 534 of them inline `mod tests` that count there by path (Amendment 2, item 2). For step 2:
- Place every test that the public kernel interface can reach in `kernel/tests/project_{reopen,resolver,lock_crash}.rs`.
- Use inline tests only where a private item must be reached (the resolver's text check, the lineage reader's shapes), and count them in the product group.
- The worker records a per-group estimate in its first report. A predicted overrun is said there, and recorded as class 8 at the count. Nothing moves between groups to fit.

**4. Design points declared before code** (class 1 unless marked):

- **(a) The cancel key** is registered at `open_project`'s entry, before `project.spatial` is read. It covers the read, the folder checks, the walk and the engine open, and the engine open takes that token rather than registering the key again (`cancel_key_in_use`).
  - A Cancel takes effect at the next check after a blocking read returns.
  - `project.spatial` may itself be online-only (OP1 saves into OneDrive).
  - K-O13 proves this.
- **(b) Bounded reads.** `project.spatial` is read with a bound of `MAX_PROJECT_FILE_BYTES` + 1 (K-O12). `folders.json` and `locations.json` are read under their declared bounds.
  - `locations.json` in the machine store has no reader yet: `session_history.rs` writes one and reads none.
  - Its bound is a value declared at its site, outside §7 (class 9).
  - A refused `locations.json` is `project_machine_record_refused`, like `folders.json` (K-O10, widened).
- **(c) The question's arms** (ruling 8; ADR-036 §4, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:77 @ c715c96b`):
  - The first folder is **gone** only when `symlink_metadata` of that folder reports not-found while its parent folder is read.
  - Any other failure (a missing volume or share, a denial, a network error) means it **cannot be reached**, and the question is asked.
  - A first folder whose `project.spatial` the strict reader refuses also cannot be reached, and the question is asked: whether it holds this identity cannot be established.
  - K-O6's five cases name each arm. What a move writes to `folders.json` is OPEN-S2-2.
- **(d) The lock.** `try_lock` on `open.lock` follows the identity arms (§2.4 step 3).
  - Every refusal or cancel after the lock drops it before the reply (K-O14).
  - It is held in the binding's state until `close_dataset` of its dataset. Whether a session end also drops it is OPEN-S2-3.
- **(e) Data.**
  - A `project-relative` locator goes through `check_inside` (§2.5). The engine gets the `\\?\` form (H4).
  - The watcher is armed with that same string (re-sweep row 13). K-O15 proves that the watch sees a change there, because K-2 states that the advisory watch ends the session.
  - The re-link writes `locations.json` atomically ((b)) after the check against `observed`.
- **(f) `opened.lineage`** is a closed set of named facts, each with a basis:
  - `not-kept`
  - `kept-and-matches`
  - `lines-after-the-save`
  - `previous-used`
  - `different-saves`
  - `missing`
  - `refused-over-bound` (C1)
  - `refused-damaged` (§8: a torn file is named, never cut back)
  
  The shell maps them to S16 and S17. The kernel's messages state facts only.
- **(g) V3** as in Amendment 1, item 5, compared through re-sweep row 3's function.
- **(h) The view.** It is applied in place of the extent fit at admission, never after it, and only when V3 allows. Otherwise the fit applies and S19 shows.
  - The reopen applies the saved filter, clauses and style through the existing transitions.
  - Whether those transitions are recorded as steps is OPEN-S2-1.
  - A refused `open_project` never opens the CRS or identity remediation forms, and sends no options. Its claims are the recorded ones (§2.4 step 4), so options would otherwise be dropped in silence (§8 item 8).
- **(i) Codes.** Each has one raising site and one test, recorded in the PR body:

| Code | Raised by | Test |
|---|---|---|
| `project_open_elsewhere` | (d) | K-O4, K-O5 |
| `project_target_through_link` | `check_inside` | K-R1, K-R2 |
| `project_target_unresolvable` | `check_inside` | K-R4 |
| `project_file_refused` | the reader (step 1's code) | K-R3, K-O12 |
| `project_machine_record_refused` | (b) | K-O10 |
| `project_known_folders_full` | M2 | K-O11 |

  - The kernel's message for `project_open_elsewhere` says that this identity's lock is held. It does not say where, because the holder may be this process. Saying where would be a consequence, and S9 is the owner's.
- **(j) Class 3, C-6.** §2.2 lists `project_target_outside_folder`. No reopen path can raise it: the reader refuses `..`, an absolute `at` and every non-canonical segment at parse (`kernel/src/dataset_ref.rs` `in_canonical_form` at 7109aeb2), and the walk starts at the folder. At save, data outside the folder is carried `machine-recorded` and is not refused. The code is withdrawn: it would land with no product path (§8 item 9).
- **(k) Class 3, C-7.** K-R3's mutation (the resolver's text check skipped) survives by construction, because the file reader refuses the same `at` first. K-R3 is restated as `a_device_name_or_trailing_dot_target_is_refused_at_read_before_any_open`. It asserts `project_file_refused` at `$.datasets[0].resource.locators[i].at`, with the mutation that `in_canonical_form` is not called for a `project-relative` `at`. The resolver's own text check gets a unit test in `resolver.rs`'s `mod tests` (product group), with the mutation that the check is skipped.
- **(l) N-10's doc comment** on `in_canonical_form` (`kernel/src/dataset_ref.rs` at 7109aeb2). It still reads containment as a resolved target inside a resolved folder. Replacement words (not the human's; the worker applies them, and the PR body lists them):

  > Containment is not checked here. Piece 1c's resolver judges it at save and checks it when the data is opened: it walks from the project folder one segment at a time and refuses a link, a missing segment, or a final object that is not a regular file. A change another program makes after that check is not prevented (ADR-036 §5).

  Clause check:
  - at save: `judge`, step 4 (§2.5);
  - at open, the walk: `check_inside` (§2.5);
  - link refused: K-R1 and K-R2;
  - missing segment: K-R4;
  - final object not a regular file: §2.5's last walk bullet;
  - not prevented: §1's may-not-claim line and C1.

**5. Protocol and the SKP version (OPEN-3 (A)).**
- One version step **[base]**: one past step 1's, or two past main's `skp/0.12` (`protocol/skp/src/v0/mod.rs:115 @ c715c96b`) when the widening lands on its own.
- `open_project`'s request and its three responses (§2.2).
- `opened.workspace.view` may be V3's named state, and `opened.lineage` is item 4 (f)'s set.
- The codes are item 4 (i)'s table.
- `commands.rs`'s command count and SKP-V0.md's deferral list and change log are brought current.
- The data fixtures follow step 1's `save_project` pattern **[base]**: the request plain, with `answer`, and with `relink`; the conformance accept and refusal rows.
- The shell's fixture test reads the protocol fixtures, so `types.ts` lands in the bump commit (as Amendment 1, item 6's P2).
- Nothing on the data plane or through MCP. Control plane only (docs/10).

**6. Tests and mutations.**
- §4's step 2 table stands, with K-R3 restated (C-7) and K-R5 withdrawn.
- Amendment 1 adds K-O9, K-O10, K-O11 and K-L5. K-O10's 257-folder case is hand-built bytes, because `KnownFolders::to_bytes` refuses past 256.
- Every mutation is observed as §4 rules: applied, the named test run, the failure recorded by name with its commit, reverted.
- **Class 9 additions:**

| Test | Mutation |
|---|---|
| K-O12 `a_project_file_over_its_ceiling_is_refused_at_reopen_without_being_read_whole` (`set_len` to 1,048,577 bytes) | the read unbounded |
| K-O13 `a_cancel_before_the_engine_open_ends_the_reopen_with_nothing_opened_and_no_lock_held` | the key registered only by `open_dataset` |
| K-O14 `a_refused_or_cancelled_reopen_leaves_open_lock_free` (cases: not found, through a link, an engine refusal after the lock) | the error arm keeps the guard |
| K-O15 `on_windows_a_reopened_project_relative_open_is_watched` (an observed change ends the generation) | `arm` returns its not-watched outcome for a `\\?\` path |
| K-L6 `a_torn_lineage_file_is_named_and_never_cut_back` | the reader keeps the valid prefix |
| K-O10, widened | `locations.json` refused; `folders.json` over its byte bound (the same mutation) |
| Shell: `a reopened project's camera is its saved view, not the extent fit` | the fit applied after the view |
| Shell: `a refused project open shows no CRS or identity form and sends no options` | the refusal routed through `nextFormFamily` |
| Conditional on OPEN-S2-1 | K-S14 `a_save_after_a_reopen_whose_project_record_another_run_left_replaces_neither_history`; the shell's `a reopen records the saved filter and style as steps` |
| Conditional on OPEN-S2-2 | K-O6 asserts `folders.json`'s bytes after a move, then a copy at the old path is asked |
| Conditional on OPEN-S2-3 | K-O4 gains the case of a reopen in the same process after a session end |

- The seams and their tests:
  - shell → `open_project` → kernel → file: K-O1 and E-REOPEN;
  - resolver → engine path: K-O1 and K-O15;
  - store → `folders.json`: K-O10 and K-O11, against `KnownFolders` as built;
  - lineage reader → `session_history.rs`'s shapes: L1 to L4, K-L5 and K-L6.

**7. Fixtures, e2e, records, strings.**
- **Fixtures:** F1 to F5 and Amendment 1's F5 additions. The hand-built lineage files, and `previous-lineage.jsonl` in the machine store, are test-made (1c writes no lineage).
- **E-REOPEN:** save, relaunch the app, then reopen. In one process, the reopen would meet K-O4 while the saved dataset is open (OPEN-S2-3).
- **E-CHANGED:** F4's mtime moved between the two sessions.
- **E-CRASH-UNLOCK:** `killTree` on the app while it holds the project, relaunch, open. This needs one app at a time, which lib.mjs supports.
- **E-SECOND:** see "What I could not settle".
- **The Part:** rows OP2 to OP5 join step 1's Part. P0 is read the last amendment first. Blank log.
- **KNOWN-LIMITATIONS:** K-2 and K-3, and K-4 if step 1 did not land it, at the next free numbers at R1's base **[base]**. Also K-5 (OPEN-S2-4): a `folders.json` or `locations.json` the reader refuses stops every open of that project on this machine, and the app offers no remedy. P6 placeholders.
- **Strings (P6):**
  - S8 is the human's words (round 70, OPEN-2);
  - S9 to S12, S16, S17 and S19 to S21 are owner placeholders, each stating only the consequence;
  - S9 does not say "another window", because the holder may be this process.

**8. Commit order.** Each commit passes fmt, clippy (read as Amendment 2, item 4 reads it) and `cargo test --locked --features spatial-engine/fixture`. A `pub` item gets its product caller later in this PR. No `allow(dead_code)`.
- **S0.** The branch from B2.
- **S1.** `resolver.rs`'s `check_inside`, with K-R1, K-R2, K-R4, the restated K-R3 and the resolver's text-check unit test.
- **S2.** `store.rs`: the bounded reads, the atomic machine-store write, the `same` append with M2, the move (OPEN-S2-2), and the copy's identity and links.
- **S3.** `session_history.rs`'s lineage reader, and item D's detection in `project/mod.rs`.
- **S4.** The orchestration `project::open` (item 4 (a) to (h)), `skp.rs`'s token-taking open **[base]**, and `dataset_ref.rs`'s doc comment. Tests: K-O1 to K-O15, L1 to L4, K-L5, K-L6.
- **After any milestone 4 PR in flight on the shell paths merges:**
  - P1: main merged into the branch;
  - P2: the bump in one commit (item 5);
  - P3: the handler;
  - P4: the binding, with `open_project` on `spawn_blocking`, the lock in state and `binding_pick_project_folder`'s reuse;
  - P5: the shell and its tests;
  - P6: the e2e work.
- **R1.** The records at a base where `kernel/README.md` is free.

**What waits for what:**
- S1 waits for O0's amendment.
- P2 waits for the protocol slot and the shell paths.
- Any ADR-036 Amendment 2 words that OPEN-S2-1 or OPEN-S2-2 need are approved by the human and land before the code that implements them (§8 item 7, by analogy).

**9. Rule (00) at B2** (all **[base]**; re-check each in-flight branch's diff at dispatch):
- **Milestone 4.** PR C or PR B may be in flight. Both share `App.tsx`, `console/surfaceRegistry.ts` and `package.json` with step 2. Both edit `viewTransitions.ts` and `workspaceState.ts`, which step 2 reads. PR B edits `WorkingCanvas.tsx` and, under its conditional, `types.ts`.
  - Milestone 4 goes first where shell paths meet (§2.14). The interleave of OPEN-17 (b) applies the same way: S1 to S4 proceed; P2 to P6 wait for that PR's merge.
  - Milestone 4's form recommends the same interleave for PR C and PR B against later 1c steps (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:734 @ c715c96b`).
- **`record-step-style-match-widening`.** Under OPEN-A2 (a) it is in flight after step 1, on `protocol/` and `session_history.rs`. Step 2 does not dispatch beside it. Under (b) it is merged inside step 1.
- **#241 to #244.** Expected merged on Monday. If #241 is not, `kernel/README.md` (R1) waits.
- **The docs lane.**
  - A piece correcting the "Proposed" lines at `frontends/shell/src/workspace/viewTransitions.ts:6 @ c715c96b` or `frontends/shell/src/style/StylePanel.tsx:55 @ c715c96b` shares those files only if step 2 edits them under I1.
  - A docs-lane node for the `resource_dir` comments that #241's record proposes (seen in the checkout one commit past c715c96b) would share `frontends/shell/src-tauri/src/commands.rs`, which uses `resource_dir`.
- **`protocol/`.** Step 2 is the only piece on it.

**10. Superseded index (this amendment):**
- §2.2's code list: by C-6, and by item 4 (i)'s table;
- §2.4 step 2's move arm: by OPEN-S2-2's answer;
- §2.4 step 3's lock lifetime: by OPEN-S2-3's answer;
- §2.11 step 2's file lists: by item 3;
- §4 step 2's K-R3: by C-7;
- §4 step 2's table: added to by item 6;
- §2.12's KNOWN-LIMITATIONS list: added to by K-5;
- §8 item 19: by OPEN-S2-2 (a), if ruled.

---

## Step 3's dispatch amendment (draft)

**Heading:** Amendment M: step 3's dispatch at B3. It is written after step 2's merge was seen, before any step 3 code, and covers:
- the re-sweep (class 1 and 3);
- files, tests and design points added (class 9);
- rule (00) (class 1);
- the commit order;
- the superseded index.

§7 is not edited.

**1. The base.** B3 is main at or after step 2's merge commit (§2.13; OPEN-3 (A)) **[base]**.

**The re-sweep:**

| # | Fact | If different |
|---|---|---|
| 1 | Step 2's merged `project::open`, the lock type in the binding, `store.rs`'s `locations.json` reader | I1 |
| 2 | `StepRecorder`'s `Record`, `create`, `record_step`'s match by path and claims, and `end_session`. `recover` and `Recovered`, which does not expose the chain's next parent after a `restored` mark (`kernel/src/session_history.rs` at 7109aeb2). | I1 |
| 3 | The record rule OPEN-S2-1 settled, and whether a session record's `path` is the `\\?\` form | I1 |
| 4 | `style.set`'s value shapes after PR B and the widening (the four properties, and a match value) | I1 (§5) |
| 5 | The SKP literal and its sites (now with steps 1 and 2's fixtures) | class 8 on a miss |
| 6 | `App.tsx`'s start-up effects, `runAdmitPath` | I1 |
| 7 | lib.mjs: kill and relaunch | I1 |
| 8 | KNOWN-LIMITATIONS numbers, the Part's rows | class 3 |
| 9 | `kernel/README.md` | class 3 |

**2. Groups, files and ceilings.** §2.11's step 3 table stands: ≤ 2,970 lines and ≤ 60 files. Class 9 additions:

| Group | File | Reason |
|---|---|---|
| kernel product | `kernel/src/dataset_ref.rs` | The offer's data state must be computed without opening a dataset (item 3 (a)). `DatasetRef::check` takes an opened `Dataset`, and `DatasetRef`'s `observed` is private (at 7109aeb2). A comparison of the observation against `spatial_engine`'s `SourceDescriptor::of` (`engine/src/descriptor.rs:102 @ c715c96b`, which reads the footer and never the whole file) is added there. |
| shell product | `skp/types.ts`, `skp/client.ts`, `console/surfaceRegistry.ts` | the three commands and their rows (§2.8) |
| shell product, **[base]** | `admission/AdmissionPanel.tsx` or `admission/admitDataset.ts` | accepting goes through `runAdmitPath` (item 3 (b)) |

The class 8 lesson applies here too: `session_history.rs` already carries a large inline `mod tests`, and every test added there counts in the 600 lines. Recovery's tests go in `kernel/tests/recovery{,_crash}.rs`.

**3. Design points declared before code:**

- **(a) `list_recoverable` `{skp, project: null|<uri>}`.**
  - `null` lists `unsaved-` records at start; a URI lists that project's record at its open.
  - Each record is probed with `try_lock`, then released.
  - The header and the kept prefix come from `recover`; the dataset's file name from `locations.json`, read strictly; the time from the last kept step's `at`.
  - The data state, with no engine open: unchanged, changed (components named) or not found. A missing or refused `locations.json` is not found, with its rule.
  - It runs on `spawn_blocking`, and the shell never waits on it: the canvas stays usable, and the offer shows when the list returns. `SourceDescriptor::of` reads the footer, which may download an online-only file, so the offer can be late; KNOWN-LIMITATIONS K-6 (P6) says so.
  - A declared count of records listed per call, at its site (the custodian's value, class 9). The rest are named as not listed.
- **(b) `recover_session` `{skp, record, cancel_key, dataset: null|<handle>}`.**
  - With `null`, the kernel opens the data from the record (the path from `locations.json`, the header entry's claims) through step 2's cancellable open, with liveness and Cancel through `runAdmitPath`. The response carries `dataset`, `session`, `check` and `values`.
  - With a handle (a project record offered at its open), the kernel adopts into that open after it checks that the handle's path and claims equal the record's. Otherwise the call is refused by a new code (class 9), its message stating that fact.
  - Then: lock; truncate to the kept prefix's byte length and sync; seek to the end; insert as a `StepRecorder` record. The record's `path` is the opened dataset's own path, never `locations.json`'s text, so that `record_step`'s match continues it. `last_step` is the chain's next parent (after a `restored` mark, its `to`).
  - `values` are the last value of each key along the parent chain. This is a restore of workspace state (ADR-036 §7, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:189 @ c715c96b`), never a replay or an undo.
- **(c) `discard_recoverable` `{skp, record}`.** `try_lock` first: a held record is refused with `recoverable_record_locked`. Otherwise the history, `locations.json` and the folder are removed.
- **(d) K-C7's dedupe**, by first step id (Annex A, item 5).
- **(e) What a recovery does not restore.** It does not restore the clauses or the view: the registry records `filter.apply` and `style.set` only (`kernel/src/session_history.rs` `REGISTRY` at 7109aeb2). K-7 (P6) says so, and S13's words claim neither.

**4. Protocol.** One version step **[base]**. The three commands, `recoverable_record_locked`, and item 3 (b)'s new code. The fixtures follow step 2's pattern. `commands.rs`'s count and SKP-V0.md are brought current.

**5. Tests.** §4's K-C1 to K-C7, the shell rows and E-RECOVER stand. Class 9 additions:

| Test | Mutation |
|---|---|
| K-C8 `discarding_a_locked_record_is_refused_and_removes_nothing` | removal before the lock probe |
| K-C9 `an_adopted_record_is_continued_by_the_next_record_step_on_the_reopened_path` (the seam `recover_session` → `record_step` in their real shape, including a project record whose data was opened through step 2's resolver path) | `Record.path` taken from `locations.json` |
| K-C10 `the_values_after_a_restored_mark_are_those_of_the_step_it_restores_to` (hand-built) | a linear last-value scan |
| K-C11 `listing_opens_no_dataset` (the catalog is unchanged) | the state taken through an engine open |
| Shell: `the canvas is usable while list_recoverable is pending`; `accepting goes through runAdmitPath with liveness and Cancel` | the start awaits the list; `admit` bypassed |
| E-RECOVER-PROJECT: a project record offered at its open, accepted, a later step continues it | the adoption skipped |

**6. Records.** Step 3's rows join the Part (OP6). KNOWN-LIMITATIONS K-6 and K-7 at the next free numbers **[base]**. S13 to S15 are P6 placeholders.

**7. Commit order:**
1. T0: the branch from B3.
2. T1: `dataset_ref.rs`'s observation comparison.
3. T2: `session_history.rs`: the list, the adoption and the discard, as kernel functions, with K-C1 to K-C11.
4. After the shell paths are free: T3, main merged in; T4, the bump; T5, the handlers; T6, the binding; T7, the shell; T8, the e2e work.
5. R1: the records.

**8. Rule (00) at B3** **[base]**:
- milestone 4's PR B, if still in flight (shared shell files);
- the widening, if separate and unmerged (`session_history.rs`, `protocol/`);
- the docs lane's next pieces (src-tauri `commands.rs`);
- `protocol/`: step 3 alone.

**9. Superseded index:**
- §2.6's three bullets: by item 3 (a) to (c);
- §2.11 step 3's file lists: by item 2;
- §4 step 3's table: added to by item 5.

---

## OPEN items (the human's)

**OPEN-S2-1. Where a reopened project's session steps live, and what a later save's mark compares against.**

ADR-036 Amendment 1, item 5 moves the history only at a project's first save. After a reopen, `record_step` creates an `unsaved-` record whose steps do not include the reopened filter and style (`kernel/src/session_history.rs` `StepRecorder::create` at 7109aeb2). OPEN-9 (A)'s comparison would then withhold the saved-here mark on nearly every save after a reopen.

Options:
- (a) A project record created at the first step after a reopen. This needs ADR words for a record that a first save did not create. A crashed earlier record of the same project collides with it before step 3's offer exists.
- (b) The `unsaved-` record as today, moved at the session's first save, with no reopen steps. The mark is withheld unless the steps alone reach the workspace. That is true, but S5 shows on most saves.
- (c) As (b), with the reopen's application recorded as steps (actor `user`). ADR-022 Amendment 2's sentence on the mark holds as written.

**Recommend (c).** It also needs the collision rule: a save whose project record another run left replaces neither history, and writes no mark (K-S14). Draft ADR-036 Amendment 2 words for approval (the architect's):

> The same holds at the first save of a session that opened the project from its folder. Where the project's record already holds a history another run left, neither history is replaced: the save writes no saved-here mark, and the session's history stays under its own record.

Clause check:
- "the same": item 5's carry-over;
- "writes no mark": `history_mark` `withheld` (§2.2);
- "stays under its own record": the `unsaved-` record, which `end_session` clears.

**OPEN-S2-2. What a move writes to `folders.json`** (ruling 8; the draft's open point).

Options:
- (a) `first` becomes this folder, and the folder moved from is dropped. A later copy at the old path is asked, because `first` holds the identity.
- (b) `first` is kept and this folder is added to `same`. After any move, the first folder is gone, so every later copy reads as a move: two folders then share an identity silently, against §4.
- (c) `first` becomes this folder, and the old path is added to `same`. A copy placed back at the old path then opens unasked.

**Recommend (a).** It narrows §8 item 19 to exclude a first folder replaced on a move. Draft words for approval:

> When a project has moved (§4), the folder it opened from becomes the first folder, and the folder it moved from is no longer remembered.

Clause check: §4's move arm (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:77 @ c715c96b`), and K-O6.

**OPEN-S2-3. Reopening an identity this process holds after its session ended** (OPEN-7 (A)'s reading).

The shell closes the old dataset only after the new admission commits (`frontends/shell/src/App.tsx:1461-1474 @ c715c96b`). So reopening the same project after a changed-file session end is refused as already open. Ordinary use reaches this.

Options:
- (a) The binding drops the lock when the dataset's generation ends, as well as at close.
- (b) The shell closes its dataset of that identity before it calls `open_project`.
- (c) Keep the refusal.

**Recommend (a).** A session that has ended is not open.

**OPEN-S2-4. A refused `folders.json` or `locations.json`** (the draft's open point).

Options:
- (a) No remedy in step 2, and KNOWN-LIMITATIONS K-5 says so.
- (b) A remedy action that removes the machine record. That is a scope addition against the never-pruned K-4.

**Recommend (a).**

**Pending, with an effect on these steps:**
- **OPEN-A2 and OPEN-18 (one question).** Under (a), step 2 waits for the widening's merge. Under (b), it does not.
- **OPEN-A1.** Step 2 reads at its base whichever words landed.

## What I could not settle

- **O0's result is unseen,** so step 2's item 1 is a table of conditions.
- **Step 1's O1 and P2 to P6 are unbuilt.** The handler's file, the `view.crs` function, the camera seam and the record move are re-sweep rows 2 to 4 and 8. `KnownFolders::from_bytes` has no step 1 product caller in sight, and that is step 1's gate's finding to settle.
- **E-SECOND needs two app processes at once.** At c715c96b, `attachOrLaunch` attaches to one fixed CDP port and spawns one `tauri dev` (`frontends/shell/e2e/lib.mjs:149-225 @ c715c96b`). I recommend reading this at B2:
  - if a second instance is unsupported, withdraw E-SECOND by amendment, in favour of K-O4's other-process case and OP5, recorded as a reduction, not silent;
  - or extend lib.mjs (class 9). Its debug-port posture is docs/09's, read before any extension.
- **KNOWN-LIMITATIONS numbering.** The PR C draft gives 1c the numbers 48 to 50 (`state/consults/2026-10-22-b1-shell-half-pr-c-and-pr-b-ahead-architect-draft.md:105 @ c715c96b`). Steps 1 to 3 need up to seven items (K-2 to K-7, plus step 1's), so the numbers are set at each R1 base, never read as a reservation.
- **Record cap.** Items 3 and 4 of each draft carry design prose, because they declare §2 scope before code. The custodian reduces to references whatever a reference can carry.
- **No sha256, and the checkout one commit past c715c96b,** as disclosed above.

Files:
- C:/dev/spatial-ide/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md
- C:/dev/wt/b2c/kernel/src/project/store.rs
- C:/dev/wt/b2c/kernel/src/project/file.rs
- C:/dev/wt/b2c/kernel/src/session_history.rs
- C:/dev/wt/b2c/kernel/src/dataset_ref.rs
- C:/dev/spatial-ide/kernel/src/skp.rs
- C:/dev/spatial-ide/frontends/shell/src/admission/AdmissionPanel.tsx
- C:/dev/spatial-ide/frontends/shell/src/admission/admitDataset.ts
- C:/dev/spatial-ide/frontends/shell/src/App.tsx
- C:/dev/spatial-ide/frontends/shell/e2e/lib.mjs
- C:/dev/spatial-ide/docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-22-b1-shell-half-pr-c-and-pr-b-ahead-architect-draft.md
