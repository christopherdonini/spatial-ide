# Drift sweep, area D — the custodian's check at 116deb53

The custodian checked the human's drift sweep of area D, the engine and kernel documents against the code (`state/consults/DRIFT-SWEEP-AREA-D-2026-10-10.md`). The report was copied byte-identical from the human's advisory folder. Its sha256, a1e79e06649a107deecba824d7e10d30c78c89f3b6958b2ae95e340d9489dc07, matches the human's stated hash.

The report names the commit it swept: 116deb53293bb62ebbaa49ee795e3b1f0093745d. Every cite below is read at that commit with `git show 116deb53:<path>`, and the filing script asserts each cited line's content there. Main's head when this was filed, e96c591d16e22a779f9ad9d4d8b015e5de9a1ccb, has no change since the sweep under `engine/`, `kernel/`, `protocol/`, `frontends/` or `docs/`, so each line stands at the head too. Where a line here differs from the report's, this one governs.

**All ten findings hold, and so do the three extra statements the report names under "already tracked".** The human's three instructions are answered at the end.

## Finding 3 — holds (first in the node)

The kernel README's H2 row still says producer-visible cancellation under the docs/08 budget, observed on the producer's own clock (kernel/README.md:331). The two tests it rests on no longer assert that budget:
- **The cancel-in-flight test** (kernel/tests/end_to_end.rs:386). Its own comment says no 100 ms budget is asserted any more (kernel/tests/end_to_end.rs:385). The interval is printed as a REPORT and labelled not `cancel_observed` (kernel/tests/end_to_end.rs:424).
- **The cancel-before-first-batch test** (kernel/tests/end_to_end.rs:445). It carries the same REPORT label (kernel/tests/end_to_end.rs:480).

## Finding 4 — holds (first in the node)

The engine's README and its module doc both say it persists nothing:
- **The README:** engine/README.md:80.
- **The module doc:** engine/src/lib.rs:47. It names its own trigger: the moment anything here caches to disk, docs/11's ResourceRef model and `kernel/` are owed (engine/src/lib.rs:49).

The tier builder writes to disk:
- **Where:** a sidecar directory keyed by the source's content hash under the app-local cache (engine/src/lod.rs:13), rooted at engine/src/lod.rs:151.
- **What:** it creates the directory (engine/src/lod.rs:1152), writes one GeoParquet file per tier (engine/src/lod.rs:1399) and writes a manifest (engine/src/lod.rs:1236).

The README's index paragraph stays true of the index (engine/README.md:240).

## Finding 1 — holds

The engine still says it refuses two kinds of file that main now admits:
- **A file with an absent `crs` key:**
  - the README: engine/README.md:23 and engine/README.md:440;
  - the module doc: engine/src/lib.rs:13.
- **A non-x-first source** (engine/README.md:456).

What main does:
- **An absent key under a pinned spec version** is admitted as OGC:CRS84 with `crs:format-default` (engine/src/geoparquet.rs:16; engine/src/error.rs:23).
- **A declared (lat, lon) definition** carries the format's WKB order and is admitted (engine/src/dataset.rs:418).

ADR-032 is Accepted (docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:5).

## Finding 2 — holds

The README says a file with no `id` column is refused, and that this bounds which real GeoParquet the slice can open (engine/README.md:442, engine/README.md:446).

Main opens such a file on the session tier (engine/src/dataset.rs:1754; engine/src/identity.rs:55). ADR-016 Amendment 1 is Accepted (docs/adr/ADR-016-stable-feature-identity-admission.md:180).

## Finding 5 — holds

The README says the admissible attribute types are utf8, boolean, the 8/16/32/64-bit integers and float64, and that a dictionary-encoded column is refused (engine/README.md:366, engine/README.md:368).

The engine admits more:
- `Utf8View` (engine/src/attributes.rs:83);
- `Float32` (engine/src/attributes.rs:94);
- a dictionary over an admitted value type (engine/src/attributes.rs:101).

The module's own doc says its set no longer coincides with the bundle restriction (engine/src/attributes.rs:48). Only the kernel's publish preflight still refuses `Float32` and dictionaries (kernel/src/publish/mod.rs:418).

## Finding 6 — holds

The README's scope line and summary table describe a first cut scoped to one operation (engine/README.md:3). They say it emits polygons only, with a projection on the publish path only (engine/README.md:16).

Main has five encodings, fixed at open (engine/src/lib.rs:17 to engine/src/lib.rs:28; engine/src/geoarrow.rs:15). ADR-034 is Accepted (docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:3). The live projected path is engine/src/stream.rs:999.

## Finding 7 — holds

The README and the module doc both say the spatial index is untouched (engine/README.md:76; engine/src/lib.rs:16). The index module says the gate is closed for this slice's shape (engine/src/index.rs:5), and so does the README's own later section (engine/README.md:178). The PLAN node `spatial-indexing-measurement-close` is done.

## Finding 8 — holds

Doc comments still call accepted ADRs, and accepted amendments, "Proposed".

**The engine:**
- `identity.rs`: engine/src/identity.rs:5, engine/src/identity.rs:43, engine/src/identity.rs:66, engine/src/identity.rs:119
- `crs.rs`: engine/src/crs.rs:11
- `geoparquet.rs`: engine/src/geoparquet.rs:75, engine/src/geoparquet.rs:152, engine/src/geoparquet.rs:236, engine/src/geoparquet.rs:588, engine/src/geoparquet.rs:742, engine/src/geoparquet.rs:803
- `dataset.rs`: engine/src/dataset.rs:1017, engine/src/dataset.rs:1731
- `envelope.rs`: engine/src/envelope.rs:146, engine/src/envelope.rs:179

**The kernel:** kernel/src/bundle/mod.rs:5.

The ADRs' status lines:
- **ADR-013** Accepted (docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:3); its Amendment 1 (docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:265).
- **ADR-015** Accepted (docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:3); its Amendment 1 (docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:155).
- **ADR-016** Accepted (docs/adr/ADR-016-stable-feature-identity-admission.md:3).
- **ADR-017** Accepted (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:3).

## Finding 9 — holds

`kernel/CANCELLATION-AND-TRACING.md` §6 presents two decisions as still open:
- **An ADR-017 §15 corrigendum,** proposed and not applied (kernel/CANCELLATION-AND-TRACING.md:163). ADR-017's Corrigendum 4 applies it (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1044).
- **ADR-018,** missing and drafted as Proposed (kernel/CANCELLATION-AND-TRACING.md:164). ADR-018 is Accepted (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3); the report gives line 5.

Item 3's pointer is in `docs/10` (docs/10_SKP_Protocol.md:32). The document's §8 amendment (kernel/CANCELLATION-AND-TRACING.md:212) does not touch §6.

## Finding 10 — holds

`publish/mod.rs`'s header says step 1 creates the staging directory before the query and before the hash (kernel/src/publish/mod.rs:46), and that step 3 then resolves the projection and compiles the style (kernel/src/publish/mod.rs:52).

The code decides them in preflight, before staging exists:
- `preflight` is defined at kernel/src/publish/mod.rs:578 and runs first (kernel/src/publish/mod.rs:610);
- staging is created later (kernel/src/publish/mod.rs:634);
- the run says so itself (kernel/src/publish/mod.rs:696). The report gives lines 684-690 for this.

## The extra statements under "already tracked" — hold

- **`kernel/src/permission/mod.rs`** says nothing here is exposed and that the cut exposes nothing (kernel/src/permission/mod.rs:21, kernel/src/permission/mod.rs:24).
- **`kernel/src/permission/boundary.rs`** says nothing is exposed today, so there is no such caller (kernel/src/permission/boundary.rs:27).
- Both miss the shell's publish UI surface, which ADR-017 discharged on 2026-08-17 (frontends/shell/src-tauri/src/commands.rs:265).
- **`kernel/src/lib.rs`** says the name map is fixed at startup (kernel/src/lib.rs:48). SKP's `open_dataset` opens into the catalog at runtime (kernel/src/skp.rs:1176).

## The human's three instructions

**1.** `module-docs-stale-statements` is widened to all ten findings and the three statements above. It is one docs-only piece, covering README bodies and doc comments, with no code logic.

**2. Finding 4: did the LOD piece discharge what the sentence says is owed?** No. Something is still owed. It stays latent until a product path builds tiers.
- **The LOD form does not address the trigger.** `engine/LOD-PREREGISTRATION.md` never names docs/11 or ResourceRef; the filing script checks the form's whole text at 116deb53. It names ADR-005 once, as a reason for its fixed tier ladder: a data-driven tier count would cap the reproducibility grade any workflow containing it may claim (engine/LOD-PREREGISTRATION.md:79). It gives tier sets no grade.
- **The kernel README is where the earlier trigger was discharged,** for publishing only. It names the trigger (kernel/README.md:205), and its table discharges it for bundles: three ResourceRefs in the manifest (kernel/README.md:212) and a grade on every bundle (kernel/README.md:214). Nothing like it exists for tier sets.
- **What the tier set carries:** the source's content hash as its directory key, and a SHA-256 per tier in `tiers.json` (engine/LOD-PREREGISTRATION.md:259). That is two of a ResourceRef's six members in substance: a content hash and a locator.
- **What it lacks:**
  - a logical URI, a source revision, a cache status and a portability policy (docs/11_Project_and_Resource_Model.md:29);
  - a grade, though ADR-005 grades derived outputs by their weakest input (docs/adr/ADR-005-resource-identity-reproducibility.md:20).
- **Still owed in docs/11:**
  - the resource model's lifecycle: cache and garbage collection operate on resources (docs/11_Project_and_Resource_Model.md:45);
  - the `kernel/` half the engine's sentence names.
- **Partly tracked:**
  - **The cache lifecycle.** The LOD form names it as an owed decision and a hard precondition of the selection piece (engine/LOD-PREREGISTRATION.md:394), adding no eviction, no cache ceiling and no runner (engine/LOD-PREREGISTRATION.md:398). The node `lod-tier-cache-lifecycle` is done as a ruled direction, and its ADR-031 text rides `lod-tier-selection`'s preregistration. That node is proposed and not placed.
  - **Not recorded anywhere:** whether a tier set carries a ResourceRef or a grade.
- **Why it is latent:** no product path builds a tier today. `build_tiers` is called only from `engine/src/lod.rs` itself, `engine/tests`, and a test in `kernel/src/skp.rs`'s test module. The kernel's own comment says no SKP command builds one (kernel/src/skp.rs:2188).

What the docs node can do honestly: rewrite the persists-nothing sentence to say the engine writes a derived, non-authoritative tier cache, that the trigger has come due, and what is owed and where it is tracked. It cannot discharge the obligation, which is a decision for `lod-tier-selection`'s form or the human, not a docs edit.

**3.** The proposal is section M of `state/drafts/weekly-window-2026-10-09.md`.
