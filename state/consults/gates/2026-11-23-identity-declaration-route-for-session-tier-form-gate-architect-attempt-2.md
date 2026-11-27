Reviewed: main at 5bc4011bf7c592e77fc393d84fe7403f651a48ed, in the detached read worktree C:/dev/wt/read-1123z (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 3, attempt 2, node:identity-declaration-route-for-session-tier@form-gate-architect-2, dispatched at 2026-11-23T18:07:10Z; its run: Grep 23, Read 20, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T18:07:24Z to 2026-11-23T18:15:25Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 13682 bytes, sha256 185848aec8a155b41cf2554e631b57227fb783102256925c6552e64256ef0eea, byte for byte, nothing masked, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; C1, C2, E1, E2 and N1 to N9 answered against the code; four Documentation findings, D-1 to D-4, to be fixed before the merge (replacement words for D-1 to D-3, an added item for D-4); the draft of ADR-016 Amendment 2 true against the code and the ADR, not ruled; for the advisor: the draft status word, ADV-2026-11-23-20 item 8 against ADV-2026-11-23-17 item 11, and the merge order.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/read-1123z @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed

Tag: node:identity-declaration-route-for-session-tier@form-gate-architect-2. I used only Read, Grep and Glob, and ran nothing. Every file:line below is at 5bc4011b. No code, ADR or doc changed after 6cf6140c, so Amendment 2's cites at 6cf6140c read the same here.

There are no Correctness or Evidence findings. There are four Documentation findings. Each must be fixed before the merge, and none needs another attempt (ADV-2026-11-21-20).

## Attempt-1 findings, each checked against the code

- **C1: answered.** D3's draft words are now the gate's words (form:549-560). I checked each clause check against the code, and each holds:
  - engine/src/identity.rs:333 admits the eight integer widths.
  - The single scan is engine/src/dataset.rs:2045-2069.
  - kernel/src/skp.rs:1754-1762 always sets `skip_uniqueness_check` false.
  - The negative check is at :2076-2086 and the repeat check at :2088-2097. Both run after the scan.
  - Before any scan, the engine refuses a missing column (:1998-2003), a name nothing can address (:2019-2025) and a type that is not an integer (:2028; identity.rs:336-344).
  - A Cancel ends as `EngineError::Cancelled` (:2071-2073).
  - A null value leaves the distinct count below the row count (:2046, :2088). That is true, and no test pins it, as the drafter says.
- **C2: answered.** Fix (i) binds the offer to the dataset on the map:
  - App's `admitted` (App.tsx:853) is the workspace's resource, which `handleAdmitted` writes with the same `Admitted` object the panel holds (App.tsx:1170-1199, :1198; AdmissionPanel.tsx:288-290). So after a panel admission the two handles are equal.
  - The recovery offer's Recover applies its result through `handleReopened`'s transitions, so through `handleAdmitted` (its form, B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md:143-144). It therefore changes App's handle and leaves the panel's state alone, and the comparison fails as intended. That holds in either order.
  - `<AdmissionPanel>` is rendered only at App.tsx:2221 (repo grep), so the prop is required at one site only.
  - Test: S-3 kills M-S4. E-1 proves the prop through the real app.
  - App.tsx is declared as class 9 before any code (form:619). §1, §9 item 2 and the new I5 are consistent with that.
- **E1: answered.** In S-1, (ii) and (iii) now carry a list the wire never sends, so M-S1 fails at (ii).
- **E2: answered.**
  - `declarationOptions` is a pure function with a product caller, the render's `onSubmit`.
  - S-4 goes through `runAdmitPath` (AdmissionPanel.tsx:216-292). It is red at P0 for two reasons: the offer is null, and P0's `declarationOptions` returns `{ identity }` alone. M-S3 kills it.
  - No test reaches the render line. The amendment says so at form:707 and puts it under block-on-sight 13, the reviewer's read. That matches what attempt 1 asked for.
- **N1 to N9: answered.** Each Old text matches. N6 and N8 are adapted to ADV-2026-11-23-20 items 1 and 2, and both adaptations are faithful to the ruling.

## The rulings
- **ADV-2026-11-23-20:**
  - Items 1 to 7 are recorded as ruled, and nothing ruled is changed.
  - The (A) heading, I1 and the block on the other answers are marked as not in force.
  - Item 7's literal: `SKP_VERSION` is `skp/0.14` (protocol/skp/src/v0/mod.rs:136; frontends/shell/src/skp/types.ts:15). The re-link takes no literal (ADV-2026-11-22-44, its OPEN-2 (a)).
  - Item 8 is recorded with a condition. The ruling's own words, that this piece is built on the node where they share AdmissionPanel.tsx, carry that condition.
- **ADV-2026-11-23-22:**
  - Item 6: fix (i), App.tsx as class 9, and §8 under ADV-2026-11-23-17 item 11.
  - Item 7: D3 replaces nothing of the human's.

## ADR-016's Amendment 2 draft (form:524-545): true against the code and the ADR; not ruled here
- **Context.** It is true:
  - The settled envelope's fourth bullet is at ADR-016:165, and the record is `describe.identity` (:150-151).
  - The refusal no longer fires on the session path (dataset.rs:1985-1988, :2005-2010).
  - The list is recorded but sent to no client (identity.rs:201-204, :244-250).
  - For the advisor: the single-file limit is Amendment 1 item 5 (:230-232), not item 1 alone.
- **Decision 1 to 5.** True:
  - There is one function, `candidate_identity_columns` (identity.rs:299-315). It keeps schema order and gives no rank.
  - The `class` member has three values (protocol/skp/src/v0/commands.rs:206-209), so "native or mapped" covers every class that is not the session tier.
  - Native and mapped refusals carry the list (dataset.rs:2002, :2023, :2084, :2096; identity.rs:343).
  - A declared mapping is always verified (ADR-016:163-164; skp.rs:1754-1762).
- **Consequences.** True:
  - A comma name is left out of the list but can still be declared by name (identity.rs:290-298, :313).
  - Nothing is added to what a project saves.
- **No contradiction with accepted text.** The draft narrows :165 only on the session tier and is appended. It is consistent with Amendment 1 item 6 ("Additive fields only"). The member is product data on a control-plane reply, so ADR-004 Amendment 4 holds.
- **For the advisor:**
  - The draft's italic line opens with "Proposed." Form:511 does not say whether that line changes when the heading becomes Accepted. If it does not change, the accepted ADR will keep a stale status word.
- **Red line.** The grant of 2026-11-13, item 2, names ADR amendments (state/directives/2026-11-13-the-grant-…md:15), so ADV-2026-11-23-20 item 2 is within it. This does not block.

## New tests
| Test | Why it is red at P0 | Mutation | Set | Known pass case |
|---|---|---|---|---|
| S-1 | today's rule gives null | M-S1 | {S-1} | none |
| S-2 | there is no `resume` | M-S2 | {S-2} | none |
| S-3 | case (i) gives null | M-S4 | {S-3}; S-1 passes equal handles | none |
| S-4 | the offer is null | M-S3 | {S-4}; E-1 carries no assertion | none |
| T-1 | the fixture has no member | M-T1 | {T-1} | none |

## Old texts, placement and ceilings
- **Old texts.** I grep-checked each of the 42 Old texts: each occurs exactly once above line 448. Every addition names where it goes.
- **Ceilings.** The counts hold:
  - Scope at form:229-234 is 38 files (4 + 14 + 4 + 3 + 11 + 2). With the ADR and App.tsx it is 40.
  - Lines: §7's estimate is 600, plus 32 for the two files, plus 83, which gives about 715.
  - §7's counting command does not exclude docs/adr.
  - The overrun is predicted before any code, recorded as class 8 at the count, and §7's line is not edited. That follows ADV-2026-11-23-17 item 12 and AUTONOMY §21a-§21c.
  - Order B's addition cannot be counted until the recovery offer's code exists. That is left to the code's gates.

## Points the drafter could not settle
1. ADV-2026-11-23-22 not being on main: resolved. It was filed at cfe25dc1, and Amendment 3 item 2 names it.
2. The re-link's head: for the code's gates (I5, and the seams re-read at the base).
3. ADV-20 item 8 against ADV-17 item 11: for the advisor.
4. Old-text matching: resolved (Amendment 3 item 3, and my check above).
5. Order B's literal count: for the code's gates. See D-1 as well.
6. Red line: does not block (see above).

The partitioned-node section is for the advisor, not this gate.

## Strings and KNOWN-LIMITATIONS: true or not; not ruled
- **D1:** no claim.
- **D2:** true under (i). The offer shows only while the panel's file is on the map, and a refusal leaves App's `admitted` as it was (App.tsx:2234-2237).
- **D3** (gate words): true. The integer column whose name holds U+0000 is for the source comment.
- **D3's alternative:** true by SQL's rule on nulls. No test pins it.
- **D4:** true.
- **D4's Recover variant:** true under (i).

## Documentation findings (must fix before the merge)

**D-1. Amendment 2 item 1 (form:499-500): order A's set of literal files is all 29 files the grep lists. Five of them are outside §7.**
- Repo grep: src-tauri/src/commands.rs:8, src/skp/client.ts:160, src/console/surfaceRegistry.ts:80, protocol/skp/src/v0/error.rs:241 and conformance/AMBIGUITIES.md:17 carry the literal as history.
- Attempt 1 ruled that these stay unchanged.
- Followed as written, order A either trips §9 item 1 or writes untrue doc comments.
- Order B has the same flaw. It also misses the recovery offer's files that use the panel's `State` or `runAdmitPath`, since §2 item 4 (a) and (d) change them.
```text
and the literal's files are those that `git grep -l 'skp/0\.14'` lists at the recorded base.
```
```text
and the literal's files are those that `git grep -l 'skp/0\.14'` lists at the recorded base where the literal is the version a request, a fixture, a test or a constant carries; a doc comment that names the version a member came in stays as it is (for example `protocol/skp/src/v0/mod.rs:124`, `frontends/shell/src/skp/client.ts:160`, `frontends/shell/src-tauri/src/commands.rs:8`). Any such file not in §7's Scope is a class-9 addition, recorded before its code.
```
```text
Its literal files are those that `git grep -l 'skp/0\.15'` lists at the recorded base, which includes the recovery offer's own new files that carry the literal. Any of those not in §7's Scope is a class-9 addition, recorded before its code.
```
```text
Its literal files are those that `git grep -l 'skp/0\.15'` lists at the recorded base where the literal is the version a request, a fixture, a test or a constant carries, which includes the recovery offer's own new files that carry it so; a doc comment that names the version a member came in stays as it is. Any of those not in §7's Scope is a class-9 addition, recorded before its code, and so is any recovery-offer file that holds an `admitted` panel `State` literal or calls `runAdmitPath` and must change for §2 item 4 (a) or (d).
```

**D-2. §2 item 4 (d) (form:112) and §9 item 14 (form:846) contradict each other.**
- Item (d) still sets `resume` when `prev` is admitted "with an offer". The offer now needs `datasetOnMap`, which `runAdmitPath` does not have (AdmissionPanel.tsx:187-198, :216-220).
- Item 14 blocks any offer decided without `datasetOnMap`.
- Either way of building (d) can therefore trip item 14.
```text
sets it when `prev` is `admitted` with an offer for the same path.
```
```text
sets it when `prev` is `admitted` for the same path and `identityDeclarationOffer(prev, prev.admitted.dataset)` is non-null; `runAdmitPath` does not see the dataset on the map, and the render decides the offer, with `datasetOnMap`, from whatever state it shows.
```
```text
The offer is decided anywhere but `identityDeclarationOffer`, or without `datasetOnMap`.
```
```text
The offer the render shows is decided anywhere but `identityDeclarationOffer`, or without `datasetOnMap`; `runAdmitPath`'s `resume` test of §2 item 4 (d) is the one other call, with the state's own handle.
```

**D-3. Amendment 2 item 2 (form:521): a cite covers only part of what it names.** Amendment 1's tiers run :186-228, not :186-208 alone.
```text
Amendment 1's tiers (:186-208)
```
```text
Amendment 1's tiers (:186-228)
```

**D-4. Amendment 2's new `path:line` cites at 6cf6140c carry no span hashes.** Amendment 1 item 3 set the form's own practice: each cite with its sha256. The custodian's next amendment adds them. This is an addition with no Old text, appended as that amendment's item:
```text
Span hashes. Every `path:line` cite in Amendment 2 is read at 6cf6140cd8dfcc6fc52b82011e5dae5799edf300; each entry below names the file and lines, the sha256 of those lines at that commit (each line with its LF, computed by script), and the Amendment 2 item that cites it.
```

## Notes for the advisor (no action asked of the form)
- Under §8's new base line, this piece cannot merge before any App.tsx piece taken into its base merges, milestone 5's PR A included. That is ADV-2026-11-23-17 item 11's rule, applied to a two-line change.
- Two mutations are named across: M-S4 belongs to S-3, and M-S3 to S-4. Both are consistent everywhere they appear.

## Files read (at 5bc4011b)
- `governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md` (whole)
- `state/consults/gates/2026-11-23-identity-declaration-route-for-session-tier-form-gate-architect.md` (whole)
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-20-…md` (whole)
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-22-…md` (grep; items 6 and 7)
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-17-…md:34-41`
- `state/directives/2026-11-13-the-grant-…md` (whole)
- `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-44-…md` (grep)
- `state/consults/2026-11-23-identity-declaration-route-for-session-tier-amendment-2-architect-draft.md:442-485`
- `docs/adr/ADR-016-stable-feature-identity-admission.md` (whole)
- `governance/forms/engine/ADMISSION-PREREGISTRATION.md:278-291` (and grep)
- `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md` (grep; 715-739)
- `governance/AUTONOMY.md` (grep §21a-§21c)
- `engine/src/dataset.rs:1985-2104`
- `engine/src/identity.rs:140-354`
- `kernel/src/skp.rs:1750-1764`
- `protocol/skp/src/v0/commands.rs:180-224`
- `frontends/shell/src/App.tsx:840-934, 1160-1244, 2205-2249` (and grep)
- `frontends/shell/src/admission/AdmissionPanel.tsx:1-400`
- `frontends/shell/src/admission/admitDataset.ts` (whole)
- `frontends/shell/src/admission/IdentityDeclarationForm.tsx:1-60`
- `frontends/shell/src/skp/types.ts` (grep)
- `frontends/shell/src/workspace/workspaceState.ts` (grep)
- repo-wide grep for `skp/0.14`, `skp/0.15` and `<AdmissionPanel`

Model: Opus 5.5 (claude-opus-5-5).
