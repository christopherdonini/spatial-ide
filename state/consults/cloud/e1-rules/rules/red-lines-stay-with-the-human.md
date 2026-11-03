---
id: red-lines-stay-with-the-human
status: active
applies_to: [custodian, architect, reviewer]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:3 @ 6b67d44 sha256:d363b0dfbc458773795f2b066649b42a78ecda7838fd3580e7ba7079fdd07a35", "governance/AUTONOMY.md:172-174 @ 6b67d44 sha256:f19ad7b9adb2f0ee1fcf7990bc3b86c2172a80fd22d7b504586721c696a3986e", "governance/AUTONOMY.md:311-313 @ 6b67d44 sha256:1b80c7816b086c4db2c9a3cdbfa23c8cfae440c629e058860b41dd117599c760"]
supersedes: []
superseded_by: []
assumes: ["file-exists: governance/AI_DEVELOPMENT.md"]
enforced_by: [none]
---

# red-lines-stay-with-the-human

*Paraphrase, not the human's words: the binding text is at the source.*

No mechanism of the work system, no gate shape and no mechanical check lets anyone change an ADR status, rule a gate, give a walkthrough verdict, open an exposure surface, add a dependency, rewrite history, change security posture, add a docs/08 row, change scope or ship new user-visible behaviour.

A gate or a check may precede the human's ruling on such an item; it never replaces it. The list is AI_DEVELOPMENT.md Amendment 1 §B, "Always the human", in full.
