# lod-tier-tests-own-tier-folder: each test run that builds LOD tiers takes its own tier folder, the machine-wide tier folder kept for the product — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The filler queue's entry 11, S3, placed by the human's ruling of 2026-11-06, item 2. Its route is the advisor's, under the human's delegation of 2026-11-13 (§B). Drafted by lead-data, read only, at main 68857b9e (`state/consults/2026-11-15-lod-tier-tests-own-tier-folder-five-line-form-lead-data-draft.md`), and committed by the custodian. The five lines below are the draft's, byte for byte, but one pin (§A).

```
Authority: PLAN node `lod-tier-tests-own-tier-folder` (governance/PLAN.yaml:4227-4243 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:9900519e13062e07dbbc1a01e4a81a7253dc74483a70307cd94a0fb4b50adf8c), filler queue entry 11, graded S3 (state/FILLER-QUEUE.md:34 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:1dc5fa0bf10c730a22a74c39dbac6158f21f5f3bbb98e987cdd844fb73beb30c), placed by the human's ruling of 2026-11-06, item 2 (state/directives/2026-11-06-u12-e2e-on-5400-u1-size-accepted-tier-folder-node-review-packet-decisions.md:10 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:575e723b186e8433af97c0b14d1ee7fd771b685304254269f221f80f67950589), run in the filler slot under AUTONOMY.md §36 (governance/AUTONOMY.md:692 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84); the finding is #284's gate-1 reviewer report, its check 2 (state/consults/gates/2026-11-06-literal-only-float-integer-arithmetic-refused-gate1-reviewer.md:78 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:b111fe055dfbf626892100435739a4c32db55b2269b899208a229dcfcce58ea5; :81-83 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:03bab5c51c7bdf7c72717c47f0f09263600ad36b5e016409d53c9d04bf1bbd9e), with the binary passing alone in that piece's Amendment 1 (governance/forms/engine/LITERAL-ONLY-FLOAT-INTEGER-ARITHMETIC-REFUSED-PREREGISTRATION.md:324 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:33a3d8c9ad78bc596813724dbf99f8ed8ab7c7db62bb887887c52d6b3ae118ac); the product's tier root stays the one port-2 settled (governance/forms/root/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:62 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:cc45ee68926d56ab49400508d1a08c976aad396b0a04280cb5f8cb492578875f; engine/src/app_dirs.rs:6-9 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:6e8db860fe962cbec9b9126c657d82c07558df17ce1d15cc5ca88b35ae94d7a9); reuse index: three misses, no prior art recorded for "test tier cache directory per run", "localappdata test isolation" or "parallel test suites shared cache folder" (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian for this form's brief).
Scope: 7 files: engine/tests/common/mod.rs (the per-run folder helper `tier_run_root`, the machine-wide root as inherited, a `build_tiers` wrapper that ensures the folder first, and the finished-run sweep, OPEN-2); engine/tests/lod_tier_builder.rs (its tier-path sites through the helper, T-A, T-B and T-B's child half, the comment at engine/tests/lod_tier_builder.rs:981-984 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:75e3592a6d2d873ad85b6ff85faf9b9f9c643272bfa2a2d83efaa2e2e2dff4eb, `drop_tiers`'s doc, and the 5 GB floor's volume, OPEN-3); engine/tests/lod_tier_cancellation.rs and engine/tests/lod_tier_measurements.rs (their `tier_directory` helpers, the cancellation file's doc paragraph on sharing a folder, the measurements floor's volume); engine/tests/lod_tier_preflight.rs (its second build lands in the run's folder); kernel/tests/no_generation_in_persisted_artifacts.rs (its LOD test builds in a per-run folder and removes it, OPEN-8); engine/README.md (owner's index, OPEN-4); declared line budget 260 by §21c's counting rule (governance/AUTONOMY.md:357 @ 68857b9e6771296c506134281ece3d202e9366eb sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec), about 240 estimated (N6), over §21c's 150 and so closed to the single gate from dispatch (OPEN-5); this form is exempt; no line under engine/src/ or kernel/src/, no Cargo manifest or lockfile, nothing under protocol/, docs/ or KNOWN-LIMITATIONS.md; engine/tests/lod_tier_root.rs unchanged.
Change: in every test under engine/tests and kernel/tests that builds, reads or clears LOD tiers, the tier root on Windows becomes a folder owned by that test's own process below the cargo target's tmp directory, by setting `LOCALAPPDATA` for the test process once, before its first build, while the product's resolution (`app_dirs::tier_cache_dir`, `lod::tier_directory`) is left exactly as it is; no test run reaches %LOCALAPPDATA%\spatial-ide\tiers any more, a later run removes a finished run's folder, and `cargo test --workspace -- --list` gains T-A, T-B and T-B's ignored child half.
Tests+mutation: T-A, new: engine/tests/lod_tier_builder.rs::a_test_runs_tiers_are_built_in_its_own_folder_and_never_under_the_machine_wide_tier_root (a small source whose bytes match no other test's; built through the wrapper; its directory and hash captured and the set removed first; then asserts (1) the directory is not below the inherited `LOCALAPPDATA` joined with `LOD_TIER_ROOT`, and (2) it equals `tier_run_root()` joined with `LOD_TIER_ROOT` and the content hash). T-B, new: engine/tests/lod_tier_builder.rs::a_second_run_clearing_and_removing_its_own_tiers_leaves_this_runs_tiers_in_place (the parent builds over source S; it runs its own test binary as a second process (`std::env::current_exe()`, `--exact` the child half, `--ignored`, S named by an environment variable) and waits for it to exit; the child clears its tier directory for S through `clear_tier_directory`, builds over S, prints its directory and removes its set; then the parent asserts (1) the child exited 0, (2) every one of the parent's three tier files is still on disk, (3) a second parent build reuses all three, and (4) the child's directory differs from the parent's; the order comes from process sequence alone, with no sleep, timer or timing window). Child half, new, ignored on every platform: engine/tests/lod_tier_builder.rs::the_second_run_half_of_the_two_runs_test (it returns at once when its variable is absent). M1, for both: in `common::tier_run_root` delete the `std::env::set_var("LOCALAPPDATA", ..)` line, so the product resolves the machine-wide root again; predicted: T-A FAILS at (1); T-B FAILS at (2), because the child reuses the parent's tiers in the one shared hash folder and its removal deletes them. M2, T-B only, under OPEN-2 (A): the sweep removes every sibling folder without first testing its lock; predicted: T-B FAILS at (2), because the child's start-up sweep removes the parent's live folder. No existing test's assertion changes what it asserts. Each mutation is observed by applying it, running `--test lod_tier_builder` filtered to the two tests, recording the failure by name and commit in a `RECORDED MUTATION:` comment (this file's convention), and reverting. A verify-mutation run is never called an observation.
Out-of-scope: ADR: none (no status line or amendment; ADR-018's cancellation behaviour is untouched, and the cancellation test changes only where its helper resolves the folder); security: none (nothing ADR-020, ADR-009 or ADR-021 governs; nothing is written outside the cargo target and the temporary directories the tests already use); wire: none (nothing under protocol/, no SKP or data-plane change); guarantee: none touched (no line under engine/src/ or kernel/src/ changes, so app_dirs.rs's table, `tier_root_for`, `tier_cache_dir`, `lod::tier_directory`, `LOD_TIER_ROOT`, the free-disk preflight and every refusal stay as port-2 left them; port-2's claim that one boundary decides the tier root still holds, and T-A's (2) now checks it end to end; no existing assertion changes what it asserts, N5); no new dependency (std only), no new exposure surface, no string a user sees; §25 (e) is set aside for a filler by §36 in any case.
```

### §A. What differs from the draft's five lines

- The Authority line's pin on the PLAN node. The draft named the node's title, budget_minutes and summary fields at 68857b9e and left the hash to the custodian. Here the pin cites the node's whole record by its lines at the same commit, from its id line to its dates line, with the sha256 of those lines, each with its LF.
- No other byte of the five lines differs from the draft's.
- The draft's notes N1 to N9 are this form's design notes, by reference: the per-run folder's shape, the runs 1 to 6, the light checks, the P-0 checks (a) to (d) and the stops among them. Where a note and the five lines differ, the five lines hold. The draft's impact read and its outline of a full form are not part of this form.

### §B. The advisor's rulings (by reference)

ADV-2026-11-15-14 (`state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-14-lod-tier-open-5-a-one-five-line-form-both-gates-from-dispatch-size-note-260-for-this-piece-three-terms.md`) and ADV-2026-11-15-16 (`state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-16-item-8-of-adv-2026-11-15-15-replaced-adv-2026-11-15-14-check-answered-no-new-ruling-budget-unchanged.md`), the advisor's under the human's delegation of 2026-11-13, not the human's words.

- **The route.** OPEN-5 (A): this one five-line form, with §36's two filler gates, the reviewer and the architect, from dispatch.
- **The size note.** 260 lines, for this piece alone. The note is the advisor's, not the human's, and §21c's number is unchanged. The Scope line's declared budget of 260 is that note. At or under 260 the piece stays on this form.
- **Term (a).** If the built diff is over 260 lines, §21b's overrun clause applies: the piece keeps this form, the overrun is recorded as an amendment, and the custodian tells the advisor before the gates are dispatched.
- **Term (b).** If anything of §21a is found mid-piece, or a file under `engine/src` or `kernel/src` has to change, the piece stops and goes to the advisor.
- **Term (c).** §C.
- **The check of the filed draft.** ADV-2026-11-15-14's item 5 is answered by ADV-2026-11-15-16's item 2, with no new ruling: (A) and the 260-line note stand, and the worker may be dispatched once this form is committed.

### §C. What LOCALAPPDATA decides (ADV-2026-11-15-14, term (c))

Since PR 324, on Windows the one variable `LOCALAPPDATA` decides both the tier root and the per-user data directory, under which the audit log, the session store and the project machine store sit, so a test process that sets it moves all of them for that process, not the tier folder alone.

- For each process the piece touches, the worker's report says what else in that process reads the per-user data directory, and that nothing there depends on the machine's real one. The kernel test comes first.
  - The kernel test binary of `kernel/tests/no_generation_in_persisted_artifacts.rs`: the draft's P-0 (a) is kept as that check. No test in that binary reaches `data_dir`, `default_root`, `projects_root` or an `AuditLog` without `AUDIT_LOG_ENV`.
  - The engine test binaries `lod_tier_builder` (T-B's child process is the same binary), `lod_tier_cancellation`, `lod_tier_measurements` and `lod_tier_preflight`: the draft's reading is kept, that nothing in the engine reads the data directory and that its only consumer is the kernel's `data_dir` (the draft's N3). The worker confirms it at P-0, and its report says so.
- Both gates check the sentence and the report's statements against the code.

### §D. The budget

- 60 minutes, the node's budget_minutes field, unchanged (ADV-2026-11-15-16, item 3 (b)). It is the custodian's estimate at placement, not a measurement.
- The draft reads that the piece does not fit it, with no measured time. An overrun is recorded in an amendment, as the draft's N6 says, and the five lines are not edited for it. The custodian tells the advisor the measured time at the closing.

### §E. The OPEN items, as taken

- OPEN-5: (A), the advisor's ruling (§B).
- OPEN-1, OPEN-2, OPEN-3, OPEN-4, OPEN-6, OPEN-7 and OPEN-8: (A) each, the drafter's recommendation, taken under the direction of 2026-10-31, item 4 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), held to 2026-11-16 by the direction of 2026-11-09 (`state/directives/2026-11-09-item-4-to-11-16-12c-open-a-d-taken-slot-2-order-pr-b-slot-1-availability-monday-list.md`), recorded 2026-11-15. OPEN-6 (B), which would change a ruling's scope, is not taken.

### Settlement

- **Route:** the five-line form under §21d, with the advisor's size note of 260 lines for this piece alone (§B); §36's two filler gates, the reviewer and the architect, from dispatch, in the filler slot.
- **Rule (00):** at this form's commit no PR is open. PR B's branch (`cut/b1-shell-half-pr-b`, in progress in slot 1) changes no path under `engine/`, `kernel/` or `protocol/` against main. Of the branches not in progress, `probe/port-2-case-policy-red` changes `kernel/src/permission/grant.rs`, and `cut/revert-pr-320` changes `kernel/README.md` and `kernel/src/skp.rs`; none is in Scope. The paths are disjoint, and this piece touches nothing under `protocol/`.

### Amendments

*(Opens empty; append-only.)*

### Amendment 1 — the worker's stop at P-0 (b), the check read by what it is for under the advisor's ruling ADV-2026-11-15-18 (class 5); the size over the 260-line note before the last commit (class 6, Scope not edited); the overlap of ADV-2026-11-15-17 in the piece's first hold, and its later holds checked (class 1); a departure (class 1). Written by the custodian after the worker's stop and the ruling, before the worker resumes

*Written by the custodian on 2026-11-15. The worker's report is filed at `state/consults/2026-11-15-lod-tier-tests-own-tier-folder-stop-worker-report.md`, and the rulings at `state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-18-lod-tier-p-0-b-read-by-its-purpose-size-over-the-note-under-term-a-the-same-worker-resumes.md` and `state/directives/2026-11-15-advisor-ruling-adv-2026-11-15-17-two-heavy-runs-overlapped-beside-a-hold-of-the-other-project-class-1-records-status-re-read-after-each-hold-dispatch-goes-ahead.md`.*

1. **The stop (class 5).**
   - The worker made two commits on d2008810 in its worktree, not pushed:
     - fb51f0ac4c34d68ad9d444daf3126e9fe104a2c9: the change, in 6 files: the helper with its wrapper and sweep, the tier-path sites and floors through it, the preflight, and the kernel test's own folder;
     - 36c12ff285280f0549b792f0f98420a5bdae9aa6: T-A, T-B and T-B's second-process half, in `lod_tier_builder.rs` alone.
   - P-0 (a), (c) and (d) held, by its report. Its run 1 at the second commit passed, 19 tests, with 3 ignored. The machine-wide tier folder's list was the same after each run.
   - It stopped at P-0 (b). The draft's wording has only the common module name the engine's `build_tiers` among the engine tests. But `lod_tier_root.rs` imports it, and this form's Scope line keeps that file unchanged. A doc line of the measurements file names it too.
   - The ruling reads the check by what it is for (its item 1). P-0 (b) now reads as below, in the advisor's wording under the delegation of 2026-11-13 (its item 2), and both gates check it at the head:

```
P-0 (b), as ruled by ADV-2026-11-15-18: after the edits, in the four suites that build into the tier root (engine/tests/lod_tier_builder.rs, engine/tests/lod_tier_cancellation.rs, engine/tests/lod_tier_measurements.rs and engine/tests/lod_tier_preflight.rs), no use line and no call names the engine's own build_tiers; each takes build_tiers from common. The wrapper in engine/tests/common/mod.rs is the one place under engine/tests, outside lod_tier_root.rs, that calls the engine's function. engine/tests/lod_tier_root.rs keeps its own import and is unchanged: it is its own test binary, it gives the build a tier root that cannot resolve, and the build is refused before anything is written. A doc comment that names the engine's function is not a call. No other file under engine/tests names build_tiers.
```

   - The advisor's own check of it at the second commit is its item 2 (a). The measurements doc line stays (2 (b)). The kernel test is outside P-0 (b) (2 (c)).

2. **The size (class 6; ADV-2026-11-15-14's term (a), as ADV-2026-11-15-18 item 3 applies it).**
   - Declared: 260 lines, the advisor's note; the draft's N6 estimated about 240.
   - At the second commit, from d2008810, by git's numstat: 409 lines (345 added, 64 removed) over 6 files, before the third commit. The README's owner's index is not yet written.
   - The piece keeps this form, the Scope line is not edited and nothing is trimmed. It does not move to the full form (item 3 (d)). The final count goes to the advisor before the gates are dispatched.
   - By file, against N6. Every file is over its estimate; the last column is the custodian's reading of the diff, with the counts by git.

| File | N6 | At the second commit | The extra lines |
|---|---|---|---|
| `common/mod.rs` | about 65 | 122 | The lock and the sweep are a function of their own with its doc, 41 lines against about 20. The per-process state, kept once in a static cell, and the folder's helper with its doc are 41 against about 25. The imports, the module doc's list of the four suites and the doc lines brought current are 20, which the estimate did not count. The accessor (7, its allow among them), the wrapper (11) and the other 2 allows are about as estimated. |
| `lod_tier_builder.rs` | about 125 | 192 | T-B with its two constants is 66 lines against about 35: four assertions, and the second process's output read back. A section comment and a source helper that T-A and T-B share are 22, which the estimate did not count. The two floors' function, renamed and documented, reads the run's volume, and the formatter broke its lines: 20 against about 8. The import lines are 7 against about 3. T-A is 28 against about 25 and the child half 15 against about 20; the path sites (24), the doc of the drop helper (4) and the comment (6) are about as estimated. |
| `lod_tier_cancellation.rs` | about 12 | 16 | The doc paragraph on sharing a folder is rewritten whole, 8 lines; the imports 4 and the path site 4. |
| `lod_tier_measurements.rs` | about 14 | 31 | The floor's function, as in the builder file, with its five calls renamed, is 21 lines; the imports 6 and the path site 4. |
| `lod_tier_preflight.rs` | about 6 | 13 | The module doc 3 lines; the imports with `mod common;` 7; the helper's call with its comment 3. |
| `kernel no_generation_in_persisted_artifacts.rs` | about 16 | 35 | A guard type that sets the variable, puts it back when dropped and removes the folder, with its doc, is 30 lines, where the draft had the set and the restore inline; its use with its comment 5. |

   - Both gates are asked one question on it (item 3 (c)): is every changed line inside what the Scope line names for its file. A line that is not goes to the advisor.

3. **The time.** The worker's run took 73 minutes by its transcript, against the node's 60, and the piece is not finished. The measured time goes in the closing amendment (§D; item 4).

4. **The holds (class 1; ADV-2026-11-15-17 item 3 (b)).**
   - The worker's first status read, at 2026-11-15T17:06:32Z, showed a hold of this project, and it waited. Its read at 2026-11-15T17:08:55Z showed none, and it held from 17:09:05Z to 17:35:14Z, for P-0 (d)'s cold build, by the transcripts.
   - PR B's correction worker had taken a hold at 17:08:57Z, after its own read showed none. From 17:09:05Z to 17:31:09Z, each of PR B's holds ran beside this one, five of them after reads that showed it; PR B's Amendment 21, item 5 (a), gives them.
   - Every read in that window showed one hold of the other project. So the overlap departs from the human's standing machine rule (ADV-2026-11-15-17, item 2). No value of the other project is recorded.
   - This worker kept its brief after that first hold. It took no other hold in the window. Its four later holds, 17:41:07Z to 17:55:13Z (after its read at 17:41:03Z), 17:56:42Z to 17:57:19Z (after its read at 17:56:38Z), 17:59:42Z to 18:00:02Z (after its read at 17:59:38Z), 18:01:39Z to 18:14:10Z (after its read at 18:01:33Z), each followed a read that showed no hold of this project, and none was live: the custodian checked each against the read before it (ADV-2026-11-15-17, item 4 (d)).
   - The rule of that item 4 reached it at 2026-11-15T18:07:39Z, after its last hold had begun; it took none after.
   - The runs stand (ADV-2026-11-15-17, item 3 (d)). Both gates are told of the window in their packets.

5. **A departure (class 1).** P-0 (d)'s hold ran its two cargo calls inside a parenthesised group, against the brief. Each later hold ran one command. The report's other disclosures stand by reference.

6. **What follows.**
   - The same worker resumes on the same branch for M1 and M2, the third commit, runs 2 to 6, the light checks and the push (ADV-2026-11-15-18, item 6).
   - Its brief carries ADV-2026-11-15-17 item 4 and names it as the one that yields. When PR B's records worker runs beside it, that brief says so too.
   - Then the final count to the advisor, and both gates from dispatch, with item 2's question and the window in their packets.

Nothing above is edited.

### Amendment 2 — the closing before the gates: the build at f8f931e2; the size at the head by file (class 6, Scope not edited); the measured time; run 6 against its prediction (class 2); the holds after the resume checked (class 1). Written by the custodian after the worker's hand-back, before the gates

*Written by the custodian on 2026-11-15. The worker's final report is filed at `state/consults/2026-11-15-lod-tier-tests-own-tier-folder-worker-report.md`. Counts are by git's numstat from d2008810, three-dot; times are by the transcripts.*

1. **The build.**
   - The worker resumed on the same branch by the custodian's message of 2026-11-15T19:18:08Z (ADV-2026-11-15-18, item 6) and handed back at 2026-11-15T20:35:01Z.
   - Three commits on d2008810, pushed to `cut/lod-tier-tests-own-tier-folder`; origin equals the head:
     - fb51f0ac4c34d68ad9d444daf3126e9fe104a2c9: the change (Amendment 1 item 1);
     - 36c12ff285280f0549b792f0f98420a5bdae9aa6: T-A, T-B and T-B's second-process half;
     - f8f931e2ce6c4ba04f4bbc54c6352ae6a8c0c2bb: the two recorded-mutation comments in `lod_tier_builder.rs` and the owner's-index entry in `engine/README.md` (OPEN-4 (A)).
   - By git at the head: 7 files, each named in the Scope line; no line under `engine/src`, `kernel/src` or `protocol/`, and no Cargo manifest or lockfile. `engine/tests/lod_tier_root.rs` is unchanged.
   - P-0 (b) passes at the head under the advisor's wording in Amendment 1 item 1, by the worker's report. Both gates check it at the head.
   - The draft PR is #326, opened by the custodian at 2026-11-15T20:46:12Z, at the head.

2. **The size (class 6; ADV-2026-11-15-14's term (a), as ADV-2026-11-15-18 item 3 applies it).**
   - At the head: 423 lines (357 added, 66 removed) over 7 files, against the note of 260 and N6's about 240. At the second commit it was 409 (Amendment 1 item 2).
   - The third commit adds 14: 10 in `lod_tier_builder.rs`, the two recorded-mutation comments, and 4 in `engine/README.md`, the preregistration list's new path and the Last-verified bullet.
   - The piece keeps this form, the Scope line is not edited and nothing is trimmed. The final count was told to the advisor at 2026-11-15T20:40:58Z, before the gates.

| File | N6 | At the second commit | At the head |
|---|---|---|---|
| `engine/README.md` | about 4 | 0 | 4 |
| `common/mod.rs` | about 65 | 122 | 122 |
| `lod_tier_builder.rs` | about 125 | 192 | 202 |
| `lod_tier_cancellation.rs` | about 12 | 16 | 16 |
| `lod_tier_measurements.rs` | about 14 | 31 | 31 |
| `lod_tier_preflight.rs` | about 6 | 13 | 13 |
| `kernel no_generation_in_persisted_artifacts.rs` | about 16 | 35 | 35 |

   - Both gates are asked Amendment 1 item 2's question: is every changed line inside what the Scope line names for its file. A line that is not goes to the advisor.

3. **The time (§D).** 150 minutes by the transcripts, against the node's 60: the first run, 2026-11-15T17:02:37Z to 2026-11-15T18:15:45Z (73), and the resumed run, 2026-11-15T19:18:14Z to 2026-11-15T20:35:02Z (77). The node's budget is not edited. The time was told to the advisor with the count.

4. **The mutations and the runs, by the worker's report.**
   - M1 and M2 were observed at 36c12ff2 by applying each, running the tests it names and reverting, as predicted: under M1, T-A failed at (1) and T-B at (2); under M2, T-B failed at (2). After M2's revert, `common/mod.rs` has the second commit's sha256. The recorded-mutation comments at the head name both.
   - Run 4, the engine crate at the head: exit 0, with no failed result line; `lod_tier_builder` 19 passed and 3 ignored. Run 5, the kernel test: exit 0, 9 passed.
   - The machine-wide tier folder's list was the same before run 4, after it and after run 5.
   - The light checks pass: fmt, verify:plan, verify:cites, verify:quotes and verify:test-claims. verify:quotes' first run reached the worker's own time limit and gave no verdict; the re-run under a longer limit passed.
   - CI on the branch's push at the head: 5 runs, all success, read at 2026-11-15T20:53:32Z. The pull request's own runs are read before the merge check. On Windows T-A and T-B pass and the second-process half is listed as ignored; on macOS and Linux T-A and T-B are ignored by their attribute, as the form intends.

5. **Run 6 (class 2).**
   - The draft's N7 run 6, clippy over the engine and kernel packages with every target and `-D warnings`, expected exit 0, the state the clippy node left. It exited 101, on two errors in the renderer's lib: `manual_range_contains` in `renderer/src/canonical.rs` and `doc_lazy_continuation` in `renderer/src/style.rs`.
   - The reason: these are rows 44 and 45 of the clippy node's Windows read (`state/consults/2026-11-07-clippy-deny-warnings-workspace-windows-read-tester-report.md`), which the architect's draft places in 12d with rows 27 to 32 (`state/consults/2026-11-07-clippy-deny-warnings-workspace-form-architect-draft.md`, its table's 12d row). 12d has not run, so the clippy node had not left the workspace clean. The canonical.rs row now sits further down the file than the read's line, after 1c's edit, which that draft foresaw.
   - Without `-D warnings` the same command exits 0. Its warnings are 12d's six kernel rows, the two renderer rows, and one in `engine/src/app_dirs.rs` (`enum_variant_names`, at `Os::MacOs`). None is in a file this piece changes.
   - The app_dirs warning came with port-2, after the Windows read. Port-2's build report names it, and no lettered piece's rows hold it. The clippy node's summary records it from this amendment's commit, and the advisor is told.
   - No stop rule names run 6, and the piece fixes none of them (Scope).

6. **The holds after the resume (class 1; ADV-2026-11-15-17 item 4 (d)).**
   - The worker took 6 holds, each in its own background call. Each followed a status read in a call of its own that showed no hold of this project, and each chain's read after the grant showed one, its own. The custodian checked each against the read before it. By the transcripts, each hold's start and end:
     - M1: 19:20:15Z to 19:21:32Z, after the read that ended at 19:20:10Z.
     - M2: 19:26:00Z to 19:27:17Z, after the read that ended at 19:25:56Z.
     - run 4: 19:30:39Z to 19:54:15Z, after the read that ended at 19:30:34Z.
     - run 5: 19:55:41Z to 19:56:53Z, after the read that ended at 19:55:37Z.
     - run 6: 19:58:12Z to 20:00:06Z, after the read that ended at 19:58:07Z.
     - run 6 without -D warnings: 20:01:35Z to 20:03:15Z, after the read that ended at 20:01:29Z.
   - PR B's records worker's holds ran 20:29:14Z to 20:33:53Z and 20:35:37Z to 20:45:32Z, each after a read with no hold of this project. None overlapped the six.
   - The report's note that the first hold is the one Amendment 1 item 4 records means the piece's first hold, from 17:09:05Z. The first row of its table, M1's hold, ran beside no hold of this project.

7. **What follows.**
   - Both gates from dispatch, the reviewer and the architect (§36), at the head: their packets carry P-0 (b) in the advisor's wording, §C's check, Amendment 1 item 2's question, Amendment 1 item 4's window, and item 5 here.
   - ADV-2026-11-14-21 item 6 (a): the PR's paths changed on main since the merge base d2008810, read against 0d13561d: none. The list is read again before the last gate.
   - Then out of draft, and the merge check to the advisor (the grant, item 5).

Nothing above is edited.
