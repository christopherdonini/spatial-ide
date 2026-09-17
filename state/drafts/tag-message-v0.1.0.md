> **Status: draft — the v0.1.0 tag message; superseded by tag `v0.1.0` as pushed.**
> Record, not policy — moved from the untracked `RELEASE-DRAFTS-0.1.0/` directory on the human's round-14 ruling (2026-09-17); nothing here binds, and its cites are historical (advisory in `verify-cites`, never gated).

Spatial IDE v0.1.0 — the first packaged Windows build of the Prototype hero slice

Open a GeoParquet, filter it in SQL, style it by literal, publish it as a static interactive
bundle — on Windows x64, from one unsigned per-user installer. That is the whole claim.

What is declared, not implied (KNOWN-LIMITATIONS.md at this tag):
- A file's own declared CRS is admitted as a file fact, and only if its definition establishes an
  easting-first axis order; the app carries two pinned definitions, EPSG:2056 (CH1903+ / LV95) and
  EPSG:3857 (WGS 84 / Pseudo-Mercator), which are what the assertion panel offers for a file that
  declares nothing (ADR-026). Refused by name: an absent `crs` key, an explicit null `crs` (both
  engine.crs_undeclared — GeoParquet's OGC:CRS84 default is not applied), and a latitude-first
  declared order, EPSG:4326 among them, as most public GeoParquet declares it
  (engine.axis_order_unsupported — refused, never reinterpreted; ADR-015 §5; ADR-032 filed
  Proposed, decision open).
- Styling by literal only; the hover readout shows `id` only (ADR-023). If a drag ends without a
  pointer-up or pointer-cancel event — the window losing focus mid-drag — the hover readout stops
  being restored after a camera change for the rest of the session (entry 47's preregistration,
  §12 Amendment 4).
- Publishing is a class-3, approval-gated operation with a per-user audit record (ADR-024); above
  the bundled viewer's declared ceilings it is refused at preflight, before the source is hashed
  (ADR-025; release cut item 10).
- Overview zoom shows a declared partial view (ADR-028); far past "Zoom to layer" tiles already
  drawn may vanish while still on screen — a declared exception, ADR-028's appended note of
  2026-09-09.
- Under a row filter at wide zooms, some of the view's per-tile queries are refused by
  the app's own filter-admission check and never run. The status then reports those areas as not
  loaded, which is true: any matching features there are not drawn until you pan or zoom in and
  they are queried again. The app cannot know whether those areas are empty.
- Scan progress is not shown; liveness is (ADR-029). The data-plane transport is an experimental
  default (ADR-012, Proposed).
- No editing, notebooks, MCP or AI (docs/07 Alpha items). Windows only.

No performance statement is made anywhere in this release (docs/08: no numbers, no claim).

Notices: the installed application carries NOTICE.txt beside the executable, bundle-viewer\NOTICE.txt,
and an in-app Notices view — every third-party work it conveys, including the 26 works inside
DuckDB's own amalgamated source tree, each with its licence text (ADR-030, Accepted 2026-09-09).
Licence: AGPL-3.0-or-later (core), CC-BY-4.0 (docs), DCO 1.1 (ADR-009). Corresponding Source:
https://github.com/christopherdonini/spatial-ide (AGPL §6(d)).

Installer: Spatial IDE_0.1.0_x64-setup.exe — 10,559,893 bytes — SHA-256 c3f483209341409333971b8a1695b60116763f976217d5b50264c7edd16bfb1f — built from 13471a9 on release/0.1.0
(the v0.1.0 candidate commit 998be05 plus three preregistered, gated shell fixes: the hover
readout's re-pick on camera settle; "Zoom to layer" under a row filter; the residency status under
a row filter). Verified by the operator's Part M walkthrough on a clean Windows account
(frontends/shell/MANUAL-WALKTHROUGH.md, "Part M"), reported 2026-09-13: M5–M13 on the candidate,
then M1–M5, M7, M12 mode 3, M14, M15 and the hover row re-run on this build; the rows this build's
diff does not touch stand from the candidate 998be05, with git diff --stat 998be05 13471a9 as the
proof (RELEASE-0.1.md Amendments 15–18). Release engineering record: RELEASE-0.1.md.
