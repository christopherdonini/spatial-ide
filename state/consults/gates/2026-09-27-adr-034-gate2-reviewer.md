*Custodian's filing note (2026-09-27): gate 2, attempt 2 (reviewer), full gating, of ADR-034 filed Proposed, for PLAN node `geometry-types-beyond-polygons`. Reviewed: docs/adr-034-geometry-admission @ c533c40126163575e109b476a2fc6500c818483a (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: docs/adr-034-geometry-admission @ c533c40 (c533c40126163575e109b476a2fc6500c818483a). FAIL: 2 blocking, both text-only.

Gate attempt 2 used full gating (AUTONOMY.md §21a) for PLAN node `geometry-types-beyond-polygons`. The worktree C:/dev/wt/adr-034 is clean. The local and remote heads are both c533c40. From 0ada14f to c533c40 the only code files that changed are `adrIndex.mjs` and its test, so every tree claim resolves the same at both. The Round 25 item 2 conditions do not apply here: there is no preregistration, no five-line form and no verify-mutation record.

## Blocking

**B1 (check 3). A tree claim in Decision 5 is false for the usual case.**
- File: docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md, Decision 5, third bullet (rewritten by this revision). Exact text: "Rows split per part would reach the shell as repeated ids. The shell's `TileResidentSet.addBatch` (`frontends/shell/src/canvas/tileResidentSet.ts`) drops a repeated id and counts it in `duplicatesDropped`. Every part after the first would therefore be lost, indistinguishable from an ordinary cross-tile duplicate."
- What the code does: `addBatch` checks each incoming id only against `this.knownIds`. The loop in `addBatch`'s body never adds to `knownIds`; the set grows only after the loop (`for (const id of trimmed.ids) { this.knownIds.add(id); ... }`). So repeated ids inside one batch are all kept. Only a repeat against an id that was already resident (a later batch, a refetch, or another tile) is dropped and counted.
- Nothing upstream checks id uniqueness within a batch. `ingestTileBatch` in tileIngest.ts calls `addBatch` directly, and the only uniqueness check in `decodeBatch` is keyed on the batch, not the id.
- The parts of one feature are adjacent rows, so they almost always arrive in the same batch. In that case they are admitted, not lost: one id then names several resident rows, and `idOwner` and `knownIds` hold one entry for all of them.
- I passed the earlier wording of this sentence at attempt 1 (check 3, "`addBatch` dedupe"). That was a miss on my side. The revision rewrote the sentence and extended the claim, so it is re-gated here.
- Fix: "Rows split per part would reach the shell as repeated ids. `TileResidentSet.addBatch` (`frontends/shell/src/canvas/tileResidentSet.ts`) checks each id only against ids already resident. Repeats within one batch are therefore all admitted under one id, and a repeat arriving later, from the same tile or another, is dropped and counted in `duplicatesDropped` like any duplicate. Either way the id no longer names one row."

**B2 (check 5). The revision introduced a contradiction under "What this ADR does not decide".**
- Exact text: the heading "Not decided here, and not MP-1's alone:" followed by the item "The shell's internal shape and rendering internals (MP-1's)."
- An item labelled MP-1's sits under a heading that says these items are not MP-1's alone. Consequences also says "The shell's internal shape is MP-1's to choose".
- This came from the F4 fix. The attempt-1 text had a single list with no such heading.
- Fix (either one): change the heading to "Not decided here:"; or move the item into the "Open items for MP-1's preregistration" list and update "O1 to O7" in "For the human, at acceptance" if it is numbered.

## Checks

**1. Attempt-1 findings: all addressed in the text. B1 and B2 above remain.**

| Finding | Where it is addressed | Result |
|---|---|---|
| Reviewer B1 | "The ruling": the lead-in now says "the span is part of one line and carries that line's hash", with the pin on its own line | Resolved |
| Reviewer B2 | Status | Resolved |
| Reviewer S1 | Decision 6 names both sites. `buildLayers` (buildLayers.ts line 262, called from WorkingCanvas.tsx line 1239) and `ResidentSet.addBatch` (residentSet.ts line 73, called from WorkingCanvas.tsx line 1387) both call `checkPickCeiling(batch.ids.length)` | Resolved |
| Reviewer S2 | Decision 6's premise is labelled "pending open item O5", with a fallback; O5 is added | Resolved |
| Reviewer N1 | The wording changed, but the new sentence is B1 | Not resolved |
| Reviewer N2 | Decision 3 now says "the shell's, as the owner … (O3)"; O3 includes the labels | Resolved |
| Reviewer N3 | A tooling note, deliberately outside the ADR. The commit subject lists N1–N2 only | Non-resolution stated by the custodian's brief |
| F1 | Same as reviewer B1 | Resolved |
| F2 | Status: condition, paragraph and the decision-8 note | Resolved |
| F3 | Consequences: "Datasets declaring exactly Polygon" and "Undeclared Polygon-only datasets"; the Publishing bullets name the loss | Resolved |
| F4 | Consequences: "MP-1 adds the check. The shell's internal shape is MP-1's to choose…" | Resolved there; the list split caused B2 |
| F5 | Decision 4's last bullet and O4 | Resolved |
| F6 | O5 and O6 | Resolved |
| F7 | Decision 8 states conditions (ii) and (iii) | Resolved |
| F8 | Status clause and the "For the human" bullet | Resolved |
| F9 | Decision 3 ("inspectable record … principle 8") and O7. docs/01 principle 8 reads "explicit, logged, and inspectable", which matches the split | Resolved |

**2. Verbatim passages and pin: PASS.**
- A node script compared the ruling passage with the bold text of the ledger's RULED 2026-09-24 round 17, item 7: identical, 441 bytes.
- It compared the decision-4 passage with the text after "*Proposed text, not a quote of anything:*" on the assessment's line 206: identical, 95 bytes.
- The pin recomputes: `git show <rev>:state/consults/2026-09-24-multipolygon-assessment.md | sed -n 206p | sha256sum` gives ddae06db5d61fa8f420f73843d5e900805bbb9eb26341f5a53effa571cdc4be3 at 6030dfd, 188b1f8, c533c40 and origin/main.
- 6030dfd2814b911c92e21bde645c2c4487286ca7 is the only commit that touches the file, and it is an ancestor of origin/main. The pin sits contiguous on one line (round 15 (d)) and is declared a sub-line span.
- The ADR has no other quotation, blockquote, or "verbatim"/"reads:"/"says:" marker. Its only line cite is this pin.

**3. Tree claims: FAIL on B1. Every other new or changed claim resolves at c533c40.**
- `engine/src/fixture.rs` line 611 declares `"geometry_types":["Polygon"]`. It is the file's only declaration. The other writers declare the same: `geoparquet.rs` line 778, `lod.rs` line 1656, and the three engine tests `lod_tier_builder`, `lod_tier_preflight` and `publish_stream`. No empty list is written anywhere in the tree.
- `duplicatesDropped` exists as `addBatch`'s count (`TileIngestResult`). What the sentence around it says about that count is B1.
- The two `checkPickCeiling` sites are as listed under S1 in check 1.
- SKP-V0 §4 item 13: conditions (ii) and (iii) are stated as written (SKP-V0.md lines 277–279), and "any field change is a new version string" is the item's own text.
- ADR-016's Status reads "architect-blockable as of acceptance". ADR-028's reads "Not architect-blockable (unchanged by this acceptance — not raised as a question at acceptance time)". Both record the point at acceptance; see nit N1.
- No shell attribute lookup exists: `ViewportQuery.columns` is documented as "This shell's own client sends `columns: null`", and no product code reads attribute columns.
- The PLAN nodes `b1-shell-half` (status proposed), `geometry-types-beyond-polygons`, `briefb-b3-publish-v2`, `lod-tier-selection`, `geometry-points-cut` and `geometry-lines-cut` all exist.
- The P4 generator is named in the header of `engine/ADMISSION-RESULTS.md`.
- The claim that an undeclared, projected, Polygon-only dataset publishes today holds: nothing in `kernel/` reads `geometry_types`, and `preflight_pinless_parts` refuses only on the row filter and geographic CRS.
- Decision 8's recommended timing ("acceptance at MP-1's gate") matches the assessment's line 210.

**4. Status line: PASS.**
- The condition is stated: "MP-1's preregistration is written only after the human accepts this ADR (the 2026-09-27 session order, its MultiPolygon paragraph, `state/directives/2026-09-27-session-order.md` — paraphrase)". That faithfully restates the order's "MP-1's preregistration only after acceptance", marked as paraphrase, with the directive and its paragraph.
- The Status field parses and ends at `**Drafted by:**`.
- The README cell equals the Status field (scripted compare: equal, 758 characters each).
- `npm run verify:adr-index` exits 0: "adrIndex: PASS -- 33 ADRs, index in docs/README.md matches every Status line".

**5. New defects: FAIL on B2.**
- Nothing binds MP-1 beyond the ruling. The Status says the ADR binds nothing. O6's seam sentence restates the standing round-4 rule, not a new obligation.
- No quotation was added beyond the two verified passages.
- No line cites into a file this commit edits, and no untracked file is cited.

**6. Suites at c533c40: PASS.** Tool behaviour is as of c533c40.

| Suite | Exit | Result |
|---|---|---|
| `verify-cites.mjs` | 0 | 855 files, 32 advisory |
| `verify-quotes.mjs` | 0 | 110 checked / 79 verified / 30 baselined / 1 advisory / 0 errors / 0 hash-reference errors |
| `verify-test-claims.mjs` | 0 | 343 claims across 90 files |
| `verify.mjs --offline` | 0 | PASS |
| `node --test` over scripts/plan and scripts/hooks | 0 | 349 pass, 0 fail |
| `npx vitest run src/docs/adrIndex.test.ts` | 0 | 26 passed |

`git status --porcelain` was empty after all runs.

## Suggestions (non-blocking)

- **S1. Status, "that order replaces decision 8's recommended timing".**
  - The order puts every item "each under its existing rulings", so "replaces" states a reading as a fact.
  - Suggested wording: "that order sets acceptance before MP-1's preregistration, earlier than decision 8's recommended timing (acceptance at MP-1's gate; paraphrase)".
- **S2. Consequences, "Whether any corpus file or fixture declares an empty list is for MP-1's P4 generator re-run to confirm."**
  - The tree already answers this. `engine/compat-corpus/of-record/MANIFEST.json` records no empty `geometry_types` for any file; the two truncated/invalid mutation files record none at all. Every fixture writer declares `["Polygon"]`, and the same Consequences bullet already says the engine's fixtures do.
  - Suggested wording: state it as a fact at 0ada14f, with the P4 re-run confirming it.

## Nits

- **N1.** "For the human, at acceptance": "ADR-016 and ADR-028 recorded it at acceptance." ADR-028 records that the question was "not raised as a question at acceptance time". Suggested wording: "ADR-016 recorded the answer at acceptance; ADR-028 recorded that it was not raised."
- **N2.** Decision 8 states conditions (ii) and (iii) but not that item 13 permits assembly "only under all four", in particular (iv), which freezes the version at merge. Optional.
- **N3 (tool, @ c533c40).** `verify-quotes.mjs` run on the ADR alone reports "0 checked … 0 hash-reference errors (0 hash-baselined)". It does not show that it resolved the ADR's pin. The proof is the manual recompute in check 2.

Files:
- C:/dev/wt/adr-034/docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md
- C:/dev/wt/adr-034/docs/README.md
- C:/dev/wt/adr-034/frontends/shell/src/canvas/tileResidentSet.ts
- C:/dev/wt/adr-034/frontends/shell/src/canvas/tileIngest.ts
- C:/dev/wt/adr-034/frontends/shell/src/canvas/residentSet.ts
- C:/dev/wt/adr-034/frontends/shell/src/canvas/buildLayers.ts
- C:/dev/wt/adr-034/state/consults/2026-09-24-multipolygon-assessment.md
- C:/dev/wt/adr-034/state/directives/2026-09-27-session-order.md
- C:/dev/wt/adr-034/protocol/skp/SKP-V0.md
- C:/dev/wt/adr-034/engine/compat-corpus/of-record/MANIFEST.json
