# Directive — the lead-data pilot stands, and Fable's clarification C1 to C4 (the human's direction line and Fable's clarification, verbatim)

*Custodian's filing note (2026-10-03): the human's message received mid-turn at 09:18:38Z by the session transcript. Its first three lines are the human's direction. The rest is Fable's clarification of `state/directives/LEAD-DATA-PILOT-2026-10-03.md` (whole-file sha256 05c740f8352e6d218f920f1ccef5b8a461de9b625da768ce160c37bde0b4a962). The text below the rule is the received text, with its CRLF line breaks normalised to LF and nothing else changed.*

*The direction line gets a RULED block in `DECISIONS-PENDING.md` (§105), as the message asks. The pilot directive and `.claude/agents/lead-data.md` are not edited. The clarification governs where it differs from either, and every brief to lead-data carries it.*

*Cited as "the 2026-10-03 lead-data clarification", with its item numbers C1 to C4.*

---

HUMAN DIRECTION 2026-10-03: the lead-data pilot stands. Record Fable's clarification below through the
existing process and apply it from the first lead-data dispatch. Edit neither the pilot directive nor
.claude/agents/lead-data.md.

Fable — clarification of 2026-10-03 to state/directives/LEAD-DATA-PILOT-2026-10-03.md (sha256
05c740f8352e6d218f920f1ccef5b8a461de9b625da768ce160c37bde0b4a962). It adds no scope. Where it differs
from the directive or the agent definition, it governs. The custodian's brief to lead-data carries it
on every dispatch.

C1. Index updates come before merge. When an in-module piece's implementation is ready, and before its
final gate, lead-data writes the owner's-index update. A worker applies it in the same implementation
PR, and the final review checks it against the diff. §1's "after each merged piece" is read this way.

C2. The index replaces rediscovery, not verification. Every dispatch still reads the affected
interfaces, implementation and tests at the revision its brief names. A piece whose paths stay inside
engine/ and kernel/ but which changes a contract another module consumes (SKP behaviour, refusal codes,
describe fields, bundle or wire semantics) is a crossing piece: lead-data flags it, and the architect
drafts it after lead-data's impact read.

C3. The write check and the hash. Before each dispatch of lead-data, and of the architect under the
trial, the custodian records the assigned worktree's `git status --porcelain`. Afterwards, the only
difference allowed is the one report file at the brief's path. Changes already in the worktree are kept,
and are not a failure. Neither agent can compute a hash: it returns "sha256: not computed", and the
custodian computes the hash from the saved bytes. That is the hash of record. This replaces the
2026-10-03 trial's "exactly one new file" check.

C4. Measurement.
- Before the first measured piece, the custodian names the baseline in the trial log: the most recent
  architect-drafted pieces confined to engine/ and kernel/ (paths and contracts, per C2), up to six, by
  node ID, each with its correction rounds and drafting reads.
- The setup's cost is reported separately.
- Per piece, index upkeep counts as ongoing cost.
- Each correction is classed as draft-caused, an implementation defect, or changed scope. Only
  draft-caused corrections count against the lead in §5.
- Usage that can't be observed is recorded as unknown, never estimated.

File this message verbatim under state/directives/, with a RULED block for the human's line only (§105).
Then refresh the continuity block.
