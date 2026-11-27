Reviewed: main at a21d5de7d44035339e2cce56112c54178932afb2, in the detached read worktree C:/dev/wt/read-1123t (the custodian's filing note, 2026-11-23: the architect's form gate on the full form, attempt 1, node:identity-declaration-route-for-session-tier@form-gate-architect-1, dispatched at 2026-11-23T15:55:12Z; its run: Read 58, Grep 27, Glob 6, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T15:55:12Z to 2026-11-23T16:06:10Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 18446 bytes, sha256 624a4a3d2148b53e581bd5a1754c5e4d44911cb50433844017837ddbe925d448, byte for byte, nothing masked, with one final newline added. FAIL: C1 (Correctness: D3 says a column that fails is refused only after the scan, but a missing column, a non-integer type and a name nothing can address are refused before it; D3 is a draft for the advisor) and C2 (Correctness: the offer is tied to the panel's last admission, which the recovery offer's Recover bypasses; bind it to the dataset on the map or add a stop); E1 (Evidence: M-S1 survives S-1 as it stands) and E2 (Evidence: no test fails if the declaration drops the CRS assertion); N1 to N9 Documentation; OPEN-1 to OPEN-6 read for the advisor, not ruled.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123t @ a21d5de7d44035339e2cce56112c54178932afb2

Tag: node:identity-declaration-route-for-session-tier@form-gate-architect-1. I used Read, Grep and Glob only and ran nothing. Every file:line below is at a21d5de7.

## Correctness

**C1. §2 item 6, D3: one clause is untrue.** D3 says "A column that fails is refused only after that scan". That holds only for duplicate or negative values (engine/src/dataset.rs:2064-2098). Three cases are refused before any scan:
- a missing column (dataset.rs:1998-2003);
- a non-integer type (dataset.rs:2028 → engine/src/identity.rs:336-344);
- a name nothing can address (dataset.rs:2019-2025).

The missing column is ordinary use, and §10's operator row 3 drives exactly that case. D3's clause check covers only DUPKEY'. D3 is a draft for the advisor, under P6, and is not the human's wording. Suggested words for the advisor:

```text
Declaring a column checks it across the whole file
```
```text
Declaring an integer column checks it across the whole file
```
```text
A column that fails is refused only after that scan, so a retry is not free.
```
```text
A column whose values repeat, or that holds a negative value, is refused only after that scan, so a retry is not free.
```

Each clause checked against the code:
- "integer column … checks … whole file": identity.rs:333 admits the integer types, then a single scan runs at dataset.rs:2045-2068.
- "repeat, or … negative … only after that scan": dataset.rs:2076-2098.
- The rest of D3 is unchanged and true: dataset_ref.rs:216-233 and :383-388; project/mod.rs:818-825; skp.rs:1754-1762 (`skip_uniqueness_check` is always false).
- One edge is not ordinary use and goes in the source comment: an integer column whose name holds U+0000 is refused before the scan.

**C2. §2 item 4 (b) and §8: the offer is tied to the panel's last admission, not to the dataset on the map.**
- On main today these are the same thing: every open and reopen goes through the panel's `runAdmitPath` (AdmissionPanel.tsx:350-375).
- The recovery offer breaks that. It may merge first under §8, and ADV-2026-11-23-15 item 7 places it before the gap pieces. By its §2.7 (B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md:141-144), its Recover runs its own `runAdmitPath` in a new RecoveryOffer.tsx, and App applies the result. The panel's state is never touched.
- Ordinary use reaches the stale case: the recovery list shows at mount; the user opens a keyless file X; then the user clicks Recover. The panel still offers to declare a column for X while a different dataset Y is on the map.
- Then D2's "opens this file again" and "the file stays open as it is now", and D4's "beside the Open buttons", describe X, not the dataset the user sees.
- The seam was written against main's interface, not against the base §8 itself names. One of two fixes is needed before code:
  - (i) bind the offer to the dataset on the map. App passes the handle of the dataset on the map as a prop, and the offer returns null unless that handle equals `admitted.dataset`. This puts App.tsx in §7 and changes block-on-sight 2, so it is class 9.
  - (ii) at minimum, add a stop:

```text
- I4 (invalid run): E-1 at P0 fails for any reason other than the missing control.
```
```text
- I4 (invalid run): E-1 at P0 fails for any reason other than the missing control.
- I5 (stop): the base holds a route that puts a dataset on the map without the panel's `runAdmitPath` (the recovery offer's Recover, its §2.7); the form is amended to bind the offer to the dataset on the map before any code.
```

## Evidence

**E1. §4, M-S1 survives as S-1 stands.** The rule requires both `class === "session-ordinal"` and a non-null `candidate_columns`. The wire sends the list exactly when the class is session-ordinal, so on any real shape the class test is redundant. S-1's natural native and mapped states have no list: the file's own `describeFixture()` (AdmissionPanel.test.ts:137-145), and the shared native and caller-asserted fixtures, which will carry `null`. With the class test removed, (ii) and (iii) still return null, so S-1 still passes and the mutation is never killed.

```text
- (ii) native gives null;
```
```text
- (ii) native gives null, its `candidate_columns` set to `["parcel_key"]`, a shape the wire never sends, so that only the class test refuses it;
```
```text
- (iii) mapped gives null;
```
```text
- (iii) mapped gives null, built the same way;
```

**E2. §1 claims the declaration keeps the CRS assertion, but no test can fail if it does not.**
- The merge happens in the render's `onSubmit`, at `{ ...offer.options, identity }` (§2 item 4 (c)), and the package has no render harness.
- S-1 (vi) checks only the offer's `options`.
- S-2 calls `runAdmitPath` with options the test builds itself.
- E-1 carries no CRS assertion.
- So the mutation `admitPath(offer.path, { identity })` passes every declared test.
- Fix: move the merge into a pure function that S-2 exercises, and add its mutation.

```text
and `onSubmit` runs `admitPath(offer.path, { ...offer.options, identity })`.
```
```text
and `onSubmit` runs `admitPath(offer.path, declarationOptions(offer, identity))`, where `declarationOptions` is an exported pure function returning `{ ...offer.options, identity }`. S-2 starts from U-1 opened under a CRS assertion and builds its call's options through it. M-S3: `declarationOptions` returns `{ identity }` alone; S-2 fails at the merged `crsAssertion`.
```

M-S3 also joins §4's mutation set and §10's count of observed mutations.

## Documentation (must-fix before the merge; no second attempt)

**N1. OPEN-4 (a): its reasoning is untrue.** It says option (a) keeps ADR-016 Amendment 1 item 6's sentence true. But this piece edits existing tests anyway: the literal's test files, and AdmissionPanel.test.ts:435 and :488. That sentence (ADR-016:234-236) stated what Amendment 1's own change did. The recommendation itself is sound: the shell casts the `invoke` result (client.ts:61, :97), so optional and required differ only at compile time.
```text
and keeps ADR-016 Amendment 1 item 6's "existing tests" sentence (:234-236, paraphrase) literally true.
```
```text
and edits existing tests only where the literal and the two `admitted` literals of §5 require it; ADR-016 Amendment 1 item 6's "existing tests" sentence (:234-236) stated Amendment 1's own change and does not bind this piece.
```

**N2. §2 item 6: four clause labels in quotation marks do not match D2 or D3 byte for byte.** The third drops the qualifier "afterwards".
```text
"opens again":
```
```text
"opens this file again":
```
```text
"refused only after the scan":
```
```text
"refused only after that scan":
```
```text
"a project saved records it":
```
```text
"a project saved afterwards records it":
```
```text
"checks again":
```
```text
"checks the column again":
```

**N3. Drafted-by line: the authoritative base is named wrongly.** Under ADV-2026-11-23-15 item 4, the base is a merge commit on the piece's branch, not a commit on main.
```text
Every pin is historical: for the code, the piece's base on main is authoritative.
```
```text
Every pin is historical: for the code, the base recorded under ADV-2026-11-23-15 item 4 is authoritative until every base has merged, and main after.
```

**N4. §7 counting: `<merge-base>` is undefined.** Read against main, the range would count the held heads' own diffs.
```text
':!state/**'`, at a named commit.
```
```text
':!state/**'`, at a named commit. `<merge-base>` is the base recorded under ADV-2026-11-23-15 item 4 until every base has merged, and `git merge-base origin/main <head>` after.
```

**N5. §8: the base, the recovery row and the readability sentence are incomplete.**
- PR 360 overlaps on `admitDataset.test.ts`, so item 4 requires its head too.
- The recovery offer's §2.4 moves the literal in every file that carries it (its line 126), so it shares this piece's literal test files.
- Milestone 5's PR A may edit `admission-remediation.mjs` (its line 309).
- Neither of those two forms edits AdmissionPanel.tsx (recovery offer line 143; milestone 5 lines 293-319).
```text
- By ADV-2026-11-23-15 item 4, the custodian builds on the re-link's head, which holds most of the shared regions and the protocol place.
```
```text
- By ADV-2026-11-23-15 item 4, the custodian builds on the re-link's head (the heads of PR 353, PR 358 and PR 359), and takes in by merge commits the head of PR 360 and, if it is held by then, the recovery offer's head.
```
```text
| the recovery offer (form filed) |
```
```text
| the recovery offer (form filed); also the literal's test files `saveProject.test.ts`, `admitDataset.test.ts` and `RefusalBlock.test.tsx`, by its §2.4 |
```
```text
The recovery offer's "and others" and milestone 5's "e2e suites" were not readable to me, and the custodian confirms them.
```
```text
Of the filed forms, milestone 5's PR A may edit `admission-remediation.mjs` if its re-sweep lists it (its §2.6), and neither it nor the recovery offer edits `AdmissionPanel.tsx`.
```

**N6. OPEN-1: the human's own reservation is not named.** The human's additions of 2026-10-09, item 3, say the form asks the human this question. The form does not say so.
```text
(To the advisor, ADV-2026-11-23-15 item 7 (d).)
```
```text
(To the advisor, ADV-2026-11-23-15 item 7 (d). The human's additions of 2026-10-09, item 3, put this question to the human; the advisor reads whether it is the advisor's to rule or to draft for the human, ADV-2026-11-23-15 item 8.)
```

**N7. D4: "quoted" is wrong.** §0's intake names the sentence; it does not quote it.
```text
Only its sentence quoted in §0's intake changes.
```
```text
Only the sentence §0's intake names changes, the one beginning "The app does not yet offer".
```

**N8. OPEN-2 does not say where the accepted amendment text lands.** ADR-016 is not in §7.
```text
It is needed under (A), and the code waits for its acceptance. A skeleton follows.
```
```text
It is needed under (A), and the code waits for its acceptance. Its accepted text is appended to `docs/adr/ADR-016-stable-feature-identity-admission.md` by its own commit, outside this piece's diff and §7's count. A skeleton follows.
```

**N9. Two doc comments the change makes untrue are not named.**
- identity.rs:248-249 says no surface carries the list and that `describe` may not gain a field for it.
- IdentityDeclarationForm.tsx:14-16 names the refusal's field as the list's only source.
```text
drops the instrument exemption, which this product caller makes untrue, and names `describe_dataset` as its caller.
```
```text
drops the instrument exemption and its sentences that no surface carries the list and that `describe` may not gain a field for it, which this product caller makes untrue, and names `describe_dataset` as its caller.
```
```text
D3 replaces the cost notice. It is shown on both routes.
```
```text
D3 replaces the cost notice. It is shown on both routes. The `candidateColumns` prop's doc (:14-16) names `describe.identity.candidate_columns` as the list's second source.
```

## The checks the brief asks for

**Class.** Full, with both gates, holds.
- By ADV-2026-11-16-06 item 2 (a), which ADV-2026-11-23-15 item 7 (d) re-applies: the piece is on the wire, crosses a module seam, and is over 260 lines. It also carries an ADR amendment.
- By AUTONOMY §21a: the wire (AUTONOMY.md:323-324) and the ADR amendment (:319-320).
- Under (B) or (C) it stays full: by §21c, new user-visible behaviour and more than 150 lines (AUTONOMY.md:350-351).

**ADR-016's envelope.** (A) needs the amendment, and I2 holds the code until it is accepted.
- ADR-016:165 puts the list in the refusal, not the record, and :150-151 names `describe.identity` as the record.
- The admission form also flagged this to the architect and the human (ADMISSION-PREREGISTRATION.md:282-289). OPEN-2's Context could cite that.
- (B) and (C) avoid the ADR text. (B) does so by copying an ADR-governed rule into the shell, which cannot see the exported-name metadata (addressability.rs:101-105).
- (D) puts the list outside the refusal as well, so it would need the same reading.

**The wire.** The member is on `describe`, a control-plane reply, and is small metadata, so it is not instrument surface under ADR-004 Amendment 4. `deny_unknown_fields` and the literal bump follow SKP-V0.md:305-309. There is no MCP adapter in the tree. OPEN-4 (a) is sound in effect; see N1.

**Callers.** Every new item has a product caller:
- `identityDeclarationOffer`: the render;
- `IdentityInfo.candidate_columns`: set by `describe_dataset`, read by the offer;
- `DatasetIdentity::candidate_columns()`: gains `describe_dataset` as its caller and loses its instrument exemption (see N9);
- `resume`: `runAdmitPath`;
- `path` and `options` on the `admitted` state: the offer.
- E-1 needs no new DEV hook.

One small point for the worker: `disabled={isOpenInFlight(state)}` is always false wherever the offer renders.

**Seams.** All eight signatures hold at a21d5de7: skp.rs:1960, identity.rs:257, commands.rs:190-222, types.ts:131-146, admitDataset.ts:48, AdmissionPanel.tsx:216, IdentityDeclarationForm.tsx:13-20 and :34, workspaceState.ts:127, dataset_ref.rs:216.
- K-1 follows the precedent at skp.rs:3022-3095 and is feasible in skp_admission_remediation.rs, which already uses `SkpHost`.
- T-1's fixture value `parcel_id` matches the Int64 column at the session-ordinal fixture's line 34.
- The failing seam is C2.

**Tests.** Each red-at-P0 reason holds.
- E-1 is feasible in the suite: `assertSessionTier` (admission-remediation.mjs:419-440), the DOM reads MAP' already uses (:460-475), and the fixture at :53.
- M-K1, M-S2, M-T1 and M-E1 each have a named failing point.
- M-S1 does not (E1), and the CRS carry has no mutation (E2).
- The existing `admitted` state literals are exactly AdmissionPanel.test.ts:435 and :488. The other `"admitted"` uses there are `AdmissionOutcome` values or checks of `kind` only.

**Scope.** 38 files, which matches the list. The literal also appears in doc comments outside Scope, which correctly stay unchanged (for example mod.rs:124, client.ts:160, src-tauri commands.rs:8). The 66 count is approximate: the three conformance files hold 65. The block-on-sight items read sound one by one.

**OPEN items** (not ruled):
- OPEN-1 (A): sound.
- OPEN-2: needed; the skeleton is sound.
- OPEN-3 (a): sound, since a reopen's `admitted` state carries `options.reopen` (AdmissionPanel.tsx:365).
- OPEN-4 (a): sound; see N1.
- OPEN-5 (a): sound (saveProject.ts:92-114).
- OPEN-6: D1 and D2 are true against the code (workspaceState.ts:151-158; App.tsx:2234-2237). D3 has the untrue clause in C1. D4 is true, subject to C2.

**Constitution.**
- docs/01's never-block rule holds: Cancel is at AdmissionPanel.tsx:495-508, the declared-column liveness line at :167-173, and the scan is cancellable (dataset.rs:2063-2073).
- docs/02's module split holds: the engine computes the list, the kernel carries it, the shell renders it.
- ADR-006 is unchanged: no step is recorded for an open (App.tsx:1179-1180).
- ADR-010 is untouched. The ADR-018 vocabulary is fine.
- D2 is owner text stating the owner's own consequences, which is correct.

**Records.**
- The human's quotes are byte-exact: 2026-10-09 additions line 21, ADMISSION-PREREGISTRATION.md:67, and ADR-016:165 as a sub-line without its bold markers. ADV-2026-11-16-06:25 is byte-exact too.
- There is no line cite into the ledger and no bare self-line.
- The pins are named as historical; N3 corrects which base is authoritative.
- I read each (r) entry: every one is the lines the form means. The others I checked also hold at a21d5de7, PLAN.yaml:5020-5036 and :5364-5369 included.

## Files read (at a21d5de7)
governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md; state/directives/2026-11-23-the-humans-message-never-idle-…-what-does-not-change.md; state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-….md; state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-….md; state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md; state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-02-… (grep); docs/adr/ADR-016-stable-feature-identity-admission.md; governance/AUTONOMY.md:313-360; governance/PLAN.yaml:5015-5040, 5360-5371; governance/forms/engine/ADMISSION-PREREGISTRATION.md:60-71, 278-291, 855-881; governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md (grep; 136-155, 205-232); governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md (grep; 88-107, 280-329); governance/forms/frontends/RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md (grep; 99-120); governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md (grep; 215-232); governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md (grep); state/consults/2026-11-23-identity-declaration-route-for-session-tier-architect-draft.md:1-4, 350-376; state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:62-70; engine/src/identity.rs:130-469; engine/src/dataset.rs:1960-2104; engine/src/addressability.rs:95-107; engine/src/fixture.rs (grep); kernel/src/skp.rs:1730-1790, 1950-2069, 2210-2244, 3010-3095; kernel/src/dataset_ref.rs:205-239, 375-392; kernel/src/project/mod.rs:805-829; kernel/tests/project_reopen.rs:918-922; kernel/tests/skp_admission_remediation.rs (grep; 195-212); protocol/skp/src/v0/commands.rs:1-230; protocol/skp/SKP-V0.md:78-91, 302-310, 1162-1169; protocol/skp/tests/data/v0-describe-response-session-ordinal.json; protocol/skp/tests/conformance/README.md and AMBIGUITIES.md (grep); frontends/shell/src/skp/types.ts:1-160; frontends/shell/src/skp/client.ts:60-119; frontends/shell/src/skp/__tests__/fixtures.test.ts:195-284; frontends/shell/src/admission/AdmissionPanel.tsx (whole); AdmissionPanel.test.ts:134-169, 425-494 (and grep); IdentityDeclarationForm.tsx (whole); admitDataset.ts (whole); DescribeSummary.tsx:50-79; frontends/shell/src/workspace/workspaceState.ts:110-170; frontends/shell/src/App.tsx:1170-1184, 1620-1664, 2215-2254; frontends/shell/src/project/saveProject.ts:80-119; frontends/shell/e2e/admission-remediation.mjs:40-64, 400-519; KNOWN-LIMITATIONS.md:60-73, 280-287; repository-wide grep for the literal `skp/0.14` and for `session_statement`.

Model: Opus 5.5 (claude-opus-5-5).
