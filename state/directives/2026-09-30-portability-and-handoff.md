# Directive — Windows-first development with protected portability, and the handoff (the human's direction line and Fable's handoff instructions, verbatim)

*Custodian's filing note (2026-09-30): the human's message received at about 06:40Z on 2026-09-30 UTC, sent as pasted text. Its first line is the human's direction. The rest is Fable's instructions for the filing and the handoff. Recorded verbatim below the rule, as received.*

*The plan it names is filed byte-identical beside it as `state/directives/PORTABILITY-2026-09-30.md`. Its sha256, 20663b05c35bf87f959631b8ec11ba1b63f69e7922c00224492848d1702d7c61, was checked equal at the source and on the copy.*

*Item 1's "with the human's line above" is read as filing the plan together with this file, which carries the human's line. The plan's own bytes are left unchanged so that its hash stays checkable.*

*The direction line sets a standing constraint and answers no question round, so it is filed here and gets no RULED block (§105; the 2026-09-29 holds check).*

*Cited as "the 2026-09-30 portability direction and handoff", with its item numbers.*

---

HUMAN DIRECTION 2026-09-30: Windows-first development with continuously protected portability is a
standing constraint: one codebase for Windows, macOS and Linux, with shared semantics, explicit
platform implementations, continuously tested portability and honestly scoped support. Fable's
PORTABILITY-2026-09-30.md is the plan. Placement guidance: port-1 after B-1; port-3 and port-4 wait
for the shell migration's first merged milestone; port-2 when convenient, not ahead of the migration
or B2.

Fable, 2026-09-30: file this, then hand over. Start nothing new.

1. File the portability plan.
   - Copy PORTABILITY-2026-09-30.md from the human's Spatial IDE folder to state/directives/, with the
     human's line above (sha256 20663b05c35bf87f959631b8ec11ba1b63f69e7922c00224492848d1702d7c61;
     a mismatch means stop).
   - From now on, apply rules R1–R6 (§2) to new and materially changed work. They block new coupling
     and false guarantees only. Declared limitations are not findings, and no accepted work reopens.
   - Add PLAN nodes as proposed: port-1-linux-l1, port-2-macos-l1-and-app-dirs (carrying 1c-1, and
     1c-2 as a candidate to verify), port-3-shell-l1 and port-4-l2-smoke. Record the placement
     guidance beside them.
   - They stay proposed until the human answers §7, because port-1 needs the runner-minutes decision.
   - §4 binds B2's preregistration when B2 starts. §5 goes into Fable's migration plan.

2. Question round 31, next session, on 2026-10-02: one round carrying the weekly window's A–F plus
   PORTABILITY §7's five decisions. Mirror it to Telegram before asking, and add a RULED block for
   each answer.

3. CI: record the pending runs by ID.
   - Rust workspace: 36678435198 at 8959f51, and 36678705038 at a023546.
   - Shell: 36678705352 at a023546. Also record the finished status of shell run 36678435390 at
     8959f51.
   If any of them finish during the handoff, record their results. The rest are the next session's
   FIRST check. Don't rely on the background watch.

4. Before flushing, confirm that:
   - no worker, subagent or cloud session is running;
   - every human message is filed under state/directives/, this one included;
   - every human answer has its RULED block;
   - every worktree and branch is listed with its disposition.

5. The flush: rewrite the continuity block after the last commit and push. porcelain must be clean
   apart from .codex-remote-attachments/ and target/. The block must carry:
   - B-1 done, and the ready set empty;
   - CI: the state of each run, or its run ID;
   - waiting on the human: ADR-034's acceptance, O-07, round 31 (window A–F plus portability §7), and
     at B1's close, ADR-023's amendment and the ADR-021 Note of 2026-09-29, accepted together;
   - waiting on Fable: the migration plan, after O-07, now carrying PORTABILITY §5;
   - still proposed: port-1 to port-4, type-walk-null-literal-arithmetic, and the earlier proposed
     nodes;
   - B2 held, and bound by PORTABILITY §4 when it starts;
   - the cloud credit: $201, expiring 2026-11-04 23:59 PT, with no wave 3 authorised.

6. Relinquish the lease, then tell the human it's safe to clear.
