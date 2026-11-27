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

## Amendment 2 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 1 (FAIL), and ADV-2026-11-23-20: C1, C2, E1, E2, the documentation findings, the rulings and ADR-016's Amendment 2 draft

*Post-result amendment. It was written after both of these had been seen: the outcome of the architect's form gate, attempt 1 (`state/consults/gates/2026-11-23-identity-declaration-route-for-session-tier-form-gate-architect.md`, FAIL), and the advisor's rulings ADV-2026-11-23-20 and ADV-2026-11-23-22. It is written before any code. Both rulings are the advisor's under the human's delegation of 2026-11-13, not the human's words, and are cited by id and item. Finding ids (C1, C2, E1, E2, N1 to N9) are the gate report's. Every `path:line` here is read at 6cf6140cd8dfcc6fc52b82011e5dae5799edf300. Each Old text below occurs once in the form above this amendment. Where an Old text is part of a line, only that part is replaced. No OPEN item or string is ruled here: D1 to D4 and ADR-016's Amendment 2 are drafts for the advisor.*

1. **The rulings, item by item.**
   - **ADV-2026-11-23-20 item 1, OPEN-1 (A).** The candidate list is a member of `describe.identity`, set from the engine's own list, on the session tier alone. §2 items 1 to 3 already build (A), and the form's tests and Scope are (A)'s. The (B) and (C) texts stay only as the record of the options:
````text
## §2. The change (OPEN-1 (A), recommended)
````
````text
## §2. The change (OPEN-1 (A), ruled by ADV-2026-11-23-20 item 1)
````
````text
**Under the other answers to OPEN-1:**
````
````text
**Under the other answers to OPEN-1 (not in force: ADV-2026-11-23-20 item 1 rules (A); kept as the record of the options):**
````
````text
- I1 (stop): the advisor rules (B) or (C), and the form is re-drafted as §2 says.
````
````text
- I1: resolved by ADV-2026-11-23-20 item 1, which rules (A). It is no longer a stop.
````
   - **Items 3 to 5.** OPEN-3 (a): a dataset that a project reopened is not offered the declaration, and D4 says so. The node for (b) is proposed by the custodian when this piece closes. OPEN-4 (a): the TypeScript member is optional, and T-1 pins its presence on the real fixture (§2 item 3, as written). OPEN-5 (a): disclosed, in D4. The form already assumes each of these, so no text changes.
   - **Item 6, the words.** D1 to D4 stay drafts. D1, D2 and D3 are built under the placeholder mark, as in ADV-2026-11-23-16 item 10. The advisor words them from the filed text after the form's gate has passed and before the build's words commit. D4 is KNOWN-LIMITATIONS text, not shown in the app. ADV-2026-11-23-22 item 7 says the present cost notice was written by an agent and approved by nobody, so D3 replaces nothing of the human's.
````text
The custodian checks whose wording the old text is. It is not marked as the human's in the file.
````
````text
The old text was written by an agent and approved by nobody (ADV-2026-11-23-22 item 7), so D3 replaces nothing of the human's.
````
````text
The item's comment names `identityDeclarationOffer`, `describe_dataset` and the new member.
````
````text
The item's comment names `identityDeclarationOffer`, `describe_dataset` and the new member. It says that the one changed sentence is the advisor's wording under the grant of 2026-11-13, item 2, names the advisor's ruling that words it, and says the rest of the paragraph is the human's (ADV-2026-11-23-20 item 6).
````
````text
A string beyond D1 to D4, or a draft landed before the advisor's words.
````
````text
A string beyond D1 to D4; D1, D2 or D3 landed without the placeholder mark; or the words commit made before the advisor's words (ADV-2026-11-23-20 item 6).
````
````text
D4 is the human's paragraph.
````
````text
D4's paragraph is the human's; its one changed sentence is the advisor's, and the item's comment says so.
````
   - **Item 7, the `protocol/` place.** "The next unused literal" is the value of `SKP_VERSION`. At 6cf6140c it is `skp/0.14` (`protocol/skp/src/v0/mod.rs:136`; `frontends/shell/src/skp/types.ts:15`). The re-link takes no literal (ADV-2026-11-22-44, its OPEN-2 (a)), so the place passes to this piece and the recovery offer at `skp/0.14`.
     - **Order A** (this piece holds the place first). It takes `skp/0.15`, the future-version fixture and row move to `skp/0.16`, and the literal's files are those that `git grep -l 'skp/0\.14'` lists at the recorded base. The recovery offer then takes the next unused literal itself (its Amendment 2, N-6).
     - **Order B** (the recovery offer holds the place first). This piece is built on its head and takes `skp/0.16`, and the future-version fixture and row move to `skp/0.17`. Its literal files are those that `git grep -l 'skp/0\.15'` lists at the recorded base, which includes the recovery offer's own new files that carry the literal. Any of those not in §7's Scope is a class-9 addition, recorded before its code. Order B adds the recovery offer's paths to §8 (item 6 below).
````text
The literal moves to the next unused one: `skp/0.15` if no piece has taken it when the code starts.
````
````text
The literal moves to the next unused `SKP_VERSION` (Amendment 2 item 1, ADV-2026-11-23-20 item 7): `skp/0.15` if this piece holds the `protocol/` place before the recovery offer, `skp/0.16` if after it. The worker re-checks it against main and every base head before the bump's commit.
````
   - **Item 8, the partitioned-refusal node** (`partitioned-ordinal-refusal-opens-the-identity-form`; not yet in PLAN). As item 8 places it, the node is shell-only and built on the re-link's head ahead of this piece. This piece is then built on the node's head where they share `frontends/shell/src/admission/AdmissionPanel.tsx`, and merges after it (ADV-2026-11-23-17 item 11: built on its head once its code is committed, without waiting for its gates; a piece never merges before a piece it is built on). The base and the merge are in item 6. The binding is conditional: it holds while the node's code changes a file this piece changes. The node's own facts are in question: see the report's note on that node.

2. **ADR-016's Amendment 2: the draft (ADV-2026-11-23-20 item 2).**
   - **Where it goes.** It is appended at the end of `docs/adr/ADR-016-stable-feature-identity-admission.md`, after its Note 2026-11-09 (:242-246), which follows Amendment 1. No line of the ADR is edited. It lands in this piece's PR.
   - **Status.** It is Proposed until the advisor rules its words, and that ruling is its acceptance. In the PR it lands with its heading reading Accepted and the ruling's date, plus an acceptance line naming the ruling by id and item, in the form of Amendment 1's acceptance line (:238).
   - **No code before the ruling.** No code of this piece is written before the advisor has ruled its words (ADV-2026-11-23-20 item 2).
   - **What it binds.**
     - On the session tier only, it narrows the settled envelope's fourth bullet (:165-169, "the candidate list is part of the refusal, not the record", paraphrased). On that tier the same list is also part of the record, `describe.identity` (:150-151).
   - **What it leaves to the existing text.**
     - The refusal still carries the list on native and mapped opens (:165).
     - Which columns are candidates: 64-bit integer columns in schema order, unranked, unpreselected (:165-166).
     - §3, declared never inferred (:64-69).
     - §5, whole-file verification of a declared mapping (:81-92).
     - Host attribution, with no skip field (:161-164).
     - Amendment 1's tiers (:186-208), item 5's single-file rule (:230-232) and item 6 (:234-236).
     - The OPEN blocks (:171-178).
   - **The draft:**
````text
## Amendment 2 — the session tier's candidate list, carried on `describe.identity` (2026-11-23, appended — Proposed)

*Proposed. Its words are ruled by the advisor under the human's delegation of 2026-11-13; that ruling is its acceptance, and an acceptance line naming it is then added below. Nothing above this heading is changed.*

**Context.** The settled envelope places the candidate list in the refusal and not in the record, the record being `describe.identity` (the SETTLED block, its fourth bullet). Amendment 1 item 1 then admitted a single file with no admissible identity column on the session tier, so on that path the refusal that carried the list no longer fires. The engine still records the list on the session tier, for the reason the admission preregistration gives (`governance/forms/engine/ADMISSION-PREREGISTRATION.md`, R-I3), but no client receives it, so an operator offered a declaration has no list to choose from.

**Decision.**
1. On the session tier alone, `describe.identity` carries `candidate_columns`: the same list the refusal carries elsewhere, from the same engine function, in schema order, unranked, unpreselected and with no confidence. It may be empty.
2. On a native or a mapped identity the member is present and null. There the refusal carries the list, as the settled envelope says.
3. The list names what a caller may declare; it is never a declaration and never a recommendation. Nothing is inferred from it (§3), and no client ranks it or preselects an entry.
4. Which columns are candidates is not changed by this amendment, including the columns the engine already leaves out of the list.
5. A column declared from the list is a declared mapping under §3 to §7 and Amendment 1 item 6, verified over the whole file at open.

**Consequences.**
- One member on `describe`, a control-plane reply, and a new SKP literal.
- The engine's accessor for the list gains `describe` as its product caller and is no longer an instrument.
- A column the engine leaves out of the list for the refusal's sake (a name that holds a comma) stays out of it here, so both carriers carry the same list; such a column remains declarable by name.
- Nothing is added to what a project saves.

**Not decided here.** Composite and non-integer keys; the data doctor's proposal; a declaration route for a dataset that a project reopened.
````
   - **Scope, class 9, declared before any code.** `docs/adr/ADR-016-stable-feature-identity-admission.md` joins the Scope at about 30 lines. It is counted by §7's counting command, which does not exclude it. §7's ceilings are in item 7.

3. **C1 (Correctness): D3, a draft for the advisor.** This adopts the gate's words as the form's draft. ADV-2026-11-23-22 item 7 sends them to the advisor with this amendment as filed.
````text
Declaring a column checks it across the whole file
````
````text
Declaring an integer column checks it across the whole file
````
````text
A column that fails is refused only after that scan, so a retry is not free.
````
````text
A column whose values repeat, or that holds a negative value, is refused only after that scan, so a retry is not free.
````
   **Clause checks, added after D3's last clause-check bullet in §2 item 6:**
   - "integer column … checks it across the whole file":
     - `engine/src/identity.rs:333` admits the eight integer widths.
     - The one scan over the file is `engine/src/dataset.rs:2045-2069`.
     - `kernel/src/skp.rs:1754-1762` makes `skip_uniqueness_check` always false.
   - "whose values repeat, or that holds a negative value, is refused only after that scan": the negative check (`dataset.rs:2076-2086`) and the repeat check (:2088-2097) both follow the scan.
   - **Refused before any scan, and outside D3's clause, which speaks only of an integer column's values:**
     - a missing column (:1998-2003);
     - a name nothing can address (:2019-2025);
     - a non-integer type (:2028; `identity.rs:336-344`).
   - **For the source comment, not ordinary use:** an integer column whose name holds U+0000 is refused before the scan (:2019-2025).
   - **A Cancel during the scan** ends as `EngineError::Cancelled` (:2071-2073), not as a refusal.
   - **Also refused only after the scan:** a column that is empty in some row. `count(DISTINCT …)` leaves nulls out of the distinct count (:2046), so the repeat check refuses that column (:2088). D3 as worded does not claim to list every case refused after the scan, so it stays true. A wording that names this case goes to the advisor (note).

4. **C2 (Correctness): fix (i), as ruled by ADV-2026-11-23-22 item 6.** The offer is bound to the dataset on the map. The reason in the code:
   - App already holds that handle (`frontends/shell/src/App.tsx:853`).
   - App binds the summary to it (:2234-2237) and the notices to it by the same comparison of handles (:921-923).
   - The panel's `admitted` state carries `admitted.dataset` (`frontends/shell/src/admission/admitDataset.ts:12-19`).
   - So binding the two is one comparison, and it holds whichever order the recovery offer lands in.

   **The binding:**
````text
`identityDeclarationOffer(state: State): { path: string; options: AdmitOptions; candidateColumns: string[] } | null`
````
````text
`identityDeclarationOffer(state: State, datasetOnMap: string | null): { path: string; options: AdmitOptions; candidateColumns: string[] } | null`
````
````text
- `candidate_columns` is not `null` or `undefined`.
````
````text
- `candidate_columns` is not `null` or `undefined`;
     - `admitted.dataset === datasetOnMap` (item 4 (f)).
````
   **Added after §2 item 4 (e)'s list:**
   - (f) `Props` gains `datasetOnMap: string | null`, whose doc names App's dataset on the map as its source and the offer as its only reader.
     - App passes `datasetOnMap={admitted === null ? null : admitted.dataset}` at the `<AdmissionPanel>` element (`App.tsx:2221`), with `admitted` from :853.
     - This is the only change to `App.tsx`. Its product caller is the render, and E-1 proves it through the app: without the prop no offer renders.
````text
- `App.tsx`, `workspaceState.ts`, `admitDataset.ts`;
````
````text
- `workspaceState.ts`, `admitDataset.ts`; `App.tsx` except one prop on `<AdmissionPanel>` (§2 item 4 (f));
````
````text
2. `App.tsx`, `workspaceState.ts`, `admitDataset.ts`, or any engine code changed (only the doc lines in `identity.rs`).
````
````text
2. `workspaceState.ts`, `admitDataset.ts`, or any engine code changed (only the doc lines in `identity.rs`); `App.tsx` changed beyond the one prop of §2 item 4 (f).
````
   **Added to §1's May claim:** the offer is shown only while the dataset the panel admitted is the dataset on the map.

   **Added to §1's May not claim:** a declaration route for a dataset that Recover opened, if the recovery offer is in the base.

   **Added to §5's Invalidators:** I5 (stop): at the recorded base, `<AdmissionPanel>`'s element cannot be given App's dataset on the map as §2 item 4 (f) writes it (`App.tsx:853` and :2221 at 6cf6140c). The form is amended before any code.

   **Added to §5's Falsification:** the offer appears while another dataset is on the map.

   **Scope, class 9, declared before any code.** `frontends/shell/src/App.tsx` joins the Scope at about 2 lines.

   **D2 and D4.** Under (i), D2's "this file" is the dataset on the map, and D2 is unchanged. D4 is unchanged in the form. A variant for the case where the recovery offer is in the base goes to the advisor (drafts list).

5. **E1 and E2 (Evidence), with the tests they change or add.** The S-tests are all in `frontends/shell/src/admission/AdmissionPanel.test.ts`.
````text
- (ii) native gives null;
````
````text
- (ii) native gives null, its `candidate_columns` set to `["parcel_key"]`, a shape the wire never sends, so that only the class test refuses it;
````
````text
- (iii) mapped gives null;
````
````text
- (iii) mapped gives null, built the same way;
````
````text
`disabled={isOpenInFlight(state)}`, and `onSubmit` runs `admitPath(offer.path, { ...offer.options, identity })`.
````
````text
`disabled={false}` (the offer renders only in the `admitted` state, where `isOpenInFlight` is false; a declaration in flight is the `opening` state, which renders no offer), and `onSubmit` runs `admitPath(offer.path, declarationOptions(offer, identity))`, where `declarationOptions` is an exported pure function returning `{ ...offer.options, identity }`.
````
````text
It covers U-2. It also checks that a declaration's refusal gives the identity family with `identity` and `crsAssertion` merged.
````
````text
It covers U-2. The refusal's merged options are S-4's (Amendment 2 item 5).
````
````text
and `identityDeclarationOffer` over an admitted state built from that fixture gives that list.
````
````text
and `identityDeclarationOffer` over an admitted state built from that fixture, with that state's own handle as the dataset on the map, gives that list.
````
````text
- Commit 1 adds four tests: K-1, S-1, S-2 and T-1. It also adds E-1, and `identityDeclarationOffer` with today's rule, which always returns `null`.
````
````text
- Commit 1 adds six tests: K-1, S-1, S-2, S-3, S-4 and T-1. It also adds E-1; `identityDeclarationOffer(state, datasetOnMap)` with today's rule, which always returns `null`; and `declarationOptions(offer, identity)` returning `{ identity }` alone.
````
````text
K-1, S-1, S-2, T-1 and E-1 each fail for the reason in §3
````
````text
K-1, S-1, S-2, S-3, S-4, T-1 and E-1 each fail at P0 for the reason §3, §4 or Amendment 2 item 5 gives
````
````text
**The mutation set** is M-K1, M-S1, M-S2, M-T1 and M-E1.
````
````text
**The mutation set** is M-K1, M-S1, M-S2, M-S3, M-S4, M-T1 and M-E1.
````
````text
- All five tests pass on the fix.
````
````text
- All seven tests pass on the fix.
````
````text
- P0 and the five mutations, observed again;
````
````text
- P0 and the seven mutations, observed again;
````
   **Each test that is new or changed:**
   - **S-1** (changed): `identityDeclarationOffer offers the declaration for a directly opened session-tier dataset and nowhere else`.
     - Red before the fix: today's rule returns `null`, so (i) fails.
     - Mutation M-S1: the class test removed. S-1 fails at (ii). Set: {S-1}.
     - Each case passes the admitted state's own handle as the dataset on the map.
   - **S-2** (changed): `a cancelled declaration from a session-tier admission returns to that admission with its offer`.
     - Red before the fix: there is no `resume`, so the cancel ends at idle.
     - Mutation M-S2: the `resume` return removed. S-2 fails at the idle state. Set: {S-2}.
   - **S-3** (new, C2): `identityDeclarationOffer is made only while the dataset the panel admitted is the dataset on the map`.
     - Cases: (i) U-1 with its own handle gives the offer; (ii) U-1 with another handle gives null; (iii) U-1 with `null` gives null.
     - Red before the fix: (i) fails.
     - Mutation M-S4: the handle condition removed. S-3 fails at (ii). Set: {S-3}. S-1 passes equal handles, so it does not fail.
   - **S-4** (new, E2): `a declaration from a session-tier admission under a CRS assertion carries that assertion and is refused into the identity form with both`.
     - Steps: U-1 is admitted under a CRS assertion. The offer comes from `identityDeclarationOffer(state, handle)`, the options from `declarationOptions(offer, { column: "parcel_key" })`, and then `runAdmitPath` runs with stub deps whose `admit` refuses `engine.identity_unusable`.
     - Asserts: the stub got both `crsAssertion` and `identity`; the end state is `refused` with family `identity` and both options.
     - Red before the fix: the offer is `null`.
     - Mutation M-S3: `declarationOptions` returns `{ identity }` alone. S-4 fails at the merged `crsAssertion`. Set: {S-4}. E-1 carries no assertion, so it does not fail.
   - **T-1** (changed, its call only), in `frontends/shell/src/skp/__tests__/fixtures.test.ts`.
     - Red before the fix: the fixture has no `candidate_columns`.
     - Mutation M-T1, as filed. Set: {T-1}.
   - **K-1 and E-1:** unchanged.
   - **Known pass case:** none is known for any of the seven mutations.

   **What the render line is left with.** No test can fail if the render's `onSubmit` bypasses `declarationOptions`, because the package has no render harness. Block-on-sight 13 (item 9) covers it, and the reviewer reads it.

6. **§8: the base, the overlap and the merge** (N5, with item 8 and C2 added).
````text
- By ADV-2026-11-23-15 item 4, the custodian builds on the re-link's head, which holds most of the shared regions and the protocol place.
````
````text
- By ADV-2026-11-23-15 item 4 and ADV-2026-11-23-17 item 11, the custodian builds on the re-link's head (the heads of PR 353, PR 358 and PR 359). By merge commits it takes in: the head of PR 360; the head of the node `partitioned-ordinal-refusal-opens-the-identity-form` once its code is committed, while that code changes a file this piece changes (ADV-2026-11-23-20 item 8); the recovery offer's head if it holds the `protocol/` place first; and the head of every other piece whose code is committed and changes `App.tsx` (ADV-2026-11-23-22 item 6). The commit after the last merge is the recorded base, named in an amendment and in the PR body. A piece that shares a file with this one and whose code starts later is built on this piece's head.
````
````text
| the recovery offer (form filed) |
````
````text
| the recovery offer (form filed); also the literal's test files `saveProject.test.ts`, `admitDataset.test.ts` and `RefusalBlock.test.tsx`, by its §2.4 |
````
````text
The recovery offer's "and others" and milestone 5's "e2e suites" were not readable to me, and the custodian confirms them.
````
````text
Of the filed forms, milestone 5's PR A may edit `admission-remediation.mjs` if its re-sweep lists it (its §2.6), and neither it nor the recovery offer edits `AdmissionPanel.tsx`.
````
````text
- **Merge:** after the tag, PR 353, PR 358, PR 359, PR 360, the re-link, and the recovery offer if it takes `protocol/` first. If it bumps first, this piece takes the literal after its literal.
````
````text
- **Merge:** after the tag, PR 353, PR 358, PR 359, PR 360 and the re-link, and after every piece taken into the recorded base (the partitioned-refusal node while it is a base; the recovery offer if it holds `protocol/` first; any piece on `App.tsx`). A piece never merges before a piece it is built on (ADV-2026-11-23-17 item 11). The literal is Amendment 2 item 1's. It is a merge commit, never a squash or a rebase.
````
   **Rows added at the end of §8's table:**

| Path(s) | Shared with |
|---|---|
| `AdmissionPanel.tsx`, and `AdmissionPanel.test.ts` if it edits it | the node `partitioned-ordinal-refusal-opens-the-identity-form` (no form filed), as ADV-2026-11-23-20 item 8 places it |
| `frontends/shell/src/App.tsx` (the `<AdmissionPanel>` element only) | the recovery offer (form filed, §2.11); milestone 5 (form filed); shell-scale (form filed); colour-by refill (form filed); any held PR on it, which the custodian confirms against each held PR's file list (ADV-2026-11-23-15 item 4) |
| `docs/adr/ADR-016-stable-feature-identity-admission.md` | none known to me; the custodian confirms |
| in order B, every file that `git grep -l 'skp/0\.15'` lists at the recorded base | the recovery offer |

7. **§7's ceilings, with the two class-9 additions** (ADR-016, about 30 lines; `App.tsx`, about 2 lines).
   - **Files:** 40 against 38. This ceiling does not hold.
   - **Lines:** about 600 as §7 estimates, plus about 32 for the two files, plus about 85 for this amendment's test and product changes. That is:
     - S-3, about 25 lines;
     - S-4, about 35;
     - S-1's (ii) and (iii), about 6;
     - `declarationOptions`, the prop and the handle condition, about 12;
     - the two doc comments of N9, about 5.

     The total is about 715 against 650. This ceiling does not hold either. Order B adds the recovery offer's files that carry the literal, which cannot be counted until its code exists.
   - **How the overrun is recorded.** It is predicted here, before any code, and recorded as class 8 at the count, as ADV-2026-11-23-17 item 12 accepted for milestone 5. §7's line is not edited. If a build gate finds the piece too large to read as one, the split goes to the advisor.
   - **N4** (the gate's words):
````text
':!state/**'`, at a named commit.
````
````text
':!state/**'`, at a named commit. `<merge-base>` is the base recorded under ADV-2026-11-23-15 item 4 until every base has merged, and `git merge-base origin/main <head>` after.
````

8. **N1 to N9** (Documentation). I checked each Old text against the form above. N5 is in item 6.
   - **N1:**
````text
and keeps ADR-016 Amendment 1 item 6's "existing tests" sentence (:234-236, paraphrase) literally true.
````
````text
and edits existing tests only where the literal and the two `admitted` literals of §5 require it; ADR-016 Amendment 1 item 6's "existing tests" sentence (:234-236) stated Amendment 1's own change and does not bind this piece.
````
   - **N2:**
````text
"opens again":
````
````text
"opens this file again":
````
````text
"refused only after the scan":
````
````text
"refused only after that scan":
````
````text
"a project saved records it":
````
````text
"a project saved afterwards records it":
````
````text
"checks again":
````
````text
"checks the column again":
````
   - **N3:**
````text
Every pin is historical: for the code, the piece's base on main is authoritative.
````
````text
Every pin is historical: for the code, the base recorded under ADV-2026-11-23-15 item 4 is authoritative until every base has merged, and main after.
````
   - **N6** (adapted, because ADV-2026-11-23-20 item 1 has since answered the question):
````text
(To the advisor, ADV-2026-11-23-15 item 7 (d).)
````
````text
(To the advisor, ADV-2026-11-23-15 item 7 (d). The human's additions of 2026-10-09, item 3, put this question to the human. ADV-2026-11-23-20 item 1 rules it under the grant of 2026-11-13, which came after; the advisor tells the human, who can overturn it.)
````
   - **N7:**
````text
Only its sentence quoted in §0's intake changes.
````
````text
Only the sentence §0's intake names changes, the one beginning "The app does not yet offer".
````
   - **N8** (adapted to ADV-2026-11-23-20 item 2, which lands the ADR text in this piece's PR rather than outside it), with §0's sentence it rests on:
````text
(the human's; red line).** It is needed under (A), and the code waits for its acceptance. A skeleton follows.
````
````text
(ruled by ADV-2026-11-23-20 item 2).** It is needed under (A). Its words are the advisor's under the grant of 2026-11-13, item 2, drafted in Amendment 2 item 2, and the advisor's ruling of them is its acceptance. No code is written before that ruling. It is appended to `docs/adr/ADR-016-stable-feature-identity-admission.md` in this piece's PR and counted in §7 (Amendment 2 item 7). The skeleton below is superseded by that draft.
````
````text
Any answer that puts the list on `describe` amends an accepted ADR, which is the human's (OPEN-2).
````
````text
Any answer that puts the list on `describe` amends an accepted ADR, whose words ADV-2026-11-23-20 item 2 puts with the advisor under the grant of 2026-11-13 (OPEN-2; Amendment 2 item 2).
````
   - **N9:**
````text
drops the instrument exemption, which this product caller makes untrue, and names `describe_dataset` as its caller.
````
````text
drops the instrument exemption and its sentences that no surface carries the list and that `describe` may not gain a field for it, which this product caller makes untrue, and names `describe_dataset` as its caller.
````
````text
D3 replaces the cost notice. It is shown on both routes.
````
````text
D3 replaces the cost notice. It is shown on both routes. The `candidateColumns` prop's doc (:14-16) names `describe.identity.candidate_columns` as the list's second source.
````

9. **§9, §10 and the gate's other notes.**
   - **§9, added:**
     - 13. The offer's `onSubmit` passes anything but `declarationOptions(offer, identity)`.
     - 14. The offer is decided anywhere but `identityDeclarationOffer`, or without `datasetOnMap`.
   - **§10:**
````text
- OPEN-1, OPEN-2 and OPEN-4;
````
````text
- ADR-016's Amendment 2 as the advisor rules it, appended in this piece's diff with no line of the ADR edited;
````
   - **Added to §10's Seams.** Each is written against the interface the other side has at 6cf6140c, and is re-read at the recorded base:
     - `datasetOnMap`, from App's `admitted` (`App.tsx:853`) at the `<AdmissionPanel>` element (:2221). Its real-shape test is E-1.
     - `declarationOptions(offer, identity)`, from the offer's return type into `runAdmitPath`'s `options` (`AdmissionPanel.tsx:216-220`). Its test is S-4.
   - **The gate's other notes, and where each goes:**
     - "`disabled={isOpenInFlight(state)}` is always false": acted on here (item 5).
     - OPEN-2's Context could cite `ADMISSION-PREREGISTRATION.md:282-289`: acted on (the ADR draft's Context cites R-I3 there).
     - 65 conformance occurrences, not 66: the estimate stands, and the worker counts at the base. Left to the code's gates.
     - K-1's precedent at `kernel/src/skp.rs:3022-3095` rather than :3014-3094: a pin at another commit, re-read at the base. Left to the code's gates.
     - The literal in doc comments outside Scope stays unchanged: as filed, no action.
     - Class, envelope, wire, callers, seams, constitution and records: findings of no defect, no action.
     - OPEN-1 to OPEN-6: ruled by ADV-2026-11-23-20 (item 1 of this amendment).

10. **Superseded by this amendment, by section:**
    - the Drafted-by line (N3);
    - §0 (the ADR sentence);
    - §1 (Declared unchanged; May claim and May not claim added to);
    - §2: its heading; item 1 (the literal); item 2 (N9); item 4 (b), (c) and (f), (f) added; item 5 (N9); item 6 (D3, N2, N7, D3's note, D4's comment, C1's checks added); and the "other answers" block, which is not in force;
    - §4 (P0; S-1, S-2 and T-1; S-3 and S-4 added; the mutation set);
    - §5 (Predictions; I1 and I2, the latter by OPEN-2's new text; I5 added; Falsification);
    - §7 (Counting, by N4; Scope additions and the predicted overrun recorded here, with §7's lines not edited);
    - §8 (the base, the rows, the merge, the readability sentence);
    - §9 (items 2 and 5; items 13 and 14 added);
    - §10 (Architect, Reviewer, Seams);
    - OPEN-1 (N6, ruled), OPEN-2 (N8, ruled), OPEN-3 to OPEN-6 (ruled), OPEN-4 (N1).

Read the last amendment first.

Nothing above is edited.

## Amendment 3 — 2026-11-23 — the custodian's, at the commit that files Amendment 2: references only

*Written by the custodian at the commit that files Amendment 2, before any code. References only.*

1. Amendment 2 is the architect's draft, appended byte for byte from its consult, `state/consults/2026-11-23-identity-declaration-route-for-session-tier-amendment-2-architect-draft.md` (the hand-back's sha256 017a21f7f7efdef5b6441d9407e1d482960400de4d34763be47ec295b647c008): the text between its two marker lines.
2. Its evidence is the architect's form gate, attempt 1, FAIL (`state/consults/gates/2026-11-23-identity-declaration-route-for-session-tier-form-gate-architect.md`, gate-log row 866), and the advisor's rulings ADV-2026-11-23-20 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-20-the-identity-route-open-1-a-the-adr-016-amendment-the-advisors-open-3-to-5-a-the-partitioned-refusal-node-added.md`) and ADV-2026-11-23-22 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-22-the-bullet-as-ruled-op6-accepted-no-narrow-read-the-third-place-takes-work-5260-not-accepted-yet-c2-fix-i.md`, filed at cfe25dc1).
3. Its cites are read at 6cf6140cd8dfcc6fc52b82011e5dae5799edf300. Of its 85 four-backtick text blocks, 42 occur exactly once in the form above it (its Old texts) and 43 do not occur (its New texts and the ADR draft), counted by script at filing.
4. Its drafts and questions for the advisor (ADR-016's Amendment 2, D1 to D4 and their variants, and the points it could not settle) go to the advisor in one message (ADV-2026-11-23-15 item 8); none is ruled here. Its note on the partitioned-refusal node goes in the same message.
5. Next: the architect's form gate, attempt 2, on Amendment 2. No code is written before it ends PASS or PASS WITH NOTES, nor before the advisor rules the words of ADR-016's Amendment 2 (ADV-2026-11-23-20 item 2).

Read the last amendment first.

Nothing above is edited.

## Amendment 4 — 2026-11-23 — the custodian's, after the architect's form gate, attempt 2 (PASS WITH NOTES): that gate's replacement words for D-1 to D-3, carried byte for byte, and D-4's span hashes

*Written by the custodian before any code. It carries the attempt-2 gate's own replacement words, each copied by script from the filed report in the report's order, and the span hashes D-4 leaves to the custodian; it words nothing of its own but where each goes and what follows.*

1. Evidence: the architect's form gate, attempt 2, PASS WITH NOTES (`state/consults/gates/2026-11-23-identity-declaration-route-for-session-tier-form-gate-architect-attempt-2.md`, gate-log row 878; the hand-back's sha256 185848aec8a155b41cf2554e631b57227fb783102256925c6552e64256ef0eea). It has no Correctness and no Evidence finding. Its four Documentation findings, D-1 to D-4, are fixed before the merge, and none asks for another attempt (ADV-2026-11-21-20). Each Old text below occurs once in the form above this amendment, no two overlap, and each New text occurs nowhere above it.

2. **D-1, first replacement:** order A's literal files (Amendment 2 item 1).

Old:

````text
and the literal's files are those that `git grep -l 'skp/0\.14'` lists at the recorded base.
````

New:

````text
and the literal's files are those that `git grep -l 'skp/0\.14'` lists at the recorded base where the literal is the version a request, a fixture, a test or a constant carries; a doc comment that names the version a member came in stays as it is (for example `protocol/skp/src/v0/mod.rs:124`, `frontends/shell/src/skp/client.ts:160`, `frontends/shell/src-tauri/src/commands.rs:8`). Any such file not in §7's Scope is a class-9 addition, recorded before its code.
````

3. **D-1, second replacement:** order B's literal files (Amendment 2 item 1).

Old:

````text
Its literal files are those that `git grep -l 'skp/0\.15'` lists at the recorded base, which includes the recovery offer's own new files that carry the literal. Any of those not in §7's Scope is a class-9 addition, recorded before its code.
````

New:

````text
Its literal files are those that `git grep -l 'skp/0\.15'` lists at the recorded base where the literal is the version a request, a fixture, a test or a constant carries, which includes the recovery offer's own new files that carry it so; a doc comment that names the version a member came in stays as it is. Any of those not in §7's Scope is a class-9 addition, recorded before its code, and so is any recovery-offer file that holds an `admitted` panel `State` literal or calls `runAdmitPath` and must change for §2 item 4 (a) or (d).
````

4. **D-2, first replacement:** §2 item 4 (d).

Old:

````text
sets it when `prev` is `admitted` with an offer for the same path.
````

New:

````text
sets it when `prev` is `admitted` for the same path and `identityDeclarationOffer(prev, prev.admitted.dataset)` is non-null; `runAdmitPath` does not see the dataset on the map, and the render decides the offer, with `datasetOnMap`, from whatever state it shows.
````

5. **D-2, second replacement:** §9 item 14 (Amendment 2 item 9).

Old:

````text
The offer is decided anywhere but `identityDeclarationOffer`, or without `datasetOnMap`.
````

New:

````text
The offer the render shows is decided anywhere but `identityDeclarationOffer`, or without `datasetOnMap`; `runAdmitPath`'s `resume` test of §2 item 4 (d) is the one other call, with the state's own handle.
````

6. **D-3:** the cite of Amendment 1's tiers (Amendment 2 item 2).

Old:

````text
Amendment 1's tiers (:186-208)
````

New:

````text
Amendment 1's tiers (:186-228)
````

7. Span hashes. Every `path:line` cite in Amendment 2 is read at 6cf6140cd8dfcc6fc52b82011e5dae5799edf300; each entry below names the file and lines, the sha256 of those lines at that commit (each line with its LF, computed by script), and the Amendment 2 item that cites it.

   A short name is read as the one tracked file it names; a bare `:n` as the file named before it in the same passage; an entry marked (r) was read by the custodian against the file its sentence names. 36 entries:

- `protocol/skp/src/v0/mod.rs:136` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:882a5865fce789fe6efebc9b9ae98c9c0436eea3cd8c78f6137e8b0e6b4112fc — item 1
- `frontends/shell/src/skp/types.ts:15` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:1a4761d0f73ed545af307709e902d068249b554ec5c66f6522e864ca0f85b6b0 — item 1
- `docs/adr/ADR-016-stable-feature-identity-admission.md:242-246` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:18319f4200da36ed2f6a6d99d6598839f0035a7d1fd1ae7a7cf83356a110e892 — item 2; as written `:242-246` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:238` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:8c5b637b3df21df6032500cb3794b772a1e2ead1e74aa81949556e88c5d0978c — item 2; as written `:238` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:165-169` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:505ce7ffbc4a7b0ab897902ab7d001545d3ebdcd940b05191b64869ec3eb7273 — item 2; as written `:165-169` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:150-151` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:30824ecd8cc1e454df8907b1e51a6a2ce7ac4b5c305364e35ec34d525dc44b7c — item 2; as written `:150-151` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:165` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:b971d2e72ef58a8e630dc8768b5ebd2a130afff6fd42da341ff7560a127bc7a3 — item 2; as written `:165` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:165-166` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:58e9f7d67db37f279241c3c7e8e3766519b55abf0aa663ba3f84e3119fdafd53 — item 2; as written `:165-166` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:64-69` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:1be77e2b826913b0e757614de6db4ac04cf0309520e93e3718c843d2efbd5325 — item 2; as written `:64-69` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:81-92` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:de54b84f91ea7aafa560366bc5c8ae26b4251d3fde14b546bb44a6f78dab717f — item 2; as written `:81-92` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:161-164` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:d2fac86ac54fc69ece245a09524e176297df456add92519063f411e5c348d30c — item 2; as written `:161-164` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:186-208` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:e80d72471b382a40e2052519a2386e1e2b59aa8d7071066826997baf3c591499 — item 2; as written `:186-208` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:230-232` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:8e2bc012195b51aaebeb836c0691c2388eb143ab8f444f2fbe0b04d16180e63b — item 2; as written `:230-232` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:234-236` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:9637e4f451a68f97d30671cd1e3ec585a1f58829e948f1cd8f1b722eace723c4 — items 2, 8; as written `:234-236` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:171-178` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:4c526272d4d2ec98cc73ad946a59bdcc1c9289c75925af4b9b3e42c4637d4471 — item 2; as written `:171-178` (r)
- `engine/src/identity.rs:333` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:5d3220ce2f4dc9c695d8f96a175b405c9d1939882138510ec11dde59c530dafd — item 3
- `engine/src/dataset.rs:2045-2069` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:0219ff397ea9a0ac1378ec2f60d2287c48707c600d49c57bcbabc4ef089947b3 — item 3
- `kernel/src/skp.rs:1754-1762` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:c709f2980623f0f0ffd48c85c7d7fd782843622b0de72e2c7b021e8b7c99d778 — item 3
- `engine/src/dataset.rs:2076-2086` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:ba47336c4e34e546f18b261ea7241e8b59125489d9bfe5370d564ea9ef855e47 — item 3; as written `dataset.rs:2076-2086`
- `engine/src/dataset.rs:2088-2097` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:2578a490fbbe07c7947e26c5bb07c771fa1eaaf9a6bf2baa54bc37a433e0ce93 — item 3; as written `:2088-2097`
- `engine/src/dataset.rs:1998-2003` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:db9b0619894c6b6f228994838ac380097aba5df1ca396c0d3821c0536ec41935 — item 3; as written `:1998-2003`
- `engine/src/dataset.rs:2019-2025` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:e1fa58a465aa9aeaa106af0aed647af0a8d5e712fd2a36eb43ea5c0b55ff0985 — item 3; as written `:2019-2025` (r)
- `engine/src/dataset.rs:2028` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:b734f91d845c2eda2ca8b3b835dc1a990bb860830fc08fe808a16bc6c36030a9 — item 3; as written `:2028`
- `engine/src/identity.rs:336-344` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:702c6e5a52124354d67249bfeb803b3b66ea7f3e76ebe73c6b2f64e665600b80 — item 3; as written `identity.rs:336-344`
- `engine/src/dataset.rs:2071-2073` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:bb98dabe01b8c4954873c482bf62b1d161ba611aae9f7a4eb442a763cac23ad7 — item 3; as written `:2071-2073` (r)
- `engine/src/dataset.rs:2046` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:6cdde51b1682fe37f8abed467a8ebaee3303a78cb48e5f494869fe08e11b36a5 — item 3; as written `:2046` (r)
- `engine/src/dataset.rs:2088` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:7adf800c146534f8490028c796d9dd511d42c32ad633459587f0f0a2bccbb92e — item 3; as written `:2088` (r)
- `frontends/shell/src/App.tsx:853` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:5139b641742f48055c649ded8321ed89023f0b1e6d203af039ad07fde176bb6f — items 4, 9; as written `:853`, `App.tsx:853`
- `frontends/shell/src/App.tsx:2234-2237` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:ac05a25b049c2ec1a1195a93a877785e27333ab3b4c43ba8df5837e0e975db2d — item 4; as written `:2234-2237`
- `frontends/shell/src/App.tsx:921-923` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:01e45844aff554df6bcb4fb81f87efa36faec489b77571545d676c66ae484ff5 — item 4; as written `:921-923`
- `frontends/shell/src/admission/admitDataset.ts:12-19` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:e9ca4581d0cb8d03bfba2827ad319dad9c0138b789b2017f08d1c51fa7105000 — item 4
- `frontends/shell/src/App.tsx:2221` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:c524952e103f10634a499a73dded08d5f428f5a05f61de5c657f91c0287d5ed9 — items 4, 9; as written `App.tsx:2221`, `:2221`
- `frontends/shell/src/admission/IdentityDeclarationForm.tsx:14-16` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:a865553b483973edc07c6c2a430ed7ab2eb0a9fff23d2b751327854201209815 — item 8; as written `:14-16` (r)
- `frontends/shell/src/admission/AdmissionPanel.tsx:216-220` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:ea3b2461fe5ad9a1083da560436cc927c039d38827bfdccf562f5cbc3303207e — item 9; as written `AdmissionPanel.tsx:216-220`
- `governance/forms/engine/ADMISSION-PREREGISTRATION.md:282-289` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:3535fd7241a62181929f79d0ce56482fe81f0281a283672871bef194664671f8 — item 9; as written `ADMISSION-PREREGISTRATION.md:282-289`
- `kernel/src/skp.rs:3022-3095` @ 6cf6140cd8dfcc6fc52b82011e5dae5799edf300 sha256:9846a5879fb1017786de179c7f7d686b15786381b6fc28119668db1d82c417da — item 9

8. **Pins of the cites the New texts add.** The New texts of items 2 and 6 cite these lines, read by the gate at 5bc4011bf7c592e77fc393d84fe7403f651a48ed; each entry gives the sha256 of those lines at that commit (each line with its LF, computed by script):

- `protocol/skp/src/v0/mod.rs:124` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:4bde65ebbb9f6ddf5a97cbe27c79b2e5fdea39e53f18d205f38256e919a392af — item 2
- `frontends/shell/src/skp/client.ts:160` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:ac8d777346b8d730b62c44e4d151e5fb0d40a07e9faf45974bdc46110bf5c8d1 — item 2
- `frontends/shell/src-tauri/src/commands.rs:8` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:e50ff98ee2026a4357f2597f98b0f6b5e15da924e6ff447a019c322460e0ba9a — item 2
- `docs/adr/ADR-016-stable-feature-identity-admission.md:186-228` @ 5bc4011bf7c592e77fc393d84fe7403f651a48ed sha256:9573f9a1059d1b8f412962a53b1fcbcb9556d4cfaaa9a20f8e67fc2ae4dcf02f — item 6; as written `:186-228` (r)

9. **For the advisor**, in one message with the other drafts (ADV-2026-11-23-15 item 8): whether the draft's italic status line, which opens with Proposed, changes when its heading reads Accepted (Amendment 2 item 2); ADV-2026-11-23-20 item 8 against ADV-2026-11-23-17 item 11; and that under §8's base line this piece merges after any `App.tsx` piece its base takes in, milestone 5's PR A included. None is ruled here.
10. Next: no further form gate. The code waits for the advisor's ruling on the words of ADR-016's Amendment 2 (ADV-2026-11-23-20 item 2) and is built on the base §8 names. Nothing of it builds, tests or starts the app from 05:00Z on 2026-11-24 until the sitting is over.

Read the last amendment first.

Nothing above is edited.

## Amendment 5 — 2026-11-26 — the candidate list for every integer width admission takes (ADV-2026-11-26-04 items 1 to 6, with ADV-2026-11-26-12): the class 9 files, the claims it reverses, W-1, W-2 and K-2 with their mutations, ADR-016's Note 2026-11-26 and the two strings by reference, the class 8 figures

*Pre-code amendment. It is written on two of the advisor's rulings under the human's delegation of 2026-11-13: ADV-2026-11-26-04, and ADV-2026-11-26-12, which replaces the Note's text of ADV-2026-11-26-04 item 3 whole. Their words are the advisor's, not the human's, and they are cited by id and item. The design rests on the architect's consult `state/consults/2026-11-24-the-candidate-list-for-every-integer-width-architect-consult.md` (its parts 2, 3 and 6), cited by part. It records class 9 (Scope) additions, a class 3 fix and a predicted class 8 overrun, all before any code. Every `path:line` is read at c28c8cf10a5b616af3ce660d13b1478d90e4ea08, which is on main, and the custodian adds the span hashes in a later references-only amendment. A reference into this form is by section, amendment and item. Each Old text below is copied byte for byte from the form above this amendment (verbatim) and occurs there once. Where an Old text is part of a line, only that part is replaced. Each New text occurs nowhere above.*

1. **Authority and placement.**
   - ADV-2026-11-26-04 item 1 places the widening in this piece, before its code, riding `skp/0.15` with no further literal.
   - The ruling's item 2 records the change in the `skp/0.15` entry.
   - The ruling's item 3 supplied ADR-016's Note 2026-11-26. Its text is now ADV-2026-11-26-12 item 3's.
   - The ruling's item 4 supplies the legend, the hint and row I4.
   - The ruling's item 5 requires one private predicate.
   - The ruling's item 6 is the merge check, as ADV-2026-11-26-12 item 5 restates it for the Note.

2. **What does not change.**
   - The `protocol/` place, order A and `skp/0.15` (ADV-2026-11-23-26 item 3) stay as ruled. No further literal is taken. No wire type changes: the refusal's `candidate_columns` stays one comma-joined string (`kernel/src/skp.rs:2223-2237`), and the `describe.identity` member stays as §2 item 1 has it. No protocol fixture's list changes, because every fixture's list holds names only, and none holds a type (`protocol/skp/tests/data/v0-error-identity_unusable-with-candidates.json:7`; `protocol/skp/tests/conformance/fixtures/responses-accept.json:101`).
   - ADR-016's Amendment 2, its Decision 4 included, lands as ADV-2026-11-23-26 item 1 words it (ADV-2026-11-26-04 item 3, its last bullet).
   - D1 to D4, the offer rule of §2 item 4, K-1, S-1 to S-4, T-1 and E-1 stay as amended. Their fixtures hold only 64-bit keys, so their expected lists do not move (§3; `engine/src/fixture.rs:756`, :773).
   - §2 item 1's "The list is the engine's, unchanged" means that the kernel carries the engine's list as the engine gives it. Item 3 below changes the engine's rule itself. The member's docs (`commands.rs`, `types.ts`, SKP-V0.md §1) name no width. They say that the list is the engine's and the same as the refusal's.

3. **The engine change (ADV-2026-11-26-04 item 5).** It is in `engine/src/identity.rs` and nowhere else.
   - One private `fn` takes `&arrow::datatypes::DataType` and returns `bool`. It is true exactly for `UInt64 | UInt32 | UInt16 | UInt8 | Int64 | Int32 | Int16 | Int8`, the set the admitting arm holds today (`engine/src/identity.rs:333`). It is not `pub` and not `pub(crate)`. Its doc names its two callers and ADR-016 §4 with the Note 2026-11-26.
   - `candidate_identity_columns`'s type filter (`engine/src/identity.rs:304`) calls the predicate. The not-addressable filter (:311), the comma filter (:313) and schema order (:301-314) stay.
   - `admit_column_type`'s admitting arm (:333-335) becomes a guarded arm that calls the predicate. The refusal arm and its detail (:336-344) stay byte-unchanged, because text-id edits that detail on this piece's head (§8 below).
   - Callers: the predicate has two product callers, and nothing `pub` is added.

4. **The claims reversed, section by section.**
   - **§1, Declared unchanged (reversed).**
````text
- the engine's candidate rule (`identity.rs:299-315`);
````
````text
- the engine's candidate omissions (the not-addressable and comma filters); its type rule is reversed by Amendment 5 item 3, and the refusal's field set is unchanged while its `candidate_columns` value may hold more names;
````
   - **§2 item 2 (reversed).**
````text
No engine code changes.
````
````text
Engine code changes only as Amendment 5 item 3 says: one private predicate in `engine/src/identity.rs` that `candidate_identity_columns` and `admit_column_type` both call.
````
   - **§2 item 6 (reversed for the legend and the hint).**
````text
No other new string. The form's legend, hint and button are unchanged.
````
````text
No other new string except the legend and the hint of ADV-2026-11-26-04 item 4 (Amendment 5 item 5). The form's button is unchanged.
````
   - **Amendment 2 item 2, "What it leaves to the existing text" (superseded).** The ADR text it pointed to is itself superseded by the Note's Decision 5.
````text
Which columns are candidates: 64-bit integer columns in schema order, unranked, unpreselected (:165-166).
````
````text
Which columns are candidates: as ADR-016's Note 2026-11-26 decides (ADV-2026-11-26-12 item 3), every column of an integer width admission takes, less the engine's two omissions, in schema order, unranked, unpreselected; the settled block's fourth bullet keeps its other words.
````
   - **§9 item 2, as Amendment 2 item 4 amended it (replaced).**
````text
2. `workspaceState.ts`, `admitDataset.ts`, or any engine code changed (only the doc lines in `identity.rs`); `App.tsx` changed beyond the one prop of §2 item 4 (f).
````
````text
2. `workspaceState.ts`, `admitDataset.ts`, or any engine code changed beyond Amendment 5 item 3 (the predicate, the candidate filter and the admitting arm in `identity.rs`; the doc lines in `identity.rs` and `error.rs`); `App.tsx` changed beyond the one prop of §2 item 4 (f).
````
   - **§9 item 5, as Amendment 2 item 1 amended it (extended).**
````text
A string beyond D1 to D4;
````
````text
A string beyond D1 to D4 and the legend and hint of ADV-2026-11-26-04 item 4;
````

5. **The two strings and row I4 (ADV-2026-11-26-04 item 4), carried by reference.** Their text is that ruling's item 4, the backticked text of its first two bullets, and is not retyped here. ADV-2026-11-26-12 item 4 leaves them unchanged.
   - **The legend** replaces the text of the `<legend>` at `frontends/shell/src/admission/IdentityDeclarationForm.tsx:60`.
   - **The hint** replaces the text of the `<p className="identity-declaration-free-text-hint">` at :77-80.
   - Each string is written whole on one source line, as JSX text or as a string constant, so that item 15's byte comparison finds it in the diff.
   - The source comment at :56-59 is replaced. The new comment names ADV-2026-11-26-04 item 4 as the source of both strings (the advisor's words under the delegation, not the human's) and the predicate of item 3 as the legend's criterion. For the hint, it names the free-text route that accepts any name (`frontends/shell/src/admission/identityDeclarationState.ts:35-44`) and the checks at open (`engine/src/dataset.rs:1998-2003`, :2019-2025, :2028, :2045-2098).
   - The comment also names two cases, for the source comment and not for ordinary use:
     - a column whose name nothing can address is left off the list, and it is refused if declared (:2019-2025);
     - the free text is trimmed at either end (`frontends/shell/src/admission/identityDeclarationState.ts:40`), so an unlisted name with spaces at either end is sent trimmed, while a listed name is picked as it is (:36-37).
   - The hint's sight: no walkthrough row quotes the hint, and row I4 shows it unquoted.
   - Both strings are built under the placeholder mark and receive item 4's bytes in the words commit, as D1 to D3 do (ADV-2026-11-23-20 item 6; ADV-2026-11-23-26 item 2).
   - **Row I4** (`frontends/shell/MANUAL-WALKTHROUGH.md:598`): only the quoted legend title changes, to item 4's legend. Nothing else of the row changes, and no past result log is edited. The fixture still offers exactly `parcel_key` (`kernel/tests/manual_walkthrough_fixtures.rs:503-512`; `engine/src/fixture.rs:757-774`).

6. **ADR-016's Note 2026-11-26 (ADV-2026-11-26-12 item 3), carried by reference.** Its text is ADV-2026-11-26-12 item 3's four-backtick text block, from its heading line to its last Consequences bullet, which replaces ADV-2026-11-26-04 item 3's text whole. It is not retyped here.
   - It is appended at the end of `docs/adr/ADR-016-stable-feature-identity-admission.md`, in this piece's PR. The order is: Amendment 2 with its acceptance line (ADV-2026-11-23-26 item 1), then the Note 2026-11-23 (ADV-2026-11-23-27 item 4), then this Note. No line of the ADR is edited.

7. **The `skp/0.15` entry (ADV-2026-11-26-04 item 2).** SKP-V0.md §8's `skp/0.15` entry, which §2 item 1 requires to give the version's full field set, gains one paragraph. A draft follows. It is the worker's text and not the human's, and the reviewer reads its clauses:
````text
**`candidate_columns`, on `engine.identity_unusable` and on `describe.identity`, widens in this version** (ADR-016, Note 2026-11-26). It names every column whose type `open_dataset` admits as an identity column — `Int8`, `Int16`, `Int32`, `Int64`, `UInt8`, `UInt16`, `UInt32` or `UInt64` — in schema order across all widths, unranked and unpreselected. Two kinds of column stay out of it, as before: a name that holds a comma (the `skp/0.2` P3c addendum) and a name nothing can address. The `skp/0.2` entry's "`Int64` and `UInt64` only" records that version and is not edited. No fixture changes for this: each fixture's list holds names only.
````
   - Clause checks:
     - "every column whose type `open_dataset` admits": the shared predicate (item 3) and `engine/src/dataset.rs:2028`.
     - "schema order": `engine/src/identity.rs:301-314`.
     - "a name that holds a comma": :313.
     - "a name nothing can address": :311.
     - The quoted span is verbatim from `protocol/skp/SKP-V0.md:592`.
     - "No fixture changes": see item 2.
   - `protocol/skp/SKP-V0.md:591-598` (the `skp/0.2` entry) stays as written. This satisfies §4 item 13's conditions (ii) and (iv) (`protocol/skp/SKP-V0.md:314-320`). `skp/0.15` has not merged.

8. **Doc lines changed with item 3, the class 3 fix, and lines read and left.**
   - **Changed:**
     - `engine/src/identity.rs:201-204` (the field doc) and :281-283 (the function doc), which state "64-bit" and "Int64 and UInt64 only" (paraphrase);
     - `engine/src/error.rs:158-160`;
     - `kernel/src/skp.rs:2234`;
     - `protocol/skp/tests/fixtures.rs:900-901`, which keeps the `skp/0.2` history and adds that from `skp/0.15` the list holds every admitted width;
     - `frontends/shell/src/admission/IdentityDeclarationForm.tsx:14-16`, the prop doc, as well as Amendment 2's N9 addition;
     - `frontends/shell/src/admission/candidateColumns.ts:11-12`;
     - the test name at `frontends/shell/src/admission/candidateColumns.test.ts:17`, which becomes `an empty string (no candidate column at all) yields an empty list, not [""]`. This is a rename with its assertion unchanged, not a new test.
   - **Class 3, before the merge:** the stale cites in KNOWN-LIMITATIONS item 3's comment (`KNOWN-LIMITATIONS.md:68`: `engine/src/identity.rs:196-217` and `engine/src/error.rs:234-238`) are corrected to `admit_column_type` and the `IdentityUnusable` `Display` as those lines stand at this piece's final head. Item 3 is in §7's Scope. Text-id, which plans the same fix on this piece's head, is told.
   - **Read and left, each still true:**
     - `engine/tests/identity.rs:129-132`: its fixture's `id` is UInt64;
     - `engine/tests/multipolygon_corpus.rs:26`: it is a statement about a type;
     - the recorded mutation in the doc of `only_value_preserving_integer_types_are_admitted` (`engine/src/identity.rs:362-364`): it is historical and names its commit;
     - the narrow-id form's lists, whose node is `done`: they are that piece's record. `candidate_columns_are_the_64_bit_integer_columns_in_schema_order_unranked` is not test-shaped for `scripts/plan/verify-test-claims.mjs` @ c28c8cf1 (its first word is not a prefix at :106).

9. **The tests (the consult's part 3, with the seam test).** They are in addition to §4 and Amendment 2 item 5. Each mutation is applied in the worktree, the named test is run, the failure is recorded by name with its commit, and the mutation is reverted. A `verify-mutation` run is not an observation. The kernel runs are inside the machine's holds.
   - **W-1** (changed from `candidate_columns_are_the_64_bit_integer_columns_in_schema_order_unranked`, `engine/src/identity.rs:394-409`), in `engine/src/identity.rs`'s `mod tests`: `the_candidate_list_is_every_admitted_integer_column_in_schema_order_unranked`.
     - Fixture: the same in-memory schema (:397-403): `name` Utf8, `big_signed` Int64, `small_signed` Int32, `big_unsigned` UInt64, `geometry` Binary.
     - Expected: `candidate_identity_columns` gives `["big_signed", "small_signed", "big_unsigned"]`. Alphabetical order and grouping by width would both give another order.
     - **M-W1:** the type filter goes back to `Int64 | UInt64` instead of calling the predicate. W-1 fails at its list assertion with `["big_signed", "big_unsigned"]`. No test at the base catches it, because it is the base's behaviour. Set: {W-1, W-2, K-2}.
   - **W-2** (new), in the same module: `the_candidate_list_and_the_type_check_admit_exactly_the_same_types`.
     - Fixture (i): for each of the eight integer types and `Utf8`, `Float64`, `Binary`, `Boolean`, `Date32` and `Decimal128(38, 0)`, a one-field schema built with `schema_with("k", ty)` (:353-357).
     - Fixture (ii): one schema of `u8` UInt8, `i64` Int64, `i16` Int16, `u32` UInt32, `name` Utf8, `i8` Int8, `u64` UInt64, `i32` Int32, `u16` UInt16.
     - Expected for (i): `candidate_identity_columns` is `["k"]` exactly when `admit_column_type("k", &ty, &schema)` is `Ok`, and that holds for exactly eight types.
     - Expected for (ii): the list is `["u8", "i64", "i16", "u32", "i8", "u64", "i32", "u16"]`.
     - **M-W2:** the candidate filter stops calling the predicate and lists its own seven types, with `UInt8` left out. The type check is unchanged. W-2 fails at (i) for UInt8. W-1 passes, because its schema has no UInt8, and so do `only_value_preserving_integer_types_are_admitted`, the comma test and `kernel/tests/skp_admission_remediation.rs:300-304`, because `u64` is still listed. Set: {W-2, K-2}.
   - **K-2** (new, the seam's real-shape test), in `kernel/tests/skp_admission_remediation.rs`: `a_narrow_integer_key_is_offered_on_both_carriers_and_declaring_it_from_the_list_opens_mapped`.
     - It runs through `host()` (:53-60): `SkpHost::open_dataset` (`kernel/src/skp.rs:1108`) and `SkpHost::describe` (:1361), with `open_req` (`kernel/tests/skp_admission_remediation.rs:62-75`). There is no stub. The imports at :19-21 gain `NarrowColumn`, `NarrowValues` and `NarrowWidth`.
     - (a) Fixture: `fixture("narrow-parcel-key", …)` with `identity: IdentityMode::NarrowInteger { width: NarrowWidth::Int32, column: NarrowColumn::ParcelKey, values: NarrowValues::TopOfRange }` and `..small_spec()` (`engine/src/fixture.rs:549-568`, :761-768). A plain open is admitted. On describe, `class` is `"session-ordinal"` and `serde_json::to_value(&describe.identity)`'s `candidate_columns` equals `["parcel_key"]`.
     - (b) The column is taken from (a)'s JSON list, not typed in the test, and declared through the wire's `IdentityDeclaration`. On describe, `source` is `"mapped:parcel_key"`, `uniqueness` is `"verified-at-open-full-file"`, and the JSON `candidate_columns` is `null`.
     - (c) Fixture: `fixture("every-width-refused", …)` with the spec at :275-285 (`IdentityMode::StringIds`, `AttributeMode::FilterWitness`, 2 features). A plain open is refused with `engine.identity_unusable`, and `err.fields["candidate_columns"]` equals `"i8,i16,i32,i64,u8,u16,u32,u64"` (`engine/src/fixture.rs:797-812`).
     - **M-K2:** in `describe_dataset`, the member is computed from `ds.file_schema()`'s `Int64`/`UInt64` fields in place of `identity.candidate_columns()`, under the same session-tier guard. K-2 fails at (a) with `[]`. K-1 passes, because its session fixture's only key is UInt64 (§3 F-1), and so do T-1, E-1 and every engine test. Set: {K-2}.
   - **Added to §3's table:**

| # | Scenario | Base | After |
|---|---|---|---|
| F-4 | K-2 (a): Int32 `parcel_key`, no `id`, session open, describe JSON | no `candidate_columns` key | `["parcel_key"]` |
| F-5 | F-4's path declared from F-4's list | mapped; no key | `mapped:parcel_key`, `verified-at-open-full-file`; `null` |
| F-6 | K-2 (c): Utf8 `id` beside the eight widths, plain open | refused; `"i64,u64"` | refused; `"i8,i16,i32,i64,u8,u16,u32,u64"` |

   - **Added to §4's P0.**
     - Commit 1 also adds W-2 and K-2 and changes W-1.
     - Commit 2 lands §2. Commit 3 lands this amendment's item 3 with this amendment's item 8 doc lines. The strings land in the words commit.
     - At commits 1 and 2, W-1, W-2 and K-2 each fail and are recorded by name with the commit id:
       - W-1 at its list assertion;
       - W-2 at a narrow width, whose list is empty where the type check admits;
       - K-2 at (a), at commit 1 because the member is absent and at commit 2 because the member is `[]`.
     - At commit 3 all three pass.
   - **§4 and §5 counts:**
````text
**The mutation set** is M-K1, M-S1, M-S2, M-S3, M-S4, M-T1 and M-E1.
````
````text
**The mutation set** is M-K1, M-K2, M-S1, M-S2, M-S3, M-S4, M-T1, M-E1, M-W1 and M-W2.
````
````text
- All seven tests pass on the fix.
````
````text
- All ten tests pass on the fix: the seven of Amendment 2 item 5, and W-1, W-2 and K-2 (Amendment 5 item 9).
````
````text
- P0 and the seven mutations, observed again;
````
````text
- P0 and the ten mutations, observed again (Amendment 5 item 9);
````
   - **No test pins the two strings.** The package has no render harness (Amendment 2 item 5). Their proof is item 15's byte comparison at the merge check and row I4's sight.

10. **§1 and §5, added.**
    - **May claim:** on the refusal and on the session tier, the candidate list names every column of the eight integer widths, in schema order, without the engine's two omissions.
    - **May not claim:** that an operator has seen a narrow-width column in the list. No walkthrough fixture holds one (`kernel/tests/manual_walkthrough_fixtures.rs`, by Grep). The proof is K-2.
    - **Declared unchanged (assertions not edited):**
      - `only_value_preserving_integer_types_are_admitted`;
      - `a_comma_bearing_column_is_omitted_from_candidates_but_still_declarable_by_free_text`;
      - `engine/tests/identity.rs`, `engine/tests/b1_projection_hostile_names.rs`, `engine/tests/b1_nul_declared_identity_no_scan.rs` and `engine/tests/narrow_integer_id_stream.rs`;
      - `protocol/skp/tests/fixtures.rs:905-919` and the shell's fixture test of the same field.
    - **Invalidators:**
      - I6 (stop): at the recorded base, a test outside §7's Scope and this amendment asserts an exact candidate list over a file that holds an integer column narrower than 64 bits. The form is amended before any code. I found none at c28c8cf1.
      - I7 (stop): at the recorded base, `admit_column_type` admits a type set other than the eight.
    - **Falsification:** after the fix, either of these holds:
      - a column of an admitted width that neither omission covers is missing from the list;
      - the list is not in schema order.

11. **Scope, class 9, declared before any code.**
    - **New files:**
      - `engine/src/error.rs` (doc only, :158-160);
      - `frontends/shell/src/admission/candidateColumns.ts` (doc only, :11-12);
      - `frontends/shell/src/admission/candidateColumns.test.ts` (one test name, :17);
      - `protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json` (its message), while the node `partitioned-ordinal-refusal-opens-the-identity-form` is a base. Its message becomes the engine's `Display` as it stands at that base (ADV-2026-11-23-27 item 2). `protocol/skp/SKP-V0.md:734-735`, which the same ruling item names, is already in Scope.
    - **Widened regions:**
      - `engine/src/identity.rs`, in Scope "(doc only)", gains item 3's code and W-1 and W-2;
      - `frontends/shell/MANUAL-WALKTHROUGH.md`, in Scope "(a new Part)", gains row I4's quoted legend.
    - **Already in Scope, so not class 9:** `kernel/src/skp.rs`, `kernel/tests/skp_admission_remediation.rs`, `protocol/skp/SKP-V0.md`, `protocol/skp/tests/fixtures.rs`, `IdentityDeclarationForm.tsx`, `KNOWN-LIMITATIONS.md` (item 3's comment, item 8), and `docs/adr/ADR-016-stable-feature-identity-admission.md` (Amendment 2 item 2). The last also takes the Note 2026-11-23 (ADV-2026-11-23-27 item 4).
    - §7's lines are not edited.

12. **The class 8 figures.** Lines are insertions plus deletions, counted by §7's command as Amendment 2 item 7 amended it.

| File | Before this amendment | This amendment's lines |
|---|---|---|
| `engine/src/identity.rs` | in Scope, doc only | ~60 (predicate ~8, filter and arm ~4, docs ~10, W-1 ~8, W-2 ~30) |
| `engine/src/error.rs` | new, class 9 | ~4 |
| `kernel/src/skp.rs` | in Scope | ~2 |
| `kernel/tests/skp_admission_remediation.rs` | in Scope | ~65 |
| `protocol/skp/SKP-V0.md` | in Scope | ~6; ~4 more while the partitioned node is a base (:734-735) |
| `protocol/skp/tests/fixtures.rs` | in Scope | ~3 |
| `protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json` | new, class 9, while the partitioned node is a base | ~2 |
| `frontends/shell/src/admission/IdentityDeclarationForm.tsx` | in Scope | ~16 |
| `frontends/shell/src/admission/candidateColumns.ts` | new, class 9 | ~3 |
| `frontends/shell/src/admission/candidateColumns.test.ts` | new, class 9 | ~2 |
| `docs/adr/ADR-016-stable-feature-identity-admission.md` | in Scope (Amendment 2) | ~24 (the Note 2026-11-26 ~18; the Note 2026-11-23 ~6, ADV-2026-11-23-27 item 4) |
| `frontends/shell/MANUAL-WALKTHROUGH.md` | in Scope, a new Part | ~2 (row I4) |
| **This amendment** | 11 files, 3 of them new; 12 files, 4 of them new, while the partitioned node is a base | **~187; ~193 while the partitioned node is a base** |

   - The `KNOWN-LIMITATIONS.md` class 3 fix (item 8) is about 2 lines inside item 3's own estimate. It is counted in §7's figures, not here.
   - **Against the form's figures:** §7 has at most 650 lines over 38 files, and Amendment 2 item 7 predicts about 715 over 40. This amendment brings the prediction to about 902 lines over 43 files, or about 908 over 44 while the partitioned node is a base. Neither ceiling of §7 holds.
   - This amendment's own share is bounded at 240 lines over these 12 files. An excess is recorded as class 8 at the count with this amendment named.
   - The overrun is predicted here, before code, and recorded as class 8 at the count. §7's line is not edited (Amendment 2 item 7).

13. **§8, rows added at the end of its table.**

| Path(s) | Shared with |
|---|---|
| `engine/src/identity.rs` (item 3 and docs), `engine/src/error.rs` (the `IdentityUnusable` doc), `frontends/shell/MANUAL-WALKTHROUGH.md` row I4, `KNOWN-LIMITATIONS.md` item 3's comment | text-id, built on this piece's head and merging after it (ADV-2026-11-23-35 item 2). It edits `admit_column_type`'s refusal detail, `error.rs`, row I4's quoted message and item 3's comment (its own form; paraphrase), so item 3 leaves that detail byte-unchanged. |
| `engine/src/error.rs`, `protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json`, `protocol/skp/SKP-V0.md` (:734-735) | the node `partitioned-ordinal-refusal-opens-the-identity-form` (its §7: the variant's doc and its `Display` arm). It is a base while its code changes a file this piece changes (Amendment 2 item 1, item 8). The regions are disjoint. |
| `frontends/shell/src/admission/candidateColumns.ts`, `candidateColumns.test.ts` | none known to me; the custodian confirms |

14. **§9 and §10, added.**
    - **§9:**
      - 15. A second list of the admitted types: in the engine, the candidate filter or `admit_column_type` not calling item 3's one predicate; anywhere in the kernel or the shell, a width list. Or the predicate visible outside `identity.rs`.
      - 16. `admit_column_type`'s refusal arm or its detail changed by this piece.
      - 17. The Note differing from ADV-2026-11-26-12 item 3's bytes, or either string differing from ADV-2026-11-26-04 item 4's bytes, or either string split across source lines.
      - 18. Row I4 changed beyond its quoted legend, or a past result log edited.
    - **§10, Architect:**
      - the Note appended after the Note 2026-11-23, with no line of the ADR edited, and Amendment 2's Decision 4 as ruled;
      - the predicate's two product callers, and nothing `pub` added.
    - **§10, Reviewer:**
      - W-1, W-2 and K-2 at P0 (item 9), and M-W1, M-W2 and M-K2 observed again;
      - the clause checks of item 7 and of the source comment of item 5;
      - item 8's class 3 fix.
    - **§10, Seams:** each is written against the interface the other side has at c28c8cf1 and is re-read at the recorded base. The real-shape test of both is K-2.
      - `EngineError::IdentityUnusable { candidate_columns }` into `error_of`'s comma join (`kernel/src/skp.rs:2223-2237`);
      - `DatasetIdentity::candidate_columns()` (`engine/src/identity.rs:257`) into `describe_dataset`'s member (§2 item 2).
    - **§10, Suites:** `cargo test --locked -p spatial-engine --lib identity` joins the list.

15. **The merge check (ADV-2026-11-26-04 item 6; ADV-2026-11-26-12 item 5).** The advisor compares the Note of item 6 with ADV-2026-11-26-12 item 3, and the strings of item 5 with ADV-2026-11-26-04 item 4, byte for byte, beside ADV-2026-11-23-26 item 5's comparison.

16. **Superseded by this amendment, by section:**
    - §1: Declared unchanged, first bullet; May claim and May not claim added to;
    - §2: item 1, read as item 2 says; item 2's last sentence; item 6's last bullet;
    - §3: rows F-4 to F-6 added;
    - §4: P0, the mutation set, W-1, W-2 and K-2;
    - §5: Predictions; Declared unchanged, I6, I7 and Falsification added;
    - §7: Scope additions, the class 3 fix and the predicted overrun recorded here, with §7's lines not edited;
    - §8: rows added;
    - §9: items 2 and 5; items 15 to 18 added;
    - §10: Architect, Reviewer, Seams and Suites added to;
    - Amendment 2: item 2's "Which columns are candidates" bullet, item 4's §9 item 2 text, item 1's §9 item 5 text, item 5's counts.

17. **Next.** The form gate's narrow read of this amendment's draft ended PASS WITH NOTES. Its D-1 to D-7 are applied in this text, and its R-1 is ruled by ADV-2026-11-26-12 (items 1 to 3), which also asks for these fixes before the amendment is appended (its item 6). Neither ruling asks for a further form gate. Under ADV-2026-11-26-04 item 1, no code of this piece starts before this amendment is appended.

Read the last amendment first.

Nothing above is edited.

## Amendment 6 — 2026-11-26 — the custodian's, at the commit that appends Amendment 5: references only

*Written by the custodian at the commit that appends Amendment 5, before any code. References only.*

1. Amendment 5 is the architect's revision, appended byte for byte from its consult, `state/consults/2026-11-26-identity-declaration-route-for-session-tier-amendment-5-architect-revision.md` (the hand-back's sha256 a54cf2a92188e4f62ea8051456f6198199ee616ba7d53ad5198c6493f3ba6a2e): the text between its two marker lines (sha256 6b3c0d1de7a7a3a27aa9ea262dda7544cb3b4e7a407ea96848005dc487312538).
2. Its first draft is `state/consults/2026-11-26-identity-declaration-route-for-session-tier-amendment-5-candidate-list-every-integer-width-architect-draft.md`. The architect's narrow read of that draft ended PASS WITH NOTES (`state/consults/gates/2026-11-26-identity-declaration-route-for-session-tier-amendment-5-narrow-read-architect.md`, gate-log row 910). The advisor's rulings behind it are ADV-2026-11-26-04 (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-04-the-candidate-list-every-integer-width-lands-in-the-identity-route-before-its-code-the-adr-016-note-and-two-strings.md`) and ADV-2026-11-26-12 (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-12-the-notes-decision-3-takes-the-agreed-words-this-ruling-carries-the-notes-final-bytes.md`).
3. Of its 19 four-backtick text blocks, 9 occur exactly once in the form above it (its Old texts), and 10 do not occur (its New texts and the draft paragraph of its item 7). They were counted by script at filing.
4. The rulings after ADV-2026-11-23-22 that bind this form, by path, as the narrow read asked (its records matter):
   - ADV-2026-11-23-26 items 2 to 4 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-26-adr-016-amendment-2-accepted-d1-to-d4-ruled-the-identity-routes-code-may-start-protocol-place-skp-0-15.md`);
   - ADV-2026-11-23-27 items 2 and 4 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-27-the-partitioned-refusal-open-1-to-3-a-the-adr-016-note-in-the-identity-pr-d1-to-d3-worded.md`);
   - ADV-2026-11-23-35 item 2 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-35-the-bases-identity-route-then-text-id-then-recovery-offer-each-the-next-unused-literal-recovery-build-held-until-a-green-head.md`);
   - ADV-2026-11-24-23 item 2 (`state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-23-the-humans-message-of-09-52z-placed-every-case-settled-not-an-approval-identity-route-first-r6-its-own-piece.md`);
   - ADV-2026-11-26-08 item 4, the build order (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-08-findings-a-b-c-placed-b-first-with-its-adr-drafted-now-a-after-it-on-milestone-5-pr-a-c-not-a-piece.md`);
   - ADV-2026-11-26-11, the hold on builds while C: is under its floor (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-11-c-under-its-floor-nothing-builds-tests-or-launches-reads-fill-the-places-room-made-in-order.md`).
5. Its cites are read at c28c8cf10a5b616af3ce660d13b1478d90e4ea08. The span hashes are below: sha256 of lines a to b of the file at that commit, each line with its LF.
   - A bare cite is bound to the file named before it in the same item.
   - Item 9's K-2 (c) cite ":275-285" is bound to `kernel/tests/skp_admission_remediation.rs`, where the spec it describes stands at the pin. It is not in `engine/src/fixture.rs`.
   - The two cites inside its Old texts are quotations of the form, not hashed here.
   - 59 distinct spans:
   - `kernel/src/skp.rs:2223-2237` 480cec6bbd415318979d3063b8d0a7d1f14066748568046a91298d714895c2fd
   - `protocol/skp/tests/data/v0-error-identity_unusable-with-candidates.json:7` cdd9e6590068a48aca8d07756db056bf90d4b142215a1c01af92bb50d920a9f9
   - `protocol/skp/tests/conformance/fixtures/responses-accept.json:101` 153ce5ec291743006af34dbdc17ab0786e76a63d44795341309ca5e31811bc7b
   - `engine/src/fixture.rs:756` 56fa79ec955bea761a3800c6e4524f286b2b7c3d30a8c6ce6245e56ca049262d
   - `engine/src/fixture.rs:773` 0b1da9ff85fd88614500d1cc30af0e3519c2f70021bbdd919cf1a9d236614da8
   - `engine/src/identity.rs:333` 5d3220ce2f4dc9c695d8f96a175b405c9d1939882138510ec11dde59c530dafd
   - `engine/src/identity.rs:304` 6dd3cea3d2ebe3f8ba6c1a7d2712fba86b2cc0bce9370ee9de81e52f4a0b770e
   - `engine/src/identity.rs:311` cb3b9aa30eed0dafa5b5a013f3ec73a7da43dcfd211aa69bcb9e942614f529c7
   - `engine/src/identity.rs:313` 753c12850930063a8fa0ec55d6a6a9f5929ecf818b1606819431fbdf4a39f58f
   - `engine/src/identity.rs:301-314` 95ed7dbeb43a14423ff7838af3f8454a2a977cd3974b90f0b359fd3dc382f74e
   - `engine/src/identity.rs:333-335` a66517e2b8b2207cbe45291fcf3f7eaf49dd4bf4f9b5884a5b550db4cee0d389
   - `engine/src/identity.rs:336-344` 702c6e5a52124354d67249bfeb803b3b66ea7f3e76ebe73c6b2f64e665600b80
   - `frontends/shell/src/admission/IdentityDeclarationForm.tsx:60` 63df261edd8dc0ba7d3e5f35fb2e09b9f1fdb85dabb557fc400984d12c91076b
   - `frontends/shell/src/admission/IdentityDeclarationForm.tsx:77-80` 24258ec3c3bb6f682d88770e83ad68e11b4ee80fdaacae89fe1a9bce2cdd4ea9
   - `frontends/shell/src/admission/identityDeclarationState.ts:35-44` d78d56cab513f9c659c1c0f9fa508698b3ea3896693788d33a132c74de4608f4
   - `engine/src/dataset.rs:1998-2003` db9b0619894c6b6f228994838ac380097aba5df1ca396c0d3821c0536ec41935
   - `frontends/shell/src/admission/IdentityDeclarationForm.tsx:56-59` e3bda607f5521590c6ddbb89b5e111f977130fa2024d4e306c944893e489258d
   - `engine/src/dataset.rs:2019-2025` e1fa58a465aa9aeaa106af0aed647af0a8d5e712fd2a36eb43ea5c0b55ff0985
   - `engine/src/dataset.rs:2028` b734f91d845c2eda2ca8b3b835dc1a990bb860830fc08fe808a16bc6c36030a9
   - `engine/src/dataset.rs:2045-2098` 18766f18c785cbd205b0267823e217e145535e878fb191b19a13fc0fa6db8ea5
   - `frontends/shell/src/admission/identityDeclarationState.ts:40` ad441dea79788a4ca2e9c09f9686c632b8ecea7764356a5296fcc912e0c52528
   - `frontends/shell/src/admission/identityDeclarationState.ts:36-37` 00e3aef01714c600b7fb77d2ddd8f5122e8b7dea6c176817d555a540491488d4
   - `frontends/shell/MANUAL-WALKTHROUGH.md:598` 64ef2ab8d04f326de09d40c00f1534534e1d631c7ef421cdce55d550eb0b12a3
   - `kernel/tests/manual_walkthrough_fixtures.rs:503-512` 9bfeb91e3f73958c4f3f23d950052ebfd03409b632d3a2bc18a754c53f00e90c
   - `engine/src/fixture.rs:757-774` cdd5aa4f6265c49b37d00366ce411a23ae76e7e8aa22d5a23bfcfb451f2060d2
   - `protocol/skp/SKP-V0.md:592` 49489e241607e075ea0c718c6c473a7c184b1e1a44a1116632e83f96572bff21
   - `protocol/skp/SKP-V0.md:591-598` 06da79f14f05a623411709e523e191df05fae023bdc70f7ede3f8a68f3153706
   - `protocol/skp/SKP-V0.md:314-320` 91ce6a58558170d73bdd9eff11943f5687863ae1b5506a35bd222d79b7c66e67
   - `engine/src/identity.rs:201-204` 39bd872f3f5b2b4a776e2e30a0e11b5ce9c61ddd4388e2a18e2e252bd79d79cc
   - `engine/src/identity.rs:281-283` 5612b9cdda4c45a4ff8c43a197959ca19d053bfdfe9787eb29fadbebe2ec2ebe
   - `engine/src/error.rs:158-160` 744105ee799a041c13b9668f2372bbe4e7b0764e00703abac632d8d3e1780977
   - `kernel/src/skp.rs:2234` 5dac7ebd0601b9125f9d3797998d63139372a7b4f6cf9f471db876d6542add80
   - `protocol/skp/tests/fixtures.rs:900-901` 9e2ab6a0236ce569ff2e16a27df15adb0617aec8afbbdd92c5430cefdc357ab2
   - `frontends/shell/src/admission/IdentityDeclarationForm.tsx:14-16` a865553b483973edc07c6c2a430ed7ab2eb0a9fff23d2b751327854201209815
   - `frontends/shell/src/admission/candidateColumns.ts:11-12` a723663257ac8da54084216ee42c3a1dd7a7a1b2f61b4c152dc3737db68fced2
   - `frontends/shell/src/admission/candidateColumns.test.ts:17` e59528847e3e91f3c68596f4b335040e23431d71191d99afe2ee5fcc5ffa38dc
   - `KNOWN-LIMITATIONS.md:68` 2af2b6c0d1c97370bdb64a20b1ea1a1911628b9522f07e9f81624f615a4f4e00
   - `engine/src/identity.rs:196-217` 7da625e7d3f6885613c346772cbc7a71194de235b0b3cb69ee1825e29bee518d
   - `engine/src/error.rs:234-238` e023703c1b540b35b61190d57758ca2b04586098fccb1de2caed6c83ffd0240b
   - `engine/tests/identity.rs:129-132` 44bb98747837afe2806f524d0389809763716df8e24240539749362ee1411cc3
   - `engine/tests/multipolygon_corpus.rs:26` 372376daef948c212eaac5ff25421caf422b6d875522e9d05d5803ecc3f9174a
   - `engine/src/identity.rs:362-364` 022434eab938ab2876218a305594144f3076a8b2026c5a93aa8753d41552783a
   - `scripts/plan/verify-test-claims.mjs:106` d6c59925294c886493bf4c0f2aa8210254eb5a3a5706ab6a993f12ded2e3de2f
   - `engine/src/identity.rs:394-409` 3f38b3b2a61d6efc2b054394de59a8a95b488f0c5d7185db098764fd79fe88a4
   - `engine/src/identity.rs:397-403` f5ec377062f33dc3a43949f82ae7e06166856f24a0e03102796b78d8f9a6c284
   - `engine/src/identity.rs:353-357` 5306ced92be38dd94b2c6f3fa5dc196fe14b9c1b64d2ba76c5646bff29c63395
   - `kernel/tests/skp_admission_remediation.rs:300-304` 162b6a210603bf699df63856441a9a0463229ae7b223498c21dc83451d10754d
   - `kernel/src/skp.rs:1108` 773242bd546d8c460eeac591d79af6d6dfe15b77f11aa89415357d696c6dc419
   - `kernel/tests/skp_admission_remediation.rs:62-75` 49eda7e8733b72282d12584e66735d227fc371df28771e1dd98e79bc9e6dc3cf
   - `kernel/tests/skp_admission_remediation.rs:53-60` 23f6f9d57540b27a90b2320fa794a1eb530c57ba37d90e8b0fadf8adc6eed418
   - `kernel/src/skp.rs:1361` 548b28472bf350092a7c9c9e0e96b00073c8b85281e4798144d246c09e6c9113
   - `kernel/tests/skp_admission_remediation.rs:19-21` 364f55a4789a1a79b281ec72c1cf4d093162b0cb7f132a4c3a6ce9b85dfb2291
   - `engine/src/fixture.rs:549-568` f35deb432d3b6e788621a1dfc25c323b118e59639bfbd8ee4fda33e8edaa1029
   - `engine/src/fixture.rs:761-768` 0cd219facf002e658dd8735991cbefe787b0e8dd26498c29dc439ec23e8de7ff
   - `engine/src/fixture.rs:797-812` 03cc114ca33af26fdf8179f5c7d264b67e16750d3e85edb20dfdcbfb451a52ef
   - `kernel/tests/skp_admission_remediation.rs:275-285` 15ff99bf78396255b05e928b4c0b7ee5f13f2a0041b118e4f4e5cc0369363a6d
   - `protocol/skp/tests/fixtures.rs:905-919` dfac111f3d8fff51d3d15426ab87ab10ffd8e1a4fc89099b872b2b4ac5d83629
   - `protocol/skp/SKP-V0.md:734-735` 133c0bb0805975ab9374d7333250fde3794b281029eff505fa58c2842f9354eb
   - `engine/src/identity.rs:257` 04c7de6b72097e76263dc500d7d5b87aff1f51f1368f7885803eb2c3bb99a2a9
6. Next: the code of this piece, once C: is over its floor (ADV-2026-11-26-11), on the base §8 names.

Read the last amendment first.

Nothing above is edited.

## Amendment 7 — 2026-11-26 — the custodian's, before code: the recorded base, the literal's files at it, I5 to I7 read there, the base suites

*Written by the custodian before any code. References and figures only. The figures are a worker's (Sonnet), from its reads and runs at the base, and the custodian checked the base's commits and the out-of-Scope literal lines by git. Nothing above is edited.*

1. **The recorded base** (§8, the base paragraph) is e9bd248359fc9276f7fb94a3108b319ada561120, the head of `cut/identity-declaration-route-for-session-tier` on origin. It is the re-link's head e4e6493d (first parent), followed by four merge commits, each `git merge --no-ff --signoff` with no conflict:
   - 74fdddbc takes in PR 360's head 8d1f2f4e;
   - e2a7ea43 takes in PR 366's head e4116cad, the node `partitioned-ordinal-refusal-opens-the-identity-form`;
   - 8ff82cc6 takes in PR 365's head 639a96cc;
   - e9bd2483 takes in milestone 5 PR A's head 806ad308.
   - The recovery offer holds no `protocol/` place in it, so the order is A (Amendment 2 item 1).
2. **The literal** (Amendment 2 item 1, order A; Amendment 4's rule). At the base, `SKP_VERSION` is `skp/0.14` (`protocol/skp/src/v0/mod.rs` and `types.ts`), so this piece takes `skp/0.15`.
   - `git grep -l 'skp/0\.14'` at the base lists 59 files.
   - 27 are in §7's Scope.
   - Five more are source files outside Scope: `frontends/shell/src-tauri/src/commands.rs`, `frontends/shell/src/console/surfaceRegistry.ts`, `frontends/shell/src/skp/client.ts`, `protocol/skp/src/v0/error.rs` and `protocol/skp/tests/conformance/AMBIGUITIES.md`. The custodian read each line at the base. In the first four, the literal stands in a doc comment that names the version a member came in. In AMBIGUITIES.md it stands in prose about a fixture renumbered in the past. In none is it the version that a request, a fixture, a test or a constant carries, so Amendment 4's rule leaves all five as they are. That rule's examples name two of them, `commands.rs` and `client.ts`.
   - The rest, 4 form files and 22 state files, are records that cite the literal.
   - So no file is added to the Scope for the literal (class 9).
   - The conformance tree holds 69 occurrences: 65 in its fixtures, 3 in its README and 1 in AMBIGUITIES.md.
3. **I5 to I7, read at the base.**
   - **I5 does not fire.** App's dataset on the map, and `<AdmissionPanel>`'s element, stand in one scope. Their lines have moved from the cites at 6cf6140c: `App.tsx` 860 and 2287.
   - **I6 does not fire.** No test outside §7's Scope and Amendment 5 asserts an exact candidate list over a file that holds an integer column narrower than 64 bits. The same searches found the known in-Scope asserts, as a positive control.
   - **I7 holds.** The admitting arm admits exactly the eight integer widths, and the candidate filter still names only `Int64` and `UInt64`, as expected before the change.
   - **Seams.** Every seam of §10 and Amendment 5 has the signature the form writes, at the base. Lines that moved from the form's cites: `runAdmitPath` (`AdmissionPanel.tsx` 231) and `admitDataset` (`admitDataset.ts` 50). The code is written against the base, and the form's cites stay historical pins.
4. **The base suites**, run at e9bd2483 inside shared holds, with no app and no dev server started. Every run exited 0:
   - shell `npm run typecheck`, and `npm test`: 132 files, 1676 tests passed, none failed;
   - `cargo test --locked -p spatial-kernel --no-fail-fast`: 523 passed, none failed, 48 ignored;
   - its `skp_admission_remediation` test alone: 7 passed;
   - `cargo test --locked -p spatial-skp --no-fail-fast`: 63 passed, and its conformance test: 1 passed;
   - `cargo fmt --all -- --check`, and the same check in `src-tauri`.
   - Clippy is run by no workflow. It was run for information: 0 errors and 19 warnings.
5. **Next:** the code, on this base, in this piece's turn (ADV-2026-11-26-24 item 4). Its e2e runs wait under ADV-2026-11-26-19.

## Amendment 8 — 2026-11-26 — the custodian's, at the code: the build's head, the count (class 8), Amendment 7 item 2's literal figures corrected (class 3), one finding for the advisor

1. **The build's head** is 767033a25b0d2f231e91966378d874c58f56787f, on origin. It is five commits on the recorded base e9bd2483: f716d819 (P0), 721ee81c, 8db7a6ed, ca29d32c and 767033a2. The worker's report is filed at `state/consults/2026-11-26-identity-declaration-route-for-session-tier-build-worker-report.md`.
2. **The count** is §7's counting command at e9bd2483...767033a2: 1042 changed lines (863 added, 179 deleted) over 44 files. The custodian re-ran it. Against §7's 650 lines over 38 files this is class 8: 392 lines and 6 files over. Amendment 5 item 12 predicted about 908 over 44. §7's line is not edited.
3. **Amendment 7 item 2, corrected (class 3).** Its figures came from the phase 1 report and were not recomputed.
   - At e9bd2483, `git grep -l 'skp/0\.14'` lists 55 files, not 59.
   - 24 of them are in §7's Scope, not 27. The build touches every one of the 24.
   - The five source files outside Scope stand as item 2 names them. The build leaves them as they are.
   - The 26 records stand: 4 form files and 22 state files.
   - The conformance tree's 69 occurrences stand.
   - No file is added to the Scope for the literal (class 9).
4. **A finding, for the advisor.** Row I8 of `frontends/shell/MANUAL-WALKTHROUGH.md` quotes the old cost notice verbatim, and D3 replaces that notice. This form names only row I4 (Amendment 5), so the build leaves row I8 as it is. What the words commit does with it is the advisor's to say. It was put to the advisor on 2026-11-26.
5. **Next.** The build gates wait on §10's suites: the branch's CI, and E-1 as a tester's series, which waits under ADV-2026-11-26-19. The words commit waits on the advisor's words for D1 to D3 (Amendment 2 item 6).

## Amendment 9 — 2026-11-26 — the custodian's, under ADV-2026-11-26-28, before the words commit: the five strings' words, row I8 (class 9), Part AG's spans, the merge check, the class 8 record

1. **Authority.** The advisor's ruling ADV-2026-11-26-28 is filed at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-28-the-identity-routes-words-commit-d1-to-d3-as-ruled-row-i8-quotes-d3-part-ag-four-spans-and-the-mark.md`, under the human's delegation of 2026-11-13. It is not the human's words. The advisor read it at the branch's head 767033a2.
2. **The words** (its items 1 and 2).
   - D1, D2 and D3 are ADV-2026-11-23-26 item 2's texts, unchanged.
   - The legend and the hint are ADV-2026-11-26-04 item 4's, unchanged.
   - The words commit removes the placeholder mark and its space from those five strings and changes nothing else of them. Each stays whole on one source line.
   - The three source comments and the sentence of `frontends/shell/e2e/README.md` that call the strings placeholders until the words commit are corrected in the worker's words. The build gates read them.
3. **Row I8, class 9, declared before the words commit** (its item 3).
   - Row I8 of `frontends/shell/MANUAL-WALKTHROUGH.md` joins this piece's region of that file, which is already in Scope. Its quote becomes D3 by the Old and New of that item, byte for byte: one span inside the row's quotation marks, and nothing else of the row. No past result log is edited.
   - It adds about 2 lines to §7's count, and no file.
   - §9 item 18 (Amendment 5 item 14) then reads for both rows: row I4 or row I8 changed beyond its quote, or a past result log edited.
4. **Part AG** (its items 4 and 5).
   - The four spans of item 4 change, each Old text found once in its row or line: AG2's step, AG2's expected outcome, AG6, and the result log's AG2 line.
   - Item 5 removes the mark and its space from rows AG1 and AG2, in three places, before D1, D2 and D3. It also replaces the opening paragraph's span by its Old and New.
5. **The merge check** (its item 7). The advisor compares these byte for byte:
   - D1 to D4 with ADV-2026-11-23-26 item 2;
   - the legend and the hint with ADV-2026-11-26-04 item 4;
   - row I8's quote with its item 3;
   - Part AG with its items 4 and 5.
   - The build gates read each clause of the five strings, row I8 and Part AG against the head with the words commit in. A clause found untrue goes to the advisor unreworded.
6. **The class 8 record** (its item 6). The closing amendment names, file by file, where the lines above Amendment 5 item 12's prediction sit, against §7's count at the head with the words commit in.

## Amendment 10 — 2026-11-27 — the custodian's: PR A's new head taken in (ADV-2026-11-27-02 item 4; ADV-2026-11-23-15 item 4), before any gate

*References and hashes only. Nothing above is edited.*

1. **The merge.** PR A's head moved from 806ad30843269f8012ec1d89f0224703a8078ad7 to d6c2daf69eb500027197945f5a4302f0508e0f69 (its Amendment 12's unit-test parts; PR A's form, Amendment 13). The custodian merged d6c2daf69eb500027197945f5a4302f0508e0f69 into this branch at 912b3a2c204ac6613c10e75f09c39fb29663671c, with no conflict, giving 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9 on origin.
2. **What it brought.** By git, the patch-id of `git diff 912b3a2c204ac6613c10e75f09c39fb29663671c 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9` equals that of `git diff 806ad30843269f8012ec1d89f0224703a8078ad7 d6c2daf69eb500027197945f5a4302f0508e0f69`: the merge brought PR A's change unchanged (5 files changed, 131 insertions(+), 13 deletions(-)), and no line of this piece's own.
3. **§7's count** is read as before, at e9bd2483 and this branch's head, less the lines of `git diff 912b3a2c204ac6613c10e75f09c39fb29663671c 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9`, which are PR A's. This piece's own count stays as Amendment 8 records it. This is a reading, class 1; §7 is not edited.
4. **E-1 and both gates** read this head or a later one. Text-id takes 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9 in before its own gates (ADV-2026-11-27-01 item 7; ADV-2026-11-27-02 item 4).

Read the last amendment first.

## Amendment 11 — 2026-11-27 — the custodian's: the build gates in two parts (ADV-2026-11-27-08 item 3), before either gate

*References and hashes only. Nothing above is edited.*

1. **The ruling.** ADV-2026-11-27-08 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-08-readings-on-363-and-366-right-the-build-gates-of-the-identity-route-and-b-in-two-parts-a-starts-on-pr-as-head-the-order-for-the-places.md`), item 3: this piece's two build gates are held in two parts, as PR 361's narrow read was (ADV-2026-11-23-12 item 2). Its item 5 places their read parts after the case-fold gate and ahead of B's.
2. **What changes, with no line edited.** The list headed "Suites, green before either gate" changes in time only, and for its e2e item alone (the admission e2e suite with E-1, a tester's series). Every other item on that list stays green before the read part.
3. **The read part.** Each gate reads or runs everything that starts no app: the diff against this form; the unit tests and the mutations M-K1, M-S1, M-S2 and M-T1, observed again inside the machine's holds; and the clause checks of every ruled string and document (Amendment 9). Its report is filed as the read part, with its findings. M-E1 needs the app, so it belongs to the run part.
4. **The run part.** When the port has served the tester's series, each gate reads it and gives its verdict. Before that the gate is not complete and has no gate-log verdict.
5. **Findings of the read part** are corrected before the series runs, so that the series runs once, at the head the gates will pass. A correction that changes code is read by the same gate in its run part.
6. **The head** the read parts read is 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9 (Amendment 10 item 4), or a later head recorded by amendment.

Read the last amendment first.

## Amendment 12 — 2026-11-27 — the custodian's: the two read parts and ADV-2026-11-27-15, before the correction

*References and hashes only. Nothing above is edited.*

1. **The read parts** at 09dfe6b1de7b8b602ef4d67efa41a7d8e36ddcf9 are filed at `state/consults/gates/2026-11-27-identity-declaration-route-for-session-tier-build-gate-architect-read-part.md` and `state/consults/gates/2026-11-27-identity-declaration-route-for-session-tier-build-gate-reviewer-read-part.md`, with no gate-log row. The ruling on their four places is filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-15-the-identity-routes-four-places-d2-loses-its-whole-file-clause-row-i8s-note-by-one-span-class-9-the-known-limitations-comment-one-span-d-b-and-d-d-both-apply.md`.
2. **A ruled string changed after a gate's finding** (its item 1). The reviewer's C-1 found D2's clause on the whole-file check untrue for a typed name that is refused before the scan. D2 is now item 1's text, replacing the D2 of ADV-2026-11-23-26 item 2.
   - One span, the same in the constant `DECLARE_IDENTITY_FIRST_LINE` and in walkthrough row AG2.
   - The comment above the two constants is in the worker's words, read at the run part.
   - At the merge check, item 8 replaces ADV-2026-11-23-26 item 5 for D2.
3. **Class 9** (its item 2). Row I8's note joins the region by item 2's one span. §9 item 18 then reads as item 2 gives it: row I4 changed beyond its quote; row I8 changed beyond its quote and this span; or a past result log edited.
4. **Its items 3 and 4.** The KNOWN-LIMITATIONS comment under item 3 takes item 3's span. In `IdentityDeclarationForm.tsx`, the architect's D-b (its three spans) and the reviewer's D-d (in item 4's words) both apply.
5. **The correction** holds the gates' own words for the rest (item 5), and items 1 to 4, and nothing else.
   - The rest is the reviewer's D-a, D-b, D-c, D-e, D-f, D-h and D-j, and the architect's D-a.
   - The run part reads items 1 to 4 clause by clause at the corrected head, with item 1's comment.
6. **verify-mutation** (its item 6). At the run part, a gate says whether each of the three tests that D-f does not cover is this piece's to record. A check that still exits 1 at the corrected head is explained in the closing amendment, test by test.
7. **Text-id** (its item 7). Text-id's merge-in of the corrected head has a narrow read, which says whether its three places then hold the texts of items 1 and 2.
8. **What the read parts did not run at the head:** conformance on its own, clippy, the shell's `npm run verify` and CI's `node --test`. These run in the run part at the corrected head, with E-1 and M-E1, after the port series.

Read the last amendment first.
