# PR #214 gate 1 — architect
Reviewed: cut/shell-crs-form-for-format-default-contradicted @ bc0b0d7a2d386102bf8644ff47a52eed5c0fc84c

**Verdict: PASS with notes.** Correctness and Evidence are closed. There are two Documentation findings. Both must be fixed before the merge. Neither needs a re-gate.

I had Read, Grep and Glob only, with no git and no hashing. So I read the files at the head in `C:/dev/wt/crsform`. I took the diff's extent from worker report 1's numstat table and its commit list. The reviewer recomputes §7's count and every hash.

## Correctness: none

**The seam is checked against the engine's real interface (rule of 2026-09-16, round 4).**
- The engine raises `FormatDefaultContradicted` only when the format default convicts: `engine/src/dataset.rs:1338-1339` @ bc0b0d7a.
- The kernel maps it to the name `format_default_contradicted`: `kernel/src/skp.rs:2077-2080` @ bc0b0d7a.
- The shell matches the full code string: `frontends/shell/src/admission/AdmissionPanel.tsx:30` @ bc0b0d7a.
- `nextFormFamily` then returns `"crs"` for every prior family (`AdmissionPanel.tsx:50-53` @ bc0b0d7a). The panel renders `CrsAssertionForm` for that family: `AdmissionPanel.tsx:381-394` @ bc0b0d7a.
- There is one admission route in the shell: `admitDataset`'s call to `openDataset` (`frontends/shell/src/admission/admitDataset.ts:48` @ bc0b0d7a). So no other open route can show this refusal without the form.

**The submit path is checked against the engine.**
- An assertion over a format-default file makes the admissible CRS `None` (`engine/src/dataset.rs:411-414` @ bc0b0d7a). `crs::admit` therefore never refuses it as a conflict.
- Its provenance is `Asserted` / `Declared` (`dataset.rs:443-447` @ bc0b0d7a).
- `sanity_check` returns NotChecked for `Asserted` before any conviction (`dataset.rs:1206-1217` @ bc0b0d7a). An assertion can never re-raise this code, so §5's falsification does not hold.
- This is consistent with ADR-015 §3 and §4 and ADR-032 decisions 1 and 7. ADR-032 decision 7 says a range check may convict, never confirm, and no sentence here claims a confirmation.

**ABSENTCRS' proves the seam end to end from the real shape** (`frontends/shell/e2e/regression.mjs:2450-2526` @ bc0b0d7a).
- The refusal comes from the real engine and is checked verbatim.
- The form must be present and the identity form absent.
- The catalog entry is found by its label text (CrsAssertionForm renders `{name} ({authority}:{code})` at `CrsAssertionForm.tsx:88` @ bc0b0d7a), not by index.
- Submit is a DOM click on `button[type=submit]`. No `openPath` options are used.
- The step then waits for the `CRS` and `CRS provenance` rows. Those rows are built by `crsSummaryLine` (`describeSummaryText.ts:23` @ bc0b0d7a).

**§8, item by item:**
1. Clean: kernel/tests changes are comments only.
2. Clean: one new family code. I1's branch and the carry-forward are untouched.
3. Clean: the form is untouched, so nothing is pre-selected.
4. Clean: no new product string, and no `refusalGuidance` case.
5. Clean.
6. Clean: only ABSENTCRS', its bound and its call-site comment changed.
7. Clean.
8. Clean: the two spans match the directive.
9. Clean: files within §2.6.
10. Clean: no new callback, option or export.
11. Clean: CF1 to CF4 mutations observed, and ABSENTCRS' observed by the custodian.
12. Clean.
13. Clean.

**Other checks:**
- **ADR-006:** the assertion is a session claim and nothing persists. There is no class change.
- **docs/08:** no figure is claimed.
- **Round 25, item 2:** no §7 overrun (164 of 225, by the report). No `verify-mutation` run is called an observation. No test-text span is hash-pinned at a branch commit.

**The claims stay within §1.**
- The x-first claim is H2, and it is evidenced.
- The northing-first case stays refused. `is_x_first` admits only EastingNorthing and LongitudeLatitude (`engine/src/crs.rs:161-163` @ bc0b0d7a). The asserted order is gated at `dataset.rs:422-426` @ bc0b0d7a.
- CF4 shows that the form stays reachable after that refusal (H3).
- Nothing claims the assertion is checked, that the release hold is lifted, or any level above L1.

## Evidence: adequate

**The custodian's e2e record** is `state/consults/2026-10-12-shell-crs-form-for-format-default-contradicted-e2e-custodian-run.md`.
- **H2:** ABSENTCRS' passes at the head with the full asserted outcome. The fixture hashes are the same before and after.
- **§3 at the base:** the step passes with the predicted INFO `present=false`.
- **§3, the mutation:** head minus §2.1's branch, which behaves as the base, fails at `.crs-assertion-form not present`.
- **I3:** every other step of both suites is unchanged.

**The harness is adequate for these claims.**
- It differs from the shipped app only in transport plumbing: CDP, a host-resolver map of 5180 to 5400, and vite on 5400. None of it touches the admission path, the kernel or the engine.
- The one debug exe can serve both arms, because the diff has no Rust in the exe (kernel/tests is not linked).
- It keeps to the human's item 1 terms (`state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md`, item 1). The extra `--disable-features`/autoplay arguments are phase A's overlay, byte-copied as that item allows, and are disclosed.
- The failed first base run is disclosed as class 2.

**The unit tests.** The mutations for CF1 to CF4 are observed, named, and attributed to bc0b0d7a (worker report 1, its CF table).

**The run logs** are the custodian's transcription from untracked scratch logs. That is evidence, not Authority (round 14, as dated non-retroactive), and §9 asks only for the step lists in the PR body. The reviewer, who has Bash, should confirm that the PR body carries those step lists.

## Documentation (must fix before the merge; no re-gate)

**D1. Part X's fixture command names a broken path** (§2.5; the operator instruction is unusable as written).
- The defect: `frontends/shell/MANUAL-WALKTHROUGH.md:1793` @ bc0b0d7a reads, byte-copied, `` from `C:devspatial-ide`, ``. The backslashes were lost.
- The fix: write `C:\dev\spatial-ide`, as Parts at lines 1569, 1617 and 1673 do.
- This is one in-place edit within §2.6's scope and the 20-line ceiling.

**D2. Amendment 3 item 2's hash reference is not in the required form** (round 12's hash form; round 15 (e)).
- The defect: it carries `sha256 590040be` (`frontends/shell/SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED-PREREGISTRATION.md:328`, on main). That is an 8-hex prefix with no explicit `@ <rev>` at a commit on main.
- The fix: the custodian appends one correction row of at most three sentences (round 12 (d)). It names the record @ the commit on main that added it, with the full sha256 the record's own line 1 states (590040beb68025e494f2f16ee64113d6e903d5082cb06f0c7f673e3382e1b619, line 5 to the end).
- Append-only means the row is added, not edited in place.

## The wording-block check (`AUTONOMY.md` §31; `state/directives/2026-10-11-direction-after-status-review.md`, item 2)

KNOWN-LIMITATIONS item 2 (`KNOWN-LIMITATIONS.md:60` @ bc0b0d7a) has two spans. Both are **the human's wording** (`state/directives/2026-10-11-merge-205-ruling-207-c-crs-form-open-items.md`, item 3). By my reading at the head, both match the directive's lines 14 and 16 byte for byte. The worker's script proof is in report 1. The reviewer recomputes the line hashes. Each clause, checked against the code:

**The replaced sentence.**
- "The app then offers the CRS assertion form": true. The proof is the chain `AdmissionPanel.tsx:30` → `:52` → `:381-394` @ bc0b0d7a, and ABSENTCRS' at the head shows it in the shipped flow.
- "so you can assert the CRS the file is really in": true.
  - The paste route takes any PROJJSON up to 65 536 bytes (`crsAssertionState.ts:30` @ bc0b0d7a), beside the two catalog entries. So any real CRS can be asserted.
  - The sentence claims the assertion, not that the file opens. The same paragraph's "Still refused" list carries the non-x-first case.
  - No clause claims the assertion is checked, which ADR-032 decision 7 would forbid.

**The phrase "a latitude-first or northing-first CRS that you assert yourself" (still refused): true.**
- Any asserted non-x-first order is refused as `engine.axis_order_unsupported` (`dataset.rs:422-426`, `crs.rs:161-163` @ bc0b0d7a). This holds over F-2 and over explicit-null files alike, because both reach `crs::admit` with admissible `None`.

**The gate result.** No case that ordinary use can reach contradicts either span, and no case needs a source-comment note. **No replacement words are proposed.** Per the human's instruction in item 3, there is nothing to report as wrong.

## Part X's rows (§2.5; observation only)

X1 to X3 are operator-observable:
- X1: the refusal panel's code and message, the form below it, and no identity form.
- X2: picking the catalog entry, the `<details>` "Full definition" toggle, and the "Assert this CRS" button (`CrsAssertionForm.tsx:90-93`, `:136-138` @ bc0b0d7a). Then parcels draw, and the CRS line reads `EPSG:2056 — caller-asserted by <user> at <time>`.
- X3: a reopen is refused again with the form shown. Nothing persists, as the claim notice at `CrsAssertionForm.tsx:63-67` @ bc0b0d7a says.

No row carries a duration. The only defect in the Part is D1.

No ADR is needed. No decision is missing.
