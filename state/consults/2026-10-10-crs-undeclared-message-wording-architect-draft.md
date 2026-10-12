*Custodian's filing note (2026-10-10): the architect's draft of `crs-undeclared-message-wording`'s preregistration, on the custodian's brief at main 142af722, after lead-data's impact read (forms ahead). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 3b1faca2e30c0c4389325407fc2f0dd78f3706e49df1cd1ccdbc558035986350. Write audit PASS: zero write calls (Read 55, Grep 20, SubagentHandback 1). Run window from the transcript: 20:03:29Z to 20:13:33Z. Committed as the form `engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md` in the same commit, with the custodian's pins; its OPEN-1 and OPEN-2 are the human's.*

---

Reviewed: main @ 142af722ee555468a20ed40d6ceac843e11f4292

## 1. Form and gating, and what the human decides

**Form: the full form, with both gates (reviewer and architect), from dispatch. No five-line form is committed.** Three things put it there. Any one of them is enough.
- **§21c.** The bound excludes new user-visible behaviour. This piece changes a message the shell shows verbatim (frontends/shell/src/admission/RefusalBlock.tsx:29).
- **§21a, guarantees.** The category includes any property currently under test. The message text is asserted byte for byte by the two e2e suites.
- **§21a, the wire.** The category covers `protocol/skp/**` by path, and the form puts protocol/skp/tests/data/v0-error-example.json in scope (see §2.3 of the draft).

Under §25(e), an Out-of-scope line that cannot say "none of the four" means the full form. Size is about 65 lines of code and tests, which is under §21c's bound but does not change the route.

**Form file:** engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md, because the lane is engine and the source of the text is engine/src/error.rs.

**The rules decide the following. None of it is the human's:**
- the form and the gating;
- whether the SKP fixture is in scope. The node gives that to the form (PLAN.yaml:4492). The form puts it in.
- that the two prefix quotes are out. Line 34 decides it: the human's wording keeps the first clause byte for byte, so those quotes contain nothing that changes.

**The human's:**
- OPEN-1: the doc comment the change makes false.
- OPEN-2: whether a test pins the text at its source.
- The string sight at the PR (directive line 34).

**Wording check: true of the code.** The wording is true in all three cases that raise the refusal on main. I found nothing untrue, so there is no OPEN item on it. §2.2 of the draft carries four precision notes for the human's sight. They are not proposals.

## 2. The draft

````markdown
# engine.crs_undeclared's message in the human's words
# (PLAN node crs-undeclared-message-wording)

File: engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md
Authority:
- the node: PLAN.yaml:4477-4493 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD
- the wording: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:33 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD
- the scope and the human's sight at the PR: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:34 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD
- the placement (slot 2, after filter-identity-alias-ambiguous-reached-through-skp, not before the re-aim has merged): state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:36 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD
- forms ahead: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:38 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD
- the directive has a RULED block in DECISIONS-PENDING.md
- the human's area E instruction that asked for the wording: state/directives/2026-10-10-drift-sweep-area-e-instructions.md:12 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD
- the custodian's answer, when the refusal fires on main: state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md:124-136 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD
Drafted by: the architect agent. Inputs:
- lead-data's impact read, state/consults/2026-10-10-crs-undeclared-message-wording-impact-read.md (whole-file sha256 25d5906bf736c216d136103ce082c06620908a051facb691fc4c913bf2cd58cb). It is an input, not Authority.
- the custodian's reuse-index output (0.6).
Code was read at main 142af722.
Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
No code starts before all of these hold:
- e2e-stale-expectations-reaim has merged;
- filter-identity-alias-ambiguous-reached-through-skp has merged;
- Amendment 1 (§8 item 1) is committed.
Form: full (AUTONOMY.md §21a and §21c; §25(e)). See 0.7.
Pins:
- Every pin is a historical pin at 142af722. The pin is authoritative for what it recorded. The tree at the base commit B (Amendment 1) is authoritative for the text the piece edits.
- The re-aim edits both e2e files. Their places are therefore named here by file, identifier and step id, and pinned at B by Amendment 1.
- Lines on the re-aim branch are named in words with their commit, never pinned.

## §0. Disclosure

0.1 The source and its route.
- The Display arm: engine/src/error.rs:282-286 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- The text the piece replaces is the second sentence only: engine/src/error.rs:285 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD. The first clause, at engine/src/error.rs:284 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD, is byte-identical in the human's wording.
- The message reaches the wire as the Display text: kernel/src/skp.rs:2041-2047 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD. SKP-V0 §5 defines it so: protocol/skp/SKP-V0.md:325-326 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- The shell renders it verbatim: frontends/shell/src/admission/RefusalBlock.tsx:29 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- The variant's doc comment says why the old sentence was kept: engine/src/error.rs:27-29 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD. This change makes it false (OPEN-1).

0.2 When the refusal fires on main, and when the format default is applied. These are the facts the wording states.
- The pinned versions are exactly two strings: engine/src/geoparquet.rs:37 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD. They are compared as exact strings: engine/src/geoparquet.rs:509 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- The crs key has three states, and a value that is neither an object nor null is read as null: engine/src/geoparquet.rs:435-451 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- With an explicit null, nothing is established: engine/src/geoparquet.rs:555 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- With an absent key under a pinned version, OGC:CRS84 is applied with provenance crs:format-default: engine/src/geoparquet.rs:556-571 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- With an absent key under any other version, no rule is applied, and a detail names the version: engine/src/geoparquet.rs:572-582 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- Raise site (c), the absent key under an unpinned version with no assertion: engine/src/dataset.rs:398-405 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- Raise sites (a) and (b), nothing established and no assertion: engine/src/crs.rs:286-288 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- When the caller asserts, the format default is dropped and the assertion is admitted: engine/src/dataset.rs:411-415 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD; engine/src/crs.rs:279-285 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- An absent key under a pinned version whose bbox leaves the CRS84 domain is refused under a different code, engine.format_default_contradicted: engine/src/dataset.rs:1223 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD; engine/src/dataset.rs:1338-1339 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.

0.3 Governing texts, cited and not amended:
- ADR-015 §2: docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:46-47 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- ADR-015 Amendment 1, item 3: docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:173-178 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- ADR-015 Amendment 1, item 4: docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:180-184 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- docs/05's no-silent-conversion rule: docs/05_Data_Engine.md:25 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- SKP-V0 §4 item 13: protocol/skp/SKP-V0.md:281-285 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.

0.4 The re-aim branch, read in words and not pinned (custodian-checked with git show):
- the constant in frontends/shell/e2e/regression.mjs, lines 94-97 at ef1cc519;
- the constant in frontends/shell/e2e/admission-remediation.mjs, lines 74-77 at ef1cc519.
- engine/src/error.rs lines 284-285 at ef1cc519 are equal to main.
- The assertion lines on the branch were not checked with git show. They are named by step id here and pinned at B by Amendment 1.

0.5 Existing pins of the text.
- No engine or kernel test asserts the Display text. Both pin the variant only:
  - engine/src/crs.rs:332-336 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD
  - the kernel mapping test, unchanged.
- The full-text checks against real output are the two e2e constants (§2.1). They run on the dev machine, not in CI.

0.6 Reuse index (the human's standing step). At 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, the custodian's node tools/reuse.mjs recorded no prior art for crs undeclared message wording refusal. Noted, not blocking.

0.7 Gating route.
- §21c's bound excludes new user-visible behaviour: AUTONOMY.md:350-351 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- §21a lists any property currently under test: AUTONOMY.md:325-327 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- §21a lists protocol/skp/**: AUTONOMY.md:323-324 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
- So the full form and both gates apply from dispatch: AUTONOMY.md:482 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.

0.8 Budget. The node declares 45 minutes. The full form, two gates and four e2e runs exceed that. The custodian records the deviation in PLAN. It is not a §7 figure.

0.9 Fixture drive: no measurement, and the 5 GB fixture is not used.

## §1. May and may not claim

- May claim:
  - The Display of CrsUndeclared, as raised by the real (a) site, equals the directive's line 33 byte for byte, with {detail} filled from that site. Proof: T-1 and M-1 (§4), conditional on OPEN-2 (A).
  - Through the shell on Windows/WebView2, steps B2'/B3', ASSERT' and NOPERSIST' pass at H. They failed by name at C1, with the old engine text (M-2, M-3).
  - By reading at B (0.2, re-pinned by Amendment 1), the wording is true of the admission code in all three raise cases. §2.2's notes apply.
- May not claim:
  - that the new text was run through the shell for case (b) or case (c). The e2e fixture is case (a) (kernel/tests/manual_walkthrough_fixtures.rs:159-167 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD);
  - anything about macOS or Linux shell behaviour;
  - any change to KNOWN-LIMITATIONS, the v0.1.0 notes or engine/ADMISSION-RESULTS.md;
  - any SKP literal, field or version change;
  - any guidance string, performance figure or docs/08 row.
- No ADR is amended. No pub item, dependency or variant changes, and no detail, field or code.

## §2. The change

2.1 The places, decided one by one under line 34's rule.

| Place | Decision | Reason |
|---|---|---|
| engine/src/error.rs:285 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD (the second sentence) | in | the source |
| frontends/shell/e2e/regression.mjs, `CRS_UNDECLARED_MESSAGE` (main: frontends/shell/e2e/regression.mjs:89-92 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD), asserted in step B2'/B3' | in | an e2e constant that quotes it |
| frontends/shell/e2e/admission-remediation.mjs, `CRS_UNDECLARED_MESSAGE` (main: frontends/shell/e2e/admission-remediation.mjs:70-73 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD), asserted in ASSERT' and NOPERSIST' | in | an e2e constant that quotes it |
| frontends/shell/src/admission/formatRefusal.test.ts:24-32 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD, its second sentence only | in | a test that quotes it. Its synthetic detail stays: line 34 changes the text, not the detail (§5) |
| protocol/skp/tests/data/v0-error-example.json:3 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD, the message value's second sentence only | in (2.3) | test data that quotes it byte for byte; the node gives the call to this form |
| frontends/shell/MANUAL-WALKTHROUGH.md:176 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD (row B2), the quoted message's second sentence only | in | a walkthrough row that quotes it; no result log edited |
| frontends/shell/src/admission/admitDataset.test.ts:100 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD | out (line 34) | quotes only the first clause, which is unchanged |
| protocol/data-plane/tests/candidate_a.rs:668 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD | out (line 34) | quotes only a prefix of the first clause, which is unchanged; its substring assertion still holds |
| frontends/shell/src/skp/__tests__/fixtures.test.ts:472 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD | out (line 34) | asserts a substring, OGC:CRS84, which the new text keeps |
| frontends/shell/MANUAL-WALKTHROUGH.md:92 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD (coverage row B2'/B3') | out (line 34) | names the verbatim message without quoting it; stays true |
| rows I1, ASSERT', NOPERSIST', N4: frontends/shell/MANUAL-WALKTHROUGH.md:584 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD; frontends/shell/MANUAL-WALKTHROUGH.md:608 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD; frontends/shell/MANUAL-WALKTHROUGH.md:617 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD; frontends/shell/MANUAL-WALKTHROUGH.md:947 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD | out (line 34) | refer to B2's quote by reference; stay true. N4's stale error.rs cite is observed (2.6) |
| e2e pointer comments: frontends/shell/e2e/regression.mjs:86-88 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD; frontends/shell/e2e/admission-remediation.mjs:67-69 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD | out (line 34) | say the constant is verbatim from error.rs, which stays true |
| engine/src/error.rs:27-29 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD | OPEN-1 | the change makes the comment false |
| KNOWN-LIMITATIONS.md:43-50 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD (item 2) | out (line 34; the node) | a v0.1.0 note; keeps its quote |
| engine/ADMISSION-RESULTS.md:13 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD; engine/ADMISSION-RESULTS.md:33 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD | out (the node) | a results record |
| records under state/ that quote the old sentence | out | records |

The new text in every in-scope place:
- It is the directive's line 33 from `refused:` to the line's end, with the line's three-space list indentation removed. The custodian's script confirms that the line carries no trailing whitespace.
- In each quoting place, {detail} is the detail that place already carries. Only the second sentence changes.
- In error.rs, the string is split across lines with a `\` continuation, which removes the newline and the next line's leading whitespace. The rendered bytes are what T-1 checks.
- Markdown escaping in row B2 follows the row's existing convention. The new sentence has no backticks: the crs key is written plain, as in line 33.

2.2 Is the wording true of the code? Yes, in all three raise cases (0.2): (a) an explicit null; (b) a crs value that is neither an object nor null; (c) an absent key under an unpinned version. In none of them is the key absent under 1.0.0 or 1.1.0, and in each an assertion is the route to an open. Precision notes for the human's sight at the PR. They are not proposals, and no word is changed:
- N-a. The words "only when" give a necessary condition. With a caller assertion, the default is not applied even to an absent key under a pinned version (dataset.rs:411-415, 0.2). An absent key under a pinned version whose bbox leaves the CRS84 domain is refused as engine.format_default_contradicted (0.2).
- N-b. On the advice to assert a CRS: the assertion itself is refused if its identifier is blank or oversized (engine/src/dataset.rs:374-376 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD). It is also refused if its definition has no coordinate system (crs.rs:279-285, 0.2), or if its order is not x-first (engine/src/dataset.rs:422-426 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD). The shell's catalog entries, EPSG:2056 and EPSG:3857 (row I1), are both x-first.
- N-c. In case (b), the unchanged first clause says the file declares no CRS. That is the engine's reading of a value it cannot use (geoparquet.rs:435-451, 0.2).
- N-d. The version is geo.version, matched exactly: a value such as 1.0 is not 1.0.0.

2.3 The SKP fixture (the node's question; impact-read questions 1 and 2).
- It counts as a test that quotes the message:
  - it sits under tests/;
  - two tests load it (protocol/skp/tests/fixtures.rs:380-383 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD; fixtures.test.ts:472, 2.1);
  - it carries the message byte for byte;
  - SKP-V0 §5 makes the message the Display text (0.1), so the worked example would otherwise disagree with the engine.
- Only the message value's second sentence changes. The code, the fields and the shape stay.
- The form's reading of SKP-V0 §4 item 13 (0.3), checked at the architect gate: no field, literal or shape changes, so no version string and no §8 entry are owed. The message's content is defined by §5 as the Display output, and it is not versioned.
- Rule (00): this is the piece's only path under protocol/ (§9).

2.4 The seam. Engine Display → kernel error_of → SkpError → shell formatRefusal → RefusalBlock. The diff edits no interface on it. The real-shape proof is the e2e pair (§4, M-2 and M-3). The suites drive openPath through the built app against the real explicit-null fixture.

2.5 The re-aim (§8 item 1).
- No code before e2e-stale-expectations-reaim merges. Its branch edits both e2e files (frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:427 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD; frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:429 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD).
- Before code, the custodian writes Amendment 1 (class 3, pre-code). It:
  - names B, the main commit after both merges;
  - pins at B, as `path:line @ B sha256`, every place §2.1 marks in;
  - pins at B every use of `CRS_UNDECLARED_MESSAGE` in both e2e files, found by grep at B. A use the re-aim added is in scope as a test that quotes it;
  - re-pins 0.2's facts at B, or names which of pin and tree is authoritative where one moved;
  - states the rule (00) check (§9).
- The STOP conditions are §5's invalidators.

2.6 Observed, not in scope. The custodian may record each as a node.
- formatRefusal.test.ts's synthetic detail is produced by no raise site.
- Row N4 cites error.rs lines that hold other code.
- KNOWN-LIMITATIONS.md:50's comment cites error.rs lines that hold other code.
- PLAN.yaml:4456 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD says item 2's quote follows this ruling in whichever piece lands second. The later ruling at line 34, as this node records it, keeps item 2's quote. Reconciling the two is the custodian's.

2.7 Portability (state/directives/PORTABILITY-2026-09-30.md:33-65 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD).
- R1: the message and the admission semantics do not depend on the platform.
- R2 to R4: no OS-dependent feature and no OS cfg. R3 is not triggered.
- R5: no level is claimed. The e2e evidence is Windows/WebView2 only.
- R6: nothing is ignored.

## §3. Fixtures

| Fixture | Predicted |
|---|---|
| no-crs-refused.parquet (target/fixtures/manual-walkthrough, written by kernel/tests/manual_walkthrough_fixtures.rs's generate_the_no_crs_refusing_fixture, explicit null) | at C1: refused engine.crs_undeclared, with the old message; at H: refused engine.crs_undeclared, with the new message and the detail from crs.rs:286-288 |

- The fixture is sha256-hashed before and after each run. It must not change.

## §4. Tests and mutations

Every mutation is observed by applying it, running the named command, recording the failure by name with the commit it was observed at, and reverting it. A verify-mutation run is never called an observation (round 25, item 2 (c)).

- **T-1 (conditional on OPEN-2 (A)), a new `#[cfg(test)] mod tests` at the end of engine/src/error.rs.**
  - Proposed name: `the_crs_undeclared_message_is_the_human_wording_byte_for_byte`.
  - It calls `crate::crs::admit(None, None, None)` and takes the error. It asserts the error's `to_string()` equals the full message: line 33 with the detail from crs.rs:286-288 filled in, the same value as both e2e constants.
  - Its doc says that the wording is the human's (by the directive's path and item 5) and that rewording it must break this test. There is no path:line in it.
  - **M-1:** restore the old second sentence in the Display arm. Run `cargo test -p spatial-engine --lib the_crs_undeclared_message`. Predicted: T-1 fails by name on the assert_eq.
- **Changed e2e expectations** (the constants are the assertions' expected values):
  - **M-2 (regression.mjs).** The mutation is the old engine text: at C1, the constants are changed and error.rs is not. Predicted: B2'/B3' fails, with stepRefusal's refusal-message-mismatch error.
  - **M-3 (admission-remediation.mjs).** Same C1. Predicted: ASSERT' fails with refusal message mismatch, and NOPERSIST' fails with message mismatch. The suite continues after a failed step (frontends/shell/e2e/admission-remediation.mjs:778-790 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD).
  - In the C1 runs, other steps' statuses are recorded and claim nothing. Steps that follow from ASSERT' not admitting may fail as a consequence.
- **formatRefusal.test.ts.** Data only. Its assertion compares the synthetic input with itself, so no mutation can be observed failing it. None is recorded, and §1 claims nothing for it.
- **v0-error-example.json.** Data only. Its two loaders' assertions are unchanged and still hold. No mutation.
- **Row B2.** An operator row, so no mutation.
- No other test changes. No sleep, retry or timeout is added.

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- P-1: T-1 passes at H, and M-1 fails it.
- P-2: M-2 and M-3 fail by name at C1, as §4 says.
- P-3: at H, B2'/B3', ASSERT' and NOPERSIST' PASS.
- P-4: every suite in §9 passes, in CI on both platforms. fixtures.test.ts, fixtures.rs, admitDataset.test.ts and candidate_a.rs pass unedited.

Declared unchanged:
- every line of engine/src/** except the Display arm's string, OPEN-1's comment and T-1;
- the first clause; every detail, field and code;
- kernel/**; protocol/skp/src/**; SKP-V0.md; the SKP literal;
- frontends/shell/src/** except formatRefusal.test.ts;
- every walkthrough row except B2; every result log;
- KNOWN-LIMITATIONS.md; engine/ADMISSION-RESULTS.md; RELEASE-0.1.md;
- no pub item, dependency, OS cfg, ignore or Cargo change.

Invalidators (stop, return to the architect, record class 2):
- At B, the re-aim's constants differ from main 142af722's text other than by position.
- A use of `CRS_UNDECLARED_MESSAGE` at B carries a different detail.
- A C1 run fails a named step anywhere other than its message check.
- An H run fails a named step's message check.

Falsification:
- Any 0.2 fact differs at B, making the wording untrue of the code. This includes a change to the pinned versions, or to the absent-key, null or non-object branches.
- Stop, and tell the human before any edit.

## §6. Instruments

- T-1 asserts structure: an exact string.
- The e2e steps are pass or fail, by step id.
- No measurement and no docs/08 row.

## §7. Declared values and ceilings

- Count with `git diff --numstat B...H -- <paths>`, by §21c's rule. B and H are named in the PR body.
- Code and tests, at most 65 changed lines:
  - engine/src/error.rs at most 40: the Display string at most 6; OPEN-1's comment at most 6; T-1 at most 28;
  - frontends/shell/e2e/regression.mjs at most 10, inside the constant;
  - frontends/shell/e2e/admission-remediation.mjs at most 10, inside the constant;
  - frontends/shell/src/admission/formatRefusal.test.ts at most 6, inside crsUndeclared();
  - protocol/skp/tests/data/v0-error-example.json at most 2, line 3 only.
- Documents: frontends/shell/MANUAL-WALKTHROUGH.md at most 2, row B2 only.
- Non-generated files, at most 9:
  - this form and PLAN.yaml;
  - the six files above;
  - engine/README.md, which carries the owner's-index update only and is outside the line count.
- No constant is added.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Any code before all of these: this form committed with the custodian's hashes; both e2e-stale-expectations-reaim and filter-identity-alias-ambiguous-reached-through-skp merged; Amendment 1 committed.
2. A place where the message differs from line 33 (indentation removed, {detail} filled) by any byte. The reviewer checks each in-scope place by script.
3. The first clause, a detail, a field, a code, a variant or a raise site changed.
4. Any edit to a place §2.1 marks out, or to anything §5 declares unchanged.
5. Any change to the SKP literal, SKP-V0.md or a fixture other than v0-error-example.json line 3's message value.
6. Different words proposed, or the human's wording paraphrased, anywhere in the diff, the form or the PR body.
7. A guidance string added for this code.
8. A path:line cite in a code comment.
9. A new pub item, dependency, OS cfg, ignore, sleep, retry or timeout.
10. The PR body's quotation of the string not byte-copied by script, or not marked as such.
11. The round-25 items, by name:
    - a §7 overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a verify-mutation run called a mutation's observation;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates

- **Architect and reviewer (§21a; §25(e)).**
  - Verdicts follow state/directives/2026-10-05-product-first-direction.md:15 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD.
  - They block only on Correctness or Evidence. Documentation findings are fixed in this PR before the merge.
  - A quotation of the human's words that does not match line 33 is never documentation-only.
- **Architect:**
  - the wording against 0.2 at B;
  - ADR-015 §2 and Amendment 1 items 3 and 4;
  - 2.3's version reading;
  - the seam (2.4);
  - §8 item by item.
- **Reviewer:**
  - the full diff;
  - §8 item 2 by script;
  - M-1 to M-3, each observed with its commit id;
  - the §7 count;
  - the owner's-index update against the diff.
- **Suites:**
  - `cargo test -p spatial-engine --lib`;
  - `cargo test -p spatial-skp --test fixtures`;
  - `cargo test -p spatial-kernel --lib`;
  - in frontends/shell: `npx vitest run src/admission src/skp`;
  - `cargo fmt --all --check`;
  - the workspace, by CI on both platforms;
  - the node --test scripts suite, verify-plan, verify-cites, verify-quotes and verify-test-claims.
- **Heavy runs** follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD). Counts are set in advance:
  - the suites once each at H; M-1 once;
  - e2e: regression.mjs twice (C1, H) and admission-remediation.mjs twice (C1, H), with the app built at C1 and at H.
  - A re-run is made only on the custodian's word, under the machine paragraph's timing rule, and is recorded.
- **Merge:** a merge commit, never a squash.
- **The human's sight:** the PR body shows the string, byte-copied by script and marked so: the T-1 value, and line 33 as the template (directive line 34).
- **Operator:** row B2's expected text changes. No row is added and no result log is edited.
- **Owner's-index update before the final gate** (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:12 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD). lead-data writes it, the worker applies it in this PR, and the final review checks it against the diff. In engine/README.md, Owner's index:
  - Typed refusals (engine/README.md:510 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD): T-1 joins its pins (OPEN-2 (A) only);
  - Governed by, preregistrations in this module (engine/README.md:519 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD): this form;
  - Last verified at (engine/README.md:499 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD).
  - kernel/README.md: no pointer changes. lead-data confirms.
- **KNOWN-LIMITATIONS:**
  - Item 2 is not touched (line 34; the node).
  - No item is owed: the change makes the message true and reduces nothing.
- **Overlap, rule (00).** The paths are those in §7. One is under protocol/: protocol/skp/tests/data/v0-error-example.json.
  - At dispatch, the custodian checks that no in-progress piece and no PR awaiting merge touches:
    - protocol/;
    - engine/src/error.rs;
    - either e2e file;
    - formatRefusal.test.ts;
    - MANUAL-WALKTHROUGH.md Part B;
    - engine/README.md.
  - skp-v0-live-sections-current-area-c starts only while no other piece or open PR touches protocol/ (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:27 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD). The two run in sequence.
  - stale-test-names-and-comments edits e2e/regression.mjs (PLAN.yaml:4474 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD), so the two are sequenced.
  - module-docs-stale-statements edits engine/README.md (PLAN.yaml:3820 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:HASH-TBD), so the two are sequenced.
  - known-limitations-item-2-on-main-paragraph edits KNOWN-LIMITATIONS.md, which this piece does not touch. They are disjoint.

## §10. Amendments

(opens empty)
````

## 3. OPEN items

**OPEN-1: engine/src/error.rs:27-29, the variant's doc comment, which this change makes false.**
- The comment says the old sentence was kept verbatim because the walkthrough and an SKP fixture quote it. After this piece, both quote the new text.
- Line 34 says nothing else changes, so editing the comment is outside the line.
- Options:
  - (A) Replace the false clause with the current fact. The Display text is the human's wording, cited by the directive's path and item 5, with no path:line; rewording it is the human's decision. Keep the §12d P6 clause. At most 6 lines.
  - (B) Delete only the false clause. At most 3 lines.
  - (C) Leave it. The piece then ships a comment in its own file that is false at H.
- Recommendation: (A).
- Not a red line.
- What waits on it: §7's error.rs sub-ceiling. It must be answered before Amendment 1. Nothing else waits.

**OPEN-2: a test that pins the text at its source** (the impact read's question 5).
- No engine or kernel test asserts the Display text.
- The e2e constants are the only full-text checks, and they run on the dev machine, not in CI.
- Adding a test is outside line 34.
- Options:
  - (A) T-1, a new unit test in engine/src/error.rs (a file already in scope). It reaches the real (a) raise site through crate::crs::admit and asserts the exact string. M-1 restores the old sentence. This follows the precedent in formatRefusal.test.ts, where a human-ruled string is asserted verbatim so that a rewording breaks a test.
  - (B) No source pin. The PR's e2e runs are the proof, and CI never sees the text.
  - (C) Extend the existing assertion at engine/src/crs.rs:332-336. That changes an existing assertion in a fourth engine-side place.
- Recommendation: (A).
- Not a red line.
- What waits on it: §4's T-1 and M-1, §7's T-1 sub-ceiling, and the engine/README.md:510 index line. The draft is written for (A). Under (B), those three items fall away and §1's first may-claim bullet is struck.

**Not OPEN, for the custodian:**
- The SKP fixture: the node gives the call to the form, and the form puts it in.
- The version reading: no bump; the architect gate checks it.
- PLAN.yaml:4456's sentence on item 2's quote, which conflicts with line 34 as this node records it. The reconciliation is the custodian's.

## 4. Files read; the impact read's pointers

Files read:
- the impact read, whole
- the directive, whole
- area E instructions, whole
- custodian check :95-164
- PLAN.yaml 4474-4495, 3805-3821, 4405-4420, 4441-4457 (and searches)
- AUTONOMY.md 306-490
- docs/PREREGISTRATION-TEMPLATE.md, whole
- product-first direction, whole
- PORTABILITY-2026-09-30.md 20-79
- machine directive, whole
- LEAD-DATA-PILOT-V2, whole
- engine/src/error.rs 1-60, 270-294
- engine/src/crs.rs 240-339
- engine/src/geoparquet.rs 1-60, 270-309, 420-619
- engine/src/dataset.rs 340-439, 1215-1229, 1330-1344
- kernel/src/skp.rs 2030-2049
- kernel/tests/manual_walkthrough_fixtures.rs 140-167
- protocol/skp/SKP-V0.md 278-337
- protocol/skp/tests/fixtures.rs 370-389
- protocol/skp/tests/data/v0-error-example.json
- protocol/data-plane/tests/candidate_a.rs 658-685
- formatRefusal.test.ts, whole
- admitDataset.test.ts 95-114
- fixtures.test.ts 455-479
- RefusalBlock.tsx 20-34
- regression.mjs 80-95, 2336-2365, 2622-2631
- admission-remediation.mjs 60-77, 205-219, 645-662, 778-828
- MANUAL-WALKTHROUGH.md 88-93, 168-178, 584, 608-617, 944-948 (and searches)
- KNOWN-LIMITATIONS.md 40-51
- engine/README.md 495-530
- kernel/README.md 346-387
- ADR-015 36-49, 153-187
- docs/05 18-37
- the re-aim form 316-335, 418-437
- the filter-identity form, whole
- Cargo.toml names of engine and protocol/skp
- whole-tree searches for the message fragments, `CRS_UNDECLARED_MESSAGE`, `CrsUndeclared`, `FormatDefault`, CRS84 and `v0-error-example`

**Pointers used:**
- error.rs :282-286 and :27-29
- crs.rs :286-288 and :332-336
- geoparquet.rs :37, :450, :509, :574-578
- dataset.rs :398-403
- skp.rs :2041-2047
- SKP-V0.md :325-326 and :281-285
- RefusalBlock.tsx:29
- both e2e constants and their step sites
- formatRefusal.test.ts
- admitDataset.test.ts :100 and :112
- fixtures.test.ts:472
- candidate_a.rs :668 and :677-680
- fixtures.rs :380-383
- manual_walkthrough_fixtures.rs
- walkthrough rows :92, :176, :584, :608, :617, :947
- KNOWN-LIMITATIONS.md :43-50
- ADMISSION-RESULTS.md :13 and :33
- engine/README.md :510 and :523
- ADR-015 :46-47, :173-178, :180-184
- docs/05
- the §4 overlap table
- the re-aim budget rows :427 and :429
- the filter-identity form :286
- the branch lines at ef1cc519, in words

**Found wrong:**
- None materially.
- One imprecise pointer: §4 cites PLAN.yaml:4484 as the evidence that filter-identity touches protocol/. That line is this node's depends_on. The protocol/ fact is in the filter-identity form, kernel/FILTER-IDENTITY-ALIAS-AMBIGUOUS-THROUGH-SKP-PREREGISTRATION.md:283.
- manual_walkthrough_fixtures.rs:143-166 starts mid-doc-comment (the doc starts at :142). It is harmless.

**Missing:**
1. dataset.rs:411-415: an assertion drops the format default. It is needed to check that "only when" is true.
2. dataset.rs:1223 and :1338-1339: an absent key under a pinned version can still be refused, under format_default_contradicted.
3. The assertion route's own refusals, for the wording's second half: dataset.rs:374-376, crs.rs:279-285, dataset.rs:422-426.
4. geoparquet.rs:556-571, the R-C2 branch itself, and :555.
5. PLAN.yaml:4456, where item c's node says item 2's quote follows this ruling, against line 34.
6. stale-test-names-and-comments (PLAN.yaml:4474) also edits e2e/regression.mjs. That is an overlap the §4 table omits.
7. module-docs-stale-statements (PLAN.yaml:3820) edits engine/README.md, the file that carries this piece's index update.
8. admission-remediation.mjs:778-790: runStep continues after a failure. The red run's design relies on it.
9. The decisive fact for questions 4 and 1: the human's wording keeps the first clause byte for byte. So the prefix quotes in admitDataset.test.ts:100 and candidate_a.rs:668 contain nothing that changes.
10. The directive's line 33 carries three spaces of list indentation that are not part of the message. This matters for the byte check.
