*Filed by the custodian: the architect's draft preregistration for partitioned-ordinal-refusal-opens-the-identity-form, the refusal of a partitioned source whose remedy names a route that does not exist (ADV-2026-11-23-20 item 8; drafted under the re-aim its OPEN-1 recommends), dispatched at 2026-11-23T17:34:41Z. It read the repository at a12ab7e2 in a detached read worktree and ran nothing. Its run: Read 45, Grep 35, Glob 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T17:34:42Z to 2026-11-23T17:44:56Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 24600 bytes, sha256 b4662660d98b62386efca6447081a0b4101d056297edd576783a5059ef2a6e86, byte for byte, with one final newline added. Its form is filed beside it in the same commit.*

# A partitioned source's refusal names a route that does not exist (PLAN node `partitioned-ordinal-refusal-opens-the-identity-form`): preregistration, full form

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

---END OF FORM---

**Note (what the code could not settle; matters for the human).**

1. **Reach.** I could not settle from code whether the Windows picker, or a macOS or Linux one, can return a folder or a glob path. `commands.rs:319-331` calls `pick_file` with a `.parquet` filter. That a folder typed into the dialog opens the folder, and that `*` and `?` cannot appear in a Windows file name, are facts about the operating system and not this tree. The re-link's file route on PR 363 is unread. If the first read finds an ordinary route, OPEN-3 (b) becomes the recommendation and the grade in ADV-2026-11-23-20 item 8 should be read again.
2. **Before the change.** Whether, before R-I4, a folder with a declared mapping was refused as `engine.source` needs history, and I had no Bash. That history decides whether ADR-016 item 5's "untouched" was ever literally true. OPEN-4 does not depend on it.
3. **Authorship.** Whose wording D1's present text is (`error.rs:386-391` carries no attribution), and whether item 20 as it stands at a12ab7e2 is the human's wording from the click: the custodian confirms both from the ledger and the forms.
4. **The `skp/0.14` literal.** The recovery offer's 29 literal files are unread. If `formatRefusal.test.ts` is among them, it is a further shared path with that piece.
5. **Hashes.** No span hashes are in the form. The custodian adds them by script at a12ab7e2, which is on main.
6. **Nothing for the human by kind.** The piece adds no dependency, no lockfile change and no workflow change. Only OPEN-4, if it is ruled red-line, and OPEN-5, if the advisor declines it, go to the human.

Files read are all under `C:/dev/wt/read-1123x`. The ones the form leans on most: `engine/src/dataset.rs`, `engine/src/error.rs`, `kernel/src/skp.rs`, `frontends/shell/src/admission/formatRefusal.ts`, `frontends/shell/src/admission/AdmissionPanel.tsx`, `KNOWN-LIMITATIONS.md`, `docs/adr/ADR-016-stable-feature-identity-admission.md`.
