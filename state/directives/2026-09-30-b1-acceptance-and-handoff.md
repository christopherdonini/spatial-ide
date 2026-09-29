# Directive — B-1's typed texts accepted; file, then hand over (the human's ruling line and Fable's handoff instructions, verbatim)

*Custodian's filing note (2026-09-30): the human's message received at about 22:13Z on 2026-09-29 UTC (2026-09-30 by the human's date), sent as pasted text. Its first line is the human's ruling. The rest is Fable's instructions for the filing and the handoff. Recorded verbatim below the rule, as received. The file it names is filed byte-identical beside it as `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` (sha256 76e139be7a2515abae1b28c11b80a18f58f451d13e93dafd41ccbf427c23f079, checked equal before and after the copy). The ruling line has a RULED block in `DECISIONS-PENDING.md` (§105). Cited as "the 2026-09-30 B-1 acceptance and handoff" with its item numbers.*

---

HUMAN RULING 2026-09-30: I accept Part 2 of B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md, as written:
T-A (the ADR-021 Note), T-B (the twelfth code) and T-C (the five reason strings and the Display),
with <date> filled as 2026-09-30.

Fable, 2026-09-30: file, then hand over. Start nothing new.

1. File B-1's rulings and texts. Copy B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md from the human's
   Spatial IDE folder to state/directives/ (sha256
   76e139be7a2515abae1b28c11b80a18f58f451d13e93dafd41ccbf427c23f079; a mismatch means stop). Add a
   RULED block for the acceptance line above (§105).
   Then append §10 Amendment 1 to engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md: Part 1's rulings
   and their effects on §2.5(c), §2.6, C20 and §7. Record only; no code.
   T-A's docs PR is the next session's first B-1 step. If the acceptance line is absent, B-1 waits on
   it; say so in the block.

2. Old branches: keep cut/b1-close-nul-names and cloud/wave2-A2. Filed records cite their commits, and
   that supersedes the formatting ruling's "until #143 merges". Keep each one until no tracked record
   cites it. Note this in the ledger.

3. CI: wait for the Rust workspace runs at 468a0ae and 57cb447 if they finish during the handoff, and
   record the results. If they haven't finished, record their run IDs as the next session's FIRST
   check. The background watcher dies with this session, so don't rely on it.

4. Before flushing, confirm that nothing is left:
   - no worker, subagent or cloud session is running;
   - every question round since round 31 is mirrored, and every human answer has its RULED block;
   - every message the human sent today is filed under state/directives/, this one included;
   - worktrees and branches are listed with their dispositions.

5. The flush: rewrite the continuity block after the last commit, then push. porcelain must be clean
   apart from .codex-remote-attachments/ and target/. The block must carry:
   - CI: the state of each run, or its run ID;
   - B-1: accepted or waiting on the acceptance; next is T-A's docs PR, then code under full gating;
   - waiting on the human: ADR-034's acceptance, O-07, the 2026-10-02 window decisions (A to F), and at
     B1's close, ADR-023's amendment and the ADR-021 Note of 2026-09-29, accepted together;
   - waiting on Fable: the migration plan, after O-07;
   - the cloud credit: $201, expiring 2026-11-04 23:59 PT, with no wave 3 authorised;
   - the proposed nodes, still proposed.

6. Relinquish the lease, then tell the human it's safe to clear.
