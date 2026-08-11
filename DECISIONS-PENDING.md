# Decisions pending the human

*Maintained by the custodian per AI_DEVELOPMENT.md's protocol. One entry per decision: context in
three sentences or fewer, a recommendation, and what applying it touches. Newest first.*

## Pending

1. **ADR-020 (proposed) — data-plane origin admission for the shell's embedded webview.** The real
   cause of "still no features" after the first two fixes: `Session` derived its one admitted
   `Origin` from the data plane's own bound port, correct for a same-origin browser consumer but
   never equal to the shell's actual webview origin (`http://localhost:5180` dev,
   `http://tauri.localhost` packaged) — every WebSocket upgrade this shell ever attempted was
   silently 403'd (silent because `App.tsx` never wired `onTerminal`, fixed regardless). Implemented
   already (`DataPlaneConfig::expected_origin`, `Session::with_origin`), licensed the same way
   ADR-019 implements ahead of acceptance — but it is a threat-model addition to `docs/09`/ADR-012's
   posture and the architect drafted it as a decision for you, not a call this session takes.
   Recommendation: accept — the alternative (rejected) is that the shell cannot render anything
   until something else replaces it. Touches: `docs/adr/ADR-020-...md`'s status line, a short
   amendment to ADR-012 naming the new consumer class.

2. **PR #8 operator walkthrough — re-run needed.** First run found 2 FAILs (empty canvas; ordinary
   dragging surfacing `skp.too_many_pending_streams`), fixed. Second run ("still no features") found
   the real blocker above; also investigated and rejected the "fit from describe's dataset bounds"
   redesign you proposed for the empty-canvas symptom — the circularity theory doesn't hold (the
   first viewport query already carries no bbox, confirmed in code and by a new regression test),
   and describe-time bounds are blocked by ADR-006's operation-class rule, docs/01 principle 7 and
   docs/08's "no numbers, no claim" regardless of whether they'd have helped (they wouldn't have:
   the socket never opened). The existing arriving-geometry fit-to-bounds stands unchanged. Console
   instrumentation added (describe bounds, every viewport_query bbox, per-stream batch/row/vertex
   counts, layer position counts, view target/zoom, pre/post-offset position samples) in case the
   origin fix is not the whole story either. `npm run verify` and the full Rust workspace test suite
   pass. Per the away-mode evidence rule, accepting the walkthrough as passed is not a custodian
   call — needs the human's re-run. Recommendation: re-run `MANUAL-WALKTHROUGH.md` Part A (A1-A10)
   before departure so cut 1 merges and the away-queue starts clean. Touches: PR #8 merge.

## Resolved

*(none yet under this protocol)*
