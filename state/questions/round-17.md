Question round 17 — 2026-09-24 (custodian → human), the morning round of the night program (state/directives/2026-09-24-night-program.md). Nine items in ask order, asked as three question sets (4, 4, 1); DECISIONS-PENDING entries 121-128 carry the full text, and every consult named is tracked under state/consults/. Red-line items accept typed text only: the only preset option is "hold", and the answer is your own words. Status at filing: PRs #97, #104, #105, #106, #107, #109 and #111 are ready for your click; #108, #110 and #112 are STOPPED under Rule 7; the watcher is stopped before code.

1. crs-unit-fact-and-bounds, PR #112 (entry 128) — STOPPED under Rule 7. Full-gate attempt 2 failed in both gates on one semantic item; the code, wire and scope pass (CI 9/9, 1055/1055, mutations 12/12). KNOWN-LIMITATIONS item 17 no longer states entry 120 (1)(c)'s bound. Its comment hands the bound to PR #109 and says it stops describing the build at landing. That is false for the render-precision half: re-centring is unchanged for degrees, so the 1/32 px at zoom 21 and 0.5 px bound still holds. My record-round brief prescribed that hand-off. The watcher stacks on this branch, and B1 takes the literal after both.
  (1) Continue: one text-only round under a fresh count (Recommended). Item 17 keeps a degrees sentence: the Q2 constants are still metre-declared and the P0 render bound still holds. The anchor-span clause becomes the declared per-unit value, #109's text is carried through the merge (#109 lands first), the five rustfmt blocks are formatted, the record residue is corrected, and both gates run. A record-only failure after that goes to the architect's reduction.
  (2) Retire (1)(c)'s statement at landing: item 17 drops the bound when #112 lands.
  (3) Hold: the watcher and B1 wait with it.

---

2. The watcher (entry 122) — STOPPED at two points beyond the brief and the seven additions. S1: addition 4 needs an idle push and SKP v0 declares no server-to-client push (protocol/skp/SKP-V0.md:216). S2: a directory watch does not see its own rename, so addition 5 needs a second watch on the grandparent, filtered to the directory's name. The architect's preregistration (state/consults/2026-09-24-source-change-watcher.md) covers everything else; no code exists.
  (1) Both as recommended (Recommended): S1 = one SKP control-plane event, dataset_session_ended, on the watcher's own literal, its ADR filed Proposed for your acceptance; S2 = one grandparent level, ancestors above it a KNOWN-LIMITATIONS line.
  (2) S1 as recommended; S2 declined: a rename of the watched directory is a KNOWN-LIMITATIONS line.
  (3) S1 as a Tauri event outside SKP (not recommended); S2 as recommended.
  (4) Hold: the watcher stays blocked.

---

3. [RED LINE — typed text only] B1's draft (entry 123), stop items 1 and 2, both accepted-ADR text. Item 1: ADR-017 §4's bundle type list refuses float32 and dictionaries, which ADR-023 §2 as amended admits through the shared gate; the recommendation keeps §4's list as a named bundle-format restriction, byte-identical, until B3's bundle-v2 ADR (an ADR-017 amendment skeleton is in the draft). Item 2: the ADR-021 filter namespace widens by reference; the recommendation is Float32 filterable, dictionaries not filterable in B1. Draft: state/consults/2026-09-24-b1-engine-prereg-draft.md.
  (1) Hold: type your ruling on items 1 and 2 in your own words.

---

4. B1's draft (entry 123), stop items 3-8 and the sight: the producer-before-consumer pre-commitment, what projectable means, condition (1) timing, dictionary reachability, B1's branch base, names containing commas — each with a recommendation in the draft. F1 (bind_admit's expect on every admitted column) is fixed in B1 whatever you rule. The literal is stated as the one after the watcher's (RULED 2026-09-24 (night) item (2)).
  (1) Draft sighted; items 3-8 as recommended (Recommended): the draft is committed as B1's preregistration once items 1 and 2 are ruled.
  (2) Hold: the draft stays a consult.

---

5. crs-unit-fact-and-bounds (entry 124) — four questions outside its ruled scope, independent of entry 128's stop. Q1: values for a unit recorded as other or unestablished. Q2: MAX_ZOOM = 21 and the fit zoom constants are the same item-6 class. Q3: interactive zoom has no declared ceiling (ADR-010 rule 6; pre-existing, unit-independent). Q4: the architect's degree drift cap is 2^17 degree, equal to the metre value by derivation.
  (1) All four as recommended (Recommended): Q1 keep today's one-unit values and declare other's when such a dataset enters a slice corpus; Q2 a follow-on node; Q3 declare a ceiling in its own node; Q4 accept the cap as declared.
  (2) Q1 and Q4 as recommended; Q2 and Q3 to the weekly window.
  (3) Hold.

---

6. The 5 GB fixture's post-write watchdog (entry 121). The regeneration race is fixed in PR #105. On a cold disk the generate phase's 60 s silence ceiling can fire while the writer's close() flushes the last row group and footer; the file is still correct, and FIXTURES.md now tells the operator to check size and hash. A change to what the ceiling measures amends kernel/SCALE-PASS-PREREGISTRATION.md §3, which would invalidate the recorded scale-pass run (a red line: typed text only, if you want that route).
  (1) A separate regeneration entry point outside the measurement harness, byte-identical output, about 30 lines of test code, as its own bounded piece (Recommended).
  (2) Accept as is: a spurious firing costs a retry.
  (3) Hold.

---

7. MultiPolygon (entry 126; state/consults/2026-09-24-multipolygon-assessment.md). The corpus problem is 5 of 12 files refused on geometry type; only #11 and #12 involve MultiPolygon (mixed with Polygon rows). The architect proposes MP-1 as one vertical cut after crs-unit, the watcher and B1. Eight decisions: 1 mixed columns admit, Polygon rows promoted to one-part MultiPolygons; 2 encoding chosen per dataset; 3 an empty geometry_types gets the MultiPolygon encoding; 4 new refusal wording, proposed: "geometry_types [...] include types this engine does not read; it reads Polygon and MultiPolygon"; 5 publishing rides B3's bundle v2, MP-1's preflight refuses by name; 6 MP-1 takes the literal after B1's and adds describe.declared_types; 7 LOD stays out (no product caller); 8 ADR-034 filed Proposed before MP-1's preregistration.
  (1) All eight as recommended, decision 4's wording sighted as proposed (Recommended).
  (2) Decisions 1-3 and 5-8 as recommended; decision 4's wording to be redrafted for your sight.
  (3) Hold: MP-1 stays unplaced.

---

8. test-claims-landedness-bound (entry 125) — STOPPED before code: every candidate design makes P3b's three held historical mentions binding and turns main's CI red, which overrides your round-16 item-4 hold.
  (1) Sequence it after the superseded-name scanner (weekly window), then implement (c): verify fails a node whose evidence PR is merged but which is not done (Recommended).
  (2) (c) now, with an explicit held exemption for nodes you hold (a new PLAN field).
  (3) Hold.

---

9. PR #108 and PR #110 (entry 127) — both STOPPED under Rule 7 after two Correctness FAILs. #108's multi-line attribute tracking can swallow the rest of a file on a stray bracket (no real file regresses: 2238 tests listed on main, 2251 on the branch, 0 lost). #110's own-block boundary ends a body early at a bracket inside a JS string, so at least 2 of 22 predicted MISSes would be false.
  (1) Continue both, narrowed, #108 first (Recommended): an unclosed attribute falls back to single-line handling after a bounded look-ahead; #110 gets character-level open tracking with JS and Rust quote forms stripped.
  (2) Continue #108 narrowed; drop #110 (the whole-file window stays).
  (3) Drop both.
  (4) Hold.

Filed for the weekly window (earliest 2026-09-25), not asked now. From the previous list: the superseded-name scanner; verify.test.mjs:119's flake; AUTONOMY.md section 21c naming DEPENDENCY-LICENSES.md; an audit fail-closed test; the excluded crates' empty [workspace] table; Part N's stale result-log prompt; e2e-test-surface.ts:305-313; the eleven cited E2E outputs that no longer exist; the Display convention row's render test; stale comments at engine/src/crs.rs:50-52 and engine/tests/admission_format_semantics.rs:711-713; the is_some-only fixture check at protocol/skp/tests/fixtures.rs:132. Tonight's: main fails cargo fmt --check (1748 blocks; no rustfmt.toml, no CI fmt step); npm audit advisories in frontends/canvas-probe and protocol/transport-bakeoff/web; raw DuckDB connections in engine/src unit tests (cancel.rs, predicate.rs); trackedPathExists (evidence.path) has the pathspec weakness PR #107 fixed for gates; five 5 GB tests in four other files lack release-only guards; dev fails on a clean clone (NOTICE not generated); the licence audit's tree key cannot express a build-time-only decision; main's committed DEPENDENCY-LICENSES.md was generated under-provisioned (PR #97 corrects it); verify-mutation's stricter token rule would flip about 22 tests to MISS once PR #110 lands (information: the rule's intent).
