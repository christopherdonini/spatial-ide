*Custodian's filing note (2026-09-27): gate 3, attempt 3 (reviewer), full gating, a scoped read of ADR-034's second revision, for PLAN node `geometry-types-beyond-polygons`. Reviewed: docs/adr-034-geometry-admission @ b84f1805826d2f4b56cf678d4ba0632274c3f104 (from the report's own first line). The report calls itself "the attempt-2 hand-back" in its second paragraph because the same agent ran attempt 2; it is the attempt-3 report. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: docs/adr-034-geometry-admission @ b84f180 (b84f1805826d2f4b56cf678d4ba0632274c3f104). FAIL: 1 blocking finding, text only.

This is the attempt-2 hand-back. The attempt-3 gate replaces the attempt-2 verdict (c533c40, FAIL on B1/B2), and that verdict is superseded.

The branch head matches origin, the worktree is clean, the file has LF endings and a trailing newline, and I read `git diff c533c40 b84f180`. The only change since 0ada14f outside `docs/` and `state/` is adrIndex's two files, so every tree claim resolves the same at 0ada14f and at b84f180.

## Blocking

**B1. The "Timing" bullet in "For the human, at acceptance" gets its conditional backwards.** This is a new defect, introduced by the L3 and S1 fixes.
- Exact text: "If "acceptance at MP-1's gate" (paraphrase) means the gate on MP-1's preregistration, the two are compatible and nothing is replaced."
- In this repository, a node's gate is "the preregistration that must pass" (the `gate` field, described in AUTONOMY.md's PLAN directive). A gate on MP-1's preregistration therefore reviews a preregistration that has already been written. So "acceptance at MP-1's gate" under that reading means the ADR is accepted *after* MP-1's preregistration is written.
- The session order says "MP-1's preregistration only after acceptance". Under the reading the bullet names, the two are therefore incompatible, not compatible. The Status line reads it correctly ("earlier than decision 8's recommended timing"); the bullet puts the opposite in front of the human at a red-line acceptance.
- Fix: replace that sentence with "The human confirms or corrects that reading." Alternatively: "Read as the gate on MP-1's written preregistration, decision 8 places acceptance after that preregistration is written, which the order does not allow; the two agree only if the phrase meant acceptance before MP-1's preregistration begins."

## Checks

**1. Attempt-2 findings: all resolved in the text.** The one exception is the new B1 above, which came out of the S1 and L3 fixes.

| Finding | How it was resolved | Status |
|---|---|---|
| B1 (my attempt-2 finding) | Decision 5 now says: checked only against ids already resident; repeats within one batch are all admitted under one id; a later repeat is dropped and counted in `duplicatesDropped`. This matches `addBatch`'s body: `knownIds` is read in the loop and only added to after the loop, and nothing upstream (`ingestTileBatch`, `decodeBatch`) checks id uniqueness within a batch. | Resolved |
| B2 | The heading is now "Not decided here:" and the item moved to O8. "O1 to O8" matches. | Resolved |
| S1 | Status now says "This ADR reads that order as …" and lists the reading for the human. | Resolved, apart from the new B1 |
| S2 | Context "Declared lists in the tree" and the Consequences bullet state it as a fact at 0ada14f. | Resolved |
| N1 | Blockability bullet: "ADR-016 recorded the answer at acceptance; ADR-028 recorded that it was not raised." Both match their Status lines ("architect-blockable as of acceptance"; "not raised as a question at acceptance time"). | Resolved |
| N2 | Decision 8 now says "only under all four of the item's conditions" and names (iv). | Resolved |
| N3 (tool note) | Not an ADR item. | No change needed |
| A1 | New "Decision 5's basis" bullet. | Resolved |
| L1 | O7 and Decision 3 now read "How … principle 8's logging requirement is met". | Resolved |
| L2 | The ordinal → part → row → id chain moved inside the premise. | Resolved |
| L3 | See B1. | Carried by B1 |
| L4 | "MP-1 discloses it" added. | Resolved |

The architect's gate-2 note that adrIndex.mjs's unknown-flag write is not recorded in any PLAN node or ledger line still stands. It is the custodian's to record and is not an ADR defect.

**2. Verbatim passages and pin: PASS.**
- The ruling passage (line 36) matches the bold text of round 17, item 7 in the RULED 2026-09-24 block: identical, 441 bytes, compared by script.
- The decision-4 passage (line 41) matches the assessment's line 206 after "*Proposed text, not a quote of anything:*": identical, 95 bytes.
- The pin (line 39, contiguous on one line) recomputes to ddae06db5d61fa8f420f73843d5e900805bbb9eb26341f5a53effa571cdc4be3 at both 6030dfd and b84f180. 6030dfd is on main.

**3. New and changed tree claims: PASS.**
- **Six writers.** The `geometry_types` writers are `fixture.rs:611`, `geoparquet.rs:778`, `lod.rs:1656`, `lod_tier_builder.rs:415`, `lod_tier_preflight.rs:67-68` and `publish_stream.rs:488`. Each writes `["Polygon"]`. I also searched for writers that might omit the key, which `GeoMeta::parse` reads as empty via `unwrap_or_default`. The only other files that set a `geo` key or write Parquet are `layout.rs`, which copies the source's key verbatim, and the same six. There are none in kernel or protocol.
- **Corpus manifest.** No entry records an empty list. Files 12 and 13 are the truncated and invalid-JSON mutations, and they record no `geometry_types` at all.
- **SKP-V0 §4 item 13.** Lines 275–280 match: "permitted only under all four", with (ii), (iii) and (iv) as the ADR states them.
- **`preflight_pinless_parts`.** It reads no geometry type; it refuses only on the row filter and geographic CRS.
- **"Decision 5's basis".** The paraphrase of the assessment's §5 items 3 and 5 is faithful, apart from nit N1.

**4. Status line: PASS.**
- The session order's condition is stated as a labelled paraphrase with the directive and its paragraph, and the Status field parses.
- The README cell equals the Status line (863 characters, compared by script).
- `npm run verify:adr-index` exits 0: "33 ADRs, index … matches every Status line".

**5. New defects: FAIL on B1.** Nothing else:
- no quotation added beyond the two script-filled passages;
- no line cites into a file this commit edits;
- nothing binds MP-1 beyond the ruling;
- no Round 25 item 2 condition applies.

**6. Suites at b84f180: PASS.** Tool behaviour is as of b84f180.

| Suite | Exit | Result |
|---|---|---|
| `verify-cites.mjs` | 0 | 855 files, 32 advisory |
| `verify-quotes.mjs` | 0 | 110 checked / 79 verified / 30 baselined / 1 advisory / 0 errors / 0 hash-reference errors |
| `verify-test-claims.mjs` | 0 | 343 claims across 90 files |
| `verify.mjs --offline` | 0 | PASS |
| `node --test` over scripts/plan and scripts/hooks | 0 | 349 pass, 0 fail |
| `npx vitest run src/docs/adrIndex.test.ts` | 0 | 26 passed |

`git status --porcelain` was empty afterwards.

## Nits

- **N1.** "Decision 5's basis" says the assessment recommended decision 5 "on the ground that nothing publishable is lost today". Item 5 gives three grounds; the other two are that ADR-017 is not reopened twice and that the producer and consumer are designed together. Suggest "on grounds including that nothing is lost today".
- **N2.** The Timing bullet puts "acceptance at MP-1's gate" in quotation marks and labels it paraphrase, but the span is byte-identical to the assessment's line 210. Drop the quotation marks, as the Status line does. This goes away if B1's first fix is taken.
- **N3.** `geoparquet.rs:778` is a JSON literal in a parse test, not a file writer, so "writers" is loose for that one. Optional.

Files:
- C:/dev/wt/adr-034/docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md
- C:/dev/wt/adr-034/docs/README.md
- C:/dev/wt/adr-034/frontends/shell/src/canvas/tileResidentSet.ts
- C:/dev/wt/adr-034/engine/compat-corpus/of-record/MANIFEST.json
- C:/dev/wt/adr-034/state/consults/2026-09-24-multipolygon-assessment.md
- C:/dev/wt/adr-034/state/directives/2026-09-27-session-order.md
- C:/dev/wt/adr-034/protocol/skp/SKP-V0.md
- C:/dev/wt/adr-034/AUTONOMY.md
