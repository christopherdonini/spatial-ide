Authority: PLAN.yaml node `known-limitations-owed-rows`; night program 2026-09-24 item 6 (`state/directives/2026-09-24-night-program.md`); DECISIONS-PENDING.md "RULED 2026-09-23 (later)" entry 120 item (1)(a); `frontends/shell/MANUAL-WALKTHROUGH.md` Part N row N9.
Scope: `KNOWN-LIMITATIONS.md` only; declared line budget <= 150 non-generated lines.
Change: adds five new rows (items 19-23, N9's five named limitations) to the "On main since v0.1.0" section, revises item 17's third sentence to the consult's declared bound, and brings items 17-18 to the file's house style; nothing else in the file moves.
Tests+mutation: none (a plain-text, declarative document; no code path or assertion is added) -- this piece's own gates are `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify.mjs --offline` and `docsOnly.mjs`, run and recorded in the closing report.
Out-of-scope: no ADR, wire, security or guarantee text; no code; no renumbering of existing items.

Budget: declared <= 150 non-generated lines (KNOWN-LIMITATIONS.md only); this preregistration file is exempt per AUTONOMY.md §21c's enumerated exempt set.
