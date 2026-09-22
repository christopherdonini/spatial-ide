# N8 reopen reset -- five-line short form (`AUTONOMY.md` §21d), full gating

Committed before any change. Full gating (reviewer and architect): the piece touches the owner-side session-ended state, a property under test (`frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`), which `AUTONOMY.md` §21a routes to both gates; the five-line form is kept on the round-16 item-1 shape (`DECISIONS-PENDING.md`, RULED 2026-09-18, item 1).

```
Authority: the human's word of 2026-09-22 (state/directives/2026-09-22-part-n-n8-and-sequencing.md, message 1; DECISIONS-PENDING.md RULED 2026-09-22); Part N run 1's N8 deviation (frontends/shell/MANUAL-WALKTHROUGH.md, Part N run); PLAN node briefa-p6-n8-reopen-reset
Scope: frontends/shell/src/App.tsx, the canvas or admission file the Zoom-to-layer investigation proves at fault, their unit tests, and frontends/shell/e2e/source-changed.mjs (a reopen route); <= 8 files; declared line budget <= 250 non-generated (insertions + deletions)
Change: a successful admission, including a same-file reopen after a source change, starts a fresh generation with the ended session's block and hover latch cleared, ordinary identification and Zoom to layer working; a failed reopen and any late callback or result from the ended generation neither revive the old generation nor mark the new one ended; a second source change after the reopen ends the new session; the misleading remount comment in App.tsx corrected
Tests+mutation: unit tests over the reset and the late-result guards, and an end-to-end reopen route driven through the real app (window.__SPATIAL_E2E__, not a helper with invented setters) asserting the four behaviours in Change; one recorded mutation per new test that fails it by name
Out-of-scope: no wire (protocol/skp untouched), no ADR text, no security surface, no renderer redesign, no watcher, no governance change; the owner-side guarantee is restored as stated, not changed
```

Budget: 244 of 250 non-generated lines across 3 files (git diff --numstat origin/main...HEAD, the form excluded); E2E evidence: frontends/shell/e2e/out/source-changed-1790108677871.json (reopen route, launched:true), frontends/shell/e2e/out/source-changed-1790108697242.json (default pre route, launched:false, same session); commit 804a64a.
