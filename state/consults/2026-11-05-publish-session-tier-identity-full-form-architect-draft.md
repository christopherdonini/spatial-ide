*Custodian's filing note (2026-11-06): the architect's full-form draft for `publish-session-tier-identity` (U1), with `export-refused-above-row-ceiling-every-scope` (U10) riding, on the human's ruling of 2026-11-05 (evening), item 2 (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`). Its brief by file (sha256 177347a166f7fc66d97efa25cdc5665db3dc38da142aacc15a0fead4580e485a), carrying the human's Part 1 rulings of 2026-11-05 by reference and the reuse index's output byte for byte; read at main 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1. The run 23:45:45Z to 23:58:41Z by its transcript (claude-opus-5-5; unique calls Read 42, Grep 45, Glob 8 and the hand-back, 96, equal to the notification's). Extracted by script from the hand-back in that transcript (34075 bytes, sha256 bbc75a86b307e76ba918443e58bd6cb46e6291f5b6b46b833c84db6dfeb42ba3); one change: the human's pronoun in OPEN-2's last sentence written as `their`. Its `@ C` cites are kept as written (C is 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1, as its opening paragraph says). The form is committed from it at `governance/forms/kernel/PUBLISH-SESSION-TIER-IDENTITY-PREREGISTRATION.md`. A draft, not Authority.*

---

Draft: publish-session-tier-identity full form, architect

I read at main 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1. This is a draft and not a gate, so it carries no verdict. I have no shell, so I could not check the brief's sha256 (177347a1…0e485a) or confirm HEAD. I read the working checkout, which the session's git status shows as main at 2c72923e with untracked files only. Every cite below is `path:line @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1` (C below means that commit), and a bare `:line` that follows a cite is in the same file. Everything is my own wording, and only the reuse block is byte-copied (it comes from the brief). Self-references are by section only.

---

# kernel: publish refuses a session-tier identity in every scope, the manifest's identity caveat states what each tier's check was, and the reader's MAX_FEATURES ceiling is read against the rows a scope publishes — full preregistration

## Header

- **Authority:**
  - PLAN node `publish-session-tier-identity` (governance/PLAN.yaml:6481-6497 @ C), with `export-refused-above-row-ceiling-every-scope` riding in the same piece (:6515-6531): one form and one PR, and the riding node is set done in this node's done commit (:6530).
  - Graded S1 under the human's ruling of 2026-11-05 (evening), item 2: slot 1 ahead of order, the full form, U10 riding (state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:14 @ C). In my reading, "the full form" means both gates from dispatch.
  - The human's gate-round rulings of 2026-11-05, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ C). Item 1 (:28-32) governs §2.6, item 3 (:38-42) and item 4 (:43-46) govern §9, and item 7 (:58-62) governs §4.
  - The triage readings, re-read here at C: U1 (state/consults/2026-11-05-area-e-kl-triage-undeclared-behaviours-architect.md:9-18 @ C), U10 (:100-106), and item 3 (state/consults/2026-11-05-area-e-kl-triage-numbered-items-architect.md:11-21 @ C).
  - **The reuse index found no prior art on either search; the miss is noted here.** The custodian ran it in the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, carried byte for byte from the brief:

```text
$ node tools/reuse.mjs publish identity uniqueness caveat session   (exit 1)
No prior art recorded for "publish identity uniqueness caveat session". Research it before planning an implementation.
$ node tools/reuse.mjs export row ceiling scope refusal   (exit 1)
No prior art recorded for "export row ceiling scope refusal". Research it before planning an implementation.
```

- **Drafted by** the architect on the custodian's brief, read only at C. Every restatement of a source is my paraphrase. Nothing is marked verbatim except the reuse block.
- **Committed before any code. Append-only once committed.** An amendment written after any outcome has been seen says so in its first line, and names what it touches or invalidates.
- **Branch:** `cut/publish-session-tier-identity`, cut from main at dispatch, on its own checkout under `C:/dev/wt/` with its own new cargo target. It merges by merge commit, never a squash, so the `RECORDED MUTATION:` commits stay reachable from main.
- **Phases (OPEN-3):**
  - **Phase 1** is every Scope file except `frontends/shell/src-tauri/src/publish.rs`.
  - **Phase 2** is that file. It starts only after U12's PR has merged and main has been merged into this branch. If U12 has merged before code starts, the two phases are one.

## §0 Disclosure

1. **Evidence, not Authority: the U1 reproducer at 8b9193a1** (state/consults/2026-11-05-publish-session-tier-identity-u1-reproducer-tester.md @ C).
   - Opened through `Catalog::open_cancellable` with no assertion and no declared identity, a foreign-key-column fixture is on the session tier with `verified_rows` None (:48).
   - It published in both scopes (:49, :51).
   - Both manifests carry `id_source` `session-ordinal:file_row_number`, `id_uniqueness` `by-construction-within-generation`, and the fixed caveat whose first sentence says uniqueness was verified over this file at open (:50, :52).
   - Its route and its deviations from the shell's route are at :14-39. Its test file is untracked in `C:/dev/wt/u1r`. That makes it evidence and never Authority (round 14's untracked-Authority rule); the worker may start from it.
2. **The cloud audit is a draft and not Authority.** No claim here rests on it.
3. **Everything else is reading at C and was never run.** Two hypotheses, each decided by P-0 (§4):
   - **H-D:** a declared mapping onto the native `id` column with `skip_uniqueness_check` true opens as `mapped:id` with `declared-not-verified` and `verified_rows` None (engine/src/dataset.rs:1917-1928 @ C; engine/src/identity.rs:169-171 @ C).
   - **H-BB:** a bbox exists over FX-BIG (§3) holding a known small row count, read from the fixture generator's layout.
4. **Read commit:** the reproducer ran at 8b9193a1, and this form reads C. The custodian confirms that `git diff --name-only 8b9193a1 2c72923e` over the Scope files is empty, or names what moved.
5. **No fixture-drive confound:** nothing is measured, and the 5 GB fixture is not read. FX-BIG is generated at MAX_FEATURES+1 rows (multi-GB with its bundle work), so the worker checks the disk floor before each heavy run.

## §1 What this preregistration may and may not claim

**May claim, once §4 is green on CI** (product-ci-rust.yml:194-197 @ C, :234; product-ci-shell.yml:217 @ C) and the two `#[ignore]`d tests have been run once by hand at the head on Windows:
- A dataset whose identity is the session tier is refused by `preflight_pinless`, before any pin, in both scopes. So `boundary::execute` refuses it before any destination, staging directory or audit record exists, and the shell's `prepare_with_progress` returns it as `Refused`, carrying its code.
- The manifest's `identity.caveat` no longer states that a verification ran when none did. The verified tier's caveat bytes are unchanged.
- Preflight predicts MAX_FEATURES only from a figure true of the rows the scope publishes. A Current-view publish over a verified file above the ceiling is no longer refused at preflight.
- In every scope, a publish whose streamed rows would exceed MAX_FEATURES is refused before the batch that crosses the ceiling is written. Staging is removed and nothing exists at the destination.

**May not claim:**
- any performance figure or docs/08 row;
- macOS or Linux behaviour of the `#[ignore]`d tests;
- `MAX_RESIDENT_BYTES` or `MAX_PARTITIONS` prediction (both unchanged, KNOWN-LIMITATIONS.md:90-94 @ C);
- any stability of the session tier across opens.

**ADR readings, none amended:**
- **ADR-016 Amendment 1, item 1** (docs/adr/ADR-016-stable-feature-identity-admission.md:186-208 @ C). The generation is never published (:192-195), and the tier refuses to cross the open boundary (:201-205). The refusal implements that.
- **ADR-025's Decision** (docs/adr/ADR-025-publish-above-the-readers-ceilings.md:70-74 @ C; the ruling is entry 53 / B3). It refuses at preflight when the preflight can predict that the artifact exceeds a ceiling. A whole-file count is not a prediction of a bbox scope's artifact, so the U10 change brings the code to the Decision's own condition. The write-time refusal covers what preflight cannot predict, where the Decision is silent (OPEN-2).
- **ADR-017:** the caveat is free prose whose wording ADR-017 does not fix (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:85-89 @ C). It is a caveat naming what is not established (:194). No member, key or `bundle_version` changes.
- **ADR-006:** class 3 and its approval are unchanged. A preflight refusal creates nothing. The write-time refusal follows the declared recovery policy `none` (kernel/src/publish/mod.rs:63-67 @ C).

**Principles:**
- 01 principle 8 (docs/01_Principles.md:14 @ C) and principle 3's no-unhonoured-claim clause (:9). A published manifest states a verification that never ran.
- The shell shows the engine's describe statement that a session identity is never published (engine/src/identity.rs:149-153 @ C, carried at kernel/src/skp.rs:2023-2026 @ C). That statement is false at C, and this piece makes it true.

**Wire:** no SKP code, field or literal, and nothing under `protocol/`. A new `publish.*` code rides `refusal_detail`'s existing string, which is not a wire change, and the shell's parser reads any `publish.*` prefix (protocol/skp/SKP-V0.md:786-798 @ C).

**Strings:** one new shown string, the session refusal's Display, as a P6 placeholder (OPEN-4). No other shown string changes (OPEN-6 (i)). The new caveat sentences are reachable only on routes no ordinary use takes (OPEN-7).

**Portability:** not an OS-dependent feature, so no R3 item.

## §2 The change, stated before it is applied

### 2.1 U1: the session tier is refused at preflight (kernel)

- **Place.** A new check in `preflight_pinless_parts` (kernel/src/publish/mod.rs:457-566 @ C), directly after the geometry-encoding check (:497-504) and before `dataset_logical_uri` (:505).
  - It reads only the admitted identity record: `ds.identity().source().is_session_ordinal()` (engine/src/identity.rs:103-105 @ C). No IO.
  - Precedence: the row-filter gate, the degrees check and the encoding check still refuse first.
- **Variant.** A new `PublishError` variant (proposed name `SessionIdentityNotPublishable`; proposed code `publish.session_identity_not_publishable`), named in:
  - `code()` (kernel/src/publish/error.rs:260-292 @ C; no wildcard arm);
  - `Display`, as a `[P6 placeholder] ` string (OPEN-4; the precedent is :414-420);
  - `boundary.rs`'s `error_kind` (kernel/src/permission/boundary.rs:223-248 @ C) and `publish_outcome` as `Refused` (:281-313).
- **Routes covered.**
  - Every route to a bundle runs `preflight_pinless_parts`: `preflight` (kernel/src/publish/mod.rs:584-604 @ C), `publish_unguarded` (:611-618), `boundary::execute` (kernel/src/permission/boundary.rs:324 @ C), the shell's `prepare_with_progress` (frontends/shell/src-tauri/src/publish.rs:424-432 @ C) and the CLI (kernel/src/bin/publish-bundle.rs:527 @ C, through the boundary).
  - Both scopes, since the check never reads the query.

### 2.2 The caveat states what each tier's check was (kernel)

- `identity_caveat` (kernel/src/publish/mod.rs:1444-1448 @ C) becomes a function of `identity.uniqueness()` (engine/src/identity.rs:114-130 @ C).
- **`VerifiedAtOpenFullFile`:** the current bytes, unchanged.
- **`DeclaredNotVerified`:** a sentence that claims no verification. The tier is reachable only through the engine API: the wire has no skip field (kernel/src/skp.rs:1726-1735 @ C), and no product code sets it (a grep of `*.rs` at C finds it set only in tests).
- **`ByConstructionWithinGeneration`:** a sentence true of that tier. After §2.1 no route reaches it, but the function stays total and never panics.
- This is the sibling of U1's false caveat, fixed here under Part 1, item 4's sibling rule (:46).

### 2.3 U10: the preflight prediction is the scope's (kernel)

- A `pub(crate)` pure helper in `kernel/src/publish/ceilings.rs` (proposed name `predicted_features(verified_rows, &ViewportQuery) -> Option<u64>`):
  - `Some(min(verified_rows, limit))` when the query has no bbox;
  - `None` when it has a bbox or `verified_rows` is None.
  - The filter is already refused before this point (kernel/src/publish/mod.rs:465-467 @ C).
- Its one caller is the existing `check_reader_ceilings` call, which today passes `verified_rows()` for every scope (:553-557). `check_reader_ceilings` itself is unchanged (kernel/src/publish/ceilings.rs:133-157 @ C).
- `limit` is included because the CLI carries `--limit` (kernel/src/bin/publish-bundle.rs:17 @ C, :306-310). This is the same defect class reached through another field.

### 2.4 U10: the write-time MAX_FEATURES guard (kernel)

- A `pub(crate)` pure helper in `ceilings.rs` (proposed name `check_streamed_features(rows_written, batch_rows, &ReaderCeilings)`).
  - It refuses when `rows_written + batch_rows > max_features`, which matches the viewer's `>` (renderer/bundle-viewer/src/main.ts:489 @ C).
  - The refusal is the existing `PublishError::CeilingExceeded { ceiling: "MAX_FEATURES", limit, saw }` (kernel/src/publish/error.rs:199-204 @ C, Display :428-431). OPEN-6 (i).
- Its caller is `run_inner`'s partition loop, after the `MAX_PUBLISH_PARTITIONS` check and before `write_partition` (kernel/src/publish/mod.rs:803-812 @ C), with the ceilings read once before the loop.
- The existing failure path removes staging (:640-658), and the boundary records `CeilingExceeded` as `Refused` (kernel/src/permission/boundary.rs:304 @ C). The boundary needs no change for this.
- This closes the `DeclaredNotVerified` bypass the code names (kernel/src/publish/ceilings.rs:114-119 @ C) and covers the bbox scopes §2.3 stops predicting.

### 2.5 The shell (phase 2)

- No product code changes in the shell.
- S-U1 (§4) proves the code arrives at the shell's real boundary.
- One doc sentence (§2.6, place 7) changes.

### 2.6 Sentences about behaviour: places, not words (Part 1, item 1)

The worker writes each sentence from the built code, and both gates check it clause by clause. None is drafted here. The places, each with what it must cover:

1. **The new variant's doc and Display** (error.rs).
   - Doc: where it is raised, its no-audit-record shape, and its governing cite (ADR-016 Amendment 1, item 1).
   - Display: the identity fact (this dataset's features are identified by position for this open only) and the format fact (a bundle carries ids beyond the open).
   - The Display must not advise declaring an identity column. The app offers no way to do that for such a file (KNOWN-LIMITATIONS.md:70 @ C).
2. **`ReaderCeilingExceeded`'s doc** (kernel/src/publish/error.rs:212-216 @ C). It calls `CeilingExceeded` the operation's own write-time limit, `MAX_PUBLISH_PARTITIONS`, which is no longer the whole of it.
3. **`ceilings.rs`'s doc on `check_reader_ceilings`** (kernel/src/publish/ceilings.rs:100-132 @ C), its residual at :114-119 especially, plus the two new helpers' docs.
4. **`mod.rs`:**
   - the order of operations (kernel/src/publish/mod.rs:46-49 @ C, :56);
   - `preflight_pinless`'s "one case" doc (:398-415);
   - the ceiling comment (:534-552);
   - the new check's comment, the caveat's comment and the guard's comment.
5. **`boundary.rs`'s list of preflight refusals with no audit record** (kernel/src/permission/boundary.rs:51-66 @ C).
6. **`is_session_ordinal`'s list of the sites that ask it** (engine/src/identity.rs:100-102 @ C). Publish becomes a third site.
7. **Phase 2:** the shell's "one case this ordering cannot help" (frontends/shell/src-tauri/src/publish.rs:385-387 @ C). With §2.3 there are two cases: an unverified tier, and a bbox scope over a file above the ceiling.
8. **KNOWN-LIMITATIONS.md items 5 and 6 and their source comments** (KNOWN-LIMITATIONS.md:79-88 @ C, :90-94). This is OPEN-5, a red line. The words must cover:
   - whole-file refused at preflight (unchanged);
   - Current view refused only if its own rows exceed the ceiling, while the rows are written, with nothing left at the destination;
   - the write-time check in item 6's list.
9. **The owner's index:** this form joins kernel/README.md's list of preregistrations (kernel/README.md:387 @ C). OPEN-9.
10. **Each new test's doc,** with its `RECORDED MUTATION:` line.

Item 3 of KNOWN-LIMITATIONS (KNOWN-LIMITATIONS.md:70 @ C) and the engine's statement (engine/src/identity.rs:149-153 @ C) become true and do not change.

### 2.7 Not changed

- `ceilings.json` and its pinned hash (kernel/src/publish/ceilings.rs:181-182 @ C), every `MAX_*` value, `VIEWPORT_BBOX_ALTERNATIVE` (:96-98), and `ReaderCeilingExceeded`'s Display (kernel/src/publish/error.rs:432-438 @ C).
- The `MAX_PUBLISH_PARTITIONS` check, every other refusal and its order, and the manifest's members and key order.
- `PublishRequest`, `prepare`'s and `prepare_with_progress`'s signatures, `PublishPromptData`, and commands.rs.
- No `pub` item is added; the helpers are `pub(crate)`.
- No change to `protocol/`, `renderer/`, `frontends/shell/src/`, Cargo.toml, Cargo.lock or `.github/`.

## §3 Fixtures, outcomes predicted before code

| ID | Spec | Opened by |
|---|---|---|
| FX-S | 200 features, `CategoricalZone`, `DeclaredLv95`, `ForeignKeyColumn` (the reproducer's, report :42-43) | `Catalog::open_cancellable(_, _, None, None, _)` (kernel/src/lib.rs:218-235 @ C) |
| FX-V | 50 features, `NativeUnique`, `CategoricalZone`, `DeclaredLv95` | same |
| FX-D | FX-V's file | same, with a declared mapping onto `id`, skip true (H-D) |
| FX-BIG | MAX_FEATURES+1 features, `avg_vertices` 3, `hole_every` 0, `NativeUnique`, `CategoricalZone`, `DeclaredLv95`, **with** the covering bbox (a bbox query needs it: engine/src/error.rs:103 @ C) | `Catalog::open_cancellable` |
| FX-BIG-D | FX-BIG's file | as FX-D |

| Row | Route | Base (C) | Head |
|---|---|---|---|
| R1 | FX-S, `preflight_pinless`, whole file and bbox | Ok (observed at 8b9193a1 through to publish) | refused, the new code, `content_pin()` None |
| R2 | FX-S pinned, `boundary::execute`, both scopes | published (observed, report :49, :51) | refused, no destination, no audit file created |
| R3 | FX-S, shell `prepare_with_progress`, `WholeFile` and `ViewportBbox` | a prompt (reading) | `Refused`, message prefixed with the new code; no pin, no pending attempt, no destination |
| R4 | FX-V, publish whole file | caveat = the current bytes | byte-identical |
| R5 | FX-D, publish whole file | caveat says uniqueness was verified at open (reading, kernel/src/publish/mod.rs:1444 @ C) | the caveat contains no claim that a verification ran |
| R6 | FX-BIG, bbox scope (P-0 picks the bbox, n rows with 1 ≤ n ≤ 10,000) | refused `ReaderCeilingExceeded`, predicted MAX_FEATURES+1 (reading, :553-557) | published, `rows` = n |
| R7 | FX-BIG, whole file | refused at preflight (existing ignored tests) | unchanged |
| R8 | FX-BIG-D, whole file, `boundary::execute` | publishes MAX_FEATURES+1 rows (reading, ceilings.rs:114-119; not run at the base) | refused `CeilingExceeded` `MAX_FEATURES`, limit 2,000,000, saw > 2,000,000; no destination, no staging directory left |

## §4 Tests, and the mutation per new test

**P-0, before any code** (throwaway, never committed, on the branch's own target, inside `hold shared -Project SpatialIDE`):
- What runs and is recorded with the 40-hex commit:
  - FX-D's identity triple (H-D);
  - FX-S's identity triple through `Catalog::open_cancellable`;
  - R6 at the base, its bbox and n read from the fixture generator's layout (H-BB).
- **Stops:**
  - FX-S not on the session tier;
  - R6 at the base anything but `ReaderCeilingExceeded`;
  - no bbox giving 1 ≤ n ≤ 10,000.
- **Not a stop, but recorded in a class 1 amendment before code:** FX-D not reaching `declared-not-verified` through a mapping on `id`. K-CAV then uses the engine route that does, or if none exists outside `cfg(test)`, the piece stops.

**Phase 1** (kernel; the new file `kernel/tests/publish_identity_tier.rs`, built from the reproducer's route):
- **K-U1 (the reproducer)** walks R1 and R2 in both scopes.
  - Its route is the reproducer's own. Its remaining deviations from the shell (the open via the catalog and not the host, `pin_content`, `PreNamedApproval`) are kernel-reachable equivalents (report :33-39), and R3 removes the pin and approval deviations.
  - It is committed alone first and observed failing by name at the base commit, and the record carries that commit.
  - **M-1:** the session check removed. Predicted to fail K-U1 at the R1 refusal assertion.
- **K-CAV** covers R4 and R5. It asserts the verified tier's caveat equals the current bytes and that FX-D's caveat does not assert verification. **M-3:** the caveat returned to the fixed text for every tier, predicted to fail at R5.
- **U-PRED** (unit, `ceilings.rs` tests): whole file, with a limit, with a bbox, and with None. **M-4:** the helper returns `verified_rows` whatever the bbox, predicted to fail at the bbox case.
- **U-GUARD** (unit): at the ceiling Ok; at ceiling+1 `CeilingExceeded` with saw = ceiling+1. **M-5:** `>` becomes `>=`, predicted to fail at the at-ceiling case.
- **K-U10a** (`#[ignore]`, release-only): R6. **M-6:** the prediction call reverted to `verified_rows()` for every scope, predicted to fail with `ReaderCeilingExceeded`.
- **K-U10b** (`#[ignore]`, release-only): R8. **M-7:** the guard call removed from `run_inner`, predicted to fail at the expected refusal (the publish completes).

**Phase 2** (shell, in publish.rs's tests, beside the K-5 precedent at frontends/shell/src-tauri/src/publish.rs:2808-2889 @ C):
- **S-U1:** R3, through `prepare_with_progress`, both scopes.
- **M-2:** the session check moved out of `preflight_pinless_parts` into `preflight`, after the pin is required. Predicted to fail S-U1 by name at the no-pin assertion.

**How each mutation is observed:** applied alone, the named test run, its failure recorded by name with the 40-hex commit in a `RECORDED MUTATION:` line, then reverted. A `verify-mutation` run is not an observation (docs/PREREGISTRATION-TEMPLATE.md:172 @ C). A mutation that passes, or fails anywhere else, is a stop.

**Determinism and CI:**
- No sleep, retry or timeout in any test.
- K-U1, K-CAV, U-PRED and U-GUARD run in `cargo test --workspace --locked` on both L1 entries, and S-U1 in product-ci-shell's cargo step (product-ci-shell.yml:217 @ C).
- K-U10a and K-U10b are listed, not run, by CI (product-ci-rust.yml:240 @ C). Each runs once by hand at the head on Windows, with `--release -- --ignored`, inside a shared hold, and the record says so.

**Existing tests that stay green, unloosened** (the ignored ones run once at the head):
- in kernel/tests/publish.rs @ C:
  - `a_preflight_within_the_readers_feature_ceiling_is_unchanged` (:625)
  - `preflight_pinless_succeeds_on_an_unpinned_small_dataset_and_never_touches_the_pin` (:645)
  - `a_dataset_whose_verified_row_count_exceeds_max_features_refuses_at_preflight_before_any_write` (:670)
  - `a_dataset_whose_verified_row_count_exceeds_max_features_refuses_before_any_hash_is_taken` (:740)
  - `the_manifest_carries_the_docs_11_resource_refs_the_grade_and_the_transform_fact` (:888, its caveat assertion at :933-936)
  - `publishing_twice_from_identical_inputs_gives_a_byte_identical_manifest` (:284)
- `an_adr_025_reader_ceiling_refusal_at_preflight_produces_no_audit_record` (kernel/tests/permission_boundary.rs:1059 @ C);
- the five unit tests in kernel/src/publish/ceilings.rs:165-241 @ C.

## §5 Predictions, declared unchanged, invalidators, falsification

- **Predictions:** §3's rows, M-1 to M-7 as §4 says, and every suite green.
- **Declared unchanged:**
  - §2.7;
  - §4's existing list;
  - MANUAL-WALKTHROUGH M10's whole-dataset refusal (frontends/shell/MANUAL-WALKTHROUGH.md:884 @ C);
  - KNOWN-LIMITATIONS item 3's words;
  - SKP-V0.
- **Invalidators** (each stops the piece and goes to the custodian):
  1. a P-0 stop;
  2. a product route found that produces `DeclaredNotVerified`;
  3. the session check needing IO;
  4. the guard needing a change outside `run_inner` and `ceilings.rs`;
  5. a declared-unchanged item moving;
  6. U12's merge changing `prepare_with_progress`'s signature.
- **Falsification:**
  - at the head, any route publishes a session-tier dataset;
  - R6 refused;
  - R8 completes.

## §6 Instruments

Every quantity is an assertion: a typed outcome, a code prefix, a row count, a byte comparison, or a path's absence. No measurement is taken, and the ignored runs' durations are not recorded as figures.

## §7 Declared values and ceilings

- **Size:** at most 700 changed lines (insertions plus deletions, comments and tests counted) over these 9 files, with this form and the custodian's PLAN rows excluded:
  - kernel/src/publish/mod.rs
  - kernel/src/publish/ceilings.rs
  - kernel/src/publish/error.rs
  - kernel/src/permission/boundary.rs
  - engine/src/identity.rs (the doc of §2.6, place 6 only)
  - kernel/tests/publish_identity_tier.rs (new)
  - frontends/shell/src-tauri/src/publish.rs (phase 2: S-U1 and §2.6 place 7 only)
  - KNOWN-LIMITATIONS.md (items 5 and 6 and their comments only)
  - kernel/README.md (one list entry)
- **Counting:** `git diff --numstat origin/main...HEAD -- <the 9 paths>` at a named commit. An overrun is class 8, and this line is not edited. My estimate is about 580 lines (unmeasured).
- **Constants:** none added or changed. `MAX_FEATURES` stays 2,000,000 (ceilings.rs:168 @ C).
- **Time:** the node's 60 minutes are the custodian's to revise, and I read them as low.

## §8 Block-on-sight

1. Fix code committed before K-U1 is observed failing at the base, or before P-0's record.
2. The session check after the pin, reading anything but the identity record, or a route to a session-tier bundle that bypasses it.
3. A preflight prediction for a bbox scope taken from the whole file's rows, or none for a verified whole-file scope.
4. A guard that leaves staging or a destination, fires at rows equal to MAX_FEATURES, or writes the crossing batch.
5. The verified tier's caveat bytes changed, any other manifest member changed, or `bundle_version` changed.
6. `ceilings.json`, its hash or any `MAX_*` value changed, or a constant added.
7. A new `pub` item. Any path outside §7's nine. Any line of `engine/src/identity.rs` other than the doc.
8. Any edit to the shell's publish.rs while U12 is unmerged (rule (00)).
9. A behaviour sentence drafted in this form or an amendment; a §2.6 sentence not clause-checked; KNOWN-LIMITATIONS words merged without the human's approval.
10. The refusal string without its mark (OPEN-4 (A)), or advising an identity declaration the app does not offer.
11. A sleep, retry or timeout in a test, or an ignored test reported as run by CI.
12. A mutation not observed as §4 says, or a `verify-mutation` run called an observation.
13. A probe or heavy run on a shared cargo target or outside a shared hold.
14. Any existing test in §4's list loosened.
15. A claim beyond §1.
16. Any CI entry red.

## §9 Gates and sequence

1. This form is committed.
2. P-0 runs (§4).
3. K-U1 is committed alone and observed failing at the base.
4. The phase 1 code goes in, with M-1 and M-3 to M-7 observed, and K-U10a and K-U10b run by hand.
5. After U12 merges, main is merged in, then phase 2 with M-2 observed.
6. The full suites run at the head and pass (Part 1, item 4). The custodian reads the hand-back for any disclosed sibling or gap.
7. The draft PR goes to both gates from dispatch, with one packet (Part 1, item 5):
   - **Architect:** §1's readings, block-on-sight item by item, and the seam (S-U1 against the real `prepare_with_progress`).
   - **Reviewer:** the full diff, the boundaries (item 7), and each §2.6 sentence clause by clause.
8. The KNOWN-LIMITATIONS words go to the human at the click.
9. **Out-of-scope categories:**
   - ADR: none.
   - Wire: none.
   - Security: none.
   - Guarantee: touched (KNOWN-LIMITATIONS item 5's lead sentence, and the refusal set).
10. **Operator:** OPEN-8.

## §10 Amendments (opens empty; append-only)

---

# OPEN items

**OPEN-1. U1's route.**
- (A) Refuse at `preflight_pinless`, every scope (§2.1).
  - It matches ADR-016 Amendment 1, item 1, the engine's shown statement, and KNOWN-LIMITATIONS item 3. None of them changes.
  - Its only red line is the new shown string (OPEN-4).
- (B) Publish, with a caveat true of the tier.
  - **Red line:** it needs the human's ADR-016 note or amendment (:192-195 and :201-205 say the tier does not cross the open), a change to the engine's describe statement (a P6 string), and new words for item 3.
- **Recommend (A).**

**OPEN-2. U10's route.**
- (A) The scope's prediction (§2.3) plus the write-time guard (§2.4).
  - It needs no engine change, keeps preflight IO-free, and closes the `DeclaredNotVerified` bypass.
  - Red line: KNOWN-LIMITATIONS items 5 and 6 (OPEN-5).
- (B) The scope's prediction plus an exact bbox count at preflight.
  - It keeps item 5's lead sentence true.
  - But it needs a new engine count API, IO inside `preflight_pinless`, which `preflight` re-runs at three sites (frontends/shell/src-tauri/src/publish.rs:379-383 @ C, :550; kernel/src/permission/boundary.rs:324 @ C), principle 7's cancel and progress for the count, and an unmeasured docs/08 cost.
- (C) Keep the behaviour and rewrite item 5.
  - **Red line:** the alternative the refusal names is the human's ruling (entry 53 / B3), and it would stay unusable. That is a scope change to a ruled item.
- (D) The scope's prediction only, with no guard.
  - It reopens ADR-025's dead-artifact gap for a large view.
- **Recommend (A).** It needs no ADR note. If the human wants the write-time refusal recorded on ADR-025, that is an appended note in their words.

**OPEN-3. Sequencing with U12** (it holds frontends/shell/src-tauri/src/publish.rs: governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md:9 @ C).
- (A) The two phases on one branch. Phase 1 starts at dispatch, and phase 2 after U12 merges. Gates go after phase 2.
- (B) Dispatch the whole piece after U12 merges.
- (C) A kernel-only piece, with S-U1 as a follow-up node. This leaves the shell boundary unproven for this code, against item 7's "where the kernel test cannot reach it".
- **Recommend (A).** It keeps slot 1 moving, and the phases collapse if U12 merges first. Not a red line.

**OPEN-4. The refusal string.** **Red line** (P6).
- (A) A `[P6 placeholder] ` prefix, facts only, written by the worker from the code. The human words it at the sitting.
- (B) Unmarked.
- **Recommend (A)**, on the precedent at kernel/src/publish/error.rs:414-420 @ C.

**OPEN-5. KNOWN-LIMITATIONS items 5 and 6.** **Red line** (release-facing).
- (a) In this PR, under Part 1, item 1: written from the code, checked by both gates, approved or replaced by the human at the click.
- (b) Defer. From the merge, item 5's lead sentence would be untrue for a Current-view publish over the ceiling, which is a Correctness finding.
- **Recommend (a).** Neither item belongs to a docs-lane node (governance/PLAN.yaml:6462 @ C, :6479).

**OPEN-6. The write-time refusal's form.**
- (i) The existing `CeilingExceeded`: its Display, its audit kind and its `Refused` outcome. No new string.
- (ii) A new variant naming a smaller view, which would be a new P6 string and a red line.
- **Recommend (i).** Not a red line.

**OPEN-7. The caveat for the unverified tiers.**
- (a) Per `IdUniqueness`, with the verified tier's bytes kept.
  - The two new sentences are not P6: no ordinary-use route reaches either.
  - The viewer shows the caveat (renderer/bundle-viewer/src/main.ts:310 @ C). That is named here and recorded in the source comment.
- (b) Also refuse `DeclaredNotVerified` at publish. No ruling asks for it.
- **Recommend (a).** Not a red line: ADR-017 does not fix the caveat's wording (:85-89).

**OPEN-8. Operator rows.**
- (a) None in this piece. The custodian records two proposed rows on the node for the next sitting: exporting a session-tier file is refused, and Current view on a file above 2,000,000 rows publishes.
- (b) Rows in MANUAL-WALKTHROUGH in this PR. That adds a file in contact with U12's Part G and the area-B sweep.
- **Recommend (a).**

**OPEN-9. The owner's index** (kernel/README.md:387 @ C).
- (a) This form joins the list in this PR.
- (b) Later.
- **Recommend (a)**, the precedent of 8c's OPEN-4. Not a red line.

# Rule (00), path by path (governance/AUTONOMY.md:609 @ C)

| This piece's path | `cut/b2-piece-1c-save-and-reopen` (the custodian's list) | U12 (its Scope line) | `cut/port-2-macos-l1-and-app-dirs` | protocol/ |
|---|---|---|---|---|
| kernel/src/publish/mod.rs, ceilings.rs, error.rs | none | none | not known to me | none |
| kernel/src/permission/boundary.rs | none | none | not known; its worktree touches `kernel/src/permission/audit/log.rs`, a different file (read only, tip unverified) | none |
| engine/src/identity.rs | none | none | engine paths per 8c's form: app_dirs.rs, lib.rs, lod.rs, lod tests; disjoint | none |
| kernel/tests/publish_identity_tier.rs (new) | none | none | none | none |
| frontends/shell/src-tauri/src/publish.rs | none | **overlap**: phase 2 waits for U12's merge (OPEN-3) | none per U12's settlement | none |
| KNOWN-LIMITATIONS.md items 5 and 6 | none | item 8, disjoint | platforms paragraph and item 43, disjoint | none |
| kernel/README.md (one list line) | none | none | not known | none |

- **Contact, not overlap:**
  - 1c edits `kernel/src/lib.rs`, where `Catalog::open_cancellable` lives (kernel/src/lib.rs:218-235 @ C), which the new tests call. If 1c merges first, the tests follow its signature.
  - 1c's `renderer/src/canonical.rs` serialises the manifest. This piece adds no member.
- **Nothing in this piece touches protocol/.**
- **The custodian runs `git diff --name-only origin/main...cut/port-2-macos-l1-and-app-dirs` at dispatch** over the four kernel files and kernel/README.md, because I cannot read branches.

# What I could not settle

- The brief's sha256 and HEAD. I have no shell.
- port-2's file list beyond the engine paths in 8c's form and its worktree's audit file. The custodian checks at dispatch.
- H-D: whether a mapping onto the native `id` with skip opens as `declared-not-verified`. P-0 decides.
- H-BB: FX-BIG's layout, the bbox and n. P-0 decides.
- The line estimate (about 580, unmeasured) and the time. The node's 60 minutes look low for two release-only multi-million-row runs plus seven mutations.
- Whether `ensure_pinned_with_progress` or `SkpHost::open_dataset` adds anything to identity. By reading neither does (the identity is decided in the engine's open, engine/src/dataset.rs:1933-1959 @ C), but S-U1 still opens the dataset outside the host.
- No ADR skeleton: on (A)/(A), no decision is missing.
