# B1 engine-kernel half's routed items (gate 3): publish's retention flag proven through flush, and the doc and record nits — preregistration

## Header

- **Status.** The preregistration of PLAN node `b1-engine-kernel-half-followups`. Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form.** Full form and full gating from dispatch (AUTONOMY §21a; §21c, about 350 lines counted with tests; §25(e): the piece touches a stated guarantee's proof and doc text, and `protocol/skp/**`). No five-line form exists for this piece.
- **Authority:**
  - PLAN node `b1-engine-kernel-half-followups`, placed by question round 31, item 1 (RULED 2026-09-30).
  - Drafting by the architect: question round 43, item 2.
  - Routed by B1's gate 3: `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md` (E2, D2–D6, the supplementary mutation S1) and `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-architect.md` (its §3 E-15 note, §4 doc nits, Other notes).
  - The owner's-index update: `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1, item 2.
- **Why not B1's form.** Amendment 12 closes it to further additions before B1's close (`engine/B1-PROJECTION-PREREGISTRATION.md:783 @ b438c587 sha256:0395bf0d7726101b1b5dda9b1888cd9e79540960aa6fe6d8f49436f9b3ba1e6d`). This form amends nothing in it.
- **Drafted by** the architect agent, on the custodian's brief. Inputs: lead-data's impact read (`state/consults/2026-10-05-b1-engine-kernel-half-followups-impact-read.md`, read at e29c6f86) and a re-read of `main` at b438c587. Read-only; the architect ran no command.
- **Reference form.**
  - Code and records at main are pinned `path:line @ b438c587 sha256:<hex>`. b438c587 is on main.
  - A pin is historical. It is authoritative for the defect it names. The tree at the branch's base is authoritative for the edit, and the worker re-derives every site before editing (template §0).
  - Self-references are by section and item. The ledger is cited by round and item.
- **Branch.** `cut/b1-engine-kernel-half-followups`, cut from `main` when a slot frees. It merges by a merge commit, never a squash, because T1's recorded-mutation comment names a branch commit (§4).

## §0. Disclosure

- Read: the impact read; the node and `kernel-close-races-followups` in PLAN.yaml; both gate-3 reports; B1's form (Header, §7–§9, Amendments 9–12); AUTONOMY §21–§21d and §25; the template, Round 25 additions included; the portability directive §2; the code sites cited below.
- **Gate-3 reports in conflict on E-15.**
  - The architect's note says E-15's doc describes a row-count failure path that does not occur (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-architect.md:108 @ b438c587 sha256:87ab9c48222e45f4d5d9b4bf23e5042a74de9e4ffbffb2f5d8ccc2f66d06d475`).
  - The reviewer's row 9.6(a) records E-15 failing at `c9ec02e`'s stream.rs line 2669 with left 5000, under a full-length copy realized through `Buffer::ptr_offset` (`state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md:83 @ b438c587 sha256:4e5f0475926e69c7dcf580862d1aa319e2e26a014e9a71b4f0bbb0ca5dd31755`).
  - Amendment 10 makes the reviewer's report the observation of record for 9.6 (`engine/B1-PROJECTION-PREREGISTRATION.md:772 @ b438c587 sha256:573c3a94a9bbfa4019ea544d7ba2b9029bd2c33ac7d8617a9fb0d6609523ddd7`). This form follows the observation of record (§2, item E-15).
- **Not carried** (not routed to this node): the gate-3 architect's SKP-V0 §4 item 3 nit, and its §9 suites note.

## §1. What this preregistration may and may not claim

- **No performance number.** No timing assertion, no `docs/08` row (docs/01 principle 8). This follows the precedent of round 25, item 1: assert the property, never a budget that docs/08 does not declare.
- **No wire change.** The SKP-V0 note (§2, D6) adds no literal, key, value, code or command. `protocol/data-plane/` stays empty.
- **No product behaviour change.** Product (non-test) source changes only in `//` and `///` comment lines.
- **No new operator-visible text.** No ADR-018 vocabulary.
- **ADRs cited, none amended.** Cited: ADR-004 (copy-minimized), ADR-010 rule 6, ADR-017 §12. ADR-023 is Proposed and binds nothing; it is cited only as the source of B1's condition (3).

## §2. The change

### E2: publish's flag proven through `flush` (one new test, T1)

**The path T1 proves.**
- `StreamPlan::for_publish` declares `compact_attribute_retention: false` (`engine/src/stream.rs:610 @ b438c587 sha256:a9eea7a80c1716c73b7d7e8e4377bb37ebd6b59be2bc190bb32552711774e0a1`).
- `Dataset::stream_for_publish` passes that plan to `stream_inner` (`engine/src/stream.rs:940 @ b438c587 sha256:15373bdce3fae2e811df74198c250d3f4b34a88f2006a416b563b4d4e58a6061`).
- `flush`'s single-run arm hands the flag to `single_run_retention` (`engine/src/stream.rs:2434-2435 @ b438c587 sha256:e939a786ee71c477558bc07e3bafcf40e2000fae58a306a30d8db7850001d53f`).
- Today the only proof stops at the constructor (`engine/src/stream.rs:2900 @ b438c587 sha256:eeae84be279cb93f041a22af575eebe7327ae2c5dbef7f01b8d3d53376e00720`, `engine/src/stream.rs:2915 @ b438c587 sha256:dc40740f84207fb48e9af01752b37dc589e063eca13cae9851c52a5763146c68`).

**T1.**
- Name: `a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush`.
- Placement: in `engine/src/stream.rs`'s `mod tests`, under `#[cfg(feature = "fixture")]`.

**Seam (the real shape).** T1 makes the same two calls the kernel makes:
- `Dataset::resolve_projection` (`kernel/src/publish/mod.rs:493 @ b438c587 sha256:8e775cffb978c5e52993a868d0a207ed323a313da83bd3e34009922a5d6ae4e8`);
- `Dataset::stream_for_publish` (`kernel/src/publish/mod.rs:716 @ b438c587 sha256:98cf480b15f48b5e0e2f6ca7c54897a045e0a010b88b6e1784c4905454467a62`).

T1 calls them with `ViewportQuery::all()` and `CancelToken::new()`. It never builds a `StreamPlan` or calls `stream_inner` itself.

**Fixture.**
- Built with `write_geoparquet` in the temp dir: `AttributeMode::MultiType`, `CrsMode::DeclaredLv95`, `features` ≤ 20 000.
- Projection `zone, text`. `zone` is Utf8 with NULLs (`engine/src/fixture.rs:182 @ b438c587 sha256:2f71af6ec0f00af29f8f186d7269bf1992a23b569f5f3b3d9f47720acb259ddb`). `text` is about 1 KiB per row (`engine/src/fixture.rs:422 @ b438c587 sha256:13096dd0f6a284220a5ba60762cf0bfba4408bf7cade36835a29ad8231804981`).
- The worker picks `features` and `avg_vertices` so that publish's size cut (`engine/src/stream.rs:412-425 @ b438c587 sha256:89a0fdbc2c84427a0414e5895c9222cf933804ae76f7452fdc9b4519d17c7418`) lands batches inside one DuckDB chunk. That is H1 in §5.
- The fixture is hashed before and after the run, as the live text test does.

**Where T1 observes the kept run.**
- It reads the producer's queued `Item`s in-module from `BatchStream`'s private `rx` (`engine/src/stream.rs:742 @ b438c587 sha256:ee1dc824923d561c14feb82fc8d003127d52040efae4a0b82bbfbf269e920658`), before `write_ipc_into` runs.
- This is the live text test's route (`engine/src/stream.rs:3046 @ b438c587 sha256:fd428a2bd9d15cf097d1e83df2b445757e7ed68046fdf4a767094c28c1cf5482`).
- Decoded IPC cannot show retention (`engine/src/stream.rs:2994-2997 @ b438c587 sha256:06813dd4671d2e89c4f6ceaf88af4947affb602be788225c4ef1782f9411c862`).

**T1's assertions.**
- Every row is seen exactly once.
- For each projected column, at least one queued batch carries that column as an array that `retain_or_compact_single_run` would compact. That is, its return is not `Arc::ptr_eq` to the emitted array: the emitted array is a slice that retains more than the live allowance, and publish's `flush` kept it uncompacted.
- A compacted or concatenated array is tight, so it would come back pointer-equal. Under S1 no column satisfies the assertion.
- The failure message names the column. It states that publish's `flush` compacted every over-allowance run, or that the fixture has no such run.

**Recorded-mutation comment.** T1 carries one, naming the branch commit it was observed at (§4).

### Doc nits in `engine/src/stream.rs`

For every item below, the content is binding and the wording is the worker's.

- **D3, nullable-only wording.** Each site is reworded so that the H3 byte difference is attributed to a sliced bitmap's padding bits. Each site names both observed shapes: a nullable Utf8 run carrying a NULL (Amendment 5, row 5.1), and a non-null Boolean's values bitmap (Amendment 8's class-2 row). Sites:
  - `flush`'s route-(a) comment: `engine/src/stream.rs:2429-2433 @ b438c587 sha256:be9f2ded2eda5b00b0a2edfeb8c34d4a4ddaaa90fc9e0607bac4bd83dab3ea40`;
  - E-15's doc: `engine/src/stream.rs:2756-2759 @ b438c587 sha256:ea433aec6099371978c46f27d377029d7b4945d3692e357c857d2475aa18df04`. E-15's own claim stays: its non-null `Int64` run has no bitmap, which is why byte identity is true for it;
  - a third site, not named by the gates and the same defect in the same file: `StreamPlan::compact_attribute_retention`'s doc, `engine/src/stream.rs:585-590 @ b438c587 sha256:d15b31cbe0bd7a6eae7ac2ae523002214ca46246a9657a195275ba57ab26c5ce`.
- **D3, the overgeneralized rule.** These sites state a general rule over byte-aligned offsets:
  - `engine/src/stream.rs:91-97 @ b438c587 sha256:e1d2119c840926378a78efbf2c82a967a6c02d23c1b024b9fb39badcdb338ece`;
  - `engine/src/stream.rs:2360-2366 @ b438c587 sha256:6b72477eba5183b721caa8e3ae16a388a11b21f71bbf2c0203368850240649bc`.

  Each is reduced to the observed cases. The bytes differed for nullable Utf8 at the R-E1 shape, and for Boolean at 8/3, 0/10 and 40/20. They were equal at 3/5. Each site says no rule over offsets is claimed. Neither site states the reviewer's padding-bit mechanism as fact.
- **D4, the misplaced doc.** The doc block on `single_run_retention` currently carries `retain_or_compact_single_run`'s doc (`engine/src/stream.rs:2311-2323 @ b438c587 sha256:dc77e476c10af46cedadd1015b33d8de1c075290ad5b6fda82427bb56c82c657`). That doc moves onto `fn retain_or_compact_single_run` (`engine/src/stream.rs:2338 @ b438c587 sha256:102f866273ab2c33f8e1118e9a91d1d8e8653e824dc60e306b31cbba9d96688f`). `single_run_retention` keeps `engine/src/stream.rs:2324-2329 @ b438c587 sha256:8b9c3579c985a9ef3f0efafdc05273d7cbbfdba4dc6e48b402f0f5204ebf3425`.
- **The architect's relative clause.** In `engine/src/stream.rs:2327-2329 @ b438c587 sha256:17c0e817a15106042ece5970981e2962d23938bbbd08a097570b3b97816e03dd`, the clause about never entering the compacting branch is reattached to every plan but the live projected stream's. The rewritten text may name T1 as the proof for publish.
- **"this function's" in the const doc.** At `engine/src/stream.rs:99-102 @ b438c587 sha256:9c85ee0f53e9688b53027b299de4ce946e6083a2389ea2133bdcc6333a3dabff`, the phrase names `retain_or_compact_single_run`'s compacting branch instead. The publish claim may name T1.
- **E-15's Mutation paragraph** (`engine/src/stream.rs:2763-2765 @ b438c587 sha256:fba9e529c814635cf110191ff2ff11a5213fd6af1c828afbca271342c24c443b`).
  - Its failure path stays: it is the one observed (§0).
  - It gains a recorded-mutation line naming:
    - the realization (a full-length copy through `Buffer::ptr_offset`);
    - the commit `c9ec02e`;
    - the observer (B1 gate 3's reviewer, row 9.6(a));
    - the failing assertion, by its message as at `c9ec02e`, with left 5000.
  - Before writing, the worker resolves that line 2669 of `engine/src/stream.rs` at `c9ec02e` lies in E-15's `compacted.len()` assertion, and copies that assertion's message from `c9ec02e`.
- **Recorded-mutation comments** in this file: rows S-1 and S-2 of §4.

### Recorded-mutation comments in `kernel/tests/skp_projection.rs`

Rows K-1 to K-8 of §4. Each comment that has no commit gains the commit it is re-observed at. Each bare self-line becomes the failing assertion's message, with no line number. The mutation text is unchanged.

### D6: one scoping clause, in `protocol/skp/SKP-V0.md`

- **Placement.** One dated note, no literal change, appended at the end of §8, after the dated note at `protocol/skp/SKP-V0.md:969-977 @ b438c587 sha256:ed667b255499965fcd65d1fe456be8254c4ef8e3773c62f39dc5b818479b98b9`. §8 is append-only from `protocol/skp/SKP-V0.md:541-544 @ b438c587 sha256:e5b423c4a697d4d3f1b19b4da89f1380c98157515c2eefcfc3899ef2b06e1f64`.
- **Content (binding; wording the worker's).**
  - The `skp/0.6` fixture-commit lists name the version's two-sided wire fixtures: `protocol/skp/tests/data/*.json`, with `fixtures.rs` and `fixtures.test.ts`. The lists are at:
    - §4 item 13: `protocol/skp/SKP-V0.md:303-311 @ b438c587 sha256:3a3f7cb6c7ab2250f953a8b0f57acd6e9140472db933eaf6804b7fdb39d7779b`;
    - §8's `skp/0.6` Mechanics: `protocol/skp/SKP-V0.md:917-921 @ b438c587 sha256:5188c098d47ae9be487b3a24ea22ba1fd322ffc40a0addd13160d4a6c3175fb5`;
    - §9.1: `protocol/skp/SKP-V0.md:987-990 @ b438c587 sha256:8d17b19e616108e048a692b870d85ba350203fe042774a592a4b69d99db7bcef`;
    - `SKP_VERSION`'s doc: `protocol/skp/src/v0/mod.rs:66-69 @ b438c587 sha256:4b05b8d37e96c9b33b1116c0bfb90d9ee859cd3c280ec127d5ade7841cf53cec`.
  - The conformance suite's spec-derived fixtures under `protocol/skp/tests/conformance/` are outside those lists. They were updated for `skp/0.6` in `c9ec02e` (B1 §10, Amendment 9).
  - No literal, key, value, code or command changes. `protocol/data-plane/` has an empty diff.
- **Not edited.** None of the four list sites, and nothing above §8's end.

### D2 and A9: no edit (defects absent at main)

- **D2.** The header no longer credits `37b3644`. It names the `5d4da4d` run, and its `skp/0.6` line credits no commit (`protocol/skp/tests/conformance/DIVERGENCES.md:3-6 @ b438c587 sha256:c0a46a8c833d0b721af9fef3963af2b85c8b202a45bae50d5ed8955885b89e98`). The cancel-state piece rewrote it (`protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, Amendment 2, item 2). The wrong-commit credit D2 named is gone.
- **A9.** The text that `skp/0.6` has since merged is true at main (`protocol/skp/tests/conformance/AMBIGUITIES.md:17 @ b438c587 sha256:e969fbe9bf16706f4256c39b1fefc3ab2277f3fc3fc59c8ab576f705328af7a8`). B1 merged at `d6ec85a` (B1 §10, Amendment 11).

### Owner's index (`engine/README.md`, applied in the PR, lead-data's text)

- Owner's index, Last verified at: `engine/README.md:499 @ b438c587 sha256:4b3b31d103ae830a84b95f4516c8b0074079ba2a53b8a0f170d4c93f7ae7002a`.
- Interfaces → Publish stream and content pin, which gains T1 as a pin: `engine/README.md:505 @ b438c587 sha256:48c73b32b951e1b8308c28fd9605d0340c60775cebd29c294931b4ee134c737e`.
- Governed by → preregistrations in this module, which gains this form: `engine/README.md:518 @ b438c587 sha256:a1a3870251b6f5c691c05816a938c4e2a5113c801cd3471eff8cf867c12ba7e7`.
- No change to `kernel/README.md`'s index: the kernel edits are comments only, and no pointer moves.

### Node split with `kernel-close-races-followups`

- **This node carries** every B1 recorded-mutation comment in `engine/src/stream.rs` and `kernel/tests/skp_projection.rs` that names no commit or carries a bare self-line (§4, S-1, S-2, K-1 to K-8). That discharges the `skp_projection.rs` half of `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` Amendment 1, item 1.4.
- **`kernel-close-races-followups` keeps** `kernel/tests/wire_bytes_invariant.rs:368-372 @ b438c587 sha256:79d1171cc3961e365c1838c07a914b11ab534da6e7eb671a95950ede2e29b0f8`. Only that node's summary names that file.

### Portability

The feature is not OS-dependent, so R3's section is not required.
- **R1:** no semantics change.
- **R2 and R4:** no `cfg`. T1 uses `std::env::temp_dir()` and no path literal.
- **R5:** no level claim.
- **R6:** no new ignore.

### KNOWN-LIMITATIONS

No item is owed. No user-visible behaviour changes and nothing is reduced.

## §3. Fixtures, with predicted outcomes

| Fixture | Prediction |
|---|---|
| T1's MultiType file (spec stated in T1) | Every row seen once. Each of `zone` and `text` has at least one queued batch whose array the live rule would compact. The file's sha256 is unchanged across the run. |

## §4. Tests, and the mutation per new test

Every mutation is applied, the named test is run, the failure is recorded by name with its commit, and the mutation is reverted (round 25, item 2 (c)). No `verify-mutation` run is an observation.

| Row | Test | Mutation | Observed at |
|---|---|---|---|
| T1 (new) | `a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush` | M-E2, gate 3's S1: `flush`'s single-run arm passes `true` in place of the plan's flag (`engine/src/stream.rs:2435 @ b438c587 sha256:3fffb1fc57daffe155453d3dc0d582b6aa13cf3995fcdcccb352b3f31e35b263`). This is the mutation T1 is declared to kill, so S1 is killed by T1. | The branch commit, named in T1's comment. Re-made at the gate. |
| Supplementary (gate only, not a comment) | `a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound` | M-E2′: `flush` passes `false`. This is the other direction of ignoring the flag. | The reviewer's report. |
| S-1 | `a_non_dictionary_chunk_column_passes_through_the_decode_step_unchanged` | As written at `engine/src/stream.rs:2601-2604 @ b438c587 sha256:565d91faf1aba9b844944907ae1e2e50325ae731debd4107988f9b464ef449ad`. Gains a commit; the bare `:2419` is dropped. | `b438c587` |
| S-2 (D5) | the live text test | As written at `engine/src/stream.rs:3001-3004 @ b438c587 sha256:d8c69eb236b2b0184a331c58c878c8554b990d520311e9a53221480129303cb0`. Gains a commit. | `b438c587` |
| K-1 | the wire-fixture projection test | `kernel/tests/skp_projection.rs:151-154 @ b438c587 sha256:8cf6fd8b6657d5948abf336999981249e8d18b30a7a85a1b6854384ef905c406`; no commit | `b438c587` |
| K-2 | same (X11) | `kernel/tests/skp_projection.rs:155-158 @ b438c587 sha256:a734605e8f208442062a1f2c8384e04eda07f5792c5239a504282324ee37f0f3`; no commit | `b438c587` |
| K-3 | K-4's test | `kernel/tests/skp_projection.rs:365-370 @ b438c587 sha256:0c09b668588067344660c90a6c91293668c4f504cff1e76b24c137e914b58855`; bare `:275` | `b438c587` |
| K-4 | `every_projection_refusal_matches_its_committed_error_fixture_shape` | `kernel/tests/skp_projection.rs:583-587 @ b438c587 sha256:da147b879c758b07736ebf580f5b7ba259ceadfc720474bf9404d06ad20a164d`; no commit | `b438c587` |
| K-5 | the placeholder-text test | `kernel/tests/skp_projection.rs:917-922 @ b438c587 sha256:f3dc7bac539da038f00ea050982d49c60225bbed4b2b03c6f42bc58dd0f31e94`; no commit | `b438c587` |
| K-6 | `describe_projectable_agrees_with_viewport_query_admission_for_every_column` | `kernel/tests/skp_projection.rs:1003-1007 @ b438c587 sha256:c76420dcf7a6bda1dbe20ef170ac3f67140705bd186b7d596602a3216c04f6a3`; bare `:384` | `b438c587` |
| K-7 | `a_projection_composes_with_a_filter` | `kernel/tests/skp_projection.rs:1247-1250 @ b438c587 sha256:679702bb45873c8e55c6197e3cdf0552183aa681a736c6a6b8f2f8a3756279ca`; bare `:479` | `b438c587` |
| K-8 | `publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_with_todays_text` | `kernel/tests/skp_projection.rs:1399-1403 @ b438c587 sha256:5badee6e17ad3e806cf134dadaf23913cb563543c93a91a73278754fa0ef3977`; bare `:578` | `b438c587` |

**How the `b438c587` rows are made.** On a `git archive b438c587` export with its own `CARGO_TARGET_DIR`, with engine runs using `--features spatial-engine/fixture`. The test code there equals the branch's, because only comments differ. Each rewritten comment records the message observed.

**Declared unchanged:** the commit-named comments, all already framed as historical:
- `engine/src/stream.rs:2628-2634 @ b438c587 sha256:6de7cd36210d3fe4ac9fad623610bd8a2c4282f4e95da4deadf98a0ec7b687cc`;
- `engine/src/stream.rs:2861-2864 @ b438c587 sha256:128f960e0fc6ca39e00c41be11a010e449ec1632b4c2a1e0acc96df3ce5048eb`;
- `engine/src/stream.rs:2936-2939 @ b438c587 sha256:4a91632fc5388807b264a860fabbbe0df6f7a5fc3b01542cfffa98f60326751d`;
- `kernel/tests/skp_projection.rs:1115-1119 @ b438c587 sha256:14aaa1f9e63585a6221f4012a44ba5f28180db58ad9115c83f6581a797c166a3`;
- `kernel/tests/skp_projection.rs:1456-1461 @ b438c587 sha256:2ee4d712047e07149f30b9dfa545980e3888666a27388bd1ed9d73b3f163bc11`.

## §5. Predictions · declared unchanged · invalidators · falsification

- **H1 (a hypothesis).** Under `BatchSizePolicy::publish()` over T1's fixture, at least one batch per projected column is a single run inside a larger DuckDB chunk, with retention over the live allowance. Discriminator: T1 passes at the branch head.
- **P1.** T1 passes at head and fails under M-E2 by its per-column assertion.
- **P2.** Every row S-x and K-x fails its test by name at `b438c587`.
- **P3.** The workspace suite is main's plus one test (T1), with no other outcome changed.
- **Declared unchanged:**
  - every non-comment line outside `mod tests` and `kernel/tests/`;
  - every existing assertion, `expect` message, fixture and test name;
  - publish bytes (ADR-017 §12; `kernel/tests/publish.rs:284 @ b438c587 sha256:59c77f3dbe50af64e90c85338fa9e2e01a2c287bd71a1149c4f3578e9e03e5c4` unchanged and passing);
  - `MAX_QUEUED_BATCHES`'s doc (`engine/src/stream.rs:67-79 @ b438c587 sha256:3b73b8283497b8420d6387f79016c4eb025f3fa82c07f7acaf54f4d934d4b889`);
  - `DIVERGENCES.md`, `AMBIGUITIES.md` and `v0/mod.rs`;
  - SKP-V0 above §8's end;
  - `Cargo.lock`.
- **Invalidators (stop and return to the architect; nothing is adjusted to pass):**
  - H1 fails for every fixture within the bounds above. Do not add a hook, change the policy, or build a plan in the test.
  - Any product non-comment line must change.
  - An existing assertion must change.
  - A row S-x or K-x survives at `b438c587`. Its comment is left as it is, and the survival is a finding.
  - `c9ec02e`'s line 2669 is not E-15's length assertion.
  - `c9ec02e` is not an ancestor of main.
- **Falsification.** Publish's flag can be shown to reach `flush` only through a path that the kernel's call does not take.

## §6. Instruments

All are assertions: a pointer identity over the retention decision, a row count, and a file hash. None is a measurement. No counter or accessor is added.

## §7. Declared values and ceilings

- No constant is added or changed. `MAX_ATTRIBUTE_RETENTION_FACTOR`, `MAX_QUEUED_BATCHES`, `PUBLISH_PARTITION_TARGET_BYTES` and `PUBLISH_PARTITION_ROWS` are unchanged.
- **Line budget, by §21c's rule** (insertions plus deletions, tests included; this form and generated files excluded):

  | File | Ceiling |
  |---|---|
  | `engine/src/stream.rs` | ≤ 230 |
  | `kernel/tests/skp_projection.rs` | ≤ 100 |
  | `protocol/skp/SKP-V0.md` | ≤ 12 |
  | `engine/README.md` | ≤ 10 |
  | **Total** | **≤ 360 over these 4 files** |

- **Counting command, at a named commit:** `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- engine/src/stream.rs kernel/tests/skp_projection.rs protocol/skp/SKP-V0.md engine/README.md`.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight (each checked separately)

1. A non-comment change to any product (non-test) line.
2. A new `pub` or `pub(crate)` item, accessor, option, callback or code path (the caller rule).
3. An existing test's assertion, message, fixture or name changed.
4. A path in the diff outside the four in §7 and this form. A diff under `protocol/data-plane/`, `protocol/skp/src/` or `protocol/skp/tests/` is shown empty.
5. In SKP-V0, anything beyond one dated note appended at §8's end, or any change to a literal, key, code or command.
6. "zero-copy" anywhere (ADR-004).
7. A performance number, a timing assertion or a docs/08 row.
8. A rewritten recorded-mutation comment without the commit it was observed at, or with any line number. A record that calls a `verify-mutation` run an observation.
9. T1 reading retention from decoded IPC, building a `StreamPlan`, or entering anywhere but `Dataset::stream_for_publish` (the seam rule).
10. A doc that states a rule over bitmap offsets beyond the observed cases, or that calls publish's bytes anything but equal to main's by construction.
11. An edit to an ADR, to B1's form, to the cancel-state form or to the close-races form.
12. An edit to a comment §4 declares unchanged, or to `kernel/tests/wire_bytes_invariant.rs`.
13. A record hash at a branch commit. A test-text span named without its commit id (round 25, item 2 (d)).
14. A new `cfg`, platform ignore or path literal (portability R4 and R6).

## §9. Gates

- **Architect** (full gating):
  - §8, item by item;
  - the seam against the two kernel calls pinned in §2's seam paragraph, at the branch's base;
  - D6's note against §8's append-only rule;
  - verbatim quotes and discharge claims resolved;
  - the round-25 checks: class 8 against §7; class 9 for any addition; the mutation wording; test-text spans.
- **Reviewer:**
  - the full diff with `origin/main...HEAD`, with `protocol/data-plane/`, `protocol/skp/src/` and `protocol/skp/tests/` shown empty;
  - §7's count by its command;
  - M-E2 and M-E2′ re-made;
  - every row S-x and K-x re-made at `b438c587`;
  - E-15's `c9ec02e` resolution checked;
  - every hash recomputed;
  - the owner's-index rows checked against the diff.
- **Suites, green before either gate:**
  - `cargo test --workspace --locked --features spatial-engine/fixture`, `cargo fmt --check` and `clippy`;
  - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`;
  - `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
  - CI green at the reviewed commit.
  - There is no shell diff; the shell suites run in CI only.
- **Operator:** none.
- **PR body:** asks for a merge commit, never a squash, and names T1's comment's branch commit.

## §10. Amendments

*(Opens empty; append-only.)*

### Amendment 1 — the closing record (class 1)

*Written after the outcomes were seen, by the custodian. PR #178 merged at 2026-10-05T18:28:39Z as merge commit f12a8eac3cdcf86262a7bed1791d8f9382aed89f, with parents cd539e7973af3d34e0abe2e1d966174dc7ae381b and bff3e21def3d57a238a87d305eae3e3fff094856. It follows the gate-1 architect's closing-record list, items 1 to 8, as filled at gate 2. References and hashes only. Nothing below is a quotation.*

1. **The PR and its heads:** PR #178; the merge commit above; the reviewed head bff3e21def3d57a238a87d305eae3e3fff094856, after correction round 1 of 2.
2. **The gate reports,** under `state/consults/gates/`: `2026-10-05-b1-engine-kernel-half-followups-gate1-architect.md`, `-gate1-reviewer.md`, `-gate2-architect.md` and `-gate2-reviewer.md`.
3. **Worker report 1:** `state/consults/2026-10-05-b1-engine-kernel-half-followups-worker-report-1.md`, by section, its deviations 2 and 3 included. The index update, applied as 7b05dfd6685c031102b298a17ed85a658949f3b7, is `state/consults/2026-10-05-b1-engine-kernel-half-followups-index-update.md`. The correction is bff3e21d.
4. **T1's observation commit** is 784a15c79bc818488b89fdc21008993ccadd6297, reachable through the merge commit. T1's recorded-mutation comment: `engine/src/stream.rs:3114-3118 @ f12a8eac3cdcf86262a7bed1791d8f9382aed89f sha256:50d7a94ccc87014240e40102d64b32c85c987829faef54a6c6f5de80dc732c18`.
5. **P1, P2 and P3** are discharged by the gate-1 reviewer's rows, by name. §7's count is that report's row: 286 of 360.
6. **The `kernel/tests/skp_projection.rs` half of `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, Amendment 1, item 1.4** is discharged by rows K-1 to K-8 at the merge commit. The gate-1 reviewer's row table is the proof. It is recorded here, not in the close-races form.
7. **Routed, one line each:**
   - the Publish stream row's missing `Dataset::resolve_projection` (index item 1) goes to the next piece that touches `engine/README.md`'s index;
   - `kernel/README.md`'s line for kernel halves filed elsewhere (index item 2, and the gate-1 architect's N-4) goes to `kernel-close-races-followups`;
   - the gate-1 architect's N-5 goes to the next piece that touches `engine/src/stream.rs`.
8. **Done:** PLAN marks the node done, with evidence `{pr: 178}`, in this amendment's commit.

**Superseded index.** None.
