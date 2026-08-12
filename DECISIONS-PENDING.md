# Decisions pending the human

*Maintained by the custodian per AI_DEVELOPMENT.md's protocol. One entry per decision: context in
three sentences or fewer, a recommendation, and what applying it touches. Newest first.*

## Pending

0. **Shell defect, unresolved after two fix attempts (token-discipline rule 7) — resident-vertex
   ceiling trips at exactly 2,012,436 on fresh sessions.** The E2E suite reproduces it
   deterministically: 2,012,436 = 1,961,249 (the 100k fixture's full residency) + 51,187 (one
   batch) across three verified-fresh launches and three code states, recurring per pan/fit cycle
   (session logs show repeat firings ~39 s apart); the visible symptoms are a spurious red
   ceiling-refusal banner and one wasted stream per occurrence, after which the canvas self-heals
   to a correct render. Three real fixes landed on the way (supersede terminal suppression;
   completed-stream residency clear; canvas remount + banner reset per dataset — all tested,
   all keep their own evidence) and a custodian code-read verifies the stream manager's
   supersede-before-mint ordering is correct, which localizes the remaining mechanism to the
   canvas-side residency accounting (`WorkingCanvas.pushBatch`/`clearStream`/`residentSet.ts`) or
   an unconsidered interleaving. Recommendation: authorize one instrumented session — ~10
   render-trace lines logging every pushBatch (handle/seq/vertices/running total) and every
   clearStream (resulting total), one regression run, read the ledger; the reproduction takes
   minutes with the committed harness. Rule 7 makes a third uninstrumented guess yours to
   authorize, not ours to take. Touches: the A5'–A9' regression steps stay red until fixed; the
   operator walkthrough re-run (entry 2) stays held behind it.

1. **ADR-020 (proposed) — data-plane origin admission for the shell's embedded webview.**
   `Session` derived its one admitted `Origin` from the data plane's own bound port — correct for
   a same-origin browser consumer, never equal to the shell's webview origin — so every WebSocket
   upgrade this shell attempted was silently 403'd; the fix replaces the port-derived expectation
   with a host-declared one, page script never supplying it. Full architect security review
   (2026-08-12, per your red-line instruction, against docs/09 and ADR-012 H4): **no H4 conflict,
   no exploitable weakening** — the 32-byte CSPRNG token is untouched and is now the only barrier
   a local attacker must clear — but the draft text was **blocked** for calling ADR-012
   "already-accepted" (it is Proposed, twice withheld) and for presenting the packaged path as
   clean (`http://tauri.localhost` is a constant shared by every Tauri app on the machine;
   `cfg!(debug_assertions)` also admits the dev origin in a `tauri build --debug` package — fails
   closed, correctness defect). **All text corrections applied to the draft 2026-08-12** by the
   custodian (a Proposed ADR is drafting, not an accepted record); the E2E harness now gives
   twice-reproduced render evidence that the fix works (entry 2). Recommendation: **accept**;
   rejecting means the shell renders nothing until something replaces it. Touches on acceptance:
   ADR-020's status line; a short ADR-012 amendment quoting its own **Origin** threat-model bullet
   (delta: the referent of *foreign* changes) plus the H4-PASS-inherited-by-argument caveat; a
   `docs/09` "local listening sockets" bullet (architect's draft wording in its 2026-08-12 report);
   ADR-list entries in `docs/02` and `docs/README`. A supporting negative test (admitted origin +
   wrong token refused) is being added now regardless of the decision.

2. **PR #8 operator walkthrough — re-run needed, but HOLD until the pan-banner fix lands.** The
   E2E harness (your approved amendment) now gives **twice-reproduced evidence the ADR-020 fix
   works**: admission passes, 40 batches / 1.96M positions reach the layer, pixel read-back shows
   the blue fill over ~20% of the canvas (reports in `frontends/shell/e2e/out/`; instrument class:
   E2E-verified, separate from operator-verified). Encoding the walkthrough as regression tests
   then found **a defect the empty canvas had been masking**: `App.tsx`'s `onTerminal` treats only
   `Completed`/`Cancelled` as benign, but supersede-on-pan's SKP-path cancel yields
   `ProducerFailed` (`CANCELLATION-FACTS.md` §1), so ordinary panning fires a spurious red refusal
   banner — A5–A8 of your walkthrough would FAIL today. Fix is going through gates now; a second,
   fresh-session differential run is separating it from a possible stream-starvation-after-churn
   symptom. Recommendation: re-run Part A only after the fix merges (the away-mode evidence rule
   stands: native dialog A2 and the look-and-feel qualities of A4–A10 are yours alone; the rest is
   E2E-covered as a floor, not a replacement). Touches: PR #8 merge.

## Resolved

*(none yet under this protocol)*
