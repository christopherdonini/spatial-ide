// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Plain Node test of exportElapsed.mjs (PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md section 2.1, T1 to T4): `npm run test:export-elapsed`, part of `npm run verify`.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { readTtlMs, verdict } from "./exportElapsed.mjs";

const TTL = 120_000, unknown = { status: "unknown-attempt" };
const read = (outcome, u) => verdict({ outcome, l: 1, u, ttl: TTL })?.status ?? null;
// byte-copied by script from state/consults/2026-10-14-shell-status-bar-one-height-e2e-h3-order.md:10 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:4e66b074e8fa92858b176103368c95cbcd7eacceda8bc43f54bfadf0ccb560ff
const E_EXPORT_LINE = "[E-EXPORT] FAIL (16077ms): E-EXPORT: execute (Selected 1) returned {\"status\":\"unknown-attempt\"}";
// byte-copied by script from state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-2.md:15 @ e54e4af241908a6cd205b4412ed981987cf8807c sha256:c4d9fcfc3a0ea10a09b991b17b805f6a5104e4e98ae59103551ad994edc84c2a
const E_ASK_TWO_LINE = "[E-ASK-TWO] FAIL (12200ms): E-ASK-TWO: the second export's outcome is {\"status\":\"unknown-attempt\"}; a finished bundle was needed";

test("T1 the TTL read from the real publish.rs is 120000 ms", () => {
  assert.equal(readTtlMs(readFileSync(new URL("../src-tauri/src/publish.rs", import.meta.url), "utf8")), TTL);
});
for (const [name, line] of [["E-EXPORT", E_EXPORT_LINE], ["E-ASK-TWO", E_ASK_TWO_LINE]]) {
  test(`T2 the ${name} run line (U its printed duration) reads FAIL`, () => {
    const outcome = JSON.parse(/(\{.*?\})/.exec(line)[1]), u = Number(/\((\d+)ms\)/.exec(line)[1]);
    assert.deepEqual(outcome, unknown);
    assert.equal(read(outcome, u), "FAIL");
  });
}
test("T3 an unknown-attempt with U = T + 1 reads INCONCLUSIVE, with U = T reads FAIL", () => {
  assert.equal(read(unknown, TTL + 1), "INCONCLUSIVE");
  assert.equal(read(unknown, TTL), "FAIL");
});
test("T4 a success and a refused outcome, each with U = 10 T, give no verdict", () => {
  assert.equal(read({ status: "success", bundle_path: "b" }, 10 * TTL), null);
  assert.equal(read({ status: "refused", message: "m" }, 10 * TTL), null);
});
