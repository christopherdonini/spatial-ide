*Custodian's filing note (2026-09-26): the reviewer gate's attempt-2 report (a scoped record round) for PLAN node `bundle-viewer-partition-offset-bounds` at 64ceb79, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

## Reviewer gate, attempt 2 (scoped record round) at `64ceb79`: PASS

My attempt-1 findings R1–R3 are withdrawn by Amendment 3's superseded index. No code changed, so I did not re-run the suites.

### Mechanical confirmations
- **The diff.** `git diff 874c72f..64ceb79 -- renderer/ KNOWN-LIMITATIONS.md` touches only the preregistration: 8 insertions, 0 deletions. The first 269 lines at `64ceb79` are byte-identical to the file at `874c72f`, so Amendment 3 is a pure append.
- **The merge `9a15439`.** Its combined diff (`git diff-tree --cc`) lists only CUSTODIAN-QUEUE.json/.md, PLAN.yaml and the three site/ files. Its other changes against its first parent are main's own state/ commits coming in through the merge.
- **Amendment 3 against the architect's block.** It is byte-identical to the "The smallest fix" block in `state/consults/2026-09-26-partition-offset-bounds-gate1-architect.md` at `522493a`, once the placeholders are filled. The brief says two placeholders, but there are five tokens: H1, the path, the line range, the rev and H2. All five were filled correctly.

### The hashes
Both revs, `e562e9b` and `522493a`, are on main.

| Reference | Recomputed | Match | What the span covers |
|---|---|---|---|
| `scripts/plan/verify-mutation.mjs:17-25 @ e562e9b` | fc4d55b2995a3c1e23598eeac22010ae5c3e82a5d8d57c09387a0437658b39ea | yes | The tool's own description of its heuristic, including its disclosure that it does not run the mutation. The file is unchanged between `e562e9b` and `7d24ed1`. |
| `state/consults/2026-09-26-partition-offset-bounds-gate1-reviewer.md:49-65 @ 522493a` | 29663cd49c53b17d30514a278fabf9dfa5295544cc6ea44335a23f097af83ff8 | yes | Line 49 is the heading "## 4. M0–M10, my run at `874c72f`", and line 65 is the M10 row. The span is my full M0–M10 section. |

**Item 3's range.** `git diff --numstat e562e9b...c855b77` gives the row-6 figures:
- `partition.ts`: 85+4 = 89
- the two scripts: 588 + 8 = 596
- `KNOWN-LIMITATIONS.md`: 12+0 = 12
- 4 in-Scope files besides the preregistration

### R1–R3 against the superseded index
- **R1 is withdrawn.** Amendment 1's `DECISIONS-PENDING.md:40` pin and item 1's two parentheticals are superseded. The reference is now "RULED 2026-09-26, question round 25, item 4".
- **R2 is withdrawn.** Row 3's parenthetical, which held the tool claim, is superseded. The tool's text is now pinned at `e562e9b` with its hash, and my run is the observation of record.
- **R3 is withdrawn.** Row 3's parenthetical and last sentence, and row 7's clause before its reference, are superseded.

Amendment 3 meets the correction-form rules:
- Each item is one sentence, under the three-sentence ceiling of round 12 (d).
- None restates an earlier amendment's claim.
- It carries a superseded index, per round 12 (e).
- Its new hash references are each on one line, at main commits, per round 15 (d) and (e).
- It contains no timing figure.

### Checks at `64ceb79`
| Check | rc | Result |
|---|---|---|
| `verify-cites.mjs` | 0 | PASS. No advisory names the preregistration. |
| `verify-quotes.mjs` | 0 | PASS, 0 hash-reference errors |
| `verify-test-claims.mjs` | 0 | PASS |
| `verify.mjs --offline` | 0 | PASS |
| `queue.mjs --check` | 0 | current |
| `site.mjs --check` | 0 | current |
| `verify-mutation.mjs --base origin/main --head HEAD` | 0 | PASS, 11/11 |
| CR bytes | — | 0, in every file changed against main and every file changed since `874c72f`, in both the working tree and the `64ceb79` blobs |

The worktree was left clean at `64ceb79`.

### Remaining suggestion and nit
- **S1 stands as a suggestion.** Row 3 still cites the worker's summary (worker report line 20), which says B3 catches M8. My run shows G3 catches it. Since my run is now the observation of record, this does not block.
- **Nit.** The superseded index names the withdrawn text as "Amendment 1's `DECISIONS-PENDING.md:40` pin". My reading is that this identifies what is withdrawn and is not a new cite into the ledger, so it does not block.

### Gate-log note
Reviewer gate attempt 2 (record round) at `64ceb79`: PASS. Amendment 3 is appended byte-exact from the architect's fix block, both of its hashes recompute and cover their spans, item 3's range reproduces row 6, the superseded index withdraws R1–R3, and every governance check returns 0 with no CR bytes. S1 remains a suggestion.
