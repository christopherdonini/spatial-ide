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
- So a reopen whose project file records a declaration of `id` is offered the choice. The engine then refuses it as S-6b, because a declaration was sent beside the choice (`dataset.rs:2027-2033`). Nothing opens wrongly. The offer departs from ADR-016 Amendment 3, Decision 1 (line 302 of `docs/adr/ADR-016-stable-feature-identity-admission.md` at the base).

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

## Amendment 1 — 2026-11-27 — at the first commit: ADV-2026-11-27-24 and -27 carried in, the drafter's restatement, the overlap rows, the node's gate

*Written by the custodian at the form's first commit, before its two form gates and before any code. Nothing above is edited. The body above is the architect's draft as filed at `state/drafts/2026-11-27-text-id-reopen-with-a-recorded-declaration-architect-form-draft.md`, from its "# Preregistration" heading to the line before its END OF FORM DRAFT marker: 26351 bytes, sha256 05847b3ab30e2cfb0d412c0b9e44e9b7a5846818a84a1a51b0f892c7a88b61d6. One change is made to it, by script at this commit: on line 29, the cite of ADR-016's line 302 is written in words ("line 302 of" the file, "at the base"), because verify-cites reads a rooted cite against main's tree, where that file has 246 lines. The body here is 26371 bytes, sha256 8c571e039e5780734f2894cb0489cce00d229c233280f4a460ec805fa8c01fc4. The draft's list of files read, after that marker, is not carried; it stays in the filed draft. The words "None yet." in §11, §8's line on the overlap rows and the OPEN questions stand as drafted, read with this amendment. The gates read the form as amended, and read it against the template and ADV-2026-11-27-22 item 4 themselves (ADV-2026-11-27-24 item 8).*

1. **The rulings.**
   - ADV-2026-11-27-24, filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-24-text-ids-c1-follow-up-way-a-identity-source-carried-by-the-engine-skp-0-17-on-one-protocol-line-the-recovery-offer-behind-it.md`, answers OPEN-A1 to OPEN-A5 in its items 1 to 5; its item 3 also gives the `protocol/` place. Its items 6, 7 and 9 bind this piece's words, overlap and port turn, and its item 8 this commit and the form gates.
   - ADV-2026-11-27-27, filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-27-the-c1-pieces-shared-path-with-a-in-saveproject-test-ts-counts-met-by-the-order-route-text-id-c1-then-a-the-form-commits-now.md`, adds to its item 7.
2. **The drafter's restatement** (ADV-2026-11-27-24 items 2, 4 and 5) is filed at `state/drafts/2026-11-27-text-id-reopen-with-a-recorded-declaration-architect-form-draft-restatement.md`.
   - Its Old and New pairs are carried below byte for byte: the text between its two rule lines, 16251 bytes, sha256 a2bedd4ed0987a7c81dad3ec6ccc7537b6dafa7a652699073535a50ca5fce494.
   - By script at this commit that text holds fifteen sections, each with one Old and its New. Its opening paragraph says 14. Pairs 6 and 8 carry item 4's two texts in place of the draft's (ADV-2026-11-27-24 item 8).
   - Each Old is found exactly once in the body above, checked by script at this commit, and its New is read in its place.
   - The pairs' "filed line" figures are lines of the filed draft, not of this form.

`````text
## §2 The mechanism, way (a) — item 1 (filed line 81)

Old, verbatim:
````text
1. `engine/src/error.rs:164-168`: `IdentityUnusable` gains `declared: bool`. It is true when the column checked was named by a declaration in this attempt. The `Display` (`:380`) is unchanged, and the field rides only in the structured fields, as `candidate_columns` does. The doc at `:151-163` gains one paragraph saying this.
````
New:
````text
1. `engine/src/error.rs:164-168`: `IdentityUnusable` gains `identity_source: String`, under the wire's name (ADV-2026-11-27-24 item 2). Every site values it by `IdSource::as_envelope_value` (`engine/src/identity.rs:82-90`) of the source the engine checked: `file:id` for the file's own `id`, `mapped:<column>` for a declared column. `IdSource::SessionOrdinal` never reaches these sites. The `Display` (`:380`) is unchanged; its destructure takes `identity_source: _`. The field rides only in the structured fields, as `candidate_columns` does. The doc at `:151-163` gains one paragraph saying this.
````

## §2 — item 2 (filed lines 82-85)

Old, verbatim:
````text
2. `engine/src/dataset.rs`, `admit_identity`:
   - `declared` is `matches!(source, IdSource::Mapped { .. })`, computed once after `:2060`.
   - It is set at `:2077` (true), `:2098`, `:2156` and `:2167`, and passed to `identity::admit_column_type` at `:2106`.
   - The set-aside branch (`:2024-2045`) and `set_aside_outcome` (`:2197-2215`) are unchanged. The inner native call passes `None`, so its refusal carries `declared: false` and is consumed there.
````
New:
````text
2. `engine/src/dataset.rs`, `admit_identity`:
   - `source` is built before the first site (`:2046-2060`), and is `IdSource::File` or `IdSource::Mapped` only.
   - The refusals at `:2077` (always `mapped:<column>`), `:2098`, `:2156` and `:2167` are each valued `source.as_envelope_value()`, and `&source` is passed to `identity::admit_column_type` at `:2106`. `source` is borrowed there and moved only at `:2111` and `:2178`, after every site.
   - The set-aside branch (`:2024-2045`) and `set_aside_outcome` (`:2197-2215`) are unchanged. The inner native call passes `None`, so its refusal carries `file:id` and is consumed there.
````

## §2 — item 3 (filed line 86)

Old, verbatim:
````text
3. `engine/src/identity.rs:372-392`: `admit_column_type` gains `declared: bool` and sets it on its refusal. It is `pub(crate)`, its product caller is `dataset.rs:2106`, and the in-module tests take the new argument.
````
New:
````text
3. `engine/src/identity.rs:372-392`: `admit_column_type` gains `source: &IdSource`, in the module that holds `IdSource` (`:33-56`), and values its refusal (`:382-390`) `source.as_envelope_value()`. It is `pub(crate)`, its product caller is `dataset.rs:2106`, and the in-module tests (`:425`, `:434`, `:492`, `:543`) pass `&IdSource::File`.
````

## §2 — item 4 (filed line 89)

Old, verbatim:
````text
4. `kernel/src/skp.rs:2248-2262`: the `identity_unusable` arm gains the field. It is `file:id` when `declared` is false (the column is then always `id`, `dataset.rs:2059`) and `mapped:<column>` when it is true. This is the vocabulary of `describe.identity.source` in ADR-016's SETTLED block, and the field name is OPEN-A2. No new `pub` item.
````
New:
````text
4. `kernel/src/skp.rs:2248-2262`: the `identity_unusable` arm destructures `identity_source` and passes it as it passes `column`, as `("identity_source", identity_source.clone())`. The kernel composes, renames and derives nothing: the values are the engine's, `file:id` or `mapped:<column>`, the vocabulary of `describe.identity.source` in ADR-016's SETTLED block (ADV-2026-11-27-24 item 2). No new `pub` item.
````

## §2 — **Strings** (filed line 106), under item 5

The Old line does not say that the field row carries a mark. But its last sentence leaves an owner line open under `[P6 placeholder]`, and item 5 rules that out.

Old, verbatim:
````text
**Strings.** No new string. The refusal block shows the new field as it shows every field, its key and value as the wire carries them (`frontends/shell/src/admission/RefusalBlock.tsx:35-37`). Its first sight is the walkthrough row in §10. If the advisor wants an owner line at this reopen, it is OPEN-A5 and is drafted under `[P6 placeholder]`.
````
New:
````text
**Strings.** No new string, and no owner line (ADV-2026-11-27-24 item 5). The refusal block shows the new field as it shows every field, its key and value as the wire carries them, sorted by key (`frontends/shell/src/admission/RefusalBlock.tsx:35-37`; `frontends/shell/src/admission/formatRefusal.ts:38`), beside every refusal of this code, at a direct open as well. The field row carries no placeholder mark: it is a wire fact shown as the wire carries it, as `candidate_columns` is. Its first sight is the walkthrough row in §10.
````

## §2 — D-R1's New (filed lines 121-129), item 4

Old, verbatim:
````text
  - New, in my words:
    ```
    Through the shell, none
        /// of the three is reached unless a file changes between the refused attempt and the choice:
        /// the project file, for the first, at a reopen; the data file, for the other two. The shell
        /// offers the choice only beside an `engine.identity_unusable` refusal whose `identity_source`
        /// is `file:id`, which a declared column never gives. All three can be reached through another
        /// client.
    ```
````
New. The advisor's text (ADV-2026-11-27-24 item 4), byte for byte, wrapped as the doc's lines are: each line break, with its `    /// ` prefix, replaces one space. The first line continues line 177 after its quotation, so line 177 becomes 98 columns; no other line exceeds 97.
````text
  - New, the advisor's (ADV-2026-11-27-24 item 4), byte for byte, wrapped as the doc's lines are (each line break replaces one space):
    ```
    Through the shell, none
        /// of the three is reached unless something changes on disk between the refused attempt and
        /// the choice. The shell offers the choice only beside an `engine.identity_unusable` refusal
        /// whose `identity_source` is `file:id`, which a declared column never gives. So the first is
        /// reached only at a reopen whose project file gained a declaration in between, and the other
        /// two only when the file the choice opens is no longer the file that was refused. All three
        /// can be reached through another client.
    ```
````

## §2 — D-R1's clause check (filed lines 130-136)

My clause check changes with the new text. Its first two bullets named a data file only, and the advisor's words also cover a reopen that reaches another file.

Old, verbatim:
````text
  - Clause check:
    - *First case only through a project-file change at a reopen.* At a direct open, the choice's options never hold `identity` (`AdmissionPanel.tsx:234-237`). At a reopen, the kernel adds the project file's recorded identity, read afresh at each call (`project/mod.rs:720-726`, `:821-831`). A refused attempt whose refusal was `file:id` sent no identity, so a declaration rides with the choice only if the project file changed in between.
    - *The other two only through a data-file change.* The refused attempt checked an existing `id` column natively and refused it. "No `id` column" (`dataset.rs:2036-2040`) and "the `id` serves" (`:2209-2212`) each need a different file, because the checks are deterministic (ADR-016 §4).
    - *The shell offers only beside `file:id`.* This is the new line in item 8, proved by S-R1 and M-RD5.
    - *A declared column never gives `file:id`.* This is items 2 to 4, proved by N-R1, N-R2 and K-R2.
    - *All three through another client.* An SKP request carries `identity` and `set_aside_file_id` as members of their own.
    - The project-file case is reachable by an edit made while the refusal is shown. Its outcome is a refusal by name, and the sentence says so.
````
New:
````text
  - Clause check (of the advisor's New):
    - *The shell offers only beside `file:id`.* This is the new line in item 8, proved by S-R1 and M-RD5.
    - *Which a declared column never gives.* A declaration makes `source` `IdSource::Mapped` (`dataset.rs:2047-2058`), which `as_envelope_value` values `mapped:<column>` (`identity.rs:85`). Items 1 to 4; proved by N-R1, N-R2 and K-R2.
    - *The first only at a reopen whose project file gained a declaration in between.* `source` is `IdSource::File` only when no declaration came (`dataset.rs:2059`), so a `file:id` refusal means the refused attempt carried none. At a direct open, `rowPositionOptions` removes `identity` from the choice's options (`AdmissionPanel.tsx:234-237`). At a reopen, the kernel reads the project file at each call (`project/mod.rs:720-726`) and sends its recorded identity with the choice (`:821-831`).
    - *The other two only when the file the choice opens is no longer the file that was refused.* A `file:id` refusal means the file had an `id` column: with none, the native path opens on the session tier and refuses nothing (`dataset.rs:2062-2089`). That column failed the type check, which reads the schema (`identity.rs:372-392`), or the scan, which reads the column (`dataset.rs:2123-2176`), so the same file gives the same answer. At a reopen, the file opened can also differ because what the project file or the machine store records for its place changed (`project/mod.rs:810-816`).
    - *All three through another client.* An SKP request carries `identity` and `set_aside_file_id` as members of their own.
    - Something changes on disk while the refusal is shown, which ordinary use can do. The outcome is a refusal by name, and the sentence says so.
````

## §2 — D-R2 (ii)'s New (filed line 139), item 4

D-R2 (i) stays as drafted. Line 139 holds both the Old and the New of (ii), so the whole line is replaced. The Old inside it is unchanged; the New is the advisor's text, carried byte for byte without the ruling's "New: " label.

Old, verbatim:
````text
  - (ii) `:222`. Old, verbatim: ``At a reopen the recorded claims are the kernel's to send and this function does not see them: a reopen refused for a recorded declaration of the column `id` is offered the choice too, and the engine then refuses the choice beside the declaration the kernel sends with it (`IdentitySetAsideRefused` in `engine/src/error.rs`).`` New: ``At a reopen the recorded claims are the kernel's to send and this function does not see them; the refusal's `identity_source` says whether the `id` refused was the file's own (`file:id`) or a declaration the project file records (`mapped:id`), and only the first is offered the choice (ADR-016 Amendment 3, Decision 1).``
````
New:
````text
  - (ii) `:222`. Old, verbatim: ``At a reopen the recorded claims are the kernel's to send and this function does not see them: a reopen refused for a recorded declaration of the column `id` is offered the choice too, and the engine then refuses the choice beside the declaration the kernel sends with it (`IdentitySetAsideRefused` in `engine/src/error.rs`).`` New, the advisor's (ADV-2026-11-27-24 item 4), byte for byte: ``At a reopen the recorded claims are the kernel's to send and this function does not see them; the refusal's `identity_source` says whether the engine checked `id` as the file's own column, with no declaration (`file:id`), or as the column a declaration named (`mapped:id`), which at a reopen is the project file's. Only the first is offered the choice (ADR-016 Amendment 3, Decision 1).``
````

## §2 — D-R2's clause check (filed lines 140-143)

My clause check changes: it gains the "file's own column" clause and "at a reopen, the project file's".

Old, verbatim:
````text
  - Clause check:
    - *The kernel's to send:* `project/mod.rs:821-827`.
    - *`mapped:id` for a recorded declaration:* items 2 and 4, proved by K-R1 (i).
    - *Only the first is offered:* item 8, proved by S-R1.
````
New:
````text
  - Clause check (of the advisor's New for (ii)):
    - *The kernel's to send, and this function does not see them:* `project/mod.rs:821-827`. `admitProject` sends the answer, the re-link and the choice, and no claim (`openProject.ts:73`).
    - *`file:id` is `id` checked as the file's own column, with no declaration:* `dataset.rs:2059`, valued by `identity.rs:84`. Proved by N-R1 and K-R2.
    - *`mapped:id` is the column a declaration named, at a reopen the project file's:* `dataset.rs:2047-2058` and `identity.rs:85`. At a reopen the only declaration is the one the kernel reads from the project file (`project/mod.rs:821-827`). Proved by K-R1 (i).
    - *Only the first is offered:* item 8, proved by S-R1.
````

## §2 — after D-R2 (filed line 144), changed because item 2 makes it untrue

The Old is conditional on a ruling that went the other way, and it still names `declared`.

Old, verbatim:
````text
- If OPEN-A2 rules `declared` in place of `identity_source`, D-R1 and D-R2 take that name and its values. No other clause changes.
````
New:
````text
- OPEN-A2 is ruled `identity_source` (ADV-2026-11-27-24 item 2); D-R1 and D-R2 use that name and its values.
````

## §4 — row N-R1 (filed line 168)

Old, verbatim:
````text
| N-R1 | `engine/tests/identity_refusal_names_its_source.rs` (new): `the_type_refusal_says_whether_id_was_declared` | File A native: `declared` false. File A with `id` declared: true. File A with `nope` declared: true (`:2077`). | M-RD1: `dataset.rs:2106` passes `false` |
````
New:
````text
| N-R1 | `engine/tests/identity_refusal_names_its_source.rs` (new): `the_type_refusal_says_whether_id_was_declared` | `identity_source`: File A with no declaration, `file:id`; File A with `id` declared, `mapped:id`; File A with `nope` declared, `mapped:nope` (`dataset.rs:2077`); a declared name that cannot be addressed, its file built as `engine/tests/b1_nul_declared_identity_no_scan.rs` builds its own, `mapped:` and that name (`dataset.rs:2098`). Each equals `IdSource::as_envelope_value` of the source checked. | M-RD1: `dataset.rs:2106` passes `&IdSource::File` to `admit_column_type` |
````

## §4 — row N-R2 (filed line 169)

Old, verbatim:
````text
| N-R2 | same: `the_scan_refusals_say_whether_id_was_declared` | DuplicateIds native: false; declared `id`: true. NegativeIds declared `id`: true. | M-RD2: the duplicate arm (`:2167`) sets `false` |
````
New:
````text
| N-R2 | same: `the_scan_refusals_say_whether_id_was_declared` | `identity_source`: DuplicateIds with no declaration, `file:id`; with `id` declared, `mapped:id`. NegativeIds with no declaration, `file:id`; with `id` declared, `mapped:id`. | M-RD2: the duplicate arm (`dataset.rs:2167`) is valued `IdSource::File.as_envelope_value()` |
````

## §4 — row K-R2 (filed line 171)

K-R1's row and its M-RD3 (the kernel's arm always writes `file:id`) still hold against an arm that passes the field through, so I give no pair for them.

Old, verbatim:
````text
| K-R2 | same file: `a_direct_open_names_the_source_of_the_refused_column` | `SkpHost::open_dataset` File A with no declaration: `file:id`; with `nope` declared: `mapped:nope`. | M-RD4: `error_of` writes `mapped:` without the column |
````
New:
````text
| K-R2 | same file: `a_direct_open_names_the_source_of_the_refused_column` | `SkpHost::open_dataset` File A with no declaration: `file:id`; with `nope` declared: `mapped:nope`. Each wire value is the variant's `identity_source` as the engine built it. | M-RD4: the `identity_unusable` arm of `error_of` leaves the field out |
````

## §9 Block on sight — item 5 (filed line 250)

Old, verbatim:
````text
5. The field minted from anything but the engine variant's `declared`.
````
New:
````text
5. The field valued anywhere but by `IdSource::as_envelope_value` of the source the engine checked, at its site in `engine/src`; or composed, renamed or derived in the kernel, whose arm passes it as it passes `column`.
````

## §10 Gates, seams, guarantees, operator — the first seam (filed line 259), changed because it names `declared`

Old, verbatim:
````text
  - engine to kernel: the `declared` field, read by `error_of`'s destructure (K-R1, K-R2);
````
New:
````text
  - engine to kernel: the `identity_source` field, read by `error_of`'s destructure and passed through (K-R1, K-R2);
````
`````

3. **The overlap** (§8; ADV-2026-11-27-24 item 7; ADV-2026-11-27-27), by git at main 05b18d55fc6b83847ff2c37d6d4000be5ea8a5b0:
   - §7's scope is resolved at the base to 51 files: the files it names, and every file its "each" lines match at the base.
   - Each branch is read by its own commits, with main and the base excluded. A branch with no file of the scope is not listed.

| Branch | Node and status | Files of §7's scope | Counted under rule (00) |
|---|---|---|---|
| `cloud/wave2-A2` (c37b4270, last commit 2026-09-28) | none; the wave-2 cloud item W2-A2's branch | `engine/tests/b1_projection_hostile_names.rs` | No: as above. |
| `cut/a-second-save-is-announced` (38e9209d, last commit 2026-11-27) | a-second-save-is-announced, in progress | `frontends/shell/src/project/saveProject.test.ts`; the walkthrough; the e2e README | The test file: yes, met by the order (ADV-2026-11-27-27 item 2): the identity route, text-id, this piece, then A, which takes main in by a merge commit with the reviewer's narrow read of that file. This piece changes only the literal's line, which A's hunks do not hold. The walkthrough and the README: no, by Part and entry (rule (00a)). |
| `cut/b1-close-nul-names` (15078450, last commit 2026-09-29) | b1-close-nul-column-names, done (PR 143) | engine, kernel, protocol and shell files | No: no piece in progress and no open PR owns it. |
| `cut/kernel-ticket-drop-followups-p1-base` (7ba142da, last commit 2026-10-03) | kernel-ticket-drop-followups, done (PR 168) | `kernel/src/skp.rs` | No: as above. |
| `cut/reload-ends-the-old-pages-opens` (5ce0525a, last commit 2026-11-27) | reload-ends-the-old-pages-opens, in progress | the e2e README | No, by entry (rule (00a)). |
| `cut/shell-scale-display` (9f8b67cd, last commit 2026-11-27) | shell-scale-display, ready | the walkthrough; the e2e README | No, by Part and entry (rule (00a)). |

4. **`identity-scan-refuses-a-null-by-name`** merges after this piece, and its code is built on this piece's head (that form's Amendment 2). This form's gates read that form's §2 against item 2 of this form's §2 (ADV-2026-11-27-24 item 7).
5. **The words** (its item 6): the walkthrough row after AH7 and the e2e README entry go to the advisor before the build commits them. Their ids are the next unused over text-id's head and every unmerged branch (rule (00a)). A sentence of KNOWN-LIMITATIONS, the walkthrough or a README that the new field row or the missing offer makes untrue goes to the advisor.
6. **The literal and the place** (its item 3):
   - `skp/0.17`, with the future-version fixture at `skp/0.18`, on one line: the identity route, text-id, this piece.
   - The PR stays a draft until text-id is on main. A move of text-id's head comes in by a merge commit with the reviewer's narrow read.
   - Before the bump's commit, the custodian checks again that no branch holds `skp/0.17` in code.
7. **The port** (its item 9): E-R1 takes a turn of its own after text-id's series. When its code and its read parts' corrections are in, it goes ahead of any series that has not started.
8. **The node's gate.** In the same commit, the PLAN node `text-id-reopen-with-a-recorded-declaration` names this form as its gate. Full form, both gates; its build gates run in two parts (its item 8).

## Amendment 2 — 2026-11-27 — the custodian's: the architect's form gate, PASS WITH NOTES; E1 and D1 to D6 read in place

*References only. Nothing above is edited. Written before any code.*

1. **The gate** is filed at `state/consults/gates/2026-11-27-text-id-reopen-with-a-recorded-declaration-form-gate-architect.md`: the form at main 90d7286f191b2f082fc8e4a5f8e1a3a69a919c51, the code at 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e. Its verdict is PASS WITH NOTES.
2. **Its seven pairs are read in place**, each New for its Old: E1 (Evidence) and D1 to D6 (Documentation), in the report's section headed "Findings".
   - Each Old was found exactly once in this form, by script at this commit, from the report's own lines.
   - D4's New is its Old followed by one new line, as the report gives it.
   - The gate's report says they need no re-gate (its section on the wording-blocks rule).
3. **A1** falls on the null-by-name form, `governance/forms/engine/IDENTITY-SCAN-REFUSES-A-NULL-BY-NAME-PREREGISTRATION.md`, and is carried there by that form's Amendment 3 in this same commit, before its code.
4. **Next:** the reviewer's form gate, on this form as amended.

## Amendment 3 — 2026-11-27 — the custodian's: the reviewer's form gate, PASS WITH NOTES; V1 to V3 and W1 to W4 read in place

*References only. Nothing above is edited. Written before any code.*

1. **The gate** is filed at `state/consults/gates/2026-11-27-text-id-reopen-with-a-recorded-declaration-form-gate-reviewer.md`: the form at main f39536be767cedc2f6637e3d0d48d286e2bc2688, the code at 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e. Its verdict is PASS WITH NOTES. With Amendment 2's, both form gates have passed.
2. **Its nine pairs are read in place**, each New for its Old: V1 (two pairs), V2 (two pairs) and V3 (Evidence), and W1 to W4 (Documentation), in the report's section headed "Findings, as exact pairs".
   - Each Old was found exactly once in this form, by script at this commit, from the report's own lines. None of them lies inside an Old of Amendment 2.
   - W1's and W2's Olds stand in Amendment 1's text. They are read in place as Amendment 2 read D5 and D6.
   - The report says they need no re-gate (its preamble to the findings).
3. **A departure, disclosed.** The brief said to write no file. The report says it wrote its check scripts and one scope list in the session's scratch folder, and nothing elsewhere. No file of the repository changed.
4. **Next:** the build, on text-id's head 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e, under Amendment 1 items 5 to 7.

## Amendment 4 — 2026-11-27 — the custodian's: the build, at 1a4b5bbe

*References only. Nothing above is edited.*

1. **The build** is two commits on text-id's head 2df8b4ae: 2f44cb9e (the field, the literal `skp/0.17`, the shell's check and the tests) and 1a4b5bbe (E-R1, written and checked by `node --check`, not run). Its report is filed at `state/consults/gates/2026-11-27-text-id-reopen-with-a-recorded-declaration-build-worker-report.md`. No pull request is open yet; it opens as a draft and stays one until text-id is on main.
2. **The suites that start no app,** by the report: green at the base and at the head. The head's cargo tests of the three crates gave 1122 passed (the base's 1117 plus 5). The shell gave 1699 tests (the base's 1697 plus 2). The four verify scripts and CI's `node --test` passed. M-RD1 to M-RD7 each fail at their own test's assertion, and M-RD8 is the tester's at the port.
3. **Class 8, recorded and not met.** By §7's counting command the head has 903 changed lines against §7's 900, over 37 files. The words of item 4 would add about 15 more. §7 is not edited, and the overrun goes to the advisor.
4. **The words, not committed** (Amendment 1 item 5): the walkthrough row AH8 with its result-log line, and the e2e README section for E-R1, both drafted in the report's section 5. They go to the advisor before any commit.
   - By the custodian's check at 2026-11-27T16:49Z, the ids are unused elsewhere. Of the 50 branches on origin not merged into main d0602902, none but this piece's adds a row `AH8`, the step `TEXTID-C1` or the README heading. Main holds no row `AH8`.
5. **A sentence named for the advisor, with no words proposed.** The report names KNOWN-LIMITATIONS item 3 as the sentence a reopen with a recorded declaration of `id` may make untrue: that reopen now offers nothing. The report gives that path from memory and did not re-read the file.
6. **Departures, by the report.** None touches a result:
   - one hold's command stood in parentheses;
   - engine edits made early were set aside and re-applied after the base's run;
   - the TMP folder was moved to D:;
   - one test was renamed to `skp_version_is_skp_0_17`, with its mutation observed (M-RD6).
7. **Next:**
   - the draft pull request;
   - one advisor message, carrying items 3 to 5;
   - the build gates' read parts, the architect's and the reviewer's;
   - E-R1 at the port.

## Amendment 5 — 2026-11-27 — the custodian's: ADV-2026-11-27-30, before the words commit

*References only. Nothing above is edited. Written before the words commit.*

1. **The ruling** is filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-30-the-c1-pieces-overrun-recorded-the-words-of-ah8-and-the-readme-section-known-limitations-item-3-unchanged.md`. It answers the three questions of Amendment 4 items 3 to 5.
2. **Class 8, recorded, and the piece goes on** (the ruling's item 1). The count at 1a4b5bbe is 903 against §7's 900, over 37 files, as Amendment 4 item 3 has it. No line is cut. The final figure is taken at the words commit's head by §7's own command. The amendment that records it carries the template's words `budget overrun, §7 not edited`, §7's estimate table with the count beside each row, and the reason in one sentence the gates can check. §7 is not edited.
   - Both gates' read parts say in so many words whether every changed file is inside §7's scope, as its "each" lines resolve at the base, and whether every change is inside §2 and §4 as gated. A file or an item outside them is not class 8. It goes to the advisor before anything else.
3. **The words** (the ruling's items 2 and 3) are the advisor's: row AH8 directly after row AH7, its result-log line directly after AH7's, and the e2e README section appended at the file's end after one blank line. Row AH8's expected outcome rests on E-R1's step (5), which has not run. If the port shows otherwise, the row goes back to the advisor before the run part's verdict.
4. **KNOWN-LIMITATIONS item 3 does not change** (the ruling's item 4), and no sentence is added. `KNOWN-LIMITATIONS.md` stays outside the piece.
5. **Class 2, under the ruling's item 6.** As read in place with Amendment 3's V2, §3's Project P2 is still a copy of E-1 (d)'s saved project. The step `TEXTID-C1` at 1a4b5bbe makes its own save in its step (1) and copies that folder. The step's own save is recorded here, and the gates' read parts read it.
   - Noted for the same reads, unruled: §3 sets P2's identity "by JSON parse and write". The step replaces one line with three in the writer's layout.
6. **The order** (the ruling's item 5):
   1. one words commit, which holds items 2 and 3 and nothing else, in `frontends/shell/MANUAL-WALKTHROUGH.md` and `frontends/shell/e2e/README.md`;
   2. the suites that start no app, green at the new head;
   3. the amendment with the final count;
   4. the build gates' read parts, which are not yet dispatched, at the words commit's head.

## Amendment 6 — 2026-11-27 — the custodian's: the words commit at 97019e91, and §7's final count

*References only. Nothing above is edited.*

1. **The words commit** is 97019e91 (ADV-2026-11-27-30 items 2 and 3; Amendment 5 item 6). Its report is filed at `state/consults/gates/2026-11-27-text-id-reopen-with-a-recorded-declaration-words-30-worker-report.md`.
   - It changes two files and deletes nothing: `frontends/shell/MANUAL-WALKTHROUGH.md` (2 lines) and `frontends/shell/e2e/README.md` (14 lines).
   - The custodian checked it by script, 2026-11-27, against the ruling's three fences as filed on main:
     - each fence's text occurs once in its file;
     - row AH8 stands directly after row AH7, and its result-log line directly after AH7's;
     - the README ends with the section, after one blank line;
     - neither file holds a carriage return.
2. **The suites that start no app,** by the report, are green at 97019e91:
   - cargo's three crates, 1122 passed, and `cargo fmt --check` clean;
   - the shell's typecheck and its 1699 tests;
   - verify-cites, verify-quotes, verify-test-claims, verify-mutation (8 new tests) and verify-plan;
   - CI's `node --test`, 623 of 623.
3. **Class 8: budget overrun, §7 not edited.** By §7's counting command at 97019e91, the piece has 791 insertions and 128 deletions: 919 changed lines against 900, over 39 files against 50. The custodian's own run of the command gives the same figure. Amendment 4 item 3's 903 was at 1a4b5bbe; the words add 16.
   - §7's estimate table, with the count at 97019e91 beside each row. Which files each row counts is the custodian's mapping, for the gates to check. By script, every changed line of the four shell test files and `types.ts` in the literal's row is the literal `skp/0.16` made `skp/0.17`.

| part | lines | at 97019e91 | the files counted |
|---|---|---|---|
| engine product | ~35 | 40 | `engine/src/dataset.rs`, `error.rs`, `identity.rs` |
| kernel product | ~8 | 4 | `kernel/src/skp.rs` |
| SKP-V0 entry and `mod.rs` | ~30 | 30 | `protocol/skp/SKP-V0.md`, `protocol/skp/src/v0/mod.rs` |
| the literal and its fixtures, both sides | ~190 | 211 | the 14 files under `protocol/skp/tests/data/`; the three fixture files and the README under `protocol/skp/tests/conformance/`; `frontends/shell/src/skp/types.ts`; `RefusalBlock.test.tsx`, `admitDataset.test.ts`, `saveProject.test.ts` and `client.test.ts` under `frontends/shell/src/` |
| shell product and docs | ~10 | 4 | `frontends/shell/src/admission/AdmissionPanel.tsx` |
| tests: engine (with the destructure fixes) | ~110 | 143 | `engine/tests/identity_refusal_names_its_source.rs`, `engine/tests/identity.rs` |
| tests: kernel | ~170 | 249 | `kernel/tests/text_id_reopen_recorded_declaration.rs` |
| tests: protocol | ~30 | 85 | `protocol/skp/tests/fixtures.rs` |
| tests: shell | ~60 | 32 | `AdmissionPanel.test.ts`, `skp/__tests__/fixtures.test.ts` |
| e2e step | ~90 | 105 | `frontends/shell/e2e/admission-remediation.mjs` |
| words (walkthrough row, e2e README) | ~15 | 16 | `MANUAL-WALKTHROUGH.md`, `e2e/README.md` |
| **total** | **~750** | **919** | 39 files |

   - **The reason:** the three Rust test rows count 477 against their ~310, while the four product rows count 78 against their ~83.
4. **For the gates' read parts** (ADV-2026-11-27-30 item 1): each says in so many words whether every changed file is inside §7's scope, as its "each" lines resolve at the base, and whether every change is inside §2 and §4 as gated. A file or an item outside them goes to the advisor before anything else.
5. **The worker's departures, by the report.** None touches a result:
   - the shell run's hold was taken in a call of its own, before the run and not in the one-call form; the release was issued;
   - the light checks ran outside a hold, `node --test` for about 116 s.
6. **Next:**
   - the pull request's body to 97019e91;
   - the build gates' read parts at 97019e91, the architect's and the reviewer's;
   - E-R1 at the port.

## Amendment 7 — 2026-11-27 — the custodian's: the architect's read part at 97019e91

*References only. Nothing above is edited.*

1. **The read part** is filed at `state/consults/gates/2026-11-27-text-id-reopen-with-a-recorded-declaration-build-gate-architect-read-part.md`. It read the form at main 5e9b2184b7fb235fb488afe538ad451f331fdf30 and the code at 97019e9198a9a2d110d0d686ce8166574547d4ce. It gives no verdict.
2. **Scope, in so many words** (ADV-2026-11-27-30 item 1), by the report's section 1:
   - every changed file is inside §7's scope as its "each" lines resolve at the base;
   - every change is inside §2 and §4 as gated.
   - Its count agrees with Amendment 6: 919 lines, every row of the table resolving against the numstat.
3. **F4** (Documentation, no code): its pair in `protocol/skp/tests/conformance/README.md` is read in place. Those words are the build worker's. A worker applies the pair with no re-gate, in the correction commit, and the PR body lists it.
4. **To the advisor**, in one message once the reviewer's read part is filed:
   - **F1 and F2**, by the report: E-R1 as written cannot reach its step (5). The save of step (1) keeps the project held in the window, so the reopen of step (3) is refused as `skp.project_open_elsewhere`; and step (4) does not wait for the replaced dataset's close. The correction changes the e2e step. It bears on the advisor's words: ADV-2026-11-27-30 item 2 rests row AH8 on E-R1 (5), and item 4 reads E-R1 (3).
   - **F3**, before anything else (ADV-2026-11-27-30 item 1): text-id's own step `TEXTID'` (d), on the base and outside this piece's changes, makes the same save and same-window reopen. It is text-id's E-1 (d) control, and it runs in text-id's series at the port.
   - **The README section's clause (3)**, which describes an outcome the step cannot reach as written, and the list of acts a correction would change. Both are ruled text, so they go unreworded.
5. **F5** is for the run part, and nothing changes for it. The report's note on `frontends/shell/src/e2e-test-surface.ts` (a comment naming one caller of the hooks) concerns a file outside §7. It goes to the custodian's queue.
6. **§7:** by the report, a correction of E-R1 adds lines to the e2e row. If it does, that is recorded as class 8 again, and §7 is not edited.
7. **Next:**
   - the reviewer's read part, which is running;
   - one advisor message;
   - one correction commit, as ruled.

## Amendment 8 — 2026-11-27 — the custodian's: the reviewer's read part at 97019e91

*References only. Nothing above is edited.*

1. **The read part** is filed at `state/consults/gates/2026-11-27-text-id-reopen-with-a-recorded-declaration-build-gate-reviewer-read-part.md`. It read the form at main 5e9b2184b7fb235fb488afe538ad451f331fdf30 and ran the code at 97019e9198a9a2d110d0d686ce8166574547d4ce. It gives no verdict.
2. **What it observed at the head**, by its report:
   - scope: no changed file outside §7, and nothing to the advisor under ADV-2026-11-27-30 item 1;
   - §7's count: 919 lines over 39 files, each row equal to Amendment 6's table;
   - M-RD1 to M-RD7: each red at its own test's assertion, each reverted with a clean tree after it. M-RD8 is E-R1's, at the port;
   - the suites that start no app, and the branch's CI at the head: green.
3. **Both read parts find the same two defects, on their own:**
   - E-R1's step (3) is refused as `skp.project_open_elsewhere`, so the step never reaches (5). This is the architect's F1 and the reviewer's C-1. The reviewer names the kernel test that asserts that refusal as its control.
   - Text-id's own `TEXTID'` (d) does the same, on the base. This is the architect's F3, and C-1's note outside this piece.
4. **The two read parts differ in two places:**
   - **Step (4)'s unawaited close.** The architect's F2 makes it a correction (add a wait). The reviewer names it for a source comment, not blocking.
   - **S-R2's `file:id` fixture.** The architect's F5 says no correction is owed. The reviewer's E-1 says the correction would change test data only, and leaves it to the advisor or the custodian.
   - Both go to the advisor, unresolved here.
5. **The README section's clause (3)** is untrue at the code by both read parts (the architect's section 8, the reviewer's C-2). It is ruled text, so it goes to the advisor unreworded.
6. **The architect's F4** stands as Amendment 7 item 3. The reviewer reports no documentation finding.
7. **To the advisor, in one message:** items 3, 4 and 5 here, with Amendment 7 item 4.
8. **Next:**
   - the advisor's ruling;
   - one correction commit, as ruled;
   - the run part, at the port.

## Amendment 9 — 2026-11-27 — the custodian's: ADV-2026-11-27-31, after the merge and before the correction

*References only. Nothing above is edited. Written before the correction's code.*

1. **The ruling** is filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-31-both-e2e-steps-corrected-before-the-port-textid-d-and-e-r1-no-gate-runs-again-the-readme-section-replaced-whole.md`. It rules E-R1 corrected by a worker, with no gate run again.
2. **The merge** (the ruling's item 3, step 1) is b018f9145cdc313cc827f4c122386edfa552717b. Its parents are 97019e91 and text-id's corrected head b7a3dae6b9f5c29262bc7472b1b4f1bd8ca024d2, and it merged with no conflict (`state/consults/gates/2026-11-27-text-id-opens-for-the-session-by-row-position-correction-31-worker-report.md`).
   - Its own lines are text-id's correction: 71 insertions and 4 deletions in two files.
   - By §7's counting line, they are counted out by ranges.
3. **Class 9, on the ruling's items 3 and 4.** E-R1 gains two acts, and its steps keep their numbers:
   - Step (3) begins by opening `no-id-column.parquet` and waiting for the close of step (1)'s open. Then comes the control, as written.
   - Step (4), after its open, waits for the close of the control's open. Then it removes the first folder.
   - The wait is text-id's function. Step (5) and M-RD8 do not change, and no assertion of the step is removed or loosened.
   - The step's doc comment follows the acts, in the worker's words.
4. **The correction commit** holds four things and nothing else:
   - the step, with its doc comment;
   - the e2e README section, replaced whole by the ruling's item 6. If the corrected step does not meet a clause, the clause goes to the advisor before the commit;
   - S-R2's comment: the ruling's item 5 span and new line;
   - the architect's F4 pair (Amendment 7 item 3).
5. **The reading under the ruling's item 5.** In this form, "real fixture file" means a file under `protocol/skp/tests/data/`, not a refusal made by hand. The fixture file does not change in this piece.
6. **Class 8 again** (the ruling's item 3, step 4): the count is taken at the correction's head by §7's own command, with the merge's lines counted out by ranges. §7 is not edited.
7. **Unchanged** (the ruling's items 7 and 8): row AH8 and its result-log line, and KNOWN-LIMITATIONS item 3.
8. **Next:**
   - the correction commit, with the suites that start no app and `node --check` of the file green at its head;
   - each gate reads the merge and the correction in its run part.
