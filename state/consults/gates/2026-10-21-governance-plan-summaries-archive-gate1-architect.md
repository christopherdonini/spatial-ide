Reviewed: PR #237 at 2d60ac164e7a65e29e5e55a27eaa202062d31b83 (base b5c1c841), gate 1, architect
Verdict: FAIL

Branch: cut/plan-summaries-archive @ 2d60ac164e7a65e29e5e55a27eaa202062d31b83. I read the code at the worktree C:/dev/wt/psa (the head) and the form, the sheets and the directives on main at b5c1c841.

## Correctness

**C1 (blocks). R15, the seam test, fails as soon as S10 lands, and on main after the merge. It is written against PLAN.yaml as it was before the move, not as the piece leaves it.**
- **Where:** `scripts/plan/rotate-plan-summaries.test.mjs:342`. The temporary repository gets the real PLAN.yaml plus two synthetic nodes, and nothing else.
- **Why it fails:** at S10 the real PLAN.yaml holds 99 pointers. That is 153 candidates minus the 54 `stays` rows (Amendment 3 item 3). `main` calls `findCandidates` with `holds` (`scripts/plan/rotate-plan-summaries.mjs:185-188`) before it checks whether the run is due. `holds` runs `git show HEAD:state/cut-archive/<name>`. The temporary repository has no archive, so that call fails, the catch returns false, and line 45 refuses. `rot(dir)` then exits 2, and `assert.equal(run.status, 0, …)` at :353 fails.
- **Consequence:** D1-b's "`node --test` counts equal" fails, which is I2. Governance CI also turns red on the PR at S10 and on main after the click.
- **A second fault in the same test:** `gone.length >= 2` at :357 holds only while the real PLAN.yaml still has an unkept done summary over 300 bytes. Right after a rotation that keeps nothing, `gone` is the synthetic node alone, and the test fails on main. That case is reachable in ordinary monthly use.
- **Fix, before S9:**
  - R15 commits every `state/cut-archive/PLAN-SUMMARIES-*.yaml` from REPO_ROOT into the temporary repository in its first commit. That commit is dated PAST, so the run is still due, and a same-day name takes `-2`.
  - :357 becomes `gone.length >= 1` with the `synthetic-long-done` check kept.
  - Re-record MR15 at the fixing commit.
  - Show the fix against a rotated real tree before S10: run R15 in a throwaway clone where the script's move has been committed, as in Amendment 3's clone. That run is named in the next amendment.

**C2 (low; fix in the same round). After the move is staged, a failing git call prints that nothing was written.**
- **Where:** after `git add` (:229), the git calls at :234, :236 and :237 run outside the `try` at :226-232.
- **Why:** a failure there throws `Refusal` through `run` (:170). The top-level handler (:246) then prints `refusing — … Nothing was written.`, but both files are written and staged by then.
- **Fix:** put every statement after the first write inside the `Stop` path, so that any failure after line 225 is a STOP.

## Evidence

None blocking. Disclosed, not a finding: R8a's CLI half shows a locator refusal, not a round-trip mismatch (Amendment 2 item 4). That a mismatch writes nothing rests on code order, with the refusal at :210 before the first write at :225. MR8a fails R8a through its `verifyMove` half. I accept this as disclosed.

## Documentation (must be fixed before the merge; no re-gate)

None of these is the human's wording, so the worker applies the words and the PR body lists them.

**D1. `scripts/plan/README.md:375`, the exit-code sentence.** Its "2" does not cover a STOP on a failed write or `git add` (:226-232). It also does not cover an unexpected error, which prints a stack (:246), for example C's `Refusal` thrown by `parseUnits` during a dry run. These words assume C2's fix:
> Exit codes: 0 (it staged the move, was not due, had nothing to move, or printed a dry run) and 2 (it refused, or stopped on an unexpected error, before writing anything; or STOP, when anything failed after the first write, with nothing rolled back).

Clause check:
- The 0 cases are :193-196, :197-200, :212-222 and :239.
- "Refused … before writing": every `Refusal`, `YamlSubsetError` and `PlanValidationError` is thrown before :225, once C2's fix is in.
- "Unexpected error": the stack branch of :246, reached before any write.
- STOP: :226-235, and after the fix everything after :225.

**D2. `scripts/plan/README.md:377`, the first sentence.** "When due it stages two files" is untrue for a due run with nothing to move (:197-200) and for a dry run (:212). Replacement:
> When it is due, has something to move and is not a dry run, it stages two files and nothing else: `PLAN.yaml` with each moved summary line replaced by one generated pointer, and a new `state/cut-archive/PLAN-SUMMARIES-<date>.yaml` holding each moved node's id and its summary line byte for byte.

Clause check: the gates are :193, :197 and :212; the two files are staged at :225-229; the pointer comes from :74-80; the archive's content from :81-82.

**D3. `scripts/plan/rotate-plan-summaries.test.mjs:2-4`, the header comment.** Two problems:
- "a é escape" should name the `\u00e9` escape that :75 holds.
- "No date is typed" is untrue of the fixtures, which type dates at :82, :117, :217, :221-222, :280, :282 and :294.

Replacement for the words from "a \" escape" to the end of the comment:
> a \" escape, a \u00e9 escape, a ` #` sequence, a `: ` sequence and a trailing comment. The dates the assertions read are not typed: the archive's name comes from the machine clock, the past from epoch arithmetic; the fixture dates (the 2020-01-01 archive names, the nodes' opened date, the RESOLVED marker's date) are data no assertion compares with the clock. A run across UTC midnight can fail the tests that read today's date.

Clause check: PAST comes from epoch arithmetic (:23); `today()` reads the clock (:24); the typed dates sit at the lines listed above. Read across the tests, none of them reaches the due rule or the name.

**D4. The record, one correction under round 12 (d) in the next amendment, references only.** Four defects:
- Amendment 2's first line names class 8 but does not carry the class's first-line words, `budget overrun, §7 not edited` (Round 25 additions, class 8).
- Amendment 2 item 4 labels deviations from §2 and §4 as class 3, which "never changes a claim". MR9 at two sites and R8a's CLI half change what §4 states. They are class 1 content, and the amendment's first line already says it was written after the results were seen.
- The sheet sha256s in Amendment 2 item 3 and Amendment 3 item 3 carry no `@ <rev>` (round 15 (e)).
- §8 item 6's second bullet and §2 item 11's F0 bullet still state OPEN-5 (A)'s full freeze, although Amendment 1 item 5 ruled (B).

Words; the custodian fills each rev by script with the main commit that adds that sheet:
> Amendment 2's item 5 is this piece's class 8 entry, budget overrun, §7 not edited, and its item 4 is read as class 1, the amendment's first line saying it was written after the results were seen. The sheet hashes of Amendment 2 item 3 and Amendment 3 item 3 are read @ <rev of the commit adding each sheet>. §8 item 6's second bullet and §2 item 11's F0 bullet are read under Amendment 1 item 5 (OPEN-5 (B)): a held commit is one touching PLAN.yaml, CUSTODIAN-QUEUE.* or site/.

## Block-on-sight (§8)

1. Not triggered. S10 is not built. `verifyMove` checks the line count and that no stray line changed (:105-110).
2. Not triggered. The archive line is P's line, checked at :111-115 and by R1.
3. Not triggered. `done` and `Buffer.byteLength > 300` at :47; the pointer regex at :23 matches §2 item 3.
4. Not triggered; S10 is not run. `--keep` is R13. Mind I9: the 54 stays ids go to `--keep`.
5. Not triggered:
   - `.claude/settings.json` at the head has 0 matches for `rotate-plan-summaries` (Grep).
   - No commit, push or fetch argument to git. The commit and push appear only inside the printed "Next" line (:238).
   - The not-due, nothing-to-move, dry-run and refusal paths all return or throw before :225, with C2's exception.
   - `hash-object` runs without `-w`.
6. Not triggered at the head. The merge, F0 and generated-file parts are not reached. The freeze bullet is read under D4.
7. Not run by me (no shell). At the head, §35 starts at AUTONOMY.md:668 after §34 ends at :666, and the README section starts at :367 after :365. The reviewer runs the `cmp`.
8. Not triggered on reading. The line locator `locate` is the one §2 item 2 specifies; every value comes from `parseYamlSubset` or `loadPlan`. I could not diff `measure-reads.mjs`, `yamlSubset.mjs` or `plan.mjs`; that diff is the reviewer's.
9. Not checkable without a diff. The worker reports 4 files (`653 4`).
10. Not triggered on the reading that §2 item 10 is about dates claiming time. The fixture dates are data (D3).
11. Not triggered. Grep finds no `PLAN.yaml:<n>`, `DECISIONS-PENDING.md:<n>` or archive line cite in the script, the test, the README, AUTONOMY, the form or either sheet.
12. Not triggered. The test comments at :54-55 and the report say no verify-mutation run is an observation.
13. Not triggered. The report gives M-1 to M-3 at M0, twice each, with the environment facts and the digest, which equals A's S1.
14. Not triggered.

## What I checked, with evidence

- **Check 1, §8:** above.
- **Check 2, the seam from the real shape.**
  - I read the imports against the other side's actual exports:
    - `loadPlan` (plan.mjs:50-67, `_meta.text`) and `validatePlan`;
    - `archiveNameFor(date, taken)` (rotate-cut-state.mjs:40-46);
    - `isDue` (rotate-decisions-pending.mjs:74-81, `new Date(nowIso)` takes a Date);
    - `parseUnits` and `classify` (:43-71);
    - `buildQueue`, `renderMarkdown` and `checkQueueDrift` (queue.mjs:59, :105, :231);
    - `renderSite`, `checkSiteDrift`, `readVerifyQuotesBaselineCount` and `findMetricViolations` (site.mjs:731, :844, :804, :52).
  - R1-R3 drive the real CLI on fixtures. R15 drives it on the real PLAN.yaml, and its run passes `verifyMove`'s R1-R3 assertions on the real text. Its defect is C1.
  - E-R's `summaryLines` (buildHealth.mjs:258) and `buildSummary` (questions-mirror.mjs:54) exist as exports.
- **Check 3, §2 item 1 against the human's items 1 and 5.** It holds:
  - `STATUSES` is the closed six (plan.mjs:13), and only `done` moves.
  - The human's item 5 maps to R6, R5, R7 and R8a-c.
- **Check 4, the resolved sheet.**
  - The `no obligation` rows: 87 lines with `none` in the markers column, and 87 rows resolved `no obligation`; 89 lines contain "no obligation", the other two being the sheet's prose at :6 and :10. The other 66 rows are 54 `stays`, 9 `home` and 3 `not owed`, 153 in all.
  - The 3 `not owed` rows (accept-adr-015-a1, accept-adr-028-qualification, accept-adr-032; marker `queued`): each summary reads "DONE 2026-09-24 at PR #103", and the queued thing is that click (PLAN.yaml read at b5c1c841). The proof matches, and its short form b0032c8 agrees with each node's verdict cite. I could not verify the full id.
  - The 9 homes: each home node's status is not done (proposed, unscheduled or blocked), and DECISIONS-PENDING entry 115's head carries no RULED, RESOLVED or APPLIED marker, so it stays open. Each home carries the row's obligation:
    - lod-tier-selection carries the build_tiers precondition and the lifecycle, through engine/LOD-PREREGISTRATION.md §(c);
    - decision-adr-029-scan-progress-route, governance-ci-built-site, briefb-b2-save-reopen (its Prepare intent), engine-cancel-before-execute-siblings, audit-show-invalid-utf8-whole-refusal and first-external-plugin-skp-client each carry it.
  - No home names a place that lacks its obligation.
- **Check 5, E-R against the addendum.** The table names all four readers with an output before and after. buildHealth follows OPEN-4 (A) as ruled. A difference is recorded as the piece's own. It holds.
- **Check 6, the clause check.**
  - §35 Part A at the head matches the directive's line 23 after the label, by reading; I could not recompute the hash. Part B (i) to (vi) at AUTONOMY.md:680-685 is identical to the form's draft that the human approved, and each clause holds against :39-51, :72-128, :191-196 and §32 (:561).
  - The README's Part A copy matches. Its :375 and :377 fail as D1 and D2.
- **Check 7, the amendments' classes:** D4. Amendment 3 is class 1, and its first line says it was written after the dry run was seen. Amendment 2 items 3 and 5 check out arithmetically: 28 − 9 − 3 + 38 = 54, and 249 + 373 + 12 + 19 = 653.

**Not run** (no shell): `gh pr view 237` (the PR body), any `git diff`, the `cmp` of §8 item 7, the counting command, every sha256, every test and mutation. These are the reviewer's.

**Observation, not a finding:** `holds` runs one `git show` and one full parse per pointer on every run (:185-187), so each run's cost grows with the number of pointers. Caching by archive name would bound it.

Files: C:/dev/wt/psa/scripts/plan/rotate-plan-summaries.mjs, C:/dev/wt/psa/scripts/plan/rotate-plan-summaries.test.mjs, C:/dev/wt/psa/scripts/plan/README.md, C:/dev/wt/psa/AUTONOMY.md, C:/dev/spatial-ide/scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md, C:/dev/spatial-ide/state/drafts/2026-10-21-plan-summaries-d-obligations-g0-resolved.md
