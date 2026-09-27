*Custodian's filing note (2026-09-27): gate 4, attempt 4 (reviewer), full gating, a scoped confirmation of the two lines changed after gate 3, for PLAN node `geometry-types-beyond-polygons`. Reviewed: docs/adr-034-geometry-admission @ cca6d1483328449872a939f05bbd2c9b4fd197c1 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: docs/adr-034-geometry-admission @ cca6d14 (cca6d1483328449872a939f05bbd2c9b4fd197c1). PASS.

This is attempt 4, a scoped confirmation. Its verdict supersedes the attempt-3 verdict (b84f180, FAIL on B1). The branch head equals origin, the worktree is clean, and the ADR file ends in a newline. `git diff b84f180 cca6d14` changes two lines of the ADR file and nothing else. docs/README.md is untouched, and so is the Status line.

## Findings

- **B1 (attempt 3): resolved.**
  - The Timing bullet now reads: "The Status line reads the 2026-09-27 session order as setting acceptance earlier than decision 8's recommended timing. The human confirms or corrects that reading."
  - The backwards conditional is gone, and so is the quoted span labelled paraphrase (my attempt-3 N2 and the architect's T1).
  - The bullet now agrees with the Status line, which says "the reading is listed for the human below".
- **N1 (attempt 3): resolved.**
  - The text now reads "on grounds including that nothing publishable is lost today".
  - The wording no longer presents one of item 5's three grounds as its only one.
  - The paraphrase of items 3 and 5 stays marked "(paraphrase)".
- **Nothing new introduced.**
  - Neither line adds a quotation, a line cite or a tree claim, or binds MP-1.
  - My attempt-3 N3 (`geoparquet.rs:778` is a test literal) stays open, as optional.

## Re-verified at cca6d14

- **Verbatim passages:** both are byte-identical to their sources, checked by script. The ruling passage is 441 bytes against round 17, item 7; the decision-4 passage is 95 bytes against the assessment's line 206.
- **Pin:** `state/consults/2026-09-24-multipolygon-assessment.md:206` recomputes to ddae06db5d61fa8f420f73843d5e900805bbb9eb26341f5a53effa571cdc4be3.

## Suites at cca6d14

Tool behaviour is as of cca6d14.

| Suite | Exit | Result |
|---|---|---|
| `npm run verify:adr-index` | 0 | "adrIndex: PASS -- 33 ADRs, index in docs/README.md matches every Status line" |
| `verify-cites.mjs` | 0 | 855 files, 32 advisory |
| `verify-quotes.mjs` | 0 | 110 checked / 79 verified / 30 baselined / 1 advisory / 0 errors / 0 hash-reference errors |
| `verify-test-claims.mjs` | 0 | 343 claims across 90 files |
| `verify.mjs --offline` | 0 | PASS |
| `node --test` over scripts/plan and scripts/hooks | 0 | 349 pass, 0 fail |
| `npx vitest run src/docs/adrIndex.test.ts` | 0 | 26 passed |

`git status --porcelain` was empty after all runs.

## Still open, outside the ADR

The architect's gate-2 note stands: the unknown-flag write in `frontends/shell/scripts/adrIndex.mjs` is not recorded in PLAN or in the ledger. It is the custodian's to record and is not an ADR defect.

Files:
- C:/dev/wt/adr-034/docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md
- C:/dev/wt/adr-034/docs/README.md
