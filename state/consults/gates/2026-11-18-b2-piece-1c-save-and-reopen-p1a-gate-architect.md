Reviewed: PR #333 at 7e76347271780d20103bb3b4b36b8650a0967456 (the custodian's filing note, 2026-11-18: the architect, one of PR 333's two gates under its form's Amendment 30 item 5 (f); Read 21, Grep 22, Glob 4, one errored, model claude-opus-5-5, from 2026-11-18T21:26:13Z to 21:33:25Z; the report below byte for byte from its hand-back of 10877 bytes, sha256 9e2ae5f62493d7ed4de64a9d3ddc322dcc36ed0dc1f28785f47633638b4e10c5, with this note in its first line and one final newline), gate, architect
cut/b2-piece-1c-p1a @ 7e76347271780d20103bb3b4b36b8650a0967456

Verdict: PASS WITH NOTES

Gaps in my reads: the PR body (so I cannot confirm 5 (d)'s naming there); the bodies of both commit messages (I read only their subjects, in the worker report); CI at H; the reviewer's runs; the P-base logs (I read the head logs, the mutation script, its summary and the panic lines of M1 to M5); std's Windows source (rust-src is not installed in a place I could read); C-7's source consult; O0's evidence for H1; ADR-036 beyond its locators and containment paragraphs. The main checkout's form had a staged change at the session's start, so I cite the form by section, amendment and item, never by line.

## Findings

**Correctness:** none.

**Evidence:** none.

**Documentation (must be fixed before the merge, no re-gate; not the human's wording, so the worker applies the words and the PR body lists them):**
- **D1.** `kernel/src/project/resolver.rs:153-154 at H` says a cloud placeholder "is a regular file here and opens (H1)". `check_inside` opens nothing, and line 157 at H says so two lines later. Taken as a statement about `check_inside`, "opens" is untrue. Replacement words are under Drafts, D1.

**Observations (for the advisor or P3a; none of them is wrong at H):**
- **O1, `FolderUnresolvable`** (`resolver.rs:132-133, 166 at H`). This is the worker's choice; item 5 (a) does not settle it. A failed `canonicalize` has to return something, so the variant is a necessary path and not an option. Two things are open:
  - No test at H reaches it. It appears only under M5 (in `<S>`'s M5 log, `data/NUL.parquet: Err(FolderUnresolvable)`).
  - ADV-2026-11-16-10 item 1 (e) lists no wire code for it.
  - For the advisor with P3a's and P3b's packet: name its code, and have P3a's amendment declare a case for it.
- **O2, `NotCanonical` carries the path `"$"`** (`resolver.rs:165 at H`). By `dataset_ref.rs:172-173 at H`, `$` means the entry, not the locator's `at`. At reopen the `at` has already passed `in_canonical_form` inside `DatasetRef::parse` (`dataset_ref.rs:559-560 at H`). So through P3a's data step this variant is reachable only for an `at` that did not come from a parsed reference. 5 (d)'s K-R3 asserts `project_file_refused` "at the locator's `at`", so P3a has to supply that path itself and must not forward `"$"`.
- **O3, `Unresolvable` is wider than "missing".** It covers any metadata error, including access denied (`resolver.rs:173 at H`). Its doc says so (line 137), and it matches ADR-036's containment wording, "a target that cannot be resolved". This is a choice item 5 does not settle, and it is not wrong.
- **O4, the escape case is not built.** No test builds a link to a regular file as the final segment. At H that case is refused twice:
  - by the link check (line 175);
  - with the link check removed, by the kind check, because std's `is_file` is false for a link. M1's log shows the same thing for a junction: `NotADirectory`.
  - The case can be built off Windows with no privilege. Recommend P3a's K-R1 include it. Windows `mklink /D` symlinks and file symlinks are also not built, since they need privilege.
- **O5, "No file is opened"** (`resolver.rs:157 at H`, and `kernel/tests/project_resolver.rs:8 at H`). This rests on my reading of std, which I did not read in this transcript: on Windows, `symlink_metadata` and `canonicalize` each open a handle with no access rights inside the call. Only an instrumented trace would see that. Under AUTONOMY §31 it does not block. The reviewer, who has a shell, can confirm it. If it is confirmed, apply Drafts, O5-words as a Documentation fix. Those words hold under either reading.
- **O6, the race.** Between the check and P3a's open, and between two segments of the check, anything can change what the path names. Nothing in P1a can close that. Who owns it is settled:
  - ADR-036's containment paragraph leaves "the rest" to piece 1c's form.
  - §2.5's "The window, declared" names both windows and claims the check only.
  - §2.4 step 4 hands the engine the returned path.
  - The doc at `resolver.rs:157-158 at H` matches all three.
- **O7, H4 is still a hypothesis.** It is discriminated by K-O1 in P3a. T4 asserts the `\\?\` form, not that the engine reads it. If H4 fails, P3a changes what `check_inside` returns.
- **O8, no segment-count bound.** `check_inside` does not bound the number of segments. `at` is bounded at parse by `MAX_REF_STRING_BYTES` (`dataset_ref.rs:556 at H`), so this holds while P3a passes parsed `at`s only.
- **O9, regions beside 5 (a)'s named items.** The module-doc paragraph (`resolver.rs:17-19 at H`) and the widened import (line 24) are in the same file. I read them as part of 5 (a)'s items, as Amendment 33 item 3 read P1b's import.
- **O10, readiness.** Part 1 item 4 (2026-11-05) dispatches a gate after the full suite has passed at the reviewed head. Amendment 30 item 5 (f) and ADV-2026-11-16-16 item 1 (b) leave the full suites to CI. I did not read CI at H. If no full-suite run at H had passed before this dispatch, that is a conflict between the two for the advisor. CI green remains a condition of the merge either way.

## Checks

1. **Design, against 5 (a) and (d): holds.**
   - The diff adds two `pub` items: `check_inside` (`resolver.rs:164 at H`) and `CheckRefused` (line 129). Its variants are part of the pre-committed error type and are not new items.
   - `in_canonical_form` becomes `pub(crate)` (`dataset_ref.rs:593 at H`), and nothing else changes in that file.
   - `judge` and `reached_through_link` (lines 66-122 at H) are unchanged. There is no wire code.
   - Grep for callers: `check_inside` and `CheckRefused` appear only in `kernel/src/project/resolver.rs` and `kernel/tests/project_resolver.rs`, with none in `protocol/` or `frontends/shell/src-tauri/src`. There is no product caller, as pre-committed (ADV-2026-11-16-10 item 2 (a) and (d)).
   - Both files are in docs/02's `kernel` module, so no boundary is crossed.
   - The diff reads `super::file::MAX_LOCATOR_SEGMENTS` (already there) and `crate::dataset_ref`, nothing P1b changed. `pub mod resolver` is the same at H and on main (`kernel/src/project/mod.rs:25`).
   - The counts are 98 lines of kernel product against a ceiling of 135, 145 lines of tests against 200, and 243 lines in 3 files in all.
2. **The walk: holds, clause by clause.**
   - The text check comes first (line 165), before `canonicalize` (166). T5 proves this order: with an absent folder, any other order gives `FolderUnresolvable`.
   - Each segment is read by `symlink_metadata` only (171). No `File` is created.
   - A link is refused (175-177), and the link check comes before the kind checks.
   - A missing segment is refused as `Unresolvable` (173).
   - A non-folder intermediate is refused (182-184), and so is a non-regular final (179-181), each naming the segment.
   - Otherwise the function returns canonical F joined with the segments, which on Windows is in the `\\?\` form because of `canonicalize`. `\` and `:` are refused by the text check (`dataset_ref.rs:608 at H`), so no segment can carry a prefix or a stream, and `push` cannot replace F.
   - A cloud placeholder: std reports it as a file (H1), so it passes. This is untested, as declared.
   - What P3a is handed: `Ok(PathBuf)`, or a variant with `at`'s own spelling of the refused segment.
   - The race and the worker's choices are under O1 to O3 and O6.
3. **Platforms: holds.**
   - Product code has no platform `cfg`; only `#[cfg(test)]` (line 189).
   - The link maker's `cfg` is test code only (`project_resolver.rs:31-46 at H`). It is identical to `kernel/tests/project_save.rs:369-384 at H`, which ADV-2026-11-16-18 item 3 asks the gates to check.
   - T4 checks the operating system at run time (`project_resolver.rs:142-144 at H`).
   - On Windows, T1 covers a junction to a folder, as an intermediate and as the final. Only CI off Windows covers the POSIX symlink.
4. **Messages: holds.** `CheckRefused` has no `Display`. The `RefParseError` it wraps is shown as its Debug form (`dataset_ref.rs:183-193 at H`). Nothing reaches a user before P4, since there is no product caller.
5. **Tests: holds.**
   - Each assertion fails when its claim is false. M1 to M5 each failed at an assertion panic (the panic lines in `<S>`'s M1 to M5 logs, at H).
   - The mutation script's replacements are exactly the changes they are named for (`<S>/p1a-mutations.mjs`, its `mutations` array). M5's panic at line 206 is line 207 shifted up by the removed line.
   - Clauses no test covers: "opens no file" (see O5), and the link to a file as the final (O4). `FolderUnresolvable` (O1) is not a clause of 5 (a).
6. **Producer doc comments: hold, apart from D1.** Lines 160-163 name the consumer, `Projects::open_project`'s data step in P3a, and the seam tests K-R1, K-R2, K-R4, the K-R3 restatement and E-REOPEN, as 5 (d) does. PLAN.yaml's node summary names the same tests. `CheckRefused`'s doc (line 127) points to them.
7. **Discharge claims and verbatim quotes: none found.** The comments the diff adds hold no quotation and no "done" claim, and every cite I checked resolves:
   - item 5 (d);
   - ADV-2026-11-16-10 R2 (its item 2);
   - ADV-2026-11-16-18;
   - H1 and H4 (§0.4);
   - §2.5's window.
   - I did not read the commit-message bodies.

## Drafts

**D1** (`kernel/src/project/resolver.rs:153-154 at H`; a doc comment, not the human's wording). Replace "A cloud placeholder is not a name surrogate, so it is a regular file here and opens (H1)." with:
"A cloud placeholder is not a name surrogate, so it is a regular file here and passes the check (H1)."
Clause check:
- "not a name surrogate": this is H1 (§0.4).
- "a regular file here": line 172 reads `m.is_file()`, which H1 says std reports as true for a placeholder.
- "passes the check": `link` is false, so line 175 does not fire. `file` is true at the last segment, so line 179 does not fire. The function then returns `Ok` at line 186.

**O5-words** (conditional on the reviewer confirming O5; `resolver.rs:157 at H` and `project_resolver.rs:8 at H`). At line 157, replace "No file is opened and no handle is held." with:
"No file's contents are read, and no handle is held once the call returns."
At `project_resolver.rs:8 at H`, replace "the check opens no file" with "the check reads no file's contents".
Clause check:
- Lines 165-186 call only `in_canonical_form`, `std::fs::canonicalize` and `std::fs::symlink_metadata`. None of them reads a file's contents.
- No `File` is created, and the return type is `Result<PathBuf, CheckRefused>`, so nothing that holds a handle outlives the call.

For the advisor (no wording; these are rulings): O1's wire code for `FolderUnresolvable`, with P3a's and P3b's packet; O10, if CI at H had not passed before the dispatch.
