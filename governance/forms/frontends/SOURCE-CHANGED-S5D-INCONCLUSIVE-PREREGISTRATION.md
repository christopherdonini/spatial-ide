# source-changed.mjs's post route, S5d: a C2 run reads INCONCLUSIVE, never a pass (the human's (a) for O2), full form

*PLAN node `source-changed-post-route-s5d-race` (generation 8 when this was drafted). Authority: the human's ruling headed 2026-10-21, item 5 (`state/directives/2026-10-20-232-redaction-go-22-rows-placed-d1-b-accepted-234-items-45-46-yes-s5d-a-ttl-ten-minutes-plan-practice-stands.md`), as `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md` Amendment 7 records it. It follows the options draft `state/consults/2026-10-20-source-changed-post-route-s5d-race-o2-follow-on-options-architect.md`, option (a). Route: full form and both gates from dispatch (round 25, item 2 (e)), because the piece changes what S5d asserts (§21a). Drafted by the architect, read only, at main 245cb051, on the custodian's brief. Proposed file: `frontends/shell/SOURCE-CHANGED-S5D-INCONCLUSIVE-PREREGISTRATION.md`. Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line and states what it touches or invalidates.*

## §0. Disclosure

- **Inputs, all read at main 245cb051:**
  - this template (`docs/PREREGISTRATION-TEMPLATE.md`, the full form, classes 1 to 9 and the Round 25 additions);
  - the S5d form, §0 to §5 and Amendments 1 to 7;
  - the options draft;
  - step 2's record, `state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md` ("the record"), in its second version;
  - the driver, `exportElapsed.mjs` and its test, `publish.mjs`'s runStep and exit code, `package.json`, `e2e/README.md`;
  - `tileViewportStreamManager.ts`, `kernel/src/skp.rs`, `kernel/src/lib.rs`, `engine/src/descriptor.rs`;
  - milestone 3's form (§2.9, §3, Amendment 3 item 12, Amendment 9 item 6);
  - `state/directives/2026-10-11-direction-after-status-review.md`, item 2.
- **Hashes.** The drafter had no shell, so no pin below carries a sha256. Each pin is written `path:line @ 245cb051`. Before commit, the custodian expands each one to the full commit id and fills its sha256 by script. Done before commit: 46 pins, each now `path:line @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:<the lines with their LFs>`. No line cite goes into `DECISIONS-PENDING.md`. Directives are cited by item and forms by section or amendment.
- **Reuse index.** `node tools/reuse.mjs` in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. Its output, byte-copied from the custodian's brief:

```text
$ node tools/reuse.mjs inconclusive verdict
No prior art recorded for "inconclusive verdict". Research it before planning an implementation.
$ node tools/reuse.mjs e2e test outcome class
No prior art recorded for "e2e test outcome class". Research it before planning an implementation.
```

  Two misses, noted, not blocking. The pattern inside this repository is `e2e/exportElapsed.mjs` (`ExportInconclusive`, `readTtlMs`) together with `publish.mjs`'s exit code 3.
- **The evidence this rests on (the record):**
  - 16 counted runs at B ed8731a7bdf19a48d37049cbe14e3d00d9db0372;
  - S5d failed in 14, every failure C2, each carrying one `{mtime}` refusal logged after the session-ended line;
  - no W or R line in any run, and a P line in every run;
  - every P count in the C2 runs is 0, and both passes (B5, B7) count 23 (the record's Summary table).
- **What this draft adds to the brief:**
  - T7 and its mutation, under OPEN-5;
  - mutations M5 to M8, so that each new test has one (the options' list had none for T1 or T4);
  - one run each of the default route and the reopen route at the head, as evidence for §5's declared-unchanged list.
- **Fixture-drive confound:** not applicable. Nothing is measured, and the 5 GB fixture is not used. The runs use the 100k copies, as now.
- **Hypotheses:** none beyond §5's predictions.

## §1. What this preregistration may and may not claim

- **It may claim** what S5d's three readings mean (§2.3), from what the suite reads: the session log since the run's baseline.
- **It may not claim** any of the following:
  - that S5d shows which kernel route ended the generation;
  - that a PASS proves the post-check route beyond the absence of a refused tile mint;
  - that the race is fixed;
  - any rate or share of INCONCLUSIVE runs (the 8 runs at the head are counts, not a rate);
  - any timing, duration, p50/p95 or docs/08 row (ADR-018).
- **No wire change, no product code and no string the app shows.** P6 is not engaged.
- **ADRs:** ADR-018 (no timing) and ADR-010 rule 6 (constants declared at their site) are cited. None is amended.
- **Who owns the evidence for the post-check route:** the P count in the custodian's run records stays that evidence (ruling item 5). The suite does not read it.

## §2. The change, stated before it is applied

**2.1 The new pure module, `frontends/shell/e2e/s5dVerdict.mjs`.** It has no product import and no I/O beyond the init read.
- `export class S5dInconclusive extends Error {}`. runStep prints the third status from it, as `ExportInconclusive` does (frontends/shell/e2e/exportElapsed.mjs:14 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:23f22cab91282be4b9afc6c542984aa650687c15311646caa01b92c7abf47741).
- `export function readRefusalDetails({ skpSource, descriptorSource })` is pure over two source texts. It follows `readTtlMs`'s pattern (frontends/shell/e2e/exportElapsed.mjs:16-22 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:f191e32ab6d615acc86f853dd818ae4adab5664ee0736e4119fcbb064a41fa11). It returns:
  - `alreadyEnded`: the string literal of `detail:` in each `SessionEndReason::ObservedChange => EngineError::SourceChanged {` arm of `kernel/src/skp.rs`, with every backslash-newline-and-indent continuation removed (Rust's own rule). There must be exactly two (kernel/src/skp.rs:1501-1505 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:9c1e1ce63923fcd9cac3c20b6b6b9e5f29fdfa6528895b0fa781f8a216386dbc, the attribute arm; kernel/src/skp.rs:1619-1624 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:6d29289bcca58605cd44d12c2b871c049f923f5a467ea5672a65b4638bb7e158, `require_live`).
  - `unreadablePrefix`: `{` followed by the literal text before `{e}` in the `Err(e)` arm's format string of `refuse_if_changed_or_unreadable` (engine/src/descriptor.rs:331-337 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:8dad169508f4b208d319156c39cbe1914fedff1cf5b4d55a5ed663166e7114b2). There must be exactly one.
  - Any other count throws `s5dVerdict: harness failure: …` by name.
- `export const initRefusalDetails = () => readRefusalDetails({ … })` reads `../../../kernel/src/skp.rs` and `../../../engine/src/descriptor.rs` relative to the module. These are source text, with no import and no build dependency. The kernel's text is read where it is defined, so drift fails by name.
- `export function s5dVerdict({ newLines, baseline, details })` returns `{ status: "PASS"|"INCONCLUSIVE"|"FAIL", class: null|"C1"|"C2"|"C3"|"R", message }`. Its rule is applied in this order, and position never decides:
  1. No line matching `tile-session-ended-source-changed`: FAIL, class null. The message is the driver's current text (frontends/shell/e2e/source-changed.mjs:1418-1423 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:1c3092368c019854489d644f08d36c8252d705c9a3533c2886a553d63975715d).
  2. No line matching `tile-stream-mint-refused`: PASS. The message is the current pass note (frontends/shell/e2e/source-changed.mjs:1432-1433 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:8d5e36c0670ad4588b00c3ebcf5b63bfd4627b5df138c38c58a12a2d5ef6f096).
  3. Each refusal line is read as `<ms> tile-stream-mint-refused <tileKey>: <code> <fields-json>`, the shape `logMintRefused` writes (frontends/shell/src/streaming/tileViewportStreamManager.ts:273-281 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:01228c06e775eba145887650d96a29c7ecb10f5eb3ac106aff3514e28b0fc408). Its kind is:
     - *other*: unreadable, or `code` ≠ `engine.source_changed`;
     - *R*: the detail starts with `unreadablePrefix`;
     - *already-ended*: the detail equals one of `alreadyEnded`;
     - otherwise *sibling-precheck*.
  4. Any *other* gives FAIL, C3 [OPEN-5 (A)]. Otherwise any *R* gives FAIL, R [OPEN-3 (A)]. Otherwise any *sibling-precheck* gives INCONCLUSIVE, C2. Otherwise (all *already-ended*) FAIL, C1 [OPEN-2 (A)].
  - Messages are as in §2.4, D8. The session-ended line's own detail is never classified: A3's carries the already-ended text, and the run is still C2 (T3).
  - Class names follow the S5d form's Amendment 4 item 3. The one exception is OPEN-5 (A), which reads a C2 set that also holds an *other* refusal as C3.

**2.2 `frontends/shell/e2e/source-changed.mjs`.**
- **Import.** It imports `S5dInconclusive`, `initRefusalDetails` and `s5dVerdict`.
- **Reading the kernel's details.** On the post route only, before the layout, it calls `initRefusalDetails()`. If that throws, the suite prints it and exits 1 before launching, as the other preconditions do (frontends/shell/e2e/source-changed.mjs:745-767 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:824de205743abfc59da6761d181f76903621f339a2eb11671595fd1a0ff805af).
- **runStep.** Its catch takes `e instanceof S5dInconclusive ? "INCONCLUSIVE" : "FAIL"` and prints it, as publish.mjs does (frontends/shell/e2e/publish.mjs:594-607 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:71283c837e6b56237c4f04f1379c2da1c2f8e80852f85c4fd716f1033afdf9fd). `withTimeout` passes the original error through (frontends/shell/e2e/source-changed.mjs:549-554 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:aaeac44c0724d86cf8830da5330455c55f73d1c9278941922d4b1c1d31316e68). The results type gains `"INCONCLUSIVE"` (frontends/shell/e2e/source-changed.mjs:794 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:3b009074d1020fc43d52ada1557e70ab9b7a95298df65f949acbace68437e0f7). The summary's status column widens to its longest value.
- **S5d's body** (frontends/shell/e2e/source-changed.mjs:1398-1435 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:9859114948b36d3e2f89661864393b7d5ae3ed3e680246acc931c8af2b0ba5bf):
  - it keeps its baseline slice and `observation.postCheckLogEvidence` unchanged;
  - it calls `s5dVerdict`;
  - FAIL throws `Error`, and INCONCLUSIVE throws `S5dInconclusive`. Each refusal verdict's message ends with ` Evidence: <the evidence JSON>`, as now. PASS returns the message.
  - No new report field.
- **Exit code.** `process.exitCode = anyFail ? 1 : anyInconclusive ? 3 : 0`, the rule at frontends/shell/e2e/publish.mjs:651 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:3a3b98df49dfdb46e34df1b64c8f5d651e702611027e6676809a11d4f325b485, replacing frontends/shell/e2e/source-changed.mjs:1470-1471 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:c41041c418b2f63d9b6878bed42686f376d9f8a9e3e10f9e074200d4a19b0920. The watchdog's exit 2 is unchanged (frontends/shell/e2e/source-changed.mjs:736-742 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:67cbb6e014695b7a7fad0deb866f2ffc9ce8f652c6ced521736884d53209ec19).
- **Comments, in §2.4's words:**
  - the header note on what the route does not guarantee (D-H, frontends/shell/e2e/source-changed.mjs:179-188 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:7fea23cf8c154151f4b812ba10d34fd62af76ed3c2559724e4b383f2361403c1);
  - the stale line cites in the post-check note (D11, frontends/shell/e2e/source-changed.mjs:168-172 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:528e0e17c24f46d40ba5af3e7c4c5da23bbcec4899295141880ee0345aec1fec; class-3 fixes inside Scope);
  - S5d's block comment (D9, frontends/shell/e2e/source-changed.mjs:1388-1397 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:a0f0d4a039a876e55e204e8a4d34aac6d80aa103342ef5a92d449fbde1d6892c).

**2.3 What a run then shows.**
- **PASS:** a session ended, and no tile mint was refused since the baseline.
- **INCONCLUSIVE:** a sibling tile's pre-check found the change while the generation was live at its live check. Whether the post-check also found it is neither shown nor excluded.
- **FAIL:** §2.1 rule 1, or rule 4's FAIL cases.
- **Against the record's 16 runs:** 2 PASS (B5, B7), 14 INCONCLUSIVE, 0 FAIL. Each of the 14 would exit 3, since S1 to S5c passed in all of them.

**2.4 Exact words.** None of these sentences is the human's wording, with one exception: the header's last two sentences carry ruling item 5's two statements, in words drafted under the 2026-10-11 direction item 2e and offered at OPEN-6. Each clause is checked against code at main 245cb051, and each check names the code as it stands after §2's change.

*D-H, replacing lines 179-188:*

```
// WHAT THIS DOES NOT GUARANTEE, STATED RATHER THAN HIDDEN. A camera gesture can plan more than one
// tile; this driver repoints on the FIRST `stream-issued` line it sees, and a SIBLING tile whose own
// mint has not yet resolved can then meet the changed source at its own pre-check, which refuses
// that mint. `logMintRefused` logs every refused tile mint, first in `mintAndStart`'s catch, even
// after the session has ended, so S5d reads that sibling's `tile-stream-mint-refused` line and
// classes it by its code and detail, never by its position (`e2e/s5dVerdict.mjs`). S5d reads:
//   PASS -- a `tile-session-ended-source-changed` line and no `tile-stream-mint-refused` line since
//   this run's baseline;
//   INCONCLUSIVE, never a pass -- a session-ended line, and at least one refusal with
//   `engine.source_changed` and the pre-check's own descriptor detail, none with another code or
//   with the could-not-re-read detail: a sibling's pre-check found the change, and whether the
//   post-check also found it is neither shown nor excluded. The suite then exits 3 unless a step
//   failed or the deadline passed;
//   FAIL -- no session-ended line; a refusal with another code, an unreadable one, or one with the
//   could-not-re-read detail; or refusals that all report an end already made.
// The post-check route is evidenced by the P count in the custodian's run records: the in-flight
// count in the kernel's stderr line `session ended for dataset ...`, which only a stream's
// post-check prints, and which is above 0 only when that post-check's call ended the generation.
// This suite cannot read it. S5d confirms the post-check route only in a run with no sibling
// refusal, and even there it reads no kernel line. No timing bound is asserted anywhere in this
// addition (ADR-018; A6) -- the polling interval below is a mechanism, not a claim.
```

Each clause, checked:
- **A sibling meets the change at its own pre-check, which refuses its mint:** `require_live` passes (kernel/src/skp.rs:1436 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:8a3283c12d21190899182ea9cb8d0a1318ef878ed1df250f3a6a72eb269eb7d5); then the pre-check refuses with `SourceChanged` and ends the generation (kernel/src/skp.rs:1449-1455 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:e9c1fc2216056c966e6e70b08bd19c9fa03f628aebda3d4d58b133c7185fe810).
- **Every refused mint is logged, first in the catch:** frontends/shell/src/streaming/tileViewportStreamManager.ts:944 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:ca06d866c1a21e3be7cda4e52c09c907258c1e16d24b60bf79ffe9e7b6fe8285 is the catch's first statement; the attach failure is also logged (frontends/shell/src/streaming/tileViewportStreamManager.ts:1014 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:ca06d866c1a21e3be7cda4e52c09c907258c1e16d24b60bf79ffe9e7b6fe8285).
- **"even after the session has ended":** `mintAndStart` has no `sessionEnded` guard before :944 (frontends/shell/src/streaming/tileViewportStreamManager.ts:928-944 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:7da1bb16d82ba442c698d6cf95600db9afde728cbce3e7ea21f8c25bde1622aa).
- **"by its code and detail, never by its position":** §2.1 rule 4; M3 guards it.
- **The three readings:** §2.1 rules 1 to 4.
- **"exits 3 unless a step failed or the deadline passed":** §2.2's exit rule; the watchdog exits 2.
- **"which only a stream's post-check prints":** the one site that prints it is kernel/src/lib.rs:635-642 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:05e11c7d850f303c0db59cb7b1de3413c9310c72ca1dfabbe46f6fffd1c8cb5e, inside `end_session_if_source_changed`, after `end_generation` (kernel/src/lib.rs:623-624 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:45fb01bef7e00b0013c540076c1b80fa10d04e6c8eaea837d59bce86f198b88d).
- **"above 0 only when that post-check's call ended the generation":** `end_generation` returns 0 when the end is already recorded (kernel/src/skp.rs:914-917 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:e9ce6033a6ada54b77f5f0db32acb57e8449d1f5b6fdbec8692a84ba39f850d2).
- **"This suite cannot read it" and "reads no kernel line":** S5d reads only the session log (frontends/shell/e2e/source-changed.mjs:1400-1411 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:6dccdbdf7ad39510f0d40316eb76f92e8a975ee186b741f80695ea7098c9f131).
- **"confirms … only in a run with no sibling refusal":** the human's statement, item 5. It is true as a necessary condition: an INCONCLUSIVE run never passes.

*D11, replacing lines 168-172:*

```
// route this driver drives -- `traceStreamIssued` is called at the end of `mintAndStart` in
// `frontends/shell/src/streaming/tileViewportStreamManager.ts`, AFTER `startStream(...)` (already
// carrying the real, already-minted `ticket.stream`), unconditionally: no `if` guards
// the call, so it runs on every reach of `mintAndStart`'s success path, and that call site's own
// comment states it fires at the same moment the baseline arm's does -- right after
```

Checks:
- `startStream` is at frontends/shell/src/streaming/tileViewportStreamManager.ts:1096 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:e897b93938820420518a838ae36277b1db7df6fe770bd0e135f99f3115e5b3c5, and `traceStreamIssued` is at :1099, the method's last statement, with no guard.
- The call site's comment is at :1097-1098 ("fired at the same moment -- right after the real mint, never before").
- Names replace the line numbers 1096, 1093 and 1094-1095, which have moved.

*D9, replacing lines 1388-1397* (the dashed rule lines kept):

```
// S5d: POST route only. It reads the session log's lines since this run's baseline and hands them
// to `s5dVerdict` (`e2e/s5dVerdict.mjs`). `tile-stream-mint-refused` is written by `logMintRefused`
// first in `mintAndStart`'s catch, before that catch checks whether the refusal ends the session,
// so a refused tile mint is logged even after the session has ended; `onTerminal` never logs it.
// `endSession` is latched by `sessionEnded`, so `tile-session-ended-source-changed` is logged once,
// by whichever way into this manager came first. Neither that line's position nor its detail tells
// which kernel route ended the generation, and this step reads no kernel stderr line. A refusal is
// classed by its code and detail alone (this file's header note).
```

Checks:
- **First in the catch, before the end check:** :944 comes before :955-957.
- **`onTerminal` never logs it:** frontends/shell/src/streaming/tileViewportStreamManager.ts:1064-1093 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:4c3048127ca0258aabf76532454f508bb6c1cd803146c7fab24c6117dc65a0d5.
- **The latch:** frontends/shell/src/streaming/tileViewportStreamManager.ts:736 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:42a07eda547368944661e8249873e591bc03928e9e4c35cff6de22f6901c86c6; the line is logged at :743.
- **"whichever way came first":** `endSession` is called at :764, :956 and :1085.
- **What it removes:** the stale `:952-954`, `:1081-1083` and `:733`, and the stale names `isSourceChangedRefusal` and `isSourceChangedTerminal`. The code has `isSessionEndedRefusal` (:955) and `isSessionEndedTerminal` (:1084).

*D8, the refusal messages, now in the module.* The rule-1 FAIL and the PASS keep their current texts.

- **C2, INCONCLUSIVE:** `S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail (${detail}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded.`
  - The detail is the descriptor finding: engine/src/descriptor.rs:315-317 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:a1a7af8b2f229c5ff5aac9c785e0e3a88392c92407295f682e5ee4893c2e9956, reached through :1449-1455. On the mint path, the other `SourceChanged` details are the two already-ended literals and R. §5's falsification (i) covers this.
  - "live at its live check": :1436 runs before :1449.
- **C1, FAIL:** `S5d: every "tile-stream-mint-refused" line since this run's baseline carries engine.source_changed with a detail the kernel gives only when the generation had already ended (${details}) -- each reports an end another route made; this step does not pass such a run.`
  - `require_live`'s `Ended(ObservedChange)` arm: kernel/src/skp.rs:1614-1624 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:e98d84fc8ad20eaf64b76782d6a16dfddc61640f81361fdf4d5b6ab795922e61.
  - The attribute arm: kernel/src/skp.rs:1486-1505 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:fbdc2a231d02cc25e72a2b32f512cdc20463de945e1e09ba5460aa0be246c32f.
- **R, FAIL:** `S5d: a tile mint was refused with engine.source_changed and the detail the pre-check gives when the source could not be re-read at all (${detail}) -- not a descriptor finding; this step does not pass such a run.`
  - engine/src/descriptor.rs:331-337 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:8dad169508f4b208d319156c39cbe1914fedff1cf5b4d55a5ed663166e7114b2, the `Err(e)` arm.
- **C3, FAIL:** `S5d: a "tile-stream-mint-refused" line since this run's baseline carries a code other than engine.source_changed, or cannot be read as a refusal line (${line}) -- this step does not pass such a run.`
  - `logMintRefused` writes the code `"unknown"` for a throw that is not an SKP error: frontends/shell/src/streaming/tileViewportStreamManager.ts:274-275 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:d6712c420de356587685d65cd433aaf293520cc887ad15d88f94bf70eeb6b6c3.

*README, replacing frontends/shell/e2e/README.md:243 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:750de9c1407210ee9788f9af2a43088f3e90e5a55f9479d6cfe475e82f5912f9* (one line):

```
- `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post` lets a tile's mint succeed against `a` and repoints on the first new `stream-issued` line, so the post-check can find the change when that tile's stream drains. Its S5d needs a session-ended line since its baseline and reads each `tile-stream-mint-refused` line by its code and detail (`e2e/s5dVerdict.mjs`): with none it passes; when at least one is a sibling tile's own pre-check finding (`engine.source_changed` with its descriptor detail) and none has another code or the could-not-re-read detail, it reads INCONCLUSIVE, never a pass (exit code 3, unless a step failed or the suite's deadline passed); otherwise a refusal fails it. It does not read which kernel route ended the session: that evidence is the count in the kernel's stderr line, in the custodian's run records.
```

- The clauses are D-H's and §2.1's.
- The exit wording matches publish's sentence (frontends/shell/e2e/README.md:222 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:8da70534a88b6020a7a377c0a6e31db401c6ac67708d8613537ca0c67b6e759e).

**2.5 `frontends/shell/package.json`.**
- Add `"test:s5d-verdict": "node e2e/s5dVerdict.test.mjs"`, beside frontends/shell/package.json:42 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:a1785bd1e4a25743eb506122a367f28f89d0894fc7d0f314dfdd7385b628b0db.
- Append `&& npm run test:s5d-verdict` to `verify` (frontends/shell/package.json:17 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:1200552cb3f1d4e97323f6cf76f7551a0b28110ad18065ad879a011651b3d32a).

**2.6 Portability.** No OS-dependent feature is added or changed. The module is plain Node. The driver stays Windows-only, as now (its junction and `requireWindows`).

## §3. Fixtures and pre-declared outcomes

- **The record's lines.** Read at main 245cb051, byte-copied by script into the test. Each constant carries its pin on one line, in the form at frontends/shell/e2e/exportElapsed.test.mjs:13-14 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:029ae2abcc390d85c2fe245bfedf700bd7fbceb1e272d22bb1757f790714f2af.

| Fixture | Source | Used by | Predicted |
|---|---|---|---|
| B5's session-ended line | state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md:590 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:9ce382b3f73b65eb347eea9df821e3d721b1a64683dee4fb43564beb7d7e4485 | T1; T4 (removed) | T1 PASS; T4 FAIL |
| A1's session-ended and refusal lines | state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md:181-182 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:22206852de0facc5307a35f83c1f8d33a3d664894090b1f48b9cb85995d50377 | T2; T5, T6 and T7 as bases | INCONCLUSIVE, C2 |
| A3's session-ended and refusal lines | state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md:362-363 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:1c43277fc1a3ed33cfb64f97070351e6ab18ab0889988f95c870816abc7bca46 | T3; T5's detail (A3's session-ended line carries the `require_live` text as it reached the shell) | INCONCLUSIVE, C2 |
| `kernel/src/skp.rs`, `engine/src/descriptor.rs` | the base's tree | `readRefusalDetails` in T5 and T6, and the driver | two already-ended details; one prefix |
| The 100k copies | as now | the e2e runs | sha256 equal before and after (fixture-integrity) |

- **The constructed cases, each from a record line:**
  - **T4:** B5's line removed, leaving no lines.
  - **T5:** A1's refusal with its detail replaced by the brace-delimited detail that A3's line 362 carries.
  - **T6:** A1's refusal with its detail replaced by `unreadablePrefix` + `test}`. No R line exists in any record.
  - **T7:** A1's two lines, plus A1's refusal with `engine.source_changed {"detail":"{mtime}"}` replaced by `unknown {}`.
- **Never edited.** A prediction is never edited to match a result (class 2).

## §4. Tests, and the mutation per new test

`frontends/shell/e2e/s5dVerdict.test.mjs` (new; `npm run test:s5d-verdict`, part of `verify`):

| Test | Input | Asserts |
|---|---|---|
| T1 | B5's line | PASS, class null |
| T2 | A1's two lines | INCONCLUSIVE, C2; the message names `{mtime}` |
| T3 | A3's two lines | INCONCLUSIVE, C2 (the session-ended line's already-ended text is not classified) |
| T4 | B5 minus its line | FAIL, class null |
| T5 | A1's session-ended line and the T5 refusal; details read from the real `skp.rs` | FAIL, C1 |
| T6 | A1's session-ended line and the T6 refusal; prefix read from the real `descriptor.rs` | FAIL, R |
| T7 [OPEN-5 (A)] | T7's three lines | FAIL, C3 |

**Mutations.** Each is applied alone, its failure observed by running the named test, recorded in the test's header with the commit it was observed at (as frontends/shell/e2e/exportElapsed.test.mjs:5 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:e42398b599f9423abb4d9443f7100b4259b36de29a35080b6382fb2733cfe11d records its own), then reverted.

| Mutation | What it does | Fails by name |
|---|---|---|
| M1 | the INCONCLUSIVE branch returns PASS | T2, T3 |
| M2 | the already-ended check removed | T5 |
| M3 | positional: a refusal after the session-ended line counts as already-ended | T2, T3 |
| M4 | the R check removed | T6 |
| M5 | the other-code check removed | T7 |
| M6 | rule 1 removed | T4 |
| M7 | the refusal filter widened to every `tile-` line | T1 |
| M8 | `readRefusalDetails`' continuation join removed | T5 |

- **Under OPEN-5 (B):** T7 asserts INCONCLUSIVE, C2, and M1 kills it instead. M5 then does not exist.
- **What counts as an observation:** no record calls a `verify-mutation` run an observation of a mutation (Round 25 additions, mutation-observation wording).

**End to end, the custodian's (the seam's real-shape proof).**
- **The post route:** 8 runs at the PR's head, arm A, in one exclusive hold of the custodian's.
- **The other two routes:** one run each of the default and reopen routes at the head, in the same hold.
- **The exe.** Step 2's exe (sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f) is used if `git diff --name-only ed8731a7bdf19a48d37049cbe14e3d00d9db0372 <head> -- Cargo.toml Cargo.lock engine protocol renderer kernel frontends/shell/src-tauri` prints nothing, recorded with its exit code. Otherwise the exe is rebuilt at the head in a shared hold.
- **The checkout and harness:**
  - the frontend is served from the e2e checkout, detached at the head and clean before and after;
  - the harness is the one step 2's record discloses (its Setup, Harness);
  - every run is a fresh launch, with `launched: true`.
- **Each post run's row,** byte-copied by script:
  - report name, `launched`, every step's verdict;
  - S5d's suite line;
  - the session-log lines that Amendment 4 item 2 of the S5d form names;
  - the stderr capture's P, W and R lines, with each P count;
  - the suite's exit code;
  - the class.
- **If no C2 run comes up in the 8,** the record says in words: "No C2 run came up in the 8 runs at <head>; the INCONCLUSIVE verdict and exit code 3 are shown by T2 and T3 alone, and no run at the head shows them end to end." The architect gate weighs that under the seam rule.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions** (a wrong one is a result, class 2):
1. T1 to T7 as §4's table states, at the head.
2. Each mutation fails its named tests by name.
3. In the 8 post runs:
   - no FAIL;
   - at least one INCONCLUSIVE, exiting 3;
   - every INCONCLUSIVE refusal is `{mtime}`;
   - every run has a P line;
   - no W or R line.
4. Default and reopen routes: every step PASS, exit 0.
5. `npm run verify` green.

**Declared unchanged:**
- **Code outside these five files:** nothing under `frontends/shell/src/`, `src-tauri/`, `kernel/`, `engine/`, `protocol/` or `renderer/`; `e2e/lib.mjs`, `exportElapsed.mjs`, `publish.mjs` and `selection.mjs`.
- **The driver's other steps:** every step's body except S5d's. The default and reopen routes' verdicts and exit codes.
- **S5d's inputs and its unchanged readings:** its baseline slice and evidence object, its rule-1 FAIL text and its pass text.
- **The report:** its shape, apart from the status value; no new field.
- **Exit codes:** the watchdog's exit 2, and exit 1 on any FAIL.
- **Timing:** no timing anywhere.

**Invalidators (STOP):**
- **I1:** `readRefusalDetails` does not find exactly two already-ended literals and one prefix at the base.
- **I2:** a C2 run at the head reads other than INCONCLUSIVE with exit 3.
- **I3:** a W or R line in any run at the head, the analogue of the S5d form's I1-late and R-late. It goes to the human with the rows.
- **I4:** the default or reopen route fails a step at the head that it passed at the base, or its exit code changes.
- **I5:** an edit outside §7's five files, records excepted.
- **I6:** a need to edit product code, `lib.mjs` or `exportElapsed.mjs`.
- **I7:** at code start, another in-progress piece or open PR edits `source-changed.mjs`, its README entry, or `package.json`'s `verify` line (rule 00, §11 of this list's caller).

**Falsification.** The form is wrong if either of these holds at the base:
- (i) `viewport_query`'s mint path has a `SourceChanged` refusal other than the two already-ended literals, the descriptor finding and R, so a C2 detail could come from something other than a sibling's own pre-check;
- (ii) the session-log line shapes differ from the record's lines (`logMintRefused`, `endSession`).

## §6. Instruments

- **Assertions:** T1 to T7; each e2e run's step verdicts and exit code.
- **Recorded, not asserted by the suite:** each run's P counts, read by the custodian from stderr. Ruling item 5 makes these the evidence for the post-check route.
- **Measurements:** none. No gaps are recorded, because ordering decides nothing here.

## §7. Declared values and ceilings

- **Constants, each at its own site:**
  - exit code 3: at least one INCONCLUSIVE step and no FAIL;
  - 1: any FAIL, a harness failure, or a precondition;
  - 2: the deadline, unchanged;
  - 0: otherwise.
  - The two source paths are declared in the module.
- **Budget:** insertions plus deletions, tests included, by `git diff --numstat <base>...HEAD -- frontends/shell ':(exclude)frontends/shell/SOURCE-CHANGED-S5D-INCONCLUSIVE-PREREGISTRATION.md'`. `<base>` is the merge base with origin/main. If main is merged in, the count is taken from the merge base after that merge, and the record names it.

| File | Ceiling |
|---|---|
| e2e/s5dVerdict.mjs (new) | 80 |
| e2e/s5dVerdict.test.mjs (new) | 100 |
| e2e/source-changed.mjs | 100 |
| package.json | 3 |
| e2e/README.md | 4 |
| **Total, 5 files** | **287** |

- **Outside the count:** this form, the custodian's e2e record, and PLAN.yaml.
- **An overrun** is class 8, and this section is never edited to match it.

## §8. Block-on-sight

1. A file edited outside §7's five, records excepted.
2. Any edit under `src/`, `src-tauri/`, `kernel/`, `engine/`, `protocol/` or `renderer/`, or to `lib.mjs`, `exportElapsed.mjs`, `publish.mjs` or `selection.mjs`.
3. A change to any step's body other than S5d's, beyond runStep's catch, the results type, the summary width and the exit line.
4. INCONCLUSIVE reachable from any step other than S5d; an INCONCLUSIVE run that exits 0; INCONCLUSIVE counted as a pass anywhere.
5. A refusal classed by its position against the session-ended line.
6. A C2 reading when a refusal has another code or is unreadable [OPEN-5 (A)], or carries R's detail.
7. The kernel's already-ended details or R's prefix written into the module as literals, not read from source.
8. A new report field, a duration, a rate, or a performance word (ADR-018).
9. A test case not built from the record's lines byte-copied by script with its one-line pin, other than §3's four declared constructions.
10. A new test without its observed mutation recorded with its commit; a record that calls a `verify-mutation` run an observation.
11. A sentence claiming that S5d shows which kernel route ended the generation, that a PASS proves the post-check route, that the race is fixed, or any rate.
12. A quote of the human's words marked verbatim that does not match its source.
13. `e2e/README.md` edited before PR #234 is on the branch's base, or anywhere other than its line for the post route.
14. An export with no caller in the driver or the module (the test is not a caller).
15. A line-number cite into `tileViewportStreamManager.ts` in a new or edited comment.
16. Code of an OPEN item before its ruling is recorded.

## §9. Gates

- **Architect and reviewer from dispatch** (full gating). Verdicts follow the 2026-10-05 product-first direction, section 2:
  - Correctness or Evidence blocks;
  - a Documentation finding is fixed in the same PR before the merge;
  - each gate checks §8 item by item;
  - the reviewer recomputes every hash.
- **The wording-block rule** applies by reference: the 2026-10-11 direction, item 2.
- **Suites, green first:**
  - `npm run verify`, which runs `test:s5d-verdict`;
  - the governance scripts' `node --test`;
  - verify-cites, verify-quotes and verify-test-claims, each named with its commit;
  - M1 to M8 observed.
- **The custodian's e2e** at the head (§4).
- **The PR body:**
  - it states that milestone 3's sweeps and later sweeps read INCONCLUSIVE where they read a failure of S5d now, and exit 3 where they read 1;
  - it lists §2.4's applied words.
- **Operator:** no walkthrough row and no P6 sight, because no string the app shows changes.

## §10. Amendments

Opens empty; append-only.
- Amendment 1 records the human's rulings on §11 before any code.

## §11. Open items for the human

| Item | Options | Recommended |
|---|---|---|
| OPEN-1, how long INCONCLUSIVE lasts | (A) standing: the suite's permanent reading of a C2 run, reviewed only if the post route's gesture changes; (B) until triaged, the shape of the 2026-10-17 item 7 rule, which needs a named triage node to end it | (A). The cause is known and is the route's declared limit, not a defect awaiting triage. No node exists to end (B). |
| OPEN-2, C1 | (A) stays FAIL; (B) PASS, since a C1 run's refusals report an end another route made, the same evidence as a pass; (C) INCONCLUSIVE | (A). No C1 run occurred on the watcher-blind route (record), and (a) as ruled changes only C2. If one appears, it goes to you with its P count. |
| OPEN-3, R | (A) FAIL; (B) INCONCLUSIVE | (A). R means the source could not be re-read through the junction, the watcher-visible piece's I2. It should reach you, not be absorbed. |
| OPEN-4, INCONCLUSIVE runs at a gate | (A) any number: an S5d INCONCLUSIVE alone is recorded beside a gate's runs and is neither a failure of its suites nor of H3, as milestone 3's Amendment 3 item 12 treats S5d now; (B) a gate's run set needs one S5d PASS; (C) INCONCLUSIVE counts as a failure for gates | (A). At 2 passes in 16, (B) costs several extra runs per gate. (C) restores the red your ruling removed. |
| OPEN-5, a C2 refusal beside a refusal of another code | (A) FAIL, C3 (T7, M5); (B) INCONCLUSIVE, C2, the Amendment 4 item 3 reading | (A). INCONCLUSIVE would otherwise hide a refusal the step fails on today. |
| OPEN-6, the header's two statements | approve the drafted words (§2.4 D-H, its last two sentences), or give your own (the 2026-10-11 direction, item 2e) | approve |

Rule 00, for the custodian, at main 245cb051:
- **This piece's paths:** `e2e/s5dVerdict.mjs` and `e2e/s5dVerdict.test.mjs` (both new), `e2e/source-changed.mjs`, `package.json`, and `e2e/README.md`'s post-route line, its own path. None is under `protocol/`.
- **PR #234 (milestone 3, PR B):**
  - it edits `e2e/README.md`'s command-bar entry, `e2e/command-bar.mjs`, `src/`, `MANUAL-WALKTHROUGH.md` (Part AB) and KNOWN-LIMITATIONS items 39, 45 and 46;
  - its Amendment 9 item 6 says it edits neither the source-changed driver nor that suite's README entry;
  - §7's B groups name no `package.json` line. The custodian confirms that with `git diff --name-only` at code start.
- **PR #232 (governance C):** `scripts/plan/`, `scripts/hooks/`, `AUTONOMY.md`, `DECISIONS-PENDING.md` and `state/cut-archive/`. Disjoint.
- **When code may start:** after this form and Amendment 1 are committed. The README line is written only after #234 has merged and main is merged into the branch. The e2e runs at the head then include milestone 3.
- **When it may merge:** after #234 (the S5d form's Amendment 7 item 2; milestone 3's §3 H3 reads every existing suite unedited at its head) and after both gates.
- **What it unblocks:** the flake node that depends on this one.
- **The unknown-attempt product step** also waits for milestone 3. It edits `publish.rs` and its own files, which are disjoint from these.

## §12. Heavy runs

- **Briefs.** The worker's brief carries, as written, the paragraph at `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1`. `npm run verify` and any rebuild run inside a shared hold.
- **The e2e runs** are the custodian's, in one exclusive hold (that directive's notes, item a). Ten runs at about a minute each come to under 30 minutes, so no booking is needed.

### Amendment 1 — the human's rulings on §11 (class 5)

*Written by the custodian on the human's ruling. References only: `state/directives/2026-10-20-234-merged-232-f0-go-l534-grep-by-the-human-s5d-open-1-to-6-trademark-ruling-stands.md`, item 3.*

1. **OPEN-1 to OPEN-5:** (A) each, as recommended: INCONCLUSIVE is the suite's permanent reading of a C2 run; C1 stays FAIL; R stays FAIL; a gate accepts any number of INCONCLUSIVE runs, recorded beside its runs; a C2 refusal beside a refusal with another code reads FAIL (C3), so T7 and M5 stand.
2. **OPEN-6:** §2.4 D-H's drafted words are approved, its two statements included.
3. **Code starts.** PR #234 is merged, so the README line may be written and the piece may merge after both gates.
4. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 2 — built and run: the code at the head; the custodian's e2e; prediction 3's P line not held in 3 of 8 (class 2; written after the runs were seen)

*Written by the custodian after the runs were seen. References and hashes only.*

1. **Built** on `cut/source-changed-s5d-inconclusive` from 71f5ebbbcb58e9b21e60de207b831e5581c81449: 217d6e8e3c130c00bb87b578235a0b9bf284a811 (the module, T1 to T7, the package script), 287b2bec4dcbcfafc240b0bd0114f7d43f5daad5 (M1 to M8 recorded), 61bf1c08af8c254d5439e4c492335d26836595bb (`source-changed.mjs`), 0e281e0793e159e8f24d47e3f8d6e9cf2c981045 (the README line). The worker's report: `state/consults/2026-10-20-source-changed-s5d-inconclusive-worker-report.md`.
2. **The custodian's e2e (§4)** at 0e281e0793e159e8f24d47e3f8d6e9cf2c981045, step 2's exe (the path list empty): `state/consults/2026-10-20-source-changed-s5d-inconclusive-e2e-custodian-runs.md`, sha256 714628f30ae23a2025f84461bbf8c087f90eb1a0548557a248e26e4004dfae6e over the whole file at the commit that adds it. The 8 post runs read S5d INCONCLUSIVE, C2, each with exit code 3; the default and reopen routes read every step PASS, exit code 0.
3. **§5 prediction 3 (class 2, a result):** no FAIL, at least one INCONCLUSIVE exiting 3 (8 of 8), every INCONCLUSIVE refusal `{mtime}`, and no W or R line all held. "Every run has a P line" did not hold: the stderr captures of post-1, post-7 and post-8 carry no P line, while each names the session log its run's report names (the record). Prediction 4 held.
4. **The hold:** four requests for the exclusive hold were not granted while another project's heavy run stayed live, and nothing ran in them. The series ran in a slot the custodian booked by the human's word (`state/directives/2026-10-20-adr-024-note-clause-corrected-s5d-series-booked-after-the-ttl-worker.md`, item 2).
5. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 3 — gate 1: both PASS WITH NOTES; Amendment 2 completed in the architect's words; one comment to the worker (class 3)

*Written by the custodian after both gate reports were seen. References only: `state/consults/gates/2026-10-20-source-changed-s5d-inconclusive-gate1-architect.md` (gate-log 562) and `state/consults/gates/2026-10-20-source-changed-s5d-inconclusive-gate1-reviewer.md` (gate-log 564).*

1. **Amendment 2 item 3's reason (the architect's D1, its words byte-copied):** Amendment 2 item 3 states no reason, which class 2 requires. Reason: not established — the suite reads no stderr, the P line is printed only where a stream's post-check recorded a finding (`kernel/src/lib.rs`, `end_session_if_source_changed`), and the runs do not show why the captures of post-1, post-7 and post-8 carry none. The frontend at the head includes milestone 3 (§11, rule 00) and step 2's at ed8731a7bdf19a48d37049cbe14e3d00d9db0372 did not, so the two series are not compared.
2. **Amendment 2 item 2's rev (the architect's D2, its words byte-copied):** Amendment 2 item 2's sha256 714628f30ae23a2025f84461bbf8c087f90eb1a0548557a248e26e4004dfae6e is over `state/consults/2026-10-20-source-changed-s5d-inconclusive-e2e-custodian-runs.md` @ 907d3e0a3c5647ec6cf2fa90b5f0b398dcb69222.
3. **To the worker, no re-gate (the architect's D3):** `frontends/shell/e2e/s5dVerdict.mjs`'s drift comment, line 9 at the head, replaced by the architect's words in its report; the PR body lists them.
4. **The PR body** names the commits verify-cites, verify-quotes and verify-test-claims ran at (the architect's note under §9).
5. **The reviewer's notes** (its items 1 to 4) are recorded in its report and change nothing here.
6. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 4 — closing record: PR #235 merged (class 1)

*Written by the custodian after the merge. References and hashes only.*

1. **Merged** by the human at 2026-10-20T22:28:27Z: merge commit 682551f79aae4aaa5e5543d2fb7e49071cf72cb4, `%cI` 2026-10-21T00:28:26+02:00, its parents main 52b7f0b6fd48506a3c6554c866f71212c61f7dc5 and the branch head 7c5dbb3cf25cd3eea8d1bcc64c14572dbf9b91f2 (D3 applied, the gates' heads 0e281e07 plus that one comment).
2. **PLAN:** the node is done, with `{pr: 235}`.

Nothing above is edited.
