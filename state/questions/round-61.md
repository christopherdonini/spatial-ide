Question round 61 — 2026-10-05 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 3 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Round 61, item 1 — RED LINE (user-visible behaviour not already ruled; type your ruling via Other). MP-1, OPEN-2 (form engine/MULTIPOLYGON-MP1-PREREGISTRATION.md, Amendment 2, item 2). A GeoParquet file whose geometry_types is present but not a list (a string, a number, an object, or JSON null). On main today such a file opens as geoarrow.polygon and, if projected, publishes. Round 59 ruled the absent key (b1) and a non-string member (c1), not this case. Phase A refuses it at open. Options: (A) refuse at open as engine.geo_metadata with a P6-placeholder detail — RECOMMENDED: it states only what the engine met, matches your (c1), and keeps declared_types the file's own fact; cost: a malformed file that opens today stops opening (no writer known to produce one; not searched); (B) treat it as an absent key (MultiPolygon encoding, declared_types null — the wire would claim the key was absent); (C) treat it as an explicit [] (MultiPolygon, declared_types [] — reports a declaration the file never made); (D) JSON null as (B), every other non-list value as (A); (E) keep today's geoarrow.polygon — contradicts ADR-034 Decision 2. Waits on it: only MP-1's PR ready state and final gate; phase B's code proceeds now with the arm held as built.
  (1) Hold — Keep OPEN-2 open; phase B continues, the PR is not set ready.
  (2) Hold for Fable's read — Keep OPEN-2 open until Fable has read Amendment 2.

---

2. Round 61, item 2 — compaction-record-and-resume-line (PR #181), OPEN-1 (not a red line). The context-flush direction starts the compaction measure at the first automatic compaction after #181 merges; the product-first direction reduces the 2026-10-09 window to section 6's measures and product blockers. When are the measure's rows first reported?
  (1) At the 2026-10-09 window (Recommended) — Report the rows there, read as a measure you named; it costs only rows, and piece B reads the same compactions.
  (2) After the freeze lifts — Let the rows accrue in the window draft and report them at the first window after the freeze.

---

3. Round 61, item 3 — PR #181's form makes two readings you may overturn: (1) a PreCompact call whose trigger is absent or unrecognised is recorded and allowed, not blocked (cost: if a build ever stopped sending trigger, a manual /compact would no longer be blocked; it would show as trigger: null in the record); (2) the AUTONOMY section 7 correction also carries the hook's at-or-after-the-last-ledger-change clause and the SessionStart bullet's resume line, all within existing lines. Keep both?
  (1) Keep both (Recommended) — Both readings stand as built in #181.
  (2) Overturn one or both — Say which via Other; the change enters #181 as an amendment and a fix before the merge.
