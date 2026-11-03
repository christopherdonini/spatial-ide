---
id: one-batched-question-set
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:101-102 @ 6b67d44 sha256:1b991a5536239fb5f39a7c2d80cef9472a51e4c2cc20114eaf588e938bf5d894", "governance/AUTONOMY.md:107 @ 6b67d44 sha256:78febc2af3356bd3c55092c160ad33f046db34f8b46cc43ffb07e7a8b37689b4", "governance/AUTONOMY.md:507-508 @ 6b67d44 sha256:35e3cb7f9dfdb2badc91bd029256e5f6579e7fa28a6209f7a0427fa4ac570fb8", "Appendix A, item 4"]
supersedes: []
superseded_by: []
assumes: []
enforced_by: [none]
---

# one-batched-question-set

*Paraphrase, not the human's words: the binding text is at the source.*

Every unblocked node is run to exhaustion first; then one question set batches every pending ruling. Each question carries the recommendation as its first option marked "(Recommended)", the alternatives, "hold", and the phone-readable digest in the question text, or in a state/drafts/ file the text names, never only in a file.

At most four questions per AskUserQuestion call; each call is its own round, numbered "question set n of m". A filler piece's question is asked when it arises (filler-slot-conduct).
