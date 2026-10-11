# engine.crs_undeclared's message in the human's words
# (PLAN node crs-undeclared-message-wording)

File: engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md
Authority:
- the node: PLAN.yaml:4477-4493 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:542bd1c0641904a951f1b508ed70ba02409423a46afc3ea7ec97aea2fb70398a
- the wording: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:33 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:6fab951e5e8386de3008ac3f5640185edb64fc7632e23482f0b0567602148964
- the scope and the human's sight at the PR: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:34 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:48b179c463e4a1327074b0d73feaf3cb7b05fca2ac87694a453e2e6f1a0fa89b
- the placement (slot 2, after filter-identity-alias-ambiguous-reached-through-skp, not before the re-aim has merged): state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:36 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:b9d820912b82dca112a33a3ef86fa8a9cad3f81b4a709b07886834be56a62e6b
- forms ahead: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:38 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:2eba54a30650266443f7bfd35cb1581b050063d7db93623b0ad2b648a7d92c4d
- the directive has a RULED block in DECISIONS-PENDING.md
- the human's area E instruction that asked for the wording: state/directives/2026-10-10-drift-sweep-area-e-instructions.md:12 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:beafcb7fb2917779c90636792809de03e531cc780f69018a3b5980e56ee0512c
- the custodian's answer, when the refusal fires on main: state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md:124-136 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:f58fd1369e47e545f698ef922cbf013b53e4a236d401fc8aa5fc44a2500013cc
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
- The Display arm: engine/src/error.rs:282-286 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:c694682c2937e88b3a123303bfc11bb8795cbbfe6a29d27e7ee409817b50e127.
- The text the piece replaces is the second sentence only: engine/src/error.rs:285 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:21c02814c1893b24804220c077d31f89e5611b485e3adacd708711deca399e3d. The first clause, at engine/src/error.rs:284 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:2fd898fa66b267a44f1776f61c5fc49f21a4518184fd98b03cbaf6cc8d4f2c21, is byte-identical in the human's wording.
- The message reaches the wire as the Display text: kernel/src/skp.rs:2041-2047 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:e6b01da2edeb66c070a6808b33bf915523b93d3be1aaa48b508dbd662995307f. SKP-V0 §5 defines it so: protocol/skp/SKP-V0.md:325-326 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:8363598a8624e8a2af14e065f498efa55dc6c311d0c3c6947cd629ae00de9157.
- The shell renders it verbatim: frontends/shell/src/admission/RefusalBlock.tsx:29 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:67110e27507ed72189da4a326e74f5e8d1645fface69e3ef3b0ce1198b823213.
- The variant's doc comment says why the old sentence was kept: engine/src/error.rs:27-29 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:1b51ba3a6cbd0487607496027f6418a5a817e8e161643fe1ed5cf98ab1125e98. This change makes it false (OPEN-1).

0.2 When the refusal fires on main, and when the format default is applied. These are the facts the wording states.
- The pinned versions are exactly two strings: engine/src/geoparquet.rs:37 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:49a814bfa409a470a50ba1a090d439af2d22b1a0d7db7ca06eccf852fd87130c. They are compared as exact strings: engine/src/geoparquet.rs:509 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:eb2ed98122d6a02726f29ea5af5872c61a0ee5cae16b5465f4d29a86dd709554.
- The crs key has three states, and a value that is neither an object nor null is read as null: engine/src/geoparquet.rs:435-451 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:180d5a17e09c8883d69ab9d508fb1232102d65297e8f5e7bdea6ffdbbee67418.
- With an explicit null, nothing is established: engine/src/geoparquet.rs:555 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:098c01951c38ac3762902ae20e04d35a8fc2fe5d7517133b184807ee87fe053c.
- With an absent key under a pinned version, OGC:CRS84 is applied with provenance crs:format-default: engine/src/geoparquet.rs:556-571 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:02c214191ee716dd9bd5d74dcb5481f58850453346e4b38b116881eeeb737611.
- With an absent key under any other version, no rule is applied, and a detail names the version: engine/src/geoparquet.rs:572-582 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:0f017f7884963e3640b1b27a0602a1473f4f16b0239d9465c5c11a81a0ba4145.
- Raise site (c), the absent key under an unpinned version with no assertion: engine/src/dataset.rs:398-405 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:dc95349492dafb9d3aae9a7bb6825cede83271259e7cb83dd108e7af6e2ede97.
- Raise sites (a) and (b), nothing established and no assertion: engine/src/crs.rs:286-288 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:0f89d07c0f8010b6aef7e44c32a24ede99478d063d18074739d0f99b532d1ca5.
- When the caller asserts, the format default is dropped and the assertion is admitted: engine/src/dataset.rs:411-415 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:9dce7e856872b17846484363084a38f1b685fda9ae779e0bf0abfe7f6ee89260; engine/src/crs.rs:279-285 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:a23e72bfd5b81d8c59bc278a926b23e281a9700d0ce6c8496ac9d164ef46c7c1.
- An absent key under a pinned version whose bbox leaves the CRS84 domain is refused under a different code, engine.format_default_contradicted: engine/src/dataset.rs:1223 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:52ef98b4f78f754eab67315bd12843b5519571147ed79a975269102bf9960aa6; engine/src/dataset.rs:1338-1339 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:28820a16e9adc61c22b4df1d723f5c3b87088d1bb8a7a62042398b3e480c00b2.

0.3 Governing texts, cited and not amended:
- ADR-015 §2: docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:46-47 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:2daef4144631f1bce86e0845c4d52b73f80779f2f54dc4213df4987eeb501934.
- ADR-015 Amendment 1, item 3: docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:173-178 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:d57895ffb67cb6c5203960c325fc94fbffdf9e8595cfb3b098b26232b2d2787d.
- ADR-015 Amendment 1, item 4: docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:180-184 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:7036d429fdfdbfd238564a54e381b310b8515decc0a2311fcad5359aeea4ee42.
- docs/05's no-silent-conversion rule: docs/05_Data_Engine.md:25 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:d90e22ab2d83c452d22bf8bfaa28325b93a757cd865eab4f2a8125ea2e3b8bd6.
- SKP-V0 §4 item 13: protocol/skp/SKP-V0.md:281-285 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:b4170741d0929ea5bc56a1866c24c24d4025bf73c3fc8468c940ecbbf0b6a4a4.

0.4 The re-aim branch, read in words and not pinned (custodian-checked with git show):
- the constant in frontends/shell/e2e/regression.mjs, lines 94-97 at ef1cc519;
- the constant in frontends/shell/e2e/admission-remediation.mjs, lines 74-77 at ef1cc519.
- engine/src/error.rs lines 284-285 at ef1cc519 are equal to main.
- The assertion lines on the branch were not checked with git show. They are named by step id here and pinned at B by Amendment 1.

0.5 Existing pins of the text.
- No engine or kernel test asserts the Display text. Both pin the variant only:
  - engine/src/crs.rs:332-336 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:7c3bc3aa8b1a722b14efeec4f31713660d07f71c339dc67e1b6ac473cf9f84bb
  - the kernel mapping test, unchanged.
- The full-text checks against real output are the two e2e constants (§2.1). They run on the dev machine, not in CI.

0.6 Reuse index (the human's standing step). At 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, the custodian's node tools/reuse.mjs recorded no prior art for crs undeclared message wording refusal. Noted, not blocking.

0.7 Gating route.
- §21c's bound excludes new user-visible behaviour: AUTONOMY.md:350-351 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:ab244b928ccaaaddf7cee273363bc2481ad0e53cd6aa97d1e57fe8f7eefcd333.
- §21a lists any property currently under test: AUTONOMY.md:325-327 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7.
- §21a lists protocol/skp/**: AUTONOMY.md:323-324 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:90dd5aaa322e44946970eecb24134b69e410c15e357bfa9cdd5ef5c4459bca59.
- So the full form and both gates apply from dispatch: AUTONOMY.md:482 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669.

0.8 Budget. The node declares 45 minutes. The full form, two gates and four e2e runs exceed that. The custodian records the deviation in PLAN. It is not a §7 figure.

0.9 Fixture drive: no measurement, and the 5 GB fixture is not used.

## §1. May and may not claim

- May claim:
  - The Display of CrsUndeclared, as raised by the real (a) site, equals the directive's line 33 byte for byte, with {detail} filled from that site. Proof: T-1 and M-1 (§4), conditional on OPEN-2 (A).
  - Through the shell on Windows/WebView2, steps B2'/B3', ASSERT' and NOPERSIST' pass at H. They failed by name at C1, with the old engine text (M-2, M-3).
  - By reading at B (0.2, re-pinned by Amendment 1), the wording is true of the admission code in all three raise cases. §2.2's notes apply.
- May not claim:
  - that the new text was run through the shell for case (b) or case (c). The e2e fixture is case (a) (kernel/tests/manual_walkthrough_fixtures.rs:159-167 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:d7e79114a6b35c020d7cdf59de95694140f7de4cb24d37816dff25c13d3d0306);
  - anything about macOS or Linux shell behaviour;
  - any change to KNOWN-LIMITATIONS, the v0.1.0 notes or engine/ADMISSION-RESULTS.md;
  - any SKP literal, field or version change;
  - any guidance string, performance figure or docs/08 row.
- No ADR is amended. No pub item, dependency or variant changes, and no detail, field or code.

## §2. The change

2.1 The places, decided one by one under line 34's rule.

| Place | Decision | Reason |
|---|---|---|
| engine/src/error.rs:285 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:21c02814c1893b24804220c077d31f89e5611b485e3adacd708711deca399e3d (the second sentence) | in | the source |
| frontends/shell/e2e/regression.mjs, `CRS_UNDECLARED_MESSAGE` (main: frontends/shell/e2e/regression.mjs:89-92 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:621953544dae9e40fe9559fd2463bc40844e17576bdc85c7f85d24e92521de6f), asserted in step B2'/B3' | in | an e2e constant that quotes it |
| frontends/shell/e2e/admission-remediation.mjs, `CRS_UNDECLARED_MESSAGE` (main: frontends/shell/e2e/admission-remediation.mjs:70-73 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:621953544dae9e40fe9559fd2463bc40844e17576bdc85c7f85d24e92521de6f), asserted in ASSERT' and NOPERSIST' | in | an e2e constant that quotes it |
| frontends/shell/src/admission/formatRefusal.test.ts:24-32 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:b2188a7f7361633d678a1f0bf57c1a9bc44229552ed3625eaa4d91866aa21572, its second sentence only | in | a test that quotes it. Its synthetic detail stays: line 34 changes the text, not the detail (§5) |
| protocol/skp/tests/data/v0-error-example.json:3 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:7ca5998456145ec42bbf14fcb029a62332b708d86da9ac899e403eb90885a37d, the message value's second sentence only | in (2.3) | test data that quotes it byte for byte; the node gives the call to this form |
| frontends/shell/MANUAL-WALKTHROUGH.md:176 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:fd812b844daaebb822b543a9b85bbae590624230fe52ae4d53a938c46b439c1e (row B2), the quoted message's second sentence only | in | a walkthrough row that quotes it; no result log edited |
| frontends/shell/src/admission/admitDataset.test.ts:100 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:cd23a1eea03d6432705413ec15e190a69eb973738a24c7597c1d1548e6df5920 | out (line 34) | quotes only the first clause, which is unchanged |
| protocol/data-plane/tests/candidate_a.rs:668 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:a033d844c4685ca58fdaa4162e6f275912f44a3a0bf03de3f85e65aec4afccb0 | out (line 34) | quotes only a prefix of the first clause, which is unchanged; its substring assertion still holds |
| frontends/shell/src/skp/__tests__/fixtures.test.ts:472 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:6b1ff40d0551ddf1a9ccaa2cef76f778e0bd98f14823098161f6be2eadccf905 | out (line 34) | asserts a substring, OGC:CRS84, which the new text keeps |
| frontends/shell/MANUAL-WALKTHROUGH.md:92 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:472523517956d5155a28a9a7217ccf13e988c91c8425a09401779c362c03eac5 (coverage row B2'/B3') | out (line 34) | names the verbatim message without quoting it; stays true |
| rows I1, ASSERT', NOPERSIST', N4: frontends/shell/MANUAL-WALKTHROUGH.md:584 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:aebc88901d5499e301167a92836bfec66ad1cd5a1261fff8c122633500583e92; frontends/shell/MANUAL-WALKTHROUGH.md:608 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:0757478e69fd96200301ba2ded75ec813bea7b290feba5b27b0e25f4d067a758; frontends/shell/MANUAL-WALKTHROUGH.md:617 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:03024598853d7add9dfe627b1f275618bf4a28ce18554d8e1113db760f5d1689; frontends/shell/MANUAL-WALKTHROUGH.md:947 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:9612cf0e263ebab0a054f44a3174331618d8b20f278124279372d186075f40b0 | out (line 34) | refer to B2's quote by reference; stay true. N4's stale error.rs cite is observed (2.6) |
| e2e pointer comments: frontends/shell/e2e/regression.mjs:86-88 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:b46ea5b5683b3ee6f56a7787591e08388837d85683c476ace3fdc5240c7859b0; frontends/shell/e2e/admission-remediation.mjs:67-69 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:7cfe43322944af52ad3c89675ad3ad8f3a83f4e6252c1d96f41469bc61a4984b | out (line 34) | say the constant is verbatim from error.rs, which stays true |
| engine/src/error.rs:27-29 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:1b51ba3a6cbd0487607496027f6418a5a817e8e161643fe1ed5cf98ab1125e98 | OPEN-1 | the change makes the comment false |
| KNOWN-LIMITATIONS.md:43-50 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:4ca08bf6027d846806e93a137ede0cf0abda93220d5fc72f9e588db3f4de9d30 (item 2) | out (line 34; the node) | a v0.1.0 note; keeps its quote |
| engine/ADMISSION-RESULTS.md:13 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:121b27b88e36fc927893e04b96f41a31857c0afaa1ee99e069f3b847e770319b; engine/ADMISSION-RESULTS.md:33 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:7472c7cef3b70158c988413cb544e4c078966cdd42b7d8726169fc9661dac40d | out (the node) | a results record |
| records under state/ that quote the old sentence | out | records |

The new text in every in-scope place:
- It is the directive's line 33 from `refused:` to the line's end, with the line's three-space list indentation removed. The custodian's script confirms that the line carries no trailing whitespace.
- In each quoting place, {detail} is the detail that place already carries. Only the second sentence changes.
- In error.rs, the string is split across lines with a `\` continuation, which removes the newline and the next line's leading whitespace. The rendered bytes are what T-1 checks.
- Markdown escaping in row B2 follows the row's existing convention. The new sentence has no backticks: the crs key is written plain, as in line 33.

2.2 Is the wording true of the code? Yes, in all three raise cases (0.2): (a) an explicit null; (b) a crs value that is neither an object nor null; (c) an absent key under an unpinned version. In none of them is the key absent under 1.0.0 or 1.1.0, and in each an assertion is the route to an open. Precision notes for the human's sight at the PR. They are not proposals, and no word is changed:
- N-a. The words "only when" give a necessary condition. With a caller assertion, the default is not applied even to an absent key under a pinned version (dataset.rs:411-415, 0.2). An absent key under a pinned version whose bbox leaves the CRS84 domain is refused as engine.format_default_contradicted (0.2).
- N-b. On the advice to assert a CRS: the assertion itself is refused if its identifier is blank or oversized (engine/src/dataset.rs:374-376 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:db922b2132ee341cea98717a580cca77cc390babc24adc270f99444f68a8070d). It is also refused if its definition has no coordinate system (crs.rs:279-285, 0.2), or if its order is not x-first (engine/src/dataset.rs:422-426 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:6ec8b326dafa7d83c0d73d743edcd3f92d36f9d33528fdd9cc8d1289f137bec4). The shell's catalog entries, EPSG:2056 and EPSG:3857 (row I1), are both x-first.
- N-c. In case (b), the unchanged first clause says the file declares no CRS. That is the engine's reading of a value it cannot use (geoparquet.rs:435-451, 0.2).
- N-d. The version is geo.version, matched exactly: a value such as 1.0 is not 1.0.0.

2.3 The SKP fixture (the node's question; impact-read questions 1 and 2).
- It counts as a test that quotes the message:
  - it sits under tests/;
  - two tests load it (protocol/skp/tests/fixtures.rs:380-383 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:0b55eb1c758791c5df821632ac83d5a7c081012fffad41de28d67a479b4e23a5; fixtures.test.ts:472, 2.1);
  - it carries the message byte for byte;
  - SKP-V0 §5 makes the message the Display text (0.1), so the worked example would otherwise disagree with the engine.
- Only the message value's second sentence changes. The code, the fields and the shape stay.
- The form's reading of SKP-V0 §4 item 13 (0.3), checked at the architect gate: no field, literal or shape changes, so no version string and no §8 entry are owed. The message's content is defined by §5 as the Display output, and it is not versioned.
- Rule (00): this is the piece's only path under protocol/ (§9).

2.4 The seam. Engine Display → kernel error_of → SkpError → shell formatRefusal → RefusalBlock. The diff edits no interface on it. The real-shape proof is the e2e pair (§4, M-2 and M-3). The suites drive openPath through the built app against the real explicit-null fixture.

2.5 The re-aim (§8 item 1).
- No code before e2e-stale-expectations-reaim merges. Its branch edits both e2e files (frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:427 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:c4deab40a45feda6e2b3727da39995f8e8a9215abfca226eb5cf427df972050f; frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:429 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:95aa083d67243bda8eabd6b82c6922f0d18363bc23f76fe95d8c661e7c7113de).
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
- PLAN.yaml:4456 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:e838e27b9bffdd14025727da4befbf388e4b4ead06860390fe9099fe9233e1d9 says item 2's quote follows this ruling in whichever piece lands second. The later ruling at line 34, as this node records it, keeps item 2's quote. Reconciling the two is the custodian's.

2.7 Portability (state/directives/PORTABILITY-2026-09-30.md:33-65 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:858fbe6132793c3558641015f865790dd3845749591c18b495a955b7fd2944ff).
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
  - **M-3 (admission-remediation.mjs).** Same C1. Predicted: ASSERT' fails with refusal message mismatch, and NOPERSIST' fails with message mismatch. The suite continues after a failed step (frontends/shell/e2e/admission-remediation.mjs:778-790 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:999508d2be46c188eab0a392463a65d0c7f9859ec7f469489f288051a8f05273).
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
  - Verdicts follow state/directives/2026-10-05-product-first-direction.md:15 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751.
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
- **Heavy runs** follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1). Counts are set in advance:
  - the suites once each at H; M-1 once;
  - e2e: regression.mjs twice (C1, H) and admission-remediation.mjs twice (C1, H), with the app built at C1 and at H.
  - A re-run is made only on the custodian's word, under the machine paragraph's timing rule, and is recorded.
- **Merge:** a merge commit, never a squash.
- **The human's sight:** the PR body shows the string, byte-copied by script and marked so: the T-1 value, and line 33 as the template (directive line 34).
- **Operator:** row B2's expected text changes. No row is added and no result log is edited.
- **Owner's-index update before the final gate** (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:12 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:6baf1cbfb7e93952f2c41c71be144cafc5c06ced596e2b8f4d3db5410b42821c). lead-data writes it, the worker applies it in this PR, and the final review checks it against the diff. In engine/README.md, Owner's index:
  - Typed refusals (engine/README.md:510 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:b14ce703fc202a6048ecea5d5e395bc91ed5c4cd1ab4aec13df733fada72024c): T-1 joins its pins (OPEN-2 (A) only);
  - Governed by, preregistrations in this module (engine/README.md:519 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:448fc63ee2af4706d0922e38348e168604619b3799c508e4b9098b6474d58aa3): this form;
  - Last verified at (engine/README.md:499 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:24b07af4e2757a9df10bf423f896fd7795246c890edc446c8c13ed4509cc9014).
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
  - skp-v0-live-sections-current-area-c starts only while no other piece or open PR touches protocol/ (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:27 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:d82e28ea8f74d57fac226d72ca7b7af95c0ee37f2452a8a03f3f454ce671cd0b). The two run in sequence.
  - stale-test-names-and-comments edits e2e/regression.mjs (PLAN.yaml:4474 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:92e2c1b4539e4255db2e5f0e64da7e128a314ae9a385a62f01dc01838e62bdac), so the two are sequenced.
  - module-docs-stale-statements edits engine/README.md (PLAN.yaml:3820 @ 142af722ee555468a20ed40d6ceac843e11f4292 sha256:f0bf75a3c3f906cf5309b01962f681626cb0e1da6aed1c92e08fb81f712cc80c), so the two are sequenced.
  - known-limitations-item-2-on-main-paragraph edits KNOWN-LIMITATIONS.md, which this piece does not touch. They are disjoint.

## §10. Amendments

(opens empty)

### Amendment 1 — the human's rulings on OPEN-1 and OPEN-2 (class 5), and the places at the post-merge base (class 3, pre-code)

*Written by the custodian before any code, after both pieces this one waited on had merged. References and hashes only.*

1. **The rulings:** OPEN-1 (A) and OPEN-2 (A). This amendment appends them, and the human started the piece (`state/directives/2026-10-10-crs-wording-open-1-a-open-2-a-start.md`, line 6, sha256 224f6eb6aecf475e290db6b5fdc7c364eb1f39f2fc105b0aeac9d599a43ff6fa at the commit that adds it; its RULED block in DECISIONS-PENDING.md).
   - **OPEN-1 (A):** the variant's doc comment (engine/src/error.rs:27-29 @ e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 sha256:1b51ba3a6cbd0487607496027f6418a5a817e8e161643fe1ed5cf98ab1125e98) has its false clause replaced by the current fact: the Display text is the human's wording, cited by the directive's path and item 5, with no path:line, and rewording it is the human's decision. Its §12d P6 clause is kept. At most 6 lines, as §7 declares.
   - **OPEN-2 (A):** T-1 and M-1 as §4 drafts them, with §7's sub-ceiling for T-1 and the engine/README.md:510 index line (re-derived at the head by lead-data's owner's-index update).
2. **The waits are met.** `filter-identity-alias-ambiguous-reached-through-skp` merged as c6627398 (PR #202), and `e2e-stale-expectations-reaim` merged as e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 (PR #204). §8 item 1's last condition is this amendment.
3. **The places, pinned at e17758b7.** That is the main commit of the later merge. Main's commits after it change none of these files. §7's B is `git merge-base origin/main H`, named in the PR body.
   - the Display arm's second sentence: engine/src/error.rs:285 @ e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 sha256:21c02814c1893b24804220c077d31f89e5611b485e3adacd708711deca399e3d; the first clause, unchanged: engine/src/error.rs:284 @ e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 sha256:2fd898fa66b267a44f1776f61c5fc49f21a4518184fd98b03cbaf6cc8d4f2c21;
   - `regression.mjs`'s constant: frontends/shell/e2e/regression.mjs:94-97 @ e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 sha256:621953544dae9e40fe9559fd2463bc40844e17576bdc85c7f85d24e92521de6f. Its use, by grep at B: the B2′/B3′ step's `stepRefusal` call, frontends/shell/e2e/regression.mjs:2670 @ e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 sha256:24dae4868ebbc68b13b11c44df7c3680c93132ffe1c9c4097d54465f1c594cdb;
   - `admission-remediation.mjs`'s constant: frontends/shell/e2e/admission-remediation.mjs:74-77 @ e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 sha256:621953544dae9e40fe9559fd2463bc40844e17576bdc85c7f85d24e92521de6f. Its uses: ASSERT′, frontends/shell/e2e/admission-remediation.mjs:220-221 @ e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 sha256:71b001bfde115c053b489c793046f2e8ed0ab9bf3fbc0b71fb246071290f5c63; NOPERSIST′, frontends/shell/e2e/admission-remediation.mjs:708-709 @ e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 sha256:9a936478c8af71c84e1d153a87655cb4e2eef8b8e4b615dc8871ce944998e586;
   - `formatRefusal.test.ts`'s quote, the second sentence only: frontends/shell/src/admission/formatRefusal.test.ts:29 @ e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 sha256:3555894dfcdc0ddfbeff725764db685a55e530115128824294730b830ebdd2bb;
   - the SKP fixture's message value: protocol/skp/tests/data/v0-error-example.json:3 @ e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 sha256:7ca5998456145ec42bbf14fcb029a62332b708d86da9ac899e403eb90885a37d;
   - walkthrough row B2: frontends/shell/MANUAL-WALKTHROUGH.md:176 @ e17758b70ef6541c8a0ed9ed2246bd60fbd53a89 sha256:fd812b844daaebb822b543a9b85bbae590624230fe52ae4d53a938c46b439c1e.
   - The grep found 7 lines naming the constant in the two e2e files (2 in regression.mjs and 5 in admission-remediation.mjs). Every use above carries the detail its constant already holds, so §5's detail invalidator does not fire.
4. **0.2's facts hold at B unchanged:** `git diff --quiet 142af722 e17758b7 -- engine/src/geoparquet.rs engine/src/dataset.rs engine/src/crs.rs engine/src/error.rs kernel/src/skp.rs frontends/shell/src/admission/formatRefusal.test.ts protocol/skp/tests/data/v0-error-example.json` exits 0. So every pin of §0 and §2 at 142af722 in those files names the same bytes at B. The re-aim's two e2e files are pinned above at B.
5. **Rule (00) at dispatch:** no PR is open. This piece is the only one in progress that touches `protocol/` (`v0-error-example.json`), `engine/src/error.rs`, either e2e file, `formatRefusal.test.ts`, the walkthrough's Part B or `engine/README.md`. The docs lane's next piece edits `KNOWN-LIMITATIONS.md` only. Slot 1's next piece has no code yet.
6. **Generation:** the node goes to 2.
7. Nothing above is edited.

### Amendment 2 — the OPEN-1 comment's count, budget overrun, §7 not edited (class 8)

*Written by the custodian after worker report 1 (`state/consults/2026-10-10-crs-undeclared-message-wording-worker-report-1.md`), before the gates. References only.*

1. **The row:** §7 sets the OPEN-1 comment at most 6 changed lines. By §21c's counting, insertions plus deletions, it is 7 at fb95bec0: 4 added and 3 deleted. The minimal comment keeps the §12d P6 clause, and the directive's path alone fills a line.
2. **Inside the file's ceiling:** `engine/src/error.rs` is 29 against its 40. The code and tests total is 49 against 65. §7 is not edited.
3. **Generation:** the node goes to 3.
4. Nothing above is edited.

### Amendment 3 — written after PR #206's gate 1; a record correction to Amendment 2 item 2 (class 1)

*Written by the custodian after both gate reports (`state/consults/gates/2026-10-11-crs-undeclared-message-wording-gate1-architect.md`, D-1, and `state/consults/gates/2026-10-11-crs-undeclared-message-wording-gate1-reviewer.md`, D-1). References only.*

1. **Correction (round 12 (d)).**
   - The defect: Amendment 2 item 2 gives the code-and-tests total as 49 against 65. That total counts `frontends/shell/MANUAL-WALKTHROUGH.md`, which §7 lists under Documents.
   - The corrected figures: code and tests are 47 (37 insertions, 10 deletions) against 65, and Documents are 2 against 2.
   - The proof: `git diff --numstat 496fdd7f...fb95bec0` over §7's lists.
2. **Superseded index (round 12 (e)):** only Amendment 2 item 2's total. Everything else in Amendments 1 and 2 stands, and so do §7's ceilings.
3. **Generation:** the node goes to 4.
4. Nothing above is edited.
