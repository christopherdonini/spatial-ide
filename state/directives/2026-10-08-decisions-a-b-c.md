# Directive — Decisions A, B and C: the milestone 1 re-aims, a bounded freeze exception for pinned citations, and the shell lock line for B2 piece 1a (the human, verbatim)

*Custodian's filing note (2026-10-08): the custodian put three decisions to the human in its closing messages, not by AskUserQuestion: A, invalidator I3 of `shell-migration-milestone-1`; B, the freeze and the citation checker; C, a red line, the `getrandom` line in `frontends/shell/src-tauri/Cargo.lock` for PR #190. The human typed the rulings as a new message, received at 14:23:55Z by the transcript. Below the rule, byte-copied by script from the transcript with one final newline added, with nothing else, is the message (from line 6 to the end). It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
A: (a). Re-aim the seven failing checks inside milestone 1. The extra lines are
recorded as an overrun.
- A re-aim changes a check's assumption about the map (a size, a distance, a
  threshold), never what it asserts about the product.
- Each new value is derived from the measured map and the fixture and stated in
  the test. None is tuned until green.
- A9' and K6 stop depending on one candidate pixel.
- Each re-aimed check is shown still able to fail: by its recorded mutation
  where it has one, otherwise by one stated in the PR body.
- The PR body lists each check with its old and its new assumption.

B: (a), as a one-off exception to the freeze, bounded.
- A citation that carries a pin (@ commit) and does not resolve in the tree is
  read at its pinned commit before it is called unresolved. A pin whose commit
  or file is missing fails.
- Nothing else in the checker changes. Unpinned citations are checked against
  the tree as today.
- It ships with its tests as its own small piece, merged before milestone 1
  opens its PR. Milestone 1's own boundary does not change.

C: yes. The single line "getrandom 0.3.4" under spatial-kernel may go into
frontends/shell/src-tauri/Cargo.lock. No new package and no version change. If
that lock's diff shows anything else, stop and tell me.
