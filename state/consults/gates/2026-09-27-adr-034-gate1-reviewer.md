*Custodian's filing note (2026-09-27): gate 1, attempt 1 (reviewer), full gating, of ADR-034 filed Proposed, for PLAN node `geometry-types-beyond-polygons`. Reviewed: docs/adr-034-geometry-admission @ 208dd3bc2f4c298855f6c322377989be247b8176 (from the report's own first line; the full id from the branch). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. The custodian recomputed B1's proposed pin (`git show 6030dfd:<path> | sed -n 206p | sha256sum`; 6030dfd is on main). Profile paths redacted at filing (0).*

---

Reviewed: docs/adr-034-geometry-admission @ 208dd3b — FAIL (2 blocking)

Gate: attempt 1, full gating (AUTONOMY.md §21a, an ADR status line), PLAN node `geometry-types-beyond-polygons`. I checked the diff with `git diff origin/main...HEAD` in C:/dev/wt/adr-034. It touches four files. The worktree is clean (LF endings, trailing newline) and the remote branch head is 208dd3b.

## Blocking

**B1. Check 1: the reproduced assessment passage has no path:line and no hash (round 12, item (b)).**
- File: C:/dev/wt/adr-034/docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md, "The ruling", the lead-in to the second italic passage: `Decision 4's wording, as sighted, byte-copied by script from the assessment's §5 item 4 and marked so:`
- The text is byte-identical to its source. But the source is a consult file, not the ledger, so the (a′) exemption for ledger passages does not apply. Round 12 (b) requires a reproduced passage to be cited as path:line with its span's sha256. The gate fails "reproduced text without its script mark and hash" by name. This passage has the script mark but no path:line and no hash.
- Fix: in the lead-in, add a pin on one line (round 15 (d)) at the commit on main that added the file (round 15 (e)), and say it is a sub-line span carrying its line's hash:
  `state/consults/2026-09-24-multipolygon-assessment.md:206 @ 6030dfd2814b sha256:ddae06db5d61fa8f420f73843d5e900805bbb9eb26341f5a53effa571cdc4be3`
  I recomputed the hash with `git show <rev>:<path> | sed -n 206p | sha256sum`. It is the same at 6030dfd, 188b1f8 and 208dd3b; 6030dfd is the only commit that touches the file.
- The first passage, the human's answer, needs no hash: it is a ledger passage cited by round and item (a′). It resolves.

**B2. Check 2: the acceptance-timing clause leaves out the directive's condition.**
- Same file, line 3 (the Status line), and the same text in the docs/README.md row: `it is sought before MP-1's preregistration is written (the 2026-09-27 session order, `state/directives/2026-09-27-session-order.md`)`
- The directive's MultiPolygon paragraph says: "bring it to me for acceptance; MP-1's preregistration only after acceptance." That condition makes the preregistration wait for acceptance. The clause only says when acceptance is sought. Read as written, the clause is still satisfied if the preregistration is written while acceptance is sought but not yet given. The clause cites the directive as its source, but it does not state what the directive requires.
- Fix: `…acceptance is the human's (a red line); it is sought before MP-1's preregistration, which is written only after acceptance (the 2026-09-27 session order, its MultiPolygon paragraph, `state/directives/2026-09-27-session-order.md`).` Naming the paragraph also follows the directive's own filing note ("Cited … with its paragraph"). Then regenerate the index with `npm run adr-index`.

## Checks

1. **Verbatim passages: FAIL on B1 only; the bytes match.**
   - My script compared ADR line 33 with the bold text of the round-17 RULED block, item 7 (the ledger line for entry 126): identical, 441 bytes.
   - ADR line 37 against assessment line 206, the text after "*Proposed text, not a quote of anything:*": identical, 95 bytes. Both lengths match the filing note.
   - Apart from its two marked markers, the draft consult's fenced ADR differs from the filed file only in the disclosed Status clause (`diff` result).
   - No other quotation marks, blockquotes, or "verbatim", "reads:" or "says:" markers appear. The two paraphrases are marked "(paraphrase)" (line 59, the rider; line 100, round 17 item 3) and are faithful.
   - `verify-quotes` does not resolve these passages; that tool is a floor, not the proof.
2. **Status line: FAIL on B2.**
   - It says Proposed, binds nothing, not architect-blockable until accepted, and acceptance is the human's.
   - The Status paragraph ends at `**Drafted by:**`. The README cell is byte-equal to the ADR's Status field (scripted compare). `npm run verify:adr-index` exits 0: "33 ADRs, index … matches every Status line".
3. **Tree claims: PASS.**
   - No code changed between 0ada14f and 208dd3b, only state/ filings. At 208dd3b all eighteen claims resolve, for file, symbol and behaviour:
     - `dataset.rs` lines 326–331 (`eq_ignore_ascii_case`, the polygons-only text)
     - `error_of` line 1801 and SKP-V0 §5
     - `WKB_POLYGON`/`push_wkb` returning `EngineError::Wkb`, and `stream.rs` line 1964 `push_wkb(wkb)?`
     - `geoarrow.rs` lines 26, 93 and 179
     - `envelope.rs` line 184
     - `describe_dataset` line 1655, and `GeometryInfo` `deny_unknown_fields` with the "Always geoarrow.polygon" doc
     - `DescribeSummary.tsx` line 33
     - `decodeBatch` checks `frame` only (no `geometry_encoding` anywhere in the shell's src)
     - `EXPECTED_ENCODING` (partition.ts lines 29 and 123)
     - `verify-bundle.rs` line 407 `starts_with("geoarrow.")`
     - `format_declaration` line 1151, and `preflight_pinless_parts` holding `GeographicCrsNotPublishable` before the pin
     - lod.rs line 1511, and `build_tiers` called only by tests (including skp.rs line 2209, inside cfg(test) from line 2007)
     - `addBatch` dedupe
     - `resolvePick`'s `batch.ids[gpuOrdinal]`
     - `checkPickCeiling(batch.ids.length)` at buildLayers.ts line 262
     - `wkb.len() / 16`
     - ADMISSION-RESULTS #2/#4/#5 are Point and #11/#12 are mixed
     - #11 and #12 are in degrees (OGC:CRS84, and R-C2's format default)
     - the five PLAN nodes exist
     - docs/08 has no multipart class
4. **Cites: PASS.**
   - ADR-016 §5 is uniqueness over the emitted identity, §6 is the rule-1 caution and §7 is width.
   - ADR-010: rule 1 (the envelope tag), rule 2 (ordinal → id → f64), rule 6 (pick ceiling).
   - ADR-017 §3 is versioning; §4's Schema row pins `geoarrow.polygon`.
   - SKP-V0: §1 `describe` ("none of them runs a new query"), §4 item 13, §5, §8 (the change log).
   - docs/01 principles 7 and 8.
   - Round 17 items 3 and 7, entry 126, and RULED 2026-09-24 (night) item (2) all resolve.
   - There is no line cite into the ledger and no cite into an untracked file; the session order is on main at 188b1f8.
5. **adrIndex: PASS.**
   - One line changes in `HEADER_LINE`. The test assertion changes to the same substring. Nothing else in the generator changes, and the README equals the generator's output.
6. **Suites (all at the head): PASS.**

   | Suite | Exit | Result |
   |---|---|---|
   | `verify-cites.mjs` | 0 | 855 files, 32 advisory |
   | `verify-quotes.mjs` | 0 | 110 checked / 79 verified / 30 baselined / 1 advisory / 0 errors |
   | `verify-test-claims.mjs` | 0 | 343 claims across 90 files |
   | `verify.mjs --offline` | 0 | PASS |
   | `node --test` plan + hooks | 0 | 349 pass, 0 fail |
   | `vitest src/docs/adrIndex.test.ts` | 0 | 26 passed |

   Disclosure: I ran `node scripts/adrIndex.mjs --help` by mistake. It ignores an unknown flag and runs in write mode ("wrote 33 ADR rows"). The bytes it wrote were identical, and `git status --porcelain` stayed empty afterwards.
7. **Accepted ADRs and red lines: PASS.**
   - No file in docs/adr other than ADR-034 is touched, and docs/01 is untouched. The only red line is this ADR's own acceptance.
   - Filing an ADR with no preregistration follows the precedent of #114 (ADR-035): the same four files.

## Suggestions (non-blocking)

- **S1. Decision 6** (`checkPickCeiling(batch.ids.length)` in `buildLayers` counts features): there is a second product caller, `frontends/shell/src/canvas/residentSet.ts:73` (`ResidentSet.addBatch`, used by WorkingCanvas.tsx). Name both sites, or the "defect by name if left" will be fixed in only one of them.
- **S2. Decision 6** assumes one deck.gl datum is one polygon ("pick ordinals, which are parts"). The architect's own consult, (c) O7, says this is unverified. Either state it as a premise pending O7, or list it under "What this ADR does not decide". As written, it reads as settled.

## Nits

- **N1.** Line 74, "lose every part after the first, silently": `addBatch` counts the drops as `duplicatesDropped`, and the residency diagnostics report that count. More precise: "indistinguishable from an ordinary cross-tile duplicate".
- **N2.** Line 59, "The labels' wording is the owner's (P6)": P6 is not defined in the ADR. Name the phase or the sight rule it means.
- **N3 (outside the diff).** `frontends/shell/scripts/adrIndex.mjs` writes when given an unknown flag. It should refuse any argument other than `--check`.
