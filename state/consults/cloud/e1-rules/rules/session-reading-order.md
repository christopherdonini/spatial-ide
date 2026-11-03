---
id: session-reading-order
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:7-13 @ 6b67d44 sha256:ac620c7f769597bdb3e9e694d10a6936db81eec2a455b9113f914207ff46b5d2", "governance/AUTONOMY.md:486-488 @ 6b67d44 sha256:eeb72ce2f6e3ed09c343d069d86ad63da0ada4310d3fab477dfd6cd1fdaa3e2e", "governance/AUTONOMY.md:600 @ 6b67d44 sha256:7ed6ed0de3f2ac4eaedf131fd0a8d75ff7c268fa7c70da042131e9d8bb29d436", "governance/AUTONOMY.md:666 @ 6b67d44 sha256:3770fa9c353518534dc84d199158114ce8a5265356d5abd9e60f95b8d4e89d0c"]
supersedes: []
superseded_by: []
assumes: ["file-exists: scripts/hooks/session-resume.mjs"]
enforced_by: [scripts/hooks/session-resume.mjs]
---

# session-reading-order

*Paraphrase, not the human's words: the binding text is at the source.*

After a compaction or at a new session, read in this order: (1) state/CUT-STATE.md, its continuity block first, then the live ledger and any unfinished matter it names; (2) the queue; (3) DECISIONS-PENDING.md's open entries and recent rulings, older rulings searched by date, round or entry and never read whole; (4) state/directives/, newest first; (5) PRECEDENTS.md, before any question; (6) AUTONOMY.md for mechanics, AI_DEVELOPMENT.md for the role and the red lines.

The list the hook prints is READING_ORDER in scripts/hooks/session-resume.mjs; the hook prints it, the reading is the custodian's.
