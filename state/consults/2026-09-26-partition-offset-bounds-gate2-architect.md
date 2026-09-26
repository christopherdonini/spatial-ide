*Custodian's filing note (2026-09-26): the architect gate's attempt-2 report (a scoped record round) for PLAN node `bundle-viewer-partition-offset-bounds` at 64ceb79, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

## Architect gate, attempt 2 (scoped record round, the piece's record round 1): `bundle-viewer-partition-offset-bounds` at `64ceb79`

**Verdict: PASS with notes**

**Scope.** I read Amendment 3 at `C:\dev\wt\viewer-offset-bounds\renderer\bundle-viewer\PARTITION-OFFSET-BOUNDS-PREREGISTRATION.md:271-277`. I also read the reviewer's attempt-1 report at `C:\dev\spatial-ide\state\consults\2026-09-26-partition-offset-bounds-gate1-reviewer.md`, which is filed on main. I took the coordinator's statements that `9a15439` touches only generated files and PLAN, and that `64ceb79` is a pure append. I did not verify either myself.

### Resolution of attempt 1's findings
- **F1 (ledger line pin): resolved.**
  - `:273` withdraws Amendment 1's `DECISIONS-PENDING.md:40` pin.
  - It names the reference form round 12 (a) and round 14 (a′) require: "RULED 2026-09-26, question round 25, item 4".
  - That reference resolves against the RULED 2026-09-26 round 25 block, item 4.
- **F2 (unmarked reproduction): resolved.** `:273` withdraws both parentheticals, and the item landed at `c855b77` becomes the reference.
- **F3 (tool claim with no commit; a reference that did not resolve): resolved.**
  - `:274` pins the tool at `scripts/plan/verify-mutation.mjs:17-25 @ e562e9b`. On main that span runs from the rule's description (`:17-20`) to the disclosure "it does NOT run the mutation, so it cannot" / "confirm the test actually FAILS under it — only that a mutation is recorded by name." (`:24-25`). It covers both halves of row 3's claim.
  - The observation of record is now `state/consults/2026-09-26-partition-offset-bounds-gate1-reviewer.md:49-65 @ 522493a`. That span is exactly "## 4. M0–M10, my run at `874c72f`" through the M10 row (`:49`–`:65`).
  - `partition.ts` is unchanged from `874c72f` to `64ceb79`, so that run observes the code under gate.
- **F4 (figures against a moving base): resolved.** `:275` names `e562e9b...c855b77`. The coordinator's numstat and the reviewer's `:87` both give 89 / 596 / 12.
- **F5 (row 7 prose): resolved.** It is superseded at `:277`. The same line also supersedes row 3's parenthetical, which the reviewer flagged as R3.
- **F6 (row 8 had no class): resolved.** `:275` makes row 8 class 1.

### Form checks on Amendment 3
- **Round 12 (d):** each correction is one sentence and restates no earlier amendment's claim.
- **Round 12 (e):** the superseded index is present at `:277`.
- **Round 14:** there is no bare self-line, and no pin sits at a commit that `64ceb79` creates.
- **Round 15 (d):** every pin is contiguous on one line.
- **Round 15 (e):** both pins, `e562e9b` and `522493a`, are at commits on main.
- **Round 15 (g):** the withdrawals are class 1 and the pointers class 3, as the heading declares.
- **Record cap:** the rows are references only.

### Hashes for the reviewer to recompute
- `fc4d55b2995a3c1e23598eeac22010ae5c3e82a5d8d57c09387a0437658b39ea` over `verify-mutation.mjs:17-25 @ e562e9b`.
- `29663cd49c53b17d30514a278fabf9dfa5295544cc6ea44335a23f097af83ff8` over `gate1-reviewer.md:49-65 @ 522493a`.

### Notes (none blocking)
- **N1.** Row 3 still cites `worker-report.md:20`, which says M8 is caught "by a *different* clause (B3's loop/start-check …)". The reviewer's run (`gate1-reviewer.md:63`) and the test's own record show that G3 catches it. The worker report is cited as evidence for what it reported, and the record now names the reviewer's run as the observation of record, so no correction is owed. Keep this note in the gate-log so nobody later reads line 20 as the record.
- **N2.** The reviewer's attempt-1 suggestions S4 and N1–N3 are for a later piece, if any. S4 is the unsourced "neither is true of a real kernel-written partition" comment; N1–N3 are the test-file doc nits. A record correction here would be class 3 by the test-text exception, and the record cap argues against spending a round on it.
- **N3.** The KNOWN-LIMITATIONS wording proposal ("The specific limit is fixed for …", and the scope line in the comment) goes to the human at the PR, together with the reviewer's `gate1-reviewer.md:133` point that "sandboxed as any website is" can be read as reassurance. `[[KL-N]]` and `[[PR]]` are filled at merge.

### Gate-log line
bundle-viewer-partition-offset-bounds, architect gate attempt 2 (scoped record round, the piece's record round 1) at 64ceb79: PASS with notes. Amendment 3 resolves F1–F6 of attempt 1 with three one-sentence corrections and a superseded index, and its forms satisfy rounds 12 (d)–(e), 14 and 15 (d), (e) and (g). The verify-mutation.mjs pin at e562e9b (hash fc4d55b2…) and the reviewer-report pin at 522493a (hash 29663cd4…) are for the reviewer to recompute. Notes: row 3's worker-summary cite misattributes M8 but is evidence, not the record; the test-comment nits are deferred; the KNOWN-LIMITATIONS wording proposal goes to the human at the PR. No code changed.
