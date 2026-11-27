Reviewed: the branch cut/text-id-opens-for-the-session-by-row-position at fc6d4b0098a08bc554f7f3ce15a1aa89564925cb in D:/wt/textid, where the mutations ran by the code worker's driver and each was reverted, and the form and the rulings at main a7be8395f0fdaddf0549f2a990050ae693cb2839 in D:/wt/read-1127c, read only. This is the custodian's filing note, 2026-11-27: the reviewer's build gate, THE READ PART (the form's Amendment 10 item 2; ADV-2026-11-27-11 item 2), and the merge read of ADV-2026-11-27-19 item 4, node:text-id-opens-for-the-session-by-row-position@build-gate-reviewer-read-part; its run, from its completion notice only (ADV-2026-11-26-02), 459 tool uses. A read part gives no verdict and takes no gate-log row. Below the rule, the report as handed back (saved by Write with the harness's indent removed; 16583 bytes, sha256 ea431890fa77013531cfed46f41f238d0065d8d8d432e5a6660713f6fb78caac), byte for byte. The custodian checked by git that the head has not moved and that the worktree is clean.

---

READ PART: cut/text-id-opens-for-the-session-by-row-position @ fc6d4b0098a08bc554f7f3ce15a1aa89564925cb. Main read: a7be8395f0fdaddf0549f2a990050ae693cb2839.

The form was read at D:/wt/read-1127c, last amendment first (Amendments 12 to 1, then §§2, 4, 5, 7, 9 and 10). Main has since moved to 0c3fc883, which adds text-id's architect read part and Amendment 13. I did not read it, as the brief orders. Every git command ran as `git -C D:/wt/textid`, after `fetch -q`. Every cargo command set CARGO_TARGET_DIR=D:/wt/textid/target. Below, the outputs are shortened and paraphrased unless they are marked verbatim.

## Check 1: the merge
- `git rev-parse fc6d4b00^1 fc6d4b00^2` gives ebf961d3… and 7fa66a68…. `git merge-base` of the two parents gives 912b3a2c.
- `git diff --stat ebf961d3 fc6d4b00` gives 13 files, +151/−32. The diff from 7fa66a68's merge-base to 7fa66a68 also gives 13 files, +151/−32. The per-file diffs are equal except in KNOWN-LIMITATIONS.md. So the merge brings the route's corrections and nothing else.
- In KNOWN-LIMITATIONS.md the only hunks are at line 68 and at lines 70–71.
  - The paragraph (line 70) is unchanged from text-id's side (sha256 3886afa6…), which meets ADV-2026-11-27-19 item 1.
  - The comment (line 71) is 1207 bytes. Its sha256, line plus LF, is ae4194485b13a1609d12c817c9536cb4a9f680701e68db674434ae4ae1a3252c, which equals the value the worker pinned.
  - ADV-19 item 2, checked by a script count at fc6d4b00: each of the three New texts stands once. The first and second Old stand 0 times. The third Old stands once, inside its own New.
- ADV-2026-11-27-15 item 7, by script count:
  - the D2 New stands once in AdmissionPanel.tsx and once in walkthrough row AG2;
  - the removed clause "checks that column across the whole file. The filter" stands 0 times;
  - row I8's New note stands once, and its Old 0 times.
- The README sections are byte-identical to each side.

## Check 2: the diff against §2 as amended
- `git diff --stat 912b3a2c fc6d4b00`, with each product hunk read.
- Every product change I read is inside §2 with its amendments:
  - the reopenPath signature change is the means of (A) and of C2;
  - S-8's choice in openProject.ts is Amendment 3;
  - the new detail in identity.rs is Amendment 3 and ADR-016 Amendment 3 (4);
  - refusedDeclarationOptions is C2.
- The files outside §7's base list are each declared by an amendment: Amendment 2 item 3, C1, E1/E2, Amendment 3 item 6, and Amendment 4's engine/tests/identity.rs. The others are the 14 route fixtures plus 2 new fixtures.
- **Amendment 9 item 5, answered in so many words: yes. I found no change outside §2 as amended, so nothing goes to the advisor under this check.**

## Check 3: §7's count
- `git diff --numstat 912b3a2c ebf961d3`, summed: 2313 + 221 = 2534 lines over 84 files, the figure Amendment 9 records.
- Base to head, fc6d4b00: 89 files and 2715 lines. This includes the merge's 13 files, which are the route's lines, not text-id's.

## Check 4: the mutations, by the driver
Each group ran in its own shared hold. The logs are D:/wt/textid-logs/rp-mut-{engine,kernel,shell}-1.log.

Every entry was OBSERVED, with 0 compile-error hits in each log. tree_clean_after is true for every entry (10, 8 and 11). `git status --porcelain` was empty after each group.

Engine (each fails at its own assertion):
- M-1 and M-4: at "the choice opens the file".
- M-2: at the session-tier helper, line 52.
- M-3b: at line 132.
- M-5: at the message assertion; it got S-6a's text.
- M-6 and M-8: at their refusal arms.
- M-3 and M-7: at N-S (`the_set_aside_scan_counts_are_exact`), lines 59 and 94, as the form's E2 words place them.
- M-9: at engine/src/dataset.rs:2559, the N-9 guard.

Kernel:
- M-10 at 566, M-11 at 641 and M-12 at 701: all assertions.
- M-13 at 193: the identity assertion, as its doc says.
- **M-14 at 218:36**, which is `rig.recorder.record_step(step).expect("recorded")`. The history writer refused the member with `skp.session_history_unwritable` … `UnknownMember { path: "$.admission.set_aside_file_id" }`. That is not the scan the test's doc names (finding E-b).
- M-15 at 321: the Ok-panic arm.
- M-16 at 350: the second call, as its doc says.
- M-17 at kernel/tests/fixtures.rs:94: the assertion that the request lacks the member.

Shell: every entry is an AssertionError in its own test.

Driver note: the driver's sub() replaces only the first occurrence, even with count=2. So M-17 mutated OpenDatasetRequest only, which is what §4 names, and M-24 mutated the openDataset default only. Neither changes a result.

**The skeleton: no skeleton commit exists, so no red at a skeleton was observed** (§4 and §5). Amendment 9 item 6 records this. I found no ruling that waives it (finding E-a).

## Check 5: the suites that start no app
Each ran in its own shared hold, with cd first. No clippy was run. Free disk before the runs: 41197, 41179 and 41144 MB.
- `cargo fmt --all -- --check`: rc 0, empty output.
- `cargo test --locked -p spatial-engine -p spatial-kernel -p spatial-skp`: rc 0.
  - 127 "test result" lines: 1116 passed, 0 failed, 69 ignored, by an awk sum over the log. No FAILED or panicked line.
  - The piece's binaries: text_id_set_aside_scan_counts 1 passed; text_id_set_aside_session_tier 8 passed; text_id_set_aside_not_saved_or_published 4 passed. `dataset::tests::a_set_aside_passes_cancelled_and_query_through_unchanged` (N-9) is ok.
  - Log: rp-cargo-test-1.log.
- `node scripts/plan/verify-cites.mjs`: rc 0. Verbatim: "verify:cites PASS — every rooted (in-tree) path:line reference across 3809 file(s) resolves. (240 loose reference(s) advised above.)"
- `node scripts/plan/verify-test-claims.mjs`: rc 0. Verbatim: "verify:test-claims PASS — all 971 claimed test(s) across 300 file(s) exist or are planned, superseded or withdrawn (66 planned, 16 superseded, 17 withdrawn, advisory)."
- `node scripts/plan/verify.mjs`: rc 0. "verify:plan PASS", with the plan agreeing with the repository.
- `node scripts/plan/verify-quotes.mjs`: rc 0. Verbatim: "verify:quotes PASS — 161 checked, 130 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 948 ruling cites resolved, 0 ruling-cite errors."
- frontends/shell `npm run typecheck` (tsc --noEmit): rc 0, no errors.
- frontends/shell `npm test`: rc 0. Verbatim: "Test Files  132 passed (132)" and "Tests  1697 passed (1697)". 0 FAIL lines.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0. tests 623, pass 623, fail 0.
- `gh run list` at headSha fc6d4b00: all 5 workflows succeeded (Governance, Product shell, Product Rust on windows, ubuntu and macos, Rust fmt, Ported notices). They also succeeded at ebf961d3.
- Final `git status --porcelain`: 0 lines. HEAD is still fc6d4b00.

## Check 6: clause checks, byte for byte
Checked by a script over every tracked file at fc6d4b00 (scratchpad strings.mjs), and by grep -cF or node split counts against the source rulings at read-1127c.
- S-1, S-2, S-3, S-5, S-8 and R-ENG each stand once in their product places, apart from the walkthrough and e2e copies.
  - S-1 to S-5 and D5 stand once each in ADV-2026-11-23-36's directive file.
  - K-1 stands once in ADV-2026-11-23-34's draft.
  - K-2(1) stands once in ADV-2026-11-26-20.
  - D4 stands once in ADV-2026-11-23-26.
- S-6a, S-6b and S-6c compose in dataset.rs as "refused: {detail}", across continuations. K-2 asserts them on the wire.
- S-4 is at engine/src/predicate.rs:360, across a continuation. N-8 and K-3 assert it.
- The new detail is in identity.rs.
- K-1, K-2(1), D4 and D5 stand in KNOWN-LIMITATIONS. K-1 and D5 stand twice each: once in the paragraph and once in the comment's quote.
- ADR-016 Amendment 3's (2), (3), (4) and (5) and its heading each stand once in ADV-2026-11-26-20 and once in ADR-016.
  - The append is +24/−0, at old line 293.
  - The draft hash 3d1e6181… is over 23103 bytes, which matches.
  - The claims of its italic acceptance line are true.
- The Olds:
  - 0 hits each: the S-2 draft, the S-5 draft, the K-2 "identity form" wording, "one case", I8's Old, D2's Old and ADV-15 item 4's Old.
  - The old Display sentence and the old detail stand only in engine/ADMISSION-RESULTS.md, which is ruled not edited (departure 7).

## Check 7: R-ENG against the new arm
R-ENG is at reopenNotices.ts:106. **Its sentence 2, verbatim: "The claims this refusal names are the ones the project file recorded for the data." It is untrue on the path of ADV-2026-11-27-12 item 2.**
- A project saved after the choice records `"identity": null` (K-4).
- Its reopen without the choice is refused as `engine.identity_unusable`, naming column `id` (K-7). That claim comes from the file, not from the project file.
- openProject.ts:83–85 shows R-ENG whenever setAsideFileId is not true. reopenRefusalPlace (93–104) returns ENGINE_REFUSAL_NOTICE for every `engine.*` code except `engine.cancelled`.
- T-11 drives `engine.identity_unusable` to R-ENG, and S-T4 offers the choice beside it.
- Ordinary use reaches this path.
- Sentences 1 and 3 are true on the path.

As the brief orders, this goes to the advisor unreworded, and I propose no words.

Observation for the advisor, unreworded: S-8 (reopenNotices.ts:108) asserts the same clause for `engine.query`, which S-T8's test drives, and there the refusal names no claim.

## Check 8: §9, item by item
1. Code after approval: the approval of ADV-23-34 was filed before 2026-11-26T19:32Z, and the first code commit, 8e4247d8, is dated 2026-11-27T00:48Z (`git log --format=%cI`).
2. No path outside §7 as amended (check 2).
3. No default of true:
   - client.ts's openDataset and openProject default `setAsideFileId = false`;
   - the only true sets are rowPositionOptions, whose sole caller is the click, and engine identity.rs:259, which is internal.
4. No choice byte in a project file (K-4), a history (K-5, plus the reader rule `closed(v, path, &["crs_assertion","identity"])` at kernel/src/dataset_ref.rs:655), or a bundle (K-6).
5. No declaration form on a reopen (T-11, S-T4).
6. The shell never sends `identity` and the flag together: the three builders, with M-19, M-23 and M-23b red.
7. The base holds no recovery-offer head: the node is blocked, no code branch exists, and Amendment 8 item 4 says so.
8. No red was a compile error (check 4).
9. No lab-folder content: `git diff --numstat` shows no binary file, and the 6 added files are tests, source and generated fixtures.
10. No number from item 1: a pattern search of the added lines found none.

## Check 9: §10's seams and guarantees
- Every test that §10 and §4 name is present, N-9 under its amended name. Each passes (check 5) and each was red under its mutation (check 4), with M-14's place as noted.
- E-1 and M-25 are for the run part.
- The seams are proven from the real shape:
  - client.ts sends `set_aside_file_id` as an always-present member into commands.rs's OpenDatasetRequest and OpenProjectRequest (skp/0.16, no serde default);
  - the new fixture v0-describe-response-session-ordinal-set-aside.json carries `"set_aside_column": "id"` and `candidate_columns ["parcel_key"]`.
- §10 names no test for ADR-010 rule 2. It is held by the `ByConstructionWithinGeneration` assertion in the engine helper.
- "Statement unchanged" holds by construction: SESSION_IDENTITY_STATEMENT (engine/src/identity.rs) is untouched and is chosen by its source. K-1 asserts that the statement is present.

## Check 10: the merge worker's departures (its report, filed on main)
Its departures 1 to 4 change no result.
1. The npm ci was re-run in the proper hold shape.
2. verify-cites and verify-quotes are single-process; I re-ran both in holds with rc 0.
3. Its wrapper scripts, shell-run-2.sh and cargo-run-3.sh, echo each command's own exit code, so they mask none.
4. It changed nothing beyond the one resolution (check 1).

Its `cargo check` did not name CARGO_TARGET_DIR, which does not affect any result.

## Findings

### Correctness
- **C-1. R-ENG sentence 2 is untrue on ADV-27-12 item 2's path** (check 7). This is ruled text, so it goes to the advisor unreworded and I propose no words. The correction changes a string constant in reopenNotices.ts, which is product code, with its test.
- **C-2. S-8 asserts the same clause for `engine.query`** (observation, check 7). It goes to the advisor unreworded. If ruled, the correction changes a string constant.

### Evidence
- **E-a. Red at the skeleton was never observed** (§4, §5; Amendment 9 item 6 records it). No ruling waives it, so the advisor decides. Changes no code.
- **E-b. M-14 is red, but at kernel/tests/text_id_set_aside_not_saved_or_published.rs:218 (`record_step(...).expect("recorded")`), not "at the scan of the history's lines" as the K-5 doc states.** The property is held, earlier, by the history reader rule. The correction is test text only (worker's words, not ruled); the Old stands once (grep -cF = 1).
  - Old: "/// `set_aside_file_id`. Expected failure: this test fails at the scan of the history's lines."
  - New: "/// `set_aside_file_id`. Expected failure: the step's record is refused as `skp.session_history_unwritable` (the history's reader rule refuses an unknown member), so this test fails at `record_step`, before the scan of the history's lines."
  - The alternative is a mutation that reaches the scan, which is test code.
- **E-c. K-6 runs R1 only, in one scope, against §4's R1 and R2 in both scopes.** It is disclosed as departure 6. The R2 boundary path calls the same preflight_pinless_parts check (kernel publish/mod.rs:465/518, called at :612), so the property is plausibly held. But §4's named evidence is missing. The correction is test code only, with no product code.

### Documentation (must-fix before the merge; none of these changes product code)
- **D-a. engine/tests/text_id_set_aside_session_tier.rs and text_id_set_aside_scan_counts.rs carry no N-id or M-id.**
  - Each Old below is "#[test]\nfn <name>() {", and each stands once (the fn names are unique). Each New prefixes one doc line to its Old.
  - The N-to-M mapping is §4's, together with the mutation logs.
  - The doc lines:
    - `file_a_text_id_with_no_integer_column_opens_on_the_session_tier_when_set_aside`: "/// N-1 of the form's §4; its recorded mutation is M-1."
    - `file_b_set_aside_opens_by_row_position_and_lists_parcel_key`: "/// N-2 of the form's §4; its recorded mutation is M-2."
    - `a_repeating_integer_id_is_scanned_again_then_set_aside`: "/// N-3 of the form's §4; its recorded mutation is M-3b (M-3 fails `the_set_aside_scan_counts_are_exact`)."
    - `a_negative_integer_id_is_set_aside_after_its_scan`: "/// N-4 of the form's §4; its recorded mutation is M-4."
    - `the_set_aside_is_refused_by_name_for_a_file_with_no_id_column`: "/// N-5 of the form's §4; its recorded mutation is M-5."
    - `the_set_aside_is_refused_by_name_when_the_id_serves`: "/// N-6 of the form's §4; its recorded mutation is M-6."
    - `a_set_aside_with_a_declared_column_is_refused_before_any_scan`: "/// N-7 of the form's §4; its mutation M-7 fails `the_set_aside_scan_counts_are_exact`, not this test."
    - `a_predicate_naming_id_on_a_set_aside_open_is_refused_as_ambiguous`: "/// N-8 of the form's §4; its recorded mutation is M-8."
    - in text_id_set_aside_scan_counts.rs, `the_set_aside_scan_counts_are_exact`: "/// N-S of the form's §4 as amended (E2); mutations M-3 and M-7 fail here."
  - engine/src/dataset.rs:
    - Old (stands once): "that admits on any `Err` turns it red."
    - New: "that admits on any `Err` turns it red. This is N-9 of the form's §4; its recorded mutation is M-9."
- **D-b. frontends/shell/src/admission/admitDataset.test.ts:179 labels a second mutation "M-24", duplicating client.test.ts:225's T-1 (M-24).** There is no "M-24b" in the form. The Old stands once.
  - Old: "// RECORDED MUTATION for T-1 (M-24): `admitDataset` passes"
  - New: "// RECORDED MUTATION beside T-1 (M-24b, not a row of the form's §4): `admitDataset` passes"

## My own departures
1. I created a stray file, D:/wt/textid/a.tmp, and removed it at once. Porcelain is clean (check 5).
2. My cargo test hold call began with `df -m /c | tail -1;` before `cd`. That breaks "cd comes first". The hold and the release both ran (MACHINE_HOLD, then MACHINE_RELEASED), and rc was 0.
3. While cargo test ran, I polled its log file repeatedly instead of only waiting for the completion notice.

Logs: D:/wt/textid-logs/rp-*.log. No report file was written.
