# PROPOSED appended amendment to ADR-015 — §5 scoped to non-format-governed inputs; provenance as recorded fact

*Drafted 2026-09-10 at Brief A's P0 by the architect agent on the custodian's brief, for the human's sight. Filed on `cut/admission-format-semantics`; nothing here is in force.*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit. Filed as a separate file per the precedent of
`PROPOSED-amendment-to-ADR-003-projected-canvas-publishing.md` and
`PROPOSED-amendment-to-ADR-004-instrument-surface-never-skp.md`.
**Would amend:** ADR-015 (Accepted 2026-08-05, architect-blockable — `ADR-015:3`) as **Amendment 1**,
by appended text, never by rewriting.
**Basis:** Brief A's settled boundaries 1, 2 and 10 (2026-09-09, binding). Reuses the §5 wording
drafted at the 2026-09-09 architect consult (`RELEASE-DRAFTS-0.1.0/post-tag/architect-consult-adr-032.md`), extended where
boundary 1 goes further than that draft did.
**Related:** ADR-032 (Proposed — this amendment supplies what its candidate (B) needs and decides
nothing for it); `docs/01` principle 8; `docs/05:26`, `:64-67`; ADR-010 rule 1.

## Proposed text

> **Amendment 1 (date, appended) — format-governed inputs, and provenance as a recorded fact.**
>
> **1. §5 sentence 1 carries two facts, not one.** The **declared** axis order is established from
> the CRS definition, never assumed. The **data's** axis order is established from the source
> format's own specification where that specification states one, and from the definition otherwise.
> Where the two differ, **both are recorded**, with the rule and the specification version that
> established the data order, and neither is inferred from the other. **The definition's own axis
> order is retained as a recorded fact and never discarded** — it is what a later reprojection or
> export needs, and a slice that discards it has destroyed a file fact to save a field.
>
> **2. Sentence 3 narrows.** `AxisOrderUnsupported` refuses sources for which **no format rule
> establishes the data order**. Sentence 2 (`AxisOrderUnestablished` — a definition with no
> coordinate system) and sentence 4 (`axis_normalization = none-performed`) are **unchanged**:
> nothing is normalized, and the record still says what was done rather than what was assumed. The
> `docs/05` conflict block quoted in §5 is unchanged — refusing remains the resolved behaviour
> wherever it still applies, not a gap.
>
> **3. §2's second sentence narrows, and this is a reversal stated plainly rather than smuggled.**
> §2 reads *"GeoParquet's OGC:CRS84 default is not applied."* Under this amendment an **absent**
> `crs` key is admitted under the format's own published rule and recorded as `crs:format-default`.
> An explicit `"crs": null` is **unchanged**: unknown, refused, assertion required. The distinction
> is the whole of the narrowing — absent means the format has already spoken; explicit null means
> the file has said "I do not know", and no rule may answer for it.
>
> **4. §6 stands, and this amendment is not an exception to it.** *"No guessing, no default, no
> fallback"* forbids an **engine-invented** default. A format's own published rule, applied only to
> inputs that format governs, quoted verbatim and pinned by URL, retrieval date and page hash, is a
> read fact and is recorded as one. **A format rule that is not pinned in the tree may not be
> applied** — the pinning is the difference between reading a rule and remembering one.
>
> **5. The provenance classes are recorded facts, never judgements.** Five values, each naming what
> was read and from where: `crs:declared` (the file's own `crs`), `crs:asserted` (§3, unchanged),
> `crs:format-default` (the format's rule, absent key), `axis:declared` (from the definition),
> `axis:format-override` (from the format's specification, with its version). They are recorded on
> `describe` and travel with the dataset. **None of them is an equivalence finding** — §4 and §7's
> closing sentence are untouched, and this amendment licenses no later code to assume otherwise.
>
> **6. The range check is a sanity check, not a truth test, and its assurance is recorded.** Its
> level is recorded per open as exactly one of `metadata` (geo `bbox` or column statistics), `sample`
> (first row group) or `none`. **It never reads all coordinates at open.** It can convict a
> malformed file; it can never establish conformance. Its stated limit, which travels with it into
> KNOWN-LIMITATIONS: *"A projected file inside ±180/±90 is NOT detected by it"* **[Brief A boundary
> 2, verbatim]**. No text may describe it as verifying, confirming or validating anything.
>
> **7. Unchanged:** §1, §3, §4, §6 (as read in item 4), §7 in full, the Consequences, and the two
> OPEN blocks. **The §5 OPEN block — the normalize-later question — is not answered here**, and this
> amendment must not be cited as answering it.

## What this changes / does not change

**Changes:** §5 sentence 1 (two facts, both recorded, the declared order never discarded); §5
sentence 3's reach; §2's absent-key sentence, for GeoParquet only. Adds five recorded provenance
values and three sanity-check assurance levels to `describe`.

**Does not change:** explicit `crs: null` (still refused; assertion required); any refusal on the
assertion path; `axis_normalization = none-performed`; the `docs/05` lower-number-wins resolution;
the §5 OPEN block; anything about non-GeoParquet sources, macOS, Linux, or any number.

## Accepted at

Brief A's **P6**, on the human's word only. Queued there as an acceptance; acceptances are a red
line and no agent may treat this text as in force before that word.

## Block-on-sight conditions (P1–P3 reviewers)

1. A `crs:format-default` code path with **no pinned format text in the tree** — URL, retrieval
   date, page hash, verbatim quote, entry-51 discipline. The absent-key rule is **not** pinned in
   `spikes/item8-crs-catalog-extension/README.md` §2 today (that section pins only the axis-order
   passages, `:62-68`); a diff that applies the rule before pinning it fails on sight.
2. Any wording that the check "verifies", "confirms" or "validates" axis order or CRS — it convicts
   or is silent (`spikes/item8-crs-catalog-extension/README.md:74-77`; `docs/01` principle 3).
3. Explicit `crs: null` admitted, defaulted, or reaching any path other than the assertion prompt.
4. The declared axis order dropped, overwritten, or not present on `describe` once a format override
   applied (boundary 1's "never discarded").
5. Data-order establishment written anywhere but the format reader — a diff touching
   `engine/src/crs.rs`'s `is_x_first` (`:120-124`) or the admission path (`crs.rs:203-…`) fails on
   sight; `engine/src/geoparquet.rs`'s reader is the only site.
6. A sanity check that reads every coordinate at open, or whose recorded level is absent.
7. Any edit to ADR-015's accepted body rather than an appended amendment.

## Open questions routed

**Architect:** the sample size for the `sample` level; whether `metadata` may be claimed when the
covering `bbox` is present as field *paths* only (`engine/src/geoparquet.rs:111`, `:117-131` store
paths, not values — the level may not be claimed from a path it never read); the recorded spelling
of the five class values.

**Human:** none, provided item 3 is read as written. If the human reads §2's narrowing as a change
of guarantee rather than a scoping (it admits files ADR-015 refuses today), that is theirs to rule,
not the architect's to assume.
