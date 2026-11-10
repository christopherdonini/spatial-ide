*Custodian's filing note (2026-10-28): the architect's read-only draft of the five-line form for `governance-hash-ref-leading-dot-path`, the governance lane's next piece (S3), read at main 7ad76e15. It corrects two names in the brief (the shared grammar's form is HASH-GRAMMAR-SHARED-PREREGISTRATION.md; the grammar's importers are verify-quotes and verify-test-claims, verify-cites having its own pattern). Its three OPEN items are the custodian's: OPEN-1 (B), every segment, the literal words; OPEN-2 (A), verify-cites unchanged, three residuals disclosed; OPEN-3 (A), the reviewer alone. The custodian commits the form on main from it. The run 09:45:05Z to 09:55:40Z by its transcript (Read 20, Grep 33, Glob 1; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 4938f55427057a82b3016b8857d236578094eb48ff6941f4a68a21ea0ef1c092.*

---

Drafted: governance-hash-ref-leading-dot-path, five-line form, architect

Read at: main @ 7ad76e15, read only. I cannot compute the brief's sha256. I have no shell, so no cite below carries a hash; each is `path:line @ 7ad76e15`, read in the main checkout, for the custodian to expand. All text here is mine unless it is marked otherwise. Nothing is quoted from the human; the directive is cited by line.

Two corrections to the brief, mine:
- The shared grammar's form is `scripts/plan/HASH-GRAMMAR-SHARED-PREREGISTRATION.md`. No `GOVERNANCE-HASH-GRAMMAR-SHARED-…` file exists.
- The two checkers that import the grammar are `verify-quotes.mjs` and `verify-test-claims.mjs` (scripts/plan/hashRefGrammar.mjs:1-7 @ 7ad76e15; scripts/plan/verify-quotes.mjs:139 @ 7ad76e15; scripts/plan/verify-test-claims.mjs:99 @ 7ad76e15). `verify-cites.mjs` has its own token pattern (scripts/plan/verify-cites.mjs:118 @ 7ad76e15) and does not import the grammar. verify-quotes does use verify-cites' `extractCitations` and `resolveRef` (scripts/plan/verify-quotes.mjs:137 @ 7ad76e15). That seam is covered in note 2 and OPEN-2. In the PLAN node, both checkers means the two importers (PLAN.yaml:538 @ 7ad76e15).

```
Authority: PLAN node `governance-hash-ref-leading-dot-path` (PLAN.yaml:523-539 @ 7ad76e15), placed S3 by the human's direction of 2026-10-26, item 2 (state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:24 @ 7ad76e15), which gives the widening and its tests, in the governance lane after verify-cites-past-end-bound (merged, #262); proposed by governance-hash-grammar-shared's settlement, OPEN-2 (B) (scripts/plan/HASH-GRAMMAR-SHARED-PREREGISTRATION.md:150 @ 7ad76e15); the reuse index found no prior art on either search (hash reference grammar; leading dot path), a miss noted here.
Scope: 2 files: scripts/plan/hashRefGrammar.mjs, scripts/plan/verify-test-claims.test.mjs; declared line budget 110 (insertions plus deletions, tests and comments counted, AUTONOMY.md:357 @ 7ad76e15); this form exempt; no existing test is changed or removed.
Change: the reference grammar in scripts/plan/hashRefGrammar.mjs reads a path segment that begins with a dot only when a letter, digit or underscore follows that dot, refuses a `.` or `..` segment wherever it sits, and reads no path (and no bare `:line` of verify-quotes) that directly follows a letter, digit, underscore, `.`, `/`, `+` or `-`; so a `.github/` or `.githooks/` path keeps its dot in both importers (verify-quotes resolves it in the tree and at a pin, verify-test-claims at a pin, its only reading), and `./x`, `../x`, `.` and `sub/../x` no longer bind as `x`, as a bare line, or through a normalized path, but leave their `sha256:` token unbound, which verify-quotes reports by name; verify-cites.mjs and its token grammar are unchanged.
Tests+mutation: a_leading_dot_path_pin_resolves_in_both_checkers (new, verify-test-claims.test.mjs; fails at the base): a claim file at .github/workflows/X-PREREGISTRATION.md carries a superseded row pinning its own line 3 at the v1 commit, and an unpinned reference to the same line; one deepEqual { quotes: hashFindings.length, claims: superseded.length } against { quotes: 0, claims: 1 } (at the base { quotes: 2, claims: 0 }); M1: the leading-dot alternative removed, so a path's first character is again only a letter, digit or underscore, and the deepEqual fails by name with { quotes: 2, claims: 0 }. each_dot_or_dot_dot_segment_reference_binds_in_neither_checker (new, verify-test-claims.test.mjs; fails at the base): four fixtures, each a root X-PREREGISTRATION.md whose superseded row, after a plain X-PREREGISTRATION.md:3 cite in the same paragraph, pins line 3 at the v1 commit with its true hash under the path ./X-PREREGISTRATION.md, ../X-PREREGISTRATION.md, . or sub/../X-PREREGISTRATION.md; one deepEqual over the four, each { quotes: 1, claims: 0 } (at the base { 0, 1 }, { 0, 1 }, { 0, 0 }, { 0, 0 }); M2: the preceding-character guard removed, so the deepEqual fails by name with ./ ../ and sub/../ read as X-PREREGISTRATION.md and the dot read as a bare :3; M3: a leading dot admitted before any path character, so the ./ entry resolves and the deepEqual fails by name; M4: interior segments unrestricted, so sub/../ resolves through resolveRef's normalize and the deepEqual fails by name. Each mutation is applied, the named test is run, its failure by name is recorded with the commit in a `RECORDED MUTATION:` comment, and the mutation is reverted.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (no exposure surface, no dependency, Node's standard library only); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: none touched: every existing test in verify-quotes.test.mjs, verify-test-claims.test.mjs and rotate-decisions-pending.test.mjs keeps its text and its assertion and passes, and the reading changes only for shapes that no existing test and no reference in either checker's scanned set carries (a dot-led path; a path or bare `:line` directly after a path character; an interior `.` or `..` segment); verify-cites' findings are unchanged.
```

## Notes (my reading)

### 1. The code today
- The grammar's path is `([A-Za-z0-9_][A-Za-z0-9_./+-]*)` (scripts/plan/hashRefGrammar.mjs:12 @ 7ad76e15). The pattern is not anchored (scripts/plan/hashRefGrammar.mjs:19-28 @ 7ad76e15). So the regex skips characters it cannot start on:
  - `.github/w.yml:3 …sha256:` matches starting at `g`, and group 2 is `github/w.yml`.
  - `./x` and `../x` match starting at `x`, and are read as `x`.
  - `.:3` cannot carry a path, so verify-quotes (optional path) matches it as a bare `:3`. verify-test-claims (path required) matches nothing.
- verify-quotes resolves group 2 through verify-cites' `resolveRef` (scripts/plan/verify-quotes.mjs:766-796 @ 7ad76e15):
  - first an exact tracked path, or the path relative to the citing file's directory, after `path.posix.normalize` (scripts/plan/verify-cites.mjs:204-228 @ 7ad76e15; the `./` strip at :205 and the normalize at :215);
  - then a basename suffix match;
  - then `git show <rev>:<pathRaw>`.
- verify-quotes binds a bare `:line` to the nearest path cite in its paragraph, read by verify-cites' `extractCitations` (scripts/plan/verify-quotes.mjs:406-412 @ 7ad76e15).
- verify-test-claims reads only pins naming the claim file's own path, with a commit-id rev (scripts/plan/verify-test-claims.mjs:253-269 @ 7ad76e15; withdrawn rows at :569-586 and :632-659). It refuses the HEAD default by policy, so for this checker "resolves" means "at a pin".
- Consequence today: `.github/…` fails by name in verify-quotes (unresolvable path). `./x`, `../x` and `sub/../x` silently resolve to some other file when one exists. The human's named tests target exactly these readings.

### 2. Settled
- **First characters.** A segment may start with a letter, digit or underscore, or with a dot that has a letter, digit or underscore after it. That admits `.github`, `.githooks`, `.claude` and `.x1`. It refuses `.` and `..` as segments, and also `./`, `.-x`, `.+x` and `.:`.
- **Other segments.** I read the human's rule literally, for every segment (OPEN-1). A non-first segment that does not start with a dot keeps today's characters. Today's body already allows `//`, `/+` and `/-`, and those stay admitted, because the human's rule speaks only of dots. A possible shape, as guidance for the worker and not binding: `(?:\.(?=[A-Za-z0-9_]))?[A-Za-z0-9_](?:[A-Za-z0-9_.+-]|/(?!\.(?![A-Za-z0-9_])))*`.
- **The guard is required, not an addition.**
  - A negative lookbehind for a path character goes after the optional opening backtick, so it covers both the path start and verify-quotes' bare `:`.
  - Without it, narrowing the path only moves the match start rightward: `./x` and `../x` stay read as `x`, and `.:3` stays a bare reference. The human's named tests would then pass only on fixtures where `x` happens not to resolve. M2 pins this.
  - The guard cannot change the start of an existing leftmost match. A match today can begin right after a path character only when that character is `.`, `/`, `+` or `-`, because an earlier start on a letter would have matched first. The Grep below found no such reference in either checker's scanned set.
- **Resolution after the change.**
  - verify-quotes resolves the dotted group 2 in the tree, by exact tracked path through `resolveRef` (the `./` strip at verify-cites.mjs:205 leaves `.github/` alone). With `@ <rev>` it resolves at the pin. Where the file is gone from the tree, it falls back to `git show <rev>:<pathRaw>` with the dot (scripts/plan/verify-quotes.mjs:785-793 @ 7ad76e15).
  - verify-test-claims resolves at a pin only, by its unchanged policy.
  - verify-cites does not use the grammar. Its token pattern still reads a dot-led `path:line` without the dot. That path's first segment is not a top directory, so it is loose (scripts/plan/verify-cites.mjs:240-245 @ 7ad76e15), and it matches no tracked suffix, so it is skipped (:57-63). That is unchanged. Residuals are in OPEN-2.

### 3. Tracked references whose reading changes
- Grep searched the whole tree on disk, hidden directories included (it did search `.claude/agents`), with the pattern a non-path character, then a run of `.`, `/`, `+` or `-`, then an optional path, then `:N[-M]`, then an optional `@ rev`, then `sha256:<64 hex>`. It found only:
  - state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:317-384 @ 7ad76e15 (twelve `.github/workflows/*.yml` pins at 163ce8c11afb), and :964 (a `<skill-root>/reference.md:75` hash);
  - state/consults/2026-10-16-boundary-inventory-architect.md:16 and :20 @ 7ad76e15 (`.githooks/`, `.github/`, `.claude/` pins at b88b1d2f).
- Neither file is in either checker's scan set. verify-test-claims scans only `*PREREGISTRATION*.md` and `docs/adr/*.md` (scripts/plan/verify-test-claims.mjs:720-722 @ 7ad76e15). verify-quotes' hash set is that set, the ruling files, AI_DEVELOPMENT.md, docs/PREREGISTRATION-TEMPLATE.md and `.claude/agents/*.md` (scripts/plan/verify-quotes.mjs:418-420 and :435-444 @ 7ad76e15). So no gated reading changes, and nothing happens to these refs. Their dotted pins would read correctly if they were ever scanned.
- No hash reference anywhere has an interior `/./`, `/../`, `//`, `/+` or `/-` segment (two Greps, zero matches).
- Dot-led cites in forms are written in plain text with `at <commit>, sha256 <hex>`, with no `sha256:` (HASH-GRAMMAR-SHARED-PREREGISTRATION.md:3 @ 7ad76e15 describes the convention). Neither the grammar nor `RAW_SHA_RE` reads them (scripts/plan/verify-quotes.mjs:596 @ 7ad76e15), so they are unchanged.
- No hash baseline entry names a dot path: no `*.json` under scripts/plan mentions github, githooks or `claude/`.
- The test files carry no `.github`, `./` or `../` fixture (Grep of the four test files).
- Proof required beyond the Grep floor: the worker runs `node scripts/plan/verify-quotes.mjs` and `node scripts/plan/verify-test-claims.mjs` at the base and at the head on the real tree, and records in its hand-back that the findings are identical.

### 4. Tests (both in verify-test-claims.test.mjs)
- They reuse `gitRepoAt`, `commitAll`, `pinRow`, `sha256Hex`, `lineOfV1` and `SUPERSEDED_V1` (scripts/plan/verify-test-claims.test.mjs:223-256 @ 7ad76e15) and the imported `runVerifyQuotes` (:29). T1 needs `fs.mkdirSync(…, { recursive: true })` for `.github/workflows/` before `gitRepoAt`.
- The model is governance-hash-grammar-shared's T2 (scripts/plan/verify-test-claims.test.mjs:1755-1773 @ 7ad76e15).
- **T1 at the base:**
  - verify-quotes reads `github/workflows/X-PREREGISTRATION.md`. resolveRef finds no exact, relative or suffix match: `.github/…` does not end with `/github/…`. `git show` fails, so both references give an unresolvable-path finding.
  - verify-test-claims' group 2 is not equal to the claim path, so nothing is superseded.
  - The result is { 2, 0 }.
- **T2 at the base:**
  - `./` and `../` are read as `X-PREREGISTRATION.md`, which resolves (citing directory is root) and equals the claim path: { 0, 1 }.
  - `.` binds as a bare `:3` to the plain cite and passes; verify-test-claims has no match: { 0, 0 }.
  - `sub/../X` is normalized by resolveRef to `X-PREREGISTRATION.md` and passes, but is not equal to the claim path: { 0, 0 }.
- **T2 after the change:** each row leaves `sha256:` unbound, with `:3` within verify-quotes' 120-character lookback (scripts/plan/verify-quotes.mjs:629-651 @ 7ad76e15). That gives one finding per fixture and no superseded claim.
- **M3 detail:** `../X` from root is not resolved by resolveRef: its normalize keeps `../`, and `git show` refuses a path outside the repository. So M3 is caught by the `./` entry only. That is enough to fail the test by name.
- Only `hashFindings` and `superseded` are asserted, so other finding kinds do not matter. The worker checks that no row trips a quote trigger.

### 5. Size (§21c, AUTONOMY.md:349-357 @ 7ad76e15): it fits
| File | Lines (my estimate) |
|---|---|
| hashRefGrammar.mjs (path, guard, a comment stating the path rule and the guard) | about 15 |
| T1 with M1 comment | about 28 |
| T2 with M2–M4 comments | about 55 |
| **Total** | **about 98, 2 files** |
- Declared budget: 110. Under 150 lines and 8 files. No dependency, no exposure surface, no user-visible behaviour.

### 6. Out-of-scope readings
- **Guarantee** (AUTONOMY.md:325-327 @ 7ad76e15): the line is true on this reading: a property currently under test is one an existing test asserts. None changes (note 3). The changed readings are new properties with new tests. Routing is the human's: item 2 placed a five-line form. OPEN-3 asks for confirmation.
- **Round 25, item 2 (e):** the line names no §21a category as touched.
- **Gate:** the reviewer alone (§21b, AUTONOMY.md:334-345 @ 7ad76e15).
- **Governance CI over these files:** `node --test` (.github/workflows/governance-ci.yml:148 @ 7ad76e15), verify:cites (:153), verify:quotes (:156) and verify:test-claims (:159). The form is a claim file. T1 and T2 read as planned through `gate:`.
- **For the custodian's expansion:** the form is committed before the code, so the base grammar reads it. Any `.github/…` cite in it must stay in the plain-text form (`at <commit>, sha256 <hex>`), not as a pin.

### 7. Rule (00), path by path
This piece: scripts/plan/hashRefGrammar.mjs, scripts/plan/verify-test-claims.test.mjs, and the form on main (my proposed name: scripts/plan/HASH-REF-LEADING-DOT-PATH-PREREGISTRATION.md).

| In flight | Overlap |
|---|---|
| slot 2, `b2-piece-1c-save-and-reopen` | Disjoint (kernel/, renderer/, spikes/, two ADRs). Its ADR amendments are verify:quotes and verify:test-claims scan files. Whichever of the two merges second is read under the other's grammar; CI on that PR checks it. |
| port-2, `port-2-macos-l1-and-app-dirs` | Disjoint. It touches scripts/plan/cfg-boundary.mjs and its test (same folder, other files, the same `node --test` glob) and `.github/workflows/product-ci-rust.yml`; this piece names a `.github/workflows/` path only inside a temporary repository. |
| 6b, `first-batch-factorial-ignored-trace-tests` | Disjoint. Its form on main has one dot-led cite in plain text, not grammar form. |
| O1 | Nothing on a branch. |
| protocol/ | No piece here touches it. |

The paths are the brief's; I cannot read branches.

## OPEN items

**OPEN-1: interior `.` and `..` segments.** Today the grammar admits them, and resolveRef normalizes `sub/../x`. The directive's word stay (directive :24) suggests they are already refused, which holds only for the first segment.
- (A) First segment only: drop M4 and the fourth T2 shape, and disclose interior normalization as a residual.
- (B) Every segment, the literal wording: recommended. It changes no tracked reading (note 3) and closes the same relative-path hazard in the middle of a path.
- The custodian's to confirm on the literal words. It is the human's only if the custodian reads stay as limiting the rule to the first segment.

**OPEN-2: verify-cites, and the seam through it.**
- (A) Leave verify-cites unchanged and disclose three residuals in the closing record: recommended.
  - verify-cites still reads a dot-led `path:line` without its dot: loose, unmatched, skipped.
  - A bare `:line` after a dot-led cite in the same paragraph binds, through `extractCitations`, to the dotless path. It fails by name (unresolvable path), so it fails closed, never open.
  - verify-quotes' advisory `--show-cites` listing keys hash marks by `pathRaw` (scripts/plan/verify-quotes.mjs:1062 and :1093 @ 7ad76e15). A dot-led cite shows no hash mark. The listing is advisory only.
- (B) Widen verify-cites' token pattern here. Not recommended. It is outside the placement, which covers the shared grammar. It would also turn every dot-led cite into a rooted, gated one: my Grep over `*.md` found about 95 lines across 47 files. That is gate behaviour across the whole tree and past this budget.
- (A) is the custodian's. A follow-up node for verify-cites would be the human's to place.

**OPEN-3: guarantee reading and gate.**
- (A) As written: a property under test is an existing test's assertion, and the gate is the reviewer alone. Recommended, consistent with governance-hash-grammar-shared's settlement, OPEN-1 (A) (scripts/plan/HASH-GRAMMAR-SHARED-PREREGISTRATION.md:149 @ 7ad76e15).
- (B) Read the changed recognition as touching a property under test. That means full gating, which conflicts with the human's five-line placement, so it would be the human's.
- (A) is the custodian's.

## Could not settle
- I could not run either checker. The claim that no gated reading changes rests on Grep patterns over the simple and inside-backtick shapes; a reference wrapped onto a second `//` comment line was not searched (no such file is in the default scan set). The worker's base and head findings comparison (note 3) is the proof.
- I did not confirm how `git show <rev>:sub/../x` behaves. The test does not depend on it: resolveRef's normalize resolves that path first, from the tracked index.
- I cannot read the in-flight branches, so the overlap table rests on the brief's path lists.
