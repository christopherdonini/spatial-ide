// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Plain Node test of s5dVerdict.mjs (SOURCE-CHANGED-S5D-INCONCLUSIVE-PREREGISTRATION.md section 4, T1 to T7): `npm run test:s5d-verdict`, part of `npm run verify`.
// RECORDED MUTATIONS, each applied alone to s5dVerdict.mjs at 217d6e8e3c130c00bb87b578235a0b9bf284a811, the test run, its failure read by name, then reverted (porcelain clean after each):
//   M1 the INCONCLUSIVE branch returns PASS: T2 and T3 fail.
//   M2 the already-ended check removed: T5 fails.
//   M3 positional, a refusal after the session-ended line counts as already-ended: T2 and T3 fail (T6 and T7 fail too).
//   M4 the R check removed: T6 fails.
//   M5 the other-code check removed: T7 fails.
//   M6 rule 1 removed: T4 fails.
//   M7 the refusal filter widened to every tile- line: T1 fails (T2, T3, T5 and T6 fail too).
//   M8 readRefusalDetails' continuation join removed: T5 fails.
// The log lines are the custodian's step 2 record (section 3), byte-copied by script, each with its one-line pin; T4 to T7 are section 3's four declared constructions from them.
import assert from "node:assert/strict";
import { test } from "node:test";
import { initRefusalDetails, s5dVerdict } from "./s5dVerdict.mjs";

// byte-copied by script from state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md:590 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:9ce382b3f73b65eb347eea9df821e3d721b1a64683dee4fb43564beb7d7e4485
const B5_ENDED = "1792495087404 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)";
// byte-copied by script from state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md:181 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:3f2fdd5ef1ec438d68bc6cf3a574e2060886897bfe3e500684f50b135e42c447
const A1_ENDED = "1792494720892 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)";
// byte-copied by script from state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md:182 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:4ec427eb13095bfec16cd30a09f03d0df97b2bba621023a550a0bdfbed73a70f
const A1_REFUSED = "1792494720902 tile-stream-mint-refused 8:14: engine.source_changed {\"detail\":\"{mtime}\"}";
// byte-copied by script from state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md:362 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:b786c5fcf0fcd631615f73cecc5979ac23c02e3ea47b670d3654313f71c28635
const A3_ENDED = "1792494878258 warn tile-session-ended-source-changed: engine.source_changed: refused: the source file changed while it was open ({this dataset's session ended when its source was observed to have changed}). This check does not establish snapshot consistency, cannot detect every in-place modification, and may detect a change during a query only after that query has finished reading";
// byte-copied by script from state/consults/2026-10-20-source-changed-post-route-s5d-race-step-2-custodian-runs.md:363 @ 245cb051d157650f0633e86e2279b69f054e2bba sha256:e0038b923201d8e1918f0b2edca140cb49d2ef3c9e5fc3aff498cf0bf0ef9320
const A3_REFUSED = "1792494878311 tile-stream-mint-refused 8:14: engine.source_changed {\"detail\":\"{mtime}\"}";

const details = initRefusalDetails(); // read from the real kernel/src/skp.rs and engine/src/descriptor.rs
const read = (newLines) => s5dVerdict({ newLines, baseline: 0, details });
const withDetail = (refused, detail) => refused.replace(/\{.*\}$/, JSON.stringify({ detail }));
const A3_DETAIL = /\((\{[^)]*\})\)/.exec(A3_ENDED)[1]; // the brace-delimited already-ended text as it reached the shell

test("T1 B5's session-ended line alone reads PASS", () => {
  const v = read([B5_ENDED]);
  assert.deepEqual([v.status, v.class], ["PASS", null]);
});
test("T2 A1's two lines read INCONCLUSIVE, C2, the message naming {mtime}", () => {
  const v = read([A1_ENDED, A1_REFUSED]);
  assert.deepEqual([v.status, v.class], ["INCONCLUSIVE", "C2"]);
  assert.match(v.message, /\{mtime\}/);
});
test("T3 A3's two lines read INCONCLUSIVE, C2 (the session-ended line's already-ended text is not classified)", () => {
  const v = read([A3_ENDED, A3_REFUSED]);
  assert.deepEqual([v.status, v.class], ["INCONCLUSIVE", "C2"]);
});
test("T4 B5's line removed reads FAIL, no class", () => {
  const v = read([]);
  assert.deepEqual([v.status, v.class], ["FAIL", null]);
});
test("T5 a refusal carrying A3's already-ended text, details read from the real skp.rs, reads FAIL, C1", () => {
  assert.equal(details.alreadyEnded.length, 2);
  assert.ok(details.alreadyEnded.includes(A3_DETAIL));
  const v = read([A1_ENDED, withDetail(A1_REFUSED, A3_DETAIL)]);
  assert.deepEqual([v.status, v.class], ["FAIL", "C1"]);
});
test("T6 a refusal carrying the could-not-re-read detail, prefix read from the real descriptor.rs, reads FAIL, R", () => {
  const v = read([A1_ENDED, withDetail(A1_REFUSED, `${details.unreadablePrefix}test}`)]);
  assert.deepEqual([v.status, v.class], ["FAIL", "R"]);
});
test("T7 a {mtime} refusal beside a refusal of another code reads FAIL, C3", () => {
  const other = A1_REFUSED.replace('engine.source_changed {"detail":"{mtime}"}', "unknown {}");
  assert.notEqual(other, A1_REFUSED);
  const v = read([A1_ENDED, A1_REFUSED, other]);
  assert.deepEqual([v.status, v.class], ["FAIL", "C3"]);
});
