# Governance piece D: finished nodes' summaries out of PLAN.yaml into state/cut-archive/, with its rule for AUTONOMY; the 2026-10-14 sentence on the PLAN.yaml summary trim corrected — the human, verbatim

*Custodian's filing note (2026-10-20): the human's own message, received at 2026-10-20T20:19:23Z by the transcript (its queued-message record, sent while the custodian was working); named by that UTC date. Below the rule, from line 6 to line 29, is the text the human pasted, byte-copied by script from inside its paste markers. After one blank line, from line 31 to the end, is the addendum the human typed after the paste, byte-copied, its three leading newlines replaced by that one blank line. One final newline is added and nothing else is changed. It names no other project. The custodian checked its figures at b2433b78 by script: PLAN.yaml is 690,693 bytes by `git cat-file -s`, and by the repository's yamlSubset parser 151 of the 193 done nodes have a summary over 300 UTF-8 bytes.*

---
Governance piece D: finished nodes' summaries out of PLAN.yaml, the way C took old rulings out of DECISIONS-PENDING.md. It goes in the governance lane after what is already queued there and never holds slot 1. My words here are the authority for the rule it adds; append that rule to AUTONOMY. The merge is my click.

A correction first. My 2026-10-14 sentence "The PLAN.yaml summary trim stands as already placed" was wrong. No trim was ever placed, and PLAN.yaml has grown from 486,929 bytes on 2026-10-10 to 690,693 at b2433b78. D replaces that trim.

1. Scope: only nodes whose status is done and whose summary is over 300 UTF-8 bytes (151 of 193 at b2433b78). Nodes that are proposed, unscheduled, blocked or in progress are not touched, because their summaries now carry obligations.
2. The move: a named script copies each such summary verbatim into state/cut-archive/PLAN-SUMMARIES-<date>.yaml, keyed by node id, and replaces it in PLAN.yaml with one generated line naming that file. No hand-written words. Show that:
   - each archived string, once parsed, equals the summary it replaced;
   - only those summary lines change: every other line of PLAN.yaml is byte-identical and the line count is unchanged, so unpinned PLAN.yaml:<line> cites still land on the same node;
   - the archive is YAML, so verify-cites and verify-quotes cover exactly what they cover today (neither scans PLAN.yaml);
   - the queue and the site are regenerated in the same PR, and every existing check gives the same results before and after.
3. Obligations: before the move, the form lists every summary to be moved that names something still owed (the form fixes the markers). Each one is shown to have a live home: an open PLAN node, an open DECISIONS-PENDING entry or a KNOWN-LIMITATIONS item. A summary whose obligation has no home stays where it is until one is placed.
4. Further rotations: the same script on the first of each month, alongside C's rotation, at the start of a session and never inside a hook. Each rotation writes a new archive file. Archive files are never edited. Running it again on a rotated PLAN.yaml changes nothing.
5. Negative tests:
   - an open node over 300 bytes is never moved;
   - a finished node's summary of 300 bytes or less is never moved;
   - a second run changes nothing;
   - a round-trip mismatch, a duplicate id or an id missing from PLAN.yaml refuses the whole run and writes nothing.
6. The rule, for AUTONOMY and scripts/plan/README.md: a node's summary states its current state and what is owed. When a node is done, its history belongs in its form's closing record and the ledger. The monthly rotation moves what is left. Old summaries are searched by id in state/cut-archive/, by A's rule for excluded locations.
7. Measurements: before D, at the main commit its branch starts from; after D, at its merge commit. Each figure is taken twice and must be byte-identical, as in C's Amendment 9:
   - PLAN.yaml's bytes, by git cat-file -s;
   - the search corpus, by measure-reads.mjs corpus, unchanged;
   - the routine read, by measure-reads.mjs routine, recorded although PLAN.yaml is not part of it.

Out of scope: one file per PLAN node, the CI-built site and the gate log's format. I decide those after D's measurement.

Addendum to piece D.
The round-trip check and the archive use the repository's yamlSubset parser, the one that reads PLAN.yaml. A summary written as a block scalar refuses the run. The pointer line carries a fixed marker the script recognizes and skips, and is under 300 bytes. The form names what queue.mjs, site.mjs, buildHealth.mjs and questions-mirror.mjs read from a done node's summary, shows each one's output before and after, and records any difference as the piece's own. The corpus figure is expected to fall by the moved bytes, because the archive leaves rg --files under .ignore.
