# kernel: publish refuses a session-tier identity in every scope, the manifest's identity caveat states what each tier's check was, and the reader's MAX_FEATURES ceiling is read against the rows a scope publishes — full preregistration

*Committed before any code. Append-only once committed; an amendment written after any outcome has been seen says so in its first line. PLAN node publish-session-tier-identity (U1), with export-refused-above-row-ceiling-every-scope (U10) riding: graded S1 by its reproducer (`state/consults/2026-11-05-publish-session-tier-identity-u1-reproducer-tester.md`) under the human's ruling of 2026-11-05 (evening), item 2 (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`): slot 1 ahead of order, the full form, both gates from dispatch. The form below is the architect's draft (`state/consults/2026-11-05-publish-session-tier-identity-full-form-architect-draft.md`, read only at main 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1; extracted sha256 bbc75a86b307e76ba918443e58bd6cb46e6291f5b6b46b833c84db6dfeb42ba3), carried byte for byte from its title through its section 9, then its OPEN items and its rule (00) table, with these changes, all the custodian's: each `@ C` the draft writes (72) written as the full commit, and each cite `path:line @ <commit>` expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (70 pins; 5 by a file name that resolves to one tracked path at that commit; 0 by a file name that resolves to more than one, kept as written; bare line numbers kept as written); one pronoun for the human in OPEN-2 written as `their`; this lead line added; the section 10 heading moved after the custodian's settlement, which is added. The draft's opening paragraph and what it could not settle stay in the filed draft. Every sentence about behaviour is the worker's, written after the code and checked by both gates under the human's Part 1, item 1 (`state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md`). Form path: `governance/forms/kernel/PUBLISH-SESSION-TIER-IDENTITY-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*


## Header

- **Authority:**
  - PLAN node `publish-session-tier-identity` (governance/PLAN.yaml:6481-6497 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:c1944542bb058459aae44e1032a14d4a264c32bdee117ee164b058efa95773fb), with `export-refused-above-row-ceiling-every-scope` riding in the same piece (:6515-6531): one form and one PR, and the riding node is set done in this node's done commit (:6530).
  - Graded S1 under the human's ruling of 2026-11-05 (evening), item 2: slot 1 ahead of order, the full form, U10 riding (state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md:14 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:9e6a02c1e8dc476f42e60069f9ced8569beb117950fb86a9b3b72743dac174bb). In my reading, "the full form" means both gates from dispatch.
  - The human's gate-round rulings of 2026-11-05, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:b7b9954b95c6a23808cc8a2fbacb8b6157335e23da53ccda20f4a35ba8e05e8a). Item 1 (:28-32) governs §2.6, item 3 (:38-42) and item 4 (:43-46) govern §9, and item 7 (:58-62) governs §4.
  - The triage readings, re-read here at C: U1 (state/consults/2026-11-05-area-e-kl-triage-undeclared-behaviours-architect.md:9-18 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:c9ad5d9a67b4f569240f7c9dc1b0b2925a0d53f6847d4c1cb9249b81cc44d7c6), U10 (:100-106), and item 3 (state/consults/2026-11-05-area-e-kl-triage-numbered-items-architect.md:11-21 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:91ea45f29a9a52a2379d1551678fb80d7093ab485c2b3d79e2aad1af7ec419a6).
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

1. **Evidence, not Authority: the U1 reproducer at 8b9193a1** (state/consults/2026-11-05-publish-session-tier-identity-u1-reproducer-tester.md @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1).
   - Opened through `Catalog::open_cancellable` with no assertion and no declared identity, a foreign-key-column fixture is on the session tier with `verified_rows` None (:48).
   - It published in both scopes (:49, :51).
   - Both manifests carry `id_source` `session-ordinal:file_row_number`, `id_uniqueness` `by-construction-within-generation`, and the fixed caveat whose first sentence says uniqueness was verified over this file at open (:50, :52).
   - Its route and its deviations from the shell's route are at :14-39. Its test file is untracked in `C:/dev/wt/u1r`. That makes it evidence and never Authority (round 14's untracked-Authority rule); the worker may start from it.
2. **The cloud audit is a draft and not Authority.** No claim here rests on it.
3. **Everything else is reading at C and was never run.** Two hypotheses, each decided by P-0 (§4):
   - **H-D:** a declared mapping onto the native `id` column with `skip_uniqueness_check` true opens as `mapped:id` with `declared-not-verified` and `verified_rows` None (engine/src/dataset.rs:1917-1928 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:2eb59a23d033b988c81ce09af7fe79c98d7fd868af4e79a9ec61839f5cbb02bc; engine/src/identity.rs:169-171 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:23fcde20087268598839c5f9acfabcf9d151cf7b5e9b2bed720c1300ef65ba55).
   - **H-BB:** a bbox exists over FX-BIG (§3) holding a known small row count, read from the fixture generator's layout.
4. **Read commit:** the reproducer ran at 8b9193a1, and this form reads C. The custodian confirms that `git diff --name-only 8b9193a1 2c72923e` over the Scope files is empty, or names what moved.
5. **No fixture-drive confound:** nothing is measured, and the 5 GB fixture is not read. FX-BIG is generated at MAX_FEATURES+1 rows (multi-GB with its bundle work), so the worker checks the disk floor before each heavy run.

## §1 What this preregistration may and may not claim

**May claim, once §4 is green on CI** (product-ci-rust.yml:194-197 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:d06209e30a3082d5514bd9d4b3873a329f21324eab4e0c444d370e1c2c377e27, :234; product-ci-shell.yml:217 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:411fccb786299e993e65ff409d90aa5d61362f6c0eaa425743b1866d4cfcfd49) and the two `#[ignore]`d tests have been run once by hand at the head on Windows:
- A dataset whose identity is the session tier is refused by `preflight_pinless`, before any pin, in both scopes. So `boundary::execute` refuses it before any destination, staging directory or audit record exists, and the shell's `prepare_with_progress` returns it as `Refused`, carrying its code.
- The manifest's `identity.caveat` no longer states that a verification ran when none did. The verified tier's caveat bytes are unchanged.
- Preflight predicts MAX_FEATURES only from a figure true of the rows the scope publishes. A Current-view publish over a verified file above the ceiling is no longer refused at preflight.
- In every scope, a publish whose streamed rows would exceed MAX_FEATURES is refused before the batch that crosses the ceiling is written. Staging is removed and nothing exists at the destination.

**May not claim:**
- any performance figure or docs/08 row;
- macOS or Linux behaviour of the `#[ignore]`d tests;
- `MAX_RESIDENT_BYTES` or `MAX_PARTITIONS` prediction (both unchanged, KNOWN-LIMITATIONS.md:90-94 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:396bcf1cbf8e55c03b32285267f1ffb24f04bdd397ceb90b4bab36445cc0400b);
- any stability of the session tier across opens.

**ADR readings, none amended:**
- **ADR-016 Amendment 1, item 1** (docs/adr/ADR-016-stable-feature-identity-admission.md:186-208 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:e80d72471b382a40e2052519a2386e1e2b59aa8d7071066826997baf3c591499). The generation is never published (:192-195), and the tier refuses to cross the open boundary (:201-205). The refusal implements that.
- **ADR-025's Decision** (docs/adr/ADR-025-publish-above-the-readers-ceilings.md:70-74 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:b6e6f8baba2f997544cc0a9f30f34fd58f6e8e0cd22b324c4b3567b2417df55a; the ruling is entry 53 / B3). It refuses at preflight when the preflight can predict that the artifact exceeds a ceiling. A whole-file count is not a prediction of a bbox scope's artifact, so the U10 change brings the code to the Decision's own condition. The write-time refusal covers what preflight cannot predict, where the Decision is silent (OPEN-2).
- **ADR-017:** the caveat is free prose whose wording ADR-017 does not fix (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:85-89 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:ef7cd8db1d98ae72f81802f55c8e051d198852c473fce91073fafe1edc6e47e6). It is a caveat naming what is not established (:194). No member, key or `bundle_version` changes.
- **ADR-006:** class 3 and its approval are unchanged. A preflight refusal creates nothing. The write-time refusal follows the declared recovery policy `none` (kernel/src/publish/mod.rs:63-67 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:92f494660e305996462c9eda7704e8c8af5c50c9e466e0b7e606fc04961fb35b).

**Principles:**
- 01 principle 8 (docs/01_Principles.md:14 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:1a1760f2db0ba0fe74371deccc518ae610b6c944684482ca20a8cd6000bbba9d) and principle 3's no-unhonoured-claim clause (:9). A published manifest states a verification that never ran.
- The shell shows the engine's describe statement that a session identity is never published (engine/src/identity.rs:149-153 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:28a68b00bbb25d41a8db11f43758147c37b773871174c1d6f1f200e059d56e8a, carried at kernel/src/skp.rs:2023-2026 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:f3a58174c8a6a0ab76f2f67475911ace2116b49f6ff7067c04be260f773d1bef). That statement is false at C, and this piece makes it true.

**Wire:** no SKP code, field or literal, and nothing under `protocol/`. A new `publish.*` code rides `refusal_detail`'s existing string, which is not a wire change, and the shell's parser reads any `publish.*` prefix (protocol/skp/SKP-V0.md:786-798 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:e39c44a25e32991c9c4dea39f40934576e9dc60217dc731577acf41ead9001ec).

**Strings:** one new shown string, the session refusal's Display, as a P6 placeholder (OPEN-4). No other shown string changes (OPEN-6 (i)). The new caveat sentences are reachable only on routes no ordinary use takes (OPEN-7).

**Portability:** not an OS-dependent feature, so no R3 item.

## §2 The change, stated before it is applied

### 2.1 U1: the session tier is refused at preflight (kernel)

- **Place.** A new check in `preflight_pinless_parts` (kernel/src/publish/mod.rs:457-566 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:925b6fd364bd539b3937054fe774e9741f013f706343a692a1d07b484832b32c), directly after the geometry-encoding check (:497-504) and before `dataset_logical_uri` (:505).
  - It reads only the admitted identity record: `ds.identity().source().is_session_ordinal()` (engine/src/identity.rs:103-105 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:e0726e4b736bda5cd6a3f91d85b43f3ef40fdbb5e56f921d555c26c8d8e03a85). No IO.
  - Precedence: the row-filter gate, the degrees check and the encoding check still refuse first.
- **Variant.** A new `PublishError` variant (proposed name `SessionIdentityNotPublishable`; proposed code `publish.session_identity_not_publishable`), named in:
  - `code()` (kernel/src/publish/error.rs:260-292 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:43c6c7a0dc5bd26fc89caff375f183483d7d11f83132e5e06610ea34260d82e9; no wildcard arm);
  - `Display`, as a `[P6 placeholder] ` string (OPEN-4; the precedent is :414-420);
  - `boundary.rs`'s `error_kind` (kernel/src/permission/boundary.rs:223-248 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:71b2a00f7d4ccdeda27d7bcfbd27f238f34cf654114348cf7a8730ec9626ad32) and `publish_outcome` as `Refused` (:281-313).
- **Routes covered.**
  - Every route to a bundle runs `preflight_pinless_parts`: `preflight` (kernel/src/publish/mod.rs:584-604 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:1e99bc03bff3d7b2434947db165cc5da8ec870ab91e9f91aab28609d5278cc88), `publish_unguarded` (:611-618), `boundary::execute` (kernel/src/permission/boundary.rs:324 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:52f3e29848497069d6ac3d5e65f6e3141d24caa0ce72d7e753090aa9bafbd94f), the shell's `prepare_with_progress` (frontends/shell/src-tauri/src/publish.rs:424-432 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:d599a70c1dd0b79033a54bd851f726d53977da71701a13ab2c81e2d0ceb1d1a2) and the CLI (kernel/src/bin/publish-bundle.rs:527 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:81230661f8fd4d4b768aacd5ae956d403a7de234cccf9c22c3bdacd16b71c88b, through the boundary).
  - Both scopes, since the check never reads the query.

### 2.2 The caveat states what each tier's check was (kernel)

- `identity_caveat` (kernel/src/publish/mod.rs:1444-1448 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:6c92317c346ee9e54a31ecc1cc9b1961c829b37eabb12bb643abdb332f0f62bf) becomes a function of `identity.uniqueness()` (engine/src/identity.rs:114-130 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:32dc540b7fae5423ecc6b7f264a3c86f15cae95bd2dd5a4a762e7b77b546557a).
- **`VerifiedAtOpenFullFile`:** the current bytes, unchanged.
- **`DeclaredNotVerified`:** a sentence that claims no verification. The tier is reachable only through the engine API: the wire has no skip field (kernel/src/skp.rs:1726-1735 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:65cb07479333c394b720b43122b39982f38fad5c894c2471bcba08df6b59a485), and no product code sets it (a grep of `*.rs` at C finds it set only in tests).
- **`ByConstructionWithinGeneration`:** a sentence true of that tier. After §2.1 no route reaches it, but the function stays total and never panics.
- This is the sibling of U1's false caveat, fixed here under Part 1, item 4's sibling rule (:46).

### 2.3 U10: the preflight prediction is the scope's (kernel)

- A `pub(crate)` pure helper in `kernel/src/publish/ceilings.rs` (proposed name `predicted_features(verified_rows, &ViewportQuery) -> Option<u64>`):
  - `Some(min(verified_rows, limit))` when the query has no bbox;
  - `None` when it has a bbox or `verified_rows` is None.
  - The filter is already refused before this point (kernel/src/publish/mod.rs:465-467 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:d6323accacf61f2c15a28f184992b6a6cd5e6c2a05cc56efa0f9ca0ef7b7c602).
- Its one caller is the existing `check_reader_ceilings` call, which today passes `verified_rows()` for every scope (:553-557). `check_reader_ceilings` itself is unchanged (kernel/src/publish/ceilings.rs:133-157 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:daf60765c0498b47912573fb08daeaba5709d609d8b249c9bdddd1fab1297271).
- `limit` is included because the CLI carries `--limit` (kernel/src/bin/publish-bundle.rs:17 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:449ae85099beb28e137ca8a4363469c36d62f28d2a84815c990047b5056f01c2, :306-310). This is the same defect class reached through another field.

### 2.4 U10: the write-time MAX_FEATURES guard (kernel)

- A `pub(crate)` pure helper in `ceilings.rs` (proposed name `check_streamed_features(rows_written, batch_rows, &ReaderCeilings)`).
  - It refuses when `rows_written + batch_rows > max_features`, which matches the viewer's `>` (renderer/bundle-viewer/src/main.ts:489 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:2eaf4af892d1f6d67c8352cbd6757b021ca5d6c5d3cdea0e4ab94d7ae82c36f7).
  - The refusal is the existing `PublishError::CeilingExceeded { ceiling: "MAX_FEATURES", limit, saw }` (kernel/src/publish/error.rs:199-204 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:6db19b4c078a233fa6cf62f4e50446a4bd7468760d14a88590d8c481d4f40d12, Display :428-431). OPEN-6 (i).
- Its caller is `run_inner`'s partition loop, after the `MAX_PUBLISH_PARTITIONS` check and before `write_partition` (kernel/src/publish/mod.rs:803-812 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:2d889af26a3e44f490e73a8fabc87359fb691f49ba9dac30fc8b8685444d4f6b), with the ceilings read once before the loop.
- The existing failure path removes staging (:640-658), and the boundary records `CeilingExceeded` as `Refused` (kernel/src/permission/boundary.rs:304 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:5763a727d50b07cdd2f100478af448ab941c7e561deb2c52ea7816ef0ceb7086). The boundary needs no change for this.
- This closes the `DeclaredNotVerified` bypass the code names (kernel/src/publish/ceilings.rs:114-119 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:52336226072d510be32030f5d33f9787da2ee107ac7f620e83c2fca008e45475) and covers the bbox scopes §2.3 stops predicting.

### 2.5 The shell (phase 2)

- No product code changes in the shell.
- S-U1 (§4) proves the code arrives at the shell's real boundary.
- One doc sentence (§2.6, place 7) changes.

### 2.6 Sentences about behaviour: places, not words (Part 1, item 1)

The worker writes each sentence from the built code, and both gates check it clause by clause. None is drafted here. The places, each with what it must cover:

1. **The new variant's doc and Display** (error.rs).
   - Doc: where it is raised, its no-audit-record shape, and its governing cite (ADR-016 Amendment 1, item 1).
   - Display: the identity fact (this dataset's features are identified by position for this open only) and the format fact (a bundle carries ids beyond the open).
   - The Display must not advise declaring an identity column. The app offers no way to do that for such a file (KNOWN-LIMITATIONS.md:70 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:db65b22f2d1b9feab39c447cfaca4fdceff706f4a04f1dd318959f1827afca2a).
2. **`ReaderCeilingExceeded`'s doc** (kernel/src/publish/error.rs:212-216 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:92660373e6870b9e4517ab8112c5846cad9da3e20ae40f38999af1c0819d2ad8). It calls `CeilingExceeded` the operation's own write-time limit, `MAX_PUBLISH_PARTITIONS`, which is no longer the whole of it.
3. **`ceilings.rs`'s doc on `check_reader_ceilings`** (kernel/src/publish/ceilings.rs:100-132 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:027e9ee2acdb202af0358a957695358da2d10cc5b2287ff611d14f896c3201b5), its residual at :114-119 especially, plus the two new helpers' docs.
4. **`mod.rs`:**
   - the order of operations (kernel/src/publish/mod.rs:46-49 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:3a0f6054e6bc10003e42f20216b37750d16c47433437ea7e2a20dc84c1e227b5, :56);
   - `preflight_pinless`'s "one case" doc (:398-415);
   - the ceiling comment (:534-552);
   - the new check's comment, the caveat's comment and the guard's comment.
5. **`boundary.rs`'s list of preflight refusals with no audit record** (kernel/src/permission/boundary.rs:51-66 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:41fb99aa1294cba625f88c0ae344ce6a671952e4ed0818a50edc5e86765547f2).
6. **`is_session_ordinal`'s list of the sites that ask it** (engine/src/identity.rs:100-102 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:396896e90cb8b2e1b4af4c2a38aaf874c348714f9574ef7b44a392821a1dd983). Publish becomes a third site.
7. **Phase 2:** the shell's "one case this ordering cannot help" (frontends/shell/src-tauri/src/publish.rs:385-387 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:2b15b70cdfa51325fc69130b0b1a3b7e0f7c7c563236abd717de51cdcd49e11a). With §2.3 there are two cases: an unverified tier, and a bbox scope over a file above the ceiling.
8. **KNOWN-LIMITATIONS.md items 5 and 6 and their source comments** (KNOWN-LIMITATIONS.md:79-88 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:640d3e4097d635ff56c6e95caa6354796d537ddab883b6cbbc6bc6a82456e4d9, :90-94). This is OPEN-5, a red line. The words must cover:
   - whole-file refused at preflight (unchanged);
   - Current view refused only if its own rows exceed the ceiling, while the rows are written, with nothing left at the destination;
   - the write-time check in item 6's list.
9. **The owner's index:** this form joins kernel/README.md's list of preregistrations (kernel/README.md:387 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:3f0b4851d36990373f3628284fb1177d4e910c64b75e531c8b54ed7c1f4d71af). OPEN-9.
10. **Each new test's doc,** with its `RECORDED MUTATION:` line.

Item 3 of KNOWN-LIMITATIONS (KNOWN-LIMITATIONS.md:70 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:db65b22f2d1b9feab39c447cfaca4fdceff706f4a04f1dd318959f1827afca2a) and the engine's statement (engine/src/identity.rs:149-153 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:28a68b00bbb25d41a8db11f43758147c37b773871174c1d6f1f200e059d56e8a) become true and do not change.

### 2.7 Not changed

- `ceilings.json` and its pinned hash (kernel/src/publish/ceilings.rs:181-182 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:f5c3da4b106326ea36065c4eacf91b3314f9caebd7cd411125e8675c71cea1e5), every `MAX_*` value, `VIEWPORT_BBOX_ALTERNATIVE` (:96-98), and `ReaderCeilingExceeded`'s Display (kernel/src/publish/error.rs:432-438 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:9a7bb3d22f642e9f8974cbea5d58937d37b544cd484ff229c171814170ab7f4f).
- The `MAX_PUBLISH_PARTITIONS` check, every other refusal and its order, and the manifest's members and key order.
- `PublishRequest`, `prepare`'s and `prepare_with_progress`'s signatures, `PublishPromptData`, and commands.rs.
- No `pub` item is added; the helpers are `pub(crate)`.
- No change to `protocol/`, `renderer/`, `frontends/shell/src/`, Cargo.toml, Cargo.lock or `.github/`.

## §3 Fixtures, outcomes predicted before code

| ID | Spec | Opened by |
|---|---|---|
| FX-S | 200 features, `CategoricalZone`, `DeclaredLv95`, `ForeignKeyColumn` (the reproducer's, report :42-43) | `Catalog::open_cancellable(_, _, None, None, _)` (kernel/src/lib.rs:218-235 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:e0768faecf854f9370f48a60b0f11a6d2c30f21ef846b3073a2b32ff6dd279da) |
| FX-V | 50 features, `NativeUnique`, `CategoricalZone`, `DeclaredLv95` | same |
| FX-D | FX-V's file | same, with a declared mapping onto `id`, skip true (H-D) |
| FX-BIG | MAX_FEATURES+1 features, `avg_vertices` 3, `hole_every` 0, `NativeUnique`, `CategoricalZone`, `DeclaredLv95`, **with** the covering bbox (a bbox query needs it: engine/src/error.rs:103 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:a91a2c2b2c5676bd3aec214a373aae4c40b2f5e030d8580bd48f141ada23de9f) | `Catalog::open_cancellable` |
| FX-BIG-D | FX-BIG's file | as FX-D |

| Row | Route | Base (C) | Head |
|---|---|---|---|
| R1 | FX-S, `preflight_pinless`, whole file and bbox | Ok (observed at 8b9193a1 through to publish) | refused, the new code, `content_pin()` None |
| R2 | FX-S pinned, `boundary::execute`, both scopes | published (observed, report :49, :51) | refused, no destination, no audit file created |
| R3 | FX-S, shell `prepare_with_progress`, `WholeFile` and `ViewportBbox` | a prompt (reading) | `Refused`, message prefixed with the new code; no pin, no pending attempt, no destination |
| R4 | FX-V, publish whole file | caveat = the current bytes | byte-identical |
| R5 | FX-D, publish whole file | caveat says uniqueness was verified at open (reading, kernel/src/publish/mod.rs:1444 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:c4d3ec3b5240a8dab28fa18f1fc2e86e636ba3042245e13513acd31b07885c64) | the caveat contains no claim that a verification ran |
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

**Phase 2** (shell, in publish.rs's tests, beside the K-5 precedent at frontends/shell/src-tauri/src/publish.rs:2808-2889 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:d37b21557a6cb6d0e0e26541fb942ae395890b0dcdc02a830cc774c25006de0e):
- **S-U1:** R3, through `prepare_with_progress`, both scopes.
- **M-2:** the session check moved out of `preflight_pinless_parts` into `preflight`, after the pin is required. Predicted to fail S-U1 by name at the no-pin assertion.

**How each mutation is observed:** applied alone, the named test run, its failure recorded by name with the 40-hex commit in a `RECORDED MUTATION:` line, then reverted. A `verify-mutation` run is not an observation (docs/PREREGISTRATION-TEMPLATE.md:172 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:316062ef43090b93187b8410a97bdd9d3424fa747dd09f4cafe84906622e88c2). A mutation that passes, or fails anywhere else, is a stop.

**Determinism and CI:**
- No sleep, retry or timeout in any test.
- K-U1, K-CAV, U-PRED and U-GUARD run in `cargo test --workspace --locked` on both L1 entries, and S-U1 in product-ci-shell's cargo step (product-ci-shell.yml:217 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:411fccb786299e993e65ff409d90aa5d61362f6c0eaa425743b1866d4cfcfd49).
- K-U10a and K-U10b are listed, not run, by CI (product-ci-rust.yml:240 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:b12bdf5346649f3ae7b1f7e0bfe755a8a9b402d08bba8a996bfa5fc36a891940). Each runs once by hand at the head on Windows, with `--release -- --ignored`, inside a shared hold, and the record says so.

**Existing tests that stay green, unloosened** (the ignored ones run once at the head):
- in kernel/tests/publish.rs @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1:
  - `a_preflight_within_the_readers_feature_ceiling_is_unchanged` (:625)
  - `preflight_pinless_succeeds_on_an_unpinned_small_dataset_and_never_touches_the_pin` (:645)
  - `a_dataset_whose_verified_row_count_exceeds_max_features_refuses_at_preflight_before_any_write` (:670)
  - `a_dataset_whose_verified_row_count_exceeds_max_features_refuses_before_any_hash_is_taken` (:740)
  - `the_manifest_carries_the_docs_11_resource_refs_the_grade_and_the_transform_fact` (:888, its caveat assertion at :933-936)
  - `publishing_twice_from_identical_inputs_gives_a_byte_identical_manifest` (:284)
- `an_adr_025_reader_ceiling_refusal_at_preflight_produces_no_audit_record` (kernel/tests/permission_boundary.rs:1059 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:ed7b41af40f4b59c2eaed0bba3b02265c2717b2503a254e01d1b454cc714fcd2);
- the five unit tests in kernel/src/publish/ceilings.rs:165-241 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:8d41ea5236939dfd7a536e62776ff57d6cbc2c83e7ce9e72026aca04b347f861.

## §5 Predictions, declared unchanged, invalidators, falsification

- **Predictions:** §3's rows, M-1 to M-7 as §4 says, and every suite green.
- **Declared unchanged:**
  - §2.7;
  - §4's existing list;
  - MANUAL-WALKTHROUGH M10's whole-dataset refusal (frontends/shell/MANUAL-WALKTHROUGH.md:884 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:7e76791af084b3e942241d7ac7e3aa88f1541536a07c8cfc2a35aaa74ec3f6b9);
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
- **Constants:** none added or changed. `MAX_FEATURES` stays 2,000,000 (ceilings.rs:168 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:a40921f30857fa023f724432a245c38f8a956256ce5ffc9545401dee08a06cb2).
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
  - But it needs a new engine count API, IO inside `preflight_pinless`, which `preflight` re-runs at three sites (frontends/shell/src-tauri/src/publish.rs:379-383 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:f1c7f21aa61246f0c15cb72c8e67784b517f425773e0945d201e7691471ab24e, :550; kernel/src/permission/boundary.rs:324 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:52f3e29848497069d6ac3d5e65f6e3141d24caa0ce72d7e753090aa9bafbd94f), principle 7's cancel and progress for the count, and an unmeasured docs/08 cost.
- (C) Keep the behaviour and rewrite item 5.
  - **Red line:** the alternative the refusal names is the human's ruling (entry 53 / B3), and it would stay unusable. That is a scope change to a ruled item.
- (D) The scope's prediction only, with no guard.
  - It reopens ADR-025's dead-artifact gap for a large view.
- **Recommend (A).** It needs no ADR note. If the human wants the write-time refusal recorded on ADR-025, that is an appended note in their words.

**OPEN-3. Sequencing with U12** (it holds frontends/shell/src-tauri/src/publish.rs: governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md:9 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:7db805e33209edc27df806338379af29b0a8c9ea9fe76cfab49d0e5b5bc1915f).
- (A) The two phases on one branch. Phase 1 starts at dispatch, and phase 2 after U12 merges. Gates go after phase 2.
- (B) Dispatch the whole piece after U12 merges.
- (C) A kernel-only piece, with S-U1 as a follow-up node. This leaves the shell boundary unproven for this code, against item 7's "where the kernel test cannot reach it".
- **Recommend (A).** It keeps slot 1 moving, and the phases collapse if U12 merges first. Not a red line.

**OPEN-4. The refusal string.** **Red line** (P6).
- (A) A `[P6 placeholder] ` prefix, facts only, written by the worker from the code. The human words it at the sitting.
- (B) Unmarked.
- **Recommend (A)**, on the precedent at kernel/src/publish/error.rs:414-420 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:c6cd6b56482eef04fbf5b3fe5e1e40bf307ab958f8537f51d6483b9fa72ea4f2.

**OPEN-5. KNOWN-LIMITATIONS items 5 and 6.** **Red line** (release-facing).
- (a) In this PR, under Part 1, item 1: written from the code, checked by both gates, approved or replaced by the human at the click.
- (b) Defer. From the merge, item 5's lead sentence would be untrue for a Current-view publish over the ceiling, which is a Correctness finding.
- **Recommend (a).** Neither item belongs to a docs-lane node (governance/PLAN.yaml:6462 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:5abbb7ceb210f63fe785b23f298c7488dda5fbc8f7d4965489523681ac59f5f9, :6479).

**OPEN-6. The write-time refusal's form.**
- (i) The existing `CeilingExceeded`: its Display, its audit kind and its `Refused` outcome. No new string.
- (ii) A new variant naming a smaller view, which would be a new P6 string and a red line.
- **Recommend (i).** Not a red line.

**OPEN-7. The caveat for the unverified tiers.**
- (a) Per `IdUniqueness`, with the verified tier's bytes kept.
  - The two new sentences are not P6: no ordinary-use route reaches either.
  - The viewer shows the caveat (renderer/bundle-viewer/src/main.ts:310 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:f695f56db536c6b16cbe0b1deadd03fc229207f9d7ce921212d207e6da7b4c12). That is named here and recorded in the source comment.
- (b) Also refuse `DeclaredNotVerified` at publish. No ruling asks for it.
- **Recommend (a).** Not a red line: ADR-017 does not fix the caveat's wording (:85-89).

**OPEN-8. Operator rows.**
- (a) None in this piece. The custodian records two proposed rows on the node for the next sitting: exporting a session-tier file is refused, and Current view on a file above 2,000,000 rows publishes.
- (b) Rows in MANUAL-WALKTHROUGH in this PR. That adds a file in contact with U12's Part G and the area-B sweep.
- **Recommend (a).**

**OPEN-9. The owner's index** (kernel/README.md:387 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:3f0b4851d36990373f3628284fb1177d4e910c64b75e531c8b54ed7c1f4d71af).
- (a) This form joins the list in this PR.
- (b) Later.
- **Recommend (a)**, the precedent of 8c's OPEN-4. Not a red line.

# Rule (00), path by path (governance/AUTONOMY.md:609 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0)

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
  - 1c edits `kernel/src/lib.rs`, where `Catalog::open_cancellable` lives (kernel/src/lib.rs:218-235 @ 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1 sha256:e0768faecf854f9370f48a60b0f11a6d2c30f21ef846b3073a2b32ff6dd279da), which the new tests call. If 1c merges first, the tests follow its signature.
  - 1c's `renderer/src/canonical.rs` serialises the manifest. This piece adds no member.
- **Nothing in this piece touches protocol/.**
- **The custodian runs `git diff --name-only origin/main...cut/port-2-macos-l1-and-app-dirs` at dispatch** over the four kernel files and kernel/README.md, because I cannot read branches.

## The custodian's settlement (class 1, before any code)

- **OPEN-1: (A)**, the session tier refused at `preflight_pinless` in every scope; **OPEN-2: (A)**, the scope's prediction and the write-time guard, no ADR note (a note on ADR-025, if the human wants one, is theirs); **OPEN-3: (A)**, two phases on one branch, phase 2 (`frontends/shell/src-tauri/src/publish.rs`) only after publish-filter-sentence-under-whole-dataset (U12) merges and main is merged into this branch, one phase if U12 merges before code starts, the gates after phase 2; **OPEN-6: (i)**; **OPEN-7: (a)**; **OPEN-8: (a)**, the two proposed rows recorded on the node for the next sitting; **OPEN-9: (a)**. Each taken on 2026-11-06 under item 4 of the human's direction of 2026-10-31 (`state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md`), extended to 2026-11-09 by the direction of 2026-11-03 (`state/directives/2026-11-03-away-until-11-09-276-open-1-seven-clauses-open-4-c-placed-sitting-wording-leaves-slot-cloud-credit.md`), each for the human's review on return.
- **OPEN-4: (A)**, a red line (a P6 string): the custodian's reading of the human's ruling on 8b's W-1 (the same directive, item 5: a P6 placeholder worded at the sitting) and the marked precedent the draft cites. The string carries the mark; its words are the human's at the sitting, and the reading is the human's to reverse at the click.
- **OPEN-5: (a)**, by the human's Part 1, item 1: KNOWN-LIMITATIONS items 5 and 6 written from the built code in this PR, checked clause by clause by both gates, the words the human's to approve or replace at the click.
- **§0 item 4, the read commit:** `git diff --name-only 8b9193a1 2c72923e9046daa373d112e8e8d2f0f5a73e4fb1` over the nine Scope paths of section 7 is empty.
- **Rule (00) at main c6ea9c9d6ac812dfa68628d48f90e20fb95ec142:** of the in-flight branches (`cut/b2-piece-1c-save-and-reopen`, `cut/port-2-macos-l1-and-app-dirs`, `cut/b1-shell-half-pr-c`, `cut/literal-only-float-integer-arithmetic-refused`, `cut/publish-filter-sentence-under-whole-dataset`, `cut/walkthrough-rows-stale-against-main-sweep-area-b`), only `cut/port-2-macos-l1-and-app-dirs` touches a Scope path, `KNOWN-LIMITATIONS.md`, in hunks at its lines 30, 32 and 400 (the platforms paragraph and item 43), not items 5 and 6 (KNOWN-LIMITATIONS items count as separate paths); U12's Scope holds `frontends/shell/src-tauri/src/publish.rs`, which phase 2 waits for, and KNOWN-LIMITATIONS item 8, not items 5 and 6; none touches protocol/. Contact, not overlap: 1c's `kernel/src/lib.rs` (`Catalog::open_cancellable`), which the new tests call.
- **The time:** the node's budget is revised by the custodian from the draft's reading.
- **The worker** starts from the reproducer's untracked test in `C:/dev/wt/u1r` (Evidence, not Authority) and checks the disk floor before each FX-BIG run.

## §10 Amendments (opens empty; append-only)
