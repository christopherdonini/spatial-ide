*Custodian's filing note (2026-11-15): the scripted re-read of PR B's form, Amendment 15 item 7 (OPEN-1 (a)), at main 2abf3ea087cb53cf5cbb57b844f7c2ad6a92a89a and PR B's branch head 31cf0e22713e7e3264ed843425ef3686775d7e47, made before the merge of that main into the branch. The custodian's script, read only, 7137 bytes, sha256 fbd42d41a69121de35bb259e4f31aef88abfa180404ec674393e107b16508b9c, printed the text below (9148 bytes, sha256 9cbf55f6402801d7f0d06aea8249ac9ad674cd6847c56daaf903ffcfde4d14a5). It is filed with one change, the custodian's: each pin is written as its path in backticks followed by its lines, not as a path and line cite, because the lines are those of each pin's own commit. Part (c) is beyond OPEN-1 (a).*

# PR B re-read at main 2abf3ea0 (OPEN-1 (a), Amendment 15 item 7)

Main: 2abf3ea087cb53cf5cbb57b844f7c2ad6a92a89a. Branch head: 31cf0e22713e7e3264ed843425ef3686775d7e47. Base: 08ce993532d483f87ca0c50c2ee4e64f5863f020. Form at main: sha256 9a69aac3c799d9f10a4e0928667c2f9e53debf691a55d7d049b3d869e463975f.

## (a) Paths main changed from the base, against PR B's list and the pinned paths

- Main changed 140 paths from the base; outside governance/, state/ and site/: 40.
- PR B's branch changes 49 paths from the base. Section 2.6's PR B list, parsed: 20 paths. Records named: 4. Paths pinned anywhere in the form: 108.
- Main's changes in the branch's changes: none.
- Main's changes in section 2.6's PR B list: none.
- Main's changes in the records: `KNOWN-LIMITATIONS.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`.
- Main's changes in the pinned paths: `KNOWN-LIMITATIONS.md`, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, `frontends/shell/MANUAL-WALKTHROUGH.md`, `frontends/shell/src/publish/PublishDialog.tsx`, `governance/forms/frontends/PUBLISH-APPROVAL-CONSULT-GATE-FINDINGS-PREREGISTRATION.md`, `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, `kernel/src/project/mod.rs`, `kernel/src/skp.rs`, `protocol/skp/SKP-V0.md`, `state/consults/2026-11-14-b1-shell-half-pr-b-colour-by-part-1-again-built-worker-report.md`.

## (b) Amendment 14 item 1's 19 interface pins and pin 39

| # | Pin | At its commit | At main | At the branch head |
|---|---|---|---|---|
| 1 | `state/directives/2026-11-12-third-message-open-3-a-gates-now-typed-check-reading-rule-first-look-s1-publish-approval-s2-second-open-rulings-308-restore-item-47-floor-order.md` lines 21 @ 54ee3522 (A14) | hash equal | Same | Same |
| 2 | `governance/forms/frontends/PUBLISH-APPROVAL-CONSULT-GATE-FINDINGS-PREREGISTRATION.md` lines 95-98 @ 54ee3522 (A14) | hash equal | Same | Same |
| 3 | `frontends/shell/src-tauri/src/publish.rs` lines 1945-1948 @ 54ee3522 (A14) | hash equal | Same | Same |
| 4 | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md` lines 228-229 @ 54ee3522 (A14) | hash equal | Same | Same |
| 5 | `frontends/shell/src/publish/PublishPanel.tsx` lines 472-474 @ 54ee3522 (A14) | hash equal | Same | Same |
| 6 | `frontends/shell/src/publish/client.ts` lines 132 @ 54ee3522 (A14) | hash equal | Same | Same |
| 7 | `frontends/shell/src-tauri/src/commands.rs` lines 581-583 @ 54ee3522 (A14) | hash equal | Same | Same |
| 8 | `frontends/shell/src-tauri/src/publish.rs` lines 592-597 @ 54ee3522 (A14) | hash equal | Same | Same |
| 9 | `frontends/shell/src-tauri/src/publish.rs` lines 711 @ 54ee3522 (A14) | hash equal | Same | Same |
| 10 | `frontends/shell/src-tauri/src/publish.rs` lines 322-331 @ 54ee3522 (A14) | hash equal | Same | Same |
| 11 | `frontends/shell/src-tauri/src/publish.rs` lines 697 @ 54ee3522 (A14) | hash equal | Same | Same |
| 12 | `frontends/shell/src/publish/types.ts` lines 48-51 @ 54ee3522 (A14) | hash equal | Same | Same |
| 13 | `frontends/shell/src/publish/PublishDialog.tsx` lines 261-264 @ 54ee3522 (A14) | hash equal | Moved to 262-265 | Same |
| 14 | `frontends/shell/e2e/publish.mjs` lines 363-369 @ 54ee3522 (A14) | hash equal | Same | Same |
| 15 | `frontends/shell/e2e/publish.mjs` lines 379-383 @ 54ee3522 (A14) | hash equal | Same | Same |
| 16 | `state/consults/2026-11-12-b1-shell-half-pr-b-publish-approval-colour-by-column-architect-consult.md` lines 145 @ 54ee3522 (A14) | hash equal | Same | Same |
| 17 | `frontends/shell/src-tauri/src/publish.rs` lines 1299-1307 @ 54ee3522 (A14) | hash equal | Same | Same |
| 18 | `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md` lines 118 @ 54ee3522 (A14) | hash equal | Same | Same |
| 19 | `frontends/shell/src-tauri/src/publish.rs` lines 320-321 @ 54ee3522 (A14) | hash equal | Same | Same |
| 20 | `protocol/skp/SKP-V0.md` lines 1272-1280 @ b7b721eb (pin 39) | hash equal | Moved to 1280-1288 | Same |

Tally at main: Same 18; Moved to 262-265 1; Moved to 1280-1288 1.

## (c) Beyond OPEN-1 (a): the form's other pins on a path main changed (50)

| # | Pin | At its commit | At main |
|---|---|---|---|
| 1 | `protocol/skp/SKP-V0.md` lines 1149-1171 @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e | hash equal | Moved to 1178-1200 |
| 2 | `protocol/skp/SKP-V0.md` lines 1179-1181 @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e | hash equal | Moved to 1208-1210 |
| 3 | `protocol/skp/SKP-V0.md` lines 1196-1211 @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e | hash equal | Moved to 1225-1240 |
| 4 | `protocol/skp/SKP-V0.md` lines 83 @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e | hash equal | Moved to 89-89 |
| 5 | `kernel/src/skp.rs` lines 83-94 @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e | hash equal | Same |
| 6 | `protocol/skp/SKP-V0.md` lines 1245-1256 @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e | hash equal | Changed |
| 7 | `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` lines 175 @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e | hash equal | Same |
| 8 | `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md` lines 177 @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e | hash equal | Same |
| 9 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 1927 @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e | hash equal | Moved to 1930-1930 |
| 10 | `KNOWN-LIMITATIONS.md` lines 72-77 @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e | hash equal | Changed |
| 11 | `KNOWN-LIMITATIONS.md` lines 70 @ 4b26d27905dd93d5c7453da67ee0d93ec8d4313e | hash equal | Same |
| 12 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 1927 @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f | hash equal | Moved to 1930-1930 |
| 13 | `KNOWN-LIMITATIONS.md` lines 407 @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f | hash equal | Moved to 444-444 |
| 14 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 1970 @ 858092e340ac650822afea87b50b3ce00e50bd40 | hash equal | Changed |
| 15 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 1972 @ 858092e340ac650822afea87b50b3ce00e50bd40 | hash equal | Changed |
| 16 | `KNOWN-LIMITATIONS.md` lines 411 @ 858092e340ac650822afea87b50b3ce00e50bd40 | hash equal | Moved to 459-459 |
| 17 | `KNOWN-LIMITATIONS.md` lines 415 @ 858092e340ac650822afea87b50b3ce00e50bd40 | hash equal | Moved to 463-463 |
| 18 | `KNOWN-LIMITATIONS.md` lines 190 @ 858092e340ac650822afea87b50b3ce00e50bd40 | hash equal | Moved to 215-215 |
| 19 | `KNOWN-LIMITATIONS.md` lines 72-81 @ b7b721eb | hash equal | Changed |
| 20 | `KNOWN-LIMITATIONS.md` lines 80 @ b7b721eb | hash equal | Changed |
| 21 | `kernel/src/project/mod.rs` lines 354-375 @ b7b721eb | hash equal | Changed |
| 22 | `KNOWN-LIMITATIONS.md` lines 78 @ b7b721eb | hash equal | Same |
| 23 | `protocol/skp/SKP-V0.md` lines 1170-1192 @ b7b721eb | hash equal | Moved to 1178-1200 |
| 24 | `protocol/skp/SKP-V0.md` lines 1200-1202 @ b7b721eb | hash equal | Moved to 1208-1210 |
| 25 | `protocol/skp/SKP-V0.md` lines 1217-1232 @ b7b721eb | hash equal | Moved to 1225-1240 |
| 26 | `protocol/skp/SKP-V0.md` lines 89 @ b7b721eb | hash equal | Same |
| 27 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 1929 @ b7b721eb | hash equal | Moved to 1930-1930 |
| 28 | `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` lines 577 @ b7b721eb | hash equal | Same |
| 29 | `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` lines 1130 @ b7b721eb | hash equal | Same |
| 30 | `KNOWN-LIMITATIONS.md` lines 506 @ b7b721eb | hash equal | Changed |
| 31 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 273 @ b7b721eb | hash equal | Moved to 274-274 |
| 32 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 277 @ b7b721eb | hash equal | Moved to 278-278 |
| 33 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 469 @ b7b721eb | hash equal | Moved to 470-470 |
| 34 | `protocol/skp/SKP-V0.md` lines 1170-1192 @ 08ce9935 | hash equal | Moved to 1178-1200 |
| 35 | `protocol/skp/SKP-V0.md` lines 1200-1202 @ 08ce9935 | hash equal | Moved to 1208-1210 |
| 36 | `protocol/skp/SKP-V0.md` lines 1217-1232 @ 08ce9935 | hash equal | Moved to 1225-1240 |
| 37 | `protocol/skp/SKP-V0.md` lines 89 @ 08ce9935 | hash equal | Same |
| 38 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 1930 @ 08ce9935 | hash equal | Same |
| 39 | `KNOWN-LIMITATIONS.md` lines 507 @ 08ce9935 | hash equal | Changed |
| 40 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 274 @ 08ce9935 | hash equal | Same |
| 41 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 278 @ 08ce9935 | hash equal | Same |
| 42 | `frontends/shell/MANUAL-WALKTHROUGH.md` lines 470 @ 08ce9935 | hash equal | Same |
| 43 | `KNOWN-LIMITATIONS.md` lines 511 @ 08ce9935 | hash equal | Moved to 508-508 |
| 44 | `KNOWN-LIMITATIONS.md` lines 72-81 @ 08ce9935 | hash equal | Same |
| 45 | `KNOWN-LIMITATIONS.md` lines 80 @ 08ce9935 | hash equal | Same |
| 46 | `KNOWN-LIMITATIONS.md` lines 78 @ 08ce9935 | hash equal | Same |
| 47 | `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md` lines 22 @ 08ce9935 | hash equal | Same |
| 48 | `state/consults/2026-11-14-b1-shell-half-pr-b-colour-by-part-1-again-built-worker-report.md` lines 209-213 @ ddb38739 | hash equal | Same |
| 49 | `state/consults/2026-11-14-b1-shell-half-pr-b-colour-by-part-1-again-built-worker-report.md` lines 213 @ ddb38739 | hash equal | Same |
| 50 | `state/consults/2026-11-14-b1-shell-half-pr-b-colour-by-part-1-again-built-worker-report.md` lines 250 @ ddb38739 | hash equal | Same |

Tally at main: Moved 21; Same 20; Changed 9.

RR-OK
