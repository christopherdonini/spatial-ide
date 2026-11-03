---
id: session-start-rotations
status: active
applies_to: [custodian]
when: [always]
paths: []
source: ["governance/AUTONOMY.md:598 @ 6b67d44 sha256:d78a3c2651f209fc076446bc39510719903c0ad3f823a16db6ca2ae5094e8d34", "governance/AUTONOMY.md:664 @ 6b67d44 sha256:e1446e71300522f88777cb4b2e0c49a3d22268ac9109cdd25842311e3c8d1ced", "governance/AUTONOMY.md:682-683 @ 6b67d44 sha256:2f202297b43dcc2fe04d8e55e64191bd6646529b946c772bf8b622a87f0fbf6b"]
supersedes: []
superseded_by: []
assumes: ["file-exists: scripts/plan/rotate-cut-state.mjs", "file-exists: scripts/plan/rotate-decisions-pending.mjs", "file-exists: scripts/plan/rotate-plan-summaries.mjs"]
enforced_by: [none]
---

# session-start-rotations

*Paraphrase, not the human's words: the binding text is at the source.*

At session start, after the lease and with main level with origin, the custodian runs in order rotate-cut-state.mjs, rotate-decisions-pending.mjs --dry-run and rotate-plan-summaries.mjs --dry-run, and carries out each rotation that is due by its procedure. No hook runs them; an archive is never edited; the human is told when open entries alone are over the cap or an owed summary has no live home.

Procedure: scripts/plan/README.md, heading "session-start-rotations" (to be added).
