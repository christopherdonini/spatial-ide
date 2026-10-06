# PR #182 gate 1 — architect
Reviewed: cut/geometry-types-beyond-polygons @ 228bd997eb762188da7901b76dfbd2a07c6abcea

**Verdict: pass with notes.** I found no Correctness or Evidence failure. There are five Documentation-and-record findings, all must-fix in this PR before the merge (§22 as amended by #180; product-first direction, section 2). There is one Correctness note, also must-fix before the merge, but it does not fail the gate.

I read the head's files in `C:/dev/wt/mp1`. Both the local and the remote ref of the branch read 228bd997. I ran no command. These commit-level checks are left to the reviewer and are not certified here:
- the golden commit d8276158's contents, and G-1 and G-2 at it and at the head;
- every hash;
- the re-made mutations;
- §7's recount;
- that commit 4 (ac538440) carries the literal and both sides' fixtures in one commit;
- V-1 against the lock;
- P-5 by name;
- CI at the head;
- the PR body.

## Correctness

**C-n1. Two new `pub` items beyond the form's E3 list, not recorded as deviations.** Severity low, not a FAIL.
- The form says: `- No other new \`pub\` item. New builders and validators are \`pub(crate)\`.` (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md:81`)
- The head adds two:
  - line 31 of engine/src/geoarrow.rs: `pub const EXT_NAME_MULTIPOLYGON: &str = "geoarrow.multipolygon";`
  - line 292 of engine/src/envelope.rs: `    pub fn geometry_encoding(&self) -> GeometryEncoding {`
- Both have product callers inside the crate: `GeometryEncoding::as_str`, the wkb refusal text, `Dataset::geometry_encoding`, `TaggedBatch::assemble` and the stream's `Pending`. So §8 item 11 and the caller rule are not breached.
- Disposition: either narrow both to `pub(crate)` (nothing outside the crate calls them), or record the deviation in the closing record.

## Evidence

No failure. Three notes:

**E-n1. MP' and Part S are unrun.**
- Worker report 2, deviation 4, says MP' and Part S are unrun. Worker report 3, step 7, generated F-1 in the worktree's `target/`, but MP' was still not run.
- The form makes both operator-run (§4 row E2E; §9 Operator), so this is not a gate failure.
- The closing record must list them as unrun, not done. KNOWN-LIMITATIONS item 33 says a MultiPolygon file "can be opened and drawn". The units and SH-8 support that; no real run of the shell has shown it yet.

**E-n2. S-3's per-batch inequality, observation only, no action.**
- The inequality is 16V + 4(rows+V). Under the multipolygon encoding it fails by 4 bytes for a batch of exactly one row with one 4-position ring: the three offset sentinels need P+Rg+3 ≤ V, which is 5 ≤ 4 there.
- S-3's fixture never produces that batch.
- The product claim in `estimate_bytes`' doc is still true: the V·4 term bounds the part and ring offsets, P+Rg+2 ≤ V for V ≥ 4. No ceiling can be approached by a one-row batch.

**E-n3. Seam rule.** Each RS row consumes a real shape:
- S-1, S-2 and S-3 use a real open and stream;
- BF-1 and the committed batches feed SH-1, SH-3, SH-4 and V-2 (the shared loader is in batchFixtures.ts);
- K-1 is a real describe;
- K-2 and K-3 are the real preflight;
- K-5 goes through the real `prepare_with_progress`.

O6: no attribute lookup, callback or `PickResult` field was added (line 6 onward of frontends/shell/src/canvas/pick.ts).

## Documentation and record (each must-fix before the merge)

**D-1. O7 is undecided.**
- ADR-034 leaves it to MP-1's form: `How principle 8's logging requirement is met for the promotion is open item O7.` (`docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:63`; a sub-line span, the hash is the line's).
- The form names O3, O5, O6 and O8. O4 is covered implicitly by E4. O7 is not named anywhere, so closing record item 8 cannot resolve it.
- Proposed appended line: "O7: the promotion's record is `describe`'s `encoding` beside `declared_types` (K1, W1) and the per-batch envelope `geometry_encoding` key (E6). No separate log entry. Proof: K-1, E-8."
- Not blocking on my reading, because accepted Decision 3 already names those `describe` facts as the principle-8 record. If the custodian reads "logged" in docs/01 principle 8 as needing a log entry, that reading is the human's, and the PR waits for it.

**D-2. P-5 has a second unrecorded miss (class 2).**
- `generate_the_multipolygon_f1_fixture` is a second extra ignored test (worker report 2, deviation 4).
- Amendment 2 item 5.5 recorded the BF writer as "the one known extra".
- Fix: an appended class-2 row, or the closing record.

**D-3. Amendment 4's reason only partly gives a cause.**
- Item 4 says where the overrun is. For kernel and shell tests it cites the added files (report 2, deviations 4 and 5).
- The largest overrun, engine tests at +108, lies wholly within §7's listed files (10 files), and no cause is given for it. A location is not a cause, and class 8 requires the reason (`docs/PREREGISTRATION-TEMPLATE.md:169`).
- Fix: one reference or clause giving the cause.
- The figures check out: the groups sum to 4,654 lines over 88 files. Docs is 88 (20+14+12+42, report 3 step 6). Kernel is 588 for the listed files and 620 with the three unlisted. §7 is not edited.

**D-4. A quote is not byte-identical (§8 item 17; not the human's words).**
- Lines 4 to 5 of renderer/bundle-viewer/scripts/partition-encoding.test.mjs quote `"the viewer` … `already refuses a foreign encoding"`.
- The source reads `The viewer already refuses a foreign encoding.` (`docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:128`; a sub-line span). The case of the first letter differs.

**D-5. Two texts in the PR are stale or will be.**
- Line 1568 of frontends/shell/MANUAL-WALKTHROUGH.md at the head reads `- Read the form's §10, its last amendment first (Amendment 2).` The last amendment is now 4. Drop the number.
- Line 17 of protocol/skp/tests/conformance/AMBIGUITIES.md at the head reads `is minted on \`cut/geometry-types-beyond-polygons\``. That stops being true at the merge. Use the `skp/0.8` precedent's form, "minted at the merge of".

## The checks, item by item

**§8, items 1 to 18:**
1. Reviewer.
2. Pass. The encoding is chosen once (line 368 of engine/src/dataset.rs). The envelope writes the key and the field from one value. `describe` reads it (line 1928 of kernel/src/skp.rs).
3. Pass. One geometry offset per row in `MultiPolygonBuilder`; S-1.
4. Pass. `partCount` at line 269 of buildLayers.ts and line 73 of residentSet.ts.
5. Pass. The two labelled `<dt>`s at lines 36 and 41 of DescribeSummary.tsx.
6. Pass. The `?` at line 2028 of engine/src/stream.rs; S-2.
7. Pass. Lines 84 to 105 of geoarrow.rs. The retained spans of the sighted wording match across the `[...]` elision. The gate and the text both read `READABLE_GEOMETRY_TYPES`.
8. Pass. Deviation 9 is accepted. Every message states its owner's fact.
9. Pass. Lines 484 to 498 of kernel/src/publish/mod.rs. `Refused` at line 300 of kernel/src/permission/boundary.rs. Never `Engine`.
10. Pass by reading. `estimate_bytes`' body is identical to main's; only its doc is added. `format_declaration` still declares `geoarrow.polygon`. lod.rs has the same line count as main. The diff itself is the reviewer's.
11. C-n1.
12. Pass by reading. `SKP_VERSION` is `skp/0.9` (main is `skp/0.8`). The §8 entry is last, before §9. The one-commit check is the reviewer's.
13. Not applicable (ruled in round 59, item 4).
14. Pass.
15. Pass. L-1 uses the LOD precedent's `cfg_attr` ignore. The BF writer and the F-1 generator are plain generator ignores, not platform ignores.
16. Pass:
   - Amendment 4's first line carries the class-8 words, and §7 is not edited.
   - No `verify-mutation` run is called an observation (report 1's Mutations section).
   - Branch spans are named in words with their commit ids, and no hash is pinned at a branch commit.
   - No five-line form exists.
17. D-4.
18. Pass on report 3's 7/7 and 6/6 lines, within §2's sections. The reviewer checks the lines.

**ADR-034 Decisions 1 to 10:** all pass.
- Decision 1: E1.
- Decision 2: E2 and E6. Case-insensitive; `[]` and an absent key give MultiPolygon.
- Decision 3: bits carried through by `read_ring` (identical to main's loop, so deviation 8 is sound); `declared_types` keeps order, case and `[]`.
- Decision 4: treatment (a).
- Decision 5: one row per feature; parts never become rows.
- Decision 6: picking through `partToRow`; the first part's anchor; the ceiling counted in parts.
- Decision 7: the sighted wording.
- Decision 8: `skp/0.9`, with `deny_unknown_fields` kept.
- Decision 9: class 1; the refusal comes before the pin.
- Decision 10: placement and ownership.

**Riders and acceptance:**
- Rider 1: refused by name, never dropped.
- Rider 2: no surface calls the encoding the file's type.
- Acceptance item 1: S-K2.
- Acceptance item 5: no counting as unread.
- Acceptance item 6: every new string is `[P6 placeholder]`; Part S, step S4, lists them for the human.

**ADR-010 rules 1, 2 and 6; ADR-016 §5; ADR-017 §4:** pass. The frame is unchanged. The format declaration is unchanged; the reviewer checks the ADR-017 file itself.

**SKP-V0:** pass.
- §4 item 13, conditions (i), (ii) and (iv) by reading; condition (iii) is the reviewer's.
- §1 is updated in place at lines 71 to 73 of protocol/skp/SKP-V0.md.
- The §8 entry records the field, the second value and the in-place update.

**Verbatim quotes:** no quotation of the human's words is in the diff. Amendments 1 to 4 each disclaim quotation.

**Discharge claims:** all resolved against the head.
- Amendment 2, items 5.1 and 5.2: lines 3028 to 3033 and line 1931 of kernel/src/skp.rs.
- Amendment 2, item 5.6: geoarrow.rs.
- Amendment 2, item 5.7: lines 364 to 381 of engine/tests/multipolygon_stream.rs.
- Amendment 2, item 5.8: read against main's loop.
- Amendment 2, the clippy fix: line 58 of the same file.
- Amendment 3, item 1: lines 423 to 427 of engine/src/geoparquet.rs.

**Worker report 2, deviations 1 to 10:**
- 1, 2, 3, 5, 7, 8 and 9: sound.
- 4: sound in purpose, but D-2 applies.
- 6: sound. The two-site mutation proves the assertion can fire. It guards only what `read_ring`'s check of at least 4 positions already guarantees.
- 10: superseded by round 61, item 1 and by commit 7.

**Worker report 3's one deviation:** sound; a fix to the script's label match, with no text changed. Its self-check was not run; commit 7 touches only the README index, which the reviewer checks.

**KNOWN-LIMITATIONS, S-K1 to S-K4:** pass.
- S-K2 (item 32) names both of round 59 item 4's cases, the empty list and the absent key, and the order after the degrees refusal.
- S-K1, S-K3 and S-K4 match the code. `build_tiers` has test callers only (line 2664 of kernel/src/skp.rs is inside a test).
- All four are marked draft wording for P6.

**P6 placeholders:** pass. Every new operator string carries the prefix. Deviation 9's unprefixed text is an existing, still-true text. The sighted `engine.geo_metadata` wording is the one exception the form allows (§1, Operator wording).

No ADR decision is missing, so no ADR skeleton is drafted.

Paths: `C:/dev/spatial-ide/engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `C:/dev/spatial-ide/docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md`, `C:/dev/wt/mp1/engine/src/geoarrow.rs`, `C:/dev/wt/mp1/engine/src/envelope.rs`, `C:/dev/wt/mp1/renderer/bundle-viewer/scripts/partition-encoding.test.mjs`, `C:/dev/wt/mp1/frontends/shell/MANUAL-WALKTHROUGH.md`, `C:/dev/wt/mp1/protocol/skp/tests/conformance/AMBIGUITIES.md`.
