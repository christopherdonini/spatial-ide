# The C1 piece's build, the worker's report

*Filed by the custodian, 2026-11-27. The build of text-id-reopen-with-a-recorded-declaration, made in D:/wt/c1rd from text-id's head 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e to 1a4b5bbe2d77352925238fd934c453cf9e0d0348. A sonnet worker (worker-high) made it, with no app, dev server or e2e suite started. Its run, from its completion notice only (ADV-2026-11-26-02), was 166 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (14772 bytes, sha256 6468b60c33793036edeab3cf6d4b14d6537e8dd84970232fa94ca6c50e415ab2), byte for byte. Its account is the worker's.*

---

**1a4b5bbe2d77352925238fd934c453cf9e0d0348 is pushed, and every step completed.** `origin/cut/text-id-reopen-with-a-recorded-declaration` equals HEAD, and no PR is open. One overrun: the §7 count is 903 changed lines against the ceiling of 900 (class 8, section 6). Under rule (00) I would not pass ADR-016 Amendment 3 Decision 1's closure on the e2e step alone, since E-R1 is written but not run.

## 2. Step 0 (base 2df8b4ae, all green)
- `cargo test --locked -p spatial-engine -p spatial-kernel -p spatial-skp`: rc=0, 1117 passed, 0 failed.
- `cargo fmt --all -- --check`: clean (the log is empty; I did not record an rc line).
- Shell `npm run typecheck` rc=0, `npm test` rc=0: 132 files, 1697 tests.
- `node --test` of the three globs: 623 pass, 0 fail.
- verify-cites, verify-quotes and verify-test-claims all PASS at the base.

## 3. Commits (both `git commit -s`; git config added the Signed-off-by trailer, I typed none and put no email in a message body)
- `2f44cb9e` feat: text-id-reopen-with-a-recorded-declaration's identity_source on identity_unusable, skp/0.17, and the shell's offer gate
- `1a4b5bbe` feat: text-id-reopen-with-a-recorded-declaration's e2e step TEXTID-C1 (written, not run)

## 4. New tests and their mutations
Each mutation was applied at HEAD `1a4b5bbe`, which is the last code commit, by `D:/wt/c1rd-logs/mutations.mjs` (log prefix `mut1`). Each replaced exactly one occurrence and was reverted by `git checkout -- <file>`. `git status --porcelain` was empty after each.

Every failure below is an assertion failure, not a compile or import error. Each log is `D:/wt/c1rd-logs/mut1-<id>.log`.

| Test | Mutation | Failed at |
|---|---|---|
| N-R1 `the_type_refusal_says_whether_id_was_declared` | M-RD1: `engine/src/dataset.rs` passes `&IdSource::File` to `admit_column_type` | `engine/tests/identity_refusal_names_its_source.rs:82`, left `"file:id"` right `"mapped:id"` |
| N-R2 `the_scan_refusals_say_whether_id_was_declared` | M-RD2: the duplicate arm in `dataset.rs` valued `IdSource::File.as_envelope_value()` | same file `:127`, left `("id","file:id")` right `("id","mapped:id")` |
| K-R1 `a_reopen_whose_project_file_records_a_declaration_of_id_names_it_mapped` | M-RD3: `kernel/src/skp.rs` writes `"file:id".to_string()` | `kernel/tests/text_id_reopen_recorded_declaration.rs:180`, left `Some("file:id")` right `Some("mapped:id")` |
| K-R2 `a_direct_open_names_the_source_of_the_refused_column` | M-RD4: `skp.rs` drops the `identity_source` pair line | same file `:229`, left `None` right `Some("file:id")` |
| W-R1 `identity_unusable_fixtures_carry_identity_source_at_skp_0_17` | M-RD6: `mod.rs` `SKP_VERSION` back to `skp/0.16` | `protocol/skp/tests/fixtures.rs:1066`, request fixture literal `skp/0.17` vs `skp/0.16` |
| S-R1 `a_reopen_refused_for_a_recorded_declaration_of_id_is_not_offered_row_position` | M-RD5: remove the check line in `AdmissionPanel.tsx` | `AdmissionPanel.test.ts:878`, "mapped:id: expected {...} to be null" |
| S-R2 `the_real_identity_unusable_fixtures_drive_the_offer` | M-RD7: read key `source` instead of `identity_source` | `fixtures.test.ts:537`, "file:id: expected null not to be null" |

- M-RD3 and M-RD4 each also failed the other kernel test. K-R1 failed at `:180` under M-RD4, with left `None` and right `Some("mapped:id")`.
- M-RD6 also failed `skp_version_is_skp_0_17` (`fixtures.rs:1024`, left `"skp/0.16"` right `"skp/0.17"`) and other fixture tests that compare to `SKP_VERSION`.
- E-R1's M-RD8 is not run, as briefed. It is the tester's at the port.
- `verify-mutation --base 2df8b4ae --head HEAD`: rc=0, "PASS — all 8 new test(s) have a recorded mutation naming them". The eighth is the renamed `skp_version_is_skp_0_17`.

## 5. The words (not committed; the files are untouched)

**(a) Walkthrough row.**
- File: `frontends/shell/MANUAL-WALKTHROUGH.md`. The AH7 row is line 2150 at HEAD, found once by `git grep -n "^| AH7 " HEAD -- frontends/shell/MANUAL-WALKTHROUGH.md`.
- Insert the new row directly after line 2150, before the blank line and `## Result log`.
- The id `AH8` is unused: `git grep -c "AH8" HEAD -- .` printed nothing.
- Result-log line: after line 2166, found once by `git grep -n "^- \*\*AH7 (for each" HEAD -- frontends/shell/MANUAL-WALKTHROUGH.md`.
- Part AH's "Before" line already names the empty project folder of AH5. Use the AH5 folder, which still holds the project saved there.

````text
| AH8 | Close the app. In the folder of AH5, open `project.spatial` in a text editor and find the line `"identity": null`. Replace that one line with three lines, in the same indent as the line it replaces: `"identity": {`, then the same indent plus two spaces and `"column": "id"`, then the same indent and `}` (keep any comma the original line ended with). Keep two-space indents, no tabs, and the final line feed. Save, start the app, and open the project from that folder (Part AD's steps). Read the panel and click nothing. | The reopen is refused with code `engine.identity_unusable`. A field row `identity_source` reads `mapped:id` and the row `column` reads `id`. The line beside the refusal reads "The project was not opened in this window. The open was tried with the claims the project file recorded for the data, if any. None was typed here." No button of AH1 stands under the refusal, and no declaration form shows. `project.spatial` is unchanged by the open. Record whether anything shown offers a way out of the refusal. |
````

````text
- **AH8 (the refusal's code; the `identity_source` and `column` rows; the line beside the refusal; whether any button showed; whether `project.spatial` changed; whether anything offered a way out):**
````

**(b) e2e README entry.**
- File: `frontends/shell/e2e/README.md`. Append a new section at the end of the file.
- The file's last line begins `**What it proves not.** The words of the choice and its lines`. It contains "M-25, the choice not rendered", which occurs once (line 963 at HEAD). Find it with `git grep -n "M-25, the choice not rendered" HEAD -- frontends/shell/e2e/README.md`.
- Mirror the section above it, "Row-position spec (text-id-opens-for-the-session-by-row-position)".
- The step docblock in `admission-remediation.mjs` is the source for the description.

````text
## Recorded-declaration spec (text-id-reopen-with-a-recorded-declaration)

```
npm run e2e:admission
```

<!-- Drafted by the build worker of text-id-reopen-with-a-recorded-declaration, not the advisor's or the human's words. The step was not run by the build that added it: the run is the tester's. -->

`e2e/admission-remediation.mjs` gains the step `TEXTID-C1` (E-R1), before `DUPKEY'`. It drives the real DOM. (1) `text-id-no-integer-refused.parquet` is refused as `engine.identity_unusable`, the choice is clicked, and the open is saved to a scratch folder. (2) A copy of that folder has its `project.spatial` line `"identity": null` replaced by the three-line object recording `{"column": "id"}`, in the project reader's own spelling (the reader checks it byte for byte). (3) The control: the reopen of the first folder is refused with the choice offered and a field row `identity_source` reading `file:id`; the click opens it. (4) Another open (`no-id-column.parquet`) replaces that project in the window and the first folder is removed, since a project the window holds is refused as `skp.project_open_elsewhere`. (5) The copy is opened through `e2eOpenProjectFolder`, which must answer `engine.identity_unusable` at its first call; `question` or `skp.project_open_elsewhere` fails the step by name. The refusal block shows `identity_source` reading `mapped:id`, the column `id`, the owner line R-ENG, and no `.admission-row-position-choose` button.

It exits as the suite does: 0 when every step passes, 1 when one fails. It is operator-run and not in CI or in `npm run verify`.

**What it proves not.** The words of R-ENG beyond the copy the step compares, any timing, macOS or Linux, a reopen through the native folder picker (the operator's Part AH8), or a reopen whose recorded declaration names a column other than `id`. The step is written and checked with `node --check` only: it was not run by the build, so its mutation M-RD8 (`rowPositionOffer` no longer checks `identity_source`; expected failure at step (5), "the choice to open by row position was offered") is not observed. An unrun step is not an observation.
````

**(c) Sentences the new field row or the missing offer may make untrue (named only, no words proposed):**
- `governance/KNOWN-LIMITATIONS.md:70`, item 3. It says "A file whose `id` column cannot serve is still refused, and the app then offers a second choice ..." and "opening the file or the project again refuses the column and asks again". Both gates and the advisor read it as still true. I name it as the one most likely affected, because a reopen of a project recording a declaration of `id` now asks nothing. This is the file's path as I recall it; I did not re-read it in this session.
- Walkthrough AH6 (`MANUAL-WALKTHROUGH.md:2149`) and e2e README line 959 (E-1 (d)) stay true. For those reopens (identity null, not declared) the refusal now also shows an `identity_source` row reading `file:id`.

## 6. Checks at HEAD 1a4b5bbe
- **§7 count.** The counting command (the form's own exclusions, `2df8b4ae..1a4b5bbe`) gives 775 insertions, 128 deletions, **903 total changed lines**, over **37 files**.
  - Against the ceilings, 903 is over 900 (class 8, by 3 lines). The file count of 37 is under 50 and is within Amendment 3's 44-file scope.
  - I did not edit §7. The words (about 15 lines) are not in the count and add to the overrun.
  - Largest files: `kernel/tests/text_id_reopen_recorded_declaration.rs` 249, `engine/tests/identity_refusal_names_its_source.rs` 142, `frontends/shell/e2e/admission-remediation.mjs` 105 (104+1), `protocol/skp/tests/fixtures.rs` 85 (77+8), and the three conformance fixture files 50, 48 and 40 (25+25, 24+24, 20+20).
  - The one-line JSON version bumps each count 2.
- **§9 stops**, each untrue at HEAD:
  1. Code before the form was committed: untrue. I read the form at base `2df8b4ae` with Amendments 1 to 3, and the ADV-24 and -27 rulings.
  2. Any path outside §7: untrue. All 37 paths fall in §7's engine, kernel, protocol and shell lists. I did not touch `e2e/README.md` or the walkthrough, and `App.reopen.test.tsx` needed no edit.
  3. The offer beside a refusal whose `identity_source` is not `file:id` or is absent: untrue. The check is `frontends/shell/src/admission/AdmissionPanel.tsx:230`, fail-closed, and S-R1 covers `mapped:id` and the absent field.
  4. Any change to an engine message, R-ENG, S-8 or S-1 to S-6c: untrue. `engine/src/error.rs:388` only adds `identity_source: _` to the Display destructure. The `AdmissionPanel.tsx` change is a doc-comment line plus the D-R2 (ii) sentence.
  5. The field valued anywhere but by `IdSource::as_envelope_value` in `engine/src`, or composed or renamed in the kernel: untrue. It is valued at `engine/src/dataset.rs:2081`, `2103`, `2165` and `2178` and at `engine/src/identity.rs:391`. The kernel arm at `kernel/src/skp.rs:2252` and `2264` passes it through like `column`.
  6. A change to a request member or to `protocol/data-plane/`, or a wire change outside the `skp/0.17` entry: untrue. No request member changed. The only wire change is the literal, the `identity_unusable` field, and the SKP-V0 §8 `skp/0.17` entry with the "compared today" lines.
  7. A byte of change in what a project file records: untrue. K-R1 asserts the project bytes are unchanged across both reopens.
  8. An edit to ADR-016: untrue. No `docs/` path is touched.
  9. A claim in any record that a test was written before its code: untrue. I make none here, and none is in a commit message.
- **Cargo** `test --locked -p spatial-engine -p spatial-kernel -p spatial-skp`: rc=0, 1122 passed, 0 failed (the base's 1117 plus the 5 new Rust tests). `cargo fmt --all -- --check`: rc=0.
- **Shell**, run on the identical tree before the commits (`git status` shows the commits changed no file): `npm run typecheck` rc=0; `npm test` rc=0, 132 files, 1699 tests (the base's 1697 plus S-R1 and S-R2).
- **e2e script:** `node --check frontends/shell/e2e/admission-remediation.mjs` rc=0. The step is not run.
- **verify-cites** rc=0: PASS, 3811 files, 240 loose references advised (the base had 3809 files and the same 240).
- **verify-quotes** rc=0: PASS, 161 checked, 130 verified, 30 baselined.
- **verify-test-claims** rc=0: PASS, 971 claimed tests (the base also had 971).
- **verify-mutation** rc=0: PASS, 8 new tests.
- **`node --test`, three globs:** rc=0, 623 tests, 623 pass, 0 fail.
- I ran no clippy.
- `D:/wt/c1rd-logs/` holds every log.

## 7. Departures and notes
- My first shared hold (`npm ci`) wrapped the command in parentheses, which the brief disallows. It ran correctly. Later holds used `bash <script>`.
- While the base cargo build was compiling dependencies, I applied the engine edits too early. I saved them as `engine-edit-attempt.patch`, reverted the three files with `git checkout`, and re-applied them after the base run finished. The engine crate had not compiled before the revert, so the base figures stand.
- TMP and TEMP were redirected to `D:/wt/c1rd-tmp` for every cargo, npm and node run in the worktree.
- `skp_version_is_skp_0_16` was renamed `skp_version_is_skp_0_17`. `verify-mutation` treats it as a new test, so I kept its Mutation line and observed it (M-RD6).
- E-R1 design choices:
  - Steps 3 to 5 are as the docblock states: a control reopen of the first folder, then another open to replace the project, then removal of the first folder, then P2.
  - P2 is a copy of the saved project with the single `"identity": null` line replaced by the canonical three-line object.
  - The step fails by name if the reopen answers `question` or `skp.project_open_elsewhere`.
  - It adds `cpSync` to the imports, the `ENGINE_REFUSAL_NOTICE` constant (a copy of R-ENG), and a header comment line.
- `protocol/skp/tests/conformance/fixtures/refusals-any-layer.json:93` still holds `"skp": "skp/0.16 "` with a trailing space. It is a malformed-literal row, which is unsupported at 0.17 as before, and I did not change it.
- The `skp/0.16` text left in doc comments and the conformance README follows "a doc comment that names a version stays".
- The §7 overrun is stated in section 6 and in the first paragraph.
- The kernel's K-R1 uses P1, a project saved after an `identity {column:"id"}` open with the data bytes then replaced by File A. P0 is saved after a set-aside open and reopens as `file:id`.
- D: free space fell to about 28 GB, above the 20 GB floor. C: stayed at about 41.9 GB.
- I observed two stale background-watcher notices. They were harmless.
