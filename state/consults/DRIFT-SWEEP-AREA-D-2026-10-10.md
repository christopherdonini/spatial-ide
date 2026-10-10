# Drift sweep, run 2, area D (engine and kernel documents against the code) — 2026-10-10

Provenance. An independent, read-only agent on the Claude Platform (Claude Fable 5.1, high effort) cloned the public repository and swept the commit named in the report's first line. It changed nothing. Run figures as the platform showed them: 17 m 25 s, 22.1M input and 50.3k output tokens, US$ 11.36. The text below the rule is the agent's report as the human received it; list formatting was flattened in the copy. The advisor's checks against main are in the advisor's reply to the human, not in this file.

---

Repository: https://github.com/christopherdonini/spatial-ide — Area D (engine and kernel module docs, READMEs, kernel/CANCELLATION-AND-TRACING.md, kernel/PERMISSION-BOUNDARY.md) — commit swept: 116deb53293bb62ebbaa49ee795e3b1f0093745d (head of main)

Findings

1. engine README says an absent crs key is refused and a non-x-first source is refused; main admits both under ADR-032.

Where: engine/README.md:23-29 ("GeoParquet's specification says an absent crs key means OGC:CRS84 — this engine does not apply that default"), :438-441 ("A source with no CRS" is refused), :452-463 ("a non-x-first source is refused"); also engine/src/lib.rs:13-14 ("refuses a file that does not carry one").
Code: engine/src/dataset.rs:398-425 — an absent key under a pinned spec version admits as OGC:CRS84 with provenance crs:format-default; a declared (lat, lon) definition reaches admission carrying the format's WKB order and is admitted (engine/src/geoparquet.rs:16-23, 497-501; engine/src/error.rs:17-25). ADR-032 Accepted 2026-09-23, Decisions 1 and 3.
Why it matters: this is the README's headline admission rule; a reader would predict a refusal for most public GeoParquet that main now opens.
Confirmed.

2. engine README says a file with no id column is refused at open; main opens it on the session tier.

Where: engine/README.md:442-450 ("no 64-bit column named id … This bounds which real GeoParquet the hero slice can open … most files in the wild carry no such column").
Code: engine/src/dataset.rs:1704-1755 — admit_identity's third outcome: with no native id and no declaration, the dataset opens with identity (generation, file_row_number) (IdSource::SessionOrdinal, engine/src/identity.rs:42-55). ADR-016 Amendment 1 Accepted 2026-09-23.
Why it matters: it states a refusal the product no longer makes and a scope bound that no longer binds.
Confirmed.

3. kernel README's H2 row still describes a < 100 ms cancellation assertion on the producer's clock; the tests assert neither.

Where: kernel/README.md:331 ("H2 producer-visible cancellation < 100 ms | observed on the producer's own clock …").
Code: kernel/tests/end_to_end.rs:385-430 and :445-480 — the budget assertions were removed ("no 100 ms budget is asserted here any more (round 52, item 3)"); the tests assert observed_at >= sent_at, ≤ 1 batch after cancel and a 5 s liveness bound, and print the interval as a REPORT labelled "adapter receipt … not cancel_observed" and explicitly not ADR-018's producer-clock pair.
Why it matters: the row invites citing these tests as evidence for the docs/08 cancellation budget, which they no longer test.
Confirmed.

4. engine README and lib.rs say the engine persists nothing; the LOD tier builder writes GeoParquet tiers and a manifest to disk.

Where: engine/README.md:80 ("No persistence, no registry, no lineage, no undo, no reproducibility grade"); engine/src/lib.rs:47-50 ("No persistence … The moment anything here caches to disk … docs/11's ResourceRef model and kernel/ are owed").
Code: engine/src/lod.rs:9-14, 151, 1152-1154, 1236, 1399 — build_tiers creates spatial-ide/tiers/<hash>/, writes one parquet file per tier via ArrowWriter and a manifest. (The README's index paragraph at :240-242 remains true of the index.)
Why it matters: the sentence is the trigger the docs name for docs/11 and ADR-005 obligations; a reader would conclude they are not yet owed by this module.
Confirmed.

5. engine README's attribute admission set excludes Float32 and refuses dictionaries; the engine admits both.

Where: engine/README.md:366-369 ("Admissible types are utf8, boolean, the 8/16/32/64-bit integers and float64 … A dictionary-encoded column is refused rather than decoded").
Code: engine/src/attributes.rs:78-101 admits Float32, Utf8View, and a dictionary over any admitted value type (decoded in the chunk loop); the module doc at :35-48 says the engine's set "no longer coincides" with the bundle restriction. Only kernel publish preflight still refuses Float32/dictionary (kernel/src/publish/mod.rs:418-441).
Why it matters: the README attributes a bundle-format restriction to the engine's admission gate, so a reader of a live viewport_query projection would predict refusals that do not happen.
Confirmed.

6. engine README's "What it does" table and scope line describe a polygons-only, publish-only-projection engine.

Where: engine/README.md:16 ("Emits GeoArrow polygons … [id, geometry], plus a declared attribute projection on the publish path"); :3-5 ("scoped to one operation").
Code: engine/src/lib.rs:17-28 and engine/src/geoarrow.rs:10-16 — five encodings (polygon, multipolygon, point, linestring, multilinestring), fixed at open (ADR-034 Accepted 2026-10-05); engine/src/stream.rs:999 stream_projected_with_cancel is the live projected path (SKP-V0 §9). The geometry preregistrations updated only the owner's index, not the body.
Why it matters: the summary table is what a newcomer reads first.
Confirmed.

7. "No spatial index … untouched" contradicts the index that exists in the same crate (and the README's own later section).

Where: engine/README.md:76; engine/src/lib.rs:15-16 ("Server-side spatial indexing is docs/07's other open gate and is not touched here").
Code: engine/src/index.rs:4-5 ("docs/07's open gate, closed for this slice's shape only"); engine/README.md:176-179 says the same.
Why it matters: a reader of the "deliberately does not do" list would miss that the gate was measured to a close (PLAN node spatial-indexing-measurement-close, done).
Confirmed.

8. Code doc comments still call accepted ADRs and amendments "Proposed" (files beyond the ones the existing node names).

Where: engine/src/identity.rs:5 ("ADR-016 (Proposed)"), :43, :66, :119 ("the proposed ADR-016 Amendment 1"); engine/src/crs.rs:11 ("ADR-015 (Proposed). ADR-013 is Proposed"); engine/src/geoparquet.rs:75, 152, 236, 588, 742, 803, engine/src/dataset.rs:1017, 1731, engine/src/envelope.rs:146, 179 ("the proposed ADR-013/015 Amendment 1"); kernel/src/bundle/mod.rs:5 ("Proposed as ADR-017").
Code/ADRs: ADR-013 A1 (docs/adr/ADR-013…:265), ADR-015 A1 (:155), ADR-016 A1 (:180) all "appended — Accepted" 2026-09-23; ADR-016 Accepted 2026-09-02; ADR-017 Accepted 2026-08-06.
Why it matters: "Proposed … binds nothing" is a review-blocking distinction in this repository. Node module-docs-stale-statements tracks the same class for engine/README.md and kernel/src/lib.rs only.
Confirmed.

9. kernel/CANCELLATION-AND-TRACING.md §6 presents as open two decisions that were taken.

Where: kernel/CANCELLATION-AND-TRACING.md:161-167 — item 1 "ADR-017 §15 … Needs an appended corrigendum, proposed not applied"; item 2 "ADR-018 is missing and is drafted as Proposed".
Code/ADRs: docs/adr/ADR-017…:1044 Corrigendum 4 (2026-08-07) applies exactly that correction; docs/adr/ADR-018…:5 Accepted 2026-08-08; item 3's docs/10 pointer is in docs/10_*:32-37. The document's own §8 amendment corrected §2 but not §6.
Why it matters: a reader could re-draft ADR-018 or re-propose the §15 corrigendum.
Confirmed (the section is phrased as flagged items, so lower priority than the above).

10. kernel/src/publish/mod.rs header's order of operations predates the preflight extraction.

Where: kernel/src/publish/mod.rs:46-53 — step 1 creates staging "before the query, before the hash", step 3 then resolves the projection and compiles the style.
Code: kernel/src/publish/mod.rs:578-596, 605-612, 684-690 — name, projection and style are decided in preflight before publish_prepared creates the staging directory ("Admitted in preflight, before the staging directory existed").
Why it matters: the boundary's refusal ordering (what refuses with no staging side effect) is read from this list.
Confirmed, minor.

Already tracked in PLAN.yaml (left out above)

module-docs-stale-statements — kernel/src/lib.rs scope/only-place/exposure statements, kernel/PERMISSION-BOUNDARY.md exposure position, engine/README.md ADR statuses, the publish bullet's publish.rs pointer, the Close-ordering index pointer. Same topic, two more files not named by the node: kernel/src/permission/mod.rs:21-24 and kernel/src/permission/boundary.rs:27 ("nothing is exposed"), and kernel/src/lib.rs:48 ("fixed at startup").
engine-cancel-before-execute-siblings — engine README item 3 blockquote; lease_for_stream doc (engine/src/dataset.rs:1928-1933).
kernel-composed-ceiling-projected-stream — the kernel README's composed table and the projected stream.
stream-doc-first-batch-claim, dataset-stream-doc-producer-runs-ahead — Dataset::stream's doc (engine/src/stream.rs:898-899).
kernel-close-races-followups, skp-line-cites-outside-close-races — stale line cites and SkpHost::generations doc in kernel/src/skp.rs.
catalog-open-replace-drop-latency-note — Catalog::remove doc drift.
redaction-hostname-off-windows — PERMISSION-BOUNDARY's machine-identifier property off Windows.
pre-admission-change-detail-braces — braced P6 placeholder strings in kernel/src/skp.rs / lib.rs.

Not got to

Per-function doc comments below the module headers in kernel/src/skp.rs, engine/src/stream.rs and engine/src/dataset.rs (only headers, constants and the README-cited items were read); unpinned path:line cites inside doc comments generally; kernel/src/permission/audit/{reader,record,normalize}.rs and kernel/src/publish/{ceilings,viewer_assets}.rs headers; kernel/src/bin/publish-bundle.rs argument list versus its parser; renderer/ and protocol/ READMEs (outside area D).
