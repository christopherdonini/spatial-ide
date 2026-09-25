Question round 22 — 2026-09-25 (custodian → human). Three items, in ask order. Item 1 is a RED LINE: typed answer only. Status at filing: PR #120 (the hooks inert in cloud sessions) passed its gate and is ready for the click; A3 launches after it merges. The watcher's preregistration is committed on cut/source-change-watcher (596511b). B1's is in PR #121 (docs-only). The architects' consults are filed at state/consults/2026-09-25-source-watcher-prereg.md and state/consults/2026-09-25-b1-prereg-revision.md.

---

1. RED LINE — the watcher's stop item X1: the event payload when a generation has no session reference. ADR-035 Decision 3 leaves the form to the preregistration or to you, and the architect's candidate extends Decision 4's mint rule, which is yours. In the shipped build such a generation exists only in one race: live_or_mint minting for a dataset that close_dataset is closing (a viewport_query racing close). No code touches this point until you rule.
  Architect's recommendation: every generation carries a kernel-minted SessionRef. live_or_mint mints one that no client holds, its end still emits (every end emits, round 19 item 1), and the shell's listener drops it as a mismatch. Recorded as an appended, dated note to ADR-035's Decision 4 after #119 merges. The close race itself stays a separate node (kernel-generation-close-races, with the other ADR-035 drafter's note).
  Alternative: close the close_dataset race inside the watcher piece, so no reference-less generation exists; the drafter's race note then moves into this piece.
  Or hold.

---

2. B1's preregistration (PR #121) — its eight OPEN markers, O1–O8. B1 is blocked behind the watcher; no code touches a marked point until you rule. The architect's recommendations:
  O1 publish: keep the constant rename (MAX_PROJECTED_ATTRIBUTES) and count-first order; the bundle-format restriction runs after shared admission; every single-failure publish request keeps today's code and text, except [id] over a mapped identity if O8 goes as recommended; a new test pins the multi-failure order.
  O2 detail text for types still refused: the gate returns typed facts and each owner renders its own text; publish and filter keep today's text byte for byte; the live detail is new engine-fact text, sighted at B1's close.
  O3 projection admission runs before filter admission.
  O4 a column with no filter surrogate is refused as filter_column_not_filterable, by name, at namespace admission (replacing bind_admit's expect).
  O5 if DuckDB turns out not to order ENUMs by declared position (H4 false): the dictionary exclusion still lands as ruled, recorded as a class-2 result, with a ledger entry for your word on ADR-021's note's stated reason.
  O6 if no dictionary type is reachable from read_parquet (H2 holds): E-19's and K-9's dictionary cases are proved through their per-field functions and recorded as unreachable.
  O7 a proposed PLAN node for B1's shell half, depending on b1-engine-kernel-half and shell-redesign-map-studio.
  O8 the reserved id is recognised before the unknown-name check, so [id] over a mapped identity is refused as projection_column_is_identity (this changes publish's refusal for that one list; see O1).
  (1) All eight as recommended (Recommended).
  (2) Hold; asked item by item next round.

---

3. The withdrawn-marker's refused-line residual (for governance-test-claims-superseded-followups; PR #118's attempt-2 gates, gate-log indices 185 and 186). A line carrying the withdrawn-test marker whose reference the row grammar refuses (a range, another file's path, no commit-id rev) is never checked. It exempts nothing, since its test stays binding, but it is never named: a bad ruling or carrier on it stays silent while the test exists. The architect reads your round-20 rider (a) as governing accepted withdrawals only.
  (1) Fail by name (Recommended): verify:test-claims names each refused withdrawn-test line with the grammar's reason and exits 1. Carried by governance-test-claims-superseded-followups.
  (2) Name it as advisory, the architect's reading: printed, exit 0.
  (3) Hold.

---

Not asked, applied under existing rules (the watcher consult's X2–X4): the watcher's preregistration is committed now and its implementation merges only after #119; one PR, since no pre-commitment exists for a split under round 8; renamed shell symbols keep every existing test title byte-unchanged, with the old-to-new map in the PR body.
