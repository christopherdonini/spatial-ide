# Directive — the human's direction of 2026-10-05: the data-plane piece placed with its shape ruling, the mods v1 brief, the lead-data second pilot; with Fable's steps (relayed, verbatim)

*Custodian's filing note (2026-10-05): the human's message, received at 00:15:15Z by the session transcript (origin human). It holds the human's direction (lines 1 to 3) and Fable's numbered steps (a to g). The text below the rule is the received text, extracted from the transcript by script, with nothing changed. The human's lines 1 to 3 get RULED blocks in `DECISIONS-PENDING.md` (§105). Fable's steps are procedure, not rulings. The two briefs the direction approves are copied byte-identical beside this file, `state/directives/MODS-V1-2026-10-05.md` and `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`, each checked against the sha256 Fable's step b names. Cited as "the human's 2026-10-05 direction", its lines 1 to 3.*

---
HUMAN DIRECTION 2026-10-05:
1. Place data-plane-terminal-without-credit next in the kernel-protocol lane, after
   timing-assertions-under-contention. It takes the first free slot; no code before that piece merges.
   SHAPE RULING: credit gates batch frames only. A terminal frame of any code is never held for
   credit: not after a producer failure, not after an SKP cancel, not at completion. On completion
   every batch is still delivered before the terminal. An SKP-cancelled stream keeps
   TERM_PRODUCER_FAILED, and kernel/tests/skp_admission.rs's cancel test stays unchanged as the
   end-to-end proof. No wire tag, code or frame layout changes. The declared ceilings do not grow.
   What happens to batches queued ahead of a failure, and any engine change, come back to me as OPEN
   items before code. ADR-012 stays Proposed and is not amended by this piece.
2. I approve Fable's mods brief, MODS-V1-2026-10-05.md: build and gate evidence-recorder-v0-1, then
   guardian-v1, in the governance lane beside the product piece. Both mods are read from the
   repository, so each merge changes the live mod: each waits for my typed approval after its gates,
   naming the live checks, before my click. This brings forward window item G. G7 refuses every agent
   pull-request merge, so AUTONOMY §9's docs-only auto-merge is not used while Guardian is installed.
   From the repeat-runner's merge on, briefs tell testers and workers to run repeated evidence runs
   through it.
3. I approve the lead-data second pilot, LEAD-DATA-PILOT-V2-2026-10-05.md: impact reads and the
   owner's index, never drafts. Its first piece is data-plane-terminal-without-credit. Question round
   43, item 2 stands for drafting.

Fable, 2026-10-05:
a. File this message verbatim first, with RULED blocks for the human's lines (§105).
b. Copy from the human's Spatial IDE folder to state/directives/, byte-identical; a mismatch means
   stop:
   - MODS-V1-2026-10-05.md
     sha256 818c4b5a2727afb752c92345682f07564c7b49506cf3f32154987ac02a1c9e69
   - LEAD-DATA-PILOT-V2-2026-10-05.md
     sha256 56d4f2f1565910e832e5fe47de959832caea4478c3564852eba4c06df4a82815
c. PLAN: place data-plane-terminal-without-credit as line 1 says. Add evidence-recorder-v0-1
   (governance) and guardian-v1 (governance, depending on it). recorder-write-latency-measure is
   folded into evidence-recorder-v0-1 (the brief's section 3.3): mark it superseded.
d. The two-pieces limit holds. The data-plane piece takes the first free slot and
   evidence-recorder-v0-1 the next.
e. For the data-plane piece: name the pilot's baseline in the trial log first (the lead brief's
   section 4), then dispatch lead-data for the impact read, then the architect's draft with the
   read's path.
f. Do not edit AUTONOMY §9. Line 2 governs while Guardian is installed, and the suspension goes to
   the 2026-10-09 window as an item for an appended note.
g. Refresh the continuity block.
