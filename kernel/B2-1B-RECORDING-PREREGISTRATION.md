# B2 piece 1b, recording: the kernel's step commands for filter, scope and style; the session history on the machine, safe against a crash; and the docs/07 note (full form)

- **Authority:**
  - PLAN node `b2-piece-1b-recording`.
  - The brief, `state/directives/B2-BRIEF-2026-10-07.md`, §8, §9, §10 and §11. Its 1b row is `state/directives/B2-BRIEF-2026-10-07.md:141 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:07de85ee33df08477650e3fe5a56e4ada426086a405109416e5e10f0df0cc16f`, and its open items are `state/directives/B2-BRIEF-2026-10-07.md:182 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:7b509919b50279e6d879a32b6a64f7915c5abf2cd9cbd097817dc35c6364c31b`.
  - The human's evening rulings of 2026-10-07: `state/directives/2026-10-07-b2-brief-and-evening-rulings.md:16-19 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:411ad3fc24c48f6068f194c8a7f681582499f9761f5de980aa9f206e7ed1384c`.
  - Round 70, OPEN-2 and OPEN-3: `state/directives/2026-10-08-round-70-rulings.md:8-20 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:a10abcbf6ece77d24e411cacf3e3e813341beb6bf1023a24c260ffa8ce1ef95e`.
  - ADR-036's ten findings and the route: `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:12 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:494055e474f5543f9d00ef6b79571e5170518958fb8e29bd29aaae1f635a9200`, `:16`, `:18` and `:30`, each pinned the same way. The barrier restatement, which governs over ruling 5's sentence, is `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:42-44 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:a43dc2061dbe15fa1759ca2079d5582a2223e996b0dbf36d143fee84e04aabad`.
  - Slot 2's order: `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:36 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:b9d820912b82dca112a33a3ef86fa8a9cad3f81b4a709b07886834be56a62e6b`.
  - The impact question before code: `state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:11 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:2c6613d9519de90cba8da9828939d4d339557248a17ff64853d528f77100ae8f`.
  - Piece 1a's form, Amendment 2, item 5 (the routing).
- **Drafted by:** the architect agent, alone and ahead of time (the 2026-10-10 direction, item 7), while `guardian-v1` waits for the human's merge. Read at main b2c71d738c37831c206ab2fc26f31e4b2ace7daf.
- **Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Code starts only after all of these:**
  - `shell-migration-milestone-2` has merged;
  - the impact question of §0.4 is answered and recorded in Amendment 1;
  - each OPEN item named against that code in §2.12 is ruled.
- **Form and gating:** the full form, with full gating from dispatch (AUTONOMY §21a; §25(e)). It touches four of §21a's categories: an ADR text (ADR-036, still Proposed), the wire (a new SKP command), a stated guarantee (crash safety; ADR-006 class 2), and §21c's size. A five-line form is not possible.
- **Guardrails** (the 2026-10-12 brief, §4 item 3; `state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md:41-45 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:7bd73bbc96198529cb3e66782e91eb81293329e108bc0effb0cac4dc392db504`):
  - R1: the new SKP command names no space. Its intent carries a predicate text and style values only.
  - R9: no registered action has a parameter that carries coordinates.
  - The steps write ADR-036's `dependencies.crs` and the epoch exactly as ADR-036 defines them. The 2026-10-12 consult found that this meets neither R1 nor R2. Nothing here changes it; it stays open for the human (OPEN-9).
- **Path to this file:** `kernel/B2-1B-RECORDING-PREREGISTRATION.md`.

## §0. Disclosure

**0.1 Inputs.** No pilot, spike or corpus. Nothing measured. The 5 GB fixture is not used.

Read at b2c71d73:
- the brief; piece 1a's form (all of it); ADR-036 (Proposed); ADR-006; ADR-022;
- milestone 2's form, §0.4 to §2.8;
- the two ADR-036 consults: the reuse findings of 2026-10-08, and the two checks of 2026-10-12;
- the guardrails brief; PORTABILITY §2;
- SKP-V0 §4 and §5;
- the code pinned below.

**0.2 The reuse index (the standing step).**
- **The run.** The custodian ran `node tools/reuse.mjs` in christopherdonini/spatial-ide-reuse at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, the tool at that commit, for five queries in this order: session history, crash recovery, undo, step record, journal. Seven lines were printed. The custodian appends them beneath this item, byte-copied by script and marked. This form does not reproduce them.
- **How the lines map to the queries.** This is the form's reading of the order. The tool does not print the mapping, and the custodian confirms it from the run:
  - session history: one line;
  - crash recovery: one line;
  - undo: one line;
  - step record: three lines;
  - journal: a miss.
- **What the form takes from each capability.** Concepts only. No code, no dependency.
  - `append-log-torn-tail-recovery` (worth-owning, P0). A torn last line is known by its missing LF, and recovery stops at the first line that fails. This is ADR-036 §9's longest-valid-prefix rule, ruled as finding 3 (§2.7, block A), and tests U1 to U3 cover it.
  - `undo-merge-collapse-keys` (worth-owning, P0). Each action declares a key, and steps merge by it. This is finding 5 (block B).
    - 1b declares the keys in ADR text only. Compaction is piece 2's.
    - The session history keeps every step.
  - `format-forward-compatibility` (worth-owning, P0). One opaque slot, kept byte for byte. This is finding 6 (block D), and U4 covers it.
  - `processing-history-record` (open, P1). It is a record of processing steps, which ADR-036 §7 keeps for pure transformations. None exists yet, so it is not used.
  - The miss for `journal` is noted and does not block.
- **The printed lines,** byte-copied by the custodian's script from that run, in the query order. The custodian confirms the mapping above from the run: session history one line, crash recovery one, undo one, step record three, journal a miss.

  ```text
  capability: append-log-torn-tail-recovery → LevelDB [CONCEPTUAL], RocksDB [CONCEPTUAL], etcd [CONCEPTUAL], SQLite [CONCEPTUAL], nedb [REJECT]   (worth-owning, P0)
  capability: append-log-torn-tail-recovery → LevelDB [CONCEPTUAL], RocksDB [CONCEPTUAL], etcd [CONCEPTUAL], SQLite [CONCEPTUAL], nedb [REJECT]   (worth-owning, P0)
  capability: undo-merge-collapse-keys → Qt QUndoStack [CONCEPTUAL], QGIS [CONCEPTUAL], prosemirror-history [CONCEPTUAL], @codemirror/commands [CONCEPTUAL], kafka [CONCEPTUAL], tldraw [REJECT]   (worth-owning, P0)
  capability: undo-merge-collapse-keys → Qt QUndoStack [CONCEPTUAL], QGIS [CONCEPTUAL], prosemirror-history [CONCEPTUAL], @codemirror/commands [CONCEPTUAL], kafka [CONCEPTUAL], tldraw [REJECT]   (worth-owning, P0)
  capability: format-forward-compatibility → nbformat [CONCEPTUAL], KiCad [CONCEPTUAL], OpenLineage [CONCEPTUAL], excalidraw [REJECT]   (worth-owning, P0)
  capability: processing-history-record → QGIS [CONCEPTUAL], dvc [CONCEPTUAL], OpenLineage [CONCEPTUAL]   (open, P1)
  No prior art recorded for "journal". Research it before planning an implementation.
  ```

**0.3 Pins.**
- Every pin is historical. Milestone 2 merges before any code here and changes `App.tsx` and the console.
- At the code's base commit, the custodian re-sweeps every pin. A moved cite is class 3. An interface that has changed is I2.
- For the work, the tree at the base is authoritative. For what this form read, the pin is (round 14).

**0.4 The impact question for the data lead, asked before code.** The human asked for one (2026-10-11, item 2). The lead does not draft. The answer is recorded in Amendment 1, and any work it adds is class 9, declared before its code.

> Which engine and kernel interfaces would a kernel `record_step` command for `filter.apply` and `style.set` read, and which would it have to change, to fill ADR-036 §6's `dependencies` member (the predicate's fields and their types, the CRS identifier and source, the geometry types) and its `data` member (piece 1a's `DatasetRef` and the open's `SourceObservation`) from the dataset an SKP handle names, while keeping `SkpHost`'s generation-end and close ordering?

Files it would read:
- `engine/src/predicate.rs` (`AdmittedPredicate::admit` and `sql_text`; the stages hold the bound columns privately)
- `engine/src/dataset.rs`, `engine/src/crs.rs`, `engine/src/descriptor.rs`, `engine/src/geoparquet.rs`
- `kernel/src/skp.rs` (`live_generation`; the live check inside `viewport_query_mint`; `predicate_admit_error_of`)
- `kernel/src/dataset_ref.rs`; `kernel/src/lib.rs` (`Catalog`)
- `kernel/src/permission/audit/log.rs` (`data_dir`)
- `renderer/src/style.rs` (validating a single style value through the one Rust implementation, ADR-022 decision 2)
- `protocol/skp/src/v0/commands.rs`

**0.5 The interfaces as read, on the consuming side.**
- **The transitions** that 1b registers against, milestone 2's seam 3:
  - `frontends/shell/src/workspace/viewTransitions.ts:19-30 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:9804d38fbe91a750beb24104884057fe1ab29a13455e02b80c7012588eb13fad`;
  - the one transition per changed property, `frontends/shell/src/workspace/viewTransitions.ts:56-76 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:eaa378e19b85be4a484224eba9cd4299583ba5792b444d44d39f3fae6881f458`.
- **The filter commit**, the one function every successful Apply goes through: `frontends/shell/src/App.tsx:918-922 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:cff256eea0381f39b58d15eb369508db2e8b40cfb527d3a8e607cae445ba3bd0`. It is called only on an issued outcome: `frontends/shell/src/App.tsx:345-349 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:07dd6f09435de3afccf8d2f1bd667bcf0e2d6d59502b88907f0177c690777b30`.
- **The style path.**
  - Every tick reaches the view: `frontends/shell/src/App.tsx:1694-1700 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:b8a04f0c1501f2c2749f6f976742b4c74dda749ef812f68ffe66d5911299df3b`.
  - `onChange` fires once per drag tick, and the native `change` event once per commit: `frontends/shell/src/style/StylePanel.tsx:62-91 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:18f460160f297409241711bb75bc0f91947f74e178b54e808339c22ae077e92f`.
- **The console.**
  - Its classes: `frontends/shell/src/console/surfaceRegistry.ts:11-17 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:521bb58ad231b2f5c384e2c29ff943e0a1c9087b9d404db0cd1e463a38757a25`.
  - The five class-C style rows, which state that a style is never sent to the kernel: `frontends/shell/src/console/surfaceRegistry.ts:174-206 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:cdad5b66058f5bff532cd965a4ddb1f4db1afb4a5df7342bf9ab6c65a154580e`.
- **The SKP surface.**
  - Five commands, closed shapes: `protocol/skp/src/v0/commands.rs:4-8 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:f6c24787e9df2892f384f3d6a4ee9ebcbb0a64c7b9babbd205403a788944cbe0`.
  - `Filter`: `protocol/skp/src/v0/commands.rs:386-408 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:94bd389f7cdcf8a34722206960b5d91a5d60db1cd0bd7085ca53be7f81f14ad5`.
  - The version: `protocol/skp/src/v0/mod.rs:109 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:565dc56ac0b2f54024ba5a8d167c79c72d256d5b69835bd55c0e95f43b187a8b`.
  - Codes are `engine.*` or `skp.*`: `protocol/skp/src/v0/error.rs:4-11 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:9ae301da56c5b30560246e93d3d3144c672b2f9213132b3ee8f13bb7fbfbde8b`.
  - §4 item 1 lists no `style` command: `protocol/skp/SKP-V0.md:211-220 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:0e02b8b7d124132783e1a54d33438af2624c3b5b6e7a5cabdddb78d462392515`.
  - The shell's Tauri commands file: `frontends/shell/src-tauri/src/commands.rs:4-17 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:0ab465d2a128a04377c279acc591e6b1f0238e6673fa5876bc346e754afa6d4d`.
- **Piece 1a's producer.**
  - `DatasetUri::mint`: `kernel/src/dataset_ref.rs:83-98 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:b4abfa69c5dc0250559fbd81091d736a89d2f0fa367c645c6ea96b52b54bfb72`.
  - `DatasetRef::linked`: `kernel/src/dataset_ref.rs:205-224 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:d3f830866e289c2d71a7aa84255d89d130ab59bbb4979ad8136ca3941b15c1a5`.
  - Its entry writer: `kernel/src/dataset_ref.rs:238-293 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:c547c6b5d1b6168bbc83bad939069e89aa469057d5891c9deaa7d14f8c8a4b09`.
  - Its header names 1b as a consumer: `kernel/src/dataset_ref.rs:24-25 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:012acc6ca8c92a214613c6e32debccd2d8ad2f68cebfe255edd9fec0feb686d4`.
- **The live check.**
  - `kernel/src/skp.rs:595-615 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:706c89173ff290a3f32cfead77a4f54ebd014f86cd753def146ddfb836380744`;
  - as `viewport_query` applies it, `kernel/src/skp.rs:1436-1453 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:b4d2caa26b5688c2aded6fdda4d287c7348c15f0b512ef8c839401ee78616753`.
- **Predicate admission.**
  - `engine/src/predicate.rs:88-91 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:da4b79fbeea6c9fa12d792fc4529a62ae58be456be530ac959991e417c7ca248`, `engine/src/predicate.rs:113 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:ce0c71917b0e199571309d3b989658e12bbf5c533ff7789ab3308ff65485cf94`;
  - the bound: `engine/src/predicate.rs:59 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:905bc287c8263cf56a27703446f1acb936490c75972ecf2e51bbf4093328aea3`;
  - the CRS definition's bound: `engine/src/crs.rs:40 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:a628676468e33337bdbbf875ca364c2d7af5d001df886c6dcdcb2c83e7fea09d`.
- **The application-directory boundary.**
  - `kernel/src/permission/audit/log.rs:365-381 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:a9c1dd02e0d943c959f230c4eea5a3e76e16d81c5f89358fb0ad90e64a56088d`;
  - the precedent of a flush per record: `kernel/src/permission/audit/log.rs:47-49 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:459b1c28e117cab553ad0eb8b818807edc95f5a3c2a5c7d9945f5d846939b666`.
- **What the kernel says it lacks today:**
  - `kernel/README.md:270-284 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:4e228abc37f7576d5109435ef16defb30ad8ff43e713ec9e9375766f77b48af0`;
  - `kernel/src/lib.rs:17-29 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:ea0008e8d2b3d21ac17166b439ed882f30e8f869611d578800b114bd22b506fb`.

**0.6 Hypotheses**, each with its discriminator.
- **H1.** Every `dependencies` member can be filled without a new file read. Discriminator: the impact answer, then K1.
- **H2.** In WebView2, the native `change` event fires once per committed edit on each of the four style controls: on release of a range input, on the close of the colour picker, and once per keyboard step. Discriminator: E1 and walkthrough row X2. If it fails: I6.
- **H3.** A process that aborts after `record_step` has replied loses none of the steps it was told were recorded. Each line is written with no buffering in the process. Discriminator: K8.
- **H4.** `std::fs::File::try_lock` is in the toolchain at the base, and the operating system frees the lock when its holder process ends abnormally, on Windows and on Linux. Discriminator: K7 and K8 in CI. If it fails: I5.
- **H5.** The e2e harness can close the app normally. Discriminator: a read of the harness at the base. If it cannot, walkthrough row X4 carries E2.
- **H6.** A style number crosses the webview boundary as JSON and is recorded equal to the value the shell applied, bit for bit (ADR-004 amendment 1 measured 1-ULP drift on JSON floats there). Discriminator: E1's opacity check. If it fails, the result is class 2: the form declares the limit, and the human decides the carrier.

## §1. What this preregistration may and may not claim

**May claim:**
- a kernel SKP command that records a committed `filter.apply` or `style.set`;
- the session history on the machine. Each line is written whole and flushed before the reply.
- A reader that recovers the longest valid prefix.
- Normal-end clearing. Everything else in §2 that §4 tests.

**May not claim:**
- any restore, undo or replay (piece 4; ADR-036 §7);
- that the kernel holds or applies workspace state;
- that the history survives a power loss. The kernel only asks the OS to flush, as the audit log does.
- any recovery offer (1c);
- any project file, lineage or saved-here mark written (1c and 2);
- a scope step (OPEN-7);
- an AI or plugin actor (the shell records `user` only);
- any performance number, docs/08 row or duration. `record_step` is not cancellable: it is one write and one flush, which no declared figure bounds.
- macOS or Linux above L1;
- any persisted feature id;
- a change to `viewport_query`, `describe`, `open_dataset`, `cancel` or `close_dataset`, beyond the version literal.

**ADRs.**
- Cited: ADR-004 Amendment 4, ADR-005, ADR-006, ADR-010 rule 6, ADR-016, ADR-017 §5a, ADR-018, ADR-021, ADR-022 and ADR-036.
- Amended: ADR-036, which stays Proposed (§2.7, under OPEN-3); and ADR-022, only by the human's typed words (OPEN-1).

**Strings.** Every string the app shows is the human's at P6. The candidates are in §2.10.

## §2. The change

### 2.1 Names against ADR-006

These follow `state/directives/B2-BRIEF-2026-10-07.md:107-116 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:8474097cb49bfddb61327a9b1e20aeed9b07f3a43efaf06ad00b321d87dde859`.
- `filter.apply` and `style.set` are workspace mutations (`docs/adr/ADR-006-lineage-undo-side-effects.md:13-17 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:24bfa800e05662eabe2977a4c9407d2e6e164c437dbb45e5190863d510da44dd`).
- The session history is the kernel's command log for them. Writing it is the class-2 machinery itself, not a side effect of its own.
- No code or record calls it a lineage DAG. Nothing replays it.
- Each step's record is its own unit: one line, written whole. A line that is not whole is never recovered.
- docs/11's obligations for the history as an artifact (`docs/01_Principles.md:7 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:c158bb04e862058b3ec30f57e51ea0d92bf3b26f8e6631719e90e7dc5cfe874d`):
  - the record's and the step's identities (URI);
  - ADR-036 §6 (schema);
  - §2.3 and ADR-036 §9 (lifecycle);
  - `actor` and `at` (provenance).

### 2.2 Protocol: `record_step` at `skp/0.12` (OPEN-8 (A))

- **`RecordStepRequest { skp, dataset: DatasetHandle, intent: StepIntent }`**
  - `StepIntent` is a closed, tagged `{action, params}`: `filter.apply {filter: Filter | null}`, or `style.set {property, value}`.
  - The four properties and their value types are those of `viewTransitions.ts`. `outlineWidth` is `{value, unit:"px"}`.
  - The struct is `deny_unknown_fields`. `filter` is always present, as `null` when there is no filter.
  - No `actor`, `at`, id or effect crosses the wire. The host mints them (ADR-004 Amendment 4's discipline).
- **`RecordStepResponse {}`**, an empty closed object.
  - No step id is returned: nothing in this piece reads one (the caller rule).
  - Piece 4 adds the id when restore reads it, at its own version.
- **Refusals.** The existing codes are reused:
  - `skp.version_unsupported`, `skp.unknown_dataset`;
  - the `skp.filter_*` codes and `engine.connections_exhausted`, through `predicate_admit_error_of`;
  - `engine.source_changed` and `engine.source_coverage_lost` for an ended generation.

  Four new `skp.*` codes (§2.10): `skp.session_history_unwritable`, `skp.session_history_full`, `skp.session_history_stopped` and `skp.step_line_over_ceiling`.
- **`SKP_VERSION`** becomes `skp/0.12`. Every live literal moves with it.
- **SKP-V0.md.**
  - A new §10 (the command, its refusals, the record-only semantics);
  - a change-log entry for `skp/0.12`;
  - one appended sentence in §4 item 1 (§2.10).
  - The heading that counts five commands, and the doc comments that say five, are brought current.
- **Wire fixtures.**
  - New, under `protocol/skp/tests/data/`: a filter request, a style request, the response, and one error per new code where the existing pattern has one.
  - Accept and refuse rows in the three conformance fixture files.
- **The data plane is untouched.**

### 2.3 Kernel: the session history (new `kernel/src/session_history.rs`)

- **`StepRecorder`.** Built once by the shell's binding with the store root and the `Arc<SkpHost>`. It reads `SkpHost::catalog()` and `SkpHost::generations()`, which are existing accessors, so `SkpHost::new` is unchanged.
  - `record_step(&self, RecordStepRequest) -> Result<RecordStepResponse, SkpError>`. Product caller: the shell's binding.
  - `end_session(&self)`. Product caller: the binding's normal-exit hook.
- **The store root** is `default_root()`: `<data dir>/spatial-ide/sessions`.
  - It goes through the one existing resolver, `permission/audit/log.rs`'s `data_dir`, which becomes `pub(crate)`. That file is PORTABILITY R2's application-directory boundary. No new `cfg`.
- **The record** (OPEN-4 (A)).
  - A record is created at the first step for an opened file.
  - Its name is `unsaved-` and 32 hex characters from `getrandom`.
  - Its `history.jsonl` header is ADR-036 §6:
    - `purpose` `session-history`;
    - `project` the state `not-yet-saved`;
    - `actions` 2;
    - `datasets` one entry, `DatasetRef::linked(DatasetUri::mint(), &ds).to_json()`;
    - `lineage` `null`.
  - The record's `locations.json` holds that reference URI and the open's absolute path (§2.7, block E).
  - A reopen of the same path, with the same admission claims, in the same run continues the record. Anything else starts a new one.
  - The kernel holds an exclusive `try_lock` on `history.jsonl` while the session lives.
- **`record_step` order:**
  1. the version;
  2. the catalog entry;
  3. the live check, the one `viewport_query` uses, moved into one `pub(crate)` function that both call, with no change in behaviour;
  4. the registry;
  5. for `filter.apply`, `AdmittedPredicate::admit`;
  6. for `style.set`, the value through `spatial_renderer::style`'s existing check (the seam is pinned at the base by the impact answer);
  7. the record (created lazily);
  8. the line: `id` from `getrandom`; `parent` the record's last step; `at` UTC whole seconds; `kind` and `effect` from the registry; `actor` `{"kind":"user"}`, because the binding serves only the shell; `intent` as received; `dependencies` (H1); `data` `{dataset: <the record's reference URI>, identity: {observed: <this open's observation>}}`; `scope` `{"kind":"layer"}`; `links` `[]`;
  9. the bound checks;
  10. one `write_all` of the line and its LF to a file opened for append, with no buffer in the process;
  11. `sync_all`;
  12. then the reply.

  Every refusal before step 10 writes nothing.
- **A failed write or flush** marks the record stopped. Every later step for it is refused with `skp.session_history_stopped` (OPEN-2 (A)).
- **`recover(dir) -> Recovered`** (OPEN-6 (A)). The header, the kept lines, and the first failing line with its line number and the rule it fails. It applies ADR-036 §9 as amended (block A) and §3 (block D). An unregistered action under a newer `actions` value is kept as its raw line bytes. The reader bounds every member it reads.
- **The registry** is a private table of the two actions: name, `kind`, effect and parameter check. The collapse key and the wide collapse are ADR text only (block C). Compaction, their only reader, is piece 2's.
- **`end_session()`** deletes this run's records, their files and folders, and nothing else. A record from another run is never touched.
- **No `cfg`.** No path parsing. No other I/O.

### 2.4 The shell's binding (`frontends/shell/src-tauri/src/`)

- `commands.rs` gains `record_step`, on `spawn_blocking`, decode → call → serialize, as `viewport_query` is. It never runs on the UI thread.
- `lib.rs` builds the `StepRecorder` at setup, registers the command in `generate_handler!`, and calls `end_session()` on the app's normal exit event. The hook as the base has it is read before it is wired (H5).

### 2.5 The shell (`frontends/shell/src/`)

- **`skp/types.ts` and `skp/client.ts`:** the request type, and `recordStep(dataset, intent)`.
- **`workspace/stepRecorder.ts` (new).**
  - A FIFO with one call in flight, so steps reach the kernel in commit order. Two `spawn_blocking` tasks can run out of order.
  - At `MAX_PENDING_STEP_RECORDS`, a change is not sent, and the owner's notice names it.
  - A refusal shows the owner's notice with the kernel's message (§2.10).
  - Each step records the value it sets, never a delta. So a step that is not kept loses only that intermediate state.
- **`App.tsx`.**
  - `commitActiveFilter` enqueues `filter.apply`, after the issued outcome. The admission reset does not go through it, so it records nothing.
  - A new handler for StylePanel's commit takes `styleTransitions(lastCommitted, next)` and enqueues each, then sets `lastCommitted`.
  - The canvas never waits for a record.
- **`style/StylePanel.tsx`** gains an `onCommit(next)` prop. It is fired from:
  - the existing native `change` listeners of the two ranges;
  - new native `change` listeners on the two colour inputs;
  - Reset.

  Live `onChange` is unchanged.
- **`console/surfaceRegistry.ts`.**
  - The five style rows leave class C. Each style commit now shows its captured `record_step` request, as class A (principle 4: `docs/01_Principles.md:10 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:eab8df32eac28176ffaf0fcb11370c0c96e27d9c172ee833f9189d66bf15ce11`).
  - The class-A doc comment counts six commands.
- **Notices:** the owner's consequence strings (§2.10), in the existing Notices surface.

### 2.6 The caller rule and the seams

**Product callers:**
- `record_step` ← the shell's queue;
- `end_session` ← the exit hook;
- `default_root` ← the binding's setup;
- `DatasetRef::linked` and `DatasetUri::mint` ← record creation (1a's round-8 producer gets its first product caller here).

**Ahead of their consumer (OPEN-6):**
- `recover`, and the `locations.json` writer's file.
- Consumer: `b2-piece-1c-save-and-reopen`'s recovery offer, which ADR-036 §9, round 70 OPEN-3 and ruling 3 of 2026-10-09 design. It is gated by 1c's full form and by ADR-036's acceptance.
- The PR body and the PLAN node name it.

**Seams, each proven end to end from the real shape:**
- shell → `record_step` → kernel → file: E1;
- kernel → engine admission and `DatasetRef`: K1 and K2;
- kernel → `SkpHost` generations: K3.

### 2.7 ADR-036: the amendment text, for the human's sight (OPEN-3)

**Not the human's words.** The worker applies each block by script to `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, only after OPEN-3 is ruled. The Status line is unchanged. The reviewer checks that the file equals the text at b2c71d73 with these blocks applied, as ruled.

**Block 0.** After the line beginning `**Drafted by:**`, one line:
```
**Amended:** in piece 1b's form (`kernel/B2-1B-RECORDING-PREREGISTRATION.md`, §2.7), before acceptance: findings 3, 5 and 6 of the human's rulings of 2026-10-09, the registered actions, the session-history store and its bound, and §12.
```

**Block A** (finding 3). §9: the bullet beginning `- **After a crash:**` is replaced whole by:
```
- **After a crash:** recovery keeps the longest valid prefix: the lines, from the header on, that end in LF, hold no NUL, parse under §2 and §3, and chain. A step chains when its `parent` is the id of the last step before it or, if a `restored` mark comes after that step, the `to` of the last such mark; the first step's `parent` is `null`. A `saved-here` mark chains when its `after` is the id of the last step before it; a `restored` mark chains when its `to` is the id of a step before it. The first failing line is named, with the rule it fails, and nothing after it is recovered. No line carries a check member of its own.
```

**Block B** (finding 5). §6: the paragraph beginning `**The action registry.**` is replaced whole by:
```
**The action registry.** Each action declares its name, the closed shape of its parameters with units, its `kind`, its effect class, its collapse key, and whether it takes the wide collapse. The collapse key is (action, property, target): the action, the property it sets, and what it sets it on; in B2 the target is the project's one layer. Compaction (§8) follows these rules, and the session history (§9) keeps every step:
- An action that only sets a property may declare the wide collapse: within one stretch between saves, repeated edits of one key leave the last, even with other steps between them.
- An action that does not declare it merges only with its neighbour, an adjacent step with the same key.
- A run that returns to its starting value disappears.
- Nothing merges or disappears across a saved-here mark, or across an export, which depends on every key.
- An unknown action is never merged.
```

**Block C.** After block B, with one blank line between them:
```
**Registered actions.** `actions` counts the actions registered; a reader knows every action up to its own value.

| `actions` | Action | `kind` | Effect | `params` | Collapse key | Wide collapse |
|---|---|---|---|---|---|---|
| 1 | `filter.apply` | `data` | workspace mutation | `{"filter":{"predicate":<text>,"dialect":"duckdb-expr/0"}}` or `{"filter":null}`; the predicate is admitted as `viewport_query` admits it | (`filter.apply`, `filter`, the layer) | yes |
| 2 | `style.set` | `style` | workspace mutation | `{"property":<"fillColor"\|"fillOpacity"\|"outlineColor"\|"outlineWidth">,"value":<value>}`; a colour is `#rrggbb` in lowercase, an opacity a number from 0 to 1, a width `{"value":<number>,"unit":"px"}`; each value is one ADR-017 §5a admits | (`style.set`, the `property`, the layer) | yes |

A `filter.apply` step's `dependencies` name the predicate's fields with their types; a `style.set` step's name none.
```
The last sentence stands only if the impact answer confirms H1. Otherwise Amendment 1 replaces it before the ADR commit.

**Block D** (finding 6).
- §3: the bullet beginning `- **The action vocabulary (§6) has its own version,**` is replaced whole by:
```
- **The action vocabulary (§6) has its own version,** `actions`, in a steps file's header. Each new action increments it. The only opaque slot is the `params` of an action this reader has not registered, in a file whose `actions` is greater than the reader's own. That step is validated outside its `params`, kept byte for byte when the file is written again, never merged (§6), and shown as recorded by a later version; it is never dropped (docs/01, principle 8). An action this reader has not registered, in a file whose `actions` is not greater than its own, is refused. Everything else needs a `version` increment.
```
- §2: the bullet beginning `- **Closed key sets:**` ends, before its full stop, with `, except inside §3's one opaque slot`.

**Block E** (§9's 1b items). §9: the bullet beginning `- **Left to piece 1b:**` is replaced by:
```
- **Where it is stored:** on the machine, under the application's per-user data directory, never in a project folder: `spatial-ide/sessions/<record>/history.jsonl`. `<record>` is the project identity's 32 hex characters for a saved project, or `unsaved-` and 32 lowercase hex characters from the operating system's CSPRNG for a session that has not saved; a record name authorises nothing. Beside the history, `locations.json` is one canonical JSON document, `{"format":"spatial-locations","version":1,"entries":[{"dataset":<reference URI>,"path":<absolute path>}…]}`: where this machine found each dataset the history names. It is the only file this ADR defines that holds an absolute path, and nothing in it is copied into a project file or a steps file (§2). While its session lives, the application holds the history under an exclusive lock.
- **How large it may grow:** a step line at most 262,144 bytes, the header line at most 1,048,576 bytes, and the whole history at most 33,554,432 bytes. A step that would pass a bound is refused by name and not written. After a write fails, the history takes no later step, and each later step is refused by name.
- **When it is cleared:** a normal end of the application clears every history its run created. A crash, or an end forced from outside, is not a normal end and leaves the history for the recovery offer.
```
The figures are OPEN-2 (A)'s. The worker computes the worst-case line under §2's escaping, and U7 asserts that it fits.

**Block F** (OPEN-8 (A)). A new section after §11, before `## Consequences`:
```
### 12. How a step reaches the record

A step is recorded by the kernel, through one SKP command, `record_step` (`protocol/skp/SKP-V0.md` §10). A client sends one registered action and its parameters for one open dataset, after the change is committed. The kernel checks the action against the registry (a filter is admitted as `viewport_query` admits it), refuses a dataset whose session has ended, mints the step's id, takes its `at`, its `actor` from the client it serves and its `effect` from the registry, appends one line, and asks the operating system to flush it to storage before it replies. No client supplies an id, a time, an actor or an effect class. The kernel holds no workspace state and applies nothing: the client applies the change. The reply carries nothing but its success.
```

**Block G.** In §11, under the list headed `- **Work left to later pieces:**`, the lines `  - the actions (1b);` and `  - the session-history store and its bound (1b);` are removed.

**Not folded:**
- the two-checks consult's R1 and R2 changes (OPEN-9);
- its Documentation item on §6's `(§11)` pointer, which goes to the acceptance sight.

### 2.8 ADR-022: the grant (OPEN-1, a red line, in the human's typed words)

**Candidate words**, for the human to type or replace. Not the human's words. Each clause is checked in §2.10.
```
## Amendment 1 — style persistence granted for the session history (<date>, the human)
From piece `b2-piece-1b-recording`, a committed style edit is persisted as a `style.set` step in the session history ADR-036 defines (Proposed). This is the grant Consequences (b) left open, for that store only.
- ADR-006's class-2 machinery is the kernel's step record: each edit is one step, recorded by the kernel's `record_step` command (ADR-036 §12), as one line flushed before the reply; a line that is not whole is never recovered (ADR-036 §9).
- docs/11's obligations: the record's and the step's identities (URI), ADR-036 §6 (schema), ADR-036 §9 (lifecycle), and the step's `actor` and `at` (provenance).
- Consequence (a) stands: nothing is undone, and no UI implies undo.
- Persisting a style in a project file or a lineage is not granted here.
```
The consequence it answers is `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:55-62 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:4d31dd6caa1b0a5e876436e4097d9efd5fdb82c8abe2cfaaeeaf9f357d25c40e`.

### 2.9 The docs/07 note (OPEN-10, a red line, typed by the human)

- It lands in its own commit, the first of the PR, under Alpha's `Notebooks: record and replay (03)` line (`docs/07_Roadmap.md:40 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:b48661be42435e6f7ac7dc3498901318de9fdf48a7cf0b43458420b2fea16f14`).
- It follows the pattern of the 2026-08-18 note (`docs/07_Roadmap.md:31-38 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:c3fb7a514af63f25ed48b07f7b77404f7cd9b28f2b2f775111da7a1ff5eec9bf`).
- The brief's wording is at `state/directives/B2-BRIEF-2026-10-07.md:188-192 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:919f7c123bef763c861363ebdde9e7f80905ef69dd877561fec75162006ba12f`.

**Candidate words**, only to help; not the human's:
```
*(Appended <date>.)* **Split.** The Prototype's B2 records; it does not replay. From B2 piece 1b, the kernel records each filter and style change a user commits as a typed step (ADR-006, workspace mutations), in a session history kept on this machine that a crash of the app does not lose and a normal close clears. Later B2 pieces keep the contributing steps in the project's lineage at Save project, and restore a project to a recorded step. This is not the Alpha item: replaying recorded steps, notebooks and workflows (13's Workflow IR) **stay Alpha**. It is not the Beta item either: B2 keeps no branch, and **lineage time travel and scenario branches stay Beta**.
```

**Clause check against 1b's code at merge, and against the brief's sentence:**
- **Records; does not replay.** Nothing replays (§1).
- **Each filter and style change a user commits.** The filter is recorded at `commitActiveFilter` (§2.5), and the style at the commit signal (H2).
  - A change the shell queue does not send, or the kernel refuses, is recorded neither. That is shown, never silent (§2.5).
  - The brief's version says data, scope or style. That clause does not hold at 1b: no scope action (OPEN-7), and an open is not recorded.
- **A crash of the app does not lose.** True of a process crash for every step whose reply arrived (K8, E1). Power loss is not claimed (§1). That is why the candidate says a crash of the app.
- **A normal close clears.** The exit hook (§2.4; K6; E2 or X4), under OPEN-4 (A).
- **Later B2 pieces keep … and restore.** A plan statement, in the brief's own §9 order. The brief's present tense, keeps the contributing ones … can be restored, would be untrue at 1b's merge.
- **Stay Alpha; stay Beta.** Unchanged from the brief.
- **The brief's clause, a restore re-derives no data.** Dropped. Piece 4's restore is not designed, so 1b cannot check it.

### 2.10 New strings and record sentences, each with its clause check

**K: kernel messages.** `SkpError.message`, shown by the app, so P6 candidates. They state kernel facts only.

| Code | Candidate | Clause check |
|---|---|---|
| `skp.session_history_unwritable` | `this step could not be written and flushed to the session history: {detail}` | Returned when `write_all` or `sync_all` fails (§2.3, steps 10 and 11). In the second case the bytes may be in the file, so the candidate does not say the step was not written. |
| `skp.session_history_full` | `the session history is at its ceiling of {limit} bytes (MAX_SESSION_HISTORY_BYTES); this step was not written` | The check runs before any write (§2.3, step 9). |
| `skp.session_history_stopped` | `this session history takes no more steps: an earlier write to it failed` | The stop rule (§2.3). It is scoped to the record. |
| `skp.step_line_over_ceiling` | `this step's line would be {saw} bytes, over its ceiling of {limit} (MAX_STEP_LINE_BYTES); it was not written` | Checked before the write. |

**O: the shell, the owner, which states the consequence.** P6 candidates.

| Id | Candidate | Clause check |
|---|---|---|
| O1 | `Filter applied. The session history did not confirm keeping it: {message}` | The record follows the issued commit, so the filter is the active filter. Did not confirm holds for all four codes and for a transport failure. |
| O2 | `Style change applied. The session history did not confirm keeping it: {message}` | The live style is already applied, because `onChange` precedes the commit. |
| O3 | `Style change applied. It was not sent to the session history: {n} earlier changes are still waiting there.` | At `MAX_PENDING_STEP_RECORDS` the queue sends nothing more. `{n}` is the queue's length. The filter's counterpart uses `Filter applied.` |

**C: the console.** The five style rows become class A, rendered from the captured request. No new prose. The statements on lines 178 to 204, `never sent to the kernel`, would be untrue after 1b, so they are removed and not reworded.

**L: KNOWN-LIMITATIONS**, under item 2e (`state/directives/2026-10-11-direction-after-status-review.md:22 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:737ad3e4a79261bd037b7dacf08344cfd525b2339d2357aeb495a3fe796da54c`). Not a red-line text. For the human to approve or replace. The next free number at the base.
```
**<n>. A crash leaves the session's filter and style changes on this machine, and nothing offers them back yet.** While the app runs, each filter you apply and each style change you commit is kept in a file in the app's data folder on this machine: on Windows under `%LOCALAPPDATA%\spatial-ide\sessions`, on macOS and Linux under `~/.local/share/spatial-ide/sessions` unless `XDG_DATA_HOME` is set. A normal close removes it. If the app crashes or is ended from outside, the file stays, and this version neither offers to recover it nor removes it. It holds the filter text you typed and your style values, at most 32 MiB for one dataset in one run, and nothing in the app sends it anywhere.
```

Clause check:
- **Each filter you apply.** Only an issued Apply or Clear (§2.5).
- **Each style change you commit.** H2.
- **The folders.** `data_dir` (§2.3); macOS is reduced, as for the audit log.
- **A normal close removes it.** OPEN-4 (A), K6.
- **The file stays.** K8, E1.
- **Neither offers nor removes.** `recover` has no product caller in 1b, and `end_session` touches only its own run.
- **At most 32 MiB.** OPEN-2 (A), block E, U5.
- **Sends it anywhere.** No code path reads the store apart from `recover`, and publish takes no file from it.

**R: the kernel's README and `lib.rs` header**, under item 2d. The architect's words; no answer from the human is needed. The lead of the absence bullet is replaced with:
```
**No lineage DAG and no undo. One command log exists, for workspace mutations: the session history** (`session_history`, ADR-036 §9, Proposed). It records each filter and style step a client commits through `record_step`; it holds no workspace state, applies nothing and replays nothing. The reason the other two are absent differs per operation, which the single sentence that used to sit here hid.
```

Clause check:
- **One command log.** Only `session_history` writes steps.
- **Records each step.** §2.3, K1.
- **Holds no state; applies nothing.** `StepRecorder` holds records and the last ids, and no filter or style value outside the line it writes. Nothing in the kernel reads a step back except `recover`.
- **Replays nothing.** `recover` returns lines and runs none.

**S: SKP-V0 §4 item 1**, the architect's words. Appended to item 1:
```
**`skp/0.12` (§10) adds a sixth command, `record_step`**: it records, in the kernel's session history (ADR-036, Proposed), a filter or style change that a client has committed, and applies nothing. A command that sets a style stays absent.
```
Clause check: §2.2 and §2.3. No command changes a style.

### 2.11 Portability (R3)

These follow `state/directives/PORTABILITY-2026-09-30.md:35-56 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:e8d14c6e5398b09f012d3a00bd69dc7b4c463c143ada1000689d579ba22870b4`.
- **Boundary:** application directories, `kernel/src/permission/audit/log.rs` (`data_dir`, reused). File locking uses `std` on all three platforms.
- **Windows:** supported. A live history's lock also blocks a read by another process. Nothing reads a live history.
- **Linux:** supported at L1. The lock is advisory there. That is the same semantics for this piece, since the lock only marks the session live.
- **macOS:** explicitly reduced. The store sits under `~/.local/share`, not the platform's own location, as the audit log does. PORT-2 replaces the resolver. KNOWN-LIMITATIONS item L states the path.
- **Tests:** every kernel and protocol test runs on every CI platform (Windows and Linux). The child-process crash test K8 is portable. E1 and E2 run on Windows only, as every e2e suite does.
- **Skipped tests:** none.

### 2.12 OPEN items: the human's

| OPEN | Subject | Options | Recommended | Red line | What waits |
|---|---|---|---|---|---|
| OPEN-1 | The ADR-022 grant | (A) an appended ADR-022 amendment in the human's words (§2.8 candidates); (B) no grant now: 1b records filter steps only, and style moves to 1c (class 5); (C) the grant in ADR-036's text, which fails on timing because ADR-036 binds nothing until 1c | (A) | yes | every line of style-step code; block C's style row; the console's style rows |
| OPEN-2 | How large the history may grow | (A) the bounds in block E; a step over one is refused by name, and the change stays applied with the owner's notice; after a failed write the record stops; (B) the same bounds, rotating the oldest steps away, which breaks the brief's every committed step and principle 8; (C) a line bound only, which leaves the whole history unbounded against ADR-036 §2 | (A) | the ADR text, yes | the bound checks; block E |
| OPEN-3 | ADR-036's amendment text, blocks 0 and A to G | (a) as drafted; (b) the human's words for any block; (c) block A's last clause: the ruling's word, replayed, against ADR-036 §7's reservation of replay for pure transformations. Drafted as recovered. | (a), with recovered | yes | the ADR commit; `recover` (A, D); the registry (C); the store (E); the command's text (F) |
| OPEN-4 | Round 70 OPEN-3 not yet ruled: what a normal session end is, and what an unsaved project is | (A) a normal end is the app closing normally. Each file opened in a run has its own record, from its first step. A reopen of the same path with the same claims continues it. All of a run's records are cleared at the normal close. (B) as (A), and opening another file also clears the previous file's record, which loses unsaved steps with no offer; (C) one record per run, against B2's single-dataset project | (A) | yes, it refines a red-line ruling | the record lifecycle; the exit hook; K5 and K6 |
| OPEN-5 | Round 70 OPEN-2, the store: who builds what | (A) 1b builds the never-saved session's history and `locations.json`. The per-folder memory and a copy's own data links are built by 1c with the open that reads them (added to 1c's node). (B) 1b builds all of it now, ahead of 1c, under round 8 | (A) | no | nothing in 1b under (A) |
| OPEN-6 | Round 8, a producer ahead of its consumer: `recover` and the `locations.json` file, consumer 1c's recovery offer, gated by 1c's form and ADR-036's acceptance | (A) confirmed; (B) `recover` as an instrument accessor whose only caller is the test suite until 1c; (C) no reader in 1b, and the crash tests parse with a second parser of their own | (A) | no | `recover`; the `locations.json` writer; U1 to U4 and K8 |
| OPEN-7 | Scope steps | (A) 1b registers no scope action. No committed change at milestone 2 changes a scope that a step may record, because a selection needs feature ids, reserved by 1a's OPEN-8 ruling. The title's scope moves to the first piece after an ADR-016 amendment (class 5). (B) a scope action that records a selection's count without its members, which cannot be re-established | (A) | no | none under (A) |
| OPEN-8 | The command's semantics and home | (A) one SKP command, record-only: the kernel validates, mints, appends and flushes; the shell applies (§2.2, block F); (B) record-only, binding-local and off SKP, so no AI or plugin client could record (principles 4 and 5; the brief §8); (C) kernel-held workspace state with events, the full docs/02 machinery, too large for 1b and the shape restore will need | (A) | block F's text, yes | all code |
| OPEN-9 | The two-checks consult's R1 and R2 changes, not folded | (A) taken at acceptance as planned; 1b writes the Proposed shape; a crash file from before a change is refused by name after an upgrade; (B) ruled before 1b's code, and 1b writes the changed shape from the start | (B) if it can come before code, else (A) | yes | under (B), the `dependencies` writer |
| OPEN-10 | The docs/07 note | the human's typed words (§2.9 candidates) | n/a | yes | commit 1 |

### 2.13 Overlap (rule (00))

**The paths:**
- **Docs and ADRs:** `docs/07_Roadmap.md`; ADR-036; ADR-022 (OPEN-1 (A)); `docs/README.md` (generated).
- **Protocol:**
  - `protocol/skp/src/v0/{commands,mod,error}.rs`; `protocol/skp/SKP-V0.md`;
  - new files in `protocol/skp/tests/data/`; `protocol/skp/tests/fixtures.rs`; `protocol/skp/tests/conformance/fixtures/{requests-accept,responses-accept,refusals-at-deserialize}.json`;
  - every file that carries the live version literal: about 16 under `protocol/skp/tests` and 7 under `frontends/shell/src`, counted at the base.
- **Kernel:**
  - `kernel/src/session_history.rs` (new), `kernel/src/skp.rs`, `kernel/src/dataset_ref.rs`, `kernel/src/lib.rs`, `kernel/src/permission/audit/log.rs`;
  - `kernel/tests/session_history.rs` (new), `kernel/tests/session_history_crash.rs` (new), `kernel/tests/no_generation_in_persisted_artifacts.rs`;
  - `kernel/README.md`.
- **The shell's binding:** `frontends/shell/src-tauri/src/{commands,lib}.rs`.
- **The shell:**
  - `frontends/shell/src/{skp/types.ts, skp/client.ts, skp/client.test.ts, workspace/stepRecorder.ts, workspace/stepRecorder.test.ts, App.tsx, style/StylePanel.tsx, console/surfaceRegistry.ts}`;
  - one App test file and the console completeness test;
  - `frontends/shell/e2e/recording.mjs` (new) and `frontends/shell/package.json`;
  - `frontends/shell/MANUAL-WALKTHROUGH.md` (one new Part) and `KNOWN-LIMITATIONS.md` (one new item).
- **Engine:** only if Amendment 1 adds it: `engine/src/predicate.rs`, one engine test file, `engine/README.md`.

**The checks:**
- **`protocol/`: yes.** At most one in-progress piece may touch it. At dispatch, the custodian confirms that no in-progress piece and no PR awaiting merge touches it.
- **Wire fixtures: yes.**
- **`Cargo.lock`: no.** No new dependency: `getrandom`, `serde_json` and `spatial-renderer` are already the kernel's. If either lock changes, that is I7.
- **`frontends/shell/src-tauri/Cargo.lock` and `package-lock.json`: no.**
- **Possible conflicts:** `App.tsx`, `surfaceRegistry.ts`, `MANUAL-WALKTHROUGH.md` and `KNOWN-LIMITATIONS.md` are also likely paths of `export-current-view-after-unreported-fit` and `shell-migration-milestone-3`. The custodian orders them.

## §3. Fixtures, with outcomes declared in advance

Every fixture is generated in-test by `spatial_engine::fixture::write_geoparquet`. A scratch store root is used per test. For E1 and E2, `LOCALAPPDATA` is set for the app process to a scratch folder, so no new switch is needed.

| Fixture | Used by | Predicted |
|---|---|---|
| F1: 500 polygons, LV95, native `id` | K1 to K7, G2 | the steps chain, and the header's entry equals `DatasetRef::linked`'s text for the open |
| F2: F1 rewritten with an mtime 60 s later, then reopened | K5 | the same record continues, and the later step's `observed` differs |
| H1: a valid history with a filter step, two style steps, a `restored` mark and a step after it | U1 to U3 | the prefix is the whole file; a fault at line k keeps lines 1 to k-1 and names line k |
| H2: H1 with a step of action `layer.reorder` under `actions` 3 | U4 | it is kept, with its line bytes equal; under `actions` 2 it is refused |
| E-fixture: `filter-zoned.parquet` | E1, E2 | the steps are, in order, `filter.apply`, then `style.set` for fillOpacity and then fillColor |

## §4. Tests, and one mutation per new test

A mutation is observed by applying it, running the named test, recording its failure by name with its commit, and reverting it (round 25, item 2 (c)). No `verify-mutation` run is called an observation.

**Protocol**

| Test | Mutation |
|---|---|
| P1 `a_record_step_request_and_response_round_trip_and_refuse_unknown_fields` | `deny_unknown_fields` removed from `RecordStepRequest` |
| P2 `a_style_set_intent_refuses_a_property_outside_the_four` | a `#[serde(other)]` fallback variant |
| P3 `a_filter_apply_intent_carries_a_null_filter_as_a_present_key` | `skip_serializing_if` on `filter` |
| P4 the new fixtures in `fixtures.rs`'s existing byte-equal round trip | `dataset` renamed |

**Kernel, unit tests** (`session_history.rs`)

| Test | Mutation |
|---|---|
| U1 `recovery_keeps_the_longest_valid_prefix_and_names_the_first_failing_line` | recovery keeps every complete line (the rule block A replaces) |
| U2 `the_chain_follows_restored_marks` | a step's `parent` must equal the previous step's id |
| U3 `every_truncation_of_a_valid_history_recovers_a_prefix_and_never_a_line_past_the_cut` | a final line without LF is kept if it parses |
| U4 `an_unregistered_action_under_a_newer_actions_value_is_kept_byte_for_byte_and_refused_otherwise` | the line is written back from the parsed value |
| U5 `a_step_over_a_line_or_history_ceiling_is_refused_and_nothing_is_written` | the history-ceiling check removed |
| U6 `after_a_failed_write_the_history_takes_no_later_step` (a private writer generic over `Write`; the product instantiates it with `File`) | the stop flag is not set |
| U7 `the_worst_case_header_and_step_lines_fit_their_ceilings` | `MAX_STEP_LINE_BYTES` set below the computed worst case |

**Kernel, integration tests**

| Test | Mutation |
|---|---|
| K1 `a_filter_step_recorded_through_record_step_reads_back_with_its_reference_dependencies_and_observation` (a real `open_dataset`; the seam) | the writer omits `data` |
| K2 `a_refused_predicate_records_nothing_and_returns_its_own_typed_code` | the record is written before admission |
| K3 `a_step_on_a_dataset_whose_generation_ended_is_refused_with_the_ends_code` | the live check skipped |
| K4 `steps_chain_in_the_order_the_kernel_received_them` | `parent` always `null` |
| K5 `a_reopen_of_the_same_file_continues_its_record_and_another_file_starts_its_own` | records keyed by handle |
| K6 `end_session_clears_this_runs_records_only` | every record is deleted |
| K7 `a_live_history_is_locked_against_a_second_recorder` | no lock taken |
| K8 `an_aborted_process_keeps_every_step_it_was_told_was_recorded` (`session_history_crash.rs`: a child copy of the test binary with a 60 s timeout; after the abort the lock is free) | lines buffered in a `BufWriter` flushed on drop |
| K9 `the_append_path_flushes_each_line_before_it_returns` (a source scan with a planted positive control; it proves the call is there, not that the device honours it) | `sync_all` removed |
| G2 `a_session_history_carries_no_generation_session_reference_handle_path_or_user_name` (in `no_generation_in_persisted_artifacts.rs`) | the header locator's `at` carries `ds.path()` |

**Shell**

| Test | Mutation |
|---|---|
| C1 `recordStep sends record_step with the version and the typed intent` | `skp` omitted |
| R1 `sends one record at a time, in commit order` | the next call is sent before the previous one resolves |
| R2 `at its bound, sends nothing and reports the change as not sent` | the bound removed |
| A1 `an issued Apply records one filter.apply; a refused Apply and the admission reset record none` | the record moved before `applyFilter` resolves |
| A2 `a style drag records one style.set at release, not one per tick` | the record placed in `handleStyleChange` |
| A3 `a refused record shows the owner's notice with the kernel's message` | the refusal swallowed |
| the console completeness test, extended: `style edits are class-A record_step rows` | one class-C style row left in place |

**E2E** (`e2e/recording.mjs`, the real app)

| Step | Mutation |
|---|---|
| E1 `RECORD`: apply a filter; commit the opacity and then the colour; kill the process; read the store. The three steps are in order and chained, the header's entry is present, and the recorded opacity equals the applied value (H6). | the style commit does not enqueue |
| E2 `CLOSE`: a normal close removes that run's record (or row X4, under H5) | `end_session` not wired |

**No existing test is edited,** except the version literal and the console's style rows.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predictions:** §3's column, and H1 to H6. A wrong prediction is recorded as class 2, and the prediction is never edited.

**Declared unchanged:**
- `engine/` (unless Amendment 1 says otherwise), and `protocol/data-plane`;
- the five commands' shapes, apart from the literal;
- `SkpHost::new`;
- the audit log's path and behaviour;
- the bundle's bytes;
- every existing e2e suite's steps and outcomes;
- ADR-005, ADR-006, ADR-016 and ADR-017;
- ADR-036's Status line, and every part of it not named in §2.7;
- milestone 2's reducer and `viewTransitions.ts`.

**Invalidators** (stop and report):
- **I1.** The impact answer shows that a `dependencies` member needs work beyond what Amendment 1 declares.
- **I2.** At the base, an interface §0.5 pins has changed shape: the transitions, the commit function or StylePanel's commit signal.
- **I3.** An existing test needs an edit outside §4's exception.
- **I4.** Code dispatched before its OPEN is ruled (§2.12, What waits).
- **I5.** H4 fails.
- **I6.** H2 fails.
- **I7.** A lockfile changes; or a path is shared with an in-progress piece or a PR awaiting merge; or a second piece touches `protocol/`.

**Falsification:**
- recording cannot be done without the canvas waiting on the flush;
- the longest-valid-prefix rule cannot be held over ADR-036's lines without a check member on each line.

## §6. Instruments

Every quantity is an assertion: a typed outcome, a line count, a byte bound, or a source scan. No measurement. No docs/08 row.

## §7. Declared values and ceilings

**Values** (ADR-010 rule 6), each at its own site:
- `MAX_STEP_LINE_BYTES` = 262,144;
- `MAX_HEADER_LINE_BYTES` = 1,048,576;
- `MAX_SESSION_HISTORY_BYTES` = 33,554,432 (all three under OPEN-2 (A));
- `MAX_PENDING_STEP_RECORDS` = 64 (`stepRecorder.ts`);
- the record prefix `unsaved-` and 32 hex characters;
- `actions` = 2.

**Line budget, by §21c's rule** (insertions plus deletions, tests included):

| Group | Files | Ceiling |
|---|---|---|
| docs/07 note | `docs/07_Roadmap.md` | ≤ 12 |
| ADRs | ADR-036; ADR-022 under OPEN-1 (A) | ≤ 130 |
| protocol product | `commands.rs`, `mod.rs`, `error.rs`, `SKP-V0.md` | ≤ 340 |
| wire fixtures and protocol tests | ≤ 6 new data files, `fixtures.rs`, three conformance files | ≤ 260 |
| version literal | ≤ 24 files at the base | ≤ 160 |
| kernel product | `session_history.rs`, `skp.rs`, `dataset_ref.rs`, `lib.rs`, `audit/log.rs` | ≤ 950 |
| kernel tests | three files | ≤ 700 |
| the shell's binding (src-tauri) | `commands.rs`, `lib.rs` | ≤ 70 |
| shell product | six files | ≤ 320 |
| shell tests | four files | ≤ 420 |
| e2e | `recording.mjs`, `package.json` | ≤ 300 |
| records | `kernel/README.md`, `MANUAL-WALKTHROUGH.md`, `KNOWN-LIMITATIONS.md` | ≤ 110 |
| engine, only under Amendment 1 | three files | ≤ 160 |
| **Total** | **≤ 60 files** | **≤ 3,950** |

**Excluded from the count:** this form; `PLAN.yaml`; `CUSTODIAN-QUEUE.*`; `site/**`; `docs/README.md`; `Cargo.lock`; `frontends/shell/src-tauri/Cargo.lock`; `frontends/shell/package-lock.json`.

**The counting command,** run at head H, with base B named in the PR body:

`git diff --numstat B...H -- . ':!kernel/B2-1B-RECORDING-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.md' ':!CUSTODIAN-QUEUE.json' ':!site' ':!docs/README.md' ':!Cargo.lock' ':!frontends/shell/src-tauri/Cargo.lock' ':!frontends/shell/package-lock.json'`

**An overrun is class 8.** This section is never edited.

## §8. Block-on-sight (each checked on its own)

1. A step written before its checks; a reply before `sync_all`; a buffered line.
2. A history line or a header holding a generation, a session reference, a handle, an absolute path, an OS user name or a credential. `locations.json` alone may hold a path.
3. The kernel applying or holding a filter or style value outside the line it writes. Any restore, undo or replay code, or the word undoable.
4. A wire field for an id, a time, an actor or an effect. A response member nothing reads.
5. Any scope action under OPEN-7 (A). Any feature id.
6. Any style-step code before OPEN-1 is ruled. The ADR-036 edit before OPEN-3 is ruled. ADR-036 with a Status other than Proposed, or not equal to b2c71d73's text with §2.7's blocks applied as ruled. An ADR-022 text that is not the human's typed words.
7. A refusal that is silent anywhere: the queue, the kernel or the notices. A kernel message stating the shell's consequence.
8. A new `cfg`, a new resolver, or `LOCALAPPDATA` outside `audit/log.rs`.
9. A `pub` item beyond §2.3's list. An option or path whose only caller is a test, other than OPEN-6's ruling.
10. Any change to `protocol/data-plane`, to `engine/` without Amendment 1, or to a lockfile.
11. A record of each tick: style recorded from `onChange`.
12. Zero-copy, a performance number, a timing assertion, or a docs/08 row.
13. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code landed before its amendment;
    - a `verify-mutation` run called an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id;
    - a five-line form for this piece.
14. Quotation marks around text that is not byte-identical to its source. A line cite into the ledger. A bare self-line. A pin read as current without naming which is authoritative.
15. The owner's-index lines not updated (the 2026-10-11 direction, item 2).
16. Code dispatched while a waiting PR shares a path with it.

## §9. Gates

**Commit plan,** each commit signed off:
1. the docs/07 note (the human's words);
2. ADR-036 and ADR-022 as ruled, with `docs/README.md` regenerated;
3. the protocol, the fixtures and the version literal;
4. the kernel, with U1 to U7, K1 to K9 and G2;
5. the shell's binding;
6. the shell, with C1, R1, R2, A1 to A3 and the console test;
7. the e2e suite, the walkthrough Part, the KNOWN-LIMITATIONS item, the indexes, and PLAN.

**Architect** (full gating):
- §8, item by item;
- ADR-006 (class 2, and no undo claim); ADR-022 against OPEN-1; ADR-036 against §2.7 as ruled;
- ADR-004 Amendment 4 (no attribution on the wire);
- principles 4, 5, 7 and 8;
- R1 and R9 by this form's guardrails line;
- the seam rule for §2.6's three seams; round 8 against OPEN-6;
- the round-7 discharge and operator-text rules;
- verbatim quotes; the round-25 checks.

**Reviewer:**
- the full diff, `origin/main...HEAD`;
- every mutation made again;
- §7 by its command;
- every hash recomputed;
- ADR-036's equality with the text as ruled;
- the lock diffs are empty.

**Suites, green before either gate.** Heavy runs follow THE MACHINE paragraph at `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1`, carried in every heavy-run brief.
- `cargo test --workspace --locked --features spatial-engine/fixture`; `cargo fmt --all --check`; `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture`, with no new warning on an added line;
- the shell's `npm run verify` and `cargo test` for src-tauri;
- `e2e:recording` and every existing e2e suite;
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`;
- `verify.mjs`, `queue --check`, `site --check`, `verify-cites`, `verify-quotes` (a floor) and `verify-test-claims`;
- CI green at the reviewed commit.

**Proportional gates:** the product-first direction's section 2, by reference (`state/directives/2026-10-05-product-first-direction.md:15 @ b2c71d738c37831c206ab2fc26f31e4b2ace7daf sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`). Wording blocks follow AUTONOMY §31.

**Operator:** a new Part, at the next unused letter at the base, with a blank log:
- X0: read §10, the last amendment first.
- X1: open `filter-zoned.parquet` and apply `zone = 'residential'`. The console shows `viewport_query`, then `record_step`.
- X2: drag the fill opacity and release; pick a colour and close the picker. One `record_step` per release or close. Felt: does the console's `record_step` entry read as noise?
- X3: end the app from Task Manager. One record folder holds the header and X1's and X2's steps, in order.
- X4: start the app, apply a filter, close it normally. That run's folder is gone; X3's stays.

**PR body:**
- asks for a merge commit;
- names each OPEN ruling, base B, the impact answer and OPEN-6's consumer, `b2-piece-1c-save-and-reopen`;
- shows both lock diffs, empty;
- lists the P6 strings for sight.

**Closing record,** references and hashes only:
1. the PR, the merge commit and the reviewed heads;
2. the gate reports;
3. the worker reports;
4. ADR-036's hash at the merge, and ADR-022's if amended;
5. each mutation's observation commit;
6. each done item's test;
7. §7's count;
8. PLAN set to done, with `{pr}` in the done commit only.

## §10. Amendments

*(Opens empty; append-only. Amendment 1 records the human's OPEN rulings (class 5) and the impact answer, with any work it adds (class 9), before any code.)*

### Amendment 1 — the human's rulings on OPEN-1 to OPEN-10 (class 5); the impact answer and the work it adds (class 9)

*Written by the custodian on the human's typed ruling (`state/directives/2026-10-14-215-c1-216-merge-current-view-open-3-b2-1b-open-1-to-10.md`, item 4), before any code. References only, except the two texts below, which are the human's words byte-copied by script from lines 14 to 19 and line 33 of that file, less their six leading spaces, with <date> set to 2026-10-14, the day the ruling was received.*

1. **The rulings:** OPEN-1 (A); OPEN-2 (A); OPEN-3 (a), blocks 0 and A to G as drafted with the word recovered, and the three values the impact answer found unspelled spelled as the ruling says; OPEN-4 to OPEN-7 (A), OPEN-6 confirmed; OPEN-8 (A), block F as drafted; OPEN-9 (B), before this piece's code; OPEN-10 the human's words; §2.10 L's KNOWN-LIMITATIONS item approved as drafted.
2. **ADR-022's Amendment 1 (OPEN-1 (A)), the human's words, appended to ADR-022 in this piece's PR (the ADRs group):**

```text
## Amendment 1 — style persistence granted for the session history (2026-10-14, the human)
From piece `b2-piece-1b-recording`, a committed style edit is persisted as a `style.set` step in the session history ADR-036 defines (Proposed). This is the grant Consequences (b) left open, for that store only.
- ADR-006's class-2 machinery is the kernel's step record: each edit is one step, recorded by the kernel's `record_step` command (ADR-036 §12), as one line flushed before the reply; a line that is not whole is never recovered (ADR-036 §9).
- docs/11's obligations: the record's and the step's identities (URI), ADR-036 §6 (schema), ADR-036 §9 (lifecycle), and the step's `actor` and `at` (provenance).
- Consequence (a) stands: nothing is undone, and no UI implies undo.
- Persisting a style in a project file or a lineage is not granted here.
```

3. **The docs/07 note (OPEN-10), the human's words, the PR's first commit (§2.9):**

```text
*(Appended 2026-10-14.)* **Split.** The Prototype's B2 records; it does not replay. From B2 piece 1b, the kernel records each filter and style change a user commits as a typed step (ADR-006, workspace mutations), in a session history kept on this machine that a crash of the app does not lose and a normal close clears. Later B2 pieces keep the contributing steps in the project's lineage at Save project, and restore a project to a recorded step. This is not the Alpha item: replaying recorded steps, notebooks and workflows (13's Workflow IR) **stay Alpha**. It is not the Beta item either: B2 keeps no branch, and **lineage time travel and scenario branches stay Beta**.
```

4. **The impact answer** (`state/consults/2026-10-12-b2-1b-recording-impact-answer-lead-data.md`): H1 holds as worded. The work it adds, class 9, as the human answered its questions:
   - (a) **Q1:** `AdmittedPredicate` keeps its referenced column names behind a `pub` accessor, with its test and one observed mutation, inside the engine group's ceiling (§7, 160). The engine's README names the accessor.
   - (b) **Q2:** the fields' types are the Arrow types as `describe` spells them; the engine keeps no surrogate types.
   - (c) **Q3:** the live check is the one ordering point. A close or a generation end that lands after it does not stop the write; the line is true of the open it names. `record_step` takes no lock a close waits on, and no test waits on a race.
   - (d) **The style check:** the kernel checks each value by wrapping it in a whole style document and calling the renderer's `parse`; the renderer is not changed. The lower-case rule is the kernel's own check, refused by name. One test each.
   - (e) **The kernel changes the answer names** (`predicate_admit_error_of` crate-visible; the observation's spelling factored out of `DatasetRef::to_json` into one crate-private function; `RefBuildError` mapped, by a code or a stated unreachable arm), inside the kernel groups' ceilings.
5. **Owed before any code (OPEN-9 (B)):** the architect drafts the further §2.7 blocks the ruling names, for the human's sight: `dependencies.crs`'s definition member, its source as `describe` reports it, the coordinate epoch reserved by name in §11 with the selection scope's pointer corrected, and the registry paragraph on a parameter holding coordinates. Their sight is recorded in the next amendment.
6. **The start:** milestone 2 has merged (PR #217). This piece waits for item 5 and for its slot: `shell-status-bar-one-height` goes before it in slot 2 if that piece's paths are disjoint from the Current view fix's (its form's OPEN items are with the human).

Nothing above is edited.

### Amendment 2 — the human's sight of the OPEN-9 blocks: H to K approved, the member named `provenance` (class 5); the five tests they add, with their own ceiling (class 9)

*Written by the custodian on the human's typed ruling (`state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md`, item 3), before any code. The texts below are the architect's draft (`state/consults/2026-10-14-b2-1b-open-9-blocks-architect-draft.md`, lines 27-33, 62-64, 85-89, 106-108, 135-137 and 150-152, and line 90, at 2857bd8c), byte-copied by script, with the one word the ruling changes. None of them is the human's wording. Amendment 1 item 5 is discharged.*

1. **The ruling.**
   - Blocks H, I, J and K are approved as drafted, with one change: the member is named `provenance`, not `source`, so the step record and `describe` use one word for the same three values.
   - Where the ruling of 2026-10-14 that Amendment 1 records says `dependencies.crs.source`, it reads `dependencies.crs.provenance`.
   - Block I's reading is confirmed: the three words are `crs:declared`, `crs:asserted` and `crs:format-default`, as `describe`'s `crs.provenance` reports them.
   - Block 0 takes the draft's replacement line. The §6 `dependencies` cell takes the draft's offered wording, with `provenance` in it, in place of Block H's substring edit. Block B is applied before Block K.
2. **The order of application,** by script, as §2.7 says for blocks 0 and A to G: Block 0 as item 3 gives it; A to G as drafted; then item 4's cell, Block H (item 5), Block I (item 6), Block J (item 7), and Block K (item 8) last.
3. **Block 0,** replacing §2.7's Block 0 line. It names the member, so under item 1 it says `provenance` where the draft says `source`. This is told to the human with this amendment; a different word there is theirs.

```
**Amended:** in piece 1b's form (`kernel/B2-1B-RECORDING-PREREGISTRATION.md`, §2.7), before acceptance: findings 3, 5 and 6 of the human's rulings of 2026-10-09, the registered actions, the session-history store and its bound, §12, and, under the human's ruling of 2026-10-14 (OPEN-9), `dependencies.crs`'s definition and provenance, the coordinate epoch's reservation and the registry's rule for coordinate parameters.
```

4. **The §6 `dependencies` cell.** The second cell of the `dependencies` row of §6's table (ADR-036 line 113 at 2857bd8c) is replaced whole by:

```
`{"fields":[{"name","type"}…],"crs":{"identifier","provenance","definition"},"geometry_types":[…]}`; each of the three members may instead be a named state, on its own. `geometry_types` are the types the file declares, as written, never the engine's encoding; where the file has no `geometry_types` key it is the named state `not-declared`, and an empty declaration is kept empty.
```

5. **Block H.** After §6's table, before `**Withheld line:**`, with one blank line on each side:

```
**`dependencies.crs`** names the coordinate space of the dataset the step was recorded on, as the engine admitted it at that open:
- `identifier` is the identifier the engine admitted. It is a label only: an equal identifier never shows that two steps share a space, and every definition with no authority and code carries the same label, `(definition-only)`.
- `definition` is `sha256:` and 64 lowercase hex characters, over the UTF-8 bytes of the definition text the engine admitted, as `describe` reports it in `crs.definition_json`: the string's value, not its JSON spelling, with nothing normalized. For a file's own declaration that text is the engine's serialization of the file's `crs` object, not the file's bytes; for a caller's assertion it is the text the caller sent. Equal hashes show the same definition text. Unequal hashes decide nothing: one definition written two ways hashes two ways, and a later version may serialize the same file's declaration differently.
- Where the engine admitted no definition, as under the format's rule for an absent `crs` key, `definition` is the named state `none-admitted` (§2).
- The text is hashed as held, not rewritten in §2's canonical subset: that subset writes keys in a schema's declared order and refuses numbers outside its domain, and a definition has keys no schema here declares and numbers nothing bounds.
```

6. **Block I,** appended as the last bullet of Block H's list, with the one word:

```
- `provenance` is the provenance class `describe` reports as `crs.provenance`, one of three words: `crs:declared`, the file's own `crs` member; `crs:asserted`, a caller's assertion over a file that declares none; `crs:format-default`, the format's rule for an absent `crs` key. A reader refuses any other word. A step recorded on a format-default admission therefore says so.
```

7. **Block J.** In §11, after the bullet beginning `- **Persisted feature ids.**`, insert:

```
- **Reserved by name, not yet defined:**
  - **a selection scope** (§6, `scope`);
  - **the coordinate epoch:** when a dataset's coordinates were observed, for a CRS whose coordinates change over time. It is a dataset fact that a later version may record as one value, as a named column holding a time per row, or as not stated. Version 1 records it nowhere, and a version-1 file's silence is not a statement that it is not stated. Adding it changes the shape, so it comes with a `version` step (§3), and a version-1 reader refuses the later file.
```

   And in §6's table, the `scope` row, as drafted:

```
§6, in the step line's table, the `scope` row: `A selection scope is reserved (§11).` becomes `A selection scope is reserved (§11, Reserved by name).`
```

8. **Block K,** applied to Block B's text once Block B is applied: after the sentence ending `in B2 the target is the project's one layer.`, insert one space and:

```
A parameter that holds coordinates names the space they are in, in `dependencies.crs`'s form (§6), within its own declared shape; an action with a coordinate parameter that names no space is not registered. No action registered here has one: a filter's predicate may reference attribute columns only, never the geometry column.
```

9. **The form notes, class 9 work inside the existing groups:**
   - the writer reads `DatasetCrs::definition_json()` for `definition`, and `Dataset::admission()`'s `crs_provenance` for `provenance`, the value `describe` reads; both join §2.6's seams;
   - the definition's hash is `spatial_renderer::canonical::sha256_hex`, already a kernel dependency: no new dependency and no lock change;
   - `describe`'s `not-established` arm cannot be reached for an admitted dataset. In `record_step` it is a stated unreachable arm that refuses and writes nothing, never a fourth word: the choice Amendment 1 item 4 (e) gives `RefBuildError`;
   - U7's worst-case line includes the `definition` member and the longest `provenance` word;
   - by the architect's estimate, the ADR group grows by about 21 lines (to about 65 of its 130) and the kernel product by about 40 (inside its 950). §7 is not edited, and an overrun is class 8.
10. **Class 9: the five tests, with their own ceiling.** Each is as the draft gives it under Block H's and Block I's Tests, with its one mutation, observed:
    - K10 `two_definitions_under_one_identifier_record_one_label_and_two_definition_hashes`; mutation: the writer hashes `crs.identifier()`;
    - K11 `a_format_default_admission_records_the_none_admitted_state`; mutation: the writer hashes an empty text when no definition was admitted;
    - K12 `each_admission_class_records_the_provenance_describe_reports`, renamed under item 1 from the draft's name, which ends in `as_its_source`; mutation: the writer writes `crs.source().as_str()`;
    - U8 `recover_refuses_a_crs_provenance_outside_the_three_classes`, renamed under item 1 from the draft's `recover_refuses_a_crs_source_outside_the_three_classes`; mutation: the reader's word check on `provenance` is removed;
    - U9 `recover_refuses_a_definition_that_is_neither_a_sha256_nor_none_admitted`; mutation: the reader accepts any string for `definition`.
    - **Where they live:** K10 to K12 in one new file, `kernel/tests/record_step_crs.rs`; U8 and U9 beside U1 to U7 in `session_history.rs`'s unit tests.
    - **Their ceiling:** at most 220 lines, insertions plus deletions, the five tests with any helper only they use: the new file by §7's counting command on its path, and U8 and U9 by their line spans, which the worker lists. They are not counted against the kernel tests group, whose ceiling stays 700. An overrun is class 8.
11. **Overtaken in this form's record** (the draft's conflict 5): §2.7's Not folded list, and §0's line saying that the steps meet neither R1 nor R2, are overtaken by blocks H to K; the Documentation item on §6's `(§11)` pointer is answered by Block J. Neither line is edited.
12. **The unspelled values:** item 4's cell spells the three values OPEN-3 (a) ruled; Block I spells the fourth the impact answer found, `crs.source`'s vocabulary, as `provenance`'s three words.
13. **The start:** this piece waits for its slot: `shell-status-bar-one-height` is in code in slot 2 before it.
14. **Generation:** the node's generation goes up by one.
15. **Superseded index:** §2.7's Block 0 line → item 3; §2.7's Not folded list → item 11; Amendment 1 item 5 → items 1 to 10; the ruling's `dependencies.crs.source` → item 1.

Nothing above is edited.
