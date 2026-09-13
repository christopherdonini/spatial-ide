# PROPOSED appended amendment to ADR-016 — the identity tier model: session, verified, change-handling

*Drafted 2026-09-10 at Brief A's P0 by the architect agent on the custodian's brief, for the human's sight. Filed on `cut/admission-format-semantics`; nothing here is in force.*

**Status:** Proposed — appended to the ADR only on the human's word, at which point this file is
deleted in the same commit.
**Would amend:** ADR-016 (Accepted 2026-09-02, architect-blockable — `ADR-016:3-10`) as
**Amendment 1**, by appended text, never by rewriting.
**Basis:** Brief A's settled boundaries 3, 4, 5, 6, 7 and 10, and block-on-sight A1, A2, A4, A7
(2026-09-09, binding).
**Related:** ADR-005 (ResourceRef vocabulary — used as vocabulary, unamended); ADR-010 rules 2 and 6;
ADR-018 (instants, no durations); `docs/11` (ResourceRef, stable feature IDs).

## Proposed text

> **Amendment 1 (date, appended) — three tiers, named, with the session tier defined and bounded.**
>
> This ADR admits identity through one door (a native `id` column, §2) or a declared mapping (§3).
> **Three tiers are named instead, and the session tier is defined here.**
>
> **1. The session tier.** Identity is the pair **(dataset-session generation G, physical file-row
> ordinal read via DuckDB `file_row_number`)**. It is **generation-namespaced**: an ordinal has no
> meaning outside the G it was minted under, and no comparison across two G values is defined.
>
> - **It is never a snapshot claim.** No text, comment, status string or test name may say or imply
>   that one open reads one snapshot.
> - **G is minted per open, lives in kernel and client state, and is never persisted and never
>   published.** G is not a ResourceRef field: it is neither logical URI, content hash, source
>   revision, locator, cache status nor portability policy (ADR-005; `docs/11:21-33`). No ADR-005
>   amendment is needed or implied — nothing is persisted and no grade is claimed.
> - **Uniqueness is by construction within a generation**, not by scan. `file_row_number` names a
>   physical row position, so within one G it is distinct by construction and is a pure function of
>   file content in §4's own sense — **not** scan order, not arrival order, not a dictionary index.
>   That `file_row_number` is physical rather than scan-ordered is the assumption this tier rests on
>   and is **verified against the corpus, never assumed**.
> - **§1's "no synthesis, no row ordinals" is not contradicted, and the reason is the namespacing.**
>   §1 refuses a synthesized ordinal offered as *stable feature identity*. This tier claims no
>   stability: it does not survive an open, a reopen, or a change, and it refuses to cross either
>   boundary. The ADR-010 rule 2 hazard — a wrong-but-plausible coordinate — is closed by
>   construction, because the space dies with G rather than outliving it silently.
> - **§5's full-column uniqueness scan does not run on this path** and must not be reported as
>   though it had. The §6 record gains a third what-was-checked value naming this basis
>   (`by-construction-within-generation`); the bare word "unique" still appears nowhere.
>
> **2. The structural descriptor is a change detector, not the uniqueness basis.** Byte size, mtime,
> footer length and footer hash. Its only job is to **invalidate G**. The footer read is bounded by a
> **declared ceiling** (ADR-010 rule 6; the value is set by the architect and recorded in
> `engine/ADMISSION-PREREGISTRATION.md`, not fixed in this ADR); past the ceiling the descriptor
> degrades to size + mtime + footer length and **the degradation is shown**. Footer bytes read are
> reported per open, reported-only, never gated. No number appears in this ADR text.
>
> **3. Change handling — the read-around policy, declared.** Checks run **before every query issue
> and after every stream terminal**. A detected change invalidates G: new tickets refused under G,
> in-flight producer streams cancelled through the **existing** cancel, residency cleared, picks
> refused until reopen, and a typed status "source changed during use". Its limitation, stated here
> and in KNOWN-LIMITATIONS in these words: the policy **"does not establish snapshot consistency,
> cannot detect every in-place modification, and may detect a change during a query only at the
> post-check"** **[Brief A boundary 4, verbatim]**.
>
> **4. The verified tier — defined here, landing later.** Identity pinned to a **content-addressed
> revision**: a content hash over the source, recorded, so two opens can be compared and two files
> presenting the same identities can be told apart. **It is not built in this cut**; it lands with
> Brief B, and no claim about it may be made before it exists.
>
> **5. Single file only.** A partitioned source is refused for session-ordinal identity **by name** —
> `engine.identity_ordinal_partitioned_unsupported`. Its existing declared-mapping route is
> untouched. No file-list or packing contract is introduced here.
>
> **6. Native and mapped identity are unchanged.** §1-§7 continue to govern them in full, including
> §5's whole-file verification scan with its liveness and Cancel. Additive fields only; existing
> tests stay green unmodified.

## Which of ADR-016's open items this settles

**Settled by this amendment:** none of the "What this ADR does not decide" list — composite keys,
non-integer keys, non-GeoParquet sources and performance all stay exactly as they are.

**OPEN item 2** (*Stability across reopen, and what pins it*, `ADR-016:171-176`) is **settled in
definition** by the verified tier's content hash: identity is pinned to a content-addressed revision,
and a mismatch invalidates rather than silently re-presents. It is **discharged only when Brief B
lands that tier**; until then the block stays open and its own condition — *"Must be settled before
any identity is persisted or used to address a feature across sessions"* — is honoured here by the
session tier persisting and publishing nothing.

**OPEN item 3** (composite and non-integer keys): untouched, open.

## What this changes / does not change

**Changes:** adds a third admission route (session tier) with its own record value; adds the
descriptor, the read-around policy and its limitation; names the partitioned refusal.

**Does not change:** §1's refusal of synthesized identity offered as stable identity; §3's
declared-never-inferred rule; §4's determinism test; §5 for native and mapped paths; §6's
what-was-checked discipline; §7's width contract; every Consequence; ADR-005 and `docs/11`.

## Accepted at

Brief A's **P6**, on the human's word only. Red line.

## Block-on-sight conditions (P1–P3 reviewers)

1. **A1** — any snapshot-consistency claim, in text, comment, test name or status string.
2. **A2** — G in any persisted or published artifact; a `describe` field, a bundle manifest key, a
   log line that outlives the session, or an SKP field.
3. G named `generation` without qualification: `engine/src/pool.rs:406,426-434` already owns a
   connection **lease** generation (`ConnectionFacts.lease_generation`, ADR-004 Amendment 4). A diff
   that reuses the bare name fails on sight.
4. A whole-file read, hash call or uniqueness scan on the session-ordinal open path (boundary 6,
   Gate G-A1) — or the mapped path's scan removed or weakened (**A4**).
5. `file_row_number` used without the corpus check that it is physical, not scan-ordered.
6. The word "unique" as a bare fact anywhere in the record (`engine/src/identity.rs:58-78`).
7. A footer ceiling number written into the ADR text rather than the preregistration; or a
   descriptor degradation that is not shown.
8. **A5** — a partitioned source reaching the ordinal path, or the refusal not named.
9. A duration attached to any of it (**A6**, ADR-018 §1 — instants, never durations).

## Open questions routed

**Architect:** the footer ceiling value and its recorded units; the post-check's exact placement
relative to DuckDB's own scan and the stream terminal; the third record value's spelling; SKP 0.3
bump mechanics against Brief B's later bump.

**Human:** only if the post-read check cannot be honoured without a wire change — that is a change of
guarantee and Brief A routes it to the human by name.
