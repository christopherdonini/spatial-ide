# The `path:line @ <rev> sha256:<hex>` reference grammar is defined once and imported by both checkers — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's tests has been seen says so in its first line. PLAN node governance-hash-grammar-shared, the governance lane's piece. The five lines and the notes are the architect's draft (`state/consults/2026-10-25-governance-hash-grammar-shared-five-line-form-architect-draft.md`, read only at main 00e3a5c2; its sha256 from line 5 is ac5fcd7ff6076c585b4616cb87dcf82b730210cc035f148fec6aa4fb3274cf71), with two changes, both the custodian's: each cite at 00e3a5c2 is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a path that starts with a dot as `` `path:line` at <commit>, sha256 <hex> ``), a cite naming several places under one commit written as one pin each (42 pins); and the settlement of the draft's OPEN-1 and OPEN-2 below. Every pin is historical: for the code, the piece's base tree is authoritative; for what this form read, the pin is. Form path: `scripts/plan/HASH-GRAMMAR-SHARED-PREREGISTRATION.md`. The custodian keeps the PLAN node on main; the branch carries no PLAN file and no generated file. Gating: the reviewer alone (§21b), by the settlement's OPEN-1.*

```
Authority: PLAN node `governance-hash-grammar-shared` (PLAN.yaml:505-521 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:9937dfa63bae6e8583d747a15ac2e7a3db5b68913b895bd7574b7e2ef6f9ce46): the architect gate's S2, governance-test-claims-superseded attempt 1, carried in its summary (PLAN.yaml:520 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:2426eb5de4e65a4f5dbbb7f3403c377755d527b938178ac224848b2558aa2607), names the consumers verify-test-claims.mjs and verify-quotes.mjs; the human's directive of 2026-10-23, item 3 (state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:12 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:c13138a5d6b24ca065029eb8715d26c9276fbbbd3b068b356830c78cd0a6849d), places it fifth in the governance lane; unblocked by #251; the reuse index found no prior art on either search (shared reference grammar; hash reference regex), a miss noted here.
Scope: 5 files: scripts/plan/hashRefGrammar.mjs (new), scripts/plan/verify-quotes.mjs, scripts/plan/verify-test-claims.mjs, scripts/plan/verify-test-claims.test.mjs, scripts/plan/README.md; declared line budget 140 (insertions plus deletions, tests and comments counted, AUTONOMY.md:357 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; no existing test is changed or removed.
Change: the `path:line @ <rev> sha256:<hex>` reference grammar (`GAP` and a `hashRefRegExp({ pathRequired })` factory) is defined once in the new leaf module scripts/plan/hashRefGrammar.mjs and imported by verify-quotes.mjs (path optional, for its bare `:line` shape) and verify-test-claims.mjs (path required), replacing both local copies; each checker's compiled pattern keeps today's source byte for byte, so neither checker's findings change; the comments and the README sentence that describe verify-test-claims' copy as derived from a branch commit are rewritten to say it imports the shared one.
Tests+mutation: a_withdrawn_test_row_with_only_a_bare_line_reference_has_no_pinned_reference (new, verify-test-claims.test.mjs; passes at the base); M1: verify-test-claims.mjs builds its pattern with `hashRefRegExp({ pathRequired: false })`, so the row's message reads "refused: another file's path" and the test fails by name. a_seven_character_rev_pin_binds_in_both_checkers_through_the_shared_grammar (new, verify-test-claims.test.mjs; passes at the base); M2: in hashRefGrammar.mjs the rev group `[^\\s\`]+` becomes `[0-9a-f]{12,40}`, so one deepEqual over both checkers' results fails by name with both values changed, verify-quotes reporting one unbound hash finding and verify-test-claims no superseded claim. Each mutation is observed by applying it, running the named test, recording its failure by name with the commit in a `RECORDED MUTATION:` comment, and reverting it.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (no exposure surface, no dependency, Node's standard library only); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: none touched, since no property under test changes: each checker's compiled pattern is today's source, and every existing test in verify-quotes.test.mjs and verify-test-claims.test.mjs keeps its text and passes; the leading-dot path gap the node's summary records is not fixed here, because fixing it changes what both checkers bind.
```

**The reuse index**, byte for byte as the custodian ran it for the draft's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs shared reference grammar
No prior art recorded for "shared reference grammar". Research it before planning an implementation.
$ node tools/reuse.mjs hash reference regex
No prior art recorded for "hash reference regex". Research it before planning an implementation.
```

*The notes below are the architect's from its draft, carried byte for byte except for the pins; where they say mine, they mean the architect's. They are this form's reading. Where one puts a question to the custodian or the human, the settlement after them answers it.*

## Notes

### 1. The change

**The two copies today**
- `GAP` is the same in both files: scripts/plan/verify-quotes.mjs:589 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:475e04c3e31f906f203f5d0ec338e439f38a41f5be706446c4f7c97d25c2b933 and scripts/plan/verify-test-claims.mjs:178 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:475e04c3e31f906f203f5d0ec338e439f38a41f5be706446c4f7c97d25c2b933.
- `HASH_REF_RE` (scripts/plan/verify-quotes.mjs:590-594 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:56e1ab4d06f9aa1ede9a235924ab8eeebe051903a88e2f41f840ce463df09580 against scripts/plan/verify-test-claims.mjs:179-183 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:2cc5007d3e381dceb8285d0c666a5c58e8ba7016fa41a709dee4afe5cdfd05ac) differs in one place only, the path group:
  - verify-quotes makes it optional: `(?:([A-Za-z0-9_][A-Za-z0-9_./+-]*))?` (byte-copied from line 591).
  - verify-test-claims makes it required: `([A-Za-z0-9_][A-Za-z0-9_./+-]*)` (byte-copied from line 180).
  - Everything else is the same, including the `'g'` flag.
- verify-test-claims' own comment declares this the one kept divergence (scripts/plan/verify-test-claims.mjs:168-172 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:42cfab2e23af83eb6055ececedba70f96d72d4db495476f0fb3cc49ca0000efd).

**Why the divergence must be kept, not merged**
- verify-test-claims has two readers of the pattern:
  - `markedSpans` (scripts/plan/verify-test-claims.mjs:270-286 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:667dc1ad05887a5d4e0f610704113fcc2af49bab781aa67568ebd0fe7c5da042) filters on `m[2] !== relPath`, so a match with no path would be skipped there. That reader would be unaffected.
  - `firstHashRefsByLine` (scripts/plan/verify-test-claims.mjs:586-603 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:70cbc6000359f7d878f96516ab822fc3f4334df05f9186deb8b25a3d24f7ff5c) is "unfiltered by path/rev shape". It feeds `computeWithdrawnRows`, whose first two refusals are "refused: no pinned reference" and "refused: another file's path" (scripts/plan/verify-test-claims.mjs:663-666 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:a3beeff3a46ebb868c8924ad32c771fe0c16a69b84c6b1dbe1f224f88b69b769).
- Today a withdrawn-test row that carries only a bare `` `:3` @ rev sha256:… `` matches nothing, so it reads "no pinned reference".
- With the optional-path pattern, the same row would match with an undefined path and read "another file's path". A bare reference earlier on a line would also become that line's first-seen reference.
- That is a behaviour change. Hence `pathRequired`, with a product caller for each value (verify-quotes `false`, verify-test-claims `true`). M1 pins it.
- No existing test covers a bare reference on a row. The nearest tests are scripts/plan/verify-test-claims.test.mjs:948-956 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:607d2cce17c146d1ccf63edd5790fa5756c2b945df058ff71a682ef6b3becc74 and scripts/plan/verify-test-claims.test.mjs:985-995 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:6d8d42ca23c97b252640919332df11f5b289a549ca94bc9dee4874aedaf3443b.

**The shared module**
- Built as `PATH = '([A-Za-z0-9_][A-Za-z0-9_./+-]*)'`, with the optional form written as `` `(?:${PATH})? ``.
- This reproduces both sources byte for byte, so `.source` of each compiled pattern equals today's.
- The worker records one comparison in its hand-back: each checker's `.source` at the base against the head, by a one-off `node -e` that is not committed. This proves the "byte for byte" clause in the Change line.

**Why a factory, not one exported RegExp**
- Both readers drive a global regex through `lastIndex` (scripts/plan/verify-quotes.mjs:605-607 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:66084285f359117db0da311429fb955eba9828ccef1e9637956039633379580a, scripts/plan/verify-test-claims.mjs:272-274 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:66084285f359117db0da311429fb955eba9828ccef1e9637956039633379580a and scripts/plan/verify-test-claims.mjs:588-590 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:66084285f359117db0da311429fb955eba9828ccef1e9637956039633379580a).
- A factory gives each module its own instance, as today. A shared object would share `lastIndex` across importers.

**Why a new leaf module owns it, not verify-quotes**
- verify-quotes already imports `claimFiles` from verify-test-claims (scripts/plan/verify-quotes.mjs:138 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:dc8c57832375bb414b616465e63a1711bc8c109e7cdf0fda6e9e56aa780c66ef). Exporting from verify-quotes would create an import cycle.
- A leaf with no imports follows the precedent of `rulingSet.mjs`, which is "shared with verify-test-claims" (scripts/plan/verify-quotes.mjs:108-109 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:e4f6064ee021fb912225d89868521057b9740fa986f0d53509f43c108dd0e035).

**Readers of the grammar, all unchanged in body**
- verify-quotes: `extractHashRefs` (scripts/plan/verify-quotes.mjs:603-621 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:b75be308650d4745073a4a14adf2b7e788f5f71c86594c87f23d9c5be24fdc8e), which in turn is read at :925 (runVerifyQuotes) and :1064 (listCiteContents). The test files rotate-decisions-pending.test.mjs and verify-quotes.test.mjs import it.
- verify-test-claims: `markedSpans` and `firstHashRefsByLine`.
- verify-quotes' `RAW_SHA_RE` (scripts/plan/verify-quotes.mjs:600 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:5e765fa7054cd565d3886861e3981a42f878ddaa3f3535145f44f602c3ec0cf4) is a separate token scan, not the reference grammar. It stays where it is.

**Comments that change**
- scripts/plan/verify-quotes.mjs:556-557 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:8b5ebd0e87cbe156051954d0b5cdcb3a09e3ce32ad72450d82ec230a1f00f2b0 says "The grammar below"; it now names hashRefGrammar.mjs. The header's "(see GAP)" at :76-77 does the same.
- scripts/plan/verify-test-claims.mjs:75-82 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:9472aaa791dd93813870ca447de5405dfd742e49ad05e2af7941728c345081ea and scripts/plan/verify-test-claims.mjs:158-177 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:21573da17974450908f57a9ca1f9e26dabdadd42f480d878edb311702f66a406 say "DERIVED FROM … @ 1254cddd…".
- scripts/plan/README.md:135-137 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:f3279206fe507f4c864156683412dd09a78f6392fda4792f89f22a1b3ad16da0 says the same.
- The long shapes comment (scripts/plan/verify-quotes.mjs:544-588 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:62005f691beccb96591cf4e0ad26fdef28fb36ce0f64227c828170ca069e3ffc) stays in place. Moving it would cost about 90 changed lines.

**Other definitions under scripts/**
- Searched by Grep: `GAP` definitions, and `sha256:([0-9a-f]` patterns in *.mjs/js/cjs/ts/ps1/py/sh, repo-wide.
- No other definition exists. The only hits are the two files above plus `RAW_SHA_RE`.
- Test files build references as fixtures but define no grammar.
- So the piece covers every definition.

### 2. The size (my estimate, against §21c, AUTONOMY.md:347-357 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:87932677b77260bd12a21590a4611707aec57b89f69124ca0465a4d058bfeb31)

| File | Estimated lines changed |
|---|---|
| hashRefGrammar.mjs (new) | about 30 |
| verify-quotes.mjs | about 14 (6 deleted; import, const and two comment lines) |
| verify-test-claims.mjs | about 40 (the 26-line block becomes about 8; header about 6) |
| README.md | about 6 |
| T1 with its mutation comment | about 15 |
| T2 with its mutation comment | about 25 |
| **Total** | **about 130, across 5 files** |

- This fits under the declared budget of 140, and under §21c's 150 lines and 8 files.
- T2 belongs in verify-test-claims.test.mjs, which already has `gitRepoAt`, `commitAll`, `pinRow`, `sha256Hex`, `lineOfV1` and the temp-directory sweep (scripts/plan/verify-test-claims.test.mjs:36-51 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:0505821f4525512cbf9056e22bc0077ee1462d87bea57520a8b37d81ca75cd1a, scripts/plan/verify-test-claims.test.mjs:227-255 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:fe5cf8b12ca195c98c953133baf8b58faf54036ef076319bc12a39c1c1832c3d). Putting it in a new file would push the count past budget.
- Importing `runVerifyQuotes` into that file has a precedent: scripts/plan/rotate-decisions-pending.test.mjs:18-19 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:b4a514718928566ac4e4302bca32ac2c5fafdff030bb87a65198e41a888771a8, scripts/plan/rotate-decisions-pending.test.mjs:269-291 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:c74ebba3d041b65638d228188581fa813c0846f51e4dd952725422243c94d3fc already runs both checkers on one fixture.
- No new dependency, no exposure surface, no user-visible behaviour.

### 3. Tests and mutations

**T1, a_withdrawn_test_row_with_only_a_bare_line_reference_has_no_pinned_reference**
- Fixture: `rowTextFixture((rev) => "- withdrawn-test: `:3` @ ${rev} sha256:<64 a>; ruling: round 1, item 1; carrier: round 2, item 5\n", { doc: DOC_WITH_REAL_CLAIM, withRealTest: true })`, the shape at scripts/plan/verify-test-claims.test.mjs:966-976 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:0530b861c5c52e03fb10bc97cb7645cc766125b459446a01bb54a64fbd1e352e.
- It asserts one `withdrawn-row` finding, with message 'refused: no pinned reference'.
- I traced it against both patterns by hand: "withdrawn-test:" is followed by a space, not a digit, so neither pattern matches there.
- M1 → "refused: another file's path".

**T2, a_seven_character_rev_pin_binds_in_both_checkers_through_the_shared_grammar**
- Fixture: `gitRepoAt` with SUPERSEDED_V1, then a `pinRow` row with `rev: v1Rev.slice(0, 7)`, committed.
- It runs `runVerifyQuotes({ repoRoot: dir, files: [<the doc>] })` and `runVerifyTestClaims({ repoRoot: dir })`.
- It asserts one `deepEqual({ quotes: hashFindings.length, claims: superseded.length }, { quotes: 0, claims: 1 })`.
- M2 is applied in the shared module, so the single failure shows the change reaching both checkers: `{ quotes: 1, claims: 0 }`. verify-quotes reports the token as unbound because a `:3` sits within its lookback; this matches the mechanism recorded at scripts/plan/verify-quotes.test.mjs:838-845 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:cbb72e8f9da5c7a5b84d2e7e1ddde31d4a5cf6ebc7f565ce45ededea5c401164.
- The worker checks that the fixture row trips no quote trigger. Only `hashFindings` is asserted.

**Regression, unchanged**
- verify-quotes' grammar tests: scripts/plan/verify-quotes.test.mjs:846-889 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:94b895a6f5a2f1186d7c7131e22143af4ea93a7d69c4fb2938da303548738f63 (the three real-record tests) and scripts/plan/verify-quotes.test.mjs:954-969 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:88574f505152309dc896aaa1ef0c3a716de5f957826e106e6ddd29a1664e57f7 (`a_hash_reference_split_by_a_rustfmt_wrapped_comment_continuation_verifies`).
- All superseded and withdrawn tests in verify-test-claims.test.mjs.

### 4. The gate

The single gate (§21b, AUTONOMY.md:334-345 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:09cdfc393a829fab7d4ceeaac847a7927225bb3580d694d5821abeb6d6730655): the reviewer.
- This is a behaviour-preserving cleanup of governance tooling, under §21c, in none of §21a's four categories.
- The risk is that a silent change to the checkers mis-gates later pieces. Three things close it: the byte-identical `.source` comparison, T1 pinning the one divergence, and both suites passing unchanged.

### 5. Out-of-scope readings

- **ADR, security, wire:** none, as the line says.
- **Guarantee:** §21a lists "any property currently under test" (AUTONOMY.md:325-327 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7). Here nothing about the grammar's recognition changes. The precedent form's guarantee clause differed because it changed a property (kernel/PUBLISH-SORT-WINDOW-CANCEL-NOT-EXERCISED-ON-CI-PREREGISTRATION.md:10 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:cf99ec2b17cb1e8c93b7a6b7e5e10e1c187d8e35c3fdd6640dc13b06995c17fb).
- **Round 25, item 2 (e)** (docs/PREREGISTRATION-TEMPLATE.md:176 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:92ffa7a083b8711357b414875afcf9d03d8186eb35234b0478babf1c8300a917): the line asserts that none of the four is touched, so the five-line form is open.
- **Leading-dot gap** (PLAN.yaml:520 @ 00e3a5c254444ff322ae0180dde7a4c5c39144d0 sha256:2426eb5de4e65a4f5dbbb7f3403c377755d527b938178ac224848b2558aa2607, last sentence): out of scope. Widening the path's first character changes what both checkers bind (`.github/`, `./`, `../` shapes), which needs its own tests.
- **What governance CI runs over these files** (`.github/workflows/governance-ci.yml:85` at 00e3a5c254444ff322ae0180dde7a4c5c39144d0, sha256 ec9145c9973925c99d3c156afb1714fcfb3055b7641d785dbbb80751e1cda6d9, `.github/workflows/governance-ci.yml:102` at 00e3a5c254444ff322ae0180dde7a4c5c39144d0, sha256 ec9145c9973925c99d3c156afb1714fcfb3055b7641d785dbbb80751e1cda6d9 match `scripts/plan/**`):
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` (:145-146);
  - verify:cites (:150-151), verify:quotes (:153-154), verify:test-claims (:156-157) and verify:plan (:159-162);
  - the queue and site drift checks (:169-173).
  - The form itself is scanned by verify:quotes (the pins recompute against 00e3a5c2) and verify:test-claims (T1 and T2 read as planned through `gate:`). The form should carry no quote-trigger words.

### 6. Rule (00), path by path

This piece's paths: scripts/plan/hashRefGrammar.mjs, scripts/plan/verify-quotes.mjs, scripts/plan/verify-test-claims.mjs, scripts/plan/verify-test-claims.test.mjs, scripts/plan/README.md, plus the form on main.

| Branch | Overlap with this piece |
|---|---|
| `cut/bundle-redaction-scan` | nothing under scripts/; disjoint |
| `cut/walkthrough-row-f7-cli-refusal` | disjoint |
| `cut/known-limitations-items-51-52-render-numbers` | disjoint |
| `cut/covering-case-collision-binds-other-column` | disjoint |
| `cut/stream-evaluation-failure-fixed-detail` | disjoint |
| `cut/port-2-macos-l1-and-app-dirs` | scripts/plan/cfg-boundary.mjs and its test only; disjoint, and governance CI runs it as a separate job |
| `cut/b2-piece-1c-save-and-reopen` | disjoint |
| Slot 1 | no branch yet |

- This piece touches nothing under protocol/, so the at-most-one-protocol rule holds.
- These path lists are the brief's; I cannot read branches.

## The custodian's settlement of the draft's OPEN-1 and OPEN-2 (class 1, before any code)

- **OPEN-1: (A).** The Out-of-scope line's guarantee clause reads touched as changed. No property under test changes: each checker's compiled pattern keeps today's source byte for byte, T1 pins the one kept divergence, and both suites pass unchanged. So the five-line form is open, and the single gate is the reviewer (§21b). The worker records the `.source` comparison at the base and the head (note 1) in its hand-back.
- **OPEN-2: (B).** The leading-dot path gap is proposed as node `governance-hash-ref-leading-dot-path` (governance lane), for the human's placement. Its fix lands in `scripts/plan/hashRefGrammar.mjs` once this piece merges, with its own tests, because it changes what both checkers bind.
- **The node's budget** is 90 minutes, from 30 (the draft's last unsettled item).

## Amendments (opens empty; append-only)

## Amendment 1 — the closing record, written after the gate's report and the notes commit were seen: the two notes applied with no re-gate, the size, one display note (class 1)

*Written by the custodian at the PR's final head a88e862102723c5b83d04cb72f9522f4a2988648. References only, and nothing below is a quotation. The gate: `state/consults/gates/2026-10-25-governance-hash-grammar-shared-gate1-reviewer.md` (gate-log 623; sha256 a0e1e325ff3e9f195086410fbe5aeb21f5ace91e8605276da9285958b5ebaba1), the reviewer alone, PASS WITH NOTES. The notes commit: `state/consults/2026-10-25-governance-hash-grammar-shared-gate1-notes-worker-report.md` (sha256 from line 5 23ff9927a8162c1a30e6cfce2c81906f829819032c6d4423b7fbdf450dc5646c).*

1. **The notes, applied with no re-gate.**
   - C-note 1: `GAP` is defined in the leaf module but not exported, because nothing imports it. The factory is the module's one export. The Change line's `GAP` is read as defined there, not exported.
   - D1: the module's header comment takes the reviewer's words.
2. **The size.** By the numstat from the merge base b5e39efd to a88e8621, the diff is 130 lines in the five files the Scope names, under its 140. There is no class 8.
3. **A display note, outside the diff (the reviewer's D2).** The build report (`state/consults/2026-10-25-governance-hash-grammar-shared-build-worker-report.md`) shows the two pattern sources in their string-literal spelling, with doubled backslashes. The real sources have single backslashes. The equality the report claims holds: the reviewer's own comparison printed both and found them identical.

Nothing above is edited.
