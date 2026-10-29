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

### Amendment 1 — the closing record (class 1)

*Written by the custodian after the outcome was seen. PR #194 merged at 2026-10-08T20:52:45Z as merge commit 7ddba6b7375c132f5e22c9422c7db37b5c697aba, with parents 628e4a4b74634e82a58ea49b439744abfd87771a and 388531fa3df01e2d63854ff63992c6e30014982b. References and hashes only. Nothing below is a quotation.*

1. **The PR and its head:** PR #194. Its gated head and merged head is 388531fa, one commit.
   - CI passed 2 of 2 there. The governance workflow is path-filtered off docs/08, and the gate ran its checks locally.
   - Before the merge, the PR body's "#12" was reworded to "corpus entry 12", as the reviewer noted.
2. **The gate report:** `state/consults/gates/2026-10-08-docs-08-public-data-sentence-gate1-reviewer.md`. It is a PASS with no findings, gate-log 445, sha256 5f3439e421f400820368652927d72554ad251f5130e7a7edbd675acce8e46353, added at 9cc7f5f6cd64ffd80b80b4663584cfe2f3a8d497.
3. **The worker report:** `state/consults/2026-10-08-docs-08-public-data-sentence-worker-report-1.md`. Its sha256 from line 5 to the end is e6fb72d8ca4d84be24cdbb34bfdae2ffd5ead74c20201b4d5b474e2098351914. It was added at d319de87344ef45df4d7fa94c544e401d8ae3921 and is unchanged since.
4. **The Scope:** 1 line added and 1 removed in `docs/08_Testing.md`, counted against the merge commit's first parent.
5. **Noticed by the gate:** `docs/14_Governance_and_Licensing.md` line 27, which the proposed node `docs-14-corpus-attribution-vs-docs-08` holds.
6. **Done:** PLAN marks the node done, with evidence `{pr: 194}`, at generation 1, in this amendment's commit.
