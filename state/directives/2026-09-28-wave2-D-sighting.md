# Directive — the placement of suites-and-toolchain-beyond-windows, and Fable on batch 1, W2-B and the W2-D brief (the human, verbatim)

*Custodian's filing note (2026-09-28): the human's message received after batch 2's launch (the ledger entry of 2026-09-28T07:40Z), recorded verbatim below the rule as received. It carries the human's placement ruling and Fable's notes on wave 2 batch 1, on W2-B's "Open no PR" line, and Fable's sighting of `state/drafts/wave2-D-brief.md` (all five points). Cited as "the 2026-09-28 W2-D sighting" with its paragraph or point numbers.*

---

HUMAN RULING 2026-09-28: suites-and-toolchain-beyond-windows is placed, to run next after the node now
in progress; W2-D may launch once Fable's sighting conditions below are met.

Fable on batch 1: noted as filed. The A2-1 S1 grading is right: ADR-023 §3's clause is either kept or
broken, and failing loudly does not mitigate it. It is ruled with the other S1 candidates after the wave.
A1-1 joins the refusal-wording review at B1's close.

Fable on W2-B's conflict: a drafting error in the wave file (the "Open no PR" rule should have been listed
among W2-B's replaced lines). Either outcome is conforming: keep one PR if the worker opens it; if it opens
none, the branch stands, and we decide at triage whether to open a draft PR from cloud/wave2-B. Record
this as a dated deviation note in state/cloud/wave2-prompts.md, the way wave 1's Deviation 1 was recorded.

Fable's sighting of state/drafts/wave2-D-brief.md, all five points:
1. The boundary.rs exception is NOT granted. You make that change yourself, as your own commit on
   cloud/wave2-D after the preregistration commit: `#[cfg(windows)]` on the `D:\maps\out` assertion
   statement only (boundary.rs:530). The test's name and its other assertion are unchanged. The worker's
   NEVER WRITE line reverts to W2-A1's verbatim, with no exception.
2. D-3 is also yours, in the same commit, if and only if your local `npm --version` is 11 or later
   (record the output along with `node --version`): one line in CONTRIBUTING.md's setup section
   (npm 11+; CI runs Node 24; npm 10 fails `npm ci`, per wave 1 D-3), and CLAUDE.md's Environment
   "Node LTS" becomes "Node 24 LTS (npm 11+)". If local npm is older, stop and tell me.
3. Placement: the human's ruling above.
4. Scope: agreed as briefed.
5. Launch after batch 2's balance reading.
Update the preregistration form to match. Scope: 8 files, split by who does what (you: boundary.rs,
CONTRIBUTING.md, CLAUDE.md; the worker: the three lod_tier tests, no_generation_in_persisted_artifacts.rs,
engine/tests/common/mod.rs), with the line budget unchanged. The worker's TASK drops the D-2 and D-3
bullets and says both are already on the branch. Its Linux check (0 failed, and no file named with a
backslash) now covers them too. Its one PR carries your commit, and the reviewer gate covers the whole PR.
