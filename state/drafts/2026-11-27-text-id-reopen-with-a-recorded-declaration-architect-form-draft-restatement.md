# The architect's restatement of its form draft for C1's follow-up piece, under ADV-2026-11-27-24 items 2, 4 and 5

*Filed by the custodian, 2026-11-27, as a draft: it is not a form, binds nothing and takes no gate-log row. It answers ADV-2026-11-27-24 items 2, 4 and 5 (filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-24-text-ids-c1-follow-up-way-a-identity-source-carried-by-the-engine-skp-0-17-on-one-protocol-line-the-recovery-offer-behind-it.md`), node:text-id-reopen-with-a-recorded-declaration@form-draft-restatement. The same architect was resumed on its draft, filed at `state/drafts/2026-11-27-text-id-reopen-with-a-recorded-declaration-architect-form-draft.md`. It read the draft at main 3b630615 in D:/wt/read-1127c and the code at text-id's head 2df8b4ae in D:/wt/read-1127b, both detached and read only; the custodian checked both HEADs by git. Its run, from its completion notice only (ADV-2026-11-26-02), was 5 tool uses. Its pairs are carried into the form's Amendment 1 at the form's commit. Below the rule, the restatement as handed back (saved by Write with the harness's indent removed; 19638 bytes, sha256 2b577d0dc4d1fa544cef3ce74f2460b9f6d910bc70b23aa2aca9686259d3c276), byte for byte.*

---

RESTATEMENT: text-id-reopen-with-a-recorded-declaration, drafted at base 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e, read against the filed draft at main 3b630615a7c11dc514557c712f54453a94b35e2e, under ADV-2026-11-27-24

The engine can carry `identity_source` at all five sites, so nothing has to go back to the advisor before the form commits. Below are 14 Old/New pairs for the custodian to file as the form's Amendment 1. One place, line 139, is covered by two pairs. Every Old is byte-copied from `state/drafts/2026-11-27-text-id-reopen-with-a-recorded-declaration-architect-form-draft.md` at 3b630615 and marked verbatim. Each heading also gives the filed file's line number, for the custodian; the form cites none. Every `path:line` inside a New is at 2df8b4ae. The ruling's copy is at `<scratch>/adv-27-24.md`, and the advisor's two texts are carried from it byte for byte. Everything else is paraphrase.

**Can the engine carry the field at every site?** Yes, at all five sites that build `IdentityUnusable` in `engine/src`:
- **The four in `admit_identity`** (`engine/src/dataset.rs:2077`, `:2098`, `:2156`, `:2167`) all come after `source` is built (`:2046-2060`). `source` is only `IdSource::File` or `IdSource::Mapped`, so `IdSource::SessionOrdinal` never reaches them. `source` is moved only at `:2111` and `:2178`, which come after every site.
- **The fifth** (`engine/src/identity.rs:382`) is in the module that holds `IdSource` (`identity.rs:33-56`) and `as_envelope_value` (`:82-90`). It takes the source as a parameter.
- **Two exhaustive destructures change with it, and nothing they show changes:** the `Display` at `engine/src/error.rs:380` and the kernel's arm at `kernel/src/skp.rs:2248-2251`.

---

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

---

**Left unchanged, on purpose:**
- **The OPEN questions section** (filed lines 271-280). It is the record of the questions the ruling answers; Amendment 1 carries the answers. OPEN-A2's alternative (`declared`) and OPEN-A5's mention of `[P6 placeholder]` are what was asked, not what the form does, so I give no pairs for them.
- **§0 Disclosure** (filed line 34): "the variant does not carry that fact" stays true at the base.
- **§7** stays as declared. Moving the work into the engine trades a few lines between the kernel and the engine and moves no ceiling.

**Not read this round:**
- I did not re-read `engine/src/dataset.rs`, `kernel/src/skp.rs`, `kernel/src/project/mod.rs`, `AdmissionPanel.tsx`, `openProject.ts`, `RefusalBlock.tsx` or `formatRefusal.ts`. Their cites rest on my first round's reads at the same commit.
- This round I read only:
  - the ruling, whole;
  - the filed draft, whole;
  - `engine/src/identity.rs:25-104` (`IdSource` and `as_envelope_value`);
  - a search of `engine/src` for every `IdentityUnusable`.
- Still not read: `kernel/src/dataset_ref.rs`, `IdentityDeclarationForm.tsx`, `engine/tests/b1_nul_declared_identity_no_scan.rs` (N-R1 names only the way it builds its file), any other test, the e2e suite, the MCP adapter, and the form of `identity-scan-refuses-a-null-by-name`.
- I wrote nothing about the ruling's items 3, 6, 7 and 9 (the literal and the place, the words, the overlap, the port). They are the custodian's to record.

Files:
- <scratch>/adv-27-24.md
- D:/wt/read-1127c/state/drafts/2026-11-27-text-id-reopen-with-a-recorded-declaration-architect-form-draft.md
- D:/wt/read-1127b/engine/src/identity.rs
