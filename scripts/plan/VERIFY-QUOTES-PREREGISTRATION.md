# verify-quotes — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code, per the header rule both full and short forms keep.*

```
Authority: custodian dispatch (2026-09-17) closing the misquote/stale-cite-content failure class recorded at caa987e ("chore(gates): briefa-p3b-owner-side-invalidation architect (attempt 2) FAIL -- record fidelity (two misquotes, one off-by-one row cite)", cut/briefa-p3b's engine/ADMISSION-PREREGISTRATION.md Amendments 6-7) and AUTONOMY.md §6a's citation-integrity-scan obligation; no PLAN.yaml node yet (new governance-lane tooling piece, human decides landing).
Scope: scripts/plan/verify-quotes.mjs, scripts/plan/verify-quotes.test.mjs, scripts/plan/VERIFY-QUOTES-PREREGISTRATION.md (<=8 files; declared line budget <=150 non-generated per §21c, code+tests, this preregistration excluded).
Change: adds a governance check that a quotation presented as verbatim (>=8 words, straight or curly double quotes, or a `> ` blockquote, introduced within ~200 preceding characters by verbatim / reads: / reads, / says: / states: / quoted from / quoting / the human:) actually occurs, after whitespace/curly-quote/dash normalization, in the tracked tree's text files -- and advisory-lists every path:line cite's first cited line (--show-cites) so a reader can eyeball whether the line says what the clause claims. Not wired into package.json, CI, or verify.mjs.
Tests+mutation: node --test scripts/plan/verify-quotes.test.mjs -- a true straight-quote pass, a blockquote-wrapped multi-line pass, a curly-quote pass, a one-word misquote FAIL, a quote introduced by a path that is found only elsewhere (advisory), and a cite-listing case; each new test carries its own `// RECORDED MUTATION:` comment naming the edit that fails it by name, one mutation performed and reverted per test.
Out-of-scope: no ADR status or amendment; no security posture (ADR-009/020/021); no SKP/MCP wire or data-plane message; no stated guarantee/invariant (ADR-018/006/004, CRS-is-a-type) changed or tested -- a read-only governance script scanning tracked docs, mirroring scripts/plan/verify-cites.mjs and scripts/plan/verify-test-claims.mjs's own conventions.
```

## §0. Disclosure

Read before drafting: `AUTONOMY.md` §21b, §21c, §21d, §6a (this piece's own authority and the
pre-gate-self-checks framework it extends); `scripts/plan/verify-cites.mjs` (cite regex, tracked-file
index via `git ls-files`, two-tier rooted/loose classification, CLI/exit conventions — reused
directly by import, not re-derived); `scripts/plan/verify-test-claims.mjs` and its `.test.mjs` (the
`claimFiles` default file set — `*PREREGISTRATION*.md` and `docs/adr/*.md` — reused by import; the
node-test-runner-with-tmpdir-git-fixture shape); `frontends/shell/e2e/citationIntegrity.test.mjs`
(the sibling, narrower, shell-scoped fabricated-quote check — read for convention, not reused code;
this piece is deliberately the general, whole-tree half, exactly as `verify-cites.mjs`'s own top
comment frames its relationship to that file for `path:line` cites).

Two real misquotes, fetched from `cut/briefa-p3b` at commit `caa987e`'s own HEAD via `git show
cut/briefa-p3b:engine/ADMISSION-PREREGISTRATION.md`, both re-verified by reading the file directly:

1. Amendment 7 (iii) (`:1425`) quotes Amendment 6 (iii) as ending *"...the single end-to-end run T10
   is the first half of."* — Amendment 6 (iii) (`:1377`) actually ends *"...the single end-to-end run
   over a real mutated fixture, which is (ii)'s owed T10."* Different sentence; not a substring match.
2. Amendment 6 (iii) (`:1375`) quotes §12b's G-A2 (`:221`, both on `cut/briefa-p3b` and on this tree's
   own `main`) as ending *"...picks refused; late batches dropped."* — `:221` actually ends
   *"...picks refused; status text verbatim."* Different ending; not a substring match.

A true example, from this tree's own `main`: `engine/LOD-PREREGISTRATION.md` §10 Amendments 1 and 2
quote `DECISIONS-PENDING.md` rulings under a `verbatim:` introducer, in bold rather than a blockquote;
this tool must PASS both. (No fixture disk-drive confound: this piece makes no measurement.)

## §1–§9

Not applicable at this size — the five-line form (`AUTONOMY.md` §21d) stands in place of the full
preregistration shape for a single-gate docs/tests/polish piece under the §21c threshold.

## §10. Amendments — opens empty, append-only

**Amendment 1 — class 6, budget deviation, Scope not edited (`AUTONOMY.md` §21b's mid-piece clause; `docs/PREREGISTRATION-TEMPLATE.md:123-129`). Written 2026-09-17, after the code was written, before it is committed.** Declared figure: ≤150 non-generated lines (code + tests, this preregistration excluded, §21c). Final figure, `git diff --cached --stat` at commit time: **385 insertions, 0 deletions** across `scripts/plan/verify-quotes.mjs` (259) and `scripts/plan/verify-quotes.test.mjs` (126). Reason: the deliverable is a multi-shape extractor (straight/curly quotes and `> ` blockquote runs, each with its own ~200-char trigger-proximity check), a whole-tracked-tree substring search with per-file normalization caching and citing-line self-exclusion, a path-introduced-quote lookup reusing `verify-cites.mjs`'s resolver, the advisory cite-content listing, a CLI, and six required test cases each with its own performed-and-reverted mutation (`AUTONOMY.md` §14) — comparable in shape to its siblings (`verify-cites.mjs`: 359 lines; `verify-test-claims.mjs` + its test file: 252 + 185 lines). The `Scope` line's file list and the `Out-of-scope` line are **not edited** to match. Per §21b's clause the single-gate route closes: this piece needs the architect gate as well as the reviewer before it may land, but it **keeps its five-line form** as the clause directs.

**Amendment 2 — class 1, post-result. Written 2026-09-17, after running the check per the dispatch's item 5 (against this tree's `main` and against `cut/briefa-p3b`'s `engine/ADMISSION-PREREGISTRATION.md` and `engine/LOD-PREREGISTRATION.md`, fetched and read via `git show` into scratch copies).**

- **The two known misquotes are both reported FAIL**, run against the `cut/briefa-p3b` scratch copy of `engine/ADMISSION-PREREGISTRATION.md`: `:1375` (Amendment 6 (iii)'s G-A2 quote, actually ending "status text verbatim" in `:221`, not "late batches dropped") and `:1425` (Amendment 7 (iii)'s quote of Amendment 6 (iii), actually reading "...the single end-to-end run over a real mutated fixture, which is (ii)'s owed T10." in `:1377`, not "...T10 is the first half of."). Two further FAILs were found in the same file, not pre-named by the dispatch: `:1393` (Amendment 7 (i)'s own quote of Amendment 6 (ii), which elides an internal clause with `…` inside a claimed reproduction — a real, if minor, attribution imprecision) and `:1417` (a "verbatim" run-6 log line whose actual source, `frontends/shell/e2e/out/*.json`, is `.gitignore`d and therefore can never occur "somewhere in the tracked tree" — a structural, disclosed limitation, not a misquote).
- **The LOD rulings PASS**, both against this tree's own `main` and against the `cut/briefa-p3b` scratch copy: `engine/LOD-PREREGISTRATION.md` §10 Amendments 1 and 2 (the `DECISIONS-PENDING.md` quotes) are among the checked passages and are not in either run's failure list.
- **False-positive rate on the current tree exceeds the ~5% guidance**, and per the dispatch's own instruction the check is **not loosened to hide it** — reported here instead: `node scripts/plan/verify-quotes.mjs` against `main` (no arguments, the default `*PREREGISTRATION*.md` + `docs/adr/*.md` set) finds 63 checked passages, 24 FAIL, 3 advisory (38% FAIL). Sampling roughly a third of the 24 by hand (not all 24 — time-bounded), every one traced to a **disclosed structural gap, not a corpus misquote**, in three shapes: (a) a quote attributed to a Rust/TS doc comment whose source wraps the passage across multiple `///`/`//` continuation lines — `normalizeText` strips only `> ` blockquote prefixes (the spec's own three named normalizations), so the continuation markers survive into the haystack and break the substring match (e.g. `engine/LOD-PREREGISTRATION.md:114`'s `engine/src/dataset.rs:516-519` cite: the real text sits, unchanged, at `:605-608` today, `///`-wrapped); (b) a quote whose source in `DECISIONS-PENDING.md` crosses a markdown `**bold**` marker boundary the citing document's blockquote does not reproduce (`engine/ADMISSION-PREREGISTRATION.md:713`'s "the ruling, verbatim" blockquote concatenates two originally separate bolded bullets into one continuous span) — the spec's three normalizations do not strip `**`/`*`, unlike the sibling `citationIntegrity.test.mjs`, which discloses stripping it as one of exactly three; (c) an ADR (`ADR-017`, `ADR-020`) whose entire body is blockquoted as a **stylistic** convention (every paragraph prefixed `> `, separated by blank non-`>` lines), so the ~200-char trigger window can pick up an unrelated trigger word from an adjacent paragraph's own prose (about a different topic entirely) and misclassify that neighbour's own original text as "a verbatim quote requiring tree-wide verification." (a) and (b) are gaps in what `normalizeText` strips, exactly bounded by the spec's literal three-item list (whitespace, `> `, curly quotes/dashes) — extending it is a design change past this piece's authority, not a bug fix, and is flagged rather than made here per the dispatch's Blockers clause. (c) is the heuristic-cannot-distinguish case the same clause names directly. **Not touched by this amendment**: the implementation, `TRIGGERS`, `normalizeText`, and the blockquote regex are exactly as designed and tested above; no threshold was loosened to lower the reported count.
