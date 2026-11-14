*Custodian's filing note (2026-11-13): the architect's read-only form draft for `publish-approval-columns-line`, the human's item 4 (a) to (c) of 2026-11-12 (21:15Z), read at main c3b4899c, from its hand-back (37222 bytes, sha256 57bb2061baabe4ec83ea519699db933da319f9be089e55b2357cdce8fc4f6eab), below the rule. Each `sha256:<H>` is filled by script with the sha256 of the cited whole lines, each with its LF, at c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c (48 placeholders). A shorthand cite (`:N` or `…:N`) is resolved to the path the draft's own sentence gives it, by a map checked by script against the draft's text. Two placeholders follow more than one cite: publish.rs's four lines at :570, :583, :683 and :767, and PublishDialog.test.ts's two ranges; each is filled with one hash per cite, in the order cited, separated by commas. A final newline is added; nothing else is changed. The line's two forms the draft quotes, W-A and W-N, are byte-checked by script against the directive's line 20. Its brief by file (7935 bytes, sha256 d03cb10295efdaa26de8f05c8e65fd5a57a433f56030f9c3e386578ce658b05a); the run 02:26:44Z to 02:40:09Z by its transcript, 98 calls (Read 63, Grep 31, Glob 3, SubagentHandback 1), no write, no errored call, model claude-opus-5-5. Its OPEN-1 to OPEN-6 are red lines and wait for the human's words; OPEN-7 to OPEN-9 are not, and take its recommendations, dated 2026-11-13 (ruling 24). The form is committed at its path after the human's words. A reading and not Authority.*

---

Drafted: publish-approval-columns-line form

````
# shell: the publish approval names the columns a bundle publishes, in a line the host composes — full form (`docs/PREREGISTRATION-TEMPLATE.md`, the full form)

*Drafted by the architect agent on the custodian's brief (tag `node:publish-approval-columns-line@form`), read only at main c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c. Committed before any code. Append-only once committed. An amendment written after any of this piece's tests, mutations or e2e runs has been seen says so in its first line and names what it touches or invalidates. PLAN node `publish-approval-columns-line` (`governance/PLAN.yaml:7178-7194` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:4a2a5a1aedea415886e808586080f101be21945115acaf9c6fe21cf592a2a5cc). Form path: `governance/forms/frontends/PUBLISH-APPROVAL-COLUMNS-LINE-PREREGISTRATION.md`. The custodian keeps the PLAN node on main.*

**Authority.**
- The human's third message of 2026-11-12 (21:15Z), item 4 (a) to (c): `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:19-21` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:06e53be572e57c47b74a86f1e276ba0573568ccda65af7e158c229a5070cda10. It rules option (A) of the consult as its own piece outside PR B, with (E) a later node; it gives the words of the line, the human's by approval and on the sitting's list; it places the piece at S2 in slot 2, straight after the S1 fix merges; the piece merges before PR B if rule (00) allows, and before v0.2's tag in any case.
- The same message, item 8 (slot 2's order): `…:35` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:55eda56a61c43653d89768668393f23cca6096c2d7af0228b902daeecbb6c4a8, the same path as above.
- Option (A) as the consult drafted it: `state/consults/2026-11-12-b1-shell-half-pr-b-publish-approval-colour-by-column-architect-consult.md:75-99` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:5cf2917e8407fe1f236b648b67d1bb24db37c744136d59196cd56346632eda54.
- Gating: the full form and both gates from dispatch (§9, with the reason there).

---

## §0. Disclosure

- **What informed this form.** My consult of 2026-11-12, which is option (A), its files, tests and records, and its four gate findings. Those findings go to the docs lane by item 4 (d) (directive `:22` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:94418eaaf57c2a7eee4b6e5b7f63afd7edeb3fdcf046c66cb5af00fb53bae8f9), so none of them is done here. The model shape is `governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md`.
- **No pilot, spike or corpus.** No run of any kind informs this form. Every line count below is my estimate and becomes a ceiling only in §7.
- **The reuse index** found no prior art on either search. Both are misses, and this form rests on the tree at c3b4899c alone. The custodian ran them in the read-only private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-13. Byte for byte from the brief:

```
$ node tools/reuse.mjs publish approval consent dialog column list
No prior art recorded for "publish approval consent dialog column list". Research it before planning an implementation.
rc=1
$ node tools/reuse.mjs export manifest schema attribute columns preview
No prior art recorded for "export manifest schema attribute columns preview". Research it before planning an implementation.
rc=1
```

- **Fixture drive.** No measurement is made against the 5 GB fixture, so no drive is named.
- **Every `path:line` is a read of main at c3b4899c.** The worker re-derives every cite it touches at its base (step S0).

## §1. What this preregistration may and may not claim

- **No performance claim** and no docs/08 row (§6).
- **No SKP, data-plane or MCP change.** Nothing under `protocol/`. The field is binding-local (`frontends/shell/src/publish/types.ts:5-10` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:8c716e61eded7a7b15a48c7d956f946740b5a2fe71eaa6699241246f62c5a924).
- **No change under `kernel/`, `engine/` or `renderer/`.** No dependency is added or changed, and no lockfile changes.
- **Nothing published changes.** The bundle's bytes, its manifest and the projection the kernel publishes are unchanged. What the operator is told before approving gains one line.
- **The class-3 approval is unchanged** (ADR-006): the grant, the typed phrase compared in Rust, the audit pair and the TTL.
- **No ADR status changes.** ADR-024 (Proposed) may gain one appended note, in the human's typed words only (OPEN-6). ADR-017 is cited and not amended.
- **The words are the human's** (§2.2). Every case they do not settle is an OPEN item for the human. The field name `published_columns` is binding-local and not shown, so it is not a P6 string.
- **No claim that ADR-017's exposure review or its completion is affected** (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1110-1142` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:ebd4f3020fc3cc6af2c699d77a915c17f0a87a9eca41e829ca64aa73a41dbb25). Whether a line added to the reviewed surface asks anything of that review is the human's question (gate finding G-7).
- **Portability (R3).** Not applicable. The change is not OS-dependent: a string composed in Rust and rendered by React.

## §2. The change — stated before it is applied

### 2.1 The shape (option (A), as ruled)

**Host (Rust), `frontends/shell/src-tauri/src/publish.rs`.**
- **The field.** `PublishPromptData` (`:266-304` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:a363659b21dbce19fe65d1e5e8ec8fd49acaddaf329b8be76da81f16b99b43e7) gains one field, `pub published_columns: String`, after `outcome_summary`. Its doc comment says three things:
  - where it is composed;
  - that it names `id`, the geometry and each attribute column the pending attempt publishes, in the request's declared order;
  - that the shipped build derives at most one attribute name (`style_attributes`, `:1271-1279` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:344ffb2c470af3efcb1b1b3f1bbf31992c7278d33ae7706e14cd2ea073530c4d), so the many-name case is reached only by the unit test U3 and by no ordinary use. Under the wording rule, this is the named unreachable case.
- **The composer.** A private `fn compose_published_columns(attributes: &[String]) -> String` sits beside `compose_outcome_summary` (`:315-328` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:7eacdf2b2e1c7c2788d16af291f06a06b21d7132342758dd77c2e08cf0f7f44a). It gives the human's no-attributes form when the slice is empty, and otherwise the with-attributes form with the names filled in (§2.2). It makes no new `pub` item. Its one product caller is `prepare_with_query`.
- **Where it is composed.** In `prepare_with_query` (`:551-696` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:d687d086e4380bcfc5b93917e6e4c86099df9c04d0edf2831dc0a6a6ebc25207), in the struct literal at `:657-670` (same pin), from the same `attributes` vector bound at `:565` (same pin). That vector is the one that:
  - goes into the request at `:570`;
  - passes `publish::preflight` at `:583`;
  - is stashed at `:683`;
  - is sent at execute at `:767` (all `frontends/shell/src-tauri/src/publish.rs` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:9752e41f8d7d0cec1c81179d9db550bb0bc62f784e77d1718fb3091ede67f823, sha256:9d36a0b7ab9f9064ae595c62b943e7304d2b2033690bcbd3c7b296dea55606f3, sha256:cc44d11d3e3893d12d34dbee530f0137a392236d017b5c21c82207b800d48c95, sha256:b1a8e40664b47996f8d42bc6695edbb731a69475cab0cf04f9916bf9e880e7aa, one hash per cited line).
  It is never composed from a second call to `style_attributes`, never from the vector at `:439`, and never from anything JS sends.
- **The stub.** The test-only `prompt_stub()` (`:2630-2645` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:802b50672623cce1268ba670bb6136b9f980fa1946536226b5a2096feb65c166) gains the field.

**Why the line names exactly what the kernel publishes.** A prompt exists only after preflight has passed (`:583`). Preflight resolves the projection from `req.attributes`:
- `kernel/src/publish/mod.rs:305-306` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:1513e0d8d81ab0d1a4b0876dc2a8d6facb3d0bfb90881632a96f732dc322e65c and `kernel/src/publish/mod.rs:530` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:8e775cffb978c5e52993a868d0a207ed323a313da83bd3e34009922a5d6ae4e8.
- Admission looks each name up by exact match and keeps the declared order (`engine/src/attributes.rs:549-571` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:fb1d70ef33ec853fb2357135d887d41779d2886486a200545dbd1eeb1d7a7908).
- It refuses more than `MAX_PROJECTED_ATTRIBUTES`, which is 32 (`engine/src/attributes.rs:542-547` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:0a544d3ecfcdcb6d26212eafc5b05b92f088d7970d88d152e3ecdfd16ea99455; `engine/src/attributes.rs:70` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:ae7144e04e15ebb0bf4a5ed09def61186b7f11c5aa1d94b6d745c30092f168f5).
- It refuses `id` (`:557-562`, same file and pin) and duplicates (`:588-592`, same file and pin).
- The bundle's schema is `id`, then the geometry, then the declared projection in declared order (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:118` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:7ac62cbdb54cccdd582018da7bcf437efa97330f7f996d09eaea7732c6372afe).
- A reader derives the projection as `schema` with its first two entries dropped (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:229` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:2d0cf02688f3afdeaa6b092ed88ececa64cf82e5006bc0e6e1b1ca84b62ae41b).

The kernel's projection object is private to `PublishPreflight`. Reading names off it would need a kernel accessor, which is out of scope (§1). U1 therefore proves the equality against the manifest the kernel writes (§4).

**The crossing.** The field crosses as one more JSON string member of the existing binding-local payload. `frontends/shell/src/publish/types.ts`'s `PublishPromptData` (`:15-48` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:45c5d755cfefdf177dcd2f0945c03555e886cf1d767d965678f8b3a913d8bed8) gains `published_columns: string;` after `outcome_summary`. The member is required, never optional, because the host always sends it. The line is control data: at most 32 names, never bulk data (docs/10).

**The dialog.** `frontends/shell/src/publish/PublishDialog.tsx` renders `prompt.published_columns` verbatim, with no page-side composition, at the place OPEN-5 settles. The recommended place, OPEN-5 (a), is a second `<dd className="publish-dialog-columns">` directly after Row scope's `<dd>` inside `<dl className="publish-dialog-fields">` (`:244-263` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:e5fbb68845f4d644e41fe1122ac1feac3b17ad7f3de34af4aaf3d7e44a9eecd3). That is within the provenance list, as option (A) says (consult `:79` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:ba2dd7c4a2fc66816ee7102553332cf75190fbbd7f16b7a99da6fd2795ea53a2), and adds no label word. No other element moves.

**The guarantee category (§21a's fourth).** No existing stated guarantee or tested property changes:
- every existing field, its order and its render are unchanged;
- the approval's comparison stays in Rust;
- the published projection is unchanged.

The piece adds one new stated property: the line names exactly the columns published. §4 puts it under test. It takes the full form on §21c's bounds in any case (§9).

**Operator-text rule.** The line states what the host publishes, and the host composes it. It states no other module's consequence.

### 2.2 The words (the human's, by approval)

The two forms, byte-copied from the directive's line 20, `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md:20` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:2e05b7610c5865dc8798c45bec193cfa13b0de5bcb6cf46c913f23da802445e6. These are sub-line spans, so the hash is the whole line's. The spans are inside the quotation marks. The architect copied them from a read of the file, not by script, and the custodian's script check of each span against that line is due before this form is committed. Verbatim:

- With attribute columns, W-A: `Columns published: id, the geometry, and <the attribute columns' names, separated by commas>.`
- With none, W-N: `Columns published: id and the geometry only.`

How the names fill W-A's placeholder:
- **No names.** W-N, byte for byte. This is the only case reachable on main, where the shell's style is literal-only.
- **One name.** `Columns published: id, the geometry, and ` + the name + `.`, for example `Columns published: id, the geometry, and zone.` This is the case after PR B, with a Colour by column.
- **Order.** The request's declared order, which is the manifest's `schema` minus its first two entries (ADR-017 `:118`, `:229`). There is no sorting and no deduplication; the kernel refuses duplicates before any prompt.
- **Separator between names.** As OPEN-1 settles. Recommended: `, ` (comma and space), as the human's own commas in the same sentence are typed.
- **Many names.** By W-A as typed, the list follows `and `, for example `… and a, b, c.` This is unreachable in the shipped build (`style_attributes` returns at most one name). The composer's source comment names it, and OPEN-3 asks the human.
- **A name with a comma or other punctuation in it.** Inserted as is, with no quoting or escaping, under OPEN-2 (a). The exact-match lookup means the shown name is the column's own name. A name containing `, ` reads ambiguously. Ordinary use cannot reach this on main; after PR B an odd file can. OPEN-2 asks the human.
- **The cap.** At most 32 names, by the kernel's refusal before any prompt. The line has no cap of its own and no truncation.
- **No `[P6 placeholder] ` prefix**, under OPEN-4. The words are the human's by approval and are sighted on the sitting's list.

### 2.3 Records

- **Walkthrough G3** (`frontends/shell/MANUAL-WALKTHROUGH.md:332` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:687a5de61b0c84d0d1bde05fd57921b5d5649e49798d2c876abc4567544a658e). Its expected outcome gains the line in its place in the order (after **Row scope**), with a dated pointer naming this piece and `publish.rs::compose_published_columns`. With G1's literal style it reads W-N. The worker writes these words from the built code, and both gates check them clause by clause. They are not the human's wording. G3's JUDGE question is unchanged; it is consult finding 3, for the docs lane.
- **The `e2e/publish.mjs` coverage table**, the APPROVED' row (`frontends/shell/MANUAL-WALKTHROUGH.md:397` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:43ff6ba2421445058c6121031857d19b446f8c022f68bc127e0ecfb0c6c411d2). Its enumeration of the prompt fields gains `published_columns` (W-N) and the manifest's two-entry `schema`.
- **The e2e README's "Publish spec (publish cut, P4)" entry** (`frontends/shell/e2e/README.md:169-218` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:9af29102711df7debb62014c485ce772c7794980e7f346f683d476a605fe5dcd). Only its APPROVED' passage (`:189-201`, same pin) changes, gaining the two new assertions.
- **ADR-024's field list** (`docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:137-144` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:a533a2020049c303aaa22f2621f440d0b36bee8003c37a5a96b3d0f0e468ab5d). One appended note, in the human's typed words only, under OPEN-6. It uses the heading pattern of the 2026-11-06 note (`:304-308`, same file, @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:66b3a04956c0ac9656645b519533a3e5630e3cdba3adeb6476c1d84e5099e194) and is applied by script, byte for byte. My draft for the human's sight is under OPEN-6, outside this form. "Attribute-projection publishing UI" stays out of scope and stays true (`:283-285`, same file, @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:487174c0b3851d6f71db83ba70320e598773de923827a0ead4dc80ec3edd9d4f): the line shows the columns and lets nobody choose them.
- **KNOWN-LIMITATIONS: no item is due.** Item 59 (`KNOWN-LIMITATIONS.md:490-492` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:da575715513007d9cfa781ac0d2b79b8678a4605a573b537af5e22407fb342f7) stays true on main, and the line agrees with it (W-N). This piece does not edit it.
- **What PR B's records commit re-reads** (item 4 (c); PR B's form, Amendment 12 item 7 and Amendment 13 item 13), handed off and not done here:
  - item 59's text, against this line;
  - PB-E2 (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:526` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:c114077617fcffa5178196c89b736243438ac699b46fc1ab20d0a53708d1ecd0), which then also asserts that `published_columns` names the column and equals the manifest's `schema` minus its first two entries;
  - operator row 5 (`…:682` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:24e4c694e97788aca94daa5d09619ad93652340d1c1a86150f26305bc2b8ab70, the same path), whose expected outcome then includes that the approval names the column.
  When main is merged into PR B, tsc may name a PR B fixture that types `PublishPromptData`. PR B's own I1 applies there (its Amendment 13 item 13).
- **The sitting.** The custodian adds W-A and W-N to the sitting's list as the human ruled. That is a custodian record, not a file in this PR.

## §3. Fixtures — outcomes declared in advance

| Fixture | Used by | Declared outcome |
|---|---|---|
| `fixture()` in publish.rs's tests (`CategoricalZone`, LV95, native ids) with `STYLE` matching on `zone` (`frontends/shell/src-tauri/src/publish.rs:1682-1695` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:627186821fced8226e955c99515e1fa127fb8da7248ab790b2d204995f0151ba; `:1737-1753`, same file and pin) | U1 | the prompt's field is `Columns published: id, the geometry, and zone.`; after execute, the manifest's `schema` names after the first two are exactly `["zone"]`, and the field equals the composer over them |
| the same `fixture()` with a test-local literal-only style (no `match`), added in the tests module | U2 | the field is W-N, byte for byte |
| `target/fixtures/manual-walkthrough/filter-zoned.parquet` (2,000 rows; regenerated by the command in the README entry), the shell's own style on main | APPROVED' | `prompt.published_columns` is W-N, byte for byte; after execute the manifest's `schema` has exactly 2 entries, the first named `id` |

No fixture is regenerated or hashed by this piece beyond the README's existing command.

## §4. Tests, and the mutation per new test

Each mutation is applied alone, its test is run, its failure is recorded by name with the 40-hex commit it was observed at in a `RECORDED MUTATION:` line above the test (the form of `frontends/shell/src-tauri/src/publish.rs:1701-1702` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:09125ab6a0b39bd7dd4369e9ae4a1446fc49ef563869783d0f04728f909aac05), and the mutation is reverted. A `verify-mutation` run is not an observation of a mutation (round 25, item 2 (c)). A mutation that passes, or that fails anywhere other than predicted, is a stop. No committed test adds a sleep, a retry or a timeout.

**Rust, in publish.rs's tests module.** The tests go through `prepare`, which delegates to the shipped `prepare_with_progress`, which calls `prepare_with_query`. They run in CI's `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked` (`.github/workflows/product-ci-shell.yml:217` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:411fccb786299e993e65ff409d90aa5d61362f6c0eaa425743b1866d4cfcfd49, windows-latest).

- **U1** `the_published_columns_line_names_the_request_attributes_the_bundle_publishes`.
  - Under `env_lock()` with `AUDIT_LOG_ENV` set (the pattern at `:1856-1878`, same file, @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:ab68e6d157d84f83e342da5fb1c9c96147763b7d23999d145605673f0c47c6da), prepare with `STYLE`.
  - Assert the field equals `Columns published: id, the geometry, and zone.`.
  - Execute with the phrase derived from `destination_display` (as `prepared_with` does, `:1812-1854`, same pin), and read `manifest.json` under `bundle_path`.
  - Assert that `schema[2..]`'s names equal `["zone"]`, and that the field equals `compose_published_columns` over those names.
  - M-U1: `compose_published_columns` returns W-N unconditionally. Predicted to fail at the first `assert_eq!`.
- **U2** `the_published_columns_line_is_the_no_attributes_form_for_a_literal_style`.
  - Prepare with the test-local literal style and assert the field is W-N, byte for byte.
  - M-U2: the empty arm removed, so an empty slice yields `Columns published: id, the geometry, and .`. Predicted to fail at its `assert_eq!`.
- **U3** `the_published_columns_line_keeps_the_declared_order_and_the_separator`.
  - `compose_published_columns(&["b","a","c"])` equals `Columns published: id, the geometry, and b, a, c.` under OPEN-1 (a).
  - M-U3: the names sorted before the join. Predicted to fail at its `assert_eq!`.
  - It is the only test that can see order, since the shipped build sends at most one name.

**Vitest, in `frontends/shell/src/publish/PublishDialog.test.ts`'s "the rendered dialog" block.** This uses `renderToStaticMarkup` over the real component, with the `PROMPT` fixture typed by `types.ts`'s `PublishPromptData` (`:39-54`, `:157-227` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:545dbcd0239bcd1f93c59923f538de7978f8f0d6302807e2d8dfbdb3b7d66850, sha256:634086571d5284ca0c74c324bee56769fd91844c80c6bd1fde4652726c5eef85). `PROMPT` gains `published_columns: "Columns published: id, the geometry, and zone."`. It runs in CI's `npm run verify` (`.github/workflows/product-ci-shell.yml:212` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:2739fcce95d74e4de1587af9b30a2b43c07306617f8cbf7f8a7f5b064f3f1b73).

- **D3** `D3 renders the host-composed published_columns line verbatim, after Row scope and before the irreversible warning`.
  - `html.indexOf(PROMPT.published_columns)` is greater than the index of `PROMPT.row_scope` and less than the index of `This cannot be undone`.
  - M-D3: the new `<dd>` deleted from PublishDialog.tsx. Predicted to fail at the first `toBeGreaterThan`.

**End to end, `frontends/shell/e2e/publish.mjs`, step APPROVED'** (`:286-409` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:d060f87f02ae3eaccc87d3b456441e3a9eccf1fa3ca3d35674fadf4075f1bcf1; item 4 (c)). The step changes, and the suite gains no new step. This is the seam's end-to-end test from the real shape: the payload the shipped prepare serializes (through the dev-only destination seam, which runs the same `prepare`) and the manifest the kernel writes.

- **E1.**
  - Beside the `filter_scope` check: `prompt.published_columns === "Columns published: id and the geometry only."`.
  - After execute, read `manifest.json` under `executeOutcome.bundle_path`, as FILTERED' does (`:521`, same file, @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:17bab478bd8b1070f379ae89d01018e1220cfd893c33cc9b76c3310bcfff82ae), and assert `schema.length === 2` and `schema[0].name === "id"`.
  - M-E1 is M-U2's change in a dev build. It is observed in the e2e itself, once, at the head with the mutation applied and the dev app rebuilt, inside the shared hold. Predicted to fail at the `published_columns` assertion; reverted.
  - The record says that the e2e's mutation was observed in the e2e. If the machine rule prevents that run, the record says the mutation was observed unit-only through M-U2 (class 4's wording) and never implies otherwise.
  - The e2e does not run on CI.

**Changed only by a fill, no assertion changed:**
- `prompt_stub()`;
- `frontends/shell/src/publish/PublishPanel.test.ts`'s `PROMPT` (`:41-56` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:83b44c262df679412d2558fe8d569f92fbaf327c7d66ad86e920d2ae849d437a);
- `frontends/shell/src/App.selection.test.tsx`'s `promptFixture()` (`:107-112` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:89cbe5810ce99c59a77f4a6462c5e0250be64192f38719d5e7c0c3961b977687; explicitly typed, so tsc names it);
- `frontends/shell/src/App.command.test.tsx`'s inline prompt (`:92` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:b9ae421e86876a0fc260a546228e78f63f88661c0e4b524a99e698b769fdda9c), only if tsc names it.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions.**
- P-head-1: U1 to U3 and D3 pass at the head, and each mutation fails as §4 says.
- P-head-2: APPROVED' passes at the head, with `published_columns` equal to W-N and a two-entry `schema`.
- P-head-3: every other e2e suite passes at the head as at the base.
- A wrong prediction is a result (class 2). It is never edited to match.

**Declared unchanged.**
- Every other `PublishPromptData` field, its value and its rendered order.
- The header, the outcome sentence, the filter alert, the irreversible warning, the instruction, the expiry sentence and the buttons.
- The grant, the phrase check and the audit pair.
- `style_attributes`, `prepare_with_progress`'s preflight and `execute`.
- Every byte a bundle carries.
- `commands.rs`'s signatures.
- Every path PR B touches.

**Invalidators (stop and report; nothing past the stop).**
- **I1.** tsc names a file outside §7 that constructs `PublishPromptData`. A class 9 amendment comes before that code.
- **I2.** At the base or the head unmutated, APPROVED' sees anything but W-N, or a `schema` longer than 2. The shell's style on main would then carry a match, and item 4 (c)'s premise would fail.
- **I3.** U1's `schema[2..]` names differ from the request's `["zone"]`. The composer's premise would be false, and the shape would need a kernel accessor, which is out of scope and goes to the human.
- **I4.** Any test or suite fails at the base before code (step S1).
- **I5.** #311 is not merged at dispatch, or rule (00) fails at dispatch.
- **I6.** A shape the human rules under OPEN-1 to OPEN-5 differs from the recommended one. The rule is recorded as class 5 before the affected code.

**Falsification.** The form is wrong if the line can name a column set different from the published one in any case ordinary use reaches.

## §6. Instruments

Every quantity is an assertion: string equality, a manifest's `schema` length and names, an index order in rendered HTML. None is a measurement. No docs/08 budget applies, since the composition is a join over at most 32 names and adds no IO. The line names no count.

## §7. Declared values and ceilings

**Values.** No new constant beyond the two strings of §2.2, which sit at the composer's site with a source comment naming item 4 (b) of the directive. The 32 cap is the kernel's existing one, not redeclared.

**Paths and per-file ceilings** (insertions plus deletions, docs and comments counted):

| Path | Ceiling |
|---|---|
| `frontends/shell/src-tauri/src/publish.rs` (product about 25, tests about 95) | 140 |
| `frontends/shell/src/publish/types.ts` | 10 |
| `frontends/shell/src/publish/PublishDialog.tsx` | 10 |
| `frontends/shell/src/publish/PublishDialog.test.ts` | 25 |
| `frontends/shell/src/publish/PublishPanel.test.ts` | 3 |
| `frontends/shell/src/App.selection.test.tsx` | 3 |
| `frontends/shell/src/App.command.test.tsx` (only if tsc names it) | 3 |
| `frontends/shell/e2e/publish.mjs` | 40 |
| `frontends/shell/e2e/README.md` (the Publish spec entry's APPROVED' passage only) | 8 |
| `frontends/shell/MANUAL-WALKTHROUGH.md` (Part G's G3 row and the APPROVED' row of the e2e/publish.mjs coverage table only) | 8 |
| `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md` (one appended note, only under OPEN-6 (A)) | 8 |

- **Totals.** 11 files, 258 lines, the sum of the per-file ceilings; 10 files and 250 lines without ADR-024.
- **Outside the count.** This form, its amendments and the PLAN node.
- **The counting command.** `git diff --numstat $(git merge-base origin/main HEAD)...HEAD -- <the paths above>`, insertions plus deletions summed per file and over all. The base is the main commit after #311's merge that the branch is cut from, named in the worker's report.
- **Overruns.** An overrun of any per-file ceiling, of the file count or of the total is class 8, with this section not edited.
- **Budget.** 210 minutes, all phases.

## §8. Block-on-sight

1. Any change under `kernel/`, `engine/`, `renderer/` or `protocol/`, a dependency or a lockfile.
2. The field composed from anything but `prepare_with_query`'s `attributes` vector (§2.1): a second `style_attributes` call, the `:439` vector, or anything JS sends.
3. Any page-side composition, truncation or alteration of the line.
4. The line's bytes not W-N or the W-A fill of §2.2 as ruled under OPEN-1 to OPEN-4.
5. A new `pub` item, or an option or code path with no product caller.
6. A test written to an imagined interface: D3's fixture not typed by `types.ts`'s `PublishPromptData`; E1 reading a member name the host does not serialize; U1 not reading the manifest the kernel wrote.
7. A mutation not observed as §4 says, or a `verify-mutation` run called an observation.
8. Any of the four consult findings fixed here: PublishDialog.tsx's report-pointer comment, G3's JUDGE question, ADR-024's TTL, PR B's §2.3 (i).
9. Any edit to KNOWN-LIMITATIONS.
10. An ADR-024 note in words other than the human's typed words, or one landing without OPEN-6 (A).
11. Any path outside §7 edited without a class 9 amendment first.
12. A sleep, retry or timeout in a committed test.

## §9. Gates

**The form and the gates.**
- §21c is crossed on two bounds: more than 8 files, and new user-visible behaviour (`governance/AUTONOMY.md:350-351` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333).
- §21a's ADR category is touched under OPEN-6 (A) (`governance/AUTONOMY.md:319-320` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:5238514ca590001e21cfa3c41b057ba1c429c7334f4ba2c53c68aeb0b3a5a039).
- So round 25, item 2 (e) takes the full form and both gates from dispatch (`governance/AUTONOMY.md:482` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669).
- §21b's single gate is closed (`governance/AUTONOMY.md:336-337` @ c3b4899c4c4a1cf1b0823a7b0e4a1be20f96ec5c sha256:c60dc87cd835f1ae56c3bc930789986d197ed5d2ff34c7ef30d3ec20d2a21a63).

**Steps.**
- **S0.** Dispatch after #311 merges. The branch `cut/publish-approval-columns-line` is cut from that main commit. Rule (00) is re-checked by `git diff --name-only origin/main...<branch>` over every branch in flight and every PR awaiting merge, and `git diff --name-only c3b4899c <base>` over §7's paths is read; a moved pin is re-derived (class 3).
- **S1.** At the base, inside the shared hold: the cargo test, `npm run verify` and `npm run e2e:publish`. All pass, or I4.
- **S2.** One commit: the field, the composer, `prompt_stub`, `types.ts`, the dialog's `<dd>`, the fills, and U1 to U3 and D3.
- **S3.** M-U1 to M-U3 and M-D3, each observed as §4 says.
- **S4.** E1 in APPROVED' and the README passage. E1 is run unmutated at the head, then M-E1 is observed in the e2e and reverted.
- **S5.** The walkthrough rows, and the ADR-024 note under OPEN-6 (A), applied by script from the human's typed words.
- **S6.** §7's count; the PR as a draft; both gates.

**Architect.** Checks the docs/01 principles, ADR-006 class 3 unchanged, docs/02 and docs/10 (binding-local, control data), §8 item by item, the seam rule over §2.1's three seams (kernel projection to request, Rust to TS, TS to dialog), and the human's words against directive line 20.

**Reviewer, at the final head.**
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`.
- `npm ci` in `renderer/bundle-viewer` and in `frontends/shell`, then `npm run verify` in `frontends/shell`.
- Every e2e suite the shell's package.json names (`e2e:*`), on port 5400, each run in its own Bash call inside `hold shared -Project SpatialIDE`. A timing-sensitive failure seen in a shared run is not recorded as a failure: it is re-run and the re-run recorded.
- The governance `node --test` suites as CI runs them, plus `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify-mutation`. `verify-mutation` is a floor, never an observation.
- §7's command.
- Each `RECORDED MUTATION:` line read against its commit.

**Operator.** G3 as amended, and W-A and W-N on the sitting's list. Felt verdicts are the human's.

## §10. Amendments (opens empty; append-only)
````

---

**OPEN items**

- **OPEN-1. The separator between names.** **Red line** (a P6 string).
  - (a) `, ` (comma and space), matching the human's own commas in the same sentence.
  - (b) `,` with no space.
  - **I recommend (a).** U3 pins whichever is ruled.
- **OPEN-2. A name containing a comma or other punctuation.** **Red line** (P6). Ordinary use cannot reach this on main. After PR B, a file with such a column can reach it.
  - (a) Insert the name as is, name the ambiguity in the composer's source comment, and carry the question to PR B's records commit.
  - (b) Wrap each name in quotation marks. That changes the shown words, and they are the human's.
  - (c) As (a), plus a KNOWN-LIMITATIONS item at PR B, in the human's words.
  - **I recommend (a) for this piece**, with (b) or (c) the human's to choose at PR B.
- **OPEN-3. The many-name grammar.** **Red line** (P6). By W-A as typed, the list follows `and ` (for example `… and a, b, c.`). The shipped build cannot reach this case.
  - (a) As typed.
  - (b) The human rewords it.
  - **I recommend (a).** It is the human's text applied as written, and it is named unreachable in the source comment.
- **OPEN-4. The mark.** **Red line** (P6).
  - (a) No `[P6 placeholder] ` prefix. The words are the human's by approval and are sighted on the sitting's list.
  - (b) The prefix until the sitting.
  - **I recommend (a).**
- **OPEN-5. Placement in the dialog.** **Red line** (the approval surface).
  - (a) A second `<dd>` in Row scope's group, inside the provenance list as option (A) says, with no new label word.
  - (b) Its own `<dt>` with a label. A label is a new word and is the human's.
  - (c) A `<p>` after `</dl>`. That is outside the list, unlike the ruled text.
  - **I recommend (a).**
- **OPEN-6. ADR-024's note: when and in what words.** **Red line** (an ADR note).
  - (A) In this PR, appended by script from the human's typed words. The PR does not merge without them.
  - (B) In the docs-lane findings node, beside finding 1's TTL note. ADR-024's field list would then be stale from this piece's merge until that node.
  - **I recommend (A).**
  - My draft for the human's sight, not their wording: Note <date> — the approval dialog also renders `published_columns`, one host-composed line naming id, the geometry and each attribute column the pending attempt publishes, in the request's declared order, beside `row_scope` in the field list (publish-approval-columns-line). Nothing else changes, and this ADR stays Proposed.
  - Clause check against the code:
    - "host-composed": the composer in `prepare_with_query` (§2.1).
    - "each attribute column the pending attempt publishes": publish.rs:683 and :767; kernel mod.rs:305-306 and :530.
    - "in the request's declared order": engine attributes.rs:549-571; ADR-017:118.
    - "beside `row_scope` in the field list": true only under OPEN-5 (a).
- **OPEN-7. How far the e2e reaches.** Not a red line.
  - (A) The payload and manifest assertions in APPROVED', which is the precedent `outcome_summary` set.
  - (B) Also a DOM step that expands `.publish-disclosure`, reads `.publish-dialog-columns` and cancels. On main that pattern exists only behind an off-by-default flag (e2e/selection.mjs:885-896), and the step would need a new wait.
  - **I recommend (A).**
- **OPEN-8. The App.selection.test.tsx overlap with PR B.** Not a red line. PR B's session-end class 9 table (its Amendment 13 item 13, by reference to the session-end draft) gives this file a 45-line allowance. The worker report says it went unused, and the file is untouched at b8127685.
  - (a) Dispatch once the custodian's rule (00) check finds PR B's branch still leaves the file untouched and records on PR B's form that the allowance is unused.
  - (b) Wait for PR B.
  - **I recommend (a).**
- **OPEN-9. The docs-lane findings node's order.** Not a red line. `publish-approval-consult-gate-findings` edits paths this piece edits: PublishDialog.tsx's comment, Part G's G3 and ADR-024.
  - (a) It starts after this piece merges, so that its words read the new line.
  - (b) It starts before this piece.
  - **I recommend (a).**

**Gate findings (not ruled)**

- G-1: The findings node overlaps this piece's paths under rule (00), as OPEN-9 sets out.
- G-2: Walkthrough row 397 says "every field `PublishPromptData` carries" and then enumerates the fields. After the merge its enumeration needs the new field. That fix is inside Scope (§2.3).
- G-3: ADR-024:137-144 goes stale at the merge unless OPEN-6 (A) is chosen.
- G-4: `prepare_with_progress` and `prepare_with_query` each call `style_attributes` (publish.rs:439 and :565). The function is pure and gets the same input both times, so this is not a defect. The form ties the line to :565's vector, which is the one stashed and executed.
- G-5: When main is merged into PR B, tsc may name a PR B fixture that types `PublishPromptData`. PR B's I1 applies there.
- G-6: The CLI's `ApprovalPrompt` will not carry the line, so the CLI and the shell differ until `publish-approval-kernel-parity` (S3) lands. The CLI is developer and test tooling (ADR-017:1140).
- G-7: The human's exposure review (ADR-017:1110-1142) passed the dialog without this line. Whether an added line asks anything of that review is the human's question.

**What I read, by path**

- the brief (scratchpad `brief-pacl-form.md`)
- `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md`
- `state/consults/2026-11-12-b1-shell-half-pr-b-publish-approval-colour-by-column-architect-consult.md`
- `state/consults/2026-11-12-b1-shell-half-pr-b-session-end-phase-worker-report.md`
- `state/consults/2026-10-25-b1-shell-half-pr-b-session-end-class-9-ahead-architect-draft.md`
- `governance/PLAN.yaml` (the nodes at 2370, 5571, 7178, 7195 and 7212)
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`
- `governance/forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md`
- `governance/AUTONOMY.md` §21a to §21d and §25
- `docs/PREREGISTRATION-TEMPLATE.md`
- `frontends/shell/src-tauri/src/publish.rs`
- `frontends/shell/src/publish/types.ts`
- `frontends/shell/src/publish/PublishDialog.tsx`
- `frontends/shell/src/publish/PublishDialog.test.ts`
- `frontends/shell/src/publish/PublishPanel.test.ts`
- `frontends/shell/src/App.command.test.tsx`
- `frontends/shell/src/App.selection.test.tsx`
- `frontends/shell/e2e/publish.mjs`
- `frontends/shell/e2e/selection.mjs`
- `frontends/shell/e2e/export-view.mjs`
- `frontends/shell/e2e/command-bar.mjs`
- `frontends/shell/e2e/README.md`
- `frontends/shell/MANUAL-WALKTHROUGH.md` (Part G and its coverage table)
- `kernel/src/publish/mod.rs`
- `kernel/src/permission/approval.rs`
- `engine/src/attributes.rs`
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md`
- `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md`
- `KNOWN-LIMITATIONS.md`
- `.github/workflows/product-ci-shell.yml`

**The packet's gaps**

- I had no tsc run, so the fixtures that construct a prompt come from grep. App.command.test.tsx:92 may not be typed.
- Whether PR B's later colour-by phase plans to edit App.selection.test.tsx or App.command.test.tsx.
- Which walkthrough Part #311 edits. I assumed it is not Part G or the publish coverage table.
- Where "the sitting's list" is held: which node or file.
- Whether the shell's style on main can ever carry a `match`. I assumed it is literal-only, and I2 covers the case where it is not.
- No sha256 is computed and no byte check was made by script on line 20's apostrophe (I have no shell).
- PR B's form :162 and :625 were not re-read this session.

**Model:** Opus 5.5 (claude-opus-5-5).
