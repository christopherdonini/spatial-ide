Reviewed: cut/k7-fill-end-status-bound at 9aa340547f6ab889e6c587ce953ea3d828ac41fe (the custodian's filing note, 2026-11-21: the K7 fix's single gate (ADV-2026-11-21-05 items 3 and 6); Read 7, Bash 23, SubagentHandback 1, by unique call ids; none errored, model claude-opus-5-5, from 2026-11-21T06:38:51Z to 2026-11-21T06:48:20Z by its transcript; the report below byte for byte from its hand-back of 16889 bytes, sha256 9b1af1c82aa6de0eb0f78029da16908e6c5d5488a229c60f9ad5842cdcdf434c, with the scratch folder's path written as <S> and twelve clock times and zones of its files written as <t> by the custodian, with this note in its first line and one final newline), gate, reviewer
Gate: reviewer on K7's own bound at 9aa34054
Verdict: PASS WITH NOTES
Reviewed: cut/k7-fill-end-status-bound @ 9aa340547f6ab889e6c587ce953ea3d828ac41fe

I am a Claude agent, model Opus 5.5 (claude-opus-5-5), as the harness gives it.

Brief: brief-k7gr.md, 5752 bytes, sha256 06124615ae7b98bbe3ce3fea15e60b8089c1d77e95fa6af41c0a5b0216983ffd (sha256sum and wc -c, both match).

Start state: `rev-parse HEAD` = 9aa340547f6ab889e6c587ce953ea3d828ac41fe. The porcelain is empty. `ls-remote` gives the same id for refs/heads/cut/k7-fill-end-status-bound. `log --oneline H0..H` shows one commit, 9aa34054. The branch is cut/k7-fill-end-status-bound.

## Five checks

**1. Scope and Out-of-scope: holds.**
- What I ran: `git diff --stat`, `--numstat` and `--name-only` H0 H, then `git diff --quiet H0 H -- frontends/shell/src frontends/shell/src-tauri '*.lock' '*package-lock.json'`.
- One file changed, `frontends/shell/e2e/regression.mjs`: 26 lines added, 13 deleted, 39 in all, inside the form's budget of 40 or fewer.
- The src, src-tauri and lockfile diff returned rc 0: nothing there changed.
- The form's Out-of-scope line is true:
  - no ADR file, nothing under protocol/, no product code, no string the app shows, no dependency;
  - `K7_STATUS_SETTLE_TIMEOUT_MS` is still 10_000 under the same name;
  - its users at H0 were lines 1824 (K7), 2097 and 2123. At H they are lines 2110 and 2136, plus one new user at 1839, K7's failure-path queued-tile read. It gained a user and lost none, which item 4 (b) does not forbid.

**2. The diff is item 4's list, and nothing else in the step is weakened: holds.**
- What I ran: `stepK7` extracted from H0 and from H (awk) and diffed. There are exactly three hunks:
  - the re-read's timeout argument changes to `K7_FILL_END_STATUS_TIMEOUT_MS`;
  - the bounded queued read is inserted inside the failure branch;
  - `; tiles still queued at the bound: ${queued}` is appended to the end of the message.
- Unchanged byte for byte: the predicate `(v) => v === K7_SETTLED_PARTIAL_TEXT`, the `if (settledStatus !== K7_SETTLED_PARTIAL_TEXT)` assertion, the message's existing text, the notch loop, the per-notch `waitForSettle` at `{ quietMs: 500, timeoutMs: 10_000 }`, the hover `waitForCondition` at 15_000, and the restore with its pixel floor.
- Item 4, point by point:
  - (a) The constant is `K7_FILL_END_STATUS_TIMEOUT_MS = 60_000`. `waitForCondition` returns as soon as its predicate is true (it polls every 200 ms).
  - (b) Holds, as in check 1.
  - (c) Holds, as in check 4.
  - (d) Holds, as in check 3.
  - (e) Holds, as above.
  - (f) The hook is at `frontends/shell/src/App.tsx:1384` (`registerE2eHook("residencyQueuedTileCount", …queuedCount ?? 0)`) and is typed in `e2e-test-surface.ts:306`. App.tsx is the same at H0 and H. The tester's helper `k7r-notches.mjs` reads the same hook name (grep count 1). The read is wrapped in `withTimeout(…, K7_STATUS_SETTLE_TIMEOUT_MS, …)`. A rejection becomes `not readable: …`, and a hook that was never registered becomes `hook not registered`.

**3. The outer timeout: sound as a backstop. Its "cannot reach" wording overstates (finding D1, not blocking).**

I read `stepK7`, `clickZoomToLayer`, `clickZoomToLayerButton`, `assertNoRefusalOrBanner`, `waitForCondition` and `withTimeout` in regression.mjs, and `waitForSettle`, `canvasRect` and `doWheel` in lib.mjs.

Bounded waits:
- `clickZoomToLayer` ×2, at 45 s each: 90 s.
- 15 notch settles at 10 s: 150 s.
- The re-read, `K7_FILL_END_STATUS_TIMEOUT_MS`: 60 s.
- The hover read: 15 s.
- Total: 315 s. The expression evaluates to 90 000 + 150 000 + 60 000 + 15 000 + 30 000 = 345 000 ms.

What the 315 s leaves out:
- **Poll overshoot.** `waitForSettle` tests its timeout only after each 200 ms sleep, so it can run up to about 0.2 s past its bound. Over 17 settles that is about 3.4 s. A passing `waitForCondition` can also run one `evaluate` past its bound.
- **Page calls with no bound of their own:**
  - the arm readback;
  - the two `clickZoomToLayerButton` evaluates;
  - three `assertNoRefusalOrBanner` calls;
  - `canvasRect`;
  - 15 `doWheel` calls;
  - 15 probes;
  - the `mouse.move`;
  - `capturePixels`.
- **The failure-path queued read (10 s).** A passing step never reaches it. A failing step at the new bound stays below the outer timeout with it included: about 45 + 150 + 60 + 10 = 265 s plus the unbounded calls.

Is the 30 s sound? Yes, as headroom.
- A passing step reaches 345 s only if the overshoot and the unbounded calls together take 30 s or more. That is about 26 s of unbounded calls after the overshoot.
- It weakens no assertion.
- Its one cost: a page wedged inside an unbounded probe is now caught at 345 s instead of 240 s.
- At H0 the outer timeout (240 s) was already below the inner sum (265 s). It now sits above.
- "A passing step cannot reach it" holds for any page whose unbounded calls together stay under about 26 s. The code does not enforce that. Only the e2e harness can reach the case (no operator can reach it in the shipped app), so it does not block: D1 gives the words.

Watchdog (`DEADLINE_MS`, 900 s):
- Its comment counts only K7's own bound, now 345 s, which is true at H, and 345 < 900.
- The outer timeouts of all steps add up to 1795 s at H (1690 s at H0), so "the sum … can legitimately spend" cannot mean the sum of the outer timeouts. I agree with the worker's reading.
- The watchdog is armed before `attachOrLaunch`, so the launch counts against it. In run (a), `tauri.e2e.conf.json` was written at <t> and the log ended at <t>, about 704 s; `k7t-run.sh` was written at <t>, so at most about 717 s. The steps alone took 402.4 s by the log's ms figures.
- The margin was therefore about 183 to 196 s. Note N1.

**4. The comments, clause by clause against H.**
- (b), above `K7_STATUS_SETTLE_TIMEOUT_MS`:
  - "the SAME magnitude each notch's own settle wait uses" is true (`timeoutMs: 10_000`).
  - "K7's own re-read … waits under `K7_FILL_END_STATUS_TIMEOUT_MS` instead" is true (line 1833).
  - "A 10s bound for status reads" is loose: one of its three users is K7's queued-tile hook read, which is not a status read. See D2.
- (b), the docs of `settledUnmintedTilesSince` and `settledResidencyStatus`, "the same bound the other status reads here use":
  - No other `.residency-status` read uses the constant.
  - The users other than each function itself are each other and K7's queued read. See D2.
- (b), the FIND' comment, "status read under `K7_STATUS_SETTLE_TIMEOUT_MS` (10s)", is true (`settledResidencyStatus`, line 2136).
- (c), the new constant's comment:
  - "a bound, no claim about how fast the product fills" is true.
  - "the status line is silent while tiles are tracked" is true: `candidateArmSession.ts`'s `emitResidencyStatus` doc says "this function emits NOTHING".
  - "the queue holds up to 512 tiles" is true: `MAX_QUEUED_TILES = 512` in `canvas/tileGridConstants.ts:54`.
  - The cited report path is tracked at H (`git ls-files --error-unmatch` rc 0). Its part (b) has the sentence at 13,857 ms and 11,565 ms after the last notch, so "saw the declared sentence come after the 10s bound" is true.
  - "The wait ends as soon as the sentence shows" is true, at 200 ms poll granularity.
- The `K7_STEP_TIMEOUT_MS` comment:
  - The arithmetic is true: 315 s, then 345 s.
  - The parenthesised list of unbounded calls leaves out the two `clickZoomToLayerButton` evaluates and the poll overshoot. The worker's report lists the evaluates; the comment does not. See D1.
- The watchdog comment, "bounded at 345s of its own", is true.
- The `runStep` comment:
  - "one 60s status re-read" is true. The composition list is true.
  - "so a passing step cannot reach it" overstates, as in check 3. See D1.
- No comment makes a claim about fill speed. Every identifier quoted is code.

**5. The two runs.**

They tie to H:
- `k7t-start.txt` reads H, mtime <t> <t>.
- The reflog has no entry after the commit at <t> <t>.
- The logs are dated <t> (a) and <t> (b).
- `regression.mjs` mtime <t> is the revert, after (b)'s log and before `k7t-ports2.txt` at <t>.
- HEAD is H now, the porcelain is empty, and `git diff --quiet HEAD` returns rc 0.
- Run (a) ran unmutated: its K7 PASS needs the constant to equal the product's sentence, which (b)'s log quotes in its true form.
- Port 5180 is proven by the config: `vite.config.ts:79-80` has `port: 5180, strictPort: true`, and `tauri.conf.json` has devUrl `http://localhost:5180`.

Run (a):
- Rows: 16 PASS and NET' INFO. No FAIL. The log ends `rc=0` and says "This run launched the app".
- The K7 line, byte-copied from `k7t-a.log`:
  `[K7] PASS (159529ms): 15/15 discrete zoom-OUT notches from a "Zoom to layer" fit on the candidate arm (readback asserted); the page answered a fresh DOM read after every notch (no hang), no refusal/banner; render trace went quiet within its wait bound on 1/15 notches (last trace count 12671); .residency-status re-read under its own bound after the last notch and asserted verbatim = "Filling has finished for this view — some areas were not loaded; pan or zoom to load them." (per-notch snapshot at that point: null); .hover-readout after a real pointer move: null; "Zoom to layer" restored 48.1% non-bg pixels`
- Checked by a node script that reads the files:
  - The report's (a) line is a strict prefix of the log line, missing `" non-bg pixels"`.
  - The report's (b) line equals the log line.
  - The report's 16 other step times all match the log.
  - The log's first line is blank, and its last two lines are as the report gives them.

Run (b):
- `[K7] FAIL (207873ms)`. The line is the assertion's own message, not `K7: timed out after …`, so it ended at the new 60 s bound and not at the outer timeout.
- It names the product's sentence as "it was …", expected "Fillinx …", and "tiles still queued at the bound: 0".
- 207.9 s is about 48 s more than (a)'s 159.5 s, which fits a re-read that ran its full 60 s. It is well under 345 s.
- The log has "Attached to an already-running app on CDP port 9223" and ends `rc=1`. Every other row passes.
- The revert holds: the report says porcelain empty and `diff --quiet` rc 0, and I re-ran both now with the same result.

How the report differs from the logs and files:
- The truncated (a) line.
- "not to the outer 240 s timeout": the outer timeout is 345 s at H (R1).
- The port checks are claimed to cover the IPv6 loopback and a `[::1]:5180` listener. `k7t-ports.sh` runs `netstat -ano -p tcp`, which lists IPv4 only, and the three port files hold no IPv6 line (R2).
- What it was:
  - `k7t-ports0.txt`: no 5180 or 9223 entry.
  - `k7t-ports1.txt`: `127.0.0.1:9223 LISTENING 58388` and one TIME_WAIT.
  - `k7t-ports2.txt`: one TIME_WAIT on 9223 only.
- None of this touches the evidence: `strictPort` proves 5180 was free to vite, and (b) attached to (a)'s app.

Departures the tester lists:
1. It wrote `k7t-fe.sh` in the same batch as the hold call that ran it.
2. The frontends output was redirected only in part. The report says the script redirected "the shell's `npm ci` and `npm run build`" and in the next clause that the shell's `npm ci` went to the task output. The script redirects only the shell's `npm run build` (R3).
3. It wrote three temporary scripts.
4. It made one run each, with no re-run.

None of them touches the evidence: `NOTICE.txt` was built at <t>, and `frontends rc=` reports the whole `&&` chain.

The holds: three, each granted at once, each with a release line. Their `also=<m>` values are masked, so the report cannot show whether another project held the machine at the same time. That bears on "quiet machine", but item 5 grades pass or fail, not timing, so it does not touch the verdict.

## Findings

**Correctness: none. Evidence: none.**

**Documentation (must-fix before merge; none is the human's wording, so the worker applies these words with no re-gate and the PR body lists them):**

**D1.** File: `frontends/shell/e2e/regression.mjs`. Symbols: the `K7_STEP_TIMEOUT_MS` comment and K7's `runStep` comment. Not blocking. The comment's list of unbounded calls leaves out the button clicks and the poll overshoot, and "cannot reach it" is stronger than the code. The case, named for the source comment, is a page whose unbounded calls take 26 s or more in a passing step; only the e2e harness can reach it.
- Replace the three comment lines above `K7_STEP_TIMEOUT_MS` with:
  `// K7's outer timeout: 2 "Zoom to layer" settles of 45s + `K7_ZOOM_OUT_NOTCHES` notch settles of 10s + the`
  `// status re-read + the 15s hover read = 315s, plus 30s for the waits' poll overshoot and the page calls with no`
  `// bound of their own (arm readback, the two "Zoom to layer" button clicks, `canvasRect`, `doWheel`, per-notch`
  `// probes, refusal checks, pointer move, `capturePixels`) = 345s. The failure path's 10s queued-tile read is not`
  `// counted: a passing step never makes it.`
- Clause check:
  - 45 s comes from `clickZoomToLayer`'s `timeoutMs: 45_000`.
  - 10 s comes from the notch `waitForSettle`.
  - The re-read is `K7_FILL_END_STATUS_TIMEOUT_MS`, and 15 s is the hover `waitForCondition`.
  - The button clicks are `clickZoomToLayerButton`'s `page.evaluate`.
  - The refusal checks are the two inside `clickZoomToLayer` and the one after the loop.
  - The overshoot is `waitForSettle`'s timeout test after each 200 ms sleep.
  - The queued read sits only inside `if (settledStatus !== K7_SETTLED_PARTIAL_TEXT)`.
- In the `runStep` comment, replace "`K7_STEP_TIMEOUT_MS` is the sum of those bounds plus headroom (its own comment adds them up), so a passing step cannot reach it." with:
  "`K7_STEP_TIMEOUT_MS` is the sum of those bounds plus 30s (its own comment adds them up), so a passing step reaches it only if its poll overshoot and its page calls with no bound of their own take 30s or more together."
- Clause check: the bounded waits cannot exceed 315 s plus their overshoot, so a total of 345 s or more implies that the overshoot and the unbounded calls are 30 s or more.

**D2.** File: `frontends/shell/e2e/regression.mjs`. Symbols: the comment above `K7_STATUS_SETTLE_TIMEOUT_MS`, the doc of `settledUnmintedTilesSince` and the doc of `settledResidencyStatus`. Not blocking. "status reads" and "the other status reads here" do not match the constant's users at H: lines 1839, 2110 and 2136.
- In the constant's comment, replace "A 10s bound for status reads," with "A 10s bound for `settledResidencyStatus`, `settledUnmintedTilesSince` and K7's failure-path queued-tile read,".
- In `settledUnmintedTilesSince`'s doc, replace "is the same bound the other status reads here use;" with "is the same bound `settledResidencyStatus` and K7's failure-path queued-tile read use;".
- In `settledResidencyStatus`'s doc, replace "is the SAME bound the other status reads here use;" with "is the SAME bound `settledUnmintedTilesSince` and K7's failure-path queued-tile read use;".
- Clause check: `grep -n K7_STATUS_SETTLE_TIMEOUT_MS` at H shows the users at lines 1839, 2110 and 2136, and no others.

**Record findings in the tester's hand-back (`k7t-hb-1.md`), fixed in the filing note when the custodian files it:**
- **R1.** "not to the outer 240 s timeout": the outer timeout at H is `K7_STEP_TIMEOUT_MS`, 345 s. The conclusion still holds.
- **R2.** The port checks claim "127.0.0.1 and IPv6 loopback" and a `[::1]:5180` listener. `k7t-ports.sh` is `netstat -ano -p tcp`, which lists IPv4 only, and no port file holds an IPv6 line. The evidence is unaffected because of vite's `strictPort: true`.
- **R3.** Departure 2's first clause, "redirected only the shell's `npm ci` and `npm run build`", contradicts `k7t-fe.sh`. Only the shell's `npm run build` was redirected.
- **R4.** The report's K7 (a) line is cut short of the log's final " non-bg pixels". The log is the record, as byte-copied above.

**Note, not a finding (outside this piece's Scope):**
- **N1.** `main`'s `DEADLINE_MS` (900 s) is armed before `attachOrLaunch`, so the launch counts against it. Run (a) spent about 704 to 717 s of it, a margin of about 183 to 196 s. K7's outer timeout grew by 105 s. That is worth a line in the launcher node's first question; it is not a defect here.

Files read: `C:/dev/wt/k7-fix/frontends/shell/e2e/regression.mjs`, `C:/dev/wt/k7-fix/frontends/shell/e2e/lib.mjs`, `C:/dev/wt/k7-fix/governance/forms/frontends/K7-FILL-END-STATUS-OWN-BOUND-PREREGISTRATION.md`, the ruling and the first read under `C:/dev/wt/k7-fix/state/`, and in `<S>/` the files `k7f-hb-1.md`, `k7t-hb-1.md`, `k7t-a.log`, `k7t-a.app.log` (0 bytes), `k7t-b.log`, `k7t-frontends.log`, `k7t-fe.sh`, `k7t-run.sh`, `k7t-ports.sh`, `k7t-ports0.txt` to `k7t-ports2.txt` and `k7t-start.txt`. I wrote nothing and changed nothing.
