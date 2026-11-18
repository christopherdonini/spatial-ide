Reviewed: PR #332 at eeebe0977d71753fbeeaa8ffa288d6fe4997e2fb (the custodian's filing note, 2026-11-18: the reviewer, one of PR 332's two gates under its form's Amendment 31 item 9; Bash 92, Read 12, two errored (a toolchain listing, and a listing of a log not yet written), model claude-opus-5-5, from 2026-11-18T19:06:10Z to 19:45:47Z; its one departure, a first L1 run that failed in setup on a temporary folder not yet made, is in its section 7; the report below byte for byte from its hand-back of 21923 bytes, sha256 888e94fcd68efa47075868e6191837cd285bffb8beb47bc66d9355f9e983076e, with this note in its first line and one final newline), gate, reviewer (cut/b2-piece-1c-p2 @ eeebe0977d71753fbeeaa8ffa288d6fe4997e2fb)
Verdict: PASS WITH NOTES

The code has no Correctness finding and no Evidence finding. All nine declared mutations fail their own test at the test's own assertion. CI is green at H. There are two Documentation findings, both in the PR body, to fix before the merge. They need no re-gate.

## Findings

### Correctness
None.

### Evidence
None that blocks. One departure of mine is in the runs section (the first L1 run failed in setup because of my temp folder).

### Documentation (fix before the merge; no re-gate, AUTONOMY §31; neither text is the human's wording)

**D1. The PR body's count row uses one numstat column.**
- §2.11 names the counting command but not which column counts.
- This form's own reading for step 2 counts both columns: Amendment 33 item 3, for P1b, reads "both columns" (`store.rs` 278+16 = 294 by my numstat of bdc72f5f...5a396eac).
- By that reading, `session_history.rs` is 356 against 260, not 340. P2 is 753 lines against 590, not 737. The worker's report has the same error (its Counts table and the line "737 added lines against 590").
- Replacement for the PR body's bullet "Over a ceiling, for the closing amendment (class 8): …":
  > Over a ceiling, for the closing amendment (class 8), counted in both numstat columns as Amendment 33 item 3 counts P1b's: `session_history.rs` 356 (340 added, 16 deleted) against 260; `project_reopen.rs` 397 (397 added) against 330; P2 753 lines in 2 files against 590 and 2. By Amendment 31 item 4's table the §2.11 groups hold: kernel product 1,281 of 1,400, kernel tests 1,137 of 1,300, protocol 0.
- Clause check:
  - 340/16 and 397/0 come from `git diff --numstat B...H` (my g332r-count.txt, rc 0).
  - 340+16 = 356 and 356+397 = 753.
  - 925+356 = 1,281 and 740+397 = 1,137, using the table's "After Amendment 30" column.
  - There are two files, by `--name-only`.

**D2. The PR body does not name the seam tests or the later consumers.**
- Amendment 31 item 6's last bullet says the producer, its consumer and the seam's end-to-end tests "are named in P2's PR body and in the node's plan summary".
- The plan summary on main names them (`governance/PLAN.yaml` at origin/main, the node's summary).
- The PR body names only `Projects::open_project`.
- Add this bullet under Summary:
  > Pre-committed producer (ADV-2026-11-16-10 R2; the form's Amendment 31 item 6): its consumer is `Projects::open_project`'s step 6 (P3a), which gives `opened.lineage` on the wire (P3b) and S16 and S17 in the shell (P4). The seam's end-to-end tests, by working name: `a_saved_project_whose_member_records_a_lineage_reopens_with_its_lineage_named` (a K-O1 case in P3a); the P3b wire fixture `v0-open_project-opened-lineage`; P4's shell test `a reopened project's lineage facts map to S16 and S17`. The node is not done until each has passed on main (R2 (c)).
- Clause check: each name and consumer was read against Amendment 31 item 6's table and its second and third bullets, on origin/main's form.

### Observations (for the advisor or for P3a; none is wrong under Amendment 31)

**O1. Coverage: arm 2's `steps` check is untested.**
- My probe removed `Some(lines.len()) == count &&` (`kernel/src/session_history.rs:1730` at H), and all 8 `project_reopen` tests passed.
- ADR-036 Amendment 1 item 2, arm 2, requires both sha256 and `steps`. The code checks both; no test catches the count.
- Fix: a member with the previous file's sha256 but another `steps` should give `PreviousLineage::NotTheRecordedOne`. Add it as a case in P3a's K-O1 or as a later row.

**O2. Error encoding.**
- An I/O error other than not-found is `Damaged { line: 0 }` (`kernel/src/session_history.rs:1742-1747` at H). This follows `recover`'s line-0 convention (`Failure`'s doc, `kernel/src/session_history.rs:861` at H). Item 3 allows it ("any other check is Damaged").
- The Display text is accurate ("it could not be read: …").
- The name "Damaged" fits badly for a file that is only locked or not permitted. That is for P3b's closed set of facts (R1 (e)).
- `OverBound { line: Option<usize>, limit }` names the bound as C1 asks. Both are right.

**O3. A not-kept member.**
- `symlink_metadata` with an error other than NotFound gives `NotRead` (`kernel/src/session_history.rs:1697-1703` at H). Its Display (`:1660`) then says the file "is from a different save" without having shown that it is present.
- The two arms also treat a dangling link differently: `symlink_metadata` gives `NotRead` under not-kept, while `File::open` gives `Absent` under kept.
- Both are edge cases for P3a.

**O4. "Not opened" in two doc comments** (`kernel/src/session_history.rs:1613` and `:1686` at H).
- My reading of std is that `symlink_metadata` on Windows takes a zero-access handle to read the file's attributes. I could not confirm this here: rust-src is not installed.
- No data is read and no lock is taken either way.
- If the advisor wants exact words: "its contents were not read" and "only the folder file's presence is asked; its contents are not read".

**O5. `Damaged.rule` carries the Debug form of `RefParseError`.**
- This comes from `dataset_ref.rs`'s existing `error_shown_as_its_debug_form` macro, shared with `recover`.
- My K-L5 run shows it: `rule: "Malformed { path: \"$\", detail: \"the line does not end in LF: a torn write\" }"`.
- P3b and P4 should map it to their own words, not show it raw.

**O6. Blocking path (docs/01 principle 7).** `read_lineage` reads and parses up to 32 MiB synchronously, with no cancel. There is no product caller yet. P3a's amendment should place step 6 relative to the open's `cancel_key`.

**O7. L1's control assertion and L4's extra case.**
- L1's control is needed: with the hash guard removed, the positive case alone still reads `Recorded`, so the declared mutation could not be observed. My L1 run confirms the control fails.
- L4's extra case (a not-kept member with no file gives `Absent`) is correct by item 3.
- Both add assertions beyond item 5's Asserts column, before the code. The worker disclosed both in the report and in the commit message. P2's closing amendment should record them as class 1 disclosures.

**O8. A private `Framing` enum and two `From` impls** (`kernel/src/session_history.rs:1356-1374` at H).
- They are not named in item 2, which names "one private function". They are private, and they carry `OverBound` out of the shared framing.
- `read_line`'s texts are unchanged byte for byte: the removed diff lines 70-84 equal the added framing lines 97-111, and the over-ceiling text comes back through `From<Framing>`.

**O9. Mutation readings.**
- L4b reads "the not-kept check removed" as the presence check removed. That is a reasonable reading.
- K-L5's mutation removes both size checks at once, because they are one closure. Removing only the metadata check would be caught by the post-read check, which is redundant by design.

**O10. Nit.** K-L5 leaves a 33,554,433-byte file in the temp folder after each run.

## The checks

**1. Start.**
- `<W>` HEAD is eeebe0977d71753fbeeaa8ffa288d6fe4997e2fb and the porcelain is 0 bytes.
- `ls-remote` gives H (rc 0). The fetch rc was 0.
- `df` at the start: C: 48G free, D: 369G free. No stop applied.
- origin/main is 4a267c0d7bb7aa9dde38012bf9169b9ae8d1f2ab, and the merge base is e567072f8f15d53fa65cc55842e2e15a071da30a.

**2. The diff.**
- `--numstat B...H` (rc 0): `340 16 kernel/src/session_history.rs` and `397 0 kernel/tests/project_reopen.rs`. `--name-only` lists the same two files.
- There are two commits: 3db87301 (the test file only) and eeebe097 (the product file only). `git diff --exit-code 3db87301 eeebe097 -- kernel/tests/project_reopen.rs` gives rc 0, so the tests are unchanged since before the code.
- Both files are on Amendment 31 item 7's list.
- No wire byte, protocol line, fixture, shown string, lockfile or `Cargo.toml` changes: only these two files are in the diff.
- `git diff --name-only B origin/main -- <the two paths>` is empty (rc 0, 0 bytes).
- Main changed `kernel/src/project/{mod,store}.rs` and `kernel/tests/{project_lock_crash,project_save,project_store}.rs` since B. The diff uses none of them. `project::file::Lineage` (`kernel/src/project/file.rs:75-78` at H) is not in main's changes.
- The seam is read from the consuming type. `Lineage::Kept { sha256: String, steps: u64 }` is parsed as `sha256:` plus 64 lowercase hex characters (file.rs's `lineage`). `sha256_hex` returns `format!("sha256:{:x}", …)` (`renderer/src/canonical.rs:163-168`). The reader's comparison at `kernel/src/session_history.rs:1709` at H therefore compares the same form.

**3. §2.11's command** over B...H, with its excludes: rc 0, the same two rows.
- Columns: see D1. Corrected rows:
  - `session_history.rs` 356 against 260, over by 96;
  - `project_reopen.rs` 397 against 330, over by 67;
  - P2 753 against 590.
- Over: both of P2's rows in Amendment 31 item 4. No §2.11 group is over.
- These are class 8 in P2's closing amendment; neither §2.11 nor §7 is edited.

**4. The change against Amendment 31.**
- **Regions.**
  - New shapes `LINEAGE_HEADER`, `COMPLETENESS`, `STARTS`, `KINDS` and `WITHHELD_LINE` (`:1061-1095`), matching ADR-036 §6 and §8.
  - `MAX_LINEAGE_FILE_BYTES` = 33_554_432 (`:1593`).
  - `read_line` now only calls `framed` (`:1275`).
  - `check_header` now calls `dataset_entries` (`:1547-1558`).
  - The reader section (`:1588-1836`).
  - No hunk touches `in_writers_form`, `check_step`, `in_order`, `spelled`, `recover`, `recover_bytes`, `HEADER`, `MARK_LINE` or any writer item. The writer's `check_header` caller at `:596` behaves as before. There are no inline tests.
- **`pub` items.** The diff adds `pub struct LineageRead` (its fields `folder_file`, `previous_file` and `lineage` are pub), `pub enum FolderLineage`, `pub enum PreviousLineage`, `pub enum LineageRefused` and `pub fn read_lineage`. That is exactly item 6's list; nothing else is pub.
- **Caller grep.** The five items are referenced only in `kernel/tests/project_reopen.rs`. There is no product caller, which item 6's pre-commitment allows: the consumer is named in item 6, in the plan summary on main, and in each doc comment.
- **The reader's rule, clause by clause** (at H):
  - *Handles.* `File::open` is called only in `lineage_file` (`:1746`), and the handle drops when it returns. Nothing writes, truncates, renames or locks.
  - *Whole-file check.* First the size by metadata (`:1755`), then a read bounded at the bound plus 1 (`:1760`) and a re-check (`:1763`). Each line goes through `framed` with the header ceiling for line 1 and the step ceiling after (`:1773`). Line 1 is checked against `LINEAGE_HEADER` with `dataset_entries`, `in_order` and `spelled`. Later lines are checked as a step (`check_step` and `in_writers_form`) or as a withheld line (shape, order and spelling), chained by `parent` (`:1829-1834`). A mark line is refused (`:1816-1821`). An empty file is `Damaged` at line 1 (`:1785-1788`).
  - *Refusal.* A file or line over its bound is `OverBound` (`:1757`, `:1774`). Anything else is `Damaged` with the line and the rule. The first failure returns `Err` (`line?`, `:1783`), so no prefix is used.
  - *Not-kept.* Presence only, by `symlink_metadata` (`:1697`): `Absent` or `NotRead`, with `previous_file` `None` and `lineage` `None`.
  - *Arm 1.* The count is `steps`+1 and the hash is over `lines[..n]`, each line with its LF (`:1706-1724`): `Recorded`, or `RecordedWithLinesAfter`, with the lineage truncated to n lines. `previous_file` is `None`.
  - *Arm 2.* The whole file's lines must equal `count` and their hash must match (`:1730`): `Used`.
  - *Arm 3.* `lineage` is `None` (`:1735`).
- **Display texts** (`:1642-1682`). Each states an engine fact: what the reader found, and "not read" where it read nothing. None states a consequence. None reaches a user at H, since there is no product caller and nothing on the wire. Edge cases are in O3 and O5.

**5. Tests and predictions.**
- All eight ids stand at H in `kernel/tests/project_reopen.rs`, with the declared names:
  - L1 at :145, L2 at :169, L3 at :189, L4 at :220;
  - K-L5 at :254, K-L6 at :292, K-L7 at :319, K-L8 at :376.
- Each asserts what item 5's row says, plus O7's additions. The K-L5 line case: the line body is 262,145 bytes, giving `OverBound { line: Some(2), limit: 262_144 }`.
- P-base was checked by the worker's logs and was not reproduced: I had no doubt.
  - `<S>`/1cp2-base-rc.txt: head 3db8730111e0c5c041cd7425825a51a1a3ecabc1, `four rc=101`, `three rc=0`, `lib rc=0`.
  - 1cp2-base-four.log:227 is the E0432 naming `read_lineage`, `FolderLineage`, `LineageRead`, `LineageRefused` and `PreviousLineage`.
  - 1cp2-base-three.log has 2, 13 and 1 passed; 1cp2-base-lib.log has 11 passed.
  - CI run 43825113674 at 3db87301 fails with the same E0432 (its failed log, lines 384, 801 and 1224).
  - K-L8 could not run at base because it is in the same target. It is exempt by name.
- I did not create `C:/dev/wt/1c-p2-g332r`.

**6. Mutations.**
- My list (L1, L2, L3, L4a, L4b, K-L5, K-L6, K-L7, K-L8) matches item 5 and `<S>`/1cp2-mutations.mjs. My edits are the worker's edits, byte for byte.
- Each was applied alone by one anchored `node -e`, which refuses unless each anchor occurs exactly once. Each was run by `cargo test -p spatial-kernel --test project_reopen <name>`, each in its own hold.
- After each revert by `git -C <W> checkout -- kernel/src/session_history.rs`, `git -C <W> diff` was empty (0 bytes) and the file's sha256 was 0bd2ead343cf30f95ebb6edf6d83a59b5b8b8d253f0e16a8ba0a7f984d1556a0, equal to `git show H:kernel/src/session_history.rs`.

| Id | Edit | Failing test, panic line (byte-copied) | At its own assertion |
|---|---|---|---|
| L1 | `Some(n) if is_member(&lines[..n]) => {` → `Some(n) => {` | `a_lineage_file_whose_recorded_prefix_matches_the_member_is_the_projects_lineage` — `panicked at kernel\tests\project_reopen.rs:160:5:`, `left: (Recorded, Some([…` / ` right: (NotTheRecordedOne, None)` | yes, the control |
| L2 | `is_member(&lines[..n])` → `is_member(&lines[..])` | `lines_after_the_recorded_prefix_are_named_and_not_read_as_the_projects` — `panicked at kernel\tests\project_reopen.rs:183:5:`, `left: LineageRead { folder_file: NotTheRecordedOne, previous_file: Some(Absent), lineage: None }` | yes |
| L3 | the `Ok(Some(lines)) if Some(lines.len()) == count && is_member(&lines) => { return read(folder, Some(PreviousLineage::Used), Some(lines)); }` arm deleted | `a_previous_lineage_matching_the_member_is_used_and_the_folders_file_named` — `panicked at kernel\tests\project_reopen.rs:212:9:`, `assertion `left == right` failed: l3-other` | yes |
| L4a | `read(folder, Some(previous), None)` → `read(folder, Some(previous), lineage_file(folder_file).ok().flatten())` | `a_lineage_file_from_a_different_save_is_named_and_not_read_as_the_projects` — `panicked at kernel\tests\project_reopen.rs:229:5:`, left `lineage: Some([…` / right `lineage: None` | yes, the first assertion |
| L4b | `let fact = if absent {…NotRead};` → `let fact = FolderLineage::Absent;` | same test — `panicked at kernel\tests\project_reopen.rs:247:5:`, `left: LineageRead { folder_file: Absent, previous_file: None, lineage: None }` / `right: … NotRead …` | yes, the last assertion |
| K-L5 | `let over = \|n: u64\| n > MAX_LINEAGE_FILE_BYTES;` → `let over = \|_: u64\| false;` | `a_lineage_file_over_its_bounds_is_named_and_not_read` — `panicked at kernel\tests\project_reopen.rs:269:5:`, `left: LineageRead { folder_file: Refused(Damaged { line: 5, rule: "Malformed { path: \"$\", detail: \"the line does not end in LF: a torn write\" }" }), …` | yes |
| K-L6 | `lines.push(line?.to_string());` → `match line { Err(LineageRefused::Damaged { .. }) => break, line => lines.push(line?.to_string()), }` | `a_torn_lineage_file_is_named_and_never_cut_back` — `panicked at kernel\tests\project_reopen.rs:306:9:`, `k-l6-torn: LineageRead { folder_file: Recorded, previous_file: None, lineage: Some([…` | yes |
| K-L7 | the mark arm's `return Err(malformed("$.mark", "a mark line is in a session history only",))` → `return Ok(())` | `a_lineage_header_and_withheld_lines_are_read_in_their_shape_and_a_mark_line_is_refused` — `panicked at kernel\tests\project_reopen.rs:354:22:`, `k-l7-mark: RecordedWithLinesAfter` | yes, its `panic!` arm |
| K-L8 | `read_line`: `check_header(&v)?` → `check_header(&v).or_else(\|_\| { check(&v, "$", &LINEAGE_HEADER)?; dataset_entries(&v) })?`, and `(false, Some("withheld")) => {}` added before `_ =>` | `the_session_history_reader_still_refuses_a_withheld_line_and_a_lineage_header` — `panicked at kernel\tests\project_reopen.rs:382:5:` (left keeps the withheld line) | yes |
| probe | `if Some(lines.len()) == count && is_member(&lines)` → `if is_member(&lines)` | the whole target: `test result: ok. 8 passed; 0 failed` | survives: O1 |

- Every listed mutation fails its own test where its doc comment predicts. None passes and none fails elsewhere.
- L4b's build also gave `warning: unused variable: `absent``. That is expected from the edit.

**7. The runs.**
- Reused (worker, at eeebe0977d71753fbeeaa8ffa288d6fe4997e2fb):
  - the four targets: `project_reopen` 8, `record_step_match` 2, `session_history` 13, `session_history_crash` 1 (`<S>`/1cp2-head-four.log, rc in 1cp2-head-rc.txt `four rc=0`);
  - `--lib session_history`, 11 passed (1cp2-head-lib.log, `lib rc=0`).
  - These rest on logs.
- `cargo fmt --check` rc 0 rests on the report's call: 1cp2-fmt-head.txt is empty and records no rc. CI's Rust fmt runs at H corroborate it (43833266020 and 44376141193, success).
- P-base at 3db87301 is reused (check 5). The worker's mutation observations at H are superseded by mine.
- Reproduced: none of the suites. I re-applied the nine mutations and one probe myself.
- Departure: my first L1 run (hold h1) failed in setup, not at the test: `LINK : fatal error LNK1104: cannot open file 'D:\wt-targets\1c-p2\g332r-tmp\lnk{…}.tmp'`. I had pointed TMP at a folder that did not exist yet. I created `D:/wt-targets/1c-p2/g332r-tmp` and ran L1 again (h2). That is the only L1 run that reached the test. No other run was repeated.

**8. Light runs** in `<W>`:
- `node scripts/plan/verify-test-claims.mjs`: rc 0, "verify:test-claims PASS — all 834 claimed test(s) across 271 file(s) …".
- `node scripts/plan/verify.mjs --offline`: rc 0, "verify:plan PASS".

**9. CI.**
- `gh pr checks 332` read at Wed Nov 18 19:13:04 UTC 2026 (rc 8, one pending) and again at 19:42:12 UTC (rc 0, 20 lines, all pass).
- Head sha per run, from `gh run view`:
  - On the pull request, at eeebe0977d71753fbeeaa8ffa288d6fe4997e2fb, all success: 44376141383 (Rust workspace), 44376141209 (Exposure scan), 44376141300 (Ported notices), 44376141343 (DCO sign-off), 44376141193 (Rust fmt), 44376141579 (shell), 44376141147 (Governance).
  - On push, at eeebe097, all success: 43833266020 (fmt), 43833265938 (ported notices), 43833265923 (Rust workspace), 43833266094 (shell), 43833266023 (Governance).
  - On push, at 3db8730111e0c5c041cd7425825a51a1a3ecabc1: 43825113671, 43825113708, 43825113704 and 43825113731 success. **43825113674 (Rust workspace) failure**: the one red run on the branch, which is P-base's predicted compile failure.
  - No run was cancelled.
- The pull_request runs were created at 2026-11-18T19:02:10Z, after P1b's merge commit 97e49d3c (committed 18:37:15Z). So by timing, the PR merge ref includes P1b.

**10. End.**
- `<W>` HEAD is H and the porcelain is 0 bytes.
- `df` at the end: C: 49G free, D: 367G free.
- No worktree was created.
- Left in place: `D:/wt-targets/1c-p2/g332r-tmp`, the tests' temp folder inside the build folder. It holds the K-L5 file of about 32 MiB.

## Holds

The times are `date -u` before each hold and after its release. Every hold and release line's `project=` and `also=`/`others=` values are masked as `<m>`. No exit code of 96, 97, 98 or 99 occurred. Fifteen `MACHINE_WAITING shared: turn of SpatialIDE held by pid <m>` lines appeared in h1 only.

| Hold | What it covered | Start | End |
|---|---|---|---|
| h1 | L1, setup failure | 19:12:56Z | 19:28:34Z (waited about 15 min) |
| h2 | L1 | 19:29:30Z | 19:29:53Z |
| h3 | L2 | 19:30:52Z | 19:31:16Z |
| h4 | L3 | 19:32:01Z | 19:32:25Z |
| h5 | L4a | 19:32:59Z | 19:33:25Z |
| h6 | L4b | 19:34:22Z | 19:34:49Z |
| h7 | K-L5 | 19:35:19Z | 19:35:53Z |
| h8 | K-L6 | 19:36:46Z | 19:37:27Z |
| h9 | K-L7 | 19:38:10Z | 19:38:47Z |
| h10 | K-L8 | 19:39:18Z | 19:39:55Z |
| h11 | probe | 19:40:30Z | 19:41:03Z |

## Drafts for the advisor
- No wording reaches a user at H, so there is no draft for a shown string.
- For P3b's closed set of facts (R1 (e)): whether an unreadable file (an I/O error other than not-found) stays `Damaged { line: 0 }` or becomes a fact of its own (O2), and how `Damaged.rule`'s Debug-form text is shown, if at all (O5).
- For P3a's amendment: a case for arm 2's `steps` check (O1); step 6's place relative to the open's `cancel_key` (O6); the not-kept error and link edges (O3).
- Optional comment words for O4, if the advisor wants them exact: "its contents were not read" at `kernel/src/session_history.rs:1613` at H, and "only the folder file's presence is asked; its contents are not read" at `:1686` at H.

## Background shells
None are running. All eleven hold calls and four wait loops completed, and `tasklist` shows no cargo process.

## Model
Opus 5.5 (claude-opus-5-5).

Files:
- My scratch logs are in `<S>`, named `g332r-*`: g332r-mut-*.log, g332r-probe-P1.log, g332r-rev-*.txt, g332r-h*-*.txt, g332r-count.txt, g332r-runview.txt, g332r-vtc.txt and g332r-verify.txt.
- The worker's evidence is in `<S>`: p2-worker-report.md and the 1cp2-* files.
- C:/dev/wt/1c-p2/kernel/src/session_history.rs
- C:/dev/wt/1c-p2/kernel/tests/project_reopen.rs
