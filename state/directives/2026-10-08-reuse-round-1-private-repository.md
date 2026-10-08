# Directive — reuse archaeology round 1 lives in a private repository: clone and check it, copy nothing into this repository (the human, verbatim)

*Custodian's filing note (2026-10-08): typed by the human as a new message, received mid-turn at 17:10:40Z by the transcript (its queued-command record, origin human). Below the rule, byte-copied by script from that record with one final newline added, with nothing else, is the message (from line 6 to the end). It replaces item 1 of `state/directives/2026-10-08-reuse-round-1.md` and the placement of `state/directives/2026-10-08-reuse-round-1-v2.md`: the research is read from the human's private repository, and nothing from it is copied into this one. Items 2 to 5 and the dependency sentence restate the first direction. It names no other project. It gets a DIRECTIVE block in `DECISIONS-PENDING.md`.*

---
The reuse archaeology, Round 1, lives in a private repository of mine:
christopherdonini/spatial-ide-reuse, branch main, commit
89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c. It was run read-only by the advisor
in the cloud. Nothing was built or run, and no dependency was added.

1. Clone it beside this checkout, outside every repository you work in, and
   check out that commit. Run "sha256sum -c SHA256SUMS" and
   "node tools/check-index.mjs" there, and tell me if either fails.
   - You read that repository; you never commit to it. The researcher writes it.
   - Do not run tools/fetch-cache.mjs for now.
   - Copy nothing from it into this repository. A form may quote a finding it
     needs, cited by repository, commit and path.
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
