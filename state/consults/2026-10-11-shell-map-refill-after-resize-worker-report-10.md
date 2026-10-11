*Custodian's filing note (2026-10-11): shell-map-refill-after-resize worker report 10, the one commit of the form's Amendment 6 (the human's (C) on gate 4's C1; D1 and D2), the worker run 12:58:12Z to 13:03:29Z by its transcript, on cut/shell-map-refill-after-resize, head edfa187fbd7817ff493159e4ed90fdf046eaf738, published; the doc comments' words are the worker's. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 4c5858768ed0e4263608c4653ef06a11c805b2776cd4401ae00ff66b3e8ff9b4.*

---

New head: edfa187fbd7817ff493159e4ed90fdf046eaf738. It is pushed with a plain push (66cc80de..edfa187f). The start check passed: HEAD and origin were both 66cc80de and the status was empty.

**Numstat of the commit:** `1 1 KNOWN-LIMITATIONS.md`, `5 4 frontends/shell/src/canvas/WorkingCanvas.tsx`.

**Line 368 of KNOWN-LIMITATIONS.md**
- Old sha256 (line plus LF): 112ef95a9523becdb6b71c1e1aa632918c2f9afb14e9fe834e612dc66857769b
- New sha256 (line plus LF): cf1cd56d5c8b1fc944b5ac3f6ccd0c193099245dd71263da134529bc33594632
- A node script (/tmp-free, in $TEMP/kl.mjs) took line 9 of the directive at c48601ab and stripped its three leading spaces. It checked that `the candidate residency arm. Authority:` occurs exactly once. It checked that the new line is longer than the old one by exactly the sentence plus one space. The old and new lines hold the same text apart from that one insertion, so only that line changed.
- The inserted sentence is: "Accepted by the human on 2026-10-11: the sentences do not cover a pan made inside the mint round trip around an Apply or Clear."

**Doc comments in WorkingCanvas.tsx.** The lines are not where the brief put them. `resetFitForNewGeneration`'s doc comment is at 133-136, and the `lastQueriedRef` doc comment is at 1019-1020. I read the sites first:
- `candidateArmSession.ts` returns `session-ended` at about line 1642, before the reset at about line 1658.
- `App.tsx` calls `reissueUnrestricted(null, …)` as the open's first look at about line 1437.
- `App.tsx` calls the reset after an issued outcome at about line 338.

D1, the `resetFitForNewGeneration` doc (lines 134-136):
- Old: "called at the start of every reissue of the filter query (`App.tsx`'s `applyFilter`): on the candidate residency arm whatever the outcome of the Apply or Clear, on the baseline arm on an issued outcome."
- New: "called, on the candidate residency arm, at the start of a reissue begun while the session is live (`candidateArmSession.ts`'s `reissueUnrestricted`; an Apply after the session has ended runs none, because that function returns before the reset) and at the open's first look (`App.tsx`); on the baseline arm, after an issued outcome (`App.tsx`'s `applyFilter`)."

D2, the `lastQueriedRef` doc (line 1020):
- Old: "reported: the auto-fit and `resetFitForNewGeneration` (run at the start of a filter reissue) clear it. */"
- New: "reported: the auto-fit and `resetFitForNewGeneration` (see that method's doc comment for when it runs) clear it. */"

I put no text in quotation marks apart from the code identifiers. There is no change to code or to any other comment.

**Runs and exit codes**
- `npm run verify` in `frontends/shell`, inside a shared hold: rc=0. The hold line had the right shape except that I held the script path in a shell variable, `M`. The hold was granted and released. The log's tail shows "30 passed, 0 failed".
- The comment-only proof (strip `//` and `/* */` comments and whitespace, compare `HEAD~1` with `HEAD`): "comment-only equal: true", rc=0.
- `node scripts/plan/verify-cites.mjs`: rc=0. PASS, with 49 loose references advised.
- `node scripts/plan/verify-quotes.mjs`: rc=0. PASS, with 1 advisory.
- `node scripts/plan/verify-test-claims.mjs`: rc=0. PASS, 534 claimed tests.
- `node scripts/plan/verify.mjs`: rc=0. `verify:plan` PASS.

**Off-scope, not done:** nothing.

**Final `git status --porcelain`:** empty.

**Model:** I observe myself as Sonnet 5.5, with no override. I received no context handoff and produced none.

**Pre-gate self-check**
- I wrote no cross-module code.
- The comment claims point at lines I read.
- No user-facing message was added.
- No test was added.
