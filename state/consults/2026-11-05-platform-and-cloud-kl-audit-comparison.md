*Filed by the custodian on 2026-11-05 from an evidence-reader's hand-back (report extraction; its brief brief-cmp-kl-audit.md, sha256 1d6dca96035089e7b0b50967335e27b86e3a4b8fa713f75da5cc3e96542b80db; agent transcript read against it: 6 Read and the hand-back; run 2026-11-05T14:56:19Z to 14:57:19Z, claude-sonnet-5-5). The hand-back's sha256 is 85676b0c7c807b2dd7cb7167f29e247efb27bbd8b06a241c7c6f937a9de62cf9, one final newline added; unchanged. It compares a platform report with the cloud filing of the same topic and judges neither; the platform report's filing note carries the custodian's reading of it. Its platform line numbers are the advisory file's: in the filed copy each is 4 lines lower (the filing note, a blank line, the rule and a blank line come first); its cloud line numbers are the filed cloud file's. The platform report here is drift sweep area E (KNOWN-LIMITATIONS.md read against main).*

---

1. **Status:** complete. I read both files whole, in one call each. Neither run's figures are merged below. The platform run worked at 652752af and the cloud run at 6b67d44; per the brief, only governance records differ between them. No difference below traces to a changed file.

Line numbers: P is the platform file, C is the filed cloud file. Neither report has a section answering "tests unable to fail" in the cloud's form; see sections 3 and 4.

2. **Both answer**

- **A. The unnumbered paragraph at KL:164-168 (filter-admission refusals at wide zooms).**
  - P:27: "a v0.1.0 limit that main fixed, with no \"on main\" note." P:29 adds "the fix landed."
  - C:53: "**STALE**" and "The cause its comment names is removed on main".
  - **AGREE** on the verdict: the fix is on main and the paragraph carries no on-main text. Both cite `predicate.rs` and `tileViewportStreamManager.ts` (P:29; C:53). Both give the Admission lease class a pool of 4 (P:29, `pool.rs:132`; C:53, `pool.rs:108-132`). Both point to a retry of `engine.connections_exhausted` and to item 56 as the residual.
  - Only the platform names the PLAN nodes `polish-87-88-89` and `polish-engine-lease-class` (P:29), and `ADR-033`.

- **B. Item 56.**
  - P:47 lists 56 among items that hold: "56 (4/4 connections, 3 in-flight tiles, one retry, `tableSourceRef.current?.cancel()` beside…)".
  - C:91: "**UNTRUE**", on "which is shown by name" (KL:445) being false for the map.
  - **DIFFER.** The platform grades it as holding; the cloud grades it untrue. They agree on 4+4 connections and on the Table cancelling beside the export. The cloud's extra points are that a twice-refused tile is only logged as `tile-stream-mint-refused`, and that a fourth stream exists after Apply or Clear.
  - Cloud and platform both cite `tileViewportStreamManager.ts` near line 276-284, where the platform says every refusal is logged (P:29, :275-283).

- **C. Item 4.**
  - P:47 lists 4 as holding. P:52 says items 4, 10 and 43 go untrue only when b2-1c merges, and that "not merged at this commit, so they still hold."
  - C:41: "**STALE**" on "is never persisted" and "reopening… starts from the default", via the `style.set` session-history step.
  - **DIFFER.**

- **D. Item 10.**
  - P:47 lists 10 as holding (see P:52).
  - C:47: "**STALE**" on "Nothing persists across a session".
  - **DIFFER.**

- **E. Item 43.**
  - P:47: "43 (`MAX_SESSION_HISTORY_BYTES = 33_554_432`; `recover` has no product caller; B2 1c not merged)".
  - C:82: "TRUE-IMPRECISE", with the 32 MiB cap and the absence of recovery holding.
  - **AGREE** on the cap and on there being no recovery. They differ in grade: the cloud adds imprecise wording about the path and about the cap being per record.

- **F. Item 3.**
  - P:47: "3 (identity form appears only on `engine.identity_unusable`)" listed as holding.
  - C:40: "**UNTRUE**" on "never saved or published" (KL:70). It confirms the identity-form clause holds.
  - **DIFFER.** The platform's item-3 note covers only the identity-form clause. The cloud's untrue clause is the publish one.

- **G. Item 13.**
  - P:47 lists "13" as holding.
  - C:50: "**UNTRUE**" on "inert for the session" and "until the app is restarted".
  - **DIFFER.**

- **H. Item 15.**
  - P:47 lists "15" as holding.
  - C:52: "**STALE**" on "an open decision", citing PLAN entry 69 as ruled.
  - **DIFFER.**

- **I. Item 19.**
  - P:47: "19 (`FOOTER_DESCRIPTOR_MAX_BYTES`)", holding.
  - C:60: "**STALE**" on the reduced-component degradation being "shown nowhere".
  - **DIFFER.** The platform checked a constant; the cloud's stale clause is a different sentence.

- **J. Items 1, 2, 5, 7, 9, 11 and 20 to 22.**
  - The platform lists each as holding (P:47). Item 7 is "every status string verbatim"; items 5, 11 and 20 are named in P:47 only as "holds".
  - The cloud grades each TRUE-IMPRECISE, except 21, which it grades TRUE (C:38, 39, 42, 44, 46, 48, 61, 62, 63).
  - **DIFFER** on grade for every item here except 21, where they **AGREE**.
  - On item 7, both say the quoted strings match: the platform says "verbatim" and the cloud says "byte for byte". The cloud's imprecision is the unconditional "Within the render budget" wording.

- **K. Items where both say the item holds.**
  - These are 17, 22 (in part), 23, 24, 28, 32, 33, 35, 36, 37, 38, 40, 42, 44, 45, 46, 51, 52, 53, 54 and 55. Of these, the cloud grades 22 TRUE-IMPRECISE and the rest TRUE; the platform lists them as holding.
  - **AGREE** on the verdicts; the figures it names match what the cloud cites. For example, item 30:
    - P:47 gives `EXIT_DRAIN_CEILING = 30 s`.
    - C:70 gives "the 30 s ceiling".
    - The cloud grades 30 TRUE-IMPRECISE ("hidden staging directory"), so item 30 **DIFFERS** on grade.
    - Item 28 matches: P:47 gives `SESSION_END_EVENT_QUEUE_BOUND = 64` and C:69 gives "The bound is 64."

- **L. Items 41 and 47.**
  - The platform lists 41 as `reason: null`. C:81 says both counts are shown "with no reason". **AGREE** on that fact; the cloud grades 41 TRUE-IMPRECISE.
  - The platform lists 47 as `MIN_PRINTABLE_RUN = 12`. C:85 says the "12-character printable run" holds. **AGREE** on the figure; the cloud grades 47 TRUE-IMPRECISE.

- **M. Whether any test is unable to fail.**
  - P:47 says: "I found no Rust or vitest test without a reachable assertion".
  - C: no section on this. Its report says nothing equivalent, and it only notes `source_watch_adapter.rs:412-417` and `App.workspace.test.tsx:239-248` as evidence spans.
  - Not comparable.

3. **Only in the platform report**
   - **P finding 2 (P:32-35):** `regression.mjs:1946-1950` says the FIND' assertion is "SUSPENDED", but the step at `2256-2265` is a hard, unconditional `failures.push`. Marked confirmed.
   - **P finding 3 (P:37-39):** `regression.mjs:2260-2264` says the step "FAILS on this build… expected and honest" while the engine half is not built, but the engine half is built. Marked a confirmed stale premise.
   - **P finding 4 (P:41-42):** the source comment at KL:168, "the fix is queued post-tag", is stale. This is the same root as finding 1.
   - **P finding 5 (P:44-45):** `App.lateResult.test.tsx:1349` has unpinned line cites into `candidateArmSession.ts:1046, :1076-1082` that have shifted. Marked "suspect — low priority".
   - **P:49-54:** items already tracked in PLAN.yaml: `mp-prime-e2e-covered-fixture`, `skp-line-cites-outside-close-races`, `b2-piece-1c-save-and-reopen`, `port-2-macos-l1-and-app-dirs`, `e2e-stale-expectations-reaim` and the polish nodes.
   - **P:56-60:** "Not got to": a survey of unpinned test-comment cites, the residency-harness and refusal-contract-baseline harnesses, "RECORDED MUTATION" comments, and the bundle-viewer test headers.
   - **P:47:** a scripted scan found no `.skip` or `.only`, no tautological `expect(x).toBe(x)`, and no early return for an absent fixture in the default suites. The platform judges the re-aim tests (`skp_admission.rs`, `identity.rs` and others) as describing current behaviour.
   - The platform gives no verdict counts.

4. **Only in the cloud report**
   - **Counts (C:32):** "TRUE 26 · TRUE-IMPRECISE 19 · STALE 5 · UNTRUE 4". C:7 says the file has 54 entries: items 1-47 and 51-56, plus the unnumbered paragraph.
   - **Grades for entries the platform does not itemise:** 6, 8, 12, 14, 16, 18, 25, 26, 27 (UNTRUE, C:68), 29, 31, 34, 39, 41 and 47.
   - **UNTRUE entries:** 3 (C:40), 13 (C:50), 27 (C:68) and 56 (C:91). Only 56 is also addressed by the platform.
   - **STALE entries:** 4, 10, 15, 19 and the unnumbered paragraph.
   - **Undeclared behaviours, U1-U17 (C:99-115):**
     - U1: session-only identity can be exported (C:99).
     - U2: narrow-integer `id` columns open but cannot stream (C:100).
     - U3: a null geometry stops the stream (C:101).
     - U4: coverage-lost on a buffer overflow (C:102).
     - U5: `[P6 placeholder]` prefixes in ordinary UI (C:103).
     - U6: a build from main reports 0.1.0 (C:104).
     - U7: opening a file clears the filter and keeps the style (C:105).
     - U8: at most 32 attribute columns are shown (C:106).
     - U9: hiding the Table cancels its Filtered scope (C:107).
     - U10: a file over 2,000,000 rows cannot be exported (C:108).
     - U11: exported bundles carry no attribute columns (C:109).
     - U12: the dialog contradicts itself under a filter with Whole dataset (C:110).
     - U13: polygon hover is refused below 9 px (C:111).
     - U14: the open fit frames the first batch (C:112).
     - U15: Cancel does not stop the first load (C:113).
     - U16: a wheel zoom after a click does not restore hover (C:114).
     - U17: the glob refusal's advice cannot be followed in the app (C:115).
   - **Stale pins in HTML comments (C:44, C:47):** the pins at KL:103 and KL:124 no longer point at what they cite.
   - **Tests describing removed behaviour or unable to fail:** the cloud names none.
   - **Not checkable (C:117-124):** v0.1.0-scoped sentences (the tag b391e43 is absent from the clone), CI history, Authenticode and `MSVCP140.dll`, PR #53, macOS Quit behaviour, and the `dist/` redaction matches.

5. **Coverage and unresolved**
   - **Read:** P:1-64 whole (the file ends at line 64) and C:1-125 whole. I opened no other file and did not fetch any commit.
   - **Instruction-like text:** none found in either input.
   - **The inputs cannot answer:**
     - Which grade is right where the reports differ. The platform lists most items only as "holds", with no per-clause detail, so a DIFFER on grade may reflect a different clause tested rather than a contradiction.
     - Whether the platform checked the cloud's specific clauses on items 3, 13, 15, 19, 27 and 56. Its report does not say.
     - Whether the platform's "tests unable to fail" scan covers anything the cloud did not, since the cloud has no such section.
