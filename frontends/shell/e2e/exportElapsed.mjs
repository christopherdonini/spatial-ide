// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The prepare-to-execute time of every e2e export step, and the verdict on an `unknown-attempt` execute (PUBLISH-APPROVAL-UNKNOWN-ATTEMPT-STEP-1-PREREGISTRATION.md section 1),
// shared by publish.mjs and selection.mjs. The stamps are performance.now() readings in the suite's process: p0 before the prepare is sent, p1 when its outcome is in hand, e0 before the
// execute is sent, e1 when its outcome is in hand. L = e0 - p1 and U = e1 - p0 are readings for triage, not measurements (docs/08): no budget, no claim about speed.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PUBLISH_RS = join(dirname(fileURLToPath(import.meta.url)), "..", "src-tauri", "src", "publish.rs");
let ttl = null; // PENDING_ATTEMPT_TTL in ms, read by initTtl
let pairs = []; // this step's { p0, p1, e0 } stamps
export class ExportInconclusive extends Error {} // runStep prints the third status, INCONCLUSIVE (never a pass), and the suite exits 3 when no step FAILed

/** PENDING_ATTEMPT_TTL's seconds from publish.rs's text, in ms; a line it cannot read stops the suite as a harness failure. */
export function readTtlMs(source) {
  const m = /pub const PENDING_ATTEMPT_TTL: Duration = Duration::from_secs\((\d+)\);/.exec(source);
  if (m === null) throw new Error("exportElapsed: harness failure: the PENDING_ATTEMPT_TTL line of src-tauri/src/publish.rs cannot be read");
  return Number(m[1]) * 1000;
}
export const initTtl = () => (ttl = readTtlMs(readFileSync(PUBLISH_RS, "utf8")));

/** Section 1.4: null unless the outcome is `unknown-attempt`; then FAIL when U is within T (the host expires an attempt only past T), else INCONCLUSIVE (an expiry is not excluded). */
export function verdict({ outcome, l, u, ttl: t }) {
  if (outcome?.status !== "unknown-attempt") return null;
  const what = `execute returned ${JSON.stringify(outcome)}`, figures = `L ${l}ms, U ${u}ms, T ${t}ms`;
  if (u > t) return { status: "INCONCLUSIVE", message: `${what}; more than the TTL may have passed since the prepare was sent, so an expiry is not excluded (${figures})` };
  return { status: "FAIL", message: `${what}; the TTL did not end the attempt (${figures})` };
}

export const beginStep = () => { pairs = []; };
/** The tail of a step's line: each sent pair's L in ms, in pair order; empty when the step sent none. */
export function elapsedTail() {
  const ls = pairs.filter((p) => p.e0 !== undefined).map((p) => `${Math.round(p.e0 - p.p1)}ms`);
  return ls.length === 0 ? "" : `; prepare-to-execute ${ls.join(" ")}`;
}

/** Checks the newest pair's execute outcome when it is in hand: returns it, or throws a FAIL Error or an ExportInconclusive. */
export function pairRead(outcome) {
  if (ttl === null) throw new Error("exportElapsed: harness failure: initTtl was not called");
  const e1 = performance.now(), p = pairs.at(-1), v = verdict({ outcome, l: Math.round(p.e0 - p.p1), u: Math.round(e1 - p.p0), ttl });
  if (v === null) return outcome;
  throw v.status === "FAIL" ? new Error(v.message) : new ExportInconclusive(v.message);
}

/** page.evaluate(fn, arg) as one of a pair's calls: "prepare" opens a pair around it; "send" stamps e0 before it (the outcome is read later, by pairRead); "execute" stamps e0 and checks the outcome. */
export async function pairEvaluate(page, role, fn, arg) {
  const t = performance.now();
  if (role === "prepare") pairs.push({ p0: t }); else pairs.at(-1).e0 = t;
  const out = await page.evaluate(fn, arg);
  if (role === "prepare") pairs.at(-1).p1 = performance.now();
  return role === "execute" ? pairRead(out) : out;
}
