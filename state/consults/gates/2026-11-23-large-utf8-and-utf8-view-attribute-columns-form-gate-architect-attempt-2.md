Reviewed: main at fe99e848713768a6d8338b96ee2b8ac4c9c891cb, in the detached read worktree C:/dev/wt/read-1123ab (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 3, attempt 2, node:large-utf8-and-utf8-view-attribute-columns@form-gate-architect-2, dispatched at 2026-11-23T19:07:48Z; its run: Read 39, Grep 14, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T19:07:48Z to 2026-11-23T19:16:22Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 12044 bytes, sha256 fb494d258176217167d6c0c64b75deed12acc4e76186c2f4064bfbde8848fd30, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; ADV-2026-11-23-21 recorded truly, its class-9 scope addition declared before any code with every part class 9 asks; C1, C2, E1, E2 and D1 to D6 answered against the code; the two drafted notes true, with points for OPEN-5 and OPEN-6; three Documentation findings, D7 to D9, to be fixed before the merge, with replacement words, none asking for another attempt.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/read-1123ab @ fe99e848713768a6d8338b96ee2b8ac4c9c891cb

I read the form at fe99e848, with Amendment 2's New texts in place of its Old texts, and checked it against the code at that commit. I found no Correctness or Evidence finding. The three Documentation findings below (D7 to D9) are must-fix before the merge. They ask for no further attempt (ADV-2026-11-21-20). None of the sentences involved is the human's wording: they are lead-data's, or attempt 1's carried words. So the worker applies the replacement words with no re-gate and the PR body lists them, under AUTONOMY §31 and the 2026-10-11 directive, item 2. The form is append-only, so the custodian carries the words by an appended amendment.

## 1. Whether ADV-2026-11-23-21 is recorded truly (Amendment 2, item 1)

- Items 1, 3, 4, 5 and 7 need no form text, and the item-1 record is true for each.
  - Item 1: the form already recommends (A) with T3.
  - Item 3: S1 and S2 stay unchanged.
  - Item 4: T3 is already named a premise pin at form:145.
  - Item 5: I2's S1 grade is already at form:196.
- Item 2 is carried in full:
  - the note is drafted (form:366-377);
  - ADR-023's file joins the Scope;
  - §8 item 7's New text uses the ruling's reading, and the quote at form:439 matches the ruling's line 16 byte for byte;
  - the Merge line waits on the note's ruled words (form:476).
- Item 6 says "as the form says", and D1's New text changes the Branch bullet that item 6 ratified. That is a note, not a finding: the two describe the same build, and ADV-2026-11-23-15 item 4 governs the build's shape. Lead-data's consult flags this (point 5) but does not put it to the advisor.

**The class-9 scope addition** (template, Round 25 additions, class 9):
- The first line carries "scope addition" and names ADV-2026-11-23-21. The ruling's path is in the amendment's italic note.
- It is declared before any code (Amendment 3, item 7), with all the parts class 9 asks for:
  - §2 shape: one appended region, 10 insertions and 0 deletions;
  - §4: no test, with the reason given;
  - §5: declared unchanged (form:411), and invalidator I5 (form:420);
  - §8 item 7 (form:428) and §9's Reviewer line (form:436).
- The note's fence is 10 lines (form:367-376), which matches the stated count.
- ADR-023 ends at line 183, which is a list item (ADR-023:183), so the fence's leading blank line is right.

## 2. The attempt-1 findings, against the code

- **C1 (adapted): answered.**
  - §1 (form:451), the Cost line (form:459), OPEN-2 (form:467-468) and Merge (form:476) now name ADR-021's Note 2026-09-24 item 1 (ADR-021:233).
  - The adaptation is true: grant item 2 delegates ADR notes to the advisor (state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md:15).
  - The words conflict with Amendment 2 item 4; see D8.
- **C2: answered.** It is byte-identical to the gate's words. Every cite holds at fe99e848:
  - kernel/src/session_history.rs:749-758 compiles a match against the file schema, with no admission first;
  - kernel/src/publish/mod.rs:530, :547-548;
  - frontends/shell/src/App.tsx:855-858;
  - renderer/src/compiled.rs:233;
  - renderer/style-ts/src/style.ts:46.
- **E1: answered.** describe's `projectable` is `admit_projection_column(...).is_ok()` (kernel/src/skp.rs:2064-2069), and T1 calls the same function.
- **E2: answered.**
  - The product pool's `configure_new` runs `configure_connection` on its None branch (engine/src/pool.rs:435-438).
  - The fixture runs the same function (engine/src/fixture.rs:58-64).
  - CONFIGURE_SQL sets neither setting (pool.rs:185-187).
- **D1 (adapted): answered.** It matches ADV-2026-11-23-15 item 4: the base is a recorded merge commit, the PR is a draft against main, and the body names the base.
- **D2: answered.** It is put to the advisor as OPEN-7.
- **D3: answered.** I checked the predicted red sets against the code:
  - T1's mutation reaches T4 through engine/src/predicate.rs:1249;
  - T2's mutation is caught only through `is_admitted_scalar` (attributes.rs:101). The filter refuses a dictionary by name before the gate (predicate.rs:1239-1248), so T4 stays green;
  - no other existing test asserts LargeUtf8 or Utf8View. I grepped engine/, kernel/, renderer/ and protocol/: only E1 (attributes.rs:618) and E2 (predicate.rs:2698-2699) do.
- **D4: answered.**
  - error.rs:403-407 wraps the filter's reason as stated.
  - The cited FeatureTab.tsx line (:63, joined at :66) names the columns that are not projected.
- **D5: answered.**
- **D6: answered.** Amendment 3 item 4 gives the three hashes. The PLAN.yaml pin is named historical, with the tree authoritative. I have no Bash, so the reviewer recomputes the hashes.

## 3. The two drafted notes: notes for the advisor, not findings, and not reworded

Every sentence in both notes is true against the code and the ADRs. Points for OPEN-5 and OPEN-6:

- **The ADR-023 note.**
  - Item 1 is true: a dictionary over either type fails the guard at attributes.rs:101 and falls to the final arm at :109-115.
  - Item 3 is true for describe, viewport_query (kernel/src/skp.rs:1856-1869, 1899) and publish (engine/src/stream.rs:978-983).
  - Item 3 leaves out the filter namespace. ADR-023's own §8 says the namespace shares the same gate (ADR-023:110). Item 5 defers the namespace to ADR-021, which is a true statement of the note's scope. But if OPEN-6 is ruled no, no ADR text records the narrowing of the filter namespace.
  - Item 2's last sentence ("pins that export") holds only for a VARCHAR export on a configured connection. T3 reads no file (E2's limit).
  - The count of 10 lines is the draft's. Words ruled to a different length change the expected numstat.
- **The ADR-021 note.**
  - "eleven codes" is true by the Note 2026-11-06 (ADR-021:281).
  - The `reason` the note describes is `e.to_string()` (predicate.rs:1252).
  - Item 3 is true: dictionaries are excluded by name (predicate.rs:1239).

## 4. Counts (Amendment 2, item 5)

- The Scope is 6 files, or 7 if OPEN-6 is ruled yes. That is within §21c's 8 files.
- About 180 or 188 lines is over §21c's 150, and the piece touches an ADR (§21a). Full gating holds on both grounds.
- The line estimate stays under §7's 220.
- §7's figure of 5 files is not edited. That is right: class 8 is recorded at the closing, with the final figure from §7's own counting command, as OPEN-8 recommends. No code is landed before the declaring amendment.

## 5. OPEN-5 to OPEN-9: each is put truly (substance in the consult at lines 336-344)

- OPEN-5: ADR-023:163 is headed as the consult says.
- OPEN-6: the precedent the consult cites holds at ADR-021:233 and :237-242.
- OPEN-7: ruling item 5 restates I1 as "neither".
- OPEN-8: the template's Round 25 additions, class 8.
- OPEN-9:
  - SKP-V0.md:451-453 defines the namespace by the function, not by a list;
  - its dated notes are at :455-468;
  - nothing under protocol/ names either type (grep).

Notes:
- In the form itself, OPEN-7 and OPEN-9 are bare labels.
- Ruling item 4 says T3 must be named a premise pin in the PR body too. That obligation sits outside the form.
- attempt 1's test-text point still stands: `admit_projection` takes `&[String]` (form:136).

## Documentation (must be fixed before the merge)

**D7: the no-overlap line in Amendment 2 item 2 (form:395). It is untrue.**
- It says no other held piece or filed form names any of the five paths.
- PR 350's form names engine/README.md in its Scope (governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md:342, :425). This form says the same at form:108.

```text
No other held piece or filed form names any of the five paths above. For ADR-023's file, joined by Amendment 2, the custodian compares it with every held PR's files before any code (ADV-2026-11-23-15 item 4).
```
```text
Of the five paths above, engine/README.md is also in PR 350's Scope (`cut/cancel-stamp-order`), which the Branch bullet's base takes in. For the other four, and for ADR-023's file, joined by Amendment 2, the custodian compares them with every held PR's files before any code (ADV-2026-11-23-15 item 4).
```
Clause check:
- PR 350's form :342 and :425 list engine/README.md.
- D1's New text (form:544) takes PR 350's head in by a merge commit.
- ADV-2026-11-23-15 item 4's first bullet orders the comparison before code.
- I make no absence claim about the other four paths.

**D8: the ADR-021 framing at form:451, :459 and :467 contradicts Amendment 2 item 4 (form:623).**
- Item 4 says no sentence of ADR-021 becomes untrue and the set narrows by reference.
- The carried texts say the namespace "departs from" ADR-021's note.
- ADR-021:233 defines the set as ADR-023 §2's list "which is decided by the one admission function". Item 4's reading is the true one.

```text
Under (A) the namespace refuses the two types through `admit_attribute_type` (engine/src/predicate.rs:1249), so it departs from that note too.
```
```text
Under (A) the namespace refuses the two types through `admit_attribute_type` (engine/src/predicate.rs:1249). That note takes the list as the one admission function decides it, so no sentence of it becomes untrue: the set it names narrows with ADR-023's note, and whether ADR-021 states that change in a note of its own is OPEN-6.
```
```text
Cost: it departs from ADR-023 §2's list and from ADR-021's Note 2026-09-24 item 1, which defines the filter namespace by that list (OPEN-2).
```
```text
Cost: it departs from ADR-023 §2's text list, and the filter namespace that ADR-021's Note 2026-09-24 item 1 defines by that list narrows with it (OPEN-2).
```
Clause check:
- predicate.rs:1249 is the namespace's type gate.
- ADR-021:233 reads as quoted.
- OPEN-6 is the question of a note for ADR-021 (form:654).

**D9: the same framing in C1's §1 New text (form:451).**

```text
The filter namespace, which ADR-021's Note 2026-09-24 item 1 defines by that list, departs with it;
```
```text
The filter namespace, which ADR-021's Note 2026-09-24 item 1 defines by that list, narrows with it;
```
Clause check: as for D8.

I found no missing decision, so no ADR skeleton is needed.

## Files read (at fe99e848)

- governance/forms/engine/LARGE-UTF8-AND-UTF8-VIEW-ATTRIBUTE-COLUMNS-PREREGISTRATION.md (whole)
- governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md (grep, engine/README.md)
- governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md (grep, the ADR paths)
- governance/forms (grep, the ADR paths)
- state/consults/gates/2026-11-23-large-utf8-and-utf8-view-attribute-columns-form-gate-architect.md (whole)
- state/consults/2026-11-23-large-utf8-and-utf8-view-attribute-columns-amendment-2-lead-data-draft.md (:1-12, :320-365)
- state/consults/2026-11-16-large-utf8-and-utf8-view-attribute-columns-probes-u1-u2-tester-report.md (whole)
- state/directives: ADV-2026-11-23-21 (whole); ADV-2026-11-23-15 (whole); the 2026-11-13 grant (whole)
- docs/adr/ADR-023-attribute-projection-on-viewport-query.md (whole)
- docs/adr/ADR-021-row-filter-on-viewport-query.md (:1-20, :60-104, :215-282)
- docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md (:118-145)
- docs/PREREGISTRATION-TEMPLATE.md (:155-178)
- governance/AUTONOMY.md (:315-364)
- engine/src/attributes.rs (:20-393, :470-689, :930-969)
- engine/src/predicate.rs (:1140-1290, :2680-2734)
- engine/src/error.rs (:396-410)
- engine/src/pool.rs (:170-210, :420-449)
- engine/src/fixture.rs (:50-69)
- engine/src/dataset.rs (:1095-1129)
- engine/src/stream.rs (:978-1003, :2340-2375)
- kernel/src/skp.rs (:1850-1904, :2058-2072)
- kernel/src/publish/mod.rs (:520-554)
- kernel/src/session_history.rs (:735-764)
- protocol/skp/SKP-V0.md (:440-471)
- protocol (grep)
- renderer/src/compiled.rs (:228-240)
- renderer/style-ts/src/style.ts (:45-47)
- frontends/shell/src/attributes/projection.ts (whole)
- frontends/shell/src/feature/FeatureTab.tsx (:55-93)
- frontends/shell/src/App.tsx (:848-861)

Model: claude-opus-5-5
