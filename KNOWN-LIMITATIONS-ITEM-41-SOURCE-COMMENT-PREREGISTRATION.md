# KNOWN-LIMITATIONS item 41's source comment: its pin on main, now that the work has merged — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The docs lane's piece the human added as its own line, by item 40's procedure (`state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md`, item 6). Drafted by the custodian.

```
Authority: PLAN node known-limitations-item-41-source-comment; state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md, item 6; the comment's own promise, KNOWN-LIMITATIONS.md:388 @ 79cec8c5e45767a2b96edec85b76d1a7b6734d2a sha256:8885aed80dca389da8c97b26ad25a4e9d5ea6ad2c1b407f226e3eb3aebe9c76c; item 40's procedure, KNOWN-LIMITATIONS-ITEM-40-SOURCE-COMMENT-PREREGISTRATION.md (its five lines and its §A); KNOWN-LIMITATIONS items as disjoint paths: state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:29 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:dc6bf46fc21f8f6cd3e6cb64b1fdec690aad6fd5b32be78300b9629a629efe78. Reuse index: node tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for source comment, `No prior art recorded for "source comment". Research it before planning an implementation.` and, for known limitations, `No prior art recorded for "known limitations". Research it before planning an implementation.`; two misses, noted, not blocking.
Scope: KNOWN-LIMITATIONS.md (item 41's source comment only, line 388 at 79cec8c5); PLAN.yaml (this node's record); 2 files; declared line budget <= 2 changed lines by §21c's counting, this form excluded.
Change: line 388 becomes §A's line, byte for byte by script: its clause on where the code is says the work has merged, and its one code location becomes a pin on main at #217's merge commit with its sha256; every other byte of the comment, item 41's words (lines 386-387) and every other line are unchanged.
Tests+mutation: none added or changed (documents only); the reviewer recomputes the pin at the merge commit and at the PR's base, checks §A byte for byte against line 388 with only the clause and the location changed, and that no other line changes.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no code, no test, no string the app shows; item 41's words are unchanged, still pending the human's sight under item 2e.
```

### §A. Line 388 as it becomes (built by the custodian's script from the line at 79cec8c5; the span was checked identical at the branch commit the comment names, at the merge commit and at 79cec8c5)

```text
    <!-- DRAFT wording for the human's sight, not the human's own wording (frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md §2.8, the second new item, with Amendment 2 item 9 (the reason is never shown in this milestone, because the engine's covering-bbox predicate is not established) and Amendment 2 item 2(c) (the split is shown only from a current box); the number is from Amendment 1 A14 and Amendment 2 item 10; the words are pending the human's approval, item 2e of state/directives/2026-10-11-direction-after-status-review.md). Where the code does this, on main since milestone 2 merged (PR #217, merge commit 71fd2c4fb2903e8e0a383221a18895da50971204): frontends/shell/src/workspace/selection.ts:119-157 @ 71fd2c4fb2903e8e0a383221a18895da50971204 sha256:0092ff8df03bed9c9068eb3cc8cbd5ef4a9bbfc054995121a2474ff6c09548a4 (countSelection: the reason is always null, and with no box there is no split). -->
```

### Amendments

*(Opens empty; append-only.)*
