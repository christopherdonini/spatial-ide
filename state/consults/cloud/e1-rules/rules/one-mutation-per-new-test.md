---
id: one-mutation-per-new-test
status: active
applies_to: [architect, reviewer, worker, worker-high, tester, tester-high]
when: [build, gate-architect, gate-reviewer, test-run]
paths: []
source: ["governance/AUTONOMY.md:164-166 @ 6b67d44 sha256:1beaf93f6c063a3190919987e2abbd4f00df8cae23657983f697664ed16d7f71", "governance/AUTONOMY.md:215 @ 6b67d44 sha256:5fc1d41f0bad9f276ad4b4c845d4d5ddcdf9af27c467ade5ae83e626387cd2c1", "governance/AUTONOMY.md:222-226 @ 6b67d44 sha256:9e5b07a35967639ff448e0b07a43a2e5de59f2191e9daa4b5a65cc5838b1848b", "Appendix A, item 14"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# one-mutation-per-new-test

*Paraphrase, not the human's words: the binding text is at the source.*

Every new test carries one mutation that makes it fail by name, recorded with the piece.

Enforcement: none in CI at 6b67d44. The source says verify-test-claims.mjs automates the rule; that script holds no mutation check, and scripts/plan/verify-mutation.mjs (it looks for a recorded mutation by name and runs none) is wired into no workflow. See the REPORT, stale facts.
