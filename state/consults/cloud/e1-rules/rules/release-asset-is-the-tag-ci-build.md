---
id: release-asset-is-the-tag-ci-build
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:203 @ 6b67d44 sha256:1c790fe08989cf26d361a2be0cd8de67a28efa148cbf5e6a3dffa00ca068bec9", "Appendix A, item 11"]
supersedes: []
superseded_by: []
assumes: ["file-exists: .github/workflows/release-artifacts.yml", "file-exists: governance/RELEASE-DAY-CHECKLIST.md"]
enforced_by: [none]
---

# release-asset-is-the-tag-ci-build

*Paraphrase, not the human's words: the binding text is at the source.*

From v0.1.1 the release asset is the tagged commit's CI build: downloaded from the release-artifacts run on the tag, hashed, and the hash recorded in RELEASE-<version>.md. The dev machine is for headed work only.
