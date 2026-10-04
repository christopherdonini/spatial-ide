# ADR-021's Note 2026-10-03 — the accepted text as rendered, for the human's confirmation before it lands

*The custodian's rendering (2026-10-03) of the Note the human accepted in typed words (`state/directives/2026-10-03-adr-021-note-acceptance.md`; question round 45, item 2): question Q-1's blockquote in `state/consults/2026-10-03-type-walk-null-literal-arithmetic-architect-draft.md`, lines 353-359, with the blockquote markers removed. **Two rendering choices,** neither settled by the typed words: (1) the heading's placeholder `<date>`, which the draft writes inside backticks, is filled as plain `2026-10-03`, without the backticks, matching every existing Note heading in ADR-021 (for example `## Note 2026-09-30 —`); (2) the bracketed clause replaces its bracket and its "If Q-2 is yes, add:" lead-in, and its first word is capitalised (`So`), because it opens a sentence after a period. Nothing else differs from the draft. The text below the rule is what would be appended to `docs/adr/ADR-021-row-filter-on-viewport-query.md` after one blank line, by the custodian's own docs commit, byte-identical, once the human confirms. Its sha256 is 412038b1b662c46e2aba202767632a47c808ee5c835a1a6c8edd4bc6dda579b8, and the text begins at this file's line 7.*

---

## Note 2026-10-03 — a NULL-valued `+`, `-` or `*` beside a decimal literal (the Note 2026-09-30, item 2)

*Appended under the human's ruling of 2026-10-03 (question round 43, item 1). The text above is unchanged, the Status line and the earlier Notes included. Implementation: `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`.*

1. A `+`, `-` or `*` whose operands are a NULL literal and a decimal literal within the bounds has a NULL value. Wherever it is compared, it counts as that decimal literal under the Note 2026-09-30, item 2, third, sixth and seventh bullets. So do its negation by unary `-`, and a `+`, `-` or `*` of a NULL literal with such a result.
2. It does not count as a NULL literal. Against text, against BOOLEAN, or against an integer the third bullet does not admit, it is refused as that decimal literal would be. Inside `+`, `-` and `*`, nothing changes.
3. No code, field or reason value changes. Decision 8's twelve codes stand.
