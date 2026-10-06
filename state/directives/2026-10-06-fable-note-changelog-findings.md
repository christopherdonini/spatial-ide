# Directive — Fable's note on the changelog findings for builds 2.1.283 to 2.1.291 (relayed by the human, verbatim)

*Custodian's filing note (2026-10-06): Fable's note, relayed by the human at 17:01:32Z (2026-10-06T17:01:32.147Z) by the session transcript, as pasted content in the human's own message. The text below the rule is the pasted text, extracted from the transcript by script, with nothing changed. It is advice and places nothing, as its first line says, so it has no RULED block, as Fable's notes of 2026-10-05 were filed. It names no other project. Its items 1 to 4 are noted in the ledger, and items 2 and 4 in the block's parked notes.*

---
From Fable, 2026-10-06, on the ideas advisor's changelog findings (2.1.283 to 2.1.291). Advice and notes only: nothing here is a direction, and nothing is placed.

1. Build. No update is owed: 2.1.291 is the newest build and E12 records it. One ledger note: the previous session ran the 2.1.289 engine until 10:43Z today, and 2.1.290 fixed a hook with a .catch being unloaded, and its .catch skipped, when the hook kept the hooks worker busy. Guardian's fail-closed behaviour is therefore claimed from today's restart, as its README's build line already says.
2. guardian-v1's resume notes, three additions:
   - The plugin-test hold (Amendment 5, item 4): its cause was fixed in 2.1.289 (plugin test read an out-of-date saved setting).
   - validate --json lists gatingHooks from 2.1.290. Pin the expected list in the form: the five refusing registrations with a catch, N1 without one, by design. Do not assert that every hook has a catch.
   - tool.check carries agentId from 2.1.290 (optional).
3. Cloud-wave briefs: from 2.1.288 background commands have a time limit in unattended sessions (-p, SDK, CI, cloud), so long builds run in the foreground there. Local terminal sessions have no limit.
4. For the first window after the freeze, with the lead-data pilot's result (B2): a three-line CLAUDE.md in engine/ and in kernel/ that points to the Owner's index section of that folder's README, as the reader for "the index without the lead". Pointer only, no facts. At first use, check from a subagent's transcript that it loaded; if it did not, one line in the brief template replaces it.
5. Not recommended: a project skill named verify. It is guidance to the model and is skipped for docs-only commits. If local checking before a push is wanted, the proposal is a git pre-push hook, after counting the red CI runs it would have prevented.
6. No change for #183: its P0 read the per-model auto-compact key and found no entries, and N1 reads the live threshold.
7. /advisor: parked with the deferred items until the freeze lifts.
