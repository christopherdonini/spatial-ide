// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// S5d's three readings (SOURCE-CHANGED-S5D-INCONCLUSIVE-PREREGISTRATION.md section 2.1), shared by source-changed.mjs and its test: pure over the session log's new lines and two source texts.
// A refusal is classed by its code and detail alone, never by its position against the session-ended line. No timing, no I/O beyond initRefusalDetails' two reads (ADR-018).
import { readFileSync } from "node:fs";

export class S5dInconclusive extends Error {} // runStep prints the third status, INCONCLUSIVE (never a pass); the suite exits 3 when no step FAILed
// Source text read where the details are defined (no import, no build dependency), so drift in either file fails by name.
const SKP_RS = new URL("../../../kernel/src/skp.rs", import.meta.url);
const DESCRIPTOR_RS = new URL("../../../engine/src/descriptor.rs", import.meta.url);
const harnessFailure = (what) => new Error(`s5dVerdict: harness failure: ${what}`);

/** The kernel's two "generation already ended" details (continuations joined as Rust does) and the could-not-re-read detail's prefix; any other count is a harness failure. */
export function readRefusalDetails({ skpSource, descriptorSource }) {
  const alreadyEnded = [...skpSource.matchAll(/SessionEndReason::ObservedChange => EngineError::SourceChanged \{\s*detail:\s*"((?:[^"\\]|\\[^])*)"/g)]
    .map((m) => m[1].replace(/\\\r?\n\s*/g, ""));
  const prefixes = [...descriptorSource.matchAll(/Err\(e\) => Err\(EngineError::SourceChanged \{\s*detail: format!\("\{\{([^"{}]*)\{e\}\}\}"\)/g)].map((m) => `{${m[1]}`);
  if (alreadyEnded.length !== 2) throw harnessFailure(`${alreadyEnded.length} already-ended details found in kernel/src/skp.rs, expected 2`);
  if (prefixes.length !== 1) throw harnessFailure(`${prefixes.length} could-not-re-read details found in engine/src/descriptor.rs, expected 1`);
  return { alreadyEnded, unreadablePrefix: prefixes[0] };
}
export const initRefusalDetails = () => readRefusalDetails({ skpSource: readFileSync(SKP_RS, "utf8"), descriptorSource: readFileSync(DESCRIPTOR_RS, "utf8") });

const REFUSED = /^\d+ tile-stream-mint-refused \S+: (\S+) (\{.*\})$/; // the shape logMintRefused writes: `<ms> tile-stream-mint-refused <tileKey>: <code> <fields-json>`
function kindOf(line, { alreadyEnded, unreadablePrefix }) {
  const m = REFUSED.exec(line);
  let detail;
  try { detail = m === null ? undefined : JSON.parse(m[2]).detail; } catch { detail = undefined; }
  if (m === null || m[1] !== "engine.source_changed" || typeof detail !== "string") return { kind: "other", line };
  if (detail.startsWith(unreadablePrefix)) return { kind: "R", detail };
  if (alreadyEnded.includes(detail)) return { kind: "already-ended", detail };
  return { kind: "sibling-precheck", detail };
}

/** Rules 1 to 4 in order: { status: "PASS"|"INCONCLUSIVE"|"FAIL", class: null|"C1"|"C2"|"C3"|"R", message }; a refusal verdict's message gets the driver's ` Evidence: ...` appended. */
export function s5dVerdict({ newLines, baseline, details }) {
  if (!newLines.some((l) => /tile-session-ended-source-changed/.test(l))) {
    return { status: "FAIL", class: null, message: `S5d: no "tile-session-ended-source-changed" line appeared in the session log after this run's own baseline (line ${baseline}) -- the terminal route never fired` };
  }
  const refusals = newLines.filter((l) => /tile-stream-mint-refused/.test(l)).map((l) => kindOf(l, details));
  if (refusals.length === 0) {
    return { status: "PASS", class: null, message: `"tile-session-ended-source-changed" present and no "tile-stream-mint-refused" since this run's own baseline -- a session ended and no tile mint refusal was logged; which kernel route ended the generation is not read by this step` };
  }
  const of = (kind) => refusals.filter((r) => r.kind === kind);
  const list = (kind) => [...new Set(of(kind).map((r) => r.detail))].join("; ");
  if (of("other").length > 0) {
    return { status: "FAIL", class: "C3", message: `S5d: a "tile-stream-mint-refused" line since this run's baseline carries a code other than engine.source_changed, or cannot be read as a refusal line (${of("other")[0].line}) -- this step does not pass such a run.` };
  }
  if (of("R").length > 0) {
    return { status: "FAIL", class: "R", message: `S5d: a tile mint was refused with engine.source_changed and the detail the pre-check gives when the source could not be re-read at all (${of("R")[0].detail}) -- not a descriptor finding; this step does not pass such a run.` };
  }
  if (of("sibling-precheck").length > 0) {
    return { status: "INCONCLUSIVE", class: "C2", message: `S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail (${list("sibling-precheck")}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded.` };
  }
  return { status: "FAIL", class: "C1", message: `S5d: every "tile-stream-mint-refused" line since this run's baseline carries engine.source_changed with a detail the kernel gives only when the generation had already ended (${list("already-ended")}) -- each reports an end another route made; this step does not pass such a run.` };
}
