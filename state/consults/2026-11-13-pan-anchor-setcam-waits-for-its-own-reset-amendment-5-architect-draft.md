*Custodian's filing note (2026-11-13): the architect's read-only draft of pan-anchor's Amendment 5 (the advisor's ruling ADV-2026-11-13-08, item 1, `state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-08-round-74-pan-anchor-waits-on-its-own-lines-filler-slot-after-entry-15-findings-node-after-publish-approval.md`), read at main 428cbe91 and at the branch's commit 1, 624b2e68, from its hand-back (19360 bytes, sha256 a22bdcce49e39a3fcbd8e6cb62289ac7a867f44103b32200aef9c4832c99a629), below the rule. Its one mention of the custodian's scratch folder by path is written as `<the custodian's scratchpad>`. Each `sha256:<H>` pin that follows a full `path:line` cite is filled by script with the sha256 of the cited whole lines, each with its LF, at 428cbe91d269f059027cea6cffaaf6f0aa5cc009 (13 pins). The 7 that name their file in words (the run-build report, the same report, the series report, the seam) are left as written, and so is the draft's sentence about the brief's form. A final newline is added; nothing else is changed. Its brief by file (8511 bytes, sha256 ca8878f00798f6a7a3e988da2ef8bf05354659f34b2756b810ba42e39d6fcac0); the run 09:36:16Z to 09:48:14Z by its transcript, 30 calls (Read 18, Grep 10, Glob 1, SubagentHandback 1), none errored, no write, model claude-opus-5-5. Its OPEN-A and OPEN-B are question round 75, items 2 and 3.*

---

Drafted: pan-anchor-setcam-waits-for-its-own-reset Amendment 5 · read at main @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 and cut/pan-anchor-setcam-waits-for-its-own-reset @ 624b2e6893a39fc967eada2cc028875d3c7d767c (read only; a draft, so no verdict)

```
## Amendment 5 — the fix's shape: setCam waits for its own line with no wall-clock bound (the advisor's ruling ADV-2026-11-13-08, item 1); main merged first; the probes, a loaded run and the gate (class 1, written after results were seen)

*Written after the results of P1 at commit 1 (Amendment 2 item 1), of P1-D (Amendment 2 item 3) and of the diagnostic's three runs were seen. Drafted by the architect, read only. References only. Commit 1's lines are named in words at 624b2e6893a39fc967eada2cc028875d3c7d767c, with no hash, because that commit is not on main (round 15 (e); `docs/PREREGISTRATION-TEMPLATE.md`, Round 25 additions, item 2 (d)). The fix is the first of the two the human named (`state/directives/2026-11-11-1c-open-7-1-a-p2-now-pan-anchor-route-b-diagnostic-now-stall-record-two-runs.md:20` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:d2efcda201e586ff1eabcfc49d7afaa8bec1be280c69a3513a0fbce5a654d6e2, a sub-line span carrying its line's hash), as Amendment 4 item 2 proposed. Reuse index (the custodian's run of 2026-11-13 at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c): no prior art for either search (e2e test wait console log line predicate; test harness timeout under load event wait). That miss is noted here. Nothing above is edited.*

1. **The shape of the wait.**
   - **setCam** waits for the first line in `vs` whose `zoom` exactly equals the zoom of its own call. This is commit 1's match, and it is kept. The wait has no wall-clock bound, and it ends in one of three ways:
     - (i) the line is in `vs`, and setCam returns it;
     - (ii) the seam resolves to anything other than `true`, and setCam throws at once with an Error that names setCam and the value. The seam resolves `false` and logs nothing when no canvas or deck is mounted (`frontends/shell/src/canvas/WorkingCanvas.tsx:2357` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:affdb01a6703c3f32973feba0842d69015594c0ffd9d345ec67fbf12389b02f3; `frontends/shell/src/e2e-test-surface.ts:319-320` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:d6349bc1e57a46510d5f96dfa708b670a90109c35e5fc174e0ebbe43f475cd95). Without this throw, that case would wait for a line that can never come;
     - (iii) in every other case, the hard `timeout` that the harness's run-suite step puts around the run ends the process. A run ended this way has no check result. It is recorded as ended by the timeout, never as a PASS or a FAIL, and the custodian re-runs it alone.
   - While it waits, setCam prints one progress line for every 30 s of waiting. The line names setCam, the zoom, the seconds waited and how many other lines have arrived. It contains none of `PASS`, `FAIL` or `====`, and it ends nothing.
   - **Why load cannot break it.** No check's outcome depends on how long the wait takes. A stall makes the run longer; it cannot turn a check into a FAIL. The only bound left is the run's own, and when that bound is broken the result is no result, not a failure. The sizes this rests on:
     - the longest kept page stall, 35874 ms (`state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-build-worker-report.md:297` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:c4f43af6b3a9cc3b83b06ed058b88a833e1a906159b1d970a1fbfaaecdf3e673);
     - the longest gap from receipt to push, 22068 ms (the same report, :305 @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:<H>);
     - the longest setCam interval, 18729 ms (`state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-quiet-worker-report.md:262` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:6a32bbe3bbd911b2172d490ba4784d3e8175bb733d356871eee3c36e8367fc15);
     - call 7's push 2.6 s after its receipt, and call 14's timer still unfired at the bound (`state/consults/2026-11-10-pan-anchor-setcam-waits-for-its-own-reset-p1d-worker-report.md:65-66` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:688fa22a7b986d79f249bc2afe7267d0b0d3c407edee2d883a0f926ef947be5a);
     - P1's throw at commit 1, on the bound (`state/consults/2026-11-10-pan-anchor-setcam-waits-for-its-own-reset-build-worker-report.md:44` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:047093b272258ee3c962132e98302a6b50876c9e55789c141af260501f738692);
     - whole loaded runs of 8 min 48 s (run-build report :61-62 @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:<H>) and 7 min 2 s (`state/consults/2026-11-13-b1-shell-half-pr-b-series-at-m-prime-tester-report.md:84` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:58b292e56e6adee586327c684adebf06679dd2079c2d84b5c0fe812edfa9f8ce);
     - the harness's hard timeout of 1500 s, which was not reached (run-build report :81 @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:<H>).
   - **drag** waits until the pushes go quiet (`frontends/shell/e2e/pan-anchor.mjs:114` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:01b240a37b62195a180284d3309274315a5a972e1e3e760ea61a814112cde058; `frontends/shell/e2e/lib.mjs:348-369` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:b8de0367e9d6ac10206551d7093797d650c401b30412c76e40fdfdd739afa1af). That is a wall-clock wait that load can break: s1 was read one line behind in four recenter-crossing drags (run-build report :335-336 and :342-343 @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:<H>). It is not part of this piece, because OPEN-1 (A) (Amendment 1 item 1) keeps the scope to s0. This amendment's OPEN-A puts it to the advisor. No other wait in the file depends on a view-state line.

2. **What commit 1 keeps.** These are lines of `frontends/shell/e2e/pan-anchor.mjs` at 624b2e6893a39fc967eada2cc028875d3c7d767c, as the worker's next commit treats them:
   - line 93 (`SETCAM_BOUND_MS`): deleted;
   - lines 98-99 (the zoom computed once, and the clear): kept;
   - line 100 (the seam call): kept. Its resolved value is now read, and any value other than `true` throws, as in 1 (ii);
   - line 101 (the 500 ms minimum): kept;
   - lines 102-106 (the comment): rewritten from the built code under Part 1, item 1. It must cover:
     - what the wait matches, and why that line is the reset's;
     - that the wait has no bound, what ends it (1 (i) to (iii)), and the progress line;
     - that the wait is a precondition, not a property;
     - that a late line from the previous gesture stays in `vs` and is not read;
     - that `s1` is not covered;
   - line 107 (`own`): kept;
   - line 108 (five turns of 1000 ms): replaced by a loop with no turn limit. Each turn still sleeps 1000 ms (OPEN-3 (B)'s cadence is kept), and every 30th turn prints the progress line;
   - lines 109-110 (the throw when nothing matches): deleted;
   - line 111: returns the matched line;
   - commit 3 adds one `RECORDED MUTATION` entry for M-TRACE to the file's header.
   - Superseded here, and not edited: the Change line's hard-bound clause; the M-TRACE prediction in the Tests+mutation line (exit 2 with the bound's message); note 2's paragraph on the bound; and OPEN-4 (A) as it applied to the bound. OPEN-4 (A)'s throw still stands, for 1 (ii).

3. **The base.**
   - Before commit 2, main is merged into the branch by a merge commit, never a rebase. B′ is the merge's main parent, named by its id at dispatch (main is 428cbe91d269f059027cea6cffaaf6f0aa5cc009 at this draft).
   - Why: `WorkingCanvas.tsx` changed on main, so the probes must run against the product this piece merges onto. `pan-anchor.mjs` and `lib.mjs` are unchanged from 1cc69e44 to 428cbe91, so the Scope file comes through the merge exactly as commit 1 left it.
   - Pins: every pin here is at 428cbe91. If B′ is a different commit and a cited file under frontends/ has changed, the custodian re-pins that cite at B′ before dispatch.
   - M-TRACE's line at this base is `frontends/shell/src/canvas/WorkingCanvas.tsx:2369` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:07b16e9017f1af73a5f49ecd61bd4d5830c365928433dcab347e6f56b2d78ea7. It sits in the seam at :2353-2378 @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:<H>, which logs it before resolving `true` at :2377.
   - A new debug exe is built only if src-tauri changed between 1cc69e44 and B′ (note 4's rule).

4. **The probes.** Each is one Bash call inside `hold shared -Project SpatialIDE`, under note 4's shared conditions. Each run's record names the run-suite file, its sha256 and the timeout the run was given, because that step is untracked (round 15 (c)).
   - **P0 at B′**, the reviewer's re-observation (OPEN-5 (A)): note 4's wrapper. Predicted as note 4 has it: exit 1, both `pixel-spaces-coincide` checks PASS and the other 14 FAIL by name. Its STOP rule is unchanged.
   - **P1 at the head**, with the same wrapper: predicted exit 0, `==== 16/16 PASS ====`, and no `pan-anchor.mjs fatal:` line. Any progress lines are recorded as observed.
   - **M-TRACE at the head**: the zoom argument on line :2369 becomes `zoom + 1e-6`, as a worktree edit that is reverted afterwards. This probe alone gets a hard timeout of 600 s. Predicted: `PASS  small: pixel-spaces-coincide`, then no further check line, then at least one progress line naming the first call's zoom (-1 + 1e-5, printed the way JS prints it), until the timeout ends the run. A check line after the first one, or no progress line at all, is a STOP. The failure is recorded by name in the header's `RECORDED MUTATION` entry, with the 40-hex id of the commit it was observed at (commit 2), in commit 3. A verify-mutation run is not an observation.
   - **R1 at the head**, unmutated: exit 0, `==== 16/16 PASS ====`.
   - **L1 at the final head, under load**, in a single shared hold:
     - a cargo build of the worktree into a scratch target starts before the suite;
     - the process lists show the build alive at the suite's start and at its end;
     - the build is killed afterwards and its target removed. This is the diagnostic's run-build shape (run-build report :53-81 @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:<H>).
     - Predicted: exit 0, `==== 16/16 PASS ====`, no fatal line.
     - Any departure is a STOP, recorded as a class 2 deviation with its failing lines. It is not re-run to get a pass, and it goes to the advisor.
   - **P1-D's wrapper is not reused.** The question it asked was answered by the diagnostic's grade (Amendment 4 item 1).
   - **The port.** Runs use the port-5400 harness, as the series of 2026-11-13 did (series report :5 @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:<H>), under the human's ruling (`state/directives/2026-11-09-304-open-b-a-widened-303-clicked-pef-open-2-a-open-5-listen-test-then-5180.md:13` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:ce7039173e17b0d97e79271ec8a978ad62fc1dfa29cdd071fd2cf74f6be8bd18). They move to 5180 once the human gives the word and a listen test passes. A run already begun on 5400 finishes there. The custodian names the port at dispatch.
   - **Claim limit**, extending note 4's: setCam's wait has no wall-clock bound. The file's other waits keep theirs: drag's, waitForFill's 20 s, settleCanvasSize's 20 × 200 ms, resizeWindow's 700 ms and setup's 1500 ms. No record says the suite has no wall-clock bound.

5. **Scope and size.**
   - One file: `frontends/shell/e2e/pan-anchor.mjs`. The e2e README has no pan-anchor entry at 428cbe91 and is not changed.
   - The budget stays at 40, as the Scope line declares. Commit 1 is 19 (13 insertions, 6 deletions).
   - The estimate for the final diff, with the header entry, is 20 to 28. It is counted at the final head by `git diff --numstat <B′> <head> -- frontends/shell/e2e/pan-anchor.mjs`.
   - An overrun is recorded as class 6 before the commit that causes it. The Scope line is never edited.
   - §21a: none of the four categories is touched. The Out-of-scope line stands, and no check, residual formula or tolerance changes.

6. **The gate.** A single reviewer (OPEN-6 (A)). At the final head, the reviewer:
   - checks the Out-of-scope reading first;
   - reads the diff against 2;
   - runs P0 at B′, then P1, M-TRACE and L1, each in its own Bash call inside `hold shared -Project SpatialIDE` (L1's hold also holds its load build);
   - reads R1, and reads the worker's runs as the fallback;
   - runs the readiness checks as note 4 has them: `node --check`, `npm run verify` in a shared hold, the scripts' `node --test`, `verify:plan`, `verify:cites` and `verify:quotes`.

7. **PR B's record.** Nothing changes. PR B's Amendment 13 reads the alone re-run of pan-anchor using the suite at PR B's own head (ADV-2026-11-13-08, item 3). No run of this piece counts as evidence for PR B, and that re-run names the commit of the suite it ran.

- **Order:** the merge commit; commit 2 (setCam); M-TRACE observed at commit 2; commit 3 (the header entry); the runs at the final head. The PR body names commit 1 and asks for a merge that keeps it reachable from main, never a squash.
- **Rule (00):** this piece touches pan-anchor.mjs alone. That is disjoint from PR B (no path under e2e/ or protocol/) and from the publish approval draft (`e2e/publish.mjs` and the README's Publish entry). No protocol/ path. It is checked again at dispatch.
- **Unchanged:** Scope, Out-of-scope, the tolerance, every check, note 5's list, and the s1 sentence in note 4's claim limit.
```

**OPEN items** (for the advisor; none touches the human's item 4 of the grant: no dependency changes, and nothing changes in what CI installs)

- **OPEN-A. drag's wait and s1.** This changes the scope of something already ruled (OPEN-1 (A), the human's ruling), so it is the advisor's to decide under the delegation.
  - (A) Bring it into this piece as a class 9 scope addition, declared before any code. drag's existing settle stays. After it, the suite logs a barrier line (text without `view-state`) and waits, with no bound, until every view-state receipt that came before the barrier's receipt has been pushed; setup's listener keeps counters for this. It rests on two premises:
    - Playwright delivers one page's console events in the order they were emitted. This is unproven; the evidence is the 558-of-558 in-order match at run-build report :301.
    - The gesture's last line is emitted before the barrier's evaluate runs. This depends on when deck emits pan-end, which I have not read.
    - Cost: about 10 more lines, plus its own probe and mutation.
  - (B) Leave it out. The claim covers setCam's wait only, drag's wall-clock wait is named in the claim limit, and the advisor can place a node for it.
  - **Recommendation: (B).** OPEN-1 (A) stands. Amendment 4 item 2 aimed the fix at the failure the stalls cause in s0 (run-build report :320 and :327; series report :134-142, all 1100.01). (A)'s second premise is an interface I have not read, and a wait written against it would be written to an imagined interface.
- **OPEN-B. What ends a wait that never comes.** Not a red line.
  - (A) The harness's hard timeout, with the progress line (item 1 (iii)).
  - (B) A 120 s bound inside the suite that throws the named Error (exit 2). That is more than three times the longest recorded stall (35874 ms), and it would give M-TRACE an exit 2. But it is still a bound that load could break; the records only show that no recorded load has reached it.
  - **Recommendation: (A).** It meets the ruling's words, while (B) meets them only as far as the records go. One related point: §37's hard-timeout clause (`governance/AUTONOMY.md:703` @ 428cbe91d269f059027cea6cffaaf6f0aa5cc009 sha256:ff241345b6faec828fad7670037800e961fba6a4aa6c440c3bd235b1b1c6bfbd) is written for agents' briefs, and the form's OPEN-3 borrowed from it for the cadence. If §37 is read as applying to the suite, then under (A) the run's timeout is the loop's hard end. The advisor confirms that reading.

**Gate findings (not ruled)**

Evidence and Correctness:
- None.

Documentation (all must be fixed before merge):
1. The brief asks for commit 1 to be cited as `path:line @ 624b2e68 sha256:<H>`. That form is forbidden: round 15 (e) and the Round 25 additions, item 2 (d), bar a hash pin at a branch commit, and commit 1 has never been pushed. The draft names commit 1's lines in words, with the full id.
2. ADV-2026-11-13-08 exists only in the custodian's scratch copy. It has to be on main before Amendment 5 is committed (round 14: nothing tracked may cite an untracked file as Authority).
3. The brief refers to "the e2e README's pan-anchor entry". I searched `frontends/shell/e2e/README.md` on main for pan-anchor and found nothing, which matches the Scope line.
4. Several form claims are superseded. Item 2 names them by section: the Change line's hard bound, M-TRACE's exit-2 prediction, note 2's bound and OPEN-4 (A)'s bound. The closing amendment must list them as superseded.
5. Commit 1's comment (lines 102-106 at 624b2e68) says the wait is bounded by `SETCAM_BOUND_MS`. That becomes untrue under this amendment, and the rewrite replaces it.
6. A budget overrun on this short form would be class 6, not class 8 (class 8 is for full forms).

**What I read**
- <the custodian's scratchpad>/brief-pa5-draft.md (<S>/brief-pa5-draft.md) and <S>/adv-2026-11-13-08.md
- C:/dev/spatial-ide/governance/forms/frontends/PAN-ANCHOR-SETCAM-WAITS-FOR-ITS-OWN-RESET-PREREGISTRATION.md (whole)
- C:/dev/spatial-ide/state/directives/2026-11-11-1c-open-7-1-a-p2-now-pan-anchor-route-b-diagnostic-now-stall-record-two-runs.md
- C:/dev/spatial-ide/state/directives/2026-11-09-304-open-b-a-widened-303-clicked-pef-open-2-a-open-5-listen-test-then-5180.md
- C:/dev/spatial-ide/state/consults/2026-11-10-pan-anchor-setcam-waits-for-its-own-reset-build-worker-report.md, …-p1d-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-{quiet,build,measure}-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-11-13-b1-shell-half-pr-b-series-at-m-prime-tester-report.md (result line, table rows, failing lines)
- C:/dev/wt/pa/frontends/shell/e2e/pan-anchor.mjs (whole); C:/dev/spatial-ide/frontends/shell/e2e/pan-anchor.mjs (:88-117); C:/dev/spatial-ide/frontends/shell/e2e/lib.mjs (whole); a search of C:/dev/spatial-ide/frontends/shell/e2e/README.md
- C:/dev/spatial-ide/frontends/shell/src/canvas/WorkingCanvas.tsx (:2345-2384); C:/dev/spatial-ide/frontends/shell/src/e2e-test-surface.ts (the hook's type and registerE2eHook)
- C:/dev/spatial-ide/governance/AUTONOMY.md §21b-§21d, §36, §37; C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md (classes 1-7, Round 25 additions)

**Packet gaps** (facts I needed that the brief did not give)
- The text of PR B's Amendment 13. It is not on main, so item 7 rests on ADV-08 item 3 alone.
- The run-suite script for this piece's harness: its name, sha256, how its timeout is passed, and its exit code on timeout.
- Whether src-tauri changed between 1cc69e44 and 428cbe91 (this decides whether the exe is rebuilt).
- Whether `<S>/pa-p0.patch` and `<S>/pa-p1.patch` still exist (they date from 2026-11-10 and scratch is cleaned after seven days), and their sha256.
- ADV-08's path once it is on main.
- I have no shell, so I could not confirm that the checkout HEAD was 428cbe91 or that the worktree HEAD was 624b2e68.
- When deck emits pan-end relative to the resolution of `Input.dispatchMouseEvent` (needed only for OPEN-A (A)). This is not in the repository.

**The reuse index, byte for byte as the brief gave it:**

```
$ node tools/reuse.mjs e2e test wait console log line predicate
No prior art recorded for "e2e test wait console log line predicate". Research it before planning an implementation.
rc=1
$ node tools/reuse.mjs test harness timeout under load event wait
No prior art recorded for "test harness timeout under load event wait". Research it before planning an implementation.
rc=1
```

**Model:** Opus 5.5 (claude-opus-5-5), as the harness reports it. I started no background shells and leave none.
