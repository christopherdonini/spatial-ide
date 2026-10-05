# b1-engine-kernel-half-followups: worker report 1

Model observed: Sonnet 5.5 (the harness note). No override. No context handoff received or produced. No repeated evidence run was made, so the repeat-runner rule did not apply.

Result: all steps done, every row observed and killed, no invalidator hit. Branch `cut/b1-engine-kernel-half-followups`, head `9c8e79304d0d91914e62e577989baf43acb5591c`, tree clean, nothing pushed.

## Commits (base f75dff0e17e2d58ea0fe0fde1e607742bd2ccea4)

| Commit | Contents |
|---|---|
| `784a15c79bc818488b89fdc21008993ccadd6297` | T1 `a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush` in `engine/src/stream.rs` `mod tests`, under `fixture` (+80 lines, no other change) |
| `d7688aec8e486f021fa6ec87d34ed7ee0c1325fd` | T1's recorded-mutation comment (names 784a15c7 in full); D3 at the three nullable-only sites and the two overgeneralized sites; D4; the relative clause; the const doc; E-15's Mutation paragraph. Comment lines only (checked: zero non-comment diff lines outside T1) |
| `35f762d81c03f7e9906d4ee554be1d548aa8c39d` | S-1, S-2 and K-1 to K-8 comments rewritten with b438c58728d044e67466c438b35091f813e57be2 and the observed message; bare self-lines dropped |
| `9c8e79304d0d91914e62e577989baf43acb5591c` | one dated note at the end of `protocol/skp/SKP-V0.md` section 8 (D6), nothing else in the file |

`engine/README.md` untouched. `protocol/data-plane/`, `protocol/skp/src/`, `protocol/skp/tests/`: empty diff against origin/main. `kernel/tests/wire_bytes_invariant.rs` and the five declared-unchanged comments untouched.

## T1

- Fixture: `write_geoparquet` in the temp dir, `AttributeMode::MultiType`, `CrsMode::DeclaredLv95`, `features: 4_000`, `avg_vertices: 100` (default seed and the rest). Projection `zone, text`. Both within section 2's bounds.
- Seam: `Dataset::resolve_projection` then `Dataset::stream_for_publish(&ViewportQuery::all(), &projection, CancelToken::new())`. No `StreamPlan`, no `stream_inner`. Queued `Item`s read from `stream.rx` in-module.
- H1 held on the first fixture tried: nothing was adjusted.
- Runs at 784a15c7: `cargo test -p spatial-engine --lib --locked --features spatial-engine/fixture a_publish_stream_keeps`, three times (once at the first compile, once after rustfmt, once more at the workspace run). Each: `1 passed`, finished in 4.76s, 2.66s, and within the workspace run. Exit 0.
- Fixture file sha256, measured after the run: `e8841b575a5161673b2b01cf7ddcd9c9cda7bbec0eb20d8472de97de214a2d7d`. The test itself hashes before and after and asserts equality; it passed. I did not hash it from outside before the run.

## Mutations observed

Method: apply, run the test alone, record, revert (reverted file compared with `git show` and `cmp` for the export; `git checkout` on the branch).

**M-E2, at 784a15c79bc818488b89fdc21008993ccadd6297.** `flush`'s single-run arm: `compact_attribute_retention` replaced by `true`. T1 fails:
`stream::tests::a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush`, message: "no queued publish batch carries an over-allowance `zone` run: publish's `flush` compacted every one, or the fixture has no such run". Reverted.

**M-E2′, at 784a15c7 (record only, no comment).** Same arm, `false`. `stream::tests::a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound` fails: "text run retained 2105348 bytes over its 84424-byte allowance". Reverted.

**Rows at b438c58728d044e67466c438b35091f813e57be2** (a `git archive` export, own target dir; every edited file restored and compared byte for byte afterwards):

| Row | Test | Failure message observed |
|---|---|---|
| S-1 | `a_non_dictionary_chunk_column_passes_through_the_decode_step_unchanged` | called `Result::unwrap()` on an `Err` value: Arrow("mutated: non-dictionary path refused") |
| S-2 | `a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound` | text run retained 2105348 bytes over its 84424-byte allowance |
| K-1 | `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns` | assertion `left == right` failed: declared (request) order, id and geometry first; left: ["id", "geometry"]; right: ["id", "geometry", "area", "zone"] |
| K-2 (X11) | same test | assertion `left == right` failed: area mismatch at id 0; left: 1034.3331505478782; right: 8267.067509130165 (see deviation 2) |
| K-3 | `every_projection_refusal_is_synchronous_typed_and_pre_mint` | assertion `left == right` failed: geometry: wrong code; left: "skp.projection_column_is_identity"; right: "skp.projection_column_is_geometry" |
| K-4 | `every_projection_refusal_matches_its_committed_error_fixture_shape` | assertion `left == right` failed: skp.projection_column_unknown: live field key set must match the committed fixture's; left: {"candidate_columns", "column"}; right: {"column", "known_columns"} |
| K-5 | `a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte` | assertion `left == right` failed (no message of its own); left carries "[B1 close placeholder] type is Date32 ..." |
| K-6 | `describe_projectable_agrees_with_viewport_query_admission_for_every_column` | column `id` marked projectable, but viewport_query refused it: SkpError { code: "skp.projection_column_is_identity", ... } |
| K-7 | `a_projection_composes_with_a_filter` | assertion `left == right` failed; left: ["id", "geometry"]; right: ["id", "geometry", "f32"] |
| K-8 | `publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_with_todays_text` | expected AttributeUnpublishable naming Float32 at preflight, got Err(Style(MissingKey { at: "$", key: "style_version" })) |

No row survived. P2 holds.

## E-15 and c9ec02e

- c9ec02e is an ancestor of origin/main and of the branch head.
- `git show c9ec02e:engine/src/stream.rs | sed -n 2669p` is E-15's length assertion, in `a_compacted_and_a_sliced_single_run_serialize_to_identical_ipc_bytes`:
  `        assert_eq!(compacted.len(), 20, "the whole chunk was compacted, not just the retained run");`
- Message copied: "the whole chunk was compacted, not just the retained run". The reviewer's row 9.6(a) (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md:83`) reads: "fails E-15 `stream.rs:2669` (left 5000)". The paragraph states left 5000 and no right value.
- c9ec02e3 is "test(protocol): B1 Amendment 9.2 -- conformance fixtures to the skp/0.6 literal and columns", which agrees with D6's "updated for skp/0.6 in c9ec02e (B1 §10, Amendment 9)".

## Suites (worktree, final head 9c8e7930; each from a Bash call)

| Suite | Exit |
|---|---|
| `cargo test --workspace --locked --features spatial-engine/fixture` (845 passed, 0 failed, 40 ignored across all result lines; engine lib 176 passed, which is main's 175 plus T1) | 0 |
| `cargo fmt --check` | 0 |
| `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture` | 0 (warnings exist; none in T1's lines; stream.rs warnings are at three other places) |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` (444 pass) | 0 |
| `node scripts/plan/verify.mjs` | 0 (PASS) |
| `node scripts/plan/queue.mjs --check` | 0 |
| `node scripts/plan/site.mjs --check` | 0 |
| `node scripts/plan/verify-cites.mjs` | 0 (PASS) |
| `node scripts/plan/verify-quotes.mjs` | 0 (PASS) |
| `node scripts/plan/verify-quotes.mjs --show-cites` over the three changed files | 0 (0 checked) |
| `node scripts/plan/verify-test-claims.mjs` | 0 (PASS) |
| `node scripts/plan/cfg-boundary.mjs` (extra) | 0 |

The `node --test` figure is "ℹ tests 444, pass 444, fail 0". CI was not run (no push).

## Section 7 (counting command at head 9c8e79304d0d91914e62e577989baf43acb5591c, merge-base f75dff0e17e2d58ea0fe0fde1e607742bd2ccea4)

`git diff --numstat $(git merge-base origin/main HEAD) HEAD -- engine/src/stream.rs kernel/tests/skp_projection.rs protocol/skp/SKP-V0.md engine/README.md`

| File | Added | Deleted | Total | Ceiling |
|---|---|---|---|---|
| `engine/src/stream.rs` | 146 | 51 | 197 | 230 |
| `kernel/tests/skp_projection.rs` | 41 | 34 | 75 | 100 |
| `protocol/skp/SKP-V0.md` | 8 | 0 | 8 | 12 |
| `engine/README.md` | 0 | 0 | 0 | 10 (not mine) |
| Total over my three files | | | 280 | 360 (with README's 10) |

No overrun.

## Deviations and findings (one line each)

1. The first T1 cargo run hit my 580 s timeout on a cold build; I reran it in the background with a longer timeout. No effect on the result.
2. K-2 (X11): the mutation text, applied literally at two sites (`run_start + 1` at the cut only, `row + 2` at the final push only), fails by name but with a different message, "must have seen at least one batch". The comment's own message ("area mismatch at id ...") reproduces only when both slice bounds shift by one row (cut `run_start + 1..row + 1`, final push `run_start + 1..row + 2`). I recorded that reading and said so in the comment; the mutation text itself is unchanged.
3. K-3's comment sits above a type alias, not a test, and the form's row names "K-4's test"; the failing test is `every_projection_refusal_is_synchronous_typed_and_pre_mint`, and I named it in the comment.
4. D4: the retain doc moved onto `retain_or_compact_single_run`, and I reworded the first three lines of that moved doc so the default diff shows the doc moving and not the function `single_run_retention` moving. `single_run_retention`'s code is unchanged; zero non-comment diff lines outside T1.
5. I used full 40-hex commit ids in the T1, S-x and K-x comments (the form's b438c587 resolves to `b438c58728d044e67466c438b35091f813e57be2`).
6. S-2's comment now carries the observed numbers in place of the old "N bytes over its M-byte allowance".
7. K-5, K-7: the failing assertion carries no message of its own, so the comment records "assertion `left == right` failed (no message of its own)" plus the left and right.
8. K-6: the comment carries the observed message's start and code, with the rest elided as the old comment did.
9. The export's target dir was made by copying the branch's target dir; it saved no build time (about 14 minutes for the cold kernel build).
10. The K-3 comment's old closing clause ("`codes.len() == 7`") is stale against today's 8 and is left, as the mutation text is unchanged.
11. D3: the two overgeneralized sites now say no rule over offsets or lengths is claimed and name only the observed cases; neither states the padding-bit mechanism as fact. The three nullable-only sites attribute the byte difference to a sliced bitmap's padding bits, as section 2 binds.

Anything off-scope I noticed and did not do: none. The `engine/README.md` owner's-index update is lead-data's.

Left behind for the custodian to remove: the worktree b1f and its target dir b1f, and the export b1f-b438c587 with its target dir b1f-b438c587 (the directories named in the brief). The export has its edited files restored to the b438c587 bytes.
