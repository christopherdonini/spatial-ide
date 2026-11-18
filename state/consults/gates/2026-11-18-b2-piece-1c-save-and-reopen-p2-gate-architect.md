Reviewed: PR #332 at eeebe0977d71753fbeeaa8ffa288d6fe4997e2fb (the custodian's filing note, 2026-11-18: the architect, one of PR 332's two gates under its form's Amendment 31 item 9; Read 20, Grep 21, Glob 1, none errored, model claude-opus-5-5, from 2026-11-18T19:22:36Z to 19:29:33Z; the report below byte for byte from its hand-back of 15363 bytes, sha256 a56c80e89c088ab6c4c42b35d79e0d66e2f3c4756793289598cb7af976d0e486, with this note in its first line and one final newline), gate, architect
Branch reviewed: cut/b2-piece-1c-p2 @ eeebe0977d71753fbeeaa8ffa288d6fe4997e2fb (merge base B = e567072f8f15d53fa65cc55842e2e15a071da30a). I read the files in the read-only checkout made at H. I have no shell, so I could not check the brief's sha256 (24dc88c1…2353) or the two locator hashes.

Verdict: PASS WITH NOTES

There are no Correctness or Evidence findings. There is one Documentation finding (D1), which must be fixed before the merge, and there are record items for the closing amendment (D2).

Gaps in my reads:
- **Commit messages:** I read only their subjects, as the worker report gives them. I did not read their bodies, so the claim that the message explains L1's control is unread.
- **Not read:** the PR body; the run and mutation logs (`<S>/1cp2-*`); docs/02; the text of the form's §2.10 item D; the form's §2.11 tables after step 2's e2e row.
- **Annex A items 2 and 4:** I read only their opening lines. I read their bodies in ADR-036 Amendment 1 items 2 and 4, which those opening lines match.
- **Main's `session_history.rs`:** I did not compare it with B. I rely on the locator and on the diff.
- **Rust's Windows `symlink_metadata`:** what I say about it (D1) comes from my knowledge of the standard library. I did not read its source.
- **The test file between the two commits:** I did not see whether eeebe097 touched `kernel/tests/project_reopen.rs`.

## Findings

**Correctness:** none.

**Evidence:** none. The worker's mutation runs are evidence only. The reviewer's gate makes each mutation again (§9).

**Documentation (must fix before the merge; worker's words, not the human's; applied with no re-gate, and listed in the PR body):**
- **D1.** Two doc comments say a not-kept member's file "is not opened":
  - the `read_lineage` doc, `kernel/src/session_history.rs:1686 at H`;
  - the doc on `FolderLineage::NotRead`, `kernel/src/session_history.rs:1613 at H`.

  The branch calls `std::fs::symlink_metadata` (`kernel/src/session_history.rs:1697 at H`). On Windows, the standard library answers that call by opening a handle with no access rights. So "not opened" says more than the code holds, and "not read" says exactly what it holds. The words to use are under Drafts below.
- **D2 (record items for P2's closing amendment, before the merge request):**
  - **Class 8:** `session_history.rs` is 340 lines against its ceiling of 260, and `project_reopen.rs` is 397 against 330. §2.11 and §7 are not edited (Amendment 31 item 4).
  - **Class 1 departures:** L1's control assertion and L4's extra not-kept, no-file case, both beyond item 5's rows (check 5).
  - **The form's "never opened"** (Amendment 31 item 3, Member `not-kept`): the closing amendment records "never read" as what the code holds (D1). The amendment itself stays as it is ("Nothing above is edited").

**Observations (for the advisor or P3a; none blocks):**
- **O1, I/O errors.** An I/O error other than not-found is `Damaged { line: 0 }` (`kernel/src/session_history.rs:1742-1748, 1755, 1762 at H`). This follows `recover`'s line-0 convention, `kernel/src/session_history.rs:861 at H`. Item 3 does not settle it.
- **O2, `OverBound`'s line.** `OverBound` carries `line: Option<usize>`, where `None` means the file's own bound (`kernel/src/session_history.rs:1637 at H`). Item 3 does not settle it, and C1's "naming the bound" is met.
- **O3, order of the checks.** The whole-file check runs line by line: each line is framed, then checked for its shape, before the next line is read (`kernel/src/session_history.rs:1768-1784 at H`). So a file whose line 2 breaks a shape rule and whose line 5 is over its ceiling is refused as `Damaged` at line 2, not as `OverBound`. Item 3 does not settle which refusal wins.
- **O4, presence for a not-kept member.** Any metadata error other than not-found reads as present. The file is then `NotRead`, whose `Display` says "the folder's lineage file is from a different save" when no file may exist (`kernel/src/session_history.rs:1697-1702, 1660 at H`). For P4's wording.
- **O5, links in the project folder.** For a kept member, `File::open` follows a link named as the lineage file. For a not-kept member, `symlink_metadata` does not follow it. Item 3 does not settle this. §8 item 2 ("A link followed") is scoped to project-relative targets, but P3a owns the paths it passes in and should decide whether a link in the folder is refused. Also, a `Damaged` rule text can echo up to 4,096 bytes of a string read from the file. Example: `check`'s `Word` error, `kernel/src/session_history.rs:1141 at H`.
- **O6, the lineage properties.** `kinds_not_recorded` accepts an empty list and duplicates. `withheld` is not checked against the number of withheld lines in the file (`kernel/src/session_history.rs:1073-1090 at H`). ADR-036 §8 does not settle either.
- **O7, message text.** `Damaged`'s `rule` is the `RefParseError` debug form (`Display` is its debug form, `kernel/src/dataset_ref.rs:183-185 at H`), as `recover` already reports. It is not fit for a user. P3b and P4 decide what reaches the wire and the shell.
- **O8, `Framing`.** The moved framing returns a new private `Framing` enum with two `From` impls (`kernel/src/session_history.rs:1356-1374 at H`). Item 2 names "one private function" only. They are private and inside the region, so this is not a finding.
- **O9, principle 7 and docs/08.** The reader takes no cancel key. It reads up to two files of 32 MiB each, and their parse, synchronously. It makes no performance claim, and P3a places the call.
- **O10, no `Display` test.** No test asserts any `Display` text. That is right while no user sees them.

## Checks

1. **Design against items 2, 6 and 7:** PASS.
   - **Regions.** Every hunk is inside item 2's regions:
     - the imports (`ErrorKind`, `Lineage`, `kernel/src/session_history.rs:22, 40 at H`);
     - the new shapes (`1059-1095`);
     - the framing move (`1275`, `1332-1374`);
     - `check_header` and `dataset_entries` (`1547-1558`);
     - the reader section (`1588-1836`).
   - **`read_line`** changes only by the call at `1275`.
   - **`check_header`** changes only by the split at `1547-1550`.
   - **Item 2's unchanged list** has no hunk.
   - **Inline tests:** none are added.
   - **`pub` items:** exactly item 6's five: `LineageRead` with its fields (`1602`), `FolderLineage` (`1611`), `PreviousLineage` (`1625`), `LineageRefused` (`1635`) and `read_lineage` (`1690`). Each doc names P3a's `Projects::open_project` step 6 and Amendment 31 item 6.
   - **Pre-commitment:** the pre-committed producer exemption applies (ADV-2026-11-16-10 item 2 (a) and (d)). The node's plan summary names the three seam tests (`governance/PLAN.yaml` on main, the node's summary). Their only callers are in `kernel/tests/project_reopen.rs`.
   - **Module boundaries:** none crossed. The only new imports are kernel-internal. `sha256_hex` was already imported (`kernel/src/session_history.rs:29 at H`), which also meets §8 item 14.
   - **P1b and main:** the diff reads nothing P1b changed. `project::file::Lineage` is identical at H (`kernel/src/project/file.rs:75-78 at H`) and on main (`kernel/src/project/file.rs:75-77` on main). Main's `project/mod.rs` still imports only `Reached`, `SavedHere` and `StepRecorder` from `session_history` (`kernel/src/project/mod.rs:44` on main), and the diff leaves all three alone. So H builds against main's tree in principle.
   - **Seam:** the reader uses `Lineage` as it is. `Kept.sha256` is checked to be `sha256:` and 64 lowercase hex characters (`kernel/src/project/file.rs:263-266 at H`). `sha256_hex` returns that same form (`renderer/src/canonical.rs:163-168 at H`). So the comparison at `kernel/src/session_history.rs:1709 at H` compares like with like.

2. **The reader's rule (item 3):** PASS.
   - **Handles.** There is one `File::open`, read only, at `1746`. The handle moves into `take` and is dropped when `lineage_file` returns. Nothing is written, truncated, renamed or locked. Rust opens files on Windows with full share modes, so the read locks nothing.
   - **Whole-file check.** In order:
     - the size by metadata (`1755`);
     - a read bounded at `MAX_LINEAGE_FILE_BYTES` + 1 (`1759-1761`), whose value is C1's 33,554,432 (`1593`);
     - the size checked again after the read (`1763`);
     - then per line: the framing (`1773`); the header in the lineage shape, its dataset entries, member order and spelling (`1800-1805`); each step through `check_step` and `in_writers_form` (`1806-1810`); each withheld line in its shape, order and spelling (`1811-1815`); a mark refused (`1816-1821`); the chain by `parent` (`1827-1834`).
   - **Refusal.** The first failure returns through `line?` (`1783`), so no prefix is used. Over a file bound or a line bound is `OverBound` (`1756`, `1764`, `1774-1777`). Every other failure is `Damaged` with its line and rule.
   - **Not-kept member.** It is `Absent` or `NotRead`, with `previous_file` `None` and `lineage` `None` (`1696-1704`).
   - **Arm 1.** It compares the hash of the first 1 + `steps` lines, each with its LF, against `sha256`. Those lines are byte-exact, since every line that passes has an LF and its text is unchanged. It returns `Recorded` or `RecordedWithLinesAfter` with the prefix only (`1714-1723`).
   - **Arm 2.** It compares the whole previous file's hash and line count with the member (`1730`), and keeps the folder's fact.
   - **Arm 3.** It returns both facts and `lineage` `None` (`1735`).
   - **What P3a is handed** is `LineageRead`.
   - **A torn file** (no final LF), or one with a damaged line appended after the prefix, is refused whole and falls to arm 2 (K-L6).
   - **A file cut at a line boundary** before the prefix fails the count or the hash and is `NotTheRecordedOne`.
   - **Valid lines appended** after the prefix give `RecordedWithLinesAfter`, with the prefix only (L2).
   - None of these can be read as the recorded lineage unless the hash matches. Choices item 3 does not settle are O1 to O6.

3. **Shared framing:** PASS. The outcome is identical at B and at H for every input.
   - **`framed`** (`1335-1352`) runs B's sequence and texts.
   - **The over-ceiling case** returns `Framing::Over`. Through `From<Framing> for RefParseError` (`1367-1373`) it becomes `malformed("$", "the line passes {ceiling} bytes")`, B's text.
   - **Every other failure** goes `RefParseError` → `Framing::Bad` → back unchanged.
   - **`check_header`** is `check(HEADER)` and then B's three lines, unchanged.
   - **The `record_step` writer check** (`reader_accepts`, `581-603`) reaches the moved code through `check_header` only (`596`), not through `framed`.
   - I found no input whose outcome differs.

4. **Messages:** PASS.
   - **Facts only.** Each `Display` text (`1642-1680`) states an engine fact: what the file is, or that the reader refused or did not read it. None states the shell's consequence.
   - **Reach.** None reaches a user before P4: nothing in the product calls `read_lineage` (grep across the `.rs` files at H).
   - **For P4:** O4 and O7.

5. **Tests against item 5:** PASS.
   - **Would each fail if its claim were false?**
     - **L1:** the control (`kernel/tests/project_reopen.rs:155-163 at H`) reads the folder file written by the first read, with the same count and another hash. It fails if the hash check is dropped.
     - **L2:** fails if the prefix is the whole file, or if it is not cut.
     - **L3:** fails if arm 2 is removed, in both cases.
     - **L4 (a):** the first assertion's `lineage: None` fails if arm 3 returns the folder's lines.
     - **L4 (b):** the `NotRead` assertion (`247`) fails.
     - **K-L5:** its mutation makes `over` always false, which removes both size checks. The file is then read and refused as `Damaged` at its torn last line of zero bytes, which is consistent with its comment. The line case asserts `OverBound { line: Some(2), limit: 262_144 }`.
     - **K-L6:** the prefix-keeping mutation gives `Recorded`. Bytes unchanged is asserted.
     - **K-L7:** the line and path are checked for each case. The mark mutation reaches the `panic!` arm. All four header forms pass.
     - **K-L8:** both `recover` refusals are asserted. It holds at main by design (item 5).
   - **Is each mutation what it says?** By the worker's descriptions, each is the change item 5 names. The reviewer makes them again.
   - **L1's control and L4's extra case** are right. L1's control is needed for the declared mutation to fail (stop 4). L4's case tests item 3's own clause. Both need a class 1 record (D2).
   - **Item 3 clauses with no test:**
     - the metadata pre-check alone (removing only it survives; the bounded read is what holds the bound);
     - the header-line `OverBound`;
     - `PreviousLineage::Refused`;
     - an I/O error giving `Damaged` at line 0;
     - an empty file;
     - a short file in arm 1;
     - a withheld line's member order and spelling;
     - "no handle held after return".

     None is required by item 5's rows.

6. **Class 8:** nothing in the 340 + 397 lines is outside the piece.
   - **What is over:** the `Display` impls that item 3 asks for (`1642-1680`), the private `Framing` (O8), and the test helpers (`kernel/tests/project_reopen.rs:18-140 at H`).
   - **The groups hold:** kernel product 925 + 340 = 1,265 of 1,400; kernel tests 740 + 397 = 1,137 of 1,300.
   - **The piece:** 737 lines, still under 800.
   - **Record:** class 8 goes in the closing amendment (D2).

7. **Discharge claims and verbatim quotes:** PASS, as far as I read.
   - **Comments:** the diff's comments carry no quotation marked as anyone's words and no "done" or "discharged" clause.
   - **Cites in the comments resolve:** ADR-036 §6, §8, §9; ADR-036 Amendment 1 items 2 and 6; ADV-2026-11-16-10 item 2 (R2); the form's Amendment 1 item 5 (C1) and Amendment 31 item 6.
   - **Expected-failure sentences:** each test's expected-failure sentence matches its code (check 5).
   - **Commit messages:** the bodies are unread (Gaps).

## Drafts for the advisor

No string here reaches a user, so P2 needs no user-facing draft. O4 and O7 are for P4's and P3b's declarations.

**The worker's words for D1** (not the human's wording; applied with no re-gate, and listed in the PR body):

- **`kernel/src/session_history.rs:1686 at H`.** Replace "For a `not-kept` member only the folder file's presence is asked; it is not opened." with:
  > For a `not-kept` member only the folder file's presence is asked, by its metadata; it is not read.
  - *"only the folder file's presence is asked":* the not-kept branch (`1696-1704`) calls only `std::fs::symlink_metadata(folder_file)` (`1697`). It never touches `previous_file`.
  - *"by its metadata":* that call reads metadata only.
  - *"it is not read":* the branch has no `File::open` or read, and returns `lineage` `None` (`1703`).
  - No dev-only or timing case is involved.
- **`kernel/src/session_history.rs:1613 at H`.** Replace "The project file records no lineage; the file was not opened." with:
  > The project file records no lineage; the file was not read.
  - *"The project file records no lineage":* `NotRead` is built only at `1701`, inside the `let … else` on `Lineage::Kept` (`1696`). The member there is `NotKept`.
  - *"the file was not read":* same branch, as above.
