# The .spatial check: whether a common application claims the .spatial extension (custodian, web search)

*Custodian's record (2026-10-21): ADR-036 ruling 2 asks, before acceptance, for a check that no common application claims .spatial (`state/directives/2026-10-09-adr-036-ten-findings-rulings.md`, item 2). The acceptance consult found it not on record (`state/consults/2026-10-21-adr-036-acceptance-architect-consult.md`). This is that check, made with the session's web search tool; the queries are as typed, and the results are summarised, not quoted.*

## Queries

1. `".spatial" file extension which application opens it`
2. `.spatial file format Apple visionOS OR Unity OR "spatial" extension registered`
3. `"SPATIAL file" extension fileinfo OR filext OR file-extensions.org`

## Result

- No result names an application that claims or opens a `.spatial` file. The results were other extensions or the word used generally: `.spm` (Spatial Manager Desktop), `.sp4`, `.saif`, `.sbn`, `.qix`; Apple and Unity visionOS pages naming no `.spatial` type, with a third-party viewer using `.ply` and `.spz`; GIS import pages (Tableau, Zoho Analytics, Redpoint) listing `.shp`, `.geojson`, `.topojson`, `.kml`, `.tab` and others, and none listing `.spatial`.
- **Not checked:** the IANA media-type registry, Apple's uniform type identifiers, and the file associations on any machine. A web search finds what is published and indexed; it cannot show that no application anywhere uses the extension. It answers "common" as the ruling asks, and no more.

## Sources (as the search returned them)

- https://help.spatialmanager.com/document/spm-desktop/guide/maps/open/
- https://filext.com/file-extension/SP4
- https://filext.com/file-extension/SAIF
- https://www.file-extensions.org/extension/sbn
- https://docs.unity3d.com/Manual/visionOS.html
- https://radiancefields.com/spatial-fields-free-apple-vision-pro-3dgs-with-sh
- https://help.tableau.com/current/pro/desktop/en-gb/examples_spatial_files.htm
- https://www.zoho.com/analytics/help/import-data/files/spatial.html
- https://docs.redpointglobal.com/rpdm/spatial-input
