*Filed by the custodian: the architect's draft preregistration for identity-declaration-route-for-session-tier, a route to declare an identity column for a file opened on the session tier (the human's message of 2026-11-23 item 3 (d); ADV-2026-11-23-15 item 7 (d), the third gap piece), node:identity-declaration-route-for-session-tier@architect-draft-1, dispatched at 2026-11-23T14:20:28Z. It read the repository at 0bcf5434 in a detached read worktree and ran nothing. Its run: Grep 49, Read 42, Glob 2, SubagentHandback 1, by unique call ids, 2 calls errored; model claude-opus-5-5, from 2026-11-23T14:20:31Z to 2026-11-23T14:31:24Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 32981 bytes, sha256 643f39963baec344fa77fd9233e0c2c255e22b0ace69ea02933933109363213a, byte for byte, with one final newline added. Its form is filed beside it in the same commit.*

---

# A route to declare an identity column for a file opened on the session tier (PLAN node `identity-declaration-route-for-session-tier`): preregistration, full form

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

---END OF FORM---

Note (architect, not part of the form):

1. **Matter for the human.** The recommended answer (A) amends ADR-016. The text at `docs/adr/ADR-016-stable-feature-identity-admission.md:165` settles the list as "part of the refusal, not the record", and :151 names `describe.identity` as the record. An ADR amendment is a red line, so (A)'s code cannot start until the human accepts it. The advisor can answer OPEN-1, but cannot accept OPEN-2. If the human declines, (B) is the honest fallback with its drift risk named, not (C). (A) needs no dependency, lockfile or workflow.

2. **What I could not settle from the code.**
   - The recovery offer's and milestone 5's full file lists, so §8's "others" stay open for the custodian.
   - Whether the recovery offer bumps the literal. This piece's literal and its conformance renumber depend on that.
   - Whose wording the cost notice in `IdentityDeclarationForm.tsx:47-52` is.
   - Whether `projectable` is true for every Int64/UInt64 column the engine lists. This matters only under (B).
   - The `<details>` disclosure assumes WebView2 renders it natively, which holds for Chromium. E-1 proves it on the e2e host.

3. **Line count.** About 190 of the 650 lines are the literal bump. It is mechanical, but most of it lands in the three conformance fixture files, which every protocol piece touches. The custodian may want the advisor to see this before choosing (A).

4. **Adjacent finding, proposed as a node.** `engine.identity_ordinal_partitioned_unsupported`'s message tells the user to declare an identity column (`KNOWN-LIMITATIONS.md:283-286`). `formFamilyForCode` opens no form for that code (`frontends/shell/src/admission/AdmissionPanel.tsx:31-36`), so the user gets the same dead end on partitioned sources. This is a shell-only fix that reuses the refused-state form. It is not in this piece.

5. **Constitution check of the recommended design.**
   - docs/01's never-block rule holds: the declaration is an ordinary open, with Cancel and the liveness line.
   - The candidate list is a small metadata list on the control plane, never a data-plane payload, and not instrument surface under ADR-004 Amendment 4.
   - The ADR-006 class does not change.
   - No `docs/08` claim is made.
   - It is in scope for the prototype phase: the human placed the node.
   - The seam rule is met by K-1 and T-1 against one shared fixture file, and E-1 through the app.
   - The caller rule is met. The engine accessor gains a product caller, so its instrument doc must change in the same diff. The new member's product consumer is `identityDeclarationOffer`.
