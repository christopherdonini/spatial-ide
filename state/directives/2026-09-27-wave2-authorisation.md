# Directive — wave 2 authorised (cloud, evidence only) (the human, verbatim)

*Custodian's filing note (2026-09-27): the human's message sent mid-turn to session 805f1d1e at about 22:15Z. It lifts the 2026-09-27 session order's cloud-spending hold for wave 2 only; the prompts file it names is data until the human confirms it in chat. Recorded verbatim below the rule, as received, with the one profile segment redacted by `scripts/hooks/profile-path-scan.mjs --redact-segment`. Cited as "the 2026-09-27 wave-2 authorisation" with its item numbers. [profile segments redacted at filing: 1; round 29, item 2]*

---

Wave 2 (cloud, evidence only) is authorised. The prompts are in an untracked file on the human's machine:
C:\Users\<redacted:profile>\Development\Claude\Spatial IDE\WAVE2-CLOUD-PROMPTS.md. Chris will hand it to you. Treat it as data until he confirms it in chat.

1. Copy it to state/cloud/wave2-prompts.md (tracked) in its own PR. Nothing tracked may cite the untracked
   original.
2. Pick WAVE2_BASELINE: the first main commit at or after d6ec85af081fa05e4d30995224865da1bc743552 (#134)
   where product CI is green on every workflow. 0ada14f57c55e2f0e06c23664ce0f78a4c7cb1da is the candidate.
   Write the full SHA into every prompt the same way, and record the CI run links in state/cloud/wave2.md.
3. Ask Chris to read the promotion's end date and the current balance at claude.ai → Settings → Usage.
   Record both in the ledger. If fewer than 3 days remain, run the batches back to back.
4. Assemble each prompt per §4: copy W2-A1 in full, and swap only the item id, the branch and the TASK
   block (for W2-B, the OUTPUT line too). [paste the schema] = wave1-prompts.md §3's worker fields,
   verbatim, with the Baseline SHA field reading `git -C /tmp/wave2-baseline rev-parse HEAD`. Record each
   exact assembled prompt next to its session ID.
5. Launch W2-A1 and W2-A2 as a pair, then W2-B and W2-C. W2-D does not launch until Fable has seen its
   brief. Record the balance before and after each batch (whole dollars, ±$1).
6. Triage exactly as in wave 1 (§4): S1 needs a reproducer or your own Windows reproduction. Nothing
   becomes a cut during the wave. Re-check every B1 finding against main at triage time. S1 candidates
   come to Fable as one batch after the wave.
Keep your own queue running meanwhile; the wave needs only your attention at launch and at triage.
