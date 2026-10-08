# Directive — reuse archaeology round 1: placement, the ADR-036 findings, three docs pieces, three proposed nodes (the human, verbatim)

*Custodian's filing note (2026-10-08): typed by the human as a new message, received at 15:37:32Z by the transcript. Below the rule, byte-copied by script from the transcript with one final newline added, with nothing else, is the message (from line 6 to the end). The archive it names did not arrive with it: no attachment reached this session, and its sha256 is given as a placeholder. Items 1 and 2 wait for the file; the custodian asked the human for it. It names no other project. It gets a DIRECTIVE block in `DECISIONS-PENDING.md`.*

---
Attached: spatial-ide-reuse-round-1.zip (sha256: <new hash>). Round 1 of the
reuse archaeology, run read-only by the advisor in the cloud. Nothing was built
or run; the claims were independently re-checked.

1. Place it as one docs-and-data piece in slot 2, after #190 has merged and
   after the citation-checker fix. It adds no mod, pilot, trial or record rule.
   Location is yours, but not under docs/ (it contains code, and docs/ is
   CC-BY-4.0).
   - Before the PR: check that it names no other project and holds no
     user-profile path. Run its check-index.mjs and the repository's own
     checkers on it.
   - If verify-cites flags a citation inside the bundle, stop and tell me. No
     checker change, no exemption and no edit to the notes.
   - Do not run fetch-cache.mjs in this piece. The clone cache is never inside
     the repo.
2. Give REUSE-ROUND-1.md §1 "ADR-036" to the architect as findings for my
   acceptance sight of ADR-036. They are not rulings, and they do not hold #190.
   Several change the version-1 file format.
3. Queue as small docs pieces:
   - PLAN node adr-032-decision is stale (ADR-032 was Accepted 2026-09-23);
   - docs/README.md:27 still calls ADR-032 Proposed;
   - docs/08 still calls Overture and OSM extracts "redistributable", which
     conflicts with the #12 ruling. Bring me the proposed sentence; I type it.
4. Propose, for me to place:
   - a reported-only probe of how the bundled DuckDB decodes the Parquet-native
     GEOMETRY column in corpus #11 (the report's corpus section);
   - a notice route for ported code wherever it lands, shell or kernel, needed
     before any PORT.
5. Making "query the index before planning" a standing step is my ruling once
   the freeze lifts. Hold it as a proposed node.

Adopting any dependency named in the bundle stays my typed word.
