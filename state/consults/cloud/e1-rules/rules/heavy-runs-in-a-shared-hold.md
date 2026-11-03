---
id: heavy-runs-in-a-shared-hold
status: active
applies_to: [reviewer, worker, worker-high, tester, tester-high]
when: [build, gate-reviewer, test-run]
paths: []
source: ["governance/AUTONOMY.md:615 @ 6b67d44 sha256:e1c2f819bacb80014f1d89c61ee3630b0ede5546ddfbfc1a594fb2a1e1145377", "state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 6b67d44 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# heavy-runs-in-a-shared-hold

*Paraphrase, not the human's words: the binding text is at the source.*

A heavy command (more than two cores for more than about three minutes, or any timed measurement) runs inside a shared hold, in one Bash call of the shape the brief carries as written. CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. Exit codes 96 to 99 are the script's: report them and never run the command another way. A timing-sensitive failure in a shared run goes to the custodian.

Never: the script's run, book or cancel actions, -TargetPid, an exclusive hold, a change to its folder, another project's log lines.
