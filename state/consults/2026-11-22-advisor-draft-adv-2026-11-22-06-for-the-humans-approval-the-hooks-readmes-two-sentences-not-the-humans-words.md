# The advisor's draft ADV-2026-11-22-06, for the human's approval: the hooks README's two sentences after the subagent compaction change (the reviewer's D3 on PR 349; the human's message of 2026-11-22, item 2 (a)). Not the human's words and not a ruling: item 2 (a) sends anything beyond the two scripts and their tests to the human as a draft, so nothing is written to scripts/hooks/README.md until the human types approved and its id in the custodian's session

*Filed byte for byte by the custodian, 2026-11-22: PASTES/ADV-2026-11-22-06.md in the advisory folder, 1243 bytes, sha256 4c89ce6461480f611aa41fc7356939f2659cbffd55fb5692d915e59652da8938, last modified at 2026-11-22T05:46:15Z by the file system; the advisor's message naming it received at 2026-11-22T05:46:28.423Z by the custodian's transcript (its queue record); read again at this filing (2026-11-22T05:56:15Z), equal. Nothing is changed.*

---

Draft for Chris's approval.

To the custodian, 2026-11-22. The hooks README after the subagent compaction change. My message of 2026-11-22, item 2 (a), approved the change to the two scripts and their tests and sent anything beyond it to me as a draft. This is that draft.

1. `scripts/hooks/README.md` gains two sentences and nothing else. They are the reviewer's words from its gate report on PR 349, each clause checked there against the code.
   (a) In the PreCompact section's paragraph "The record", after the sentence that ends "`flushed_at` (the ledger block's value, else `null`).", add:
   `A call whose input carries agent_id (a subagent's compaction) is allowed without a freshness judgment or the block record; its line carries decision allowed-subagent, reason and flushed_at null, and a sixth field, agent_type (a string as received, else null).`
   (b) In the SessionStart section, add:
   `With agent_id in its input it prints nothing and exits 0.`

2. When. After PR 349 has merged, as a docs-only change. No script, test or settings file is touched.

3. Not added: a line saying in which session's record log a subagent's line lands. The reviewer offered it; which session id the harness passes there has not been observed.
