*Custodian's filing note (2026-10-06): the architect's draft of MP-1's Amendment 2, on the custodian's brief after phase A (worker report 1). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is f3b815817b07e9fd60944b70b568d8e90850bd50d30dd1cd754f09a2f6483cc6. Write audit PASS: zero write calls (Read 22, Grep 20, SubagentHandback 1). Run window from the transcript: 2026-10-05T23:23:01.802Z to 2026-10-05T23:31:37.625Z. Mid-run, the custodian sent it one fact by message: the default verify-quotes run passes at the branch head. The amendment as appended is part 1's block with its HASH-TBD pins computed at e286a5c3; its 4 pins written in full were recomputed and match. Nothing else changed.*

---

Reviewed: main @ e286a5c3; branch cut/geometry-types-beyond-polygons @ 5c3a9e09

Amendment 2 is drafted below, ready for the custodian to save. It has one OPEN item for the human, OPEN-2, which is a red line and holds the merge. Everything else either stands as built or is a phase B instruction. On the goldens I chose no change, on the strength of the default-mode fact you sent mid-task, checked against the tool's own code at main.

Hashes marked `HASH-TBD` are yours to compute at e286a5c3. Hashes written in full are reused from the form's own pins at 15bf4441. Branch code is named in words at 5c3a9e097b65803eeb07294bd9acc4a379d75939, with no hash and no `path:line` token (round 25, item 2 (d)). Nothing below is a quotation.

## 1. The amendment

````markdown
### Amendment 2 — phase A's outcomes: C-12 and C-12S missed (class 2); OPEN-2 put to the human; the goldens unchanged; §7 interim figures; the deviations; the commit plan for phase B

*Written after phase A's outcomes (§9 commits 1 to 3: golden d8276158c49f7709126f9388fabfedec26d55b99, engine 1b978ee5816763d855a55aaf559bf97474a1233b, kernel 5c3a9e097b65803eeb07294bd9acc4a379d75939) and before any of phase B's code. The architect drafted it from worker report 1 (`state/consults/2026-10-06-geometry-types-beyond-polygons-worker-report-1.md`, cited by section) and from a read of the branch at 5c3a9e09; the architect ran no command. Each item states its class (`docs/PREREGISTRATION-TEMPLATE.md` §10). Branch code is named in words at its commit id (round 25, item 2 (d)). Code on main is pinned. Nothing below is a quotation. The gates are proportional (`state/directives/2026-10-05-product-first-direction.md:15 @ e286a5c3 sha256:HASH-TBD`), as Amendment 1 item 3 has it.*

1. **C-12 and C-12S: a deviation recorded after results, with the reason (class 2). No prediction is edited.**
   - **Result.**
     - Corpus row #12 is refused at open as `engine.identity_unusable`, naming `id` (worker report 1, Findings item 1).
     - Its `id` is a nullable string (`engine/compat-corpus/of-record/MANIFEST.json:2569-2573 @ 15bf4441 sha256:556f2fca23e1d53a5d50a2f330d14006e0e4d905c0c12bffe8e9af50ca905c7c`).
     - The worker reports that the file has no 64-bit integer column to declare a mapping over.
   - **Reason.**
     - Identity admission refuses a native `id` whose type does not widen into u64. The session tier applies only when no `id` column exists (lines 1666 to 1710 of `engine/src/dataset.rs` at 5c3a9e097b65803eeb07294bd9acc4a379d75939).
     - The old geometry gate ran before identity admission, so this refusal was unreachable for #12 (`engine/src/dataset.rs:364-374 @ 15bf4441 sha256:30d834cceee7330a562af547081e2d87e674a2cd5d095bf47b362a6895261758`).
     - §3 C-12 recorded the identity class as not derivable statically, and still predicted admission. That drafting error is the architect's.
   - **What C-12, C-12S and P-2 now predict.** All unchanged.
     - **C-12** still predicts admission. Observed, it is refused at identity.
       - The CRS rules and the sanity check did not refuse it, because both run before identity admission (lines 396, 514 and 550 of `engine/src/dataset.rs` at 5c3a9e097b65803eeb07294bd9acc4a379d75939).
       - Its provenance, encoding and `declared_types` are unobserved, because no `Dataset` exists.
     - **C-12S** still predicts 1,375 rows. It is unreachable: the open fails first.
     - **P-2** is read as covering only the rows §3 does not predict (all except #2, #4, #5, #11 and #12).
       - The literal reading is contradicted by C-11 before any run. That drafting defect is the architect's; it is recorded here, not edited.
       - On this reading, #12's miss belongs to P-1, and P-2 is untouched by it.
   - **What C-12S asserts.**
     - The open of #12 succeeds, with encoding `MultiPolygon` and declaration `[MultiPolygon, Polygon]`. A whole-file stream yields 1,375 rows with unique u64 ids and no refusal (lines 34 to 69 of `engine/tests/multipolygon_corpus.rs` at 5c3a9e097b65803eeb07294bd9acc4a379d75939).
     - It is `#[ignore]` and fails at its first `expect`. Its comment records the result (lines 23 to 33, same file and commit).
     - It stays as committed, never edited to pass.
     - §4's mutation for it (as G-1) cannot fail it either way. That row was unfit as drafted, and no mutation applies.
   - **The result of record is the P4 generator's re-run in commit 6.**
     - Its row #12 is entered with C-12's registered prediction (admitted under the format rule, `crs:format-default`), never the observed refusal.
     - The generator records the deviation (`engine/tests/admission_p4_corpus.rs:24 @ e286a5c3 sha256:HASH-TBD`).
     - Its P1 literal is #2, #4 and #5.
   - **Operator step S1** (§9, Operator) cannot pass as drafted.
     - Part S writes S1 as: open corpus #12; the identity refusal naming `id` is shown.
     - The multi-part hover on a real file is not available. S2 (F-1) carries the hover.
   - **User-visible behaviour: nothing beyond ADR-034 and round 59.**
     - #12's refusal moves from the geometry gate to ADR-016's identity rule, which is already declared at `KNOWN-LIMITATIONS.md:60-66 @ e286a5c3 sha256:HASH-TBD`.
     - ADR-034's corpus Consequence still holds (`docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:154 @ e286a5c3 sha256:HASH-TBD`).
     - No OPEN item arises.

2. **Deviation 3, the extra refusal: OPEN-2 is put to the human (a red line, `AI_DEVELOPMENT.md:451-454 @ e286a5c3 sha256:HASH-TBD`, its last item).**
   - **What was built.** A `geometry_types` value that is present and not a list is refused at open as `engine.geo_metadata`, with a P6-placeholder detail. That covers a string, a number, an object and JSON `null` (lines 423 to 427 of `engine/src/geoparquet.rs` at 5c3a9e097b65803eeb07294bd9acc4a379d75939). A-4 asserts the string case (lines 247 to 249 of `engine/tests/geometry_admission.rs`, same commit).
   - **Not within round 59, item 4 by reading** (`state/directives/2026-10-05-round-59-rulings.md:9 @ e286a5c3 sha256:HASH-TBD`).
     - (b1) rules the absent key, and (c1) rules a member that is not a string. A non-list value is neither.
     - §2 E2's [OPEN-1] bullet left this case out (`engine/src/geoparquet.rs:399-408 @ 15bf4441 sha256:9a80870a2192cf7290a02d3013ea3e873510484746fef8bac65399366fea437f`). That omission is the architect's.
   - **Every option changes behaviour.** On main such a file opens as `geoarrow.polygon`, through those lines and `engine/src/dataset.rs:364-374 @ 15bf4441 sha256:30d834cceee7330a562af547081e2d87e674a2cd5d095bf47b362a6895261758`.
   - **Until the ruling:**
     - The arm is held, not reverted, since no ruled state exists to revert to.
     - Phase B's commits 4 to 6 proceed, because no wire shape, fixture or shell text depends on the ruling.
     - The PR is not set ready, and the final gate does not pass, with OPEN-2 unruled.
     - The PR body names OPEN-2's ruling beside OPEN-1's (§9, PR body).
     - A ruling other than (A) is one engine commit: the arm, A-4's lines, and one mutation observed by name.

3. **The goldens and verify-quotes: a post-result record (class 1). Nothing changes.**
   - **Mode.** The gates and CI run `node scripts/plan/verify-quotes.mjs` in its default mode, with no file arguments (`.github/workflows/governance-ci.yml:149-150 @ e286a5c3 sha256:HASH-TBD`).
     - By the tool at e286a5c3, the default scan set is the preregistrations and ADRs, plus three named files and the agent definitions for hash references (`scripts/plan/verify-quotes.mjs:388-408 @ e286a5c3 sha256:HASH-TBD`; `scripts/plan/verify-test-claims.mjs:745-747 @ e286a5c3 sha256:HASH-TBD`).
     - File arguments replace that set (`scripts/plan/verify-quotes.mjs:1012-1027 @ e286a5c3 sha256:HASH-TBD`).
   - **The worker's 6 errors came only from naming the golden files explicitly** (worker report 1, Findings item 2). Those files are instrument data, not record text, and their `rows:`/`bytes:` lines are values, not references.
   - **No format change.** It would rewrite both golden files after product lines, against §8 item 1 and §6's proof, and against the byte-identity at the head that the worker report's goldens section records.
   - **No baseline entry.** Entries are added only by a ruling (`scripts/plan/verify-quotes.mjs:53-58 @ e286a5c3 sha256:HASH-TBD`), and the default run has no finding to baseline.
   - **Reviewer check.** §9's `verify-quotes` line is read in the default mode. At the gated head, the reviewer confirms that both golden files are byte-identical to d8276158c49f7709126f9388fabfedec26d55b99.

4. **§7: interim figures at 5c3a9e097b65803eeb07294bd9acc4a379d75939 (class 1). §7 is not edited.**
   - The figures are in worker report 1, section §7 figures. Engine tests stand at 1,188 against 1,150.
   - The two kernel test files outside §7's kernel list (deviation 4) are counted both ways: kernel 553 for the listed files only, 561 with them, against 560.
   - Commit 4 (item 5, deviation 1) and commit 6 add more lines.
   - The class 8 amendment (`docs/PREREGISTRATION-TEMPLATE.md:169 @ e286a5c3 sha256:HASH-TBD`) is written at the gated head. It gives the final figure by §7's command at that named commit, the kernel group both ways, and the reason.

5. **Deviations 1, 2 and 4 to 12 (worker report 1, Deviations section). Class 1 unless marked.**
   1. **K1's `declared_types` half and K-1's matching assertions move to commit 4.** Sound: they read W1's field, which SKP-V0 §4 item 13 (iii) puts in commit 4. §9's assignment of all of K1 to commit 3 was the architect's error.
      - Commit 4 writes K1's half from `Dataset::declared_geometry_types()` as it exists, `Option<&[String]>` (lines 968 to 975 of `engine/src/dataset.rs` at 5c3a9e097b65803eeb07294bd9acc4a379d75939).
      - K-1 asserts F-1, F-3 (`[]` kept) and a Polygon fixture.
      - K-1's comment records one more observed mutation for this half: write `None` in place of the dataset's list.
   2. **`Dataset::declared_geometry_types` has test callers only until commit 4.** Sound within the branch: the caller rule is judged on the merged diff.
      - Its doc names `describe_dataset` as its product caller (same lines).
      - The gate verifies at the head that `describe_dataset` calls it.
   4. **The two kernel test files.** Sound: they build `FixtureSpec` field by field. G-2's fixture hash at the head proves the default writer unchanged. Counted under item 4.
   5. **The extra ignored test (class 2, against P-5).** The BF writer is ignored, and P-5 did not list it.
      - The reviewer computes P-5 at the gated head against the base, by name. This is the one known extra.
   6. **A-3.** Sound. E1 stays `pub(crate)` (§2 E3, §8 item 11). The gate checks §8 item 7 by reading that the gate and the text both read E1.
   7. **S-3 is weaker than its row.** It checks geometry bytes plus ids against the batch target, not against the estimate's geometry share.
      - The registered mutation fails it, as observed.
      - Commit 5 or 6 adds the row's own per-batch assertion to `every_multipolygon_batch_fits_its_target_under_the_unedited_estimate`: geometry bytes are at most 16 × vertices + 4 × (rows + vertices), the formula in `estimate_bytes`' doc (lines 2253 to 2264 of `engine/src/stream.rs` at 5c3a9e097b65803eeb07294bd9acc4a379d75939).
      - The target assertion is kept. I-4 reads against the new assertion.
   8. **The `read_ring` refactor.** Sound if the gate reads it, against the base loop, as keeping every check, every text and the allocation discipline. G-1 and E-4 are green.
   9. **The unprefixed EWKB text under `Polygon`.** Sound: it is an existing text, and it is still true (§8 item 8).
   10. **"type code" in place of "header".** Sound: wording is the worker's (§2).
   11. **Observations on uncommitted trees.** Accepted as the worker's record. The reviewer's re-made mutations at the reviewed head (§9) are the observations of record for closing record item 5.
   12. **The mishaps.** No repo effect. Phase B briefs kill processes by PID only.
   - **The clippy warning** at line 58 of `engine/tests/multipolygon_stream.rs` (worker report 1, Suites) is fixed in any phase B commit.

6. **Superseded index (read this amendment first).**
   - §3 C-12 and C-12S, §5 P-1 → item 1 (result; not edited).
   - §5 P-2 → item 1 (reading).
   - §4 row C-12S, mutation → item 1.
   - §9 Operator S1 → item 1.
   - §2 E2's [OPEN-1] bullet, and Amendment 1 item 1, for a non-list value → item 2 (OPEN-2).
   - §9 PR body → item 2.
   - §9 Suites, `verify-quotes` → item 3.
   - §7 → item 4 (not edited; class 8 at the gated head).
   - §9 commit plan 3 and 4, §4 row K-1 → item 5.1.
   - §2 E3, `declared_geometry_types`' caller → item 5.2.
   - §5 P-5 → item 5.5.
   - §4 row S-3 → item 5.7.
   - §9 closing record item 5 → item 5.11.
````

## 2. OPEN items for the human

**OPEN-2: what an open does with a `geometry_types` value that is present and not a list** (a string, a number, an object, or JSON `null`).
- **Red line:** yes. It is a change to user-visible behaviour the human has not ruled, `AI_DEVELOPMENT.md:451-454 @ e286a5c3`, last item. Every option changes what today's main does: on main such a file opens as `geoarrow.polygon` and, if projected, publishes.
- **Options:**
  - **(A) Refuse at open** as `engine.geo_metadata`, with a P6-placeholder detail. This is phase A's code, and the same treatment the human gave a non-string member in round 59, item 4 (c1). Such a file no longer opens.
  - **(B) Treat it as an absent key.** The encoding is MultiPolygon and `declared_types` is null on the wire, so the wire claims the key was absent when it was not. A projected file is refused at publish (the S-K2 row would name this case).
  - **(C) Treat it as an explicit `[]`.** The encoding is MultiPolygon and `declared_types` is `[]`, which reports an empty declaration the file never made. Publish is refused as in (B).
  - **(D) Split:** JSON `null` as (B), every other non-list value as (A).
  - **(E) Keep today's outcome**, `geoarrow.polygon`. This contradicts ADR-034 Decision 2 as ruled (the encoding is fixed from the declaration), so it is offered only because it is the one option that leaves today's behaviour unchanged.
- **Recommendation: (A).** It states only what the engine met and reinterprets nothing. It matches (c1). And `declared_types` stays the file's own fact, which (B) and (C) break. The cost: a malformed file that opens today stops opening. The architect knows of no writer that produces one, but did not search. Under (A), S-K1's draft wording can name both refusals at open (the non-string member and the non-list value).
- **What waits on it:** the PR's ready state and the final gate. Phase B's commits 4 to 6 do not wait.

**Two notes that are not OPEN items:**
- **No corpus file reaches the canvas after MP-1.** #11 has no covering bbox, and #12 is refused at identity. Overture-style string ids fall under ADR-016. If the custodian judges this worth tracking, it is a proposed node under the freeze (`state/directives/2026-10-05-product-first-direction.md:8`), not this piece's scope.
- **The S1 rewrite in item 1 is the architect's call, not a ruling,** and the human can overturn it.

## 3. Files read

- C:\dev\spatial-ide\state\consults\2026-10-06-geometry-types-beyond-polygons-worker-report-1.md
- C:\dev\spatial-ide\engine\MULTIPOLYGON-MP1-PREREGISTRATION.md
- C:\dev\spatial-ide\state\directives\2026-10-05-round-59-rulings.md
- C:\dev\spatial-ide\state\directives\2026-10-05-product-first-direction.md
- C:\dev\spatial-ide\state\directives\2026-10-05-adr-034-acceptance.md
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (lines 95 to 178)
- C:\dev\spatial-ide\AI_DEVELOPMENT.md (lines 39 to 52 and 440 to 471)
- C:\dev\spatial-ide\docs\adr\ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md (lines 120 to 179)
- C:\dev\spatial-ide\KNOWN-LIMITATIONS.md (identity search; item 3)
- C:\dev\spatial-ide\engine\src\geoparquet.rs (main, lines 370 to 429)
- C:\dev\spatial-ide\engine\src\dataset.rs (main, lines 355 to 379)
- C:\dev\spatial-ide\scripts\plan\verify-quotes.mjs (lines 1 to 110, 375 to 414, 990 to 1079)
- C:\dev\spatial-ide\scripts\plan\verify-test-claims.mjs (lines 745 to 770)
- C:\dev\spatial-ide\.github\workflows\governance-ci.yml (verify-quotes lines)
- C:\dev\wt\mp1\engine\src\geoparquet.rs (lines 345 to 434)
- C:\dev\wt\mp1\engine\src\dataset.rs (encoding, identity and accessor sites)
- C:\dev\wt\mp1\engine\src\wkb.rs (lines 55 to 304)
- C:\dev\wt\mp1\engine\src\stream.rs (`ViewportQuery::all`, the covering check, `estimate_bytes`)
- C:\dev\wt\mp1\engine\tests\geometry_admission.rs
- C:\dev\wt\mp1\engine\tests\multipolygon_corpus.rs
- C:\dev\wt\mp1\engine\tests\multipolygon_stream.rs (S-3)
- C:\dev\wt\mp1\engine\tests\admission_p4_corpus.rs (rows #11 and #12, verdict logic)
