Reviewed: PR #256 at 5a4194182e5d8e4db428c23af47e7d8c7f08efbc (base b5e39efd), gate 1, reviewer
Verdict: PASS WITH NOTES

Branch and commit: cut/governance-hash-grammar-shared @ 5a4194182e5d8e4db428c23af47e7d8c7f08efbc. Main was at 4516ec6e6330af928b7792e4c604c4b2eab76834 and the merge base is b5e39efd040300a7fffc325803f14755568ff55b.

## Correctness
No blocking finding.

- **C-note 1 (not a failure, must fix before merge): `GAP` is exported but nothing imports it.** The line is scripts/plan/hashRefGrammar.mjs:8, `export const GAP = ...`. I searched every *.mjs, *.js and *.ts file at the head with `git grep`, and the only importers of hashRefGrammar.mjs import `hashRefRegExp` (verify-quotes.mjs:139 and verify-test-claims.mjs:99). Inside the module, `hashRefRegExp` uses the constant; the `export` itself has no caller. Definition item 8, the caller rule, names a `pub` item with no product caller. I did not fail the gate on it, for two reasons. First, the proportional-gates paragraph says the verdict fails only on Correctness or Evidence. Second, this finding is none of §22's Correctness/Evidence cases: there is no unsupported claim, no changed requirement and no missing evidence. If the custodian reads the caller rule as still blocking after 2026-10-05, this is the one item that would turn the verdict to FAIL.
  - Fix: remove `export` at hashRefGrammar.mjs:8, so the line reads `const GAP = '[ \\t]*(?:\\n[ \\t]*//[ \\t]?)?[ \\t]*';`. The file is new, so the numstat total does not change.
  - Check against the code: verify-quotes.mjs:77 says "hashRefGrammar.mjs's GAP" and :582 says "`GAP` (hashRefGrammar.mjs)". verify-test-claims.mjs:158 says "`GAP` and `hashRefRegExp` live there". All three stay true, because the constant is still defined there.

## Evidence
No finding. Every evidence claim the form and the PR body make was re-run and holds (see "Checked" below).

## Documentation (must fix before merge, no re-gate)
- **D1: the header comment at scripts/plan/hashRefGrammar.mjs:1-5 has three clauses that are untrue or too broad.**
  - (a) Line 2 says "a bare `:line` binds to the nearest preceding path". That drops two conditions: the code binds to a path:line *citation*, and only one *in the same paragraph*. Both are at verify-quotes.mjs:755 and :769. The refusal at :771 reads "bare hash reference has no preceding path:line cite to bind to in the same paragraph".
  - (b) Lines 3-4 say "A leaf: it imports nothing, so neither checker's import of the other can make a cycle". The second half does not follow from the first. Read literally it is false: if verify-test-claims imported verify-quotes, there would be a cycle whatever the leaf does. The true reason is the form's note 1: verify-quotes.mjs:138 imports verify-test-claims, so exporting the grammar from verify-quotes would make a cycle.
  - (c) Lines 4-5 send the reader to the "THE `//` CONTINUATION GRAMMAR" comment for "The shapes the grammar accepts". That paragraph (verify-quotes.mjs:575) describes only the continuation. The three shapes are described in the "HASH-CHECKED REFERENCES" comment at verify-quotes.mjs:545.
  - Whose words: a worker's doc comment, not the human's wording. Under §31 the worker applies them with no re-gate, and the PR body lists them.
  - Replacement for lines 1-5 (the file is new, so this is +2 lines and the total becomes 130 of 140):
```
// scripts/plan/hashRefGrammar.mjs -- the `path:line @ <rev> sha256:<hex>` reference grammar, defined once
// and imported by verify-quotes.mjs (path optional: verify-quotes binds a bare `:line` to the nearest
// preceding path:line citation in the same paragraph) and verify-test-claims.mjs (path required). A leaf:
// it imports nothing, so both checkers import it with no cycle (verify-quotes.mjs imports
// verify-test-claims.mjs, so exporting the grammar from verify-quotes.mjs would make one). The shapes the
// grammar accepts are described in verify-quotes.mjs's "HASH-CHECKED REFERENCES" comment and its
// "THE `//` CONTINUATION GRAMMAR" paragraph. Node's standard library only (here: nothing).
```
  - Each clause checked against the head:

| Clause | Where it holds |
|---|---|
| "defined once" | Only hashRefGrammar.mjs defines `GAP` or a hash-ref pattern; `git grep` at the head found no `GAP` or `HASH_REF_RE` definition left in either checker. |
| "imported by verify-quotes.mjs … verify-test-claims.mjs" | verify-quotes.mjs:139 and verify-test-claims.mjs:99. |
| "path optional" / "path required" | verify-quotes.mjs:590 `pathRequired: false`; verify-test-claims.mjs:166 `pathRequired: true`. |
| "verify-quotes binds a bare `:line` to the nearest preceding path:line citation in the same paragraph" | verify-quotes.mjs:755, :769 and :771. |
| "it imports nothing" | hashRefGrammar.mjs has no import statement (all 26 lines read). |
| "verify-quotes.mjs imports verify-test-claims.mjs" | verify-quotes.mjs:138, `import { claimFiles } from './verify-test-claims.mjs';`. |
| "HASH-CHECKED REFERENCES" comment | verify-quotes.mjs:545. |
| "THE `//` CONTINUATION GRAMMAR" paragraph | verify-quotes.mjs:575. |
| "Node's standard library only (here: nothing)" | No import at all. |

- **D2 (outside the PR's diff; the custodian decides): the worker report shows the `.source` strings with doubled backslashes.** The file is state/consults/2026-10-25-governance-hash-grammar-shared-build-worker-report.md, on main, lines 21-22. It quotes the strings as `` `(byte-copied from\\s+)?...` `` and presents that as the `.source`. That is the JS string-literal spelling. The real `.source` has single backslashes, for example `(byte-copied from\s+)?`. My own comparison printed it that way: scratch file hgs-g1r-src-head.txt. The equality claim still holds. Only how the strings are shown is off. The PR body does not reproduce them.

## Checked
1. **The diff against the form.**
   - `git diff --numstat origin/main...HEAD` (rc=0): exactly the Scope line's five files, 2+3, 26+0, 5+9, 14+31 and 38+0. That is 128 of 140, which matches the PR's 85 additions and 43 deletions.
   - Every Change clause is true at the head. Both local copies are gone. The factory returns a fresh RegExp each call: my script (rc=0) printed `distinct true true a.lastIndex 86 b.lastIndex 0 global true true`, and the module's exports are `GAP,hashRefRegExp`.
   - Comments and the README sentence: verify-quotes.mjs :76-77, :557 and :582, verify-test-claims.mjs :75-77 and :157-165, and README.md:135-136 each now name hashRefGrammar.mjs, and each clause holds against the code. I searched `git grep -i "DERIVED FROM|1254cddd|governance/verify-quotes"` under scripts/ and across the repo excluding state/ (rc=0). The only hits are preregistration records (HASH-GRAMMAR-SHARED, TEST-CLAIMS-SUPERSEDED, VERIFY-QUOTES), which are history. No code comment or README still states the old derivation.
2. **Byte-for-byte.** I used a one-off script, hgs-g1r-src.mjs, never committed. In the throwaway worktree I appended an export of each checker's own `HASH_REF_RE`, imported it, and printed `.source` and `.flags`. I did this at the head (rc=0) and at base b5e39efd (rc=0), reverting each time with an empty porcelain afterwards. `diff` of the two outputs gave rc=0: identical, flags `g` for both.
   - Extra check: I ran the base versions of both checkers over the head tree and compared them with the head code. verify-quotes: rc 0 and 0, output diff rc=0. verify-test-claims: rc 0 and 0, output diff rc=0. Both checkers' findings over the real corpus are unchanged.
3. **T1, T2 and the mutations.**
   - T1 and T2 at the head, in the PR worktree: rc=0, 2 of 2 pass. I also ran them with base b5e39efd's checker code (rc=0, 2 of 2 pass), which confirms the form's "passes at the base".
   - M1 was made in C:/dev/wt/hgs-g1r, detached at the head. `pathRequired: true` became `false` in verify-test-claims.mjs, one replacement. The run gave rc=1. T1 failed by name: actual "refused: another file's path", expected 'refused: no pinned reference'. T2 still passed. After the revert, the porcelain was empty.
   - M2: the rev group `([^\\s\`]+)` became `([0-9a-f]{12,40})` in hashRefGrammar.mjs, one replacement. The run gave rc=1. T2 failed by name: actual `{ quotes: 1, claims: 0 }`, expected `{ quotes: 0, claims: 1 }`, and verify-quotes reported an "unbound hash reference". T1 still passed. After the revert, the porcelain was empty.
   - No `verify-mutation` run was used.
   - Both RECORDED MUTATION comments (verify-test-claims.test.mjs, before each test) name the mutation, the expected failure and 7b380c3b2b092e0dcef33a7babe0617affa18568, which only origin/cut/governance-hash-grammar-shared contains. `git diff 7b380c3b 5a419418` is +6 comment lines in the test file only, so an observation at 7b380c3b holds for the head's code.
4. **Readers and existing tests.**
   - hgs-g1r-bodies.mjs (rc=0) compared the bodies at base and head: `extractHashRefs` (603-621 → 599-617), `markedSpans` (270-286 → 253-269) and `firstHashRefsByLine` (586-603 → 569-586) are all identical.
   - verify-test-claims.test.mjs has 0 deleted lines (two additive hunks: the import and the two tests at the end). verify-quotes.test.mjs is not in the diff. Both pass inside the suite.
5. **At the head 5a4194182e5d, in C:/dev/wt/hgs.**
   - The governance suite ran inside a shared hold (granted and released). The result was tests 557, pass 557, fail 0, and the tool reported no non-zero exit. The mandated hold shape ends in `exit $rc`, so rc was not echoed separately.
   - `verify.mjs --offline` rc=0, PASS. `verify-cites.mjs` rc=0, PASS. `verify-quotes.mjs` rc=0, PASS (0 hash-reference errors). `verify-test-claims.mjs` rc=0, PASS (657 claims).
6. **The PR body and CI.**
   - The body's figures hold: 5 files, 128 of 140, nothing outside scripts/plan/, identical `.source`, T1/M1, T2/M2, 557 of 557, the four verifiers.
   - Rule (00): no open PR besides #256 touches scripts/ (I checked the files of #255, #252, #249, #244 and #241). Of the 27 unmerged remote branches, none touches the five files. Under scripts/, port-2 touches only cfg-boundary.mjs and cfg-boundary.test.mjs. The only other branch that touches scripts/ is governance/verify-mutation-header-token, whose PR #110 is CLOSED, so it is not open.
   - `gh pr checks 256` (rc=0): every check passes. Every run is at head 5a4194182e5d8e4db428c23af47e7d8c7f08efbc: Governance CI (two runs), Ported notices (two), DCO sign-off and Exposure scan, all completed success. Nothing was pending, so no wait loop was needed.

## Cleanup
- The PR worktree C:/dev/wt/hgs is at 5a4194182e5d with an empty porcelain.
- `git worktree remove C:/dev/wt/hgs-g1r` gave rc=0, without --force, and `git worktree list` no longer shows it.
- No node process I started still runs. Two node processes remain, neither mine, and I touched neither. One background verifier call outran the 300 s foreground timeout and finished on its own with exit 0.
- Scratch files, all named hgs-g1r-*, are in <the session scratch folder>/.
- Nothing was committed or pushed, and I took no PR action.
