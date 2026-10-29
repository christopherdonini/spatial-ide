# kernel-generation-close-races' routed items: the open_dataset sink comment, stale cites into skp.rs, B1's wire_bytes recorded-mutation comment, the engine-code prefix sites, SKP-V0's close_dataset paragraph and the kernel index line — preregistration

## Header

- **Status.** The preregistration of PLAN node `kernel-close-races-followups`. Committed before any code. Append-only once committed. An amendment written after any outcome has been seen says so in its first line.
- **Form.** Full form and full gating from dispatch (AUTONOMY §21a, wire and stated-guarantee categories; §25(e)). The piece edits `protocol/skp/SKP-V0.md` (`protocol/skp/**`) and rewrites the property §1's `close_dataset` paragraph states. No five-line form exists for this piece.
- **Authority:**
  - PLAN node `kernel-close-races-followups`, placed by question round 31, item 1 (RULED 2026-09-30). Drafting by the architect: question round 43, item 2.
  - Routed by:
    - `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, Amendment 2, row 11 (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:454-456 @ a1109023 sha256:51e56b7082b8538f9c1af879a1584ff0630267244ac6f92de6a25955962e2d6f`), carrying the worker's noticed-but-not-done list (`state/consults/2026-09-27-kernel-generation-close-races-worker-report-1.md:62-64 @ d4245fe sha256:b3899e2d9fa44d7539e2614513d03c10932212e99116f2cf198461408d95ee97`), and Amendment 1, item 1.4 (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:392 @ a1109023 sha256:179ea2c08c6952f1d08619755a0fd918b3f00ea39a6ba1fa431cb1a8085a16f7`);
    - PR #147's gate-1 architect, item 6 and N5 (`state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md:41-44 @ a1109023 sha256:06b6a5e9a80a0e815d79995750aadcf6df3360a87a00c6210c6fd800e86f562e`, `state/consults/gates/2026-09-30-ticket-liveness-redeem-gate1-architect.md:51 @ a1109023 sha256:df94127ea313607737b50c19ff8ea538e6a54f5108f3a7339b5149876730b9a8`);
    - PR #148's gate-1 architect, N1 (`state/consults/gates/2026-09-30-raw-path-refusal-code-gate1-architect.md:53 @ a1109023 sha256:fc397e135cc732ec1ff9793b8540985114fd641f2310f5815f432e86040bd2a2`);
    - the catalog form's intake row (`kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md:29 @ a1109023 sha256:da692aff50432dc1c4a533d18057f91fb4f2c43f96d341cb757e1789f014a0a2`);
    - `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, Amendment 1, item 7, second bullet (`engine/B1-FOLLOWUPS-PREREGISTRATION.md:283 @ a1109023 sha256:bf560d87c0cd4d45361400244eb232bb8ef4694c7efbaae0e1e12688facfda65`).
  - The owner's-index update: `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1, item 2.
- **Drafted by** the architect agent on the custodian's brief. Inputs: lead-data's impact read (`state/consults/2026-10-05-kernel-close-races-followups-impact-read.md`, sha256 80a69e996b41cb0cc333f57db63daf8fda1b68019837110ba96997d47f661424, read at e32798ae) and a re-read of main at a1109023. Read-only; the architect ran no command.
- **Reference form.**
  - Code and records at main are pinned `path:line @ a1109023 sha256:<hex>`.
  - A pin is historical. It is authoritative for the defect it names. The tree at the branch's base is authoritative for the edit, and the worker re-derives every site before editing (template §0).
  - Self-references are by section and item. The ledger is cited by round and item.
  - Every cite the piece writes into code names its target by item (function, type, test, section), never by line.
- **Branch.** `cut/kernel-close-races-followups`, cut from main in the product slot. It merges by a merge commit, never a squash, so that every commit the closing record or the index names stays reachable. The custodian sets `merge: merge-commit` on the node (AUTONOMY §27).

## §0. Disclosure

- **Read:**
  - the impact read;
  - the node, and `adr-035-close-races-note`, in PLAN.yaml;
  - the routing sources above;
  - `engine/B1-FOLLOWUPS-PREREGISTRATION.md` in full;
  - B1's gate-1 architect report;
  - ADR-035's Note 2026-09-25;
  - `engine/SOURCE-WATCHER-PREREGISTRATION.md` Amendments 1 and 2;
  - SKP-V0 §1, §3, §5 and §8;
  - AUTONOMY §21a to §21d and §25;
  - the template, Round 25 additions included;
  - the portability directive §2;
  - the code sites cited below.
- **What B1 already discharged.** B1's Amendment 1, item 6 discharges the `kernel/tests/skp_projection.rs` half of close-races item 1.4 (`engine/B1-FOLLOWUPS-PREREGISTRATION.md:280 @ a1109023 sha256:a6877021736eda3b0a6945a70e8d62f98e91833d85caae4559fc2da7804e310a`). B1's node split leaves this node `kernel/tests/wire_bytes_invariant.rs:368-372 @ b438c587 sha256:79d1171cc3961e365c1838c07a914b11ab534da6e7eb671a95950ede2e29b0f8` (B1 §2, node split).
- **The scope rule.** Every stale cite or false site claim in a comment of a file this piece edits for a routed item is in scope. A file the routed items do not edit is out, unless the human widens the piece (OPEN-1). The precedent is the cancel-state form's intake row (`protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md:35 @ a1109023 sha256:df77eaf53f12821a5fdfe9f09bb99ff9aa5e80da4ffb492d46fad8f937ea830a`) and B1 gate 1's S1-1.
- **Noticed, outside the files in scope** (OPEN-1 lists them):
  - `frontends/shell/src/streaming/liveTicketSet.ts:35-38 @ a1109023 sha256:6cb6a01c5239cb4eee9bace6f8c677adc20d9ed2992fdf81ee37918317c1ada1` calls `EngineSource::next_into` the single place a typed `EngineError` becomes the terminal's `String`;
  - `frontends/shell/src/streaming/liveTicketSet.ts:71-72 @ a1109023 sha256:8ca46f797ddc1e3d23d3174d3962319f0961367270389922d5725ca74cff6f3d` cites stale skp.rs lines, including a mint-race arm that close-races removed;
  - stale skp.rs line cites in `tileViewportStreamManager.ts`, its test, `App.tsx`, `pool_poll.rs`, `engine/tests/admission_p4_corpus.rs` and `kernel/tests/no_generation_in_persisted_artifacts.rs`;
  - `frontends/shell/src-tauri/src/lib.rs:423-427 @ a1109023 sha256:b85707d7cce010dfec08b92dc8a954c374df76420ec83e96012db2d3a61c73ca`, whose own comment cites a stale line for the `SkpHost` construction.
- **Fixture drive:** nothing is measured.

## §1. What this preregistration may and may not claim

- **No product behaviour change.** Product source changes only in `//`, `///` and `/** */` comment lines.
- **No wire change.** No literal, key, value, code or command changes. `protocol/skp/src/`, `protocol/skp/tests/` and `protocol/data-plane/` have empty diffs.
- **No performance number** and no docs/08 row. No ADR-018 vocabulary. No new operator-visible text.
- **ADRs cited, none amended:** ADR-035 (its Note 2026-09-25), ADR-004, ADR-018. ADR-019 is Proposed and binds nothing.
- **May not claim anything about a session reference no client holds:** not that one can exist, and not that one cannot. Whether ADR-035's Note 2026-09-25, SKP-V0 §3's third minting rule or SKP-V0's second note to the `skp/0.3` entry has become historical is for PLAN node `adr-035-close-races-note`, which waits on the human's ruling and has not run.
- **May claim, for `close_dataset`, only the catalog form's reading.** A ticket's registry entry holds the dataset by name. A live stream holds no `Arc<Dataset>`. A pool lease in flight keeps the pool alive until it is released (`kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md:39 @ a1109023 sha256:901de57e6341331155fde043dadd4ffa1d2aa754713cceba3936310d36e90762`). Conditional on OPEN-2 (A).

## §2. The change

For every item below, the content is binding and the wording is the worker's.

### C1: S1, the comment in `open_dataset`'s sink, `Admitted` arm

- **Site:** `kernel/src/skp.rs:1139-1143 @ a1109023 sha256:01bdf700d318cb3e847bcd3455a8f313164411e7cdccd05d3d7745a1fd848e61`.
- **The rewording states:**
  - this arm is reached only after this call's admission minted the dataset's generation, under the latch and before the latch is set to `Admitted` (`kernel/src/skp.rs:1240-1244 @ a1109023 sha256:a85a7519cea5206fcb25e9c76b535444db4806f83876bc0bec8afbe31050cc9d`, `kernel/src/skp.rs:1274-1277 @ a1109023 sha256:5f72361ae88f2e7b20586cb4ff3e229ea55db91862a1195c905284e59ee03705`);
  - that generation carries the `SessionRef` this call returns on `OpenDatasetResponse.session` (`kernel/src/skp.rs:1292-1295 @ a1109023 sha256:cd912cc0c606e38da14b4e51a5753d534f1560aa1e98dd881cce7c97bdd86ae5`);
  - the lock-order sentence stays.
- **It drops** the bare Amendment 1 reference and the clause about a reference no client holds. If the invariant that every generation carries a kernel-minted `SessionRef` is named, it is cited as question round 22, item 1, by round and item.
- **It does not state:**
  - anything about a reference no client holds;
  - that a client holds the returned reference (that is the shell's fact);
  - anything about ADR-035, SKP-V0 §3 or SKP-V0's 2026-09-25 note (§1).
- It may name `ticket_drop_under_lock_regression::the_close_race_mints_no_generation_so_no_unheld_reference_exists` (`kernel/src/skp.rs:4205 @ a1109023 sha256:51baab97b6d8f0e201ce71103508fcf28a0a099d55bb1c0b0758a345faf5951c`) as the pin of the close race, by test name only.

### C2: S2, `SkpHost::generations`'s doc

- **Site:** `kernel/src/skp.rs:1086-1093 @ a1109023 sha256:e21beb38d5f52d7ed57a137e12caa5598d06fad8a8b295c3d57b6dae22ddca15`.
- The bare `SkpHost::new` line becomes `SkpHost::new` by name (`kernel/src/skp.rs:1054-1071 @ a1109023 sha256:ecc7de42816d8b5afa7db48961ece16b9ead001cc02e1c20ec07b6eeadf23b69`).
- The product caller is named by item: the `EngineSourceFactory::ticket_only(catalog, tickets, host.generations())` call in the `serve(DataPlaneConfig { .. })` call of `frontends/shell/src-tauri/src/lib.rs`'s `run` setup, with no line (`frontends/shell/src-tauri/src/lib.rs:428-432 @ a1109023 sha256:a61285d9ae670445e4f63191112ce897a97baf4bcea221b6953d17a53137d076`).

### C3: S5, two cites of SKP-V0 line 266

- **Sites:** `kernel/src/skp.rs:1704 @ a1109023 sha256:fa288366f2e2d230c63013840b8b9f9943842d7da81e2da736bdd1188c7a733f` and `kernel/src/skp.rs:2070 @ a1109023 sha256:d7f4b7a1edb517aa1f9b54c2156dd5256ce273fb9fc09245da37af9f11b7b01e`.
- Each is repointed to SKP-V0 §5's `code` rule by section, with no line (`protocol/skp/SKP-V0.md:325-329 @ a1109023 sha256:dcdbb44b32babecd83e7b9909ecba9be2ec557fd71071a1c57e70d1db1933821`).

### C4: `TicketLiveness`'s doc, in skp.rs

- **Site:** `kernel/src/skp.rs:539-544 @ a1109023 sha256:c04f3d3dc3b0cd3d3f0e5b52a9a3604c0383d284fb2aac0c2b5a3cb46e14a138`.
- **The defects.** Its ledger line cite no longer lands on the ruling. The words it quotes are the ADMISSION form's (`engine/ADMISSION-PREREGISTRATION.md:741-744 @ a1109023 sha256:ad7d29465286e6f02e2a1358ac30b43f6eb5134b53fd2b0dd51e9286f33e1674`), not the human's. Its quotation also differs from that source in its inner quotation marks.
- **The fix.**
  - The ruling is cited as question round 4, item 1.
  - The words are attributed to the ADMISSION form at its existing cite.
  - The passage is either byte-identical to that source or unquoted paraphrase.
  - The `engine/ADMISSION-PREREGISTRATION.md:742-744` token stays, as PR #147's gate found it accurate.

### C5: `terminal_detail_of`'s doc

- **Site:** `kernel/src/skp.rs:2010-2013 @ a1109023 sha256:6b3090ae741bf628088ce20d708f8d4ddc5981470a01af99e9d707aa04291c61`.
- It names where the kernel hands an engine refusal to the data plane as a `String` at the base:
  - mid-stream, at `EngineSource::next_into` (`kernel/src/lib.rs:684 @ a1109023 sha256:2da3ec86e18496746925ea1883cad0571bce32bdaad5868cebe17846c108ebd3`);
  - at create time, in `EngineSourceFactory::create_from_raw_params` (`kernel/src/lib.rs:432 @ a1109023 sha256:6532e03e1866bbbbc5b9d4ecb7f1fe1b36ad03b7869c01ca9181149a221091c6`);
  - at create time, in `EngineSourceFactory::liveness_refusal`'s two dead-ticket arms (`kernel/src/lib.rs:513 @ a1109023 sha256:c440197a23b2681e475cb66214179e1bc13c87ffe0b1c14000688960905a1cdb`, `kernel/src/lib.rs:526 @ a1109023 sha256:af533bbdb7815b41a7db4cac9844ba53a5af214b6109646c0bdcbd566d414e44`).
- Each calls this function, which stays the one place the prefix is built.

### C6: S7 and S8, `kernel/tests/session_generation.rs`'s comments

Each cite is repointed by item, with no line:

| Site @ a1109023 | Target, by item |
|---|---|
| `kernel/tests/session_generation.rs:310 @ a1109023 sha256:b1d2a4b11905dc9e42083196b78daa5ca0cf17612f040dcb2da453939f89b18b` (ledger line) | question round 4, item 1 (its class fix) |
| `kernel/tests/session_generation.rs:311 @ a1109023 sha256:151ff22a7aaa7c61a2851fb21a2817d698cc0d8ace532fc6a61e26dbf451fb01`, `:406` (shell `lib.rs` lines) | the shell's `run` setup, the `ticket_only` call (as C2) |
| `kernel/tests/session_generation.rs:313 @ a1109023 sha256:0ddd9c26bb52caafe6c122d78e9c7ba644f43f92fe3964e538d94ec0cae95dd9`, `:407` (`server.rs` line) | the data plane's START arm, its `factory.create` call (`protocol/data-plane/src/server.rs:508 @ a1109023 sha256:7b55bc06d13afcc18aabdcb2e0493a4010987dfa021486be7ec68465a5dd2c7e`) |
| `kernel/tests/session_generation.rs:317 @ a1109023 sha256:7b4f2c7f86d6387269e97fd03766cdefe0e561c9d3e51f70668f279fa714f20e` | `typed_terminal_codes.rs`'s `fixture` |
| `kernel/tests/session_generation.rs:336 @ a1109023 sha256:9bed851574c6ac7f6b96df328c14ba212989a997c3079aba2756a3e0f13e64ba` | `typed_terminal_codes.rs`'s `touch_modification_time` |
| `kernel/tests/session_generation.rs:353-354 @ a1109023 sha256:c8f7e5bfd59ef0c234a856ca08e3c0c8216dc9bbb168d1a517afebbba87d518f` | `SkpHost::viewport_query`, and its `open_engine_stream` refusal arm that ends the generation on `EngineError::SourceChanged` |
| `kernel/tests/session_generation.rs:427 @ a1109023 sha256:3a8a67939202b14dbd29b19917f660784351bc67525eb161422a144518c753a9` | `StreamRegistry::redeem` |
| `kernel/tests/session_generation.rs:476-477 @ a1109023 sha256:247054239579e93671c47e1b7b88cd802fbcd1d605602931b0b4a952971c7792` | `GenerationRegistry::prune_locked` and its doc's condition 1 |

Also: T1's assertion message names the shell function by its current name, `isSessionEndedTerminal` (`kernel/tests/session_generation.rs:419-420 @ a1109023 sha256:be5e31ac6cf8642901f5796177f2dfa32da75bfe2c93577d04ac82dabe09aeb6`). The assertion's condition is unchanged. This is a test-text claim correction (template class 3, its named exception).

### C7: S9, B1's recorded-mutation comment in `kernel/tests/wire_bytes_invariant.rs`, a re-observation

- **Site:** `kernel/tests/wire_bytes_invariant.rs:368-372 @ a1109023 sha256:79d1171cc3961e365c1838c07a914b11ab534da6e7eb671a95950ede2e29b0f8`.
- **Shape:** B1's K-row shape (B1 §2, the skp_projection.rs paragraph).
  - The mutation text is unchanged.
  - The comment gains the 40-hex id of the commit it is re-observed at: the branch's base, a commit on main.
  - The bare self-line is dropped. The comment carries the failing assertion's message as observed, with no line number.
- **The re-observation:**
  - made on a `git archive <base>` export with its own `CARGO_TARGET_DIR`;
  - the mutation applied in `engine/src/envelope.rs`'s `BatchEnvelope::build`;
  - `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too` run with the workspace suite's features;
  - its failure recorded by name, then the mutation reverted.
- The test code at the base equals the branch's, because only comments differ.

### C8: S14, `formatTerminalRefusal.ts`'s doc

- **Site:** `frontends/shell/src/streaming/formatTerminalRefusal.ts:9-11 @ a1109023 sha256:3fc4312d9dbc146e7bccefc0d86356d3070dfd50b0faa6c45db0e8d2020259a7`.
- It no longer names one kernel site. It names `kernel/src/skp.rs::terminal_detail_of` as the builder of the prefix, applied wherever the kernel turns an engine refusal into a terminal's detail, both mid-stream and at create time.
- It enumerates no site and states no count. The site list lives in C9's note.

### C9: SKP-V0

**In place, §1's `close_dataset` paragraph** (conditional on OPEN-2 (A)).
- Its second sentence (`protocol/skp/SKP-V0.md:134-136 @ a1109023 sha256:2f066ecdc959ac31f4c8a48640eae06db7c8c3de363021a1b9c7598fd429b468`) is replaced by §1's `close_dataset` reading.
- Basis: §8's rule that §§1–7 are updated in place where a version note says so (`protocol/skp/SKP-V0.md:541-544 @ a1109023 sha256:e5b423c4a697d4d3f1b19b4da89f1380c98157515c2eefcfc3899ef2b06e1f64`). The precedent is the 2026-10-02 note (`protocol/skp/SKP-V0.md:969-977 @ a1109023 sha256:ed667b255499965fcd65d1fe456be8254c4ef8e3773c62f39dc5b818479b98b9`).
- The paragraph's first sentence stays.

**One dated note, no literal change, appended at the end of §8**, after `protocol/skp/SKP-V0.md:979-985 @ a1109023 sha256:896d6ee2a936209adb2489b440f8deca87004a8abcc059cfbc5d60e75e24bd26` and before §9. It states:
- **(i)** The `skp/0.3` entry's refusal-surfaces bullet (`protocol/skp/SKP-V0.md:755-757 @ a1109023 sha256:6b307f1a19cc9d67674331329d7cd858febd206ef96ce3bce7290c8a8202cc47`) names `EngineSource::next_into`. At the base commit, which the note names, `terminal_detail_of` is called from three product functions: C5's three. The shape is the same at each, and the bullet is not edited.
- **(ii)** §1's `close_dataset` paragraph was corrected in place, and why (conditional on OPEN-2 (A)).
- **(iii)** No literal, key, value, code or command changes, and `protocol/data-plane/` has an empty diff.

**Not edited:** the `skp/0.3` bullet, the stale `:266` token at `protocol/skp/SKP-V0.md:689 @ a1109023 sha256:1d0ffd4241cb57055023c5a9d9bcad63cb260f80037f4cc799b92a3e2f517ef1` (append-only), and everything in §8 above its end.

### Owner's index (`kernel/README.md`, applied in the PR, lead-data's text)

- `Last verified at` (`kernel/README.md:350 @ a1109023 sha256:2331118405392987537813d621ccdbd22b7a7ab773aa9b8fe5bc74eb7f845e35`).
- Governed by → preregistrations in this module, which gains this form (`kernel/README.md:374 @ a1109023 sha256:02d809e8e9d784d1017eb8ffa10bc15b62af447ed9823a8aa68170cae0f5aa56`).
- Governed by → kernel halves of pieces filed elsewhere, which gains `engine/B1-FOLLOWUPS-PREREGISTRATION.md`. This is B1 Amendment 1, item 7, and B1 gate 1's N-4 (`kernel/README.md:376 @ a1109023 sha256:137ba3d202e2bb39d01727a4c379523ab2c87cd74ad56d343e7fced618283c3c`).
- No interface pointer moves, so lead-data confirms the Interfaces rows against the diff. The index stays within its 60-line cap.

### Portability

The feature is not OS-dependent, so R3's section is not required.
- **R1:** no semantics change.
- **R2 and R4:** no `cfg`, and no path literal.
- **R5:** no level claim.
- **R6:** no new ignore.

### KNOWN-LIMITATIONS

No item is owed. No user-visible behaviour changes and nothing is reduced.

## §3. Fixtures

None new. C7 uses the test's own fixture at the base.

## §4. Tests, and the mutation per new test

No new test. Every mutation is applied, the named test is run, the failure is recorded by name with its commit, and the mutation is reverted (round 25, item 2 (c)). No `verify-mutation` run is an observation.

| Row | Test | Mutation | Observed at |
|---|---|---|---|
| W-1 | `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too` | As written at `kernel/tests/wire_bytes_invariant.rs:368-369 @ a1109023 sha256:416e928941b7ca02ace15f51de0db26ef47197c64c7069d38813f05141364cf1`; unchanged | the base commit, named in the comment; re-made by the reviewer |

**Changed tests, comments only, assertions unchanged:**
- `a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code` (also its message, C6);
- `an_unknown_handle_falls_through_to_the_ticket_registrys_own_refusal`;
- `the_dead_ticket_record_is_bounded`.

**Declared unchanged** (OPEN-3 (A)): T1 to T3's recorded-mutation texts (`kernel/tests/session_generation.rs:357-361 @ a1109023 sha256:c1711020b37de783455d2ec098d89320d796c81ebd11beedfb3894b80b38c7f1`, `kernel/tests/session_generation.rs:432-439 @ a1109023 sha256:ad633125ae2f925dc9d4d693dd739c8c70349cc28abdaedc54f3a5fc9e8aadde` and `kernel/tests/session_generation.rs:483-485 @ a1109023 sha256:c227991c7b786c573a212f5ae4bbf1f6ee1430e59e33805ce0b9de5e8c35a355`). They name `create_from_ticket`, which composes `liveness_refusal` (the reading in PR #147 gate 1's N3).

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions:**
- **P1.** The workspace suite at the head has the base's passed, failed and ignored sets, unchanged.
- **P2.** W-1 fails by name at the base under its mutation, at the per-frame byte-comparison assertion.
- **P3.** At the base, the product callers of `terminal_detail_of` are exactly C5's three functions.
- **P4.** At the base, the holder grep finds no stream-held `Arc<Dataset>`. The grep is `git grep -n "Arc<Dataset>" -- engine/src kernel/src protocol frontends/shell/src-tauri/src`, the catalog form's §6 item 3.

**Declared unchanged:**
- every non-comment line of product code;
- every assertion condition, fixture and test name, and every message except C6's;
- `kernel/tests/skp_projection.rs`;
- SKP-V0 outside C9;
- the close-races, B1, catalog, cancel-state and source-watcher forms;
- every ADR;
- `KNOWN-LIMITATIONS.md`;
- `Cargo.lock`.

**Invalidators (stop and return to the architect; nothing is adjusted to pass):**
- a product non-comment line must change;
- an assertion condition must change;
- W-1 survives at the base;
- P3 or P4 fails;
- C1 cannot be made true without a statement §1 forbids.

**Falsification.** `close_dataset`'s safety, as §1 states it, is shown to depend on a stream-held `Arc<Dataset>`.

## §6. Instruments

All are assertions or readings: one re-made mutation, a grep and a call-site read. None is a measurement.

## §7. Declared values and ceilings

No constant is added or changed. `TICKET_TTL` and `TERMINAL_ENTRY_MAX_AGE` are named only.

**Line budget, by §21c's rule** (insertions plus deletions, tests included; this form and generated files excluded):

| File | Ceiling |
|---|---|
| `kernel/src/skp.rs` | ≤ 60 |
| `kernel/tests/session_generation.rs` | ≤ 40 |
| `kernel/tests/wire_bytes_invariant.rs` | ≤ 12 |
| `frontends/shell/src/streaming/formatTerminalRefusal.ts` | ≤ 10 |
| `protocol/skp/SKP-V0.md` | ≤ 24 |
| `kernel/README.md` | ≤ 6 |
| **Total** | **≤ 152 over these 6 files** |

Conditional rows: OPEN-1 (B) adds `frontends/shell/src/streaming/liveTicketSet.ts` ≤ 16, so the total is ≤ 168 over 7 files. OPEN-3 (B) adds ≤ 20 to `session_generation.rs`.

**Counting command, at a named commit:** `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- <the files above>`. An overrun is class 8, and this section is never edited.

## §8. Block-on-sight (each checked separately)

1. A non-comment change to any product line, Rust or TypeScript.
2. A new `pub` or `pub(crate)` item, option, callback or code path (the caller rule).
3. An existing assertion condition, fixture or test name changed, or any message other than C6's.
4. A path in the diff outside §7's list and this form. `protocol/skp/src/`, `protocol/skp/tests/` and `protocol/data-plane/` are shown empty.
5. In SKP-V0, anything beyond C9's in-place sentence and one dated note at §8's end. Also any change to a literal, key, value, code or command, or an edit to the `skp/0.3` bullet.
6. C1, or any comment, that states anything about a reference no client holds, or calls ADR-035's Note 2026-09-25, SKP-V0 §3's third minting rule or SKP-V0's 2026-09-25 note historical, superseded or obsolete.
7. A repointed cite that carries a line number, a new rooted line token in a comment, or a line cite into the ledger.
8. Quotation marks around text that is not byte-identical to its named source, comments included (C4).
9. Any text that calls a prefix site the only one, or a site list in the note that is not stated at a named commit.
10. `close_dataset` text that states a property beyond §1's catalog reading.
11. A rewritten recorded-mutation comment without the commit it was observed at, or with a line number. A record that calls a `verify-mutation` run an observation.
12. An edit to an ADR, to any form §5 declares unchanged, or to `KNOWN-LIMITATIONS.md`.
13. A record hash at a branch commit. A test-text span named without its commit id (round 25, item 2 (d)).
14. The word zero-copy, a performance number or a timing assertion.
15. A new `cfg`, platform ignore or path literal (portability R4 and R6).
16. A `kernel/README.md` change outside the three index lines in §2, or an index over 60 lines.

## §9. Gates

**Architect** (full gating):
- §8, item by item;
- C1 against ADR-035's Note 2026-09-25, SKP-V0 §3's third rule and SKP-V0's 2026-09-25 note, with `adr-035-close-races-note` unrun;
- C9 against §8's append-only rule and the 2026-10-02 precedent;
- C9's `close_dataset` text against the catalog form's §1 item 3;
- C5's and C9's site lists against the base;
- verbatim quotes and discharge claims resolved;
- the round-25 checks: class 8 against §7; class 9 for any addition; the mutation wording; test-text spans.

**Reviewer:**
- the full diff with `origin/main...HEAD`, with the three protocol paths shown empty, and every hunk shown to be a comment, the C6 message, or SKP-V0 or README text;
- §7's count by its command;
- W-1 re-made at the base;
- P3's call-site read and P4's grep, at the base;
- every repointed cite resolved by item at the base;
- every hash recomputed;
- the index lines checked against the diff.

**Suites, green before either gate:**
- `cargo test --workspace --locked --features spatial-engine/fixture`, `cargo fmt --check` and `clippy`;
- the shell's unit suite and type check, as Product CI shell runs them;
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`;
- `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
- CI green at the reviewed commit.

**Operator:** none.

**PR body:** asks for a merge commit, never a squash.

**Closing record (after the merge; references and hashes only):**
1. The PR, its merge commit and the reviewed head.
2. The gate report paths.
3. The worker report, by section.
4. W-1's observation commit, and the rewritten comment pinned at the merge commit with its hash.
5. Each routed item marked done names its proof:
   - row 11's first bullet by C1, C2 to C6 and the pinned comments;
   - item 1.4's `wire_bytes` half by W-1's row and the pinned comment;
   - PR #147's item 6 by C2;
   - PR #148's N1 by C8 and C9 (i);
   - the catalog row by C9 (ii);
   - B1's item 7 by the index line.
6. §7's count.
7. PLAN done with `{pr}` in the done commit only.

## §10. Amendments

*(Opens empty; append-only.)*

### Amendment 1 — question round 59's rulings (OPEN-1 (B), class 9; OPEN-2 (A); OPEN-3 (A)); the product-first direction's placement

*Written by the custodian after question round 59 was answered and before any code: no branch exists. The rulings are `state/directives/2026-10-05-round-59-rulings.md`, lines 6 to 8 (sha256 7e0d9047b48daeca52842ece54dc45073747a980fd39bc8cce68f596be1ec263, f3fab5a6f11323ce7c42e8cbb573c9fbe1731f3251d829a9f317d071d9ae0740 and df1d060380d870652992e177b987ac9486e2aee2e0cfa97b5541cc59d7fdec58, one per line, at the commit that adds it), with their RULED block in `DECISIONS-PENDING.md` under round 59, referenced and not restated. The placement is the 2026-10-05 product-first direction, with its fragments and clarification (their RULED block). Nothing below is a quotation.*

1. **OPEN-1, (B), class 9.** `frontends/shell/src/streaming/liveTicketSet.ts` joins the piece, comments only:
   - **C10.** Its single-site claim (the draft's OPEN-1, first bullet) is reworded as C8 rewords `formatTerminalRefusal.ts`'s doc. It names `kernel/src/skp.rs::terminal_detail_of` as the builder of the prefix, enumerates no site and states no count.
   - Its stale cites into `kernel/src/skp.rs` (the draft's OPEN-1, first bullet) are repointed by item, with no line.
   - §7's OPEN-1 (B) row applies: `liveTicketSet.ts` at most 16, and the total at most 168 over 7 files. §8 item 4's path list includes the file. §1's no-behaviour-change claim covers it.
   - The stale line cites in the other files the draft's OPEN-1 lists are routed to the proposed node `skp-line-cites-outside-close-races`, and are not edited here.
2. **OPEN-2, (A).** C9's in-place sentence and its note's item (ii) are binding, and no longer conditional.
   - The second sentence of SKP-V0 §1's `close_dataset` paragraph is replaced by §1's may-claim reading and nothing more. The first sentence stays.
   - The one dated §8 note records the correction and states item (iii).
   - §8 item 10 applies.
3. **OPEN-3, (A).** §4's declared-unchanged line for T1 to T3's recorded-mutation texts stands. Their re-observation is routed to the proposed node `session-generation-t1-t3-reobservation`. §7's OPEN-3 (B) row does not apply.
4. **Placement.** The piece yields slot 1 to MP-1. In slot 2 it comes after the two context-flush pieces, and its branch starts only when its paths are disjoint from slot 1's piece. MP-1's form edits `kernel/src/skp.rs`, `protocol/skp/SKP-V0.md` and `kernel/README.md` (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, §2), which this piece also edits, so it waits while MP-1 holds slot 1.
5. **Gates:** the 2026-10-05 product-first direction's section 2 (proportional gates) applies, by reference.
6. **The owner's index:** lead-data's update for this piece (the second pilot's piece 3) stands, applied in the pull request before the final gate.

**Superseded index.**
- §2's parts conditional on OPEN-1 (B) and OPEN-2 (A) → items 1 and 2, binding.
- §7's conditional rows → item 1. The OPEN-1 row applies, and the OPEN-3 row does not.
- §9's gates → item 5 adds section 2, by reference.

### Amendment 2 — the closing record (class 1, with a class 2 correction of §0's mint-race premise)

*Written by the custodian after the outcomes were seen. PR #186 merged at 2026-10-07T16:24:08Z as merge commit 6288cccc08b56b0c975812a5632165b98e60ee0e, with parents d87cdc3c2e891e64d91967f9551b7203490f6933 and 82140fe0142b0f1a5d72ba65f9aaee5558ac17f6. It follows §9's closing-record list. References and hashes only. Nothing below is a quotation.*

1. **The PR and its heads:**
   - PR #186, at the merge commit above;
   - both gates' reviewed head, 78e52eea6460f9eb0dcffa3af3cb37a25b1f85ca, at generation 2;
   - the merged head, 82140fe0. Over the reviewed head it adds:
     - the gate-1 Documentation fixes, f143267473cc5e956fca704c512e8a6876389836 and a1ab83ec6440cb03d7f3a641faafd4f5eca32ac1, each checked by the custodian against its finding (worker report 3);
     - the merge of main, a06f69f8f28b549cedb9b1d6e44d95995e1b72ba (item 8);
     - one wording line, 82140fe0.

     CI was green at 82140fe0.
2. **The gate reports,** under `state/consults/gates/`:
   - `2026-10-07-kernel-close-races-followups-gate1-architect.md`, pass with notes, gate-log 429, sha256 f1639bc0e984c687246d25d7d6bbd0944699d644be24c119b5a94420abfbaecd, added in d6e3801ae16dd8d1465f782203b5708d75ba18f7;
   - `2026-10-07-kernel-close-races-followups-gate1-reviewer.md`, pass, gate-log 430, sha256 01f49b70c4c8cc7c80896de40ba3269fb6eab4f571fd1cf028c21cf6ad063e82, added in f646f0c05c908541d5561ab8b9b41feca06319e6.
3. **The worker reports, each pinned at the commit that added it.** Each hash is of the whole file, and each file is byte-identical at the merge commit:
   - `state/consults/2026-10-07-kernel-close-races-followups-worker-report-1.md`, at 3cf310ef94e5ca679d4246acd2e883231f7dcd01, sha256 6477ab689693a28815302895054054188a185852d9e36eeaf917fe96e3ce8164;
   - `-report-2.md`, at 19bc2c22ffe06f379747963ecf547aaad552f29b, sha256 7d1f743d808efed92bc2dd81f64e975a02947d395f8012b939142ba13d7e9226;
   - `-report-3.md`, the gate fixes, at bf9aff4982a4790aad85735f81581d7f21354cae, sha256 94b3c2b535845a2b8f18fe29ec4e48a51a964a0ab4e08f8a5edd6f7b2e1d37c1.

   Lead-data's owner's-index update is `state/consults/2026-10-07-kernel-close-races-followups-index-update.md`, at 6930c1fb16fe9ea2d56127ef201fd0968c08abd8, sha256 1e2ff8492024e4b8fedbcac7be345e10aabee32b44c43cd1960ef21d0ca55b56.
4. **W-1:**
   - **Observed** at 99f4c437e81ad3286a9f388ea466e3f76d322556 (worker report 1).
   - **Re-made by the reviewer** at that same commit, as the gate-1 architect asked this record to cite. The mutation was applied, the test run alone by name, and it failed as recorded (the reviewer report's W-1 section and its checks table).
   - **The rewritten comment:** `kernel/tests/wire_bytes_invariant.rs:368-373 @ 6288cccc sha256:2f5229b5da72d2c885cf29663fd78e93850c3ebc573702be164320a278e5e021`.
5. **The routed items are done,** each with the proof §9's closing-record item 5 names for it, at the merge commit. C10 (Amendment 1, item 1) discharges the OPEN-1 (B) addition.
6. **§7:** 113 changed lines (68 insertions, 45 deletions) over 7 files, against at most 168 over 7 (Amendment 1, item 1). Each file is within its row. The count is `git diff --numstat d87cdc3c 6288cccc`, which lists the 7 files and no other.
7. **Class 2, §0's mint-race premise is corrected** (the reviewer's D1). §0's noticed list says close-races removed a mint-race arm. It did not: the arm is still in `SkpHost::viewport_query_attribute`. The fix names it by item in `isSessionEndedRefusal`'s doc (the architect's D-3 and the reviewer's D1). §0 is not edited.
8. **The merge of main** (a06f69f8), after PR #185 merged. The custodian resolved two conflicts:
   - in SKP-V0 §8, #185's `skp/0.10` entry comes first, and this piece's dated note follows it, directly before §9;
   - in `kernel/README.md`, the kernel-halves line is the union, and Last verified at keeps main's 70bcb329, where both added files exist.

   No product line moved, so the gate verdicts carry forward. The custodian's ledger entry of 2026-10-07, 04:19Z, records the checks.
9. **The Documentation findings fixed before the merge:**
   - the architect's D-1 to D-3;
   - the reviewer's D1 and D2.

   They were fixed in f1432674 and a1ab83ec, each checked against its finding.
10. **Done:** PLAN marks the node done, with evidence `{pr: 186}`, at generation 3, in this amendment's commit.

**Superseded index.** §0's noticed list, its mint-race clause → item 7. §9's closing-record list → items 1 to 10. Neither is edited.
