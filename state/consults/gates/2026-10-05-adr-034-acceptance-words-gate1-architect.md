# PR #179 gate 1 — architect
Reviewed: docs/adr-034-acceptance-words @ 4ed2b479ab764ec82836fdb3bf72125ab275b23a

**Verdict: pass with notes.** I found nothing under Correctness or Evidence. There are two Documentation and record findings. Under the proportional-gates direction (`state/directives/2026-10-05-product-first-direction.md`, section 2), they are fixed in this PR before the merge, with no re-gate.

## What I checked

- **Append-only (CLAUDE.md; `docs/README.md:27`).**
  - I read the head file's lines 1-201 line by line against main's copy (`C:/dev/spatial-ide`). They are identical.
  - The head adds only lines 202-214: a blank line, the introducing paragraph (203), a blank line, and the fenced block (205-214).
  - Nothing above is rewritten. The Status line, the Decision, "For the human, at acceptance" and the Acceptance bullets are unchanged.
  - Limit: I have no Bash, so I compared that one file only. The reviewer should confirm with `git diff --stat origin/main...4ed2b479` that no other path is touched.
- **The verbatim words (the round 10 rule).**
  - Head lines 206-213 match `state/directives/2026-10-05-adr-034-acceptance.md` lines 6-13 character for character, read side by side.
  - Both spans are pure ASCII, with no CR and no trailing whitespace (checked by grep in both files).
  - There is no elision.
  - The cited sha256, f3a8c75f…9485, is the same value that `DECISIONS-PENDING.md`'s RULED 2026-10-05 ADR-034 block and the merged Acceptance note carry. I cannot recompute it, so the reviewer recomputes it at the reviewed commit.
- **Reproduction is allowed (round 12, clause (b) and its rider).** The human asked for the words verbatim: `state/directives/2026-10-05-product-first-clarification.md:11`. The paragraph marks them as byte-copied by script.
- **The introducing paragraph states facts only.** It names its source (the clarification), the source span and its hash, and that the fence lines are not part of the words. It adds no decision, reading or claim about the ADR's content. Its statement that the bullets stay as they are is true of the diff, and matches Fable's note, item 4 (advice, `state/directives/2026-10-05-fable-note-product-first-2.md:14`).
- **The section agrees with itself.**
  - The Status line says the answers "are recorded in the Acceptance section at the end". That still holds.
  - Each bullet agrees with its numbered item:
    - blockability with the opening line;
    - item 5's "refused by name, as today" with the O1/O2 bullet;
    - items 1-4 and 6, and the closing line, with their bullets.
  - None contradicts the verbatim words.
- **Precedent.** The section follows ADR-035's Acceptance section: a verbatim, script-copied block of the human's words under "Acceptance", with the text above it kept as merged.
- **Rules that do not apply here.** No code, seam, `pub` item, operation class, performance claim or scope addition is involved. None of round 25 item 2's failure conditions applies: there is no §7 form, no `verify-mutation` run, no test-text span and no five-line form.

## Findings (Documentation and record; fix in this PR, no re-gate)

**D1. The note at the top of the section is now literally false.**
- `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:192` (at the reviewed commit) says, byte-copied: "Nothing below is a quotation."
- Line 205 onward is now a quotation, and line 192 cannot be edited (append-only).
- Fix: add a clause to the introducing paragraph that limits that note to the bullets, citing it by section ("the note opening this section"), not by line, per round 14's root-cause rule. For example: the note's statement covers the bullets; the block below is the quotation.

**D2. The hash reference has no commit.**
- Line 203 cites `state/directives/2026-10-05-adr-034-acceptance.md`, lines 6-13, with the sha256 "at the commit that adds it".
- An accepted ADR is append-only (`docs/README.md:27`). So round 15 (e) applies: it needs an explicit `@ <rev>` at a commit on main, written contiguously in the pinned form `path:line-line @ <commit> sha256:<hex>` (round 14; round 15 (d)).
- Fix: replace the parenthesis with `state/directives/2026-10-05-adr-034-acceptance.md:6-13 @ <main commit that adds the file> sha256:f3a8c75f9833edef2853331bd70118b460774b26ceb849d44b7f7587984c9485`. Take the commit from `git log --diff-filter=A --format=%H -- state/directives/2026-10-05-adr-034-acceptance.md`, never typed by hand.
- The merged note at line 192 uses the same commit-less form. It is outside this diff and is not a finding here.

## Missing decision

None; no ADR skeleton is needed.
