*Custodian's filing note (2026-10-11): the architect's draft of the form for shell-crs-form-for-format-default-contradicted (forms ahead), the run 10:20:06Z to 10:28:09Z by its transcript, read-only (Read 29, Grep 28, Glob 2). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 8f0926f0ca6faad198323642552dde5ce8bebef55ab032275a2b844420e4b21a. The form is committed at frontends/shell/SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED-PREREGISTRATION.md, the draft's text between its separators with its 26 unhashed cites at 3b60c3ab pinned by script and nothing else changed.*

---

main @ 3b60c3ab (read-only drafting; no verdict is due on a draft)

Below is the complete draft of `frontends/shell/SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED-PREREGISTRATION.md`, ready to commit, followed by the open questions for the human.

**Choices to check before you commit:**
- **The Authority pin is yours, not recomputed.** It is the one you supplied for directive line 10 (@ df6d39a0, sha256 c77cb284…). I read the line, but I have no shell, so I could not recompute the hash.
- **Where the other hashes come from.** Every other hash is copied from a file I read: PR #205's gate 2 and gate 3 reports, the KL item-2 form's correction row, and the map-refill form's heavy-run pin. Every unhashed cite is written `at 3b60c3ab` for you to pin.
- **Full form, not five-line.** The piece adds user-visible behaviour, which crosses §21c's fourth bound whatever the line count. It also changes a CRS-assertion route (§21a). It counts 5 files and at most 225 lines, so the size bound alone would not have forced it.
- **ABSENTCRS' drives the real CRS form in the DOM.** It does not use `openPath` with `crsAssertion`. The hook skips the form, so it cannot prove the seam this piece creates.
- **Budget raised.** §7 sets 150 minutes against your estimate of 120. The difference is the base and head runs of two e2e suites plus the e2e mutation run.

---

# The shell offers the CRS assertion form after `engine.format_default_contradicted`, so the refusal's own remedy works in the app
# (PLAN node shell-crs-form-for-format-default-contradicted)

File: frontends/shell/SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED-PREREGISTRATION.md
Authority: PLAN node `shell-crs-form-for-format-default-contradicted`; the human's item 2 of 2026-10-11 (state/directives/2026-10-11-rulings-205-clause-crs-form-node-207-sentence.md:10 @ df6d39a065a3e1e7b8049801cdd00a7d98de0201 sha256:c77cb28437ce7f7ec21469241f33114dce93cc534ef7d805a6aad07ccb6dc5f4), which sets the S1 grading, the slot and order, the release hold, the replacement of a KNOWN-LIMITATIONS sentence in the human's words, and the open item. Its RULED block in DECISIONS-PENDING.md is referenced, not restated. The gap comes from PR #205's reviewer gate 2 (state/consults/gates/2026-10-11-known-limitations-item-2-on-main-paragraph-gate2-reviewer.md, C-1 and its observation) and gate 3 (state/consults/gates/2026-10-11-known-limitations-item-2-on-main-paragraph-gate3-reviewer.md, O-1 and the carried item).
Drafted by: the architect agent, alone (state/directives/2026-10-05-product-first-direction.md, section 1). Code read at main 3b60c3ab.
Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line. Nothing in this form is a quotation.
Form: full. Under AUTONOMY.md §21c the piece adds new user-visible behaviour (a remediation form where none rendered), which takes full gating whatever its size. Under §21a it changes the route by which a CRS assertion reaches the engine, a CRS-is-a-type surface. The size alone (§7: 5 counted files, at most 225 lines) would cross §21c's line bound too.
Order: slot 2, after `ported-code-notice-route` (PR #208) and before `guardian-v1`. Code starts after #208 merges. The paths that wait on other PRs are listed in §2.6.

## §0. Disclosure

0.1 Inputs.
- The node; the human's item 2 above; the human's item 1 (state/directives/2026-10-11-rulings-205-clause-crs-form-node-207-sentence.md:6-8 @ df6d39a065a3e1e7b8049801cdd00a7d98de0201 sha256:92dfbcf4dced28377ca39bed9fc4198ba4819190e916b008f6b99908c8b438f2), whose line 7 holds the two sentences that PR #205 places in KNOWN-LIMITATIONS item 2's on-main paragraph.
- PR #205's gates 2 and 3, by finding: C-1, O-1, and the carried northing-first item.
- ADR-015 §3 to §6 and its Amendment 1, items 3, 5 and 7; ADR-026 decision 1; engine/ADMISSION-PREREGISTRATION.md:55 at 3b60c3ab (R-C6); docs/01.
- The shell's admission code, e2e suites, MANUAL-WALKTHROUGH.md, and the fixture generator at the commit above.
- No pilot, no spike, nothing measured.

0.2 Pins.
- Every `@ <rev> sha256:` pin below is historical (round 14). The worker re-derives each cite at the code's base commit. For the work, the tree at that base is authoritative; for what this form read, the pin is.
- Pins at 4fd3259a are copied from PR #205's gate reports. Unhashed cites are written `at 3b60c3ab` and are pinned by the custodian.
- The drafter did not recompute the Authority pin; it was supplied by the custodian's brief. The reviewer recomputes every hash in this form.

0.3 The gap, from the code.
- `formFamilyForCode` starts a form family only for `engine.crs_undeclared` and `engine.identity_unusable` (frontends/shell/src/admission/AdmissionPanel.tsx:25-29 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:ce0c8dc4ab97614dbe1a0e4670c6116960e05fb7d251fc8bcbd16852ce0b2e1d).
- `nextFormFamily` carries a prior family forward for any other code (frontends/shell/src/admission/AdmissionPanel.tsx:46-49 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:ae7ced2a5c1d9a429a4e367ce6d99f00d6acb5463e68c4551f552ddfe91814c3).
- A prior family exists only for the same path (frontends/shell/src/admission/AdmissionPanel.tsx:238 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:833e1a3bb8165b411b68d5a0dd42d12d4d64b79a0ab6add6b1620d7c5ab31b02).
- A re-pick of the same path keeps `kind: "refused"` (frontends/shell/src/admission/AdmissionPanel.tsx:205-209 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:7f5c35f4892c8d4fa84064ecf8f771e6df6a2ca6eab71bc9c02de1b274291988). That is gate 3's O-1 route, which this piece subsumes (§2.1).
- `CrsAssertionForm` renders only when `formFamily === "crs"` (frontends/shell/src/admission/AdmissionPanel.tsx:377-391 at 3b60c3ab).
- Lines 25-29, 46-49, 205-209 and 238 read the same at 3b60c3ab as gate 3 pinned them at 4fd3259a.
- Evidence (a run's output, cited for what it reported): ABSENTCRS' recorded the CRS form absent after this refusal (state/drafts/e2e-stale-expectations-reaim-console-alone/console-alone-800.log.txt:23 @ 81d98ed9b24727d9f013f5141ba7a4fc5f70b038 sha256:60d6ea494498e687b40277a92041d883e9b5c57bf875acb144280964cdbdd9e7, as gate 2 cites it).
- The engine's message for this code tells the operator to assert the file's actual CRS (engine/src/error.rs:330-336 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:62fb744a0e95b3df10edd479e2dec8fc715942154c73c2390decd8b4ac33d5c7; engine/src/error.rs:333-339 at 3b60c3ab). The shell gives that remedy no route.

0.4 The engine side the form's submit reaches, read before the seam is drafted (unchanged by this piece).
- An assertion over a format-default file makes the file's admissible CRS None, so the assertion is admitted, not refused as a conflict (engine/src/dataset.rs:411-415 at 3b60c3ab).
- Its provenance is `Asserted` (engine/src/dataset.rs:441-448 at 3b60c3ab), on the wire as `crs:asserted` (engine/src/geoparquet.rs:94 at 3b60c3ab), with `axis:declared`.
- For `Asserted`, `sanity_check` returns NotChecked before the conviction is evaluated (engine/src/dataset.rs:1206-1217 at 3b60c3ab). An assertion therefore never re-raises `engine.format_default_contradicted`.
- An assertion whose axis order is not x-first is refused as `engine.axis_order_unsupported` (engine/src/dataset.rs:422-426 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:6ec8b326dafa7d83c0d73d743edcd3f92d36f9d33528fdd9cc8d1289f137bec4; same lines at 3b60c3ab). This is the open item (§11). The piece does not change it.
- ADR-015 §3 allows an assertion only over a file that declares none. Amendment 1 item 3 records an absent key as the format's rule, not the file's declaration. R-C6 is unchanged (engine/ADMISSION-PREREGISTRATION.md:55 at 3b60c3ab). Offering the form here is consistent with all three.

0.5 Consuming-side interfaces in the shell.
- The form's submit merges its assertion over the refused state's options and re-enters `admitPath` on the same path (frontends/shell/src/admission/AdmissionPanel.tsx:387-390 at 3b60c3ab).
- The form has two routes and neither starts selected (frontends/shell/src/admission/CrsAssertionForm.tsx:26-29 at 3b60c3ab, ADR-026 decision 1). The catalog entries are labelled with name and authority:code (frontends/shell/src/admission/CrsAssertionForm.tsx:68-95 at 3b60c3ab). Submit is `button[type=submit]` (frontends/shell/src/admission/CrsAssertionForm.tsx:135-137 at 3b60c3ab).
- The summary's CRS line for an asserted CRS starts with the identifier followed by `— caller-asserted by` (frontends/shell/src/admission/describeSummaryText.ts:17-28 at 3b60c3ab). Its `CRS provenance` row renders the two provenance strings (frontends/shell/src/admission/DescribeSummary.tsx:62-63 at 3b60c3ab).
- `RefusalBlock` and the forms are siblings, so the existing no-button-inside-`.admission-refusal` check stays valid (frontends/shell/src/admission/AdmissionPanel.tsx:374-392 at 3b60c3ab).

0.6 Hypotheses.
- **H1.** Mapping `engine.format_default_contradicted` to `"crs"` in `formFamilyForCode` makes the CRS form render after this refusal on a fresh open, whatever family came before.
  - Discriminators: CF1, CF2, CF3, ABSENTCRS'.
  - If it fails: I4.
- **H2.** At the head, an x-first assertion over the F-2 fixture opens it. The proposed assertion is the pinned catalog's EPSG:2056 entry, submitted through the real form.
  - Basis: §0.4. Also, the F-2 fixture differs from `no-crs-refused.parquet` only in its CRS mode and its geo bbox (kernel/tests/manual_walkthrough_fixtures.rs:157-205 at 3b60c3ab), and admission-remediation.mjs's ASSERT' opens that file with the same catalog entry (frontends/shell/e2e/admission-remediation.mjs:217-253 at 3b60c3ab).
  - Discriminator: ABSENTCRS'.
  - If it fails: I2.
- **H3.** After this refusal, an asserted northing-first CRS is refused as `engine.axis_order_unsupported`, and the CRS form stays reachable through the existing carry-forward.
  - Discriminator: CF4.
  - This records the open item's behaviour in the app. It does not change it.

0.7 Reuse index.
- The custodian ran `node tools/reuse.mjs crs assertion form refusal` in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. It exited 1 and reported no prior art recorded for those words.
- A miss, noted. It does not block (state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md, item 5).

## §1. May and may not claim

- **May claim:**
  - after `engine.format_default_contradicted`, the app shows the CRS assertion form;
  - an x-first assertion submitted through it opens such a file (§4).
- **May not claim:**
  - that any asserted CRS opens such a file. An asserted northing-first CRS is still refused (§11, OPEN-3);
  - that the assertion is checked against the coordinates. An asserted CRS is NotChecked (§0.4);
  - that the release hold is lifted. That is the PLAN's and the human's;
  - any performance figure or docs/08 row;
  - any macOS or Linux level above L1.
- **No change** to the wire, `protocol/`, `engine/`, `kernel/src`, `skp/`, `src-tauri/`, the CRS catalog, `crsAssertionState.ts`, `formatRefusal.ts` or `RefusalBlock.tsx`. No new product string, constant, dependency, callback, option or export.
- **ADRs:** ADR-015 and ADR-026 are cited. None is amended. The ADR-015 §5 OPEN block (normalize later) is not touched.
- **Grading:** S1 on main, the human's (Authority, item 2). The release hold is the human's (Authority, item 2). The PLAN records it on `release-v0-1-1`.

## §2. The change

### 2.1 AdmissionPanel.tsx
- In `formFamilyForCode`, add one branch: `engine.format_default_contradicted` returns `"crs"`. It sits beside the `engine.crs_undeclared` branch, so this code starts the CRS family on its own.
- Correct the doc comments of `formFamilyForCode` and `nextFormFamily` so that they name the codes that start a family. Comment lines only.
- **Nothing else.** `nextFormFamily`'s conflict branch (I1) and its carry-forward, `runAdmitPath`, the `State` union and the JSX are unchanged.
- **O-1 subsumed.** After this change, the form shows after this code whatever came before. The carry-forward route that gate 3 found (a re-pick of the same path after the file changed on disk) no longer differs from a fresh open. Proof: CF2.

### 2.2 CrsAssertionForm.tsx
- The doc comment's first sentence (frontends/shell/src/admission/CrsAssertionForm.tsx:22 at 3b60c3ab) names `engine.crs_undeclared` as the form's only refusal. It is corrected to name both codes. Comment lines only.

### 2.3 e2e/regression.mjs: ABSENTCRS', re-aimed
The step keeps its ID and its place (frontends/shell/e2e/regression.mjs:2677 at 3b60c3ab). Its body (frontends/shell/e2e/regression.mjs:2435-2487 at 3b60c3ab) changes as follows:
- **Kept:** the outcome code, the verbatim message, the panel's code and message, no button inside `.admission-refusal`, and no `.admission-panel .describe-summary` while refused.
- **The INFO line becomes assertions:**
  - `.crs-assertion-form` is present;
  - `.identity-declaration-form` is absent.
- **Then, through the real form, by DOM clicks:**
  - click the catalog entry's radio whose label names `EPSG:2056`, found by its label and never by index;
  - submit with `.crs-assertion-form button[type=submit]`.
- **Within an e2e-local 20 s:**
  - `.admission-panel .admission-refusal` and `.crs-assertion-form` are gone;
  - the summary's `CRS` row begins `EPSG:2056 — caller-asserted by `;
  - its `CRS provenance` row equals `crs:asserted, axis:declared`.
  - The rows are read by `dt` text, as `stepSessionTier` reads them (frontends/shell/e2e/regression.mjs:2414-2423 at 3b60c3ab).
- **Then** `waitForSettle` on the console handle, as `stepSessionTier` does, so that C2'/C3' starts from a settled map.
- **`openPath` with options is not used for the submit.** The hook skips the form, and the seam being proven is form → `admitPath` → engine.
- **The doc comment** is rewritten:
  - it names the Authority and asserts the new provenance class. This follows the rule the step's own comment cites (DECISIONS-PENDING entry 80);
  - the sentence saying the form is not asserted is removed.
- **The call site** passes `consoleHandle`. The outer bound goes from 30 s to 90 s, the C2'/C3' bound for one admission plus one 45 s settle. A bound, not a timing claim (ADR-018).

### 2.4 Comment and document lines made untrue
- kernel/tests/manual_walkthrough_fixtures.rs:184-188 at 3b60c3ab. The generator's doc comment says the form is not asserted for this refusal and that `formFamilyForCode` does not start a family for it. It is restated to what the head does. Comment lines only. No Rust code changes.
- frontends/shell/MANUAL-WALKTHROUGH.md:93 at 3b60c3ab, the ABSENTCRS' coverage row. Its asserted and not-asserted cells are restated to §2.3, in place.
- **The operator Part (§2.5)** is added after the last Part at the code's base.

### 2.5 Operator rows (a new Part, the next letter after the last at the code's base; observation only, `felt_verdict: false`)
Blank result log. No duration in any row. The fixture is `absent-crs-contradicted.parquet`, made by the walkthrough's existing fixture command.
- **1:** launch, click Open GeoParquet… and pick `absent-crs-contradicted.parquet`.
  - Record that the refusal panel shows `engine.format_default_contradicted` with its message, and that the CRS assertion form appears below it.
  - Record that no identity form appears.
- **2:** in the form, pick the EPSG:2056 catalog entry, open its full definition, then click Assert this CRS.
  - Record that the file opens and parcels draw.
  - Record that the Inspector's CRS line reads EPSG:2056 as caller-asserted, with your user and a time.
- **3:** open the same file again.
  - Record that it is refused again with the form shown: nothing about the assertion persisted.

### 2.6 Boundaries, and slot overlap
- **Counted files:**
  - frontends/shell/src/admission/AdmissionPanel.tsx;
  - frontends/shell/src/admission/CrsAssertionForm.tsx (comment only);
  - frontends/shell/src/admission/AdmissionPanel.test.ts;
  - frontends/shell/e2e/regression.mjs;
  - kernel/tests/manual_walkthrough_fixtures.rs (comment only).
- **Outside the count:** frontends/shell/MANUAL-WALKTHROUGH.md, KNOWN-LIMITATIONS.md (item 2, one sentence), PLAN.yaml (this node's record), and this form.
- **Nothing else.**
- **Overlap**, against the PRs open at drafting:
  - **#208** (notice route): its form's declared paths (renderer/bundle-viewer, frontends/shell/scripts, frontends/shell/src/notices) are disjoint from this piece's. Its §8 forbids `kernel/` files. Code starts after it merges anyway (slot order). The custodian confirms against its final file list.
  - **#207** (map refill): canvas/, App.tsx, residency/, e2e/layout.mjs, e2e/README.md, KNOWN-LIMITATIONS item 39 and MANUAL-WALKTHROUGH Part V. Its §8 item 11 forbids it to touch regression.mjs. The admission files, regression.mjs and the kernel comment are disjoint. **MANUAL-WALKTHROUGH.md waits for #207's merge**, because the new Part's letter follows Part V.
  - **#205** (KNOWN-LIMITATIONS item 2): **the item 2 edit waits for #205's merge and for the human's words (§2.7)**.
  - No path touches `protocol/`.

### 2.7 KNOWN-LIMITATIONS item 2: the sentence the piece makes untrue (an input owed by the human before the merge)
- **The sentence:** the second of the two sentences in the human's item 1, line 7 (pinned in §0.1), as PR #205 lands it in item 2's on-main paragraph. It says the app does not offer a CRS assertion after this refusal, so the file cannot be opened in the app. Under §2.1 and H2 it becomes untrue.
- **The rule:** the human's item 2 says it is replaced in the human's words. This form drafts no replacement words.
- **Before the PR is marked ready,** the custodian files the human's words. The worker then replaces that sentence, and only that sentence, byte for byte by script from the filed directive. The first sentence (the code) and the rest of the paragraph stay.
- **If the words have not arrived,** the PR waits. It is not merged with the stale sentence, and nothing is drafted in their place.

### 2.8 Portability (R1 to R6)
- No OS-dependent feature is added or changed. The behaviour is the same on every platform.
- Windows: tested by the unit tests and the e2e suites.
- macOS and Linux: at L1 by the unit tests only. L2 is deferred to `shell-real-app-run-macos-linux`.
- No test is skipped on any platform.

## §3. Fixtures and predicted outcomes

- **Fixtures.** No new fixture.
  - `absent-crs-contradicted.parquet` (F-2), generated by `generate_the_absent_crs_contradicted_fixture` (kernel/tests/manual_walkthrough_fixtures.rs:189-205 at 3b60c3ab) and hashed in the suite's existing fixture list (frontends/shell/e2e/regression.mjs:2523 at 3b60c3ab).
  - For the second suite, `no-crs-refused.parquet`, as now.
- **ABSENTCRS' at the head:**
  - refused `engine.format_default_contradicted` with the verbatim message;
  - CRS form present, identity form absent;
  - after the EPSG:2056 catalog submit: admitted, with the `CRS` row beginning `EPSG:2056 — caller-asserted by ` and `CRS provenance` equal to `crs:asserted, axis:declared`;
  - settled.
- **ABSENTCRS' at the base:**
  - the base step runs as it is and passes, with INFO `.crs-assertion-form present=false`. This matches gate 2's cited evidence;
  - the re-aimed step against base product code fails at the form-present assertion (the e2e mutation, §4).
- **Every other step** of regression.mjs, and every step of admission-remediation.mjs: the same outcome at the base and at the head.

## §4. Tests, and one mutation each

Every mutation is observed by applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it. A `verify-mutation` run is not an observation of a mutation (round 25, item 2 (c)). On an unmerged branch, a test-text span is named in words with its commit id and carries no hash (round 25, item 2 (d)).

| ID | Kind and file | Asserts | Mutation, and its expected failure |
|---|---|---|---|
| CF1 | unit, src/admission/AdmissionPanel.test.ts, in `describe("formFamilyForCode")` | `formFamilyForCode("engine.format_default_contradicted")` is `"crs"` | delete the new branch; the result is `null` |
| CF2 | unit, same, in `describe("nextFormFamily …")` | `nextFormFamily(p, "engine.format_default_contradicted")` is `"crs"` for p = `null`, `"crs"` and `"identity"`. The existing I1 test is unchanged and passes | add the code to `nextFormFamily`'s conflict branch; the result is `null` for every p |
| CF3 | unit, same, in `describe("runAdmitPath …")`, through the file's `depsFor` harness | A fresh path refused `engine.format_default_contradicted` gives `kind: "refused"` and `formFamily: "crs"`. A resubmit with `{crsAssertion}` on that path is synchronously still `"refused"` with `inFlight: true`, so the form stays mounted. Once it resolves admitted, `onAdmitted` is called once, and `admit`'s second call is `(path, "k2", {crsAssertion})` | in the refused updater, replace `nextFormFamily(priorFamily, outcome.refusal.code)` with `priorFamily`; `formFamily` is `null` |
| CF4 | unit, same | `engine.format_default_contradicted`, then an assertion refused `engine.axis_order_unsupported` on the same path: `formFamily` stays `"crs"` (H3; the open item, as the app shows it) | in `nextFormFamily`, replace `?? priorFamily` with `?? null`; `formFamily` is `null` |
| ABSENTCRS' | e2e, e2e/regression.mjs, re-aimed (§2.3) | §3's head outcome, through real DOM clicks on the real form | delete §2.1's branch (the base behaviour); the step fails at `.crs-assertion-form` present |

**Assertion per acceptance item:**
- **The form is offered after this refusal:** CF1, CF2, CF3 and ABSENTCRS'.
- **An x-first assertion opens the file:** CF3 (the shell) and ABSENTCRS' (end to end, from the real shape).
- **O-1 subsumed:** CF2.
- **The open item, as the app shows it:** CF4.
- **Nothing persists:** operator row 3. This is unchanged behaviour; admission-remediation.mjs's NOPERSIST' covers it for the explicit-null file.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted:** H1 to H3, and §3.

**Declared unchanged:**
- Every path named in §1's no-change bullet.
- Every file outside §2.6.
- `formFamilyForCode` for every other code. The existing test that lists codes starting no family keeps its list.
- `nextFormFamily`'s I1 branch and its carry-forward.
- `runAdmitPath`; the `State` union; the panel's JSX.
- The CRS form's behaviour, its routes and its unselected start.
- The engine's message and code for this refusal.
- Every regression.mjs step other than ABSENTCRS', every admission-remediation.mjs step, and every threshold.
- The ABSENTCRS' checks kept in §2.3.
- KNOWN-LIMITATIONS: every item other than item 2, and every word of item 2 other than §2.7's sentence.
- Walkthrough Parts up to the last at the code's base.
- The exe. No exe input changes. If the diff touches any Rust code or `src-tauri/`, the exe is rebuilt and both arms re-run.

**Invalidators.** Each means STOP and report.
- **I1:** at the code's base, a §0.3 or §0.5 interface differs from what this form read.
- **I2:** H2 fails: the EPSG:2056 assertion over F-2 does not admit at the head. The engine is out of scope, so this is not fixed here.
- **I3:** a step declared unchanged has a different outcome at the base and at the head. It is recorded as class 2. No threshold is edited.
- **I4:** the form can be shown only by a change outside AdmissionPanel.tsx.
- **I5:** a §4 mutation does not fail its test.
- **I6:** the change needs a new product string, export, option or dependency.

**Falsification.** The form is wrong if, at the base, an assertion over a format-default file can itself be refused as `engine.format_default_contradicted`. In that case offering the form would not open the file (§0.4).

## §6. Instruments

- **Assertions:** CF1 to CF4 and ABSENTCRS'.
- **Observation, not asserted:** none.
- **Measurements:** none.
- **The human's:** §2.5 rows 1 to 3, and the §2.7 words.

## §7. Declared values and ceilings

- **No new product constant.**
- **e2e-local values,** declared in regression.mjs, not timing claims:
  - the admission wait, 20 s;
  - the settle, `waitForSettle` at quietMs 3000 and timeoutMs 45 000, as `stepSessionTier` uses it;
  - ABSENTCRS' outer bound, 30 000 ms → 90 000 ms (§2.3).
- **Counting.** Insertions plus deletions per §21c, tests included, taken at a named commit with `git diff --numstat <base>...HEAD -- frontends/shell kernel/tests/manual_walkthrough_fixtures.rs ':(exclude)frontends/shell/SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED-PREREGISTRATION.md' ':(exclude)frontends/shell/MANUAL-WALKTHROUGH.md'`, where `<base>` is the merge base with origin/main at the cut.

| Group | Files | Lines, at most |
|---|---|---|
| G1 product: AdmissionPanel.tsx (≤ 22), CrsAssertionForm.tsx comment (≤ 4) | 2 | 26 |
| G2 unit: AdmissionPanel.test.ts | 1 | 100 |
| G3 e2e: regression.mjs | 1 | 90 |
| G4 comment only: kernel/tests/manual_walkthrough_fixtures.rs | 1 | 9 |
| **Total** | **5** | **225** |

- **Outside the count:** MANUAL-WALKTHROUGH.md ≤ 20; KNOWN-LIMITATIONS.md ≤ 2 (one line, in place); PLAN.yaml.
- **Minutes:** 150. The custodian's estimate was 120. The difference is the base and head runs of two e2e suites and the e2e mutation run.
- **Overruns:** an overrun of any figure is recorded as class 8, and this section is never edited to match.

## §8. Block-on-sight

1. Any path under `engine/`, `kernel/src`, `protocol/`, `src-tauri/` or `skp/`; any wire literal; a code change in kernel/tests.
2. A form family for any code other than `engine.format_default_contradicted`; any change to `nextFormFamily`'s I1 branch or carry-forward, or to `runAdmitPath`.
3. A CRS pre-selected, pre-filled, suggested or inferred from the file's coordinates or bbox, on any route (ADR-015 §6, ADR-026 decision 1).
4. A new product string, including a `refusalGuidance` case for this code.
5. In ABSENTCRS', the assertion submitted through `openPath` options instead of the real form; a catalog entry chosen by index.
6. Any other e2e step or file edited, or a threshold edited, apart from ABSENTCRS' and its §7 bound.
7. A change to the axis-order refusal, or text claiming that asserted northing-first CRSs open.
8. A KNOWN-LIMITATIONS edit made before the human's words are filed, any word not byte-copied from them, or any other sentence of item 2 edited.
9. A file outside §2.6.
10. A callback, option or export without a product caller.
11. A new test without its observed mutation, or a `verify-mutation` run called an observation.
12. A quote of the human's words marked verbatim that does not match its source.
13. A claim that the release hold is lifted, or a performance claim or docs/08 row.

## §9. Gates

- **Architect and reviewer,** full gating, with verdicts per state/directives/2026-10-05-product-first-direction.md:15 at 3b60c3ab:
  - only Correctness or Evidence blocks;
  - documentation and record findings are fixed in the same PR before the merge;
  - each gate checks §8 item by item.
- **Suites,** green first:
  - frontends/shell `npm run verify`;
  - `e2e/regression.mjs` and `e2e/admission-remediation.mjs` at the base and at the head, step by step, listed in the PR body;
  - the governance scripts' `node --test`;
  - verify-cites, verify-quotes and verify-test-claims, each tool named with its commit (round 15 (c)).
- **The human's input owed before the merge:** the §2.7 words, filed as a directive. The PR is not marked ready without them.
- **Operator:** §2.5's Part, committed with a blank log and queued for the human to sequence.
- **Release:** the hold ends when the piece lands, per the human's item 2 and the PLAN. This form claims nothing further.
- **Owner's index:** the worker updates any owner's-index line its piece changes, in this PR (product-first direction, section 1).

## §10. Amendments

Opens empty, append-only.

## §11. Open items for the human

- **OPEN-1:** the replacement words for §2.7's sentence. Owed before the merge.
- **OPEN-2:** confirm that the sentence replaced is only the second of item 1's two sentences, and that the first (the code) stays.
- **OPEN-3 (named by the human's item 2):** an asserted northing-first CRS is still refused as `engine.axis_order_unsupported` (§0.4). The piece does not change it. Whether KNOWN-LIMITATIONS item 2's still-refused list names it is the human's call; gate 2 and gate 3 found the list does not.

None is a red line.

## §12. Heavy runs

The worker's and tester's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ d88ceddaeb88707941e0868a900eb2f7999da06b sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1. This form names no other rule for builds.

---

**Open questions for the human:**
1. **The replacement words (OPEN-1).** What sentence replaces "The app does not yet offer a CRS assertion after this refusal, so on `main` such a file cannot be opened in the app."? This is the second sentence of item 1's line 7, now on PR #205. It is owed before this PR is marked ready, and the form drafts none.
2. **Which sentence (OPEN-2).** Confirm that "the sentence in point 1" means that second sentence only, so the first ("The code is `engine.format_default_contradicted`.") stays.
3. **Northing-first CRSs (OPEN-3).** Should KNOWN-LIMITATIONS item 2's "Still refused" list name asserted northing-first CRSs? If so, in your words. Gates 2 and 3 both found it missing, and your item 2 makes it an open item of this form.
4. **The release hold.** Does it end at this piece's merge, or only after you have run the new walkthrough Part (§2.5)?
5. **The walkthrough Part.** Do you want it added (three observation rows, no felt verdict), and where it goes in your sitting order? Operator rows are yours to sequence.

**Files read:**
- C:\dev\spatial-ide\state\directives\2026-10-11-rulings-205-clause-crs-form-node-207-sentence.md
- C:\dev\spatial-ide\state\consults\gates\2026-10-11-known-limitations-item-2-on-main-paragraph-gate2-reviewer.md
- C:\dev\spatial-ide\state\consults\gates\2026-10-11-known-limitations-item-2-on-main-paragraph-gate3-reviewer.md
- C:\dev\spatial-ide\frontends\shell\src\admission\AdmissionPanel.tsx
- C:\dev\spatial-ide\frontends\shell\src\admission\AdmissionPanel.test.ts
- C:\dev\spatial-ide\frontends\shell\src\admission\CrsAssertionForm.tsx
- C:\dev\spatial-ide\frontends\shell\e2e\regression.mjs
- C:\dev\spatial-ide\frontends\shell\e2e\admission-remediation.mjs
- C:\dev\spatial-ide\kernel\tests\manual_walkthrough_fixtures.rs
- C:\dev\spatial-ide\frontends\shell\MANUAL-WALKTHROUGH.md
- C:\dev\spatial-ide\engine\src\dataset.rs
- C:\dev\spatial-ide\engine\src\error.rs
- C:\dev\spatial-ide\docs\adr\ADR-015-source-crs-requirement-and-caller-assertion.md
- C:\dev\spatial-ide\frontends\shell\SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md
- C:\dev\spatial-ide\KNOWN-LIMITATIONS-ITEM-2-ON-MAIN-PREREGISTRATION.md
