---
id: start-piece-disjoint-paths
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:606-609 @ 6b67d44 sha256:1b5b9b11a33ca113e5181f6b6e4561f907661db40214efb5e441fa224f72153b", "state/directives/2026-10-07-awaiting-merge-leaves-the-slot.md:9 @ 6b67d44 sha256:ddc539551c1fc8fc4fac62103ccaaecc9c6c130c113a245ff4f5c3dfb2521e91"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# start-piece-disjoint-paths

*Paraphrase, not the human's words: the binding text is at the source.*

Before starting any piece, list every piece in progress and every PR awaiting merge, and check that their paths are disjoint and that at most one of them touches protocol/, wire fixtures, Cargo.lock or package-lock.json.
