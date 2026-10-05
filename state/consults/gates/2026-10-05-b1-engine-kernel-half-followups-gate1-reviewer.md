# PR #178 gate 1 — reviewer
Reviewed: cut/b1-engine-kernel-half-followups @ 7b05dfd6685c031102b298a17ed85a658949f3b7

**Verdict: PASS.** No S1, no S2. Five N.

Governing form: `engine/B1-FOLLOWUPS-PREREGISTRATION.md` (on main since c3e26821, an ancestor of the branch base f75dff0e; §10 has no amendments). Diff range: `origin/main...HEAD`, three-dot, base f75dff0e17e2d58ea0fe0fde1e607742bd2ccea4. Five commits: 784a15c7, d7688aec, 35f762d8, 9c8e7930, 7b05dfd6. Every line cite below is `@ 7b05dfd6` (branch head) unless it says `@ b438c587` or `@ c9ec02e`.

## Findings

**S1:** none.

**S2:** none.

**N1 — T1's doc names the wrong source for "decoded IPC cannot show retention".** `engine/src/stream.rs:3109 @ 7b05dfd6` attributes it to "this file's own module doc". `engine/src/stream.rs`'s module doc (`engine/src/stream.rs:4-18 @ 7b05dfd6`) says nothing about it; the statement is in `engine/tests/live_projection.rs`'s module doc (`engine/tests/live_projection.rs:11-12 @ 7b05dfd6`), and the form's own cite for it is the live text test's doc (`engine/src/stream.rs:2994-2997 @ b438c587`). The wrong pointer is pre-existing in the live text test's doc (`engine/src/stream.rs:3011-3012 @ 7b05dfd6`) and was copied into T1's new text. Suggested fix: name `engine/tests/live_projection.rs`'s module doc, or the live text test's doc. Comment-only, inside §7's files.

**N2 — T1's "exactly once" is a count.** `engine/src/stream.rs:3166 @ 7b05dfd6` asserts `rows_seen == 4_000`, and its message says every row is seen exactly once; a count cannot tell a duplicated row from a lost one. The form's §2 says "Every row is seen exactly once"; T1 follows the live text test's identical check (`engine/src/stream.rs:3085 @ 7b05dfd6`), which the form names as T1's route, and the property T1 exists for (per-column retention through `flush`) is asserted separately and killed by M-E2. Not blocking; an id set would make the message true.

**N3 — the rewritten K-3 comment keeps a stale count.** `kernel/tests/skp_projection.rs:373 @ 7b05dfd6` (inside the comment 35f762d8 rewrote) still says the closing assertion is `codes.len() == 7`; the assertion is 8 (`kernel/tests/skp_projection.rs:572-573 @ 7b05dfd6`). Worker report 1 deviation 10 left it as "mutation text". It is observation text, not mutation text, and correcting it was inside Scope (a comment line in a §7 file). The same stale 7 sits in the doc at `kernel/tests/skp_projection.rs:358 @ 7b05dfd6`, outside the diff.

**N4 — an unreflowed short line.** `engine/src/stream.rs:593 @ 7b05dfd6` (`StreamPlan::compact_attribute_retention`'s doc) ends a rewrapped paragraph with a two-word line before the intra-doc link line. Cosmetic.

**N5 — K-2 records one reading's message.** The comment (`kernel/tests/skp_projection.rs:156-161 @ 7b05dfd6`) records the both-bounds-shifted reading and its message. The literal reading's own failure (same test, a different message, below) is recorded only in worker report 1. Optional: one clause naming it.

## §8, item by item

1. Non-comment change to a product line: none. Every changed non-comment line in `engine/src/stream.rs` and `kernel/tests/skp_projection.rs` is inside T1 (`engine/src/stream.rs:3119-3181 @ 7b05dfd6`, inside `mod tests`). Checked by listing every `+`/`-` line of the three-dot diff that is not a `//` line or blank: only T1's body.
2. New `pub`/`pub(crate)` item, accessor, option, callback or code path: none (0 added lines starting `pub`; T1 is a `#[test]` fn).
3. Existing test's assertion, message, fixture or name changed: none. One `#[test]` attribute added, none removed; the only `fn` line in the diff is T1's. Workspace suite: engine lib 176 at head against 175 at b438c587 (my export runs: 174 filtered + 1); `skp_projection` 13 at both.
4. Paths: the diff names exactly `engine/README.md`, `engine/src/stream.rs`, `kernel/tests/skp_projection.rs`, `protocol/skp/SKP-V0.md`. `git diff origin/main...HEAD -- protocol/data-plane/ protocol/skp/src/ protocol/skp/tests/` is 0 bytes.
5. SKP-V0: one dated note of 8 lines inserted after the last line of §8's previous dated note and before `## 9.`; no other hunk in the file; no literal, key, code or command changed. Its content matches §2 D6 (the four list sites, the two-sided fixtures, conformance fixtures outside the lists, `c9ec02e` and B1 Amendment 9). `c9ec02e`'s stat touches only `protocol/skp/tests/conformance/` files, which agrees with the note.
6. "zero-copy": 0 occurrences in added lines.
7. Performance number, timing assertion, docs/08 row: none (no `Instant`, `elapsed`, `Duration`, ms, p50 or p95 in added lines).
8. Rewritten recorded-mutation comments: S-1, S-2 and K-1 to K-8 each name `b438c58728d044e67466c438b35091f813e57be2`; T1's names `784a15c79bc818488b89fdc21008993ccadd6297` (an ancestor of the head); E-15's names `c9ec02e`. No line number remains in any of them. No record in the piece calls a `verify-mutation` run an observation (the word `verify-mutation` appears in none of the diff, the PR body, worker report 1 or the index-update consult).
9. T1's seam: T1 calls `Dataset::resolve_projection` then `Dataset::stream_for_publish(&ViewportQuery::all(), &projection, CancelToken::new())`, the same two calls the kernel makes at `kernel/src/publish/mod.rs:493 @ 7b05dfd6` and `kernel/src/publish/mod.rs:716 @ 7b05dfd6`. It builds no `StreamPlan` and does not call `stream_inner`; it reads queued `Item`s from `BatchStream`'s private `rx`, never decoded IPC. The kernel's `ds.stream_for_publish` resolves to `engine/src/stream.rs:932 @ 7b05dfd6`, which builds `StreamPlan::for_publish` itself.
10. Docs: the two overgeneralized sites (`engine/src/stream.rs:91-103 @ 7b05dfd6`, `engine/src/stream.rs:2367-2374 @ 7b05dfd6`) now name only the observed cases (nullable Utf8; Boolean 8/3, 0/10, 40/20 differing; 3/5 equal), say no rule over offsets or lengths is claimed, and do not state the padding-bit mechanism. The three nullable-only sites attribute the difference to a sliced bitmap's padding bits and name both shapes, as §2 binds. Publish's bytes are called equal to main's by construction only.
11. ADR, B1's form, the cancel-state form, the close-races form: `git diff --quiet` over `docs/adr`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/tests/wire_bytes_invariant.rs` and `Cargo.lock`: rc 0 (no change).
12. Comments §4 declares unchanged: all four §7 files are byte-identical at b438c587 and the base f75dff0e, so b438c587's line numbers are base line numbers. No old-side hunk of the diff intersects `engine/src/stream.rs` 2628-2634, 2861-2864, 2936-2939 or 67-79 (`MAX_QUEUED_BATCHES`'s doc), or `kernel/tests/skp_projection.rs` 1115-1119 or 1456-1461.
13. Record hash at a branch commit; test-text span without its commit id: none found. Worker report 1 and the index-update consult carry no span hash at a branch commit; every test-text span in this report names its commit.
14. New `cfg`, platform ignore or path literal: the one added `cfg` is `#[cfg(feature = "fixture")]` on T1, which §2 places there; no platform `cfg`, no ignore. T1 uses `std::env::temp_dir()` and no path literal.

## Mutations, observed by name

All at the head were made in the worktree `C:/dev/wt/b1f`; all at b438c587 on my own `git archive b438c587` export at `C:/dev/wt/b1f-g1-b438c587`, `CARGO_TARGET_DIR=D:/wt-targets/b1f-g1-b438c587`, engine runs with `--features spatial-engine/fixture`, `TMP`/`TEMP` set inside that target so the export's temp fixtures could not collide with the concurrent head runs. Each mutation: applied, the named test run alone, the failure read, the file restored; every restored export file compared with `cmp` against `git show b438c587:<path>` (identical each time); the worktree restored with `git checkout --`. No `verify-mutation` run was made.

| Row | Commit | Mutation as made | Test run alone | Result (rc) | Failure message observed |
|---|---|---|---|---|---|
| T1 baseline | 7b05dfd6 | none | `stream::tests::a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush` | passed (0) | — |
| M-E2 | 7b05dfd6 | `engine/src/stream.rs:2446 @ 7b05dfd6`, `compact_attribute_retention` replaced by `true` | same | FAILED (101) | no queued publish batch carries an over-allowance `zone` run: publish's `flush` compacted every one, or the fixture has no such run |
| M-E2′ | 7b05dfd6 | same site, `false` | `stream::tests::a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound` | FAILED (101) | text run retained 2105348 bytes over its 84424-byte allowance |
| S-1 | b438c587 | `decode_dictionary_chunk_column`'s `else` arm (`engine/src/stream.rs:2235 @ b438c587`) returns `Err(EngineError::Arrow("mutated: non-dictionary path refused".into()))` | `stream::tests::a_non_dictionary_chunk_column_passes_through_the_decode_step_unchanged` | FAILED (101) | called `Result::unwrap()` on an `Err` value: Arrow("mutated: non-dictionary path refused") |
| S-2 | b438c587 | `single_run_retention` (`engine/src/stream.rs:2331 @ b438c587`) condition made `compact && false`, so it always returns `Ok(Arc::clone(array))` | the live text test | FAILED (101) | text run retained 2105348 bytes over its 84424-byte allowance |
| K-1 | b438c587 | `build_viewport_query`'s `projection` match (`kernel/src/skp.rs:1794-1803 @ b438c587`) replaced by `let projection = None;` | `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns` | FAILED (101) | assertion `left == right` failed: declared (request) order, id and geometry first; left ["id", "geometry"]; right ["id", "geometry", "area", "zone"] |
| K-2, literal | b438c587 | `engine/src/stream.rs:2003 @ b438c587` start `run_start + 1` (end `row` kept); `engine/src/stream.rs:2052 @ b438c587` end `row + 2` (start `run_start` kept) | same | FAILED (101) | must have seen at least one batch |
| K-2, as recorded | b438c587 | `engine/src/stream.rs:2003 @ b438c587` range `run_start + 1 .. row + 1`; `engine/src/stream.rs:2052 @ b438c587` range `run_start + 1 .. row + 2` | same | FAILED (101) | assertion `left == right` failed: area mismatch at id 0; left 1034.3331505478782; right 8267.067509130165 |
| K-3 | b438c587 | `ColumnIsGeometry` arm code (`kernel/src/skp.rs:1743 @ b438c587`) `"projection_column_is_identity"` | `every_projection_refusal_is_synchronous_typed_and_pre_mint` | FAILED (101) | assertion `left == right` failed: geometry: wrong code; left "skp.projection_column_is_identity"; right "skp.projection_column_is_geometry" |
| K-4 | b438c587 | `ColumnUnknown` field key (`kernel/src/skp.rs:1737 @ b438c587`) `"candidate_columns"` | `every_projection_refusal_matches_its_committed_error_fixture_shape` | FAILED (101) | assertion `left == right` failed: skp.projection_column_unknown: live field key set must match the committed fixture's; left {"candidate_columns", "column"}; right {"column", "known_columns"} |
| K-5 | b438c587 | `admit_attribute_type`'s `other` arm text (`engine/src/attributes.rs:112-113 @ b438c587`) replaced by the comment's placeholder text | `a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte` | FAILED (101) | assertion `left == right` failed (no message of its own); left carries the `[B1 close placeholder]` prefix and the live list; right is today's text |
| K-6 | b438c587 | `describe_dataset`'s `projectable` (`kernel/src/skp.rs:1960-1965 @ b438c587`) from `admit_attribute_type(f.name(), f.data_type()).is_ok()` | `describe_projectable_agrees_with_viewport_query_admission_for_every_column` | FAILED (101) | column `id` marked projectable, but viewport_query refused it: SkpError { code: "skp.projection_column_is_identity", … } |
| K-7 | b438c587 | `let projection = if req.filter.is_some() { None } else { projection };` inserted after `kernel/src/skp.rs:1803 @ b438c587` | `a_projection_composes_with_a_filter` | FAILED (101) | assertion `left == right` failed (no message of its own); left ["id", "geometry"]; right ["id", "geometry", "f32"] |
| K-8 | b438c587 | `admit_bundle_format`'s `D::Float32` arm (`kernel/src/publish/mod.rs:437-446 @ b438c587`) deleted | `publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_with_todays_text` | FAILED (101) | expected AttributeUnpublishable naming Float32 at preflight, got Err(Style(MissingKey { at: "$", key: "style_version" })) |

P1 and P2 hold: T1 passes at the head and fails under M-E2 by its per-column assertion; every S and K row fails its test by name at b438c587. Each message above agrees with the corresponding rewritten comment at 7b05dfd6 (K-6's comment elides after the code, as the observed message continues). No row survived; no invalidator was hit.

One run had no outcome: my first S-1 run was killed by my own 580 s `timeout` during the build (rc 124, contention with the concurrent workspace build); the file was restored and compared, and the rerun above is the observation.

## Worker report 1's deviations

1. Timeout and rerun: no bearing on any result.
2. K-2: sound. Read literally, the parenthetical's two edits change one bound each, which shortens or lengthens the run rather than delaying it; I reproduced that it still fails the same test by name with "must have seen at least one batch" (table above), so the row is killed under either reading and no invalidator applies. The comment's headline ("slice each attribute run one row late") is a shift of both bounds, and that reading reproduces the message the comment has always carried (I reproduced its numbers exactly). The original mutation wording is retained word for word; the added clause records how it was realized, which is disclosure, not a change of the mutation. See N5.
3. K-3: sound. The comment sits above the `ProjectionRefusalCase` alias, not a test, and the old bare line pointed elsewhere (`kernel/tests/skp_projection.rs:275 @ b438c587` is inside `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns`, which spans 160-383). The failing test is `every_projection_refusal_is_synchronous_typed_and_pre_mint` (my K-3 run), so naming it replaces an unresolvable "this test" with the test that fails; it satisfies §2's "failing assertion's message, with no line number".
4. D4 rewording of the moved doc's first lines: sound; content preserved, binding content met.
5. Full 40-hex ids: sound.
6. S-2's numbers: reproduced exactly at b438c587 (and under M-E2′ at the head).
7. K-5, K-7 "no message of its own": reproduced.
8. K-6 elision: the retained span is the observed message's prefix; reproduced.
9. Target-dir copy: no bearing.
10. Stale `codes.len() == 7`: see N3.
11. D3 split between the two kinds of site: sound, as §2 binds and §8 item 10 requires.

## E-15

`git show c9ec02e:engine/src/stream.rs | sed -n 2669p` is E-15's length assertion, inside `a_compacted_and_a_sliced_single_run_serialize_to_identical_ipc_bytes` (whose `fn` line is 2664 at c9ec02e): `assert_eq!(compacted.len(), 20, ...)`. Its message at c9ec02e, the whole chunk was compacted, not just the retained run, matches the message copied into `engine/src/stream.rs:2779-2781 @ 7b05dfd6` byte for byte. The gate-3 row (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md:83`) gives the realization (`Buffer::ptr_offset`), the line and left 5000, all three carried. `c9ec02e` (c9ec02e32cb36a64a446424f6db2f4584cacdefc) is an ancestor of origin/main (rc 0). The existing failure-path text is retained.

## §7

At 7b05dfd6, merge-base f75dff0e: `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- engine/src/stream.rs kernel/tests/skp_projection.rs protocol/skp/SKP-V0.md engine/README.md`, rc 0.

| File | + | − | Total | Ceiling |
|---|---|---|---|---|
| `engine/src/stream.rs` | 146 | 51 | 197 | 230 |
| `kernel/tests/skp_projection.rs` | 41 | 34 | 75 | 100 |
| `protocol/skp/SKP-V0.md` | 8 | 0 | 8 | 12 |
| `engine/README.md` | 3 | 3 | 6 | 10 |
| **Total** | | | **286** | **360** |

No overrun; no class 8. §7's line is unedited.

## Pins

All 58 of the form's `path:line @ b438c587 sha256:<hex>` pins recomputed (58 of 58, not a sample): an inline `node -e` over the form's text, each span read by `git show b438c587:<path>`, lines joined with LF plus a final LF, sha256 compared. 58 recomputed, 0 mismatches, rc 0. The form carries 58 `sha256:` tokens, so none was missed. b438c587 is an ancestor of origin/main (rc 0).

## Owner's index (7b05dfd6)

- The three changed lines (`engine/README.md:499`, `:505`, `:518 @ 7b05dfd6`) are each byte-identical to a replacement line in `state/consults/2026-10-05-b1-engine-kernel-half-followups-index-update.md` (`grep -qxF`, all three present).
- Last verified at 9c8e7930: between 9c8e7930 and 7b05dfd6 only `engine/README.md` changed (`git diff --stat`), so the pointers checked at 9c8e7930 point at the same code at the head.
- T1 pointer: `fn a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush` is at `engine/src/stream.rs:3121 @ 7b05dfd6`, inside `mod tests` (which opens at `engine/src/stream.rs:2560 @ 7b05dfd6`).
- Forms list: 14 `engine/*PREREGISTRATION*.md` files on disk, 14 named, `B1-FOLLOWUPS` placed alphabetically between `ADMISSION` and `B1-PROJECTION`.
- Every `file.rs::[tests::]fn` pin in `engine/README.md:495-527 @ 7b05dfd6` resolves by name (28 of 28), and every `.md` pointer in that block exists.
- No change to `kernel/README.md`, as §2 states.

## Suites

All at 7b05dfd6 in `C:/dev/wt/b1f`, `CARGO_TARGET_DIR=D:/wt-targets/b1f`.

| Command | rc | Result |
|---|---|---|
| `cargo test --workspace --locked --features spatial-engine/fixture` (first attempt) | 124 | killed by my own 3000 s `timeout` while contending with the export's mutation builds; no outcome |
| `cargo test --workspace --locked --features spatial-engine/fixture` (rerun, uncontended) | 0 | 845 passed, 0 failed, 40 ignored; engine lib 176, `skp_projection` 13; `kernel/tests/publish.rs` passes |
| `cargo fmt --check` | 0 | clean |
| `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture` | 0 | warnings exist; none in T1 or in any changed line (`engine/src/stream.rs` sites at 2266, 2270, 2382, 3336 @ 7b05dfd6, none in the diff; none in `kernel/tests/skp_projection.rs`) |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` | 0 | 444 tests, 444 pass, 0 fail |
| `node scripts/plan/verify.mjs` (tool at 7b05dfd6; file last changed 26072022) | 0 | verify:plan PASS |
| `node scripts/plan/queue.mjs --check` (at 7b05dfd6; last changed deb56edd) | 0 | current |
| `node scripts/plan/site.mjs --check` (at 7b05dfd6; last changed f9444a4d) | 0 | current |
| `node scripts/plan/verify-cites.mjs` (at 7b05dfd6; last changed 522e448d) | 0 | PASS, 1343 files |
| `node scripts/plan/verify-quotes.mjs` (at 7b05dfd6; last changed f9444a4d) | 0 | PASS: 119 checked, 88 verified, 30 baselined, 1 advisory, 0 errors (a floor) |
| `node scripts/plan/verify-test-claims.mjs` (at 7b05dfd6; last changed e9735d47) | 0 | PASS, 497 claimed tests across 125 files |
| `gh pr checks 178` | 0 | 16 checks, all pass; `gh pr view 178` head is 7b05dfd6685c031102b298a17ed85a658949f3b7 |

PR body: asks for a merge commit, never a squash, and names T1's comment's branch commit 784a15c79bc818488b89fdc21008993ccadd6297 (§9).

## Other commands

| Command | rc |
|---|---|
| `git -C C:/dev/wt/b1f rev-parse HEAD` / `git status --porcelain` / `git diff --stat origin/main...HEAD` | 0 |
| `git diff origin/main...HEAD -- protocol/data-plane/ protocol/skp/src/ protocol/skp/tests/` (0 bytes) | 0 |
| `git merge-base --is-ancestor b438c587 origin/main`; `c9ec02e origin/main`; `c3e26821 f75dff0e` | 0, 0, 0 |
| `git archive b438c587` into `C:/dev/wt/b1f-g1-b438c587` | 0 |
| cold build at the export, `cargo test --locked --features spatial-engine/fixture -p spatial-engine -p spatial-kernel --test skp_projection --lib --no-run` | 0 |
| every mutation run, table above | 101 each (S-1's first attempt 124) |

## State left

- Worktree `C:/dev/wt/b1f`: `git status --porcelain` empty, HEAD 7b05dfd6685c031102b298a17ed85a658949f3b7, after every mutation and suite.
- Export `C:/dev/wt/b1f-g1-b438c587`: the four files edited for mutations (`engine/src/stream.rs`, `engine/src/attributes.rs`, `kernel/src/skp.rs`, `kernel/src/publish/mod.rs`) restored and compared identical to b438c587.
- Target `D:/wt-targets/b1f-g1-b438c587` holds the build, four `.orig` copies, a `tmp` directory (the export runs' `TMP`) and `build.log`. `build.log` was first written beside the target, at `D:/wt-targets/b1f-g1-b438c587.build.log`, and moved into the target; nothing else was written outside this report, the export and its target.
- This report was written in five sequential shell writes to this one path (one `>` and four `>>`), not one: the single-write heredoc failed to parse twice (rc 2, nothing written either time), and each fragment parsed on its own.
- Nothing removed. Nothing committed or published to the remote.
