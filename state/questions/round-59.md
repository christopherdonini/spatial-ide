Question round 59 — 2026-10-05 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 4 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Round 59, item 1 — RED LINE (scope of a ruled item; type your ruling via Other). kernel-close-races-followups, OPEN-1 (form kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md). The routed items fix stale cites and a false 'only site' claim in six files. The same defects also sit in files the routed items do not edit: liveTicketSet.ts (lines 35-38 say EngineSource::next_into is the single place the engine-code prefix is applied — the defect this piece fixes in formatTerminalRefusal.ts; lines 71-72 and 90 cite stale skp.rs lines, one naming a mint-race arm close-races removed), plus stale skp.rs line cites in tileViewportStreamManager.ts and its test, App.tsx, pool_poll.rs, src-tauri lib.rs, admission_p4_corpus.rs and no_generation_in_persisted_artifacts.rs. Options: (A) none — route them all to a new proposed node; (B) liveTicketSet.ts only (about 16 lines), route the rest — RECOMMENDED, because otherwise the shell's two docs contradict each other after this piece; (C) all of them (about 9 more files, about 60 lines). Waits on it: the piece's branch (the form is written for B, its rows marked conditional).
  (1) Hold — Keep OPEN-1 open; the branch does not start.
  (2) Hold for Fable's read — Keep OPEN-1 open until Fable has read the form.

---

2. Round 59, item 2 — RED LINE (a stated SKP guarantee; type your ruling via Other). kernel-close-races-followups, OPEN-2. SKP-V0 §1's close_dataset paragraph says each live stream's registry entry holds its own Arc<Dataset> clone, so the dataset outlives its last stream. The code holds the dataset by name (TicketState), and no stream holds an Arc<Dataset>; an in-flight pool lease keeps the pool alive (the catalog form's reading). No code changes. Options: (A) correct §1's sentence in place, under one dated §8 note bound to the catalog form's reading — RECOMMENDED: the sentence is false as a description, and §8's own rule keeps §§1-7 as the current shape (the 2026-10-02 note is the precedent); (B) a §8 note only, which flags the sentence and leaves §1 unchanged; (C) take the item out of this piece into its own node. Waits on it: C9's in-place sentence and its note, §1's may-claim, §8 item 10.
  (1) Hold — Keep OPEN-2 open; the branch does not start.
  (2) Hold for Fable's read — Keep OPEN-2 open until Fable has read the form.

---

3. Round 59, item 3 — kernel-close-races-followups, OPEN-3 (not a red line). The recorded-mutation comments of T1 to T3 in kernel/tests/session_generation.rs name no observation commit, and T1's describes the create_from_ticket arm as it was before #147. No gate or worker routed them here. Which way?
  (1) Unchanged, routed (Recommended) — Declare them unchanged in this piece and route them to a candidate node; their claims still resolve through the composition PR #147's gate-1 N3 describes.
  (2) Re-observe in this piece — Re-observe all three at the base commit in B1's K-row shape, naming the commit; adds about 20 lines.
  (3) Hold — Keep OPEN-3 open; the branch does not start.

---

4. Round 59, item 4 — RED LINE (user-visible behaviour not already ruled; type your ruling via Other). MP-1, OPEN-1 (form engine/MULTIPOLYGON-MP1-PREREGISTRATION.md). Your round-17 ruling settles an explicit empty geometry_types: the MultiPolygon encoding and declared_types: []. Two cases remain. (b) The key is absent — today it admits as Polygon. (b1) treat it as the empty list for the encoding (MultiPolygon), with declared_types: null on the wire, so the wire still tells absent from [] — RECOMMENDED; its cost: a projected, Polygon-only file with no key, which publishes today, is refused until B3, extending your acceptance item 1's loss to a second case. (b2) treat it as empty and send declared_types: [] — rejected by the architect (it presents a missing key as a declaration). (b3) refuse at open by name (GeoParquet 1.x requires the key; a new refusal). (c) A member is not a string — today it is dropped silently, so ["Polygon", 5] admits as Polygon. (c1) refuse at open as engine.geo_metadata, with a P6-placeholder detail — RECOMMENDED; (c2) keep the silent filter — rejected; (c3) treat the whole list as absent, i.e. (b)'s answer. Waits on it: the parse change, declared_types' wire type (frozen at merge), and five rows. No slot is free, so ruling now costs no time.
  (1) Hold — Keep OPEN-1 open; MP-1 cannot start code without it.
  (2) Hold for Fable's read — Keep OPEN-1 open until Fable has read the form.
