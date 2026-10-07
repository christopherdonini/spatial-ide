# Directive — question round 68: when a waiting PR needs main merged into it (the human, verbatim)

*Custodian's filing note (2026-10-07): question round 68 was asked by AskUserQuestion at 20:24:19Z and mirrored by the round-mirror hook as `state/questions/round-68.md`. The human answered in typed words at 20:27:41Z by the transcript. Below the rule is the answer, byte-copied by script from the tool result's structured answer, with one final newline and nothing else (line 6). It names no other project. It refines item 4 of the 2026-10-07 awaiting-merge direction, and gets a RULED block in `DECISIONS-PENDING.md`.*

---
(a), with one addition. Re-merge main into a waiting PR when another PR merges,when main changes a file the waiting PR touches, or when main changes anythingCI runs or builds (workflows, governance scripts, tools, dependency files).Record commits outside those cases need no re-merge. After my click, checkmain's CI on the merge commit and tell me only if it is red.
