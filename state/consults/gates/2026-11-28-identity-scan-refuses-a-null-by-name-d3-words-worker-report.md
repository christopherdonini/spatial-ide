# The identity scan refuses a null by name: the D3 comment's words, the worker's report at 73f95dd8 (node:identity-scan-refuses-a-null-by-name@d3-words)

*Filed by the custodian. The worker (Sonnet) worked in D:/wt/nullname from 6e5a0b834ca37a2bb9ad20073fe20511b760558e, applied the reviewer's D3 words (`state/consults/gates/2026-11-28-identity-scan-refuses-a-null-by-name-build-gate-reviewer.md`) to one comment line and pushed 73f95dd82070c6f50ecf4c3831e0b4a02b49de37. By the facts script its records run from 2026-11-28T01:30:54Z to 2026-11-28T01:31:16Z, and 1 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 22694 ms and 8 tool uses. Its hand-back is below as received, with the harness indent removed: 700 bytes, sha256 47c19a333abec332655b35049c176655e0efcfccbfa7ab35223862b6d92e595d.*

---

Pushed head 73f95dd82070c6f50ecf4c3831e0b4a02b49de37; every step completed.
- Preconditions held: head was 6e5a0b83 and the tree was clean. The old text count was 1, at line 2128 of engine/src/dataset.rs. The new line is 93 columns.
- Commit: 73f95dd82070c6f50ecf4c3831e0b4a02b49de37, "docs: the identity scan's comment names count(*) and count(c) as the two counts the nulls part".
- `cargo fmt --all -- --check` exited 0. `git diff --numstat` showed `1	1	engine/src/dataset.rs`.
- `rev-parse HEAD` and `origin/cut/identity-scan-refuses-a-null-by-name` are both 73f95dd8.
- Departures: none. I ran no build, test or clippy, and I did not change the PR.
- Model: Sonnet 5.5, no override, no handoff.
