Question round 42 — 2026-10-03 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 3 items, asked in one call. RED LINE items: 1. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. RED LINE (ADR-017 exposure review). Your "Take C8" in round 41 was ruled on context I gave you, and that context left out ADR-017's own answer. ADR-017's 2026-08-07 clarification settles whether the "developer/test tooling" condition has lapsed. Its 2026-08-17 completion discharges the condition for the shell's UI surface only, and keeps `publish-bundle` as developer/test tooling (a CLI). C8, now in #166, calls publish-bundle a "product caller" and still says the lapse question is open. My suggested rewording names two callers, both through the permission boundary: the shell's binding_publish_* commands (the UI surface the 2026-08-17 review discharged), and publish-bundle (developer/test tooling under that review). It drops the open-question sentence. To apply it, type "Take the rewording", or your own wording, in Other. The options below only hold.
  (1) Hold #166 unmerged — #166 waits until you rule on C8's wording (typed).
  (2) Keep C8; revisit 10-09 — C8 stays as ruled in round 41. #166 can merge, and the wording comes back at the weekly window.

---

2. Lead-data pilot, §5 stop rule: the pilot stops if "a gate finds the index wrong twice". #166's gate-1 architect found the index wrong once (Proposed ADRs listed as governing), during the setup. That same architect suggests excluding the setup from §5's measurement, since its cost is reported separately (C4). Does this finding count toward the stop rule?
  (1) Exclude the setup (Recommended) — The count starts at 0 with node 9, the first measured piece. The finding stays in the trial log.
  (2) Count it — One of the two allowed is used. A second index-wrong finding stops the pilot.

---

3. The write audit you ruled primary (round 41, item 3) runs from my session's scratch space today, so a new session wouldn't have it. Proposed node subagent-write-audit-script would put it under scripts/hooks/ with tests: governance lane, a five-line form, reviewer gate, about 60 min. Its paths don't overlap node 9's. Place it?
  (1) Place it next (Recommended) — It starts in the next free slot, beside node 9 under the two-pieces limit.
  (2) Leave it proposed — The scratch script stays the check until you place it. A new session would have to rebuild it from the node's description.
