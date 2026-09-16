Question round 5 — 2026-09-16 (custodian → human). Four items: the P3b preregistration draft (for your sight, with its five pre-committed choices), a §21 housekeeping ruling (three gaps the tooling piece exposed), the cancel-window guarantee the P3a architect routed to you, and the instrument-accessor exemption to the caller rule.

1. P3b preregistration — `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md` on main (architect-drafted from the actual owner interfaces, read first; every cite spot-checked by the custodian). It picks up Amendment 3's deferral list by name: owner-side invalidation on BOTH routes (the data-plane terminal and the pre-check's thrown SKP error) in both owners (App.tsx, candidateArmSession.ts — plus a third stream sink the draft found, the candidate arm's untiled first look, which today tests no terminal code); picks refused by a fourth HoverReadout state (never silence); the typed status rendered through RefusalBlock, not dismissible until reopen; the kernel-authoritative dead-ticket refusal three-valued (Live / EndedBySourceChange / Unknown — the source-changed refusal ONLY for a known-dead ticket; unknown falls through to redeem's own refusal) with its real caller at src-tauri's app setup; no wire change (skp/0.3 stays); engine/ predicted empty. Ten tests each from the real shape with one mutation each; an E2E on a scratch copy of the 100k fixture mutated by mtime only. The five choices pre-committed for your sight:
  (a) picks REFUSED BY NAME (a fourth readout state) rather than cleared silently — ADR-010 rule 5;
  (b) the pre-check route (a refused query) clears the view the operator is looking at, same as the terminal route — G-A2 demands both;
  (c) the session-ended status renders in the existing canvas status stack via RefusalBlock and is NOT dismissible until reopen (the residency-status precedent);
  (d) disclosed: the string P3a landed — "Everything read so far has been discarded" — is false until P3b lands (P3a clears nothing); P3b makes it true without editing the wording (yours at P6);
  (e) file path: frontends/shell/ by the owning-module rule (the predicted diff is shell + kernel; engine empty), not engine/.
Options:
  1. Accept the draft as pre-committed (Recommended): P3b starts after P3a lands; the two new strings (pick refusal, session-ended status) join the P6 sight list.
  2. Hold: you read the file first.
  3. Accept with changes: name the choice(s) to change; recorded as a class-5 amendment quoting your words.

---

2. §21 housekeeping — three gaps the tooling piece (#82) exposed, all recorded by the architect, none settled by me:
  (i) §21c's counting rule is undefined: the piece measured 157 insertions all-files (149 code-only; 164 insertions+deletions) against "≤ 150 changed lines of non-generated code". I took the architect gate rather than read it in my favour.
  (ii) the preregistration template has no amendment class for a short-form budget deviation (class 2 used as the nearest fit).
  (iii) a size overrun discovered mid-piece has no written route in §21b (categories only); a full preregistration cannot be written after the code.
The architect's drafted one-line §21c note, for your choice of counting rule: (a) insertions + deletions across every non-generated file, the piece's own preregistration included (strictest); (b) insertions only, every non-generated file counted; (c) insertions only, excluding the piece's own preregistration and any governing-doc sentence the piece is obliged to update. Plus, whichever: "a size overrun discovered mid-piece closes the single-gate route exactly as a §21a category does, except that the piece keeps its five-line form and records the overrun as an amendment — a full preregistration is never written after the code."
Options:
  1. (b) insertions only, all non-generated files, + the mid-piece clause (Recommended): the safer side without double-counting deletions; the template gains a short-form class for "budget deviation, Scope not edited".
  2. (a) insertions + deletions, all files, + the mid-piece clause.
  3. (c) code-only + the mid-piece clause (the throughput reading; the exempt set enumerated narrowly).
  4. Something else — type it.

---

3. The cancel-window guarantee (P3a, §13 C rule (ii)). Verified by the architect, no number claimed: cancel_observed (what docs/08 budgets, < 100 ms) is stamped inside produce() BEFORE the post-check, so docs/08's budget is NOT at risk. What moved: the post-check (a bounded metadata + footer read, ≤ 8 MiB, + SHA-256) now runs between the producer's cancel_observed and the Cancelled terminal the consumer receives — i.e. inside the unbudgeted acknowledged/quiescent term. One pre-existing liveness test (slice.rs, 100 ms on the consumer's receipt, no docs/08 disclaimer — the disclaimer is being added) failed once under parallel load and passed on every other run. The question is yours because both escapes contradict something settled: running the post-check off the cancel path changes your §13 C rule (ii) ("the check still runs and still records the change"); sending the terminal before the post-check re-opens the race the attempt-1 fix removed.
Options:
  1. Keep rule (ii) as it stands; P5's tester measures the acknowledged term with the post-check inside it, no figure claimed before (Recommended).
  2. Move the post-check off the cancel path for CANCELLED streams only (rule (ii) narrowed: a cancelled stream's change is caught by the next pre-check instead); recorded as a §12e amendment.
  3. Hold until the tester's numbers exist, then decide.

---

4. The caller rule's exemption for instrument accessors. Your rule: "no callback, code path or pub item lands without a caller". Both P3a gates passed `GenerationRegistry::attributed_ticket_count` (test-only caller) on precedent — `index_consultations`, `row_group_consultations`, `attribute_concatenations` are accepted pub accessors whose only caller is the test suite, read-only over state the shipped build maintains, so a property can be proven about the shipped build rather than in prose — and asked for the exemption's wording so the next gate does not re-litigate. The architect's drafted sentence: "The caller rule exempts instrument accessors: a `pub` read-only accessor over state the shipped build already maintains, whose doc declares that its only caller is the test suite and why the property must be proven about the shipped build. It exempts nothing that acts."
Options:
  1. Adopt the sentence as written (Recommended): appended to the seam rule in the worker brief and both gate checklists.
  2. No exemption: such accessors go behind cfg(test) or are deleted; the precedented three get a follow-up.
  3. Different wording — type it.
