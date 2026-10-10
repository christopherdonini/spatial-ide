# The flake hunt's run 1: the flush cancel exit as an engine node placed in slot 2 (graded S2), and a note on the cross-stamping node — the human, verbatim

*Custodian's filing note (2026-10-10): typed by the human, received at 10:25:26Z by the transcript as one message (origin human). Below the rule is the message, byte-copied by script from that record, from line 6 to the end. One final newline is added and nothing else is changed. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
A flake-hunt report is in the advisory folder as FLAKE-HUNT-RUN-1-2026-10-10.md, sha256 1e846a836b778706e9a141ab6ac91b9006940890636b30a7424bfe542a20c205, with its evidence in the folder FLAKE-HUNT-RUN-1-2026-10-10-logs (13 files, hashes in its SHA256SUMS). Copy both into state/consults checking the hashes. An independent agent built the workspace on Linux and ran the suite repeatedly at 116deb53. I had its code reading checked against main and it holds: flush's cancel exit in engine/src/stream.rs returns Cancelled without marking PRODUCER_CANCELLED, and the five other exits mark it.
1. Append a proposed node for this, engine lane, graded S2: the flush exit marks the event, with a test that forces that exit. Its own full form, because it bears on the docs/08 cancellation budget; lead-data's impact read first. The form also says whether the four kernel tests that read the same event can hit the gap.
2. Place it in slot 2 after the KNOWN-LIMITATIONS item 8 fix and before the notice route.
3. slice-traced-test-cross-stamping stays proposed. Note on it that these failures were a missing event with nothing dropped from the trace, so its predicted mechanism was not what was observed.
