# B2 piece 1c — Save project (linked) and reopen: the project's identity, the project file, the changed-file notice, the recovery offer after a crash, and the saved-here mark (full form)

- **Path:** `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`.
- **Authority:**
  - PLAN node `b2-piece-1c-save-and-reopen`, its whole summary.
  - The placement: `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md:12` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:4a45c340108a734937f87f38e9dea1c3e8054a4bc84094a38359e7d70660c7d9 (item 2).
  - The human's rulings on this form and on ADR-036's route:
    - `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:4b060a097e2669c574a255533c6db432f4f3bb4e477b51d38bb8f192cbff8f1d;
    - `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:14-18` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:d9f2b5c452aceff7cc9821c1aca87947910264be24a39b86073ef2fb2d64a020.
  - The human's rulings on ADR-036's block and on ADR-022 Amendment 2: `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:8-14` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:939fc68ee4117176e692ec1f41c98abe1fda9e7ef8fb151fb5d1f1a5f345f080.
  - ADR-036 accepted, with 1c's code allowed to start in slot 2: `state/directives/2026-10-21-adr-036-accepted-status-line-1c-code-may-start-redaction-proceeds.md:8` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:dd927bd8a8f84d913797e28207abc67425a5c20ae6144ce7efc49f4d4b8d6dfe.
  - The block's committed form: `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md`. Its §2.1 to §2.4 are the text the block applies, and its §2.3 holds the human's two passages.
  - The brief's 1c row: `state/directives/B2-BRIEF-2026-10-07.md:142` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:33c7192f7ecbff652c0039a294d0fd582983b1d151c790ecfdb7cd5632bb2fa7.
  - ADR-036's ten rulings: `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:8-49` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:cd8df2f984ef66826967b183bd9fb9b576ac3be75917d15c4114baeec8b1c978. Where `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:38-49` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:c929c60a4895f987114ca923857ea8ce7d04517f91c3aee2902114a1705b7419 restates a sentence, the restatement governs over the sentence it restates (that file's filing note).
  - Round 70: OPEN-2, OPEN-3 and OPEN-7 (`state/directives/2026-10-08-round-70-rulings.md:8-33` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:0f96efbb41a32ad381ec351373c3558e08341638a31fba4e0757df0fa4a68fb4).
  - Round 69: item 1's additions and item 4 (`state/directives/2026-10-08-round-69-rulings.md:13-20` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:aec78822a256e037fe1c3ad8f118b5d4a0210313fb6027b0e3569656df210efc).
  - Piece 1a's form, Amendment 5, item 8: the writer's carrying rule, the resolver, and the open item on data with no canonical spelling.
  - Piece 1b's form §2.6 (`kernel/B2-1B-RECORDING-PREREGISTRATION.md` §2.6). Its OPEN-6 there is `recover` and `locations.json`, whose consumer is this piece.
- **Inputs:**
  - the boundary inventory, above all row 7 (`state/consults/2026-10-16-boundary-inventory-architect.md:21` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:23c14c347a22a9e9ec34988064258b617ce6bc35a76a1d547f8e0673c0cc67c0);
  - the acceptance consult (`state/consults/2026-10-21-adr-036-acceptance-architect-consult.md`);
  - the two checks (`state/consults/2026-10-12-adr-036-guardrails-two-checks-architect.md`);
  - the reuse findings (`state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md`);
  - the `.spatial` check (`state/consults/2026-10-21-spatial-extension-check-custodian.md`).
- **Drafted by** the architect, read only:
  - drafted at main eaa3d2a9 (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-draft.md`);
  - revised at main 6c3795c5 (`state/consults/2026-10-21-b2-piece-1c-save-and-reopen-architect-revised-form.md`);
  - written final at main ad921f55, after the human's rulings on the block.
- **Pins.** Every `path:line @ ad921f55` is a historical pin.
  - For the code a step edits, the step's base tree is authoritative. For what this form read, the pin is authoritative.
  - ADR-036 at ad921f55 is still the text before the block. Once the block merges, its lines move: A0 inserts a line after line 5, A2 inserts one after line 27, and so on. At each step's base, the ADR-036 cites below are found again by the bytes of their passage, the block's §2.0 (a) method (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:91-93` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:cf2e2490da628cd34ba78ad2fe414f9c56f1c031bc131fa435632b319156a60f). A cite found there is class 3.
  - Each pin's full commit id and sha256 were added by the custodian's script before this form was committed.
- **Committed before any code.** It is append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Code starts only after all of these:**
  - The block's PR has merged.
  - The acceptance commit has landed, so ADR-036's Status line reads `Accepted 2026-10-22`, with `docs/README.md`'s row regenerated (`state/directives/2026-10-21-adr-036-accepted-status-line-1c-code-may-start-redaction-proceeds.md:8` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:dd927bd8a8f84d913797e28207abc67425a5c20ae6144ce7efc49f4d4b8d6dfe). This is the custodian's recommended order, and §2.10 marks the one place that changes under the other order.
  - The human has approved the text of this piece's appended ADR-036 amendment (§2.10).
  - O0 has run on this machine, and its result is recorded in Amendment 1 (ruling 1; OPEN-6 (A); §3).
  - Rule (00) holds at the dispatch of each step (§2.14).
- **Form and gating:** the full form, with full gating from dispatch (AUTONOMY §21a, `AUTONOMY.md:315-332` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:211fe30919ba9ee55447ac9f66874374382d972ab58269c8f074a79fd4693cb3; §25(e), `AUTONOMY.md:482` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669). The piece touches all four §21a categories:
  - ADR text: this piece's appended amendment to ADR-036, and ADR-022 Amendment 2;
  - the wire: new SKP commands;
  - security posture: a containment boundary, inventory row 7;
  - stated guarantees: atomic save, an open refusal that never outlives a crash, and ADR-006 class 2.
  It is also over §21c's size. No five-line form is possible.

## §0. Disclosure

**0.1 Inputs.** No pilot, spike or corpus has run, and nothing has been measured. The 5 GB fixture is not used. O0 (§3) is owed before any product code, and it has not run.

**0.2 The reuse index (the standing step).** These are the custodian's runs of `node tools/reuse.mjs` in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, with the tool at that commit. The lines are byte-copied from the custodian's brief as given, and the custodian confirms them against the run by script:

```text
$ node tools/reuse.mjs project file save reopen
No prior art recorded for "project file save reopen". Research it before planning an implementation.
$ node tools/reuse.mjs path containment engine open identity
No prior art recorded for "path containment engine open identity". Research it before planning an implementation.
$ node tools/reuse.mjs path-containment engine-open-identity reserved-filename-checks
No prior art recorded for "path-containment engine-open-identity reserved-filename-checks". Research it before planning an implementation.
$ node tools/reuse.mjs containment
capability: path-containment → cap-std [PORT], Go [CONCEPTUAL], Rust std [CONCEPTUAL], fs_at [WATCH], libpathrs [WATCH], filepath-securejoin [REJECT]   (worth-owning, P0)
$ node tools/reuse.mjs identity
capability: engine-open-identity → DuckDB [BENCHMARK]   (open, P0)
capability: stable-identity-copy-move → Godot [CONCEPTUAL], VS Code [CONCEPTUAL]   (worth-owning, P0)
$ node tools/reuse.mjs reserved
capability: reserved-filename-checks → Go [CONCEPTUAL], cap-std [PORT]   (do-not-reinvent, P0)
```

What the form takes from each row (paraphrase):
- **path-containment.** The concepts only: a walk from the project folder, segment by segment, that refuses links and takes no `..`. The implementation is Rust std's `symlink_metadata` and `FileType::is_symlink` for each segment, on every platform (OPEN-5 (B): no handle is held). No code is ported and no dependency is added. OPEN-20 (A) takes no cap-std dependency.
- **engine-open-identity, open.** No handle is held, so the engine's open by path is used as it is. The index's claim of full sharing is not relied on (inventory row 7).
- **stable-identity-copy-move.** Ruling 8 already decides the rule (§2.4). Concepts only.
- **reserved-filename-checks, do-not-reinvent.** Under OPEN-20 (A), a list declared at its site, with the concept taken from Go and nothing ported. It holds the block's A4 list (OPEN-R (a)).
- The three phrase queries missed. The misses are noted and do not block.

**0.3 The interfaces as read, on the consuming side** (the seam rule). All at ad921f55:
- **The dataset reference (piece 1a's producer):**
  - `DatasetRef::linked` writes `[machine-recorded]` only (`kernel/src/dataset_ref.rs:205-224` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:d3f830866e289c2d71a7aa84255d89d130ab59bbb4979ad8136ca3941b15c1a5);
  - `check` returns `RefCheck::Differs{observed, admission}` (`kernel/src/dataset_ref.rs:296-324` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:84948c073d19a1706901e61c62d9a8352c5b78d09e913de15c5b4757bc283fe5);
  - the canonical form is checked on the text alone, and does not yet hold ruling 9's widening (`kernel/src/dataset_ref.rs:539-552` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:e356d3fa9f41097d288031d87cf54c93c1293bb1b6a57b39e7f571e9d9a3f0e5). The doc comment there states the old containment rule, which follows links;
  - the integer members are written as JSON integers (`kernel/src/dataset_ref.rs:358-373` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:fdcfd9ba12671b117f6f75a5727c7870e3a1bacdc1b9d1e17f7499ee007c8386) and refused above 2^53−1 (`kernel/src/dataset_ref.rs:468-474` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:16476d6357813510990f949f9c7f534a3bad18139380ce1e0df67e592ca9c3d0);
  - the snapshot shape is refused (`kernel/src/dataset_ref.rs:484-498` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:272b221d4fbf37befb511d3aac5a4846cc8ee3112144b4cf8b3d8109e4d389a4);
  - the module says that a file reader must refuse duplicate keys (`kernel/src/dataset_ref.rs:19-20` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:d7315caf7733d0bfa671cb7580cd16eff5099ac8f1e4659c86b9d7be973cd0dd).
- **The session history (piece 1b):**
  - `recover` is pub, a producer whose consumer is this piece (`kernel/src/session_history.rs:18-19` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:da715408bc8d82b076984ef659339632a2f046369655f2d2b30ea35a0a0842c4, `kernel/src/session_history.rs:773-790` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:f9b818c444919cf05441a4e4415a47add62e57f9833cc9a23cfcda6064a920db);
  - the header admits only `purpose` `session-history`, with `lineage` null, and a `project` that is either the state `not-yet-saved` or a project URI (`kernel/src/session_history.rs:565-579` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:cd20ff19ce46a99337b5fc0ad9f363a654e0992bc82185768b2fe8f3077fd187);
  - the header is written with `project` as the state `not-yet-saved` (`kernel/src/session_history.rs:305-316` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:d566f68d1a5726454f506cf2353e3aaf7e154055f4428e28f68478b1ba311fb5);
  - the mark shapes (`kernel/src/session_history.rs:663-669` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:c86cd4a7890b4aa8ad5b8ce4fde8ecf4d4f9894fe5553bf0dc6a233349e9a4f4);
  - the reader parses through `serde_json::Value`, with a separate duplicate-key scan and no key-order check (`kernel/src/session_history.rs:862-869` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:1e2a2939646e538f552cf83200421d505b19dbd12c38748bf55956ce7de58586, `kernel/src/session_history.rs:963-992` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:3b2b040d908a2f5a9bc356b9eb957aba627323e539f95f2776fded63943e6c68);
  - the writer checks a line against the reader's own rules before it writes it (`kernel/src/session_history.rs:284-302` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:a5e9f99f0c2e98bb551788eb2a10beea3094ff4200110f190d16bec2ba39abad);
  - the lock is std's `try_lock` (`kernel/src/session_history.rs:251-261` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:544e62ac1724a54d81635db3727095fc889d2b576eaf60b180817fea08cbb85d);
  - `end_session` clears only this run's records (`kernel/src/session_history.rs:195-203` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:09fe9bcbd10663cf3a3f1b1b684ebabffae0e628d068e10874525487a0b0eeb8);
  - the store root (`kernel/src/session_history.rs:130-134` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:ff0115c2e22f9d8cb7b94779641e5301a889c904babff3f03463d0d20361cd5d) is resolved through the audit log's `data_dir` (`kernel/src/session_history.rs:38` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:93504a5c3026cbac159e5d5a8aeb296042087a22954b77aeb0ffbf707988f94a);
  - the canonical module is already imported (`kernel/src/session_history.rs:28` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:b2a1184c8fb6867a0760a3e144d4dc268e797bc56d57ce44e867e72f52a7beda).
- **The canonical module (ADR-022 decision 3):**
  - its declared grammar has no whitespace outside strings and no trailing newline (`renderer/src/canonical.rs:22-38` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:bacedf05839a2d4c22f8c3e6a00b70e7d58fb22a35dd9de73246b488ca613215);
  - `to_canonical_string` (`renderer/src/canonical.rs:138-143` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:50bfc0eda7b0b02cd189b73232ef256821ceb7a20c8ce970e29952c5b4c0ca1a);
  - `sha256_hex` (`renderer/src/canonical.rs:152-158` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:2ea812cbdef803d47ce81e71b05088cde8c5ed963096cb00014e8fe281383436);
  - the string writer, which is private (`renderer/src/canonical.rs:207-225` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:051323584254202f0035b8e333de139ce0f5d9d71745db45c7bf2aec4ac7b01c);
  - the number writer, which is pub (`renderer/src/canonical.rs:232-256` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:8872206e4c884b96f8c5538521eeeafe5a516d114a36402aad38a4cf33943b81).
- **The kernel's open:**
  - `SkpHost::open_dataset` registers a cancel key, arms the watcher by path, and opens by path through `open_cancellable` (`kernel/src/skp.rs:1100-1105` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:125e13eeebb0778f5cd378cdd8e5ccc7010f54b70c5f011d1b65b840ff5e48e6, `kernel/src/skp.rs:1173-1177` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:8d462b3675a380dc820c2632ed21dff5cda6aabca04092458adfc9500b582e06);
  - the engine accepts a `\\?\` prefix (`engine/src/dataset.rs:1651-1658` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:b8206069b271822d2a60707231a09dbd98a4d576f7860c1638d857b85b9a850f) and refuses glob metacharacters (`engine/src/dataset.rs:1678-1684` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:140412ceeb2e2097fa171ef29d88f958a50c6c76eafd1b692cd5c261ea02b12e).
- **The shell's open path, which a reopen goes through:**
  - `runAdmitPath` takes an `admit(path, cancelKey, options) → AdmissionOutcome` dependency (`frontends/shell/src/admission/AdmissionPanel.tsx:178-185` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:26f814dde338ba6fc69a71bb42f84551353717d0fec6e0ce10f518d7b20a14ee, `frontends/shell/src/admission/AdmissionPanel.tsx:198-265` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:adc4b3dfc8a2e61adab15a8c1903236bad648ac7bc73f47c1188e062aaf37129);
  - the product `admit` is `admitDataset`: `open_dataset`, then `describe` (`frontends/shell/src/admission/admitDataset.ts:39-66` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:dc685c6f6b7aec3eaac516e7f91b6e177ed2533e041fa2d6a2b0be53c10dd03b);
  - the liveness line and Cancel (`frontends/shell/src/admission/AdmissionPanel.tsx:349-392` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:3e64867f835a8d1d28c78529453a6fa7d7f55d11786c2ce4673d907686f1a5bb);
  - the picker binding (`frontends/shell/src-tauri/src/commands.rs:233-246` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:a11d55e99149c98e66c40c21c790f85e0d842deaccf8a6e95ef4bfe62cad726f);
  - the shape of the `record_step` binding (`frontends/shell/src-tauri/src/commands.rs:137-150` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:d8886bf61fc1cbc53b2e774b769f6f3569b31e62b902d1ac53efac107a2d0fb1).
- **The workspace the shell holds:**
  - `ViewState` has `filter`, `style`, `clauses`, `selection` and more (`frontends/shell/src/workspace/workspaceState.ts:68-86` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:62574d11dfbcb107a6a78caafebd573879358ff20f7deaabab0c3dcec5f27965);
  - `FilterClause` is `{id, text, enabled}` (`frontends/shell/src/workspace/filterClauses.ts:21-26` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:7e8aed46be5c4446c5cc7ae23a22cbebfe0da7ca7817bb9843d42a6fec8571f2);
  - the camera's frame and centre (`frontends/shell/src/canvas/extent.ts:94-104` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:fa46dd4c018f876b2aa7f8b5f38671793466f208b2132e9f394f158cd2675164).
- **ADR-022:**
  - decision 3 (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:44-45` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:31e623ad13bdebe175acde10ac5d2b11da02e3114132522d9a01caaadd86be99);
  - Amendment 1 does not grant persistence in a project file (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:78` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:3482183d3369c30059e4dc9ebded5c7c5d941d628a90482c68456ebe8a38165d);
  - consequence (b) (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:55-62` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:4d31dd6caa1b0a5e876436e4097d9efd5fdb82c8abe2cfaaeeaf9f357d25c40e).
- **ADR-036 as the block writes it:**
  - containment, with the human's last sentence (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:262` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:80dc754c37acfb9ada119a21e014e948a387c79466fc6bcc9a4e5a7f04054c98);
  - C1 and C2 (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:319-343` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:9be0eb0d273564cc449addabfcd9239797a9b640f7321bf306ab95743b879bd1);
  - the `workspace` reservation, with the human's sentence (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:217` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:ec41cd54b519170468915df3e4a5b1b6baeeacd5db700fe0301f2185230c83a7);
  - the lineage members and `not-kept` (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:197-198` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:b8a13ce3ba40ec49260acde4ad853861a4349bfba7d9791f1b9e6f3c0051db49);
  - canonical form (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:186` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:ba1f15c41d2aebd72a15a6aeb8acccddfee55a6d8716ca77eebdb5c4d2c83bd3);
  - the layout (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:150-171` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:5d0b95afde16efdae2fd226e57b7f5685671227589c8dad0e396a0dc8523ea79);
  - B4 (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:285` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:6e9b0a5de1cc467476c0a7eaabcb4f5809497de0b62bd467c7d8efa3d7df9167).
- Every pin is historical. At each step's base, the custodian sweeps them again. A moved cite is class 3, and a changed interface is I1.

**0.4 Hypotheses**, each with its discriminator:
- **H1.** On this machine, an online-only OneDrive file is a reparse point whose tag is not a name surrogate. Std reports it as not a symlink, and as a regular file, and `symlink_metadata` does not start its download. Opening it by path triggers the operating system's download. A junction is a name surrogate, and std reports it as a link. Discriminators: O0 and K-R2.
- **H2 and H3: withdrawn** (OPEN-5 (B)). They tested held handles, and no handle is held.
- **H4.** The engine reads a project-relative target given in the `\\?\` form. Discriminator: K-O1. If H4 fails, the plain form is used, and ruling 9's widened text check makes Win32 name rewriting a no-op on canonical text.
- **H5.** While an online-only file downloads, the shell's existing liveness line and Cancel stay live. A Cancel ends the open at the engine's next check, after the blocking read returns. Discriminators: O0 and row OP3.
- **H6.** `std::fs::rename` replaces `project.spatial` atomically on NTFS. A sharing violation (from an indexer, antivirus or the sync client) is retried up to the declared bound and then refused by name. Discriminators: K-S6 and K-S7.
- **H7.** `File::try_lock` on a machine-side lock file is freed by the operating system when its process ends abnormally, the same mechanism piece 1b proved for the history. Discriminator: K-O5.

## §1. What this preregistration may and may not claim

**May claim:**
- Save project (linked): the project's identity is minted at the first save, and `project.spatial` is written atomically in the line-oriented layout;
- the writer's carrying rule, as ruled;
- the saved-here mark;
- reopen, with the strict reader, the containment check at open, the copy-or-same question, the second-open refusal, the changed-file notice and re-link;
- the recovery offer;
- each of these only as §4 tests it.

**May not claim:**
- any lineage file written (OPEN-8 (A); the brief, `state/directives/B2-BRIEF-2026-10-07.md:158` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:601f8712bf33e0d6088e8b03a377150df752fd1eff3b9034dad9b317ee1162ff);
- compaction, restore to an earlier step, undo or replay (pieces 2 and 4; ADR-036 §7). "Undoable" is never said of a save;
- a snapshot (stage 3);
- file association or single instance (a later piece, by the human's typed word, ruling 2);
- more than one dataset per project;
- a saved click selection (round 69, item 4);
- that a project-relative locator never points outside the folder, or that the data the engine reads is the data the check passed. The check is made when the data is opened. A link or rename that another program makes afterwards is not prevented, at the open or at any later read (OPEN-5 (B); ADR-036 §5's last sentence, the human's; C1);
- survival of a power loss (the kernel asks for a flush);
- any performance number, docs/08 row or duration;
- that a save is cancellable. It is one bounded write, one flush and one rename, with no declared figure for its time;
- any persisted feature id.

**ADRs.**
- **Cited:** ADR-005, ADR-006, ADR-010 rule 6, ADR-016, ADR-017 §5a and §6, ADR-018, ADR-022 (decision 3; §2.3a) and ADR-036.
- **ADR-036:** its pre-acceptance text is the block's (route (i)). After acceptance, this piece appends one amendment (§2.10), and the human approves its text before step 1's PR opens.
- **ADR-022:** Amendment 2, in the human's words (§2.10).
- **The renderer:** `renderer/src/canonical.rs` gains one function (§2.3a). Nothing else under `renderer/` changes.

**Strings.** Every string the app shows is the human's at P6. §2.12 gives placeholders.

## §2. The change

### 2.1 Names against ADR-006 (operation-class correctness)

- **Save project** persists the workspace into the project's own store (docs/02, Projects). It is the commit of ADR-006 class 2, made transactional by the atomic rename (§2.3).
  - It is not a step and not an export. The history records it with a `saved-here` mark (ADR-036 §6, the mark lines, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:128` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:ab31e2feb64b3fc3d81bd6657b9ec8cce56c8a0a60a3fe6cf7db13950cb27c6d).
  - No approval gate applies, because nothing leaves the workspace's own store. A gate that reads the project folder as an external destination may block here, and the reason above is what it judges.
- **Reopen** loads the saved workspace. It is not a restore.
- **Accepting a recovery offer** restores workspace state to the last kept step of a crashed history. That is ADR-036 §7's restore of workspace state, never a replay (OPEN-13 (A)).
- **Declining** clears a machine-side record, as ruled (round 70, OPEN-3).
- **The copy answer** writes a new identity into the newly opened folder's project file. That is a save.

### 2.2 Protocol (SKP; OPEN-3 (A): one version per step)

- **`save_project`** (step 1).
  - Request: `{skp, dataset, folder: string|null, workspace}`. `folder` is present only at the first save, from the native folder-picker binding. `workspace` has the shape of §2.10's item W.
  - Response: `{project, history_mark: "written"|"withheld"}`. The shell's notice reads `history_mark` (OPEN-9 (A)).
- **`open_project`** (step 2).
  - Request: `{skp, folder, cancel_key, answer: null|"copy"|"same", relink: null|string}`.
  - The response is one of:
    - `opened {project, dataset, session, workspace, check: {observed:[…], admission:[…]}, lineage: <named fact>}`;
    - `question {kind:"copy-or-same"}`;
    - `not_found {file_name}`.
  - The kernel stays stateless across the two phases: the shell calls again with `answer` or `relink`.
- **`list_recoverable`, `recover_session` and `discard_recoverable`** (step 3).
- **New codes,** all `skp.*`, each stating a kernel fact only:
  - `project_folder_holds_project`
  - `project_file_unwritable`
  - `project_file_refused` (the member's path and the rule)
  - `project_open_elsewhere`
  - `project_target_through_link`
  - `project_target_outside_folder`
  - `project_target_unresolvable`
  - `project_lineage_not_kept_by_this_version`
  - `recoverable_record_locked`
- **Not changed:**
  - the shapes of the six existing commands, apart from the version literal;
  - the data plane.

### 2.3 Kernel: the project (new `kernel/src/project/`: `mod.rs`, `file.rs`, `strict_json.rs`, `resolver.rs`, `store.rs`)

- **Identity.** `spatial://project/` followed by 32 lowercase hex characters from `getrandom`, minted at the first save. A later save keeps it.
- **Writer.**
  - The top-level members are a closed set, in a fixed order: `format`, `version`, `project`, `datasets` (one entry, §5), `lineage`, `workspace`. That is the order of the block's A2.
  - The `workspace` member's shape is §2.10's item W, which this piece's appended amendment defines (OPEN-W (a)).
    - No version-1 project file exists before this writer, so that amendment completes version 1 and is not a version step. This is the human's sentence, placed in A6 (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:217` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:ec41cd54b519170468915df3e4a5b1b6baeeacd5db700fe0301f2185230c83a7).
    - The amendment lands no later than this writer: in step 1's first commit (§2.10).
  - The layout is ADR-036 §2's line-oriented layout (OPEN-L (a)): two spaces of indent per level, and `: ` after a key. It is written by `renderer/src/canonical.rs`'s new function (§2.3a).
  - Before the write, the writer checks the bytes it is about to write against the reader's own rules, as 1b's writer does (`kernel/src/session_history.rs:284-302` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:a5e9f99f0c2e98bb551788eb2a10beea3094ff4200110f190d16bec2ba39abad).
- **The observation's integers** (OPEN-14 (A); the block's B4).
  - Binding a reference to a file whose `byte_size` or `footer_length` is over 2^53 − 1 is refused by name, so the writer never writes a value that the reader refuses.
  - Today, `kernel/src/dataset_ref.rs:358-373` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:fdcfd9ba12671b117f6f75a5727c7870e3a1bacdc1b9d1e17f7499ee007c8386 writes these values with no check.
- **Atomic save** (ruling 10).
  - The steps are:
    - write `project.spatial.tmp-<16 hex>` in the folder;
    - `write_all`, then `sync_all`;
    - then `rename` it over `project.spatial`.
  - A sharing violation is retried up to `MAX_SAVE_RENAME_ATTEMPTS` and then refused by name.
  - On POSIX, the folder is fsynced.
  - A temp file left by a crash belongs to no format (ADR-036 §1, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:27` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:90fecbaeb05b4dfee1d5ce682a6a26b012202380d93de26665e6acd5c43d31d1). The next successful save removes files named by exactly that pattern, and nothing else.
- **A first save into a folder that already holds `project.spatial`** is refused by name (OPEN-16 (A)).
- **Carrying rule** (ruling 1; round 70, OPEN-7; 1a Amendment 5, item 8; OPEN-4 (A); the block's B1, line 76):
  - a `machine-recorded` locator always;
  - a `project-relative` locator where the resolver's judgment at save (§2.5) finds three things: the data is inside the folder, it is reached without a link, and its path has a canonical spelling;
  - never an absolute path;
  - data inside the folder with no canonical spelling on this machine is carried `machine-recorded` only. The owner's statement (S18) says that the project will not find that file on another machine, and the save is not refused (OPEN-4 (A), in the human's words in the OPEN section).
- **The machine store** (`<data dir>/spatial-ide/projects/<32 hex>/`, through the existing `data_dir`). Its files:
  - `locations.json`: persistent, in the same format as ADR-036 §9's;
  - `folders.json`: the folders known for this identity, with their answers;
  - `open.lock` (step 2).
  None of them is ever in the project folder, and none is cleared in B2 (§2.10, item M).
- **Saved-here mark** (step 1).
  - At each save, one `{"mark":{"kind":"saved-here","after":<last step id>,"at":…}}` line is written through 1b's append path, with one write and one flush.
  - There is no mark when the history holds no step yet.
  - Under OPEN-9 (A), there is no mark when the sent workspace differs from what the history's steps reach.
- **First save and the session record** (OPEN-18 (A)):
  1. The record's kept lines are copied under a new header whose `project` is the URI, into `sessions/<project hex>/history.jsonl`. The copy is written to a temp file, synced, renamed and locked.
  2. Then the `unsaved-` record is removed.
  Recovery (step 3) skips an `unsaved-` record whose first step id appears under a project record.
- **Lineage member** (OPEN-8 (A); the block's A5).
  - 1c writes the named state `not-kept`.
  - The reader accepts the full shape of ruling 4, `{"sha256":…,"steps":…}`.
  - The writer refuses by name (`project_lineage_not_kept_by_this_version`) to save over a project whose member records a kept lineage. It never breaks that lineage silently.
- **Strict reader** (`strict_json.rs`; ruling 7 and the 2026-10-09 note):
  - It tokenizes over bytes, and checks bounds before any allocation.
  - It refuses a duplicate key, and a member out of the order the schema declares.
  - **Layout and spelling.** The file's parsed value is rendered again with the writer's function (§2.3a): `to_line_oriented_string` for the project file, `to_canonical_string` for each line of a steps file. A file whose bytes differ from that rendering is refused, naming the line. So the reader and the writer cannot drift.
  - **Numbers.** It follows that a number is accepted only when its token is its canonical spelling under `spatial_renderer::canonical`'s grammar, byte for byte. The token is parsed with std's correctly rounded `f64` parse, and `float_roundtrip` is not enabled.
  - **The session history.** Under OPEN-19 (A), this reader also replaces `serde_json::from_str` in 1b's `read_line`.

### 2.3a ADR-022 decision 3: where the line-oriented layout is written

- **What decision 3 limits.** It allows canonicalizing and hashing only in `renderer/src/canonical.rs` (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:44-45` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:31e623ad13bdebe175acde10ac5d2b11da02e3114132522d9a01caaadd86be99). The project file carries the §5a style document inside its `workspace` member, in the line-oriented layout.
- **The layout is a canonicalization.**
  - It fixes the one byte form of a document that holds the style document. Ruling 2 makes the line-oriented form the file's one canonical byte form (`state/directives/2026-10-09-adr-036-ten-findings-rulings.md:10` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:d7c488df41544ace4c81d49604b3ad2a018f5a31b7b58de2def5765e2091e02d).
  - The writer must emit that form, and the reader must refuse any other.
  - Whitespace is part of that byte form. So the layout is a second canonical form beside the compact one, which writes no whitespace and no trailing newline (`renderer/src/canonical.rs:22-23` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:4072d34553400b2f62f76f6d06f3bd2848a1f9a423d211bb0652a5705ac0d32f).
  - To argue that it is not a canonicalization, one would have to read the word as meaning the compact form only, and ruling 2 does not allow that reading.
- **So it is written in `renderer/src/canonical.rs`:**
  - one new `pub fn to_line_oriented_string(v: &Json) -> Result<String, CanonicalError>` over the same `Json` value. It uses the module's own string and number writers, so the two forms differ in layout only;
  - one module-doc paragraph that names the layout and ADR-036 §2 as where it is defined.
  - `to_canonical_string`, `canonical_and_hash`, `write_double` and every existing test in the module stay byte-identical.
  - Its product caller is the project writer, `kernel/src/project/file.rs`, in the same PR (the caller rule).
  - Amendment 1 already has the kernel writing style values through this module (`kernel/src/session_history.rs:28` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:b2a1184c8fb6867a0760a3e144d4dc268e797bc56d57ce44e867e72f52a7beda).
- **The reader is not a canonicalization.** It produces no bytes. It checks a file against the function's output (§2.3), and its number rule is the module's own grammar (ruling 7).
- **No hash is taken outside the module.** Under OPEN-8 (A) no lineage is written, so 1c takes no lineage sha256. Any later hash uses `sha256_hex` (`renderer/src/canonical.rs:152-158` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:2ea812cbdef803d47ce81e71b05088cde8c5ed963096cb00014e8fe281383436).
- The shell still holds and displays the document, and canonicalizes nothing.

### 2.4 Kernel: reopen (step 2)

1. **Read** `project.spatial` with the strict reader, under `MAX_PROJECT_FILE_BYTES`.
2. **Identity and folder** (ruling 8, `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:22` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:912b88f4520351d6cc5dac6ba7c7c84b490de446ff3a1c4835893c12a0e77e6b, with its restatement at `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:38-40` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:a54aa4f7e57fd77ad552b215b8e8dfe3364c7fef02e5f62f3c28eaeeebe03388 governing; the block's B2):
   - this folder is known for the identity → open;
   - the remembered first folder still holds a project with this identity → `question`;
   - the first folder is gone, or holds another project or none → a move: the folder memory is updated and nothing is asked;
   - the first folder cannot be reached → `question`.
   - The answer `copy` mints a new identity into this folder and gives it its own data links. The answer `same` is remembered for this folder.
3. **Second open** (ruling 2; OPEN-7 (A)).
   - `try_lock` on `projects/<hex>/open.lock` happens after step 2, so a copy never collides.
   - A held lock refuses with `project_open_elsewhere`.
   - The lock is held until the project's dataset closes (B2 has one dataset per project). The operating system frees it at a crash (H7).
4. **Data.**
   - A `project-relative` locator goes through the resolver's check at open (§2.5), and the engine is given the path that check returns.
   - Otherwise, the machine store's location is used. If it is absent or missing → `not_found`, and the shell offers re-link.
   - A re-linked file is opened and checked against `observed` (round 70, OPEN-7).
   - The open is `SkpHost::open_dataset` with the recorded claims and the request's `cancel_key`. The host mints attribution there (ADR-036 §5, `admission`).
5. **Check.** `DatasetRef::check` gives the response's `check`, as facts. The shell states the consequence.
6. **Lineage.** The member is read, and the lineage file is detected under ruling 4 by the rule of §2.10's item D (OPEN-D (a)). Under OPEN-8 (A), a lineage file beside a member that records none is named in `lineage` and is not read.

### 2.5 Kernel: the resolver (inventory row 7; ruling 1; OPEN-5 (B); the block's B1, C1 and C2)

- **At save, `judge`:**
  1. canonicalize the open's path to P and the folder to F;
  2. if P is not under F, the data is outside: `machine-recorded` only;
  3. otherwise, apply the canonical-form text check (the block's A4) to the relative segments. A failure means `machine-recorded` only, with the owner's statement, and the save goes on (OPEN-4 (A));
  4. walk the segments from F, as at reopen below. A link means `machine-recorded` only.
- **At reopen, `check_inside(F, at)`**, the same on every platform:
  - the text check comes first (the block's A4);
  - then, for each segment in turn, `std::fs::symlink_metadata` of F joined with the segments so far. This reads the type without following the last component:
    - a link (`FileType::is_symlink`; on Windows, a name-surrogate reparse point, H1) is refused with `project_target_through_link`;
    - a missing segment is refused with `project_target_unresolvable`;
    - an intermediate that is not a directory, or a final that is not a regular file, is refused by name;
  - a cloud placeholder is not a name surrogate, so it opens, as the block's B1 requires (H1);
  - no handle is opened for the check, and none is held after it (OPEN-5 (B));
  - the engine path is F followed by the segments as checked, in the `\\?\` form (H4).
- **The window, declared.**
  - The human's last sentence of ADR-036's containment rule (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:262` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:80dc754c37acfb9ada119a21e014e948a387c79466fc6bcc9a4e5a7f04054c98) names the race at the open and at every later read. A change the detector or the advisory watch sees ends the session, and the sentence leaves the rest to this form. The revision of this form had already declared that same window. Here is the rest:
  - **During the check.** The check reads each segment by path, so a change between two segments of the check is not prevented either.
  - **After the check.** The engine opens the target by path, and reads it by path again for as long as the dataset is open (`state/consults/2026-10-16-boundary-inventory-architect.md:21` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:23c14c347a22a9e9ec34988064258b617ce6bc35a76a1d547f8e0673c0cc67c0). A change that the detector or the advisory watch sees ends the session:
    - item 19 (`KNOWN-LIMITATIONS.md:230-245` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:e63993a7e47a3e24fc625d05689dd820643a7176e45fafb2eddef8278275b790);
    - items 23 to 28 (`KNOWN-LIMITATIONS.md:278-332` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:8cc80ab5eec9e0c30740c6615b6538e02c0ec045ff93465f89d27a5cebe37c56).
  - **What neither one sees is not detected, and the engine reads whatever the path then names.** That includes:
    - a link or a rename to a file with an equal observation: equal size, modification time, footer length and footer hash (item 19);
    - any change the watch does not signal. There is no watch off Windows (item 24), and above the file only one ancestor is watched (item 26).
  - **So this form claims the check only.**
    - It never says that a project-relative locator never points outside the folder (C1, `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:323-330` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:111ef9cc1f0fedaeab540eaf3ea7a1e05cbbd8422fa0a40f68028a931792b110).
    - It states the rest here, where ADR-036 §5 now leaves it (C2, `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:332-339` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:31bd760f3b30ff4a2d20d3cec7702f2ca80b469f0ecde7d1470630f91f2cd944).
  - Step 2 makes the containment sentence of the doc comment at `kernel/src/dataset_ref.rs:539-543` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:f7871e56fb74a681cdc5cd231d9e4a825915aa63b92d0b04d6fd22dbd9d713dc match this rule (N-10, `state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md:156` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:f85bde8fb26c65ceb3f4dce0d0dac75d3965093b1a0a86c128238f77736ae2d1).
  - K-2 (§2.12) states the window to the operator.
- **Every platform runs the same check.** For containment, no platform is reduced against another.
- **Device names, and a trailing dot or space,** are refused twice: by the text rule, and because the final object must be a regular file. The device-name list is the block's A4 list (OPEN-R (a)).
- **POSIX mount points** below the folder are not links, and they are not refused. The block's containment text names links and junctions only, and this matches it.

### 2.6 Kernel: the recovery offer (step 3; `recover`'s consumer)

- **The list.** `list_recoverable` lists the `unsaved-` records at app start, and the record of the project being opened at its open.
  - A record is listed only if `try_lock` succeeds, so a live run's record is never offered.
  - Each entry gives the dataset's file name from the record's `locations.json`, the time of the last kept step, and the data's state under `check`: unchanged, changed (with the components named) or not found (round 70, OPEN-3).
- **`recover_session`** (OPEN-13 (A)):
  - it takes the record's lock;
  - it truncates the history to the length of the kept prefix and syncs it;
  - it continues that record for this run;
  - it returns the last value of each key (the filter, and the four style properties). The shell applies them.
- **`discard_recoverable`** removes the record.

### 2.7 The shell's binding (`frontends/shell/src-tauri/src/commands.rs`, `lib.rs`)

- Each SKP command runs on `spawn_blocking`: decode, call, serialize.
- `binding_pick_project_folder` is the native folder dialog, not SKP.
- The project session (its `open.lock`) is held in the binding's state, and dropped at `close_dataset` of its dataset.

### 2.8 The shell (`frontends/shell/src/`)

- **Save project** is available from the command bar and from a control (P6). The first save opens the folder picker.
- When a click selection exists, Save shows the selection notice (round 69, item 4).
- The owner's notices state the consequences:
  - saved;
  - not saved, with the kernel's message;
  - the history mark withheld;
  - inside data carried for this machine only (OPEN-4 (A)).
- **Open project** goes through `runAdmitPath`, with an `admit` that calls `open_project` and then `describe`. So the liveness line, Cancel and the refusal UI are the existing ones.
  - `question` → the copy-or-same question (the human's words at P6);
  - `not_found` → a re-link pick;
  - `opened` → the workspace (filter and clauses, style, view) is applied through the existing reducer transitions, and the changed-file notice names each component.
- **Recovery offer:** a list from `list_recoverable` at start, and its own offer at a project's open.
- **Console:** one class-A row per new command.

### 2.9 Portability (R3)

- **Boundary:** the application directories (`data_dir`, reused) and the new resolver (`kernel/src/project/resolver.rs`). There is no `cfg`: the resolver uses std's `symlink_metadata` on every platform (OPEN-5 (B)).
- **Windows:** supported. Containment is checked at open.
- **Linux:** L1, with the same check. KNOWN-LIMITATIONS K-2 covers every platform.
- **macOS:** as for Linux, with the store under `~/.local/share`, as the audit log has it.
- **Tests:**
  - K-R2 is Windows-only by a run-time check of the operating system, not a `cfg`, and it reports which operating system it ran on (1b's precedent in its correction round 2).
  - The other link tests use a junction on Windows and a symlink on Linux.
  - The e2e tests run on Windows.

### 2.10 ADR text: what this piece appends, and where (route (i))

**ADR-036's pre-acceptance text is the block's, not this piece's** (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md`, §2.1 to §2.4). Under OPEN-A (c), the block carries Part A together with B1, B2, B4 and B5. In the custodian's recommended order, the block's PR (in progress on `cut/adr-036-pre-acceptance-block`) merges first. The acceptance commit follows it and sets the Status line to `Accepted 2026-10-22` (`state/directives/2026-10-21-adr-036-accepted-status-line-1c-code-may-start-redaction-proceeds.md:8` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:dd927bd8a8f84d913797e28207abc67425a5c20ae6144ce7efc49f4d4b8d6dfe). From that commit on, ADR-036 changes only by appended amendment. **(This is the one place that changes if the human chooses the other order.** In that case the Status edit lands first, and the block lands as an appended amendment after it. ADR-036's earlier lines then stay as written, and are superseded rather than edited. This form's ADR-036 references point into that amendment, not into edited lines. 1c's code also waits for that amendment to merge, and 1c's own amendment is appended after it.)

**After the acceptance, this piece appends one amendment to ADR-036.** The source is the block draft's section 2 (`state/consults/2026-10-21-adr-036-pre-acceptance-block-architect-draft.md:254-259` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:07d1e86c982bca9d750b0973cd631c03e6e7226d158553cddd9b2fbde4089835), with the block's form §2.6 (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:355-362` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:3e212daf8c1ba0cf7e8af332e2fe6d79291f13ab2d36e2a67005f172d2524338).
- Its words go to the human at step 1's dispatch, and the human approves them before step 1's PR opens.
- It lands in step 1's first commit, no later than the writer (the block's A6).
- What each item must say (my paraphrase):
- **W. The `workspace` member's shape** (OPEN-W (a)):
  - `filter`, as applied;
  - `clauses`, `{text, enabled}` in order (OPEN-10 (B));
  - `style`, the §5a document as the renderer admits it (OPEN-12 (A));
  - `view`, a centre and a scale in the dataset's space, named in `dependencies.crs`'s form (OPEN-11 (A); R9);
  - the analysis settings, reserved by name.
  - A click selection is not saved (round 69, item 4).
  - **The canonical number domain** refuses a non-zero magnitude below 1e-6 (`renderer/src/canonical.rs:33-38` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:8caad072f641d2177e2d8d4d644caea8a16cfc0d73154cd50cbce7e0b25d71d3). So W's words must say how a `view` coordinate with 0 < |v| < 1e-6 is written, with no silent conversion and no refused save. Those words go to the human with the rest of W at step 1's dispatch.
  - Under the human's sentence in A6, W completes version 1 and is not a version step.
- **D. How a reader tells which save a project file and a lineage file are from, and what it shows then** (OPEN-D (a); ruling 4's note, `state/directives/2026-10-09-adr-036-ten-findings-rulings.md:35` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:66d2f17a6919b480706163d8a7d4bcd38548b0d552538cc5f0316aa348c0a488):
  - the lineage is cut back by the step count when its prefix matches;
  - the previous lineage is used when it matches. It is kept in the machine store, so that §1's "nothing else" sentence holds in version 1;
  - otherwise, both files are named as from different saves, and neither is read silently.
- **M. The machine store** for a saved project: `projects/<hex>/`, holding `locations.json`, `folders.json` and `open.lock`. The folder memory also holds absolute paths, so this widens the "only file" sentence at `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:182` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:50acf7c1bdc1e0dd510c23d16c8cc35bba795ca253b33d35411f2e0ae0734342.
- **H. The locators a lineage header carries** (1a Amendment 5's note): the project file's. A session-history header carries `machine-recorded` only.
- **S. A session history's record after the first save** (OPEN-18 (A)): `<project hex>`, with the header's `project` URI. The header shape already admits that URI (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:101` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:f2a30ed5309b43a2a1e2b70b0613c3442d3c5dcd8a66169e2849b9f8d0e4041f).
- **C. The reader ceilings by number** (N-9's first item, `state/consults/2026-10-08-adr-036-reuse-round-1-findings-architect.md:153` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:d56ec9c697bec3355f87c4dc778bc1f8ace032530237d19af5cfabbc06e1f132, which the acceptance consult assigns to 1c at `state/consults/2026-10-21-adr-036-acceptance-architect-consult.md:51` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:95d1b64295eabfc0bd27f8f7e37685929ddb6712405c2ca6da0b93c97920cdd1). These are the existing 8 locators and 4,096 bytes per string, and §7's new ceilings.

Under OPEN-A (c), nothing more comes here. None of W, D, M, H, S or C changes the shape of a project file or a steps file beyond what A6 reserves, so none of them is a `version` step (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:42` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:c1308d8b709dadcf4c9c01993cdffc4b5c2dbd633f92043bafaa8d206b1b6791).

**ADR-022 Amendment 2: the human's words (OPEN-2 (A)), with the human's change applied.**
- The base is a sub-line span of `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:15` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:4ec4c347b4ab3e499bbd71160cdad6ac0f735cbd35046044bcbbb7164688e819.
- In it, "the step record for provenance" is replaced by the replacement span of `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:14` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:e4acf988768cac287ac0b4607a7c9591965e6c4d209ab5d42ff0268c45516ba1.
- Each line's hash covers its span.
- The text is reproduced because the worker applies it byte for byte. Every span is byte-copied from my Read, not by script, and the custodian rebuilds the text by script from the two lines:

> Amendment 2 (b2-piece-1c-save-and-reopen): from piece 1c, the §5a style document is persisted in the project file, in the workspace member ADR-036 defines. The save is ADR-006 class 2 and atomic. docs/11's obligations are met by the project URI, ADR-036 for the schema, save and reopen for the lifecycle, and the project's steps file for provenance; the lineage member stays a named state. Consequence (a) stands, and the lineage is not granted by this amendment.

- **Where it lands:**
  - at the end of `docs/adr/ADR-022-style-v0-as-the-single-style-model.md`, after Amendment 1 (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:73-78` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:0c8da41c6bd80bc97ad4bea0b1dae8969cc10a76b44aaeb51efdcdb5c4c50bdc);
  - in step 1's first commit, together with this piece's appended ADR-036 amendment;
  - before any code that writes a style into a project file (consequence (b), `docs/adr/ADR-022-style-v0-as-the-single-style-model.md:59-62` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:c3f2dc9b548525ed0918c6a72459bbcc83e2a131965d1974c76ddac21a1c1ce4).
  - The two land together because the human's words name the workspace member that ADR-036 defines.
- The form of its heading is the human's or the custodian's to set.

**Live text that says ADR-036 is Proposed.** Step 1 brings these lines current in the files it edits:
- `kernel/src/dataset_ref.rs:4` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:9fe27abfe28a7f53d8f790199f05360f4e4e945ef545a499a46a718fc14d4ba6;
- `kernel/src/lib.rs:18` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:5fe94a9083d2f35897af669c5945fc667d6e2168f9b8a929446de7a07956614a;
- `kernel/src/session_history.rs:5` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:70c0ab4fea3823d19f70bd70db03ee2ca8deda33495bd86f07673b6ff4b677b9;
- `kernel/README.md:274` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:0200cee1c55a2059d5b17fa25237001c28023f7a76b3add2982ad88f2ff8d74e;
- `kernel/README.md:375` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:2afc45e7b4163a58f295f5f71e6a02df2aaa9c4a59eb665eaa9fbf486f7859c0;
- `kernel/tests/no_generation_in_persisted_artifacts.rs:42` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:13c3af1229ac479f11ebbe2929d445f142f57fc7abfdf42dddcc9e582f7526e4;
- `protocol/skp/src/v0/commands.rs:513` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:8c34e8bbaaca1a4d7b718a0c66eef9ad4755a19036328f8d98f105da3f18d9de;
- `protocol/skp/SKP-V0.md:223` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:5740d7584f7496f182249f02f2662222b49d9c550fecd8aae45549360bc7b209;
- `protocol/skp/SKP-V0.md:1239` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:9909f05b327da32ce5f7ac9edceb703ff8f8ccf21344506d6df3347c771ab392.

The shell's two lines go to a docs-lane piece unless a step edits that file: `frontends/shell/src/workspace/viewTransitions.ts:6` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:e573caa687c6fc7b4e5f9d87115405ab318e12df1eb63d607f9e91bdfebc2f04 and `frontends/shell/src/style/StylePanel.tsx:55` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:d70064da808b2124b27f9bea67f30094afebff4fc5772f49ea514fef7cc98eac.

**Round + item cites.** Once the governance lane's resolver lands (§2.14), every round + item cite under `docs/adr/` must resolve. Every round + item cite in this piece's appended amendment, such as "round 69, item 4", is checked by that resolver before step 1's PR opens.

### 2.11 Steps, files, budgets and the counting command

**The counting command** for every step, at head H, with base B named in the PR body:

`git diff --numstat B...H -- . ':!kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.md' ':!CUSTODIAN-QUEUE.json' ':!site' ':!docs/README.md' ':!Cargo.lock' ':!frontends/shell/src-tauri/Cargo.lock' ':!frontends/shell/package-lock.json'`

An overrun is class 8, and §7 is never edited.

**Step 1, Save project:**

| Group | Ceiling |
|---|---|
| O0's probe and its written result (`spikes/b2-1c-onedrive-probe/`) | 150 |
| ADR text (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, `docs/adr/ADR-022-style-v0-as-the-single-style-model.md`) | 80 |
| renderer (`renderer/src/canonical.rs`: the layout function, its module-doc paragraph, its new tests) | 200 |
| protocol product (`protocol/skp/src/v0/{commands,mod,error}.rs`, `SKP-V0.md`) | 320 |
| fixtures and protocol tests | 260 |
| version literal (≤ 30 files) | 130 |
| kernel product (`kernel/src/project/*` new, `dataset_ref.rs`, `session_history.rs`, `lib.rs`) | 1,350 |
| kernel tests (`kernel/tests/project_save.rs` new, `project_save_crash.rs` new, `no_generation_in_persisted_artifacts.rs`) | 1,000 |
| src-tauri | 100 |
| shell product (`skp/{types,client}.ts`, `project/saveProject.ts` new, `App.tsx`, `console/surfaceRegistry.ts`) | 380 |
| shell tests | 380 |
| e2e (`e2e/project.mjs` new, `package.json`, `e2e/README.md`) | 320 |
| records (`kernel/README.md`, one KNOWN-LIMITATIONS item, one walkthrough Part) | 120 |
| **Total** | **≤ 4,790, ≤ 77 files** |

**Step 2, Reopen:**

| Group | Ceiling |
|---|---|
| protocol | 320 |
| fixtures | 260 |
| literal | 130 |
| kernel product (`project/{resolver,store,mod}.rs`, `dataset_ref.rs`) | 1,400 |
| kernel tests (`project_reopen.rs`, `project_resolver.rs`, `project_lock_crash.rs`) | 1,300 |
| src-tauri | 100 |
| shell product (`project/openProject.ts` new, `admission/AdmissionPanel.tsx`, `App.tsx`, the question and re-link UI, `workspace/viewTransitions.ts` read only unless I1) | 520 |
| shell tests | 450 |
| e2e | 450 |
| records | 140 |
| **Total** | **≤ 5,170, ≤ 75 files** |

**Step 3, Recovery:**

| Group | Ceiling |
|---|---|
| protocol | 260 |
| fixtures | 200 |
| literal | 130 |
| kernel product (`session_history.rs`, `project/mod.rs`) | 600 |
| kernel tests (`recovery.rs`, `recovery_crash.rs`) | 600 |
| src-tauri | 80 |
| shell product (`project/RecoveryOffer.tsx` new, `App.tsx`) | 350 |
| shell tests | 350 |
| e2e | 300 |
| records | 100 |
| **Total** | **≤ 2,970, ≤ 60 files** |

### 2.12 Strings the app shows: P6 placeholders (none is the human's; each states only what §2 does)

- **Kernel messages,** each stating a fact: one per code in §2.2. Each names the member's path, the segment or the folder, as its code requires, and never a consequence.
- **Owner (shell) placeholders:**
  - S1: Save project's control label.
  - S2: the folder picker's title.
  - S3: the saved notice.
  - S4: the not-saved notice, with `{message}`.
  - S5: the history mark withheld (OPEN-9 (A)).
  - S6: the selection notice at save (round 69, item 4).
  - S7: the folder already holds a project.
  - S8: the copy-or-same question (the human's words; round 70, OPEN-2).
  - S9: the already-open refusal.
  - S10: the changed-file notice, with `{components}`.
  - S11: not found, with the re-link prompt.
  - S12: re-link differences, with `{components}`.
  - S13: the recovery offer, with `{dataset}` and `{time}`, and its two choices.
  - S14 and S15: in the offer, the data changed, or not found.
  - S16: a lineage from a different save.
  - S17: a lineage this version cannot keep.
  - S18: inside data with no canonical spelling on this machine; the project will not find that file on another machine (OPEN-4 (A)).
- **KNOWN-LIMITATIONS items** (placeholders, at the next free numbers after the redaction scan's item):
  - K-1: withdrawn (OPEN-5 (B): no handle is held).
  - K-2: containment is checked when the project opens its data, on every platform. A link, rename or replacement that another program makes afterwards is not prevented, at the open or at any later read. A change the detector or the advisory watch sees ends the session (items 19 and 23 to 28), and a change they do not see is not detected.
  - K-3: a Cancel during an online-only download takes effect when the current read returns (H5).
  - K-4: the machine store is never pruned.

### 2.13 What waits on what

| Step or work | Waits on |
|---|---|
| ADR-036's pre-acceptance text | the block's PR merged; then the acceptance commit (Status `Accepted 2026-10-22`, `docs/README.md` regenerated). Under the other order, see §2.10 |
| this piece's appended ADR-036 amendment, and ADR-022 Amendment 2 | the acceptance, and the human's approval of the appended amendment's words. Both land in step 1's first commit |
| step 1 | the rows above, O0 recorded in Amendment 1, and rule (00) (§2.14: the redaction PR merged, for `kernel/README.md`) |
| the step 2 resolver | O0 (H1) |
| step 3 | step 2 merged (OPEN-3 (A)) |

Every OPEN item of this form and of the block is ruled. Amendment 1 records O0's result and the human's answer on the order (§2.10).

### 2.14 Overlap (rule (00), `AUTONOMY.md:609` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0)

Separate KNOWN-LIMITATIONS items, walkthrough Parts and e2e README entries count as separate paths (`state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md:14` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:551c2c8c99555a9cf256d5cc1279d1c659a809b72cf150094b8574206ec63c92).

This piece's paths are §2.11's groups, for each step, plus this form.
- Every step touches `protocol/`.
- No step touches `scripts/`, `.github/`, `AUTONOMY.md`, `state/cut-archive/`, `state/drafts/`, `site/` or `CUSTODIAN-QUEUE.*`.
- PLAN.yaml is the custodian's, on main.

**The block's PR** (`adr-036-pre-acceptance-block`, in progress on `cut/adr-036-pre-acceptance-block`). Its paths are listed at `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:366-372` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:22c93d25cb0f070a7f37c452433ea16af42fe3233b493ef2ea27e1a835e08223: ADR-036 edited by hand, the generated `docs/README.md` row, its form, and PLAN.yaml with the generated files.
- **ADR-036.** Step 1 appends to it, so step 1 follows the block's merge and the acceptance commit, in sequence by dependency.
- **`docs/README.md`.** 1c changes no Status line, so it regenerates nothing there.
- **ADR-022.** The block does not touch it.
- **This form's commit** touches none of the block's paths.

**The redaction scan** (`bundle-redaction-scan-not-in-product-publish`, slot 1, in progress, stopped at O0). Its paths are listed at `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:359-370` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:fade60db5d57b37c743407a691e240f4df6512ccf333dc1844d1c4ff817dbd71.
- **Shared, as the same file: `kernel/README.md`.** Its owner's-index rows and last-verified line are edited by both. So each 1c step that edits this file, step 1 included (its records group and the Proposed lines at 274 and 375), is dispatched after the redaction PR merges.
- **`KNOWN-LIMITATIONS.md`.** Separate items, so disjoint. The redaction's W6 takes the next free number, and 1c's items follow it. Items 19 to 28, which K-2 and the human's sentence name, keep their numbers.
- **`kernel/src/permission/`.** 1c only reads `data_dir`, through `kernel/src/session_history.rs:38` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:93504a5c3026cbac159e5d5a8aeb296042087a22954b77aeb0ffbf707988f94a. The redaction edits `permission/boundary.rs` and `audit/reader.rs`, which 1c does not touch.
- **`engine/src/fixture.rs`.** 1c uses `write_geoparquet` (F1) and edits nothing there.
- **src-tauri.** 1c edits `commands.rs` and `lib.rs`. The redaction edits only `publish.rs`'s `mod tests`.
- **The rest of its paths:** `kernel/src/bundle/redaction.rs`, `kernel/src/publish/`, `kernel/tests/typed_terminal_codes.rs`, `kernel/tests/permission_boundary.rs` and `engine/README.md`. 1c touches none of them.
- **`protocol/`.** The redaction touches none.

**The governance lane's draft** (`verify-quotes-round-item-cites`, ready). Its paths are listed at `state/consults/2026-10-21-verify-quotes-round-item-cites-architect-draft.md:308-316` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:6199952f10930db7b54e58bcb462496f1171d465a183bc416cef54c3ec220fb7:
- `scripts/plan/rulingSet.mjs`;
- `scripts/plan/verify-quotes.mjs` and `scripts/plan/verify-test-claims.mjs`, each with its test;
- `scripts/plan/README.md`;
- `.github/workflows/governance-ci.yml`.

These are disjoint from every step. The one contact: once it lands, round + item cites under `docs/adr/` must resolve. So step 1's two ADR appendices are checked by that resolver (§2.10), as is this form's text when it is scanned.

**`record-step-style-match-widening`** (proposed; milestone 4's OPEN-4 (A′), which the block carries). Its paths are `protocol/` (SKP-V0 §10.2 and `protocol/skp/src/v0/commands.rs`) and `kernel/src/session_history.rs` (PLAN node `record-step-style-match-widening`).
- It shares `protocol/` with every 1c step, and `kernel/src/session_history.rs` with steps 1 and 3. At most one piece may touch `protocol/`, so it never runs beside a 1c step.
- Whichever of the two lands first, the other is written against what is on main at its base (I1).
- The human places it. If it is placed as the first commit of step 1, that is a scope addition, recorded as class 9 by amendment before its code.

**Milestone 4** (`b1-shell-half`, blocked, slot 1 after the redaction scan; its form is not committed). Its paths are its draft's §2.6 (`state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:328-350` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:b5a56c9ed7b74462728422def3c62242dc984f2c100dc21f75389430fc1993b9), with its rulings at `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:20` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:0492f90a35a4b8ec4a2d45ee5df5be2253f7891e5410f66b606d49b04dd04fdb.
- **Shared:**
  - `App.tsx`, `console/surfaceRegistry.ts`, `skp/client.ts` (its PR A) and the script lines of `package.json`;
  - `workspace/workspaceState.ts` and `workspace/viewTransitions.ts`, which 1c reads and edits only under I1;
  - `style/document.ts`'s `StyleState`, which its PR B widens with `fillMatch` and which step 1 serializes.
- **Separate paths:** walkthrough Parts, KNOWN-LIMITATIONS items and e2e README entries.
- **Renderer, disjoint.** Milestone 4 edits `renderer/style-ts/src/style.ts`, `renderer/tests/data/style-agreement.json` and that file's Rust reader. Step 1 edits only `renderer/src/canonical.rs`.
- **Order.**
  - Where shell paths meet, milestone 4 goes first. So no 1c step dispatches while a milestone 4 PR is in progress or awaiting merge.
  - Each step's `workspace` member and its recovery are written against the `StyleState`, `ViewState` and `style.set` value shape that main holds at the step's base (the seam rule; otherwise I1).

**Done, and not touching this piece:** governance D (PLAN node `governance-plan-summaries-archive`, done) and PR #239 (`walkthrough-current-view-rows-g1-n5`, merged).

**`protocol/`:** at most one piece at a time. Steps 1 to 3 each touch it, so no other piece may touch it at their dispatch, the recording piece included.

## §3. Fixtures, with outcomes declared in advance

| Fixture | Used by | Predicted |
|---|---|---|
| F1: 500 polygons, LV95 (`spatial_engine::fixture::write_geoparquet`), placed inside a scratch project folder | K-S1 to K-S9, K-O1 to K-O7 | it is saved with `machine-recorded` plus `project-relative`, and reopens with equal claims and no difference |
| F2: F1 placed outside the folder | K-S5 | `machine-recorded` only, and no absolute path in the file |
| F3: F1 behind a junction (Windows) or a symlink (Linux) inside the folder | K-S4, K-R1, K-R2 | `machine-recorded` only at save; refused by name at open |
| F4: F1 with its mtime moved 60 s later | K-O2, E-CHANGED | `check.observed` names `modified_ns` |
| F5: hand-built project files with a duplicate key, members out of order, `1.00`, a reordered layout, and a lineage member that records a lineage | U-R1 to U-R5, L1 to L4 | each is refused or handled by name |
| O0, on this machine (the shared laptop the custodian runs on): a folder under OneDrive, with F1 copied in and set online-only by the human | O0, OP1 to OP3 | H1 and H5 |

**O0** (OPEN-6 (A)):
- **The human prepares the file** on this machine when the custodian tells them.
- **The worker writes the probe** under `spikes/b2-1c-onedrive-probe/`, as step 1's branch's first commit, before any product commit. It is std only, with a timeout.
  - For the placeholder, it records `symlink_metadata`'s `is_symlink` and `is_file`, and records that the walk did not start the download.
  - It records that an open and a read by path start the download and complete.
  - For a junction it makes in a scratch folder, it records `is_symlink`.
- **The custodian runs it** on this machine, under THE MACHINE paragraph, after the human has prepared the file. The custodian files its output as evidence.
- **Amendment 1 on main** records the result. It names the probe by path and by the branch commit id, and pins no hash at that branch commit.
- **Step 1's product commits** follow only after Amendment 1.

## §4. Tests, and one mutation per new test

A mutation is observed by applying it, running the named test, recording its failure by name with its commit, and reverting it (round 25, item 2 (c)). No `verify-mutation` run is called an observation.

**Step 1**

| Test | Mutation |
|---|---|
| U-L1 `the_line_oriented_layout_writes_adr_036s_example_byte_for_byte` (`renderer/src/canonical.rs`, `mod tests`; the block's A3 example) | a four-space indent |
| U-R1 `the_strict_reader_refuses_a_duplicate_key_naming_its_path` | the duplicate check removed |
| U-R2 `the_strict_reader_refuses_members_out_of_declared_order` | keys compared as a set |
| U-R3 `the_strict_reader_refuses_a_number_not_in_canonical_spelling` | the rendered file compared as parsed values, not as bytes |
| U-R4 `the_strict_reader_refuses_any_layout_but_the_line_oriented_form` | the render comparison skipped |
| U-R5 `every_member_and_the_file_are_refused_over_their_ceilings` | the `MAX_PROJECT_FILE_BYTES` check removed |
| U-R6 `writer_then_reader_round_trips_generated_project_files_byte_for_byte` | the indent unit changed in the writer only |
| U-C1 `canonical_form_refuses_device_names_trailing_dot_or_space_and_control_characters` | the device-name match made case-sensitive |
| U-I1 `an_observation_over_the_exact_integer_bound_is_refused_at_bind` (`kernel/src/dataset_ref.rs`, `mod tests`; a unit test of the private check, on 1a's R6 precedent, because a real file over 2^53 − 1 bytes cannot be made) | the check removed |
| K-S1 `a_saved_project_reads_back_in_the_line_oriented_form_from_a_real_open` (the seam: `open_dataset` → `save_project` → the reader) | the writer emits the one-line form |
| K-S2 `the_identity_is_minted_at_the_first_save_and_kept_after` | minted at every save |
| K-S3 `inside_data_reached_without_a_link_carries_project_relative_and_machine_recorded` | `project-relative` never added |
| K-S4 `data_reached_through_a_link_below_the_folder_carries_machine_recorded_only` | the walk follows links |
| K-S5 `outside_data_carries_machine_recorded_only_and_no_absolute_path` | the absolute path written as `at` |
| K-S6 `an_abort_before_the_rename_leaves_the_previous_project_file_whole` (a child process) | the file written in place |
| K-S7 `a_rename_that_keeps_failing_is_refused_by_name_after_the_declared_attempts` | the bound removed (it never returns) |
| K-S8 `a_save_appends_one_saved_here_mark_that_recover_chains` | `after` set to the first step |
| K-S9 `the_first_save_moves_the_record_under_the_project_identity` | the `unsaved-` record kept as well |
| K-S10 `a_first_save_into_a_folder_holding_a_project_is_refused` | the existence check removed |
| K-S11 `inside_data_with_no_canonical_spelling_is_saved_with_machine_recorded_only` | the save refused |
| K-S12 `saving_over_a_kept_lineage_is_refused_by_name` | the refusal removed |
| G3 `a_project_file_carries_no_generation_handle_session_reference_absolute_path_or_user_name` | the open's path written |
| Shell: `save sends save_project with the version, the folder once, and the workspace`; `a click selection at save shows the selection notice`; `a refused save shows the owner's notice with the kernel's message` | `folder` sent at every save; the notice omitted; the refusal swallowed |
| E-SAVE: open, filter, style, save; the file reads back; the folder holds `project.spatial` and no other format file | the save enqueued before the filter |

**Step 2**

| Test | Mutation |
|---|---|
| K-R1 `a_link_below_the_folder_is_refused_and_never_opened` | the link check removed |
| K-R2 `on_windows_a_junction_out_of_the_folder_is_refused` | the walk follows reparse points |
| K-R3 `a_device_name_or_trailing_dot_target_is_refused_before_any_open` | the text check skipped |
| K-R4 `an_unresolvable_target_is_refused_by_name` | a missing segment opened as the folder |
| K-R5 withdrawn (OPEN-5 (B): no held handles) | — |
| K-O1 `a_saved_project_reopens_with_its_data_claims_and_workspace` (the seam, real shape) | the claims dropped at reopen |
| K-O2 `a_changed_file_is_reopened_with_each_differing_component_named` | only `byte_size` compared |
| K-O3 `a_missing_file_returns_not_found_and_opens_nothing` | the machine location falls back to the folder |
| K-O4 `a_second_open_of_an_open_identity_is_refused_in_this_process_and_another` | no lock |
| K-O5 `the_second_open_refusal_never_outlives_a_crash` (a child process aborts while holding the project) | a marker file created by `create_new` instead of a lock |
| K-O6 `the_question_is_asked_only_when_the_first_folder_holds_this_identity_or_cannot_be_reached` (five cases) | asked whenever the first folder exists |
| K-O7 `a_copy_gets_a_new_identity_in_the_new_folder_and_its_own_links` | the new identity written to the first folder |
| K-O8 `a_relinked_file_is_checked_against_the_observation_and_each_difference_named` | the check skipped on re-link |
| L1 to L4 (ruling 4, on hand-built files, with the previous lineage in the machine store, item D): a match; a prefix cut back by the step count; a previous lineage used; a different save named and not read | each detection arm removed in turn |
| Shell: `reopen goes through runAdmitPath and shows liveness and Cancel`; `question re-calls with the answer`; `the changed-file notice names each component` | `admit` bypassed; the answer dropped; the components joined into one word |
| E-REOPEN; E-CHANGED; E-SECOND (two app processes); E-CRASH-UNLOCK (kill the first process, then the second opens) | each step's wiring removed |

**Step 3**

| Test | Mutation |
|---|---|
| K-C1 `a_crashed_unsaved_record_is_listed_with_its_dataset_and_time` | lists this run's records |
| K-C2 `declining_removes_the_record` | removal skipped |
| K-C3 `accepting_truncates_to_the_kept_prefix_and_later_steps_chain` | `parent` null after adopt |
| K-C4 `a_projects_record_is_offered_at_its_open_not_at_start` | listed at start |
| K-C5 `the_offer_states_changed_or_not_found_data` | `check` skipped |
| K-C6 `a_locked_record_is_never_offered` | no lock probe |
| K-C7 `an_unsaved_record_moved_to_a_project_record_is_not_offered_twice` | no dedupe |
| Shell and E-RECOVER (apply steps, kill, start: the offer names the dataset and the time; accepting restores the state) | the offer applied without the check |

No existing test is edited, except for the version literal. Under OPEN-19 (A), any 1b test whose hand-written line is out of order is edited too; that edit is I3 if it happens.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predictions:** §3's column, and H1 and H4 to H7. A wrong prediction is class 2.
- **Declared unchanged:**
  - `engine/` and `protocol/data-plane`;
  - `renderer/`, apart from `renderer/src/canonical.rs`'s one new function, its module-doc paragraph and its new tests. `to_canonical_string`, `canonical_and_hash`, `write_double` and every existing test there stay byte-identical;
  - the six commands' shapes, apart from the literal;
  - `SkpHost::new`, `data_dir`, `kernel/src/permission/**` and the bundle;
  - ADR-005, ADR-006, ADR-016 and ADR-017;
  - every line of ADR-036 and of ADR-022 outside the two appended amendments;
  - every existing e2e suite's outcomes.
- **Invalidators** (stop and report):
  - **I1:** a pinned interface has changed at the base, milestone 4's style state and the `style.set` value shape included.
  - **I2:** H1 fails: a placeholder is a name surrogate, or will not download.
  - **I3:** an existing test needs an edit outside §4.
  - **I4:** product code before the acceptance commit, before this piece's appended ADR-036 amendment is approved, or before O0 is recorded.
  - **I5:** withdrawn (OPEN-5 (B)).
  - **I6:** a lockfile change or a new dependency.
  - **I7:** a shared path, or a second piece touching `protocol/`.
- **Falsification:**
  - std's per-segment walk cannot tell a link from a cloud placeholder on this machine (H1);
  - the line-oriented form cannot be held to one byte form.

## §6. Instruments

Assertions only: typed outcomes, byte equality, bounds and file presence. No measurement and no docs/08 row. O0's output is a pass or fail record, filed as evidence.

## §7. Declared values and ceilings

Each at its own site:
- `MAX_PROJECT_FILE_BYTES` = 1,048,576;
- `MAX_LOCATOR_SEGMENTS` = 64;
- `MAX_SAVE_RENAME_ATTEMPTS` = 5, with a declared pause between attempts and no timing claim;
- `MAX_KNOWN_FOLDERS` = 256 per identity;
- the reserved device-name list (OPEN-20 (A)), declared as data at its site. It holds the block's A4 list (OPEN-R (a));
- the layout's indent unit (two spaces) and its separator after a key (`: `), declared at the function's site in `renderer/src/canonical.rs` (OPEN-L (a));
- the existing ceilings: 8 locators, 4,096 bytes per string, and the CRS definition ceiling.

The budgets are §2.11's, with its counting command, per step. §7 is never edited, and an overrun is class 8.

## §8. Block-on-sight

1. An absolute path, handle, session reference, generation or user name in a project file. A locator built or parsed outside the kernel.
2. A project-relative target opened before every segment is checked. A link followed. A handle held past the check (OPEN-5 (B)).
3. A save written in place. A reply before `sync_all`. A temp name outside the declared pattern removed.
4. A lock that can outlive a crash (a marker file).
5. A question asked or skipped against ruling 8. A new identity written to the first folder.
6. A lineage written (OPEN-8 (A)). A kept lineage overwritten silently.
7. Product code before the acceptance commit, or before this piece's appended ADR-036 amendment is approved. ADR-036 or ADR-022 text the human has not approved. A style persisted without ADR-022 Amendment 2.
8. A kernel message stating the shell's consequence. A silent refusal.
9. A `pub` item or option without a product caller (instrument accessors and round 8 excepted only as ruled).
10. A new dependency, `cfg`, resolver of the data directory, or lockfile change, in product code.
11. Undo, replay or "undoable". A performance number.
12. The round-25 items, by name:
    - an overrun not recorded as class 8, or §7 edited;
    - a scope addition not recorded as class 9, or its code landed before the amendment that declares it;
    - a `verify-mutation` run called an observation;
    - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id;
    - a five-line form.
13. Quotation marks around text that is not byte-identical. A line cite into the ledger. A bare self-line. A pin read as current.
14. A canonical byte form written, or a hash taken, outside `renderer/src/canonical.rs` (ADR-022 decision 3; §2.3a).
15. A claim that a project-relative locator never points outside the folder, or that the data read is the data checked (C1; §2.5).

## §9. Gates

- **Commit plan:**
  - Step 1 opens with O0's probe, then the ADR commit (§2.10).
  - Every step then runs: the protocol and fixtures; the renderer function (step 1 only); the kernel with its tests; the binding; the shell with its tests; the e2e suite and records.
- **Architect:**
  - §8, item by item;
  - ADR-006 per §2.1;
  - ADR-036 as accepted, with this piece's appended amendment as approved;
  - ADR-022 Amendment 2, byte for byte against the human's two lines;
  - ADR-022 decision 3, per §2.3a;
  - principles 4, 5, 7 and 8;
  - R9 for `view`, and W's words for its sub-1e-6 coordinates;
  - the seam rule for each of these seams:
    - shell → `save_project` and `open_project` → kernel → file;
    - kernel writer → `renderer/src/canonical.rs`'s layout function (U-L1, K-S1);
    - kernel → `SkpHost::open_dataset`;
    - resolver → engine path (K-O1);
    - `recover` (1b) → recovery (K-C3);
  - round 8, closing 1b's OPEN-6;
  - the discharge and operator-text rules, verbatim quotes, and round 25.
- **Reviewer:**
  - the full diff, `origin/main...HEAD`;
  - every mutation made again;
  - §2.11, by its command;
  - every hash recomputed;
  - empty lock diffs.
- **Suites:**
  - the workspace: `cargo test --locked --features spatial-engine/fixture`, `fmt` and `clippy`;
  - the shell: `npm run verify`, and the src-tauri tests;
  - every e2e suite;
  - the `scripts/plan`, `hooks` and `evidence` node tests;
  - verify, queue, site, cites, quotes (a floor) and test-claims;
  - green CI.
  Heavy runs follow THE MACHINE paragraph.
- **Operator** (a new Part, with a blank log):
  - P0: read the last amendment first;
  - OP1: save into a OneDrive folder;
  - OP2: reopen with the data online-only; the download shows liveness and Cancel, and never looks frozen;
  - OP3: Cancel during the download;
  - OP4: copy the folder by hand and open the copy (the question);
  - OP5: open the project in two windows;
  - OP6: crash, then the recovery offer.
- **PR body:**
  - asks for a merge commit;
  - names each OPEN ruling, the block's rulings, the order answer, base B, and `recover`'s consumer closed;
  - shows the lock diffs;
  - lists the P6 strings.

## §10. Amendments

*(Opens empty; append-only. Amendment 1 records O0's result and the human's answer on the order of the block and the Status edit, before any product code.)*

---

# OPEN items, as ruled

The human's rulings are at `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:10` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:4b060a097e2669c574a255533c6db432f4f3bb4e477b51d38bb8f192cbff8f1d (OPEN-1) and `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:15-18` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:811bdb3925ad133e27f6c822cb34bab080e5727ecace3b93f5f04e88ad8e3967 (the rest). ADR-022 Amendment 2's change is at `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:14` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:e4acf988768cac287ac0b4607a7c9591965e6c4d209ab5d42ff0268c45516ba1. Each item keeps its options; **ruled** marks the option the human chose.

- **OPEN-1. ADR-036's route.**
  - (i) a pre-acceptance block carrying the rulings, then acceptance, then code. **Ruled (i)** (§2.10).
  - (ii) accept now, with words that keep version 1 open, and the amendment in step 1;
  - (iii) accept together with step 1, before it merges.
- **OPEN-2. ADR-022 Amendment 2: style persistence in the project file.**
  - (A) grant it, for the §5a document. **Ruled (A),** in the human's words, with the human's later change. §2.10 quotes the result.
  - (B) no grant, so 1c saves no style.
- **OPEN-3. Steps and wire versions.**
  - (A) three PRs, each with its own SKP version. **Ruled (A).**
  - (B) three PRs, with steps 2 and 3's commands landing in step 1 under a round-8 pre-commitment;
  - (C) one PR with staged commits.
- **OPEN-4. Data inside the folder with no canonical spelling.**
  - (A) carry `machine-recorded` alone, and the owner says the project will not find the file on another machine. **Ruled (A),** in the human's words. This is a sub-line span of `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:16` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:67b0c2963e8b393cd62e79d48d17aaeafc9e9a296d2f366bb27fa1793449fead, which carries that line's hash. It is byte-copied from my Read, not by script:

    > data inside the project folder whose path has no canonical spelling on this machine is recorded as machine-recorded only, and the owner's statement says the project will not find that file on another machine; the save is not refused.
  - (B) refuse the save.
- **OPEN-5. How the checked target is the opened target.**
  - (A) on Windows, pinned by held handles that deny delete-sharing; on Linux and macOS, checked at open only, as declared;
  - (B) checked at open only, on every platform, with the race declared. **Ruled (B),** in the human's words. This is a sub-line span of `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:17` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:db5b3cb0e1dd5d827d89a054ced7dc99f50035d53fff4c2f8babff7e7a7aa5f9, which carries that line's hash. It is byte-copied from my Read, not by script:

    > checked at open on every platform, the race declared; no held handles.
  - (C) (A), plus a Linux hand-off through `/proc/self/fd`.
- **OPEN-6. O0, the OneDrive probe, before the code.**
  - (A) the human prepares an online-only file, and the custodian runs a std-only probe that the worker writes under `spikes/`. **Ruled (A).** In paraphrase: the human prepares the file on this machine, the shared laptop the custodian runs on, when the custodian tells them. §3 states who does what.
  - (B) the custodian runs it alone, if OneDrive is signed in on this PC.
- **OPEN-7. A second open of an identity that is already open.**
  - (A) refused by name, by an OS lock that is freed at a crash. **Ruled (A).**
  - (B) focus the existing window, which needs single instance.
- **OPEN-8. Lineage in 1c.**
  - (A) none written: the member is a named state, the reader handles ruling 4's full shape, and a save over a kept lineage is refused by name. **Ruled (A).**
  - (B) 1c writes the lineage now.
- **OPEN-9. What Save trusts.**
  - (A) the client sends the workspace; the kernel validates it, withholds the saved-here mark when the filter or style differs from what the history's steps reach, and says so. **Ruled (A).**
  - (B) the kernel derives the filter and style from the history;
  - (C) as (A), with no comparison.
- **OPEN-10. Filter clauses.**
  - (A) save the filter as applied only;
  - (B) save the clause list too. **Ruled (B).** In paraphrase: the clause model is being merged in milestone 3. It is on main as `ViewState.clauses` (§0.3).
- **OPEN-11. The map view.**
  - (A) saved as a centre and a scale in the dataset's space, named per R9. **Ruled (A).**
  - (B) not saved in version 1.
- **OPEN-12. Point and line style.**
  - (A) the same §5a document, whatever the geometry, as the canvas draws it. **Ruled (A).**
  - (B) members per geometry kind.
- **OPEN-13. Accepting a recovery offer.**
  - (A) adopt in place: lock, truncate to the kept prefix, continue. **Ruled (A).**
  - (B) copy the prefix to a new record.
- **OPEN-14. Integers above 2^53−1.**
  - (A) the ADR bounds `byte_size` and `footer_length`, and the reference build refuses a larger file. **Ruled (A).**
  - (B) write them as decimal strings.
- **OPEN-15. The Snapshot column.**
  - (A) reserved for stage 3, with its version step. **Ruled (A).**
  - (B) readable in version 1, and refused at open.
- **OPEN-16. A first save into a folder that already holds a project.**
  - (A) refuse by name. **Ruled (A).**
  - (B) ask to replace.
- **OPEN-18. The session record at the first save.**
  - (A) copy it under a new header naming the project, then remove the `unsaved-` record, with recovery de-duplicating by first step id. **Ruled (A).**
  - (B) rename the folder and keep the `not-yet-saved` header.
- **OPEN-19. One strict reader for the session history too.**
  - (A) yes. **Ruled (A).**
  - (B) the project file only.
- **OPEN-20. The reserved-name list.**
  - (A) a list declared at its site, with the concept from Go and nothing ported. **Ruled (A).**
  - (B) a cap-std dependency.

There is no OPEN-17. The `.spatial` check is on record (`state/consults/2026-10-21-spatial-extension-check-custodian.md`).

The block's options are ruled at `state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:9-12` @ ad921f552f25a138bf845368e2e9e1f726d73812 sha256:2d2fca8569d15575fc62b5263a096ca26fcd9de7e60bb9d85655dfbee75df1dd: OPEN-A (c); OPEN-L, R, D, S and O (a); OPEN-W (a). OPEN-O (a)'s condition was not met, so the block followed PR #239, which has since merged.

## Amendment 1 — written after O0 (B)'s attempt and the probe's local control run were seen, before any product code: the order (class 1); the human's approval, O0 waiting and step 1 up to the resolver (class 5); the two ADR texts as they land; F1's reader refusal and five more additions, a scope addition (class 9); OPEN-17 (b) (class 5); rule (00) at this dispatch (class 1); four corrections (class 3); the superseded index

*Written by the custodian before any product code. Drafted by the architect, read only at main e6dfe624 (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-amendment-1-architect-draft.md`). It holds references and the approved ADR texts only. The texts are reproduced in Annexes A and B, by script, because the worker applies them byte for byte. Every line cite read at e6dfe624 is pinned by the custodian's script to the full commit id and its sha256 before commit; e6dfe624 is a commit on main. The human's rulings are cited by directive path and item, and none is reproduced. Self-references are by section and item.*

1. **The order (class 1).** The human's order (1) (`state/directives/2026-10-21-adr-036-order-1-b1-range-a0-two-sentences-redaction-viewer-hash-skip-adr-022-provenance-o0-file-verify-quotes-ruled.md:8` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:f4918dd5882572b3c58fb3316112e9521f7f76ce384f8cc1f325e8f2b6d7845e, item 1) happened as ruled:
   - PR #240 merged at e8f110bb2dfd0233b7593ff31be95af02504c757 (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:561` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:56411ebe69bc4ce3a977752b310f9d3e6e84a190ab4f0f77e365fb78bceca0e9);
   - then the acceptance commit 7cf76f9f92dee75086d7da1e196a6eda6a6b84b2 changed the Status line (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:3` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:a08a3c1bd902ef7b09bc14a96a9d21f9570c348d20d5f2dd11ae080617f12dda) and `docs/README.md`'s row (`kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:564` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:1118c7914bab42b37db96804a53513f9e37a75da11cc4579d9ae08b7bd3ae0aa).
   §2.10's paragraph for the other order does not apply. This form's ADR-036 cites are found again at each step's base by the bytes of their passage (the header's Pins).

2. **O0 and the resolver (class 5).** On item 5 of `state/directives/2026-10-22-242-h-1-round-72-pin-f7-open-items-milestone-4-open-16-b-adr-020-corrigendum-a-1c-adr-036-words-approved-disk-parity-node.md` and the Slot 2 line of `state/directives/2026-10-22-away-until-monday-241-r1-on-5400-f7-a-milestone-4-1c-code-o0-b-docs-lane-ruled-i4-a.md`.
   - **O0 (B) did not dehydrate.** The OneDrive client was not running. The file was removed at once, and the probe was not run on it (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-o0-b-attempt-custodian.md:6-10` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:209395d4fcb94485e2f32253c46dd5bdf3139e0010d89c6529b5fad50dbb632b).
   - **The probe.** It is `spikes/b2-1c-onedrive-probe/` at a88d01863f65eb1290f762f8a3f03db4b9e43a0c on `cut/b2-piece-1c-save-and-reopen`, named by its commit with no hash (round 15 (e)). Its local control run (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-step-1-probe-worker-report.md:49-67` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:a5b8912f4088fc45a8239cd5c4312b655a8321f3d32e964c36fac001b103302a) is not O0, and it tests neither H1 nor H5.
   - **O0 waits** for the human's own file on Monday 2026-10-26 (OPEN-6 (A)). Its result is recorded by an amendment of its own before any resolver code.
   - **Waits for O0 (H1):**
     - the resolver, all of §2.5: `judge` at save (step 1; §2.3's carrying rule calls it) and `check_inside` at reopen (step 2);
     - every step 1 path that calls `judge`: the save orchestration in `kernel/src/project/mod.rs`, with the carrying rule, the saved-here mark, the first-save record move, the OPEN-16 refusal, the kept-lineage refusal and `folders.json`'s `first`;
     - the tests that need that orchestration: K-S1 to K-S5, K-S8 to K-S12, K-S13 (item 5) and G3.
   - **Proceeds now (step 1 up to the resolver):** commits N2 to N7 of item 6, and nothing else.
   - **What this narrows.** The header's O0 condition, §2.13's step 1 row, §3's last two O0 bullets and I4's O0 clause now read as follows: product code before O0's amendment is I4 only where it is the resolver or calls it.
   - **§8 item 7 is met.** The human gave the approval in item 5, before step 1's PR opens.

3. **ADR-036's appended amendment, as it lands (Annex A).** The source is section 1 of the words draft (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:22-62` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:e5d1f112a8827674d197809e85ab85e2d702697a4bf467f531cf2efa0f83890e), as approved. Only these bytes change:
   - **(a) The heading's date.** `<date of the human's approval>` becomes `<DATE>`: the UTC date (`date -u +%F`) of the commit that appends it.
   - **(b) The `clauses` bullet of item 1** (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:28` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:b83f08b504facce810af39b376217f0f63871bf6abd294d993c18bc292d71a29). After `A clause carries no id.` come one space and OPEN-F1 (a)'s two sentences: a sub-line span of `state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:187` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:a67c6c4991b2bb7f3cfd9c3cd7b981f263e042302592bb2a8855aedb928115e9, carrying that line's hash.
   - **(c) The `view` bullet of item 1** (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:30` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:95f3593af0b1ecc9b3c176a4646b10684b4100b26e0b11fd1fdd52bffd54bc2f). After `spans on the canvas.` come one space and OPEN-V3 (a)'s sentence (a sub-line span of `state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:183` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:9d76059bb0090a420d2272e6bea45da2446059d9917328335329d842004aa9a5).
   - **(d) Item 3's closing paragraph** (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:49` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:522d7ba26e8aa281d741227de5f19b5e2b7c031043da5488b3963d54c6eedef2). After `is the only one.` come one space, OPEN-M1 (a)'s sentence (a sub-line span of `state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:191` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:64f57053fa577e5436968f1c008fc6812a1a19f6b7468df7c8c85b2b4026d355), one space and OPEN-M2 (a)'s sentence. The M2 sentence is new words of the architect's, carrying option (a) only; it is Annex A item 3's last sentence.
   - **(e) Item 6's closing paragraph** (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:62` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:7ed68b0b603a09fe5501a01942f66b32b1738a537bcacd1b18a59453d9bda7d6). After `§9's bounds on a session history stand.` come one space and OPEN-C1 (a)'s sentence (a sub-line span of `state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:200` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:0c9bff96fc7efbd39cbb03dda146074d5775dc9ff619e9094b148c49cc3ea3d6).
   - **Unchanged:** OPEN-V1 (a) and OPEN-V2 (a) are the drafted text (`state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:31` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:a7826a0f338bf11306913e879b91a7dc7c7c42ec8e71068958f1f982e9082863 and `state/consults/2026-10-22-b2-piece-1c-save-and-reopen-adr-036-amendment-words-architect-draft.md:30` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:95f3593af0b1ecc9b3c176a4646b10684b4100b26e0b11fd1fdd52bffd54bc2f).
   - **Where it lands:** at the end of the file after `## Consequences`, after one blank line. ADR-036's `**Amended:**` header lines are not touched: the acceptance said nothing else in the file changes (`state/directives/2026-10-21-adr-036-accepted-status-line-1c-code-may-start-redaction-proceeds.md:8` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:dd927bd8a8f84d913797e28207abc67425a5c20ae6144ce7efc49f4d4b8d6dfe). `docs/README.md` is not regenerated.
   - **When:** in step 1's first commit after the probe (N2), before the writer.

4. **ADR-022 Amendment 2, as it lands (Annex B).** It follows the human's reading (a) (`state/directives/2026-10-21-redaction-amendment-3-open-1-to-7-ruled-adr-022-amendment-2-reading-a.md:10` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:e8bb21c80483ac9b1cd6b1d09a7b1ebcbb74a6c3aa57b81e96a5af794cb7922b).
   - **Its body is built from three source lines,** each a sub-line span carrying its line's hash:
     - `state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:15` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:4ec4c347b4ab3e499bbd71160cdad6ac0f735cbd35046044bcbbb7164688e819: from `Amendment 2 (b2-piece-1c-save-and-reopen):` through `docs/11's obligations are ` (trailing space included), and from `Consequence (a) stands` to the end;
     - `state/directives/2026-10-21-redaction-amendment-3-open-1-to-7-ruled-adr-022-amendment-2-reading-a.md:10` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:e8bb21c80483ac9b1cd6b1d09a7b1ebcbb74a6c3aa57b81e96a5af794cb7922b: the quoted span that stays;
     - `state/directives/2026-10-21-adr-036-order-1-b1-range-a0-two-sentences-redaction-viewer-hash-skip-adr-022-provenance-o0-file-verify-quotes-ruled.md:12` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:a7f7599a88503a29136cd00027cfd59529be2056dc4bc476c03272e42cbc5ed0: the span after `my words in place of the earlier one: `.
   - **Not the human's:** the joining `. ` after `lifecycle` and the one space before `Consequence`.
   - **Superseded and not carried:** the second message's change (`state/directives/2026-10-21-adr-036-block-ruled-open-a-c-b1-words-open-w-sentence-adr-022-amendment-2-steps-file.md:14` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:e4acf988768cac287ac0b4607a7c9591965e6c4d209ab5d42ff0268c45516ba1).
   - **The heading** is the custodian's (§2.10), in the form of Amendment 1's heading (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:73` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:342a38a3f4f2780132b72c0e9cfcd8f0bd2dd45fe6edc7dd94a1ffe3c1c26495).
   - **Where and when:** at the end of ADR-022, in the same commit as Annex A, before any code that writes a style into a project file.

5. **Scope addition (class 9), on item 5 of the 2026-10-23 directive named in item 2, declared before any of its code.** §7 is not edited. Each addition counts in its step's §2.11 groups, and an overrun is class 8. Every new test's mutation is observed under §4's rule.
   - **F1 (step 1): the reader refusal.**
     - *§2.* The project-file reader (`kernel/src/project/file.rs`) refuses a `workspace` whose `filter` is not what its enabled clauses combine to (Annex A item 1). The code is `skp.project_file_refused` (§2.2), naming the member path `workspace.filter` and the rule.
     - *The interface it is written against.* The kernel's combination is written against the shell's `combineClauses` (`frontends/shell/src/workspace/filterClauses.ts:31-40` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:55d86ff100eff9f5904c9bcdc064a89793cdb4673bef4b89a4969608e3e7cb06). The shell's own state always meets the rule (`frontends/shell/src/workspace/viewTransitions.ts:108-119` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:2d256a87a99202500b974c1a5ce82d69237d9ad9a58bb1ddae386267b351d8c5).
     - *What it claims.* §2.3's pre-write check applies the same rule, but this addition claims the reader's refusal only.
     - *§3.* F5 gains four hand-built files:
       - two enabled clauses and one disabled, with the bracketed join (accepted);
       - the same with the texts joined without brackets (refused);
       - no enabled clause and a non-null `filter` (refused);
       - one enabled clause, with `filter` its text byte for byte (accepted).
     - *§4.* U-R7 `the_project_file_reader_refuses_a_filter_that_is_not_its_enabled_clauses_combined` (`kernel/src/project/file.rs`, `mod tests`). Mutation: the comparison removed.
     - *§9, the seam.* E-SAVE makes two enabled clauses and one disabled before it saves. The kernel's reader then reads back the shell's own join, in its real shape.
     - *§5.* `filterClauses.ts` and `viewTransitions.ts` are read only. A changed combination at the step's base is I1.
     - *§8.* Item 16: a `workspace` read or written whose `filter` is not its enabled clauses combined.
   - **V1 (step 1): its claim had no test.** Annex A item 1 claims that every finite view value is kept exactly and that no save is refused for one.
     - U-V1 `a_view_value_outside_the_number_grammar_round_trips_bit_exact_as_hexf64` (`file.rs`, `mod tests`): centre x = 5e-7, y = −0.0 and zoom = 1e15, each written and read back bit for bit. Mutation: the view numbers written through `write_double`.
     - U-V2 `a_view_number_in_any_other_spelling_or_not_finite_is_refused_by_name`: a JSON number, an uppercase hex string and a NaN pattern, each refused with `project_file_refused` naming its member path. Mutation: the view members read as JSON numbers.
     - The codec is `spatial_skp::v0::HexF64` (`protocol/skp/src/v0/codec.rs:38-63` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:dc2412a6222cc693365bd4da3f688410b2090a3bec1a8e6d760eb7d1ed5bfab0), already a kernel dependency (`kernel/Cargo.toml:21` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:0dd808e556f7ba63b767fcff0bd5462340769d85dd21dda57a015200b9219ed3), so no new dependency is added (I6).
     - *§8.* Item 17: a `view` number written through the canonical number grammar.
   - **V3 (step 2): a view saved in another space.**
     - *§2.* `opened` carries `workspace.view` only when the saved `view.crs` equals the reopened dataset's admitted space in all three members: identifier, provenance and definition. Otherwise `workspace.view` is the named state `{"state":"saved-in-another-space","basis":<text naming both identifiers>}`, and the shell applies no view. This changes the response only, and nothing is written.
     - *§4.* K-O9 `a_view_saved_in_another_space_is_not_applied_and_the_reopen_names_it` (`kernel/tests/project_reopen.rs`): F1 is saved, its `view.crs.definition` is replaced by another sha256 with the identifier kept, and the file is laid out again by the writer's function. Mutation: the spaces compared by `identifier` only.
     - *Shell.* `a view saved in another space is not applied and the owner says so`. Mutation: the view applied regardless.
     - *P6.* S19.
     - *§8.* Item 18: a view applied across spaces, or spaces compared by identifier alone.
   - **M1 (steps 1 and 2): the format of `folders.json`.**
     - *§2.* `folders.json` is written in Annex A item 3's shape through `to_canonical_string`. The first save writes `first` and an empty `same` (step 1), and an answer `same` appends to `same` (step 2).
     - *At reopen (step 2).* A `folders.json` the strict reader refuses, or one that holds more than 256 folders (Annex A item 6), refuses the open with a new code, `project_machine_record_refused` (the file's name and the rule). §2.2 gains it, and the file is not rewritten.
     - *§4.* K-S13 `the_first_save_records_its_folder_as_first_in_folders_json` (step 1, `kernel/tests/project_save.rs`, after O0). Mutation: `folders.json` not written at the first save.
     - *§4.* K-O10 `a_folders_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept` (step 2; cases: a duplicate key, and 257 folders). Mutation: a refused file replaced by a fresh one.
     - *P6.* S21.
     - *§8.* Item 19: a known folder forgotten, reset or pruned.
   - **M2 (step 2): the 257th folder.**
     - *§2.* An answer `same` that would take `folders.json` past `MAX_KNOWN_FOLDERS` (§7, 256) refuses the open with a new code, `project_known_folders_full` (the identity and the count). §2.2 gains it, and the file is unchanged.
     - *§4.* K-O11 `a_same_answer_past_256_known_folders_is_refused_and_none_is_forgotten`: 256 folders are written by the store's writer, and a 257th folder is answered `same`. The test asserts the code and the file's unchanged bytes. Mutation: the oldest `same` entry dropped to make room.
     - *P6.* S20.
     - *§8.* Item 19.
   - **C1 (step 2): lineage-file bounds.**
     - *§2.* The lineage reader (§2.4 step 6, item D) checks the file's size before it reads, and each line against §9's line bounds (`kernel/src/session_history.rs:43-45` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:3e5b96a45a127a56fc1349f61ef2f5dbe013e6940ede8e75b133b41f8789682b), with a file bound of 33,554,432 bytes. A file over either bound is named in `opened.lineage` as refused over its bound, is not read further, and is never cut back (ADR-036 §8).
     - *§4.* K-L5 `a_lineage_file_over_its_bounds_is_named_and_not_read` (`kernel/tests/project_reopen.rs`). Cases: a file extended by `set_len` to 33,554,433 bytes, and a step line of 262,145 bytes, each beside a hand-built project whose member records a lineage. Mutation: the file-size check removed.
     - *§8.* Item 20: a lineage file read past a bound.
   - **V2 adds nothing.** It adds no refusal, behaviour or test: its shape is W's, carried by K-S1 and K-O1.
   - **The strings.** S19 to S21 are owner placeholders. None is the human's, and each states only the consequence.

6. **OPEN-17 (b), the custodian's answer, in the human's reading (class 5).** The sources are milestone 4's form, Amendment 1 item 4 (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:743` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:7b75b020f2474b84ac43efd2b04aca9dd0da22b79225edffb77f4f4f59ff30a7) and Amendment 5 item 3 (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:1128` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:6d514c8acd952ef80f43ac6de5cc77fe55807f32694ed2111de3f32c10c2fe0f). For step 1, this replaces §2.14's milestone-4 order and its redaction dispatch sentence, and §9's commit-plan order.

   | §2.11 group | Now, or waits for what |
   |---|---|
   | O0's probe | Committed at a88d0186. Its run waits for the human's file (item 2). |
   | ADR text | Now (N2). |
   | renderer | Now (N3). |
   | protocol product | Waits for the version bump (any field change is a new version string, `protocol/skp/SKP-V0.md:299-303` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:b4170741d0929ea5bc56a1866c24c24d4025bf73c3fc8468c940ecbbf0b6a4a4). The bump waits for PR A's merge. |
   | fixtures and protocol tests | Wait, with the bump (P2). |
   | version literal | Waits for PR A. `frontends/shell/src/skp/types.ts` and `client.test.ts` are PR A files, and `frontends/shell/src/admission/admitDataset.test.ts:85` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:5dc98014336bc87bd154166a6d222b3f75a9aa491709ba663f42deb72d2563b2 also holds the literal. |
   | kernel product | Now, except `resolver.rs` and the orchestration (O0) and the `save_project` handler (the bump). |
   | kernel tests | Now: U-L1, U-I1, U-C1, U-R1 to U-R7, U-V1, U-V2, K-S6 and K-S7. The rest wait for O0 (item 2). |
   | src-tauri | Not a PR A path: PR A changes no file there; milestone 4 leaves `src-tauri/**` unedited by every PR (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:401-402` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:805e8783178df32c7250d27702aed9e3b64bfc862618441a7be833b661e36bd9); and OPEN-17 (b) lists it among the groups that proceed (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:727` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:dbd642a5bf364fe50adbc27e28eae04b2cc12eb6d5cbe08e4cb4419ab93af132). It is disjoint by file from #241, which edits `publish.rs` and `tauri.conf.json`. In fact it waits for the bump, because the binding's `save_project` takes the protocol's request type. |
   | shell product and shell tests | Wait for PR A's merge. |
   | e2e | Waits for PR A (`package.json` is shared). |
   | records | `kernel/README.md` waits for #241's merge. The KNOWN-LIMITATIONS item and the walkthrough Part are separate paths, numbered and lettered at R1's base. |

   **The commit order.** Each commit passes `cargo fmt --check`, clippy with `-D warnings`, and `cargo test --locked --features spatial-engine/fixture`. A `pub` item that only tests use at an intermediate commit gets its product caller later in the same PR. Nothing is silenced with `allow(dead_code)`.
   - **Now:**
     - N0: the probe, a88d0186.
     - N1: main merged into the branch at or after this amendment's commit (a merge, never a rebase).
     - N2: Annexes A and B.
     - N3: `renderer/src/canonical.rs` gets `to_line_oriented_string`, its module-doc paragraph, §7's indent unit and separator at the site, and U-L1. The existing items stay byte-identical.
     - N4: `kernel/src/dataset_ref.rs` gets the bind-time bound (U-I1), ruling 9's canonical-form widening (U-C1) and its current Status line. `kernel/src/lib.rs` gets its current Status line.
     - N5: `kernel/src/project/{mod,strict_json,file}.rs`, and `pub mod project` in `lib.rs`: the strict reader, and the writer, which writes through N3, and reader under Annex A's rules. Tests: U-R1 to U-R7, U-V1 and U-V2.
     - N6: in `kernel/src/session_history.rs`, `read_line` goes through the strict reader (OPEN-19), and the file gets its current Status line. 1b's suites pass, and any edit to a 1b test is I3.
     - N7: `kernel/src/project/store.rs`: the identity, the machine store's paths, the atomic replace (temp pattern, `write_all`, `sync_all`, the bounded rename, temp cleanup), and the writer and reader of `folders.json`. Tests: K-S6 and K-S7, against that replace (H6).
   - **After O0's amendment:**
     - O1: `judge` and the orchestration, with K-S1 to K-S5, K-S8 to K-S13 and G3, and the current Status line of `kernel/tests/no_generation_in_persisted_artifacts.rs`.
   - **After PR A merges:**
     - P1: main merged into the branch.
     - P2: the bump, in one commit. It holds:
       - the literal at `protocol/skp/src/v0/mod.rs:115` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:060d4f4517eb8e7d80ae0842026dcbf9a6bd75c9a03df1e01a708cdc3708c8ab;
       - `save_project`'s request, response and step 1 codes (`commands.rs`, `error.rs`, `SKP-V0.md` with its change log and its Status lines);
       - the protocol and conformance fixtures with their tests;
       - every literal site, found again at P1's base: `frontends/shell/src/skp/types.ts:15` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:da542b3bd495edffa6a9ad0417ab26c3c9a5daad7ec7ec77560b1220011e5013, `frontends/shell/src/skp/client.test.ts:29` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:5dc98014336bc87bd154166a6d222b3f75a9aa491709ba663f42deb72d2563b2 (and its lines 59, 86 and 91 at the same commit), and `frontends/shell/src/admission/admitDataset.test.ts:85` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:5dc98014336bc87bd154166a6d222b3f75a9aa491709ba663f42deb72d2563b2 (and its lines 93, 145 and 167).
       Both `cargo test` and `npm run verify` pass on this commit, because the shell's fixture test reads the protocol fixtures (`frontends/shell/src/skp/__tests__/fixtures.test.ts:510-523` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:e1e04d651c96c4535a9a93e20859a689e0709aeda04d9bafa15a8e987dfe7fa3).
     - P3: the kernel's `save_project` handler (after O1 and P2).
     - P4: `frontends/shell/src-tauri/src/{commands,lib}.rs`: `save_project` on `spawn_blocking`, and `binding_pick_project_folder`.
     - P5: the shell product and its tests.
     - P6: the e2e work: `e2e/project.mjs`, the `package.json` script line and its `e2e/README.md` entry, with E-SAVE as item 5 amends it.
   - **After #241 merges:**
     - R1: main merged into the branch, then the records: `kernel/README.md` (its Status lines and the owner's index at that base), the KNOWN-LIMITATIONS items, and the Part, at a letter no piece in flight holds.

7. **Rule (00) at this dispatch (class 1).** It is checked path by path against step 1's §2.11 paths. At most one piece touches `protocol/`, and that piece is step 1.
   - **#241** (24 paths, `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:721-748` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:5146d7174db5596663049c25f29edc95625d4c0ee2355561c87c617fc76cdc2f):
     - shared: `kernel/README.md`, so R1 follows #241's merge;
     - `KNOWN-LIMITATIONS.md`: separate items;
     - `src-tauri`, `renderer/` and `kernel/src/`: disjoint by file;
     - `engine/src/fixture.rs`: 1c only calls it, and a changed `write_geoparquet` at a base is I1.
   - **#242** (`scripts/plan/**`, `.github/workflows/governance-ci.yml`): disjoint. After it merges, Annex A's round + item cites must resolve (item 9).
   - **#243** (`frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md:214-220` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:35ec00a4502d9dc343d8659ccc044b95dc03482a3518222489cb378d0268e75b: `engine/tests/session_identity.rs`, `e2e/regression.mjs`, `admission/crsAssertionState.ts`, `canvas/buildLayers.ts`): disjoint. PR A waits on it.
   - **#244** (`frontends/shell/MANUAL-WALKTHROUGH.md`, Parts F and G): disjoint as separate Parts. Step 1's Part is a new letter.
   - **PR A** (507197c125179e002eb28fe961e44348466ff66e, its 53 files as briefed):
     - shared files: `skp/client.ts`, `skp/types.ts`, `skp/client.test.ts`, `App.tsx`, `console/surfaceRegistry.ts` and `package.json`. Step 1 edits none of them before PR A merges (item 6);
     - separate paths: the e2e README entries, the KNOWN-LIMITATIONS items and the walkthrough Parts;
     - read by step 1 and edited by PR A: `workspace/workspaceState.ts`, `workspace/viewTransitions.ts` and `style/document.ts`, so step 1 re-reads them at P1's base (I1).
   - **`adr-020-appended-note`** (ADR-020 and its form): disjoint. Neither piece changes a Status line.
   - **`record-step-style-match-widening`** (proposed; `protocol/` and `kernel/src/session_history.rs`): it shares both paths with step 1, so it is not dispatched while step 1 is in progress. Its placement is the human's (OPEN-A2).

8. **Corrections (class 3).**
   - **C-1.** §2.10's quoted ADR-022 Amendment 2 carries the second message's provenance clause, which the human's reading (a) replaced. The text that lands is Annex B. Proof: `state/directives/2026-10-21-redaction-amendment-3-open-1-to-7-ruled-adr-022-amendment-2-reading-a.md:10` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:e8bb21c80483ac9b1cd6b1d09a7b1ebcbb74a6c3aa57b81e96a5af794cb7922b.
   - **C-2.** §9's architect bullet checks ADR-022 Amendment 2 "against the human's two lines", but the text rests on three. It is checked against the three lines item 4 names. Proof: item 4's span list.
   - **C-3.** §2.10 and §2.14 call the block's PR in progress. It merged at e8f110bb. Proof: `kernel/ADR-036-PRE-ACCEPTANCE-BLOCK-PREREGISTRATION.md:561` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:56411ebe69bc4ce3a977752b310f9d3e6e84a190ab4f0f77e365fb78bceca0e9.
   - **C-4.** §2.14 calls the redaction scan "in progress, stopped at O0", with its paths at its form's ad921f55 pin. It is PR #241, awaiting R2 and the click, and its paths are its Amendment 3 item 10. Proof: `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md:721-748` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:5146d7174db5596663049c25f29edc95625d4c0ee2355561c87c617fc76cdc2f, and the ledger's continuity block at e6dfe624, its in-flight line (round 14 (a′): no ledger passage is pinned).
   - **C-5.** §2.14 calls the governance lane's piece a draft, "ready", and milestone 4 "blocked", with its form "not committed" and four shared files. The first is PR #242. The second is committed, and its §2.9 names six shared files, with PR A at 507197c1 waiting for #243. Proof: the ledger's entry of 2026-10-22T13:31Z, `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:461-465` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:8a7223178b6974bd879709ff5bc03bc2e6799fdf87ff2a4a749993a04cff3405, `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:1129` @ e6dfe624819a838c7f6a7ce63229b3d66912a6a0 sha256:9d71dd58bb22f51e226e5c4905979de923eab3f6aeba1c70f01d422fc5a2021a.

9. **Round + item cites in Annexes A and B.** These are `round 69, item 4` (Annex A item 1) and `round 69, item 1` (Annex A item 2). Both resolve in the RULED block "question round 69" (RULED 2026-10-08) of the tracked archive `state/cut-archive/DECISIONS-PENDING-2026-10-20.md`. The added sentences and Annex B carry none. This amendment itself cites round 15 (a) and round 15 (e), which resolve in the same archive.

10. **Before commit (round 15 (a)).** The custodian rebuilds Annexes A and B by script from the sources that items 3 and 4 name, and compares each with the text below. The custodian then resolves each clause of this heading against items 1 to 9, and STOPS on a mismatch.

**Superseded index:**
- the header's O0 condition, §2.13's step 1 row, §3's last two O0 bullets and I4's O0 clause: by item 2;
- §2.10's ADR-022 quote: by item 4 and C-1;
- §2.10's other-order paragraph: by item 1 (it does not apply);
- §2.10's and §2.14's "in progress" for the block: by C-3;
- §2.14's redaction bullet: by C-4 and item 6;
- §2.14's governance and milestone 4 bullets: by C-5 and item 6;
- §9's commit-plan order for step 1: by item 6;
- §9's ADR-022 bullet: by C-2;
- §2.2's code list, §2.12's strings, §3's F5, §4's step 1 and step 2 tables, E-SAVE and §8: added to by item 5.

### Annex A — ADR-036's appended amendment, as it lands in step 1's commit N2 (rebuilt by script from the sources item 3 names, equal to the architect's)

````markdown
## Amendment 1 — piece 1c: the `workspace` member, which save a lineage file is from, the machine store, a steps file's locators, the session record after the first save, and the reader's ceilings (b2-piece-1c-save-and-reopen, <DATE>)

Appended after acceptance, from piece 1c's form (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, §2.10), landing no later than its writer (§11). The words are the architect's, approved by the human.

1. **The project file's `workspace` member** (§11; piece 1c's OPEN-10, OPEN-11 and OPEN-12). It is `{"filter":…,"clauses":[…],"style":…,"view":…}`, with these four members in this order:
   - `filter`: the filter applied when the project was saved, in `filter.apply`'s form (§6), `{"predicate":<text>,"dialect":"duckdb-expr/0"}`, or `null` where none was applied.
   - `clauses`: the filter clauses in their order, each `{"text":<text>,"enabled":<true|false>}`. A text is kept byte for byte as typed. A clause carries no id. `filter` is what the enabled clauses combine to: `null` when none is enabled; the one enabled clause's text, byte for byte; otherwise each enabled clause's text inside one pair of brackets, joined by ` AND `, in list order. A reader refuses a `workspace` whose `filter` differs.
   - `style`: an ADR-017 §5a style document, whatever the dataset's geometry, with its members in the order of §5a's canonical form (ADR-022 Amendment 2). A reader refuses a document the renderer refuses.
   - `view`: the map view, `{"crs":…,"centre":[<x>,<y>],"zoom":<z>}`. `crs` names the space of the dataset the view was saved over, in `dependencies.crs`'s form (§6). `centre` is the point at the middle of the canvas, x then y, in that space's coordinates. `zoom` is the base-2 logarithm of the number of logical (CSS) pixels that one unit of those coordinates spans on the canvas. A reopen applies `view` only when its `crs` equals, member for member, the space the dataset is admitted in at the reopen; otherwise the view is not applied, and the reader says so.
   - **How `view`'s numbers are written.** Each of the three is a string of 16 lowercase hex digits, the big-endian IEEE-754 bit pattern of the value: the form SKP gives a bit-critical scalar (`HexF64`, `protocol/skp/SKP-V0.md` §3; ADR-004's amendments of 2026-08-03). A reader refuses any other spelling, and a pattern that is not a finite value. §2's number grammar cannot write a value with 0 < |v| < 1e-6 or |v| ≥ 1e15; written this way, every finite value, these included, is kept exactly as held: nothing is rounded, and no save is refused for it.
   - **The analysis settings** are reserved by name. Version 1's `workspace` has no member for them; adding one changes the shape and comes with a `version` step (§3).
   - **A selection made by clicking is not saved:** `workspace` has no member for it (round 69, item 4; §11 reserves a selection scope by name).
   - As §11 states, this amendment completes version 1 and is not a version step.

2. **Which save a project file and a lineage file are from** (§8; the human's ruling 4 of 2026-10-09 and its note for piece 1c's form; round 69, item 1). Where the project file's `lineage` member records a lineage, a reader compares the folder's lineage file with the member, in this order:
   1. If the lineage file's header line and its first `steps` step and withheld lines, each with its LF, have the member's `sha256`, those lines are the project's lineage. If lines follow them, the reader reads none of those lines as the project's, and says that the lineage file holds lines after the save the project file records.
   2. Otherwise, if the previous lineage file kept for the project on this machine (item 3) has the member's `sha256` and `steps`, it is the project's lineage, and the reader says that the folder's lineage file is not the one the project file records.
   3. Otherwise, the reader reads no lineage file as the project's lineage, and names the project file and the lineage file as from different saves, or names the lineage file as missing.

   Where the member is the state `not-kept` and the folder holds a lineage file, the reader does not read it, and names it as from a different save. A writer that replaces a lineage file first keeps a copy of the file it replaces, as `previous-lineage.jsonl` in the project's machine folder (item 3), until the project file that records the new one is written, so that §1's rule that nothing else in the folder belongs to the format still holds.

3. **The machine store for a saved project** (§1, §4, §9). Under the per-user data directory that holds §9's sessions, a saved project has a folder `spatial-ide/projects/<record>/`, where `<record>` is the project identity's 32 hex characters. It holds:
   - `locations.json`, in §9's `spatial-locations` format: where this machine found each dataset the project names;
   - `folders.json`: the project folders this machine has opened the identity from, by absolute path, and the answer to §4's question for each;
   - `open.lock`, held under an exclusive lock while the project is open, so that a second open of the same identity, in this process or another, is refused by name. The lock must be one that the operating system releases when the process holding it ends, so that a crash never leaves the project locked;
   - `previous-lineage.jsonl`, only while item 2's writer keeps it.

   None of these is ever in a project folder, nothing in them is copied into a project file or a steps file (§2), and the end of a session clears none of them. Two files this ADR defines hold an absolute path: `locations.json`, wherever it is kept, and `folders.json`. This widens §9's sentence that `locations.json` is the only one. `folders.json` is one canonical JSON document, `{"format":"spatial-folders","version":1,"first":<absolute path>,"same":[<absolute path>…]}`: the folder §4 calls the first folder, and each folder for which the answer was the same project. An open whose answer is the same project, and which would make `folders.json` hold more than 256 folders, is refused by name, and no folder is forgotten to make room.

4. **The locators a steps file's header carries** (§5, §6). In a lineage file's header, each dataset entry carries the locators that the project file's entry for the same dataset carries, under §5's rule for a project file. In a session history's header, each dataset entry carries the `machine-recorded` locator only. Like §5's rule, this binds the writer.

5. **A session history's record after the first save** (§9; piece 1c's OPEN-18). At a project's first save, the session's history moves to the project's record: `<record>` becomes the project identity's 32 hex characters, and the header's `project` is the project's URI, which §6's header already admits. The kept lines are carried over under that header, and the `unsaved-` record is then removed. Where an `unsaved-` record's first step is also in a project's record, as after a crash between the two, recovery offers the project's record only.

6. **The reader's ceilings, by number** (§2, bounded readers). A reader refuses, by name and without truncating:
   - a project file over 1,048,576 bytes;
   - a dataset entry with more than 8 locators;
   - a string over 4,096 bytes, in a project file or in a dataset entry, except a CRS assertion's `definition_json`, which is bounded at 65,536 bytes, the engine's own bound on a CRS definition;
   - a `project-relative` `at` of more than 64 segments;
   - a `folders.json` that holds more than 256 folders.

   An array in a project file has no ceiling of its own: the file's size bounds it. §9's bounds on a session history stand. §9's line bounds apply to every steps file, and a lineage file is at most 33,554,432 bytes.
````

### Annex B — ADR-022 Amendment 2, as it lands in the same commit (rebuilt by script from the three lines item 4 names, equal to the architect's)

````markdown
## Amendment 2 — style persistence granted for the project file (2026-10-22, the human)
Amendment 2 (b2-piece-1c-save-and-reopen): from piece 1c, the §5a style document is persisted in the project file, in the workspace member ADR-036 defines. The save is ADR-006 class 2 and atomic. docs/11's obligations are met by the project URI, ADR-036 for the schema, and save and reopen for the lifecycle. Provenance does not yet travel with the project file. The lineage member stays a named state until a later piece writes it; the saved-here mark says only that the saved style is the one the session's recorded steps reach, and those steps are kept in the session history on this machine while it lasts. Consequence (a) stands, and the lineage is not granted by this amendment.
````

Nothing above is edited.

## Amendment 2 — step 1's commits N1 to N7 built (class 1); the kernel product group over its ceiling (class 8); five moved pins (class 3); written after the result was seen

*Written by the custodian. References only: `state/consults/2026-10-23-b2-piece-1c-save-and-reopen-step-1-n1-to-n7-worker-report.md`.*

1. **Built:** N1 36708c1377488ae3f0a7a01203baada6e425e056 (main merged at 43a39222ebe6fbe1352c2268ef54521921028b66) to N7 7109aeb2431d9ca9379cb15b0d027dba78a20217, on `cut/b2-piece-1c-save-and-reopen`, each pushed; nothing past N7. Each new test's mutation was observed failing alone at 7109aeb2, fifteen in all, among them the one test item 5 names. The custodian checked by script that each ADR file at N2 is the file at N1, one LF and its annex (Amendment 1's Annexes A and B), Annex A dated 2026-10-22, N2's UTC commit date.
2. **Class 8:** by §2.11's command over `43a39222...7109aeb2`, the kernel product group counts 2,099 lines against 1,350; 534 of them are inline `mod tests` in its product files, which count there by path. §7 is not edited. The other groups hold: the probe 144 of 150, ADR text 45 of 80, the renderer 123 of 200, kernel tests 145 of 1,000.
3. **Class 3:** five ADR-036 lines that §0.3 and §2.10 pin at ad921f55 are at new lines at N1, their facts unchanged: 27 at 28, 42 at 64, 101 at 125, 128 at 152, 182 at 207.
4. **Read (class 1):** Amendment 1 item 6's clippy check with `-D warnings` exits 101 at every commit on main's own code under rustc 1.97.1 (`renderer/src/canonical.rs`'s `write_double`, which N3 keeps byte-identical, `renderer/src/style.rs` and `engine/src`); no CI workflow runs clippy. Without `-D` it exits 0 at N3 to N7 with the same 45 warnings at each, none in the added code. The gates read that run.
5. **Disclosed for the gates:** one test §4 does not name, in `kernel/src/session_history.rs`, covering N6's order and spelling refusals, with its mutation; values declared at their sites that §7 does not list (the project reader's depth and string bound, `folders.json`'s reader's size and depth, the rename pause, the session-history line reader's depth and string bound); `MAX_KNOWN_FOLDERS` counting `first` among its 256; the first N3 test run void (a scratch copy built in the same target directory) and re-run.
6. **Next:** O1 (the resolver, `judge` and the save orchestration) after O0's amendment on Monday 2026-10-26; P1 to P6 after PR A merges; R1 after #241 merges. Step 1's PR opens after them.

Nothing above is edited.

## Amendment 3 — OPEN-17 (b) for milestone 4's PR C, written before PR C's code: which step 1 commits proceed beside PR C and which wait for its merge (class 1); steps 2 and 3 unchanged; rule (00) at this amendment (class 1)

*Written by the custodian. The words are the architect's (`state/consults/2026-10-23-b1-shell-half-pr-c-dispatch-amendment-architect-draft.md`, item 2), drafted read-only at main 858092e340ac650822afea87b50b3ce00e50bd40. References only, and nothing below is a quotation. Self-references are by section and item. The sources are milestone 4's form (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`): OPEN-17's option (b) and its recommendation, its Amendment 1 item 4, its Amendment 5 item 3, and its Amendment 7. "PR C's files" means milestone 4's §2.6 PR C list with its Amendment 7 item 3's additions. "Beside PR C" means from PR C's dispatch until its merge.*

1. **Why.** Amendment 1 item 6 replaced §2.14's milestone-4 order for step 1, and it orders step 1 against PR A only. Now that PR A has merged, nothing in this form keeps step 1's shell work off PR C's files. For the time beside PR C, this amendment governs step 1, and item 6 holds for everything else.

2. **Step 1 beside PR C:**

   | Step 1 work (Amendment 1 item 6) | Beside PR C |
   |---|---|
   | N0 to N7 | Built (Amendment 2 item 1). No PR C file. |
   | O1, after O0's amendment | Proceeds: kernel only. |
   | P1, main merged | Proceeds. |
   | P2, the bump | Proceeds. Its literal sites are `frontends/shell/src/skp/types.ts`, `frontends/shell/src/skp/client.test.ts` and `frontends/shell/src/admission/admitDataset.test.ts` (milestone 4's PR C re-sweep, step 5), and none of them is a PR C file. The version named in the comment at `frontends/shell/src/console/surfaceRegistry.ts:78` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:36741303019b9f49f7d2b9ba9e6d388b75020faacf237b4a8372b40f5d1175e4 states when `record_step` was added. It is not a literal site, and P2 leaves it as it is. |
   | P3, the kernel's handler | Proceeds: `kernel/src` only. |
   | P4, `src-tauri` | Waits for PR C's merge. It is disjoint by file, but the shell's completeness test requires a class-B row in `console/surfaceRegistry.ts`, a PR C file, for every `binding_*` handler in `lib.rs` (`frontends/shell/src/console/surfaceCompleteness.test.ts:250-253` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:2dcd782b6bc77ebc84035854324b3a3e498a83b5d7b44c64e2f693158ecbbed1). So `binding_pick_project_folder` cannot land green without it. |
   | P5, the shell product and its tests | Waits for PR C's merge. `App.tsx` and `console/surfaceRegistry.ts` are PR C files. A seventh `call(...)` in `skp/client.ts` must change the registry's class-A rows with it (`frontends/shell/src/console/surfaceRegistry.ts:76-78` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:47274c8074797ae2a5c3d02a573b6bb34ef31e1bcdb84d3a48ccd8d507a0690b; `frontends/shell/src/console/surfaceCompleteness.test.ts:209` @ 858092e340ac650822afea87b50b3ce00e50bd40 sha256:4f77567ad30fbbf6b3dc0e8a553cf306d056c79b43049d6ab6c3345f4c9df5a2). |
   | P6, the e2e work | Waits for PR C's merge. `package.json` is a PR C file. The `e2e/README.md` entry is a separate path. |
   | R1, after #241 merges | Proceeds: `kernel/README.md`; the KNOWN-LIMITATIONS items 48 to 50, which are separate paths; and the Part, at a letter no piece in flight holds, so not AC. |

3. **Files step 1 does not edit beside PR C: any of PR C's files.**
   - That includes `workspace/viewTransitions.ts`, which §2.14 lets step 1 edit only under I1.
   - The shell-tests group names no file. A new test file is disjoint, but an edit to any of PR C's test or fill files is not.
   - A need for any of PR C's files beside PR C is I1 for step 1: stop and report.

4. **After PR C merges.**
   - Main is merged into step 1's branch, by a merge, never a rebase.
   - Then P4 to P6 are written against `App.tsx`, `console/surfaceRegistry.ts`, `package.json` and `workspace/viewTransitions.ts` as PR C left them (the seam rule; §2.14's last order bullet).
   - Every literal site is found again at that merge's base, PR C's new files included. A site PR C added is bumped inside the version-literal group (≤ 30 files). An overrun is class 8.

5. **Steps 2 and 3.** §2.14's order sentence, that no 1c step dispatches while a milestone 4 PR is in progress or awaiting merge, stands for them. Amendment 1 item 6 replaced it for step 1 only. Neither step is in flight beside PR C.

6. **Milestone 4's PR B.** This amendment orders nothing against PR B. That order is the human's, and it is recorded before PR B's dispatch.

7. **Rule (00) at this amendment (class 1).**
   - Step 1's branch, at 7109aeb2431d9ca9379cb15b0d027dba78a20217, names no path under `frontends/` in its diff from 43a39222 (milestone 4's PR C re-sweep, step 5).
   - Step 1 is the one piece on `protocol/`, and PR C touches none.

Nothing above is edited.

## Amendment 4 — 8e before P2 and ADR-022's note with step 1's PR, the human's ruling of 2026-11-06 (11:10Z) (class 5)

- **P2 waits for `skp-filter-dialect-unsupported-ruling`'s merge** (that form's OPEN-4 (A), the human's, `state/directives/2026-11-06-8e-open-1-words-open-4-a-e2e-readme-c9-c14-c19-heading-open-6-a-filler-order-docs-02-adr-022-kl-178.md`), an exception to this form's reservation of `protocol/` for step 1; skp/0.12 stands until then. At 2869813b step 1's branch has no path under `protocol/`.
- **ADR-022's note** in the human's words (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`, item 3) lands with step 1's PR, appended after ADR-022's Amendment 2 at the file's end in the pattern of ADR-026's Note 2026-11-05; `adr-notes-stale-statements-and-indices` is done with that merge.

Nothing above is edited.

## Amendment 5 — O0 ran, and H1 is observed as far as the probe observes it (class 1); the resolver, `judge`, the save orchestration and their tests proceed, and step 1 takes slot 1, by the human's ruling of 2026-11-10 (16:40Z) (class 5)

*Written by the custodian after O0's result was seen, before any resolver code: the amendment of its own that Amendment 1 item 2 names. References only: O0's run record `state/consults/2026-11-10-b2-piece-1c-save-and-reopen-o0-custodian-run.md` and the human's message `state/directives/2026-11-10-o0-run-now-1c-step-1-slot-1-then-pr-b-306-clicked-pan-anchor-open-1-a-diagnostic-node-closing-message-leads-with-slots.md`, cited by item.*

1. **O0 ran (class 1).** The custodian ran the probe, `spikes/b2-1c-onedrive-probe/` at a88d01863f65eb1290f762f8a3f03db4b9e43a0c on `cut/b2-piece-1c-save-and-reopen` (named by its commit, with no hash pinned there), on the human's online-only file, inside a shared hold, on 2026-11-10, with exit 0. The file was checked to be a placeholder before it was opened. The probe's output, the file's size and sha256 and the attributes read outside the probe are in the run's record.
2. **H1 (class 1).** Observed by the probe: the placeholder is reported as not a symlink and as a regular file; `symlink_metadata` and the walk leave it online-only; an open by path downloads it and the read completes; a junction is reported as a link. Not observed by the probe: that the placeholder is a reparse point, and its tag; in the probe's process the reparse-point and offline bits were not shown, and the custodian's reads outside the probe showed the reparse-point bit. By item 1 of the human's message, H1 passes: it is observed as far as the probe observes it, and that is how this form's H1 reads from this amendment on.
3. **H5 (class 1).** The probe observes only that the open and the read completed. The liveness line and Cancel during a download stay for OP1 to OP3 at the sitting (item 1).
4. **What proceeds (class 5).** By item 1, what Amendment 1 item 2 lists as waiting for O0 (H1) proceeds now for step 1: `judge` (§2.5), the save orchestration in `kernel/src/project/mod.rs` with everything item 2 lists for it, and the tests K-S1 to K-S5, K-S8 to K-S13 and G3. That is O1 of Amendment 1 item 6. `check_inside` at reopen stays step 2's. P1 to P6 and R1 keep their orders (Amendments 1, 3 and 4).
5. **Placement (class 5).** By item 2, step 1 takes slot 1 now, and milestone 4's PR B follows it in slot 1; port-2 follows step 1's merge, as ruled.
6. **The O0 file after the run.** It is downloaded and no longer online-only; OP1 to OP3 at the sitting need an online-only file again.

Nothing above is edited.

## Amendment 6 — O1 built (class 1); the kernel product group further over its ceiling (class 8); O1's departures and additions disclosed for the gates (class 1); what waits for Amendment 7 (class 1); written after the result was seen

*Written by the custodian. References only: `state/consults/2026-11-10-b2-piece-1c-save-and-reopen-o1-worker-report.md`, which holds the worker's first-attempt report and its final report.*

1. **Built.** O1 is at e36e951167fcad90e8ee07f1a4bfd3be12cd0e56 and 4761ded8df7fd3206cec84b21ceaec4fc8ce9338 on `cut/b2-piece-1c-save-and-reopen`, on N7 (7109aeb2431d9ca9379cb15b0d027dba78a20217) with no merge, and pushed; nothing past O1. It holds the tests K-S1 to K-S5, K-S8 to K-S13 and G3, and two tests §4 does not name. Each test's mutation was observed failing alone at 4761ded8, fourteen in all. The custodian recounted from the worker's logs: 979 passed, 0 failed and 57 ignored at e36e9511; 993, 0 and 57 at 4761ded8.
2. **Class 8.** By §2.11's command over `43a39222...4761ded8`, the kernel product group counts 2,758 lines against 1,350 (Amendment 2 item 2 counted 2,099 at N7). The kernel tests group counts 983 of 1,000. §7 is not edited.
3. **Departures, for the gates (class 1).**
   - The first-save move locks the new record before its rename, where §2.3 orders it written, synced, renamed, then locked. K-S9 passed with the lock first on this machine.
   - The mutations for K-S4, K-S5, K-S8 and G3 are not §4's words; the report gives each with its reason.
4. **Disclosed for the gates.** The items the report lists as not named in this form, in `kernel/src/dataset_ref.rs`, `kernel/src/session_history.rs`, `kernel/src/project/mod.rs` and `kernel/src/project/resolver.rs`; the behaviours §2.3 does not state, which the report lists; the two unnamed tests; the `pub` items whose product caller is P3's handler.
5. **What waits for Amendment 7 (class 1).**
   - A first save whose request carries no `folder` is refused by the kernel at e36e9511, and §2.2's code list has no code for it.
   - The human's ruling of 2026-10-23 (`state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`: OPEN-A2 (b) under piece 1c, the same ruling as milestone 4's OPEN-18 (b)) places the `record_step` widening in step 1, by class 9 to this form. No amendment recorded it, and N1 to O1 were built without it.
   - Amendment 7 declares both before P2. P1 proceeds now.
6. **Next.** P1 now. Then P2 and P3 after Amendment 7, then P4 to P6 and R1. Their other waits are met: PR A merged as #246 and PR C as #253 (Amendment 3), 8e as #290 (Amendment 4), and #241 on 2026-10-26.

Nothing above is edited.

## Amendment 7 — written after O1's result was seen, before P2's code: a code for a first save with no folder (class 9); the `record_step` widening, placed by the human's ruling of 2026-10-23 and declared before any of its code (class 9); its commit place, for the human (OPEN-7-1, a red line); the superseded index

*Drafted by the architect, read only, at main e57d75e191ea35fe44c3a26887d73b82f4b53262. References only. Self-references are by section, amendment and item. Branch code is named by path, item and commit, with no line and no hash (round 15 (e)). The reuse index's two phrase queries missed, in the custodian's runs at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-10. The misses are noted and do not block. Every new test's mutation is observed under §4's rule. §7 is not edited, and an overrun is class 8.*

1. **A first save with no folder (class 9; Amendment 6 item 5, first bullet).**
   - *The behaviour, as built.* `Projects::save` in `kernel/src/project/mod.rs` at e36e951167fcad90e8ee07f1a4bfd3be12cd0e56 refuses a save whose open has no project in this process and whose `folder` is `None`, as `SaveFailure::FolderRequired`, before any file is read or written (`state/consults/2026-11-10-b2-piece-1c-save-and-reopen-o1-worker-report.md:130` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:319b1c431a60f16cfd6f9521d7d65b9d6f91528de553d90eb7bbd1c05228fc7e).
   - *§2.2.* The new codes list gains `skp.project_folder_not_given`, with no fields. It states a kernel fact: the request's `folder` is `null`, and no save of this open has chosen a folder.
   - *Where it lands.*
     - P2: the constructor in `protocol/skp/src/v0/error.rs`. The row in the refusal table of `save_project`'s new SKP-V0 section is: code `skp.project_folder_not_given`; fields none; when the request's `folder` is `null` and no save of this open has chosen a folder. The skp version entry's field set counts it.
     - P3: the handler maps `FolderRequired` to it, in one exhaustive `match` with no wildcard arm. This follows SKP-V0's mapping rule (`protocol/skp/SKP-V0.md:359` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:8e4ae7e1c2afc053d31af4bca948c7f8b482a4aaff865b565e2c83a250ecdadc).
   - *§2.12.* Its kernel message is one of §2.12's kernel messages and a P6 placeholder: `no folder was given, and this open of the dataset has no project to save to`. It replaces the `Display` arm of `FolderRequired` at P3. That arm states that the dataset has not been saved, which the kernel does not know: `Projects` keys its saves by the catalog name of this open.
   - *The shell.* It has no owner string for this code. At a first save the shell sends `folder` from the picker (§2.2), and §4's first step 1 shell test asserts that it does. A refusal that arrives anyway is shown as S4 with the kernel's `{message}` (§4's third step 1 shell test). S4 and the message are P6 placeholders, a red line (§2.12). Whether ordinary use of the shipped shell can reach this code is for P5's gate to show.
   - *§4, step 1.* The test is `a_first_save_without_a_folder_is_refused_and_writes_nothing` (`kernel/tests/project_save.rs` at 4761ded8df7fd3206cec84b21ceaec4fc8ce9338), with its mutation as observed: the folder defaults to the data's own folder, and the test fails at that commit (`state/consults/2026-11-10-b2-piece-1c-save-and-reopen-o1-worker-report.md:110` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:ea978836230933cfe69983cd9568da16db55950b369f7a01110df72642e9e653; the procedure at `state/consults/2026-11-10-b2-piece-1c-save-and-reopen-o1-worker-report.md:97` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:13e18c19d85da9935c21071d2192353db1ae62a7b43fd5db5398905136f5156b). The test proves the kernel's refusal. P2's error fixture proves the code's spelling. No test named in §4 asserts the P3 mapping.
   - *§8 item 12, second clause, for the gates.* The refusal, its variant and its test landed at e36e9511 and 4761ded8, before this amendment.

2. **The `record_step` widening (class 9).** It is placed in step 1, by class 9 to this form, by the human's ruling of 2026-10-23: the Milestone 4 line, OPEN-18 (b), and the Piece 1c line, OPEN-A2 (b) (`state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:18` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:7604c2433b2df11d804dc904439dec44a5c16d5e8e39913410ffe253762a0f45; `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md:20` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:61b89605bdee3fdbe56961adda906f209282e7abdb7575748306c3fd2d5403f2). The option texts are `state/consults/2026-10-22-b1-shell-half-pr-c-and-pr-b-ahead-architect-draft.md:228` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:5daee8b7ba186ea202333c6a539bdbc44ac2a371edb009b774fc524cf26ba28b and `state/consults/2026-10-22-b2-piece-1c-save-and-reopen-amendment-1-architect-draft.md:313` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:67015f9a4b73027bde722191c286f9ff6680006707b62a38db5d3d8ff1e2cecb. The node's option is (A′), at `state/consults/2026-10-21-b1-shell-half-milestone-4-architect-draft.md:631` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:22788dca68e22dab169c2997ec84b157b3406feb50f6333ba410c75d049fdadc. No code of it has landed.
   - **(a) What `record_step` admits.** This is ADR-036 §6 row 2 and the sentence below it, as accepted (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:175` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:323cc8b75aed898d6e96f4684421e94b4d506d77ba6f0e4069e4231d62293271; `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:177` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:a73580f5dbc536d095028cae3529608708b2cc709ab11b7cf7c05c94dbe58f50). No ADR text changes. The action stays `style.set`, and `actions` stays 2.
     - *The wire.* For `fillColor` only, `value` is `#rrggbb` text or §5a's match, `{match:{column, cases:[{when, then}…], on_null, on_unmatched}}`. It is closed, with `deny_unknown_fields`. `StyleSetParams::FillColor`'s value type widens. The other three properties are unchanged (`protocol/skp/src/v0/commands.rs:551-564` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:85b93b975f6854f4136507c27af73c65e083c2b95556a1b0f8b3c1934d40552a). SKP-V0 §10.2's `fillColor` line (`protocol/skp/SKP-V0.md:1262` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:7f6c8d10587dfed437a55975b9acfd102ecd91eb803cceed4fd9ea69ab3991be) and §10.3's check (6) (`protocol/skp/SKP-V0.md:1272` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:eacacd13b277ec89094efa3c19dae129bbb18c40e0c1d250d3d3be323835264f) are updated in place. The version is P2's, because any field change is a new version string (`protocol/skp/SKP-V0.md:305-306` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:cfd868052f8626a1cefad41a65b1878172fbfbc1c978a438c1163025b5306c20). The shell's step value type is not widened here. Milestone 4's PR B adds it under its §2.3 (h)'s second case (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:266` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:b8324739813675a65ad88d22a69251baaf699c79844e86be2026916c7b946c28).
     - *The kernel's check, at §10.3's (6), so a refusal writes nothing.*
       - The match is parsed by `style::parse`, as `style_params` parses a literal today (`kernel/src/session_history.rs:377-413` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:4763b20c9471a37538037c14543259ea32054c0cb8026be071859d03206a869c).
       - Then it is compiled by `spatial_renderer::compile` against the open's `file_schema()` names and Arrow types, with the match column alone as `published`, so that call's publish check passes by construction (`renderer/src/compiled.rs:166-188` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:f2f1d995c4ce7285b9b7b79ec63c1696fdf2c6d73f280ec9b9482395b9adcb04; the text-only key rule at `renderer/src/compiled.rs:231-239` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:574559bdf6a593abce5a4d22a5140c6d252cbbcba2631e66f7c8342828460d9e).
       - Every colour in the match must be lowercase.
       - The match must have a canonical spelling through `spatial_renderer::canonical`.
       - No type rule is written in the kernel.
     - *Its dependencies.* `dependencies.fields` is exactly one entry: the match column, with its type as the open's file schema spells it, through `dependencies_json`'s `referenced` (`kernel/src/session_history.rs:416` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:a8fa6d29babb95c49da6bd4367df56c3e3a24cae06351161bedc7d6d8d948ba4). Today `prepare` returns no columns for `style.set` (`kernel/src/session_history.rs:348` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:070aed58d1bbc93d861297d632f7c2adaf7a974d83e01717e4d81f5579072235). A literal `style.set` still names none. `crs` and `geometry_types` are as for every step.
     - *The reader.* The registry's `fillColor` value becomes a colour or the match shape. Its strings are bounded as every text is, and its cases at 64. No other property admits the match (`kernel/src/session_history.rs:557` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:751cbdcc8ca87d49187aa7e6e793452a12adb2a59de646732fb9f3de9a5c5787). The line format, the lock and `recover` are unchanged.
     - *Refused, by name, with no new code.*
       - A match on `fillOpacity`, `outlineColor` or `outlineWidth`, an unknown key, or a missing `on_null` or `on_unmatched` is refused at deserialize, as §10.2's other shapes are.
       - A column the open's file lacks, a column whose type §5a's match does not admit, zero or more than 64 cases (`renderer/src/style.rs:56` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:2deb86604289de1d061c4776d3f92368f2a5f6ceb9abdb7f7f57c4e129733baf), a duplicate `when`, or an uppercase colour gets `skp.style_value_not_admitted` (`property` `fillColor`, `detail` the renderer's or the kernel's rule). §10.4's row gains these cases (`protocol/skp/SKP-V0.md:1291` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:d1e8ea8a1fa5cb842667233450f07a78b1ad81f495851c3673a5fb74dbfadef1).
       - A line over its ceiling gets `skp.step_line_over_ceiling`, and a member past a bound the reader holds gets `skp.session_history_unwritable`, as today.
     - *O1's comparison (OPEN-9 (A)).* `Reached`'s fill colour holds the last value a step set, a literal or the match, as the renderer's `Value<Rgb>`. A literal after a match replaces it, and a match after a literal replaces the literal. `differs` in `kernel/src/project/mod.rs` at 4761ded8df7fd3206cec84b21ceaec4fc8ce9338 compares it with the workspace's `style.fill_color` by that type's own equality, member for member, with the cases in order (`renderer/src/style.rs:113-128` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:fc7bc3a17b1cc6418c3f5112751f8422172aebba654cd701d053aeaec92de5a2). No kernel-written bytes are compared. These stay unchanged: the filter is always compared; a style property is compared only if a step set it; and the withheld member is named `style`.
     - *Round 8.* The widened path has no product caller until milestone 4's PR B. The human pre-committed it (the ruling above). Its consumer is named: PR B's step recorder (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:264` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:6dcaf9e89d388ecebaf9c1941f0e1f293a471d99063a9bffbdc38f23a9e45598). Its consumer is gated: PR B's merge waits for it on main (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:265` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:0e67db33b7bb07ab8d679ad6d705fb6cdf886032f9b50a28b0cd229ed5aca4dd), and PB-R2 checks it (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:524` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:feddd958a466274f6696e2b5156bdb2f638b32735b86f29209bb7940ff29670b). Step 1's PR body and the PLAN node name that consumer and its gate.
   - **(b) Tests, §4 step 1.**

     | Test | Mutation |
     |---|---|
     | W-P1 `record_step_admits_a_match_on_fill_color_only` (`protocol/skp/src/v0/commands.rs`, `mod tests`) | the match admitted on all four properties |
     | W-F1 `the_record_step_fill_match_fixture_decodes_and_re_encodes_byte_for_byte` (`protocol/skp/tests/fixtures.rs`; new `protocol/skp/tests/data/v0-record_step-request-style-set-fill-match.json`) | `on_unmatched` serialized under another name |
     | U-W1 `the_history_reader_admits_a_fill_color_match_and_refuses_one_on_another_property` (`kernel/src/session_history.rs`, `mod tests`) | the reader's registry admits the match on every `style.set` property |
     | K-W1 `a_recorded_fill_color_match_names_its_column_and_type_and_recover_chains` (new `kernel/tests/record_step_match.rs`; a real `open_dataset` of a file with a text column, and the request decoded from W-F1's fixture with the open's handle) | the match column left out of `dependencies.fields` |
     | K-W2 `a_match_the_style_model_refuses_against_the_open_is_refused_by_name_and_writes_nothing` (same file; cases: a column the file lacks, a non-text column, 65 cases, a duplicate `when`, an uppercase colour; the code and the history's unchanged bytes) | the match checked by `style::parse` alone, never compiled against the open's schema |
     | K-W3 `a_save_after_a_recorded_match_marks_only_a_workspace_holding_that_match` (`kernel/tests/project_save.rs`; the same match gives `Written`, one case's colour changed gives `Withheld(WorkspaceDiffers("style"))`, and a literal after the match with that literal held gives `Written`) | `Reached` does not note a match |

     - *§2.11 groups.* W-P1 and the SKP-V0 text count in protocol product. W-F1 and its fixture count in fixtures and protocol tests. U-W1 and the edits to `session_history.rs` and `project/mod.rs` count in kernel product, which is already over its ceiling (Amendment 6 item 2). K-W1 to K-W3 count in kernel tests, whose file list gains `kernel/tests/record_step_match.rs`. That group stands at 983 of 1,000, so an overrun is predicted; it is recorded as class 8 when counted, and nothing is trimmed. No shell, src-tauri or e2e file is edited. A `record_step` binding that needs an edit is I1.
     - *§9, the seams.* ADR-036 row 2's shape → `record_step` → the file → `recover` is K-W1. The kernel → `spatial_renderer::compile` is K-W2. The shell → `record_step` with the match is PR B's (PB-R2).
     - *§8.* Item 21: a match recorded on a property other than `fillColor`; a match step whose `dependencies.fields` is not its column alone; or a match column type rule written outside the renderer.
     - *Rule (00).* Step 1 is the one piece on `protocol/`. Of the in-flight branches, only port-2 touches `kernel/`, and its four paths are disjoint from these. `session_history.rs` reads `data_dir` from `kernel/src/permission/audit/log.rs`, a port-2 path, so a changed `data_dir` at P1's base is I1.
   - **(c) Commit place.** It is carried by P2's version bump, in P2's one commit, under OPEN-7-1 (a). P2 then also holds the kernel side, because `StyleSetParams`' exhaustive matches in `session_history.rs` do not compile without it (Amendment 1 item 6: each commit passes `cargo test`). P3 to P6 and R1 keep their order.
   - **(d)** OPEN-7-1 below.
   - **(e) The PLAN node.** It becomes as below once this amendment is on main, and is done with step 1's merge, with `{pr}` set in that done commit only.

3. **OPEN-7-1 (a red line: the human's typed ruling). The widening's commit place in step 1.** OPEN-18 (b) names step 1's first commit, and OPEN-A2 (b), ruled as the same ruling, names P2's version bump. Step 1's first commit (N0, Amendment 1 item 2) and N2 (Amendment 2 item 1) were committed on 2026-10-22, before the ruling. Any commit before P2 that widens `record_step` needs its own version (SKP-V0's schema-evolution item, item 2 (a)).
   - **(a)** In P2's one commit, under P2's version.
   - **(b)** Its own commit straight after P2, under P2's version, before P3.
   - **(c)** Its own piece after step 1's merge (OPEN-18 (a)). PR B then waits for it as well.
   - **Recommend (a).** It is OPEN-A2 (b)'s text. It keeps the whole field set of P2's version in one commit, as `skp/0.12`'s bump carried `record_step`'s types and fixtures (`protocol/skp/SKP-V0.md:1134` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:71e0db70c66ad671cb39e408f39750905a330fc5c642c2df9ffd4d5f3c51168d). It keeps OPEN-18 (b)'s one fewer version step.

**Superseded index:**
- §2.2's new codes list: added to by item 1.
- §2.2's first Not-changed bullet and §5's six commands' shapes, for `record_step`: by item 2 (a).
- §2.14's `record-step-style-match-widening` bullet, and Amendment 1 item 7's last bullet: by item 2.
- Amendment 1 item 6's P2 contents: by item 2 (c), under OPEN-7-1.
- §2.11's kernel tests file list, §4's step 1 table, §8 and §9's seam list: added to by items 1 and 2.
- Amendment 6 item 5: declared by items 1 and 2.

Nothing above is edited.

## Amendment 8 — OPEN-7-1 ruled (a), the human's message of 2026-11-11 (05:38Z) (class 5)

- **OPEN-7-1 (a)** (`state/directives/2026-11-11-1c-open-7-1-a-p2-now-pan-anchor-route-b-diagnostic-now-stall-record-two-runs.md`, item 1; the file's sha256 1bad1bbe9e354e98313996976b23f7599956ec879b7299f54ba5793d11ea8b6e): Amendment 7 item 2's widening lands inside P2's one commit, under P2's version. OPEN-18 (b)'s first commit reads as OPEN-A2 (b), since that commit predates the ruling. Amendment 7 item 1's code, `skp.project_folder_not_given`, rides the same bump.
- **The kernel tests group past its 1,000 lines** for the widening's tests (Amendment 7 item 2 (b)): accepted by the same item, recorded as class 8 when counted. §7 is not edited.
- **Next:** P2 now, then P3; then P4 to P6 and R1, as Amendment 1 item 6 orders them.

Nothing above is edited.

## Amendment 9 — P2 and P3 built (class 1); four groups and the step's total over their ceilings (class 8); P2's and P3's departures and additions disclosed for the gates (class 1); written after the result was seen

*Written by the custodian. References only: `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-p2-p3-worker-report.md`.*

1. **Built.** P2 is at ffc039d1c171a803af5f9c6451457595c28ed93a and P3 at 41c32190b81eff94afeff54ba18c184789b23092 on `cut/b2-piece-1c-save-and-reopen`, on P1's 7eb5aa71de4891718af82fffb8e7bbd2e90e0984 with no merge, and pushed; nothing past P3. P2 is one commit, under `skp/0.13`: the literal, `save_project`'s wire and codes, `skp.project_folder_not_given` and the whole `record_step` widening (Amendment 8). Each new test's mutation was observed failing alone at 41c32190, thirteen in all. The custodian recounted from the worker's logs: 1,065 passed, 0 failed and 66 ignored on P2's full run; 1,070, 0 and 66 at 41c32190. P2's full run was on a tree that differed from its commit by test-only edits to `protocol/skp/tests/fixtures.rs` and two data files since removed; that crate's tests were run again on the commit's tree, and 41c32190's full run covers both commits.
2. **Class 8.** By §2.11's command at H = 41c32190 with B = e57d75e191ea35fe44c3a26887d73b82f4b53262, P1's main parent and the branch's merge-base with main (over `43a39222...41c32190` the command also counts main's own changes merged at P1, 1,001 files), the step counts 51 files and 6,029 lines against ≤ 77 files and ≤ 4,790 lines. Over their ceilings: protocol product 407 of 320; fixtures and protocol tests 467 of 260; kernel product 3,206 of 1,350 (Amendment 6 item 2 counted 2,758 at O1, over the earlier base); kernel tests 1,547 of 1,000, accepted by Amendment 8. Which of the 28 protocol test, fixture and shell literal files count in the fixtures group and which in the version literal group is the worker's split, since §2.11 does not make it: 467 lines in 14 files, and 90 lines in 14 files against 130 lines and 30 files (25 changed files name a `skp/0.1x` literal). The others hold: the probe 144 of 150, ADR text 45 of 80, the renderer 123 of 200. §7 is not edited.
3. **Departures, for the gates (class 1).**
   - `StyleSetParams` keeps `FillColor` with its string value and adds a `FillColorMatch` variant, through a private wire enum that admits the match on `fillColor` only. Widening `FillColor` itself would have edited two existing kernel test files outside P2's list.
   - The wire `view` carries `centre` and `zoom` only; the kernel writes `crs` from the dataset's admission, and a conformance row refuses a wire `crs`.
   - `save_project`'s two request fixtures are held inline in `protocol/skp/tests/fixtures.rs` and as two conformance rows, not as files under `protocol/skp/tests/data/`: the shell's `src/console/renderTruth.test.ts` reads every request file there, has no key set for `save_project`, and is outside P2's list. P5, which brings `save_project` to the shell, finds this item here.
   - `key_present` takes any `Option<T>`, so `folder` and the workspace's `filter` are required keys whose value may be null.
   - `kernel/tests/project_save_skp.rs` (new, 265 lines, P3's three seam tests) is not in §2.11's kernel tests list; it counts in that group by path.
4. **Disclosed for the gates.** The additions the report lists beyond this form's: the five error fixtures and the response fixture under `protocol/skp/tests/data/`, six conformance rows, a `Prepared` struct, `Bind` mapped to `skp.project_file_refused` at `$.datasets[0]`, a `pub(crate)` `StepRecorder::host`; the seven tests §4 does not name, each with its mutation observed; the literal sites left as history, which the report lists.
5. **Next.** P4 to P6 and R1, as Amendment 1 item 6 orders them, after slot 2's quiet run ends, with no other heavy run of this project beside it.

Nothing above is edited.

## Amendment 10 — `binding_pick_project_folder` moves from P4 to P5 (class 1); step 1's project state in the binding (class 1); written at P4's stop, before any P4 code is committed

*Written by the custodian. References only: `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-p4-stop-worker-report.md`.*

1. **What stopped P4.** The shell's completeness test, `frontends/shell/src/console/surfaceCompleteness.test.ts`, last changed at 426609d9bbd9ce9496108ac5ccd4765be99269ee and not changed on the branch, checks class-B rows both ways: a row for each `binding_*` entry in the handler list in `lib.rs`, and an `invoke(` literal under `frontends/shell/src/` for each row. Amendment 3's P4 row names the first check only. With the handler entry and its row alone, the second check failed. The worker reverted both and committed nothing (the report above). The only call site is in a P5 file.
2. **The move (class 1).** In Amendment 1 item 6's list, `binding_pick_project_folder` (its function in `commands.rs` and its entry in the handler list in `lib.rs`) and its class-B row in `console/surfaceRegistry.ts` land in P5's commit, beside the shell's call site. P4 is the `save_project` command on `spawn_blocking` and the state of item 3. The step's files, groups, ceilings and tests are unchanged. What OPEN-17 (b) ruled is unchanged: P4 and P5 both wait for PR C, and PR C (0c3d54c43044d5d1fa69560911c9abf638851e03) is in the branch.
3. **Step 1's project state (class 1).** The lock that §2.7's third bullet holds is step 2's (§2.4, item 3). In step 1, the binding holds the kernel's `Projects`, built from `store::projects_root` and the step recorder, in its managed state, as it holds the step recorder. `close_dataset` is unchanged in step 1: `Projects` has no call that forgets a dataset, and P4 edits no kernel file. A closed dataset's entry is not matched again, since `open_dataset` mints a new handle, which is the catalog name, at each open. Step 2's lock and its drop at `close_dataset` are unchanged (§2.4, item 3; §2.7).
4. **Next.** P4 by this amendment; then P5 to P6 and R1, as Amendment 1 item 6 orders them.

Nothing above is edited.

## Amendment 11 — P4 built (class 1); the completeness test's list of class-A commands gains `save_project` in P5 (class 1); written before P5's code

*Written by the custodian. References only: `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-p4-worker-report.md`.*

1. **P4 built** by Amendment 10 at 2dcbd3bc953454278eef919b2f0e9bba51a4b4e5: `commands.rs` and `lib.rs` only, 43 lines; no new test, and so no mutation. The step stands at 53 files and 6,072 lines at B = e57d75e191ea35fe44c3a26887d73b82f4b53262, the src-tauri group at 43 of its 100; the groups over their ceilings are those of Amendment 9, unchanged by P4 (class 8 as recorded there).
2. **What P5 meets.** Besides the check that Amendment 3's P5 row cites, the shell's completeness test holds a fixed list of the class-A commands, and it asserts that the call sites in `skp/client.ts` equal that list. The test's own comment asks for a new command to update the list and the registry's class-A rows together. A seventh call in `skp/client.ts` fails that check until the list holds it. Amendment 3's P5 row names the registry only.
3. **The edit (class 1).** P5 adds `save_project` to that list, in the same commit as its call site and its class-A row, and the edit counts in the shell tests group. It is the one edit of an existing test that P5 makes outside §4's table, and it is not I3. P5 does not edit the test's names or its other checks. Their wording that counts six commands stays as it is, and is disclosed for R1.
4. **Next.** P5, by Amendment 10 item 2 and this amendment; then P6 and R1.

Nothing above is edited.

## Amendment 12 — the command bar's route to Save project: two files and one pinned-id test edit in P5 (class 1); the view read from the canvas's camera: one file, its accessor and its tests (class 1); the groups the added files count in (class 8 when counted); written at P5's stop, before any P5 code

*Drafted by the architect, read only, from P5's stop report (`state/consults/2026-11-11-b2-piece-1c-save-and-reopen-p5-stop-worker-report.md`) and `cut/b2-piece-1c-save-and-reopen` at 2dcbd3bc953454278eef919b2f0e9bba51a4b4e5, at which P5 made no edit. References only; nothing below is a quotation. Self-references are by section, amendment and item. Line pins are at B = e57d75e191ea35fe44c3a26887d73b82f4b53262, a commit on main, at which each pinned file is the file read at 2dcbd3bc; code that exists only on the branch is named by path, item and commit, with no line and no hash (round 15 (e)). The reuse index's two queries missed, in the custodian's runs at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-11; the misses are noted and do not block. Each new test's mutation, and the edited test's, is observed under §4's rule. §7 is not edited, and an overrun is class 8.*

1. **The command-bar route (class 1).**
   - *Reading.* §2.8 makes Save project available from the command bar and from a control. The bar lists the registry's entries (`frontends/shell/src/layout/StudioLayout.tsx:326` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:4ba54a98217c7043360e772db3dc478d5fc34c6d37da2f35683c527a6ba8c14a). An entry needs an id in the closed union (`frontends/shell/src/layout/actionRegistry.ts:24-35` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:3047b54db9834cf9c47a2990e0effc30ab5c4c9e4226fa6f3974f7f35d94382e) and a row in the list (`frontends/shell/src/layout/actionRegistry.ts:60-73` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:853aa349fde4c034a1de08f398ff7c0eae3351b4f151dc443df78d0ee4fe4426). The bar's availability and dispatch are StudioLayout's (`frontends/shell/src/layout/StudioLayout.tsx:195-217` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:02e3de52e74efb9e0595e9f18d8004cc621ca3f697cfb84717f2a0937895dd73; `frontends/shell/src/layout/StudioLayout.tsx:227-249` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:cfc61d14b8d54b34d384dfc9e9bdc649b13ffbbb87890b4c1ff613b204f25191). §2.11's step 1 shell product list names neither file. This item corrects the file list and the commit plan only; §2.8 is unchanged. The stop report's choices 2 and 3 would narrow §2.8, which the human approved with this form, and neither is taken.
   - *Files added to P5.* Shell product: `layout/actionRegistry.ts` and `layout/StudioLayout.tsx`. Shell tests: `layout/actionRegistry.test.ts`, for the one edit below.
   - *The action.*
     - Its id is `project.save`. It is the thirteenth member of `ActionId` and the thirteenth entry of `ACTIONS`, appended after `filter.addClause`, so every other entry keeps its place in registry order.
     - Its entry: `label` is S1; `command` is S22; `takes` is `"nothing"`; `chord`, `bareKey` and `scopeWords` are `null`. No chord or key is assigned.
     - Region: none. `TOGGLE_REGION` gains nothing, so StudioLayout draws no top-bar button for it (`frontends/shell/src/layout/StudioLayout.tsx:329-331` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:edc2f667f5317e28a82134f0f0c3c7a47f18c71614a24c421ff3d0e404c92a74).
     - Available when a dataset is on the map (`layersRow` not `null`) and `onSaveProject` is given. `available()` gains that case, because its default arm answers available.
     - Run: `runAction` gains the arm `project.save`, which calls `onSaveProject` and returns `"done"`.
   - *How StudioLayout reaches App's save.* `StudioLayoutProps` gains the optional `onSaveProject?: () => void`. This follows `onOpenDataset` and `onRevealExport`, where an absent prop leaves its entry unavailable (`frontends/shell/src/layout/StudioLayout.tsx:132-138` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:c9a58242aa3a60d12b837a52089ebb99c220073fbf5ebc6bc443db28405302d0). Its product caller is App, which passes its one save handler. StudioLayout imports nothing new and calls no SKP command itself.
   - *The one control.* A button in App's own JSX, in the `region.layers` slot after `AdmissionPanel`, rendered only while a dataset is admitted. It takes its label from the entry, as the tool switch takes its labels (`frontends/shell/src/layout/actionRegistry.ts:16-19` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:80eae9fa4036d366c535be356ba7780f365d53dc227315e54db35665eca6eda0), and its click calls the same handler as the entry. P6 settles its place together with S1.
   - *Existing tests.*
     - `commandDraft.test.ts`'s comparisons at `frontends/shell/src/command/commandDraft.test.ts:47` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:81bc615cbd2db97046112cc581adcbd4b19c8f1d4fb2be8cbf15cc219608eee4 and `frontends/shell/src/command/commandDraft.test.ts:54` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:3768b196a40ce59598dda1c619cbf931f3161183e5f59ee77e21ced9774660ea derive both sides from `ACTIONS`. Help lists every entry in registry order (`frontends/shell/src/command/commandDraft.ts:45` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:dc21974d6bcbdb96336a9000feca0fc1060345cc8f05a99c16f55799b2232173), so a thirteenth entry enters both sides alike and neither result changes. They are not edited.
     - Its other expectations name fixed ids for fixed drafts (`frontends/shell/src/command/commandDraft.test.ts:28-49` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:5151055279460f2f14a888ec4215eaf44f50132cd85ee021c26f82a97ff7e206; `frontends/shell/src/command/commandDraft.test.ts:65` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:d063ea55310351c159a0c869a8e38642a1bca4bb6c1f6ed6f3ec860c7201bd18; `frontends/shell/src/command/commandDraft.test.ts:141-142` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:cd77a40f75a2f64740ed5ec82381b4100e27a7443a91c4d728692435ea20ce47), and so does one App search (`frontends/shell/src/App.command.test.tsx:478-479` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:090fe3f088228aecc077562601e4a30c3d3f199a0b3d9fb9ec1dc26739794056). They hold unchanged if all of these hold: S1 and S22 contain none of `zoom`, `inspector`, `selection`, `m-to` or `bar`, in any case; S22 begins with none of `lay`, `zoom` or `filter`; and S22 is no other entry's word. A placeholder that breaks one of them is I3: stop.
     - The pinned-id test (`frontends/shell/src/layout/actionRegistry.test.ts:132-147` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:2e490d9bccda52d440cec0d35f9c3195a3d4a1ab3394afb66732515c2a084220): its expected list gains `"project.save"` in sorted place, after `"layout.toggleLayers"`. That is its one edit. Its name, its other checks and its recorded-mutation comments stay. The name's count of twelve stays as it is and is disclosed for R1, as Amendment 11 item 3 left its count of six.
     - *I3.* I3 fired at P5's stop, and P5 stopped as §5 orders. This amendment is written before any P5 code and enters the edit in §4's step 1 table below. The edit adds one id to a list that pins the registry, and it weakens no check. Class 1, as for Amendment 11 item 3.
   - *§4, step 1, rows added.*

     | Test | Mutation |
     |---|---|
     | the pinned-id test, edited as above (`layout/actionRegistry.test.ts`) | the `project.save` entry deleted from `ACTIONS` |
     | Shell: `the save word in the command bar and the save control each send save_project once, and with no dataset the entry is not available` (in P5's App-level suite for step 1) | the `project.save` arm removed from `runAction` |

   - *§9, the seams.* Command bar → `runAction` → App's save → `save_project`: the second row above, through the real `StudioLayout` and `CommandBar`. Control → App's save → the file: E-SAVE.
   - *Rule (00).* The paths P5 adds are `layout/actionRegistry.ts`, `layout/StudioLayout.tsx`, `layout/actionRegistry.test.ts`, `canvas/WorkingCanvas.tsx` and `canvas/WorkingCanvas.wiring.test.tsx`. On 2026-11-11 the custodian checked every remote branch, and none touches `layout/`, `canvas/`, `command/` or `App.tsx`. Before P5's dispatch, the custodian also confirms that no in-progress piece's form names one of these paths, the pan-anchor diagnostic's form included. Step 1 stays the one piece on `protocol/`.

2. **The view source (class 1): a read accessor on the canvas handle.**
   - *Why not a view derived in App.*
     - App's last viewport box is reset at each open (`frontends/shell/src/App.tsx:232-236` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:b938923dc147548a6590e2d5aa2b1f0db1ffd5ceb0ac94f4ae22bffc531a78a0), and the auto-fit does not write it (`frontends/shell/src/App.tsx:2206-2207` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:9bbd3c6670bc57643d05ce4a6a50b2b6395f06b94b4fca7a410ea2982ad096c1). E-SAVE's own sequence reaches this: a save straight after an open would carry no box, and a save after a filter's re-fit would carry a box for a view no longer shown.
     - Where a box exists, a centre taken as its midpoint and a zoom taken as log2 of a measured width over its span are reconstructed from the box, not the values the camera holds. A reopen would then not restore the camera that was saved, bit for bit.
   - *The accessor.* `WorkingCanvasHandle` gains `currentView?(): { centre: [number, number]; zoom: number } | null`.
     - It reads the camera the canvas last wrote (`frontends/shell/src/canvas/WorkingCanvas.tsx:1074-1076` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:ca7869ef2c53551856fa653ed0730703627e77cd27c4f14aa75c27090b1af830) and changes nothing.
     - `centre` is the camera's local target plus the offset frame's origin, member by member. That is the same dataset-space point the gesture handler forms from them (`frontends/shell/src/canvas/WorkingCanvas.tsx:2107-2111` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:1f8fade2019c1f79c8d14309ef01f43f29791388e819ae1b97ea4941eda8e04a). Only that sum leaves the module; the local target and the origin do not (ADR-010 rule 1, as `frontends/shell/src/canvas/WorkingCanvas.tsx:2103-2106` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:4c515e5282f7fcc48169d76bf8e532bd8e33ad16b57b7d5e9f0bd790cfa09396 applies it).
     - `zoom` is the camera's held zoom, returned unchanged. It is already Amendment 1's measure: the canvas fits with log2 of the CSS pixels one unit spans (`frontends/shell/src/canvas/extent.ts:141-145` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:a01f9e84900ab9a931d74459594f34a76d80ab47a8d5b588cf14a7ce252d3757).
     - It answers `null` before the canvas's first camera write.
     - It is optional in the type only, so the stand-in handles that predate it still satisfy the interface; the component always provides it. This is `fitToBbox`'s precedent (`frontends/shell/src/canvas/WorkingCanvas.tsx:138-142` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:b20d4b86484afb015faecdafca267839ab109035bdb723b672073e8edd1462a8). A required member would have to be added to every stand-in typed as the handle (one of them: `frontends/shell/src/App.lateResult.test.tsx:322-356` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:06b6ccf46a60223b46d7dbd40913835282d06465286e5430398b5fa17805b464), which is I3 in each file.
     - Its doc comment names its product caller, App's save.
   - *App's save.* It reads the accessor and encodes the three numbers with `encodeHexF64`, as the wire box does (`frontends/shell/src/App.tsx:138-145` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:2661fda2e17ce431a62a0f5ff8d0b9678075c63498adbe51c559bffbaa982423), into the request's `view`: `ProjectView` in `protocol/skp/src/v0/commands.rs` at 2dcbd3bc953454278eef919b2f0e9bba51a4b4e5, P2's item. When the accessor answers `null`, or the handle lacks it, App sends no `save_project` and shows S23.
   - *§2.11.* `canvas/WorkingCanvas.tsx` joins the shell product group. `canvas/WorkingCanvas.wiring.test.tsx` joins the shell tests group.
   - *§4, step 1, rows added.*

     | Test | Mutation |
     |---|---|
     | V-C1 `the canvas's current view is its camera's target plus the frame origin and its held zoom, bit for bit, and null before any camera write` (`canvas/WorkingCanvas.wiring.test.tsx`, a new `describe`, through the real `WorkingCanvas` with deck's `Deck` class replaced, as the file's other tests run; no existing test or helper there is edited, and one that needs an edit is I3). Cases: `null` at mount; after a gesture tick, each member `Object.is` the tick's target plus the origin, and its zoom; after the origin moves at a settled tick, a tick at local target (0, 0) still answers the dataset-space point. | `centre` returned as the local target without the origin |
     | Shell: `with no view from the canvas a save sends nothing and shows the not-saved notice` (P5's App-level suite) | the save sent with a centre and zoom of 0 |

   - *E-SAVE (P6) gains one assertion.* Before the save, the camera is set through the DEV-only `e2eSetViewState` hook (`frontends/shell/src/canvas/WorkingCanvas.tsx:2324-2351` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:d2a8fde77ba254d0b1c0d6c3037c2dc0d0c3dfae77f4be5c90395bf65925f96f) to a pose whose three numbers have no short decimal spelling. The saved file's `view.centre` and `view.zoom` must hold those numbers' HexF64 patterns. This is the seam's end-to-end proof from the real shape: canvas → App → `save_project` → the file. Mutation: as V-C1's.
   - *§8.* Item 22: a `view` sent that was not read from the canvas's held camera, or a local-frame value leaving the canvas.
   - *§9, the seams.* Canvas `currentView` → App's save → `save_project`'s `view` → the file: V-C1 and E-SAVE.
   - *Step 2.* Its reopen applies a saved view to the camera, and its shell list does not name `canvas/WorkingCanvas.tsx`. That write path is step 2's to declare before its code; nothing here declares it.

3. **Size (class 8 when counted).** The added files count as follows:
   - shell product: `layout/actionRegistry.ts`, `layout/StudioLayout.tsx` and `canvas/WorkingCanvas.tsx`;
   - shell tests: `layout/actionRegistry.test.ts`, `canvas/WorkingCanvas.wiring.test.tsx` and the two new App-level tests;
   - e2e: E-SAVE's assertion, in `e2e/project.mjs`.

   `command/commandDraft.test.ts` is not edited. The step stands as Amendment 11 item 1 records it, and the groups over their ceilings are those of Amendment 9. Any further overrun of a group, of the step's lines or of its 77 files is recorded as class 8 when §2.11's command counts it, and nothing is trimmed. No figure is predicted.

**Strings (§2.12; P6 placeholders, none the human's).** S1 also labels the bar's entry. S22 is the bar's save word: it is typed after the slash and carries no marker, and the comment at its site names it S22. S23 is the not-saved notice for a save with no view from the canvas, and it states only the consequence. Shown text carries the shell's `[P6 placeholder] ` marking.

**Superseded index:**
- §2.11's step 1 shell product and shell tests lists: added to by items 1 and 2.
- §2.12's owner placeholders: added to by item 1 (S22) and item 2 (S23).
- §4's step 1 table and E-SAVE: added to by items 1 and 2.
- §4's closing sentence, for P5: by item 1, beside Amendment 11 item 3.
- Amendment 11 item 3's statement that the completeness-test edit is P5's one edit of an existing test: by item 1.
- Amendment 3's P5 row and Amendment 1 item 6's P5 contents: files added by items 1 and 2.
- §8 and §9's seam list: added to by items 1 and 2.

Nothing above is edited.

## Amendment 13 — P5 built (class 1); the step's lines further over their ceiling (class 8); a Guardian refusal the report omits, disclosed for the gates; written after P5's report was seen, before P6's code

*Written by the custodian. References only: `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-p5-worker-report.md`.*

1. **P5 built** by Amendments 10 to 12 at a3a1ba4ea550c75fe85b1bf0bbd1ad7398670060, one commit of 15 files. It holds §4's three shell tests, Amendment 12's two App-level tests and V-C1, each with its mutation observed at that commit, and one further mutation observed on the completeness-test edit. The only edits of existing tests are the two that Amendments 11 and 12 permit.
2. **Size (class 8).** At B = e57d75e191ea35fe44c3a26887d73b82f4b53262 the step stands at 65 files and 6,711 lines. The files are within their 77. The lines stay over their 4,790, as Amendment 9 recorded, and nothing is trimmed. P5's groups are within their ceilings: src-tauri 66 of 100, shell product 262 of 380, shell tests 356 of 380.
3. **For the gates.** The additions the report lists as not named by the form stand as it gives them, and so do its two departures: one commit, and App's lazy `save` arrow. The report omits one event that its transcript holds. The spatial-guardian refused the first write of `project/saveProject.ts`, because the file's folder did not yet exist. The worker then made the folder and wrote the file again, and the Guardian allowed that write. The brief made any Guardian refusal a stop. The bytes are the commit's, and they are gated as such.
4. **Next.** P6, by Amendment 1 item 6, with E-SAVE's added assertion from Amendment 12 item 2; then R1.

Nothing above is edited.

## Amendment 14 — E-SAVE's route past the native folder picker: a DEV-only hook that supplies the folder to the control's own save (class 9, declared before any of its code); the files it adds to P6 (class 8 when counted); written before P6's code

*Drafted by the architect, read only, from `cut/b2-piece-1c-save-and-reopen` at a3a1ba4ea550c75fe85b1bf0bbd1ad7398670060 (P5). References only; nothing below is a quotation. Self-references are by section, amendment and item. Line pins are at e57d75e191ea35fe44c3a26887d73b82f4b53262, a commit on main, at which each pinned file is the file read at a3a1ba4e. Code that exists only on the branch is named by path, item and commit, with no line and no hash (round 15 (e)). The reuse index's two queries missed, in the custodian's runs at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c on 2026-11-11; the misses are noted and do not block. §7 is not edited, and an overrun is class 8.*

1. **What E-SAVE meets.** Under §2.8, the first save opens the folder picker. E-SAVE (§4; Amendment 1 item 5; Amendment 12 item 2) saves through the control. The picker is `binding_pick_project_folder` (`frontends/shell/src-tauri/src/commands.rs` at a3a1ba4e, Amendment 10 item 2's item), a native dialog that no CDP driver reaches (`frontends/shell/e2e/README.md:25-30` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:14f8548822412e0084f3139d698ef8055706abecef688c107b03f992b6817aa2). The form names no route past it, and Amendment 1 item 6's P6 list holds no product file.

2. **The route (class 9).**
   - *Reading.* The picker is its own binding. `save_project` takes the folder as a request field that the page sends (`frontends/shell/src/project/saveProject.ts` at a3a1ba4e: `pickProjectFolder`, and the saver's `pickFolder` and `save` dependencies; `save_project` in `commands.rs` at a3a1ba4e). This is admission's shape: there, `openPath` supplies the path the picker would have given and runs the code a click runs (`frontends/shell/src/admission/AdmissionPanel.tsx:307-313` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:03e18920860c94be49a0b6d145827aedc02ead71394f884ce594a64ac825d416; `frontends/shell/src/admission/AdmissionPanel.tsx:324-347` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:63229ee7704802c7f12fddf0e2f7d7993b832e07e68d23c81fa3d0b5d76b3486). It is not publish's shape, where the picker sits inside the command and a host seam was needed (`binding_publish_prepare_e2e_destination` in `commands.rs` at e57d75e191ea35fe44c3a26887d73b82f4b53262; `frontends/shell/e2e/publish.mjs:11-27` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:173eaf3ac6501d75df80f2758217f4768f7c61ebac1eee9f30a700cb7e29fc05). So the route is in the page only. It adds no host code and no Tauri command, and it does not edit `commands.rs`, `lib.rs` or `project/saveProject.ts`.
   - *Where the folder is chosen.* In the save, the pick happens inside the saver. So, unlike admission, no existing function begins after the pick. The one place the folder is chosen is the `pickFolder` dependency that App gives `createProjectSaver` (`frontends/shell/src/App.tsx` at a3a1ba4e).
   - *The hook.* `e2eSaveProjectToFolder(folder: string): Promise<"asked" | "not-asked">` becomes a member of `E2eTestSurface` (`frontends/shell/src/e2e-test-surface.ts`). App registers it through `registerE2eHook` in a top-level effect of its own, gated as item 4 says, and unregisters it in that effect's cleanup.
     - It puts `folder` in a one-shot slot that App holds, then awaits `handleSaveProject` (App at a3a1ba4e), which is the function App's control and the bar's entry both call (Amendment 12 item 1). Then it empties the slot. If `handleSaveProject` reads a render-scoped value, the hook reaches it through a ref that the render assigns, so the hook never runs a stale closure.
     - In an instrumented build only, App's `pickFolder` dependency answers the slot's folder and empties the slot when it holds one. Otherwise it calls `pickProjectFolder` as it does now.
     - The hook answers `"asked"` when the saver took the folder from the slot. It answers `"not-asked"` when the slot was still full after the save: the open had a confirmed save, a save was in flight, or no dataset was drawn.
   - *Files added to P6.* Shell product: `frontends/shell/src/App.tsx` and `frontends/shell/src/e2e-test-surface.ts`. e2e: `frontends/shell/e2e/checkDistClean.mjs` (item 4), which counts in the e2e group by path.

3. **What the hook may and may not do.**
   - *It may* supply one folder in place of the native picker's answer, for the save it starts.
   - *It may not:*
     - build a save input of its own;
     - call `save_project` or `saveProject` itself;
     - construct a saver of its own;
     - mark a dataset saved;
     - pass the saver's in-flight guard;
     - add, drop or change a notice;
     - return anything over CDP beyond its two-word answer. The driver reads the file from disk.
   - *Its doc comment* names its only caller, `e2e/project.mjs`. It also says that a run through the hook does not exercise the native folder picker, which only the operator's Part does (§9, OP1), as publish's seam says of its own picker.
   - *§8.* Item 23: an e2e hook on the save that does more than supply the folder, or a save the hook starts that is not `handleSaveProject`'s.

4. **Its gate.**
   - *The predicate.* `isInstrumentedBuild()`, the gate that `openPath` and App's top-level registrations use. Outside it, `registerE2eHook` does nothing (`frontends/shell/src/e2e-test-surface.ts:360-368` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:fb08c9186b54bf8d8102e929c67481e1cd05a0b65ad24f952ca705284d4727c4). The slot's branch in `pickFolder` sits behind the same predicate, so in a plain build `pickFolder` only calls `pickProjectFolder`. The hook is present in a measure build, as `openPath` is, and no measured cell calls it.
   - *The dist check.* `INSTRUMENT_IDENTIFIERS` (`frontends/shell/e2e/checkDistClean.mjs:55-125` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:4346998bfe75f5091a84d3d46c0d84b0613f208a3c8835bbf6d8612f79ce0b97) gains `e2eSaveProjectToFolder`, with a comment that names this item. The name is a string argument to the registration, which no minifier renames, so a hit is real signal. A miss is a floor, as the file's own top comment says. The proof is check:dist-clean's PASS inside `npm run verify` at P6's commit.

5. **Its test (§4, step 1, row added).** E-SAVE is the hook's only caller, and it carries the hook's seam end to end from the real shape. E-SAVE's save goes through the hook, and E-SAVE gains these steps:
   - the first save answers `"asked"`, and that folder holds `project.spatial` (E-SAVE's existing assertion);
   - a second hook save, given a second empty scratch folder, answers `"not-asked"`. The second folder stays empty, and the first folder's `project.spatial` still reads back.

   | Test | Mutation |
   |---|---|
   | E-SAVE's hook steps (`e2e/project.mjs`) | the hook's save made through a saver of its own, whose `pickFolder` answers the supplied folder (expected: the first step fails at `"asked"`) |

   No shell test is added. The click and bar paths keep their own tests (§4; Amendment 12 item 1). The mutation is observed under §4's rule.

6. **Security posture (docs/09).** This is the established pattern applied to one more dialog, with no new exposure:
   - the posture (`docs/09_Security_and_Privacy.md:3-5` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:7d8a0c55b960eabc0f6cabacf37839716afa2441eabbb9dbd82066f60db101fa) and the local sockets section (`docs/09_Security_and_Privacy.md:30-43` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:342fe389548fffcdcbc8f2e96ff858e1f441e25862ef3849fe1efdc30fe04e38) are untouched: there is no new command, capability, grant, port, network access or credential;
   - in every build, the page can already send `save_project` any folder (item 2, the reading). The native picker is UI, not a grant or containment boundary, and the kernel's refusals apply to whatever folder arrives. Publish's picker is different: its destination never crosses from the page, and the host mints the grant from it;
   - the save stays the same `save_project` call, so its class-A console row is unchanged;
   - nothing crosses CDP except the answer (`frontends/shell/src/e2e-test-surface.ts:24-26` @ e57d75e191ea35fe44c3a26887d73b82f4b53262 sha256:f38924a07ed9fde4d00d2451dec86ab9eecca2363eb06bb15bb264dfbc60f39f).

7. **Rule (00).** P6's paths are `frontends/shell/e2e/project.mjs`, `frontends/shell/package.json` and `frontends/shell/e2e/README.md`, plus the three paths item 2 adds: `frontends/shell/src/App.tsx`, `frontends/shell/src/e2e-test-surface.ts` and `frontends/shell/e2e/checkDistClean.mjs`. The custodian's 2026-11-11 check covered `App.tsx`. Before dispatch, the custodian checks the other two against every remote branch and every in-progress piece's form, the pan-anchor diagnostic's included. A shared path is I7. Step 1 stays the one piece on `protocol/`.

8. **Size (class 8 when counted).** `App.tsx` and `e2e-test-surface.ts` count in the shell product group. `checkDistClean.mjs` and E-SAVE's added steps count in the e2e group. The step stands as Amendment 13 item 2 records it. Any further overrun is recorded as class 8 when §2.11's command counts it, and nothing is trimmed. No figure is predicted.

**Strings (§2.12).** None is added. The hook shows nothing, and S1 to S23 are unchanged.

**Superseded index:**
- Amendment 1 item 6's P6 contents, and §2.11's step 1 shell product and e2e lists: added to by item 2.
- §4's step 1 table and E-SAVE: added to by item 5.
- §8: added to by item 3.
- §9's seam list: added to by item 5 (E-SAVE → the hook → `handleSaveProject` → `save_project` → the file).

Nothing above is edited.

## Amendment 15 — P6 built (class 1); a verify run re-run alone by THE MACHINE paragraph (class 1); the e2e group and the step's lines over their ceilings (class 8); written after P6's report was seen, before R1

*Written by the custodian. References only: `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-p6-stop-worker-report.md`.*

1. **P6 built** by Amendment 14 at 9d55f1f5e45f8468b95b6c52cd1042b5d1ec7983. C1, 1c807fc6e8e931dfa4d8a356bb4914b4d9fa29f4, holds the six files Amendment 14 item 7 names. The second commit records E-SAVE's three mutations in the suite's header. E-SAVE passed at C1 and at the head. Its three mutations, §4's, Amendment 12 item 2's and Amendment 14 item 5's, each failed at its predicted step, observed at C1.
2. **The verify run.** `npm run verify` passed at C1. At the head it failed on one existing test, which ran out its fixed timeout while cargo waited on a lock. That run was shared, with light checks beside it, and the worker stopped as its brief ordered. By THE MACHINE paragraph that failure is not recorded as a failure. The custodian re-ran it alone at the head, and 111 files and 1,453 tests passed. The head differs from C1 only in the suite's header.
3. **Size (class 8).** At B = e57d75e191ea35fe44c3a26887d73b82f4b53262 the step stands at 70 files and 7,200 lines. The files are within their 77. The lines stay over their 4,790, and nothing is trimmed. The e2e group is at 444 of its 320.
4. **For the gates.** The report's one departure stands as it gives it: light checks were run beside the head's verify run. Its transcript holds three errored calls: one edit of a file not yet read, and two foreground sleeps that the harness blocked. It holds no Guardian refusal.
5. **Next.** The branch is pushed by the custodian. Then R1, by Amendment 1 item 6.

Nothing above is edited.

## Amendment 16 — before R1: `KnownFolders::from_bytes` lands in step 1, with its product caller pre-committed to step 2 (class 1); R1's KNOWN-LIMITATIONS item is K-4 alone, and its Part carries P0 and OP1 (class 1); `kernel/README.md`'s edits named (class 1); rule (00) at R1's dispatch (class 1); written before R1

*Written by the custodian. References only, and nothing below is a quotation. Self-references are by section and item. The sources are this form's §2.11, §2.12 and §9, its Amendment 1 items 5 and 6, its Amendment 3 items 1 and 2, and `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-p5-worker-report.md`.*

1. **`KnownFolders::from_bytes`.** The reader of `folders.json` lands in step 1, by N7 (Amendment 1 item 6). Its one caller in step 1 is K-S13, `the_first_save_records_its_folder_as_first_in_folders_json`, which reads back what the first save writes. Its product caller is step 2's reopen, which reads `folders.json` under M1 (Amendment 1 item 5). So step 1's PR carries a `pub` reader whose only caller is a test. This item is the pre-commitment that names it. It is the one exception to Amendment 1 item 6's rule that a `pub` item used only by tests gets its product caller later in the same PR. Nothing is silenced.
2. **R1's KNOWN-LIMITATIONS item.** §2.11's records row and Amendment 1 item 6's records row give step 1 one item.
   - Of §2.12's placeholders, K-4 is step 1's: the machine store is written at a save (N7, and the save's `folders.json`), and nothing removes it.
   - K-2 describes the containment check when a project opens its data, and K-3 a Cancel during a download at that open. Both are step 2's, and they go with step 2's records. K-1 stays withdrawn.
   - The item takes the next free number at R1's base: 62 at main 9e99b132e2e59da936907d8b5788b8b953950d45.
   - Its words are an owner placeholder (§2.12). It carries the DRAFT mark that the file uses for words that are not the human's, and it states only what step 1's code does at R1's head.
   - Amendment 3 item 2 numbered R1's items 48 to 50 beside PR C. Amendment 3 item 1 bounds that amendment to the time beside PR C, which has merged.
3. **R1's Part.** The new Part takes AD, the next letter after main's last Part, AC. It carries §9's P0 and OP1, with a blank log. OP2 to OP6 need steps 2 and 3, and they join this Part with those steps.
4. **`kernel/README.md`.** R1 brings the file current with step 1 at R1's base:
   - ADR-036's status, Accepted 2026-10-22, wherever the file states it as Proposed: the session-history paragraph under its section on what is deliberately absent, the owner's-index rows for the session history and the lasting dataset reference, and the owner's-index list of Proposed ADRs, with ADR-036 joining the accepted ADRs it lists;
   - what the file says the SKP host carries, where step 1 adds `save_project`;
   - the owner's-index pointers that step 1 adds: the project module and its save, the machine store and its ceiling; item 62 among the declared limits; the last-verified line at R1's head.
   The engine README's ADR-036 line is not this piece's.
5. **For the gates.** P5's report discloses that the console recorder does not record the invoke of `binding_pick_project_folder`: `soleCaptureSite.test.ts` limits the recording sites, and `project/saveProject.ts` is not among them. R1 does not change this, and the reviewer grades it.
6. **Rule (00) at R1's dispatch.**
   - Main's 17 commits since B = e57d75e191ea35fe44c3a26887d73b82f4b53262 change only `state/`, `governance/` and the generated `site/`, and `git merge-tree` merges main into the branch's 9d55f1f5e45f8468b95b6c52cd1042b5d1ec7983 with no conflict.
   - Port-2, built and waiting on this step's merge, edits `KNOWN-LIMITATIONS.md`'s platform header and item 43. Those are paths separate from item 62. It touches neither a walkthrough Part nor `kernel/README.md`.
   - Pan-anchor, which is held, edits only `frontends/shell/e2e/pan-anchor.mjs`. Its diagnostic commits no file. No PR is open. Step 1 is the one piece on `protocol/`.
7. **Heavy runs.** The merge brings only records, and R1 edits three Markdown files. So R1 runs no build, no test suite and no e2e suite. §9's suites run at the PR's gates, by THE MACHINE paragraph.
8. **Next.** R1, then step 1's PR.

Nothing above is edited.

## Amendment 17 — R1 built (class 1); the step's lines over their ceiling (class 8); written after R1's report was seen, before step 1's PR

*Written by the custodian. References only: `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-r1-worker-report.md`.*

1. **R1 built,** by Amendment 16.
   - Main at e3fb4a97ebef726f77a5e2609b8fada32a6b1208 is merged into the branch at 88a35355c42e46a19e57836edb684a32d5871fa7, with no conflict. The merge brings only `governance/`, `site/` and `state/`.
   - The records commit, 791e7e9edb52328b7c430012c9a3a5e1105de8a2, holds the three files Amendment 16 names: `kernel/README.md`, item 62 and Part AD. It is pushed.
2. **Size (class 8).** B for step 1's PR is e3fb4a97ebef726f77a5e2609b8fada32a6b1208, the main commit merged. At that B the step stands at 73 files and 7,249 lines.
   - The files are within their 77.
   - The lines stay over their 4,790, and nothing is trimmed.
   - The records group is at 49 of its 120.
3. **For the gates.**
   - Item 62's words go past K-4's placeholder by three clauses, each taken from the code at the head as the report gives it:
     - the store's path;
     - that a save failing at the replace leaves the two machine files, and the next save makes another identity;
     - that a dataset opened and saved again makes a new identity.
     The words carry the DRAFT mark.
   - Item 62's comment names the code by path and line span, in words, at the merge commit with no hash. It says that pins follow on main after the merge. No piece is placed for that, and the reviewer grades it.
   - Two edits to tracked files were made by shell: a `sed -i` on two of item 62's line spans, and Part AD's text appended from a scratch file. The transcript holds both.
   - The kernel README's list of preregistrations does not gain this piece's form.
   - The transcript holds no errored call, no Guardian refusal and no heavy command.
4. **Next.** Step 1's PR, by §9, with its gates.

Nothing above is edited.

## Amendment 18 — gate 1's findings: the correction round R2, declared before its code (class 1; class 9 for the picker's record and its test); two findings to the human (class 5 when ruled); rule (00) at R2's dispatch (class 1)

*Written by the custodian. References only: `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-architect.md` and `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-reviewer.md` (gate-log 718 and 719), both FAIL at 791e7e9edb52328b7c430012c9a3a5e1105de8a2.*

1. **R2, on the branch, after this amendment and before any other code.** Each change names the finding it closes, and its words are the reports' own, which carry their clause checks; none is the human's wording.
   - **ADR-022's note** (architect C-1; Amendment 4 item 2). `## Note 2026-11-05` is appended at the file's end, after Amendment 2, in ADR-026's shape: the heading, the italic line naming the human's typed words (`state/directives/2026-11-05-8c-full-form-nine-s2-placed-u12-slot-2-u1-reproducer-adr-notes-words-e2e-readme-words-8b-d3.md`, item 3), then the note, byte-copied by script from that item's ADR-022 bullet, inside its quotation marks. Nothing above the heading changes. `adr-notes-stale-statements-and-indices` is done with step 1's merge, as Amendment 4 says.
   - **`store::OPEN_LOCK` removed** (architect C-3, reviewer C2). Step 2 adds it with the lock that uses it (§2.7).
   - **The folder picker recorded** (architect C-4, reviewer D2). `pickProjectFolder` moves into `frontends/shell/src/skp/dialog.ts` beside `pickFile`, and records `binding_pick_project_folder` by `recordNamed("binding-command", …)`, resolved on success and on a throw as `pickFile` is. `project/saveProject.ts` imports it from there. `skp/dialog.test.ts` gains one test with two cases, success and a throw, each asserting the row's name and outcome in the recorder. With the move, `console/recorder.ts`'s "every binding-command call site" sentence is true again, and it is not edited.
   - **Words:**
     - item 62: the architect's W1 for the sentence that begins "Both files are written before", and W6 for its comment's last clause (architect C-5 and D-6, reviewer D6);
     - `HistoryMarkState`'s doc and SKP-V0 §11.2's `history_mark` line: the architect's W2 and W3 (architect D-1, reviewer D1);
     - `SaveFailure::MachineRecordRefused`'s doc: the architect's W4 (D-2);
     - the counts: the architect's W5, test names included, a class 3 edit by named exception (architect D-4, reviewer D4);
     - `e2e-test-surface.ts`'s `"not-asked"` doc: the reviewer's D3;
     - `kernel/README.md`'s list of preregistrations gains this form (architect D-5).
   - **Not changed in R2:**
     - `skp.project_file_refused`'s message (architect D-3) reaches the operator inside S4, so it stays under P6 for the sitting, with the architect's suggestion on record there;
     - the reports' notes, none blocking.
2. **To the human, not in R2.** Each one changes what a ruling or ADR-036's text settles, so it waits for the human's typed words. R2 does not wait for them.
   - **Architect C-2:** §2.2 gives `save_project`'s reply no member for the judgment that §2.3, §2.8 and §2.12 (S18) show at save. The custodian recommends a member under `skp/0.13` before merge, with S18 and one end-to-end test.
   - **Reviewer C1:** a second open of one file saves its mark into the first project's record and replies `written`. The custodian recommends withholding the mark with a named reason, and one kernel test that the first record is unchanged.
   - Each ruling's code follows by its own amendment, declared before that code.
3. **Reviewer H1.** `KnownFolders::from_bytes`'s pre-commitment stays as Amendment 16 item 1 records it. The architect's check 1 reads the 2026-10-23 directive as leaving it to the custodian. Its consumer, step 2's reopen under M1, and its gate, K-O10, are named in the PR body and in the node's PLAN summary at the next filing (architect D-7, reviewer D5).
4. **Superseded.** Amendment 17 item 3's second clause of item 62's words is the overstatement that architect C-5 corrects. It stays as written, append-only, and is superseded by item 1 here.
5. **Rule (00) at R2's dispatch.**
   - Slot 2 commits nothing; pan-anchor's branch is held.
   - Port-2's branch, built and not merged, touches `KNOWN-LIMITATIONS.md` in its portability levels and item 43, not item 62, and `kernel/src/permission/audit/log.rs`, which R2 does not edit. Neither touches `protocol/`.
   - The docs lane is blocked, and the filler is idle.
6. **Size.** R2's lines count in their groups, class 8 when counted.
7. **Next.** R2's report; then gate 1 again, attempt 2, scoped to these findings; then the suites at R2's head, alone on the machine.

Nothing above is edited.

## Amendment 19 — R2 built (class 1); the shell tests group over its ceiling (class 8); written after R2's report was seen, before gate 1's second attempt

*Written by the custodian. References only: `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-r2-worker-report.md`.*

1. **R2 built,** by Amendment 18 item 1, in two commits on 791e7e9edb52328b7c430012c9a3a5e1105de8a2, both pushed:
   - b06bbbba5af7f8910f87b18d76e9d7e5ab3ca43e appends ADR-022's `## Note 2026-11-05` and changes nothing above it. The custodian checked its bytes by script against item 3 of the directive Amendment 18 names, and its italic line against ADR-026's;
   - 1e4a7b6fca29bc59866182719edcc67461ec7553 holds the rest of item 1: `store::OPEN_LOCK` removed, the folder picker moved beside `pickFile` and recorded, its two test cases, and the reports' words.
   - The two commits touch 14 files, each one named in Amendment 18 item 1.
   - The report gives the checks at the head: fmt clean; clippy warn-only with the 8 distinct warnings that the reviewer counted at 791e7e9e; the workspace tests at 1070 passed, 0 failed, 66 ignored; `npm run verify` at 111 files and 1455 tests; the scripts suites at 598; verify-cites and verify-test-claims passing. It also gives the two mutations of Amendment 18, each observed at its assertion.
2. **Size (class 8).** At B = e3fb4a97ebef726f77a5e2609b8fada32a6b1208, the step stands at 75 files and 7,328 lines.
   - The files are within their 77.
   - The lines stay over their 4,790, and nothing is trimmed.
   - The shell tests group is now at 421, over its 380.
   - The ADR text is at 51 of its 80, and the records at 51 of their 120.
3. **For the gates.**
   - The report discloses two things written beyond Amendment 18's names:
     - one sentence in `pickProjectFolder`'s doc comment naming Amendment 18;
     - a second import line in `skp/dialog.test.ts`, so that no existing line there is edited.
   - The report also notices, and leaves unchanged, two counts that W5 did not list:
     - `console/surfaceRegistry.ts`'s sentence on what "A seventh command changes";
     - the name `expectedSix` in `console/surfaceCompleteness.test.ts`.
   - Its departures, as the transcript holds them:
     - the cargo environment was exported between `cd` and the hold;
     - the suites ran on the working tree that was then committed, unchanged;
     - one Edit was refused for a file not yet read, then made after the read;
     - one Monitor call was refused as no such tool.
   - Not disclosed by the report: part of the words script was written by a shell heredoc, which the brief forbade, and the new code was appended to `skp/dialog.ts` and `skp/dialog.test.ts` by shell heredoc. The transcript holds each one.
   - No call was a Guardian refusal. Clippy, the workspace tests and `npm run verify` each ran inside a shared hold; `cargo fmt --check` and the two single-test mutation runs ran outside one.
4. **Amendment 18 item 3.** `KnownFolders::from_bytes`'s consumer, step 2's reopen under M1, and its gate, K-O10, are named in the node's PLAN summary in this filing. The PR body names them at its next edit.
5. **Next.** The PR body; then gate 1's second attempt, scoped to Amendment 18; then the suites at R2's head, alone on the machine. C-2 and C1 wait for the human (Amendment 18 item 2).

Nothing above is edited.

## Amendment 20 — C-2 (A): `save_project`'s reply gains `project_relative`, the resolver's judgment as closed values; S18 from it; one end-to-end test from the real shape (class 9, declared before its code)

*Drafted by the architect for the custodian. References only. Nothing below is a quotation. The new words in item 3 are the architect's, not the human's. The sources are the ruling at `state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:9` @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:e814f165256d91530ea864074025fd716122bd3489a73ec80cf35cb5998f70e6, C-2 in `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-architect.md`, and Amendment 18 item 2. Branch code is named by path and item at 1e4a7b6fca29bc59866182719edcc67461ec7553, with no line and no hash.*

1. **The member, on the wire.**
   - The reply becomes `{project, history_mark, project_relative}`.
   - `project_relative` is always present. It is never null, and it is one of four closed strings: `carried`, `outside`, `no-canonical-spelling` or `through-link`. It holds no free text and no path.
   - `carried`: the file carries a `project-relative` locator beside the `machine-recorded` one.
   - Each of the other three values: the file carries the `machine-recorded` locator only, and the value names which of §2.5's three conditions failed. The save is not refused (§2.3, carrying rule).
2. **The types.**
   - **Rust,** `protocol/skp/src/v0/commands.rs`:
     - `pub enum ProjectRelativeLocator { Carried, Outside, NoCanonicalSpelling, ThroughLink }`, with `#[serde(rename_all = "kebab-case")]` and the derives of `HistoryMarkState`;
     - `SaveProjectResponse` gains `pub project_relative: ProjectRelativeLocator` after `history_mark`;
     - `deny_unknown_fields` stays, and there is no `#[serde(default)]`, so a reply without the member is refused.
     - The precedent is `CoverageState` in the same file on main: closed, kebab-case, no fallback.
   - **TypeScript,** `frontends/shell/src/skp/types.ts`: `ProjectRelativeLocator` as the union of the four strings, and `SaveProjectResponse.project_relative: ProjectRelativeLocator`.
   - **Where the judgment is made:** `resolver::judge` (`kernel/src/project/resolver.rs`), called once by `Projects::save`, which returns it as `Saved::carried`.
   - **How it reaches the reply:** `Projects::save_project` (`kernel/src/project/mod.rs`) maps `saved.carried` through one new private function. It is one exhaustive `match` with no wildcard arm:
     - `Carried::ProjectRelative(_)` → `Carried` (the path is dropped);
     - `MachineRecordedOnly(Why::Outside)` → `Outside`;
     - `MachineRecordedOnly(Why::NoCanonicalSpelling)` → `NoCanonicalSpelling`;
     - `MachineRecordedOnly(Why::ThroughLink)` → `ThroughLink`.
     A new `Why` is then a compile error until it is mapped.
   - `Carried`, `Why` and `Saved::carried` thereby gain their product caller, which closes C-2's caller-rule half. No `pub` item is added in the kernel.
   - `skp/client.ts`'s `saveProject` is unchanged: it inspects nothing.
3. **The words** (the architect's, not the human's). The worker applies them. The gate checks each clause against `judge` and the `Why` docs at R3's head.
   - **`ProjectRelativeLocator`'s doc:** What the project file carries for the data beside its `machine-recorded` locator, as the kernel judged it at this save (ADR-036 §5; SKP-V0.md §11.2). `carried`: a `project-relative` locator too. `outside`: the data or the folder could not be resolved at the save, or the data is not under the folder. `no-canonical-spelling`: the data is inside the folder, and its path has no canonical spelling on this machine. `through-link`: the data is inside the folder, and the path it was opened by does not reach it from the folder without a link. In each of the last three the file carries the `machine-recorded` locator only. Closed, kebab-case, no fallback; no path crosses.
   - **`SaveProjectResponse`'s doc** gains one sentence: `project_relative` is the resolver's judgment at this save ([`ProjectRelativeLocator`]).
   - **SKP-V0.md §11.2:**
     - the shape line's response becomes `{ project, history_mark, project_relative }`;
     - the block gains the definition line `project_relative = "carried" | "outside" | "no-canonical-spelling" | "through-link"`;
     - a bullet is added after `history_mark`'s: **`project_relative`** says what the project file carries for the data beside its `machine-recorded` locator, as the kernel judged it at this save (ADR-036 §5), with the four meanings above, each in one clause; the save is not refused; no path crosses.
   - **SKP-V0.md §8, the `skp/0.13` entry:**
     - its first bullet's response shape becomes `{project, history_mark, project_relative}`;
     - its Mechanics sentence gains one clause: `project_relative` joined the response in a second commit on the branch, under the same literal, before the version reached main (this amendment).
   - **The version.** The literal stays `skp/0.13`, and no fixture is renumbered. This is the second wire commit on the branch under `skp/0.13`, and main sees `skp/0.13` once, at #307's merge (the ruling).
   - §2.2's Response line stays as written. It is superseded by item 1 here.
4. **S18.**
   - It is shown for `no-canonical-spelling` only (§2.3, carrying rule, last bullet; §2.12 S18; OPEN-4 (A)). `outside` and `through-link` show no notice (OPEN-20-1).
   - It is a P6 placeholder with the id S18: an exported constant in `frontends/shell/src/project/saveProject.ts` beside S3 to S7, marked as the shell marks placeholders. It states only §2.12's S18 entry. The text is the worker's, not the human's.
   - **Its path:**
     1. the kernel's `Projects::save_project`;
     2. the src-tauri `save_project` binding, unchanged;
     3. `skp/client.ts`'s `saveProject`, unchanged;
     4. `createProjectSaver().save`, which returns S3, then S5 when `withheld`, then S18 when `no-canonical-spelling`, then S6 when a selection stands;
     5. App's save notices, unchanged.
5. **Tests**, in §4's form. Each mutation is observed under §4's rule.

   | Test | Mutation |
   |---|---|
   | E-SAVE, three new steps in `frontends/shell/e2e/project.mjs`, after SECOND-SAVE. **INSIDE-OPEN:** the suite's fixture is copied into a third `mkdtempSync` folder, under a name that holds U+007F (ADR-036 §5's canonical form refuses it, and Windows allows it), and opened by `openPath`. **INSIDE-SAVE:** `e2eSaveProjectToFolder` into that folder answers `asked`. **NOTICE-S18:** the page's save notices hold S18's text once, read by the driver from S18's constant in `saveProject.ts` by its name; the file's dataset entry holds the `machine-recorded` locator only. Real shape, from `judge` to the reply to the notice, with no mock. The third folder joins `dropFolders`. | m-s18: in the kernel's map, `NoCanonicalSpelling` → `Outside`. Expected: exit 1, failing at NOTICE-S18. Needs a rebuilt app, by THE MACHINE paragraph. |
   | K-S14 `the_save_reply_names_the_resolvers_judgment_carried_outside_no_canonical_spelling_or_through_link` (`kernel/tests/project_save_skp.rs`, from `SkpHost::open_dataset` through `Projects::save_project`). Four cases, each checking the reply's `project_relative`: F1 inside the folder; F2 outside it; F3 through a junction (Windows) or a symlink (Linux); inside the folder under a name holding U+007F. | `ThroughLink` → `Outside` in the map. |
   | P-U3 `the_project_relative_member_is_one_of_four_closed_values_and_is_required` (`commands.rs`, `mod tests`): the four kebab-case strings serialize and round-trip; a fifth string is refused; a reply without the member is refused. | `rename_all = "snake_case"` on the enum. |
   | SH-9 `a reply naming no canonical spelling shows S18 after the saved notice, and no other judgment shows it` (`project/saveProject.test.ts`). | S18's condition becomes `!== "carried"`. |

   - **Edited, all of them this piece's own text, not at B, so not I3:**
     - `protocol/skp/tests/data/v0-save_project-response.json` and `protocol/skp/tests/conformance/fixtures/responses-accept.json` gain the member;
     - the mocks in `App.save.test.tsx` and `project/saveProject.test.ts` gain `project_relative`;
     - any kernel test that builds or compares a whole `SaveProjectResponse` gains the member. The worker lists each one.
   - **Stop:** if the app or the engine refuses to open the U+007F name, the worker stops and reports it as I1. No other name is substituted without an amendment.
6. **Files and groups** (§2.11, step 1). None is new.
   - Protocol product: `protocol/skp/src/v0/commands.rs`, `protocol/skp/SKP-V0.md`.
   - Fixtures and protocol tests: the two fixtures in item 5.
   - Kernel product: `kernel/src/project/mod.rs`.
   - Kernel tests: `kernel/tests/project_save_skp.rs`.
   - Shell product: `frontends/shell/src/skp/types.ts`, `frontends/shell/src/project/saveProject.ts`.
   - Shell tests: `frontends/shell/src/project/saveProject.test.ts`, `frontends/shell/src/App.save.test.tsx`.
   - e2e: `frontends/shell/e2e/project.mjs`, `frontends/shell/e2e/README.md` (E-SAVE's entry gains its three steps).
   - **One commit,** R3's first (Amendment 22).
7. **Reuse.** `tools/reuse.mjs` has no prior art for the words the custodian ran, at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. The shape follows the in-repo precedent named in item 2.

Nothing above is edited.

## Amendment 21 — C1 (a): a save whose session record another project of this run holds writes no mark there and replies `withheld` (class 5); its kernel test; the KNOWN-LIMITATIONS sentence from the built code (class 9 for its item); the gate's question on the second open's steps; declared before its code

*Drafted by the architect for the custodian. References only. Nothing below is a quotation. The new words in item 2 are the architect's, not the human's. The sources are the ruling at `state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:11` @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:5084133e9e0cf26239ddf7edfb1ee32b41e5bf6f3e167a5ac579d7ca1f556a59, C1 in `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-reviewer.md`, and Amendment 18 item 2. Branch code is named by path and item at 1e4a7b6fca29bc59866182719edcc67461ec7553.*

1. **The behaviour, and where it is decided.**
   - **The decision.** `StepRecorder::mark_saved_here` (`kernel/src/session_history.rs`) takes the saving project's identity. Under the records lock it already takes, if the record `find` returns is held by a project other than the saving one, it writes nothing and returns a new `SavedHere` variant, `HeldByAnotherProject`.
   - **The reply.** `Projects::history` (`kernel/src/project/mod.rs`) passes the identity, and maps that variant to a new `Withheld::RecordHeldByAnotherProject`. The reply is then `history_mark: "withheld"`. The wire values are unchanged.
   - `adopt_project` is unchanged: it already does nothing when a project holds the record.
   - **Scope.** The ruling names the first save. Whether a later save of the same open does the same is OPEN-21-1, a red line. This commit is built on the human's answer, and the predicate above is the build under option (b).
   - **The doc sentences this change would make untrue** are brought current in the same commit, and the gate checks each:
     - `mod.rs`'s module doc, on `Projects::save`;
     - `Projects::save`'s doc, its last bullet;
     - `Withheld`'s doc;
     - `SavedHere`'s doc;
     - `mark_saved_here`'s doc;
     - SKP-V0.md §11.3, the "Every save" bullet.
2. **The reason, in words** (the architect's, not the human's). The gate checks each clause against the built code.
   - **`HistoryMarkState`'s doc in `commands.rs`:** Whether the session history took the `saved-here` mark. The project file was written in both cases; `withheld` says that the history holds no recorded step for the dataset, that the history's record for the dataset's file belongs to another project this run has saved, that the recorded steps do not reach the saved workspace, or that the history could not take the record move or the line.
   - **SKP-V0.md §11.2, `history_mark`'s last sentence:** `withheld` means the history holds no recorded step for the dataset, the history's record for the dataset's file belongs to another project this run has saved, the recorded steps do not reach the saved workspace, or the history could not take the record move or the line.
   - **SKP-V0.md §11.3, the "Every save" bullet's last sentence:** Only then does the history take its moves: the first save's record move, unless another project this run has saved holds the record, and a `saved-here` mark when the recorded steps reach the workspace and no other project holds the record.
   - **Under OPEN-21-1 (a)**, each "belongs to another project this run has saved" clause adds "at this project's first save".
3. **The kernel test,** in the reviewer's shape as the ruling gives it.

   | Test | Mutation |
   |---|---|
   | K-S15 `a_second_open_of_one_file_saved_to_another_folder_withholds_its_mark_and_leaves_the_first_record_unchanged` (`kernel/tests/project_save_skp.rs`, through `SkpHost::open_dataset`, `record_step` and `Projects::save_project`). Open F, record a step, save to folder 1 (project A). Close F, open F again, record a step. Read A's record bytes. Save to folder 2 (project B). Assert that B's reply is `withheld`, that B's identity is not A's, and that A's record bytes are equal before and after B's save. Under OPEN-21-1 (b) only: a second save of B, with `folder` null, is also `withheld`, and A's bytes are still equal. | The project check in `mark_saved_here` removed. Expected: a failure at B's reply, which reads `written`. |

4. **The KNOWN-LIMITATIONS sentence.**
   - The worker writes it from the built code, with the file's DRAFT mark. Its comment names the code by path at R3's commit, with no hash.
   - The gate checks it clause by clause, and the PR body carries it to the human at the click. No wording is drafted here.
   - **Its place** (OPEN-21-2, recommendation taken): its own item, at the next free number at R3's base.
     - This is class 9 against §2.11's records group, which names one item for step 1.
     - `kernel/README.md`'s owner's-index line on declared limits names it beside item 62.
5. **The gate's question.** The ruling asks whether the second open's recorded steps are appended to A's record before any save. The gate answers it twice:
   - **By reading,** at R3's head:
     - `StepRecorder::record_step`'s match of a record: is it on path and claims only, or on the project too?
     - whether `close_dataset` reaches the recorder.
   - **By observation.** The reviewer adds one temporary assertion to K-S15: A's record bytes after A's save equal A's bytes just before B's save. The reviewer runs K-S15, records the pass or the failure by name with its commit, and reverts the assertion. Nothing of it lands.
   - **If they are appended,** the custodian proposes the S3 node, to be settled before lineage is written or recovery is offered, and a later amendment to this form says so. R3 builds no code for it. "The S3 node" is the ruling's name; §2.12's S3 placeholder is a different thing.
6. **Files and groups.** None is new.
   - Kernel product: `kernel/src/session_history.rs`, `kernel/src/project/mod.rs`.
   - Kernel tests: `kernel/tests/project_save_skp.rs`.
   - Protocol product, docs only: `protocol/skp/src/v0/commands.rs`, `protocol/skp/SKP-V0.md`.
   - Records: `KNOWN-LIMITATIONS.md` (the new item), `kernel/README.md`.
   - **Its own commit,** R3's second (Amendment 22).
7. **Qualified, not edited.**
   - §2.3's "First save and the session record" stands as written, and item 1 qualifies it for the case item 1 names.
   - ADR-036 Amendment 1 item 5 is the subject of OPEN-21-3.

Nothing above is edited.

## Amendment 22 — R3, the correction round (class 1): Amendment 20, Amendment 21 and the attempt-2 words, in three commits; size, mutations, and gate 1's second attempt's scope; declared before its code

*Drafted by the architect for the custodian. References only. Nothing below is a quotation. The sources are Amendments 20 and 21; D-8 and D-9 in `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-architect-attempt-2.md`; DOC-1 to DOC-3 in `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-reviewer-attempt-2.md`; and the ruling at `state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:15` @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:f93a22f8ae0ce4c8c01fd35c1508623784aba67dedf36e77ef776aca2beb2b37.*

1. **The commits,** on 1e4a7b6fca29bc59866182719edcc67461ec7553, after Amendments 20 to 22 are on main.
   - **R3-1:** Amendment 20.
   - **R3-2:** Amendment 21, built on the human's answer to OPEN-21-1.
   - **R3-3:** the attempt-2 words, each the report's own and none the human's. No re-gate is needed for them, and the PR body lists them.
     - D-8 and DOC-1 name one edit, in `frontends/shell/src/console/surfaceRegistry.ts`, applied once.
     - D-9 and DOC-3 name one edit, in `frontends/shell/src/console/surfaceCompleteness.test.ts`: the identifier, at both places. It is class 3 by named exception, because it is test text.
     - DOC-2 is one edit, in `frontends/shell/src/skp/client.ts`.
   - If OPEN-21-1 is not answered at dispatch, R3-1 and R3-3 are built and the worker stops before R3-2. The order is then recorded as class 1.
2. **Files, all of them already in the step's diff** (so the files stay at 75 of 77):
   - `protocol/skp/src/v0/commands.rs` (under `protocol/`)
   - `protocol/skp/SKP-V0.md` (under `protocol/`)
   - `protocol/skp/tests/data/v0-save_project-response.json` (under `protocol/`)
   - `protocol/skp/tests/conformance/fixtures/responses-accept.json` (under `protocol/`)
   - `kernel/src/project/mod.rs`
   - `kernel/src/session_history.rs`
   - `kernel/tests/project_save_skp.rs`
   - `frontends/shell/src/skp/types.ts`
   - `frontends/shell/src/skp/client.ts`
   - `frontends/shell/src/project/saveProject.ts`
   - `frontends/shell/src/project/saveProject.test.ts`
   - `frontends/shell/src/App.save.test.tsx`
   - `frontends/shell/src/console/surfaceRegistry.ts`
   - `frontends/shell/src/console/surfaceCompleteness.test.ts`
   - `frontends/shell/e2e/project.mjs`
   - `frontends/shell/e2e/README.md`
   - `KNOWN-LIMITATIONS.md` (the new item only)
   - `kernel/README.md`
3. **The expected size,** against §2.11 at B = e3fb4a97ebef726f77a5e2609b8fada32a6b1208. These are estimates, not counts. R3's report counts by §2.11's command, and each group past its ceiling gets a class 8 row in the closing amendment. Nothing is trimmed.

   | Group | At 1e4a7b6f (gate 1, attempt 2, reviewer, check 1) | R3, estimated | Ceiling |
   |---|---|---|---|
   | protocol product | 408 | about +60 | 320 (class 8) |
   | fixtures, protocol tests and literal | 539 | about +4 | 390 (class 8) |
   | kernel product | 3,206 | about +45 | 1,350 (class 8) |
   | kernel tests | 1,547 | about +170 | 1,000 (class 8) |
   | shell product | 328 | about +20 | 380 |
   | shell tests | 421 | about +45 | 380 (class 8) |
   | e2e | 444 | about +90 | 320 (class 8) |
   | records | 51 | about +6 | 120 |
   | **Step** | **7,328 lines, 75 files** | **about +440, no new file** | **4,790 (class 8), 77** |

4. **Mutations**, each observed under §4's rule:
   - m-s18 (E-SAVE);
   - K-S14's;
   - P-U3's;
   - SH-9's;
   - K-S15's.
   - The reviewer also observes M-W5-1 again at R3's head, because R3-3 edits its test file.
   - Amendment 21 item 5's run is an observation of behaviour, not a mutation.
   - No `verify-mutation` run is called an observation.
5. **Gate 1's second attempt, completed.**
   - **The diff:** `git diff 791e7e9edb52328b7c430012c9a3a5e1105de8a2...<R3 head>`, reading R2 (b06bbbba5af7f8910f87b18d76e9d7e5ab3ca43e, 1e4a7b6fca29bc59866182719edcc67461ec7553) and R3 together (the ruling).
   - **Architect:**
     - §8, item by item;
     - the seam rule for shell → `save_project` → `judge` (E-SAVE's new steps) and for history → mark (K-S15);
     - the caller rule (`Carried`, `Why` and `Saved::carried` now have a product caller);
     - Amendments 20 and 21's words, clause by clause, and the new KNOWN-LIMITATIONS item, clause by clause;
     - the OPEN answers as applied;
     - Amendment 21 item 5.
   - **Reviewer:**
     - the mutations in item 4, and Amendment 21 item 5's observation;
     - §2.11, by its command;
     - every hash recomputed;
     - empty lock diffs.
   - **Then the suites, at the final head:** §9's suites and every e2e suite, E-SAVE included, by THE MACHINE paragraph; and green CI.
6. **H1** counts (the ruling, its #307 reviewer H1 paragraph). Amendment 16 item 1 stands, and the PR body names the consumer. Nothing is built for it.
7. **The PR body** gains:
   - S18 in its list of P6 strings;
   - Amendment 21's KNOWN-LIMITATIONS sentence, for the human at the click;
   - the R3-3 words.
8. **Rule (00)** at R3's dispatch is the custodian's, over item 2's paths and this form.
9. **Superseded index:** §2.2's Response line, by Amendment 20 item 1. Nothing else is superseded; §2.3 is qualified by Amendment 21 item 1.

Nothing above is edited.

## Amendment 23 — R3-1 and R3-3 built, R3-2 not yet (class 1, by Amendment 22 item 1); six groups and the step over their ceilings (class 8); written after R3's report was seen, before R3-2

*Written by the custodian. References only: `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-r3-worker-report.md` (sha256 c7b29b543a784a7ad64f3292aa39502aad972f003cc08567e1c364fa9864993e).*

1. **R3-1 and R3-3 built** on 1e4a7b6fca29bc59866182719edcc67461ec7553, both pushed:
   - c57f090be2559aed8b1765d5f7dfe693514d48c5, Amendment 20;
   - 190c6c80788eff296d8ddb998db43c5055d6e820, the attempt-2 words of Amendment 22 item 1.
   - The two commits touch 15 files, each named in Amendment 22 item 2.
   - The report gives four of Amendment 22 item 4's mutations as observed at their assertions: m-s18, K-S14's, P-U3's and SH-9's. K-S15's belongs to R3-2.
2. **The order (class 1).** OPEN-21-1 was not answered at R3's dispatch, so the worker stopped before R3-2, as Amendment 22 item 1 provides. R3-2 is built after the human's answer is recorded as class 5 on main.
3. **Size (class 8).** At B = e3fb4a97ebef726f77a5e2609b8fada32a6b1208 the step stands at 75 files and 7,635 lines. The files are within their 77, and nothing is trimmed. The groups past their ceilings:

   | Group | Lines | Ceiling |
   |---|---|---|
   | protocol product | 478 | 320 |
   | fixtures, protocol tests and literal | 541 | 390 |
   | kernel product | 3,222 | 1,350 |
   | kernel tests | 1,650 | 1,000 |
   | shell tests | 458 | 380 |
   | e2e | 505 | 320 |
   | **Step** | **7,635** | **4,790** |

4. **For the gates.** The report's disclosures, and the departures its transcript holds, are in the consult above: its filing note and the report's own list.
5. **Next.** R3-2 on the answer to OPEN-21-1; then gate 1's second attempt by Amendment 22 item 5.

Nothing above is edited.

## Amendment 24 — OPEN-20-1 (a), OPEN-21-1 (b) and OPEN-21-3 (a), the human's message of 2026-11-11 (21:49Z) (class 5); R3-2 now

*Written by the custodian. References only: `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md` (the file's sha256 1511353c54cbe39c67e37331caa4ed8e3b384f26951491e9ae7f8ce414e7ae68), items 2 to 4. Nothing below is a quotation.*

1. **OPEN-20-1 (a)** (item 2). R3-1 as built at c57f090be2559aed8b1765d5f7dfe693514d48c5 stands: S18 for `no-canonical-spelling` only in step 1, and nothing shown for `outside`. A notice for `through-link` is an OPEN item of step 2's form, where the link's handling at reopen is built, and it goes on the sitting's list.
2. **OPEN-21-1 (b)** (item 3). Every save of an open whose session record another project of this run holds withholds the mark. R3-2 is built under Amendment 21's option (b), K-S15's second save included, and starts now.
3. **OPEN-21-3 (a)** (item 4). No ADR-036 text in step 1. The node for a second open's history, `second-open-history-before-1c-step-3`, is placed before step 3, which depends on it because step 3's recovery offer reads the record. That node decides what a second open's history is and carries ADR-036's note, in the human's words then.
4. Nothing else changes. Amendment 22's R3-2 and gate 1's second attempt stand as declared.

Nothing above is edited.

## Amendment 25 — R3-2 built (class 1, by Amendment 22 item 1 and Amendment 24 item 2); the step and three groups over their ceilings, where R3-2 added (class 8); written after R3-2's report was seen, before gate 1's second attempt is completed

*Written by the custodian. References only: `state/consults/2026-11-11-b2-piece-1c-save-and-reopen-r3-2-worker-report.md` (sha256 92266fffa764842640fa795069bda644f7567245956b7679e7ae980e69519fd9).*

1. **R3-2 built** on 190c6c80788eff296d8ddb998db43c5055d6e820 and pushed: 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6, Amendment 21 under option (b). The commit touches 7 files, each named in Amendment 22 item 2. The report gives K-S15's mutation as observed at its assertion.
2. **Size (class 8).** At B = e3fb4a97ebef726f77a5e2609b8fada32a6b1208 the step stands at 75 files and 7,748 lines, by §2.11's command, recomputed by the custodian. The files are within their 77, and nothing is trimmed. The groups past their ceilings where R3-2 added, by the report's grouping: protocol product 479 (320); kernel product 3,241 (1,350); kernel tests 1,739 (1,000). The other groups Amendment 23 names past their ceilings are unchanged. The step: 7,748 (4,790).
3. **For the gates.** The report's departures, its list, and its reading on Amendment 21 item 5 are in the consult above.
4. **Next.** Gate 1's second attempt, completed, by Amendment 22 item 5, over `git diff 791e7e9edb52328b7c430012c9a3a5e1105de8a2...9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6`.

Nothing above is edited.

## Amendment 26 — R4, the words round (class 1): gate 1's attempt-2-completed words, in one commit; D-17's records (class 1); the code defect D-16 names, carried to step 2's form (class 1); five items for the human; the suites at the final head and the PR body; declared before its code

*Written by the custodian. References only. Nothing below is a quotation: each change's words are the report's own, byte-copied by the worker from the filed report this amendment names. The sources: `state/consults/gates/2026-11-11-b2-piece-1c-save-and-reopen-gate1-architect-attempt-2-completed.md` (sha256 e566a98a5af9a4591320cd6bc78264668baca98d02eeb1502252c2ceffc17cb0) and `state/consults/gates/2026-11-12-b2-piece-1c-save-and-reopen-gate1-reviewer-attempt-2-completed.md` (sha256 68e501ace77909a393a3688fce54255aea791727ef5ed1fb7fe276c10f050871), gate-log rows 723 and 727, both PASS WITH NOTES (WORDS-ONLY) at 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6.*

1. **R4, one commit on 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6, after this amendment is on main.** None of its words is the human's, so no re-gate follows, and the PR body lists them (Amendment 22 item 7's rule).
   - **`KNOWN-LIMITATIONS.md`, item 63** (a DRAFT for the human's sight):
     - its headline and its body's first two sentences: the reviewer's C-1 words, which are the architect's C-6 words with one clause added;
     - its body's Not-covered sentence: the reviewer's DOC-C words;
     - its source comment: `StepRecorder::record_step` added to its list of code, and the case C-6 names for that comment (a failed record move), in the architect's two sentences, with their line cite replaced by the function's name, `history` in `kernel/src/project/mod.rs`, since the comment names its code in words with no hash.
   - **`kernel/src/project/mod.rs`:** D-10's words at its two places in this file; D-11's; D-14's; D-15's.
   - **`protocol/skp/SKP-V0.md`:** D-10's words in §11.3; DOC-A's; D-16's comment after the §11.3 bullet.
   - **`protocol/skp/src/v0/error.rs`:** D-16's comment, at the place D-16 names.
   - **`kernel/tests/no_generation_in_persisted_artifacts.rs`** (test text, class 3 by named exception): the reviewer's E-1 words for its header; D-13's words for its two places.
   - **`frontends/shell/e2e/README.md`:** D-12's words.
   - **`frontends/shell/e2e/project.mjs`** (test text, class 3 by named exception): DOC-B's m-s18 entry, in its header.
   - No other file. All seven are already in the step's diff, so the files stay at 75 of 77.
   - Each place is found by the report's own words for the text it replaces, read at 9e0d4b08; a report's line number is a locator only. A place whose text is not found as the report gives it is a stop, reported alone.
2. **D-17, the records (class 1).** Amendment 21 item 5 asked whether a second open's steps are appended to the first project's record. Both gates answer that they are: the architect by reading (its check 6), the reviewer by observation (its check 5). The node that item asks for is `second-open-history-before-1c-step-3`, placed by the human's message of 2026-11-11 (21:49Z), item 4 (Amendment 24 item 3); no other node is proposed. Item 63's DOC-C sentence states the answer for the human's sight.
3. **The code defect D-16 names (class 1).** It needs a POSIX folder flush that fails after the rename, so it cannot happen in the shipped Windows app; it is not step 1's on Windows. It is carried to step 2's form, which builds the store's lock (§2.7), as a named item with D-16's suggested fix, and it is listed for the human. Item 1's comments name it at the code. No node is placed by this amendment.
4. **For the human, not in R4** (the reviewer's H-1 to H-4; the architect's three):
   - K-S15's shape: the test compares the first record's length, not its bytes, because Windows refuses a read of the record while the recorder holds it (the reviewer's check 5). Whether that meets the ruling is the human's.
   - Item 63, with item 1's words applied, at the click.
   - The independent review's C2 (a save made before any step): ADR-036's text on it is the human's. The architect proposes that it join `second-open-history-before-1c-step-3` or step 3's form; that node's scope is the human's ruling, so the choice waits for the human.
   - D-16's placement, carried by item 3 until the human says otherwise.
   - Amendment 21 item 5 named its node as settled before lineage is written or recovery is offered; the human placed it before step 3. If step 2 writes lineage, whether the node also goes before step 2 is the human's.
5. **Size.** R4's lines count in their groups by §2.11's command; each group past its ceiling gets a class 8 row in the closing amendment. Nothing is trimmed.
6. **Next.** In R4's dispatch, after its commit: the suites at R4's head, by Amendment 22 item 5: §9's suites and every e2e suite, E-SAVE included, by THE MACHINE paragraph, e2e on port 5400 (the ruling of 2026-11-09 holds until the human's word frees 5180). Then R4's report and its closing amendment; green CI; the PR body by the reviewer's DOC-D, R4's words listed; and the PR out of draft, for the human's click.
7. **Rule (00) at R4's dispatch,** over item 1's paths: PR #308 touches ADR-035 only; port-2's branch, built and not merged, touches `KNOWN-LIMITATIONS.md` in its portability levels and item 43, not item 63, and no other file item 1 names; pan-anchor's branch is held and touches `frontends/shell/e2e/pan-anchor.mjs` only; `recentre-crossing-view-displaced-fix` has no code; the reproducer's local branch is done. None touches `protocol/` but R4.
8. **Superseded index:** Amendment 21 item 2's words for §11.3's last sentence, by D-10 (item 1). Nothing else is superseded; item 63's draft is in `KNOWN-LIMITATIONS.md`, not in this form (Amendment 21 item 4 drafted no wording).

Nothing above is edited.

## Amendment 27 — R4 built (class 1, by Amendment 26 item 1); the suites at R4's head, two run again and five drivers run after, by the custodian's briefs (class 1); the step and three groups over their ceilings, where R4 added (class 8); written after R4's and the two suites runs' reports were seen, before the PR leaves draft

*Written by the custodian. References only: `state/consults/2026-11-12-b2-piece-1c-save-and-reopen-r4-worker-report.md` (sha256 a23836a4035e6d548708bb1f6cf9e6afbf7398a146f028a82cb2e0ed5c37702d), `state/consults/2026-11-12-b2-piece-1c-save-and-reopen-r4-suites-rerun-tester-report.md` (sha256 5966ae00cc251ddfe422143155b62a864b7e3c4635430fafc7b067680628673f) and `state/consults/2026-11-12-b2-piece-1c-save-and-reopen-r4-drivers-tester-report.md` (sha256 af653776f077f823e97a4c2c9e4700909400176147ab07a7aa7aadf5ba2b3ce8).*

1. **R4 built** on 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6 and pushed: 708a3d5c38d57c772c66b82e16a4b501e6aca563. The commit touches 7 files, each named in Amendment 26 item 1, and no other. No re-gate follows (Amendment 26 item 1).
2. **The suites at 708a3d5c (Amendment 26 item 6).**
   - In R4's run, the workspace, the src-tauri tests, `npm run verify`, the node tests, 14 of the README's 16 e2e suites (E-SAVE among them) and `source-changed`'s default route pass.
   - `recording` and `table` failed in R4's run because the custodian's brief left out two settings: the waiting shim (the record of 2026-10-24, its finding 5) and `table`'s oracle value (the README's Table spec). Both pass in the second report's run, with those settings, against the fixture whose sha256 the value was taken with.
   - The brief also named only the README's npm scripts, while §9 asks for every e2e suite. The third report runs the five drivers left out: the residency harness exits 0 (read by its exit code only); `source-watch-idle` and `source-changed`'s reopen route pass; `source-changed`'s post route passes with S5d PASS, an outcome the README allows (PR A's record read INCONCLUSIVE there); `pan-anchor.mjs` fails one case, `large: recenter-crossing-A dx=-1200`, with the line the record has held byte for byte since 2026-10-14 (the third report's filing note names the file). #307's one change to `WorkingCanvas.tsx` is the read-only `currentView`. By the brief, that result is recorded as it is and is not a stop.
   - CI is green at the head, verify:plan and verify:quotes among it.
3. **Size (class 8).** At B = e3fb4a97ebef726f77a5e2609b8fada32a6b1208 the step stands at 75 files and 7,785 lines, by §2.11's command, recomputed by the custodian. The files are within their 77, and nothing is trimmed. The groups past their ceilings where R4 added, by the report's grouping: protocol product 484 (320); kernel tests 1,766 (1,000); e2e 510 (320). The other groups Amendments 23 and 25 name past their ceilings are unchanged. The step: 7,785 (4,790).
4. **For the human, at the click:** item 63 with R4's words, and Amendment 26 item 4's five items.
5. **Next.** The PR body by the reviewer's DOC-D, R4's words listed; the PR out of draft, for the human's click.

Nothing above is edited.

## Amendment 28 — the second-open node's rulings, the human's third message of 2026-11-12 (21:15Z), item 5 (class 5); nothing in step 1 changes

*Written by the custodian on 2026-11-12. References only: `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md` (the file's sha256 a664aa4dd54b5479c47423bf78ce3c4c704d7149140a9510f676eb81bde41314), item 5, the file's lines 25 to 29; and the options draft `state/consults/2026-11-12-second-open-history-before-1c-step-3-options-architect-draft.md` (sha256 77e5785aa9e544d09088720f5667bf12b14884c5ce768e806c66bd31d0f964fe). Nothing below is a quotation.*

1. **The rulings (item 5 (a)).** OPEN-N1: O-2, a record per open until a save binds the open to a project, then the project's record. OPEN-N2: (i), the first step after a save made before any step creates the project's record. OPEN-N3: I-b, one dataset identity per open, built with O-2. OPEN-N4: (a), a same-run reopen of a project whose record this run holds is bound at the reopen and continues that record. OPEN-N6: yes, the order in item 5 below.
2. **What they replace (item 5 (b)), class 5.** When `second-open-history-before-1c-step-3` is built, its rulings replace OPEN-21-1 (b) (Amendment 24 item 2) and K-S15's shape (Amendment 21; Amendment 26 item 4, its first bullet). Until then step 1 stands on main as merged. K5's edit is declared in that node's form before its code, as the options draft says.
3. **A save into a project whose record this run already holds (item 5 (c)).** That node's form says what happens. If OPEN-N4 (a) does not cover it, the options go to the human.
4. **OPEN-N5 and ADR-036's note (item 5 (d)).** They are the human's words, written after the code: the worker drafts them from the built code at that node's records commit, and they go to the human clause-checked.
5. **Where it is built (item 5 (e)).** One kernel PR, in slot 2 after the publish approval piece (`publish-approval-columns-line`), before step 2's lineage reader and its protocol bump.
6. **Nothing else changes** in this form's steps, ceilings or gates.

Nothing above is edited.

## Amendment 29 — K-S15 renamed by second-open-history-before-1c-step-3 (class 1, a reference and its hash only)

1. governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1668 @ 8c693657801fd4168b078a601724bdacd9f479b8 sha256:364f456d2854f45d61bb45f8d9f21dba65d41a8237dfefc83314c9fc78e5d262 is superseded: the test it names was renamed by second-open-history-before-1c-step-3 to `a_second_open_of_one_file_saved_to_another_folder_writes_its_own_mark_and_leaves_the_first_record_unchanged`, in kernel/tests/project_save_skp.rs.

## Amendment 30 — the reopen's P1 declared before its code, as two parts, P1a and P1b (ADV-2026-11-16-10, R1 and R2; ADV-2026-11-16-16): the rulings onto the form (class 5); D2's rename (class 1); the O-items and the #307 review's two named items; for each part, its scope, ceilings, tests, mutations, pre-committed producers, stops and gates; test files and a reader bound outside §2.11 and §7 (class 9)

*Drafted by the architect for the custodian, read only, at main 2a8907b8786dd0dc714213fa21fdb41cd6ada52c, and appended by the custodian's script. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is the architect's recommendation, it says so. Rulings are cited by id, or by file, and item. Code is cited by path and symbol.*

1. **The rulings onto the form (class 5, D1).**
   - The human's directive of 2026-10-23 (`state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`, its `Piece 1c:` line): OPEN-S2-1 (c), S2-2 (a), S2-3 (a) and S2-4 (a).
   - The human's message of 2026-11-12, 13:07Z (`state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md`): item 3 (a), (d) and (e), and item 5 (b).
   - ADV-2026-11-16-10 (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-10-the-reopen-r1-to-r4-five-pieces-p3-split-producers-ahead-pre-committed-a-later-runs-reopen-does-not-bind-adr-036-amendment-3.md`), items 1 to 6.
   - ADV-2026-11-16-16, items 1 to 4. It is filed in `state/directives/` by the custodian no later than this amendment's commit.
   - Step 2 is P1a, P1b, P2, P3a, P3b, P4 and P5 (ADV-2026-11-16-10 R1 (a); ADV-2026-11-16-16 item 1). This amendment declares P1a and P1b. Each later piece is declared in its own amendment before its code.

2. **D2 (class 1).** The 2026-10-23 draft's conditional K-S14 (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md`, its conditional row) collides with Amendment 20's K-S14.
   - It is renamed **K-O16**, the next id after the draft's K-O12 to K-O15.
   - It is P3a's, declared there under R3.

3. **The O-items** (the architect's recommendations).
   - **O-7, K-S15's length check stays.** P1b's lock is on `open.lock` in the identity's machine folder, not on the history. The recorder keeps its own exclusive lock on `history.jsonl` (`kernel/src/session_history.rs`, the `try_lock` calls in its record writers), and Windows refuses a read of a locked file. So the record still cannot be read while the recorder holds it (item 3 (a) of 2026-11-12). This needs no code.
   - **O-8, D-16 is in P1b**, the first pull request to touch the store (ADV-2026-11-16-16 item 1 (c); item 3 (d) of 2026-11-12).
     - `Staged::commit` in `kernel/src/project/store.rs` becomes a call of a private `commit_with(flush)`, with `sync_folder` passed as `flush`.
     - A flush that fails after a successful rename no longer refuses the save.
     - The failure is written to standard error by `eprintln!` as an engine fact only: that the folder flush failed after the rename, and the error kind. It gives no path, no handle and no duration, as in `kernel/src/skp.rs`.
   - **O-21.**
     - C-7's resolver unit test is P1a's (T5).
     - C-7's restated K-R3 is P3a's (R1 (g)).
     - N-10 lands in P3a, where `check_inside` gets its product caller.
   - **Not P1a's or P1b's:**
     - O-6 is P3a's.
     - O-9, O-18 and O-19 are P4's, and go to the advisor.
     - O-10 to O-17 and O-20 are P3a's, P3b's or P4's, as the packet lists them.
     - C-6's withdrawal of `project_target_outside_folder` (§2.2), and the code for a non-directory intermediate or a non-regular final, are P3b's (R1 (e)).

4. **The #307 review's two notes: named items of step 2 (class 5, item 5 (b) of 2026-11-12).** The source is `state/drafts/2026-11-11-platform-independent-review-pr-307.md`, its final report's Notes. It is a reading, cited as evidence. ADV-2026-11-16-16 items 2 and 3 place both notes.
   - **(a) The path-length bound: P1b's** (ADV-2026-11-16-16 item 2).
     - **The defect at main.** `KnownFolders::to_bytes` and `locations_json` (in `kernel/src/project/mod.rs`) write path strings that their readers can refuse. The readers allow 4,096 decoded bytes per string under `FOLDERS_LIMITS` (`kernel/src/project/strict_json.rs`, the reader's `string`) and 2,097,152 bytes per document. `locations_json` also writes a path that is not valid Unicode, altered, by `to_string_lossy`.
     - **What P1b changes.** Each writer refuses what its reader refuses:
       - `to_bytes` refuses a path over the string bound and a document over the byte bound;
       - `locations_json` moves to the store as `locations_to_bytes` under `LOCATIONS_LIMITS`, refusing a path that is not valid Unicode or is over the string bound;
       - `Projects::save` builds both documents before its first machine-store write, so a refusal writes nothing.
     - The refusal is the existing `SaveFailure::MachineRecordRefused`, mapped by `skp_error_of` to `skp.project_file_refused` with the file's name as `path`, a case SKP-V0 §11.4's row already covers. Nothing changes on the wire.
     - **With these bounds, P1b reads back everything either machine-store writer writes.** T12 and T13 prove it at the bound; T11 and T14 prove it on the save path.
     - **What the user is told changes (ADV-2026-11-16-16 item 2 (a)).** A save that would have written a path that is not valid Unicode, altered, is now refused. So is a save whose folder path or data path is over 4,096 bytes; at main that save was written and its machine file would later be refused. Both now show the shell's existing message for `project_file_refused`; no string changes. Both gates of P1b read this change. P5's drafter says whether the limitations owe a line for it.
     - **The record's own `locations.json` writer** (`kernel/src/session_history.rs`, `create`) has the same unbounded, altering writer. It is a declared item of step 3, which builds its reader (§2.6). It is to be carried onto step 3's node, by name, when step 3 is split off (ADV-2026-11-16-16 item 2 (b)). It is not P1a's, P1b's or P2's.
     - At the reopen, P3a writes `folders.json` through `to_bytes`, maps a refusal there to a code, and P3b names that code (R1 (e)).
   - **(b) The stale temp: P3a's and P3b's** (ADV-2026-11-16-16 item 3).
     - **The defect at main.** `remove_stale_temps` in `kernel/src/project/store.rs` removes another process's staged temp, and that process's save is then refused as `RenameKeepsFailing`.
     - **The fix.** P3a takes `ProjectLock::try_lock` in `Projects::save` at a first save, before staging. P3b holds that lock in the binding until `close_dataset` (§2.7; §2.2's `open.lock`, held while the project is open). P3a's amendment declares this before its code.
     - **Residual, named.** Two first saves of different identities into one empty folder, between the folder check and the rename, are not excluded. `remove_stale_temps`'s doc names this in P3a.
     - If this reads as beyond the form's step 3, it is class 9 and goes to the advisor with P3's packet.
     - P1a and P1b do not change `remove_stale_temps`.

5. **P1a: the resolver.** Branch `cut/b2-piece-1c-p1a`, worktree `C:/dev/wt/1c-p1a`, build folder `D:/wt-targets/1c-p1a`, cut from main.
   - **(a) Files and regions.**
     - **`kernel/src/project/resolver.rs`:** a new `pub fn check_inside(folder, at)` (§2.5), its error type, and a new `mod tests`.
       - It runs `in_canonical_form` on `at` first. It then walks from the folder one segment at a time, by `symlink_metadata` only, and opens no file:
         - a link or junction is refused;
         - a missing segment is refused as unresolvable;
         - a non-directory intermediate or a non-regular final is refused by name;
         - otherwise it returns the engine path, in the `\\?\` form on Windows (H4).
       - A cloud placeholder opens (§2.5).
       - It has no wire code. `judge` is unchanged.
     - **`kernel/src/dataset_ref.rs`:** `in_canonical_form` becomes `pub(crate)`. Nothing else.
     - **`kernel/tests/project_resolver.rs`:** new, on §2.11's list. It holds its own link maker, a junction on Windows or a symlink elsewhere, with `cfg` in test code only (§2.9).
   - **(b) Ceilings by §2.11's groups.**
     - Kernel product 135: `resolver.rs` 130, `dataset_ref.rs` 5.
     - Kernel tests 200: `project_resolver.rs`.
     - P1a: 335 lines and 3 files.
     - An overrun is class 8 in P1a's closing amendment. Neither §2.11 nor §7 is edited.
   - **(c) Tests and mutations.** Each fails at main because `check_inside` does not exist there, which is a compile failure. Each mutation is observed by the round-25 rule; a `verify-mutation` run is not called an observation.

     | Id | Test | File | Asserts | Mutation |
     |---|---|---|---|---|
     | T1 | `check_inside_refuses_a_link_below_the_folder_naming_its_segment` | `kernel/tests/project_resolver.rs` | a junction on Windows, or a symlink elsewhere, as an intermediate and as the final, is refused as through a link, naming the segment | the link check skipped |
     | T2 | `check_inside_refuses_a_missing_segment_as_unresolvable` | same | a missing intermediate and a missing final are each refused as unresolvable, naming the segment | a missing segment treated as a directory |
     | T3 | `check_inside_refuses_a_final_that_is_not_a_regular_file_or_an_intermediate_that_is_not_a_folder` | same | each is refused by name | the kind check skipped |
     | T4 | `check_inside_returns_the_engine_path_for_data_reached_without_a_link` | same | the canonical folder joined with `at`, in the `\\?\` form on Windows (checked at run time, with no `cfg` in product code) | the folder not canonicalized |
     | T5 | `check_inside_refuses_a_non_canonical_at_before_any_file_is_read` | `resolver.rs`, `mod tests` (C-7) | a device name, a trailing dot and a `..` segment are refused, with a folder that does not exist | `in_canonical_form` not called |

     - The cloud placeholder case is not tested, since a test cannot make one. The closing amendment names this gap.
   - **(d) Pre-committed producer (R2; ADV-2026-11-16-16 item 1 (d)).**
     - `resolver::check_inside` and its error type. Consumer: `Projects::open_project`'s data step, in P3a.
     - The seam's end-to-end tests:
       - K-R1, K-R2 and K-R4 (§4);
       - K-R3 as C-7 restates it, working name `a_device_name_or_trailing_dot_target_is_refused_at_read_before_any_open`, asserting `project_file_refused` at the locator's `at` with nothing opened;
       - then E-REOPEN.
     - They are named in P1a's PR body and in the node's plan summary.
     - Any other `pub` item in P1a is a gate finding (R2 (d)).
   - **(e) Stops.** The worker stops and reports alone when any of these happens:
     1. A file outside 5 (a) is needed. `protocol/` is among them: P1a changes nothing there.
     2. A `pub` item other than 5 (d)'s is needed.
     3. An existing test needs an edit (I3), or a dependency or a lock file changes (I6).
     4. A test passes at its base before its code, or a mutation does not fail its test.
     5. A case a test cannot build. That is a stop, not a skip.
   - **(f) Gates.**
     - Full class, both gates, the architect and the reviewer (ADV-2026-11-16-16 item 1 (a)).
     - The full suites are CI's: the workspace on Windows, Ubuntu and macOS, plus fmt and clippy. CI runs the junction case on Windows and the symlink case elsewhere.
     - On the laptop, in turns with P1b and P2 by THE MACHINE paragraph, P1a keeps at its final candidate:
       - the focused `project_resolver` test target and the resolver's unit tests;
       - every mutation of 5 (c) observed;
       - §2.11's command;
       - empty lock-file diffs.
     - No e2e and no app-window run: no shipped path reaches `check_inside` until P3a.

6. **P1b: the store and the lock, with D-16 and the writers' bounds.** Branch `cut/b2-piece-1c-p1b`, worktree `C:/dev/wt/1c-p1b`, build folder `D:/wt-targets/1c-p1b`, cut from main.
   - **(a) Files and regions.**
     - **`kernel/src/project/store.rs`:**
       - `pub const OPEN_LOCK` (Amendment 18 item 1).
       - `pub struct ProjectLock`, `pub fn ProjectLock::try_lock(root, project)` and `pub enum LockRefused { Held, Io }`. It creates the identity's folder and `open.lock` if they are absent, never truncates or writes the file, and takes `File::try_lock`. Drop frees the lock.
       - `pub fn KnownFolders::with_same` and `pub struct KnownFoldersFull { count }`. It is pure; a folder already known returns the list unchanged; at `MAX_KNOWN_FOLDERS`, with `first` counted, it is refused and nothing is dropped (M2).
       - `pub fn KnownFolders::moved_to`. It is pure; the new folder becomes `first` and leaves `same`; the old `first` is forgotten (S2-2 (a)).
       - `KnownFolders::to_bytes`: the bounds of item 4 (a).
       - `pub fn locations_to_bytes(uri, at)`: item 4 (a).
       - `pub fn read_locations(bytes)` and `pub struct Location { dataset, path }`. Any other shape is refused by name, with `file` = `LOCATIONS`.
       - A private `LOCATIONS_LIMITS` (class 9, outside §7), with `FOLDERS_LIMITS`'s values.
       - `Staged::commit` and `commit_with` (D-16), with the docs of `Staged::commit` and `sync_folder` brought to the built behaviour (D4).
       - A new `mod tests`.
     - **`kernel/src/project/mod.rs`,** two regions: `locations_json` is removed; in `Projects::save`, the machine-store block builds both documents before `create_dir_all` and calls `locations_to_bytes`.
     - **`protocol/skp/src/v0/error.rs`:** the `//` comment above `project_file_unwritable` that names the POSIX refusal after the rename is removed.
     - **`protocol/skp/SKP-V0.md`:** §11.3's HTML comment with the same text is removed.
     - **`kernel/tests/project_lock_crash.rs`:** new, on §2.11's list.
     - **`kernel/tests/project_store.rs`:** new. Class 9, counted in kernel tests by Amendment 9 item 3.
     - **`kernel/tests/project_save.rs`:** class 9, by the same rule. T11 and T14 are appended, using its rig, and one bullet naming them is appended to its module doc. No existing test or line of it changes.
   - **(b) Ceilings by §2.11's groups.**
     - Kernel product 340: `store.rs` 300, `mod.rs` 40.
     - Protocol 10: the two comments.
     - Kernel tests 360: `project_lock_crash.rs` 130, `project_store.rs` 140, `project_save.rs` 90.
     - P1b: 710 lines and 7 files.
     - An overrun is class 8 in P1b's closing amendment. Neither §2.11 nor §7 is edited.
   - **(c) Tests and mutations.** Each fails at main by a missing symbol, which is a compile failure. T7, T12 and T14 also fail against main's behaviour. Mutations are observed by the round-25 rule.

     | Id | Test | File | Asserts | Mutation |
     |---|---|---|---|---|
     | T6 | `the_project_lock_is_refused_while_held_in_this_process_and_in_another_and_freed_by_a_crash` | `kernel/tests/project_lock_crash.rs` | `Held` in the same process, and taken after drop; `Held` while a child process (the `project_save_crash.rs` pattern) holds it; taken after the child aborts; `open.lock` stays empty | (a) no lock taken; (b) a `create_new` marker file in place of the lock |
     | T7 | `a_folder_flush_failing_after_the_rename_keeps_the_save` | `store.rs`, `mod tests` | with a failing flush, `commit_with` is `Ok`, `project.spatial` holds the new bytes, and no temp is left | the flush error returned |
     | T8 | `a_same_answer_past_256_known_folders_is_refused_and_the_folders_are_unchanged` | `kernel/tests/project_store.rs` | 255 known folders plus one gives 256; at 256 the result is `KnownFoldersFull` with count 256, and `to_bytes` of the list is unchanged | the oldest `same` entry dropped |
     | T9 | `a_move_makes_this_folder_first_and_forgets_the_old_first` | same | as 6 (a) states for `moved_to` | the old first kept in `same` |
     | T10 | `a_locations_json_the_reader_refuses_is_named` | same | a wrong format, a wrong version, bytes over the bound, malformed JSON and an entry missing a field are each refused with `file` = `LOCATIONS` | a refused file read as no entries |
     | T12 | `a_folder_path_the_folders_reader_would_refuse_is_refused_when_written` | same | a 4,096-byte `first` is written and read back; a 4,097-byte `first` and a 4,097-byte `same` entry are each refused, naming `folders.json`; a document over the byte bound (escaped control characters, built without touching disk) is refused | (a) the string bound removed; (b) the byte bound removed |
     | T13 | `the_locations_writer_refuses_what_its_reader_refuses_and_reads_back_the_rest` | same | a 4,096-byte path is written and read back equal; a 4,097-byte path is refused, naming `locations.json`; a path that is not valid Unicode is refused, not written altered (`cfg` in the test only) | (a) the string bound removed; (b) `to_string_lossy` restored |
     | T11 | `the_locations_reader_reads_back_what_a_save_writes` | `kernel/tests/project_save.rs` | after a real `Projects::save`, `read_locations` of the `locations.json` it wrote gives the dataset and the path | the reader's field names changed |
     | T14 | `a_save_whose_folder_path_folders_json_cannot_hold_is_refused_by_name_and_writes_nothing` | same; Windows only, by a run-time check as for K-R2 | `Projects::save` into an existing folder whose absolute path is over 4,096 bytes is refused as `MachineRecordRefused` naming `folders.json`; the folder has no `project.spatial`; the machine root has no identity folder | (a) the bound removed; (b) the documents built after the first write, which is main's order |

   - **(d) Pre-committed producers (R2; ADV-2026-11-16-16 item 1 (d)).**

     | Producer (`pub` item) | Consumer | Seam's end-to-end test |
     |---|---|---|
     | `store::OPEN_LOCK`, `ProjectLock`, `ProjectLock::try_lock` and `LockRefused` | `open_project`'s step 3 and `Projects::save` at a first save (P3a, item 4 (b)); the binding's lock state, dropped at `close_dataset` and by the session-end forwarder (P3b) | K-O4 and K-O5; working name `a_reopen_after_a_session_end_in_the_same_process_takes_the_lock`; working name `a_project_saved_first_in_this_process_is_refused_to_another_process_until_its_dataset_closes`; E-SECOND and E-CRASH-UNLOCK (P4) |
     | `KnownFolders::with_same` and `KnownFoldersFull` | the `same` arm, P3a | K-O11 and K-O6 |
     | `KnownFolders::moved_to` | the move arm, P3a | K-O6 widened, working name `a_move_answer_rewrites_folders_json_with_this_folder_first_and_asks_again_at_the_old_path` |
     | `store::read_locations` and `Location` | the machine-location arm, P3a | K-O3; K-O10 widened, working name `a_locations_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept` |

     - `store::locations_to_bytes` is not ahead of its consumer: its product caller, `Projects::save`, changes in P1b.
     - Each working-named test is declared in full, with its mutation, in the consuming piece's amendment before its code (R2 (b)).
     - The node is not done until each seam's test has passed on main (R2 (c)).
     - Any other `pub` item in P1b is a gate finding (R2 (d)).
     - All of these are named in P1b's PR body and in the node's plan summary.
   - **(e) Stops.** The worker stops and reports alone when any of these happens:
     1. The diff changes a wire byte, a type, a fixture, or a protocol line beyond 6 (a)'s two comments (R1 (f)).
     2. A file outside 6 (a) is needed, or a region of `mod.rs` other than its two.
     3. An existing test, or a line of one, needs an edit (I3), or a dependency or a lock file changes (I6).
     4. A `pub` item outside 6 (d) is needed.
     5. A test passes at its base before its code, or a mutation does not fail its test.
     6. T7 needs a seam other than `commit_with`, or T14 cannot build its folder. A case a test cannot build is a stop, not a skip.
     7. A change to `remove_stale_temps`, or to where the lock is taken, is needed. Both are P3a's (item 4 (b)).
   - **(f) Gates.**
     - Full class, both gates, the architect and the reviewer (ADV-2026-11-16-16 item 1 (a)). Both read item 4 (a)'s change in what the user is told.
     - The full suites are CI's: the workspace on three platforms, fmt, clippy and the shell job.
     - On the laptop, in turns with P1a and P2 by THE MACHINE paragraph, P1b keeps at its final candidate:
       - the focused `project_lock_crash`, `project_store` and `project_save` test targets and the store's unit tests;
       - every mutation of 6 (c) observed;
       - §2.11's command;
       - empty lock-file diffs;
       - one E-SAVE run, an app-window run: every save the shipped app makes now goes through the changed write order and writers, and E-SAVE is the only run of the shipped app through them.

7. **The two parts against each other and the pieces in flight.**
   - **P1a and P1b share no file.**
     - P1a: `kernel/src/project/resolver.rs`, `kernel/src/dataset_ref.rs`, `kernel/tests/project_resolver.rs`.
     - P1b: `kernel/src/project/store.rs`, `kernel/src/project/mod.rs`, `protocol/skp/src/v0/error.rs`, `protocol/skp/SKP-V0.md`, `kernel/tests/project_lock_crash.rs`, `kernel/tests/project_store.rs`, `kernel/tests/project_save.rs`.
     - No test needs both parts' code. No helper is shared between them.
   - **P2** (`kernel/src/session_history.rs`, `kernel/tests/project_reopen.rs`) shares no file with either part.
   - P1a, P1b and P2 run beside each other, each in its own worktree and build folder (ADV-2026-11-16-16 item 1 (b)).
   - Rule (00): P1b is the only piece on `protocol/` while it is in progress. P1a and P2 touch nothing there.
   - **P3a** follows P1a, P1b and P2, and takes main in before its gate (ADV-2026-11-16-06 item 4).
   - **PR B @ 6f95993e** and the stream-refusal form draft (`state/consults/2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-form-draft-architect.md`, its §5) touch no kernel and no `protocol/` file.
   - The reviewer recomputes each file list with git against its branch.

8. **Superseded index.**
   - §8 item 19 is qualified for the move alone, by S2-2 (a).
   - §2.11's step-2 lists are added to by `kernel/tests/project_store.rs`, `kernel/tests/project_save.rs` and `LOCATIONS_LIMITS` (class 9).
   - §4's step-2 table is added to by T1 to T14.
   - §2.4 step 3's lock placement is to be widened to a first save by P3a's amendment (item 4 (b)). It is not superseded here.
   - The O-21 placement of N-10 in the architect's 2026-11-16 read is superseded by item 3.
   - Nothing else is superseded.

Nothing above is edited.

## Amendment 31 — the reopen's P2, the lineage reader, declared before its code (ADV-2026-11-16-10, R1 and R2; ADV-2026-11-16-16 item 1 (b)): its scope, the reader's rule, ceilings, tests, mutations, the pre-committed producer, regions, stops and gates; `kernel/src/session_history.rs` and three tests outside §2.11's and §4's lists (class 9)

*Drafted by the architect for the custodian, read only, at main 2a8907b8786dd0dc714213fa21fdb41cd6ada52c, and appended by the custodian's script. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is the architect's recommendation, it says so. Rulings are cited by id, or by file, and item. Code is cited by path and symbol.*

1. **Basis.**
   - P2 is ADV-2026-11-16-10 R1 (a) and (c): the lineage reader, full class, run beside P1a and P1b.
   - Its rules are:
     - §2.4 step 6;
     - §2.10 item D, which is Annex A item 2 (ADR-036 Amendment 1 item 2);
     - ADR-036 §6 and §8;
     - C1 of Amendment 1 item 5 (bounds, K-L5, §8 item 20).
   - Item 3 (e) of 2026-11-12 is met: `second-open-history-before-1c-step-3` merged before this amendment (Amendment 29).
   - **Branch and folders:** `cut/b2-piece-1c-p2`, worktree `C:/dev/wt/1c-p2`, build folder `D:/wt-targets/1c-p2`, cut from main.
   - **Not P2's:**
     - the record's own `locations.json` writer (step 3's, Amendment 30 item 4 (a));
     - OPEN-S2-1 (c)'s record rule and R3 (P3a's);
     - the names and paths of `lineage.jsonl` and `previous-lineage.jsonl` (P3a's, which passes them in);
     - the closed set of facts on the wire in `opened.lineage` (P3b's, to the advisor under R1 (e)).

2. **Files and regions** (the architect's recommendation).
   - **`kernel/src/session_history.rs`** (class 9: not on §2.11's step-2 list; counted in kernel product):
     - **New shapes:** a lineage header (`purpose` `lineage`, `project` a project URI only, `lineage` holding §8's `completeness` and `starts`); a withheld line (ADR-036 §6).
     - **A private `MAX_LINEAGE_FILE_BYTES`** at its site, with C1's value, 33,554,432.
     - **`read_line`:** its framing (the LF, the header and step line ceilings, NUL, UTF-8 and the strict parse) moves into one private function, which `read_line` and the lineage reader both call. Nothing else in `read_line` changes.
     - **`check_header`:** its dataset-entry reading moves into one private function, which it and the lineage header both call. Nothing else in `check_header` changes.
     - **Unchanged:** `in_writers_form`, `check_step`, `in_order`, `spelled`, `recover`, `recover_bytes`, `HEADER`, `MARK_LINE`, and every writer item (`StepRecorder`, `reader_accepts`, `create`, `copy_under`).
     - **New:** `pub fn read_lineage(folder_file, previous_file, member)`, where `member` is `project::file::Lineage`; `pub struct LineageRead`; `pub enum FolderLineage`; `pub enum PreviousLineage`; `pub enum LineageRefused`.
     - No inline tests: the public reader reaches every new item.
   - **`kernel/tests/project_reopen.rs`:** new, on §2.11's list. Its hand-built steps files are test-made, since 1c writes no lineage.

3. **The reader's rule** (the architect's reading of C1, §8 and Annex A item 2 together).
   - **The handles.** It opens each file read only and holds no handle after it returns. It never writes, truncates, renames or locks a file. A refused file is left byte for byte as it was.
   - **The whole-file check.** A file is first checked whole:
     - its size by metadata, then a read bounded at `MAX_LINEAGE_FILE_BYTES` + 1;
     - each line against §9's line ceilings, through the shared framing;
     - the header in the lineage shape;
     - each later line a step or a withheld line, chained by `parent`;
     - a mark line is refused, since ADR-036 §6 allows marks in the session history only.
   - **Refusal.** A file over its byte bound or a line bound is `LineageRefused::OverBound`, naming the bound (C1). A file that fails any other check is `LineageRefused::Damaged`, with its line and rule (§8). Neither is read further, and no prefix of it is used.
   - **"Lines after the save."** Annex A item 2's arm 1 applies only to a file that passes the whole-file check. Its "lines after the save" are valid lines after the recorded prefix.
   - **Member `not-kept`.** If the folder's file is absent, `folder_file` is `Absent`. If it is present, it is `NotRead`: named as from a different save, never opened. `previous_file` is `None` and `lineage` is `None`.
   - **Member kept: arm 1.** The folder's file passes, and its header line and first `steps` step and withheld lines, each with its LF, hash to the member's `sha256`. Then `folder_file` is `Recorded`, or `RecordedWithLinesAfter` when valid lines follow, and `lineage` holds those 1 + `steps` lines.
   - **Member kept: arm 2.** Otherwise the folder's file is `Absent`, `NotTheRecordedOne` or `Refused(…)`, and the previous file is checked whole the same way. If its whole bytes hash to the member's `sha256` and it holds `steps` step and withheld lines, `previous_file` is `Used` and `lineage` holds its lines.
   - **Member kept: arm 3.** Otherwise `previous_file` is `Absent`, `NotTheRecordedOne` or `Refused(…)`, and `lineage` is `None`. The facts then name the files as from different saves, or the lineage file as missing.
   - **Messages.** The kernel's `Display` for each fact states the engine fact only. The consequence is the shell's (S16, S17).

4. **Ceilings by §2.11's groups.** Neither §2.11 nor §7 is edited. An overrun is class 8 in P2's closing amendment.

   | Group | After Amendment 30 (P1a and P1b) | P2 | Left after P2 |
   |---|---|---|---|
   | kernel product | 925 of 1,400 | 260 (`session_history.rs`) | 665 |
   | kernel tests | 740 of 1,300 | 330 (`project_reopen.rs`) | 410 |
   | protocol | 310 of 320 | 0 | 310 |

   - P2: 590 lines and 2 files. It is under 800, so R1 (d) asks no reason.

5. **Tests, declared before code** (all in `kernel/tests/project_reopen.rs`).
   - Each fails at main because `read_lineage` does not exist, which is a compile failure. K-L8's `recover` assertion is the one exception, by name.
   - Each mutation is observed by the round-25 rule: applied, the named test run, its failure recorded by name with the commit, then reverted. A `verify-mutation` run is not called an observation.

   | Id | Test | Asserts | Mutation |
   |---|---|---|---|
   | L1 | `a_lineage_file_whose_recorded_prefix_matches_the_member_is_the_projects_lineage` | a header, two steps and a withheld line, with the member over all of them and `steps` 3: `Recorded`, and `lineage` equals the four lines | arm 1's hash comparison removed |
   | L2 | `lines_after_the_recorded_prefix_are_named_and_not_read_as_the_projects` | the same file with two valid steps appended, and the member over the prefix: `RecordedWithLinesAfter`, and `lineage` is the prefix only | the prefix taken as the whole file, not cut by the step count |
   | L3 | `a_previous_lineage_matching_the_member_is_used_and_the_folders_file_named` | cases: the folder's file valid but different, and the folder's file absent; each with a matching previous file: `Used`, with `NotTheRecordedOne` or `Absent`, and `lineage` the previous file's lines | arm 2 removed |
   | L4 | `a_lineage_file_from_a_different_save_is_named_and_not_read_as_the_projects` | cases: the folder's file valid but different, with no previous file, gives `NotTheRecordedOne`, `previous_file` `Absent`, `lineage` `None`; the member kept with no files gives `Absent` and `Absent`; the member `not-kept` with a file present gives `NotRead` | arm 3 returns the folder's lines; the not-kept check removed (two mutations) |
   | K-L5 | `a_lineage_file_over_its_bounds_is_named_and_not_read` (Amendment 1 item 5, C1) | a file extended by `set_len` to 33,554,433 bytes, and a step line of 262,145 bytes, each beside a member that records a lineage: `Refused(OverBound)` naming the bound | the file-size check removed |
   | K-L6 | `a_torn_lineage_file_is_named_and_never_cut_back` (class 9; the 2026-10-23 draft's id) | cases: a last line without its LF; an unparsable line after a prefix that matches the member. Each gives `Refused(Damaged)` with its line, `lineage` `None`, and the file's bytes unchanged | the reader keeps the valid prefix |
   | K-L7 | `a_lineage_header_and_withheld_lines_are_read_in_their_shape_and_a_mark_line_is_refused` (class 9) | a session-history header in a lineage file, a mark line, and a withheld line out of chain are each `Damaged`, naming the member path; a lineage header with each `completeness` and `starts` form passes | mark lines admitted in a lineage file |
   | K-L8 | `the_session_history_reader_still_refuses_a_withheld_line_and_a_lineage_header` (class 9) | `recover` of a history holding a withheld line, or a lineage header, keeps only the lines before it and names the failure | the lineage shapes admitted by `read_line` |

   - K-L8 guards the shared framing. Its `recover` assertions hold at main by design, so it is exempted by name from stop 4.
   - No existing test is edited (I3).

6. **The pre-committed producer** (R2).

   | Producer (`pub` item) | Consumer | Seam's end-to-end test |
   |---|---|---|
   | `session_history::read_lineage`, `LineageRead`, `FolderLineage`, `PreviousLineage`, `LineageRefused` | `Projects::open_project`'s step 6 (P3a), which gives `opened.lineage` on the wire (P3b) and S16 and S17 in the shell (P4) | working name `a_saved_project_whose_member_records_a_lineage_reopens_with_its_lineage_named` (a K-O1 case in P3a: a hand-built project and lineage file, the facts asserted for a match and for a file from a different save); a P3b wire fixture of `opened.lineage`, working name `v0-open_project-opened-lineage`; P4's shell test, working name `a reopened project's lineage facts map to S16 and S17` |

   - Each working-named test is declared in full, with its mutation, in the consuming piece's amendment before its code (R2 (b)).
   - The node is not done until each seam's test has passed on main (R2 (c)).
   - Any other `pub` item in P2 is a gate finding (R2 (d)).
   - These are named in P2's PR body and in the node's plan summary.

7. **Regions against the pieces in flight.**
   - **P2's files:** `kernel/src/session_history.rs`, `kernel/tests/project_reopen.rs`.
   - **P1a** (`kernel/src/project/resolver.rs`, `kernel/src/dataset_ref.rs`, `kernel/tests/project_resolver.rs`) shares no file with P2.
   - **P1b** (`kernel/src/project/store.rs`, `kernel/src/project/mod.rs`, `protocol/skp/src/v0/error.rs`, `protocol/skp/SKP-V0.md`, `kernel/tests/project_lock_crash.rs`, `kernel/tests/project_store.rs`, `kernel/tests/project_save.rs`) shares no file with P2.
   - **PR B @ 6f95993e** touches shell files only.
   - **The S1 piece** (`state/consults/2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-form-draft-architect.md`, its §5) puts the kernel and `protocol/` out of scope.
   - P2 touches nothing in `protocol/`. Rule (00) leaves P1b the only piece there.
   - P2 reads `project::file::Lineage` and does not edit `file.rs`.
   - The reviewer recomputes each file list with git against its branch.

8. **Stops.** The worker stops and reports alone when any of these happens:
   1. A file outside item 2 is needed. `protocol/`, `kernel/src/project/*` and `kernel/src/dataset_ref.rs` are among them.
   2. A session-history test fails, an existing test needs an edit (I3), or a writer item in `session_history.rs` must change.
   3. A `pub` item outside item 6 is needed.
   4. A test other than K-L8 passes at its base before its code, or a mutation does not fail its test.
   5. The reader would write, truncate, rename or lock a file.
   6. `S::Entry` or `DatasetRef::parse` refuses a lineage header's project-relative locators (Annex A item 4). Fixing that is `dataset_ref.rs`, P1a's file.
   7. A dependency or a lock file changes (I6).
   8. A case a test cannot build. That is a stop, not a skip.

9. **Class and gates.**
   - **Full class, both gates** (ADV-2026-11-16-06 item 2 (a)). The grounds:
     - persistence: a bounded reader of a file in the user's project folder and in the machine store, which never cuts a file back (§8 item 20);
     - a seam: a producer pre-committed to P3a;
     - more than 260 lines;
     - P2 also moves framing that the shipped `record_step` writer check shares.
   - **CI** runs the full suites: the workspace on three platforms, fmt and clippy.
   - **On the laptop,** in turns with P1a and P1b by THE MACHINE paragraph, P2 keeps at its final candidate:
     - the focused `project_reopen`, `session_history`, `session_history_crash` and `record_step_match` test targets and `session_history`'s unit tests;
     - every mutation of item 5 observed;
     - §2.11's command;
     - empty lock-file diffs.
   - **No app-window run.** No shipped path reaches `read_lineage` until P3a. The shared framing that `record_step` reaches is covered by those kernel suites.

10. **Superseded index.**
    - §2.11's step-2 kernel product list is added to by `kernel/src/session_history.rs` (class 9).
    - §4's step-2 table is added to by K-L6, K-L7 and K-L8 (class 9), with L1 to L4 named.
    - Nothing else is superseded.

Nothing above is edited.

## Amendment 32 — step 3, the recovery offer after a crash, placed in a node of its own by the human (ADV-2026-11-16-07 item 1 (b)); not in v0.2

*Written by the custodian, 2026-11-16. References only. Nothing below is a quotation.*

1. **Basis.** The human's typed message of 07:53Z approved the advisor's draft ADV-2026-11-16-07 (`state/directives/2026-11-16-the-humans-message-five-drafts-approved-v0-1-0-records-what-v0-2-waits-for-the-machine-queue-the-alarm-timer-the-limits-of-the-advisors-merges.md`). Its item 1 (b) puts this node's step 2, the reopen, in v0.2, and splits step 3 into a node of its own, outside v0.2.
2. **The split.** Step 3 (§2.6 and the rows of §4 and §7 placed at step 3) is now the plan node `b2-piece-1c-step-3-recovery-offer`, gated by this same form. It depends on this node and on `second-open-history-before-1c-step-3`, as the step order in this form already sets. This node is done when step 2 is done.
3. **Unchanged.** No section, ceiling, test or rule of step 3 changes. KNOWN-LIMITATIONS item 43 stays as it is, by the same item. Where Amendments 30 and 31 name a part of step 3, such as the record's own locations writer of Amendment 30 item 4 (a), it stays step 3's and now lives in that node.

Nothing above is edited.

## Amendment 33 — P1b's closing, before its merge request: the words commit after both gates; the counts, with two class 8 rows; what the user is told; T13 (b); the runs; the seam tests in the plan; the stops; notes for P3a

*Written by the custodian, 2026-11-18, before PR 331's merge request. References and hashes only. Nothing below is a quotation.*

1. **The gates** (item 6 (f)). Both at F = 1ad509ad69f1be832ef92af43c26cb03ada00a56, both PASS WITH NOTES, with no Correctness or Evidence finding: `state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1b-gate-architect.md` and `state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1b-gate-reviewer.md`.
2. **The words commit.** W = 5a396eacb64505e56a6101e250ac0f070750fdcd, the one commit after F. It carries the reviewer's D1, D2 and D3 words (its report, Documentation), applied by the custodian's script, which checked each new comment, unwrapped, against the filed report's bytes. From F to W only comment lines change: `kernel/tests/project_store.rs` 4 added and 2 deleted, `kernel/src/project/store.rs` 4 added and 3 deleted. Under ADV-2026-11-16-06 item 2 (c), no gate reads it again. The architect's W1 and W2, for the same two test comments, are not used: the reviewer's words also cover its probe of T13 (b) (item 5 below). The words worker's report is `state/consults/2026-11-18-b2-piece-1c-save-and-reopen-p1b-words-worker-report.md`.
3. **The counts** (item 6 (b), both columns), `git diff --numstat bdc72f5f...5a396eac`:
   - `store.rs` 294 of 300; `mod.rs` 42 of 40, **class 8**; kernel product 336 of 340;
   - the two protocol comments, 5 of 10;
   - `project_lock_crash.rs` 102 of 130; `project_save.rs` 71 of 90; `project_store.rs` 168 of 140, **class 8** (166 at F; the words commit adds 2); kernel tests 341 of 360;
   - in all, 682 lines in 7 files, against 710 and 7. The groups and the piece hold. §2.11 and §7 are not edited.
   - `mod.rs`'s third hunk is its import, cut to one name when `locations_json` was removed (the architect's O-6, the reviewer's D6). The architect reads it as part of that removal's region and not a breach of item 6 (e) stop 2; the reviewer leaves that to the advisor (its A2), whom the merge request asks.
   - The fix commit, 1ad509ad, edits T6, this piece's own new test, and changes no assertion (the worker's departure (d)); it is not an I3 stop.
   - From the merge base to main, no path of the pull request changed (ADV-2026-11-14-21 item 6 (a)).
4. **What the user is told** (the architect's D-5). Item 4 (a) holds no string change; that is true of the shell's strings, but not of the kernel's rule texts: a save the store now refuses ends in `project_file_refused`, whose message carries the rule text built at line 312, 314 or 342 of `kernel/src/project/store.rs` at W, and the shell shows that message inside its not-saved notice. The byte bound's text takes the reader's own words, and the text for a path that is not Unicode is main's existing one, now also naming `locations.json`; new words for these are drafts for the advisor (both gates' A1), outside this piece.
5. **T13 (b)** (the architect's D-2 and O-2, the reviewer's Evidence). Item 6 (c)'s mutation, main's lossy conversion restored, also drops the string bound, so T13 fails at its 4,097-byte case, before the case that is not Unicode runs. The reviewer's probe kept the bound and the lossy conversion; T13 then fails at the case that is not Unicode. Both runs are in the reviewer's report (Mutations). Item 6 (c) and stop 5 are met.
6. **The runs.** E-SAVE once at F, all 12 steps passing, rc 0, on an exe built from F's tree: `state/consults/2026-11-18-b2-piece-1c-save-and-reopen-p1b-e-save-at-1ad509ad-tester-report.md`. W changes comment lines only, so that run stands for W. The worker's own report is `state/consults/2026-11-18-b2-piece-1c-save-and-reopen-p1b-worker-report.md`. CI at W, read at 2026-11-18T18:15:26Z, all success: on push, the Rust workspace (run 44363538936), the shell (44363539238), fmt (44363538887), governance (44363538769) and ported notices (44363539100); on the pull request, the Rust workspace (44363553987), the shell (44363552043), fmt (44363552027), governance (44363552123), ported notices (44363552005), the sign-off check (44363552006) and the exposure scan (44363552060). The one red run on the branch is 43821156061, the Rust workspace at a374590c, the commit of the tests before the code, failing as P-base predicts.
7. **The seam tests in the plan** (the architect's D-4, the reviewer's D4). The node's plan summary now names each pre-committed producer's seam tests: item 5 (d)'s for P1a, item 6 (d)'s table for P1b, and Amendment 31 item 6's for P2, all in the commit that adds this amendment. PR 331's body names P1b's.
8. **The stops, with their times.**
   - The usage-limit stop, 2026-11-16T09:03Z to 2026-11-18T08:27Z, came after the code was built (the worker's run ended at 2026-11-16T08:33:41Z) and held the run and the gates.
   - The E-SAVE run's two setup stops, at 2026-11-18T16:54:34Z and 17:04:47Z by the tester's hand-backs, were the custodian's brief: it named neither the viewer's build nor the shell's, which the exe's resources need. The run itself had no failure.
9. **For P3a, not P1b's** (the reviewer's A3). P3a's amendment declares: a lock freed late after a crash on Windows, and a bounded retry if T6 or a reopen ever needs one (the architect's O-1, the reviewer's O2); the lock makes the identity's folder, so P3a takes it after the documents are built or declares a T14 edit (the reviewer's O1); the same folder spelled with another case counts as a new one toward the 256 (the architect's O-7).

Read the last amendment first.

Nothing above is edited.

## Amendment 34 — P2's closing, before its merge request: the gates; the words commit; the counts, with two class 8 rows; two class 1 disclosures; the form's never opened; the runs; the stops; notes for P3a, P3b and P4

*Written by the custodian, 2026-11-18, before PR 332's merge request. References and hashes only. Nothing below is a quotation.*

1. **The gates** (Amendment 31 item 9). Both at H = eeebe0977d71753fbeeaa8ffa288d6fe4997e2fb, both PASS WITH NOTES, with no Correctness or Evidence finding: `state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p2-gate-architect.md` and `state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p2-gate-reviewer.md`. The worker's report: `state/consults/2026-11-18-b2-piece-1c-save-and-reopen-p2-worker-report.md`.
2. **The words commit.** W = f89e43b5c968a4f77467742e5a0478a5e804e50d, the one commit after H. It carries the architect's D1 words (its report, Drafts), applied by the custodian's script, which checked each new comment, unwrapped, against the filed report's bytes. From H to W only comment lines of `kernel/src/session_history.rs` change, 3 added and 2 deleted. The reviewer's D1 and D2 are in the PR body, in the reviewer's words.
3. **The counts** (both columns, as Amendment 33 item 3 counts P1b's; the reviewer's D1), `git diff --numstat e567072f...f89e43b5`:
   - `session_history.rs` 357 (341 added, 16 deleted) against 260, **class 8**;
   - `project_reopen.rs` 397 (397 added) against 330, **class 8**;
   - in all, 754 lines in 2 files, against 590 and 2. By item 4's table the groups hold: kernel product 1,282 of 1,400, kernel tests 1,137 of 1,300, protocol 310 of 320, unchanged. §2.11 and §7 are not edited.
   - The worker's report counts one column (340 against 260, 737 in all); the counts above stand for it.
   - From the merge base to main, no path of the pull request changed (ADV-2026-11-14-21 item 6 (a)).
4. **Two class 1 disclosures** (the architect's D2, the reviewer's O7): L1's control assertion, without which L1's declared mutation could not be observed, and L4's extra case, a not-kept member with no file read as Absent. Both are beyond item 5's rows, were written before the code, and are named in the worker's report and in the tests commit's message.
5. **The form's never opened** (item 3, the member not-kept; the architect's D1 and D2). The code holds never read: the presence is asked by metadata only. Item 3 stays as it is.
6. **The runs.** The worker's focused runs at H (the four test targets and `--lib session_history`, `cargo fmt --check`, the empty lock-file diffs), reused by the reviewer; the reviewer's nine mutations of item 5 at H, each failing its own test at its own assertion, and one probe (its O1); P-base at 3db87301, a compile failure as predicted. W changes comment lines only, so these runs stand for W. No app-window run (item 9).
7. **CI.** At W, read 2026-11-18T21:01:37Z: Product CI — Rust workspace passed on all three platforms in the pull_request run 44393641598 and the push run 44393628969 (the macOS jobs 135117629806 and 135117586446, 12 steps each), and the shell, governance, fmt, DCO, exposure and notices runs passed. The one red run on the branch is 43825113674 at 3db87301, P-base, as predicted.
8. **The stops.** None fired. The reviewer's one departure, a first L1 run that failed in setup on a temporary folder not yet made, is in its report's section 7.
9. **Notes for P3a, P3b and P4** (none blocks P2):
   - P3a: a case for arm 2's steps check, a member with the previous file's sha256 and another steps (the reviewer's O1); step 6's place against the open's cancel key (the reviewer's O6, the architect's O9); the not-kept error and link edges (the reviewer's O3, the architect's O4 and O5); which refusal wins when two lines break different rules (the architect's O3).
   - P3b: whether an unreadable file stays Damaged at line 0 or is a fact of its own (the reviewer's O2, the architect's O1); the lineage properties ADR-036 §8 leaves open (the architect's O6).
   - P3b and P4: Damaged's rule text is a Debug form, not for a user (the reviewer's O5, the architect's O7).
10. **Superseded index.** Nothing is superseded.

Read the last amendment first.

Nothing above is edited.

## Amendment 35 — P1a's closing, before its merge request: the gates; the words commit; the counts; a class 1 disclosure; clippy not in CI; what is not tested; the runs; the stops; notes for P3a and P3b

*Written by the custodian, 2026-11-18, before PR 333's merge request. References and hashes only. Nothing below is a quotation.*

1. **The gates** (Amendment 30 item 5 (f)). Both at H = 7e76347271780d20103bb3b4b36b8650a0967456, both PASS WITH NOTES, with no Correctness or Evidence finding: `state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1a-gate-architect.md` and `state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1a-gate-reviewer.md`. The worker's report: `state/consults/2026-11-18-b2-piece-1c-save-and-reopen-p1a-worker-report.md`. Before their dispatch, at 2026-11-18T21:26:13Z by their transcripts, the Rust workspace had passed at H on all three platforms, in the push run 44267900966, which ended at 08:50:22Z (the architect's O10).
2. **The words commit.** W = 3717537f9ec7a5039683bed70fd72175e835edfd, the one commit after H. It carries the reviewer's D1 (a) to (c), which also meet the architect's D1 at the same lines, applied by the custodian, who checked each new comment, unwrapped, against the filed report's bytes. Comment lines only (ADV-2026-11-16-06 item 2 (c)). The architect's O5 words are not applied: the reviewer's D1 (a) and (c) cover the same two lines.
3. **The counts** (both columns, item 5 (b)), `git diff --numstat bdc72f5f...3717537f`:
   - `resolver.rs` 97 (96 added, 1 deleted) of 130; `dataset_ref.rs` 2 (1 and 1) of 5; kernel product 99 of 135;
   - `project_resolver.rs` 145 (145 added) of 200;
   - in all, 244 lines in 3 files, of 335 and 3. No row is over.
   - From the merge base to main, no path of the pull request changed (ADV-2026-11-14-21 item 6 (a)).
4. **A class 1 disclosure** (the reviewer's D2; the architect's O1). The variant `FolderUnresolvable` of the pre-committed error type, for a project folder that `canonicalize` cannot resolve, is not named in item 5 (a). It is not a new `pub` item. No test reaches it; it is what T5's case returns under M5. Its wire code goes with P3's packet (item 10).
5. **Clippy** (the reviewer's D3). Item 5 (f) says CI runs clippy; no CI job runs it. The reviewer ran `cargo clippy --locked -p spatial-kernel --all-targets` at H: rc 0, with no warning in the three files. Item 5 (f) is not edited.
6. **What is not tested** (item 5 (c)). The cloud placeholder, as declared. On Windows T1 builds a folder junction only; the symlink case ran in CI's Ubuntu and macOS jobs at H (run 44267900966). A link to a regular file as the final segment is built on no platform (the architect's O4, the reviewer's O6).
7. **The runs.** The worker's focused runs at H (`--test project_resolver` 4 passed, `--lib project::resolver` 1 passed, `cargo fmt --check` rc 0, the empty lock-file diffs) and P-base at fe162292, reused by the reviewer; the reviewer's mutations M1 to M5 at H, each failing its own test at its own assertion, and one probe, X1, beyond item 5 (c), which failed T1. Nothing was reproduced.
8. **CI.** At W, read 2026-11-18T22:36:06Z: Product CI — Rust workspace passed on all three platforms in the pull_request run 44409444598 and the push run 44409435670 (the macOS jobs 135173332562 and 135173300599, 12 steps each), and the shell, governance, fmt, ported-notices, exposure-scan and DCO workflows passed: twelve runs, all success. The one red run on the branch is 43820500481 at fe162292 (Rust, push), P-base, as predicted.
9. **The stops.** None of item 5 (e)'s fired. The usage limit stopped the worker's run from 2026-11-16T09:01:11Z to 2026-11-18T08:31:20Z, by its transcript; it was resumed and finished.
10. **Notes for P3a and P3b** (none blocks P1a):
   - P3a: `NotCanonical` carries `$` as its path, so the data step names the locator's `at` itself (the architect's O2, the reviewer's O1); K-R1 takes a link to a regular file as the final segment, built off Windows (the architect's O4); the race between the check and the open is §2.5's declared window (the architect's O6); H4 is discriminated by K-O1 (the architect's O7); only parsed `at`s are passed, which bounds the segments (the architect's O8).
   - P3b: the wire codes for `FolderUnresolvable` (item 4) and for `Unresolvable`, which covers any metadata error, access denied included (the architect's O3, the reviewer's O2).
   - Whether `symlink_metadata` and `canonicalize` open a handle inside the call on Windows was checked by no call (the architect's O5); W's words hold either way.
11. **Superseded index.** Nothing is superseded.

Read the last amendment first.

Nothing above is edited.

## Amendment 36 — the reopen's P3a, the kernel's open of a saved project, declared before its code as two parts, P3a-1 (the lock at a first save) and P3a-2 (`Projects::open_project`) (ADV-2026-11-16-10 R1 to R4; ADV-2026-11-16-16 item 3; ADV-2026-11-18-18 item 4; ADV-2026-11-18-23 item 2; ADV-2026-11-18-24 items 3 and 5): scope, rules, ceilings, tests, mutations, pre-committed producers, regions, stops and gates; a correction of Amendment 34 item 3's group figures (class 3); `kernel/src/skp.rs` and tests outside §2.11's and §4's lists (class 9)

*Drafted by the architect for the custodian, read only, at main 1067f753bd4f4226260575cbd3bbe3ece8fc7180, and appended by the custodian's script. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is the architect's recommendation, it says so. Rulings are cited by id, or by file, and item. Code is cited by path and symbol.*

1. **Basis.**
   - P3a is ADV-2026-11-16-10 R1 (a): the kernel's open of a saved project, full class (ADV-2026-11-16-06 item 2 (a)). P3b, the wire (`skp/0.14`) and the binding, follows it.
   - Its rules:
     - §2.4, steps 1 to 6;
     - §2.5, with its declared window;
     - §2.7's lock;
     - Amendment 1 item 5 (V3, M1, M2);
     - Annex A items 2, 3 and 5;
     - R3 (a) to (d);
     - OPEN-N4 (a), as ADR-036 Amendment 2 item 4 states it;
     - the second-open form's five carried items (`governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, §2.4).
   - P1a, P1b and P2 have merged (Amendments 33 to 35). P3a consumes their pre-committed producers (Amendment 30 items 5 (d) and 6 (d); Amendment 31 item 6).
   - **Not P3a's:**
     - every wire byte, type, fixture and code. That includes the codes for P3a's new failures and C-6's withdrawal of `project_target_outside_folder` (P3b, R1 (e)).
     - the binding's commands, the pool poll, and freeing the lock at `close_dataset` and at a session end (P3b; O-12, O-13).
     - every shell item, O-14 to O-17, E-REOPEN, E-CHANGED, E-SECOND and E-CRASH-UNLOCK (P4).
     - the record's own `locations.json` writer (step 3's node, Amendment 32 item 3).
   - **Model:** worker-high, on the strongest model, for both parts (ADV-2026-11-18-02 item 2 (a); ADV-2026-11-16-06 item 5 (a)). The grounds: a lock, a path check, a persistence format, concurrency and cancellation.

2. **Correction (class 3).**
   - Amendment 34 item 3 gives the groups after P2 as 1,282 of 1,400 and 1,137 of 1,300. Those figures add P2's counts to Amendment 31 item 4's figures, and those figures are what was left (665 = 925 − 260).
   - Corrected, the counts of Amendments 33, 34 and 35 (each item 3) give step 2's use so far:
     - kernel product 792 of 1,400 (99 + 336 + 357);
     - kernel tests 883 of 1,300 (145 + 341 + 397);
     - protocol 5 of 320.
   - The proof is those three items' numstat figures, summed as shown.

3. **Size and split (R1 (d)).** The architect's recommendation.
   - **The read's figure.** The step-2 read puts P3 at about 2,210 lines and P3b at about 810, so P3a at about 1,400 (`state/consults/2026-11-16-b2-piece-1c-save-and-reopen-step-2-declaration-read-architect.md`, §3, P3: 750 product + 650 tests).
   - **This declaration's ceilings** come to 1,440 lines (item 4).
   - **P3a splits in two.**
     - P3a-1 is the lock at a first save, with its documentation items: 210 lines, 3 files.
     - P3a-2 is `Projects::open_project`: 1,230 lines, 6 files.
     - P3a-1 has a product caller now: the shipped `save_project` command calls `Projects::save`.
     - P3a-2 is cut from main after P3a-1 merges. Both edit `kernel/src/project/mod.rs`, and P3a-2 registers its open in the `SavedProject` field that P3a-1 adds.
   - **P3a-2 does not split again by the arms of the open.** It stays over 800 lines for three reasons.
     - (a) The six steps run in one call, under one cancel key and one lock. Every arm's test either ends in `opened`, which needs step 4, or asserts that a refusal after the lock leaves `open.lock` free (K-O14). A part cut inside step 2 would land an `open_project` whose missing arms answer in a way §2.4 does not define. A part made of crate-private helpers without their caller would land dead code, which clippy reports in a changed file (ADV-2026-11-18-24 item 5 (b)).
     - (b) About a third of P3a-2's test lines are one rig in one file: hand-built folders, `folders.json`, `locations.json` and lineage files. A split would duplicate that rig or share a helper across parts, either of which would first go to the advisor (ADV-2026-11-16-16 item 1 (e)).
     - (c) The largest arm, `copy`, is about a fifth of the part. Cut out, it would leave an interim `copy` answer that §2.4 does not have.
   - The advisor rules the split with the packet (P-1).

4. **Ceilings, both numstat columns, by §2.11's groups.** Neither §2.11 nor §7 is edited. An overrun is class 8, recorded in the part's closing amendment.

   | Part | File | Group | Ceiling |
   |---|---|---|---|
   | P3a-1 | `kernel/src/project/mod.rs` | kernel product | 60 |
   | P3a-1 | `kernel/src/project/store.rs` | kernel product | 20 |
   | P3a-1 | `kernel/tests/project_save.rs` (class 9 by Amendment 30) | kernel tests | 130 |
   | P3a-2 | `kernel/src/project/mod.rs` | kernel product | 520 |
   | P3a-2 | `kernel/src/skp.rs` (class 9, O-10) | kernel product | 60 |
   | P3a-2 | `kernel/src/session_history.rs` (class 9 by Amendment 31) | kernel product | 50 |
   | P3a-2 | `kernel/src/dataset_ref.rs` | kernel product | 10 |
   | P3a-2 | `kernel/tests/project_reopen.rs` | kernel tests | 520 |
   | P3a-2 | `kernel/tests/project_lock_crash.rs` | kernel tests | 70 |

   - **Group totals.** P3a-1 is 80 product and 130 tests. P3a-2 is 640 product and 590 tests.
   - **The forecast** (item 2's figures).
     - Kernel product has 608 left. P3a takes it to 112 over.
     - Kernel tests have 417 left. P3a takes them to 303 over.
     - Protocol stays at 5 of 320.
     - Both kernel overruns are class 8 at the closings. The advisor reads the forecast now (P-7).
   - **Contingent.** If the advisor rules packet P-6 option (ii), `kernel/src/project/resolver.rs` joins P3a-2 with a ceiling of 15. Its test case falls within `project_reopen.rs`'s ceiling.
   - The reviewer recounts §2.11's command with its excludes set to this form's present path.

5. **The open's rules** (P3a-2, the architect's recommendation).
   - **(a) The cancel key.**
     - The key is registered at the entry of `open_project`, before `project.spatial` is read. It goes in the host's open registry, reached through `StepRecorder::host`.
     - A new crate-private split of `SkpHost::open_dataset` in `kernel/src/skp.rs` does this (O-10; the 2026-10-23 draft's point (a)). The split has two halves: one registers a key and returns its guard and token, and one opens under a token already registered.
     - `open_dataset` becomes the two halves in sequence. Its behaviour does not change.
     - A key already in use is refused as `cancel_key_in_use`.
     - The token is checked between steps and after each blocking read, and the engine open takes the same token.
     - The longest stretch with no cancel check is one bounded read: at most 1 MiB for `project.spatial`, 2 MiB for each machine document, and 32 MiB for each of the two lineage files.
   - **(b) The order** (class 1, disclosed).
     - Step 2 decides with nothing written. The `question` arm returns from there.
     - Step 3 takes the lock before any write to the machine store or to the folder. Step 2's writes (`same`, the move, `copy`'s new identity) come after the lock. For `copy`, the lock is the new identity's.
     - Step 6, the lineage read, runs after step 3 and before step 4's engine open. A cancel during the read therefore opens nothing (ADV-2026-11-18-23 item 2 (b)). The reply's content is unchanged.
     - Every refusal or cancel after step 3 frees the lock before the reply (K-O14).
   - **(c) The machine documents.**
     - `folders.json` and `locations.json` are read under their bounds.
     - A refused file gives a failure that names the file and leaves it byte for byte (M1, K-O10).
     - `same` goes through `KnownFolders::with_same`, and over 256 it is refused with nothing dropped (M2, K-O11).
     - A move goes through `KnownFolders::moved_to` (K-O6 (b)).
     - Every write goes through `KnownFolders::to_bytes` or `store::locations_to_bytes`, then `write_machine_file`. A refusal by a writer names its file and writes nothing (Amendment 30 item 4 (a)).
   - **(d) The folder's case** (Amendment 33 item 9; the architect's O-7).
     - The known check compares canonical forms. It canonicalizes this folder and each remembered entry that resolves; an entry that does not resolve is compared as written.
     - What is written stays the absolute form, as at the save.
     - `with_same` is called only for a folder the known check did not find (K-O23).
   - **(e) The data step.**
     - A `project-relative` locator goes through `resolver::check_inside`, and the engine gets the returned path (H4). The engine path is armed for watching with the same string (K-O15).
     - Each refusal names the locator's own JSON path, `$.datasets[0].resource.locators[i].at`, and the segment. It never forwards the `$` that `NotCanonical` carries (ADV-2026-11-18-24 item 3 (a)).
     - `NotCanonical` cannot be reached through the data step. `DatasetRef::parse` refuses a non-canonical `at` at step 1, through `in_canonical_form` in its locator loop in `kernel/src/dataset_ref.rs` (K-R3). Only parsed `at`s are passed, which bounds the segments (Amendment 35 item 10).
     - Otherwise the machine location from `locations.json` is used. A location that is absent, or a file that is missing, gives `not_found`.
     - A re-link is checked against `observed` (K-O8). After the open succeeds, the re-link is written to `locations.json`. A re-link path that the writer refuses, a relative one included, is refused by name with nothing written.
     - The race between the check and the open is §2.5's declared window.
   - **(f) The open's identity in the recorder** (O-6 items 1 and 2; O-11).
     - A new crate-private `StepRecorder` call runs before any step. It gives the reopened open the project file's dataset identity, and binds the open at the reopen only when this run holds the project's record (OPEN-N4 (a); ADR-036 Amendment 2 item 4).
     - A later run's reopen does not bind (R3 (a)).
     - The open is registered in `Projects`'s saved list, with its lock, so that its next save keeps both identities and its folder (K-O21).
   - **(g) Sub-case 2** (R3 (b)): a later run's reopen with no step before its first save, where another run left the project's record folder.
     - At main, `StepRecorder::adopt_project` binds without a move. Each later step is then refused, at `create`'s `create_dir` on the leftover folder.
     - Recommended, and contingent on the advisor (packet P-2): `adopt_project` does not bind an open with no record of its own when `<sessions root>/<project hex>` exists and this run holds no record for the project. The open stays unbound, the save replies withheld as `HistoryUnwritable`, and the open's steps keep a record of their own.
   - **(h) Told at the reopen.**
     - The reply carries no history fact (R3 (c)). The first save's withheld mark is the existing `HistoryMark::Withheld`, which P4 shows as S5.
     - A later save of a reopened file whose member records a lineage is refused by `Projects::save`'s existing check (R3 (d), K-O20).
   - **(i) The lineage paths** (Amendment 31 item 1): `lineage.jsonl` in the folder, and `previous-lineage.jsonl` in the identity's machine folder. Both are private constants in `mod.rs`, passed to `session_history::read_lineage`.
   - **(j) A lock freed late after a crash on Windows** (Amendment 33 item 9; the architect's O-1, the reviewer's O2). No retry is declared. K-O5 tries the lock only after it has waited for the child to exit. A failure of K-O5 or T6 on Windows is stop 6.

6. **P3a-1: the lock at a first save.** Branch `cut/b2-piece-1c-p3a-1`, worktree `C:/dev/wt/1c-p3a-1`, build folder `D:/wt-targets/1c-p3a-1`, cut from main.
   - **(a) Files and regions.**
     - **`kernel/src/project/mod.rs`, the lock.**
       - `SavedProject` gains a private field holding the `ProjectLock`.
       - At a first save, `Projects::save` takes `ProjectLock::try_lock` after both machine documents are built and before `create_dir_all` (Amendment 30 item 4 (b); Amendment 33 item 9, the reviewer's O1). A refusal before that point therefore writes nothing, and T14 holds unedited.
       - `LockRefused` maps to the existing `SaveFailure::MachineStore`, naming the lock file, so no `pub` item and no wire change are added. `Held` at a first save needs a freshly minted identity to be held already, which ordinary use cannot reach.
       - The lock is kept with the saved entry. It is freed when `Projects` is dropped, and from P3b also at `close_dataset`.
     - **`kernel/src/project/mod.rs`, two doc comments.**
       - `Projects::save`'s doc: the sentence that lists the order of a save is corrected to the order the code follows (ADV-2026-11-18-18 item 4 (a)).
       - `write_machine_file`'s doc names its residual: a crash between the temp's creation and the rename leaves `<name>.tmp-<hex>` in the identity folder, which nothing removes (ADV-2026-11-18-18 item 4 (c), the architect's O-4).
     - **`kernel/src/project/store.rs`, docs only.**
       - `remove_stale_temps`'s doc names its residual: two first saves of different identities into one empty folder, between the folder check and the rename (Amendment 30 item 4 (b)).
       - `Staged::commit`'s doc stops linking the private `sync_folder` (ADV-2026-11-18-18 item 4 (b)).
     - **`kernel/tests/project_save.rs`:** K-O17 and K-O24, appended, using its rig. One line naming them is added to its module doc. No existing line changes.
   - **(b) Tests and mutations** (round-25 rule: apply, run the named test, record its failure by name with the commit, revert; a `verify-mutation` run is not called an observation).

     | Id | Test | Asserts | Mutation |
     |---|---|---|---|
     | K-O17 | `a_project_saved_first_in_this_process_is_refused_to_another_process` (the first half of Amendment 30 item 6 (d)'s working name; its second half, until its dataset closes, is P3b's) | after a real first save, a child process (re-exec, the `project_save_crash.rs` pattern) gets `LockRefused::Held` on the identity; `open.lock` stays empty | no lock taken at a first save |
     | K-O24 | `a_first_save_refused_after_the_lock_leaves_it_free` (off Windows, by a run-time check; the folder made read only in test code) | the save is refused; `ProjectLock::try_lock` on the identity then succeeds | the lock kept with the saved entry on a failed save |

     - K-O24 passes at main by design (main takes no lock), so it is exempt by name from stop 4. Its mutation is the observation.
     - T14 is re-run unedited at P3a-1's candidate, with its mutation (b) observed again. That shows the lock sits after the documents are built.
   - **(c)** P3a-1 adds no `pub` item.

7. **P3a-2: `Projects::open_project`.** Branch `cut/b2-piece-1c-p3a-2`, worktree `C:/dev/wt/1c-p3a-2`, build folder `D:/wt-targets/1c-p3a-2`, cut from main after P3a-1 merges.
   - **(a) Files and regions.**
     - **`kernel/src/project/mod.rs`:** a new region after `save`.
       - `pub fn Projects::open_project(folder, cancel_key, answer, relink)`, with item 5's steps.
       - Its `pub` result types, in kernel terms that mirror §2.2 field for field: `Answer` (`Copy`, `Same`), `Reopen` (`Opened`, `Question`, `NotFound { file_name }`), `Opened`, the view's state (V3), and `OpenFailure`.
       - Private helpers.
       - `skp_error_of` is unchanged: mapping `OpenFailure` to wire codes is P3b's.
     - **`kernel/src/skp.rs`:** item 5 (a)'s split of `open_dataset`. Crate-private only.
     - **`kernel/src/session_history.rs`:**
       - item 5 (f)'s crate-private call;
       - item 5 (g)'s arm of `adopt_project`, if the advisor rules it.
       - The reader items of P2 do not change.
     - **`kernel/src/dataset_ref.rs`:** N-10. The containment sentence in `in_canonical_form`'s doc takes the 2026-10-23 draft's words, point (l) (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md`), applied by script (R1 (g)).
     - **`kernel/tests/project_reopen.rs`:** item (b)'s rows, appended. No existing test changes (I3).
     - **`kernel/tests/project_lock_crash.rs`:** K-O5, appended, using its child pattern.
   - **(b) Tests and mutations** (round-25 rule as in item 6 (b)).
     - Each test fails at main by a missing symbol, which is a compile failure. L5, L6 and L7 are the exceptions, by name: they assert P2's reader as merged, and they are exempt from stop 4.
     - Every case asserts its arm's result and that `open.lock` is free after a refusal.
     - Every case that opens nothing also asserts that the catalog holds no entry for it.

     | Id | Test | Asserts | Mutation |
     |---|---|---|---|
     | K-R1 | `a_link_below_the_folder_is_refused_and_never_opened` | a junction as an intermediate (Windows); a symlink as an intermediate, and a symlink to a regular file as the final segment (off Windows, where it needs no privilege; ADV-2026-11-18-24 item 3 (b)): each refused as through a link, naming the locator's JSON path and the segment | the data step skips `check_inside` |
     | K-R2 | `on_windows_a_junction_out_of_the_folder_is_refused` | as §4 states | the walk follows reparse points |
     | K-R3 | `a_device_name_or_trailing_dot_target_is_refused_at_read_before_any_open` (C-7) | `project_file_refused` at `$.datasets[0].resource.locators[i].at` (built through `SkpError::project_file_refused`, which exists) | `in_canonical_form` not called for a project-relative `at` |
     | K-R4 | `an_unresolvable_target_is_refused_by_name` | a missing intermediate and a missing final, each naming the segment | a missing segment opened as the folder |
     | K-O1 | `a_saved_project_reopens_with_its_data_claims_and_workspace` | after a real save, the reopen's claims, workspace and check | the claims dropped |
     | K-O1 (b) | `a_saved_project_whose_member_records_a_lineage_reopens_with_its_lineage_named` (Amendment 31 item 6) | a hand-built project and lineage file: `Recorded` with its lines for a match; `NotTheRecordedOne` for a file from a different save | step 6 not run |
     | K-O2 | `a_changed_file_is_reopened_with_each_differing_component_named` | as §4 states | only `byte_size` compared |
     | K-O3 | `a_missing_file_returns_not_found_and_opens_nothing` | as §4 states | the machine location falls back to the folder |
     | K-O4 | `a_second_open_of_an_open_identity_is_refused_in_this_process_and_another` | as §4 states, and `folders.json` and `locations.json` byte for byte unchanged | (a) no lock; (b) step 2's writes made before the lock |
     | K-O5 | `the_second_open_refusal_never_outlives_a_crash` (`project_lock_crash.rs`) | a child opens and aborts; after the child's exit has been waited for, the parent's open succeeds | a `create_new` marker in place of the lock |
     | K-O6 | `the_question_is_asked_only_when_the_first_folder_holds_this_identity_or_cannot_be_reached` (five cases, §4; a refused `project.spatial` in the first folder asks) | as §4 states | asked whenever the first folder exists |
     | K-O6 (b) | `a_move_answer_rewrites_folders_json_with_this_folder_first_and_asks_again_at_the_old_path` (Amendment 30 item 6 (d)) | after a move, this folder is `first`; a copy placed back at the old path is asked | the old first kept in `same` |
     | K-O7 | `a_copy_gets_a_new_identity_in_the_new_folder_and_its_own_links` | as §4 states, the first folder's files and the old identity's machine files unchanged | the new identity written to the first folder |
     | K-O8 | `a_relinked_file_is_checked_against_the_observation_and_each_difference_named` | as §4 states; a relative re-link is refused, naming `locations.json`, with nothing written | (a) the check skipped on re-link; (b) the re-link written without `locations_to_bytes` |
     | K-O9 | `a_view_saved_in_another_space_is_not_applied_and_the_reopen_names_it` (V3) | the view's named state with its basis | the spaces compared by identifier only |
     | K-O10 | `a_folders_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept` (M1; cases: a duplicate key, 257 folders as hand-built bytes) | refused, naming the file; its bytes unchanged | a refused file replaced by a fresh one |
     | K-O10 (b) | `a_locations_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept` (Amendment 30 item 6 (d); cases: a relative `path`, a bad dataset URI, a wrong format; ADV-2026-11-18-18 item 4 (c)) | the same | the same |
     | K-O11 | `a_same_answer_past_256_known_folders_is_refused_and_none_is_forgotten` (M2) | as Amendment 1 item 5 states | the oldest `same` entry dropped |
     | K-O12 | `a_project_file_over_its_ceiling_is_refused_at_reopen_without_being_read_whole` (class 9) | `set_len` to 1,048,577: refused by name | the read unbounded |
     | K-O13 | `a_cancel_before_the_engine_open_ends_the_reopen_with_nothing_opened_and_no_lock_held` (class 9; the rig widens step 6 with a valid lineage file near its bound, and a thread cancels the key as soon as the registry holds it) | cancelled; nothing opened; lock free | the key registered only by `open_dataset` |
     | K-O14 | `a_refused_or_cancelled_reopen_leaves_open_lock_free` (class 9; cases: not found, through a link, an engine refusal after the lock) | the lock can be taken after each | the error arm keeps the guard |
     | K-O15 | `on_windows_a_reopened_project_relative_open_is_watched` (class 9) | the arm reports watching for the `\\?\` path | the arm given another spelling than the engine's |
     | K-O16 | `a_save_after_a_reopen_whose_project_record_another_run_left_replaces_neither_history` (sub-case 1; R3 (b)) | a later run (a new recorder and `Projects` over the same roots, with no `end_session`): the save replies withheld as `HistoryUnwritable`; the earlier record byte for byte; the open's own record keeps its steps; no mark in either | `copy_under` writes into an existing folder |
     | K-O18 | `a_save_after_a_reopen_with_no_step_whose_project_record_another_run_left_leaves_it_and_keeps_the_open_unbound` (sub-case 2; contingent on P-2) | withheld as `HistoryUnwritable`; the earlier record unchanged | the open bound without a move over another run's folder |
     | K-O19 | `the_first_step_after_that_save_meets_no_leftover_folder_and_has_a_record_of_its_own` (the leftover folder meeting the first step's create; R3 (b)) | under P-2 option (i): the step is recorded under its own record and the leftover is unchanged; under option (ii): the step is refused and the leftover is unchanged | `create`'s `create_dir` replaced by `create_dir_all` |
     | K-O20 | `a_later_save_of_a_reopened_project_whose_member_records_a_lineage_is_refused_and_the_files_are_kept` (R3 (d)) | `LineageNotKept`; `project.spatial` unchanged | the kept-lineage refusal removed |
     | K-O21 | `a_save_after_a_reopen_keeps_the_project_and_dataset_identities_and_the_folder` (O-11; O-6 item 2) | the next save writes the same project URI and dataset URI into the same folder, and a step's `data.dataset` is the file's dataset URI | (a) not registered in the saved list; (b) the recorder's minted dataset URI kept |
     | K-O22 | `a_reopen_in_the_run_that_holds_the_projects_record_continues_it_from_the_first_step` (OPEN-N4 (a); O-6 item 1; the first `Projects` is dropped to free the lock, standing in for P3b's close) | the first step after the reopen has the record's last step as its parent | no bind at the reopen |
     | K-O23 | `on_windows_a_folder_spelled_with_another_case_is_the_known_folder` | opened with no question; `folders.json` unchanged | compared as written |
     | L5 | `a_previous_lineage_whose_hash_matches_but_whose_step_count_does_not_is_named_and_not_used` (ADV-2026-11-18-23 item 2 (a)) | `previous_file` is `NotTheRecordedOne` and `lineage` is `None` | the count comparison in `read_lineage`'s arm 2 removed |
     | L6 | `a_lineage_file_with_two_broken_lines_is_named_by_the_first` (Amendment 34 item 9) | `Damaged` at the first line in file order | the reader goes past the first failure |
     | L7 | `a_link_at_the_lineage_name_beside_a_not_kept_member_is_named_and_never_followed` (ADV-2026-11-18-23 item 2 (c); a dangling symlink off Windows, a junction on Windows) | `NotRead` | `symlink_metadata` replaced by `metadata` |

     - No existing test is edited (I3).
   - **(c) Pre-committed producers** (R2): see item 8.

8. **Producers and their consumers.**

   | Producer | Consumer | Seam's end-to-end test |
   |---|---|---|
   | `resolver::check_inside`, `CheckRefused` (P1a) | P3a-2's data step | K-R1 to K-R4; E-REOPEN (P4) |
   | `ProjectLock`, `LockRefused`, `OPEN_LOCK` (P1b) | `Projects::save` at a first save (P3a-1); step 3 (P3a-2); the binding (P3b) | K-O17, K-O24, K-O4, K-O5, K-O14; P3b: `a_reopen_after_a_session_end_in_the_same_process_takes_the_lock` and the second half of `a_project_saved_first_in_this_process_is_refused_to_another_process_until_its_dataset_closes`; E-SECOND, E-CRASH-UNLOCK (P4) |
   | `KnownFolders::with_same`, `KnownFoldersFull` (P1b) | the `same` arm | K-O11, K-O6 |
   | `KnownFolders::moved_to` (P1b) | the move arm | K-O6 (b) |
   | `store::read_locations`, `Location` (P1b) | the machine-location arm | K-O3, K-O10 (b) |
   | `session_history::read_lineage` and its types (P2) | step 6 | K-O1 (b), L5 to L7; P3b's `v0-open_project-opened-lineage`; P4's shell test |
   | `Projects::open_project`, `Answer`, `Reopen`, `Opened`, the view's state, `OpenFailure` (P3a-2) | P3b's binding command and its wire mapping | P3b's `v0-open_project-*` fixtures; E-REOPEN (P4) |

   - Each working-named test of P3b and P4 is declared in full, with its mutation, in that piece's amendment before its code (R2 (b)).
   - The node is not done until each seam's test has passed on main (R2 (c)).
   - Any other `pub` item is a gate finding (R2 (d)).
   - All of these are named in each part's PR body and in the node's plan summary.

9. **Not covered, by name, with the reason.**
   - `CheckRefused::FolderUnresolvable` through the data step (ADV-2026-11-18-24 item 3 (c)). Step 1 has just read `project.spatial` from the folder, so `canonicalize` fails at step 4 only if the folder changes between the two steps, which no test can build without a seam. The arm maps to an `OpenFailure` that names the folder. Its code is P3b's (packet P-6).
   - `NotCanonical` through the data step: it cannot be reached (item 5 (e)).
   - `KnownFolders::with_same` with the folder equal to `first`: the known check returns first (ADV-2026-11-18-18 item 4 (c)).
   - D-16's `eprintln!` line (ADV-2026-11-18-18 item 4 (c)). T7 reaches the branch, but no test reads standard error.
   - The temp that `write_machine_file` leaves after a crash (the architect's O-4). It is named in its doc by P3a-1; nothing removes it.
   - For a not-kept member, a metadata error other than not-found (ADV-2026-11-18-23 item 2 (c)). It is read as `NotRead`, which is the reader's code as merged. No test can make the folder readable while that one name's metadata fails.
   - Two live opens bound to one record (O-6 item 3). K-O4 refuses a second live open of one identity in this process, and `StepRecorder::record_step` refuses a name the catalog no longer holds.
   - For a kept member, a link at the lineage name is followed by `File::open` (packet P-9).
   - The cloud placeholder (Amendment 35 item 6).

10. **ADR-036 Amendment 3** (R4).
    - It lands in P3a-2's pull request, copied by script (R4 (d)).
    - Its item 1 is OPEN-S2-1 (c)'s body, the body of line 360 of `state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md`, byte for byte as the packet's first fence. Its item 2 is OPEN-S2-2 (a)'s body, line 376 of the same file, as the second fence.
    - The heading and the lead-in are the architect's draft, in the packet (P-3). Nothing is reworded.
    - The clause check against ADR-036 Amendment 2 items 1, 2 and 4 goes to the advisor before either part's code (R4 (c); packet P-2 and P-3). One clause does not hold at main for sub-case 2 (item 5 (g)). It goes to the advisor, and on to the human if the advisor so rules.

11. **Regions against the pieces in flight.**
    - P3a touches nothing in `protocol/`. Rule (00) leaves it free for P3b.
    - The first look and the stop alarm touch no kernel file.
    - P3a-2 takes main in before its gate (ADV-2026-11-16-06 item 4).
    - The reviewer recomputes each file list with git against its branch.

12. **Stops.** The worker stops and reports alone when any of these happens:
    1. A file or region outside item 6 (a) or 7 (a) is needed. `protocol/`, `frontends/` and `resolver.rs` (unless P-6 (ii) is ruled) are among them.
    2. A `pub` item outside item 8 is needed.
    3. An existing test needs an edit (I3), or a dependency or a lock file changes (I6).
    4. A test other than K-O24, L5, L6 and L7 passes at its base before its code, or a mutation does not fail its test.
    5. `open_dataset`'s split changes a test of `open_dataset`, or its behaviour.
    6. K-O5, K-O13 or T6 fails on any platform, or cannot be made deterministic.
    7. A case a test cannot build. That is a stop, not a skip.
    8. P3a-2's code is begun before the advisor's ruling on packet P-1 to P-3.

13. **Class and gates.**
    - **Full class, both gates, for each part** (ADV-2026-11-16-06 item 2 (a)). The grounds:
      - a lock;
      - a path check;
      - a persistence format;
      - concurrency and cancellation;
      - seams;
      - and, for P3a-2, more than 260 lines.
    - **Clippy** (ADV-2026-11-18-24 item 5 (b)). The reviewer runs `cargo clippy --locked -p spatial-kernel --all-targets` at the gated head, in a hold. A warning in a file the part changes is a finding.
    - **On the laptop,** by THE MACHINE paragraph, each part keeps at its final candidate:
      - the focused test targets (`project_save`, `project_lock_crash`, `project_reopen`, `project_resolver`, `project_store`, `session_history` and the skp targets);
      - every mutation of item 6 (b) or 7 (b), observed;
      - §2.11's command;
      - empty lock-file diffs.
    - **One E-SAVE run per part,** an app-window run. P3a-1 changes every first save the shipped app makes, and P3a-2 changes the shipped `open_dataset` path.
    - **CI:** the workspace on three platforms, fmt, and the governance workflows.

14. **Where each ruling item is met.**
    - ADV-2026-11-16-10:
      - R1 (d): item 3;
      - R1 (g): K-R1 to K-R4, and N-10 in item 7 (a);
      - R2: item 8;
      - R3 (a) to (d): items 5 (f) to (h), with K-O16 to K-O22;
      - R4: item 10;
      - item 5: the lead-in.
    - ADV-2026-11-16-16 item 3: item 6 (a).
    - ADV-2026-11-18-18 item 4 (a) and (b): item 6 (a). Item 4 (c): K-O8, K-O10 (b) and item 9.
    - ADV-2026-11-18-23 item 2 (a): L5. Item 2 (b): item 5 (a) and (b), with K-O13. Item 2 (c): L7 and item 9.
    - ADV-2026-11-18-24 item 3 (a): item 5 (e). Item 3 (b): K-R1. Item 3 (c): item 9. Item 5: item 13.
    - Amendment 33 item 9: items 5 (d) and (j), and 6 (a).
    - Amendment 34 item 9 (P3a): L5, item 5 (b), L6 and L7.
    - Amendment 35 item 10 (P3a): items 5 (e) and 9, with K-R1 and K-O1.
    - Amendment 30 item 3's O-items for P3a:
      - O-5: R3;
      - O-6 items 1 to 5: K-O22, K-O21, item 9, K-O19, and K-O16 with K-O18;
      - O-10: item 5 (a);
      - O-11: K-O21;
      - O-21: K-R3 and N-10.

15. **Superseded index.**
    - §2.4 step 3's lock is widened to a first save (Amendment 30 items 4 (b) and 8; class 5, ADV-2026-11-16-16 item 3).
    - §2.4's order is qualified by item 5 (b): step 2's writes come after the lock, and step 6 comes before step 4's engine open (class 1).
    - §2.11's step-2 kernel product list gains `kernel/src/skp.rs` (class 9).
    - §4's step-2 table gains K-O17 to K-O24 and L5 to L7, with K-O12 to K-O16 declared (class 9).
    - Amendment 34 item 3's group figures are superseded by item 2.
    - Nothing else is superseded.

16. **The packet, as the advisor ruled it (ADV-2026-11-19-04).** Where an item above says "contingent", "recommended" or "if the advisor rules", this item settles it.
    - P-1: two parts, P3a-1 and P3a-2, as item 3 declares.
    - P-2: option (i). Item 5 (g) is in force: `adopt_project` does not bind an open with no record of its own to a project whose record another run left. K-O18 stands as declared. K-O19 asserts option (i)'s outcome only: the step is recorded under a record of its own and the leftover folder is unchanged.
    - P-3: ADR-036 Amendment 3 lands in P3a-2's pull request with the heading and lead-in of ADV-2026-11-19-04 item 4, its two items byte for byte.
    - P-6: option (i). `kernel/src/project/resolver.rs` does not join P3a-2, and item 4's contingent line lapses. A missing segment of a `project-relative` target is refused by name, as §2.5 and ADR-036's containment paragraph say. K-R4 stands as §4 states it.
    - P-9 (a), (b), (d) and (e): as recommended. The lock lives in `Projects`'s saved entry; K-O22's rig stands; the child pattern may be copied into `project_save.rs`; the order of item 5 (b) is class 1.
    - P-4, P-5, P-8 and P-9 (c) are P3b's. Its declaring amendment states them, under ADV-2026-11-19-04 item 6.

Read the last amendment first.

Nothing above is edited.

## Amendment 37 — P3a-1's stop at its head, written after the result was seen (class 1): K-S13's expected list gains `open.lock`, and `mod.rs`'s module doc is corrected, a scope addition (class 9) on ADV-2026-11-16-16 item 3; K-O24 on every platform (packet P-10); `Projects::save`'s doc corrected; the worker's departures; the next steps

*Drafted by the architect for the custodian, read only, at main 85250a8d95b788e4f1e84ba8f0fff39f0fd5b0c1 and at the branch head 2519aef1fc8798760afb9d8f3dd8d2527b67ebe1, and appended by the custodian's script. References only. Each Old block is code text the architect copied byte for byte from its own Read of the named file at 2519aef1fc8798760afb9d8f3dd8d2527b67ebe1, not by script. Before appending, the custodian's script checks that each Old block occurs exactly once in that file at that commit. Nothing else below is a quotation. Code is cited by path and symbol. Each choice is the custodian's declaration. Where it is the architect's recommendation, it says so.*

1. **The stop.**
   - The worker-high ran from 2026-11-19T00:53:47Z to 01:27:38Z, by its transcript.
   - The branch is `cut/b2-piece-1c-p3a-1`, base 0c5f85a1b8fcf2bff4e1972ebae4f4c081c5744d. It has three commits: 077fe26bc26672336895224b91b675f4b87d1381, ef6d65942e5b3013319fcdc9c74eea0cbbefa2a2 and 2519aef1fc8798760afb9d8f3dd8d2527b67ebe1. The pushed head is 2519aef1 and there is no pull request. The worker's report is filed by the custodian.
   - **P-base** at ef6d6594, exit 101:
     - K-O17 failed at its reply assertion, with `Ok(Some("taken"))` against `Ok(Some("held"))`, as predicted.
     - K-O24 passed. It is exempt by name.
     - Every existing test passed.
   - **P-head** at 2519aef1, exit 101. One test failed: K-S13, `the_first_save_records_its_folder_as_first_in_folders_json`, at its last assertion. The identity's folder holds `open.lock` beside its two documents, because `store::ProjectLock::try_lock` creates `store::OPEN_LOCK` under `store::record_dir`.
   - This is item 12's stop 3: an existing test needs an edit.
   - Stop 4 also waits at the mutation step. K-O24 returns at once on Windows, so its mutation cannot fail it on the laptop. The worker's probe found that a Windows folder with the ReadOnly attribute still takes a new file. Its output is evidence and is filed with the worker's report.
   - No mutation was observed, and §2.11's command was not run.

2. **K-S13** (scope addition, class 9, on ADV-2026-11-16-16 item 3, the lock at a first save; Amendment 36 item 15's first row). This is an edit to an existing test, declared before the edit.
   - The expected list gains `open.lock`.
   - The message "no temp file is left" stays true: the comparison is exact, so it still excludes every temp name. But it would name the wrong cause when the lock is missing, so it changes too.
   - `kernel/tests/project_save.rs`, K-S13. Old:
     ```
         assert_eq!(
             file_names(&record),
             ["folders.json", "locations.json"],
             "no temp file is left"
         );
     ```
     New:
     ```
         assert_eq!(
             file_names(&record),
             ["folders.json", "locations.json", "open.lock"],
             "the two documents and the lock, and no temp file"
         );
     ```
   - Cost: 2 lines added and 2 deleted.
   - **Mutation owed.** K-O17's mutation ("no lock taken at a first save") is applied once. Both of these are recorded by name from that one application:
     - K-O17 fails at its reply assertion;
     - K-S13 fails at its last assertion.
   - K-S13's own recorded mutation is unchanged.

3. **K-O24** (packet P-10, for the advisor).
   - **Reading `Projects::save`'s order at the head:** no set-up built from std alone fails after `store::ProjectLock::try_lock` on every platform.
     - `std::fs::create_dir_all` of the identity's folder cannot fail, because `try_lock` has just made that folder.
     - The two `write_machine_file` calls write into a folder named by an identity that is minted inside the save, so a test cannot place anything there beforehand.
     - `store::replace`'s target is refused before the lock if anything exists there (the first-save `symlink_metadata` check, `SaveFailure::FolderHoldsProject`).
     - The temp name of `store::stage` is random.
     - Two other routes were set aside: a thread racing the save is not deterministic (stop 6's standard), and path-length bounds differ by platform, with T14's 4,096-byte bound refusing first on Windows.
   - **The options:**
     - **(i)** K-O24 stays off Windows. Its mutation is observed on CI: the mutation is committed on a scratch branch that is never merged and pushed in its own call, and Ubuntu's and macOS's Rust workspace runs show K-O24 failing at its last assertion. The run ids and the commit are recorded, and the mutation is then reverted.
       - Cost: no lines (`project_save.rs` 117 of 130 with item 2).
       - Item 13's laptop mutation line is superseded for K-O24.
       - Windows, the shipped build's platform, stays unproven by any test.
     - **(ii)** The same assertions on every platform. Off Windows the folder is made read only, as now. On Windows, `icacls` adds an entry that denies Everyone (`S-1-1-0`) the right to add a file (`WD`) to the folder, and removes it after the save.
       - Cost: about 10 net lines (`project_save.rs` about 127 of 130; an overrun would be class 8 at the closing).
       - This uses a system tool from test code, with no crate, no `cfg` and no lock-file change.
       - It needs a probe first, because no prior art is recorded (the reuse index).
       - The mutation is observed on the laptop, as item 13 asks.
     - **(iii)** The mutation is recorded as not observed on the laptop.
       - Cost: no lines.
       - K-O24 would then have no observed failure anywhere, which leaves its stop-4 exemption (Amendment 36 item 6 (b)) without its basis. That is an Evidence gap at the gate.
   - **Recommended:** (ii), with (i) as the declared fallback if the probe fails. Not (iii).
   - **Under (ii)**, `kernel/tests/project_save.rs`, K-O24. Old A:
     ```
     /// **K-O24**, off Windows only, checked at run time; it prints the operating system it ran on. A
     /// first save into a folder this test made read only is refused when it stages the project file,
     /// which comes after the lock, and `ProjectLock::try_lock` on the identity then succeeds: the
     /// refused save freed its lock. On Windows a folder marked read only still takes a new file, so the
     /// case is not built there: the test returns at once and proves nothing.
     ///
     /// RECORDED MUTATION: the lock kept with the saved entry on a failed save. Expected failure (off
     /// Windows): the lock is refused as held, and this test fails at its last assertion.
     #[test]
     fn a_first_save_refused_after_the_lock_leaves_it_free() {
         println!("K-O24 runs on {}", std::env::consts::OS);
         if std::env::consts::OS == "windows" {
             return;
         }
         let rig = rig("ko24");
     ```
     New A:
     ```
     /// **K-O24**: a first save into a folder this test made refuse a new file is refused when it
     /// stages the project file, which comes after the lock, and `ProjectLock::try_lock` on the
     /// identity then succeeds: the refused save freed its lock. Off Windows the folder is made read
     /// only. On Windows, where a folder marked read only still takes a new file, `icacls` adds an
     /// entry denying Everyone (`S-1-1-0`) the right to add a file to it, and removes that entry after
     /// the save.
     ///
     /// RECORDED MUTATION: the lock kept with the saved entry on a failed save. Expected failure: the
     /// lock is refused as held, and this test fails at its last assertion.
     #[test]
     fn a_first_save_refused_after_the_lock_leaves_it_free() {
         let rig = rig("ko24");
     ```
     Old B:
     ```
         let folder = rig.folder.as_path();
         let before = std::fs::metadata(folder).expect("folder").permissions();
         let mut read_only = before.clone();
         read_only.set_readonly(true);
         std::fs::set_permissions(folder, read_only).expect("the folder made read only");
         let ws = workspace(&ds, None, -4.5);
         let result = rig.projects.save(handle.as_str(), &ds, Some(folder), ws);
         std::fs::set_permissions(folder, before).expect("the folder's permissions restored");
     ```
     New B:
     ```
         let folder = rig.folder.as_path();
         let before = std::fs::metadata(folder).expect("folder").permissions();
         let mut read_only = before.clone();
         read_only.set_readonly(true);
         let windows = std::env::consts::OS == "windows";
         let icacls = |args: [&str; 2]| {
             let status = Command::new("icacls").arg(folder).args(args).status();
             assert!(status.is_ok_and(|s| s.success()), "icacls {args:?}");
         };
         if windows {
             icacls(["/deny", "*S-1-1-0:(WD)"]);
         } else {
             std::fs::set_permissions(folder, read_only).expect("the folder made read only");
         }
         let ws = workspace(&ds, None, -4.5);
         let result = rig.projects.save(handle.as_str(), &ds, Some(folder), ws);
         if windows {
             icacls(["/remove:d", "*S-1-1-0"]);
         } else {
             std::fs::set_permissions(folder, before).expect("the folder's permissions restored");
         }
     ```
     - The rest of K-O24 is unchanged.
     - The mutation stays as declared, and it is now expected to fail on every platform.
     - At base, K-O24 still passes (no lock is taken), so it stays exempt by name from stop 4.
     - A deny entry left by a failed run does not stop the rig from removing the folder on the next run.

4. **`mod.rs`'s module doc** (scope addition, class 9, on ADV-2026-11-16-16 item 3). Its `Projects::save` bullet lists the save's order without the lock. Its sentence on handles is untrue at the head, because `SavedProject::_lock` holds a handle on `open.lock`.
   - `kernel/src/project/mod.rs`, module doc. Old:
     ```
     //! - [`Projects::save`]: the save, in order: the checks that can refuse it, the judgment, the
     //!   document, the machine store's files, the atomic replace of `project.spatial`, and last the
     //!   history's two moves (binding the open to the project, which moves the open's own record under
     //!   the project if it has one, and the `saved-here` mark in the project's record).
     ```
     New:
     ```
     //! - [`Projects::save`]: the save, in order: the checks that can refuse it, the judgment, the
     //!   document, the machine store's documents built, at a first save the identity's open lock
     //!   ([`store::ProjectLock`]), the machine store's documents written, the atomic replace of
     //!   `project.spatial`, and last the history's two moves (binding the open to the project, which
     //!   moves the open's own record under the project if it has one, and the `saved-here` mark in the
     //!   project's record).
     ```
     Old:
     ```
     //! Nothing here holds a handle. The only files written in a project folder are `project.spatial`
     //! and the temporary file that [`store`]'s atomic replace renames over it.
     ```
     New:
     ```
     //! No handle is held in a project folder. [`Projects`] holds one on `open.lock` in the machine
     //! store for each identity it saved first, until it is dropped. The only files written in a
     //! project folder are `project.spatial` and the temporary file that [`store`]'s atomic replace
     //! renames over it.
     ```
   - Cost: 10 + 6 lines.
   - Neither sentence is the human's wording.

5. **`Projects::save`'s doc** (within Amendment 36 item 6 (a)). "which [`Projects`] holds until it is dropped" does not hold for a first save refused after the lock: the `lock` local is dropped at each `?` that follows `try_lock`.
   - Old:
     ```
         ///   lock ([`store::ProjectLock`]), which [`Projects`] holds until it is dropped. The save then
         ///   writes `locations.json`, and `folders.json` at a first save, and replaces
         ///   `project.spatial` whole or not at all.
     ```
     New:
     ```
         ///   lock ([`store::ProjectLock`]). The save then writes `locations.json`, and `folders.json`
         ///   at a first save, and replaces `project.spatial` whole or not at all. A first save that
         ///   replaces it keeps the lock in [`Projects`] until that is dropped; one refused after the
         ///   lock frees it.
     ```
   - This is a worker's sentence, not the human's.
   - `mod.rs` comes to about 58 of 60 with item 4.

6. **The worker's departures** (class 1, disclosed). The record keeps the following.
   - **(a)** The first two pushes ran inside compound calls. The record keeps that the head equals origin, that the porcelain is empty, and that the diff names only item 6 (a)'s three files; the reviewer rechecks the file list.
   - **(b)** `--no-fail-fast` was added, and `--lib` ran whole rather than `--lib project`. The runs were widened, not narrowed. P-base 1 at 077fe26b stopped after `project_save`, so P-base is the run at ef6d6594. From here on, the declared commands carry `--no-fail-fast`. The record names the one ignored lib test from the run's log.
   - **(c)** `Clone` is no longer derived on `SavedProject`, because a `File` is not `Clone`. `SavedProject` is private, and every use is in `kernel/src/project/mod.rs`. `Projects::save`'s lookup now clones the three fields it reads. Behaviour and `pub` items are unchanged.
   - **(d)** ef6d6594 fixes K-O17's own new test (how it finds the child's line), after a P-base failure with the wrong cause (`Ok(None)`) and before the predicted failure was seen. It is not I3, as with Amendment 33 item 3's fix commit. The reviewer confirms that it changes no assertion.
   - **(e)** The branch's CI on push is red at 2519aef1 from K-S13. The closing amendment names each red run on the branch with its commit and its cause.

7. **What the worker does next**, once this amendment is on main. Item 12's stops stand, with one addition: the probe in step (1) shows anything other than both of its results.
   1. **Under (ii) only: the probe.** In a scratch folder outside the repository, with no repository file:
      - `icacls <folder> /deny *S-1-1-0:(WD)`, then a new file is refused;
      - `icacls <folder> /remove:d *S-1-1-0`, then a new file is taken.
      The output goes into the report, copied byte for byte. If the probe shows anything else, the worker stops, and (i) applies as declared in item 3.
   2. **Commit `test:`** with item 2's edit and, under (ii), item 3's edit. Only the test file changes.
   3. **Commit `docs:`** with items 4 and 5. Only comment lines change.
   4. **P-head** at that commit, in one hold, with `--no-fail-fast`, over item 13's focused targets and the lib. Every test passes.
   5. **Mutations, by the round-25 rule:** apply, run the named test, record its failure by name with the commit, and revert, checking that the diff is empty after each revert.
      - K-O17's mutation: K-O17 and K-S13 fail, as item 2 says.
      - K-O24's mutation: on the laptop under (ii), or by (i)'s CI route.
      - T14's mutation (b), observed again (Amendment 36 item 6 (b)).
   6. **Counts and checks:**
      - §2.11's command;
      - `git diff --numstat 0c5f85a1b8fcf2bff4e1972ebae4f4c081c5744d...HEAD` against item 4's ceilings, with any overrun recorded as class 8 at the closing;
      - empty lock-file diffs;
      - no new `pub` item.
   7. **Push** in its own call. The report is the worker's final message.
   - **Then the custodian's steps, as item 13 sets them:** both gates, the reviewer's clippy, one E-SAVE run, and CI.

8. **Superseded index.**
   - Amendment 36 item 6 (a)'s "No existing line changes" (`project_save.rs`) is superseded for K-S13's last assertion (item 2).
   - Item 6 (a)'s regions gain `mod.rs`'s module doc (item 4).
   - Under (ii), item 6 (b)'s K-O24 row ("off Windows, by a run-time check; the folder made read only") is superseded by item 3. Under (i), item 13's laptop mutation line is superseded for K-O24 alone.
   - Nothing else is superseded.

9. **The packet and the notes, as the advisor ruled them (ADV-2026-11-19-05).** Where an item above says "recommended", "under (ii)", "under (i)" or "for the advisor", this item settles it.
   - **P-10: option (ii), with (i) as the fallback item 3 declares.** Item 3's New A and New B are in force. The folder of item 7 step (1)'s probe is made under the directory `std::env::temp_dir()` names on the laptop, where the test's rig makes its own, so the probe and the test meet the same volume.
   - **The fallback.** If the probe shows anything other than both of its results, or if the Guardian refuses one of its calls, the worker stops and the refusal is not worked around. Nothing of New A or New B is committed, and (i) applies without a further ruling. The scratch branch is named in the closing with its commit and its run ids, and no pull request is opened from it.
   - **`icacls` is not a dependency.** It ships with Windows; no crate, manifest, lock file or workflow changes and CI installs nothing. It is called on the test's own folder under the temp directory, and the entry is removed after the save.
   - **`icacls` prints the path of the folder it changes.** A log or a report that carries that line is filed with the path replaced, as any other path is (ADV-2026-11-18-07).
   - **Class 9's hook (note 1).** A ruling of the advisor under the delegation of 2026-11-13 counts as the hook class 9 asks for. The grant's item 2 says such a ruling stands as the human's on gate rulings and standing rules. The amendment's first line cites it by its id, and the record by its filed path.
   - **Note 4.** P3a-1's closing amendment carries a "not covered" row: a first save refused after the lock leaves the identity's folder and its `open.lock` in the machine store, and nothing removes them. The custodian adds one line to the notes of the node `b2-piece-1c-step-3-recovery-offer`: its form states what it does with an identity's folder that no project file names.
   - **Note 5.** The module doc of `kernel/tests/no_generation_in_persisted_artifacts.rs` names `open.lock` in P3b. P3b's declaring amendment lists the file and gives the words.
   - **Item 6.** The five departures stand as recorded, class 1. For (d), the reviewer confirms at the gate that ef6d6594 changes no assertion.
   - **Item 7.** Under (ii) the closing names, from the logs, each platform on which K-O24 ran its assertions at the gated head.

Read the last amendment first.

Nothing above is edited.

## Amendment 38 — P3a-1's closing, before its merge request: the gates; the words commit, as ruled; the counts, with no class 8 row; a correction of one word (class 3); the module doc's paragraph replaced; what is not covered; what the user is told; clippy; the runs and E-SAVE; CI, K-O24 on each platform and the red runs; the departures; the holds; notes for P3a-2, P3b, P4 and P5

*Written by the custodian, 2026-11-19, before PR 334's merge request. References and hashes only. Items 6 and 7 carry the advisor's wording, under the delegation of 2026-11-13, copied by the custodian's script byte for byte from the ruling's file. Item 4 names one word of the form. Nothing else below is a quotation.*

1. **The gates** (Amendment 36 item 13). Both at H = c905c7ea06cbe9e354c346e3a7777c3a2546bd85, both PASS WITH NOTES, with no Correctness or Evidence finding: `state/consults/gates/2026-11-19-b2-piece-1c-save-and-reopen-p3a-1-gate-architect.md` and `state/consults/gates/2026-11-19-b2-piece-1c-save-and-reopen-p3a-1-gate-reviewer.md`. The worker-high's reports: `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3a-1-worker-high-report.md` and `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3a-1-resumed-worker-high-report.md`. The ruling on the words: `state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-07-the-words-in-pr-334-p-1-and-p-2-yes-in-the-gates-words-the-not-covered-row-and-the-user-told-line-given.md`.
2. **The words commit** (ADV-2026-11-19-07 items 1 to 3 and 8). W = b680aeac654ac2198c6748dfdd42c393324a6150, the one commit after H. It carries four blocks, applied by the custodian's script byte for byte from the filed gate reports: in `kernel/src/project/store.rs`, the architect's D1 (`remove_stale_temps`'s doc) and D2 (`Staged::commit`'s doc); in `kernel/src/project/mod.rs`, the reviewer's D1 (the comment above the lock) and D2 (the module doc's second paragraph). Comment lines only, with no re-gate (ADV-2026-11-16-06 item 2 (c); ADV-2026-11-19-07 item 8).
3. **The counts** (Amendment 36 item 4, both columns; ADV-2026-11-19-04 item 7), `git diff --numstat 0c5f85a1...b680aeac`:
   - `mod.rs` 57 (45 added, 12 deleted) of 60; `store.rs` 14 (11 and 3) of 20; kernel product 71 of 80;
   - `project_save.rs` 127 (125 and 2) of 130; kernel tests 127 of 130;
   - in all, 198 lines in 3 files, against 210 and 3. No row is over, so there is no class 8 row for P3a-1. Of item 4's remainders, 608 for kernel product and 417 for kernel tests, 537 and 290 are left before P3a-2.
   - At H the reviewer's recount by §2.11's command gave 56, 9 and 127 (its check 3). W adds 1 line to `mod.rs` and 5 to `store.rs`, all comment lines.
   - From the merge base, which is the branch's base, to main, no path of the pull request changed (ADV-2026-11-14-21 item 6 (a)).
4. **A correction (class 3), one word** (ADV-2026-11-19-07 item 1; the architect's O8). Amendment 30 item 4 (b), and Amendment 36 item 6 (a) after it, place `remove_stale_temps`'s residual in an empty folder. A first save's check asks only that the folder holds no `project.spatial` (`SaveFailure::FolderHoldsProject`), so that word was narrower than the code. W's doc names the folder by that check. Neither amendment is edited.
5. **The module doc's paragraph** (ADV-2026-11-19-07 item 2; the reviewer's D2 and its draft A). The paragraph that Amendment 37 item 4 gave and ADV-2026-11-19-05 item 4 approved spoke for the whole app. On Windows the engine's source watcher holds directory handles in a project folder when its data sits there. W's paragraph scopes the handle sentence to the module and keeps every other clause. Amendment 37 is not edited; item 14 records what is superseded.
6. **Not covered** (Amendment 37 item 9, note 4; ADV-2026-11-19-07 item 4; the architect's A1 with the reviewer's O2). The advisor's wording, under the delegation of 2026-11-13:

   Not covered. A first save refused after the lock is taken leaves the identity's folder in the machine store, with its `open.lock` and, where the save wrote them before its refusal, `locations.json` and `folders.json`; a refusal at the project file, a project folder that takes no new file among its causes, leaves all three. A lock that is refused by an input or output error after its folder is made leaves that folder too, with `open.lock` if the file was created. Nothing removes them. The mapping of a refused lock to the save's refusal (`lock_refused` in `Projects::save`) has no test: its `Held` arm cannot be reached at a first save (Amendment 36 item 6 (a)), and its `Io` arm can be reached and is not tested.

   - Note 4's line is in the notes of the node `b2-piece-1c-step-3-recovery-offer` in `governance/PLAN.yaml`.
7. **What the user is told** (ADV-2026-11-19-07 item 5; the architect's A2; the reviewer's O3 and its draft B). The advisor's wording, under the delegation of 2026-11-13:

   What the user is told changes for one case: a first save whose machine-store folder or `open.lock` cannot be made, opened or locked ends in `project_file_unwritable` with the detail `open.lock: ` and the operating system's error, where main named the project's machine folder; `Held` gives `open.lock: another handle holds it`, which ordinary use cannot reach at a first save. No shell string changes.

   - The message stands as built in P3a-1. It joins P4's strings, which go to the advisor (item 13).
8. **Clippy** (ADV-2026-11-18-24 item 5 (b); Amendment 36 item 13). The reviewer ran `cargo clippy --locked -p spatial-kernel --all-targets` at H in a hold: rc 0, 9 warnings, none in the three files the part changes (its check 8). There is no finding.
9. **The runs and E-SAVE** (Amendment 36 item 13; ADV-2026-11-16-06 item 1).
   - **Reused:** the worker-high's P-head at H, from its log (the reviewer's check 8). The log has no head line; the reviewer dates it to H by its file time, which CI corroborates (its O6).
   - **Run by the reviewer at H, in one hold:** `project_reopen`, `project_resolver`, `project_save_skp` and `session_history`, cargo rc 0 (its check 8).
   - **The mutations at H,** by the round-25 rule (the reviewer's check 7): K-O17's fails K-O17 and K-S13, each at its own assertion (Amendment 37 item 2); K-O24's fails K-O24 at its last assertion on Windows, on the laptop; T14's (b) fails T14; and the reviewer's supplementary mutation (d), the lock moved alone above the documents, fails T14.
   - **The probe** of Amendment 37 item 7 (1): the worker-high's on C: (item 11 (a)) and the reviewer's on D:, the volume the test's rig uses, each with both results (the reviewer's check 6).
   - **E-SAVE,** one app-window run at H: 12 PASS, 0 FAIL, rc 0 (`state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3a-1-e-save-series-tester-report.md`; the reviewer's check 8). It was filed with the masks the reviewer's O8 asks for; its filing note lists them.
   - Nothing was run again at W, which changes comment lines only; CI ran at W (item 10).
10. **CI, K-O24 on each platform, and the red runs** (Amendment 37 items 6 (e) and 9; ADV-2026-11-19-07 item 7; the reviewer's O7).
   - At H, read by the reviewer at 2026-11-19T03:42:40Z: twelve runs, all success. The Rust workspace ran in the push run 44447998372 and the pull_request run 44448999249 (its check 10).
   - K-O24 ran its assertions on ubuntu-24.04, macos-latest and windows-latest in both of those runs, by each job's log line for the test (the reviewer's check 10). It has no early return at H (its check 5). (ii) was built; (i)'s fallback was not used, and no scratch branch was made.
   - At W, read 2026-11-19T04:37:24Z: twelve runs, all success, among them the Rust workspace on all three platforms in the push run 44457102819 and the pull_request run 44457108613. No run on the branch is red or cancelled at W.
   - The red and cancelled runs on the branch, listed by `gh run list` at 2026-11-19T03:55:14Z, each the Rust workspace on push:
     - 44433707986 at 077fe26b: K-O17 failing before its code, on all three platforms;
     - 44436057025 at ef6d6594: the same failure on Ubuntu and macOS, and its Windows job cancelled at 01:27:00Z, after the push of 2519aef1;
     - 44436969877 at 2519aef1: K-S13 on all three platforms, Amendment 37's stop.
11. **The departures** (class 1, disclosed).
   - **(a)** The worker-high's probe ran on C:, in the scratch folder the custodian's brief named, while the test's rig runs on D: under the brief's `TMP`. Amendment 37 item 9 asked for the volume `std::env::temp_dir()` names. The worker-high disclosed it, and the reviewer's probe on D: gave both results (item 9). The brief was the custodian's.
   - **(b)** The reviewer passed the test names after `-- --exact`, and added the supplementary mutation (d) (its check 7).
   - **(c)** The reviewer's first probe call went through Git Bash's path conversion, which made `/deny` a path: icacls refused it with rc 87 and changed nothing. It ran again with that conversion off. Rust's `Command` passes the argument unchanged, so the test is not affected (its check 6).
   - Amendment 37 item 6's five departures stand as recorded. For its (d), the reviewer confirms that ef6d6594 changes no assertion (its O1).
   - The reviewer's O5: K-O24's message for the refused save names a read-only folder, which is not how the folder is set up on Windows. Amendment 37 item 3 keeps the rest of K-O24 unchanged, and no edit is made.
12. **The holds** (ADV-2026-11-16-06 item 2 (e)). P3a-1 had 14 holds by the machine log: five of the worker-high's, three of E-SAVE's and six of the reviewer's. None stood beside another hold of this project.
13. **Notes for P3a-2, P3b, P4 and P5** (none blocks P3a-1; ADV-2026-11-19-07 items 5 and 6).
   - P3a-2's cut: the architect's O3 (a later save does not check which project's file it replaces) and O4 (freeing the lock at a close, and the module doc's clause on the identities it saved first once a reopen holds a lock).
   - P3b's declaring amendment: O3, either as a check or as a "not covered" row, to the advisor; `open.lock` in the module doc of `kernel/tests/no_generation_in_persisted_artifacts.rs` (Amendment 37 item 9, note 5); the step's total as then forecast (ADV-2026-11-19-04 item 7).
   - P4's strings: item 7's detail goes to the advisor with them.
   - P5's words: KNOWN-LIMITATIONS item 62 lists the files a first save leaves in the identity's folder and does not name `open.lock`.
14. **Superseded index.**
   - Amendment 37 item 4's second New block, approved by ADV-2026-11-19-05 item 4, is superseded by W's paragraph (item 5).
   - The word of Amendment 30 item 4 (b) and Amendment 36 item 6 (a) for the folder is corrected by item 4.
   - Nothing else is superseded.

Read the last amendment first.

Nothing above is edited.

## Amendment 39 — P3a-2's stop 4 on K-O19, written after the result was seen (class 1): its declared mutation did not fail its test; K-O18's mutation is recorded for K-O19; the refusal by `create` of a record folder that exists is not covered; one worker step; the two docs corrected in this part

*Written by the custodian, 2026-11-19, from the advisor's ruling ADV-2026-11-19-11, under the delegation of 2026-11-13, filed at `state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-11-p3a-2-stop-on-k-o19-no-architect-draft-k-o18s-mutation-recorded-for-k-o19-creates-refusal-not-covered-the-two-docs-corrected.md`. It is written after the result was seen. References and hashes only; nothing below is a quotation. The worker-high's report: `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3a-2-worker-high-report.md`.*

1. **The result** (Amendment 36 item 12, stop 4). At 270d3ac2c17c6551f7783c1feba1bfc5ad140178, K-O19's declared mutation (Amendment 36's table, K-O19's row) was applied and did not fail its test. The other 34 mutations of the table failed theirs. The cause is in ADV-2026-11-19-04, which ruled P-2 option (i) and left the row's mutation as written for option (ii): under option (i) the open stays unbound, its first step makes a record folder that does not yet exist, and `create_dir` and `create_dir_all` act the same there (ADV-2026-11-19-11 item 1). K-O19's row is not edited.
2. **K-O19 stays as built** (ADV-2026-11-19-11 item 2 (b)). It shows option (i)'s outcome one step later than K-O18 does. Its recorded mutation becomes K-O18's, as K-O18's row in Amendment 36's table declares it. That mutation is declared after the result, and it is not a mutation of K-O19's own. Predicted: K-O19 fails, at its step or at an assertion after it. The worker records the line.
3. **Not covered** (ADV-2026-11-19-11 item 2 (c) and (d)). The refusal by `create` of a record folder that exists (`create_dir`) has no test: under option (i), K-O19 does not reach it. The architect's gate answers by reading whether any path reaches `create` for a project's record folder that exists, in one process or in two. If ordinary use reaches one, it goes to the advisor before the merge request.
4. **One worker step** (ADV-2026-11-19-11 item 3). K-O18's mutation applied, K-O19 run alone, the failing line recorded, the revert shown with the diff empty. Then the `RECORDED MUTATION` comment above K-O19 changed to name that mutation and the failure seen: one commit, comment lines only. The step does not need the strongest model. Its push carries nothing expected to fail CI (ADV-2026-11-19-10 item 2).
5. **The two docs** (ADV-2026-11-19-11 item 4). The doc of `SavedProject._lock` and the doc of `save` on the folder it goes to are corrected in this part, as comment lines only. The two gates draft the words, and they go in the words commit after the gates, with no re-gate. Where the two gates give different words for one place, it goes to the advisor. The module doc's second paragraph of `kernel/src/project/mod.rs`, as changed at 270d3ac2, stands in place of the words ADV-2026-11-19-07 item 2 ruled if both gates find every clause of it true at the head. An untrue clause goes to the advisor.
6. **The order** (ADV-2026-11-19-11 item 5). This amendment on main; item 4's step; the PR; both gates, the reviewer with clippy and the mutations by the round-25 rule; the words commit; the closing; the merge request.
7. **For the gates' briefs** (ADV-2026-11-19-11 item 6).
   - Commit 0c539ed2 changed the word K-O2 and K-O8 expect, after their base commit and before the code. Both gates check that word against the form's rows and against the descriptor. An expectation the form does not support goes to the advisor.
   - The symbol named in that commit's message is recorded in the closing. Nothing is amended.
   - The `pub` items with no product caller yet, disclosed against §8 item 9, are read by both gates.
   - The reviewer confirms that the clippy warning in `kernel/src/skp.rs` is at the base.
8. **The counts** (ADV-2026-11-19-11 item 7; ADV-2026-11-19-04 item 7). Class 8 is recorded at the closing, at the counts.
   - The merge request gives each ceiling for P3a-2 beside its count. It says whether the step's total ceiling is passed at that head, and it gives the step's total as now forecast with P3b.
   - The architect's gate says, by reading, why the tests are near three times their ceiling, and whether any test or helper is not asked for by the form's rows.
9. **A red run** (ADV-2026-11-19-10 item 4). Run 44474730131, the Rust workspace at ff31b05c, failed at the build step on all three platforms, because the tests' commit was pushed before its code. The closing records it with that cause.

Read the last amendment first.

Nothing above is edited.

## Amendment 40 — P3a-2's K-O19 step, its result, written after the result was seen (class 1): under K-O18's mutation K-O19 fails at the save's mark, an earlier place than Amendment 39 item 2 predicted; one more mutation, K-O19's own, declared before its run; nothing committed

*Written by the custodian, 2026-11-19, from the advisor's ruling ADV-2026-11-19-14, under the delegation of 2026-11-13, filed at `state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-14-k-o19s-result-stands-as-seen-one-more-mutation-k-o19s-own-declared-before-its-run-nothing-committed.md`. It is written after the result was seen. References and hashes only, except item 1's two lines, which are byte-copied from the K-O19 step's report: `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3a-2-k-o19-step-worker-report.md`.*

1. **The result** (Amendment 39 item 4; ADV-2026-11-19-14 item 1). K-O18's mutation was applied at 270d3ac2c17c6551f7783c1feba1bfc5ad140178 and K-O19 was run alone: cargo rc 101. The two lines, byte-copied from the report:
   - `thread 'the_first_step_after_that_save_meets_no_leftover_folder_and_has_a_record_of_its_own' (69832) panicked at kernel\tests\project_reopen.rs:1673:5:`
   - `assertion failed: withheld_unwritable(&saved.expect("saved").history_mark)`
   The line is the tree at 270d3ac2. The assertion is the first thing K-O19 asserts, right after the save and before its step, and K-O18 asserts the same mark. The revert left the diff empty. The comment above K-O19 at b5c351564dd4798fdd341e783b9d71b0054242e9 names K-O18's mutation and this failure.
2. **The prediction** (ADV-2026-11-19-14 item 1). Amendment 39 item 2's prediction named a later place than the one seen. The cause is the advisor's (ADV-2026-11-19-14 item 1). So nothing yet shows that K-O19's own assertions can fail. Amendment 39 is not edited.
3. **One more observation, declared before its run** (ADV-2026-11-19-14 item 2). The mutation is K-O19's own, as that item declares it: in `StepRecorder::adopt_project` (`kernel/src/session_history.rs` on the branch), in the arm of item 5 (g), the open is bound to the project before the refusal is returned.
   - Predicted for K-O19: the mark assertion passes, and the test fails at its step or at the count of the open's own records.
   - Predicted for K-O18: it fails at its second save.
   - The worker applies it, runs K-O19 and K-O18 alone, records each failing line, and reverts with the diff empty. It commits nothing, so PR 337's head stays at b5c35156.
   - If K-O19 passes, or fails at the mark assertion, it goes to the advisor, and nothing is redeclared.
4. **The comment above K-O19** (ADV-2026-11-19-14 item 4). It changes once more, in the words commit after the gates, comment lines only. It names item 3's mutation as K-O19's own with the failure seen, keeps K-O18's as seen at the mark, and cites no line number: it names the assertion by its text. The reviewer's gate re-runs item 3's mutation by the round-25 rule and gives the words.
5. **Not covered, unchanged** (ADV-2026-11-19-14 item 5; Amendment 39 item 3). If item 3's mutation fails K-O19 at its step, the closing may say that the refusal by `create` of a record folder that exists was reached under that mutation, and no more than that.
6. **The architect's gate** (ADV-2026-11-19-14 item 6). It ran at b5c35156 and handed back before this amendment was written. Its report is filed at `state/consults/gates/2026-11-19-b2-piece-1c-save-and-reopen-p3a-2-gate-architect.md`. What closes its Evidence finding goes to the advisor.

Read the last amendment first.

Nothing above is edited.

## Amendment 41 — P3a-2: Amendment 40's run and its result; what closes the architect's E1; the re-link's check by the writer moved before the lock (class 9), with one new test row and its mutation, declared before its code; five more doc places join the words commit; the F4 row's word left to P3b; the order

*Written by the custodian, 2026-11-19, from the advisor's ruling ADV-2026-11-19-15, under the delegation of 2026-11-13, filed at `state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-15-pr-337s-architect-gate-o1-fixed-in-p3a-2-e1-closed-by-the-run-the-reviewers-rerun-and-an-attempt-2-five-doc-places-join-the-words-commit-o2-to-p3bs-amendment.md`. Item 1 is written after its result was seen. Items 3 to 8 are declared before their code. References and hashes only. The architect's report: `state/consults/gates/2026-11-19-b2-piece-1c-save-and-reopen-p3a-2-gate-architect.md`.*

1. **Amendment 40 item 3's run, its result.** The worker's report: `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3a-2-k-o19-own-mutation-worker-report.md`.
   - **K-O19 failed at its step**, as predicted. Its mark assertion passed. The failure was inside `Run::opacity_step`, called from K-O19's step, and it was `create`'s refusal of the record folder that exists. So Amendment 40 item 5's sentence may be said in the closing, and no more than it.
   - **K-O18 failed inside its loop**, as predicted: the mark was no longer the unwritable one. The report reads the first save as passing; that reading is the worker's, and the lines it printed do not show it.
   - The mutation was reverted with the diff empty. Nothing was committed: PR 337's head stayed at b5c351564dd4798fdd341e783b9d71b0054242e9.
2. **What closes E1** (ADV-2026-11-19-15 item 1). Three things together:
   - item 1's run;
   - the reviewer's own re-run of Amendment 40 item 3's mutation in its gate;
   - the architect's attempt 2, limited to E1 and to item 3's fix, by reading, after the reviewer's gate.
3. **The fix, class 9** (ADV-2026-11-19-15 item 3 (a) and (b)). This is the architect's O1, against Amendment 36 item 5 (e).
   - (a) The re-link's check by the writer runs before the lock is taken: with step 2, where nothing is written. Its bytes are kept for step 6's write. Nothing else changes order.
   - (b) Declared with it: a re-link the writer refuses is now refused before a held lock is reported, and before a machine-store failure of step 3.
4. **The test** (ADV-2026-11-19-15 item 3 (c) and (d)). One new row in `kernel/tests/project_reopen.rs`, named by the worker, with two cases:
   - a first reopen on this machine, with no `folders.json`, and a re-link the writer refuses: it is refused by name, and afterwards the machine store holds no folder for the identity;
   - the answer `copy` with such a re-link: it is refused by name, `project.spatial` is byte for byte as before, and no folder exists for a new identity.
   Its mutation puts the check back after step 3's writes. Predicted: the test fails at its assertion that nothing was written, in both cases.
5. **The order of the work** (ADV-2026-11-19-15 item 3 (e) to (g); ADV-2026-11-19-10 item 2).
   - The test's commit comes first. The worker's local run shows that it fails at b5c35156.
   - Then the fix's commit, which also brings `open_project`'s doc: in its steps 2 and 5, where the check now runs. Both gates read that doc.
   - Both commits are pushed together.
   - An existing test that fails after the fix stops the worker and goes to the advisor. No existing test is edited.
6. **The model.** Worker-high, on the strongest model (ADV-2026-11-18-02 item 2): persistence, and the order of an open's writes.
7. **The counts** (ADV-2026-11-19-15 item 3 (h)). Recorded at the closing as they stand, class 8.
8. **Five more doc places** (ADV-2026-11-19-15 item 2). The architect's Drafts 3 to 7 join the words commit after the gates, with Amendment 39 item 5's two places: comment lines only, as the drafts give them. The reviewer's gate checks each clause. Where the reviewer gives different words for a place, it goes to the advisor.
9. **The F4 row's word** (ADV-2026-11-19-15 item 4). Not decided here. K-O2 and K-O8 stand as built, on the producer's word. The closing records, class 1, that the F4 row's word differs from what is built. The ruling on P3b's declaring amendment decides whether the row is corrected or the wire maps the word.
10. **The order for PR 337** (ADV-2026-11-19-15 item 7):
    - this amendment on main;
    - item 5's worker;
    - the reviewer's gate, whole, at the head with the fix: clippy, the mutations by the round-25 rule (Amendment 40 item 3's and item 4's among them), the seven doc drafts, and the words for the comment above K-O19 (Amendment 40 item 4);
    - the architect's attempt 2;
    - the words commit;
    - the closing and the merge request.

Read the last amendment first.

Nothing above is edited.

## Amendment 42 — P3a-2's closing, before its merge request: the gates; the words commit; K-O25 named; K-O25 exempted from the catalog bullet (class 1); Amendment 41 item 3 (b) corrected (class 3); E1; the four mutation rows (class 1); the F4 row's word (class 1); ADR-036 Amendment 2 item 3 left to P3b; the counts (class 8); the red run; the reviewer's departure (class 1); the holds

*Written by the custodian, 2026-11-19, after both gates' results were seen, from the advisor's ruling ADV-2026-11-19-19, under the delegation of 2026-11-13, filed at `state/directives/2026-11-19-advisor-ruling-adv-2026-11-19-19-pr-337s-closing-questions-draft-a-a-class-3-correction-k-o25-exempted-from-the-catalog-bullet-by-name-the-adr-item-to-p3b-the-four-mutation-rows-class-1.md`. References and hashes only. Items 4 to 6 place the architect's Drafts B, A and C here, as that ruling asks, by reference: they are under the Drafts of the filed report of the architect's attempt 2, `state/consults/gates/2026-11-19-b2-piece-1c-save-and-reopen-p3a-2-gate-architect-attempt-2.md` (sha256 0b50528f9edee3cc734e78faef485840f52e7a210102b2a2e09f34c4e3a2fcde). Their line cites are to c351ddb8, a branch commit, so they stay in that report and are not copied. Item 7 sets the form's words beside the reviewer's, each checked by script against its source. Nothing else is quoted.*

1. **The gates**, at c351ddb8055c89fde6b6bb8e319c6347a581077d (Amendment 41 item 10).
   - The reviewer, whole: `state/consults/gates/2026-11-19-b2-piece-1c-save-and-reopen-p3a-2-gate-reviewer.md`, PASS WITH NOTES, gate-log 790. It has no Correctness or Evidence finding.
   - The architect's attempt 2, limited to E1 and to the fix, by reading: `state/consults/gates/2026-11-19-b2-piece-1c-save-and-reopen-p3a-2-gate-architect-attempt-2.md`, PASS WITH NOTES, gate-log 791.
   - The architect's attempt 1, at b5c351564dd4798fdd341e783b9d71b0054242e9: `state/consults/gates/2026-11-19-b2-piece-1c-save-and-reopen-p3a-2-gate-architect.md`, FAIL on E1. Item 6 closes E1.
2. **The words commit**, 2d88811c445141f4a56847112ef8ebcbfdf94d64, made by the custodian's script, comment lines only (Amendment 41 items 8 and 10; ADV-2026-11-19-14 item 4; ADV-2026-11-19-15 item 2; ADV-2026-11-19-19 item 5).
   - It applies the architect's Drafts 1 to 7 from its attempt 1 report, which the reviewer adopted as its D1 to D7, and the reviewer's D8 (the comment above K-O19) and D9 (the doc of `Open::uri`).
   - `git diff --numstat` from c351ddb8: `kernel/src/project/mod.rs` 13 added and 8 deleted, `kernel/src/session_history.rs` 10 added and 5 deleted, `kernel/tests/project_reopen.rs` 8 added and 5 deleted, 49 lines in 3 files.
   - CI at it: 12 runs, all success, by the custodian's watcher, read at 2026-11-19T11:30:35Z.
   - The architect's D6 is met: the node's PLAN summary names P3a-2's producers, and PR 337's body names them, set by the custodian and read back equal at 2026-11-19T11:49:38Z (Amendment 36 item 8).
3. **K-O25** (the reviewer's D10; Amendment 41 item 4). The test that item declared, named by the worker, is `a_relink_the_writer_refuses_writes_nothing_at_a_first_reopen_or_a_copy`, in `kernel/tests/project_reopen.rs`, from commit 6837444160ca66b5f058873b7d950c34a773bc95. Its declared mutation failed it in the reviewer's hold 3, at its assertion that nothing was written (the reviewer's check 7 (c)).
4. **K-O25 and the catalog bullet, class 1** (ADV-2026-11-19-19 item 2; the architect's N2; the reviewer's A4). The general bullet of Amendment 36 item 7 (b), on every case that opens nothing, binds K-O25, a row declared later in the same part. That ruling exempts K-O25 from it by name. The reason is the architect's Draft B (N2), in that report.
   P3b's declaring amendment carries the question as a row to consider (ADV-2026-11-19-19 item 2).
5. **Amendment 41 item 3 (b), corrected, class 3** (ADV-2026-11-19-19 item 1; the architect's N1; the reviewer's A1). Item 3 (b)'s list was incomplete. The correction is the architect's Draft A (N1), in that report.
   Amendment 41 is not edited.
6. **E1** (Amendment 41 items 1 and 2; the architect's N3). The architect's Draft C (N3), in that report, records how E1 closed.
7. **The four mutation rows, class 1** (ADV-2026-11-19-19 item 4; the reviewer's A3). For each row of Amendment 36 item 7 (b)'s table, the form's Mutation words beside what the reviewer's table script did:

   | Row | The form's words | What was done, by the reviewer's A3 |
   |---|---|---|
   | K-O2 | only `byte_size` compared | removes only the mtime comparison in `engine/src/descriptor.rs` |
   | K-O10 (b) | the same, that is K-O10's: a refused file replaced by a fresh one | reads a refused locations.json as holding no entry |
   | K-O14 | the error arm keeps the guard | leaks the lock by `mem::forget` |
   | K-O4 (a) | (a) no lock | locks under a fresh random root |

   - The reviewer's lines that they fail: "All four fail." (its A3), and "All rows fail (cargo rc 101) except K-O19" (its check 7 (a)).
   - The reviewer's report does not say that any of the four tests a different property from its row's.
8. **The F4 row's word, class 1** (Amendment 41 item 9; ADV-2026-11-19-15 item 4). The F4 row's word differs from what is built. K-O2 and K-O8 stand as built, on the producer's word, by commit 0c539ed2a8a6b3a3990e9688d6e808232ea79b63 (Amendment 39 item 7). The ruling on P3b's declaring amendment decides whether the row is corrected or the wire maps the word.
9. **ADR-036 Amendment 2 item 3, left to P3b** (ADV-2026-11-19-19 item 3; the reviewer's A2).
   - The item does not yet say that a reopened open takes the project file's dataset identity.
   - No caller reaches that until P3b. P3b's PR appends the ADR's words for it, which the advisor gives with its ruling on P3b's declaring amendment.
   - This PR adds the ADR's Amendment 3 only (ADV-2026-11-19-04 P-3) and leaves Amendment 2 as it is.
10. **The counts, class 8** (Amendment 36 item 4; Amendment 41 item 7; the reviewer's D11). By §2.11's command from the merge base 18f14b62d222038f29214c53c0f11bf2f9d6a1e4, both columns:

   | File | At c351ddb8 (the reviewer's D11) | At 2d88811c | Ceiling |
   |---|---|---|---|
   | `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` | 8 | 8 | none in item 4 |
   | `kernel/src/dataset_ref.rs` | 6 | 6 | 10 |
   | `kernel/src/project/mod.rs` | 488 | 509 | 520 |
   | `kernel/src/session_history.rs` | 30 | 45 | 50 |
   | `kernel/src/skp.rs` | 30 | 30 | 60 |
   | `kernel/tests/project_lock_crash.rs` | 151 | 151 | 70 |
   | `kernel/tests/project_reopen.rs` | 1457 | 1460 | 520 |
   | kernel product | 554 | 590 | 640 |
   | kernel tests | 1608 | 1611 | 590 |
   | in all | 2170 in 7 files | 2209 in 7 files | 1,230 in 6 files |

   - Over their ceilings, class 8: `kernel/tests/project_lock_crash.rs` 151 of 70, `kernel/tests/project_reopen.rs` 1460 of 520, the kernel tests 1611 of 590, the total 2209 of 1,230, and 7 files of 6 (by the reviewer's D11, the ADR has no ceiling row in item 4, and Amendment 36 item 10 brings it in).
   - Step 2's groups (Amendment 36 item 2 for the use before P3a; Amendment 38 item 3 for P3a-1), at 2d88811c: kernel product 792 + 71 + 590 = 1,453 of 1,400 (53 over); kernel tests 883 + 127 + 1611 = 2,621 of 1,300 (1,321 over); protocol 5 of 320, which P3a does not touch. At c351ddb8 the reviewer gave the kernel product total as 1417 of 1,400.
   - §2.11 and §7 are not edited.
11. **The red run** (ADV-2026-11-19-10 item 4). Run 44474730131, Product CI — Rust workspace, failure, at ff31b05c58d27b40e60a98ea000ff85727e1bec4. Its cause: the tests' commit was pushed before the code it tests, so the build failed (ADV-2026-11-19-10 item 1). By gh run list, read at 2026-11-19T11:59:22Z, the branch has 46 runs, and no other is red or cancelled.
12. **The reviewer's departure, class 1** (its report, under its holds). The lines of its holds 2 and 4 ran a second command after `;` rather than `&&`. Both holds printed MACHINE_HOLD, so the command ran inside them.
13. **The holds.** From the machine log, by the custodian's script, P3a-2 has 21 holds: 17 by its workers and 4 by the reviewer, from 2026-11-19T06:23:35Z to 10:56:29Z. None stood beside another hold of this project.
14. **Next.** PR 337 goes out of draft, and its merge request goes to the advisor, with the step's totals beside their ceilings (ADV-2026-11-19-19 item 6). No path of PR 337 changed on main after its merge base (ADV-2026-11-19-20 item 7).

Read the last amendment first.

Nothing above is edited.

## Amendment 43 — the reopen's P3b, the wire (`skp/0.14`) and the binding, declared before its code as two parts, P3b-1 (the lock's release, two lineage facts, a later save's identity check) and P3b-2 (`open_project` on the wire): basis, size and split, ceilings, the step's totals, the wire, tests, mutations, producers, regions, stops, gates and records; files outside §2.11's and §4's lists (class 9)

*Drafted by the architect, read only, at main `203ceef1beae60acbd9590060bba7bd0cb0fc2fc`, and appended by the custodian's script. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is the architect's recommendation, it says so. Rulings are cited by id and item; this form by section, amendment and item; code by path and symbol at that commit. Every figure is an estimate from what is known now, and shows its working.*

1. **Basis.**
   - P3b is the second part of ADV-2026-11-16-10 R1 (a). It covers the command that reaches `Projects::open_project` (`kernel/src/project/mod.rs`), its replies, codes, fixtures and literal, and the shell host's binding. It is full class, both gates (ADV-2026-11-16-06 item 2 (a): the wire, a lock, a path check, seams, over 260 lines).
   - Its rules: §2.2, under OPEN-3 (A), so that P3b alone carries `skp/0.14`; §2.4; §2.7; Amendment 1 item 5 (V3, M1, M2); Amendment 36 items 5, 8, 9 and 16; R2 (a) to (d).
   - It takes these rulings, met by item 19:
     - ADV-2026-11-19-04 item 5 (P-6 (i)) and item 6 (a) to (d);
     - ADV-2026-11-19-07 item 6;
     - ADV-2026-11-19-15 item 4;
     - ADV-2026-11-19-19 items 2 and 3;
     - ADV-2026-11-19-21 items 1 and 3.
   - It also takes Amendment 37 item 9 note 5, Amendment 38 item 13, Amendment 41 item 9 and Amendment 42 items 8 and 9.
   - **Not P3b's:**
     - every shell item, which is P4's: `openProject` in `frontends/shell/src/skp/client.ts`, the question and re-link UI, the owner's strings, E-REOPEN, E-CHANGED, E-SECOND and E-CRASH-UNLOCK;
     - KNOWN-LIMITATIONS item 62 (P5; ADV-2026-11-19-21 item 2);
     - the record's own `locations.json` writer (step 3).

2. **Size, from what is known now, and the split.**
   - This size is set from what is known now (ADV-2026-11-19-21 item 3), not from the 2026-11-16 read, which gave P3b about 810 lines.
   - **The working.** The rates come from step 1's `save_project` as it stands on main:
     - `protocol/skp/SKP-V0.md` §11 is 55 lines;
     - the `save_project` region of `protocol/skp/src/v0/commands.rs`, with its `ProjectRelativeLocator` test, is about 145;
     - the five save constructors in `protocol/skp/src/v0/error.rs` are 50;
     - `save_project_requests_and_response_round_trip_and_its_codes_are_what_the_constructors_build` in `protocol/skp/tests/fixtures.rs` is 92;
     - step 1's protocol product ended at 478 (Amendment 23 item 3).
   - **The literal, by grep at main.** The current literal sits on 90 lines in 20 files. Counted in both columns, that is 180.
     - The 11 request fixtures under `protocol/skp/tests/data/`: 11 lines.
     - The three conformance fixture files: 61 lines. `refusals-any-layer.json`'s line for an unsupported future version also moves from `skp/0.14` to `skp/0.15`: 1 line.
     - `protocol/skp/tests/conformance/README.md`: 3 lines.
     - `protocol/skp/tests/fixtures.rs`: 4 lines (the save request's literal, and the version test's name, assert and doc).
     - The shell: 10 lines. That is `SKP_VERSION` in `frontends/shell/src/skp/types.ts` (1), `skp/client.test.ts` (4), `admission/admitDataset.test.ts` (4) and `project/saveProject.test.ts` (1).
     - The worker recounts these sites at the part's base.
   - **The estimate, both columns:**

     | Group | P3b-1 | P3b-2 | P3b |
     |---|---|---|---|
     | protocol | 0 | ~400 (commands.rs ~165; error.rs ~78; mod.rs ~9; SKP-V0.md ~150) | ~400 |
     | fixtures | 0 | ~343 (reply fixtures ~110; error fixtures ~50; fixtures.rs ~150; conformance rows, `main.rs`'s two mappings and README ~33) | ~343 |
     | literal | 0 | ~180, 20 files | ~180 |
     | kernel product | ~72 (session_history.rs ~25; project/mod.rs ~47) | ~220 (project/mod.rs ~214; project/store.rs ~6) | ~292 |
     | kernel tests | ~201 (project_reopen.rs ~110; project_save.rs ~85; no_generation_in_persisted_artifacts.rs ~6) | ~480 (project_reopen_skp.rs, new) | ~681 |
     | src-tauri | ~12 | ~28 | ~40 |
     | records (ADR-036) | 0 | ~6 | ~6 |
     | **Total** | **~285, 6 files** | **~1,657, about 42 files** | **~1,942** |

   - **The split** (the architect's recommendation; packet P-1).
     - P3b-1 changes shipped paths and the reader. It holds the lock's release at a close (item 6), with its call in the shipped `close_dataset` binding; a later save's identity check (O3); and the reader's two facts (P-5 (a), P-9 (c) (ii)).
     - P3b-2 is the wire and the reopen's binding.
     - P3b-2 is cut from main after P3b-1 merges, because both edit `kernel/src/project/mod.rs` and `frontends/shell/src-tauri/src/commands.rs`.
   - **P3b-2 stays over 800 lines**, for three reasons.
     - (a) OPEN-3 (A) gives the step one version. The literal, the wire types, their fixtures and the command that serves them must land together. A part holding the types without the command would land wire types that no product code calls (R2 (d)). A part holding the command without the types cannot compile.
     - (b) About 180 of its lines are the literal, and about 343 are fixture data and the tests that pin the types.
     - (c) Its kernel product is one map in each direction over the types P3a-2 pre-committed. Cutting it would land arms that §2.2 does not define.

3. **Ceilings, both numstat columns, by §2.11's groups** (for the advisor to rule, ADV-2026-11-19-21 item 3). Neither §2.11 nor §7 is edited. An overrun is class 8 in the part's closing amendment. A worker that finds a ceiling too small finishes, reports the count and says so (ADV-2026-11-19-12 item 6).

   | Part | Group | Ceiling |
   |---|---|---|
   | P3b-1 | kernel product | 80 |
   | P3b-1 | kernel tests | 220 |
   | P3b-1 | src-tauri | 15 |
   | P3b-2 | protocol | 420 |
   | P3b-2 | fixtures | 360 |
   | P3b-2 | literal (≤ 22 files) | 190 |
   | P3b-2 | kernel product | 240 |
   | P3b-2 | kernel tests | 500 |
   | P3b-2 | src-tauri | 35 |
   | P3b-2 | records (ADR-036) | 10 |

   - **Totals:** P3b-1 315 lines in 6 files; P3b-2 1,755 lines in about 42 files.
   - The reviewer recounts with §2.11's command, its excludes set to this form's present path (`governance/forms/kernel/...`).

4. **The step's totals after P3b.** The step's ceilings are not touched by this amendment.

   | Group | Used, by Amendment 42 item 10 | P3b | After P3b | Ceiling |
   |---|---|---|---|---|
   | kernel product | 1,453 | ~292 | ~1,745 (~345 over) | 1,400 |
   | kernel tests | 2,621 | ~681 | ~3,302 (~2,002 over) | 1,300 |
   | protocol | 5 | ~400 | ~405 (~85 over) | 320 |
   | fixtures | not given | ~343 | ~343 + the earlier use (~83 over) | 260 |
   | literal | not given | ~180 | ~180 + the earlier use (~50 over) | 130 |
   | src-tauri | not given | ~40 | ~40 + the earlier use | 100 |
   | records | not given | ~6 | ~6 + the earlier use | 140 |

   - Amendment 42 item 10 gives only the three groups it names. No part so far touched `protocol/` beyond those 5 lines (Amendment 36 item 11). The reviewer gives the other groups by §2.11's command at P3b-1's base.
   - **The forecast** (ADV-2026-11-19-04 item 7): the three named groups stand at 4,079 lines. With P3b they come to about 6,021, against the step's 5,170, before P4, P5 and the groups not yet given.
   - **Files:** P3b-2 alone is about 42 files, against the step's 75.

5. **The wire, `skp/0.14`** (P3b-2). Each shape is closed and `deny_unknown_fields` in both directions (SKP-V0.md §4 item 13). Each `Option` key must be present, as `SaveProjectRequest` already requires (`key_present`).
   - **(a) The request.** `OpenProjectRequest {skp, folder, cancel_key, answer, relink}`, as §2.2 gives it:
     - `folder` is an absolute UTF-8 path;
     - `answer` is `null`, `copy` or `same`;
     - `relink` is `null` or an absolute UTF-8 path.
   - **(b) The reply.** `OpenProjectResponse` is externally tagged, with one of three members, as §2.2 writes them (the architect's recommendation; packet P-4 (c)):
     - `opened` holds `{project, dataset, session, workspace, view, check, lineage}`:
       - `project` is the identity URI; after the answer `copy` it is the new one.
       - `dataset` is a `DatasetHandle`, and `session` a `SessionRef`, as `OpenDatasetResponse` carries them.
       - `workspace` is step 1's `ProjectWorkspace`, built from the project file's `Workspace` (filter, clauses, style document and view centre and zoom as `HexF64`).
       - `view` is `{state: applies}` or `{state: saved-in-another-space, basis}`. This is V3. `basis` is `view_state`'s text, which names identifiers, provenances and definition hashes (`kernel/src/project/file.rs` `Space`) and no path. §2.2 gains this member (class 1).
       - `check` is `{observed: […], admission: […]}`, as §2.2 gives it.
         - `observed` holds words from `RefCheck::Differs.observed` (`kernel/src/dataset_ref.rs`). The vocabulary is packet P-3.
         - `admission` holds `crs` and/or `identity`.
         - Both lists are empty exactly when the kernel's result is `RefCheck::NoChangeDetected`, because `DatasetRef::check` gives `Differs` only when one list is not empty.
         - Names only cross, as `RefCheck` holds them (P-4 (b)). No recorded or present value crosses.
       - `lineage` is `{folder_file, previous_file}`, two closed members that mirror `FolderLineage` and `PreviousLineage` (`kernel/src/session_history.rs`; P-4 (a) (i)).
         - `folder_file` is one of: `absent`, `not-read`, `recorded`, `recorded-with-lines-after`, `not-the-recorded-one`, or `{refused: …}`.
         - `previous_file` is `null`, or one of: `absent`, `used`, `not-the-recorded-one`, or `{refused: …}`.
         - `refused` is one of:
           - `{reason: over-bound, line: n|null, limit}`;
           - `{reason: damaged, line}`;
           - `{reason: unreadable}`;
           - `{reason: through-link}`.
         - Line numbers cross, and no rule text crosses (P-5 (b)).
         - When two lines break rules, the first in file order is named (P-5 (c); L6).
         - The lineage's lines (`LineageRead::lineage`) do not cross. A lineage file may be 32 MiB (`MAX_LINEAGE_FILE_BYTES`), and nothing at P3b consumes the lines.
     - `question` holds `{kind: copy-or-same}`.
     - `not_found` holds `{file_name: string|null}`. `null` means no location is recorded for the dataset (`Reopen::NotFound`).
   - **(c) The codes.** `Projects::open_project_command` is a working name. It is the SKP entry, built as `Projects::save_project` is: the version check, then `open_project`, then an exhaustive map from `OpenFailure` to codes with no wildcard arm.
     - Each new message is the text of the matching arm of `OpenFailure`'s `Display`, as merged at P3a-2, built from the code's fields.
     - Each row is the architect's recommendation unless a ruling is named.

     | `OpenFailure` | Code | Fields |
     |---|---|---|
     | `Open(e)` | passes through: `skp.version_unsupported` and `skp.malformed_cancel_key`; `skp.cancel_key_in_use`; `engine.*`; `skp.unknown_dataset` | as the host built them |
     | `Cancelled` | `engine.cancelled`, through `crate::skp::error_of(&EngineError::Cancelled)`: the same code and text a cancelled `open_dataset` gives | none |
     | `ProjectFileUnreadable` | `skp.project_file_unreadable`, new (packet P-7) | `detail` |
     | `FileRefused` | `skp.project_file_refused` (packet P-9) | `path`, `rule` |
     | `MachineRecordRefused` | `skp.project_machine_record_refused` (M1) | `file`, `rule` |
     | `KnownFoldersFull` | `skp.project_known_folders_full` (M2) | `project`, `count` |
     | `OpenElsewhere` | `skp.project_open_elsewhere` | `project` |
     | `MachineStore` | `skp.project_file_unwritable` | `detail` (`what` and the error) |
     | `FolderUnresolvable` | `skp.project_target_unresolvable` (P-6 (i)) | `folder`, the request's string |
     | `TargetRefused`, `Unresolvable` | `skp.project_target_unresolvable` (P-6 (i)) | `locator`, `segment` |
     | `TargetRefused`, `ThroughLink` | `skp.project_target_through_link` | `locator`, `segment` |
     | `TargetRefused`, `NotADirectory` or `NotARegularFile` | one code with a closed detail (P-4 (c) (i)): working name `skp.project_target_wrong_kind` | `locator`, `segment`, `expected`: `folder` or `file` |
     | `TargetRefused`, `NotCanonical`; `TargetRefused`, `FolderUnresolvable` | unreachable (Amendment 36 item 5 (e); `data_at` maps the second to `OpenFailure::FolderUnresolvable`) | the arm names `locator` only |
     | `ProjectFileUnwritable` | `skp.project_file_unwritable` | `detail` |
     | `PathNotUnicode` | `skp.project_target_unresolvable` (packet P-12) | `detail`, no path |

     - `project_target_outside_folder` is withdrawn (P-4 (d)). `resolver::check_inside` walks from the folder one segment at a time and refuses every link. The `at` it walks is canonical, so it holds no `..` (`DatasetRef::parse`, `in_canonical_form`). A walk of that kind cannot leave the folder, and K-R1 and K-R2 show the link and junction arms.
     - `skp.cancel_key_in_use`'s doc widens to name the reopen. Its message is packet P-10.
     - `skp.project_file_refused`'s doc widens to the reopen's read. So does `engine.cancelled`'s raising site in SKP-V0.md.
   - **(d) The no-path rule.**
     - No reply carries a path. `not_found` carries the last name of the missing file, or `null`.
     - A refusal may name these and nothing else:
       - the request's own `folder` or `relink`, as sent;
       - a locator's JSON path and its segment, as the project file spells it;
       - a machine-store file by its fixed name;
       - an identity.
     - A refusal never names the data's machine-recorded path, a machine-store absolute path, or the folder's canonical form.
     - What that means for each variant:
       - `FolderUnresolvable(PathBuf)` sends the request's `folder` string, not the variant's path.
       - `PathNotUnicode(PathBuf)` sends no path.
       - The `io::Error` sources send their `Display`, which std writes from the operating system's error. W-4 shows this for each case it builds.
       - `store`'s rule texts must name no path read from a machine-store file. `stored_path`'s refusal arm prints the path today (`kernel/src/project/store.rs`), so the A1 words of item 5 (g) are bound by this rule.
     - **One exception, named** (the architect's recommendation; packet P-11). An engine refusal through `Open(e)` keeps the engine's own message, unedited (SKP-V0.md §5), and that message may name the path the engine was given.
   - **(e) Control plane only.**
     - `open_project` is one control-plane call per reopen. It opens no stream and mints no ticket, and `protocol/data-plane/` has an empty diff.
     - Its reply is bounded. The workspace is bounded by the project file's 1,048,576-byte ceiling, and `basis` holds identifiers and hashes. No lineage line crosses.
     - No JSON runs on a data hot path (docs/01; docs/10). No performance claim is made (docs/08).
     - It runs on `spawn_blocking` (§2.7). It is cancellable through `cancel` with its key, as `open_dataset` is (Amendment 36 item 5 (a)).
   - **(f) Wire bytes that change, each pinned.**
     - `SKP_VERSION` and the shell's `SKP_VERSION` become `skp/0.14`. The pins are F-W3, `every_request_fixture_carries_the_current_skp_version` (unedited), the conformance harness, and the shell's `client.test.ts` at its literal.
     - The conformance fixture for an unsupported future version is renumbered to `skp/0.15`, pinned by the conformance harness.
     - The new types and codes are pinned by F-W1, F-W2 and W-1 to W-6.
     - `v0-error-project_file_refused.json`'s message changes only if the advisor's A1 (i) words change the message's head. It is then pinned by step 1's fixture test, whose code stays unedited. The data file changes as class 1, disclosed.
     - The six existing commands' shapes do not change, and neither does `save_project`'s, apart from the literal. The one exception is packet P-8, if ruled.
   - **(g) The three A1 places** (P-8, ADV-2026-11-19-04 item 6 (c)). Each is a place for words the advisor rules, landing beside P3b-2's codes. None is drafted here.
     - The architect's A1 (`state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1b-gate-architect.md`): the noun in the over-ceiling arm of `stored_path` (`kernel/src/project/store.rs`). It reaches the wire as `rule` in `project_machine_record_refused` and in `project_file_refused`.
     - The reviewer's A1 (i) (`state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1b-gate-reviewer.md`): the head of `SkpError::project_file_refused`'s message (`protocol/skp/src/v0/error.rs`).
     - The reviewer's A1 (ii), same report: `stored_path`'s refusal arm, split into not absolute and not Unicode.

6. **The lock's release** (P3b-1; P-9 (a) (i) as ruled: the lock lives in `Projects`'s saved entry). This is the architect's recommendation, and it is contingent on packet P-2.
   - **The call.** `pub fn Projects::release_ended()` drops the `SavedProject` entry, and with it `_lock`, of every open that the catalog no longer holds, or that `require_live` (`kernel/src/skp.rs`) finds ended.
   - **Its callers:**
     - the binding's `close_dataset`, after `SkpHost::close_dataset` has returned. This is the product caller, so the lock is never freed while the open is in the catalog and live (O4);
     - `Projects::open_project`, before step 3's `ProjectLock::try_lock`.
   - **The session-end forwarder** in `frontends/shell/src-tauri/src/lib.rs` is not changed. An open whose session ended can no longer write:
     - `record_step` and `save_project` refuse it through `require_live`;
     - its lock is freed at this process's next close or reopen;
     - a lost session-end event, which is allowed by the event's own design, frees nothing early.
   - **Named for the source comment.** A save or step that passed `require_live` before the end lands can finish its writes after a reopen in another process has taken the lock. This needs timing inside one request.
   - **Doc words**, which are not the human's wording and which the worker applies:
     - The module doc of `kernel/src/project/mod.rs`, its clause ending in until it is dropped, becomes: until that open is closed, or, after its session ends, until this process's next reopen or close ([`Projects::release_ended`]); or until [`Projects`] is dropped.
     - The doc of `SavedProject::_lock` becomes: It is held for as long as this entry is: until [`Projects::release_ended`] finds its open closed or its session ended, or until [`Projects`] is dropped.
     - The doc of `Projects::save`, its clause keeping the lock until `Projects` is dropped, becomes: keeps the lock in [`Projects`] until [`Projects::release_ended`] releases it; one refused after the lock frees it.
     - The doc of the `save_project` binding (`frontends/shell/src-tauri/src/commands.rs`), its sentence on `close_dataset` (D4), becomes: `close_dataset` frees the open's project lock: after the host has closed the dataset, it calls [`Projects::release_ended`].
   - **Clause check against the design:**
     - the binding calls the release after the host's close;
     - `open_project` calls it before the lock;
     - `require_live` refuses an ended generation;
     - so each clause states what the code does.

7. **P3b-1.**
   - **Where it is built:** branch `cut/b2-piece-1c-p3b-1`, worktree `C:/dev/wt/1c-p3b-1`, build folder `D:/wt-targets/1c-p3b-1`. It is cut from main after this amendment and the advisor's ruling.
   - **(a) Files.**
     - `kernel/src/session_history.rs` (class 9):
       - `LineageRefused::Unreadable { reason }` replaces `Damaged { line: 0 }` in `lineage_file`'s `unreadable` (P-5 (a) (ii); class 1 on the pre-committed type). Its `Display` keeps the error text inside the kernel.
       - `LineageRefused::ThroughLink`: `lineage_file` refuses a link at the file's name before `File::open`, with the same link test as `resolver::check_inside`'s walk (P-9 (c) (ii)).
     - `kernel/src/project/mod.rs`:
       - item 6;
       - O3's check. A later save whose `project.spatial` names another identity is refused as `SaveFailure::FolderHoldsProject` with the entry's folder, which reaches the wire as `skp.project_folder_holds_project`. This is contingent on packet P-5 (b).
       - item 6's doc words.
     - `kernel/tests/project_reopen.rs` and `kernel/tests/project_save.rs` (class 9): the rows of (b), appended.
     - `kernel/tests/no_generation_in_persisted_artifacts.rs` (class 9; Amendment 37 item 9 note 5). Module doc only.
       - Its sentence naming the machine store's two files as named below and not scanned gains: and its `open.lock`, which `store::ProjectLock::try_lock` creates empty and never writes.
       - Its paragraph on the three writers outside the families keeps three, and gains one sentence: `open.lock` (`kernel/src/project/store.rs`, `ProjectLock::try_lock`) is created empty and never written.
     - `frontends/shell/src-tauri/src/commands.rs`: `close_dataset` takes the `Option<Arc<Projects>>` state and calls the release after the host's close; plus the D4 doc.
   - **(b) Tests and mutations.** The round-25 rule applies: apply the mutation, run the named test, record its failure by name with the commit, revert. A `verify-mutation` run is not called an observation. Each test fails at its base by a missing symbol, except K-O17 (b) and K-O26, which fail by assertion: today the lock is held until `Projects` drops.

     | Id | Test | Asserts | Mutation, and what it must turn red |
     |---|---|---|---|
     | K-O26 | `a_reopen_after_a_session_end_in_the_same_process_takes_the_lock` (pre-committed, Amendment 36 item 8) | a saved open, and a reopen of its folder refused as `OpenElsewhere` (the control); after `SkpHost::end_generation` on the open, the same reopen gives `Opened` | the release not run in `open_project`: red at `Opened` |
     | K-O17 (b) | `a_project_saved_first_in_this_process_is_refused_to_another_process_until_its_dataset_closes` (pre-committed; `project_save.rs`, K-O17's child pattern) | the child gets `Held`; after `SkpHost::close_dataset` and `Projects::release_ended`, in the binding's order, the child takes the lock | `release_ended` keeps entries the catalog no longer holds: red at the child's second try |
     | K-O4 (unedited) | `a_second_open_of_an_open_identity_is_refused_in_this_process_and_another` | as merged | `release_ended` drops every entry: red at the in-process refusal |
     | K-O27 | `a_later_save_into_a_folder_whose_project_file_names_another_project_is_refused_and_the_file_is_kept` (O3; contingent on P-5 (b)) | a first save into A; A's file replaced by another identity's real file; the open's next save is refused as `project_folder_holds_project`; A's bytes unchanged | the identity comparison removed: red at the bytes |
     | L8 | `an_unreadable_lineage_file_is_named_unreadable` (a folder at `.spatial/lineage.jsonl`, a kept member) | `Refused(Unreadable)`; `lineage` is `None` | `unreadable` back to `Damaged { line: 0 }`: red |
     | L9 | `a_link_at_the_lineage_name_beside_a_kept_member_is_refused_and_never_followed` (off Windows a symlink to a matching file; on Windows a junction) | `Refused(ThroughLink)`; `lineage` is `None` | the link test removed: red off Windows at `Recorded`, on Windows at `Unreadable` |

   - **(c)** P3b-1 adds one `pub` call (item 6) and two variants (item 12).

8. **P3b-2.**
   - **Where it is built:** branch `cut/b2-piece-1c-p3b-2`, worktree `C:/dev/wt/1c-p3b-2`, build folder `D:/wt-targets/1c-p3b-2`. It is cut from main after P3b-1 merges.
   - **(a) Files.**
     - Protocol:
       - `protocol/skp/src/v0/{commands,error,mod}.rs`: item 5's types, constructors and literal, and `mod.rs`'s `skp/0.14` paragraph;
       - `protocol/skp/SKP-V0.md`: a §12 `open_project`, laid out as §11 is; §8's `skp/0.14` entry; §11.3 and §11.4 for O3 (if P-5 (b)) and for P-8 (if ruled).
     - Fixtures:
       - `protocol/skp/tests/data/`: the reply fixtures `v0-open_project-response-opened`, `v0-open_project-opened-lineage` (pre-committed), `-question`, `-not_found` and `-not_found-unrecorded`; and the new error fixtures.
       - The requests are held in `fixtures.rs`, as step 1's are, because the shell's `renderTruth.test.ts` reads every request fixture under `tests/data/`.
       - `protocol/skp/tests/fixtures.rs`.
       - The conformance rows, `main.rs`'s two mappings and one README paragraph.
     - The literal sites of item 2.
     - `kernel/src/project/mod.rs`:
       - `Projects::open_project_command`, the reply's builders and item 5 (c)'s map;
       - O5's arm (contingent on packet P-6);
       - the doc words of item 9 (a) and (b).
     - `kernel/src/project/store.rs`: item 5 (g)'s places.
     - `kernel/tests/project_reopen_skp.rs`, new (class 9). Its rig is `project_save_skp.rs`'s: a real `SkpHost`, `StepRecorder` and `Projects`, with requests decoded from wire JSON.
     - `frontends/shell/src-tauri/src/commands.rs`: `open_project` on `spawn_blocking`. On `opened` it starts the pool poll under `open_dataset`'s own `cfg` (O-13). The module doc names it.
     - `frontends/shell/src-tauri/src/lib.rs`: one handler entry.
     - `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`: item 11.
   - **(b) Tests and mutations** (round-25 rule as in item 7 (b)). Each test fails at its base by a missing symbol, except F-W3, which fails by assertion.

     | Id | Test | Asserts | Mutation, and what it must turn red |
     |---|---|---|---|
     | W-1 | `a_saved_project_reopens_through_the_command_from_its_wire_request` (the seam, from the real shape) | open, record a step, save (one clause disabled), close, then `open_project` from wire JSON; the reply decoded: `opened`, the same project URI, the workspace member for member, `view` `applies`, `check` both empty, `folder_file` `absent`, `previous_file` `null`; a `record_step` on the new handle carries the project file's dataset URI (item 11) | (a) the reply's clauses built from the enabled ones only: red at `workspace`; (b) `StepRecorder::reopened` not called: red at the step's `data.dataset` |
     | W-2 | `a_question_reply_and_its_answered_second_call_through_the_command` | `question` with `copy-or-same`; `folders.json` byte for byte unchanged; the second call with `same` gives `opened` | `answer` decoded as `null`: red at the second call |
     | W-3 | `a_not_found_reply_names_the_file_and_a_relink_through_the_command_opens_it` | `not_found` with the file's last name, holding no separator; `null` with no `locations.json`; the call with `relink` gives `opened` | `file_name` sent as the recorded path: red |
     | W-4 | `each_reopen_refusal_reaches_the_wire_as_its_code_with_no_path_it_was_not_given` (cases: `FileRefused`; an unreadable `project.spatial`; a refused `folders.json`; `OpenElsewhere`; `ThroughLink`; a missing segment; a file as an intermediate; a relative `relink`; `KnownFoldersFull`) | each case's code and fields; every serialized reply and refusal holds neither the machine root nor the data's machine-recorded path | (a) `ThroughLink` mapped to `project_target_unresolvable`: red at its code; (b) `TargetRefused` sends the checked absolute path: red at the scan |
     | W-5 | `a_refused_relink_through_the_command_leaves_no_catalog_entry_and_open_lock_free` (ADV-2026-11-19-19 item 2) | (a) a relative `relink`; (b) a `relink` whose `locations.json` write fails after the engine's open (a folder at that name in the identity's machine folder, on every platform); each refused by its code, the catalog's names unchanged, the lock takeable | (a) the re-link check moved after the engine's open, with no close: red at the catalog; (b) `close` not called on the write failure: red at the catalog |
     | W-6 | `a_copy_answer_whose_data_is_not_found_writes_nothing_and_its_second_call_keeps_the_file_name_and_the_previous_lineage` (O5; contingent on P-6) | the answer `copy` with the data moved gives `not_found` with the name; `project.spatial` unchanged; no new identity folder; the second call (`copy` and `relink`) gives `opened` with `previous_file` `used` | the copy's lookup after the lock (main's order): red at `project.spatial` |
     | F-W1 | `open_project_requests_and_replies_round_trip_and_its_codes_are_what_the_constructors_build` (`fixtures.rs`) | the three requests; each reply fixture, `v0-open_project-opened-lineage` among them; each new error fixture equal to its constructor | `rename = "not-found"` on `not_found`: red at that fixture |
     | F-W2 | `the_open_project_closed_sets_refuse_any_other_value` | an unknown `answer`, lineage fact, `observed` word or `admission` word, and an absent `answer` or `relink` key, are each refused at deserialize | `#[serde(other)]` on the folder-lineage enum: red |
     | F-W3 | `skp_version_is_skp_0_14` (the version test's literal edit, which §4 allows) | the literal | the literal back to `skp/0.13`: red |

   - **Not covered through the command:** `Cancelled`. K-O13 is its rig, and its map arm is one line.

9. **ADV-2026-11-19-21 item 1, by item.**
   - **(a)**
     - `folders.json` is read before the lock. This is not covered: the case needs two processes inside one call. The doc of `open_project` names it for the source comment.
     - A copy whose `replace` fails leaves the new identity's folder with `folders.json` and `open.lock`. This is not covered: nothing reads that identity. The doc names it, and P5 reads it against item 62 (ADV-2026-11-19-21 item 2).
     - Step 4's doc becomes: of the identity `project.spatial` named when step 1 read it, which after the answer `copy` is the original identity, not the new one. Clause check: `dir` is `record_dir` of `project`, which is cloned before the copy's reassignment.
   - **(b)** `OpenFailure::Cancelled`'s doc becomes: The cancel key was cancelled before the engine's open returned; a cancel after it is not seen, and the reopen replies `Opened`. SKP-V0.md §12 states the same. This is timing inside one call, named, not covered.
   - **(c)**
     - The lock: item 6, with K-O26, K-O17 (b) and K-O4.
     - `file_name` is an `Option`: item 5 (b) and W-3.
     - The paths: item 5 (d) and W-4.
     - The re-link: SKP-V0.md §12 states that a `relink` replaces the dataset's entry in `locations.json` whatever it held, and that a client sends one after `not_found`. That obligation is P4's shell test.
   - **(d)** O5: W-6, contingent on packet P-6. Under P-6 (i) it is a "not covered" line instead.
   - **(e)** The catalog row: W-5. The ADR words: item 11.
   - **(f)** The vocabulary: packet P-3.
     - One way: the wire sends the descriptor's words (`size`, `mtime`, `footer-length`, `footer-hash`; `engine/src/descriptor.rs` `differing_components`).
     - The other way: the wire maps them to the project file's keys (`byte_size`, `modified_ns`, `footer_length`, `footer_sha256`; `kernel/src/dataset_ref.rs` `observed_json`).
     - `engine.source_changed`'s `detail` already sends the descriptor's words (`kernel/src/skp.rs`, the `SourceChanged` arm of `error_of`).

10. **ADV-2026-11-19-04 item 6 and ADV-2026-11-19-07 item 6, by item.**
    - **6 (a) P-4:**
      - (a) (i): item 5 (b)'s `lineage`;
      - (b): item 5 (b)'s `check`, names only;
      - (c) (i): `project_target_wrong_kind`, with the name for the advisor (P-4 (b) of the packet);
      - (d): item 5 (c).
    - **6 (b) P-5:**
      - (a) (ii): L8;
      - (b) and (c): item 5 (b);
      - (d), as read: ADR-036 §8 gives `completeness` as complete, or as incomplete with an integer `withheld` and a list `kinds_not_recorded` of kinds. It states no rule that the list is not empty or holds no duplicate, and none that `withheld` equals the withheld lines. The reader as merged (`COMPLETENESS` and `KINDS` in `kernel/src/session_history.rs`) admits an empty or duplicated list of at most five and any `withheld` from 0 to 2^53 − 1, and does not compare it with the withheld lines. P3b states both properties as read, changes neither, and puts neither on the wire, since nothing at P3b consumes them and the marker's words are piece 5's. A change to §8 goes to the advisor first.
    - **6 (c) P-8:** item 5 (g).
    - **6 (d) P-9 (c) (ii):** L9.
    - **ADV-2026-11-19-07 item 6:**
      - O3: K-O27 as a check, or, under packet P-5 (a), a "not covered" row: a later save checks only the lineage and the reader, so after D1's second branch it replaces another identity's file.
      - O4: item 6's module-doc clause.

11. **ADR-036 Amendment 2 item 3** (ADV-2026-11-19-19 item 3).
    - The advisor's words land in P3b-2's pull request, appended as the advisor gives them. Nothing is drafted here.
    - What they state is shown by W-1 (b): a reopened open takes the project file's dataset identity, and a step after the reopen carries it. K-O21 (b) shows the same in the kernel.
    - The gates check each clause.

12. **Producers and their consumers** (R2).

    | Producer | Consumer | Seam's end-to-end test |
    |---|---|---|
    | `LineageRefused::Unreadable` and `ThroughLink` (P3b-1) | P3b-2's `lineage` mapping | L8, L9; `v0-open_project-opened-lineage`; W-1 |
    | `Projects::release_ended` (P3b-1) | the shipped `close_dataset` binding; `open_project` | K-O17 (b), K-O26; E-SECOND, E-CRASH-UNLOCK (P4) |
    | the `open_project` binding command (P3b-2) | P4's `openProject` in `frontends/shell/src/skp/client.ts` | E-REOPEN (P4) |
    | `OpenProjectRequest`, `OpenProjectResponse` and their member types, the new constructors (P3b-2) | `Projects::open_project_command` and the binding | F-W1, F-W2, W-1 to W-6 |

    - Every other `pub` item is a gate finding (R2 (d)).
    - All of these are named in each PR body and in the node's plan summary.
    - The node is not done until each seam's test has passed on main (R2 (c)).

13. **Not covered, by name, with the reason** (beyond items 8 and 9).
    - Amendment 36 item 9's two live opens bound to one record. After a session end, the ended open stays bound and in the catalog. Its steps are refused by `require_live`, not by the catalog.
    - `PathNotUnicode`: the folder, the `at` segments, the machine location and the `relink` all arrive as UTF-8, so no ordinary path reaches it.
    - A cancel after the engine's open returned: item 9 (b).

14. **Regions.**
    - P3b-1 and P3b-2 run in sequence (item 2).
    - P3b-2 is the only part touching `protocol/`.
    - Rule (00) at each dispatch holds over the pieces in progress and those awaiting merge. It covers the shell files of item 2 and `protocol/`.
    - Each part takes main in before its gate (ADV-2026-11-16-06 item 4).
    - The reviewer recomputes each file list with git.

15. **Stops.** The worker stops and reports, alone, when any of these happens:
    1. A file or region outside item 7 (a) or 8 (a) is needed.
    2. A `pub` item outside item 12 is needed.
    3. An existing test needs an edit other than the literal (I3), or a dependency or a lock file changes (I6).
    4. A declared test passes at its base, or a mutation does not turn its test red.
    5. A refusal or reply carries an absolute path that the request did not carry, outside item 5 (d)'s named exception. That is a stop, not a strip.
    6. K-O17 (b), K-O26 or L9 fails on any platform, or cannot be made deterministic.
    7. A case that a test cannot build. That is a stop, not a skip.
    8. Code is begun before the advisor's ruling on this amendment's packet.
    9. A literal site is found that item 2 does not list.

16. **Class, gates, pushing, clippy and the model.**
    - **Class.** Full class, both gates, for each part (item 1).
    - **Pushing** (ADV-2026-11-19-10 item 2).
      - The tests' commit is its own commit, before the code.
      - It is pushed together with the code commit that makes it pass.
      - Its failure before code is shown by the worker's local run: the exit code and the failing names, at the tests' commit.
      - A stop still pushes (item 3 of the same ruling).
    - **Clippy.** The reviewer runs it at the gated head, in a hold, on the changed crates:
      - `cargo clippy --locked -p spatial-kernel -p spatial-skp --all-targets` in the root workspace;
      - for P3b-2, and for P3b-1's `commands.rs`, the `spatial-ide-shell` crate in `frontends/shell/src-tauri`.
      - A warning in a file the part changes is a finding.
    - **On the laptop,** by THE MACHINE paragraph, at each part's final candidate:
      - the focused kernel targets: `project_reopen`, `project_save`, `project_save_skp`, `project_lock_crash`, `project_store`, `session_history`, `no_generation_in_persisted_artifacts` and the skp targets; and `project_reopen_skp` for P3b-2;
      - `cargo test -p spatial-skp`, with the conformance harness;
      - for P3b-2, the shell's typecheck and tests, after `npm ci` in `frontends/shell` and in `renderer/bundle-viewer`;
      - every mutation of items 7 (b) and 8 (b), observed;
      - §2.11's command;
      - empty lock-file diffs.
    - **The app window.**
      - One E-SAVE run per part: P3b-1 changes the shipped `close_dataset` and save, and P3b-2 changes every request's literal.
      - At P3b-2's final head, every e2e suite, since §5 declares their outcomes unchanged.
    - **CI:** the workspace on three platforms, fmt, and the governance workflows.
    - **The worker's model** (ADV-2026-11-18-02 item 2; ADV-2026-11-19-23 item 5). P3b-1: worker-high on the strongest model, for a lock, a path check and a persistence format. P3b-2: two workers on the one branch, in sequence, in the order the custodian's brief gives: the standard worker for the wire types, the fixtures and the literal; worker-high on the strongest model for the map of item 5 (c) and (d), O3's check, O5's arm and the store's A1 places.

17. **Records.**
    - Each part's closing amendment holds references and hashes only, with the counts in both columns and a class 8 row for each overrun.
    - The PR body and the node's plan summary name item 12's producers and consumers, and the strings of item 5 (c) and (g) under P6.
    - For P3b-2, the PR body names ADR-036's appended words as the advisor's.

18. **Where each ruling item is met.**
    - ADV-2026-11-19-04 item 5: item 5 (c). Item 6: item 10.
    - ADV-2026-11-19-07 item 6: item 10.
    - ADV-2026-11-19-15 item 4: item 9 (f).
    - ADV-2026-11-19-19 item 2: W-5. Item 3: item 11.
    - ADV-2026-11-19-21 item 1: item 9. Item 3: items 2 to 4.
    - ADV-2026-11-19-10 item 2: item 16.
    - Amendment 37 item 9 note 5: item 7 (a).
    - Amendment 38 item 13: items 4 and 10.
    - Amendments 41 item 9 and 42 item 8: packet P-3. Amendment 42 item 9: item 11.

19. **Superseded index.**
    - §2.2's new codes:
      - `project_target_outside_folder` is withdrawn (P-4 (d));
      - `project_target_wrong_kind` is added, its name contingent;
      - `project_file_unreadable` is added, contingent on packet P-7;
      - `project_machine_record_refused` and `project_known_folders_full` stand by Amendment 1 item 5.
    - §2.2's `opened`:
      - gains `view` (class 1);
      - its `lineage` is the two facts, with no lines;
      - its `check` holds names only.
    - Amendment 36 items 1 and 8: the release at a session end by the forwarder is replaced by item 6, contingent on packet P-2.
    - Amendment 36 item 5 (b): after the answer `copy`, the data lookup runs in step 2. This is contingent on packet P-6, and it is class 1.
    - §3's F4 row: packet P-3.
    - §2.11's step-2 lists gain these files (class 9):
      - `kernel/src/session_history.rs` and `kernel/src/project/store.rs`;
      - `kernel/tests/project_save.rs`, `project_reopen_skp.rs` and `no_generation_in_persisted_artifacts.rs`;
      - ADR-036.
    - §4's step-2 table gains the tests of items 7 (b) and 8 (b) (class 9).
    - Nothing else is superseded.

20. **The packet, as the advisor ruled it (ADV-2026-11-19-23).** Where this item differs from an item above, this item stands. Where an item above says "recommended" or "contingent", this item settles it.
    - **P-1:** (i). Two parts, in sequence.
    - **P-2:** (iii). Item 6 stands. Before any code the worker confirms by reading that the command `save_project` refuses an open whose entry `release_ended` has dropped, before it reaches `Projects::save`: an open the catalog no longer holds, as an unknown dataset; an ended one, at the live check. If either can reach the first-save path, the worker stops. K-O26 gains one assertion: after the release, `save_project` for the ended open is refused, and the machine store gains no folder.
    - **P-3:** (i), the descriptor's words. §3's F4 row predicted another word and did not hold. P3b-2's closing records it as class 2, by §5. The row is not edited.
    - **P-4:** (a) names only; (b) `project_target_wrong_kind`, with `expected`; (c) (i), external; (d) both.
    - **P-5:** (b), the check is built, in P3b-2 and not in P3b-1, with a refusal of its own.
      - Why: `project_folder_holds_project`'s message says that the folder already holds `project.spatial`, which is what a later save expects to find; and its `folder` field would carry a path that the request of a later save did not carry (item 5 (d)).
      - The check, K-O27 and the code move from item 7 to item 8. K-O27's refusal is the new code. Its working name is `project_file_names_another_project`. Its fields hold no folder and no path. §11.4 is not widened; SKP-V0.md §11 gains the code's entry.
    - **P-6:** (ii).
    - **P-7:** (i).
    - **P-8:** (i). A shell test that pins the old code for a machine-record refusal at a save is stop 3.
    - **P-9:** (i), with a bound. Before code the worker lists each arm of the project-file reader's refusal text that can repeat bytes of the file, with the most it can repeat. An arm that can repeat more than 256 bytes of the file, or a control character, is a stop.
    - **P-10:** (i). The message is widened; its words come with the strings ruling below.
    - **P-11:** (i), named as item 5 (d)'s exception. P4's form reads every place where the shell writes a refusal's message, the session log among them.
    - **P-12:** (i).
    - **The ceilings, restated for P-5's move** (item 3's table is superseded by this one):

      | Part | Group | Ceiling |
      |---|---|---|
      | P3b-1 | kernel product | 65 |
      | P3b-1 | kernel tests | 175 |
      | P3b-1 | src-tauri | 15 |
      | P3b-2 | protocol | 440 |
      | P3b-2 | fixtures | 375 |
      | P3b-2 | literal (≤ 22 files) | 190 |
      | P3b-2 | kernel product | 255 |
      | P3b-2 | kernel tests | 545 |
      | P3b-2 | src-tauri | 35 |
      | P3b-2 | records (ADR-036) | 10 |

      P3b-1 is 255 lines in all, and P3b-2 is 1,850. The step's own ceilings are not touched, and the human is told item 4's totals before P3b's code.
    - **The strings ruling, before P3b-2's code.** The architect prepares one table by reading, while P3b-1 is built: for each row of item 5 (c), for O3's code and for `cancel_key_in_use`, the code, its fields and its whole message for one example; and `MachineStore`'s cases at a reopen each on a line of its own (the lock, a read, a write), because `project_file_unwritable`'s message says that the project could not be written. The advisor rules the messages, the three A1 places of item 5 (g) and ADR-036's words of item 11 in one ruling at P3b-2's cut. No constructor, fixture or test pins a message before that ruling.
    - **Two more stops** (item 15): 10. a `rule` or a message built from bytes of a file the kernel did not write, beyond P-9's bound; 11. in P3b-2, a message written into a constructor, a fixture or a test before the strings ruling.
    - **Item 6's doc words** are accepted as drafted. Both gates check each clause at the head.

Read the last amendment first.

Nothing above is edited.

## Amendment 44 — P3b-1's stop at item 20's P-2 read, ruled (ADV-2026-11-19-24): the catalog and live checks under the `saved` mutex, `SaveFailure::Open`, K-O28, the lock order, and P3b-1's ceilings restated (class 9)

*Written by the custodian from ADV-2026-11-19-24's items, on main before P3b-1's code (its item 3). References only. Nothing below is a quotation.*

1. **The stop.** P3b-1's worker-high stopped at item 20's P-2 read, before any code.
   - Inside one request, a `release_ended` that runs between the command's checks and `Projects::save` taking the `saved` mutex sends a save of a released open down the first-save branch.
   - The advisor ruled it P-2's stop, rightly taken (ADV-2026-11-19-24 item 1).
   - The worker's report is filed at `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3b-1-worker-stop-report.md`.
2. **The remedy, (a)** (item 2).
   - Under the `saved` mutex, before it decides whether the save is a first save, `Projects::save` checks that the catalog still holds the open and that its session is live.
   - A release before the save gets the save refused, as the command would refuse it. A release after the save waits for it.
   - What is left is item 6's named window.
3. **How it is built** (item 3).
   - (a) **The refusal** carries the host's own error unchanged, through one new variant of the `pub` type `SaveFailure`: working name `SaveFailure::Open`, built as `OpenFailure::Open` is. `skp_error_of` passes it through. Item 12's table gains a row:
     - producer: `SaveFailure::Open` (P3b-1);
     - consumer: `skp_error_of` in `save_project`;
     - the seam's tests: K-O28, and item 20's added assertion of K-O26.
   - (b) **The command's own checks** before the mutex stay.
   - (c) **The lock order** is stated in a comment where the mutex is taken: the `saved` mutex first, then the host's catalog and generations. `release_ended` takes them in the same order.
     - Before code, the worker lists by search every place that takes the `saved` mutex, and what it holds at that moment.
     - A place that takes them in the other order is stop 12, and goes to the advisor.
   - (d) **The doc of `Projects::save`** gains one sentence for the check, in the worker's words. Both gates read it.
4. **K-O28**, named by the worker, in `kernel/tests/project_save.rs` or `kernel/tests/project_reopen.rs` (item 4).
   - Two cases, each calling `Projects::save` directly after `release_ended`, with an empty folder given: an open that was closed, and an open whose session ended.
   - Each is refused with the host's refusal for it; the machine store's listing is unchanged; and the folder holds no `project.spatial`.
   - Its mutation: the two checks under the mutex removed. Predicted: each case saves as a first save, and the test fails at its refusal assertion.
   - Item 20's added assertion of K-O26 stays, through the command.
5. **P3b-1's ceilings** (item 5), in both numstat columns:

   | Group | Ceiling |
   |---|---|
   | kernel product | 85 |
   | kernel tests | 220 |
   | src-tauri | 15 |
   | **Total** | **320** |

   Item 20's rows for P3b-1 are superseded; P3b-2's stand.
6. **The gates.** Their first question at P3b-1's head is the lock order, and both gates read it (item 6). ADV-2026-11-19-23 item 7's question stays.
7. **P3b-1's `pub` items** are item 7 (c)'s three, and `SaveFailure::Open`.
8. **Superseded index:**
   - item 20's P3b-1 ceilings, by item 5 here;
   - item 7 (c)'s `pub` list, by item 7 here;
   - item 15 gains stop 12, by item 3 (c) here.
   - Nothing else is superseded.

Read the last amendment first.

Nothing above is edited.

## Amendment 45 — P3b-2's strings, ruled (ADV-2026-11-19-26): P-9's bound met at the wire by one helper, the sixteen messages, the three A1 places, ADR-036 Amendment 4, and P3b-2's ceilings restated (class 9)

*Written by the custodian from ADV-2026-11-19-26's items, on main before P3b-2's code (its opening paragraph). References only. Nothing below is a quotation. Every text the worker copies is in the ruling's own fences, and the worker copies it from the filed ruling byte for byte, never from this amendment.*

1. **The strings ruling.** Item 20's strings ruling for P3b-2 is ADV-2026-11-19-26, given on the architect's table at `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3b-2-strings-table-architect.md`. Stop 11 of item 20 is met once this amendment is on main (the ruling's item 7).
2. **P-9's bound is met at the wire, not in the reader** (the ruling's item 1). The shared reader's files are not touched.
   - (a) **One helper** in `kernel/src/project/mod.rs`, named by the worker, bounds a text taken from a file the kernel did not write: at most 256 bytes, cut on a character boundary with the cut marked, and every control character replaced (item 1 (a) gives the mark and the replacement).
   - (b) It applies to `path` and `rule` of `project_file_refused`, to `rule` of `project_machine_record_refused`, and to `segment`, in the reopen's map and in the save's `skp_error_of`, before the constructor builds the message.
   - (c) **W-4 gains three cases**, as item 1 (c) states them: a number token of 100,000 digits, a control character in a key, and a word of 4,096 bytes where a closed word is expected. Each asserts that no field and no message holds a control character, and that each bounded field is at most 262 bytes. Its mutation: the helper returns its input. Predicted: all three red.
   - (d) **Stop 10** is restated by item 1 (d): a text from a file the kernel did not write that reaches the wire without the helper.
   - (e) **Two named exceptions** (item 1 (e)): an engine message through `Open(e)`, unedited as P-11 has it; and an identity read from a file, which is validated.
3. **The messages** (the ruling's item 2). Its first fence gives the whole format of each of sixteen messages.
   - The worker copies each byte for byte. Where `OpenFailure`'s own text differs from its line, the worker makes that arm equal to the line.
   - What each line changes is in item 2's list under the fence. In short:
     - `cancel_key_in_use` names both calls;
     - `project_file_refused` has a new head for the save and the reopen alike. Its data file `v0-error-project_file_refused.json` changes with it, class 1;
     - `project_open_elsewhere` keeps its code and gets a new message;
     - a new code, `skp.project_machine_store_failed` with one field `detail`, carries the reopen's `MachineStore` failures and the binding with no `Projects`. It replaces the P-7 note that `MachineStore` stays under `project_file_unwritable`, which keeps the save's failures and the copy's `replace`;
     - the two unreachable arms take `skp.project_target_unresolvable` with `locator` alone;
     - the not-Unicode line has no field and no path, replacing item 5 (c)'s `detail`;
     - O3's code has the fields `project` and `found`;
     - a join failure at the binding is `skp.open_project_panicked`, by the binding's pattern.
   - **`kernel/src/skp.rs` joins P3b-2's files** for the two untrue doc clauses of `OpenRegistry`, comment lines only, in the words the architect's gate gives.
4. **Two messages stand with a clause that can be untrue, named** (item 3):
   - the engine's clause on the caller's assertion at a reopen; P4's form decides what the shell shows;
   - `skp.unknown_dataset` from the reopen's own check after its open. It is named in a source comment and in the closing, and not changed.
5. **The three A1 places of item 5 (g)** (item 4).
   - `stored_path` takes a noun and prints no path. Its three texts are the ruling's second fence, and the nouns are given in item 4.
   - The reviewer's A1 (i) is the new head of item 3 here.
   - A test inside `store.rs`, `file.rs` or `strict_json.rs` that pins one of the old texts, or the old head, is edited to the new text and to nothing else, and the worker names each in its report. Any other edit of an existing test is stop 3.
6. **ADR-036 Amendment 4** (item 5). The ruling's third fence is appended to `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` after Amendment 3, by script, byte for byte, with the date of landing in its slot. Both gates check each clause against the code at P3b-2's head. An untrue clause goes to the advisor.
7. **Docs that widen** (item 6), in the worker's words, read by both gates:
   - the doc of `project_file_refused`;
   - SKP-V0.md §4 item 5's list, which gains `open_project`;
   - the new §12.
8. **P3b-2's ceilings** (item 7). Item 20's P3b-2 rows are superseded by these:

   | Group | Ceiling |
   |---|---|
   | protocol | 455 |
   | fixtures | 390 |
   | literal | 190, in at most 22 files |
   | kernel product | 285 |
   | kernel tests | 590 |
   | src-tauri | 35 |
   | records | 10 |
   | **Total** | **1,955** |

9. **For P4's strings** (item 8), which go to the advisor:
   - the shell's own words for each code;
   - the clause of item 4 here on the caller's assertion;
   - how the shell bounds what it shows and logs of an engine message.
10. **Superseded index:**
    - item 5 (c)'s `detail` for the not-Unicode arm, by item 3 here;
    - the P-7 note on `MachineStore`, by item 3 here;
    - item 20's stop 10 wording, by item 2 (d) here;
    - item 20's P3b-2 ceilings, by item 8 here;
    - P3b-2's files, which gain `kernel/src/skp.rs` (comment lines only), by item 3 here.
    - Nothing else is superseded.

Read the last amendment first.

Nothing above is edited.

## Amendment 46 — P3b-1's stop 4, ruled (ADV-2026-11-19-28): K-O4's mutation moved to K-O26, close_dataset's release off the main thread, the doc words, one arm named not covered, and P3b-1's ceilings restated (class 8)

*Written by the custodian from ADV-2026-11-19-28's items, on main before the worker continues (its opening paragraph). References only. Nothing below is a quotation. Every text the worker copies is in the ruling's own fences, and the worker copies it from the filed ruling byte for byte, never from this amendment.*

1. **Stop 4 was rightly taken** (the ruling's item 1). K-O4 makes each second open through a new `Projects`, so no change to `release_ended` can turn it red.
   - (a) K-O4's row in Amendment 43's table loses its mutation. K-O4 stays unedited and keeps the two recorded mutations it merged with.
   - (b) **K-O26 gains a second recorded mutation:** `release_ended` drops every entry. K-O26's control reopens the folder through the same `Projects` that holds the lock, while the open is live. Predicted: that reopen replies `opened`, and the test fails at the assertion named the control.
   - (c) The worker adds the mutation to K-O26's doc comment, runs it once, restores the file and reports the assertion it failed at. If K-O26 stays green, that is stop 4 again and goes to the advisor.
   - (d) It is the one mutation of the part that shows the lock is kept while the open is live (item 1 (d)).
2. **The main thread** (item 2), ruled before the gates.
   - (a) `close_dataset` does not call `release_ended` itself. After the host's close it hands the call to another thread with `std::thread::spawn` and does not wait for it.
   - (b) What follows is named in `close_dataset`'s doc in the worker's words, as item 2 (b) states it: the lock can still be held when `close_dataset` replies, for as long as a save in flight takes; a reopen in this process is not affected; a reopen from another process inside that time is refused as already open.
   - (c) The kernel tests are not changed by this.
   - (d) **Not covered in this part, by name:** the binding's hand-off. No test of this part reaches `close_dataset`; P4's suites are the first to run it.
   - (e) **For P3b-2:** `open_project`'s binding runs it off the main thread, as `save_project`'s does.
   - (f) Both gates read (a) and (b), and say whether anything relies on the lock being free when `close_dataset` replies.
3. **Doc words** (item 3). The worker copies each from the ruling's fences, wraps lines at the file's width, and changes no other word.
   - (a) The form's D4 sentence in the `save_project` binding's doc becomes the ruling's first fence.
   - (b) `kernel/src/project/store.rs` joins P3b-1's files, comment lines only, for one sentence of `ProjectLock`'s doc: the second fence (Old) is replaced by the third (New).
   - (c) In the module doc of `commands.rs`, the fourth fence is inserted directly after the word `serialize` in the sentence that begins with the bold words on logic, with one space before it.
   - (d) The worker's own docs of `release_ended` and of `close_dataset` follow item 2 here, in the worker's words. Both gates read them.
4. **Not covered, added to item 13 by name** (item 4): the arm `SaveFailure::Open(e) => e` of `skp_error_of`. Reaching it needs a release between the command's own checks and the mutex, inside one call. Amendment 44 item 3 (a)'s sentence that the seam's tests are K-O28 and K-O26's added assertion was wrong for the consumer: K-O28 reaches the producer, and neither reaches the arm.
5. **Recorded, no action** (item 5):
   - class 2: K-O17 (b) failed at its base on missing symbols, where item 7 (b) predicted an assertion;
   - class 1: K-O17 (b) reuses K-O17's child through a helper, and one extra test commit corrects the worker's own type error;
   - the two clippy warnings in `commands.rs` are outside the part's hunks and stay.
6. **P3b-1's ceilings, class 8** (item 6), in both numstat columns. Amendment 44's are superseded by these:

   | Group | Ceiling |
   |---|---|
   | kernel product | 95 |
   | kernel tests | 240 |
   | src-tauri | 25 |
   | **Total** | **360** |

   The overrun of 229 on 220 is accepted as counted. Nothing is cut or packed to fit.
7. **How it continues** (item 7). The same worker-high, or a new one on the strongest model with the ruling and the report, on the same branch, `cut/b2-piece-1c-p3b-1`. Its commits are pushed together, under ADV-2026-11-19-10. It reruns the part's focused tests, clippy and fmt at its head, and K-O26's two mutations. Then the pull request and both gates, whose first question stays the lock order.
8. **Superseded index:**
   - Amendment 43's K-O4 row mutation, by item 1 (a) here;
   - the form's D4 sentence, by item 3 (a) here;
   - Amendment 44 item 3 (a)'s sentence on the seam's tests, by item 4 here;
   - Amendment 44's ceilings, by item 6 here;
   - P3b-1's files, which gain `kernel/src/project/store.rs` (comment lines only), by item 3 (b) here.
   - Nothing else is superseded.

Read the last amendment first.

Nothing above is edited.

## Amendment 47 — PR 339's gate findings, ruled (ADV-2026-11-19-29): the thread's start by a builder, four doc texts, two clauses of Amendment 46 corrected by reference, the ceilings restated, and E-SAVE repeated

*Written by the custodian from ADV-2026-11-19-29's items, on main before the worker's commit. References only. Nothing below is a quotation. Every text the worker copies is in the ruling's own fences, and the worker copies it from the filed ruling byte for byte, never from this amendment.*

1. **The ruling.** ADV-2026-11-19-29, the advisor's under the human's delegation of 2026-11-13, filed under `state/directives/` in the same commit as this amendment. It rules PR 339's two first-attempt gates at 70335c37: both PASS WITH NOTES, nothing blocking; the gates are right on the architect's D-1, D-2 and D-3.

2. **D-1, corrected by reference, class 3** (ruling item 2). Amendment 46 item 2 (d)'s clause naming P4's suites as the first to run the hand-off is superseded by ruling item 2: the existing suites that close a dataset already run it, none asserts its effect, and P4's E-SECOND and E-CRASH-UNLOCK are the first to assert it. Amendment 46 stays unedited.

3. **D-2, corrected the same way, class 3** (ruling item 3). Amendment 46 item 4's condition for reaching the arm `SaveFailure::Open(e) => e` is superseded by ruling item 3: a close or a session end between the command's own checks and the check under the `saved` mutex reaches it, with no release needed, and that time is not always short. The arm stays not covered.

4. **The thread's start, changed in this part** (ruling item 4).
   - (a) `close_dataset` starts the release thread with a builder that returns an error where a plain spawn panics. On an error the command logs the error alone, as the emitter thread in the shell's `lib.rs` logs its own, and goes on. The close's result is unchanged.
   - (b) The logged line is the one in ruling item 4 (b)'s fence, with the error after it.
   - (c) Not covered, by name: the error branch.

5. **Doc words** (ruling item 5): its four fences, (a) to (d), each replacing the text the item names on the branch: the module doc's parenthesis in `commands.rs`; the paragraph of `close_dataset`'s doc; the D4 sentence in the `save_project` binding's doc; and the tail of `release_ended`'s doc in `kernel/src/project/mod.rs`. The worker applies them by script, wraps lines at the file's width and changes no other word.

6. **Ceilings** (ruling item 6), in both numstat columns from the part's base, by section 2.11's command: kernel product 100, kernel tests 240, src-tauri 40; 380 in all. The src-tauri overrun at the first attempt, 27 on 25, is accepted as counted, class 8. Nothing is cut or packed to fit.

7. **Runs** (ruling item 7).
   - The kernel's runs, the worker's and the first-attempt reviewer's, stand where git shows that every line under `kernel/` changed after them is a comment line.
   - At the new head: the src-tauri tests, clippy and fmt.
   - E-SAVE is repeated at the new head, because item 4 changes code. The run at 70335c37 passed every step with rc 0; it is an early read, not this part's run.

8. **How it closes** (ruling item 8).
   - A worker on the standard model applies item 4 and item 5's four texts.
   - The reviewer alone reads the changed lines in a short second attempt: item 4's code, and each clause of item 5's texts against the code. The architect is not asked again.
   - An untrue clause goes to the advisor, unreworded.
   - Then the merge request, with the two first-attempt reports, the second attempt's, and E-SAVE's result at the head.

9. **Noticed, not this part's** (ruling item 5 (a)). The sentence of `commands.rs`'s module doc that the parenthesis sits in was already untrue on main for the `binding_publish_*` commands. It is listed for a later docs correction.

10. **For P3b-2's form** (ruling item 9): `open_project`'s binding off the main thread (ADV-2026-11-19-28 item 2 (e)); P4's E-SECOND polls for the lock after a close; `open_project` pushes its entry after `open_under`.

**Superseded by this amendment:** Amendment 46 item 2 (d)'s first-to-run clause (item 2 here); Amendment 46 item 4's condition (item 3 here); Amendment 46 item 6's ceilings (item 6 here).

Read the last amendment first.

Nothing above is edited.

## Amendment 48 — P3b-1's closing, before PR 339's merge request: the fix commit, the gates, the counts, the runs, E-SAVE at the head, CI, main since the merge base, and the notes to the advisor

*Written by the custodian, 2026-11-19, before PR 339's merge request. References and hashes only. Nothing below is a quotation.*

1. **The fix commit** (Amendment 47 items 4, 5 and 8). H = 4b8d67023461320c44f5ef70631d5057133eab6d, the one commit after 70335c37eacc479347f811f6332ab197c3cec593, by the worker on the standard model: its report is `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3b-1-a47-worker-report.md`. It applies Amendment 47 item 4's change and the five fences of ADV-2026-11-19-29 (4 (b), then 5 (a) to (d)) by its script from the filed ruling, each old text found once. The script's first run applied item 4 and stopped on a locate bug of its own; the rerun applied the four texts (the report says so).

2. **The gates.**
   - Attempt 1, at 70335c37, both PASS WITH NOTES: `state/consults/gates/2026-11-19-b2-piece-1c-save-and-reopen-p3b-1-gate-architect.md` and `state/consults/gates/2026-11-19-b2-piece-1c-save-and-reopen-p3b-1-gate-reviewer.md` (gate-log 795 and 796), ruled by ADV-2026-11-19-29.
   - Attempt 2, the reviewer alone at H (Amendment 47 item 8): PASS WITH NOTES, no correctness or documentation finding, and no clause of the four texts untrue: `state/consults/gates/2026-11-19-b2-piece-1c-save-and-reopen-p3b-1-gate-reviewer-attempt-2.md` (gate-log 797). The architect was not asked again.

3. **The counts** (Amendment 47 item 6). By section 2.11's command over 99cceff7...4b8d6702, both columns, the worker's and the reviewer's equal: kernel product 92 of 100, kernel tests 234 of 240, src-tauri 31 of 40; 357 of 380. No ceiling is passed. The lock files are unchanged.

4. **Runs at H** (Amendment 47 item 7).
   - The src-tauri tests: rc 0, 76 and 2 passed (the worker's; the reviewer reused them).
   - Clippy in src-tauri: rc 0, the three standing warnings, none in a changed hunk (the worker's; the reviewer reproduced it in a hold).
   - fmt: rc 0 in src-tauri and at the root (both ran it).
   - Every changed line under the kernel after 70335c37 is a comment line (0 others, both counted), so the kernel's earlier runs stand.

5. **E-SAVE at H** (Amendment 47 item 7): one run on port 5400, rc 0, all twelve steps PASS, from 2026-11-19T18:52:18Z to 18:52:53Z by its log. The debug exe was 91578880 bytes, sha256 2dd2a1b21def166e29a988ad4549a55eef2dcebf48e1d62d8fbf05eaf9b1e3fc. The Sonnet tester's report is `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3b-1-e-save-series-tester-report.md`; it handed back once mid-build and was resumed by message, and its report covers the whole run. The early read at 70335c37 also passed every step (the ledger's 1119am entry). It is not this part's run and is not filed as a series report (ADV-2026-11-16-06: one series report per PR).

6. **CI at H**: 12 runs, all success, read at 2026-11-19T19:00:24Z.

7. **Main since the merge base** (ADV-2026-11-14-21 item 6 (a)). The merge base is d3522d779b18059f7c788bc2126ceb82e2626db7. None of the PR's seven paths changed on main after it, so the branch takes nothing from main.

8. **To the advisor, with the merge request** (Amendment 47 item 8): attempt 2's notes N1 (the refused thread's line goes to stderr alone, not the session log; a packaged build has no console) and N3 (another call of the release can run first, so item 5 (d)'s held-until clause holds of any such call), by reference to its report, unreworded. The reviewer marks neither as an untrue clause. N2 and N4 are notes.

9. **Not covered, at H**: the error branch of Amendment 47 item 4 (its item 4 (c)), and the arm of the open's failure in the save (Amendment 46 item 4, its condition as Amendment 47 item 3 corrects it). Both are still true: attempt 2's question 2, and attempt 1's mutation of the arm.

Read the last amendment first.

Nothing above is edited.

## Amendment 49 — P3b-2 before its code: its base, ADV-2026-11-19-30's two doc pairs (class 9), the binding off the main thread, the gates' notes carried, K-O27's file and O3's variant, the two workers in order, and `skp.rs`'s two clauses

*Written by the custodian, 2026-11-19, from ADV-2026-11-19-28 item 2 (e), ADV-2026-11-19-29 item 9 and ADV-2026-11-19-30 items 2 to 5, on main before P3b-2's code. References only. Nothing below is a quotation. Every text a worker copies is in a ruling's own fences, and the worker copies it from the filed ruling byte for byte, never from this amendment.*

1. **The base.** P3b-1 merged by PR 339 (Amendment 48; the advisor's verdict is filed under `state/consults/merge-checks/`). P3b-2 is cut from main once this amendment is on main, where Amendment 43 item 8 puts it: branch `cut/b2-piece-1c-p3b-2`, worktree `C:/dev/wt/1c-p3b-2`, build folder `D:/wt-targets/1c-p3b-2`, and test data folder `D:/wt-data/1c-p3b-2`. Its rules are Amendment 43 items 5, 8 to 13 and 15 to 17, item 20 as ruled, Amendment 45, and this amendment, the last of them standing where they differ.

2. **ADV-2026-11-19-30's two doc pairs** (its items 2 to 4), class 9, comment lines only, in two files already in P3b-2's list.
   - (a) In `kernel/src/project/mod.rs`, the doc of `Projects::release_ended`: the ruling's item 2 Old becomes its item 2 New.
   - (b) In `frontends/shell/src-tauri/src/commands.rs`, the doc of `close_dataset`: the ruling's item 3 Old becomes its item 3 New.
   - (c) The worker applies both by script from the filed ruling under `state/directives/`, wraps lines at the file's width and changes no other word. Each Old is found once at the base (the custodian's script found each once at this amendment's base, comment markers and wrapping set aside); if it is not, that is a stop.
   - (d) They count inside P3b-2's ceilings, kernel product and src-tauri. An overrun is reported as counted (ADV-2026-11-19-12 item 6).
   - (e) Both gates read each clause against the code at their head. An untrue clause goes to the advisor.
   - (f) **Stop 12:** P3b-2 changes the code either sentence describes: the body of `release_ended` or the order of its callers, or the hand-off in `close_dataset`. The worker stops and reports; the sentence goes to the advisor before the gates (the ruling's item 4).

3. **The binding off the main thread** (ADV-2026-11-19-28 item 2 (e); ADV-2026-11-19-29 item 9). The reopen can wait on the `saved` mutex, so the `open_project` binding runs the command off the main thread, as the `save_project` binding does. Amendment 43 item 5 (e)'s `spawn_blocking` is that. A join failure is `skp.open_project_panicked` (Amendment 45 item 3). Both gates read it.

4. **The gates' notes carried** (Amendment 47 item 10; ADV-2026-11-19-29 item 9).
   - (a) **For P3b-2:** the reviewer's note N4 at PR 339's first gate. `open_project` pushes its saved entry after `open_under`, so a `close_dataset` of the new handle that lands between the two leaves that entry and its lock until the next release. It is timing inside one request: named, not covered, in P3b-2's closing. No code or doc change is declared for it.
   - (b) **For P4's form, not P3b-2's,** both already in the node's plan summary: E-SECOND does not assume the lock is free at a close's reply, and polls for it, bounded (the architect's N-4, first point, and the reviewer's matching note); and ADV-2026-11-19-30 item 5, the architect's N-4 second point: a reopen, in the same window, of the project open there is refused as already open, and P4's form says which order it wants.
   - (c) The sentence of `commands.rs`'s module doc that Amendment 47 item 9 notices stays for the later docs correction. P3b-2's addition to that module doc (Amendment 43 item 8 (a)) does not edit it; if the addition cannot be made without editing it, the worker says so in its report.

5. **K-O27's file and O3's variant** (item 20's P-5, as ruled).
   - (a) P-5 moved the check, K-O27 and the code from item 7 to item 8. K-O27's row is appended to `kernel/tests/project_save.rs`, where item 7 (a) placed it, or to `kernel/tests/project_save_skp.rs` if its assertion of the wire code needs that file's rig; one of the two, and the report says which.
   - (b) The refusal of its own needs one new variant of `SaveFailure`, named by the worker, whose text is ADV-2026-11-19-26's line for `skp.project_file_names_another_project`. It joins item 12's producers: the variant is consumed by `skp_error_of`'s map, and its seam's test is K-O27. Any other new `pub` item stays stop 2.

6. **The two workers, in this order** (Amendment 43 item 16; ADV-2026-11-18-02 item 2).
   - (a) **First, the standard worker:**
     - item 5's wire types and constructors in `protocol/skp/src/v0/`, with each message copied from ADV-2026-11-19-26's first fence, and `mod.rs`'s `skp/0.14` paragraph;
     - SKP-V0.md: §4 item 5's list, §8's entry, the new §12, and §11's entry for O3's code;
     - the docs that widen of Amendment 45 item 7 in `protocol/`;
     - the reply and error fixtures, `fixtures.rs`, the conformance rows, `main.rs`'s two mappings and the README paragraph;
     - every literal site, recounted at its base;
     - F-W1, F-W2 and F-W3, with their mutations.
   - (b) **Then worker-high on the strongest model,** for concurrency and security: the binding off the main thread and the lock it can wait for; the no-path rule and P-9's bound. It builds:
     - item 5 (c) and (d)'s map, as `Projects::open_project_command`;
     - Amendment 45 item 2's helper;
     - O3's check, with item 5 (b)'s variant and K-O27;
     - O5's arm;
     - the store's A1 places, and `OpenFailure`'s arms made equal to the fence;
     - `kernel/tests/project_reopen_skp.rs` with W-1 to W-6, W-4's three added cases among them;
     - the binding and its handler entry;
     - ADR-036 Amendment 4;
     - item 2's two pairs.
   - (c) Each worker's tests commit is its own commit before its code, and is pushed together with the code commit that makes it pass (ADV-2026-11-19-10 item 2).
   - (d) **The ceilings, split for the two briefs** (the custodian's split; the part's ceilings stand as Amendment 45 item 8 gives them):
     - the first worker: protocol 455, fixtures 390, and literal 190 in at most 22 files;
     - the second: kernel product 285, kernel tests 590, src-tauri 35 and records 10.

7. **`kernel/src/skp.rs`'s two clauses** (Amendment 45 item 3, its last point). Neither worker edits `skp.rs`. The architect's gate gives the words for the two untrue clauses of `OpenRegistry`'s doc. They are applied after the gates by script, comment lines only, and the reviewer reads the changed lines. This is the custodian's reading of ADV-2026-11-19-26 item 2's note on row 3; the advisor may rule another.

8. **Superseded index:**
   - Amendment 43 item 8 (a)'s files gain K-O27's one file (item 5 (a) here);
   - item 12's producers gain O3's variant (item 5 (b) here);
   - item 15's stops gain stop 12 (item 2 (f) here).
   - Nothing else is superseded.

Read the last amendment first.

Nothing above is edited.

## Amendment 50 — P3b-2's second worker at step 0: its two stops ruled (ADV-2026-11-19-32), the save's unit test's two places, the workspace a third exception, the helper on each identifier of `basis` and on `file_name`, one new test row; and the wire half's overrun (ADV-2026-11-19-31)

*Written by the custodian, 2026-11-19, from ADV-2026-11-19-31 and ADV-2026-11-19-32, on main before P3b-2's second worker resumes. References only. Nothing below is a quotation. Both rulings are filed under `state/directives/`; where this amendment's wording and a ruling's differ, the ruling stands.*

1. **The wire half.** The first worker handed back at 65c4739a3055cb0544b2048e70d1816ba4ae2543, its tests commits before its product commit and pushed with it. Two of its ceilings in Amendment 49 item 6 (d) were passed: protocol, and fixtures and protocol tests. By ADV-2026-11-19-31:
   - (a) the overrun stands as class 8, as counted, and the closing amendment records the counts in both numstat columns; nothing is cut or packed;
   - (b) the second worker's ceilings are unchanged;
   - (c) the reviewer's brief carries the ruling's item 3 question on the fixtures group, and anything outside it goes to the advisor before the merge request;
   - (d) the merge request gives the step's totals with these counts (the ruling's item 4).

2. **The second worker's two stops.** It stopped at step 0 with nothing written, on stop 3 and on stop 10. Its findings went to the advisor and both are ruled by ADV-2026-11-19-32. Its step-0 report is filed with the piece's records at the gates.

3. **Stop 3** (the ruling's item 1), class 9. In the unit test of the `tests` module of `kernel/src/project/mod.rs` that maps each save failure to its own code, the `MachineRecordRefused` case's expected code and the later assertion on its field change as the ruling's item 1 (a) gives them. Nothing else in that test changes. The worker names both places in its report. Any other failing assertion of that test, or any other existing test, is stop 3 again. The two assertions of `skp.project_file_refused` in `kernel/tests/project_save_skp.rs` stay as they are.

4. **Stop 10** (the ruling's items 2 to 8).
   - (a) `workspace` is a third named exception and crosses whole (item 3).
   - (b) In `view_state`, Amendment 45 item 2's helper is applied to the identifier of each space it names, the saved one and the admitted one, before the text of `basis` is built, and not to the whole text (item 4). The worker confirms from `space_of` that the admitted space's provenance and definition are a closed word and a hash; if they are not, it stops and that goes to the advisor.
   - (c) The helper is applied to the last name of `file_name` before the reply is built (item 5).
   - (d) One new test row in `kernel/tests/project_reopen_skp.rs`, named by the worker, with the two cases of the ruling's item 6. Its mutation is W-4's, predicted red in both cases with W-4's three. A case the reader refuses, or one that cannot be built, is a stop.
   - (e) The docs of `ReopenView` and `ReopenNotFound` in `protocol/skp/src/v0/commands.rs`, and the lines for `basis` and `file_name` in section 12 of `protocol/skp/SKP-V0.md`, each gain the bound, in the worker's words, class 9, read by both gates. Those two files join the second worker's files for these lines alone (item 7).
   - (f) Stop 10 reads as the ruling's item 8 gives it.

5. **Counts** (item 9). Items 3 and 4 here count in the section 2.11 group of each file, inside the ceilings as they stand. An overrun is reported as counted, and nothing is cut or packed.

6. **For P4's form** (item 10): how the shell shows and logs workspace text that a reopen read from a file. It joins P4's strings, with ADV-2026-11-19-30 item 5 and E-SECOND's polls.

7. **Superseded index:**
   - Amendment 45 item 2 (d)'s stop 10, by item 4 (f) here;
   - Amendment 45 item 2 (e)'s two exceptions gain `workspace`;
   - Amendment 45 item 5's allowed test edits gain item 3's two places;
   - Amendment 49 item 6 (b)'s files for the second worker gain the two protocol files, for item 4 (e)'s lines alone.
   - Nothing else is superseded.

Read the last amendment first.

Nothing above is edited.

## Amendment 51 — P3b-2's closing, before PR 340's merge request: the commits, the gates, the departures as ruled, the counts (class 8), the runs and the series at the head, CI, main since the merge base, what is not covered, and the notes to the advisor

*Written by the custodian, 2026-11-20, before PR 340's merge request. References and hashes only. Nothing below is a quotation.*

1. **The head and the commits.** H = 231b32cc388b293dc6030f5f92c8b044c85c663a on `cut/b2-piece-1c-p3b-2`, cut from 45ce89da31f9c0e01dd1194de4e77cc38e78317d (Amendment 49 item 1).
   - The wire half, by the worker on the standard model: d41e2f5e8e00f9b336af9f0880bafe88ad6d8550 and 64bede5cbdc2691476082f929caa0ecc4ac5df83, the tests; 65c4739a3055cb0544b2048e70d1816ba4ae2543, the code. Its report is `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3b-2-wire-worker-report.md`.
   - The kernel half, by worker-high on the strongest model: f00748214bf1df29d860dc05286e1812c60452c5, 42a39bce4f9d45808983f557eb6053030bdb52a9, fec9acab3c1b2e0da39d658d5e748032626130c1 and 11963f374aeb83f0936895e4ffb217906717fa30, the tests; e47bc484e3efb2fc899b3a92ab9acdb00efb5def, the code; 8759491f30b346ea9e3be06aebc9ed7b61f276f7, the two attribute lines. Its reports are `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3b-2-kernel-worker-stop-report.md` (Amendment 50) and `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3b-2-kernel-worker-report.md`.
   - W-7's split, by the worker on the standard model, a test change only (ADV-2026-11-19-34): 63950d3668ea618988b2faa6aebb3da1d4aca9c8. Its report is `state/consults/2026-11-19-b2-piece-1c-save-and-reopen-p3b-2-w-7-worker-report.md`.
   - Main taken in, records only: ddd74c349091832ada443e78ae867fa4ad79371b, whose second parent is 9537543aebb2f0d77e443beb43135a1bc0b6b36f.
   - The correction, by the worker on the standard model (ADV-2026-11-20-01 item 8; ADV-2026-11-20-02): c759c2cc12c1e2c3167b54ad70be44bd9f9cac77, the docs, comment lines only; then H, the test change. Its report is `state/consults/2026-11-20-b2-piece-1c-save-and-reopen-p3b-2-correction-worker-report.md`.

2. **The gates.**
   - Attempt 1, at ddd74c34, both FAIL: `state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p3b-2-gate-architect.md` and `state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p3b-2-gate-reviewer.md` (gate-log 798 and 799), ruled by ADV-2026-11-20-01 and ADV-2026-11-20-02. The reviewer's run for ADV-2026-11-19-35 item 2, (b1) and (b2) each seen to fail on Windows under W-4's mutation, is in its report; ADV-2026-11-19-31 item 3's question on the fixtures is answered there too.
   - Attempt 2, at H, both PASS WITH NOTES, no clause untrue: `state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p3b-2-gate-architect-2.md`, short (ADV-2026-11-20-01 item 1 (a)), and `state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p3b-2-gate-reviewer-2.md`, on the changed lines (item 1 (b)) (gate-log 800 and 801).

3. **The departures, as ruled.**
   - ADV-2026-11-19-33 item 2: the two extra tests commits fec9acab and 11963f37, class 1. Its item 2 (ii): at 42a39bce the compile failure had a second cause in the test itself, E0618 in W-7, so that commit's red is not W-7's evidence; W-7's evidence is its mutation at the head.
   - ADV-2026-11-19-33 item 3: the fix commit 8759491f, its two attribute lines class 9, a third commit class 1. ADV-2026-11-20-01 item 6: the two lines stay; both warnings are there at 65c4739a by the reviewer's line.
   - ADV-2026-11-19-33 item 4: the hold moved to the background, class 1.
   - ADV-2026-11-19-34 item 5 (a): run 44633818992, red at 8759491f on Ubuntu in W-7's case (b). Ubuntu's lookup did not answer not found for the recorded name of 278 bytes, and the engine refused the path as `engine.source`. Class 2: the row was predicted to pass on the three platforms. Windows and macOS passed.
   - ADV-2026-11-19-35 item 2: the W-7 worker's two departures, class 1.
   - ADV-2026-11-20-01 item 7: the W-7 worker's slip, a second copy of case (a) that its report did not name, class 1; the copy is deleted in H, a test change, class 9.
   - ADV-2026-11-20-02 item 1: the three kernel doc clauses corrected in c759c2cc, comment lines only, class 9.

4. **The counts, class 8** (ADV-2026-11-19-31 item 1; ADV-2026-11-19-33 item 1; ADV-2026-11-20-01 item 8). By section 2.11's command, both columns, over 9537543a...H: the merge base once ddd74c34 took main in. Over 45ce89da...H the groups are the same, and 644 more lines come only from main's records.

   | Group | As ruled | At 63950d36 (the PR body) | At H | Ceiling (Amendment 45 item 8) |
   |---|---|---|---|---|
   | protocol | 469, then 473 | 473 | 480 | 455 |
   | fixtures | 632 | 632 | 632 | 390 |
   | literal | 176, in 21 files | 176, in 21 files | 176, in 21 files | 190, in at most 22 files |
   | kernel product | 318 | 318 | 340 | 285 |
   | kernel tests | 693 | 727 | 716 | 590 |
   | src-tauri | 50 | 50 | 56 | 35 |
   | records | 6 | 6 | 6 | 10 |
   | **Total** | | 2,382, in 48 files | 2,406, in 49 files | 1,955 |

   - The changes after 63950d36 are the correction's, counted in their groups: kernel product 22 more, kernel tests 11 fewer (the deleted copy), src-tauri 6 more, protocol 7 more. The 49th file is `kernel/src/skp.rs`, Amendment 49 item 7's two clauses.
   - The lock files are unchanged over the range: the custodian's diff and the series' end state.

5. **Runs at H.**
   - CI: 12 runs, all success, read at 2026-11-20T02:04:06Z.
   - The series, the one series report of the PR (ADV-2026-11-16-06), by the tester on the standard model, in 33 shared holds from 2026-11-20T02:31:22Z to 04:06:57Z: `state/consults/2026-11-20-b2-piece-1c-save-and-reopen-p3b-2-series-tester-report.md`.
     - Both frontends' npm ci and builds; the shell's typecheck and tests, 120 files and 1542 tests passed.
     - The focused kernel targets of Amendment 43 item 16, spatial-skp and src-tauri: each rc 0.
     - The debug exe, sha256 9a51e3f342524c9de2795d92aec79f8bfed56c359d2204e875db03b41af93752; the measure exe, sha256 3ab5bcae733b59b60849e7d2488c5cfc3dd1ae3ec083e97e12bd7f60ea25b5b2.
     - E-FL 4 of 4 and recentre-crossing 6 of 6, verdicts only, no figure claimed.
     - 22 of 23 e2e suites rc 0. source-changed-post ended rc 3, with S5d INCONCLUSIVE and every other step PASS. It is the outcome that step names inconclusive and never a pass, as at PR B's base series and at the first look's series; the tester ran it once more, with the same lines. It is not counted as a pass.
     - E-SAVE, the project suite: all twelve steps PASS, the same as at P3b-1's head 4b8d6702 but for the two minted project identities.
     - The fixtures unchanged by cmp.
   - Clippy and fmt: the reviewer's attempt-1 runs, reused at attempt 2, as its report says (ADV-2026-11-18-24 item 5 (b)).
   - The mutations of Amendment 43 items 7 (b) and 8 (b): the workers' observed runs, as their reports give them, and the reviewer's attempt-1 runs, as its report gives them. None is run again at H: by the reviewer's attempt 2, the correction changes comment lines, the deleted copy and the escape alone, and the non-comment lines of the five other files are equal.

6. **Main since the merge base** (ADV-2026-11-14-21 item 6 (a)). The merge base with main is 9537543a. The six commits on main after it, to 1284d536c3a460c464fed3247f40b03d38ed15d4, change 14 paths, none of the PR's 49, so the branch takes nothing more from main.

7. **Not covered, at H:**
   - Amendment 36 item 9's two live opens; `PathNotUnicode`; a cancel after the engine's open (Amendment 43 item 13).
   - On CI's Linux, no test shows the cut of `file_name` (ADV-2026-11-19-34 item 5 (b)).
   - As seen in run 44633818992: a recorded path that the lookup refuses for a reason other than not found gets no `not_found` reply; the engine refuses it, and its message names the recorded path whole (ADV-2026-11-19-34 item 5 (c)).
   - The reviewer's N4 at PR 339's first gate, as Amendment 49 item 4 (a) names it.
   - `opened_of`'s four panic sites, as ADV-2026-11-20-01 item 5 names them. Its node is proposed in the next batch, not placed.
   - N-1 (ADV-2026-11-20-01 item 3): the exception covers the whole error as the host built it, code, message and fields. Stop 10 was not reached. P4's form bounds what the shell shows and logs.

8. **To the advisor, with the merge request:** attempt 2's architect note N-A, by reference to its report, unreworded. The architect does not count it untrue, and ties it to the gap that ADV-2026-11-20-01 item 9 carries for P5. The architect's N-B and the reviewer's N-a to N-c are notes.

9. **Carried.** For P4's form: ADV-2026-11-19-34 item 6, ADV-2026-11-20-01 item 3's bound and item 9's first point, Amendment 49 item 4 (b), and Amendment 50 item 6. For P5's words: ADV-2026-11-20-01 item 9's second point.

10. **Superseded index:** nothing is superseded.

Read the last amendment first.

Nothing above is edited.

## Amendment 52 — P3b-2's closing, continued: two records that Amendment 51 omits, the F4 row (class 2) and the named arm of `skp.unknown_dataset`

*Written by the custodian, 2026-11-20, before PR 340's merge request. References and hashes only. Nothing below is a quotation.*

1. **§3's F4 row, class 2** (Amendment 43 item 20, packet P-3). The row predicted a word that did not hold; the descriptor's words stand, as P-3 (i) rules. Amendment 42 item 8 recorded the difference at P3a-2, class 1. It is recorded here as class 2, by §5. The row is not edited.

2. **`skp.unknown_dataset` from the reopen's own check after its open** (Amendment 45 item 4, its second point). Its message keeps a clause that can be untrue there. At H it is named in a source comment in `kernel/src/project/mod.rs`, by ADV-2026-11-19-26 item 3's row 5, and it is not changed. The item's first point, the engine's clause on the caller's assertion at a reopen, is carried for P4's form beside Amendment 51 item 9.

3. **Superseded index:** nothing is superseded. Amendment 51 stands, with these two records added.

Read the last amendment first.

Nothing above is edited.

## Amendment 53 — P3b-2's closing, completed after PR 340's merge (ADV-2026-11-20-03): ADV-2026-11-19-33 items 5 and 6 recorded; N-A and three notes of the first attempts carried

*Written by the custodian, 2026-11-20, after PR 340's merge at a2354cbe340158e766a6f36a3130b41bca107f51. References and hashes only. Nothing below is a quotation.*

1. **The two records that Amendments 51 and 52 omit** (ADV-2026-11-20-03 item 4).
   - ADV-2026-11-19-33 item 5: the worker's fetch, departure (d), class 1. Later briefs say that a worker does not fetch, and that the push's own output shows the remote head.
   - ADV-2026-11-19-33 item 6: departure (e), the runs not repeated at 8759491f, accepted; the commit is two attribute lines in src-tauri. CI's Rust workspace run at that commit, 44633818992, was red on Ubuntu in W-7's case (b). It went to the advisor and is ruled by ADV-2026-11-19-34 (Amendment 51 item 3).

2. **Carried** (ADV-2026-11-20-03 items 1 to 3).
   - For P5's form: whether section 12 of the SKP spec gains one sentence on what the machine means there, or stays as it is (item 1), beside the second point of ADV-2026-11-20-01 item 9.
   - For the node proposed for `opened_of`'s panic sites (ADV-2026-11-20-01 item 5): the reviewer's first-attempt note on `opened_of`'s doc (item 2).
   - For P4's strings: the architect's first-attempt N-5, a format character in a bounded text (item 3 (a)).
   - For the next batch: the second point of the architect's first-attempt N-6, that nothing checks that `folder` is absolute, at a save or at a reopen; where it is recorded, or a node proposed, not placed (item 3 (b)).

3. **Superseded:** nothing. Item 2 here completes Amendment 51 item 9's carried list.

Read the last amendment first.

Nothing above is edited.

## Amendment 54 — the reopen's P4, the shell, declared before its code as two parts, P4a (the client, the reply's three members in the admission run, the workspace applied, the strings' places, E-REOPEN and E-CHANGED) and P4b (the second process, E-SECOND and E-CRASH-UNLOCK): basis, size and split, ceilings, the step's totals, the design, the lock after a close, tests, mutations, the suites, producers, the carried items, the strings' places, regions, stops, gates and records; files outside §2.11's and §4's lists (class 9)

*Drafted by the architect, read only, at main `2377a2a3c5baa0a7f77132705468b6f52b519128`, and appended by the custodian's script, with the changes of ADV-2026-11-20-04 item 4 made by the custodian before appending; the packet is ruled by that ruling's item 2. ADV-2026-11-20-05, which gives the places' words, completes P-11 by its item 1 and asks one more step-0 answer by its item 4; both are carried in below before appending. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is also the architect's recommendation, it says so. Rulings are cited by id and item; this form by section, amendment and item; code by path and symbol at that commit. Every figure is an estimate from what is known now, and shows its working.*

1. **Basis.**
   - P4 is the shell's part of ADV-2026-11-16-10 R1 (a). It is the client call that reaches the `open_project` binding (`frontends/shell/src-tauri/src/commands.rs`), the question and re-link UI, a second open after a close while the lock may still be held, and what the shell shows and logs of text read back from a project file.
   - It is full class, with both gates, for each part (ADV-2026-11-16-10 R1 (b); ADV-2026-11-16-06 item 2 (a): concurrency, security, seams, over 260 lines).
   - Its rules:
     - §2.8, §2.12 and §5;
     - Amendment 1 item 5 (V3, M1, M2);
     - Amendment 30 item 3 (O-9 to O-20);
     - Amendment 36 items 1 and 8;
     - Amendment 43 items 1, 9 (c), 12 and 20 (P-11);
     - Amendment 45 items 4 and 9;
     - R2 (a) to (d).
   - **Its wait** (ADV-2026-11-16-10 R1 (c)). By the continuity block of `state/CUT-STATE.md` at this main, PR B and the first-look node have merged. The worker confirms both at P4a's base. The regions are computed there by a real diff (item 14).
   - **Not P4's:** item 18.

2. **Size, from the code on main, and the split** (the architect's recommendation; packet P-1).
   - **The rates.**
     - `frontends/shell/src/project/saveProject.ts` is 113 non-blank lines, and its test is 125. The saver has one call, one picker, seven notices and one set of saved datasets.
     - `frontends/shell/e2e/project.mjs` (E-SAVE, twelve steps) is 500 lines.
     - `frontends/shell/e2e/lib.mjs` is 660 lines.
     - The reopen has three reply members, two re-calls (an answer, a re-link), a cancel rule, the workspace applied in four members, and about twenty owner places. That is about 1.5 times the saver's branches for `project/openProject.ts`.
   - **P4a, shell product, about 745 lines:**

     | File | Lines |
     |---|---|
     | `skp/types.ts` (the §12.2 types) | ~60 |
     | `skp/client.ts` (`openProject`) | ~15 |
     | `console/surfaceRegistry.ts` (the eighth class-A row, and its doc) | ~6 |
     | `project/openProject.ts`, new | ~140 |
     | `project/reopenNotices.ts`, new (the strings group) | ~80 |
     | `project/shownText.ts`, new (the bound of item 5 (j)) | ~25 |
     | `admission/admitDataset.ts` | ~15 |
     | `admission/AdmissionPanel.tsx` (the reopen arms of `runAdmitPath`, the question, the re-link prompt and the hooks) | ~150 |
     | `App.tsx` | ~110 |
     | `canvas/WorkingCanvas.tsx` (O-17) | ~35 |
     | `style/document.ts` (O-18) | ~60 |
     | `project/saveProject.ts` (O-11 and O-9) | ~20 |
     | O-19's places (`admission/AdmissionPanel.tsx`, `layout/actionRegistry.ts`, `layout/StudioLayout.tsx`) | ~20 |
     | `e2e-test-surface.ts` | ~8 |

   - **P4a, shell tests, about 625 lines:**

     | File | Lines |
     |---|---|
     | `skp/client.test.ts` | ~25 |
     | `project/openProject.test.ts`, new | ~170 |
     | `admission/AdmissionPanel.test.ts` | ~130 |
     | `project/reopenNotices.test.ts`, new (with the bound's cases) | ~80 |
     | the style reader's tests | ~50 |
     | the camera write's test | ~40 |
     | the workspace apply's tests | ~90 |
     | `project/saveProject.test.ts` | ~35 |
     | `console/surfaceCompleteness.test.ts` (its derived set) | ~5 |

   - **P4a, e2e, about 440 lines:** `e2e/reopen.mjs`, new, about 420, and `e2e/README.md`, about 20.
   - **P4b, e2e, about 385 lines:**
     - `e2e/lib.mjs`, about 90: a second launcher, added beside the existing ones, with no existing function edited;
     - `e2e/second-open.mjs`, new, about 280;
     - `e2e/README.md`, about 15.
   - **P4b, every other group:** 0.
   - **The split.**
     - P4a holds the whole reply in the shell, with its seam test E-REOPEN.
     - P4b holds the two-process harness and its two suites. It has no product code.
     - P4b is cut from main after P4a merges, because both edit `e2e/README.md`.
   - **P4a stays over 800 lines (about 1,810), for three reasons.**
     - (a) If the reply's three members landed apart, main would hold a reopen that dead-ends. A `question` or a `not_found` with no answer path is one case. An `opened` whose saved workspace is not applied is the other, and it drops saved state without a word (docs/01, no silent change).
     - (b) A client call without its UI has no product caller (R2 (d)). A seam lands with its end-to-end test from the real shape (the seam rule of the gate), so E-REOPEN lands with `openProject`.
     - (c) About 1,065 of its lines are tests and e2e. The product is about 745.
   - **P4b is apart** because its risk is the harness (item 6, packet P-8), not the product.

3. **Ceilings, in both numstat columns, by §2.11's groups** (ruled by ADV-2026-11-20-04 item 3). Neither §2.11 nor §7 is edited. An overrun is class 8 in the part's closing amendment. A worker that finds a ceiling too small finishes, reports the count and says so (ADV-2026-11-19-12 item 6).

   | Part | Group | Ceiling |
   |---|---|---|
   | P4a | shell product (the strings file within it, at most 90) | 820 |
   | P4a | shell tests | 690 |
   | P4a | e2e | 485 |
   | P4a | src-tauri, protocol, fixtures, literal, kernel, records | 0 |
   | P4b | e2e | 425 |
   | P4b | every other group | 0 |

   - **Totals:** P4a 1,995 lines in about 27 files; P4b 425 lines in 3 files.
   - The reviewer recounts with §2.11's command, its excludes set to this form's present path (`governance/forms/kernel/...`).

4. **The step's totals after P4.** The step's ceilings are not touched by this amendment. §2.11's ten rows for step 2 sum to 5,070, and its Total says 5,170; neither is edited, and closings compare against the Total (ADV-2026-11-20-04 item 3).

   | Group | Before P4 | P4a | P4b | After P4 | Step ceiling |
   |---|---|---|---|---|---|
   | kernel product | 1,885 | 0 | 0 | 1,885 (485 over) | 1,400 |
   | kernel tests | 3,571 | 0 | 0 | 3,571 (2,271 over) | 1,300 |
   | protocol | 485 | 0 | 0 | 485 (165 over) | 320 |
   | fixtures | 632 | 0 | 0 | 632 (372 over) | 260 |
   | literal | 176 | 0 | 0 | 176 (46 over) | 130 |
   | src-tauri | 87 | 0 | 0 | 87 | 100 |
   | shell product | 0 | ~745 | 0 | ~745 (~225 over) | 520 |
   | shell tests | 0 | ~625 | 0 | ~625 (~175 over) | 450 |
   | e2e | 0 | ~440 | ~385 | ~825 (~375 over) | 450 |
   | records | 14 | 0 | 0 | 14 | 140 |
   | **All groups** | **6,850** | **~1,810** | **~385** | **~9,045 (~3,875 over)** | **5,170** |

   - **The working for Before P4.**
     - Kernel product: 1,453 (Amendment 42 item 10), 92 (Amendment 48 item 3) and 340 (Amendment 51 item 4), so 1,885.
     - Kernel tests: 2,621, 234 and 716, so 3,571.
     - Protocol: 5 and 480, so 485.
     - Those three groups total 5,941.
     - Fixtures 632 and literal 176 are P3b-2's (Amendment 51 item 4). No earlier part touched `protocol/` beyond 5 lines (Amendment 43 item 4).
     - src-tauri: 31 and 56, so 87.
     - Records: 8 (P3a-2's ADR-036) and 6, so 14.
     - The shell groups are 0 by the closings read. P3b-2's shell lines are the literal's.
   - The reviewer gives every group, and the step's files against 75, by §2.11's command over the step's range at P4a's base.

5. **The design** (each point is the custodian's declaration; the recommendations are marked).
   - **(a) The client.**
     - `openProject(folder, cancelKey, answer, relink)` (a working name) goes in `frontends/shell/src/skp/client.ts`. It goes through `call`, with `open_project` as its command, which is the console's one capture site (`console/soleCaptureSite.test.ts`).
     - Its types go in `skp/types.ts` as §12.2 gives them. Each is a closed union:
       - the request `{skp, folder, cancel_key, answer, relink}`, with `answer` and `relink` always present;
       - the externally tagged reply `opened | question | not_found`;
       - `view`, `check` and the two lineage facts, with `refused`.
     - `console/surfaceRegistry.ts` gains `open_project` as its eighth class-A row. Its doc's count of seven moves to eight, and `console/surfaceCompleteness.test.ts`'s derived set changes with it, as that doc requires (class 9; I3 declared).
   - **(b) The run.**
     - The reopen is an admission run through `runAdmitPath` (`admission/AdmissionPanel.tsx`), with its own `admit`. That `admit` calls `openProject` and then `describe` (§2.8). So the liveness line, Cancel and the refusal UI are the existing ones.
     - `AdmissionOutcome` (`admission/admitDataset.ts`) gains `question` and `not_found`, and each ends the run (O-14).
     - The run's options for a reopen hold `answer` and `relink`.
     - The reopen-only member of the outcome is read by a new App handler beside `handleAdmitted` (O-15).
     - **A reopen never re-enters `admitDataset` or `open_dataset`.** A reopen refusal sets the form family to none, so no CRS or identity form opens: the claims are the project file's (item 5 (g)).
   - **(c) The question.**
     - `question` shows S8 with two choices, copy and same, and a third that ends the run.
     - A choice re-enters `runAdmitPath` with the answer and a fresh cancel key (O-14).
     - Nothing is held between the calls. That matches SKP-V0.md §12.3: two calls, no state between them.
   - **(d) Not found, and the re-link.**
     - `not_found` shows S11 with `file_name` through item 5 (j)'s bound, or S11's no-location variant when it is `null`.
     - Its choice opens the file picker (`binding_pick_file`, unchanged). A pick re-enters the run with `relink` and with the answer the run already gave, so an answered question is not asked again (the kernel's O5 path). A dismissed picker ends the run at the existing cancelled note.
     - The shell sends a `relink` only after a `not_found` (SKP-V0.md §12.3; Amendment 43 item 9 (c)).
   - **(e) Cancellation** (docs/01).
     - The reopen is cancellable through the existing Cancel, with its own key. It reports liveness, not progress. That is SKP-V0.md §12.3's contract, and the same as `open_dataset`'s. No progress claim is made.
     - **A `question` or a `not_found` that arrives after the user pressed Cancel for that key is dropped.** The run ends at the existing cancelled note, and no question or picker is shown. Nothing is held between calls, so nothing is lost. This is the architect's recommendation, against ADV-2026-11-20-01 item 9's first point.
     - An `opened` after a Cancel is a cancel the kernel did not see (SKP-V0.md §12.3). It is applied as any `opened` is, as the existing run applies a late admission. This is timing inside one round trip: named for the source comment, not covered (packet P-13).
   - **(f) The order at a same-window reopen** (ADV-2026-11-19-30 item 5; Amendment 49 item 4 (b), its second point; the architect's recommendation, packet P-2 (i)).
     - The order stays: the shell opens the new handle before it closes the old one (App's close effect over `selectClosable`).
     - A reopen of the project this window holds is refused as `skp.project_open_elsewhere`. The shell shows S9's own-window place when the refusal's `project` equals the identity this window holds. The shell keeps that identity from `SaveProjectResponse.project` and `opened.project`.
     - The window's open, and its unsaved edits, stay.
     - Under this order the shell cannot make two live opens of one project in one process (Amendment 36 item 9).
   - **(g) Refusals.**
     - Every reopen refusal shows in the existing refusal block, with the owner's place for its code (item 12), and no remediation form.
     - An engine refusal (`engine.*`) at a reopen also shows the owner's line R-ENG: the claims it names are the ones the project file recorded, not the user's.
     - `refusalGuidance` (`admission/formatRefusal.ts`) is not shown at a reopen for a code whose guidance names the user's own assertion. One case is `engine.crs_assertion_conflict`. The worker lists each such code at step 0.
     - This meets Amendment 45 item 4's first point and Amendment 52 item 2 (packet P-6).
     - `skp.unknown_dataset` from the reopen's own check keeps its named clause (Amendment 52 item 2). Its owner place states only that the reopen did not stand.
   - **(h) The workspace applied** (§2.8).
     - **O-16.** The filter and its clauses are set in the same synchronous turn as the admission, so the first look runs under the saved filter. App's first-look arms read `activeFilterRef.current`, and `handleAdmitted`'s reset writes it. They go through the existing reducer transitions (`workspace/viewTransitions.ts` is read only, unless I1).
     - **O-18.** The style is read back by a new reader in `style/document.ts`, the inverse of `toStyleDocument`. A Colour by match whose column the reopened data no longer offers is not applied. The rest applies, the fill takes its literal, and the O-18 place says that Colour by was not restored.
     - **O-17.** The camera write is a new optional member of `WorkingCanvasHandle`, beside `currentView` and the first look's `shownViewportBbox`. It goes through `fitToExtent`'s frame-origin path (ADR-010 rule 1: the centre is a dataset-space point at the boundary). It marks the one-shot fit done, and it does not report the viewport.
     - **V3.** It applies only when `view.state` is `applies`. Otherwise the fit runs, and S19 shows the owner's consequence, with `basis` behind it through item 5 (j)'s bound.
     - The saved view must come back through the camera write and `currentView` bit for bit (T-17; stop 7).
     - No view is reprojected (docs/01: CRS is a type).
   - **(i) The saver, told** (O-11). App tells `createProjectSaver`'s saver about the reopened dataset and its identity (`adopt`, a working name). The next save sends `folder: null` and opens no picker.
   - **(j) The bound on text from a file, in the shell** (Amendment 45 item 9's third point; ADV-2026-11-20-01 item 3; N-5; packet P-4, the architect's recommendation (i)).
     - It is one helper, `project/shownText.ts` (a working name). It replaces every control character (Unicode Cc), every Bidi_Control format character (U+061C, U+200E, U+200F, U+202A to U+202E, U+2066 to U+2069), U+2028 and U+2029 with U+FFFD. Then it cuts past 1,024 UTF-16 code units, on a code-point boundary, marked with the kernel's mark, a space and `[cut]`, so that a shown or logged text is at most 1,030 UTF-16 code units. The figure 1,024 rests on nothing measured, and the source comment says so (ADV-2026-11-20-04 item 2, P-4).
     - It applies, at a reopen, to each of these when it is shown or logged:
       - an engine refusal's message and fields, whole (ADV-2026-11-20-01 item 3);
       - every refusal's message and fields;
       - `file_name`;
       - `basis`;
       - the Colour by column named in O-18's place;
       - each other field of item 12 marked as a file's or a path.
     - The kernel's bound is left as it is.
     - The console row is not changed (packet P-14).
     - The doc of `formatRefusal`, which says nothing is truncated, gains the reopen's exception, in the worker's words, read by both gates.
   - **(k) The workspace's own text** (Amendment 50 item 6; ADV-2026-11-19-32 item 10; packet P-5, the architect's recommendation (i)).
     - The filter, the clauses and the style's text members apply whole, as the reader accepted them (ADV-2026-11-19-32 item 3: a cut value would not be the one saved). The next save writes them back unchanged.
     - When any of them holds a control or Bidi_Control character, the W-TEXT place names the member or members. The text in the filter panel is the saved text.
     - P4 adds no call that writes workspace text to the session log.
   - **(l) The session log** (Amendment 43 item 20, P-11).
     - The reopen's own refusal line is one `logSessionEvent` call, the code with the message through item 5 (j)'s bound, beside `admitDataset`'s `admission-refused` line. That line itself is not changed.
     - `binding_log_session_event` and `diagnostics/log.ts` are not changed. That region is the redaction node's (ADV-2026-11-19-35 item 1 (b)).
     - Every place the shell writes a reopen refusal's message, read at this main:
       - the refusal block (`RefusalBlock.tsx`, through `formatRefusal`);
       - the console's refusal on the class-A row (`console/recorder.ts` `resolveRefused`, the view model's `refusal`);
       - the reopen's log line;
       - the global handlers in `diagnostics/errorHandlers.ts`, for a failure that is not a typed refusal (the reopen rethrows those, as `admitDataset` does);
       - a later save's S4 (`notSavedNotice`, whole).
   - **(m) The Open project control** (O-19; packet P-11, the architect's recommendation): a control beside Open GeoParquet in `AdmissionPanel.tsx`, and a bar entry in `layout/actionRegistry.ts`, as the save has (S1, S22). As the save's entry has them (Amendment 12 item 1), the new id's dispatch, its availability and the one optional prop that reaches App's handler are in `layout/StudioLayout.tsx`. The registry's entry is appended last, so every other entry keeps its place (ADV-2026-11-20-05 item 1).
   - **(n) The folder picker** (packet P-10, the architect's recommendation): the existing `binding_pick_project_folder`, with its S2 title. P4 changes no src-tauri line.
   - **(o) Classes** (ADR-006). The reopen's writes are the kernel's, to the machine store and, after a copy, to the folder. The shell shows no undo for a reopen and records no step for it.

6. **The lock after a close (E-SECOND)** (Amendment 47 item 10; Amendment 49 item 4 (b), its first point; the architect's recommendation).
   - **The product does not poll.** A refused reopen shows S9 and ends its run, with no liveness and no Cancel left. The user tries again.
   - S9's words promise no time, because the lock can be held after the other window's close replies. `close_dataset` hands the release to a thread of its own, and if that thread cannot start, the lock is freed only by a later close or reopen in that process (`close_dataset`'s doc).
   - **E-SECOND polls.** After app A has closed the project's open:
     - app B calls the reopen through its hook every 250 ms, for at most 40 tries (10 s);
     - each refused try must show S9's other-window place and end its run;
     - the first `opened` ends the poll;
     - the suite reports the tries and the elapsed time as evidence. They are not a measurement claim (docs/08).
   - **At the bound** the suite fails by name, with the last code. It also gives whether app A's log (`e2e/out/` of A's launch) holds the release thread's line: `close_dataset` writes that to standard error, which the launcher's log receives.
   - **Why 10 s.** The release waits only on the `saved` mutex, and the suite has no save in flight. A pass well inside the bound is expected, and nothing rests on the figure.

7. **P4a.**
   - **Where it is built:** branch `cut/b2-piece-1c-p4a`, worktree `C:/dev/wt/1c-p4a`, build folder `D:/wt-targets/1c-p4a`, and test data folder `D:/wt-data/1c-p4a`. It is cut from main after this amendment and the advisor's ruling.
   - **(a) Files.**
     - Shell product: item 2's list, in `frontends/shell/src/`. `skp/types.ts`, `skp/client.ts`, `console/surfaceRegistry.ts`, `admission/admitDataset.ts`, `canvas/WorkingCanvas.tsx`, `style/document.ts`, `project/saveProject.ts`, `layout/actionRegistry.ts`, `layout/StudioLayout.tsx` (ADV-2026-11-20-05 item 1) and `e2e-test-surface.ts` join §2.11's list (class 9). So do the new files `project/reopenNotices.ts` and `project/shownText.ts`.
     - Shell tests: item 2's list, and one declared edit of an existing test (I3): the pinned list of ids in `layout/actionRegistry.test.ts` gains the new id in its sorted place, and nothing else of that test changes (ADV-2026-11-20-05 item 1). The three rows of item 2 that name no file (the style reader's, the camera write's and the workspace apply's tests) are named by the worker at step 0, each beside the product file it tests, and the closing lists them. A test file anywhere else is stop 1 (ADV-2026-11-20-04 item 4 (c)).
     - E2e: `e2e/reopen.mjs`, new; `e2e/README.md`, its entry.
     - The DEV-only hooks, registered only in an instrumented build, as `e2eSaveProjectToFolder` is:
       - the reopen folder's slot, `e2eOpenProjectFolder`;
       - the re-link file's slot;
       - a read of the applied workspace: filter text, clauses, style state, and `currentView`.
       Each supplies the picker's answer once, or reads. Each runs the same product code as a click. A DEV hook that E-REOPEN needs beyond these three is reported at step 0 and comes to the advisor before it is written (ADV-2026-11-20-04 item 4 (h)).
   - **(b) Tests and mutations.** The round-25 rule applies: apply the mutation, run the named test, record its failure by name with the commit, and revert. A `verify-mutation` run is not called an observation. Each test fails at its base by a missing symbol unless the row says otherwise.

     | Id | Test | Asserts | Mutation, and what it must turn red |
     |---|---|---|---|
     | T-1 | `openProject sends the eighth command through the one capture site` | the request's members, `answer` and `relink` null; the console records it as `open_project` | `invoke` called directly: red at the recorder |
     | T-2 | `reopen goes through runAdmitPath and shows liveness and Cancel` (§4) | the run's states; Cancel reaches the run's key | `admit` bypassed: red |
     | T-3 | `question re-calls with the answer` (§4) | S8's place; each choice re-calls with its answer and a fresh key; the third ends the run | the answer dropped: red at the second request |
     | T-4 | `not_found offers the re-link and the second call carries relink and the run's answer` (Amendment 43 item 9 (c)) | the first call's `relink` null; after `not_found` and a pick, `relink` and the earlier answer are sent; a dismissed pick ends at the cancelled note | (a) the answer dropped on the re-link call: red; (b) `relink` sent on the first call: red |
     | T-5 | `a question or not_found after Cancel asks nothing and ends at the cancelled note` | both cases end at the cancelled note; no S8, no S11, no picker | the cancel ignored: red at S8 |
     | T-6 | `the changed-file notice names each component` (§4) | S10 lists each of `check.observed` and `check.admission`, apart; S12 after a re-link | the components joined into one word: red |
     | T-7 | `a view saved in another space is not applied and the owner says so` (Amendment 1 item 5, V3) | no camera write; the fit runs; S19 with `basis` bounded | the view applied regardless: red |
     | T-8 | `the saved filter and clauses apply in the admission's turn, so the first look runs under them` (O-16) | the first query's filter is the saved one | the filter applied in a later effect: red at the first query |
     | T-9 | `the style document reads back; a Colour by whose column is gone keeps the rest and says so` (O-18) | the state is member for member; O-18's place names the column, bounded | the reader drops the match's cases: red |
     | T-10 | `a save after a reopen sends folder null and opens no picker` (O-11) | the request's `folder` null; no picker | `adopt` not called: red at the picker |
     | T-11 | `a reopen refusal opens no remediation form, and an engine refusal carries the owner's line` (Amendment 45 item 4) | form family none for `engine.crs_unknown` and an identity code; R-ENG's place; no user-assertion guidance | `formFamilyForCode` applied at a reopen: red |
     | T-12 | `text from a file is shown and logged through the bound` (N-5; ADV-2026-11-20-01 item 3) | for U+202E, U+0007 and a 2,000-unit path: the refusal block, each notice and the log line hold no Cc or Bidi_Control character and at most the bound and the mark | the helper returns its input: red |
     | T-13 | `workspace text with a control or format character applies whole and the owner names the member` (Amendment 50 item 6) | the filter text equals the file's; W-TEXT names `filter`; a save writes it back unchanged | the text passed through the helper: red at the round trip |
     | T-14 | `each lineage fact maps to its place and no rule text is shown` (Amendment 36 item 8; Amendment 34 item 9) | P-7's table; a refused fact shows its reason word and line alone | every fact mapped to S16: red |
     | T-15 | `surfaceCompleteness`'s derived set (edited, class 9) | `open_project` is a class-A row | the row removed: red (fails at its base by assertion) |
     | T-16 | `a through-link save shows its notice` (O-9) | O-9's place for `project_relative: through-link` | the notice removed: red (fails at its base by assertion) |
     | T-17 | `the camera write applies the saved view through the frame origin and marks the fit done` (O-17) | `currentView` after the write equals the saved centre and zoom bit for bit; no auto-fit after it; no viewport report | the origin not subtracted: red |
     | T-18 | `a refusal of the project this window holds shows the own-window place` (item 5 (f)) | S9's own-window place when the `project` field matches; the other-window place otherwise; the window's open kept | the identity not compared: red |

8. **P4b.**
   - **Where it is built:** branch `cut/b2-piece-1c-p4b`, worktree `C:/dev/wt/1c-p4b`, build folder `D:/wt-targets/1c-p4b`, and test data folder `D:/wt-data/1c-p4b`. It is cut from main after P4a merges.
   - **(a) Files:** `e2e/lib.mjs` (class 9; a new launcher, with no existing function edited); `e2e/second-open.mjs`, new; `e2e/README.md`, its entry.
   - **(b) Step 0, a probe, before any suite code** (packet P-8). Two app processes run at once with one machine store, each with its own CDP port. That needs:
     - a WebView2 data folder for each;
     - a second process that does not start a second dev server on 5180;
     - and, because the debug binary carries the overlay's CDP port (`writeConfigOverlay`'s doc), a launch whose port is not that one.
     The worker reports what works, with nothing committed. A failure is stop 9.
   - **(c) The rows:**

     | Id | Suite step | Asserts | Mutation, and what it must turn red |
     |---|---|---|---|
     | E-SECOND | A saves P; B reopens P; A switches to another file; B polls (item 6) | B's first try: `skp.project_open_elsewhere` and S9's other-window place, the run ended; then `opened` within the bound | `close_dataset`'s release not started (by Bash, uncommitted): red at the bound |
     | E-CRASH-UNLOCK | A reopens P; A's process tree killed; B reopens P | `opened`, within item 6's bound | none in the product: the kill replaced by a graceful stop and A's open kept (the suite's own control): red |

9. **The e2e suites** (the human's directive of 2026-11-16, item 2: the app window, on the laptop).
   - **Port.** Vite's 5180 (ruled 2026-11-09, by the continuity block). App A uses CDP 9223 (`lib.mjs`'s `CDP_PORT`). App B, in P4b, uses the port step 0 settles.
   - **Data folder.** Each suite sets `LOCALAPPDATA` to a fresh scratch store before its launch, as `e2e/project.mjs` does, and removes it at the end. Its folders are made under the OS temp folder, and the series sets that to the part's test data folder (item 7, item 8). No two workers share one (the same directive, item 2).
   - **E-REOPEN** (`e2e/reopen.mjs`; one app process; F1 in folder P with a project-relative locator; F1 in folder P2 with data outside it, machine-recorded only):
     - R1, open F1 in P;
     - R2, a filter with two clauses (one disabled), a fill colour, a camera move;
     - R3, save through the hook;
     - R4, the same-window reopen: S9's own-window place, the run ended, the open kept;
     - R5, open another file; the first handle's close is seen on the console before R6;
     - R6, reopen P: `opened`; the applied workspace equals the file's on disk, member for member; the console shows `open_project` with `answer` and `relink` null;
     - R7, a save right after: no picker slot used; the file's workspace is unchanged;
     - R8, P copied by hand to Q; reopen Q: S8; the page's same choice clicked: `opened`; the store's `folders.json` lists both;
     - R9, P2 saved, its data moved; reopen P2: S11 with the file's last name; the re-link slot: `opened`.
     - R5 and R6 each read a row of the Console, whose ring drops its oldest entry at 256 (ADV-2026-11-19-06, A4-1). The suite reads each row right after its call, and the worker reports the ring's fill at each read. A row that can be dropped before its read is stop 13 (ADV-2026-11-20-04 item 4 (d)).
   - **E-CHANGED** (same file): F4, which is F1 with its mtime moved 60 s later (§3's F4 row as Amendment 52 item 1 corrects its word). The reopen gives `opened`, and S10 names `mtime` alone.
   - **E-SECOND, E-CRASH-UNLOCK:** item 8 (c).
   - **The runs.** Focused while building. The full suites run once per part, on its final candidate.
     - At P4a, every e2e suite runs, since §5 declares their outcomes unchanged and P4a changes `App.tsx`, `AdmissionPanel.tsx` and `WorkingCanvas.tsx`.
     - At P4b, the reviewer confirms by diff that no existing function of `lib.mjs` changed. If so, the series is E-SAVE, E-REOPEN, E-CHANGED, E-SECOND and E-CRASH-UNLOCK. Otherwise every suite runs.
     - One series report per PR (ADV-2026-11-16-06).

10. **Producers and their consumers** (R2).

    | Producer | Consumer | Seam's end-to-end test |
    |---|---|---|
    | the `open_project` binding (P3b-2) | `openProject`, through the reopen's `admit`, from the Open project control | E-REOPEN R6 to R9 (P4a) |
    | `check_inside` and `Projects::open_project` (Amendment 36 item 8) | the binding | E-REOPEN R6 |
    | the lineage reader's two facts (Amendment 36 item 8) | T-14's mapping | T-14 |
    | the camera write member, the style reader, the saver's `adopt` and the bound helper (P4a) | App's reopen handler and the reopen's places | T-17, T-9, T-10, T-12; E-REOPEN R6 and R7 |
    | `Projects::release_ended` in the shipped `close_dataset` (P3b-1) | another process's reopen | E-SECOND (P4b) |
    | `ProjectLock` (Amendment 36 item 8) | a reopen after a kill | E-CRASH-UNLOCK (P4b) |

    - The DEV hooks are test surface, registered only in an instrumented build, as `e2eSaveProjectToFolder` is.
    - Every other exported item is a gate finding (R2 (d)).
    - All of these are named in each PR body and in the node's plan summary.
    - The node is not done until each seam's test has passed on main (R2 (c)).

11. **The carried items, each met.**
    - Amendment 34 item 9 (Damaged's rule text): T-14. No rule text crosses (`lineage_refusal_of`).
    - Amendment 38 items 7 and 13 (the first save's `open.lock: ` detail): item 12, row S4-LOCK.
    - Amendment 43 item 1: items 7 and 8. Item 9 (c): T-4. Item 12: item 10. Item 20 (P-11): item 5 (l).
    - Amendment 45 item 4, its first point: item 5 (g), T-11 and packet P-6. Item 9: item 12, item 5 (j) and packet P-4.
    - Amendment 47 item 10: item 6.
    - Amendment 49 item 4 (b): item 6 and item 5 (f) (packet P-2).
    - Amendment 50 item 6: item 5 (k), T-13 and packet P-5.
    - Amendment 51 item 7, by line:
      - the two live opens: unreachable from the shell under item 5 (f), still not covered in the kernel;
      - `PathNotUnicode`: the shell sends UTF-8 strings alone;
      - a cancel after the engine's open: item 5 (e), not covered;
      - on CI's Linux, the cut of `file_name`: not covered, since the app-window suites run on Windows alone;
      - a recorded path refused other than as not found: packet P-3;
      - the N4 close: the shell cannot close a handle it has not received;
      - `opened_of`'s panic sites: S-PANIC's words claim no free lock (item 12);
      - N-1: item 5 (j).
    - Amendment 51 item 9: ADV-2026-11-19-34 item 6, in packet P-3 and item 5 (j); ADV-2026-11-20-01 item 3's bound, in item 5 (j); its item 9's first point, in item 5 (e) and T-5; Amendment 49 item 4 (b) and Amendment 50 item 6, as above.
    - Amendment 52 item 2: item 5 (g).
    - Amendment 53 item 2 (N-5): item 5 (j) and T-12.
    - The rulings: ADV-2026-11-19-30 item 5, item 5 (f); ADV-2026-11-19-32 items 3 and 10, item 5 (k); ADV-2026-11-19-35 item 1, items 5 (l) and 14; ADV-2026-11-20-03 item 3 (a), item 5 (j); ADV-2026-11-19-10 item 2, item 16; ADV-2026-11-19-12 item 6, item 3; ADV-2026-11-18-02 item 2, item 16; ADV-2026-11-16-10 R1 (b) and (c), items 1 and 14.

12. **The strings' places.** Each is an owner placeholder in `project/reopenNotices.ts`, unless the row says otherwise. Shown text carries the shell's `[P6 placeholder] ` marking. No words are drafted here. The advisor's words come in one strings ruling before P4a's code. The worker copies them byte for byte from the filed ruling, and no test asserts a place's words.

    | Id | Place | Shows | Bound |
    |---|---|---|---|
    | O-19a | Open project control, `AdmissionPanel.tsx` | idle, and opening | fixed |
    | O-19b | the bar's word, `layout/actionRegistry.ts` (as S22) | — | fixed; typed after the slash |
    | S2 (kept) | the folder picker's title, `binding_pick_project_folder` | — | fixed; serves the save and the reopen (packet P-10) |
    | S8 | the question and its three choices | `question {kind: copy-or-same}` | fixed; no file text |
    | S9-own | refusal block | `skp.project_open_elsewhere`, the project this window holds | fixed; no time promise |
    | S9-other | refusal block | the same code, another holder; `project` | the identity (validated by the reader); no time promise (item 6) |
    | S10 | notice | `check` non-empty after a reopen without a re-link; `{components}` | closed words, listed apart |
    | S11, S11-none | notice and its choice | `not_found`; `{file_name}`, or `null` | the kernel's 262 bytes, then item 5 (j) |
    | S12 | notice | `check` non-empty after a re-link; `{components}` | closed words |
    | S16, S17 | notices | the lineage facts, by packet P-7 | closed words and a line number |
    | S19 | notice | `view` `saved-in-another-space`; `basis` behind it | the kernel's bound per identifier, then item 5 (j) |
    | S20 | refusal block | `skp.project_known_folders_full`; `project`, `count` | identity and integer |
    | S21 | refusal block | `skp.project_machine_record_refused`; `file`, `rule` | a fixed name; `rule` the kernel's 262 bytes, then item 5 (j) |
    | R-ENG | beside an `engine.*` refusal at a reopen | the engine's message and fields | item 5 (j); the message can name a path at any length (ADV-2026-11-19-34 item 6) |
    | R-CODE | one owner line per other reopen code where the consequence differs; else none | `project_file_unreadable` (OS text), `project_file_refused` (bounded `path`, `rule`), `project_machine_store_failed` (a fixed name and OS text, or the binding's fixed text), `project_target_unresolvable` (the `folder` as sent: a path, any length; or `locator` and a bounded `segment`; or no field), `project_target_through_link`, `project_target_wrong_kind`, `project_file_unwritable` (a copy's replace; its text may name the folder), `cancel_key_in_use` (the client's key), `skp.unknown_dataset` (item 5 (g)) | item 5 (j) on each message and field |
    | S-PANIC | refusal block | `skp.open_project_panicked`; the join error's text | item 5 (j); claims no free lock (ADV-2026-11-20-01 item 5) |
    | W-TEXT | notice | a workspace member holding a control or Bidi_Control character | names the member alone; shows none of its text |
    | O-18 | notice | Colour by not restored; the column | the file's text, through item 5 (j) |
    | O-9 | save notice, `saveProject.ts` | `project_relative: through-link` | fixed |
    | S4-LOCK (no place of its own; ADV-2026-11-20-05 item 5) | S4's `{message}` at a first save, `project_file_unwritable` with `open.lock: ` (Amendment 38 item 7) | the OS error, or the fixed held text | whole, as S4 is; or a place of its own if the advisor gives one |
    | CUT | the mark of item 5 (j)'s cut | — | the kernel's, a space and `[cut]`, ruled with P-4 (ADV-2026-11-20-04 item 2) |
    | (kept) | the cancelled note | a Cancel, a late `question` or `not_found`, a dismissed re-link pick | the existing text |

    - Each place states the owner's consequence and repeats no engine or kernel fact. Engine messages state engine facts; owners state consequences.
    - S8's behaviour is the human's ruling (round 70, OPEN-2), and §2.12 marks S8 as the human's words. Its words wait for the human at P6, and until then it carries a placeholder (packet P-9). The placeholder's words are the advisor's, from the strings ruling (ADV-2026-11-20-04 item 4 (f)).

13. **Not covered, by name, with the reason.**
    - A cancel after the engine's open: the reply is `opened`, and it is applied. This is timing inside one round trip, named for the source comment.
    - A reopen whose request reaches the host before the previous handle's close: S9 shows. This is timing inside one round trip, named for the source comment.
    - The release thread failing to start: the operating system must refuse a thread. Item 6 names it at the bound.
    - The app-window suites on macOS and Linux: they run on Windows alone.
    - The console row shows a reopen refusal whole, its format characters included (packet P-14 (i)).
    - Amendment 36 item 9 in the kernel; two users' stores (P5).
    - An existing call of `logSessionEvent` that logs a later refusal's message or fields, where that refusal can repeat a saved filter's text. The shell's source holds more than thirty such calls outside its tests, and none of their messages is read here. The redaction node's form says whether the binding replaces control characters in every message it appends (ADV-2026-11-20-04 items 4 (b) and 6).

14. **Regions.**
    - P4 touches no path under `protocol/`, `kernel/`, `engine/` or `frontends/shell/src-tauri/` (I7).
    - P4 does not touch `binding_log_session_event` or `diagnostics/log.ts`. That is the redaction node's region, and that node goes after P4a's merge (ADV-2026-11-19-35 item 1, as ADV-2026-11-20-04 item 6 reads it).
    - P4a and P4b run in sequence (item 2).
    - `WorkingCanvas.tsx`'s handle holds the first look's `shownViewportBbox`. P4a's member goes beside it, as a region computed by a real diff at P4a's base.
    - Rule (00) at each dispatch holds over the pieces in progress and those awaiting merge, the e2e README's suite entries counted as paths of their own.
    - Each part takes main in before its gate (ADV-2026-11-16-06 item 4).
    - The reviewer recomputes each file list with git.

15. **Stops.** The worker stops and reports, alone, when any of these happens:
    1. A file or region outside item 7 (a) or 8 (a) is needed.
    2. Any line under `protocol/`, `kernel/`, `engine/` or `frontends/shell/src-tauri/` is needed.
    3. An existing test needs an edit other than T-15's set and the pinned list of item 7 (a) (I3), or a dependency or a lock file changes (I6). Any other existing test that the bar's entry turns red is this stop (ADV-2026-11-20-05 item 1).
    4. A declared test passes at its base (other than T-15 and T-16, which fail there by assertion), or a mutation does not turn its test red.
    5. A reopen path reaches `admitDataset`, `open_dataset` or a remediation form.
    6. A text of item 5 (j)'s list is shown or logged without the bound.
    7. The saved view does not come back bit for bit through the camera write (T-17). The worker reports the difference.
    8. A lineage fact's meaning, read at step 0 in `read_lineage` and in the save's `LineageNotKept` condition, differs from packet P-7's table. Step 0 also answers whether a later save is refused for every reopen whose project file records a lineage, the case of no history file in the folder and none on this machine included; the answer comes to the advisor before a lineage place is wired (ADV-2026-11-20-05 item 4).
    9. P4b's step 0 fails (packet P-8).
    10. E-SECOND or E-CRASH-UNLOCK does not pass three runs in a row within item 6's bound.
    11. Code is begun before the advisor's ruling on this packet, or a place's words are written before the strings ruling.
    12. A product export has no product caller (R2 (d)).
    13. A Console row that E-REOPEN reads can be dropped before its read (item 9).

16. **Class, gates, pushing, lints and the model.**
    - **Class.** Full class, both gates, for each part (item 1).
    - **Pushing** (ADV-2026-11-19-10 item 2).
      - The tests' commit is its own commit, before the code.
      - It is pushed together with the code commit that makes it pass.
      - Its failure before code is shown by the worker's local run: the exit code and the failing names, at the tests' commit.
      - A stop still pushes (item 3 of the same ruling).
      - A test correction found once the code runs is committed after the product commit, and says so (ADV-2026-11-19-33 item 2 (v)).
      - A worker does not fetch, and the push's own output shows the remote head (ADV-2026-11-19-33 item 5).
    - **Lints.** The reviewer runs them at the gated head, in a hold, on the changed package, `frontends/shell`. It runs `npm ci` there and in `renderer/bundle-viewer`, then `npm run verify` whole, since the shell has no lint script of its own (as ADV-2026-11-16-15 ruled for the S1 form, followed here). No Rust package changes, so no Rust lint applies. A worker does not silence a lint on code it did not write (ADV-2026-11-19-33 item 3).
    - **The worker's model** (ADV-2026-11-20-04 item 4 (e)): P4a in three briefs on one branch, in sequence, since E-REOPEN and E-CHANGED cannot run before the run, the question and the re-link exist. First the standard worker, for the types, the client, the registry row, the style reader, the camera member and the notices' places. Then worker-high on the strongest model, its grounds security, for text read from a file, and concurrency, for cancellation and the lock's order: `openProject`'s run, `runAdmitPath`'s reopen arms, the bound, the refusal routing and App's handler. Then the standard worker again, for the DEV hooks, E-REOPEN and E-CHANGED. In each brief the tests are committed before their code and pushed with it. P4b goes to the standard worker.

17. **Records.**
    - Each part's closing amendment holds references and hashes only, with the counts in both columns and a class 8 row for each overrun.
    - The PR body and the node's plan summary name item 10's producers and consumers, and item 12's places under P6, the advisor's words named as the advisor's.

18. **What P4 leaves to P5, by name.**
    - KNOWN-LIMITATIONS K-2, K-3 and K-4 (§2.12; Amendment 16 item 2), and item 62 (ADV-2026-11-19-21 item 2).
    - ADV-2026-11-20-01 item 9's second point, two users' stores.
    - ADV-2026-11-20-03 item 1, section 12's sentence on the machine.
    - Whether a limitation item names a reopen whose data inside its folder has gone missing, refused as `skp.project_target_unresolvable` with no re-link offered (ADV-2026-11-20-04 item 2, P-3).
    - Whether a limitation item says that the Console shows a refusal's text as it came, format characters included (ADV-2026-11-20-04 item 2, P-14).
    - §9's operator Part, P0 and OP1 to OP6, as §9 orders it after the step's code.
    - Not P5's: the redaction node, after P4a's merge, beside P4b if rule (00) at its dispatch finds no shared path, the e2e README's entries counted (ADV-2026-11-19-35 item 1, as ADV-2026-11-20-04 item 6 reads it). P4 declares no src-tauri path. Its form carries the doc of `binding_pick_project_folder` (packet P-10) and the control characters of item 13's last line. Not P5's but after P4: The `opened_of` node (ADV-2026-11-20-01 item 5). The `folder` check (Amendment 53 item 2).

19. **Superseded index.**
    - §2.11's step-2 shell list gains item 7 (a)'s files, and its e2e list gains `e2e/reopen.mjs`, `e2e/second-open.mjs` and `e2e/lib.mjs` (class 9).
    - §4's step-2 tables gain T-1 to T-18 and E-REOPEN's steps (class 9).
    - §4's E-SECOND row, two app processes: contingent on packet P-8.
    - §2.12 gains item 12's places O-19a, O-19b, S9-own, S9-other, S11-none, R-ENG, R-CODE, S-PANIC, W-TEXT, S4-LOCK and CUT.
    - Nothing else is superseded.

Read the last amendment first.

Nothing above is edited.

## Amendment 55 — P4a's stop 8 at its first brief's step 0, closed by ADV-2026-11-20-06: the lineage facts' places that T-14 maps, replacing packet P-7's table (class 5)

1. **The table** (ADV-2026-11-20-06 item 1). It replaces packet P-7's table, which ADV-2026-11-20-04 item 2 had ruled.
   - S17 shows exactly when the project file records a lineage: `folder_file` is `recorded` or `recorded-with-lines-after`, or `previous_file` is not `null`.
   - S16 shows once, before S17, when either file is `not-the-recorded-one`.
   - S17's refused line shows before S17, once for each refused file (ADV-2026-11-20-05 item 3).
   - No place shows for `absent` with `null`, or for `not-read` with `null`.
   - So `used`, and `absent` with `absent`, take S17, where P-7 gave them none.
2. **T-14** asserts this table, with a case for each line of item 1, `used` and `absent` with `absent` among them. Its mutation stays. The shell maps by the rule, and adds no case for a pair the kernel does not send (ADV-2026-11-20-06 item 3).
3. **Records.**
   - Stop 8 at P4a's first brief is closed by that ruling (its item 4). For every later brief, Amendment 54 item 15's stop 8 reads against item 1's table.
   - The first brief resumed at its step 1, with no lineage fact mapped to a place. T-14 is the second brief's.
   - The first brief's hand-back is filed with P4a's records.
   - S17's words stand as ADV-2026-11-20-05 rules them (ADV-2026-11-20-06 item 2).
4. **Superseded:** packet P-7's table, wherever Amendment 54 refers to it: item 7 (b)'s T-14 row, item 12's S16 and S17 row, and item 15's stop 8. Nothing else.

Read the last amendment first.

Nothing above is edited.

## Amendment 56 — P4a's first brief at its head: stop 3 closed by one more declared test edit, the strings file and the camera tests' file recorded (ADV-2026-11-20-07); three files join item 7 (a)'s list before their code (ADV-2026-11-20-08) (class 9)

1. **The loop's edit (I3, class 9), by ADV-2026-11-20-07 item 1.** In the test of `project/saveProject.test.ts` that saves with each `project_relative` judgment, the loop's list loses `through-link` and keeps `carried` and `outside`. Nothing else of that test changes: its name, its message and its other assertions stay. T-16 asserts the whole list for `through-link`: `SAVED_NOTICE`, then O-9's place, and nothing after. The second brief makes the edit in its tests' commit, before O-9's code. The reviewer confirms by diff that the loop's change is that one word, and that T-16 fails at the tests' commit. Item 7 (a)'s declared edits of existing tests are now three: T-15's, the pinned list's and this one.
2. **The strings file (class 8), by ADV-2026-11-20-07 item 2.** `project/reopenNotices.ts` is 120 lines at the first brief's head, against item 3's 90. Nothing was cut to fit. The shell product group's ceiling of 820 is what the part is held to. The closing records it.
3. **The camera write's tests (class 1), by ADV-2026-11-20-07 item 3.** They are added to `canvas/WorkingCanvas.wiring.test.tsx`, an existing file beside the product file, not the file the first brief's step 0 named. The closing lists it.
4. **Three files join item 7 (a)'s list (class 9), by ADV-2026-11-20-08,** declared here before any of their code. Each counts in the shell product group.
   - `admission/formatRefusal.ts`: its doc alone, for item 5 (j)'s exception. No code line changes.
   - `admission/RefusalBlock.tsx`: an optional prop that withholds the guidance and, if the worker shows the owner's place inside the block, an optional prop for that. With neither given, the block renders as it does on main.
   - `console/ConsolePanel.tsx`: the same optional prop, passed on a row whose command is `open_project`, and nothing else. If it takes more than that, the worker leaves the file, names the case as not covered, and it goes to the advisor.
   - No other caller of the block changes. The reviewer confirms by diff that each renders as before.
   - The existing tests of these files stay unedited (stop 3). New tests may be added to `admission/RefusalBlock.test.tsx` and `admission/formatRefusal.test.ts`, each beside its product file.
   - The guidance is withheld only for item 5 (g)'s codes, those whose guidance names the user's own assertion, as the second brief's step 0 lists them. Every other code keeps its guidance at a reopen. T-11 asserts both sides, and gains the case of the Console's `open_project` row.
   - The doc's new words are the worker's, read by both gates.
5. **For both gates, by ADV-2026-11-20-07 item 4.** The camera member goes through `fitToExtent` unreported, and the box it shows reaches `onViewShown` once. Both gates read this against item 5 (h) and T-17's row. A clause of this form that is untrue of the code as built goes to the advisor unreworded, as does one about the three files' changes.
6. **Records.** The first brief's two hand-backs are filed with P4a's records (Amendment 55 item 3).

Read the last amendment first.

Nothing above is edited.

## Amendment 57 — P4a's second brief's stop 11 at step 0, closed by ADV-2026-11-20-09: a saved style the shell cannot show gets a place of its own, O-18's words are replaced, and the R-CODE clause on a copy's failed write is corrected (classes 5 and 3)

1. **W-STYLE, by ADV-2026-11-20-09 item 1.** A reopen whose saved style `readStyleDocument` answers with none is not refused. The saved style is not applied, the default style is shown, and a new owner place, W-STYLE, says so. It shows no text of the file, and it shows for every style the reader answers with none, a `match` on `fill_opacity`, `outline_color` or `outline_width` among them. The filter, the clauses and the view apply as for any reopen. Item 12's places gain W-STYLE, beside O-18, with no slot.
2. **The words, by ADV-2026-11-20-09 item 2.** W-STYLE's words and O-18's are the two lines of that ruling's fence. O-18's line replaces its line of ADV-2026-11-20-05 item 2, and nothing else of that ruling changes. Both are copied by script, as the others were: W-STYLE's is added to `project/reopenNotices.ts`, and O-18's text there is replaced by script. Never a typed word. They count in the strings file, and an overrun is class 8.
3. **T-9's case, by ADV-2026-11-20-09 item 3.** T-9 gains a case. A style with a `match` on one of the three properties is not applied, the state is the default, and W-STYLE's place shows. Its mutation: when the reader answers with none, the apply keeps the style the window held and shows no place. It must turn red at the state and at W-STYLE's place. No test asserts the words.
4. **The R-CODE clause, corrected (class 3), by ADV-2026-11-20-09 item 4.** In item 12's R-CODE row, the clause on `project_file_unwritable` now reads: a copy's replace; its text is a fixed phrase and the operating system's error, or the rename's count and its last error. R-CODE's words and the bound are unchanged.
5. **Step 0's other answers, by ADV-2026-11-20-09 item 5.**
   - The workspace apply's tests are in `App.reopen.test.tsx`, a new file beside `App.tsx`, inside ADV-2026-11-20-04 item 4 (c).
   - Item 5 (g)'s guidance is withheld for `engine.crs_assertion_conflict` alone.
   - `ProjectUri`'s length is fixed by the reader's grammar.
   - The first brief left two doc defects in `console/surfaceRegistry.ts`: a doc line became a lone `&`, and the table's class-A line still says seven commands. The resumed second brief fixes both. The gates read them, and the closing names them, class 1.
6. **Records.** Items 1 to 4 are declared here before their code. The second brief resumes at its step 1, and its first hand-back, the stop, is filed with P4a's records.

Read the last amendment first.

Nothing above is edited.

## Amendment 58 — ADV-2026-11-20-10 on P4a's second brief at 7cb3d90b: its class 8 count stands, the set in the refusal block is inside ADV-2026-11-20-08, and Amendment 56 item 4's line on the block's callers is corrected (classes 8, 1 and 3)

1. **The count, by ADV-2026-11-20-10 item 1.** At the second brief's head, the shell product is 773 lines against 820. The shell tests are 825 against 690, and the strings file 122 against 90. Both excesses are class 8 at the count. No ceiling is raised, and nothing was cut to fit. The closing records both at the final count, with their cause.
2. **The set, by ADV-2026-11-20-10 item 2.** The module-private set in `admission/RefusalBlock.tsx` keeps item 5 (g)'s codes once, for both places that pass the prop. It holds `engine.crs_assertion_conflict` alone, as Amendment 57 item 5 says. It is inside ADV-2026-11-20-08 item 1, and the gates read it.
3. **Amendment 56 item 4's line, corrected (class 3), by ADV-2026-11-20-10 item 3.** Its line on the block's other callers now reads: no caller of the block changes but the reopen's own place in `admission/AdmissionPanel.tsx` and the Console's row; a dataset open's refusal in `admission/AdmissionPanel.tsx` renders as before. The reviewer confirms both by diff. This replaces that one line, and nothing else of Amendment 56 item 4 or of ADV-2026-11-20-08 changes.
4. **The build beyond the brief, by ADV-2026-11-20-10 item 4.** The second brief's worker ran one `npm run build` beyond its steps, for the notice tests, in a shared hold of its own. It changed no tracked file. It is a class 1 departure, and the closing names it with its reason.
5. **For the gates, by ADV-2026-11-20-10 item 5.** The gates read three points. First, a file whose saved filter and clauses disagree is applied by its clauses. Second, the run's set of cancelled keys is never cleared. Third, the P-base at the tests' commit did not load the first brief's T-6 file. On the first: if the form says nothing of such a file, or says something untrue of the code as built, it goes to the advisor unreworded.
6. **Records.** The second brief's two hand-backs are filed with P4a's records. The third brief runs on the standard worker as Amendment 54 item 16 gives it.

Read the last amendment first.

Nothing above is edited.

## Amendment 59 — ADV-2026-11-20-11 on P4a's third brief at its step 0: the suites run on the port-5400 harness, item 9's port line is corrected, and `frontends/shell/package.json` joins P4a's files for one line (classes 3 and 9)

1. **The port, by ADV-2026-11-20-11 items 1 to 3.** Port 5180 is not free, and no word of the human's that it is free is filed. P4a's suites and its series therefore run on the port-5400 harness. That follows the human's approval of 2026-10-11 item 1 and their message of 2026-11-09 (OPEN-5), and the approval's own terms apply:
   - scratch folders and the part's own build folder only;
   - no tracked file changed for the harness, and nothing of it committed;
   - each report saying port-5400 harness.

   Nothing is revived, and no exception is granted.
2. **Amendment 54 item 9's port line, corrected (class 3), by ADV-2026-11-20-11 item 4.** The first line below, as it stood, is replaced by the second. Both are copied by script from the ruling's fence.

````
- **Port.** Vite's 5180 (ruled 2026-11-09, by the continuity block). App A uses CDP 9223 (`lib.mjs`'s `CDP_PORT`). App B, in P4b, uses the port step 0 settles.
- **Port.** The port-5400 harness, under the human's approval of 2026-10-11 item 1 and its terms: by their message of 2026-11-09 (OPEN-5) it continues until their word that 5180 is free and a passing listen test on it. The suites' own default stays 5180, which the harness maps. App A uses CDP 9223 (`lib.mjs`'s `CDP_PORT`). App B, in P4b, uses the port step 0 settles.
````

   At P4b's step 0, item 8 (b)'s line on a second dev server on 5180 is read with the corrected line: under the harness, the dev server is the harness's, on 5400.
3. **`frontends/shell/package.json` joins P4a's files (class 9, the e2e group), by ADV-2026-11-20-11 item 5.** This is declared here before its line.
   - The one added line is the `e2e:reopen` script, running `node e2e/reopen.mjs`, after the `e2e:colour` line, as that ruling gives it. Nothing else in the file changes.
   - The README names the suite by it, as it names the others.
   - The reviewer confirms by diff that the file's change is that one added line, and that both lockfiles are unchanged.
   - P4b's suite gets its line the same way, the `e2e:second-open` script running `node e2e/second-open.mjs`, declared here before P4b's code. Rule (00) counts the file.
4. **The product group, for the closing, by ADV-2026-11-20-11 item 6.** At the hooks' commit the shell product group is 838 lines against 820. That is class 8 at the count, with nothing cut.
5. **Records.** The third brief's two hand-backs so far are filed with P4a's records: its stop at step 0, and the hooks. It resumes at its step 2 on the harness.

Read the last amendment first.

Nothing above is edited.

## Amendment 60 — ADV-2026-11-20-12 on P4a's third brief, stop 7 at E-REOPEN R6: the first look's reset undid the saved view, so the write moves after the first look's call in `App.tsx`, O-17 gains a sentence, and a unit case holds the order (classes 5 and 8)

1. **The cause, by ADV-2026-11-20-12 item 1.** At da94ae0b, the `[admitted]` effect of `App.tsx` writes the saved view, and the write marks the one-shot fit done (O-17). Then comes the first look's call, `reissueUnrestricted`. Inside it, before its first await, the call resets the fit for its generation. The first data then fits the camera. So R6 fails in runs w-r1 and w-r2, which stay on record.
2. **The fix, by ADV-2026-11-20-12 items 2 and 3.**
   - In `App.tsx` alone, the saved view is written after the first look's call has started, in the same turn of the effect. A comment says why.
   - The worker places the write so that the order holds in both branches of the effect. It says what it found in the branch that builds no candidate session.
   - No other product file changes. If the fix needs one, it goes to the advisor before it is written.
   - What must hold: in an open whose saved view applies, the write comes after the last reset of the fit that the first look's call makes. No reset of the fit follows the write before that look's data is drawn.
3. **O-17's new sentence (class 5), by ADV-2026-11-20-12 item 5.** It is placed after O-17's last sentence, copied by script from the ruling's fence:

````
In an open, the write comes after the first look's call has reset the fit for its generation and before any of that look's data is drawn, and nothing resets the one-shot fit between the write and that data. So the first look's data does not move the camera of a reopen whose saved view applies.
````

4. **The tests, by ADV-2026-11-20-12 item 4.**
   - R6, as written.
   - A new unit case in `App.reopen.test.tsx`. The canvas stand-in records its `resetFitForNewGeneration` and `applyView` calls in one list, in order. The case reopens with a view that applies, and asserts one write and no reset after it.
   - Its mutation moves the write back to before the first look's call. It must turn red by name.
   - The case fails at its own commit, before the fix.
   - If the file cannot see the order as the app runs it, that goes to the advisor. No weaker assertion takes its place.
   - T-17 stays as it is.
5. **The commits and the model, by ADV-2026-11-20-12 items 6 and 7.**
   - The suite's commit and the unit case's commit come before the fix's commit, and the three are pushed together.
   - The fix and the unit case go to worker-high on the strongest model, on the ground of concurrency. The rest of the third brief stays with the standard worker.
   - The product group is class 8 at the count, with nothing cut.
6. **What goes to the advisor, by ADV-2026-11-20-12 item 8:**
   - a camera moved by anything else after the write, the frame's establishment on the first data among it;
   - a saved view that returns but not bit for bit, with the difference;
   - a clause of item 3's sentence that is untrue of the code as built, unreworded.
7. **Records.** Stop 13 did not fire. The worker moved R5's read to before the first look, and discloses that for the gates. The third brief's hand-back at stop 7 is filed with P4a's records.

Read the last amendment first.

Nothing above is edited.

## Amendment 61 — ADV-2026-11-20-13 on P4a at 20895dfb: Amendment 60 item 3's sentence for O-17 replaced, and E-REOPEN's R8 row corrected (class 3)

1. **The fix, by ADV-2026-11-20-13 item 1.** At 20895dfb the write follows the first look's call in each branch of the `[admitted]` effect, in the same turn. The unit case asserts one write, a reset before it and none after it, through the real session.
2. **O-17's sentence (class 3), by ADV-2026-11-20-13 item 2.** In the baseline arm the first look's call makes no reset of the fit, so a clause of Amendment 60 item 3's sentence was untrue there. That sentence is replaced. Below are the old sentence and then the new one, copied by script from the ruling's fence. The new one is O-17's. It replaces the fence of ADV-2026-11-20-12 item 5, and nothing else of that ruling.

````
In an open, the write comes after the first look's call has reset the fit for its generation and before any of that look's data is drawn, and nothing resets the one-shot fit between the write and that data. So the first look's data does not move the camera of a reopen whose saved view applies.
In an open, the write comes right after the first look's call, in the same turn of the effect: after any reset of the fit that call makes, and before any of that look's data can be drawn. The candidate arm's call makes one such reset; the baseline arm's makes none, and its write takes the same place. The open makes no reset of the fit after the write, so the first look's data does not move the camera of a reopen whose saved view applies. A later generation's reset, a filter's Apply among them, fits the camera as after any open.
````

3. **E-REOPEN's R8 (class 3), by ADV-2026-11-20-13 item 3.**
   - In run f-r1, R8's answer `same` met the lock that this window's open of P still held. The refusal came before the store's write. That is the product as ruled, so no product line changes.
   - R8 now first opens another file and sees the close of P's handle on the console, as R5 does. Then it copies P and reopens Q. Its read of that row falls under stop 13, as R5's does.
   - The standard worker makes the correction, in a commit after the product commit. It changes R8 and nothing else of the suite.
   - Amendment 54 item 9's R8 row is corrected. Below are the old row and then the new one, copied by script from the ruling's fence:

````
- R8, P copied by hand to Q; reopen Q: S8; the page's same choice clicked: `opened`; the store's `folders.json` lists both;
- R8, open another file, and the close of P's handle is seen on the console, as at R5; then P copied by hand to Q; reopen Q: S8; the page's same choice clicked: `opened`; the store's `folders.json` lists both;
````

   - The refused run stays on record. If its record shows which place the page showed at that refusal, the closing says so. A place other than S9's own-window one goes to the advisor. No step is added to assert it.
4. **The counts, by ADV-2026-11-20-13 item 4.** At 20895dfb the shell product group is 846 against 820 and its tests 847 against 690. Both are class 8, with nothing cut. The `holdUntiled` switch in the test file's stand-in is test only, for the gates.
5. **Records.** The fix's hand-back is filed with P4a's records.

Read the last amendment first.

Nothing above is edited.

## Amendment 62 — ADV-2026-11-20-14 on P4a's third brief, stop 13 at E-REOPEN R9 in run w-r3: the suite's late read of the close row, and its count in a ring that drops its oldest (class 3)

1. **Run w-r3, at e35693f2.** That commit is R8's correction by Amendment 61 item 3, made alone after the product commit and not yet pushed. R1 to R8 passed. R9 waited 30 s for the close row of P2's data handle and failed, which is stop 13. E-CHANGED was not reached.
2. **The late read, by ADV-2026-11-20-14 item 1 (class 3).**
   - In R9 and E-CHANGED, the suite read the close row after the first look had filled the ring. Amendment 54 item 9's line says the suite reads each row right after its call.
   - Their read moves into the open's after-call hook, as at R5 and R8. It is a defect of the suite, not of the product.
   - No row of item 9 changes.
3. **The count, by ADV-2026-11-20-14 item 2.**
   - The helper that waits for a close row compared a count of close rows at ok against the count read before the open. A row counted before the open can be dropped from the ring between the two reads. Then the new row does not raise the count, and the wait fails as a stop 13 that is not one.
   - So the new row is known by its request, not by a count. It is a close row at ok whose request text was not among the close rows read before the open. Each close names its own handle.
   - It is one change in the helper, and in where the steps take the earlier reading, and it serves all four reads. The worker may choose an equal means, if it rests on no older row staying in the ring. The hand-back says what was done.
   - A row that is truly dropped before a read made right after its call is still stop 13. It goes to the advisor with the ring's fill.
4. **The run, by ADV-2026-11-20-14 item 3.** The standard worker makes both changes in one test commit after R8's, then runs the suite once as w-r4. If the e2e group goes past 485, it is class 8 at the count, with nothing cut. R8's commit and this one are pushed with the rest of the third brief.
5. **The closing, by ADV-2026-11-20-14 item 4.** It names no place for f-r1's refused R8, because that run's record holds none.
6. **Records.** The third brief's hand-back at R9 is filed with P4a's records, with its hold lines masked.

Read the last amendment first.

Nothing above is edited.

## Amendment 63 — P4a's closing at 51fed8a5, before PR 341's merge: both gates at c60327e8 closed on their words by ADV-2026-11-20-15 with no re-gate; the series; the class 1, 5 and 8 rows

*Written by the custodian, 2026-11-20, at PR 341's head 51fed8a55340c554eb03aa126e4472de49032533. References and hashes only. Nothing below is a quotation.*

1. **The gates, at c60327e87c8990f8fdb430fcf9b734eb1393a46e,** both on the strongest model (ADV-2026-11-18-02 item 2).
   - The architect: FAIL on the words of one doc sentence only (section 31). Its report is state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p4a-gate-architect.md, sha256 37ff364d7cebe8dbeab10b3b793bff853acf1f4711da64537970024dbd76f2a4.
   - The reviewer: PASS WITH NOTES. Its report is state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p4a-gate-reviewer.md, sha256 d5d2ef2adca0d715c84dd7d7d22e8188fa8e2fc0965fed538492301fef491860.
   - Both close the code's correctness and its evidence.

2. **The words, as ADV-2026-11-20-15 rules them,** filed as state/directives/2026-11-20-advisor-ruling-adv-2026-11-20-15-p4as-gate-words-the-architects-f-1-and-d-1-the-reviewers-d3-to-d5-no-gate-re-runs.md (the PASTES file's sha256 18fce855e7eefb5393dd4c2c7f56501d6c2550018e04f7967dd4d3a0bf006f0d).
   - They were applied in one commit, 51fed8a55340c554eb03aa126e4472de49032533, by the standard worker: state/consults/2026-11-20-b2-piece-1c-save-and-reopen-p4a-words-worker-report.md. Its parent is c60327e8. It changes 4 files, 18 lines in and 16 out. Each file is byte-equal to the custodian's file, built by script from the gated head and the reports' words.
   - F-1, the architect's words, whole, for the exception paragraph of formatRefusal.ts (item 1). The reviewer's D2 is not applied, and F-1 closes it.
   - D-1, the architect's words: App.tsx's two cites by symbol name (item 2).
   - D3, the reviewer's words: the comment above the baseline arm's first look in App.tsx (item 3).
   - D4, the reviewer's words: the header of the reopen suite (item 4).
   - D5, the reviewer's two replacements in the e2e README's line (item 5).
   - No gate re-runs (item 11), under the human's message of 2026-11-13 on a gate closed on wording. The architect's only blocking findings were wording. The head differs from c60327e8 in the four files and the ruled lines alone. This amendment records the closing.

3. **Class 1, D6** (item 6). E-REOPEN's R8 reads its row for the answer same by a poll. The poll starts right after the click and ends at a harness bound of 60 s. Amendment 54 item 9 is not edited. If that poll fails, it goes to the advisor with the ring's label, as a stop 13 does.

4. **Class 5, Amendment 58 item 5's first point** (item 8). The kernel refuses a project file whose filter is not what its enabled clauses combine to. So the arm of handleReopened that applies a saved filter when the file holds no clauses is not reached from a file the kernel admits. It stays as built, a guard, with no node.

5. **Class 5, under Amendment 54 item 13** (item 9, the architect's N-3). A reopen of a project that a running export of this window still holds shows S9's other place. Ordinary use reaches it while the export runs. No test covers it. Whether that place's advice fits this case, or a limitation item says it, is carried for P5's words, by the advisor.

6. **Class 8, D1** (item 7).
   - Step 2 as a whole, by the reviewer's count at P4a's work head daac1b62, before main was taken in. By PR: 331 gives 682, 332 gives 754, 333 gives 244, 334 gives 198, 337 gives 2,209, 339 gives 357, 340 gives 2,406 and P4a gives 2,177. That is 9,027 lines against the step's Total of 5,170, and 86 distinct files against 75.
   - P4a's groups at the final head, counted as the reviewer counted, by the form's section 2.11 command with the form's path excluded, from c60327e8's second parent ffd451b7513defe87dd1402081389ca75a1a425a to 51fed8a5. The shell product 866 lines (820 in, 46 out) against 820; its strings file 122 against 90; the shell tests 847 (842 in, 5 out) against 690; e2e 484 against 485, within; every other group 0. P4a's total is 2,197 lines in 31 files.
   - The words add 20 lines and no file, so the step stands at 9,047 lines and 86 files at 51fed8a5.
   - Nothing is cut. Each later part's closing restates the step's figures.

7. **Runs at 51fed8a5.**
   - CI: 6 runs, all success, read at 2026-11-20T12:33:41Z. The PR holds no Rust file, so no Rust workflow runs and no clippy run is owed (ADV-2026-11-18-24 item 5 (b)).
   - The series, the one series report of the PR (ADV-2026-11-16-06), by the tester on the standard model, on the port-5400 harness, in 30 shared holds from 2026-11-20T12:43:14Z to 2026-11-20T14:20:51Z: state/consults/2026-11-20-b2-piece-1c-save-and-reopen-p4a-series-tester-report.md.
     - Both frontends' npm ci and builds; the shell's typecheck and tests, 123 files and 1570 tests passed.
     - The debug exe, sha256 bd5d4fe67a050b137af890404aebf51f36ec5bb2666959e1557f448480b05b73; the measure exe, sha256 0721278f92893150b3175ddbdf60cd145af71e2a9ea69c517511a7c1e3c32900.
     - E-FL 4 of 4 and recentre-crossing 6 of 6, verdicts only, no figure claimed.
     - 23 of 24 e2e suites rc 0, by their logs. E-REOPEN's ten rows, R1 to R9 and E-CHANGED, PASS, R8's row for the answer same among them.
     - source-changed-post ended rc 3, with S5d INCONCLUSIVE and every other step PASS. It is the outcome that step names inconclusive and never a pass, as at PR B's base series, the first look's series and P3b-2's. The tester did not run it again. It is not counted as a pass.
     - E-SAVE, the project suite: all twelve steps PASS, the same as at P3b-2's head 231b32cc but for the two minted project identities.
     - The fixtures unchanged by cmp; the four lock files unchanged.
   - This project's hold lines in the machine log on 2026-11-20, read at 2026-11-20T14:27:55Z: 104 holds, no two overlapping (ADV-2026-11-16-08 item 4).

8. **Main since the merge base** (ADV-2026-11-14-21 item 6 (a)). The merge base with main is ffd451b7513defe87dd1402081389ca75a1a425a. The 5 commits on main after it, to d61d09529c29813d9d5fbd0f083a4c22b43339b1, change 21 paths, none of the PR's 31. This amendment's commit adds records and the form alone. So the branch takes nothing more from main, and main is not merged into it (ADV-2026-11-20-15 item 11 (b)).

9. **To the advisor, with the merge request, unreworded** (ADV-2026-11-19-06 items 5 and 6). The series report's Result line gives the reopen suite's rows as eleven; by the log they are ten. Its count of runs, 24, names the suites alone; with the two measure-exe runs they are 26. The report is filed as written. Its S5d line is a byte-exact prefix of the log's line, which goes on with its evidence field.

10. **Carried** (item 10).
    - The handle left open when describe fails after opened, so that the project's lock stays held: to the daily batch, with a node proposed.
    - The architect's N-7, a stale cite in a publish test that this part's edit made stale: to the docs lane.

11. **Departures.**
    - The words worker once tried a foreground sleep. The harness refused it, and nothing ran.
    - The custodian's words brief, as sent, held one blank line more than its file; no word differed.
    - The custodian's series brief named the measure exe's place on D: but its command set no build folder, as P3b-2's brief did not. The exe was built in the worktree's own ignored target on C:, 2,972 MB, and the tester copied it to the place named, equal by sha256. That target goes with the worktree after the merge (ADV-2026-11-14-09 and -11).

12. **Superseded:** nothing.

Read the last amendment first.

Nothing above is edited.

## Amendment 64 — PR 341 merged; ADV-2026-11-20-16: the test files Amendment 54 item 7 (a) has the closing list (class 1)

*Written by the custodian, 2026-11-20, after PR 341's merge. References and hashes only. Nothing below is a quotation.*

1. **The merge.** PR 341 was merged by the advisor by merge commit 1c45b0ef98b25cde952630ed729a625d32574c48, at 2026-11-20T15:01:41Z, at its checked head 51fed8a5, on its verdict MERGE: state/consults/merge-checks/PR-341-51fed8a55340.md. Main's CI at the merge commit: 4 runs, all success, read at 2026-11-20T15:14:19Z.

2. **The test files named at step 0, class 1** (ADV-2026-11-20-16 item 3; Amendment 54 item 7 (a)). The worker named three, each beside the product file it tests, so none is outside the list: style/document.test.ts, the style reader's; canvas/WorkingCanvas.wiring.test.tsx, the camera write's, as Amendment 56 item 3 also records; App.reopen.test.tsx, the workspace apply's. Amendment 54 item 2's table names admission/AdmissionPanel.test.ts, which the PR does not change. The admission run's cases are in App.reopen.test.tsx: by their names, T-2 to T-5, T-11, T-12 and T-18 are there at the merge commit.

3. **ADV-2026-11-20-16,** filed as state/directives/2026-11-20-advisor-ruling-adv-2026-11-20-16-pr-341s-result-line-stays-as-filed-and-the-test-files-the-closing-owes.md. The series report's Result line stays as filed, and Amendment 63 item 9 is its record (class 3). source-changed-post is not counted as a pass and did not hold the merge. Amendment 63 item 11's departures stand.

4. **Superseded:** nothing.

Read the last amendment first.

Nothing above is edited.

## Amendment 65 — P4b's files before its code: its suite's scripts line (ADV-2026-11-20-11 item 5), the port and the step 0 stop (class 9)

*Written by the custodian, 2026-11-20, after P4a's merge (Amendment 64) and before P4b's code. References and hashes only. Nothing below is a quotation.*

1. **Where P4b is built,** as Amendment 54 item 8 gives it: the branch cut/b2-piece-1c-p4b, the worktree C:/dev/wt/1c-p4b, the build folder D:/wt-targets/1c-p4b and the test data folder D:/wt-data/1c-p4b. It is cut from main at the commit that holds this amendment.

2. **Its files, class 9, the e2e group** (ADV-2026-11-20-11 item 5). Amendment 54 item 8 (a)'s three: e2e/lib.mjs, a new launcher with no existing function edited; e2e/second-open.mjs, new; e2e/README.md, its entry. And frontends/shell/package.json, for one added line and nothing else: the script e2e:second-open, whose command is node e2e/second-open.mjs, after the e2e:reopen line. It is not a dependency, and the lockfile does not change; the reviewer confirms both by diff. Rule (00) counts the file. The ceiling stays Amendment 54 item 3's, the e2e group 425 and every other group 0, now over four files.

3. **The port** is Amendment 54 item 9's line as Amendment 59 corrects it: the port-5400 harness, under the human's approval of 2026-10-11 and its terms, until their word that 5180 is free and a passing listen test on it. Item 8 (b)'s second dev server is read as ADV-2026-11-20-11 item 4 reads it: under the harness the dev server is the harness's, on 5400.

4. **Step 0 and the model.** The standard worker (Amendment 54 item 16). Step 0, the probe of item 8 (b), comes before any suite code, with nothing committed. A failure is stop 9 (item 15), and the custodian sends it to the advisor.

5. **Rule (00) at P4b's dispatch.** No pull request is open, and no node in progress declares any of the four paths. The redaction node, which goes beside P4b (ADV-2026-11-20-04 item 6), declares paths under frontends/shell/src-tauri/ alone in its draft of 2026-10-23, with no e2e README entry; the architect's re-read against main confirms its list before its code.

6. **Superseded:** nothing.

Read the last amendment first.

Nothing above is edited.

## Amendment 66 — P4b's step 0: stop 9 reached and closed by ADV-2026-11-20-18, as ADV-2026-11-20-19 reads it after the human's word that 5180 is free (class 5); item 6's line on the release thread (class 3); the port

*Written by the custodian, 2026-11-20, after P4b's step 0 and before its suite code. References and hashes only. Nothing below is a quotation.*

1. **Step 0.** The standard worker probed item 8 (b) at main 897e7bd9, on the port-5400 harness, with nothing committed; its hand-back is filed as state/consults/2026-11-20-b2-piece-1c-save-and-reopen-p4b-step-0-worker-report.md. Two app processes ran at once with one machine store, B with a WebView2 data folder of its own and no second dev server. B's reopen of the project A held was refused as skp.project_open_elsewhere with S9's other-window place, and admitted after A opened another file. Item 8 (b)'s third need, a launch whose port is not the overlay's, was not met: a port set for B through the WebView2 browser-arguments variable is ignored, and B answered on the IPv6 loopback at the overlay's port while A held that port on 127.0.0.1.

2. **Stop 9 reached, and its close (class 5).** ADV-2026-11-20-18 item 1 closes stop 9 by route (i), with its four conditions (a) to (d); item 8 (b) is not corrected. The port that step 0 settles, in item 9, is the overlay's port on the IPv6 loopback. B is always started while A is up (ADV-2026-11-20-18 item 2). Route (ii) is not taken. If (i) does not hold at the probe of item 4 below or at stop 10, it comes to the advisor with both routes open, a second exe and the measure exe, in no fixed order (ADV-2026-11-20-19 item 5).

3. **The port.** The human's word that 5180 is free came at 2026-11-20T16:43:57Z, and the custodian's listen test on 5180 passed at 2026-11-20T16:45:16Z, both filed as state/directives/2026-11-20-the-humans-message-5180-is-free-the-listen-test-passed-e2e-runs-on-5180-the-port-5400-harness-ended.md. By the human's rule of 2026-11-09 (OPEN-5), from that test on P4b's e2e runs use 5180 through the suites' own launch, and the port-5400 harness of Amendment 65 item 3, with its approval of 2026-10-11, ended. Step 0 ran on the harness before the word. Item 8 (b)'s dev server is now the suites' own, started by A's launch (ADV-2026-11-20-19 item 4).

4. **The probe again, before any suite code** (ADV-2026-11-20-19 items 3 and 4), under the suites' own launch, with nothing committed: conditions (a) and (b) of ADV-2026-11-20-18 item 1; and (c), after A is killed as E-CRASH-UNLOCK kills it, whether 5180 still answers and whether B's reopen still runs to opened. A failure of any is a stop, and the custodian sends it to the advisor.

5. **Item 6's line (class 3)** (ADV-2026-11-20-18 item 5, its first half as ADV-2026-11-20-19 item 6 keeps it). close_dataset writes its line to standard error only when the release thread does not start. At the bound the suite says whether that line is in A's log, names the log it read, and says so when it could read none; it never reports the line absent from a log it did not read. Under the suites' own launch A's log is e2e/out/app.log, the launcher's, as item 6 says.

6. **The model, the files and the ceiling** are unchanged: the standard worker; Amendment 65 item 2's four files; the e2e group's 425.

7. **Superseded:** nothing. Amendment 65 item 3 ran to its own end condition.

Read the last amendment first.

Nothing above is edited.

## Amendment 67 — P4b's closing at 26d76ebc, before its PR: both gates at 0c74eeab closed on their words by ADV-2026-11-20-23 with no re-gate; the series; the class 1, 2, 3 and 8 rows

*Written by the custodian, 2026-11-20, at the branch's head 26d76ebc5aa927beaf26ca98827b8727b3152314, on cut/b2-piece-1c-p4b. References and hashes only. Nothing below is a quotation.*

1. **The gates, at 0c74eeab7e0c100a5a193e5109e272025ca43bb6.**
   - The architect, on the strongest model, ground architecture and concurrency: PASS WITH NOTES, nothing blocking. Its report is state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p4b-gate-architect.md, sha256 1e60e233c724050474bd9a0e4039fe192b7f712495771232a349604334f651d0.
   - The reviewer, on the standard model: FAIL on one sentence of wording only, its E-1, with no code finding. Its report is state/consults/gates/2026-11-20-b2-piece-1c-save-and-reopen-p4b-gate-reviewer.md, sha256 1d58a9255d87fbc9089a66ea35032c5a38ce814e20851f175c3950f12c37c22e.
   - The reviewer made E-SECOND's mutation again at 0c74eeab, and its report gives the line as printed: red at the bound, the log named, 0 bytes read, the log empty, and that the suite cannot tell (ADV-2026-11-20-21 item 1 (d)).

2. **The words, as ADV-2026-11-20-23 rules them,** filed as state/directives/2026-11-20-advisor-ruling-adv-2026-11-20-23-p4bs-gate-words-five-replacements-in-three-files-n2-to-the-proposed-node-one-check-before-the-merge-request.md (the PASTES file's sha256 8cb704d1f865e4879b3f47dc4f8e3d405d2011257c89dd067b1119cb8fb47ba8).
   - They were applied in one commit, 26d76ebc5aa927beaf26ca98827b8727b3152314, by the standard worker: state/consults/2026-11-20-b2-piece-1c-save-and-reopen-p4b-words-worker-report.md. Its parent is 0c74eeab. It changes 3 files, 6 lines in and 6 out. Each file is byte-equal to the custodian's file, built by script from 0c74eeab and the ruling's five fences.
   - Words 1: the reviewer's E-1, in the advisor's words, with a second sentence of the advisor's on the 0-byte log (the e2e README).
   - Words 2 and 3: the architect's D1, its first clause, and the reviewer's D-1 and D-2: the three outcomes at the bound, and the poll as the code has it (the README, and the suite's header).
   - Words 4: the architect's D1, its second clause: the suite's cleanup as it is.
   - Words 5: the architect's D3, byte for byte (lib.mjs).
   - No gate re-runs (the ruling's item 1), under the human's message of 2026-11-13 on a gate closed on wording. The reviewer's only blocking finding was wording. The head differs from 0c74eeab in the three files and the ruled lines alone. This amendment records the closing. The advisor's reading that the gates' doc fixes and its own two additions count among the ruled words is listed in the digest for the human to overturn (the ruling's item 9).

3. **Class 2, A's log** (ADV-2026-11-20-21 item 1 (e); the architect's D2). Amendment 54 item 6 says the launcher's log receives A's standard error. In these runs it received nothing, and e2e/out/app.log stayed at 0 bytes. ADV-2026-11-20-19 item 6 was wrong on the same point, and Amendment 66 item 5's last sentence carries its premise. ADV-2026-11-20-18 item 5 stands as it is. Why the log is empty goes to a node the daily batch proposes (ADV-2026-11-20-21 item 1 (f)).

4. **Class 3, the poll's 10 s** (the ruling's item 7; the reviewer's question 4). Amendment 54 item 6 gives the bound as 40 tries in 10 s. The code waits 250 ms after each refused try, so the 10 s is nominal: 40 tries took about 10.7 s in the mutation runs. Nothing rests on the figure, as that item says.

5. **The architect's N2** (the ruling's item 4). The printed words at the bound, the log is empty, stay for P4b. They are exact where the file is 0 bytes, which is every case the reports show, and inexact when earlier runs left bytes and this run added none. They change with the node of ADV-2026-11-20-21 item 1 (f), which then says that this run's part of the log gave 0 bytes. The same node takes the reviewer's N-1 and the architect's N1: B is left running, and the failure is not labelled a launcher failure, when the connect or the page lookup throws after the checks (the ruling's item 5).

6. **The architect's D4, a record.** E-CRASH-UNLOCK's control run replaced the stop of A with `a.browser.close()`, a CDP disconnect that keeps A's process and its open. It was not a graceful stop of A. B stayed refused, and the step went red by name.

7. **The mutations observed.** E-SECOND's, at 441e2346 by the worker and again at 0c74eeab by the reviewer; E-CRASH-UNLOCK's control, at 441e2346 by the worker, which the reviewer reused at 0c74eeab since the change between them is not on that step's path. Each went red by name. The suite's header line for recorded mutations stays as it is (the ruling's item 7).

8. **Class 1, the sign-offs** (ADV-2026-11-20-21 item 3). The sign-off lines on the branch's first two commits, 89625824 and 441e2346, are class 1, and the fault is the brief's. The later two were made with -s and no typed sign-off, as the brief's fix has it.

9. **The cleanup warning** (ADV-2026-11-20-21 item 2; the ruling's item 8). The series run printed that B's WebView2 data folder could not be removed, with EPERM. The check before the merge request, with no suite run: at 2026-11-20T19:27Z no process's command line named spatial-second-wv2b, and the four such folders left under the piece's test data folder were removed at 2026-11-20T19:27:55Z, none left. The line stays a warning. It is not a row.

10. **Stop 10 and the runs.**
    - Stop 10 holds: three runs in a row within the bound, by the worker at 441e2346 (state/consults/2026-11-20-b2-piece-1c-save-and-reopen-p4b-second-brief-worker-report.md).
    - The series, the one series report of the PR (ADV-2026-11-16-06), at 0c74eeab, by the tester on the standard model, on 5180 through the suites' own launch: state/consults/2026-11-20-b2-piece-1c-save-and-reopen-p4b-series-tester-report.md. The project, reopen and second-open suites each rc 0, every row PASS: E-SAVE, E-REOPEN R1 to R9 with E-CHANGED, E-SECOND and E-CRASH-UNLOCK. It is not run again at 26d76ebc: the words change comments and the README alone.
    - CI at 26d76ebc: 2 runs, both success, read at 2026-11-20T19:39:46Z. The PR holds no Rust file, so no clippy run is owed (ADV-2026-11-18-24 item 5 (b)).
    - This project's hold lines in the machine log on 2026-11-20: 128 holds, no two overlapping, read at 2026-11-20T19:39:37Z (ADV-2026-11-16-08 item 4).

11. **Class 8, the step's figures,** restated as each later part's closing does.
    - P4b's groups at 26d76ebc, by the form's section 2.11 command with the form's path excluded, from the merge base db6eb550 to 26d76ebc: e2e 266 lines in and none out, against 425, within; every other group 0. P4b's total is 266 lines in 4 files.
    - The step stood at 9,047 lines and 86 files at 51fed8a5. P4b adds 266 lines and 2 files new to the step, lib.mjs and second-open.mjs, by the union of the files of PRs 331, 332, 333, 334, 337, 339, 340 and 341. So the step stands at 9,313 lines and 88 files, against its Total of 5,170 and 75. Nothing is cut.

12. **Main since the merge base** (ADV-2026-11-14-21 item 6 (a)). The merge base with main is db6eb550bc88fe492f41b5973d16dc8a675a5ee9. The 5 commits on main after it, to 0dd9bed363b85e10e53f622e7c5da8afd2d05d97, change 17 paths, none of the PR's 4. This amendment's commit adds records and forms alone. So the branch takes nothing more from main, and main is not merged into it.

13. **To the advisor, with the merge request, unreworded** (ADV-2026-11-19-06 items 5 and 6). The series report held two hold-line project values, masked at its filing, and its INSIDE-OPEN line drops a U+007F that the log holds. The words worker's report does not byte-copy the changed lines its brief asked for, and says so; the custodian checked the three files by sha256.

14. **Carried.**
    - The node of ADV-2026-11-20-21 item 1 (f), to the daily batch: why A's log is empty under the suites' own launch, with N2, N-1 and N1 (items 3 and 5).
    - The reviewer's D-3, the callers named in two comments of e2e-test-surface.ts, to the docs lane with its words (the ruling's item 6).

15. **Departures.**
    - The architect's gate: one Read of this form was refused as over the size limit, and it read the form in parts.
    - The reviewer's gate: a foreground sleep the harness refused, and a TaskStop the harness does not give a subagent. Nothing ran from either.
    - The series tester's final report came as its last message, not as a hand-back, and was filed from its transcript.
    - The words worker's report, item 13.

16. **Superseded:** Amendment 54 item 6's clause that the launcher's log receives A's standard error, and its 10 s as a figure (items 3 and 4); Amendment 66 item 5's last sentence (item 3). Nothing else.

Read the last amendment first.

Nothing above is edited.

## Amendment 68 — PR 342 merged; E-SECOND on main owed by the merge verdict, its run at the merge commit dispatched

*Written by the custodian, 2026-11-20, after PR 342's merge. References and hashes only. Nothing below is a quotation.*

1. **The merge.** PR 342 was merged by the advisor by merge commit b7926b92e619ed7031ac76d4a9acc2cf9d6df8e6, at 2026-11-20T20:01:32Z, at its checked head 26d76ebc, on its verdict MERGE: state/consults/merge-checks/PR-342-26d76ebc5aa9.md. Main's CI at the merge commit: 4 runs, all success, read at 2026-11-20T20:07:59Z.

2. **Owed after the merge** (the verdict). E-SECOND passing on main, by a run of the second-open suite at the merge commit, before the reopen's plan node is called done for this part. The run was dispatched at 2026-11-20T20:05:46Z to the standard tester, in P4b's worktree checked out detached at the merge commit, on 5180 through the suite's own launch. The merge commit differs from 26d76ebc in records paths alone. Its result is the next amendment's.

3. **Next for the reopen** is P5, the words. Its dispatch waits for the redaction node's merge if its declared files hold a src-tauri path (the redaction form's Amendment 1 item 3).

4. **Superseded:** nothing.

Read the last amendment first.

Nothing above is edited.

## Amendment 69 — E-SECOND on main at PR 342's merge commit: the second-open suite rc 0, both rows PASS; P4b's worktree swept

*Written by the custodian, 2026-11-20. References and hashes only. Nothing below is a quotation.*

1. **The run** (Amendment 68 item 2; the merge verdict). The standard tester ran the second-open suite once at the merge commit b7926b92, on 5180 through the suite's own launch, in one shared hold granted with no wait. It ended rc 0, with two rows PASS and none FAIL. In E-SECOND, B's first try was refused with the other window's place, and B was admitted on its first try after A opened another file. In E-CRASH-UNLOCK, B was admitted on its second try after A's process tree was killed. Nothing was re-run, and no mutation was run. The log's file time is 2026-11-20T20:08:46Z. The report is state/consults/2026-11-20-b2-piece-1c-save-and-reopen-p4b-on-main-tester-report.md.

2. **What it shows.** E-SECOND passes on main, as the verdict owed. The reopen's plan node stays in progress: P5, the words, is still to come.

3. **As before.** A's log, e2e/out/app.log, was 0 bytes (Amendment 67 item 3). The suite printed that B's WebView2 data folder could not be removed, with EPERM. It stays a warning (Amendment 67 item 9). After the run, no process's command line named the piece's build or test data folder.

4. **The sweep** (ADV-2026-11-14-11). P4b's worktree, its build folder and its test data folder, with the folder that warning named, were removed by 2026-11-20T20:56:29Z. The branch is merged, and the worktree was clean at the merge commit.

5. **Superseded:** nothing.

Read the last amendment first.

Nothing above is edited.

## Amendment 70 — P5's five lines before its code, by ADV-2026-11-21-06: the words ruled, R8 carried, R11 carried to P6, a locator corrected

*Written by the custodian, 2026-11-21, before any of P5's changes. References only; nothing below is a quotation. The five lines in item 2 are the form P5 is gated on.*

1. **The ruling.** ADV-2026-11-21-06, the advisor's under the delegation of 2026-11-13, filed at state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-06-p5s-words-ruled-seven-texts-changed-r8-out-of-p5-q1-to-q6-answered-four-files.md, rules P5's words on the drafter's packet (state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p5-words-draft-worker-report.md): seven texts changed by the advisor, the others as drafted, Q1 to Q6 answered.

2. **P5's class** is the five-line form and the reviewer alone, its words the advisor's (ADV-2026-11-16-10 R1 (b)). Its five lines:

```
Authority: PLAN node b2-piece-1c-save-and-reopen, step 2, piece P5; its class by ADV-2026-11-16-10 R1 (b); its words by ADV-2026-11-21-06 items 8 to 22 (state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-06-p5s-words-ruled-seven-texts-changed-r8-out-of-p5-q1-to-q6-answered-four-files.md), on the drafter's report (state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p5-words-draft-worker-report.md); reuse index: three misses, no prior art recorded for known limitations wording, operator walkthrough part or two users project store (tools/reuse.mjs in the read-only reuse clone at 89bbac37, run for the drafter's brief).
Scope: 4 files: KNOWN-LIMITATIONS.md (items 4 and 10, the last sentence of each On-main paragraph and each comment; item 62's title line, paragraph line and comment; new items 69 to 75, each with its comment); frontends/shell/MANUAL-WALKTHROUGH.md (Part AD: its heading, its intro, its Before paragraph, rows AD2 to AD5, the log's lead-in and its rows for AD2 to AD5); frontends/shell/src/console/surfaceRegistry.ts (the effect text of binding_pick_project_folder); kernel/README.md (the Declared limits line); declared line budget <= 100 changed lines by §21c's counting, the drafter's count about 60 before the comments; PLAN.yaml and this form's records excluded.
Change: the words ruled in ADV-2026-11-21-06 items 8 to 20 are applied, each block copied by script from the filed ruling, with the comments of its item 21, the item numbers and their cross-references re-taken at P5's base if they have moved; no other line changes.
Tests+mutation: none added or changed (words, and one string of the Console's registry); the shell's format check, typecheck and tests pass with item 19's string, run by the worker and again by the reviewer; the reviewer reads every clause of items 8 to 20 against the code at P5's head, first the parts the advisor did not read (item 22), and a clause it finds untrue goes to the advisor unreworded.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/ (R8's bullet is out, ADV-2026-11-21-06 item 3), no code but the one effect text, no dependency; the strings the walkthrough rows give as P6 placeholders stay placeholders.
```

3. **Carried** (ADV-2026-11-21-06 item 24). R8's bullet for section 12.3 of the protocol's spec leaves P5. It is carried on this form to the next piece that edits that file under both gates, where the architect, whose note it answers, reads it (item 3). R11 is carried to the human's sight of S9's other line at P6 (item 7).

4. **A locator corrected** (class 3). S4-LOCK is ADV-2026-11-20-05 item 5, not ADV-2026-11-20-04 item 5 as the custodian's brief to the drafter gave it; the drafter's report says so.

5. **Superseded:** nothing.

Read the last amendment first.

Nothing above is edited.

## Amendment 71 — P5's closing at 88b04ead, before its merge request: attempt 1 FAIL on words, ADV-2026-11-21-07 and -08, attempt 2 PASS WITH NOTES, N1 and N2 closed by ADV-2026-11-21-09; the class 1 and 3 rows; the size

*Written by the custodian, 2026-11-21, after P5's gate and its last correction, before its merge request, by ADV-2026-11-21-09 item 5. References only; nothing below is a quotation.*

1. **The gate** (item 5 (a)). Attempt 1 read P5 at 4f09194c and ended FAIL on words alone, with F1 to F4 and D1 to D7 (state/consults/gates/2026-11-21-b2-piece-1c-save-and-reopen-p5-gate-reviewer.md). The advisor ruled on them in ADV-2026-11-21-07 (state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-07-p5s-gate-f1-to-f4-hold-three-sentences-replaced-one-correction-commit-attempt-2-d6-met-by-the-closing.md) and ADV-2026-11-21-08 (state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-08-the-gates-two-notes-ad5s-folder-into-the-correction-item-19s-comment-to-the-docs-lane.md). The standard worker made the two correction commits: 3ab6217b, the three sentences of -07 items 1 to 3 with D1 to D5 and D7; and 5560e831, the clause of -08 item 1. Attempt 2 read those commits at 5560e831 and ended PASS WITH NOTES, with no Correctness or Evidence finding (state/consults/gates/2026-11-21-b2-piece-1c-save-and-reopen-p5-gate-reviewer-attempt-2.md). Its N1 and N2 are closed by the words of ADV-2026-11-21-09 (state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-09-p5s-n1-and-n2-words-ruled-one-commit-after-5560e831-no-re-gate-the-closing-one-amendment.md), applied by the standard worker in one commit, 88b04ead, with no gate reading it again (its item 4). The custodian's script found that commit one commit on 5560e831, KNOWN-LIMITATIONS.md alone, the two replacements made and nothing else (state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p5-correction-3-worker-report.md).

2. **Class 1** (item 5 (b)). The reviewer did not run the shell's checks again. It reused the worker's run at 4f09194c: npm ci in the bundle viewer and the shell, the bundle viewer's build and the shell's npm run verify, each with exit 0, the shell's tests 1570 passed (state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p5-words-apply-worker-report.md). This is the reuse ADV-2026-11-21-07 item 6 names. The three later commits change Markdown files alone, and no shell run is owed for them (-07 item 7, -08 item 2). Amendment 70 item 2's Tests line, where it says the checks are run again by the reviewer, is superseded by this row.

3. **Class 3, the advisor's** (item 5 (c)). ADV-2026-11-21-06 items 19 and 22 name a formatter and a format check, and so does Amendment 70 item 2's Tests line. The shell has neither: its verify script is the typecheck, the build, the checks and the tests, and that is the run the worker made.

4. **Class 3, the advisor's** (item 5 (d)). Attempt 1 found four statements untrue in the words ADV-2026-11-21-06 ruled. F1, in item 62, was replaced by ADV-2026-11-21-07 item 1. F2, in item 75, was replaced by -07 item 2. F3 and F4, in item 74, were replaced by -07 item 3.

5. **The size** (item 5 (e)). At 88b04ead against P5's base af3cd53c: 64 changed lines in the four files of Amendment 70 item 2's Scope. KNOWN-LIMITATIONS.md has 35 added and 7 removed, the walkthrough 12 and 4, the Console's registry 2 and 2, and the kernel's README 1 and 1. Counted commit by commit, the four commits change 64, 18, 2 and 4 lines, 88 in all. Both counts are under Amendment 70's 100 (ADV-2026-11-21-07 item 8).

6. **Carried** (item 5 (f)). The comment on the registry's row naming the slots goes to the docs lane, with the next piece that edits surfaceRegistry.ts (ADV-2026-11-21-08 item 3). R8 and R11 stay carried as Amendment 70 item 3 has them: R8 to the next piece that edits the protocol's spec under both gates, and R11 to P6.

7. **The PR.** PR 344, cut/1c-p5-words at 88b04ead, out of draft. CI at that head was read at 2026-11-21T07:28:17Z: 6 runs, all completed with success.

8. **Superseded:** the clause of Amendment 70 item 2's Tests line named in row 2.

Read the last amendment first.

Nothing above is edited.

## Amendment 72 — PR 344 merged at 9775a3c4 by the advisor's merge; main's CI there; what step 2 still waits for

1. **Merged.** The advisor's verdict on PR 344 at 88b04ead is MERGE, filed at state/consults/merge-checks/PR-344-88b04ead34e9.md. The advisor merged it by merge commit 9775a3c49cc6f067c50170a294d8cf38d176d6c6, at 2026-11-21T07:59:56Z (the grant, item 5).

2. **Main's CI at the merge commit:** 5 workflow runs and their 9 jobs, each completed success, read at 2026-11-21T08:19:40Z.

3. **Step 2's pieces of code and words** are all merged, P1a to P5. E-SECOND passed on main (Amendment 69). By Amendment 54 item 18, the step still waits for its operator Part, P0 and OP1 to OP6, run after the step's code as section 9 orders it. It also waits for P6, the strings Amendment 54 item 12 places under it, which the app still shows with the P6 placeholder marking, with R11 (Amendment 70 item 3). Step 3 is outside v0.2.

4. **The plan node** stays in progress.

5. **Superseded:** nothing.

Read the last amendment first.

Nothing above is edited.

## Amendment 73 — P6's first group, the reopen's 37 strings, before its code, by ADV-2026-11-21-14: the words stand, the marks come off, Part AD by script

*Written by the custodian, 2026-11-21, before any of the group's changes. References only; nothing below is a quotation. The five lines in item 2 are the form the group is gated on.*

1. **The rulings.** ADV-2026-11-21-14, the advisor's under the delegation of 2026-11-13, filed at state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-14-p6s-cut-one-group-now-the-reopens-37-strings-words-stand-marks-off-part-ad-by-script-the-rest-after-the-sitting.md, cuts P6 on the inventory's two reports (state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p6-strings-inventory-evidence-reader-report.md and state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p6-strings-inventory-part-2-worker-report.md): one group now, the reopen's own 37 strings, kind (a) of its item 1. S8 is among them by the human's approval of ADV-2026-11-21-12, filed at state/directives/2026-11-21-the-humans-message-four-drafts-approved-s8s-words-to-the-advisor-the-ci-change-v0-2-without-the-console-and-mint-window-nodes-the-stop-alarms-check-d.md. By ADV-2026-11-21-13 item 1, filed at state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-13-the-humans-four-approvals-placed-the-ci-piece-in-slot-1-the-stop-alarm-resumes-item-68-meets-the-limitation-s8-joins-p6.md, the group starts when that approval is on main.

2. **The group's class** is the five-line form and the reviewer alone, with the standard worker (ADV-2026-11-21-14 item 7). Its five lines:

```
Authority: PLAN node b2-piece-1c-save-and-reopen, step 2, P6's first group; its cut, words, comments, runs and review by ADV-2026-11-21-14 items 1 to 8 (state/directives/2026-11-21-advisor-ruling-adv-2026-11-21-14-p6s-cut-one-group-now-the-reopens-37-strings-words-stand-marks-off-part-ad-by-script-the-rest-after-the-sitting.md), on the inventory's reports (state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p6-strings-inventory-evidence-reader-report.md; state/consults/2026-11-21-b2-piece-1c-save-and-reopen-p6-strings-inventory-part-2-worker-report.md); S8 by the human's approval of ADV-2026-11-21-12 (state/directives/2026-11-21-the-humans-message-four-drafts-approved-s8s-words-to-the-advisor-the-ci-change-v0-2-without-the-console-and-mint-window-nodes-the-stop-alarms-check-d.md); reuse index: three misses, no prior art recorded for placeholder string mark removal, ui string wording ruling or walkthrough row mark (tools/reuse.mjs in the read-only reuse clone at 89bbac37, exit 1 each, run by the custodian for this amendment).
Scope: at most 7 files: frontends/shell/src/project/reopenNotices.ts (its 24 marked literals and its comments); frontends/shell/src/project/saveProject.ts (its 8 marked literals and its comments); frontends/shell/src/admission/AdmissionPanel.tsx (the Open project control's 2 texts and their comment); frontends/shell/src/layout/actionRegistry.ts (the labels of project.save and project.open and their comments, the labels and comments of layer.revealStyle and layer.revealTable unchanged); frontends/shell/src-tauri/src/commands.rs (the folder picker's title and its comment); frontends/shell/MANUAL-WALKTHROUGH.md (Part AD, the two changes of item 4 of the ruling, by script); and a test file only under item 5 of the ruling; declared line budget <= 100 changed lines by §21c's counting; PLAN.yaml and this form's records excluded.
Change: in each of the 37 literals the mark and the one space after it are removed from its start and nothing else in it changes (item 2); the comments say whose wording each string is, as item 3 has it, and the header of reopenNotices.ts names the human's approval of ADV-2026-11-21-12 by its filed directive; Part AD gets item 4's two changes and nothing else, the file's sha256 after them the one item 4 names.
Tests+mutation: no test is added; the shell's verify at the group's head, run by the worker; a test that fails because it holds a marked text of this group has that text changed and nothing else, listed in the report, and a test that asserts the mark as a rule goes to the advisor (item 5); the worker searches frontends/shell/e2e for the 37 texts' words, and a suite that holds one is run once by the tester after the change, else the report says none is owed; the reviewer checks the diff against items 2 to 4 by script and by reading, reads the comments, and reads against the code at the head the clauses of the eleven strings step 1 built (item 6), a clause it finds untrue going to the advisor unreworded.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no kernel, engine or protocol file, no dependency; every other marked string keeps its words and its mark until the sitting has been held (item 9), the walkthrough's 23 marks outside Part AD and Part AD's four notes on strings for sight among them.
```

3. **After it merges** (item 8), step 2's P6 is the human's sight of these strings at the sitting, in Part AD, and nothing else; the group's closing records it here.

4. **Item 10 of the ruling** asks two things of a later batch and rules nothing: what the POINTS form's two refusals listed as marked are, and where the covering-case form's texts went.

5. **Superseded:** nothing.

Read the last amendment first.

Nothing above is edited.

## Amendment 74 — P6's first group built: the commit, the counts, the size against Amendment 73's budget, the run

*Written by the custodian, 2026-11-21, after the group's commit and before its gate. References and hashes only; nothing below is a quotation.*

1. **The build.** b42ccb3e7060d7179822ee21c7661ca2699bb18b on cut/1c-p6-group-1, over 5aa0cb67591431ebdaa41d4a2bd447c16b76f008 (main at records commit 1121i), by the standard worker: one commit, 6 files, the five source files and the walkthrough. No test file changed. The search of the ruling's item 5 found none of the 37 texts in a test file or an e2e suite, so no e2e run is owed.

2. **The counts, recounted by the custodian at the head.** The marks: reopenNotices.ts 24 to 0, saveProject.ts 8 to 0, AdmissionPanel.tsx 2 to 0, actionRegistry.ts 4 to 2 (layer.revealStyle and layer.revealTable keep theirs), commands.rs 1 to 0. The walkthrough: 36 to 23, and its sha256 at the head is 06d690f14fed1b6e91123da3a76a1257cd75bc7e056ab9a461725c9e9c8544ee, the value of the ruling's item 4.

3. **The size.** 52 lines added and 50 removed: 92 in the five source files and 10 in the walkthrough. Item 2's budget is at most 100 changed lines by §21c's counting, which counts code and tests: the five source files' 92 are inside it. With the walkthrough's 10 counted too, the sum is 102, 2 over. This is disclosed before the gate and the budget is not declared again; the reviewer says which reading holds.

4. **The run.** The worker ran npm ci in renderer/bundle-viewer and in frontends/shell, then npm run verify in frontends/shell, each in a shared hold, on the tree it then committed. Verify ended at 2026-11-21T11:08:51Z with exit 0, its vitest run passing 123 test files and 1570 tests. The reviewer reuses the run, or reproduces what it doubts.

5. **Next.** The reviewer alone (the ruling's item 6), then the merge request. After the merge, step 2's P6 is the human's sight in Part AD (item 8).

Read the last amendment first.

Nothing above is edited.

## Amendment 75 — 2026-11-21 — P6's first group: the gate PASS; three comments to fix; the size; CI green at the build

*Written by the custodian after the gate. References only; nothing below is a quotation.*

1. **The gate.** The reviewer read cut/1c-p6-group-1 at b42ccb3e and ended PASS, with no Correctness or Evidence finding (state/consults/gates/2026-11-21-b2-piece-1c-save-and-reopen-p6-group-1-gate-reviewer.md). It read the custodian's check script and ran it, CHECK OK with exit 0, read every line of the diff, and found the eleven strings of ADV-2026-11-21-14 item 6 true against the code in ordinary use.

2. **Documentation, must-fix, all source comments in the worker's wording.** N1: the comment on O-19b's label names ADV-2026-11-21-14 item 2, where the label's words are ADV-2026-11-20-05 item 2's. N2: the header of saveProject.ts says every string there is the step 1 worker's words, untrue of the through-link notice, O-9, whose words are ADV-2026-11-20-05 item 2's. N3: the header of reopenNotices.ts calls S8 the approval, where the approval gave S8's words to the advisor. The report gives the reviewer's replacement words for each, checked clause by clause.

3. **The size** (Amendment 74 item 3). By the text of section 21c the walkthrough is neither code nor a test, so the count is 92 and Amendment 73's budget holds. The other reading gives 102 (the gate's N4), the advisor's to take; either is inside section 21c's own bounds.

4. **For the advisor, no rewording.** N5: two of the eleven strings, O-9 and O-19b's label, were built at P4a-2 under ADV-2026-11-20-05 item 2, not by step 1, as ADV-2026-11-21-14 item 6 has it; the reviewer read them anyway. N6: two cases outside ordinary use, named for the strings' source comments (AUTONOMY section 31 (c)): a panic after the project file is written, and a non-project object at the target's name.

5. **CI at the build.** At b42ccb3e, read at 2026-11-21T12:09:28Z: 4 runs, all completed with success; the shell run's two jobs, the Windows tauri build among them, passed.

6. **Next.** The findings go to the advisor for a ruling on how they close; the PR follows.

Read the last amendment first.

Nothing above is edited.
