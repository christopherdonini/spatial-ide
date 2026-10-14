# Stale test names and test comments brought current: preregistration (full form)

**Authority.**
- **The node:** PLAN node `stale-test-names-and-comments` (`PLAN.yaml:4462-4478 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:48a5472a6bbfaa5541bbc641caa40f1239c75deceac2fde8c04945dd16b59935`; its title is at :4463 and its summary at :4477).
- **Placement:** the human placed it as the docs lane's item 3f (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:28 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:c9fb5cad422f2a09caf23787da834831e86554cda51aa0b318cbe52864b3e309`).
- **The lane's terms:** `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:19 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:58d6c8e006c3d7a147debe6478ccb80a44fbad69c48f11d52fab7bfbeadd8f0d`.
- **Test files and e2e files only:** the same directive's line 6 (at 19b01c40).
- **The one-file exception:** the human's ruling, item 3 (`state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:14 @ d8f2b800049be521177c394ffa4c272ab4dae82d sha256:0ab595d8b2062e00e7bfc676edbdc76f8f30d12aab7df16e0b117afd4a3eab2f`), as recorded in piece d's form, §10 Amendment 1 item 2.
- **Widenings:**
  - the human's item 4 (`state/directives/2026-10-10-pr199-merged-flush-open-1-pr200-sentence-stale-comment.md:14 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:8c8e90207b322add2a5e631dc4d25e8232dc995ded33cd343f25af0d25b8abfc`);
  - PR #204's architect gate 1, D2 (`state/consults/gates/2026-10-10-e2e-stale-expectations-reaim-gate1-architect.md:106-108 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:088604f4e29cdf9bd745265f05663a9f07c98ef9b5d8db60f4e6d57effe10339`).
- **Area E placement:** `state/directives/2026-10-10-drift-sweep-area-e-instructions.md:11` and `:23` at 19b01c40.
- **Drafted ahead of its slot:** `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:38 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:2eba54a30650266443f7bfd35cb1581b050063d7db93623b0ad2b648a7d92c4d`.

**Drafted by** the architect, on the custodian's brief. The inputs are:
- lead-data's impact read (`state/consults/2026-10-11-stale-test-names-and-comments-impact-read.md`, read at 05b795e0);
- the sweep, parts 1 and 2;
- the custodian's check;
- the architect's own reads at main 19b01c40 (below, C).

**Committed before any code.** Append-only once committed. An amendment made after any outcome has been seen says so in its first line.

**Gating.** Full form and full gating, by `AUTONOMY.md` §21c: 14 files is more than 8. The five-line form is closed from dispatch (§25(e)).
- §21a category 4 also applies: these names and comments restate properties currently under test, and row F7 cites ADR-018.
- Verdicts are proportional (`state/directives/2026-10-05-product-first-direction.md:15 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`).

**Reuse index.** `tools/reuse.mjs` at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, queried with "stale test names comments", recorded no prior art and exited with code 1. This is the standing step (`state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:33-36 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:c8fdf6726f013c0396b45f15c77e6f7deadf1833c6e971121542225769866fdc`). The miss is noted, and it does not block.

## §0. Disclosure

- **Inputs:**
  - lead-data's impact read;
  - `state/consults/DRIFT-SWEEP-AREA-E-2026-10-10.md` (findings 2, 3, 4 and 7);
  - `state/consults/DRIFT-SWEEP-AREA-E-PART-2-2026-10-10.md` (finding 10);
  - the custodian's check, `state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md`;
  - PR #209's architect gate 2, O-1, for OPEN-1 only.
- **Pins are historical.** Every `path:line @ <commit> sha256:` below was copied from a form on main, at the commit it names. Every `path:line at 19b01c40` is a read at C, for the custodian to pin by script.
  - Before code, the worker re-reads each cite at its base B. B is the merge-base on main after the CRS piece (`shell-crs-form-for-format-default-contradicted`) and piece e (`skp-v0-live-sections-current-area-c`) have both merged.
  - Where B's tree no longer matches a cite, B's tree is authoritative for that row, and the moved line is recorded as a class 3 row before code.
  - A changed fact, as opposed to a moved line, is an invalidator (§5).
- **Lines moved since the impact read** (05b795e0 → C):
  - the premise in `frontends/shell/src/canvas/WorkingCanvas.test.ts` is now at :122-125;
  - `App.layout.test.tsx`'s R1 is now at :306.
- **Superseded by ruling:**
  - The node summary says the `engine/src/identity.rs` reference "is in module-docs-stale-statements and follows the rename". The custodian check's Part 1 item 2 says the same.
  - Both are superseded by the human's item 3 (Authority). The reference moves in this piece's rename commit.
- **Found by the architect beyond the impact read, marked (A):**
  - **Finding 3 is narrower than the sweep says.** `App.layout.test.tsx`'s canvas stand-in records a mount and an unmount whenever its `dataset` prop changes, through an effect that depends on `props.dataset` (`frontends/shell/src/App.layout.test.tsx:136-141 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:a25f21655e8ee2f0ead6d3efb6513ee56f41d44dab3dabfb9b97ee9ad056e501`). So R1's per-handle counts hold whether or not `App` keys `WorkingCanvas` on the dataset (`frontends/shell/src/App.tsx:1783 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:746a953e269f1433dbc24b34cda0c2ea3823a93a6c3f59d32623dde91533e13a`).
    - The claim in `App.test.ts` that the per-dataset `key` remount is not tested anywhere in this suite is still true.
    - The harness premise is what is stale. Row F3a is written to that.
  - **`kernel/tests/first_batch_factorial.rs:1292-1294`** (at C) calls a figure "`cancel_acknowledged`-class". ADR-018 item 1 retires "acknowledged" from prose. This is OPEN-3 (c).
  - **`frontends/shell/e2e/regression.mjs:1830`** (at C) carries the same stale cite as :1760, inside a thrown assertion message. It is outside the lane.
  - **The watchdog label is set equal to the new test name.** Any other spelling would be a backticked narrative snake_case token in this form that names no `fn`. `scripts/plan/verify-test-claims.mjs` would read it as a test claim and fail it in the done commit.
  - **Two lines the impact read listed are not stale:** `frontends/shell/src/App.lateResult.test.tsx:19` and `frontends/shell/src/canvas/WorkingCanvas.test.ts:703` (at C). See §2.5.
- No measurement, no fixture and no 5 GB read, so the drive confound does not apply.

## §1. What this preregistration may and may not claim

- **May claim:** each rewritten comment and each name states a fact that its cite shows at B.
- **May not claim:**
  - any behaviour change: no code logic, no assertion, no assertion message and no string the app shows changes;
  - that a unit test pins the per-dataset `key` remount;
  - that `REOPEN'` has passed;
  - that ADR-023 binds anything, or is accepted;
  - that any test here scores the docs/08 cancellation budget;
  - any wire change;
  - an ADR amended;
  - a fixture's bytes changed.
- **ADRs cited, none amended:** 006 (OPEN-1 only), 013 (OPEN-3 only), 016, 018 and 023.

## §2. The change

### 2.0 Rules every rewrite follows

- **(a) Cites.** Rewritten text cites by item name (fn, const, test, file), by section, or by ADR number with its item. It never cites by a bare `path:line`.
- **(b) Tests.** A fact that no test pins is not called tested.
- **(c) ADR status.** Status words match the ADR's Status line. ADR-023 stays Proposed.
- **(d) ADR-018 vocabulary.** ADR-018's words are used only in ADR-018's sense. "acknowledged" appears only inside a quotation of docs/08.
- **(e) Quotes.** No new quotation marks unless the text is byte-copied. Existing quoted spans stay byte-identical.
- **(f) The old test name.** Every record of this piece names it only as `engine/tests/identity.rs::<name>`. Never written as a bare backticked token, it trips no test claim.
- **(g) Line width.** A rewrapped comment keeps its file's existing width (100 columns in every file here). The exception is a line that carries one test path whole, as `engine/src/identity.rs:254` already does.
- **(h) Order of commits.** The rename commit comes first and alone: `engine/tests/identity.rs:139-140`, the comment in `engine/tests/admission_instruments.rs` and `engine/src/identity.rs:254` (ruling item 3). No commit leaves a stale reference. The rest follow.
- **(i) Ledger cites.** Entries are cited by entry number, round or item, never by line (round 12 (a), round 14 (a′)).

### 2.1 Rows

**F2: the refusal-named test (the rename).**
- **Stale:**
  - `engine/tests/identity.rs:139` (name) and `:140` (watchdog label), at C. The test is `engine/tests/identity.rs::a_file_whose_key_is_not_called_id_is_refused_until_a_mapping_is_declared`.
  - The label is "a_foreign_key_column_needs_a_declaration".
- **Facts (at C):**
  - A plain open admits: `engine/tests/identity.rs:156`.
  - On the session tier: `:157-162`.
  - The candidate list is still reported: `:163-169`.
  - A declared mapping becomes the identity: `:172-187`.
  - The test's own record of the change: `:149-155`.
  - `IdSource::SessionOrdinal`: `engine/src/identity.rs:42-55`.
  - ADR-016 Accepted: `docs/adr/ADR-016-stable-feature-identity-admission.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:586a0671f5196957abbc53b0f26bfdd5a18d50a5f382801e30154b61c1cf143f`.
  - Amendment 1 Accepted: `docs/adr/ADR-016-stable-feature-identity-admission.md:180 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:8f94f2d6ca945be6f3d213b793e153c6724eb9a61a7a273271a4767684bac1e8`.
  - The assertion change, recorded without the name: `engine/ADMISSION-PREREGISTRATION.md:294-295 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:ba29794a4f34f4f80cf5f7f8bc09d2cf67bf446a1b132aa8932c4c90a2dda83e`.
- **The change:**
  - The fn is renamed `a_file_whose_key_is_not_called_id_admits_on_the_session_tier_until_a_mapping_is_declared`.
  - The `Watchdog::new` argument becomes that same name, following the full-name convention at `:79`.
  - The label is a test name element, printed only to stderr on a watchdog abort (`engine/tests/identity.rs:40-44 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:401b87dd068fc6d463c0cc8e358bf11497418fcc3d921b08fcef4a160bd4aa95`). It is no assertion and no string the app shows, and the node names it.
- **Unchanged:** every other line of the file, the comment at `:149-155` included.

**F2r: the two live references.** These move in the rename commit.
- **`engine/src/identity.rs:251-254 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:568ebc196f96189f89e427dd1a4f9f27cb6d2e8b6b7bcb4ca3c1974069a90d55`**, piece d's §2.3 pin. PR #209 left these lines unchanged at the same numbers.
  - Line 254's test name becomes the new name. Nothing else in that doc changes, unless OPEN-2 is answered yes.
  - This file is the ruling's one-file exception (Authority).
- **`engine/tests/admission_instruments.rs:65-68`** at C, a comment in `engine/tests/admission_instruments.rs::session_ordinal_reads_nothing_native_and_mapped_run_exactly_the_verification_scan`. The name at `:67` becomes the new name, rewrapped under 2.0 (g). The comment's claim is unchanged.
- **Every other occurrence** at C is in an append-only record under `state/`. The list is the impact read's "Append-only records that keep the old name", re-run at B. None is edited.

**D2: the renamed no-CRS generator's kept paragraph (comment only).**
- **Stale:** `kernel/tests/manual_walkthrough_fixtures.rs:554-563 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:d5be05a3cf5dbde4449515a9b5c1e5be21e493f7218fb72ae16becfbd4e2f8b7`, in the doc of `kernel/tests/manual_walkthrough_fixtures.rs::generate_the_no_crs_no_id_refusing_fixture` (`:566`).
- **Facts (at C):**
  - The same doc's first paragraph: `:546-552`.
  - The written file and its modes: `:567`, `:573-574`.
  - `stepBothNeeded`'s two halves: `frontends/shell/e2e/admission-remediation.mjs:509-518`.
  - The re-aim form's F-C row: `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:289`.
- **Says:**
  - It keeps the reason for `CrsMode::ExplicitNull`: an absent key would admit under the format default, and these metre-domain coordinates would contradict it (F-2). A plain open of this file therefore meets `engine.crs_undeclared`, which `stepBothNeeded`'s half (a) expects.
  - It removes three things:
    - "same filename";
    - the "both remediations needed" intent, which now belongs to `no-crs-string-id-refused.parquet`, as the first paragraph says;
    - "no change needed there".
- **Not:** the generator's name, which is decided in 2.4; the fixture's bytes.

**H4: skp_filter_cancellation's late-matching comment (comment only).**
- **Stale:** `kernel/tests/skp_filter_cancellation.rs:176 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:fa44a513250b7cbc0051430a5addf18a6ec2b54e7f8ebd7dd625812329dba9c7`, "True only for the last 100 of 200,000 ids".
- **Facts:** `FEATURES` is `2_000_000` (`:147`); the filter is `FEATURES - 100` (`:185`).
- **Says:** the human's words, "the last 100 of FEATURES ids" (directive line 14). No other count is written. `:177` is unchanged.

**F7: ADR-018 called Proposed.**
- **Stale:** `kernel/tests/first_batch_factorial.rs:1290-1291 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:ef573c3a9cf4976015cd29e9c08a7a9837c026408c38f6e81ab85615523a0730`.
- **Fact:** ADR-018 Accepted, `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:6d99101abbecf6521406ec3e88895a99a6436df05d0058fa3a8d025dc9bd4d1d`. Its item 2 scores the budget on `cancel_requested → cancel_observed` (`:56` at C).
- **Says:** the pair is named in ADR-018's vocabulary (Accepted), and item 2 scores the budget on it. The doc's other sentences stand, including that this is not a scored cell (`:1283-1287`).
- **Not:** a claim that this test scores docs/08.
- **Unchanged:** `:1292-1294`, unless OPEN-3 (c) is answered yes.

**F4: the no-attributes reason.**
- **Stale:** `renderer/tests/style_shell_agreement.rs:37-38 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:6d64e4ede755e31fda789376b5b09680968112fa0fdbd6437f1234d9e9885525`.
- **Facts (at C):**
  - `ViewportQueryRequest.columns` since `skp/0.6`: `protocol/skp/src/v0/commands.rs:441-447`. Piece e edits this file at :199-200 and is read at B.
  - The shell's corrected sentence and its type: `frontends/shell/src/style/document.ts:18-22`.
  - The shell sends `columns: null`: `frontends/shell/src/skp/client.ts:122`.
  - ADR-023 is Proposed (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3`).
  - The human's condition 1 is RULED 2026-09-14, question set D, item D2 (carried at ADR-023 `:144`).
- **Says:** both documents are literal-only because the shell's style document type has no `match` variant. `viewport_query` has carried a declared attribute projection since `skp/0.6`, and the shell requests none. The stub-schema conclusion stands as it is.
- **Not:** a wire restriction; ADR-023 as the ceiling, or as binding.

**F3a: App.test.ts's header.**
- **Stale:** `frontends/shell/src/App.test.ts:52-56` and `:58-65` at C.
- **Facts (at C):**
  - `App` is mounted in jsdom with `react-dom/client` and `act`: `frontends/shell/src/App.layout.test.tsx:4-18`, `:199`, and `frontends/shell/src/App.lateResult.test.tsx:9-21`.
  - `WorkingCanvas` is replaced by a stand-in, because deck.gl's `Deck` needs WebGL that jsdom lacks (`App.layout.test.tsx:11-14`).
  - The stand-in records mounts and unmounts per `dataset` prop value (`:136-141`).
  - R1 is at `:306`.
  - The `key` is at `App.tsx:1783`.
- **Says:**
  - This file tests `admitAndResetStaleUiState` directly, without rendering `App`.
  - `App` is mounted elsewhere in this package, with `WorkingCanvas` stood in.
  - The per-dataset `key` remount is still not pinned by a unit test. The stand-in keys its record on the `dataset` prop, so R1's counts hold with or without the `key`.
  - `REOPEN'` stays named as the live evidence class, with the existing caveat that this names what it checks, not that it passed.
- **Not:**
  - a claim that R1 tests the remount (A);
  - a claim that a `@testing-library/react` harness exists;
  - the `package.json` description parenthetical (`:54-55`), which says no such thing and is dropped.

**F3b: AdmissionPanel.test.ts.**
- **Stale:** `frontends/shell/src/admission/AdmissionPanel.test.ts:24-25 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:824d3526d2eb3e55e43c0b733642cbc013a6fdeffed67845188efeeb557ef390`.
- **Fact:** `AdmissionPanel` runs unmocked inside the mounted `App` (`App.layout.test.tsx:6-9`).
- **Says:** `formFamilyForCode`/`nextFormFamily` are tested here as pure functions, the same pattern as before. The false clause, "no harness in this package can mount", is removed.
- **Not:** a claim that a mount asserts the form families.
- **Shared with the CRS piece,** whose CF1 adds a test to this file (overlap, 2.6).

**F3c: CrsAssertionForm.test.ts.**
- **Stale:** `frontends/shell/src/admission/CrsAssertionForm.test.ts:13-14 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:5c86d780d4a755f0dca9c0de111ac4d82e7ed32f516399f09cab33fed574a08c`.
- **Says:** this file does not mount `CrsAssertionForm.tsx`, and P4 item D's contract is proven the two ways listed below it. The "no harness … can mount" clause and its cite to `AdmissionPanel.test.ts` are removed.

**F3d: WorkingCanvas.test.ts.**
- **Stale:** `frontends/shell/src/canvas/WorkingCanvas.test.ts:122-125 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:68f0fc29f0b6f79cefb3bc46c490a1a69e81d81d71f0f8a9057411d34fa01297`.
- **Says:** the real `WorkingCanvas` is not mounted in this package's tests because jsdom provides no WebGL context. Where `App` is mounted, it is stood in. The "no @testing-library/react-equivalent harness" reason is removed.

**F10a: string 6 marked as a draft (residencyStatus.test.ts).**
- **Stale:** `frontends/shell/src/residency/residencyStatus.test.ts:195 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:02adb1c2d9ab709e70fa74b580d1820ef2ff2b859d8dfb5e24d8f35aa4b46f43`, the `describe` title, which encloses one test (`:196`). Also `:189`'s "SIXTH new draft string".
- **Facts:** entry 45 (1), RULED 2026-09-06. The string's own doc says so (`frontends/shell/src/residency/residencyStatus.ts:423-428 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:798d09f9046968921e5078354ccaba76b9d5110433c4bfb1314ad761c75b27e1`), and the constant is at `:434-435`.
- **Says:** the title keeps "F2's settled-partial-within-budget string (entry 43" and replaces the draft parenthetical with the ruling (entry 45 (1), RULED 2026-09-06). `:189` calls it the sixth string. The `it` title and every assertion are unchanged.
- **This is a name change:** vitest's full name for the enclosed test changes (2.4, Q3).

**F10b: HOVER_REPICK_ON_PAN marked pending.**
- **Stale:**
  - `frontends/shell/src/canvas/pickResolution.test.ts:236-238`;
  - `frontends/shell/e2e/regression.mjs:1075-1079 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:08244b4a8d141cf410c7c5209e2d722a61d8ef20bf2a10710e17dd4ec0a6b31c`.
- **Facts:**
  - entry 75 (1), RULED 2026-09-14 (question set B, item B3): pan+zoom as built, behind the switch;
  - `frontends/shell/src/canvas/hoverRepickConstants.ts:36-41`, `:56` at C;
  - node `entry-75-hover-repick-defaults`, done.
- **Says:**
  - The value is ruled (entry 75 (1)).
  - In pickResolution.test.ts, the pure rule takes it as a parameter, so neither value is a dormant branch.
  - In regression.mjs, case (iv) is written against the built value. If the switch's value is ever changed, case (iv) must be re-aimed onto a camera change that both translates and zooms, and must not be deleted. The "if the human selects" clause and "PROPOSED PENDING THE HUMAN'S SIGHT" go.
- **Not:** any change to the `describe` title at `:239`.

**F10c: string 6 in regression.mjs's K7 header.**
- **Stale:** `frontends/shell/e2e/regression.mjs:1762-1763 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:b55870cbff0f43643e5aa63d1e04d35ee76d0dd7e6a2e67c67887d4d957ea048` (the draft marker). Also `:1760`'s cite `src/residency/residencyStatus.ts:429-430`. The constant is at `:434-435`, so the cite is stale in the same comment paragraph.
- **Says:**
  - The marker becomes the ruling (entry 45 (1)).
  - `:1760` names the constant `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` in `src/residency/residencyStatus.ts` without a line (2.0 (a)).
  - The copy-must-move instruction stays.
- **Not:** `:1765`'s literal or `:1830`'s thrown message. The latter is outside the lane (§5).

### 2.2 In place

Every row is current-state comment or name text, edited in place. No record under `state/` is edited.

### 2.3 Conditional rows (OPEN; applied only on the human's answer)

**OPEN-1: PR #209's architect gate 2, O-1.**
- **Stale:**
  - `kernel/src/lib.rs:21` and `kernel/README.md:276 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:b0dfe9ff4db6b31426b4db227421b4d5073ca0dd62b27bfee2bf6ea77c4967b1`, "derived output, it writes nothing, so no transaction boundary and no undo machinery is owed."
- **Facts:**
  - piece d's qualified sentence, `kernel/src/lib.rs:38-42 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:bc79aafe11f5df0eec28b824053c8a45e3a57660d5bcb79358ceb33852aedb48`, and `engine/README.md:93-96 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:4aa9c4bd196af401c167ae86c4b9541fc4ef2be0b538ce541689702c5c845801`;
  - the gate's O-1 (`state/consults/gates/2026-10-11-module-docs-stale-statements-gate2-architect.md:21-27 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:1332b728a2c19bdeed406829bd50c91361f0d38bb4df1496532c5a3885b3c318`).
- **Says:**
  - The stream writes no workspace state and no file of its own, so no transaction boundary and no undo machinery is owed.
  - The ADR-006 class (pure transformation) is unchanged.
  - DuckDB's spill is named by section, as piece d named it.
- **Not:** "writes nothing" unqualified; any ADR-006 class change.
- **This is a second exception to the test-files rule** (directive line 6), beyond the ruling's one-file exception.
- **`kernel/README.md` is in piece e:** this row's code waits for piece e's merge. This node already depends on piece e.

**OPEN-2: the third caller of `candidate_columns()`.**
- **Facts:**
  - `engine/tests/b1_projection_hostile_names.rs::a_native_id_with_u0000_opens_on_the_session_tier_with_no_nul_candidate` calls it (`engine/tests/b1_projection_hostile_names.rs:750-755 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:f34f8eae7e4889fd6d55974bc35adb27fd3835ec1589cbb81e8caeb79fb2b822`). The doc's list (F2r) names two callers.
  - The exemption needs the doc to name the test that calls it (round 5, item 4; `engine/ADMISSION-PREREGISTRATION.md:1476 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:835fe1f5d8447ad6c6c15e4934b91c3b89c50e271d36aa04f630d1ff1e5dce5a`).
- **Says:** the list names all three callers.
- **The ruling moves the reference only.** Completing the list is new work in a non-test file.

**OPEN-3: same-class lines the node does not name** (§2.5 gives the answer to Q4).
- **(a)** `engine/tests/admission_format_semantics.rs:504`, `:699`, `:762` and `:840` at C call ADR-013 Amendment 1 proposed. It is Accepted: `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:265 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:ee28435bc76cdf9eac83095883e0f74e433377f541c50ef043e9e5afb28ef55b`. Each cite of a draft's block-on-sight item follows piece d's §2.0 (f).
- **(b)** `engine/tests/session_identity.rs:116-118` and `:206-207` at C call ADR-016 Amendment 1 proposed. The same treatment applies.
- **(c) (A)** `kernel/tests/first_batch_factorial.rs:1292-1294 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:79aae361a3f9fae776afba9caaef9c75475f4835b94fcef8c602ed6e2cd7c006`: the "`cancel_acknowledged`-class" figure is renamed in ADR-018 item 1's instants, with no budget attached.

### 2.4 Decided by the governing text (the impact read's §6)

- **Q1.**
  - The new name and label are in F2.
  - The label is in scope:
    - the lane permits test names (directive line 19);
    - the label is not an assertion and not a string the app shows (`engine/tests/identity.rs:40-44`);
    - the node names it (`PLAN.yaml:4477`, "with its watchdog label").
- **Q2.** It is not decided by the governing text, so it is OPEN-2.
- **Q3.** The `describe` title at `residencyStatus.test.ts:195` is a test name element: vitest's full name of the enclosed test includes it. It is counted as a name change under the lane's test-names term, not as a comment.
- **Q5.** The generator's name stays.
  - The node gives D2 as "comment only" (`PLAN.yaml:4477`).
  - The file still refuses a plain open on CRS, so "refusing" is true.
  - The name is live in `frontends/shell/e2e/admission-remediation.mjs:37` and `:65` (`:65` is a command string), and in the verify-test-claims input `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:289 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:56fc536b26c2fa6a5149070d08b5a4eba3feb76a4912eb382d03d18769baeb85`.

### 2.5 Q4: same-class lines

- **In scope:** `regression.mjs:1760`. It sits in the comment paragraph whose marker the node names, in a file the node names (row F10c).
- **Not stale, so no row:**
  - `frontends/shell/src/App.lateResult.test.tsx:19`. "No `@testing-library/react`-equivalent harness" is literally true, and the same sentence names the `react-dom/client` pattern it uses.
  - `frontends/shell/src/canvas/WorkingCanvas.test.ts:703`. "this suite cannot mount the component" is true: no WebGL in jsdom.
- **OPEN-3:** the lines in files or of findings the node does not name.
- **Outside the lane whatever the answer** (an assertion message, or product code), recorded for routing:
  - `engine/tests/session_identity.rs:190-192` (an assertion message calling ADR-016 Amendment 1 proposed);
  - `frontends/shell/e2e/regression.mjs:1830` (a thrown message carrying the stale `:429-430` cite);
  - `frontends/shell/src/admission/crsAssertionState.ts:10`;
  - `frontends/shell/src/canvas/buildLayers.ts:31`.

### 2.6 Overlap (rule 00) and wait

- **Paths:** the 14 files of 2.1, this form and PLAN.yaml. Under OPEN-1, also `kernel/src/lib.rs` and `kernel/README.md`. Under OPEN-3, also `engine/tests/admission_format_semantics.rs` and `engine/tests/session_identity.rs`. Nothing is under protocol/ or scripts/plan.
- **Shared with the CRS piece** (in progress; its form's §2.6):
  - `frontends/shell/src/admission/AdmissionPanel.test.ts`;
  - `frontends/shell/e2e/regression.mjs`;
  - `kernel/tests/manual_walkthrough_fixtures.rs`.
  - **No code of this piece starts before the CRS piece merges.**
- **Shared with piece e** (in progress; protocol/skp/, `kernel/src/skp.rs`, `kernel/README.md`, `frontends/shell/src/skp/types.ts`):
  - none of the 14 files;
  - `kernel/README.md` under OPEN-1;
  - F4's fact cite into `protocol/skp/src/v0/commands.rs`, which piece e edits.
  - **No code of this piece starts before piece e merges.** This node depends on it, and the docs lane runs one piece at a time.
- **Proposed nodes on the same files** (not in progress): `first-batch-factorial-ignored-trace-tests`, `mp-prime-e2e-covered-fixture`.
- **Rule 00 is re-checked at dispatch** against both slots and every PR awaiting merge.
- **Owner's index:** no index line names a test or comment this piece changes (impact read). lead-data's owner's-index update is read before the final gate. A line it names that is outside §7 is a class 9 addition, declared before its code.

### 2.7 Portability

No OS-dependent feature is added or changed, so R3 does not apply.

## §3. Fixtures

None. No fixture is regenerated, and the D2 generator is `#[ignore]` and unchanged in code.

## §4. Tests, and the mutation per new test

- **No new test, and no assertion changes.**
- **One Rust rename:**
  - from `engine/tests/identity.rs::a_file_whose_key_is_not_called_id_is_refused_until_a_mapping_is_declared`
  - to `a_file_whose_key_is_not_called_id_admits_on_the_session_tier_until_a_mapping_is_declared`.
- **One vitest full name** changes, by F10a's `describe` title.
- **The rename's evidence, at H:**
  1. `cargo test -p spatial-engine --test identity -- --list`: at B it lists the old name and not the new one; at H the reverse.
  2. The renamed test passes at H, run by its exact name.
  3. A repository-wide search for the old name and the old label, asserted by script with its exit code checked, finds only the `state/` append-only records listed in F2r.
  4. A search for the new name finds exactly:
     - `engine/tests/identity.rs` (fn and label);
     - `engine/tests/admission_instruments.rs`;
     - `engine/src/identity.rs`;
     - this form.
  5. The caller grep of `.claude/agents/reviewer.md:24` resolves each name in `engine/src/identity.rs`'s caller list to a test that calls `candidate_columns()`.
  6. `verify-test-claims` exits 0 at H and in the done commit, where this form's §4 claim of the new name is binding.
- **No mutation is owed.** No record of this piece calls any run, a `verify-mutation` run included, an observation of a mutation.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predictions:**
  - **E1.** Every changed line is a comment line, except three:
    - `engine/tests/identity.rs`'s fn line;
    - its `Watchdog::new` line;
    - `residencyStatus.test.ts`'s `describe` line.
    Each of the three is one line removed and one added.
  - **E2.** Between B and H:
    - `cargo test -p spatial-engine -- --list` differs by exactly the one name;
    - `-p spatial-kernel` and `-p spatial-renderer` are identical;
    - `npx vitest list src/residency/residencyStatus.test.ts` differs by exactly the one enclosed test's full name.
  - **E3.** These pass at H:
    - `cargo test -p spatial-engine --test identity --test admission_instruments`;
    - `cargo test -p spatial-renderer --test style_shell_agreement`;
    - `cargo test -p spatial-kernel --tests --no-run` exits 0. The comment-only kernel tests are compiled, not run.
  - **E4.** `cargo doc --no-deps -p spatial-engine` warnings at H are a subset of those at B. `cargo fmt --all -- --check` exits 0.
  - **E5.** `npx vitest run` over the six touched shell test files passes, `npm run typecheck` exits 0, and `node --check e2e/regression.mjs` exits 0.
  - **E6.** At H, each named with its commit:
    - `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify.mjs` exit 0;
    - `queue.mjs --check` and `site.mjs --check` report current;
    - the `node --test` scripts suites exit 0.
  - **E7.** §4's evidence items 1 to 6 hold.
  - **E8.** PR CI is green.
- **Declared unchanged:**
  - every code token, assertion, assertion message and literal, except E1's three lines;
  - every test name but the two in §4;
  - the generator's name;
  - all ADR files, docs/, protocol/**, scripts/**, KNOWN-LIMITATIONS.md and every non-test file except `engine/src/identity.rs:254` (and the OPEN rows only on their answers);
  - `engine/tests/identity.rs:149-155`;
  - `kernel/tests/first_batch_factorial.rs:1292-1294` (unless OPEN-3 (c));
  - every record under `state/`.
- **Invalidators (stop and report):**
  - a fact cited here changed at B, as opposed to a moved line;
  - a rewrite that would need a code, assertion or literal change;
  - a live reference to the old name at B outside F2r's set;
  - a fact with no cite.
- **Falsified if:** any rewritten sentence is shown untrue at B, or the rename leaves a live reference.

## §6. Instruments

Assertions only (E1 to E8). No measurement.

## §7. Declared values and ceilings

- **Counting.** Count with `git diff --numstat B...H -- <path>`, insertions plus deletions. B and H are named in the PR body. The form and PLAN.yaml are outside the line count and inside the file count.
- **Per-file ceilings:**
  - engine/tests/identity.rs 4
  - engine/src/identity.rs 2
  - engine/tests/admission_instruments.rs 8
  - kernel/tests/manual_walkthrough_fixtures.rs 20
  - kernel/tests/skp_filter_cancellation.rs 4
  - kernel/tests/first_batch_factorial.rs 4
  - renderer/tests/style_shell_agreement.rs 8
  - frontends/shell/src/App.test.ts 34
  - frontends/shell/src/admission/AdmissionPanel.test.ts 8
  - frontends/shell/src/admission/CrsAssertionForm.test.ts 6
  - frontends/shell/src/canvas/WorkingCanvas.test.ts 8
  - frontends/shell/src/residency/residencyStatus.test.ts 6
  - frontends/shell/src/canvas/pickResolution.test.ts 6
  - frontends/shell/e2e/regression.mjs 18
- **Totals:** at most 140 lines and 16 files.
- **Conditional additions,** applied only on the answer:
  - OPEN-1: kernel/src/lib.rs 4 and kernel/README.md 4 (+2 files);
  - OPEN-2: engine/src/identity.rs +4;
  - OPEN-3 (a): engine/tests/admission_format_semantics.rs 16 (+1 file);
  - OPEN-3 (b): engine/tests/session_identity.rs 12 (+1 file);
  - OPEN-3 (c): kernel/tests/first_batch_factorial.rs +6.
  - With all of them: at most 186 lines and 20 files.
- **Budget:** 60 minutes (`PLAN.yaml:4473 @ 19b01c40b1a1b9f00931c07998295c4271027c7a sha256:9269a017dd1abf63dbe1f02f7fdc96be80b9d19e3258dccef5a0189a31e4a514`).
- **No constant is added.**
- **An overrun is class 8,** and this section is never edited.

## §8. Block-on-sight

1. A changed non-comment line other than E1's three.
2. Any assertion, assertion message, literal other than the two named, or string the app shows changes.
3. A path outside §7 changes, anything under scripts/plan changes, or a conditional row is applied before its answer.
4. A rewritten sentence claims more than its cite shows. That includes:
   - the per-dataset `key` remount called unit-tested (A);
   - `REOPEN'` called passed;
   - ADR-023 called binding or accepted;
   - a test called scoring docs/08's budget.
5. A status word in a touched line does not match the ADR's Status line.
6. ADR-018 vocabulary is used outside its sense in a touched line.
7. The old name or old label survives in a live file at H, or a commit leaves the rename's references split.
8. The generator is renamed, or any fixture's bytes change.
9. A new bare `path:line` in a rewritten comment, a pin split across lines, or a pin at a branch commit.
10. A quotation not byte-copied, a byte changed inside an existing quoted span, or H4's comment carrying a count other than the human's "the last 100 of FEATURES ids".
11. A record under `state/` is edited.
12. Code before the CRS piece and piece e have merged.
13. A §7 overrun not recorded as class 8, or §7 edited.
14. A scope addition not recorded as class 9 before its code.
15. A record calls a `verify-mutation` run an observation of a mutation.

## §9. Gates

- **Architect (full gating).** Checks:
  - ADR status words and ADR-018 vocabulary;
  - ADR-006 classing under OPEN-1 only;
  - each Says against its facts, F3a first;
  - then §8, one item at a time.
- **Reviewer.** The full diff, E1 to E8, every rewritten sentence against its cite, and the rename's reference set by script.
- **Verdicts follow product-first section 2.** A sentence's truth is Correctness; E1 to E8 are Evidence. Documentation findings are fixed before the merge, with no re-gate.
- **Briefs** carry THE MACHINE paragraph for E2 to E5 and no other build rule: `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 426ec39fc0b3be7da96555d2d4d489e34a075475 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1`.
- **Operator:** none. No walkthrough row and no sight.
- **KNOWN-LIMITATIONS:** no item is added or edited.
- **The PR body asks for a merge commit.**

## §10. Amendments

Opens empty, append-only, classes 1 to 9. A yes to any OPEN item is recorded as class 9, on the human's reading at `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:11` (at C). A no is recorded as class 5.

### Amendment 1 — the human's rulings on OPEN-1 to OPEN-3 (class 9, as §10 records a yes)

*Written by the custodian on the human's ruling, before any code. References only.*

1. **The ruling** is the human's item 2 of `state/directives/2026-10-11-open-11-a-piece-f-opens-ported-notices-required.md`.
2. **OPEN-1, yes:** §2.3's OPEN-1 row applies. Both places take piece d's qualified sentence as their model, with no change of ADR-006 class. It is a second exception to the test-files rule, and the row waits for piece e's merge.
3. **OPEN-2, yes:** the caller list names all three callers.
4. **OPEN-3, yes to (a), (b) and (c):** comments only.
5. **§7:** the conditional additions apply, at most 186 lines and 20 files. §7 is not edited.
6. **The two routing items** become the proposed nodes `stale-assertion-messages-and-product-comments` and `app-key-remount-unit-test`. Neither is in this piece.
7. **Generation:** the node goes to 2.
8. **Superseded index:** §2.3's "applied only on the human's answer" and §11's OPEN-1 to OPEN-3 → items 2 to 4.

Nothing above is edited.

### Amendment 2 — the re-sweep at the base, main 76fa319a (class 3)

*Written before any code, by the architect on the custodian's brief. References only. B is main 76fa319afc5596bd89b34890cdbe178a047bf91f. Where a cite at C and B's tree differ, B's tree is authoritative (§0). Every pin below is at B. Read the last amendment first.*

1. **Moved lines (class 3; no claim changes).**
   - **D2.** The CRS piece's comment above it, at `kernel/tests/manual_walkthrough_fixtures.rs:184-187 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:be1a5ea85490fa124d0c5c00175238d8f8da6754487f8a34cc9d1cc4c9f1b080`, moved the file up by one line.
     - §2.1 D2's stale paragraph, `:554-563` at C → `kernel/tests/manual_walkthrough_fixtures.rs:553-562 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:d5be05a3cf5dbde4449515a9b5c1e5be21e493f7218fb72ae16becfbd4e2f8b7`.
     - The generator, `:566` at C → `kernel/tests/manual_walkthrough_fixtures.rs:565 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:5de406cc71318ca1ae050c68522c13cddb8cf672b742132046253fd6e775a687`.
     - The first paragraph, `:546-552` at C → `kernel/tests/manual_walkthrough_fixtures.rs:545-551 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:1794d07dbba5b801e903b33f38e503f7979567f074998de6f5a72cad125feb26`.
     - The written file, `:567` at C → `kernel/tests/manual_walkthrough_fixtures.rs:566 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:7cd21a5f4745254471bda1b51810afb5a82994218f6ea635c34303c3e55e4c2c`.
     - The modes, `:573-574` at C → `kernel/tests/manual_walkthrough_fixtures.rs:572-573 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:12d52d37e63be0eeadecc0a4b3081cc25e298c760d048273a9c5955c954a003f`.
     - Check: the paragraph still carries the three clauses D2 removes, and the ExplicitNull reason D2 keeps. `stepBothNeeded`'s half (a) still expects `engine.crs_undeclared` (`frontends/shell/e2e/admission-remediation.mjs:537-538 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:974b50710c56a5361c76c0d6f2e5d31f3fded7000a255dcbb427cd9ac16612c9`). The paragraph is still stale.
   - **F3a.** The `key`, `App.tsx:1783` at C → `frontends/shell/src/App.tsx:2047 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:474be9d286cea85dc96571ca3d33aa4cffb7f8fbffb275278eea954163c8b00c`.
     - Check: that line is the `key` prop of the `WorkingCanvas` element.
     - Every mounted-`App` suite at B records mounts and unmounts in an effect on the `dataset` prop: `frontends/shell/src/App.layout.test.tsx:136-141 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:a25f21655e8ee2f0ead6d3efb6513ee56f41d44dab3dabfb9b97ee9ad056e501`, `frontends/shell/src/App.selection.test.tsx:166-171 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:a25f21655e8ee2f0ead6d3efb6513ee56f41d44dab3dabfb9b97ee9ad056e501` and `frontends/shell/src/App.workspace.test.tsx:101-106 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:a25f21655e8ee2f0ead6d3efb6513ee56f41d44dab3dabfb9b97ee9ad056e501`.
     - So no unit test pins the remount, and F3a's Says stands.

2. **Unchanged at B: the same line numbers, still stale, and the facts hold.**

| Row | Stale at B | Clause check at B |
|---|---|---|
| F2 | `engine/tests/identity.rs:139-140 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:58b4de71b1e0abd288665341e660ed9ed8b530f78257d1f99b942aa6274f1999` | The name says the file is refused. The test admits it on the session tier and still reports the candidate list (`engine/tests/identity.rs:156-169 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:2d2e7d2f2130eafb460bb4c4b7f31bfb1ed8923dc9a220f8cc2a91350bfbbe35`). The label is printed only to stderr, on an abort (`engine/tests/identity.rs:40-44 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:401b87dd068fc6d463c0cc8e358bf11497418fcc3d921b08fcef4a160bd4aa95`). ADR-016 is Accepted (`docs/adr/ADR-016-stable-feature-identity-admission.md:3 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:586a0671f5196957abbc53b0f26bfdd5a18d50a5f382801e30154b61c1cf143f`). |
| F2r | `engine/src/identity.rs:251-254 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:568ebc196f96189f89e427dd1a4f9f27cb6d2e8b6b7bcb4ca3c1974069a90d55`; `engine/tests/admission_instruments.rs:65-68 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:fc1f61ea311eb62cafba808b1ae3ed9b8fb49a7ea62c847b8cdfceb4cac01983` | Both still name the F2 test by its current name. Item 7 lists the live set at B. |
| H4 | `kernel/tests/skp_filter_cancellation.rs:176 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:fa44a513250b7cbc0051430a5addf18a6ec2b54e7f8ebd7dd625812329dba9c7` | The comment counts 200,000 ids. `FEATURES` is 2,000,000 (`kernel/tests/skp_filter_cancellation.rs:147 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:ecbed92e08234a69bf714040e583651ddd1c8260f51f6d8e139a58f6e6868834`), and the filter is `FEATURES - 100` (`kernel/tests/skp_filter_cancellation.rs:185 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:214c66816df3b3d411259db89df548381b5f0f68f2881ed311796809fc4dd4d0`). |
| F7 | `kernel/tests/first_batch_factorial.rs:1290-1291 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:ef573c3a9cf4976015cd29e9c08a7a9837c026408c38f6e81ab85615523a0730` | The comment calls ADR-018 Proposed. ADR-018 is Accepted (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:6d99101abbecf6521406ec3e88895a99a6436df05d0058fa3a8d025dc9bd4d1d`), and its item 2 scores the budget on the pair (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:56 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:5370657640398787a21985af28d46d65b40cb6bf1fff8100c22d1376f65bd34e`). |
| F4 | `renderer/tests/style_shell_agreement.rs:37-38 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:6d64e4ede755e31fda789376b5b09680968112fa0fdbd6437f1234d9e9885525` | The request has carried `columns` since `skp/0.6` (`protocol/skp/src/v0/commands.rs:441-447 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:daf138e64d3bf060516a3e7e6120efbf4cec6f11072f40aa9013fc2d04d8d0c6`; piece e did not move these lines). The shell sends `columns: null` (`frontends/shell/src/skp/client.ts:122 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:a662558efa81e3d5979bbe536a6eda9748410a635e4c0aaff807a69a9fa7685e`). The style type has no `match` variant (`frontends/shell/src/style/document.ts:18-22 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:d8b7d7e56fb24a3965cedc29ccdfc655e3ce7a499187ab206e5e96e91da387f1`). ADR-023 is Proposed (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:fef6a76bfcfe66caee1dedc8c67b7ee5d2f3df134d3f3623b2082cc64398dfd5`), and condition 1 is at `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:144 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:18b6453d6e8e8120764205e9d89730c9cf88420e33656caca15d839577dd2a72`. |
| F3a | `frontends/shell/src/App.test.ts:52-56 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:5ce89c4fdcd7761c3983981cdd36ac1200cacb0e7de1b036f7d549c47bdffd1f`; `frontends/shell/src/App.test.ts:58-65 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:9a99ac1f927476db709974f7fba474c1aa27a21eb81be74ca3be7e8a4552ae6e` | `App` is mounted with `react-dom/client` and `act` (`frontends/shell/src/App.layout.test.tsx:4-18 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:1fc9a33372d2366662f0050de93941b4b64fb1b7f5acf93312956e2f29e09099`; `frontends/shell/src/App.lateResult.test.tsx:9-21 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:dd917b7bbcdff31904fdf66d08096b3869f13c20fe760eea1c84620891218b5b`). R1 is at `frontends/shell/src/App.layout.test.tsx:306 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:f68ab532ae56afe7c5f411f960b58fc375be044b2d67c5710fdf34c0d72c1ecb`. The `key` is in item 1. |
| F3b | `frontends/shell/src/admission/AdmissionPanel.test.ts:24-25 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:824d3526d2eb3e55e43c0b733642cbc013a6fdeffed67845188efeeb557ef390` | `AdmissionPanel` runs unmocked inside the mounted `App` (`frontends/shell/src/App.layout.test.tsx:6-9 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:de2895e79974a8fa215542fd42fd138deb584962182321b997363625f6e6e53f`). The CRS piece's CF1 test landed below the span (`frontends/shell/src/admission/AdmissionPanel.test.ts:38-40 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:1f8d788a8d40e7a3a7197cc6f093db5c0355de13c08aca4a50f4dfa49b8804d6`). |
| F3c | `frontends/shell/src/admission/CrsAssertionForm.test.ts:13-14 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:5c86d780d4a755f0dca9c0de111ac4d82e7ed32f516399f09cab33fed574a08c` | The same no-harness clause and its cite to F3b's file are still there. The two proofs are still listed below them (`frontends/shell/src/admission/CrsAssertionForm.test.ts:17-24 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:8fcd4b47cafd81a14fe85e832afe9dbd85eca80669e72d587fd95a19fffc04a3`). |
| F10a | `frontends/shell/src/residency/residencyStatus.test.ts:195 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:02adb1c2d9ab709e70fa74b580d1820ef2ff2b859d8dfb5e24d8f35aa4b46f43`; `frontends/shell/src/residency/residencyStatus.test.ts:189 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:d1324741c209b56c83458b4e5c21f4736d48206429a4426f7b4f051a3874e3b7` | String 6 is ruled (`frontends/shell/src/residency/residencyStatus.ts:423-428 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:798d09f9046968921e5078354ccaba76b9d5110433c4bfb1314ad761c75b27e1`), and its constant is at `frontends/shell/src/residency/residencyStatus.ts:434-435 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:4f65e3ed03efdfab3bb48952bf24aa44e7aa4fc452b001bb2578c75faaca1001`. |
| F10b | `frontends/shell/src/canvas/pickResolution.test.ts:236-238 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:14e49db0a990f039657a2bd390290792a0198f5cdfce2de89646a5907a0ac4f5`; `frontends/shell/e2e/regression.mjs:1075-1079 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:08244b4a8d141cf410c7c5209e2d722a61d8ef20bf2a10710e17dd4ec0a6b31c` | The value is ruled (`frontends/shell/src/canvas/hoverRepickConstants.ts:36-41 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:b710edccbf33b20ccc1fb205059ffa0f97923d99403f3c24f412e3dd3c51c0bf`) and is `true` (`frontends/shell/src/canvas/hoverRepickConstants.ts:56 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:02eed5101a678a893934595dd0743088688610e1ddc9cb2a2101d76e7c6bce18`). The node is done (`PLAN.yaml:1193 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:36e513654ac36ac3634c789e5c1bbca6a9010ba4a27caa1cff13ad6a0ace2ffe`). The untouched `describe` title is at `frontends/shell/src/canvas/pickResolution.test.ts:239 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:540ecef8a656fc52f102f5b13809308442be2a0b890de67d6e03daf21907031b`. |
| F10c | `frontends/shell/e2e/regression.mjs:1760 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:3471228042c08fbbe36026221c8108716c6923cb0a04721e5641328044c50f55`; `frontends/shell/e2e/regression.mjs:1762-1763 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:b55870cbff0f43643e5aa63d1e04d35ee76d0dd7e6a2e67c67887d4d957ea048` | The cite still names lines 429-430, while the constant is at the F10a pin. The draft marker is as in F10a. The literal and the thrown message stay untouched (`frontends/shell/e2e/regression.mjs:1765 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:aaa38f05a4c76dab0b6439fe4889338347d433c5dfaf3e14e7def7d621f533bb`; `frontends/shell/e2e/regression.mjs:1830 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:5fe852fc47aa90fb894f9bdfc516dc45207915d5f5f0fc1c36ad4399c459a08b`). |
| OPEN-1 | `kernel/src/lib.rs:21 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:7b2f1df6e3dd183fc7485b8a66b820b0d550a3ce1a16e6bae7cac25f84722829`; `kernel/README.md:276 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:b0dfe9ff4db6b31426b4db227421b4d5073ca0dd62b27bfee2bf6ea77c4967b1` | Both still say, unqualified, that the stream writes nothing. Piece d's qualified sentences are at `kernel/src/lib.rs:38-42 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:bc79aafe11f5df0eec28b824053c8a45e3a57660d5bcb79358ceb33852aedb48` and `engine/README.md:93-96 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:4aa9c4bd196af401c167ae86c4b9541fc4ef2be0b538ce541689702c5c845801`. Piece e merged and left the README line at the same number. |
| OPEN-2 | `engine/src/identity.rs:251-254 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:568ebc196f96189f89e427dd1a4f9f27cb6d2e8b6b7bcb4ca3c1974069a90d55` | The list names two callers. A search of the tree at B finds exactly three test callers of `candidate_columns()` (`engine/tests/session_identity.rs:202 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:29d3ab35c4501a6a9f4ef0006cb080d89d9c74dafd5a9cbfaca3a4fffaa61c27`; `engine/tests/identity.rs:166 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:f495cd17736458e8e332e7533df015c9a4cf6792e3b3ea0beb30b362365901e2`; `engine/tests/b1_projection_hostile_names.rs:750-755 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:f34f8eae7e4889fd6d55974bc35adb27fd3835ec1589cbb81e8caeb79fb2b822`) and no product caller. |
| OPEN-3 (a) | `engine/tests/admission_format_semantics.rs:504 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:b2e1aca870b1178d3cd5a59aac68dd3625ffe2f36790199c34476ea5cb8d981a`; `engine/tests/admission_format_semantics.rs:699 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:4655eeef90cc8f277c64af6600490549d212062c0d15953c18c0d528f14070a8`; `engine/tests/admission_format_semantics.rs:762 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:eb108685f81931d90d52b240c316784d9ee845de1168e9295f23f39926528c65`; `engine/tests/admission_format_semantics.rs:840 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:60717f6bc40eb6247b6f18be712d23808dacc11c10cea13fa9098ad84414a3c9` | Each calls ADR-013 Amendment 1 proposed. It is Accepted (`docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:265 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:ee28435bc76cdf9eac83095883e0f74e433377f541c50ef043e9e5afb28ef55b`). |
| OPEN-3 (b) | `engine/tests/session_identity.rs:116-118 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:f3ddbba9f162d7d05e5bb8a190fa9762030e26c5cb725d23c09bfbdd130e6779`; `engine/tests/session_identity.rs:206-207 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:e233e3e2750deb3db6608e87c1f396f674a120899b7e7b5600c27138e7e255b9` | Each calls ADR-016 Amendment 1 proposed. It is Accepted (`docs/adr/ADR-016-stable-feature-identity-admission.md:180 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:8f94f2d6ca945be6f3d213b793e153c6724eb9a61a7a273271a4767684bac1e8`). |
| OPEN-3 (c) | `kernel/tests/first_batch_factorial.rs:1292-1294 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:79aae361a3f9fae776afba9caaef9c75475f4835b94fcef8c602ed6e2cd7c006` | The retired word's figure is still there. ADR-018 item 1's instants are at `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:41-54 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:29ac9572ebf32035c7572c7c14fd821e2c0d4143682e1c3f08a6a54deccc9bc3`. |

3. **A changed fact: F3d is held (§5, first invalidator).**
   - The stale span has not changed and is still stale: `frontends/shell/src/canvas/WorkingCanvas.test.ts:122-125 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:68f0fc29f0b6f79cefb3bc46c490a1a69e81d81d71f0f8a9057411d34fa01297`.
   - F3d's Says is untrue at B. Since C, the real `WorkingCanvas` has been mounted in jsdom with only deck's `Deck` class stood in: `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx:4-15 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:105c217efe617c718e1f771227f6ccf2d55a086d6efc02ec2cb60340146d4783`, `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx:33-55 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:21da32080d390f7cad366988f63b46df9b56d4e73673fc4272e26e31aa62f70f` and `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx:107-108 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:26f27b3bd57fe07f840de710b14d69f8a31cd917cd929d9dea07b496b23a8aae`.
   - No code of F3d starts until an appended row replaces its Says. The same fact removes the reason §2.5 gives for its second not-stale line (item 4).

4. **Same class, but not taken in by §2.5's rule.** These get no row here and are listed for a later piece.
   - `frontends/shell/src/residency/residencyStatus.test.ts:73 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:3985e721e5defb1864adbe4f6e5f15ce6a3e74926c2ed6d462bb889ae237001a`, `frontends/shell/src/residency/residencyStatus.test.ts:75 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:6b4999e20af97cb9eb0ac6de91033150f66c88835be57ff5b0e67e7e94ee283b`, `frontends/shell/src/residency/residencyStatus.test.ts:176 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:29d2b92665a302a768a85c4b709bbca95b2acd04df9b9dc6b6623dd9523b333f` and `frontends/shell/src/residency/residencyStatus.test.ts:178 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:253f64338a71fce79a445a206a7df66c9fca6dcbf3f215a302ffa8f7a84f5660`:
     - they call strings 1, 2 and 5 drafts;
     - those strings are ruled (`frontends/shell/src/residency/residencyStatus.ts:353-355 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:c3955e20b7ccb50849af0d9360b6650640226295f2e7b42e7178499edf00ca29`; `frontends/shell/src/residency/residencyStatus.ts:415-416 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:86fe9558f30009b71e0316f93f71519a0f0750a224570d61387233fa495f462b`);
     - the node names string 6 only;
     - two of the four lines are `describe` titles, and E2 admits only one name change.
   - `frontends/shell/src/canvas/WorkingCanvas.test.ts:702-706 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:cf676bf8de72d88171e936bafdf102ec15055e5da4dd7776d038c78c7a57d064`:
     - it carries the cannot-mount reason that item 3 removes;
     - it carries two line cites into `WorkingCanvas.tsx` that no longer point at the release listener, which is now at `frontends/shell/src/canvas/WorkingCanvas.tsx:1942-1952 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:c649a4b46f703275535f8059a68102e5addd1de6feb9120e883af3ca2eb01f2e`;
     - it is outside the paragraph the node names.
   - Outside the files the node names: `frontends/shell/src/residency/residencyArm.test.ts:77-81 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:472ddbbc8b0d1bdadfe22ee76570a5d5f506e48177a8ff77a1d90ab21e207b80` and `frontends/shell/src/residency/residencyArm.test.ts:89-90 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:af173fa879d3a5d1ce7295a974363644c2bd2ee1da0a20eb3ffbafc2c68ab2e8` say that `App` cannot be rendered in this suite.

5. **Gone, or no longer stale:** none. Item 3 records the one changed fact.
   - `frontends/shell/src/App.lateResult.test.tsx:19 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:da8d4da9bfd39aa9cc2874ea2a9ac194fbf4c748a064077d9c90dccf9bad2064` is still not stale.
   - §2.5's four routing lines have not changed at B, and they stay with node `stale-assertion-messages-and-product-comments`.

6. **§7 at B.**
   - Every per-file ceiling holds for the rows as they stand, with one exception. It was found at the re-sweep and is not a moved line.
   - **`engine/tests/identity.rs`, ceiling 4.**
     - On one line, the new label's `Watchdog::new` call is 120 columns.
     - The tree has no `rustfmt.toml` or `.rustfmt.toml` at the root or in engine/. It formats such a call over three lines (`engine/tests/slice.rs:419-421 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:31c1bfb1e28856a5e7d62ce65a028ff7577f1f3df020cd7faabeb96277cb9275`), and E4 requires the code to be fmt-clean.
     - So the file's count is predicted to be 6, and E1's one-removed, one-added does not hold for that line.
     - §7 and §5 are not edited. At H the count is recorded as class 8 and E1 as class 2. The line is never compressed, and the label is never shortened, to fit.
   - F3d's 8 holds for replacement words of at most four lines.
   - Nothing at B predicts more than 186 lines or 20 files.

7. **§4 items 3 and 4 at B.** These were found at the re-sweep; nothing is edited.
   - **Item 3.** Outside `state/`, the old name is live at B only in the files of F2 and F2r and in this form (§2.1 F2 and §4, as 2.0 (f) permits). As written, item 3 cannot hold at H.
   - **Item 4.** The new name is already at `PLAN.yaml:4477 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:f56434389c38cacac3bf74476a9a4df34f81f100bf34a515fe65d9b5ce86a0e9`, `CUSTODIAN-QUEUE.json:61 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:8cd0783d6a3b624476af1211e0da6d1d97a4b01ba7b3cbecb8b9f2b46bcaf72a`, `site/data/plan.json:7195 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:a1b8492bd97a61221ccb1221195731f6115c9a23e30d12e5094403b69de16f18`, and in `state/consults/2026-10-11-stale-test-names-and-comments-architect-draft.md` (found by a search of the tree at B). This piece touches none of these files. Item 4's set of exactly four files cannot hold at H.

8. **Rule 00 at dispatch.**
   - This piece's paths are §2.6's 14 files, this form, `PLAN.yaml` and Amendment 1's four files. They are disjoint from PR #218's seven paths and PR #219's eleven, as the custodian lists them.
   - Neither PR touches `protocol/`, and neither does this piece: F4 only reads `protocol/skp/src/v0/commands.rs`.
   - F3a's fact cites read `src/App.tsx` and the mounted-`App` suites, and #219 edits `src/App.tsx` and `src/App.selection.test.tsx`. These are read-only crossings, not overlaps.

9. **Waits.**
   - The CRS piece is done (`PLAN.yaml:4825 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:36e513654ac36ac3634c789e5c1bbca6a9010ba4a27caa1cff13ad6a0ace2ffe`), and so is piece e (`PLAN.yaml:4412 @ 76fa319afc5596bd89b34890cdbe178a047bf91f sha256:36e513654ac36ac3634c789e5c1bbca6a9010ba4a27caa1cff13ad6a0ace2ffe`). So §2.6's two waits, §8 item 12 and OPEN-1's wait are met at B.
   - Only F3d waits, on item 3's appended row. Every other row may start at B.

10. **Superseded index:**
    - §2.1 D2's cites → item 1;
    - §2.1 F3a's `App.tsx` cite → item 1;
    - §2.1 F3d's Says → held, item 3;
    - §2.5's reason for its second not-stale line → items 3 and 4;
    - the waits in §2.3 OPEN-1 and §2.6 → item 9.

11. **The custodian's hash check,** by script before commit: every pin above carries its full revision and its sha256 over the whole cited lines. Each of item 2's stale spans, and F3d's span in item 3, hashes the same at C (19b01c40) and at B at the same line numbers (26 spans), so their text is unchanged; D2's paragraph at B (553-562) hashes the same as its C pin (554-563, d5be05a3…), so item 1's move is a pure move.
12. **F3d, a pre-code correction of a planned claim (class 1, the custodian's).** F3d's Says is replaced. The comment's text after the quoted span on line 122, which stays byte for byte, says what the architect's words below say, in the file's comment style: the pure seam with no mount here, the one place the real `WorkingCanvas` is mounted with deck's `Deck` stood in for want of WebGL, and that file driving no style change. Not the human's wording; comments are Documentation (the 2026-10-11 direction, item 2d). F3d's §7 ceiling (8) holds for at most four comment lines. The words, as the re-sweep's notes give them (their clause check is there):

    ```text
    one re-render path." `applyStyleChange` is the pure seam this drives, with no mount. The real `WorkingCanvas` is mounted only in `WorkingCanvas.wiring.test.tsx`, with deck's `Deck` class stood in because jsdom provides no WebGL context, and that file drives no style change.
    ```

13. **§4 items 3 and 4, corrected before code (class 1, the custodian's, on the re-sweep's item 7):**
    - item 3's search for the old name and the old label finds only the `state/` records and this form;
    - item 4's search for the new name finds exactly the four files it lists, plus `PLAN.yaml`, `CUSTODIAN-QUEUE.json`, `site/data/plan.json` and `state/consults/2026-10-11-stale-test-names-and-comments-architect-draft.md`, which carry it at B.
    - Item 6's `engine/tests/identity.rs` count (predicted 6 against its 4) is recorded at H as class 8, and E1 as class 2; the line is never compressed, nor the label shortened, to fit.
14. **The start:** F3d's code may start under item 12; every row may start at B.

Nothing above is edited.
