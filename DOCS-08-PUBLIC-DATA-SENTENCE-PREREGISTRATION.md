# docs/08's public-data line made to agree with the #12 ruling, in the human's own sentence — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any change. Queued by the human's reuse round 1 direction, item 3 (`state/directives/2026-10-08-reuse-round-1.md`, restated in `state/directives/2026-10-08-reuse-round-1-private-repository.md`). The sentence that lands is the human's own, typed as item 3 of `state/directives/2026-10-08-m1-mutations-branch-docs08-adr036.md`. The conflict it removes is with the #12 ruling: question round 27, item 3, in its RULED block in `DECISIONS-PENDING.md`, which keeps #12 local-only, fetch-only and never redistributed. A single combined reviewer gate (§21b) applies, because none of §21a's categories is touched and the change is two lines.*

```
Authority: PLAN node docs-08-public-data-sentence; the human's reuse round 1 direction, item 3 (state/directives/2026-10-08-reuse-round-1.md); the human's typed sentence, item 3 of state/directives/2026-10-08-m1-mutations-branch-docs08-adr036.md; the #12 ruling (question round 27, item 3)
Scope: docs/08_Testing.md, line 40 only; 1 file; 2 changed lines (one removed, one added), this form excluded; no PLAN or generated file on the branch (the custodian keeps the node on main)
Change: line 40 becomes the human's item 3 sentence, its wrapped lines joined by single spaces with each line's leading indentation removed, byte for byte, as a list item like the line it replaces; nothing else in docs/08 or any other file changes
Tests+mutation: none, a docs sentence; the checks are scripts/plan verify-cites.mjs, verify-quotes.mjs, verify-test-claims.mjs, verify.mjs, queue.mjs --check and site.mjs --check, each exit 0; a byte comparison of the new line 40 against the human's item 3 joined as stated; a search of docs/ for "redistributable" shows that no other line uses it of the public-data corpora (ADR-017's two uses concern a published artifact)
Out-of-scope: ADR none (no ADR is edited); security none; wire none; guarantee none -- §21a's four categories untouched and two lines changed, so the single reviewer gate applies; the corpus files themselves, their fetch scripts and their licence table are untouched
```

## Amendments

Opens empty, append-only.
