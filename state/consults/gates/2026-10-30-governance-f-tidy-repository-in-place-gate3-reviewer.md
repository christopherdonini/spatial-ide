Reviewed: PR #270 at 4d28aac3ecba72fe49457cad16029adfccbc982b, gate 3, reviewer
Branch and commit: cut/governance-f-tidy-repository-in-place @ 4d28aac3ecba72fe49457cad16029adfccbc982b (main read at dad30a4a9f83b63a4a0e4fea45695bb8ef8d3ffb)

Verdict: PASS WITH NOTES

## Findings by class

**Correctness:** none. The change does what Amendment 6 and the ruling's line 10 say.

**Evidence:** none blocking. My observed mutation in check 3 matches T12c's prediction.

**Documentation:** none. The comments, the problem text, the PASS line and the CI step name all describe the rule as the code applies it. I have no replacement words to offer.

**Notes (non-blocking):**
- N1. **Pull-request checks have not run at 4d28aac3.** `gh pr view 270` reports `CONFLICTING DIRTY` (polled at 06:52:34Z), and the PR is a draft. Because of the conflict, GitHub ran no pull_request-event workflows at 4d28aac3. The only runs at this commit are the two push runs. The last runs of DCO sign-off, Exposure scan, Product CI shell and bundle viewer, and Governance CI on the merge ref are all at f6168c99.
  - So forms-layout has not yet run against a merge ref with this change (section 2.5's merge-ref property).
  - The ruling's line 12 orders "main merged in once more, the checks re-run" before the PR comes out of draft. Those runs are the place to see these checks at the merged head.
- N2. **Amendment 6 is only on main.** It sits in the form at `scripts/plan/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md`. The branch's moved copy, `governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md` at 4d28aac3, has no "Amendment 6" (grep count 0). The main merge in N1 must carry it across the move. That is the closing record's work, not this change's.
- N3. **One deviation in check 3.** `movedFixture.mjs` imports `./moved-map.mjs`, which imports `./movedMap.mjs`. With only the three named files the test file cannot load, so I copied those two as well. Neither was mutated.

## Checks

**1. The commit's files.**
- `git diff --numstat f6168c99 4d28aac3` rc=0 lists only:
  - `.github/workflows/governance-ci.yml` 1/1
  - `README.md` 7/5
  - `scripts/plan/forms-layout.mjs` 12/6
  - `scripts/plan/forms-layout.test.mjs` 16/1
- `git diff --quiet f6168c99 4d28aac3 -- scripts/plan/moved-map.mjs` rc=0, so moved-map.mjs is unchanged.
- In `governance-ci.yml` the hunk is `@@ -179,7 +179,7 @@`, and the one changed line is line 182, the step's `- name:`. Its new text is `preregistration forms sit under governance/forms/ or state/ (or are docs/PREREGISTRATION-TEMPLATE.md or under docs/experiments/)`. The `run:` line is unchanged.
- Worktree HEAD is 4d28aac3, HEAD~1 is f6168c99, and `git status --porcelain` is empty.

**2. The change against Amendment 6 and the ruling.**
- **The filter.** It now reads `!f.startsWith('governance/forms/') && !f.startsWith('state/') && !ALLOWED_DOCS_FORMS.includes(f) && !f.startsWith(EXPERIMENTS_DIR)`, with `const EXPERIMENTS_DIR = 'docs/experiments/';`. That means:
  - `docs/PREREGISTRATION-TEMPLATE.md` passes by its exact path, through the list.
  - Any path under `docs/experiments/` passes, the trailing slash included.
  - Every other `docs/` form fails by name, `docs/experiments-old/` among them; T12c asserts this.
- **`ALLOWED_DOCS_FORMS`** keeps its two entries and its `export`. Its one other consumer, `moved-map.mjs:63`, still uses `ALLOWED_DOCS_FORMS.includes(f)`, so moved-map's behaviour is unchanged, as Amendment 6 states.
- **T12 and T12b are unchanged.** The test-file diff touches only line 4 (the file header comment) and appends T12c after line 46. Both tests' names, bodies and RECORDED MUTATION comments are outside the hunks.
  - T12's name stays true: its fixture's `docs/x/NEW-PREREGISTRATION.md` still fails.
  - T12b's name stays true: both exact docs/ paths still pass.
- **T12c's name is byte-equal.** A node script compared the backticked T12c name in the form on main with the test file's `test('…'` names (rc=0): `amendment name === literal: true` and `T12c in tests byte-equal: true`.
- **The quote is byte-equal.** A node script checked Amendment 6's quotation of the ruling against the directive's line 10 (rc=0): `quote length 446 in line 10: true`.
- **The text describes the rule truly.**
  - The header comment, the `ALLOWED_DOCS_FORMS` doc comment, the problem text and the PASS line each name exactly the rule the filter applies: governance/forms/, state/, the template's exact path, and the docs/experiments/ prefix.
  - The problem text is `…, and not docs/PREREGISTRATION-TEMPLATE.md or under docs/experiments/`.
  - The PASS line is `… all under governance/forms/ or state/, or docs/PREREGISTRATION-TEMPLATE.md, or under docs/experiments/.`

**3. T12c's mutation, observed by me.** I copied the files to a fresh folder under the OS temp folder (`pf-g3r-mut-OqL6/scripts/plan/`); `cp` rc=0.
- **Unmutated:** `node --test scripts/plan/forms-layout.test.mjs` rc=0. 3 tests, 3 pass, 0 fail.
- **Mutation:** I removed ` && !f.startsWith(EXPERIMENTS_DIR)` from the filter. `diff` shows only line 37 changed.
  - Rerun rc=1: `ℹ pass 2`, `ℹ fail 1`.
  - The failing test is `✖ forms-layout: any preregistration under docs/experiments/ is allowed, and nothing else under docs/`, and it fails at `actual: 1, expected: 0`.
  - Its message is `- docs/experiments/NEW-EXPERIMENT-PREREGISTRATION.md: a preregistration outside governance/forms/ and state/, and not docs/PREREGISTRATION-TEMPLATE.md or under docs/experiments/`.
  - T12 and T12b still pass. This is the prediction Amendment 6 makes.
- **Restored:** `cmp` against the worktree file rc=0. Rerun rc=0, 3 pass, 0 fail.

**4. The proof at the head, in `C:/dev/wt/pf`.**
- `node --test scripts/plan/forms-layout.test.mjs scripts/plan/moved-map.test.mjs`: rc=0, 5 tests, 5 pass, 0 fail.
- `node scripts/plan/forms-layout.mjs`: rc=0, `forms-layout PASS -- 178 preregistration file(s), all under governance/forms/ or state/, or docs/PREREGISTRATION-TEMPLATE.md, or under docs/experiments/.`
- `node scripts/plan/moved-map.mjs --check`: rc=0, `moved-map --check PASS -- governance/MOVED.tsv equals its regeneration.`
- `node scripts/plan/verify-test-claims.mjs`: rc=0, `verify:test-claims PASS — all 695 claimed test(s) across 214 file(s) exist or are planned, superseded or withdrawn (43 planned, 11 superseded, 17 withdrawn, advisory).`
- `git status --porcelain` afterwards was empty.

**5. CI.**
- `gh pr view 270`: head `cut/governance-f-tidy-repository-in-place 4d28aac3ecba72fe49457cad16029adfccbc982b`, draft.
- `gh pr checks 270` rc=0. All three listed checks pass, with none pending:
  - `cfg boundary (PORTABILITY R2)` pass (run 41015324058)
  - `ported-notices` pass (run 41015324148)
  - `test · verify:plan · queue/site drift` pass (run 41015324058)
- `gh run view` gives both runs at headSha 4d28aac3ecba72fe49457cad16029adfccbc982b, event push, completed success:
  - 41015324058, "Governance CI — plan, queue, site"
  - 41015324148, "Ported notices"
- No wait loop was needed for the checks. My one bounded poll of mergeability (20 s sleep, 240 s deadline) ended at its first reading, `CONFLICTING DIRTY` (see N1).

## Background shells
I started none, so none is running. Every call ran in the foreground. My scratch files carry the `pf-g3r-` prefix, in the OS temp folder. I made no changes to any repository or worktree.
