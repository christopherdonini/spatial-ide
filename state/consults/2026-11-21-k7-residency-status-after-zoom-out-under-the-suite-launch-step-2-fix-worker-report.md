*Filed by the custodian: the K7 fix's worker (ADV-2026-11-21-05 items 3 and 4), the hand-back of the worker (claude-sonnet-5-5), 5740 bytes, sha256 69c65b8961c9195454fd6f35f3f4b9903794e005c1bfbb264e43a0b25093a60c, below the rule, with the scratch folder's path written as <S>. Its calls in the transcript, by unique call ids: Read 3, Bash 15, Edit 16, Write 2, SubagentHandback 1; errored: 2 (Edit). Read by the custodian at 9aa34054: the head and the remote branch equal, the porcelain empty, 26 lines added and 13 removed in regression.mjs. On its question of the whole-run watchdog: the steps of the K7 read's own suite run add up to about 446 s against the watchdog's 900 s, so the custodian read no stop. Its 30 s for the page calls with no bound of their own is its own choice, read by the reviewer.*

---

Built: K7's own bound at 9aa340547f6ab889e6c587ce953ea3d828ac41fe
Result: the one-file fix is committed and pushed. `node --check` exited 0 and the diff is 39 changed lines. One thing for you to confirm: the "whole-run" Stop test is ambiguous (details under "Whole-run Stop test").

Start state: HEAD was af3cd53cc8dff9e3022e309df5dd3f9b52556e3f, porcelain empty, and ls-remote returned the same id. The branch is cut/k7-fill-end-status-bound.

Diff (`git diff H0 HEAD`, file `regression.mjs` only). In words:
- The 10s constant's comment is rewritten. New constants `K7_FILL_END_STATUS_TIMEOUT_MS = 60_000` and `K7_STEP_TIMEOUT_MS = 2 * 45_000 + K7_ZOOM_OUT_NOTCHES * 10_000 + K7_FILL_END_STATUS_TIMEOUT_MS + 15_000 + 30_000` sit beside it.
- K7's re-read waits under the new constant.
- Before the throw, a queued-tile read runs and its result is appended as `; tiles still queued at the bound: ${queued}`. The assertion and the existing message text are unchanged.
- Four comments are corrected (below), and `runStep("K7", K7_STEP_TIMEOUT_MS, ...)` replaces 240_000.
- The full diff is in `<S>/k7f-diff.txt` (output of `git diff` before the commit).

(b) Comments changed:
1. Above `K7_STATUS_SETTLE_TIMEOUT_MS`.
   - Old: "Re-review should-fix 3: the bound the status assertion re-reads `.residency-status` under, once the notch loop is done. The SAME 10s magnitude each notch's own settle wait already uses..."
   - New: "A 10s bound for status reads, the SAME magnitude each notch's own settle wait uses; K7's own re-read once the notch loop is done waits under `K7_FILL_END_STATUS_TIMEOUT_MS` instead..."
2. `settledUnmintedTilesSince` doc.
   - Old: "...is the same bound K7's own status re-read uses..."
   - New: "...is the same bound the other status reads here use..."
3. `settledResidencyStatus` doc.
   - Old: "...is the SAME bound K7's own status re-read already uses..."
   - New: "...is the SAME bound the other status reads here use..."
4. FIND' comment in `main`.
   - Old: "status re-read under K7's own `K7_STATUS_SETTLE_TIMEOUT_MS`"
   - New: "status read under `K7_STATUS_SETTLE_TIMEOUT_MS` (10s)"

Other comments touched, which are not (b) items:
- The watchdog comment now says "bounded at 345s of its own" (old: "240s").
- The K7 `runStep` comment now says "one 60s status re-read" and "`K7_STEP_TIMEOUT_MS` is the sum of those bounds plus headroom...". It replaces the old "240s is the outer backstop... not the sum of the inner bounds".

Outer timeout: 345s. This is a bound sum of 315s plus 30s of headroom.
- Counted waits: 2 `clickZoomToLayer` settles at 45s = 90, 15 per-notch settles at 10s = 150, the status re-read 60, the hover read 15. Total 315s.
- The failure-path queued read (10s) is not counted, because a passing step does not reach it.
- Unbounded, named and not guessed: arm readback, `canvasRect`, `doWheel`, per-notch probes, `assertNoRefusalOrBanner`, the pointer move, `capturePixels`, `clickZoomToLayerButton`. The 30s of headroom covers these.
- Why 30s: the headroom is my choice; the brief gave no figure.

Whole-run Stop test: 345s fits inside the 900s default of `SPATIAL_E2E_DEADLINE_MS` on its own.
- The watchdog comment (which now says "bounded at 345s of its own") counts no other step's bound.
- The sum of all steps' outer timeouts is already above 900s at H0. Without K7 it is 1450s, and with K7 at 240s it is 1690s.
- I read the comment's "legitimately spend" as not meaning the sum of outers. If the Stop meant the sum of outers, it was already tripped at H0. Please confirm that reading.

(f) The failure path calls `page.evaluate(() => window.__SPATIAL_E2E__.residencyQueuedTileCount?.() ?? "hook not registered")` once, wrapped in `withTimeout` under `K7_STATUS_SETTLE_TIMEOUT_MS` (10s). A failure of the read becomes `not readable: <message>`.
- Hook, producer: `App.tsx:1384` registers it, returning `candidateManagerRef.current?.queuedCount ?? 0`.
- Hook, typing: `e2e-test-surface.ts:306`.
- Caller grep, for the cross-module rule: the only new caller is `regression.mjs`'s K7 failure path.

Checks:
- `node --check` exit code: 0.
- `git diff --numstat` before the commit: 26 added, 13 deleted, 1 file (39 lines). My first draft was 55 lines and I trimmed it.
- Commit: 9aa340547f6ab889e6c587ce953ea3d828ac41fe. It is signed with `-s -F`, carries the two trailers, and I typed no Signed-off-by or email.
- Push: `af3cd53c..9aa34054  cut/k7-fill-end-status-bound -> cut/k7-fill-end-status-bound` (rc 0).
- Porcelain after the commit: empty, but I never ran `git status --porcelain` after the commit. The numstat before it showed one modified file, and the commit and push exited 0.

Pre-gate four classes:
1. Cross-module interface: the hook is read from the real producer, at `App.tsx:1384` and `e2e-test-surface.ts:306`. Nothing is run, so there is no end-to-end test; the tester's runs under ADV-2026-11-21-05 item 5 are that evidence.
2. Completion claims: each is backed by a diff line or a tool exit code above.
3. User-facing messages: only the failure-line suffix is new, and the code appends it.
4. Required tests: none were added and none were run, because the brief forbids running them.

Not done: no app, suite or build was run (per the brief), no mutation was applied, and `verify-quotes` was not run (the brief did not ask for it). The new comments quote no governing text; the only path cited is the consult report.

Departures: none from the brief's list. The two extra comment edits above (watchdog, K7 `runStep`) were needed so no comment states the old 240s or 10s.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
