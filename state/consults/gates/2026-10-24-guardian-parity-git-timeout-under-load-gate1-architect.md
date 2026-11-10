Reviewed: guardian-parity-git-timeout-under-load's PR at 7235aa0ce559893cf402d6ad304df6ed24a0f198, gate 1, architect
Verdict: BLOCK (Evidence, E1). Correctness: pass. Documentation: D1 and D2, both must be fixed before the merge.
cut/guardian-parity-git-timeout-under-load @ 7235aa0ce559893cf402d6ad304df6ed24a0f198

How I checked: I have no shell. I read the head file in the worktree. I read the base file in the main checkout at its current HEAD, not at e5e6e03a; the form's rule (00) note says no branch in flight touches `scripts/hooks/`. I also read `stop-queue.mjs` and `continuity.mjs` at the head, the form on main (all of it, Amendment 1 included), both reports, and Guardian v0's parity table (`tools/mods/GUARDIAN-V0-PREREGISTRATION.md`, rows PS4a, PS18 and PS19). I ran no git diff, numstat, test or hash. The one-file diff and the 113-line count come from the brief and from the worker report's numstat. The reviewer recomputes them.

**Evidence**

E1 (blocks). §4's re-observation of the three existing recorded mutations was not done, but Amendment 1, item 1 says P5 holds.
- Where: §1 "Unchanged" says the mutations re-observed are the existing ones: "T35's and T36's names, and the three recorded mutations (`:310-318`, `:337-340`), which are re-observed under §4." Those are M35a (continuity.mjs), M35b (the stop-queue inversion) and M36 (every build replaced by PS7's).
- P5 reads: "P5: the three recorded mutations fail their named tests as recorded."
- What was run instead: the worker report's "Mutations, each applied alone at 6d76bcdb" lists the three new mutations (T37's, T38's, non-vacuity). It records no run of M35a, M35b or M36.
- At the head, the three old comments still end "Observed at 54eba872". These are lines 366-374 and 401-404 of `scripts/hooks/guardian-continuity-parity.test.mjs` at 7235aa0c.
- Amendment 1, item 1's "The three mutations fail their named tests (P5)" therefore rests on the wrong three. P5 has no observation behind it.
- Why it matters: the instrument puts two new assertions ahead of T35's outcome comparison and changes T36's filter. That is the change these mutations must be shown to survive.
- Fix:
  1. Apply M35a, M35b (working tree only) and M36, each alone, at 6d76bcdb or later on the branch. Run the file, record each failure by name, and revert.
  2. Update each RECORDED MUTATION comment to name that commit and the observed failure list. That adds about 6 changed lines, roughly 119 against §7's 130; the reviewer recounts.
  3. Record it in Amendment 2 (wording below).
  4. Re-gate.

E2 (pending, not a defect). P4's governance-ci half is still open. Amendment 1, item 1 says "(P4, locally)", and §9 requires governance-ci to be green. Amendment 2 or the PR body must name the green governance-ci run at the final head.

**Correctness: no findings.** The seams were checked against the real interfaces:
- `stop-queue.mjs:44` imports `execFileSync` by name.
- `tryGit` (`:77-83`) calls `execFileSync('git', args, {...})`.
- The observer has the same signature, `(file, args, opts)`, and returns or rethrows what the original does.
- `continuity.mjs:30-40` turns a runner rejection into `null`, which reads as not judged.
- Proof from the real shape: the non-vacuity assertion (head line 395), plus the observed new mutation 3, which failed all thirteen subtests and T38.

**Documentation (must fix before the merge; no re-gate)**

D1. A §7 declared value was not met and Amendment 1 does not record it. §7 says "The hold is declared with `-Minutes` 30." The series report's L1 hold line says "-Minutes 60". This is not class 8, which covers line budgets and file counts only. It still has to be recorded.

D2. Amendment 1, item 6 says "their exit-128 reads recur in the unloaded runs" of PS4a, PS18 and PS19. The series report says "PS18 has no non-zero exit but is still not judged." The sentence gives PS18 a read it does not have.

Words for Amendment 2. These are the custodian's to append; none of them are the human's words.
```
## Amendment 2 — the three recorded mutations re-observed (class 1); written after the instrument, the series and gate 1 were seen
1. Amendment 1, item 1's "(P5)" rested on T37's, T38's and the non-vacuity mutations; §1's three recorded mutations are re-observed at <commit>, their comments now naming it (lines <a>-<b> of `scripts/hooks/guardian-continuity-parity.test.mjs` at <head commit>), each failing <names> as the run in <report path> shows.
2. L1's hold was declared with `-Minutes` 60 against §7's 30 (the series report's L1 hold line).
3. Amendment 1, item 6: the exit-128 reads are PS4a's log and PS19's show, identical in all 30 runs, L0 included; PS18 has none and is not judged by its block.
4. P4's governance-ci half: run <id> at <commit>, green.
```
Clause check:
- Item 1 is one sentence (round 12 (d)). It names a branch commit in words with no hash (round 25 (d); round 15 (e)). Its proof is a run, not a `verify-mutation` run (round 25 (c)).
- Item 2: the series report's L1 hold line gives 60; §7 gives 30.
- Item 3: the series report says "PS4a at position 0, PS19 at position 1", identical in all 30 runs on both sides, and "PS18 has no non-zero exit". `continuity.mjs:57` returns not judged when `flushed_at` is null. Guardian v0's table declares PS18 not judged.
- Item 4: closes E2.

**Not findings**
- Amendment 1, item 2's other holds beside L1 are not in either report. They are disclosed as a confound and can only raise X. B sits at its 2000 floor, so the result holds either way. The record cap would prefer a ledger reference if Amendment 2 is written anyway.
- §2 item 3's signature `timeoutFinding(calls)` became `timeoutFinding(id, calls)`. The message the form specifies contains `<id>`, which needs the parameter.

**§2, clause by clause, at the head**
- Item 1, met:
  - The runner records `{side:'mod', args, ms, exitCode: r.status, timedOut: r.error?.code === 'ETIMEDOUT'}` and still throws on `r.error` (head lines 293-297).
  - It takes an optional `program` and `prefix`, default `'git'` and `[]`; T37 is the only caller (line 418).
- Item 2, met:
  - `before()` swaps `childProcess.execFileSync` for the observer and syncs; `after()` restores it and syncs again (lines 40-50).
  - The original is captured at line 24.
  - It records only while `observed` is set, and that happens only inside `stopOutcome` (lines 319-325).
  - `substitute` is set only in T38, and reset in its `finally` (lines 430-436).
  - The substituted call passes the product's own `opts`.
- Item 3, met:
  - The message matches the form's text.
  - `isRead` keeps `log` and `show` only.
  - T35 asserts the finding is null (line 394) and non-vacuity (line 395), both before the outcome comparison (line 396).
  - T36 filters to `finding == null`.
  - The diagnostic line has the form `<id> git ms: <side>:<pos>=<ms>(exit n)`.
- Item 4, met: there is no bound commit, and the timeout stays at 2000 (line 238).

**§1**
- Claim 1: supported by T37, T38 and line 394.
- Claim 2: supported by line 393.
- Claim 3: B = 2000 follows from the rule (see §5).
- The "may not claim" items are respected.
- "Unchanged": `FIXTURES`, the two openings, `ENGINE_STDOUT_BOUND`, `maxBuffer`, the oversize check and the T35/T36 names are byte-identical to the base. The exception is the re-observation of the three recorded mutations (E1).
- No new export.

**§4.** T37, T38 and the non-vacuity change match their mutations as observed. The re-observation of the three recorded mutations is E1.

**§5**
- X = 612 ms, so B = min(10000, max(2000, 1000 × 2)) = 2000. The arithmetic is right.
- P1, P2 and P3 hold on the series report's figures. P4 is local only (E2). P5 is E1.
- I1 to I5 did not fire.
- Falsification is not met by PS4a, PS18 or PS19.
  - PS18 has no non-zero exit, so it is outside the clause's words.
  - PS4a and PS19 do carry exit-128 reads with no timeout. But Guardian v0's parity table declares all three "not judged".
  - Their exit-128 reads are the same in all 20 unloaded runs.
  - The clause is aimed at "a load-time git error" causing a misread. These are deterministic, declared outcomes and not misreads.
  - PS7's parent-show exit 128 reads as judged fresh, as `continuity.mjs:60` and Guardian v0's PS7 row require.

**§7**
- 113 lines of 130 and 1 file of 4 (the reviewer recounts). No class 8.
- The hold's `-Minutes` value is D1.
- Added test time is at most B plus 2000 ms plus spawn time. The worker's T37 + T38 came to 2270 + 2340 ms. The excess over 4000 ms is fixture-build and child-process time, which "spawn time" admits. The line sets no number for spawn time, so this is not an overrun.

**§8**
1. No change to `stop-queue.mjs`, `precompact-flush.mjs` or `tools/mods/`, and no new export. Met, on the one-file diff per the brief and numstat; the test file has no `export`.
2. Timeout unchanged at 2000, which is the rule's output. Met.
3. No timed-out read is compared as an outcome or passes. Met: line 394 runs before line 396, and T36 excludes reads with a finding.
4. Substitution happens only in T38, and the observer is restored in `after()`. Met.
5. No re-read; `computeAll` reads each fixture once. Met.
6. Neither report nor the form calls the series a `docs/08` measurement. Met.
7. Both halves ran inside shared holds, per the series report's MACHINE_HOLD and MACHINE_RELEASED lines. Met.

**Round 25 checks**
- No class 8 or class 9 event.
- No record calls a `verify-mutation` run an observation; the worker reports "No verify-mutation tool was used".
- Amendment 1 names its branch commits by id with no hash.
- This is a full form, not a five-line form.

No ADR is needed.
