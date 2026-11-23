# A route to declare an identity column for a file opened on the session tier (PLAN node `identity-declaration-route-for-session-tier`): preregistration, full form

*Committed by the custodian on 2026-11-23 from the architect's draft (`state/consults/2026-11-23-identity-declaration-route-for-session-tier-architect-draft.md`; the hand-back 32981 bytes, sha256 643f39963baec344fa77fd9233e0c2c255e22b0ace69ea02933933109363213a): its text from the title to the line before its end mark, byte for byte, with this note put after the title. The note after the end mark stays in the consult. Read the last amendment first.*

**Path proposed:** `governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md`. The product code is the shell's, and the relink form sets the precedent (its OPEN-8).

**Authority:**
- The human's additions of 2026-10-09, item 3 (`state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:21`, sub-line): "The summary already tells the user to declare an identity column, and the app offers no way to do it." and "Its form asks me how the candidate columns reach the shell."
- The human's message of 2026-11-23, item 3 (d), and ADV-2026-11-23-15 item 7 (d) (the advisor's wording under the human's delegation of 2026-11-13). Both are cited by round and item. The candidate-column question goes to the advisor with my recommendation, and the form's gate does not wait for the answer.
- PLAN node `identity-declaration-route-for-session-tier` (`governance/PLAN.yaml:5020-5036`). Its dependency, `shell-migration-milestone-2`, is `done` (:5364-5369).
- The triage's adjacent observation (`state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:64-69`).
- The reuse index (tools/reuse.mjs in the read-only reuse clone at 89bbac37, run by the custodian on 2026-11-23) gave, byte for byte:
  `No prior art recorded for "identity column declaration". Research it before planning an implementation.`
  This form records that miss. Its research is §0's reading of the code.

**Drafted by:** the architect, on the custodian's brief. I read only in the read worktree at main 0bcf543452af79df6251cc7d86ab9f2cf644fcc2, and every `path:line` below is at that commit. I had no Bash, so the custodian adds the span hashes by script. Every pin is historical: for the code, the piece's base on main is authoritative.

**Committed before any code.** Append-only once committed.

**Gating:** full form, both gates (§1).

**Merge:** after the tag, and after the bases in §8.

## §0. Disclosure

Reasoned from code. Nothing was run.

**What the user meets today:**
- A single file with no `id` column opens on the session tier. The engine records the candidate list on the identity (`engine/src/dataset.rs:2005-2010`; `engine/src/identity.rs:201-204`, :232-240).
- `describe` sends `class: "session-ordinal"` and the engine's statement (`kernel/src/skp.rs:2034-2052`), and the summary shows it as the "Session identity" row (`frontends/shell/src/admission/DescribeSummary.tsx:65-70`). The statement ends by telling the user to declare an identity column (`engine/src/identity.rs:150-154`).
- The declaration form renders only in the panel's `refused` state, for the identity family (`frontends/shell/src/admission/AdmissionPanel.tsx:564-578`). That family starts only on `engine.identity_unusable` (:31-36).
- The form's candidates come only from that refusal's comma-joined field (:573; `kernel/src/skp.rs:2223-2236`).
- The candidate list never reaches the wire on a session-tier open. Its accessor is declared an instrument used only by tests (`engine/src/identity.rs:242-259`), and the admission form records it as recorded but not sent (`governance/forms/engine/ADMISSION-PREREGISTRATION.md:282-289`, :875-878).
- R-I3 (that form, :67): "The ADR-016 candidate list is still reported so an operator can declare a mapping."

**What the declaration does once it is sent:**
- The form submits through `admitPath`, which is `runAdmitPath` (`AdmissionPanel.tsx:350-360`, :216-292), into `admitDataset` and then `openDataset` (`frontends/shell/src/admission/admitDataset.ts:48-75`).
- A declaration is always checked across the whole file (`engine/src/identity.rs:175-183`; `kernel/src/skp.rs:1754-1762`).
- A new handle replaces the view's resource. The workspace's `admit` clears the filter and the clauses, ends Colour by and ends the selection (`frontends/shell/src/workspace/workspaceState.ts:127-160`). The old handle is closed (`frontends/shell/src/App.tsx:1645-1650`).
- If the declared open is refused, the summary of the dataset on the map stays (`App.tsx:2234-2237`).

**What survives a save and a reopen:**
- A save records a mapped identity in the reference's `admission` (`kernel/src/dataset_ref.rs:216-233`, :383-388).
- A reopen passes it to `open_dataset` (`kernel/src/project/mod.rs:818-825`), and the reopen checks it across the whole file again.
- K-O1 covers this (`kernel/tests/project_reopen.rs:921`, `a_saved_project_reopens_with_its_data_claims_and_workspace`).
- A session-tier open records no declaration (`mapped_column` gives `None`), so its reopen is on the session tier again.
- The shell's saver keys a confirmed save by dataset handle (`frontends/shell/src/project/saveProject.ts:92-114`). So after a declaration, the next save asks for a folder again.

**A constraint above this piece.** ADR-016's settled envelope reads (`docs/adr/ADR-016-stable-feature-identity-admission.md:165`, sub-line): "The candidate list is part of the refusal, not the record". Its :151 equates "the record" with `describe.identity`. Any answer that puts the list on `describe` amends an accepted ADR, which is the human's (OPEN-2).

**Intake:**

| Item | Disposition |
|---|---|
| No route to the form for a session-tier open | In |
| How the candidates reach the shell | OPEN-1 |
| The form's cost notice: its sentence that nothing is saved and a reopen asks again (`IdentityDeclarationForm.tsx:47-52`; paraphrase) is untrue since projects save a mapped declaration | In (§2 item 4, draft words) |
| KNOWN-LIMITATIONS item 3, the sentence of its "On `main`" paragraph saying no route exists (`KNOWN-LIMITATIONS.md:70`) | In (§2 item 6, draft words) |
| A session-tier dataset that a project reopened | Out (OPEN-3) |
| `engine.identity_ordinal_partitioned_unsupported`, whose message says to declare a column while the panel opens no form for it (`AdmissionPanel.tsx:31-36`; `KNOWN-LIMITATIONS.md:283-286`) | Out: a separate node is proposed in the note |

## §1. May and may not claim

**May claim:** for a file opened with Open GeoParquet that admits on the session tier:
- the panel offers the declaration, with the engine's candidate list unranked and with none preselected, and with free text;
- the declaration opens the file again under the declared column, keeping any CRS assertion that the session open was admitted under;
- a refused declaration leaves the session-tier dataset on the map with the form still there;
- a cancelled declaration returns to the offer;
- a project saved after the declaration records it, and the project's reopen checks it again.

**May not claim:**
- a route for a dataset that a project reopened (OPEN-3);
- that a project saved before the declaration carries over (OPEN-5);
- any `docs/08` figure;
- any platform beyond CI and the Windows e2e run.

**Class: full, with both gates.** By ADV-2026-11-16-06 item 2 (a) (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25`), three of its terms apply: "anything on the wire", "a piece that crosses a seam between modules" and "a piece over 260 changed lines". `governance/AUTONOMY.md` §21a (:323) agrees. Under OPEN-1 (B) or (C) the piece stays full: it changes what the user is told about the state of their data (§2 item 4), and in doubt the piece is full (item 2 (b), :26).

**Declared unchanged:**
- the engine's candidate rule (`identity.rs:299-315`);
- `open_dataset`'s request, the refusal's fields and the error messages;
- ADR-006's class of an open, and that no step is recorded for an open (`App.tsx:1179-1180`);
- `App.tsx`, `workspaceState.ts`, `admitDataset.ts`;
- the persistence formats;
- `protocol/data-plane/`.

## §2. The change (OPEN-1 (A), recommended)

1. **Wire.**
   - `IdentityInfo` (`protocol/skp/src/v0/commands.rs:190-222`) gains `candidate_columns: Option<Vec<String>>`. It is `Some` exactly when `class` is `"session-ordinal"`, and the list may be empty. It is `null` otherwise, and the key is always present.
   - The list is the engine's, unchanged: the same function and order as the refusal's. Its doc says so.
   - The literal moves to the next unused one: `skp/0.15` if no piece has taken it when the code starts. The fixtures move with it, as §8's `skp/0.14` mechanics did (`protocol/skp/SKP-V0.md:1167`), and the future-version fixture moves one past the new literal.
   - SKP-V0.md §1's `describe` block (:85-88) gains the member, and §8 gains an entry giving the version's full field set.
   - The reason for the bump: §4 item 13 (`SKP-V0.md:305-309`; paraphrase: any field change is a new literal, not a tolerant reader).
2. **Kernel and engine.**
   - `describe_dataset` (`kernel/src/skp.rs:1960`, the identity block at :2034-2052) sets the member from `identity.candidate_columns()` under `identity.source().is_session_ordinal()`, the guard `session_statement` uses at :2048-2051.
   - `DatasetIdentity::candidate_columns`'s doc (`engine/src/identity.rs:242-256`) drops the instrument exemption, which this product caller makes untrue, and names `describe_dataset` as its caller. No engine code changes.
3. **Shell types.**
   - `IdentityInfo` (`frontends/shell/src/skp/types.ts:131-146`) gains `candidate_columns?: string[] | null` (OPEN-4).
   - Its doc says that the wire always carries the key, and that T-1 pins it on the real fixture.
   - `SKP_VERSION` (:15) takes the new literal.
4. **Shell panel: `frontends/shell/src/admission/AdmissionPanel.tsx`.**
   - (a) The `admitted` state (:107) gains `path: string` and `options: AdmitOptions`, which `runAdmitPath` sets at :288.
   - (b) A new exported pure function, `identityDeclarationOffer(state: State): { path: string; options: AdmitOptions; candidateColumns: string[] } | null`. It returns non-null exactly when all of these hold:
     - `kind === "admitted"`;
     - `options.reopen === undefined`;
     - `describe.identity.class === "session-ordinal"`;
     - `candidate_columns` is not `null` or `undefined`.

     That is the whole rule.
   - (c) When the offer is non-null, the panel renders `<details className="admission-declare-identity">`. Its `<summary>` is D1 and its first line is D2. Inside it renders `IdentityDeclarationForm` with the offer's `candidateColumns` and `disabled={isOpenInFlight(state)}`, and `onSubmit` runs `admitPath(offer.path, { ...offer.options, identity })`.
   - (d) `"opening"` (:63-73) gains an optional `resume`, which is the `admitted` state the declaration started from. `runAdmitPath`'s first `setState` (:232-236) sets it when `prev` is `admitted` with an offer for the same path. The cancelled arm (:251-263) returns `prev.resume` when it is present, so the offer stays; otherwise it behaves as now.
   - (e) Declared unchanged:
     - a refusal takes the existing refused path (:267-284) with the identity family and the merged options;
     - the liveness line for a declaration (:167-173);
     - Cancel's visibility (:495-508);
     - `confirmOpen` (:221).
5. **The form's words, `IdentityDeclarationForm.tsx:47-52`.** D3 replaces the cost notice. It is shown on both routes.
6. **Strings. Each is a [DRAFT for the advisor], and none is the human's except where marked.**
   - **D1**, the `<summary>`, a constant in `AdmissionPanel.tsx`: "Declare an identity column…"
   - **D2**, the first line in the `<details>`: "Declaring opens this file again with the column you choose and checks that column across the whole file. The filter and the selection are cleared and Colour by ends; the rest of the style is kept. If the column is refused, the file stays open as it is now."
     - "opens again": `AdmissionPanel.tsx:350-360` and `admitDataset.ts:57`.
     - "checks … whole file": `identity.rs:181`, `skp.rs:1757-1761`; `kernel/tests/skp_admission_remediation.rs:207-208` asserts `verified-at-open-full-file`.
     - "filter … selection … Colour by … rest of the style": `workspaceState.ts:151-158`.
     - "stays open": `App.tsx:2234-2237`; the old handle is closed only after an admission, through `selectClosable` (:1645-1650).
   - **D3**, which replaces `IdentityDeclarationForm.tsx:47-52`: "Declaring a column checks it across the whole file for uniqueness when the file is opened. A column that fails is refused only after that scan, so a retry is not free. The declaration lasts while the file is open; a project saved afterwards records it, and opening that project checks the column again."
     - "whole file": as D2.
     - "refused only after the scan": `engine/tests/identity.rs` and the DUPKEY' step (`frontends/shell/e2e/admission-remediation.mjs:485-505`).
     - "a project saved records it": `dataset_ref.rs:216-233`.
     - "checks again": `kernel/src/project/mod.rs:818-825` with K-O1.
     - The custodian checks whose wording the old text is. It is not marked as the human's in the file.
   - **D4**, KNOWN-LIMITATIONS item 3. **The paragraph is the human's** (the 2026-10-09 additions, item 4). Only its sentence quoted in §0's intake changes. Draft: "For a file that opened this way with Open GeoParquet, the app offers to declare an identity column beside the Open buttons. Declaring opens the file again: the filter and the selection are cleared and Colour by ends. A project saved before the declaration is not carried over: the next save asks for a folder. A file that a project reopened on this tier is not offered the declaration."
     - The clauses are checked as D2; "asks for a folder" against `saveProject.ts:104-111`; "not offered" against §2 item 4 (b)'s `reopen` test.
     - The item's comment names `identityDeclarationOffer`, `describe_dataset` and the new member.
   - No other new string. The form's legend, hint and button are unchanged.
7. **Portability.** No OS-dependent feature. K-1, S-1, S-2 and T-1 run on every CI platform. E-1 and the operator Part run on Windows only, as the admission suite does.

**Under the other answers to OPEN-1:**
- **(B)** §2 items 1-3 drop, together with the literal and every protocol, kernel and engine file. A new `frontends/shell/src/admission/sessionCandidates.ts` derives the list from `describe.schema`: `arrow_type` in {`Int64`, `UInt64`}, `projectable`, no comma. K-1 becomes a kernel test that pins the engine's list for the no-id fixture against a shared expected JSON, and T-1 pins the shell's derivation against the same JSON. The scope is about 9 files and 300 lines.
- **(C)** The same scope as (B) with no derivation: the form opens with `candidateColumns = []` and free text alone. R-I3's "reported" goes unmet and joins D4 as a declared limit. The scope is about 7 files and 250 lines.

## §3. Fixtures and predicted outcomes

- `no-id-column.parquet`: `parcel_key` UInt64, no `id` (`kernel/tests/manual_walkthrough_fixtures.rs:477-496`; `engine/src/fixture.rs:756`). It is used as MAP' uses it (`admission-remediation.mjs:53`).
- K-1 writes its own files with `FixtureSpec`, `IdentityMode::ForeignKeyColumn` and a native one. They are generated per run, not hash-verified (disclosed).

| # | Scenario | Base | After |
|---|---|---|---|
| F-1 | session open, describe JSON | `identity` has no `candidate_columns` | `["parcel_key"]` |
| F-2 | F-1's path declared `parcel_key`, describe | mapped; no key | mapped; `null` |
| F-3 | native file, describe | no key | `null` |
| U-1 | panel admitted, session-ordinal, plain open | no offer | offer `{path, options, ["parcel_key"]}` |
| U-2 | U-1, declaration cancelled | idle, "Open cancelled" | U-1's admitted state |
| E-1 | real app, session open, then the control | no control | mapped summary |

## §4. Tests, one mutation each

**P0, before the fix:**
- Commit 1 adds four tests: K-1, S-1, S-2 and T-1. It also adds E-1, and `identityDeclarationOffer` with today's rule, which always returns `null`.
- K-1, S-1, S-2, T-1 and E-1 each fail for the reason in §3, and each failure is recorded by name with the commit id. Vitest at P0 runs without the typecheck (declared).
- Commit 2 lands §2.

**K-1**, in `kernel/tests/skp_admission_remediation.rs`: `a_session_tier_describe_carries_the_engines_candidate_list_and_native_and_mapped_carry_null`. It covers F-1 to F-3 through `SkpHost` and asserts on `serde_json::to_value(&describe.identity)`, which is the real shape and compiles at P0. It also asserts that the key set equals the `identity` key set of `protocol/skp/tests/data/v0-describe-response-session-ordinal.json`, the precedent at `kernel/src/skp.rs:3014-3094`.
- M-K1: `candidate_columns: None` always in `describe_dataset`. K-1 fails at F-1.

**S-1**, in `AdmissionPanel.test.ts`: `identityDeclarationOffer offers the declaration for a directly opened session-tier dataset and nowhere else`. Its cases:
- (i) U-1 gives the offer;
- (ii) native gives null;
- (iii) mapped gives null;
- (iv) U-1 with `options.reopen` set gives null;
- (v) idle, opening and refused give null;
- (vi) U-1 opened under a CRS assertion carries it in `options`.
- M-S1: the class test removed. S-1 fails at (ii).

**S-2**, in the same file, through `runAdmitPath` with stub deps: `a cancelled declaration from a session-tier admission returns to that admission with its offer`. It covers U-2. It also checks that a declaration's refusal gives the identity family with `identity` and `crsAssertion` merged.
- M-S2: the `resume` return removed. S-2 fails: the state is idle.

**T-1**, in `frontends/shell/src/skp/__tests__/fixtures.test.ts`: the session-ordinal fixture's `identity` keys include `candidate_columns`, its value is `["parcel_id"]` (the fixture's Int64 column, :34), and `identityDeclarationOffer` over an admitted state built from that fixture gives that list. This is the shell half of the real-shape seam.
- M-T1: the fixture's value set to `null`. T-1 fails by name.

**E-1**, a new step `DECLARE-SESSION'` in `frontends/shell/e2e/admission-remediation.mjs`, through the real app:
- `assertSessionTier` on `no-id-column.parquet` (:419-440);
- a CDP click on `.admission-declare-identity summary`;
- the candidates are exactly `parcel_key`, with none checked;
- click the radio, then "Declare this column";
- poll with a declared bound of 120 s for the Identity row `mapped:parcel_key — verified-at-open-full-file`, with no "Session identity" row.
- M-E1: the offer's `onSubmit` drops `identity`. E-1 fails at the Identity row.

**The mutation set** is M-K1, M-S1, M-S2, M-T1 and M-E1. Each is applied in the worktree, the named test is run, the failure is recorded by name with its commit, and the mutation is reverted. A `verify-mutation` run is not an observation. E-1's runs are the tester's, inside the machine's holds.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predictions:**
- P0 behaves as §4 says.
- All five tests pass on the fix.
- Each mutation fails its test.

**Declared unchanged (assertions not edited):**
- MAP', BOTHNEEDED', DUPKEY' and CANCELOPEN';
- `skp_admission_remediation.rs`'s existing tests;
- K-O1;
- `engine/tests/session_identity.rs`;
- the existing `AdmissionPanel.test.ts` cases, except the two `admitted` literals at :435 and :488, which gain `path` and `options`.

**Invalidators:**
- I1 (stop): the advisor rules (B) or (C), and the form is re-drafted as §2 says.
- I2 (stop): ADR-016's amendment is not accepted before the code starts (OPEN-2).
- I3 (stop): a declared-unchanged test fails.
- I4 (invalid run): E-1 at P0 fails for any reason other than the missing control.

**Falsification:** after the fix, any of these holds:
- a user who opens a keyless file cannot declare a column from the panel;
- the offer appears for a native, mapped or reopened dataset;
- a cancelled declaration leaves no route.

## §6. Instruments

Assertions only:
- describe JSON members;
- panel states;
- the DOM;
- `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify-mutation`, each named with the tool's commit.

## §7. Declared values and ceilings

- No new constant beyond D1 and E-1's 120 s bound.
- **Size:** at most 650 changed lines, insertions plus deletions, over at most 38 files.
- **Scope, exactly:**
  - protocol: `protocol/skp/src/v0/commands.rs`, `protocol/skp/src/v0/mod.rs`, `protocol/skp/SKP-V0.md`, `protocol/skp/tests/fixtures.rs`;
  - `protocol/skp/tests/data/`: `v0-viewport_query-request.json`, `-with-columns.json`, `-with-filter.json`, `v0-record_step-request-style-set-fill-match.json`, `v0-record_step-request-style-set.json`, `v0-record_step-request-filter-apply.json`, `v0-open_dataset-request.json`, `v0-open_dataset-request-with-crs_assertion-and-identity.json`, `v0-describe-request.json`, `v0-close_dataset-request.json`, `v0-cancel-request.json`, `v0-describe-response.json`, `v0-describe-response-caller-asserted.json`, `v0-describe-response-session-ordinal.json`;
  - `protocol/skp/tests/conformance/`: `fixtures/requests-accept.json`, `fixtures/refusals-at-deserialize.json`, `fixtures/refusals-any-layer.json`, `README.md`;
  - kernel and engine: `kernel/src/skp.rs`, `kernel/tests/skp_admission_remediation.rs`, `engine/src/identity.rs` (doc only);
  - shell: `frontends/shell/src/skp/types.ts`, `src/skp/client.test.ts`, `src/skp/__tests__/fixtures.test.ts`, `src/project/saveProject.test.ts`, `src/admission/admitDataset.test.ts`, `src/admission/RefusalBlock.test.tsx`, `src/admission/AdmissionPanel.tsx`, `src/admission/AdmissionPanel.test.ts`, `src/admission/IdentityDeclarationForm.tsx`, `e2e/admission-remediation.mjs`, `e2e/README.md`;
  - documents: `KNOWN-LIMITATIONS.md` (item 3), `frontends/shell/MANUAL-WALKTHROUGH.md` (a new Part).
- **Estimate:**
  - about 190 lines for the literal (66 conformance occurrences);
  - about 60 for the wire member;
  - about 65 for the shell product code;
  - about 250 for the tests;
  - about 35 for the words.
- **Counting:** `git diff --numstat <merge-base>...<head> -- . ':!<this form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, at a named commit.
- An overrun is class 8, and this line is never edited to match.

## §8. Overlap and merge order

| Path(s) | Shared with |
|---|---|
| `AdmissionPanel.tsx`, `AdmissionPanel.test.ts`, `SKP-V0.md`, `commands.rs`, `e2e/README.md`, `KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md` | the re-link (`cut/relink-after-refusal`) |
| `protocol/skp/**`, `frontends/shell/src/skp/**` (`types.ts`, `client.test.ts`, `fixtures.test.ts`) | the recovery offer (form filed) |
| `admitDataset.test.ts` | PR 360 |
| `e2e/README.md` | PR 359; colour-by; shell-scale |
| `KNOWN-LIMITATIONS.md` (other items) | PR 358; colour-by; shell-scale |
| `MANUAL-WALKTHROUGH.md` | colour-by; shell-scale |
| `protocol/` (one piece at a time) | PR 353 (`protocol/data-plane/`); the re-link; the recovery offer |

- No held piece names `kernel/src/skp.rs`, `engine/src/identity.rs`, `kernel/tests/skp_admission_remediation.rs`, `IdentityDeclarationForm.tsx` or `admission-remediation.mjs`. The recovery offer's "and others" and milestone 5's "e2e suites" were not readable to me, and the custodian confirms them.
- By ADV-2026-11-23-15 item 4, the custodian builds on the re-link's head, which holds most of the shared regions and the protocol place.
- **Merge:** after the tag, PR 353, PR 358, PR 359, PR 360, the re-link, and the recovery offer if it takes `protocol/` first. If it bumps first, this piece takes the literal after its literal.

## §9. Block-on-sight

1. Any diff outside §7's files, this form, PLAN and the records.
2. `App.tsx`, `workspaceState.ts`, `admitDataset.ts`, or any engine code changed (only the doc lines in `identity.rs`).
3. A candidate list computed anywhere but `candidate_identity_columns`, or ranked, preselected or re-sorted.
4. The offer outside §2 item 4 (b)'s rule; a second decision site.
5. A string beyond D1 to D4, or a draft landed before the advisor's words. D4 is the human's paragraph.
6. Any dependency, lockfile or workflow; a tolerant reader; `deny_unknown_fields` dropped.
7. A sleep in S-1, S-2 or T-1; a retry or skip in E-1; a platform ignore.
8. A declared-unchanged assertion edited.
9. A `verify-mutation` run called an observation; a mutation without its commit.
10. A §7 overrun not recorded as class 8, or §7 edited; a scope addition not recorded as class 9 before its code.
11. A line cite into `governance/DECISIONS-PENDING.md`; a hash at a branch commit; a bare self-line.
12. A merge before the tag, or a squash or rebase merge.

## §10. Gates

**Architect** reads:
- OPEN-1, OPEN-2 and OPEN-4;
- ADR-016 (:165) and its amendment;
- docs/01's never-block rule (the declaration is an open, with Cancel and the liveness line);
- ADR-006 (the class of an open is unchanged) and ADR-004 Amendment 4 (the member is product data, not instrument surface);
- the caller rule: `identityDeclarationOffer`'s caller is the render, and `DatasetIdentity::candidate_columns`'s caller becomes `describe_dataset`;
- §9, item by item.

**Reviewer** reads:
- the full diff;
- P0 and the five mutations, observed again;
- the §7 count;
- §2 item 6's clause checks.

**Seams**, each written against its actual interface. The real-shape tests are K-1 and T-1, both resolved against one fixture file, and E-1 through the app.
- `describe_dataset(ds: &Dataset) -> DescribeResponse` (`kernel/src/skp.rs:1960`)
- `DatasetIdentity::candidate_columns(&self) -> &[String]` (`engine/src/identity.rs:257`)
- `IdentityInfo` (`commands.rs:190-222`; `types.ts:131-146`)
- `admitDataset(path, cancelKey, options)` (`admitDataset.ts:48`)
- `runAdmitPath(path, options, deps)` (`AdmissionPanel.tsx:216`)
- `IdentityDeclarationForm({ candidateColumns, disabled, onSubmit })` (`IdentityDeclarationForm.tsx:13-20`, :34)
- the workspace's `admit` (`workspaceState.ts:127`)
- `DatasetRef::linked` (`dataset_ref.rs:216`)

**Suites, green before either gate:**
- the shell's format check, typecheck and tests (`npm ci` in `renderer/bundle-viewer` as well);
- `cargo test --locked -p spatial-kernel --test skp_admission_remediation`, then the kernel and `spatial-skp` suites and the conformance suite on Windows, inside the machine's holds;
- `cargo fmt --check` and clippy;
- the four verify scripts and `verify:plan`;
- CI's `node --test` suite;
- the admission e2e suite with E-1, a tester's series;
- the branch's CI, read before gating.

**Operator:** ordinary use reaches the route, so a new Part (its letter the custodian's) is committed with a blank result log. Its rows, in sketch, are words for the advisor:
- read §11, the last amendment first;
- open `no-id-column.parquet`, see the Session identity row and D1, open it, see the list (`parcel_key`, none chosen), declare `parcel_key`, and see the liveness line, then the summary reading `mapped:parcel_key`;
- declare a column that does not exist, and the refusal shows with the form while the map keeps the file;
- start a declaration and press Cancel, and D1 is back;
- save a project, reopen it, and the Identity row reads `mapped:parcel_key`.

Each row gives the felt verdict and the strings for sight.

## OPEN questions

- **OPEN-1, how the candidates reach the shell.** (To the advisor, ADV-2026-11-23-15 item 7 (d).)
  - **(A)** A member on `describe.identity`, set by the engine's own list. Its costs:
    - a wire change and a literal bump (about 190 mechanical lines, 22 fixture files);
    - an ADR-016 amendment (OPEN-2);
    - the `protocol/` place after the re-link and the recovery offer.

    It keeps one classifying function. Every client gets the same list, an MCP or agent client included, which the headless-kernel design needs. **Recommended.**
  - **(B)** The shell derives the list from `describe.schema`. No wire change and no ADR change. But it is a second copy of the engine's rule, which cannot see the exported-name metadata the engine checks (`engine/src/addressability.rs:101-105`) and leans on `projectable`'s other rules. It can drift silently, and every other client re-derives the list.
  - **(C)** Free text alone. No wire change. R-I3's report goes unmet.
  - **(D)** A new command. The eight commands are closed (`commands.rs:4-6`), so it is the largest wire change. Not recommended.
  - **(E)** Eliciting the refusal with a probe declaration: a whole open, and possibly a whole-file scan, for a list. Rejected.
- **OPEN-2, ADR-016's amendment (the human's; red line).** It is needed under (A), and the code waits for its acceptance. A skeleton follows.
  - *Context:* the settled envelope puts the list in the refusal (:165). Amendment 1's session tier removed that refusal on the keyless path, so R-I3's report has no carrier.
  - *Decision:* on the session tier alone, `describe.identity.candidate_columns` carries the same list, with the same rule and order, unranked and unpreselected. It is `null` on native and mapped opens, where the refusal still carries it. Nothing is inferred.
  - *Consequences:* one wire member and a literal bump. The instrument exemption on `candidate_columns()` ends. An existing test's fixture shape changes only where the literal moves.
- **OPEN-3, a dataset that a project reopened.**
  - (a) Not offered: the shell holds the folder, not the data path, and a plain open would detach the held project. Recommended. D4 says so.
  - (b) A declaration on `open_project`: a further wire change, for a later node.
- **OPEN-4, the TypeScript member's optionality.**
  - (a) Optional, with T-1 pinning its presence on the real fixture. This keeps 14 existing test files (`App.*.test.tsx`, PR 362's `App.command.test.tsx` among them) out of scope, and keeps ADR-016 Amendment 1 item 6's "existing tests" sentence (:234-236, paraphrase) literally true. Recommended.
  - (b) Required, which mirrors the wire exactly and adds about 14 files and about 30 lines.
- **OPEN-5, a project saved before the declaration.**
  - (a) Disclosed (D4). Recommended.
  - (b) Carrying it across, which needs the kernel's save to adopt the new open into that project: a later node.
- **OPEN-6, D3's and D4's words.** They go to the advisor. D4 changes a sentence of the human's paragraph, and the advisor decides whether it goes to the human.

## §11. Amendments (opens empty, append-only; classes 1 to 9)

## Amendment 1 — 2026-11-23 — at the first commit: the authority on main, the node's gate, the span hashes, the OPEN items

*Written by the custodian at the form's first commit, before any code and before any gate. References and hashes only.*

1. **Authority on main.** The human's message of 2026-11-23 is filed at `state/directives/2026-11-23-the-humans-message-never-idle-product-first-what-to-build-now-the-pauses-lifted-for-product-pieces-what-does-not-change.md`, and the advisor's ruling ADV-2026-11-23-15 at `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-the-humans-message-filed-the-relink-built-now-on-three-held-heads-two-forms-now-the-gap-pieces-the-sitting-hour.md`. The draft is filed at `state/consults/2026-11-23-identity-declaration-route-for-session-tier-architect-draft.md`.
2. **The node's gate.** In the same commit the PLAN node `identity-declaration-route-for-session-tier` names this form as its gate. Its class is full, with both gates, by ADV-2026-11-16-06 item 2 (a), as its §1 says. The path is the one the draft proposes.
3. **Span hashes.** Every `path:line` cite above is read at 0bcf543452af79df6251cc7d86ab9f2cf644fcc2. Each entry below names the file and lines a cite is read as, the sha256 of those lines at that commit (each line with its LF, computed by script), and the sections that cite it. A short name is read as the one tracked file it names; a bare `:n` as the file named before it in the same passage; an entry marked (r) was read by the custodian against the file its sentence or list names.

- `state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:21` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b57de54493d353dcc4e4d914085c039debe5a61b6a6ea699e952db729bed722f — the header
- `governance/PLAN.yaml:5020-5036` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:edeab12940df87f0f2f6af6028852b5a3e89786ef3d331720c30fba9f45486ac — the header
- `governance/PLAN.yaml:5364-5369` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ebf3f972115a04575c5ad733e42675be30bda961edd2a77f1d1288ef4b412a8f — the header; as written `:5364-5369`
- `state/consults/2026-10-09-e2e-failures-present-at-the-base-triage-report.md:64-69` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a7a5683fa43d2deb38d3ff5a0d7371b34d4194d0da91972010079b40c7fbcc0a — the header
- `engine/src/dataset.rs:2005-2010` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0258a17e541b265aedcd1a6ff5f9286bc72f1c271a663f861b5ea4d29dee4525 — §0
- `engine/src/identity.rs:201-204` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:39bd872f3f5b2b4a776e2e30a0e11b5ce9c61ddd4388e2a18e2e252bd79d79cc — §0
- `engine/src/identity.rs:232-240` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:22a148af270025b5fd361667adf359d6716b6f94a454f087071ab999c3652ed2 — §0; as written `:232-240`
- `kernel/src/skp.rs:2034-2052` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f12288ab960f4590ec84638333532d0d9982bf54e803fbc3e484bec0f54c9062 — §0, §2; as written `:2034-2052`
- `frontends/shell/src/admission/DescribeSummary.tsx:65-70` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c87049458e02a89cebe1810c305ff86d22b078487acaadf7cb23f5187007187f — §0
- `engine/src/identity.rs:150-154` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:28a68b00bbb25d41a8db11f43758147c37b773871174c1d6f1f200e059d56e8a — §0
- `frontends/shell/src/admission/AdmissionPanel.tsx:564-578` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:37e0f711a2fde18e4150812a1f56194700feff8f354bde1f9b2ed4308cc64098 — §0
- `frontends/shell/src/admission/AdmissionPanel.tsx:31-36` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5420d562e2298f61372088b2d7ad273af0004b7d8304b2f0daf79ad86ef0015f — §0; as written `:31-36`, `AdmissionPanel.tsx:31-36`
- `frontends/shell/src/admission/AdmissionPanel.tsx:573` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:df9ec17da3a0226582483044030d1182cd729efe7b5d366555c138d6142643a1 — §0; as written `:573`
- `kernel/src/skp.rs:2223-2236` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:899864bdae61f2a90c01f8ee765e133652f226c63f89dfde4852e61db930662c — §0
- `engine/src/identity.rs:242-259` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:9683c65835699877a881cc080448f61f9a86f29cb290d026dd73a55c411f9150 — §0
- `governance/forms/engine/ADMISSION-PREREGISTRATION.md:282-289` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3535fd7241a62181929f79d0ce56482fe81f0281a283672871bef194664671f8 — §0
- `governance/forms/engine/ADMISSION-PREREGISTRATION.md:875-878` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:9955757a5a6da9f0e61f11f376273531165de6af73b3fe8eaf39dcd8be061920 — §0; as written `:875-878`
- `governance/forms/engine/ADMISSION-PREREGISTRATION.md:67` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8aed7e37a32e2303e351d42c3ff7996bd05e0c0da5ae554b0cb5e9118fef3ae2 — §0; as written `:67`
- `frontends/shell/src/admission/AdmissionPanel.tsx:350-360` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ddf7d6d7cf21d1d535035f4a40047fd191128bb3adf93489d0c6d1735316167e — §0, §2; as written `AdmissionPanel.tsx:350-360`
- `frontends/shell/src/admission/AdmissionPanel.tsx:216-292` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8dae2de4b24fe44eece874a654331f015ae9f1a37c10dfec625bf08d3f118bd2 — §0; as written `:216-292`
- `frontends/shell/src/admission/admitDataset.ts:48-75` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:dc685c6f6b7aec3eaac516e7f91b6e177ed2533e041fa2d6a2b0be53c10dd03b — §0
- `engine/src/identity.rs:175-183` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:75f835407cd3ddd152b7199ada3f1c87fffccdc59e192c2192c71675571e5195 — §0
- `kernel/src/skp.rs:1754-1762` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c709f2980623f0f0ffd48c85c7d7fd782843622b0de72e2c7b021e8b7c99d778 — §0
- `frontends/shell/src/workspace/workspaceState.ts:127-160` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7e0ef8bf77f702662bbeb9642807b128e96e9076500809b2690b1e94827e491e — §0
- `frontends/shell/src/App.tsx:1645-1650` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5ea0e00e04334a91f5bb45c0e9ab6a224dd9b385f998107cb11689eebd5aa4d9 — §0, §2; as written `:1645-1650`
- `frontends/shell/src/App.tsx:2234-2237` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ac05a25b049c2ec1a1195a93a877785e27333ab3b4c43ba8df5837e0e975db2d — §0, §2; as written `App.tsx:2234-2237`
- `kernel/src/dataset_ref.rs:216-233` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8151d92edcb5e4d86c7c0e37c8aac195028af2ee4ec7629adf23cd744879786f — §0, §2; as written `dataset_ref.rs:216-233`
- `kernel/src/dataset_ref.rs:383-388` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:dc52cd82469654e15a48343c2df45336f96fc425846d6bfa2735042e977b0e50 — §0; as written `:383-388`
- `kernel/src/project/mod.rs:818-825` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ad9ab4c765a5886bf9df2989ff852c6c650f705c4862db808a0a3199f92605f1 — §0, §2
- `kernel/tests/project_reopen.rs:921` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f019c7d56cca793b82b71b0cf0de910ff8c1f2c7a7c47220a8cb244afb8ad4d1 — §0
- `frontends/shell/src/project/saveProject.ts:92-114` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b8ce8712103fda387253667d04982ce2b2b57fda7151c9c6fb40a735c71d73c0 — §0
- `docs/adr/ADR-016-stable-feature-identity-admission.md:165` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b971d2e72ef58a8e630dc8768b5ebd2a130afff6fd42da341ff7560a127bc7a3 — §0, §10, OPEN questions; as written `:165` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:151` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:16e21439281dcb5d5638536282f5bb4ee2a899ba39e4e991a166c4e3b302d813 — §0; as written `:151`
- `frontends/shell/src/admission/IdentityDeclarationForm.tsx:47-52` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4d52e0ad524489434f1ce8d6fbb687878a90282dabbd8fb872ba7dd05bbb752f — §0, §2; as written `IdentityDeclarationForm.tsx:47-52`
- `KNOWN-LIMITATIONS.md:70` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:db65b22f2d1b9feab39c447cfaca4fdceff706f4a04f1dd318959f1827afca2a — §0
- `KNOWN-LIMITATIONS.md:283-286` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:92ac89f616faa7e9247e12577d061df660eb4634a018b835c89d65e601502b1e — §0
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f089d4fe0c367cc2935001f30ce19fb2f040b87fe6b4f4ed8cc34a8992b2f1a9 — §1
- `governance/AUTONOMY.md:323` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:fe42ede257d61916db54c812dc84cfc946cb677a5b93e7f4c57ad905bac57f32 — §1; as written `:323` (r)
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:26` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:59892aa3a058fc966b9d8089bf7ccad1387af0ae7507944bdf98bcb6cdee59a9 — §1; as written `:26`
- `engine/src/identity.rs:299-315` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:00334befa0cd36cbaab55c0af1041c8b0ecaf1ad888451639a42d3bc33f00a76 — §1; as written `identity.rs:299-315`
- `frontends/shell/src/App.tsx:1179-1180` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b30c576bb2ec4f23effba818a86bc8abbb30b0606dc551acc5d26fe660d81fc3 — §1; as written `App.tsx:1179-1180`
- `protocol/skp/src/v0/commands.rs:190-222` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1be65decbd5a7c93d6a65b284236f37b64a6d1146509ac7ffc0da31ee13ab910 — §2, §10; as written `commands.rs:190-222` (r)
- `protocol/skp/SKP-V0.md:1167` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:622b0dcbbeb67771bf24442a82c4f266837e3bca42f6b5bb0c2539b8a0a2a1e9 — §2
- `protocol/skp/SKP-V0.md:85-88` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a63057da480f40e7a3abc08dd20bb22c7f08fbe5d5c751712bbe6c052f554f9f — §2; as written `:85-88`
- `protocol/skp/SKP-V0.md:305-309` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b4170741d0929ea5bc56a1866c24c24d4025bf73c3fc8468c940ecbbf0b6a4a4 — §2; as written `SKP-V0.md:305-309`
- `kernel/src/skp.rs:1960` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:788b35cf1cbc8d3595378cf8bcfd67699ca2418252447d60b9677369f7b19ea7 — §2, §10
- `kernel/src/skp.rs:2048-2051` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f3a58174c8a6a0ab76f2f67475911ace2116b49f6ff7067c04be260f773d1bef — §2; as written `:2048-2051`
- `engine/src/identity.rs:242-256` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4c94f62efaf09cf987903b127c97780350887bcb1ddd40831246aed66add149c — §2
- `frontends/shell/src/skp/types.ts:131-146` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f6f9eba9fb470459e1e637b5c39e2cc95b0c10ae13afaa50d970096dd3052ce3 — §2, §10; as written `types.ts:131-146`
- `frontends/shell/src/skp/types.ts:15` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1a4761d0f73ed545af307709e902d068249b554ec5c66f6522e864ca0f85b6b0 — §2; as written `:15`
- `frontends/shell/src/admission/AdmissionPanel.tsx:107` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:9e3418efe0a25cc36d6f15a5113093261574bcba2fc1df85d596cbc813328a74 — §2; as written `:107` (r)
- `frontends/shell/src/admission/AdmissionPanel.tsx:288` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:51881b88380e3c8d8a42afa9568cba9f103c030b148e864edc1ab617650f9ac0 — §2; as written `:288` (r)
- `frontends/shell/src/admission/AdmissionPanel.tsx:63-73` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7c6a0a8aeae4d19419a517e52ab157f98a1f9346f373918739b4f85ca0fe3aaa — §2; as written `:63-73` (r)
- `frontends/shell/src/admission/AdmissionPanel.tsx:232-236` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7f5c35f4892c8d4fa84064ecf8f771e6df6a2ca6eab71bc9c02de1b274291988 — §2; as written `:232-236` (r)
- `frontends/shell/src/admission/AdmissionPanel.tsx:251-263` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:53c2b09969845256ea46649ac739a230709cd26894164fd486df8e98ae411185 — §2; as written `:251-263` (r)
- `frontends/shell/src/admission/AdmissionPanel.tsx:267-284` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:51052e6d23390c62312f4dd4281c862e93c3e0780e21d854104b52c5b367c993 — §2; as written `:267-284` (r)
- `frontends/shell/src/admission/AdmissionPanel.tsx:167-173` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5ec13222898b76fc357ab5200fcf2640bcbff2c6748950dffe97a3f588c5387f — §2; as written `:167-173` (r)
- `frontends/shell/src/admission/AdmissionPanel.tsx:495-508` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:29e71006092a696270548bd6cf106c94034957912a270689165a2642694cb07d — §2; as written `:495-508` (r)
- `frontends/shell/src/admission/AdmissionPanel.tsx:221` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a85f8b17725d38f840b26ee5762d314485be41fa4d8334430d3a134c5574ca41 — §2; as written `:221` (r)
- `frontends/shell/src/admission/admitDataset.ts:57` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:289480718d0921d11fbd9a989e44e223abb425cb35f32359c14c47add6018279 — §2; as written `admitDataset.ts:57`
- `engine/src/identity.rs:181` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d7d1c5437bce4aa2ab0aa3fd57e7418d65a5fb71c093d111a257a8af3015e013 — §2; as written `identity.rs:181`
- `kernel/src/skp.rs:1757-1761` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0da4bb5447b3de5fc4657aa5b934168ac18c5ee76b4c9c6fc0e3e0a5b454d96b — §2; as written `skp.rs:1757-1761`
- `kernel/tests/skp_admission_remediation.rs:207-208` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:240588df3c635656053039f554c5668b38e9bc47781b4d314d626e34761cc1ca — §2
- `frontends/shell/src/workspace/workspaceState.ts:151-158` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8b680b25a50a74b1f1768de3516e1a99ae43b529d6a0a89746b34407f339189b — §2; as written `workspaceState.ts:151-158`
- `frontends/shell/e2e/admission-remediation.mjs:485-505` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:48b5e48620f8e8b876dc00842957601ab3427ba1550cfb597fe046c2f87a927b — §2
- `frontends/shell/src/project/saveProject.ts:104-111` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:62b84a960cf39ea16b6d300d3e9a4b09571495808ebfaa183b82a32c18a1b03a — §2; as written `saveProject.ts:104-111`
- `kernel/tests/manual_walkthrough_fixtures.rs:477-496` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ee07222a2da4bdacb1020efa996f7a995df40fa2f466d62d47a37e4799f48e02 — §3
- `engine/src/fixture.rs:756` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:56fa79ec955bea761a3800c6e4524f286b2b7c3d30a8c6ce6245e56ca049262d — §3
- `frontends/shell/e2e/admission-remediation.mjs:53` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:bc4a0b9189cad782e4496bfb20633901a0ecfd0d2dfa1433801a1b9268b199e1 — §3; as written `admission-remediation.mjs:53`
- `kernel/src/skp.rs:3014-3094` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:67214f849ef065d716015085efdc9c5a4f2506e9b8eec7ed04464ae063c45400 — §4
- `protocol/skp/tests/data/v0-describe-response-session-ordinal.json:34` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:396b15d14897f9f2854b7d93d5edeb87fb186a887772a8635265e67158afb5ed — §4; as written `:34` (r)
- `frontends/shell/e2e/admission-remediation.mjs:419-440` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d8ad2d14d96c45213ede77abf933c33359b97dfcbfae1a8be70d373a6b46d00c — §4; as written `:419-440` (r)
- `frontends/shell/src/admission/AdmissionPanel.test.ts:435` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8211da06bacb122cab0df2e6107a18afce3d3089d136de50caadb5a8976eefae — §5; as written `:435` (r)
- `frontends/shell/src/admission/AdmissionPanel.test.ts:488` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8cf906ef1c7a950bf1ea83baa6497d93f4778b4594d15c44667e5cccae87e11f — §5; as written `:488` (r)
- `engine/src/identity.rs:257` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:04c7de6b72097e76263dc500d7d5b87aff1f51f1368f7885803eb2c3bb99a2a9 — §10
- `frontends/shell/src/admission/admitDataset.ts:48` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:af1cf33f2a2966c21b9629cf81136d3148366bdc33160271fb33724c442dcfba — §10; as written `admitDataset.ts:48`
- `frontends/shell/src/admission/AdmissionPanel.tsx:216` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ef4a32a877b40d52dc5bc638e19957969685f8a90b1901d3c55c0543f0858162 — §10; as written `AdmissionPanel.tsx:216`
- `frontends/shell/src/admission/IdentityDeclarationForm.tsx:13-20` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:e2a92dcf14f379d4cba240655b07676ef41036c02fb4f722a06feae5f6a78793 — §10; as written `IdentityDeclarationForm.tsx:13-20`
- `frontends/shell/src/admission/IdentityDeclarationForm.tsx:34` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5c15cccb72f78c324039877f6939ab4d3a6a133a0dde8e0cf44fbf9db3765d13 — §10; as written `:34`
- `frontends/shell/src/workspace/workspaceState.ts:127` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ddf1db3ecef746b539ddbf7511b66c23bcd36e54312535ae26f0615d3bf4dbe9 — §10; as written `workspaceState.ts:127`
- `kernel/src/dataset_ref.rs:216` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:55f30e7a01cccbfd8016439985df63b2e3818d6c4a2aed8872aedc7c9fb9a43d — §10; as written `dataset_ref.rs:216`
- `engine/src/addressability.rs:101-105` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1dea24aea8cdf75085f110c6b465e438d65fa7d1bc04eae59a07882cdc3341f9 — OPEN questions
- `protocol/skp/src/v0/commands.rs:4-6` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b7431f4254d3a7e45268cbf7f16b19cf7ffba232bc90669da6a774706e409472 — OPEN questions; as written `commands.rs:4-6` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:234-236` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:9637e4f451a68f97d30671cd1e3ec585a1f58829e948f1cd8f1b722eace723c4 — OPEN questions; as written `:234-236` (r)

4. **OPEN items.** OPEN-1 to OPEN-6, with the drafts D1 to D4 (§2 item 6) and the node the note proposes (its item 4), go to the advisor in one message (ADV-2026-11-23-15 item 8). Their answers come as later amendments; the gates do not wait for them.

Read the last amendment first.

Nothing above is edited.
