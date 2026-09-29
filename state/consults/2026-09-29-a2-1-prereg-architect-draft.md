# A2-1 preregistration — the architect's drafting consult (2026-09-29)

*Custodian's filing note: this is the architect agent's hand-back on the custodian's drafting brief for PLAN node `b1-close-nul-column-names`, read at main 1af041b. It is a drafting consult, not a gate, and it is not in `state/gate-log.json`. It is copied below from the hand-back message, de-indented, with the closing "Files read" list's absolute paths shortened to repository paths.*

*What the custodian did with it:*
- *Its section 4 named four probes it could not run, P-1 to P-4, and two optional ones. The custodian ran them at main c1218dd: `state/drafts/a2-1-p0/extra-probe.rs.txt` and `extra-output.txt`. P-1's outcome is not the one predicted here (an `engine.query` open refusal): the open succeeds, with the false sanity reason, and the bbox stream fails after the mint.*
- *The reproducer and control test names were read at c37b427.*
- *The edited draft for Fable is `state/drafts/a2-1-p0/A2-1-PREREGISTRATION.draft.md`, which lists every edit made to the text below.*

---

**Verdict:** n/a (drafting consult, not a diff review). main @ 1af041b

Here is the preregistration draft for `b1-close-nul-column-names`. Nothing is committed and I ran no command. Five things must happen before it can be committed:
- **The P0 files are untracked.** `state/drafts/a2-1-p0/` is untracked at 1af041b, and the amendment cites it. Commit it to main first and fill in `<p0-commit>`. The standing round-14 rule (nothing tracked may cite an untracked file as Authority) applies if these files are read as Authority; they are evidence, but committing them removes the question.
- **Fable's sight is not yet recorded.** Fill `<sight>` with the directive path of Fable's sight.
- **I did not read the reproducer file.** `engine/tests/b1_projection_hostile_names.rs` exists only on `cloud/wave2-A2` at c37b427, and I have no Bash. The two reproducer names below come from `state/cloud/wave2/W2-A2.md`. The worker must read the file at c37b427 before inverting the tests, and name the three control tests from it.
- **Hashes are unrecomputed.** The draft carries no hash pins, so there is nothing to recompute today.
- **Fable's paragraph names a "filterable" describe fact that does not exist.** `FieldInfo` in `protocol/skp/src/v0/commands.rs` has only `projectable`. See item 1 of the last section.

The report's sections follow, in its own order:
1. **The amendment text** (Amendment 12, with its parts 12.0 to 12.5, §7, the §8 items 25 to 33 and §9).
2. **The ADR-023 amendment text,** with the SKP-V0 §9.5 row and a drafted ADR-021 Note.
3. **The OPEN list** (a) to (f), each with the architect's recommendation.
4. **What the P0 has wrong or is missing,** items 1 to 10.

These sections are carried into the edited draft, `state/drafts/a2-1-p0/A2-1-PREREGISTRATION.draft.md`. That draft's "Edits from the consult" list names every change, so this record keeps only what the draft does not reproduce: the section 4 list, as the architect wrote it.

**Section 4, "What the P0 has wrong or is missing":**
1. **The "filterable" fact.** Fable's paragraph names describe's "projectable and filterable facts". At 1af041b there is no filterable fact: `FieldInfo` has only `projectable`.
   - **Recommendation:** add no new member. It would be a wire field with no consumer, which breaks the caller rule. O4 still holds because `filterable_column_type` is the single site for namespace membership and for refusing a referenced name.
2. **P-1 is unprobed (the sanity path).** The covering probe declared a PROJJSON CRS, so `sanity_check` most likely returned early at "no format rule applied".
   - With the format default and no `bbox` member, `covering_sample` would put U+0000 into SQL text at open.
   - My prediction: today the open refuses `engine.query`. That is a second covering defect, and N-14 depends on the probe.
3. **P-2 is unprobed (a typed filter comparison).** The filter probes used only `IS NOT NULL`.
   - `namespace_admit`'s `BTreeMap` keeps the last of two equal truncated names.
   - So in c03's order with different types, the surrogate carries the other column's type.
4. **P-3 is unprobed (identity typing).** c19 used equal types, so the case that would expose wrong-column typing was never run.
5. **P-4 is unprobed (U+0000 in predicate text).** This is not a column name, but `build_sql` would put a raw NUL into SQL text, and the prepare fails inside the producer, after the mint. If the probe confirms it, it is a separate finding, not A2-1.
6. **A design hazard under (a).** Unless `filter_surrogate` excludes these columns, the surrogate SQL carries U+0000, and every predicate on such a file is refused `filter_rejected_by_binder`. E3 already predicts this; N-6 pins it.
7. **Optional probe:** two names that truncate to the same prefix (`a\0x`, `a\0y`), and a U+0000 name that DuckDB's case deduplication renames. The positional rule predicts that both are classified correctly.
8. **The DESCRIBE read is not bound to the cancel token.** It reads only the footer, so no probe is needed; §6 should state it.
9. **Untracked evidence.** `state/drafts/a2-1-p0/` is untracked at 1af041b. Commit it before the amendment cites it.
10. **The reproducer file.** I could not read it. Its three control tests and the two reproducers' exact assertions must be read at c37b427 before they are inverted: a test written to an imagined interface fails the seam rule.

**Files read:**
- `engine/B1-PROJECTION-PREREGISTRATION.md`
- `docs/PREREGISTRATION-TEMPLATE.md`
- `docs/adr/ADR-023-attribute-projection-on-viewport-query.md`
- `docs/adr/ADR-021-row-filter-on-viewport-query.md`
- `protocol/skp/SKP-V0.md`
- `engine/src/dataset.rs`
- `engine/src/attributes.rs`
- `engine/src/predicate.rs`
- `engine/src/identity.rs`
- `engine/src/stream.rs`
- `kernel/src/skp.rs`
- `state/drafts/a2-1-p0/`
