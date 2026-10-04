*Custodian's filing note (2026-10-04): guardian-v0's worker report 4, README item R11 under node:guardian-v0@g5, from a fresh brief. Written by the worker to this path and committed as written below the rule. Its sha256, from this file's line 5 to the end, is 1c18c0103b8716446e813a746efaea3e8c90c13985045d69c3a299b0b0db522b, equal to the hand-back. Its commit is 7fa2a67e. The custodian recounted §7 at 7fa2a67e: 1700 lines over 10 files against the merge base a30108a1. The class 8 record is the form's Amendment 6, appended by the custodian at 1d057c79. Worker cost: 25,787 subagent tokens, 8 tool uses, 69,023 ms.*

---

# guardian-v0 worker report 4 — README R11

Commit: 7fa2a67e3a36bd024f4e97676294e143b8e65a3f on cut/guardian-v0 (pushed, signed off). Parent 5f8f2306. Only tools/mods/spatial-guardian/README.md changed (+2 lines: the R11 paragraph and a blank line), placed after "The shell route" paragraph, which is where the README describes G6's shell handling.

README diff (byte-copied from `git diff`):

```
@@ -41,6 +41,8 @@ N1's percentage is the compaction-window percentage from the local summary break
 
 The shell route is PowerShell, and Guardian registers G1 and G6 on it. [...unchanged line...]
 
+R11. G6's refusal of a report-only subagent's shell call is a backstop, not the guard those agents rely on. Their definitions (architect, lead-data and evidence-reader) grant no shell tool, and those tool lists are the guard, with the write audit as the primary check of their runs. G6 covers the PowerShell tool today. It does not cover the Bash tool. If any report-only definition gains Bash or PowerShell, G6 must cover that tool before the definition change merges; for Bash that means a G6 change, declared by its own amendment or piece, landing first.
+
 ## Install (the human's alone)
```

Runs (from the worktree, at 7fa2a67e): node scripts/plan/verify-cites.mjs exit 0; node scripts/plan/verify-quotes.mjs exit 0.

Section 7 count, by the Size item's command, base a30108a1 (merge base with origin/main), head 7fa2a67e:
2 0 .github/workflows/governance-ci.yml
347 0 scripts/hooks/guardian-continuity-parity.test.mjs
14 0 tools/mods/.claude-plugin/marketplace.json
7 0 tools/mods/spatial-guardian/.claude-plugin/plugin.json
1 0 tools/mods/spatial-guardian/.gitignore
82 0 tools/mods/spatial-guardian/README.md
62 0 tools/mods/spatial-guardian/hooks/continuity.mjs
3 0 tools/mods/spatial-guardian/hooks/hooks.json
464 0 tools/mods/spatial-guardian/hooks/register.js
718 0 tools/mods/spatial-guardian/test/guardian.test.ts
Total 1700 changed lines over 10 files, against the bound of 1650: an overrun of 50 (class 8; the section 7 line is not edited). Noted, not acted on. README R11 contributes 2 of the 1700 (Amendment 5 estimated 4).

Pre-gate self-check: no cross-module code; the claim of "G6 covers PowerShell, not Bash" matches the form's Amendment 5 section 1 and the README's existing G6 row; no user-facing message changed; no test required. Model observed: Sonnet 5.5, no override, no handoff. git status --porcelain: empty.
