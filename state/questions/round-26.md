Question round 26 — 2026-09-26 (custodian → human). Four items, in ask order. Item 2 is a RED LINE (licensing, ADR-009). Four PRs also wait for your click, each by merge commit: #127 first, then #128 (after I fill its KNOWN-LIMITATIONS number and apply your wording), #129 and #130.

---

1. corpus-reproducibility-record, the draft's readings. The build runs now on a local branch that is not pushed; nothing is published until you rule here and sight the licence table. The readings:
  (a) MANIFEST.json's observed blocks (schema names, extents, row counts) are metadata, not data, so the manifest is tracked byte-identical;
  (b) an open licence is one the primary source names that is also on the OSI or Open Definition list;
  (c) the reproducible set is the files a later tool may fetch or regenerate off this machine; commands and hashes of local-only files are tracked anyway;
  (d) no SPDX header on the byte-identical script copies (it would break identity; RECORD.md states their licence);
  (e) absolute paths allowed in public copies: C:\dev\spatial-ide, C:\Program Files\QGIS 3.44.2, C:\OSGeo4W, C:\Windows, a bare C:\;
  (f) PR #124 stays held, its fate decided after this piece merges;
  (g) no byte-reproducibility regeneration test now.
  (1) Adopt (a) to (g) as drafted (Recommended).
  (2) Hold; asked item by item next round.

---

2. RED LINE — the licence of the project-generated corpus files. #1 to #10, the five mutations and retired R-1 were written by this project's own scripts (synthetic data and GDAL/QGIS conversions of it). No licence is declared for them, so under your round-24 ruling they stay local-only.
  (1) Leave them undeclared and local-only (Recommended: no licence decision is needed for the record to land).
  (2) Declare them under the repository's licence, AGPL-3.0-or-later.
  (3) Declare them CC0-1.0, as test data.

---

3. A squash merge of a PR carrying a commit-named test-text span (PR #129's open contingency). The texts ask for a history-keeping merge; the case of a squash anyway is unruled.
  (1) The row stays commit-named, the PR's ref keeping that commit reachable, and its PLAN node closes naming that (Recommended; the architect's).
  (2) Such PRs are never squashed, by ruling.

---

4. Three small defects, each to be filed as a proposed PLAN node:
  (a) spatial-data-plane is not rustfmt-clean on main (seven files, rustfmt 1.9.0), and CI runs no fmt step: a crate-wide cargo fmt piece;
  (b) main's data-plane crowded-start detail string carries two runs of spaces from a lost line continuation (operator-visible);
  (c) a pre-existing verify-cites test leaves one temp directory per run.
  (1) File all three; a CI fmt step waits for the 2026-10-02 weekly window as a process proposal (Recommended).
  (2) Hold.
