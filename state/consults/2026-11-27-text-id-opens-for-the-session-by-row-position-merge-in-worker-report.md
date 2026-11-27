# Text-id's merge-in of the identity route's corrected head, the worker's report

*Filed by the custodian, 2026-11-27. The merge of the form's Amendment 11 (ADV-2026-11-27-19), made in D:/wt/textid from ebf961d31fe959fc4dc42cef6827f78152aca0db, with no app, dev server, e2e suite, cargo test or clippy started. A sonnet worker made it. Its run, from its completion notice only (ADV-2026-11-26-02), was 33 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (4965 bytes, sha256 86c001488615b3a8f96496fad953234b178be81cb3b29f0c6fc89e7a89ee94d6), byte for byte. Its account is the worker's. The custodian checked the head, its two parents, the count and the resolved line's hash by git. No gate-log row: this is a merge-in, not a gate.*

---

fc6d4b0098a08bc554f7f3ce15a1aa89564925cb pushed; every step completed (merge, resolution, all checks, push).

MERGE: fc6d4b0098a08bc554f7f3ce15a1aa89564925cb. Parents: ebf961d31fe959fc4dc42cef6827f78152aca0db and 7fa66a68a811cc20e09bf3251d0cb34d422fc81e. Subject: chore: text-id takes in the identity route's corrected head 7fa66a68 (ADV-2026-11-27-11 item 1). The tree was clean at the start and after the commit.

CONFLICTS: one, in KNOWN-LIMITATIONS.md (UU). Nothing else conflicted. The auto-merged files were engine/src/identity.rs, the walkthrough, e2e/README.md, AdmissionPanel.tsx, skp/types.ts, SKP-V0.md and protocol/skp/src/v0/mod.rs.

RESOLUTION: one script (D:/wt/textid-logs/resolve-kl-1.mjs), no hand edit. Every refusal condition held. The resolved comment line, verbatim, is:
   <!-- The sentences of the "On `main`" paragraph from "For a file that opened this way with Open GeoParquet" to "is not offered the declaration." are the advisor's words under item 2 of the human's delegation of 2026-11-13 (ADV-2026-11-23-26 item 2, D4), not the human's. Two sentences of the paragraph are replaced as the human approved on 2026-11-26 (ADV-2026-11-23-34 item 5), by "This and the choice below are the only cases in which a row position stands in for identity." and by the three sentences from "A file whose `id` column cannot serve is still refused, and the app then offers" to "refuses the column and asks again.", in which the words "the app" are the advisor's (ADV-2026-11-26-20 item 2 (1)). The last sentence, "A file opened by that choice with Open GeoParquet is offered the declaration in the same way.", is D5 of ADV-2026-11-23-36 item 5: the advisor's, not the human's. Every other sentence of the paragraph is the human's and is untouched. The offer is `identityDeclarationOffer` in frontends/shell/src/admission/AdmissionPanel.tsx; the list it offers is carried by `describe_dataset` in kernel/src/skp.rs as the member `candidate_columns` of `describe.identity` (skp/0.15). -->
   sha256 (line plus LF) ae4194485b13a1609d12c817c9536cb4a9f680701e68db674434ae4ae1a3252c, which matches the pinned value.

CHECKS (counts by script, run at the merge commit; log files are in D:/wt/textid-logs/):
- D2 New span ("with the column you choose. The filter"): 1 in AdmissionPanel.tsx, 1 in the walkthrough.
- Removed clause ("checks that column across the whole file. The filter"): 0 in both.
- Row I8 New note (ADV-15 item 2's New): 1 in the walkthrough. Its Old: 0 in the walkthrough and in AdmissionPanel.tsx.
- ADV-19 item 2: each of the three New texts stands once in KNOWN-LIMITATIONS.md. The first and second Old stand 0 times. The third Old stands once, inside its own New.
- diff --stat ebf961d3 HEAD: 13 files changed, 151 insertions(+), 32 deletions(-). KNOWN-LIMITATIONS.md is 2 +-. The diff of KNOWN-LIMITATIONS.md is one changed comment line, and the paragraph line is unchanged.
- cargo fmt --all -- --check: exit 0.
- verify-cites: exit 0. "verify:cites PASS — every rooted (in-tree) path:line reference across 3809 file(s) resolves. (240 loose reference(s) advised above.)"
- verify-quotes: exit 0. "verify:quotes PASS — 161 checked, 130 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 948 ruling cites resolved, 0 ruling-cite errors."
- npm ci in renderer/bundle-viewer and in frontends/shell: exit 0 and exit 0 (the second pair of runs, under one hold).
- npm run typecheck: exit 0.
- npm test: exit 0, "Tests 1697 passed (1697)".
- cargo check --workspace --all-targets: exit 0, "Finished `dev` profile ... in 30.12s".
- Disk before the heavy runs: 41299 MB free, then 41266 MB, which is above the 40960 floor.

DEPARTURES:
1. I first ran the bundle-viewer npm ci in a hold call that had the command inside parentheses and no release step. That is not the required shape. I released the hold afterwards. The release printed MACHINE_NOT_HELD, so the hold had probably already lapsed. The npm ci was then re-run in the proper shape together with the rest of the shell run, so the exit codes above are from the proper runs.
2. I ran verify-cites and verify-quotes outside a hold. They are not heavy: they use one process and no timed measurement, though verify-quotes took about 10 minutes.
3. Each hold ran a small bash script from the logs folder (shell-run-2.sh, cargo-run-3.sh) as its command, because one hold had to cover several commands.
4. The merge-in changed nothing beyond the one resolution. I started no app, dev server or e2e, and ran no cargo test or clippy.

SELF-CHECK:
- Cross-module code uses the interface the other side exposes: nothing new landed, as this is a merge-in.
- Each completion claim points to a log or output that proves it.
- No operator-visible message was written.
- The tests were run to their assertions: 1697 passed.

I ran as Sonnet 5.5 (claude-sonnet-5-5) with no model override and no context handoff.
