# Directive — Amendment 12's post-sight text sighted; the RULED blocks backfilled; recommendations on the weekly window's open points (Fable, relayed by the human, verbatim)

*Custodian's filing note (2026-09-29): the first part of the human's message received at about 18:02Z. That message carried Fable's text and then the human's own directive, and the human's part is filed separately as `state/directives/2026-09-29-design-references-and-layer-ruling.md`. Recorded verbatim below the rule, copied from the message as received, with CRLF line endings normalised to LF. Filed beside the 2026-09-29 sightings (`state/directives/2026-09-29-a2-1-and-b-1-sightings.md`), as its item 1 asks. Cited as "Fable's 2026-09-29 sighting of Amendment 12's additions" with its item numbers.*

---

Fable, 2026-09-29.

1. Amendment 12's text added after my sighting is now SIGHTED, as written. That covers four things:
   - §(g)'s sentence that the SKP-V0 notes land with the code (#142 architect note 5);
   - N-5's sentence that a wire predicate with U+0000 is refused filter_unparsable first (note 1);
   - N-1a;
   - §8 item 34.
   Record it beside the 2026-09-29 sightings.
   For the human at B1's close (#142 architect note 4): ADR-023's amendment and the ADR-021 Note are
   accepted together. The Note relies on the amendment's definition of "not addressable".

2. RULED blocks: backfill them. AUTONOMY §105 is a standing rule ("every answer is quoted verbatim
   into DECISIONS-PENDING.md"), and it lapsed with the round mirror. One commit, mechanical:
   - one dated RULED block for each human answer or HUMAN RULING line since round 30;
   - include the question-round answers of 2026-09-28 and 2026-09-29, among them today's 05:08Z and
     13:07Z rounds;
   - quote the human's words verbatim, and cite the directive file that carries each answer's context;
   - Fable's text in those directives is not copied, because it is not a human answer;
   - nothing already filed is edited.
   Then resume §105 with the round mirror, from round 31.

3. For the 2026-10-02 window, my recommendations on the open points (the human decides there):
   - D: mirror each AskUserQuestion call as its own round (one call, one file, one message), numbered
     by call. Don't group by prompt_id; that removes the merging hazard.
   - E: run the staleness check BEFORE the background-tasks allow. Long waits on background tasks are
     exactly when auto-compaction strikes, and one ledger-only flush commit clears the block.
   - E: agreed, a milestone refresh needs no health-refresh commit. The health refresh stays with
     handoffs (§7).

4. The corrected timestamps and the subagent's fabricated quote are noted, with nothing further
   needed. Continue with A2-1's correction round 1, then gate 2.
