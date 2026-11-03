---
id: claude-code-facts-from-installed-docs
status: active
applies_to: [custodian, architect, reviewer, worker, worker-high]
when: [draft, build, gate-architect, gate-reviewer]
paths: [".claude/settings.json", "scripts/hooks/**"]
source: ["governance/AUTONOMY.md:5 @ 6b67d44 sha256:461352c2bc330f0c417ddf0a822c9593e337368ef5ac22de7d0e244ad0cfabe3", "governance/AUTONOMY.md:455 @ 6b67d44 sha256:04c666011541563d4ae1dfaa8e0185742a9e04136c6f0780d776ea99064f5ee4", "Appendix A, preamble"]
supersedes: []
superseded_by: []
assumes: ["file-exists: .claude/settings.json"]
enforced_by: [none]
---

# claude-code-facts-from-installed-docs

*Paraphrase, not the human's words: the binding text is at the source.*

Every Claude Code fact a hook or setting relies on (an event, a field, a matcher, an exit code, a setting) is verified against the installed version's own documentation, with that version named. Nothing is built from memory, and a behaviour the documentation does not state is not relied on.
