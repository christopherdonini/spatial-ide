# Directive — the updated design references tracked in state/drafts/design/; the 2026-09-28 layer decisions filed as a ruling (the human, verbatim)

*Custodian's filing note (2026-09-29): the second part of the human's message received at about 18:02Z. Fable's part of the same message is filed as `state/directives/2026-09-29-fable-amendment-12-sighted-and-ruled-backfill.md`. Recorded verbatim below the rule, copied from the message as received, with CRLF line endings normalised to LF. The profile root it names is already in token form. Cited as "the 2026-09-29 design-references directive" with its item numbers.*

---

The human, 2026-09-29: track the updated design references in state/drafts/design/, and file my
2026-09-28 layer decisions as a ruling.

1. Copy these four files from the human's prototype folder (`%USERPROFILE%/Development/Claude/Spatial
   IDE/prototype/`). First check each source's sha256; a mismatch means stop and ask.
   - SPATIAL-IDE-DESIGN-NOTEBOOK.md: bb79f4487bb6bfa186fc208e3632905df85fae4ebef29ff0ee48bd610a0bb5cc
     (replaces the tracked 2026-09-25 copy in place; it's a current-state design reference)
   - RESEARCH-BATCHES-08-10.md: 2f7d3a7f55140a467b5ec00e665c7dbdbf0c7cdffe044b1703852f892b9e8583
   - RESEARCH-BATCHES-11-13.md: f962a21cc3be4d0e8a4a2c691c1b447deb8edaf26746791d24f561b5e9e4c57b
   - LAYER-MODEL-DECISIONS-2026-09-28.md: 8d8c1cdb1ace57b09b76b0e6dbe74225cb28770ae7b2b92bcbaa3fdc493f2688
   map-studio-v7-codex.html is unchanged (its source sha256 matches the tracked copy's header), so don't
   touch it.

2. Two mechanical transformations only. Record both in each file's header, and make them reproducible
   from the source bytes:
   (a) A link whose target is one of the files tracked together in state/drafts/design/ becomes
       relative (`./<filename>`). That's five links: the notebook's links to v7 and to the two research
       files, and RESEARCH-BATCHES-08-10's link to the notebook.
   (b) The existing `--redact` pass over everything else. The only remaining case is the notebook's
       Desktop link, which becomes %USERPROFILE%.
   Each file gets the same kind of header as the existing copies: "Design reference, not Authority", the
   source sha256, the date, this directive, and the two transformations. Nothing else changes.

3. File my 2026-09-28 answers as a ruling. They're quoted verbatim in
   LAYER-MODEL-DECISIONS-2026-09-28.md §3, and sending this paste confirms that quote is mine. File a
   directive under state/directives/, plus a dated RULED block in DECISIONS-PENDING (§105), quoting
   my words only.

4. PLAN node shell-redesign-map-studio: add the decisions file as an input to the migration plan, which
   Fable writes after O-07. It changes no status or order.

5. Run the exposure scan with its canary before committing, then commit, push, and refresh the
   continuity block.
