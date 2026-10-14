*Custodian's filing note (2026-10-14): the worker's report for `stale-test-names-and-comments`, built in C:/dev/wt/stn from main a5666a49 to the form as amended (Amendments 1 and 2); the head f73eb8038b632055732adfa85c41469ad77f9dbb, pushed and checked by the custodian (porcelain empty; local equals origin; 18 files and 122 lines by numstat against a5666a49). The run 2026-10-14T11:43:31Z to 2026-10-14T13:01:50Z by its transcript (Bash 53, Read 2, Monitor 1); its one SubagentHandback call, at 13:01:49Z. Extracted by script; 8 rooted path:line cite(s) de-rooted and one final newline added; nothing else changed. The message's sha256 as handed back is cdfe38ea7a6f2b896e0682272361004f42200658154791ec120c05eeb1c393ea; this file's, from line 5 to the end, is dc296a8fb656c1813e19750a8e613a88d242005f9af49c9c461e4c5094749f7a.*

---

REPORT stale-test-names-and-comments. Model: Sonnet 5.5, no override, no handoff. No tracked files outside the 18 below were touched.

HEAD f73eb8038b632055732adfa85c41469ad77f9dbb, pushed (origin matches), porcelain empty. Base a5666a49. Commits, all signed off with the trailer:
- 9dbb4cc3 test: the rename (F2 + F2r), alone and first.
- bceac904 docs: D2, H4, F7, F4, F3a-F3d, F10a-F10c, OPEN-3(c).
- f73eb803 docs: OPEN-1, OPEN-2, OPEN-3(a)(b).

ROWS AS BUILT
- F2: line 139-142 of engine/tests/identity.rs (at f73eb803). The fn is renamed. The Watchdog label equals the new name (a_file_whose_key_is_not_called_id_admits_on_the_session_tier_until_a_mapping_is_declared) and rustfmt put it over 3 lines.
- F2r:
  - line 254 of engine/src/identity.rs (at f73eb803), name only.
  - line 65-69 of engine/tests/admission_instruments.rs (at f73eb803). The path-whole line is over 100 columns under 2.0(g).
- D2: line 553-562 of kernel/tests/manual_walkthrough_fixtures.rs (at f73eb803), shortened to 4 lines. It keeps the ExplicitNull reason and engine.crs_undeclared for stepBothNeeded half (a), and drops "same filename", the both-remediations intent and "no change needed there".
- H4: skp_filter_cancellation.rs:176 now reads "last 100 of FEATURES ids".
- F7: first_batch_factorial.rs:1290-1291 now reads "in ADR-018's vocabulary (Accepted), whose item 2 scores the budget on that pair." It claims no scoring by this test.
- OPEN-3(c): first_batch_factorial.rs:1293 now reads cancel_quiescent-class (one-word change, class-2 note below).
- F4: line 37-39 of renderer/tests/style_shell_agreement.rs (at f73eb803).
- F3a: App.test.ts:52-63. The key remount is "not pinned by a unit test". The REOPEN' text is unchanged.
- F3b: AdmissionPanel.test.ts:24-25.
- F3c: CrsAssertionForm.test.ts:13-15.
- F3d: WorkingCanvas.test.ts:123-125, written per Amendment 2 item 12.
- F10a: residencyStatus.test.ts:189 and the describe title at :195. Vitest full name changed.
- F10b: pickResolution.test.ts:236-238, and regression.mjs:1075-1079.
- F10c: regression.mjs:1760 and :1763.
- OPEN-1: line 21-22 of kernel/src/lib.rs (at f73eb803) and line 276-277 of kernel/README.md (at f73eb803), piece d's qualified sentence.
- OPEN-2: line 254-255 of engine/src/identity.rs (at f73eb803) now names all three callers.
- OPEN-3(a): admission_format_semantics.rs at 504, 699-700, 762, 840-842. The cites move to ADR-013 Amendment 1 item 2 or item 4, Accepted (item 4 for the display sentence).
- OPEN-3(b): session_identity.rs at 116-121 and 209-210. The cites move to ADR-016 Amendment 1 item 1, Accepted. The existing quoted span is kept byte-identical, and the draft is named in words at 433413a.

F3d comment as written, byte for byte (line 123 begins with the quoted span's tail):
// one re-render path." `applyStyleChange` is the pure seam this drives, with no mount. The real
// `WorkingCanvas` is mounted only in `WorkingCanvas.wiring.test.tsx`, with deck's `Deck` class
// stood in because jsdom provides no WebGL context, and that file drives no style change.

DEVIATIONS (for you to class)
- Class 8: engine/tests/identity.rs counts 6 against its ceiling of 4, as predicted. The line is not compressed and the label not shortened.
- Class 2: E1's one-removed/one-added does not hold for the Watchdog line. It is 1 removed, 3 added.
- Class 2, judgment calls:
  - OPEN-3(c) uses cancel_quiescent for the "consumer's terminal return" figure. The form says only "ADR-018 item 1's instants", and ADR-018 item 2 says cancel_quiescent is reported beside the budget pair with no budget attached. You may want the architect to confirm the choice.
  - kernel/README.md says "(DuckDB's spill: `kernel/CANCELLATION-AND-TRACING.md` §7)" rather than "named below", because the README has no later spill mention. kernel/src/lib.rs says "named below, by section", which is true there.
  - The 433413a cite in session_identity.rs is a comment reference, not a hashed pin.

REWRITES AND §4 EVIDENCE
1. List: the old name was listed at B and the new name is listed at H. For the identity test target the new name is listed alone (rc 0). Across engine at B and H, the lists differ by exactly that one name. Kernel and renderer lists are identical (391 and 32 tests).
2. The renamed test passes by exact name: 1 passed (rc 0).
3. The old name and old label, searched by git grep: only state/ records (11 files in total) plus the form. Outside state/, only the form (rc 0).
4. The new name, searched by git grep, is in exactly these files, which is Amendment 2 item 13's set:
   - identity.rs (src and tests), admission_instruments.rs, the form;
   - PLAN.yaml, CUSTODIAN-QUEUE.json, site/data/plan.json;
   - state/consults/2026-10-11-...-architect-draft.md.
5. The caller list resolves: session_identity.rs::a_single_file_keyless_source_admits_on_the_session_tier_and_records_its_basis, identity.rs::<new name>, and b1_projection_hostile_names.rs::a_native_id_with_u0000_opens_on_the_session_tier_with_no_nul_candidate (fn at line 733, call at line 750). All three are in engine/src/identity.rs. I did not run the reviewer.md:24 grep itself.
6. verify-test-claims exits 0 at H (562 claimed tests exist, rc 0). The done commit is not mine.

E1 to E7
- E1: comment-only except the three expected lines. The fn line is 1 removed, 1 added. The label line is 1 removed, 3 added (class 2). The describe line is 1 removed, 1 added. Checked by reading the full diff.
- E2: as in item 1 above. Vitest list for residencyStatus.test.ts at B and H differs by exactly the one enclosed test's full name.
- E3, all rc 0:
  - engine identity + admission_instruments: 1 and 8 passed.
  - style_shell_agreement: 1 passed.
  - kernel --tests --no-run: rc 0.
- E4: cargo fmt --check rc 0. cargo doc --no-deps -p spatial-engine gives 19 warnings at H; the unique-warning sets at B and H are both 51 lines and identical, so H is a subset of B.
- E5:
  - vitest over the six touched files: 6 files, 256 tests passed.
  - npm run typecheck rc 0.
  - node --check e2e/regression.mjs rc 0.
  - Note: the first two vitest runs failed on one file (a vite import error) before renderer/bundle-viewer had its node_modules. After npm ci there and the typecheck pretypecheck step, all six pass. I treat the earlier failures as environment, not a regression.
- E6:
  - verify-cites rc 0, verify-quotes rc 0, verify-test-claims rc 0, verify.mjs rc 0.
  - queue.mjs --check current (rc 0). site.mjs --check current (rc 0).
  - `node --test` over scripts/plan, hooks and evidence: 457 tests, 457 passed, rc 0.
  - The brief's `verify-quotes.mjs --show-cites <changed files>` run exits 1 with 17 "quote not found" FAILs on code string literals in regression.mjs and residencyStatus.test.ts. The identical FAIL set appears with the files at base a5666a49, so it predates this piece.
- E7: items 1 to 6 hold, as above.

§7 COUNTS (insertions + deletions, base a5666a49 to HEAD)
| File | Count | Ceiling |
|---|---|---|
| engine/tests/identity.rs | 6 | 4 (class 8) |
| engine/src/identity.rs | 3 | 2 + 4 (OPEN-2) |
| admission_instruments.rs | 7 | 8 |
| manual_walkthrough_fixtures.rs | 10 | 20 |
| skp_filter_cancellation.rs | 2 | 4 |
| first_batch_factorial.rs | 4 | 4 + 6 |
| style_shell_agreement.rs | 5 | 8 |
| App.test.ts | 17 | 34 |
| AdmissionPanel.test.ts | 4 | 8 |
| CrsAssertionForm.test.ts | 6 | 6 |
| WorkingCanvas.test.ts | 6 | 8 |
| residencyStatus.test.ts | 4 | 6 |
| pickResolution.test.ts | 6 | 6 |
| regression.mjs | 12 | 18 |
| kernel/src/lib.rs | 3 | 4 |
| kernel/README.md | 3 | 4 |
| admission_format_semantics.rs | 13 | 16 |
| session_identity.rs | 11 | 12 |
Total 122 lines in 18 files, against at most 186 lines and 20 files with Amendment 1.

SELF-CHECK
- Cross-module seams: the OPEN-2 callers are cited at their real fns, and the CRS-form comment cites real files. No product code or interface was added.
- Completion claims: each is backed by the evidence above.
- User-facing messages: none changed.
- Required tests reach their assertions: the renamed test ran by exact name and passed, and vitest ran with real assertions.

OFF-SCOPE NOTICED, NOT DONE
- The routing items stay as Amendment 1 item 6 has them.
- The residencyStatus.test.ts draft wording at lines 73, 75, 176 and 178 stays, as Amendment 2 item 4 lists.
- The WorkingCanvas.test.ts:702-706 cannot-mount comment and residencyArm.test.ts:77-81 and :89-90 stay, as Amendment 2 item 4 lists.

Local-only state: I ran `npm ci` in frontends/shell and renderer/bundle-viewer, which created node_modules there. Git ignores it, so porcelain stays empty. I started no background processes and left none running.
