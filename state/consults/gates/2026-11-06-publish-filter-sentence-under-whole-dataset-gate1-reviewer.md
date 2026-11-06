Reviewed: PR #285 at 3f5b0ff24f64efe42c8ff2e38b0cec03e1882831 (base 0c84b816), gate 1, reviewer
Verdict: PASS WITH NOTES

`cut/publish-filter-sentence-under-whole-dataset @ 3f5b0ff24f64efe42c8ff2e38b0cec03e1882831`. Brief sha256 46ee7e81…162d0e and packet sha256 47a47c93…dad350 both matched before I started.

**Summary:** Nothing blocks. The code does what the form's Change line says. I re-ran the full suite at the head and it is green. I applied M-1 to M-4 myself on a fresh export and each was caught by its named test at the predicted assertion. Two documentation findings must be fixed before the merge, and one record item is due in the closing amendment (it belongs to the custodian).

## Findings by class

### Correctness — none
- **Payload condition.** `filter_scope_sentence` (publish.rs:132-137) returns `Some(FILTER_SCOPE_SENTENCE)` only for `ViewportBbox { .. } if filter_active`, and `None` in every other case.
  - Its only product caller is `prepare_with_progress` (:421), which passes the value to `prepare_with_query` (:542). That function now takes `Option<String>` where it used to take the bool, and puts it into the payload unchanged (:651).
  - Its two direct test callers pass `None` (:2010, :2355).
- **Panel condition.** PublishPanel.tsx:693 reads `filterActive && scope === "current"`.
- **Panel and payload agree** whenever a prompt exists: `resolvePublishScope` (PublishPanel.tsx:83-95) maps `"current"` to `viewport-bbox`, or to `null`, which refuses before any prompt.
  - The two cases where they can differ are the ones the form's note 2 names: the dev-only `scopeOverride` hook, and flipping the radio while a dialog is open. Neither is reachable in ordinary use as an untrue claim.
- **The seam is unchanged.** The consumer is still `filter_scope: string | null` in types.ts, rendered at PublishDialog.tsx:264-268. FILTERED' is the end-to-end test from the real shape (whole-file gives `null`).
- **P0 is unchanged.** `to_query` sets `filter: None` in both arms: publish.rs:123, and `ViewportQuery::all()` at engine/src/stream.rs:258-265.

### Evidence — none blocking
- **E-note 1 (M-2 also breaks the sibling test; not blocking).**
  - What I saw: under M-2 (`Self::WholeFile if filter_active`), the named test failed at its filter-on assertion (publish.rs:2086, left `None`). `the_whole_dataset_scope_carries_no_filter_scope_sentence_with_or_without_a_filter` also failed, at its own filter-on assertion (:2059). The other 70 lib tests passed.
  - Why: the mutation adds M-1's behaviour to the WholeFile arm, so it necessarily breaks that test too. It is a second kill, not a wrong-reason failure.
  - What the worker saw: every mutation run filtered to the named test only ("71 filtered out"), so the extra failure was never observed. The worker's `RECORDED MUTATION` line for M-2 is still true as written.
  - The form says "a mutation that passes, or fails anywhere else, is a stop". My reading is that this means the named test failing somewhere other than predicted, which did not happen. The architect or custodian should confirm that reading in the record. No code change is needed.
- **E-note 2 (CI).** Governance CI run 42174547291 (pull_request, head 3f5b0ff2) failed.
  - Cause: `verify:plan FAIL — 1 issue(s): - node "release-docs-finalized": PR #49 is not merged (Command failed: gh api repos/christopherdonini/spatial-ide/pulls/49 … gh: HTTP 502`. That is a GitHub API error, not a defect.
  - The push run of the same workflow at the same head (42170523325) passed.
  - CI green is a merge condition, not a gate condition (Part 1, item 4), so the run needs a re-run before the merge.

### Documentation — fix before the merge
- **D-1. MANUAL-WALKTHROUGH.md, Part G, the G8 action cell.**
  - The problem: the expected cell describes what happens under **Whole dataset** ("With **Whole dataset** chosen and the same filter on, neither the Export section nor the dialog shows it…"), but the action cell never tells the operator to choose Whole dataset. An operator who follows the row as written never reaches that half.
  - Whose wording: a worker's row, not the human's, so the worker applies these words with no re-gate.
  - Current words (byte-copied from the diff): `Apply a filter if not already active (Part E's panel — e.g. `zone = 'residential'`), then choose **Current view** and click **Export interactive map…** again.`
  - Replacement: `Apply a filter if not already active (Part E's panel — e.g. `zone = 'residential'`), then choose **Current view** and click **Export interactive map…** again. After cancelling (below), choose **Whole dataset** and click **Export interactive map…** once more; to see its dialog, confirm the native picker, then cancel in the dialog.`
  - Clause check:
    - "choose **Whole dataset**": the radio with value `whole` has no `disabled` (PublishPanel.tsx:667-676).
    - "click … once more": the button is disabled only for `busy || (scope === "current" && currentDisabled) || state.kind === "dialog"` (:701). An abandoned dialog returns the panel to `{ kind: "idle" }` (`nextStateFromDialogSettled`, :297).
    - "confirm the native picker, then cancel in the dialog": the dialog appears only after the picker (G2). `handleAbandon` (PublishDialog.tsx:218-224) never calls execute, so nothing is published.
- **D-2. publish.rs, the `filter_scope` field doc, its last sentence.**
  - The problem: "The filter is in no published row under either scope." can be read the wrong way round, as "rows the filter selects are not published". That reading is false.
  - Whose wording: the worker's doc comment, so the worker applies these words with no re-gate.
  - Replacement: `No filter is applied to the published rows under either scope: `PublishScope::to_query` sets `filter: None` in both arms.`
  - Clause check: the WholeFile arm returns `ViewportQuery::all()`, whose `filter` is `None` (engine/src/stream.rs:263). The ViewportBbox arm sets `filter: None` (publish.rs:123).
  - Plain backticks, not an intra-doc link, because `to_query` is private.
- **D-3. The closing amendment (record; the custodian's).** The form's Tests line (form :11) names `the_filter_scope_sentence_is_present_only_when_filter_active_is_true`, which this PR removes. Today verify-test-claims accepts it as "planned — node … is in-progress". Once the node is marked done, that claim binds and the check fails. The closing amendment has to pin that claim as superseded or withdrawn, in the done commit.

### Notes (not acceptance conditions)
- **The form's note 4 coverage.** Every clause I checked is true at the head (check 5).
  - Read literally ("Each sentence must cover"), some places omit an element:
    - the mark is absent from the `filter_scope` field doc, `filter_scope_sentence`'s doc, the types.ts field doc, the FILTERED' header, the README passage and the coverage row;
    - P0 is absent from the `FILTER_SCOPE_SENTENCE` docs in both files, from G8, and from the KL revision note.
  - Read by subject, every place covers what it talks about. The architect wrote note 4, so it is the architect's reading that settles this.
- **Possible rustdoc warning.** The `FILTER_SCOPE_SENTENCE` doc (a `pub` item) links to the private `[`PublishScope::filter_scope_sentence`]`. rustdoc's `private_intra_doc_links` lint would warn on that. I did not run rustdoc, and CI runs none.

## Checks 1–6

**1. The diff against the form** (my script, rc=0, plus greps).
- **Files and size.** Only the eight Scope files change. `git diff --numstat 0c84b816...3f5b0ff2` (rc=0) gives 2/2, 2/2, 3/2, 6/12, 84/39, 17/0, 1/1, 14/13 = 200 lines against the declared 150. That is class 6 under the form's note 1, and the Scope line is not edited.
- **The P6 mark.** Both copies of `FILTER_SCOPE_SENTENCE` start with `[P6 placeholder] `. The 139 bytes after the prefix equal the base's string in each file: `afterPrefixEqualsBase= true` for publish.rs and for types.ts.
- **No `pub` or `export` item is added or removed.** The grep over the +/- lines returned rc=1 (no match). The same pattern matched 6 context lines, so it does work.
- **Declared unchanged, and they are:**
  - `PublishPromptData`'s fields (only doc lines changed);
  - commands.rs, PublishDialog.tsx and client.ts (`git diff --stat` is empty);
  - the approval path;
  - the pin test: PublishPanel.test.ts:222-240 hashes to 6c3bc437… at both base and head, equal to the form's pin.
- **FILTERED'** asserts `filter_scope !== null` → throw, and adds no wait: the only `waitForHook` at :486 was already there.
- **The document spans:**
  - KL: only item 8 and its comment changed. The comment change is an append: the head line starts with the base line minus ` -->`. The "Corrected 2026-10-10" line is byte-equal to the base's (line 106 in both).
  - The walkthrough: only G8 and the FILTERED' coverage row changed.
  - The README: only the FILTERED' passage changed.
- **Bytes.** No CR in any changed file (0 at base and head), every file ends with a final LF, and no tab. The non-ASCII characters (— … §) are all intended: they sit in existing prose and in the unchanged sentence text.

**2. The suite at the head, run by me** in the worktree (`CARGO_TARGET_DIR=D:/wt-targets/pfs`), in shared holds, under `timeout 1800`. The worktree's bundle viewer and shell build outputs were already present (gitignored).
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`: rc=0, 4 result lines, 72 + 0 + 2 + 0 = 74 passed, 0 failed. Both U12 tests pass by name: `the_current_view_scope_carries_the_filter_scope_sentence_only_with_a_filter_active ... ok` and `the_whole_dataset_scope_carries_no_filter_scope_sentence_with_or_without_a_filter ... ok`.
- `npm run verify`: rc=0. Vitest: Test Files 109 passed (109), Tests 1446 passed (1446). The node suites after it report fail 0.
  - A verbose run of `npx vitest run src/publish/PublishPanel.test.ts` (rc=0, 45/45) shows both U12 cases passing by name, and the pin test passing.
- `cargo fmt --all -- --check`: rc=0. `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check`: rc=0. Both printed nothing.
- The worktree's porcelain is empty afterwards and HEAD is still 3f5b0ff2.

**3. M-1 to M-4, observed by me, on an export of 3f5b0ff2.**
- **Setup.**
  - The export was made with `git archive` and `tar --force-local`.
  - `npm ci --offline` and the build ran in renderer/bundle-viewer and in frontends/shell, all rc=0, in one shared hold.
  - The cold target build (`--no-run`) took 20m 43s, rc=0.
- **Results:**

| Mutation | Change | Run | Named test | Other tests | Restored to head (sha256) |
|---|---|---|---|---|---|
| M-1 | `_ if filter_active` | `cargo test --lib`, rc=101 | `the_whole_dataset…` FAILED at publish.rs:2059, the filter-on assert (left `Some("[P6 placeholder] …")`, right `None`) | 71 passed | 451a4fc5… |
| M-2 | `Self::WholeFile if filter_active` | rc=101 | `the_current_view…` FAILED at :2086, the filter-on assert (left `None`) | the whole-dataset test also failed (see E-note 1); 70 passed | 451a4fc5… |
| M-3 | panel condition `{filterActive && <p` | vitest, rc=1 | "Whole dataset with a filter on shows no filter sentence (U12)" FAILED at PublishPanel.test.ts:436, its first expect | 44 passed | aec01e38… |
| M-4 | panel condition `{scope === "current" && <p` | rc=1 | "Current view shows the filter sentence with a filter on and not with it off" FAILED at :446, the filter-off case | 44 passed | aec01e38… |

- Each mutation was applied alone, and the head hashes 451a4fc5… (publish.rs) and aec01e38… (PublishPanel.tsx) match `git show 3f5b0ff2`.
- `D:/wt-targets/pfs-g1r-export` and `D:/wt-targets/pfs-g1r-target` are removed; `ls` shows both gone.

**4. The tests' soundness.**
- Both Rust tests go through `filter_scope_of`, which calls `prepare`, which delegates to `prepare_with_progress` (publish.rs:496-524), over the real 20-row fixture.
  - Each test has its own `workspace` dir, so no state is shared.
  - `prepare` admits the bbox scope (the tests pass), so note 5's stop did not fire.
- The vitest cases render the real `PublishControls` through `renderToStaticMarkup`.
- The old test's two cases are both still covered: whole-file with the filter off gives `None` (kept), and whole-file with the filter on is inverted on purpose. Viewport off and on are added.
- A scan of the added lines for sleep, retry, timeout, ignore, skip, `cfg`, `waitFor` or statics found nothing (rc=1; the same pattern matched 23 lines of publish.mjs).
- Each `RECORDED MUTATION:` line names its mutation and ec847095ccbebcfc7ebdec78b23a572e00b219de. Only comments differ between ec847095 and the head in the four code files (a diff filtered to non-comment lines is empty). The lines claim only the named test's failure, which matches what I saw.

**5. The sentences written after the code, clause by clause at the head.** All true except the D-2 ambiguity.
- **publish.rs**
  - `FILTER_SCOPE_SENTENCE` doc:
    - the mark and the unchanged bytes: by script;
    - "only under … condition": the only product route is :421 → :651;
    - the pin test keeps the two copies equal: true.
    - Item 2 does rule it: the directive's item 2 reads "the filter sentence is shown only when the scope is the view, its text a P6 placeholder."
  - `filter_scope_sentence` doc: true.
  - `filter_scope` field doc: true apart from D-2.
- **types.ts**
  - The field doc is true: `null` crosses as `null`.
  - The constant's doc, "under the same condition": true outside the dev-only override.
- **FILTERED''s header and the e2e README passage:** both true. The suite prepares only `"whole"` (publish.mjs:470).
- **The walkthrough**
  - G8: true. The sentence sits between the fieldset and the button (PublishPanel.tsx:665-701). The row-scope quote is byte-equal to publish.rs:140 (script). The gap is D-1.
  - The coverage row: true.
- **KL item 8 and its comment (red line, the human's at the click).** Every clause is true: the Export section, by :693; the dialog, by `ViewportBbox && filter_active`; Whole dataset shows neither, and the row-scope line reads the whole file. The revision note is true and matches item 2's words. I propose no words for item 8.

**6. Verify scripts and CI** (in the worktree, at the head).
- `verify.mjs --offline` rc=0 (PASS).
- `verify-cites.mjs` rc=0: PASS, with 162 loose advisories, among them old-path cites in this form (`AUTONOMY.md`, `PLAN.yaml`, `RELEASE-0.1.md`).
- `verify-quotes.mjs` rc=0: PASS, 138 checked, 0 errors.
- `verify-test-claims.mjs` rc=0: PASS, 738 claims. The old test name is "planned" (see D-3).
- `gh pr checks 285` was read at 2026-11-06T06:42:43Z (rc=1 because one check failed). Every run's `headSha` from `gh run view` is 3f5b0ff24f64efe42c8ff2e38b0cec03e1882831.
  - All runs are success except 42174547291, Governance CI on pull_request, which failed on HTTP 502 (E-note 2).
  - The runs at 3f5b0ff2: 42174547371, 42174547375, 42174547302, 42174547319, 42174547330, 42170523309, 42170523265, 42170523325, 42170523359, 42170523331.
  - I did not read the three runs at 1af71af0.

## The packet's gaps
- It does not say that the worker's mutation runs were filtered to the named test, so nobody had observed the other tests under M-1 to M-4. I had to find that in the worker report.
- It does not say that the worktree already held the built bundle viewer and shell outputs that check 2 needs.
- It does not say that `verify-test-claims` will make the removed test name, form :11, binding when the node goes done (D-3).
- It gives the form's sha256 at main only. It is the same at the head (73138cc1…); I checked.

## Hold lines (this project's only, `also=` elided)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF` with matching `MACHINE_RELEASED project=SpatialIDE … affinity=FF (cores 0-7)`, for 9 holds:
  - the export's npm install and build;
  - the export's cold `--no-run`;
  - the worktree `cargo test`;
  - M-3; M-4; M-1; M-2;
  - `npm run verify`;
  - the verbose vitest run.
- Every hold was granted and released. No exit code 96–99.

## Background shells left
None. All seven background tasks finished on their own: the cold build, verify-quotes, two wait loops, the worktree cargo test, M-1/M-2 and `npm run verify`. I killed no process.

Scratch files are in my scratch folder, all named `pfs-g1r-*`: the diff, the numstat, the check-1 script and its output, the `-wt-cargo`, `-wt-verify` and `-wt-vt` logs, `-m1` to `-m4`, `-v-*`, `-checks`, `-runs`, `-govfail`, and `-hold1` to `-hold9`.
