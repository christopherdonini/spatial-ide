# SKP-V0.md's live sections brought current to the wire, and three unproduced codes struck (sweep area C) — preregistration (full form)

**Authority.** PLAN node `skp-v0-live-sections-current-area-c` (`PLAN.yaml:4406-4422 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:7fefac02410b66f922c5e0a9f6d5c2e7315851ea73a993246f575f149b44ce32`). It was proposed on the human's area C instruction 3 (`state/directives/2026-10-10-drift-sweep-area-c-instructions-filed-late.md:9 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:80979ae245c08f14c2bc6a75bdaa71429a1d07416846d0b74800ea72e0515d53`). It was placed as the docs lane's item 3e (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:27 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:d82e28ea8f74d57fac226d72ca7b7af95c0ee37f2452a8a03f3f454ce671cd0b`), under the lane's terms (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:17-21 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:a93e0c9428a9f0e4364020919fcc8d31054d4d7b1030ff36c55b628190063707`). The human's ruling, item 4, widened it (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:30 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:465e0f89bdfacc7420768081a66998c35112b93370dbb6eac84fef5cc13d5d16`). It is drafted ahead of its slot (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:38 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:2eba54a30650266443f7bfd35cb1581b050063d7db93623b0ad2b648a7d92c4d`). The ruling moves the question of a typed refusal to a named open item (`PLAN.yaml:1977 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:15671350468855a2e22195965a232f947c8ca4f794fe21d896eaf2f81cf21f53`).

**Drafted by** the architect, on the custodian's brief. The inputs were:
- lead-data's impact read (`state/consults/2026-10-11-skp-v0-live-sections-current-area-c-impact-read.md`, whole-file sha256 388dec3644b0bbfe53f655ba6c35aa0c260838bf3412eda9485fc658387cf834 as filed, read at main 5b64b9f8);
- the drift sweep report and the custodian's check;
- the form of piece d (`module-docs-stale-statements`);
- the architect's own reads, all at main 58ec72aeacd1903c501faa1972e6f85bdc152a69 (C below).

**Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating.** Full form and full gating from dispatch, under round 25, item 2 (e). Two §21a heads apply:
- the wire (`AUTONOMY.md:323-324 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:90dd5aaa322e44946970eecb24134b69e410c15e357bfa9cdd5ef5c4459bca59`);
- a stated guarantee (`AUTONOMY.md:325-327 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7`).

The §21c line bound is also crossed (§7). The piece amends no ADR and touches no security posture. Verdicts are proportional (`state/directives/2026-10-05-product-first-direction.md:15 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`).

**Reuse index.** `tools/reuse.mjs` at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c recorded no prior art for this query. The miss is noted, and it does not block.

## §0. Disclosure

- **Pins are historical.** Every `path:line @ C sha256:` below is a pin at C.
  - Before code, the worker recomputes each pin at its base B. B is the merge-base on main after piece d (`module-docs-stale-statements`) has merged, and so after PR #206.
  - Where B's tree no longer matches a pin, the worker names B's tree as authoritative for that row and records the moved line as a class 3 row before code.
  - A changed fact, as opposed to a moved line, is an invalidator (§5).
- **Lines that exist only on a branch** are named in words and never pinned. Piece d edits `kernel/README.md`, and its lines are read at B after it merges.
- **The impact read was taken at 5b64b9f8.** Every line pinned below was re-read at C.
- **Found by the architect beyond the impact read:** rows S10 and S11, and the facts marked (A).
- No measurement, no fixture and no 5 GB read, so the drive confound does not apply.

## §1. What this preregistration may and may not claim

- **May claim:** each rewritten sentence states a fact that its pin shows at B.
- **May not claim:**
  - any behaviour change. No code logic, assertion, test name, literal, fixture or string the app shows changes.
  - that a typed refusal is or will be produced for the three codes. That is the named open item on `first-external-plugin-skp-client`.
  - the text of Tauri's decode error.
  - that the decode rejection is tested end to end. No test drives it through Tauri.
  - that the cancel-key branch's `unknown` is tested. No test reaches it.
  - that the host itself checks a `HexF64` for finiteness. It does not: `HexF64`'s field is public (`protocol/skp/src/v0/codec.rs:38 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:976fd5390e30542d14ea02f1a1603ddcfaa15f7364b5f22e07734054aa9e7c67`), and no code in `kernel/src` checks finiteness (A).
  - that the conformance harness reads `expected_refusal_code`. Nothing in the tree reads it.
  - any version event, or any wire change.
  - an exposure review or discharge for any surface other than the shell's UI.
  - a Proposed ADR (019, 023) described as binding.
  - a draft's block-on-sight item presented as accepted ADR text.
  - any performance figure, or any platform level.
- **The three `pub` constructors stay, with no caller.** The human's ruling says nothing else changes in `error.rs`. This piece adds no item.
- **ADRs cited, none amended:** 004, 016, 017, 019 (Proposed), 023 (Proposed), 034, 035.

## §2. The change

### 2.0 Rules every rewrite follows

- **(a) Cites.** The text cites by section, item name (fn, test), or ADR number with section or amendment item. It never cites by a bare `path:line`.
- **(b) Tests.** A fact no test pins is not called tested.
- **(c) ADR status.** Status words match the ADR's Status line.
- **(d) Quotes.** No new quotation marks unless the text is byte-copied by script. Existing quoted spans stay byte-identical.
- **(e) One place for the literal.** The current literal is stated in one live sentence only, §4 item 3. §1's lead, §7.1 and §9.1 point there, so that the next bump edits one sentence.
- **(f) Cancellation vocabulary.** ADR-018's words are used only in ADR-018's sense. The cancel rows use the wire's own `state` values.
- **(g) Order of commits.** Rows S1 to S11 first, then the comment rows, then the §8 note (S12) last, so that its list matches the diff.

### 2.1 Rows (SKP-V0.md)

**S1 — §1's shapes (finding 1).**
- **Stale:**
  - `protocol/skp/SKP-V0.md:26 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:ae481d344f9260032b1d3eb2ddd0b60ee22c77ed9ac44582d570d864ec5cb025`;
  - `protocol/skp/SKP-V0.md:60-62 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:93967661775505b20b697d07897c276a8965fd3982d709bef927ffe4ef981d84`;
  - `protocol/skp/SKP-V0.md:79 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:8ea88e9c8cb0ff06e012e947de583a99e38e13fc331359cb4191464851daa313`.
- **Facts:**
  - `protocol/skp/src/v0/commands.rs:63-69 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:9891becfbe8c3ce6cac63e3b1b68507bc1a2fbf74d9a43fd5e55654bcf680254`;
  - `kernel/src/skp.rs:1294-1297 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:cd912cc0c606e38da14b4e51a5753d534f1560aa1e98dd881cce7c97bdd86ae5`;
  - `protocol/skp/src/v0/commands.rs:267-290 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:0af75774f85b035565cc979d4873f0d358498e58c4aab5fff4d17002b93c6219`;
  - `kernel/src/skp.rs:1308-1335 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:eda006b17feec17eee990d9cb5ee4b9cefaf87a797a72e7520c556c0035bab02`;
  - `kernel/src/skp.rs:1336-1359 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:75238776f456bb337089bbbb4277980ff32afe752162b725515e4f493f2a73a9`;
  - `kernel/src/skp.rs:1360-1363 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:05c6147e3ba76c2e1e38cc66c201ca2c58539f68a8a7d14a234edc8340d72563`;
  - `protocol/skp/src/v0/commands.rs:223-235 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:be839149c055e31d6ceb8034f6f46ae9785642044e55e1c0251ddf4038fded7d`;
  - `kernel/src/skp.rs:1967 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:4a449b99ba7b8036d58775ba8399f1fee4605e188ad493447d49d52c76c1d872`;
  - the members' shapes in §8's `skp/0.5` entry: `protocol/skp/SKP-V0.md:840-856 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:c0cf4a6740da7d9c727c4f230fae1c739a98e9b54a679eabb22d826290eebf4e`;
  - in §8's `skp/0.6` entry: `protocol/skp/SKP-V0.md:904-909 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:834b9de32f2657f9f35ecc171fcba425fbfd7e0927986ff8ad72911fb9cb581e`.
- **Says:**
  - `open_dataset`'s response is `{ dataset: DatasetHandle, session: SessionRef }`.
  - The `describe` block gains `coverage`, `checks` and `session_end`, in the shapes the `skp/0.5` entry gives.
  - `schema` rows gain `projectable`.
  - The lead at 60-62 says the block carries every member the host sends at the literal §4 item 3 states, brought current again with no literal change (§8's dated note, S12).
- **Worker's check at B:** struct by struct, every member of `DescribeResponse` and of its nested structs appears in the block. The architect's read at C: every member does, once the four are added.
- **Not:** types or value domains beyond what §8's entries already give. AMBIGUITIES A1 stays as recorded.
- **Tests:**
  - `protocol/skp/tests/fixtures.rs::open_dataset_response_carries_a_session_reference`;
  - `protocol/skp/tests/fixtures.rs::describe_carries_coverage_checks_and_session_end_as_independent_members`;
  - `protocol/skp/tests/fixtures.rs::describe_fixtures_carry_projectable_on_every_schema_row`;
  - `kernel/tests/source_watch_ordering.rs::describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer`.

**S3 — §4 item 1, publish (finding 3; red-line text).**
- **Stale:** `protocol/skp/SKP-V0.md:202 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:adc763b533fe3d4529dd53d7d2b91bbe08d27d35c3ac2914ae9852572d9504ba`, its parenthetical only.
- **Facts:**
  - the binding-local family is outside SKP: `frontends/shell/src-tauri/src/commands.rs:11-12 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:c21fa7cddc0156715bed25e4cba0a19f52ff453be417e3ff366ff8c9960fabcc` (A);
  - `frontends/shell/src-tauri/src/commands.rs:265 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:379d668624a54f04dbc476ce53e7c50f070560c363a29966898a2c70ccc4e0a7`;
  - `frontends/shell/src-tauri/src/commands.rs:402 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:72d384067b676aebdefbcfaddce904d69ee9d017b28426a65fa2e3b9c756f30d`;
  - `frontends/shell/src-tauri/src/commands.rs:451 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:825cd5b3752bf8d0d68d12a0a62c5d1d7180228bed8c04ce4cc633f2beee9f4f`;
  - `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1127-1132 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:524f064a91fbf53c0aa99f476e9702d2fb46dd81c24a83ac35f5a607fd95a174`;
  - `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1134-1142 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:b3e3a630c64e504061231df63ea6005bb3a4e38e486aa4427bbc0d1899b148e3`;
  - SKP declares no publish request type. This is an absence, asserted by script at B over `protocol/skp/src/v0/commands.rs`.
- **Says:**
  - SKP has no `publish` command.
  - The shell's UI reaches publish through its binding-local `binding_publish_*` commands, outside SKP.
  - ADR-017's exposure-review completion of 2026-08-17 discharged the acceptance condition for that UI surface only.
  - The surfaces ADR-017 names still each need their own review: SKP, CLI-as-product (`publish-bundle` stays developer/test tooling), MCP, plugin, notebook and AI. No more surfaces and no fewer.
- **Not:** any surface beyond ADR-017's text; that SKP may gain publish; that the exposure scope is tested (no test pins it).
- **Tests:** `frontends/shell/e2e/publish.mjs` (drives publish through IPC, by its header); `kernel/tests/permission_boundary.rs::the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate`.

**S4 — §1's path sentence (finding 4).**
- **Stale:** `protocol/skp/SKP-V0.md:29-30 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:5b355c53122339052946a518e6a90bbf8b39653a5671a6f6059548fd282b60cd`, the second sentence only.
- **Facts:**
  - `engine/src/dataset.rs:325-327 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:d1a7cf72b1130653d6da62a02413e06cdd3eb53a0711b3f1b1d4f85a02fd6b16`;
  - `engine/src/dataset.rs:328-332 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:21ff4035de8e654869eb77548d9bce00b07bb53cf6ac7fe1f60f165ac6a672b7`;
  - the two shapes, a directory and a glob metacharacter: `engine/src/dataset.rs:1637-1641 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:b38e262957a780bbc9a20b2f791b10f9cbd288da9f6101b266a43fbd061add49` (A);
  - `kernel/src/skp.rs:2092-2095 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:071d32c0539426e6222c45f08077e7ac1745f9c7c439809e419b72cea51c5beb`.
- **Says:**
  - The host passes the path to the engine without canonicalizing it.
  - A directory, or a path carrying a glob metacharacter, is refused first, as `engine.identity_ordinal_partitioned_unsupported`.
  - Any other path that is not a file is refused as `engine.source`, with `EngineError::Source`'s own text.
  - The first sentence (UTF-8, absolute, from the OS file picker) stays.
- **Not:** a platform behaviour; a claim that the host checks that the path is absolute.
- **Tests:**
  - `engine/tests/session_identity.rs::a_directory_source_is_refused_by_name_rather_than_as_an_unreadable_file`;
  - `engine/tests/session_identity.rs::a_glob_source_is_refused_by_name_and_a_plain_missing_path_is_not`;
  - `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`.
- **No canonicalization** is an absence. It is asserted by script at B: every `canonicalize` in `engine/src` and `kernel/src` is listed, and none is on the open path. It is not called tested.

**S5 — the three codes struck (finding 5, the human's ruling).**
- **S5a, §3.**
  - **Stale:**
    - `protocol/skp/SKP-V0.md:184 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:3e356f2500d0595c65a726fd3e287865698a3d9b8a957687bc55626dbbda0d5f`;
    - `protocol/skp/SKP-V0.md:186-187 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:c2440186939e547481b507cc027a4d60ee7ddf296da781bcdb7e497f4a6ddf38`.
  - **Facts:**
    - `protocol/skp/src/v0/codec.rs:45-60 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:d491f1f68bbe20fe5e4013ee1b7fe0fe365bdf1b3e04db87aa8b7d77d1462739`;
    - `protocol/skp/src/v0/codec.rs:69-77 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:a303c98412709a846406007b98d4499905420dc45e2412fa35322c81c338c5b5`;
    - `protocol/skp/src/v0/commands.rs:366-371 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:313d8555c457f7858cb7411e2256d46495bc294d89a852ab1fbf1a3484e11825`;
    - `protocol/skp/src/v0/commands.rs:428-431 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:40f51388524ab10d1db487f2edef76394dd1d09fe3078967cbde7a80322fb3fe`;
    - `frontends/shell/src-tauri/src/commands.rs:86-90 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:107c5eaca9417e05b55f956fb530bc88e5ecc41902d84bf9e7ca0472129515d6`;
    - `frontends/shell/src/skp/client.ts:33-42 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:0c1614eedbdf9bf44f6872054cb994f1210324fcfded1f019632579129e7189c`;
    - `frontends/shell/src/skp/client.ts:58-65 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:b075b19b3e368be9bb5ee955cf2920ea6f10c00e0149ebf00e73c9b10480ea31`;
    - Tauri invoke is the only binding: `protocol/skp/SKP-V0.md:207-211 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:3d7a2cc1d9d993e2fe8513068ec57b0e3d841a28daf3a40473e30adfa7e768ad`.
  - **Says:**
    - The lead says a malformed value is rejected, never parsed on a best-effort basis.
    - The `HexF64` bullet: a wrong length or case, or a non-finite bit pattern, is rejected by `HexF64`'s deserializer while the request is decoded, before any command runs.
    - The host returns no `SkpError` for it. On the Tauri binding the shell's client receives an error that is not an `SkpError`, records it as thrown, and rethrows it unchanged (`call` in `client.ts`).
    - The bullet's ADR-004 amendment 1 and spike M4 sentences stay.
  - **Not:** the error's text; a test end to end; a host-side finiteness check.
  - **Tests:**
    - `protocol/skp/src/v0/codec.rs::tests::hex_f64_rejects_wrong_length_case_and_prefix`;
    - `protocol/skp/src/v0/codec.rs::tests::hex_f64_rejects_non_finite_bit_patterns`;
    - `protocol/skp/tests/conformance/main.rs::spec_derived_fixtures_against_wire_types`;
    - the case in `frontends/shell/src/skp/client.test.ts` that records an untyped transport failure as thrown and rethrows it.
    - No test drives a Tauri decode rejection.
- **S5b, §5.**
  - **Stale:** `protocol/skp/SKP-V0.md:329-331 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:b8d963d2743fd5582579ce3100444b16ed9a5ef8c1a7cc221e0958a7de8949a9`.
  - **Facts:**
    - the constructors: `protocol/skp/src/v0/error.rs:74-80 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:7387e5389004ebebc64166218b534fac73a4ec85a1924dedd710dbfdd9b570a4`;
    - `protocol/skp/src/v0/error.rs:82-88 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:44a529ca93d034e404af35c05e754b4be5c7d6f2c4270d161348da4f8e5bf546`;
    - `protocol/skp/src/v0/error.rs:90-96 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:99d726f3380318968e91467238ea67265cef3d03e39efcc6ee18a2b31f3c70dc`;
    - no call site, asserted by script at B: `git grep` for each constructor's call over `*.rs`, `*.ts` and `*.tsx`, outside its definition. The script is self-tested positive.
  - **Says:**
    - The `skp.` example list drops the three codes. The rest of the list and its ellipsis stay.
    - One new line lists `skp.unknown_handle`, `skp.malformed_hex_f64` and `skp.bbox_not_finite` as reserved and not produced at `skp/0.x`, pointing to §3 for `HexF64` and to §1 `cancel` for an unknown handle.
- **S5c, §1 `cancel`.**
  - **Change:** one sentence is added after the first sentence of `protocol/skp/SKP-V0.md:119-123 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:cd177263ac60ac41169236e84efb1dd6077b25eb9b601f4cad7f9b59d5667c5a`.
  - **Facts:**
    - `protocol/skp/src/v0/commands.rs:464-469 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:dfb3ae4998b5cdbe9e9b8ab5128f551240158542e08e76e8069eab9f14a1af19`;
    - `kernel/src/skp.rs:1556-1568 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:ce90281111de2eb46aabd634fc0b1a8cbb4fe691cf0f3bec909106acfd9d0437`;
    - `kernel/src/skp.rs:330-331 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:60375a2d4c0a88f48c804663a4ef4053b60062b992f66226ed43c354ec5bf996`;
    - `kernel/src/skp.rs:954-957 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:8b98144ed8ecf9e58c0d3b1ea45aef79bfc5bc2f3a7fb52110bc6ed75b61daf5`;
    - `kernel/src/skp.rs:73-79 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:6af998377a97fe24adfa422245a13cc49c3b58118a1ae9c9ef904f3b996ea7e4`.
  - **Says:**
    - The host tells the two kinds apart by shape. A well-formed `sh_` handle is looked up among tickets; any other string is looked up among in-flight opens.
    - A handle found in neither answers `state: "unknown"`.
    - A version mismatch is still refused first.
  - **Tests:**
    - `kernel/src/skp.rs::tests::cancel_on_an_unknown_handle_is_unknown_not_an_error`;
    - `kernel/src/skp.rs::tests::the_real_cancel_responses_match_the_shared_fixtures`;
    - `kernel/src/skp.rs::tests::version_mismatch_is_refused_before_anything_else`.
    - The cancel-key branch's `unknown` is stated from code only.
- **S5d, `protocol/skp/src/v0/error.rs`.**
  - **Change:** insertions only. Each of the three constructors gains `///` lines directly above it, saying it is reserved and not produced at `skp/0.x`, that nothing calls it, and pointing to SKP-V0.md §5.
  - Nothing else in the file changes, the test literal at `protocol/skp/src/v0/error.rs:153 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:34da61378698f6843225187d719e572c5e32675c6d8ec2bdfa65ac76305a8fe4` included.

**S9 — the literal (finding 9).**
- **Stale:**
  - `protocol/skp/SKP-V0.md:15 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:8199a3f2fcc686d5adb8e54cd4b8fef787edfeb1e503a1b7a9eaea0bac765c90`;
  - `protocol/skp/SKP-V0.md:219-221 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:7f8c9c9369869f06a1a6850200c78cbec69112ad6e2527b1ae0507899afa35b4`;
  - `protocol/skp/SKP-V0.md:361 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:955e953ebae3f9b838a755c935073b190aabc4b034811cf454c6a6bff5b0f507`;
  - `protocol/skp/SKP-V0.md:1096 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:bbe4faed68ba6f1494e1e67970254e64a90333874f107f6f363d8eceab5914a8`;
  - `protocol/skp/SKP-V0.md:1101-1103 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:526b177c1b8ce9d448fb4ca6be9b5139b205299bc374fbcd4ea859e0c1fb7ec1`.
- **Facts:**
  - `protocol/skp/src/v0/mod.rs:109 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:565dc56ac0b2f54024ba5a8d167c79c72d256d5b69835bd55c0e95f43b187a8b`;
  - `kernel/src/skp.rs:1614-1619 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:2cb142fd60b8654f58f07abfe8bf5a77e99a1732ed6ca4684a80613ec111bc7c`;
  - `frontends/shell/src/skp/types.ts:15 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:36229076c130ad39b409c2e9bb5cf51b20b18b8536e684b8da271c1b7250b3f1`;
  - the §8 entries: `protocol/skp/SKP-V0.md:956 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:b2b414e7cd4c5745714f223ead7dcf1975111d5bc74d5dc3d37e33d80e49f3c3`;
  - `protocol/skp/SKP-V0.md:993 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:f962b1be36d813a81d4e681f1f4b46663df92130a7eb0ae093d0a79d0085ef37`;
  - `protocol/skp/SKP-V0.md:1021 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:050f2a1b8e55b02d7eb71233b648a6a3a409c2e9a2832e8b75c37fc7700d2f05`;
  - `protocol/skp/SKP-V0.md:1055 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:61caeb867d07997adb47aab36c56bb8a0eced3963c1b8a4ccf58cac45e63b615`.
- **Says:**
  - §4 item 3 gains one sentence: `skp/0.7` to `skp/0.11` each bumped the literal again in turn (§8), `==` unchanged, and the literal the host compares today is `skp/0.11`.
  - §1's lead says every request carries the version literal stated in §4 item 3 (`skp/0` at v0), compared as before.
  - §7.1 and §9.1 each gain a dated note, with no literal change: the literal has been bumped since, and §4 item 3 states the current one.
- **Tests:**
  - `protocol/skp/tests/fixtures.rs::skp_version_is_skp_0_11`;
  - `protocol/skp/tests/fixtures.rs::every_request_fixture_carries_the_current_skp_version`;
  - `kernel/src/skp.rs::tests::version_mismatch_is_refused_before_anything_else`.

**S10 — §9.5's heading (the check's observation).**
- **Stale:** `protocol/skp/SKP-V0.md:1152 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:f708b79d5725fc342a282645053a62d15830a5661a46b4402c43635d2857a8ac`.
- **Facts:**
  - `protocol/skp/SKP-V0.md:1156-1163 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:96a1fba3bfc10e5963b64582cd60e5c928570200bb0ce2e07533168c716da556`;
  - `protocol/skp/SKP-V0.md:1169-1173 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:2055a0f495d682c4c90cfe8f223e554cfe083cdbb9217ae2422356b653664881`.
- **Says:** the heading names eight codes, in place.
- **Why not §7.5's precedent** (`protocol/skp/SKP-V0.md:497 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:02d050c9842aefd81fffdd25417e0684db3efe9bfb7ec3ad05b6aad32247d292`): §7.5's twelfth code was added in a note and never in its table. §9.5's table already carries the eighth row, so the heading is the only line out of step with the table beneath it.

**S11 — §5 cited as §6 (A).**
- **Stale:**
  - `protocol/skp/SKP-V0.md:256 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:07e6e9fb6c65c1f3e28da175736895ba01afe4f771ad588451fd5ef5bfb2d560`;
  - `protocol/skp/SKP-V0.md:468 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:41711afc97640d8a4583768063405df4c8e1208308c15f65848d8874f6b72865`.
- **Facts:**
  - `protocol/skp/SKP-V0.md:319 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:f1b5b19db1a38e0f6aaa9aaaeeb2b49c7cb5270d7977028c3294af43c91806d4`;
  - `protocol/skp/SKP-V0.md:338 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:5a409eafee963d8d49bcc013e2008c84ec372e265aab513a4306869a4696227d`.
- **Says:** §5, in both places. Nothing else in either line changes.

**S12 — §8 dated note, appended.**
- **Where:** one dated note, no literal change, appended after the last line of the covering note (`protocol/skp/SKP-V0.md:1079-1086 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:7780c0bbb2b382ae637ee3e044251793c25d8a354f146fe1031b98fa24c8df46`) and before `## 9.`.
- **Shape:** it follows the precedents (`protocol/skp/SKP-V0.md:975-983 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:ed667b255499965fcd65d1fe456be8254c4ef8e3773c62f39dc5b818479b98b9`; `protocol/skp/SKP-V0.md:1043-1053 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:515ecbd064c72de7a1c22316093c204458f4930072e8af03e7641b5d33852bff`).
- **It names the PLAN node, and B as a full commit id on main.** It records:
  - (i) each in-place change of S1, S3, S4, S5a to S5c, S9, S10 and S11, by section;
  - (ii) that the three codes were never produced, are struck by the human's ruling (the directive, item 4), and are listed in §5 as reserved;
  - (iii) that the conformance fixtures' `expected_refusal_code` values for the nine `HexF64` fixtures still name two of those codes, unchanged under the ruling, and that nothing reads that field; and that AMBIGUITIES A3 and A8 stay as recorded;
  - (iv) the reading this piece applies: §§1–7 and §9 are the live current-shape description. §8's preamble names §§1–7 (`protocol/skp/SKP-V0.md:547-550 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:e5b423c4a697d4d3f1b19b4da89f1380c98157515c2eefcfc3899ef2b06e1f64`). §9 is laid out as §7 and updated in place by its own dated notes. §7's lead of 2026-08-13 (`protocol/skp/SKP-V0.md:351-352 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:f64363820136bbc5259b248fdd0d47331ade7bb9bd932caa73b385334655d9b1`) describes §§1–6 as they stood then;
  - (v) that no key, value or command is added or removed, that no code the host produces is added or removed, that the kernel's serialized responses are unchanged, and that `protocol/data-plane/` has an empty diff.
- **The preamble is not edited.**

### 2.2 Comment rows

**S6 — `frontends/shell/src/skp/types.ts` (finding 6).**
- **Stale:** `frontends/shell/src/skp/types.ts:290-292 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:f78f8a7d470af9a22fa644121f725aa864ed285970e3377712502a7435dcfaa3`.
- **Facts:**
  - `frontends/shell/src/skp/events.ts:23 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:79de299e4bb9f8f658dad0f737bb21973345c002de6275ab4ebe808392fce373`;
  - `frontends/shell/src/skp/events.ts:59 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:976f1956402964776ec724a37dedea59242c7f5c30d61bbc91bd6a4780652162`;
  - `frontends/shell/src/App.tsx:1206 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:eb376c921e6724dfca735bee3a428ea17347db9a7d022205c47e2a8dc9148081`.
- **Says:** `skp/events.ts`'s `decodeDatasetSessionEnded` and `listenDatasetSessionEnded` consume this event; this file mirrors only the wire shape.
- **Tests:** the `decodeDatasetSessionEnded (SH6)` block in `frontends/shell/src/skp/events.test.ts`. No test names the listener.

**S7 — `protocol/skp/src/v0/handles.rs` module doc (finding 7).**
- **Stale:** `protocol/skp/src/v0/handles.rs:4-13 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:b3b870ee6059904fb98f97bad4fc567f568ac27a8b1876dd0b2936766d9a7bb6`.
- **Facts:**
  - `protocol/skp/src/v0/handles.rs:104-113 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:a75f53ea12ddaafe44aaf352580b96dd18bb1f38fcbd497be35d437e28508595`;
  - `protocol/skp/SKP-V0.md:175 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:08b41f7aeee637c0593c4ca2fb77f6b56c76397aadd8df7cf946d1e58ffbf3ff`;
  - `protocol/skp/SKP-V0.md:177 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:3e5e80ac55f929e8e125630afaa3a6fec64f8e74c800d5d0ff54226167d6e4b1`.
- **Says:**
  - Three minting rules, one type per kind.
  - A third bullet: `SessionRef`, kernel-minted, names a kernel-side session, authorizes nothing, and no command's request accepts it (`skp/0.5`).
  - All four kinds are session-scoped and non-persistable.
  - The two existing bullets stay.
- **Tests:** `protocol/skp/tests/fixtures.rs::open_dataset_response_carries_a_session_reference`.

**S8 — `projection_error_of`'s doc (finding 8).**
- **Stale:** `kernel/src/skp.rs:1720-1721 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:ed95b851fc6aef136a36a09e625e5ae21e55c992f88370f2ebf2cd77c2217ff8`.
- **Facts:**
  - `kernel/src/skp.rs:1725-1782 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:0f93e24b0129d1a399bc41ab08cfe91e0fbe059489cf2ecb504c724c57fc37d6`;
  - `kernel/src/skp.rs:1686-1693 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:793f581c0f6ed3cbeb16aaaa6cc5907d3e660140c50f7132928a4e755c49f9fc` (A);
  - `protocol/skp/SKP-V0.md:1135-1136 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:dd53dc9eafdaa23b05c382a43382494c8969c5927bcaef89cbfc35684653eedf`.
- **Says:** the seven `skp.projection_*` codes are mapped from `ProjectionError`. The eighth, `skp.projection_empty_list`, is minted in `viewport_query_build_error_of`, not here.
- **Tests:**
  - `kernel/tests/skp_projection.rs::every_projection_refusal_is_synchronous_typed_and_pre_mint`;
  - `protocol/skp/tests/fixtures.rs::every_new_projection_error_fixture_round_trips`.

### 2.3 Conditional rows (OPEN-2; applied only on the answer)

**S5e — `protocol/skp/src/v0/codec.rs`.**
- **Stale:** `protocol/skp/src/v0/codec.rs:15-16 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:90d4dd0e88c5f69ba4eb404181df0d55f77b47b65389b6de6f3c03f98372ef61`.
- **Facts:** `protocol/skp/src/v0/codec.rs:69-77 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:a303c98412709a846406007b98d4499905420dc45e2412fa35322c81c338c5b5`, and S5b's no-call-site script.
- **Says:**
  - Why a `HexF64` failed to decode, in two cases.
  - `HexF64`'s `Deserialize` turns either case into a serde error carrying this `Display` text.
  - No caller maps either case to an SKP code. The two codes are reserved and not produced at `skp/0.x` (SKP-V0.md §5).

**SX2 — `kernel/src/skp.rs`, the naming-rule cite.**
- **Stale:** `kernel/src/skp.rs:417-420 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:7f5f7302f31e600af4bf88f044323f2a0db96774b56a363c6277960abb42b387`. Recorded for this piece by `kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:338 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:5c30bd9399f324a0528396aecdc38368e52b0128bcc1cee7fc76c2569256225a`.
- **Facts:**
  - `docs/adr/ADR-016-stable-feature-identity-admission.md:180 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:8f94f2d6ca945be6f3d213b793e153c6724eb9a61a7a273271a4767684bac1e8`;
  - `docs/adr/ADR-016-stable-feature-identity-admission.md:238 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:8c5b637b3df21df6032500cb3794b772a1e2ead1e74aa81949556e88c5d0978c`. The accepted text is the draft's Proposed text block, which holds no block-on-sight items.
- **Worker first:** confirms that 433413a is on main, and reads the draft's block-on-sight 3 at 433413a.
- **Says:** the parenthetical names the rule's origin in words, as history: block-on-sight 3 of the draft amendment to ADR-016, `docs/adr/PROPOSED-amendment-to-ADR-016-identity-tier-model.md` at 433413a, deleted at acceptance. It never presents the rule as ADR-016 Amendment 1's accepted text.

### 2.4 Places outside the node that name the three codes

| Place | Decision | Why |
|---|---|---|
| `protocol/skp/src/v0/error.rs:153 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:34da61378698f6843225187d719e572c5e32675c6d8ec2bdfa65ac76305a8fe4` | out | test data for the envelope's default, not a statement of what a client receives; a test literal is outside the lane and the ruling |
| `protocol/skp/src/v0/codec.rs:15-16` (S5e) | OPEN-2 | a doc comment the ruling does not name |
| `protocol/skp/tests/conformance/fixtures/refusals-any-layer.json:129 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:e45d21f912e8474316f723163e3f0387383b481e45c1f2569fc908bcf10e0b9c` and `protocol/skp/tests/conformance/fixtures/refusals-any-layer.json:275 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:5971b37a27834065392e85637f6e03e6ecca4c652dd10fde7307272ab6ecc243` (nine values by `git grep -c` at B: six `skp.malformed_hex_f64`, three `skp.bbox_not_finite`) | out (no fixture change); disclosed by S12 (iii); OPEN-1 | the field is defined at `protocol/skp/tests/conformance/README.md:15-16 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:7393ec676f404435459dc38edffb2f93adbf0c8ce26ced0ccb9545cfb2c9bb2a` and read by nothing |
| `protocol/skp/tests/conformance/AMBIGUITIES.md:11 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:047e057406eb77757e80389d63b08f89a5f5fae00e991233659d14bab9a594b3` (A3) and `protocol/skp/tests/conformance/AMBIGUITIES.md:16 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:19e2f5411fae8c034932d26ca036e489409c96a460140d00a56684b69e2c94e0` (A8) | out; named by S12 (iii) | a phase-1 record of the spec at bb98f71, recorded and not resolved (`protocol/skp/tests/conformance/AMBIGUITIES.md:3-5 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:1eaffa520d67c7368b0e0bfd7b446044bfe7d01c922e535c3bc61045ccd00cfa`); its consequence column stays true |
| `frontends/shell/CANCELLATION-FACTS.md` | out | a cut record, already consistent |

**Already current, no change:**
- finding 2 (`protocol/skp/SKP-V0.md:485-492 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:51b7de7fb18bdc9bda4c729910ce143d63b2e068d895efebf79d171c4facda47`);
- §3's two-rules lead (`protocol/skp/SKP-V0.md:164 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:90e4f3e85539264f19081b273f7ad38093a2dfa04d8687bb14ba10b8fb3cb518`), with the third rule stated beside it at 175.

**Observed, not in scope, for the custodian to route:** `protocol/skp/src/v0/commands.rs:199-200 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:7e2236a1ef68ec62f373e5c041338f4720fb5f2b9fbed0d0474c5cc06cbb159d` calls ADR-016 Amendment 1 PROPOSED, but it is Accepted.

### 2.5 In place, or appended

- **Edited in place:** current-state text, which is SKP-V0.md §§1–5, §9.5's heading and the doc comments.
- **Added as dated notes:** §7.1 and §9.1, each beneath its existing text.
- **§8 is append-only.** The S12 note is the only §8 change. Append-only is proved against B: §8's text from its heading through the covering note's last line is byte-identical at H.

### 2.6 Owner's-index update

lead-data writes it before the final gate (the pilot's §1 item 2), and the worker applies it in this PR.
- **`kernel/README.md`, Governed by:** the line listing the kernel halves of pieces filed elsewhere gains this form (`kernel/README.md:378 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:10e65310f1116a8295a351ca27459f69acbb25728a83e02e5858060e02958484`, read again at B after piece d).
- **lead-data checks three pointers against H:**
  - SKP v0 host (`kernel/README.md:352 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:0b8dfdc4cdb5eed74f9399e54e4ab8b6cc098c88dfaf83e832c1daa8cd9d3100`);
  - stream tickets (`kernel/README.md:353 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:ce520a79ff0ab9d12d02d581eec36c57009ef2c675e4e401417eaf7fd0192d1b`);
  - wire error codes (`kernel/README.md:359 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:11ef820f7ca22420707389b165a0eb59bb1ce11555b3094d557f85c94b623542`).

  None is expected to change.
- **`engine/README.md`:** no change, since no engine file is touched.
- **`protocol/`** has no owner's index, and this piece creates none. Its absence is reported to the custodian.
- **Last verified at:** the line is untouched unless lead-data re-checks every pointer in the section.

### 2.7 Overlap (rule 00) and wait

- **Paths:**
  - `protocol/skp/SKP-V0.md`, `protocol/skp/src/v0/error.rs` and `protocol/skp/src/v0/handles.rs`, under `protocol/`;
  - `protocol/skp/src/v0/codec.rs` under OPEN-2, also under `protocol/`;
  - `kernel/src/skp.rs`, `frontends/shell/src/skp/types.ts` and `kernel/README.md`;
  - this form, under `protocol/`;
  - `PLAN.yaml`.
- **Code waits for piece d to merge** (PLAN `depends_on`). Piece d itself waits on #205 and #206, so #206's `protocol/skp/tests/data/v0-error-example.json` is on main before B.
- **The branch is cut from main after piece d.** `kernel/README.md` is shared with piece d only in sequence.
- **At dispatch:** no other piece in progress and no PR awaiting merge touches `protocol/` (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:27 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:d82e28ea8f74d57fac226d72ca7b7af95c0ee37f2452a8a03f3f454ce671cd0b`). Rule 00 is re-checked for every path above against both slots and every PR awaiting merge.

### 2.8 Portability (R1-R6)

- No OS-dependent feature is added or changed, so R3's section does not apply.
- No rewrite states a platform behaviour. S4 names the engine's refusals only, not its Windows prefix handling.
- No platform level is claimed (R5). The Tauri statements rest on code, not on a run.

## §3. Fixtures

None changed. No file under `protocol/skp/tests/`, `frontends/shell/src/skp/__tests__/` or `protocol/data-plane/` changes.

## §4. Tests, and the mutation per new test

- **No new test,** no assertion change and no rename.
- **No mutation is owed.** No record of this piece calls any run, a `verify-mutation` run included, an observation of a mutation.
- **Run by name at H:**
  - every test named in §2;
  - `cargo test -p spatial-skp --test fixtures` and `--test conformance`;
  - `frontends/shell/src/skp/__tests__/fixtures.test.ts` (both fixture loaders).

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predictions:**
  - **E1.** Every changed line in a `.rs` or `.ts` file is a comment line. The `error.rs` diff is `///` insertions only, directly above the three constructors.
  - **E2.** `cargo test -p spatial-skp -- --list` and `cargo test -p spatial-kernel -- --list` are identical at B and H.
  - **E3.** The §4 runs pass.
  - **E4.** `cargo doc --no-deps -p spatial-skp -p spatial-kernel` warnings at H are a subset of those at B.
  - **E5.** `cargo fmt --all -- --check` exits 0, and the shell's lint and format checks pass as CI runs them.
  - **E6.** At H, each named with its commit: `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs` exit 0; `queue.mjs --check` and `site.mjs --check` report current; the `node --test` scripts suites exit 0.
  - **E7.** `git diff --quiet B H -- protocol/skp/tests protocol/skp/src/v0/mod.rs protocol/skp/src/v0/commands.rs protocol/data-plane frontends/shell/src/skp/__tests__` exits 0, and `types.ts` line 15 is identical.
  - **E8.** The 2.5 byte check holds.
  - **E9.** Outside §8 at H, each of the three codes appears in SKP-V0.md exactly once, on §5's reserved line. This is checked by script, with the pattern self-tested positive.
  - **E10.** PR CI is green.
- **Declared unchanged:**
  - every code token, assertion, literal, fixture and test name;
  - all ADR files, `KNOWN-LIMITATIONS.md` and `engine/**`;
  - `protocol/skp/src/v0/error.rs` outside the three insertions.
- **Invalidators (stop and report):**
  - a pinned fact that changed at B, as opposed to a moved line;
  - a rewrite that would need a code, literal or fixture change;
  - a fact with no pin;
  - exposure text that ADR-017 does not carry;
  - a `DescribeResponse` member at B that the block lacks, beyond the four;
  - for SX2 only: 433413a is not on main, or its block-on-sight 3 is not this rule.
- **Falsified if** any rewritten sentence is shown untrue at B.

## §6. Instruments

Assertions only (E1 to E10). No measurement.

## §7. Declared values and ceilings

- **Counting.** Count with `git diff --numstat B...H -- <path>`, insertions plus deletions. B and H are named in the PR body. The form and PLAN.yaml are outside the line count and inside the file count.
- **Per-file ceilings:**
  - `protocol/skp/SKP-V0.md` 130
  - `protocol/skp/src/v0/error.rs` 9, insertions only
  - `protocol/skp/src/v0/handles.rs` 24
  - `kernel/src/skp.rs` 6
  - `frontends/shell/src/skp/types.ts` 8
  - `kernel/README.md` 2
- **OPEN-2 additions,** applied only on the answer: `protocol/skp/src/v0/codec.rs` 8; `kernel/src/skp.rs` +10.
- **Totals:** at most 180 lines and 8 files; with OPEN-2 (a), at most 200 lines and 9 files.
- **No constant is added.**
- **An overrun is class 8,** and this section is never edited.

## §8. Block-on-sight

1. A changed non-comment line in any `.rs` or `.ts` file.
2. Any literal, fixture, assertion, test name or string the app shows changes.
3. In `error.rs`, anything but `///` insertions directly above the three constructors.
4. A path outside §7 changes.
5. A rewritten sentence that claims more than its pin shows. That includes Tauri's error text, an end-to-end test, a host finiteness check, a tested cancel-key `unknown`, a future typed refusal, or a reader of `expected_refusal_code`.
6. Exposure text beyond ADR-017's 2026-08-17 completion section and the paragraph above it. This is red-line text and never documentation-only.
7. An accepted ADR called Proposed in a touched line, or a Proposed ADR called accepted or binding. A draft's block-on-sight item presented as accepted text.
8. Any edit to an existing §8 line, the preamble included, or the S12 note placed anywhere but after the covering note.
9. A version entry added to §8, or the change described as a version bump.
10. Any of these: a new bare `path:line` in SKP-V0.md or a comment, a pin split across lines, or a pin at a branch commit.
11. A quotation not byte-copied, or a byte changed inside an existing quoted span.
12. Code before piece d has merged, or while another piece or open PR touches `protocol/`.
13. A conditional row applied before its answer.
14. A §7 overrun not recorded as class 8, or §7 edited.
15. A scope addition not recorded as class 9 before its code.
16. ADR-018 vocabulary used outside ADR-018's sense.

## §9. Gates

- **Architect (full gating).** Checks the principles; ADR-017's exposure text (red line); ADR-004 amendment 1's bit-pattern rule, which is kept; ADR status words; ADR-018 vocabulary; then §8, one item at a time.
- **Reviewer.** The full diff; E1 to E10; every rewritten sentence against its pin at B; the struct-by-struct describe check; the absence scripts of S3, S4 and S5b.
- **Verdicts follow product-first section 2.**
  - Correctness covers each sentence's truth: an unsupported claim of a guarantee or a limit is Correctness, never Documentation.
  - Evidence covers E1 to E10.
  - Documentation findings are fixed before the merge, with no re-gate.
- **Briefs** carry `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 58ec72aeacd1903c501faa1972e6f85bdc152a69 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1` for E2 to E5, and no other build rule.
- **Operator:** none. No walkthrough row and no sight.
- **KNOWN-LIMITATIONS:** no item is added or edited. None names `HexF64`, SKP-V0 or an SKP literal.
- **Budget:** 90 minutes, as the node records.

## §10. Amendments

Opens empty, append-only, classes 1 to 9.

### Amendment 1 — the human's rulings on OPEN-1 and OPEN-2, and one row added by the ruling (class 5)

*Written by the custodian on the human's ruling, before any code. References only.*

1. **The ruling** is the human's item 4 (state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:16 @ d8f2b800049be521177c394ffa4c272ab4dae82d sha256:aecb51d1a4f06b1bfdd25e7531312750bd0df38816e71be71b512cb506b4b875).
2. **OPEN-1 (a).**
   - The nine `expected_refusal_code` values stay unchanged. S12 (iii) discloses them.
   - The ruling also adds them to the named open item on `first-external-plugin-skp-client` (its PLAN record), so they are settled with the produce-or-not decision. That is a PLAN record, not a file of this piece.
3. **OPEN-2 (a).** Rows S5e (`codec.rs`) and SX2 (`kernel/src/skp.rs`) are in scope.
4. **Row SX3, added by the ruling.**
   - **Stale:** protocol/skp/src/v0/commands.rs:199-200 @ d8f2b800049be521177c394ffa4c272ab4dae82d sha256:7e2236a1ef68ec62f373e5c041338f4720fb5f2b9fbed0d0474c5cc06cbb159d. It calls ADR-016 Amendment 1 PROPOSED.
   - **Fact:** docs/adr/ADR-016-stable-feature-identity-admission.md:180 @ d8f2b800049be521177c394ffa4c272ab4dae82d sha256:8f94f2d6ca945be6f3d213b793e153c6724eb9a61a7a273271a4767684bac1e8.
   - **The rule for every corrected label in this piece** (SX2 and SX3): it states the amendment's status as the ADR records it.
   - The rewrite changes only those two comment lines.
5. **§7, by the ruling.** `protocol/skp/src/v0/commands.rs` gets a ceiling of 6, comment lines only. With OPEN-2 (a) and SX3, the totals are at most 206 lines and 10 files. §7's text is not edited; this item adds to it.
6. **E7, by the ruling.**
   - `protocol/skp/src/v0/commands.rs` leaves E7's `git diff --quiet` list.
   - In its place: `commands.rs`'s diff is lines 199-200 only, and every changed line is a comment line (E1).
7. **§8** stands as written. Items 1 and 4 read with SX3 and `commands.rs` in §7.
8. **Generation:** the node goes to 2.
9. **Superseded index:**
   - §2.3's "applied only on the answer" → item 3;
   - §2.4's "observed, not in scope" for `commands.rs:199-200` → item 4;
   - §5's E7 for `commands.rs` → item 6.

Nothing above is edited.

### Amendment 2 — the base's moved index lines (class 3)

*Written by the custodian before any code. References only.*

1. **The base** is main at 1457fbd0a09464c03082a2aea3df65dd1171bc95, after piece d (#209) merged. 101 of the form's code and document pins hash as written there.
2. **Moved or changed by piece d, in `kernel/README.md`** (B's tree is authoritative for each row):
   - SKP v0 host, §2.6: kernel/README.md:356 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:0b8dfdc4cdb5eed74f9399e54e4ab8b6cc098c88dfaf83e832c1daa8cd9d3100;
   - stream tickets, §2.6: kernel/README.md:357 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:cacca0107dd19214aeec4176e7ddaf21f3fc7d33d50a363e3654e6d74d82ec53. Piece d's row DK moved one test pointer into this line; it is still the stream tickets line;
   - wire error codes, §2.6: kernel/README.md:363 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:11ef820f7ca22420707389b165a0eb59bb1ce11555b3094d557f85c94b623542;
   - the kernel halves list, §2.6: kernel/README.md:382 @ 1457fbd0a09464c03082a2aea3df65dd1171bc95 sha256:10e65310f1116a8295a351ca27459f69acbb25728a83e02e5858060e02958484.
3. **Generation:** the node goes to 3.

Nothing above is edited.
