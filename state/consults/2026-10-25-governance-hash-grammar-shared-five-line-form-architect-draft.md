*Custodian's filing note (2026-10-25): the architect's read-only draft of the five-line form for `governance-hash-grammar-shared`, the governance lane's piece, read at main 00e3a5c2. The custodian commits the form from it with its cites pinned by script and the settlement of OPEN-1 and OPEN-2 (`scripts/plan/HASH-GRAMMAR-SHARED-PREREGISTRATION.md`). The run 08:40:35Z to 08:46:19Z by its transcript (Read 18, Grep 17, Glob 1; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is ac5fcd7ff6076c585b4616cb87dcf82b730210cc035f148fec6aa4fb3274cf71.*

---

Drafted: governance-hash-grammar-shared, five-line form, architect
Read at: main @ 00e3a5c2 (main checkout, read only). I have no shell, so this report contains no sha256. The custodian expands each `path:line @ 00e3a5c2` cite into a pin by script. Everything below is my wording unless it is marked as byte-copied.

Proposed form path (my choice, following the scripts/plan/*-PREREGISTRATION.md precedent): `scripts/plan/HASH-GRAMMAR-SHARED-PREREGISTRATION.md`. The PLAN node's `gate:` is set to that path, so the form's two new test names read as PLANNED until the node is done.

```
Authority: PLAN node `governance-hash-grammar-shared` (PLAN.yaml:505-521 @ 00e3a5c2): the architect gate's S2, governance-test-claims-superseded attempt 1, carried in its summary (PLAN.yaml:520 @ 00e3a5c2), names the consumers verify-test-claims.mjs and verify-quotes.mjs; the human's directive of 2026-10-23, item 3 (state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md:12 @ 00e3a5c2), places it fifth in the governance lane; unblocked by #251; the reuse index found no prior art on either search (shared reference grammar; hash reference regex), a miss noted here.
Scope: 5 files: scripts/plan/hashRefGrammar.mjs (new), scripts/plan/verify-quotes.mjs, scripts/plan/verify-test-claims.mjs, scripts/plan/verify-test-claims.test.mjs, scripts/plan/README.md; declared line budget 140 (insertions plus deletions, tests and comments counted, AUTONOMY.md:357 @ 00e3a5c2); this form exempt; no existing test is changed or removed.
Change: the `path:line @ <rev> sha256:<hex>` reference grammar (`GAP` and a `hashRefRegExp({ pathRequired })` factory) is defined once in the new leaf module scripts/plan/hashRefGrammar.mjs and imported by verify-quotes.mjs (path optional, for its bare `:line` shape) and verify-test-claims.mjs (path required), replacing both local copies; each checker's compiled pattern keeps today's source byte for byte, so neither checker's findings change; the comments and the README sentence that describe verify-test-claims' copy as derived from a branch commit are rewritten to say it imports the shared one.
Tests+mutation: a_withdrawn_test_row_with_only_a_bare_line_reference_has_no_pinned_reference (new, verify-test-claims.test.mjs; passes at the base); M1: verify-test-claims.mjs builds its pattern with `hashRefRegExp({ pathRequired: false })`, so the row's message reads "refused: another file's path" and the test fails by name. a_seven_character_rev_pin_binds_in_both_checkers_through_the_shared_grammar (new, verify-test-claims.test.mjs; passes at the base); M2: in hashRefGrammar.mjs the rev group `[^\\s\`]+` becomes `[0-9a-f]{12,40}`, so one deepEqual over both checkers' results fails by name with both values changed, verify-quotes reporting one unbound hash finding and verify-test-claims no superseded claim. Each mutation is observed by applying it, running the named test, recording its failure by name with the commit in a `RECORDED MUTATION:` comment, and reverting it.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (no exposure surface, no dependency, Node's standard library only); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: none touched, since no property under test changes: each checker's compiled pattern is today's source, and every existing test in verify-quotes.test.mjs and verify-test-claims.test.mjs keeps its text and passes; the leading-dot path gap the node's summary records is not fixed here, because fixing it changes what both checkers bind.
```

**The reuse index**, as the brief gave it (byte-copied from the brief):

```text
$ node tools/reuse.mjs shared reference grammar
No prior art recorded for "shared reference grammar". Research it before planning an implementation.
$ node tools/reuse.mjs hash reference regex
No prior art recorded for "hash reference regex". Research it before planning an implementation.
```

## Notes (mine)

### 1. The change

**The two copies today**
- `GAP` is the same in both files: scripts/plan/verify-quotes.mjs:589 @ 00e3a5c2 and scripts/plan/verify-test-claims.mjs:178 @ 00e3a5c2.
- `HASH_REF_RE` (scripts/plan/verify-quotes.mjs:590-594 @ 00e3a5c2 against scripts/plan/verify-test-claims.mjs:179-183 @ 00e3a5c2) differs in one place only, the path group:
  - verify-quotes makes it optional: `(?:([A-Za-z0-9_][A-Za-z0-9_./+-]*))?` (byte-copied from line 591).
  - verify-test-claims makes it required: `([A-Za-z0-9_][A-Za-z0-9_./+-]*)` (byte-copied from line 180).
  - Everything else is the same, including the `'g'` flag.
- verify-test-claims' own comment declares this the one kept divergence (scripts/plan/verify-test-claims.mjs:168-172 @ 00e3a5c2).

**Why the divergence must be kept, not merged**
- verify-test-claims has two readers of the pattern:
  - `markedSpans` (scripts/plan/verify-test-claims.mjs:270-286 @ 00e3a5c2) filters on `m[2] !== relPath`, so a match with no path would be skipped there. That reader would be unaffected.
  - `firstHashRefsByLine` (scripts/plan/verify-test-claims.mjs:586-603 @ 00e3a5c2) is "unfiltered by path/rev shape". It feeds `computeWithdrawnRows`, whose first two refusals are "refused: no pinned reference" and "refused: another file's path" (scripts/plan/verify-test-claims.mjs:663-666 @ 00e3a5c2).
- Today a withdrawn-test row that carries only a bare `` `:3` @ rev sha256:… `` matches nothing, so it reads "no pinned reference".
- With the optional-path pattern, the same row would match with an undefined path and read "another file's path". A bare reference earlier on a line would also become that line's first-seen reference.
- That is a behaviour change. Hence `pathRequired`, with a product caller for each value (verify-quotes `false`, verify-test-claims `true`). M1 pins it.
- No existing test covers a bare reference on a row. The nearest tests are scripts/plan/verify-test-claims.test.mjs:948-956 and :985-995 @ 00e3a5c2.

**The shared module**
- Built as `PATH = '([A-Za-z0-9_][A-Za-z0-9_./+-]*)'`, with the optional form written as `` `(?:${PATH})? ``.
- This reproduces both sources byte for byte, so `.source` of each compiled pattern equals today's.
- The worker records one comparison in its hand-back: each checker's `.source` at the base against the head, by a one-off `node -e` that is not committed. This proves the "byte for byte" clause in the Change line.

**Why a factory, not one exported RegExp**
- Both readers drive a global regex through `lastIndex` (scripts/plan/verify-quotes.mjs:605-607, scripts/plan/verify-test-claims.mjs:272-274 and :588-590 @ 00e3a5c2).
- A factory gives each module its own instance, as today. A shared object would share `lastIndex` across importers.

**Why a new leaf module owns it, not verify-quotes**
- verify-quotes already imports `claimFiles` from verify-test-claims (scripts/plan/verify-quotes.mjs:138 @ 00e3a5c2). Exporting from verify-quotes would create an import cycle.
- A leaf with no imports follows the precedent of `rulingSet.mjs`, which is "shared with verify-test-claims" (scripts/plan/verify-quotes.mjs:108-109 @ 00e3a5c2).

**Readers of the grammar, all unchanged in body**
- verify-quotes: `extractHashRefs` (scripts/plan/verify-quotes.mjs:603-621 @ 00e3a5c2), which in turn is read at :925 (runVerifyQuotes) and :1064 (listCiteContents). The test files rotate-decisions-pending.test.mjs and verify-quotes.test.mjs import it.
- verify-test-claims: `markedSpans` and `firstHashRefsByLine`.
- verify-quotes' `RAW_SHA_RE` (scripts/plan/verify-quotes.mjs:600 @ 00e3a5c2) is a separate token scan, not the reference grammar. It stays where it is.

**Comments that change**
- scripts/plan/verify-quotes.mjs:556-557 @ 00e3a5c2 says "The grammar below"; it now names hashRefGrammar.mjs. The header's "(see GAP)" at :76-77 does the same.
- scripts/plan/verify-test-claims.mjs:75-82 and :158-177 @ 00e3a5c2 say "DERIVED FROM … @ 1254cddd…".
- scripts/plan/README.md:135-137 @ 00e3a5c2 says the same.
- The long shapes comment (scripts/plan/verify-quotes.mjs:544-588 @ 00e3a5c2) stays in place. Moving it would cost about 90 changed lines.

**Other definitions under scripts/**
- Searched by Grep: `GAP` definitions, and `sha256:([0-9a-f]` patterns in *.mjs/js/cjs/ts/ps1/py/sh, repo-wide.
- No other definition exists. The only hits are the two files above plus `RAW_SHA_RE`.
- Test files build references as fixtures but define no grammar.
- So the piece covers every definition.

### 2. The size (my estimate, against §21c, AUTONOMY.md:347-357 @ 00e3a5c2)

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
- T2 belongs in verify-test-claims.test.mjs, which already has `gitRepoAt`, `commitAll`, `pinRow`, `sha256Hex`, `lineOfV1` and the temp-directory sweep (scripts/plan/verify-test-claims.test.mjs:36-51, :227-255 @ 00e3a5c2). Putting it in a new file would push the count past budget.
- Importing `runVerifyQuotes` into that file has a precedent: scripts/plan/rotate-decisions-pending.test.mjs:18-19, :269-291 @ 00e3a5c2 already runs both checkers on one fixture.
- No new dependency, no exposure surface, no user-visible behaviour.

### 3. Tests and mutations

**T1, a_withdrawn_test_row_with_only_a_bare_line_reference_has_no_pinned_reference**
- Fixture: `rowTextFixture((rev) => "- withdrawn-test: `:3` @ ${rev} sha256:<64 a>; ruling: round 1, item 1; carrier: round 2, item 5\n", { doc: DOC_WITH_REAL_CLAIM, withRealTest: true })`, the shape at scripts/plan/verify-test-claims.test.mjs:966-976 @ 00e3a5c2.
- It asserts one `withdrawn-row` finding, with message 'refused: no pinned reference'.
- I traced it against both patterns by hand: "withdrawn-test:" is followed by a space, not a digit, so neither pattern matches there.
- M1 → "refused: another file's path".

**T2, a_seven_character_rev_pin_binds_in_both_checkers_through_the_shared_grammar**
- Fixture: `gitRepoAt` with SUPERSEDED_V1, then a `pinRow` row with `rev: v1Rev.slice(0, 7)`, committed.
- It runs `runVerifyQuotes({ repoRoot: dir, files: [<the doc>] })` and `runVerifyTestClaims({ repoRoot: dir })`.
- It asserts one `deepEqual({ quotes: hashFindings.length, claims: superseded.length }, { quotes: 0, claims: 1 })`.
- M2 is applied in the shared module, so the single failure shows the change reaching both checkers: `{ quotes: 1, claims: 0 }`. verify-quotes reports the token as unbound because a `:3` sits within its lookback; this matches the mechanism recorded at scripts/plan/verify-quotes.test.mjs:838-845 @ 00e3a5c2.
- The worker checks that the fixture row trips no quote trigger. Only `hashFindings` is asserted.

**Regression, unchanged**
- verify-quotes' grammar tests: scripts/plan/verify-quotes.test.mjs:846-889 (the three real-record tests) and :954-969 (`a_hash_reference_split_by_a_rustfmt_wrapped_comment_continuation_verifies`) @ 00e3a5c2.
- All superseded and withdrawn tests in verify-test-claims.test.mjs.

### 4. The gate

The single gate (§21b, AUTONOMY.md:334-345 @ 00e3a5c2): the reviewer.
- This is a behaviour-preserving cleanup of governance tooling, under §21c, in none of §21a's four categories.
- The risk is that a silent change to the checkers mis-gates later pieces. Three things close it: the byte-identical `.source` comparison, T1 pinning the one divergence, and both suites passing unchanged.

### 5. Out-of-scope readings

- **ADR, security, wire:** none, as the line says.
- **Guarantee:** §21a lists "any property currently under test" (AUTONOMY.md:325-327 @ 00e3a5c2). Here nothing about the grammar's recognition changes. The precedent form's guarantee clause differed because it changed a property (kernel/PUBLISH-SORT-WINDOW-CANCEL-NOT-EXERCISED-ON-CI-PREREGISTRATION.md:10 @ 00e3a5c2).
- **Round 25, item 2 (e)** (docs/PREREGISTRATION-TEMPLATE.md:176 @ 00e3a5c2): the line asserts that none of the four is touched, so the five-line form is open.
- **Leading-dot gap** (PLAN.yaml:520 @ 00e3a5c2, last sentence): out of scope. Widening the path's first character changes what both checkers bind (`.github/`, `./`, `../` shapes), which needs its own tests.
- **What governance CI runs over these files** (.github/workflows/governance-ci.yml:85, :102 @ 00e3a5c2 match `scripts/plan/**`):
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

## OPEN

**OPEN-1: the guarantee reading.**
- (A) Five-line form: "touches" is read as "changes"; no property under test changes. Recommended, given the byte-identical sources, T1, and the unchanged suites.
- (B) Full form and both gates, if the custodian reads editing the code that implements a property under test as touching it.

**OPEN-2: the leading-dot gap.**
- (A) It stays recorded in this node's summary only.
- (B) The custodian proposes a separate governance node for it. Recommended: its fix changes both checkers' behaviour, and it now has a single place to land, hashRefGrammar.mjs.

## Not settled

- **No hashes:** I have no shell, so the report carries no sha256 and I could not run `.source` at base or head. The byte-identity claim rests on my reading of lines 589-594 and 178-183.
- **Fixture traces done by reading, not by running:** T1's bare row against both patterns, and T2's 7-character rev under M2. The worker observes both.
- **Search limits:** the search for other definitions covered script file types repo-wide; I did not read every .md under scripts/.
- **Node budget:** the node's `budget_minutes: 30` (PLAN.yaml:516 @ 00e3a5c2) is the custodian's to revisit.

Relevant files: C:/dev/spatial-ide/PLAN.yaml, C:/dev/spatial-ide/scripts/plan/verify-quotes.mjs, C:/dev/spatial-ide/scripts/plan/verify-test-claims.mjs, C:/dev/spatial-ide/scripts/plan/verify-test-claims.test.mjs, C:/dev/spatial-ide/scripts/plan/verify-quotes.test.mjs, C:/dev/spatial-ide/scripts/plan/README.md, C:/dev/spatial-ide/scripts/plan/rulingSet.mjs, C:/dev/spatial-ide/.github/workflows/governance-ci.yml, C:/dev/spatial-ide/AUTONOMY.md, C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md.
