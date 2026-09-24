# Consult — ADR-035's acceptance texts (2026-09-24)

These are the architect's drafts for the docs piece that question round 21, item 1 (a red line, answered in typed text) calls for after PR #114 merges. Filed by the custodian from the architect's hand-back.
- The three texts are the architect's, inside the fences.
- The custodian byte-copies the human's words by script into the placeholder.
- Both gates read the piece.

## Rider-letter collision (the architect's note)

ADR-035's Status line and its Decisions 2 and 4 already use "riders (a) and (b)" for round 17 item 2's riders. Round 21 item 1's riders are also lettered (a), (b) and (c). Each text below says which round's riders it means.

## 1. ADR-035's new Status line (replaces the ADR's `**Status:**` line; one line)

```
**Status:** Accepted 2026-09-24 — on the human's word, as merged, with Decision 4's reading confirmed under a rider (`DECISIONS-PENDING.md`, RULED 2026-09-24 — question round 21, item 1; a red line, answered in typed text); the Acceptance section below records the human's words verbatim. History: filed Proposed 2026-09-24 on the human's ruling (`DECISIONS-PENDING.md`, RULED 2026-09-24 — question round 17, item 2), binding nothing and not architect-blockable until this acceptance. Riders (a) and (b) of that round-17 ruling bind the watcher's preregistration through the ruling itself, whatever this ADR's status, as does the emission point RULED 2026-09-24 — question round 19, item 1 fixes; round 21 item 1's riders are its own, recorded in the Acceptance section.
```

## 2. The Acceptance section (appended after the ADR's last line, one blank line before)

```
## Acceptance

**Accepted 2026-09-24, as merged** (appended at acceptance; the text above, its section "For the human, at acceptance" included, is retained as merged). The ruling is `DECISIONS-PENDING.md`, RULED 2026-09-24 — question round 21, item 1 (a red line, answered in typed text). The human's words are recorded verbatim below, byte-copied by script from that item and marked so.

[VERBATIM: round 21 item 1's typed answer]

Round 21 item 1's riders (a) and (b), which are not round 17 item 2's riders of the same letters, bind the watcher's preregistration (PLAN node `engine-source-change-watcher`) through the ruling itself. Its rider (c) is the note appended to `protocol/skp/SKP-V0.md` §8 after the `skp/0.4` entry, headed as a note to the `skp/0.3` entry and dated 2026-09-24.
```

**Filling the placeholder.** Copy only the span inside the bold quotation marks of round 21 item 1's RULED text. Put any wrapper, for example ADR-033's `*"…"*`, outside the copied span. Reproduction is allowed because the section exists to record the acceptance; ADR-033's Acceptance section is the precedent.

## 3. The SKP-V0 §8 note (appended at the end of §8, which is the end of the file, after the `skp/0.4` entry's last line, one blank line before)

```
### Note to the `skp/0.3` entry: per-open references and generation values (2026-09-24)

**Appended 2026-09-24 on the human's ruling** (`DECISIONS-PENDING.md`, RULED 2026-09-24 —
question round 21, item 1, its rider (c)). The `skp/0.3` entry above is unchanged, and its rule
that no generation value crosses the wire (that entry's paragraph on what the version deliberately
does not add) stands as written; this note clarifies the rule in writing and does not reinterpret
it.

A per-open opaque reference is distinguished from a generation value only on every condition the
ruling states (paraphrased here; the ruling's words govern):

- it is opaque, minted per open and non-authorising, and it reveals no more than the
  `DatasetHandle` already on the wire;
- it never does a generation value's job: batch and ticket attribution stays with the ticket, and
  the reference is used only to route the ended-session event to its open (the ruling's
  rider (a));
- it is never persisted or published, and the recipe and bundle leakage tests that forbid a
  generation value name it too (the ruling's rider (b)).

The reference the ruling names is the session reference of
`docs/adr/ADR-035-dataset-session-ended-control-plane-event.md` Decision 4, which the watcher
piece introduces on `skp/0.5` (that ADR's Decision 6). A reference that fails any condition gets no
clarification from this note.
```

**Placement.** At the end of the file:
- §8 is append-only;
- an insertion between entries would shift the lines below it;
- the `###` heading keeps the note from reading as part of `skp/0.4`.

In the PR record, give the placement by section, never by line.

## 4. The ADR index row

The row changes, because `adrIndex.mjs` copies the Status field. Regenerate it with `npm run adr-index`, then check it with `npm run verify:adr-index`, both in `frontends/shell`. No drafted text starts a line with `**Status:**` except the Status line itself.

## 5. Nothing else in this piece

- There is no code, no `SKP_VERSION` change and no fixture.
- The watcher piece carries the rest:
  - round 21 item 1's riders (a) and (b);
  - the extended leakage tests;
  - §3's minting rule and the reference's row;
  - the `skp/0.5` entry.
