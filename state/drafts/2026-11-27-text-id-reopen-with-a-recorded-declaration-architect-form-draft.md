# The architect's form draft for C1's follow-up piece, text-id-reopen-with-a-recorded-declaration

*Filed by the custodian, 2026-11-27, as a draft: it is not a form, binds nothing and takes no gate-log row. It answers ADV-2026-11-27-22 item 4 (text-id's Amendments 15 and 16), node:text-id-reopen-with-a-recorded-declaration@form-draft. The architect read the code and ADR-016 at text-id's corrected head 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e in the detached read checkout D:/wt/read-1127b, and the governance at main 156559cbd86818212e2180baac13c2ab98f30314 in D:/wt/read-1127c, both read only; the custodian checked both HEADs by git. Its run, from its completion notice only (ADV-2026-11-26-02), was 46 tool uses. Its own list of files read, at the end, names eleven files: it does not name the template, the ruling or the two read parts that its header says were read at main, and the custodian cannot check which. Its OPEN-A1 to OPEN-A5 are the advisor's. Its §8 overlap rows are the custodian's, by git, before the form commits. Below the rule, the draft as handed back (saved by Write with the harness's indent removed; 27240 bytes, sha256 0a96aec0af350953ad91553c9d58975c703cab594ea2354d217ed5a692578cb9), byte for byte.*

---

FORM DRAFT: text-id-reopen-with-a-recorded-declaration, drafted at base 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e (text-id's corrected head, a branch commit), with the governance read at main 156559cbd86818212e2180baac13c2ab98f30314

# Preregistration: text-id-reopen-with-a-recorded-declaration (full form)

*Everything below is paraphrase unless it is marked verbatim. The verbatim spans are byte-copied from my own Reads at the base. Rulings are cited by id and item. Text-id's form is cited by section and amendment.*

- **Proposed path:** `governance/forms/frontends/TEXT-ID-REOPEN-WITH-A-RECORDED-DECLARATION-PREREGISTRATION.md`
- **Node:** `text-id-reopen-with-a-recorded-declaration` (custodian's PLAN node; no line cite).
- **Authority:**
  - ADV-2026-11-27-22 item 4: C1 is a gap in text-id's form, and a follow-up piece with a full form and both gates closes it.
  - Text-id's form, Amendments 13 (C1 as found), 15 item 3 (class 2) and 16. Amendment 16 is not on main at 156559cb (see "Not read").
  - ADR-016 Amendment 3, Decision 1 (Accepted 2026-11-26; on the base, not yet on main).
- **Reuse index:** the output below is carried byte for byte, as the custodian gave it, from tools/reuse.mjs in the read-only reuse clone at 89bbac37, run by the custodian on 2026-11-27:
  `No prior art recorded for "the choice to open by row position at a reopen whose project file records a declared identity column". Research it before planning an implementation.`
  It is a miss. Nothing is reused. The mechanism is drafted from this repository's code alone.
- **Drafted by:** the architect, on the custodian's brief. The code and ADR-016 were read at the base, and the template, the ruling and text-id's form at main 156559cb. **Every `path:line` in this form is at 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e unless it names another commit.** No cite carries a hash, because the base is not on main (round 15 (e)).
- **Committed before any code.** It is append-only once committed. An amendment made after any outcome has been seen says so in its first line.
- **Gates:** architect and reviewer. Full form, because the piece touches the wire (ADV-2026-11-27-22 item 4).

## §0 Disclosure

**C1, as the code stands at the base:**
- At a reopen, the kernel sends the project file's recorded `crs_assertion` and `identity`, together with the caller's `set_aside_file_id` (`kernel/src/project/mod.rs:821-831`). It reads the project file afresh at each call (`:720-726`).
- An engine refusal passes to the shell unchanged (`kernel/src/project/mod.rs:971-973`).
- The engine refuses a declared column `id` and the file's own `id` with the same shape. Both are `IdentityUnusable { column: "id", detail, candidate_columns }`:
  - the type site, `engine/src/identity.rs:382-390`;
  - the scan sites, `engine/src/dataset.rs:2154-2176`.
  - The engine knows which it checked (`IdSource::Mapped` against `IdSource::File`, `dataset.rs:2046-2060`), but the variant does not carry that fact (`engine/src/error.rs:164-168`).
- The wire fields of that code are `column`, `detail` and `candidate_columns` (`kernel/src/skp.rs:2248-2262`).
- The shell's offer reads the refusal's code and `column`, and the run's own `options.identity` (`frontends/shell/src/admission/AdmissionPanel.tsx:224-231`). At a reopen, `options.identity` is never set: the recorded claims are the kernel's to send (`frontends/shell/src/project/openProject.ts:69-73`).
- So a reopen whose project file records a declaration of `id` is offered the choice. The engine then refuses it as S-6b, because a declaration was sent beside the choice (`dataset.rs:2027-2033`). Nothing opens wrongly. The offer departs from ADR-016 Amendment 3, Decision 1 (`docs/adr/ADR-016-stable-feature-identity-admission.md:302`).

**Reach** (my reading; the declaration form was not read):
- A project file records a declaration of `id` in three ways: it is edited by hand (project files are plain text, docs/01), it is written by another client, or the data file changed between a refusal and a declaration.
- A recorded declaration of `id` then meets a data file whose `id` cannot serve. That happens when the data file changed after the save.
- A hand edit is ordinary use, so the case blocks under §31 and is not excused as timing.

**The two ways, and the fact each needs.**
- **(a) The offer is not made at such a reopen.**
  - *Fact needed:* whether the `id` that was refused was the file's own column, checked with no declaration, or a column named by a declaration. At a reopen, that declaration is the project file's.
  - *Where it comes from:* the engine, at its refusal. Only the engine knows which source it checked, and SKP-V0 §5 has a code's fields carry "that variant's own named fields" (`protocol/skp/SKP-V0.md:364-365`, paraphrase).
  - The kernel could also derive the fact from the request it built, but then the kernel would mint a field on an `engine.*` code, which §5 does not allow. Not chosen.
  - *Crosses the wire:* yes. It is one new field on `engine.identity_unusable`. Under SKP-V0 §4 item 13, any field change is a new version string (`SKP-V0.md:312-316`), so the piece needs a new literal. `skp/0.16` freezes when text-id merges (`:318-328`), and this piece merges after it, so the literal is `skp/0.17`.
  - No route avoids the wire. The shell does not read the project file (`openProject.ts:5-6`; docs/02), and any signal from the kernel to the shell is a wire fact.
- **(b) The choice opens the file without the recorded declaration.**
  - *Fact needed for the offer:* none. The shell offers as it does today, and the kernel drops the recorded `identity` when `set_aside_file_id` is true.
  - *Crosses the wire:* not for the offer. But three things follow:
    - S-8's second clause, that the open was tried with the claims the project file recorded and with the choice (`frontends/shell/src/project/reopenNotices.ts:108`), becomes untrue in that case.
    - A later save records `"identity": null` in place of the declaration. That is what a save after a set-aside open records (text-id §4, K-4). Whether a save after a reopen keeps the recorded admission or the open's was not read (`kernel/src/dataset_ref.rs`).
    - Telling the operator that a recorded declaration was dropped needs a fact on the `opened` reply. That fact would cross the wire, unless the reopen's `check.admission` already names it, which was not read.
  - (b) also changes ADR-016: Amendment 3 Decisions 1 and 6, and what a later save records.

**Choice: (a).** Reasons, in order:
1. (b) has the kernel pick between two answers to one question. The engine refuses to make that pick by design (`dataset.rs:2025-2026`; Amendment 3 Decision 2).
2. (b) drops a recorded declaration that the operator never sees. That is a silent change to a plain-text project file (docs/01; ADR-016 §3: declared, never inferred).
3. (b) needs an ADR amendment, re-worded owner sentences and a wire fact all the same. (a) amends no ADR and changes no sentence a user sees.
4. Under (a), a recorded declaration of `id` that cannot serve behaves like any other recorded declaration refused at a reopen. A declaration route at a reopen stays undecided (ADR-016 Amendment 2, `:267`; Amendment 3, `:315`).

## §1 Claims and class

- **Claim:** beside a reopen's refusal of `id`, the shell offers the row-position choice only when the engine checked the file's own `id` with no declaration.
  - A reopen whose project file records a declaration of `id` is refused with no offer, and its refusal names the declaration as its source.
  - A direct open behaves as today.
  - What a project records does not change.
- **Not claimed:**
  - no performance number (docs/08);
  - no ADR amendment;
  - no new user-visible sentence;
  - no change to any engine message, to R-ENG, to S-8 or to S-1 to S-6c.
- **Class: full.** It changes the wire (one field, a new literal). It crosses the engine, kernel, protocol and shell seams. It is what an operator is told beside a refusal.

## §2 The mechanism, way (a)

**Engine**
1. `engine/src/error.rs:164-168`: `IdentityUnusable` gains `declared: bool`. It is true when the column checked was named by a declaration in this attempt. The `Display` (`:380`) is unchanged, and the field rides only in the structured fields, as `candidate_columns` does. The doc at `:151-163` gains one paragraph saying this.
2. `engine/src/dataset.rs`, `admit_identity`:
   - `declared` is `matches!(source, IdSource::Mapped { .. })`, computed once after `:2060`.
   - It is set at `:2077` (true), `:2098`, `:2156` and `:2167`, and passed to `identity::admit_column_type` at `:2106`.
   - The set-aside branch (`:2024-2045`) and `set_aside_outcome` (`:2197-2215`) are unchanged. The inner native call passes `None`, so its refusal carries `declared: false` and is consumed there.
3. `engine/src/identity.rs:372-392`: `admit_column_type` gains `declared: bool` and sets it on its refusal. It is `pub(crate)`, its product caller is `dataset.rs:2106`, and the in-module tests take the new argument.

**Kernel**
4. `kernel/src/skp.rs:2248-2262`: the `identity_unusable` arm gains the field. It is `file:id` when `declared` is false (the column is then always `id`, `dataset.rs:2059`) and `mapped:<column>` when it is true. This is the vocabulary of `describe.identity.source` in ADR-016's SETTLED block, and the field name is OPEN-A2. No new `pub` item.

**Wire**
5. `protocol/skp/src/v0/mod.rs`: the literal goes to `skp/0.17`, and the future-version fixture to `skp/0.18`.
6. `protocol/skp/SKP-V0.md`:
   - a new §8 entry `skp/0.17`, giving the full field set: one field on one code, no command, member or message change;
   - `v0-error-identity_unusable-with-candidates.json` gains `identity_source: "file:id"`;
   - a new `v0-error-identity_unusable-declared.json` with `mapped:parcel_key`.

**Shell**
7. `frontends/shell/src/skp/types.ts:15`: the literal. `fields` stays `Record<string, string>` (`:25`).
8. `frontends/shell/src/admission/AdmissionPanel.tsx`, `rowPositionOffer`:
   - after `:227` it gains `if (fieldValue(state.refusal, "identity_source") !== "file:id") return null;`;
   - an absent field is not offered, so the check fails closed;
   - `:228-229` stay;
   - its doc changes as D-R2 below.

**Strings.** No new string. The refusal block shows the new field as it shows every field, its key and value as the wire carries them (`frontends/shell/src/admission/RefusalBlock.tsx:35-37`). Its first sight is the walkthrough row in §10. If the advisor wants an owner line at this reopen, it is OPEN-A5 and is drafted under `[P6 placeholder]`.

**Documents whose words become untrue under (a).** Both are the advisor's words (ADV-2026-11-27-22 item 5), not the human's. They go to OPEN-A4.

- **D-R1**, `engine/src/error.rs:177-183`. The span starts inside line 177 at "Through the shell, the"; the rest of that line holds a quotation that is not reproduced here.
  - Old, verbatim:
    ```
    Through the shell, the
        /// first case is reached at the reopen of a project whose file records a declaration of the
        /// column `id`, when the engine refuses that column: the shell offers the choice beside an
        /// `engine.identity_unusable` refusal that names `id` in a run whose own options hold no
        /// declaration, and the kernel sends the recorded declaration with the choice. The other two
        /// are reached through the shell only if the file changes between attempts. All three can be
        /// reached through another client.
    ```
  - New, in my words:
    ```
    Through the shell, none
        /// of the three is reached unless a file changes between the refused attempt and the choice:
        /// the project file, for the first, at a reopen; the data file, for the other two. The shell
        /// offers the choice only beside an `engine.identity_unusable` refusal whose `identity_source`
        /// is `file:id`, which a declared column never gives. All three can be reached through another
        /// client.
    ```
  - Clause check:
    - *First case only through a project-file change at a reopen.* At a direct open, the choice's options never hold `identity` (`AdmissionPanel.tsx:234-237`). At a reopen, the kernel adds the project file's recorded identity, read afresh at each call (`project/mod.rs:720-726`, `:821-831`). A refused attempt whose refusal was `file:id` sent no identity, so a declaration rides with the choice only if the project file changed in between.
    - *The other two only through a data-file change.* The refused attempt checked an existing `id` column natively and refused it. "No `id` column" (`dataset.rs:2036-2040`) and "the `id` serves" (`:2209-2212`) each need a different file, because the checks are deterministic (ADR-016 §4).
    - *The shell offers only beside `file:id`.* This is the new line in item 8, proved by S-R1 and M-RD5.
    - *A declared column never gives `file:id`.* This is items 2 to 4, proved by N-R1, N-R2 and K-R2.
    - *All three through another client.* An SKP request carries `identity` and `set_aside_file_id` as members of their own.
    - The project-file case is reachable by an edit made while the refusal is shown. Its outcome is a refusal by name, and the sentence says so.
- **D-R2**, `AdmissionPanel.tsx`, two places in the doc of `rowPositionOffer`.
  - (i) `:219`. Old, verbatim: `` * - the refusal is `engine.identity_unusable` and names the column `id` (`fieldValue(refusal, "column")`): the file's own `id` is what cannot serve;`` New: the Old line, then a new line `` * - the refusal's `identity_source` is `file:id` (`skp/0.17`): the engine checked the file's own `id`, with no declaration;``
  - (ii) `:222`. Old, verbatim: ``At a reopen the recorded claims are the kernel's to send and this function does not see them: a reopen refused for a recorded declaration of the column `id` is offered the choice too, and the engine then refuses the choice beside the declaration the kernel sends with it (`IdentitySetAsideRefused` in `engine/src/error.rs`).`` New: ``At a reopen the recorded claims are the kernel's to send and this function does not see them; the refusal's `identity_source` says whether the `id` refused was the file's own (`file:id`) or a declaration the project file records (`mapped:id`), and only the first is offered the choice (ADR-016 Amendment 3, Decision 1).``
  - Clause check:
    - *The kernel's to send:* `project/mod.rs:821-827`.
    - *`mapped:id` for a recorded declaration:* items 2 and 4, proved by K-R1 (i).
    - *Only the first is offered:* item 8, proved by S-R1.
- If OPEN-A2 rules `declared` in place of `identity_source`, D-R1 and D-R2 take that name and its values. No other clause changes.

**Portability.** Not OS-dependent, so R3's section does not apply.

## §3 Fixtures

- **File A:** `text-id-no-integer-refused.parquet` / `IdentityMode::StringIds` (text-id §3).
- **An `id` that serves:** the default spec.
- **A duplicate `id`:** `IdentityMode::DuplicateIds`.
- **Project P0:** saved after a set-aside open of File A. It records `"identity": null` (text-id K-7's shape).
- **Project P1, by a real save:** open the default spec through `SkpHost` with `identity {column:"id"}` (admitted `mapped:id`), save, then replace the data file's bytes at the recorded place with File A's.
- **Project P2, by hand edit (e2e):** a copy of E-1 (d)'s saved project, with the recorded identity set to `{"column":"id"}` by JSON parse and write. The recorded shape is the wire `IdentityDeclaration` (text-id §0 F3); the build re-reads `kernel/src/dataset_ref.rs` before writing either.
- Predicted outcomes are in §4 and §5.

## §4 Tests, one mutation each (set M-RECDECL)

**How red is read.**
- No skeleton is declared.
- Each new test's red is read by applying its mutation at the head, running the test, recording the failure by name with the commit, and reverting the mutation (round 25 item 2 (c)).
- A `verify-mutation` run is reported only as a check that the mutations are recorded.
- Nothing of this piece says that a test was written before its code (ADV-2026-11-27-22 item 6).

| id | file / test | asserts | mutation |
|---|---|---|---|
| N-R1 | `engine/tests/identity_refusal_names_its_source.rs` (new): `the_type_refusal_says_whether_id_was_declared` | File A native: `declared` false. File A with `id` declared: true. File A with `nope` declared: true (`:2077`). | M-RD1: `dataset.rs:2106` passes `false` |
| N-R2 | same: `the_scan_refusals_say_whether_id_was_declared` | DuplicateIds native: false; declared `id`: true. NegativeIds declared `id`: true. | M-RD2: the duplicate arm (`:2167`) sets `false` |
| K-R1 | `kernel/tests/text_id_reopen_recorded_declaration.rs` (new): `a_reopen_whose_project_file_records_a_declaration_of_id_names_it_mapped` | (i) P1 through `open_project_command`, no choice: `engine.identity_unusable`, `column` `id`, `identity_source` `mapped:id`; then with the choice, `engine.identity_set_aside_refused` (unchanged). (ii) P0: `file:id`. The bytes of P1 are unchanged after both calls. | M-RD3: `error_of` always writes `file:id` |
| K-R2 | same file: `a_direct_open_names_the_source_of_the_refused_column` | `SkpHost::open_dataset` File A with no declaration: `file:id`; with `nope` declared: `mapped:nope`. | M-RD4: `error_of` writes `mapped:` without the column |
| W-R1 | `protocol/skp/tests/fixtures.rs`: `identity_unusable_fixtures_carry_identity_source_at_skp_0_17` | Both error fixtures deserialize and carry the field; the request fixtures are at `skp/0.17`; `skp/0.18` is refused. | M-RD6: `mod.rs`'s literal stays `skp/0.16` |
| S-R1 | `AdmissionPanel.test.ts`: `a_reopen_refused_for_a_recorded_declaration_of_id_is_not_offered_row_position` | A reopen refusal with `column` `id`, `identity_source` `mapped:id`: null. The same with `file:id`: offered (control). The field absent: null. | M-RD5: the `identity_source` check removed |
| S-R2 | `src/skp/__tests__/fixtures.test.ts`: `the_real_identity_unusable_fixtures_drive_the_offer` | Each real fixture file goes through `formatRefusal` and `rowPositionOffer`: `file:id` offered, `mapped:parcel_key` not. | M-RD7: the check reads the key `source` |
| E-R1 (port) | `e2e/admission-remediation.mjs`, new step `TEXTID-C1` | P2 through Open project: refused, the field row `identity_source` `mapped:id`, R-ENG, and no S-1. E-1 (d)'s reopen still shows S-1 (control). | M-RD8: as M-RD5, observed at the port |

**Existing tests that change:**
- `ID_REFUSAL` (`AdmissionPanel.test.ts:802`) gains `["identity_source","file:id"]`. S-T1, S-T2 and S-T4 (`:805-867`) then pass unmodified otherwise.
- T-11 and any other test that drives the offer from a hand-made refusal gain the field.
- Engine tests that destructure `IdentityUnusable` without `..` take the field. No assertion changes.

## §5 Predictions · declared unchanged · invalidators · falsification

- **Predictions:**
  - every row in §4 is green at the head, and each mutation turns its own test red at an assertion;
  - K-R1 (i) gives `mapped:id` and (ii) `file:id`;
  - E-R1 shows no S-1 at P2 and S-1 at E-1 (d).
- **Declared unchanged:**
  - every `EngineError` Display and engine message;
  - R-ENG, S-8 and S-1 to S-6c;
  - what a project records (`dataset_ref.rs` untouched);
  - every request member;
  - `describe`;
  - `protocol/data-plane/` (empty diff);
  - ADR-016;
  - text-id's N-, K- and S- tests, apart from the field noted in §4.
- **Invalidators** (each stops the code):
  - (i) the strict project reader refuses a recorded `{"column":"id"}`. K-R1 (i) and E-R1 are then not buildable as declared: class 2, to the advisor;
  - (ii) an `IdentityUnusable` site where the source is not known when the refusal is built;
  - (iii) a ruling that the field rides without a new literal. §7 is then restated before code (class 5);
  - (iv) text-id's head moves in `rowPositionOffer`, `error_of` or `admit_identity`. It comes in by a merge commit, with the reviewer's narrow read.
- **Falsification:** P1's reopen is not refused as `engine.identity_unusable` naming `id`. If so, C1 does not exist as drafted.

## §6 Instruments

All assertions. No measurement. No new instrument accessor.

## §7 Declared values and ceilings

- **Size:** at most 900 changed lines (insertions plus deletions) over at most 50 files.
- **Estimate:**

| part | lines |
|---|---|
| engine product | ~35 |
| kernel product | ~8 |
| SKP-V0 entry and `mod.rs` | ~30 |
| the literal and its fixtures, both sides (precedent: text-id §7's ~190) | ~190 |
| shell product and docs | ~10 |
| tests: engine (with the destructure fixes) | ~110 |
| tests: kernel | ~170 |
| tests: protocol | ~30 |
| tests: shell | ~60 |
| e2e step | ~90 |
| words (walkthrough row, e2e README) | ~15 |
| **total** | **~750** |

- **Scope, exactly:**
  - **engine:** `engine/src/error.rs`, `dataset.rs`, `identity.rs`; `engine/tests/identity_refusal_names_its_source.rs` (new); each `engine/tests/*.rs` that destructures `IdentityUnusable` without `..` at the base.
  - **kernel:** `kernel/src/skp.rs`; `kernel/tests/text_id_reopen_recorded_declaration.rs` (new); each `kernel/tests/*.rs` that builds or fully destructures `IdentityUnusable` at the base.
  - **protocol:** `protocol/skp/src/v0/mod.rs`, `SKP-V0.md`, `tests/fixtures.rs`; each `tests/data/*.json` and `tests/conformance/fixtures/*.json` holding the literal `skp/0.16` or `engine.identity_unusable`; the new `v0-error-identity_unusable-declared.json`; `tests/conformance/README.md`. A doc comment that names a version stays (the identity route's Amendment 4 D-1 rule).
  - **shell:** each `frontends/shell/src/**` file holding the literal `skp/0.16` at the base; `admission/AdmissionPanel.tsx`, `AdmissionPanel.test.ts`, `App.reopen.test.tsx`, `skp/__tests__/fixtures.test.ts`; `e2e/admission-remediation.mjs`, `e2e/README.md`.
  - **documents:** `frontends/shell/MANUAL-WALKTHROUGH.md`, one row after AH7.
- **Counting:** `git diff --numstat 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e..<head> -- . ':!<this form>' ':!governance/PLAN.yaml' ':!governance/CUSTODIAN-QUEUE.*' ':!site/**' ':!state/**'`, read at a named commit. If text-id's head comes in by a merge commit, that merge's lines are counted out by ranges, as in ADV-2026-11-27-22 item 7.
- An overrun is class 8, and this line is never edited to match.

## §8 Base, merge, overlap

- **Base:** 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e, text-id's corrected head.
- **Merge:** directly behind text-id (ADV-2026-11-27-22 item 4). The PR stays a draft until text-id is on main.
- The overlap rows against other unmerged branches are the custodian's, by git, before this form commits; this draft writes none.
- **Protocol place:** this piece holds the `protocol/` place with the literal `skp/0.17`. The advisor assigns both (OPEN-A3).

## §9 Block on sight

1. Code before this form is committed and OPEN-A1 to OPEN-A3 are ruled.
2. Any path outside §7.
3. The offer shown beside an `engine.identity_unusable` refusal whose `identity_source` is not `file:id`, or whose `identity_source` is absent.
4. Any change to an engine message, to R-ENG, to S-8 or to S-1 to S-6c.
5. The field minted from anything but the engine variant's `declared`.
6. Any change to a request member or to `protocol/data-plane/`; any wire change outside the `skp/0.17` entry.
7. Any byte of change in what a project file records.
8. Any edit to ADR-016.
9. A claim, in any record or PR body, that a test was written before its code.

## §10 Gates, seams, guarantees, operator

- **Seams**, each from the real shape:
  - engine to kernel: the `declared` field, read by `error_of`'s destructure (K-R1, K-R2);
  - kernel to wire: the field in `SkpError.fields` (W-R1);
  - wire to shell: `fieldValue(refusal, "identity_source")` over the real fixture files (S-R2), and through the real app (E-R1);
  - kernel project to engine: the recorded declaration sent by `open_project` (K-R1 (i)).
- **Guarantees:**
  - ADR-016 Amendment 3, Decision 1, closed;
  - Decisions 2 and 6 unchanged (K-R1 (i) and (ii));
  - ADR-016 §3: a recorded declaration is never overridden by the shell;
  - docs/01: the field states an engine fact, and the engine message is untouched.
- **Port:** E-R1 needs the port (an e2e step, in this piece's own port turn). Nothing else does.
- **Operator:** one walkthrough row after AH7, committed with a blank result log. The operator opens P2 and reads the field row, R-ENG and the absence of the choice by eye.

## OPEN questions (the advisor's)

- **OPEN-A1:** way (a) or (b). Recommendation: (a), for §0's four reasons. (b) stays the named alternative. If the advisor rules (b), this form is redrafted before it commits, with the exact old and new text of an appended ADR-016 amendment. That amendment would change Decision 1 (the offer at a reopen whose recorded declaration names `id`) and Decision 6 (what a later save records), and would re-word S-8.
- **OPEN-A2:** the field.
  - Recommendation: `identity_source`, valued `file:id` or `mapped:<column>`. It reuses the SETTLED envelope's words, so no new vocabulary.
  - Alternative: `declared`, valued `true` or `false`. It is simpler, but it is a new vocabulary on a key the operator sees.
- **OPEN-A3:** the literal `skp/0.17` (future-version fixture `skp/0.18`) and the protocol place. Recommendation: as proposed. Riding `skp/0.16` would need code in text-id, which item 4 rules out.
- **OPEN-A4:** D-R1 and D-R2 as drafted. Recommendation: as drafted.
- **OPEN-A5:** an owner line at this reopen. Recommendation: none. The engine's message, the field and R-ENG state the facts, and a route at a reopen is undecided in ADR-016 Amendments 2 and 3. If one is wanted, it is drafted under `[P6 placeholder]` at the next amendment.
- **Not an OPEN:** if this piece is ready behind text-id, no KNOWN-LIMITATIONS sentence is owed (item 4).

## §11 Amendments

None yet.

## Not read

- Text-id's Amendment 16: at main 156559cb the form ends at Amendment 15.
- `kernel/src/dataset_ref.rs`: the recorded identity's shape, and what a save after a reopen records.
- `IdentityDeclarationForm.tsx`, so the shell's own reach to a recorded `id` is unconfirmed.
- `App.reopen.test.tsx`, `e2e/admission-remediation.mjs`, `client.ts` beyond `openDataset` and `openProject`, SKP-V0 §1 and §12.3 in full, the MCP adapter, the conformance fixtures, and KNOWN-LIMITATIONS item 3 at the base. The build reads item 3's sentences against the new condition.
- `identity-scan-refuses-a-null-by-name` also edits `admit_identity`'s scan arms. I named it, and did not read it for overlap.

END OF FORM DRAFT

Files read:
- D:/wt/read-1127b/docs/adr/ADR-016-stable-feature-identity-admission.md
- D:/wt/read-1127b/engine/src/dataset.rs
- D:/wt/read-1127b/engine/src/error.rs
- D:/wt/read-1127b/engine/src/identity.rs
- D:/wt/read-1127b/kernel/src/project/mod.rs
- D:/wt/read-1127b/kernel/src/skp.rs
- D:/wt/read-1127b/protocol/skp/SKP-V0.md
- D:/wt/read-1127b/frontends/shell/src/admission/AdmissionPanel.tsx
- D:/wt/read-1127b/frontends/shell/src/project/openProject.ts
- D:/wt/read-1127b/frontends/shell/src/project/reopenNotices.ts
- D:/wt/read-1127c/governance/forms/frontends/TEXT-ID-OPENS-FOR-THE-SESSION-BY-ROW-POSITION-PREREGISTRATION.md
