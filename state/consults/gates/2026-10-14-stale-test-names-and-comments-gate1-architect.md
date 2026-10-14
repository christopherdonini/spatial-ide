Reviewed: PR #220 at f73eb8038b632055732adfa85c41469ad77f9dbb (base a5666a49); cut/stale-test-names-and-comments @ f73eb8038b632055732adfa85c41469ad77f9dbb
Verdict: FAIL. There is one Correctness finding, C-1, and it is only the wording of one sentence. Code Correctness and Evidence are otherwise closed. The sentence is not the human's wording: it is a test comment the architect drafted in the form and the worker wrote. So under AUTONOMY §31 (d) the worker applies the words in C-1, with no re-gate, and the PR body lists them. Once those words are applied, nothing at this gate blocks. Four Documentation findings, D-1 to D-4, must be fixed before the merge, with no re-gate.

## Correctness

**C-1. F3a: one clause is untrue for one of the four mounted-`App` suites.** Location: `frontends/shell/src/App.test.ts:59-61`.
- The comment says the stand-in `WorkingCanvas` in the mounted-`App` suites records its mounts and unmounts per `dataset` prop value.
- That holds for three suites: `App.layout.test.tsx:136-141`, `App.selection.test.tsx:166-171` and `App.workspace.test.tsx:101-106`.
- It does not hold for `App.lateResult.test.tsx:324-360`. That stand-in records props by dataset (`:331`) and records no mounts or unmounts. The same comment names that file as a mounted-`App` suite (`:54`).
- The conclusion still holds: no unit test pins the `key` remount. Only the stated reason overclaims (§8 item 4).
- The same omission is in Amendment 2 item 1, where the list of every mounted-`App` suite leaves out `App.lateResult.test.tsx` (see D-4).

**Fix: exact replacement words.** Replace lines 59-61; line 58 stays. Every line is within 100 columns. The diff for the file goes from 17 lines to 19, against a ceiling of 34.
```text
// per dataset, is **not pinned by a unit test**: every mounted-`App` suite replaces
// `WorkingCanvas` with a stand-in that keys what it records on the `dataset` prop
// (`App.layout.test.tsx`, `App.selection.test.tsx` and `App.workspace.test.tsx` record mounts and
// unmounts in an effect on it; `App.lateResult.test.tsx` records props by it), so what they
// record holds with or without the `key`.
```

**Clause check, against the code at the head:**
- **Every mounted-`App` suite replaces `WorkingCanvas` with a stand-in.**
  - Each of the four suites calls `vi.mock("./canvas/WorkingCanvas", ...)`: `App.layout.test.tsx:130`, `App.lateResult.test.tsx:324`, `App.selection.test.tsx:160` and `App.workspace.test.tsx:95`.
  - These are the only test files that render `App`. I searched every `src/**/*.test.*` file for `createRoot` and for imports from `./App`. The other ten `createRoot` files do not import `App`, and the `.ts` files that import from `./App` use named exports only.
- **Three suites record mounts and unmounts in an effect on the `dataset` prop:** `App.layout.test.tsx:136-141`, `App.selection.test.tsx:166-171` and `App.workspace.test.tsx:101-106`, each with `useEffect(..., [props.dataset])`.
- **`App.lateResult.test.tsx` records props by the `dataset` prop:** `:331`, `workingCanvasMockState.propsByDataset.set(props.dataset, props)`.
- **What they record holds with or without the `key`.**
  - Without the `key`, a change of the `dataset` prop runs the effect's cleanup and then the effect, so the pushes are the same as an unmount followed by a mount.
  - A `Map.set` on each render is the same either way.
- **Not pinned by a unit test.**
  - It follows from the clauses above.
  - `App.test.ts:403-424` swaps a ref and does not render `App`.
  - The `key` itself is at `App.tsx:2047`, as `key={admitted.dataset}`.

## Evidence

No blocking finding. Notes for gate 2:
- **§4 item 5.** The worker did not run the caller grep in `.claude/agents/reviewer.md:24`, so E7's statement that items 1 to 6 hold is the worker's own search for item 5. I resolved each name in `engine/src/identity.rs:253-255` by reading. There are no product callers: `.candidate_columns()` appears in `.rs` files only under `engine/tests/`. The three callers:
  - `session_identity.rs`: fn at `:181`, call at `:205`;
  - `identity.rs`: fn at `:139`, call at `:168`;
  - `b1_projection_hostile_names.rs`: fn at `:733`, calls at `:751` and `:755`.

  The reviewer runs the grep itself.
- **§8 item 7, commit order.** I have no shell, so I could not check that 9dbb4cc3 holds the rename alone and first (`git show --stat`). The reviewer checks it.
- **`engine/tests/session_identity.rs:118-121`.**
  - The existing quoted span is byte-identical to the base, including its line break.
  - The comment now attributes it to the draft at 433413a. The reviewer resolves the span against `git show 433413a:docs/adr/PROPOSED-amendment-to-ADR-016-identity-tier-model.md`, block-on-sight 5.
- **E3 to E6 and E8.** These rest on the worker's runs and the reviewer's re-run. PR CI (E8) was not observed here.

## Documentation (fix before the merge; no re-gate)

**D-1. `kernel/src/lib.rs:22` is 103 columns (§2.0 (g)).**
- Rewrap lines 21-22 to the three lines below. The words are unchanged.
- The file's count becomes 4, which is the 4 allowed under OPEN-1.

```text
//!     derived output; the stream writes no workspace state and no file of its own, so no
//!     transaction boundary and no undo machinery is owed (DuckDB's spill is named below, by
//!     section).
```

**D-2. `kernel/README.md:277` is about 113 columns (§2.0 (g)).**
- Rewrap lines 276-277 to the three lines below. The words are unchanged.
- The file's count becomes 4, which is the 4 allowed.

```text
    derived output; the stream writes no workspace state and no file of its own, so no
    transaction boundary and no undo machinery is owed (DuckDB's spill:
    `kernel/CANCELLATION-AND-TRACING.md` §7).
```

**D-3. `engine/src/identity.rs:253` has no comma after its closing backtick.**
- The three-item list reads as the first name, then the second name followed by a comma, then and the third, with no comma after the first.
- Add a comma after the backtick at the end of `:253`. The file's count becomes 5, against 6.

**D-4. Record: the closing amendment (references only, round 12 (d)) carries two short items.**
- **(a)** Amendment 2 item 1's list of every mounted-`App` suite leaves out `App.lateResult.test.tsx`, which records props by dataset (`App.lateResult.test.tsx:331` at f73eb803). The item's conclusion stands. This is one correction sentence, which does not restate the earlier claim.
- **(b)** The worker report's line cites are bare where they name branch test text. Examples are its rows for H4, F7, OPEN-3 (c) and F3a to F10c. Round 25 item 2 requires the commit id. One sentence fixes this: every line cite in `state/consults/2026-10-14-stale-test-names-and-comments-worker-report.md` is at f73eb8038b632055732adfa85c41469ad77f9dbb.

## The §9 checks

**ADR status words.** Each status word in a touched line matches its source:
- ADR-018 is called Accepted at `first_batch_factorial.rs:1291` (ADR-018:3).
- ADR-013 Amendment 1 is called Accepted at `admission_format_semantics.rs:504`, `:700` and `:841` (ADR-013:265).
- ADR-016 Amendment 1 is called Accepted at `session_identity.rs:117` and `:210` (ADR-016:180).
- ADR-023 is no longer named in `style_shell_agreement.rs:37-39`, so nothing calls it binding.

**ADR-018 vocabulary.**
- The word acknowledged survives only inside the docs/08 quotation at `first_batch_factorial.rs:1290` (§2.0 (d)).
- **OPEN-3 (c), the `cancel_quiescent` choice, is confirmed** (`first_batch_factorial.rs:1293`). Clause check:
  - ADR-018 item 1 (ADR-018:52-54) retires the word and requires a write-up to say `observed` or `quiescent`. `observed` is the scored pair's end, which is the other figure in this doc. That leaves `quiescent`.
  - ADR-018 item 2 (ADR-018:59) reports `cancel_quiescent` beside the scored pair with no budget attached. The sentence says exactly that.
  - ADR-018's Consequences (ADR-018:125-127) class the fifth section's measurement as `cancel_requested → cancel_quiescent`. The doc says the fifth section's numbers were this second kind.
  - The figure's real end is named, as the consumer's terminal return (`first_batch_factorial.rs:1342-1350`). With the -class suffix, the sentence does not claim that the drained stream equals ADR-018's full definition of quiescent. Item 1's rule, that a figure names its pair, is met.

**ADR-006, OPEN-1 only.** Both places keep the stream a pure transformation and owe no transaction boundary and no undo machinery. The places are `kernel/src/lib.rs:20-22` and `kernel/README.md:275-277`.
- The qualification, no workspace state and no file of its own, follows piece d's sentence at `kernel/src/lib.rs:40-43` and `engine/README.md:93-96`.
- The spill is named by section, and §7 of `kernel/CANCELLATION-AND-TRACING.md` (`:178`, `:208`) covers it.
- No class change. Deviation (c) is confirmed.

**Each Says against its facts, F3a first.**
- **F3a:** C-1 above. The rest holds:
  - `App` is mounted with `react-dom/client` and `act`, with `WorkingCanvas` stood in for the WebGL reason (`App.layout.test.tsx:11-18`, `App.lateResult.test.tsx:17-21`);
  - the file tests `admitAndResetStaleUiState` without rendering `App`;
  - the `REOPEN'` caveat is unchanged.
- **F2:** the new name is true.
  - A plain open admits on the session tier and the candidate list is reported (`engine/tests/identity.rs:158-171`).
  - A declared mapping becomes the identity (`:175-189`).
  - The label equals the name (`:140-142`), as the form requires.
- **F2r:** `engine/src/identity.rs:254` and `engine/tests/admission_instruments.rs:65-69` are true. The path-whole line is allowed by §2.0 (g).
- **D2:** `kernel/tests/manual_walkthrough_fixtures.rs:553-560` is true against the `stepBothNeeded` (a) check at `admission-remediation.mjs:537-538`.
  - The three clauses are gone and the ExplicitNull reason is kept.
  - The generator's name and code are unchanged (`:563-577`).
- **H4:** `kernel/tests/skp_filter_cancellation.rs:176` is the human's count, against `:147` and `:185`.
- **F7:** true, and it claims no scoring by this test.
- **F4:** `renderer/tests/style_shell_agreement.rs:37-39` is true, against `protocol/skp/src/v0/commands.rs:441-447`, `frontends/shell/src/style/document.ts:18-22` and `frontends/shell/src/skp/client.ts:122`.
- **F3b:** `AdmissionPanel.test.ts:24-27` is true. `App.layout.test.tsx:11-13` mocks no `AdmissionPanel`.
- **F3c:** `CrsAssertionForm.test.ts:13-15` is true.
- **F3d:** `WorkingCanvas.test.ts:123-125` matches Amendment 2 item 12's words.
  - The only real mount is in `WorkingCanvas.wiring.test.tsx:108`, which drives no style change: `style` is `DEFAULT_STYLE_STATE` throughout (`:105`).
- **F10a:** `residencyStatus.test.ts:189` and `:195` are true against `residencyStatus.ts:423-428` and the ledger's entry 45 RULED block.
- **F10b:** `pickResolution.test.ts:236-238` and `regression.mjs:1075-1079` are true against `hoverRepickConstants.ts:36-41` and `:56`.
- **F10c:** `regression.mjs:1760` and `:1763` are true. The constant is at `residencyStatus.ts:434-435`.
- **OPEN-2:** true, apart from the D-3 punctuation.
- **OPEN-3 (a):** true. Amendment 1 item 2 is the identifier-not-a-source rule and item 4 is the display sentence (ADR-013:276-292).
- **OPEN-3 (b):** true. Amendment 1 item 1 has the corpus-verified bullet (ADR-016:199-200) and the bare-word bullet (ADR-016:208).

## §8, item by item

1. **Pass.** Only E1's three lines are non-comment lines. The label line is one removed and three added, recorded as class 2 in Amendment 3 (a) and predicted before code in Amendment 2 item 6. The README lines are document prose under OPEN-1.
2. **Pass.** No assertion, assertion message, app string or other literal changed. Only the label and the `describe` title changed.
3. **Pass.** The 18 paths are the 14 files plus Amendment 1's four. Nothing under scripts/plan changed. The OPEN rows came after Amendment 1.
4. **Fail, C-1** (wording only). Every other rewritten sentence holds.
5. **Pass.**
6. **Pass.** `cancel_quiescent` is confirmed.
7. **Pass**, but commit order is for the reviewer (Evidence notes). Outside `state/`, the old name and label appear only in the form.
8. **Pass.**
9. **Pass.** No new bare `path:line` in a rewritten comment. 433413a is a historical commit named in words, not a pin, and deviation (d) is accepted.
10. **Pass.** No new quotation marks. Existing quoted spans are byte-identical. H4 carries the human's count.
11. **Pass.**
12. **Pass.** Amendment 2 item 9 records both waits as met at 76fa319a. The base a5666a49 is later.
13. **Pass.** Amendment 3 item 1 records `engine/tests/identity.rs` at 6 against 4 as class 8, and §7 is unedited.
14. **Pass.** OPEN-1 to OPEN-3 are recorded as class 9 in Amendment 1, before code.
15. **Pass.** No record calls any run an observation of a mutation.

No ADR decision is missing, so there is no skeleton.
