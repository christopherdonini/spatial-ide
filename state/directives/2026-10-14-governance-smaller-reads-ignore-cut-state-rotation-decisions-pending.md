# Three governance-lane pieces to make the custodian's routine reads smaller (A: a root .ignore; B: the continuity block's cap and the ledger's rotation; C: DECISIONS-PENDING's open entries and the ruling archive), the two measurements before A and after C, and the addendum — the human, verbatim

*Custodian's filing note (2026-10-14): typed by the human, received at 16:48:42Z by the transcript. Below the rule is the message, byte-copied by script from that record, from line 6. One final newline is added and nothing else is changed. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`. The human's words here are the authority for the record rules the three pieces add.*

---
Three governance-lane pieces to make the custodian's routine reads smaller without losing obligations, recovery information or verification coverage. They never hold slot 1 and go in the order A, B, C after what is already queued in that lane. My words here are the authority for the record rules they add; append those rules to AUTONOMY. Each merge is my click.

Measurements, taken before A and after C, each named for exactly what it shows. Neither is a token count.
(1) Routine read: one extraction script, written before the first measurement and run unchanged after. It outputs exactly what the reading order's items 1 to 3 deliver: the continuity block as session-resume.mjs injects it, the ledger part item 1 names, and the DECISIONS-PENDING part item 3 names. Report the UTF-8 bytes of its output. The form states precisely what the script extracts.
(2) Search corpus: from the repository root, the sum of UTF-8 bytes of the files `rg --files` lists. That is what a default tree-wide ripgrep search walks.

A. A root .ignore, root-anchored:
     /site/
     /CUSTODIAN-QUEUE.json
     /state/cut-archive/
     /state/drafts/
     /state/consults/gates/
   - Test it with the agents' own search tool, both ways:
     - a directory search and a tree-wide search miss a string found only under state/drafts/;
     - a search naming that file, or its folder, finds it.
     Record the result. Do not assume the two behave alike.
   - No script runs ripgrep (the checkers list files through git). Confirm by grep before merging.
   - Rule, appended to AUTONOMY: "A tree-wide search excludes historical material: the paths in .ignore, and hidden folders such as .cut-archive/. Before concluding that a ruling, precedent, review or design does not exist, search those locations explicitly. Active work keeps direct references to its own drafts and gate reports."

B. state/CUT-STATE.md: a small continuity block and a rotating ledger. The file keeps its name, because flush.mjs, precompact-flush.mjs and session-resume.mjs read it by name.
   1. The six STANDING items in the continuity block, (00), (0), (2), (5), (14) and (18), move out verbatim, each with its source: PRECEDENTS.md for generalized rulings, AUTONOMY for mechanics. The block keeps at most a one-line pointer.
   2. The cap in flush.mjs:
      - flush.mjs refuses a SESSION-CONTINUITY block over 6,144 bytes, counted as UTF-8 bytes, not characters. The refusal names the largest field and the sizes.
      - A refusal leaves the file byte-identical. Nothing is ever truncated automatically: unresolved findings, ownership and stop conditions are shortened by the custodian or kept.
      - Tests: exactly 6,144 bytes passes; 6,145 fails; a non-ASCII block whose character count is under the cap but whose byte count is over it fails. Mutation: the cap removed, or counted in characters; a test fails.
   3. Rotation:
      - The ledger rotates every Monday, and sooner if the file passes 150 KB.
      - A rotation is a git mv, byte-identical, to state/cut-archive/CUT-STATE-<date>.md. On a same-day collision the name takes a -2, -3 suffix, and no archive is ever overwritten.
      - The new state/CUT-STATE.md starts with the continuity block, its "Previous ledger" line, and one notice: line references written before the rotation point into <archive path> at <commit>.
      - The rotation commit is followed by a normal ledger-only flush commit. The freshness checker's ledger-only rule is not loosened. Show that the precompact and stop hooks pass after the first rotation, which is part of this piece.
   4. Two gated citations point into today's file:
      - state/consults/2026-09-26-source-watcher-gate3-architect.md:109 cites state/CUT-STATE.md:8;
      - state/consults/2026-09-26-stop-hook-lease-gate1-reviewer.md:32 cites state/CUT-STATE.md:332-333.
      Treat them as on 2026-09-24: each names the archive path, or the commit where the cited text sat. verify-cites passes before and after.
   5. session-resume.mjs's reading order, item 1: "the continuity block, then the live ledger, plus any unfinished matter it names explicitly."

C. DECISIONS-PENDING.md: open entries plus recent rulings.
   1. git mv the file, byte-identical, to state/cut-archive/DECISIONS-PENDING-<date>.md (same collision rule). The new DECISIONS-PENDING.md holds:
      - its title;
      - the same notice about earlier line references;
      - the "## Pending" heading, with only the entries still open, copied verbatim, each with the archive line it came from.
      List the kept entries in the PR body for my check. When in doubt, an entry stays.
   2. A ruled question is not finished work. Before an entry is archived, every obligation it still carries must be represented in PLAN or the continuity block. List any that are not, in the PR body, before merging.
   3. One shared helper finds the ruling set: the live file plus the tracked DECISIONS-PENDING-*.md files in state/cut-archive/, listed through git, in a fixed order. Each record is resolved inside its own file, never across file boundaries. Three readers use it:
      - verify.mjs, verdictCiteExists;
      - verify-test-claims.mjs, loadDecisionsPending;
      - verify-quotes.mjs, its hash-scan file list.
   4. Tests, each with one mutation:
      - a ruling found only in the archive resolves;
      - a missing ruling still fails;
      - a round header in one file and an item in another never combine into a valid ruling;
      - an invalid hash in an archived file still fails.
      Run every existing check before and after the migration; the results must be the same.
   5. Further rotations:
      - New RULED blocks keep landing in the live file. Its resolved part rotates on the first of each month, and sooner if the file passes 150 KB.
      - If the open entries alone keep it over 150 KB, do not rotate again; tell me instead.
   6. session-resume.mjs's reading order, item 3: "the open entries and recent rulings; search older rulings by date, round or entry in DECISIONS-PENDING.md and state/cut-archive/DECISIONS-PENDING-*.md, never read them whole."
   7. About 116 unpinned DECISIONS-PENDING.md:<line> citations will point into the new short file, sometimes at unrelated text. verify-cites treats them as advisory, so CI stays green, and the notice in the new file is their way back. They sit in append-only records, so they stay as they are. From now on, cite a ruling by its date and round, or pin the line.

Out of scope: one file per PLAN node, the CI-built site, and the gate log's format. I decide those after seeing the two measurements. The PLAN.yaml summary trim stands as already placed.
Addendum to the three governance-lane pieces.
A: the AUTONOMY rule names how to search an excluded location: Bash rg --no-ignore scoped to the folder, or Read by file name, as the test shows works. The Grep tool alone is not enough there.
B: when flush.mjs refuses a block in the precompact or stop hook, it writes the refused block whole to a named scratch file outside the repository and names that path in the refusal. B's PR shows the live block under 6,144 bytes before the cap is enabled. Rotation is a named script the custodian runs at the start of a session, never inside a hook. The continuity block's pointer names the exact PRECEDENTS and AUTONOMY sections the six standing items moved to, and reading-order item 1 includes them.
C: before merging, show that verify-cites treats an unpinned line past the new file's end as advisory. Monthly rotations use C.1's procedure: whole-file move, open entries copied with their archive line.
