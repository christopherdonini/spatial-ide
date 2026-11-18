# b2-piece-1c-save-and-reopen: Amendment 31, P2 (the lineage reader) declared; the architect's report

*Filed by the custodian from the hand-back: 15829 bytes, sha256 1d9c207f205a0ab76840854e0e4f9ab6f89fb38c762e5e6722715935e7fb5911, claude-opus-5-5, 26 calls by its transcript since its report on Amendment 30. Byte for byte below the rule. Its amendment, from its heading to its last line, is appended to the form.*

---

Drafted: b2-piece-1c-save-and-reopen Amendment 31 (P2), architect
Choices left for the advisor: 0. The packet does not put the record's `locations.json` writer in P2. That writer stays step 3's (Amendment 30 item 4 (a)) and is not declared here.
Reviewed: main @ 2a8907b8786dd0dc714213fa21fdb41cd6ada52c, read in the main checkout. The coordinator places Amendment 30 at bdc72f5f; I did not re-read the form there.

I have no shell, so this report gives no sha256.

---

## Amendment 31 — the reopen's P2, the lineage reader, declared before its code (ADV-2026-11-16-10, R1 and R2; ADV-2026-11-16-16 item 1 (b)): its scope, the reader's rule, ceilings, tests, mutations, the pre-committed producer, regions, stops and gates; `kernel/src/session_history.rs` and three tests outside §2.11's and §4's lists (class 9)

*Drafted by the architect for the custodian, read only, at main 2a8907b8786dd0dc714213fa21fdb41cd6ada52c, and appended by the custodian's script. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is the architect's recommendation, it says so. Rulings are cited by id, or by file, and item. Code is cited by path and symbol.*

1. **Basis.**
   - P2 is ADV-2026-11-16-10 R1 (a) and (c): the lineage reader, full class, run beside P1a and P1b.
   - Its rules are:
     - §2.4 step 6;
     - §2.10 item D, which is Annex A item 2 (ADR-036 Amendment 1 item 2);
     - ADR-036 §6 and §8;
     - C1 of Amendment 1 item 5 (bounds, K-L5, §8 item 20).
   - Item 3 (e) of 2026-11-12 is met: `second-open-history-before-1c-step-3` merged before this amendment (Amendment 29).
   - **Branch and folders:** `cut/b2-piece-1c-p2`, worktree `C:/dev/wt/1c-p2`, build folder `D:/wt-targets/1c-p2`, cut from main.
   - **Not P2's:**
     - the record's own `locations.json` writer (step 3's, Amendment 30 item 4 (a));
     - OPEN-S2-1 (c)'s record rule and R3 (P3a's);
     - the names and paths of `lineage.jsonl` and `previous-lineage.jsonl` (P3a's, which passes them in);
     - the closed set of facts on the wire in `opened.lineage` (P3b's, to the advisor under R1 (e)).

2. **Files and regions** (the architect's recommendation).
   - **`kernel/src/session_history.rs`** (class 9: not on §2.11's step-2 list; counted in kernel product):
     - **New shapes:** a lineage header (`purpose` `lineage`, `project` a project URI only, `lineage` holding §8's `completeness` and `starts`); a withheld line (ADR-036 §6).
     - **A private `MAX_LINEAGE_FILE_BYTES`** at its site, with C1's value, 33,554,432.
     - **`read_line`:** its framing (the LF, the header and step line ceilings, NUL, UTF-8 and the strict parse) moves into one private function, which `read_line` and the lineage reader both call. Nothing else in `read_line` changes.
     - **`check_header`:** its dataset-entry reading moves into one private function, which it and the lineage header both call. Nothing else in `check_header` changes.
     - **Unchanged:** `in_writers_form`, `check_step`, `in_order`, `spelled`, `recover`, `recover_bytes`, `HEADER`, `MARK_LINE`, and every writer item (`StepRecorder`, `reader_accepts`, `create`, `copy_under`).
     - **New:** `pub fn read_lineage(folder_file, previous_file, member)`, where `member` is `project::file::Lineage`; `pub struct LineageRead`; `pub enum FolderLineage`; `pub enum PreviousLineage`; `pub enum LineageRefused`.
     - No inline tests: the public reader reaches every new item.
   - **`kernel/tests/project_reopen.rs`:** new, on §2.11's list. Its hand-built steps files are test-made, since 1c writes no lineage.

3. **The reader's rule** (the architect's reading of C1, §8 and Annex A item 2 together).
   - **The handles.** It opens each file read only and holds no handle after it returns. It never writes, truncates, renames or locks a file. A refused file is left byte for byte as it was.
   - **The whole-file check.** A file is first checked whole:
     - its size by metadata, then a read bounded at `MAX_LINEAGE_FILE_BYTES` + 1;
     - each line against §9's line ceilings, through the shared framing;
     - the header in the lineage shape;
     - each later line a step or a withheld line, chained by `parent`;
     - a mark line is refused, since ADR-036 §6 allows marks in the session history only.
   - **Refusal.** A file over its byte bound or a line bound is `LineageRefused::OverBound`, naming the bound (C1). A file that fails any other check is `LineageRefused::Damaged`, with its line and rule (§8). Neither is read further, and no prefix of it is used.
   - **"Lines after the save."** Annex A item 2's arm 1 applies only to a file that passes the whole-file check. Its "lines after the save" are valid lines after the recorded prefix.
   - **Member `not-kept`.** If the folder's file is absent, `folder_file` is `Absent`. If it is present, it is `NotRead`: named as from a different save, never opened. `previous_file` is `None` and `lineage` is `None`.
   - **Member kept: arm 1.** The folder's file passes, and its header line and first `steps` step and withheld lines, each with its LF, hash to the member's `sha256`. Then `folder_file` is `Recorded`, or `RecordedWithLinesAfter` when valid lines follow, and `lineage` holds those 1 + `steps` lines.
   - **Member kept: arm 2.** Otherwise the folder's file is `Absent`, `NotTheRecordedOne` or `Refused(…)`, and the previous file is checked whole the same way. If its whole bytes hash to the member's `sha256` and it holds `steps` step and withheld lines, `previous_file` is `Used` and `lineage` holds its lines.
   - **Member kept: arm 3.** Otherwise `previous_file` is `Absent`, `NotTheRecordedOne` or `Refused(…)`, and `lineage` is `None`. The facts then name the files as from different saves, or the lineage file as missing.
   - **Messages.** The kernel's `Display` for each fact states the engine fact only. The consequence is the shell's (S16, S17).

4. **Ceilings by §2.11's groups.** Neither §2.11 nor §7 is edited. An overrun is class 8 in P2's closing amendment.

   | Group | After Amendment 30 (P1a and P1b) | P2 | Left after P2 |
   |---|---|---|---|
   | kernel product | 925 of 1,400 | 260 (`session_history.rs`) | 665 |
   | kernel tests | 740 of 1,300 | 330 (`project_reopen.rs`) | 410 |
   | protocol | 310 of 320 | 0 | 310 |

   - P2: 590 lines and 2 files. It is under 800, so R1 (d) asks no reason.

5. **Tests, declared before code** (all in `kernel/tests/project_reopen.rs`).
   - Each fails at main because `read_lineage` does not exist, which is a compile failure. K-L8's `recover` assertion is the one exception, by name.
   - Each mutation is observed by the round-25 rule: applied, the named test run, its failure recorded by name with the commit, then reverted. A `verify-mutation` run is not called an observation.

   | Id | Test | Asserts | Mutation |
   |---|---|---|---|
   | L1 | `a_lineage_file_whose_recorded_prefix_matches_the_member_is_the_projects_lineage` | a header, two steps and a withheld line, with the member over all of them and `steps` 3: `Recorded`, and `lineage` equals the four lines | arm 1's hash comparison removed |
   | L2 | `lines_after_the_recorded_prefix_are_named_and_not_read_as_the_projects` | the same file with two valid steps appended, and the member over the prefix: `RecordedWithLinesAfter`, and `lineage` is the prefix only | the prefix taken as the whole file, not cut by the step count |
   | L3 | `a_previous_lineage_matching_the_member_is_used_and_the_folders_file_named` | cases: the folder's file valid but different, and the folder's file absent; each with a matching previous file: `Used`, with `NotTheRecordedOne` or `Absent`, and `lineage` the previous file's lines | arm 2 removed |
   | L4 | `a_lineage_file_from_a_different_save_is_named_and_not_read_as_the_projects` | cases: the folder's file valid but different, with no previous file, gives `NotTheRecordedOne`, `previous_file` `Absent`, `lineage` `None`; the member kept with no files gives `Absent` and `Absent`; the member `not-kept` with a file present gives `NotRead` | arm 3 returns the folder's lines; the not-kept check removed (two mutations) |
   | K-L5 | `a_lineage_file_over_its_bounds_is_named_and_not_read` (Amendment 1 item 5, C1) | a file extended by `set_len` to 33,554,433 bytes, and a step line of 262,145 bytes, each beside a member that records a lineage: `Refused(OverBound)` naming the bound | the file-size check removed |
   | K-L6 | `a_torn_lineage_file_is_named_and_never_cut_back` (class 9; the 2026-10-23 draft's id) | cases: a last line without its LF; an unparsable line after a prefix that matches the member. Each gives `Refused(Damaged)` with its line, `lineage` `None`, and the file's bytes unchanged | the reader keeps the valid prefix |
   | K-L7 | `a_lineage_header_and_withheld_lines_are_read_in_their_shape_and_a_mark_line_is_refused` (class 9) | a session-history header in a lineage file, a mark line, and a withheld line out of chain are each `Damaged`, naming the member path; a lineage header with each `completeness` and `starts` form passes | mark lines admitted in a lineage file |
   | K-L8 | `the_session_history_reader_still_refuses_a_withheld_line_and_a_lineage_header` (class 9) | `recover` of a history holding a withheld line, or a lineage header, keeps only the lines before it and names the failure | the lineage shapes admitted by `read_line` |

   - K-L8 guards the shared framing. Its `recover` assertions hold at main by design, so it is exempted by name from stop 4.
   - No existing test is edited (I3).

6. **The pre-committed producer** (R2).

   | Producer (`pub` item) | Consumer | Seam's end-to-end test |
   |---|---|---|
   | `session_history::read_lineage`, `LineageRead`, `FolderLineage`, `PreviousLineage`, `LineageRefused` | `Projects::open_project`'s step 6 (P3a), which gives `opened.lineage` on the wire (P3b) and S16 and S17 in the shell (P4) | working name `a_saved_project_whose_member_records_a_lineage_reopens_with_its_lineage_named` (a K-O1 case in P3a: a hand-built project and lineage file, the facts asserted for a match and for a file from a different save); a P3b wire fixture of `opened.lineage`, working name `v0-open_project-opened-lineage`; P4's shell test, working name `a reopened project's lineage facts map to S16 and S17` |

   - Each working-named test is declared in full, with its mutation, in the consuming piece's amendment before its code (R2 (b)).
   - The node is not done until each seam's test has passed on main (R2 (c)).
   - Any other `pub` item in P2 is a gate finding (R2 (d)).
   - These are named in P2's PR body and in the node's plan summary.

7. **Regions against the pieces in flight.**
   - **P2's files:** `kernel/src/session_history.rs`, `kernel/tests/project_reopen.rs`.
   - **P1a** (`kernel/src/project/resolver.rs`, `kernel/src/dataset_ref.rs`, `kernel/tests/project_resolver.rs`) shares no file with P2.
   - **P1b** (`kernel/src/project/store.rs`, `kernel/src/project/mod.rs`, `protocol/skp/src/v0/error.rs`, `protocol/skp/SKP-V0.md`, `kernel/tests/project_lock_crash.rs`, `kernel/tests/project_store.rs`, `kernel/tests/project_save.rs`) shares no file with P2.
   - **PR B @ 6f95993e** touches shell files only.
   - **The S1 piece** (`state/consults/2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-form-draft-architect.md`, its §5) puts the kernel and `protocol/` out of scope.
   - P2 touches nothing in `protocol/`. Rule (00) leaves P1b the only piece there.
   - P2 reads `project::file::Lineage` and does not edit `file.rs`.
   - The reviewer recomputes each file list with git against its branch.

8. **Stops.** The worker stops and reports alone when any of these happens:
   1. A file outside item 2 is needed. `protocol/`, `kernel/src/project/*` and `kernel/src/dataset_ref.rs` are among them.
   2. A session-history test fails, an existing test needs an edit (I3), or a writer item in `session_history.rs` must change.
   3. A `pub` item outside item 6 is needed.
   4. A test other than K-L8 passes at its base before its code, or a mutation does not fail its test.
   5. The reader would write, truncate, rename or lock a file.
   6. `S::Entry` or `DatasetRef::parse` refuses a lineage header's project-relative locators (Annex A item 4). Fixing that is `dataset_ref.rs`, P1a's file.
   7. A dependency or a lock file changes (I6).
   8. A case a test cannot build. That is a stop, not a skip.

9. **Class and gates.**
   - **Full class, both gates** (ADV-2026-11-16-06 item 2 (a)). The grounds:
     - persistence: a bounded reader of a file in the user's project folder and in the machine store, which never cuts a file back (§8 item 20);
     - a seam: a producer pre-committed to P3a;
     - more than 260 lines;
     - P2 also moves framing that the shipped `record_step` writer check shares.
   - **CI** runs the full suites: the workspace on three platforms, fmt and clippy.
   - **On the laptop,** in turns with P1a and P1b by THE MACHINE paragraph, P2 keeps at its final candidate:
     - the focused `project_reopen`, `session_history`, `session_history_crash` and `record_step_match` test targets and `session_history`'s unit tests;
     - every mutation of item 5 observed;
     - §2.11's command;
     - empty lock-file diffs.
   - **No app-window run.** No shipped path reaches `read_lineage` until P3a. The shared framing that `record_step` reaches is covered by those kernel suites.

10. **Superseded index.**
    - §2.11's step-2 kernel product list is added to by `kernel/src/session_history.rs` (class 9).
    - §4's step-2 table is added to by K-L6, K-L7 and K-L8 (class 9), with L1 to L4 named.
    - Nothing else is superseded.

Nothing above is edited.

---

**Notes (each one mine):**

1. **Size and class.** At 590 lines, P2 is not under 260. It would be full class anyway, because it is persistence (a reader of the user's lineage file and the machine store's previous lineage, never cutting either back) and a seam (a producer pre-committed to P3a). It has no concurrency: it takes no lock and holds no handle after it returns. The shared framing it moves is on the shipped `record_step` path, and that is why stop 2 and K-L8 exist.
2. **The reader's rule for a torn tail.** Item 3 decides one case: a file whose recorded prefix matches but whose later lines are damaged or over a bound. C1 (on the form, ruled) refuses a file over either bound and reads it no further, including a bound broken after the prefix. I read §8's damaged-file rule the same way, so arm 1's lines after the save are valid lines only. If the custodian reads this as a question of ADR text, it goes to the advisor before P2's code, and K-L6's second case and L2 depend on the answer.
3. **The wire's facts.** The closed set of facts on the wire (R1 (e)) is still the advisor's, with P3b. P2's kernel types carry every distinction that ADR-036 Amendment 1 item 2, §8 and C1 draw, as a pair: the folder file's fact and the previous file's fact. The 2026-10-23 draft's eight facts map onto that pair. If the advisor's set needs a distinction the pair does not carry, P3a adds it as class 9.
4. **P3a's kernel tests headroom.** After P2, step 2's kernel tests group has 410 lines left. The declaration read estimated P3 at about 650 lines of tests. So P3a's declaration will likely predict a class 8 overrun there, recorded at its count, with §2.11 unchanged.
5. **What I read for this draft.**
   - The form's §2.4, §2.10, §4's step-2 table, Amendment 1 and Annex A.
   - ADR-036 §6 and §8.
   - `kernel/src/session_history.rs`'s reader, shapes and writer check.
   - `kernel/src/project/file.rs`'s `Lineage`.
   - The 2026-10-23 draft's (f) and its test tables.
   - The declaration read and its supplement.
