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
