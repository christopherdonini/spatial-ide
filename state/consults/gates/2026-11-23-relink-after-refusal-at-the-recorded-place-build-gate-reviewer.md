Reviewed: branch cut/relink-after-refusal at 06a2825a1dd9e55649605487f1065810905dad58, PR 363 (draft), in the branch worktree C:/dev/wt/relink, where it made its mutations by Bash; the records at main b42c0ed72a8a94885bdd1f057c5c7463e5127a0e in C:/dev/wt/read-1123c (the custodian's filing note, 2026-11-23: the reviewer's build gate, node:relink-after-refusal-at-the-recorded-place@build-gate-reviewer-1, dispatched at 2026-11-23T15:42:24Z; its run: Bash 68, Read 4, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T15:42:27Z to 2026-11-23T16:12:41Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 14322 bytes, sha256 249cb23557969a0ddc2c24981ea3d1260a0f04f1407d6f463a2425476f1948fe, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; P0 observed again (S-1 fails at (ii) with C1's AdmissionPanel.tsx); M-S1 to M-S3, M-K1, M-K2 and M-K2b observed at 06a2825a, M-K2 as worded failing at the first save's at check and not at F-4; D-1 to D-5 Documentation, the worker's words, to fix in PR 363; D-6 for the closing amendment; the section 7 count 409 lines over 10 files; the PR's checks 20 pass by its report.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/relink @ 06a2825a1dd9e55649605487f1065810905dad58 (branch `cut/relink-after-refusal`)
REPORT PATH: state/consults/gates/2026-11-23-relink-after-refusal-at-the-recorded-place-build-gate-reviewer.md

I found no Correctness or Evidence finding. There are six Documentation findings, D-1 to D-6, and each is must-fix before the merge. None of the sentences involved is the human's wording, and none is the advisor's: D-1 to D-5 are the worker's words, and D-6 is the closing amendment's text (the custodian's). The advisor's texts (S12, item 73's title and paragraph, item 69's sentence, the locator line, and R8 with OPEN-9) match the form byte for byte, and every clause in them is true at the head.

## Correctness

None.

## Evidence

None. The checks behind that:

- **P0, observed again.**
  - S-1 was run with C1's `AdmissionPanel.tsx` (3885d02b) over the head's test file. It fails at (ii) with `AssertionError: (ii): expected null to deeply equal { folder: 'C:/projects/p', …(1) }`. The count was 1 failed, 35 passed.
  - The file was restored. Its sha256 is ba100fb0…c7b4, the same as the head's blob, and porcelain is empty.
  - K-F1 passes at the head (kernel unchanged).
- **Mutations.** Each was made by one anchored `sed` (the diff showed one line changed), run, and restored by `git checkout --`. After each restore porcelain was empty and the file's sha256 equalled the head's: `AdmissionPanel.tsx` ba100fb0…c7b4, `mod.rs` 93519410…04ba.
  - M-S1 (`&& state.owner === REOPEN_LOCATOR_REFUSAL_NOTICE` removed): S-1 fails at `(iii) The project was not opened in this window.: expected {…} to be null`. Every other test in the file passes.
  - M-S2 (`!state.inFlight` removed): S-1 fails at `(v)`. The other 35 pass.
  - M-S3 (`state.options.reopen !== undefined` removed): S-1 fails at `(iv)`. The other 35 pass.
  - M-K1 (`data_at(folder, &file.dataset, &dir)?;` put before `let path = match relink {`): K-F1 panics at `:200:40` with `F-2: re-linked: SkpError { code: "skp.project_target_unresolvable", … }`. That is F-2, as §4 predicts.
  - M-K2, as the form words it (every save): K-F1 fails at `:190:5` with `the first save's \`at\``, left `None`, right `Some("data/parcels.parquet")`. It does not fail at F-4.
    - My construction was `dataset: judged.reference` changed to `dataset: reference.clone()`. `judge` is still called for `carried`, but the file gets the unjudged reference.
  - M-K2b (`if first { judged.reference } else { reference.clone() }`): K-F1 fails at `:217:5` with `F-4: the file's \`at\``, left `None`, right `Some("data/renamed.parquet")`.
- **Which reading of M-K2 the form carries.** §4's words state no condition, so they carry the every-save reading. Under that reading the prediction "fails at F-4's `at`" is false in where it fails, though the mutation is still caught. M-K2b shows that the F-4 assertion does catch the change.
  - This is not an Evidence gap, because no property is left unproven. It is a record item for the closing amendment (D-6).
- **The M-E1 logs.** Logs `<S>/relink-e2e/{0,1,2w,2,3}-reopen.log` show what the tester's report claims:
  - runs 0, 1 and 3 have R1 to R9 PASS and `[R10] FAIL … shows no .admission-reopen-relink button`, so I4 is not triggered;
  - runs 2w and 2 have R1 to R10 and E-CHANGED PASS;
  - the R-line texts and times I compared match the report;
  - the start and end times match `times.txt`.
  - The logs themselves carry no commit id. The P0 and head checkouts rest on the tester's `rev-parse` statements.
- **The seams** are as §9 lists them:
  - button → `handleRelink` → `reopenPath` → `runAdmitPath` → `admitProject` → `openProject(folder, cancelKey, answer, relink)` → the `OpenProjectRequest` wire → `open_project_command` → `open_project`, whose step 5 uses `relink` before `data_at`;
  - K-F1 starts from the wire JSON, and R10 goes through the real app.
- **The caller rule.** `relinkOffer`'s product callers are the render (`const offer = state.kind === "refused" ? relinkOffer(state) : null`) and the hook `e2eRelinkFile`. Both are in the shipped source, and there is no other caller.
- **The §7 count** (the form's own command on `0f02c164...06a2825a`): 386 insertions + 23 deletions = 409 lines (ceiling 420) over 10 files (ceiling 10). The files are exactly §7's list, and there is no overrun.
- **§8, item by item.**
  1. No file outside §7.
  2. No change to `kernel/src/**`.
  3. `commands.rs` changes in doc lines only.
  4. `surfaceRegistry.ts` is untouched.
  5. The offer is gated on the owner place and `!inFlight`.
  6. No new string. S12 and the locator line are the ruled texts.
  7. No sleep, timeout or platform ignore in S-1 or K-F1.
  8. No declared-unchanged assertion is edited.
  9. No record calls `verify-mutation` an observation. The commits per mutation are D-6.
  10. No overrun.
  11. None.
  12. Not applicable.
  13. Per Amendment 3, `0f02c164` has as ancestors 09ce1dfe (PR 353), 7a3fd37b (PR 358) and 8b8c3881 (PR 359). These equal the PRs' current heads from `gh pr view`.

**A note for the architect (not a finding).** `check_inside` also refuses a name whose metadata cannot be read as `Unresolvable`, so the choice is offered then too. ADV-2026-11-22-44 item 7's OPEN-5 says "for nothing else". The shell cannot tell the two cases apart, and item 69's comment discloses this. `NotCanonical` cannot be reached, because the reader refuses a non-canonical `at`. The neighbouring "on the same machine" phrase beside the new R8 bullet is the architect's to read (ruling item 7).

## Documentation (must fix before the merge; worker's words unless noted, none the human's)

**D-1.** `frontends/shell/src/admission/AdmissionPanel.tsx`, the `handleRelink` comment.
- What is wrong: the comment covers both routes, but on S11's route a Cancel goes to `{kind:"opening"}` and then ends at `Open cancelled`, with no refusal to return to. The sentence is true only for item 73's route, where `runAdmitPath` restores the refused state with `inFlight` false.
- Not covered (AUTONOMY §31 (c), timing inside one round trip): a cancel that comes after the engine's open answers `opened`.
```text
A Cancel of the call returns to the same refusal, with its choice.
```
```text
A Cancel of the call after item 73's refusal returns to the same refusal, with its choice; after S11's, it ends at the cancelled note.
```

**D-2.** `frontends/shell/e2e/README.md`, the hook sentence.
- What is wrong: a `through_link` or `wrong_kind` refusal is also "a reopen's refusal at the place the project file records", and it gets no offer.
- The new clauses match `relinkOffer` and `reopenRefusalPlace`.
```text
it offers one after `not_found` and after a reopen's refusal at the place the project file records.
```
```text
it offers one after `not_found`, and after a reopen refused as `skp.project_target_unresolvable` with a `locator` while no call is in flight.
```

**D-3.** `protocol/skp/SKP-V0.md`, §8 note, "The machine." bullet.
- What is wrong: "there" reads as §12.3, but the bullet says "Wherever §12 says" (OPEN-9).
```text
§12.3 gains the bullet that says what "the machine" and "this machine" mean there.
```
```text
§12.3 gains the bullet that says what "the machine" and "this machine" mean wherever §12 says them.
```

**D-4.** `frontends/shell/e2e/reopen.mjs`, header line 5.
- What is wrong: it puts R10 under B2 piece 1c's Amendment 54. R10 is this form's §4 (as `stepR10`'s own doc says).
```text
-- E-REOPEN (R1 to R10) and E-CHANGED of B2 piece 1c (B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md Amendment 54 item 9, with its
```
```text
-- E-REOPEN (R1 to R10; R10 is RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md section 4's) and E-CHANGED of B2 piece 1c (B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md Amendment 54 item 9, with its
```

**D-5.** `KNOWN-LIMITATIONS.md`, item 73's HTML comment, provenance.
- What is wrong: ADV-2026-11-22-44 item 4 approves the title and the whole paragraph, not only the changed sentence. The comment also does not name the refused-save case that S12's doc names, beside "Saving records the file's new place".
- The new clause was checked: `Projects::save` returns `LineageNotKept` before any write.
```text
(the one changed sentence of the paragraph is ADV-2026-11-22-44 item 4, not the human's words)
```
```text
(approved, title and paragraph, by ADV-2026-11-22-44 item 4, which also gives the paragraph's one changed sentence; the advisor's wording, not the human's; a save that is refused records nothing, SaveFailure::LineageNotKept, item 71, the case a gate gave as not ordinary use)
```

**D-6.** The closing amendment must record five things:
- each mutation with the commit it was observed at:
  - the worker: M-S1 to M-S3, M-K1, M-K2 and M-K2b at 32342fd4;
  - this gate: the same mutations at 06a2825a;
  - M-E1 (the tester) at 06a2825a;
  - P0 at 3885d02b, which the code's RECORDED MUTATIONS lines do not carry;
- C4 (06a2825a), the extra commit, which changed test text only: comments and one assertion message;
- M-K2's observed failure: "M-K2 as §4 words it fails K-F1 at the first save's `at` check, not at F-4's `at`; the prediction is falsified in its place only. M-K2b (the same at a later save only), observed after the result, fails at F-4's `at`.";
- no `verify-mutation` run as an observation;
- `reopen.mjs`'s empty RECORDED MUTATIONS header: record M-E1 there, or say in the amendment why not.

## Runs (all ended before 05:00Z on 2026-11-24)

Every cargo run used CARGO_TARGET_DIR=D:/wt-targets/relink and TMP/TEMP=D:/wt-data/relink. Each heavy run was in its own shared hold:
- every hold printed MACHINE_HOLD shared project=`<m>` … also=`<m>`, then MACHINE_RELEASED project=`<m>`;
- no MACHINE_WAITING or MACHINE_ERROR line appeared;
- no exit code 96 to 99.

| Run | Command | Exit code | Output file |
|---|---|---|---|
| P0 S-1 | `npx vitest run src/admission/AdmissionPanel.test.ts` with C1's tsx | 1 | `<S>/rlr-p0-s1.txt` |
| S-1 at head, unmutated | the same command | 0 (36 passed) | `<S>/rlr-head-s1-unmutated.txt` |
| M-S1 | the same command | 1 | `<S>/rlr-ms1.txt` |
| M-S2 | the same command | 1 | `<S>/rlr-ms2.txt` |
| M-S3 | the same command | 1 | `<S>/rlr-ms3.txt` |
| K-F1 at head | `cargo test --locked -p spatial-kernel --test project_relink_inside_folder_skp` | 0 | `<S>/rlr-kf1-head.txt` |
| M-K1 | the same command | 101 | `<S>/rlr-mk1.txt` |
| M-K2 | the same command | 101 | `<S>/rlr-mk2.txt` |
| M-K2b | the same command | 101 | `<S>/rlr-mk2b.txt` |
| Kernel suite | `cargo test --locked -p spatial-kernel` | 0 (63 `test result: ok`, 0 failed) | `<S>/rlr-kernel-suite.txt` |
| SKP suite | `cargo test --locked -p spatial-skp` | 0 (4 ok) | `<S>/rlr-skp-suite.txt` |
| Format | `cargo fmt --all -- --check` | 0, empty output | `<S>/rlr-fmt.txt` |
| Clippy | `cargo clippy --locked -p spatial-kernel --tests` | 0 | `<S>/rlr-clippy.txt` |
| Shell verify | `npm run verify` in frontends/shell | 0 (126 files, 1599 tests passed) | `<S>/rlr-shell-verify.txt` |
| Scripts suite | `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` | 0 (623 passed, 0 failed) | `<S>/rlr-node-scripts.txt` |
| Ruled words | `node <S>/rlr-words.cjs` | 0 (every count 1) | — |
| §7 count | `git diff --numstat 0f02c164...06a2825a -- . ':!<form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'` | 0 | `<S>/rlr-count.txt` |

- Clippy's 14 warnings are all in files outside the diff: engine `app_dirs.rs`, renderer `canonical.rs` and `style.rs`, and kernel `lib.rs`, `skp.rs`, `permission/boundary.rs`, `publish/mod.rs` and `bin/publish-bundle.rs`.
- The shell's `verify` has no format step, so no separate shell format check exists to run.
- The ruled-words script checked these byte for byte against form lines 570, 146, 147 with 578→584, 596, 123 with 604→610 (and the consult's :134, which contains the form's R8 text), 115 and 141:
  - S12 as `RELINKED_FILE`'s whole value;
  - item 73's title and paragraph, the paragraph with the D-5 sentence;
  - item 69's sentence, at the end of its paragraph;
  - R8 with "Wherever §12 says";
  - the §12.3 `relink` bullet;
  - the locator line.

**Branch CI.** I read `gh pr checks 363` at 2026-11-23T16:11:34Z: 20 pass, 0 pending, 0 failing. The PR head is 06a2825a and it is still a draft. An earlier read at 15:46:49Z had shown two checks pending.

**End state.** The worktree is clean at 06a2825a (`git status --porcelain` empty). Nothing was committed, pushed or stashed.

## Files read

- Form: `C:/dev/wt/read-1123c/governance/forms/frontends/RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md`, whole, Amendment 3 first.
- Rulings: `C:/dev/wt/read-1123c/state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-44-…md` and `…/2026-11-23-advisor-ruling-adv-2026-11-23-15-…md`.
- Consult: `C:/dev/wt/read-1123c/state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p5-words-draft-worker-report.md` (:134, by script).
- Diff and reports: `<S>/relink-diff-06a2825a.txt`, `<S>/report-relink-worker.md`, `<S>/report-relink-e2e-tester.md`, and `<S>/relink-e2e/*.log` with `times.txt`, `build-times.txt` and `prebuild-*-times.txt`.
- At the head, under C:/dev/wt/relink:
  - `frontends/shell/src/admission/AdmissionPanel.tsx`, the parts read: State, `runAdmitPath`, `relinkOffer`, `handleRelink`, the hooks and the render;
  - `frontends/shell/src/project/openProject.ts`: `admitProject`, `reopenRefusalPlace`, `reopenApply`;
  - `frontends/shell/src/project/reopenNotices.ts`;
  - `frontends/shell/e2e/reopen.mjs`: the header, R7 and R10;
  - `frontends/shell/e2e/README.md`: the E-REOPEN entry;
  - `kernel/src/project/mod.rs`: `save`, `open_project`, `open_error_of`, `data_at`;
  - `kernel/src/project/resolver.rs`: `judge`, `check_inside`;
  - `kernel/src/dataset_ref.rs`: `linked`, `in_canonical_form` uses;
  - `protocol/skp/src/v0/error.rs`: the target refusals;
  - `protocol/skp/SKP-V0.md`: §11.3, §12.3, §8 note;
  - `frontends/shell/src/skp/types.ts`: `ObservedChange`;
  - `frontends/shell/src/project/saveProject.ts` and `frontends/shell/src/App.tsx`: the save strings and paths;
  - `frontends/shell/package.json`: verify.

Model: Claude Opus 5.5 (claude-opus-5-5).
