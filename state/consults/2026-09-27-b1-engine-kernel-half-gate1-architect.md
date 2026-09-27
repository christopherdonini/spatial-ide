*Custodian's filing note (2026-09-27): gate 1, architect (full gating), for PLAN node `b1-engine-kernel-half` at `a9ccd57` (local, unpushed), transcribed from the hand-back message with the harness's two-space indent removed. Its path-and-line cites are into the branch at `a9ccd57`, not main; they are written as a path and a line number, so that main's verify-cites neither fails on them nor resolves them against main's different files. Everything below the rule is the architect's text.*

---

**Gate 1 (architect), `b1-engine-kernel-half`: BLOCK**

**Head read:** `a9ccd57`. This is the merge of origin/main into `924dd3f`, per `.git/worktrees/b1-projection/logs/HEAD`. I read the working tree at `C:/dev/wt/b1-projection` and assumed it matches HEAD. I have no Bash, so I could not run git status or git diff, and the per-commit claims below are left to the reviewer.

## Verdicts (AUTONOMY.md §22)
- **Correctness: FAIL.** Severity: blocking. Scope: engine (`attributes.rs`, `predicate.rs`), `kernel/src/publish`, `describe`. Disposition: fix C1–C4, then re-gate the affected paths. C5 is non-blocking but should be fixed in the same round.
- **Evidence: FAIL.** Severity: blocking. Scope: §4 tests E-6, K-1, K-2 and the missing O1 order test, plus the §8 item 4 per-commit check. Disposition: add or repair the tests; the reviewer settles E2 from git.
- **Documentation: FAIL.** Severity: non-blocking on its own; one bounded correction round on the summary-class files. Scope: SKP-V0 §8 and §9, Amendments 2–4, code doc comments. Disposition: correct after the C-fixes land, because D1 moves with C3 and C4.

## Correctness
- **C1. Filter refusal text changed, against the ruling.** The final arm of `engine/src/attributes.rs::admit_attribute_type` now formats "[B1 close placeholder] … for an attribute (… float32, float64, or a dictionary …)". `predicate.rs::filterable_column_type` renders `e.to_string()` of that error as the `reason` of `skp.filter_column_not_filterable`. So every still-refused type (for example Date32) now reaches the filter panel with changed, placeholder-marked text. This breaks:
  - F7 and §2.3 ("stays byte-identical");
  - §5's declared-unchanged list;
  - §8 item 15;
  - O2 as bound by Amendment 1 (round 22, item 2): "Publish and filter keep today's texts byte for byte";
  - §8 item 17, because it is a new visible string in the shell.

  No test pins the filter text, which is why the suites stayed green. Fix: restore today's final-arm text byte for byte, or have the filter owner render today's text (O2's "each owner renders its own text").
- **C2. Some dictionary columns get the wrong publish text.** Admission refuses a `Dict(_, v)` whose value type is not admitted (e.g. `Dict(Int8, Date32)`) as `TypeNotAdmitted` before `admit_bundle_format` runs. `From<ProjectionError> for EngineError` then renders the final-arm "published attribute" text, not today's dictionary text. This breaks:
  - §2.2 ("any Dictionary, whatever its value type … byte for byte");
  - O1(c) as ruled;
  - ADR-023 §2's clarifying sentence of 2026-09-24;
  - §8 item 22.

  H2 means `read_parquet` cannot produce such a column today, but the code path exists and contradicts the ruling. SKP-V0 §9.5 claims the correct behaviour, so it is false too.
- **C3. Admission interleaves per name instead of resolving all names first.** `attributes.rs::admit_projection` resolves one name and applies its per-column rules before moving to the next name. §2.2 steps 3–4, SKP-V0 §9.4, and E-6's name and declared mutation ("interleave") all declare names first, then per-column rules. Today's publish on main also resolves all names first (`resolve_projection`, then `admit_projection`). So publish's multi-failure precedence changes: `[geometry, nope]` gave unknown on main and gives geometry on the branch. That is beyond O1's ruling ("count-first order, as the draft declared them"), so §8 item 15 applies.
- **C4. `projectable` can disagree with admission on a reachable input.** The reserved-`id` check sits in `admit_projection`, not in `admit_projection_column`. With a declared mapping (reachable via `open_dataset.identity` → `host_minted_identity_declaration`) over a file that also carries its own `id` column:
  - `describe` reports `projectable: true` for `id`;
  - `viewport_query` refuses it as `projection_column_is_identity`.

  This contradicts §2.3 (that function "holds geometry, identity and type"), the ruling in round 17 item 4 (stop item 4), and K-5's stated property. Fix: move the reserved-name check into `admit_projection_column`, keeping it ahead of the unknown check in `admit_projection`.
- **C5 (low). F1's refusal is not placed where O4 ruled.** O4 says namespace admission refuses a type with no surrogate, so the namespace never carries one. The code puts the refusal in `bind_admit`. Because `bind_admit` builds the surrogate from the whole namespace, it would refuse any predicate over a column the predicate never names. This cannot happen today.

## Evidence
- **E1. O1's multi-failure order test is missing.** O1, bound by Amendment 1, ordered "A new test pins the multi-failure order." No such test exists in the tree.
- **E2. §8 item 4 is unresolved at commit level.** The branch log shows the wire shape landing in `2963021` and the literal plus shell mirror in `6cd1764`. The four TS `FieldInfo` literals were fixed in `26c9c87`, and the shell's viewport_query key set in `renderTruth.test.ts` in `924dd3f`. So the TS side was red at the bump commit.
  - The reviewer should resolve this with `git show --stat 2963021 6cd1764`.
  - If the fixtures and the literal are split across commits, land it squashed so the literal and both fixture sides are one commit on main.
  - A squash leaves the branch commits that Amendments 3–4 cite (`eacdd0d`, `b7225db`, `26c9c87`, `e49f133`, `ac08761`) unreachable from main (round 15(e)). The custodian picks the merge strategy and fixes the other side.
- **E3. E-6 cannot fail by its declared mutation.** The mutation "interleave" is what the code already does. The test (`["nope","geometry"]`) gives the same outcome under either order, so it cannot fail by name (§4 header). Use `["geometry","nope"]`.
- **E4. The seam fixture's order matches file order.** §2.1 requires `v0-viewport_query-request-with-columns.json`'s declared order to differ from the file's. It is `["zone","area"]`, which is `AttributeMode::MultiType`'s file order. K-1, the seam test, therefore cannot tell declared order from file order across the wire (§8 item 20's intent). E-8 covers the engine side only.
- **E5. K-2 does not assert exact key sets.** §4 says "exact field keys", but the test checks only a subset of fields: no `known_columns`, `id_column` or `detail`. A mutation dropping any of those survives.
- **E6. Mutation records cover only part of §4.** Amendment 4 records mutations for part of §4. E-1–E-7, E-11, E-12, E-14, E-15, E-17, E-19, P-1–P-3, K-3, S-1 and S-2 carry none. The reviewer's parallel mutation run covers these.

## Documentation
- **D1. SKP-V0 misstates the code.** §9.4 (order) and §9.5 (publish dictionary text) are false against the code until C2 and C3 are fixed. The §8 `skp/0.6` "Mechanics" sentence ("updated in the same commit as the literal bump") depends on E2.
- **D2. Amendment 4 is stale.** It records `renderTruth.test.ts` failing and calls it "out of this piece's named scope". `924dd3f` fixed it, and the file is in §2.4's scope. The closing amendment needs a references-only row for `924dd3f` and the green `vitest` run (record cap).
- **D3. Amendment records have formatting defects.**
  - Amendment 4's heading is split across two lines, so "typecheck fix" renders as body text.
  - Amendment 3 splits several test names across lines, so they no longer match the test names as written (round 15(d)'s one-line rule, applied to these names).
  - Amendment 2 cites "around lines 481 and 507" of arrow-data 58.4.0 without a pin. Drop the lines; the symbols carry the reference.
- **D4. The `projection_empty_list` message contradicts ADR-023 §1.** The message (kernel `viewport_query_build_error_of`, frozen in `v0-error-projection_empty_list.json`) tells clients to "omit `columns`". ADR-023 §1 says `columns` is always present on the wire and never omitted; absence is tolerated but not promised. Reword before the human sights the text at B1's close.
- **D5. Minor.**
  - `SKP_VERSION`'s doc in `protocol/skp/src/v0/mod.rs` has no `skp/0.6` paragraph (every earlier bump has one).
  - The K-1 doc comment says "independent DuckDB read", but the body uses `area_for`, and `zone` values are never checked.
  - `engine/README.md`'s ceilings row lacks `MAX_ATTRIBUTE_RETENTION_FACTOR`.

## Checked and clean
- §8 items 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 21 and 23. Item 21 (no ADR edited) rests on identical line counts against main for ADR-017, -021 and -023; the reviewer's diff confirms it.
- Item 19: no engine message found stating another module's consequence.
- ADR-023 conditions:
  - (1): the corrected sentence is in `document.ts`;
  - (2): deferred to B1's close, as declared;
  - (3): `MAX_ATTRIBUTE_RETENTION_FACTOR = 2`; the slice is kept, or compacted by one named copy after the cut; the dictionary decode is a named copy; this fits ADR-004's copy-minimized posture;
  - (4): the 16-cell matrix and the projected twin; `BBOX_COND` and the suffixes are identical to main.
- ADR-023 Decision §§1, 3, 4, 5, 8, 9, 10 and 11 hold for this half. The §2 allowlist holds; its clarifying sentence fails only per C2.
- ADR-021's Note of 2026-09-24: `Float32` maps to `REAL`; dictionary columns are excluded by name, with a reason naming the encoding; no new filter code.
- Publish restriction: at preflight, before any write, by source type. The `Float32` and `Dictionary(_, Utf8)` texts match main byte for byte.
- Caller rule: round 8's exemption applies. PLAN's `b1-shell-half` names the consumer and gate; the PR body must too. There is no option on `StreamParams` (`kernel/src/params.rs`) and no instrument accessor. The raw path passes `None`.
- Literal: `skp/0.6` follows main's `skp/0.5`. The SKP-V0 §8 entry lists only B1's fields. There is no `error_of` arm, and the watcher's fields are untouched (§2.8). Data plane and MCP are untouched.
- No perf claim and no "zero-copy". ADR-006: `describe` and the projection are class 1.
- Verbatim quotes: Amendments 2–4 present no passage as verbatim. Amendment 1's quote is on main and matches the round 22 item 2 RULED line. Discharge claims in Amendments 3–4 resolve to existing tests, with the exceptions under E3 and E5.

## Should have waited for the human
C1 and C3: changed filter text and a changed publish multi-failure order, both observable changes the rulings (O1, O2; round 17 item 3) did not license.

No ADR is needed. Every defect has an existing ruling to conform to.

Files:
- `C:/dev/wt/b1-projection/engine/src/attributes.rs`
- `C:/dev/wt/b1-projection/engine/src/predicate.rs`
- `C:/dev/wt/b1-projection/kernel/src/skp.rs`
- `C:/dev/wt/b1-projection/kernel/src/publish/mod.rs`
- `C:/dev/wt/b1-projection/kernel/tests/skp_projection.rs`
- `C:/dev/wt/b1-projection/protocol/skp/SKP-V0.md`
- `C:/dev/wt/b1-projection/protocol/skp/tests/data/v0-viewport_query-request-with-columns.json`
- `C:/dev/wt/b1-projection/protocol/skp/tests/data/v0-error-projection_empty_list.json`
- `C:/dev/wt/b1-projection/protocol/skp/src/v0/mod.rs`
- `C:/dev/wt/b1-projection/engine/B1-PROJECTION-PREREGISTRATION.md`
- `C:/dev/wt/b1-projection/state/consults/2026-09-25-b1-prereg-revision.md`
