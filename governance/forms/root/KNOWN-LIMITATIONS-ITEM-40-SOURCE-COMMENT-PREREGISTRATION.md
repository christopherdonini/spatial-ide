# KNOWN-LIMITATIONS item 40's source comment: its pins on main, now that the work has merged — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline. The docs lane's piece the human added as its own line (`state/directives/2026-10-14-e15-named-i2-live-row-build-24px-provenance-cv-2-4-item-40-comment.md`, item 6). Drafted by the custodian.

```
Authority: PLAN node known-limitations-item-40-source-comment; state/directives/2026-10-14-e15-named-i2-live-row-build-24px-provenance-cv-2-4-item-40-comment.md, item 6; the comment's own promise, KNOWN-LIMITATIONS.md:384 @ 82c5996ce17caa02084fb7308d3cea8c4e1a5305 sha256:b34d265a4058cba02778405f911ce63fb0ae998ffbdcc9946c8fb78682568bd1; KNOWN-LIMITATIONS items as disjoint paths: state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:29 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:dc6bf46fc21f8f6cd3e6cb64b1fdec690aad6fd5b32be78300b9629a629efe78. Reuse index: node tools/reuse.mjs in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, for source comment, `No prior art recorded for "source comment". Research it before planning an implementation.` and, for known limitations, `No prior art recorded for "known limitations". Research it before planning an implementation.`; two misses, noted, not blocking.
Scope: KNOWN-LIMITATIONS.md (item 40's source comment only, line 384 at 82c5996c); PLAN.yaml (this node's record); 2 files; declared line budget <= 2 changed lines by §21c's counting, this form excluded.
Change: line 384 becomes §A's line, byte for byte by script: its clause on where the code is says the work has merged, and its three code locations become pins on main at #217's merge commit with their sha256; every other byte of the comment, item 40's words (lines 382-383) and every other line are unchanged.
Tests+mutation: none added or changed (documents only); the reviewer recomputes each pin at the merge commit and at the PR's base, checks §A byte for byte against line 384 with only the clause and the three locations changed, and that no other line changes.
Out-of-scope: none of ADR / security / wire / guarantee is touched: no ADR file, nothing under protocol/, no code, no test, no string the app shows; item 40's words wait for the sitting (the human's item 6).
```

### §A. Line 384 as it becomes (built by the custodian's script from the line at 82c5996c; each span was checked identical at the branch commit the comment names, at the merge commit and at 82c5996c)

```text
    <!-- DRAFT wording for the human's sight, not the human's own wording (frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md §2.8, the first new item; the number is from Amendment 1 A14 and Amendment 2 item 10; the words are pending the human's approval, item 2e of state/directives/2026-10-11-direction-after-status-review.md; §8 item 8 forbids a selection carried across generations or persisted). Where the code does this, on main since milestone 2 merged (PR #217, merge commit 71fd2c4fb2903e8e0a383221a18895da50971204): frontends/shell/src/workspace/workspaceState.ts:140-141 @ 71fd2c4fb2903e8e0a383221a18895da50971204 sha256:3a6bdd11a5681b54b980aaf742b2b58e4d226ae7727a16d6a1f55ee125107276 and frontends/shell/src/workspace/workspaceState.ts:149-158 @ 71fd2c4fb2903e8e0a383221a18895da50971204 sha256:10681b8240f7073a7092ad9235d55a588a169d08efb88dfb7b614d349dc97f73 (a rebind ends the view's generation with the reason reopened, and resource.generationEnded does so with the reason source-changed); frontends/shell/src/workspace/viewTransitions.ts:156-165 @ 71fd2c4fb2903e8e0a383221a18895da50971204 sha256:b3df4df083f0407f482a40389aedecc9374b816310185dd55413f64b8e361e8d (endViewGeneration: the selection ends with the count dropped, and the inspected feature is cleared); frontends/shell/src/feature/FeatureTab.tsx:68-76 @ 71fd2c4fb2903e8e0a383221a18895da50971204 sha256:b98c0ad2f3344414b3866d30a04843ad33fd35fd84e2b2f3e2d16970f70565b0 (noticeText, the words the tab and the status bar show). -->
```

### Amendments

*(Opens empty; append-only.)*

### Amendment 1 — closing record: PR #221 merged

*Written by the custodian after the merge. References only.*

1. **Merged** by the human at 2026-10-14T21:29:32Z, merge commit c08b3eb26b90e08f550398449ba25f40192e5a61 (two parents: main 8534349a and the branch head cb9a9fd4).
2. **Gate:** the single combined reviewer gate, PASS with no finding (gate log 521; `state/consults/gates/2026-10-14-known-limitations-item-40-source-comment-gate1-reviewer.md`).
3. **Item 40's words** stay as they are until the sitting (the human's item 6).
4. **PLAN:** the node is done, with `{pr: 221}`.

Nothing above is edited.
