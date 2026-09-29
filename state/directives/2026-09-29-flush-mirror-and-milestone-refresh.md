# Directive — the stale continuity block rewritten from git and the ledger; the round mirror resumed from round 31; the block refreshed at each milestone; two weekly-window mechanism proposals (the human, verbatim)

*Custodian's filing note (2026-09-29): the human's message, received while the custodian was working after the compaction. It is recorded verbatim below the rule. Cited as "the 2026-09-29 flush directive". The facts in its item 1 checked out: `.claude/state/precompact-<session>.json` for this session records `lastBlockedAt: 2026-09-29T17:06:08.986Z`, and the printed block's `flushed_at` was 2026-09-28T21:27:52Z. On item 2: the staged filings had already been committed and pushed as f570d8f, unchanged, before this message arrived.*

---

Before anything else:
1. The SESSION-CONTINUITY block printed at resume is STALE (flushed_at 2026-09-28T21:27Z, before all of
   today's work). Don't act on it. The pre-compaction hook blocked at 17:06Z, but for an auto-compaction
   that block isn't shown to the model, so no flush happened.
2. Commit the staged A2-1 gate-1 filings (both reports and the ledger entry) as they are.
3. Rewrite the block from git and the ledger, not from the compaction summary: `git log edbd939..HEAD`
   plus the ledger's entries since then. It must cover:
   - today's commits and PRs (#142 merged, B-1's full-form preregistration at 4b2c1d0, PR #143 at 303dca0);
   - A2-1: gate 1 FAIL from both agents, correction round 1 next;
   - the old A2-1 branch and PR's disposition;
   - what B-1 waits on;
   - the weekly-window items.
   Then commit, push, and check porcelain is clean.
4. The question-round mirror (AUTONOMY Appendix A3) has lapsed since round 30 (2026-09-27). Resume it
   from round 31: write state/questions/round-<n>.md and run questions-mirror.mjs BEFORE every question
   round. Don't backfill the missed rounds; record the lapse once in the ledger.
5. From now on, refresh the block at each milestone (PR opened, gate filed, directive filed), not only
   at handoff.
6. For the 2026-10-02 weekly window, as the human's decision, draft two mechanism proposals:
   (a) the round mirror as a PreToolUse hook on AskUserQuestion, sending the tool's own questions and
       options, so it no longer depends on memory. Verify the tool_input shape against the hooks
       reference first.
   (b) staleness the model can actually see: the Stop hook, whose block reason the model does receive,
       refuses to stop while the block is older than the newest ledger commit. Keep the PreCompact
       block as a backstop.
Then continue with A2-1's correction round 1.
