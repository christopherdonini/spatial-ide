*Custodian's filing note (2026-10-09): the architect's draft of the preregistration for `e2e-stale-expectations-reaim`, drafted alone on the custodian's brief at main a576ab37, after the custodian's console solo re-run. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is b60851ce4e54fdee2a45f98e1a9e8a04b61e4bc562540c9b6089838876f7616d. Write audit PASS: zero write calls (Read 63, Grep 51, Glob 3). Run window from the transcript: 12:44:40Z to 13:07:03Z. The form is committed at the draft's own proposed path, `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md`. It is the fenced block with its 112 pins computed at a576ab37, each pinned span's first and last line checked by the custodian. One sentence of §0.R is reworded to stay true once the hashes exist: the custodian computed every hash. Nothing else is changed (sha256 5f5c2ae51dd4bf517c131c7dd9805206ed173abe5cab7d15e4503a8b087d3f34). Appendix B's paragraph and §9's quoted line are byte-identical to their sources, checked by script, so neither is replaced. The draft reports that the piece touches `kernel/tests`, and under its OPEN-1 (A) one feature-gated test-support variant in `engine/src/fixture.rs`.*

---

Reviewed: main @ a576ab3725d77a6f63afc8935cb572eca2cf2dec

I have no git tool, so I could not check the commit myself. I read the working tree as it stands. The session-start snapshot shows main at a576ab37, with nothing tracked modified and only two untracked paths (`.codex-remote-attachments/`, `PROMPT-AUDIT-2026-10-04.md`), so the tree I read is that commit. I read PR #196's tree at `C:\dev\wt\k6`, but could not check its HEAD.

**Before anything else: this piece touches kernel/, and under the option I recommend, engine/ as well.**
- `kernel/tests/manual_walkthrough_fixtures.rs` is test-only, but it is a kernel path. It holds:
  - the generators of the fixtures whose names and comments still say they are refused (lines 477-497 and 527-565);
  - the place where any new test-only generator would go.
- A file that still refuses **and** offers a column whose declaration admits cannot be written with today's fixture writer. Its identity modes write either `id` or `parcel_key`, never both (`engine/src/fixture.rs:528-546`, `:621-627`).
  - Writing that file needs one new variant in `engine/src/fixture.rs`. That module is test support, behind the `fixture` feature, and never shipped (`:4`).
  - Otherwise the route has to be proven a weaker way. That choice is OPEN-1.
- The lead-data pilot has resumed (`state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:31`). Whether it wants an impact read for these test-support edits is your call. I have not read the pilot's own terms.

## 1. Form choice and why

**Full form, full gating (reviewer and architect).** Any one of three reasons is enough:
- **Size (§21c).** Code and tests come to about 800 lines over 6 files, and 9 files in all. Both cross the 150-line / 8-file threshold.
- **Category (§21a).** The re-aimed e2e assertions are "a property currently under test", the guarantee category. The KNOWN-LIMITATIONS paragraph states a limit.
- **§25(e).** An `Out-of-scope` line could not claim that none of the four categories is touched. So no five-line form is written.

Gates are proportional under the product-first direction's section 2.

**What is the human's:**
- OPEN-1: how the still-refusing fixture gets written (it touches engine/).
- OPEN-2: whether to use any product-line mutation at all. None is needed under the recommended option.
- OPEN-3: whether this PR also updates rows I6 and I8, the Part C heading and three fixture-table rows. Each still names a fixture that no longer refuses.
- The sight of rows C2, C3, I4 and I5 (Appendix A).
- The proposed fixture names, which are part of the human's sight.

## 2. The draft

````markdown
# E2E-STALE-EXPECTATIONS-REAIM — preregistration (full form)

Proposed path: `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md`.

## Header

- **Authority.**
  - PLAN node `e2e-stale-expectations-reaim` [R1].
  - The human's additions of 2026-10-09, items 1, 2, 4 and 5 [R2, R3, R5, R6]. Their RULED block in `DECISIONS-PENDING.md` is the one headed RULED 2026-10-09 — additions. It is cited by that heading, never by line.
  - Item 3 [R4] is a separate node and is not part of this piece.
- **Drafted by:** the architect agent, alone, on the custodian's brief of 2026-10-09, at main a576ab3725d77a6f63afc8935cb572eca2cf2dec.
- **Base.** The branch is cut from main after PR #196 (the K6 fix) merges, per the slot order [R2]. `regression.mjs` is edited as #196 leaves it.
- **Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line, and states what it touches or invalidates.

## §0. Disclosure

**Inputs.**
- The triage of node `e2e-failures-present-at-the-base` [R7–R11]. Its finding: every step is a stale expectation, none is a stale fixture, and none is a product defect.
- The custodian's solo re-run of `e2e:console` [R12–R16]. It ran under the exclusive hold, unmodified, on the shipped default arm, at window height 800, at ac89e033. That commit's `frontends/shell/src` and `e2e/console.mjs` are identical to main's. In that run:
  - HEXLIM', REFUSAL' and GROUP' fail as the triage found [R12, R13, R14];
  - REGRESS' fails only through C2'/C3' [R15].
  - So REFUSAL' and GROUP' fail with the machine quiet as well.
- **PR #196's tree.** Read in its worktree, HEAD not verified.
  - The lines this piece edits in `regression.mjs` are the same there as at main: the `stepRefusal` helper [R32] and the C2'/C3' call [R34].
  - The constants above line 2340 sit one line lower in #196's tree.
  - No pin below is at a branch commit.

**Reuse index (the standing step).** `node tools/reuse.mjs`, run by the custodian in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c [R109]:
- no prior art for e2e, end-to-end test, console or playwright;
- candidates for identity (`engine-open-identity`, `stable-identity-copy-move`) and fixture (`real-world-line-test-files`, `geoparquet-conformance-files`). None is drawn on: every change here is a fresh write against this repository's own suites and generators. No port.

**Hypotheses, labelled.**
- **H1 (inferred from code, not observed).** On the shipped arm, each untiled stream's terminal writes a session-log line [R65], and every session-log line is a class-B console entry [R66].
  - So a line can be recorded between two of GROUP''s three calls, which would split their group.
  - The probe and the solo run both show the ×3 group forming [R9, R14].
  - Discriminator: GROUP''s own failure message lists the rows found between the three (§2.3).
- The REFUSAL' latency mechanism is not needed and is not claimed. The triage labels it an inference [R9].

**What the re-aimed source-changed route exercises.** KNOWN-LIMITATIONS item 26 [R71] (owed by [R70]) states that a symlink in the resolved path, repointed after admission, is not seen while idle and is caught at the next query's pre-check. This piece is the first e2e run of that statement, for a directory junction.

**Fixture drive.** Nothing is measured, and the 5 GB fixture is not read.

### §0.R References

Every hash is HASH-TBD, computed by the custodian over whole committed lines, LF bytes. One span per pin.

| id | reference |
|---|---|
| R1 | `PLAN.yaml:4351-4367 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R2 | `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:8-17 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R3 | `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:19 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R4 | `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:21 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R5 | `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:25-27 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R6 | `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:29 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R7 | `state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:29-69 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R8 | `state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:71-78 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R9 | `state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:80-100 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R10 | `state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:102-105 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R11 | `state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:107-120 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R12 | `state/drafts/e2e-stale-expectations-reaim-console-alone/console-alone-800.log.txt:8 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R13 | `state/drafts/e2e-stale-expectations-reaim-console-alone/console-alone-800.log.txt:9 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R14 | `state/drafts/e2e-stale-expectations-reaim-console-alone/console-alone-800.log.txt:12 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R15 | `state/drafts/e2e-stale-expectations-reaim-console-alone/console-alone-800.log.txt:24 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R16 | `state/drafts/e2e-stale-expectations-reaim-console-alone/README.md:3-5 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R17 | `engine/src/dataset.rs:1666-1692 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R18 | `engine/src/identity.rs:149-153 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R19 | `protocol/skp/tests/data/v0-describe-response-session-ordinal.json:31 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R20 | `docs/adr/ADR-016-stable-feature-identity-admission.md:180 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R21 | `engine/ADMISSION-PREREGISTRATION.md:67 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R22 | `frontends/shell/src/admission/DescribeSummary.tsx:44-45 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R23 | `frontends/shell/src/admission/DescribeSummary.tsx:65-70 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R24 | `engine/src/identity.rs:297-313 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R25 | `engine/src/identity.rs:322-344 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R26 | `engine/src/fixture.rs:528-546 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R27 | `engine/src/fixture.rs:621-627 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R28 | `kernel/tests/manual_walkthrough_fixtures.rs:477-497 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R29 | `kernel/tests/manual_walkthrough_fixtures.rs:527-565 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R30 | `frontends/shell/e2e/regression.mjs:60-61 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R31 | `frontends/shell/e2e/regression.mjs:106-110 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R32 | `frontends/shell/e2e/regression.mjs:2340-2390 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R33 | `frontends/shell/e2e/regression.mjs:2474-2482 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R34 | `frontends/shell/e2e/regression.mjs:2634-2644 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R35 | `frontends/shell/e2e/regression.mjs:2550-2557 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R36 | `frontends/shell/e2e/admission-remediation.mjs:50-65 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R37 | `frontends/shell/e2e/admission-remediation.mjs:74-78 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R38 | `frontends/shell/e2e/admission-remediation.mjs:404-435 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R39 | `frontends/shell/e2e/admission-remediation.mjs:467-529 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R40 | `frontends/shell/e2e/admission-remediation.mjs:540-543 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R41 | `frontends/shell/e2e/admission-remediation.mjs:747-751 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R42 | `frontends/shell/e2e/admission-remediation.mjs:809-811 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R43 | `protocol/skp/SKP-V0.md:887-898 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R44 | `frontends/shell/src/skp/client.ts:113-123 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R45 | `frontends/shell/e2e/console.mjs:362-367 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R46 | `frontends/shell/src/residency/residencyArm.ts:26-36 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R47 | `frontends/shell/src/residency/residencyArm.ts:50 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R48 | `frontends/shell/src/App.tsx:1123-1124 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R49 | `frontends/shell/e2e/console.mjs:22-28 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R50 | `frontends/shell/e2e/console.mjs:400-420 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R51 | `frontends/shell/e2e/console.mjs:542-609 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R52 | `frontends/shell/e2e/console.mjs:813-823 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R53 | `frontends/shell/src/console/recorder.ts:139 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R54 | `frontends/shell/src/console/recorder.ts:280-286 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R55 | `frontends/shell/src/console/consoleViewModel.ts:177-189 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R56 | `frontends/shell/src/console/ConsolePanel.tsx:28-34 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R57 | `frontends/shell/src/console/ConsolePanel.tsx:61-67 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R58 | `frontends/shell/src/console/ConsolePanel.tsx:103-131 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R59 | `frontends/shell/src/console/ConsolePanel.tsx:175-179 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R60 | `frontends/shell/src/console/consoleViewModel.ts:182 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R61 | `frontends/shell/src/App.tsx:305 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R62 | `frontends/shell/src/App.tsx:318-322 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R63 | `frontends/shell/src/residency/candidateArmSession.ts:1631-1699 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R64 | `frontends/shell/src/residency/candidateArmSession.ts:1274 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R65 | `frontends/shell/src/residency/candidateArmSession.ts:1370-1375 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R66 | `frontends/shell/src/diagnostics/log.ts:20-21 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R67 | `engine/SOURCE-WATCHER-PREREGISTRATION.md:83-87 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R68 | `engine/SOURCE-WATCHER-PREREGISTRATION.md:93-97 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R69 | `engine/SOURCE-WATCHER-PREREGISTRATION.md:246 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R70 | `engine/SOURCE-WATCHER-PREREGISTRATION.md:407 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R71 | `KNOWN-LIMITATIONS.md:293-298 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R72 | `frontends/shell/e2e/source-changed.mjs:33-37 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R73 | `frontends/shell/e2e/source-changed.mjs:210-214 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R74 | `frontends/shell/e2e/source-changed.mjs:177-186 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R75 | `frontends/shell/e2e/source-changed.mjs:519-521 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R76 | `frontends/shell/e2e/source-changed.mjs:572-578 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R77 | `frontends/shell/e2e/source-changed.mjs:741-748 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R78 | `frontends/shell/e2e/source-changed.mjs:751-771 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R79 | `frontends/shell/e2e/source-changed.mjs:779-821 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R80 | `frontends/shell/e2e/source-changed.mjs:1097 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R81 | `frontends/shell/MANUAL-WALKTHROUGH.md:144 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R82 | `frontends/shell/MANUAL-WALKTHROUGH.md:179-185 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R83 | `frontends/shell/MANUAL-WALKTHROUGH.md:511-512 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R84 | `frontends/shell/MANUAL-WALKTHROUGH.md:587-591 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R85 | `frontends/shell/MANUAL-WALKTHROUGH.md:94 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R86 | `frontends/shell/MANUAL-WALKTHROUGH.md:612 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R87 | `frontends/shell/MANUAL-WALKTHROUGH.md:614 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R88 | `frontends/shell/MANUAL-WALKTHROUGH.md:681 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R89 | `frontends/shell/MANUAL-WALKTHROUGH.md:684-685 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R90 | `frontends/shell/MANUAL-WALKTHROUGH.md:946 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R91 | `frontends/shell/e2e/README.md:240-244 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R92 | `frontends/shell/e2e/README.md:264-277 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R93 | `frontends/shell/e2e/README.md:436 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R94 | `KNOWN-LIMITATIONS.md:60-66 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R95 | `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R96 | `state/directives/2026-10-06-machine-script-adopted.md:20 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R97 | `state/directives/2026-10-05-product-first-direction.md:8-11 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R98 | `state/directives/2026-10-05-product-first-direction.md:15 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R99 | `state/directives/2026-10-05-product-first-direction.md:19 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R100 | `state/directives/2026-10-08-m1-mutations-branch-docs08-adr036.md:6-19 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R101 | `state/directives/2026-10-09-rulings-on-the-eight-forms.md:13 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R102 | `state/directives/2026-10-09-rulings-on-the-eight-forms.md:11 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R103 | `state/directives/PORTABILITY-2026-09-30.md:33-65 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R104 | `AUTONOMY.md:315-332 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R105 | `AUTONOMY.md:347-357 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R106 | `AUTONOMY.md:482 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R107 | `docs/PREREGISTRATION-TEMPLATE.md:172 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R108 | `frontends/shell/e2e/regression.mjs:92-98 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R109 | `state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:33-36 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R110 | `engine/src/fixture.rs:4 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R111 | `engine/src/fixture.rs:194-195 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |
| R112 | `frontends/shell/e2e/admission-remediation.mjs:429 @ a576ab3725d77a6f63afc8935cb572eca2cf2dec sha256:HASH-TBD` |

## §1. What this preregistration may and may not claim

- **No product change.** Nothing under these paths changes:
  - `frontends/shell/src/**`, `frontends/shell/src-tauri/**`, `protocol/**`, `kernel/src/**`;
  - `engine/src/**`, except the one feature-gated fixture variant of §2.6 if OPEN-1 (A) is ruled.
  - A step that needs a product change, or shows a defect, stops the piece and goes back to the human [R2].
- **No measurement.** No performance number and no docs/08 row. The millisecond values in §7 are bounds on waiting, never results (ADR-018).
- **Evidence class: E2E-verified** for the four suites. Operator rows are proposed for the human's sight, not judged here.
- **The session-tier assertions** prove that the shell opens the keyless file and renders the engine's statement. They do not prove R-I3's engine properties, which belong to the engine tests the triage names [R7].
- **The source-changed re-aim** proves KNOWN-LIMITATIONS item 26's pre-check backstop [R71] for a directory junction repointed after admission. It does not prove it:
  - for a file symlink;
  - for a rename above the grandparent;
  - for the post route or the reopen route, neither of which is re-aimed (§5, declared unchanged).
- **GROUP' and REFUSAL'** make no claim about console latency. The only stated property is a re-render at most once per frame [R56], which is not a latency contract.
- **No wire change.** HEXLIM' asserts the existing `skp/0.6` key set [R43]. No ADR is cited as amended, and none is amended.
- **User-visible wording** stays the human's. The walkthrough row texts in Appendix A are proposals for sight. The KNOWN-LIMITATIONS paragraph is the human's own text.

## §2. The change, step by step

The ruled rules are item 1's [R2], referenced and not restated. For each step: what it asserts today, what changed, and the re-aimed assertion.

### 2.1 regression C2'/C3'

- **Today** [R34, R32]: `missing-identity-refused.parquet` must refuse with `engine.identity_unusable` and the no-such-column message [R31]. The identity form must be present, `parcel_key` must be among its candidates, there is no dismiss control, and no summary appears in the Layers region.
- **Replaced.** A single file with no `id` column now opens on the session tier: R-I3 [R21], ADR-016 Amendment 1, Accepted [R20], implemented at [R17].
  - Still existing: a file whose `id` cannot serve still refuses with the identity form and its candidates ([R25], [R24]; the last sentence of the human's paragraph [R5]).
- **Re-aimed: two halves in the one step, each failing by its own name.**
  - **(a) Session half.**
    - `openPath(no-id-column.parquet)` returns `{kind:"admitted"}`.
    - After `waitForSettle` (MAP''s values, §7), the summary, read where MAP' reads it [R112], holds the Identity line `session-ordinal:file_row_number — by-construction-within-generation` [R22].
    - It also holds a `Session identity` row whose text equals `SESSION_IDENTITY_STATEMENT`. That constant is byte-copied from [R19], under the suite's verbatim-constant convention [R108].
    - No `.admission-panel .admission-refusal` is present.
    - The identity form's absence is recorded as INFO and not asserted, since the identity-route node [R4] will change it.
  - **(b) Refusal half.** `stepRefusal` (unchanged) on `string-id-refused.parquet` with:
    - code `engine.identity_unusable`;
    - a message constant read back from a real run [R108], whose detail is the type refusal [R25];
    - form `.identity-declaration-form`;
    - candidates `["parcel_key"]`.
  - The fixture-existence loop [R33] gains the new paths. The step's outer bound changes per §7.

### 2.2 admission MAP' and BOTHNEEDED'

- **MAP'**
  - **Today** [R38]: the keyless file refuses with the missing message [R37], offers `parcel_key`, and admitting it as declared gives `mapped:parcel_key — verified-at-open-full-file`.
  - **Re-aimed.**
    - (a) The same session half as 2.1(a), on `no-id-column.parquet`.
    - (b) Refuse-then-declare on `string-id-refused.parquet`:
      - a plain open refuses `engine.identity_unusable` with the read-back type message;
      - the candidates are exactly `["parcel_key"]`;
      - declaring `parcel_key` admits;
      - the summary holds `mapped:parcel_key — verified-at-open-full-file` (that assertion is unchanged).
- **BOTHNEEDED'**
  - **Today** [R39]: an explicit-null-CRS, keyless file refuses CRS; asserting the CRS alone refuses identity, showing the carried-option line; the combined request admits.
  - **Re-aimed.**
    - (a) **Session half, on `no-crs-no-id-refused.parquet`** (the old shape, renamed):
      - a plain open refuses `engine.crs_undeclared`;
      - asserting the CRS alone gives `{kind:"admitted"}`;
      - the summary holds the caller-asserted CRS line and the `Session identity` row equal to `SESSION_IDENTITY_STATEMENT`.
    - (b) **Both-needed half, on `no-crs-string-id-refused.parquet`:**
      - a plain open refuses `engine.crs_undeclared`;
      - the CRS alone refuses `engine.identity_unusable` with the read-back type message and the carried-option line (assertions unchanged);
      - the combined request admits with both summary lines (unchanged).
- **CONFLICT'** keeps its body. Only its fixture constant follows the rename [R40].
- The existence checks [R41] and the regeneration constants [R36] follow the new names. Step bounds change per §7.

### 2.3 console: HEXLIM', REFUSAL', GROUP', the arm readback

- **HEXLIM'** [R45]
  - Changed: the wire gained `columns` in `skp/0.6`, always present [R43]. The client sends `columns: null` [R44].
  - Re-aimed: the expected key list is exactly `bbox, bbox_crs, columns, dataset, filter, limit, skp`. Nothing else in the step changes. The value of `columns` is not asserted, because the ruling asks for the key list only.
- **REFUSAL'** [R50]
  - What changed is an assumption, not behaviour. The shipped arm is now the candidate arm (entry 52 (a); [R46], [R47]). On it, the refused entry reaches the DOM after the hook returns [R9, R13].
  - Re-aimed: the step polls `readClassAEntries` every `CONSOLE_POLL_INTERVAL_MS`, up to `CONSOLE_POLL_BOUND_MS` (§7), until a `viewport_query` row with outcome `refused` is present. Its code and message are then compared with the live outcome, unchanged.
  - When the bound expires, the step fails by name. The message gives the bound and the console label's count and dropped figures [R57].
  - A fixed sleep or a frame count is not a valid wait. That is the human's rule for the sibling piece [R102], applied here.
- **GROUP'** [R51]
  - What changed: the same arm assumption. Premise [R49] is that nothing else is recorded between the three calls. On the shipped arm that can fail (H1). The step also counted every new header [R14].
  - **Re-aimed: option 1, by what the entries are.**
    1. `waitForSettle` on the render trace, with HEXLIM''s own values (§7), so that no earlier generation's work is still in flight.
    2. Expand every group. Read the baseline:
       - the console label's total, count plus dropped [R57];
       - the number of *residential untiled rows*, which must be 0 or the step fails by name. A residential untiled row is a class-A `viewport_query` row whose parsed request has `bbox === null` and `filter.predicate === "zone = 'residential'"`. The primary attempt of an Apply issues `bbox: null` [R61]. Tile queries and the refusal-recovery re-issue carry a bbox ([R62], [R63]).
    3. Make three `queryWithFilter("zone = 'residential'")` calls in sequence, each `applied` (unchanged).
    4. Poll (bound §7). Each read expands every group and maps each class-A row to its enclosing `.console-group`, or to none. The condition: exactly 3 residential untiled rows, all in one `.console-group`.
    5. **Capacity.** Let R = the label's total at the passing read minus the baseline total. R ≤ `MAX_CONSOLE_ENTRIES` (256, mirrored from [R53]) proves none of the step's own rows can have been evicted, because the ring drops the oldest [R54]. R > 256 fails by name as `capacity` before any other check.
    6. On the passing read:
       - the group's header text equals `×N`, where N is the number of rows it shows (I8: one group of real entries, [R55], [R58]);
       - every row in it is `viewport_query`;
       - each request text parses on its own.
       - N and the number of distinct texts among the 3 are reported, not asserted. The prediction is N = 3 (§5).
    7. When the bound expires, the step fails by name. The message gives the count found, the group each row is in, and the kinds of the rows found between them in DOM order (H1's discriminator).
  - The suite never counts all headers, and never reads the recorder module.
- **Arm readback (the assumption made explicit).**
  - After the mount gate, `main` reads `window.__SPATIAL_E2E__.getResidencyArm()` [R48].
  - It stops the run as a harness failure, by name, unless the arm is `candidate`. This is regression.mjs's precedent [R35].
  - Nothing sets an arm. The suite stays on the shipped arm, and nothing pins the baseline.
- **REGRESS'** and every other console step are unchanged. REGRESS' carries regression and admission [R10].

### 2.4 source-changed S3 and S4 (default route `pre` only)

- **Today.**
  - S3 moves the scratch copy's mtime [R78].
  - S4 issues a gesture ladder and asserts that a `viewport_query` follows [R79]. The pre-check is then supposed to refuse it.
- **Changed.** The advisory watcher (node `engine-source-change-watcher`; round 17, item 2) sees the touch while the app is idle and ends the session first, so no query follows [R11].
  - What it cannot see: a symlink in the resolved path repointed after admission. Arming canonicalizes the path and watches only the final parent and grandparent ([R67], [R68], [R70], [R71]).
- **Re-aimed, route `pre` only.**
  - **Layout, before S1.** Under `e2e/out` (gitignored):
    - `source-changed-targets/a/source-changed-scratch.parquet` and `source-changed-targets/b/source-changed-scratch.parquet`, each copied from the 100k fixture and each hash-equal to `hashBefore` [R75];
    - `b`'s copy has its mtime moved forward 120 s with `utimesSync` before the open, so the two copies differ only in mtime;
    - a directory junction, `source-changed-link` → `source-changed-targets/a`, made in-process with Node's `fs.symlinkSync(target, path, "junction")`. This needs no elevation and spawns nothing. The watcher's own test A10 uses a junction [R69].
    - A stale junction from an earlier run is removed with `fs.unlinkSync`, never with a recursive delete.
    - S1 [R76] opens `e2e/out/source-changed-link/source-changed-scratch.parquet`.
  - **S3 (pre).**
    - Retarget: unlink the junction, then re-create it pointing at `b`.
    - Assert that `realpathSync` of the opened path now resolves inside `b`, and that both copies still hash to `hashBefore` (block-on-sight 8 of the existing driver, kept).
    - On `EPERM` or `EACCES` it fails by name, with no fallback to another link type and no elevation.
    - Off Windows it fails by name, naming the file-watching boundary (§2.7).
  - **S4 (pre).** The ladder is unchanged. Added: after the query, the session log written since the baseline [R77] must carry a `tile-stream-mint-refused` line with `engine.source_changed`. That is the pre-check's own line [R74]. If it is absent, S4 fails by name.
  - **S5a–S5c** are unchanged. The final hash check covers both copies.
  - **Routes `post` and `reopen`** keep `SCRATCH_COPY` [R73] and their mtime touch, including `reopen`'s second touch [R80]. They are not re-aimed (§5).

### 2.5 Fixture generators (`kernel/tests/manual_walkthrough_fixtures.rs`)

| Name | Shape | Source | Generator |
|---|---|---|---|
| F-A `no-id-column.parquet` | declared LV95; `parcel_key` UInt64; no `id` | the spec of [R28], unchanged | renamed to `generate_the_no_id_column_fixture`; the doc comment's refusal sentence is corrected |
| F-B `string-id-refused.parquet` (new) | declared LV95; `id` Utf8 (`key-{n}`); `parcel_key` UInt64 = n | new | `generate_the_string_id_refusing_fixture` |
| F-C `no-crs-no-id-refused.parquet` | explicit `"crs": null`; no `id` | the spec of [R29], unchanged | renamed to `generate_the_no_crs_no_id_refusing_fixture`; its both-needed doc is corrected (a plain open still refuses on CRS) |
| F-D `no-crs-string-id-refused.parquet` (new) | explicit `"crs": null`; `id` Utf8; `parcel_key` | new | `generate_the_no_crs_string_id_refusing_fixture` |

- All four fixtures have `features: 100` and `avg_vertices: 12`, as their siblings do.
- New names are used so that no stale file on disk can stand in for a new shape.
- The old files are left on disk, untracked, and nothing reads them.
- The doc comment at [R28], which says these files are refused until a mapping is declared, is corrected.

### 2.6 F-B and F-D's writer (OPEN-1)

- **(A), recommended.** One variant in `engine/src/fixture.rs` [R26]: `IdentityMode::StringIdsBesideParcelKey`.
  - The schema gets `id` Utf8, then `parcel_key` UInt64, ahead of `bbox` and `geometry` [R27].
  - The writer fills both columns.
  - Every existing variant's bytes are unchanged.
  - The module is test support, behind the `fixture` feature [R110]. The caller-rule precedent is [R111].
- **(B) and (C)** are in OPEN-1.

### 2.7 Portability item (R3 of [R103])

- **Owning boundary:** file watching (`engine/src/watch.rs`). It is exercised, not changed.
- **Behaviour:**
  - Windows: supported, and the junction route is exercised here.
  - macOS and Linux: the watcher is explicitly reduced to checks-only (KNOWN-LIMITATIONS item 24). The shell e2e suites do not run there today; that level is not established, per PORT-3 and PORT-4.
  - S3 (pre) fails by name off Windows rather than skipping (R6).
- **Tests per platform:** Windows only. The deferral is recorded by KNOWN-LIMITATIONS items 1 and 24 and by the portability plan.
- No `cfg` in product code. The only platform check is `process.platform` in the e2e file.
- No Windows assumption enters shared logic (R4). The new fixture constants follow the suites' existing test-only path convention.

### 2.8 Records and documents

- **`frontends/shell/e2e/README.md`.** The descriptions of HEXLIM', REFUSAL' and GROUP' [R92] and of the default source-changed route [R91] follow §2.3 and §2.4. Dated records, for example [R93], are not edited.
- **`frontends/shell/MANUAL-WALKTHROUGH.md`.**
  - Rows C2, C3, I4 and I5: the Appendix A texts, after the human's sight.
  - Coverage rows [R85], [R86], [R87], [R88] and [R89] follow §2.
  - Rows I6 and I8, the Part C heading and the fixture tables [R81], [R83] follow OPEN-3.
  - No result log is edited.
- **`KNOWN-LIMITATIONS.md`.** Item 3 [R94] gains the human's paragraph (Appendix B) after its existing text, which ends with the item's comment line. One blank line goes before it and one after. No other item is edited (item 5's disjoint-paths rule, [R6]: PR #197 edits item 9, and map-refill edits item 39). Whichever of these merges later merges main in before its last gate run.

## §3. Fixtures — predicted outcomes

Every file under `target/fixtures/manual-walkthrough` that any run reads is sha256-hashed before and after the runs.

| Fixture | Predicted |
|---|---|
| F-A | bytes equal to the triage's `missing-identity-refused` hash b0c2f1ea879ca75ba1d740cfab93cc91a41e917e955085dbd4d6e4405e82f424 [R7]. A plain open admits on the session tier, and the summary shows the statement |
| F-B | a plain open refuses `engine.identity_unusable`; the detail begins `type is Utf8;` [R25]; candidates exactly `parcel_key` [R24]; declaring `parcel_key` admits, `mapped:parcel_key — verified-at-open-full-file` |
| F-C | bytes equal to 6e41b31267a4241cae388e2c49467fa4b1930be679aed7e55fb0753e9227f5c8 [R7]; refuses `engine.crs_undeclared`; with the CRS asserted, admits on the session tier |
| F-D | refuses CRS, then identity (type), then the combined request admits |
| 100k copies `a` and `b` | hash-equal to the 100k fixture throughout; differ in mtime only |

## §4. Tests, and one observed mutation per re-aimed step

**How a mutation is observed** (wording per [R107]):
- apply it;
- run the named suite;
- record the step's failure by name, with the commit it was observed at;
- revert it, and show the worktree clean.
- One at a time. None is committed, pushed or left in place.

A `verify-mutation` run is never called an observation. All mutations below touch **test lines** (TL) or select a **fixture** (FX). **No product line is touched** (OPEN-2 offers the alternative).

| # | Step | Mutation | Kind | Predicted failure, by name |
|---|---|---|---|---|
| M1 | C2'/C3' (a) | the session half's fixture constant points at `100k-happy-path.parquet` (native `id`) | FX | `C2'/C3' (session tier)`: no `Session identity` row |
| M2 | C2'/C3' (b) | the refusal half's fixture points at F-A | FX | `C2'/C3'`: expected refused `engine.identity_unusable`, got admitted |
| M3 | MAP' (a) | the session half's fixture points at F-B | FX | `MAP' (session tier)`: expected admitted, got refused |
| M4 | MAP' (b) | the declared column `parcel_key` is replaced by `id` | TL | `MAP'`: declaring did not admit |
| M5 | BOTHNEEDED' (a) | the fixture points at F-D | FX | `BOTHNEEDED' (session tier)`: expected admitted after the CRS assertion, got `engine.identity_unusable` |
| M6 | BOTHNEEDED' (b) | the fixture points at F-C | FX | `BOTHNEEDED'`: expected `engine.identity_unusable` after asserting the CRS alone, got admitted |
| M7 | HEXLIM' | `columns` removed from the expected list | TL | `HEXLIM'`: key set mismatch (the text of [R12]) |
| M8 | REFUSAL' | the poll's match also requires a refusal code that no refusal carries. This is a read-side stand-in for a refusal that never renders | TL | `REFUSAL'`: no refused `viewport_query` entry within the declared bound |
| M9 | GROUP' | the third call's predicate becomes `zone = 'commercial'` | TL | `GROUP'`: expected 3 residential untiled rows, found 2 |
| M9c | GROUP' capacity | the mirrored capacity is set to 2 | TL | `GROUP'`: capacity |
| M10 | arm readback | the expected arm becomes `baseline` | TL | a harness failure naming the arm read back |
| M11 | S3 (pre) | the retarget is replaced by the old mtime touch on the opened path | TL | `S4`: no `viewport_query` followed any gesture (the watcher ended the session first; [R11]) |
| M12 | S4 (pre) | the retarget is skipped, so the junction stays on `a` | TL | `S4`: no `tile-stream-mint-refused` `engine.source_changed` line since the baseline |

**Suites:**
- `npm run e2e:regression`, `npm run e2e:admission` and `npm run e2e:console` (REGRESS' included);
- `source-changed.mjs`, default route, `launched:true`;
- the four generators (`cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture`);
- under OPEN-1 (A), the engine's fixture-dependent tests, unchanged and passing;
- CI's `node --test` scripts suite, and `verify:plan`, `verify:cites` and `verify:quotes`.

## §5. Predictions · declared unchanged · invalidators · falsification

**Predictions.** A wrong prediction is a result, recorded as class 2.
- **P1.** Each of the four suites gives 0 FAIL in a solo run with `launched:true`. Main then meets item 2's premise for milestone 2 [R3].
- **P2.** GROUP''s group has N = 3, and the three texts are byte-identical.
- **P3.** R ≤ 256. The value is recorded.
- **P4.** F-A to F-D behave as §3 predicts.
- **P5.** On the pre route, the pan rung produces the query, the pre-check line carries detail `{mtime}`, and S5a–S5c pass.
- **P6.** M1 to M12 each fail by their named message.

**Declared unchanged:**
- every product path named in §1;
- `frontends/shell/e2e/lib.mjs`;
- the bodies of these console steps: HEADER', ECHO', TWOCMD', CLASSB', CLASSC', COPYTRUNC', UNCLASS', REGRESS';
- every `regression.mjs` step except C2'/C3';
- every admission step except MAP' and BOTHNEEDED' (CONFLICT''s fixture constant only);
- source-changed S1, S2 and S5a–S5c, and the `post` and `reopen` routes;
- every other fixture generator, and every engine fixture variant's bytes;
- KNOWN-LIMITATIONS items other than 3;
- every walkthrough result log, and the e2e README's dated records.

**Invalidators.** Each one stops the piece and goes to the human. None is worked around.
- **I1.** A re-aimed step fails in a solo run because of the product [R2].
- **I2.** S4 shows a query but no pre-check refusal after the junction retarget. Item 26's claim [R71] would then not hold for a junction.
- **I3.** GROUP' fails in a solo run because a row of another kind sits between the three residential rows. That means option 1's premise does not hold on the shipped arm. Option 2 is not taken without the human.
- **I4.** The junction cannot be made without elevation on the e2e machine.
- **I5.** F-B does not refuse, or offers candidates other than exactly `parcel_key`.
- **I6.** F-A's or F-C's bytes differ from their predecessors'. That is fixed before any run.

**Falsification.** This preregistration is wrong if the four suites cannot all pass against main's product without a product edit.

## §6. Instruments

- Every quantity is an **assertion**: outcome kinds, row kinds and counts, group membership, header text, hash equality, log-line presence. R (§2.3) is an assertion on a count.
- There is no measurement. The step-line milliseconds the suites already print are not results.

## §7. Declared values and ceilings

| Value | Bounds or denotes |
|---|---|
| `CONSOLE_POLL_BOUND_MS` = 5000 | the REFUSAL' and GROUP' polls. A ceiling on waiting, not a latency claim. The triage's single probe saw the refused entry at about 299 ms [R9] |
| `CONSOLE_POLL_INTERVAL_MS` = 100 | the poll's mechanism |
| `MAX_CONSOLE_ENTRIES` = 256 | mirrored from [R53] by the sibling-file convention; GROUP''s capacity check |
| GROUP' pre-settle: `quietMs` 1500, `timeoutMs` 15000 | HEXLIM''s own values |
| GROUP' outer bound 30 s → 45 s | the settle, the three calls and the poll. A bound |
| C2'/C3' outer bound 30 s → 90 s; MAP' and BOTHNEEDED' 60 s → 120 s | each half adds a `waitForSettle` (`quietMs` 3000, `timeoutMs` 45000, MAP''s values). A bound |
| S3 `b`-copy mtime offset = +120 s | the same offset S3 used before [R78] |
| F-B and F-D: `features` 100, `avg_vertices` 12 | as their siblings |

**Line budget.** The count is insertions plus deletions from `git diff --numstat <merge-base>...<PR head>`, per §21c's rule [R105]. This form is excluded.

| File | Ceiling |
|---|---|
| `frontends/shell/e2e/console.mjs` | 220 |
| `frontends/shell/e2e/admission-remediation.mjs` | 220 |
| `frontends/shell/e2e/source-changed.mjs` | 170 |
| `frontends/shell/e2e/regression.mjs` | 120 |
| `kernel/tests/manual_walkthrough_fixtures.rs` | 90 |
| `engine/src/fixture.rs` | 40, under OPEN-1 (A) only |
| **Code and tests, total** | **860** |
| `frontends/shell/e2e/README.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`, `KNOWN-LIMITATIONS.md` (documents) | 40, 60 and 2 |

- Files: at most 9.
- An overrun is recorded as class 8, and this line is never edited.
- No new dependency: Node built-ins only, and no crate.

## §8. Block-on-sight

1. Any edit under a product path in §1, apart from §2.6 (A) as ruled.
2. Any arm set or pinned in `console.mjs`.
3. A fixed sleep or a frame count used as the REFUSAL' or GROUP' wait.
4. GROUP' asserting on the total number of `.console-group-header` elements.
5. A walkthrough result log edited, or an e2e README dated record edited.
6. A recursive delete on a path that is, or contains, a junction. Any link type other than `junction`. Any elevation, `runas` or spawned `mklink`.
7. Copy hashes unequal anywhere in the source-changed run.
8. The KNOWN-LIMITATIONS text not byte-identical to [R5]'s line 27, or any other item edited.
9. A mutation committed, pushed or left in place.
10. A refusal-message constant written by hand and not read back from a run.
11. A failure seen in a shared run recorded as a failure (§9).
12. An invalidator of §5 reached and worked around.
13. A new dependency.

## §9. Gates

- **Proportional gates** under [R98]. A gate fails only on Correctness or Evidence. Documentation and record findings are fixed in the same PR before the merge.
- **Architect.** §1 to §8 one by one; the operation class (an e2e and test-support piece, no undo surface); the caller rule for §2.6 [R111].
- **Reviewer.** The whole diff; each block-on-sight item.
- **Suites.** Those of §4, green before the gates.
- **Operator.** Rows C2, C3, I4 and I5 (and I6 and I8 per OPEN-3) are committed with blank result logs and queued for the next sitting.
- **Heavy runs.** The worker's and tester's briefs carry the machine paragraph of [R95], as written. The form names no other rule for builds.
- **Shared runs.** The human's line, reproduced from [R96]. It must be byte-copied by script and marked; the custodian re-copies it and recomputes the hash before the commit:

  > - A timing-sensitive failure seen in a shared run is not recorded as a failure. Report it to the custodian, who re-runs it alone on the machine.

## §10. Amendments — opens empty, append-only

## Appendix A — proposed walkthrough row texts, for the human's sight

The texts are proposals. Engine strings are placeholders, filled by a byte-copy, never typed.

- **C2.** Select `no-id-column.parquet` and confirm. → No refusal panel. The summary appears in the Inspector's Source section, and the features draw. Its **Identity** line reads `session-ordinal:file_row_number — by-construction-within-generation`. Below it, a **Session identity** row reads, verbatim:
  - *⟨SESSION_IDENTITY_STATEMENT, byte-copied from [R19], the sentence Part N's N3 quotes [R90]⟩*.
  - Fact that changed: this file, formerly `missing-identity-refused.parquet`, was refused before the session tier (ADR-016 Amendment 1, R-I3).
- **C3.** Read the summary fully. → No identity declaration form appears: the app does not yet offer a way to declare an identity column for a file that opened this way (KNOWN-LIMITATIONS item 3). **Judge:** does the Session identity row read as a clear statement that these features are identified for this session only?
- **I4.** As the current I4 [R84], with three changes:
  - the file is `string-id-refused.parquet` (new: its `id` column holds text, which cannot serve, and a unique 64-bit `parcel_key` sits beside it);
  - the message is *⟨the type refusal, verbatim, from the suites' read-back constant⟩*;
  - the candidate list still has exactly one entry, `parcel_key`.
  - The form description, the Judge prompt and the Declare instruction stay as the current row has them. The outcome is unchanged: Admitted, `mapped:parcel_key — verified-at-open-full-file`.
- **I5.** As the current I5 [R84], with these changes:
  - the file is `no-crs-string-id-refused.parquet` (new: an explicit `"crs": null`, a text `id`, and a unique `parcel_key`);
  - after the CRS is asserted, the identity refusal carries I4's type message;
  - the carried-claim line, the Judge prompt and the outcome are unchanged.
  - A note: the former `bothneeded-refused.parquet`, now `no-crs-no-id-refused.parquet`, admits on the session tier once the CRS is asserted. That is covered E2E only (BOTHNEEDED' (a)).

## Appendix B — KNOWN-LIMITATIONS item 3 paragraph

The text below is reproduced from [R5]'s line 27, with its three leading spaces, as the PR lands it. The custodian replaces this block with a script byte-copy and recomputes the hash before the commit.

   **On `main` (not the v0.1.0 artifact above).** A single file that has no `id` column and no declared mapping opens instead of being refused. Its features are identified for that session only, by their position in the file, and the summary says so. That identity does not survive a reopen or a change to the source, and it is never saved or published. This is the one case in which a row position stands in for identity. The app does not yet offer a way to declare an identity column for a file that opened this way: the declaration form appears only when a file's identity is refused. A file whose `id` column cannot serve is still refused.
````

## 3. OPEN items

- **OPEN-1. How the still-refusing file is written** (the human's; not a red line; dispatch waits on it, because it fixes Scope and the budget):
  - **(A), recommended.** One feature-gated variant in `engine/src/fixture.rs`, which is test support and never shipped, plus two generators in kernel/tests.
    - It produces a file that refuses on a plain open and offers a column whose declaration admits.
    - That is what item 1 describes, and it gives walkthrough I4 a route an operator can actually walk.
  - **(B)** No engine edit. The route is proven by declaring a column the keyless file lacks (it refuses at `engine/src/dataset.rs:1680-1686`, offering `parcel_key`), then declaring `parcel_key`.
    - This is not a refusal on a plain open.
    - An operator has no way to make the first, wrong declaration, so I4 cannot reach an admitting declaration by hand.
  - **(C)** A kernel-test generator that rewrites F-A through DuckDB to add a text `id`. It depends on DuckDB's parquet writer carrying the `geo` key-value metadata, which is unproven.
  - Your side of it: whether the resumed lead-data pilot wants an impact read for (A) and for the kernel/tests edits.
- **OPEN-2. Mutations** (the human's; not a red line; waits until the gate's mutation runs):
  - **(a), recommended.** All test-side or fixture-side, as §4 lists. No allowance is needed.
  - **(b)** Product-line mutations on the 2026-10-08 terms (`state/directives/2026-10-08-m1-mutations-branch-docs08-adr036.md:6-19`, restated at `state/directives/2026-10-09-rulings-on-the-eight-forms.md:13`), in place of M8 and M9:
    - REFUSAL': remove the refusal block at `frontends/shell/src/console/ConsolePanel.tsx:175-179`;
    - GROUP': make the comparison at `frontends/shell/src/console/consoleViewModel.ts:182` never match.
    - (b) is stronger for REFUSAL' only, since M8 is a read-side stand-in.
- **OPEN-3. Walkthrough scope** (the human's; not a red line; waits on the PR's walkthrough edit):
  - Item 1 names C2/C3, I4 and I5. But I6 and I8 (`MANUAL-WALKTHROUGH.md:589-591`), the Part C heading and the fixture-table rows (`:144`, `:511-512`) also name a fixture that no longer refuses.
  - **(a), recommended.** Include the fixture-name changes for sight in this PR.
  - **(b)** Leave them, and record a proposed node.
- **OPEN-4. Findings outside scope** (yours; not a red line; nothing waits on it):
  - The source-changed `post` and `reopen` routes still move the mtime, which the watcher can see (`source-changed.mjs:1097` and the post route's touch). The triage ran the default route only.
  - Walkthrough Part N's N6 and N8 touch the mtime by hand under the same premise.
  - Recommended: record one proposed node for both, as the freeze rule allows.
  - Separately: N3's citation into the JSON fixture names `:29`. That was a pin at 3b23a20. The line is `:31` at main. It is a historical pin, not this piece's to fix.

## 4. Files read

- `C:\dev\spatial-ide\PLAN.yaml` (lines 4300-4420)
- `C:\dev\spatial-ide\state\directives\2026-10-09-rulings-additions-reaim-identity-route-documents.md`
- `C:\dev\spatial-ide\state\directives\2026-10-09-rulings-on-the-eight-forms.md`
- `C:\dev\spatial-ide\state\directives\2026-10-08-m1-mutations-branch-docs08-adr036.md`
- `C:\dev\spatial-ide\state\directives\2026-10-06-machine-script-adopted.md`
- `C:\dev\spatial-ide\state\directives\2026-10-05-product-first-direction.md`
- `C:\dev\spatial-ide\state\directives\2026-10-09-slot-orders-pilot-and-reuse-standing-step.md`
- `C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md`
- `C:\dev\spatial-ide\state\consults\2026-10-09-e2e-failures-present-at-the-base-triage-report.md`
- `C:\dev\spatial-ide\state\drafts\e2e-stale-expectations-reaim-console-alone\README.md` and `console-alone-800.log.txt`
- `C:\dev\spatial-ide\DECISIONS-PENDING.md` (RULED headings only, by grep)
- `C:\dev\spatial-ide\AUTONOMY.md` (§21–§22, §25–§30) and `C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md`
- `C:\dev\spatial-ide\frontends\shell\e2e\console.mjs`, `admission-remediation.mjs` (parts), `source-changed.mjs` (1-240, 500-919), `regression.mjs` (parts) and `README.md` (200-284)
- `C:\dev\wt\k6\frontends\shell\e2e\regression.mjs` (parts; HEAD not verified)
- `C:\dev\spatial-ide\frontends\shell\src\console\recorder.ts`, `consoleViewModel.ts`, `ConsolePanel.tsx`
- `C:\dev\spatial-ide\frontends\shell\src\App.tsx` (240-349, 1380-1459), `residency\residencyArm.ts`, `residency\candidateArmSession.ts` (parts), `skp\client.ts` (85-133), `skp\types.ts` (125-274), `e2e-test-surface.ts` (60-140), `admission\describeSummaryText.ts`, `admission\DescribeSummary.tsx`, `diagnostics\log.ts` (by grep)
- `C:\dev\spatial-ide\engine\src\identity.rs` (parts), `dataset.rs` (1575-1699), `fixture.rs` (1-110, 170-230, 440-675)
- `C:\dev\spatial-ide\kernel\tests\manual_walkthrough_fixtures.rs` (parts) and `kernel\Cargo.toml`
- `C:\dev\spatial-ide\engine\SOURCE-WATCHER-PREREGISTRATION.md` (parts), `engine\ADMISSION-PREREGISTRATION.md` (60-124), `protocol\skp\SKP-V0.md` (884-899, 1090-1114)
- `C:\dev\spatial-ide\KNOWN-LIMITATIONS.md` (40-69, 293-300) and `frontends\shell\MANUAL-WALKTHROUGH.md` (88-99, 130-199, 500-596, 676-687, 910-954)
