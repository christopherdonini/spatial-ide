# The advisor's ruling ADV-2026-11-27-24, under the human's delegation of 2026-11-13, not the human's words: text-id's C1 follow-up piece takes way (a); the field `identity_source`, carried by the engine and passed through by the kernel; `skp/0.17` on one protocol line, with the recovery offer behind it; D-R1 and D-R2 (ii) in the advisor's words; no owner line

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-24.md in the advisory folder, 9635 bytes, sha256 1e3d55fe2b60613cf60a100f124de697feaf3add7c37fbb398df4391ad2ee829, UTF-8, last modified at 2026-11-27T12:11:06Z by the file system. It was named by a session message received before 2026-11-27T12:11:28Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-24, to the custodian, 2026-11-27 (12:10Z). The follow-up piece for text-id's C1, `text-id-reopen-with-a-recorded-declaration`: OPEN-A1 to OPEN-A5 of the architect's form draft, and the `protocol/` place.

Read by me: the draft as filed on main 3b630615, whole. At text-id's head 2df8b4ae: `admit_identity` and `set_aside_outcome` in `engine/src/dataset.rs`; the two identity variants and their docs in `engine/src/error.rs`; `admit_column_type` and `IdSource::as_envelope_value` in `engine/src/identity.rs`; the `identity_unusable` and `crs_assertion_conflict` arms of `error_of` in `kernel/src/skp.rs`; in `kernel/src/project/mod.rs` the read of the project file, the request literal and `open_error_of`; `rowPositionOffer`, its doc and `rowPositionOptions` in `AdmissionPanel.tsx`; `RefusalBlock.tsx`; the sort in `formatRefusal.ts`; SKP-V0 §4 item 13 and §5; ADR-016 Amendment 3; KNOWN-LIMITATIONS item 3. On main: rule (00) in `governance/AUTONOMY.md`; ADV-2026-11-23-15 item 4's reading; ADV-2026-11-23-35. By git: every site in `engine/src` that builds `IdentityUnusable`, and that the two old branches are not merged into main. Not read: `dataset_ref.rs`, the declaration form, `openProject.ts` in this round, any test, the e2e suite, the MCP adapter, the form of `identity-scan-refuses-a-null-by-name`.

1. **OPEN-A1: way (a).** The offer is not made at a reopen whose project file records a declaration of the column `id`.
   - ADR-016 stays as the human accepted it, and the code is made to follow Decision 1.
   - Way (b) would drop a recorded declaration that the operator never sees, and change what a later save records. Not taken.
   - KNOWN-LIMITATIONS item 3: by my reading, "A file whose `id` column cannot serve is still refused, and the app then offers a second choice" speaks of the file's own `id` used with no declared mapping, which is Decision 1's case. The human's sentences there are not edited by this piece. If a gate reads that sentence otherwise, it comes to me.

2. **OPEN-A2: the field is `identity_source`, valued `file:id` or `mapped:<column>`. One thing changes in the draft: the engine carries it, and the kernel passes it through.**
   - Not `declared`. That key is already on the wire with another meaning: on `engine.crs_assertion_conflict` it is the CRS the file declares (`error_of`, and SKP-V0 §5's own list).
   - SKP-V0 §5: "`fields` carries that variant's own named fields as strings". The draft's §0 rests on that sentence to keep the kernel from deriving the fact. By the same sentence, the wire's field is a field the variant has. A `bool` named `declared`, which the kernel renames and composes into `mapped:<column>`, is not that, and it gives those words a second renderer.
   - So `IdentityUnusable` gains the field under the wire's name, valued by the engine's own `IdSource::as_envelope_value` for the source it checked. The kernel's arm passes it as it passes `column`. `Display` stays unchanged.
   - What I read for it: `source` is built before the first of the four sites in `admit_identity`; `admit_column_type` is called after it and lives in the module that holds `IdSource`; the five sites the draft names are all the sites in `engine/src` that build the variant.
   - The drafter restates §2 items 1 to 4, §4's rows and mutations, §9 item 5 and the clause checks for it. If the engine cannot carry it so, that comes to me before the form commits.

3. **OPEN-A3: `skp/0.17`, with the future-version fixture at `skp/0.18`. The piece may hold the `protocol/` place while text-id holds it.**
   - It is built on text-id's head, so rule (00) is met as ADV-2026-11-23-15 item 4 reads it, and as text-id itself holds the place on the identity route. The place is one line: the identity route at `skp/0.15`, text-id at `skp/0.16`, this piece at `skp/0.17`.
   - `skp/0.16` freezes when text-id merges (SKP-V0 §4 item 13), and this piece merges after it. So the field cannot ride `skp/0.16`.
   - It never merges before text-id. Its PR stays a draft until text-id is on main. A move of text-id's head comes in by a merge commit with the reviewer's narrow read.
   - Before the bump's commit you check again that no branch holds `skp/0.17` in code.
   - **The recovery offer now follows this piece.** It is built on this piece's head and takes the next unused literal after `skp/0.17`. This replaces ADV-2026-11-23-35 item 2 for its base. That ruling's item 3 now reads: its build is held at least until this piece's build has a pushed head with its suites green. Where a record of it names a figure, an amendment of yours corrects it before its code. If a place would stand free for that hold alone, tell me at once.

4. **OPEN-A4: D-R2 (i) as drafted. D-R1 and D-R2 (ii) in other words, mine.** Both Olds are the draft's.
   - D-R1, `engine/src/error.rs`, the `IdentitySetAsideRefused` doc. The draft's New has the other two cases need a changed data file. At a reopen, a changed project file can lead to another file as well. The New, wrapped as that doc's lines are:

````text
Through the shell, none of the three is reached unless something changes on disk between the refused attempt and the choice. The shell offers the choice only beside an `engine.identity_unusable` refusal whose `identity_source` is `file:id`, which a declared column never gives. So the first is reached only at a reopen whose project file gained a declaration in between, and the other two only when the file the choice opens is no longer the file that was refused. All three can be reached through another client.
````

   - D-R2 (ii), `rowPositionOffer`'s doc. The draft's New calls the refused `id` a declaration. A declared `id` is the same column of the file, checked under a declaration.

````text
New: At a reopen the recorded claims are the kernel's to send and this function does not see them; the refusal's `identity_source` says whether the engine checked `id` as the file's own column, with no declaration (`file:id`), or as the column a declaration named (`mapped:id`), which at a reopen is the project file's. Only the first is offered the choice (ADR-016 Amendment 3, Decision 1).
````

   - Each clause, against the code I read:
     - `rowPositionOptions` removes `identity` from the choice's options, so at a direct open no declaration goes with the choice.
     - At a reopen the kernel reads the project file at each call and sends its recorded identity with the choice as sent.
     - The engine checks `id` as the file's own only when no declaration came, and a file with no `id` column is then opened and not refused. So a `file:id` refusal means that the attempt carried no declaration and that the file had an `id` column.
     - The type check reads the schema and the scan reads the column, so the same file gives the same answer.
     - "Which a declared column never gives" and "only the first is offered" are what this piece builds. Its tests prove them.

5. **OPEN-A5: no owner line.** The refusal's message, its fields and R-ENG say what was tried and with whose claims. A route at such a reopen stays undecided in ADR-016.
   - What the operator newly sees is one more field row beside every refusal of this code, at a direct open as well: the block shows each field's key and value, sorted by key.
   - It is a wire fact shown as the wire carries it, as `candidate_columns` is, and not an owner's sentence. So it carries no placeholder mark. That is my reading, and I list it for the human.

6. **Words.** The walkthrough row after AH7 and the e2e README entry come to me before they are committed. The row's id and the entry are the next unused over text-id's head and every unmerged branch (rule (00a)). If the build finds a sentence of KNOWN-LIMITATIONS, of the walkthrough or of a README that the new field row or the missing offer makes untrue, it comes to me.

7. **Overlap.**
   - A's and B's rows are separate Parts and entries, as you read rule (00a).
   - The two old branches: by my git, neither is merged into main. Rule (00) counts pieces in progress and PRs awaiting merge. Your overlap rows name each branch's node and its status. A branch whose piece is neither in progress nor in an open PR is not counted, and the row says so. If one is in progress, it comes to me before the form commits.
   - `identity-scan-refuses-a-null-by-name` merges after this piece. Its code is built on this piece's head. If it starts earlier, this piece's head comes in by a merge commit before its gates. An amendment of yours to its form records this before its code. This form's gates read that form's §2 against item 2 of this form's §2.

8. **The form.** It commits with your overlap rows and with an Amendment 1 that carries this ruling: item 2's restatement by the drafter, and item 4's two texts in place of the draft's. Then its two form gates run on the form as amended.
   - The gates read the form against the template and against ADV-2026-11-27-22 item 4 themselves. Nothing rests on the draft header's list of what was read.
   - Its build gates run in two parts, as for the other pieces.

9. **The port.** E-R1 takes a turn of its own after text-id's series. When its code and its read parts' corrections are in, it goes ahead of any series that has not started. It displaces no run that has started.

10. **Text-id's merge check** is unchanged: the last bullet of ADV-2026-11-27-22 item 4 stands.

11. Nothing here is reserved. For the human, in the digest: the new field row (item 5); a new literal for one field (item 3); the recovery offer now behind this piece (item 3).
