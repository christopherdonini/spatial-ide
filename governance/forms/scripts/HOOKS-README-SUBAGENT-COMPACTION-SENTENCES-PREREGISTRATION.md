# scripts/hooks/README.md: the two sentences on a subagent's compaction, as the human approved them — five-line short form (`AUTONOMY.md` §21d)

Committed before any change, per the short-form discipline; append-only once committed. The PLAN node hooks-readme-subagent-compaction-sentences, for the advisor's draft ADV-2026-11-22-06 (`state/consults/2026-11-22-advisor-draft-adv-2026-11-22-06-for-the-humans-approval-the-hooks-readmes-two-sentences-not-the-humans-words.md`), which the human approved by their typed message of 2026-11-22 (`state/directives/2026-11-22-the-humans-approvals-adv-2026-11-22-02-03-06-the-guardian-and-monitor-the-trial-pins-the-hooks-readme-sentences.md`), so its two sentences are the human's words under the grant of 2026-11-13, item 4. Its class is the five-line form and the reviewer alone (ADV-2026-11-16-06, the v0.2 week's rule), with the standard worker. It changes no file the app is built from, no script, no test, no workflow and no settings file, so it may merge before the tag (the human's message of 2026-11-22, item 0).

```
Authority: PLAN node hooks-readme-subagent-compaction-sentences; the advisor's draft ADV-2026-11-22-06, the human's words by their typed approval of 2026-11-22 under the grant of 2026-11-13 item 4; it follows PR 349 (merged), whose reviewer gave the two sentences; reuse index: no prior art recorded for hooks README or for subagent compaction (tools/reuse.mjs in the read-only reuse clone at 89bbac3, exit 1 each, run by the custodian on 2026-11-22), a miss noted here.
Scope: 1 file: scripts/hooks/README.md; declared line budget <= 8 changed lines in the merged diff (insertions plus deletions), this form excluded. Block on sight: any change to a script, a test, a settings file, a workflow, any other README or any other line of this one, and any word of the two sentences other than the draft's.
Change: the draft's item 1 (a), byte for byte, inserted in the PreCompact section's paragraph that opens with The record, directly after the sentence that ends with flushed_at's description (the ledger block's value, else null), on a line of its own, the paragraph's line holding that sentence split there with nothing else changed; and the draft's item 1 (b), byte for byte, as a paragraph of its own at the end of the SessionStart section, after its paragraph on the resume facts. Each sentence on one line, unwrapped. Nothing is added from the draft's item 3.
Tests+mutation: none, docs only. The checks are verify-cites, verify-quotes, verify-test-claims and verify:plan green, the governance CI green, and the single reviewer's check of each sentence byte for byte against the draft's item 1 and of each clause against precompact-flush.mjs and session-resume.mjs on main.
Out-of-scope: ADR none; security none -- no hook, script, test, settings or permission change, and the hooks behave as merged in PR 349; wire none; guarantee none -- the README describes the merged behaviour and the single reviewer gate applies (section 21b).
```

**Placement** (the custodian's, since the draft's item 1 (b) names the section and not the line). The second sentence goes last in the SessionStart section, so that no existing paragraph is split.

**Gating.** The reviewer alone (§21b), reading the Out-of-scope line first. The worker reports the diff's count; a count over 8 lines, a file outside the one, or any word other than the draft's stops the piece and comes to the custodian.

### Amendment 1 — 2026-11-22 — the gate closed, for the merge check

1. **The gate.** The reviewer alone, attempt 1, at 17b0cf48bde716f611b78fe5d35b43d53b71e734: PASS, no finding (`state/consults/gates/2026-11-22-hooks-readme-subagent-compaction-sentences-gate-reviewer.md`, sha256 fca7c612307b98d798cb7157e4f0975accf064be1d088b426c8b10fc7b66c510; gate-log row 825). The build: the worker's report (`state/consults/2026-11-22-hooks-readme-subagent-compaction-sentences-build-worker-report.md`, sha256 026d7b4b164a4b5a208a3ba7d6353a481191a11421426d7e25e45caa084a915f).

2. **The count.** `git diff --numstat 90bdeab7...17b0cf48`: 5 and 1 in scripts/hooks/README.md alone, 6 changed lines, within the Scope line's 8.

3. **The notes.** The reviewer's notes, all outside this piece's Scope, stand as filed. None blocks.

4. **CI at 17b0cf48**, read at 2026-11-22T12:27:10Z: six runs, all success: DCO sign-off 45020352718, Exposure scan 45020352773, Governance CI — plan, queue, site 45020268553, Governance CI — plan, queue, site 45020352748, Ported notices 45020268578, Ported notices 45020352751.

Read the last amendment first.

Nothing above is edited.
