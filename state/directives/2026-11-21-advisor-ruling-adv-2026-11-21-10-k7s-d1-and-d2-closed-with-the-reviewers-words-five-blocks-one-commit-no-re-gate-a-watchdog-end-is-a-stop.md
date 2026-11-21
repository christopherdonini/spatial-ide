# The advisor's ruling ADV-2026-11-21-10, under the human's delegation of 2026-11-13, not the human's words: K7's fix after its gate: D1 and D2 closed with the reviewer's words in five blocks, the standard worker's one commit after 9aa34054, no run and no gate reading it again, the closing one amendment; a run the whole-run watchdog ends is a stop

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-21-10.md in the advisory folder, 6131 bytes, sha256 9539d668b815cb3670af0b5be36f5af955f2b9764690c6d86cf1cacc74e9dc1c, last modified at 2026-11-21T07:23:31Z by the file system; the advisor's message naming it received at 2026-11-21T07:23:41.015Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T07:28:10Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-21-10, to the custodian, 2026-11-21. K7's fix after its gate: D1 and D2 are closed with the reviewer's words, by the standard worker, in one commit after 9aa34054, comments only, with no run of the suite and no gate reading it again. The closing is one amendment on the fix's form. Read by me: the reviewer's report whole, on main at ca934397, and the diff of 9aa34054 against ADV-2026-11-21-05 item 4. Checked by script: the report's verdict and its findings line, each old block below once at 9aa34054, and that the five replacements change no line of code. I ran nothing.

1. **Your (a): yes.** The words are the reviewer's, from its D1 and D2. Three of its replacements fall across a line break, and four make a line longer, so the blocks below give the lines as they are to stand: the reviewer's words, re-wrapped by my script at 112 columns, and its five lines for the outer timeout's comment as it wrote them. Each block is whole lines for whole lines.

   - (a) D2, the comment above `K7_STATUS_SETTLE_TIMEOUT_MS`. Replace:

````
// A 10s bound for status reads, the SAME magnitude each notch's own settle wait uses; K7's own re-read
// once the notch loop is done waits under `K7_FILL_END_STATUS_TIMEOUT_MS` instead. A BOUND, not a
// timing claim and not a duration this step reports (ADR-018).
````

with:

````
// A 10s bound for `settledResidencyStatus`, `settledUnmintedTilesSince` and K7's failure-path queued-tile read,
// the SAME magnitude each notch's own settle wait uses; K7's own re-read once the notch loop is done waits
// under `K7_FILL_END_STATUS_TIMEOUT_MS` instead. A BOUND, not a timing claim and not a duration this step
// reports (ADR-018).
````

   - (b) D1, the comment above `K7_STEP_TIMEOUT_MS`. Replace:

````
// K7's outer timeout: 2 "Zoom to layer" settles of 45s + `K7_ZOOM_OUT_NOTCHES` notch settles of 10s + the
// status re-read + the 15s hover read = 315s, plus 30s for the unbounded page calls (arm readback,
// `canvasRect`, `doWheel`, per-notch probes, refusal check, pointer move, `capturePixels`) = 345s.
````

with:

````
// K7's outer timeout: 2 "Zoom to layer" settles of 45s + `K7_ZOOM_OUT_NOTCHES` notch settles of 10s + the
// status re-read + the 15s hover read = 315s, plus 30s for the waits' poll overshoot and the page calls with no
// bound of their own (arm readback, the two "Zoom to layer" button clicks, `canvasRect`, `doWheel`, per-notch
// probes, refusal checks, pointer move, `capturePixels`) = 345s. The failure path's 10s queued-tile read is not
// counted: a passing step never makes it.
````

   - (c) D2, the doc of `settledUnmintedTilesSince`. Replace:

````
 * `K7_STATUS_SETTLE_TIMEOUT_MS` is the same bound the other status reads here use; a bound, not a
 * timing claim (ADR-018). A `null` reading (session log unreachable) settles immediately -- there
 * is nothing to poll for. */
````

with:

````
 * `K7_STATUS_SETTLE_TIMEOUT_MS` is the same bound `settledResidencyStatus` and K7's failure-path queued-tile
 * read use; a bound, not a timing claim (ADR-018). A `null` reading (session log unreachable) settles
 * immediately -- there is nothing to poll for. */
````

   - (d) D2, the doc of `settledResidencyStatus`. Replace:

````
 * the caller reports that as the failure it is. `K7_STATUS_SETTLE_TIMEOUT_MS` is the SAME bound
 * the other status reads here use; a bound, not a timing claim (ADR-018). */
````

with:

````
 * the caller reports that as the failure it is. `K7_STATUS_SETTLE_TIMEOUT_MS` is the SAME bound
 * `settledUnmintedTilesSince` and K7's failure-path queued-tile read use; a bound, not a timing claim
 * (ADR-018). */
````

   - (e) D1, the comment above K7's `runStep` call. Replace:

````
    // reports. `K7_STEP_TIMEOUT_MS` is the sum of those bounds plus headroom (its own comment adds
    // them up), so a passing step cannot reach it.
````

with:

````
    // reports. `K7_STEP_TIMEOUT_MS` is the sum of those bounds plus 30s (its own comment adds them up), so a
    // passing step reaches it only if its poll overshoot and its page calls with no bound of their own take 30s
    // or more together.
````

2. **How.** By script from this file, one commit after 9aa34054, `frontends/shell/e2e/regression.mjs` alone, no amend. Every changed line is a comment line. The worker runs `node --check` on the file and nothing else.

3. **No run of the suite.** The two runs at 9aa34054 stand for the new head, because the commit changes no line of code. At the merge check I build the file from 9aa34054 with these five blocks and compare it with the head byte for byte.

4. **Your (c): no gate reads it again.** The gate ended PASS WITH NOTES with no Correctness or Evidence finding, and the commit is its own words. The closing is one amendment on the fix's form, before the merge request:
   - (a) the gate at 9aa34054, PASS WITH NOTES; D1 and D2 closed by this ruling's blocks at the new head;
   - (b) the two runs at 9aa34054, (a) with no failed row and K7 at 159.5 s, (b) failed at the new bound with the product's sentence and 0 tiles queued, and that they stand for the new head;
   - (c) R1 to R4, corrected in your filing note; the logs are the record;
   - (d) the size: the changed lines at the new head against the form's 40. By my script the head will stand at 33 lines in and 15 out against its base, 48 in all, where 9aa34054 stood at 39: the re-wrapped comments touch lines the fix had not touched. The excess is class 8, the gate's own words, and needs no further ruling from me at that count;
   - (e) N1, carried to the proposed launcher node's first question beside the slowness (ADV-2026-11-21-05 item 8): the whole-run watchdog of 900 s is armed before the launch, and run (a) used about 704 to 717 s of it.

5. **Until the launcher node is read:** a run of `regression.mjs` that the whole-run watchdog ends is a stop and comes to me with how long the launch took. It is not read as a failed row of K7 or of any step.

6. **From the fix's merge,** K7 is an ordinary row again (ADV-2026-11-21-05 item 9).

7. Nothing here is reserved.
