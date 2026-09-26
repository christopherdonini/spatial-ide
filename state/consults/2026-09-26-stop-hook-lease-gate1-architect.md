*Custodian's filing note (2026-09-26): gate 1, architect, for the Stop-hook lease piece (branch `governance/stop-hook-lease` at `7f3a013`, local, not yet pushed), transcribed from the hand-back message with the harness's two-space indent removed. Everything below the rule is the architect's text.*

---

**Gate 1, architect: "the Stop hook honours the custodian lease"**
Head reviewed: the working tree of `C:/dev/wt/stop-hook-lease`, stated as `7f3a013` on base `e5235ec`. I have no Bash, so the reviewer should confirm the tree is clean at `7f3a013`, recompute the numstat and run the mutations.

**Verdict: block.** The block comes from Evidence only. Correctness passes.

## Correctness: PASS (with notes)
1. **Out-of-scope line (check 1).**
   - The diff touches no ADR, no security posture (ADR-020/009/021), and no wire or MCP surface.
   - `AI_DEVELOPMENT.md` is not in the diff, so "The lease and handover" is textually unchanged. The hook only reads the lease.
   - Note: §21a's guarantee bullet ends with "any property currently under test". Read literally, it catches this change, because the existing block-path tests now need a held lease as a new precondition. The human's own item (4) calls the change "light lane", and that designation is what places it outside §21a. The Out-of-scope line depends on that designation. No block, since full gating is running anyway.
2. **Ruling fidelity (check 2).**
   - `leaseHeldBy` plus step 3 of `decide()` allow the stop exactly when the session does not hold the lease: relinquished, absent, another session's lease. That matches item (4) of `state/directives/2026-09-26-corpus-positions-and-stop-hook.md` §2.
   - Missing `session_id` and a malformed first line also allow. Both are sub-cases of "holds none" (no held lease can be shown), and the Change line discloses the missing-id case. Within the ruling.
3. **The seam against the real shape.**
   - The regex `^lease:\s*(\S+)\s+refreshed:` matches `AI_DEVELOPMENT.md`'s lease example and the live `C:/dev/spatial-ide/CUSTODIAN-LEASE`. That file carries the full Claude Code session UUID, which equals the stdin `session_id` (Appendix B contract).
   - Note: the lease rule itself asks only for "a unique session id". The hook now needs that id to be Claude Code's `session_id`, and if it is not, the hook fails open and continuation is silently disabled. §24 does state the equality. I recommend a later one-line pointer in the lease subsection, but that belongs to the human's governing text and does not block this piece.
4. **Decision order (check 3).**
   - Lease after HALT: §18 is preserved in full. The HALT stderr line and Telegram notice still fire for every session.
   - Lease before the ready set: consistent with §3.
   - Side effect: sessions without the lease no longer send §3 step 4's human-blocked Telegram notice. This follows from allowing earlier, but neither §24 nor the README says so (see Documentation).
5. `leaseHeldBy` is unexported and its only caller is the product path `decide()`. It adds no `pub` item and no new dependency.
6. Minor: `input.session_id ?? 'unknown-session'` in step 6 is now unreachable, because a missing id allows at step 3. It is harmless; the reviewer can decide whether to leave it.

## Evidence: FAIL (medium; scope `scripts/hooks/hooks.test.mjs` and the form's Tests+mutation line; disposition: one bounded class-4 amendment)
1. **The recorded mutation for `stop-queue: allows when this session's lease is relinquished` cannot fail that test.**
   - The comment names the mutation as `match[1] !== sessionId` inverted to `===`.
   - A `relinquished:` line never matches the `^lease:` regex, so `leaseHeldBy` returns at the `if (!match)` branch before the id comparison runs. The mutated line is never reached, the test still gets `allow`, and the mutation survives.
   - It is also the same mutation recorded for the third test.
   - The form's Tests+mutation line promises a different mutation ("a `relinquished:` line read as held"), and nothing in the tree carries it out.
   - This is a discharge with no resolvable proof (round 7).
   - Fix: mutate the `!match` branch to return `{ held: true }`, run it, and record the observed failure by name in a class-4 amendment (template §10, item 4), with the test comment corrected under the test-text exception (round 14).
2. **Item (4) orders "Dry-run both cases".**
   - The form claims a CLI dry run on a two-node plan (relinquished and no-lease each allow with empty stdout; the holder blocks). No output of that run is in the diff.
   - The only CLI test, `stop-queue CLI: piping stdin JSON…`, covers the holder case alone.
   - The custodian must file the dry run's output as evidence, in the ledger per §3's dry-run rule, before landing. If it cannot be produced, re-run it.
3. The mutations for the other two new tests (absent file read as held; id comparison flipped) do kill their tests on reading. The reviewer should confirm by running them.

## Documentation: FAIL (low; scope: the form's Amendment 1, `scripts/hooks/README.md`; disposition: fold into the same bounded round as the Evidence fix, one row per defect)
1. **Amendment 1 (check 4): mostly correct.**
   - Class 6 is the right class: on the Scope line's own basis, 160 > 150.
   - The amendment records the declared figure, the final figure and the reason.
   - Its consequence (both gates, short form kept) matches §21b's size-overrun clause (round 5, item 2) and template class 6.
   - Its disclosure that it was written after results is honest.
2. **Amendment 1 defect.** It calls its figure "under §21c's rule", but it excludes only the form.
   - §21c's counting rule (round 5, item 2) also excludes the obliged governing-doc sentence (the §24 addition).
   - It counts only "non-generated code and tests", and the README is neither.
   - The figure is therefore on the Scope line's basis, not §21c's. It is possible that under §21c the count is at or below 150, in which case no overrun happened. Taking full gating anyway is never a defect, so the conclusion stands either way; only the label is wrong.
   - The reviewer should recompute under §21c and the row should cite that recount by reference.
   - Scope-line unedited: I cannot check its history without git. The reviewer should confirm with `git log -p` on the form.
3. **README defects.**
   - The Decision-order lead-in ("AUTONOMY.md §3, with §18's HALT switch as step 2") does not name §24 as step 3, though the code header does.
   - The Tests section does not list the lease cases.
   - Neither the README nor §24 mentions that sessions without the lease skip the step-4 Telegram notice.
4. **Renumbering (check 3): no stale cites.** A search of the branch and main found no record citing README or stop-hook step numbers. §3 was not edited in place (it still has six steps), and appending §24 at the end follows the governing-doc insertion mechanic.
5. **Quotes (check 2).** The one quoted span, ("Tooling fix, light lane") in the form's Authority line, matches the directive's item (4) byte for byte. §24 and the README add no quotations. The directive file is tracked on main (6e743ed), so there is no untracked-Authority cite. It is absent from this branch, and the cite is path-only, so verify-cites is not affected.
6. **Measurement revision.** Amendment 1's numstat at `a513190` is a branch commit used as a measurement revision, not a sha256 hash reference, so round 15(e) does not apply. It stays reachable only if the PR is merged with a merge commit, which is the repo's practice.

## Red lines (check 5)
None. The change is ruled by the human in item (4). The lease rules, `.claude/settings.json`, ADRs and `docs/01` are untouched, and `AUTONOMY.md` gains only the appended obliged section.

**Files:** `C:/dev/wt/stop-hook-lease/scripts/hooks/stop-queue.mjs`, `C:/dev/wt/stop-hook-lease/scripts/hooks/hooks.test.mjs`, `C:/dev/wt/stop-hook-lease/scripts/hooks/STOP-HOOK-LEASE-PREREGISTRATION.md`, `C:/dev/wt/stop-hook-lease/scripts/hooks/README.md`, `C:/dev/wt/stop-hook-lease/AUTONOMY.md` (§24), `C:/dev/spatial-ide/state/directives/2026-09-26-corpus-positions-and-stop-hook.md`.
