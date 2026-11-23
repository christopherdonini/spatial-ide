# A partitioned source's refusal names a route that does not exist (PLAN node `partitioned-ordinal-refusal-opens-the-identity-form`): preregistration, full form

*Committed by the custodian on 2026-11-23 from the architect's draft (`state/consults/2026-11-23-partitioned-ordinal-refusal-opens-the-identity-form-architect-draft.md`; the hand-back 24600 bytes, sha256 b4662660d98b62386efca6447081a0b4101d056297edd576783a5059ef2a6e86): its text from the title to the line before its end mark, byte for byte, with this note put after the title. The note after the end mark stays in the consult. Read the last amendment first.*

**Path proposed:** `governance/forms/frontends/PARTITIONED-ORDINAL-REFUSAL-OPENS-THE-IDENTITY-FORM-PREREGISTRATION.md`. The node's lane is the shell (`governance/PLAN.yaml:7845`). The node id stays the same even if OPEN-1 re-aims it.

**Authority:**
- ADV-2026-11-23-20 item 8 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-20-the-identity-route-open-1-a-the-adr-016-amendment-the-advisors-open-3-to-5-a-the-partitioned-refusal-node-added.md:30-34`). It adds the node, builds it on the re-link's head ahead of the identity route's code, merges it after the re-link, and sets its class by ADV-2026-11-16-06 at this form.
- PLAN node `partitioned-ordinal-refusal-opens-the-identity-form` (`governance/PLAN.yaml:7842-7858`).
- The class rule: ADV-2026-11-16-06 item 2 (a) and (b) (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25-26`).
- The identity route's Amendment 2 section on this node. It is a reading, not Authority, and it is not on main at a12ab7e2. §0 checks it.
- The reuse index (tools/reuse.mjs in the read-only reuse clone at 89bbac37, run by the custodian on 2026-11-23) gave, byte for byte:
  `No prior art recorded for "partitioned source ordinal identity refusal remedy". Research it before planning an implementation.`
  This form records that miss. Its research is §0's reading of the code.

**Drafted by:** the architect, on the custodian's brief. I read only in the read worktree at main a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201, and every `path:line` below is at that commit. I had no Bash, so the custodian adds the span hashes by script. Every pin is historical: for the code, the build base (the re-link's head) is authoritative.

**Committed before any code.** Append-only once committed.

**Gating:** full form, both gates (§1).

**Merge:** after the tag, after the re-link (PR 363) and the bases it is built on (§9a).

## §0. Disclosure

Reasoned from code. Nothing was run.

**The drafter's reading holds, with one correction.**
- Every `Dataset` constructor calls `open_inner`: `engine/src/dataset.rs:223`, :237, :258, :279, :303. The kernel opens through `open_with_connections` (`kernel/src/lib.rs:204`) and `open_cancellable` (:227), and the host reaches the second through `Catalog::open_cancellable` (`kernel/src/skp.rs:1205-1207`).
- `open_inner`'s first act refuses a folder or a glob path with `IdentityOrdinalPartitionedUnsupported` (`engine/src/dataset.rs:327-329`). It decides by a stat and the path text alone (:1884-1917). Any other path that is not a file is refused at :330-335.
- **Correction:** :1961 is where `admit_identity` is defined. Its call, where `declared_identity` is first used, is :565. Both come after :327-329, so the conclusion stands: a declaration on a partitioned source is refused again with the same code.
- The kernel's `error_of` sets `message` to the engine's `Display` (`kernel/src/skp.rs:2139`), and maps the variant to the code with `detail` only (:2189-2192). SKP-V0 §5 makes `message` the verbatim `Display`, and clients build their UI from `code` and `fields` (`protocol/skp/SKP-V0.md:349-350`, :357-358).

**Where the untrue remedy appears:**
- the engine's message, `engine/src/error.rs:386-391`, whose last clause offers declaring an identity column;
- the variant's doc comment, which says the source "reached the session-ordinal path" (`engine/src/error.rs:182`), although the refusal comes before any identity path;
- the shell's guidance, `frontends/shell/src/admission/formatRefusal.ts:119-124`, and its doc, :61-62 ("names the two real routes forward");
- the test that names both as routes, `formatRefusal.test.ts:173-182`;
- KNOWN-LIMITATIONS item 20, which quotes the engine's message (`KNOWN-LIMITATIONS.md:283-286`; the item runs :280-294);
- the wire fixture `protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json:3`, whose tests check shape only (`protocol/skp/tests/fixtures.rs:221-242`; `frontends/shell/src/skp/__tests__/fixtures.test.ts:331-339`);
- SKP-V0's code entry, `protocol/skp/SKP-V0.md:734-735` ("reached the session-ordinal path").

**No test pins the message text** (I searched the tree for the message's phrases outside `state/`, `governance/` and `spikes/`).
- `kernel/tests/typed_terminal_codes.rs:386-404` checks only the code prefix.
- `kernel/tests/no_generation_in_persisted_artifacts.rs:358-411` scans the `Display` for the substring `generation`, ignoring case (:404). The new words must not contain it.
- The engine tests match the variant and `detail`: `engine/tests/session_identity.rs:266-278`, :284-289, :689-703.

**The node's first aim does not work.**
- The declaration form submits the same path again (`frontends/shell/src/admission/AdmissionPanel.tsx:575`), so it would be refused by :327-329 again.
- The form's candidates come from `candidate_columns` (:573), a field this refusal never carries (`kernel/src/skp.rs:2189-2192`).
- `formFamilyForCode` returning no family for this code (`AdmissionPanel.tsx:31-36`) is therefore correct (OPEN-1).

**Reach (not settled from code; see the note).**
- The shipped open goes through a native single-file picker filtered to `.parquet` (`frontends/shell/src-tauri/src/commands.rs:319-331`).
- A reopen refuses a data path that is not a regular file before any open (`kernel/src/project/resolver.rs:180-182`).
- The shell reaches this refusal only through the dev-only `openPath` hook (`AdmissionPanel.tsx:413-436`, gated at :420), or a folder or pattern path from a client other than the shell.
- Walkthrough Part N row N9 records that no partitioned fixture exists (`frontends/shell/MANUAL-WALKTHROUGH.md:960`).

**ADR text.** ADR-016 Amendment 1 item 5 says, of a partitioned source (`docs/adr/ADR-016-stable-feature-identity-admission.md:231-232`, sub-line): "Its existing declared-mapping route is untouched."
- If it means that a partitioned source can be admitted through a declared mapping, the code contradicts it (:327-329 before :565).
- If it means the single-file mapped route, it holds.
- No other accepted ADR in `docs/` speaks of partitioned sources. ADR-017's partitions are bundle output.
- This piece does not edit ADR text (OPEN-4).

**Intake:**

| Item | Disposition |
|---|---|
| The engine's message offers a declaration | In (§2.1, D1) |
| The variant's doc comment | In (§2.1) |
| The shell's guidance and its doc | In (§2.2, D2) |
| The test naming both routes | In (S1 replaces it) |
| KNOWN-LIMITATIONS item 20's quote of the message | In (D3; OPEN-5) |
| The wire fixture's message and SKP-V0:734-735 | Out under OPEN-2 (a): a finding for the next piece that holds `protocol/` |
| Opening the identity form for this code | Out under OPEN-1 (a) |
| Admitting a declared column on a partitioned source | Out: needs a file-list contract, which Amendment 1 item 5 declines (:232) |
| ADR-016 item 5's sentence | Out: OPEN-4, the advisor's |

## §1. What this preregistration may and may not claim

- **Class: full, both gates.** By ADV-2026-11-16-06 item 2, row by row:
  - (a) "anything on the wire": yes. The engine's `Display` is the wire's `SkpError.message` (`kernel/src/skp.rs:2139`).
  - (a) what the user is told about "a refusal": yes.
  - (a) "a piece that crosses a seam between modules": yes, the engine, a kernel test and the shell.
  - (a) the other rows do not apply: no ADR edit, no CRS, cancellation or undo change, no security posture, no persistence format, under 260 lines, not a release.
  - (b) "routine product code in one module": no, two modules. (b) "KNOWN-LIMITATIONS and docs wording" covers only one part of the piece.
  - ADV-2026-11-23-20 item 8 reaches the same answer: the piece crosses a seam.
  - The rule was put in force for a week from 2026-11-16 (item 0). I apply it because ADV-2026-11-23-20 item 8 does.
- **May claim** only:
  - the refusal's message and the shell's guidance offer no declaration, and state that a declaration does not change the refusal;
  - code, fields and refusal behaviour are unchanged.
- **May not claim:** any wire schema change (the code, the field and `SKP_VERSION` stay), any change to which paths are refused, any `docs/08` number, or that ordinary use reaches the refusal (§0, Reach).
- ADRs cited, none amended: ADR-016 (Amendment 1 item 5), ADR-004 (wire), ADR-010 rule 6.
- Every shown string is a draft for the advisor (§2.4). The human's ruling of 2026-09-16, round 7, that engine messages state engine facts and owners state consequences (paraphrase; quoted at `engine/src/error.rs:372-377`), shapes D1 and D2.

## §2. The change

### 2.1 Engine (`engine/src/error.rs`)
- The `IdentityOrdinalPartitionedUnsupported` arm of `Display` (:386-391) states D1, which carries engine facts only and no remedy. It ships under the placeholder mark `[P6 placeholder] `, as the coverage-lost text does (`kernel/tests/typed_terminal_codes.rs:371`), until the advisor words it (ADV-2026-11-23-20 item 6, following ADV-2026-11-23-16 item 10).
- The variant's doc (:182-188) says the refusal comes on every open path, before identity is read, with or without a declaration. It keeps the R-I4 reasoning for the session tier. The name, the code and the field stay.
- No other engine line changes. `open_inner`'s gate stays as it is.

### 2.2 Shell (`frontends/shell/src/admission/formatRefusal.ts`)
- The `engine.identity_ordinal_partitioned_unsupported` case (:119-124) returns D2 under the placeholder mark.
- The doc bullet (:61-62) says the guidance names the single-file route and that a declaration does not help.
- The source comment names the gap the human can see: the refusal is reached in the shell only through the dev-only `openPath` hook, or from another client (§0, Reach).
- `AdmissionPanel.tsx` is not edited, and `formFamilyForCode` keeps returning no family for this code (S2 guards it).

### 2.3 Records
- KNOWN-LIMITATIONS item 20 takes D3. Its comment re-pins the `Display` at the build base and names whose words are in the item (OPEN-5).
- No walkthrough row changes: N9 only asks the reader to look at item 20's wording (`MANUAL-WALKTHROUGH.md:960`).

### 2.4 Strings: drafts for the advisor (each one checked clause by clause against the code)
- **D1**, where it goes: `engine/src/error.rs:386-391`. It travels on the wire as `message`, is shown by `RefusalBlock.tsx:34`, and is quoted by item 20. Its wording is not marked as the human's at its site (the custodian confirms).
  > refused: this source is partitioned across more than one file ({detail}). This engine opens a single file only, and it refuses a partitioned source before reading it, whether or not an identity column is declared
  - "partitioned … ({detail})": unchanged from today's text.
  - "opens a single file only": `dataset.rs:330-335`.
  - "before reading it": the decision is a stat and the path text (:1884-1917, doc :323-326), at :327-329.
  - "whether or not an identity column is declared": :327-329 come before :565 on every constructor (:223-303).
  - No `generation` substring.
- **D2**, where it goes: `formatRefusal.ts:119-124`, shown by `RefusalBlock.tsx:46`. Today's text is one of the three placeholders "whose wording is not settled" (`formatRefusal.ts:67-70`). Not the human's wording.
  > This app cannot open a folder or a pattern of files, and declaring an identity column does not change that. Open a single file instead.
  - "cannot open a folder or a pattern of files": `dataset.rs:1885-1887` and :1907-1914. The shell has no other route (`commands.rs:319-331`; `admitDataset.ts:57`).
  - "declaring … does not change that": `AdmissionPanel.tsx:575` sends the same path, and `dataset.rs:327-329` comes before :565.
  - "Open a single file instead": a single file whose name holds `*` or `?` is still refused (:1907-1908). That case is named in the source comment, not in the string.
- **D3**, where it goes: KNOWN-LIMITATIONS item 20. The quoted message (:283-286) becomes D1's final words, and one sentence follows it:
  > Declaring an identity column does not change this: the refusal comes before any identity is read.
  - Checked against `dataset.rs:327-329` and :565.
  - Item 20 is the human's wording by the human's message of 2026-11-07 (`state/directives/2026-11-07-8g-open-1-b-adr-016-note-open-6-a-294-not-held-index-sites-narrowed-entry-13-x2-into-item-20.md:12`: the human said they would word item 20 at the click). See OPEN-5.

## §3. Fixtures, with outcomes declared before the run

- **K1's folder:** `target/fixtures/partitioned-refusal-remedy/parts/`, created by the test, holding one part written by `spatial_engine::fixture::write_geoparquet` with `IdentityMode::ForeignKeyColumn`, whose key is a unique `parcel_key` (`engine/src/fixture.rs:533-535`).
  - Predicted for the open with `identity: None`: refused, code `engine.identity_ordinal_partitioned_unsupported`, and `detail` ending "is a directory" (`dataset.rs:1886`).
  - Predicted for the open with `identity: Some({column: "parcel_key"})`: the same `SkpError`, byte for byte.
  - Nothing is hashed, because the test writes the folder fresh on each run.

## §4. Tests, and one mutation per new test

| Id | File, test | Red before the fix | Mutation (the named set) |
|---|---|---|---|
| K1 | `kernel/tests/partitioned_refusal_offers_no_declaration.rs` (new), `a_folder_opened_with_or_without_a_declared_identity_is_refused_by_name_and_offered_no_declaration` | (c) fails: today's message contains "or declare an identity column" (`error.rs:389-390`) | M-K1: put back the old last clause of D1. K1 fails at (c). M-K1b, recorded: guard the gate at :327 with `declared_identity.is_none()`. K1 fails at (a) for the declared open (`engine.source`). |
| S1 | `formatRefusal.test.ts`, replacing :173-182: `engine.identity_ordinal_partitioned_unsupported: names the single-file route and no declaration` | (2) fails on :123 | M-S1: put back :123's old sentence. S1 fails at (2). |
| S2 | `formatRefusal.test.ts` (new `it`, importing `formFamilyForCode`): the guidance and the panel agree, and no form opens for this code | green before (a guard, declared unchanged) | M-S2: map the code to `"identity"` in `AdmissionPanel.tsx:31-36` (the mutation is not committed). S2 fails. |

- **K1** goes through `SkpHost::open_dataset`, built as in `kernel/tests/single_file_bracket_name_open.rs:64-78`, with real `OpenDatasetRequest`s (`protocol/skp/src/v0/commands.rs:21-40`, :58-60). It asserts:
  - (a) the code, for both requests;
  - (b) a `detail` field on both;
  - (c) the message lacks "or declare an identity column";
  - (d) the two `SkpError`s are equal;
  - (e) the message equals the engine's `Display` for that `detail`.
  - **This is the seam's end-to-end test from the real shape.** The shell's side reads `code` and renders `message` verbatim (`RefusalBlock.tsx:30-34`), and that interface is unchanged.
- **S1** asserts: (1) the guidance is not null and matches /single file/i; (2) it lacks "or declare an identity column"; (3) it matches /does not change/i. Properties only, since the words are a placeholder.
- **Kept green with no edit:** `typed_terminal_codes.rs:386-404`; `no_generation_in_persisted_artifacts.rs:353-411`; `engine/tests/session_identity.rs` R-I4 tests; the count test at `formatRefusal.test.ts:197-207`; both fixture tests.
- The mutations are run and reverted by the worker, and each observed failure is recorded by name in the closing.

## §5. Predictions, what is declared unchanged, invalidators

- **Predicted:** K1 and S1 are red at the base and green after the change. S2 is green at both.
- **Declared unchanged:**
  - which paths are refused (`dataset.rs:327-335`, :1884-1917);
  - the code and its field (`kernel/src/skp.rs:2189-2192`);
  - `SKP_VERSION`;
  - `formFamilyForCode` and `nextFormFamily`;
  - `RefusalBlock`;
  - every protocol byte.
- **Invalidators (stop and report):**
  - I1: the declared open is refused with any other code.
  - I2: at the base, a test outside Scope pins the old message text. The worker runs `git grep -n -F "or declare an identity column"` first.
  - I3: the re-link's head changes `error.rs` :182-191, `formatRefusal.ts` :61-62 or :119-124, or item 20.
  - I4: D1's final words contain `generation`.
- **Falsification:** the preregistration is wrong if a declared column can admit a partitioned source anywhere in the engine.

## §6. Instruments

Assertions only: typed codes, field presence, equality and substring properties. No measurement, and no `docs/08` row.

## §7. Declared values and ceilings

- No new constant.
- **Size:** at most 200 changed lines, insertions plus deletions, over at most 5 files.
- **Scope, exactly:**
  - `engine/src/error.rs` (regions: :182-188 doc; :386-391 arm), about 15 lines;
  - `kernel/tests/partitioned_refusal_offers_no_declaration.rs` (new), about 110;
  - `frontends/shell/src/admission/formatRefusal.ts` (regions: :61-62; :119-124 and its comment), about 15;
  - `frontends/shell/src/admission/formatRefusal.test.ts` (regions: :173-182 replaced; S2 added after it), about 40;
  - `KNOWN-LIMITATIONS.md` (item 20 only, :280-294), about 10.
- **Counting:** `git diff --numstat <merge-base>...<head> -- engine/src/error.rs kernel/tests/partitioned_refusal_offers_no_declaration.rs frontends/shell/src/admission/formatRefusal.ts frontends/shell/src/admission/formatRefusal.test.ts KNOWN-LIMITATIONS.md`, at a named commit. `<merge-base>` is taken against `cut/relink-after-refusal` until it merges, then against `origin/main`.
- An overrun is class 8, and this line is never edited to match. A file added to Scope is class 9, declared by amendment before any code of it.

## §8. Block-on-sight

1. A diff outside §7's files, this form, PLAN and the records.
2. Any edit under `protocol/` (OPEN-2 (a)), or in `kernel/src/`.
3. `AdmissionPanel.tsx`, `RefusalBlock.tsx` or `IdentityDeclarationForm.tsx` changed.
4. The refusal's code or fields, or the gate at `dataset.rs:327-335`, changed.
5. A shown string committed without the placeholder mark before the advisor's ruling on its words, or a words commit with no filed ruling behind it.
6. A test that asserts a placeholder string byte for byte.
7. Any ADR text edited.

## §9. Gates

- **Architect:** this form. Then the build, checked against ADR-016 Amendment 1 item 5, rule (00) and the seam rule, using K1.
- **Reviewer:** the full diff, the clause checks in §2.4, and the observed mutations.
- **Suites:**
  - `cargo test -p spatial-engine` for the `error.rs` module;
  - `cargo test -p spatial-kernel --test partitioned_refusal_offers_no_declaration --test typed_terminal_codes --test no_generation_in_persisted_artifacts`;
  - the shell's vitest run of `formatRefusal.test.ts` and `fixtures.test.ts`;
  - verify-cites, verify-quotes and the `node --test` scripts suite.
- **Operator:** no Part (OPEN-3).

## §9a. Overlap and merge order

| Path | Shared with |
|---|---|
| `KNOWN-LIMITATIONS.md` (item 20 only) | PR 358, the re-link, colour-by-refill (items 51, 61), scale display (a new item), the recovery offer (43, 70, 76), milestone 5 (new items), the identity route (item 3). All are separate items. |
| `formatRefusal.ts` | the recovery offer (its four new cases). Disjoint regions by symbol (ADV-2026-11-16-06 item 4). Whichever piece goes later takes main in before its gate. |
| `engine/src/error.rs`, `formatRefusal.test.ts`, the new kernel test | no held piece names them. PR 350 holds `engine/tests/`, two named kernel test files, and none of these. |

- **Rule (00)** (`governance/AUTONOMY.md:609`): under OPEN-2 (a) the piece touches no `protocol/`, wire fixture or lockfile, so it does not wait for the `protocol/` place.
- **Base:** the re-link's head (ADV-2026-11-23-20 item 8; ADV-2026-11-23-15 item 4). Under OPEN-1 (a) it no longer touches `AdmissionPanel.tsx`, so the identity route does not need to build on it.
- **Merge:** after the tag, PR 353, PR 358, PR 359 and the re-link.

## OPEN questions (to the advisor in one message, ADV-2026-11-23-15 item 8; the form's gate does not wait)

- **OPEN-1, the aim.**
  - (a) Re-aim the node to correct the remedy, as this form is drafted. **Recommended**: the remedy is untrue on every route (§0).
  - (b) The node's first aim, opening the identity form for this code. Refused: the form sends the same path and is refused again (`AdmissionPanel.tsx:575`; `dataset.rs:327-329` before :565), and its candidate field is absent (`skp.rs:2189-2192`).
  - Under (a), the custodian re-titles the PLAN node's title and summary as a records change.
- **OPEN-2, the wire fixture and SKP-V0:734-735.**
  - (a) Leave their bytes, and record them as a finding for the next piece that holds `protocol/`, the identity route by ADV-2026-11-23-20 item 7, which adds them by class 9. **Recommended**: their tests check shape only, and the piece does not wait.
  - (b) Edit them here. The piece then waits for the place after the re-link and after whichever of the identity route and the recovery offer holds it.
- **OPEN-3, e2e and operator Part.**
  - (a) Neither. K1 is the seam's test from the real shape, and the gap goes in D2's source comment. **Recommended**: no ordinary route is known to reach the refusal (§0, Reach), and §31 does not let a dev-only route block.
  - (b) A step through the dev-only `openPath` hook in a new suite. It adds a suite file and an `e2e/README.md` entry, a path shared with PR 359, the re-link, colour-by, the scale display, the recovery offer and the identity route.
- **OPEN-4, ADR-016 Amendment 1 item 5** (:231-232). Whether a note is owed, and whose it is: the advisor's under the grant's item 2, as ADV-2026-11-23-20 item 2 ruled for ADR-016, or the human's as red-line text. Recommended: a note, appended and never edited in. Draft for the advisor:
  > Note: item 5's "existing declared-mapping route" is the route for a single file. A partitioned source is refused by name before any identity is read, with or without a declared column; no route admits it.
  - Checked against `dataset.rs:327-329` and :565.
- **OPEN-5, item 20's words.** Item 20 is the human's wording (§2.4, D3). Recommended: the advisor words D3 under the grant's item 2, as ADV-2026-11-23-20 item 6 did for item 3, and the item's comment says which sentence is the advisor's. The alternative is that the human words it.

## §10. Amendments (opens empty, append-only)

## Amendment 1 — 2026-11-23 — at the first commit: the authority on main, the node's gate, the span hashes, a quotation, the OPEN items

*Written by the custodian at the form's first commit, before any code and before any gate. References and hashes only.*

1. **Authority on main.** The advisor's ruling ADV-2026-11-23-20 is filed at `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-20-the-identity-route-open-1-a-the-adr-016-amendment-the-advisors-open-3-to-5-a-the-partitioned-refusal-node-added.md` and ADV-2026-11-23-22 at `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-22-the-bullet-as-ruled-op6-accepted-no-narrow-read-the-third-place-takes-work-5260-not-accepted-yet-c2-fix-i.md`; the human's message of 2026-11-23 at `state/directives/2026-11-23-the-humans-message-never-idle-product-first-what-to-build-now-the-pauses-lifted-for-product-pieces-what-does-not-change.md` and ADV-2026-11-23-15 at `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-the-humans-message-filed-the-relink-built-now-on-three-held-heads-two-forms-now-the-gap-pieces-the-sitting-hour.md`. The draft is filed at `state/consults/2026-11-23-partitioned-ordinal-refusal-opens-the-identity-form-architect-draft.md`. The identity route's Amendment 2, which the form's Authority names as not on main at a12ab7e2, was filed in `governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md` at 5bc4011b.
2. **The node's gate.** In the same commit the PLAN node `partitioned-ordinal-refusal-opens-the-identity-form` names this form as its gate. Its class, full with both gates, is the drafter's reading of ADV-2026-11-16-06 item 2, as ADV-2026-11-23-20 item 8 asks; the form gate checks it.
3. **Span hashes.** Every `path:line` cite above is read at a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201. Each entry below names the file and lines a cite is read as, the sha256 of those lines at that commit (each line with its LF, computed by script), and the sections that cite it. A short name is read as the one tracked file it names; a bare `:n` as the file named before it in the same passage; an entry marked (r) was read by the custodian against the file its sentence or list names.

- `governance/PLAN.yaml:7845` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:b11b9ef9388e5bd72eaf116e706342143554ab900d39e5f41592f565a0f7677d — the header
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-20-the-identity-route-open-1-a-the-adr-016-amendment-the-advisors-open-3-to-5-a-the-partitioned-refusal-node-added.md:30-34` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:c29391b07edfc7fa5e1c8269435625c35eace9b0c23163c9f59286c7c0de655b — the header
- `governance/PLAN.yaml:7842-7858` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:8651e57f493e8f5cd2a8bc2de3a3c57d85f3cf5290876719d574ef5ef4791a39 — the header
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25-26` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:afffe763f82036468ccd49d723a8878e7394c06e27587a2b245b02a987835484 — the header
- `engine/src/dataset.rs:223` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:80a712fa5a614374dc13ea2aa32ed6cdf6c16143b7caf2231f50ed1f687ce9bd — §0
- `engine/src/dataset.rs:237` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:80a712fa5a614374dc13ea2aa32ed6cdf6c16143b7caf2231f50ed1f687ce9bd — §0; as written `:237`
- `engine/src/dataset.rs:258` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:80a712fa5a614374dc13ea2aa32ed6cdf6c16143b7caf2231f50ed1f687ce9bd — §0; as written `:258`
- `engine/src/dataset.rs:279` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:80a712fa5a614374dc13ea2aa32ed6cdf6c16143b7caf2231f50ed1f687ce9bd — §0; as written `:279`
- `engine/src/dataset.rs:303` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:80a712fa5a614374dc13ea2aa32ed6cdf6c16143b7caf2231f50ed1f687ce9bd — §0; as written `:303`
- `kernel/src/lib.rs:204` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:ccb498eeec5fe0058cc6f965922eeeec3ac43d9e82df6cc035a20d0eca74c95b — §0
- `kernel/src/lib.rs:227` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:87e202cf68c14697a28e0eea4b897ae627feeeaf5d0c753194268bbf92c234c1 — §0; as written `:227`
- `kernel/src/skp.rs:1205-1207` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:fff4b87012c2b5fd2b980119d47b0d3cbe10a021d8033874a0715d0f7c1c2ff3 — §0
- `engine/src/dataset.rs:327-329` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:d1a7cf72b1130653d6da62a02413e06cdd3eb53a0711b3f1b1d4f85a02fd6b16 — §0, §2.4, OPEN questions; as written `:327-329`, `dataset.rs:327-329` (r)
- `engine/src/dataset.rs:1884-1917` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:f112358cba67a33a8b47d7bfc378f2c9e75f24882662f0d896ce7116084a70ab — §0, §2.4, §5; as written `:1884-1917`
- `engine/src/dataset.rs:330-335` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:26a2871fb2b07ced4da1e21c03c8f72e41fdad99a12591e13b23b1d7c0781162 — §0, §2.4; as written `:330-335`, `dataset.rs:330-335`
- `engine/src/dataset.rs:1961` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:666448289e8ff51f0b0e70c3bbdb7bb7b145e91b8466df40808793f28760f8fb — §0; as written `:1961`
- `engine/src/dataset.rs:565` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:ee241c0c0e44651c664dc54964cc315ece35ee801bec17d72d210477ca4c9f68 — §0, §2.4, OPEN questions; as written `:565` (r)
- `kernel/src/skp.rs:2139` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:41fe00b906e37a64d0178c4e211657f2561c246f89bbe417bd4645c5dfeb51c1 — §0, §1
- `kernel/src/skp.rs:2189-2192` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:071d32c0539426e6222c45f08077e7ac1745f9c7c439809e419b72cea51c5beb — §0, §5, OPEN questions; as written `:2189-2192`, `skp.rs:2189-2192`
- `protocol/skp/SKP-V0.md:349-350` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:8363598a8624e8a2af14e065f498efa55dc6c311d0c3c6947cd629ae00de9157 — §0
- `protocol/skp/SKP-V0.md:357-358` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:479e55362a296f0b9ebf9cf29fd72bc4435805fd1364fa970f7b249c2e886874 — §0; as written `:357-358`
- `engine/src/error.rs:386-391` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:26ebfe880888e518236a7338f573806b639a7a585a25aa1612b4217c48fdf6d4 — §0, §2.1, §2.4, §7; as written `:386-391` (r)
- `engine/src/error.rs:182` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:b8e60489a026f066e0b105c3bf806036c113ae18e82c675da870344a62b07362 — §0
- `frontends/shell/src/admission/formatRefusal.ts:119-124` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:ee34d62a0511e2cc86f782b3645e0ef60f3e6cc48af73580c3e172dbfe6f33ad — §0, §2.2, §2.4, §5, §7; as written `:119-124`, `formatRefusal.ts:119-124` (r)
- `frontends/shell/src/admission/formatRefusal.ts:61-62` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:98b0633313e88ad26f9c790f6df6a9cad089f792083e8b111705ad3ccf89539a — §0, §2.2, §5, §7; as written `:61-62` (r)
- `frontends/shell/src/admission/formatRefusal.test.ts:173-182` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:d07377ad96c6537910daa3be70f16b32c41ea9a5aacecec8e6acefa42120fa1f — §0, §7; as written `formatRefusal.test.ts:173-182`, `:173-182` (r)
- `KNOWN-LIMITATIONS.md:283-286` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:92ac89f616faa7e9247e12577d061df660eb4634a018b835c89d65e601502b1e — §0, §2.4; as written `:283-286` (r)
- `KNOWN-LIMITATIONS.md:280-294` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:d82de263af906cfb839327bc305eb6eca413ffd4c89d6d549df21775b2ea86cf — §0, §7; as written `:280-294` (r)
- `protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json:3` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:dd089ef56e59ea297403f384b6c083b9bcec2aa7826b8f76424ca4a463332322 — §0
- `protocol/skp/tests/fixtures.rs:221-242` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:7ee087bc9817ab6ff9cdb22f28de4059b3c420e223e77e4e7a9678058f15f4c2 — §0
- `frontends/shell/src/skp/__tests__/fixtures.test.ts:331-339` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:1a5ea59247b4f029685f4c55d173b7528c73b4168249d82dafa19ae4873e6483 — §0
- `protocol/skp/SKP-V0.md:734-735` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:133c0bb0805975ab9374d7333250fde3794b281029eff505fa58c2842f9354eb — §0
- `kernel/tests/typed_terminal_codes.rs:386-404` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:f21430e32c162509ba2a4769eed65e3e284541d92ff7eaaa43c9ec58b4a6b06a — §0, §4; as written `typed_terminal_codes.rs:386-404`
- `kernel/tests/no_generation_in_persisted_artifacts.rs:358-411` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:3edc5609b15e19f517a6daacf3c63ca85ab57f4073736e13309abf8f32c99853 — §0
- `kernel/tests/no_generation_in_persisted_artifacts.rs:404` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:416a909c920d9d6a00a795a1e3bb5ae4f79a109529cfde1dfbba2e1b761b8e6e — §0; as written `:404`
- `engine/tests/session_identity.rs:266-278` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:1de3a680e9ecf80774446154b563ea4080f7278848ca43c1b93a2c9080b1fcbb — §0
- `engine/tests/session_identity.rs:284-289` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:0985bf3baf9324d1ea5ba0f1aa4b84b08e0bb36c361bd5e9a10a8feaffdb05f7 — §0; as written `:284-289`
- `engine/tests/session_identity.rs:689-703` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:3c22a3c4397bc343026f012c68232bfbd4a11c35370cd5aafd84b60f0efbe0d8 — §0; as written `:689-703`
- `frontends/shell/src/admission/AdmissionPanel.tsx:575` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:61fd3f1e6efc7af41fbff89e8264f8308baad116a2de09ac347cbcfd04602f8b — §0, §2.4, OPEN questions; as written `AdmissionPanel.tsx:575`
- `frontends/shell/src/admission/AdmissionPanel.tsx:573` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:df9ec17da3a0226582483044030d1182cd729efe7b5d366555c138d6142643a1 — §0; as written `:573`
- `frontends/shell/src/admission/AdmissionPanel.tsx:31-36` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:5420d562e2298f61372088b2d7ad273af0004b7d8304b2f0daf79ad86ef0015f — §0, §4; as written `AdmissionPanel.tsx:31-36`
- `frontends/shell/src-tauri/src/commands.rs:319-331` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:f9f7f5db4fe613707249e0bfe89f5c5bfde8112a8e3c61bb3dba2d98fc5fbfe3 — §0, §2.4; as written `commands.rs:319-331` (r)
- `kernel/src/project/resolver.rs:180-182` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:5c1d559a74815806b532229cc2a717bd2b42d59364392ac246e71ba4381b4bb2 — §0
- `frontends/shell/src/admission/AdmissionPanel.tsx:413-436` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:7efbe05b9dd85223d3844046f771421746f45a50dc75a97e7f4fe0bb03de3ea4 — §0; as written `AdmissionPanel.tsx:413-436`
- `frontends/shell/src/admission/AdmissionPanel.tsx:420` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:060ed57b9e2e01c75494c508b61f359a35022e98dee4c63dee1cb0090a33dd95 — §0; as written `:420`
- `frontends/shell/MANUAL-WALKTHROUGH.md:960` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:28f62cf169739ba7de093c1b9ac01a0986a919321367e248e049d5037590b8e4 — §0, §2.3; as written `MANUAL-WALKTHROUGH.md:960`
- `docs/adr/ADR-016-stable-feature-identity-admission.md:231-232` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:c6b526907f22aac1275b488cac4995f9a7436bd6a6e2180e1e3f15b7d8ee48e4 — §0, OPEN questions; as written `:231-232` (r)
- `docs/adr/ADR-016-stable-feature-identity-admission.md:232` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:d1b332bf260344f52a9716de426cc0c6ef7f07709858f86faf90fbb844053f49 — §0; as written `:232`
- `engine/src/error.rs:372-377` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:80fb5da30ecd12d363eb87b36a99b29ec8bb4f2c050a289f8fb458b517a9e038 — §1
- `kernel/tests/typed_terminal_codes.rs:371` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:8efda484a80c8c1a1481e67fe9ccb3dc9b249fdcfeee9bc0b3e1d63ee69f9da9 — §2.1
- `engine/src/error.rs:182-188` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:fa5bd32d05c6b08903add29e1b49d25a266a376164d815c8aaff64c17483a25d — §2.1, §7; as written `:182-188` (r)
- `frontends/shell/src/admission/RefusalBlock.tsx:34` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:67110e27507ed72189da4a326e74f5e8d1645fface69e3ef3b0ce1198b823213 — §2.4; as written `RefusalBlock.tsx:34`
- `engine/src/dataset.rs:323-326` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:da2f101d7ea55396c5fcdee3e9b38657805d0944908dd272882404e62fad7a0f — §2.4; as written `:323-326`
- `engine/src/dataset.rs:223-303` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:e6be37d10195fa967afaed1958c2e461a5a91ccb8e3db4ad45593f5382eb75dd — §2.4; as written `:223-303`
- `frontends/shell/src/admission/RefusalBlock.tsx:46` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:11c6026d9d20519007b13ddec30c85b6f248e8e78e3b661ab089471cfd2f69c3 — §2.4; as written `RefusalBlock.tsx:46`
- `frontends/shell/src/admission/formatRefusal.ts:67-70` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:63b08760f86a1baaef4fe74545cbc979fae6cf0ae858ca393af80cfc3ecce6a6 — §2.4; as written `formatRefusal.ts:67-70`
- `engine/src/dataset.rs:1885-1887` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:13a6ecfa207eace02a72d3ef1d7678b0e3bbfdf2cf4f78d7a3f576faca92b0a9 — §2.4; as written `dataset.rs:1885-1887`
- `engine/src/dataset.rs:1907-1914` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:1a2fece52172dacc3ad866838b0fb736f083f26f5db0898f2ec701dcdee639ce — §2.4; as written `:1907-1914`
- `frontends/shell/src/admission/admitDataset.ts:57` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:289480718d0921d11fbd9a989e44e223abb425cb35f32359c14c47add6018279 — §2.4; as written `admitDataset.ts:57`
- `engine/src/dataset.rs:1907-1908` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:7b0745b9154db2adde9f4c9f438ef761a28650dc44eee97e3c5b34d495515921 — §2.4; as written `:1907-1908`
- `state/directives/2026-11-07-8g-open-1-b-adr-016-note-open-6-a-294-not-held-index-sites-narrowed-entry-13-x2-into-item-20.md:12` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:da0f5dca894d261e6654d1ea0941c27f3c861b563ce6af07803e8a10824c80b9 — §2.4
- `engine/src/fixture.rs:533-535` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:2277a21d55085b07b71045426c07ea2ad19074616450a2c9c87ec5c4b6dd94f4 — §3
- `engine/src/dataset.rs:1886` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:62727cdef5b0f6ee01e9749a8a5b75fcccc7e031aa86215ec27d761ae63c6164 — §3; as written `dataset.rs:1886`
- `engine/src/error.rs:389-390` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:214f539a2b7d84f0f05472cf780bcbed53bebb253ad0aa90b6e7b8a6cbaf2230 — §4; as written `error.rs:389-390`
- `engine/src/dataset.rs:327` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:4d400da385a84e08f4d327ade44f4366eecb24aae88bc4dfca4de65847effbc5 — §4; as written `:327` (r)
- `frontends/shell/src/admission/formatRefusal.ts:123` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:33b059cfd39a8e85132facb40d6a4a0e90168eb5a16a95230d16b9da3a7fb4c0 — §4; as written `:123` (r)
- `kernel/tests/single_file_bracket_name_open.rs:64-78` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:e33754aa288fe536807b9c107a516ce2e819c1b4543091ffd206314d5f046647 — §4
- `protocol/skp/src/v0/commands.rs:21-40` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:f4b27fbea8752dd7f4a7217e0eff63170a758d8d7ca6fb803d34312118359763 — §4
- `protocol/skp/src/v0/commands.rs:58-60` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:95a6882a72052191150b501b021a674f8d0a8dbf3e31f13d83948526433a1126 — §4; as written `:58-60`
- `frontends/shell/src/admission/RefusalBlock.tsx:30-34` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:36445a7a35ada4f53169299e5872d39bd70ffd67b1ced2547fd1ffe0e8135a0c — §4; as written `RefusalBlock.tsx:30-34`
- `kernel/tests/no_generation_in_persisted_artifacts.rs:353-411` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:8711870c0a16921433e09aa92459274a846390769feb02f776aa97f4862a70e7 — §4; as written `no_generation_in_persisted_artifacts.rs:353-411`
- `frontends/shell/src/admission/formatRefusal.test.ts:197-207` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:25510122330b8243e2315da62a6390b2eedac22e3bd54573faefd745ba2c5c68 — §4; as written `formatRefusal.test.ts:197-207`
- `engine/src/dataset.rs:327-335` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:600462baf4b6189b562498ff8a488929e0f009f8afc037fd335d9e6cb47599ae — §5, §8; as written `dataset.rs:327-335`
- `engine/src/error.rs:182-191` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:019a0315e941475cc79b75083fc8e9eacc1da61571d75d503e9b93caa5d8f71a — §5; as written `:182-191` (r)
- `governance/AUTONOMY.md:609` @ a12ab7e212af4dd7d1ba0f25d0fcf7149fc9a201 sha256:db1a80acb95c7872de091ec4a4eb9647e09c17b0a5475050b4d934e0a39e2bd0 — §9a

4. **A quotation.** §2.4's D2 bullet puts the pronoun whose where its cited lines, `frontends/shell/src/admission/formatRefusal.ts:69-70`, have their; the rest of that phrase is the source's. Three other phrases it quotes, at `engine/src/error.rs:389-390`, `protocol/skp/SKP-V0.md:734-735` and `docs/adr/ADR-016-stable-feature-identity-admission.md:231-232`, run across a line break in the source and match once it is closed; the error.rs phrase is the message's text after the line continuation.
5. **OPEN items.** OPEN-1 to OPEN-5, and the note's items 1 to 4, go to the advisor in one message (ADV-2026-11-23-15 item 8). Their answers come as later amendments; the gates do not wait for them.

Read the last amendment first.

Nothing above is edited.
