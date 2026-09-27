*Custodian's filing note (2026-09-27): gate 3, attempt 3 (architect), full gating, a scoped read of ADR-034's second revision, for PLAN node `geometry-types-beyond-polygons`. Reviewed: docs/adr-034-geometry-admission @ b84f1805826d2f4b56cf678d4ba0632274c3f104 (from the report's own first line and its ref reading). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: docs/adr-034-geometry-admission @ b84f180 — **Verdict: FAIL** (one by-name finding, text only; a one-line fix)

The ref and HEAD read b84f1805826d2f4b56cf678d4ba0632274c3f104 (`.git/refs/heads/docs/adr-034-geometry-admission`). This was a scoped read of the changes since c533c40. I had no Bash, so I compared files and did not run a diff command.

## Finding

**T1 — fails by name (round 12 (b): "reproduced text without its script mark and hash, or reproduced where the sentence is understandable without it").**
- Where: "For the human, at acceptance", the **Timing** bullet. Exact text: `If "acceptance at MP-1's gate" (paraphrase) means the gate on MP-1's preregistration, the two are compatible and nothing is replaced.`
- The problem: the span inside the quotation marks is a byte-exact copy of the assessment's §5 item 8 ("with acceptance at MP-1's gate."). It is reproduced text in quotation marks, with no script mark and no hash. It is also labelled "paraphrase", which is inaccurate for an exact copy. The sentence reads fine without it.
- The Status line already uses the correct form: "(acceptance at MP-1's gate; paraphrase)", with no quotation marks.
- Fix: "If decision 8's recommended timing (acceptance at MP-1's gate; paraphrase) means the gate on MP-1's preregistration, the two are compatible and nothing is replaced."

## My attempt-2 findings

- **A1: resolved.** The new "Decision 5's basis" bullet gives the assessment's two grounds (items 3 and 5) as labelled paraphrase, and both are faithful. It says the second ground holds at 0ada14f and names the loss, with a cross-reference to Consequences. Note: it could say outright that the first ground does not hold for undeclared projected files. Today that is only implied.
- **L1: resolved.** Decision 3 now says "How principle 8's logging requirement is met…", and O7 is reframed as how the requirement is met, not whether. This is consistent with docs/01 principle 8.
- **L2: resolved.** The ordinal → part → row → id chain now sits under the premise.
- **L3: resolved in substance.** The Status line states the reading as a reading, and a "Timing" bullet puts it to the human. The bullet's wording is T1.
- **L4: resolved.** The text now says "MP-1 discloses it".

## The gate-2 reviewer's findings

- **B1: resolved.** Decision 5's new bullets match `TileResidentSet.addBatch` (tileResidentSet.ts:184–245):
  - it checks only `knownIds` inside the loop, and `knownIds` grows only after the loop, so repeats within one batch are all admitted;
  - a later repeat is dropped and counted in `duplicatesDropped`;
  - "Either way, the id no longer names one row" is true.
- **B2: resolved.** The heading is now "Not decided here:", the shell's internals moved to O8, and the count now reads "O1 to O8".
- **S1: resolved.** See L3 above.
- **S2: resolved.** The Context bullet "Declared lists in the tree" checks out:
  - the six named writers declare `["Polygon"]` (fixture.rs:611, geoparquet.rs:778, lod.rs:1656, lod_tier_builder.rs:415, lod_tier_preflight.rs:68, publish_stream.rs:488);
  - no writer of `geometry_types` exists outside `engine/`;
  - the MANIFEST has no empty `"geometry_types": [ ]` (multiline search, 0 hits).
  - The corresponding sentence in Consequences is scoped to match, and the MANIFEST is added to Related.
- **N1: resolved.** The Blockability bullet now matches what ADR-016 and ADR-028 each record.
- **N2: resolved.** Decision 8 now says "only under all four of the item's conditions" and names (ii), (iii) and (iv) as SKP-V0.md:275–280 states them.

## Scoped checks

- **Nothing newly decided or bound.**
  - O8 moves an item from "Not decided" to open items; that is not a new decision.
  - "MP-1 discloses it" is proposal text and binds only once the human accepts.
  - The Status line keeps "binds nothing".
  - The treatment choice (O1), the literal number, the shell internals (O8) and the WKB wording (O4) all stay open.
- **Constitution.** The changed sentences are consistent with docs/01 principle 8, ADR-010 rule 2, ADR-016 §5 and SKP-V0 §4 item 13, and ADR-017 is untouched.
- **Record form.**
  - The two passages copied by script are unchanged, and the pin is unchanged (6030dfd, recomputed at attempt 2).
  - The new quotation marks around section titles, (Context, "Declared lists in the tree") and (Consequences, "Undeclared Polygon-only datasets"), are self-references by section, which round 14 allows.
  - T1 is the only reproduced span in the ADR outside the two passages copied by script.

No ADR skeleton is needed.

Files:
- C:/dev/wt/adr-034/docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md
- C:/dev/wt/adr-034/state/consults/2026-09-24-multipolygon-assessment.md
- C:/dev/wt/adr-034/frontends/shell/src/canvas/tileResidentSet.ts
- C:/dev/wt/adr-034/engine/compat-corpus/of-record/MANIFEST.json
- C:/dev/spatial-ide/state/consults/gates/2026-09-27-adr-034-gate2-reviewer.md
