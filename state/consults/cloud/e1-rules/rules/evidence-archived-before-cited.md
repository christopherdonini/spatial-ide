---
id: evidence-archived-before-cited
status: active
applies_to: [custodian, tester, tester-high]
when: [test-run]
paths: []
source: ["governance/AUTONOMY.md:65 @ 6b67d44 sha256:7fa675d1ef4530d999e3d11db08d772062cb17847ed09da8235025cfac37c879", "governance/AUTONOMY.md:207 @ 6b67d44 sha256:13bf547ba5e565c0194daf0c5530915fbda2d4e4e3a9592de16737b6113ed7e7", "Appendix A, item 12"]
supersedes: []
superseded_by: []
assumes: ["file-exists: scripts/evidence/archive.mjs"]
enforced_by: [none]
---

# evidence-archived-before-cited

*Paraphrase, not the human's words: the binding text is at the source.*

Each campaign's evidence (frontends/shell/e2e/out/ and any declared directory) is compressed by scripts/evidence/archive.mjs with a SHA-256 manifest and attached to the release or tag; RESULTS.md cites the asset URL and the archive's hash. A log pointer into an untracked directory does not verify until archived.

Attaching to an already-published release changes that page: its first application, v0.1.0's evidence, is the human's click.
