# PR #214 gate 1 — reviewer
Reviewed: cut/shell-crs-form-for-format-default-contradicted @ bc0b0d7a2d386102bf8644ff47a52eed5c0fc84c

**Verdict: Correctness PASS. Evidence FAIL (E-1: one unsupported claim, low severity, cheap to fix, no e2e re-run needed under option A). Documentation: four must-fix items before the merge.**

I confirmed the worktree with `git -C C:/dev/wt/crsform rev-parse HEAD`, which gives bc0b0d7a2d386102bf8644ff47a52eed5c0fc84c. The diff is `1457fbd0...bc0b0d7a`: seven files, three commits (83fec3a7, d6140c9f, bc0b0d7a).

## Correctness: PASS

**`formFamilyForCode` and `nextFormFamily`** (`frontends/shell/src/admission/AdmissionPanel.tsx` at bc0b0d7a)
- The only code change is one branch: `if (code === "engine.format_default_contradicted") return "crs";`. The other two edits in the file are doc comments.
- I1 is intact. The conflict line `if (code === "engine.crs_assertion_conflict") return null;` still runs first and is unchanged.
- Carry-forward is intact. `return formFamilyForCode(code) ?? priorFamily;` is unchanged, so an `axis_order_unsupported` refusal after this code keeps the `"crs"` family (CF4).
- `runAdmitPath`, the `State` union and the JSX are unchanged.

**The seam to the engine**
- The form calls `admitPath` with `{ ...state.options, crsAssertion }` and the engine receives that unchanged. I read the engine side at the head.
- `dataset.rs`: an assertion over `CrsProvenance::FormatDefault` gives `admissible = None`. A non-x-first order is refused as `AxisOrderUnsupported`.
- `sanity_check` returns `NotChecked` for `Asserted`, so an assertion cannot raise `format_default_contradicted` again. This rules out §5's falsification case.
- The one end-to-end test from the real shape is ABSENTCRS' at the head: real DOM clicks on the real form, then the engine admits the file.

**Caller grep**
- No new export, callback, option or product string. `refusalGuidance` is untouched.
- `admitPath` is called only from inside `AdmissionPanel.tsx`, so no other open route skips the form.

**§8, item by item**
- 1: only `kernel/tests` is touched, and only `///` lines.
- 2: the only new family is for this code; I1, carry-forward and `runAdmitPath` are unchanged.
- 3: no CRS is pre-selected.
- 4: no new product string.
- 5: the submit goes through the form; the catalog entry is found by its label.
- 6: only ABSENTCRS' and its call-site bound are edited.
- 7: no change to the axis-order refusal.
- 8: KNOWN-LIMITATIONS is byte-copied (see below). The directive c48601ab is an ancestor of base B.
- 9: all seven files are inside §2.6.
- 10: nothing new without a product caller.
- 11: every new test has an observed mutation (see below).
- 12: the one quote is verbatim. regression.mjs's entry-80 quote, "(a), each re-aim naming the ruling AND asserting the new provenance class", matches the RULED block of 2026-09-11 (entries 76 to 82) in `DECISIONS-PENDING.md` byte for byte.
- 13: no claim that the release hold is lifted.

**CF1 to CF4, recomputed in my own scratch worktree**
- I used a scratch detached worktree at `C:/dev/wt/crsform-gate1-scratch`, ran `npm ci` there, and removed it afterwards with `git worktree remove` and `prune`.
- Clean tree: `-t "CF[1-4]"` gives 4 passed.
- I applied each mutation by `sed`, ran it with `npx vitest run src/admission/AdmissionPanel.test.ts -t <id>`, then reverted it with `git checkout`. Porcelain was empty after each.

| Test | Mutation | Result |
|---|---|---|
| CF1 | delete the new branch | fails at `AdmissionPanel.test.ts:39:69`, `AssertionError: expected null to be 'crs'` |
| CF2 | add the code to the conflict branch | fails, same AssertionError |
| CF3 | refused updater uses `formFamily: priorFamily,` | fails at `AdmissionPanel.test.ts:332:74`, the first assertion |
| CF4 | `?? null` | fails at `AdmissionPanel.test.ts:357:74`, the formFamily assertion |

All four match the worker's report.

**KNOWN-LIMITATIONS item 2: the human's words; no finding**
- I recomputed the directive pins at c48601ab:
  - lines 12-17 hash to e4bcd587…;
  - line 14 to 1e7e9e75…;
  - line 16 to 922aa3ef…;
  - all three match Amendment 1.
- I extracted the old sentence, the new sentence, and the old and new phrases from the directive by script.
- Each old span occurs exactly once at B. Applying both replacements to B's file reproduces the head's file exactly (`rebuilt equals new: true`).
- Line 60 hashes: 32793286… at B and e39d37ac… at the head, matching the worker's report.
- I checked each clause against the code:
  - "The app then offers the CRS assertion form": `formFamilyForCode` maps the code to `"crs"`, and the panel renders `CrsAssertionForm` when `formFamily === "crs"`. This holds on every open route and after any prior family (CF2).
  - "so you can assert the CRS the file is really in": the catalog and paste routes are unchanged, and H2 is observed end to end. The same paragraph names the northing-first and latitude-first refusals.
  - "a latitude-first or northing-first CRS that you assert yourself": `!crs.axis_order().is_x_first()` refuses as `AxisOrderUnsupported`.
- Both spans are true at the head. No wording-block item.

**The form's pins**
- I recomputed all 40 `path:line @ rev sha256` pins in the form against their own revs. All 40 hash as written.
- All except `engine/src/error.rs:330-336` also hash the same at B. That one moved, which is exactly what Amendment 2 item 2 records.
- The record hashes also recompute:
  - the custodian record, line 5 to the end: 590040be…b619;
  - worker report 1: e8f0ead7…b9b5d.

**Other checks**
- **The kernel test file's comments** (`generate_the_absent_crs_contradicted_fixture`) are true at the head. No Rust code changed.
- **§7's count**, recomputed with the form's command: 164 against 225.

| Group | Actual | Ceiling |
|---|---|---|
| G1 | 15 | 26 |
| G2 | 52 | 100 |
| G3 | 88 | 90 |
| G4 | 9 | 9 |

  - Outside the count: MANUAL-WALKTHROUGH.md is 19 of 20 and KNOWN-LIMITATIONS.md is 2 of 2.
  - No overrun.
- **The coverage table:** only the ABSENTCRS' row (line 93) changes. No other row's meaning changes.

## Evidence: FAIL on E-1

**E-1. The "settled" claim is not supported by the instrument.**
- In `stepAbsentCrs` at bc0b0d7a the settle wait discards its result: `  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });`.
- `waitForSettle` (`e2e/lib.mjs`) returns `{ settled: false }` on timeout. It does not throw.
- The step's return string still ends with an unconditional `; settled`.
- Three texts depend on that output:
  - the restated coverage row claims, as asserted, "and the map settles";
  - the custodian record states "The step settled.";
  - Amendment 3 item 2's "ABSENTCRS' has §3's outcome at both" takes in §3's "settled" bullet.
- None of these is established by the run. The sibling steps report `settled=${settle.settled}`, and their coverage rows do not claim settlement.
- This does not undermine H2: the admission, `crs:asserted, axis:declared` and the EPSG:2056 row are asserted.
- **Fix, option A (recommended; no e2e re-run).** Change the step to report the settle result rather than claim it:
  - `  await waitForSettle(...` becomes `  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });`.
  - The return's trailing `; settled` becomes `; settled=${settle.settled}`.
  - This is a code change, so §31 does not cover it. The re-gate is one reviewer check of that two-line diff. An applicability check under §22 holds: no assertion changes, so the e2e evidence carries forward.
  - Also make the documentation and record changes below.
- **Fix, option B.** Throw when `!settle.settled`, then re-run regression.mjs at the head for new evidence.
- **Coverage row words** (the worker's wording, not the human's; apply them with no re-gate and list them in the PR body):
  - In the asserted cell, replace `, and the map settles` with `; then the step waits for the map to settle and reports the result as \`settled=\`, without asserting it`.
  - At the end of the not-asserted cell, add `; that the map settles after the admission (reported, not asserted)`.
  - Clause check: "waits for the map to settle" matches the `waitForSettle` call. "reports the result as `settled=`" is true once option A lands. "without asserting it": there is no throw on `settled: false`.
- **Record:** the custodian appends a correction to the e2e record, within the three-sentence ceiling. Suggested words: "ABSENTCRS' at bc0b0d7a does not read `waitForSettle`'s result and reported "settled" unconditionally; "The step settled." is not established by this run. No re-run is claimed." The closing amendment should note that §3's "settled" bullet was not observed.

**The rest of the e2e evidence holds**, read from the custodian record and Amendment 3:
- base and head exit 0 for both suites;
- ABSENTCRS' gives §3's outcome at the base (with INFO `present=false`) and at the head;
- the mutation fails at `.crs-assertion-form not present after the refusal`, and every other step keeps its outcome;
- the fixture hashes are identical before and after.

**The harness** is disclosed and within the approval (item 1 of `state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md`):
- one exe served both arms, which is correct because no Rust going into the exe changed;
- the base was a scratch worktree, since removed.
- The e2e mutation edited a tracked file in the piece's worktree for a while and reverted it, with porcelain empty afterwards. That is the form's §4 method, not a harness change. No finding.

## Documentation: must-fix before the merge

**D-1. A path in Part X lost its backslashes** (`frontends/shell/MANUAL-WALKTHROUGH.md`, Part X intro, at bc0b0d7a).
- The intro reads `from \`C:devspatial-ide\``. An operator copying it gets a wrong path.
- Replace `C:devspatial-ide` with `C:\dev\spatial-ide`, the form every earlier Part uses.
- The worker's wording; apply with no re-gate.

**D-2. The call-site comment understates the step's waits** (regression.mjs, the comment above `runStep("ABSENTCRS'", 90_000, …)`).
- It says the bound covers "(one admission plus one 45s settle)". The step actually has three 20 s waits (two `clickWhenReady` calls and the admission wait) plus one 45 s settle. That is up to 105 s, so the 90 s `withTimeout` can fire first.
- Replace the comment's second line with:
  `    // outer bound for a wedged page, not a timing claim; the step's own waits (three of 20s, one 45s`
  `    // settle) can sum past it, and then this bound is the one that fails the step.`
- Clause check: two `clickWhenReady` waits at `20_000` each, one admission wait at `20_000`, one `waitForSettle` at `timeoutMs: 45_000`. `runStep` → `withTimeout` gives FAIL on the bound.
- The worker's wording; apply with no re-gate. §2.3's words in the form are append-only and stay; the closing amendment can reference this.

**D-3. §7 does not list two e2e-local values.**
- `clickWhenReady`'s two 20 s waits (the catalog entry and an enabled submit) are not in §7's list, which names only the admission wait, the settle and the outer bound.
- The worker's report mentions only the catalog wait.
- Record both in the closing amendment by reference to `stepAbsentCrs` at bc0b0d7a. They are not timing claims. Do not edit §7.

**D-4. Amendment 3 item 2's hash reference has no rev** (round 15 (e)).
- It reads `(sha256 590040be, its line 5 to the end)`: no `@ <rev>`, and the hash is abbreviated.
- The closing amendment should carry `state/consults/2026-10-12-shell-crs-form-for-format-default-contradicted-e2e-custodian-run.md @ 86c401499462aecbaf2270e84ddf2281a58b55ad`, line 5 to the end, `sha256:590040beb68025e494f2f16ee64113d6e903d5082cb06f0c7f673e3382e1b619`. I recomputed this hash.

## Runs
- **`npm run verify`** in `C:/dev/wt/crsform/frontends/shell`, in a shared hold (granted, released): exit 0.
  - Vitest: 79 files and 1199 tests passed.
  - residency-trace: 76 passed. citation-integrity: 30 passed.
  - The worktree's porcelain is empty afterwards.
- **Governance scripts at the branch head.** Tool commits: scripts/plan c813c6ab; scripts/hooks and scripts/evidence 7ce9dab2.
  - `verify.mjs`, `verify-cites.mjs` (1751 files), `verify-quotes.mjs` (121 checked) and `verify-test-claims.mjs` (543 claimed) each exit 0.
- **The same four on main** at 0ebe9383f6ac31038eb78247ffd82263b4b8d6d2 (scripts/plan c813c6ab): each exits 0.
- **`node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`** in a shared hold: 457 pass, 0 fail.
- No e2e suite was run. My scratch worktree is removed, and no edit, commit or push was made in any other checkout.
