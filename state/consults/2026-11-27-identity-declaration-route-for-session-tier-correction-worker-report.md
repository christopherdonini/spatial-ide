# The identity route's correction after its read parts, the worker's report

*Filed by the custodian, 2026-11-27. The correction of the form's Amendment 12 item 5 (ADV-2026-11-27-15), made in D:/wt/idr from 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9, with no app, dev server or e2e suite started. A sonnet worker made it. Its run, from its completion notice only (ADV-2026-11-26-02), was 42 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (6645 bytes, sha256 ac73ed35bdeda8ea981684b297f70e5406cd712d2b287616e31435fa43e59e60), byte for byte. Its account is the worker's; the custodian checked the head, its parent and the count by git. No gate-log row: this is a correction, not a gate.*

---

7fa66a68a811cc20e09bf3251d0cb34d422fc81e is the pushed head (origin/cut/identity-declaration-route-for-session-tier, read back after fetch). Every step completed. Two checks failed or were not run: verify-mutation exits 1 (below), and the Rust suites were not run (below).

Commit: 7fa66a68 "fix: the identity route's correction after its two build-gate read parts (ADV-2026-11-27-15 items 1 to 4 and the gates' own words)". It is signed off with -s and carries the Co-Authored-By trailer.

Starting state: HEAD was 09dfe6b1 and the tree was clean.

How the texts were applied: one script, D:/wt/idr-logs/corr-apply-2.mjs, with its output in corr-apply-4.log. It refuses unless each Old is found exactly once. It also checks each Old/New against the filed ruling or read part read by git show origin/main.
- Whole-file search, found exactly once, unless noted.
- Where the same text stands in more than one row, the search was confined to the line starting that row. Those are marked "row-confined".
- Two earlier script runs wrote nothing. Run 1 died on the backslash-escaped backticks in the reviewer's D-a and D-b text. Run 2 died on a shell-collapsed escape in my own script.

Places (line numbers are at the head before the edit):
- Item 1, AdmissionPanel.tsx:373, constant DECLARE_IDENTITY_FIRST_LINE: done.
- Item 1, MANUAL-WALKTHROUGH.md:2114, row AG2: done, row-confined.
- Item 1, comment above the two constants, AdmissionPanel.tsx:369: done as two spans: the added sentence, and the removed clause entry.
- Item 2, MANUAL-WALKTHROUGH.md:602, row I8's note: done, row-confined. Row I4 and the result logs are untouched.
- Item 3, KNOWN-LIMITATIONS.md:71: done.
- Item 4, IdentityDeclarationForm.tsx:
  - D-b spans at 49, 59 and 62: done.
  - D-d at 58: done in the ruling's words. I did not break the lines anew.
- Reviewer D-a, row AG1, MANUAL-WALKTHROUGH.md:2113: done, row-confined.
- Reviewer D-b, row AG4, line 2116: done, row-confined.
- Reviewer D-c: done in types.ts:147 and SKP-V0.md:101. The anchor in SKP-V0.md is confined to the §1 paragraph. The "Amendment 5 item 7" paragraph was not touched.
- Reviewer D-e, AdmissionPanel.tsx:290: done.
- Reviewer D-f: done. The two Mutation comments sit above `#[test]` of W-1 (identity.rs:408) and W-2 (identity.rs:434). Each test name stands within 500 characters of "Mutation". I did not run the mutations again; they record the reviewer's observation at 09dfe6b1.
- Reviewer D-h: done in SKP-V0.md at 1183 and mod.rs at 141. I joined the sentence to the existing one with a semicolon: the new SKP-V0.md text reads "...as at `skp/0.14`; the partitioned refusal's fixture message...". The mod.rs text reads "...has an empty diff; the partitioned... Same discipline again:". The added text is copied unchanged.
- Reviewer D-j, identity.rs:323: done. The words are "(ADR-016 §4 with the Note 2026-11-26)", following the phrasing of Amendment 5 item 3. This is a short edit of the existing parenthesis, not a verbatim copy. Check it.
- Architect D-a, AdmissionPanel.tsx:181: done.
- Not applied, as you said: the reviewer's C-1, D-d, D-g and D-i, and the architect's D-c.

Item 1 comment (my words, verbatim, inserted before "D2 is true of the code as follows"):
`D2's present words are the advisor's ADV-2026-11-27-15 item 1, which replaces the D2 of ADV-2026-11-23-26 item 2.`
The entry `"checks that column across the whole file" is the engine's full-file check of a declared column;` is removed.

Row AG4 after D-b, verbatim:
`Open `no-id-column.parquet` again with Open GeoParquet; then Open the disclosure again, select `parcel_key`, click **Declare this column** and click **Cancel** while it runs.`
This reads awkwardly, because "Open" keeps its capital after "then", as you instructed.

Checks:
- Shell `npm ci` in renderer/bundle-viewer and in frontends/shell, `npm run typecheck`, and `npm test`: all in one shared hold, rc 0. vitest reported 1683 passed (1683).
- `cargo fmt --all -- --check`: rc 0.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 3744 files, 221 loose references advised.
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS, 159 checked, 128 verified, 30 baselined, 0 errors.
- `verify-mutation.mjs --base 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 --head HEAD`: **rc 1**, "FAIL — 38 of 111 new test(s) have no recorded mutation naming them".
  - W-1 (`the_candidate_list_is_every_admitted_integer_column_in_schema_order_unranked`) and W-2 (`the_candidate_list_and_the_type_check_admit_exactly_the_same_types`) now show ok.
  - The three tests the ruling's item 6 names are still MISS, and the check also lists 35 others. The 38 MISS are:
    - 1 App.lateResult.test.tsx:877
    - 2 admitDataset.test.ts:189 and :202
    - 3 candidateColumns.test.ts:17
    - 4 recentreBudget.property.test.ts:169 and :173
    - 5 conditions.test.ts:285
    - 6 collapsedCountSync.test.ts:161 and :176
    - 7 consoleViewModel.test.ts:153, :159, :168 and :180
    - 8 recorder.test.ts:272, :287, :306, :320 and :355
    - 9 surfaceRegistry.test.ts:90
    - 10 openProject.test.ts:179, :193, :203, :220, :227 and :249
    - 11 candidateArmSession.mintWindow.test.ts: MW1 to MW7 and FE1(a), FE1(b), FE2, FE3, 14 in all
    - 12 wire.property.test.ts:91
    - 13 wire_properties.rs:130
  - Each of these is a test the corrected head did not touch. I left them as you asked.
- Not run: cargo tests, clippy, e2e. You did not ask for them. Their logs in D:/wt/idr-logs are the earlier ones.

Numstat 09dfe6b1..HEAD (added, deleted):
- KNOWN-LIMITATIONS.md 1 1
- engine/src/identity.rs 3 1
- frontends/shell/MANUAL-WALKTHROUGH.md 4 4
- frontends/shell/src/admission/AdmissionPanel.tsx 4 5
- frontends/shell/src/admission/IdentityDeclarationForm.tsx 4 4
- frontends/shell/src/skp/types.ts 1 1
- protocol/skp/SKP-V0.md 2 2
- protocol/skp/src/v0/mod.rs 1 1
- Total: 20 added, 19 deleted.

Departures and notes:
- The identity.rs diff has only comment lines changed. Rust was not recompiled beyond `cargo fmt --check`.
- verify-mutation measures from the merge-base 0bcf5434 and the mutation tool is the current tree's. The 38 MISS include tests this piece did not add.
- Disk was 41570 MB free before the heavy run, above the 40960 MB floor.
- Model: Sonnet 5.5 (claude-sonnet-5-5). I used no override and received no context handoff.
- Pre-gate self-check:
  - Cross-module interfaces: no code was written and no interface was changed.
  - Completion claims: each "done" above points to a line in corr-apply-4.log, or to a check output named above.
  - User-facing text: D2 and AG2 now match ruling item 1; I8's note matches item 2.
  - Required tests: no tests were added.
