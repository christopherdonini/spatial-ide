*Filed by the custodian as a draft, never appended (ADV-2026-11-23-33 item 3): the architect's draft of ADR-016 Amendment 3, a file whose own `id` column cannot serve opened on the session tier by the user's choice, with points (a) to (e) of item 4 and proposed strings, node:text-id-opens-for-the-session-by-row-position@adr-016-draft, dispatched at 2026-11-23T21:48:52Z, read at main a2d58940d283be8eb050730216f0e90b6084a0fd. Its run: Read 38, Grep 30, Glob 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T21:48:53Z to 2026-11-23T21:58:17Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 22052 bytes, sha256 598373a26126c28a0e27dfb354f880570c09ade77ff05fc24184023386e63a22, byte for byte, nothing masked, with one final newline added. The amendment is the human's to approve (ADV-2026-11-23-33 items 2 and 9); its words are the architect's, not the human's, and nothing in this file binds. The advisor writes it for the human's approval with an id.*

---

Draft: ADR-016 amendment for files whose own id column cannot serve (for the human's approval)
Read: C:/dev/wt/read-1123ag @ a2d58940d283be8eb050730216f0e90b6084a0fd

I used only Read, Grep and Glob and ran nothing. Every `path:line` below is at a2d58940. I cannot compute hashes; if filing needs pins, the custodian adds them by script. The brief says f0718827 (the tester's commit) holds the same code as a2d58940. I did not check that, because I have no git.

## 1. The confirmation

**Who did what.** The tester ran a throwaway kernel test at f0718827. It printed its results and asserted nothing (its report, "Failure classes"). I read the tester's report beside the code. Together, these make up the confirmation (ADV-2026-11-23-33 item 1).

**File A: `id` Utf8, no other integer column.**
- Plain open: refused, `engine.identity_unusable`. No declaration means the file's own `id` is used (`engine/src/dataset.rs:1981`). The column is found (`:1984`), so the type check runs (`:2028`). Utf8 falls outside the admitted integers (`engine/src/identity.rs:333`) and is refused (`identity.rs:336-344`).
- The message is the Display at `engine/src/error.rs:359-364` with the detail from `identity.rs:339-341`, which matches the report byte for byte.
- `candidate_columns` is empty because only Int64 and UInt64 columns are listed (`identity.rs:304`).
- Open with `id` declared: refused at the same line. It becomes `Mapped`, is found, and fails the same type check.
- No route on main opens file A. The code agrees with the report.

**File B: `id` Utf8 beside a unique `parcel_key` UInt64.**
- Plain open: refused the same way. `candidate_columns` is `parcel_key` (`identity.rs:299-315`).
- Open with `parcel_key` declared: opens as `mapped:parcel_key`, verified by the scan (`dataset.rs:2041-2105`).
- The code agrees with the report. The report's change of name from `fid` to `parcel_key` follows the fixture writer (`engine/src/fixture.rs:757-759`, `:772-774`).

**File C: no `id`, only `parcel_key`.**
- Opens on the session tier through the early return (`dataset.rs:1984`, `:2008-2010`).
- The statement in the report is `SESSION_IDENTITY_STATEMENT` (`identity.rs:150-154`), carried by describe (`kernel/src/skp.rs:2048-2051`).
- "No read or uniqueness scan" comes from the code's own comment and early return (`dataset.rs:1990-1992`). The run did not watch the scan counter.

**Disagreements: none.** Nothing here is a stop. Two limits, both stated by the report itself:
- the run went through the kernel only, with no shell;
- the file schemas come from the writer's code; the written files were not read back.

**Found by reading only (no one ran these).** They bear on the draft:
- A session-tier dataset whose file has its own `id` column has no precedent on main.
  - The filter's identity-alias rule fires only for a mapped identity (`engine/src/predicate.rs:1132-1144`).
  - The stream projects the source column under the alias `id` (`engine/src/stream.rs:1438-1440`).
  - A bare `"id"` in a WHERE clause binds to the file's base column (`stream.rs:1475-1478`).
  - So a filter naming `id` would be admitted and would filter the file's text column, while the batches and the hover carry the row position under the name `id`.
- A file with no `id` column refuses `id` in a filter as an unknown column (`predicate.rs:1204-1208`).

## 2. The amendment's text

````text
## Amendment 3 — a file whose own `id` column cannot serve, opened on the session tier by the user's choice (2026-11-23, appended — Proposed)

*Proposed: the human's to approve, under their message of 2026-11-23, item 3. The words are the architect's draft; they are not the human's. Nothing above this heading is changed.*

**Context.** §2 recognises one identity without a declaration, a column named `id`, and refuses a file whose `id` column fails the type check (§4 and the Note 2026-11-09) or the value checks run with the scan (§4, §5). Amendment 1 (items 1 and 5) opens a single file that has no `id` column on the session tier. A single file that has an `id` column the engine refuses has no such route: it opens only if the caller declares another column under §3, and a file with no admissible column does not open at all. Amendment 1 item 1 holds that the session tier is not a synthesized stable identity, because it claims no stability; what is open is only whether a caller may send a file that carries an `id` column to that tier.

**Decision.**
1. A caller may choose, at open, to set aside a single file's own `id` column and have the file identified on the session tier. The choice is explicit and the caller's alone: the engine never makes it, infers it or falls back to it (§1, §3), and without it a file whose `id` column cannot serve is refused as before. A client offers the choice only beside a refusal of the file's own `id` column in an attempt that declared no column, and shows that it carries the choice whenever it carries it into a further attempt.
2. The choice is admitted only when the file carries a column named `id` and that column cannot serve. The engine runs the checks it runs today without a declaration: the type check, which reads no value, and for an admitted type the whole-column scan, cancellable as §5 has it. Only when they refuse the column does it admit on the session tier. Amendment 1 item 1's sentence that §5's scan does not run on this path holds for a file with no `id` column; on this path a scan may run and refuse, and nothing of it is reported. If the column serves, the choice is refused by name and nothing opens. The choice together with a declared column, or over a file with no `id` column, is refused by name. A partitioned source is refused before either, as the Note 2026-11-23 has it.
3. The open is Amendment 1's session tier with nothing else changed: the same identity pair and generation rules, `by-construction-within-generation`, the same `describe.identity` values and statement, Amendment 2's candidate list, and Amendment 1 item 3's change handling. The file's `id` column is never read into identity, mapped, hashed or compared; non-integer keys stay undecided.
4. `describe.identity` records the choice: one member naming the column set aside (`"id"`) on such an open, present and null on every other. A client that shows the identity shows this member beside the session statement, so that the summary says the user chose row position.
5. On such an open the name `id` means the identity alone. The file's own `id` column is not projected, by the reserved-name rule, and a predicate naming `id` is refused as ambiguous, as under a mapped identity beside a file's own `id` column.
6. Nothing of the choice is saved or published. It is not recorded in a project file, and publish refuses this tier (Amendment 1 item 1). Opening a project saved after such an open refuses the file's `id` column again; the reopen then offers the choice again, and only the choice, and the file opens on the session tier only if the user makes it again.

**Consequences.**
- Control plane only: one member carrying the choice on `open_dataset` and on `open_project`, one on `describe.identity`, a refusal for item 2's cases, and a new SKP literal.
- In the engine, one admission arm, and the filter's identity-alias rule extended to this tier.
- A file refused for its values is scanned again before it opens this way. No performance claim is made (`docs/08`).
- The candidate list on such an open is the list the refusal carried, from the same function.

**Not decided here.** Composite and non-integer keys; the data doctor's proposal; a declaration route for a dataset that a project reopened (Amendment 2); the choice for a dataset that Recover opened.
````

The date and status in the heading are filled in at acceptance, as Amendment 1's were.

**How each requirement in the human's item 2 is met:**
- Chosen by the user: Decision 1.
- Never taken silently: Decisions 1, 4 and 6.
- The summary says so: Decision 4.
- Nothing saved or published: Decision 6. This rests on `kernel/src/dataset_ref.rs:219-221` and `:383-388`, where a session-tier open records `admission.identity` as null, and on `kernel/src/publish/mod.rs:518-520`.
- Opens exactly as a file without an `id` column: Decision 3.

**Two places where "exactly" has to be interpreted. The human should see both.**
- Decision 2, broad reading only: a file refused for its values is scanned again before it opens. If "exactly" includes cost, the narrow reading in part 4 meets it.
- Decision 5: `id` in a filter is refused on both paths. A file with no `id` column refuses it as unknown; this path refuses it as ambiguous. Without Decision 5, `id` would silently mean two different columns on one dataset.

The text embeds my recommendations for (b) and (c). Alternative wordings:
- **Decision 2 under the narrow reading:** "The choice is admitted only when the file carries a column named `id` whose type is text, which the type check finds without reading a value. A column refused for another type or for its values, a column that serves, a declared column, and a file with no `id` column refuse the choice by name. A partitioned source is refused before either, as the Note 2026-11-23 has it." If this is chosen, drop "A file refused for its values is scanned again…" from Consequences.
- **Decision 6 under (c) C1:** "Opening a project saved after such an open refuses the file's `id` column again, with no choice offered; that project does not reopen." Drop `open_project` from Consequences.
- **Decision 6 under (c) C4:** "A project cannot be saved while such an open is in it; the save is refused by name." Drop `open_project` from Consequences.

## 3. (a) Files, protocol, base

**Files the piece would change:**
- **Engine:**
  - `engine/src/dataset.rs`: an admission arm beside `:1984-2028`.
  - `engine/src/identity.rs`: the declaration type and the record of the set-aside column.
  - `engine/src/predicate.rs`: `identity_alias_ambiguity` at `:1132-1144`, and a session-tier text for the Display at `:352-357`, whose words say "mapped from".
  - `engine/src/error.rs`: the refusal for Decision 2.
  - `engine/src/lib.rs`, if a type is exported.
  - Engine tests.
  - The fixture writer needs no change: `StringIds` and `StringIdsBesideParcelKey` exist (`fixture.rs:757-759`), and so does `NegativeIds` (`:760`).
- **Kernel:**
  - `kernel/src/skp.rs`: the wire-to-engine mapping beside `:1150` and `:1754-1762`, and the describe member at `:2034-2051`.
  - `kernel/src/project/mod.rs`: the request literal at `:818-825`; under C2 it also carries the choice.
  - Tests: `kernel/tests/skp_admission_remediation.rs`, `kernel/tests/no_generation_in_persisted_artifacts.rs` (to prove nothing of the choice is saved), and `kernel/tests/project_reopen_skp.rs` under C2.
  - If the member goes on `OpenDatasetRequest`, every Rust struct literal must name it. My Grep finds `OpenDatasetRequest {` in 23 files. The form chooses the member's place with that in mind.
- **Protocol (yes, it changes):**
  - `protocol/skp/src/v0/commands.rs`: `OpenDatasetRequest` at `:21-40`, `IdentityInfo` at `:190-222`, and under C2 the `open_project` request.
  - `protocol/skp/src/v0/mod.rs`: the literal at `:136`.
  - `protocol/skp/SKP-V0.md` and `protocol/skp/tests/fixtures.rs`.
- **Wire fixtures (yes, they change):**
  - the `v0-open_dataset-request*.json` fixtures;
  - the three `v0-describe-response*.json` fixtures;
  - the conformance fixtures, for the literal.
- **Shell:**
  - `src/skp/types.ts`, `src/admission/admitDataset.ts`, `AdmissionPanel.tsx` (the second choice beside the form at `:572-576`, and the carried-choice line beside `:566-571`), `IdentityDeclarationForm.tsx` or a sibling, and `describeSummaryText.ts` / `DescribeSummary.tsx`;
  - under C2, also `src/project/openProject.ts`, `src/skp/client.ts`, and the reopen branch at `AdmissionPanel.tsx:276-277`;
  - tests and e2e.
- **Documents:** `docs/adr/ADR-016-…md`, `KNOWN-LIMITATIONS.md` item 3, and a Part in `frontends/shell/MANUAL-WALKTHROUGH.md`.

**Base: build on the identity route's head.** Reasons:
- The identity route's Scope (`governance/forms/frontends/IDENTITY-DECLARATION-ROUTE-FOR-SESSION-TIER-PREREGISTRATION.md:229-234`) shares most of these files: `commands.rs`, `mod.rs`, `SKP-V0.md`, the open and describe fixtures, `skp.rs`, `AdmissionPanel.tsx`, `IdentityDeclarationForm.tsx`, `types.ts`, KNOWN-LIMITATIONS item 3, and the walkthrough.
- It appends Amendment 2 and the Note 2026-11-23 to the end of ADR-016, and this amendment cites both.
- It holds the SKP literal `skp/0.15` (ADV-2026-11-23-26 item 3). This piece takes the next unused literal, which the advisor rules (ADV-2026-11-23-33 item 6).
- This piece also changes the wire, and the recovery offer has a literal of its own (ADV-2026-11-23-29), so the two share the `protocol/` place. The condition in ADV-2026-11-23-33 item 6 that would end the hold at once ("share no file and no `protocol/` place") does not hold.

## 4. (b) Which refusals offer the choice

**The refusals of a file's own `id` column today (no declaration):**
1. **Type outside the eight integers.** This covers text, floats, decimals, binary, dates and dictionaries. Refused at `identity.rs:336-344` from the schema alone; nothing is read.
2. **Name not addressable.** `dataset.rs:2019-2025`. The code's comment at `:2013-2018` says a native lookup on `id` never reaches this; its argument covers U+0000 only. I exclude it as unreachable by ordinary files.
3. **Negative value.** `dataset.rs:2076-2086`, after the whole-column scan.
4. **Repeated values.** `dataset.rs:2088-2097`, after the scan. By my reading of `count(DISTINCT …)`, a NULL also lands here. I did not run this.

Not refusals of the column: the partitioned refusal comes earlier (`dataset.rs:327-329`, and the Note 2026-11-23), and a scan error is `EngineError::Query`.

**Text type alone (the node's title).**
- Read only from the schema, so the open is exactly the no-`id` open in cost too.
- It covers the human's finding.
- It leaves a file with a float `id`, or a repeating or negative integer `id`, unable to open unless another integer column exists.
- The form must name which Arrow types count as "text".

**Every case where the column cannot serve (the human's item 2).**
- Covers cases 1, 3 and 4.
- Cases 3 and 4 cost a second scan if the engine re-establishes the fact itself. Taking the client's word instead would make the engine's statement "this dataset has no admissible identity column" (`identity.rs:151`) something the engine never established, and would let a client set aside an `id` column that serves.
- An integer `id` shown beside an integer row position under the label `id` is easier to misread than text.

**Recommendation: every case where it cannot serve, with the engine re-establishing it (Decision 2 as drafted).** The human's item 2 says "cannot serve", and ADV-2026-11-23-33 item 2 makes departing from a requirement a block. The cost is stated in the amendment. If the human reads "exactly" to include cost, take the narrow wording in part 2.

## 5. (c) Projects saved after such an open (a point for the human)

**As the code stands:**
- `DatasetRef::linked` records `admission.identity` only for a mapped identity (`dataset_ref.rs:219-221`, `:383-388`). A row-position open therefore saves `"identity": null` (`:292-297`), and nothing of the choice is saved.
- Opening the project sends that null (`project/mod.rs:818-825`), so the engine refuses the text `id` again.
- A reopen refusal opens no remediation form (`AdmissionPanel.tsx:276-277`; `openProject.ts:13-14`).

**The choices:**
- **C1, as the code stands.** Nothing is saved, nothing is silent, and it meets the words. But the save writes a project that can never reopen, and the operator finds out only at reopen.
- **C2, reopen asks again.** The project records nothing. A reopen refused for the file's own `id` offers only the row-position choice, never the declaration, which Amendment 2 leaves undecided for reopened datasets. The user makes the choice again each time.
  - Meets every requirement and leaves no dead end.
  - Costs: a member on `open_project`, and a change to the "no form on reopen" rule for this one refusal (that rule is Amendment 54 item 5 (g)'s).
- **C3, the project records the choice and reopen applies it.** Breaks "nothing of it is saved", and on reopen it would be taken without a new choice. Per ADV-2026-11-23-33 item 2 this departs from a requirement, so it blocks.
- **C4, refuse a save while such an open is in the project.** Honest and meets the words strictly. The cost is that the filter, style and view of such a session cannot be saved.

**Recommendation: C2.** If the human wants the piece kept off the reopen path, C4 is the fallback; C1 is not.

## 6. (d) Amendment 2 and KNOWN-LIMITATIONS item 3

**Amendment 2** (ADV-2026-11-23-26 item 1) needs no new words:
- Its Decision 1, "On the session tier alone", covers a row-position open, so the candidate list and the offer beside the Open buttons appear there too.
- "Nothing is added to what a project saves" stays true under C1, C2 and C4.
- "a declaration route for a dataset that a project reopened" stays undecided, which matches C2.

**KNOWN-LIMITATIONS item 3, the paragraph at `KNOWN-LIMITATIONS.md:70`.** ADV-2026-11-23-26 item 2 says the rest of this paragraph is the human's wording. Two of its sentences become untrue:
- "This is the one case in which a row position stands in for identity."
- "A file whose `id` column cannot serve is still refused."

Because they are the human's words, the human answers them under the wording-blocks rule, even though ADV-2026-11-23-33 item 2 gives the advisor the piece's KNOWN-LIMITATIONS words. My proposals are in part 8.

**D4 (ADV-2026-11-23-26 item 2).** "For a file that opened this way with Open GeoParquet" does not cover the new way of opening. That is the advisor's to reword.

**Documentation finding (must be fixed before merge, since the piece holds item 3).** Item 3's comment (`KNOWN-LIMITATIONS.md:68`) cites `engine/src/identity.rs:196-217` and `engine/src/error.rs:234-238`. At a2d58940, `admit_column_type` and the `IdentityUnusable` Display are at `identity.rs:324-346` and `error.rs:359-364`.

## 7. (e) Number

**Amendment 3.**
- Built on the identity route's head, it is appended after Amendment 2's acceptance line and the Note 2026-11-23 (ADV-2026-11-23-27 item 4). It merges after the identity route.
- If built on main, it would land after the Note 2026-11-09 while Amendment 2 is absent.
  - Its references to Amendment 2's candidate list and to the Note 2026-11-23 would not resolve.
  - Both PRs would append at the end of the file. Whichever merges second would conflict at the end of the ADR and in item 3, and the ADR could end up ordered 1, 3, 2.
  - ADV-2026-11-23-26 item 5 compares Amendment 2's appended text byte for byte at the merge.
- So on main, the text would have to drop those references, and the two merges would have to be ordered by ruling.

## 8. Proposals: strings and KNOWN-LIMITATIONS words (the advisor's to word; ADV-2026-11-23-33 item 2)

**S-1, the button.** Shown when `engine.identity_unusable` names `id` and the attempt declared no column: "Open for this session by row position"

**S-2, beside the button.** "This file's own id column cannot serve as its identity. You can open it as a file with no id column opens: features are identified by their position in the file, for this session only. Nothing of this choice is saved or published, and opening the file again asks again. If the column was refused for its values, it is checked across the whole file again first."

Clause check:
- "cannot serve": the button is shown only after that refusal (`AdmissionPanel.tsx:31-35`).
- "as a file with no id column opens … for this session only": `dataset.rs:2008-2010`, `identity.rs:150-154`.
- "not saved": `dataset_ref.rs:383-388`.
- "not published": `publish/mod.rs:518-520`.
- "opening again asks again": true for Open GeoParquet. For Open project it is true only under C2; under C1 it is false (`AdmissionPanel.tsx:276-277`).
- "checked again": true under the broad reading only.

**S-3, the summary line, from the Decision 4 member.** "You chose to open this file by row position: its own id column is not its identity." The member is non-null only on such an open.

**S-4, the engine's filter refusal on this tier (an engine fact).** "refused: `id` is ambiguous — this dataset is identified by row position for this session, and the file also carries its own column named `id`; a predicate cannot say which one it means". This replaces the "mapped from" wording at `predicate.rs:354-356` for this tier.

**Named, not changed.** On the session tier, a projection request for `id` is refused with "…this dataset's identity is mapped from `file_row_number`" (`engine/src/attributes.rs:253-256`), and "mapped" is untrue there. Ordinary use does not reach it: describe marks `id` as not projectable (`skp.rs:2064`, through `attributes.rs:468`), so the shell never asks for it.

**K-1 (the human's sentence).** Replace "This is the one case in which a row position stands in for identity." with "This and the choice below are the only cases in which a row position stands in for identity."

**K-2 (the human's sentence; under C2).** Replace "A file whose `id` column cannot serve is still refused." with "A file whose `id` column cannot serve is still refused, and the identity form then offers a second choice: open the file for this session by row position. Chosen, it opens as a file without an `id` column does, the summary says that you chose it, and its own `id` column cannot be filtered on or projected. Nothing of the choice is saved or published: opening the file or the project again refuses the column and asks again."

Clause check:
- "cannot be filtered on": true only with Decision 5's change (`predicate.rs:1132-1144` today).
- "projected": `attributes.rs:468`.
- "the project … asks again": true under C2 only.
