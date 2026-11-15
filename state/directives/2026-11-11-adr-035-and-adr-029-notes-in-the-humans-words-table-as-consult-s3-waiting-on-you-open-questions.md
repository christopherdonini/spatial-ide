# The human's message of 2026-11-11 (17:25Z): ADR-035's appended note in the human's words (adr-035-close-races-note), checked by the gate clause by clause; ADR-029's note in the human's words (adr-029-stale-line-cites), the custodian's table of current lines filed beside it as a consult and not in the ADR; an S3 governance piece, five-line, after what is queued: the site's Waiting on you also lists an in-progress node carrying an open question for the human, and until it lands the closing message stays the full list

*Filed verbatim by the custodian from the session transcript: the human's typed message, its user record at 2026-11-11T17:25:54.504Z (UTC), which holds it inside a paste wrapper; no queue record holds it. Its text is byte-copied by script from the user record, the paste wrapper stripped. Nothing else is changed; nothing in it names another project. The text below is the ruling.*

---

To the custodian, 2026-11-11.

1. ADR-035, my words for the appended note (adr-035-close-races-note), checked by the gate clause by clause:

## Note 2026-11-11 — what kernel-generation-close-races makes historical

*Appended on the human's ruling. The text above is unchanged, the Status line, the Acceptance section and the Note of 2026-09-25 included.*

1. The close race that the Note of 2026-09-25, item 3, left unsettled is closed by kernel-generation-close-races (#136, merged 2026-09-28). Since that merge only `open_dataset` creates a live generation, through `mint_for_open`. A `viewport_query` racing `close_dataset` no longer mints one: it is refused, as `skp.unknown_dataset`, or by the end's reason if the generation had already ended.
2. Three passages above describe the kernel before that merge and are historical: Decision 3's bullet "A generation with no session reference still emits", since no such generation can now exist and the case the Note of 2026-09-25 gave an unheld reference for no longer arises; Decision 3's sentence that `invalidate` marks the dataset before it looks for a live generation, since it now writes a mark only when it removes a live generation; and Decision 2's "mint-race arm" in `viewport_query`, which is gone, the live-generation check alone refusing.
3. Nothing else changes. Every end still emits at most once, and an end recorded during a close still emits. No wire change.

2. ADR-029, my words for its note (adr-029-stale-line-cites); your table of current lines is filed beside it as a consult, not in the ADR:

## Note 2026-11-11 — this ADR's line cites

*Appended on the human's ruling. The text above is unchanged, and this ADR stays Proposed.*

The line cites in this ADR, into the code, into the admission form at its old path and into SKP-V0.md, were true when it was drafted on 2026-09-14 and have moved since. They are read by what they name (the mint site, the cancel parser, the ticket state, the no-wildcard rule, the cancel states), not by their line numbers. Whoever takes up this decision restates them at that commit.

3. A small governance piece, S3, five-line, after what is queued: the site's "Waiting on you" also lists a node in progress that carries an open question for me, set by you when a running piece stops for my ruling and cleared when I answer. Until it lands, your closing message stays the full list.
