# PR #183 gate 1 — architect
Reviewed: cut/guardian-n1-before-auto-compaction @ 6cd8454c55cd4572ac4c222b26a0508565636c03

**Verdict: pass with notes.** I found nothing under Correctness or Evidence. There are six Documentation and record findings (D-1 to D-6). Each must be fixed in this pull request before the merge. None of them causes a correction round or a re-gate (product-first direction, section 2; `AUTONOMY.md` §22 as amended by #180). One item is carried forward to E12 and is not a finding on this PR.

How I read it: the four changed files were read whole at the head in `C:/dev/wt/gn1`, and compared with main's copies line by line. The form, Amendment 1, the P0 report, worker report 1, the brief and the two directions were read on main. Branch-only spans are named below in words. I have no shell, so nothing was run. The mutations at the gated head, §7's recount, the hunk headers, `validate`'s byte-identity, the node suites naming T35 and T36, and governance-ci on ubuntu-latest belong to the reviewer and the custodian (form §9). This verdict does not rest on the worker's figures for any of them.

## §9 Architect list

- **Gating heads: all four hold.** §21a security posture: Guardian is installed by reference, so the merge is the live change. §21a property under test: T28 (the 10-point band) and T29 (an old `flushed_at` read as fresh) are both reversed. §21c size: 209 changed lines against the 150 bound, by worker report 1's figures, which the reviewer recounts. §21c user-visible behaviour: the nudge's text and when it fires.
- **Brief §2:** no file under `scripts/hooks/` changes. N1 still refuses nothing: no deny, no catch, and the `agentId` skip is at line 468 of the branch's `register.js`. No `$` call is added. The Stop hook is untouched.
- **Brief §4, B1 to B5:**
  - **B1, the fill:** `contextFill` is at lines 437 to 451 on the branch.
  - **B2, the bands:** line 23 holds `N1_BAND = 5`. Line 477 computes the band, capped at the top band by R-1.
  - **B3, staleness:** lines 429 and 455 to 459 hold the age figure and the age check, and line 481 combines it with the judgment.
  - **B4, the text:** the threshold text, line 432, is byte-equal to the form's §7 sentence. The fallback keeps v0's text on line 36. I read B4 as speaking of the threshold route, and R-2's ground holds: saying "of the threshold" on the fallback route would state a false fact (round 7).
  - **B5:** holds.
- **The direction's items 3 and 5:** item 3's fill, 5-point bands from 80 and 10-minute age are all implemented. Item 5 holds: no Context Keeper, no meter band, nothing that blocks or defers a compaction.
- **Round 44, item 1, as item 3 changes it:** the judgment in `continuity.mjs` (lines 49 to 65 on the branch) returns the same `judged` and `stale` on every path. Only `flushedAt` is added. The age clause lives in N1, outside the judgment. The parity test's mod side reads only `stale` (`scripts/hooks/guardian-continuity-parity.test.mjs:252-254`), so T35 and T36 run unchanged. If the age clause were folded into `stale`, T35 would fail.
- **Amendment 1 against I1 and I4:**
  - I1 did not fire. The custodian's item 3 reading is sound. `autoCompactThreshold` is declared as an optional `number`, which is the right type (P0 report §1). The brief's own B1 says "carries", and the form's §2.1 sends an absent value to the fallback route, so an optional field was anticipated.
  - I4 did not fire: B1 reads 99.78 to 100.97 at the last tool call before each compaction (P0 report §3 and §4).
  - Item 7's class 2 deviations are correctly classed: the form's §5 says only I1 and I4 stop. Their substance is for the human's sight (D-6).
- **The seams and the caller rule (§1):**
  - The field names in the code (lines 440 to 443) and in the stubs (test line 62, and `bashTokens` at test line 766) are the three Amendment 1 recorded from the build's declarations.
  - The first step of B-F2 carries a threshold while auto-compaction is off. The declared type allows that shape, though the engine leaves the field out when off (P0 report §1, Optionality). Its third step leaves out the required `isAutoCompactEnabled`. That case is a robustness check on the same fallback path as the real off shape, and no code path exists only for it. So it is not an imagined interface. The end-to-end proof stays E13.
  - `flushedAt` has one product caller, the age clause (line 481). T35 proves its value against real git transitively, because it is the same parsed value that `stale` compares.
  - No export is added, and every new declaration has a product caller.
- **§0.4 against the code (§8, item 6):**
  - In `register.js`, the N1 section still opens at line 420. Above it, only lines 15 and 23 are edited, both in place.
  - In the test file, only lines 38, 39 and 62 change above line 642, where T28 is rewritten in place.
  - So v1's pins hold as §0.4 predicts. The hunk-header proof is the reviewer's.
- **Round 7 on §7's texts:** both lines state the fill and ask for a flush. Neither states another module's consequence. The threshold text is byte-equal to §7.
- **R1 to R6:** no platform branch, no path and no new OS mechanism.
- **docs/08 and ADR-006:** neither applies (form §1).
- **§8, item by item:**
  - Items 1 to 6 and 8 to 14 hold. No user-profile path is in the mod folder; I grepped it and found nothing.
  - Item 7: in T29, the edit to the trailing comment on the timestamp line rides with the permitted timestamp. I accept it as no finding.
  - Item 12: every new test carries a `RECORDED MUTATION` line with its observation commit. No `verify-mutation` run is called an observation. The worker names verify-mutation's commit, 7d24ed15.
  - Item 15: see D-2.
  - Items 16 to 19 hold, pending the merge-commit click.

## Worker report 1's deviations

1. **Sound.** §8 item 6 blocks on sight and governs over §2.6's placement. The block of observation lines at the end of the file (lines 822 to 831 on the branch) names T26 and T27 by test name and says why it is there.
2. **Sound and required.** §3's B-F5 fixes the parent at FLUSH_A, and M5b can only be observed with an old parent. §2.6's "two" is the form's own inconsistency, mine as drafter.
3. **Sound.** The edit is inside a file §7 names, and it is forced by line 5. It is not a class 9 scope addition, because §7 scopes by file.
4. **Sound.** The helpers are function declarations, so they are hoisted.
5. **Sound.** The observation commit 2f8100bc is the code that was mutated. The head adds only comments on top of it.

## Documentation and record findings (must-fix before the merge)

- **D-1.** The closing amendment records deviations 1, 2 and 3 as class 2, by reference to worker report 1's Deviations section, under the record cap.
- **D-2.** Amendment 1 cites the P0 report's hash from its line 5 to the end with no `@ <rev>` (round 15 (e)). It is also a line-carrying reference into a file that its own commit, 49d3f632, adds (round 14).
  - Fix: a correction of at most three sentences that pins the span at 49d3f632 with a sha256 the reviewer recomputes, and ends with a superseded index (round 12 (d) and (e)).
  - The closing amendment's own references to worker report 1 follow the same form.
- **D-3.** Two descriptions name only the threshold route: the header's N1 line (line 15 of the branch's `register.js`) and the README's N1 row (line 18 of the branch's README). On the fallback route the denominator is the compaction window (form §2.1 and §2.4).
  - Fix both in place; line 15 stays an in-place edit.
  - The README row should also say that the bands re-arm once the fill falls below 80 (T31).
- **D-4.** The README's N1 paragraph (line 24 on the branch) should say that `autoCompactThreshold` is the breakdown's own figure. It equals the engine's trigger only while no percentage override is set (Amendment 1, item 4; P0 report §2).
- **D-5.** The form, and the comment on line 427 of the branch's `register.js`, cite R-1 to R-4. Those readings are defined only in the architect draft's readings list, at `state/consults/2026-10-06-guardian-n1-before-auto-compaction-architect-draft.md:425-435`. The closing amendment should name that location so the labels resolve.
- **D-6.** The PR body, which is the human's basis for the typed approval, should carry two things:
  - Amendment 1, item 7, by reference: at the present `autoCompactWindow`, B1 moves N1's first line only from about 636,000 tokens to 613,600 (P0 report §3 and §5). The age clause alone carried every simulated line, and three of those lines fall within 26 seconds of the 10-minute edge.
  - §9's PR-body list: both `validate` outputs, the plugin test output with its version, and the request for a merge commit. I could not read the PR body.

## Carried forward (E12; not a finding on this PR)

`claude --version` reads the installed binary, not the running session's engine (P0 report §5, item 6; Amendment 1, item 8). `/reload-plugins` reloads the plugins but not the engine. So E13 could run at 2.1.289, which is not the build of record.

- Recommended to the human: a session restart rather than a reload (form §9, operator step 4, allows either).
- The E12 row should also carry the session transcript's `version` field.

Paths: `tools/mods/GUARDIAN-N1-BEFORE-AUTO-COMPACTION-PREREGISTRATION.md`; `C:/dev/wt/gn1/tools/mods/spatial-guardian/hooks/register.js`; `C:/dev/wt/gn1/tools/mods/spatial-guardian/hooks/continuity.mjs`; `C:/dev/wt/gn1/tools/mods/spatial-guardian/test/guardian.test.ts`; `C:/dev/wt/gn1/tools/mods/spatial-guardian/README.md`; `state/consults/2026-10-06-guardian-n1-before-auto-compaction-p0-report.md`; `state/consults/2026-10-06-guardian-n1-before-auto-compaction-worker-report-1.md`.
