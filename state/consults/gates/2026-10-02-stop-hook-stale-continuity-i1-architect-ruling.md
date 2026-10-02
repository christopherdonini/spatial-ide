*Custodian's filing note (2026-10-02): the architect's ruling on how to resolve invalidator I1 for PLAN node `stop-hook-stale-continuity`, which fired before the worker's first code commit (worker report 1, `state/consults/2026-10-02-stop-hook-stale-continuity-worker-report-1.md`). This is the form's drafting architect, resumed on the custodian's message. Reviewed: cut/stop-hook-stale-continuity @ f778f61 plus the uncommitted worktree, form at ca0abb5 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's.*

*The ruling is a separate test-only node on main, merged before E: T11 of `scripts/hooks/questions-mirror.test.mjs` copies every top-level `.mjs` file of `scripts/hooks/` and `scripts/plan/` instead of a fixed list. The custodian appends it as the proposed node `questions-mirror-t11-copy-glob` and asks its placement in the next question round; its order is the human's.*

*Profile paths redacted at filing: none.*

---

RULING: route the copy-list fix to its own node on main, merged before E (cut/stop-hook-stale-continuity @ f778f61 + uncommitted worktree; form at ca0abb5)

Your reading is right, with one correction and one change to the fix's shape. Only I1 has fired: I5 needs the sixth file on E's branch, and the edit was never committed.

**What is wrong and why**
- **The test.** Line 307 of `scripts/hooks/questions-mirror.test.mjs` hand-codes a fixed six-file copy list, which is `stop-queue.mjs`'s import set at the time #154 merged. It was correct then. Any import change to `stop-queue.mjs` breaks it, so #154 left it fragile and E only exposes it. That does not change the route: as with #157's I4, the cause sits outside E's scope. It does change the fix: remove the fragility instead of adding one more token.
- **My drafting miss.** The form's §0 named #154's export and README edits but not that T11 copies this list. That is how I1 got through.
- **Why not class 9.** Class 9 covers work a standing rule of the human adds to a piece (`docs/PREREGISTRATION-TEMPLATE.md:170`). This work comes from E's own invalidator I1. No class covers scope added after an invalidator, and §10 forbids inventing one (`docs/PREREGISTRATION-TEMPLATE.md:96-99`).
- **Why not (b) or (c).** (b) bends shipped code to a stale test. (c) breaks the seam that §1 names.

**The route**
1. **A new node, `proposed`, five-line form, reviewer only.**
   - Scope: `scripts/hooks/questions-mirror.test.mjs` only, 1 file, at most 10 changed lines.
   - Out-of-scope: none of the four §21a categories is touched, so round 25, item 2 (e) is satisfied.
   - Change: T11 copies every `*.mjs` file at the top level of `scripts/hooks/` and `scripts/plan/` (not recursive, so no fixtures) instead of the fixed list. T11's name, its assertions and its recorded M11 are unchanged.
   - Mutation: drop `scripts/plan/` from the copy. T11 must fail at `assertQuiet` (exit 1), because `stop-queue.mjs` imports `plan.mjs`. Record the commit it was observed at.
   - Seam proof from the real shape: run the changed T11 against main's `stop-queue.mjs`, then against E's. Both must be green. For that, E's worker commits the implementation as it stands now, with no sixth file, and does not push or open a PR. The fix node's record names that commit by id.
   - The `order` is the human's (`AUTONOMY.md:67`): ask by option label, with I1's firing as context. It is not a red line.
2. **E after the fix merges.**
   - E merges main and the full suite goes green. Its `<base>` in §7 is then the new merge base on main, so `questions-mirror.test.mjs` never enters E's diff. I5 never fires.
3. **E's record: one appended amendment, class 1, references only.**
   - Its first line says it was written after the results.
   - References: §5 I1 fired; the failing test `the_settings_command_mirrors_a_recorded_askuserquestion_payload`, pinned as `scripts/hooks/questions-mirror.test.mjs:307 @ 629d969 sha256:<custodian>` (629d969 is on main); the fix node's id and PR; the suite count at E's merged head.
   - The node's generation bumps (`AUTONOMY.md:230`).

**§7 line count: confirmed, with conditions**
- An overrun is class 8, with §7 not edited. Its first line reads `budget overrun, §7 not edited`. It records 650 declared, the final figure by §7's own counting command at the head the gates review (named by id), and the reason (17 RECORDED MUTATION comments and fixture repos).
- It opens no gate route, since full gating already applies.
- Record it only once the final count exceeds 650; nothing goes in now.
- Do not trim tests or mutation comments to fit.

**The two untested not-judged causes: leave them, record nothing now**
- §1 claims fail open only for git failure (claim 5, T9). The other two causes are declared behaviour in §2 item 2(b) and §7, not claims.
- No class adds tests before a gate without a finding (class 4 needs a gate finding).
- I will raise it at gate 1. The class 4 route would then add:
  - T18 `stop-queue: a ledger commit whose block has no flushed_at is not judged`;
  - its mutation M18: a `null` `F_c` read as stale.
- The `unreadable at <%H>` cause would need a corrupted object store to construct. It stays reasoned, and the closing record names it by reference, with no test.
