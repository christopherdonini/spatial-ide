# NEXT-CUT — Brief A: admission format semantics and the session identity lifecycle (the first post-tag cut)

*Ported 2026-09-10 from `state/drafts/post-tag/DRAFT-2-BRIEF-A-admission-and-session-lifecycle.md` on the human's direction, under the release freeze (nothing past P0 runs before the human's sight; no installer, release text, or shell/kernel code on main until Part M and the v0.1.0 tag). The previous NEXT-CUT (the LOD and 1b drafts, the companion note, the post-release sequencing notes, the entry-66 bullet) is archived at `.cut-archive/NEXT-CUT-2026-09-10-lod-1b-drafts-and-notes.md`; the four post-tag drafts and two consults stay under `state/drafts/post-tag/`. Transient, untracked; state to `.cut-archive/` at close.*

## P0 status (custodian, 2026-09-10)

- Branch `cut/admission-format-semantics` opened from `main` (worktree `.claude/worktrees/cut-admission`).
- Architect consult run in two parts (preregistration + corpus outcome table + routed answers + ADR-032 redraft; the four proposed amendments). Findings: the polygon-only gate `engine/src/dataset.rs:275-282` refuses 8 of the 12 collected corpus files before any Brief A rule — DECISIONS-PENDING entry 73 (the human); the absent-key default sentence was not pinned in the tree — being pinned under the entry-51 discipline as a P0 prerequisite; `generation` already names a connection lease in `engine/src/pool.rs` — G named distinctly at P3; boundary 8's refusal is a fourth typed refusal beyond boundary 9's three — reading recorded.
- Files on the branch, for the human's sight via **PR #44** (opened 2026-09-10; the preregistration committed once, complete, append-only from 389edff): `engine/ADMISSION-PREREGISTRATION.md`; `docs/adr/PROPOSED-amendment-to-ADR-015-format-governed-inputs-and-provenance-classes.md`, `…-ADR-016-identity-tier-model.md`, `…-ADR-013-geographic-degrees-instance.md`, `…-ADR-028-within-generation-qualification.md`; `docs/adr/ADR-032-…` redrafted as the accepting record (Status still Proposed; accepted at P6 only in the human's words).
- Corpus: `target/fixtures/compat-corpus/` (untracked) — 12 files / 5 pipelines collected, extended: 12 main-set files (GDAL 3.11.3 via the QGIS 3.44.2 install, `qgis_process`, DuckDB spatial, GeoPandas, the spec example, an Overture extract), 4 retired with observed blocks kept, 5 mutation fixtures, `crs_axis_*` observed; expected outcomes live in the preregistration §3, never in the manifest.
- Nothing past P0 is dispatched before the human's sight. Open questions route per the brief; the queue carries entries 72 (commit identity) and 73.

---

# DRAFT 2 — BRIEF A: admission format semantics and the session identity lifecycle

*Fable, 2026-09-09. For the human's review. On approval the custodian ports it as NEXT-CUT.md
(transient, untracked, state to `.cut-archive/` at close) and opens the cut with an architect
consult as P0. First post-tag cut. Boundaries below are SETTLED by the 2026-09-09 design
discussion and are not reopenable inside this cut.*

**Branch (when opened):** `cut/admission-format-semantics` from `main`.
**Commits:** `git -c user.name=chris -c user.email=chrys92d@gmail.com commit -s`.
**Approval basis:** the human's settled boundaries, 2026-09-09; architect consult before P0;
the review-loop amendment (Draft 1) in force. Unattended rules apply.

## What this cut changes for a user (the honest one-paragraph claim, verified at close)

A GeoParquet file whose `crs` key is absent opens as OGC:CRS84 **under the format's own rule**,
with that provenance shown; a file whose WKB coordinates are x,y under a lat-first CRS opens
under GeoParquet's **declared axis override**, with that provenance shown; a single-file source
with no usable integer key opens with **session identity** and a visible statement of what that
is and is not; a source that changes while open is **refused by name** at the next read. What it
does not change: explicit `crs: null` still means "unknown — assert to open"; native and mapped
identity behave exactly as today; partitioned sources gain nothing here.

## Settled boundaries (binding)

1. **Format semantics are not guesses.** Absent `crs` key → `crs:format-default` (OGC:CRS84,
   GeoParquet 1.1.0, pinned text in `spikes/item8-crs-catalog-extension/README.md` §2). Explicit
   `null` → unknown, assertion required (unchanged). WKB coordinate order → `axis:format-override`;
   the definition's own axis order is RETAINED as a recorded fact for future reprojection/export,
   never discarded.
2. **The range check is a sanity check, not a truth test.** It catches malformed files only.
   Its assurance level is recorded per open: `metadata` (geo `bbox` / column statistics),
   `sample` (first row group), or `none`. Never all coordinates at open. A projected file inside
   ±180/±90 is NOT detected by it, and the KNOWN-LIMITATIONS text says so.
3. **Session identity is generation-namespaced, never a snapshot claim.** Identity =
   (dataset-session generation G, physical file-row ordinal via DuckDB `file_row_number`). G is
   minted per open, lives in kernel + client state, is **never persisted and never published**.
   The structural descriptor — byte size, mtime, footer length, footer hash — is a **change
   detector that invalidates G**; it is not what makes ordinals unique (uniqueness is by
   construction within a generation).
4. **Read-only preview policy, declared.** Checks run before every query issue and after every
   stream terminal. A detected change invalidates G: new tickets refused under G, in-flight
   producer streams cancelled through the existing cancel, residency cleared, picks refused
   until reopen, typed status "source changed during use." **Every batch is attributed to a
   generation via its ticket; the client drops any batch whose ticket belongs to an invalidated
   generation** — late results never repopulate the canvas. The policy does not establish
   snapshot consistency, cannot detect every in-place modification, and may detect a change
   during a query only at the post-check. This limitation is stated verbatim in the ADR-016
   amendment and in KNOWN-LIMITATIONS. No text or code comment may claim "one open reads one
   snapshot."
5. **Footer work is bounded and accounted.** Read the footer length first; if the footer exceeds
   a declared ceiling (architect sets the value; recorded in the preregistration), the descriptor
   degrades to size + mtime + footer length and the degradation is shown. Footer bytes read are
   reported per open (reported-only, never gated).
6. **Fast admission is structural.** On the session-ordinal path, `open` performs **no
   whole-file read**: no content hash, no uniqueness scan. The native/mapped path is **separately
   specified and unchanged**: its full-column verification scan stays, with its liveness + Cancel.
   The distinction is tested directly (Gate G-A1).
7. **Single-file only.** Partitioned sources are refused for session-ordinal identity **by name**
   (`engine.identity_ordinal_partitioned_unsupported`); their existing declared-mapping route is
   untouched. File-list and packing contracts are a later brief.
8. **Publishing a degrees dataset refuses at preflight by name** until Brief B's reader change
   (the ADR-025 pattern) — never a dead artifact.
9. **Data plane: EMPTY DIFF under `protocol/data-plane/`.** Generation attribution rides the
   existing ticket; no new wire field. Control plane: `describe` gains `crs.provenance`,
   `axis.provenance`, `identity.class` (+ session-tier statement) and the sanity-check level;
   new typed refusals `engine.source_changed{detail}`, `engine.format_default_contradicted
   {detail}`, `engine.identity_ordinal_partitioned_unsupported`. `SKP_VERSION` bumps (0.3),
   fixtures updated in the same commit, `deny_unknown_fields` kept.
10. **ZERO performance claims.** "Free", "immediate", "fast" are hypotheses until observed; no
    docs/08 row; no number in any release or ADR text.

## Block-on-sight conditions (cite in every review)

- **A1** No snapshot-consistency claim anywhere (text, comment, status string).
- **A2** No generation value in any persisted or published artifact (typed-schema + grep tests).
- **A3** Data plane EMPTY DIFF; describe additions only; SKP 0.3 with fixtures in the same commit.
- **A4** Existing native/mapped identity tests remain green unmodified (additive fields only).
- **A5** Single-file only; partitioned refusal by name; no packing contract introduced.
- **A6** No perf claim, no docs/08 row, no duration in any walkthrough row (ADR-018).
- **A7** ADR-005 ResourceRef vocabulary used for identity vs locator; no competing model.

## Phases (bounded pieces; budgets are ceilings)

| # | Phase | Budget | Gate |
|---|---|---|---|
| P0 | Architect consult; preregistration `engine/ADMISSION-PREREGISTRATION.md` (§0–§12 pattern): the **compatibility corpus manifest** (8–12 files, ≥3 independent pipelines — GeoPandas/pyogrio, GDAL, DuckDB spatial, QGIS, one Overture extract; declared projected CRS, absent-key CRS84, explicit-null, integer / string / no usable key, missing covering metadata; each file hash-pinned with its expected outcome PRE-declared; malformed mutation fixtures kept in a separate directory); ADR drafts filed **Proposed**: ADR-015 Amendment 1 (§5 scoped to non-format-governed inputs; provenance classes), ADR-016 Amendment 1 (the tier model: session / verified / change-handling; OPEN item 2 settled by the verified tier's hash — the tier itself lands in Brief B), ADR-013 geographic-degrees instance + equirectangular display convention, ADR-028 within-generation qualification; ADR-032 redrafted as this cut's accepting record | 90 min | Human sight of the preregistration + ADR drafts (red line) |
| P1 | Reader: format semantics + provenance classes + sanity-check levels; explicit-null unchanged; fixtures for each case | 120 min | Reviewer |
| P2 | ADR-013 degrees space instance; shell display convention + the ruled wording ("no coordinate value is transformed; the display convention is equirectangular") in status + describe; publish preflight refusal for degrees datasets by name | 90 min | Reviewer; architect (ADR-013/ADR-010 rule 1) |
| P3 | Session identity tier: `file_row_number` ordinals; generation minted per open (kernel state) and mirrored client-side via ticket→generation mapping; descriptor with bounded footer read; read-around checks; invalidation path (tickets refused, in-flight cancelled, residency cleared, picks refused, typed status); SKP 0.3 describe fields + refusals + fixtures | 180 min | Reviewer; **architect-blockable** (ADR-016/010/028) |
| P3 (split, 2026-09-16) | **RULED 2026-09-16, question round 4 (entry 96), the human verbatim: "Split P3, on conditions."** P3's row above now reads as two pieces. **P3a** (the landing half, `cut/briefa-p3`): `file_row_number` ordinals; the generation minted per open and mirrored client-side by ticket; the descriptor with bounded footer read; read-around checks; the invalidation path's kernel + manager halves (tickets refused at issue, in-flight cancelled, typed status; late batches dropped by ticket; the typed code carried on the terminal) and SKP 0.3 — **P3a claims nothing about boundary 4's owner-side consequences.** **P3b** (`briefa-p3b-owner-side-invalidation`, its own preregistration and gates): residency cleared and picks refused in both owners on the terminal AND on the pre-check refusal; the kernel-authoritative dead-ticket refusal at redemption with a real caller and known-live / known-dead / unknown behaviour (never a fabricated source change); the ADR-016 amendment's acceptance. **No release includes P3a without P3b.** Amendment 3 of `engine/ADMISSION-PREREGISTRATION.md` records the split. | P3a 180 min spent; P3b 240 min | Both full gating (reviewer + architect, the caller grep and the seam rule) |
| P4 | Corpus run: every file opened under the preregistered expectation; the **admission table** produced (admitted-as-declared / admitted-under-format-rule-with-provenance / refused-by-name-with-reason); deviations from prediction recorded as results, never adjusted | 60 min | Tester (correctness, no timing) |
| P5 | Tests carrying the claims (see Gates) + E2E: detected-change invalidation; late-generation rejection; fast-admission distinction | 120 min | Reviewer |
| P6 | Walkthrough **Part N** (no durations): open a CRS84 file, read the provenance line; open a keyless single file, read the session-identity statement; mutate the source mid-session, read the refusal; open an explicit-null file, meet the assertion prompt; attempt to publish a degrees dataset, read the preflight refusal. KNOWN-LIMITATIONS: the change-detector limitation, single-file, degrees-publish refusal, sanity-check limits. Queue ADR acceptances | 60 min | Human (operator-verified; acceptances are red lines) |

## Gates — the explicit acceptance checks

- **G-A1 Fast admission is structural.** A test that observes reads on the open path (byte
  accounting or an instrumented reader): session-ordinal open → zero whole-file reads, no hash
  call, no uniqueness scan; mapped-ID open on the same file → exactly its verification scan.
  Both directions asserted in one test module so the distinction cannot drift apart.
- **G-A2 Detected-change invalidation.** Open; issue a query; mutate the file (mutation fixture);
  the next read refuses `engine.source_changed`; residency cleared; picks refused; status text
  verbatim. Asserted at the pre-check and at the post-check paths separately.
- **G-A3 Late-generation rejection.** A batch whose ticket belongs to an invalidated generation,
  delivered after invalidation, is dropped and never rendered (client test with a delayed
  batch; E2E on the shipped default). The test text states it demonstrates detection of a
  *detected* change, not of every possible modification.
- **G-A4 No generation persisted.** Typed-schema test + grep over every persisted and published
  artifact the tree can produce.
- **G-A5 Corpus table** produced against the preregistered expectations; every deviation is a
  recorded result.
- **G-A6 Native/mapped unchanged**: existing identity and CRS test suites green without edits.
- **G-A7 Part N** operator-verified.

## Non-goals

Tier 2 (verified identity / prepare-to-save — Brief B) · partitioned ordinal identity ·
string-id hashing · attribute projection (Brief B) · bundle reader changes (Brief B) · numeric
classification · geometry predicates · LOD · any docs/08 row · any perf number.

## Open questions — routed

**Architect (implementation-level; do not reach the human unless they change behaviour,
authority, guarantees or scope):** the footer ceiling value; sanity-check sample size; the
exact placement of the post-check relative to DuckDB's own scan and the stream terminal; whether
the ticket→generation mapping lives in kernel state, client state, or both; SKP 0.3 bump
mechanics with Brief B's later bump.

**Human (only if they arise):** if the architect finds the post-read check cannot be honoured
without a wire change (a guarantee change); if any corpus file forces a scope change to a ruled
item.

## Key files

`engine/src/geoparquet.rs` · `engine/src/dataset.rs` · `engine/src/identity.rs` ·
`engine/src/error.rs` · `kernel/src/skp.rs` · `protocol/skp/{SKP-V0.md,src/v0/commands.rs,
tests/fixtures.rs}` · `frontends/shell/src/streaming/*` · `frontends/shell/src/residency/*` ·
`docs/adr/ADR-013, -015, -016, -028, -032` · `KNOWN-LIMITATIONS.md` ·
`frontends/shell/MANUAL-WALKTHROUGH.md` (Part N).


## Dated qualifications (custodian, on the human's rulings; the draft's text above is untouched)

- **2026-09-11 — gate G-A6, on DECISIONS-PENDING entry 80 = "(a), each re-aim naming the ruling AND asserting the new provenance class."** G-A6 is read as: existing identity and CRS test suites green without edits, *except* tests that pin behaviour boundary 1 itself abolishes, which are re-aimed with the ruling named in the test's doc comment **and** the new provenance class asserted (`crs:format-default` for an absent-key admission; `axis:format-override` for a WKB-order admission). The three re-aims: `engine/tests/slice.rs` ×2, `kernel/tests/skp_admission.rs` ×1. Every identity test and every explicit-null refusal test stays byte-unchanged.
