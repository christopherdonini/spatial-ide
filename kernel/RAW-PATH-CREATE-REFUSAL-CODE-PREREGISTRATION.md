# A create-time engine refusal on the raw-params admission path keeps its typed code (wave-1 A4-4) — preregistration

**Authority:** PLAN node `publish-refusal-codes-and-attempt-lifecycle`, placed position 3 by question round 31, item 1; its scope is the kernel half under round 31, item 2 (both RULED 2026-09-30). Origin: wave-1 A4-4, S2 (`state/cloud/wave1/A4.md:84-96` @ a446efd sha256:e8dab6f2e04b9f03aaf739bd0e55b48c0d8032ab17b7b735578c19a19c75aadc; custodian field `state/cloud/wave1/A4.md:125` @ a446efd sha256:6bec1ae054f78c3cb367307df5fc664d314d098b9cd7cc89ce42000d91916b2d).
**Drafted by** the architect agent on the custodian's brief, read at `main` a446efd (the consult: `state/consults/2026-09-30-publish-refusal-codes-architect-draft.md`). **Committed before any code**, on main, as nodes 1 and 2's forms were. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Scope narrowed at filing, before code:** A4-1 and A4-3 are lost at src-tauri lines (`frontends/shell/src-tauri/src/publish.rs:734` @ a446efd sha256:e65253fe4166202a1df3cca916cc03da29ac9c7bd08f87a09d2974838b525e14, `frontends/shell/src-tauri/src/publish.rs:1073` @ a446efd sha256:4fd968ac5caa65c7dc66a65bb2978887f17726b8f6e96030730b06ec326aa85f), and A4-2's `publish.engine` is a declared code (`protocol/skp/SKP-V0.md:1051-1056` @ a446efd sha256:2dd6474feaada6e09d27f8a2fd08397f42b6b2d3249d7d842329bc5d06f519d6). All three wait for the human's ruling and are not in this form.
**Custodian's edits to the draft, before commit:** (1) every span hash, computed at a446efd (the architect had no Bash); (2) cites the draft shortened to a bare file name or a bare `:line` are written with their full path, and the custodian field is pinned; (3) the committed-before-code line names main, following nodes 1 and 2; (4) this line and the next. Nothing else changed.
**The node stays open after this form's PR:** A4-1 to A4-3 remain in the node's scope as round 31, item 2 placed them, waiting for the human's ruling on their site and code. The node is not set done on this form's PR alone.
**Gating:** full (AUTONOMY.md §21a: a data-plane terminal's literal content; the stated shape at `protocol/skp/SKP-V0.md:750-752` @ a446efd sha256:6b307f1a19cc9d67674331329d7cd858febd206ef96ce3bce7290c8a8202cc47).

## §0. Disclosure
- Reasoned from code. The A4 reproducer on `cloud/wave1-A4` (a7835b1, unmerged) observed the defect by calling `factory.create` directly. It is evidence, not Authority, and nothing from that branch merges.
- Sites: `kernel/src/lib.rs:378` @ a446efd sha256:358cadb2da806d5b57271141a2bd3eae8857020caf0b9aee802078b173db3501 (create-time, unprefixed) and `kernel/src/lib.rs:579-580` @ a446efd sha256:7059e969f517a5a6cca23535b1aff2e171018be3243ac789bd0127c8a7e0665f (mid-stream, prefixed), `protocol/data-plane/src/server.rs:479-490` @ a446efd sha256:6ed33b90807cb7c640fcf1d3415e1ec7ea8fa8be65a3019d42514fb45d99f7a5.
- Sibling search: the raw-path non-engine strings at `kernel/src/lib.rs:335` @ a446efd sha256:05d9c4f09d97354da004852d8ed4413011e37f6232e2e8ecf05ace1ef8d99950, `kernel/src/lib.rs:354` @ a446efd sha256:aa9872c2e42bf070af543d8fe1e3ed5020e6b8029d68a373dbae0d001032f055 and `kernel/src/lib.rs:358` @ a446efd sha256:af047787d9b517c94641932af502e2b020612de0328789382c99ddb3aabd8b9c have no code, and adding one would mint strings. They are out.
- Fixture drive: nothing is measured.

## §1. May and may not claim
- **May claim:** on the raw-params path, a create-time `EngineError` reaches `TERM_PRODUCER_FAILED` as the string `skp::terminal_detail_of` returns, so its code is the one `error_of` mints for that error.
- **May not claim:**
  - anything about the shell (it installs `ticket_only`) or about any publish refusal (A4-1 to A4-3);
  - a code for a non-`EngineError` raw-path refusal;
  - any `docs/08` figure.
- **Unchanged:** no data-plane format change, no new code, no new or changed Display string, no ADR amended, no new dependency.

## §2. The change
1. `kernel/src/lib.rs` `create_from_raw_params`: `open_engine_stream(..).map_err(|e| e.to_string())` becomes `.map_err(|e| skp::terminal_detail_of(&e))`. The comment above it names the prefix and `terminal_detail_of` as the one minting site.
2. Nothing else. `protocol/**`, `frontends/**`, `kernel/src/publish/**`, `kernel/src/permission/**` and `SKP-V0.md` are untouched.
3. Portability (`state/directives/PORTABILITY-2026-09-30.md` §2 R3): not OS-dependent. There is no `cfg`, the refusal is a CRS mismatch, and no OS error classification is involved. R3 does not apply.

## §3. Fixtures and predicted outcomes
- F1: the `end_to_end.rs` harness fixture (`fixture("crs", 500)`), opened as `parcels`, with a START frame carrying bbox `[7,46,8,47]` in `EPSG:4326`. Predicted after the fix: one `TERM_PRODUCER_FAILED` frame, zero batches, and a detail beginning `engine.viewport_crs_mismatch: `.

## §4. Tests, one mutation each
- **P0** (before any code): T1 run at the base commit fails on its prefix assertion. This is the reproduction.
- **T1** `a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code` (`kernel/tests/end_to_end.rs`, F1, the real data-plane server with `EngineSourceFactory::new`). It asserts:
  - the terminal is `TERM_PRODUCER_FAILED`;
  - the detail starts with `engine.viewport_crs_mismatch: `;
  - the rest contains `EPSG:4326` and does not itself start with `engine.`;
  - `batches == 0`.
  - Mutation: restore `e.to_string()` at the site. The prefix assertion then fails by name.
- Mutations are observed by applying one, running the named test, recording its failure by name with the commit, and reverting it. A `verify-mutation` run is not an observation.
- Timing: the harness's receive deadline only bounds how long a failing test runs. Nothing asserts elapsed time. The test checks properties and ordering only (round 25, item 1 (a)).

## §5. Predictions, declared unchanged, invalidators, falsification
- **Predictions:** P0 fails at the base commit; T1 passes on the fix and fails under its mutation.
- **Declared unchanged (green before and after):**
  - `h7_an_engine_refusal_arrives_as_a_typed_terminal_with_its_own_words`, whose unknown-dataset detail stays unprefixed;
  - `a_viewport_in_the_wrong_crs_is_refused_end_to_end`;
  - `kernel/tests/typed_terminal_codes.rs`;
  - `kernel/tests/skp_admission.rs`;
  - `kernel/tests/post_check_cost_report.rs`;
  - `skp::error_of` and `skp::terminal_detail_of`, byte for byte.
- **Invalidators:**
  - **Stop:** if keeping the code needs a new code, a new or changed string, a src-tauri or TS edit, or a `protocol/**` edit. Amend and route to the human.
  - **Stop:** if a consumer that matches the raw path's create-time detail by prefix or by equality is found. Route it.
  - **Invalid run:** if P0 passes at the base commit, because the refusal then arrives on the already-prefixed path. T1 is re-declared by a class-2 amendment.
- **Falsification:** `open_engine_stream` returns a non-`EngineError` at create time.

## §6. Instruments
Assertions only: the terminal code, the detail prefix, the batch count. No measurement.

## §7. Declared values and ceilings
- No new constant.
- **Size budget:** ≤ 60 changed lines (insertions plus deletions over non-generated code and tests, excluding this file), over ≤ 2 files: `kernel/src/lib.rs` and `kernel/tests/end_to_end.rs`. Counted by `git diff --numstat <base>...HEAD -- kernel/src kernel/tests` at a named commit. An overrun is class 8.

## §8. Block-on-sight
1. Any edit under `frontends/`, `protocol/`, `kernel/src/publish/` or `kernel/src/permission/`.
2. A new code, a new `EngineError` variant, or a new or changed Display string.
3. A prefix composed anywhere other than `skp::terminal_detail_of`.
4. A code added to a non-`EngineError` raw-path refusal.
5. A new `pub` item.
6. A timing assertion.
7. Any file from `cloud/wave1-A4` merged or cherry-picked.
8. T1 missing, or its mutation unobserved.

## §9. Gates
- **Architect:** `protocol/skp/SKP-V0.md:750-758` @ a446efd sha256:b514cd6021d219e6a265d28ab7d5d7658cc8fb1648516a1beec68a50f1ffc5c8; `docs/01` principle 8; the caller rule (no new `pub` item); §8 checked one by one.
- **Reviewer:** the full diff; P0 and T1's mutation observed.
- **Suites:** `cargo test -p spatial-kernel`, `verify:cites`, `verify:plan`, and CI's `node --test` scripts suite.
- **Operator:** none. The shell's path is unchanged; the only visible change is the canvas-probe's note line on a create-time refusal.

## §10. Amendments (opens empty, append-only)

### Amendment 1 — T1's fixture file made its own, after gate 1's reviewer N1 (class 1)

Written after gate 1's results were seen (class 1, a post-result amendment). §3's F1 and §4 are not edited.

1. **The finding.** The gate-1 reviewer's N1 (`state/consults/gates/2026-09-30-raw-path-refusal-code-gate1-reviewer.md`). T1 and `a_viewport_in_the_wrong_crs_is_refused_end_to_end` both call `fixture("crs", 500)`, and `fixture` rewrites its file on every call. Run in parallel, one test can truncate the file while the other reads it. It was not reproduced in 60 paired runs: it is a latent race in the new test, not an observed failure. It invalidates no result.
2. **F1 re-declared.** T1's fixture is `fixture("crs-raw-create", 500)`: F1's generator, specification and feature count, written to a file of its own. T1's name, START frame, four assertions and mutation do not change, and neither does its sibling.
3. **Owed by correction round 1, at its head:** T1 and its sibling pass; T1's mutation is re-observed; §7 is counted again. The P0 observation at 4db0865 stands: it depends on the dataset's CRS, which the specification fixes, not on the file's name.
