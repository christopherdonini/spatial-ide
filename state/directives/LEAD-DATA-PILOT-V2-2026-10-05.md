# The data-path lead, second pilot: impact reads and the index, never drafts (2026-10-05)

*Fable, 2026-10-05, on the human's decision of the same date. The custodian files this under `state/directives/` with the human's covering line. It restarts the `lead-data` role in a narrower form. Question round 43, item 2 kept the first pilot's stop, and that stands for drafting: `lead-data` never drafts a preregistration. The first pilot's directive and its clarification C1 to C4 stay as filed; where this differs from them, this governs. The agent definition is not edited: its first task, drafting, is simply never asked for. Repository facts were read at main 4398a779.*

## 1. What the lead does

1. **An impact read,** before the architect drafts any placed piece that touches `engine/` or `kernel/`, whether the piece is confined to them or crosses into another module. It holds pointers only:
   - the interfaces the piece touches, each with its authoritative source and the test that pins it;
   - who consumes them in other modules;
   - the ADRs, preregistrations, KNOWN-LIMITATIONS items and declared ceilings that govern them;
   - at most five questions the form must answer, one line each, each with the pointer that raises it.
2. **The owner's-index update,** before the piece's final gate (C1, unchanged). A worker applies it in the piece's pull request and the final review checks it against the diff.
3. **A bounded question** from the custodian about its modules.

**It never** drafts, designs, recommends, answers an OPEN item, approves, reviews, merges or places work. An impact read contains no draft text.

## 2. How the architect uses it

- The custodian's drafting brief gives the architect the impact read's path.
- The architect reads it first, then only what the draft needs.
- The draft's files-read section says which pointers it used, which it found wrong, and which were missing.

## 3. The first piece

`data-plane-terminal-without-credit`. Its summary's item (v) asks whether an SKP cancel reaches the data plane directly and whether that reaches the engine boundary. That is an `engine/` and `kernel/` impact question, so the read is useful to the draft from the start.

## 4. Measurement, over the next four such pieces

The clarification's C4 classes are kept. For each piece the custodian records, in the trial log:
- the impact read's cost and the architect's drafting cost (tokens, tool uses and time, from the harness's notification or the Recorder's usage record; unknown is recorded as unknown);
- each pointer found wrong or missing, and who found it (the architect or a gate);
- each correction round, classed as before. A round counts against the lead only when a wrong or missing pointer caused it;
- whether the index was updated in the pull request;
- whether the architect's or a gate's report names a pointer or question from the impact read that the form used.

**The baseline,** named before the first measured piece: the six most recent architect drafts of pieces touching `engine/` or `kernel/` that had no impact read, by node, each with its drafting cost.

## 5. Acceptance, after four pieces

- at most one piece on which a gate finds a pointer wrong;
- the index updated in every pull request;
- on at least two pieces, a report names something from the impact read that the form used;
- the combined cost (impact read plus architect's draft) is reported beside the baseline, and the human judges whether it pays. No threshold is set, because pieces differ too much for one.

## 6. Stop

- a wrong or missing pointer causes a correction round on two of the four pieces;
- an impact read carries design, a recommendation or draft text on two pieces (once is recorded and told to the human);
- the lead writes outside its report path (stop immediately; Guardian's G6 refuses it, and the write audit is the backstop).

On a stop the custodian returns to drafting without impact reads and tells the human.

## 7. Mechanics, unchanged

- Each run writes one report to the path its brief names on a `REPORT PATH:` line, and returns its result in one line, any blocking question in one line each, and the path.
- The custodian computes the hash of record and takes the worktree's porcelain before and after (C3).
- The custodian remains the single coordinator and the only writer of shared records. Gates are unchanged.

## 8. Reporting

An interim note at the 2026-10-09 window, with whatever exists by then. The result after the fourth piece.
