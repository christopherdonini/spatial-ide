Question round 25 — 2026-09-26 (custodian → human). Four items, in ask order. Item 4 is a RED LINE (public exposure). This is the weekly window, due 2026-09-25 and raised a day late while wave 1 ran.
- Two findings from that list need no question. The gate-log node id that differs from its PLAN id was ruled in round 23, item 4 (O4). The gap where a claim marked superseded with no replacement passes is disclosed in scripts/plan/README.md by #125.
- The rest are below.

---

1. Small defects and flakes, each to be filed as a proposed PLAN node with its own brief (none is a cut):
  (a) two timing tests flake under CI load and pass on rerun: skp_admission's cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock (not the ticket-drop defect), and cancelling_mid_publish_leaves_no_bundle_and_no_staging_directory;
  (b) verify-mutation's own tests leave their mkdtemp directories behind (about 263 per run; the temp folder holds thousands);
  (c) extent.ts's doc drifted from its degenerate-zoom behaviour;
  (d) Catalog::open drops a replaced dataset while holding the catalog write lock (wave-1 A2 observation 5 found it too);
  (e) verify-quotes --show-cites, when narrowed, prints false FAILs;
  (f) ADR-023 section 2's widenings sit uneasily beside ADR-021's notes: an architect consult says whether a note is owed, and any ADR text stays yours.
  (1) File all six as proposed PLAN nodes (Recommended).
  (2) Hold.

---

2. Process proposals (the record cap allows them weekly). Each would be one governance docs piece, gated as usual:
  (a) the preregistration template gains two classes: a full form's section-7 budget overrun (today recorded as class 2, by round 23, item 4, O7), and a scope addition on a standing rule (today class 5 as the nearest, as in the watcher's Amendment 4);
  (b) gate reports get their own directory, state/consults/gates/, treated like state/drafts/ (their cites advisory): they cite branch-only lines, and today each needs a disclosed rewrite before it can be filed on main;
  (c) a wording rule: verify-mutation checks that a mutation is recorded and runs none, so no record may call its run an observation of a mutation (the watcher's Amendment 3 item 5 did);
  (d) a superseded test-text span on an unmerged branch is named by its commit id until merge, and its hash pin follows on main (the tension between the class-3 test-text row and round 15 (e));
  (e) the #116 architect's note: when a piece's Out-of-scope line names a section-21a category at dispatch, the piece takes the full form.
  (1) Adopt all five (Recommended).
  (2) Hold; asked item by item next round.

---

3. B1's build. The ruled order is that B1 merges after the watcher (RULED night (2)), and B1's preregistration is on main (#121). The watcher is at its second gate. B1 touches the same protocol literal and fixtures the watcher moves to skp/0.5.
  (1) B1's build starts after the watcher merges, so it builds on skp/0.5 directly (Recommended).
  (2) B1's build starts now on its own branch, and takes the watcher's merge in by a signed-off merge commit.

---

4. RED LINE — public exposure. v0.1.0 bundles are already public, and the bundle-viewer fix (bundle-viewer-partition-offset-bounds, building now) cannot reach them: a published bundle's viewer is a frozen copy. The piece adds a KNOWN-LIMITATIONS line, marked DRAFT for your wording at the PR. The effect of a crafted bundle is a stalled tab on the recipient's side: no data exposed, no code executed.
  (1) The KNOWN-LIMITATIONS line plus the next release's notes; nothing more (Recommended; the architect's recommendation).
  (2) Also publish a GitHub security advisory for v0.1.0.
