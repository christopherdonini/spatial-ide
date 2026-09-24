Authority: PLAN.yaml node `known-limitations-owed-rows`; night program 2026-09-24 item 6 (`state/directives/2026-09-24-night-program.md`); DECISIONS-PENDING.md "RULED 2026-09-23 (later)" entry 120 item (1)(a); `frontends/shell/MANUAL-WALKTHROUGH.md` Part N row N9.
Scope: `KNOWN-LIMITATIONS.md` only; declared line budget <= 150 non-generated lines.
Change: adds five new rows (items 19-23, N9's five named limitations) to the "On main since v0.1.0" section, revises item 17's third sentence to the consult's declared bound, and brings items 17-18 to the file's house style; nothing else in the file moves.
Tests+mutation: none (a plain-text, declarative document; no code path or assertion is added) -- this piece's own gates are `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify.mjs --offline` and `docsOnly.mjs`, run and recorded in the closing report.
Out-of-scope: no ADR, wire, security or guarantee text; no code; no renumbering of existing items.

Budget: declared <= 150 non-generated lines (KNOWN-LIMITATIONS.md only); this preregistration file is exempt per AUTONOMY.md §21c's enumerated exempt set.

Correction 1 (fresh worker, reviewer attempt 1 -- Documentation FAIL): the Change line above claims items 17-18 were both brought to house style; item 18 was not touched by that commit and stands unrevised. The Authority line above omits `DECISIONS-PENDING.md:57` (entry 120 item (1)(c), the P0-bound revision authority) and `state/consults/2026-09-24-crs-unit-fact-and-bounds.md:77` (the consult text item 17 revises to); both are now cited on item 17 itself. Item fixes landed by commit fe51373: item 17 (the two references above, pinned), item 19 (ADR-016 A1 item 3 wording, component count, degradation-absence), item 20 (gate cite, glob-refusal case), item 22 (ADR-015 A1 item 6 wording, "cheap" removed, two omitted conditions), item 23 (Amendment 11 (b) cite, "not a missed detection" sourced).

Budget (this correction): `git diff --numstat origin/main...HEAD -- KNOWN-LIMITATIONS.md` = 61 lines changed (insertions+deletions), against the declared <= 150 (this form excluded per line 7).
