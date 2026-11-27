Reviewed: the branch cut/identity-declaration-route-for-session-tier at 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9, in the read checkout D:/wt/read-1127b, with the form and the rulings at main 9e4c849ff8b11faea36c4adc43d2b2c880fdf6a0 in D:/wt/read-1127c, read only. This is the custodian's filing note, 2026-11-27: the architect's build gate, THE READ PART (the form's Amendment 11; ADV-2026-11-27-08 item 3), node:identity-declaration-route-for-session-tier@build-gate-architect-read-part. A read part gives no verdict and takes no gate-log row; the run part, after the e2e series, does. Below the rule, the architect's report as handed back (saved by Write with the harness's indent removed; 10497 bytes, sha256 a4e7c3847a36a03bfb7359671a0e566c93dd2525a896316d1b81da515e399bbf), byte for byte.

---

READ PART — cut/identity-declaration-route-for-session-tier @ 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9. I read the form, the governance and the rulings at main 9e4c849ff8b11faea36c4adc43d2b2c880fdf6a0. I read the code at the head named above.

This is the read part only and carries no verdict word. I found no Correctness, Evidence or Architecture finding. There are three Documentation findings (must-fix before the merge, comment-only, no code change) and three items handed to others. Unless marked verbatim, everything below is paraphrase. Line cites are into the head 09dfe6b1, not main.

## Results against the §10 architect list

1. **OPEN-1 (A), OPEN-2 and OPEN-4 (a) are built as ruled.**
   - The offer is `identityDeclarationOffer(state, datasetOnMap)`, at `frontends/shell/src/admission/AdmissionPanel.tsx` 169-199.
   - It renders as a `details` block beside the Cancel and liveness rows (565-601).
   - Its submit runs `admitPath` with the offer's own path and `declarationOptions(offer, identity)`.
   - `App.tsx` changes by one prop: `datasetOnMap` comes from App's own `admitted` (860, 2287).

2. **ADR-016, Amendment 2 and the two Notes.**
   - **The code matches.** On the session tier alone, `kernel/src/skp.rs` 2052-2058 sets `candidate_columns` from the engine accessor. On a native or mapped identity the member is present and null. This matches Decisions 1 and 2.
   - **The wire matches.** `protocol/skp/src/v0/commands.rs` 222-231 adds `Option<Vec<String>>` under the struct's existing `deny_unknown_fields`, and the literal moves to skp/0.15. That is a new version string, not a tolerant reader (SKP-V0.md §13).
   - **One function feeds both carriers.** The refusal and `describe` take the list from the same function, as Decision 4 and Note 2026-11-26 Decision 4 require.
   - **The candidate rule is unchanged apart from the width widening the Note rules.** The comma exclusion and the not-addressable exclusion stay (`engine/src/identity.rs` 304; `engine/src/dataset.rs` 2019-2025).
   - **Byte equality.** By my read, the appended ADR text equals ADV-2026-11-23-26 item 1, ADV-2026-11-23-27 item 4 and ADV-2026-11-26-12 item 3 byte for byte. The advisor's merge check is the byte comparison.

3. **docs/01, never block the canvas: holds.**
   - The declaration runs through `runAdmitPath`. Its `opening` state keeps `resume` (288-293).
   - Cancel goes back to the earlier `admitted` state (316-317), so the dataset on the map stays.
   - The Cancel control (565-578) and the liveness row (580-585) render during the declared open.
   - The whole-file check is the existing streaming, cancellable scan in `admit_identity`: `engine/src/dataset.rs` 2045-2073, with cancel at 2071-2073.

4. **ADR-006: the class of open is unchanged.** A declaration is a fresh open, so it is a workspace mutation. `admit` in `workspaceState.ts` 127-161 ends the view generation, drops the clauses and resets the filter and `fillMatch`. A refused run returns before `onAdmitted`, so nothing is replaced.

5. **ADR-004 Amendment 4: holds.**
   - The member is product data on a control-plane reply, not instrument surface.
   - MCP carries no bulk data: the list is a column-name list on `describe`.
   - Data-plane framing is untouched.

6. **Caller rule: holds.**
   - `DatasetIdentity::candidate_columns` now has its product caller in `describe_dataset`. Its doc (`engine/src/identity.rs` 243-255) drops the instrument exemption and names the tests as its other callers.
   - `identityDeclarationOffer` has product callers: the render and `runAdmitPath`'s hold.
   - `declarationOptions` has a product caller: the offer's `onSubmit`.
   - `is_admitted_integer_type` is private (317-331). Its two callers are the candidate filter (304) and `admit_column_type`'s guarded arm (349).
   - No `pub` item is added in the engine.

7. **Seam, end to end from the real shape.** Three tests cover it:
   - K-1 and K-2 (`kernel/tests/skp_admission_remediation.rs`) drive the real `describe` through the kernel.
   - T-1 (`fixtures.test.ts`) pins the shell's key set against the fixture shape. `assertExactKeys` gains `candidate_columns`, which moves with the wire as it should.
   - E-1 (`e2e/admission-remediation.mjs`, `stepDeclareSession`) drives the shipped app. E-1 has not run (worker report, finding 4). It and M-E1 are the run part's.

## §9, item by item

| Item | Result |
|---|---|
| 1 | No. All 44 files are in Scope. |
| 2 | No. `App.tsx` changes by one prop. The engine changes only the predicate, the filter, the arm and docs. |
| 3, 4, 5 | No. |
| 6 | No. A missing `Option` reading as `None` is an existing convention. |
| 7 | No sleeps. E-1 uses `waitForCondition` polls with a 120 s bound inside `runStep` 180_000. |
| 8 | No. The only edited literals are the two allowed `admitted` literals in `AdmissionPanel.test.ts` and the `fixtures.test.ts` key set that moves with the wire. |
| 9 | Not resolved by this read. It is left to the reviewer against the worker's P0 and mutation record (`state/consults/2026-11-26-identity-declaration-route-for-session-tier-build-worker-report.md`). |
| 10 | Recorded before code. Class 8 is in Amendment 8; class 9 is in Amendments 2, 5 and 9. |
| 11 | No. Amendment 7 item 3's line numbers are historical. No action. |
| 12 | Not applicable. |
| 13 to 17 | No. |
| 18 | No. Rows I4 and I8 each change only inside their quote, under ADV-2026-11-26-28 item 3. |

## Class 8: where the lines above Amendment 5 item 12's prediction sit

The custodian's count is 1042 lines over 44 files. Amendment 5 item 12 predicted about 908 over 44, so about 134 lines sit above it. The figures below are my reading of the diff; the closing amendment computes them.

- **`engine/src/identity.rs`, about 50-68 lines:** W-2, the predicate's doc and the field and function docs brought current.
- **`kernel/tests/skp_admission_remediation.rs`, about 30 lines:** K-2.
- **Literal mechanics, about 35 lines:** the test doc in the Rust fixtures, the conformance README paragraph, and the SKP-V0.md §1, §8 and §10-12 literal lines.
- **Words, about 30 lines:** Part AG with its result log, the e2e README section, and source comments.

None of these is a scope addition. Each sits in a file and a purpose Scope already names, so no class 9 is owed.

## Ruled strings, clause by clause, at the head with the words commit in

No ruled-string clause is untrue, so nothing goes to the advisor. I propose no words for any ruled string.

- **D1, D2 and D3** equal ADV-2026-11-23-26 item 2 with the mark removed. Each stands whole on one line.
  - D2 "opens this file again": true (the offer's own path).
  - D2 "the filter and the selection are cleared and Colour by ends; the rest of the style is kept": true (`admit` 127-161).
  - D2 "stays open as it is now": true (the refused run returns before `onAdmitted`; Cancel goes back to `prev.resume`).
  - D3's scan clauses: true against `dataset.rs`.
    - integer-only, by the type check at 2028;
    - whole-file, by the scan at 2045-2069;
    - repeat at 2088-2097 and negative at 2076-2086, refused only after the scan.
  - D3 "a project saved afterwards records it": true. `DatasetRef::linked` writes the mapped column (`kernel/src/dataset_ref.rs` 216-219), and the recorded column is checked at reopen (338).
- **D4** (`KNOWN-LIMITATIONS.md` 70): true. The saver keys its saved set by dataset handle (`saveProject.ts` 104, 114, 130), and a declaration opens a new handle.
  - "beside the Open buttons" is a layout claim. It is the run part's sight, in AG1.
- **Legend and hint** equal ADV-2026-11-26-04 item 4. The hint's clause "checked when the file is opened" is true: `admit_identity` refuses a missing name (1998-2003) and a name nothing can address (2019-2025).
- **Row I8's quote** equals D3. **Part AG's four spans and the mark** equal ADV-2026-11-26-28 items 4 and 5. There is no `placeholder` left in the diff.

## Documentation findings (must-fix before the merge)

None of these is a ruled string, all are comment-only, and none changes code. Each old span below is byte-copied verbatim from a Grep at the head, and each occurs once in its file.

**D-a.** `frontends/shell/src/admission/AdmissionPanel.tsx` 181 names a drop route, and the shell has none.
- Old (verbatim): `a later admission by another route (a reopen, a drop) has`
- New: `a later admission by another route (a reopen) has`

**D-b.** `frontends/shell/src/admission/IdentityDeclarationForm.tsx` 49, 59 and 61-62 place the checks in `open_inner`. They are in `admit_identity` (`dataset.rs` 1961), which `open_inner` calls at 565. This is low severity.
- Old (verbatim): `the identity block of `open_inner`); a column`
  - New: `the identity block of `admit_identity`); a column`
- Old (verbatim): `the addressability check of `open_inner`)`
  - New: `the addressability check of `admit_identity`)`
- Old (verbatim): `` `open_inner`): a missing column ``
  - New: `` `admit_identity`): a missing column ``

**D-c.** `KNOWN-LIMITATIONS.md` 71: ADV-2026-11-23-26 item 2 scopes the human's text to the paragraph D4 sits in. The comment says the item, which overreaches if the item holds any other sentence that is not the human's, such as the class 3 symbol cites the worker reports.
- Old (verbatim): `every other sentence of the item is the human's and is untouched.`
- New: `every other sentence of the paragraph is the human's and is untouched.`

## Not resolved by this read (handed on)

- **E-1, M-E1 and the AG1 layout sight** are the run part's.
- **§9 item 9** is the reviewer's.
- **The partitioned refusal's wire-fixture message** (class 9, ADV-2026-11-23-27 item 2) should equal the engine's `Display` byte for byte. I did not compare the two; the reviewer or the merge check compares them.
- **Two worker-report items are outside architecture:** the skp/0.14 file count, which ADV-2026-11-26-28 item 8 notes, and the `-s` sign-off email (worker finding 3). They are for the custodian.

## ADR skeleton

None needed. No decision is missing.

**Files**
- D:/wt/read-1127b/frontends/shell/src/admission/AdmissionPanel.tsx
- D:/wt/read-1127b/frontends/shell/src/admission/IdentityDeclarationForm.tsx
- D:/wt/read-1127b/KNOWN-LIMITATIONS.md
- D:/wt/read-1127b/engine/src/identity.rs
- D:/wt/read-1127b/engine/src/dataset.rs
- D:/wt/read-1127b/kernel/src/skp.rs
- D:/wt/read-1127b/protocol/skp/src/v0/commands.rs
- D:/wt/read-1127c/governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md
