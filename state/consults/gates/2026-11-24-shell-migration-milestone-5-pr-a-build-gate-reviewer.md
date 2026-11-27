Reviewed: branch cut/shell-migration-milestone-5-pr-a at 12a9aa9853b25f88deb79c6cc8af1843537f1d37 (no PR yet), in the build worktree D:/wt/m5a; the records at main 726dd41a12888aee3bbd8b960b1a1521378be4f3 in C:/dev/wt/read-1124a (the custodian's filing note, 2026-11-24: the reviewer's build gate, attempt 1, node:shell-migration-milestone-5@pr-a-build-gate-reviewer-1, dispatched at 2026-11-24T01:03:44Z; its run: Bash 138, Read 6, Write 1, SubagentHandback 1, by unique call ids, 3 calls errored; model claude-opus-5-5, from 2026-11-24T01:03:47Z to 2026-11-24T01:49:28Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T01:49:28Z. Filed below the rule from its hand-back, 15173 bytes, sha256 6e79b72fff75d3bae09c94047e5cb180b539ebecfd5558d97ae8d88bc8f35368, byte for byte, nothing masked, with one final newline added.)

---

Verdict: FAIL
Reviewed: D:/wt/m5a @ 12a9aa9853b25f88deb79c6cc8af1843537f1d37 (branch `cut/shell-migration-milestone-5-pr-a`)
REPORT PATH: state/consults/gates/2026-11-24-shell-migration-milestone-5-pr-a-build-gate-reviewer.md

The gate fails on two findings. First, the record-notice site in App uses a different interface from the one the form declares, and the store test that covers this route proves an interface App never uses. Second, the form's §0.3 re-sweep is missing. Everything else holds: all suites, the strings, the six conditions of ADV-2026-11-23-37, P0, the lock diff and the group ceilings. The worktree is clean at the head.

## Correctness (blocking)

**C-1. App's record-notice site calls `raise`, not `replaceBatch`. The form requires `replaceBatch`, and the seam test encodes an interface App does not use (§8 items 9 and 12; round 4, item 1).**
- **Where:** the `createStepQueue` report handler in `frontends/shell/src/App.tsx` at the head (the `dispatchConditions({ type: "raise", route: "record-notice", code: \`step-record-${report.kind}\`, … })` call).
- **What the form says:**
  - Amendment 4, A4-1, as amended by Amendment 6 item 2: "A route declaring `replaced-by-owner` is never raised by `raise`. … App's record-notice site (`:879`) and save site (`:2193`) dispatch it."
  - The §2.2 route row and `CONDITION_ROUTES` both declare record-notice `ends: ["replaced-by-owner", "next-open"]`.
  - At the base, App kept one notice slot and replaced it (`setRecordNotice`).
- **What the head does:**
  - A second refused step of the same kind merges into the first as an occurrence. The notice then shows the first text, then S-5, then the latest text.
  - A `not-confirmed` notice and a `not-sent` notice have different codes, so both stand side by side.
  - The declared end `replaced-by-owner` is never reached in the product.
- **Proof from the real App (PROBE-RN1):**
  - I extended C-A1 with a second refused style drag (0.30, then 0.55), using the driver's anchored replace. The file was restored afterwards.
  - Two steps were sent and one `.record-notice` element stands.
  - The S-5 lines on the record notice were **1**, where 0 was expected if the owner had replaced it: `AssertionError: PROBE-RN S-5 lines on the record notice (0 if replaced by its owner): expected 1 to be +0`.
  - This happens in ordinary use: two refused style or filter edits while the history is stopped.
- **Seam:**
  - The store test "C-U8: a record-notice batch replaces the last, whatever its code, and carries no ordinal" proves a `replaceBatch(record-notice)` path. App never dispatches it.
  - The `null`-ordinal branch of `replaceBatch` therefore has only a test caller.
  - No end-to-end test starts from App's record-notice report.
- **Other claims this falsifies:**
  - Item 10's "1 record notice, replaced by its owner (`App.tsx:879`)", the basis of the "at most 13 notices" argument.
  - The test comment at conditions.test.ts:43, "Also fails C-U3 (a raise on that route is refused)": `raise` refuses no route.
- **Fix:**
  - The report handler dispatches `{ type: "replaceBatch", route: "record-notice", code, target, generation: report.dataset, displays: [{ kind: "text", text }] }`.
  - Add an App-level test from the real report: two refused steps give one `.record-notice` showing the latest text and no `.condition-occurrences`. PROBE-RN1 has this shape.
  - Whether `raise` should also refuse `replaced-by-owner` routes is the form's call. If it does, C-U1's "Also fails C-U3" becomes true.

## Evidence (blocking)

**E-1. The form's §0.3 re-sweep amendment does not exist before PR A's code.**
- §0.3 says the re-sweep "is recorded as an amendment before any code". It re-reads the 0.2 interfaces, "runs every e2e suite at the base", lists "every e2e read that §2.3 changes (the declared selector list)", and names the Part letter and the KL numbers.
- The form on the read checkout (726dd41a) has Amendments 1 to 9, and none is a re-sweep.
- H1 is judged against "the re-sweep's declared list" (§0.4). §2.6 makes `App.streamFailure`/`App.layout` and the existing e2e suites conditional on it. Neither list exists.
- The stop-1 report's item 2 is the worker's own reading of the selectors. It is not the preregistered record, and it ran no e2e suite at the base.
- This closes if the custodian names the record or the ruling that replaced the re-sweep. Otherwise the re-sweep is recorded, and H1's list is fixed before the tester's e2e runs.

## Documentation (must be fixed before the merge)

**D-1. The mutation register's predictions do not match the head (class 2 at the closing amendment).**
- C-U1 predicted {C-U1, C-U3}. C-U3 does not fail, and C-U6 fails ("stream-terminal declares no replacement" now accepts the batch).
- C-U6 predicted {C-U6, C-A3}. No C-A3 case fails: `visibleFor` filters by generation, so App shows no change. C-U7a fails instead.
- Failures outside the predicted sets, all recorded in `<S>/m5r-mut-titles.txt`:
  - C-U2: +C-U3, C-U7, C-R2×2, C-A6
  - C-U3: +16
  - C-U5: +C-R1 (S-5)
  - C-U7: +C-U7a, C-U7c, C-R2 (S-6)
  - C-U7b: my first form also failed the C-U7 re-raise test; the faithful form (C-U7b2) fails C-U7b only
  - C-U8: +C-A6
  - C-R2: +C-A1, C-A2, C-A3, C-A6
  - C-R3: +C-A1
  - C-A1: +C-A3 "successful open clears everything"
  - E-2 and E-3: each fails all three lateResult tests
  - S-1: +C-U5, C-R1
  - S-4: all 11 App.conditions cases
  - S-7: +C-R1 session-ended markup
  - S-9: 17 tests
  - S-10: 11 tests
  - S-11: +C-R2 S-6/S-4, C-A3
  - S-15: +C-A1, C-A2, C-A3, C-A4, C-A5
- The worker's dated lines each name one test and are true for that test. The closing amendment records the observed sets above, and C-U1's and C-U6's wrong predictions as class 2.

**D-2. Two "Expected failure" comments are untrue at the head** (`frontends/shell/src/conditions/conditions.test.ts`, the worker's words). Each old text occurs once in the file.

C-U7b (neither the faithful mutation C-U7b2 nor my first form fails C-U6a):
```text
Expected failure: the stale raise is counted in notKept. Also fails C-U6a.
```
```text
Expected failure: the stale raise is counted in notKept.
```

C-U1 (true at the head as it stands; re-check it after the C-1 fix):
```text
Also fails C-U3 (a raise on that route is refused).
```
```text
Also fails C-U6 (a stream-terminal batch is then accepted, not refused whole).
```

**D-3. §7 class-8 items for the closing amendment, beyond ADV-2026-11-24-02's three.**
- The ruled three are as observed: App.conditions 534/480, conditionsConstants 26/20, package.json 2/1.
- Also to record:
  - `WorkingCanvas.wiring.test.tsx`, 51 lines. It has no ceiling, and Amendment 4 says "all of its about 45 lines are over".
  - `limits.ts` (10) and `limits.test.ts` (19). Amendment 2 adds them with no §7 figure; the closing amendment says how they are counted.
- The groups hold: A-P 632/994, A-T 1,317/1,480, A-E 402/620, PR A 2,351/3,094. The worker's figures match.
- This is a record addition, so there is no old text:
```text
Class 8 at the count, besides the three ADV-2026-11-24-02 names: frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx 51 lines (no ceiling; Amendment 4); frontends/shell/src/canvas/limits.ts 10 and frontends/shell/src/canvas/limits.test.ts 19 (no section 7 figure; Amendment 2).
```

**D-4. S-5's placeholder mark.**
- Amendment 8 gives S-5 as `[P6 placeholder] Raised {n} times in all. The latest:` and says "The placeholder mark stays as the form has it".
- ADV-2026-11-23-30 gives each string without the mark, and the code follows it (1 occurrence unmarked, 0 marked).
- The closing amendment names which governs. These are the advisor's words, so I give none.

**D-5. §2.2's `Condition` sketch differs from the code.**
- The form has `id: \`condition-${number}\``, a `lifecycle` member, and the type names `Urgency`/`EndCause`.
- The code has `id: string`, no `lifecycle` member, and `ConditionUrgency`/`ConditionEnd`.
- Behaviour is unaffected (the ends are read from `CONDITION_ROUTES`). Record it as class 3 in the closing amendment:
```text
Section 2.2's sketch as built: Condition.id is a string minted as condition-<n>; the ends are read from CONDITION_ROUTES through routeEnds, not a lifecycle member; Urgency and EndCause are named ConditionUrgency and ConditionEnd (frontends/shell/src/conditions/conditions.ts @ 12a9aa98).
```

**D-6. Branch CI.**
- Read at 2026-11-24T01:38:14Z.
- Both head runs (Product CI 45300583527 and Ported notices 45300583519, headSha 12a9aa98) succeeded.
- Run 45288214801 at `021d125a` failed (typecheck, `App.conditions.test.tsx(372,63): error TS2554: Expected 2 arguments, but got 3`; also the tauri build). This was the intermediate store-only push before the wiring, at the stop.
- Run 45296655739 at `73d72493` was cancelled.
- The closing amendment records the red intermediate push.

## Ruled items (ADV-2026-11-24-02), as I observe them
- G-1 and G-2 do not fail (22/22 pass). This matches the dated NOT FAILED lines.
- G-3 fails with `expected <div class="residency-status" …(1)></div> to be null`, as the worker recorded.
- The 2026-09-23 lines stand.
- X-1/X-2 and the four-guard lines are not at this head, as the ruling expects. The lateResult:659 comment is not checked here, as ruled.
- App.test.ts moves two pins. Each new pin matches one product line.

## Checks
- **§2/§2.6/§8, item by item:**
  - 26 files, all in §2.6 as Amendments 2, 4 and 9 amend it. Nothing is under protocol/, kernel/, engine/, src-tauri/, residency/, streaming/ or skp/.
  - The lock diff is 0 bytes.
  - Item 3: 0 hits for `.text ===`/`.text !==` in src/conditions/. Both patterns self-test positive and the negative control is clean (`<S>/m5r-textcheck.log`, rc 0). conditions.ts reads no `.text`, `.message` or `textContent`. src/jobs/ is absent (PR B).
  - Items 4 to 6, 10 and 11 hold.
  - Items 9 and 12 fail by C-1.
  - Item 13: Amendment 9 (4c278842, 23:59:56Z) comes before a17db128 (00:12:05Z). No record calls a verify-mutation run an observation.
- **Strings** (`<S>/m5r-strings.log`, rc 0):
  - S-1, S-3, S-4, S-5 (unmarked), S-6 and S-10 each occur once, byte-equal to ADV-30.
  - S-2, S-7, S-8, S-9 and S-11 do not occur (PR B).
  - S-12: 1. S-13: 2 ("the condition store's dismiss(id)"), with no setters left.
  - KL-A, KL-D and KL-E at items 77, 78 and 79 are byte-equal once the bold first sentence is removed and the line break read as one space.
  - KL-B and KL-C are absent.
  - KL comments, clause by clause: CONDITION_ROUTES, `opened`, `notKeptText`, `statusItems.ts` and the cap all hold against the code.
- **ADV-37 (a) to (f):**
  - (a) The test opens Problems through `.attention-strip button.attention-others` and finds the condition by its text among the `.canvas-refusal` elements in `#activity-panel-problems`.
  - (b) `toHaveLength(1)`.
  - (c) Test 1: the first `.canvas-refusal` contains ProducerFailed. Tests 2 and 3: the first code is `engine.no_covering_bbox`.
  - (d) By script (`<S>/m5r-3d.mjs`, log `<S>/m5r-3d.log`, rc 0; the self-test flags 17): of 150 base assertion lines, only the three replaced ones have fewer copies at the head, and all 90 nothing-on-B lines stand. The other removals are the two calls that gain `kind` (item 4). App.table only adds "Problems" to the tab list.
  - (e) E-1, E-2 and E-3 each fail their own test at the replaced exactly-once check: `expected [] to have a length of 1 but got +0`.
  - (f) As in the ruled items above.
- **P0** at `e572348b` in `D:/wt/m5a-p0-gate`:
  - npm ci ×2 rc 0. vitest rc 1: 7 files failed, 2 tests failed and 29 passed.
  - Five new files fail to load. C-K1 fails with `TypeError: ceilingKindOf is not a function`; C-K2 with `expected undefined to be 'pick-ceiling'`. This matches §5 and the worker.
  - Removed with `git -C D:/wt/m5a worktree remove --force D:/wt/m5a-p0-gate`, rc 0 (`<S>/m5r-p0.log`).
- **Mutations** (driver `<S>/m5r-driver.mjs`, mutations `<S>/m5r-mutations.mjs`; each anchor was checked to occur once, the file restored with `git checkout --`, its sha checked equal to HEAD, porcelain empty after each):
  - All 23 planned mutations, the three of item 3 (e), the three guards of item 3 (f), the 16 siblings, and X-U5b, X-R2d, X-U7d, C-U7b2 and PROBE-RN1 were made.
  - Every one failed at least one test except G-1 and G-2.
  - The sets are in D-1. Per-mutation JSON: `<S>/m5r-mut-<id>.json`.

## Runs relied on (all shared holds; hold values `<m>`; each MACHINE_HOLD was followed by MACHINE_RELEASED; C: was at least 44,049 MB free before each run)
- Baseline vitest, 8 test files plus the driver: `bash <S>/m5r-mut.sh`, rc 0. Baseline rc 0, driver rc 0. Output `<S>/m5r-mut.log`, `<S>/m5r-baseline.log`, `<S>/m5r-results-C-U1_…_X-U7d.json`.
- `bash <S>/m5r-mut2.sh` (C-U7b2, PROBE-RN1), rc 0. Output `<S>/m5r-mut2.log`, `<S>/m5r-results-C-U7b2_PROBE-RN1.json`.
- `npm run verify` (frontends/shell), rc 0: 132 files, 1666 tests passed. Output `<S>/m5r-verify.log`.
- `cargo fmt --all -- --check`, rc 0. Output `<S>/m5r-fmt.log`.
- `node scripts/plan/verify-mutation.mjs --base 6bc40126… --head 12a9aa98…`, rc 0 ("all 41 new test(s) have a recorded mutation naming them"; this is a name check, not an observation). Output `<S>/m5r-verify-mutation.log`.
- `verify.mjs`, rc 0. Output `<S>/m5r-plan-verify.log`.
- `verify-cites.mjs`, rc 0. Output `<S>/m5r-verify-cites.log`.
- `verify-quotes.mjs`, rc 0. Output `<S>/m5r-verify-quotes.log`.
- `verify-test-claims.mjs`, rc 0. Output `<S>/m5r-verify-test-claims.log`.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, rc 0: 623 of 623 pass. Output `<S>/m5r-node-test.log`.
- The wrapper for the last six runs: `<S>/m5r-suites.sh`, log `<S>/m5r-suites.log`. Porcelain empty, HEAD 12a9aa98.
- §7 count, rc 0. Output `<S>/m5r-numstat.txt`.
- `gh run list`, rc 0. Output `<S>/m5r-gh-runs.txt`.
- All runs ended by 01:47Z.

## Files read
- `C:/dev/wt/read-1124a/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`
- In `C:/dev/wt/read-1124a/state/directives/`: ADV-2026-11-23-25, -30 and -37
- `C:/dev/wt/read-1124a/state/consults/2026-11-23-shell-migration-milestone-5-pr-a-build-worker-report-stop-1.md`
- `<S>/report-m5a-build-2.md`
- `<S>/brief-m5a-rev-1.filled.md`
- `<S>/m5a-diff-12a9aa98.txt`
- At D:/wt/m5a @ 12a9aa98:
  - `frontends/shell/src/conditions/{conditions.ts, conditionsConstants.ts, ConditionView.tsx, ProblemsTab.tsx, conditions.test.ts}`
  - `frontends/shell/src/App.tsx` and its base
  - `frontends/shell/src/App.conditions.test.tsx`
  - `frontends/shell/src/App.lateResult.test.tsx`, `App.test.ts` and `App.table.test.tsx` (diffs and base)
  - `frontends/shell/src/layout/{StudioLayout.tsx, contributions.ts}`
  - `frontends/shell/src/canvas/{WorkingCanvas.tsx, limits.ts}`
  - `frontends/shell/src/console/surfaceRegistry.ts`
  - `frontends/shell/src/workspace/stepRecorder.ts`
  - `frontends/shell/e2e/{conditions.mjs, conditions-baseline.mjs, README.md}`
  - `KNOWN-LIMITATIONS.md` items 77 to 79
  - `frontends/shell/package.json`
  - `scripts/plan/verify-mutation.mjs` (header)

Model: Opus 5.5 (claude-opus-5-5).
