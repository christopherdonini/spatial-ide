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
