Question round 41 — 2026-10-03 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 4 items, asked in one call. RED LINE items: 1. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. RED LINE (next to the ADR-017 exposure review): kernel/README.md still says publish has "Nothing is exposed". In fact two product callers reach publish through the permission boundary: the publish-bundle binary and the shell's binding_publish_* commands, shipped since v0.1.0. lead-data's edit C8 names those two callers and approves nothing. To apply it, type "Take C8", or your own wording, in Other. The preset options only hold it.
  (1) Hold C8 for now — The README keeps its stale bullet. C8 stays an OPEN entry, and module-docs-stale-statements waits on it.
  (2) Hold to the 10-09 window — The same, and it comes back at the weekly window with the other governance items.

---

2. KNOWN-LIMITATIONS item 30 (exit drain: what a close or quit can leave behind) merged with #163 and was corrected by #165. Both PR descriptions showed its text for your sight. The gates won't count a merge click as sight (node 8's form, §8 item 14). Is its wording sighted?
  (1) Sighted, keep it (Recommended) — Recorded as your sight under §8 item 14, and the OPEN entry closes.
  (2) Change the wording — Type the changes in Other. A follow-up applies them, and they come back to you for sight.

---

3. lead-data has Write but may write only its own report file. The architect found that the C3 status check detects stray writes but cannot stop them. It also misses writes outside the two checked trees, re-edits of files already dirty, new files inside untracked directories, and ignored paths. How should lead-data's writes be guarded?
  (1) Stronger check (Recommended) — Keep Write. Before and after each run: status with all untracked and ignored files, content hashes of dirty files, a snapshot of git refs, and a tool-use audit from the transcript (what I did for dispatch 2).
  (2) Remove Write — lead-data returns its report as a message, as the architect does, and I file and hash it. This needs an edit to lead-data.md, which you froze, so you'd be authorising it.
  (3) Harness permission rule — Restrict its Write to state/consults/ in the Claude Code settings. That's a config change you'd make.

---

4. AI_DEVELOPMENT.md's new lead-data section is the pilot's Part 3, copied verbatim. So it still says the index update happens after a merge, and still states the old one-file check. Your clarification (C1, C3) overrides both. Add a pointer?
  (1) Append a pointer (Recommended) — One dated line after Part 3 saying the 2026-10-03 clarification governs. Part 3 itself stays untouched, and the line lands in #166's correction round.
  (2) Leave as is — The clarification goes with every lead-data brief, but someone reading AI_DEVELOPMENT.md alone sees only Part 3.
