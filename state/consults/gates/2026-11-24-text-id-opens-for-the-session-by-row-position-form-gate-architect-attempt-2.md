Reviewed: the form at main cdfebef1eecdda586cd7c9aca41941447b453a99 in the read checkout D:/wt/read-1124c, read only (the custodian's filing note, 2026-11-24: the architect's form gate, attempt 2, node:text-id-opens-for-the-session-by-row-position@form-gate-architect-2, under ADV-2026-11-24-05 item 6, on the unapproved draft ADV-2026-11-23-34 as ADV-2026-11-23-33 item 5 allows; dispatched at 2026-11-24T03:16:46Z; its run: Read 34, Grep 25, Glob 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T03:16:47Z to 2026-11-24T03:27:36Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T03:27:36Z. Filed below the rule from its hand-back, 19631 bytes, sha256 91a044dbfe7919ddf500f8831f3c0a8908c74e536473fdb069b501f1da4f9146, byte for byte, nothing masked, with one final newline added.)

---

Verdict: FAIL
Reviewed: D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99
This gate ran on an unapproved draft. The form rests on the architect's draft of ADR-016 Amendment 3 (`state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md`). The human has not approved ADV-2026-11-23-34, which puts that draft to them. ADV-2026-11-23-33 item 5 lets the gate run on it.

How the findings map onto AUTONOMY §22: one Correctness finding (C5) and one Evidence finding (E4), so the verdict is FAIL. There is also one Documentation finding (D3), which must be fixed before the merge. All the replacement words below are the architect's, not the human's. S-8 is the advisor's wording, not the human's. The form says "Nothing above is edited", so each replacement lands as an item of a new amendment that names the old text.

## Check 1: attempt 1's findings, carried by Amendment 3 item 2

I re-read every cite in those words at cdfebef1, and each one holds:
- `dataset.rs:434`, `:531`, `:565`, `:1687-1699`, and `:1434` for `read_file_names` calling `cancellable`;
- `admission_instruments.rs:13-22`;
- `renderTruth.test.ts:50-57`;
- `console.mjs:372`;
- `AdmissionPanel.tsx:53-56`, `:277-278` and `:575`;
- `types.ts:131-146`, `App.table.test.tsx:26-39` and `tsconfig.json:19`;
- `identity.rs:304`;
- the identity route's form `:640`.

Finding by finding:
- **E1, E2 and E3:** closed where placed. One point on N-S: at the skeleton, N-3's input also scans once. So the red reason "N-3's input is refused" holds only if N-S also asserts that the open succeeds. The worker must write N-S that way.
- **C1, C3, C4, D1 and D2:** closed where placed, and true.
- **C2:** the §2 words close the defect in the submit. But the test those words name, S-T6b, has no row in §4. That is E4 below.

## Findings

### C5 (Correctness): a file that pins the detail is outside the Scope, and the search Amendment 3 prescribes cannot find it

- **Place:** Amendment 3 item 3 (the 84 count) and item 5.
- **What is wrong:**
  - `engine/tests/identity.rs:223-244`, test `a_declared_mapping_to_a_non_integer_column_is_refused_not_hashed`, asserts `detail.contains("synthesized")` at `:242`, on the type refusal at `engine/src/identity.rs:336-344`.
  - The new second sentence (ADV-2026-11-24-05 item 2 (a)) does not contain that word, so the test goes red at the head.
  - The file is not in §7 (whose engine list is five paths) and not in Amendment 2 or 3.
  - The prescribed search for `synthesized identity, which ADR-016 refuses` cannot find a test that pins only part of the sentence. Its four paths are therefore not every place under `engine/`, `kernel/`, `protocol/` and `frontends/` that pins the sentence. A search for parts of the sentence finds no other pin: `widens into u64`, `dictionary index`, `ADR-016 refuses`, `is not a mapping` and `synthesized` each match only the four paths, `ADMISSION-RESULTS.md`, or comments.
  - Adding the file makes 84 paths, so the slot Amendment 3 kept for a wire fixture is used up.

```text
That is 83 paths. The 84th is the place for a wire fixture that holds the detail, if item 5's search at the base finds one outside the Scope.
```
```text
That is 83 paths. The 84th is `engine/tests/identity.rs`, class 9, declared before code: its test `a_declared_mapping_to_a_non_integer_column_is_refused_not_hashed` asserts that the type refusal's detail contains `synthesized`, which the new second sentence does not hold, and that assertion changes to the new sentence's `no stable identity`. A wire fixture that holds the detail, if item 5's search at the base finds one outside the Scope, would be an 85th path: that is a stop, and the file ceiling goes to the advisor before code.
```
```text
All four are in the Scope (§7 and Amendment 2, item 3).
```
```text
All four are in the Scope (§7 and Amendment 2, item 3). A fifth place pins a part of the sentence and is not found by that search: `engine/tests/identity.rs`, whose test asserts that the detail contains `synthesized` (item 3).
```
```text
The worker runs the same search at the base before code, and every place that pins the sentence there changes in this piece, a wire fixture included (that item; item 2 of ADV-2026-11-23-36).
```
```text
The worker runs the same search at the base before code, and also searches `engine/`, `kernel/`, `protocol/` and `frontends/` for the parts `synthesized`, `ADR-016 refuses` and `is not a mapping`, since a test may pin a part of the sentence and not the whole. Every place that pins the sentence, or a part of it that the new words do not hold, changes in this piece, a wire fixture included (that item; item 2 of ADV-2026-11-23-36). `engine/ADMISSION-RESULTS.md` is not edited.
```

### E4 (Evidence): S-T6b is named but has no row, so its red reason is undeclared

- **Place:** §4, the shell table. It is named only inside C2's words for §2 item 12, and in Amendment 3 items 4 and 8.
- **What is wrong:**
  - §4 says each test has a red reason and a mutation, and §5 predicts each one red at the skeleton for its named reason. S-T6b has no file, no test name and no red reason.
  - If the skeleton does not export `refusedDeclarationOptions`, the test's red is a compile error, which §9 blocks on sight.
  - The words below add S-T6b, and S-T8 for S-8 (check 4).

```text
| S-T6 | same: `declaring_from_a_row_position_open_carries_no_set_aside` | sends it | M-23: `declarationOptions` keeps the flag |
```
```text
| S-T6 | same: `declaring_from_a_row_position_open_carries_no_set_aside` | sends it | M-23: `declarationOptions` keeps the flag |
| S-T6b (C2) | same: `a_declaration_after_a_refused_set_aside_carries_no_set_aside`. `refusedDeclarationOptions` over options that carry `setAsideFileId: true` and a `crsAssertion` returns the declared `identity` and the `crsAssertion`, and no `setAsideFileId`. | sends both: at the skeleton `refusedDeclarationOptions` exists and returns `{ ...options, identity }` | M-23b: `refusedDeclarationOptions` keeps the flag |
| S-T8 (S-8) | `src/project/reopenNotices.test.ts`, with `../skp/client` and `../diagnostics/log` mocked the way `openProject.test.ts` mocks them: `a_reopen_refused_after_the_choice_names_the_choice`. With `options.setAsideFileId: true`, `admitProject` refused `engine.identity_set_aside_refused`, and refused `engine.query`, each has S-8's constant as its owner; the same refusals without the choice have `ENGINE_REFUSAL_NOTICE`; with the choice, `engine.cancelled` has no owner and an `skp.*` code keeps its own place. It compares constants, never words. | the owner is `ENGINE_REFUSAL_NOTICE` with the choice: at the skeleton S-8's constant is exported and `admitProject` takes the owner from `reopenRefusalPlace` alone | M-26: `admitProject` takes the owner from `reopenRefusalPlace` alone, whatever `options.setAsideFileId` is |
```

### D3 (Documentation): line numbers in Amendment 3 without span hashes

- **Place:** Amendment 3 items 5 and 6.
- **What is wrong:** `(line 341)`, `(line 598 …)`, `(line 82)`, `(line 115)` and `line 100 at 4630fa09` carry lines with no sha256 (round 14). Each holds at cdfebef1 by my reading. The words below replace each line number with the name it points to.

```text
is held by `engine/src/identity.rs` (line 341), `frontends/shell/MANUAL-WALKTHROUGH.md` (line 598, row I4 of Part I), `frontends/shell/e2e/admission-remediation.mjs` (line 82) and `frontends/shell/e2e/regression.mjs` (line 115)
```
```text
is held by `engine/src/identity.rs` (`admit_column_type`'s detail), `frontends/shell/MANUAL-WALKTHROUGH.md` (row I4 of Part I), `frontends/shell/e2e/admission-remediation.mjs` (`STRING_ID_MESSAGE`) and `frontends/shell/e2e/regression.mjs` (`STRING_ID_MESSAGE`)
```
```text
(`frontends/shell/src/project/reopenNotices.ts`, line 100 at 4630fa09)
```
```text
(`frontends/shell/src/project/reopenNotices.ts`, R-ENG)
```

## Check 2: ADV-2026-11-24-05 item 1, the ceilings

- **Files.** I count §7 at 76 paths, the two conditional files included. The count to 83 is correct. With C5 it is 84, at the ceiling. A wire fixture found at the base becomes a stop, by C5's words.
- **Lines.**
  - The table adds up: 16 + 5 + 25 + 60 + 28 + 9 + 34 + 8 = 185, and ~1,875 + 185 = ~2,060.
  - That passes 1,950, so the restated ceiling of 2,100 applies. §7's line is not edited (round 25 item 2 holds).
  - C5 adds about 2 lines. S-T6b's code is inside the ~28 already, and S-8's doc corrections fit inside the ~34.
  - The estimate stays at about 2,062, so nothing goes to the advisor. The margin of about 40 lines is thin; an overrun is class 8.

## Check 3: item 2 (a), the type refusal's detail

- **The new sentence is true.** A hash, a dictionary index or a row ordinal is refused as a mapping by ADR-016 §4, and Amendment 1 item 1 says the session tier claims no stability. Shown beside S-1, the sentence no longer contradicts the offer.
- **The search.** Its four paths hold the sentence at cdfebef1, at `identity.rs:340-341`, `MANUAL-WALKTHROUGH.md:598` (row I4 of Part I), `admission-remediation.mjs:82` and `regression.mjs:115`. Nothing under `protocol/` holds it: `v0-error-identity_unusable-with-candidates.json:6` carries the detail of the no-such-column refusal. The search is not complete (C5).
- **`ADMISSION-RESULTS.md`:** at `:23` and `:43`, outside the Scope, and not edited.

## Check 4: item 2 (b), S-8 (the advisor's words, not the human's)

**Where the shell tells the two attempts apart.** Only `admitProject` (`frontends/shell/src/project/openProject.ts:62-78`) holds both the refusal and the attempt's options:
- the reopen's `admit` is `admitProject(path, cancelKey, options, heldProject())` (`AdmissionPanel.tsx:366`);
- `reopenRefusalPlace` (`:84-94`) sees only the refusal;
- `reopenNotices.ts` does no routing, by its own header at `:13-14`.

Keeping `reopenRefusalPlace`'s signature avoids two things: a defaulted parameter used only by its test at `openProject.test.ts:88-89`, and a 85th path.

```text
13. `src/admission/describeSummaryText.ts` (`:37-39`, `:56-58`) and `DescribeSummary.tsx` (`:65-70`): S-3 is shown beside the session statement when `set_aside_column` is not null.
```
```text
13. `src/admission/describeSummaryText.ts` (`:37-39`, `:56-58`) and `DescribeSummary.tsx` (`:65-70`): S-3 is shown beside the session statement when `set_aside_column` is not null.
14. `src/project/openProject.ts` and `src/project/reopenNotices.ts` (S-8, ADV-2026-11-24-05 item 2 (b)). The shell tells the two reopen attempts apart in `admitProject`, the one place that holds both the refusal and the attempt's options: when `reopenRefusalPlace(refusal, heldProject)` returns `ENGINE_REFUSAL_NOTICE` and `options.setAsideFileId` is true, the owner is S-8 instead. `reopenRefusalPlace` keeps its signature, so its other callers and its test do not change. S-8 is a new exported constant beside `ENGINE_REFUSAL_NOTICE`, and its one product caller is `admitProject`; `ENGINE_REFUSAL_NOTICE` stays for a reopen attempt that carries no choice. Three doc comments this makes untrue are corrected in the piece: `ENGINE_REFUSAL_NOTICE`'s, which places it beside every engine refusal at a reopen; `openProject.ts`'s header, which says the owner place is chosen from the code alone; and `reopenNotices.test.ts`'s header, which says each test there checks a builder's slots. S-T8 tests it (M-26).
```

**S-8 checked against the code.**
- "The project was not opened in this window" holds: the reply is refused.
- "the ones the project file recorded … and the choice you made here" is how an operator can read the attempt:
  - the reopen sends the project's recorded claims (`project/mod.rs:819-825` at a2d58940);
  - `setAsideFileId` is set only by the user's click (§2 item 12);
  - S-6a and S-6c name the set-aside themselves.
- It is reached only when the file changes between the refused reopen and the choice, or on an I/O error. That is ordinary use, the same reach C2 counted.

**Scope.** `reopenNotices.ts`, its test and `openProject.ts` are in the Scope. `openProject.test.ts` needs no edit.

## Check 5: item 4

- `refusedDeclarationOptions`, with S-T6b and M-23b, is inside the form through C2's words, but its row is missing (E4). It is counted in the ~28 line row. It adds no file: `AdmissionPanel.tsx` and its test are in the Scope.
- C3's optional `set_aside_column` is inside the form through C3's words. It adds no file and no lines beyond §7's shell estimate; making the member optional is what keeps 13 `App.*` files out of the Scope.

## Check 7: the human's item 2, and §9

- **Offered only when the file's own `id` cannot serve.** The offer needs `engine.identity_unusable`, column `id`, no declaration and no choice already carried. With no declaration, the refusals of `id` are the type, a negative value and repeated values (`dataset.rs:2028`, `:2076-2098`); the not-addressable refusal is unreachable for `id` (`:2013-2018`). Met.
- **Chosen by the user, never taken silently.** The member is required with no default (W-1/M-17, T-1/M-24). The submit is closed by C2, and the identity route's offer by S-T6. Met.
- **The summary says so.** S-3 (S-T3). Met.
- **Nothing saved or published.** K-4 to K-7, and E-1 (d). Met. For the record: the persisted diagnostic log (`diagnostics/log.ts:8-12`) keeps a refusal's code and message (`admitDataset.ts:70`, `openProject.ts:75`), so an S-6 text can reach it. That log is not a project file, a session history or a bundle, which is the form's claim (§1, §9).
- **§9.** Each item is consistent with the four requirements. Today, "Any path outside §7" would block the build on `engine/tests/identity.rs` (C5). §9 has no item for an offer outside the condition, or for a missing S-3; S-T1 and S-T3 carry those. That is a note, not a finding.

## Check 8: span hashes

Amendment 3 carries no sha256 entries. I read the lines it names (items 5 and 6) at cdfebef1, which holds the same code as 4630fa09 by the brief, and each matches. I recomputed no hash, because I have no Bash.

## Check 6: words for the advisor (ADV-2026-11-23-34 item 6)

These are the architect's draft words, not the human's. The quoted lines are from the draft, part 2, `:53-64`.

**1. Decision 1, its last sentence (`:53`).**
```text
A client offers the choice only beside a refusal of the file's own `id` column in an attempt that declared no column, and shows that it carries the choice whenever it carries it into a further attempt.
```
```text
A client offers the choice only beside a refusal of the file's own `id` column in an attempt that declared no column. Beside a form that carries the choice into a further attempt it shows that the choice is carried, and an open reached with the choice says so in its summary (item 4).
```
- **Why:** at a reopen, a `question` or `not_found` reply to the attempt that carried the choice comes back with the same options (`AdmissionPanel.tsx:242`, `:539`), and its buttons show no carried line. Reaching it needs the data file moved, or the machine record changed, between two clicks. That is ordinary use, so "whenever" is untrue.
- **The clauses checked:**
  - the CRS form carries the choice and S-5 shows it (`AdmissionPanel.tsx:548-561`);
  - the identity form does not carry it (C2, S-T6);
  - S-3 shows on every open reached with the choice.

**2. Decision 3 (`:55`), C4 and item 4's member.**
```text
The open is Amendment 1's session tier with nothing else changed: the same identity pair and generation rules, `by-construction-within-generation`, the same `describe.identity` values and statement, Amendment 2's candidate list, and Amendment 1 item 3's change handling. The file's `id` column is never read into identity, mapped, hashed or compared; non-integer keys stay undecided.
```
```text
The open is Amendment 1's session tier with nothing else changed but item 4's member: the same identity pair and generation rules, `by-construction-within-generation`, the same `describe.identity` values and statement, Amendment 2's candidate list less the column set aside, and Amendment 1 item 3's change handling. Beyond item 2's checks, the file's `id` column is never read into identity, mapped, hashed or compared; non-integer keys stay undecided.
```
- (d) returns a session-ordinal identity whose list leaves out `id` (C4).
- Under the broad reading, the scan of item 2 does read the column.

**3. Decision 4, its second sentence (`:56`).**
```text
A client that shows the identity shows this member beside the session statement, so that the summary says the user chose row position.
```
```text
A client that shows the identity says beside the session statement that this member is set, so that the summary says the user chose row position.
```
- S-3 is a sentence shown when the member is not null; it is not the member's value (§2 item 13).

**4. Consequences, the candidate list (`:64`, C4).**
```text
The candidate list on such an open is the list the refusal carried, from the same function.
```
```text
The candidate list on such an open is the list the refusal carried, from the same function, less the column set aside; a file with no `id` column never lists it.
```
- The refusal's list comes from `candidate_identity_columns` (`identity.rs:343`; `dataset.rs:2084`, `:2096`), and that function lists an integer `id` (`identity.rs:304`).

**5. Consequences, the engine (`:62`). Optional, for completeness.**
```text
In the engine, one admission arm, and the filter's identity-alias rule extended to this tier.
```
```text
In the engine, one admission arm, the filter's identity-alias rule extended to this tier, and two refusal texts changed so that neither contradicts the choice: the identity refusal's last sentence removed and the type refusal's detail reworded.
```
- The sources are ADV-2026-11-23-36 item 2 and ADV-2026-11-24-05 item 2 (a).

**Clauses that hold at cdfebef1:** the Context; Decisions 2, 5 and 6; Consequences 1 and 3; and "Not decided here". Amendment 2 and the Note 2026-11-23 are not on main, so the references to them were not read.

## Files read (at cdfebef1, in `D:/wt/read-1124c`)

- **The form and the rulings:**
  - the form, whole;
  - ADV-2026-11-24-05;
  - attempt 1's report;
  - the human's message of 2026-11-23;
  - ADV-2026-11-23-33, -35 and -36;
  - the draft ADV-2026-11-23-34;
  - the ADR-016 Amendment 3 draft;
  - `docs/adr/ADR-016-stable-feature-identity-admission.md` (§§ Decision to Note 2026-11-09);
  - the identity route's form, by search.
- **engine:**
  - `src/identity.rs` (`:290-359`);
  - `src/dataset.rs` (`:1433-1452`, `:1685-1700`, `:1961-2110`, and by search);
  - `tests/identity.rs` (`:205-244`);
  - `tests/admission_instruments.rs` (`:1-30`);
  - `tests/b1_nul_*`, by name.
- **protocol:** `tests/data/v0-error-identity_unusable-with-candidates.json`, and `tests/data/v0-open_*`, by name.
- **shell:**
  - `src/project/{reopenNotices.ts,reopenNotices.test.ts,openProject.ts,openProject.test.ts:1-140}`;
  - `src/admission/AdmissionPanel.tsx` (`:20-59`, `:205-299`, `:530-585`);
  - `src/console/renderTruth.test.ts` (`:40-128`);
  - `src/skp/types.ts` (`:125-149`);
  - `src/App.table.test.tsx` (`:20-44`);
  - `src/diagnostics/log.ts`;
  - `tsconfig.json`;
  - `e2e/console.mjs` (`:362-377`);
  - `e2e/admission-remediation.mjs` (`:76-105`);
  - `MANUAL-WALKTHROUGH.md`, by search;
  - `src-tauri/src`, by search.
- **Searches outside `state/` and `governance/`** for the sentence and its parts, `OpenDatasetRequest {`, `IdentityInfo {`, `session_statement`, `crs_assertion` and the open_dataset key sets.

Model: claude-opus-5-5
