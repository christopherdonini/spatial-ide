---
id: generation-tag-discards-stale-results
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:230 @ 6b67d44 sha256:38b8afa56144fa6be4a33e5506303860d7a116fd6d7c1aada04e412d669064eb", "Appendix A, item 15"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# generation-tag-discards-stale-results

*Paraphrase, not the human's words: the binding text is at the source.*

Every worker brief carries the node's generation as node:<id>@g<n>. A result whose tag no longer matches the node's current generation is discarded: ledgered as stale, never merged. The generation bumps on any preregistration amendment or scope change.
