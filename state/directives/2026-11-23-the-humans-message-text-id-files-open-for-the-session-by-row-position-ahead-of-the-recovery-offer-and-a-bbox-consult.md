# The human's message of 2026-11-23: a lab finding on files refused for a text id; a second choice in the identity form, opening the file for the session by row position; prepared now, second in the order; a consult on files with no covering bbox, typed in the custodian's session

*The human's own words, typed in the custodian's session: enqueued at 2026-11-23T20:56:56.672Z by the custodian's transcript (its queue record), and its user record at 2026-11-23T20:56:56.849Z, origin human, the same text; filed byte for byte below the rule, 1476 bytes, sha256 3454e81fbbe6d3293adfe70cb4327a7b9a548733a1a01a153b9df391d3d26499, with one final newline added. Nothing is changed. The numbers in item 1 are the human's, from work outside the repository, and are a lead, not gate evidence (its own words); nothing of that work is in the repository.*

---

To the custodian, 2026-11-23. The advisor reads this as filed and places it. A finding from lab work of mine outside the repository; it is a lead, not gate evidence.

1. The finding. In a sample of 28 published GeoParquet files, 12 are refused only because their `id` column is text: all four Overture files, the Swiss field boundaries and others. A file with no `id` column opens on the session tier. A file with a text `id` cannot open at all unless it happens to hold a unique 64-bit integer column, and 10 of the 12 hold none.
2. What I want. When a file's own `id` column cannot serve, the identity form offers a second choice: open the file for this session only, identified by row position, exactly as a file without an `id` column opens today. Chosen by the user, never taken silently; the summary says so; nothing of it is saved or published.
3. How. The architect first confirms the behaviour on main with a generated file that has a text `id`, then drafts the amendment to ADR-016 that this needs, as a draft for my approval. The piece is prepared now. In my order of 2026-11-23 it goes second, after the re-link and ahead of the recovery offer.
4. A second lead, for an architect's consult only, no piece yet: 16 of the 28 files carry no covering bbox, so they show the first look and refuse every load by view. Say what it would take to load such a file by view, and how that relates to the LOD tiers.
5. Nothing from the lab folder is copied into the repository.
