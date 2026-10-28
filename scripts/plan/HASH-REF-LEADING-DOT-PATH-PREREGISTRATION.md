# scripts/plan/hashRefGrammar.mjs: a hash-pinned reference may name a path that starts with a dot, and a . or .. segment binds nowhere — five-line short form (`AUTONOMY.md` §21d)

*Committed before any code. Append-only once committed; an amendment written after any run of this piece's mutations has been seen says so in its first line. PLAN node governance-hash-ref-leading-dot-path, the governance lane's piece (S3). The five lines and the notes are the architect's draft (`state/consults/2026-10-28-governance-hash-ref-leading-dot-path-five-line-form-architect-draft.md`, read only at main 7ad76e15; its sha256 from line 5 is 4938f55427057a82b3016b8857d236578094eb48ff6941f4a68a21ea0ef1c092), with two changes, both the custodian's: each cite read at 7ad76e15 is expanded by script to `path:line @ <commit> sha256:<the lines with their LFs>` (a dot path as `path:line` at <commit>, sha256 <hex>, so the base grammar does not read it as a pin): the cites the draft marks, every cite on a line before that line's last marker, and every cite written with a file name that resolves to one tracked path, since the draft reads every cite at 7ad76e15; a file name that resolves to no tracked file (the tests' fixture names) is left as written (28 pins; 2 by a bare or partial name; 2 left as written); and the settlement below. Line numbers written with no file name and no marker name lines of the file the sentence names, at 7ad76e15; they are not pinned. Every pin is historical. Form path: `scripts/plan/HASH-REF-LEADING-DOT-PATH-PREREGISTRATION.md`. The custodian keeps the PLAN node on main; the branch carries no PLAN file and no generated file. Gating: the reviewer alone (§21b; OPEN-3 (A)).*

```
Authority: PLAN node `governance-hash-ref-leading-dot-path` (PLAN.yaml:523-539 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:c1fbc1757a97c1be05ab5e7b0a8f7e9a3e744f195589a5bca454ada6a4b97a25), placed S3 by the human's direction of 2026-10-26, item 2 (state/directives/2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md:24 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:277d565958b870e1f164e317dc68fa2bdc1959ac28b0e75569ec8e385fe01009), which gives the widening and its tests, in the governance lane after verify-cites-past-end-bound (merged, #262); proposed by governance-hash-grammar-shared's settlement, OPEN-2 (B) (scripts/plan/HASH-GRAMMAR-SHARED-PREREGISTRATION.md:150 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:4f76ee2a444642b327082b3a5f5202c1dc72f3133400eb04a3d98bffc845fd04); the reuse index found no prior art on either search (hash reference grammar; leading dot path), a miss noted here.
Scope: 2 files: scripts/plan/hashRefGrammar.mjs, scripts/plan/verify-test-claims.test.mjs; declared line budget 110 (insertions plus deletions, tests and comments counted, AUTONOMY.md:357 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:367596df34a73d122765d000ba5df601dbe54da9e5a6aefca966747809a44fec); this form exempt; no existing test is changed or removed.
Change: the reference grammar in scripts/plan/hashRefGrammar.mjs reads a path segment that begins with a dot only when a letter, digit or underscore follows that dot, refuses a `.` or `..` segment wherever it sits, and reads no path (and no bare `:line` of verify-quotes) that directly follows a letter, digit, underscore, `.`, `/`, `+` or `-`; so a `.github/` or `.githooks/` path keeps its dot in both importers (verify-quotes resolves it in the tree and at a pin, verify-test-claims at a pin, its only reading), and `./x`, `../x`, `.` and `sub/../x` no longer bind as `x`, as a bare line, or through a normalized path, but leave their `sha256:` token unbound, which verify-quotes reports by name; verify-cites.mjs and its token grammar are unchanged.
Tests+mutation: a_leading_dot_path_pin_resolves_in_both_checkers (new, verify-test-claims.test.mjs; fails at the base): a claim file at .github/workflows/X-PREREGISTRATION.md carries a superseded row pinning its own line 3 at the v1 commit, and an unpinned reference to the same line; one deepEqual { quotes: hashFindings.length, claims: superseded.length } against { quotes: 0, claims: 1 } (at the base { quotes: 2, claims: 0 }); M1: the leading-dot alternative removed, so a path's first character is again only a letter, digit or underscore, and the deepEqual fails by name with { quotes: 2, claims: 0 }. each_dot_or_dot_dot_segment_reference_binds_in_neither_checker (new, verify-test-claims.test.mjs; fails at the base): four fixtures, each a root X-PREREGISTRATION.md whose superseded row, after a plain X-PREREGISTRATION.md:3 cite in the same paragraph, pins line 3 at the v1 commit with its true hash under the path ./X-PREREGISTRATION.md, ../X-PREREGISTRATION.md, . or sub/../X-PREREGISTRATION.md; one deepEqual over the four, each { quotes: 1, claims: 0 } (at the base { 0, 1 }, { 0, 1 }, { 0, 0 }, { 0, 0 }); M2: the preceding-character guard removed, so the deepEqual fails by name with ./ ../ and sub/../ read as X-PREREGISTRATION.md and the dot read as a bare :3; M3: a leading dot admitted before any path character, so the ./ entry resolves and the deepEqual fails by name; M4: interior segments unrestricted, so sub/../ resolves through resolveRef's normalize and the deepEqual fails by name. Each mutation is applied, the named test is run, its failure by name is recorded with the commit in a `RECORDED MUTATION:` comment, and the mutation is reverted.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (no exposure surface, no dependency, Node's standard library only); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: none touched: every existing test in verify-quotes.test.mjs, verify-test-claims.test.mjs and rotate-decisions-pending.test.mjs keeps its text and its assertion and passes, and the reading changes only for shapes that no existing test and no reference in either checker's scanned set carries (a dot-led path; a path or bare `:line` directly after a path character; an interior `.` or `..` segment); verify-cites' findings are unchanged.
```

**The reuse index**, byte for byte as the custodian ran it for the draft's brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs hash reference grammar
No prior art recorded for "hash reference grammar". Research it before planning an implementation.
$ node tools/reuse.mjs leading dot path
No prior art recorded for "leading dot path". Research it before planning an implementation.
```

*The notes below are the architect's from its draft, carried byte for byte except for the pins; where they say mine or my, they mean the architect's. They are this form's reading.*

## Notes

### 1. The code today
- The grammar's path is `([A-Za-z0-9_][A-Za-z0-9_./+-]*)` (scripts/plan/hashRefGrammar.mjs:12 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:eb4e99f83584b7bfd29fcda759b7ec9a46a7063bd5bbfea9f7a204e95636fe46). The pattern is not anchored (scripts/plan/hashRefGrammar.mjs:19-28 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:10c644ef2689ea5094b159be717c7a701aeb5725b0014f317bb56cc6343d502b). So the regex skips characters it cannot start on:
  - `.github/w.yml:3 …sha256:` matches starting at `g`, and group 2 is `github/w.yml`.
  - `./x` and `../x` match starting at `x`, and are read as `x`.
  - `.:3` cannot carry a path, so verify-quotes (optional path) matches it as a bare `:3`. verify-test-claims (path required) matches nothing.
- verify-quotes resolves group 2 through verify-cites' `resolveRef` (scripts/plan/verify-quotes.mjs:766-796 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:b7f894c8049e584a547ce02e38c9064e7c0d000b4bfc0fe33e64aebd10c693c3):
  - first an exact tracked path, or the path relative to the citing file's directory, after `path.posix.normalize` (scripts/plan/verify-cites.mjs:204-228 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:37e84e1369824840a5de76c7c2f1c173e59398de4fc48114ae4d575f40e05acc; the `./` strip at :205 and the normalize at :215);
  - then a basename suffix match;
  - then `git show <rev>:<pathRaw>`.
- verify-quotes binds a bare `:line` to the nearest path cite in its paragraph, read by verify-cites' `extractCitations` (scripts/plan/verify-quotes.mjs:406-412 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:1d3f20b89dd3e91a60e671c9a52c9d7d8bb28df69d890e449a568318cb8865bc).
- verify-test-claims reads only pins naming the claim file's own path, with a commit-id rev (scripts/plan/verify-test-claims.mjs:253-269 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:667dc1ad05887a5d4e0f610704113fcc2af49bab781aa67568ebd0fe7c5da042; withdrawn rows at :569-586 and :632-659). It refuses the HEAD default by policy, so for this checker "resolves" means "at a pin".
- Consequence today: `.github/…` fails by name in verify-quotes (unresolvable path). `./x`, `../x` and `sub/../x` silently resolve to some other file when one exists. The human's named tests target exactly these readings.

### 2. Settled
- **First characters.** A segment may start with a letter, digit or underscore, or with a dot that has a letter, digit or underscore after it. That admits `.github`, `.githooks`, `.claude` and `.x1`. It refuses `.` and `..` as segments, and also `./`, `.-x`, `.+x` and `.:`.
- **Other segments.** I read the human's rule literally, for every segment (OPEN-1). A non-first segment that does not start with a dot keeps today's characters. Today's body already allows `//`, `/+` and `/-`, and those stay admitted, because the human's rule speaks only of dots. A possible shape, as guidance for the worker and not binding: `(?:\.(?=[A-Za-z0-9_]))?[A-Za-z0-9_](?:[A-Za-z0-9_.+-]|/(?!\.(?![A-Za-z0-9_])))*`.
- **The guard is required, not an addition.**
  - A negative lookbehind for a path character goes after the optional opening backtick, so it covers both the path start and verify-quotes' bare `:`.
  - Without it, narrowing the path only moves the match start rightward: `./x` and `../x` stay read as `x`, and `.:3` stays a bare reference. The human's named tests would then pass only on fixtures where `x` happens not to resolve. M2 pins this.
  - The guard cannot change the start of an existing leftmost match. A match today can begin right after a path character only when that character is `.`, `/`, `+` or `-`, because an earlier start on a letter would have matched first. The Grep below found no such reference in either checker's scanned set.
- **Resolution after the change.**
  - verify-quotes resolves the dotted group 2 in the tree, by exact tracked path through `resolveRef` (the `./` strip at scripts/plan/verify-cites.mjs:205 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:d8b2c2cef047034cc98e265ce10ae9beee22e11f28cb9c7c95bc3b701bcc3299 leaves `.github/` alone). With `@ <rev>` it resolves at the pin. Where the file is gone from the tree, it falls back to `git show <rev>:<pathRaw>` with the dot (scripts/plan/verify-quotes.mjs:785-793 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:a1ac7b288a3b4d83bc2d541f2b04c38a33f6c2040b295dee552a7a643eb0b8cb).
  - verify-test-claims resolves at a pin only, by its unchanged policy.
  - verify-cites does not use the grammar. Its token pattern still reads a dot-led `path:line` without the dot. That path's first segment is not a top directory, so it is loose (scripts/plan/verify-cites.mjs:240-245 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:4d6a04ccde5c2d15f00ffb0ce5f5516c81cbc7efc169a2b46f9cb23798c80944), and it matches no tracked suffix, so it is skipped (:57-63). That is unchanged. Residuals are in OPEN-2.

### 3. Tracked references whose reading changes
- Grep searched the whole tree on disk, hidden directories included (it did search `.claude/agents`), with the pattern a non-path character, then a run of `.`, `/`, `+` or `-`, then an optional path, then `:N[-M]`, then an optional `@ rev`, then `sha256:<64 hex>`. It found only:
  - state/consults/2026-10-04-evidence-recorder-v0-p0-report.md:317-384 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:1bd9a54955c40b3d7322c6f01a6baf73aea7a6881e289978d310e9a2576d601b (twelve `.github/workflows/*.yml` pins at 163ce8c11afb), and :964 (a `<skill-root>/reference.md:75` hash);
  - state/consults/2026-10-16-boundary-inventory-architect.md:16 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:fe7fce1681547305f2e537d45c33c72a5792876cf0af665e01149034f880a1ce and state/consults/2026-10-16-boundary-inventory-architect.md:20 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:30f1865e647f7f53d57a036b953b5ec829520563fb6b35cbefa758f147da29c6 (`.githooks/`, `.github/`, `.claude/` pins at b88b1d2f).
- Neither file is in either checker's scan set. verify-test-claims scans only `*PREREGISTRATION*.md` and `docs/adr/*.md` (scripts/plan/verify-test-claims.mjs:720-722 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:7412016b5b48773dc4380b5aa8c1da1fd9dfe63a9f187dcdea21128c55894660). verify-quotes' hash set is that set, the ruling files, AI_DEVELOPMENT.md, docs/PREREGISTRATION-TEMPLATE.md and `.claude/agents/*.md` (scripts/plan/verify-quotes.mjs:418-420 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:d824847c273e9807cbbf1c07d3fe252184bca14940902b8b5b4a9f456fe1117e and scripts/plan/verify-quotes.mjs:435-444 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:0436a4b22f12ddc408d58dd9b9c1f408b8dcab25f580e27bd0e6799f9fdd6e88). So no gated reading changes, and nothing happens to these refs. Their dotted pins would read correctly if they were ever scanned.
- No hash reference anywhere has an interior `/./`, `/../`, `//`, `/+` or `/-` segment (two Greps, zero matches).
- Dot-led cites in forms are written in plain text with `at <commit>, sha256 <hex>`, with no `sha256:` (scripts/plan/HASH-GRAMMAR-SHARED-PREREGISTRATION.md:3 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:077277c3a6fa80abac520fb6a02c1852eb39a96b6830154188d8756e343c33e3 describes the convention). Neither the grammar nor `RAW_SHA_RE` reads them (scripts/plan/verify-quotes.mjs:596 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:5e765fa7054cd565d3886861e3981a42f878ddaa3f3535145f44f602c3ec0cf4), so they are unchanged.
- No hash baseline entry names a dot path: no `*.json` under scripts/plan mentions github, githooks or `claude/`.
- The test files carry no `.github`, `./` or `../` fixture (Grep of the four test files).
- Proof required beyond the Grep floor: the worker runs `node scripts/plan/verify-quotes.mjs` and `node scripts/plan/verify-test-claims.mjs` at the base and at the head on the real tree, and records in its hand-back that the findings are identical.

### 4. Tests (both in verify-test-claims.test.mjs)
- They reuse `gitRepoAt`, `commitAll`, `pinRow`, `sha256Hex`, `lineOfV1` and `SUPERSEDED_V1` (scripts/plan/verify-test-claims.test.mjs:223-256 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:2501c844ec399d792a7f3a1fe726163edca3a092c4cb4b76387f2d2b4bf6f34a) and the imported `runVerifyQuotes` (:29). T1 needs `fs.mkdirSync(…, { recursive: true })` for `.github/workflows/` before `gitRepoAt`.
- The model is governance-hash-grammar-shared's T2 (scripts/plan/verify-test-claims.test.mjs:1755-1773 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:e16958b90ac4439f2e78042f6aaf42b8018b8ef46960f0109d0f6968ca69842e).
- **T1 at the base:**
  - verify-quotes reads `github/workflows/X-PREREGISTRATION.md`. resolveRef finds no exact, relative or suffix match: `.github/…` does not end with `/github/…`. `git show` fails, so both references give an unresolvable-path finding.
  - verify-test-claims' group 2 is not equal to the claim path, so nothing is superseded.
  - The result is { 2, 0 }.
- **T2 at the base:**
  - `./` and `../` are read as `X-PREREGISTRATION.md`, which resolves (citing directory is root) and equals the claim path: { 0, 1 }.
  - `.` binds as a bare `:3` to the plain cite and passes; verify-test-claims has no match: { 0, 0 }.
  - `sub/../X` is normalized by resolveRef to `X-PREREGISTRATION.md` and passes, but is not equal to the claim path: { 0, 0 }.
- **T2 after the change:** each row leaves `sha256:` unbound, with `:3` within verify-quotes' 120-character lookback (scripts/plan/verify-quotes.mjs:629-651 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:059fd342c8e0eabdaed4957eabf5a5b2cdf3724746f22727bdcfeff023995821). That gives one finding per fixture and no superseded claim.
- **M3 detail:** `../X` from root is not resolved by resolveRef: its normalize keeps `../`, and `git show` refuses a path outside the repository. So M3 is caught by the `./` entry only. That is enough to fail the test by name.
- Only `hashFindings` and `superseded` are asserted, so other finding kinds do not matter. The worker checks that no row trips a quote trigger.

### 5. Size (§21c, AUTONOMY.md:349-357 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:c99b2fcabe5d66acf6c904d268db4cb8f1d2451a4429bcba596b0381a2749159): it fits
| File | Lines (my estimate) |
|---|---|
| hashRefGrammar.mjs (path, guard, a comment stating the path rule and the guard) | about 15 |
| T1 with M1 comment | about 28 |
| T2 with M2–M4 comments | about 55 |
| **Total** | **about 98, 2 files** |
- Declared budget: 110. Under 150 lines and 8 files. No dependency, no exposure surface, no user-visible behaviour.

### 6. Out-of-scope readings
- **Guarantee** (AUTONOMY.md:325-327 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:8a15c806777af23d1ccc4e1ea6d14ce595d679714544814504cea18715b4dfd7): the line is true on this reading: a property currently under test is one an existing test asserts. None changes (note 3). The changed readings are new properties with new tests. Routing is the human's: item 2 placed a five-line form. OPEN-3 asks for confirmation.
- **Round 25, item 2 (e):** the line names no §21a category as touched.
- **Gate:** the reviewer alone (§21b, AUTONOMY.md:334-345 @ 7ad76e15a045c819095d2b45685766b1578e15e0 sha256:09cdfc393a829fab7d4ceeaac847a7927225bb3580d694d5821abeb6d6730655).
- **Governance CI over these files:** `node --test` (`.github/workflows/governance-ci.yml:148` at 7ad76e15a045c819095d2b45685766b1578e15e0, sha256 3cb8995fcb0e1f0b6893038f3b2f2888cda2c5bacef704fe6d643b44f181b301), verify:cites (:153), verify:quotes (:156) and verify:test-claims (:159). The form is a claim file. T1 and T2 read as planned through `gate:`.
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

## The custodian's settlement (class 1, before any code)

- **OPEN-1: (B).** The rule holds for every path segment, as the placement's words read: a `.` or `..` segment binds nowhere, the first segment or any other; M4 and the fourth fixture stay.
- **OPEN-2: (A).** verify-cites and its token pattern are unchanged; the three residuals of OPEN-2 (A) are disclosed in the closing record. A verify-cites follow-up is not proposed here.
- **OPEN-3: (A).** A property under test is an existing test's assertion; none changes; the reviewer alone gates it.
- **The proof note 3 asks for:** the worker runs `node scripts/plan/verify-quotes.mjs` and `node scripts/plan/verify-test-claims.mjs` on the real tree at the base and at the head and shows the findings identical.
- **Rule (00)** was checked again at main 958c986d by `git diff --name-only origin/main...<branch>` for every open branch and the branches in flight: none touches `scripts/plan/hashRefGrammar.mjs` or `scripts/plan/verify-test-claims.test.mjs`. Nothing touches `protocol/`.

## Amendments (opens empty; append-only)
