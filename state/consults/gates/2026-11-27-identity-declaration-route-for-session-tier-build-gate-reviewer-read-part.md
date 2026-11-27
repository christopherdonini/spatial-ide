Reviewed: the branch cut/identity-declaration-route-for-session-tier at 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9, with its suites run in D:/wt/idr. This is the custodian's filing note, 2026-11-27: the reviewer's build gate, THE READ PART (the form's Amendment 11; ADV-2026-11-27-08 item 3), node:identity-declaration-route-for-session-tier@build-gate-reviewer-read-part; its run facts from its completion notices only (ADV-2026-11-26-02), 130 tool uses; the report reached the custodian on the third asking, as a hand-back message. A read part gives no verdict and takes no gate-log row. Its C-1, D-d, D-g and D-i are ruled in ADV-2026-11-27-15 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-15-the-identity-routes-four-places-d2-loses-its-whole-file-clause-row-i8s-note-by-one-span-class-9-the-known-limitations-comment-one-span-d-b-and-d-d-both-apply.md`). Its check 5 left the kernel and spatial-skp suites' log unread; the custodian read that log in the reviewer's folder: the rc file reads "kernel-skp rc=0", and its 68 result lines sum, by awk, to 588 passed, 0 failed and 48 ignored. Below the rule, the report as handed back (saved by Write with the harness's indent removed; 14922 bytes, sha256 d8f0712c0f967184e33db91489a6ec50801373565524b6be9eab900f23d8aed4); paths under the user's profile or the scratch folder stand as <profile> or <scratch>, as handed back or as saved.

---

READ PART — cut/identity-declaration-route-for-session-tier @ 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9 (no verdict word; the heavy suites are NOT complete, see check 5)

My scripts and logs are in <scratch>\rp1127\. The working tree was clean at my last check: `git -C D:/wt/idr status --porcelain` printed nothing after M-T1's revert. suites.sh also checks that before and after its run.

## Check 1 — diff against §2 as amended; the merge
- `git diff --name-only e9bd2483...912b3a2c` lists 44 files. They are §7's Scope (38) plus the 6 class 9 files: ADR-016 and App.tsx (Amendment 2); engine/src/error.rs, candidateColumns.ts, candidateColumns.test.ts and v0-error-identity_ordinal_partitioned_unsupported.json (Amendment 5). No file is outside them.
- The fixture and literal files carry literal changes only. Beyond that:
  - the three describe fixtures gain the member;
  - the future-version fixture's id becomes any-version-skp_0_16;
  - the partitioned fixture's message now equals the engine Display, as set by the base node's commits 2b90ed51, 26cb8745 and 8d1fe83a.
- The five skp/0.14 files outside Scope are untouched (commands.rs's literal, surfaceRegistry.ts, client.ts, error.rs, AMBIGUITIES.md). The skp/0.14 mentions left at 912b are historical doc comments only.
- Merge: 09dfe6b1 has parents 912b3a2c and d6c2daf6. The patch-id of `git diff 912b3a2c 09dfe6b1 | git patch-id --stable` is ed40914d7323bfffb54551374ef0e54a151e842c. That equals the patch-id of PR A's 806ad308..d6c2daf6.
  - Its 5 files: e2e/README.md 3/3, conditions-baseline.mjs 34/5, conditions.mjs 25/5, App.lateResult.test.tsx 43/0, conditions.test.ts 26/0.
  - Total: 131 added, 13 deleted.
- **The merge brings PR A's change only.**

## Check 2 — §7 count
I used the form's counting command, with its exclusions.

| Range | Added | Deleted | Total | Files |
|---|---|---|---|---|
| e9bd2483...912b3a2c | 862 | 180 | 1042 | 44 |
| e9bd2483...767033a2 | 863 | 179 | 1042 | 44 |
| e9bd2483...09dfe6b1 (head) | 993 | 193 | 1186 | 48 |

- The 767033a2 row matches Amendment 8.
- At head, 1186 − 144 (the merge) = 1042. The 48 files are the 44 plus PR A's 4 new files; e2e/README.md is shared.
- The words commit 767033a2..912b3a2c changes 4 files, 15 added and 17 deleted, with the total unchanged. That is consistent with Amendment 10 item 3.
- Against the ceiling of 650 lines over 38 files, the piece is over by 392 lines and 6 files: class 8, recorded. §7's line was not edited.

## Check 3 — P0 and every non-app mutation, observed at head
How each was run:
- One id at a time, each in its own shared hold, by batch.sh.
- Mutations applied by mut.mjs as an exact single-occurrence replace; each dry run gave count 1. No Edit or Write tool was used.
- Each reverted with `git -C D:/wt/idr checkout -- <file>`, and porcelain checked empty after every revert.
- P0 was restored from f716d819 only in the product files the fix changed:
  - Rust: engine/src/identity.rs, kernel/src/skp.rs, protocol/skp/src/v0/commands.rs. mod.rs stays at skp/0.15: since P0, the only non-comment code changes in those files are the member, the field and the literal.
  - Shell: AdmissionPanel.tsx and v0-describe-response-session-ordinal.json.
- The tests have not changed since P0. AdmissionPanel.test.ts and kernel/tests/skp_admission_remediation.rs show an empty diff from f716d819 to HEAD. identity.rs's changed hunks all sit above its test module. fixtures.test.ts changed in 3 lines (the key list).

Baseline at head:
- Kernel remediation: rc 0, verbatim "test result: ok. 9 passed; 0 failed; 0 ignored".
- Vitest over AdmissionPanel.test.ts and fixtures.test.ts: 63 of 63 passed.

Observations, verbatim from the logs where quoted:
- **P0-RUST:** engine rc 101 (10 passed, 2 failed); kernel rc 101 (7 passed, 2 failed).
  - W-1 fails at identity.rs:404 with left `["big_signed", "big_unsigned"]` and right `["big_signed", "small_signed", "big_unsigned"]`.
  - W-2 fails at identity.rs:445 with left false and right true.
  - K-1 fails at skp_admission_remediation.rs:386 (F-1) with left `Null` and right `Array [String("parcel_key")]`.
  - K-2 fails at :466 (a) with left `Null`.
- **P0-SHELL:** vitest rc 1, verbatim "Tests  5 failed | 58 passed (63)".
  - S-1: "(i): expected null to deeply equal { …(3) }".
  - S-3: "(i) its own handle: expected null not to be null".
  - S-2: "U-1's offer: expected null not to be null".
  - S-4: "the offer: expected null not to be null".
  - T-1: "expected [ 'source', 'uniqueness', …(5) ] to include 'candidate_columns'".
- **M-K1:** kernel rc 101. K-1 fails at :386 (F-1) with `Null`, and K-2 at :466 (a) with `Null`; 7 passed.
- **M-K2:** kernel rc 101. K-2 alone fails, at :466 (a), with left `Array []`; 8 passed.
- **M-W1:** engine rc 101. W-2 fails at identity.rs:459, and W-1 at :418 with `["big_signed", "big_unsigned"]`. Kernel rc 101: K-2 fails at :466 (a) with `Array []`.
- **M-W2:** engine rc 101. W-2 alone fails, at :459, in the one-field loop, which is part (i). Kernel rc 101: K-2 fails at :514, which is part (c), with left `Some("i8,i16,i32,i64,u16,u32,u64")` and right `Some("i8,i16,i32,i64,u8,u16,u32,u64")`.
- **M-S1:** "(ii): expected { …(3) } to be null"; 1 failed, 39 passed.
- **M-S2:** S-2 fails with "expected { Object (kind, note) } to deeply equal { kind: 'admitted', …(3) }"; 1 failed, 39 passed.
- **M-S3:** S-4 fails with "expected { identity: { column: 'parcel_key' } } to deeply equal { crsAssertion: { …(2) }, …(1) }"; 1 failed, 39 passed.
- **M-S4:** S-3 fails with "(ii) another handle: expected { …(3) } to be null"; 1 failed, 39 passed.
- **M-T1:** T-1 fails with "expected null to deeply equal [ 'parcel_id' ]"; 1 failed, 22 passed.
- M-E1 needs the app and belongs to the run part.

**Comparison with the records.** Every observation matches the worker's report (state/consults/2026-11-26-identity-declaration-route-for-session-tier-build-worker-report.md) and the RECORDED MUTATION or Mutation lines in source:
- M-K1 "fails at F-1" (kernel test :357).
- M-K2 "fails at (a) with `[]`" (:436).
- M-S1 "(ii)" (AdmissionPanel.test.ts:686).
- M-S4 "(ii)" (:716).
- M-S2 "the idle state" (:724).
- M-S3 "the merged `crsAssertion`" (:748).
- M-T1 "fails by name" (fixtures.test.ts:322).

W-1 and W-2 have no mutation line in source. Their observations match only the worker's report (see D-f).

verify-mutation (blob 5053612d0358, last commit 7d24ed155a120556d6e726eea68237409270d975), run with --base e9bd2483 --head 09dfe6b1, gave rc 1. Verbatim: "verify:mutation FAIL — 5 of 13 new test(s) have no recorded mutation naming them".
- The five: W-1 (identity.rs:409), W-2 (:434), candidateColumns.test.ts:17 (a rename, not a new test), and PR A's App.lateResult.test.tsx:877 and conditions.test.ts:285.
- That run checks the record only; it is not an observation of any mutation.

## Check 4 — clause checks (at head)
- **D1** ("Declare an identity column…"): true. It renders only in the admitted state.
- **D2:**
  - "opens this file again": true. onSubmit calls `admitPath(declareOffer.path, …)`.
  - "the filter and the selection are cleared and Colour by ends; the rest of the style is kept": true. workspaceState.ts `admit` drops the filter and its clauses, ends the view's generation and sets fillMatch to null.
  - "stays open as it is now": true. A refused run returns before onAdmitted.
  - "**checks that column across the whole file**": UNTRUE in ordinary use for a typed name that is missing, non-integer or not addressable. Each is refused before any scan (engine/src/dataset.rs identity block; `admit_column_type`). **This is a ruled string (ADV-2026-11-23-26 item 2), so it goes to the advisor unreworded.**
- **D3:** every clause is true.
  - The scan runs only for an admitted integer column.
  - The repeat and negative refusals come after the scan.
  - A project saved afterwards records it (saveProject.ts; dataset_ref.rs `linked` with mapped_column).
  - Reopening the project checks the column again (project/mod.rs passes identity).
- **Legend** ("Integer columns, schema order, unranked"): true as a title. Its comment omits the comma-name omission.
- **Hint:** true. A free-text name goes to the same open path.
- **Row I8:**
  - Its quote byte-matches D3.
  - The trailing note "(I11: … a wrong first guess costs a full scan …)" is now partly untrue. It is outside the ruled span, and §9 item 18 forbids editing it, so it goes to the advisor.
- **D4:** true. The saver is keyed by the dataset handle. It byte-matches its ruling.
- **Part AG:**
  - The ruled spans of ADV-2026-11-26-28 items 4 and 5 all match, and the mark is gone.
  - AG3 is true.
  - **AG1** quotes the Identity line incompletely.
  - **AG4** cannot be done as worded after AG3's refusal.
- **ADR-016:** Amendment 2 with its acceptance, the Note 2026-11-23 and the Note 2026-11-26 byte-match their ruling blocks.

## Check 5 — suites at head
- **The kernel remediation file:** rc 0; 9 passed, 0 failed, 0 ignored.
- `cargo fmt --all -- --check` gave rc 0, and the same in frontends/shell/src-tauri gave rc 0. The shell has no other format script.
- The four verify scripts and the queue and site checks:
  - verify-cites: rc 0, PASS over 3744 files.
  - verify-test-claims: rc 0, PASS, 901 claimed tests.
  - verify-quotes: rc 0. Verbatim: "verify:quotes PASS — 159 checked, 128 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 944 ruling cites resolved, 0 ruling-cite errors."
  - verify.mjs: rc 0, "verify:plan PASS".
  - queue.mjs --check: rc 0. site.mjs --check: rc 0.
- verify-mutation: rc 1, as in check 3.
- **The full kernel and spatial-skp suites** (`cargo test --locked -p spatial-kernel -p spatial-skp --no-fail-fast`, task b3rcjaly3): **the cargo test result is unknown.**
  - The hold ended and was released; the wrapper's exit code was 0.
  - That code is not the test result, because suites.sh exits 0 regardless. The cargo exit code is in rp1127\s-rc.txt and the test counts in rp1127\s-kernel-skp.log, and I have not read either.
- **Branch CI:**
  - At 09dfe6b1: Product CI — shell (45919647379) success; Ported notices (45919647309) success.
  - At 767033a2: Rust workspace (45908678924), Governance CI, shell, Rust fmt and notices all success.
  - The branch has no PR yet.
- **NOT RUN by this gate at head:** conformance on its own, clippy, the shell `npm run verify` (typecheck and tests) and CI's node --test.
- What stands in for them, and it is not this gate's observation: CI's Rust workspace job passed at 767033a2, and the merge since then changes no Rust file. CI's shell job passed at the head itself.

## Check 6 — seams §10 names, read at head
- engine → kernel: `candidate_columns(&self) -> &[String]` (identity.rs:256). Its sole product caller is skp.rs:2058 in `describe_dataset` (:1960), under the session-ordinal guard. `error_of` comma-joins the same list.
- engine internal: `is_admitted_integer_type` is private (:325). Its two callers are :304 and :349.
- kernel → wire: `IdentityInfo.candidate_columns: Option<Vec<String>>` (commands.rs:231, deny_unknown_fields). Its only constructor is skp.rs:2034. The shell type is types.ts `candidate_columns?: string[] | null`.
- shell:
  - `identityDeclarationOffer` (:185) has product callers at :291 and :551.
  - `declarationOptions` (:197) is called at :598, then `runAdmitPath` (:272), then `admitDataset(path, cancelKey, options = {})`.
  - App passes `datasetOnMap` at App.tsx:2287.
- end to end: E-1's openPath hook calls the same admitPath (the run part).
- No interface mismatch. Every new item has a product caller.

## Findings

### Correctness
- **C-1 (to the advisor, unreworded).** D2's clause "checks that column across the whole file" is untrue in ordinary use for a typed missing, non-integer or non-addressable name: each is refused before any scan. It is a ruled string, so I give no words. No code change.

### Evidence
- **E-1 (narrowed).** P0 and all nine non-app mutations are now observed and match. Still open:
  - The kernel and spatial-skp cargo test result is unknown; its log is unread.
  - Conformance, clippy, the shell `npm run verify` and node --test have no result from this gate at head.
  - M-E1 and E-1 belong to the run part.

### Documentation (must-fix before the merge)
None of these changes code. D-e and D-f touch comment lines in code files, so the run part reads them.
- **D-a: AG1 (worker's words).**
  - Old: `The Identity line reads \`session-ordinal:file_row_number\``
  - New: `The Identity line reads \`session-ordinal:file_row_number — by-construction-within-generation\``
  - Clause check: identitySummaryLine is `${source} — ${uniqueness}`. It matches row C2 and regression.mjs's SESSION_IDENTITY_LINE.
- **D-b: AG4 (worker's words).** Before "Open the disclosure again", insert: `Open \`no-id-column.parquet\` again with Open GeoParquet; then`.
  - Clause check: the offer renders only in the admitted state (AdmissionPanel.tsx:551). After AG3 the panel is refused.
- **D-c: the types.ts doc and the SKP-V0.md §1 paragraph.** After "every column whose type `open_dataset` admits as an identity column", add: `, less the columns the engine leaves out of the list: a name that holds a comma and a name nothing can address (§8's skp/0.15 entry)`.
  - Clause check: the `candidate_identity_columns` filters.
  - The ruled Amendment 5 item 7 paragraph stays untouched.
- **D-d: the legend's source comment (IdentityDeclarationForm.tsx).** Add the comma-name omission, with a cite to `candidate_identity_columns`.
- **D-e: the `resume` comment.**
  - Old: `A declaration started from the session-tier offer`
  - New: `An open of the same path while the session-tier offer stands (a declaration from the offer, or the same file opened again)`
  - Clause check: the guard at :291 tests the path and the offer only.
- **D-f: W-1 and W-2 carry no Mutation line in source** (verify-mutation MISS). Add:
  - for W-1: `Mutation M-W1: the candidate filter back to Int64|UInt64. Expected failure: the list assertion, ["big_signed","big_unsigned"].`
  - for W-2: `Mutation M-W1 fails it at (i); Mutation M-W2: the candidate filter without UInt8. Expected failure: (i).`
  - Both observed above.
- **D-g: KNOWN-LIMITATIONS item 3's comment.** Align "every other sentence of the item is the human's" with Amendment 2's "the rest of the paragraph is the human's", and name the grant of 2026-11-13 item 2.
- **D-h (minor).** SKP-V0.md §8 and mod.rs say no message changed. Add: `the partitioned refusal's fixture message is brought to the engine's Display; the engine message itself is unchanged.`
- **D-i (to the advisor).** Row I8's trailing I11 note is stale, and §9 item 18 forbids editing it here.
- **D-j (minor).** The predicate's doc does not name "ADR-016 §4", which Amendment 5 item 3 asks for.
