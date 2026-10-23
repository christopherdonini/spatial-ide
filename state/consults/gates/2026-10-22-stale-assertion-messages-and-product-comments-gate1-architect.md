Reviewed: PR #243 at b24e5281aef6da8b744de3ca840e9ffc10503cb6, gate 1, architect
Verdict: PASS WITH NOTES

`cut/stale-assertion-messages-and-product-comments @ b24e5281aef6da8b744de3ca840e9ffc10503cb6`. I read the head in the worktree `C:/dev/wt/samc` and the form on main. I have no shell, so I recomputed no hash and ran no numstat. The diff, §4 by script, and E1 to E6 are the reviewer's.

**A process fact before the findings.** The worktree changed while I was reading it. My first reads of the four files showed the head text:
- `engine/tests/session_identity.rs:193-194`
- `frontends/shell/src/admission/crsAssertionState.ts:9-11`
- `frontends/shell/src/canvas/buildLayers.ts:31-35`
- `frontends/shell/e2e/regression.mjs:100-102`, `:1143-1146` and `:1830`

Later reads of the same spans showed B's text in all four files. One example: `engine/tests/session_identity.rs:193` read "It is the PROPOSED ADR-016". So someone checked out B's four files into the worktree during the gate, probably for the B-side list comparison. Every judgement below rests on the head reads I took before that change. The custodian should confirm the worktree is back at H, with porcelain clean, before anything else runs there.

## C (Correctness)

None. Each rewritten clause is true at B and claims no more than its cite shows. The detail is under check 1.

## E (Evidence)

None of mine. E1 to E6 are the reviewer's.

From the spans alone, I count 5, 14, 6 and 9 lines for P1 to P4, 34 in all. That agrees with the worker report's E6 and stays within §7: 6, 15, 8 and 10, and 39 in all. I did not run the numstat.

## D (Documentation): must fix before the merge, no re-gate

**D1. `frontends/shell/STALE-ASSERTION-MESSAGES-AND-PRODUCT-COMMENTS-PREREGISTRATION.md:141`, §2.1 C1's clause check.**
- The defect: the check says that `crsAssertionState.test.ts:4-13` "imports only vitest and the state module". That is untrue. `frontends/shell/src/admission/crsAssertionState.test.ts:6` also imports the type `CrsCatalogEntry` from `../skp/crsCatalog`.
- The product clause it supports still holds. "with no mount" is true: the file has no match for `react|render|mount`.
- These are the architect's words, not the human's. The form is append-only, so the fix is an appended class 3 correction.
- Replacement words (the hash is to be computed by script):
  > Correction (class 3): §2.1 C1's clause check says `crsAssertionState.test.ts:4-13` imports only vitest and the state module; it also imports the type `CrsCatalogEntry` (`frontends/shell/src/admission/crsAssertionState.test.ts:6` @ 39182e74e204dbac2f6212afe980f93f59e8f8a2 sha256:<by script>). The clause "with no mount" is unchanged: the file imports no React or DOM module.
- Clause check of these words:
  - "also imports the type `CrsCatalogEntry`": line 6 reads `import type { CrsCatalogEntry } from "../skp/crsCatalog";`.
  - "imports no React or DOM module": the imports at lines 4 to 13 are vitest, the crsCatalog type and `./crsAssertionState`, and a search for `react|render|mount` in the file finds nothing.
  - The file is not in the diff. The worker's C-to-B name-only list outside `state/` excludes it, so line 6 is the same at 39182e74.

**For the proposed node `stale-lines-outside-the-four-files` (`PLAN.yaml:4531`). This is not a finding on #243.**
- The same class of stale line exists beyond OPEN-3's list. `frontends/shell/src/App.test.ts:1079` says "this package carries no DOM/WebGL harness to render `<App>`", but `App` is mounted (`frontends/shell/src/App.test.ts:54-55`).
- The kin lines are `frontends/shell/src/residency/residencyStatus.ts:153`, `frontends/shell/src/canvas/WorkingCanvas.tsx:593` and `frontends/shell/src/canvas/WorkingCanvas.test.ts:59`.
- The custodian may add them to that node's list. It is outside this piece's four files, so it is not this piece's scope (§8 item 3).

## What I checked

**1. §2.1's clauses at H, against the files they rest on (unchanged C to B, per the worker's step 1).**

M1 (`engine/tests/session_identity.rs:193-194`):
- "the third what-was-checked value, naming the basis": `docs/adr/ADR-016-stable-feature-identity-admission.md:207-208` gives `by-construction-within-generation`. That is the compared value at `engine/tests/session_identity.rs:192`, and `:191-192` are unchanged.
- "Amendment 1 item 1 (Accepted) adds it": the heading at ADR-016:180 ends "— Accepted", and the acceptance note is at ADR-016:238.
- "the two §6 values settled at the ADR's acceptance": the SETTLED block of 2026-09-02 at ADR-016:150-157 lists `"verified-at-open-full-file"` and `"declared-not-verified"`.
- True. No overclaim.

M2 (`frontends/shell/e2e/regression.mjs:1830`):
- `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` is the constant at `frontends/shell/src/residency/residencyStatus.ts:434-435`, returned at `:462` on the settled partial branch.
- `K7_SETTLED_PARTIAL_TEXT` at `regression.mjs:1765` matches `residencyStatus.ts:435` on visual comparison. The worker's script found them equal, 94 bytes.
- The naming form follows `regression.mjs:2277`, and "verbatim" is kept.
- True.

C1 (`frontends/shell/src/admission/crsAssertionState.ts:9-11`; line 8 unchanged):
- "unit-tested as plain functions, with no mount": both named test files import the state functions, and neither has a React, render or mount import. `CrsAssertionForm.test.ts:13` states that it does not mount the component.
- "`App.test.ts` tests `App.tsx`'s `admitAndResetStaleUiState` and `nextScanState`": imported at `App.test.ts:16` and `:29`, called at `:159` and `:559` onward, defined at `App.tsx:215` and `:475`.
- "without rendering `App`": `App.test.ts:52`, and the file has no react-dom import.
- No claim that `CrsAssertionForm` is never mounted.
- "This package's own convention" names a practice, not an exclusive one. `AdmissionPanel.tsx:187-192` uses the same wording.
- The A2 dependants stay true: `identityDeclarationState.ts:6-9` and `AdmissionPanel.tsx:189-191`.

B1 (`frontends/shell/src/canvas/buildLayers.ts:31-35`):
- "literal-only … `StyleDocumentV0` has no `match` variant": `style/document.ts:105-118`, and `toStyleDocument` at `:123` is its only producer.
- The draw parameters reach the canvas only through `resolveDrawParameters(state)`: `style/document.ts:148-151`, `WorkingCanvas.tsx:704` and `:947`.
- "since `skp/0.6`": `protocol/skp/src/v0/commands.rs:442-448`.
- "the shell requests none": `skp/client.ts:122-124` sends `columns: null`, and a search of non-test files under `frontends/shell/src` finds no other setter.
- "passes straight through unchanged": `buildLayers.ts:422`, `:447` and `:470`.
- ADR-023 is no longer named. No claim that the shell cannot request columns.
- True.

**2. §2.3 under OPEN-2's yes, which is Amendment 1 item 2 and is present at B in the worktree's copy of the form.**
- `regression.mjs:100-102`:
  - the `FormatDefaultContradicted` Display arm is at `engine/src/error.rs:333`;
  - `format!("at level ...")` is inside `convict_or_record` (`engine/src/dataset.rs:1332`, `:1340-1341`);
  - it is fed by `sanity_check`'s `geo.bbox` branch (`dataset.rs:1193`, `:1227-1233`);
  - the quoted span is byte-identical to main's B text at `regression.mjs:101`.
- `regression.mjs:1143`: `fitToExtent` is at `WorkingCanvas.tsx:1376`, with one `setProps` camera write at `:1396`.
- `regression.mjs:1145-1146`:
  - the "P3i-b B4" paragraph is in the S4 doc comment (`residency-harness.mjs:2008`, `:2018`, `:2027-2033`) of `runFieldSequenceIdentityCheck` (`:2053`);
  - `"P3i-b B4"` is kept byte for byte;
  - line 1145 is at most 100 columns by my count.
- All three are true, and no claim changes.

**3. Status words (§8 item 5).**
- "ADR-016 Amendment 1 … (Accepted)" agrees with ADR-016's Status line (`:3`, "Accepted, 2026-09-02") and with the amendment's heading and acceptance note (`:180`, `:238`).
- ADR-023 (`:3`, "Proposed … binds nothing") is no longer named in the rewritten text.
- No other status word in `session_identity.rs` changed: the remaining hits are `:117` and `:210`, "Accepted", and `:119`, a file name.

**4. §8.**
1. Pass. Every other changed line is a comment: `//` at P2 :100-102, ` *` at P2 :1143-1146, and ` *` in P3 and P4.
2. Pass. `session_identity.rs:191-192` are unchanged, no test name is touched, and no app string is touched.
3. Pass. Four paths, all within §7. Nothing under `scripts/plan/` or `protocol/`. OPEN-2 was answered in Amendment 1, which is at B.
4. Pass, per check 1.
5. Pass, per check 3.
6. Pass. `"constant attribute"`, `format!("at level ...")` and `"P3i-b B4"` are kept, and no new quotation marks were added.
7. Pass. The rewritten text has no bare `path:line`, and the form's pins are at 39182e74 on main.
8. Pass. 34 of 39, each file within its ceiling. §7 was not edited, since the form is not in the diff.
9. Pass. The class 9 for OPEN-2 is recorded in Amendment 1, which comes before the code.
10. Pass. The worker report says no mutation was run.
11. Pass. No file under `state/` is in the diff.
12. Pass, though the brief's premise has moved on. Milestone 4's form is now committed (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`; `state/CUT-STATE.md:185`, 13:50Z, after this piece's code). Node `b1-shell-half` is `ready` (`PLAN.yaml:2358`), and there is no milestone 4 worktree under `C:/dev/wt` and no code. **Rule (00) going forward:** milestone 4 shares P4 and would make B1's facts untrue (§2.5). It must not start code on `buildLayers.ts` until #243 merges.
