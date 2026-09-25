# The human's messages of 2026-09-25 (after the handover) — verbatim (the wave-1 instruction; the cloud-hook ruling; the #118 merge; the wave-1 block relayed from Fable; the confirmation and the baseline correction)

Recorded by the custodian as received, in arrival order. Nothing here is paraphrased.

## 1. The session-opening message (about 00:35Z)

Fresh session after a human-directed handover. Verify the relinquished lease and that origin matches the last flush, take the lease, then read the resume order. Run wave 1 as recorded: first confirm the cloud launch path against the current Claude Code documentation; then launch only the calibration session (A3), with its prompt assembled exactly as state/cloud/wave1-prompts.md §7 says. Record its session ID and the balance before and after it, and report the calibration result to me before launching any batch. Keep doing local work meanwhile, as long as it doesn't touch the baseline's evidence.

## 2. The ruling on the cloud-hook finding (typed mid-turn, about 00:55Z)

Ruling on the cloud-hook finding. No question round needed; this is a tooling fix under the existing delegation.
(1) Hooks become custodian-only by construction: every hook in .claude/settings.json exits 0 immediately, with no output, when it detects a cloud session. Use the environment marker the cloud-environments documentation names; quote it, don't assume it. Land it on main before any launch as one small reviewer-gated PR, with a dry-run test per hook: marker set → exit 0 and no output; marker unset → behaviour unchanged. That includes the Notification/Telegram hook (no token in the cloud → a silent no-op, never an error).
(2) Amend every wave-1 prompt: replace "git checkout <SHA>" with git worktree add /tmp/wave1-baseline 59406134a447d6187fae4a6a79fb9f390c8efefb. All reading, building, reproducers and branches happen inside that worktree, and the session's own checkout stays on main so the fixed hooks stay in force. Record the amendment in state/cloud/wave1-prompts.md as a dated deviation from the original text, with this reason.
(3) The baseline stays 59406134: the hook PR touches .claude/ and scripts/hooks/ only, which no audit examines. Launch the A3 calibration only after (1) has merged and its dry run has passed.

## 3. Typed mid-turn

I've just merged #118

## 4. A pasted block, with no other text (mid-turn, after message 3)

The session marked it as pasted content; the custodian asked the human to confirm it before acting on it, and message 5 confirms it as the human's instruction, relayed from Fable.

Wave 1 runs against the pinned baseline, so local work continues in parallel; don't wait for it. Rules: (1) triage each finding against main at triage time and mark it fixed-since-baseline / moved / still-present; (2) work in A2's and A5's areas (the watcher, ADR-035's emission point) proceeds and is gated, but if either audit returns an S1 in the same code, fold the fix in before that piece merges; (3) when a report arrives, triage it before continuing other work; otherwise don't poll or babysit the sessions. Meanwhile, from the queue: apply the round-21 rulings (ADR-035 accepted with the rider; #118's correction round); the watcher's preregistration and implementation now that ADR-035 is settled; commit B1's sighted preregistration; and copy map-studio-v7-codex.html and SPATIAL-IDE-DESIGN-NOTEBOOK.md into state/drafts/design/, labelled as design references, not Authority. Note: the SKP conformance session writes fixtures at skp/0.4; if the watcher moves the literal to 0.5 before that PR merges, updating them is the custodian's job at integration.

## 5. The confirmation and the baseline correction (mid-turn, in answer to the custodian's two questions; it arrived as a pasted block with no other text)

Confirming both. (1) The baseline is bb98f71f43a2891d317b10a124387df9d5ee0ebf, your tracked re-pin, correctly made under the handoff rule. My hook ruling's 59406134 is superseded: every amended prompt uses git worktree add /tmp/wave1-baseline bb98f71f43a2891d317b10a124387df9d5ee0ebf. Record the correction beside the ruling. (2) The pasted wave-1 block is my instruction, relayed from Fable. Apply whatever in it isn't already done: skip anything already applied, and say which. The two design references are outside the repository: C:\Users\Christopher\Development\Claude\Spatial IDE\prototype\map-studio-v7-codex.html and C:\Users\Christopher\Development\Claude\Spatial IDE\prototype\SPATIAL-IDE-DESIGN-NOTEBOOK.md. Copy both into state/drafts/design/ with a header labelling them design references, not Authority. Commit B1's sighted preregistration as instructed. Order: the hook PR first (it gates the calibration launch), then the rest.
