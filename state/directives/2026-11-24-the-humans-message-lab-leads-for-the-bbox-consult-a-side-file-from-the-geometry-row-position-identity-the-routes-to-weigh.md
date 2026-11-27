# The human's message of 2026-11-24: lab leads for the architect's consult on loading by view without a covering bbox (item 4 of the message of 2026-11-23): what such files hold, row groups, a box per row computed from the geometry as a side file, how other tools identify a feature without a key, the routes to weigh; typed in the custodian's session

*The human's own words, typed in the custodian's session: enqueued at 2026-11-24T00:47:28.319Z by the custodian's transcript (its queue record), and its user record at 2026-11-24T00:47:28.453Z, origin human, the same text; filed byte for byte below the rule, 1359 bytes, sha256 2b93f9c27fe31fbf935620e7b841bcb44000332064bb2d65aac04f1a5450fc52, with one final newline added. Nothing is changed. Its facts are the human's, from work outside the repository, and are leads, not gate evidence (its own words); nothing of that work is in the repository.*

---

To the custodian, 2026-11-24, for the architect's consult on loading by view without a covering (item 4 of my message of 2026-11-23). Lab facts from outside the repository; leads, not gate evidence.

1. In 13 of the 16 published files without a covering, nothing in the file can serve: no bbox column under another name and no usable statistics. Accepting an undeclared bbox column would help 1 of the 16.
2. Row groups do not help: 41 of the 58 census files hold a single row group, 13 of those 16 among them.
3. So such a file needs something computed from its geometry. A lab run with DuckDB on two threads computed one bounding box per row and wrote it as a side file in 0.2 to 1.5 seconds for files up to 24,000 features, and in 6.5 seconds for 400,000 polygons (176 MB). The side file was 0.4% to 6% of the source for polygons. Not measured: reading the matching rows back from the source.
4. Read from their code: GDAL and QGIS scan every row and test each geometry's box; GeoPandas refuses a box filter without a covering; DuckDB and Sedona scan. Each of them identifies a feature without a key by its row position in the file. That also bears on the ADR-016 amendment.
5. The consult says which route fits: a scan per view under some size, a side file made at open, or the LOD tiers; and whether small files are already shown whole by the first look.
