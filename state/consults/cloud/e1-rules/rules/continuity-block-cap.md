---
id: continuity-block-cap
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:574-576 @ 6b67d44 sha256:01f3e5270d3d15f4bba7335cd86bf8286b517fc08f1bdd4064c29fb78280569a", "governance/AUTONOMY.md:597 @ 6b67d44 sha256:f9e1cd9af8f9bc0c442a13a2dc9041befaa6c84a6067ab5741dbe709a9dcabdb"]
supersedes: []
superseded_by: []
assumes: ["file-exists: scripts/hooks/flush.mjs"]
enforced_by: [scripts/hooks/flush.mjs, scripts/hooks/flush.test.mjs]
---

# continuity-block-cap

*Paraphrase, not the human's words: the binding text is at the source.*

A SESSION-CONTINUITY block written through scripts/hooks/flush.mjs is at most 6,144 UTF-8 bytes. Over the cap flush.mjs refuses: the file stays byte-identical, the refusal names the largest field and every field's size, and the refused block is saved whole to a scratch file outside the repository. Nothing is truncated automatically; the custodian shortens or keeps. A hand edit is not bound by the cap.
