*Custodian's filing note (2026-09-29): gate 1 (architect) of PR #142, the A2-1 ADR texts, for PLAN node `b1-close-nul-column-names`. Reviewed: docs/a2-1-adr-texts @ f15b869715901d93f2233f1f702cdc3910a5122f (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its notes 1 and 5 are taken into Amendment 12 as one clarifying line each, before the code branch's first commit. Its note 2 is met by the PR body and the ledger, which name the 2026-09-29 sightings as the acceptance. Profile paths redacted at filing: none.*

---

Reviewed: docs/a2-1-adr-texts @ f15b869 — **Verdict: PASS** (with notes). Base main @ 834b2e7. PLAN node `b1-close-nul-column-names`. Full gating (AUTONOMY §21a, an ADR amendment). Docs only.

Read at f15b869 through the worktree `C:\dev\wt\a2-1-adr-texts`, and compared against the main checkout at 834b2e7. I have no Bash, so the byte-level proof (both span sha256 values, and the append-only diff `git diff origin/main...f15b869`) is left to the reviewer, as the task split it.

## Items

**1. The texts are word-for-word the draft: PASS.**
- The ADR-023 section "Amendment 2026-09-29 (Proposed; …)" matches the draft `state/drafts/a2-1-p0/A2-1-PREREGISTRATION.draft.md` §2a line for line. That covers the heading, the italic Authority paragraph, items 1–7 with their sub-bullets and the indented continuation paragraphs, dashes and backticks.
- The ADR-021 section "Note 2026-09-29 — a column that is not addressable is excluded from the namespace by name" matches the same draft's §2c line for line: heading, italic paragraph, items 1–2.
- There is no editorial drift. §2a's and §2c's own sub-headings, and the §2b table, are correctly left out.

**2. No Status line changes, and nothing above the appended text changes: PASS, subject to the reviewer's diff.**
- ADR-021: the Status paragraph (Accepted 2026-08-13) and the acceptance condition are unchanged at the head. The file tail up to the end of "Note 2026-09-24" is the same as main. The new Note starts after one blank line, where main's file ends.
- ADR-023: the Status, Drafted-by, Related and Record lines are unchanged. The tail up to the end of "Consequences (of the deferral, not of a decision)" is the same as main. The amendment starts where main's file ends.
- The line counts fit a pure append. I read the head and tail of main, and the whole of each branch file. The proof that no middle byte moved is the reviewer's three-dot diff showing additions only.

**3. The ADR-021 Note is a Note, not a Decision change: PASS.**
- Its form follows the 2026-09-24 precedent (the "Note 2026-09-24" section): a dated Note heading, the text above stated unchanged with the Status line included, and nothing in Decision 1–10 edited.
- Item 1 adds no code. It routes to the existing `skp.filter_column_not_filterable` and `skp.filter_unknown_column`, and says Decision 8's eleven codes stand. That agrees with Decision 8 and with Note 2026-09-24 item 2.
- It lands on the human's typed acceptance (the 2026-09-29 sightings, HUMAN RULING paragraph, and Fable's A2-1 paragraph (f)).

**4. The ADR-023 amendment is consistent, and its references resolve: PASS.**
- **§2:** addressability is declared a precondition, not a type policy. `admit_attribute_type` stays the one admission function, so §11 condition 3 is not engaged.
- **§3:** `ProjectionError` has six variants today (`engine/src/attributes.rs`, `enum ProjectionError`). One more makes the amendment's "seven codes … plus `skp.projection_empty_list`" arithmetic correct against entry 79's set, which is the sub-section "The human's rulings on the B1 items". The per-column order "name, geometry, identity, duplicate, type" keeps today's order and places the new check inside name resolution. The truncated prefix stays `projection_column_unknown`, which agrees with draft §1 12.1 (d), row Projection.
- **§8:** `projectable` is computed by the same per-column function, and no new wire member is added. That extends entry 79's `projectable` without a second field.
- **§10:** "the literal after `main`'s at merge" agrees with the 2026-09-28 S1 batch (A2-1 paragraph, "The protocol literal follows merge order") and the 2026-09-29 sightings (last line).
- **§11:** it has nine conditions, so the new one is item 10.
- **ADR-021:** there is no filter code in the amendment. Item 7 hands the namespace to the Note, and the Note uses Decision 8's existing codes.
- **References:** all resolve at f15b869:
  - `state/directives/2026-09-28-after-wave-s1-batch.md` (ruling line, A2-1 paragraph);
  - `state/directives/2026-09-29-a2-1-clarification.md`;
  - `state/cloud/wave2/W2-A2.md` ("Finding A2-1");
  - `state/drafts/a2-1-p0/` (the draft plus six probe and output files, committed on main at c1218dd, c7f7e3c and 804a62c, so tracked);
  - `engine/B1-PROJECTION-PREREGISTRATION.md` §10 (Amendments 1–11 exist).
- **Forward reference to Amendment 12: acceptable.**
  - ADR-023 and this amendment are both Proposed until B1's close. The reference is a section cite, not a path:line, so verify-cites does not resolve it. The route is recorded: the draft's own Status line and §1 12.1 (g), and `state/CUT-STATE.md`'s A2-1 entry, which says Amendment 12 is the first commit on A2-1's code branch, before any code.
  - Two conditions travel with it. (i) Round 25, item 2 fails by name any code of the class-9 addition that lands before Amendment 12. This PR is docs, which the ruling line orders before code, so this PR is clean. (ii) At B1's close, the acceptance gate must find Amendment 12 on main. If it is missing, the reference dangles and blocks acceptance.

**5. No contradiction with Fable's rulings (a)–(g): PASS.**
- (a) `schema[].name` is the bound name (amendment item 4). Neither text says anything about `known_columns` or `candidate_columns`.
- (b) The code name and the fields `column` and `detail` match exactly. Geometry at open is left to existing engine codes (item 7).
- (c) The covering at open is left to existing codes (item 7). k3 is absent.
- (d) Identity at open is left to existing codes (item 7).
- (e) The implementation points to the class-9 Amendment 12.
- (f) It is a Note, on typed acceptance.
- (g) No new wire member. The Note does not name a site, so O4 and `filterable_column_type` are untouched.
- The Addition (§8 item 34) belongs to the preregistration, not to these texts. Nothing here conflicts with it.

## Other checks
- **docs/01:** principle 8 holds. The refusal names the real reason, and the code routes existing codes only where they are true.
- **Operation class (ADR-006):** not applicable.
- **Perf (docs/08):** no claim.
- **Scope (docs/07):** within B1's contract, per the clarification.
- **Seams:** no code and no `pub` item.
- **Round 25, item 2 fail-by-name list:** nothing applies. There is no §7 overrun, no code ahead of the class-9 amendment, no `verify-mutation` claim, no branch-commit hash pin, and no five-line form.

## Notes (not blocking)
1. **The Note's refusal clause cannot be reached from the wire.** It says a predicate naming a non-addressable column is refused `filter_column_not_filterable`. But draft §1 12.0 E9 records that any U+0000 in predicate text is refused `filter_unparsable` first. Every non-addressable name at v1.5.5 contains U+0000 (draft §1 12.0 E1, E5, E10). So the clause binds the engine's namespace function, not a wire outcome. The load-bearing part is the namespace exclusion, which fixes E7's mistyped surrogate. For the code gate: N-5, which tests a constructed `Field`, must not be offered as wire proof. Any wire test of a NUL predicate should expect `filter_unparsable`. The human accepted the text as drafted, so it stays.
2. **The Note does not cite its own acceptance.** Its authority line names only the 2026-09-28 ruling. Under Fable (f), the acceptance is the 2026-09-29 sightings (HUMAN RULING paragraph). The text is byte-bound "as drafted", so do not edit it. The PR body and the ledger should name the 2026-09-29 ruling as the acceptance.
3. **The Note has no interim clause.** Note 2026-09-24 item 3 has one ("until that piece lands, the namespace is as decision 5 reads"); this Note does not. The gap is harmless because the node lands before B1 closes.
4. **ADR-021 is Accepted; ADR-023 is Proposed.** The accepted Note's definition of "not addressable" lives in ADR-023's Proposed amendment (item 2). The human's acceptance of that amendment at B1's close should be taken together with it. If it is declined, the Note refers to a definition that was never accepted.
5. **§2b is correctly absent from this PR.** The draft's Status line says "the texts in §2" land as the docs commit, which read literally includes §2b. But §1 12.1 (g) lists only the ADR-023 amendment and the ADR-021 note, and so does the human's ruling line. Landing the SKP-V0 §9.5 row before the literal bump would document a code the wire does not carry. Amendment 12 should say §2b lands with the code.

No ADR skeleton is needed: no decision is missing.
