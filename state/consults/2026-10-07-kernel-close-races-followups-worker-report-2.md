*Custodian's filing note (2026-10-07): `kernel-close-races-followups`'s worker report 2, lead-data's index lines applied and SKP-V0's invalid byte fixed, by the worker (Sonnet 5.5, by its definition) on the custodian's brief. It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 0795fdd8e9e6b5d18c39855a6b10e05b1ab47b1e12d19f18537e4a24b9e1990a. Write audit PASS: its edits by shell in the worktree `C:/dev/wt/kcrf` and its scratch files in the session's scratch folder; nothing in the main checkout or under the user's Claude folder. The custodian checked: origin's branch head is 78e52eea, the worktree is clean, the three README lines are lead-data's replacement lines byte for byte, line 1022 is valid UTF-8, all seven changed files pass iconv, and the piece is 112 lines over 7 files.*

---

Commit 78e52eea6460f9eb0dcffa3af3cb37a25b1f85ca on cut/kernel-close-races-followups, signed off. Published to origin as an ordinary update (2d75b57b..78e52eea). The worktree is clean (`git status --porcelain` is empty).

**README (kernel/README.md, lines 350, 374 and 376):** The consult text was byte-copied by script. The script first checked that each current line equalled the consult's "Current" line. The diff output below is cut to the first 160 characters per line. The full old and new text is in the commit, and each new line is the consult's replacement line.
- 350
  - `-- **Last verified at:** 3c29bc67 (every pointer checked at that commit)`
  - `+- **Last verified at:** 2d75b57b (every pointer checked at that commit)`
- 374
  - `-  - preregistrations in this module: ...GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, ...`
  - `+  - preregistrations in this module: ...GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, ...`
- 376
  - `-  - kernel halves of pieces filed elsewhere: ... `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/FILTER-BIND-CO...`
  - `+  - kernel halves of pieces filed elsewhere: ... `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, ...`
- `engine/README.md` is not touched.

**SKP-V0.md line 1022, before and after (`od -c`):**
- Before: `> edited. (ii) ` then octal 247. The line is `> edited. (ii)` followed by a space, so the lone byte is the 16th byte (1-based), not the 15th. The consult's column 15 is 0-based or approximate; I confirmed the byte at that index was 0xA7 and the one before it was a space.
- After: `> edited. (ii) ` then octal 302, then octal 247 on the next `od` row. That is the byte pair 0xC2 0xA7.
- The script inserted one 0xC2 byte before the existing 0xA7 and left every other byte alone. It ran against the raw buffer with no re-encoding.

**Checks:**
- `iconv -f UTF-8 -t UTF-8` on all 7 files in `git diff --name-only 99f4c437 HEAD`: exit 0 for each. The files are:
  - `frontends/shell/src/streaming/formatTerminalRefusal.ts`
  - `frontends/shell/src/streaming/liveTicketSet.ts`
  - `kernel/README.md`
  - `kernel/src/skp.rs`
  - `kernel/tests/session_generation.rs`
  - `kernel/tests/wire_bytes_invariant.rs`
  - `protocol/skp/SKP-V0.md`
- I ran `git diff --numstat 99f4c437 HEAD` before the commit, against the working tree. I did not re-run it after the commit.
  - `kernel/README.md` is 3/3.
  - `SKP-V0.md` is 13/2, as you expected.
  - The other files are `formatTerminalRefusal.ts` 3/2, `liveTicketSet.ts` 6/6, `kernel/src/skp.rs` 25/18, `session_generation.rs` 14/14 and `wire_bytes_invariant.rs` 2/1.
- I ran the four plan scripts once together, after the edits and before the commit, from `scripts/plan/`. Each exited 0:
  - `verify-cites.mjs`
  - `verify-quotes.mjs`
  - `verify-test-claims.mjs`
  - `verify.mjs`
- I ran no cargo or npm command.

**Model:** Sonnet 5.5 (`claude-sonnet-5-5`), no override, no context handoff.

**Self-check:**
- No cross-module code was written.
- Every completion claim above points to command output.
- No user-facing message was added.
- No test was required.

**Off-scope noticed, not done:** The Write tool refused two scratch-file writes with "File has not been read yet" on paths that did not exist. I wrote the commit message through Bash into the scratch folder instead. I used the same Bash route for the edit scripts.
