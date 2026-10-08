# PR #194 gate 1 — reviewer (single gate)
Reviewed: cut/docs-08-public-data-sentence @ 388531fa3df01e2d63854ff63992c6e30014982b

**Verdict: PASS.** I found no Correctness, Evidence or Documentation findings. Tag: `node:docs-08-public-data-sentence@g1`. Base 4cb3cd2e6861612efdebf243eda17c947f6a9f24, which is the merge-base with origin/main 4eb74125. The worktree `C:/dev/wt/d08` is clean and at the head.

## Out-of-scope line (read first)
The line is true. I checked each category against `AUTONOMY.md` §21a:
- **ADR:** no file under `docs/adr/` is in the diff.
- **Security:** `docs/adr/ADR-009-license-and-open-core-boundary.md` has no match for corpus, Overture, OSM, redistribut or dataset, so the corpus-data sentence is not ADR-009 posture.
- **Wire:** no `protocol/` path is in the diff.
- **Guarantee:** the sentence is a corpus-handling policy. It is not one of the guarantees §21a lists, and no test covers it.
- **Size:** 2 changed lines in 1 file, well under §21c.

## Diff
- `git diff --numstat origin/main...origin/cut/docs-08-public-data-sentence` gives `1	1	docs/08_Testing.md` (rc 0).
- The branch has one commit, 388531fa, on 4cb3cd2e.
- Only line 40 of `docs/08_Testing.md` is replaced. Nothing else changes, which matches the form's Scope and Change lines.

## The sentence
- **Derivation:** I derived it by script from `state/directives/2026-10-08-m1-mutations-branch-docs08-adr036.md`. The `3. docs/08, line 40` header is at line 24, so the sentence is lines 25–27. I stripped each line's leading spaces, joined the lines with single spaces and added a final LF.
- **Comparison:** `cmp` of my derivation against line 40 of `docs/08_Testing.md` at 388531fa returned rc 0, so the two are byte-identical.
- **Em dash:** line 40 has one U+2014 (bytes 342 200 224), the same character the old line used.
- **Line ending:**
  - `file` reports UTF-8 with no CRLF for the file on both main and the branch.
  - 0 CR bytes on the branch.
  - `git check-attr` gives `text: auto` and `eol: lf`.

## Fit with the #12 ruling
- The question round 27, item 3 RULED block in `DECISIONS-PENDING.md` keeps #12 local-only, fetch-only and never redistributed, with contributor and licence names as attribution. The new line agrees with it, and it removes the "redistributable" claim that conflicted.
- The line is the human's words byte for byte and claims nothing beyond them.
- What it says is supported on the branch. The only public-data file tracked in the corpus record is #12 (Overture, building-bern). Its row in `engine/compat-corpus/LICENCES.md` (line 29) records the licences, the attribution, the source hash and "local-only — fetch-only, never redistributed". `engine/compat-corpus/RECORD.md:32` records its hash.
- No Overture, OSM, Sentinel or NAIP data file is tracked: `git ls-files | grep -iE 'overture|osm|sentinel|naip'` returned nothing.

## Other uses
`git grep -n -i redistributable -- docs/` (rc 0) finds only two lines, and neither is about the public-data corpora. Both concern operator text entering a published bundle:
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:924`
- `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:930`

## Checks (in the worktree at 388531fa)
| Check | rc | Result |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | PASS, 1538 files, 37 loose advisories that predate this PR |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS, 121 checked |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 525 claims |
| `node scripts/plan/verify.mjs` | 0 | PASS |
| `node scripts/plan/queue.mjs --check` | 0 | current |
| `node scripts/plan/site.mjs --check` | 0 | current |
| `node scripts/plan/cfg-boundary.mjs` | 0 | 18 sites, 0 outside every boundary |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0 | 457 tests, 457 pass, 0 fail |
| `git status --porcelain` after the runs | — | empty |

## CI
`gh pr checks 194` (rc 0) printed two lines in full:
- `every commit is signed off	pass	6s`
- `no profile path in the range	pass	13s`

Nothing is pending. `governance-ci.yml` is path-filtered (lines 95–111 of that workflow) and does not list `docs/08_Testing.md`, so it was not expected to run. The local runs above cover it.

## PR body, title and commit message against the head
- Every claim in the body matches the head:
  - Head 388531fa, one commit.
  - Base 4cb3cd2e.
  - Line 40 only, 1 line added and 1 removed.
  - Both derivations byte-identical; the worker report says so.
  - The six checks exit 0.
  - The grep finds only ADR-017's two lines.
- **Low-profile direction** (`state/directives/2026-10-08-low-profile-on-github.md`): the title, body and commit message hold no outside issue or PR reference, no outside link and no @mention.
- The commit is signed off.

## Worker report
`state/consults/2026-10-08-docs-08-public-data-sentence-worker-report-1.md` is on main at d319de87.
- I recomputed its stated sha256 from line 5 to the end: `e6fb72d8ca4d84be24cdbb34bfdae2ffd5ead74c20201b4d5b474e2098351914`. It matches, and the file ends in one LF.
- Its facts match what I observed: directive lines 25–27, U+2014, LF, numstat `1 1`, the two ADR-017 hits.

## Observations (not findings; nothing to fix in this PR)
1. `docs/14_Governance_and_Licensing.md:27` says Overture and OSM attribution "must be preserved in benchmarks, demos, and published bundles". A demo bundle built from a corpus file would be a redistribution, which docs/08:40 now says never happens. By lower-number-wins, docs/08 governs. Reconciling docs/14 is outside this piece's Scope; it is for the custodian to queue if wanted.
2. The PR body's "corpus #12" renders on GitHub as a link to this repository's own issue or PR #12. That is not outside, so the low-profile direction is not engaged, but the link points at something unrelated. Writing "corpus entry 12" would avoid it. This is optional.

No heavy command was run, so no machine hold was taken.
