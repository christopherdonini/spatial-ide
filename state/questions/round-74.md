Question round 74 — 2026-11-13 (custodian → advisor). Written by the custodian under the human's message of 2026-11-13 (06:57Z), item 2 (`state/directives/2026-11-13-on-notifications-questions-to-the-advisor-telegram-three-alarms-hooks-piece-no-askuserquestion-until-it-merges.md`). The custodian does not call AskUserQuestion, and no hook wrote this file. 2 items. RED LINE items: none. The advisor's answers, and the human's when they come, are recorded against this file. The advisor asked for the pan-anchor proposal to come first. The older items carried since 2026-10-20 (gate reports' H-items, the custodian's brief errors, other disclosures) come in round 75, each with its record path, once those records are located.

Nothing below is a quotation unless it is marked as one.

---

1. Pan-anchor's harness fix: which of the two fixes the human named, and where it goes in the order.

**The node.** `pan-anchor-setcam-waits-for-its-own-reset` in `governance/PLAN.yaml`, test only, under its form `governance/forms/frontends/PAN-ANCHOR-SETCAM-WAITS-FOR-ITS-OWN-RESET-PREREGISTRATION.md`. Its status is ready: every node it depends on is done, the S1 fix last (#311, merged at bb8835c6). Its worktree, `C:/dev/wt/pa`, is held at its commit 1, 624b2e68, which is local and not pushed. Its budget is 60 minutes.

**What is wrong.** `e2e/pan-anchor.mjs`'s `setCam` can take a late view-state line from the previous gesture as its own reset. It then reads a stale start point and reports the whole drag as a grab-point residual. Commit 1 makes `setCam` wait for a line with its own zoom, but inside a fixed bound of 5500 ms, and under load that bound broke: P1 exited 2 (the form's Amendment 2 item 1; the P1-D observation, `state/consults/2026-11-10-pan-anchor-setcam-waits-for-its-own-reset-p1d-worker-report.md`). The human graded the stalls S3, the harness's, and released the piece to take route 1's fix, with the custodian proposing which of the two (`state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md`, item 5 (a); the form's Amendment 4). The two fixes are named in `state/directives/2026-11-11-1c-open-7-1-a-p2-now-pan-anchor-route-b-diagnostic-now-stall-record-two-runs.md`, line 20. The diagnostic's runs: `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-build-worker-report.md` and `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-quiet-worker-report.md`.

**What it costs now.** PR B's series at M′ 6649a443 failed pan-anchor twice at 90 to 100% machine load, on recenter-crossing-A dx=-1200 with a residual of 1100.01 buffer px, once on each window. Your reading of 2026-11-13 is that this is the same signature, and that it is not #311 regressing. The custodian re-runs it alone before PR B's record says anything of it.

**The question.**

(a) Which fix?
  (A) The suite waits on its own lines with no wall-clock bound that load can break (Recommended, the custodian's proposal at the form's Amendment 4 item 2). The quiet run still had 7 long stalls with the quiet condition shown. A suite that only avoids starting beside a build would still meet those stalls, so only this fix removes the failure they cause. The fix's shape is drafted by the architect as the form's Amendment 5, read only, before any code. The worker then builds it from commit 1, and a single reviewer gates it (the form's settlement, OPEN-6 (A)).
  (B) The suite does not start beside a build. It needs no code in the suite, but by the reading above it leaves the stalls that are not beside a build.

(b) Where does it go? The human's order of 2026-11-12, item 8 (`state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md`, line 35), puts it in slot 2 after the publish approval piece, the second-open node and step 2's kernel phase.
  (i) The filler slot, right after entry 15 (the Rust CI fix now in flight) (Recommended). It is test only, in `e2e/pan-anchor.mjs` and its README entry, so neither product slot waits on it. Rule (00) is checked at dispatch against slot 2's publish approval piece and PR B. Until it merges, every loaded series pays a re-run.
  (ii) Slot 2, ahead of the publish approval piece. The publish approval piece and v0.2's tag then wait about the piece's budget, plus its gate.
  (iii) The human's order as it stands.

---

2. The publish approval form's OPEN-9: the order of the docs-lane findings node.

**The records.** The form draft is `state/consults/2026-11-13-publish-approval-columns-line-form-architect-draft.md`, section 10, OPEN-9. The node `publish-approval-consult-gate-findings` edits paths that this piece also edits: PublishDialog.tsx's comment, the walkthrough's Part G G3, and ADR-024. The human answered OPEN-1 to OPEN-8 in their message of 2026-11-13 (06:43Z), item 7 (`state/directives/2026-11-13-advisor-session-from-advisor-live-human-clicks-until-then-publish-approval-answers-rust-ci-fix-filler-now-toolchain-consult.md`), and named no answer for OPEN-9. It is not a red line. The custodian's message to you at 08:23:30Z (the ledger's entry at 2026-11-13T08:27Z) said it takes the recommendation unless you rule otherwise, and you have not ruled on it.

**The question.**
  (a) The findings node starts after this piece merges, so that its words read the new line (Recommended, the drafter's recommendation).
  (b) It starts before this piece.

The form is committed with (a) unless you answer otherwise before its commit.

---

**Answers recorded** by the custodian on 2026-11-13. The advisor's ruling ADV-2026-11-13-08 (`state/directives/2026-11-13-advisor-ruling-adv-2026-11-13-08-round-74-pan-anchor-waits-on-its-own-lines-filler-slot-after-entry-15-findings-node-after-publish-approval.md`), filed as the advisor's under the human's delegation of 2026-11-13, answers both items: item 1 (a), (A); item 1 (b), (i); item 2, (a). Its item 3 adds that the alone re-run of pan-anchor for PR B still happens. No answer of the human's has come. Nothing above is changed.
