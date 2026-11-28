# The identity scan refuses a null by name: the architect gate's D1 words applied at 6e5a0b83, the worker's report

*Filed by the custodian. One commit on cut/identity-scan-refuses-a-null-by-name in D:/wt/nullname, from f6614e15043056e058c18c422aa5282f18b0c8c0 to 6e5a0b834ca37a2bb9ad20073fe20511b760558e: the two pairs of D1 in `state/consults/gates/2026-11-27-identity-scan-refuses-a-null-by-name-build-gate-architect.md`, in engine/src/error.rs. A sonnet worker (worker) made it, with no build, app or suite run but cargo fmt's check. By the facts script its records run from 2026-11-28T00:05:07Z to 2026-11-28T00:05:34Z; by its completion notice it took 26971 ms and 10 tool uses. The custodian checked by git that the commit's only parent is f6614e15 and that its diff is the two pairs, 2 insertions and 2 deletions in that one file. Its hand-back is below as received, with the harness indent removed: 864 bytes, sha256 511ac5ec7b1770192cd91f5bab65313c8d7449222d297a42bfc450b5d064ea82. Its account is the worker's.*

---

6e5a0b834ca37a2bb9ad20073fe20511b760558e is the pushed head. Every step completed.
- Before the edit, head was f6614e15043056e058c18c422aa5282f18b0c8c0, the tree was clean, and the branch was cut/identity-scan-refuses-a-null-by-name.
- Counts before the edit: pair 1 old text = 1, pair 2 old text = 1.
- Commit 6e5a0b834ca37a2bb9ad20073fe20511b760558e, "docs: the LodRefused doc points below to IdentityUnusable and names ADR-016's identity refusals".
- `cargo fmt --all -- --check` exited 0. Numstat: `2	2	engine/src/error.rs`.
- Push succeeded. HEAD and origin/cut/identity-scan-refuses-a-null-by-name both read 6e5a0b834ca37a2bb9ad20073fe20511b760558e. Tree clean after the commit.
- Departure: the Edit tool required a Read first, so I read lines 139-141 of engine/src/error.rs before editing. No other departure.
- Model: Sonnet 5.5, no override, no handoff.
