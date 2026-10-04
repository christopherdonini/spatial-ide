Question round 48 — 2026-10-04 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 1 item, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Round 48 — your 2026-10-04 shell-route ruling, as Amendment 4 reads it (state/consults/2026-10-04-guardian-v0-architect-amendment-4.md, part 3). Answer: yes, PowerShell is exposed; G1 already hooks it. G2–G4 and G6 today guard writes only on tools with a path field (Write, Edit, NotebookEdit); Bash writes are a stated limit. On the PowerShell tool, which? (The G6 code below proceeds under every option; gate 2 waits on this answer.)
  (1) A: G6 closes it (Recommended) — G6 refuses every PowerShell call by a report-only subagent without reading the command (as the write audit treats shell calls); G2–G4 read no shell command on either shell, the limit stated for both. Drafted; no extra code.
  (2) B: A, plus Bash for G6 — G6 also closes the Bash route for report-only subagents, so both shells are alike; beyond the ruling's 'that tool'; one more hook change and test via an Amendment 5.
  (3) C: A, plus PS write forms — G2–G4 also refuse a PowerShell command holding a declared write form (cmdlets, aliases, redirections, [IO.File]) that names a protected path; never complete; Bash stays uncovered; ~150–200 lines, larger class-8 overrun; Amendment 5.
  (4) D: C on both shells — The write-form refusal on Bash and PowerShell alike; the largest option, beyond the ruling's words; Amendment 5.
