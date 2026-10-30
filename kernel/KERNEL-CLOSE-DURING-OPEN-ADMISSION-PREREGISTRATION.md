# A close during open_dataset's admission leaves a generation for a name the catalog no longer holds — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests has been seen says so in its first line. PLAN node kernel-close-during-open-admission, the filler queue's entry 5 (S3, test only). The five lines and the notes are the architect's draft (`state/consults/2026-10-25-kernel-close-during-open-admission-five-line-form-architect-draft.md`, read only at main f823614c; its sha256 from line 5 is 958f5236bac435ec1261ca7e1d94b55f8633e06d2080893274d81ff97118e271), with two changes, both the custodian's: each cite at f823614c is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>`, a cite naming several places under one commit written as one pin each (38 pins); and the settlement below. Every pin is historical: for the code, the piece's base tree is authoritative; for what this form read, the pin is. Form path: `kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md`. The custodian keeps the PLAN node on main; the branch carries no PLAN file and no generated file. Gating: the reviewer and the architect, from dispatch (§36).*

```
Authority: PLAN node `kernel-close-during-open-admission` (PLAN.yaml:3337-3353 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:fbe083197d832fac49b1e3ba80ab80b1b1eb95ba15d8a6ca7a1430c49703aaa1), generation 2; filler queue entry 5, graded S3, test only (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:13 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:f71516e9233b3180b21ac8bb4a730d3cf9b898837f047a992ede8f923d8e636a; state/FILLER-QUEUE.md:12 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:4250b75ac35f8621379fc65a3689163e7e76d3b82a8273aad26197f67582098c); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; the finding is N1 of the 2026-09-30 drafting consult (state/consults/2026-09-30-close-dataset-unknown-architect-draft.md:45-50 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:de02e2f94f7ff4fe50108bd2704a5a07691626ec64fde5249e8a380b8e3dce63); the reuse index found no prior art on either search (close during open race; catalog admission window), a miss noted here.
Scope: 1 file, kernel/src/skp.rs, inside the `#[cfg(test)]` module `ticket_drop_under_lock_regression` only; declared line budget 140 (insertions plus deletions, tests and comments counted, AUTONOMY.md:357 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; no product line changes, and no existing test is changed or removed.
Change: adds one in-crate test that reaches the window between `SkpHost::open_dataset`'s catalog insert and its admission through a test-owned `ArmedWatch` whose `resolves_unchanged` runs a real `close_dataset` on the new handle, and asserts today's behaviour: the close returns Ok, the open still returns Ok and mints a generation carrying the reference it returns, for a name the catalog no longer holds; `describe` and `viewport_query` refuse that handle as `skp.unknown_dataset` with no ticket minted; nothing is emitted; and a second close refuses as `skp.unknown_dataset`, drops the watch and leaves that generation live.
Tests+mutation: a_close_during_open_admission_leaves_a_generation_for_a_name_the_catalog_no_longer_holds (new, kernel/src/skp.rs; predicted to pass at the base); M1: in `open_dataset`'s Watching arm, immediately before `SessionRef::mint()`, return `Err(SkpError::unknown_dataset(handle.as_str()))` when `self.catalog.get(handle.as_str())` is `None`, so the open is refused and the test fails by name at its expect on the open's result; observed by applying it, running the test, recording the failing assertion with the commit in a `RECORDED MUTATION:` doc line, and reverting.
Out-of-scope: ADR: no status line or amendment (ADR-035's mint rule and its Note 2026-09-25 are read, not changed); security: nothing ADR-020, ADR-009 or ADR-021 governs, and the CSPRNG handle minting that keeps the window out of the product's reach is unchanged; wire: no SKP, data-plane or MCP surface, nothing under protocol/, no code or message text; guarantee: none changed, since no product line changes and every existing test keeps its text; the new test asserts, as today's behaviour in an interleaving the product cannot reach, a generation minted for a dataset whose close has already forgotten it, the kind of state round 22, item 1 calls the defect for a closing dataset (paraphrase), which kernel-generation-close-races declared outside its claims (`open_dataset` declared unchanged there); the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

**The reuse index**, byte for byte as the custodian ran it for the draft's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs close during open race
No prior art recorded for "close during open race". Research it before planning an implementation.
$ node tools/reuse.mjs catalog admission window
No prior art recorded for "catalog admission window". Research it before planning an implementation.
```

*The notes below are the architect's from its draft, carried byte for byte except for the pins; where they say mine, they mean the architect's. They are this form's reading.*

## Notes

### 1. The test

**The window is real at f823614c (from reading the code; not yet run).**
- The catalog insert happens inside `Catalog::open_cancellable` (kernel/src/lib.rs:233 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:e722e5cdb78b7cf62bfa6dd016358564faf71539a99d3123c8a403c32bd68590), which is called at kernel/src/skp.rs:1175-1177 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:93f5dd4102eecfef3b126d4c9562f19b63b2c2629abbdfe3c53d967df2545541.
- Admission then takes the latch (kernel/src/skp.rs:1191 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:00492052e77870b2eb397ec0a83c3b9ad562c1888b3c53fe6b35f43a21899730) and calls `watch.resolves_unchanged()` (kernel/src/skp.rs:1206 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:8dae7457cb92a71f2cdc9ee73f5fb9fb0899fff81659a6e9bb33f9c2b5738507).
- Only after that does it mint and insert the `OpenRecord` (kernel/src/skp.rs:1243-1258 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:bf43229f35b40d1c417a00083bfc70c3d25e4bed32a15a0920027e241defb3ca), and it returns `Ok` at kernel/src/skp.rs:1295-1298 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:cd912cc0c606e38da14b4e51a5753d534f1560aa1e98dd881cce7c97bdd86ae5.
- `close_dataset` (kernel/src/skp.rs:1554-1595 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:d3992437fb26d6e15ba3f5b9c99ef61f19bdcbba7e290062065a14f50f0679c6) never touches the per-open latch.
- The only lock it takes that admission also uses is `generations`. Taking that lock while the latch is held follows the documented order, latch then generations (kernel/src/skp.rs:1002-1006 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:522d5c1ff043f68f289ad21fc217e52963e86c45adebe9e3346c94af08437f89). So a close run from inside `resolves_unchanged` completes without deadlock.
- That close finds the catalog entry, so it does not refuse (kernel/src/skp.rs:1573 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:ac8e736037806d32f5764c633d7a30fdc93ff03c58560e51041923d969fb3d80). It then runs `begin_close`, `cancel_all_for_dataset`, `forget_dataset` and `catalog.remove` on a name that has no generation yet.
- Admission then mints anyway (`mint_for_open`, kernel/src/skp.rs:574-593 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:a4e25ba3f1ad910f686f46441f23b420708e9cce496e51dc60b29e6030050648, has no closing or catalog check) and returns `Ok`.
- The ChecksOnly arm (kernel/src/skp.rs:1261-1293 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:b8a04cba294c0d9807dcbf8963b1d0b92ebedff79fcb7437255bc19696cdcfb9) has the same window but calls back into nothing inside it. The Watching arm's `resolves_unchanged` is the only re-entrant seam, which is the one the node names.

**Why the product cannot reach it.**
- The handle is 16 bytes from the OS CSPRNG (protocol/skp/src/v0/handles.rs:19-23 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:ed8e290352da217b235c32b2b1f4f2ae09144455a5c797ae24cde6a0753cc730), and only this open returns it.
- `Catalog::names` (kernel/src/lib.rs:252-254 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:911ac3c5bd4044de8e896caa53286931d4112e10949a258cbe659bfed655ffbc) has no product caller. A search for `names()` finds only tests in kernel/, and nothing in frontends/shell/src-tauri/src. The one hit in kernel/src/publish/mod.rs:526 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:d084156264c3402da6043c6e46fe7820d7ae75ddb0969a7df2144cccaa4faf90 is a projection's `names()`, not the catalog's.

**The seam, against the real interfaces.**
- `ArmedWatch` and `SourceWatchArm` (engine/src/watch.rs:39-50 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:03cba6f7aa5ec942292e3169b0f73f2fc94f3499343e250aeb227a3556c371a2 and engine/src/watch.rs:67-69 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:da5f03d3bfe66c68fa02bab19e8a022b4a8b576468808717c3c9f43f0aa6308b), `SkpHost::catalog`, `close_dataset` and `DatasetHandle`'s `FromStr` (protocol/skp/src/v0/handles.rs:60-66 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:a4a2314470708460677f4aceb6cb8529fcdc7c7884f5b6e1101a147eddfaba6d).
- No new `pub` item, hook, callback or `cfg(test)` branch in product code. This follows the close-races placement rule (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:211 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:bcfe315afa2ecfae6057303fa506c78b3278acaca7192fc87031ecb15dc35846) and its determinism rule: no sleep, no spawned thread, no timeout (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:203 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:60f27288730cb392458d0964d8250f5ded4ac53b3dc0191278b270621c23eed4).

**The shape** (mine, for the worker):
- `CloseOnAdmissionArm` returns `ArmOutcome::Watching` over a `CloseOnAdmissionWatch`. The watch holds three things:
  - a `Weak<SkpHost>`, from `Arc::new_cyclic`. It is weak because the host owns the `OpenRecord` that owns the watch, and a strong reference would be a cycle;
  - a result cell, the CR2 pattern at kernel/src/skp.rs:4490-4500 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:0b173b8ff538055feeaa2eec77fd6ccce516b9e0e828b2e75cf7e40d7cf1a4bc;
  - a drop flag, the `FlagWatch` pattern at kernel/src/skp.rs:4923-4934 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:8fa0aa302f74f9d528ad7579383795e1b54cfd289e4580fff61b890032ba90b4.
- On its first call, `resolves_unchanged` does the following, then returns `true`:
  - reads `host.catalog().names()` (exactly one entry, because the catalog is fresh);
  - records whether the name is in the catalog and `generations().live_generation(name)`, which is expected to be `Err(NotLive::NotOpen)`. This proves the call is after the insert and before the mint;
  - runs `host.close_dataset` on that name and stores the result in the cell.
- The test uses the module's `fixture`, `close_req` and `holds_a_record` helpers (kernel/src/skp.rs:3428-3430 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:b7eda202b73ceb6b8ede095c4257aceb630dd440d8e96ee0f61110dcb1265d10, kernel/src/skp.rs:4954-4966 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:ab2b9f3f9b7f1e8b8c2dc92c19664f24bebf525eebcb072069467e8cc119683c). It asserts, in order:
  1. the cell's pre-state (in the catalog, `NotOpen`) and the close's `Ok` with `cancelled_streams == 0`;
  2. `open_dataset` returns `Ok` (the expect that M1 fails), and its handle equals the closed name;
  3. `catalog().get(name)` is `None`;
  4. `live` holds `name` with `open.session` (read in-crate, the K15 precedent), the host holds a record, and the watch is not dropped;
  5. `describe` and `viewport_query` on the handle both return `skp.unknown_dataset`, and the ticket map is empty;
  6. `try_recv` is empty;
  7. a second close returns `skp.unknown_dataset`, the record is gone, the watch is dropped, and `live` still holds `name`.

  Item 7 relies on the earlier piece's watch-release ordering (kernel/src/skp.rs:1567-1572 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:ce7b583b5ce2aef0490c48f664bcdc4c0a59911aa4b048237185e270eed715d9), which is unchanged.

**How it reads.**
- It is an asserted-today test. It passes on main and pins the defect: it is not failing by design, and not `#[ignore]`d.
- Its name states the defect. Its doc comment should say four things:
  - it pins today's behaviour, a known gap the product cannot reach;
  - M1 is the fix shape;
  - a fix flips it, and it is then replaced under the fix's own form;
  - it claims no property.
- Why not `#[ignore]`: in kernel/ and engine/ that attribute is used only for heavy or fixture-gated harnesses (for example kernel/tests/slice_budgets.rs:474 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:011954d581880cfd83faef9bedc4d0e5160b57a5a86dd91768c1f50849c4d499). An ignored known failure would be a new category in this tree, and an ignored test cannot carry an observable mutation on CI.
- This is a claim the human must see (OPEN-1).

### 2. The mutation

- M1 is in the Tests+mutation line. It is deterministic and runs on the test's own thread.
- It is also the smallest fix shape. That makes the record show plainly that the test is a pin which a fix breaks by name.

### 3. The size (AUTONOMY.md:350-351 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333 and AUTONOMY.md:357 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec)

| Part | Estimated changed lines (mine) |
|---|---|
| The watch and arm, with their impls and doc | about 40 |
| The test's doc comment, with the scenario, the reading and the M1 record line | about 20 |
| The test body | about 65 |
| **Total** | **about 125, in 1 file** |

- This is under the declared 140 and under §21c's limits of 150 lines and 8 files.
- No new dependency (`std::sync::Weak` is std), no exposure surface, no user-visible behaviour.
- An overrun is recorded as class 6, and the Scope line is not edited (AUTONOMY.md:345 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:ac3b30f25e10d5a8efd8202a960e95a02e00672d5d5b9faf9226c8216b2456c3).

### 4. Out-of-scope readings

- **ADR.** None is touched. The state the test asserts is ADR-035 territory: Decision 4's mint rule and its Note, which carries round 22, item 1 (docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:149-158 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:f81b5c50537ea14d3d9e8c71909ec19d162209c5849299db1d82bb07af6ee7a3). Nothing in the ADR is edited.
- **Security.** None is touched. The handle's unguessability is what makes the window unreachable, and it is unchanged.
- **Wire.** None is touched. The test reads only the existing `skp.unknown_dataset`.
- **Guarantee.** Following the reading settled for governance-hash-grammar-shared, "touched" means changed, and nothing is changed. Whether the test touches a property under test:
  - Close-races claims (i) to (v) (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:79-84 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:571cbbe07f36c3a4f8d7816b90f6dd1c847f7693cae4a4fd26a609a92f2645ff) and its falsification (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:270-273 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:98a1149cc73c0546661c3158c575e3aca97c460891a582fe0407835c4c0c74b6) describe the state once a close returns.
  - The inner close does return with no generation for the name. The mint comes after it, from `open_dataset`, which close-races declared unchanged (kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:256 @ f823614c3afd9cef6eb30e9eb5428ec34925ca0d sha256:b14c81bf5a28b7d70de3b43a74e579a0aa80c8bf2188c53595631cc9e4b2fac4). So no existing claim is falsified as written.
  - A gate may read claim (i) as also covering the refusing second close in step 7. On that reading, the test asserts a counterexample to a stated property in an unreachable interleaving. That is the substance of OPEN-1, not a reason to hide step 7.
  - §36 sets round 25, item 2 (e) aside, so the five-line form stands either way, gated by the reviewer and the architect.

### 5. Rule (00), path by path

The piece's only path is kernel/src/skp.rs, plus the form on main.

| In flight | Overlap |
|---|---|
| slot 2, 1c step 1 | none. Contact: it edits kernel/src/lib.rs, where `Catalog` lives, and the test calls `Catalog::names`. If 1c changes that API, the conflict shows up as a compile error at the merge of main, not as a shared path. |
| port-2 | none |
| #241 | none (its kernel paths are under publish/, permission/, bundle/ and bin/; kernel/README.md is not edited here) |
| #244, #249 | none (this piece edits no KNOWN-LIMITATIONS.md) |
| #252, #255 | none (engine/ only) |
| #256 | none (scripts/plan/ only) |

- Disjoint by path.
- Nothing under protocol/, so the at-most-one-protocol rule holds.
- These path lists are the brief's; I cannot read branches.

## The custodian's settlement (class 1, before any code)

- **OPEN-1: (A), the human's** (`state/directives/2026-10-25-filler-entry-5-open-1-a-pr-b-open-1-2-3-a-o1-probe-lead-data-designs-tester-high-runs.md`, item 1; sha256 from line 6 78745c4bdab2574779d77a78ce9fc324e26bfa7f85c94ec2e0ecc44c6d40ddb4). The test asserts today's behaviour in full, the live generation included (items 4 and 7 of note 1's shape), and is named as the pinned defect, so a fix flips it by name (M1). The PR body says that main will carry a green test asserting that state, in an interleaving the product cannot reach.
- **OPEN-2: the custodian's.** The fix is node `open-dataset-refuses-a-name-closed-during-admission`, proposed for the human to place and listed among the filler queue's proposed additions. Its smallest shape is M1's. It replaces this test under its own form.
- **The worker's first run** settles what the draft read without running (its last section). If the inner close refuses, or the call hangs, the worker stops and reports before M1.
- **Rule (00)** was checked again at main fb361420 by `git diff --name-only origin/main...<branch>` for every open branch: none touches `kernel/src/skp.rs`, and none touches `protocol/`.

## Amendments (opens empty; append-only)

## Amendment 1 — the guarantee reading corrected (written after this piece's test runs were seen)

The Out-of-scope line's guarantee clause and note 4's guarantee bullet 2 overstate kernel-generation-close-races' record: that piece declared `open_dataset` unchanged (`kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §5, Declared unchanged), and its §1 May-not-claim list does not name this interleaving. Read literally, its §1 claim (i) and its §5 Falsification second bullet are met by this test's items 4 and 7, in an interleaving the product cannot reach; on note 4's reading, that those claims describe the state at a close's return, they are not. The proof is the test `a_close_during_open_admission_leaves_a_generation_for_a_name_the_catalog_no_longer_holds` (kernel/src/skp.rs @ 7b437be3), items 4 and 7; the fix node `open-dataset-refuses-a-name-closed-during-admission` is to remove that state.

*The words above are the architect's, from its gate 1 report (`state/consults/gates/2026-10-25-kernel-close-during-open-admission-gate1-architect.md`, D2), byte for byte; the heading's level follows this form's. Nothing above is edited.*

## Amendment 2 — the closing record, written after gate 1's reports and the words commit were seen: the gate's words applied with no re-gate (class 1)

*Written by the custodian at the PR's final head 4e7029d97b2ca0d19b74c083b83228b8d57024c9. References only, and nothing below is a quotation. The gate: `state/consults/gates/2026-10-25-kernel-close-during-open-admission-gate1-architect.md` (gate-log 625; sha256 362ee555bb821908117c30da1fc26226e84a3338ac0b058a48af140492d4f1c3) and `state/consults/gates/2026-10-25-kernel-close-during-open-admission-gate1-reviewer.md` (gate-log 626; sha256 c313d517134db933d543febcf1d99b7b9b8867f3cf38209b7c2cb78ef9825098), both PASS WITH NOTES. The words commit: `state/consults/2026-10-25-kernel-close-during-open-admission-gate1-words-worker-report.md` (sha256 from line 5 9073045b1ea438af89f876688dc3131ca2ea201fc49a2d0987b6c030bba406e3).*

1. **The words, applied with no re-gate** (AUTONOMY §31). None is the human's wording.
   - The architect's D1: the test's doc-comment sentence on why the product cannot reach the window, at 4e7029d9.
   - The architect's D2: Amendment 1, the guarantee reading corrected.
   - The reviewer's D1: the PR body's Rule (00) line names the commit the settlement records.
2. **The size.** By the numstat from the merge base dd0b6113 to 4e7029d9, the diff is 129 lines in the one file the Scope names, under its 140, all inside the test module.
3. **The reviewer's observation** on the build report (`state/consults/2026-10-25-kernel-close-during-open-admission-build-worker-report.md`): the report counts 47 test-result lines for the kernel crate, where the gate's run printed 45; the totals agree (379 passed, 0 failed, 41 ignored).
4. **The architect's notes.** N2: the fix node's title is narrowed in PLAN to what M1 reaches. N1 and N3 call for no change; N1 is in the PR body for the human.
5. **The record.** This is correction round 1 of 2.

Nothing above is edited.

## Amendment 3 — the pinned test is replaced; superseded pins to lines 9 and 133 (written after the replacing piece's fix commit and its first kernel test run were seen)

The piece is `open-dataset-refuses-a-name-closed-during-admission`, under `kernel/OPEN-DATASET-REFUSES-A-NAME-CLOSED-DURING-ADMISSION-PREREGISTRATION.md` (its OPEN-3 settlement). Both pins are at the piece's base on main; the tree at that commit is authoritative for what the lines said, and these pins are historical.

1. kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:9 @ fa3d09f693466334b71c5d9258f243f5282918bc sha256:29de1baeebc7b5c7a2c768b4c45baf4a2422496769f8d31e222c166eec227172 — superseded as of this amendment; replaced by the test a_close_during_open_admission_refuses_the_open_and_mints_no_generation in kernel/src/skp.rs.
2. kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:133 @ fa3d09f693466334b71c5d9258f243f5282918bc sha256:b67a56142b0db61f8dac8efd6efa3e45c6ba3d707be91fb32896ab1dd3e0739b — superseded as of this amendment; replaced by the test a_close_during_open_admission_refuses_the_open_and_mints_no_generation in kernel/src/skp.rs.

Nothing above is edited.
