---
id: flush-before-anything-is-lost
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:186 @ 6b67d44 sha256:aa29b5518c8aa2f9ff61a143a25aac2574cb437dcdfe7151976748cc10cf0216", "governance/AUTONOMY.md:413 @ 6b67d44 sha256:7d3fe24aee9b26ca32f7dca2494d9bb25cd4ed217eb0ebb14be8208756db6074"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [scripts/hooks/precompact-flush.mjs]
---

# flush-before-anything-is-lost

*Paraphrase, not the human's words: the binding text is at the source.*

Nothing may exist only in the session across a compaction. The custodian flushes at every report, before ending any window, whenever remaining context is under 10%, and on any PreCompact block reason: it writes state/CUT-STATE.md's SESSION-CONTINUITY block (position, tip hash, half-made judgments, hypotheses, intended sequencing, unreported findings, in-flight gate states), commits, verifies porcelain and pushes. After a compaction it resumes by session-reading-order.

The hook is a backstop for a manual /compact only; the obligation holds if it fails.
