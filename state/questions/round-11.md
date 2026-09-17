Question round 11 — 2026-09-17 (custodian → human). Four items: three from the quote checker's gates (DECISIONS-PENDING entry 102) and the directive's persistent edits. Status beside them: #84 red on a fixture-regeneration race (a fresh Sonnet worker is fixing it, tests only); P3b merging main before attempt 3; verify-quotes attempt 1 FAIL/FAIL on correctable findings, fix round running.

1. The baseline. Built, verify-quotes finds 17 passages on main that do not match their named source; both gates read every entry: ~10 unfindable by construction (session logs, gitignored e2e output, a consult's text, a runtime template), 1 a tool false trigger, 2 honest elisions/drift in a rolling ledger file, 2 re-typed quote glyphs in binding ruling text (to be corrected by appending in P3b's record round, not baselined), 1 in an accepted ADR (an appended note owed). None waives a substantive misquote of binding text. The instrument is a committed baseline printed as advisory every run, matched by file + line + words, unmatched entries reported, new mismatches still FAIL — a ratchet, not a waiver; the entries are the worker's classification pending your sight.
Options:
  1. Accept the baseline as a ratchet on those terms, its 17 entries listed in the PR body for your click (Recommended).
  2. No baseline: every offender corrected first by appended notes across two ADRs and five preregistrations before the check can gate CI.
  3. Hold.

---

2. The rule vs the tool. Your rule says "byte-for-byte"; the tool normalizes presentation (whitespace, emphasis pairs, comment prefixes, quote glyphs, dashes) and, for a quote with no path:line beside it, proves only that the words occur in the tree's non-quotation text — a floor, not source attribution. The architect's clause for both checklists: "verify:quotes green does not discharge this rule — the gate resolves each verbatim passage against its named source; the check is a floor, not the proof."
Options:
  1. Adopt the clause as written (Recommended).
  2. Tighten the tool instead to require the named source for every quote — it would red-line the corpus (rulings are cited by round and item, not by path); a design change past the piece.
  3. Hold.

---

3. Elisions. Read literally, "byte-for-byte" fails an honest quotation that marks an omission with an ellipsis. Proposed clause: "an elision marked … is honest quotation; each retained span must match byte-for-byte."
Options:
  1. Adopt (Recommended).
  2. No elisions in verbatim quotes — whole sentences, or label a paraphrase.
  3. Hold.

---

4. The directive's persistent edits, for approval (proposed on the 17th, not applied): (i) the worker and tester briefs' report formats gain one line for the model observed, any override with its reason, and any context handoff, plus the four-class pre-gate self-check as a required report item; (ii) one AI_DEVELOPMENT.md bullet pointing at the recorded directive with the operating rule in five lines. (The third proposal, a cite-content advisory in verify-cites, is superseded by verify-quotes --show-cites.)
Options:
  1. Approve both (Recommended).
  2. Approve (i) only.
  3. Hold.
