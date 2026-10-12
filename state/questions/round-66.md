Question round 66 — 2026-10-07 (custodian → human; written by the round-mirror hook from the AskUserQuestion call). 4 items, asked in one call. RED LINE items: none. AskUserQuestion is the answer channel; this mirror is read-and-copy.

---

1. Milestone 1, OPEN-1 (form frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md): DescribeSummary renders from AdmissionPanel's own state (the open attempt), so it cannot move to the Inspector's Source section without an AdmissionPanel edit. (A) App renders it from the dataset on the map; AdmissionPanel loses one line; KNOWN-LIMITATIONS 18 retires; two regression.mjs absence checks are re-aimed and walkthrough row B2's 'No summary' changes meaning. (B) A React portal from AdmissionPanel into Source; the binding stays on the open attempt, item 18 stands, milestone 2 rebinds it. (C) The summary stays in Layers for milestone 1, against the plan's §13 item 3. The architect recommends (A): it is your own rule that fact displays bind to the dataset on the map, and it removes a known limitation.
  (1) (A) Bind to the map (Recommended) — App renders the summary from the dataset on the map; KNOWN-LIMITATIONS 18 retires; the two absence checks and row B2 are updated.
  (2) (B) Portal, rebind later — The summary moves by portal, still bound to the open attempt; milestone 2 rebinds it.
  (3) (C) Stay in Layers — The summary stays in Layers for milestone 1.

---

2. Milestone 1, OPEN-2: the plan's action registry lists open dataset and export, but in milestone 1 nothing except their own panel buttons would call them (the command bar is milestone 3), so the caller rule bars registering them now. (a) Register only the three panel toggles and Zoom to layer (which the Layers row calls); open and export join in milestone 3. (b) Expose both now with new shortcuts, adding behaviour the plan does not name. (c) You name milestone 3 as their pre-committed consumer, and only their ids and labels land now. The architect recommends (a).
  (1) (a) Toggles and zoom only (Recommended) — Open and export join the registry in milestone 3.
  (2) (b) Expose with shortcuts — Both get new shortcuts now.
  (3) (c) Ids now, milestone 3 consumer — Ids and labels land now, with milestone 3 named as their consumer.

---

3. Milestone 1, OPEN-3: with Style on its own tab, the existing style.mjs end-to-end suite's real clicks on the style controls fail unless the Style tab is active first, and no selector change can fix that (the plan limits e2e changes to selectors). (a) Add one step to style.mjs that clicks the Style tab through the real UI (it also exercises the tab). (b) An instrumented-build hook that sets the layout. The architect recommends (a).
  (1) (a) One Style-tab click (Recommended) — style.mjs gains one real click on the Style tab before its style steps.
  (2) (b) Instrumented hook — A test-build hook sets the layout instead.

---

4. Milestone 1, OPEN-4: the P6 wording. The strings are the region, tab and section headings (Layers, Map, Inspector, Layer, Style, Source, Filter, Export, Activity, Console, Notices), the toggle labels, the empty-Inspector text, the export label 'Export interactive map' with a one-line purpose, the watcher item's texts, the console row statements and the banner colours. (a) Sight the plain names now so the build ships without markers; the purpose line, colours and watcher texts at the sitting; the export label renames the disclosure and the 'Publish...' button, while 'Published.' and the approval dialog stay. (b) Ship everything as markers and sight all of it at the sitting. The architect recommends (a), and notes the purpose line must not overclaim (a bundle is served over HTTP).
  (1) (a) Plain names now (Recommended) — The names above are sighted now; purpose line, colours and watcher texts at the sitting; the button follows the export label.
  (2) (b) All at the sitting — Every new string ships as a P6 marker and is sighted at the sitting.
